/**
 * Camera that follows the pen across a handwritten page: strokes are grouped
 * into regions (a line of working, the diagram, the sketch on the right…),
 * the camera glides to each region a moment before the pen starts it, zoomed
 * so the region fills the frame, and eases back to the whole page at the end.
 * A spring smooths every move; the path is precomputed per frame.
 */

import { strokeBounds } from '@site/lib/handwriting/geometry';
import { clampCamera, restCamera, springPath, toStage, type Camera, type FrameLayout } from '../layout';
import type { Matrix, Rect } from '../types';
import type { ReplayTimeline } from './timeline';

export interface FollowOptions {
  fps: number;
  /** Scene length in frames. */
  frames: number;
  /** Seconds into the scene when the replay clock starts. */
  replayStart: number;
  stageW: number;
  stageH: number;
  layout: FrameLayout;
  pageMatrices: Matrix[];
  /** The viewer box (screen px): the camera never needs to look outside it. */
  clip: Rect;
  minZoom: number;
  maxZoom: number;
  /** Seconds at the end of the scene spent easing back to the whole page. */
  settle: number;
  /** How early the camera starts towards the next region, seconds. */
  lead?: number;
}

export interface Region {
  first: number;
  last: number;
  start: number;
  end: number;
  box: Rect;
}

const union = (a: Rect, b: Rect): Rect => {
  const x0 = Math.min(a[0], b[0]);
  const y0 = Math.min(a[1], b[1]);
  const x1 = Math.max(a[0] + a[2], b[0] + b[2]);
  const y1 = Math.max(a[1] + a[3], b[1] + b[3]);
  return [x0, y0, x1 - x0, y1 - y0];
};

function strokeStageBox(o: FollowOptions, page: number, b: { minX: number; minY: number; maxX: number; maxY: number }): Rect {
  const m = o.pageMatrices[Math.min(page, o.pageMatrices.length - 1)];
  const corners = [
    [b.minX, b.minY],
    [b.maxX, b.minY],
    [b.minX, b.maxY],
    [b.maxX, b.maxY],
  ].map(([x, y]) => toStage(o.layout, m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]));
  const xs = corners.map((c) => c[0]);
  const ys = corners.map((c) => c[1]);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)];
}

export function regions(tl: ReplayTimeline, o: FollowOptions): Region[] {
  const prefZoom = (o.minZoom + o.maxZoom) / 2;
  const maxW = (o.stageW * 0.8) / prefZoom;
  const maxH = (o.stageH * 0.6) / prefZoom;
  const out: Region[] = [];
  let cur: Region | null = null;
  for (const s of tl.strokes) {
    const box = strokeStageBox(o, s.page, strokeBounds(s.stroke));
    const tiny = s.stroke.points.length <= 2 && box[2] < 12 && box[3] < 12;
    if (!cur) {
      cur = { first: s.index, last: s.index, start: s.start, end: s.end, box };
      continue;
    }
    const u = union(cur.box, box);
    if (tiny || (u[2] <= maxW && u[3] <= maxH)) {
      if (!tiny) cur.box = u;
      cur.last = s.index;
      cur.end = s.end;
    } else {
      out.push(cur);
      cur = { first: s.index, last: s.index, start: s.start, end: s.end, box };
    }
  }
  if (cur) out.push(cur);

  // A region the pen is in for only a blink is folded into its neighbour when they fit together.
  const merged: Region[] = [];
  for (const r of out) {
    const prev = merged[merged.length - 1];
    if (prev && r.end - r.start < 0.3) {
      const u = union(prev.box, r.box);
      if (u[2] <= (o.stageW * 0.85) / o.minZoom && u[3] <= (o.stageH * 0.7) / o.minZoom) {
        prev.box = u;
        prev.last = r.last;
        prev.end = r.end;
        continue;
      }
    }
    merged.push({ ...r });
  }
  return merged;
}

export function followCameraPath(tl: ReplayTimeline, o: FollowOptions): Camera[] {
  const rest = restCamera(o.stageW, o.stageH);
  const lead = o.lead ?? 0.4;
  const regs = regions(tl, o);
  const clipStage: Rect = (() => {
    const [x, y] = toStage(o.layout, o.clip[0], o.clip[1]);
    return [x, y, o.clip[2] * o.layout.k, o.clip[3] * o.layout.k];
  })();
  const targetFor = (r: Region): Camera => {
    const pad = 1.18;
    const zoom = Math.min(o.maxZoom, Math.max(o.minZoom, Math.min((o.stageW * 0.84) / (r.box[2] * pad), (o.stageH * 0.66) / (r.box[3] * pad))));
    // Keep the region a little above centre: captions sit at the bottom.
    const cam = { x: r.box[0] + r.box[2] / 2, y: r.box[1] + r.box[3] / 2 + (o.stageH * 0.05) / zoom, zoom };
    return clampCamera(cam, o.stageW, o.stageH, clipStage);
  };
  const lastEnd = tl.strokes.length ? tl.strokes[tl.strokes.length - 1].end : 0;
  const settleAt = Math.max(lastEnd + 0.15, o.frames / o.fps - o.settle - o.replayStart);
  const targets: Camera[] = [];
  for (let f = 0; f < o.frames; f++) {
    const t = f / o.fps - o.replayStart;
    if (regs.length === 0 || t < regs[0].start - lead || t >= settleAt) {
      targets.push(rest);
      continue;
    }
    let r = regs[0];
    for (const g of regs) if (g.start - lead <= t) r = g;
    targets.push(targetFor(r));
  }
  return springPath(targets, o.fps, 0.9, rest);
}
