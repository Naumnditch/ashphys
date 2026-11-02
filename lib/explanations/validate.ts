/**
 * Checks a structured explanation before students see it. Anything that fails
 * is stored with status `needs_review` and the list of issues, and the
 * practice page keeps showing the original explanation for that question.
 */

import katex from 'katex';
import { MAX_WORDS, SECTION_TITLES } from './format';
import { allMath, countWords, parseExplanation } from './parse';

export interface ExpectedAnswer {
  answerType: string;
  /** Stored answer, e.g. "3.37", "75", "1.2e-6". */
  answerCorrect: string | null;
  alternates?: (string | number)[] | null;
  /** Relative tolerance; defaults to 2 %, as the grader. */
  tolerance?: number | null;
}

export interface ValidationResult {
  ok: boolean;
  issues: string[];
  words: number;
}

const norm = (s: string) => s.toLowerCase().replace(/[^a-z]/g, '');

/** "1.20 \times 10^{-6}\ \text{C}" → [1.2e-6]. Every number in a boxed result. */
export function numbersInLatex(latex: string): number[] {
  const plain = latex
    .replace(/\\(?:text|mathrm|operatorname)\{([^}]*)\}/g, ' $1 ')
    .replace(/\{,\}/g, '')
    .replace(/(\d)\\,(?=\d{3})/g, '$1')
    .replace(/[−–]/g, '-')
    .replace(/\\(?:times|cdot)\s*10\s*\^\s*\{?\s*([-+]?\d+)\s*\}?/g, 'e$1')
    .replace(/(^|[^\d.])10\s*\^\s*\{?\s*([-+]?\d+)\s*\}?/g, (_m, pre: string, exp: string) => `${pre}1e${exp}`)
    .replace(/\s+(?=e[-+]?\d)/g, '');
  const out: number[] = [];
  for (const m of plain.matchAll(/[-+]?\d+(?:\.\d+)?(?:e[-+]?\d+)?/g)) {
    const v = Number(m[0]);
    if (Number.isFinite(v)) out.push(v);
  }
  return out;
}

/** The contents of every \boxed{…}, with nested braces. */
export function boxedContents(text: string): string[] {
  const out: string[] = [];
  let i = text.indexOf('\\boxed{');
  while (i !== -1) {
    let depth = 0;
    const start = i + '\\boxed{'.length;
    let j = start;
    for (; j < text.length; j++) {
      if (text[j] === '{') depth++;
      else if (text[j] === '}') {
        if (depth === 0) break;
        depth--;
      }
    }
    out.push(text.slice(start, j));
    i = text.indexOf('\\boxed{', j);
  }
  return out;
}

function close(a: number, b: number, tol: number): boolean {
  if (b === 0) return Math.abs(a) < 1e-12;
  return Math.abs(a - b) <= Math.abs(b) * tol;
}

export function validateExplanation(text: string, expected: ExpectedAnswer): ValidationResult {
  const issues: string[] = [];
  const parsed = parseExplanation(text);

  const titles = parsed.sections.map((s) => norm(s.title));
  const missing = SECTION_TITLES.filter((t) => !titles.includes(norm(t)));
  if (missing.length) issues.push(`Missing section${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`);
  else {
    const order = SECTION_TITLES.map((t) => titles.indexOf(norm(t)));
    if (order.some((v, i) => i > 0 && v < order[i - 1])) issues.push('Sections are out of order');
  }
  const extra = parsed.sections.filter((s) => !SECTION_TITLES.some((t) => norm(t) === norm(s.title)));
  if (extra.length) issues.push(`Unexpected section: ${extra.map((s) => s.title).join(', ')}`);
  if (parsed.sections.some((s) => s.blocks.length === 0)) issues.push('A section is empty');

  const words = countWords(text);
  if (words >= MAX_WORDS) issues.push(`Too long: ${words} words (limit is under ${MAX_WORDS})`);

  if (text.includes('!')) issues.push('Contains an exclamation mark');
  if (/```/.test(text)) issues.push('Contains a code fence');
  // An odd number of unescaped dollar signs means an unclosed maths expression.
  if ((text.replace(/\\\$/g, '').match(/\$/g) ?? []).length % 2 !== 0) issues.push('Unbalanced $ delimiters');

  for (const { latex, display } of allMath(parsed)) {
    try {
      katex.renderToString(latex, { displayMode: display, throwOnError: true, strict: 'ignore' });
    } catch (err) {
      issues.push(`LaTeX error in "${latex.slice(0, 60)}": ${(err as Error).message.slice(0, 120)}`);
    }
  }

  const boxed = boxedContents(text);
  if (boxed.length === 0) issues.push('No \\boxed{} result');

  if (expected.answerType === 'numeric' && boxed.length) {
    const target = Number(String(expected.answerCorrect ?? '').replace(/[^\d.eE+-]/g, ''));
    if (Number.isFinite(target) && String(expected.answerCorrect ?? '').trim() !== '') {
      const tol = Math.max(expected.tolerance ?? 0.02, 0.02);
      const accepted = [target, ...(expected.alternates ?? []).map(Number).filter(Number.isFinite)];
      const found = boxed.flatMap(numbersInLatex);
      const matches = found.some((v) => accepted.some((a) => close(Math.abs(v), Math.abs(a), tol)));
      if (!matches) {
        issues.push(`Boxed result (${boxed.join('; ').slice(0, 80)}) does not match the stored answer ${expected.answerCorrect}`);
      }
    }
  }

  return { ok: issues.length === 0, issues, words };
}
