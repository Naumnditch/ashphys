/**
 * GET  /api/video-requests — the current student's own requests
 * POST /api/video-requests — submit a new video solve request
 *      → { ok: true, id } | { ok: false, error } (`success` mirrors `ok`)
 *
 * Server-side tier enforcement (Part 1): this is the actual gate, not the
 * form — a Plus/Pro-only feature must reject a free user's request even if
 * they reach this endpoint directly.
 *
 * An optional `questionId` (a practice question, from the dashboard form)
 * must belong to the chosen lesson; it is stored in video_requests.question_id.
 *
 * student_id always comes from the session. A screenshot must be the one
 * POST /api/video-requests/upload minted for this student; its request id
 * becomes the row's id. If the row can't be saved, the uploaded file is
 * deleted so nothing is orphaned. Every failure is JSON with a readable
 * `error` (internal details are logged, not returned).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getUserTier, TIER_PLUS } from '@/lib/subscriptions/getUserTier';
import { getMaxOpenVideoRequests } from '@/lib/settings';
import { query } from '@/lib/db/client';
import { deleteStorageObject } from '@/lib/storage/deleteObject';
import { SCREENSHOT_BUCKET, createVideoRequest, getMyVideoRequests } from '@/lib/videoRequests/student';
import { requestIdFromScreenshotPath } from '@/lib/videoRequests/screenshot';

const OPEN_STATUSES = ['open', 'in_progress'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_DESCRIPTION = 2000;
const MAX_QUESTION_NUMBER = 40;

const optionalUuid = (v: unknown) => (typeof v === 'string' && UUID.test(v) ? v : null);
const fail = (status: number, error: string) => NextResponse.json({ ok: false, success: false, error }, { status });

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return fail(401, 'Not authorized');
  try {
    const requests = await getMyVideoRequests(user);
    return NextResponse.json({ ok: true, success: true, requests });
  } catch (err) {
    console.error('GET /api/video-requests failed', err);
    return fail(500, 'Could not load your requests right now. Please try again.');
  }
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return fail(401, 'you are signed out. Log in again and retry.');

  let screenshotPath: string | null = null;
  try {
    const tier = await getUserTier(user.id);
    if (tier < TIER_PLUS) return fail(403, 'video solve requests are available on Plus and Pro plans.');

    const body = (await req.json().catch(() => ({}))) as {
      description?: unknown;
      topicId?: unknown;
      lessonId?: unknown;
      chapterId?: unknown;
      questionNumber?: unknown;
      questionId?: unknown;
      screenshotPath?: unknown;
      requestId?: unknown;
      requireQuestion?: unknown;
    };
    // Note: any student_id in the body is ignored; the row belongs to the session's user.

    if (typeof body.screenshotPath === 'string' && body.screenshotPath) screenshotPath = body.screenshotPath;
    let requestId: string | null = null;
    if (screenshotPath) {
      requestId = requestIdFromScreenshotPath(screenshotPath, user.id);
      if (!requestId) {
        screenshotPath = null; // never delete a path we didn't mint for this student
        return fail(400, 'the screenshot upload is invalid. Choose the image again.');
      }
      const claimed = optionalUuid(body.requestId);
      if (claimed && claimed.toLowerCase() !== requestId) {
        screenshotPath = null;
        return fail(400, 'the screenshot upload is invalid. Choose the image again.');
      }
    }

    const description = typeof body.description === 'string' ? body.description.trim() : '';
    if (!description) return await rejectAndClean(400, 'describe the problem you need help with.', screenshotPath);
    if (description.length > MAX_DESCRIPTION) {
      return await rejectAndClean(400, `keep the description under ${MAX_DESCRIPTION} characters.`, screenshotPath);
    }
    let questionNumber = typeof body.questionNumber === 'string' && body.questionNumber.trim() ? body.questionNumber.trim() : null;
    if (questionNumber && questionNumber.length > MAX_QUESTION_NUMBER) {
      return await rejectAndClean(400, 'the question number is too long.', screenshotPath);
    }
    let topicId = optionalUuid(body.lessonId) ?? optionalUuid(body.topicId);

    // A practice question picked in the dashboard form. It must be a question
    // of the chosen lesson; with no lesson, it brings its own. Its number
    // fills question_number, so lists that show the number keep working.
    const questionId = optionalUuid(body.questionId);
    if (body.questionId !== undefined && body.questionId !== null && body.questionId !== '' && !questionId) {
      return await rejectAndClean(400, 'that question could not be found. Pick it again.', screenshotPath);
    }
    if (questionId) {
      const found = await query(
        `SELECT q.topic_id, q.number FROM (
           SELECT p.id, p.topic_id,
                  COALESCE(p.problem_number, row_number() OVER (
                    PARTITION BY p.topic_id, p.curriculum_id ORDER BY COALESCE(p.problem_number, p."order"), p."order"
                  )) AS number
           FROM problems p
           WHERE p.topic_id = (SELECT topic_id FROM problems WHERE id = $1)
         ) q WHERE q.id = $1`,
        [questionId]
      );
      const question = found.rows[0];
      if (!question || (topicId && question.topic_id !== topicId)) {
        return await rejectAndClean(400, 'that question is not in the chosen lesson. Pick it again.', screenshotPath);
      }
      topicId ??= question.topic_id as string;
      questionNumber ??= String(question.number);
    }

    // The homepage form asks for a lesson and for a question number or a screenshot.
    if (body.requireQuestion === true) {
      if (!topicId) return await rejectAndClean(400, 'choose the lesson you are stuck on.', screenshotPath);
      if (!questionNumber && !screenshotPath) return fail(400, 'add the question number or a screenshot of the question.');
    }

    const maxOpen = await getMaxOpenVideoRequests();
    const openCount = await query(
      `SELECT COUNT(*)::int AS n FROM video_requests WHERE student_id = $1 AND status = ANY($2::text[])`,
      [user.id, OPEN_STATUSES]
    );
    if (openCount.rows[0].n >= maxOpen) {
      return await rejectAndClean(
        429,
        `you already have ${maxOpen} open video requests. Wait for one to be answered before sending another.`,
        screenshotPath
      );
    }

    const id = await createVideoRequest(user, {
      id: requestId,
      description,
      topicId,
      chapterId: optionalUuid(body.chapterId),
      questionNumber,
      questionId,
      screenshotPath,
    });
    return NextResponse.json({ ok: true, success: true, id });
  } catch (err) {
    console.error('POST /api/video-requests failed', err);
    return await rejectAndClean(500, 'the server could not store it right now. Please try again in a minute.', screenshotPath);
  }
}

/** Fails the request and removes its already-uploaded screenshot (best effort). */
async function rejectAndClean(status: number, error: string, screenshotPath: string | null) {
  if (screenshotPath) {
    const removed = await deleteStorageObject(SCREENSHOT_BUCKET, screenshotPath);
    if (!removed) console.error('POST /api/video-requests: could not remove orphaned screenshot');
  }
  return fail(status, error);
}
