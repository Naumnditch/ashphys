-- Student activity log for streaks (2026-10-14), migration "activity_events".
--
-- Question attempts are NOT duplicated here: practice_attempts (2026-09-22)
-- already records every answer a student submits and stays the source of
-- truth. This table only adds the activity practice_attempts can't see:
-- opening a lesson page and watching a video.
--
-- analytics_events was not reused: it also holds anonymous traffic, its
-- lesson_view fires once per topic LISTED on a chapter page (not a real
-- visit), and it is due a 12-month prune — none of which suits a streak.
--
-- Additive and idempotent.

CREATE TABLE IF NOT EXISTS activity_events (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type       text NOT NULL CONSTRAINT activity_events_type_check CHECK (type IN ('lesson_view', 'video_view')),
  lesson_id  uuid REFERENCES topics(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_events_student_created ON activity_events (student_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_practice_attempts_student_created ON practice_attempts (student_id, created_at DESC);

ALTER TABLE activity_events ENABLE ROW LEVEL SECURITY;

-- The spec's "question_attempts" shape, as a view over the real attempt log.
-- security_invoker makes practice_attempts' row-level security apply to
-- whoever queries the view, instead of the view owner (who bypasses it).
CREATE OR REPLACE VIEW question_attempts WITH (security_invoker = true) AS
SELECT a.id,
       a.student_id,
       a.problem_id AS question_id,
       a.topic_id   AS lesson_id,
       a.chapter_id,
       a.is_correct,
       a.created_at AS attempted_at
FROM practice_attempts a;
