/**
 * Pan/zoom math shared by the editor and the read-only viewer. A view maps
 * logical (stored) coordinates to screen CSS pixels inside the canvas box:
 * screen = world * scale + (x, y). Only the view changes on pan/zoom.
 */

import type { Bounds } from './types';

export interface View {
  scale: number;
  x: number;
  y: number;
}

export const MIN_SCALE = 0.1;
export const MAX_SCALE = 8;
export const ZOOM_STEP = 1.25;

export const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

export function toWorld(view: View, sx: number, sy: number): [number, number] {
  return [(sx - view.x) / view.scale, (sy - view.y) / view.scale];
}

export function toScreen(view: View, wx: number, wy: number): [number, number] {
  return [wx * view.scale + view.x, wy * view.scale + view.y];
}

/** Zoom by `factor` keeping the screen point (cx, cy) fixed. */
export function zoomAt(view: View, factor: number, cx: number, cy: number): View {
  const scale = clampScale(view.scale * factor);
  const k = scale / view.scale;
  return { scale, x: cx - (cx - view.x) * k, y: cy - (cy - view.y) * k };
}

/** Set an absolute zoom around the screen point (cx, cy). */
export function zoomTo(view: View, scale: number, cx: number, cy: number): View {
  return zoomAt(view, clampScale(scale) / view.scale, cx, cy);
}

/**
 * Fit `b` inside a w × h box with `pad` px around it, never above `maxScale`.
 * `align: 'top'` pins the content to the top (reading a tall solution);
 * otherwise it is centred both ways.
 */
export function fitBounds(b: Bounds, w: number, h: number, opts: { pad?: number; maxScale?: number; align?: 'center' | 'top'; widthOnly?: boolean } = {}): View {
  const pad = opts.pad ?? 24;
  const bw = Math.max(1, b.maxX - b.minX);
  const bh = Math.max(1, b.maxY - b.minY);
  const sx = (w - pad * 2) / bw;
  const sy = (h - pad * 2) / bh;
  const scale = clampScale(Math.min(opts.maxScale ?? 2, opts.widthOnly ? sx : Math.min(sx, sy)));
  const x = (w - bw * scale) / 2 - b.minX * scale;
  const y = opts.align === 'top' ? pad - b.minY * scale : (h - bh * scale) / 2 - b.minY * scale;
  return { scale, x, y };
}

/** The world rectangle visible in a w × h box. */
export function visibleWorld(view: View, w: number, h: number): Bounds {
  const [minX, minY] = toWorld(view, 0, 0);
  const [maxX, maxY] = toWorld(view, w, h);
  return { minX, minY, maxX, maxY };
}

/** Two-finger gesture: the view that keeps the world points under both fingers under them. */
export function pinchView(start: View, a0: [number, number], b0: [number, number], a1: [number, number], b1: [number, number]): View {
  const d0 = Math.hypot(b0[0] - a0[0], b0[1] - a0[1]) || 1;
  const d1 = Math.hypot(b1[0] - a1[0], b1[1] - a1[1]) || 1;
  const c0: [number, number] = [(a0[0] + b0[0]) / 2, (a0[1] + b0[1]) / 2];
  const c1: [number, number] = [(a1[0] + b1[0]) / 2, (a1[1] + b1[1]) / 2];
  const scale = clampScale(start.scale * (d1 / d0));
  // World point under the starting midpoint stays under the current midpoint.
  const [wx, wy] = toWorld(start, c0[0], c0[1]);
  return { scale, x: c1[0] - wx * scale, y: c1[1] - wy * scale };
}

/** Wheel event → zoom factor (Ctrl/Cmd + wheel, and trackpad pinch which arrives as ctrl+wheel). */
export function wheelZoomFactor(deltaY: number, deltaMode: number): number {
  const px = deltaMode === 1 ? deltaY * 16 : deltaMode === 2 ? deltaY * 400 : deltaY;
  return Math.exp(-Math.max(-60, Math.min(60, px)) * 0.006);
}
