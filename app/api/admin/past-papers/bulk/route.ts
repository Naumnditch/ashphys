/**
 * POST /api/admin/past-papers/bulk
 *
 * Accepts many PDFs at once and files each one against the right paper row by
 * reading its Cambridge filename — e.g. 0625_s23_qp_42.pdf is the May/June
 * 2023 question paper for Paper 4 Variant 2.
 *
 * Anything that doesn't match the pattern (examiner reports, grade thresholds,
 * random names) is skipped and reported back rather than guessed at, so a
 * mis-named file never silently lands on the wrong paper.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/client';
import { parseCambridgeName } from '@/lib/papers/filename';

const MAX_BYTES = 20 * 1024 * 1024;

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ success: false, error: 'Storage is not configured' }, { status: 500 });
  }

  const form = await req.formData();
  const files = form.getAll('files') as File[];
  if (!files.length) return NextResponse.json({ success: false, error: 'No files supplied' }, { status: 400 });

  const matched: string[] = [];
  const skipped: { name: string; reason: string }[] = [];

  for (const file of files) {
    const parsed = parseCambridgeName(file.name);
    if (!parsed) {
      skipped.push({ name: file.name, reason: 'filename not in Cambridge format' });
      continue;
    }
    if (file.type !== 'application/pdf') {
      skipped.push({ name: file.name, reason: 'not a PDF' });
      continue;
    }
    if (file.size > MAX_BYTES) {
      skipped.push({ name: file.name, reason: 'over 20 MB' });
      continue;
    }

    const rowRes = await query(
      `SELECT id FROM past_papers
       WHERE syllabus_code = $1 AND year = $2 AND session = $3 AND paper_number = $4 AND variant = $5`,
      [parsed.syllabus, parsed.year, parsed.session, parsed.paperNumber, parsed.variant]
    );
    if (rowRes.rows.length === 0) {
      skipped.push({ name: file.name, reason: `no ${parsed.session} ${parsed.year} P${parsed.paperNumber}V${parsed.variant} slot exists` });
      continue;
    }
    const paperId = rowRes.rows[0].id;

    const path = `${parsed.syllabus}/${parsed.year}-${parsed.session.replace('/', '-')}/${file.name.toLowerCase()}`;
    const bytes = await file.arrayBuffer();
    const up = await fetch(`${supabaseUrl}/storage/v1/object/past-papers/${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
        'Content-Type': 'application/pdf',
        'x-upsert': 'true',
      },
      body: bytes,
    });
    if (!up.ok) {
      skipped.push({ name: file.name, reason: 'upload to storage failed' });
      continue;
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/past-papers/${path}`;
    const column = parsed.type === 'qp' ? 'question_paper_url' : 'mark_scheme_url';
    await query(`UPDATE past_papers SET ${column} = $2, updated_at = now() WHERE id = $1`, [paperId, publicUrl]);
    matched.push(`${parsed.session} ${parsed.year} P${parsed.paperNumber}V${parsed.variant} ${parsed.type.toUpperCase()}`);
  }

  return NextResponse.json({ success: true, matchedCount: matched.length, matched, skipped });
}
