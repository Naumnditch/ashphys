import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Annotations } from '../components/Annotations';
import { Background } from '../components/Background';
import type { TitleScene as TitleSceneConfig } from '../types';
import type { SceneEnv } from './common';

/** Logo and a kinetic title over the animated grid. */
export function TitleScene({ scene, env }: { scene: TitleSceneConfig; env: SceneEnv }) {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const brand = env.data.config.brand;
  const portrait = H > W;
  const unit = portrait ? W / 1080 : H / 1080;
  const logo = spring({ frame, fps, config: { damping: 16, stiffness: 120 } });
  const kick = spring({ frame: frame - 8, fps, config: { damping: 14, stiffness: 140 } });
  const words = scene.title.split(' ');
  const sub = interpolate(frame, [30, 48], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const exit = interpolate(frame, [Math.round(scene.seconds * fps) - 12, Math.round(scene.seconds * fps)], [1, 0.96], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Background brand={brand} intensity={1.2} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${exit})`, padding: `0 ${W * 0.07}px` }}>
        <Img
          src={staticFile(brand.logo)}
          style={{ height: 92 * unit, width: 'auto', opacity: logo, transform: `translateY(${(1 - logo) * 24 * unit}px)`, marginBottom: 44 * unit }}
        />
        {scene.kicker && (
          <div
            style={{
              fontFamily: env.font,
              fontWeight: 800,
              fontSize: 26 * unit,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#fff',
              background: brand.colors.accent,
              borderRadius: 999,
              padding: `${8 * unit}px ${22 * unit}px`,
              transform: `scale(${kick})`,
              marginBottom: 26 * unit,
              boxShadow: '0 10px 30px rgba(37,99,235,0.35)',
            }}
          >
            {scene.kicker}
          </div>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: `0 ${22 * unit}px`, maxWidth: portrait ? W * 0.9 : W * 0.8 }}>
          {words.map((w, i) => {
            const p = spring({ frame: frame - 12 - i * 4, fps, config: { damping: 15, stiffness: 130 } });
            return (
              <span
                key={i}
                style={{
                  fontFamily: env.font,
                  fontWeight: 800,
                  fontSize: (portrait ? 104 : 96) * unit,
                  lineHeight: 1.08,
                  letterSpacing: '-0.03em',
                  color: brand.colors.ink,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 40 * unit}px)`,
                  filter: `blur(${(1 - p) * 8}px)`,
                  display: 'inline-block',
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
        {scene.subtitle && (
          <div style={{ fontFamily: env.font, fontWeight: 500, fontSize: 34 * unit, color: brand.colors.muted, marginTop: 28 * unit, opacity: sub, transform: `translateY(${(1 - sub) * 12}px)` }}>
            {scene.subtitle}
          </div>
        )}
      </AbsoluteFill>
      <Annotations items={scene.annotations} rectOf={() => null} />
    </AbsoluteFill>
  );
}
