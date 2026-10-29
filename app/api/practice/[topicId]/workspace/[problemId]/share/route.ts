/**
 * "Share my solution" for one practice question.
 *
 * GET  — the share form's defaults (display name = first name + last
 *        initial, the student's age band if they gave one, the consent
 *        version) and the student's own submissions for this question.
 * POST — share the SAVED workspace as it is now: { displayName, workedMyself,
 *        licence, consentVersion, ageBand?, parentConsent? }. Creates a
 *        pending shared_solutions row holding a copy of the strokes and steps.
 *
 * Students only. Under 18 (or never said) needs parentConsent: checked here
 * and by the table's insert policy. One pending/approved submission per
 * question (409 until it is withdrawn or rejected).
 */

import { NextRequest, NextResponse } from 'next/server';
import { fail, readJson, zodMessage } from '@/lib/messaging/http';
import { practiceQuestionGate } from '@/lib/practice/questionGate';
import { isHandwritingSchemaMissing } from '@/lib/handwriting/store';
import { getShareForm, SHARING_UNAVAILABLE_MESSAGE, submitSharedSolution } from '@/lib/sharedSolutions/store';
import { shareInput } from '@/lib/sharedSolutions/validate';

export const dynamic = 'force-dynamic';

type Params = { params: { topicId: string; problemId: string } };

export async function GET(_req: NextRequest, { params }: Params) {
  const g = await practiceQuestionGate(params);
  if (g instanceof NextResponse) return g;
  try {
    return NextResponse.json({ success: true, ...(await getShareForm(g.user, g.q.problemId)) });
  } catch (err) {
    if (isHandwritingSchemaMissing(err)) return fail(SHARING_UNAVAILABLE_MESSAGE, 503);
    console.error('[shared-solutions] form failed', err);
    return fail('Could not load your shared solutions.', 500);
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  const g = await practiceQuestionGate(params);
  if (g instanceof NextResponse) return g;
  const parsed = shareInput.safeParse(await readJson(req));
  if (!parsed.success) return fail(zodMessage(parsed.error).replace(/^[^:]+: /, ''));

  try {
    const result = await submitSharedSolution(g.user, g.q.problemId, parsed.data);
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error, reason: result.reason }, { status: result.status });
    }
    return NextResponse.json({ success: true, solution: result.solution });
  } catch (err) {
    if (isHandwritingSchemaMissing(err)) return fail(SHARING_UNAVAILABLE_MESSAGE, 503);
    console.error('[shared-solutions] share failed', err);
    return fail('Could not share your solution.', 500);
  }
}
