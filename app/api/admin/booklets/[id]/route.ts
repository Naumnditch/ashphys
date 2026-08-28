/**
 * DELETE /api/admin/booklets/[id]
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/client';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await getCurrentUser();
  if (!admin || admin.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
  }
  await query(`DELETE FROM booklets WHERE id = $1`, [params.id]);
  return NextResponse.json({ success: true });
}
