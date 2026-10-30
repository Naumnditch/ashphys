import { AbsoluteFill, Easing, Freeze, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { linearTiming, TransitionSeries, type TransitionPresentation } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { wipe } from '@remotion/transitions/wipe';
import { Captions } from './components/Captions';
import { UPDATES } from './data';
import { fontFamily } from './fonts';
import { CtaScene } from './scenes/CtaScene';
import { HandwritingScene } from './scenes/HandwritingScene';
import { ScreensScene } from './scenes/ScreensScene';
import { SequenceScene } from './scenes/SequenceScene';
import { TitleScene } from './scenes/TitleScene';
import type { SceneEnv } from './scenes/common';
import type { AnnouncementData, Scene, TransitionConfig } from './types';

export interface AnnouncementProps {
  slug: string;
  variant: AnnouncementData['variant'];
  data?: AnnouncementData;
  [key: string]: unknown;
}

function SceneView({ scene, env }: { scene: Scene; env: SceneEnv }) {
  switch (scene.type) {
    case 'title':
      return <TitleScene scene={scene} env={env} />;
    case 'screens':
      return <ScreensScene scene={scene} env={env} />;
    case 'handwriting':
      return <HandwritingScene scene={scene} env={env} />;
    case 'sequence':
      return <SequenceScene scene={scene} env={env} />;
    case 'cta':
      return <CtaScene scene={scene} env={env} />;
  }
}

// TransitionSeries takes any presentation; widen the three to one type.
function presentationOf(t: TransitionConfig): TransitionPresentation<Record<string, unknown>> {
  const direction = t.direction ?? 'from-right';
  const p = t.type === 'slide' ? slide({ direction }) : t.type === 'wipe' ? wipe({ direction }) : fade();
  return p as unknown as TransitionPresentation<Record<string, unknown>>;
}

/** The template: the scene list from the config, joined by transitions, captions on top. */
export function Announcement({ slug, data }: AnnouncementProps) {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  if (!data) return null;
  const env: SceneEnv = { data, strokes: UPDATES[slug]?.strokes ?? {}, font: fontFamily };

  // Hero loop: the last half second dissolves into the first frame, so the loop has no seam.
  const loopFrames = Math.round(fps * 0.5);
  const loopOpacity = data.loop ? interpolate(frame, [durationInFrames - loopFrames, durationInFrames - 1], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: data.config.brand.colors.page }}>
      <TransitionSeries>
        {data.scenes.flatMap((scene, i) => {
          const items = [
            <TransitionSeries.Sequence key={scene.id} durationInFrames={Math.round(scene.seconds * fps)} name={scene.id}>
              <SceneView scene={scene} env={env} />
            </TransitionSeries.Sequence>,
          ];
          const next = data.transitions[i + 1];
          if (next && next.frames > 0) {
            items.push(
              <TransitionSeries.Transition key={`${scene.id}-t`} presentation={presentationOf(next)} timing={linearTiming({ durationInFrames: next.frames, easing: Easing.inOut(Easing.cubic) })} />
            );
          }
          return items;
        })}
      </TransitionSeries>
      {loopOpacity > 0 && (
        <AbsoluteFill style={{ opacity: loopOpacity }}>
          <Freeze frame={0}>
            <SceneView scene={data.scenes[0]} env={env} />
          </Freeze>
        </AbsoluteFill>
      )}
      {data.showCaptions && <Captions captions={data.captions} font={fontFamily} />}
    </AbsoluteFill>
  );
}
