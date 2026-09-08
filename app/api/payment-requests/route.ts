/**
 * POST /api/payment-requests — a signed-in student submits proof of payment.
 * multipart/form-data: file, planId, months, amount, reference, note
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/client';

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, error: 'Please sign in first' }, { status: 401 });

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json({ success: false, error: 'Uploads are not configured yet' }, { status: 500 });
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const planId = String(form.get('planId') || '');
  const months = parseInt(String(form.get('months') || '1'), 10);
  const amount = parseFloat(String(form.get('amount') || '')) || null;
  const reference = String(form.get('reference') || '').trim() || null;
  const note = String(form.get('note') || '').trim() || null;

  if (!file) return NextResponse.json({ success: false, error: 'Please attach your receipt' }, { status: 400 });
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ success: false, error: 'Receipt must be a JPG, PNG, WEBP or PDF' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ success: false, error: 'File must be under 10 MB' }, { status: 400 });
  }

  // one open request at a time keeps the review queue honest
  const openReq = await query(
    `SELECT id FROM payment_requests WHERE student_id = $1 AND status = 'pending'`,
    [user.id]
  );
  if (openReq.rows.length > 0) {
    return NextResponse.json(
      { success: false, error: 'You already have a receipt awaiting review. You will hear back shortly.' },
      { status: 409 }
    );
  }

  const ext = file.type === 'application/pdf' ? 'pdf' : file.type.split('/')[1];
  const path = `${user.id}/${Date.now()}.${ext}`;
  const bytes = await file.arrayBuffer();

  const up = await fetch(`${supabaseUrl}/storage/v1/object/receipts/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      'Content-Type': file.type,
      'x-upsert': 'true',
    },
    body: bytes,
  });
  if (!up.ok) {
    const detail = await up.text();
    return NextResponse.json({ success: false, error: `Upload failed: ${detail}` }, { status: 502 });
  }

  await query(
    `INSERT INTO payment_requests (student_id, plan_id, months, amount_claimed, reference, student_note, receipt_path)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [user.id, planId || null, Number.isFinite(months) ? months : 1, amount, reference, note, path]
  );

  return NextResponse.json({ success: true });
}

/** GET — the signed-in student's own request history. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, error: 'Not signed in' }, { status: 401 });
  const res = await query(
    `SELECT r.id, r.months, r.amount_claimed, r.reference, r.status, r.admin_note, r.created_at, p.name AS plan_name
     FROM payment_requests r LEFT JOIN subscription_plans p ON p.id = r.plan_id
     WHERE r.student_id = $1 ORDER BY r.created_at DESC`,
    [user.id]
  );
  return NextResponse.json({ success: true, requests: res.rows });
}
