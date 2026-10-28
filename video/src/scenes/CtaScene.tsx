import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { Background } from '../components/Background';
import type { CtaScene as CtaSceneConfig } from '../types';
import type { SceneEnv } from './common';

/** Closing card: the call to action, a button styled like the hero's primary button, the address. */
export function CtaScene({ scene, env }: { scene: CtaSceneConfig; env: SceneEnv }) {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  const brand = env.data.config.brand;
  const portrait = H > W;
  const unit = portrait ? W / 1080 : H / 1080;
  const a = spring({ frame, fps, config: { damping: 16, stiffness: 110 } });
  const b = spring({ frame: frame - 10, fps, config: { damping: 13, stiffness: 140 } });
  const c = interpolate(frame, [22, 40], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const press = frame > 52 && frame < 60 ? 0.96 : 1;
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Background brand={brand} intensity={1.2} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', padding: `0 ${W * 0.08}px`, textAlign: 'center' }}>
        <Img src={staticFile(brand.logo)} style={{ height: 74 * unit, width: 'auto', opacity: a, marginBottom: 40 * unit }} />
        <div
          style={{
            fontFamily: env.font,
            fontWeight: 800,
            fontSize: (portrait ? 84 : 76) * unit,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: brand.colors.ink,
            opacity: a,
            transform: `translateY(${(1 - a) * 30 * unit}px)`,
            maxWidth: portrait ? W * 0.86 : W * 0.7,
          }}
        >
          {scene.title}
        </div>
        {/* Same look as the hero's primary button (bg-gray-900, rounded-lg, semibold). */}
        <div
          style={{
            marginTop: 48 * unit,
            fontFamily: env.font,
            fontWeight: 600,
            fontSize: 36 * unit,
            color: '#fff',
            background: brand.colors.ink,
            borderRadius: 14 * unit,
            padding: `${24 * unit}px ${52 * unit}px`,
            transform: `scale(${b * press})`,
            boxShadow: '0 18px 40px rgba(17,24,39,0.28)',
          }}
        >
          {scene.button}
        </div>
        <div style={{ marginTop: 34 * unit, fontFamily: env.font, fontWeight: 700, fontSize: 40 * unit, color: brand.colors.accent, opacity: c }}>{brand.url}</div>
        {scene.note && <div style={{ marginTop: 18 * unit, fontFamily: env.font, fontWeight: 500, fontSize: 26 * unit, color: brand.colors.muted, opacity: c }}>{scene.note}</div>}
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
