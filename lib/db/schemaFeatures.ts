/**
 * Which optional schema pieces (the 2026-10-14 migrations) exist in the
 * database this deployment talks to.
 *
 * Why: on 2026-10-14 code that needs migrations 01–05 reached production
 * before the migrations did, and the admin video-request API crashed on a
 * missing column. Admin tools must keep working on either schema, so they
 * ask here first. Cached briefly so applying the migrations takes effect
 * without a redeploy. Student-facing row-level-security paths do NOT fall
 * back (that would silently skip RLS); they need the migrations.
 */

import { query } from '@/lib/db/client';

export interface SchemaFeatures {
  /** Role ashphys_user from migration 03 (withRlsContext needs it). */
  rlsRole: boolean;
  /** video_requests.question_number (migration 01). */
  questionNumber: boolean;
  /** video_requests.youtube_id (migration 05). */
  requestYoutubeId: boolean;
  /** Table lesson_videos (migration 01). */
  lessonVideos: boolean;
}

const TTL_MS = 60_000;
let cached: { at: number; value: SchemaFeatures } | null = null;

export async function getSchemaFeatures(): Promise<SchemaFeatures> {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.value;
  const res = await query(
    `SELECT
       EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'ashphys_user') AS rls_role,
       EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_schema = 'public' AND table_name = 'video_requests' AND column_name = 'question_number') AS question_number,
       EXISTS (SELECT 1 FROM information_schema.columns
               WHERE table_schema = 'public' AND table_name = 'video_requests' AND column_name = 'youtube_id') AS request_youtube_id,
       to_regclass('public.lesson_videos') IS NOT NULL AS lesson_videos`
  );
  const r = res.rows[0];
  const value: SchemaFeatures = {
    rlsRole: r.rls_role,
    questionNumber: r.question_number,
    requestYoutubeId: r.request_youtube_id,
    lessonVideos: r.lesson_videos,
  };
  cached = { at: Date.now(), value };
  return value;
}

/** For tests. */
export function resetSchemaFeaturesCache() {
  cached = null;
}
