-- Handwritten worked solutions per practice question (2026-10-28),
-- migration "question_handwriting".
--
-- The admin handwrites a worked solution on a canvas next to each practice
-- question. The strokes are stored as vector data (doc), and the server
-- renders an SVG snapshot of every page on each save (snapshots) plus a
-- small teaser of page 1 (preview) for viewers who are out of solution views.
--
-- Who may do what is enforced here, under the same scheme as
-- 2026-10-14-03-student-rls.sql: the app runs these queries through
-- withRlsContext (lib/db/rls.ts), i.e. as the NOLOGIN role ashphys_user with
-- app.user_id set from the server-verified session.
--   * admins (users.role = 'admin') read and write everything;
--   * a student reads a row only once they have answered that question
--     incorrectly at least once (a practice_attempts row with is_correct =
--     false), and can never write;
--   * Supabase's anon/authenticated roles get nothing.
-- The tier gate (Free/Plus view caps, Pro unlimited) is applied on top by the
-- API, through the same lib/solutions/access.ts gate as interactive solutions;
-- solution_access_log gains problem_id so those views are logged and counted
-- the same way.
--
-- Independent of migrations 2026-10-14-01..06: it creates the role and the two
-- helper functions itself, with exactly the definitions migration 03 uses, so
-- either can run first. Additive and idempotent (safe to run twice).

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ashphys_user') THEN
    CREATE ROLE ashphys_user NOLOGIN NOINHERIT;
  END IF;
END
$$;

-- On Postgres 16+ a non-superuser that creates a role gets ADMIN on it but
-- not SET, so the connecting role has to grant itself SET explicitly.
GRANT ashphys_user TO CURRENT_USER WITH INHERIT FALSE, SET TRUE;

GRANT USAGE ON SCHEMA public TO ashphys_user;

-- Same definitions as migration 03.
CREATE OR REPLACE FUNCTION app_current_user_id() RETURNS uuid
LANGUAGE sql STABLE
AS $$ SELECT nullif(current_setting('app.user_id', true), '')::uuid $$;

CREATE OR REPLACE FUNCTION app_is_admin() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users WHERE id = app_current_user_id() AND role = 'admin'::user_role
  )
$$;

REVOKE ALL ON FUNCTION app_is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app_current_user_id() TO ashphys_user;
GRANT EXECUTE ON FUNCTION app_is_admin() TO ashphys_user;

-- Has the caller answered this question incorrectly at least once?
-- SECURITY DEFINER so the policy works whether or not practice_attempts has
-- its own ashphys_user policies yet (migration 03 adds them).
CREATE OR REPLACE FUNCTION app_answered_incorrectly(question uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM practice_attempts
    WHERE student_id = app_current_user_id() AND problem_id = question AND is_correct = false
  )
$$;

REVOKE ALL ON FUNCTION app_answered_incorrectly(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app_answered_incorrectly(uuid) TO ashphys_user;

-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS question_handwriting (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- "Lesson" = topics row, "question" = problems row (as everywhere else).
  lesson_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  -- Vector strokes: { v, pages: [{ id, background, strokes: [{ id, tool, shape?,
  -- color, width, opacity, pressure, points: [[x, y, pressure], ...] }] }] }.
  -- A stroke's page index is its page's position in pages[]. Coordinates are
  -- in a fixed logical space (CSS px at 100% zoom); zoom/pan never touch them.
  doc jsonb NOT NULL,
  -- Server-rendered SVG per non-empty page: [{ width, height, body }].
  snapshots jsonb NOT NULL DEFAULT '[]'::jsonb,
  -- Teaser of the top of page 1 for viewers who are out of views ({ width, height, body } or null).
  preview jsonb,
  page_count integer NOT NULL DEFAULT 0 CHECK (page_count >= 0),
  -- 0 = cleared: students see no solution.
  stroke_count integer NOT NULL DEFAULT 0 CHECK (stroke_count >= 0),
  -- Bumped on every save; the editor sends the version it loaded so a save
  -- from a stale tab or device is refused instead of overwriting newer work.
  version integer NOT NULL DEFAULT 1 CHECK (version >= 1),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT question_handwriting_lesson_question_key UNIQUE (lesson_id, question_id),
  CONSTRAINT question_handwriting_doc_is_object CHECK (jsonb_typeof(doc) = 'object'),
  CONSTRAINT question_handwriting_snapshots_is_array CHECK (jsonb_typeof(snapshots) = 'array')
);

CREATE INDEX IF NOT EXISTS idx_question_handwriting_question ON question_handwriting(question_id);

ALTER TABLE question_handwriting ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON question_handwriting TO ashphys_user;

DROP POLICY IF EXISTS question_handwriting_read ON question_handwriting;
CREATE POLICY question_handwriting_read ON question_handwriting FOR SELECT TO ashphys_user
  USING (app_is_admin() OR app_answered_incorrectly(question_id));
DROP POLICY IF EXISTS question_handwriting_admin_insert ON question_handwriting;
CREATE POLICY question_handwriting_admin_insert ON question_handwriting FOR INSERT TO ashphys_user
  WITH CHECK (app_is_admin());
DROP POLICY IF EXISTS question_handwriting_admin_update ON question_handwriting;
CREATE POLICY question_handwriting_admin_update ON question_handwriting FOR UPDATE TO ashphys_user
  USING (app_is_admin()) WITH CHECK (app_is_admin());
DROP POLICY IF EXISTS question_handwriting_admin_delete ON question_handwriting;
CREATE POLICY question_handwriting_admin_delete ON question_handwriting FOR DELETE TO ashphys_user
  USING (app_is_admin());

-- Supabase grants new public tables and functions to anon/authenticated by
-- default privileges. RLS with no policy for them already returns nothing;
-- this removes the grants as well. (Those roles only exist on Supabase.)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON question_handwriting FROM anon;
    REVOKE ALL ON FUNCTION app_answered_incorrectly(uuid) FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON question_handwriting FROM authenticated;
    REVOKE ALL ON FUNCTION app_answered_incorrectly(uuid) FROM authenticated;
  END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- Handwritten-solution views share the interactive solutions' gate: one row
-- per view/block/upgrade click, against the question instead of a solution.
ALTER TABLE solution_access_log ADD COLUMN IF NOT EXISTS problem_id uuid REFERENCES problems(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_access_log_user_problem ON solution_access_log(user_id, problem_id) WHERE problem_id IS NOT NULL;
