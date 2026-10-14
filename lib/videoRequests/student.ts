/**
 * A student's own video requests, read and written under row-level
 * security (the policies only show / accept the caller's own rows).
 *
 * The stored YouTube link is reduced to its video id here and the link
 * itself never leaves the server: students get the on-site embed only.
 */

import { withRlsContext } from '@/lib/db/rls';
import type { StudentVideoRequest } from '@/lib/videoRequests/types';
import { signedFileUrl } from '@/lib/storage/signed';
import { isValidYouTubeId, parseYouTubeId } from '@/lib/youtube/videoId';

export type { StudentVideoRequest, VideoRequestStatus } from '@/lib/videoRequests/types';
export { readyVideoCount } from '@/lib/videoRequests/types';

export async function getMyVideoRequests(student: { id: string }): Promise<StudentVideoRequest[]> {
  const rows = await withRlsContext(student, async (db) => {
    const result = await db.query(
      `SELECT r.id, r.description, r.question_number, r.screenshot_path, r.status, r.youtube_url, r.youtube_id,
              r.admin_note, r.created_at, r.topic_id, t.topic_name, c.chapter_number, c.title AS chapter_title,
              o.opened_at, o.youtube_id AS opened_youtube_id
       FROM video_requests r
       LEFT JOIN topics t ON t.id = r.topic_id
       LEFT JOIN chapters c ON c.id = r.chapter_id
       LEFT JOIN video_request_opens o ON o.request_id = r.id AND o.student_id = r.student_id
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
        screenshotUrl: r.screenshot_path ? await signedFileUrl('video-request-screenshots', r.screenshot_path) : null,
      } satisfies StudentVideoRequest;
    })
  );
}

export interface NewVideoRequest {
  description: string;
  topicId: string | null;
  chapterId: string | null;
  questionNumber: string | null;
  screenshotPath: string | null;
}

/** Inserts the request; a lesson's chapter is taken from the lesson itself. */
export async function createVideoRequest(student: { id: string }, input: NewVideoRequest): Promise<string> {
  return withRlsContext(student, async (db) => {
    const result = await db.query(
      `INSERT INTO video_requests (student_id, chapter_id, topic_id, description, question_number, screenshot_path)
       SELECT $1, COALESCE(t.chapter_id, $2::uuid), t.id, $4, $5, $6
       FROM (SELECT $3::uuid AS id) wanted
       LEFT JOIN topics t ON t.id = wanted.id
       RETURNING id`,
      [student.id, input.chapterId, input.topicId, input.description, input.questionNumber, input.screenshotPath]
    );
    return result.rows[0].id as string;
  });
}

/**
 * Records that the student opened their fulfilled video (clears it from the
 * "ready" badge). Row-level security only accepts the student's own request;
 * returns false when the request isn't theirs or doesn't exist.
 */
export async function markVideoRequestOpened(student: { id: string }, requestId: string): Promise<boolean> {
  return withRlsContext(student, async (db) => {
    const visible = await db.query(`SELECT youtube_id, youtube_url, status FROM video_requests WHERE id = $1`, [requestId]);
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
