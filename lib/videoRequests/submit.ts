/**
 * Submitting a video request from the browser, as explicit steps:
 *
 *   1. validate   description / lesson rules, image type (jpg/png/webp)
 *   2. compress   only if the image is over 4 MB (canvas, ≤1600px, JPEG 0.8)
 *   3. upload     POST /api/video-requests/upload (path + id minted server-side),
 *                 then PUT the bytes to the signed Storage URL
 *   4. save       POST /api/video-requests → { ok, id } | { ok, error }
 *
 * Every failure names its step for the student ("Image upload failed: …",
 * "Could not save your request: …", "Image is too large (max 4 MB)") and is
 * logged in full to the console. Raw storage/server details (keys, paths,
 * SQL) are never shown. If the upload fails but the request is still valid
 * without the image, the request is saved anyway and `imageSkipped` says why.
 *
 * Client-safe: no server imports.
 */

import { putFileToSignedUrl } from '@/lib/storage/directUpload';
import { MAX_SCREENSHOT_BYTES, SCREENSHOT_TYPES, TOO_LARGE_MESSAGE, WRONG_TYPE_MESSAGE, shrinkScreenshot } from '@/lib/videoRequests/screenshot';

export type SubmitStep = 'compressing' | 'uploading' | 'saving';

export interface VideoRequestInput {
  description: string;
  lessonId?: string | null;
  chapterId?: string | null;
  questionNumber?: string | null;
  file?: File | null;
  /** Homepage form: a lesson plus a question number or a screenshot are required. */
  requireQuestion?: boolean;
}

export type SubmitResult =
  | { ok: true; id: string; imageSkipped?: string }
  | { ok: false; step: 'validate' | 'upload' | 'save'; error: string };

export interface SubmitDeps {
  fetchImpl?: typeof fetch;
  putFile?: typeof putFileToSignedUrl;
  shrink?: typeof shrinkScreenshot;
  onStep?: (step: SubmitStep) => void;
}

/** Reads a JSON body without throwing (a platform error page is HTML). */
async function readJson(res: Response): Promise<Record<string, unknown> | null> {
  try {
    const data = await res.json();
    return data && typeof data === 'object' ? (data as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

function uploadMessage(reason: string): string {
  return reason.startsWith('Image ') ? reason : `Image upload failed: ${reason}`;
}

/** A storage rejection in words a student can act on (never the raw response). */
function storageReason(error: string): string {
  if (/HTTP 413|maximum allowed size|too large/i.test(error)) return TOO_LARGE_MESSAGE;
  if (/HTTP 415|mime|content type/i.test(error)) return WRONG_TYPE_MESSAGE;
  if (/could not reach storage/i.test(error)) return 'could not reach the image server. Check your connection and try again.';
  const status = /HTTP (\d{3})/.exec(error)?.[1];
  return `the image server refused the file${status ? ` (error ${status})` : ''}. Please try again.`;
}

async function uploadScreenshot(
  file: File,
  fetchImpl: typeof fetch,
  putFile: typeof putFileToSignedUrl
): Promise<{ ok: true; path: string; requestId: string } | { ok: false; error: string }> {
  let res: Response;
  try {
    res = await fetchImpl('/api/video-requests/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contentType: file.type, size: file.size }),
    });
  } catch (err) {
    console.error('[video request] upload: could not reach the server', err);
    return { ok: false, error: uploadMessage('could not reach the server. Check your connection and try again.') };
  }
  const data = await readJson(res);
  if (!res.ok || !data || data.ok !== true || typeof data.signedUrl !== 'string' || typeof data.path !== 'string') {
    console.error('[video request] upload: could not start', res.status, data);
    const reason = typeof data?.error === 'string' ? data.error : `the server returned an unexpected response (error ${res.status}).`;
    return { ok: false, error: uploadMessage(reason) };
  }
  const put = await putFile(data.signedUrl, file);
  if (!put.ok) {
    console.error('[video request] upload: storage rejected the file', put.error);
    return { ok: false, error: uploadMessage(storageReason(put.error)) };
  }
  return { ok: true, path: data.path, requestId: String(data.requestId ?? '') };
}

export async function submitVideoRequest(input: VideoRequestInput, deps: SubmitDeps = {}): Promise<SubmitResult> {
  const fetchImpl = deps.fetchImpl ?? fetch;
  const putFile = deps.putFile ?? putFileToSignedUrl;
  const shrink = deps.shrink ?? shrinkScreenshot;
  const description = input.description.trim();
  const questionNumber = input.questionNumber?.trim() || null;

  // 1. Validate.
  if (input.requireQuestion && !input.lessonId) return { ok: false, step: 'validate', error: 'Choose the lesson you are stuck on.' };
  if (input.requireQuestion && !questionNumber && !input.file) {
    return { ok: false, step: 'validate', error: 'Add the question number or a screenshot of the question.' };
  }
  if (!description) return { ok: false, step: 'validate', error: 'Describe the problem you need help with.' };

  let file = input.file ?? null;
  if (file) {
    if (!(file.type in SCREENSHOT_TYPES)) return { ok: false, step: 'validate', error: WRONG_TYPE_MESSAGE };
    // 2. Compress only when needed.
    if (file.size > MAX_SCREENSHOT_BYTES) {
      deps.onStep?.('compressing');
      const smaller = await shrink(file);
      if (!smaller || smaller.size > MAX_SCREENSHOT_BYTES) return { ok: false, step: 'validate', error: TOO_LARGE_MESSAGE };
      file = smaller;
    }
  }

  // 3. Upload.
  let screenshotPath: string | undefined;
  let requestId: string | undefined;
  let imageSkipped: string | undefined;
  if (file) {
    deps.onStep?.('uploading');
    const up = await uploadScreenshot(file, fetchImpl, putFile);
    if (up.ok) {
      screenshotPath = up.path;
      requestId = up.requestId || undefined;
    } else if (!input.requireQuestion || questionNumber) {
      // The request still makes sense without the picture: save it anyway.
      imageSkipped = up.error;
    } else {
      return { ok: false, step: 'upload', error: up.error };
    }
  }

  // 4. Save.
  deps.onStep?.('saving');
  let res: Response;
  try {
    res = await fetchImpl('/api/video-requests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description,
        lessonId: input.lessonId || undefined,
        chapterId: input.chapterId || undefined,
        questionNumber: questionNumber ?? undefined,
        screenshotPath,
        requestId,
        requireQuestion: input.requireQuestion || undefined,
      }),
    });
  } catch (err) {
    console.error('[video request] save: could not reach the server', err);
    return { ok: false, step: 'save', error: 'Could not save your request: could not reach the server. Check your connection and try again.' };
  }
  const data = await readJson(res);
  if (!res.ok || !data || data.ok !== true || typeof data.id !== 'string') {
    console.error('[video request] save failed', res.status, data);
    const reason = typeof data?.error === 'string' ? data.error : `the server returned an unexpected response (error ${res.status}).`;
    return { ok: false, step: 'save', error: `Could not save your request: ${reason}` };
  }
  return imageSkipped ? { ok: true, id: data.id, imageSkipped } : { ok: true, id: data.id };
}
