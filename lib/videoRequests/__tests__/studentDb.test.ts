/**
 * The real lib/videoRequests/student.ts against a throwaway database, in both
 * modes: with row-level security (migrations applied) and with the
 * pre-migration fallback production was running on 2026-10-14.
 *
 *   TEST_DATABASE_URL=postgres://…/ashphys_test npm run test:db
 *
 * Expects the database prepared by lib/dashboard/__tests__/dashboardDb.test.ts
 * (base schema + 2026-10-14 and 2026-10-21 migrations); skipped without TEST_DATABASE_URL.
 * Rows it creates are deleted afterwards (users cascade).
 */

import { randomUUID } from 'node:crypto';
import { Client } from 'pg';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

const url = process.env.TEST_DATABASE_URL;

const features = vi.hoisted(() => ({ forceFallback: false }));
vi.mock('@/lib/db/schemaFeatures', async (importOriginal) => {
  const real = await importOriginal<typeof import('@/lib/db/schemaFeatures')>();
  return {
    ...real,
    getSchemaFeatures: async () => {
      real.resetSchemaFeaturesCache();
      const f = await real.getSchemaFeatures();
      return features.forceFallback ? { ...f, videoRequestRls: false } : f;
    },
  };
});
vi.mock('@/lib/storage/signed', () => ({ signedFileUrl: async () => null }));

describe.skipIf(!url)('student video requests (TEST_DATABASE_URL)', () => {
  let db: Client;
  const alice = randomUUID();
  const bob = randomUUID();
  let lib: typeof import('@/lib/videoRequests/student');
  let courseId: string | null = null;
  let lessonId = '';
  let questionId = '';

  beforeAll(async () => {
    process.env.DATABASE_URL = url;
    db = new Client({ connectionString: url });
    await db.connect();
    const hasPolicy = await db.query(`SELECT 1 FROM pg_policies WHERE policyname = 'video_requests_insert_own'`);
    if (hasPolicy.rowCount === 0) throw new Error('Run lib/dashboard/__tests__/dashboardDb.test.ts first (it applies the migrations).');
    await db.query(`INSERT INTO users (id, email, role) VALUES ($1, $2, 'student'), ($3, $4, 'student')`, [
      alice,
      `${alice}@test.local`,
      bob,
      `${bob}@test.local`,
    ]);
    // A lesson with one practice question, for question_id.
    const course = await db.query(`INSERT INTO courses (title, code) VALUES ('Student DB test', '0625') RETURNING id`);
    courseId = course.rows[0].id;
    const chapter = await db.query(`INSERT INTO chapters (course_id, chapter_number, title) VALUES ($1, 951, 'T') RETURNING id`, [courseId]);
    const topic = await db.query(`INSERT INTO topics (chapter_id, topic_name, "order") VALUES ($1, 'T.1', 0) RETURNING id`, [chapter.rows[0].id]);
    lessonId = topic.rows[0].id;
    const problem = await db.query(`INSERT INTO problems (chapter_id, topic_id, question_text) VALUES ($1, $2, 'Q') RETURNING id`, [
      chapter.rows[0].id,
      lessonId,
    ]);
    questionId = problem.rows[0].id;
    lib = await import('@/lib/videoRequests/student');
  });

  afterAll(async () => {
    await db?.query(`DELETE FROM users WHERE id = ANY($1)`, [[alice, bob]]);
    if (courseId) await db?.query(`DELETE FROM courses WHERE id = $1`, [courseId]);
    await db?.end();
    const { closePool } = await import('@/lib/db/client');
    await closePool();
  });

  const owner = async (id: string) => (await db.query(`SELECT student_id, screenshot_path, question_number FROM video_requests WHERE id = $1`, [id])).rows[0];

  for (const mode of ['row-level security', 'pre-migration fallback'] as const) {
    describe(mode, () => {
      beforeAll(() => {
        features.forceFallback = mode === 'pre-migration fallback';
      });

      it('saves a request without a screenshot for the session student', async () => {
        const id = await lib.createVideoRequest({ id: alice }, {
          description: `no image (${mode})`, topicId: null, chapterId: null, questionNumber: 'Q1', screenshotPath: null,
        });
        expect(await owner(id)).toEqual({ student_id: alice, screenshot_path: null, question_number: 'Q1' });
      });

      it('saves a request with a screenshot under the minted id and stores the path', async () => {
        const requestId = randomUUID();
        const path = `${alice}/${requestId}-1792013761074.png`;
        const id = await lib.createVideoRequest({ id: alice }, {
          id: requestId, description: `with image (${mode})`, topicId: null, chapterId: null, questionNumber: null, screenshotPath: path,
        });
        expect(id).toBe(requestId);
        expect(await owner(id)).toMatchObject({ student_id: alice, screenshot_path: path });
        // A double submit returns the same row instead of failing.
        expect(
          await lib.createVideoRequest({ id: alice }, {
            id: requestId, description: 'again', topicId: null, chapterId: null, questionNumber: null, screenshotPath: path,
          })
        ).toBe(requestId);
      });

      it("can't take over another student's request id", async () => {
        const bobsId = await lib.createVideoRequest({ id: bob }, {
          description: `bob (${mode})`, topicId: null, chapterId: null, questionNumber: null, screenshotPath: null,
        });
        await expect(
          lib.createVideoRequest({ id: alice }, {
            id: bobsId, description: 'hijack', topicId: null, chapterId: null, questionNumber: null, screenshotPath: null,
          })
        ).rejects.toThrow(/already in use/);
        expect(await owner(bobsId)).toMatchObject({ student_id: bob });
      });

      it('stores the chosen practice question (question_id) with the lesson', async () => {
        const id = await lib.createVideoRequest({ id: alice }, {
          description: `practice question (${mode})`, topicId: lessonId, chapterId: null, questionNumber: '1', questionId, screenshotPath: null,
        });
        const row = (await db.query(`SELECT topic_id, question_id, question_number FROM video_requests WHERE id = $1`, [id])).rows[0];
        expect(row).toEqual({ topic_id: lessonId, question_id: questionId, question_number: '1' });
      });

      it("lists only the student's own requests", async () => {
        const mine = await lib.getMyVideoRequests({ id: alice });
        expect(mine.length).toBeGreaterThan(0);
        expect(mine.every((r) => !/^bob/.test(r.description))).toBe(true);
      });
    });
  }

  it('row-level security itself refuses a row for another student_id', async () => {
    await db.query('BEGIN');
    try {
      await db.query('SET LOCAL ROLE ashphys_user');
      await db.query(`SELECT set_config('app.user_id', $1, true)`, [alice]);
      await expect(db.query(`INSERT INTO video_requests (student_id, description) VALUES ($1, 'spoof')`, [bob])).rejects.toMatchObject({
        code: '42501',
      });
    } finally {
      await db.query('ROLLBACK');
    }
  });
});
