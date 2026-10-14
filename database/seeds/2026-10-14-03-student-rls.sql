-- Row-level security that actually applies (2026-10-14), migration "student_rls".
--
-- Background (PROJECT_STATUS.md, 2026-09-22): every table has RLS enabled
-- with zero policies, and the app connects as the table owner `postgres`,
-- which bypasses RLS. There is no Supabase Auth, so auth.uid() is always
-- null and a policy written against it protects nothing.
--
-- So the app now opts in per request: lib/db/rls.ts opens a transaction,
-- runs `SET LOCAL ROLE ashphys_user` (a NOLOGIN role that is NOT the
-- owner, so policies apply) and `set_config('app.user_id', <id>, true)`
-- from the server-verified session. Everything below is written against
-- that role and that setting. Queries that still run as the owner are
-- unaffected, so nothing existing changes behaviour.
--
-- Additive and idempotent (policies are dropped and recreated by name).

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

-- Already on in production (every table has RLS enabled); repeated so the
-- policies below can never silently be inert on a fresh database.
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE practice_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_events ENABLE ROW LEVEL SECURITY;

-- Who is asking: the id the app put in the transaction, or null.
CREATE OR REPLACE FUNCTION app_current_user_id() RETURNS uuid
LANGUAGE sql STABLE
AS $$ SELECT nullif(current_setting('app.user_id', true), '')::uuid $$;

-- Admin is read from users.role, never from a client-settable value.
-- SECURITY DEFINER so ashphys_user needs no access to the users table.
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

-- ---------------------------------------------------------------------------
-- Catalogue tables the dashboard joins to: readable, never writable.
-- Policies are scoped TO ashphys_user, so anon/authenticated (Supabase's
-- REST roles) still see nothing, exactly as before.
GRANT SELECT ON topics, chapters, courses TO ashphys_user;
DROP POLICY IF EXISTS ashphys_user_read ON topics;
CREATE POLICY ashphys_user_read ON topics FOR SELECT TO ashphys_user USING (true);
DROP POLICY IF EXISTS ashphys_user_read ON chapters;
CREATE POLICY ashphys_user_read ON chapters FOR SELECT TO ashphys_user USING (true);
DROP POLICY IF EXISTS ashphys_user_read ON courses;
CREATE POLICY ashphys_user_read ON courses FOR SELECT TO ashphys_user USING (true);

-- ---------------------------------------------------------------------------
-- lesson_videos: everyone reads published rows; admins read and write all.
GRANT SELECT, INSERT, UPDATE, DELETE ON lesson_videos TO ashphys_user;
DROP POLICY IF EXISTS lesson_videos_read ON lesson_videos;
CREATE POLICY lesson_videos_read ON lesson_videos FOR SELECT TO ashphys_user
  USING (is_published OR app_is_admin());
DROP POLICY IF EXISTS lesson_videos_admin_insert ON lesson_videos;
CREATE POLICY lesson_videos_admin_insert ON lesson_videos FOR INSERT TO ashphys_user
  WITH CHECK (app_is_admin());
DROP POLICY IF EXISTS lesson_videos_admin_update ON lesson_videos;
CREATE POLICY lesson_videos_admin_update ON lesson_videos FOR UPDATE TO ashphys_user
  USING (app_is_admin()) WITH CHECK (app_is_admin());
DROP POLICY IF EXISTS lesson_videos_admin_delete ON lesson_videos;
CREATE POLICY lesson_videos_admin_delete ON lesson_videos FOR DELETE TO ashphys_user
  USING (app_is_admin());

-- ---------------------------------------------------------------------------
-- Per-student tables: a student reads and inserts only their own rows;
-- admins read everything. No UPDATE/DELETE for students.
GRANT SELECT, INSERT ON activity_events TO ashphys_user;
DROP POLICY IF EXISTS activity_events_read ON activity_events;
CREATE POLICY activity_events_read ON activity_events FOR SELECT TO ashphys_user
  USING (student_id = app_current_user_id() OR app_is_admin());
DROP POLICY IF EXISTS activity_events_insert_own ON activity_events;
CREATE POLICY activity_events_insert_own ON activity_events FOR INSERT TO ashphys_user
  WITH CHECK (student_id = app_current_user_id());

GRANT SELECT, INSERT ON practice_attempts TO ashphys_user;
GRANT SELECT ON question_attempts TO ashphys_user;
DROP POLICY IF EXISTS practice_attempts_read ON practice_attempts;
CREATE POLICY practice_attempts_read ON practice_attempts FOR SELECT TO ashphys_user
  USING (student_id = app_current_user_id() OR app_is_admin());
DROP POLICY IF EXISTS practice_attempts_insert_own ON practice_attempts;
CREATE POLICY practice_attempts_insert_own ON practice_attempts FOR INSERT TO ashphys_user
  WITH CHECK (student_id = app_current_user_id());

GRANT SELECT, INSERT, UPDATE ON video_requests TO ashphys_user;
DROP POLICY IF EXISTS video_requests_read ON video_requests;
CREATE POLICY video_requests_read ON video_requests FOR SELECT TO ashphys_user
  USING (student_id = app_current_user_id() OR app_is_admin());
DROP POLICY IF EXISTS video_requests_insert_own ON video_requests;
CREATE POLICY video_requests_insert_own ON video_requests FOR INSERT TO ashphys_user
  WITH CHECK (student_id = app_current_user_id());
-- Only admins answer requests (status, link, note).
DROP POLICY IF EXISTS video_requests_admin_update ON video_requests;
CREATE POLICY video_requests_admin_update ON video_requests FOR UPDATE TO ashphys_user
  USING (app_is_admin()) WITH CHECK (app_is_admin());
