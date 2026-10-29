/** GET /api/shared-solutions — the signed-in student's own shared solutions, every status, newest first. */

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { fail } from '@/lib/messaging/http';
import { isHandwritingSchemaMissing } from '@/lib/handwriting/store';
import { listMySubmissions, SHARING_UNAVAILABLE_MESSAGE } from '@/lib/sharedSolutions/store';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return fail('Please log in first', 401);
  try {
    return NextResponse.json({ success: true, solutions: await listMySubmissions(user) });
  } catch (err) {
    if (isHandwritingSchemaMissing(err)) return fail(SHARING_UNAVAILABLE_MESSAGE, 503);
    console.error('[shared-solutions] list failed', err);
    return fail('Could not load your shared solutions.', 500);
  }
}
