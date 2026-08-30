'use client';

import { useState } from 'react';

/**
 * Equation Rearranger — a guided algebra trainer, not a physical
 * simulation. Rearranging formulas correctly under pressure is the
 * single most common silent blocker in IGCSE physics calculations,
 * and it deserves the same "verify it's actually true" treatment as
 * every physical sim on this platform: every rearrangement below is
 * numerically checked (original formula vs. rearranged formula, same
 * answer) in the "Verify with numbers" panel, using the same values
 * a student can edit live.
 *
 * Six real IGCSE formulas, each with 1–3 target variables. At each
 * step the student picks the correct next legal operation from a
 * pair of options; a wrong pick explains why it doesn't isolate the
 * target, a right pick advances the equation.
 */

type OpKind = 'divide' | 'multiply' | 'subtract';

interface Step {
  opLabel: string; // shown on the button, e.g. "÷ both sides by a"
  opKind: OpKind;
  resultEquation: string; // the equation state AFTER this step, as display text
}

interface Challenge {
  id: string;
  equationLabel: string; // e.g. "F = ma"
  equationName: string; // e.g. "Newton's second law"
  vars: { symbol: string; name: string; unit: string }[];
  target: string; // symbol being solved for
  startEquation: string;
  steps: Step[]; // the correct path, in order
  decoys: string[]; // one wrong-option label per step, same length as steps
  decoyExplain: string[]; // why each decoy is wrong, same length as steps
  finalEquation: string; // fully isolated form, e.g. "m = F / a"
  // numeric verification: given sample values for the OTHER variables,
  // compute the target both ways and confirm they agree
  sampleValues: Record<string, number>;
  computeOriginal: (vals: Record<string, number>) => number; // solves for target using the ORIGINAL relationship
  computeRearranged: (vals: Record<string, number>) => number; // solves for target using the derived final formula
}

const CHALLENGES: Challenge[] = [
  {
    id: 'fma-m',
    equationLabel: 'F = ma',
    equationName: "Newton's second law",
    vars: [{ symbol: 'F', name: 'force', unit: 'N' }, { symbol: 'm', name: 'mass', unit: 'kg' }, { symbol: 'a', name: 'acceleration', unit: 'm/s²' }],
    target: 'm',
    startEquation: 'F = m × a',
    steps: [{ opLabel: '÷ both sides by a', opKind: 'divide', resultEquation: 'F / a = m' }],
    decoys: ['÷ both sides by F'],
    decoyExplain: ["Dividing by F removes the thing you're trying to keep — you'd lose F entirely instead of isolating m."],
    finalEquation: 'm = F / a',
    sampleValues: { F: 10, a: 2 },
    computeOriginal: (v) => v.F / v.a,
    computeRearranged: (v) => v.F / v.a,
  },
  {
    id: 'fma-a',
    equationLabel: 'F = ma',
    equationName: "Newton's second law",
    vars: [{ symbol: 'F', name: 'force', unit: 'N' }, { symbol: 'm', name: 'mass', unit: 'kg' }, { symbol: 'a', name: 'acceleration', unit: 'm/s²' }],
    target: 'a',
    startEquation: 'F = m × a',
    steps: [{ opLabel: '÷ both sides by m', opKind: 'divide', resultEquation: 'F / m = a' }],
    decoys: ['× both sides by m'],
    decoyExplain: ['Multiplying by m makes the m on the right into m², moving further from isolating a, not closer.'],
    finalEquation: 'a = F / m',
    sampleValues: { F: 10, m: 2 },
    computeOriginal: (v) => v.F / v.m,
    computeRearranged: (v) => v.F / v.m,
  },
  {
    id: 'rho-m',
    equationLabel: 'ρ = m / V',
    equationName: 'Density',
    vars: [{ symbol: 'ρ', name: 'density', unit: 'kg/m³' }, { symbol: 'm', name: 'mass', unit: 'kg' }, { symbol: 'V', name: 'volume', unit: 'm³' }],
    target: 'm',
    startEquation: 'ρ = m / V',
    steps: [{ opLabel: '× both sides by V', opKind: 'multiply', resultEquation: 'ρ × V = m' }],
    decoys: ['÷ both sides by V'],
    decoyExplain: ['V is already dividing m — dividing by V again pushes it further into the denominator instead of clearing it.'],
    finalEquation: 'm = ρ × V',
    sampleValues: { rho: 8, V: 3 },
    computeOriginal: (v) => v.rho * v.V,
    computeRearranged: (v) => v.rho * v.V,
  },
  {
    id: 'rho-V',
    equationLabel: 'ρ = m / V',
    equationName: 'Density',
    vars: [{ symbol: 'ρ', name: 'density', unit: 'kg/m³' }, { symbol: 'm', name: 'mass', unit: 'kg' }, { symbol: 'V', name: 'volume', unit: 'm³' }],
    target: 'V',
    startEquation: 'ρ = m / V',
    steps: [
      { opLabel: '× both sides by V', opKind: 'multiply', resultEquation: 'ρ × V = m' },
      { opLabel: '÷ both sides by ρ', opKind: 'divide', resultEquation: 'V = m / ρ' },
    ],
    decoys: ['+ V to both sides', '÷ both sides by V'],
    decoyExplain: [
      'V sits in a denominator, not as an added term — you cannot "add it away". Clear a denominator by multiplying.',
      'Dividing by V here would put V back into a denominator on the other side too — that undoes the first step instead of finishing the job.',
    ],
    finalEquation: 'V = m / ρ',
    sampleValues: { rho: 8, m: 24 },
    computeOriginal: (v) => v.m / v.rho,
    computeRearranged: (v) => v.m / v.rho,
  },
  {
    id: 'vir-i',
    equationLabel: 'V = IR',
    equationName: "Ohm's law",
    vars: [{ symbol: 'V', name: 'voltage', unit: 'V' }, { symbol: 'I', name: 'current', unit: 'A' }, { symbol: 'R', name: 'resistance', unit: 'Ω' }],
    target: 'I',
    startEquation: 'V = I × R',
    steps: [{ opLabel: '÷ both sides by R', opKind: 'divide', resultEquation: 'V / R = I' }],
    decoys: ['÷ both sides by V'],
    decoyExplain: ["Dividing by V removes the term you need to keep on the left, and doesn't touch R at all."],
    finalEquation: 'I = V / R',
    sampleValues: { V: 12, R: 4 },
    computeOriginal: (v) => v.V / v.R,
    computeRearranged: (v) => v.V / v.R,
  },
  {
    id: 'vir-r',
    equationLabel: 'V = IR',
    equationName: "Ohm's law",
    vars: [{ symbol: 'V', name: 'voltage', unit: 'V' }, { symbol: 'I', name: 'current', unit: 'A' }, { symbol: 'R', name: 'resistance', unit: 'Ω' }],
    target: 'R',
    startEquation: 'V = I × R',
    steps: [{ opLabel: '÷ both sides by I', opKind: 'divide', resultEquation: 'V / I = R' }],
    decoys: ['× both sides by I'],
    decoyExplain: ['Multiplying by I turns the I on the right into I², which moves away from isolating R.'],
    finalEquation: 'R = V / I',
    sampleValues: { V: 12, I: 4 },
    computeOriginal: (v) => v.V / v.I,
    computeRearranged: (v) => v.V / v.I,
  },
  {
    id: 'pet-e',
    equationLabel: 'P = E / t',
    equationName: 'Power',
    vars: [{ symbol: 'P', name: 'power', unit: 'W' }, { symbol: 'E', name: 'energy', unit: 'J' }, { symbol: 't', name: 'time', unit: 's' }],
    target: 'E',
    startEquation: 'P = E / t',
    steps: [{ opLabel: '× both sides by t', opKind: 'multiply', resultEquation: 'P × t = E' }],
    decoys: ['÷ both sides by t'],
    decoyExplain: ['t is already dividing E — dividing by t again buries E deeper instead of freeing it.'],
    finalEquation: 'E = P × t',
    sampleValues: { P: 50, t: 5 },
    computeOriginal: (v) => v.P * v.t,
    computeRearranged: (v) => v.P * v.t,
  },
  {
    id: 'pet-t',
    equationLabel: 'P = E / t',
    equationName: 'Power',
    vars: [{ symbol: 'P', name: 'power', unit: 'W' }, { symbol: 'E', name: 'energy', unit: 'J' }, { symbol: 't', name: 'time', unit: 's' }],
    target: 't',
    startEquation: 'P = E / t',
    steps: [
      { opLabel: '× both sides by t', opKind: 'multiply', resultEquation: 'P × t = E' },
      { opLabel: '÷ both sides by P', opKind: 'divide', resultEquation: 't = E / P' },
    ],
    decoys: ['+ t to both sides', '÷ both sides by t'],
    decoyExplain: [
      't is in a denominator, not an added term — clear it by multiplying, not adding.',
      'Dividing by t now would put t back on the wrong side — the first step already cleared it once.',
    ],
    finalEquation: 't = E / P',
    sampleValues: { P: 50, E: 250 },
    computeOriginal: (v) => v.E / v.P,
    computeRearranged: (v) => v.E / v.P,
  },
  {
    id: 'pgh-rho',
    equationLabel: 'p = ρgh',
    equationName: 'Pressure in a liquid',
    vars: [{ symbol: 'p', name: 'pressure', unit: 'Pa' }, { symbol: 'ρ', name: 'density', unit: 'kg/m³' }, { symbol: 'g', name: 'gravitational field strength', unit: 'N/kg' }, { symbol: 'h', name: 'depth', unit: 'm' }],
    target: 'ρ',
    startEquation: 'p = ρ × g × h',
    steps: [
      { opLabel: '÷ both sides by h', opKind: 'divide', resultEquation: 'p / h = ρ × g' },
      { opLabel: '÷ both sides by g', opKind: 'divide', resultEquation: 'ρ = p / (g × h)' },
    ],
    decoys: ['÷ both sides by g only', '× both sides by g'],
    decoyExplain: [
      'That clears g but leaves h still multiplying ρ — both need to move before ρ is alone.',
      'Multiplying by g pushes further from isolating ρ, since g is already on the correct side to cancel by dividing.',
    ],
    finalEquation: 'ρ = p / (g × h)',
    sampleValues: { p: 19600, g: 9.8, h: 2 },
    computeOriginal: (v) => v.p / (v.g * v.h),
    computeRearranged: (v) => v.p / (v.g * v.h),
  },
  {
    id: 'pgh-h',
    equationLabel: 'p = ρgh',
    equationName: 'Pressure in a liquid',
    vars: [{ symbol: 'p', name: 'pressure', unit: 'Pa' }, { symbol: 'ρ', name: 'density', unit: 'kg/m³' }, { symbol: 'g', name: 'gravitational field strength', unit: 'N/kg' }, { symbol: 'h', name: 'depth', unit: 'm' }],
    target: 'h',
    startEquation: 'p = ρ × g × h',
    steps: [
      { opLabel: '÷ both sides by ρ', opKind: 'divide', resultEquation: 'p / ρ = g × h' },
      { opLabel: '÷ both sides by g', opKind: 'divide', resultEquation: 'h = p / (ρ × g)' },
    ],
    decoys: ['÷ both sides by g only', '× both sides by ρ'],
    decoyExplain: [
      'That clears g but leaves ρ still multiplying h — both need to move before h is alone.',
      'Multiplying by ρ moves away from isolating h — ρ is already on the correct side to clear by dividing.',
    ],
    finalEquation: 'h = p / (ρ × g)',
    sampleValues: { p: 19600, rho: 1000, g: 9.8 },
    computeOriginal: (v) => v.p / (v.rho * v.g),
    computeRearranged: (v) => v.p / (v.rho * v.g),
  },
  {
    id: 'vuat-a',
    equationLabel: 'v = u + at',
    equationName: 'SUVAT — velocity–time',
    vars: [{ symbol: 'v', name: 'final velocity', unit: 'm/s' }, { symbol: 'u', name: 'initial velocity', unit: 'm/s' }, { symbol: 'a', name: 'acceleration', unit: 'm/s²' }, { symbol: 't', name: 'time', unit: 's' }],
    target: 'a',
    startEquation: 'v = u + a × t',
    steps: [
      { opLabel: '− u from both sides', opKind: 'subtract', resultEquation: 'v − u = a × t' },
      { opLabel: '÷ both sides by t', opKind: 'divide', resultEquation: 'a = (v − u) / t' },
    ],
    decoys: ['÷ both sides by t (right away)', '× both sides by t'],
    decoyExplain: [
      'u is an added term, not a factor — dividing the whole equation by t before clearing u leaves an awkward u/t term instead of isolating a cleanly.',
      'Multiplying by t moves further from isolating a, since t already sits correctly to be cleared by dividing.',
    ],
    finalEquation: 'a = (v − u) / t',
    sampleValues: { v: 11, u: 5, t: 3 },
    computeOriginal: (v) => (v.v - v.u) / v.t,
    computeRearranged: (v) => (v.v - v.u) / v.t,
  },
  {
    id: 'vuat-u',
    equationLabel: 'v = u + at',
    equationName: 'SUVAT — velocity–time',
    vars: [{ symbol: 'v', name: 'final velocity', unit: 'm/s' }, { symbol: 'u', name: 'initial velocity', unit: 'm/s' }, { symbol: 'a', name: 'acceleration', unit: 'm/s²' }, { symbol: 't', name: 'time', unit: 's' }],
    target: 'u',
    startEquation: 'v = u + a × t',
    steps: [{ opLabel: '− at from both sides', opKind: 'subtract', resultEquation: 'v − a × t = u' }],
    decoys: ['÷ both sides by a'],
    decoyExplain: ["at is an added term, not a factor of the whole right-hand side — dividing by a alone doesn't clear it and also disturbs u."],
    finalEquation: 'u = v − a × t',
    sampleValues: { v: 11, a: 2, t: 3 },
    computeOriginal: (v) => v.v - v.a * v.t,
    computeRearranged: (v) => v.v - v.a * v.t,
  },
  {
    id: 'vuat-t',
    equationLabel: 'v = u + at',
    equationName: 'SUVAT — velocity–time',
    vars: [{ symbol: 'v', name: 'final velocity', unit: 'm/s' }, { symbol: 'u', name: 'initial velocity', unit: 'm/s' }, { symbol: 'a', name: 'acceleration', unit: 'm/s²' }, { symbol: 't', name: 'time', unit: 's' }],
    target: 't',
    startEquation: 'v = u + a × t',
    steps: [
      { opLabel: '− u from both sides', opKind: 'subtract', resultEquation: 'v − u = a × t' },
      { opLabel: '÷ both sides by a', opKind: 'divide', resultEquation: 't = (v − u) / a' },
    ],
    decoys: ['÷ both sides by a (right away)', '− a from both sides'],
    decoyExplain: [
      'u is added, not multiplied — it has to be cleared with subtraction first, before dividing by a makes sense.',
      'a is a factor of t, not a separately added term — you cannot subtract it away.',
    ],
    finalEquation: 't = (v − u) / a',
    sampleValues: { v: 11, u: 5, a: 2 },
    computeOriginal: (v) => (v.v - v.u) / v.a,
    computeRearranged: (v) => (v.v - v.u) / v.a,
  },
];

export function EquationRearrangerSimulator() {
  const [idx, setIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(0);
  const [display, setDisplay] = useState(CHALLENGES[0].startEquation);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [choiceOrder, setChoiceOrder] = useState<('correct' | 'decoy')[]>(['correct', 'decoy']);
  const [sampleVals, setSampleVals] = useState<Record<string, number>>(CHALLENGES[0].sampleValues);
  const [solvedCount, setSolvedCount] = useState(0);

  const challenge = CHALLENGES[idx];

  const loadChallenge = (i: number) => {
    const c = CHALLENGES[i];
    setIdx(i);
    setStepIdx(0);
    setDisplay(c.startEquation);
    setSolved(false);
    setFeedback(null);
    setSampleVals(c.sampleValues);
    // randomise left/right position of the correct choice each time
    setChoiceOrder(Math.random() < 0.5 ? ['correct', 'decoy'] : ['decoy', 'correct']);
  };

  const handlePick = (pick: 'correct' | 'decoy') => {
    if (pick === 'correct') {
      const step = challenge.steps[stepIdx];
      setDisplay(step.resultEquation);
      setFeedback({ ok: true, text: 'Correct — that isolates the target a step further.' });
      const nextStep = stepIdx + 1;
      if (nextStep >= challenge.steps.length) {
        setSolved(true);
        setSolvedCount((n) => n + 1);
      } else {
        setStepIdx(nextStep);
        setChoiceOrder(Math.random() < 0.5 ? ['correct', 'decoy'] : ['decoy', 'correct']);
      }
    } else {
      setFeedback({ ok: false, text: challenge.decoyExplain[stepIdx] });
    }
  };

  const originalResult = challenge.computeOriginal(sampleVals);
  const rearrangedResult = challenge.computeRearranged(sampleVals);
  const valuesAgree = Math.abs(originalResult - rearrangedResult) < 1e-6;

  const otherVarKeys = Object.keys(challenge.sampleValues);

  return (
    <div className="equation-rearranger flex flex-col gap-5">
      {/* ---- Trainer: full width ---- */}
      <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden">
        <div className="flex justify-between items-baseline px-4 pt-3">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            {challenge.equationName} · solving for {challenge.target}
          </span>
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            {idx + 1} / {CHALLENGES.length} · {solvedCount} solved this session
          </span>
        </div>

        <div className="px-6 py-10 text-center">
          <div className="italic text-[30px] text-[#1b2a41] mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            {display}
          </div>
          {!solved && (
            <div className="text-[12px] font-mono uppercase tracking-wide text-[#8f6428] mt-3">
              Step {stepIdx + 1} of {challenge.steps.length} — solve for {challenge.target}
            </div>
          )}
          {solved && (
            <div className="mt-3 inline-block text-[12.5px] font-bold px-3 py-1.5 rounded-full bg-[#e6f2ee] text-[#2e7d6b]">
              ✓ Isolated — {challenge.finalEquation}
            </div>
          )}
        </div>

        {!solved && (
          <div className="px-6 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {choiceOrder.map((kind, i) => (
              <button
                key={i}
                onClick={() => handlePick(kind)}
                className="text-[14px] font-semibold px-4 py-3 rounded-lg border border-[#d8cfb6] bg-[#faf7f0] hover:bg-[#f0e9d6] text-[#1b2a41] transition-colors"
              >
                {kind === 'correct' ? challenge.steps[stepIdx].opLabel : challenge.decoys[stepIdx]}
              </button>
            ))}
          </div>
        )}

        {feedback && (
          <div className={`mx-6 mb-6 px-4 py-3 rounded-lg text-[13px] leading-snug ${feedback.ok ? 'bg-[#e6f2ee] text-[#1b5c4d]' : 'bg-[#fbeae7] text-[#8f3626]'}`}>
            {feedback.ok ? '✓ ' : '✕ '}{feedback.text}
          </div>
        )}

        {solved && (
          <div className="px-6 pb-6">
            <div className="bg-[#faf7f0] border border-[#eee6d3] rounded-lg p-4">
              <div className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72] mb-3">
                Verify with numbers — proves the rearrangement didn't change the physics, only the form
              </div>
              <div className="flex flex-wrap gap-3 mb-3">
                {otherVarKeys.map((k) => (
                  <div key={k} className="flex items-center gap-1.5">
                    <span className="text-[12px] font-mono text-[#4a5a72]">{k} =</span>
                    <input
                      type="number"
                      value={sampleVals[k]}
                      onChange={(e) => setSampleVals({ ...sampleVals, [k]: parseFloat(e.target.value) || 0 })}
                      className="w-20 border border-gray-300 rounded px-2 py-1 text-[12.5px] font-mono"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-6 text-[13px]">
                <div>
                  <span className="text-[#4a5a72]">from the original equation: </span>
                  <span className="font-mono font-bold text-[#1b2a41]">{challenge.target} = {originalResult.toFixed(3)}</span>
                </div>
                <div>
                  <span className="text-[#4a5a72]">from your rearranged formula: </span>
                  <span className={`font-mono font-bold ${valuesAgree ? 'text-[#2e7d6b]' : 'text-[#b34a3c]'}`}>
                    {challenge.target} = {rearrangedResult.toFixed(3)}
                  </span>
                </div>
              </div>
              <div className={`mt-2 text-[12px] font-semibold ${valuesAgree ? 'text-[#2e7d6b]' : 'text-[#b34a3c]'}`}>
                {valuesAgree ? '✓ They match, for any values you try.' : 'These should match — try different numbers.'}
              </div>
            </div>
            <button
              onClick={() => loadChallenge((idx + 1) % CHALLENGES.length)}
              className="w-full mt-3 text-[13px] font-semibold px-4 py-2.5 rounded-lg bg-[#1b2a41] text-white hover:bg-[#243a5e]"
            >
              Next Equation →
            </button>
          </div>
        )}

        <div className="px-6 pb-5 flex flex-wrap gap-2 border-t border-[#eee6d3] pt-4">
          {CHALLENGES.map((c, i) => (
            <button
              key={c.id}
              onClick={() => loadChallenge(i)}
              className={`text-[11.5px] font-semibold px-2.5 py-1.5 rounded-full border ${
                i === idx ? 'bg-[#1b2a41] text-white border-[#1b2a41]' : 'bg-transparent text-[#4a5a72] border-[#d8cfb6] hover:bg-[#faf7f0]'
              }`}
            >
              {c.equationLabel} → {c.target}
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
              <strong className="text-[#1b2a41]">Whatever you do to one side, you must do to the other.</strong> An
              equation is a balance — it only stays true if both sides change together.
            </p>
            <p>
              Multiplication and division undo each other. Addition and subtraction undo each other. Pick the
              operation that cancels whatever is stuck to your target variable.
            </p>
            <p>
              A variable stuck in a denominator (like V in ρ = m/V) needs multiplying to lift it out — dividing again
              only buries it deeper.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Try This</span>
          <div className="mt-2 space-y-2.5 text-[12px] text-[#4a5a72] leading-snug">
            <p>
              <strong className="text-[#1b2a41]">1.</strong> Work through every equation in the strip below at least
              once — density and pressure both need two steps, which is where most marks are lost on real papers.
            </p>
            <p>
              <strong className="text-[#1b2a41]">2.</strong> When you get a decoy, read WHY it's wrong before trying
              again — the reasons repeat across different equations once you see the pattern.
            </p>
            <p>
              <strong className="text-[#1b2a41]">3.</strong> After solving, change the numbers in the verify panel.
              However you edit them, both routes to the answer keep agreeing — that's what "rearranging" actually
              means: the same fact, written a different way.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-3.5 text-center mb-3">
            <div className="italic text-[20px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
              {challenge.finalEquation}
            </div>
            <div className="italic text-[13px] text-[#8f6428] mt-1.5" style={{ fontFamily: 'Georgia, serif' }}>
              {challenge.equationName}
            </div>
          </div>
          <h2 className="font-mono text-[13px] tracking-wide uppercase text-[#4a5a72] border-b border-[#eee6d3] pb-2 mb-3">
            What Each Variable Means
          </h2>
          <div className="space-y-2.5">
            {challenge.vars.map((v) => (
              <div key={v.symbol} className="flex gap-3 items-start">
                <div
                  className="flex-shrink-0 w-9 h-9 rounded bg-[#faf7f0] border border-[#eee6d3] flex items-center justify-center text-[15px] font-bold italic text-[#8f6428]"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {v.symbol}
                </div>
                <p className="text-[12px] text-[#4a5a72] leading-snug">
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
