/**
 * POST /api/video-requests/upload
 * JSON: { contentType: 'image/jpeg' | 'image/png' | 'image/webp', size: number }
 * → { ok: true, requestId, path, signedUrl } | { ok: false, error }
 *
 * Step 1 of submitting a request with a screenshot. Mints the request's id
 * up front so the file can live at
 *   video-request-screenshots/{student_id}/{request_id}-{timestamp}.{ext}
 * and returns a short-lived signed upload URL for exactly that path. The
 * browser PUTs the bytes straight to Supabase Storage (they never pass
 * through this function, so Vercel's ~4.5 MB body limit doesn't apply), then
 * sends the request itself to POST /api/video-requests with the same id.
 *
 * The student folder comes from the session, never from the client. Type and
 * size are checked here and again by the bucket (migration 2026-10-14-06).
 * `success` mirrors `ok` for older callers.
 */

import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getUserTier, TIER_PLUS } from '@/lib/subscriptions/getUserTier';
import { createSignedUploadUrl } from '@/lib/storage/signedUpload';
import { SCREENSHOT_BUCKET } from '@/lib/videoRequests/student';
import { SCREENSHOT_TYPES, checkScreenshot } from '@/lib/videoRequests/screenshot';

const fail = (status: number, error: string) => NextResponse.json({ ok: false, success: false, error }, { status });

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return fail(401, 'you are signed out. Log in again and retry.');
    const tier = await getUserTier(user.id);
    if (tier < TIER_PLUS) return fail(403, 'video solve requests are available on Plus and Pro plans.');

    const body = (await req.json().catch(() => ({}))) as { contentType?: unknown; size?: unknown };
    const contentType = typeof body.contentType === 'string' ? body.contentType : '';
    const size = typeof body.size === 'number' ? body.size : Number.NaN;
    const check = checkScreenshot({ type: contentType, size });
    if (!check.ok) return fail(400, check.error);

    const requestId = randomUUID();
    const path = `${user.id}/${requestId}-${Date.now()}.${SCREENSHOT_TYPES[contentType]}`;
    const signed = await createSignedUploadUrl(SCREENSHOT_BUCKET, path);
    if ('error' in signed) {
      console.error('video request upload: could not sign', signed.error);
      return fail(502, 'storage is not available right now. Please try again in a minute.');
    }
    return NextResponse.json({ ok: true, success: true, requestId, path, signedUrl: signed.signedUrl });
  } catch (err) {
    console.error('video request upload failed', err);
    return fail(500, 'the server could not prepare the upload. Please try again.');
  }
}
