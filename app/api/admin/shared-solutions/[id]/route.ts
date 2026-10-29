/**
 * PATCH /api/admin/shared-solutions/[id]
 *   { action: 'approve' } | { action: 'reject', reason? } | { action: 'verify' } | { action: 'unverify' }
 *
 * Admin-only here AND in the database (row-level security + the guard
 * trigger, which also stamps who reviewed/verified it and when). A
 * withdrawn solution can't be reviewed (409). The rejection reason is shown
 * to the student.
 */

import { NextRequest, NextResponse } from 'next/server';
import { fail, readJson, requireAdmin, UUID_RE, zodMessage } from '@/lib/messaging/http';
import { isHandwritingSchemaMissing } from '@/lib/handwriting/store';
import { reviewSharedSolution, SHARED_SCHEMA_MISSING_MESSAGE } from '@/lib/sharedSolutions/store';
import { reviewInput } from '@/lib/sharedSolutions/validate';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return fail('Not authorized', 403);
  if (!UUID_RE.test(params.id)) return fail('Not found', 404);
  const parsed = reviewInput.safeParse(await readJson(req));
  if (!parsed.success) return fail(zodMessage(parsed.error));
  try {
    const result = await reviewSharedSolution(admin, params.id, parsed.data);
    if (!result.ok) return fail(result.error, result.status);
    return NextResponse.json({ success: true, solution: result.solution });
  } catch (err) {
    if (isHandwritingSchemaMissing(err)) return fail(SHARED_SCHEMA_MISSING_MESSAGE, 503);
    console.error('[shared-solutions] review failed', err);
    return fail('Could not save the review.', 500);
  }
}
