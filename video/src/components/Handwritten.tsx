import shadowsIntoLight from 'vara/fonts/Shadows-Into-Light/shadows-into-light.json';
import { layoutLine, plan, polylineD, writtenAt, type Pt, type StrokeFont } from '../handwriting/strokeFont';

/**
 * Handwriting in the video: text laid out in the "Shadows Into Light" stroke
 * font (via src/handwriting/strokeFont.ts — Vara.js's font JSON only, not its
 * runtime) and an ink layer that writes any set of strokes on, stroke by
 * stroke, with a pen-tip dot leading the line. Pure function of `progress`,
 * so any frame renders on its own.
 */

export const HANDWRITING = shadowsIntoLight as unknown as StrokeFont;

/** Lines of handwriting (split on "\n") at `size` px cap height, top-left at (x, top). */
export function handwrittenText(text: string, size: number) {
  const lines = text.split('\n').map((l) => layoutLine(HANDWRITING, l, size));
  const gap = size * 1.5;
  const width = Math.max(...lines.map((l) => l.width));
  const height = (lines.length - 1) * gap + lines[lines.length - 1].bottom - lines[0].top;
  const at = (x: number, top: number): Pt[][] => lines.flatMap((l, k) => l.strokes.map((s) => s.map(([sx, sy]): Pt => [x + sx, top - lines[0].top + k * gap + sy])));
  return { width, height, at };
}

/** One line, centred on (cx, cy) — e.g. a digit in a circle. */
export function centredLine(text: string, size: number, cx: number, cy: number): Pt[][] {
  const l = layoutLine(HANDWRITING, text, size);
  return l.strokes.map((s) => s.map(([sx, sy]): Pt => [cx - l.width / 2 + sx, cy + size / 2 + sy]));
}

/** One line with its baseline at y, starting at x. */
export function lineAt(text: string, size: number, x: number, y: number): { strokes: Pt[][]; width: number } {
  const l = layoutLine(HANDWRITING, text, size);
  return { strokes: l.strokes.map((s) => s.map(([sx, sy]): Pt => [x + sx, y + sy])), width: l.width };
}

/** Strokes written on up to `progress` (0–1): white halo underneath for legibility over busy UI, the ink, and the pen tip. */
export function Ink({ strokes, progress, color, width, halo }: { strokes: Pt[][]; progress: number; color: string; width: number; halo: number }) {
  const written = writtenAt(plan(strokes), progress);
  const paths = written.strokes.map((s, k) => <path key={k} d={polylineD(s)} />);
  return (
    <>
      {halo > 0 && (
        <g fill="none" stroke="#ffffff" strokeOpacity={0.88} strokeWidth={width + halo} strokeLinecap="round" strokeLinejoin="round">
          {paths}
        </g>
      )}
      <g fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round">
        {paths}
      </g>
      {written.tip && <circle cx={written.tip[0]} cy={written.tip[1]} r={width * 0.95} fill={color} stroke="#fff" strokeWidth={Math.max(1, halo * 0.2)} />}
    </>
  );
}

/** How long writing these strokes takes at a natural pace (s): length-based, clamped. */
export function writingSeconds(strokes: Pt[][], pxPerSecond: number, min: number, max: number) {
  return Math.min(max, Math.max(min, plan(strokes).total / pxPerSecond));
}
