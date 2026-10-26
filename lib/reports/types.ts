/**
 * Shapes of the student progress report. Client-safe (no server imports):
 * the dashboard tab, the admin view and the PDF all render one
 * StudentReport built by lib/reports/data.ts + lib/reports/insights.ts.
 */

import type { CurriculumId } from '@/lib/curricula';

export interface ReportLesson {
  topicId: string;
  /** Lesson title as its curriculum names it. */
  name: string;
  /** "Chapter 17 · Gravitational fields" */
  chapter: string;
  chapterKey: string;
  curriculumId: CurriculumId;
  attempted: number;
  correct: number;
  /** correct ÷ answers submitted (retries included), 0–1. */
  accuracy: number;
  /** Distinct questions answered, and how many are right by the latest answer. */
  questions: number;
  questionsRight: number;
  mastered: boolean;
  avgTimeMs: number | null;
  lastAt: string | null;
  practiceHref: string;
  lessonHref: string;
  sheetHref: string | null;
  videoHref: string;
}

export interface ReportChapter {
  key: string;
  label: string;
  attempted: number;
  correct: number;
  accuracy: number;
}

export interface ReportDifficulty {
  level: number;
  label: string;
  attempted: number;
  correct: number;
}

export interface ReportMistakes {
  wrongValue: number;
  wrongUnit: number;
  unreadable: number;
  other: number;
  total: number;
}

export interface ReportWeek {
  /** Monday of the week, YYYY-MM-DD. */
  week: string;
  correct: number;
  incorrect: number;
}

export interface ReportDay {
  day: string;
  /** Recorded actions that day (answers, lessons, simulations, solutions…). */
  count: number;
}

export interface ReviseQuestion {
  problemId: string;
  topicId: string | null;
  lesson: string | null;
  number: number | null;
  question: string;
  wrongTries: number;
  stillWrong: boolean;
  lastAnswer: string | null;
  href: string | null;
}

export type PlanSource = 'teacher' | 'auto';

export interface PlanStep {
  id: string;
  icon: string;
  title: string;
  detail: string;
  href?: string;
  hrefLabel?: string;
  source: PlanSource;
  priority: number;
}

export interface ReportBadge {
  id: string;
  icon: string;
  label: string;
  detail: string;
}

export type ScoreBandId = 'start' | 'support' | 'developing' | 'good' | 'excellent';

export interface ScoreBand {
  id: ScoreBandId;
  label: string;
  summary: string;
}

export interface ScorePart {
  id: 'accuracy' | 'firstTry' | 'consistency' | 'mastery';
  label: string;
  /** 0–1 */
  value: number;
  weight: number;
}

export interface ReportTrend {
  /** Accuracy over the last 14 days and the 14 before (null = no answers). */
  recent: number | null;
  previous: number | null;
  recentAnswers: number;
  previousAnswers: number;
  direction: 'up' | 'down' | 'flat' | 'new' | 'quiet';
}

export interface TeacherNote {
  id: string;
  signature: string;
  body: string;
  focusTopicIds: string[];
  createdAt: string;
  updatedAt: string;
  readAt: string | null;
}

export interface StudentReport {
  generatedAt: string;
  student: {
    id: string;
    name: string;
    firstName: string;
    email: string;
    joinedAt: string | null;
    className: string | null;
    schoolName: string | null;
    curricula: string[];
  };
  score: { value: number; band: ScoreBand; parts: ScorePart[] };
  kpis: {
    answered: number;
    right: number;
    wrong: number;
    accuracy: number | null;
    firstTryAccuracy: number | null;
    answerAccuracy: number | null;
    submissions: number;
    mastered: number;
    practised: number;
    activeDays30: number;
    minutes30: number;
    totalMinutes: number;
    currentStreak: number;
    longestStreak: number;
  };
  trend: ReportTrend;
  lessons: ReportLesson[];
  strengths: ReportLesson[];
  focus: ReportLesson[];
  chapters: ReportChapter[];
  difficulty: ReportDifficulty[];
  mistakes: ReportMistakes;
  weekly: ReportWeek[];
  calendar: ReportDay[];
  revise: ReviseQuestion[];
  plan: PlanStep[];
  badges: ReportBadge[];
  habits: {
    medianTimeMs: number | null;
    hintsUsed: number;
    hintRate: number | null;
    skipped: number;
    notReached: number;
    practiceSessions: number;
    lessonsOpened: number;
    simulations: number;
    solutions: number;
    videoRequests: number;
  };
  notes: TeacherNote[];
  /** Lessons pinned by the newest note, resolved to names. */
  teacherFocus: { topicId: string; name: string; href: string }[];
}
