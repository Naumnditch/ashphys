-- Student workspaces and "Share my solution" (2026-10-29), migration
-- "shared_solutions". Additive and idempotent (safe to run twice).
--
-- 1. student_workspaces: each student's own working for a practice question,
--    the same vector strokes as question_handwriting (doc) plus typed steps.
--    Private: only its owner reads or writes it. Admins included — they see
--    what a student chose to share, never the workspace itself.
-- 2. users.age_band: self-declared 'under_18' / '18_plus', asked the first
--    time a student shares (unknown = treated as under 18). Students set it
--    once; only the table owner (an admin via SQL) changes it afterwards.
-- 3. shared_solutions: a student's submission of their working for review.
--    The strokes and steps are COPIED from the workspace at submission time
--    (later edits to the workspace never change a submission), with the
--    display name, consent timestamps and the exact consent wording.
--    status: pending → approved / rejected by an admin; the author can
--    withdraw a pending or approved one at any time, which is final.
--
-- Who may do what is enforced here, under the same scheme as
-- 2026-10-28-question-handwriting.sql: the app runs these queries through
-- withRlsContext (lib/db/rls.ts), i.e. as the NOLOGIN role ashphys_user with
-- app.user_id set from the server-verified session.
--   shared_solutions SELECT: the author (any status), admins (everything), and
--     other users only for APPROVED rows of a question they have answered
--     incorrectly — the same reveal rule as the teacher's handwritten solution
--     (the API adds the lesson tier gate and the solution view budget on top);
--   INSERT: students only, as themselves, status pending with no review fields,
--     and a parental consent timestamp unless they declared 18 or over;
--   UPDATE: the author may only withdraw; admins may only review (approve,
--     reject with a reason, mark verified). A trigger enforces the transitions
--     and stamps reviewed_by/at, verified_by/at and withdrawn_at, and the
--     column grants keep the submitted content immutable;
--   DELETE: nobody through the app (withdrawn rows are kept as the consent
--     record; deleting the user deletes their rows).
-- Supabase's anon/authenticated roles get nothing.
--
-- Needs nothing beyond 2026-10-28-question-handwriting.sql's role and helper
-- functions, which are repeated below with the same definitions so this file
-- also runs first on a fresh database.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ashphys_user') THEN
    CREATE ROLE ashphys_user NOLOGIN NOINHERIT;
  END IF;
END
$$;

GRANT ashphys_user TO CURRENT_USER WITH INHERIT FALSE, SET TRUE;
GRANT USAGE ON SCHEMA public TO ashphys_user;

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

CREATE OR REPLACE FUNCTION app_answered_incorrectly(question uuid) RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM practice_attempts
    WHERE student_id = app_current_user_id() AND problem_id = question AND is_correct = false
  )
$$;

REVOKE ALL ON FUNCTION app_is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION app_answered_incorrectly(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app_current_user_id() TO ashphys_user;
GRANT EXECUTE ON FUNCTION app_is_admin() TO ashphys_user;
GRANT EXECUTE ON FUNCTION app_answered_incorrectly(uuid) TO ashphys_user;

-- ---------------------------------------------------------------------------
-- Age band (self-declared). NULL = never asked.
ALTER TABLE users ADD COLUMN IF NOT EXISTS age_band text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS age_band_declared_at timestamptz;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'users_age_band_valid') THEN
    ALTER TABLE users ADD CONSTRAINT users_age_band_valid CHECK (age_band IS NULL OR age_band IN ('under_18', '18_plus'));
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION app_is_student() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users WHERE id = app_current_user_id() AND role = 'student'::user_role
  )
$$;

-- Has the caller declared they are 18 or over? Not asked yet counts as no.
CREATE OR REPLACE FUNCTION app_declared_adult() RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users WHERE id = app_current_user_id() AND age_band = '18_plus'
  )
$$;

REVOKE ALL ON FUNCTION app_is_student() FROM PUBLIC;
REVOKE ALL ON FUNCTION app_declared_adult() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app_is_student() TO ashphys_user;
GRANT EXECUTE ON FUNCTION app_declared_adult() TO ashphys_user;

-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS student_workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  -- Same format as question_handwriting.doc (lib/handwriting/types.ts).
  doc jsonb NOT NULL DEFAULT '{"v": 1, "pages": [{"id": "p1", "background": "grid", "strokes": []}]}'::jsonb,
  steps_text text NOT NULL DEFAULT '',
  stroke_count integer NOT NULL DEFAULT 0 CHECK (stroke_count >= 0),
  -- Version of doc (bumped per canvas save, optimistic concurrency like
  -- question_handwriting). 0 = typed steps saved but no canvas save yet.
  -- Saving steps never bumps it, so typing doesn't conflict with the canvas.
  version integer NOT NULL DEFAULT 0 CHECK (version >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT student_workspaces_user_question_key UNIQUE (user_id, question_id),
  CONSTRAINT student_workspaces_doc_is_object CHECK (jsonb_typeof(doc) = 'object'),
  CONSTRAINT student_workspaces_steps_length CHECK (length(steps_text) <= 5000)
);

ALTER TABLE student_workspaces ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON student_workspaces TO ashphys_user;

DROP POLICY IF EXISTS student_workspaces_read_own ON student_workspaces;
CREATE POLICY student_workspaces_read_own ON student_workspaces FOR SELECT TO ashphys_user
  USING (user_id = app_current_user_id());
DROP POLICY IF EXISTS student_workspaces_insert_own ON student_workspaces;
CREATE POLICY student_workspaces_insert_own ON student_workspaces FOR INSERT TO ashphys_user
  WITH CHECK (user_id = app_current_user_id());
DROP POLICY IF EXISTS student_workspaces_update_own ON student_workspaces;
CREATE POLICY student_workspaces_update_own ON student_workspaces FOR UPDATE TO ashphys_user
  USING (user_id = app_current_user_id()) WITH CHECK (user_id = app_current_user_id());
DROP POLICY IF EXISTS student_workspaces_delete_own ON student_workspaces;
CREATE POLICY student_workspaces_delete_own ON student_workspaces FOR DELETE TO ashphys_user
  USING (user_id = app_current_user_id());

-- ---------------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'shared_solution_status') THEN
    CREATE TYPE shared_solution_status AS ENUM ('pending', 'approved', 'rejected', 'withdrawn');
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS shared_solutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  -- Shown as "Student solution by <display_name>". Chosen by the student.
  display_name text NOT NULL,
  -- Snapshot of the workspace doc at submission (question_handwriting format).
  strokes jsonb NOT NULL,
  -- Server-rendered SVG per non-empty page of strokes (as question_handwriting.snapshots).
  snapshots jsonb NOT NULL DEFAULT '[]'::jsonb,
  stroke_count integer NOT NULL DEFAULT 0 CHECK (stroke_count >= 0),
  -- Snapshot of the typed steps at submission.
  steps_text text NOT NULL DEFAULT '',
  status shared_solution_status NOT NULL DEFAULT 'pending',
  -- "Verified against mark scheme" (admin).
  verified boolean NOT NULL DEFAULT false,
  verified_by uuid REFERENCES users(id) ON DELETE SET NULL,
  verified_at timestamptz,
  -- Which wording the student agreed to, and that exact wording
  -- (lib/sharedSolutions/consent.ts).
  consent_version text NOT NULL,
  consent_text text NOT NULL,
  consented_at timestamptz NOT NULL,
  -- When an under-18 (or not-yet-declared) student confirmed their parent or
  -- guardian agreed. Self-declared by the student.
  parent_consent_at timestamptz,
  reviewed_by uuid REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at timestamptz,
  -- Optional, shown to the student.
  rejection_reason text,
  withdrawn_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT shared_solutions_display_name_valid CHECK (display_name = btrim(display_name) AND length(display_name) BETWEEN 1 AND 40),
  CONSTRAINT shared_solutions_strokes_is_object CHECK (jsonb_typeof(strokes) = 'object'),
  CONSTRAINT shared_solutions_snapshots_is_array CHECK (jsonb_typeof(snapshots) = 'array'),
  CONSTRAINT shared_solutions_steps_length CHECK (length(steps_text) <= 5000),
  CONSTRAINT shared_solutions_has_content CHECK (stroke_count > 0 OR length(btrim(steps_text)) > 0),
  CONSTRAINT shared_solutions_consent_text_length CHECK (length(consent_text) BETWEEN 1 AND 2000),
  CONSTRAINT shared_solutions_rejection_reason_length CHECK (rejection_reason IS NULL OR length(rejection_reason) <= 500)
);

CREATE INDEX IF NOT EXISTS idx_shared_solutions_question_status ON shared_solutions (question_id, status);
CREATE INDEX IF NOT EXISTS idx_shared_solutions_user ON shared_solutions (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_shared_solutions_pending ON shared_solutions (created_at) WHERE status = 'pending';
-- One live (pending or approved) submission per student per question:
-- withdraw it, or wait for a rejection, before sharing a new version.
CREATE UNIQUE INDEX IF NOT EXISTS shared_solutions_one_live_per_question
  ON shared_solutions (user_id, question_id) WHERE status IN ('pending', 'approved');

ALTER TABLE shared_solutions ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON shared_solutions TO ashphys_user;
-- The submitted content (strokes, steps, display name, consent) never changes.
REVOKE UPDATE ON shared_solutions FROM ashphys_user;
GRANT UPDATE (status, verified, rejection_reason) ON shared_solutions TO ashphys_user;

DROP POLICY IF EXISTS shared_solutions_read ON shared_solutions;
CREATE POLICY shared_solutions_read ON shared_solutions FOR SELECT TO ashphys_user
  USING (
    user_id = app_current_user_id()
    OR app_is_admin()
    OR (status = 'approved' AND app_answered_incorrectly(question_id))
  );
DROP POLICY IF EXISTS shared_solutions_insert_own ON shared_solutions;
CREATE POLICY shared_solutions_insert_own ON shared_solutions FOR INSERT TO ashphys_user
  WITH CHECK (
    user_id = app_current_user_id()
    AND app_is_student()
    AND status = 'pending'
    AND NOT verified AND verified_by IS NULL AND verified_at IS NULL
    AND reviewed_by IS NULL AND reviewed_at IS NULL AND rejection_reason IS NULL AND withdrawn_at IS NULL
    -- Under 18, or never said: a parent or guardian must have agreed.
    AND (parent_consent_at IS NOT NULL OR app_declared_adult())
  );
DROP POLICY IF EXISTS shared_solutions_withdraw_own ON shared_solutions;
CREATE POLICY shared_solutions_withdraw_own ON shared_solutions FOR UPDATE TO ashphys_user
  USING (user_id = app_current_user_id() AND status IN ('pending', 'approved'))
  WITH CHECK (user_id = app_current_user_id() AND status = 'withdrawn');
DROP POLICY IF EXISTS shared_solutions_admin_review ON shared_solutions;
CREATE POLICY shared_solutions_admin_review ON shared_solutions FOR UPDATE TO ashphys_user
  USING (app_is_admin() AND status <> 'withdrawn')
  WITH CHECK (app_is_admin() AND status <> 'withdrawn');

-- Transitions, for the app role (the table owner — migrations, ON DELETE SET
-- NULL from users — is not checked, as it bypasses row-level security too).
--   * withdrawn is final;
--   * only the author withdraws, and withdrawing changes nothing else;
--   * everything else is an admin review: never back to pending; changing the
--     status stamps reviewed_by/at; verifying stamps verified_by/at; a
--     rejection reason only stays on a rejected row.
CREATE OR REPLACE FUNCTION shared_solutions_guard() RETURNS trigger
LANGUAGE plpgsql SET search_path = public
AS $$
BEGIN
  IF current_user <> 'ashphys_user' THEN
    RETURN NEW;
  END IF;
  IF OLD.status = 'withdrawn' THEN
    RAISE EXCEPTION 'A withdrawn solution cannot be changed' USING ERRCODE = '42501';
  END IF;
  IF NEW.status = 'withdrawn' THEN
    IF OLD.user_id IS DISTINCT FROM app_current_user_id()
       OR NEW.verified IS DISTINCT FROM OLD.verified
       OR NEW.rejection_reason IS DISTINCT FROM OLD.rejection_reason THEN
      RAISE EXCEPTION 'Only the author can withdraw a solution, and withdrawing changes nothing else' USING ERRCODE = '42501';
    END IF;
    NEW.withdrawn_at := now();
    RETURN NEW;
  END IF;
  IF NOT app_is_admin() THEN
    RAISE EXCEPTION 'Only admins review shared solutions' USING ERRCODE = '42501';
  END IF;
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'pending' THEN
      RAISE EXCEPTION 'A reviewed solution cannot go back to pending' USING ERRCODE = '42501';
    END IF;
    NEW.reviewed_by := app_current_user_id();
    NEW.reviewed_at := now();
  END IF;
  IF NEW.status <> 'rejected' THEN
    NEW.rejection_reason := NULL;
  END IF;
  IF NEW.verified IS DISTINCT FROM OLD.verified THEN
    NEW.verified_by := CASE WHEN NEW.verified THEN app_current_user_id() END;
    NEW.verified_at := CASE WHEN NEW.verified THEN now() END;
  END IF;
  RETURN NEW;
END
$$;

DROP TRIGGER IF EXISTS shared_solutions_guard ON shared_solutions;
CREATE TRIGGER shared_solutions_guard BEFORE UPDATE ON shared_solutions
  FOR EACH ROW EXECUTE FUNCTION shared_solutions_guard();

-- Supabase grants new public tables and functions to anon/authenticated by
-- default privileges. RLS with no policy for them already returns nothing;
-- this removes the grants as well. (Those roles only exist on Supabase.)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON student_workspaces FROM anon;
    REVOKE ALL ON shared_solutions FROM anon;
    REVOKE ALL ON FUNCTION app_is_student() FROM anon;
    REVOKE ALL ON FUNCTION app_declared_adult() FROM anon;
    REVOKE ALL ON FUNCTION shared_solutions_guard() FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON student_workspaces FROM authenticated;
    REVOKE ALL ON shared_solutions FROM authenticated;
    REVOKE ALL ON FUNCTION app_is_student() FROM authenticated;
    REVOKE ALL ON FUNCTION app_declared_adult() FROM authenticated;
    REVOKE ALL ON FUNCTION shared_solutions_guard() FROM authenticated;
  END IF;
END
$$;
