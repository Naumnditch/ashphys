import { describe, expect, it } from 'vitest';
import { resolveLastStoppedQuestion } from '@/lib/practice/lastStopped';

const set = (...answered: boolean[]) => answered.map((a, i) => ({ id: `q${i + 1}`, answered: a }));

describe('resolveLastStoppedQuestion', () => {
  it('with no stored position, returns the first unanswered question', () => {
    expect(resolveLastStoppedQuestion(set(true, true, false, false))).toBe('q3');
    expect(resolveLastStoppedQuestion(set(false, false, false))).toBe('q1');
    // Not just the first gap after the answered run.
    expect(resolveLastStoppedQuestion(set(true, false, true, false))).toBe('q2');
  });

  it('with every question answered, returns the last question', () => {
    expect(resolveLastStoppedQuestion(set(true, true, true))).toBe('q3');
  });

  it('prefers the question on screen, then the last one answered', () => {
    const qs = set(true, true, false);
    expect(resolveLastStoppedQuestion(qs, { viewedId: 'q1', lastAnsweredId: 'q2' })).toBe('q1');
    expect(resolveLastStoppedQuestion(qs, { lastAnsweredId: 'q2' })).toBe('q2');
  });

  it('ignores a stored id that is not in this set (another bank, a deleted question)', () => {
    const qs = set(true, false);
    expect(resolveLastStoppedQuestion(qs, { viewedId: 'gone', lastAnsweredId: 'other-bank' })).toBe('q2');
    expect(resolveLastStoppedQuestion(set(true, true), { lastAnsweredId: 'other-bank' })).toBe('q2');
  });

  it('returns null for an empty set', () => {
    expect(resolveLastStoppedQuestion([], { viewedId: 'q1' })).toBeNull();
  });
});
