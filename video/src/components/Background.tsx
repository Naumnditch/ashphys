import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import type { BrandConfig } from '../types';

/** Soft drifting gradient over faint graph paper, in the site's palette. */
export function Background({ brand, intensity = 1 }: { brand: BrandConfig; intensity?: number }) {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const t = frame / fps;
  const grid = Math.round(Math.min(width, height) / 24);
  const dx = (t * 6) % grid;
  const g1x = 30 + 12 * Math.sin(t * 0.35);
  const g1y = 20 + 10 * Math.cos(t * 0.3);
  const g2x = 75 + 10 * Math.cos(t * 0.25);
  const g2y = 80 + 8 * Math.sin(t * 0.4);
  return (
    <AbsoluteFill style={{ backgroundColor: brand.colors.page }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 55% at ${g1x}% ${g1y}%, ${brand.colors.accentSoft}${Math.round(200 * intensity).toString(16).padStart(2, '0')} 0%, transparent 70%),
                       radial-gradient(50% 50% at ${g2x}% ${g2y}%, #e0e7ff${Math.round(150 * intensity).toString(16).padStart(2, '0')} 0%, transparent 70%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${brand.colors.grid}66 1px, transparent 1px), linear-gradient(90deg, ${brand.colors.grid}66 1px, transparent 1px)`,
          backgroundSize: `${grid}px ${grid}px`,
          backgroundPosition: `${dx}px ${dx * 0.6}px`,
          maskImage: 'radial-gradient(75% 70% at 50% 45%, black 30%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(75% 70% at 50% 45%, black 30%, transparent 100%)',
        }}
      />
    </AbsoluteFill>
  );
}
