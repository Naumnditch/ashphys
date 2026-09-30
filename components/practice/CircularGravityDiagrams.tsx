/**
 * Figures for the A Level (9702) circular motion and gravitation practice
 * sets built from the owner's worksheets: 12.1–12.2 motion in a circle and
 * 13.1–13.4 gravitational fields. All original drawings — the worksheets'
 * photographs (an observation wheel, skaters, a satellite, Phobos) are
 * redrawn as diagrams. They show what the question states and never the
 * answer: no force, acceleration or velocity arrow where the question asks
 * for one.
 *
 * Plain function components with no hooks: the worksheet PDF serialises
 * them with its own renderer (lib/practice/worksheetPdf.ts), so only use
 * attributes that serialiser writes exactly as React does, and never draw
 * outside the viewBox (the PDF does not clip).
 */

import type { ReactNode } from 'react';

const INK = '#1b2a41';
const MUTE = '#4a5a72';
const BRASS = '#b8823d';
const TEAL = '#2e7d6b';
const RED = '#b34a3c';
const SERIF = 'Georgia, serif';

const MASS = '#f3d9d4';
const METAL = '#b9c2cc';
const WOOD = '#e9dcc3';
const EARTH = '#dbe7f0';
const MOON = '#e5e7eb';
const MARS = '#f0d6c4';
const SUN = '#f6e3b4';
const ROCK = '#d8cfc0';
const BELT = '#cfcac0';
const GROUND = '#ece5d3';
const PEOPLE = '#aab4c2';

/** Arrowhead marker for each stroke colour an arrow may use. */
const HEAD: Record<string, string> = {
  [INK]: 'cg-ink',
  [MUTE]: 'cg-mute',
  [BRASS]: 'cg-brass',
  [TEAL]: 'cg-teal',
  [RED]: 'cg-red',
};

const rad = (deg: number) => (deg * Math.PI) / 180;
const r1 = (n: number) => Math.round(n * 10) / 10;

/** Point at angle `deg` on a circle. SVG angles: 0 = right, 90 = down, so increasing angles run clockwise on screen. */
function at(cx: number, cy: number, r: number, deg: number): [number, number] {
  return [r1(cx + r * Math.cos(rad(deg))), r1(cy + r * Math.sin(rad(deg)))];
}

/** Arc path from angle `from` to angle `to` (clockwise on screen when `to` > `from`). */
function arcPath(cx: number, cy: number, r: number, from: number, to: number): string {
  const [x1, y1] = at(cx, cy, r, from);
  const [x2, y2] = at(cx, cy, r, to);
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  const sweep = to > from ? 1 : 0;
  return `M${x1},${y1} A${r},${r} 0 ${large},${sweep} ${x2},${y2}`;
}

function Fig({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full max-w-md mx-auto"
      style={{ background: '#faf7f0', borderRadius: 8, border: '1px solid #e4ddcc' }}
    >
      <defs>
        {Object.entries(HEAD).map(([colour, id]) => (
          <marker key={id} id={id} markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={colour} />
          </marker>
        ))}
        <marker id="cg-dim-start" markerWidth="8" markerHeight="8" refX="0" refY="3" orient="auto">
          <path d="M6,0 L0,3 L6,6 Z" fill={MUTE} />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

interface TextProps {
  x: number;
  y: number;
  children: string;
  size?: number;
  color?: string;
  bold?: boolean;
  anchor?: 'start' | 'middle' | 'end';
}

function T({ x, y, children, size = 12, color = INK, bold = false, anchor = 'middle' }: TextProps) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fontWeight={bold ? 700 : 400} fill={color} fontFamily={SERIF}>
      {children}
    </text>
  );
}

/** A small grey caption, e.g. "view from above". */
function Note({ x, y, children, anchor = 'start' }: { x: number; y: number; children: string; anchor?: 'start' | 'middle' | 'end' }) {
  return (
    <T x={x} y={y} size={10.5} color={MUTE} anchor={anchor}>
      {children}
    </T>
  );
}

interface LineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  width?: number;
  dash?: string;
}

function Line({ x1, y1, x2, y2, color = INK, width = 1.6, dash }: LineProps) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeDasharray={dash} />;
}

function Arrow({ x1, y1, x2, y2, color = TEAL, width = 2.2, dash }: LineProps) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeDasharray={dash} markerEnd={`url(#${HEAD[color] ?? 'cg-ink'})`} />
  );
}

/** A two-headed measurement arrow with its label. */
function Dim({
  x1,
  y1,
  x2,
  y2,
  label,
  lx,
  ly,
  anchor = 'middle',
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  lx: number;
  ly: number;
  anchor?: 'start' | 'middle' | 'end';
}) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={MUTE} strokeWidth={1.1} markerStart="url(#cg-dim-start)" markerEnd="url(#cg-mute)" />
      <T x={lx} y={ly} size={11.5} color={MUTE} bold anchor={anchor}>
        {label}
      </T>
    </g>
  );
}

/** A curved arrow showing a sense of rotation. */
function Turn({ cx, cy, r, from, to, color = MUTE }: { cx: number; cy: number; r: number; from: number; to: number; color?: string }) {
  return <path d={arcPath(cx, cy, r, from, to)} fill="none" stroke={color} strokeWidth={1.5} markerEnd={`url(#${HEAD[color] ?? 'cg-mute'})`} />;
}

function AngleArc({ cx, cy, r, from, to }: { cx: number; cy: number; r: number; from: number; to: number }) {
  return <path d={arcPath(cx, cy, r, from, to)} fill="none" stroke={MUTE} strokeWidth={1.2} />;
}

function Dashed({ cx, cy, r, color = MUTE, dash = '5 4' }: { cx: number; cy: number; r: number; color?: string; dash?: string }) {
  return <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={1.3} strokeDasharray={dash} />;
}

function Dot({ x, y, r = 3.2, color = INK }: { x: number; y: number; r?: number; color?: string }) {
  return <circle cx={x} cy={y} r={r} fill={color} />;
}

function Body({ x, y, r, fill, label, labelSize = 12 }: { x: number; y: number; r: number; fill: string; label?: string; labelSize?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={fill} stroke={INK} strokeWidth={1.6} />
      {label && (
        <T x={x} y={y + 4} size={labelSize} bold>
          {label}
        </T>
      )}
    </g>
  );
}

// ── Small glyphs ─────────────────────────────────────────────────────────

function Satellite({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 13} y={y - 3.5} width={8} height={7} fill="#c9d6e3" stroke={INK} strokeWidth={0.8} />
      <rect x={x + 5} y={y - 3.5} width={8} height={7} fill="#c9d6e3" stroke={INK} strokeWidth={0.8} />
      <rect x={x - 5} y={y - 5} width={10} height={10} fill={METAL} stroke={INK} strokeWidth={1.1} />
    </g>
  );
}

/** Outline of where a satellite ends up. */
function GhostSatellite({ x, y }: { x: number; y: number }) {
  return <rect x={x - 5} y={y - 5} width={10} height={10} fill="none" stroke={MUTE} strokeWidth={1} strokeDasharray="2 2" />;
}

function SpaceStation({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <line x1={x - 15} y1={y} x2={x + 15} y2={y} stroke={INK} strokeWidth={1.6} />
      {[-12, -6, 6, 12].map((dx) => (
        <rect key={dx} x={x + dx - 2} y={y - 8} width={4} height={16} fill="#c9d6e3" stroke={INK} strokeWidth={0.7} />
      ))}
      <rect x={x - 4} y={y - 3} width={8} height={6} fill={METAL} stroke={INK} strokeWidth={1} />
    </g>
  );
}

/** An aircraft seen from above, pointing up the page. */
function Plane({ x, y }: { x: number; y: number }) {
  const p = (dx: number, dy: number) => `${r1(x + dx)},${r1(y + dy)}`;
  const d =
    `M${p(0, -14)} L${p(2.5, -8)} L${p(2.5, -3)} L${p(14, 3)} L${p(14, 6)} L${p(2.5, 3)} L${p(2, 10)} ` +
    `L${p(6, 13)} L${p(6, 15)} L${p(0, 13.5)} L${p(-6, 15)} L${p(-6, 13)} L${p(-2, 10)} L${p(-2.5, 3)} ` +
    `L${p(-14, 6)} L${p(-14, 3)} L${p(-2.5, -3)} L${p(-2.5, -8)} Z`;
  return <path d={d} fill={INK} />;
}

/** A person seen from above: shoulders and head. */
function PersonTop({ x, y, tall = false }: { x: number; y: number; tall?: boolean }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={tall ? 9 : 12} ry={tall ? 21 : 7} fill={PEOPLE} stroke={INK} strokeWidth={1.2} />
      <circle cx={x} cy={y} r={tall ? 6.5 : 5} fill="#6b7280" stroke={INK} strokeWidth={1} />
    </g>
  );
}

function Rock({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const pts = [
    [-10, -4],
    [-4, -10],
    [6, -8],
    [11, -1],
    [7, 8],
    [-3, 10],
    [-11, 4],
  ]
    .map(([dx, dy]) => `${r1(x + dx * s)},${r1(y + dy * s)}`)
    .join(' ');
  return <polygon points={pts} fill={ROCK} stroke={INK} strokeWidth={1.2} />;
}

// ── 12.1 / 12.2 Motion in a circle ───────────────────────────────────────

function MassOnString() {
  const cx = 230;
  const cy = 105;
  const r = 78;
  const [mx, my] = at(cx, cy, r, 0);
  return (
    <Fig w={460} h={210}>
      <Note x={16} y={24}>
        view from above
      </Note>
      <Dashed cx={cx} cy={cy} r={r} />
      <Line x1={cx} y1={cy} x2={mx - 10} y2={my} width={1.4} />
      <circle cx={cx} cy={cy} r={6} fill={WOOD} stroke={INK} strokeWidth={1.3} />
      <T x={cx} y={cy + 24} size={11} color={MUTE}>
        hand
      </T>
      <T x={r1((cx + mx) / 2)} y={cy - 8} size={11} color={MUTE}>
        string
      </T>
      <circle cx={mx} cy={my} r={10} fill={MASS} stroke={INK} strokeWidth={1.5} />
      <T x={mx + 16} y={my + 4} size={11.5} anchor="start">
        mass
      </T>
      <Turn cx={cx} cy={cy} r={r + 16} from={200} to={150} />
      <Note x={cx} y={200} anchor="middle">
        the mass goes round anticlockwise at a steady speed
      </Note>
    </Fig>
  );
}

function AircraftLoop() {
  const cx = 200;
  const cy = 112;
  const r = 82;
  const [px, py] = at(cx, cy, r, 0);
  return (
    <Fig w={460} h={220}>
      <Note x={16} y={24}>
        view from above
      </Note>
      <Dashed cx={cx} cy={cy} r={r} />
      <Dot x={cx} y={cy} />
      <Line x1={cx} y1={cy} x2={px - 14} y2={py} color={MUTE} width={1.2} />
      <T x={r1(cx + r / 2 - 6)} y={cy - 8} size={11.5} color={MUTE} bold>
        r = 3622 m
      </T>
      <Plane x={px} y={py} />
      <Turn cx={cx} cy={cy} r={r + 20} from={32} to={-22} />
      <T x={px + 32} y={py + 30} size={11.5} anchor="start">
        aircraft
      </T>
      <Note x={cx} y={212} anchor="middle">
        one complete circle takes 2.10 minutes
      </Note>
    </Fig>
  );
}

function WhistlePlan() {
  const cx = 230;
  const cy = 116;
  const r = 90;
  const [wx, wy] = at(cx, cy, r, 125);
  return (
    <Fig w={460} h={240}>
      <Note x={16} y={24}>
        plan view (from above)
      </Note>
      <Dashed cx={cx} cy={cy} r={r} />
      <Line x1={cx} y1={cy} x2={wx} y2={wy} width={1.3} />
      <circle cx={cx} cy={cy} r={5} fill={WOOD} stroke={INK} strokeWidth={1.2} />
      <T x={cx + 10} y={cy - 8} size={11} color={MUTE} anchor="start">
        hand
      </T>
      <T x={r1((cx + wx) / 2 + 10)} y={r1((cy + wy) / 2 + 6)} size={11.5} color={MUTE} bold anchor="start">
        0.500 m
      </T>
      <rect x={wx - 3} y={wy - 12} width={6} height={9} rx={1.5} fill={METAL} stroke={INK} strokeWidth={1} />
      <circle cx={wx} cy={wy} r={7} fill={METAL} stroke={INK} strokeWidth={1.3} />
      <T x={wx - 14} y={wy + 20} size={11.5} anchor="end">
        whistle, 40.0 g
      </T>
      <Turn cx={cx} cy={cy} r={r + 14} from={-30} to={-75} />
      <Note x={cx} y={232} anchor="middle">
        one revolution every 1.40 s, anticlockwise
      </Note>
    </Fig>
  );
}

function MerryGoRound() {
  const cx = 220;
  const cy = 126;
  const r = 94;
  const [jx, jy] = at(cx, cy, r, 55);
  return (
    <Fig w={460} h={250}>
      <Note x={16} y={24}>
        view from above
      </Note>
      <circle cx={cx} cy={cy} r={r} fill="#f4efe3" stroke={INK} strokeWidth={1.6} />
      <Dot x={cx} y={cy} r={3.5} />
      <Line x1={cx} y1={cy} x2={jx} y2={jy} color={MUTE} width={1.1} dash="4 3" />
      <T x={r1((cx + jx) / 2 + 10)} y={r1((cy + jy) / 2 - 7)} size={11.5} color={MUTE} bold anchor="start">
        4.0 m
      </T>
      <Turn cx={cx} cy={cy} r={r + 14} from={280} to={330} />
      <PersonTop x={jx} y={jy} />
      <T x={jx + 18} y={jy + 20} size={12} bold anchor="start">
        Jason
      </T>
      <Note x={cx} y={243} anchor="middle">
        the merry-go-round turns clockwise at a steady speed
      </Note>
    </Fig>
  );
}

function BaggageBelt() {
  const cx = 215;
  const cy = 128;
  const r = 88;
  const [sx, sy] = at(cx, cy, r, 0);
  const [dx, dy] = at(cx, cy, r, 135);
  return (
    <Fig w={460} h={250}>
      <Note x={16} y={24}>
        view from above
      </Note>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={BELT} strokeWidth={22} />
      <Turn cx={cx} cy={cy} r={r - 30} from={245} to={295} />
      <Dot x={cx} y={cy} />
      <Dim x1={cx} y1={cy} x2={dx} y2={dy} label="7.0 m" lx={r1((cx + dx) / 2 + 10)} ly={r1((cy + dy) / 2 + 12)} anchor="start" />
      <rect x={sx - 6} y={sy - 14} width={12} height={28} rx={2} fill="#c9a36b" stroke={INK} strokeWidth={1.3} />
      <rect x={sx + 6} y={sy - 4} width={3} height={8} fill={INK} />
      <T x={sx + 24} y={sy + 4} size={12} bold anchor="start">
        suitcase
      </T>
      <Note x={cx} y={243} anchor="middle">
        the belt turns clockwise at a steady speed
      </Note>
    </Fig>
  );
}

function Skaters() {
  const cx = 200;
  const cy = 116;
  const r = 92;
  const [ax, ay] = at(cx, cy, r, 30);
  return (
    <Fig w={460} h={240}>
      <Note x={16} y={24}>
        view from above
      </Note>
      <Dashed cx={cx} cy={cy} r={r} dash="2 4" />
      <Line x1={cx} y1={cy} x2={ax} y2={ay} color={MUTE} width={3.2} />
      <Dot x={cx} y={cy} r={9} />
      <T x={cx - 16} y={cy + 4} size={12} bold anchor="end">
        Jon
      </T>
      <Dot x={ax} y={ay} r={9} />
      <T x={ax + 8} y={ay + 24} size={12} bold anchor="start">
        Ana
      </T>
      <T x={r1((cx + ax) / 2 - 6)} y={r1((cy + ay) / 2 + 17)} size={11.5} color={MUTE} bold anchor="end">
        0.95 m
      </T>
      <Turn cx={cx} cy={cy} r={r + 16} from={42} to={2} />
      <Note x={316} y={118}>
        direction of rotation
      </Note>
    </Fig>
  );
}

function TableAndHole() {
  return (
    <Fig w={460} h={250}>
      {/* table top, seen from slightly above */}
      <polygon points="96,78 364,78 414,132 46,132" fill={WOOD} stroke={INK} strokeWidth={1.4} />
      <rect x={46} y={132} width={368} height={8} fill={WOOD} stroke={INK} strokeWidth={1.2} />
      <rect x={60} y={140} width={9} height={80} fill={WOOD} stroke={INK} strokeWidth={1.2} />
      <rect x={391} y={140} width={9} height={80} fill={WOOD} stroke={INK} strokeWidth={1.2} />
      <Line x1={30} y1={220} x2={430} y2={220} color={MUTE} width={1.4} />
      {/* the circular path, the hole and the string */}
      <ellipse cx={230} cy={106} rx={118} ry={20} fill="none" stroke={MUTE} strokeWidth={1.2} strokeDasharray="5 4" />
      <ellipse cx={230} cy={106} rx={4} ry={2} fill={INK} />
      <Line x1={232} y1={106} x2={336} y2={106} width={1.3} />
      <T x={270} y={99} size={11.5} color={MUTE} bold>
        r = 0.20 m
      </T>
      <rect x={336} y={101} width={24} height={10} rx={3} fill={MASS} stroke={INK} strokeWidth={1.3} />
      <T x={348} y={68} size={11.5} bold>
        0.50 kg · 2.3 m/s
      </T>
      <Note x={140} y={162} anchor="middle">
        frictionless table
      </Note>
      <Line x1={230} y1={140} x2={230} y2={186} width={1.3} />
      <rect x={214} y={186} width={32} height={26} fill="#cfd5dd" stroke={INK} strokeWidth={1.4} />
      <T x={256} y={203} size={11.5} bold anchor="start">
        hanging mass, M
      </T>
    </Fig>
  );
}

function FlatBend() {
  const cx = 230;
  const cy = 216;
  return (
    <Fig w={460} h={240}>
      <Note x={16} y={24}>
        flat (unbanked) bend, view from above
      </Note>
      <path d={arcPath(cx, cy, 150, 200, 340)} fill="none" stroke="#cbc6bb" strokeWidth={36} />
      <path d={arcPath(cx, cy, 150, 200, 340)} fill="none" stroke="#ffffff" strokeWidth={2} strokeDasharray="10 8" />
      <rect x={214} y={57} width={32} height={18} rx={4} fill="#c8d6e5" stroke={INK} strokeWidth={1.4} />
      <rect x={236} y={60} width={6} height={12} rx={1} fill="#7f93aa" />
      <T x={230} y={44} size={11.5} bold>
        car, 14 m/s
      </T>
      <Dim x1={cx} y1={cy} x2={cx} y2={78} label="r = 96 m" lx={cx + 10} ly={158} anchor="start" />
      <Line x1={cx - 5} y1={cy - 5} x2={cx + 5} y2={cy + 5} width={1.2} />
      <Line x1={cx - 5} y1={cy + 5} x2={cx + 5} y2={cy - 5} width={1.2} />
      <Note x={cx + 12} y={cy + 4}>
        centre of the bend
      </Note>
    </Fig>
  );
}

function VerticalString() {
  return (
    <Fig w={460} h={260}>
      <Note x={16} y={24}>
        vertical circle
      </Note>
      <Dashed cx={230} cy={130} r={92} />
      <Line x1={230} y1={130} x2={230} y2={46} width={1.4} />
      <Line x1={230} y1={130} x2={230} y2={214} width={1.4} />
      <Dot x={230} y={130} r={3.5} />
      <rect x={222} y={30} width={16} height={16} fill={MASS} stroke={INK} strokeWidth={1.4} />
      <rect x={222} y={214} width={16} height={16} fill={MASS} stroke={INK} strokeWidth={1.4} />
      <T x={266} y={42} size={11.5} color={MUTE} anchor="start">
        at the top
      </T>
      <T x={266} y={226} size={11.5} color={MUTE} anchor="start">
        at the bottom
      </T>
      <T x={220} y={92} size={11.5} color={MUTE} bold anchor="end">
        0.60 m
      </T>
      <T x={194} y={42} size={11.5} bold anchor="end">
        1.7 kg
      </T>
      <Note x={230} y={252} anchor="middle">
        one revolution every 1.1 s
      </Note>
    </Fig>
  );
}

function VerticalTop() {
  return (
    <Fig w={460} h={230}>
      <Note x={16} y={24}>
        vertical circle
      </Note>
      <Dashed cx={230} cy={124} r={88} />
      <Line x1={230} y1={124} x2={230} y2={46} width={1.4} />
      <Dot x={230} y={124} r={3.5} />
      <circle cx={230} cy={36} r={10} fill={MASS} stroke={INK} strokeWidth={1.5} />
      <T x={264} y={34} size={11.5} color={MUTE} anchor="start">
        top of the circle
      </T>
      <T x={220} y={88} size={11.5} color={MUTE} bold anchor="end">
        0.75 m
      </T>
    </Fig>
  );
}

/** A banked bend in cross-section, seen from behind the car; the centre of the bend is to the left. */
function BankedRoad({ values }: { values: boolean }) {
  const angle = 14.93; // drawn angle of the slope (60 → 410 px rising 96 px)
  return (
    <Fig w={460} h={220}>
      <Note x={16} y={20}>
        the bend seen from behind the car
      </Note>
      <polygon points="50,196 410,100 410,196" fill={GROUND} stroke={INK} strokeWidth={1.4} />
      <AngleArc cx={50} cy={196} r={56} from={360 - angle} to={360} />
      <T x={122} y={191} size={12.5} color={MUTE} bold>
        θ
      </T>
      <g transform={`rotate(${-angle} 230 148)`}>
        <rect x={206} y={140} width={10} height={8} rx={1.5} fill={INK} />
        <rect x={244} y={140} width={10} height={8} rx={1.5} fill={INK} />
        <rect x={202} y={114} width={56} height={28} rx={6} fill="#c8d6e5" stroke={INK} strokeWidth={1.4} />
        <rect x={210} y={119} width={40} height={10} rx={2} fill="#8fa3b8" />
      </g>
      <Arrow x1={200} y1={52} x2={70} y2={52} color={MUTE} width={1.4} />
      <T x={135} y={44} size={11} color={MUTE}>
        {values ? 'towards the centre (r = 475 m)' : 'towards the centre of the bend'}
      </T>
      {values && (
        <T x={318} y={70} size={11.5} bold anchor="start">
          car moving at 22 m/s
        </T>
      )}
      {values && <Note x={318}  y={85}>(into the page)</Note>}
      <Note x={340} y={184} anchor="middle">
        frictionless banked road
      </Note>
    </Fig>
  );
}

function ToyPlane() {
  const [px, py] = [304, 160];
  return (
    <Fig w={460} h={230}>
      <Line x1={180} y1={26} x2={280} y2={26} width={3} />
      {[190, 210, 230, 250, 270].map((x) => (
        <line key={x} x1={x} y1={26} x2={x - 8} y2={16} stroke={INK} strokeWidth={1} />
      ))}
      <Line x1={230} y1={26} x2={230} y2={176} color={MUTE} width={1} dash="4 4" />
      <ellipse cx={230} cy={160} rx={74} ry={14} fill="none" stroke={MUTE} strokeWidth={1.2} strokeDasharray="5 4" />
      <Line x1={230} y1={160} x2={px - 14} y2={py} color={MUTE} width={1.1} />
      <Line x1={230} y1={26} x2={px} y2={py} width={1.5} />
      <AngleArc cx={230} cy={26} r={38} from={61.1} to={90} />
      <T x={243} y={88} size={12} color={MUTE} bold>
        28°
      </T>
      <ellipse cx={px} cy={py} rx={16} ry={4.5} fill="#d8dee6" stroke={INK} strokeWidth={1.2} />
      <ellipse cx={px + 2} cy={py} rx={3.5} ry={11} fill={METAL} stroke={INK} strokeWidth={1} />
      <path d={`M${px - 16},${py - 1} L${px - 20},${py - 8} L${px - 16},${py - 8} L${px - 12},${py - 2} Z`} fill={METAL} stroke={INK} strokeWidth={0.8} />
      <T x={px + 26} y={py + 5} size={11.5} bold anchor="start">
        toy plane, 0.25 kg
      </T>
      <T x={230} y={196} size={11.5} color={MUTE} bold>
        radius 0.80 m
      </T>
      <Note x={16} y={222}>
        the plane flies round a horizontal circle
      </Note>
    </Fig>
  );
}

function ThemeParkCar() {
  const angle = 19.96; // 40 → 420 px rising 138 px
  return (
    <Fig w={460} h={240}>
      <Note x={16} y={20}>
        the track seen from behind the car
      </Note>
      <polygon points="40,206 420,68 420,206" fill={GROUND} stroke={INK} strokeWidth={1.4} />
      <AngleArc cx={40} cy={206} r={60} from={360 - angle} to={360} />
      <T x={118} y={200} size={12} color={MUTE} bold>
        20°
      </T>
      <g transform={`rotate(${-angle} 230 137)`}>
        <circle cx={216} cy={96} r={8} fill="#8e99a8" stroke={INK} strokeWidth={1} />
        <circle cx={244} cy={96} r={8} fill="#8e99a8" stroke={INK} strokeWidth={1} />
        <rect x={203} y={129} width={11} height={8} rx={1.5} fill={INK} />
        <rect x={246} y={129} width={11} height={8} rx={1.5} fill={INK} />
        <rect x={198} y={103} width={64} height={30} rx={6} fill="#cdd8e4" stroke={INK} strokeWidth={1.4} />
      </g>
      <Arrow x1={200} y1={48} x2={60} y2={48} color={MUTE} width={1.4} />
      <T x={130} y={40} size={11} color={MUTE}>
        towards the centre of the circle
      </T>
      <T x={330} y={192} size={11.5} bold>
        car + riders: 9.60 × 10² kg
      </T>
    </Fig>
  );
}

/** A ball on a cord in a vertical circle, in three states the questions need. */
function BallOnCord({ mode }: { mode: 'speed' | 'angle' | 'top' }) {
  const cx = 230;
  const cy = 130;
  const r = 96;
  const ballAngle = mode === 'top' ? 270 : 305;
  const [bx, by] = at(cx, cy, r, ballAngle);
  // clockwise tangent at the ball: the ball is going over the top and down the right-hand side
  const tx = -Math.sin(rad(ballAngle));
  const ty = Math.cos(rad(ballAngle));
  return (
    <Fig w={460} h={250}>
      <Note x={16} y={24}>
        vertical circle
      </Note>
      <Dashed cx={cx} cy={cy} r={r} />
      {mode === 'angle' && <Line x1={cx} y1={cy} x2={cx} y2={cy - r + 10} color={MUTE} width={1} dash="4 4" />}
      <Line x1={cx} y1={cy} x2={bx} y2={by} width={1.5} />
      <Dot x={cx} y={cy} r={3.5} />
      <circle cx={bx} cy={by} r={9} fill={MASS} stroke={INK} strokeWidth={1.5} />
      {mode === 'top' ? (
        <g>
          <T x={cx - 10} y={r1(cy - r / 2)} size={11.5} color={MUTE} bold anchor="end">
            1.20 m
          </T>
          <T x={cx + 18} y={by - 8} size={11.5} color={MUTE} anchor="start">
            top of the circle
          </T>
        </g>
      ) : (
        <g>
          <T x={r1((cx + bx) / 2 + 12)} y={r1((cy + by) / 2 + 8)} size={11.5} color={MUTE} bold anchor="start">
            1.20 m
          </T>
          <Arrow x1={r1(bx + tx * 13)} y1={r1(by + ty * 13)} x2={r1(bx + tx * 56)} y2={r1(by + ty * 56)} />
          <T x={r1(bx + tx * 56 + 8)} y={r1(by + ty * 56 + 6)} size={11.5} color={TEAL} bold anchor="start">
            4.00 m/s
          </T>
        </g>
      )}
      {mode === 'angle' && (
        <g>
          <AngleArc cx={cx} cy={cy} r={34} from={270} to={305} />
          <T x={245} y={88} size={12.5} color={MUTE} bold>
            θ
          </T>
          <circle cx={cx} cy={cy - r} r={9} fill="none" stroke={MUTE} strokeWidth={1.2} strokeDasharray="3 2" />
          <Arrow x1={cx - 30} y1={cy - r} x2={cx - 13} y2={cy - r} color={MUTE} width={1.6} />
          <T x={cx - 36} y={cy - r + 4} size={11} color={MUTE} anchor="end">
            top: 3.43 m/s
          </T>
        </g>
      )}
    </Fig>
  );
}

function BallTopAndBottom() {
  const cx = 230;
  const cy = 140;
  const r = 95;
  return (
    <Fig w={460} h={290}>
      <Dashed cx={cx} cy={cy} r={r} />
      <circle cx={cx} cy={cy - r} r={9} fill={MASS} stroke={INK} strokeWidth={1.5} />
      <circle cx={cx} cy={cy + r} r={9} fill={MASS} stroke={INK} strokeWidth={1.5} />
      <Arrow x1={cx} y1={cy - r + 11} x2={cx} y2={cy - r + 45} color={RED} />
      <Arrow x1={cx} y1={cy + r + 11} x2={cx} y2={cy + r + 45} color={RED} />
      <T x={cx + 10} y={cy - r + 38} size={11} color={RED} bold anchor="start">
        weight
      </T>
      <T x={cx + 10} y={cy + r + 38} size={11} color={RED} bold anchor="start">
        weight
      </T>
      <Note x={cx} y={28} anchor="middle">
        top of the swing
      </Note>
      <Note x={cx - 14} y={cy + r + 22} anchor="end">
        bottom of the swing
      </Note>
    </Fig>
  );
}

function ConicalBob() {
  const [bx, by] = [282, 206];
  return (
    <Fig w={460} h={250}>
      <Line x1={178} y1={26} x2={282} y2={26} width={3} />
      {[188, 208, 228, 248, 268].map((x) => (
        <line key={x} x1={x} y1={26} x2={x - 8} y2={16} stroke={INK} strokeWidth={1} />
      ))}
      <Line x1={230} y1={26} x2={230} y2={218} color={MUTE} width={1} dash="4 4" />
      <ellipse cx={230} cy={206} rx={52} ry={11} fill="none" stroke={MUTE} strokeWidth={1.2} strokeDasharray="5 4" />
      <Line x1={230} y1={206} x2={bx - 11} y2={by} color={MUTE} width={1.1} />
      <Line x1={230} y1={26} x2={bx} y2={by} width={1.5} />
      <AngleArc cx={230} cy={26} r={42} from={73.9} to={90} />
      <T x={240} y={86} size={12.5} color={MUTE} bold>
        θ
      </T>
      <T x={268} y={118} size={11.5} color={MUTE} bold anchor="start">
        cord 1.55 m
      </T>
      <circle cx={bx} cy={by} r={11} fill={MASS} stroke={INK} strokeWidth={1.5} />
      <T x={bx + 18} y={by + 5} size={11.5} bold anchor="start">
        bob, 1.80 kg
      </T>
      <T x={230} y={240} size={11.5} color={MUTE} bold>
        radius 0.290 m
      </T>
    </Fig>
  );
}

function ObservationWheel() {
  const cx = 200;
  const cy = 142;
  const R = 112;
  const main = 300;
  const [kx, ky] = at(cx, cy, R, main);
  const spokes = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <Fig w={460} h={275}>
      {spokes.map((a) => {
        const [x, y] = at(cx, cy, R, a);
        return <line key={`s${a}`} x1={cx} y1={cy} x2={x} y2={y} stroke="#b7bfca" strokeWidth={0.9} />;
      })}
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={MUTE} strokeWidth={1.6} />
      {spokes
        .filter((a) => a !== main)
        .map((a) => {
          const [x, y] = at(cx, cy, R, a);
          return <circle key={`c${a}`} cx={x} cy={y} r={6} fill="#eef2f6" stroke={MUTE} strokeWidth={1} />;
        })}
      <circle cx={cx} cy={cy} r={6} fill={MUTE} />
      <T x={r1((cx + kx) / 2 + 10)} y={r1((cy + ky) / 2 + 8)} size={11.5} color={MUTE} bold anchor="start">
        68 m
      </T>
      {/* the capsule stays level; a passenger stands on its floor */}
      <circle cx={kx} cy={ky} r={20} fill="#eef2f6" stroke={INK} strokeWidth={1.4} />
      <Line x1={kx - 17.9} y1={ky + 9} x2={kx + 17.9} y2={ky + 9} width={1.4} />
      <circle cx={kx} cy={ky - 8.5} r={2.8} fill={INK} />
      <Line x1={kx} y1={ky - 5.5} x2={kx} y2={ky + 2.5} width={1.2} />
      <Line x1={kx} y1={ky + 2.5} x2={kx - 2.5} y2={ky + 9} width={1.2} />
      <Line x1={kx} y1={ky + 2.5} x2={kx + 2.5} y2={ky + 9} width={1.2} />
      <Line x1={kx} y1={ky - 3} x2={kx - 3.5} y2={ky + 1} width={1.2} />
      <Line x1={kx} y1={ky - 3} x2={kx + 3.5} y2={ky + 1} width={1.2} />
      <Turn cx={cx} cy={cy} r={R + 22} from={258} to={218} />
      <T x={kx + 26} y={ky - 4} size={11.5} bold anchor="start">
        capsule, 1.0 × 10⁴ kg
      </T>
      <T x={kx + 26} y={ky + 12} size={11.5} anchor="start">
        moving at 0.26 m/s
      </T>
      <Note x={cx} y={270} anchor="middle">
        the wheel turns steadily in a vertical plane
      </Note>
    </Fig>
  );
}

function HammerThrow() {
  const cx = 190;
  const cy = 120;
  return (
    <Fig w={460} h={240}>
      <Note x={16} y={24}>
        view from above
      </Note>
      <Dashed cx={cx} cy={cy} r={104} />
      <Line x1={cx + 9} y1={cy} x2={284} y2={cy} width={1.6} />
      <PersonTop x={cx} y={cy} tall />
      <T x={cx - 16} y={cy + 4} size={12} bold anchor="end">
        Jan
      </T>
      <circle cx={294} cy={cy} r={10} fill="#8d99a6" stroke={INK} strokeWidth={1.4} />
      <Arrow x1={294} y1={cy - 12} x2={294} y2={cy - 64} />
      <T x={304} y={cy - 52} size={11.5} color={TEAL} bold anchor="start">
        velocity
      </T>
      <T x={310} y={cy + 4} size={11.5} anchor="start">
        iron ball
      </T>
      <T x={242} y={cy - 8} size={11.5} color={MUTE} bold>
        2.0 m
      </T>
      <Note x={242} y={cy + 17} anchor="middle">
        steel wire
      </Note>
    </Fig>
  );
}

function BallOverhead() {
  return (
    <Fig w={460} h={260}>
      <Note x={16} y={24}>
        side view
      </Note>
      <ellipse cx={164} cy={96} rx={136} ry={22} fill="none" stroke={MUTE} strokeWidth={1.2} strokeDasharray="5 4" />
      <Line x1={164} y1={96} x2={292} y2={96} width={1.3} />
      <circle cx={300} cy={96} r={8} fill="#8d99a6" stroke={INK} strokeWidth={1.4} />
      <T x={232} y={88} size={11.5} color={MUTE} bold>
        0.75 m
      </T>
      <T x={314} y={100} size={11.5} anchor="start">
        ball
      </T>
      {/* the thrower: arm raised, hand at the centre of the circle */}
      <circle cx={140} cy={140} r={11} fill="none" stroke={INK} strokeWidth={1.6} />
      <Line x1={140} y1={151} x2={140} y2={200} />
      <Line x1={140} y1={200} x2={128} y2={236} />
      <Line x1={140} y1={200} x2={152} y2={236} />
      <Line x1={140} y1={162} x2={124} y2={190} />
      <Line x1={142} y1={160} x2={164} y2={132} />
      <Line x1={164} y1={132} x2={164} y2={98} />
      <Note x={16} y={252}>
        the ball moves round a horizontal circle above her head
      </Note>
    </Fig>
  );
}

// ── 13.1–13.4 Gravitational fields ───────────────────────────────────────

function FieldLines() {
  const cx = 230;
  const cy = 125;
  return (
    <Fig w={460} h={250}>
      <Note x={16} y={22}>
        field lines around a planet
      </Note>
      {Array.from({ length: 12 }, (_, i) => i * 30).map((a) => {
        const [x1, y1] = at(cx, cy, 112, a);
        const [x2, y2] = at(cx, cy, 54, a);
        return <line key={a} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={1.5} markerEnd="url(#cg-ink)" />;
      })}
      <Body x={cx} y={cy} r={44} fill="#dfe6ee" label="planet" />
    </Fig>
  );
}

function ShuttleOrbit() {
  const cx = 190;
  const cy = 130;
  const [ex, ey] = at(cx, cy, 104, 215);
  const [sx, sy] = at(cx, cy, 104, 318);
  return (
    <Fig w={460} h={250}>
      <Dashed cx={cx} cy={cy} r={104} dash="2 4" />
      <Body x={cx} y={cy} r={48} fill={EARTH} />
      <T x={cx + 4} y={cy + 30} size={12} bold>
        Earth
      </T>
      <Dim x1={cx} y1={cy} x2={ex} y2={ey} label="7.00 × 10⁶ m" lx={96} ly={62} anchor="end" />
      {/* shuttle and telescope, joined by a cable */}
      <polygon points={`${sx - 9},${sy + 4} ${sx + 7},${sy} ${sx - 9},${sy - 4}`} fill={METAL} stroke={INK} strokeWidth={1} />
      <Line x1={sx + 7} y1={sy} x2={sx + 17} y2={sy - 8} width={1} />
      <rect x={sx + 15} y={sy - 13} width={12} height={6} rx={1.5} fill="#c9d6e3" stroke={INK} strokeWidth={0.9} />
      <T x={sx + 20} y={sy - 20} size={11.5} bold anchor="start">
        shuttle + telescope
      </T>
      <Note x={444} y={242} anchor="end">
        not to scale
      </Note>
    </Fig>
  );
}

function TwoStudents() {
  return (
    <Fig w={460} h={170}>
      <Dim x1={130} y1={48} x2={330} y2={48} label="0.95 m between centres" lx={230} ly={40} />
      <Line x1={130} y1={54} x2={130} y2={82} color={MUTE} width={1} dash="2 3" />
      <Line x1={330} y1={54} x2={330} y2={82} color={MUTE} width={1} dash="2 3" />
      <Body x={130} y={110} r={28} fill={MOON} label="75 kg" />
      <Body x={330} y={110} r={28} fill={MOON} label="75 kg" />
      <Note x={230} y={160} anchor="middle">
        two students, treated as point masses
      </Note>
    </Fig>
  );
}

function WeightScaling() {
  const cy = 104;
  return (
    <Fig w={460} h={210}>
      <Body x={110} y={cy} r={60} fill={EARTH} label="Earth" />
      <Satellite x={176} y={cy} />
      <Satellite x={242} y={cy} />
      <T x={176} y={cy - 14} size={12} bold>
        m
      </T>
      <T x={242} y={cy - 14} size={12} bold>
        3m
      </T>
      <Line x1={110} y1={166} x2={110} y2={202} color={MUTE} width={1} dash="2 3" />
      <Line x1={176} y1={112} x2={176} y2={182} color={MUTE} width={1} dash="2 3" />
      <Line x1={242} y1={112} x2={242} y2={202} color={MUTE} width={1} dash="2 3" />
      <Dim x1={110} y1={178} x2={176} y2={178} label="r" lx={143} ly={172} />
      <Dim x1={110} y1={198} x2={242} y2={198} label="2r" lx={206} ly={192} />
      <T x={276} y={96} size={11.5} anchor="start">
        at r: mass m, weight 9000 N
      </T>
      <T x={276} y={118} size={11.5} anchor="start">
        at 2r: mass 3m, weight ?
      </T>
    </Fig>
  );
}

function MoonOrbit() {
  return (
    <Fig w={460} h={230}>
      <Dashed cx={230} cy={112} r={92} dash="6 6" />
      <Body x={230} y={112} r={34} fill={EARTH} label="Earth" labelSize={11} />
      <Body x={322} y={112} r={11} fill={MOON} />
      <T x={340} y={116} size={11.5} bold anchor="start">
        Moon
      </T>
      <Note x={230} y={222} anchor="middle">
        the Moon orbits the Earth (not to scale)
      </Note>
    </Fig>
  );
}

/** A satellite on a circular orbit round the Earth, with the orbit radius as given. */
function EarthOrbit({ radius, mass }: { radius: string; mass?: string }) {
  const cx = 200;
  const cy = 118;
  const [sx, sy] = at(cx, cy, 96, 325);
  return (
    <Fig w={460} h={240}>
      <Dashed cx={cx} cy={cy} r={96} color={BRASS} dash="6 5" />
      <Body x={cx} y={cy} r={44} fill={EARTH} />
      <T x={cx} y={cy + 26} size={12} bold>
        Earth
      </T>
      <Line x1={cx} y1={cy} x2={sx} y2={sy} width={1.2} />
      <T x={r1((cx + sx) / 2 + 10)} y={r1((cy + sy) / 2 + 12)} size={12.5} bold>
        r
      </T>
      <Satellite x={sx} y={sy} />
      {mass && (
        <T x={sx + 18} y={sy - 10} size={11.5} bold anchor="start">
          {`satellite, ${mass}`}
        </T>
      )}
      <T x={cx} y={232} size={11.5} color={MUTE} bold>
        {`orbital radius r = ${radius}`}
      </T>
      <Note x={444} y={20} anchor="end">
        not to scale
      </Note>
    </Fig>
  );
}

function TwoOrbits() {
  const cx = 210;
  const cy = 125;
  const [bx, by] = at(cx, cy, 56, 210);
  const [ax, ay] = at(cx, cy, 112, 330);
  return (
    <Fig w={460} h={250}>
      <Dashed cx={cx} cy={cy} r={56} />
      <Dashed cx={cx} cy={cy} r={112} />
      <Body x={cx} y={cy} r={28} fill={EARTH} />
      <T x={cx} y={cy + 17} size={10} bold>
        Earth
      </T>
      <Line x1={cx} y1={cy} x2={bx} y2={by} color={MUTE} width={1.1} />
      <Line x1={cx} y1={cy} x2={ax} y2={ay} color={MUTE} width={1.1} />
      <T x={r1((cx + bx) / 2 - 4)} y={r1((cy + by) / 2 - 6)} size={12} color={MUTE} bold>
        r
      </T>
      <T x={r1((cx + ax) / 2 + 4)} y={r1((cy + ay) / 2 - 8)} size={12} color={MUTE} bold>
        2r
      </T>
      <Satellite x={bx} y={by} />
      <Satellite x={ax} y={ay} />
      <T x={bx - 18} y={by - 8} size={13} bold anchor="end">
        B
      </T>
      <T x={ax + 18} y={ay - 8} size={13} bold anchor="start">
        A
      </T>
      <Note x={16} y={22}>
        two identical satellites
      </Note>
    </Fig>
  );
}

function SunAndEarthOrbits() {
  return (
    <Fig w={460} h={210}>
      <Line x1={230} y1={14} x2={230} y2={186} color="#d8cfb6" width={1.2} dash="4 4" />
      <Dashed cx={115} cy={96} r={80} />
      <Body x={115} y={96} r={36} fill={SUN} label="Sun" />
      <Line x1={151} y1={96} x2={187} y2={96} color={MUTE} width={1.1} />
      <T x={169} y={90} size={12} color={MUTE} bold>
        r
      </T>
      <Satellite x={195} y={96} />
      <T x={195} y={80} size={13} bold>
        A
      </T>
      <Dashed cx={345} cy={96} r={80} />
      <Body x={345} y={96} r={14} fill={EARTH} />
      <T x={345} y={128} size={11} bold>
        Earth
      </T>
      <Line x1={359} y1={96} x2={417} y2={96} color={MUTE} width={1.1} />
      <T x={388} y={90} size={12} color={MUTE} bold>
        r
      </T>
      <Satellite x={425} y={96} />
      <T x={425} y={80} size={13} bold>
        B
      </T>
      <Note x={115} y={202} anchor="middle">
        A orbits the Sun
      </Note>
      <Note x={345} y={202} anchor="middle">
        B orbits the Earth
      </Note>
    </Fig>
  );
}

function Geostationary() {
  const cx = 190;
  const cy = 112;
  return (
    <Fig w={460} h={220}>
      <ellipse cx={cx} cy={cy} rx={170} ry={36} fill="none" stroke={BRASS} strokeWidth={1.3} strokeDasharray="6 5" />
      <Body x={cx} y={cy} r={46} fill={EARTH} />
      <ellipse cx={cx} cy={cy} rx={46} ry={9} fill="none" stroke={MUTE} strokeWidth={1} />
      <Line x1={cx} y1={cy - 62} x2={cx} y2={cy + 62} color={MUTE} width={1} dash="3 3" />
      <T x={cx} y={cy - 68} size={11} color={MUTE} bold>
        N
      </T>
      <path d={`M${cx - 20},${cy - 52} Q${cx},${cy - 60} ${cx + 20},${cy - 52}`} fill="none" stroke={MUTE} strokeWidth={1.4} markerEnd="url(#cg-mute)" />
      <Line x1={cx} y1={cy} x2={352} y2={cy} width={1.1} />
      <T x={300} y={cy - 7} size={12.5} bold>
        r
      </T>
      <T x={cx - 58} y={cy + 4} size={10.5} color={MUTE} anchor="end">
        equator
      </T>
      <Satellite x={360} y={cy} />
      <T x={372} y={cy - 26} size={11.5} bold>
        satellite
      </T>
      <Note x={360} y={cy + 58} anchor="middle">
        orbit above the equator
      </Note>
      <Note x={cx} y={212} anchor="middle">
        the Earth spins once every 24 hours (not to scale)
      </Note>
    </Fig>
  );
}

function SpaceshipPlanet() {
  const cx = 200;
  const cy = 132;
  const [sx, sy] = at(cx, cy, 100, 316);
  const [rx1, ry1] = at(cx, cy, 72, 160);
  const [hx1, hy1] = at(cx, cy, 72, 332);
  const [hx2, hy2] = at(cx, cy, 100, 332);
  return (
    <Fig w={460} h={260}>
      <Dashed cx={cx} cy={cy} r={100} color={BRASS} dash="6 5" />
      <circle cx={cx} cy={cy} r={72} fill="#e8dcc2" stroke={INK} strokeWidth={1.6} />
      <T x={cx + 8} y={cy - 26} size={12} bold>
        planet
      </T>
      <Dim x1={cx} y1={cy} x2={rx1} y2={ry1} label="5220 km" lx={172} ly={170} />
      <Dim x1={hx1} y1={hy1} x2={hx2} y2={hy2} label="351 km" lx={hx2 + 10} ly={hy2 + 16} anchor="start" />
      <g transform={`rotate(-134 ${sx} ${sy})`}>
        <polygon points={`${sx - 9},${sy - 4} ${sx + 9},${sy} ${sx - 9},${sy + 4}`} fill={METAL} stroke={INK} strokeWidth={1} />
      </g>
      <T x={sx + 14} y={sy - 10} size={11.5} bold anchor="start">
        spaceship
      </T>
      <Note x={cx} y={252} anchor="middle">
        one orbit takes 5.46 × 10³ s (height exaggerated)
      </Note>
    </Fig>
  );
}

function TvSatellite() {
  const cx = 110;
  const cy = 112;
  return (
    <Fig w={460} h={230}>
      <path d={arcPath(cx, cy, 290, -18, 18)} fill="none" stroke={BRASS} strokeWidth={1.3} strokeDasharray="6 5" />
      <Body x={cx} y={cy} r={56} fill={EARTH} label="Earth" />
      <path d={`M${cx + 58},${cy - 9} Q${cx + 70},${cy} ${cx + 58},${cy + 9}`} fill="none" stroke={INK} strokeWidth={1.8} />
      <Line x1={cx + 56} y1={cy} x2={cx + 63} y2={cy} width={1.4} />
      <Line x1={cx + 68} y1={cy} x2={390} y2={cy} color={MUTE} width={1} dash="2 4" />
      <Note x={cx + 64} y={cy - 16}>
        dish
      </Note>
      <Satellite x={400} y={cy} />
      <T x={386} y={cy - 16} size={11.5} bold anchor="end">
        satellite, 300 kg
      </T>
      <Line x1={cx} y1={cy + 60} x2={cx} y2={200} color={MUTE} width={1} dash="2 3" />
      <Line x1={400} y1={cy + 10} x2={400} y2={200} color={MUTE} width={1} dash="2 3" />
      <Dim x1={cx} y1={194} x2={400} y2={194} label="4.22 × 10⁷ m (centre to satellite)" lx={250} ly={186} />
      <Note x={16} y={222}>
        not to scale
      </Note>
    </Fig>
  );
}

function Phobos() {
  const cx = 210;
  const cy = 116;
  const [px, py] = at(cx, cy, 92, 320);
  return (
    <Fig w={460} h={240}>
      <Dashed cx={cx} cy={cy} r={92} color={BRASS} dash="6 5" />
      <Body x={cx} y={cy} r={40} fill={MARS} label="Mars" />
      <Line x1={cx} y1={cy} x2={px} y2={py} width={1.1} />
      <T x={r1((cx + px) / 2 + 10)} y={r1((cy + py) / 2 + 12)} size={12.5} bold>
        r
      </T>
      <ellipse cx={px} cy={py} rx={8} ry={5.5} fill="#b8a898" stroke={INK} strokeWidth={1.2} />
      <T x={px + 14} y={py - 8} size={11.5} bold anchor="start">
        Phobos
      </T>
      <Note x={cx} y={232} anchor="middle">
        mean orbital radius 9.38 × 10⁶ m, period 2.76 × 10⁴ s
      </Note>
    </Fig>
  );
}

function StarAndPlanet() {
  const cx = 210;
  const cy = 118;
  return (
    <Fig w={460} h={240}>
      <Dashed cx={cx} cy={cy} r={96} color={BRASS} dash="6 5" />
      <circle cx={cx} cy={cy} r={30} fill={SUN} stroke={BRASS} strokeWidth={1.6} />
      <T x={cx} y={cy + 5} size={13} bold>
        M
      </T>
      <Line x1={cx + 30} y1={cy} x2={cx + 87} y2={cy} color={MUTE} width={1.1} />
      <T x={cx + 58} y={cy - 7} size={12.5} color={MUTE} bold>
        r
      </T>
      <circle cx={cx + 96} cy={cy} r={9} fill="#c9d6e3" stroke={INK} strokeWidth={1.4} />
      <T x={cx + 112} y={cy + 5} size={13} bold anchor="start">
        m
      </T>
      <Arrow x1={cx + 96} y1={cy - 12} x2={cx + 96} y2={cy - 56} />
      <T x={cx + 106} y={cy - 44} size={12.5} color={TEAL} bold anchor="start">
        v
      </T>
      <Note x={cx} y={232} anchor="middle">
        a planet on a circular orbit of period T
      </Note>
    </Fig>
  );
}

function EarthAndMoon() {
  return (
    <Fig w={460} h={210}>
      <Body x={100} y={100} r={56} fill={EARTH} label="Earth" />
      <Body x={392} y={100} r={16} fill={MOON} />
      <T x={392} y={134} size={11.5} bold>
        Moon
      </T>
      <T x={100} y={30} size={11.5} color={MUTE} bold>
        5.97 × 10²⁴ kg
      </T>
      <T x={392} y={72} size={11.5} color={MUTE} bold>
        7.35 × 10²² kg
      </T>
      <Line x1={100} y1={156} x2={100} y2={180} color={MUTE} width={1} dash="2 3" />
      <Line x1={392} y1={140} x2={392} y2={180} color={MUTE} width={1} dash="2 3" />
      <Dim x1={100} y1={176} x2={392} y2={176} label="3.84 × 10⁸ m between centres" lx={246} ly={168} />
      <Note x={444} y={204} anchor="end">
        not to scale
      </Note>
    </Fig>
  );
}

function IssOrbit() {
  const cx = 190;
  const cy = 132;
  const [sx, sy] = at(cx, cy, 104, 312);
  const [hx1, hy1] = at(cx, cy, 84, 332);
  const [hx2, hy2] = at(cx, cy, 104, 332);
  return (
    <Fig w={460} h={250}>
      <Dashed cx={cx} cy={cy} r={104} color={BRASS} dash="6 5" />
      <Body x={cx} y={cy} r={84} fill={EARTH} />
      <T x={cx + 6} y={cy + 40} size={12} bold>
        Earth
      </T>
      <Dim x1={cx} y1={cy} x2={cx - 84} y2={cy} label="R" lx={cx - 42} ly={cy - 8} />
      <Dim x1={hx1} y1={hy1} x2={hx2} y2={hy2} label="408 km" lx={hx2 + 10} ly={hy2 + 16} anchor="start" />
      <SpaceStation x={sx} y={sy} />
      <T x={sx + 20} y={sy - 10} size={11.5} bold anchor="start">
        ISS
      </T>
      <Note x={16} y={244}>
        Earth’s radius R = 6.38 × 10⁶ m
      </Note>
      <Note x={444} y={244} anchor="end">
        height exaggerated
      </Note>
    </Fig>
  );
}

function MoonRadius() {
  return (
    <Fig w={460} h={200}>
      <circle cx={230} cy={96} r={64} fill={MOON} stroke={INK} strokeWidth={1.6} />
      <circle cx={204} cy={70} r={9} fill="#d4d7dc" />
      <circle cx={252} cy={126} r={7} fill="#d4d7dc" />
      <circle cx={196} cy={124} r={5} fill="#d4d7dc" />
      <Dim x1={230} y1={96} x2={294} y2={96} label="1.74 × 10⁶ m" lx={302} ly={100} anchor="start" />
      <Dot x={230} y={96} r={2.5} />
      <T x={230} y={186} size={11.5} color={MUTE} bold>
        the Moon: mass 7.35 × 10²² kg
      </T>
    </Fig>
  );
}

// Eₚ against r, four sketches. Only C is −GMm/r: negative, rising towards 0.
function epCurve(x0: number, y0: number, shape: (u: number) => number): string {
  const pts: string[] = [];
  for (let i = 0; i <= 23; i++) {
    const u = 1 + i * 0.2;
    pts.push(`${r1(x0 + 48 + (u - 1) * 30)},${r1(y0 + 62 - shape(u))}`);
  }
  return pts.join(' ');
}

const EP_SHAPES: Array<[string, (u: number) => number]> = [
  ['A', (u) => 48 / u],
  ['B', (u) => (u - 1) * 7],
  ['C', (u) => -48 / u],
  ['D', (u) => -48 * (1 - 1 / u)],
];

function EpGraphs() {
  return (
    <Fig w={460} h={290}>
      {EP_SHAPES.map(([letter, shape], i) => {
        const x0 = 20 + (i % 2) * 222;
        const y0 = 14 + Math.floor(i / 2) * 138;
        return (
          <g key={letter}>
            <line x1={x0 + 18} y1={y0 + 118} x2={x0 + 18} y2={y0 + 6} stroke={INK} strokeWidth={1.2} markerEnd="url(#cg-ink)" />
            <line x1={x0 + 18} y1={y0 + 62} x2={x0 + 196} y2={y0 + 62} stroke={INK} strokeWidth={1.2} markerEnd="url(#cg-ink)" />
            <line x1={x0 + 48} y1={y0 + 12} x2={x0 + 48} y2={y0 + 116} stroke={MUTE} strokeWidth={0.9} strokeDasharray="3 3" />
            <T x={x0 + 26} y={y0 + 14} size={11} anchor="start" bold>
              Eₚ
            </T>
            <T x={x0 + 196} y={y0 + 76} size={11} bold>
              r
            </T>
            <T x={x0 + 10} y={y0 + 66} size={10.5} color={MUTE}>
              0
            </T>
            <T x={x0 + 54} y={y0 + 124} size={10.5} color={MUTE}>
              R
            </T>
            <polyline points={epCurve(x0, y0, shape)} fill="none" stroke={BRASS} strokeWidth={2.2} />
            <T x={x0 + 196} y={y0 + 20} size={14} bold anchor="end">
              {letter}
            </T>
          </g>
        );
      })}
    </Fig>
  );
}

function SatelliteAltitude() {
  const cy = 128;
  return (
    <Fig w={460} h={240}>
      <Body x={110} y={cy} r={58} fill={EARTH} label="Earth" />
      <Satellite x={390} y={cy} />
      <T x={390} y={cy - 16} size={11.5} bold>
        satellite, 2500 kg
      </T>
      <Line x1={110} y1={cy + 60} x2={110} y2={212} color={MUTE} width={1} dash="2 3" />
      <Line x1={168} y1={cy} x2={168} y2={212} color={MUTE} width={1} dash="2 3" />
      <Line x1={390} y1={cy + 8} x2={390} y2={212} color={MUTE} width={1} dash="2 3" />
      <Dim x1={110} y1={208} x2={168} y2={208} label="6.38 × 10⁶ m" lx={139} ly={230} />
      <Dim x1={168} y1={208} x2={390} y2={208} label="3.60 × 10⁷ m above the surface" lx={279} ly={200} />
      <Note x={444} y={22} anchor="end">
        not to scale
      </Note>
    </Fig>
  );
}

function OrbitRaise() {
  const cx = 200;
  const cy = 140;
  const [ix, iy] = at(cx, cy, 62, 330);
  const [ox, oy] = at(cx, cy, 112, 330);
  const [a1x, a1y] = at(cx, cy, 72, 330);
  const [a2x, a2y] = at(cx, cy, 102, 330);
  const [rx1, ry1] = at(cx, cy, 62, 250);
  const [rx2, ry2] = at(cx, cy, 112, 150);
  return (
    <Fig w={460} h={272}>
      <Dashed cx={cx} cy={cy} r={62} />
      <Dashed cx={cx} cy={cy} r={112} />
      <Body x={cx} y={cy} r={34} fill={EARTH} />
      <T x={cx} y={cy + 20} size={11} bold>
        Earth
      </T>
      <Line x1={cx} y1={cy} x2={rx1} y2={ry1} color={MUTE} width={1.1} />
      <Line x1={cx} y1={cy} x2={rx2} y2={ry2} color={MUTE} width={1.1} />
      <T x={r1(rx1 - 8)} y={r1(ry1 + 14)} size={12} color={MUTE} bold anchor="end">
        r₁
      </T>
      <T x={r1((cx + rx2) / 2 - 4)} y={r1((cy + ry2) / 2 + 16)} size={12} color={MUTE} bold>
        r₂
      </T>
      <Satellite x={ix} y={iy} />
      <GhostSatellite x={ox} y={oy} />
      <Arrow x1={a1x} y1={a1y} x2={a2x} y2={a2y} color={BRASS} />
      <Note x={16} y={20}>
        satellite, 4500 kg, moved out to the higher orbit
      </Note>
      <Note x={336} y={222}>
        r₁ = 1.8 × 10⁷ m
      </Note>
      <Note x={336} y={240}>
        r₂ = 4.2 × 10⁷ m
      </Note>
      <Note x={444} y={264} anchor="end">
        not to scale
      </Note>
    </Fig>
  );
}

function IssDrop() {
  const cx = 230;
  const cy = 560;
  const R = 440;
  // the arc meets the figure's edges: x = 0 and x = 460
  const edgeY = r1(cy - Math.sqrt(R * R - cx * cx));
  const arc = `M0,${edgeY} A${R},${R} 0 0,1 460,${edgeY}`;
  return (
    <Fig w={460} h={240}>
      <path d={`${arc} L460,240 L0,240 Z`} fill={EARTH} />
      <path d={arc} fill="none" stroke={INK} strokeWidth={1.4} />
      <T x={cx} y={196} size={12} bold>
        Earth
      </T>
      <Note x={cx} y={214} anchor="middle">
        radius 6.38 × 10⁶ m
      </Note>
      <SpaceStation x={cx} y={40} />
      <T x={cx + 22} y={36} size={11.5} bold anchor="start">
        ISS
      </T>
      <rect x={cx - 4} y={56} width={8} height={8} fill="#c9a36b" stroke={INK} strokeWidth={1} />
      <Arrow x1={cx} y1={68} x2={cx} y2={114} color={MUTE} width={1.4} dash="4 3" />
      <T x={cx - 12} y={64} size={11.5} anchor="end">
        250 kg capsule, released from rest
      </T>
      <Dim x1={306} y1={40} x2={306} y2={126} label="3.50 × 10⁵ m" lx={314} ly={88} anchor="start" />
      <Note x={16} y={20}>
        no air resistance (height exaggerated)
      </Note>
    </Fig>
  );
}

function AsteroidInfall() {
  return (
    <Fig w={460} h={200}>
      <Rock x={46} y={100} />
      <Arrow x1={62} y1={100} x2={306} y2={100} color={MUTE} width={1.4} dash="6 5" />
      <Line x1={176} y1={90} x2={170} y2={110} color={MUTE} width={1.3} />
      <Line x1={184} y1={90} x2={178} y2={110} color={MUTE} width={1.3} />
      <Body x={370} y={100} r={56} fill={EARTH} label="Earth" />
      <T x={30} y={72} size={11.5} bold anchor="start">
        asteroid, 2.35 × 10¹⁶ kg
      </T>
      <Note x={30} y={134}>
        starts at rest, very far away
      </Note>
      <Note x={370} y={176} anchor="middle">
        radius 6.38 × 10⁶ m
      </Note>
      <Note x={370} y={192} anchor="middle">
        mass 5.98 × 10²⁴ kg
      </Note>
    </Fig>
  );
}

function EscapeRock() {
  return (
    <Fig w={460} h={200}>
      <Body x={120} y={96} r={56} fill={EARTH} label="Earth" />
      <Rock x={184} y={96} s={0.6} />
      <Arrow x1={194} y1={96} x2={292} y2={96} width={2.4} />
      <T x={243} y={86} size={12} color={TEAL} bold>
        v = ?
      </T>
      <Arrow x1={304} y1={96} x2={444} y2={96} color={MUTE} width={1.2} dash="4 4" />
      <Note x={374} y={86} anchor="middle">
        to infinity
      </Note>
      <T x={200} y={126} size={11.5} bold anchor="start">
        1.0 kg rock
      </T>
      <Note x={120} y={176} anchor="middle">
        radius 6.38 × 10⁶ m, mass 5.98 × 10²⁴ kg
      </Note>
    </Fig>
  );
}

function OrbitLower() {
  const cx = 190;
  const cy = 130;
  const [sx, sy] = at(cx, cy, 104, 322);
  const [gx, gy] = at(cx, cy, 84, 345);
  const [o1x, o1y] = at(cx, cy, 64, 215);
  const [o2x, o2y] = at(cx, cy, 104, 215);
  const [i1x, i1y] = at(cx, cy, 64, 150);
  const [i2x, i2y] = at(cx, cy, 84, 150);
  return (
    <Fig w={460} h={250}>
      <Dashed cx={cx} cy={cy} r={104} />
      <Dashed cx={cx} cy={cy} r={84} />
      <Body x={cx} y={cy} r={64} fill={EARTH} label="Earth" />
      <Dim x1={o1x} y1={o1y} x2={o2x} y2={o2y} label="980 km" lx={o2x - 6} ly={o2y - 8} anchor="end" />
      <Dim x1={i1x} y1={i1y} x2={i2x} y2={i2y} label="480 km" lx={r1(i2x - 26)} ly={r1(i2y + 20)} anchor="end" />
      <Satellite x={sx} y={sy} />
      <GhostSatellite x={gx} y={gy} />
      <path
        d={`M${r1(sx + 12)},${r1(sy + 6)} Q${r1(sx + 26)},${r1((sy + gy) / 2)} ${r1(gx + 9)},${r1(gy - 3)}`}
        fill="none"
        stroke={BRASS}
        strokeWidth={1.5}
        markerEnd="url(#cg-brass)"
      />
      <T x={sx + 18} y={sy - 10} size={11.5} bold anchor="start">
        satellite, 1450 kg
      </T>
      <Note x={444} y={244} anchor="end">
        heights above the surface (exaggerated)
      </Note>
    </Fig>
  );
}

export const CIRCULAR_GRAVITY_DIAGRAMS: Record<string, ReactNode> = {
  // 12.1 Kinematics of uniform circular motion
  'circ-mass-on-string': <MassOnString />,
  'circ-aircraft-loop': <AircraftLoop />,
  'circ-whistle-plan': <WhistlePlan />,
  'circ-merry-go-round': <MerryGoRound />,
  'circ-baggage-belt': <BaggageBelt />,
  'circ-skaters': <Skaters />,
  // 12.2 Centripetal acceleration
  'circ-table-hole': <TableAndHole />,
  'circ-flat-bend': <FlatBend />,
  'circ-vertical-string': <VerticalString />,
  'circ-vertical-top': <VerticalTop />,
  'circ-banked-road': <BankedRoad values={false} />,
  'circ-banked-road-475': <BankedRoad values />,
  'circ-toy-plane': <ToyPlane />,
  'circ-theme-park': <ThemeParkCar />,
  'circ-ball-cord': <BallOnCord mode="speed" />,
  'circ-ball-cord-angle': <BallOnCord mode="angle" />,
  'circ-ball-cord-top': <BallOnCord mode="top" />,
  'circ-ball-cord-top-bottom': <BallTopAndBottom />,
  'circ-conical-bob': <ConicalBob />,
  'circ-observation-wheel': <ObservationWheel />,
  'circ-hammer-throw': <HammerThrow />,
  'circ-ball-overhead': <BallOverhead />,
  // 13.1–13.4 Gravitational fields
  'grav-field-lines': <FieldLines />,
  'grav-shuttle-orbit': <ShuttleOrbit />,
  'grav-two-students': <TwoStudents />,
  'grav-weight-scaling': <WeightScaling />,
  'grav-moon-orbit': <MoonOrbit />,
  'grav-orbit-85e7': <EarthOrbit radius="8.50 × 10⁷ m" mass="4500 kg" />,
  'grav-orbit-22e7': <EarthOrbit radius="2.20 × 10⁷ m" />,
  'grav-two-orbits': <TwoOrbits />,
  'grav-sun-earth': <SunAndEarthOrbits />,
  'grav-geostationary': <Geostationary />,
  'grav-spaceship-planet': <SpaceshipPlanet />,
  'grav-tv-satellite': <TvSatellite />,
  'grav-phobos': <Phobos />,
  'grav-star-planet': <StarAndPlanet />,
  'grav-earth-moon': <EarthAndMoon />,
  'grav-iss-orbit': <IssOrbit />,
  'grav-moon-radius': <MoonRadius />,
  'grav-ep-graphs': <EpGraphs />,
  'grav-satellite-altitude': <SatelliteAltitude />,
  'grav-orbit-raise': <OrbitRaise />,
  'grav-iss-drop': <IssDrop />,
  'grav-asteroid': <AsteroidInfall />,
  'grav-escape': <EscapeRock />,
  'grav-orbit-lower': <OrbitLower />,
};
