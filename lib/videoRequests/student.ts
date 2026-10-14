/**
 * A student's own video requests, read and written under row-level
 * security (the policies only show / accept the caller's own rows).
 *
 * The stored YouTube link is reduced to its video id here and the link
 * itself never leaves the server: students get the on-site embed only.
 */

import { withRlsContext } from '@/lib/db/rls';
import { signedFileUrl } from '@/lib/storage/signed';
import { parseYouTubeId } from '@/lib/youtube/videoId';

export type VideoRequestStatus = 'open' | 'in_progress' | 'fulfilled' | 'declined';

export interface StudentVideoRequest {
  id: string;
  description: string;
  questionNumber: string | null;
  status: VideoRequestStatus;
  /** Only set once the request is fulfilled with a valid link. */
  youtubeId: string | null;
  adminNote: string | null;
  createdAt: string;
  topicId: string | null;
  topicName: string | null;
  chapterNumber: number | null;
  chapterTitle: string | null;
  screenshotUrl: string | null;
}

export async function getMyVideoRequests(student: { id: string }): Promise<StudentVideoRequest[]> {
  const rows = await withRlsContext(student, async (db) => {
    const result = await db.query(
      `SELECT r.id, r.description, r.question_number, r.screenshot_path, r.status, r.youtube_url, r.admin_note,
              r.created_at, r.topic_id, t.topic_name, c.chapter_number, c.title AS chapter_title
       FROM video_requests r
       LEFT JOIN topics t ON t.id = r.topic_id
       LEFT JOIN chapters c ON c.id = r.chapter_id
       WHERE r.student_id = $1
       ORDER BY r.created_at DESC`,
      [student.id]
    );
    return result.rows;
  });

  return Promise.all(
    rows.map(async (r) => {
      const parsed = r.status === 'fulfilled' && r.youtube_url ? parseYouTubeId(r.youtube_url) : null;
      return {
        id: r.id,
        description: r.description,
        questionNumber: r.question_number,
        status: r.status,
        youtubeId: parsed?.ok ? parsed.id : null,
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
