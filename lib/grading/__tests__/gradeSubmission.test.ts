import { describe, it, expect } from 'vitest';
import { gradeSubmission, textAnswersMatch } from '../gradeSubmission';
import { gradeNumeric, parseQuantity, specFromProblem } from '../numericAnswer';

const numeric = (answer_correct: string, extra: Record<string, unknown> = {}) => ({
  answer_type: 'numeric',
  answer_correct,
  answer_unit: null,
  answer_unit_required: false,
  answer_tolerance: null,
  answer_sign_sensitive: false,
  answer_alternates: null,
  ...extra,
});

describe('the same number typed every way grades the same', () => {
  const spec = specFromProblem({ answer_correct: '3.0e8' })!;
  it.each([
    '3.0e8',
    '3.0E8',
    '3.0 × 10^8',
    '3.0×10⁸',
    '3.0*10^8',
    '3.0 x 10^8',
    '3.0*10**8',
    '3.0\\times10^{8}',
    '3.0\\times10^8',
    '3.0\\cdot10^{8}',
    '3\\times10^{8}',
    '300000000',
    '300,000,000',
  ])('%s', (answer) => {
    const r = gradeNumeric(answer, spec);
    expect(r.correct).toBe(true);
    expect(r.parsedValue).toBeCloseTo(3e8, 0);
  });

  it('reads the three spellings as exactly the same quantity', () => {
    const a = parseQuantity('3.0e8')!;
    const b = parseQuantity('3.0 × 10^8')!;
    const c = parseQuantity('3.0*10^8')!;
    const d = parseQuantity('3.0\\times10^{8}')!;
    expect([b.value, c.value, d.value]).toEqual([a.value, a.value, a.value]);
  });
});

describe('maths-box answers', () => {
  it('fractions', () => {
    expect(gradeSubmission(numeric('0.5'), '\\frac{1}{2}').isCorrect).toBe(true);
    expect(gradeSubmission(numeric('0.75'), '\\frac{3}{4}').isCorrect).toBe(true);
    expect(gradeSubmission(numeric('0.5'), '\\frac{1}{4}').isCorrect).toBe(false);
    expect(gradeSubmission(numeric('0.5'), '1/2').isCorrect).toBe(true);
  });

  it('roots and pi', () => {
    expect(gradeSubmission(numeric('1.414'), '\\sqrt{2}').isCorrect).toBe(true);
    expect(gradeSubmission(numeric('3'), '\\sqrt[3]{27}').isCorrect).toBe(true);
    expect(gradeSubmission(numeric('6.283'), '2\\pi').isCorrect).toBe(true);
  });

  it('negative powers of ten and units', () => {
    const g = gradeSubmission(numeric('6.63e-34', { answer_unit: 'J' }), '6.63\\times10^{-34}\\,\\mathrm{J}');
    expect(g.isCorrect).toBe(true);
    expect(g.gradingMethod).toBe('numeric');
    expect(g.correctAnswerLabel).toBe('6.63e-34 J');
  });

  it('SI prefixes typed in the maths box', () => {
    expect(gradeSubmission(numeric('2e-6', { answer_unit: 'C' }), '2\\,\\mu C').isCorrect).toBe(true);
    expect(gradeSubmission(numeric('225', { answer_unit: 'N' }), '225\\,\\mathrm{mN}').gradeReason).toBe('wrong-unit');
  });

  it('a compound unit (m s⁻¹) does not stop the value being graded', () => {
    expect(gradeSubmission(numeric('5', { answer_unit: 'm/s' }), '5\\,\\mathrm{m}\\,\\mathrm{s}^{-1}').isCorrect).toBe(true);
  });

  it('an unfinished power of ten is not read as the whole answer', () => {
    const g = gradeSubmission(numeric('3e8'), '3\\times10^{\\placeholder{}}');
    expect(g.isCorrect).toBe(false);
  });
});

describe('existing behaviour is kept', () => {
  it('plain answers grade exactly as before', () => {
    const spec = specFromProblem({ answer_correct: '1.8e10', answer_unit: 'N' })!;
    expect(gradeNumeric('1.8 x 10^10 N', spec).correct).toBe(true);
    expect(gradeNumeric('1.8 x 10^10 mN', spec).reason).toBe('wrong-unit');
    expect(gradeNumeric('1.7e10', spec).reason).toBe('close');
    expect(gradeNumeric('abc', spec).reason).toBe('unparseable');
    expect(gradeNumeric('1.8', spec).correct).toBe(false);
  });

  it('sums are not evaluated', () => {
    expect(gradeSubmission(numeric('14'), '8+6').isCorrect).toBe(false);
  });

  it('multiple choice compares the option id', () => {
    const mcq = { answer_type: 'multiple_choice', answer_correct: null };
    const option = { id: 'opt-2', option_text: '4.0 N' };
    expect(gradeSubmission(mcq, 'opt-2', option)).toMatchObject({ isCorrect: true, correctAnswerLabel: '4.0 N', gradingMethod: 'mcq' });
    expect(gradeSubmission(mcq, 'opt-1', option).isCorrect).toBe(false);
  });

  it('text answers fold case, spacing and notation', () => {
    expect(textAnswersMatch('x^{2}', 'x^2')).toBe(true);
    expect(textAnswersMatch('Increases', 'increases')).toBe(true);
    expect(textAnswersMatch('3\\times10^{8}', '3 x 10^8')).toBe(true);
    expect(textAnswersMatch('x^3', 'x^2')).toBe(false);
    expect(gradeSubmission({ answer_type: 'free_text', answer_correct: 'v^2' }, 'v^{2}').isCorrect).toBe(true);
  });
});

describe('answers students have really sent', () => {
  it('Arabic-Indic digits', () => {
    expect(gradeSubmission(numeric('4'), '٤').isCorrect).toBe(true);
    expect(gradeSubmission(numeric('2.5'), '٢٫٥').isCorrect).toBe(true);
  });
  it('pasted display maths', () => {
    expect(gradeSubmission(numeric('4.16e-7', { answer_unit: 'N' }), '\\[ 4.16\\times10^{-7}\\text{ N} \\]').isCorrect).toBe(true);
  });
});
