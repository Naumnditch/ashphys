/**
 * GET  /api/video-requests — the current student's own requests
 * POST /api/video-requests — submit a new video solve request
 *
 * Server-side tier enforcement (Part 1): this is the actual gate, not the
 * /video-requests page's UI — a Plus/Pro-only feature must reject a free
 * user's request even if they reach this endpoint directly.
 *
 * Reads and writes run under row-level security (lib/videoRequests), and
 * students only ever receive a fulfilled video's id, never its link.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getUserTier, TIER_PLUS } from '@/lib/subscriptions/getUserTier';
import { getMaxOpenVideoRequests } from '@/lib/settings';
import { query } from '@/lib/db/client';
import { createVideoRequest, getMyVideoRequests } from '@/lib/videoRequests/student';

const OPEN_STATUSES = ['open', 'in_progress'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_DESCRIPTION = 2000;
const MAX_QUESTION_NUMBER = 40;

const optionalUuid = (v: unknown) => (typeof v === 'string' && UUID.test(v) ? v : null);

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
  }
  const requests = await getMyVideoRequests(user);
  return NextResponse.json({ success: true, requests });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
  }

  const tier = await getUserTier(user.id);
  if (tier < TIER_PLUS) {
    return NextResponse.json({ success: false, error: 'Video solve requests are available on Plus and Pro plans.' }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    description?: unknown;
    topicId?: unknown;
    lessonId?: unknown;
    chapterId?: unknown;
    questionNumber?: unknown;
    screenshotPath?: unknown;
    requireQuestion?: unknown;
  };
  const description = typeof body.description === 'string' ? body.description.trim() : '';
  if (!description) {
    return NextResponse.json({ success: false, error: 'A description of the problem is required' }, { status: 400 });
  }
  if (description.length > MAX_DESCRIPTION) {
    return NextResponse.json({ success: false, error: `Keep the description under ${MAX_DESCRIPTION} characters` }, { status: 400 });
  }
  const questionNumber = typeof body.questionNumber === 'string' && body.questionNumber.trim() ? body.questionNumber.trim() : null;
  if (questionNumber && questionNumber.length > MAX_QUESTION_NUMBER) {
    return NextResponse.json({ success: false, error: 'The question number is too long' }, { status: 400 });
  }
  // Screenshots are uploaded under the student's own folder (see ./upload);
  // refuse a path pointing anywhere else.
  const screenshotPath = typeof body.screenshotPath === 'string' && body.screenshotPath ? body.screenshotPath : null;
  if (screenshotPath && !screenshotPath.startsWith(`${user.id}/`)) {
    return NextResponse.json({ success: false, error: 'Invalid screenshot' }, { status: 400 });
  }
  const topicId = optionalUuid(body.lessonId) ?? optionalUuid(body.topicId);
  // The homepage form asks for a lesson and for a question number or a screenshot.
  if (body.requireQuestion === true) {
    if (!topicId) return NextResponse.json({ success: false, error: 'Choose the lesson you are stuck on' }, { status: 400 });
    if (!questionNumber && !screenshotPath) {
      return NextResponse.json({ success: false, error: 'Add the question number or a screenshot of the question' }, { status: 400 });
    }
  }

  const maxOpen = await getMaxOpenVideoRequests();
  const openCount = await query(
    `SELECT COUNT(*)::int AS n FROM video_requests WHERE student_id = $1 AND status = ANY($2::text[])`,
    [user.id, OPEN_STATUSES]
  );
  if (openCount.rows[0].n >= maxOpen) {
    return NextResponse.json(
      { success: false, error: `You already have ${maxOpen} open video requests. Wait for one to be answered before submitting another.` },
      { status: 429 }
    );
  }

  const id = await createVideoRequest(user, {
    description,
    topicId,
    chapterId: optionalUuid(body.chapterId),
    questionNumber,
    screenshotPath,
  });

  return NextResponse.json({ success: true, id });
}
