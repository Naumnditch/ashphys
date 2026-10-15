/**
 * GET /api/video-requests/lessons — every lesson grouped by chapter, for the
 * homepage request form's lesson picker. Same gate as submitting a request
 * (login + Plus/Pro), loaded only when the form opens so the homepage
 * itself stays light.
 */

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getUserTier, TIER_PLUS } from '@/lib/subscriptions/getUserTier';
import { getLessonPickerGroups } from '@/lib/videos/lessonPicker';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
  if ((await getUserTier(user.id)) < TIER_PLUS) {
    return NextResponse.json({ success: false, error: 'Video solve requests are available on Plus and Pro plans.' }, { status: 403 });
  }
  return NextResponse.json({ success: true, lessons: await getLessonPickerGroups() });
}
