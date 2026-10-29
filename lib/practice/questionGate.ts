/**
 * The checks every per-question practice route runs first: signed in, the
 * question exists in that lesson, and the lesson's own tier gate
 * (topics.required_tier; admins pass), exactly as for the practice page.
 * Used by the handwritten solution, the student workspace and sharing.
 */

import { NextResponse } from 'next/server';
import { getCurrentUser, type CurrentUser } from '@/lib/auth/session';
import { fail, UUID_RE } from '@/lib/messaging/http';
import { getUserTier } from '@/lib/subscriptions/getUserTier';
import { findQuestion, type QuestionRef } from '@/lib/handwriting/store';

export interface GatedQuestion {
  user: CurrentUser;
  tier: number;
  q: QuestionRef;
}

export async function practiceQuestionGate(params: { topicId: string; problemId: string }): Promise<NextResponse | GatedQuestion> {
  const user = await getCurrentUser();
  if (!user) return fail('Please log in first', 401);
  if (!UUID_RE.test(params.topicId) || !UUID_RE.test(params.problemId)) return fail('Question not found', 404);
  const q = await findQuestion(params.problemId, params.topicId);
  if (!q) return fail('Question not found', 404);
  const tier = await getUserTier(user.id);
  if (user.role !== 'admin' && tier < q.requiredTier) return fail('This lesson requires a higher plan', 403);
  return { user, tier, q };
}
