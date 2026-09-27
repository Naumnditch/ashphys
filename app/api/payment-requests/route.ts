/**
 * POST /api/payment-requests — a signed-in student submits proof of payment.
 * multipart/form-data: file, planId, months, amount, reference, note
 *
 * The receipt is scanned automatically: if the amount it reads confidently
 * matches one of the paid plans' prices, the student's tier is opened
 * immediately and the request is filed as auto-approved. Anything the
 * scanner can't read confidently — a blurry photo, an amount that doesn't
 * land near any plan price, scanning not configured — falls back to the
 * admin review queue exactly as before, with the scan result attached so
 * the admin isn't starting from nothing.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/client';
import { analyzeReceipt } from '@/lib/receipts/analyze';
import { matchPlanForAmount, type PlanRow } from '@/lib/receipts/match-plan';
import { grantSubscription } from '@/lib/access/grant';

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
  const courseId = String(form.get('courseId') || '');
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

  const inserted = await query(
    `INSERT INTO payment_requests (student_id, plan_id, course_id, months, amount_claimed, reference, student_note, receipt_path)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
    [user.id, planId || null, courseId || null, Number.isFinite(months) ? months : 1, amount, reference, note, path]
  );
  const requestId = inserted.rows[0].id;

  // Course purchases are one-time enrollments priced outside subscription_plans,
  // so there is nothing for the amount scanner to match against — those always
  // go to manual review, same as before this feature.
  if (courseId) {
    return NextResponse.json({ success: true, autoApproved: false });
  }

  const scan = await analyzeReceipt(bytes, file.type);

  let match: ReturnType<typeof matchPlanForAmount> = null;
  if (scan.amount !== null && scan.confidence !== 'low') {
    const plansRes = await query(
      `SELECT id, name, tier_level, price_monthly, price_quarterly, price_yearly
       FROM subscription_plans WHERE is_active`
    );
    match = matchPlanForAmount(scan.amount, scan.currency, plansRes.rows as PlanRow[]);
  }

  if (match) {
    await grantSubscription({
      studentId: user.id,
      planId: match.planId,
      months: match.months,
      reference: reference || `receipt:auto:${requestId}`,
      grantedBy: null,
    });
    await query(
      `UPDATE payment_requests SET
         status = 'approved', auto_approved = true, reviewed_at = now(),
         plan_id = $2, months = $3,
         detected_amount = $4, detected_currency = $5, detected_plan_id = $6, detected_months = $7,
         detection_confidence = $8, detection_note = $9,
         admin_note = $10
       WHERE id = $1`,
      [
        requestId, match.planId, match.months,
        scan.amount, scan.currency, match.planId, match.months,
        scan.confidence, scan.note,
        `Auto-approved: receipt read as ${scan.amount} ${scan.currency ?? 'TRY'}, matched ${match.planName} (${match.billingCycle}).`,
      ]
    );
    return NextResponse.json({
      success: true,
      autoApproved: true,
      plan: match.planName,
      months: match.months,
    });
  }

  // No confident match — record whatever the scanner found (if anything) and
  // leave the request pending for a human to review, same flow as before.
  await query(
    `UPDATE payment_requests SET
       detected_amount = $2, detected_currency = $3, detection_confidence = $4, detection_note = $5
     WHERE id = $1`,
    [requestId, scan.amount, scan.currency, scan.confidence, scan.note]
  );

  return NextResponse.json({ success: true, autoApproved: false });
}

/** GET — the signed-in student's own request history. */
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, error: 'Not signed in' }, { status: 401 });
  const res = await query(
    `SELECT r.id, r.months, r.amount_claimed, r.reference, r.status, r.admin_note, r.created_at, r.auto_approved,
            p.name AS plan_name, c.title AS course_title
     FROM payment_requests r
     LEFT JOIN subscription_plans p ON p.id = r.plan_id
     LEFT JOIN courses c ON c.id = r.course_id
     WHERE r.student_id = $1 ORDER BY r.created_at DESC`,
    [user.id]
  );
  return NextResponse.json({ success: true, requests: res.rows });
}
