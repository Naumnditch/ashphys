import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/client';

const ALLOWED = ['bank_transfer_enabled', 'bank_account_name', 'bank_iban', 'bank_name', 'bank_note'];

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
  }
  const body = await req.json();
  const entries = Object.entries(body).filter(([k]) => ALLOWED.includes(k));
  if (entries.length === 0) {
    return NextResponse.json({ success: false, error: 'No valid settings supplied' }, { status: 400 });
  }
  for (const [k, v] of entries) {
    await query(
      `INSERT INTO site_settings (key, value, updated_at) VALUES ($1, $2, now())
       ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
      [k, String(v ?? '')]
    );
  }
  return NextResponse.json({ success: true });
}
