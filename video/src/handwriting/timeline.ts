/**
 * When each stored stroke is written during a replay.
 *
 * Strokes are replayed in their stored order (the order they were written:
 * the canvas appends every new stroke; erasing removes or splits strokes in
 * place, so erased ink is simply absent and never replayed).
 *
 * - Strokes with real timing (points [x, y, p, t] and a start time t0, saved
 *   by the canvas since 2026-10-28) keep the writer's own pace inside each
 *   stroke and the real gaps between strokes, with long pauses compressed to
 *   `pauseCompression` seconds.
 * - Strokes without timing get synthesized pacing: duration proportional to
 *   the stroke's length (eased like a real pen), short pauses between strokes
 *   that grow with the distance the pen travels, a bit longer at a new line,
 *   a colour change or a jump to another part of the page.
 *
 * Then one global speed-up fits the whole page into the time available.
 */

import type { HandwritingDoc, HwStroke } from '@site/lib/handwriting/types';
import { isFreehand, strokePolylines } from '@site/lib/handwriting/geometry';

export interface ReplayStroke {
  /** Index in stored order across pages (page 1's strokes first). */
  index: number;
  page: number;
  stroke: HwStroke;
  /** Seconds from the start of the replay. */
  start: number;
  end: number;
  /** Centre-line the pen follows (freehand: the stored points; shapes: sampled outline). */
  path: [number, number][];
  /** For each path point, when the pen reaches it (seconds from the replay start). */
  times: number[];
  timed: boolean;
}

export interface ReplayTimeline {
  strokes: ReplayStroke[];
  duration: number;
  /** How the pace was obtained. */
  source: 'timestamps' | 'synthesized' | 'mixed';
  /** Natural length of the replay / its fitted length. */
  speedUp: number;
  naturalDuration: number;
}

export interface TimelineOptions {
  /** Fit the whole replay into this many seconds (never slower than the natural pace). */
  fitSeconds?: number;
  /** Longest pause kept between timed strokes, seconds. */
  pauseCompression?: number;
  /** Synthesized pen speed, stored px per second. */
  penSpeed?: number;
  /** Extra beat after given strokes (e.g. a highlighted result), in output seconds (not sped up). */
  holdsAfter?: Record<number, number>;
}

const isTimed = (s: HwStroke) => s.t0 !== undefined && s.points.length > 0 && s.points.every((q) => q[3] !== undefined);

function lengths(path: [number, number][]): number[] {
  const acc = [0];
  for (let i = 1; i < path.length; i++) acc.push(acc[i - 1] + Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]));
  return acc;
}

/** Time fraction at which an eased pen (slow–fast–slow) reaches arc fraction u. */
const easedTime = (u: number) => Math.acos(1 - 2 * Math.min(1, Math.max(0, u))) / Math.PI;

function centreLine(stroke: HwStroke): [number, number][] {
  if (isFreehand(stroke)) return stroke.points.map((q) => [q[0], q[1]]);
  return strokePolylines(stroke, 3).flat();
}

export function buildTimeline(doc: HandwritingDoc, opts: TimelineOptions = {}): ReplayTimeline {
  const pauseCap = opts.pauseCompression ?? 0.4;
  const penSpeed = opts.penSpeed ?? 160;

  const flat: { stroke: HwStroke; page: number }[] = [];
  doc.pages.forEach((p, page) => p.strokes.forEach((stroke) => flat.push({ stroke, page })));

  // 1. Natural duration of each stroke and the relative time of each path point.
  const items = flat.map(({ stroke, page }, index) => {
    const path = centreLine(stroke);
    const timed = isTimed(stroke) && isFreehand(stroke);
    let rel: number[];
    if (timed) {
      const t0 = stroke.points[0][3]!;
      rel = stroke.points.map((q) => (q[3]! - t0) / 1000);
    } else {
      const acc = lengths(path);
      const total = acc[acc.length - 1];
      const d = Math.max(0.08, total / penSpeed);
      rel = acc.map((l) => (total > 0 ? easedTime(l / total) * d : 0));
    }
    let duration = rel[rel.length - 1] ?? 0;
    if (duration <= 0) {
      // A dot: give it a moment so it is seen being placed.
      duration = 0.05;
      rel = rel.map((_, i) => (rel.length > 1 ? (i / (rel.length - 1)) * duration : 0));
    }
    const absStart = timed ? stroke.t0! / 1000 + stroke.points[0][3]! / 1000 : null;
    return { stroke, page, index, path, rel, duration, timed, absStart };
  });

  // 2. Gaps between consecutive strokes.
  const gaps = items.map((it, i) => {
    if (i === 0) return 0;
    const prev = items[i - 1];
    let gap: number;
    if (it.absStart !== null && prev.absStart !== null) {
      gap = it.absStart - (prev.absStart + prev.duration);
      gap = Math.min(pauseCap, Math.max(0.03, gap));
    } else {
      const a = prev.path[prev.path.length - 1];
      const b = it.path[0];
      const dist = a && b ? Math.hypot(b[0] - a[0], b[1] - a[1]) : 0;
      const dy = a && b ? Math.abs(b[1] - a[1]) : 0;
      gap = 0.07 + Math.min(0.16, dist / 1400);
      if (dy > 28 || dist > 160) gap += 0.1; // a new line
      if (dist > 260) gap += 0.12; // another part of the page
      if (it.stroke.color !== prev.stroke.color) gap += 0.06; // picked another colour
      if (it.page !== prev.page) gap += 0.2;
      gap = Math.min(pauseCap, gap);
    }
    return gap;
  });

  const hold = (i: number) => opts.holdsAfter?.[i] ?? 0;
  const holds = items.reduce((n, _, i) => n + hold(i), 0);
  const natural = items.reduce((n, it, i) => n + gaps[i] + it.duration, 0);
  const room = opts.fitSeconds !== undefined ? Math.max(0.5, opts.fitSeconds - holds) : undefined;
  const speedUp = room && natural > room ? natural / room : 1;

  // 3. Lay them out on the fitted clock (holds are added as they are).
  let clock = 0;
  const strokes: ReplayStroke[] = items.map((it, i) => {
    clock += gaps[i] / speedUp + (i > 0 ? hold(i - 1) : 0);
    const start = clock;
    const times = it.rel.map((r) => start + r / speedUp);
    clock = start + it.duration / speedUp;
    return { index: it.index, page: it.page, stroke: it.stroke, start, end: clock, path: it.path, times, timed: it.timed };
  });

  const timedCount = items.filter((it) => it.timed).length;
  return {
    strokes,
    duration: clock + hold(items.length - 1),
    source: timedCount === 0 ? 'synthesized' : timedCount === items.length ? 'timestamps' : 'mixed',
    speedUp,
    naturalDuration: natural,
  };
}

export interface ReplayState {
  /** Strokes [0, done) are complete. */
  done: number;
  /** The stroke being written, if any. */
  active: { stroke: ReplayStroke; points: number; head: [number, number]; headPressure: number } | null;
  /** Where the pen is (stored coordinates) and on which page; null before the first stroke. */
  pen: { x: number; y: number; page: number; down: boolean } | null;
}

/** Replay state at `t` seconds (binary search; pure). */
export function stateAt(tl: ReplayTimeline, t: number): ReplayState {
  const list = tl.strokes;
  if (list.length === 0 || t < list[0].start) {
    const first = list[0];
    return { done: 0, active: null, pen: first ? { x: first.path[0][0], y: first.path[0][1], page: first.page, down: false } : null };
  }
  // Last stroke whose start <= t.
  let lo = 0;
  let hi = list.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (list[mid].start <= t) lo = mid;
    else hi = mid - 1;
  }
  const s = list[lo];
  if (t >= s.end) {
    // Between strokes: the pen travels (lifted) from this stroke's end to the next stroke's start.
    const next = list[lo + 1];
    const a = s.path[s.path.length - 1];
    if (!next) return { done: lo + 1, active: null, pen: { x: a[0], y: a[1], page: s.page, down: false } };
    const b = next.path[0];
    const u = next.start > s.end ? Math.min(1, (t - s.end) / (next.start - s.end)) : 1;
    const e = u * u * (3 - 2 * u);
    return { done: lo + 1, active: null, pen: { x: a[0] + (b[0] - a[0]) * e, y: a[1] + (b[1] - a[1]) * e, page: next.page, down: false } };
  }
  // Inside stroke `lo`: points reached so far, and the head between the last reached point and the next.
  let k = 0;
  while (k + 1 < s.times.length && s.times[k + 1] <= t) k++;
  const p0 = s.path[k];
  const p1 = s.path[Math.min(k + 1, s.path.length - 1)];
  const span = (s.times[k + 1] ?? s.times[k]) - s.times[k];
  const f = span > 0 ? Math.min(1, (t - s.times[k]) / span) : 0;
  const head: [number, number] = [p0[0] + (p1[0] - p0[0]) * f, p0[1] + (p1[1] - p0[1]) * f];
  const pts = s.stroke.points;
  const pr0 = pts[Math.min(k, pts.length - 1)]?.[2] ?? 0.5;
  const pr1 = pts[Math.min(k + 1, pts.length - 1)]?.[2] ?? pr0;
  return {
    done: lo,
    active: { stroke: s, points: k + 1, head, headPressure: pr0 + (pr1 - pr0) * f },
    pen: { x: head[0], y: head[1], page: s.page, down: true },
  };
}
