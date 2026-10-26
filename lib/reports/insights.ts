/**
 * The judgement half of the student report: progress score, level, trend,
 * strengths / focus lessons, the action plan ("what to do next") and badges.
 * Pure functions over numbers already fetched by lib/reports/data.ts, so
 * every rule is unit-tested without a database.
 */

import { rankByAccuracy } from '@/lib/admin/studentHistory';
import type {
  PlanStep,
  ReportBadge,
  ReportDay,
  ReportDifficulty,
  ReportLesson,
  ReportMistakes,
  ReportTrend,
  ReviseQuestion,
  ScoreBand,
  ScorePart,
} from '@/lib/reports/types';

/** Answers needed before the report rates the student at all. */
export const MIN_ANSWERS_TO_RATE = 10;
/** Active days in 30 that count as "fully consistent" for the score. */
export const CONSISTENT_DAYS_30 = 12;
/** The plan shows the teacher's step plus this many automatic ones. */
export const PLAN_STEPS = 4;
export const CALENDAR_DAYS = 84;

export const ratio = (num: number, den: number): number | null => (den > 0 ? num / den : null);
export const pct = (v: number | null | undefined) => (v === null || v === undefined ? '—' : `${Math.round(v * 100)}%`);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

/** "hadi  bekdash" → "Hadi Bekdash" (only when the whole name is lower case). */
export function displayName(first: string | null | undefined, last: string | null | undefined, email = ''): string {
  const raw = [first, last]
    .map((s) => (s ?? '').trim().replace(/\s+/g, ' '))
    .filter(Boolean)
    .join(' ');
  if (!raw) return email.split('@')[0] || 'Student';
  if (raw !== raw.toLowerCase()) return raw;
  return raw.replace(/(^|[\s'-])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toLocaleUpperCase('tr'));
}

export const DIFFICULTY_NAMES: Record<number, string> = {
  0: 'Unrated',
  1: 'Easy',
  2: 'Medium',
  3: 'Hard',
  4: 'Challenging',
  5: 'Extension',
};

export interface ScoreInput {
  answered: number;
  right: number;
  firstTryRight: number;
  activeDays30: number;
  practised: number;
  mastered: number;
  /** Questions answered + skipped + not reached in the lessons they started. */
  inStartedLessons: number;
}

/**
 * Progress score, 0–100: 40% accuracy (latest answer per question), 25%
 * first-try accuracy, 15% consistency (active days in the last 30, full
 * marks at 12) and 20% progress through started lessons (half mastery, half
 * questions done). The parts are returned so the page can explain the number.
 */
export function progressScore(s: ScoreInput): { value: number; parts: ScorePart[] } {
  const accuracy = ratio(s.right, s.answered) ?? 0;
  const firstTry = ratio(s.firstTryRight, s.answered) ?? 0;
  const consistency = clamp01(s.activeDays30 / CONSISTENT_DAYS_30);
  const mastery = ratio(s.mastered, s.practised) ?? 0;
  const completion = clamp01(ratio(s.answered, Math.max(s.inStartedLessons, s.answered)) ?? 0);
  const progress = 0.5 * mastery + 0.5 * completion;
  const parts: ScorePart[] = [
    { id: 'accuracy', label: 'Accuracy', value: accuracy, weight: 0.4 },
    { id: 'firstTry', label: 'Right first time', value: firstTry, weight: 0.25 },
    { id: 'consistency', label: 'Consistency', value: consistency, weight: 0.15 },
    { id: 'mastery', label: 'Lesson progress', value: progress, weight: 0.2 },
  ];
  const value = s.answered === 0 ? 0 : Math.round(100 * parts.reduce((sum, p) => sum + p.value * p.weight, 0));
  return { value, parts };
}

export function scoreBand(score: number, answered: number): ScoreBand {
  if (answered < MIN_ANSWERS_TO_RATE)
    return { id: 'start', label: 'Getting started', summary: 'Answer a few more questions and this report fills in.' };
  if (score >= 85) return { id: 'excellent', label: 'Excellent', summary: 'Strong, accurate and consistent work.' };
  if (score >= 70) return { id: 'good', label: 'On track', summary: 'Good progress, with a few things to sharpen.' };
  if (score >= 50) return { id: 'developing', label: 'Developing', summary: 'The basics are there; focus on the steps below.' };
  return { id: 'support', label: 'Needs support', summary: 'Work through the action plan, one step at a time.' };
}

export function trendOf(recent: { answers: number; correct: number }, previous: { answers: number; correct: number }): ReportTrend {
  const r = ratio(recent.correct, recent.answers);
  const p = ratio(previous.correct, previous.answers);
  let direction: ReportTrend['direction'];
  if (recent.answers === 0) direction = 'quiet';
  else if (previous.answers < 5 || recent.answers < 5) direction = 'new';
  else if (r! - p! >= 0.08) direction = 'up';
  else if (p! - r! >= 0.08) direction = 'down';
  else direction = 'flat';
  return { recent: r, previous: p, recentAnswers: recent.answers, previousAnswers: previous.answers, direction };
}

const dayMs = 86_400_000;
const toDay = (d: Date) => d.toISOString().slice(0, 10);
const addDays = (day: string, n: number) => toDay(new Date(Date.parse(`${day}T00:00:00Z`) + n * dayMs));

/** Current and longest run of consecutive study days. The current run survives until the end of the day after the last one. */
export function streaks(days: string[], today: string): { current: number; longest: number } {
  const set = new Set(days);
  const sorted = Array.from(set).sort();
  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const d of sorted) {
    run = prev && addDays(prev, 1) === d ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = d;
  }
  let start = set.has(today) ? today : set.has(addDays(today, -1)) ? addDays(today, -1) : null;
  let current = 0;
  while (start && set.has(start)) {
    current++;
    start = addDays(start, -1);
  }
  return { current, longest };
}

/** The last `n` days ending today, oldest first, with zero-filled counts. */
export function calendarDays(counts: Record<string, number>, today: string, n = CALENDAR_DAYS): ReportDay[] {
  return Array.from({ length: n }, (_, i) => {
    const day = addDays(today, i - (n - 1));
    return { day, count: counts[day] ?? 0 };
  });
}

/** Strongest and weakest lessons (≥ 5 answers each, never overlapping). */
export function strengthsAndFocus(lessons: ReportLesson[]): { strengths: ReportLesson[]; focus: ReportLesson[] } {
  const { best, worst } = rankByAccuracy(lessons, 3);
  // A "strength" below 60% isn't one, and a 90%+ lesson doesn't need focus.
  return {
    strengths: best.filter((l) => l.accuracy >= 0.6),
    focus: worst.filter((l) => l.accuracy < 0.9),
  };
}

export interface PlanInput {
  answered: number;
  accuracy: number | null;
  firstTryAccuracy: number | null;
  submissions: number;
  hintsUsed: number;
  skipped: number;
  notReached: number;
  medianTimeMs: number | null;
  activeDays30: number;
  mistakes: ReportMistakes;
  difficulty: ReportDifficulty[];
  focus: ReportLesson[];
  lessons: ReportLesson[];
  revise: ReviseQuestion[];
  trend: ReportTrend;
  score: number;
  teacherFocus: { topicId: string; name: string; href: string }[];
}

function band(levels: ReportDifficulty[], from: number, to: number) {
  const rows = levels.filter((d) => d.level >= from && d.level <= to);
  const attempted = rows.reduce((s, d) => s + d.attempted, 0);
  const correct = rows.reduce((s, d) => s + d.correct, 0);
  return { attempted, correct, accuracy: ratio(correct, attempted) };
}

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

/**
 * "What to do next": every rule that fires, most important first; the page
 * shows the teacher's pinned lessons plus the top PLAN_STEPS automatic ones.
 */
export function actionPlan(p: PlanInput): PlanStep[] {
  const steps: PlanStep[] = [];

  if (p.teacherFocus.length) {
    steps.push({
      id: 'teacher-focus',
      icon: '📌',
      title: 'Your teacher’s focus',
      detail: `Work on ${p.teacherFocus.map((t) => t.name).join(', ')} first.`,
      href: p.teacherFocus[0].href,
      hrefLabel: 'Start practising',
      source: 'teacher',
      priority: 0,
    });
  }

  if (p.answered === 0) {
    steps.push({
      id: 'start',
      icon: '🚀',
      title: 'Answer your first questions',
      detail: 'Open any lesson and try its practice questions. Your report fills in as you go.',
      href: '/dashboard?tab=curriculum',
      hrefLabel: 'Pick a lesson',
      source: 'auto',
      priority: 1,
    });
    return steps;
  }

  const stillWrong = p.revise.filter((q) => q.stillWrong);
  if (stillWrong.length) {
    steps.push({
      id: 'fix-wrong',
      icon: '🔁',
      title: `Fix ${plural(stillWrong.length, 'question')} you still have wrong`,
      detail: 'Your latest answer to these is wrong. Retry them now that you know where you slipped.',
      href: stillWrong[0].href ?? undefined,
      hrefLabel: 'Retry',
      source: 'auto',
      priority: 1,
    });
  }

  const weakest = p.focus[0];
  if (weakest && weakest.accuracy < 0.7) {
    steps.push({
      id: 'revise-weakest',
      icon: '📖',
      title: `Revise ${weakest.name}`,
      detail: `${pct(weakest.accuracy)} correct so far. Read the lesson${weakest.sheetHref ? ' and its revision sheet' : ''}, then practise until you get 5 right in a row.`,
      href: weakest.sheetHref ?? weakest.lessonHref,
      hrefLabel: weakest.sheetHref ? 'Open revision sheet' : 'Open lesson',
      source: 'auto',
      priority: 2,
    });
  }

  const m = p.mistakes;
  if (m.wrongUnit >= 3 && m.wrongUnit / Math.max(1, m.total) >= 0.15) {
    steps.push({
      id: 'units',
      icon: '📏',
      title: 'Check your units',
      detail: `${plural(m.wrongUnit, 'wrong answer')} had the right idea but a wrong or missing unit. Convert to SI (g → kg, cm → m) before you calculate and always write the unit.`,
      source: 'auto',
      priority: 3,
    });
  }

  if (p.trend.direction === 'down' && p.trend.recent !== null && p.trend.previous !== null) {
    steps.push({
      id: 'trend-down',
      icon: '📉',
      title: 'Your accuracy dipped recently',
      detail: `${pct(p.trend.recent)} in the last two weeks, down from ${pct(p.trend.previous)}. Slow down and revisit the lesson notes before new questions.`,
      source: 'auto',
      priority: 3,
    });
  }

  if (m.unreadable >= 3 && m.unreadable / Math.max(1, m.total) >= 0.1) {
    steps.push({
      id: 'format',
      icon: '✍️',
      title: 'Write answers the checker can read',
      detail: `${plural(m.unreadable, 'answer')} couldn’t be read. Type a number then its unit, like 3.2e5 N or 0.45 m s⁻¹.`,
      source: 'auto',
      priority: 4,
    });
  }

  const easy = band(p.difficulty, 1, 2);
  const hard = band(p.difficulty, 4, 5);
  if (hard.attempted >= 5 && (hard.accuracy ?? 0) < 0.45 && (easy.accuracy ?? 0) >= 0.65) {
    steps.push({
      id: 'hard-low',
      icon: '🧗',
      title: 'Build up to the challenging questions',
      detail: `${pct(easy.accuracy)} on easy and medium questions but ${pct(hard.accuracy)} on challenging ones. Study a worked solution, then try a similar question yourself.`,
      source: 'auto',
      priority: 4,
    });
  } else if (easy.attempted >= 8 && (easy.accuracy ?? 0) >= 0.8 && hard.attempted < 5) {
    steps.push({
      id: 'step-up',
      icon: '⛰️',
      title: 'Step up to challenging questions',
      detail: `You get ${pct(easy.accuracy)} of the easy and medium questions right — you’re ready for the challenging ones at the end of each bank.`,
      source: 'auto',
      priority: 5,
    });
  }

  if (p.answered >= MIN_ANSWERS_TO_RATE && p.firstTryAccuracy !== null && p.accuracy !== null && p.accuracy - p.firstTryAccuracy >= 0.2) {
    steps.push({
      id: 'first-try',
      icon: '🎯',
      title: 'Aim to get it right first time',
      detail: `${pct(p.firstTryAccuracy)} right on the first try, ${pct(p.accuracy)} in the end. Before you submit, re-read the question and check your working.`,
      source: 'auto',
      priority: 4,
    });
  }

  if (p.answered >= MIN_ANSWERS_TO_RATE && p.medianTimeMs !== null && p.medianTimeMs < 25_000 && (p.accuracy ?? 1) < 0.6) {
    steps.push({
      id: 'slow-down',
      icon: '🐢',
      title: 'Slow down a little',
      detail: `You answer in about ${Math.round(p.medianTimeMs / 1000)} s per question. Write down the knowns and the equation first — speed comes later.`,
      source: 'auto',
      priority: 4,
    });
  }

  if (p.activeDays30 < 6) {
    steps.push({
      id: 'consistency',
      icon: '📅',
      title: 'Study little and often',
      detail: `Active on ${plural(p.activeDays30, 'day')} of the last 30. Aim for 20 minutes, 4 days a week — steady practice beats cramming.`,
      source: 'auto',
      priority: 5,
    });
  }

  if (p.submissions >= MIN_ANSWERS_TO_RATE && p.hintsUsed / p.submissions > 0.4) {
    steps.push({
      id: 'hints',
      icon: '💡',
      title: 'Try before you take a hint',
      detail: `You used a hint on ${pct(p.hintsUsed / p.submissions)} of answers. Give each question a real attempt first.`,
      source: 'auto',
      priority: 6,
    });
  }

  if (p.skipped >= 3) {
    steps.push({
      id: 'skipped',
      icon: '↩️',
      title: `Go back to ${plural(p.skipped, 'skipped question')}`,
      detail: 'Skipping is fine for now — but come back to them; they’re usually the ones that teach the most.',
      source: 'auto',
      priority: 6,
    });
  }

  if (p.notReached > 0) {
    steps.push({
      id: 'finish',
      icon: '🏁',
      title: 'Finish the lessons you started',
      detail: `${plural(p.notReached, 'question')} left in the practice banks you opened.`,
      source: 'auto',
      priority: 7,
    });
  }

  if (p.score >= 85 && steps.length === 0) {
    steps.push({
      id: 'keep-going',
      icon: '🌟',
      title: 'Keep it up — start a new lesson',
      detail: 'Your work is excellent. Move on to the next lesson to keep the momentum.',
      href: '/dashboard?tab=curriculum',
      hrefLabel: 'Browse lessons',
      source: 'auto',
      priority: 8,
    });
  }

  const teacher = steps.filter((s) => s.source === 'teacher');
  const auto = steps.filter((s) => s.source === 'auto').sort((a, b) => a.priority - b.priority);
  return [...teacher, ...auto.slice(0, PLAN_STEPS)];
}

export interface BadgeInput {
  answered: number;
  accuracy: number | null;
  firstTryAccuracy: number | null;
  mastered: number;
  longestStreak: number;
  activeDays30: number;
  wrongUnit: number;
  hardCorrect: number;
  trend: ReportTrend;
}

/** Small achievements, shown as chips: earned ones only. */
export function badges(b: BadgeInput): ReportBadge[] {
  const out: ReportBadge[] = [];
  const milestone = [500, 250, 100, 50, 25].find((n) => b.answered >= n);
  if (milestone) out.push({ id: 'answered', icon: '✏️', label: `${milestone}+ questions`, detail: `${b.answered} questions answered` });
  if (b.mastered > 0)
    out.push({ id: 'mastered', icon: '⭐', label: `${plural(b.mastered, 'lesson')} mastered`, detail: '5 right in a row in a lesson' });
  if (b.longestStreak >= 3) out.push({ id: 'streak', icon: '🔥', label: `${b.longestStreak}-day streak`, detail: 'Longest run of study days' });
  if (b.answered >= 20 && (b.accuracy ?? 0) >= 0.8) out.push({ id: 'sharp', icon: '🎯', label: 'Sharp shooter', detail: '80%+ of questions right' });
  if (b.answered >= 20 && (b.firstTryAccuracy ?? 0) >= 0.75)
    out.push({ id: 'first-try', icon: '⚡', label: 'First-try pro', detail: '75%+ right on the first attempt' });
  if (b.answered >= 20 && b.wrongUnit === 0) out.push({ id: 'units', icon: '📏', label: 'Unit-perfect', detail: 'No unit mistakes' });
  if (b.hardCorrect >= 10) out.push({ id: 'climber', icon: '🧗', label: 'Challenge climber', detail: `${b.hardCorrect} challenging questions right` });
  if (b.activeDays30 >= CONSISTENT_DAYS_30) out.push({ id: 'steady', icon: '📅', label: 'Steady worker', detail: `${b.activeDays30} active days this month` });
  if (b.trend.direction === 'up') out.push({ id: 'improving', icon: '📈', label: 'Improving', detail: 'Accuracy up over the last two weeks' });
  return out;
}

export function formatMinutes(min: number): string {
  if (min < 60) return `${Math.round(min)} min`;
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return m ? `${h} h ${m} min` : `${h} h`;
}
