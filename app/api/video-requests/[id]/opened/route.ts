/**
 * POST /api/video-requests/:id/opened — the student opened their fulfilled
 * video; it stops counting towards the dashboard's "ready" badge.
 * Idempotent. 404 for a request that isn't the caller's (row-level security).
 */

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { markVideoRequestOpened } from '@/lib/videoRequests/student';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
  if (!UUID.test(params.id)) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  const ok = await markVideoRequestOpened(user, params.id);
  if (!ok) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
