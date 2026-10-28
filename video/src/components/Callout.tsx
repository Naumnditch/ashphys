import { spring, useCurrentFrame, useVideoConfig } from 'remotion';

/** A label with a pointer, anchored to a point in output pixels. */
export function Callout({
  x,
  y,
  text,
  side = 'left',
  from,
  to,
  font,
  accent,
}: {
  x: number;
  y: number;
  text: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
  from: number;
  to: number;
  font: string;
  accent: string;
}) {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();
  const t = frame / fps;
  if (t < from || t > to) return null;
  const inS = spring({ frame: frame - from * fps, fps, config: { damping: 14, stiffness: 160 } });
  const out = Math.min(1, (to - t) / 0.2);
  const size = Math.min(width, height) * 0.032;
  const gap = size * 1.3;
  const pos: Record<string, React.CSSProperties> = {
    left: { right: width - x + gap, top: y, transform: `translateY(-50%) scale(${inS})`, transformOrigin: 'right center' },
    right: { left: x + gap, top: y, transform: `translateY(-50%) scale(${inS})`, transformOrigin: 'left center' },
    top: { left: x, bottom: height - y + gap, transform: `translateX(-50%) scale(${inS})`, transformOrigin: 'center bottom' },
    bottom: { left: x, top: y + gap, transform: `translateX(-50%) scale(${inS})`, transformOrigin: 'center top' },
  };
  return (
    <>
      <div style={{ position: 'absolute', left: x - size * 0.45, top: y - size * 0.45, width: size * 0.9, height: size * 0.9, borderRadius: '50%', background: accent, opacity: out * inS, boxShadow: `0 0 0 ${size * 0.35}px ${accent}33` }} />
      <div
        style={{
          position: 'absolute',
          ...pos[side],
          opacity: out,
          fontFamily: font,
          fontWeight: 700,
          fontSize: size,
          color: '#fff',
          background: accent,
          padding: `${size * 0.38}px ${size * 0.7}px`,
          borderRadius: size * 2,
          whiteSpace: 'nowrap',
          boxShadow: '0 10px 30px rgba(37,99,235,0.35)',
        }}
      >
        {text}
      </div>
    </>
  );
}
