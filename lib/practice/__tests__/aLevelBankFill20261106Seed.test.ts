import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { gradeNumeric, specFromProblem } from '@/lib/grading/numericAnswer';

/**
 * The 2026-11-06 A Level bank fill, checked exactly as it is applied: every
 * generated SQL file under database/seeds/2026-11-06-a-level-banks/sql is
 * parsed and every numeric answer is run through the real grader — the stored
 * key, the answer as the mark scheme states it (2–3 s.f.), and the same with a
 * unit must all be marked right; 10 % off (and the wrong sign, where direction
 * matters) must be marked wrong. Every multiple-choice question must have four
 * options with exactly one correct, matching answer_correct. Nothing may touch
 * a Chapter 22 lesson.
 */

const DIR = path.resolve(__dirname, '../../../database/seeds/2026-11-06-a-level-banks/sql');
const FILES = readdirSync(DIR).filter((f) => f.endsWith('.sql')).sort();
const CH22_TOPICS = new Set(
  (JSON.parse(readFileSync(path.resolve(DIR, '../lessons.json'), 'utf8')) as { code: string; topic: string }[])
    .filter((l) => l.code.startsWith('22.'))
    .map((l) => l.topic),
);

type Cell = string | number | boolean | null | string[];

function parseTuple(t: string): Cell[] {
  const cells: Cell[] = [];
  let i = 0;
  const readString = (): string => {
    let v = '';
    i++; // opening quote
    while (i < t.length) {
      if (t[i] === "'" && t[i + 1] === "'") { v += "'"; i += 2; }
      else if (t[i] === "'") { i++; break; }
      else v += t[i++];
    }
    return v;
  };
  while (i < t.length) {
    while (t[i] === ' ' || t[i] === ',') i++;
    if (i >= t.length) break;
    if (t[i] === "'") {
      const v = readString();
      if (t.startsWith('::', i)) while (i < t.length && t[i] !== ',') i++;
      cells.push(v);
    } else if (t.startsWith('ARRAY[', i)) {
      i += 6;
      const arr: string[] = [];
      while (t[i] !== ']') {
        while (t[i] === ' ' || t[i] === ',') i++;
        if (t[i] === "'") arr.push(readString());
      }
      i++;
      if (t.startsWith('::text[]', i)) i += 8;
      cells.push(arr);
    } else {
      let end = t.indexOf(',', i);
      if (end === -1) end = t.length;
      const raw = t.slice(i, end).trim();
      cells.push(raw === 'NULL' ? null : raw === 'true' ? true : raw === 'false' ? false : Number(raw));
      i = end;
    }
  }
  return cells;
}

function tuples(sql: string, table: string): Cell[][] {
  const out: Cell[][] = [];
  let inside = false;
  for (const line of sql.split('\n')) {
    if (line.startsWith(`INSERT INTO ${table} (`)) { inside = true; continue; }
    if (!inside) continue;
    if (line.startsWith('ON CONFLICT')) { inside = false; continue; }
    if (!line.startsWith('(')) continue;
    const body = line.replace(/,$/, '');
    out.push(parseTuple(body.slice(1, body.lastIndexOf(')'))));
  }
  return out;
}

for (const file of FILES) {
  const sql = readFileSync(path.join(DIR, file), 'utf8');
  const key = JSON.parse(readFileSync(path.join(DIR, file.replace(/\.sql$/, '.key.json')), 'utf8')) as {
    id: string; shown: string; stated: string; sign: boolean; value: number;
  }[];
  const problems = tuples(sql, 'problems');
  const options = tuples(sql, 'problem_options');
  const byId = new Map(problems.map((p) => [p[0] as string, p]));

  describe(`A Level bank fill ${file}`, () => {
    it('parses, is A Level only, and never touches Chapter 22', () => {
      expect(problems.length).toBeGreaterThan(0);
      for (const p of problems) {
        expect(p[3]).toBe('a-level');
        expect(CH22_TOPICS.has(p[2] as string)).toBe(false);
        expect(String(p[4]).startsWith('22.')).toBe(false);
        expect([1, 2, 3]).toContain(p[10]);
        expect(p[19]).toBeGreaterThanOrEqual(1);
        expect(String(p[18])).toContain('Mark scheme (');
      }
    });

    it('every numeric answer grades correct as stored and as the mark scheme states it, and wrong when 10 % off', () => {
      const numeric = problems.filter((p) => p[11] === 'numeric');
      expect(key.length).toBe(numeric.length);
      for (const k of key) {
        const p = byId.get(k.id)!;
        expect(p, k.id).toBeTruthy();
        const spec = specFromProblem({
          answer_correct: p[12] as string,
          answer_unit: p[13] as string | null,
          answer_unit_required: p[14] as boolean,
          answer_tolerance: p[15] as number | null,
          answer_sign_sensitive: p[16] as boolean,
          answer_alternates: (p[17] as string[] | null) ?? null,
        });
        expect(spec, `${k.id} answer ${p[12]}`).not.toBeNull();
        const stated = k.stated.replace(/−/g, '-').replace(/ × 10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)/, (_, e) => 'e' + [...e].map((c: string) => '⁻⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c) === 0 ? '-' : String('⁻⁰¹²³⁴⁵⁶⁷⁸⁹'.indexOf(c) - 1)).join(''));
        const number = stated.split(' ')[0];
        expect(gradeNumeric(String(p[12]), spec!).correct, `${k.id} stored ${p[12]}`).toBe(true);
        expect(gradeNumeric(number, spec!).correct, `${k.id} stated "${number}" vs ${p[12]}`).toBe(true);
        const off = Number(String(p[12]).split(' ')[0]) * 1.1;
        expect(gradeNumeric(String(off), spec!).correct, `${k.id} 10% off`).toBe(false);
        if (k.sign && k.value !== 0) {
          expect(gradeNumeric(String(-Number(String(p[12]).split(' ')[0])), spec!).correct, `${k.id} sign flip`).toBe(false);
        }
      }
    });

    it('every multiple-choice question has four options, exactly one correct, matching answer_correct', () => {
      const byProblem = new Map<string, Cell[][]>();
      for (const o of options) {
        const list = byProblem.get(o[1] as string) ?? [];
        list.push(o);
        byProblem.set(o[1] as string, list);
      }
      for (const p of problems.filter((q) => q[11] === 'multiple_choice')) {
        const opts = byProblem.get(p[0] as string) ?? [];
        expect(opts.length, p[0] as string).toBe(4);
        const right = opts.filter((o) => o[4] === true);
        expect(right.length).toBe(1);
        expect(right[0][2]).toBe(p[12]);
        expect(new Set(opts.map((o) => o[3]))).toEqual(new Set(['A', 'B', 'C', 'D']));
      }
    });
  });
}
