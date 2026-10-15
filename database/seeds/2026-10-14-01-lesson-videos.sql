-- Lesson video embedding (2026-10-14), migration "lesson_videos".
--
-- A "lesson" in this app is a `topics` row (the `lessons` table is empty,
-- unused schema — see PROJECT_STATUS.md), so lesson_videos.lesson_id points
-- at topics(id). Videos are unlisted YouTube uploads; only the 11-character
-- video id is stored, never a full URL, so a link to YouTube can't leak into
-- the student UI by accident.
--
-- Additive and idempotent: safe to run twice. Nothing existing is dropped
-- or renamed.

CREATE TABLE IF NOT EXISTS lesson_videos (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id         uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  youtube_id        text NOT NULL CONSTRAINT lesson_videos_youtube_id_check CHECK (youtube_id ~ '^[A-Za-z0-9_-]{11}$'),
  title             text NOT NULL CONSTRAINT lesson_videos_title_check CHECK (length(btrim(title)) > 0),
  description       text,
  sort_order        integer NOT NULL DEFAULT 0,
  is_published      boolean NOT NULL DEFAULT false,
  source_request_id uuid REFERENCES video_requests(id) ON DELETE SET NULL,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

-- The same video twice on one lesson is always a mistake; it is also what
-- lets a fulfilled request "create or link" its lesson video idempotently.
CREATE UNIQUE INDEX IF NOT EXISTS lesson_videos_lesson_youtube_key ON lesson_videos (lesson_id, youtube_id);
CREATE INDEX IF NOT EXISTS idx_lesson_videos_lesson_order ON lesson_videos (lesson_id, sort_order, created_at);
CREATE INDEX IF NOT EXISTS idx_lesson_videos_source_request ON lesson_videos (source_request_id) WHERE source_request_id IS NOT NULL;

ALTER TABLE lesson_videos ENABLE ROW LEVEL SECURITY;

-- The hero request form asks for a question number (or a screenshot).
ALTER TABLE video_requests ADD COLUMN IF NOT EXISTS question_number text;
