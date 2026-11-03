/**
 * POST /api/practice/[topicId]/submit
 * Body: { problemId, submittedAnswer, timeSpentMs?, hintUsed? }
 *
 * submittedAnswer is an option id (MCQ), or what the maths answer box holds:
 * the raw LaTeX ("3\times10^{8}") or, from older clients, plain text. It is
 * validated (length, characters, LaTeX commands) and only ever parsed —
 * never evaluated — and the raw string is what gets stored, so the answer
 * can be shown again exactly as the student wrote it.
 *
 * Grades the answer, appends it to practice_attempts (the source of truth)
 * and returns the mastery state derived from that log — IXL-style, a run of
 * MASTERY_STREAK correct answers marks the topic mastered and a wrong answer
 * resets the run.
 *
 * Grading happens here and only here: the client never sees the expected
 * answer, and attempts are only ever written from this route, so a student
 * cannot forge a correct attempt.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getUserTier } from '@/lib/subscriptions/getUserTier';
import { query } from '@/lib/db/client';
import { gradeSubmission } from '@/lib/grading/gradeSubmission';
import { validateAnswer } from '@/lib/math/answerValidation';
import { openPracticeSession, recordAttempt } from '@/lib/practice/attempts';
import { explanationForStudents } from '@/lib/explanations/display';

export async function POST(req: NextRequest, { params }: { params: { topicId: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ success: false, error: 'Please log in first' }, { status: 401 });
  }

  const topicResult = await query(`SELECT required_tier FROM topics WHERE id = $1`, [params.topicId]);
  if (topicResult.rows.length === 0) {
    return NextResponse.json({ success: false, error: 'Topic not found' }, { status: 404 });
  }
  const tier = await getUserTier(user.id);
  if (user.role !== 'admin' && tier < topicResult.rows[0].required_tier) {
    return NextResponse.json({ success: false, error: 'This lesson requires a higher plan' }, { status: 403 });
  }

  let body: { problemId?: unknown; submittedAnswer?: unknown; timeSpentMs?: unknown; hintUsed?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
  }
  const { problemId, timeSpentMs, hintUsed } = body;
  if (!problemId || typeof problemId !== 'string') {
    return NextResponse.json({ success: false, error: 'Missing answer' }, { status: 400 });
  }
  const checked = validateAnswer(body.submittedAnswer);
  if (!checked.ok) {
    return NextResponse.json({ success: false, error: checked.error }, { status: 400 });
  }
  const submittedAnswer = checked.answer;

  const problemResult = await query(
    `SELECT id, answer_type, answer_correct, explanation, explanation_structured, explanation_structured_status, chapter_id,
            answer_unit, answer_unit_required, answer_tolerance, answer_sign_sensitive, answer_alternates
     FROM problems WHERE id = $1 AND topic_id = $2`,
    [problemId, params.topicId]
  );
  if (problemResult.rows.length === 0) {
    return NextResponse.json({ success: false, error: 'Question not found' }, { status: 404 });
  }
  const problem = problemResult.rows[0];

  let correctOption: { id: string; option_text: string } | null = null;
  if (problem.answer_type === 'multiple_choice') {
    const optionResult = await query(
      `SELECT id, option_text FROM problem_options WHERE problem_id = $1 AND is_correct = TRUE LIMIT 1`,
      [problemId]
    );
    correctOption = optionResult.rows[0] ?? null;
  }
  const { isCorrect, correctAnswerLabel, gradingMethod, gradeReason, toleranceUsed, normalizedAnswer, feedback } =
    gradeSubmission(problem, submittedAnswer, correctOption);

  // problem_submissions is kept in step with practice_attempts because the
  // admin analytics dashboard still reads it.
  await query(
    `INSERT INTO problem_submissions (student_id, problem_id, submitted_answer, is_correct, points_earned, time_spent_seconds)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      user.id,
      problemId,
      String(submittedAnswer),
      isCorrect,
      isCorrect ? 1 : 0,
      typeof timeSpentMs === 'number' ? Math.round(timeSpentMs / 1000) : null,
    ]
  );

  const sessionId = await openPracticeSession(user.id, params.topicId);
  const mastery = await recordAttempt({
    studentId: user.id,
    problemId,
    topicId: params.topicId,
    chapterId: problem.chapter_id,
    sessionId,
    rawAnswer: String(submittedAnswer),
    normalizedAnswer,
    isCorrect,
    gradingMethod,
    gradeReason,
    toleranceUsed,
    hintUsed: hintUsed === true,
    timeSpentMs: typeof timeSpentMs === 'number' && timeSpentMs >= 0 ? Math.round(timeSpentMs) : null,
  });

  return NextResponse.json({
    success: true,
    data: {
      isCorrect,
      correctAnswerLabel,
      ...explanationForStudents(problem),
      feedback,
      grading: {
        method: gradingMethod,
        reason: gradeReason,
        tolerance: toleranceUsed,
        readAs: normalizedAnswer,
      },
      mastery,
    },
  });
}
