'use client';

import { useRef, useState } from 'react';

/**
 * Equation Rearranger — the operation forms directly inside the equation.
 *
 * Not a floating annotation: clicking a variable makes the tool build a
 * real, unsimplified intermediate form first (e.g. F = m×a dividing by m
 * becomes F/m = (m×a)/m, fractions and all, fading in on both sides at
 * once), then cancels the matching pair on the side that already had the
 * term, then settles into the simplified result. A second click chains
 * from what's on screen; Reset returns to the original equation.
 *
 * The algebra is a small general two-phase engine (not scripted answers)
 * verified against all 20 variable/equation combinations in this bank —
 * both the final-answer correctness AND, separately, that the new
 * "unsimplified intermediate, then cancel" construction reduces to
 * exactly the same verified final answer. One real bug was caught in
 * that second pass: a move that clears a variable from a denominator
 * needs the OPPOSITE injection (into the numerator, not the
 * denominator) from a move that clears an extra numerator factor —
 * both were previously tagged the same generic way.
 */

const INK = '#1b2a41';
const MUTE = '#4a5a72';
const BRASS = '#b8823d';
const RED = '#b34a3c';

// ---------- algebra engine ----------

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
type OpType = 'divide' | 'multiply' | 'addsub';
interface Move {
  kind: 'lift' | 'additive' | 'multiplicative';
  op: OpType;
  symbol: string; // e.g. "m" or "a×t"
  opLabel: string; // e.g. "÷ m", "× V", "− u"
  homeIsLeft: boolean;
  stateAfter: EqState;
}

function cloneSide(s: Side): Side {
  return { groups: s.groups.map((g) => ({ sign: g.sign, factors: [...g.factors] })), denom: [...s.denom] };
}

function isolateSteps(state: EqState, target: string): { moves: Move[]; finalIsLeft: boolean } {
  let L = cloneSide(state.left);
  let R = cloneSide(state.right);
  const moves: Move[] = [];

  const inDenom = (s: Side) => s.denom.includes(target);
  if (inDenom(L) || inDenom(R)) {
    const homeIsLeft = inDenom(L);
    const home = homeIsLeft ? L : R;
    const opp = homeIsLeft ? R : L;
    home.denom = home.denom.filter((d) => d !== target);
    opp.groups[0].factors.push(target);
    moves.push({ kind: 'lift', op: 'multiply', symbol: target, opLabel: `× ${target}`, homeIsLeft, stateAfter: { left: cloneSide(L), right: cloneSide(R) } });
  }

  let home: 'L' | 'R' = L.groups.some((g) => g.factors.includes(target)) ? 'L' : 'R';
  const homeSide = () => (home === 'L' ? L : R);
  const oppSide = () => (home === 'L' ? R : L);

  while (homeSide().groups.length > 1) {
    const hs = homeSide();
    const os = oppSide();
    const moveGroup = hs.groups.find((g) => !g.factors.includes(target))!;
    hs.groups = hs.groups.filter((g) => g !== moveGroup);
    os.groups.push({ sign: (moveGroup.sign * -1) as 1 | -1, factors: moveGroup.factors });
    const label = moveGroup.factors.join('×');
    moves.push({
      kind: 'additive',
      op: 'addsub',
      symbol: label,
      opLabel: `${moveGroup.sign > 0 ? '−' : '+'} ${label}`,
      homeIsLeft: home === 'L',
      stateAfter: { left: cloneSide(L), right: cloneSide(R) },
    });
  }

  while (homeSide().groups[0].factors.length > 1) {
    const hs = homeSide();
    const os = oppSide();
    const g = hs.groups[0];
    const factor = g.factors.find((f) => f !== target)!;
    g.factors = g.factors.filter((f) => f !== factor);
    os.denom.push(factor);
    moves.push({ kind: 'multiplicative', op: 'divide', symbol: factor, opLabel: `÷ ${factor}`, homeIsLeft: home === 'L', stateAfter: { left: cloneSide(L), right: cloneSide(R) } });
  }

  while (homeSide().denom.length > 0) {
    const hs = homeSide();
    const os = oppSide();
    const factor = hs.denom[0];
    hs.denom = hs.denom.filter((d) => d !== factor);
    os.groups[0].factors.push(factor);
    moves.push({ kind: 'multiplicative', op: 'multiply', symbol: factor, opLabel: `× ${factor}`, homeIsLeft: home === 'L', stateAfter: { left: cloneSide(L), right: cloneSide(R) } });
  }

  return { moves, finalIsLeft: home === 'L' };
}

/**
 * Builds the UNSIMPLIFIED intermediate form: the operation injected into
 * BOTH sides, nothing cancelled yet. Also returns the exact token keys
 * (see layout section) of the pair that's about to cancel on the home
 * side, so the renderer knows precisely what to strike through and fade.
 */
function buildIntermediate(move: Move, before: EqState): { mid: EqState; cancelKeys: string[] } {
  const homeBefore = cloneSide(move.homeIsLeft ? before.left : before.right);
  const oppBefore = cloneSide(move.homeIsLeft ? before.right : before.left);
  const homeSideTag = move.homeIsLeft ? 'L' : 'R';
  const oppSideTag = move.homeIsLeft ? 'R' : 'L';
  const cancelKeys: string[] = [];

  if (move.op === 'divide') {
    // dividing by move.symbol: it's already a numerator factor on the home
    // side — inject it as a NEW denominator entry on both sides.
    const homeNumGroupIdx = homeBefore.groups.findIndex((g) => g.factors.includes(move.symbol));
    cancelKeys.push(varKey(move.symbol, 'n', homeSideTag, homeNumGroupIdx));
    homeBefore.denom.push(move.symbol);
    cancelKeys.push(varKey(move.symbol, 'd', homeSideTag, homeBefore.denom.length - 1));
    oppBefore.denom.push(move.symbol);
  } else if (move.op === 'multiply') {
    // multiplying by move.symbol: it's already a denominator entry on the
    // home side — inject it as a NEW numerator factor on both sides.
    const homeDenomIdx = homeBefore.denom.indexOf(move.symbol);
    cancelKeys.push(varKey(move.symbol, 'd', homeSideTag, homeDenomIdx));
    homeBefore.groups[0].factors.push(move.symbol);
    cancelKeys.push(varKey(move.symbol, 'n', homeSideTag, 0));
    oppBefore.groups[0].factors.push(move.symbol);
  } else {
    // additive: the whole term (possibly multi-factor, e.g. "a×t") is
    // already its own summed group on the home side — inject a
    // sign-flipped copy of that SAME group on both sides.
    const factors = move.symbol.split('×');
    const origIdx = homeBefore.groups.findIndex((g) => g.factors.join('×') === move.symbol);
    const origSign = homeBefore.groups[origIdx].sign;
    factors.forEach((f) => cancelKeys.push(varKey(f, 'n', homeSideTag, origIdx)));
    homeBefore.groups.push({ sign: (origSign * -1) as 1 | -1, factors });
    const injectedIdx = homeBefore.groups.length - 1;
    factors.forEach((f) => cancelKeys.push(varKey(f, 'n', homeSideTag, injectedIdx)));
    oppBefore.groups.push({ sign: (origSign * -1) as 1 | -1, factors });
  }

  const mid = move.homeIsLeft ? { left: homeBefore, right: oppBefore } : { left: oppBefore, right: homeBefore };
  return { mid, cancelKeys };
}

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

function mirror(state: EqState): EqState {
  return { left: state.right, right: state.left };
}

// stable, unique key per (symbol, role, side, structural index) — necessary
// because during the unsimplified intermediate form, the SAME symbol can
// briefly appear twice on one side (once in its original role, once as the
// just-injected copy about to cancel with it).
function varKey(symbol: string, role: 'n' | 'd', side: 'L' | 'R', index: number): string {
  return `${symbol}:${role}:${side}:${index}`;
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
  isLeftSide: boolean;
}

function layoutSide(side: Side, blockLeftX: number, isLeftSide: boolean): { tokens: Token[]; width: number; centerX: number } {
  const sideTag: 'L' | 'R' = isLeftSide ? 'L' : 'R';
  // numerator: linearize groups, tracking group index for stable keys
  const numCells: { text: string; kind: 'var' | 'op'; key?: string }[] = [];
  side.groups.forEach((g, gi) => {
    if (gi > 0) numCells.push({ text: g.sign < 0 ? '−' : '+', kind: 'op' });
    else if (g.sign < 0) numCells.push({ text: '−', kind: 'op' });
    g.factors.forEach((f, fi) => {
      if (fi > 0) numCells.push({ text: '×', kind: 'op' });
      numCells.push({ text: f, kind: 'var', key: varKey(f, 'n', sideTag, gi) });
    });
  });
  const numWidth = numCells.reduce((w, c) => w + (c.kind === 'var' ? CELL_W : OP_W), 0);

  const denomCells: { text: string; kind: 'var' | 'op'; key?: string }[] = [];
  side.denom.forEach((f, di) => {
    if (di > 0) denomCells.push({ text: '×', kind: 'op' });
    denomCells.push({ text: f, kind: 'var', key: varKey(f, 'd', sideTag, di) });
  });
  const denomWidth = denomCells.reduce((w, c) => w + (c.kind === 'var' ? CELL_W : OP_W), 0);

  const hasFraction = side.denom.length > 0;
  const blockWidth = Math.max(numWidth, hasFraction ? denomWidth : 0, CELL_W);

  const tokens: Token[] = [];
  let cx = blockLeftX + (blockWidth - numWidth) / 2;
  const numY = hasFraction ? -ROW_H / 2 - BAR_GAP : 0;
  let opCount = 0;
  numCells.forEach((c) => {
    const w = c.kind === 'var' ? CELL_W : OP_W;
    const key = c.key ?? `op-${opCount++}-${sideTag}-num`;
    tokens.push({ key, text: c.text, x: cx + w / 2, y: numY, kind: c.kind, isLeftSide });
    cx += w;
  });

  if (hasFraction) {
    tokens.push({ key: `bar-${sideTag}`, text: '', x: blockLeftX + blockWidth / 2, y: 0, kind: 'bar', isLeftSide });
    let dx = blockLeftX + (blockWidth - denomWidth) / 2;
    const denomY = ROW_H / 2 + BAR_GAP;
    let dOpCount = 0;
    denomCells.forEach((c) => {
      const w = c.kind === 'var' ? CELL_W : OP_W;
      const key = c.key ?? `op-${dOpCount++}-${sideTag}-den`;
      tokens.push({ key, text: c.text, x: dx + w / 2, y: denomY, kind: c.kind, isLeftSide });
      dx += w;
    });
  }

  return { tokens, width: blockWidth, centerX: blockLeftX + blockWidth / 2 };
}

function layoutEquation(state: EqState): { tokens: Token[]; totalWidth: number; leftCenterX: number; rightCenterX: number } {
  const leftLayout = layoutSide(state.left, 0, true);
  const equalsW = 56;
  const rightLayout = layoutSide(state.right, leftLayout.width + equalsW, false);
  const totalWidth = leftLayout.width + equalsW + rightLayout.width;
  const equalsToken: Token = { key: 'equals', text: '=', x: leftLayout.width + equalsW / 2, y: 0, kind: 'equals', isLeftSide: false };
  return {
    tokens: [...leftLayout.tokens, equalsToken, ...rightLayout.tokens],
    totalWidth,
    leftCenterX: leftLayout.centerX,
    rightCenterX: rightLayout.centerX,
  };
}

// ---------- animation durations (slow, deliberate — Manim-paced) ----------
const INJECT_DWELL = 1400; // the fraction/term fades in on both sides, then a beat
const STRIKE_MS = 550;
const FADE_MS = 750;
const SETTLE_MS = 1150;
const GAP_MS = 550;
const FLIP_MS = 1500;

type SubStage = 'inject' | 'strike' | 'fade' | 'settle' | null;
type Phase = 'idle' | 'animating' | 'flipping' | 'done';

export function EquationRearrangerSimulator() {
  const [eqIdx, setEqIdx] = useState(0);
  const [target, setTarget] = useState<string | null>(null);
  const [baseState, setBaseState] = useState<EqState>(EQUATIONS[0].initial);
  const [displayState, setDisplayState] = useState<EqState>(EQUATIONS[0].initial);
  const [phase, setPhase] = useState<Phase>('idle');
  const [subStage, setSubStage] = useState<SubStage>(null);
  const [injectStarted, setInjectStarted] = useState(false); // false = injected tokens sit at opacity 0
  const [caption, setCaption] = useState('Click any variable to isolate it');
  const [sampleVals, setSampleVals] = useState<Record<string, number>>(EQUATIONS[0].sample);

  const movesRef = useRef<Move[]>([]);
  const finalIsLeftRef = useRef(true);
  const beforeForMoveRef = useRef<EqState>(EQUATIONS[0].initial);
  const cancelKeysRef = useRef<string[]>([]);
  const injectedKeysRef = useRef<Set<string>>(new Set());
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const eq = EQUATIONS[eqIdx];

  const clearTimers = () => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  };
  const after = (fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timersRef.current.push(id);
  };

  const finishAndMaybeFlip = (lastState: EqState) => {
    if (!finalIsLeftRef.current) {
      setCaption('Rearranging so the answer sits on the left…');
      setPhase('flipping');
      after(() => {
        const mirrored = mirror(lastState);
        setDisplayState(mirrored);
        after(() => {
          setPhase('done');
          setBaseState(mirrored);
        }, FLIP_MS);
      }, 60);
    } else {
      setPhase('done');
      setBaseState(lastState);
    }
  };

  const playMove = (idx: number) => {
    const move = movesRef.current[idx];
    const before = beforeForMoveRef.current;
    const { mid, cancelKeys } = buildIntermediate(move, before);
    cancelKeysRef.current = cancelKeys;

    const beforeKeys = new Set(layoutEquation(before).tokens.map((t) => t.key));
    const midKeys = layoutEquation(mid).tokens.map((t) => t.key);
    injectedKeysRef.current = new Set(midKeys.filter((k) => !beforeKeys.has(k)));

    setDisplayState(mid);
    setSubStage('inject');
    setInjectStarted(false);
    setCaption(`Apply ${move.opLabel} to both sides`);
    // double rAF: let the browser paint the opacity:0 frame before flipping,
    // so the fade-in transition actually plays instead of being skipped
    requestAnimationFrame(() => requestAnimationFrame(() => setInjectStarted(true)));

    after(() => {
      setSubStage('strike');
      setCaption(`${move.symbol} cancels here`);
      after(() => {
        setSubStage('fade');
        after(() => {
          setSubStage('settle');
          setDisplayState(move.stateAfter);
          beforeForMoveRef.current = move.stateAfter;
          setCaption('Settling into place…');
          after(() => {
            setSubStage(null);
            after(() => {
              if (idx + 1 < movesRef.current.length) playMove(idx + 1);
              else finishAndMaybeFlip(move.stateAfter);
            }, GAP_MS);
          }, SETTLE_MS);
        }, FADE_MS);
      }, STRIKE_MS);
    }, INJECT_DWELL);
  };

  const solveFor = (symbol: string) => {
    clearTimers();
    const { moves, finalIsLeft } = isolateSteps(baseState, symbol);
    movesRef.current = moves;
    finalIsLeftRef.current = finalIsLeft;
    beforeForMoveRef.current = baseState;
    setTarget(symbol);
    setDisplayState(baseState);
    setSubStage(null);
    if (moves.length > 0) {
      setPhase('animating');
      setCaption(`Isolating ${symbol}…`);
      after(() => playMove(0), 100);
    } else {
      setCaption(`${symbol} is already alone`);
      finishAndMaybeFlip(baseState);
    }
  };

  const reset = () => {
    clearTimers();
    setTarget(null);
    setBaseState(eq.initial);
    setDisplayState(eq.initial);
    setPhase('idle');
    setSubStage(null);
    setCaption('Click any variable to isolate it');
  };

  const switchEquation = (i: number) => {
    clearTimers();
    setEqIdx(i);
    setTarget(null);
    setBaseState(EQUATIONS[i].initial);
    setDisplayState(EQUATIONS[i].initial);
    setPhase('idle');
    setSubStage(null);
    setSampleVals(EQUATIONS[i].sample);
    setCaption('Click any variable to isolate it');
  };

  const layout = layoutEquation(displayState);
  const cancelSet = new Set(cancelKeysRef.current);
  const injectedSet = injectedKeysRef.current;
  const isInjectSubStage = subStage === 'inject';
  const isStrikeSubStage = subStage === 'strike';
  const isFadeSubStage = subStage === 'fade';

  const finalMove = movesRef.current.length > 0 ? movesRef.current[movesRef.current.length - 1] : null;
  const finalState = finalMove ? finalMove.stateAfter : baseState;
  const finalDisplaySide = finalIsLeftRef.current ? finalState.right : finalState.left;
  const rearrangedVal = target ? evalSide(finalDisplaySide, sampleVals) : 0;
  const checkVals = { ...sampleVals, [target || '']: rearrangedVal };
  const origLeftVal = target ? evalSide(eq.initial.left, checkVals) : 0;
  const origRightVal = target ? evalSide(eq.initial.right, checkVals) : 0;
  const balances = target ? Math.abs(origLeftVal - origRightVal) < 1e-6 : false;
  const otherKeys = eq.vars.map((v) => v.symbol).filter((s) => s !== target);

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

        <div className="flex justify-center items-center py-10 px-4" style={{ minHeight: 220 }}>
          <div className="relative transition-[width] duration-700 ease-in-out" style={{ width: layout.totalWidth, height: 130 }}>
            {layout.tokens.map((tok) => {
              if (tok.kind === 'bar') {
                return (
                  <div
                    key={tok.key}
                    className="absolute transition-all duration-[900ms] ease-in-out"
                    style={{ left: tok.x - 26, top: 55 + tok.y - 1, width: 52, height: 2, background: INK }}
                  />
                );
              }

              const isCancelling = cancelSet.has(tok.key);
              const isInjectedNow = isInjectSubStage && injectedSet.has(tok.key);
              let opacity = 1;
              if (isInjectedNow && !injectStarted) opacity = 0;
              if (isFadeSubStage && isCancelling) opacity = 0;

              const isTargetTok = tok.text === target;
              const clickable = tok.kind === 'var' && (phase === 'idle' || phase === 'done');

              return (
                <button
                  key={tok.key}
                  onClick={clickable ? () => solveFor(tok.text) : undefined}
                  disabled={!clickable}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-[900ms] ease-in-out select-none ${
                    clickable ? 'cursor-pointer hover:scale-110' : 'cursor-default'
                  }`}
                  style={{
                    left: tok.x,
                    top: 55 + tok.y,
                    opacity,
                    fontFamily: tok.kind === 'var' ? 'Georgia, serif' : 'inherit',
                    fontStyle: tok.kind === 'var' ? 'italic' : 'normal',
                    fontWeight: tok.kind === 'equals' ? 700 : tok.kind === 'var' ? 700 : 600,
                    fontSize: tok.kind === 'equals' ? 26 : tok.kind === 'var' ? 25 : 19,
                    color: isTargetTok ? RED : tok.kind === 'op' || tok.kind === 'equals' ? MUTE : INK,
                    background: isTargetTok ? 'rgba(179,74,60,0.12)' : 'transparent',
                    borderRadius: 8,
                    padding: tok.kind === 'var' ? '2px 6px' : '2px 2px',
                    border: 'none',
                  }}
                >
                  {tok.text}
                  {isStrikeSubStage && isCancelling && (
                    <div
                      className="absolute left-1/2 top-1/2 w-9 h-[2px] pointer-events-none"
                      style={{ background: RED, transform: 'translate(-50%,-50%) rotate(-10deg)' }}
                    />
                  )}
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
            {caption}
          </span>
        </div>

        <div className="px-4 pb-5 flex flex-wrap items-center gap-2 border-t border-[#eee6d3] pt-4">
          {target && (
            <button onClick={reset} className="text-[12px] font-semibold px-3 py-1.5 rounded-full border border-[#b8823d] text-[#8f6428] bg-[#faf7f0] hover:bg-[#f0e5cc]">
              ↺ Reset to original equation
            </button>
          )}
          {target && (
            <span className="text-[11px] text-[#a8a196] italic">
              — clicking another variable now continues from what's on screen
            </span>
          )}
          <span className="text-[11px] font-mono text-[#a8a196] mr-1 ml-auto">equation:</span>
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
              <strong className="text-[#1b2a41]">Whatever you do to one side, you must do to the other.</strong>{' '}
              Watch a real fraction (or a real new term) form on both sides at once — not a floating label, the
              operation becomes part of the equation itself.
            </p>
            <p>
              Where the term already existed, its two copies meet and cancel. Where it did not, it survives and
              becomes a permanent new part of that side.
            </p>
            <p>The variable you clicked stays red for the entire derivation.</p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Try This</span>
          <div className="mt-2 space-y-2.5 text-[12px] text-[#4a5a72] leading-snug">
            <p>
              <strong className="text-[#1b2a41]">1.</strong> Click a in F = ma. Watch F grow a genuine fraction bar
              (F/m) while m×a grows the same denominator and immediately simplifies back to a alone.
            </p>
            <p>
              <strong className="text-[#1b2a41]">2.</strong> Switch to ρ = m/V and click V. First V climbs directly
              into the numerator (multiplying with m, cancelling the existing denominator), then a second move clears
              ρ the same way.
            </p>
            <p>
              <strong className="text-[#1b2a41]">3.</strong> After a derivation finishes, click a different variable
              — it continues from what's on screen. Hit Reset to start over from the original equation.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          {target ? (
            <>
              <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-3.5 text-center mb-3">
                <div className="italic text-[19px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
                  {target} = {renderSideText(finalDisplaySide)}
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
