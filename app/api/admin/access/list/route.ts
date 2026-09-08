import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/client';

export async function GET() {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
  }
  const res = await query(`
    SELECT s.student_id, u.email, u.first_name, u.last_name, p.name AS plan_name,
           s.status::text AS status, s.end_date,
           FLOOR(EXTRACT(EPOCH FROM (s.end_date - now())) / 86400)::int AS days_left
    FROM subscriptions s
    JOIN users u ON u.id = s.student_id
    LEFT JOIN subscription_plans p ON p.id = s.plan_id
    ORDER BY s.end_date DESC NULLS LAST
  `);
  return NextResponse.json({ success: true, subs: res.rows });
}
