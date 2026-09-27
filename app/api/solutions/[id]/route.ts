/**
 * GET /api/solutions/[id] — one solution. Signed out or blocked viewers get
 * the preview only, with `access` explaining why and what it would take.
 * A successful fetch here for a not-yet-unlocked solution IS the unlock:
 * it logs the view and, if new, spends one of the viewer's remaining views.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { fail, UUID_RE } from '@/lib/messaging/http';
import { getUserTier } from '@/lib/subscriptions/getUserTier';
import { resolveSolutionAccess } from '@/lib/solutions/access';
import { viewLimitFor } from '@/lib/solutions/limits';
import { getSolutionById } from '@/lib/solutions/queries';
import type { SolutionDetailDTO } from '@/lib/solutions/types';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  if (!UUID_RE.test(id)) return fail('Not found', 404);

  const solution = await getSolutionById(id);
  if (!solution) return fail('Not found', 404);

  const user = await getCurrentUser();
  if (!user) {
    const body: SolutionDetailDTO = {
      ...solution,
      interactiveHtml: null,
      interactiveHtmlUrl: null,
      access: { allowed: false, reason: 'sign_in_required', viewsUsed: 0, viewLimit: viewLimitFor(0) },
    };
    return NextResponse.json({ success: true, solution: body });
  }

  const tier = await getUserTier(user.id);
  const access = await resolveSolutionAccess(user.id, tier, id, solution.tierRequired);

  const body: SolutionDetailDTO = {
    ...solution,
    unlocked: access.allowed,
    interactiveHtml: access.allowed ? solution.interactiveHtml : null,
    interactiveHtmlUrl: access.allowed ? solution.interactiveHtmlUrl : null,
    access,
  };
  return NextResponse.json({ success: true, solution: body });
}
