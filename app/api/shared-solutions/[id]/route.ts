/**
 * PATCH /api/shared-solutions/[id] — { action: 'withdraw' }
 *
 * The author withdraws a pending or approved solution: status becomes
 * 'withdrawn' and it leaves every public view at once (they only ever show
 * approved rows). Only the author can (row-level security + the table's
 * guard trigger); withdrawing is final.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { fail, readJson, UUID_RE } from '@/lib/messaging/http';
import { isHandwritingSchemaMissing } from '@/lib/handwriting/store';
import { SHARING_UNAVAILABLE_MESSAGE, withdrawSharedSolution } from '@/lib/sharedSolutions/store';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return fail('Please log in first', 401);
  if (!UUID_RE.test(params.id)) return fail('Not found', 404);
  const { action } = (await readJson(req)) as { action?: unknown };
  if (action !== 'withdraw') return fail('action must be withdraw');
  try {
    const result = await withdrawSharedSolution(user, params.id);
    if (!result.ok) return fail(result.error, result.status);
    return NextResponse.json({ success: true, solution: result.solution });
  } catch (err) {
    if (isHandwritingSchemaMissing(err)) return fail(SHARING_UNAVAILABLE_MESSAGE, 503);
    console.error('[shared-solutions] withdraw failed', err);
    return fail('Could not withdraw your solution.', 500);
  }
}
