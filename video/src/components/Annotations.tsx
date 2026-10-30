import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import type { Pt } from '../handwriting/strokeFont';
import type { Annotation, Rect } from '../types';
import { centredLine, handwrittenText, Ink, lineAt, writingSeconds } from './Handwritten';
import { edgeToward, roughArrow, roughBox, roughCircle, roughRing, roughTick, roughUnderline } from './RoughMark';

/**
 * A scene's `annotations`: handwritten notes, numbered step labels and
 * rough.js marks, placed against real UI (an anchor rect, followed under the
 * camera) or at a fixed point, and written on frame by frame. Drawn in
 * output pixels (line widths don't change with the camera's zoom).
 */

const COLORS: Record<string, string> = {
  marker: '#2563eb',
  red: '#dc2626',
  green: '#16a34a',
  ink: '#111827',
  highlight: '#fde68a',
};

/** Output-space rect of an anchor ("shot:rect") under the current camera, or null. */
export type RectOf = (ref: string) => Rect | null;

interface Geometry {
  strokes: Pt[][];
  width: number;
  color: string;
  /** step: the paper card behind the badge and words. */
  card?: Rect;
  writing: boolean;
}

function geometry(a: Annotation, index: number, rectOf: RectOf, W: number, H: number): Geometry | null {
  const unit = Math.min(W, H) / 1080;
  const color = COLORS[a.color ?? 'marker'] ?? a.color!;
  const seed = a.seed ?? (index + 1) * 97;
  const [ox, oy] = (a.offset ?? [0, 0]).map((v) => v * unit);
  const r: Rect | null = a.anchor ? rectOf(a.anchor) : a.rect ? [a.rect[0] * W, a.rect[1] * H, a.rect[2] * W, a.rect[3] * H] : null;
  if (a.anchor && !r) return null;
  const point = (p: [number, number] | string): Pt | null => {
    if (typeof p === 'string') {
      const q = rectOf(p);
      return q ? [q[0] + q[2] / 2, q[1] + q[3] / 2] : null;
    }
    return [p[0] * W, p[1] * H];
  };
  const pen = (size: number) => Math.max(3 * unit, size * 0.085);

  if (a.kind === 'note') {
    const size = (a.size ?? 56) * unit;
    const t = handwrittenText(a.text ?? '', size);
    const gap = size * 0.45;
    let [x, top] = [0, 0];
    if (r) {
      const side = a.side ?? 'top';
      const alignX = (align: Annotation['align']) => (align === 'left' ? r[0] : align === 'right' ? r[0] + r[2] - t.width : r[0] + r[2] / 2 - t.width / 2);
      if (side === 'top') [x, top] = [alignX(a.align ?? 'center'), r[1] - gap - t.height];
      else if (side === 'bottom') [x, top] = [alignX(a.align ?? 'center'), r[1] + r[3] + gap];
      else if (side === 'left') [x, top] = [r[0] - gap - t.width, r[1] + r[3] / 2 - t.height / 2];
      else [x, top] = [r[0] + r[2] + gap, r[1] + r[3] / 2 - t.height / 2];
    } else {
      const [px, py] = point(a.at ?? [0.5, 0.5])!;
      x = a.align === 'center' ? px - t.width / 2 : a.align === 'right' ? px - t.width : px;
      top = py;
    }
    // Nudged, then kept on screen.
    const m = 24 * unit;
    x = Math.min(Math.max(x + ox, m), W - m - t.width);
    top = Math.min(Math.max(top + oy, m), H - m - t.height);
    const strokes = t.at(x, top);
    if (a.underline) strokes.push(...roughUnderline(x - 4 * unit, x + t.width + 6 * unit, top + t.height + size * 0.28, seed, unit, a.underline === 'double'));
    return { strokes, width: pen(size), color, writing: true };
  }

  if (a.kind === 'step') {
    // A digit in a rough ring, then the words, on a paper card.
    const size = (a.size ?? 54) * unit;
    const [px, py] = point(a.at ?? [0.03, 0.055])!;
    const D = size * 1.75;
    const [cx, cy] = [px + ox + D / 2, py + oy + D / 2];
    const words = lineAt(a.text ?? '', size, px + ox + D + size * 0.45, cy + size / 2);
    const pad = size * 0.38;
    return {
      strokes: [...centredLine(a.number ?? '1', size * 0.95, cx, cy), ...roughRing(cx, cy, D, seed), ...words.strokes],
      width: pen(size),
      color,
      card: [px + ox - pad, py + oy - pad, D + size * 0.45 + words.width + pad * 2, D + pad * 2],
      writing: true,
    };
  }

  const w = 5.5 * unit;
  if (a.kind === 'tick') {
    const c: Pt = r ? [r[0] + r[2] / 2 + ox, r[1] + r[3] / 2 + oy] : point(a.at ?? [0.5, 0.5])!;
    const s = (a.size ?? (r ? Math.max(r[3] / unit * 1.1, 60) : 70)) * unit;
    return { strokes: roughTick(c, s, seed), width: Math.max(w, s * 0.09), color, writing: false };
  }
  if (a.kind === 'arrow') {
    const from = point(a.start ?? [0.5, 0.5]);
    if (!from) return null;
    const S: Pt = [from[0] + ox, from[1] + oy];
    const E = r ? edgeToward(r, S, 14 * unit) : point(a.at ?? [0.5, 0.5])!;
    return { strokes: roughArrow(S, E, seed, unit), width: w, color, writing: false };
  }
  if (!r) return null;
  const pad = (a.pad ?? (a.kind === 'circle' ? 18 : 8)) * unit;
  const R: Rect = [r[0] - pad + ox, r[1] - pad + oy, r[2] + pad * 2, r[3] + pad * 2];
  if (a.kind === 'circle') return { strokes: roughCircle(R, seed), width: w, color, writing: false };
  if (a.kind === 'box') return { strokes: roughBox(R, seed), width: w, color, writing: false };
  const y = r[1] + r[3] + pad + oy;
  return { strokes: roughUnderline(r[0] - 6 * unit + ox, r[0] + r[2] + 6 * unit + ox, y, seed, unit, a.kind === 'double-underline'), width: w, color, writing: false };
}

const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export function Annotations({ items, rectOf }: { items: Annotation[] | undefined; rectOf: RectOf }) {
  const frame = useCurrentFrame();
  const { fps, width: W, height: H } = useVideoConfig();
  if (!items?.length) return null;
  const t = frame / fps;
  const unit = Math.min(W, H) / 1080;
  return (
    <svg width={W} height={H} style={{ position: 'absolute', left: 0, top: 0, overflow: 'visible', pointerEvents: 'none' }}>
      {items.map((a, i) => {
        const cardLead = a.kind === 'step' ? 0.2 : 0;
        if (t < a.from - cardLead) return null;
        const fade = a.to === undefined ? 1 : interpolate(t, [a.to - 0.25, a.to], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
        if (fade <= 0) return null;
        const g = geometry(a, i, rectOf, W, H);
        if (!g) return null;
        // Writing runs at a hand's pace (by length); marks are quicker strokes.
        const draw = a.draw ?? (g.writing ? writingSeconds(g.strokes, 2400 * unit, 0.4, 1.6) : writingSeconds(g.strokes, 3200 * unit, 0.3, 0.8));
        const u = Math.max(0, Math.min(1, (t - a.from) / draw));
        const progress = u >= 1 ? 1 : 0.8 * u + 0.2 * easeInOut(u);
        const pop = g.card ? spring({ frame: frame - Math.round((a.from - cardLead) * fps), fps, config: { damping: 14, stiffness: 170 } }) : 1;
        // A step label sits on a slightly tilted paper card that pops in first; its writing tilts with it.
        const tilt = g.card ? `rotate(-1.2 ${g.card[0]} ${g.card[1] + g.card[3] / 2})` : undefined;
        return (
          <g key={i} opacity={fade} transform={tilt}>
            {g.card && (
              <rect
                x={g.card[0]}
                y={g.card[1]}
                width={g.card[2]}
                height={g.card[3]}
                rx={14 * unit}
                fill="#fffdf7"
                stroke="rgba(15,23,42,0.08)"
                style={{
                  transform: `scale(${pop})`,
                  transformOrigin: `${g.card[0]}px ${g.card[1] + g.card[3] / 2}px`,
                  filter: `drop-shadow(0 ${10 * unit}px ${18 * unit}px rgba(15,23,42,0.18))`,
                }}
              />
            )}
            {pop > 0.6 && <Ink strokes={g.strokes} progress={progress} color={g.color} width={g.width} halo={g.card ? 0 : 7 * unit} />}
          </g>
        );
      })}
    </svg>
  );
}
