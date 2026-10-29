/**
 * GET /api/admin/shared-solutions?status=pending|approved|rejected|withdrawn|all
 *
 * The review queue: each student solution with its question (text, figure,
 * answer and explanation) and the teacher's handwritten solution, so they can
 * be compared side by side. Admin-only here AND in the database.
 */

import { NextRequest, NextResponse } from 'next/server';
import { fail, requireAdmin } from '@/lib/messaging/http';
import { isHandwritingSchemaMissing } from '@/lib/handwriting/store';
import { listForReview, SHARED_SCHEMA_MISSING_MESSAGE, type ReviewFilter } from '@/lib/sharedSolutions/store';

export const dynamic = 'force-dynamic';

const FILTERS: ReviewFilter[] = ['pending', 'approved', 'rejected', 'withdrawn', 'all'];

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return fail('Not authorized', 403);
  const status = (req.nextUrl.searchParams.get('status') ?? 'pending') as ReviewFilter;
  if (!FILTERS.includes(status)) return fail('Unknown status');
  try {
    return NextResponse.json({ success: true, solutions: await listForReview(admin, status) });
  } catch (err) {
    if (isHandwritingSchemaMissing(err)) return fail(SHARED_SCHEMA_MISSING_MESSAGE, 503);
    console.error('[shared-solutions] review list failed', err);
    return fail('Could not load the student solutions.', 500);
  }
}
