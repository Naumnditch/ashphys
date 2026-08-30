'use client';

import { useRef, useState } from 'react';

/**
 * Equation Rearranger — a full worked derivation, animated Manim-style.
 *
 * Click a variable and the tool plays the real algebra, one operation at
 * a time: the operation is applied to BOTH sides (labels fade in under
 * each side), the matching pair on the variable's own side visibly
 * cancels (strikethrough, then fades), and the surviving copy on the
 * other side settles into its new position in the equation. Once every
 * other variable has been cleared this way, the whole equation performs
 * one final slow slide so the isolated variable ends up on the left.
 *
 * The move sequence is not scripted per equation — it comes from a
 * small general algebra engine (isolateSteps, below) that emits ONE
 * move per term cleared. Verified against all 20 variable/equation
 * combinations in this bank (structural isolation check + numeric
 * balance check) before any animation code was written; two real bugs
 * were caught and fixed in that process (see PROJECT_STATUS.md).
 */

const INK = '#1b2a41';
const MUTE = '#4a5a72';
const BRASS = '#b8823d';
const RED = '#b34a3c';
const TEAL = '#2e7d6b';

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
interface Move {
  kind: 'lift' | 'additive' | 'multiplicative';
  symbol: string; // display label of what's being cleared, e.g. "m" or "a×t"
  opLabel: string; // e.g. "÷ m", "− u", "× V"
  homeIsLeft: boolean; // which side the target lives on JUST BEFORE this move
  stateAfter: EqState;
}

function cloneSide(s: Side): Side {
  return { groups: s.groups.map((g) => ({ sign: g.sign, factors: [...g.factors] })), denom: [...s.denom] };
}

/** Emits the full ordered list of individual moves needed to isolate `target`. */
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
    moves.push({ kind: 'lift', symbol: target, opLabel: `× ${target}`, homeIsLeft, stateAfter: { left: cloneSide(L), right: cloneSide(R) } });
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
    moves.push({ kind: 'multiplicative', symbol: factor, opLabel: `÷ ${factor}`, homeIsLeft: home === 'L', stateAfter: { left: cloneSide(L), right: cloneSide(R) } });
  }

  while (homeSide().denom.length > 0) {
    const hs = homeSide();
    const os = oppSide();
    const factor = hs.denom[0];
    hs.denom = hs.denom.filter((d) => d !== factor);
    os.groups[0].factors.push(factor);
    moves.push({ kind: 'multiplicative', symbol: factor, opLabel: `× ${factor}`, homeIsLeft: home === 'L', stateAfter: { left: cloneSide(L), right: cloneSide(R) } });
  }

  return { moves, finalIsLeft: home === 'L' };
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
const STRIP_Y = 95;

interface Token {
  key: string;
  text: string;
  x: number;
  y: number;
  kind: 'var' | 'op' | 'bar' | 'equals';
  isLeftSide: boolean;
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

function layoutSide(side: Side, blockLeftX: number, isLeftSide: boolean): { tokens: Token[]; width: number; centerX: number } {
  const numCells = linearize(side.groups);
  const numWidth = cellsWidth(numCells);
  const denomCells = side.denom
    .map((f, i) => (i > 0 ? [{ text: '×', kind: 'op' as const }, { text: f, kind: 'var' as const }] : [{ text: f, kind: 'var' as const }]))
    .flat();
  const denomWidth = cellsWidth(denomCells);
  const hasFraction = side.denom.length > 0;
  const blockWidth = Math.max(numWidth, hasFraction ? denomWidth : 0, CELL_W);

  const tokens: Token[] = [];
  let cx = blockLeftX + (blockWidth - numWidth) / 2;
  const numY = hasFraction ? -ROW_H / 2 - BAR_GAP : 0;
  let opCount = 0;
  numCells.forEach((c) => {
    const w = c.kind === 'var' ? CELL_W : OP_W;
    const key = c.kind === 'var' ? c.text : `op-${opCount++}-${isLeftSide ? 'L' : 'R'}-num`;
    tokens.push({ key, text: c.text, x: cx + w / 2, y: numY, kind: c.kind, isLeftSide });
    cx += w;
  });

  if (hasFraction) {
    tokens.push({ key: `bar-${isLeftSide ? 'L' : 'R'}`, text: '', x: blockLeftX + blockWidth / 2, y: 0, kind: 'bar', isLeftSide });
    let dx = blockLeftX + (blockWidth - denomWidth) / 2;
    const denomY = ROW_H / 2 + BAR_GAP;
    let dOpCount = 0;
    denomCells.forEach((c) => {
      const w = c.kind === 'var' ? CELL_W : OP_W;
      const key = c.kind === 'var' ? c.text : `op-${dOpCount++}-${isLeftSide ? 'L' : 'R'}-den`;
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

function mirror(state: EqState): EqState {
  return { left: state.right, right: state.left };
}

// ---------- animation durations (slow, deliberate — Manim-paced) ----------
const ANNOTATE_DWELL = 1400; // labels fade in, then a beat before cancelling begins
const STRIKE_MS = 550;
const FADE_MS = 750;
const SETTLE_MS = 1150;
const GAP_MS = 550;
const FLIP_MS = 1500;

type SubStage = 'annotate' | 'strike' | 'fade' | 'settle' | null;
type Phase = 'idle' | 'animating' | 'flipping' | 'done';

export function EquationRearrangerSimulator() {
  const [eqIdx, setEqIdx] = useState(0);
  const [target, setTarget] = useState<string | null>(null);
  const [baseState, setBaseState] = useState<EqState>(EQUATIONS[0].initial); // the equation new derivations start from — chains forward unless Reset
  const [displayState, setDisplayState] = useState<EqState>(EQUATIONS[0].initial);
  const [phase, setPhase] = useState<Phase>('idle');
  const [subStage, setSubStage] = useState<SubStage>(null);
  const [activeMove, setActiveMove] = useState<Move | null>(null);
  const [caption, setCaption] = useState('Click any variable to isolate it');
  const [sampleVals, setSampleVals] = useState<Record<string, number>>(EQUATIONS[0].sample);

  const movesRef = useRef<Move[]>([]);
  const finalIsLeftRef = useRef(true);
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
    setActiveMove(move);
    setSubStage('annotate');
    setCaption(`Apply ${move.opLabel} to both sides`);
    after(() => {
      setSubStage('strike');
      setCaption(`${move.symbol} cancels here`);
      after(() => {
        setSubStage('fade');
        after(() => {
          setSubStage('settle');
          setDisplayState(move.stateAfter);
          setCaption('Settling into place…');
          after(() => {
            setSubStage(null);
            setActiveMove(null);
            after(() => {
              if (idx + 1 < movesRef.current.length) playMove(idx + 1);
              else finishAndMaybeFlip(move.stateAfter);
            }, GAP_MS);
          }, SETTLE_MS);
        }, FADE_MS);
      }, STRIKE_MS);
    }, ANNOTATE_DWELL);
  };

  const solveFor = (symbol: string) => {
    clearTimers();
    const { moves, finalIsLeft } = isolateSteps(baseState, symbol);
    movesRef.current = moves;
    finalIsLeftRef.current = finalIsLeft;
    setTarget(symbol);
    setDisplayState(baseState);
    setSubStage(null);
    setActiveMove(null);
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
    setActiveMove(null);
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
    setActiveMove(null);
    setSampleVals(EQUATIONS[i].sample);
    setCaption('Click any variable to isolate it');
  };

  const layout = layoutEquation(displayState);
  const homeIsLeftForActive = activeMove?.homeIsLeft ?? true;
  const homeCenterX = homeIsLeftForActive ? layout.leftCenterX : layout.rightCenterX;
  const oppCenterX = homeIsLeftForActive ? layout.rightCenterX : layout.leftCenterX;

  const overlayActive = !!activeMove && (subStage === 'annotate' || subStage === 'strike' || subStage === 'fade' || subStage === 'settle');
  const mainTokens = layout.tokens.filter((t) => !(overlayActive && t.kind === 'var' && t.text === activeMove!.symbol));

  let overlayRender: { x: number; y: number; content: string; isPill: boolean; color: string; fontSize: number } | null = null;
  if (activeMove) {
    const isTargetSymbol = activeMove.symbol === target;
    const settledColor = isTargetSymbol ? RED : INK;
    const stripColor = isTargetSymbol ? RED : BRASS;
    if (subStage === 'settle') {
      const settledLayout = layoutEquation(activeMove.stateAfter);
      const tok = settledLayout.tokens.find((t) => t.text === activeMove.symbol && t.kind === 'var');
      overlayRender = { x: tok?.x ?? oppCenterX, y: tok?.y ?? 0, content: activeMove.symbol, isPill: false, color: settledColor, fontSize: 25 };
    } else if (subStage === 'annotate' || subStage === 'strike' || subStage === 'fade') {
      // shows the OPERATION being applied here, not the bare symbol yet — this side has
      // nothing to cancel it with, so it will survive and become real at 'settle'.
      overlayRender = { x: oppCenterX, y: STRIP_Y, content: activeMove.opLabel, isPill: true, color: stripColor, fontSize: 15 };
    }
  }

  const showStrike = subStage === 'strike';
  const homeFading = subStage === 'fade';

  const finalMove = movesRef.current.length > 0 ? movesRef.current[movesRef.current.length - 1] : null;
  const finalState = finalMove ? finalMove.stateAfter : baseState;
  const finalDisplaySide = finalIsLeftRef.current ? finalState.right : finalState.left; // the side that ISN'T just [target]
  const rearrangedVal = target ? evalSide(finalDisplaySide, sampleVals) : 0;
  const checkVals = { ...sampleVals, [target || '']: rearrangedVal };
  const origLeftVal = target ? evalSide(eq.initial.left, checkVals) : 0;
  const origRightVal = target ? evalSide(eq.initial.right, checkVals) : 0;
  const balances = target ? Math.abs(origLeftVal - origRightVal) < 1e-6 : false;
  const otherKeys = eq.vars.map((v) => v.symbol).filter((s) => s !== target);

  const homeAnnotationVisible = !!activeMove && (subStage === 'annotate' || subStage === 'strike' || subStage === 'fade');
  const homeAnnotationOpacity = subStage === 'fade' ? 0 : 1;
  // exact position of the token that's about to cancel (before it's filtered out of mainTokens)
  const cancellingTokenPos = activeMove ? layout.tokens.find((t) => t.text === activeMove.symbol && t.kind === 'var') : null;

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

        <div className="flex justify-center items-center py-6 px-4" style={{ minHeight: 300 }}>
          <div className="relative transition-[width] duration-700 ease-in-out" style={{ width: layout.totalWidth, height: 260 }}>
            {mainTokens.map((tok) => {
              if (tok.kind === 'bar') {
                return (
                  <div
                    key={tok.key}
                    className="absolute transition-all duration-[900ms] ease-in-out"
                    style={{ left: tok.x - 26, top: 75 + tok.y - 1, width: 52, height: 2, background: INK }}
                  />
                );
              }
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
                    top: 75 + tok.y,
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
                </button>
              );
            })}

            {/* the surviving copy of the applied operation on the side that has nothing to cancel
                it with: shown as an "op label" pill in the strip, then morphs — same element,
                position/style/content all transitioning together — into a real settled token. */}
            {overlayRender && (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-[900ms] ease-in-out select-none italic"
                style={{
                  left: overlayRender.x,
                  top: 75 + overlayRender.y,
                  opacity: 1,
                  color: overlayRender.color,
                  fontSize: overlayRender.fontSize,
                  fontWeight: overlayRender.isPill ? 700 : 700,
                  fontFamily: overlayRender.isPill ? 'ui-monospace, monospace' : 'Georgia, serif',
                  fontStyle: overlayRender.isPill ? 'normal' : 'italic',
                  background: overlayRender.isPill ? '#f6efdc' : 'rgba(179,74,60,0)',
                  border: overlayRender.isPill ? '1px solid #e6d9b8' : '1px solid rgba(0,0,0,0)',
                  borderRadius: overlayRender.isPill ? 6 : 8,
                  padding: overlayRender.isPill ? '3px 8px' : '2px 6px',
                }}
              >
                {overlayRender.content}
              </div>
            )}

            {/* home-side pre-existing token being cancelled: rendered at its EXACT real position
                (from the pre-move layout, before this symbol was filtered out of mainTokens).
                Present for the whole annotate→strike→fade run; gone once 'settle' begins. */}
            {activeMove && cancellingTokenPos && (subStage === 'annotate' || subStage === 'strike' || subStage === 'fade') && (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-[900ms] ease-in-out"
                style={{
                  left: cancellingTokenPos.x,
                  top: 75 + cancellingTokenPos.y,
                  opacity: homeFading ? 0 : 1,
                  fontFamily: 'Georgia, serif',
                  fontStyle: 'italic',
                  fontWeight: 700,
                  fontSize: 25,
                  color: activeMove.symbol === target ? RED : INK,
                }}
              >
                {activeMove.symbol}
                {showStrike && (
                  <div
                    className="absolute left-1/2 top-1/2 w-12 h-[2px] transition-opacity duration-300"
                    style={{ background: RED, transform: 'translate(-50%,-50%) rotate(-8deg)' }}
                  />
                )}
              </div>
            )}

            {/* the operation applied on the home side too — cancels together with the term above */}
            {homeAnnotationVisible && activeMove && (
              <div
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-[900ms] ease-in-out select-none"
                style={{
                  left: homeCenterX,
                  top: 75 + STRIP_Y,
                  opacity: homeAnnotationOpacity,
                  fontFamily: 'ui-monospace, monospace',
                  fontWeight: 700,
                  fontSize: 15,
                  color: BRASS,
                  background: '#f6efdc',
                  border: '1px solid #e6d9b8',
                  borderRadius: 6,
                  padding: '3px 8px',
                }}
              >
                {activeMove.opLabel}
                {showStrike && (
                  <div
                    className="absolute left-0 right-0 top-1/2 h-[2px] transition-opacity duration-300"
                    style={{ background: RED, transform: 'translateY(-50%) rotate(-6deg)' }}
                  />
                )}
              </div>
            )}
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
              <strong className="text-[#1b2a41]">Whatever you do to one side, you must do to the other.</strong> Watch
              the same operation appear under both sides at once — that is the rule, made visible.
            </p>
            <p>
              Where the term already existed, it cancels away. Where it did not, it survives and becomes a permanent
              new part of the equation.
            </p>
            <p>The variable you clicked stays red for the entire derivation — you can never lose track of it.</p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Try This</span>
          <div className="mt-2 space-y-2.5 text-[12px] text-[#4a5a72] leading-snug">
            <p>
              <strong className="text-[#1b2a41]">1.</strong> Click a in F = ma. One operation, one cancellation, one
              settle — the simplest possible derivation.
            </p>
            <p>
              <strong className="text-[#1b2a41]">2.</strong> Switch to p = ρgh and click ρ. Two separate cancellations
              happen in sequence — h clears first, then g — never both at once.
            </p>
            <p>
              <strong className="text-[#1b2a41]">3.</strong> Switch to ρ = m/V and click V. Watch it start inside a
              denominator, then lift out entirely as its own first move, before a second move finishes the job.
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
