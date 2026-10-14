import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { submitVideoRequest } from '@/lib/videoRequests/submit';
import { MAX_SCREENSHOT_BYTES, checkScreenshot, requestIdFromScreenshotPath } from '@/lib/videoRequests/screenshot';

const STUDENT = '22222222-2222-4222-8222-222222222222';
const REQ = 'aaaaaaaa-0000-4000-8000-000000000001';
const PATH = `${STUDENT}/${REQ}-1792013761074.png`;

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

function image(size: number, type = 'image/png', name = 'q7.png') {
  return new File([new Uint8Array(size)], name, { type });
}

/** A fetch stub routing by URL; records calls. */
function server(handlers: { upload?: () => Response | Promise<Response>; save?: (body: any) => Response | Promise<Response> }) {
  const calls: { url: string; body: any }[] = [];
  const fetchImpl = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const body = init?.body ? JSON.parse(String(init.body)) : undefined;
    calls.push({ url, body });
    if (url === '/api/video-requests/upload') return (handlers.upload ?? (() => json(200, { ok: true, requestId: REQ, path: PATH, signedUrl: 'https://storage.test/upload/sign/x?token=t' })))();
    if (url === '/api/video-requests') return (handlers.save ?? (() => json(200, { ok: true, id: REQ })))(body);
    throw new Error(`unexpected ${url}`);
  }) as unknown as typeof fetch;
  return { fetchImpl, calls };
}

let consoleError: ReturnType<typeof vi.spyOn>;
beforeEach(() => {
  consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => consoleError.mockRestore());

describe('submitVideoRequest', () => {
  it('saves a request without a screenshot (no upload step)', async () => {
    const { fetchImpl, calls } = server({ save: () => json(200, { ok: true, id: 'new-id' }) });
    const putFile = vi.fn();
    const r = await submitVideoRequest({ description: '  Why does it orbit?  ', lessonId: 'L1', questionNumber: 'Q2' }, { fetchImpl, putFile });
    expect(r).toEqual({ ok: true, id: 'new-id' });
    expect(calls.map((c) => c.url)).toEqual(['/api/video-requests']);
    expect(calls[0].body).toMatchObject({ description: 'Why does it orbit?', lessonId: 'L1', questionNumber: 'Q2' });
    expect(calls[0].body.screenshotPath).toBeUndefined();
    expect(putFile).not.toHaveBeenCalled();
  });

  it('uploads a valid screenshot, then saves with its path and request id', async () => {
    const { fetchImpl, calls } = server({});
    const putFile = vi.fn(async () => ({ ok: true as const }));
    const file = image(800_000);
    const steps: string[] = [];
    const r = await submitVideoRequest({ description: 'Q7b', file }, { fetchImpl, putFile, onStep: (s) => steps.push(s) });
    expect(r).toEqual({ ok: true, id: REQ });
    expect(calls[0]).toEqual({ url: '/api/video-requests/upload', body: { contentType: 'image/png', size: 800_000 } });
    expect(putFile).toHaveBeenCalledWith('https://storage.test/upload/sign/x?token=t', file);
    expect(calls[1].body).toMatchObject({ screenshotPath: PATH, requestId: REQ });
    expect(steps).toEqual(['uploading', 'saving']);
  });

  it('rejects an oversized image that cannot be compressed, before any request', async () => {
    const { fetchImpl, calls } = server({});
    const shrink = vi.fn(async () => null);
    const r = await submitVideoRequest({ description: 'x', file: image(MAX_SCREENSHOT_BYTES + 1) }, { fetchImpl, shrink });
    expect(r).toEqual({ ok: false, step: 'validate', error: 'Image is too large (max 4 MB)' });
    expect(calls).toHaveLength(0);
  });

  it('compresses an oversized image and uploads the smaller file', async () => {
    const { fetchImpl, calls } = server({});
    const small = image(900_000, 'image/jpeg', 'q7.jpg');
    const shrink = vi.fn(async () => small);
    const putFile = vi.fn(async () => ({ ok: true as const }));
    const steps: string[] = [];
    const r = await submitVideoRequest(
      { description: 'x', file: image(6 * 1024 * 1024) },
      { fetchImpl, shrink, putFile, onStep: (s) => steps.push(s) }
    );
    expect(r.ok).toBe(true);
    expect(calls[0].body).toEqual({ contentType: 'image/jpeg', size: 900_000 });
    expect(putFile).toHaveBeenCalledWith(expect.any(String), small);
    expect(steps[0]).toBe('compressing');
  });

  it('rejects a non-image file type', async () => {
    const r = await submitVideoRequest({ description: 'x', file: image(10, 'application/pdf', 'q.pdf') }, { fetchImpl: server({}).fetchImpl });
    expect(r).toEqual({ ok: false, step: 'validate', error: 'Image upload failed: use a JPG, PNG or WebP image' });
  });

  it('names the upload step and hides raw storage details', async () => {
    const putFile = vi.fn(async () => ({ ok: false as const, error: 'storage rejected the upload (HTTP 400): {"key":"22222222/secret-path.png","statusCode":"400"}' }));
    const r = await submitVideoRequest(
      { description: 'x', lessonId: 'L1', file: image(1000), requireQuestion: true },
      { fetchImpl: server({}).fetchImpl, putFile }
    );
    expect(r).toEqual({ ok: false, step: 'upload', error: 'Image upload failed: the image server refused the file (error 400). Please try again.' });
    expect(JSON.stringify(r)).not.toMatch(/secret-path|22222222/);
    expect(consoleError).toHaveBeenCalled();
  });

  it('turns a storage size rejection into the size message', async () => {
    const putFile = vi.fn(async () => ({ ok: false as const, error: 'storage rejected the upload (HTTP 413): Payload too large' }));
    const r = await submitVideoRequest({ description: 'x', lessonId: 'L1', file: image(1000), requireQuestion: true }, { fetchImpl: server({}).fetchImpl, putFile });
    expect(r).toMatchObject({ ok: false, error: 'Image is too large (max 4 MB)' });
  });

  it('still saves the request without the image when the upload fails but the image is optional', async () => {
    const { fetchImpl, calls } = server({ upload: () => json(502, { ok: false, error: 'storage is not available right now. Please try again in a minute.' }) });
    const r = await submitVideoRequest({ description: 'x', file: image(1000) }, { fetchImpl });
    expect(r).toEqual({
      ok: true,
      id: REQ,
      imageSkipped: 'Image upload failed: storage is not available right now. Please try again in a minute.',
    });
    expect(calls[1].body.screenshotPath).toBeUndefined();
  });

  it('does not save when the screenshot was the only way to identify the question', async () => {
    const { fetchImpl, calls } = server({ upload: () => json(502, { ok: false, error: 'storage is not available right now.' }) });
    const r = await submitVideoRequest({ description: 'x', lessonId: 'L1', file: image(1000), requireQuestion: true }, { fetchImpl });
    expect(r).toEqual({ ok: false, step: 'upload', error: 'Image upload failed: storage is not available right now.' });
    expect(calls.map((c) => c.url)).toEqual(['/api/video-requests/upload']);
  });

  it('reports a non-JSON 500 from the save as a save failure (the original "Network error")', async () => {
    const { fetchImpl } = server({ save: () => new Response('<html>Internal Server Error</html>', { status: 500 }) });
    const r = await submitVideoRequest({ description: 'x' }, { fetchImpl });
    expect(r).toEqual({ ok: false, step: 'save', error: 'Could not save your request: the server returned an unexpected response (error 500).' });
    expect(consoleError).toHaveBeenCalled();
  });

  it('passes the server reason through for a failed save', async () => {
    const { fetchImpl } = server({ save: () => json(429, { ok: false, error: 'you already have 3 open video requests.' }) });
    const r = await submitVideoRequest({ description: 'x' }, { fetchImpl });
    expect(r).toEqual({ ok: false, step: 'save', error: 'Could not save your request: you already have 3 open video requests.' });
  });

  it('reports being offline', async () => {
    const fetchImpl = vi.fn(async () => Promise.reject(new TypeError('Failed to fetch'))) as unknown as typeof fetch;
    const r = await submitVideoRequest({ description: 'x' }, { fetchImpl });
    expect(r).toMatchObject({ ok: false, step: 'save', error: expect.stringMatching(/^Could not save your request: could not reach the server/) });
  });

  it('validates required fields first', async () => {
    const f = server({}).fetchImpl;
    expect(await submitVideoRequest({ description: ' ' }, { fetchImpl: f })).toMatchObject({ ok: false, step: 'validate' });
    expect(await submitVideoRequest({ description: 'x', requireQuestion: true }, { fetchImpl: f })).toMatchObject({
      error: 'Choose the lesson you are stuck on.',
    });
    expect(await submitVideoRequest({ description: 'x', lessonId: 'L1', requireQuestion: true }, { fetchImpl: f })).toMatchObject({
      error: 'Add the question number or a screenshot of the question.',
    });
  });
});

describe('screenshot rules', () => {
  it('checks type and the 4 MB limit', () => {
    expect(checkScreenshot({ type: 'image/webp', size: MAX_SCREENSHOT_BYTES })).toEqual({ ok: true });
    expect(checkScreenshot({ type: 'image/png', size: MAX_SCREENSHOT_BYTES + 1 })).toEqual({ ok: false, error: 'Image is too large (max 4 MB)' });
    expect(checkScreenshot({ type: 'image/gif', size: 10 }).ok).toBe(false);
    expect(checkScreenshot({ type: 'image/png', size: 0 }).ok).toBe(false);
  });

  it('accepts only paths minted for this student', () => {
    expect(requestIdFromScreenshotPath(PATH, STUDENT)).toBe(REQ);
    expect(requestIdFromScreenshotPath(PATH, '33333333-3333-4333-8333-333333333333')).toBeNull();
    expect(requestIdFromScreenshotPath(`${STUDENT}/../x/${REQ}-1792013761074.png`, STUDENT)).toBeNull();
    expect(requestIdFromScreenshotPath(`${STUDENT}/${REQ}-1792013761074.gif`, STUDENT)).toBeNull();
    expect(requestIdFromScreenshotPath(`${STUDENT}/1792013761074-q7.png`, STUDENT)).toBeNull();
  });
});
