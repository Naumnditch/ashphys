/**
 * The question dropdown of the video request form: the practice questions of
 * one lesson, numbered as the practice page numbers them.
 *
 * A lesson has one question bank per curriculum. The bank is the one the
 * pre-selected question belongs to (so a request from the AS bank lists the
 * AS bank); otherwise the one the practice page would open for this student.
 * Question text is only included when the student could open the lesson's
 * practice (its required tier); otherwise the options are numbers only.
 */

import { query } from '@/lib/db/client';
import { curriculumForTopic, isCurriculumId, type CurriculumId } from '@/lib/curricula';
import { getUserCurriculum } from '@/lib/curricula/queries';
import { getUserTier } from '@/lib/subscriptions/getUserTier';
import { isUuid } from '@/lib/videoRequests/requestLink';
import type { RequestQuestionOption } from '@/lib/videoRequests/types';

const SNIPPET = 70;

function snippet(text: string): string {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > SNIPPET ? `${flat.slice(0, SNIPPET - 1).trimEnd()}…` : flat;
}

/** The lesson a question belongs to, or null when there is no such question. */
export async function lessonOfQuestion(questionId: unknown): Promise<string | null> {
  if (!isUuid(questionId)) return null;
  const result = await query(`SELECT topic_id FROM problems WHERE id = $1`, [questionId]);
  return result.rows[0]?.topic_id ?? null;
}

/**
 * Null when the lesson doesn't exist. `preferQuestionId` picks the bank when
 * it is a question of this lesson; it is otherwise ignored.
 */
export async function getRequestQuestionOptions(
  user: { id: string; role?: string },
  lessonId: string,
  preferQuestionId?: string | null
): Promise<{ curriculumId: CurriculumId; questions: RequestQuestionOption[] } | null> {
  if (!isUuid(lessonId)) return null;
  const topic = (await query(`SELECT id, curriculum_ids, required_tier FROM topics WHERE id = $1`, [lessonId])).rows[0];
  if (!topic) return null;

  let curriculumId: CurriculumId | null = null;
  if (isUuid(preferQuestionId)) {
    const q = await query(`SELECT curriculum_id FROM problems WHERE id = $1 AND topic_id = $2`, [preferQuestionId, lessonId]);
    const bank = q.rows[0]?.curriculum_id;
    if (isCurriculumId(bank)) curriculumId = bank;
  }
  curriculumId ??= curriculumForTopic(topic.curriculum_ids, null, await getUserCurriculum(user.id));

  const [rows, tier] = await Promise.all([
    query(
      `SELECT id, problem_number, question_text
       FROM problems WHERE topic_id = $1 AND curriculum_id = $2
       ORDER BY COALESCE(problem_number, "order"), "order"`,
      [lessonId, curriculumId]
    ),
    user.role === 'admin' ? Promise.resolve(Infinity) : getUserTier(user.id),
  ]);
  const withText = tier >= (topic.required_tier ?? 0);
  return {
    curriculumId,
    questions: rows.rows.map((p, i) => {
      const number = p.problem_number ?? i + 1;
      return {
        id: p.id,
        number,
        label: withText && p.question_text ? `Q${number} — ${snippet(p.question_text)}` : `Question ${number}`,
      };
    }),
  };
}
