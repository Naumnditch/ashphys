/**
 * POST /api/admin/teacher-applications/[userId]
 * Body: { action: 'approve' | 'reject' }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/client';

export async function POST(req: NextRequest, { params }: { params: { userId: string } }) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
  }

  const { action } = await req.json();
  if (action !== 'approve' && action !== 'reject') {
    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  }

  const target = await query(`SELECT id, role, status FROM users WHERE id = $1`, [params.userId]);
  if (target.rows.length === 0) {
    return NextResponse.json({ success: false, error: 'Application not found' }, { status: 404 });
  }
  if (target.rows[0].role !== 'teacher') {
    return NextResponse.json({ success: false, error: 'This user is not a teacher applicant' }, { status: 400 });
  }

  if (action === 'approve') {
    await query(`UPDATE users SET status = 'active' WHERE id = $1`, [params.userId]);
  } else {
    // reject: remove the application entirely rather than leaving a dangling suspended row
    await query(`DELETE FROM users WHERE id = $1 AND status = 'inactive'`, [params.userId]);
  }

  return NextResponse.json({ success: true });
}
