import { AbsoluteFill, Freeze, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { linearTiming, TransitionSeries } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
import { slide } from '@remotion/transitions/slide';
import { Captions } from './components/Captions';
import { UPDATES } from './data';
import { fontFamily } from './fonts';
import { CtaScene } from './scenes/CtaScene';
import { HandwritingScene } from './scenes/HandwritingScene';
import { ScreensScene } from './scenes/ScreensScene';
import { SequenceScene } from './scenes/SequenceScene';
import { TitleScene } from './scenes/TitleScene';
import type { SceneEnv } from './scenes/common';
import type { AnnouncementData, Scene } from './types';

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

/** The template: the scene list from the config, joined by transitions, captions on top. */
export function Announcement({ slug, data }: AnnouncementProps) {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  if (!data) return null;
  const env: SceneEnv = { data, strokes: UPDATES[slug]?.strokes ?? {}, font: fontFamily };
  const T = data.transitionFrames;
  const presentation = data.config.transition.type === 'slide' ? slide({ direction: 'from-right' }) : fade();

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
          if (T > 0 && i < data.scenes.length - 1) {
            items.push(<TransitionSeries.Transition key={`${scene.id}-t`} presentation={presentation} timing={linearTiming({ durationInFrames: T })} />);
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
