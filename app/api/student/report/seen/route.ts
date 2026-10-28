/**
 * POST /api/student/report/seen — the signed-in student opened their
 * progress report: their teacher notes count as read (clears the tab badge).
 */

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { markNotesRead } from '@/lib/reports/notes';

export const dynamic = 'force-dynamic';

export async function POST() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, error: 'Please sign in' }, { status: 401 });
  try {
    const marked = await markNotesRead(user.id);
    return NextResponse.json({ success: true, marked });
  } catch (err) {
    console.error('[report] mark seen failed', err);
    return NextResponse.json({ success: false, error: 'Could not update' }, { status: 500 });
  }
}
