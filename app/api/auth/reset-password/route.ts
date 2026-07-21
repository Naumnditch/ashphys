/**
 * POST /api/auth/reset-password
 * Body: { token: string, newPassword: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { query } from '@/lib/db/client';
import { hashPassword } from '@/lib/auth/password';

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ success: false, error: 'Missing token or new password' }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const result = await query(
      `SELECT id, user_id, expires_at, used FROM password_reset_tokens WHERE token_hash = $1`,
      [tokenHash]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, error: 'This reset link is invalid.' }, { status: 400 });
    }

    const record = result.rows[0];

    if (record.used) {
      return NextResponse.json(
        { success: false, error: 'This reset link has already been used.' },
        { status: 400 }
      );
    }
    if (new Date(record.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, error: 'This reset link has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(newPassword);

    await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [
      passwordHash,
      record.user_id,
    ]);
    await query('UPDATE password_reset_tokens SET used = TRUE WHERE id = $1', [record.id]);

    return NextResponse.json({ success: true, message: 'Password updated. You can now log in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
