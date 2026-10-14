/**
 * lesson_videos reads and writes. Every query runs through withRlsContext,
 * so the database itself decides what the caller may see (published rows
 * for everyone, everything for admins) and who may write (admins only).
 */

import type { PoolClient } from 'pg';
import { withRlsContext } from '@/lib/db/rls';
import { isValidYouTubeId } from '@/lib/youtube/videoId';

export interface LessonVideo {
  id: string;
  lessonId: string;
  youtubeId: string;
  title: string;
  description: string | null;
  sortOrder: number;
  isPublished: boolean;
  sourceRequestId: string | null;
  createdAt: string;
}

export interface AdminLessonVideo extends LessonVideo {
  lessonName: string;
  chapterTitle: string;
  chapterNumber: number;
  courseCode: string | null;
}

const COLUMNS = `v.id, v.lesson_id, v.youtube_id, v.title, v.description, v.sort_order, v.is_published,
                 v.source_request_id, v.created_at`;

function toVideo(r: Record<string, any>): LessonVideo {
  return {
    id: r.id,
    lessonId: r.lesson_id,
    youtubeId: r.youtube_id,
    title: r.title,
    description: r.description,
    sortOrder: r.sort_order,
    isPublished: r.is_published,
    sourceRequestId: r.source_request_id,
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : r.created_at,
  };
}

/** A lesson's published videos in sort_order (RLS hides drafts from non-admins anyway). */
export async function getPublishedLessonVideos(user: { id: string } | null, lessonId: string): Promise<LessonVideo[]> {
  return withRlsContext(user, async (db) => {
    const result = await db.query(
      `SELECT ${COLUMNS} FROM lesson_videos v
       WHERE v.lesson_id = $1 AND v.is_published
       ORDER BY v.sort_order, v.created_at`,
      [lessonId]
    );
    return result.rows.map(toVideo);
  });
}

export async function listAllLessonVideos(admin: { id: string }): Promise<AdminLessonVideo[]> {
  return withRlsContext(admin, async (db) => {
    const result = await db.query(
      `SELECT ${COLUMNS}, t.topic_name, c.title AS chapter_title, c.chapter_number, co.code AS course_code
       FROM lesson_videos v
       JOIN topics t ON t.id = v.lesson_id
       JOIN chapters c ON c.id = t.chapter_id
       LEFT JOIN courses co ON co.id = c.course_id
       ORDER BY co.code = '0625' DESC, co.code, c.chapter_number, t."order", v.sort_order, v.created_at`
    );
    return result.rows.map((r) => ({
      ...toVideo(r),
      lessonName: r.topic_name,
      chapterTitle: r.chapter_title,
      chapterNumber: r.chapter_number,
      courseCode: r.course_code,
    }));
  });
}

export interface LessonVideoInput {
  lessonId: string;
  youtubeId: string;
  title: string;
  description?: string | null;
  sortOrder?: number;
  isPublished?: boolean;
  sourceRequestId?: string | null;
}

/**
 * Creates the lesson video, or — if this video is already on this lesson —
 * links it instead of duplicating it: a missing source request is filled
 * in, and then either the new title/order/published values are applied
 * (`onExisting: 'overwrite'`, the admin form) or the existing row is kept
 * as it is, only ever moving from draft to published, never back
 * (`onExisting: 'link'`, fulfilling a request).
 */
export async function upsertLessonVideo(
  db: PoolClient,
  input: LessonVideoInput,
  onExisting: 'overwrite' | 'link' = 'overwrite'
): Promise<LessonVideo> {
  if (!isValidYouTubeId(input.youtubeId)) throw new Error('Invalid YouTube id');
  const keep = onExisting === 'link';
  const result = await db.query(
    `INSERT INTO lesson_videos AS v (lesson_id, youtube_id, title, description, sort_order, is_published, source_request_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     ON CONFLICT (lesson_id, youtube_id) DO UPDATE SET
       title = CASE WHEN $8 THEN v.title ELSE EXCLUDED.title END,
       description = CASE WHEN $8 THEN v.description ELSE COALESCE(EXCLUDED.description, v.description) END,
       sort_order = CASE WHEN $8 THEN v.sort_order ELSE EXCLUDED.sort_order END,
       is_published = CASE WHEN $8 THEN v.is_published OR EXCLUDED.is_published ELSE EXCLUDED.is_published END,
       source_request_id = COALESCE(v.source_request_id, EXCLUDED.source_request_id),
       updated_at = now()
     RETURNING ${COLUMNS}`,
    [
      input.lessonId,
      input.youtubeId,
      input.title.trim(),
      input.description?.trim() || null,
      input.sortOrder ?? 0,
      input.isPublished ?? false,
      input.sourceRequestId ?? null,
      keep,
    ]
  );
  return toVideo(result.rows[0]);
}

/** Next free sort_order on a lesson (so a new video lands at the end). */
export async function nextSortOrder(db: PoolClient, lessonId: string): Promise<number> {
  const result = await db.query(
    `SELECT COALESCE(max(sort_order) + 1, 0)::int AS n FROM lesson_videos WHERE lesson_id = $1`,
    [lessonId]
  );
  return result.rows[0].n;
}
