/** GET /api/solutions — the published catalog, optionally filtered by chapter/topic. */

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getViewStatus } from '@/lib/solutions/access';
import { viewLimitFor } from '@/lib/solutions/limits';
import { listPublishedSolutions } from '@/lib/solutions/queries';
import { getUserTier, tierName } from '@/lib/subscriptions/getUserTier';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const chapterParam = searchParams.get('chapter');
  const chapter = chapterParam ? Number(chapterParam) : undefined;
  const topic = searchParams.get('topic') || undefined;

  const user = await getCurrentUser();
  const [solutions, tier] = await Promise.all([
    listPublishedSolutions(user?.id ?? null, {
      chapter: chapter && Number.isFinite(chapter) ? chapter : undefined,
      topic,
    }),
    user ? getUserTier(user.id) : Promise.resolve(0),
  ]);
  const status = user ? await getViewStatus(user.id, tier) : { viewsUsed: 0, viewLimit: viewLimitFor(0) };

  return NextResponse.json({
    success: true,
    solutions,
    viewer: { signedIn: Boolean(user), tier: tierName(tier), viewsUsed: status.viewsUsed, viewLimit: status.viewLimit },
  });
}
