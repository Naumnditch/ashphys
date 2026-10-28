import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/Background';
import { Callout } from '../components/Callout';
import { DeviceFrame } from '../components/DeviceFrame';
import { MouseCursor, PencilCursor, Ripple } from '../components/Pointer';
import { cameraTransform, project, toStage } from '../layout';
import type { ScreensScene as ScreensSceneConfig } from '../types';
import { captureUrl, keyedCamera, layoutFor, resolveRect, Screen, ShotImage, shot, type SceneEnv } from './common';

/** Real screenshots in a device frame, with a Ken Burns camera, a cursor and clicks. */
export function ScreensScene({ scene, env }: { scene: ScreensSceneConfig; env: SceneEnv }) {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const t = frame / fps;
  const brand = env.data.config.brand;
  const first = shot(env, scene.shots[0].capture);
  const layout = layoutFor(env, scene.device, first);
  const current = [...scene.shots].reverse().find((s) => s.at <= t) ?? scene.shots[0];
  const s = shot(env, current.capture);
  const cam = keyedCamera(env, layout, scene.camera, t, fps);

  // A captured interaction clip (frame sequence) playing over the stills.
  let clipFrame: { file: string; pointer: [number, number] | null } | null = null;
  if (scene.clip && t >= scene.clip.at) {
    const c = shot(env, scene.clip.capture);
    const i = Math.min(c.frames! - 1, Math.floor((t - scene.clip.at) * (c.fps ?? fps)));
    clipFrame = { file: `${c.dir}/${String(i).padStart(4, '0')}.jpg`, pointer: c.pointer?.[i] ?? null };
  }

  // Cursor: glides between keyed targets, arriving at each key's time.
  let cursor: { x: number; y: number; pressed: boolean } | null = null;
  const ripples: { x: number; y: number; t: number }[] = [];
  const keys = scene.cursor ?? [];
  if (keys.length) {
    const pts = keys.map((k) => {
      const r = resolveRect(env, layout, k.target);
      return r ? [r[0] + r[2] * 0.5, r[1] + r[3] * 0.55] : [W / 2, H / 2];
    });
    let pos = pts[0];
    for (let i = 1; i < keys.length; i++) {
      if (t >= keys[i].at) pos = pts[i];
      else if (t > keys[i - 1].at) {
        const u = (t - keys[i - 1].at) / (keys[i].at - keys[i - 1].at);
        const e = u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2;
        pos = [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * e, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * e];
        break;
      } else break;
    }
    const pressed = keys.some((k) => k.click && t >= k.at && t < k.at + 0.14);
    const out = project(cam, W, H, pos[0], pos[1]);
    cursor = { x: out[0], y: out[1], pressed };
    keys.forEach((k, i) => {
      if (!k.click) return;
      const p = project(cam, W, H, pts[i][0], pts[i][1]);
      ripples.push({ x: p[0], y: p[1], t: t - k.at });
    });
  }

  const pencil = clipFrame?.pointer ? project(cam, W, H, ...toStage(layout, clipFrame.pointer[0], clipFrame.pointer[1])) : null;
  const unit = Math.min(W, H) / 1080;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Background brand={brand} />
      <AbsoluteFill style={{ transform: cameraTransform(cam, W, H), transformOrigin: '0 0' }}>
        <DeviceFrame layout={layout} url={`${brand.url}${s.path}`} font={env.font}>
          <Screen layout={layout} viewport={s.viewport}>
            <ShotImage env={env} s={s} />
            {clipFrame && (
              <Img src={captureUrl(env, clipFrame.file)} style={{ position: 'absolute', left: 0, top: 0, width: s.viewport.width, height: s.viewport.height }} />
            )}
          </Screen>
        </DeviceFrame>
      </AbsoluteFill>
      {ripples.map((r, i) => (
        <Ripple key={i} x={r.x} y={r.y} t={r.t} color={brand.colors.accent} size={70 * unit} />
      ))}
      {cursor && !clipFrame && <MouseCursor x={cursor.x} y={cursor.y} pressed={cursor.pressed} size={30 * unit} />}
      {pencil && <PencilCursor x={pencil[0]} y={pencil[1]} size={230 * unit} />}
      {(scene.callouts ?? []).map((c, i) => {
        const r = resolveRect(env, layout, c.anchor);
        if (!r) return null;
        const p = project(cam, W, H, r[0] + r[2] / 2, r[1] + r[3] / 2);
        return <Callout key={i} x={p[0]} y={p[1]} text={c.text} side={c.side} from={c.from} to={c.to} font={env.font} accent={brand.colors.accent} />;
      })}
    </AbsoluteFill>
  );
}
