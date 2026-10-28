import { useMemo } from 'react';
import type { HwStroke } from '@site/lib/handwriting/types';
import { fmt, freehandOutline, isFreehand, outlineToPathData, strokeBounds, unionBounds } from '@site/lib/handwriting/geometry';
import { strokeSvg } from '@site/lib/handwriting/svg';
import type { Rect } from '../types';
import { paintedBox } from './snap';
import { stateAt, type ReplayTimeline } from './timeline';

export interface ReplayHighlight {
  label: string;
  /** Stroke indices (stored order) that make up the highlighted result. */
  indices: number[];
}

export interface HandwritingReplayProps {
  timeline: ReplayTimeline;
  /** Seconds into the replay. */
  time: number;
  /** The viewer's box on the screen: the replay is clipped to it, like the real viewer. */
  clip: Rect;
  /**
   * The captured viewer's SVG setup: its viewBox and, per doc page, the
   * translate() of that page's group (null for an empty page). The replay
   * builds the same SVG so the browser lays the ink out exactly like the site.
   */
  viewer: { viewBox: string; pageOffsets: ([number, number] | null)[] };
  highlights?: ReplayHighlight[];
  highlightColor?: string;
  ringColor?: string;
  /** Small dot at the pen tip while it writes. */
  tipDot?: boolean;
  /** Debug: number every stroke at its first point; colour the active one. */
  showIndices?: boolean;
}

/** Seconds a highlight takes: fade in, two soft pulses, fade out (always gone before the page's final state). */
export const HIGHLIGHT_SECONDS = 1.7;

/**
 * Replays stored handwriting as if it were being written: every finished
 * stroke is drawn with exactly the markup the site renders for students
 * (lib/handwriting/svg.ts), and the stroke in progress grows point by point
 * through perfect-freehand with its stored pressure, colour, width, opacity
 * and tool. The layer is transparent and positioned in screen pixels, so it
 * sits exactly over the captured viewer (same matrix, same clip).
 */
export function HandwritingReplay({
  timeline,
  time,
  clip,
  viewer,
  highlights = [],
  highlightColor = '#fde68a',
  ringColor = '#2563eb',
  tipDot = true,
  showIndices = false,
}: HandwritingReplayProps) {
  // Precomputed once: the finished markup of every stroke (the expensive part).
  const finished = useMemo(() => timeline.strokes.map((s) => strokeSvg(s.stroke)), [timeline]);
  const marks = useMemo(
    () =>
      highlights
        .map((h) => {
          const strokes = h.indices.map((i) => timeline.strokes[i]).filter(Boolean);
          const b = unionBounds(strokes.map((s) => strokeBounds(s.stroke)));
          if (!b || strokes.length === 0) return null;
          return { ...h, box: b, page: strokes[0].page, at: Math.max(...strokes.map((s) => s.end)) };
        })
        .filter((m): m is NonNullable<typeof m> => m !== null),
    [highlights, timeline]
  );

  const state = stateAt(timeline, time);
  const pages = viewer.pageOffsets.length;
  const markup: string[] = Array.from({ length: pages }, () => '');
  for (let i = 0; i < state.done; i++) {
    const s = timeline.strokes[i];
    if (s.page < pages) markup[s.page] += finished[i];
  }

  const box = paintedBox(clip);
  const active = state.active;
  let partial: JSX.Element | null = null;
  if (active) partial = <PartialStroke stroke={active.stroke.stroke} points={active.points} head={active.head} pressure={active.headPressure} path={active.stroke.path} />;

  return (
    <svg
      width={box[2]}
      height={box[3]}
      viewBox={viewer.viewBox}
      preserveAspectRatio="xMinYMin meet"
      style={{ position: 'absolute', left: box[0], top: box[1], overflow: 'hidden' }}
    >
      {viewer.pageOffsets.map((o, page) => o && (
        <g key={page} transform={`translate(${o[0]} ${o[1]})`}>
          {marks
            .filter((h) => h.page === page)
            .map((h) => (
              <HighlightMark key={h.label} box={h.box} t={time - h.at} fill={highlightColor} ring={ringColor} />
            ))}
          <g dangerouslySetInnerHTML={{ __html: markup[page] }} />
          {active && active.stroke.page === page && partial}
          {tipDot && active && active.stroke.page === page && (
            <circle cx={active.head[0]} cy={active.head[1]} r={Math.max(1.2, active.stroke.stroke.width * 0.75)} fill={active.stroke.stroke.color} opacity={0.9} />
          )}
          {showIndices &&
            timeline.strokes
              .filter((s) => s.page === page && s.index < state.done + 1)
              .map((s) => (
                <text
                  key={s.index}
                  x={s.path[0][0]}
                  y={s.path[0][1] - 2}
                  fontSize={6}
                  fontFamily="monospace"
                  fill={active?.stroke.index === s.index ? '#dc2626' : '#6b7280'}
                  stroke="#fff"
                  strokeWidth={1.5}
                  paintOrder="stroke"
                >
                  {s.index}
                </text>
              ))}
        </g>
      ))}
    </svg>
  );
}

function PartialStroke({
  stroke,
  points,
  head,
  pressure,
  path,
}: {
  stroke: HwStroke;
  points: number;
  head: [number, number];
  pressure: number;
  path: [number, number][];
}) {
  const opacity = stroke.opacity < 1 ? stroke.opacity : undefined;
  if (isFreehand(stroke)) {
    // The live canvas draws a stroke in progress the same way: outline of the points so far, `last: false`.
    const pts = stroke.points.slice(0, points).map((q) => [q[0], q[1], q[2]] as [number, number, number]);
    pts.push([head[0], head[1], pressure]);
    const d = outlineToPathData(freehandOutline({ ...stroke, points: pts }, false));
    return <path d={d} fill={stroke.color} fillOpacity={opacity} style={stroke.tool === 'highlighter' ? { mixBlendMode: 'multiply' } : undefined} />;
  }
  // Shapes grow along their outline; the finished shape (arrow head included) appears when complete.
  const line = [...path.slice(0, points), head];
  const d = stroke.shape === 'line' || stroke.shape === 'arrow' ? `M${fmt(path[0][0])} ${fmt(path[0][1])}L${fmt(head[0])} ${fmt(head[1])}` : `M${line.map((q) => `${fmt(q[0])} ${fmt(q[1])}`).join('L')}`;
  return (
    <path d={d} fill="none" stroke={stroke.color} strokeWidth={stroke.width} strokeLinecap="round" strokeLinejoin="round" strokeOpacity={opacity} />
  );
}

/** A soft marker behind a finished result, pulsing twice, gone after HIGHLIGHT_SECONDS. */
function HighlightMark({ box, t, fill, ring }: { box: { minX: number; minY: number; maxX: number; maxY: number }; t: number; fill: string; ring: string }) {
  if (t < 0 || t > HIGHLIGHT_SECONDS) return null;
  const pad = 7;
  const x = box.minX - pad;
  const y = box.minY - pad;
  const w = box.maxX - box.minX + pad * 2;
  const h = box.maxY - box.minY + pad * 2;
  const fadeIn = Math.min(1, t / 0.2);
  const fadeOut = Math.min(1, (HIGHLIGHT_SECONDS - t) / 0.35);
  const pulse = 0.5 + 0.5 * Math.sin(Math.min(1, t / 1.2) * Math.PI * 4 - Math.PI / 2);
  const alpha = Math.min(fadeIn, fadeOut);
  const grow = 1 + 0.05 * pulse;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const ringT = Math.min(1, t / 0.8);
  return (
    <g>
      <rect
        x={cx - (w * grow) / 2}
        y={cy - (h * grow) / 2}
        width={w * grow}
        height={h * grow}
        rx={8}
        fill={fill}
        opacity={alpha * (0.55 + 0.2 * pulse)}
        style={{ mixBlendMode: 'multiply' }}
      />
      <rect
        x={cx - (w * (1 + 0.25 * ringT)) / 2}
        y={cy - (h * (1 + 0.6 * ringT)) / 2}
        width={w * (1 + 0.25 * ringT)}
        height={h * (1 + 0.6 * ringT)}
        rx={10}
        fill="none"
        stroke={ring}
        strokeWidth={2}
        vectorEffect="non-scaling-stroke"
        opacity={(1 - ringT) * 0.7 * alpha}
      />
    </g>
  );
}
