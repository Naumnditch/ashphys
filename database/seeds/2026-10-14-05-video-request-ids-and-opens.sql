-- Dashboard video tab (2026-10-14), migration "video_request_ids_and_opens".
-- Run AFTER 2026-10-14-01..04 (it uses ashphys_user, app_current_user_id()
-- and app_is_admin() from 03).
--
-- 1. video_requests.youtube_id: the 11-character id, written by the admin
--    save (lib/youtube/videoId.ts parses the pasted link). youtube_url is
--    kept as it is: nothing is dropped or renamed. Existing rows are
--    backfilled from youtube_url.
-- 2. video_request_opens: which fulfilled videos a student has opened, for
--    the "ready" badge on the dashboard. One row per student and request,
--    remembering WHICH video was opened: if the admin later swaps in a
--    different video, the request counts as ready again.
--
-- Additive and idempotent.

ALTER TABLE video_requests ADD COLUMN IF NOT EXISTS youtube_id text
  CONSTRAINT video_requests_youtube_id_check CHECK (youtube_id IS NULL OR youtube_id ~ '^[A-Za-z0-9_-]{11}$');

-- Same formats the app accepts: youtu.be/ID, ?v=ID / &v=ID, /embed/, /shorts/, /live/, /v/.
-- The lookahead refuses a 12th id character, so a malformed link stays null.
UPDATE video_requests
SET youtube_id = substring(youtube_url FROM '(?:youtu\.be/|[?&]v=|/embed/|/shorts/|/live/|/v/)([A-Za-z0-9_-]{11})(?![A-Za-z0-9_-])')
WHERE youtube_id IS NULL AND youtube_url IS NOT NULL;

CREATE TABLE IF NOT EXISTS video_request_opens (
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  request_id uuid NOT NULL REFERENCES video_requests(id) ON DELETE CASCADE,
  youtube_id text NOT NULL CONSTRAINT video_request_opens_youtube_id_check CHECK (youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  opened_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (student_id, request_id)
);

ALTER TABLE video_request_opens ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE ON video_request_opens TO ashphys_user;

-- A student reads only their own opens; admins read all.
DROP POLICY IF EXISTS video_request_opens_read ON video_request_opens;
CREATE POLICY video_request_opens_read ON video_request_opens FOR SELECT TO ashphys_user
  USING (student_id = app_current_user_id() OR app_is_admin());

-- A student can only mark their OWN request as opened. The subquery runs
-- under video_requests' own read policy, which already hides other students' rows.
DROP POLICY IF EXISTS video_request_opens_insert_own ON video_request_opens;
CREATE POLICY video_request_opens_insert_own ON video_request_opens FOR INSERT TO ashphys_user
  WITH CHECK (
    student_id = app_current_user_id()
    AND EXISTS (SELECT 1 FROM video_requests r WHERE r.id = request_id AND r.student_id = app_current_user_id())
  );

-- Re-opening after the video was swapped updates the student's own row.
DROP POLICY IF EXISTS video_request_opens_update_own ON video_request_opens;
CREATE POLICY video_request_opens_update_own ON video_request_opens FOR UPDATE TO ashphys_user
  USING (student_id = app_current_user_id())
  WITH CHECK (
    student_id = app_current_user_id()
    AND EXISTS (SELECT 1 FROM video_requests r WHERE r.id = request_id AND r.student_id = app_current_user_id())
  );
