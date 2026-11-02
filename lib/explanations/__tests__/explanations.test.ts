import { describe, expect, it } from 'vitest';
import { buildRewritePrompt, SECTION_TITLES } from '../format';
import { countWords, isStructured, parseExplanation } from '../parse';
import { boxedContents, numbersInLatex, validateExplanation } from '../validate';
import { explanationForStudents } from '../display';

const GOOD = `### Given
- $q_1 = 3.00\\ \\mu\\text{C}$
- $q_2 = -5.00\\ \\mu\\text{C}$
- $r = 20.0\\ \\text{cm}$

### Unit conversion
$$1\\ \\mu\\text{C} = 1.00 \\times 10^{-6}\\ \\text{C}$$
$$r = 20.0\\ \\text{cm} = 0.200\\ \\text{m}$$

### Principle
Coulomb's law, with $k = 8.99 \\times 10^{9}\\ \\text{N m}^2\\,\\text{C}^{-2}$:
$$F = k\\frac{|q_1 q_2|}{r^2}$$

### Substitution and calculation
$$F = \\frac{(8.99 \\times 10^{9})(3.00 \\times 10^{-6})(5.00 \\times 10^{-6})}{(0.200)^2} = \\frac{0.1349}{0.0400}$$

### Result
$$\\boxed{F = 3.37\\ \\text{N}}$$

### Common errors
- Substituting $r = 20.0$ in centimetres.
- Forgetting to square $r$.`;

const numeric = { answerType: 'numeric', answerCorrect: '3.37' };

describe('parseExplanation', () => {
  it('splits the six sections and their blocks', () => {
    const p = parseExplanation(GOOD);
    expect(p.sections.map((s) => s.title)).toEqual([...SECTION_TITLES]);
    expect(p.sections[0].blocks).toHaveLength(1);
    expect(p.sections[0].blocks[0].kind).toBe('list');
    expect(p.sections[1].blocks.map((b) => b.kind)).toEqual(['math', 'math']);
    expect(p.sections[2].blocks.map((b) => b.kind)).toEqual(['para', 'math']);
  });

  it('accepts numbered and bold headings', () => {
    const p = parseExplanation('**1. Given**\n- a\n### 2. Unit conversion\nNone.\n## Principle\nx');
    expect(p.sections.map((s) => s.title)).toEqual(['Given', 'Unit conversion', 'Principle']);
  });

  it('keeps inline maths and bold apart from text', () => {
    const p = parseExplanation('### Result\nSo **F** is $\\boxed{3\\ \\text{N}}$ here.');
    const block = p.sections[0].blocks[0];
    expect(block.kind).toBe('para');
    if (block.kind === 'para') expect(block.inlines.map((i) => i.kind)).toEqual(['text', 'bold', 'text', 'math', 'text']);
  });

  it('recognises structured vs plain text', () => {
    expect(isStructured(GOOD)).toBe(true);
    expect(isStructured('KE = ½mv² = 0.54 J. Common mistake: forgetting the half.')).toBe(false);
    expect(isStructured(null)).toBe(false);
  });
});

describe('countWords', () => {
  it('counts each maths expression as one word and skips headings', () => {
    expect(countWords('### Given\n- $a = 1$ and $b = 2$\n$$c = 3$$')).toBe(4);
  });
});

describe('numbersInLatex / boxedContents', () => {
  it('reads scientific notation and units', () => {
    expect(numbersInLatex('F = 1.20 \\times 10^{-6}\\ \\text{C}')).toEqual([1.2e-6]);
    expect(numbersInLatex('3.37\\ \\text{N}')).toEqual([3.37]);
    expect(numbersInLatex('2.5 \\times 10^3')).toEqual([2500]);
  });
  it('handles nested braces in \\boxed', () => {
    expect(boxedContents('$\\boxed{\\frac{1}{2}\\ \\text{m}}$')).toEqual(['\\frac{1}{2}\\ \\text{m}']);
  });
});

describe('validateExplanation', () => {
  it('passes a well-formed worked solution', () => {
    const v = validateExplanation(GOOD, numeric);
    expect(v.issues).toEqual([]);
    expect(v.ok).toBe(true);
  });

  it('flags a boxed result that disagrees with the stored answer', () => {
    const v = validateExplanation(GOOD.replace('3.37', '4.12'), numeric);
    expect(v.ok).toBe(false);
    expect(v.issues.join()).toMatch(/does not match/);
  });

  it('accepts a result within 2 % and alternates', () => {
    expect(validateExplanation(GOOD, { answerType: 'numeric', answerCorrect: '3.371' }).ok).toBe(true);
    expect(validateExplanation(GOOD, { answerType: 'numeric', answerCorrect: '99', alternates: ['3.37'] }).ok).toBe(true);
  });

  it('flags missing sections, exclamation marks, bad LaTeX and length', () => {
    const noErrors = GOOD.slice(0, GOOD.indexOf('### Common errors'));
    expect(validateExplanation(noErrors, numeric).issues.join()).toMatch(/Missing section: Common errors/);
    expect(validateExplanation(`${GOOD}\nGreat work!`, numeric).issues.join()).toMatch(/exclamation/);
    expect(validateExplanation(GOOD.replace('\\frac{|q_1 q_2|}{r^2}', '\\frac{|q_1 q_2|'), numeric).issues.join()).toMatch(/LaTeX error/);
    const long = GOOD.replace('- Forgetting to square $r$.', `- ${'word '.repeat(150)}`);
    expect(validateExplanation(long, numeric).issues.join()).toMatch(/Too long/);
  });

  it('does not check the number for multiple-choice questions', () => {
    const mcq = GOOD.replace('F = 3.37\\ \\text{N}', '\\text{B: the force quadruples}');
    expect(validateExplanation(mcq, { answerType: 'multiple_choice', answerCorrect: null }).ok).toBe(true);
  });
});

describe('buildRewritePrompt', () => {
  it('fills the three placeholders and lists MCQ options', () => {
    const prompt = buildRewritePrompt({
      questionText: 'Which is a vector?',
      finalAnswer: 'Velocity',
      existingExplanation: 'Velocity has direction.',
      answerType: 'multiple_choice',
      options: [
        { text: 'Speed', correct: false },
        { text: 'Velocity', correct: true },
      ],
    });
    expect(prompt).toContain('Question: Which is a vector?');
    expect(prompt).toContain('Final answer: Velocity');
    expect(prompt).toContain('Existing explanation: Velocity has direction.');
    expect(prompt).toContain('B. Velocity  [correct]');
    expect(prompt).toContain('Keep the explanation under 150 words.');
    expect(prompt).not.toContain('[QUESTION]');
  });
});

describe('explanationForStudents', () => {
  it('shows the structured version only once it is live', () => {
    expect(explanationForStudents({ explanation: 'old', explanation_structured: GOOD, explanation_structured_status: 'ok' })).toEqual({
      explanation: GOOD,
      explanationFormat: 'structured',
    });
    expect(
      explanationForStudents({ explanation: 'old', explanation_structured: GOOD, explanation_structured_status: 'needs_review' }),
    ).toEqual({ explanation: 'old', explanationFormat: 'plain' });
    expect(explanationForStudents({ explanation: 'old' })).toEqual({ explanation: 'old', explanationFormat: 'plain' });
  });
});
