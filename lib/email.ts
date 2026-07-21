/**
 * Email sending helper.
 *
 * Reads SMTP settings from env vars. If they aren't configured, sendEmail
 * returns { sent: false } instead of throwing - callers use this to fall
 * back to displaying the content directly (e.g. showing a password reset
 * link on-screen) rather than pretending an email went out when it didn't.
 */

import nodemailer from 'nodemailer';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export async function sendEmail({ to, subject, html }: SendEmailParams): Promise<{ sent: boolean }> {
  if (!isEmailConfigured()) {
    console.warn('sendEmail: SMTP not configured, skipping send to', to);
    return { sent: false };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to,
      subject,
      html,
    });

    return { sent: true };
  } catch (err) {
    console.error('sendEmail: failed to send', err);
    return { sent: false };
  }
}
