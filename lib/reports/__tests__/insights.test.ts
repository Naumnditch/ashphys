import { describe, expect, it } from 'vitest';
import {
  MIN_ANSWERS_TO_RATE,
  PLAN_STEPS,
  actionPlan,
  badges,
  calendarDays,
  displayName,
  progressScore,
  scoreBand,
  streaks,
  strengthsAndFocus,
  trendOf,
  type PlanInput,
} from '@/lib/reports/insights';
import { parseNoteInput } from '@/lib/reports/notes';
import { lesson } from './fixture';

const empty = { wrongValue: 0, wrongUnit: 0, unreadable: 0, other: 0, total: 0 };
const flat = trendOf({ answers: 20, correct: 14 }, { answers: 20, correct: 14 });

function plan(over: Partial<PlanInput> = {}) {
  return actionPlan({
    answered: 50,
    accuracy: 0.8,
    firstTryAccuracy: 0.75,
    submissions: 60,
    hintsUsed: 0,
    skipped: 0,
    notReached: 0,
    medianTimeMs: 90_000,
    activeDays30: 12,
    mistakes: empty,
    difficulty: [],
    focus: [],
    lessons: [],
    revise: [],
    trend: flat,
    score: 80,
    teacherFocus: [],
    ...over,
  });
}

describe('displayName', () => {
  it('title-cases an all-lower-case name and leaves real capitals alone', () => {
    expect(displayName('hadi', 'bekdash')).toBe('Hadi Bekdash');
    expect(displayName('laya ', 'zalabia ')).toBe('Laya Zalabia');
    expect(displayName('McKenzie', 'de Silva')).toBe('McKenzie de Silva');
    expect(displayName('ışık', 'çelik')).toBe('Işık Çelik');
    expect(displayName('', '', 'sam@x.com')).toBe('sam');
  });
});

describe('progress score', () => {
  it('weights accuracy, first try, consistency and progress to 100', () => {
    const s = progressScore({ answered: 100, right: 100, firstTryRight: 100, activeDays30: 30, practised: 2, mastered: 2, inStartedLessons: 100 });
    expect(s.value).toBe(100);
    expect(s.parts.reduce((t, p) => t + p.weight, 0)).toBeCloseTo(1);
  });
  it('is 0 with no answers and rates nobody below the minimum', () => {
    expect(progressScore({ answered: 0, right: 0, firstTryRight: 0, activeDays30: 3, practised: 0, mastered: 0, inStartedLessons: 0 }).value).toBe(0);
    expect(scoreBand(95, MIN_ANSWERS_TO_RATE - 1).id).toBe('start');
  });
  it('bands at 85 / 70 / 50', () => {
    expect(scoreBand(85, 50).id).toBe('excellent');
    expect(scoreBand(84, 50).id).toBe('good');
    expect(scoreBand(70, 50).id).toBe('good');
    expect(scoreBand(69, 50).id).toBe('developing');
    expect(scoreBand(49, 50).id).toBe('support');
  });
});

describe('trend', () => {
  it('needs 5 answers in both windows and an 8-point move', () => {
    expect(trendOf({ answers: 20, correct: 16 }, { answers: 20, correct: 12 }).direction).toBe('up');
    expect(trendOf({ answers: 20, correct: 12 }, { answers: 20, correct: 16 }).direction).toBe('down');
    expect(trendOf({ answers: 20, correct: 15 }, { answers: 20, correct: 14 }).direction).toBe('flat');
    expect(trendOf({ answers: 20, correct: 15 }, { answers: 2, correct: 0 }).direction).toBe('new');
    expect(trendOf({ answers: 0, correct: 0 }, { answers: 20, correct: 14 }).direction).toBe('quiet');
  });
});

describe('streaks and calendar', () => {
  it('counts the current run through today or yesterday, and the longest run', () => {
    const days = ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-05', '2026-10-26', '2026-10-27'];
    expect(streaks(days, '2026-10-27')).toEqual({ current: 2, longest: 3 });
    expect(streaks(days, '2026-10-28')).toEqual({ current: 2, longest: 3 });
    expect(streaks(days, '2026-10-29')).toEqual({ current: 0, longest: 3 });
  });
  it('fills 84 days ending today with zeros', () => {
    const c = calendarDays({ '2026-10-27': 4 }, '2026-10-27');
    expect(c).toHaveLength(84);
    expect(c[83]).toEqual({ day: '2026-10-27', count: 4 });
    expect(c[0].day).toBe('2026-08-05');
  });
});

describe('strengths and focus', () => {
  const a = lesson({ topicId: 'a', name: 'A', attempted: 20, correct: 18 });
  const b = lesson({ topicId: 'b', name: 'B', attempted: 20, correct: 8 });
  const c = lesson({ topicId: 'c', name: 'C', attempted: 3, correct: 0 });
  it('needs 5 answers, never overlaps, and drops a weak "strength"', () => {
    const r = strengthsAndFocus([a, b, c]);
    expect(r.strengths.map((l) => l.name)).toEqual(['A']);
    expect(r.focus.map((l) => l.name)).toEqual(['B']);
    const weakOnly = strengthsAndFocus([lesson({ topicId: 'x', name: 'X', attempted: 10, correct: 3 }), b]);
    expect(weakOnly.strengths).toEqual([]);
  });
});

describe('action plan', () => {
  it('puts the teacher focus first, then at most PLAN_STEPS automatic steps', () => {
    const steps = plan({
      teacherFocus: [{ topicId: 't', name: 'Gravitation', href: '/practice/t' }],
      revise: [{ problemId: 'q', topicId: 't', lesson: 'G', number: 1, question: 'q', wrongTries: 2, stillWrong: true, lastAnswer: null, href: '/practice/t' }],
      focus: [lesson({ topicId: 'f', name: 'F', attempted: 20, correct: 8 })],
      mistakes: { wrongValue: 5, wrongUnit: 6, unreadable: 4, other: 0, total: 15 },
      activeDays30: 2,
      skipped: 5,
      notReached: 9,
      hintsUsed: 40,
    });
    expect(steps[0].source).toBe('teacher');
    expect(steps[0].detail).toContain('Gravitation');
    expect(steps.filter((s) => s.source === 'auto')).toHaveLength(PLAN_STEPS);
    expect(steps.slice(1).map((s) => s.id)).toEqual(['fix-wrong', 'revise-weakest', 'units', 'format']);
  });
  it('tells a new student to start', () => {
    expect(plan({ answered: 0 }).map((s) => s.id)).toEqual(['start']);
  });
  it('flags unit mistakes only when they are a real share of wrong answers', () => {
    expect(plan({ mistakes: { wrongValue: 40, wrongUnit: 3, unreadable: 0, other: 0, total: 43 } }).map((s) => s.id)).not.toContain('units');
    expect(plan({ mistakes: { wrongValue: 10, wrongUnit: 3, unreadable: 0, other: 0, total: 13 } }).map((s) => s.id)).toContain('units');
  });
  it('separates "step up" from "build up" on difficulty', () => {
    const easy = { level: 1, label: 'Easy', attempted: 20, correct: 18 };
    expect(plan({ difficulty: [easy] }).map((s) => s.id)).toContain('step-up');
    expect(plan({ difficulty: [easy, { level: 4, label: 'Challenging', attempted: 10, correct: 2 }] }).map((s) => s.id)).toContain('hard-low');
  });
  it('praises an excellent student with nothing to fix', () => {
    expect(plan({ score: 92 }).map((s) => s.id)).toEqual(['keep-going']);
  });
  it('spots retry-dependence, rushing and a dip', () => {
    expect(plan({ accuracy: 0.9, firstTryAccuracy: 0.5 }).map((s) => s.id)).toContain('first-try');
    expect(plan({ accuracy: 0.4, firstTryAccuracy: 0.35, medianTimeMs: 12_000 }).map((s) => s.id)).toContain('slow-down');
    expect(plan({ trend: trendOf({ answers: 20, correct: 8 }, { answers: 20, correct: 16 }) }).map((s) => s.id)).toContain('trend-down');
  });
});

describe('badges', () => {
  it('awards milestone, mastery, streak and skill badges only when earned', () => {
    const ids = badges({
      answered: 120,
      accuracy: 0.85,
      firstTryAccuracy: 0.8,
      mastered: 2,
      longestStreak: 5,
      activeDays30: 14,
      wrongUnit: 0,
      hardCorrect: 12,
      trend: trendOf({ answers: 20, correct: 18 }, { answers: 20, correct: 12 }),
    }).map((b) => b.id);
    expect(ids).toEqual(['answered', 'mastered', 'streak', 'sharp', 'first-try', 'units', 'climber', 'steady', 'improving']);
    expect(badges({ answered: 5, accuracy: 1, firstTryAccuracy: 1, mastered: 0, longestStreak: 1, activeDays30: 1, wrongUnit: 0, hardCorrect: 0, trend: flat })).toEqual([]);
  });
});

describe('note input', () => {
  it('trims, requires a body and a signature, and limits focus lessons', () => {
    const ok = parseNoteInput({ body: '  Well done \r\n', signature: ' Mr.   A ', focusTopicIds: ['11111111-1111-4111-8111-111111111111', '11111111-1111-4111-8111-111111111111'] });
    expect(ok).toEqual({ ok: true, value: { body: 'Well done', signature: 'Mr. A', focusTopicIds: ['11111111-1111-4111-8111-111111111111'] } });
    expect(parseNoteInput({ body: ' ', signature: 'x' }).ok).toBe(false);
    expect(parseNoteInput({ body: 'x', signature: '' }).ok).toBe(false);
    expect(parseNoteInput({ body: 'x'.repeat(4001), signature: 'x' }).ok).toBe(false);
    expect(parseNoteInput({ body: 'x', signature: 'x', focusTopicIds: ['not-a-uuid'] }).ok).toBe(false);
    const six = Array.from({ length: 6 }, (_, i) => `11111111-1111-4111-8111-11111111111${i}`);
    expect(parseNoteInput({ body: 'x', signature: 'x', focusTopicIds: six }).ok).toBe(false);
  });
});
