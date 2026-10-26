/**
 * Question figures for the AS Level (9702) Chapter 6 "Momentum" practice
 * banks (6.1 The idea of momentum, 6.2 Conservation of momentum and
 * collisions, 6.3 Understanding collisions) — originals, not reproduced from
 * any textbook or exam paper.
 *
 * Like KinematicsDiagrams.tsx these are parametric: each figure is a small
 * set of numbers/labels written by the seed generator
 * (database/seeds/2026-10-26-as-momentum-collisions.py) into
 * momentumBankDiagramData.ts, so a figure is built from the same values as
 * its question and cannot drift from it. Keys look like "diagram:mom6-…" and
 * are merged into the shared getDiagram() dispatch in MomentumDiagrams.tsx,
 * which serves both the practice page and the worksheet PDF.
 *
 * Everything here is a plain function component with no hooks, because the
 * worksheet PDF renderer (toSvgMarkup in lib/practice/worksheetPdf.ts) calls
 * components directly. Only SVG elements are used (no HTML), so every figure
 * also prints in the PDF.
 */

import type { ReactNode } from 'react';
import { MotionGraph } from './KinematicsDiagrams';
import { MOMENTUM_BANK_DIAGRAM_DATA } from './momentumBankDiagramData';

const INK = 'rgb(var(--h-1b2a41))';
const MUTE = 'rgb(var(--h-4a5a72))';
const BRASS = 'rgb(var(--h-b8823d))';
const TEAL = 'rgb(var(--h-2e7d6b))';
const RED = 'rgb(var(--h-b34a3c))';
const GRID = 'rgb(var(--h-d8cfb6))';
const PAPER = 'rgb(var(--h-faf7f0))';
const BORDER = 'rgb(var(--h-e4ddcc))';
const CARD = 'rgb(var(--h-ffffff))';
const TINT = 'rgb(var(--h-f6efdc))';
const SERIF = 'Georgia, serif';
const MONO = 'ui-monospace, monospace';

function Frame({ width, height, children }: { width: number; height: number; children: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full max-w-lg mx-auto"
      style={{ background: PAPER, borderRadius: 8, border: `1px solid ${BORDER}` }}
    >
      <defs>
        <marker id="m6-arrow-teal" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={TEAL} />
        </marker>
        <marker id="m6-arrow-red" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={RED} />
        </marker>
        <marker id="m6-dim-end" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={MUTE} />
        </marker>
        <marker id="m6-dim-start" markerWidth="8" markerHeight="8" refX="0" refY="3" orient="auto">
          <path d="M6,0 L0,3 L6,6 Z" fill={MUTE} />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

function Txt({
  x,
  y,
  children,
  size = 11.5,
  color = INK,
  bold = false,
  anchor = 'middle',
  italic = false,
  mono = false,
}: {
  x: number;
  y: number;
  children: ReactNode;
  size?: number;
  color?: string;
  bold?: boolean;
  anchor?: 'start' | 'middle' | 'end';
  italic?: boolean;
  mono?: boolean;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      fontSize={size}
      fontWeight={bold ? 700 : 400}
      fontStyle={italic ? 'italic' : 'normal'}
      fill={color}
      fontFamily={mono ? MONO : SERIF}
    >
      {children}
    </text>
  );
}

/** Vertical dimension line with arrowheads at both ends and a label to its right. */
function VDim({ x, y1, y2, label }: { x: number; y1: number; y2: number; label: string }) {
  return (
    <g>
      <line x1={x} y1={y1 + 2} x2={x} y2={y2 - 2} stroke={MUTE} strokeWidth={1.2} markerStart="url(#m6-dim-start)" markerEnd="url(#m6-dim-end)" />
      <Txt x={x + 7} y={(y1 + y2) / 2 + 4} size={11} color={MUTE} anchor="start" italic>
        {label}
      </Txt>
    </g>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 1. Collisions: BEFORE / AFTER panels (or a single "situation" panel).
// ─────────────────────────────────────────────────────────────────────────

export type BodyShape = 'trolley' | 'ball' | 'block' | 'puck' | 'person' | 'car';

export interface Body {
  /** Text drawn on (or under) the body: usually its mass, e.g. "2.0 kg". */
  mass: string;
  /** Optional name drawn under the body ("A", "skater", "wrench"). */
  name?: string;
  /** Velocity label over the arrow, e.g. "3.0 m s⁻¹". Ignored when dir is 0. */
  v?: string;
  /** Direction of motion: 1 right, -1 left, 0 at rest. */
  dir: 1 | -1 | 0;
  /** The quantity being solved for: arrow and label drawn in red. */
  unknown?: boolean;
  shape?: BodyShape;
  /** Width override in px (a "stuck together" pair is drawn as one wide body). */
  w?: number;
}

export interface CollisionProps {
  before: Body[];
  after?: Body[];
  /** Draw a fixed wall at the right-hand edge of each panel. */
  wall?: boolean;
  /** Small monospace footnote, e.g. "taking right as positive". */
  note?: string;
  surface?: 'track' | 'ice' | 'floor';
  /** Panel headings; default BEFORE / AFTER. */
  titles?: [string, string];
}

const GROUND = 150;

function bodyWidth(b: Body): number {
  if (b.w) return b.w;
  switch (b.shape ?? 'trolley') {
    case 'ball':
      return 34;
    case 'puck':
      return 46;
    case 'person':
      return 34;
    case 'block':
      return 58;
    case 'car':
      return 100;
    default:
      return 66;
  }
}

/** Draws one body standing on the ground line with its left edge at x; returns the y of its top. */
function BodyShapeAt({ b, x }: { b: Body; x: number }): { node: ReactNode; top: number } {
  const w = bodyWidth(b);
  const cx = x + w / 2;
  const shape = b.shape ?? 'trolley';
  if (shape === 'ball') {
    const r = w / 2;
    return {
      top: GROUND - 2 * r,
      node: (
        <g>
          <circle cx={cx} cy={GROUND - r} r={r} fill={CARD} stroke={INK} strokeWidth={1.8} />
          {/* a label only fits inside a big ball; small balls get it underneath */}
          <Txt x={cx} y={r >= 22 ? GROUND - r + 4 : GROUND + 16} size={10.5} bold>
            {b.mass}
          </Txt>
        </g>
      ),
    };
  }
  if (shape === 'puck') {
    return {
      top: GROUND - 16,
      node: (
        <g>
          <ellipse cx={cx} cy={GROUND - 5} rx={w / 2} ry={5} fill={INK} />
          <rect x={x} y={GROUND - 16} width={w} height={11} fill={INK} />
          <ellipse cx={cx} cy={GROUND - 16} rx={w / 2} ry={5} fill={MUTE} />
          <Txt x={cx} y={GROUND + 16} size={10.5} bold>
            {b.mass}
          </Txt>
        </g>
      ),
    };
  }
  if (shape === 'person') {
    const head = GROUND - 62;
    return {
      top: head - 9,
      node: (
        <g stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round">
          <circle cx={cx} cy={head} r={8} fill={CARD} />
          <line x1={cx} y1={head + 8} x2={cx} y2={GROUND - 26} />
          <line x1={cx} y1={head + 16} x2={cx - 11} y2={head + 32} />
          <line x1={cx} y1={head + 16} x2={cx + 11} y2={head + 32} />
          <line x1={cx} y1={GROUND - 26} x2={cx - 8} y2={GROUND - 3} />
          <line x1={cx} y1={GROUND - 26} x2={cx + 8} y2={GROUND - 3} />
          <line x1={cx - 15} y1={GROUND - 1} x2={cx + 15} y2={GROUND - 1} strokeWidth={2.4} />
          <text x={cx} y={GROUND + 16} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={INK} stroke="none" fontFamily={SERIF}>
            {b.mass}
          </text>
        </g>
      ),
    };
  }
  if (shape === 'block') {
    return {
      top: GROUND - 32,
      node: (
        <g>
          <rect x={x} y={GROUND - 32} width={w} height={32} fill={TINT} stroke={INK} strokeWidth={1.8} />
          <Txt x={cx} y={w < 50 ? GROUND + 16 : GROUND - 12} size={11} bold>
            {b.mass}
          </Txt>
        </g>
      ),
    };
  }
  if (shape === 'car') {
    // Body from GROUND-46 to GROUND-13, small wheels below it, so the mass label
    // sits in the lower body clear of both the cabin and the wheels.
    return {
      top: GROUND - 46,
      node: (
        <g>
          <path
            d={`M${x + 3},${GROUND - 13} L${x + 3},${GROUND - 30} L${x + w * 0.22},${GROUND - 32} L${x + w * 0.34},${GROUND - 46} L${x + w * 0.7},${GROUND - 46} L${x + w * 0.82},${GROUND - 32} L${x + w - 3},${GROUND - 29} L${x + w - 3},${GROUND - 13} Z`}
            fill={CARD}
            stroke={INK}
            strokeWidth={1.8}
          />
          <circle cx={x + w * 0.22} cy={GROUND - 7} r={7} fill={INK} />
          <circle cx={x + w * 0.78} cy={GROUND - 7} r={7} fill={INK} />
          <Txt x={cx} y={GROUND - 17.5} size={10.5} bold>
            {b.mass}
          </Txt>
        </g>
      ),
    };
  }
  // trolley
  return {
    top: GROUND - 44,
    node: (
      <g>
        <rect x={x} y={GROUND - 44} width={w} height={32} rx={5} fill={CARD} stroke={INK} strokeWidth={1.8} />
        <circle cx={x + w * 0.24} cy={GROUND - 6} r={6} fill={INK} />
        <circle cx={x + w * 0.76} cy={GROUND - 6} r={6} fill={INK} />
        <Txt x={cx} y={GROUND - 24} size={11.5} bold>
          {b.mass}
        </Txt>
      </g>
    ),
  };
}

/** True when the body's mass label is drawn under the ground line, so its name goes one line lower. */
function labelBelow(b: Body): boolean {
  const shape = b.shape ?? 'trolley';
  return shape === 'puck' || shape === 'person' || (shape === 'ball' && bodyWidth(b) < 44) || (shape === 'block' && bodyWidth(b) < 50);
}

function VelocityArrow({ b, cx, top }: { b: Body; cx: number; top: number }) {
  const y = top - 14;
  if (b.dir === 0) {
    return (
      <Txt x={cx} y={y + 2} size={11} color={MUTE} bold>
        at rest
      </Txt>
    );
  }
  const color = b.unknown ? RED : TEAL;
  const marker = b.unknown ? 'url(#m6-arrow-red)' : 'url(#m6-arrow-teal)';
  const half = 22;
  return (
    <g>
      <line
        x1={b.dir === 1 ? cx - half : cx + half}
        y1={y}
        x2={b.dir === 1 ? cx + half : cx - half}
        y2={y}
        stroke={color}
        strokeWidth={2.2}
        markerEnd={marker}
      />
      <Txt x={cx} y={y - 10} size={12} color={color} bold italic>
        {b.v ?? '?'}
      </Txt>
    </g>
  );
}

function Panel({ bodies, x0, x1, wall }: { bodies: Body[]; x0: number; x1: number; wall?: boolean }) {
  const usable = x1 - x0 - (wall ? 20 : 0);
  const widths = bodies.map(bodyWidth);
  const total = widths.reduce((s, w) => s + w, 0);
  const gap = bodies.length > 1 ? Math.min(46, Math.max(8, (usable - total - 24) / (bodies.length - 1))) : 0;
  const span = total + gap * (bodies.length - 1);
  let x = x0 + Math.max(8, (usable - span) / 2);
  const nodes: ReactNode[] = [];
  bodies.forEach((b, i) => {
    const w = widths[i];
    const drawn = BodyShapeAt({ b, x });
    nodes.push(
      <g key={i}>
        {drawn.node}
        <VelocityArrow b={b} cx={x + w / 2} top={drawn.top} />
        {b.name && (
          <Txt x={x + w / 2} y={GROUND + (labelBelow(b) ? 30 : 16)} size={10.5} color={MUTE} italic>
            {b.name}
          </Txt>
        )}
      </g>
    );
    x += w + gap;
  });
  return (
    <g>
      {nodes}
      {wall && (
        <g>
          <line x1={x1 - 14} y1={50} x2={x1 - 14} y2={GROUND} stroke={INK} strokeWidth={3} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((k) => (
            <line key={k} x1={x1 - 14} y1={58 + k * 12} x2={x1 - 4} y2={50 + k * 12} stroke={MUTE} strokeWidth={1} />
          ))}
        </g>
      )}
    </g>
  );
}

export function CollisionPanels({ before, after, wall, note, surface = 'track', titles }: CollisionProps) {
  const two = !!after;
  const width = two ? 560 : 460;
  const height = note ? 212 : 196;
  const groundStroke = surface === 'ice' ? TEAL : MUTE;
  const groundDash = surface === 'ice' ? '10 4' : undefined;
  const mid = width / 2;
  const [t0, t1] = titles ?? ['BEFORE', 'AFTER'];
  return (
    <Frame width={width} height={height}>
      {two ? (
        <g>
          <line x1={14} y1={GROUND} x2={mid - 12} y2={GROUND} stroke={groundStroke} strokeWidth={1.5} strokeDasharray={groundDash} />
          <line x1={mid + 12} y1={GROUND} x2={width - 14} y2={GROUND} stroke={groundStroke} strokeWidth={1.5} strokeDasharray={groundDash} />
          <line x1={mid} y1={12} x2={mid} y2={height - 26} stroke={GRID} strokeWidth={1.2} strokeDasharray="4 4" />
          <Txt x={mid / 2} y={22} size={10.5} color={MUTE} bold mono>
            {t0}
          </Txt>
          <Txt x={(3 * width) / 4} y={22} size={10.5} color={MUTE} bold mono>
            {t1}
          </Txt>
          <Panel bodies={before} x0={14} x1={mid - 12} wall={wall} />
          <Panel bodies={after!} x0={mid + 12} x1={width - 14} wall={wall} />
        </g>
      ) : (
        <g>
          <line x1={14} y1={GROUND} x2={width - 14} y2={GROUND} stroke={groundStroke} strokeWidth={1.5} strokeDasharray={groundDash} />
          {titles && (
            <Txt x={width / 2} y={22} size={10.5} color={MUTE} bold mono>
              {t0}
            </Txt>
          )}
          <Panel bodies={before} x0={14} x1={width - 14} wall={wall} />
        </g>
      )}
      {surface === 'ice' && (
        <Txt x={width - 18} y={40} size={9.5} color={TEAL} anchor="end" mono>
          frictionless ice
        </Txt>
      )}
      {note && (
        <Txt x={width / 2} y={height - 8} size={10} color={MUTE} mono>
          {note}
        </Txt>
      )}
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 2. Line-up of objects as cards (mass and velocity of each).
// ─────────────────────────────────────────────────────────────────────────

export interface LineupProps {
  items: { name: string; mass: string; speed: string }[];
  caption?: string;
}

export function Lineup({ items, caption }: LineupProps) {
  const cardW = 124;
  const gap = 12;
  const width = items.length * cardW + (items.length - 1) * gap + 32;
  const height = caption ? 132 : 116;
  return (
    <Frame width={width} height={height}>
      {items.map((it, i) => {
        const x = 16 + i * (cardW + gap);
        return (
          <g key={i}>
            <rect x={x} y={16} width={cardW} height={84} rx={8} fill={CARD} stroke={INK} strokeWidth={1.4} />
            <rect x={x} y={16} width={cardW} height={24} rx={8} fill={TINT} stroke="none" />
            <line x1={x} y1={40} x2={x + cardW} y2={40} stroke={GRID} strokeWidth={1} />
            <Txt x={x + cardW / 2} y={33} size={11.5} bold>
              {it.name}
            </Txt>
            <Txt x={x + cardW / 2} y={64} size={11.5}>
              {`m = ${it.mass}`}
            </Txt>
            <Txt x={x + cardW / 2} y={86} size={11.5} color={TEAL}>
              {`v = ${it.speed}`}
            </Txt>
          </g>
        );
      })}
      {caption && (
        <Txt x={width / 2} y={height - 10} size={10} color={MUTE} mono>
          {caption}
        </Txt>
      )}
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 3. Drop and bounce: a ball released from h1 rebounds to h2. With
//    stacked=true a small ball sits on a large one (the "stacked ball" drop).
// ─────────────────────────────────────────────────────────────────────────

export interface DropProps {
  h1: number;
  h2: number;
  h1Label: string;
  h2Label: string;
  ballLabel?: string;
  stacked?: boolean;
  smallLabel?: string;
  caption?: string;
}

export function DropBounce({ h1, h2, h1Label, h2Label, ballLabel, stacked, smallLabel, caption }: DropProps) {
  const width = 380;
  const height = 270;
  const floor = 236;
  const top = 34;
  const scale = (floor - top - 20) / Math.max(h1, h2);
  const yAt = (h: number) => floor - h * scale;
  const r = stacked ? 18 : 12;
  const xDrop = 110;
  const xUp = 250;
  const yStart = yAt(h1);
  const yEnd = yAt(h2);
  return (
    <Frame width={width} height={height}>
      {/* floor */}
      <line x1={30} y1={floor} x2={width - 30} y2={floor} stroke={INK} strokeWidth={2} />
      {Array.from({ length: 16 }, (_, k) => (
        <line key={k} x1={36 + k * 20} y1={floor + 10} x2={46 + k * 20} y2={floor} stroke={MUTE} strokeWidth={1} />
      ))}
      {/* release position */}
      <circle cx={xDrop} cy={yStart - r} r={r} fill={CARD} stroke={INK} strokeWidth={1.8} />
      {stacked && <circle cx={xDrop} cy={yStart - 2 * r - 7} r={7} fill={TINT} stroke={INK} strokeWidth={1.5} />}
      {ballLabel && (
        <Txt x={xDrop - r - 8} y={yStart - r + 4} size={10.5} anchor="end" bold>
          {ballLabel}
        </Txt>
      )}
      {stacked && smallLabel && (
        <Txt x={xDrop + 14} y={yStart - 2 * r - 10} size={10.5} anchor="start" bold>
          {smallLabel}
        </Txt>
      )}
      {/* fall path and rebound path */}
      <line x1={xDrop} y1={yStart + 4} x2={xDrop} y2={floor - 4} stroke={TEAL} strokeWidth={1.6} strokeDasharray="5 4" markerEnd="url(#m6-arrow-teal)" />
      <path
        d={`M${xDrop + 6},${floor - 2} Q${(xDrop + xUp) / 2},${floor - 26} ${xUp},${floor - 30} L${xUp},${yEnd + 6}`}
        fill="none"
        stroke={TEAL}
        strokeWidth={1.6}
        strokeDasharray="5 4"
        markerEnd="url(#m6-arrow-teal)"
      />
      <circle cx={xUp} cy={yEnd - (stacked ? 7 : r)} r={stacked ? 7 : r} fill="none" stroke={INK} strokeWidth={1.5} strokeDasharray="3 3" />
      {/* heights */}
      <line x1={xDrop - 30} y1={yStart} x2={xDrop + 26} y2={yStart} stroke={GRID} strokeWidth={1} strokeDasharray="3 3" />
      <line x1={xUp - 26} y1={yEnd} x2={xUp + 40} y2={yEnd} stroke={GRID} strokeWidth={1} strokeDasharray="3 3" />
      <VDim x={xDrop - 52} y1={yStart} y2={floor} label={h1Label} />
      <VDim x={xUp + 46} y1={yEnd} y2={floor} label={h2Label} />
      {caption && (
        <Txt x={width - 14} y={22} size={9.5} color={MUTE} anchor="end" mono>
          {caption}
        </Txt>
      )}
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// 4. Ballistic pendulum: a projectile embeds in a block hung on two strings,
//    which then swings up through a height h.
// ─────────────────────────────────────────────────────────────────────────

export interface PendulumProps {
  bulletLabel: string;
  speedLabel: string;
  blockLabel: string;
  hLabel: string;
}

export function BallisticPendulum({ bulletLabel, speedLabel, blockLabel, hLabel }: PendulumProps) {
  const width = 500;
  const height = 250;
  const pivotY = 30;
  const L = 150;
  const restX = 236;
  const bw = 64;
  const bh = 36;
  const theta = 0.68; // radians, drawing only
  const sx = L * Math.sin(theta);
  const rise = L * (1 - Math.cos(theta));
  const restTop = pivotY + L;
  const swungTop = restTop - rise;
  return (
    <Frame width={width} height={height}>
      {/* support */}
      <rect x={restX - 70} y={pivotY - 12} width={190} height={12} fill={TINT} stroke={INK} strokeWidth={1.4} />
      {/* rest position (dashed) */}
      <line x1={restX - 18} y1={pivotY} x2={restX - 18} y2={restTop} stroke={MUTE} strokeWidth={1} strokeDasharray="4 3" />
      <line x1={restX + 18} y1={pivotY} x2={restX + 18} y2={restTop} stroke={MUTE} strokeWidth={1} strokeDasharray="4 3" />
      <rect x={restX - bw / 2} y={restTop} width={bw} height={bh} fill="none" stroke={MUTE} strokeWidth={1.2} strokeDasharray="4 3" />
      <Txt x={restX} y={restTop + bh / 2 + 4} size={11} color={MUTE} bold>
        {blockLabel}
      </Txt>
      {/* swung position */}
      <line x1={restX - 18} y1={pivotY} x2={restX - 18 + sx} y2={swungTop} stroke={INK} strokeWidth={1.4} />
      <line x1={restX + 18} y1={pivotY} x2={restX + 18 + sx} y2={swungTop} stroke={INK} strokeWidth={1.4} />
      <rect x={restX - bw / 2 + sx} y={swungTop} width={bw} height={bh} fill={TINT} stroke={INK} strokeWidth={1.8} />
      {/* height gained */}
      <line x1={restX + bw / 2} y1={restTop + bh} x2={restX + bw / 2 + sx + 70} y2={restTop + bh} stroke={GRID} strokeWidth={1} strokeDasharray="3 3" />
      <line x1={restX + bw / 2 + sx} y1={swungTop + bh} x2={restX + bw / 2 + sx + 70} y2={swungTop + bh} stroke={GRID} strokeWidth={1} strokeDasharray="3 3" />
      <VDim x={restX + bw / 2 + sx + 52} y1={swungTop + bh} y2={restTop + bh} label={hLabel} />
      {/* bullet */}
      <rect x={50} y={restTop + bh / 2 - 4} width={22} height={8} rx={4} fill={BRASS} stroke={INK} strokeWidth={1} />
      <line x1={80} y1={restTop + bh / 2} x2={140} y2={restTop + bh / 2} stroke={TEAL} strokeWidth={2.2} markerEnd="url(#m6-arrow-teal)" />
      <Txt x={110} y={restTop + bh / 2 - 10} size={12} color={TEAL} bold italic>
        {speedLabel}
      </Txt>
      <Txt x={61} y={restTop + bh / 2 + 22} size={10.5} bold>
        {bulletLabel}
      </Txt>
    </Frame>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Dispatch
// ─────────────────────────────────────────────────────────────────────────

function renderMomentumBankDiagram(spec: (typeof MOMENTUM_BANK_DIAGRAM_DATA)[string]): ReactNode {
  switch (spec.kind) {
    case 'collision':
      return <CollisionPanels {...spec.props} />;
    case 'graph':
      return <MotionGraph {...spec.props} />;
    case 'lineup':
      return <Lineup {...spec.props} />;
    case 'drop':
      return <DropBounce {...spec.props} />;
    case 'pendulum':
      return <BallisticPendulum {...spec.props} />;
    default:
      return null;
  }
}

export const MOMENTUM_BANK_DIAGRAMS: Record<string, ReactNode> = Object.fromEntries(
  Object.entries(MOMENTUM_BANK_DIAGRAM_DATA).map(([key, spec]) => [key, renderMomentumBankDiagram(spec)])
);
