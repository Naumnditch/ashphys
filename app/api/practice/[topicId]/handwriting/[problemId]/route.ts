/**
 * The worked solutions for one practice question: the teacher's handwritten
 * solution and any approved student solutions (shared by students, reviewed
 * by an admin), shown side by side.
 *
 * GET  — status: is there anything, and would opening it spend a view? No
 *        content except the teacher's teaser for viewers who are out of views.
 *        No side effects.
 * POST — open it: runs the solutions tier gate (lib/solutions/access.ts —
 *        Free/Plus view caps shared with interactive solutions, Pro unlimited),
 *        logs the view, and returns the teacher's page snapshots and the
 *        student solutions if allowed. One view opens all of a question's
 *        solutions (the target is the question).
 *
 * A student gets anything only after answering the question incorrectly at
 * least once; before that both answer 403 without saying whether a solution
 * exists. The rule is enforced by the read policies on question_handwriting
 * and shared_solutions (the queries run under row-level security as the
 * student), not just here. Admins always see them. The lesson's own tier
 * gate (topics.required_tier) applies first, exactly as for the practice
 * questions themselves.
 */

import { NextRequest, NextResponse } from 'next/server';
import { fail } from '@/lib/messaging/http';
import { practiceQuestionGate } from '@/lib/practice/questionGate';
import { getViewStatus, hasUnlocked, resolveSolutionAccess } from '@/lib/solutions/access';
import { isHandwritingSchemaMissing, readHandwritingAs } from '@/lib/handwriting/store';
import { readApprovedSolutionsAs } from '@/lib/sharedSolutions/store';
import type { HandwritingViewDTO } from '@/lib/handwriting/dto';

export const dynamic = 'force-dynamic';

type Params = { params: { topicId: string; problemId: string } };

const ADMIN_ACCESS = { allowed: true, costsView: false, reason: 'ok', viewsUsed: 0, viewLimit: null } as const;

const answerFirst = () =>
  NextResponse.json({ success: false, error: 'Answer this question first.', reason: 'answer_first' }, { status: 403 });

function respond(body: HandwritingViewDTO) {
  return NextResponse.json({ success: true, ...body });
}

export async function GET(_req: NextRequest, ctx: Params) {
  try {
    const g = await practiceQuestionGate(ctx.params);
    if (g instanceof NextResponse) return g;
    const { user, tier, q } = g;
    const isAdmin = user.role === 'admin';

    const [{ answeredIncorrectly, row }, students] = await Promise.all([
      readHandwritingAs(user, q, isAdmin),
      readApprovedSolutionsAs(user, q.problemId, isAdmin),
    ]);
    if (!isAdmin && !answeredIncorrectly) return answerFirst();
    if (!row && students.count === 0) return respond({ available: false });
    const found = { available: true, pageCount: row?.pageCount ?? 0, studentSolutionCount: students.count };

    if (isAdmin) return respond({ ...found, access: ADMIN_ACCESS, pages: row?.snapshots ?? [], studentSolutions: students.solutions });

    const target = { problemId: q.problemId };
    const [unlocked, { viewsUsed, viewLimit }] = await Promise.all([hasUnlocked(user.id, target), getViewStatus(user.id, tier)]);
    const canOpen = unlocked || viewLimit === null || viewsUsed < viewLimit;
    return respond({
      ...found,
      access: {
        allowed: unlocked || viewLimit === null,
        costsView: !unlocked && viewLimit !== null && canOpen,
        reason: canOpen ? 'ok' : 'limit_reached',
        viewsUsed,
        viewLimit,
      },
      preview: canOpen ? null : (row?.preview ?? null),
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
    const g = await practiceQuestionGate(ctx.params);
    if (g instanceof NextResponse) return g;
    const { user, tier, q } = g;

    const [{ answeredIncorrectly, row }, students] = await Promise.all([
      readHandwritingAs(user, q, true),
      readApprovedSolutionsAs(user, q.problemId, true),
    ]);
    const isAdmin = user.role === 'admin';
    if (!isAdmin && !answeredIncorrectly) return answerFirst();
    if (!row && students.count === 0) return respond({ available: false });
    const found = { available: true, pageCount: row?.pageCount ?? 0, studentSolutionCount: students.count };
    const content = { pages: row?.snapshots ?? [], studentSolutions: students.solutions };

    if (isAdmin) return respond({ ...found, access: ADMIN_ACCESS, ...content });

    // Read first, then spend: a view is never spent on a solution that isn't there.
    const access = await resolveSolutionAccess(user.id, tier, { problemId: q.problemId }, 'free');
    return respond({
      ...found,
      access: { ...access, costsView: false },
      ...(access.allowed ? content : { preview: row?.preview ?? null }),
    });
  } catch (err) {
    // Before the migration there is simply no handwriting to show.
    if (isHandwritingSchemaMissing(err)) return respond({ available: false });
    console.error('[handwriting] open failed', err);
    return fail('Could not open the worked solution.', 500);
  }
}
