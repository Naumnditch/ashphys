/**
 * GET  /api/user/preferences  -> { success, selectedCurriculum }
 * POST /api/user/preferences  { selectedCurriculum: "as" }
 *
 * Which curriculum the student is studying. Always remembered in a cookie so
 * server-rendered pages open in the right curriculum; for a logged-in
 * student it is also saved to their account, so it follows them to any
 * device. Logged-out visitors can use this too — only the cookie is set.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { CURRICULUM_COOKIE, CURRICULUM_IDS, DEFAULT_CURRICULUM, tryParseCurriculum, type CurriculumId } from '@/lib/curricula';
import { getCookieCurriculum, getUserCurriculum, setUserCurriculum } from '@/lib/curricula/queries';

export const dynamic = 'force-dynamic';

const ONE_YEAR = 60 * 60 * 24 * 365;

function withCookie(res: NextResponse, curriculumId: CurriculumId) {
  res.cookies.set(CURRICULUM_COOKIE, curriculumId, {
    path: '/',
    maxAge: ONE_YEAR,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}

export async function GET() {
  const user = await getCurrentUser();
  const saved = user ? await getUserCurriculum(user.id) : null;
  return NextResponse.json({
    success: true,
    selectedCurriculum: saved ?? getCookieCurriculum() ?? DEFAULT_CURRICULUM,
    saved: saved !== null,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const curriculumId = tryParseCurriculum(body?.selectedCurriculum);
  if (!curriculumId) {
    return NextResponse.json(
      { success: false, error: `selectedCurriculum must be one of ${CURRICULUM_IDS.join(', ')}` },
      { status: 400 }
    );
  }

  const user = await getCurrentUser();
  if (user) {
    try {
      await setUserCurriculum(user.id, curriculumId);
    } catch (err) {
      // The cookie still carries the choice on this device.
      console.error('Saving curriculum preference failed', err);
      return withCookie(
        NextResponse.json({ success: false, error: 'Could not save to your account', selectedCurriculum: curriculumId }, { status: 500 }),
        curriculumId
      );
    }
  }

  return withCookie(NextResponse.json({ success: true, selectedCurriculum: curriculumId, saved: !!user }), curriculumId);
}
