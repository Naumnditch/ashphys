import { describe, expect, it } from 'vitest';
import {
  eraseFromStroke,
  freehandOutline,
  outlineToPathData,
  shapePathData,
  snapAngle,
  strokeBounds,
  strokeHitBySegment,
  strokeInLasso,
  translateStroke,
} from '@/lib/handwriting/geometry';
import { parseHandwritingDoc, MAX_POINTS_PER_STROKE } from '@/lib/handwriting/schema';
import { renderPreview, renderSnapshots, snapshotToSvg } from '@/lib/handwriting/svg';
import { emptyDoc, type HandwritingDoc, type HwPoint, type HwStroke } from '@/lib/handwriting/types';

let n = 0;
const makeId = () => `id${++n}`;

function line(x0: number, y0: number, x1: number, y1: number, steps = 20, tool: HwStroke['tool'] = 'pen'): HwStroke {
  const points: HwPoint[] = [];
  for (let i = 0; i <= steps; i++) points.push([x0 + ((x1 - x0) * i) / steps, y0 + ((y1 - y0) * i) / steps, 0.5]);
  return { id: makeId(), tool, color: '#1b2a41', width: 4, opacity: 1, pressure: true, points };
}

function docWith(strokes: HwStroke[], background: 'grid' | 'blank' | 'lined' = 'grid'): HandwritingDoc {
  return { v: 1, pages: [{ id: 'p1', background, strokes }] };
}

describe('freehand outlines', () => {
  it('turns a stroke into a closed filled path', () => {
    const s = line(0, 0, 100, 0);
    const outline = freehandOutline(s);
    expect(outline.length).toBeGreaterThan(10);
    const d = outlineToPathData(outline);
    expect(d.startsWith('M')).toBe(true);
    expect(d.endsWith('Z')).toBe(true);
    expect(d).not.toMatch(/NaN|Infinity/);
  });

  it('is deterministic, so a reload draws exactly the same thing', () => {
    const s = line(10, 10, 200, 90);
    expect(outlineToPathData(freehandOutline(s))).toBe(outlineToPathData(freehandOutline(structuredClone(s))));
  });

  it('draws a single tap as a dot', () => {
    const dot: HwStroke = { ...line(5, 5, 5, 5, 0), points: [[5, 5, 0.5]] };
    expect(outlineToPathData(freehandOutline(dot)).length).toBeGreaterThan(5);
  });
});

describe('shapes', () => {
  const shape = (kind: HwStroke['shape'], pts: HwPoint[]): HwStroke => ({
    id: makeId(),
    tool: 'shape',
    shape: kind,
    color: '#b34a3c',
    width: 3,
    opacity: 1,
    pressure: false,
    points: pts,
  });

  it('builds line, arrow, rectangle and ellipse paths', () => {
    expect(shapePathData(shape('line', [[0, 0, 0.5], [10, 0, 0.5]]))).toBe('M0 0L10 0');
    expect(shapePathData(shape('rect', [[10, 20, 0.5], [0, 0, 0.5]]))).toBe('M0 0H10V20H0Z');
    expect(shapePathData(shape('arrow', [[0, 0, 0.5], [100, 0, 0.5]]))).toMatch(/^M0 0L100 0M.+L100 0L.+$/);
    expect(shapePathData(shape('ellipse', [[0, 0, 0.5], [20, 10, 0.5]]))).toContain('A10 5 0 1 0');
  });

  it('snaps lines to 15° steps', () => {
    const [x, y] = snapAngle([0, 0], [100, 4]);
    expect(y).toBeCloseTo(0, 6);
    expect(x).toBeCloseTo(Math.hypot(100, 4), 6);
  });

  it('pixel-erases a rectangle into polylines', () => {
    const rect = shape('rect', [[0, 0, 0.5], [100, 100, 0.5]]);
    // Cut through the top edge only.
    const pieces = eraseFromStroke(rect, [50, -10], [50, 10], 5, makeId);
    expect(pieces.length).toBeGreaterThanOrEqual(1);
    expect(pieces.every((p) => p.shape === 'polyline' && p.tool === 'shape')).toBe(true);
    // Nothing left near the cut.
    for (const p of pieces) for (const [x, y] of p.points) expect(Math.hypot(x - 50, y) > 5 || y > 10).toBe(true);
  });
});

describe('erasers and lasso', () => {
  it('stroke eraser hits a stroke it crosses and misses one far away', () => {
    const s = line(0, 0, 100, 0);
    expect(strokeHitBySegment(s, [50, -20], [50, 20], 4)).toBe(true);
    expect(strokeHitBySegment(s, [50, 30], [60, 40], 4)).toBe(false);
  });

  it('pixel eraser splits a stroke in two and keeps the style', () => {
    const s = line(0, 0, 100, 0, 50);
    const pieces = eraseFromStroke(s, [50, -20], [50, 20], 5, makeId);
    expect(pieces).toHaveLength(2);
    expect(pieces.every((p) => p.color === s.color && p.width === s.width && p.tool === 'pen')).toBe(true);
    expect(Math.max(...pieces[0].points.map((p) => p[0]))).toBeLessThan(46);
    expect(Math.min(...pieces[1].points.map((p) => p[0]))).toBeGreaterThan(54);
    expect(new Set(pieces.map((p) => p.id)).size).toBe(2);
  });

  it('pixel eraser leaves an untouched stroke as the same object', () => {
    const s = line(0, 0, 100, 0);
    expect(eraseFromStroke(s, [0, 50], [100, 50], 5, makeId)).toEqual([s]);
  });

  it('pixel eraser removes a stroke completely when it covers it', () => {
    const s = line(0, 0, 10, 0, 5);
    expect(eraseFromStroke(s, [-5, 0], [15, 0], 6, makeId)).toEqual([]);
  });

  it('lasso selects strokes mostly inside the loop', () => {
    const loop: [number, number][] = [[-10, -10], [60, -10], [60, 10], [-10, 10]];
    expect(strokeInLasso(line(0, 0, 50, 0), loop)).toBe(true);
    expect(strokeInLasso(line(0, 0, 200, 0), loop)).toBe(false);
  });

  it('moves strokes without changing their shape', () => {
    const s = line(0, 0, 10, 10);
    const moved = translateStroke(s, 5, -5);
    expect(moved.points[0]).toEqual([5, -5, 0.5]);
    expect(moved.points.at(-1)).toEqual([15, 5, 0.5]);
    expect(s.points[0]).toEqual([0, 0, 0.5]);
  });
});

describe('validation', () => {
  it('accepts a document and rounds its numbers', () => {
    const doc = docWith([{ ...line(0, 0, 10, 0), points: [[1.23456, 2.98765, 0.123456], [3, 4, 1]] }]);
    const r = parseHandwritingDoc(doc);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.doc.pages[0].strokes[0].points[0]).toEqual([1.2, 3, 0.12]);
  });

  it.each([
    ['a colour that is not #rrggbb', { color: 'red" onload="alert(1)' }],
    ['an unknown tool', { tool: 'script' }],
    ['a NaN coordinate', { points: [[NaN, 0, 0.5]] }],
    ['pressure above 1', { points: [[0, 0, 2]] }],
    ['a shape without its kind', { tool: 'shape' }],
    ['an id with markup', { id: '<b>' }],
    ['too many points', { points: Array.from({ length: MAX_POINTS_PER_STROKE + 1 }, () => [0, 0, 0.5]) }],
  ])('rejects %s', (_label, patch) => {
    const r = parseHandwritingDoc(docWith([{ ...line(0, 0, 10, 0), ...(patch as object) } as HwStroke]));
    expect(r.ok).toBe(false);
  });

  it('rejects a document with no pages or the wrong format version', () => {
    expect(parseHandwritingDoc({ v: 1, pages: [] }).ok).toBe(false);
    expect(parseHandwritingDoc({ v: 2, pages: emptyDoc().pages }).ok).toBe(false);
    expect(parseHandwritingDoc('nope').ok).toBe(false);
  });

  it('drops unknown keys', () => {
    const r = parseHandwritingDoc({ ...docWith([{ ...line(0, 0, 5, 5), extra: '<script>' } as HwStroke]), junk: 1 });
    expect(r.ok && JSON.stringify(r.doc)).not.toContain('script');
  });
});

describe('snapshots', () => {
  it('renders one SVG per non-empty page, cropped to the ink', () => {
    const doc: HandwritingDoc = {
      v: 1,
      pages: [
        { id: 'a', background: 'grid', strokes: [line(100, 100, 300, 140)] },
        { id: 'b', background: 'blank', strokes: [] },
        { id: 'c', background: 'lined', strokes: [line(0, 0, 50, 0)] },
      ],
    };
    const snaps = renderSnapshots(doc);
    expect(snaps).toHaveLength(2);
    const b = strokeBounds(doc.pages[0].strokes[0]);
    expect(snaps[0].x).toBeLessThanOrEqual(b.minX);
    expect(snaps[0].x + snaps[0].width).toBeGreaterThanOrEqual(b.maxX);
    expect(snaps[0].width).toBeLessThan(300);
    const svg = snapshotToSvg(snaps[0]);
    expect(svg).toMatch(/^<svg xmlns="http:\/\/www.w3.org\/2000\/svg" viewBox=/);
    expect(svg).toContain('fill="#1b2a41"');
    expect(svg).not.toMatch(/NaN|undefined|<script/);
  });

  it('draws highlighter with multiply blending and shapes as strokes', () => {
    const hl: HwStroke = { ...line(0, 0, 100, 0), tool: 'highlighter', color: '#facc15', opacity: 0.35, width: 18 };
    const sh: HwStroke = { id: 's', tool: 'shape', shape: 'line', color: '#2e7d6b', width: 2, opacity: 1, pressure: false, points: [[0, 20, 0.5], [100, 20, 0.5]] };
    const [snap] = renderSnapshots(docWith([hl, sh], 'blank'));
    expect(snap.body).toContain('fill-opacity="0.35" style="mix-blend-mode:multiply"');
    expect(snap.body).toContain('stroke="#2e7d6b" stroke-width="2"');
    expect(snap.body).not.toContain('<path d="" ');
  });

  it('teaser holds only the strokes in the top 30% of the first page', () => {
    const top = line(0, 0, 100, 0);
    const bottom = line(0, 1000, 100, 1000);
    const preview = renderPreview(docWith([top, bottom]));
    expect(preview).not.toBeNull();
    const all = renderSnapshots(docWith([top, bottom]))[0];
    expect(preview!.height).toBeLessThan(all.height / 2);
    // The bottom stroke's path is not in the markup at all.
    const bottomOnly = renderSnapshots(docWith([bottom], 'blank'))[0];
    const bottomPath = bottomOnly.body.match(/<path d="[^"]+" fill="#1b2a41"\/>/)![0];
    expect(preview!.body).not.toContain(bottomPath);
  });

  it('has no snapshot or teaser for an empty document', () => {
    expect(renderSnapshots(emptyDoc())).toEqual([]);
    expect(renderPreview(emptyDoc())).toBeNull();
  });
});

describe('missing migration', () => {
  it('recognises the errors a database without migration "question_handwriting" raises', async () => {
    const { isHandwritingSchemaMissing } = await import('@/lib/handwriting/store');
    expect(isHandwritingSchemaMissing({ code: '22023', message: 'role "ashphys_user" does not exist' })).toBe(true);
    expect(isHandwritingSchemaMissing({ code: '42P01', message: 'relation "question_handwriting" does not exist' })).toBe(true);
    expect(isHandwritingSchemaMissing({ code: '42883', message: 'function app_answered_incorrectly(uuid) does not exist' })).toBe(true);
    expect(isHandwritingSchemaMissing({ code: '22023', message: 'something else' })).toBe(false);
    expect(isHandwritingSchemaMissing(new Error('connection refused'))).toBe(false);
  });
});
