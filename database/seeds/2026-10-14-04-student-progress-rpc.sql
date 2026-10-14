-- Student dashboard aggregation (2026-10-14), migration "student_progress_rpc".
--
-- All dashboard numbers are computed here, not in the browser or in route
-- code: get_student_progress() and get_student_streaks() each return one
-- plain jsonb object the page renders as-is.
--
-- Both are SECURITY INVOKER (the default). Called through lib/db/rls.ts they
-- run as ashphys_user, so row-level security on question_attempts /
-- activity_events applies on top of the explicit check below: even a bug
-- that passed another student's id would only ever see the caller's rows.
--
-- Days are Europe/Istanbul calendar days (UTC+3 all year since 2016), not
-- UTC: an answer at 00:30 Istanbul time counts for that Istanbul day.
--
-- Idempotent (CREATE OR REPLACE).

-- Refuse to aggregate anyone but the caller, unless the caller is an admin.
CREATE OR REPLACE FUNCTION app_assert_can_read_student(p_student_id uuid) RETURNS void
LANGUAGE plpgsql STABLE
AS $$
BEGIN
  IF p_student_id IS NULL
     OR (p_student_id IS DISTINCT FROM app_current_user_id() AND NOT app_is_admin()) THEN
    RAISE EXCEPTION 'not allowed to read another student''s progress' USING ERRCODE = '42501';
  END IF;
END
$$;

-- Distinct local calendar days with at least one meaningful activity:
-- a question attempt, a lesson view or a video view.
CREATE OR REPLACE FUNCTION student_study_days(p_student_id uuid, p_tz text DEFAULT 'Europe/Istanbul')
RETURNS TABLE (day date)
LANGUAGE sql STABLE
AS $$
  SELECT DISTINCT (s.ts AT TIME ZONE p_tz)::date AS day
  FROM (
    SELECT attempted_at AS ts FROM question_attempts WHERE student_id = p_student_id
    UNION ALL
    SELECT created_at FROM activity_events WHERE student_id = p_student_id
  ) s
  ORDER BY 1
$$;

-- Current and longest run of consecutive study days. A streak is still
-- alive when the last study day is today or yesterday (local time), so a
-- student who studied yesterday hasn't lost it before they log in today.
-- p_now is a parameter so tests can pin "today".
CREATE OR REPLACE FUNCTION get_student_streaks(
  p_student_id uuid,
  p_now timestamptz DEFAULT now(),
  p_tz text DEFAULT 'Europe/Istanbul'
) RETURNS jsonb
LANGUAGE plpgsql STABLE
AS $$
DECLARE
  v_today date := (p_now AT TIME ZONE p_tz)::date;
  v_result jsonb;
BEGIN
  PERFORM app_assert_can_read_student(p_student_id);

  WITH days AS (
    SELECT d.day FROM student_study_days(p_student_id, p_tz) d WHERE d.day <= v_today
  ),
  islands AS (
    -- Consecutive days share (day - row_number): the gaps-and-islands trick.
    SELECT d.day, d.day - (row_number() OVER (ORDER BY d.day))::int AS grp FROM days d
  ),
  runs AS (
    SELECT max(i.day) AS end_day, count(*)::int AS len FROM islands i GROUP BY i.grp
  )
  SELECT jsonb_build_object(
    'current_streak', COALESCE((SELECT r.len FROM runs r WHERE r.end_day >= v_today - 1 ORDER BY r.end_day DESC LIMIT 1), 0),
    'longest_streak', COALESCE((SELECT max(r.len) FROM runs r), 0),
    'study_days', (SELECT count(*) FROM days)::int,
    'last_study_day', (SELECT max(d.day) FROM days d),
    'studied_today', EXISTS (SELECT 1 FROM days d WHERE d.day = v_today),
    'today', v_today,
    'timezone', p_tz
  ) INTO v_result;

  RETURN v_result;
END
$$;

-- Totals, per-chapter and per-lesson accuracy, and strengths/weaknesses.
--
-- Ranking rules (see PROJECT_STATUS.md "Decisions"):
--   * a chapter is ranked only once it has >= p_min_attempts attempts;
--   * at least 2 ranked chapters are needed before anything is labelled;
--   * strengths = the top min(2, ceil(n/2)), weaknesses = the bottom
--     min(2, n - strengths), so one chapter is never both, and with n >= 4
--     it is exactly "top 2 / bottom 2";
--   * ties: accuracy, then more attempts first, then chapter number.
CREATE OR REPLACE FUNCTION get_student_progress(
  p_student_id uuid,
  p_min_attempts integer DEFAULT 5,
  p_tz text DEFAULT 'Europe/Istanbul'
) RETURNS jsonb
LANGUAGE plpgsql STABLE
AS $$
DECLARE
  v_result jsonb;
BEGIN
  PERFORM app_assert_can_read_student(p_student_id);

  WITH att AS (
    SELECT qa.lesson_id, COALESCE(t.chapter_id, qa.chapter_id) AS chapter_id, qa.is_correct
    FROM question_attempts qa
    LEFT JOIN topics t ON t.id = qa.lesson_id
    WHERE qa.student_id = p_student_id
  ),
  lesson_stats AS (
    SELECT a.chapter_id, a.lesson_id, t.topic_name AS lesson_name,
           count(*)::int AS attempted,
           (count(*) FILTER (WHERE a.is_correct))::int AS correct,
           round((count(*) FILTER (WHERE a.is_correct))::numeric / count(*), 4) AS accuracy
    FROM att a
    LEFT JOIN topics t ON t.id = a.lesson_id
    GROUP BY a.chapter_id, a.lesson_id, t.topic_name
  ),
  chapter_stats AS (
    SELECT ls.chapter_id, c.title, c.chapter_number, co.code AS course_code,
           sum(ls.attempted)::int AS attempted,
           sum(ls.correct)::int AS correct,
           round(sum(ls.correct)::numeric / sum(ls.attempted), 4) AS accuracy
    FROM lesson_stats ls
    LEFT JOIN chapters c ON c.id = ls.chapter_id
    LEFT JOIN courses co ON co.id = c.course_id
    GROUP BY ls.chapter_id, c.title, c.chapter_number, co.code
  ),
  eligible AS (
    SELECT cs.*,
           row_number() OVER (ORDER BY cs.accuracy DESC, cs.attempted DESC, cs.chapter_number, cs.chapter_id) AS best_rank,
           row_number() OVER (ORDER BY cs.accuracy ASC, cs.attempted DESC, cs.chapter_number, cs.chapter_id) AS worst_rank,
           count(*) OVER () AS n
    FROM chapter_stats cs
    WHERE cs.chapter_id IS NOT NULL AND cs.attempted >= p_min_attempts
  ),
  labelled AS (
    SELECT e.*,
           CASE WHEN e.n >= 2 AND e.best_rank <= least(2, ceil(e.n / 2.0)) THEN 'strength'
                WHEN e.n >= 2 AND e.worst_rank <= least(2, e.n - least(2, ceil(e.n / 2.0))) THEN 'weakness'
           END AS label
    FROM eligible e
  ),
  weakest_lesson AS (
    SELECT DISTINCT ON (ls.chapter_id) ls.chapter_id, ls.lesson_id, ls.lesson_name, ls.attempted, ls.accuracy
    FROM lesson_stats ls
    WHERE ls.lesson_id IS NOT NULL
    ORDER BY ls.chapter_id, ls.accuracy ASC, ls.attempted DESC, ls.lesson_name
  ),
  visited AS (
    SELECT lesson_id FROM activity_events WHERE student_id = p_student_id AND lesson_id IS NOT NULL
    UNION
    SELECT lesson_id FROM att WHERE lesson_id IS NOT NULL
  )
  SELECT jsonb_build_object(
    'student_id', p_student_id,
    'min_attempts_to_rank', p_min_attempts,
    'totals', jsonb_build_object(
      'attempted', COALESCE((SELECT sum(attempted) FROM chapter_stats), 0)::int,
      'correct', COALESCE((SELECT sum(correct) FROM chapter_stats), 0)::int,
      'accuracy', (SELECT round(sum(correct)::numeric / NULLIF(sum(attempted), 0), 4) FROM chapter_stats),
      'lessons_visited', (SELECT count(*) FROM visited)::int,
      'study_days', (SELECT count(*) FROM student_study_days(p_student_id, p_tz))::int
    ),
    'chapters', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
               'chapter_id', cs.chapter_id,
               'title', cs.title,
               'chapter_number', cs.chapter_number,
               'course_code', cs.course_code,
               'attempted', cs.attempted,
               'correct', cs.correct,
               'accuracy', cs.accuracy,
               'ranked', cs.chapter_id IS NOT NULL AND cs.attempted >= p_min_attempts,
               'lessons', (
                 SELECT jsonb_agg(jsonb_build_object(
                          'lesson_id', ls.lesson_id,
                          'lesson_name', ls.lesson_name,
                          'attempted', ls.attempted,
                          'correct', ls.correct,
                          'accuracy', ls.accuracy)
                        ORDER BY ls.lesson_name NULLS LAST)
                 FROM lesson_stats ls
                 WHERE ls.chapter_id IS NOT DISTINCT FROM cs.chapter_id
               ))
             ORDER BY (cs.course_code = '0625') DESC NULLS LAST, cs.course_code NULLS LAST, cs.chapter_number NULLS LAST)
      FROM chapter_stats cs
    ), '[]'::jsonb),
    'strengths', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
               'chapter_id', l.chapter_id, 'title', l.title, 'chapter_number', l.chapter_number,
               'course_code', l.course_code, 'attempted', l.attempted, 'accuracy', l.accuracy)
             ORDER BY l.best_rank)
      FROM labelled l WHERE l.label = 'strength'
    ), '[]'::jsonb),
    'weaknesses', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
               'chapter_id', l.chapter_id, 'title', l.title, 'chapter_number', l.chapter_number,
               'course_code', l.course_code, 'attempted', l.attempted, 'accuracy', l.accuracy,
               'weakest_lesson', CASE WHEN w.lesson_id IS NULL THEN NULL ELSE jsonb_build_object(
                 'lesson_id', w.lesson_id, 'lesson_name', w.lesson_name,
                 'attempted', w.attempted, 'accuracy', w.accuracy) END)
             ORDER BY l.worst_rank)
      FROM labelled l
      LEFT JOIN weakest_lesson w ON w.chapter_id = l.chapter_id
      WHERE l.label = 'weakness'
    ), '[]'::jsonb)
  ) INTO v_result;

  RETURN v_result;
END
$$;

GRANT EXECUTE ON FUNCTION app_assert_can_read_student(uuid) TO ashphys_user;
GRANT EXECUTE ON FUNCTION student_study_days(uuid, text) TO ashphys_user;
GRANT EXECUTE ON FUNCTION get_student_streaks(uuid, timestamptz, text) TO ashphys_user;
GRANT EXECUTE ON FUNCTION get_student_progress(uuid, integer, text) TO ashphys_user;
