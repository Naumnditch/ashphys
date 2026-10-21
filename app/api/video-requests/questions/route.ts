/**
 * GET /api/video-requests/questions?lesson=<id>[&question=<id>]
 *   → { ok: true, questions: [{ id, number, label }] } | { ok: false, error }
 *
 * The video request form's question dropdown, reloaded when the student picks
 * another lesson. Same gate as the form (Plus/Pro). An unknown lesson is not
 * an error: it just has no questions (the form falls back to a general
 * request). See lib/videoRequests/questionOptions.ts for which bank is used.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getUserTier, TIER_PLUS } from '@/lib/subscriptions/getUserTier';
import { getRequestQuestionOptions } from '@/lib/videoRequests/questionOptions';

const fail = (status: number, error: string) => NextResponse.json({ ok: false, error }, { status });

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return fail(401, 'Not authorized');
  try {
    if (user.role !== 'admin' && (await getUserTier(user.id)) < TIER_PLUS) {
      return fail(403, 'Video solve requests are available on Plus and Pro plans.');
    }
    const lesson = req.nextUrl.searchParams.get('lesson') ?? '';
    const options = await getRequestQuestionOptions(user, lesson, req.nextUrl.searchParams.get('question'));
    return NextResponse.json({ ok: true, questions: options?.questions ?? [] });
  } catch (err) {
    console.error('GET /api/video-requests/questions failed', err);
    return fail(500, 'Could not load the questions for this lesson.');
  }
}
