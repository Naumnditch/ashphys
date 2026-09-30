import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { gradeNumeric, specFromProblem } from '@/lib/grading/numericAnswer';
import { getDiagram } from '@/components/practice/MomentumDiagrams';

/**
 * Checks the A Level circular motion and gravitation banks exactly as they are
 * applied: the generated SQL, run through the real grader. Every stored answer
 * must grade correct typed bare, with its unit and rounded the way a student
 * would write it, a wrong value must not, and the answers printed in the
 * owner's worksheet keys must be accepted wherever they are right.
 */

const SQL = readFileSync(
  path.resolve(__dirname, '../../../database/seeds/2026-09-30-a-level-circular-gravitation.sql'),
  'utf8'
);

type Cell = string | number | boolean | null;

/** Splits one VALUES (...) tuple into cells: quoted strings (with '' escapes), NULL, booleans, numbers. */
function parseTuple(tuple: string): Cell[] {
  const cells: Cell[] = [];
  let i = 0;
  while (i < tuple.length) {
    while (tuple[i] === ' ' || tuple[i] === ',') i++;
    if (i >= tuple.length) break;
    if (tuple[i] === "'") {
      let value = '';
      i++;
      while (i < tuple.length) {
        if (tuple[i] === "'" && tuple[i + 1] === "'") {
          value += "'";
          i += 2;
        } else if (tuple[i] === "'") {
          i++;
          break;
        } else {
          value += tuple[i++];
        }
      }
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

interface Problem {
  id: string;
  topic: string;
  code: string;
  number: number;
  text: string;
  figure: string | null;
  type: string;
  answer: string;
  unit: string | null;
  tolerance: number | null;
  sign: boolean;
}

const problems: Problem[] = rows('problems').map((c) => ({
  id: c[0] as string,
  topic: c[2] as string,
  code: c[4] as string,
  number: c[6] as number,
  text: c[8] as string,
  figure: c[9] as string | null,
  type: c[11] as string,
  answer: c[12] as string,
  unit: c[13] as string | null,
  tolerance: c[14] as number | null,
  sign: c[15] as boolean,
}));
const options = rows('problem_options').map((c) => ({ problem: c[1] as string, text: c[2] as string, correct: c[4] as boolean }));
const numeric = problems.filter((p) => p.type === 'numeric');

function grade(p: Problem, input: string) {
  const spec = specFromProblem({
    answer_correct: p.answer,
    answer_unit: p.unit,
    answer_tolerance: p.tolerance,
    answer_sign_sensitive: p.sign,
  });
  if (!spec) throw new Error(`${p.code} #${p.number}: stored answer ${p.answer} is not a number`);
  return gradeNumeric(input, spec);
}

function sigFigs(x: number, n: number): string {
  return Number(x.toPrecision(n)).toString();
}

describe('A Level circular motion and gravitation seed', () => {
  it('seeds all 99 questions into the six unit 12–13 lessons', () => {
    expect(problems).toHaveLength(99);
    const perLesson = Object.fromEntries(['12.1', '12.2', '13.1', '13.2', '13.3', '13.4'].map((c) => [c, problems.filter((p) => p.code === c).length]));
    expect(perLesson).toEqual({ '12.1': 9, '12.2': 45, '13.1': 5, '13.2': 22, '13.3': 5, '13.4': 13 });
    expect(new Set(problems.map((p) => p.id)).size).toBe(99);
    for (const code of Object.keys(perLesson)) {
      const numbers = problems.filter((p) => p.code === code).map((p) => p.number);
      expect(numbers).toEqual(numbers.map((_, i) => i + 1));
    }
  });

  it('puts every question in the A Level bank', () => {
    expect(SQL.match(/, 'a-level', '1[23]\.\d', '9702 /g)).toHaveLength(99);
  });

  it('draws a figure for every question that promises one', () => {
    const missing = problems.filter((p) => p.figure && !getDiagram(p.figure)).map((p) => p.figure);
    expect(missing).toEqual([]);
    expect(problems.filter((p) => p.figure).length).toBeGreaterThan(70);
  });

  it('gives every multiple-choice question four options with exactly one right, not always in the same place', () => {
    const mcqs = problems.filter((p) => p.type === 'multiple_choice');
    const slots = new Set<number>();
    for (const p of mcqs) {
      const own = options.filter((o) => o.problem === p.id);
      expect(own, `${p.code} #${p.number}`).toHaveLength(4);
      expect(own.filter((o) => o.correct), `${p.code} #${p.number}`).toHaveLength(1);
      const right = own.findIndex((o) => o.correct);
      expect(own[right].text).toBe(p.answer);
      slots.add(right);
    }
    expect(slots.size).toBe(4);
  });

  it.each(numeric.map((p) => [`${p.code} #${p.number}`, p] as const))('%s: the stored answer grades correct', (_, p) => {
    const value = Number(p.answer);
    expect(grade(p, p.answer).correct).toBe(true);
    if (p.unit) expect(grade(p, `${p.answer} ${p.unit}`).correct).toBe(true);
    expect(grade(p, sigFigs(value, 3)).correct).toBe(true);
    expect(grade(p, sigFigs(value, 2)).correct).toBe(true);
    expect(grade(p, String(value * 1.1)).correct).toBe(false);
    expect(grade(p, String(value * 0.9)).correct).toBe(false);
    if (p.sign) expect(grade(p, String(-value)).correct).toBe(false);
  });

  // The answers as the owner's worksheet keys print them (2–3 s.f., g = 9.8).
  const KEY: Array<[string, number, string]> = [
    ['12.1', 3, '180 m/s'],
    ['12.2', 5, '13.2 N'],
    ['12.2', 6, '1.35 kg'],
    ['12.2', 7, '2.04'],
    ['12.2', 8, '0.21'],
    ['12.2', 10, '17 N'],
    ['12.2', 11, '50 N'],
    ['12.2', 13, '2.7 m/s'],
    ['12.2', 16, '6°'],
    ['12.2', 17, '2.5 s'],
    ['12.2', 19, '3.42e3'],
    ['12.2', 24, '3.43'],
    ['12.2', 25, '34.9'],
    ['12.2', 27, '18.0 N'],
    ['13.2', 2, '4.2 x 10^-7 N'],
    ['13.2', 3, '6750'],
    ['13.2', 5, '2200 m/s'],
    ['13.2', 6, '32500 s'],
    ['13.2', 9, '4.2 × 10^7 m'],
    ['13.2', 10, '3070'],
    ['13.2', 14, '3.07 × 10³'],
    ['13.3', 3, '1.62'],
    ['13.4', 4, '-2.35e10'],
    ['13.4', 5, '-1.17e10'],
    ['13.4', 7, '5.7e10 J'],
    ['13.4', 8, '2550'],
    ['13.4', 9, '1.5 × 10^24'],
    ['13.4', 11, '1.1e4'],
  ];

  it.each(KEY)('%s #%i accepts the worksheet key’s %s', (code, number, typed) => {
    const p = numeric.find((q) => q.code === code && q.number === number)!;
    expect(p, `${code} #${number}`).toBeDefined();
    expect(grade(p, typed).correct).toBe(true);
  });

  it('marks the unsigned key answer for the orbit change as the wrong sign, not correct', () => {
    const p = numeric.find((q) => q.code === '13.4' && q.number === 13)!;
    const result = grade(p, '5.72e9 J');
    expect(result.correct).toBe(false);
    expect(result.feedback).toMatch(/sign/);
    expect(grade(p, '-5.72e9 J').correct).toBe(true);
  });
});
