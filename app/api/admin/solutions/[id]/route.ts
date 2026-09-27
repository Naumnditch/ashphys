/** DELETE /api/admin/solutions/[id] */

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/messaging/http';
import { query } from '@/lib/db/client';

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ success: false, error: 'Not authorized' }, { status: 403 });
  await query(`DELETE FROM solutions WHERE id = $1`, [params.id]);
  return NextResponse.json({ success: true });
}
