import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/Background';
import { Callout } from '../components/Callout';
import { DeviceFrame } from '../components/DeviceFrame';
import { MouseCursor, PencilCursor, PinchIndicator, Ripple } from '../components/Pointer';
import { cameraTransform, project, toStage } from '../layout';
import type { SequenceScene as SequenceSceneConfig } from '../types';
import { captureUrl, keyedCamera, layoutFor, outputRects, resolveRect, Screen, shot, type SceneEnv } from './common';
import { Annotations } from '../components/Annotations';

/** A real interaction recorded frame by frame (zoom, pan, full screen), with the pointer drawn on top. */
export function SequenceScene({ scene, env }: { scene: SequenceSceneConfig; env: SceneEnv }) {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const t = frame / fps;
  const brand = env.data.config.brand;
  const s = shot(env, scene.capture);
  const layout = layoutFor(env, scene.device, s);
  const cam = keyedCamera(env, layout, scene.camera, t, fps);
  const seqFps = s.fps ?? fps;
  const i = Math.min(s.frames! - 1, Math.max(0, Math.floor(t * seqFps)));
  const unit = Math.min(W, H) / 1080;

  const ptr = s.pointer?.[i] ?? null;
  const out = ptr ? project(cam, W, H, ...toStage(layout, ptr[0], ptr[1])) : null;
  const events = s.events ?? [];
  const pinch = events.find((e) => e.kind === 'pinch' && i >= e.frame && i < e.frame + 40);
  const pressed = events.some((e) => e.kind === 'press' && i >= e.frame) && (() => {
    // Pressed while a drag is in progress: from a press until the pointer stops moving.
    const last = [...events].reverse().find((e) => e.frame <= i);
    if (!last || last.kind !== 'press') return false;
    const a = s.pointer?.[Math.max(0, i - 1)];
    return !!a && !!ptr && Math.hypot(ptr[0] - a[0], ptr[1] - a[1]) > 0.5;
  })();

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Background brand={brand} />
      <AbsoluteFill style={{ transform: cameraTransform(cam, W, H), transformOrigin: '0 0' }}>
        <DeviceFrame layout={layout} url={`${brand.url}${s.path}`} font={env.font}>
          <Screen layout={layout} viewport={s.viewport}>
            <Img src={captureUrl(env, `${s.dir}/${String(i).padStart(4, '0')}.jpg`)} style={{ position: 'absolute', left: 0, top: 0, width: s.viewport.width, height: s.viewport.height }} />
          </Screen>
        </DeviceFrame>
      </AbsoluteFill>
      {events
        .filter((e) => e.kind === 'click')
        .map((e) => {
          const p = s.pointer?.[e.frame];
          if (!p) return null;
          const o = project(cam, W, H, ...toStage(layout, p[0], p[1]));
          return <Ripple key={e.frame} x={o[0]} y={o[1]} t={(i - e.frame) / seqFps} color={brand.colors.accent} size={70 * unit} />;
        })}
      {out && pinch && <PinchIndicator x={out[0]} y={out[1]} progress={(i - pinch.frame) / 40} size={50 * unit} opacity={Math.min(1, (40 - (i - pinch.frame)) / 6)} />}
      {out && !pinch && s.tools?.[i] === 'pen' && <PencilCursor x={out[0]} y={out[1]} size={230 * unit} />}
      {out && !pinch && s.tools?.[i] !== 'pen' && <MouseCursor x={out[0]} y={out[1]} pressed={pressed} size={30 * unit} />}
      {(scene.callouts ?? []).map((c, k) => {
        const r = resolveRect(env, layout, c.anchor);
        if (!r) return null;
        const p = project(cam, W, H, r[0] + r[2] / 2, r[1] + r[3] / 2);
        return <Callout key={k} x={p[0]} y={p[1]} text={c.text} side={c.side} from={c.from} to={c.to} font={env.font} accent={brand.colors.accent} />;
      })}
      <Annotations items={scene.annotations} rectOf={outputRects(env, layout, cam)} />
    </AbsoluteFill>
  );
}
