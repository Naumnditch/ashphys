/**
 * Handwriting ("ink") for teacher notes: what the pen pad records, how it is
 * validated, and how it is drawn — as SVG on the page and in the PDF.
 *
 * Ink is stored as stroke data (points with pen pressure), never as an image
 * or markup the browser sent, so it stays sharp at any zoom, small to store,
 * and nothing a client posts is ever rendered as-is: the server re-validates
 * every number and the SVG is generated here. Client-safe (no server imports).
 *
 * Strokes are turned into filled pen outlines by perfect-freehand, so a
 * stylus's pressure gives real thick/thin handwriting; mouse and finger
 * strokes get simulated pressure from speed.
 */

import { getStroke } from 'perfect-freehand';

export const INK_COLORS = {
  blue: '#1e3a8a',
  black: '#111827',
  red: '#b91c1c',
  green: '#047857',
} as const;
export type InkColor = keyof typeof INK_COLORS;

export interface InkStroke {
  /** Colour key (never a raw CSS value). */
  c: InkColor;
  /** Base pen width in pad units. */
  s: number;
  /** True when drawn with a stylus (real pressure). */
  pen: boolean;
  /** Flat [x, y, pressure, x, y, pressure, …] in pad units, pressure 0–1. */
  p: number[];
}

export interface Ink {
  v: 1;
  /** The pad's size in its own units (the drawing is scaled from this). */
  w: number;
  h: number;
  strokes: InkStroke[];
}

/** Pad sizes: a lined page for the note, a strip for the signature. */
export const NOTE_PAD = { w: 1000, h: 560 } as const;
export const SIGNATURE_PAD = { w: 600, h: 200 } as const;

export const MAX_STROKES = 1500;
export const MAX_POINTS = 30_000;
export const PEN_SIZES = [4, 6, 9] as const;

const r1 = (n: number) => Math.round(n * 10) / 10;
const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Validates ink from a request and normalises it (rounded, clamped to the
 * pad). Returns null for "no ink" (missing or empty), an error string for
 * anything malformed.
 */
export function parseInk(raw: unknown, pad: { w: number; h: number }): { ok: true; value: Ink | null } | { ok: false; error: string } {
  if (raw === undefined || raw === null) return { ok: true, value: null };
  const o = raw as Record<string, unknown>;
  if (typeof o !== 'object' || !Array.isArray(o.strokes)) return { ok: false, error: 'The handwriting could not be read.' };
  if (o.w !== pad.w || o.h !== pad.h) return { ok: false, error: 'The handwriting pad size is not recognised.' };
  if (o.strokes.length > MAX_STROKES) return { ok: false, error: 'The handwriting has too many strokes — clear some and try again.' };
  let points = 0;
  const strokes: InkStroke[] = [];
  for (const s of o.strokes as unknown[]) {
    const st = s as Record<string, unknown>;
    if (!st || typeof st !== 'object' || !Array.isArray(st.p)) return { ok: false, error: 'The handwriting could not be read.' };
    const c = typeof st.c === 'string' && st.c in INK_COLORS ? (st.c as InkColor) : null;
    const size = typeof st.s === 'number' && Number.isFinite(st.s) ? Math.min(16, Math.max(1, st.s)) : null;
    if (!c || size === null || st.p.length % 3 !== 0 || st.p.length === 0) return { ok: false, error: 'The handwriting could not be read.' };
    const p: number[] = [];
    for (let i = 0; i < st.p.length; i += 3) {
      const [x, y, pr] = [st.p[i], st.p[i + 1], st.p[i + 2]];
      if (typeof x !== 'number' || typeof y !== 'number' || typeof pr !== 'number' || ![x, y, pr].every(Number.isFinite)) {
        return { ok: false, error: 'The handwriting could not be read.' };
      }
      p.push(r1(Math.min(pad.w, Math.max(0, x))), r1(Math.min(pad.h, Math.max(0, y))), r2(Math.min(1, Math.max(0, pr))));
    }
    points += p.length / 3;
    if (points > MAX_POINTS) return { ok: false, error: 'The handwriting is too long — use a second note for the rest.' };
    strokes.push({ c, s: size, pen: st.pen === true, p });
  }
  if (!strokes.length) return { ok: true, value: null };
  return { ok: true, value: { v: 1, w: pad.w, h: pad.h, strokes } };
}

export function isInk(v: unknown): v is Ink {
  const o = v as Ink | null;
  return !!o && typeof o === 'object' && Array.isArray(o.strokes) && o.strokes.length > 0 && typeof o.w === 'number' && typeof o.h === 'number';
}

function outline(st: InkStroke): number[][] {
  const pts: number[][] = [];
  for (let i = 0; i < st.p.length; i += 3) pts.push([st.p[i], st.p[i + 1], st.pen ? st.p[i + 2] : 0.5]);
  return getStroke(pts, {
    size: st.s,
    thinning: st.pen ? 0.65 : 0.5,
    smoothing: 0.5,
    streamline: 0.45,
    simulatePressure: !st.pen,
    start: { taper: 0, cap: true },
    end: { taper: 0, cap: true },
    last: true,
  });
}

/** perfect-freehand outline → a smooth closed SVG path (quadratic midpoints). */
export function outlineToPath(points: number[][]): string {
  if (!points.length) return '';
  if (points.length < 3) {
    const [x, y] = points[0];
    return `M ${r1(x)} ${r1(y)} Z`;
  }
  const mid = (a: number[], b: number[]) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = `M ${r1(points[0][0])} ${r1(points[0][1])} Q`;
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    const m = mid(a, b);
    d += ` ${r1(a[0])} ${r1(a[1])} ${r1(m[0])} ${r1(m[1])}`;
  }
  return `${d} Z`;
}

export interface InkPath {
  d: string;
  fill: string;
}

export function inkPaths(ink: Ink): InkPath[] {
  return ink.strokes.map((st) => ({ d: outlineToPath(outline(st)), fill: INK_COLORS[st.c] }));
}

/** Bounding box of what was drawn, padded, clamped to the pad. */
export function inkBox(ink: Ink, pad = 14): { x: number; y: number; w: number; h: number } {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const st of ink.strokes) {
    const half = st.s;
    for (let i = 0; i < st.p.length; i += 3) {
      minX = Math.min(minX, st.p[i] - half);
      maxX = Math.max(maxX, st.p[i] + half);
      minY = Math.min(minY, st.p[i + 1] - half);
      maxY = Math.max(maxY, st.p[i + 1] + half);
    }
  }
  if (!Number.isFinite(minX)) return { x: 0, y: 0, w: ink.w, h: ink.h };
  const x = Math.max(0, minX - pad);
  const y = Math.max(0, minY - pad);
  return { x, y, w: Math.min(ink.w, maxX + pad) - x, h: Math.min(ink.h, maxY + pad) - y };
}

/**
 * A standalone SVG string of the ink, cropped to what was drawn (for the PDF
 * and anywhere markup is needed). Coordinates are generated here only.
 */
export function inkSvg(ink: Ink): { svg: string; box: ReturnType<typeof inkBox> } {
  const box = inkBox(ink);
  const paths = inkPaths(ink)
    .map((p) => `<path d="${p.d}" fill="${p.fill}"/>`)
    .join('');
  return {
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${r1(box.x)} ${r1(box.y)} ${r1(box.w)} ${r1(box.h)}" width="${r1(box.w)}" height="${r1(box.h)}">${paths}</svg>`,
    box,
  };
}

export function inkPointCount(ink: Ink | null): number {
  return ink ? ink.strokes.reduce((n, s) => n + s.p.length / 3, 0) : 0;
}
