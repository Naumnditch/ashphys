/**
 * POST /api/admin/site-updates/upload
 * JSON: { slug, slot: video_mp4 | video_webm | loop_mp4 | loop_webm | poster | captions, contentType }
 *
 * Returns a signed upload URL for one new object in the public `site-updates`
 * bucket and the public URL it will have. The browser PUTs the file there
 * directly (the videos are far over Vercel's ~4.5 MB function body limit; see
 * lib/storage/signedUpload.ts). Each upload gets a fresh path, so replacing a
 * video never fights a CDN cache.
 */

import { NextRequest, NextResponse } from 'next/server';
import { fail, readJson, requireAdmin } from '@/lib/messaging/http';
import { createSignedUploadUrl, publicStorageUrl } from '@/lib/storage/signedUpload';
import { MEDIA_SLOTS, POSTER_TYPES, type MediaSlot } from '@/lib/siteUpdates/types';
import { SLUG_RE } from '@/lib/siteUpdates/validate';

const BUCKET = 'site-updates';

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return fail('Not authorized', 403);

  const { slug, slot, contentType } = (await readJson(req)) as { slug?: unknown; slot?: unknown; contentType?: unknown };
  if (typeof slug !== 'string' || !SLUG_RE.test(slug) || slug.length > 80) return fail('Set a valid slug first.');
  if (typeof slot !== 'string' || !(slot in MEDIA_SLOTS)) return fail('Unknown file slot.');
  const spec = MEDIA_SLOTS[slot as MediaSlot];

  let ext: string | null = spec.ext;
  if (slot === 'poster') {
    ext = typeof contentType === 'string' ? POSTER_TYPES[contentType] ?? null : null;
    if (!ext) return fail('The poster must be a WebP, JPG or PNG image.');
  } else if (contentType !== spec.type && !(slot === 'captions' && (contentType === '' || contentType === 'text/plain'))) {
    return fail(`That slot takes ${spec.type} files.`);
  }

  const path = `${slug}/${slot.replace('_', '-')}-${Date.now().toString(36)}.${ext}`;
  const signed = await createSignedUploadUrl(BUCKET, path);
  if ('error' in signed) return fail(signed.error, 502);
  return NextResponse.json({
    success: true,
    signedUrl: signed.signedUrl,
    publicUrl: publicStorageUrl(BUCKET, path),
    contentType: slot === 'poster' ? contentType : spec.type,
  });
}
