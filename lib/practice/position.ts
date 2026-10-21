/**
 * Server side of the "Request a video" button: where the student stopped in
 * one curriculum's question bank for a lesson, from their practice_attempts
 * rows (the same log GET /api/practice/[topicId] builds the progress map
 * from; the question_attempts view exposes the same rows). Nothing new is
 * stored. The rules live in lib/practice/lastStopped.ts.
 */

import { query } from '@/lib/db/client';
import type { CurriculumId } from '@/lib/curricula';
import { resolveLastStoppedQuestion } from '@/lib/practice/lastStopped';

export async function getStoredPracticeQuestion(
  studentId: string,
  topicId: string,
  curriculumId: CurriculumId
): Promise<string | null> {
  const result = await query(
    `SELECT p.id,
            (SELECT max(a.created_at) FROM practice_attempts a
             WHERE a.student_id = $1 AND a.problem_id = p.id) AS last_attempt_at
     FROM problems p
     WHERE p.topic_id = $2 AND p.curriculum_id = $3
     ORDER BY COALESCE(p.problem_number, p."order"), p."order"`,
    [studentId, topicId, curriculumId]
  );
  let lastAnsweredId: string | null = null;
  let lastAt = -Infinity;
  const questions = result.rows.map((r) => {
    const at = r.last_attempt_at ? new Date(r.last_attempt_at).getTime() : null;
    if (at !== null && at > lastAt) {
      lastAt = at;
      lastAnsweredId = r.id;
    }
    return { id: r.id as string, answered: at !== null };
  });
  return resolveLastStoppedQuestion(questions, { lastAnsweredId });
}
