/**
 * POST /api/paper-scores — a signed-in student records their mark for a paper.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/client';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, error: 'Sign in to save your scores' }, { status: 401 });

  const { paperId, score } = await req.json();
  if (!paperId) return NextResponse.json({ success: false, error: 'paperId required' }, { status: 400 });

  // an empty value clears the entry rather than storing null noise
  if (score === null || score === '' || score === undefined) {
    await query(`DELETE FROM paper_scores WHERE student_id = $1 AND paper_id = $2`, [user.id, paperId]);
    return NextResponse.json({ success: true, cleared: true });
  }

  const n = Number(score);
  if (!Number.isFinite(n) || n < 0) {
    return NextResponse.json({ success: false, error: 'Score must be a positive number' }, { status: 400 });
  }

  const paper = await query(`SELECT max_marks FROM past_papers WHERE id = $1`, [paperId]);
  if (paper.rows.length === 0) return NextResponse.json({ success: false, error: 'Unknown paper' }, { status: 404 });
  const max = paper.rows[0].max_marks;
  if (max && n > max) {
    return NextResponse.json({ success: false, error: `That paper is out of ${max} marks` }, { status: 400 });
  }

  await query(
    `INSERT INTO paper_scores (student_id, paper_id, score, updated_at) VALUES ($1, $2, $3, now())
     ON CONFLICT (student_id, paper_id) DO UPDATE SET score = EXCLUDED.score, updated_at = now()`,
    [user.id, paperId, n]
  );
  return NextResponse.json({ success: true });
}
