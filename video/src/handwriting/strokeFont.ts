/**
 * Single-stroke handwriting, drawn as polylines: the notes the video writes
 * over the footage, and the demo student's pen input in the capture.
 *
 * The glyphs are the "Shadows Into Light" stroke font that ships with Vara.js
 * (node_modules/vara/fonts/Shadows-Into-Light, font: OFL; Vara: MIT). Only the
 * font JSON is used: Vara's own runtime animates with requestAnimationFrame,
 * which Remotion cannot render frame by frame. Everything here is pure and
 * deterministic (no DOM): paths are flattened to points, so layout, stroke
 * lengths and the pen position at any moment are plain arithmetic.
 *
 * The font is passed in (webpack imports the JSON for the video; the capture
 * script reads it from disk), so this file runs in both.
 */

export type Pt = [number, number];

export interface StrokeFont {
  /** Glyphs by char code: paths start at their own origin, offset by (mx, -my). */
  c: Record<string, { paths: { mx: number; my: number; d: string }[]; w: number }>;
  p: { space: number; lh: number };
}

/** One run of a line: plain text, or a smaller raised run for powers (10²³ → "10" + { text: "23", scale: 0.6, rise: 0.55 }). */
export interface Run {
  text: string;
  /** Relative to the line's size. */
  scale?: number;
  /** Baseline shift up, in cap heights of the line. */
  rise?: number;
}

export interface LaidLine {
  /** In px; x from 0, baseline at y = 0 (y grows downwards, so letters sit at negative y). */
  strokes: Pt[][];
  width: number;
  /** Highest and lowest y of any point (top < 0 < bottom for descenders). */
  top: number;
  bottom: number;
}

/* ------------------------------------------------------------------ paths */

/** Flatten SVG path data (M L H V C Q Z, absolute or relative) to polylines, one per subpath. */
export function flattenPath(d: string, tolerance = 0.75): Pt[][] {
  const tokens = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) ?? [];
  const out: Pt[][] = [];
  let cur: Pt[] = [];
  let x = 0;
  let y = 0;
  let sx = 0;
  let sy = 0;
  let cmd = '';
  let i = 0;
  const num = () => Number(tokens[i++]);
  const hasNum = () => i < tokens.length && !/^[a-zA-Z]$/.test(tokens[i]);
  const start = (px: number, py: number) => {
    if (cur.length > 1) out.push(cur);
    cur = [[px, py]];
  };
  const cubic = (x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) => {
    const chord = Math.hypot(x1 - x, y1 - y) + Math.hypot(x2 - x1, y2 - y1) + Math.hypot(x3 - x2, y3 - y2);
    const n = Math.max(2, Math.ceil(chord / (tolerance * 4)));
    for (let k = 1; k <= n; k++) {
      const t = k / n;
      const u = 1 - t;
      cur.push([
        u * u * u * x + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3,
        u * u * u * y + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3,
      ]);
    }
    x = x3;
    y = y3;
  };
  while (i < tokens.length) {
    if (!hasNum()) cmd = tokens[i++];
    const rel = cmd === cmd.toLowerCase();
    const ox = rel ? x : 0;
    const oy = rel ? y : 0;
    switch (cmd.toLowerCase()) {
      case 'm': {
        x = ox + num();
        y = oy + num();
        sx = x;
        sy = y;
        start(x, y);
        cmd = rel ? 'l' : 'L'; // further pairs are line-tos
        break;
      }
      case 'l':
        x = ox + num();
        y = oy + num();
        cur.push([x, y]);
        break;
      case 'h':
        x = ox + num();
        cur.push([x, y]);
        break;
      case 'v':
        y = oy + num();
        cur.push([x, y]);
        break;
      case 'c': {
        const a = [num(), num(), num(), num(), num(), num()];
        cubic(ox + a[0], oy + a[1], ox + a[2], oy + a[3], ox + a[4], oy + a[5]);
        break;
      }
      case 'q': {
        const a = [num(), num(), num(), num()];
        const qx = ox + a[0];
        const qy = oy + a[1];
        const ex = ox + a[2];
        const ey = oy + a[3];
        cubic(x + (2 / 3) * (qx - x), y + (2 / 3) * (qy - y), ex + (2 / 3) * (qx - ex), ey + (2 / 3) * (qy - ey), ex, ey);
        break;
      }
      case 'z':
        x = sx;
        y = sy;
        cur.push([x, y]);
        break;
      default:
        throw new Error(`flattenPath: unsupported command "${cmd}"`);
    }
  }
  if (cur.length > 1) out.push(cur);
  return out;
}

export const polyLength = (p: Pt[]) => {
  let n = 0;
  for (let k = 1; k < p.length; k++) n += Math.hypot(p[k][0] - p[k - 1][0], p[k][1] - p[k - 1][1]);
  return n;
};

/** The first `length` px of a polyline (and the point where it ends). */
export function truncate(p: Pt[], length: number): { points: Pt[]; tip: Pt } {
  if (length <= 0) return { points: [p[0]], tip: p[0] };
  const points: Pt[] = [p[0]];
  let left = length;
  for (let k = 1; k < p.length; k++) {
    const seg = Math.hypot(p[k][0] - p[k - 1][0], p[k][1] - p[k - 1][1]);
    if (seg >= left) {
      const t = seg === 0 ? 1 : left / seg;
      const tip: Pt = [p[k - 1][0] + (p[k][0] - p[k - 1][0]) * t, p[k - 1][1] + (p[k][1] - p[k - 1][1]) * t];
      points.push(tip);
      return { points, tip };
    }
    left -= seg;
    points.push(p[k]);
  }
  return { points, tip: p[p.length - 1] };
}

/* ------------------------------------------------------------------ glyphs */

interface Glyph {
  strokes: Pt[][];
  x0: number;
  x1: number;
}

const glyphCache = new WeakMap<StrokeFont, Map<string, Glyph | null>>();
const metricsCache = new WeakMap<StrokeFont, { baseline: number; cap: number }>();

/**
 * Glyphs the font lacks, drawn here in the same hand: points in cap heights,
 * baseline at y = 0 (scaled to font units on use).
 */
const EXTRA: Record<string, Pt[][]> = {
  π: [
    [[0.0, -0.58], [0.2, -0.62], [0.5, -0.64], [0.78, -0.65], [0.95, -0.68]],
    [[0.3, -0.63], [0.29, -0.42], [0.25, -0.2], [0.17, 0.0]],
    [[0.66, -0.64], [0.65, -0.4], [0.66, -0.16], [0.71, -0.02], [0.8, 0.0], [0.88, -0.05]],
  ],
};

/** One round of corner cutting (keeps the end points): turns a few points into a smooth pen line. */
function chaikin(p: Pt[]): Pt[] {
  const out: Pt[] = [p[0]];
  for (let k = 0; k + 1 < p.length; k++) {
    const [a, b] = [p[k], p[k + 1]];
    out.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
  }
  out.push(p[p.length - 1]);
  return out;
}

function glyph(font: StrokeFont, ch: string): Glyph | null {
  let cache = glyphCache.get(font);
  if (!cache) glyphCache.set(font, (cache = new Map()));
  if (cache.has(ch)) return cache.get(ch)!;
  const g = font.c[String(ch.charCodeAt(0))];
  let out: Glyph | null = null;
  if (EXTRA[ch]) {
    const { baseline, cap } = metrics(font);
    const strokes = EXTRA[ch].map((s) => chaikin(chaikin(s)).map(([px, py]): Pt => [px * cap, baseline + py * cap]));
    const xs = strokes.flat().map((p) => p[0]);
    out = { strokes, x0: Math.min(...xs), x1: Math.max(...xs) };
  } else if (g) {
    const strokes = g.paths.flatMap((p) => flattenPath(p.d).map((s) => s.map(([px, py]): Pt => [px + p.mx, py - p.my])));
    const xs = strokes.flat().map((p) => p[0]);
    out = { strokes, x0: Math.min(...xs), x1: Math.max(...xs) };
  }
  cache.set(ch, out);
  return out;
}

/** Baseline = bottom of "H"; cap height = its height (font units). */
function metrics(font: StrokeFont) {
  let m = metricsCache.get(font);
  if (!m) {
    const ys = glyph(font, 'H')!.strokes.flat().map((p) => p[1]);
    m = { baseline: Math.max(...ys), cap: Math.max(...ys) - Math.min(...ys) };
    metricsCache.set(font, m);
  }
  return m;
}

/** Characters the font has no glyph for, drawn the nearest way it can. */
const SUBSTITUTE: Record<string, string> = { '×': 'x', '−': '-', '–': '-', '—': '-', '‘': "'", '’': "'", '“': '"', '”': '"', '…': '...' };

/**
 * Lay out one line of handwriting at `size` px cap height. Letters sit edge
 * to edge like Vara's layout, plus a gap (`letterSpacing` × the font's space)
 * so the strokes don't touch; glyphs narrower than `minWidth` × size are centred
 * in that width.
 */
export function layoutLine(font: StrokeFont, runs: Run[] | string, size: number, { letterSpacing = 0.3, minWidth = 0.32 } = {}): LaidLine {
  const { baseline, cap } = metrics(font);
  const list = typeof runs === 'string' ? [{ text: runs }] : runs;
  const strokes: Pt[][] = [];
  let pen = 0;
  for (const run of list) {
    const k = (size * (run.scale ?? 1)) / cap;
    const rise = (run.rise ?? 0) * size;
    const gap = letterSpacing * font.p.space * k;
    for (const raw of run.text) {
      const ch = SUBSTITUTE[raw] ?? raw;
      if (ch === ' ') {
        pen += font.p.space * k;
        continue;
      }
      const g = glyph(font, ch) ?? glyph(font, '?')!;
      // Narrow glyphs (1, l, i, .) get a minimum width and sit in its middle, as in Vara.
      const w = (g.x1 - g.x0) * k;
      const box = Math.max(w, minWidth * size * (run.scale ?? 1));
      const left = pen + (box - w) / 2;
      for (const s of g.strokes) strokes.push(s.map(([gx, gy]): Pt => [left + (gx - g.x0) * k, (gy - baseline) * k - rise]));
      pen += box + gap;
    }
  }
  const ys = strokes.flat().map((p) => p[1]);
  return { strokes, width: Math.max(0, pen), top: ys.length ? Math.min(...ys) : -size, bottom: ys.length ? Math.max(...ys) : 0 };
}

/* ------------------------------------------------------------------ writing order and timing */

export interface WritingPlan {
  strokes: Pt[][];
  lengths: number[];
  /** Pen-down length plus the travel between strokes (counted at `liftCost`), px. */
  total: number;
  /** Where each stroke starts on the [0, total] axis. */
  starts: number[];
}

/** Strokes in writing order with the pen-up travel between them (a lift costs a fraction of the distance). */
export function plan(strokes: Pt[][], liftCost = 0.35, minLift = 6): WritingPlan {
  const lengths = strokes.map(polyLength);
  const starts: number[] = [];
  let at = 0;
  strokes.forEach((s, k) => {
    if (k > 0) {
      const prev = strokes[k - 1][strokes[k - 1].length - 1];
      at += Math.max(minLift, Math.hypot(s[0][0] - prev[0], s[0][1] - prev[1]) * liftCost);
    }
    starts.push(at);
    at += lengths[k];
  });
  return { strokes, lengths, total: at, starts };
}

/** What is on the page at `progress` (0–1) of the plan: finished strokes, the one in progress, and the pen tip (null when the pen is up). */
export function writtenAt(p: WritingPlan, progress: number): { strokes: Pt[][]; tip: Pt | null } {
  const at = Math.max(0, Math.min(1, progress)) * p.total;
  const out: Pt[][] = [];
  let tip: Pt | null = null;
  for (let k = 0; k < p.strokes.length; k++) {
    const into = at - p.starts[k];
    if (into <= 0) break;
    if (into >= p.lengths[k]) {
      out.push(p.strokes[k]);
      continue;
    }
    const t = truncate(p.strokes[k], into);
    out.push(t.points);
    tip = t.tip;
  }
  return { strokes: out, tip: progress >= 1 ? null : tip };
}

export const polylineD = (pts: Pt[]) =>
  pts.length === 1 ? `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}l0.01 0` : `M${pts.map((q) => `${q[0].toFixed(2)} ${q[1].toFixed(2)}`).join('L')}`;
