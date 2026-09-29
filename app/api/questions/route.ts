/**
 * GET /api/questions?curriculumId=as&lessonId=<topic id>
 * One curriculum's practice questions for a lesson, without their answers
 * (grading only happens in POST /api/practice/[topicId]/submit). Needs a
 * login and the lesson's plan tier, exactly like the practice session.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getUserTier } from '@/lib/subscriptions/getUserTier';
import { query } from '@/lib/db/client';
import { CURRICULUM_IDS, topicInCurriculum, tryParseCurriculum } from '@/lib/curricula';
import { loadQuestionBank } from '@/lib/practice/questions';

export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Please log in first' }, { status: 401 });
  }

  const params = req.nextUrl.searchParams;
  const curriculumId = tryParseCurriculum(params.get('curriculumId') ?? params.get('curriculum'));
  const lessonId = params.get('lessonId') ?? params.get('topicId');
  if (!curriculumId || !lessonId) {
    return NextResponse.json(
      { success: false, error: `curriculumId (one of ${CURRICULUM_IDS.join(', ')}) and lessonId are required` },
      { status: 400 }
    );
  }
  if (!UUID.test(lessonId)) {
    return NextResponse.json({ success: false, error: 'Lesson not found' }, { status: 404 });
  }

  const topicResult = await query(`SELECT id, topic_name, required_tier, curriculum_ids FROM topics WHERE id = $1`, [lessonId]);
  const topic = topicResult.rows[0];
  if (!topic) {
    return NextResponse.json({ success: false, error: 'Lesson not found' }, { status: 404 });
  }

  const tier = await getUserTier(user.id);
  if (user.role !== 'admin' && tier < topic.required_tier) {
    return NextResponse.json(
      { success: false, error: 'This lesson requires a higher plan', locked: true, requiredTier: topic.required_tier },
      { status: 403 }
    );
  }

  // A curriculum that doesn't list this lesson simply has no questions for it.
  const bank = topicInCurriculum(topic, curriculumId) ? await loadQuestionBank(topic.id, curriculumId) : [];

  return NextResponse.json({
    success: true,
    data: {
      curriculumId,
      lessonId: topic.id,
      questions: bank.map((p, i) => ({
        id: p.id,
        number: p.problem_number ?? i + 1,
        questionText: p.question_text,
        imageUrl: p.question_image_url,
        answerType: p.answer_type,
        difficultyLevel: p.difficulty_level,
        topicCode: p.topic_code,
        syllabusCite: p.syllabus_cite,
        options: p.options,
      })),
    },
  });
}
