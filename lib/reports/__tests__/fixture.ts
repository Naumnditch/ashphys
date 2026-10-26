/**
 * A realistic StudentReport for tests and previews, built through the same
 * insight functions as production (numbers shaped like a real A Level
 * student's: three shared lessons, ~240 answers over five weeks).
 */

import {
  actionPlan,
  badges,
  calendarDays,
  progressScore,
  scoreBand,
  streaks,
  strengthsAndFocus,
  trendOf,
} from '@/lib/reports/insights';
import type { ReportLesson, ReviseQuestion, StudentReport, TeacherNote } from '@/lib/reports/types';

export function lesson(over: Partial<ReportLesson> & Pick<ReportLesson, 'topicId' | 'name' | 'attempted' | 'correct'>): ReportLesson {
  return {
    chapter: 'A Level · Chapter 16 · Circular motion',
    chapterKey: '9702:16',
    curriculumId: 'a-level',
    accuracy: over.correct / over.attempted,
    questions: Math.round(over.attempted * 0.7),
    questionsRight: Math.round(over.correct * 0.9),
    mastered: false,
    avgTimeMs: 240_000,
    lastAt: '2026-10-25T10:00:00.000Z',
    practiceHref: `/practice/${over.topicId}?c=a-level`,
    lessonHref: `/lessons/${over.topicId}?c=a-level`,
    sheetHref: null,
    videoHref: `/dashboard?tab=videos&lesson=${over.topicId}`,
    ...over,
  };
}

const DAYS: Record<string, number> = {
  '2026-09-23': 32, '2026-09-24': 57, '2026-09-29': 30, '2026-09-30': 35, '2026-10-01': 20, '2026-10-02': 39,
  '2026-10-04': 6, '2026-10-05': 19, '2026-10-06': 3, '2026-10-07': 4, '2026-10-08': 11, '2026-10-10': 6,
  '2026-10-11': 29, '2026-10-12': 15, '2026-10-13': 49, '2026-10-14': 16, '2026-10-15': 15, '2026-10-16': 13,
  '2026-10-17': 33, '2026-10-18': 46, '2026-10-19': 30, '2026-10-20': 86, '2026-10-25': 50, '2026-10-26': 2,
};

export function sampleReport(opts: { note?: Partial<TeacherNote> | null; answered?: number } = {}): StudentReport {
  const today = '2026-10-27';
  const lessons = [
    lesson({ topicId: '11111111-1111-4111-8111-111111111111', name: "Coulomb's law (extension)", chapter: 'A Level · Chapter 22 · Coulomb’s law', chapterKey: '9702:22', attempted: 89, correct: 63, mastered: true, sheetHref: '/cheat-sheets/a-level-coulombs-law' }),
    lesson({ topicId: '22222222-2222-4222-8222-222222222222', name: 'Circular motion (extension)', attempted: 109, correct: 67, mastered: true, sheetHref: '/cheat-sheets/a-level-circular-motion' }),
    lesson({ topicId: '33333333-3333-4333-8333-333333333333', name: 'Gravitation and orbits (extension)', chapter: 'A Level · Chapter 17 · Gravitational fields', chapterKey: '9702:17', attempted: 72, correct: 37, mastered: false, sheetHref: '/cheat-sheets/a-level-gravitational-fields' }),
  ];
  const answered = opts.answered ?? 158;
  const right = Math.round(answered * 0.93);
  const firstTryRight = Math.round(answered * 0.55);
  const { strengths, focus } = strengthsAndFocus(lessons);
  const trend = trendOf({ answers: 181, correct: 113 }, { answers: 62, correct: 36 });
  const { current, longest } = streaks(Object.keys(DAYS), today);
  const mistakes = { wrongValue: 61, wrongUnit: 14, unreadable: 4, other: 26, total: 105 };
  const difficulty = [
    { level: 1, label: 'Easy', attempted: 40, correct: 34 },
    { level: 2, label: 'Medium', attempted: 88, correct: 60 },
    { level: 3, label: 'Hard', attempted: 70, correct: 40 },
    { level: 4, label: 'Challenging', attempted: 52, correct: 23 },
    { level: 5, label: 'Extension', attempted: 20, correct: 10 },
  ];
  const revise: ReviseQuestion[] = [
    { problemId: 'q1', topicId: lessons[2].topicId, lesson: lessons[2].name, number: 14, question: 'A satellite orbits the Earth at a height of 2.0 × 10⁶ m above the surface. Calculate its orbital period.', wrongTries: 4, stillWrong: true, lastAnswer: '6800 s', href: lessons[2].practiceHref },
    { problemId: 'q2', topicId: lessons[1].topicId, lesson: lessons[1].name, number: 22, question: 'A car of mass 1200 kg rounds a bend of radius 45 m at 15 m s⁻¹. Find the friction force needed.', wrongTries: 3, stillWrong: true, lastAnswer: '6000', href: lessons[1].practiceHref },
    { problemId: 'q3', topicId: lessons[0].topicId, lesson: lessons[0].name, number: 7, question: 'Two charges of +3.0 μC and −5.0 μC are 0.20 m apart. Calculate the force between them.', wrongTries: 2, stillWrong: false, lastAnswer: '3.4 N', href: lessons[0].practiceHref },
  ];
  const score = progressScore({ answered, right, firstTryRight, activeDays30: 20, practised: 3, mastered: 2, inStartedLessons: answered + 12 + 30 });
  const notes: TeacherNote[] =
    opts.note === null
      ? []
      : [
          {
            id: 'n1',
            signature: 'Mr. Abdelrahman',
            body: 'Great work on Coulomb’s law this month — your accuracy there is excellent.\n\nYour weak spot is gravitation: revise the orbit equations (v = √(GM/r), T² ∝ r³) and redo the questions still marked wrong before Friday’s quiz.',
            focusTopicIds: [lessons[2].topicId],
            createdAt: '2026-10-26T18:30:00.000Z',
            updatedAt: '2026-10-26T18:30:00.000Z',
            readAt: null,
            ...(opts.note ?? {}),
          },
        ];
  const teacherFocus = notes.length ? [{ topicId: lessons[2].topicId, name: lessons[2].name, href: lessons[2].practiceHref }] : [];
  const accuracy = right / answered;
  const firstTryAccuracy = firstTryRight / answered;
  return {
    generatedAt: '2026-10-27T09:00:00.000Z',
    student: { id: '749f4083-3be4-46ca-94d1-37fc189bf4cc', name: 'Yusuf Demir', firstName: 'Yusuf', email: 'yusuf@example.com', joinedAt: '2026-09-23T15:51:38.000Z', className: 'Grade 12 · A', schoolName: null, curricula: ['A Level'] },
    score: { value: score.value, band: scoreBand(score.value, answered), parts: score.parts },
    kpis: { answered, right, wrong: answered - right, accuracy, firstTryAccuracy, answerAccuracy: 167 / 270, submissions: 270, mastered: 2, practised: 3, activeDays30: 20, minutes30: 610, totalMinutes: 845, currentStreak: current, longestStreak: longest },
    trend,
    lessons,
    strengths,
    focus,
    chapters: [],
    difficulty,
    mistakes,
    weekly: [
      ['2026-08-10', 0, 0], ['2026-08-17', 0, 0], ['2026-08-24', 0, 0], ['2026-08-31', 0, 0], ['2026-09-07', 0, 0], ['2026-09-14', 0, 0],
      ['2026-09-21', 40, 25], ['2026-09-28', 30, 22], ['2026-10-05', 21, 14], ['2026-10-12', 45, 26], ['2026-10-19', 52, 31], ['2026-10-26', 1, 0],
    ].map(([week, correct, incorrect]) => ({ week: String(week), correct: Number(correct), incorrect: Number(incorrect) })),
    calendar: calendarDays(DAYS, today),
    revise,
    plan: actionPlan({
      answered, accuracy, firstTryAccuracy, submissions: 270, hintsUsed: 31, skipped: 12, notReached: 30, medianTimeMs: 95_000, activeDays30: 20,
      mistakes, difficulty, focus, lessons, revise, trend, score: score.value, teacherFocus,
    }),
    badges: badges({ answered, accuracy, firstTryAccuracy, mastered: 2, longestStreak: longest, activeDays30: 20, wrongUnit: 14, hardCorrect: 33, trend }),
    habits: { medianTimeMs: 95_000, hintsUsed: 31, hintRate: 31 / 270, skipped: 12, notReached: 30, practiceSessions: 19, lessonsOpened: 6, simulations: 3, solutions: 8, videoRequests: 1 },
    notes,
    teacherFocus,
  };
}
