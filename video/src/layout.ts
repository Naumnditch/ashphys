/**
 * Where a device frame sits on the stage, and the camera that moves over it.
 * "Screen" coordinates are the captured page's CSS pixels; "stage" are the
 * output video's pixels before the camera; the camera then zooms the stage.
 */

import type { Rect } from './types';

export interface FrameLayout {
  device: 'browser' | 'tablet';
  /** The whole device (bezel / browser chrome), stage px. */
  outer: Rect;
  /** The captured screen inside it, stage px. */
  content: Rect;
  /** Stage px per screen CSS px. */
  k: number;
  /** Browser top bar height / tablet bezel, stage px. */
  chrome: number;
  radius: number;
}

export function frameLayout(device: 'browser' | 'tablet', stageW: number, stageH: number, viewport: { width: number; height: number }): FrameLayout {
  const portrait = stageH > stageW;
  const aspect = viewport.width / viewport.height;
  if (device === 'browser') {
    let contentW = portrait ? stageW * 0.94 : Math.min(stageW * 0.8125, (stageH * 0.86) * aspect);
    let chrome = Math.round(46 * (contentW / 1560));
    if (!portrait && contentW / aspect + chrome > stageH * 0.88) {
      contentW = (stageH * 0.88 - chrome) * aspect;
      chrome = Math.round(46 * (contentW / 1560));
    }
    const contentH = contentW / aspect;
    const outerH = contentH + chrome;
    const x = (stageW - contentW) / 2;
    const y = portrait ? (stageH - outerH) / 2 - stageH * 0.04 : (stageH - outerH) / 2 - stageH * 0.025;
    return { device, outer: [x, y, contentW, outerH], content: [x, y + chrome, contentW, contentH], k: contentW / viewport.width, chrome, radius: Math.round(14 * (contentW / 1560)) + 4 };
  }
  const contentW = portrait ? stageW * 0.86 : Math.min(stageW * 0.66, stageH * 0.78 * aspect);
  const contentH = contentW / aspect;
  const bezel = Math.round(contentW * 0.026);
  const x = (stageW - contentW) / 2;
  const y = (stageH - contentH) / 2 - (portrait ? stageH * 0.04 : stageH * 0.025);
  return {
    device,
    outer: [x - bezel, y - bezel, contentW + bezel * 2, contentH + bezel * 2],
    content: [x, y, contentW, contentH],
    k: contentW / viewport.width,
    chrome: bezel,
    radius: Math.round(bezel * 1.6),
  };
}

/** Screen point → stage point. */
export function toStage(l: FrameLayout, x: number, y: number): [number, number] {
  return [l.content[0] + x * l.k, l.content[1] + y * l.k];
}

/** Screen rect → stage rect. */
export function rectToStage(l: FrameLayout, r: Rect): Rect {
  const [x, y] = toStage(l, r[0], r[1]);
  return [x, y, r[2] * l.k, r[3] * l.k];
}

/** Camera: the stage point shown at the centre of the output, and the zoom. Rest = identity. */
export interface Camera {
  x: number;
  y: number;
  zoom: number;
}

export const restCamera = (stageW: number, stageH: number): Camera => ({ x: stageW / 2, y: stageH / 2, zoom: 1 });

export function cameraTransform(c: Camera, stageW: number, stageH: number): string {
  return `translate(${stageW / 2}px, ${stageH / 2}px) scale(${c.zoom}) translate(${-c.x}px, ${-c.y}px)`;
}

/** Stage point → output point under the camera. */
export function project(c: Camera, stageW: number, stageH: number, x: number, y: number): [number, number] {
  return [(x - c.x) * c.zoom + stageW / 2, (y - c.y) * c.zoom + stageH / 2];
}

/** Keep the camera's window inside `bounds` (stage px) where it fits. */
export function clampCamera(c: Camera, stageW: number, stageH: number, bounds: Rect): Camera {
  const halfW = stageW / 2 / c.zoom;
  const halfH = stageH / 2 / c.zoom;
  const clamp = (v: number, lo: number, hi: number) => (lo > hi ? (lo + hi) / 2 : Math.min(hi, Math.max(lo, v)));
  return {
    zoom: c.zoom,
    x: clamp(c.x, bounds[0] + halfW, bounds[0] + bounds[2] - halfW),
    y: clamp(c.y, bounds[1] + halfH, bounds[1] + bounds[3] - halfH),
  };
}

/**
 * Critically damped spring towards per-frame targets, simulated from frame 0
 * so any frame can be rendered on its own (deterministic). Zoom moves in log
 * space so zooming in and out feel the same.
 */
export function springPath(targets: Camera[], fps: number, settleSeconds = 0.8, start?: Camera): Camera[] {
  const omega = (2 * Math.PI) / (settleSeconds * 1.2);
  const sub = 4;
  const dt = 1 / fps / sub;
  const out: Camera[] = [];
  const s0 = start ?? targets[0];
  const pos = [s0.x, s0.y, Math.log(s0.zoom)];
  const vel = [0, 0, 0];
  for (const t of targets) {
    const goal = [t.x, t.y, Math.log(t.zoom)];
    for (let k = 0; k < sub; k++) {
      for (let i = 0; i < 3; i++) {
        const acc = omega * omega * (goal[i] - pos[i]) - 2 * omega * vel[i];
        vel[i] += acc * dt;
        pos[i] += vel[i] * dt;
      }
    }
    out.push({ x: pos[0], y: pos[1], zoom: Math.exp(pos[2]) });
  }
  return out;
}
