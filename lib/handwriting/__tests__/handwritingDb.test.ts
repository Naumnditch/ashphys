/**
 * Handwritten solutions against a real, THROWAWAY database: the migration's
 * row-level security on its own, and the real API routes on top of it.
 *
 *   TEST_DATABASE_URL=postgres://user:pass@localhost:5432/ashphys_test npm run test:db
 *
 * Loads database/tests/base-schema.sql if the database is empty, the
 * solutions catalog tables if missing, then
 * database/seeds/2026-10-28-question-handwriting.sql (idempotent; it does
 * not need the 2026-10-14 migrations). Rows it creates are deleted
 * afterwards. Skipped without TEST_DATABASE_URL.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { Client } from 'pg';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { HandwritingDoc, HwStroke } from '@/lib/handwriting/types';

const url = process.env.TEST_DATABASE_URL;
const root = path.resolve(__dirname, '../../..');

const session = vi.hoisted(() => ({ user: null as null | { id: string; role: string }, tier: 0 }));
vi.mock('@/lib/auth/session', () => ({ getCurrentUser: async () => session.user }));
vi.mock('@/lib/subscriptions/getUserTier', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@/lib/subscriptions/getUserTier')>()),
  getUserTier: async () => session.tier,
}));

function stroke(y: number, color = '#1b2a41'): HwStroke {
  return {
    id: `s${Math.round(y)}${Math.random().toString(36).slice(2, 6)}`,
    tool: 'pen',
    color,
    width: 3,
    opacity: 1,
    pressure: true,
    points: Array.from({ length: 12 }, (_, i) => [10 + i * 8, y + (i % 3), Math.round((0.3 + i / 40) * 100) / 100] as [number, number, number]),
  };
}

const doc = (strokes: HwStroke[]): HandwritingDoc => ({ v: 1, pages: [{ id: 'p1', background: 'grid', strokes }] });

describe.skipIf(!url)('handwritten solutions (TEST_DATABASE_URL)', () => {
  let db: Client;
  const admin = randomUUID();
  const alice = randomUUID(); // answers wrong
  const bob = randomUUID(); // answers right
  const carol = randomUUID(); // never answers
  let courseId = '';
  let lessonId = '';
  let lockedLessonId = '';
  let q1 = '';
  let q2 = '';
  let qLocked = '';

  let adminRoute: typeof import('@/app/api/admin/handwriting/[problemId]/route');
  let viewRoute: typeof import('@/app/api/practice/[topicId]/handwriting/[problemId]/route');

  beforeAll(async () => {
    process.env.DATABASE_URL = url;
    db = new Client({ connectionString: url });
    await db.connect();
    if (!(await db.query(`SELECT to_regclass('public.users') IS NOT NULL AS ok`)).rows[0].ok) {
      await db.query(readFileSync(path.join(root, 'database/tests/base-schema.sql'), 'utf8'));
    }
    if (!(await db.query(`SELECT to_regclass('public.solution_access_log') IS NOT NULL AS ok`)).rows[0].ok) {
      await db.query(readFileSync(path.join(root, 'database/seeds/2026-09-27-solutions-catalog.sql'), 'utf8'));
    }
    await db.query(readFileSync(path.join(root, 'database/seeds/2026-10-28-question-handwriting.sql'), 'utf8'));

    await db.query(
      `INSERT INTO users (id, email, role) VALUES ($1, $2, 'admin'), ($3, $4, 'student'), ($5, $6, 'student'), ($7, $8, 'student')`,
      [admin, `${admin}@test.local`, alice, `${alice}@test.local`, bob, `${bob}@test.local`, carol, `${carol}@test.local`]
    );
    courseId = (await db.query(`INSERT INTO courses (title, code) VALUES ('HW course', '0625') RETURNING id`)).rows[0].id;
    const chapterId = (
      await db.query(`INSERT INTO chapters (course_id, chapter_number, title) VALUES ($1, 777, 'HW') RETURNING id`, [courseId])
    ).rows[0].id;
    lessonId = (await db.query(`INSERT INTO topics (chapter_id, topic_name, "order") VALUES ($1, 'Momentum', 1) RETURNING id`, [chapterId])).rows[0].id;
    lockedLessonId = (
      await db.query(`INSERT INTO topics (chapter_id, topic_name, "order", required_tier) VALUES ($1, 'Pro lesson', 2, 2) RETURNING id`, [chapterId])
    ).rows[0].id;
    const addQ = async (topic: string) =>
      (await db.query(`INSERT INTO problems (chapter_id, topic_id, question_text) VALUES ($1, $2, 'Q') RETURNING id`, [chapterId, topic])).rows[0].id;
    q1 = await addQ(lessonId);
    q2 = await addQ(lessonId);
    qLocked = await addQ(lockedLessonId);

    adminRoute = await import('@/app/api/admin/handwriting/[problemId]/route');
    viewRoute = await import('@/app/api/practice/[topicId]/handwriting/[problemId]/route');
  });

  afterAll(async () => {
    if (db) {
      await db.query(`DELETE FROM users WHERE id = ANY($1)`, [[admin, alice, bob, carol]]);
      await db.query(`DELETE FROM courses WHERE id = $1`, [courseId]);
      await db.end();
    }
    const { closePool } = await import('@/lib/db/client');
    await closePool();
  });

  beforeEach(() => {
    session.user = null;
    session.tier = 0;
  });

  const as = (id: string, role = 'student', tier = 0) => {
    session.user = { id, role };
    session.tier = tier;
  };

  const put = (problemId: string, body: unknown) =>
    adminRoute.PUT(
      new Request(`http://localhost/api/admin/handwriting/${problemId}`, { method: 'PUT', body: JSON.stringify(body) }) as never,
      { params: { problemId } }
    );
  const adminGet = (problemId: string) => adminRoute.GET(new Request('http://localhost') as never, { params: { problemId } });
  const status = (problemId: string, topicId = lessonId) =>
    viewRoute.GET(new Request('http://localhost') as never, { params: { topicId, problemId } });
  const open = (problemId: string, topicId = lessonId) =>
    viewRoute.POST(new Request('http://localhost', { method: 'POST' }) as never, { params: { topicId, problemId } });

  async function answer(student: string, problemId: string, correct: boolean) {
    await db.query(`INSERT INTO practice_attempts (student_id, problem_id, topic_id, is_correct) VALUES ($1, $2, $3, $4)`, [
      student,
      problemId,
      lessonId,
      correct,
    ]);
  }

  /** Raw SQL as ashphys_user with app.user_id (the database alone, no API). */
  async function asRole<T>(userId: string | null, fn: (c: Client) => Promise<T>): Promise<T> {
    await db.query('BEGIN');
    try {
      await db.query('SET LOCAL ROLE ashphys_user');
      await db.query(`SELECT set_config('app.user_id', $1, true)`, [userId ?? '']);
      return await fn(db);
    } finally {
      await db.query('ROLLBACK');
    }
  }

  // ------------------------------------------------------------- admin writes

  it('admin saves, reloads exactly what was written, and the version moves on', async () => {
    as(admin, 'admin');
    const written = doc([stroke(40), stroke(400, '#b34a3c')]);
    let res: Response = await put(q1, { doc: written, baseVersion: 0 });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ success: true, version: 1, strokeCount: 2 });

    res = await adminGet(q1);
    const loaded = await res.json();
    expect(loaded.version).toBe(1);
    expect(loaded.doc).toEqual(written);

    res = await put(q1, { doc: doc([stroke(40), stroke(400, '#b34a3c'), stroke(900)]), baseVersion: 1 });
    expect((await res.json()).version).toBe(2);

    const row = (await db.query(`SELECT lesson_id, updated_by, created_by, page_count, stroke_count, jsonb_array_length(snapshots) AS n, preview IS NOT NULL AS has_preview, created_at <= updated_at AS ordered FROM question_handwriting WHERE question_id = $1`, [q1])).rows[0];
    expect(row).toEqual({ lesson_id: lessonId, updated_by: admin, created_by: admin, page_count: 1, stroke_count: 3, n: 1, has_preview: true, ordered: true });
  });

  it('refuses a save from a stale tab with 409 unless forced', async () => {
    as(admin, 'admin');
    const { version } = await (await adminGet(q1)).json();
    let res = await put(q1, { doc: doc([stroke(10)]), baseVersion: version - 1 });
    expect(res.status).toBe(409);
    expect((await res.json()).conflict.version).toBe(version);
    res = await put(q1, { doc: doc([stroke(40), stroke(400, '#b34a3c'), stroke(900)]), baseVersion: version - 1, force: true });
    expect(res.status).toBe(200);
  });

  it('rejects invalid strokes before touching the database', async () => {
    as(admin, 'admin');
    const bad = doc([{ ...stroke(10), color: 'url(javascript:alert(1))' }]);
    const res = await put(q1, { doc: bad, baseVersion: 0 });
    expect(res.status).toBe(400);
  });

  it('students cannot write through the API', async () => {
    as(alice);
    for (const res of [await put(q2, { doc: doc([stroke(10)]), baseVersion: 0 }), await adminGet(q1)]) {
      expect(res.status).toBe(403);
      expect(await res.json()).toEqual({ success: false, error: 'Not authorized' });
    }
    expect((await db.query(`SELECT 1 FROM question_handwriting WHERE question_id = $1`, [q2])).rowCount).toBe(0);
  });

  it('students cannot write directly in the database either (row-level security)', async () => {
    await answer(alice, q1, false);
    await expect(
      asRole(alice, (c) =>
        c.query(`INSERT INTO question_handwriting (lesson_id, question_id, doc) VALUES ($1, $2, '{}'::jsonb)`, [lessonId, q2])
      )
    ).rejects.toMatchObject({ code: '42501' });
    // UPDATE and DELETE find no row they are allowed to change, even one they can read.
    const updated = await asRole(alice, (c) => c.query(`UPDATE question_handwriting SET stroke_count = 0 WHERE question_id = $1`, [q1]));
    const deleted = await asRole(alice, (c) => c.query(`DELETE FROM question_handwriting WHERE question_id = $1`, [q1]));
    expect(updated.rowCount).toBe(0);
    expect(deleted.rowCount).toBe(0);
    expect((await db.query(`SELECT stroke_count FROM question_handwriting WHERE question_id = $1`, [q1])).rows[0].stroke_count).toBe(3);
  });

  it('the read policy shows a row only to admins and to students who answered it wrong', async () => {
    await answer(bob, q1, true);
    const visible = async (userId: string | null) =>
      (await asRole(userId, (c) => c.query(`SELECT doc FROM question_handwriting WHERE question_id = $1`, [q1]))).rowCount;
    expect(await visible(admin)).toBe(1);
    expect(await visible(alice)).toBe(1); // answered wrong above
    expect(await visible(bob)).toBe(0); // only ever right
    expect(await visible(carol)).toBe(0); // never answered
    expect(await visible(null)).toBe(0); // anonymous
  });

  // ------------------------------------------------------------ student reads

  it('unanswered: 403 without saying whether a solution exists', async () => {
    as(carol);
    for (const q of [q1, q2]) {
      const res = await status(q);
      expect(res.status).toBe(403);
      const body = await res.json();
      expect(body).toEqual({ success: false, error: 'Answer this question first.', reason: 'answer_first' });
    }
    expect((await open(q1)).status).toBe(403);
  });

  it('answered correctly: still nothing', async () => {
    as(bob);
    expect((await status(q1)).status).toBe(403);
    expect((await open(q1)).status).toBe(403);
  });

  it('answered wrong (Free): status shows it costs a view and holds no ink; opening spends one view once', async () => {
    as(alice);
    let res = await status(q1);
    let body = await res.json();
    expect(body).toMatchObject({ success: true, available: true, pageCount: 1, access: { allowed: false, costsView: true, viewsUsed: 0, viewLimit: 2 } });
    expect(body.pages).toBeUndefined();
    expect(body.preview).toBeNull();

    res = await open(q1);
    body = await res.json();
    expect(body.access).toMatchObject({ allowed: true, viewsUsed: 1, viewLimit: 2 });
    expect(body.pages).toHaveLength(1);
    expect(body.pages[0].body).toContain('<path d="M');

    // Reopening is free and the status now says it is unlocked.
    body = await (await open(q1)).json();
    expect(body.access.viewsUsed).toBe(1);
    body = await (await status(q1)).json();
    expect(body.access).toMatchObject({ allowed: true, costsView: false });

    const log = await db.query(`SELECT action, solution_id, problem_id FROM solution_access_log WHERE user_id = $1 ORDER BY accessed_at`, [alice]);
    expect(log.rows.every((r) => r.problem_id === q1 && r.solution_id === null && r.action === 'view_full')).toBe(true);
    expect(log.rowCount).toBe(2);
  });

  it('out of views: the teaser instead of the solution, and the block is logged', async () => {
    as(alice);
    await answer(alice, q2, false);
    session.user = { id: admin, role: 'admin' };
    await put(q2, { doc: doc([stroke(0), stroke(2000)]), baseVersion: 0 });
    as(alice);
    await db.query(`UPDATE user_solution_views SET views_count = 2 WHERE user_id = $1`, [alice]);

    let body = await (await status(q2)).json();
    expect(body.access).toMatchObject({ allowed: false, costsView: false, reason: 'limit_reached', viewsUsed: 2, viewLimit: 2 });
    expect(body.preview.body).toContain('<path');
    expect(body.pages).toBeUndefined();

    body = await (await open(q2)).json();
    expect(body.access).toMatchObject({ allowed: false, reason: 'limit_reached' });
    expect(body.pages).toBeUndefined();
    // The teaser holds the top stroke only, never the one further down.
    expect(body.preview.height).toBeLessThan(1000);
    expect((await db.query(`SELECT 1 FROM solution_access_log WHERE user_id = $1 AND problem_id = $2 AND action = 'blocked'`, [alice, q2])).rowCount).toBe(1);

    // The earlier unlock still opens.
    expect((await (await open(q1)).json()).pages).toHaveLength(1);
  });

  it('Pro: unlimited, no teaser', async () => {
    as(alice, 'student', 2);
    const body = await (await open(q2)).json();
    expect(body.access).toMatchObject({ allowed: true, viewLimit: null });
    expect(body.pages).toHaveLength(1);
  });

  it("another student's wrong answer doesn't unlock it for you", async () => {
    as(carol, 'student', 2);
    expect((await status(q2)).status).toBe(403);
  });

  it('the lesson tier gate applies first', async () => {
    await db.query(`INSERT INTO practice_attempts (student_id, problem_id, topic_id, is_correct) VALUES ($1, $2, $3, false)`, [alice, qLocked, lockedLessonId]);
    as(alice, 'student', 1);
    const res = await status(qLocked, lockedLessonId);
    expect(res.status).toBe(403);
    expect((await res.json()).error).toMatch(/higher plan/);
  });

  it('a question asked for under the wrong lesson is not found', async () => {
    as(alice);
    expect((await status(q1, lockedLessonId)).status).toBe(404);
  });

  it('a cleared solution shows nothing to students', async () => {
    as(admin, 'admin');
    const { version } = await (await adminGet(q2)).json();
    expect((await put(q2, { doc: doc([]), baseVersion: version })).status).toBe(200);
    as(alice);
    expect(await (await status(q2)).json()).toEqual({ success: true, available: false });
    expect(await (await open(q2)).json()).toEqual({ success: true, available: false });
  });

  it('admins see the snapshots without answering', async () => {
    as(admin, 'admin');
    const body = await (await status(q1)).json();
    expect(body).toMatchObject({ available: true, access: { allowed: true, viewLimit: null } });
    expect(body.pages).toHaveLength(1);
  });

  it('signed out: 401', async () => {
    expect((await status(q1)).status).toBe(401);
    expect((await put(q1, { doc: doc([]), baseVersion: 0 })).status).toBe(403);
  });
});
