/**
 * GET  /api/teacher/sections  - list the current teacher's sections
 * POST /api/teacher/sections  - create a new section (generates a join code)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/client';

const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; // no 0/O/1/I/L, avoids ambiguity

async function generateJoinCode(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }
    const existing = await query('SELECT id FROM sections WHERE join_code = $1', [code]);
    if (existing.rows.length === 0) return code;
  }
  throw new Error('Could not generate a unique join code');
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'teacher' || user.status !== 'active') {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
  }

  const result = await query(
    `SELECT s.id, s.name, s.join_code, s.capacity, s.created_at,
            (SELECT COUNT(*) FROM users u WHERE u.section_id = s.id) as student_count
     FROM sections s
     WHERE s.teacher_id = $1
     ORDER BY s.created_at DESC`,
    [user.id]
  );

  return NextResponse.json({ success: true, data: result.rows });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'teacher' || user.status !== 'active') {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
  }

  const { name } = await req.json();
  if (!name || String(name).trim().length < 2) {
    return NextResponse.json({ success: false, error: 'Please give the section a name' }, { status: 400 });
  }

  const joinCode = await generateJoinCode();

  const result = await query(
    `INSERT INTO sections (name, teacher_id, join_code, capacity)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, join_code, capacity, created_at`,
    [String(name).trim(), user.id, joinCode, 40]
  );

  return NextResponse.json({ success: true, data: result.rows[0] }, { status: 201 });
}
