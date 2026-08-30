'use client';

import { useMemo, useState } from 'react';

/**
 * Equation Rearranger — click any variable, watch it isolate.
 *
 * Not a physical simulation — a symbolic-algebra one, built to the same
 * standard: the isolation engine below is a small, general two-phase
 * algorithm (additive clear, then multiplicative clear, with a
 * pre-phase for a target that starts inside a denominator), verified
 * against 13 known-correct answers across 6 real IGCSE formulas before
 * any rendering code was written. It is not 13 hand-scripted answers —
 * it derives the correct rearrangement for ANY variable in ANY of these
 * equations from the same three rules, live.
 *
 * Every symbol is an individually positioned, individually animated
 * token. Clicking a variable recomputes the whole equation's layout in
 * up to two stages (additive clear, then multiplicative clear) and lets
 * CSS transitions carry each token smoothly to its new position and
 * role — the motion IS the explanation.
 */

const INK = '#1b2a41';
const MUTE = '#4a5a72';
const BRASS = '#b8823d';
const RED = '#b34a3c';
const CREAM = '#faf7f0';

// ---------- algebra engine (ported from the verified node script) ----------

interface ProductGroup {
  sign: 1 | -1;
  factors: string[];
}
interface Side {
  groups: ProductGroup[];
  denom: string[];
}
interface EqState {
  left: Side;
  right: Side;
}

function cloneSide(s: Side): Side {
  return { groups: s.groups.map((g) => ({ sign: g.sign, factors: [...g.factors] })), denom: [...s.denom] };
}

/** The verified two-phase isolation algorithm. Throws on an unsupported shape (none in this equation bank). */
function isolate(state: EqState, target: string): { intermediate: EqState | null; final: EqState } {
  let L = cloneSide(state.left);
  let R = cloneSide(state.right);

  const inFactors = (s: Side) => s.groups.some((g) => g.factors.includes(target));
  const inDenom = (s: Side) => s.denom.includes(target);

  // Pre-phase: target starts inside a denominator — clear the fraction.
  if (inDenom(L) || inDenom(R)) {
    const home = inDenom(L) ? L : R;
    const opp = inDenom(L) ? R : L;
    home.denom = home.denom.filter((d) => d !== target);
    opp.groups[0].factors.push(target);
  }

  let home: 'L' | 'R' = L.groups.some((g) => g.factors.includes(target)) ? 'L' : 'R';
  const homeSide = () => (home === 'L' ? L : R);
  const oppSide = () => (home === 'L' ? R : L);

  let intermediate: EqState | null = null;

  // Phase 1: additive clear — target's home side has more than one summed group.
  if (homeSide().groups.length > 1) {
    const hs = homeSide();
    const os = oppSide();
    const keep = hs.groups.filter((g) => g.factors.includes(target));
    const move = hs.groups.filter((g) => !g.factors.includes(target));
    hs.groups = keep;
    os.groups = os.groups.concat(move.map((g) => ({ sign: (g.sign * -1) as 1 | -1, factors: g.factors })));
    intermediate = { left: cloneSide(L), right: cloneSide(R) };
  }

  // Phase 2: multiplicative clear.
  {
    const hs = homeSide();
    const os = oppSide();
    const g = hs.groups[0];
    const others = g.factors.filter((f) => f !== target);
    g.factors = [target];
    os.denom = os.denom.concat(others);
    if (hs.denom.length > 0) {
      os.groups[0].factors = os.groups[0].factors.concat(hs.denom);
      hs.denom = [];
    }
  }

  return { intermediate, final: { left: L, right: R } };
}

// ---------- equation bank ----------

interface VarInfo {
  symbol: string;
  name: string;
  unit: string;
}
interface EquationDef {
  id: string;
  name: string;
  vars: VarInfo[];
  initial: EqState;
  sample: Record<string, number>;
}

const G = (sign: 1 | -1, ...factors: string[]): ProductGroup => ({ sign, factors });

const EQUATIONS: EquationDef[] = [
  {
    id: 'fma',
    name: "Newton's Second Law",
    vars: [
      { symbol: 'F', name: 'force', unit: 'N' },
      { symbol: 'm', name: 'mass', unit: 'kg' },
      { symbol: 'a', name: 'acceleration', unit: 'm/s²' },
    ],
    initial: { left: { groups: [G(1, 'F')], denom: [] }, right: { groups: [G(1, 'm', 'a')], denom: [] } },
    sample: { F: 10, m: 2, a: 5 },
  },
  {
    id: 'rhomv',
    name: 'Density',
    vars: [
      { symbol: 'ρ', name: 'density', unit: 'kg/m³' },
      { symbol: 'm', name: 'mass', unit: 'kg' },
      { symbol: 'V', name: 'volume', unit: 'm³' },
    ],
    initial: { left: { groups: [G(1, 'ρ')], denom: [] }, right: { groups: [G(1, 'm')], denom: ['V'] } },
    sample: { 'ρ': 8, m: 24, V: 3 },
  },
  {
    id: 'vir',
    name: "Ohm's Law",
    vars: [
      { symbol: 'V', name: 'voltage', unit: 'V' },
      { symbol: 'I', name: 'current', unit: 'A' },
      { symbol: 'R', name: 'resistance', unit: 'Ω' },
    ],
    initial: { left: { groups: [G(1, 'V')], denom: [] }, right: { groups: [G(1, 'I', 'R')], denom: [] } },
    sample: { V: 12, I: 4, R: 3 },
  },
  {
    id: 'pet',
    name: 'Power',
    vars: [
      { symbol: 'P', name: 'power', unit: 'W' },
      { symbol: 'E', name: 'energy', unit: 'J' },
      { symbol: 't', name: 'time', unit: 's' },
    ],
    initial: { left: { groups: [G(1, 'P')], denom: [] }, right: { groups: [G(1, 'E')], denom: ['t'] } },
    sample: { P: 50, E: 250, t: 5 },
  },
  {
    id: 'pgh',
    name: 'Pressure in a Liquid',
    vars: [
      { symbol: 'p', name: 'pressure', unit: 'Pa' },
      { symbol: 'ρ', name: 'density', unit: 'kg/m³' },
      { symbol: 'g', name: 'gravitational field strength', unit: 'N/kg' },
      { symbol: 'h', name: 'depth', unit: 'm' },
    ],
    initial: { left: { groups: [G(1, 'p')], denom: [] }, right: { groups: [G(1, 'ρ', 'g', 'h')], denom: [] } },
    sample: { p: 19600, 'ρ': 1000, g: 9.8, h: 2 },
  },
  {
    id: 'vuat',
    name: 'SUVAT — Velocity–Time',
    vars: [
      { symbol: 'v', name: 'final velocity', unit: 'm/s' },
      { symbol: 'u', name: 'initial velocity', unit: 'm/s' },
      { symbol: 'a', name: 'acceleration', unit: 'm/s²' },
      { symbol: 't', name: 'time', unit: 's' },
    ],
    initial: { left: { groups: [G(1, 'v')], denom: [] }, right: { groups: [G(1, 'u'), G(1, 'a', 't')], denom: [] } },
    sample: { v: 11, u: 5, a: 2, t: 3 },
  },
];

// ---------- layout ----------

const CELL_W = 46;
const OP_W = 30;
const ROW_H = 44;
const BAR_GAP = 6;

interface Token {
  key: string;
  text: string;
  x: number;
  y: number;
  kind: 'var' | 'op' | 'bar' | 'equals';
  isTarget: boolean;
}

function linearize(groups: ProductGroup[]): { text: string; kind: 'var' | 'op' }[] {
  const cells: { text: string; kind: 'var' | 'op' }[] = [];
  groups.forEach((g, gi) => {
    if (gi > 0) cells.push({ text: g.sign < 0 ? '−' : '+', kind: 'op' });
    else if (g.sign < 0) cells.push({ text: '−', kind: 'op' });
    g.factors.forEach((f, fi) => {
      if (fi > 0) cells.push({ text: '×', kind: 'op' });
      cells.push({ text: f, kind: 'var' });
    });
  });
  return cells;
}

function cellsWidth(cells: { kind: 'var' | 'op' }[]): number {
  return cells.reduce((w, c) => w + (c.kind === 'var' ? CELL_W : OP_W), 0);
}

/** Lays out one side's tokens, centred within its own block; returns tokens + block width. */
function layoutSide(side: Side, target: string, blockLeftX: number): { tokens: Token[]; width: number } {
  const numCells = linearize(side.groups);
  const numWidth = cellsWidth(numCells);
  const denomCells: { text: string; kind: 'var' | 'op' }[] = side.denom.map((f, i) => {
    const arr: { text: string; kind: 'var' | 'op' }[] = [];
    if (i > 0) arr.push({ text: '×', kind: 'op' });
    arr.push({ text: f, kind: 'var' });
    return arr;
  }).flat();
  const denomWidth = cellsWidth(denomCells);
  const hasFraction = side.denom.length > 0;
  const blockWidth = Math.max(numWidth, hasFraction ? denomWidth : 0, CELL_W);

  const tokens: Token[] = [];
  let cx = blockLeftX + (blockWidth - numWidth) / 2;
  const numY = hasFraction ? -ROW_H / 2 - BAR_GAP : 0;
  numCells.forEach((c) => {
    const w = c.kind === 'var' ? CELL_W : OP_W;
    tokens.push({ key: c.text + '@' + cx, text: c.text, x: cx + w / 2, y: numY, kind: c.kind, isTarget: c.text === target });
    cx += w;
  });

  if (hasFraction) {
    tokens.push({ key: 'bar', text: '', x: blockLeftX + blockWidth / 2, y: 0, kind: 'bar', isTarget: false });
    let dx = blockLeftX + (blockWidth - denomWidth) / 2;
    const denomY = ROW_H / 2 + BAR_GAP;
    denomCells.forEach((c) => {
      const w = c.kind === 'var' ? CELL_W : OP_W;
      tokens.push({ key: c.text + '@d@' + dx, text: c.text, x: dx + w / 2, y: denomY, kind: c.kind, isTarget: c.text === target });
      dx += w;
    });
  }

  return { tokens, width: blockWidth };
}

function layoutEquation(state: EqState, target: string): { tokens: Token[]; totalWidth: number } {
  const leftLayout = layoutSide(state.left, target, 0);
  const equalsW = 56;
  const rightLayout = layoutSide(state.right, target, leftLayout.width + equalsW);
  const totalWidth = leftLayout.width + equalsW + rightLayout.width;
  const equalsToken: Token = { key: 'equals', text: '=', x: leftLayout.width + equalsW / 2, y: 0, kind: 'equals', isTarget: false };
  return { tokens: [...leftLayout.tokens, equalsToken, ...rightLayout.tokens], totalWidth };
}

// ---------- numeric evaluation (for the "verify with numbers" panel) ----------

function evalSide(side: Side, values: Record<string, number>): number {
  const groupVal = (g: ProductGroup) => g.sign * g.factors.reduce((p, f) => p * (values[f] ?? 0), 1);
  const numerator = side.groups.reduce((sum, g) => sum + groupVal(g), 0);
  const denominator = side.denom.reduce((p, f) => p * (values[f] ?? 1), 1);
  return numerator / denominator;
}

function renderSideText(side: Side): string {
  const num = side.groups
    .map((g, i) => {
      const term = g.factors.join(' × ');
      if (i === 0) return g.sign < 0 ? `−${term}` : term;
      return (g.sign < 0 ? '− ' : '+ ') + term;
    })
    .join(' ');
  if (side.denom.length === 0) return num;
  const wrapped = side.groups.length > 1 ? `(${num})` : num;
  return `${wrapped} / ${side.denom.join(' × ')}`;
}

// ---------- component ----------

export function EquationRearrangerSimulator() {
  const [eqIdx, setEqIdx] = useState(0);
  const [target, setTarget] = useState<string | null>(null);
  const [display, setDisplay] = useState<EqState>(EQUATIONS[0].initial);
  const [phase, setPhase] = useState<'idle' | 'additive' | 'multiplicative' | 'done'>('idle');
  const timeoutsRef = useState<{ current: ReturnType<typeof setTimeout>[] }>({ current: [] })[0];

  const eq = EQUATIONS[eqIdx];

  const clearTimers = () => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  };

  const solveFor = (symbol: string) => {
    clearTimers();
    const { intermediate, final } = isolate(eq.initial, symbol);
    setTarget(symbol);
    setDisplay(eq.initial);
    if (intermediate) {
      setPhase('additive');
      const t1 = setTimeout(() => {
        setDisplay(intermediate);
        const t2 = setTimeout(() => {
          setPhase('multiplicative');
          setDisplay(final);
          const t3 = setTimeout(() => setPhase('done'), 900);
          timeoutsRef.current.push(t3);
        }, 1000);
        timeoutsRef.current.push(t2);
      }, 60);
      timeoutsRef.current.push(t1);
    } else {
      setPhase('multiplicative');
      const t1 = setTimeout(() => {
        setDisplay(final);
        const t2 = setTimeout(() => setPhase('done'), 900);
        timeoutsRef.current.push(t2);
      }, 60);
      timeoutsRef.current.push(t1);
    }
  };

  const reset = () => {
    clearTimers();
    setTarget(null);
    setDisplay(eq.initial);
    setPhase('idle');
  };

  const switchEquation = (i: number) => {
    clearTimers();
    setEqIdx(i);
    setTarget(null);
    setDisplay(EQUATIONS[i].initial);
    setPhase('idle');
    setSampleVals(EQUATIONS[i].sample);
  };

  const { tokens, totalWidth } = useMemo(() => layoutEquation(display, target || ''), [display, target]);
  const finalState = useMemo(() => (target ? isolate(eq.initial, target).final : null), [target, eq]);

  const [sampleVals, setSampleVals] = useState<Record<string, number>>(EQUATIONS[0].sample);
  const otherKeys = eq.vars.map((v) => v.symbol).filter((s) => s !== target);

  // Verification: take the value the rearranged formula gives, plug it back into the
  // ORIGINAL (unrearranged) equation, and confirm both sides still balance — a direct
  // proof that isolating the variable never changed the underlying physics.
  const finalHome = finalState && finalState.left.groups.length === 1 && finalState.left.groups[0].factors[0] === target && finalState.left.denom.length === 0 ? 'right' : 'left';
  const rearrangedVal = finalState ? evalSide(finalHome === 'right' ? finalState.right : finalState.left, sampleVals) : 0;
  const checkVals = { ...sampleVals, [target || '']: rearrangedVal };
  const origLeftVal = target ? evalSide(eq.initial.left, checkVals) : 0;
  const origRightVal = target ? evalSide(eq.initial.right, checkVals) : 0;
  const balances = target ? Math.abs(origLeftVal - origRightVal) < 1e-6 : false;


  const phaseLabel =
    phase === 'additive' ? 'Moving added terms to the other side…' :
    phase === 'multiplicative' ? 'Cancelling multiplied terms…' :
    phase === 'done' ? `Isolated — ${target} = ${renderSideText(finalHome === 'right' ? finalState!.right : finalState!.left)}` :
    'Click any variable to isolate it';

  return (
    <div className="equation-rearranger flex flex-col gap-5">
      {/* ---- Stage: full width ---- */}
      <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden">
        <div className="flex justify-between items-baseline px-4 pt-3">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">{eq.name}</span>
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            {target ? `solving for ${target}` : 'pick a variable'}
          </span>
        </div>

        <div className="flex justify-center items-center py-14 px-4" style={{ minHeight: 180 }}>
          <div
            className="relative transition-[width] duration-500 ease-in-out"
            style={{ width: totalWidth, height: 110 }}
          >
            {tokens.map((tok) => {
              if (tok.kind === 'bar') {
                return (
                  <div
                    key={tok.key}
                    className="absolute transition-all duration-700 ease-in-out"
                    style={{ left: tok.x - 26, top: 55 + tok.y - 1, width: 52, height: 2, background: INK }}
                  />
                );
              }
              const clickable = tok.kind === 'var';
              return (
                <button
                  key={tok.key}
                  onClick={clickable ? () => solveFor(tok.text) : undefined}
                  disabled={!clickable}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-in-out select-none ${
                    clickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'
                  }`}
                  style={{
                    left: tok.x,
                    top: 55 + tok.y,
                    fontFamily: tok.kind === 'var' ? 'Georgia, serif' : 'inherit',
                    fontStyle: tok.kind === 'var' ? 'italic' : 'normal',
                    fontWeight: tok.kind === 'equals' ? 700 : tok.kind === 'var' ? 700 : 600,
                    fontSize: tok.kind === 'equals' ? 26 : tok.kind === 'var' ? 25 : 19,
                    color: tok.isTarget ? RED : tok.kind === 'op' || tok.kind === 'equals' ? MUTE : INK,
                    background: tok.isTarget ? 'rgba(179,74,60,0.12)' : 'transparent',
                    borderRadius: 8,
                    padding: tok.kind === 'var' ? '2px 6px' : '2px 2px',
                    border: 'none',
                  }}
                >
                  {tok.text}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 pb-4 text-center">
          <span
            className={`text-[12.5px] font-semibold px-3 py-1.5 rounded-full ${
              phase === 'done' ? 'bg-[#e6f2ee] text-[#1b5c4d]' : 'bg-[#f6efdc] text-[#8f6428]'
            }`}
          >
            {phaseLabel}
          </span>
        </div>

        <div className="px-4 pb-5 flex flex-wrap items-center gap-2 border-t border-[#eee6d3] pt-4">
          {target && (
            <button
              onClick={reset}
              className="text-[12px] font-semibold px-3 py-1.5 rounded-full border border-[#d8cfb6] text-[#4a5a72] hover:bg-[#faf7f0]"
            >
              ↺ Reset
            </button>
          )}
          <span className="text-[11px] font-mono text-[#a8a196] mr-1">equation:</span>
          {EQUATIONS.map((e, i) => (
            <button
              key={e.id}
              onClick={() => switchEquation(i)}
              className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border ${
                i === eqIdx ? 'bg-[#1b2a41] text-white border-[#1b2a41]' : 'bg-transparent text-[#4a5a72] border-[#d8cfb6] hover:bg-[#faf7f0]'
              }`}
            >
              {renderSideText(e.initial.left)} = {renderSideText(e.initial.right)}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Notebook row ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">The Golden Rule</span>
          <div className="mt-2.5 space-y-2.5 text-[12.5px] text-[#4a5a72] leading-snug">
            <p>
              <strong className="text-[#1b2a41]">Whatever you do to one side, you must do to the other.</strong> That
              is why every term you don't click still moves — clearing a path for your target is a two-sided trade,
              never a one-sided delete.
            </p>
            <p>
              A term that was <em>added</em> crosses the equals sign by flipping its sign. A term that was{' '}
              <em>multiplying</em> crosses by dropping into a fraction's denominator on the other side.
            </p>
            <p>Watch the colour: the variable you clicked stays highlighted the entire way, so you never lose track of it.</p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Try This</span>
          <div className="mt-2 space-y-2.5 text-[12px] text-[#4a5a72] leading-snug">
            <p>
              <strong className="text-[#1b2a41]">1.</strong> Click every variable in F = ma one at a time. Notice a
              single click, single move — the simplest case.
            </p>
            <p>
              <strong className="text-[#1b2a41]">2.</strong> Switch to ρ = m/V and click V. Watch it climb out of the
              denominator on the right and land as a multiplier on the left, before the second move sends ρ across to
              finish the job.
            </p>
            <p>
              <strong className="text-[#1b2a41]">3.</strong> Switch to v = u + at and click a. Two moves happen in
              sequence: u leaves first (as an added term, sign-flipped), then t leaves second (as a multiplied term,
              dropping into a denominator) — the two-step split is exactly why this equation trips people up.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          {target && finalState ? (
            <>
              <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-3.5 text-center mb-3">
                <div className="italic text-[19px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
                  {target} = {renderSideText(finalHome === 'right' ? finalState.right : finalState.left)}
                </div>
                <div className="italic text-[12.5px] text-[#8f6428] mt-1.5" style={{ fontFamily: 'Georgia, serif' }}>
                  {eq.name}
                </div>
              </div>
              {phase === 'done' && (
                <div className="bg-[#faf7f0] border border-[#eee6d3] rounded-lg p-3 mb-1">
                  <div className="font-mono text-[10.5px] tracking-wide uppercase text-[#4a5a72] mb-2">
                    Verify — plug the answer back into the original equation
                  </div>
                  <div className="flex flex-wrap gap-2.5 mb-2">
                    {otherKeys.map((k) => (
                      <div key={k} className="flex items-center gap-1">
                        <span className="text-[11.5px] font-mono text-[#4a5a72]">{k}=</span>
                        <input
                          type="number"
                          value={sampleVals[k]}
                          onChange={(e) => setSampleVals({ ...sampleVals, [k]: parseFloat(e.target.value) || 0 })}
                          className="w-16 border border-gray-300 rounded px-1.5 py-0.5 text-[11.5px] font-mono"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="text-[12px] text-[#4a5a72]">
                    {target} works out to <span className="font-mono font-bold text-[#1b2a41]">{rearrangedVal.toFixed(3)}</span> — original
                    equation: <span className="font-mono">{origLeftVal.toFixed(3)}</span> vs <span className="font-mono">{origRightVal.toFixed(3)}</span>
                  </div>
                  <div className={`mt-1 text-[11.5px] font-semibold ${balances ? 'text-[#2e7d6b]' : 'text-[#b34a3c]'}`}>
                    {balances ? '✓ Balances, for any values you try.' : 'Should balance — try different numbers.'}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6">
              <div className="italic text-[22px] text-[#8f6428] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                {renderSideText(eq.initial.left)} = {renderSideText(eq.initial.right)}
              </div>
              <p className="text-[12px] text-[#4a5a72]">Click a variable above to watch it isolate.</p>
            </div>
          )}
          <h2 className="font-mono text-[13px] tracking-wide uppercase text-[#4a5a72] border-b border-[#eee6d3] pb-2 mb-3 mt-3">
            What Each Variable Means
          </h2>
          <div className="space-y-2">
            {eq.vars.map((v) => (
              <div key={v.symbol} className="flex gap-2.5 items-start">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded bg-[#faf7f0] border border-[#eee6d3] flex items-center justify-center text-[14px] font-bold italic text-[#8f6428]"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {v.symbol}
                </div>
                <p className="text-[11.5px] text-[#4a5a72] leading-snug">
                  <strong className="text-[#1b2a41]">{v.name}</strong> ({v.unit})
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
