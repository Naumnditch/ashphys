import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import katex from 'katex';
import { findSection } from '@/lib/curricula';
import { CHEAT_SHEETS, cheatSheetFor, cheatSheetsFor, getCheatSheet, sheetParts, syllabusReference } from '..';
import { arrowHead, renderDiagram, rolesUsed } from '../rough';
import { PDF_MANIFEST, pdfHrefs } from '../pdfFiles';
import { createHash } from 'node:crypto';
import { igcseCircularMotion } from '../sheets/igcse-circular-motion';
import type { CheatSheet, DiagramShape, Point } from '../types';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function allLatex(sheet: CheatSheet): string[] {
  const inline = (t: string) => Array.from(t.matchAll(/\$([^$]+)\$/g), (m) => m[1]);
  return [
    ...sheet.equations.flatMap((e) => [e.latex, ...e.symbols.flatMap((s) => [s.symbol, s.unit ?? ''])]),
    ...sheet.worked.flatMap((w) => [w.answer, ...w.steps.flatMap((s) => [s.latex ?? '', s.units ?? '', ...inline(s.text)])]),
    ...sheet.definitions.flatMap((d) => inline(d.text)),
    ...sheet.recall.flatMap((q) => [...inline(q.question), ...inline(q.answer)]),
    ...sheet.summary.flatMap(inline),
  ].filter(Boolean);
}

describe('cheat sheet registry', () => {
  it('has unique slugs and one sheet per lesson per curriculum', () => {
    const slugs = CHEAT_SHEETS.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    const keys = CHEAT_SHEETS.map((s) => `${s.topicId}:${s.curriculumId}`);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it('finds sheets by slug, lesson and curriculum', () => {
    expect(getCheatSheet('igcse-circular-motion')).toBe(igcseCircularMotion);
    expect(cheatSheetFor(igcseCircularMotion.topicId, 'igcse')).toBe(igcseCircularMotion);
    // Sheets are per curriculum: the same shared lesson has no A Level sheet yet.
    expect(cheatSheetFor(igcseCircularMotion.topicId, 'a-level')).toBeUndefined();
    expect(cheatSheetsFor('igcse')).toContain(igcseCircularMotion);
    expect(getCheatSheet('nope')).toBeUndefined();
  });

  it('labels the syllabus the way each curriculum is examined', () => {
    const base = { chapter: { number: 16, title: 'Circular motion' }, syllabusSections: ['12.1'] };
    expect(syllabusReference(igcseCircularMotion)).toBe('0625 Ch.3');
    expect(syllabusReference({ ...base, curriculumId: 'as', chapter: { number: 5, title: '' } })).toBe('9702 AS Ch.5');
    expect(syllabusReference({ ...base, curriculumId: 'a-level' })).toBe('9702 A Level Ch.16');
    expect(syllabusReference({ ...base, curriculumId: 'ib', syllabusSections: ['A.2'] })).toBe('IB A.2');
  });
});

describe.each(CHEAT_SHEETS.map((s) => [s.slug, s] as const))('sheet %s', (_slug, sheet) => {
  it('has every required section in range', () => {
    expect(sheet.topicId).toMatch(UUID);
    expect(sheet.goal.length).toBeGreaterThan(20);
    expect(sheet.definitions.length).toBeGreaterThan(0);
    expect(sheet.equations.length).toBeGreaterThan(0);
    expect(sheet.diagrams.length).toBeGreaterThanOrEqual(1);
    expect(sheet.worked.length).toBeGreaterThanOrEqual(1);
    expect(sheet.mistakes.length).toBeGreaterThanOrEqual(3);
    expect(sheet.mistakes.length).toBeLessThanOrEqual(5);
    expect(sheet.recall.length).toBeGreaterThanOrEqual(4);
    expect(sheet.recall.length).toBeLessThanOrEqual(6);
    expect(sheet.summary.length).toBeGreaterThanOrEqual(3);
    expect(sheet.summary.length).toBeLessThanOrEqual(5);
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

  it('gives every equation symbol a meaning and an SI unit', () => {
    for (const e of sheet.equations) {
      for (const s of e.symbols) {
        expect(s.meaning.length).toBeGreaterThan(0);
        expect(s.unit, `${e.name}: ${s.symbol}`).toBeTruthy();
      }
    }
  });

  it('keeps every diagram inside its own viewBox', () => {
    for (const d of sheet.diagrams) {
      const points: Point[] = d.shapes.flatMap((s: DiagramShape) => {
        switch (s.kind) {
          case 'circle':
            return [
              [s.centre[0] - s.radius, s.centre[1] - s.radius],
              [s.centre[0] + s.radius, s.centre[1] + s.radius],
            ] as Point[];
          case 'line':
          case 'arrow':
            return [s.from, s.to];
          case 'dot':
          case 'label':
          case 'rightAngle':
          case 'cross':
            return [s.at];
        }
      });
      for (const [x, y] of points) {
        expect(x, `${d.id} x`).toBeGreaterThanOrEqual(0);
        expect(x, `${d.id} x`).toBeLessThanOrEqual(d.width);
        expect(y, `${d.id} y`).toBeGreaterThanOrEqual(0);
        expect(y, `${d.id} y`).toBeLessThanOrEqual(d.height);
      }
      expect(d.alt.length).toBeGreaterThan(40);
      expect(d.caption.length).toBeGreaterThan(20);
    }
  });

  it('splits into labelled sheets without losing a section', () => {
    expect(sheetParts(sheet).flat()).toEqual(['definitions', 'equations', 'diagrams', 'worked', 'mistakes', 'recall', 'summary']);
  });
});

describe('IGCSE circular motion: the physics and the arithmetic', () => {
  const sheet = igcseCircularMotion;

  it('worked example: T = 2πr/v for r = 7.0e6 m, v = 7.5e3 m/s', () => {
    const T = (2 * Math.PI * 7.0e6) / 7.5e3;
    expect(Math.round(T)).toBe(5864);
    expect(Number(T.toPrecision(2))).toBe(5900);
    expect(Math.round(T / 60)).toBe(98);
    const w = sheet.worked[0];
    expect(w.steps.some((s) => s.latex?.includes('= 5864'))).toBe(true);
    expect(w.answer).toContain('5.9\\times10^{3}');
    expect(w.answer).toContain('98');
  });

  it('recall Q6: v = 2π × 0.30 / 0.50 = 3.8 m/s', () => {
    const v = (2 * Math.PI * 0.3) / 0.5;
    expect(v.toFixed(1)).toBe('3.8');
    expect(sheet.recall[5].answer).toContain('3.8 m/s');
  });

  it('teaches the swap: T and v change sides in one step', () => {
    const step = sheet.worked[0].steps[0];
    expect(step.text).toMatch(/swap/i);
    expect(step.latex).toContain(String.raw`T = \frac{2\pi r}{v}`);
  });

  it('marks F = mv²/r as not examined in 0625, and the syllabus statement as Supplement', () => {
    const f = sheet.equations.find((e) => e.latex.includes('mv^{2}'));
    expect(f?.tag).toBe('beyond');
    expect(f?.tagLabel).toMatch(/Not examined in 0625/);
    const statement = sheet.definitions.find((d) => d.source === 'syllabus' && d.text.includes('circular path'));
    expect(statement?.tag).toBe('supplement');
  });

  it('draws velocity along the tangent and force to the centre, at 90° to each other', () => {
    const fig = sheet.diagrams.find((d) => d.id === 'velocity-and-force')!;
    const circle = fig.shapes.find((s) => s.kind === 'circle') as Extract<DiagramShape, { kind: 'circle' }>;
    const arrows = fig.shapes.filter((s): s is Extract<DiagramShape, { kind: 'arrow' }> => s.kind === 'arrow');
    const starts = Array.from(new Set(arrows.map((a) => a.from.join(','))));
    expect(starts.length).toBe(2);
    for (const start of starts) {
      const v = arrows.find((a) => a.from.join(',') === start && a.role === 'velocity')!;
      const f = arrows.find((a) => a.from.join(',') === start && a.role === 'force')!;
      const dv = [v.to[0] - v.from[0], v.to[1] - v.from[1]];
      const df = [f.to[0] - f.from[0], f.to[1] - f.from[1]];
      const cos = (dv[0] * df[0] + dv[1] * df[1]) / (Math.hypot(dv[0], dv[1]) * Math.hypot(df[0], df[1]));
      expect(Math.abs(cos)).toBeLessThan(0.01);
      // The force points at the centre.
      const toCentre = [circle.centre[0] - f.from[0], circle.centre[1] - f.from[1]];
      const cosC =
        (df[0] * toCentre[0] + df[1] * toCentre[1]) / (Math.hypot(df[0], df[1]) * Math.hypot(toCentre[0], toCentre[1]));
      expect(cosC).toBeGreaterThan(0.999);
      // The object sits on the circle.
      expect(Math.abs(Math.hypot(toCentre[0], toCentre[1]) - circle.radius)).toBeLessThan(0.5);
    }
  });

  it('sends the released ball along the tangent, not outwards', () => {
    const fig = sheet.diagrams.find((d) => d.id === 'string-breaks')!;
    const circle = fig.shapes.find((s) => s.kind === 'circle') as Extract<DiagramShape, { kind: 'circle' }>;
    const path = fig.shapes.find((s) => s.kind === 'arrow' && s.role === 'velocity') as Extract<DiagramShape, { kind: 'arrow' }>;
    const radial = [path.from[0] - circle.centre[0], path.from[1] - circle.centre[1]];
    const dir = [path.to[0] - path.from[0], path.to[1] - path.from[1]];
    expect(Math.abs(radial[0] * dir[0] + radial[1] * dir[1])).toBeLessThan(1e-6);
  });
});

describe('rough diagram rendering', () => {
  it('is deterministic (seeded) and colour-free', () => {
    const a = renderDiagram(igcseCircularMotion.diagrams[0]);
    const b = renderDiagram(igcseCircularMotion.diagrams[0]);
    expect(a).toEqual(b);
    expect(a.paths.length).toBeGreaterThan(10);
    expect(a.paths.every((p) => p.fill === 'none' || p.fill === 'currentColor')).toBe(true);
  });

  it('puts the arrowhead tip exactly on the arrow end', () => {
    const [tip, l, r] = arrowHead([0, 0], [100, 0]);
    expect(tip).toEqual([100, 0]);
    expect(l[0]).toBeCloseTo(91);
    expect(r[0]).toBeCloseTo(91);
    expect(Math.abs(l[1] - r[1])).toBeCloseTo(9);
  });

  it('lists the colour-coded roles for the legend in a fixed order', () => {
    expect(rolesUsed(igcseCircularMotion.diagrams)).toEqual(['force', 'velocity']);
  });
});

describe('downloadable PDFs (scripts/cheatsheet-pdfs.mjs)', () => {
  it.each(CHEAT_SHEETS.map((s) => [s.slug] as const))('%s: built from the current data, one page per sheet', (slug) => {
    const file = path.join(__dirname, '..', 'sheets', `${slug}.ts`);
    const entry = PDF_MANIFEST[slug];
    expect(entry, `no PDFs for ${slug}: run scripts/cheatsheet-pdfs.mjs`).toBeDefined();
    const hash = createHash('sha256').update(readFileSync(file)).digest('hex');
    expect(entry.hash, `${slug} changed since its PDFs were built: run scripts/cheatsheet-pdfs.mjs`).toBe(hash);
    const sheets = sheetParts(getCheatSheet(slug)!).length;
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
      const text = readFileSync(path.join(dir, f), 'utf8');
      expect(text, f).not.toMatch(/\\u[0-9a-fA-F]{4}/);
    }
  });
});
