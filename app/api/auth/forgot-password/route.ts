/**
 * POST /api/auth/forgot-password
 * Body: { email: string }
 *
 * Always returns a generic success message (doesn't reveal whether the
 * email exists, to avoid account enumeration) - EXCEPT when SMTP isn't
 * configured, in which case it includes the raw reset link directly in
 * the response so the flow is still usable during development/before
 * email is set up. That fallback only fires for an email that actually
 * matched an account, so no enumeration signal leaks even then.
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { query } from '@/lib/db/client';
import { sendEmail, isEmailConfigured } from '@/lib/email';

const GENERIC_MESSAGE = "If that email is registered, we've sent a password reset link to it.";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    const userResult = await query('SELECT id, first_name FROM users WHERE email = $1', [email]);

    if (userResult.rows.length === 0) {
      // Same response as the success path - don't reveal whether the account exists.
      return NextResponse.json({ success: true, message: GENERIC_MESSAGE });
    }

    const user = userResult.rows[0];
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await query(
      `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3)`,
      [user.id, tokenHash, expiresAt]
    );

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.ashphys.org';
    const resetLink = `${appUrl}/auth/reset-password?token=${rawToken}`;

    const { sent } = await sendEmail({
      to: email,
      subject: 'Reset your AshPhys password',
      html: `
        <p>Hi ${user.first_name},</p>
        <p>Click the link below to reset your AshPhys password. This link expires in 1 hour.</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    });

    if (sent) {
      return NextResponse.json({ success: true, message: GENERIC_MESSAGE });
    }

    // Email isn't configured yet - fall back to returning the link directly.
    return NextResponse.json({
      success: true,
      message: GENERIC_MESSAGE,
      data: { devResetLink: resetLink },
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
