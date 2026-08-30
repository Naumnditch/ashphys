'use client';

import { useState } from 'react';

/**
 * Standard Form & Significant Figures — move the decimal point yourself.
 *
 * The deep reason standard form works is that moving the decimal point
 * and adjusting the power of 10 leaves the VALUE unchanged — this tool
 * makes that conservation visible rather than asserted. Step the point
 * left or right through a real physics quantity's digits and watch the
 * mantissa and exponent update together, live, with the total value
 * pinned constant the whole time (verified in code before any UI was
 * built: every marker position reconstructs the exact original value).
 *
 * A second panel rounds the same digits to N significant figures,
 * showing exactly which digits survive and whether the boundary digit
 * rounds up — verified against known rounding edge cases (e.g. 1250 to
 * 2 s.f. → 1300) before shipping.
 */

const INK = '#1b2a41';
const MUTE = '#4a5a72';
const BRASS = '#b8823d';
const TEAL = '#2e7d6b';
const RED = '#b34a3c';

interface Quantity {
  id: string;
  label: string;
  sigDigits: string; // all meaningful digits, no point, e.g. "3844"
  trueExponent: number; // the correct standard-form exponent (mantissa read at pos=1)
  unit: string;
  startPos: number; // deliberately non-standard-form starting marker position
}

const QUANTITIES: Quantity[] = [
  { id: 'moon', label: 'Distance from Earth to the Moon', sigDigits: '3844', trueExponent: 8, unit: 'm', startPos: 4 },
  { id: 'light', label: 'Speed of light in a vacuum', sigDigits: '3', trueExponent: 8, unit: 'm/s', startPos: 1 },
  { id: 'sun', label: 'Distance from Earth to the Sun', sigDigits: '1496', trueExponent: 11, unit: 'm', startPos: 4 },
  { id: 'earth', label: "Earth's radius", sigDigits: '6371', trueExponent: 6, unit: 'm', startPos: 4 },
  { id: 'green', label: 'Wavelength of green light', sigDigits: '55', trueExponent: -7, unit: 'm', startPos: 0 },
  { id: 'hydrogen', label: 'Diameter of a hydrogen atom', sigDigits: '1', trueExponent: -10, unit: 'm', startPos: 0 },
  { id: 'electron', label: 'Mass of an electron', sigDigits: '91', trueExponent: -31, unit: 'kg', startPos: 0 },
  { id: 'radio', label: 'Period of a radio wave', sigDigits: '2', trueExponent: -9, unit: 's', startPos: 0 },
];

function atPos(sigDigits: string, trueExponent: number, pos: number) {
  const intPart = sigDigits.slice(0, pos) || '0';
  const fracPart = sigDigits.slice(pos) || '0';
  const mantissa = parseFloat(`${intPart}.${fracPart}`);
  const compExponent = trueExponent + (1 - pos);
  return { mantissa, compExponent, value: mantissa * Math.pow(10, compExponent) };
}

/** Round-half-up to n significant figures, returning the digit string kept and whether the cut digit rounds up. */
function roundToSigFigs(sigDigits: string, n: number): { kept: string; roundsUp: boolean; carriesOver: boolean } {
  if (n >= sigDigits.length) return { kept: sigDigits, roundsUp: false, carriesOver: false };
  const keepDigits = sigDigits.slice(0, n).split('').map(Number);
  const nextDigit = parseInt(sigDigits[n], 10);
  const roundsUp = nextDigit >= 5;
  if (roundsUp) {
    let i = keepDigits.length - 1;
    while (i >= 0) {
      keepDigits[i] += 1;
      if (keepDigits[i] < 10) break;
      keepDigits[i] = 0;
      i -= 1;
    }
    if (i < 0) {
      keepDigits.unshift(1);
      return { kept: keepDigits.join('').slice(0, n), roundsUp: true, carriesOver: true };
    }
  }
  return { kept: keepDigits.join(''), roundsUp, carriesOver: false };
}

export function StandardFormSimulator() {
  const [qIdx, setQIdx] = useState(0);
  const [pos, setPos] = useState(QUANTITIES[0].startPos);
  const [sigFigCount, setSigFigCount] = useState(3);

  const q = QUANTITIES[qIdx];
  const { mantissa, compExponent, value } = atPos(q.sigDigits, q.trueExponent, pos);
  const isValid = mantissa >= 1 && mantissa < 10;
  const isCorrect = pos === 1;

  const switchQuantity = (i: number) => {
    setQIdx(i);
    setPos(QUANTITIES[i].startPos);
    setSigFigCount(Math.min(3, QUANTITIES[i].sigDigits.length));
  };

  const step = (delta: number) => {
    const next = Math.max(0, Math.min(q.sigDigits.length, pos + delta));
    setPos(next);
  };

  const snapToStandardForm = () => setPos(1);

  const maxSigFigs = q.sigDigits.length;
  const rounding = roundToSigFigs(q.sigDigits, sigFigCount);
  const roundedExponent = q.trueExponent + (rounding.carriesOver ? 1 : 0);
  const roundedValue = parseFloat(`${rounding.kept[0]}.${rounding.kept.slice(1) || '0'}`) * Math.pow(10, roundedExponent);

  // digit tokens for the standard-form panel: show every digit, with the
  // marker rendered as a vertical bar sliding between them
  const digitChars = q.sigDigits.split('');

  return (
    <div className="standard-form-lab flex flex-col gap-5">
      {/* ---- Panel 1: drag the decimal point ---- */}
      <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden">
        <div className="flex justify-between items-baseline px-4 pt-3">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">{q.label}</span>
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">{q.unit}</span>
        </div>

        <div className="flex flex-col items-center justify-center py-10 px-4">
          <div className="flex items-center gap-1 mb-6" style={{ height: 60 }}>
            {digitChars.map((d, i) => (
              <div key={i} className="relative flex items-center">
                {i === pos && (
                  <div
                    className="absolute -left-[3px] top-[-6px] bottom-[-6px] w-[3px] rounded-full transition-all duration-500 ease-in-out"
                    style={{ background: isCorrect ? TEAL : RED }}
                  />
                )}
                <span
                  className="italic font-bold text-[34px] px-0.5 transition-colors duration-500"
                  style={{ fontFamily: 'Georgia, serif', color: INK }}
                >
                  {d}
                </span>
              </div>
            ))}
            {pos === digitChars.length && (
              <div
                className="w-[3px] self-stretch rounded-full transition-all duration-500 ease-in-out"
                style={{ background: isCorrect ? TEAL : RED }}
              />
            )}
          </div>

          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => step(-1)}
              disabled={pos === 0}
              className="w-10 h-10 rounded-full border border-[#d8cfb6] text-[#1b2a41] font-bold text-[18px] disabled:opacity-30 hover:bg-[#faf7f0]"
            >
              ←
            </button>
            <span className="text-[12px] font-mono text-[#4a5a72] w-40 text-center">move the decimal point</span>
            <button
              onClick={() => step(1)}
              disabled={pos === digitChars.length}
              className="w-10 h-10 rounded-full border border-[#d8cfb6] text-[#1b2a41] font-bold text-[18px] disabled:opacity-30 hover:bg-[#faf7f0]"
            >
              →
            </button>
          </div>

          <div className="text-center">
            <div className="italic text-[26px]" style={{ fontFamily: 'Georgia, serif', color: isValid ? TEAL : RED }}>
              {mantissa.toFixed(Math.max(0, digitChars.length - pos))} × 10<sup>{compExponent}</sup>
            </div>
            <div className="text-[12px] font-mono text-[#4a5a72] mt-2">
              {isValid ? '✓ mantissa is between 1 and 10 — this is valid standard form' : 'mantissa must be between 1 and 10 for standard form'}
            </div>
            <div className="text-[11px] font-mono text-[#a8a196] mt-1">
              same value throughout: {value.toExponential(6)} {q.unit}
            </div>
          </div>

          {!isCorrect && (
            <button
              onClick={snapToStandardForm}
              className="mt-5 text-[12.5px] font-semibold px-4 py-2 rounded-full bg-[#1b2a41] text-white hover:bg-[#243a5e]"
            >
              ▶ Snap to Standard Form
            </button>
          )}
          {isCorrect && (
            <div className="mt-5 text-[12.5px] font-bold px-4 py-2 rounded-full bg-[#e6f2ee] text-[#1b5c4d]">
              ✓ Correct standard form
            </div>
          )}
        </div>

        <div className="px-4 pb-5 flex flex-wrap gap-2 border-t border-[#eee6d3] pt-4">
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

      {/* ---- Panel 2: round to N significant figures ---- */}
      <div className="bg-white border border-[#e4ddcc] rounded overflow-hidden">
        <div className="px-4 pt-3 pb-1">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">
            Round {q.label} to N significant figures
          </span>
        </div>
        <div className="flex flex-col items-center py-8 px-4">
          <div className="flex items-center gap-1 mb-5" style={{ height: 50 }}>
            {digitChars.map((d, i) => (
              <span
                key={i}
                className="italic font-bold text-[30px] px-0.5 transition-all duration-500"
                style={{
                  fontFamily: 'Georgia, serif',
                  color: i < sigFigCount ? INK : '#c9c0aa',
                  opacity: i < sigFigCount ? 1 : i === sigFigCount ? 0.6 : 0.3,
                }}
              >
                {d}
              </span>
            ))}
          </div>

          <input
            type="range"
            min={1}
            max={maxSigFigs}
            step={1}
            value={sigFigCount}
            onChange={(e) => setSigFigCount(parseInt(e.target.value, 10))}
            className="w-64 mb-3"
          />
          <div className="text-[13px] font-mono text-[#4a5a72] mb-4">{sigFigCount} significant figure{sigFigCount > 1 ? 's' : ''}</div>

          <div className="text-center">
            <div className="italic text-[24px]" style={{ fontFamily: 'Georgia, serif', color: BRASS }}>
              {rounding.kept[0]}.{rounding.kept.slice(1) || '0'} × 10<sup>{roundedExponent}</sup>
            </div>
            {rounding.roundsUp && (
              <div className="text-[11.5px] font-mono text-[#b34a3c] mt-1.5">
                the next digit was {q.sigDigits[sigFigCount]} (≥5), so the last kept digit rounds up
                {rounding.carriesOver ? ' — and carries all the way over, bumping the exponent by 1' : ''}
              </div>
            )}
            <div className="text-[11px] font-mono text-[#a8a196] mt-2">
              rounded value: {roundedValue.toExponential(sigFigCount - 1)} {q.unit}
            </div>
          </div>
        </div>
      </div>

      {/* ---- Notebook row ---- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Why It Works</span>
          <div className="mt-2.5 space-y-2.5 text-[12.5px] text-[#4a5a72] leading-snug">
            <p>
              <strong className="text-[#1b2a41]">The value never changes as you move the point.</strong> Every
              position you tried gave the exact same number back — moving the point one place right makes the
              mantissa 10× bigger, so the exponent must drop by exactly 1 to compensate.
            </p>
            <p>Standard form isn't a new number — it's the same number, written so exactly one digit sits before the point.</p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Try This</span>
          <div className="mt-2 space-y-2.5 text-[12px] text-[#4a5a72] leading-snug">
            <p>
              <strong className="text-[#1b2a41]">1.</strong> Step through every position for the Moon's distance and
              watch the exponent count down as the mantissa grows — then hit Snap and see it land exactly where you
              expect.
            </p>
            <p>
              <strong className="text-[#1b2a41]">2.</strong> Switch to the hydrogen atom or the electron mass — tiny
              numbers need a negative exponent, and the same rule applies without any sign changes to how you think
              about it.
            </p>
            <p>
              <strong className="text-[#1b2a41]">3.</strong> Drag the sig-fig slider for the Sun's distance down to 1,
              then back up to 4. Watch which digits survive and whether the boundary digit forces a round-up.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#e4ddcc] rounded p-4">
          <div className="bg-gradient-to-br from-[#fbf5e8] to-[#f6efdc] border border-[#e6d9b8] rounded px-4 py-3.5 text-center mb-3">
            <div className="italic text-[20px] text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>
              a × 10<sup>n</sup>
            </div>
            <div className="italic text-[13px] text-[#8f6428] mt-1.5" style={{ fontFamily: 'Georgia, serif' }}>
              standard form, where 1 ≤ a &lt; 10
            </div>
          </div>
          <h2 className="font-mono text-[13px] tracking-wide uppercase text-[#4a5a72] border-b border-[#eee6d3] pb-2 mb-3">
            What Each Symbol Means
          </h2>
          <div className="space-y-2.5">
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-9 h-9 rounded bg-[#faf7f0] border border-[#eee6d3] flex items-center justify-center text-[16px] font-bold italic text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>a</div>
              <p className="text-[12px] text-[#4a5a72] leading-snug"><strong className="text-[#1b2a41]">The mantissa.</strong> Always between 1 and 10 — exactly one non-zero digit before the point.</p>
            </div>
            <div className="flex gap-3 items-start">
              <div className="flex-shrink-0 w-9 h-9 rounded bg-[#faf7f0] border border-[#eee6d3] flex items-center justify-center text-[16px] font-bold italic text-[#8f6428]" style={{ fontFamily: 'Georgia, serif' }}>n</div>
              <p className="text-[12px] text-[#4a5a72] leading-snug"><strong className="text-[#1b2a41]">The exponent.</strong> Positive for large numbers, negative for small ones — counts how many places the point moved.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
