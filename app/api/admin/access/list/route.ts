import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/client';

/**
 * Every student, whether or not they've ever had a subscription row —
 * so the dashboard can change tier for a brand-new Free-tier student too,
 * not only someone who's already paid once.
 */
export async function GET() {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
  }
  const res = await query(`
    SELECT u.id AS student_id, u.email, u.first_name, u.last_name,
           s.plan_id, p.name AS plan_name, p.tier_level,
           s.status::text AS status, s.end_date,
           FLOOR(EXTRACT(EPOCH FROM (s.end_date - now())) / 86400)::int AS days_left
    FROM users u
    LEFT JOIN subscriptions s ON s.student_id = u.id
    LEFT JOIN subscription_plans p ON p.id = s.plan_id
    WHERE u.role = 'student'
    ORDER BY (s.status = 'active') DESC, s.end_date DESC NULLS LAST, u.first_name NULLS LAST
  `);
  return NextResponse.json({ success: true, subs: res.rows });
}
