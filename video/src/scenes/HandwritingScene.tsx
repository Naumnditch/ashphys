import { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/Background';
import { DeviceFrame } from '../components/DeviceFrame';
import { PencilCursor } from '../components/Pointer';
import { followCameraPath } from '../handwriting/camera';
import { HandwritingReplay, type ReplayHighlight } from '../handwriting/HandwritingReplay';
import { buildTimeline, stateAt } from '../handwriting/timeline';
import { snapMatrix } from '../handwriting/snap';
import { pageSlots, viewerPageOffsets } from '../handwriting/viewerLayout';
import { cameraTransform, project, toStage } from '../layout';
import type { HandwritingScene as HandwritingSceneConfig, InkTransform, Matrix, StrokesFile } from '../types';
import { layoutFor, Screen, ShotImage, shot, type SceneEnv } from './common';

/** Expand [first, last] ranges into stroke indices. */
export const rangeIndices = (ranges: [number, number][]) => ranges.flatMap(([a, b]) => Array.from({ length: b - a + 1 }, (_, i) => a + i));

export function useReplayTimeline(env: SceneEnv, scene: HandwritingSceneConfig) {
  const file = env.strokes[scene.strokes];
  if (!file) throw new Error(`strokes/${scene.strokes}.json is missing — run npm run fetch-strokes`);
  const r = scene.replay ?? {};
  const startDelay = r.startDelay ?? 0.4;
  const endHold = r.endHold ?? 1.2;
  return useMemo(() => {
    const highlightHold = 0.45;
    const holdsAfter: Record<number, number> = {};
    for (const h of scene.highlights ?? []) holdsAfter[Math.max(...rangeIndices(h.strokes))] = highlightHold;
    const timeline = buildTimeline(file.doc, {
      fitSeconds: scene.seconds - startDelay - endHold,
      pauseCompression: r.pauseCompression ?? 0.4,
      penSpeed: r.penSpeed,
      holdsAfter,
    });
    return { timeline, startDelay, endHold, file };
  }, [file, scene, startDelay, endHold, r.pauseCompression, r.penSpeed]);
}

/** Per doc page: the captured screen transform (camera, pencil) and the viewer's SVG offsets (ink). */
export function useViewerGeometry(file: StrokesFile, ink: InkTransform) {
  return useMemo(() => {
    const slots = pageSlots(file.doc);
    const captured: Matrix[] = ink.pages?.length ? ink.pages : [ink.matrix];
    const pageMatrices = slots.map((slot) => snapMatrix(captured[slot ?? 0] ?? captured[0], ink.clip));
    return { pageMatrices, viewer: { viewBox: ink.viewBox, pageOffsets: viewerPageOffsets(file.doc, file.snapshots) } };
  }, [file, ink]);
}

/**
 * The stored handwriting writes itself over the captured viewer (paper and
 * grid from the real site, ink hidden), the camera following the pen, and
 * ends on exactly the stored page.
 */
export function HandwritingScene({ scene, env }: { scene: HandwritingSceneConfig; env: SceneEnv }) {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H, durationInFrames } = useVideoConfig();
  const brand = env.data.config.brand;
  const plate = shot(env, scene.plate);
  if (!plate.ink) throw new Error(`Capture "${scene.plate}" has no viewer transform`);
  const ink = plate.ink;
  const layout = layoutFor(env, scene.device, plate);
  const { timeline, startDelay, file } = useReplayTimeline(env, scene);
  const { pageMatrices, viewer } = useViewerGeometry(file, ink);

  const frames = Math.round(scene.seconds * fps);
  const camPath = useMemo(
    () =>
      scene.camera
        ? followCameraPath(timeline, {
            fps,
            frames: Math.max(frames, durationInFrames),
            replayStart: startDelay,
            stageW: W,
            stageH: H,
            layout,
            pageMatrices,
            clip: ink.clip,
            minZoom: scene.camera.minZoom,
            maxZoom: scene.camera.maxZoom,
            settle: scene.camera.settle,
          })
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [timeline, fps, frames, durationInFrames, W, H, scene.camera, scene.plate]
  );
  const cam = camPath?.[Math.min(frame, camPath.length - 1)] ?? { x: W / 2, y: H / 2, zoom: 1 };
  const time = frame / fps - startDelay;

  const highlights: ReplayHighlight[] = (scene.highlights ?? []).map((h) => ({ label: h.label, indices: rangeIndices(h.strokes) }));

  // The pencil, in output pixels so it keeps its size while the camera zooms.
  const state = stateAt(timeline, time);
  let pencil: { x: number; y: number; lift: number; opacity: number } | null = null;
  if (state.pen) {
    const m = pageMatrices[Math.min(state.pen.page, pageMatrices.length - 1)];
    const sx = m[0] * state.pen.x + m[2] * state.pen.y + m[4];
    const sy = m[1] * state.pen.x + m[3] * state.pen.y + m[5];
    const [ox, oy] = project(cam, W, H, ...toStage(layout, sx, sy));
    const first = timeline.strokes[0]?.start ?? 0;
    const last = timeline.strokes[timeline.strokes.length - 1]?.end ?? 0;
    const appear = Math.min(1, Math.max(0, (time - (first - 0.35)) / 0.3));
    const leave = Math.min(1, Math.max(0, 1 - (time - last - 0.15) / 0.35));
    // Lift only for real pauses: average pen-up over ±0.1 s so quick hops between strokes don't flicker.
    let up = 0;
    for (let k = -2; k <= 2; k++) up += stateAt(timeline, time + k * 0.05).pen?.down ? 0 : 1;
    pencil = { x: ox, y: oy, lift: up / 5, opacity: Math.min(appear, leave) };
  }
  const unit = Math.min(W, H) / 1080;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Background brand={brand} />
      <AbsoluteFill style={{ transform: cameraTransform(cam, W, H), transformOrigin: '0 0' }}>
        <DeviceFrame layout={layout} url={`${brand.url}${plate.path}`} font={env.font}>
          <Screen layout={layout} viewport={plate.viewport}>
            <ShotImage env={env} s={plate} />
            <HandwritingReplay
              timeline={timeline}
              time={time}
              viewer={viewer}
              clip={ink.clip}
              highlights={highlights}
              highlightColor={brand.colors.highlight}
              ringColor={brand.colors.accent}
            />
          </Screen>
        </DeviceFrame>
      </AbsoluteFill>
      {pencil && pencil.opacity > 0 && <PencilCursor x={pencil.x} y={pencil.y} lift={pencil.lift} opacity={pencil.opacity} size={240 * unit} />}
    </AbsoluteFill>
  );
}
