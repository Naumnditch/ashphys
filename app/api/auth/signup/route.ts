/**
 * POST /api/auth/signup
 * User registration endpoint. Supports both student and teacher
 * signup. Teachers start with status='inactive' (pending admin
 * approval) rather than immediately gaining teacher access.
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/client';
import { hashPassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { ApiResponse } from '@/types';

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const body = await req.json();
    const {
      email,
      password,
      firstName,
      lastName,
      accountType,
      schoolName,
      applicationMessage,
    }: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      accountType?: 'student' | 'teacher';
      schoolName?: string;
      applicationMessage?: string;
    } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const isTeacher = accountType === 'teacher';

    if (isTeacher && (!schoolName || schoolName.trim().length < 2)) {
      return NextResponse.json(
        { success: false, error: 'Please tell us where you currently teach' },
        { status: 400 }
      );
    }

    const existing = await query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    const result = await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, role, status, school_name, application_message)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, email, first_name, last_name, role, status, section_id`,
      [
        email,
        passwordHash,
        firstName,
        lastName,
        isTeacher ? 'teacher' : 'student',
        isTeacher ? 'inactive' : 'active',
        isTeacher ? schoolName : null,
        isTeacher ? applicationMessage || null : null,
      ]
    );

    const user = result.rows[0];
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      sectionId: user.section_id,
    });

    const response = NextResponse.json(
      {
        success: true,
        data: {
          userId: user.id,
          email: user.email,
          token,
          role: user.role,
          status: user.status,
        },
        message: isTeacher ? 'Application submitted' : 'Registration successful',
      },
      { status: 201 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24h, matches JWT_EXPIRES_IN default
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
