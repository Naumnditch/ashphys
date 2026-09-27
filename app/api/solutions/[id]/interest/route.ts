/** POST /api/solutions/[id]/interest — logs that a blocked viewer clicked through to upgrade. */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { fail, UUID_RE } from '@/lib/messaging/http';
import { logAccess } from '@/lib/solutions/access';

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  if (!UUID_RE.test(params.id)) return fail('Not found', 404);
  const user = await getCurrentUser();
  if (!user) return fail('Please sign in', 401);
  await logAccess(user.id, params.id, 'attempted_upgrade');
  return NextResponse.json({ success: true });
}
