/**
 * Which question of a practice set the student "stopped" on, for the
 * "Request a video" button. Pure, so the fallback order is testable.
 *
 * Nothing new is tracked for this. The inputs are what the practice page
 * already has:
 *   - viewedId: the question PracticeSession is showing right now (its own
 *     in-memory position; the session opens on the first untried question);
 *   - lastAnsweredId / answered: the student's practice_attempts rows (the
 *     append-only attempt log the progress map is built from).
 *
 * Order: the question on screen → the last one answered → the first
 * unanswered question → the last question (every one is answered).
 */

export interface LastStoppedQuestion {
  id: string;
  answered: boolean;
}

export function resolveLastStoppedQuestion(
  questions: readonly LastStoppedQuestion[],
  stored: { viewedId?: string | null; lastAnsweredId?: string | null } = {}
): string | null {
  if (questions.length === 0) return null;
  const inSet = (id: string | null | undefined): id is string => !!id && questions.some((q) => q.id === id);
  if (inSet(stored.viewedId)) return stored.viewedId;
  if (inSet(stored.lastAnsweredId)) return stored.lastAnsweredId;
  const firstUnanswered = questions.find((q) => !q.answered);
  return (firstUnanswered ?? questions[questions.length - 1]).id;
}
