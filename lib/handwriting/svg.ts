/**
 * SVG snapshots of handwriting pages, rendered on the server at save time
 * so students get a light, ready-to-show picture instead of the raw strokes.
 *
 * The markup is built only from validated numbers and #rrggbb colours (see
 * schema.ts), never from free text, so it is safe to inline in the page.
 */

import type { Bounds, HandwritingDoc, HwBackground, HwPage, HwSnapshot, HwStroke } from './types';
import { fmt, isFreehand, strokeBounds, strokePathData, unionBounds } from './geometry';

/** Paper colours. The page stays white in dark mode too (like uploaded figures). */
export const PAPER = '#ffffff';
export const GRID_COLOR = '#dfe3ea';
export const LINE_COLOR = '#cfd8e6';
export const GRID_SIZE = 32;
export const LINE_SPACING = 40;
const MARGIN = 32;
/** Share of page 1 (from the top) shown as the teaser to viewers who are out of views. */
export const PREVIEW_FRACTION = 0.3;

export function backgroundPathData(background: HwBackground, b: Bounds): string {
  if (background === 'blank') return '';
  const parts: string[] = [];
  if (background === 'grid') {
    for (let x = Math.ceil(b.minX / GRID_SIZE) * GRID_SIZE; x <= b.maxX; x += GRID_SIZE) parts.push(`M${fmt(x)} ${fmt(b.minY)}V${fmt(b.maxY)}`);
  }
  const step = background === 'grid' ? GRID_SIZE : LINE_SPACING;
  for (let y = Math.ceil(b.minY / step) * step; y <= b.maxY; y += step) parts.push(`M${fmt(b.minX)} ${fmt(y)}H${fmt(b.maxX)}`);
  return parts.join('');
}

export function strokeSvg(stroke: HwStroke): string {
  const d = strokePathData(stroke);
  if (!d) return '';
  const opacity = stroke.opacity < 1 ? fmt(stroke.opacity) : null;
  if (isFreehand(stroke)) {
    const blend = stroke.tool === 'highlighter' ? ' style="mix-blend-mode:multiply"' : '';
    return `<path d="${d}" fill="${stroke.color}"${opacity ? ` fill-opacity="${opacity}"` : ''}${blend}/>`;
  }
  return (
    `<path d="${d}" fill="none" stroke="${stroke.color}" stroke-width="${fmt(stroke.width)}"` +
    ` stroke-linecap="round" stroke-linejoin="round"${opacity ? ` stroke-opacity="${opacity}"` : ''}/>`
  );
}

function padded(b: Bounds): Bounds {
  return {
    minX: Math.floor(b.minX - MARGIN),
    minY: Math.floor(b.minY - MARGIN),
    maxX: Math.ceil(b.maxX + MARGIN),
    maxY: Math.ceil(b.maxY + MARGIN),
  };
}

function snapshotOf(background: HwBackground, strokes: HwStroke[], b: Bounds): HwSnapshot {
  const bg = backgroundPathData(background, b);
  const width = b.maxX - b.minX;
  const height = b.maxY - b.minY;
  const body =
    `<rect x="${b.minX}" y="${b.minY}" width="${width}" height="${height}" fill="${PAPER}"/>` +
    (bg ? `<path d="${bg}" fill="none" stroke="${background === 'grid' ? GRID_COLOR : LINE_COLOR}" stroke-width="1"/>` : '') +
    `<g>${strokes.map(strokeSvg).join('')}</g>`;
  return { x: b.minX, y: b.minY, width, height, body };
}

/** Snapshot of one page cropped to its ink (plus a margin), or null for an empty page. */
export function renderPageSnapshot(page: HwPage): HwSnapshot | null {
  const content = unionBounds(page.strokes.map(strokeBounds));
  if (!content) return null;
  return snapshotOf(page.background, page.strokes, padded(content));
}

/** One snapshot per non-empty page, in page order. */
export function renderSnapshots(doc: HandwritingDoc): HwSnapshot[] {
  return doc.pages.map(renderPageSnapshot).filter((s): s is HwSnapshot => s !== null);
}

/**
 * Teaser: the strokes lying entirely in the top PREVIEW_FRACTION of the
 * first non-empty page. Built from the strokes themselves, so nothing below
 * the cut is ever in the markup.
 */
export function renderPreview(doc: HandwritingDoc): HwSnapshot | null {
  const page = doc.pages.find((p) => p.strokes.length > 0);
  if (!page) return null;
  const content = unionBounds(page.strokes.map(strokeBounds));
  if (!content) return null;
  const cut = content.minY + (content.maxY - content.minY) * PREVIEW_FRACTION;
  const top = page.strokes.filter((s) => strokeBounds(s).maxY <= cut);
  const b = padded({ ...content, maxY: cut });
  return snapshotOf(page.background, top, b);
}

/** A standalone SVG document for a snapshot (downloads, tests). */
export function snapshotToSvg(s: HwSnapshot): string {
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${s.x} ${s.y} ${s.width} ${s.height}"` +
    ` width="${s.width}" height="${s.height}">${s.body}</svg>`
  );
}
