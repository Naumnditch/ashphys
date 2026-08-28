/**
 * GET  /api/admin/booklets   — list all entries, with chapter/topic titles joined in
 * POST /api/admin/booklets   — create or update one entry
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/client';

export async function GET() {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
  }
  const result = await query(`
    SELECT b.*, c.chapter_number, c.title as chapter_title, t.topic_name
    FROM booklets b
    JOIN chapters c ON b.chapter_id = c.id
    LEFT JOIN topics t ON b.topic_id = t.id
    ORDER BY c.chapter_number ASC, b."order" ASC
  `);
  return NextResponse.json({ success: true, booklets: result.rows });
}

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
  }

  const body = await req.json();
  const { id, chapter_id: chapterId, topic_id: topicId, title, description, file_url: fileUrl, file_size_bytes: fileSizeBytes, order } = body;

  if (!chapterId || !title) {
    return NextResponse.json({ success: false, error: 'chapter_id and title are required' }, { status: 400 });
  }

  if (id) {
    const result = await query(
      `UPDATE booklets SET chapter_id = $2, topic_id = $3, title = $4, description = $5,
         file_url = COALESCE($6, file_url), file_size_bytes = COALESCE($7, file_size_bytes),
         "order" = $8, updated_at = now()
       WHERE id = $1 RETURNING *`,
      [id, chapterId, topicId || null, title, description || null, fileUrl || null, fileSizeBytes || null, order || 0]
    );
    return NextResponse.json({ success: true, booklet: result.rows[0] });
  }

  const result = await query(
    `INSERT INTO booklets (chapter_id, topic_id, title, description, file_url, file_size_bytes, "order")
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [chapterId, topicId || null, title, description || null, fileUrl || null, fileSizeBytes || null, order || 0]
  );
  return NextResponse.json({ success: true, booklet: result.rows[0] });
}
