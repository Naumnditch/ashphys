/**
 * The teacher's handwritten worked solution for one practice question.
 *
 * GET  — status: is there one, and would opening it spend a view? No content
 *        except the teaser for viewers who are out of views. No side effects.
 * POST — open it: runs the solutions tier gate (lib/solutions/access.ts —
 *        Free/Plus view caps shared with interactive solutions, Pro unlimited),
 *        logs the view, and returns the page snapshots if allowed.
 *
 * A student gets anything only after answering the question incorrectly at
 * least once; before that both answer 403 without saying whether a solution
 * exists. The rule is enforced by the read policy on question_handwriting
 * (the query runs under row-level security as the student), not just here.
 * Admins always see it. The lesson's own tier gate (topics.required_tier)
 * applies first, exactly as for the practice questions themselves.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, type CurrentUser } from '@/lib/auth/session';
import { fail, UUID_RE } from '@/lib/messaging/http';
import { getUserTier } from '@/lib/subscriptions/getUserTier';
import { getViewStatus, hasUnlocked, resolveSolutionAccess } from '@/lib/solutions/access';
import { findQuestion, isHandwritingSchemaMissing, readHandwritingAs, type QuestionRef } from '@/lib/handwriting/store';
import type { HandwritingViewDTO } from '@/lib/handwriting/dto';

export const dynamic = 'force-dynamic';

type Params = { params: { topicId: string; problemId: string } };

const ADMIN_ACCESS = { allowed: true, costsView: false, reason: 'ok', viewsUsed: 0, viewLimit: null } as const;

async function gate({ params }: Params): Promise<NextResponse | { user: CurrentUser; tier: number; q: QuestionRef }> {
  const user = await getCurrentUser();
  if (!user) return fail('Please log in first', 401);
  if (!UUID_RE.test(params.topicId) || !UUID_RE.test(params.problemId)) return fail('Question not found', 404);
  const q = await findQuestion(params.problemId, params.topicId);
  if (!q) return fail('Question not found', 404);
  const tier = await getUserTier(user.id);
  if (user.role !== 'admin' && tier < q.requiredTier) return fail('This lesson requires a higher plan', 403);
  return { user, tier, q };
}

const answerFirst = () =>
  NextResponse.json({ success: false, error: 'Answer this question first.', reason: 'answer_first' }, { status: 403 });

function respond(body: HandwritingViewDTO) {
  return NextResponse.json({ success: true, ...body });
}

export async function GET(_req: NextRequest, ctx: Params) {
  try {
    const g = await gate(ctx);
    if (g instanceof NextResponse) return g;
    const { user, tier, q } = g;

    if (user.role === 'admin') {
      const { row } = await readHandwritingAs(user, q, true);
      if (!row) return respond({ available: false });
      return respond({ available: true, pageCount: row.pageCount, access: ADMIN_ACCESS, pages: row.snapshots ?? [] });
    }

    const { answeredIncorrectly, row } = await readHandwritingAs(user, q, false);
    if (!answeredIncorrectly) return answerFirst();
    if (!row) return respond({ available: false });

    const target = { problemId: q.problemId };
    const [unlocked, { viewsUsed, viewLimit }] = await Promise.all([hasUnlocked(user.id, target), getViewStatus(user.id, tier)]);
    const canOpen = unlocked || viewLimit === null || viewsUsed < viewLimit;
    return respond({
      available: true,
      pageCount: row.pageCount,
      access: {
        allowed: unlocked || viewLimit === null,
        costsView: !unlocked && viewLimit !== null && canOpen,
        reason: canOpen ? 'ok' : 'limit_reached',
        viewsUsed,
        viewLimit,
      },
      preview: canOpen ? null : row.preview,
    });
  } catch (err) {
    // Before the migration there is simply no handwriting to show.
    if (isHandwritingSchemaMissing(err)) return respond({ available: false });
    console.error('[handwriting] status failed', err);
    return fail('Could not load the worked solution.', 500);
  }
}

export async function POST(_req: NextRequest, ctx: Params) {
  try {
    const g = await gate(ctx);
    if (g instanceof NextResponse) return g;
    const { user, tier, q } = g;

    const { answeredIncorrectly, row } = await readHandwritingAs(user, q, true);
    if (user.role === 'admin') {
      if (!row) return respond({ available: false });
      return respond({ available: true, pageCount: row.pageCount, access: ADMIN_ACCESS, pages: row.snapshots ?? [] });
    }
    if (!answeredIncorrectly) return answerFirst();
    if (!row) return respond({ available: false });

    // Read first, then spend: a view is never spent on a solution that isn't there.
    const access = await resolveSolutionAccess(user.id, tier, { problemId: q.problemId }, 'free');
    return respond({
      available: true,
      pageCount: row.pageCount,
      access: { ...access, costsView: false },
      ...(access.allowed ? { pages: row.snapshots ?? [] } : { preview: row.preview }),
    });
  } catch (err) {
    // Before the migration there is simply no handwriting to show.
    if (isHandwritingSchemaMissing(err)) return respond({ available: false });
    console.error('[handwriting] open failed', err);
    return fail('Could not open the worked solution.', 500);
  }
}
