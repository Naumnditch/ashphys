import rough from 'roughjs';
import { flattenPath, type Pt } from '../handwriting/strokeFont';
import type { Rect } from '../types';

/**
 * Hand-drawn marks from rough.js, as polylines the ink layer can write on
 * (src/components/Handwritten.tsx). Every shape takes a fixed seed, so the
 * same shape comes out on every frame (Remotion renders frames
 * independently and in parallel).
 */

const generator = rough.generator();
type Drawable = ReturnType<typeof generator.line>;
const strokesOf = (d: Drawable): Pt[][] => generator.toPaths(d).flatMap((p) => flattenPath(p.d, 0.5));

/** A loose loop round a rect (two passes, like circling something with a marker). */
export const roughCircle = (r: Rect, seed: number) =>
  strokesOf(generator.ellipse(r[0] + r[2] / 2, r[1] + r[3] / 2, r[2] * 1.08, r[3] * 1.2, { seed, roughness: 1.2, bowing: 1 }));

export const roughBox = (r: Rect, seed: number) => strokesOf(generator.rectangle(r[0], r[1], r[2], r[3], { seed, roughness: 1.1, bowing: 1 }));

/** A ring of diameter d round (cx, cy) — the step-number badge. */
export const roughRing = (cx: number, cy: number, d: number, seed: number) => strokesOf(generator.ellipse(cx, cy, d, d * 0.93, { seed, roughness: 1.1, bowing: 1.5 }));

/** One stroke under (x0 → x1) at y, a little uphill; `double` adds a second, shorter one below. */
export function roughUnderline(x0: number, x1: number, y: number, seed: number, unit: number, double = false): Pt[][] {
  const opts = { roughness: 1.3, bowing: 2, disableMultiStroke: true };
  const lines = [strokesOf(generator.line(x0, y, x1, y - 3 * unit, { ...opts, seed }))];
  if (double) lines.push(strokesOf(generator.line(x0 + 14 * unit, y + 11 * unit, x1 - 10 * unit, y + 9 * unit, { ...opts, seed: seed + 7 })));
  return lines.flat();
}

/** A tick of size s centred on c. */
export function roughTick(c: Pt, s: number, seed: number): Pt[][] {
  const pts: Pt[] = [
    [c[0] - 0.42 * s, c[1] - 0.02 * s],
    [c[0] - 0.1 * s, c[1] + 0.34 * s],
    [c[0] + 0.55 * s, c[1] - 0.52 * s],
  ];
  return strokesOf(generator.linearPath(pts, { seed, roughness: 0.9, disableMultiStroke: true }));
}

/** A gently curved arrow from S to E with an open head. */
export function roughArrow(S: Pt, E: Pt, seed: number, unit: number): Pt[][] {
  const len = Math.hypot(E[0] - S[0], E[1] - S[1]) || 1;
  const nx = -(E[1] - S[1]) / len;
  const ny = (E[0] - S[0]) / len;
  const bend = 0.16 * len * (seed % 2 ? 1 : -1);
  const M: Pt = [(S[0] + E[0]) / 2 + nx * bend, (S[1] + E[1]) / 2 + ny * bend];
  const shaft = strokesOf(generator.curve([S, M, E], { seed, roughness: 0.8, disableMultiStroke: true }));
  const ang = Math.atan2(E[1] - (M[1] + E[1]) / 2, E[0] - (M[0] + E[0]) / 2);
  const hl = 26 * unit;
  const h1: Pt = [E[0] - hl * Math.cos(ang - 0.5), E[1] - hl * Math.sin(ang - 0.5)];
  const h2: Pt = [E[0] - hl * Math.cos(ang + 0.5), E[1] - hl * Math.sin(ang + 0.5)];
  return [...shaft, ...strokesOf(generator.linearPath([h1, E, h2], { seed: seed + 1, roughness: 0.6, disableMultiStroke: true }))];
}

/** Where an arrow from S towards rect r should stop: its edge, plus a gap. */
export function edgeToward(r: Rect, S: Pt, gap: number): Pt {
  const c: Pt = [r[0] + r[2] / 2, r[1] + r[3] / 2];
  const dx = S[0] - c[0];
  const dy = S[1] - c[1];
  const k = Math.min(Math.abs(r[2] / 2 / (dx || 1e-6)), Math.abs(r[3] / 2 / (dy || 1e-6)));
  const len = Math.hypot(dx, dy) || 1;
  return [c[0] + dx * k + (dx / len) * gap, c[1] + dy * k + (dy / len) * gap];
}
