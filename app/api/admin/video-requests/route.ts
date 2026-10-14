/**
 * GET   /api/admin/video-requests — every student's requests, newest first,
 *       plus the lesson picker for "add to a lesson"
 * PATCH /api/admin/video-requests — update status / YouTube link / note, and
 *       optionally attach the video to a lesson the admin picks
 *
 * A fulfilled request's video only reaches a lesson page when the admin
 * chooses a lesson here (attachLessonId). Nothing is published to a lesson
 * automatically. The request update and the lesson video are written in
 * one transaction under row-level security (admin-only write policies).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/client';
import { withRlsContext } from '@/lib/db/rls';
import { signedFileUrl } from '@/lib/storage/signed';
import { parseYouTubeId } from '@/lib/youtube/videoId';
import { nextSortOrder, upsertLessonVideo } from '@/lib/videos/lessonVideos';
import { getLessonPickerGroups } from '@/lib/videos/lessonPicker';

const STATUSES = ['open', 'in_progress', 'fulfilled', 'declined'];
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET() {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
  }

  const [result, lessons] = await Promise.all([
    query(
      `SELECT r.id, r.description, r.question_number, r.screenshot_path, r.status, r.youtube_url, r.admin_note,
              r.created_at, r.topic_id,
              u.first_name, u.last_name, u.email,
              t.topic_name, c.chapter_number, c.title AS chapter_title,
              COALESCE((
                SELECT json_agg(json_build_object('id', v.id, 'lessonId', v.lesson_id, 'lessonName', vt.topic_name,
                                                  'isPublished', v.is_published) ORDER BY v.created_at)
                FROM lesson_videos v JOIN topics vt ON vt.id = v.lesson_id
                WHERE v.source_request_id = r.id
              ), '[]'::json) AS lesson_videos
       FROM video_requests r
       JOIN users u ON u.id = r.student_id
       LEFT JOIN topics t ON t.id = r.topic_id
       LEFT JOIN chapters c ON c.id = r.chapter_id
       ORDER BY (r.status = 'open') DESC, r.created_at DESC`
    ),
    getLessonPickerGroups(),
  ]);

  const requests = await Promise.all(
    result.rows.map(async (r) => ({
      id: r.id,
      description: r.description,
      questionNumber: r.question_number,
      status: r.status,
      youtubeUrl: r.youtube_url,
      adminNote: r.admin_note,
      createdAt: r.created_at,
      studentName: [r.first_name, r.last_name].filter(Boolean).join(' '),
      studentEmail: r.email,
      topicId: r.topic_id,
      topicName: r.topic_name,
      chapterNumber: r.chapter_number,
      chapterTitle: r.chapter_title,
      lessonVideos: r.lesson_videos,
      screenshotUrl: r.screenshot_path ? await signedFileUrl('video-request-screenshots', r.screenshot_path) : null,
    }))
  );

  return NextResponse.json({ success: true, requests, lessons });
}

export async function PATCH(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
  }

  const body = (await req.json().catch(() => ({}))) as {
    id?: string;
    status?: string;
    youtubeUrl?: string;
    adminNote?: string;
    attachLessonId?: string;
    lessonVideoTitle?: string;
    publishOnLesson?: boolean;
  };
  const { id, status, adminNote } = body;
  if (!id || !UUID.test(id) || !status || !STATUSES.includes(status)) {
    return NextResponse.json({ success: false, error: 'id and a valid status are required' }, { status: 400 });
  }

  let youtubeId: string | null = null;
  if (body.youtubeUrl && body.youtubeUrl.trim()) {
    const parsed = parseYouTubeId(body.youtubeUrl);
    if (!parsed.ok) return NextResponse.json({ success: false, error: parsed.error }, { status: 400 });
    youtubeId = parsed.id;
  }

  const attachLessonId = body.attachLessonId || null;
  if (attachLessonId) {
    if (!UUID.test(attachLessonId)) {
      return NextResponse.json({ success: false, error: 'Choose a valid lesson' }, { status: 400 });
    }
    if (status !== 'fulfilled' || !youtubeId) {
      return NextResponse.json(
        { success: false, error: 'Only a fulfilled request with a YouTube link can be added to a lesson.' },
        { status: 400 }
      );
    }
    if (!body.lessonVideoTitle || !body.lessonVideoTitle.trim()) {
      return NextResponse.json({ success: false, error: 'Give the lesson video a title.' }, { status: 400 });
    }
  }

  // Stored normalised, so every later read parses the same canonical form.
  const youtubeUrl = youtubeId ? `https://youtu.be/${youtubeId}` : null;

  const lessonVideo = await withRlsContext(admin, async (db) => {
    const updated = await db.query(
      `UPDATE video_requests SET status = $2, youtube_url = $3, admin_note = $4, updated_at = now() WHERE id = $1`,
      [id, status, youtubeUrl, adminNote?.trim() || null]
    );
    if (updated.rowCount === 0) return undefined;
    if (!attachLessonId || !youtubeId) return null;
    return upsertLessonVideo(db, {
      lessonId: attachLessonId,
      youtubeId,
      title: body.lessonVideoTitle!.trim().slice(0, 200),
      sortOrder: await nextSortOrder(db, attachLessonId),
      isPublished: body.publishOnLesson === true,
      sourceRequestId: id,
    }, 'link');
  });

  if (lessonVideo === undefined) {
    return NextResponse.json({ success: false, error: 'Request not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, youtubeUrl, lessonVideo });
}
