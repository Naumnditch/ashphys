/**
 * Stroke geometry shared by the editor (canvas), the server (SVG snapshots)
 * and the tests: freehand outlines via perfect-freehand, shape paths, bounds,
 * hit-testing, the pixel eraser's stroke splitting and lasso selection.
 * Pure functions on the stored format; no DOM.
 */

import { getStroke, type StrokeOptions } from 'perfect-freehand';
import type { Bounds, HwPoint, HwStroke } from './types';

type Vec = [number, number];

const easeOutSine = (t: number) => Math.sin((t * Math.PI) / 2);

/** perfect-freehand settings per tool. Fixed here so a reload renders exactly what was drawn. */
export function freehandOptions(stroke: HwStroke, last = true): StrokeOptions {
  if (stroke.tool === 'highlighter') {
    return {
      size: stroke.width,
      thinning: 0,
      smoothing: 0.5,
      streamline: 0.4,
      simulatePressure: false,
      start: { cap: true },
      end: { cap: true },
      last,
    };
  }
  return {
    size: stroke.width,
    thinning: stroke.pressure ? 0.65 : 0.5,
    smoothing: 0.62,
    streamline: 0.45,
    simulatePressure: !stroke.pressure,
    // Light Apple Pencil pressure (0.1–0.3) would otherwise write very thin lines.
    easing: stroke.pressure ? easeOutSine : undefined,
    last,
  };
}

export function isFreehand(stroke: HwStroke): boolean {
  return stroke.tool !== 'shape';
}

/** Filled outline polygon of a pen/highlighter stroke. */
export function freehandOutline(stroke: HwStroke, last = true): number[][] {
  return getStroke(stroke.points as number[][], freehandOptions(stroke, last));
}

/** Compact number for path data: at most 2 decimals, no trailing zeros. */
export function fmt(n: number): string {
  const r = Math.round(n * 100) / 100;
  return Object.is(r, -0) ? '0' : String(r);
}

/** Smooth closed path through an outline polygon (quadratic midpoints, as perfect-freehand recommends). */
export function outlineToPathData(outline: number[][]): string {
  const len = outline.length;
  if (len === 0) return '';
  if (len < 3) {
    return `M${fmt(outline[0][0])} ${fmt(outline[0][1])}` + outline.slice(1).map((p) => `L${fmt(p[0])} ${fmt(p[1])}`).join('') + 'Z';
  }
  const mid = (a: number, b: number) => (a + b) / 2;
  let a = outline[0];
  let b = outline[1];
  const c = outline[2];
  let d = `M${fmt(a[0])} ${fmt(a[1])}Q${fmt(b[0])} ${fmt(b[1])} ${fmt(mid(b[0], c[0]))} ${fmt(mid(b[1], c[1]))}T`;
  const parts: string[] = [];
  for (let i = 2; i < len - 1; i++) {
    a = outline[i];
    b = outline[i + 1];
    parts.push(`${fmt(mid(a[0], b[0]))} ${fmt(mid(a[1], b[1]))}`);
  }
  d += parts.join(' ');
  return d + 'Z';
}

/** Arrowhead size grows with the line width. */
export function arrowHead(from: Vec, to: Vec, width: number): [Vec, Vec] {
  const len = Math.max(12, width * 4);
  const angle = Math.atan2(to[1] - from[1], to[0] - from[0]);
  const spread = (28 * Math.PI) / 180;
  return [
    [to[0] - len * Math.cos(angle - spread), to[1] - len * Math.sin(angle - spread)],
    [to[0] - len * Math.cos(angle + spread), to[1] - len * Math.sin(angle + spread)],
  ];
}

function ellipseParams(stroke: HwStroke) {
  const [a, b] = stroke.points;
  return {
    cx: (a[0] + b[0]) / 2,
    cy: (a[1] + b[1]) / 2,
    rx: Math.abs(b[0] - a[0]) / 2,
    ry: Math.abs(b[1] - a[1]) / 2,
  };
}

/** Centre-line path of a shape stroke (drawn with stroke-width = width, round caps and joins). */
export function shapePathData(stroke: HwStroke): string {
  const pts = stroke.points;
  if (pts.length === 0) return '';
  const p = (v: { 0: number; 1: number }) => `${fmt(v[0])} ${fmt(v[1])}`;
  if (stroke.shape === 'polyline' || pts.length === 1) {
    return `M${p(pts[0])}` + (pts.length === 1 ? `L${p(pts[0])}` : pts.slice(1).map((q) => `L${p(q)}`).join(''));
  }
  const a = pts[0];
  const b = pts[pts.length - 1];
  switch (stroke.shape) {
    case 'rect': {
      const x0 = Math.min(a[0], b[0]);
      const y0 = Math.min(a[1], b[1]);
      const x1 = Math.max(a[0], b[0]);
      const y1 = Math.max(a[1], b[1]);
      return `M${fmt(x0)} ${fmt(y0)}H${fmt(x1)}V${fmt(y1)}H${fmt(x0)}Z`;
    }
    case 'ellipse': {
      const { cx, cy, rx, ry } = ellipseParams(stroke);
      if (rx < 0.01 || ry < 0.01) return `M${p(a)}L${p(b)}`;
      return (
        `M${fmt(cx - rx)} ${fmt(cy)}A${fmt(rx)} ${fmt(ry)} 0 1 0 ${fmt(cx + rx)} ${fmt(cy)}` +
        `A${fmt(rx)} ${fmt(ry)} 0 1 0 ${fmt(cx - rx)} ${fmt(cy)}Z`
      );
    }
    case 'arrow': {
      const [h1, h2] = arrowHead([a[0], a[1]], [b[0], b[1]], stroke.width);
      return `M${p(a)}L${p(b)}M${p(h1)}L${p(b)}L${p(h2)}`;
    }
    default:
      return `M${p(a)}L${p(b)}`;
  }
}

/** Path data for any stroke: filled outline (freehand) or stroked centre-line (shape). */
export function strokePathData(stroke: HwStroke): string {
  return isFreehand(stroke) ? outlineToPathData(freehandOutline(stroke)) : shapePathData(stroke);
}

/** Densify a polyline so no two consecutive points are more than `step` apart. */
function densify(points: Vec[], step: number): Vec[] {
  const out: Vec[] = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    out.push(a);
    const b = points[i + 1];
    if (!b) break;
    const dist = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const n = Math.floor(dist / step);
    for (let k = 1; k < n; k++) out.push([a[0] + ((b[0] - a[0]) * k) / n, a[1] + ((b[1] - a[1]) * k) / n]);
  }
  return out;
}

/**
 * The centre-line(s) of a stroke as polylines, for hit-testing, lasso and
 * the pixel eraser. Shapes are sampled; freehand strokes are their points.
 */
export function strokePolylines(stroke: HwStroke, step = 0): Vec[][] {
  const pts = stroke.points;
  const xy = (q: HwPoint): Vec => [q[0], q[1]];
  let lines: Vec[][];
  if (isFreehand(stroke) || stroke.shape === 'polyline' || pts.length < 2) {
    lines = [pts.map(xy)];
  } else {
    const a = xy(pts[0]);
    const b = xy(pts[pts.length - 1]);
    switch (stroke.shape) {
      case 'rect': {
        const x0 = Math.min(a[0], b[0]);
        const y0 = Math.min(a[1], b[1]);
        const x1 = Math.max(a[0], b[0]);
        const y1 = Math.max(a[1], b[1]);
        lines = [[[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]];
        break;
      }
      case 'ellipse': {
        const { cx, cy, rx, ry } = ellipseParams(stroke);
        const n = Math.max(24, Math.min(180, Math.round((rx + ry) / 3)));
        const ring: Vec[] = [];
        for (let i = 0; i <= n; i++) {
          const t = (i / n) * Math.PI * 2;
          ring.push([cx - rx * Math.cos(t), cy + ry * Math.sin(t)]);
        }
        lines = [ring];
        break;
      }
      case 'arrow': {
        const [h1, h2] = arrowHead(a, b, stroke.width);
        lines = [[a, b], [h1, b, h2]];
        break;
      }
      default:
        lines = [[a, b]];
    }
  }
  return step > 0 ? lines.map((l) => densify(l, step)) : lines;
}

export function strokeBounds(stroke: HwStroke): Bounds {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const line of strokePolylines(stroke)) {
    for (const [x, y] of line) {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  // Pen strokes can swell to ~1.65× their nominal width at full pressure.
  const pad = stroke.tool === 'pen' ? stroke.width : stroke.tool === 'shape' && stroke.shape === 'arrow' ? stroke.width * 4 + 12 : stroke.width / 2 + 1;
  return { minX: minX - pad, minY: minY - pad, maxX: maxX + pad, maxY: maxY + pad };
}

export function unionBounds(list: Bounds[]): Bounds | null {
  if (list.length === 0) return null;
  return list.reduce((u, b) => ({
    minX: Math.min(u.minX, b.minX),
    minY: Math.min(u.minY, b.minY),
    maxX: Math.max(u.maxX, b.maxX),
    maxY: Math.max(u.maxY, b.maxY),
  }));
}

export function strokesBounds(strokes: HwStroke[]): Bounds | null {
  return unionBounds(strokes.map(strokeBounds));
}

export function boundsIntersect(a: Bounds, b: Bounds): boolean {
  return a.minX <= b.maxX && a.maxX >= b.minX && a.minY <= b.maxY && a.maxY >= b.minY;
}

/** Distance from p to segment ab. */
export function distToSegment(p: Vec, a: Vec, b: Vec): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len2 = dx * dx + dy * dy;
  let t = len2 === 0 ? 0 : ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / len2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}

/** Shortest distance between segments ab and cd. */
export function segmentDistance(a: Vec, b: Vec, c: Vec, d: Vec): number {
  if (segmentsIntersect(a, b, c, d)) return 0;
  return Math.min(distToSegment(a, c, d), distToSegment(b, c, d), distToSegment(c, a, b), distToSegment(d, a, b));
}

function segmentsIntersect(a: Vec, b: Vec, c: Vec, d: Vec): boolean {
  const cross = (o: Vec, p: Vec, q: Vec) => (p[0] - o[0]) * (q[1] - o[1]) - (p[1] - o[1]) * (q[0] - o[0]);
  const d1 = cross(c, d, a);
  const d2 = cross(c, d, b);
  const d3 = cross(a, b, c);
  const d4 = cross(a, b, d);
  return ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) && ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0));
}

/** Does the eraser segment from → to (radius r) touch the stroke? Used by the stroke eraser. */
export function strokeHitBySegment(stroke: HwStroke, from: Vec, to: Vec, r: number): boolean {
  const reach = r + stroke.width / 2;
  const b = strokeBounds(stroke);
  const sb: Bounds = {
    minX: Math.min(from[0], to[0]) - reach,
    minY: Math.min(from[1], to[1]) - reach,
    maxX: Math.max(from[0], to[0]) + reach,
    maxY: Math.max(from[1], to[1]) + reach,
  };
  if (!boundsIntersect(b, sb)) return false;
  for (const line of strokePolylines(stroke)) {
    if (line.length === 1 && distToSegment(line[0], from, to) <= reach) return true;
    for (let i = 0; i < line.length - 1; i++) {
      if (segmentDistance(line[i], line[i + 1], from, to) <= reach) return true;
    }
  }
  return false;
}

/**
 * Pixel eraser: removes the parts of a stroke within `r` of the eraser
 * segment from → to and returns the pieces that remain (new ids), the
 * stroke itself if untouched, or [] if it was erased completely. Shapes are
 * turned into polylines first so they can be cut too.
 */
export function eraseFromStroke(stroke: HwStroke, from: Vec, to: Vec, r: number, makeId: () => string): HwStroke[] {
  if (!strokeHitBySegment(stroke, from, to, r)) return [stroke];
  const reach = r + (stroke.tool === 'highlighter' ? stroke.width / 4 : 0);
  const step = Math.max(0.75, Math.min(2, r / 3));
  const pieces: HwStroke[] = [];

  const sources: HwPoint[][] = isFreehand(stroke)
    ? [densifyPressure(stroke.points, step)]
    : strokePolylines(stroke, step).map((line) => line.map(([x, y]) => [x, y, 0.5] as HwPoint));

  for (const pts of sources) {
    let run: HwPoint[] = [];
    const flush = () => {
      if (run.length >= 2 || (run.length === 1 && pts.length === 1)) {
        pieces.push(
          isFreehand(stroke)
            ? { ...stroke, id: makeId(), points: run }
            : { ...stroke, id: makeId(), shape: 'polyline', points: run }
        );
      }
      run = [];
    };
    for (const q of pts) {
      if (distToSegment([q[0], q[1]], from, to) <= reach) flush();
      else run.push(q);
    }
    flush();
  }
  return pieces;
}

/** Densify freehand points (interpolating pressure, and time when recorded) so the eraser cuts precisely. */
function densifyPressure(points: HwPoint[], step: number): HwPoint[] {
  const out: HwPoint[] = [];
  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    out.push(a);
    const b = points[i + 1];
    if (!b) break;
    const n = Math.floor(Math.hypot(b[0] - a[0], b[1] - a[1]) / step);
    for (let k = 1; k < n; k++) {
      const t = k / n;
      const q: HwPoint = [round1(a[0] + (b[0] - a[0]) * t), round1(a[1] + (b[1] - a[1]) * t), round2(a[2] + (b[2] - a[2]) * t)];
      if (a[3] !== undefined && b[3] !== undefined) q.push(Math.round(a[3] + (b[3] - a[3]) * t));
      out.push(q);
    }
  }
  return out;
}

export function pointInPolygon(p: Vec, poly: Vec[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Lasso: a stroke is selected when at least half of its sampled centre-line lies inside the loop. */
export function strokeInLasso(stroke: HwStroke, lasso: Vec[]): boolean {
  if (lasso.length < 3) return false;
  const samples = strokePolylines(stroke, 4).flat();
  if (samples.length === 0) return false;
  let inside = 0;
  for (const s of samples) if (pointInPolygon(s, lasso)) inside++;
  return inside * 2 >= samples.length;
}

export function translateStroke(stroke: HwStroke, dx: number, dy: number): HwStroke {
  return {
    ...stroke,
    points: stroke.points.map(([x, y, p, t]) => (t === undefined ? [round1(x + dx), round1(y + dy), p] : [round1(x + dx), round1(y + dy), p, t])),
  };
}

export const round1 = (n: number) => Math.round(n * 10) / 10;
export const round2 = (n: number) => Math.round(n * 100) / 100;

/** Snap a line end to the nearest 15° from its start (Shift while drawing a line or arrow). */
export function snapAngle(from: Vec, to: Vec): Vec {
  const len = Math.hypot(to[0] - from[0], to[1] - from[1]);
  const step = Math.PI / 12;
  const angle = Math.round(Math.atan2(to[1] - from[1], to[0] - from[0]) / step) * step;
  return [from[0] + len * Math.cos(angle), from[1] + len * Math.sin(angle)];
}

/** Make a rectangle/ellipse box square (Shift while drawing). */
export function squareBox(from: Vec, to: Vec): Vec {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const size = Math.max(Math.abs(dx), Math.abs(dy));
  return [from[0] + Math.sign(dx || 1) * size, from[1] + Math.sign(dy || 1) * size];
}
