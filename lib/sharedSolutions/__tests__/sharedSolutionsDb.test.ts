/**
 * Student workspaces and "Share my solution" against a real, THROWAWAY
 * database: the migration's row-level security, column grants and guard
 * trigger on their own, and the real API routes on top of them.
 *
 *   TEST_DATABASE_URL=postgres://user:pass@localhost:5432/ashphys_test npm run test:db
 *
 * Loads database/tests/base-schema.sql if the database is empty, the
 * solutions catalog tables if missing, a minimal problem_options table if
 * missing, then the question_handwriting and shared_solutions migrations
 * (both idempotent). Rows it creates are deleted afterwards. Skipped without
 * TEST_DATABASE_URL.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { Client } from 'pg';
import { NextRequest } from 'next/server';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import type { HandwritingDoc, HwStroke } from '@/lib/handwriting/types';
import { CONSENT_VERSION, consentText, LICENCE_TEXT } from '@/lib/sharedSolutions/consent';

const url = process.env.TEST_DATABASE_URL;
const root = path.resolve(__dirname, '../../..');

type SessionUser = { id: string; role: string; firstName: string | null; lastName: string | null };
const session = vi.hoisted(() => ({ user: null as null | SessionUser, tier: 0 }));
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
    pressure: false,
    points: Array.from({ length: 8 }, (_, i) => [10 + i * 8, y + (i % 2), 0.5] as [number, number, number]),
  };
}
const doc = (strokes: HwStroke[]): HandwritingDoc => ({ v: 1, pages: [{ id: 'p1', background: 'grid', strokes }] });

const CONSENT = { workedMyself: true, licence: true, consentVersion: CONSENT_VERSION };

describe.skipIf(!url)('student workspaces and shared solutions (TEST_DATABASE_URL)', () => {
  let db: Client;
  const ids = {
    admin: randomUUID(),
    admin2: randomUUID(),
    alice: randomUUID(), // shares
    bob: randomUUID(), // answers wrong: may see approved solutions
    carol: randomUUID(), // never answers
    dan: randomUUID(), // under 18
    erin: randomUUID(), // never says her age at first
    tess: randomUUID(), // teacher
  };
  const people: Record<keyof typeof ids, SessionUser> = {
    admin: { id: ids.admin, role: 'admin', firstName: 'Ada', lastName: 'Admin' },
    admin2: { id: ids.admin2, role: 'admin', firstName: 'Second', lastName: 'Admin' },
    alice: { id: ids.alice, role: 'student', firstName: 'Alice', lastName: 'anderson' },
    bob: { id: ids.bob, role: 'student', firstName: 'Bob', lastName: 'Brown' },
    carol: { id: ids.carol, role: 'student', firstName: 'Carol', lastName: 'Clark' },
    dan: { id: ids.dan, role: 'student', firstName: 'Dan', lastName: 'Doe' },
    erin: { id: ids.erin, role: 'student', firstName: 'Erin', lastName: 'Evans' },
    tess: { id: ids.tess, role: 'teacher', firstName: 'Tess', lastName: 'Teacher' },
  };
  let courseId = '';
  let lessonId = '';
  let lockedLessonId = '';
  let q1 = '';
  let q2 = '';
  let qLocked = '';

  let wsRoute: typeof import('@/app/api/practice/[topicId]/workspace/[problemId]/route');
  let shareRoute: typeof import('@/app/api/practice/[topicId]/workspace/[problemId]/share/route');
  let mineRoute: typeof import('@/app/api/shared-solutions/route');
  let withdrawRoute: typeof import('@/app/api/shared-solutions/[id]/route');
  let queueRoute: typeof import('@/app/api/admin/shared-solutions/route');
  let reviewRoute: typeof import('@/app/api/admin/shared-solutions/[id]/route');
  let viewRoute: typeof import('@/app/api/practice/[topicId]/handwriting/[problemId]/route');
  let teacherRoute: typeof import('@/app/api/admin/handwriting/[problemId]/route');

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
    // The live table (not in base-schema.sql): the review queue reads the correct option's text.
    await db.query(`CREATE TABLE IF NOT EXISTS problem_options (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(), problem_id uuid NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
      option_text text NOT NULL, option_letter varchar(5), is_correct boolean DEFAULT false, "order" integer)`);
    await db.query(readFileSync(path.join(root, 'database/seeds/2026-10-28-question-handwriting.sql'), 'utf8'));
    await db.query(readFileSync(path.join(root, 'database/seeds/2026-10-29-shared-solutions.sql'), 'utf8'));

    for (const p of Object.values(people)) {
      await db.query(`INSERT INTO users (id, email, role, first_name, last_name) VALUES ($1, $2, $3, $4, $5)`, [
        p.id,
        `${p.id}@test.local`,
        p.role,
        p.firstName,
        p.lastName,
      ]);
    }
    courseId = (await db.query(`INSERT INTO courses (title, code) VALUES ('Share course', '0625') RETURNING id`)).rows[0].id;
    const chapterId = (await db.query(`INSERT INTO chapters (course_id, chapter_number, title) VALUES ($1, 778, 'Share') RETURNING id`, [courseId])).rows[0].id;
    lessonId = (await db.query(`INSERT INTO topics (chapter_id, topic_name, "order") VALUES ($1, 'Momentum', 1) RETURNING id`, [chapterId])).rows[0].id;
    lockedLessonId = (
      await db.query(`INSERT INTO topics (chapter_id, topic_name, "order", required_tier) VALUES ($1, 'Pro lesson', 2, 2) RETURNING id`, [chapterId])
    ).rows[0].id;
    const addQ = async (topic: string, n: number, text: string) =>
      (
        await db.query(
          `INSERT INTO problems (chapter_id, topic_id, problem_number, question_text, answer_type, answer_correct, answer_unit, explanation)
           VALUES ($1, $2, $3, $4, 'numeric', '12', 'kg m/s', 'p = mv = 3 × 4') RETURNING id`,
          [chapterId, topic, n, text]
        )
      ).rows[0].id;
    q1 = await addQ(lessonId, 1, 'A 3 kg trolley moves at 4 m/s. Find its momentum.');
    q2 = await addQ(lessonId, 2, 'Second question');
    qLocked = await addQ(lockedLessonId, 1, 'Locked question');

    wsRoute = await import('@/app/api/practice/[topicId]/workspace/[problemId]/route');
    shareRoute = await import('@/app/api/practice/[topicId]/workspace/[problemId]/share/route');
    mineRoute = await import('@/app/api/shared-solutions/route');
    withdrawRoute = await import('@/app/api/shared-solutions/[id]/route');
    queueRoute = await import('@/app/api/admin/shared-solutions/route');
    reviewRoute = await import('@/app/api/admin/shared-solutions/[id]/route');
    viewRoute = await import('@/app/api/practice/[topicId]/handwriting/[problemId]/route');
    teacherRoute = await import('@/app/api/admin/handwriting/[problemId]/route');
  });

  afterAll(async () => {
    if (db) {
      await db.query(`DELETE FROM users WHERE id = ANY($1)`, [Object.values(ids)]);
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

  const as = (who: keyof typeof people, tier = 0) => {
    session.user = people[who];
    session.tier = tier;
  };

  // ---------------------------------------------------------------- requests
  const qParams = (problemId: string, topicId = lessonId) => ({ params: { topicId, problemId } });
  const req = (method: string, body?: unknown) =>
    new Request('http://localhost/api', { method, ...(body === undefined ? {} : { body: JSON.stringify(body) }) }) as never;

  const getWs = (problemId: string, topicId = lessonId) => wsRoute.GET(req('GET'), qParams(problemId, topicId));
  const putDoc = (problemId: string, body: unknown) => wsRoute.PUT(req('PUT', body), qParams(problemId));
  const putSteps = (problemId: string, stepsText: unknown) => wsRoute.PATCH(req('PATCH', { stepsText }), qParams(problemId));
  const shareForm = (problemId: string) => shareRoute.GET(req('GET'), qParams(problemId));
  const share = (problemId: string, body: Record<string, unknown>, topicId = lessonId) =>
    shareRoute.POST(req('POST', body), qParams(problemId, topicId));
  const withdraw = (id: string) => withdrawRoute.PATCH(req('PATCH', { action: 'withdraw' }), { params: { id } });
  const review = (id: string, body: Record<string, unknown>) => reviewRoute.PATCH(req('PATCH', body), { params: { id } });
  const queue = (status: string) => queueRoute.GET(new NextRequest(`http://localhost/api/admin/shared-solutions?status=${status}`));
  const openSolutions = (problemId: string) => viewRoute.POST(req('POST'), qParams(problemId));
  const solutionStatus = (problemId: string) => viewRoute.GET(req('GET'), qParams(problemId));

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

  const row = async (id: string) => (await db.query(`SELECT * FROM shared_solutions WHERE id = $1`, [id])).rows[0];

  const aliceDoc = doc([stroke(40), stroke(120, '#2563eb')]);
  const aliceSteps = 'p = mv\np = 3 × 4 = 12 kg m/s';
  let firstId = '';
  let liveId = '';

  // ------------------------------------------------------------- workspace

  it('a student saves their own working (canvas + typed steps), and nobody else can read it', async () => {
    as('alice');
    let res: Response = await putDoc(q1, { doc: aliceDoc, baseVersion: 0 });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ success: true, version: 1, strokeCount: 2 });
    res = await putSteps(q1, aliceSteps);
    expect(res.status).toBe(200);
    expect(await (await getWs(q1)).json()).toMatchObject({ success: true, doc: aliceDoc, version: 1, stepsText: aliceSteps });

    // Another student only ever gets their own (empty) workspace.
    as('bob');
    expect(await (await getWs(q1)).json()).toEqual({ success: true, doc: null, version: 0, updatedAt: null, stepsText: '' });

    // The database alone: only the owner's row is visible — not to other students, not to admins.
    const visible = async (viewer: string | null) =>
      (await asRole(viewer, (c) => c.query(`SELECT 1 FROM student_workspaces WHERE question_id = $1`, [q1]))).rowCount;
    expect(await visible(ids.alice)).toBe(1);
    expect(await visible(ids.bob)).toBe(0);
    expect(await visible(ids.admin)).toBe(0);
    expect(await visible(null)).toBe(0);
    await expect(
      asRole(ids.bob, (c) => c.query(`INSERT INTO student_workspaces (user_id, question_id) VALUES ($1, $2)`, [ids.alice, q2]))
    ).rejects.toMatchObject({ code: '42501' });
    const overwritten = await asRole(ids.bob, (c) => c.query(`UPDATE student_workspaces SET steps_text = 'x' WHERE user_id = $1`, [ids.alice]));
    expect(overwritten.rowCount).toBe(0);
  });

  it('typed steps saved before the first canvas save do not make the canvas conflict', async () => {
    as('erin');
    expect((await putSteps(q2, 'Momentum is conserved.')).status).toBe(200);
    const res = await putDoc(q2, { doc: doc([stroke(10)]), baseVersion: 0 });
    expect(res.status).toBe(200);
    expect((await res.json()).version).toBe(1);
    expect((await putSteps(q2, 'x'.repeat(5001))).status).toBe(413);
  });

  // ----------------------------------------------------------- the student

  it('the share form defaults to first name + last initial and asks for the age when unknown', async () => {
    as('alice');
    const body = await (await shareForm(q1)).json();
    expect(body).toEqual({ success: true, displayName: 'Alice A.', ageBand: null, consentVersion: CONSENT_VERSION, canShare: true, submissions: [] });
    as('tess');
    expect((await (await shareForm(q1)).json()).canShare).toBe(false);
  });

  it('a student can submit, see "pending", and withdraw', async () => {
    as('alice');
    let res: Response = await share(q1, { ...CONSENT, displayName: '  Alice   A. ', ageBand: '18_plus' });
    expect(res.status).toBe(200);
    const { solution } = await res.json();
    expect(solution).toMatchObject({ status: 'pending', displayName: 'Alice A.', verified: false, strokeCount: 2, hasSteps: true, rejectionReason: null });
    firstId = solution.id;

    // The row: a copy of the saved working, the display name and the consent record.
    const r = await row(firstId);
    expect(r).toMatchObject({
      user_id: ids.alice,
      question_id: q1,
      display_name: 'Alice A.',
      strokes: aliceDoc,
      steps_text: aliceSteps,
      stroke_count: 2,
      status: 'pending',
      verified: false,
      consent_version: CONSENT_VERSION,
      consent_text: consentText(false),
      parent_consent_at: null,
      reviewed_by: null,
    });
    expect(r.consent_text).toContain(LICENCE_TEXT);
    expect(r.consented_at).toBeInstanceOf(Date);
    expect(r.snapshots).toHaveLength(1);
    expect((await db.query(`SELECT age_band FROM users WHERE id = $1`, [ids.alice])).rows[0].age_band).toBe('18_plus');

    // Seen as pending on the question and in the dashboard list.
    expect((await (await shareForm(q1)).json()).submissions.map((s: { status: string }) => s.status)).toEqual(['pending']);
    const mine = (await (await mineRoute.GET()).json()).solutions;
    expect(mine).toHaveLength(1);
    expect(mine[0]).toMatchObject({ id: firstId, status: 'pending', question: { lessonId, lessonTitle: 'Momentum', number: 1 } });

    // Withdraw: final.
    res = await withdraw(firstId);
    expect(res.status).toBe(200);
    expect((await res.json()).solution).toMatchObject({ status: 'withdrawn' });
    expect((await row(firstId)).withdrawn_at).toBeInstanceOf(Date);
    expect((await (await shareForm(q1)).json()).submissions[0].status).toBe('withdrawn');
    expect((await withdraw(firstId)).status).toBe(409);
  });

  it('a submission is a snapshot: later edits to the workspace do not change it', async () => {
    as('alice');
    const res = await share(q1, { ...CONSENT, displayName: 'Alice A.' });
    expect(res.status).toBe(200);
    liveId = (await res.json()).solution.id;

    expect((await putDoc(q1, { doc: doc([stroke(40), stroke(120, '#2563eb'), stroke(400)]), baseVersion: 1 })).status).toBe(200);
    expect((await putSteps(q1, 'changed my mind')).status).toBe(200);
    const r = await row(liveId);
    expect(r.strokes).toEqual(aliceDoc);
    expect(r.steps_text).toBe(aliceSteps);
    expect(r.stroke_count).toBe(2);
  });

  it('refuses a second live submission, an empty workspace, stale consent, bad names and non-students', async () => {
    as('alice');
    let res: Response = await share(q1, { ...CONSENT, displayName: 'Alice A.' });
    expect(res.status).toBe(409);
    expect((await res.json()).reason).toBe('already_shared');
    expect((await (await share(q2, { ...CONSENT, displayName: 'Alice A.' })).json()).reason).toBe('empty');
    res = await share(q1, { ...CONSENT, displayName: 'Alice A.', consentVersion: '2020-01-01' });
    expect(res.status).toBe(409);
    expect((await share(q1, { ...CONSENT, displayName: 'alice@example.com' })).status).toBe(400);
    expect((await share(q1, { ...CONSENT, displayName: 'Alice', workedMyself: false })).status).toBe(400);
    expect((await share(q1, { ...CONSENT, displayName: 'Alice', licence: undefined })).status).toBe(400);

    as('tess');
    await putDoc(q1, { doc: doc([stroke(5)]), baseVersion: 0 });
    expect((await share(q1, { ...CONSENT, displayName: 'Tess T.', ageBand: '18_plus' })).status).toBe(403);
    expect((await asRole(ids.tess, (c) => c.query(`SELECT 1 FROM shared_solutions WHERE user_id = $1`, [ids.tess]))).rowCount).toBe(0);
  });

  // ------------------------------------------------------------ visibility

  it('an unapproved solution is invisible to other students', async () => {
    // The teacher's solution exists; Bob answered wrong, so he may open the worked solutions.
    as('admin');
    expect((await teacherRoute.PUT(req('PUT', { doc: doc([stroke(30), stroke(90)]), baseVersion: 0 }), { params: { problemId: q1 } })).status).toBe(200);
    await answer(ids.bob, q1, false);

    as('bob');
    expect(await (await solutionStatus(q1)).json()).toMatchObject({ available: true, pageCount: 1, studentSolutionCount: 0 });
    const opened = await (await openSolutions(q1)).json();
    expect(opened.pages).toHaveLength(1);
    expect(opened.studentSolutions).toEqual([]);
    expect((await (await mineRoute.GET()).json()).solutions).toEqual([]);
    expect((await withdraw(liveId)).status).toBe(404);

    // The database alone: pending rows are the author's and admins' only.
    const visible = async (viewer: string | null) =>
      (await asRole(viewer, (c) => c.query(`SELECT 1 FROM shared_solutions WHERE question_id = $1`, [q1]))).rowCount;
    expect(await visible(ids.bob)).toBe(0);
    expect(await visible(ids.carol)).toBe(0);
    expect(await visible(null)).toBe(0);
    expect(await visible(ids.alice)).toBe(2); // her withdrawn one and the pending one
    expect(await visible(ids.admin)).toBe(2);
  });

  it('the review queue shows the question and the teacher solution beside the student one', async () => {
    as('bob');
    expect((await queue('pending')).status).toBe(403);
    as('admin');
    const res = await queue('pending');
    expect(res.status).toBe(200);
    const item = (await res.json()).solutions.find((s: { id: string }) => s.id === liveId);
    expect(item).toMatchObject({
      status: 'pending',
      displayName: 'Alice A.',
      stepsText: aliceSteps,
      student: { id: ids.alice, name: 'Alice anderson', ageBand: '18_plus' },
      question: { id: q1, lessonTitle: 'Momentum', number: 1, answer: '12 kg m/s', explanation: 'p = mv = 3 × 4' },
      consentText: consentText(false),
    });
    expect(item.pages).toHaveLength(1);
    expect(item.teacherPages).toHaveLength(1);
  });

  it('admins reject with a reason the student sees; the student can then share again', async () => {
    as('alice');
    expect((await review(liveId, { action: 'reject', reason: 'x' })).status).toBe(403);
    as('admin');
    const res = await review(liveId, { action: 'reject', reason: ' Check the units in step 2. ' });
    expect(res.status).toBe(200);
    expect((await res.json()).solution).toMatchObject({ status: 'rejected', rejectionReason: 'Check the units in step 2.' });
    const r = await row(liveId);
    expect(r.reviewed_by).toBe(ids.admin);
    expect(r.reviewed_at).toBeInstanceOf(Date);

    as('alice');
    expect((await (await shareForm(q1)).json()).submissions[0]).toMatchObject({ status: 'rejected', rejectionReason: 'Check the units in step 2.' });
    // Rejected isn't shown anywhere, so there is nothing to withdraw.
    expect((await withdraw(liveId)).status).toBe(409);
    as('bob');
    expect((await (await openSolutions(q1)).json()).studentSolutions).toEqual([]);

    as('alice');
    const again = await share(q1, { ...CONSENT, displayName: 'Alice A.' });
    expect(again.status).toBe(200);
    liveId = (await again.json()).solution.id;
    // The new copy is taken from the workspace as it is now.
    expect((await row(liveId)).steps_text).toBe('changed my mind');
  });

  it('an approved solution appears with the display name and the teacher solution beside it', async () => {
    as('admin');
    expect((await review(liveId, { action: 'approve' })).status).toBe(200);

    as('bob');
    expect(await (await solutionStatus(q1)).json()).toMatchObject({ available: true, pageCount: 1, studentSolutionCount: 1 });
    let opened = await (await openSolutions(q1)).json();
    expect(opened.pages).toHaveLength(1); // the teacher's solution
    expect(opened.studentSolutions).toHaveLength(1);
    const [student] = opened.studentSolutions;
    expect(Object.keys(student).sort()).toEqual(['approvedAt', 'displayName', 'id', 'pages', 'stepsText', 'verified']);
    expect(student).toMatchObject({ id: liveId, displayName: 'Alice A.', verified: false, stepsText: 'changed my mind' });
    expect(student.pages[0].body).toContain('<path d="M');

    // Verified against the mark scheme → the badge flag.
    as('admin');
    expect((await (await review(liveId, { action: 'verify' })).json()).solution).toMatchObject({ verified: true });
    expect((await row(liveId)).verified_by).toBe(ids.admin);
    as('bob');
    opened = await (await openSolutions(q1)).json();
    expect(opened.studentSolutions[0].verified).toBe(true);

    // The author sees it approved and verified.
    as('alice');
    expect((await (await shareForm(q1)).json()).submissions[0]).toMatchObject({ status: 'approved', verified: true });

    // Same reveal rule as the teacher's solution: nothing before a wrong answer.
    as('carol');
    expect((await solutionStatus(q1)).status).toBe(403);
    expect((await asRole(ids.carol, (c) => c.query(`SELECT 1 FROM shared_solutions WHERE question_id = $1`, [q1]))).rowCount).toBe(0);
    expect((await asRole(ids.bob, (c) => c.query(`SELECT 1 FROM shared_solutions WHERE question_id = $1`, [q1]))).rowCount).toBe(1);
  });

  it('students cannot review, edit or forge submissions directly in the database', async () => {
    // Approving or verifying their own: the update policy only lets them withdraw.
    await expect(asRole(ids.alice, (c) => c.query(`UPDATE shared_solutions SET verified = false WHERE id = $1`, [liveId]))).rejects.toMatchObject({
      code: '42501',
    });
    // Withdrawing while changing something else: the guard trigger refuses.
    await expect(
      asRole(ids.alice, (c) => c.query(`UPDATE shared_solutions SET status = 'withdrawn', verified = false WHERE id = $1`, [liveId]))
    ).rejects.toMatchObject({ code: '42501' });
    // The submitted content is not updatable at all (column grants).
    await expect(asRole(ids.alice, (c) => c.query(`UPDATE shared_solutions SET steps_text = 'edited' WHERE id = $1`, [liveId]))).rejects.toMatchObject({
      code: '42501',
    });
    await expect(asRole(ids.admin, (c) => c.query(`UPDATE shared_solutions SET display_name = 'X' WHERE id = $1`, [liveId]))).rejects.toMatchObject({
      code: '42501',
    });
    // Someone else's row: invisible to their update.
    expect((await asRole(ids.bob, (c) => c.query(`UPDATE shared_solutions SET status = 'withdrawn' WHERE id = $1`, [liveId]))).rowCount).toBe(0);
    // Forging an approved row, or one in someone else's name.
    const forge = (userId: string, status: string) =>
      asRole(ids.alice, (c) =>
        c.query(
          `INSERT INTO shared_solutions (question_id, user_id, display_name, strokes, steps_text, status, consent_version, consent_text, consented_at)
           VALUES ($1, $2, 'X', '{}'::jsonb, 'steps', $3, 'v', 't', now())`,
          [q2, userId, status]
        )
      );
    await expect(forge(ids.alice, 'approved')).rejects.toMatchObject({ code: '42501' });
    await expect(forge(ids.bob, 'pending')).rejects.toMatchObject({ code: '42501' });
    // Nobody deletes through the app role.
    await expect(asRole(ids.admin, (c) => c.query(`DELETE FROM shared_solutions WHERE id = $1`, [liveId]))).rejects.toMatchObject({ code: '42501' });
    expect((await row(liveId)).status).toBe('approved');
  });

  it('a student who is under 18 cannot submit without parental consent', async () => {
    as('dan');
    await putDoc(q1, { doc: doc([stroke(60)]), baseVersion: 0 });

    let res: Response = await share(q1, { ...CONSENT, displayName: 'Dan D.', ageBand: 'under_18' });
    expect(res.status).toBe(400);
    expect((await res.json()).reason).toBe('parent_consent_required');
    expect((await db.query(`SELECT 1 FROM shared_solutions WHERE user_id = $1`, [ids.dan])).rowCount).toBe(0);
    // The age answer is kept, and can't be flipped to skip the parent.
    expect((await db.query(`SELECT age_band FROM users WHERE id = $1`, [ids.dan])).rows[0].age_band).toBe('under_18');
    res = await share(q1, { ...CONSENT, displayName: 'Dan D.', ageBand: '18_plus', parentConsent: false });
    expect((await res.json()).reason).toBe('parent_consent_required');
    expect((await (await shareForm(q1)).json()).ageBand).toBe('under_18');

    // The database refuses it on its own too.
    const direct = (userId: string) =>
      asRole(userId, (c) =>
        c.query(
          `INSERT INTO shared_solutions (question_id, user_id, display_name, strokes, steps_text, consent_version, consent_text, consented_at)
           VALUES ($1, $2, 'D', '{}'::jsonb, 'steps', 'v', 't', now())`,
          [q1, userId]
        )
      );
    await expect(direct(ids.dan)).rejects.toMatchObject({ code: '42501' });
    // Never said their age: treated as under 18.
    await expect(direct(ids.erin)).rejects.toMatchObject({ code: '42501' });
    as('erin');
    await putDoc(q1, { doc: doc([stroke(70)]), baseVersion: 0 });
    expect((await (await share(q1, { ...CONSENT, displayName: 'Erin E.' })).json()).reason).toBe('age_required');

    // With the parent's agreement it goes through, and it is recorded.
    as('dan');
    res = await share(q1, { ...CONSENT, displayName: 'Dan D.', parentConsent: true });
    expect(res.status).toBe(200);
    const r = await row((await res.json()).solution.id);
    expect(r.parent_consent_at).toBeInstanceOf(Date);
    expect(r.consent_text).toBe(consentText(true));
  });

  it('a withdrawn solution disappears from the public view', async () => {
    as('bob');
    expect((await (await openSolutions(q1)).json()).studentSolutions.map((s: { id: string }) => s.id)).toEqual([liveId]);

    as('alice');
    expect((await withdraw(liveId)).status).toBe(200);

    as('bob');
    expect(await (await solutionStatus(q1)).json()).toMatchObject({ available: true, pageCount: 1, studentSolutionCount: 0 });
    const opened = await (await openSolutions(q1)).json();
    expect(opened.studentSolutions).toEqual([]);
    expect(opened.pages).toHaveLength(1); // the teacher's solution stays
    expect((await asRole(ids.bob, (c) => c.query(`SELECT 1 FROM shared_solutions WHERE id = $1`, [liveId]))).rowCount).toBe(0);

    // Withdrawn is final: an admin can't put it back.
    as('admin');
    const res = await review(liveId, { action: 'approve' });
    expect(res.status).toBe(409);
    expect((await res.json()).error).toMatch(/withdrew/);
    expect((await row(liveId)).status).toBe('withdrawn');
    const withdrawn = (await (await queue('withdrawn')).json()).solutions.map((s: { id: string }) => s.id);
    expect(withdrawn).toContain(liveId);
  });

  it('with no teacher solution, approved student solutions still open (one view for the question)', async () => {
    as('erin');
    let res: Response = await share(q2, { ...CONSENT, displayName: 'Erin E.', ageBand: '18_plus' });
    expect(res.status).toBe(200);
    const id = (await res.json()).solution.id;
    as('admin');
    await review(id, { action: 'approve' });

    await answer(ids.bob, q2, false);
    as('bob');
    expect(await (await solutionStatus(q2)).json()).toMatchObject({
      available: true,
      pageCount: 0,
      studentSolutionCount: 1,
      access: { allowed: false, costsView: true, viewsUsed: 1, viewLimit: 2 },
    });
    res = await openSolutions(q2);
    const opened = await res.json();
    expect(opened.access).toMatchObject({ allowed: true, viewsUsed: 2 });
    expect(opened.pages).toEqual([]);
    expect(opened.studentSolutions[0]).toMatchObject({ displayName: 'Erin E.', stepsText: 'Momentum is conserved.' });
  });

  it('the lesson tier gate applies to the workspace and to sharing', async () => {
    as('alice', 1);
    expect((await getWs(qLocked, lockedLessonId)).status).toBe(403);
    expect((await share(qLocked, { ...CONSENT, displayName: 'Alice A.' }, lockedLessonId)).status).toBe(403);
    expect((await getWs(q1, lockedLessonId)).status).toBe(404);
  });

  it('signed out: 401', async () => {
    expect((await getWs(q1)).status).toBe(401);
    expect((await share(q1, CONSENT)).status).toBe(401);
    expect((await withdraw(liveId)).status).toBe(401);
    expect((await mineRoute.GET()).status).toBe(401);
  });

  it('deleting a reviewer keeps the review (reviewed_by is cleared, the guard lets the cascade through)', async () => {
    const danId = (await db.query(`SELECT id FROM shared_solutions WHERE user_id = $1 AND status = 'pending'`, [ids.dan])).rows[0].id;
    as('admin2');
    expect((await review(danId, { action: 'approve' })).status).toBe(200);
    expect((await row(danId)).reviewed_by).toBe(ids.admin2);
    await db.query(`DELETE FROM users WHERE id = $1`, [ids.admin2]);
    const r = await row(danId);
    expect(r).toMatchObject({ status: 'approved', reviewed_by: null });
  });
});
