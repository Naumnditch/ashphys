import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import katex from 'katex';
import { findSection } from '@/lib/curricula';
import {
  CHEAT_SHEETS,
  SECTION_ORDER,
  cheatSheetFor,
  cheatSheetsFor,
  getCheatSheet,
  isALevelOnly,
  lessonsWithCheatSheets,
  sectionLength,
  sheetPages,
  syllabusReference,
} from '..';
import { arcPath, arrowHead, labelRuns, renderDiagram, rolesUsed } from '../diagram';
import { angleOf, unit } from '../draw';
import { PDF_MANIFEST, pdfHrefs } from '../pdfFiles';
import { igcseCircularMotion as igcse } from '../sheets/igcse-circular-motion';
import { aLevelCircularMotion as alevel } from '../sheets/a-level-circular-motion';
import type { CheatSheet, Diagram, DiagramShape, Point } from '../types';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const g = 9.81;
const deg = (d: number) => (d * Math.PI) / 180;

type Arrow = Extract<DiagramShape, { kind: 'arrow' }>;
const arrows = (d: Diagram) => d.shapes.filter((s): s is Arrow => s.kind === 'arrow');
const fig = (sheet: CheatSheet, id: string) => sheet.diagrams.find((d) => d.id === id)!;
const vec = (a: Arrow): Point => [a.to[0] - a.from[0], a.to[1] - a.from[1]];
const cosBetween = (u: Point, v: Point) => (u[0] * v[0] + u[1] * v[1]) / (Math.hypot(...u) * Math.hypot(...v));

/** Every LaTeX string on a sheet, display and inline. */
function allLatex(sheet: CheatSheet): string[] {
  const inline = (t: string) => Array.from(t.matchAll(/\$([^$]+)\$/g), (m) => m[1]);
  const texts = [
    ...sheet.explanation.paragraphs,
    ...sheet.explanation.keyTerms.flatMap((k) => [k.term, k.text]),
    ...sheet.derivations.flatMap((d) => [d.setup, ...d.steps.map((s) => s.text ?? '')]),
    ...sheet.samples.flatMap((s) => [s.question, s.answer, ...s.steps.map((st) => st.text)]),
    ...sheet.practice.flatMap((p) => [p.question, p.answer]),
    ...sheet.diagrams.map((d) => d.caption),
  ];
  return [
    ...texts.flatMap(inline),
    ...sheet.derivations.flatMap((d) => [d.result, ...d.steps.map((s) => s.latex ?? '')]),
    ...sheet.equations.map((e) => e.latex),
    ...sheet.symbols.flatMap((s) => [s.symbol, s.unit ?? '']),
    ...sheet.samples.flatMap((s) => [s.unitCheck ?? '', ...s.steps.map((st) => st.latex ?? '')]),
  ].filter(Boolean);
}

/** Every point a shape occupies, for the viewBox check. */
function shapePoints(s: DiagramShape): Point[] {
  switch (s.kind) {
    case 'arc': {
      const pts: Point[] = [];
      for (let a = s.from; s.to > s.from ? a <= s.to : a >= s.to; a += s.to > s.from ? 5 : -5) {
        pts.push([s.centre[0] + s.radius * Math.cos(deg(a)), s.centre[1] - s.radius * Math.sin(deg(a))]);
      }
      return pts;
    }
    case 'circle':
      return [
        [s.centre[0] - s.radius, s.centre[1] - s.radius],
        [s.centre[0] + s.radius, s.centre[1] + s.radius],
      ];
    case 'ellipse':
      return [
        [s.centre[0] - s.rx, s.centre[1] - s.ry],
        [s.centre[0] + s.rx, s.centre[1] + s.ry],
      ];
    case 'line':
    case 'arrow':
    case 'surface':
      return [s.from, s.to];
    case 'polygon':
      return s.points;
    case 'dot':
    case 'label':
    case 'rightAngle':
    case 'cross':
      return [s.at];
  }
}

describe('cheat sheet registry', () => {
  it('has unique slugs and one sheet per lesson per curriculum', () => {
    const slugs = CHEAT_SHEETS.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const c of ['igcse', 'as', 'a-level', 'ib'] as const) {
      const ids = lessonsWithCheatSheets(c);
      expect(new Set(ids).size, c).toBe(ids.length);
    }
  });

  it('finds sheets by slug, lesson and curriculum', () => {
    expect(getCheatSheet('igcse-circular-motion')).toBe(igcse);
    expect(getCheatSheet('a-level-circular-motion')).toBe(alevel);
    expect(cheatSheetFor(igcse.topicId, 'igcse')).toBe(igcse);
    // The same shared lesson gets each curriculum's own sheet.
    expect(cheatSheetFor(igcse.topicId, 'a-level')).toBe(alevel);
    expect(cheatSheetFor(igcse.topicId, 'ib')).toBeUndefined();
    // The A Level sheet also covers the other Chapter 16 lessons, in A Level only.
    expect(cheatSheetFor('744a91d7-6b75-4fd2-b3c7-17689e965446', 'a-level')).toBe(alevel);
    expect(cheatSheetFor('0245e29c-acd6-5c5f-b1b3-bf9431a0fa6b', 'ib')).toBeUndefined();
    expect(cheatSheetsFor('as')).toEqual([]);
    expect(getCheatSheet('nope')).toBeUndefined();
  });

  it('labels the syllabus the way each curriculum is examined', () => {
    const base = { chapter: { number: 16, title: 'Circular motion' }, syllabusSections: ['12.1'] };
    expect(syllabusReference(igcse)).toBe('0625 Ch.3');
    expect(syllabusReference(alevel)).toBe('9702 A Level Ch.16');
    expect(syllabusReference({ ...base, curriculumId: 'as', chapter: { number: 5, title: '' } })).toBe('9702 AS Ch.5');
    expect(syllabusReference({ ...base, curriculumId: 'ib', syllabusSections: ['A.2'] })).toBe('IB A.2');
  });

  it('marks A Level chapters 16+ as A Level only, and nothing else', () => {
    expect(isALevelOnly(alevel)).toBe(true);
    expect(isALevelOnly(igcse)).toBe(false);
    expect(isALevelOnly({ curriculumId: 'a-level', chapter: { number: 3, title: '' } })).toBe(false);
  });
});

describe.each(CHEAT_SHEETS.map((s) => [s.slug, s] as const))('sheet %s', (_slug, sheet) => {
  it('has every section of the format', () => {
    expect(sheet.topicId).toMatch(UUID);
    for (const id of sheet.alsoCovers ?? []) expect(id).toMatch(UUID);
    expect(sheet.explanation.paragraphs.length).toBeGreaterThanOrEqual(2);
    expect(sheet.explanation.keyTerms.length).toBeGreaterThanOrEqual(1);
    expect(sheet.derivations.length).toBeGreaterThanOrEqual(1);
    expect(sheet.equations.length).toBeGreaterThanOrEqual(3);
    expect(sheet.samples.length).toBeGreaterThanOrEqual(2);
    expect(sheet.practice.length).toBeGreaterThanOrEqual(4);
    expect(sheet.other.mistakes.length).toBeGreaterThanOrEqual(3);
    expect(sheet.other.mistakes.length).toBeLessThanOrEqual(5);
    expect(sheet.other.tips.length).toBeGreaterThanOrEqual(1);
    expect(sheet.other.syllabus.length).toBeGreaterThanOrEqual(1);
    for (const d of sheet.derivations) expect(d.steps.length, d.id).toBeGreaterThan(0);
    for (const s of sheet.samples) expect(s.answer.length, s.title).toBeGreaterThan(0);
  });

  it('prints every section, and every list item exactly once', () => {
    const pages = sheetPages(sheet);
    const parts = pages.flat();
    expect(new Set(parts.map((p) => p.section))).toEqual(new Set(SECTION_ORDER));
    for (const section of ['derivations', 'samples', 'practice'] as const) {
      const n = sectionLength(sheet, section);
      const covered = parts
        .filter((p) => p.section === section)
        .flatMap((p) => Array.from({ length: (p.to ?? n) - (p.from ?? 0) }, (_, i) => (p.from ?? 0) + i));
      expect(covered, section).toEqual(Array.from({ length: n }, (_, i) => i));
    }
    // A section is "(continued)" exactly when it already started on an earlier page.
    expect(
      parts.filter((p) => p.continued).every((p) => parts.indexOf(p) > parts.findIndex((q) => q.section === p.section)),
    ).toBe(true);
  });

  it('references only diagrams that exist, and uses every diagram', () => {
    const ids = sheet.diagrams.map((d) => d.id);
    const used = [
      ...(sheet.explanation.figures ?? []),
      ...sheet.derivations.map((d) => d.figure),
      ...sheet.samples.map((s) => s.figure),
    ].filter((x): x is string => Boolean(x));
    for (const id of used) expect(ids, id).toContain(id);
    for (const id of ids) expect(used, id).toContain(id);
  });

  it('cites syllabus sections that exist, and the right chapter range', () => {
    for (const code of sheet.syllabusSections) expect(findSection(sheet.curriculumId, code), code).not.toBeNull();
    const ch = Number(sheet.chapter.number);
    if (sheet.curriculumId === 'as') expect(ch >= 1 && ch <= 15).toBe(true);
  });

  it('typesets every equation without a KaTeX error', () => {
    for (const latex of allLatex(sheet)) {
      expect(() => katex.renderToString(latex, { throwOnError: true, strict: 'ignore' }), latex).not.toThrow();
    }
  });

  it('gives every symbol a meaning and an SI unit', () => {
    for (const s of sheet.symbols) {
      expect(s.meaning.length).toBeGreaterThan(0);
      expect(s.unit, s.symbol).toBeTruthy();
    }
  });

  it('keeps every diagram inside its own viewBox', () => {
    for (const d of sheet.diagrams) {
      for (const [x, y] of d.shapes.flatMap(shapePoints)) {
        expect(x, `${d.id} x`).toBeGreaterThanOrEqual(0);
        expect(x, `${d.id} x`).toBeLessThanOrEqual(d.width);
        expect(y, `${d.id} y`).toBeGreaterThanOrEqual(0);
        expect(y, `${d.id} y`).toBeLessThanOrEqual(d.height);
      }
      expect(d.alt.length).toBeGreaterThan(40);
      expect(d.caption.length).toBeGreaterThan(20);
    }
  });
});

describe('IGCSE circular motion: arithmetic', () => {
  it('sample 1: T = 2πr/v for r = 7.0e6 m, v = 7.5e3 m/s', () => {
    const T = (2 * Math.PI * 7.0e6) / 7.5e3;
    expect(Math.round(T)).toBe(5864);
    expect(Number(T.toPrecision(2))).toBe(5900);
    expect(Math.round(T / 60)).toBe(98);
    expect(igcse.samples[0].answer).toContain('5.9\\times10^{3}');
  });

  it('sample 2: Moon, r = 3.84e8 m, T = 27.3 days', () => {
    const T = 27.3 * 24 * 3600;
    expect(T.toPrecision(4)).toBe('2.359e+6');
    const v = (2 * Math.PI * 3.84e8) / T;
    expect(Math.round(v)).toBe(1023);
    expect(v.toPrecision(3)).toBe('1.02e+3');
  });

  it('practice answers', () => {
    expect(((2 * Math.PI * 0.3) / 0.5).toFixed(1)).toBe('3.8');
    expect(((2 * Math.PI * 6.7e6) / (90 * 60)).toPrecision(2)).toBe('7.8e+3');
    expect(((30e3 * 365 * 86400) / (2 * Math.PI)).toPrecision(2)).toBe('1.5e+11');
    const answers = igcse.practice.map((p) => p.answer).join(' | ');
    for (const a of ['3.8 m/s', '7.8 × 10³ m/s', '1.5 × 10¹¹ m']) expect(answers).toContain(a);
  });

  it('teaches the swap: T and v change sides in one step', () => {
    const step = igcse.derivations.find((d) => d.id === 'rearranging')!.steps[0];
    expect(step.text).toMatch(/swap/i);
    expect(step.latex).toContain(String.raw`T = \frac{2\pi r}{v}`);
  });

  it('tags F = mv²/r as not examined in 0625, and the syllabus statement as Supplement', () => {
    const f = igcse.equations.find((e) => e.latex.includes('mv^{2}'));
    expect(f?.tag).toBe('beyond');
    expect(f?.tagLabel).toMatch(/Not examined in 0625/);
    expect(igcse.derivations.find((d) => d.id === 'why')?.tag).toBe('beyond');
    const statement = igcse.explanation.keyTerms.find((t) => t.source === 'syllabus' && t.text.includes('circular path'));
    expect(statement?.tag).toBe('supplement');
  });
});

describe('A Level circular motion: arithmetic', () => {
  it('sample 1: puck on a string, 3.0 rev/s, r = 0.50 m, m = 0.20 kg', () => {
    const w = 2 * Math.PI * 3.0;
    const v = 0.5 * w;
    const F = 0.2 * 0.5 * w * w;
    expect(w.toFixed(2)).toBe('18.85');
    expect(v.toFixed(2)).toBe('9.42');
    expect(F.toFixed(1)).toBe('35.5');
    expect(alevel.samples[0].answer).toMatch(/19.*9\.4.*36/);
  });

  it('sample 2: vertical circle, m = 0.50 kg, r = 0.80 m, v_top = 4.0 m/s', () => {
    const m = 0.5;
    const r = 0.8;
    const top = (m * 16) / r - m * g;
    const vb2 = 16 + 4 * g * r;
    const bottom = m * g + (m * vb2) / r;
    expect(top.toFixed(1)).toBe('5.1');
    expect(vb2.toFixed(1)).toBe('47.4');
    expect(Math.sqrt(vb2).toFixed(2)).toBe('6.88');
    expect(bottom.toFixed(1)).toBe('34.5');
    expect(bottom.toPrecision(2)).toBe('35');
    // The derivation's claim: bottom − top = 6mg, whatever the speed.
    expect(bottom - top).toBeCloseTo(6 * m * g, 10);
    expect(alevel.samples[1].answer).toMatch(/5\.1.*6\.9.*35/);
  });

  it('sample 3: conical pendulum, L = 1.2 m, θ = 25°, m = 0.30 kg', () => {
    const th = deg(25);
    const FT = (0.3 * g) / Math.cos(th);
    const r = 1.2 * Math.sin(th);
    const v = Math.sqrt(r * g * Math.tan(th));
    const T1 = (2 * Math.PI * r) / v;
    const T2 = 2 * Math.PI * Math.sqrt((1.2 * Math.cos(th)) / g);
    expect(FT.toFixed(2)).toBe('3.25');
    expect(r.toFixed(3)).toBe('0.507');
    expect(v.toFixed(2)).toBe('1.52');
    expect(T1.toFixed(2)).toBe('2.09');
    // The two period formulas agree (the derivation is consistent).
    expect(T1).toBeCloseTo(T2, 10);
    expect(alevel.samples[2].answer).toMatch(/3\.2.*1\.5.*2\.1/);
  });

  it('sample 4: banked track, θ = 12°, v = 25 m/s', () => {
    const r = 625 / (g * Math.tan(deg(12)));
    expect((g * Math.tan(deg(12))).toFixed(3)).toBe('2.085');
    expect(r.toFixed(1)).toBe('299.7');
    const swap = alevel.samples[3].steps[1];
    expect(swap.text).toMatch(/swap/i);
    expect(swap.latex).toContain(String.raw`r = \frac{v^{2}}{g\tan\theta}`);
  });

  it('practice answers', () => {
    const computed = [
      (2.5 * 2 * Math.PI).toPrecision(2), // 16 rad/s
      ((150 * Math.PI) / 180).toPrecision(2), // 2.6 rad
      (0.055 * ((500 * 2 * Math.PI) / 60)).toPrecision(2), // 2.9 m/s
      ((1200 * 15 ** 2) / 50).toPrecision(2), // 5.4e3 N
      Math.sqrt(g * 6).toPrecision(2), // 7.7 m/s
      Math.sqrt(g * 20).toPrecision(2), // 14 m/s
      (2 * g + (2 * 36) / 0.9).toPrecision(2), // 1.0e2 N
      (2 * Math.PI * Math.sqrt((0.75 * Math.cos(deg(30))) / g)).toPrecision(2), // 1.6 s
      (120 ** 2 / (g * Math.tan(deg(35)))).toPrecision(2), // 2.1e3 m
      (6 * 0.05 * g).toPrecision(2), // 2.9 N
    ];
    expect(computed).toEqual(['16', '2.6', '2.9', '5.4e+3', '7.7', '14', '1.0e+2', '1.6', '2.1e+3', '2.9']);
    const shown = ['16 rad', '2.6 rad', '2.9 m', '5.4 × 10³ N', '7.7 m', '14 m', '1.0 × 10² N', '1.6 s', '2.1 × 10³ m', '2.9 N'];
    alevel.practice.forEach((p, i) => expect(p.answer, `P${i + 1}`).toContain(shown[i]));
  });
});

describe('diagram physics', () => {
  it.each([
    [igcse, 'velocity-and-force'],
    [alevel, 'top-view'],
  ] as const)('%s: velocity is tangential and the force/acceleration points to the centre', (sheet, id) => {
    const d = fig(sheet, id);
    const circle = d.shapes.find((s) => s.kind === 'circle') as Extract<DiagramShape, { kind: 'circle' }>;
    const starts = Array.from(
      new Set(
        arrows(d)
          .filter((a) => a.role === 'velocity')
          .map((a) => a.from.join(',')),
      ),
    );
    expect(starts.length).toBe(2);
    for (const start of starts) {
      const at = arrows(d).filter((a) => a.from.join(',') === start);
      const v = at.find((a) => a.role === 'velocity')!;
      const f = at.find((a) => a.role === 'force' || a.role === 'acceleration')!;
      expect(Math.abs(cosBetween(vec(v), vec(f)))).toBeLessThan(0.01);
      const toCentre: Point = [circle.centre[0] - f.from[0], circle.centre[1] - f.from[1]];
      expect(cosBetween(vec(f), toCentre)).toBeGreaterThan(0.999);
      expect(Math.abs(Math.hypot(...toCentre) - circle.radius)).toBeLessThan(0.5);
    }
  });

  it('IGCSE: the released ball leaves along the tangent, not outwards', () => {
    const d = fig(igcse, 'string-breaks');
    const circle = d.shapes.find((s) => s.kind === 'circle') as Extract<DiagramShape, { kind: 'circle' }>;
    const path = arrows(d).find((a) => a.role === 'velocity')!;
    const radial: Point = [path.from[0] - circle.centre[0], path.from[1] - circle.centre[1]];
    expect(Math.abs(cosBetween(radial, vec(path)))).toBeLessThan(1e-6);
  });

  it('A Level: Δv joins the tips of v₁ and v₂ and points to the centre', () => {
    const d = fig(alevel, 'velocity-triangle');
    const vs = arrows(d).filter((a) => a.role === 'velocity');
    const dv = arrows(d).find((a) => a.role === 'acceleration')!;
    const fromQ = vs.filter((a) => a.from.join(',') === vs[vs.length - 1].from.join(','));
    expect(fromQ.length).toBe(2);
    expect(fromQ.map((a) => a.to.join(','))).toContain(dv.from.join(','));
    expect(fromQ.map((a) => a.to.join(','))).toContain(dv.to.join(','));
    // Positions at 60° and 100°: the centre is at 80° + 180° from the mid-point.
    expect(cosBetween(vec(dv), [Math.cos(deg(260)), -Math.sin(deg(260))])).toBeGreaterThan(0.999);
  });

  it('A Level: on the banked track N is perpendicular to the road and its components are N cos θ and N sin θ', () => {
    const d = fig(alevel, 'banked');
    const road = d.shapes.find((s) => s.kind === 'surface') as Extract<DiagramShape, { kind: 'surface' }>;
    const bank = angleOf(road.from, road.to);
    const forces = arrows(d).filter((a) => a.role === 'force');
    const N = forces.find((a) => !a.dashed && a.to[1] < a.from[1])!;
    expect(Math.abs(cosBetween(vec(N), [road.to[0] - road.from[0], road.to[1] - road.from[1]]))).toBeLessThan(0.01);
    const [vert, horiz] = [
      forces.find((a) => a.dashed && a.to[0] === a.from[0])!,
      forces.find((a) => a.dashed && a.to[1] === a.from[1])!,
    ];
    const len = Math.hypot(...vec(N));
    expect(Math.hypot(...vec(vert))).toBeCloseTo(len * Math.cos(deg(bank)), 0);
    expect(Math.hypot(...vec(horiz))).toBeCloseTo(len * Math.sin(deg(bank)), 0);
    // Towards the centre of the bend = towards the low side of the road (left).
    expect(horiz.to[0]).toBeLessThan(horiz.from[0]);
    const W = forces.find((a) => !a.dashed && a.to[1] > a.from[1])!;
    expect(W.to[0]).toBe(W.from[0]);
  });

  it('A Level: in the vertical circle both forces point down at the top; tension points up at the bottom', () => {
    const d = fig(alevel, 'vertical');
    const circle = d.shapes.find((s) => s.kind === 'circle') as Extract<DiagramShape, { kind: 'circle' }>;
    const forces = arrows(d).filter((a) => a.role === 'force');
    const atTop = forces.filter((a) => a.from[1] < circle.centre[1]);
    const atBottom = forces.filter((a) => a.from[1] > circle.centre[1]);
    expect(atTop.length).toBe(2);
    expect(atTop.every((a) => a.to[1] > a.from[1])).toBe(true);
    expect(atBottom.filter((a) => a.to[1] < a.from[1]).length).toBe(1);
    expect(atBottom.filter((a) => a.to[1] > a.from[1]).length).toBe(1);
  });

  it('A Level: the conical pendulum tension points at the pivot, at θ to the vertical', () => {
    const d = fig(alevel, 'conical');
    const pivot = (d.shapes.find((s) => s.kind === 'arc') as Extract<DiagramShape, { kind: 'arc' }>).centre;
    const FT = arrows(d).find((a) => a.role === 'force' && !a.dashed && a.to[1] < a.from[1])!;
    const toPivot: Point = [pivot[0] - FT.from[0], pivot[1] - FT.from[1]];
    expect(cosBetween(vec(FT), toPivot)).toBeGreaterThan(0.999);
    expect(cosBetween(vec(FT), [0, -1])).toBeCloseTo(Math.cos(deg(30)), 3);
  });
});

describe('diagram rendering', () => {
  it('is deterministic and colour-free', () => {
    const a = renderDiagram(alevel.diagrams[0]);
    expect(renderDiagram(alevel.diagrams[0])).toEqual(a);
    expect(a.paths.every((p) => ['none', 'currentColor', 'soft'].includes(p.fill))).toBe(true);
    expect(a.paths.every((p) => !/NaN/.test(p.d))).toBe(true);
  });

  it('puts the arrowhead tip exactly on the arrow end', () => {
    const [tip, l, r] = arrowHead([0, 0], [100, 0]);
    expect(tip).toEqual([100, 0]);
    expect(l[0]).toBeCloseTo(90);
    expect(r[0]).toBeCloseTo(90);
    expect(Math.abs(l[1] - r[1])).toBeCloseTo(7);
  });

  it('draws angle arcs anticlockwise on screen', () => {
    // 0° → 90°: from (10,0) up to (0,-10) relative to the centre.
    expect(arcPath([0, 0], 10, 0, 90)).toBe('M10 0 A10 10 0 0 0 0 -10');
  });

  it('splits math labels into italic, subscript and upright runs', () => {
    expect(labelRuns('F_T |cos| θ')).toEqual([
      { text: 'F', sub: false, upright: false },
      { text: 'T', sub: true, upright: true },
      { text: ' ', sub: false, upright: false },
      { text: 'cos', sub: false, upright: true },
      { text: ' θ', sub: false, upright: false },
    ]);
    expect(labelRuns('v_{top}')).toEqual([
      { text: 'v', sub: false, upright: false },
      { text: 'top', sub: true, upright: true },
    ]);
  });

  it('lists the colour-coded roles for the legend in a fixed order', () => {
    expect(rolesUsed(igcse.diagrams)).toEqual(['force', 'velocity']);
    expect(rolesUsed(alevel.diagrams)).toEqual(['force', 'velocity', 'acceleration']);
  });

  it('unit() normalises', () => {
    expect(Math.hypot(...unit([3, 4]))).toBeCloseTo(1);
  });
});

describe('downloadable PDFs (scripts/cheatsheet-pdfs.mjs)', () => {
  it.each(CHEAT_SHEETS.map((s) => [s.slug] as const))('%s: built from the current data, one page per sheet', (slug) => {
    const file = path.join(__dirname, '..', 'sheets', `${slug}.ts`);
    const entry = PDF_MANIFEST[slug];
    expect(entry, `no PDFs for ${slug}: run scripts/cheatsheet-pdfs.mjs`).toBeDefined();
    const hash = createHash('sha256').update(readFileSync(file)).digest('hex');
    expect(entry.hash, `${slug} changed since its PDFs were built: run scripts/cheatsheet-pdfs.mjs`).toBe(hash);
    const sheets = sheetPages(getCheatSheet(slug)!).length;
    for (const paper of ['a4', 'letter'] as const) {
      const f = entry.files[paper]!;
      expect(f.pages, `${slug} ${paper}`).toBe(sheets);
      expect(
        readFileSync(path.join(__dirname, '../../../public/cheat-sheets/pdf', f.file))
          .subarray(0, 5)
          .toString(),
      ).toBe('%PDF-');
    }
    expect(pdfHrefs(slug).a4).toBe(`/cheat-sheets/pdf/${slug}-a4.pdf`);
  });

  it('names each data file after its slug (the PDF script relies on it)', () => {
    const files = readdirSync(path.join(__dirname, '..', 'sheets')).map((f) => f.replace(/\.ts$/, ''));
    expect(files.sort()).toEqual(CHEAT_SHEETS.map((s) => s.slug).sort());
  });
});

describe('source hygiene', () => {
  it('has no literal \\u escapes in sheet data (they have landed as broken characters before)', () => {
    const dir = path.join(__dirname, '..', 'sheets');
    for (const f of readdirSync(dir)) {
      expect(readFileSync(path.join(dir, f), 'utf8'), f).not.toMatch(/\\u[0-9a-fA-F]{4}/);
    }
  });
});
