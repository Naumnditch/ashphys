/**
 * A student's own video requests: read, create, mark opened.
 *
 * With migration 03 applied every query runs under row-level security
 * (withRlsContext: the policies only show / accept the caller's own rows).
 * Before it, the same queries run as the owner, exactly like production did
 * before 2026-10-14, and always scoped by the server-verified student id;
 * the student id never comes from the request body. That fallback is what
 * keeps submission working when code ships ahead of the migrations (the
 * 2026-10-14 "Network error" incident, see PROJECT_STATUS.md).
 *
 * The stored YouTube link is reduced to its video id here and the link
 * itself never leaves the server: students get the on-site embed only.
 */

import type { PoolClient } from 'pg';
import { getPool } from '@/lib/db/client';
import { withRlsContext } from '@/lib/db/rls';
import { getSchemaFeatures, type SchemaFeatures } from '@/lib/db/schemaFeatures';
import type { StudentVideoRequest } from '@/lib/videoRequests/types';
import { signedFileUrl } from '@/lib/storage/signed';
import { isValidYouTubeId, parseYouTubeId } from '@/lib/youtube/videoId';

export type { StudentVideoRequest, VideoRequestStatus } from '@/lib/videoRequests/types';
export { readyVideoCount } from '@/lib/videoRequests/types';

export const SCREENSHOT_BUCKET = 'video-request-screenshots';

/** RLS when the policies exist, else an owner connection (callers always filter by student.id). */
async function withStudentDb<T>(
  student: { id: string },
  features: SchemaFeatures,
  fn: (db: PoolClient) => Promise<T>
): Promise<T> {
  if (features.rlsRole && features.videoRequestRls) return withRlsContext(student, fn);
  const client = await getPool().connect();
  try {
    return await fn(client);
  } finally {
    client.release();
  }
}

async function screenshotUrl(path: string | null): Promise<string | null> {
  if (!path) return null;
  try {
    return await signedFileUrl(SCREENSHOT_BUCKET, path);
  } catch (err) {
    console.error('video requests: screenshot link failed', err);
    return null;
  }
}

export async function getMyVideoRequests(student: { id: string }): Promise<StudentVideoRequest[]> {
  const f = await getSchemaFeatures();
  const rows = await withStudentDb(student, f, async (db) => {
    const result = await db.query(
      `SELECT r.id, r.description, r.screenshot_path, r.status, r.youtube_url, r.admin_note, r.created_at, r.topic_id,
              ${f.questionNumber ? 'r.question_number' : 'NULL::text AS question_number'},
              ${f.requestYoutubeId ? 'r.youtube_id' : 'NULL::text AS youtube_id'},
              t.topic_name, c.chapter_number, c.title AS chapter_title,
              ${f.requestOpens ? 'o.opened_at, o.youtube_id AS opened_youtube_id' : 'NULL::timestamptz AS opened_at, NULL::text AS opened_youtube_id'}
       FROM video_requests r
       LEFT JOIN topics t ON t.id = r.topic_id
       LEFT JOIN chapters c ON c.id = r.chapter_id
       ${f.requestOpens ? 'LEFT JOIN video_request_opens o ON o.request_id = r.id AND o.student_id = r.student_id' : ''}
       WHERE r.student_id = $1
       ORDER BY r.created_at DESC`,
      [student.id]
    );
    return result.rows;
  });

  return Promise.all(
    rows.map(async (r) => {
      // youtube_id is written on admin save (2026-10-14-05); older rows fall back to parsing the link.
      const youtubeId =
        r.status !== 'fulfilled'
          ? null
          : isValidYouTubeId(r.youtube_id)
            ? r.youtube_id
            : r.youtube_url
              ? (() => {
                  const parsed = parseYouTubeId(r.youtube_url);
                  return parsed.ok ? parsed.id : null;
                })()
              : null;
      return {
        id: r.id,
        description: r.description,
        questionNumber: r.question_number,
        status: r.status,
        youtubeId,
        // Opened only counts for the video that is there now.
        openedAt:
          r.opened_at && youtubeId && r.opened_youtube_id === youtubeId
            ? r.opened_at instanceof Date
              ? r.opened_at.toISOString()
              : r.opened_at
            : null,
        adminNote: r.admin_note,
        createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
        topicId: r.topic_id,
        topicName: r.topic_name,
        chapterNumber: r.chapter_number,
        chapterTitle: r.chapter_title,
        screenshotUrl: await screenshotUrl(r.screenshot_path),
      } satisfies StudentVideoRequest;
    })
  );
}

export interface NewVideoRequest {
  /** Id minted by POST /api/video-requests/upload (it is in the screenshot path); otherwise generated here. */
  id?: string | null;
  description: string;
  topicId: string | null;
  chapterId: string | null;
  questionNumber: string | null;
  /** The practice question (problems row); the API has checked it belongs to topicId. */
  questionId?: string | null;
  screenshotPath: string | null;
}

/**
 * Inserts the request for `student` (the session's user — never a body
 * field); a lesson's chapter is taken from the lesson itself. Idempotent on
 * the id: a double submit returns the row already saved.
 */
export async function createVideoRequest(student: { id: string }, input: NewVideoRequest): Promise<string> {
  const f = await getSchemaFeatures();
  // Columns and parameters built together: an unreferenced $n makes Postgres fail.
  const params: unknown[] = [student.id, input.chapterId, input.topicId, input.description, input.screenshotPath, input.id ?? null];
  let extraCols = '';
  let extraVals = '';
  if (f.questionNumber) {
    params.push(input.questionNumber);
    extraCols = ', question_number';
    extraVals = `, $${params.length}`;
  }
  if (f.requestQuestionId) {
    params.push(input.questionId ?? null);
    extraCols += ', question_id';
    extraVals += `, $${params.length}::uuid`;
  }
  return withStudentDb(student, f, async (db) => {
    const result = await db.query(
      `INSERT INTO video_requests (id, student_id, chapter_id, topic_id, description, screenshot_path${extraCols})
       SELECT COALESCE($6::uuid, gen_random_uuid()), $1, COALESCE(t.chapter_id, $2::uuid), t.id, $4, $5${extraVals}
       FROM (SELECT $3::uuid AS id) wanted
       LEFT JOIN topics t ON t.id = wanted.id
       ON CONFLICT (id) DO NOTHING
       RETURNING id`,
      params
    );
    if (result.rows[0]) return result.rows[0].id as string;
    // Same id already saved (double submit): fine only if it is this student's.
    const existing = await db.query(`SELECT id FROM video_requests WHERE id = $1 AND student_id = $2`, [input.id, student.id]);
    if (existing.rows[0]) return existing.rows[0].id as string;
    throw new Error('request id already in use');
  });
}

/**
 * Records that the student opened their fulfilled video (clears it from the
 * "ready" badge). Only the student's own fulfilled request counts; returns
 * false otherwise, and when migration 05 (the opens table) isn't there yet.
 */
export async function markVideoRequestOpened(student: { id: string }, requestId: string): Promise<boolean> {
  const f = await getSchemaFeatures();
  if (!f.requestOpens) return false;
  return withStudentDb(student, f, async (db) => {
    const visible = await db.query(
      `SELECT ${f.requestYoutubeId ? 'youtube_id' : 'NULL::text AS youtube_id'}, youtube_url, status
       FROM video_requests WHERE id = $1 AND student_id = $2`,
      [requestId, student.id]
    );
    const row = visible.rows[0];
    if (!row || row.status !== 'fulfilled') return false;
    const youtubeId = isValidYouTubeId(row.youtube_id)
      ? row.youtube_id
      : (() => {
          const parsed = row.youtube_url ? parseYouTubeId(row.youtube_url) : null;
          return parsed?.ok ? parsed.id : null;
        })();
    if (!youtubeId) return false;
    await db.query(
      `INSERT INTO video_request_opens (student_id, request_id, youtube_id) VALUES ($1, $2, $3)
       ON CONFLICT (student_id, request_id) DO UPDATE SET youtube_id = EXCLUDED.youtube_id, opened_at = now()
       WHERE video_request_opens.youtube_id IS DISTINCT FROM EXCLUDED.youtube_id`,
      [student.id, requestId, youtubeId]
    );
    return true;
  });
}
