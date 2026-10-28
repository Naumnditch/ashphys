/**
 * Per-point timestamps (2026-10-28): strokes drawn from now on carry
 * [x, y, pressure, t] points (t = ms since the stroke's first point) and a
 * stroke start time t0, so they can be replayed at the writer's pace.
 * Strokes stored before have three numbers per point and no t0; both must
 * keep loading, and what students see (the SVG) must not change.
 */

import { describe, expect, it } from 'vitest';
import { parseHandwritingDoc } from '@/lib/handwriting/schema';
import { renderSnapshots } from '@/lib/handwriting/svg';
import { eraseFromStroke, translateStroke } from '@/lib/handwriting/geometry';
import type { HandwritingDoc, HwPoint, HwStroke } from '@/lib/handwriting/types';

const legacyStroke = (): HwStroke => ({
  id: 'legacy1',
  tool: 'pen',
  color: '#2563eb',
  width: 1.5,
  opacity: 1,
  pressure: true,
  points: [
    [10, 10, 0.31],
    [14.04, 12.06, 0.4],
    [20, 15, 0.45],
    [30, 18, 0.5],
  ],
});

const timedStroke = (): HwStroke => ({
  ...legacyStroke(),
  id: 'timed1',
  t0: 1793178710535,
  points: legacyStroke().points.map(([x, y, p], i) => [x, y, p, i * 8.4] as HwPoint),
});

const doc = (strokes: HwStroke[]): HandwritingDoc => ({ v: 1, pages: [{ id: 'p1', background: 'grid', strokes }] });

function parsed(input: unknown): HandwritingDoc {
  const r = parseHandwritingDoc(input);
  if (!r.ok) throw new Error(r.error);
  return r.doc;
}

describe('handwriting timestamps', () => {
  it('loads strokes stored before timestamps exactly as before (no t, no t0)', () => {
    const out = parsed(doc([legacyStroke()]));
    const s = out.pages[0].strokes[0];
    expect(s).not.toHaveProperty('t0');
    expect(s.points).toEqual([
      [10, 10, 0.31],
      [14, 12.1, 0.4],
      [20, 15, 0.45],
      [30, 18, 0.5],
    ]);
    expect(s.points.every((q) => q.length === 3)).toBe(true);
  });

  it('keeps per-point t (whole ms) and the stroke start time', () => {
    const s = parsed(doc([timedStroke()])).pages[0].strokes[0];
    expect(s.t0).toBe(1793178710535);
    expect(s.points.map((q) => q[3])).toEqual([0, 8, 17, 25]);
  });

  it('drops timing from a stroke where only some points have it, and never fails the save for it', () => {
    const mixed = timedStroke();
    mixed.points[2] = [20, 15, 0.45];
    const s = parsed(doc([mixed])).pages[0].strokes[0];
    expect(s.points.every((q) => q.length === 3)).toBe(true);
  });

  it('makes t non-decreasing', () => {
    const s = timedStroke();
    s.points[2] = [20, 15, 0.45, 3];
    expect(parsed(doc([s])).pages[0].strokes[0].points.map((q) => q[3])).toEqual([0, 8, 8, 25]);
  });

  it('rejects nonsense times', () => {
    const s = timedStroke();
    s.points[1] = [14, 12, 0.4, -5];
    expect(parseHandwritingDoc(doc([s])).ok).toBe(false);
    const t = timedStroke();
    t.points[1] = [14, 12, 0.4, Number.NaN];
    expect(parseHandwritingDoc(doc([t])).ok).toBe(false);
  });

  it('students see exactly the same SVG with or without timestamps', () => {
    const withT = renderSnapshots(parsed(doc([timedStroke()])));
    const withoutT = renderSnapshots(parsed(doc([{ ...legacyStroke(), id: 'timed1' }])));
    expect(withT).toEqual(withoutT);
  });

  it('moving a stroke (lasso) keeps its timing', () => {
    const moved = translateStroke(parsed(doc([timedStroke()])).pages[0].strokes[0], 5, -2);
    expect(moved.t0).toBe(1793178710535);
    expect(moved.points[3]).toEqual([35, 16, 0.5, 25]);
    expect(translateStroke(legacyStroke(), 1, 1).points[0]).toEqual([11, 11, 0.31]);
  });

  it('pieces left by the pixel eraser keep (interpolated) timing relative to the original start', () => {
    const s = parsed(doc([timedStroke()])).pages[0].strokes[0];
    let n = 0;
    const pieces = eraseFromStroke(s, [20, 0], [20, 30], 2, () => `piece${n++}`);
    expect(pieces.length).toBe(2);
    for (const piece of pieces) {
      expect(piece.t0).toBe(s.t0);
      const ts = piece.points.map((q) => q[3]);
      expect(ts.every((t) => typeof t === 'number')).toBe(true);
      expect(ts).toEqual([...ts].sort((a, b) => (a as number) - (b as number)));
    }
  });
});
