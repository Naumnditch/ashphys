/**
 * Database tests for the 2026-10-14 migrations: streaks across the
 * Europe/Istanbul day boundary, the strengths/weaknesses threshold, and
 * row-level-security isolation between students.
 *
 * They need a real, THROWAWAY Postgres (15+) database:
 *
 *   TEST_DATABASE_URL=postgres://user:pass@localhost:5432/ashphys_test npm run test:db
 *
 * The connecting role must be able to CREATE ROLE (like Supabase's
 * `postgres`). If the database has no `users` table yet, the minimal
 * snapshot database/tests/base-schema.sql is loaded first; then the
 * migrations database/seeds/2026-10-14-*.sql are applied (they are
 * idempotent). Every test runs inside a transaction that is rolled back.
 * Without TEST_DATABASE_URL the whole file is skipped.
 */

import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { Client } from 'pg';
import { afterAll, beforeAll, beforeEach, afterEach, describe, expect, it } from 'vitest';

const url = process.env.TEST_DATABASE_URL;
const root = path.resolve(__dirname, '../../..');

describe.skipIf(!url)('dashboard database (TEST_DATABASE_URL)', () => {
  let db: Client;

  beforeAll(async () => {
    db = new Client({ connectionString: url });
    await db.connect();
    const hasUsers = await db.query(`SELECT to_regclass('public.users') IS NOT NULL AS ok`);
    if (!hasUsers.rows[0].ok) {
      await db.query(readFileSync(path.join(root, 'database/tests/base-schema.sql'), 'utf8'));
    }
    const dir = path.join(root, 'database/seeds');
    for (const file of readdirSync(dir).filter((f) => /^2026-10-14-.*\.sql$/.test(f)).sort()) {
      await db.query(readFileSync(path.join(dir, file), 'utf8'));
    }
  });

  afterAll(async () => {
    await db?.end();
  });

  beforeEach(async () => {
    await db.query('BEGIN');
  });
  afterEach(async () => {
    await db.query('ROLLBACK');
  });

  // ---------------------------------------------------------------- fixtures

  async function makeUser(role: 'student' | 'admin' = 'student'): Promise<string> {
    const id = randomUUID();
    await db.query(`INSERT INTO users (id, email, role) VALUES ($1, $2, $3::user_role)`, [id, `${id}@test.local`, role]);
    return id;
  }

  async function makeCourse(): Promise<string> {
    const r = await db.query(`INSERT INTO courses (title, code) VALUES ('Test course', '0625') RETURNING id`);
    return r.rows[0].id;
  }

  /** A chapter with one lesson and one question; returns their ids. */
  async function makeChapter(courseId: string, n: number, lessons = 1) {
    const ch = await db.query(
      `INSERT INTO chapters (course_id, chapter_number, title) VALUES ($1, $2, $3) RETURNING id`,
      [courseId, 900 + n, `Test chapter ${n}`]
    );
    const chapterId: string = ch.rows[0].id;
    const items: { lessonId: string; problemId: string }[] = [];
    for (let i = 0; i < lessons; i++) {
      const t = await db.query(`INSERT INTO topics (chapter_id, topic_name, "order") VALUES ($1, $2, $3) RETURNING id`, [
        chapterId,
        `Lesson ${n}.${i + 1}`,
        i,
      ]);
      const p = await db.query(
        `INSERT INTO problems (chapter_id, topic_id, question_text) VALUES ($1, $2, 'Q') RETURNING id`,
        [chapterId, t.rows[0].id]
      );
      items.push({ lessonId: t.rows[0].id, problemId: p.rows[0].id });
    }
    return { chapterId, lessonId: items[0].lessonId, problemId: items[0].problemId, items };
  }

  async function attempt(studentId: string, item: { lessonId: string; problemId: string }, correct: boolean, at = '2026-10-01T09:00:00Z') {
    await db.query(
      `INSERT INTO practice_attempts (student_id, problem_id, topic_id, is_correct, created_at) VALUES ($1, $2, $3, $4, $5)`,
      [studentId, item.problemId, item.lessonId, correct, at]
    );
  }

  async function attempts(studentId: string, item: { lessonId: string; problemId: string }, total: number, correct: number) {
    for (let i = 0; i < total; i++) await attempt(studentId, item, i < correct);
  }

  async function activity(studentId: string, at: string, lessonId: string | null = null, type = 'lesson_view') {
    await db.query(`INSERT INTO activity_events (student_id, type, lesson_id, created_at) VALUES ($1, $2, $3, $4)`, [
      studentId,
      type,
      lessonId,
      at,
    ]);
  }

  /** Runs fn as ashphys_user with app.user_id = userId (null = anonymous), then switches back to the owner. */
  async function as<T>(userId: string | null, fn: () => Promise<T>): Promise<T> {
    await db.query('SAVEPOINT as_user');
    await db.query('SET LOCAL ROLE ashphys_user');
    await db.query(`SELECT set_config('app.user_id', $1, true)`, [userId ?? '']);
    try {
      const result = await fn();
      await db.query('RELEASE SAVEPOINT as_user');
      return result;
    } catch (err) {
      await db.query('ROLLBACK TO SAVEPOINT as_user');
      throw err;
    } finally {
      await db.query('RESET ROLE');
      await db.query(`SELECT set_config('app.user_id', '', true)`);
    }
  }

  const streaks = (studentId: string, now: string, tz?: string) =>
    as(studentId, async () =>
      (await db.query(`SELECT get_student_streaks($1, $2::timestamptz${tz ? ', $3' : ''}) AS j`, tz ? [studentId, now, tz] : [studentId, now])).rows[0].j
    );

  const progress = (studentId: string, viewer = studentId) =>
    as(viewer, async () => (await db.query(`SELECT get_student_progress($1) AS j`, [studentId])).rows[0].j);

  // ------------------------------------------------------------------ streaks

  describe('streaks (Europe/Istanbul days)', () => {
    it('counts 23:30 and 00:30 Istanbul time as two days even though both are the same UTC date', async () => {
      const s = await makeUser();
      const ch = await makeChapter(await makeCourse(), 1);
      await attempt(s, ch, true, '2026-10-12T20:30:00Z'); // 23:30 on 12 Oct in Istanbul
      await attempt(s, ch, true, '2026-10-12T21:30:00Z'); // 00:30 on 13 Oct in Istanbul
      const ist = await streaks(s, '2026-10-13T12:00:00Z');
      expect(ist).toMatchObject({ current_streak: 2, longest_streak: 2, study_days: 2, studied_today: true, today: '2026-10-13' });

      const utc = await streaks(s, '2026-10-13T12:00:00Z', 'UTC');
      expect(utc).toMatchObject({ current_streak: 1, longest_streak: 1, study_days: 1, studied_today: false });
    });

    it('keeps a streak alive through "yesterday" and ends it at Istanbul midnight, not UTC midnight', async () => {
      const s = await makeUser();
      // Studied on 11 and 12 Oct (Istanbul).
      await activity(s, '2026-10-11T07:00:00Z');
      await activity(s, '2026-10-12T07:00:00Z');
      // 23:59 on 13 Oct in Istanbul: yesterday counts, streak alive.
      expect(await streaks(s, '2026-10-13T20:59:00Z')).toMatchObject({ current_streak: 2, studied_today: false, today: '2026-10-13' });
      // 00:01 on 14 Oct in Istanbul (still 13 Oct in UTC): streak over.
      expect(await streaks(s, '2026-10-13T21:01:00Z')).toMatchObject({ current_streak: 0, longest_streak: 2, today: '2026-10-14' });
    });

    it('separates the current streak from the longest one and mixes attempts with lesson/video views', async () => {
      const s = await makeUser();
      const ch = await makeChapter(await makeCourse(), 1);
      for (const day of ['01', '02', '03']) await attempt(s, ch, true, `2026-10-${day}T10:00:00Z`);
      await activity(s, '2026-10-06T10:00:00Z', ch.lessonId, 'video_view');
      await attempt(s, ch, false, '2026-10-07T10:00:00Z');
      expect(await streaks(s, '2026-10-07T18:00:00Z')).toMatchObject({ current_streak: 2, longest_streak: 3, study_days: 5 });
    });

    it('is all zeros for a new student', async () => {
      const s = await makeUser();
      expect(await streaks(s, '2026-10-13T12:00:00Z')).toMatchObject({
        current_streak: 0,
        longest_streak: 0,
        study_days: 0,
        last_study_day: null,
        studied_today: false,
      });
    });
  });

  // ------------------------------------------------- strengths and weaknesses

  describe('strengths and weaknesses threshold', () => {
    it('ranks only chapters with at least 5 attempts: top 2 strengths, bottom 2 weaknesses', async () => {
      const s = await makeUser();
      const course = await makeCourse();
      const a = await makeChapter(course, 1); // 4 attempts, 100%: too few to rank
      const b = await makeChapter(course, 2); // 5 attempts, 80%
      const c = await makeChapter(course, 3); // 6 attempts, 1/6
      const d = await makeChapter(course, 4); // 5 attempts, 60%
      const e = await makeChapter(course, 5); // 10 attempts, 90%
      await attempts(s, a, 4, 4);
      await attempts(s, b, 5, 4);
      await attempts(s, c, 6, 1);
      await attempts(s, d, 5, 3);
      await attempts(s, e, 10, 9);

      const p = await progress(s);
      expect(p.min_attempts_to_rank).toBe(5);
      expect(p.strengths.map((x: { chapter_id: string }) => x.chapter_id)).toEqual([e.chapterId, b.chapterId]);
      expect(p.weaknesses.map((x: { chapter_id: string }) => x.chapter_id)).toEqual([c.chapterId, d.chapterId]);
      const all = [...p.strengths, ...p.weaknesses].map((x: { chapter_id: string }) => x.chapter_id);
      expect(all).not.toContain(a.chapterId);
      // The unranked chapter still shows in the breakdown.
      const chA = p.chapters.find((x: { chapter_id: string }) => x.chapter_id === a.chapterId);
      expect(chA).toMatchObject({ attempted: 4, correct: 4, accuracy: 1, ranked: false });
      expect(p.totals).toMatchObject({ attempted: 30, correct: 21, accuracy: 0.7, lessons_visited: 5 });
    });

    it('treats exactly 5 attempts as enough and 4 as not enough', async () => {
      const s = await makeUser();
      const course = await makeCourse();
      const five = await makeChapter(course, 1);
      const four = await makeChapter(course, 2);
      const other = await makeChapter(course, 3);
      await attempts(s, five, 5, 5);
      await attempts(s, four, 4, 0);
      await attempts(s, other, 5, 1);
      const p = await progress(s);
      expect(p.strengths.map((x: { chapter_id: string }) => x.chapter_id)).toEqual([five.chapterId]);
      expect(p.weaknesses.map((x: { chapter_id: string }) => x.chapter_id)).toEqual([other.chapterId]);
    });

    it('labels nothing until two chapters qualify', async () => {
      const s = await makeUser();
      const course = await makeCourse();
      const only = await makeChapter(course, 1);
      const small = await makeChapter(course, 2);
      await attempts(s, only, 12, 3);
      await attempts(s, small, 2, 0);
      const p = await progress(s);
      expect(p.strengths).toEqual([]);
      expect(p.weaknesses).toEqual([]);
    });

    it('never labels a chapter as both, with three qualifying chapters', async () => {
      const s = await makeUser();
      const course = await makeCourse();
      const [x, y, z] = [await makeChapter(course, 1), await makeChapter(course, 2), await makeChapter(course, 3)];
      await attempts(s, x, 5, 5);
      await attempts(s, y, 5, 3);
      await attempts(s, z, 5, 1);
      const p = await progress(s);
      expect(p.strengths.map((c: { chapter_id: string }) => c.chapter_id)).toEqual([x.chapterId, y.chapterId]);
      expect(p.weaknesses.map((c: { chapter_id: string }) => c.chapter_id)).toEqual([z.chapterId]);
    });

    it('points each weakness at its weakest lesson', async () => {
      const s = await makeUser();
      const course = await makeCourse();
      const good = await makeChapter(course, 1);
      const weak = await makeChapter(course, 2, 2);
      await attempts(s, good, 5, 5);
      await attempts(s, weak.items[0], 3, 2);
      await attempts(s, weak.items[1], 3, 0);
      const p = await progress(s);
      expect(p.weaknesses[0]).toMatchObject({
        chapter_id: weak.chapterId,
        weakest_lesson: { lesson_id: weak.items[1].lessonId, attempted: 3, accuracy: 0 },
      });
      const ch = p.chapters.find((c: { chapter_id: string }) => c.chapter_id === weak.chapterId);
      expect(ch.lessons).toHaveLength(2);
    });

    it('returns empty, chart-free data for a new student', async () => {
      const s = await makeUser();
      const p = await progress(s);
      expect(p).toMatchObject({
        totals: { attempted: 0, correct: 0, accuracy: null, lessons_visited: 0, study_days: 0 },
        chapters: [],
        strengths: [],
        weaknesses: [],
      });
    });
  });

  // ------------------------------------------------------------ RLS isolation

  describe('row-level security', () => {
    async function twoStudents() {
      const alice = await makeUser();
      const bob = await makeUser();
      const admin = await makeUser('admin');
      const ch = await makeChapter(await makeCourse(), 1);
      await attempts(alice, ch, 3, 2);
      await attempts(bob, ch, 7, 1);
      await activity(alice, '2026-10-10T08:00:00Z', ch.lessonId);
      await activity(bob, '2026-10-10T08:00:00Z', ch.lessonId);
      await activity(bob, '2026-10-11T08:00:00Z', ch.lessonId, 'video_view');
      await db.query(`INSERT INTO video_requests (student_id, topic_id, description) VALUES ($1, $3, 'alice q'), ($2, $3, 'bob q')`, [
        alice,
        bob,
        ch.lessonId,
      ]);
      return { alice, bob, admin, ch };
    }

    const owners = async (sql: string) => (await db.query(sql)).rows.map((r) => r.student_id as string);

    it("hides other students' rows in every per-student table", async () => {
      const { alice, bob } = await twoStudents();
      for (const [me, other] of [[alice, bob], [bob, alice]]) {
        await as(me, async () => {
          for (const table of ['practice_attempts', 'question_attempts', 'activity_events', 'video_requests']) {
            const seen = await owners(`SELECT student_id FROM ${table}`);
            expect(seen.length, table).toBeGreaterThan(0);
            expect(new Set(seen), table).toEqual(new Set([me]));
            expect(seen, table).not.toContain(other);
          }
        });
      }
    });

    it("cannot aggregate another student's progress or streaks", async () => {
      const { alice, bob } = await twoStudents();
      await expect(progress(bob, alice)).rejects.toMatchObject({ code: '42501' });
      await expect(
        as(alice, () => db.query(`SELECT get_student_streaks($1)`, [bob]))
      ).rejects.toMatchObject({ code: '42501' });
      // Their own numbers only count their own rows.
      expect((await progress(alice)).totals.attempted).toBe(3);
      expect((await progress(bob)).totals.attempted).toBe(7);
    });

    it("cannot write rows for another student or change a request's answer", async () => {
      const { alice, bob, ch } = await twoStudents();
      await expect(
        as(alice, () => db.query(`INSERT INTO activity_events (student_id, type) VALUES ($1, 'lesson_view')`, [bob]))
      ).rejects.toMatchObject({ code: '42501' });
      await expect(
        as(alice, () =>
          db.query(`INSERT INTO practice_attempts (student_id, problem_id, topic_id, is_correct) VALUES ($1, $2, $3, true)`, [
            bob,
            ch.problemId,
            ch.lessonId,
          ])
        )
      ).rejects.toMatchObject({ code: '42501' });
      await expect(
        as(alice, () => db.query(`INSERT INTO video_requests (student_id, description) VALUES ($1, 'spoof')`, [bob]))
      ).rejects.toMatchObject({ code: '42501' });
      // Own rows are fine.
      await as(alice, () => db.query(`INSERT INTO activity_events (student_id, type) VALUES ($1, 'video_view')`, [alice]));
      // A student can't mark their own request fulfilled.
      const upd = await as(alice, () => db.query(`UPDATE video_requests SET status = 'fulfilled' WHERE student_id = $1`, [alice]));
      expect(upd.rowCount).toBe(0);
    });

    it('cannot read the users table at all', async () => {
      const { alice } = await twoStudents();
      await expect(as(alice, () => db.query(`SELECT email FROM users`))).rejects.toMatchObject({ code: '42501' });
    });

    it('lets admins read everyone and write lesson_videos; students and visitors cannot write', async () => {
      const { alice, bob, admin, ch } = await twoStudents();
      await as(admin, async () => {
        // Both test students (the database may hold other rows too).
        expect(await owners(`SELECT student_id FROM practice_attempts`)).toEqual(expect.arrayContaining([alice, bob]));
        expect(await owners(`SELECT student_id FROM video_requests`)).toEqual(expect.arrayContaining([alice, bob]));
        await db.query(
          `INSERT INTO lesson_videos (lesson_id, youtube_id, title, is_published) VALUES ($1, 'dQw4w9WgXcQ', 'Draft', false), ($1, 'aaaaaaaaaaa', 'Live', true)`,
          [ch.lessonId]
        );
        expect(
          (await db.query(`SELECT title FROM lesson_videos WHERE lesson_id = $1 ORDER BY title`, [ch.lessonId])).rows.map((r) => r.title)
        ).toEqual(['Draft', 'Live']);
      });
      for (const viewer of [alice, null]) {
        await as(viewer, async () => {
          // Drafts are invisible; published videos are readable by anyone.
          expect(
            (await db.query(`SELECT title FROM lesson_videos WHERE lesson_id = $1`, [ch.lessonId])).rows.map((r) => r.title)
          ).toEqual(['Live']);
          const upd = await db.query(`UPDATE lesson_videos SET title = 'hacked'`);
          expect(upd.rowCount).toBe(0);
          const del = await db.query(`DELETE FROM lesson_videos`);
          expect(del.rowCount).toBe(0);
        });
        await expect(
          as(viewer, () => db.query(`INSERT INTO lesson_videos (lesson_id, youtube_id, title) VALUES ($1, 'bbbbbbbbbbb', 'x')`, [ch.lessonId]))
        ).rejects.toMatchObject({ code: '42501' });
      }
    });

    it('shows an anonymous visitor no per-student rows', async () => {
      await twoStudents();
      await as(null, async () => {
        for (const table of ['practice_attempts', 'question_attempts', 'activity_events', 'video_requests']) {
          expect((await db.query(`SELECT 1 FROM ${table}`)).rowCount, table).toBe(0);
        }
      });
    });

    it('rejects an invalid YouTube id at the database level', async () => {
      const { ch } = await twoStudents();
      await expect(
        db.query(`INSERT INTO lesson_videos (lesson_id, youtube_id, title) VALUES ($1, 'https://x', 't')`, [ch.lessonId])
      ).rejects.toMatchObject({ code: '23514' });
    });
  });

  // ------------------------------------------- dashboard video tab (migration 05)

  describe('video requests on the dashboard', () => {
    async function fulfilledPair() {
      const alice = await makeUser();
      const bob = await makeUser();
      const ch = await makeChapter(await makeCourse(), 1);
      const r = await db.query(
        `INSERT INTO video_requests (student_id, topic_id, description, status, youtube_url, youtube_id)
         VALUES ($1, $3, 'alice q', 'fulfilled', 'https://youtu.be/dQw4w9WgXcQ', 'dQw4w9WgXcQ'),
                ($2, $3, 'bob q', 'fulfilled', 'https://youtu.be/9bZkp7q19f0', '9bZkp7q19f0')
         RETURNING id, student_id`,
        [alice, bob, ch.lessonId]
      );
      const aliceReq = r.rows.find((x) => x.student_id === alice).id as string;
      const bobReq = r.rows.find((x) => x.student_id === bob).id as string;
      return { alice, bob, aliceReq, bobReq };
    }

    // The query lib/videoRequests/student.ts getMyVideoRequests runs.
    const myRequests = (studentId: string) =>
      db.query(
        `SELECT r.id, r.student_id, r.youtube_id, o.opened_at
         FROM video_requests r
         LEFT JOIN video_request_opens o ON o.request_id = r.id AND o.student_id = r.student_id
         WHERE r.student_id = $1`,
        [studentId]
      );

    it("returns only the student's own requests, even when asked for someone else's", async () => {
      const { alice, bob } = await fulfilledPair();
      await as(alice, async () => {
        expect((await myRequests(alice)).rows.map((r) => r.student_id)).toEqual([alice]);
        expect((await myRequests(bob)).rowCount).toBe(0);
        expect((await db.query(`SELECT 1 FROM video_requests WHERE student_id = $1`, [bob])).rowCount).toBe(0);
      });
    });

    it('lets a student mark only their own video opened', async () => {
      const { alice, bob, aliceReq, bobReq } = await fulfilledPair();
      await as(alice, () =>
        db.query(`INSERT INTO video_request_opens (student_id, request_id, youtube_id) VALUES ($1, $2, 'dQw4w9WgXcQ')`, [alice, aliceReq])
      );
      expect((await as(alice, () => myRequests(alice))).rows[0].opened_at).not.toBeNull();
      // Bob's request, in Alice's name or in Bob's: both refused.
      await expect(
        as(alice, () =>
          db.query(`INSERT INTO video_request_opens (student_id, request_id, youtube_id) VALUES ($1, $2, '9bZkp7q19f0')`, [alice, bobReq])
        )
      ).rejects.toMatchObject({ code: '42501' });
      await expect(
        as(alice, () =>
          db.query(`INSERT INTO video_request_opens (student_id, request_id, youtube_id) VALUES ($1, $2, '9bZkp7q19f0')`, [bob, bobReq])
        )
      ).rejects.toMatchObject({ code: '42501' });
      // Bob sees none of Alice's opens.
      expect((await as(bob, () => db.query(`SELECT 1 FROM video_request_opens`))).rowCount).toBe(0);
    });

    it('stores only valid 11-character ids and backfills them from existing links', async () => {
      const { alice } = await fulfilledPair();
      await db.query('SAVEPOINT bad_id');
      await expect(
        db.query(`UPDATE video_requests SET youtube_id = 'not-an-id' WHERE student_id = $1`, [alice])
      ).rejects.toMatchObject({ code: '23514' });
      await db.query('ROLLBACK TO SAVEPOINT bad_id');
      const r = await db.query(
        `INSERT INTO video_requests (student_id, description, status, youtube_url)
         VALUES ($1, 'a', 'fulfilled', 'https://www.youtube.com/watch?v=a-B_c1D2e3F&si=x'),
                ($1, 'b', 'fulfilled', 'https://youtube.com/shorts/dQw4w9WgXcQ?si=1'),
                ($1, 'c', 'fulfilled', 'https://youtu.be/dQw4w9WgXcQX')
         RETURNING id`,
        [alice]
      );
      await db.query(readFileSync(path.join(root, 'database/seeds/2026-10-14-05-video-request-ids-and-opens.sql'), 'utf8'));
      const ids = await db.query(`SELECT description, youtube_id FROM video_requests WHERE id = ANY($1) ORDER BY description`, [
        r.rows.map((x) => x.id),
      ]);
      expect(ids.rows).toEqual([
        { description: 'a', youtube_id: 'a-B_c1D2e3F' },
        { description: 'b', youtube_id: 'dQw4w9WgXcQ' },
        { description: 'c', youtube_id: null },
      ]);
    });
  });

});
