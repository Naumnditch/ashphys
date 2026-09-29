/**
 * GET /api/lessons?curriculum=as
 * Every published lesson in one curriculum, grouped the way that curriculum
 * is organised, each with its topic code for that curriculum, its shared
 * simulations and the size of that curriculum's question bank. Public, like
 * the /curriculum page it mirrors.
 */

import { NextRequest, NextResponse } from 'next/server';
import { CURRICULA, CURRICULUM_IDS, tryParseCurriculum } from '@/lib/curricula';
import { getLessonsByCurriculum } from '@/lib/curricula/queries';
import { groupLessons, summarize } from '@/lib/curricula/lessons';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('curriculum');
  if (!raw) {
    return NextResponse.json(
      { success: false, error: `curriculum is required: one of ${CURRICULUM_IDS.join(', ')}` },
      { status: 400 }
    );
  }
  const curriculumId = tryParseCurriculum(raw);
  if (!curriculumId) {
    return NextResponse.json(
      { success: false, error: `Unknown curriculum "${raw}": use one of ${CURRICULUM_IDS.join(', ')}` },
      { status: 404 }
    );
  }

  try {
    const groups = groupLessons(await getLessonsByCurriculum(curriculumId), curriculumId);
    return NextResponse.json({
      success: true,
      data: {
        curriculum: CURRICULA[curriculumId],
        summary: summarize(groups),
        groups,
        lessons: groups.flatMap((g) => g.lessons),
      },
    });
  } catch (err) {
    console.error('GET /api/lessons failed', err);
    return NextResponse.json({ success: false, error: 'Could not load lessons' }, { status: 500 });
  }
}
