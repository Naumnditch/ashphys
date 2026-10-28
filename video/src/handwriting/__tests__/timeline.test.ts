import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import type { HandwritingDoc, HwPoint, HwStroke } from '@site/lib/handwriting/types';
import { buildTimeline, stateAt } from '../timeline';
import { pageSlots, viewerPageOffsets } from '../viewerLayout';
import { renderSnapshots } from '@site/lib/handwriting/svg';

const line = (id: string, x0: number, y: number, len: number, color = '#2563eb', timed?: { t0: number; dt: number }): HwStroke => ({
  id,
  tool: 'pen',
  color,
  width: 1.5,
  opacity: 1,
  pressure: true,
  ...(timed ? { t0: timed.t0 } : {}),
  points: Array.from({ length: 11 }, (_, i) => (timed ? [x0 + (len * i) / 10, y, 0.5, i * timed.dt] : [x0 + (len * i) / 10, y, 0.5]) as HwPoint),
});
const doc = (...pages: HwStroke[][]): HandwritingDoc => ({ v: 1, pages: pages.map((strokes, i) => ({ id: `p${i}`, background: 'grid', strokes })) });

describe('replay timeline', () => {
  it('keeps the stored order and never overlaps strokes', () => {
    const tl = buildTimeline(doc([line('a', 0, 0, 100), line('b', 0, 40, 50), line('c', 300, 40, 10)]));
    expect(tl.strokes.map((s) => s.stroke.id)).toEqual(['a', 'b', 'c']);
    for (let i = 1; i < tl.strokes.length; i++) expect(tl.strokes[i].start).toBeGreaterThanOrEqual(tl.strokes[i - 1].end);
    expect(tl.source).toBe('synthesized');
  });

  it('synthesized: longer strokes take longer; a jump across the page pauses longer than the next letter', () => {
    const tl = buildTimeline(doc([line('a', 0, 0, 200), line('b', 205, 0, 20), line('c', 600, 300, 20)]));
    const [a, b, c] = tl.strokes;
    expect(a.end - a.start).toBeGreaterThan(b.end - b.start);
    expect(c.start - b.end).toBeGreaterThan(b.start - a.end);
  });

  it('fits the page into the time available with one global speed-up', () => {
    const strokes = Array.from({ length: 200 }, (_, i) => line(`s${i}`, (i % 20) * 30, Math.floor(i / 20) * 40, 25));
    const tl = buildTimeline(doc(strokes), { fitSeconds: 6 });
    expect(tl.duration).toBeCloseTo(6, 5);
    expect(tl.speedUp).toBeGreaterThan(1);
    expect(tl.naturalDuration / tl.speedUp).toBeCloseTo(6, 5);
  });

  it('never slows a short page below its natural pace', () => {
    const tl = buildTimeline(doc([line('a', 0, 0, 30)]), { fitSeconds: 20 });
    expect(tl.speedUp).toBe(1);
    expect(tl.duration).toBeLessThan(1);
  });

  it('real timestamps: keeps the pace inside strokes and compresses long pauses to the cap', () => {
    const tl = buildTimeline(
      doc([line('a', 0, 0, 100, '#000000', { t0: 1_000_000, dt: 20 }), line('b', 0, 40, 100, '#000000', { t0: 1_000_000 + 200 + 5000, dt: 30 }), line('c', 0, 80, 100, '#000000', { t0: 1_000_000 + 200 + 5000 + 300 + 100, dt: 10 })]),
      { pauseCompression: 0.4 }
    );
    expect(tl.source).toBe('timestamps');
    const [a, b, c] = tl.strokes;
    expect(a.end - a.start).toBeCloseTo(0.2, 6); // 10 × 20 ms
    expect(b.end - b.start).toBeCloseTo(0.3, 6);
    expect(b.start - a.end).toBeCloseTo(0.4, 6); // a 5 s pause compressed to 0.4 s
    expect(c.start - b.end).toBeCloseTo(0.1, 6); // a short real pause kept as is
    // Point times follow the recorded t, not arc length.
    expect(a.times[5] - a.times[0]).toBeCloseTo(0.1, 6);
  });

  it('mixed documents (old strokes without timing) still replay', () => {
    const tl = buildTimeline(doc([line('old', 0, 0, 100), line('new', 0, 40, 100, '#000000', { t0: 5, dt: 10 })]));
    expect(tl.source).toBe('mixed');
    expect(tl.strokes[1].start).toBeGreaterThan(tl.strokes[0].end);
  });

  it('highlight holds are added in output seconds after the fit', () => {
    const strokes = Array.from({ length: 50 }, (_, i) => line(`s${i}`, i * 10, 0, 8));
    const tl = buildTimeline(doc(strokes), { fitSeconds: 5, holdsAfter: { 9: 0.5 } });
    expect(tl.duration).toBeCloseTo(5, 5);
    const gap = tl.strokes[10].start - tl.strokes[9].end;
    expect(gap).toBeGreaterThanOrEqual(0.5);
  });

  it('state: strokes before t are complete, the active one grows point by point, the pen travels between strokes', () => {
    const tl = buildTimeline(doc([line('a', 0, 0, 100), line('b', 0, 100, 100)]));
    const [a, b] = tl.strokes;
    expect(stateAt(tl, -1).done).toBe(0);
    const mid = stateAt(tl, (a.start + a.end) / 2);
    expect(mid.done).toBe(0);
    expect(mid.active?.stroke.index).toBe(0);
    expect(mid.active!.points).toBeGreaterThan(1);
    expect(mid.active!.points).toBeLessThan(11);
    expect(mid.pen?.down).toBe(true);
    const between = stateAt(tl, (a.end + b.start) / 2);
    expect(between.done).toBe(1);
    expect(between.active).toBeNull();
    expect(between.pen?.down).toBe(false);
    const end = stateAt(tl, tl.duration + 1);
    expect(end.done).toBe(2);
    expect(end.active).toBeNull();
  });

  it('multiple pages replay in page order; empty pages are skipped in the viewer layout', () => {
    const d = doc([line('a', 0, 0, 50)], [], [line('c', 0, 0, 50)]);
    const tl = buildTimeline(d);
    expect(tl.strokes.map((s) => s.page)).toEqual([0, 2]);
    expect(pageSlots(d)).toEqual([0, null, 1]);
    const offsets = viewerPageOffsets(d, renderSnapshots(d));
    expect(offsets[1]).toBeNull();
    expect(offsets[2]![1]).toBeGreaterThan(offsets[0]![1]);
  });
});

describe('the showcase strokes', () => {
  const dir = path.resolve(__dirname, '../../../updates/handwritten-worked-solutions/strokes');
  for (const key of ['A', 'B']) {
    it(`${key}: every stored stroke is replayed exactly once, in stored order, and the replay ends on the stored page`, () => {
      const file = JSON.parse(readFileSync(path.join(dir, `${key}.json`), 'utf8'));
      const tl = buildTimeline(file.doc, { fitSeconds: 10 });
      const stored = file.doc.pages.flatMap((p: { strokes: HwStroke[] }) => p.strokes.map((s) => s.id));
      expect(tl.strokes.map((s) => s.stroke.id)).toEqual(stored);
      expect(new Set(stored).size).toBe(stored.length);
      expect(stateAt(tl, tl.duration).done).toBe(stored.length);
      // The replayed points are the stored points, untouched.
      expect(tl.strokes.map((s) => s.stroke)).toEqual(file.doc.pages.flatMap((p: { strokes: HwStroke[] }) => p.strokes));
    });
  }
});
