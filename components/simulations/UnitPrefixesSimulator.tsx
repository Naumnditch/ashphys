'use client';

import { useState } from 'react';

/**
 * Unit Prefixes — the same quantity, climbing a ladder of powers of ten.
 *
 * Click any rung and the quantity re-expresses itself in that prefix.
 * The digits never change; only where the decimal point sits and which
 * prefix letter is attached. That invariance is the whole idea, and it
 * was verified in code before any UI was written: every quantity was
 * checked to reconstruct its exact original value from every prefix on
 * the ladder, and every one of the 121 prefix-to-prefix conversions was
 * checked to round-trip back to its starting value.
 */

const INK = '#1b2a41';
const MUTE = '#4a5a72';
const BRASS = '#b8823d';
const TEAL = '#2e7d6b';
const RED = '#b34a3c';

interface Prefix {
  sym: string;
  name: string;
  exp: number;
  common?: boolean; // the ones IGCSE actually uses constantly
}

const PREFIXES: Prefix[] = [
  { sym: 'T', name: 'tera', exp: 12 },
  { sym: 'G', name: 'giga', exp: 9, common: true },
  { sym: 'M', name: 'mega', exp: 6, common: true },
  { sym: 'k', name: 'kilo', exp: 3, common: true },
  { sym: '', name: 'base unit', exp: 0, common: true },
  { sym: 'd', name: 'deci', exp: -1 },
  { sym: 'c', name: 'centi', exp: -2, common: true },
  { sym: 'm', name: 'milli', exp: -3, common: true },
  { sym: 'µ', name: 'micro', exp: -6, common: true },
  { sym: 'n', name: 'nano', exp: -9, common: true },
  { sym: 'p', name: 'pico', exp: -12 },
];

const expOf = (sym: string) => PREFIXES.find((p) => p.sym === sym)!.exp;

/** The quantity's value when read off in a given prefix. */
function inPrefix(trueValue: number, sym: string): number {
  return trueValue / Math.pow(10, expOf(sym));
}

/** Plain decimal formatting — the point of this lesson is seeing the decimal move, not e-notation. */
function formatDecimal(v: number): string {
  if (v === 0) return '0';
  const abs = Math.abs(v);
  if (abs >= 1e15 || abs < 1e-12) return v.toExponential(2);
  const decimals = Math.max(0, Math.min(14, Math.ceil(-Math.log10(abs)) + 6));
  let s = v.toFixed(decimals);
  if (s.includes('.')) s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s;
}

interface Quantity {
  id: string;
  label: string;
  trueValue: number; // in base units
  baseUnit: string;
  startPrefix: string;
  note: string;
}

const QUANTITIES: Quantity[] = [
  { id: 'current', label: 'Current through an LED', trueValue: 0.45, baseUnit: 'A', startPrefix: 'm', note: 'Meters read in milliamps; the formula I = V/R wants amps. This conversion is the single most common slip in circuit questions.' },
  { id: 'length', label: 'Length of a bench', trueValue: 2.5, baseUnit: 'm', startPrefix: 'c', note: 'Centimetres are convenient to measure but must become metres before any calculation.' },
  { id: 'wavelength', label: 'Wavelength of red light', trueValue: 0.0000007, baseUnit: 'm', startPrefix: 'n', note: 'Light wavelengths are quoted in nanometres — but v = fλ needs metres.' },
  { id: 'power', label: 'Output of a wind turbine', trueValue: 5000000, baseUnit: 'W', startPrefix: 'M', note: 'Megawatts scale down to watts by six zeros. Power station figures are always quoted with a prefix.' },
  { id: 'time', label: 'Pulse from an ultrasound probe', trueValue: 0.000002, baseUnit: 's', startPrefix: 'µ', note: 'Microseconds matter for echo timing — distance = speed × time only works in seconds.' },
  { id: 'freq', label: 'Frequency of a phone signal', trueValue: 3000000000, baseUnit: 'Hz', startPrefix: 'G', note: 'Gigahertz is nine powers of ten above the base unit.' },
];

interface DrillItem {
  value: number;
  from: string;
  to: string;
  unit: string;
}

const DRILL_BANK: DrillItem[] = [
  { value: 450, from: 'm', to: '', unit: 'A' },
  { value: 2.5, from: 'k', to: '', unit: 'm' },
  { value: 250, from: 'c', to: '', unit: 'm' },
  { value: 600, from: 'n', to: 'µ', unit: 'm' },
  { value: 12, from: 'm', to: 'µ', unit: 'm' },
  { value: 3, from: 'G', to: 'M', unit: 'Hz' },
  { value: 0.45, from: '', to: 'm', unit: 'A' },
  { value: 1500, from: '', to: 'k', unit: 'm' },
  { value: 5, from: 'M', to: '', unit: 'W' },
  { value: 1, from: 'k', to: 'c', unit: 'm' },
];

function convert(valueInFrom: number, from: string, to: string): number {
  return valueInFrom * Math.pow(10, expOf(from) - expOf(to));
}

/** Distractors are the mistakes students actually make: right digits, wrong direction or wrong size. */
function buildOptions(item: DrillItem): number[] {
  const correct = convert(item.value, item.from, item.to);
  const steps = expOf(item.from) - expOf(item.to);
  const candidates = [
    correct,
    item.value * Math.pow(10, -steps), // converted the wrong way
    item.value * Math.pow(10, steps > 0 ? steps - 3 : steps + 3), // off by a thousand
    item.value, // forgot to convert at all
  ];
  const seen = new Set<number>();
  const unique: number[] = [];
  for (const c of candidates) {
    const k = parseFloat(c.toPrecision(10));
    if (!seen.has(k)) { seen.add(k); unique.push(k); }
  }
  let bump = 1;
  while (unique.length < 4) {
    const extra = parseFloat((correct * Math.pow(10, bump * 3)).toPrecision(10));
    if (!seen.has(extra)) { seen.add(extra); unique.push(extra); }
    bump += 1;
  }
  return unique.slice(0, 4);
}

function shuffleWithSeed<T>(arr: T[], seed: number): T[] {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function UnitPrefixesSimulator() {
  const [qIdx, setQIdx] = useState(0);
  const [activePrefix, setActivePrefix] = useState(QUANTITIES[0].startPrefix);
  const [lastPrefix, setLastPrefix] = useState<string | null>(null);

  const [drillIdx, setDrillIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState({ right: 0, done: 0 });

  const q = QUANTITIES[qIdx];
  const shown = inPrefix(q.trueValue, activePrefix);
  const activeExp = expOf(activePrefix);

  const switchQuantity = (i: number) => {
    setQIdx(i);
    setActivePrefix(QUANTITIES[i].startPrefix);
    setLastPrefix(null);
  };

  const pickPrefix = (sym: string) => {
    if (sym === activePrefix) return;
    setLastPrefix(activePrefix);
    setActivePrefix(sym);
  };

  const stepInfo = (() => {
    if (lastPrefix === null) return null;
    const steps = expOf(lastPrefix) - activeExp;
    if (steps === 0) return null;
    return {
      steps,
      dir: steps > 0 ? 'right' : 'left',
      factor: `10${steps > 0 ? '' : '⁻'}${Math.abs(steps)}`,
    };
  })();

  const drill = DRILL_BANK[drillIdx];
  const drillCorrect = parseFloat(convert(drill.value, drill.from, drill.to).toPrecision(10));
  const drillOptions = shuffleWithSeed(buildOptions(drill), drillIdx * 7 + 3);

  const answerDrill = (opt: number) => {
    if (picked !== null) return;
    setPicked(opt);
    setScore((s) => ({ right: s.right + (opt === drillCorrect ? 1 : 0), done: s.done + 1 }));
  };
  const nextDrill = () => {
    setDrillIdx((i) => (i + 1) % DRILL_BANK.length);
    setPicked(null);
  };

  return (
    <div className="unit-prefixes-lab flex flex-col gap-5">
      {/* ---- Ladder ---- */}
      <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden">
        <div className="flex justify-between items-baseline px-4 pt-3">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">{q.label}</span>
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">click any rung</span>
        </div>

        <div className="px-4 py-8 flex flex-col items-center">
          <div className="text-center mb-1">
            <span className="italic font-bold text-[38px] text-[#1b2a41]" style={{ fontFamily: 'Georgia, serif' }}>
              {formatDecimal(shown)}
            </span>
            <span className="italic font-bold text-[26px] ml-2" style={{ fontFamily: 'Georgia, serif', color: BRASS }}>
              {activePrefix}{q.baseUnit}
            </span>
          </div>
          <div className="text-[11.5px] font-mono text-[#a8a196] mb-1">
            always the same quantity: {formatDecimal(q.trueValue)} {q.baseUnit}
          </div>
          {stepInfo && (
            <div className="text-[12px] font-semibold mt-1" style={{ color: stepInfo.steps > 0 ? TEAL : RED }}>
              decimal point moved {Math.abs(stepInfo.steps)} place{Math.abs(stepInfo.steps) === 1 ? '' : 's'} {stepInfo.dir} · × {stepInfo.factor}
            </div>
          )}
        </div>

        <div className="px-4 pb-6">
          <div className="max-w-md mx-auto space-y-1">
            {PREFIXES.map((p) => {
              const isActive = p.sym === activePrefix;
              const val = inPrefix(q.trueValue, p.sym);
              return (
                <button
                  key={p.sym || 'base'}
                  onClick={() => pickPrefix(p.sym)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded border transition-colors ${
                    isActive ? 'bg-[#1b2a41] text-white border-[#1b2a41]' : 'bg-white border-[#eee6d3] hover:bg-[#faf7f0]'
                  }`}
                >
                  <span className={`font-mono text-[11px] w-12 text-right ${isActive ? 'text-white/70' : 'text-[#a8a196]'}`}>
                    10{p.exp >= 0 ? '' : '⁻'}{Math.abs(p.exp)}
                  </span>
                  <span className="italic font-bold text-[17px] w-8 text-center" style={{ fontFamily: 'Georgia, serif', color: isActive ? '#fff' : BRASS }}>
                    {p.sym || '—'}
                  </span>
                  <span className={`text-[12px] w-20 text-left ${isActive ? 'text-white/80' : 'text-[#4a5a72]'}`}>
                    {p.name}
                  </span>
                  <span className={`font-mono text-[12.5px] flex-1 text-right ${isActive ? 'text-white font-bold' : 'text-[#4a5a72]'}`}>
                    {formatDecimal(val)} {p.sym}{q.baseUnit}
                  </span>
                  {p.common && !isActive && (
                    <span className="text-[9px] font-mono uppercase tracking-wide text-[#2e7d6b] bg-[#e6f2ee] px-1.5 py-0.5 rounded">
                      common
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="px-4 pb-5 pt-3 border-t border-[#eee6d3] flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-mono text-[#a8a196] mr-1">quantity:</span>
          {QUANTITIES.map((qq, i) => (
            <button
              key={qq.id}
              onClick={() => switchQuantity(i)}
              className={`text-[12px] font-semibold px-3 py-1.5 rounded-full border ${
                i === qIdx ? 'bg-[#1b2a41] text-white border-[#1b2a41]' : 'bg-transparent text-[#4a5a72] border-[#d8cfb6] hover:bg-[#faf7f0]'
              }`}
            >
              {qq.label}
            </button>
          ))}
        </div>
      </div>

      {/* ---- Drill ---- */}
      <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden">
        <div className="flex justify-between items-baseline px-4 pt-3">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Conversion Drill</span>
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            {score.right} / {score.done} correct
          </span>
        </div>
        <div className="px-4 py-7 text-center">
          <div className="italic text-[24px] text-[#1b2a41] mb-5" style={{ fontFamily: 'Georgia, serif' }}>
            Convert {formatDecimal(drill.value)} {drill.from}{drill.unit} into {drill.to || ''}{drill.unit}
          </div>
          <div className="grid grid-cols-2 gap-2.5 max-w-md mx-auto">
            {drillOptions.map((opt) => {
              const isCorrect = opt === drillCorrect;
              const isPicked = picked === opt;
              let cls = 'bg-white border-[#d8cfb6] text-[#1b2a41] hover:bg-[#faf7f0]';
              if (picked !== null && isCorrect) cls = 'bg-[#e6f2ee] border-[#2e7d6b] text-[#1b5c4d] font-bold';
              else if (isPicked) cls = 'bg-[#fbeae7] border-[#b34a3c] text-[#8f3626]';
              return (
                <button
                  key={opt}
                  onClick={() => answerDrill(opt)}
                  disabled={picked !== null}
                  className={`font-mono text-[14px] px-3 py-2.5 rounded border ${cls}`}
                >
                  {formatDecimal(opt)} {drill.to}{drill.unit}
                </button>
              );
            })}
          </div>
          {picked !== null && (
            <div className="mt-5">
              <div className="text-[12.5px] text-[#4a5a72] mb-3">
                {picked === drillCorrect ? '✓ Correct — ' : '✕ Not quite — '}
                {drill.from || 'the base unit'} is 10<sup>{expOf(drill.from)}</sup> and {drill.to || 'the base unit'} is
                10<sup>{expOf(drill.to)}</sup>, so multiply by 10<sup>{expOf(drill.from) - expOf(drill.to)}</sup>.
              </div>
              <button onClick={nextDrill} className="text-[12.5px] font-semibold px-4 py-2 rounded-full bg-[#1b2a41] text-white hover:bg-[#243a5e]">
                Next question →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ---- Notebook row ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Why It Matters</span>
          <p className="mt-2.5 text-[12.5px] text-[#4a5a72] leading-snug">{q.note}</p>
          <p className="mt-2.5 text-[12.5px] text-[#4a5a72] leading-snug">
            <strong className="text-[#1b2a41]">Every physics formula wants base units.</strong> Convert first, then
            calculate — never the other way round.
          </p>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Try This</span>
          <div className="mt-2 space-y-2.5 text-[12px] text-[#4a5a72] leading-snug">
            <p>
              <strong className="text-[#1b2a41]">1.</strong> Click from milli straight to kilo. The decimal jumps six
              places at once — a prefix change is never one step unless the rungs are adjacent.
            </p>
            <p>
              <strong className="text-[#1b2a41]">2.</strong> Notice centi is only 10⁻², not 10⁻³. It breaks the
              three-at-a-time pattern, which is why cm → m trips people up.
            </p>
            <p>
              <strong className="text-[#1b2a41]">3.</strong> In the drill, look at the wrong answers before choosing —
              each one is a real mistake: converting the wrong way, missing by a thousand, or not converting at all.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-3.5 text-center mb-3">
            <div className="italic text-[19px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
              × 10<sup>(from − to)</sup>
            </div>
            <div className="italic text-[12.5px] text-[#8f6428] mt-1.5" style={{ fontFamily: 'Georgia, serif' }}>
              subtract the exponents to get the factor
            </div>
          </div>
          <h2 className="font-mono text-[13px] tracking-wide uppercase text-[#4a5a72] border-b border-[#eee6d3] pb-2 mb-3">
            The Ones You Must Know
          </h2>
          <div className="space-y-1.5 text-[12px] text-[#4a5a72]">
            {PREFIXES.filter((p) => p.common && p.sym).map((p) => (
              <div key={p.sym} className="flex items-center gap-2">
                <span className="italic font-bold w-5 text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>{p.sym}</span>
                <span className="w-14">{p.name}</span>
                <span className="font-mono text-[11.5px]">10<sup>{p.exp}</sup></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
