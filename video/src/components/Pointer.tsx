/** Cursor, click ripples, tap/pinch indicators and the Apple Pencil–style pen. Drawn in output pixels. */

export function MouseCursor({ x, y, pressed = false, size = 30 }: { x: number; y: number; pressed?: boolean; size?: number }) {
  const s = pressed ? 0.88 : 1;
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 20 28"
      style={{ position: 'absolute', left: x - size * 0.12, top: y - size * 0.06, transform: `scale(${s})`, transformOrigin: '10% 5%', filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.35))' }}
    >
      <path d="M2 1.5v20.5l5.2-5 3.4 8.2 3.6-1.6-3.4-8h7.2z" fill="#111827" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
    </svg>
  );
}

/** Expanding ring where something was clicked or tapped; t = seconds since the click. */
export function Ripple({ x, y, t, color = '#2563eb', size = 70 }: { x: number; y: number; t: number; color?: string; size?: number }) {
  if (t < 0 || t > 0.7) return null;
  const u = t / 0.7;
  const r = size * (0.25 + 0.75 * (1 - (1 - u) ** 3));
  return (
    <div
      style={{
        position: 'absolute',
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        border: `${Math.max(2, size * 0.05)}px solid ${color}`,
        background: `${color}22`,
        opacity: 1 - u,
      }}
    />
  );
}

/** Two fingertips spreading apart (a pinch-zoom gesture); progress 0–1. */
export function PinchIndicator({ x, y, progress, size = 54, opacity = 1 }: { x: number; y: number; progress: number; size?: number; opacity?: number }) {
  const spread = size * (0.9 + 1.6 * progress);
  const dot = (dx: number, dy: number) => (
    <div
      style={{
        position: 'absolute',
        left: x + dx - size / 2,
        top: y + dy - size / 2,
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.55)',
        border: '3px solid rgba(37,99,235,0.9)',
        boxShadow: '0 4px 14px rgba(15,23,42,0.25)',
      }}
    />
  );
  return (
    <div style={{ opacity }}>
      {dot(-spread * 0.7, spread * 0.7)}
      {dot(spread * 0.7, -spread * 0.7)}
    </div>
  );
}

/**
 * An Apple Pencil–style stylus whose tip sits at (x, y): white body, grey
 * cone, dark nib, leaning like a right-handed writer's. `lift` (0–1) raises
 * it off the page between strokes (bigger shadow, slight offset).
 */
export function PencilCursor({ x, y, size = 220, lift = 0, opacity = 1 }: { x: number; y: number; size?: number; lift?: number; opacity?: number }) {
  const w = size * 0.075;
  const raise = lift * size * 0.05;
  return (
    <div style={{ position: 'absolute', left: x, top: y - raise, width: 0, height: 0, opacity, pointerEvents: 'none' }}>
      {/* Contact shadow on the page */}
      <div
        style={{
          position: 'absolute',
          left: -w * 0.5 + raise * 0.6,
          top: -w * 0.18 + raise,
          width: w,
          height: w * 0.36,
          borderRadius: '50%',
          background: `rgba(15,23,42,${0.25 - lift * 0.12})`,
          filter: `blur(${2 + lift * 4}px)`,
        }}
      />
      <svg
        width={size * 0.5}
        height={size}
        viewBox="0 0 50 100"
        style={{ position: 'absolute', left: 0, top: -size, transform: 'rotate(28deg)', transformOrigin: '0% 100%', overflow: 'visible', filter: `drop-shadow(0 0 1px rgba(15,23,42,0.45)) drop-shadow(${6 + lift * 8}px ${8 + lift * 10}px ${6 + lift * 6}px rgba(15,23,42,0.35))` }}
      >
        <defs>
          <linearGradient id="pencil-body" x1="0" x2="1">
            <stop offset="0" stopColor="#cbd5e1" />
            <stop offset="0.4" stopColor="#ffffff" />
            <stop offset="1" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="pencil-cone" x1="0" x2="1">
            <stop offset="0" stopColor="#cbd5e1" />
            <stop offset="0.5" stopColor="#f1f5f9" />
            <stop offset="1" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        {/* Body: x from 0 to 7.5 (width w), tip at (0, 100) after the rotation origin */}
        <rect x={-3.75} y={4} width={7.5} height={74} rx={3.2} fill="url(#pencil-body)" stroke="#64748b" strokeWidth={0.55} />
        <rect x={-3.75} y={4} width={7.5} height={6} rx={3} fill="#e2e8f0" />
        <path d="M-3.75 78 L3.75 78 L0.9 96.5 L-0.9 96.5 Z" fill="url(#pencil-cone)" stroke="#94a3b8" strokeWidth={0.3} />
        <path d="M-0.9 96.5 L0.9 96.5 L0 100 Z" fill="#334155" />
      </svg>
    </div>
  );
}
