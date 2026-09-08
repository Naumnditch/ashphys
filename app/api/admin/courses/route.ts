import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/client';

const slugify = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export async function GET() {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
  const courses = await query(`
    SELECT c.*, (SELECT COUNT(*) FROM course_modules m WHERE m.course_id = c.id)::int AS module_count,
           (SELECT COUNT(*) FROM course_enrollments e WHERE e.course_id = c.id)::int AS enrolled_count
    FROM courses c ORDER BY c."order", c.created_at
  `);
  const modules = await query(`SELECT * FROM course_modules ORDER BY course_id, "order", created_at`);
  return NextResponse.json({ success: true, courses: courses.rows, modules: modules.rows });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
  const b = await req.json();

  if (b.kind === 'course') {
    const slug = slugify(b.slug || b.title || '');
    if (!b.title || !slug) return NextResponse.json({ success: false, error: 'Title is required' }, { status: 400 });
    if (b.id) {
      await query(
        `UPDATE courses SET title=$2, slug=$3, category=$4, summary=$5, description=$6, level=$7,
           price_try=$8, status=$9, "order"=$10, updated_at=now() WHERE id=$1`,
        [b.id, b.title, slug, b.category || 'Engineering', b.summary || null, b.description || null,
         b.level || 'Beginner', b.price_try || 0, b.status || 'draft', b.order || 0]
      );
      return NextResponse.json({ success: true, id: b.id });
    }
    const dupe = await query(`SELECT id FROM courses WHERE slug = $1`, [slug]);
    if (dupe.rows.length > 0) {
      return NextResponse.json({ success: false, error: `A course with the address "${slug}" already exists` }, { status: 409 });
    }
    const res = await query(
      `INSERT INTO courses (title, slug, category, summary, description, level, price_try, status, "order")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id`,
      [b.title, slug, b.category || 'Engineering', b.summary || null, b.description || null,
       b.level || 'Beginner', b.price_try || 0, b.status || 'draft', b.order || 0]
    );
    return NextResponse.json({ success: true, id: res.rows[0].id });
  }

  if (b.kind === 'module') {
    if (!b.course_id || !b.title) return NextResponse.json({ success: false, error: 'Course and title required' }, { status: 400 });
    if (b.id) {
      await query(
        `UPDATE course_modules SET title=$2, description=$3, video_url=$4, resource_url=$5,
           duration_minutes=$6, is_free_preview=$7, "order"=$8 WHERE id=$1`,
        [b.id, b.title, b.description || null, b.video_url || null, b.resource_url || null,
         b.duration_minutes || null, !!b.is_free_preview, b.order || 0]
      );
      return NextResponse.json({ success: true, id: b.id });
    }
    const res = await query(
      `INSERT INTO course_modules (course_id, title, description, video_url, resource_url, duration_minutes, is_free_preview, "order")
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING id`,
      [b.course_id, b.title, b.description || null, b.video_url || null, b.resource_url || null,
       b.duration_minutes || null, !!b.is_free_preview, b.order || 0]
    );
    return NextResponse.json({ success: true, id: res.rows[0].id });
  }

  return NextResponse.json({ success: false, error: 'Unknown kind' }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
  const { kind, id } = await req.json();
  if (kind === 'module') await query(`DELETE FROM course_modules WHERE id = $1`, [id]);
  else if (kind === 'course') await query(`DELETE FROM courses WHERE id = $1`, [id]);
  else return NextResponse.json({ success: false, error: 'Unknown kind' }, { status: 400 });
  return NextResponse.json({ success: true });
}
