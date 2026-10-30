import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';
import { flattenPath, layoutLine, plan, polyLength, truncate, writtenAt, type StrokeFont } from '../strokeFont';
import { roughCircle, roughTick } from '../../components/RoughMark';

const require = createRequire(import.meta.url);
const FONT = JSON.parse(readFileSync(require.resolve('vara/fonts/Shadows-Into-Light/shadows-into-light.json'), 'utf8')) as StrokeFont;

describe('flattenPath', () => {
  it('follows relative and absolute moves, lines, cubics and closes', () => {
    const [line] = flattenPath('M10 10 L20 10 l0 10');
    expect(line).toEqual([
      [10, 10],
      [20, 10],
      [20, 20],
    ]);
    const [closed] = flattenPath('m0,0 l10,0 l0,10 z');
    expect(closed[closed.length - 1]).toEqual([0, 0]);
    // A cubic ends exactly at its end point, through points in between.
    const [curve] = flattenPath('M0 0 C0 10 10 10 10 0');
    expect(curve[curve.length - 1]).toEqual([10, 0]);
    expect(Math.max(...curve.map((p) => p[1]))).toBeCloseTo(7.5, 1);
    expect(flattenPath('M0 0 L1 0 M5 5 L6 5')).toHaveLength(2);
  });
});

describe('layoutLine', () => {
  it('lays text out left to right at the requested cap height, baseline at 0', () => {
    const one = layoutLine(FONT, 'H', 50);
    expect(one.bottom).toBeCloseTo(0, 5);
    expect(one.top).toBeCloseTo(-50, 5);
    const word = layoutLine(FONT, 'Sam T.', 56);
    expect(word.width).toBeGreaterThan(layoutLine(FONT, 'Sam', 56).width);
    expect(word.strokes.length).toBeGreaterThan(4);
    for (const s of word.strokes) for (const [x] of s) expect(x).toBeGreaterThanOrEqual(-0.01);
  });

  it('draws smaller raised runs for powers, the hand-drawn π, and falls back for missing glyphs', () => {
    const power = layoutLine(FONT, [{ text: '10' }, { text: '23', scale: 0.6, rise: 0.6 }], 40);
    expect(power.top).toBeLessThan(layoutLine(FONT, '10', 40).top);
    expect(layoutLine(FONT, 'π', 40).strokes).toHaveLength(3);
    expect(layoutLine(FONT, '×', 40).strokes).toEqual(layoutLine(FONT, 'x', 40).strokes);
    expect(layoutLine(FONT, '✓', 40).strokes).toEqual(layoutLine(FONT, '?', 40).strokes);
  });

  it('is deterministic', () => {
    expect(layoutLine(FONT, 'Withdraw anytime', 58)).toEqual(layoutLine(FONT, 'Withdraw anytime', 58));
  });
});

describe('writing on', () => {
  const strokes = layoutLine(FONT, 'Add your name', 54).strokes;
  const p = plan(strokes);

  it('writes nothing at 0, everything at 1, and more as progress grows', () => {
    expect(writtenAt(p, 0).strokes).toHaveLength(0);
    const done = writtenAt(p, 1);
    expect(done.strokes).toEqual(strokes);
    expect(done.tip).toBeNull();
    let last = 0;
    for (let k = 1; k <= 20; k++) {
      const ink = writtenAt(p, k / 20).strokes.reduce((n, s) => n + polyLength(s), 0);
      expect(ink).toBeGreaterThanOrEqual(last - 1e-6);
      last = ink;
    }
  });

  it('puts the pen tip at the end of the line being written', () => {
    const mid = writtenAt(p, 0.5);
    if (mid.tip) expect(mid.strokes[mid.strokes.length - 1].at(-1)).toEqual(mid.tip);
    const t = truncate(
      [
        [0, 0],
        [10, 0],
        [10, 10],
      ],
      15
    );
    expect(t.tip).toEqual([10, 5]);
  });
});

describe('rough marks', () => {
  it('draw the same shape for the same seed (frames render independently)', () => {
    expect(roughCircle([100, 100, 200, 40], 7)).toEqual(roughCircle([100, 100, 200, 40], 7));
    expect(roughCircle([100, 100, 200, 40], 7)).not.toEqual(roughCircle([100, 100, 200, 40], 8));
    expect(roughTick([50, 50], 60, 3)).toEqual(roughTick([50, 50], 60, 3));
  });
});
