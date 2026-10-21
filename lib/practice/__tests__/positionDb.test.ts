/**
 * getStoredPracticeQuestion (the "Request a video" button's starting question)
 * against a throwaway database:
 *
 *   TEST_DATABASE_URL=postgres://…/ashphys_test npm run test:db
 *
 * Expects the base schema (lib/dashboard/__tests__/dashboardDb.test.ts loads
 * it). Skipped without TEST_DATABASE_URL. Rows it creates are deleted afterwards.
 */

import { randomUUID } from 'node:crypto';
import { Client } from 'pg';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const url = process.env.TEST_DATABASE_URL;

describe.skipIf(!url)('stored practice position (TEST_DATABASE_URL)', () => {
  let db: Client;
  let getStoredPracticeQuestion: typeof import('@/lib/practice/position').getStoredPracticeQuestion;
  const student = randomUUID();
  let courseId = '';
  let lessonId = '';
  const igcse: string[] = [];
  let asQuestion = '';

  beforeAll(async () => {
    process.env.DATABASE_URL = url;
    db = new Client({ connectionString: url });
    await db.connect();
    await db.query(`INSERT INTO users (id, email, role) VALUES ($1, $2, 'student')`, [student, `${student}@test.local`]);
    courseId = (await db.query(`INSERT INTO courses (title, code) VALUES ('Position test', '0625') RETURNING id`)).rows[0].id;
    const chapterId = (await db.query(`INSERT INTO chapters (course_id, chapter_number, title) VALUES ($1, 952, 'P') RETURNING id`, [courseId])).rows[0].id;
    lessonId = (await db.query(`INSERT INTO topics (chapter_id, topic_name, "order") VALUES ($1, 'P.1', 0) RETURNING id`, [chapterId])).rows[0].id;
    // Inserted out of order: the bank is ordered by problem_number, like the practice page.
    for (const n of [3, 1, 2]) {
      const r = await db.query(
        `INSERT INTO problems (chapter_id, topic_id, question_text, problem_number, curriculum_id) VALUES ($1, $2, $3, $4, 'igcse') RETURNING id`,
        [chapterId, lessonId, `IGCSE Q${n}`, n]
      );
      igcse[n - 1] = r.rows[0].id;
    }
    asQuestion = (
      await db.query(
        `INSERT INTO problems (chapter_id, topic_id, question_text, problem_number, curriculum_id) VALUES ($1, $2, 'AS Q1', 1, 'as') RETURNING id`,
        [chapterId, lessonId]
      )
    ).rows[0].id;
    ({ getStoredPracticeQuestion } = await import('@/lib/practice/position'));
  });

  afterAll(async () => {
    await db?.query(`DELETE FROM users WHERE id = $1`, [student]);
    if (courseId) await db?.query(`DELETE FROM courses WHERE id = $1`, [courseId]);
    await db?.end();
    const { closePool } = await import('@/lib/db/client');
    await closePool();
  });

  const answer = (problemId: string, at: string) =>
    db.query(`INSERT INTO practice_attempts (student_id, problem_id, topic_id, is_correct, created_at) VALUES ($1, $2, $3, true, $4)`, [
      student,
      problemId,
      lessonId,
      at,
    ]);

  it('starts at the first question when nothing is answered', async () => {
    expect(await getStoredPracticeQuestion(student, lessonId, 'igcse')).toBe(igcse[0]);
  });

  it('then follows the last question answered in this bank', async () => {
    await answer(igcse[1], '2026-10-20T10:00:00Z');
    await answer(igcse[0], '2026-10-20T11:00:00Z');
    expect(await getStoredPracticeQuestion(student, lessonId, 'igcse')).toBe(igcse[0]);
    // An answer in another bank of the same lesson doesn't move it.
    await answer(asQuestion, '2026-10-20T12:00:00Z');
    expect(await getStoredPracticeQuestion(student, lessonId, 'igcse')).toBe(igcse[0]);
    expect(await getStoredPracticeQuestion(student, lessonId, 'as')).toBe(asQuestion);
  });

  it('returns null for a lesson with no questions in that bank', async () => {
    expect(await getStoredPracticeQuestion(student, lessonId, 'ib')).toBeNull();
  });
});
