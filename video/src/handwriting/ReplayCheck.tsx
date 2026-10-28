import { AbsoluteFill, Img, useCurrentFrame, useVideoConfig } from 'remotion';
import { UPDATES } from '../data';
import { fontFamily } from '../fonts';
import { captureUrl, type SceneEnv } from '../scenes/common';
import { rangeIndices, useReplayTimeline, useViewerGeometry } from '../scenes/HandwritingScene';
import type { AnnouncementData, HandwritingScene } from '../types';
import { HandwritingReplay } from './HandwritingReplay';
import { paintedBox } from './snap';
import { stateAt } from './timeline';

export type CheckMode = 'replay' | 'reference' | 'snapshot' | 'difference' | 'side-by-side';

export interface ReplayCheckProps {
  slug: string;
  /** A handwriting scene id from the config (its timing is used as is). */
  scene: string;
  mode: CheckMode;
  showIndices: boolean;
  showHud: boolean;
  data?: AnnouncementData;
  [key: string]: unknown;
}

/**
 * Debug composition for Remotion Studio: the replay drawn at the capture's own
 * size with no frame and no camera, so it can be checked against the real
 * viewer pixel for pixel. Scrub the timeline; turn on stroke indices; compare
 * side by side with the reference capture, or in difference mode (anything
 * that is not black on the last frame is drift). scripts/verify-alignment.mjs
 * renders the last frame of mode "replay" and diffs it with the reference.
 */
export function ReplayCheck({ slug, scene: sceneId, mode, showIndices, showHud, data }: ReplayCheckProps) {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  if (!data) return null;
  const scene = data.config.scenes.find((s) => s.id === sceneId) as HandwritingScene | undefined;
  if (!scene || scene.type !== 'handwriting') throw new Error(`"${sceneId}" is not a handwriting scene`);
  const env: SceneEnv = { data, strokes: UPDATES[slug]?.strokes ?? {}, font: fontFamily };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { timeline, startDelay, file } = useReplayTimeline(env, scene);
  const plate = data.manifest.shots[scene.plate];
  const reference = data.manifest.shots[scene.reference];
  const ink = plate.ink!;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { viewer } = useViewerGeometry(file, ink);
  const time = frame / fps - startDelay;
  const state = stateAt(timeline, time);
  const highlights = mode === 'replay' ? [] : (scene.highlights ?? []).map((h) => ({ label: h.label, indices: rangeIndices(h.strokes) }));

  const replay = (
    <>
      <Img src={captureUrl(env, plate.file!)} style={{ position: 'absolute', left: 0, top: 0, width: plate.viewport.width, height: plate.viewport.height }} />
      <HandwritingReplay timeline={timeline} time={time} viewer={viewer} clip={ink.clip} showIndices={showIndices} tipDot={mode !== 'replay'} highlights={highlights} />
    </>
  );
  const ref = <Img src={captureUrl(env, reference.file!)} style={{ position: 'absolute', left: 0, top: 0, width: reference.viewport.width, height: reference.viewport.height }} />;

  // The stored server snapshot (what students get), laid out exactly like the viewer lays it out.
    const box = paintedBox(ink.clip);
  const snapshot = (
    <>
      <Img src={captureUrl(env, plate.file!)} style={{ position: 'absolute', left: 0, top: 0, width: plate.viewport.width, height: plate.viewport.height }} />
      <svg
        width={box[2]}
        height={box[3]}
        viewBox={ink.viewBox}
        preserveAspectRatio="xMinYMin meet"
        style={{ position: 'absolute', left: box[0], top: box[1], overflow: 'hidden' }}
        dangerouslySetInnerHTML={{
          __html: file.snapshots
            .map((s, i) => {
              const o = viewer.pageOffsets.filter(Boolean)[i];
              return o ? `<g transform="translate(${o[0]} ${o[1]})">${s.body}</g>` : '';
            })
            .join(''),
        }}
      />
    </>
  );

  let body: JSX.Element;
  if (mode === 'replay') body = replay;
  else if (mode === 'snapshot') body = snapshot;
  else if (mode === 'reference') body = ref;
  else if (mode === 'difference') {
    body = (
      <>
        {ref}
        <AbsoluteFill style={{ mixBlendMode: 'difference' }}>{replay}</AbsoluteFill>
      </>
    );
  } else {
    // Side by side: the viewer box from the replay (left) and from the real capture (right).
    const [cx, cy, cw, ch] = ink.clip;
    const scale = Math.min((W / 2 - 24) / cw, (H - 120) / ch);
    const crop = (content: JSX.Element, left: number, label: string) => (
      <div style={{ position: 'absolute', left, top: 70, width: cw * scale, height: ch * scale, overflow: 'hidden', outline: '1px solid #9ca3af' }}>
        <div style={{ position: 'absolute', left: -cx * scale, top: -cy * scale, width: plate.viewport.width, height: plate.viewport.height, transform: `scale(${scale})`, transformOrigin: '0 0' }}>{content}</div>
        <div style={{ position: 'absolute', left: 8, top: 8, font: `600 18px ${fontFamily}`, background: '#111827', color: '#fff', padding: '4px 10px', borderRadius: 6 }}>{label}</div>
      </div>
    );
    body = (
      <AbsoluteFill style={{ background: '#f3f4f6' }}>
        {crop(replay, 12, 'Replay')}
        {crop(ref, W / 2 + 12, 'Captured viewer (stored page)')}
      </AbsoluteFill>
    );
  }

  return (
    <AbsoluteFill style={{ background: '#fff' }}>
      {body}
      {showHud && mode !== 'replay' && (
        <div style={{ position: 'absolute', left: 12, top: 12, font: `500 20px ui-monospace, monospace`, background: 'rgba(17,24,39,0.85)', color: '#fff', padding: '8px 14px', borderRadius: 8 }}>
          {sceneId} · stroke {state.active ? state.active.stroke.index : Math.max(0, state.done - 1)} / {timeline.strokes.length - 1} · {state.done} done · t {time.toFixed(2)} s · {timeline.source} pacing · ×{timeline.speedUp.toFixed(1)}
        </div>
      )}
    </AbsoluteFill>
  );
}
