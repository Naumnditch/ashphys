import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { gradeNumeric, specFromProblem } from '@/lib/grading/numericAnswer';
import { getDiagram } from '@/components/practice/MomentumDiagrams';

/**
 * The Circular Motion & Gravitation Challenge Set seed (IGCSE 0625 ch. 16–17),
 * checked as applied: the generated SQL run through the real grader. 10 new
 * questions go into each of the two shared lessons, in both curriculum banks.
 */

const SQL = readFileSync(
  path.resolve(__dirname, '../../../database/seeds/2026-10-06-circular-gravitation-challenge.sql'),
  'utf8'
);

type Cell = string | number | boolean | null;

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

const CIRC = 'db2c98d5-dd86-5faf-9121-5533bdd5d212';
const GRAV = '1585a36a-5b5c-5505-abe3-98e37e28c48b';

interface Problem {
  id: string;
  topic: string;
  curriculum: string;
  number: number;
  text: string;
  figure: string | null;
  difficulty: number;
  answer: string;
  unit: string | null;
  tolerance: number | null;
  explanation: string;
}

const problems: Problem[] = SQL.split('\n')
  .filter((l) => l.startsWith('INSERT INTO problems ('))
  .map((line) => {
    const start = line.indexOf('VALUES (') + 'VALUES ('.length;
    const c = parseTuple(line.slice(start, line.lastIndexOf(') ON CONFLICT')));
    return {
      id: c[0] as string,
      topic: c[2] as string,
      curriculum: c[3] as string,
      number: c[6] as number,
      text: c[8] as string,
      figure: c[9] as string | null,
      difficulty: c[10] as number,
      answer: c[12] as string,
      unit: c[13] as string | null,
      tolerance: c[14] as number | null,
      explanation: c[16] as string,
    };
  });

function grade(p: Problem, input: string) {
  const spec = specFromProblem({
    answer_correct: p.answer,
    answer_unit: p.unit,
    answer_tolerance: p.tolerance,
    answer_sign_sensitive: false,
  });
  if (!spec) throw new Error(`#${p.number}: stored answer ${p.answer} is not a number`);
  return gradeNumeric(input, spec);
}

const sig = (x: number, n: number) => Number(x.toPrecision(n)).toString();
const bank = (topic: string, curriculum: string) => problems.filter((p) => p.topic === topic && p.curriculum === curriculum);

describe('Circular Motion & Gravitation challenge set seed', () => {
  it('adds 10 questions to each lesson in each curriculum bank (40 rows)', () => {
    expect(problems).toHaveLength(40);
    expect(new Set(problems.map((p) => p.id)).size).toBe(40);
    for (const topic of [CIRC, GRAV]) for (const cur of ['igcse', 'a-level']) expect(bank(topic, cur)).toHaveLength(10);
  });

  it('numbers them after the existing banks: circular motion 36–45 / 46–55, gravitation 8–17 / 23–32', () => {
    const range = (a: number, b: number) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
    expect(bank(CIRC, 'igcse').map((p) => p.number)).toEqual(range(36, 45));
    expect(bank(CIRC, 'a-level').map((p) => p.number)).toEqual(range(46, 55));
    expect(bank(GRAV, 'igcse').map((p) => p.number)).toEqual(range(8, 17));
    expect(bank(GRAV, 'a-level').map((p) => p.number)).toEqual(range(23, 32));
  });

  it('keeps the five extension questions of each lesson in rising difficulty', () => {
    for (const topic of [CIRC, GRAV]) {
      const d = bank(topic, 'a-level').slice(5).map((p) => p.difficulty);
      expect(d).toEqual([...d].sort((a, b) => a - b));
      expect(d[4]).toBe(5);
    }
  });

  it('draws every figure it promises', () => {
    expect(problems.filter((p) => p.figure && !getDiagram(p.figure)).map((p) => p.figure)).toEqual([]);
  });

  it('matches the printed answer key of the challenge set', () => {
    const KEY: Array<[string, number, string]> = [
      [CIRC, 1, '35 N'],
      [CIRC, 2, '13 m/s'],
      [CIRC, 3, '4.4 m/s²'],
      [CIRC, 4, '10 N'],
      [CIRC, 5, '1.9 s'],
      [GRAV, 1, '187 N'],
      [GRAV, 2, '96.6 min'],
      [GRAV, 3, '3.59 × 10^7 m'],
      [GRAV, 4, '16 h'],
      [GRAV, 5, '3.46 × 10^8 m'],
    ];
    for (const [topic, seq, typed] of KEY) {
      for (const cur of ['igcse', 'a-level']) {
        const p = bank(topic, cur)[seq - 1];
        expect(grade(p, typed).correct, `${cur} #${p.number}: ${typed}`).toBe(true);
      }
    }
  });

  it.each(problems.map((p) => [`${p.curriculum} #${p.number}`, p] as const))('%s: the stored answer grades correct', (_, p) => {
    const value = Number(p.answer);
    expect(grade(p, p.answer).correct).toBe(true);
    if (p.unit) expect(grade(p, `${p.answer} ${p.unit}`).correct).toBe(true);
    expect(grade(p, sig(value, 3)).correct).toBe(true);
    expect(grade(p, String(value * 1.1)).correct).toBe(false);
    expect(grade(p, String(value * 0.9)).correct).toBe(false);
  });
});
