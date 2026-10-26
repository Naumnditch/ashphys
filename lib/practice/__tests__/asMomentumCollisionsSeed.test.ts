import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { gradeNumeric, specFromProblem } from '@/lib/grading/numericAnswer';
import { getDiagram } from '@/components/practice/MomentumDiagrams';
import { toSvgMarkup } from '@/lib/practice/worksheetPdf';
import { MOMENTUM_BANK_DIAGRAMS } from '@/components/practice/MomentumBankDiagrams';

/**
 * Checks the AS Level Chapter 6 Momentum banks (6.1 The idea of momentum,
 * 6.2 Conservation of momentum and collisions, 6.3 Understanding collisions)
 * exactly as they are applied: the generated SQL, run through the real
 * grader. Every stored numeric answer must grade correct typed bare, with its
 * unit, and at 2-3 s.f.; a wrong value or wrong sign (where sign-sensitive)
 * must not; every multiple-choice question needs exactly one correct option
 * matching the stored answer text; and every figure a question promises must
 * resolve to an actual diagram.
 */

const SQL = readFileSync(
  path.resolve(__dirname, '../../../database/seeds/2026-10-26-as-momentum-collisions.sql'),
  'utf8'
);

type Cell = string | number | boolean | null;

// A literal ';' inside a string value (even safely single-quoted) hangs this
// environment's SQL-apply tool, so the generator routes any embedded ';' through
// `('a' || chr(59) || 'b')`-style concatenation instead of a plain quoted literal
// (see the generator's q() helper). This parses a single quoted string starting at
// s[i] == "'", OR that concatenation form starting at s[i] == '(', reconstructing
// the original value either way, and returns the index just past what it consumed.
function parseQuotedOrConcat(s: string, i: number): { value: string; next: number } {
  if (s[i] === "'") {
    let value = '';
    let j = i + 1;
    while (j < s.length) {
      if (s[j] === "'" && s[j + 1] === "'") {
        value += "'";
        j += 2;
      } else if (s[j] === "'") {
        j++;
        break;
      } else {
        value += s[j++];
      }
    }
    return { value, next: j };
  }
  if (s[i] === '(') {
    let j = i + 1;
    let combined = '';
    for (;;) {
      while (s[j] === ' ') j++;
      if (s[j] !== "'") throw new Error(`parseQuotedOrConcat: expected quote at ${j}: ${s.slice(i, i + 60)}`);
      const seg = parseQuotedOrConcat(s, j);
      combined += seg.value;
      j = seg.next;
      while (s[j] === ' ') j++;
      if (s[j] === ')') {
        j++;
        break;
      }
      const m = /^\|\|\s*chr\(59\)\s*\|\|/.exec(s.slice(j));
      if (!m) throw new Error(`parseQuotedOrConcat: expected "|| chr(59) ||" at ${j}: ${s.slice(j, j + 40)}`);
      combined += ';';
      j += m[0].length;
    }
    return { value: combined, next: j };
  }
  throw new Error(`parseQuotedOrConcat: expected "'" or "(" at ${i}: ${s.slice(i, i + 40)}`);
}

function parseTuple(tuple: string): Cell[] {
  const cells: Cell[] = [];
  let i = 0;
  while (i < tuple.length) {
    while (tuple[i] === ' ' || tuple[i] === ',') i++;
    if (i >= tuple.length) break;
    if (tuple[i] === "'" || tuple[i] === '(') {
      const { value, next } = parseQuotedOrConcat(tuple, i);
      i = next;
      if (tuple.startsWith('::', i)) i = tuple.indexOf(',', i) === -1 ? tuple.length : tuple.indexOf(',', i);
      cells.push(value);
    } else {
      const end = tuple.indexOf(',', i) === -1 ? tuple.length : tuple.indexOf(',', i);
      const raw = tuple.slice(i, end).trim();
      cells.push(raw === 'NULL' ? null : raw === 'true' ? true : raw === 'false' ? false : Number(raw));
      i = end;
    }
  }
  return cells;
}

function rows(table: string): Cell[][] {
  const out: Cell[][] = [];
  for (const line of SQL.split('\n')) {
    if (!line.startsWith(`INSERT INTO ${table} (`)) continue;
    const start = line.indexOf('VALUES (') + 'VALUES ('.length;
    const end = line.lastIndexOf(') ON CONFLICT');
    out.push(parseTuple(line.slice(start, end)));
  }
  return out;
}

// Existing rows are overwritten via `UPDATE <table> SET field = value, ... WHERE id = '<id>';`
// rather than DELETE+INSERT (see the generator and _existing_as_rows.py). This parses those
// statements too, by locating each known field's `field = ` marker in order and slicing the
// raw value out from between consecutive markers (robust to commas/quotes inside text values).
function parseSingleValue(raw: string): Cell {
  const s = raw.trim();
  if (s.startsWith("'") || s.startsWith('(')) {
    return parseQuotedOrConcat(s, 0).value;
  }
  const bare = s.endsWith(',') ? s.slice(0, -1).trim() : s;
  return bare === 'NULL' ? null : bare === 'true' ? true : bare === 'false' ? false : Number(bare);
}

function parseUpdates(table: string, fields: string[]): { id: string; cells: Record<string, Cell> }[] {
  const out: { id: string; cells: Record<string, Cell> }[] = [];
  for (const line of SQL.split('\n')) {
    if (!line.startsWith(`UPDATE ${table} SET `)) continue;
    const markerStarts: number[] = [];
    const valueStarts: number[] = [];
    let searchFrom = 0;
    for (const f of fields) {
      const marker = `${f} = `;
      const idx = line.indexOf(marker, searchFrom);
      if (idx === -1) throw new Error(`parseUpdates(${table}): missing field "${f}" in: ${line.slice(0, 80)}`);
      markerStarts.push(idx);
      valueStarts.push(idx + marker.length);
      searchFrom = idx + marker.length;
    }
    const whereIdx = line.indexOf(' WHERE id = ', searchFrom);
    if (whereIdx === -1) throw new Error(`parseUpdates(${table}): missing WHERE id in: ${line.slice(0, 80)}`);
    const idMatch = line.slice(whereIdx).match(/WHERE id = '([0-9a-fA-F-]+)'/);
    if (!idMatch) throw new Error(`parseUpdates(${table}): bad WHERE id in: ${line.slice(0, 80)}`);
    const cells: Record<string, Cell> = {};
    for (let fi = 0; fi < fields.length; fi++) {
      const regionEnd = fi + 1 < fields.length ? markerStarts[fi + 1] : whereIdx;
      cells[fields[fi].replace(/"/g, '')] = parseSingleValue(line.slice(valueStarts[fi], regionEnd));
    }
    out.push({ id: idMatch[1], cells });
  }
  return out;
}

interface Problem {
  id: string;
  topicId: string;
  curriculum: string;
  code: string;
  cite: string;
  number: number;
  text: string;
  figure: string | null;
  difficulty: number;
  type: string;
  answer: string;
  unit: string | null;
  unitRequired: boolean;
  tolerance: number | null;
  sign: boolean;
  explanation: string;
  points: number;
}

const insertedProblems: Problem[] = rows('problems').map((c) => ({
  id: c[0] as string,
  topicId: c[2] as string,
  curriculum: c[3] as string,
  code: c[4] as string,
  cite: c[5] as string,
  number: c[6] as number,
  text: c[8] as string,
  figure: c[9] as string | null,
  difficulty: c[10] as number,
  type: c[11] as string,
  answer: c[12] as string,
  unit: c[13] as string | null,
  unitRequired: c[14] as boolean,
  tolerance: c[15] as number | null,
  sign: c[16] as boolean,
  explanation: c[17] as string,
  points: c[18] as number,
}));

const PROBLEM_UPDATE_FIELDS = [
  'chapter_id', 'topic_id', 'curriculum_id', 'topic_code', 'syllabus_cite', 'problem_number',
  '"order"', 'question_text', 'question_image_url', 'difficulty_level', 'answer_type',
  'answer_correct', 'answer_unit', 'answer_unit_required', 'answer_tolerance',
  'answer_sign_sensitive', 'explanation', 'points',
];

const updatedProblems: Problem[] = parseUpdates('problems', PROBLEM_UPDATE_FIELDS).map(({ id, cells }) => ({
  id,
  topicId: cells.topic_id as string,
  curriculum: cells.curriculum_id as string,
  code: cells.topic_code as string,
  cite: cells.syllabus_cite as string,
  number: cells.problem_number as number,
  text: cells.question_text as string,
  figure: cells.question_image_url as string | null,
  difficulty: cells.difficulty_level as number,
  type: cells.answer_type as string,
  answer: cells.answer_correct as string,
  unit: cells.answer_unit as string | null,
  unitRequired: cells.answer_unit_required as boolean,
  tolerance: cells.answer_tolerance as number | null,
  sign: cells.answer_sign_sensitive as boolean,
  explanation: cells.explanation as string,
  points: cells.points as number,
}));

const problems: Problem[] = [...insertedProblems, ...updatedProblems];

const OPTION_UPDATE_FIELDS = ['problem_id', 'option_text', 'option_letter', 'is_correct', '"order"'];

const insertedOptions = rows('problem_options').map((c) => ({
  problem: c[1] as string,
  text: c[2] as string,
  letter: c[3] as string,
  correct: c[4] as boolean,
}));

const updatedOptions = parseUpdates('problem_options', OPTION_UPDATE_FIELDS).map(({ cells }) => ({
  problem: cells.problem_id as string,
  text: cells.option_text as string,
  letter: cells.option_letter as string,
  correct: cells.is_correct as boolean,
}));

const options = [...insertedOptions, ...updatedOptions];

const numeric = problems.filter((p) => p.type === 'numeric');
const mcqs = problems.filter((p) => p.type === 'multiple_choice');

const LESSONS = ['6.1', '6.2', '6.3'];

const G = 9.81;

/**
 * Every numeric answer worked out again here, independently of the generator,
 * straight from the numbers in the question text.
 */
const EXPECTED: Record<string, number> = {
  '6.1#2': 55 * 28,
  '6.1#3': 0.1e-3 * 7.0,
  '6.1#4': 46 / 20,
  '6.1#6': 0.05 / 25,
  '6.1#7': 0.057 * (30 + 22),
  '6.1#8': Math.abs(1200 * 15 - 9000 * 2.5),
  '6.1#10': Math.sqrt(2 * 0.16 * 72),
  '6.1#11': (0.45 * 20) / 5.0,
  '6.1#13': 9,
  '6.1#14': ((2.4 / 3.0) * 1.5) / 0.8,
  '6.1#15': 5.97e24 * ((2 * Math.PI * 1.5e11) / (365.25 * 86400)),
  '6.1#16': 0.05 * (Math.sqrt(2 * G * 1.8) + Math.sqrt(2 * G * 1.25)),
  '6.1#18': (0.15 - 0.2 * 0.6 + 0.3 * 0.4) / 0.5,
  '6.1#19': (3.0e4 ** 2 / (2 * 1500)) / 7500,
  '6.1#20': (12 ** 2) / (2 * 7.5),
  '6.2#2': (0.5 * 4) / 2.0,
  '6.2#3': (30000 * 2) / 50000,
  '6.2#4': (60 * 2.5) / 75,
  '6.2#6': (2 * 3) / 1.2 - 2,
  '6.2#7': (1200 * 20 - 1600 * 12) / 2800,
  '6.2#8': (0.3 * 5 - 0.3 * 1) / 0.2,
  '6.2#9': (2 * 6 + 2 * 2) / 4,
  '6.2#10': 12 / ((1.5 * 6) / 85),
  '6.2#12': (0.012 * 350) / 2.012,
  '6.2#13': (4 * 6) / 54,
  '6.2#14': (1000 * 18) / 3000,
  '6.2#15': ((0.6 / 1.5) * 0.5) / 0.025,
  '6.2#16': (0.8 * 0.75 + 0.8 * 0.15) / 0.45,
  '6.2#17': (40 * 3) / 50,
  '6.2#18': (55 * 4 + 65 * 3 - 65 * 6) / 55,
  '6.2#19': (3 * 5 * 8) / 80,
  '6.2#20': (Math.sqrt(2 * 6.5 * 9) * 2500) / 1100,
  '6.3#3': 0.5 * 2 * 9 - 0.5 * 3 * 4,
  '6.3#4': 7,
  '6.3#6': 5,
  '6.3#8': 50,
  '6.3#9': 2,
  '6.3#10': 0.5 * 0.01 * 300 ** 2 - 0.5 * 2.0 * 1.5 ** 2,
  '6.3#12': 0.5 * 0.5 * 1.2 ** 2 + 0.5 * 1.0 * 0.6 ** 2,
  '6.3#13': 4,
  '6.3#14': ((2 * 0.2) / 0.3) * 3,
  '6.3#15': 60,
  '6.3#17': 40,
  '6.3#18': (Math.sqrt(2 * G * 0.08) * 1.5) / 0.015,
  '6.3#19': (1 - (11 / 13) ** 2) * 100,
  '6.3#20': 9 * 1.2,
};

/** Wrong answers a student would reach through the named "Common mistake" — must not grade correct. */
const TRAPS: Record<string, number> = {
  '6.1#7': 0.057 * 8,
  '6.1#8': 1200 * 15 + 9000 * 2.5,
  '6.1#10': Math.sqrt(0.16 * 72),
  '6.1#13': 3,
  '6.1#14': 1.2,
  '6.2#2': 2.0 / 1.5,
  '6.2#3': 1.0,
  '6.2#6': 5.0,
  '6.2#7': (1200 * 20 + 1600 * 12) / 2800,
  '6.2#9': 2.0,
  '6.2#10': 12 / 6.0,
  '6.2#16': (0.8 * 0.75 - 0.8 * 0.15) / 0.45,
  '6.2#17': 3.0,
  '6.2#20': Math.sqrt(2 * 6.5 * 9),
  '6.3#3': 0.5 * 2 * 9 - 0.5 * 2 * 4,
  '6.3#4': 3,
  '6.3#6': 7,
  '6.3#9': 1,
  '6.3#15': 40,
  '6.3#17': 100 * (1 - Math.sqrt(1.2 / 2.0)),
  '6.3#18': Math.sqrt((2 * 1.5 * G * 0.08) / 0.015),
  '6.3#19': (1 - 11 / 13) * 100,
  '6.3#20': 1.2,
};

/** The 20 rows these lessons had before; every one must be reused in place, none orphaned. */
const PRE_EXISTING_IDS = [
  '0c5ab716-adef-45c9-8552-dce792d7c57f', '49b7f02b-4edc-4d85-bb9d-78e67c1461c9', 'c73f86c3-0b06-49b9-820c-de2d4b88efea',
  '81db1a0f-7046-4b02-8cf6-11b8622053d8', '4e0a0da9-4d86-4fab-b7a6-14336c22548e', '63c610b2-0197-4735-96d1-82a63aa4efbb',
  '1bd9e80f-574a-4f8d-b0ae-314f47aeb4a4', 'fc896940-00cb-471c-a03b-ee19dce109ed', 'dd5f8c99-8730-4418-b2b3-9243c737af4f',
  '46f89dd8-9b4b-4996-8c2a-4a22888055cf', 'ceacc00b-45f3-4fb6-9d0e-312d622d7fa7', '20a07229-d500-41da-8a4b-048d76d04726',
  'c5c1f907-6937-4293-9a88-5f2618ec0a32', 'd27334c0-2b90-478f-9932-8974e2a1e0d7', '813fbd8d-8f13-47e2-a168-f1db25c9f36e',
  'cd4ed4b8-4fd9-414e-b8cc-d0a8b223975f', '4b74f3fa-23a0-4cd7-b5e8-884edb38b15a', 'a0a3d99a-f564-48d7-b7c9-5331f9914e1c',
  '0a6db659-eca3-44af-bfda-fde05341be07', '21289c9c-721c-4376-a974-4352171631f3',
];
const PRE_EXISTING_MCQ = new Set([
  '63c610b2-0197-4735-96d1-82a63aa4efbb', 'ceacc00b-45f3-4fb6-9d0e-312d622d7fa7', '20a07229-d500-41da-8a4b-048d76d04726',
  'd27334c0-2b90-478f-9932-8974e2a1e0d7', '0a6db659-eca3-44af-bfda-fde05341be07', '21289c9c-721c-4376-a974-4352171631f3',
]);

function grade(p: Problem, input: string) {
  const spec = specFromProblem({
    answer_correct: p.answer,
    answer_unit: p.unit,
    answer_unit_required: p.unitRequired,
    answer_tolerance: p.tolerance,
    answer_sign_sensitive: p.sign,
  });
  if (!spec) throw new Error(`${p.code} #${p.number}: stored answer "${p.answer}" is not a number`);
  return gradeNumeric(input, spec);
}

function sigFigs(x: number, n: number): string {
  if (x === 0) return '0';
  return Number(x.toPrecision(n)).toString();
}

const key = (p: Problem) => `${p.code}#${p.number}`;

describe('AS Chapter 6 Momentum seed (6.1-6.3)', () => {
  it('seeds exactly 60 questions: 20 (Q1-Q20) in each of the three lessons', () => {
    expect(problems).toHaveLength(60);
    for (const code of LESSONS) {
      const own = problems.filter((p) => p.code === code);
      expect(own, code).toHaveLength(20);
      expect(own.map((p) => p.number).sort((a, b) => a - b), code).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
    }
    expect(new Set(problems.map((p) => p.id)).size).toBe(60);
  });

  it('reuses every pre-existing row in place, with the same answer type (no stray options)', () => {
    const updated = new Map(updatedProblems.map((p) => [p.id, p]));
    for (const id of PRE_EXISTING_IDS) {
      expect(updated.has(id), id).toBe(true);
      expect(updated.get(id)!.type, id).toBe(PRE_EXISTING_MCQ.has(id) ? 'multiple_choice' : 'numeric');
    }
    expect(updatedProblems).toHaveLength(20);
    expect(insertedProblems).toHaveLength(40);
  });

  it('puts every question in the AS curriculum bank of its own lesson', () => {
    expect(problems.every((p) => p.curriculum === 'as')).toBe(true);
    const topics: Record<string, string> = {
      '6.1': '196ffab0-6cca-4898-8909-a56000ff9fd7',
      '6.2': '42c67aa7-36ea-56ea-881a-771edd16371c',
      '6.3': 'ac47b348-a080-47b5-a3b9-a2a40915eb56',
    };
    for (const p of problems) expect(p.topicId, key(p)).toBe(topics[p.code]);
  });

  it('orders questions by tier and gives harder tiers more marks', () => {
    for (const p of problems) {
      const expected = p.number <= 6 ? 1 : p.number <= 13 ? 2 : p.number <= 18 ? 3 : 4;
      expect(p.difficulty, key(p)).toBe(expected);
      const [lo, hi] = [[1, 1], [2, 2], [3, 5], [5, 6]][expected - 1];
      expect(p.points, key(p)).toBeGreaterThanOrEqual(lo);
      expect(p.points, key(p)).toBeLessThanOrEqual(hi);
    }
  });

  it('resolves every promised figure, and most questions have one', () => {
    const missing = problems.filter((p) => p.figure && !getDiagram(p.figure)).map((p) => `${key(p)}: ${p.figure}`);
    expect(missing).toEqual([]);
    expect(problems.filter((p) => p.figure).length).toBeGreaterThanOrEqual(36);
  });

  it.each(Object.entries(MOMENTUM_BANK_DIAGRAMS))('figure %s renders to finite SVG with a viewBox', (name, node) => {
    const svg = toSvgMarkup(node);
    expect(svg, name).toMatch(/^<svg/);
    expect(svg, name).not.toMatch(/NaN|Infinity|undefined/);
    expect(svg, name).toMatch(/viewBox="0 0 [\d.]+ [\d.]+"/);
  });

  it('gives every multiple-choice question 4 options with exactly one correct, matching the stored answer', () => {
    for (const p of mcqs) {
      const own = options.filter((o) => o.problem === p.id);
      expect(own, key(p)).toHaveLength(4);
      expect(own.map((o) => o.letter).sort(), key(p)).toEqual(['A', 'B', 'C', 'D']);
      const correct = own.filter((o) => o.correct);
      expect(correct, key(p)).toHaveLength(1);
      expect(correct[0].text, key(p)).toBe(p.answer);
    }
  });

  it('does not always put the correct option in the same position', () => {
    const letters = mcqs.map((p) => options.find((o) => o.problem === p.id && o.correct)!.letter);
    for (const l of ['A', 'B', 'C', 'D']) expect(letters.filter((x) => x === l).length, l).toBeGreaterThanOrEqual(2);
  });

  it('cites the coursebook section for every question', () => {
    for (const p of problems) expect(p.cite, key(p)).toMatch(new RegExp(`^9702 coursebook ${p.code.replace('.', '\\.')} · `));
  });

  it('recomputes every numeric answer independently', () => {
    expect(Object.keys(EXPECTED).sort()).toEqual(numeric.map(key).sort());
    for (const p of numeric) {
      const want = EXPECTED[key(p)];
      expect(Math.abs(parseFloat(p.answer) - want) / Math.abs(want), `${key(p)}: ${p.answer} vs ${want}`).toBeLessThan(0.001);
    }
  });

  it.each(numeric.map((p) => [key(p), p] as const))('%s: the stored answer grades correct bare, with unit and at 2-3 s.f.', (_, p) => {
    const value = parseFloat(p.answer);
    expect(grade(p, p.answer).correct, 'bare').toBe(true);
    if (p.unit) expect(grade(p, `${p.answer} ${p.unit}`).correct, 'with unit').toBe(true);
    expect(grade(p, sigFigs(value, 3)).correct, '3sf').toBe(true);
    expect(grade(p, sigFigs(value, 2)).correct, '2sf').toBe(true);
    expect(grade(p, String(value * 1.2)).correct, '+20%').toBe(false);
    expect(grade(p, String(value * 0.8)).correct, '-20%').toBe(false);
    if (p.sign) expect(grade(p, String(-value)).correct, 'wrong sign').toBe(false);
  });

  it.each(Object.entries(TRAPS))('%s: the common-mistake answer is marked wrong', (k, wrong) => {
    const p = numeric.find((x) => key(x) === k)!;
    expect(p, k).toBeDefined();
    expect(grade(p, sigFigs(wrong, 3)).correct).toBe(false);
  });

  it('accepts a mass typed in grams for the kilogram answers', () => {
    const hail = numeric.find((p) => key(p) === '6.1#6')!;
    expect(grade(hail, '2.0 g').correct).toBe(true);
    expect(grade(hail, '2.0 kg').correct).toBe(false);
  });

  it('never duplicates question text within a lesson, and every explanation names a common mistake', () => {
    for (const code of LESSONS) {
      const texts = problems.filter((p) => p.code === code).map((p) => p.text);
      expect(new Set(texts).size, code).toBe(texts.length);
    }
    expect(problems.filter((p) => !/Common mistake:/.test(p.explanation)).map(key)).toEqual([]);
  });

  it('contains no literal \\u escapes', () => {
    expect(SQL).not.toMatch(/\\u[0-9a-fA-F]{4}/);
  });
});
