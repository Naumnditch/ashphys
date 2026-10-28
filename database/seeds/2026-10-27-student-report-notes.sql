-- 2026-10-27: teacher notes on the student progress report.
--
-- A student's report (dashboard tab "My Report", /admin/students/[id]/report
-- and the PDF) shows the newest note prominently, signed by the teacher, and
-- keeps earlier ones as history. A note can also pin up to 5 lessons the
-- teacher wants the student to focus on; they lead the report's action plan.
--
-- Access is enforced in the app (lib/reports/notes.ts): the student reads
-- their own notes; admins and the teacher of the student's section write
-- them. RLS is on with no policies, so the Supabase API roles see nothing
-- (same model as practice_attempts). Independent of migrations 01–06.

CREATE TABLE IF NOT EXISTS student_report_notes (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id       uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  author_id        uuid REFERENCES users(id) ON DELETE SET NULL,
  signature        text NOT NULL CHECK (char_length(signature) BETWEEN 1 AND 80),
  body             text NOT NULL CHECK (char_length(body) BETWEEN 1 AND 4000),
  focus_topic_ids  uuid[] NOT NULL DEFAULT '{}' CHECK (cardinality(focus_topic_ids) <= 5),
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  read_at          timestamptz
);

CREATE INDEX IF NOT EXISTS student_report_notes_student_idx
  ON student_report_notes (student_id, created_at DESC);

ALTER TABLE student_report_notes ENABLE ROW LEVEL SECURITY;
