-- "What's New" announcements in the homepage hero (2026-10-28), migration
-- "site_updates". Additive and idempotent (safe to run twice).
--
-- One row per announcement: a short video made from real footage of the site
-- (see video/README.md), a poster, a title/summary and a call to action. The
-- hero shows the newest published row; older published rows are listed under
-- "Previous updates". Admins manage them at /admin/updates.
--
-- Who may do what, under the same scheme as 2026-10-28-question-handwriting.sql:
-- the app runs these queries through withRlsContext (lib/db/rls.ts), i.e. as
-- the NOLOGIN role ashphys_user with app.user_id set from the server-verified
-- session (empty for an anonymous visitor).
--   * everyone, signed in or not, reads rows that are active and whose
--     published_at has arrived (a future published_at = scheduled);
--   * admins (users.role = 'admin') read every row and are the only writers;
--   * Supabase's anon/authenticated roles get nothing (no REST exposure).
--
-- Video files live in the PUBLIC storage bucket `site-updates` (they are shown
-- to anonymous visitors, so a public URL is the point). Writes go through
-- short-lived signed upload URLs minted by POST /api/admin/site-updates/upload
-- after the app has checked the caller is an admin; with no storage.objects
-- policies for anon/authenticated, nobody else can write there.
--
-- Needs app_current_user_id() / app_is_admin() and the ashphys_user role,
-- created by 2026-10-28-question-handwriting.sql (repeated below so this file
-- also runs first on a fresh database).

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

REVOKE ALL ON FUNCTION app_is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app_current_user_id() TO ashphys_user;
GRANT EXECUTE ON FUNCTION app_is_admin() TO ashphys_user;

-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  title text NOT NULL,
  -- One line under the title in the hero.
  summary text NOT NULL DEFAULT '',
  -- The full announcement film (1080p), played in the modal with controls.
  video_mp4_url text,
  video_webm_url text,
  poster_url text,
  -- Optional short muted loop for the hero card (720p, a few MB); the hero
  -- falls back to the full film when these are empty.
  loop_mp4_url text,
  loop_webm_url text,
  -- WebVTT captions for the modal player.
  captions_vtt_url text,
  cta_label text,
  cta_href text,
  -- When it goes live. NULL = draft; a future time = scheduled.
  published_at timestamptz,
  -- Unpublish = false. Only active rows with published_at <= now() are public.
  is_active boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT site_updates_slug_key UNIQUE (slug),
  CONSTRAINT site_updates_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND length(slug) <= 80),
  CONSTRAINT site_updates_title_length CHECK (length(btrim(title)) BETWEEN 1 AND 120),
  CONSTRAINT site_updates_summary_length CHECK (length(summary) <= 280),
  CONSTRAINT site_updates_cta_label_length CHECK (cta_label IS NULL OR length(cta_label) <= 40),
  -- Media and links: https URLs or site-relative paths only (never javascript:,
  -- data: or protocol-relative //host), so they are safe in src/href.
  CONSTRAINT site_updates_urls_safe CHECK (
    (video_mp4_url IS NULL OR video_mp4_url ~ '^(https://[^\s"''<>]+|/[^/\s"''<>][^\s"''<>]*)$') AND
    (video_webm_url IS NULL OR video_webm_url ~ '^(https://[^\s"''<>]+|/[^/\s"''<>][^\s"''<>]*)$') AND
    (poster_url IS NULL OR poster_url ~ '^(https://[^\s"''<>]+|/[^/\s"''<>][^\s"''<>]*)$') AND
    (loop_mp4_url IS NULL OR loop_mp4_url ~ '^(https://[^\s"''<>]+|/[^/\s"''<>][^\s"''<>]*)$') AND
    (loop_webm_url IS NULL OR loop_webm_url ~ '^(https://[^\s"''<>]+|/[^/\s"''<>][^\s"''<>]*)$') AND
    (captions_vtt_url IS NULL OR captions_vtt_url ~ '^(https://[^\s"''<>]+|/[^/\s"''<>][^\s"''<>]*)$') AND
    (cta_href IS NULL OR cta_href ~ '^(https://[^\s"''<>]+|/[^/\s"''<>]*)$')
  )
);

CREATE INDEX IF NOT EXISTS idx_site_updates_live ON site_updates (published_at DESC) WHERE is_active;

ALTER TABLE site_updates ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON site_updates TO ashphys_user;

DROP POLICY IF EXISTS site_updates_public_read ON site_updates;
CREATE POLICY site_updates_public_read ON site_updates FOR SELECT TO ashphys_user
  USING ((is_active AND published_at IS NOT NULL AND published_at <= now()) OR app_is_admin());
DROP POLICY IF EXISTS site_updates_admin_insert ON site_updates;
CREATE POLICY site_updates_admin_insert ON site_updates FOR INSERT TO ashphys_user
  WITH CHECK (app_is_admin());
DROP POLICY IF EXISTS site_updates_admin_update ON site_updates;
CREATE POLICY site_updates_admin_update ON site_updates FOR UPDATE TO ashphys_user
  USING (app_is_admin()) WITH CHECK (app_is_admin());
DROP POLICY IF EXISTS site_updates_admin_delete ON site_updates;
CREATE POLICY site_updates_admin_delete ON site_updates FOR DELETE TO ashphys_user
  USING (app_is_admin());

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON site_updates FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON site_updates FROM authenticated;
  END IF;
END
$$;

-- ---------------------------------------------------------------------------
-- Public bucket for the videos, posters and captions. 50 MB per file (the
-- Supabase plan ceiling); only the media types the admin form accepts.
DO $$
BEGIN
  IF to_regclass('storage.buckets') IS NOT NULL THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES ('site-updates', 'site-updates', true, 52428800,
            ARRAY['video/mp4', 'video/webm', 'image/jpeg', 'image/webp', 'image/png', 'text/vtt'])
    ON CONFLICT (id) DO UPDATE
    SET public = true,
        file_size_limit = 52428800,
        allowed_mime_types = ARRAY['video/mp4', 'video/webm', 'image/jpeg', 'image/webp', 'image/png', 'text/vtt'];
  END IF;
END
$$;
