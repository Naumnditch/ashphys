/**
 * GET /api/search?q=...
 * Searches chapters, topics, and simulations for a matching title/name.
 * Returns a small, unified list of results with type + link.
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/client';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() || '';

  if (q.length < 2) {
    return NextResponse.json({ success: true, data: [] });
  }

  const like = `%${q.toLowerCase()}%`;

  try {
    const [chapters, topics, simulations] = await Promise.all([
      query(
        `SELECT id, chapter_number, title
         FROM chapters
         WHERE status = 'published' AND LOWER(title) LIKE $1
         ORDER BY chapter_number ASC
         LIMIT 5`,
        [like]
      ),
      query(
        `SELECT t.id, t.topic_name, t.chapter_id, c.chapter_number, c.title as chapter_title
         FROM topics t
         JOIN chapters c ON c.id = t.chapter_id
         WHERE LOWER(t.topic_name) LIKE $1
         ORDER BY c.chapter_number ASC
         LIMIT 6`,
        [like]
      ),
      query(
        `SELECT s.id, s.title, s.url_path, s.description, c.chapter_number
         FROM simulations s
         JOIN chapters c ON c.id = s.chapter_id
         WHERE LOWER(s.title) LIKE $1 OR LOWER(s.description) LIKE $1
         ORDER BY c.chapter_number ASC
         LIMIT 5`,
        [like]
      ),
    ]);

    const results = [
      ...chapters.rows.map((c) => ({
        type: 'chapter' as const,
        id: c.id,
        title: `Chapter ${c.chapter_number}: ${c.title}`,
        href: `/curriculum/${c.id}`,
      })),
      ...topics.rows.map((t) => ({
        type: 'lesson' as const,
        id: t.id,
        title: t.topic_name,
        subtitle: `Chapter ${t.chapter_number} · ${t.chapter_title}`,
        href: `/curriculum/${t.chapter_id}#topic-${t.id}`,
      })),
      ...simulations.rows.map((s) => ({
        type: 'simulation' as const,
        id: s.id,
        title: s.title,
        subtitle: `Chapter ${s.chapter_number} · Simulation`,
        href: s.url_path,
      })),
    ];

    return NextResponse.json({ success: true, data: results });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ success: false, error: 'Search failed' }, { status: 500 });
  }
}
