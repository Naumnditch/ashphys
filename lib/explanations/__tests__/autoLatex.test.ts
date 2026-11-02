import { describe, expect, it } from 'vitest';
import katex from 'katex';
import { segmentMath } from '../autoLatex';

const show = (text: string) =>
  segmentMath(text)
    .map((s) => (s.math ? `[${s.latex}]` : s.text))
    .join('');

const SAMPLES = [
  'One lap is one circumference, so v = 2πr/T = (2π × 50) ÷ 9.0 = 34.9 m/s. (Its average velocity over a whole lap is zero.)',
  'Total momentum stays zero: 0.50v = 1.0 × 0.60, so the 0.50 kg trolley moves at 1.2 m s⁻¹. KE = ½ × 0.50 × 1.2² + ½ × 1.0 × 0.60² = 0.54 J.',
  'The mass cancels, so v = √(0.85 × g × r) = √(0.85 × 9.8 × 40) = √333 = 18.3 m/s, about 65.7 km/h — the same for a lorry.',
  'g = GM/r² = 6.67 × 10⁻¹¹ × 7.35 × 10²² ÷ (1.74 × 10⁶)² = 1.62 N/kg — about a sixth of the value on Earth.',
  'Common mistake: writing F = kq²/r² as if both charges were q (giving 1.10 × 10⁻⁷ C), or adding the charges (q + 3q) instead.',
  'By Malus’s law, I = I₀cos²θ = I₀cos²30° = I₀ × 0.866² = 0.75 I₀. Note that the cosine is squared.',
  'Taking logarithms gives lg y = lg k + n lg x, so the gradient is n.',
  'λ = ln 2 / t½ = 0.693 ÷ 12 = 0.0578 s⁻¹.',
  'Δv = (0,8.0) − (8.0,0) = (−8.00, 8.00) m/s. Magnitude = √(8.00²+8.00²) = 11.3 m/s.',
  'So 24 − 0.30T = 0.20T − 4, giving 28 = 0.50T and T = 56 °C.',
  'R = ρL/A = (1.1 × 10⁻⁶ × 2.0) ÷ 5.0 × 10⁻⁷ = 4.4 Ω.',
  'Each half-life removes half of what remains: N₀/2, N₀/4, N₀/8... The population approaches zero.',
];

describe('segmentMath', () => {
  it('converts a worked line into LaTeX with units in \\text', () => {
    expect(show(SAMPLES[0])).toBe(
      'One lap is one circumference, so [v = 2\\pi r/T = (2\\pi \\times 50) \\div 9.0 = 34.9\\ \\text{m}/\\text{s}]. (Its average velocity over a whole lap is zero.)',
    );
  });

  it('handles roots, powers of ten, Greek letters and functions', () => {
    expect(show(SAMPLES[2])).toContain('[v = \\sqrt{0.85 \\times g \\times r} = \\sqrt{0.85 \\times 9.8 \\times 40} = \\sqrt{333} = 18.3\\ \\text{m}/\\text{s}]');
    expect(show(SAMPLES[3])).toContain('10^{-11}');
    expect(show(SAMPLES[5])).toContain('I_{0}\\cos^{2}\\theta');
    expect(show(SAMPLES[6])).toContain('[\\lg y = \\lg k + n \\lg x]');
    expect(show(SAMPLES[7])).toContain('t_{1/2}');
    expect(show(SAMPLES[9])).toContain('[T = 56\\ {}^{\\circ}\\text{C}]');
    expect(show(SAMPLES[10])).toContain('4.4\\ \\Omega');
  });

  it('keeps brackets that belong to the prose in the prose', () => {
    expect(show(SAMPLES[4])).toContain('(giving [1.10 \\times 10^{-7}');
    expect(show(SAMPLES[8])).toContain('= (-8.00, 8.00)\\ \\text{m}/\\text{s}]');
  });

  it('keeps a full stop before a closing bracket out of the equation', () => {
    expect(show('(Or v = 2πr/T = 1.68 m/s and F = mv²/r.)')).toBe('(Or [v = 2\\pi r/T = 1.68\\ \\text{m}/\\text{s}] and [F = mv^{2}/r].)');
  });

  it('leaves plain prose and bare numbers alone', () => {
    const t = 'A column of readings should read 24.0, 31.5, 47.0 — not 24, 31.5, 47. Average speed = total distance ÷ total time.';
    expect(segmentMath(t)).toEqual([{ math: false, text: t }]);
    expect(segmentMath('No — g is the same for every object.')).toEqual([{ math: false, text: 'No — g is the same for every object.' }]);
  });

  it('never loses text and every equation parses in KaTeX', () => {
    for (const t of SAMPLES) {
      const segs = segmentMath(t);
      expect(segs.map((s) => (s.math ? s.source : s.text)).join('').replace(/\s+/g, '')).toBe(t.replace(/\s+/g, ''));
      for (const s of segs) if (s.math) expect(() => katex.renderToString(s.latex, { throwOnError: true, strict: 'ignore' })).not.toThrow();
    }
  });
});
