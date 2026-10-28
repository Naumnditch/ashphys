-- 2026-10-27 (2): handwritten teacher notes and signatures (pen / stylus).
--
-- A note may now carry handwriting (`ink`) and a handwritten signature
-- (`signature_ink`): stroke data recorded by the pen pad (lib/reports/ink.ts,
-- validated server-side), drawn as SVG on the report and in the PDF. A note
-- needs typed text OR handwriting. Each teacher's last signature is kept in
-- `staff_signatures` so they draw it once and it is reused on every note.
-- Run after 2026-10-27-student-report-notes.sql. Idempotent.

ALTER TABLE student_report_notes ADD COLUMN IF NOT EXISTS ink jsonb;
ALTER TABLE student_report_notes ADD COLUMN IF NOT EXISTS signature_ink jsonb;

ALTER TABLE student_report_notes DROP CONSTRAINT IF EXISTS student_report_notes_body_check;
ALTER TABLE student_report_notes DROP CONSTRAINT IF EXISTS student_report_notes_body_or_ink;
ALTER TABLE student_report_notes ADD CONSTRAINT student_report_notes_body_check CHECK (char_length(body) <= 4000);
ALTER TABLE student_report_notes ADD CONSTRAINT student_report_notes_body_or_ink CHECK (char_length(body) > 0 OR ink IS NOT NULL);

CREATE TABLE IF NOT EXISTS staff_signatures (
  user_id     uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  ink         jsonb NOT NULL,
  updated_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE staff_signatures ENABLE ROW LEVEL SECURITY;
