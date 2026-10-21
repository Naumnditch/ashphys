-- "Request a video" from practice pages (2026-10-21), migration
-- "video_request_question_id".
--
-- video_requests.question_id: the practice question (problems row) the
-- request is about, chosen in the dashboard form (pre-filled from the
-- practice page the student came from). Nullable: general requests, the
-- homepage form, and every existing row keep question_id = NULL and stay
-- valid. question_number is kept and still written (the server fills it
-- from the chosen question's number), so nothing that reads it changes.
-- Deleting a question clears the link instead of the request.
--
-- Independent of the 2026-10-14 migrations: the column is covered by the
-- table-level grants and policies migration 03 put on video_requests, and
-- the app only writes it once this column exists (lib/db/schemaFeatures.ts).
--
-- Additive and idempotent. Nothing is dropped or renamed.

ALTER TABLE video_requests ADD COLUMN IF NOT EXISTS question_id uuid;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'video_requests_question_id_fkey' AND conrelid = 'public.video_requests'::regclass
  ) THEN
    ALTER TABLE video_requests
      ADD CONSTRAINT video_requests_question_id_fkey FOREIGN KEY (question_id) REFERENCES problems(id) ON DELETE SET NULL;
  END IF;
END
$$;

CREATE INDEX IF NOT EXISTS video_requests_question_id_idx ON video_requests (question_id) WHERE question_id IS NOT NULL;
