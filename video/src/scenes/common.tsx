import type { ReactNode } from 'react';
import { Img, spring, staticFile } from 'remotion';
import { frameLayout, project, rectToStage, type Camera, type FrameLayout } from '../layout';
import type { AnnouncementData, CameraKey, Rect, Shot, StrokesFile } from '../types';

export interface SceneEnv {
  data: AnnouncementData;
  strokes: Record<string, StrokesFile>;
  font: string;
}

export function shot(env: SceneEnv, id: string): Shot {
  const s = env.data.manifest.shots[id];
  if (!s) throw new Error(`Capture "${id}" is missing from public/captures/${env.data.config.slug}/manifest.json — run npm run capture.`);
  return s;
}

export const captureUrl = (env: SceneEnv, file: string) => staticFile(`captures/${env.data.config.slug}/${file}`);

export function layoutFor(env: SceneEnv, device: 'browser' | 'tablet', s: Shot): FrameLayout {
  return frameLayout(device, env.data.width, env.data.height, s.viewport);
}

/** "shotId:rectName" (or "shotId:a+b" for the box around several) → stage rect. */
export function resolveRect(env: SceneEnv, layout: FrameLayout, ref: string): Rect | null {
  const [id, names] = ref.split(':');
  const rects = names
    .split('+')
    .map((name) => env.data.manifest.shots[id]?.rects[name])
    .filter((r): r is Rect => Boolean(r));
  if (rects.length === 0) return null;
  const x0 = Math.min(...rects.map((r) => r[0]));
  const y0 = Math.min(...rects.map((r) => r[1]));
  const x1 = Math.max(...rects.map((r) => r[0] + r[2]));
  const y1 = Math.max(...rects.map((r) => r[1] + r[3]));
  return rectToStage(layout, [x0, y0, x1 - x0, y1 - y0]);
}

/** The captured page, laid out in its own CSS pixels and scaled into the device frame. */
export function Screen({ layout, viewport, children }: { layout: FrameLayout; viewport: { width: number; height: number }; children: ReactNode }) {
  return (
    <div style={{ position: 'absolute', left: 0, top: 0, width: viewport.width, height: viewport.height, transform: `scale(${layout.k})`, transformOrigin: '0 0' }}>
      {children}
    </div>
  );
}

export function ShotImage({ env, s, file }: { env: SceneEnv; s: Shot; file?: string }) {
  return <Img src={captureUrl(env, file ?? s.file!)} style={{ position: 'absolute', left: 0, top: 0, width: s.viewport.width, height: s.viewport.height }} />;
}

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** Keyframed camera: each key springs (no overshoot) from wherever the camera is when it starts. */
export function keyedCamera(env: SceneEnv, layout: FrameLayout, keys: CameraKey[] | undefined, t: number, fps: number): Camera {
  const W = env.data.width;
  const H = env.data.height;
  const toCam = (k: CameraKey): Camera => {
    const r = k.focus ? resolveRect(env, layout, k.focus) : null;
    const [sx, sy] = k.shift ?? [0, 0];
    const c = r ? { x: r[0] + r[2] / 2, y: r[1] + r[3] / 2 } : { x: W / 2, y: H / 2 };
    return { x: c.x - (sx * W) / k.zoom, y: c.y - (sy * H) / k.zoom, zoom: k.zoom };
  };
  if (!keys || keys.length === 0) return { x: W / 2, y: H / 2, zoom: 1 };
  let cam = toCam(keys[0]);
  for (let i = 1; i < keys.length; i++) {
    if (t < keys[i].at) break;
    const p = spring({ frame: (t - keys[i].at) * fps, fps, config: { damping: 200, stiffness: 55, mass: 1 } });
    const next = toCam(keys[i]);
    cam = { x: lerp(cam.x, next.x, p), y: lerp(cam.y, next.y, p), zoom: Math.exp(lerp(Math.log(cam.zoom), Math.log(next.zoom), p)) };
  }
  return cam;
}

export const pathOf = (url: string) => `${url.replace(/^https?:\/\//, '').replace(/\/$/, '')}`;

/** Anchors for annotations: "shot:rect" → its rect in output pixels under the camera. */
export function outputRects(env: SceneEnv, layout: FrameLayout, cam: Camera) {
  const W = env.data.width;
  const H = env.data.height;
  return (ref: string): Rect | null => {
    const r = resolveRect(env, layout, ref);
    if (!r) return null;
    const [x0, y0] = project(cam, W, H, r[0], r[1]);
    const [x1, y1] = project(cam, W, H, r[0] + r[2], r[1] + r[3]);
    return [x0, y0, x1 - x0, y1 - y0];
  };
}
