import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/client';
import { signedReceiptUrl } from '@/lib/storage/signed';

export async function GET() {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
  }
  const res = await query(`
    SELECT r.id, r.months, r.amount_claimed, r.reference, r.student_note, r.status,
           r.admin_note, r.created_at, r.receipt_path,
           u.id AS student_id, u.email, u.first_name, u.last_name,
           p.id AS plan_id, p.name AS plan_name
    FROM payment_requests r
    JOIN users u ON u.id = r.student_id
    LEFT JOIN subscription_plans p ON p.id = r.plan_id
    ORDER BY (r.status = 'pending') DESC, r.created_at DESC
    LIMIT 100
  `);
  // sign each receipt for viewing; links are short-lived by design
  const requests = await Promise.all(
    res.rows.map(async (r: any) => ({ ...r, receiptUrl: await signedReceiptUrl(r.receipt_path) }))
  );
  return NextResponse.json({ success: true, requests });
}
