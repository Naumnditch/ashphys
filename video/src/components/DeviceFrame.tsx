import type { ReactNode } from 'react';
import type { FrameLayout } from '../layout';

/**
 * A browser window or a tablet around a captured screen. Only the frame is
 * drawn here; what is inside is always a capture of the real site.
 */
export function DeviceFrame({ layout, url, children, font }: { layout: FrameLayout; url?: string; children: ReactNode; font: string }) {
  const [ox, oy, ow, oh] = layout.outer;
  const [cx, cy, cw, ch] = layout.content;
  const shadow = '0 40px 90px -20px rgba(15, 23, 42, 0.35), 0 18px 36px -18px rgba(15, 23, 42, 0.3)';
  if (layout.device === 'tablet') {
    return (
      <>
        <div style={{ position: 'absolute', left: ox, top: oy, width: ow, height: oh, borderRadius: layout.radius, background: 'linear-gradient(145deg, #2b2f36, #111317)', boxShadow: `${shadow}, inset 0 0 0 1.5px rgba(255,255,255,0.08)` }} />
        <div style={{ position: 'absolute', left: cx, top: cy, width: cw, height: ch, borderRadius: layout.radius * 0.45, overflow: 'hidden', background: '#fff' }}>{children}</div>
      </>
    );
  }
  const bar = layout.chrome;
  const dot = bar * 0.26;
  return (
    <>
      <div style={{ position: 'absolute', left: ox, top: oy, width: ow, height: oh, borderRadius: layout.radius, background: '#fff', boxShadow: `${shadow}, 0 0 0 1px rgba(15,23,42,0.08)` }} />
      <div
        style={{ position: 'absolute', left: ox, top: oy, width: ow, height: bar, borderRadius: `${layout.radius}px ${layout.radius}px 0 0`, background: '#f3f4f6', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center' }}
      >
        <div style={{ display: 'flex', gap: dot * 0.75, marginLeft: bar * 0.45 }}>
          {['#ff5f57', '#febc2e', '#28c840'].map((c) => (
            <div key={c} style={{ width: dot, height: dot, borderRadius: dot, background: c }} />
          ))}
        </div>
        {url && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              height: bar * 0.6,
              minWidth: ow * 0.34,
              padding: `0 ${bar * 0.4}px`,
              borderRadius: bar * 0.3,
              background: '#fff',
              border: '1px solid #e5e7eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: bar * 0.15,
              fontFamily: font,
              fontSize: bar * 0.3,
              color: '#4b5563',
            }}
          >
            <svg width={bar * 0.26} height={bar * 0.26} viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth={2.4}>
              <rect x="5" y="11" width="14" height="10" rx="2" />
              <path d="M8 11V7a4 4 0 0 1 8 0v4" />
            </svg>
            {url}
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', left: cx, top: cy, width: cw, height: ch, overflow: 'hidden', borderRadius: `0 0 ${layout.radius}px ${layout.radius}px`, background: '#fff' }}>{children}</div>
    </>
  );
}
