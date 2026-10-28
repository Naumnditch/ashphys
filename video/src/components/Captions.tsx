import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { Caption } from '../types';

/** Burned-in captions (readable without sound), in sync with the .srt/.vtt the build writes. */
export function Captions({ captions, font }: { captions: Caption[]; font: string }) {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;
  const cap = captions.find((c) => t >= c.from && t < c.to);
  if (!cap) return null;
  const portrait = height > width;
  const fadeIn = Math.min(1, (t - cap.from) / 0.18);
  const fadeOut = Math.min(1, (cap.to - t) / 0.18);
  const a = Math.min(fadeIn, fadeOut);
  const size = portrait ? width * 0.05 : height * 0.036;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: portrait ? height * 0.1 : height * 0.045,
        display: 'flex',
        justifyContent: 'center',
        padding: `0 ${width * 0.06}px`,
        opacity: a,
        transform: `translateY(${(1 - a) * 8}px)`,
      }}
    >
      <div
        style={{
          fontFamily: font,
          fontWeight: 600,
          fontSize: size,
          lineHeight: 1.3,
          color: '#fff',
          background: 'rgba(17,24,39,0.84)',
          borderRadius: size * 0.42,
          padding: `${size * 0.32}px ${size * 0.7}px`,
          textAlign: 'center',
          maxWidth: portrait ? '100%' : width * 0.72,
          boxShadow: '0 8px 24px rgba(15,23,42,0.25)',
          letterSpacing: '-0.005em',
        }}
      >
        {cap.text}
      </div>
    </div>
  );
}
