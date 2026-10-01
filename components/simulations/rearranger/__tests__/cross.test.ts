/**
 * Cross-multiplication: when the variable being solved for is in a
 * denominator and the other side is a single product, the two simply swap
 * places (F = GMm/r²  →  r² = GMm/F) in one move, not "× r²" then "÷ F".
 * Checks the shortcut is taken when it should be, never when it should not,
 * that every result is still a correct rearrangement, and that the stage can
 * match every moving token between the before and after equations.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { loadTexEngine, type TexEngine } from '@/lib/manim/tex';
import { crossKeyMap, EQUATIONS, evalSide, isolateSteps, mirror, type EqState, type EquationDef, type Side } from '../algebra';
import { equationTex, glyphKeys } from '../texFromState';
import { cancelCaption, operateCaption } from '../captions';

let tex: TexEngine;
beforeAll(async () => {
  tex = await loadTexEngine();
});

const eqById = (id: string) => EQUATIONS.find((e) => e.id === id)!;

/**
 * Plugs a derived answer back into the ORIGINAL equation: give every variable
 * a distinct positive number, compute the target from `answer`, put that back
 * in, and both sides of the original must balance. Independent of the bank's
 * sample numbers.
 */
function balances(eq: EquationDef, target: string, answer: Side): number {
  const values: Record<string, number> = {};
  eq.vars.forEach((v, i) => (values[v.symbol] = 1.3 + 0.8 * i));
  values[target] = evalSide(answer, values);
  const l = evalSide(eq.initial.left, values);
  const r = evalSide(eq.initial.right, values);
  return Math.abs(l - r) / Math.max(Math.abs(l), Math.abs(r));
}

function tokensOf(state: EqState) {
  const tagged = equationTex(state);
  return new Set(glyphKeys(tex.layout(tagged.tex), tagged.tokens).map((k) => k.token));
}

describe('cross-multiplication shortcut', () => {
  it('F = GMm/r²: solving for r takes cross-multiply then a root, not three moves', () => {
    const { moves, finalIsLeft } = isolateSteps(eqById('gravitation').initial, 'r');
    expect(moves.map((m) => m.kind)).toEqual(['cross', 'root']);
    expect(finalIsLeft).toBe(true);
  });

  it('density, power, capacitance: the denominator variable is one cross-multiply', () => {
    for (const [id, target] of [['rhomv', 'V'], ['pet', 't'], ['capacitance', 'V'], ['p_v2r', 'R'], ['platecap', 'd']] as const) {
      const { moves, finalIsLeft } = isolateSteps(eqById(id).initial, target);
      expect(moves.map((m) => m.kind), `${id} ${target}`).toEqual(['cross']);
      expect(finalIsLeft, `${id} ${target}`).toBe(true);
    }
  });

  it('works with the equation mirrored (answer lands on the right, then the sides swap)', () => {
    const { moves, finalIsLeft } = isolateSteps(mirror(eqById('pet').initial), 't');
    expect(moves.map((m) => m.kind)).toEqual(['cross']);
    expect(finalIsLeft).toBe(false);
  });

  it('is not used when it does not apply', () => {
    // Target is not in a denominator.
    expect(isolateSteps(eqById('fma').initial, 'a').moves.every((m) => m.kind !== 'cross')).toBe(true);
    expect(isolateSteps(eqById('gravitation').initial, 'M').moves.every((m) => m.kind !== 'cross')).toBe(true);
    // The other side has its own denominator (a proportion), so the plain moves still apply.
    expect(isolateSteps(eqById('transformer').initial, 'V₂').moves.every((m) => m.kind !== 'cross')).toBe(true);
  });

  it('pendulum: g is under a root, so it is divided by 2π and squared first, then cross-multiplied', () => {
    const { moves, finalIsLeft } = isolateSteps(eqById('pendulum').initial, 'g');
    expect(moves.map((m) => m.kind)).toEqual(['multiplicative', 'square', 'cross']);
    expect(finalIsLeft).toBe(true);
  });

  it('every rearrangement it produces is still correct, for every equation, variable and orientation', () => {
    let crosses = 0;
    for (const eq of EQUATIONS) {
      for (const v of eq.vars) {
        for (const start of [eq.initial, mirror(eq.initial)]) {
          const { moves, finalIsLeft } = isolateSteps(start, v.symbol);
          if (moves.some((m) => m.kind === 'cross')) crosses++;
          const last = moves.length ? moves[moves.length - 1].stateAfter : start;
          const answer = finalIsLeft ? last.right : last.left;
          const alone = finalIsLeft ? last.left : last.right;
          // The isolated side is exactly the bare variable...
          expect(alone.denom.length, `${eq.id} ${v.symbol}`).toBe(0);
          expect(alone.groups.length, `${eq.id} ${v.symbol}`).toBe(1);
          expect(alone.groups[0].factors.length, `${eq.id} ${v.symbol}`).toBe(1);
          // ...and the other side, put back into the original equation, balances it.
          expect(balances(eq, v.symbol, answer), `${eq.id} solving ${v.symbol}`).toBeLessThan(1e-9);
        }
      }
    }
    expect(crosses).toBeGreaterThan(0);
  });

  it('chained solves stay correct (solve for one variable, then another from that result)', () => {
    for (const eq of EQUATIONS) {
      for (const first of eq.vars) {
        const a = isolateSteps(eq.initial, first.symbol);
        const lastA = a.moves.length ? a.moves[a.moves.length - 1].stateAfter : eq.initial;
        const from = a.finalIsLeft ? lastA : mirror(lastA);
        for (const second of eq.vars) {
          if (second.symbol === first.symbol) continue;
          const b = isolateSteps(from, second.symbol);
          const lastB = b.moves.length ? b.moves[b.moves.length - 1].stateAfter : from;
          const answer = b.finalIsLeft ? lastB.right : lastB.left;
          expect(balances(eq, second.symbol, answer), `${eq.id}: ${first.symbol} then ${second.symbol}`).toBeLessThan(1e-9);
        }
      }
    }
  });

  it('the stage can match every swapped token between the before and after equations, and the captions typeset', () => {
    let checked = 0;
    for (const eq of EQUATIONS) {
      for (const v of eq.vars) {
        for (const start of [eq.initial, mirror(eq.initial)]) {
          const { moves } = isolateSteps(start, v.symbol);
          let before = start;
          for (const move of moves) {
            if (move.kind === 'cross') {
              const map = crossKeyMap(move);
              expect(map.size).toBeGreaterThanOrEqual(2);
              const fromTokens = tokensOf(before);
              const toTokens = tokensOf(move.stateAfter);
              for (const [from, to] of map) {
                if (from.endsWith('-open') || from.endsWith('-close')) continue;
                expect(fromTokens.has(from), `${eq.id} ${v.symbol}: ${from} missing before`).toBe(true);
                expect(toTokens.has(to), `${eq.id} ${v.symbol}: ${to} missing after`).toBe(true);
              }
              tex.layout(operateCaption(move).tex);
              const why = cancelCaption(move, v.symbol, v.symbol);
              expect(why).not.toBeNull();
              tex.layout(why!.tex);
              checked++;
            }
            before = move.stateAfter;
          }
        }
      }
    }
    expect(checked).toBeGreaterThan(0);
  });
});
