-- Video request screenshots bucket (2026-10-14), migration
-- "video_request_screenshots_bucket". Independent of 01–05; safe to run on
-- its own and to run twice.
--
-- The bucket was created by hand (2026-09, see PROJECT_STATUS.md "MONETIZATION
-- PASS") as a plain storage.buckets row with no size or type limit. This makes
-- sure it exists (fresh environments) and is private, and puts the same limits
-- the app enforces on the bucket itself, so storage rejects a bad file even if
-- a client skips the checks.
--
-- Paths: {student_id}/{request_id}-{timestamp}.{ext}, minted server-side by
-- POST /api/video-requests/upload.
--
-- No storage.objects policies are added, on purpose: this app has no Supabase
-- Auth, so students never talk to Storage as `authenticated` (auth.uid() is
-- always null). Uploads use a short-lived signed upload URL for one exact path
-- under the student's own folder, minted with the service key after the app
-- has verified the session; reads are short-lived signed URLs minted only for
-- the requester (or an admin). With RLS on storage.objects and no policies,
-- the public/anon/authenticated roles can neither list, read nor write here.

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('video-request-screenshots', 'video-request-screenshots', false, 4194304, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE
SET public = false,
    file_size_limit = 4194304,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];
