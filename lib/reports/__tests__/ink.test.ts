import { describe, expect, it } from 'vitest';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { writeFileSync } from 'node:fs';
import { MAX_POINTS, NOTE_PAD, SIGNATURE_PAD, inkBox, inkPaths, inkSvg, parseInk } from '@/lib/reports/ink';
import { parseNoteInput } from '@/lib/reports/notes';
import { renderReportPdf, inkSize } from '@/lib/reports/pdf';
import { sampleInk, sampleReport, sampleSignature } from './fixture';

describe('ink validation', () => {
  it('accepts pad strokes, rounds and clamps them', () => {
    const r = parseInk({ w: 1000, h: 560, strokes: [{ c: 'blue', s: 5, pen: true, p: [10.123, 20.987, 0.55555, 2000, -5, 3] }] }, NOTE_PAD);
    expect(r).toEqual({ ok: true, value: { v: 1, w: 1000, h: 560, strokes: [{ c: 'blue', s: 5, pen: true, p: [10.1, 21, 0.56, 1000, 0, 1] }] } });
  });
  it('treats missing or empty ink as no ink', () => {
    expect(parseInk(undefined, NOTE_PAD)).toEqual({ ok: true, value: null });
    expect(parseInk({ w: 1000, h: 560, strokes: [] }, NOTE_PAD)).toEqual({ ok: true, value: null });
  });
  it('rejects anything that is not plain stroke data', () => {
    const bad = [
      { w: 600, h: 200, strokes: [{ c: 'blue', s: 5, pen: true, p: [1, 2, 0.5] }] }, // wrong pad
      { w: 1000, h: 560, strokes: [{ c: 'url(javascript:alert(1))', s: 5, pen: true, p: [1, 2, 0.5] }] },
      { w: 1000, h: 560, strokes: [{ c: 'blue', s: 5, pen: true, p: [1, 2] }] },
      { w: 1000, h: 560, strokes: [{ c: 'blue', s: 5, pen: true, p: [1, '<svg>', 0.5] }] },
      { w: 1000, h: 560, strokes: [{ c: 'blue', s: 5, pen: true, p: Array(3 * (MAX_POINTS + 1)).fill(1) }] },
      'not ink',
    ];
    for (const b of bad) expect(parseInk(b, NOTE_PAD).ok).toBe(false);
  });
  it('builds pen outlines and a cropped SVG with only generated markup', () => {
    const ink = sampleInk();
    const paths = inkPaths(ink);
    expect(paths).toHaveLength(ink.strokes.length);
    for (const p of paths) expect(p.d).toMatch(/^M [\d.-]+ [\d.-]+ Q[\d .-]+Z$/);
    const box = inkBox(ink);
    expect(box.x).toBeGreaterThan(40);
    expect(box.w).toBeLessThan(1000);
    const { svg } = inkSvg(ink);
    expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
    expect(svg).not.toMatch(/script|href|style/);
  });
});

describe('notes with handwriting', () => {
  it('a handwritten note needs no typed text; neither at all is refused', () => {
    const ok = parseNoteInput({ body: '', signature: 'Mr. A', ink: sampleInk(1), signatureInk: sampleSignature() });
    expect(ok.ok).toBe(true);
    if (ok.ok) {
      expect(ok.value.ink?.strokes.length).toBeGreaterThan(0);
      expect(ok.value.signatureInk?.w).toBe(SIGNATURE_PAD.w);
    }
    expect(parseNoteInput({ body: '', signature: 'Mr. A' })).toEqual({ ok: false, error: 'Write a note first — typed or handwritten.' });
    expect(parseNoteInput({ body: 'x', signature: 'Mr. A', signatureInk: sampleInk(1) }).ok).toBe(false); // note pad used as signature
  });
});

async function pdfPages(buf: Buffer) {
  const pdf = await getDocument({ data: new Uint8Array(buf) }).promise;
  const out: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const c = await (await pdf.getPage(i)).getTextContent();
    out.push(c.items.map((it) => ('str' in it ? it.str : '')).join(' '));
  }
  return out;
}

describe('PDF with handwriting', () => {
  it('draws the handwritten note and signature and still names the teacher', async () => {
    const r = sampleReport({ note: { body: 'Typed part.', ink: sampleInk(3), signatureInk: sampleSignature() } });
    const buf = await renderReportPdf(r);
    if (process.env.REPORT_PDF_OUT) writeFileSync(process.env.REPORT_PDF_OUT.replace('.pdf', '-ink.pdf'), buf);
    const pages = await pdfPages(buf);
    expect(pages.length).toBeLessThanOrEqual(3);
    expect(pages[0]).toContain('A note from your teacher');
    expect(pages[0]).toContain('Typed part.');
    expect(pages[0]).toContain('Mr. Abdelrahman');
    // The vector paths are in the content stream (more drawing ops than without ink).
    const plain = await renderReportPdf(sampleReport());
    expect(buf.length).toBeGreaterThan(plain.length);
  });
  it('a handwriting-only note renders without typed text', async () => {
    const pages = await pdfPages(await renderReportPdf(sampleReport({ note: { body: '', ink: sampleInk(2) } })));
    expect(pages[0]).toContain('A note from your teacher');
    expect(pages[0]).toContain('Mr. Abdelrahman');
  });
  it('keeps writing at its pad size and caps tall pages', () => {
    const ink = sampleInk(2);
    const s = inkSize(ink, 500, 360);
    expect(s.w).toBeLessThan(500);
    expect(s.h).toBeLessThanOrEqual(360);
    const full = inkSize(sampleInk(9), 500, 100);
    expect(full.h).toBe(100);
  });
});
