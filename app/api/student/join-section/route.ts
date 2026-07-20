/**
 * POST /api/student/join-section
 * Body: { joinCode: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/client';

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Please log in first' }, { status: 401 });
  }
  if (user.role !== 'student') {
    return NextResponse.json({ success: false, error: 'Only student accounts can join a class' }, { status: 403 });
  }

  const { joinCode } = await req.json();
  if (!joinCode || String(joinCode).trim().length === 0) {
    return NextResponse.json({ success: false, error: 'Enter a join code' }, { status: 400 });
  }

  const cleanCode = String(joinCode).trim().toUpperCase();

  const section = await query(
    `SELECT s.id, s.name, u.first_name as teacher_first_name, u.last_name as teacher_last_name
     FROM sections s
     JOIN users u ON u.id = s.teacher_id
     WHERE s.join_code = $1`,
    [cleanCode]
  );

  if (section.rows.length === 0) {
    return NextResponse.json({ success: false, error: "That code doesn't match any class" }, { status: 404 });
  }

  const sectionRow = section.rows[0];

  await query(`UPDATE users SET section_id = $1 WHERE id = $2`, [sectionRow.id, user.id]);

  return NextResponse.json({
    success: true,
    data: {
      sectionName: sectionRow.name,
      teacherName: `${sectionRow.teacher_first_name} ${sectionRow.teacher_last_name}`,
    },
  });
}
