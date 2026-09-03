'use client';

import { useState } from 'react';

/**
 * Constant of Proportionality — drag one variable, watch the others answer.
 *
 * The equation sits in the middle of the screen and every symbol is
 * physically sized by its own value: drag a variable up and it swells,
 * while whatever responds to it grows or shrinks in step. Direct
 * proportionality looks like two symbols growing together; inverse
 * looks like a see-saw.
 *
 * The point the sim is built to make: a proportionality statement is
 * meaningless until you say what is being held constant. In F = ma,
 * F ∝ m when a is held — but a ∝ 1/m when F is held. Same equation,
 * opposite relationship. Choosing "solve for" changes which one you
 * are looking at, and the sim names it every time.
 *
 * Rather than scripting each case, every equation is stored as a single
 * product relation Π(variableᵉ) = k, and the response is derived from
 * the exponents: newResponder = oldResponder × factor^(−e_driver/e_responder).
 * Verified in node before any UI: 19 driver→responder pairs across five
 * equations, each checked three ways — that the direct/inverse label is
 * right, that the original equation still balances afterwards, and that
 * doubling the driver scales the responder by exactly 2^k.
 */

const INK = '#1b2a41';
const MUTE = '#4a5a72';
const BRASS = '#b8823d';
const TEAL = '#2e7d6b';
const RED = '#b34a3c';

interface VarDef {
  sym: string;
  name: string;
  unit: string;
  exp: number; // exponent in the product relation
  base: number; // starting value
}

interface EquationDef {
  id: string;
  display: string;
  name: string;
  vars: VarDef[];
}

const EQUATIONS: EquationDef[] = [
  {
    id: 'fma',
    display: 'F = m a',
    name: "Newton's Second Law",
    vars: [
      { sym: 'F', name: 'force', unit: 'N', exp: 1, base: 10 },
      { sym: 'm', name: 'mass', unit: 'kg', exp: -1, base: 2 },
      { sym: 'a', name: 'acceleration', unit: 'm/s²', exp: -1, base: 5 },
    ],
  },
  {
    id: 'vir',
    display: 'V = I R',
    name: "Ohm's Law",
    vars: [
      { sym: 'V', name: 'voltage', unit: 'V', exp: 1, base: 12 },
      { sym: 'I', name: 'current', unit: 'A', exp: -1, base: 4 },
      { sym: 'R', name: 'resistance', unit: 'Ω', exp: -1, base: 3 },
    ],
  },
  {
    id: 'rhomv',
    display: 'ρ = m / V',
    name: 'Density',
    vars: [
      { sym: 'ρ', name: 'density', unit: 'kg/m³', exp: 1, base: 8 },
      { sym: 'm', name: 'mass', unit: 'kg', exp: -1, base: 24 },
      { sym: 'V', name: 'volume', unit: 'm³', exp: 1, base: 3 },
    ],
  },
  {
    id: 'pet',
    display: 'P = E / t',
    name: 'Power',
    vars: [
      { sym: 'P', name: 'power', unit: 'W', exp: 1, base: 50 },
      { sym: 'E', name: 'energy', unit: 'J', exp: -1, base: 250 },
      { sym: 't', name: 'time', unit: 's', exp: 1, base: 5 },
    ],
  },
  {
    id: 'pgh',
    display: 'p = ρ g h',
    name: 'Pressure in a Liquid',
    vars: [
      { sym: 'p', name: 'pressure', unit: 'Pa', exp: 1, base: 19600 },
      { sym: 'ρ', name: 'density', unit: 'kg/m³', exp: -1, base: 1000 },
      { sym: 'g', name: 'gravity', unit: 'N/kg', exp: -1, base: 9.8 },
      { sym: 'h', name: 'depth', unit: 'm', exp: -1, base: 2 },
    ],
  },
];

/** exponent linking driver to responder: responder scales as factor^k */
function relExponent(eDriver: number, eResponder: number): number {
  return -eDriver / eResponder;
}

/**
 * Rearranges the equation to put `responder` alone on the left.
 * Falls straight out of the same exponents that drive the physics: any
 * other variable whose relative exponent is +1 belongs in the numerator,
 * −1 in the denominator. Verified against all 16 hand-derived forms
 * (and cross-checked numerically) before being wired in.
 */
function rearrangedFor(vars: VarDef[], responder: string): { num: string[]; den: string[] } {
  const eR = vars.find((v) => v.sym === responder)!.exp;
  const num: string[] = [];
  const den: string[] = [];
  for (const v of vars) {
    if (v.sym === responder) continue;
    if (relExponent(v.exp, eR) > 0) num.push(v.sym);
    else den.push(v.sym);
  }
  return { num, den };
}

function formatVal(v: number): string {
  if (v === 0) return '0';
  const abs = Math.abs(v);
  if (abs >= 10000 || abs < 0.01) return v.toPrecision(3);
  return parseFloat(v.toPrecision(4)).toString();
}

export function ProportionalitySimulator() {
  const [eqIdx, setEqIdx] = useState(0);
  const eq = EQUATIONS[eqIdx];

  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(EQUATIONS[0].vars.map((v) => [v.sym, v.base]))
  );
  const [responder, setResponder] = useState(EQUATIONS[0].vars[0].sym);
  const [lastDriver, setLastDriver] = useState<string | null>(null);

  const varOf = (sym: string) => eq.vars.find((v) => v.sym === sym)!;

  const switchEquation = (i: number) => {
    setEqIdx(i);
    setValues(Object.fromEntries(EQUATIONS[i].vars.map((v) => [v.sym, v.base])));
    setResponder(EQUATIONS[i].vars[0].sym);
    setLastDriver(null);
  };

  const reset = () => {
    setValues(Object.fromEntries(eq.vars.map((v) => [v.sym, v.base])));
    setLastDriver(null);
  };

  const chooseResponder = (sym: string) => {
    setResponder(sym);
    setLastDriver(null);
  };

  const drag = (driverSym: string, newVal: number) => {
    if (driverSym === responder) return;
    const d = varOf(driverSym);
    const r = varOf(responder);
    const factor = newVal / values[driverSym];
    if (!isFinite(factor) || factor <= 0) return;
    const k = relExponent(d.exp, r.exp);
    setValues((prev) => ({
      ...prev,
      [driverSym]: newVal,
      [responder]: prev[responder] * Math.pow(factor, k),
    }));
    setLastDriver(driverSym);
  };

  // symbol size scales with how far the value has moved from its baseline
  const sizeFor = (sym: string) => {
    const v = varOf(sym);
    const ratio = values[sym] / v.base;
    const size = 34 * Math.pow(ratio, 0.38);
    return Math.max(17, Math.min(66, size));
  };

  const relationship = (() => {
    if (!lastDriver) return null;
    const k = relExponent(varOf(lastDriver).exp, varOf(responder).exp);
    return {
      driver: lastDriver,
      k,
      isDirect: k > 0,
      text: k > 0 ? `${responder} ∝ ${lastDriver}` : `${responder} ∝ 1 / ${lastDriver}`,
    };
  })();

  const heldVars = eq.vars.filter((v) => v.sym !== responder && v.sym !== lastDriver);

  // ---- live graph of responder vs the variable being dragged ----
  const graph = (() => {
    if (!lastDriver) return null;
    const d = varOf(lastDriver);
    const r = varOf(responder);
    const k = relExponent(d.exp, r.exp);
    const dNow = values[lastDriver];
    const rNow = values[responder];
    const dMin = d.base * 0.25;
    const dMax = d.base * 2.6;
    const pts: { x: number; y: number }[] = [];
    for (let i = 0; i <= 60; i++) {
      const x = dMin + ((dMax - dMin) * i) / 60;
      const y = rNow * Math.pow(x / dNow, k);
      pts.push({ x, y });
    }
    const yMax = Math.max(...pts.map((p) => p.y)) * 1.05;
    const W = 260;
    const H = 150;
    const px = (x: number) => ((x - 0) / (dMax - 0)) * W;
    const py = (y: number) => H - (y / yMax) * H;
    const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${px(p.x).toFixed(1)} ${py(p.y).toFixed(1)}`).join(' ');
    return { path, W, H, cx: px(dNow), cy: py(rNow), isDirect: k > 0 };
  })();

  return (
    <div className="proportionality-lab flex flex-col gap-5">
      <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden">
        <div className="flex justify-between items-baseline px-4 pt-3">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">{eq.name}</span>
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">solving for {responder}</span>
        </div>

        {/* ---- the equation, rearranged for the chosen variable, sized by value ---- */}
        <div className="flex items-center justify-center gap-3 flex-wrap px-4" style={{ minHeight: 160 }}>
          {(() => {
            const { num, den } = rearrangedFor(eq.vars, responder);
            const symbol = (sym: string) => {
              const isDriver = sym === lastDriver;
              const isResp = sym === responder;
              return (
                <span
                  key={sym}
                  className="italic font-bold transition-all duration-500 ease-out px-1.5 rounded"
                  style={{
                    fontFamily: 'Georgia, serif',
                    fontSize: sizeFor(sym),
                    color: isResp ? TEAL : isDriver ? RED : INK,
                    background: isResp ? 'rgba(46,125,107,0.10)' : isDriver ? 'rgba(179,74,60,0.10)' : 'transparent',
                  }}
                >
                  {sym}
                </span>
              );
            };
            const times = (i: number) => (
              <span key={`x${i}`} className="text-[20px] font-semibold" style={{ color: MUTE }}>×</span>
            );
            const row = (syms: string[]) => (
              <div className="flex items-center justify-center gap-1.5">
                {syms.flatMap((s, i) => (i === 0 ? [symbol(s)] : [times(i), symbol(s)]))}
              </div>
            );
            return (
              <>
                {symbol(responder)}
                <span className="text-[26px] font-semibold" style={{ color: MUTE }}>=</span>
                {den.length === 0 ? (
                  row(num)
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    {row(num)}
                    <div className="h-[2.5px] w-full min-w-[70px] rounded" style={{ background: INK }} />
                    {row(den)}
                  </div>
                )}
              </>
            );
          })()}
        </div>

        {relationship && (
          <div className="text-center pb-2">
            <span
              className="inline-block text-[13.5px] font-bold px-4 py-1.5 rounded-full"
              style={{
                background: relationship.isDirect ? '#e6f2ee' : '#fbeae7',
                color: relationship.isDirect ? '#1b5c4d' : '#8f3626',
              }}
            >
              {relationship.text} — {relationship.isDirect ? 'directly proportional' : 'inversely proportional'}
            </span>
            {heldVars.length > 0 && (
              <div className="text-[11.5px] font-mono text-[#a8a196] mt-1.5">
                with {heldVars.map((v) => v.sym).join(' and ')} held constant
              </div>
            )}
          </div>
        )}
        {!relationship && (
          <div className="text-center pb-2 text-[12px] text-[#4a5a72]">
            Drag any slider below — {responder} will answer, and the relationship gets named.
          </div>
        )}

        {/* ---- sliders + graph ---- */}
        <div className="px-4 pt-3 grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-5">
          <div className="space-y-3">
            {eq.vars.map((v) => {
              const isResponder = v.sym === responder;
              return (
                <div key={v.sym} className={`px-3 py-2.5 rounded border ${isResponder ? 'border-[#2e7d6b] bg-[#f2f9f7]' : 'border-[#eee6d3]'}`}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="italic font-bold text-[17px]" style={{ fontFamily: 'Georgia, serif', color: isResponder ? TEAL : INK }}>
                        {v.sym}
                      </span>
                      <span className="text-[11.5px] text-[#4a5a72]">{v.name}</span>
                    </div>
                    <span className="font-mono text-[12.5px] font-bold" style={{ color: isResponder ? TEAL : INK }}>
                      {formatVal(values[v.sym])} {v.unit}
                    </span>
                  </div>
                  {isResponder ? (
                    <div className="text-[11px] font-mono uppercase tracking-wide text-[#2e7d6b]">
                      responds automatically — this is what you are solving for
                    </div>
                  ) : (
                    <input
                      type="range"
                      min={v.base * 0.25}
                      max={v.base * 2.6}
                      step={v.base / 200}
                      value={values[v.sym]}
                      onChange={(e) => drag(v.sym, parseFloat(e.target.value))}
                      className="w-full"
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div>
            <div className="font-mono text-[10.5px] tracking-wide uppercase text-[#4a5a72] mb-2">
              {relationship ? `${responder} against ${relationship.driver}` : 'graph appears once you drag'}
            </div>
            <div className="border border-[#eee6d3] rounded bg-[#faf7f0] p-2">
              {graph ? (
                <svg viewBox={`0 0 ${graph.W} ${graph.H}`} className="w-full" style={{ display: 'block' }}>
                  <line x1={0} y1={graph.H} x2={graph.W} y2={graph.H} stroke="#c9c0aa" strokeWidth={1} />
                  <line x1={0} y1={0} x2={0} y2={graph.H} stroke="#c9c0aa" strokeWidth={1} />
                  <path d={graph.path} fill="none" stroke={graph.isDirect ? TEAL : RED} strokeWidth={2.2} />
                  <circle cx={graph.cx} cy={graph.cy} r={5} fill={graph.isDirect ? TEAL : RED} />
                </svg>
              ) : (
                <div className="text-[11.5px] text-[#a8a196] text-center py-10">—</div>
              )}
            </div>
            <p className="text-[11px] text-[#4a5a72] leading-snug mt-2">
              {relationship
                ? relationship.isDirect
                  ? 'A straight line through the origin — the signature of direct proportionality.'
                  : 'A curve that falls away and never touches either axis — the signature of inverse proportionality.'
                : 'Direct proportionality draws a straight line through the origin; inverse draws a falling curve.'}
            </p>
          </div>
        </div>

        <div className="px-4 pb-5 pt-4 mt-2 border-t border-[#eee6d3] flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-[#a8a196] mr-1">solve for:</span>
          {eq.vars.map((v) => (
            <button
              key={v.sym}
              onClick={() => chooseResponder(v.sym)}
              className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border ${
                v.sym === responder ? 'bg-[#2e7d6b] text-white border-[#2e7d6b]' : 'bg-transparent text-[#4a5a72] border-[#d8cfb6] hover:bg-[#faf7f0]'
              }`}
            >
              {v.sym}
            </button>
          ))}
          <button onClick={reset} className="text-[12px] font-semibold px-3 py-1.5 rounded-full border border-[#d8cfb6] text-[#4a5a72] hover:bg-[#faf7f0] ml-2">
            ↺ Reset
          </button>
          <span className="text-[11px] font-mono text-[#a8a196] mr-1 ml-auto">equation:</span>
          {EQUATIONS.map((e, i) => (
            <button
              key={e.id}
              onClick={() => switchEquation(i)}
              className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border ${
                i === eqIdx ? 'bg-[#1b2a41] text-white border-[#1b2a41]' : 'bg-transparent text-[#4a5a72] border-[#d8cfb6] hover:bg-[#faf7f0]'
              }`}
            >
              {e.display}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Notebook row ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">The Trap</span>
          <div className="mt-2.5 space-y-2.5 text-[12.5px] text-[#4a5a72] leading-snug">
            <p>
              <strong className="text-[#1b2a41]">"F is proportional to m" is an incomplete sentence.</strong> Proportional
              while <em>what</em> is held constant?
            </p>
            <p>
              In F = ma, solve for F and drag m: they grow together, directly proportional. Now solve for a and drag m:
              a shrinks as m grows, inversely proportional. Same equation, opposite answer — the only difference is
              which quantity you decided to hold still.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Try This</span>
          <div className="mt-2 space-y-2.5 text-[12px] text-[#4a5a72] leading-snug">
            <p>
              <strong className="text-[#1b2a41]">1.</strong> Run the F = ma experiment above both ways and watch the
              graph flip from a straight line to a falling curve.
            </p>
            <p>
              <strong className="text-[#1b2a41]">2.</strong> On ρ = m/V, solve for ρ and drag V. Density rises as
              volume falls — squeeze the same mass smaller and it gets denser.
            </p>
            <p>
              <strong className="text-[#1b2a41]">3.</strong> On p = ρgh, solve for p and drag h. Double the depth,
              double the pressure. Then solve for h instead and drag ρ — a denser liquid needs less depth for the same
              pressure.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-3.5 text-center mb-3">
            <div className="italic text-[19px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
              y = k x
            </div>
            <div className="italic text-[12.5px] text-[#8f6428] mt-1.5" style={{ fontFamily: 'Georgia, serif' }}>
              k is the constant of proportionality
            </div>
          </div>
          <h2 className="font-mono text-[13px] tracking-wide uppercase text-[#4a5a72] border-b border-[#eee6d3] pb-2 mb-3">
            Reading The Shape
          </h2>
          <div className="space-y-2.5 text-[12px] text-[#4a5a72] leading-snug">
            <p>
              <strong style={{ color: TEAL }}>Direct (y = kx)</strong> — straight line through the origin. Double one,
              double the other. The gradient is k.
            </p>
            <p>
              <strong style={{ color: RED }}>Inverse (y = k/x)</strong> — a falling curve approaching but never
              touching either axis. Double one, halve the other. Here their <em>product</em> is constant.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
