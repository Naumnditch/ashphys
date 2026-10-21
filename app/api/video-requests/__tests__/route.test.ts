import { beforeEach, describe, expect, it, vi } from 'vitest';

const STUDENT = '22222222-2222-4222-8222-222222222222';
const OTHER = '33333333-3333-4333-8333-333333333333';
const REQ = 'aaaaaaaa-0000-4000-8000-000000000001';
const PATH = `${STUDENT}/${REQ}-1792013761074.png`;

const mocks = vi.hoisted(() => ({
  user: null as null | { id: string; role: string },
  tier: 1,
  create: vi.fn(),
  del: vi.fn(async () => true),
  query: vi.fn(async () => ({ rows: [{ n: 0 }] })),
}));

vi.mock('@/lib/auth/session', () => ({ getCurrentUser: async () => mocks.user }));
vi.mock('@/lib/subscriptions/getUserTier', () => ({ getUserTier: async () => mocks.tier, TIER_PLUS: 1 }));
vi.mock('@/lib/settings', () => ({ getMaxOpenVideoRequests: async () => 3 }));
vi.mock('@/lib/db/client', () => ({ query: mocks.query }));
vi.mock('@/lib/storage/deleteObject', () => ({ deleteStorageObject: mocks.del }));
vi.mock('@/lib/videoRequests/student', () => ({
  SCREENSHOT_BUCKET: 'video-request-screenshots',
  createVideoRequest: mocks.create,
  getMyVideoRequests: vi.fn(async () => []),
}));

import { POST } from '@/app/api/video-requests/route';

const post = (body: unknown) =>
  POST(new Request('http://localhost/api/video-requests', { method: 'POST', body: JSON.stringify(body) }) as never);

beforeEach(() => {
  mocks.user = { id: STUDENT, role: 'student' };
  mocks.tier = 1;
  mocks.create.mockReset();
  mocks.create.mockResolvedValue(REQ);
  mocks.del.mockClear();
  mocks.query.mockClear();
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('POST /api/video-requests', () => {
  it('saves a request without a screenshot, as the session user', async () => {
    const res = await post({ description: 'Why?', questionNumber: 'Q2', student_id: OTHER, studentId: OTHER });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ ok: true, success: true, id: REQ });
    const [student, input] = mocks.create.mock.calls[0];
    expect(student.id).toBe(STUDENT); // never the body's student_id
    expect(input).toMatchObject({ description: 'Why?', questionNumber: 'Q2', screenshotPath: null, id: null });
  });

  it('saves a request with a valid screenshot and stores its path under the minted id', async () => {
    const res = await post({ description: 'Q7b', screenshotPath: PATH, requestId: REQ });
    expect(await res.json()).toEqual({ ok: true, success: true, id: REQ });
    expect(mocks.create.mock.calls[0][1]).toMatchObject({ id: REQ, screenshotPath: PATH });
    expect(mocks.del).not.toHaveBeenCalled();
  });

  it("refuses another student's screenshot path and never deletes it", async () => {
    const res = await post({ description: 'x', screenshotPath: `${OTHER}/${REQ}-1792013761074.png` });
    expect(res.status).toBe(400);
    expect((await res.json()).ok).toBe(false);
    expect(mocks.create).not.toHaveBeenCalled();
    expect(mocks.del).not.toHaveBeenCalled();
  });

  it('deletes the uploaded screenshot when the insert fails, with a readable error', async () => {
    mocks.create.mockRejectedValueOnce(new Error('role "ashphys_user" does not exist'));
    const res = await post({ description: 'x', screenshotPath: PATH });
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body).toEqual({ ok: false, success: false, error: 'the server could not store it right now. Please try again in a minute.' });
    expect(JSON.stringify(body)).not.toMatch(/ashphys_user|role/);
    expect(mocks.del).toHaveBeenCalledWith('video-request-screenshots', PATH);
  });

  it('cleans up the screenshot when validation fails after the upload', async () => {
    const res = await post({ description: '   ', screenshotPath: PATH });
    expect(res.status).toBe(400);
    expect(mocks.del).toHaveBeenCalledWith('video-request-screenshots', PATH);
  });

  it('rejects Free tier and signed-out callers with JSON', async () => {
    mocks.tier = 0;
    expect((await post({ description: 'x' })).status).toBe(403);
    mocks.user = null;
    const res = await post({ description: 'x' });
    expect(res.status).toBe(401);
    expect((await res.json()).ok).toBe(false);
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('enforces the homepage rules (lesson + question number or screenshot)', async () => {
    const r1 = await post({ description: 'x', requireQuestion: true });
    expect((await r1.json()).error).toMatch(/choose the lesson/);
    const r2 = await post({ description: 'x', requireQuestion: true, lessonId: 'bbbbbbbb-0000-4000-8000-000000000002' });
    expect((await r2.json()).error).toMatch(/question number or a screenshot/);
  });

  describe('a practice question (questionId)', () => {
    const LESSON = 'bbbbbbbb-0000-4000-8000-000000000002';
    const QUESTION = 'eeeeeeee-0000-4000-8000-000000000001';
    // The open-request count, then the question lookup.
    const withQuestion = (row: { topic_id: string; number: number } | null) =>
      mocks.query.mockImplementation((async (sql: string) =>
        /FROM problems/.test(sql) ? { rows: row ? [row] : [] } : { rows: [{ n: 0 }] }) as never);

    it('stores the question with its number when it belongs to the lesson', async () => {
      withQuestion({ topic_id: LESSON, number: 7 });
      const res = await post({ description: 'x', lessonId: LESSON, questionId: QUESTION });
      expect(res.status).toBe(200);
      expect(mocks.create.mock.calls[0][1]).toMatchObject({ topicId: LESSON, questionId: QUESTION, questionNumber: '7' });
    });

    it("keeps the student's own question number and takes the lesson from the question when none is given", async () => {
      withQuestion({ topic_id: LESSON, number: 7 });
      await post({ description: 'x', questionId: QUESTION, questionNumber: '7b' });
      expect(mocks.create.mock.calls[0][1]).toMatchObject({ topicId: LESSON, questionId: QUESTION, questionNumber: '7b' });
    });

    it('refuses a question from another lesson, an unknown one, or a malformed id', async () => {
      withQuestion({ topic_id: 'ffffffff-0000-4000-8000-000000000009', number: 1 });
      const r1 = await post({ description: 'x', lessonId: LESSON, questionId: QUESTION });
      expect(r1.status).toBe(400);
      expect((await r1.json()).error).toMatch(/not in the chosen lesson/);
      withQuestion(null);
      expect((await post({ description: 'x', lessonId: LESSON, questionId: QUESTION })).status).toBe(400);
      expect((await post({ description: 'x', lessonId: LESSON, questionId: "1' OR 1=1" })).status).toBe(400);
      expect(mocks.create).not.toHaveBeenCalled();
    });

    it('a general request (no questionId) stores no question', async () => {
      await post({ description: 'x', lessonId: LESSON });
      expect(mocks.create.mock.calls[0][1]).toMatchObject({ topicId: LESSON, questionId: null });
      expect(mocks.query.mock.calls.some((c) => /FROM problems/.test(String((c as unknown[])[0])))).toBe(false);
    });
  });
});
