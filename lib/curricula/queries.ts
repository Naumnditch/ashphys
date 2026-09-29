/**
 * Server-side curriculum queries: which lessons a curriculum lists, and which
 * curriculum a student has chosen.
 */

import { cookies } from 'next/headers';
import { query } from '@/lib/db/client';
import { CURRICULUM_COOKIE, DEFAULT_CURRICULUM, isCurriculumId, tryParseCurriculum, type CurriculumId } from './index';
import type { LessonRow } from './lessons';

const LESSON_COLUMNS = `
  t.id, t.topic_name, t."order", t.required_tier, t.curriculum_ids,
  t.topic_code, t.as_topic_code, t.a_level_topic_code, t.ib_topic_code, t.syllabus_reference,
  c.id AS chapter_id, c.chapter_number, c.title AS chapter_title, co.code AS course_code`;

/**
 * Every published lesson in a curriculum, with its simulations (shared by all
 * curricula) and the size of THIS curriculum's question bank for it.
 */
export async function getLessonsByCurriculum(curriculumId: CurriculumId): Promise<LessonRow[]> {
  const result = await query(
    `SELECT ${LESSON_COLUMNS},
            (SELECT COUNT(*)::int FROM problems p WHERE p.topic_id = t.id AND p.curriculum_id = $1) AS question_count,
            COALESCE(
              (SELECT json_agg(json_build_object('id', s.id, 'title', s.title, 'urlPath', s.url_path) ORDER BY s."order", s.title)
               FROM simulations s WHERE s.topic_id = t.id),
              '[]'::json
            ) AS simulations
     FROM topics t
     JOIN chapters c ON c.id = t.chapter_id
     JOIN courses co ON co.id = c.course_id
     WHERE t.curriculum_ids @> ARRAY[$1]::text[] AND c.status = 'published'
     ORDER BY c.chapter_number, t."order"`,
    [curriculumId]
  );
  return result.rows as LessonRow[];
}

export interface LessonDetail extends LessonRow {
  /** Question bank size per curriculum, e.g. { igcse: 12, as: 5 }. */
  question_counts: Partial<Record<CurriculumId, number>>;
}

/** One lesson with its simulations and the size of every curriculum's question bank for it. */
export async function getLesson(topicId: string): Promise<LessonDetail | null> {
  const result = await query(
    `SELECT ${LESSON_COLUMNS},
            0 AS question_count,
            COALESCE(
              (SELECT json_agg(json_build_object('id', s.id, 'title', s.title, 'urlPath', s.url_path) ORDER BY s."order", s.title)
               FROM simulations s WHERE s.topic_id = t.id),
              '[]'::json
            ) AS simulations,
            COALESCE(
              (SELECT json_object_agg(curriculum_id, n)
               FROM (SELECT curriculum_id, COUNT(*)::int AS n FROM problems WHERE topic_id = t.id GROUP BY curriculum_id) counts),
              '{}'::json
            ) AS question_counts
     FROM topics t
     JOIN chapters c ON c.id = t.chapter_id
     JOIN courses co ON co.id = c.course_id
     WHERE t.id = $1`,
    [topicId]
  );
  return (result.rows[0] as LessonDetail) ?? null;
}

export async function getUserCurriculum(userId: string): Promise<CurriculumId | null> {
  try {
    const result = await query(`SELECT selected_curriculum FROM user_preferences WHERE user_id = $1`, [userId]);
    const value = result.rows[0]?.selected_curriculum;
    return isCurriculumId(value) ? value : null;
  } catch (err) {
    console.error('getUserCurriculum failed', err);
    return null;
  }
}

export async function setUserCurriculum(userId: string, curriculumId: CurriculumId): Promise<void> {
  await query(
    `INSERT INTO user_preferences (user_id, selected_curriculum)
     VALUES ($1, $2)
     ON CONFLICT (user_id) DO UPDATE SET selected_curriculum = EXCLUDED.selected_curriculum, updated_at = now()`,
    [userId, curriculumId]
  );
}

/** The curriculum saved in this browser's cookie, if any. */
export function getCookieCurriculum(): CurriculumId | null {
  const value = cookies().get(CURRICULUM_COOKIE)?.value;
  return isCurriculumId(value) ? value : null;
}

export type CurriculumSource = 'url' | 'account' | 'cookie' | 'default';

/**
 * Which curriculum a page should show: the URL wins (so links are
 * shareable), then a logged-in student's saved choice, then this browser's
 * cookie, then IGCSE. `source` says which one decided.
 */
export async function resolveCurriculum(
  requested: unknown,
  userId?: string | null
): Promise<{ curriculumId: CurriculumId; source: CurriculumSource }> {
  const fromUrl = tryParseCurriculum(requested);
  if (fromUrl) return { curriculumId: fromUrl, source: 'url' };
  const saved = userId ? await getUserCurriculum(userId) : null;
  if (saved) return { curriculumId: saved, source: 'account' };
  const fromCookie = getCookieCurriculum();
  if (fromCookie) return { curriculumId: fromCookie, source: 'cookie' };
  return { curriculumId: DEFAULT_CURRICULUM, source: 'default' };
}
