/** GET /api/tutoring/bookings — the signed-in student's own tutoring bookings, newest first. */

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 401 });
  const res = await query(
    `SELECT p.id, p.status, p.price_paid_try, p.scheduled_at, p.admin_note, p.created_at, a.name AS addon_name
     FROM addon_purchases p
     JOIN addon_services a ON a.id = p.addon_id
     WHERE p.student_id = $1
     ORDER BY p.created_at DESC`,
    [user.id]
  );
  return NextResponse.json({
    success: true,
    bookings: res.rows.map((r) => ({
      id: r.id,
      status: r.status,
      price: Number(r.price_paid_try),
      scheduledAt: r.scheduled_at,
      adminNote: r.admin_note,
      createdAt: r.created_at,
      name: r.addon_name,
    })),
  });
}
