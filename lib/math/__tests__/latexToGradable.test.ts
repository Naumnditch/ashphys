import { describe, it, expect } from 'vitest';
import { latexToGradable, looksLikeLatex, normalizeForComparison } from '../latexToGradable';
import { evaluatePrefix } from '../safeEvaluate';
import { validateAnswer, MAX_ANSWER_LENGTH } from '../answerValidation';
import { quantityToLatex } from '../quantityLatex';

describe('latexToGradable: the examples from the spec', () => {
  it.each([
    ['3\\times10^{8}', '3*10^8'],
    ['\\frac{1}{2}', '(1)/(2)'],
    ['\\sqrt{x}', 'sqrt(x)'],
    ['x^{2}', 'x^2'],
    ['\\pi', 'pi'],
  ])('%s → %s', (latex, linear) => {
    expect(latexToGradable(latex)).toBe(linear);
  });
});

describe('latexToGradable: what MathLive actually produces', () => {
  it.each([
    // MathLive leaves single-character scripts unbraced
    ['x^2', 'x^2'],
    ['3\\times10^8', '3*10^8'],
    ['3.0\\times10^{-34}', '3.0*10^-34'],
    ['6.63\\times10^{-34}\\,\\mathrm{J}\\,\\mathrm{s}', '6.63*10^-34 J s'],
    ['5\\,\\mathrm{m}\\,\\mathrm{s}^{-1}', '5 m s^-1'],
    ['5\\mathrm{m\\,s^{-1}}', '5 m s^-1'],
    ['2.5\\text{ m s}^{-1}', '2.5 m s^-1'],
    ['\\frac{3}{4}', '(3)/(4)'],
    ['\\frac{1}{2}mv^2', '(1)/(2)mv^2'],
    ['\\frac{\\frac{1}{2}}{3}', '((1)/(2))/(3)'],
    ['\\frac12', '(1)/(2)'],
    ['\\sqrt{2}', 'sqrt(2)'],
    ['\\sqrt[3]{27}', '(27)^(1/(3))'],
    ['\\sqrt[2]{9}', 'sqrt(9)'],
    ['x^{n+1}', 'x^(n+1)'],
    ['10^{-\\frac{1}{2}}', '10^(-(1)/(2))'],
    ['v_0', 'v_0'],
    ['v_{0}', 'v_0'],
    ['v_{max}', 'v_max'],
    ['2\\pi r', '2pi r'],
    ['\\Delta x', 'Delta x'],
    ['\\lambda', 'lambda'],
    ['\\omega', 'omega'],
    ['\\theta', 'theta'],
    ['\\rho', 'rho'],
    ['5\\mu C', '5µC'],
    ['4.7\\,\\mathrm{k}\\Omega', '4.7 kΩ'],
    ['\\pm 0.5', '+-0.5'],
    ['6\\div 2', '6/2'],
    ['3\\cdot 4', '3*4'],
    ['x\\le 5', 'x<=5'],
    ['x\\ge 5', 'x>=5'],
    ['30\\degree', '30°'],
    ['30^{\\circ}', '30°'],
    ['30^\\circ', '30°'],
    ['\\left(2+3\\right)', '(2+3)'],
    ['3\\times10^{\\placeholder{}}', '3*10^()'],
    ['\\sin\\theta', 'sin theta'],
  ])('%s → %s', (latex, linear) => {
    expect(latexToGradable(latex)).toBe(linear);
  });
});

describe('latexToGradable: plain text is left alone', () => {
  it.each(['3.0e8', '3.0 × 10^8', '3.0*10^8', '1.8 x 10^10 N', '225 mN', '-15', '0.25 kg m/s'])('%s', (plain) => {
    expect(latexToGradable(plain)).toBe(plain);
  });
  it('only collapses whitespace', () => {
    expect(latexToGradable('  1.8   x 10^10 ')).toBe('1.8 x 10^10');
  });
  it('recognises LaTeX', () => {
    expect(looksLikeLatex('3\\times10^8')).toBe(true);
    expect(looksLikeLatex('x^{2}')).toBe(true);
    expect(looksLikeLatex('x^2')).toBe(false);
    expect(looksLikeLatex('3.0e8')).toBe(false);
  });
});

describe('latexToGradable: hostile input never throws', () => {
  it('survives unbalanced and deeply nested braces', () => {
    expect(() => latexToGradable('\\frac{1}{')).not.toThrow();
    expect(() => latexToGradable('}}}{{{')).not.toThrow();
    expect(() => latexToGradable('{'.repeat(500) + '1' + '}'.repeat(500))).not.toThrow();
    expect(() => latexToGradable('\\')).not.toThrow();
    expect(() => latexToGradable('^^^__')).not.toThrow();
  });
});

describe('normalizeForComparison', () => {
  it('folds the ways of writing the same thing', () => {
    const key = normalizeForComparison('x^2');
    for (const v of ['x^{2}', 'x**2', 'X ^ 2', ' x^2 ']) expect(normalizeForComparison(v)).toBe(key);
    const sci = normalizeForComparison('3*10^8');
    for (const v of ['3\\times10^{8}', '3×10^8', '3x10^8', '3 x 10^8', '3 * 10 ** 8']) expect(normalizeForComparison(v)).toBe(sci);
  });
});

describe('evaluatePrefix: a parser, not eval', () => {
  it.each([
    ['(1)/(2)', 0.5],
    ['1/2', 0.5],
    ['sqrt(16)', 4],
    ['√9', 3],
    ['2pi', 2 * Math.PI],
    ['(27)^(1/(3))', 3],
    ['3*10^8', 3e8],
    ['3 x 10^8', 3e8],
    ['1.5e3', 1500],
    ['-2^2', -4],
    ['2^3^2', 512],
    ['((1)/(2))/(3)', 1 / 6],
    ['10^(-(1)/(2))', Math.pow(10, -0.5)],
  ])('%s = %d', (expr, value) => {
    expect(evaluatePrefix(expr)?.value).toBeCloseTo(value as number, 10);
  });

  it('stops at a unit', () => {
    expect(evaluatePrefix('5 m/s')).toEqual({ value: 5, length: 1, operations: 0 });
    expect(evaluatePrefix('3 e')).toMatchObject({ value: 3, length: 1 });
    expect(evaluatePrefix('3x')).toMatchObject({ value: 3, length: 1 });
    expect(evaluatePrefix('2 pipes')).toMatchObject({ value: 2, length: 1 });
  });

  it('does not add or subtract (8+6 is working, not an answer)', () => {
    expect(evaluatePrefix('8+6')).toMatchObject({ value: 8, length: 1 });
  });

  it('refuses anything that is not arithmetic', () => {
    expect(evaluatePrefix('alert(1)')).toBeNull();
    expect(evaluatePrefix('constructor')).toBeNull();
    expect(evaluatePrefix('process.exit()')).toBeNull();
    expect(evaluatePrefix('1/0')).toBeNull(); // not finite
    expect(evaluatePrefix('(' .repeat(300) + '1' + ')'.repeat(300))).toBeNull();
  });
});

describe('validateAnswer (API)', () => {
  it('accepts what the maths box and older clients send', () => {
    for (const ok of [
      '3\\times10^{8}',
      '\\frac{1}{2}',
      '\\sqrt[3]{27}',
      '5\\,\\mathrm{m}\\,\\mathrm{s}^{-1}',
      '2.5\\text{ m s}^{-1}',
      '30\\degree',
      '\\Delta x=\\lambda',
      '1.0×10⁻⁶ N',
      '3.0e8',
      '-1.5 * 10 ^10',
      '4.7 kΩ',
      '5 µC',
      'a1b2c3d4-0000-4000-8000-000000000000',
    ]) {
      expect(validateAnswer(ok)).toEqual({ ok: true, answer: ok });
    }
  });

  it('trims and accepts numbers', () => {
    expect(validateAnswer('  42 ')).toEqual({ ok: true, answer: '42' });
    expect(validateAnswer(42)).toEqual({ ok: true, answer: '42' });
  });

  it('rejects empty, oversized and non-string answers', () => {
    expect(validateAnswer('').ok).toBe(false);
    expect(validateAnswer('   ').ok).toBe(false);
    expect(validateAnswer(null).ok).toBe(false);
    expect(validateAnswer({ toString: () => '1' }).ok).toBe(false);
    expect(validateAnswer(['1']).ok).toBe(false);
    expect(validateAnswer('1'.repeat(MAX_ANSWER_LENGTH)).ok).toBe(true);
    expect(validateAnswer('1'.repeat(MAX_ANSWER_LENGTH + 1)).ok).toBe(false);
  });

  it('rejects characters and commands outside maths', () => {
    expect(validateAnswer('<script>alert(1)</script>').ok).toBe(true); // just characters: never rendered as HTML or run
    expect(validateAnswer('1§').ok).toBe(false);
    expect(validateAnswer('1 😀').ok).toBe(false);
    expect(validateAnswer('\\input{/etc/passwd}').ok).toBe(false);
    expect(validateAnswer('\\href{x}{y}').ok).toBe(false);
    expect(validateAnswer('\\def\\x{1}').ok).toBe(false);
    expect(validateAnswer('\\frac{1}{2').ok).toBe(false);
    expect(validateAnswer('}{').ok).toBe(false);
    expect(validateAnswer('{'.repeat(13) + '}'.repeat(13)).ok).toBe(false);
  });
});

describe('quantityToLatex (answer-key labels)', () => {
  it.each([
    ['2.5e7 m/s', '2.5\\times10^{7}\\ \\mathrm{m}/\\mathrm{s}'],
    ['3.0 × 10⁸ N', '3.0\\times10^{8}\\ \\mathrm{N}'],
    ['1.8 × 10¹⁰', '1.8\\times10^{10}'],
    ['-15 m/s²', '-15\\ \\mathrm{m}/\\mathrm{s}^{2}'],
    ['53.1 °', '53.1^{\\circ}'],
    ['35 %', '35\\%'],
    ['10 µF', '10\\ \\mu \\mathrm{F}'],
    ['0.25 kg m/s', '0.25\\ \\mathrm{kg}\\,\\mathrm{m}/\\mathrm{s}'],
    ['4 s⁻¹', '4\\ \\mathrm{s}^{-1}'],
    ['12', '12'],
  ])('%s', (label, latex) => {
    expect(quantityToLatex(label)).toBe(latex);
  });
  it('gives up on anything that is not number + unit', () => {
    expect(quantityToLatex('It decreases')).toBeNull();
    expect(quantityToLatex('5 (approx)')).toBeNull();
    expect(quantityToLatex('')).toBeNull();
  });
});
