/**
 * GET    /api/admin/lesson-videos — every lesson video + the lesson picker
 * POST   /api/admin/lesson-videos — attach a video: { url, lessonId, title, description?, sortOrder?, isPublished? }
 * PATCH  /api/admin/lesson-videos — { id, title?, description?, sortOrder?, isPublished? }
 * DELETE /api/admin/lesson-videos?id=…
 *
 * Admin-only here AND in the database: every write runs under row-level
 * security, where only an admin passes the lesson_videos write policies.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { withRlsContext } from '@/lib/db/rls';
import { parseYouTubeId } from '@/lib/youtube/videoId';
import { listAllLessonVideos, nextSortOrder, upsertLessonVideo } from '@/lib/videos/lessonVideos';
import { getLessonPickerGroups } from '@/lib/videos/lessonPicker';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function requireAdmin() {
  const user = await getCurrentUser();
  return user && user.role === 'admin' ? user : null;
}

const forbidden = () => NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
const bad = (error: string) => NextResponse.json({ success: false, error }, { status: 400 });

function parseSortOrder(value: unknown): number | null | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const n = Number(value);
  return Number.isInteger(n) && n >= 0 && n <= 10000 ? n : null;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return forbidden();
  const [videos, lessons] = await Promise.all([listAllLessonVideos(admin), getLessonPickerGroups()]);
  return NextResponse.json({ success: true, videos, lessons });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return forbidden();

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const parsed = parseYouTubeId(body.url);
  if (!parsed.ok) return bad(parsed.error);
  if (typeof body.lessonId !== 'string' || !UUID.test(body.lessonId)) return bad('Choose a lesson.');
  const title = typeof body.title === 'string' ? body.title.trim() : '';
  if (!title) return bad('Give the video a title.');
  if (title.length > 200) return bad('Keep the title under 200 characters.');
  const sortOrder = parseSortOrder(body.sortOrder);
  if (sortOrder === null) return bad('Order must be a whole number from 0 upwards.');
  const lessonId = body.lessonId;

  try {
    const video = await withRlsContext(admin, async (db) => {
      const exists = await db.query(`SELECT 1 FROM topics WHERE id = $1`, [lessonId]);
      if (exists.rowCount === 0) return null;
      return upsertLessonVideo(db, {
        lessonId,
        youtubeId: parsed.id,
        title,
        description: typeof body.description === 'string' ? body.description : null,
        sortOrder: sortOrder ?? (await nextSortOrder(db, lessonId)),
        isPublished: body.isPublished === true,
      });
    });
    if (!video) return bad('That lesson no longer exists.');
    return NextResponse.json({ success: true, video });
  } catch (err) {
    console.error('lesson video create failed', err);
    return NextResponse.json({ success: false, error: 'Could not save the video.' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return forbidden();

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (typeof body.id !== 'string' || !UUID.test(body.id)) return bad('id is required');

  const sets: string[] = [];
  const params: unknown[] = [body.id];
  if (body.title !== undefined) {
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!title || title.length > 200) return bad('Give the video a title (under 200 characters).');
    params.push(title);
    sets.push(`title = $${params.length}`);
  }
  if (body.description !== undefined) {
    params.push(typeof body.description === 'string' && body.description.trim() ? body.description.trim() : null);
    sets.push(`description = $${params.length}`);
  }
  if (body.sortOrder !== undefined) {
    const sortOrder = parseSortOrder(body.sortOrder);
    if (sortOrder === null || sortOrder === undefined) return bad('Order must be a whole number from 0 upwards.');
    params.push(sortOrder);
    sets.push(`sort_order = $${params.length}`);
  }
  if (body.isPublished !== undefined) {
    if (typeof body.isPublished !== 'boolean') return bad('isPublished must be true or false');
    params.push(body.isPublished);
    sets.push(`is_published = $${params.length}`);
  }
  if (sets.length === 0) return bad('Nothing to update');

  const updated = await withRlsContext(admin, (db) =>
    db.query(`UPDATE lesson_videos SET ${sets.join(', ')}, updated_at = now() WHERE id = $1`, params)
  );
  if (updated.rowCount === 0) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return forbidden();
  const id = req.nextUrl.searchParams.get('id');
  if (!id || !UUID.test(id)) return bad('id is required');
  const deleted = await withRlsContext(admin, (db) => db.query(`DELETE FROM lesson_videos WHERE id = $1`, [id]));
  if (deleted.rowCount === 0) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
