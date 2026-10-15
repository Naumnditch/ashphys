/**
 * Video request screenshots: the rules both the browser and the server
 * apply, plus the browser-side compression. No server imports.
 *
 * Storage enforces the same limits on the bucket (migration
 * 2026-10-14-06), so a client that skips these checks still can't upload.
 */

export const MAX_SCREENSHOT_BYTES = 4 * 1024 * 1024; // 4 MB
export const MAX_SCREENSHOT_LABEL = '4 MB';
export const SCREENSHOT_TYPES: Record<string, 'jpg' | 'png' | 'webp'> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};
export const SCREENSHOT_ACCEPT = Object.keys(SCREENSHOT_TYPES).join(',');
export const TOO_LARGE_MESSAGE = `Image is too large (max ${MAX_SCREENSHOT_LABEL})`;
export const WRONG_TYPE_MESSAGE = 'Image upload failed: use a JPG, PNG or WebP image';

const COMPRESS_MAX_WIDTH = 1600;
const COMPRESS_QUALITY = 0.8;

export type ScreenshotCheck = { ok: true } | { ok: false; error: string };

/** Type and size, from the browser's File or the server's declared metadata. */
export function checkScreenshot(meta: { type: string; size: number }): ScreenshotCheck {
  if (!(meta.type in SCREENSHOT_TYPES)) return { ok: false, error: WRONG_TYPE_MESSAGE };
  if (!Number.isFinite(meta.size) || meta.size <= 0) return { ok: false, error: 'Image upload failed: the file is empty' };
  if (meta.size > MAX_SCREENSHOT_BYTES) return { ok: false, error: TOO_LARGE_MESSAGE };
  return { ok: true };
}

/**
 * Browser only. A file over the limit is redrawn on a canvas, at most 1600px
 * wide, as JPEG quality 0.8 (a phone screenshot of a question stays legible).
 * Returns the original file when it is already small enough, the compressed
 * file when that fits, or null when it can't be made to fit (or the browser
 * can't decode it).
 */
export async function shrinkScreenshot(file: File): Promise<File | null> {
  if (file.size <= MAX_SCREENSHOT_BYTES) return file;
  if (typeof document === 'undefined' || typeof createImageBitmap !== 'function') return null;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, COMPRESS_MAX_WIDTH / bitmap.width);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', COMPRESS_QUALITY));
    if (!blob || blob.size > MAX_SCREENSHOT_BYTES) return null;
    const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
    return new File([blob], name, { type: 'image/jpeg' });
  } catch {
    return null;
  }
}

const UUID_SRC = '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}';

/**
 * `{studentId}/{requestId}-{timestamp}.{ext}` → requestId, or null when the
 * path is not one the upload route mints for THIS student.
 */
export function requestIdFromScreenshotPath(path: string, studentId: string): string | null {
  if (!new RegExp(`^${UUID_SRC}$`, 'i').test(studentId)) return null;
  const m = new RegExp(`^${studentId}/(${UUID_SRC})-\\d{10,}\\.(?:jpg|png|webp)$`, 'i').exec(path);
  return m ? m[1].toLowerCase() : null;
}
