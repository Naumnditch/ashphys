/**
 * GET  /api/admin/solutions — every solution (published or not), for the admin manager.
 * POST /api/admin/solutions — create or update one (id present = update).
 */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/messaging/http';
import { query } from '@/lib/db/client';

const DIFFICULTIES = new Set(['basic', 'intermediate', 'advanced']);
const KINDS = new Set(['interactive', 'static']);
const TIERS = new Set(['free', 'plus', 'pro']);

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });

  const result = await query(
    `SELECT s.*, c.title AS chapter_title
     FROM solutions s
     LEFT JOIN chapters c ON c.chapter_number = s.chapter
     ORDER BY s.chapter ASC, s.created_at DESC`
  );
  return NextResponse.json({ success: true, solutions: result.rows });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });

  const body = await req.json();
  const {
    id,
    chapter,
    topic,
    problem_title: problemTitle,
    problem_number: problemNumber,
    difficulty,
    interactive_html: interactiveHtml,
    interactive_html_url: interactiveHtmlUrl,
    static_preview: staticPreview,
    description,
    tags,
    solution_type: solutionType,
    is_published: isPublished,
    tier_required: tierRequired,
  } = body;

  if (!chapter || !topic || !problemTitle || !staticPreview) {
    return NextResponse.json({ success: false, error: 'chapter, topic, problem_title, and static_preview are required' }, { status: 400 });
  }
  const diff = DIFFICULTIES.has(difficulty) ? difficulty : 'intermediate';
  const kind = KINDS.has(solutionType) ? solutionType : 'interactive';
  const tier = TIERS.has(tierRequired) ? tierRequired : 'free';
  const tagList = Array.isArray(tags) ? tags.filter((t: unknown) => typeof t === 'string' && t.trim()) : [];

  if (id) {
    const result = await query(
      `UPDATE solutions SET chapter = $2, topic = $3, problem_title = $4, problem_number = $5, difficulty = $6,
         interactive_html = $7, interactive_html_url = $8, static_preview = $9, description = $10, tags = $11,
         solution_type = $12, is_published = $13, tier_required = $14, updated_at = now()
       WHERE id = $1 RETURNING *`,
      [
        id,
        chapter,
        topic,
        problemTitle,
        problemNumber || null,
        diff,
        interactiveHtml || null,
        interactiveHtmlUrl || null,
        staticPreview,
        description || null,
        tagList,
        kind,
        Boolean(isPublished),
        tier,
      ]
    );
    if (!result.rows[0]) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, solution: result.rows[0] });
  }

  const result = await query(
    `INSERT INTO solutions
       (chapter, topic, problem_title, problem_number, difficulty, interactive_html, interactive_html_url,
        static_preview, description, tags, solution_type, is_published, tier_required, created_by)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
    [
      chapter,
      topic,
      problemTitle,
      problemNumber || null,
      diff,
      interactiveHtml || null,
      interactiveHtmlUrl || null,
      staticPreview,
      description || null,
      tagList,
      kind,
      Boolean(isPublished),
      tier,
      admin.id,
    ]
  );
  return NextResponse.json({ success: true, solution: result.rows[0] });
}
