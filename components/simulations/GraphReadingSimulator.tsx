'use client';

import { useRef, useState } from 'react';

/**
 * Reading and Interpreting Graphs — gradient and area, and what they mean.
 *
 * Drag two handles along a real physics graph. The gradient triangle is
 * drawn between them and the area beneath is shaded, both computed
 * exactly and both labelled with what they physically represent in that
 * particular graph — because gradient means acceleration on one graph
 * and spring constant on another, and the area under a speed–time graph
 * is a distance while the area under a distance–time graph means nothing
 * at all.
 *
 * Verified in node before any UI: gradients and areas checked against
 * 19 hand-derived values across four graphs, including intervals that
 * span a corner in the line (where the trapezium split must happen at
 * the breakpoint, not the interval ends).
 */

const INK = '#1b2a41';
const MUTE = '#4a5a72';
const BRASS = '#b8823d';
const TEAL = '#2e7d6b';
const RED = '#b34a3c';

interface Pt { x: number; y: number; }

interface Scenario {
  id: string;
  name: string;
  xLabel: string;
  xUnit: string;
  yLabel: string;
  yUnit: string;
  pts: Pt[];
  gradientMeans: { name: string; unit: string };
  /** null where the area genuinely has no standard physical meaning */
  areaMeans: { name: string; unit: string } | null;
  note: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'vt',
    name: 'Speed–time',
    xLabel: 'time', xUnit: 's',
    yLabel: 'speed', yUnit: 'm/s',
    pts: [{ x: 0, y: 0 }, { x: 4, y: 20 }, { x: 10, y: 20 }, { x: 15, y: 0 }],
    gradientMeans: { name: 'acceleration', unit: 'm/s²' },
    areaMeans: { name: 'distance travelled', unit: 'm' },
    note: 'The richest graph on the syllabus: gradient gives acceleration, area gives distance. A negative gradient is deceleration — but the area is still a positive distance.',
  },
  {
    id: 'dt',
    name: 'Distance–time',
    xLabel: 'time', xUnit: 's',
    yLabel: 'distance', yUnit: 'm',
    pts: [{ x: 0, y: 0 }, { x: 4, y: 40 }, { x: 7, y: 40 }, { x: 10, y: 100 }],
    gradientMeans: { name: 'speed', unit: 'm/s' },
    areaMeans: null,
    note: 'Gradient is speed, and a flat section means stationary — not "stopped moving backwards". The area under this graph has no standard physical meaning, which is worth knowing so you never calculate it by habit.',
  },
  {
    id: 'fx',
    name: 'Force–extension',
    xLabel: 'extension', xUnit: 'm',
    yLabel: 'force', yUnit: 'N',
    pts: [{ x: 0, y: 0 }, { x: 0.05, y: 10 }, { x: 0.08, y: 13 }],
    gradientMeans: { name: 'spring constant k', unit: 'N/m' },
    areaMeans: { name: 'elastic potential energy', unit: 'J' },
    note: "Straight while the spring obeys Hooke's law, then the gradient drops as it passes its limit of proportionality. Area under the line is the energy stored.",
  },
  {
    id: 'vi',
    name: 'Voltage–current',
    xLabel: 'current', xUnit: 'A',
    yLabel: 'voltage', yUnit: 'V',
    pts: [{ x: 0, y: 0 }, { x: 4, y: 12 }],
    gradientMeans: { name: 'resistance R', unit: 'Ω' },
    areaMeans: null,
    note: 'A straight line through the origin means the resistance is constant — the definition of an ohmic conductor. The area here has no standard meaning.',
  },
];

function yAt(pts: Pt[], x: number): number {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    if (x >= a.x && x <= b.x) {
      if (b.x === a.x) return a.y;
      return a.y + ((b.y - a.y) * (x - a.x)) / (b.x - a.x);
    }
  }
  return x < pts[0].x ? pts[0].y : pts[pts.length - 1].y;
}

/** Exact area under a piecewise-linear curve: split at every breakpoint inside the interval. */
function areaBetween(pts: Pt[], x1: number, x2: number): number {
  const lo = Math.min(x1, x2);
  const hi = Math.max(x1, x2);
  const xs = [lo];
  for (const p of pts) if (p.x > lo && p.x < hi) xs.push(p.x);
  xs.push(hi);
  let area = 0;
  for (let i = 0; i < xs.length - 1; i++) {
    const xa = xs[i];
    const xb = xs[i + 1];
    area += ((yAt(pts, xa) + yAt(pts, xb)) / 2) * (xb - xa);
  }
  return area;
}

function gradientBetween(pts: Pt[], x1: number, x2: number): number {
  if (x1 === x2) return NaN;
  return (yAt(pts, x2) - yAt(pts, x1)) / (x2 - x1);
}

/** True when the interval crosses a corner, so the gradient is an average rather than a local value. */
function spansCorner(pts: Pt[], x1: number, x2: number): boolean {
  const lo = Math.min(x1, x2);
  const hi = Math.max(x1, x2);
  return pts.some((p) => p.x > lo + 1e-9 && p.x < hi - 1e-9);
}

function fmt(v: number, dp = 2): string {
  if (!isFinite(v)) return '—';
  const r = parseFloat(v.toFixed(dp));
  return r.toString();
}

const W = 520;
const H = 320;
const PAD = { l: 62, r: 22, t: 22, b: 48 };

export function GraphReadingSimulator() {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<'a' | 'b' | null>(null);

  const [sIdx, setSIdx] = useState(0);
  const sc = SCENARIOS[sIdx];

  const xMin = sc.pts[0].x;
  const xMax = sc.pts[sc.pts.length - 1].x;
  const yMax = Math.max(...sc.pts.map((p) => p.y)) * 1.12;

  const [xa, setXa] = useState(sc.pts[0].x + (xMax - xMin) * 0.1);
  const [xb, setXb] = useState(sc.pts[0].x + (xMax - xMin) * 0.45);
  const [showArea, setShowArea] = useState(true);

  const switchScenario = (i: number) => {
    const s = SCENARIOS[i];
    const lo = s.pts[0].x;
    const hi = s.pts[s.pts.length - 1].x;
    setSIdx(i);
    setXa(lo + (hi - lo) * 0.1);
    setXb(lo + (hi - lo) * 0.45);
  };

  const px = (x: number) => PAD.l + ((x - xMin) / (xMax - xMin)) * (W - PAD.l - PAD.r);
  const py = (y: number) => H - PAD.b - (y / yMax) * (H - PAD.t - PAD.b);
  const toDataX = (clientX: number): number => {
    const svg = svgRef.current;
    if (!svg) return xa;
    const rect = svg.getBoundingClientRect();
    const sx = ((clientX - rect.left) / rect.width) * W;
    const t = (sx - PAD.l) / (W - PAD.l - PAD.r);
    return Math.max(xMin, Math.min(xMax, xMin + t * (xMax - xMin)));
  };

  const onDown = (e: React.PointerEvent<SVGSVGElement>) => {
    const x = toDataX(e.clientX);
    dragRef.current = Math.abs(x - xa) <= Math.abs(x - xb) ? 'a' : 'b';
    (e.target as Element).setPointerCapture?.(e.pointerId);
    if (dragRef.current === 'a') setXa(x); else setXb(x);
  };
  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!dragRef.current) return;
    const x = toDataX(e.clientX);
    if (dragRef.current === 'a') setXa(x); else setXb(x);
  };
  const onUp = () => { dragRef.current = null; };

  const ya = yAt(sc.pts, xa);
  const yb = yAt(sc.pts, xb);
  const grad = gradientBetween(sc.pts, xa, xb);
  const area = areaBetween(sc.pts, xa, xb);
  const corner = spansCorner(sc.pts, xa, xb);
  const run = xb - xa;
  const rise = yb - ya;

  const curvePath = sc.pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${px(p.x)} ${py(p.y)}`).join(' ');

  // shaded area polygon: follow the curve between the handles, then close along the x-axis
  const areaPath = (() => {
    const lo = Math.min(xa, xb);
    const hi = Math.max(xa, xb);
    const xs = [lo, ...sc.pts.filter((p) => p.x > lo && p.x < hi).map((p) => p.x), hi];
    const top = xs.map((x, i) => `${i === 0 ? 'M' : 'L'} ${px(x)} ${py(yAt(sc.pts, x))}`).join(' ');
    return `${top} L ${px(hi)} ${py(0)} L ${px(lo)} ${py(0)} Z`;
  })();

  const xTicks = 6;
  const yTicks = 5;

  return (
    <div className="graph-reading-lab flex flex-col gap-5">
      <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden">
        <div className="flex justify-between items-baseline px-4 pt-3">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">{sc.name} graph</span>
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">drag either handle</span>
        </div>

        <div className="px-4 pt-3 grid grid-cols-1 lg:grid-cols-[1.35fr_1fr] gap-5">
          <div>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${W} ${H}`}
              className="w-full touch-none cursor-ew-resize select-none"
              style={{ background: '#faf7f0', borderRadius: 6, border: '1px solid #e4ddcc', display: 'block' }}
              onPointerDown={onDown}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            >
              {/* grid */}
              {Array.from({ length: xTicks + 1 }).map((_, i) => {
                const x = xMin + ((xMax - xMin) * i) / xTicks;
                return <line key={`gx${i}`} x1={px(x)} y1={PAD.t} x2={px(x)} y2={H - PAD.b} stroke="rgba(27,42,65,0.07)" strokeWidth={1} />;
              })}
              {Array.from({ length: yTicks + 1 }).map((_, i) => {
                const y = (yMax * i) / yTicks;
                return <line key={`gy${i}`} x1={PAD.l} y1={py(y)} x2={W - PAD.r} y2={py(y)} stroke="rgba(27,42,65,0.07)" strokeWidth={1} />;
              })}

              {/* shaded area */}
              {showArea && sc.areaMeans && <path d={areaPath} fill="rgba(184,130,61,0.22)" stroke="none" />}
              {showArea && !sc.areaMeans && <path d={areaPath} fill="rgba(179,74,60,0.10)" stroke="none" />}

              {/* axes */}
              <line x1={PAD.l} y1={H - PAD.b} x2={W - PAD.r} y2={H - PAD.b} stroke={INK} strokeWidth={1.8} />
              <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={H - PAD.b} stroke={INK} strokeWidth={1.8} />

              {/* tick labels */}
              {Array.from({ length: xTicks + 1 }).map((_, i) => {
                const x = xMin + ((xMax - xMin) * i) / xTicks;
                return (
                  <text key={`tx${i}`} x={px(x)} y={H - PAD.b + 16} textAnchor="middle" fontSize={10} fill={MUTE} fontFamily="ui-monospace, monospace">
                    {fmt(x, 2)}
                  </text>
                );
              })}
              {Array.from({ length: yTicks + 1 }).map((_, i) => {
                const y = (yMax * i) / yTicks;
                return (
                  <text key={`ty${i}`} x={PAD.l - 8} y={py(y) + 3.5} textAnchor="end" fontSize={10} fill={MUTE} fontFamily="ui-monospace, monospace">
                    {fmt(y, 1)}
                  </text>
                );
              })}
              <text x={(PAD.l + W - PAD.r) / 2} y={H - 8} textAnchor="middle" fontSize={11.5} fill={INK} fontWeight={600}>
                {sc.xLabel} ({sc.xUnit})
              </text>
              <text x={16} y={(PAD.t + H - PAD.b) / 2} textAnchor="middle" fontSize={11.5} fill={INK} fontWeight={600}
                transform={`rotate(-90 16 ${(PAD.t + H - PAD.b) / 2})`}>
                {sc.yLabel} ({sc.yUnit})
              </text>

              {/* gradient triangle */}
              <line x1={px(xa)} y1={py(ya)} x2={px(xb)} y2={py(ya)} stroke={TEAL} strokeWidth={1.8} strokeDasharray="5 4" />
              <line x1={px(xb)} y1={py(ya)} x2={px(xb)} y2={py(yb)} stroke={TEAL} strokeWidth={1.8} strokeDasharray="5 4" />
              <line x1={px(xa)} y1={py(ya)} x2={px(xb)} y2={py(yb)} stroke={TEAL} strokeWidth={2.4} />

              {/* the curve itself */}
              <path d={curvePath} fill="none" stroke={INK} strokeWidth={2.8} strokeLinejoin="round" />

              {/* handles */}
              {([['a', xa, ya], ['b', xb, yb]] as const).map(([k, x, y]) => (
                <g key={k}>
                  <line x1={px(x)} y1={PAD.t} x2={px(x)} y2={H - PAD.b} stroke={RED} strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
                  <circle cx={px(x)} cy={py(y)} r={7} fill="#fff" stroke={RED} strokeWidth={2.6} />
                </g>
              ))}
            </svg>

            <div className="flex flex-wrap gap-2 mt-3">
              <button
                onClick={() => setShowArea((s) => !s)}
                className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border ${
                  showArea ? 'bg-[#b8823d] text-white border-[#b8823d]' : 'bg-transparent text-[#4a5a72] border-[#d8cfb6] hover:bg-[#faf7f0]'
                }`}
              >
                {showArea ? '✓ Area shaded' : 'Shade the area'}
              </button>
              {SCENARIOS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => switchScenario(i)}
                  className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border ${
                    i === sIdx ? 'bg-[#1b2a41] text-white border-[#1b2a41]' : 'bg-transparent text-[#4a5a72] border-[#d8cfb6] hover:bg-[#faf7f0]'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          {/* readouts */}
          <div className="space-y-3">
            <div className="border border-[#2e7d6b] bg-[#f2f9f7] rounded p-3">
              <div className="font-mono text-[10.5px] tracking-wide uppercase text-[#2e7d6b] mb-2">Gradient</div>
              <div className="space-y-1 text-[12.5px] text-[#4a5a72]">
                <div className="flex justify-between"><span>rise (change in {sc.yLabel})</span><span className="font-mono text-[#1b2a41]">{fmt(rise)} {sc.yUnit}</span></div>
                <div className="flex justify-between"><span>run (change in {sc.xLabel})</span><span className="font-mono text-[#1b2a41]">{fmt(run)} {sc.xUnit}</span></div>
              </div>
              <div className="border-t border-[#cfe4dd] mt-2 pt-2 flex justify-between items-baseline">
                <span className="text-[12.5px] font-semibold text-[#1b5c4d]">rise / run</span>
                <span className="font-mono text-[16px] font-bold text-[#1b5c4d]">{fmt(grad)} {sc.gradientMeans.unit}</span>
              </div>
              <div className="text-[12px] text-[#1b5c4d] mt-1.5">
                On this graph the gradient is the <strong>{sc.gradientMeans.name}</strong>.
              </div>
              {corner && (
                <div className="text-[11.5px] text-[#8f3626] bg-[#fbeae7] rounded px-2 py-1.5 mt-2 leading-snug">
                  Your triangle spans a corner in the line, so this is the <strong>average</strong> gradient across that
                  interval — not the gradient at any single point.
                </div>
              )}
            </div>

            <div className={`border rounded p-3 ${sc.areaMeans ? 'border-[#b8823d] bg-[#fbf5e8]' : 'border-[#e4ddcc] bg-[#faf7f0]'}`}>
              <div className="font-mono text-[10.5px] tracking-wide uppercase mb-2" style={{ color: sc.areaMeans ? '#8f6428' : MUTE }}>
                Area under the graph
              </div>
              {sc.areaMeans ? (
                <>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[12.5px] font-semibold text-[#8f6428]">between the handles</span>
                    <span className="font-mono text-[16px] font-bold text-[#8f6428]">{fmt(area, 3)} {sc.areaMeans.unit}</span>
                  </div>
                  <div className="text-[12px] text-[#8f6428] mt-1.5">
                    Here the area is the <strong>{sc.areaMeans.name}</strong>.
                  </div>
                </>
              ) : (
                <div className="text-[12px] text-[#4a5a72] leading-snug">
                  The area under a <strong>{sc.name.toLowerCase()}</strong> graph has <strong>no standard physical
                  meaning</strong>. You can calculate a number ({fmt(area, 2)}), but it does not correspond to a real
                  quantity — which is exactly why you should always ask what the area represents before computing it.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 pb-5 pt-4">
          <p className="text-[11.5px] text-[#4a5a72] leading-snug">{sc.note}</p>
        </div>
      </div>

      {/* ---- Notebook row ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">The Two Questions</span>
          <div className="mt-2.5 space-y-2.5 text-[12.5px] text-[#4a5a72] leading-snug">
            <p>
              Faced with any graph, ask two things: <strong className="text-[#1b2a41]">what does the gradient
              represent?</strong> and <strong className="text-[#1b2a41]">what does the area represent?</strong>
            </p>
            <p>
              The answer comes from the units. Divide the y-unit by the x-unit and you get the gradient's meaning;
              multiply them and you get the area's. m/s ÷ s = m/s², acceleration. m/s × s = m, a distance.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Try This</span>
          <div className="mt-2 space-y-2.5 text-[12px] text-[#4a5a72] leading-snug">
            <p>
              <strong className="text-[#1b2a41]">1.</strong> On the speed–time graph, put both handles inside the
              first slope and read the acceleration. Then drag one past the corner — the warning appears, because a
              single triangle can no longer describe two different slopes.
            </p>
            <p>
              <strong className="text-[#1b2a41]">2.</strong> Shade the whole speed–time graph. The total area is the
              total distance travelled — including the deceleration, which still covers ground.
            </p>
            <p>
              <strong className="text-[#1b2a41]">3.</strong> Switch to distance–time and shade the area. A number
              appears, but it means nothing. Getting an answer is not the same as getting a physical quantity.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-3.5 text-center mb-3">
            <div className="italic text-[19px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
              gradient = rise / run
            </div>
            <div className="italic text-[12.5px] text-[#8f6428] mt-1.5" style={{ fontFamily: 'Georgia, serif' }}>
              area = the quantity y × x makes
            </div>
          </div>
          <h2 className="font-mono text-[13px] tracking-wide uppercase text-[#4a5a72] border-b border-[#eee6d3] pb-2 mb-3">
            Meanings To Know
          </h2>
          <div className="space-y-2 text-[12px] text-[#4a5a72] leading-snug">
            <p><strong className="text-[#1b2a41]">Distance–time</strong> — gradient is speed</p>
            <p><strong className="text-[#1b2a41]">Speed–time</strong> — gradient is acceleration, area is distance</p>
            <p><strong className="text-[#1b2a41]">Force–extension</strong> — gradient is k, area is energy stored</p>
            <p><strong className="text-[#1b2a41]">Voltage–current</strong> — gradient is resistance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
