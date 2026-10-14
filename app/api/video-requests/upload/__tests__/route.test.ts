import { beforeEach, describe, expect, it, vi } from 'vitest';

const STUDENT = '22222222-2222-4222-8222-222222222222';

const mocks = vi.hoisted(() => ({
  user: null as null | { id: string; role: string },
  tier: 1,
  sign: vi.fn(),
}));

vi.mock('@/lib/auth/session', () => ({ getCurrentUser: async () => mocks.user }));
vi.mock('@/lib/subscriptions/getUserTier', () => ({ getUserTier: async () => mocks.tier, TIER_PLUS: 1 }));
vi.mock('@/lib/storage/signedUpload', () => ({ createSignedUploadUrl: mocks.sign }));
vi.mock('@/lib/videoRequests/student', () => ({ SCREENSHOT_BUCKET: 'video-request-screenshots' }));

import { POST } from '@/app/api/video-requests/upload/route';

const post = (body: unknown) =>
  POST(new Request('http://localhost/api/video-requests/upload', { method: 'POST', body: JSON.stringify(body) }) as never);

beforeEach(() => {
  mocks.user = { id: STUDENT, role: 'student' };
  mocks.tier = 1;
  mocks.sign.mockReset();
  mocks.sign.mockImplementation(async (_b: string, path: string) => ({ signedUrl: `https://storage.test/sign/${path}?token=t` }));
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('POST /api/video-requests/upload', () => {
  it("mints {student}/{request_id}-{timestamp}.{ext} in the student's own folder", async () => {
    const res = await post({ contentType: 'image/webp', size: 300_000, path: '../../other-student/x.png' });
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.path).toMatch(new RegExp(`^${STUDENT}/${body.requestId}-\\d{13}\\.webp$`));
    expect(mocks.sign).toHaveBeenCalledWith('video-request-screenshots', body.path);
  });

  it('rejects an oversized file with the size message', async () => {
    const res = await post({ contentType: 'image/png', size: 4 * 1024 * 1024 + 1 });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ ok: false, success: false, error: 'Image is too large (max 4 MB)' });
    expect(mocks.sign).not.toHaveBeenCalled();
  });

  it('rejects other file types', async () => {
    const res = await post({ contentType: 'application/pdf', size: 1000 });
    expect(res.status).toBe(400);
    expect(mocks.sign).not.toHaveBeenCalled();
  });

  it('hides storage details when signing fails', async () => {
    mocks.sign.mockResolvedValueOnce({ error: 'Could not create a signed upload URL (HTTP 400): {"statusCode":"404","error":"Bucket not found"}' });
    const res = await post({ contentType: 'image/png', size: 1000 });
    expect(res.status).toBe(502);
    const body = await res.json();
    expect(body).toEqual({ ok: false, success: false, error: 'storage is not available right now. Please try again in a minute.' });
  });

  it('requires a signed-in Plus/Pro student', async () => {
    mocks.tier = 0;
    expect((await post({ contentType: 'image/png', size: 1000 })).status).toBe(403);
    mocks.user = null;
    expect((await post({ contentType: 'image/png', size: 1000 })).status).toBe(401);
  });
});
