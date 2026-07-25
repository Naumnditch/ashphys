/**
 * POST /api/admin/past-papers/upload
 * multipart/form-data: file (PDF), path (storage object path, e.g. "2020-oct-nov/paper-4-v2-qp.pdf")
 * Uploads to the "past-papers" Supabase Storage bucket via the Storage REST API
 * (no supabase-js dependency — this project talks to Postgres directly via `pg`,
 * so we use the same "no extra SDK" approach for Storage).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';

const BUCKET = 'past-papers';
const MAX_BYTES = 20 * 1024 * 1024; // 20 MB, matches the bucket's own limit

export async function POST(req: NextRequest) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { success: false, error: 'Storage is not configured — SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing' },
      { status: 500 }
    );
  }

  const form = await req.formData();
  const file = form.get('file') as File | null;
  const path = form.get('path') as string | null;

  if (!file || !path) {
    return NextResponse.json({ success: false, error: 'file and path are required' }, { status: 400 });
  }
  if (file.type !== 'application/pdf') {
    return NextResponse.json({ success: false, error: 'Only PDF files are accepted' }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ success: false, error: 'File exceeds the 20 MB limit' }, { status: 400 });
  }
  // keep the object path predictable and safe
  const safePath = path.replace(/[^a-zA-Z0-9/_-]/g, '-').replace(/^\/+/, '');

  const bytes = await file.arrayBuffer();
  const uploadRes = await fetch(`${supabaseUrl}/storage/v1/object/${BUCKET}/${safePath}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      'Content-Type': 'application/pdf',
      'x-upsert': 'true',
    },
    body: bytes,
  });

  if (!uploadRes.ok) {
    const detail = await uploadRes.text();
    return NextResponse.json({ success: false, error: `Storage upload failed: ${detail}` }, { status: 502 });
  }

  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${safePath}`;
  return NextResponse.json({ success: true, url: publicUrl });
}
