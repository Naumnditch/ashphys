/**
 * POST /api/auth/login
 * User login endpoint
 */

import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db/client';
import { verifyPassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { LoginRequest, ApiResponse } from '@/types';

export async function POST(req: NextRequest): Promise<NextResponse<ApiResponse<any>>> {
  try {
    const body: LoginRequest = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const result = await query(
      'SELECT id, email, password_hash, role, section_id, status, first_name FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    const user = result.rows[0];

    if (user.status === 'suspended') {
      return NextResponse.json(
        { success: false, error: 'This account has been suspended.' },
        { status: 403 }
      );
    }

    // Pending teachers (status='inactive') ARE allowed to log in so they can
    // see their application status page - only suspended accounts are blocked.

    const passwordValid = await verifyPassword(password, user.password_hash);
    if (!passwordValid) {
      return NextResponse.json({ success: false, error: 'Invalid email or password' }, { status: 401 });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
      sectionId: user.section_id,
    });

    const response = NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        token,
        role: user.role,
        status: user.status,
      },
      message: 'Login successful',
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
