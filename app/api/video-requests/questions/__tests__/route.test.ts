import { beforeEach, describe, expect, it, vi } from 'vitest';

const LESSON = '11111111-1111-4111-8111-111111111111';
const AS_QUESTION = 'aaaaaaaa-0000-4000-8000-0000000000a1';

const mocks = vi.hoisted(() => ({
  user: null as null | { id: string; role: string },
  tier: 1,
  saved: null as string | null,
  topic: null as null | { id: string; curriculum_ids: string[]; required_tier: number },
  calls: [] as { sql: string; params: unknown[] }[],
}));

vi.mock('@/lib/auth/session', () => ({ getCurrentUser: async () => mocks.user }));
vi.mock('@/lib/subscriptions/getUserTier', () => ({ getUserTier: async () => mocks.tier, TIER_PLUS: 1 }));
vi.mock('@/lib/curricula/queries', () => ({ getUserCurriculum: async () => mocks.saved }));
vi.mock('@/lib/db/client', () => ({
  query: async (sql: string, params: unknown[]) => {
    mocks.calls.push({ sql, params });
    if (/FROM topics/.test(sql)) return { rows: mocks.topic && params[0] === mocks.topic.id ? [mocks.topic] : [] };
    if (/SELECT curriculum_id FROM problems/.test(sql)) return { rows: params[0] === AS_QUESTION ? [{ curriculum_id: 'as' }] : [] };
    const bank = params[1];
    return {
      rows: [
        { id: `${bank}-1`, problem_number: 1, question_text: `A ${bank} question about momentum` },
        { id: `${bank}-2`, problem_number: null, question_text: 'x'.repeat(200) },
      ],
    };
  },
}));

import { GET } from '@/app/api/video-requests/questions/route';

// GET reads req.nextUrl (a NextRequest); a plain Request plus nextUrl is enough here.
const get = (qs: string) =>
  GET(Object.assign(new Request('http://localhost/'), { nextUrl: new URL(`http://localhost/api/video-requests/questions?${qs}`) }) as never);

beforeEach(() => {
  mocks.user = { id: 'student-1', role: 'student' };
  mocks.tier = 1;
  mocks.saved = null;
  mocks.topic = { id: LESSON, curriculum_ids: ['igcse', 'as'], required_tier: 0 };
  mocks.calls = [];
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

describe('GET /api/video-requests/questions', () => {
  it("lists the lesson's questions, numbered like the practice page", async () => {
    const body = await (await get(`lesson=${LESSON}`)).json();
    expect(body.ok).toBe(true);
    expect(body.questions.map((q: { id: string; number: number }) => [q.id, q.number])).toEqual([['igcse-1', 1], ['igcse-2', 2]]);
    expect(body.questions[0].label).toBe('Q1 — A igcse question about momentum');
    expect(body.questions[1].label.length).toBeLessThan(80);
  });

  it("uses the pre-selected question's bank, then the student's curriculum", async () => {
    let body = await (await get(`lesson=${LESSON}&question=${AS_QUESTION}`)).json();
    expect(body.questions[0].id).toBe('as-1');
    mocks.saved = 'as';
    body = await (await get(`lesson=${LESSON}`)).json();
    expect(body.questions[0].id).toBe('as-1');
  });

  it('returns numbers only when the lesson is above the student\'s tier', async () => {
    mocks.topic = { id: LESSON, curriculum_ids: ['igcse'], required_tier: 2 };
    const body = await (await get(`lesson=${LESSON}`)).json();
    expect(body.questions.map((q: { label: string }) => q.label)).toEqual(['Question 1', 'Question 2']);
  });

  it('an unknown or malformed lesson is an empty list, not an error', async () => {
    for (const lesson of ['99999999-9999-4999-8999-999999999999', "x' OR 1=1"]) {
      const res = await get(`lesson=${encodeURIComponent(lesson)}`);
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ ok: true, questions: [] });
    }
    expect(mocks.calls.some((c) => c.params.includes("x' OR 1=1"))).toBe(false);
  });

  it('is Plus/Pro only and needs a login', async () => {
    mocks.tier = 0;
    expect((await get(`lesson=${LESSON}`)).status).toBe(403);
    mocks.user = null;
    expect((await get(`lesson=${LESSON}`)).status).toBe(401);
  });
});
