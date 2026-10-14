/**
 * POST /api/activity — { type: 'lesson_view' | 'video_view', lessonId? }
 *
 * Feeds the dashboard's streaks and "lessons visited". The student comes
 * from the auth cookie, never the body. Anonymous calls are ignored. Always
 * 200 for a well-formed beacon: nothing on the client listens for failures.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { isActivityType, recordActivityEvent } from '@/lib/activity/record';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
  let body: { type?: unknown; lessonId?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }
  if (!isActivityType(body.type)) {
    return NextResponse.json({ success: false, error: 'Unknown activity type' }, { status: 400 });
  }
  const lessonId = typeof body.lessonId === 'string' && UUID.test(body.lessonId) ? body.lessonId : null;

  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: true, recorded: false });

  try {
    const recorded = await recordActivityEvent(user, body.type, lessonId);
    return NextResponse.json({ success: true, recorded });
  } catch (err) {
    console.error('activity route failed', err);
    return NextResponse.json({ success: true, recorded: false });
  }
}
