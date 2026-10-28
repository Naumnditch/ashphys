/** POST — logs that a viewer who is out of views clicked through to upgrade from a handwritten solution. */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { fail, UUID_RE } from '@/lib/messaging/http';
import { logAccess } from '@/lib/solutions/access';
import { findQuestion } from '@/lib/handwriting/store';

export async function POST(_req: NextRequest, { params }: { params: { topicId: string; problemId: string } }) {
  if (!UUID_RE.test(params.topicId) || !UUID_RE.test(params.problemId)) return fail('Not found', 404);
  const user = await getCurrentUser();
  if (!user) return fail('Please sign in', 401);
  if (!(await findQuestion(params.problemId, params.topicId))) return fail('Not found', 404);
  await logAccess(user.id, { problemId: params.problemId }, 'attempted_upgrade');
  return NextResponse.json({ success: true });
}
