/**
 * Where each page sits inside the student viewer's SVG — the same layout as
 * components/handwriting/HandwritingViewer.tsx (snapshots stacked top to
 * bottom, centred, 24 px apart; empty pages have no snapshot). The replay
 * reproduces the viewer's own SVG structure with these offsets so the browser
 * places (and pixel-snaps) the replayed ink exactly as it places the real ink.
 */

import type { HandwritingDoc, HwSnapshot } from '@site/lib/handwriting/types';

/** Must match GAP in components/handwriting/HandwritingViewer.tsx. */
export const VIEWER_PAGE_GAP = 24;

/** Doc page index → index of its snapshot (null for an empty page). */
export function pageSlots(doc: HandwritingDoc): (number | null)[] {
  let slot = 0;
  return doc.pages.map((p) => (p.strokes.length > 0 ? slot++ : null));
}

/** Doc page index → the translate() of its group inside the viewer's SVG (null for an empty page). */
export function viewerPageOffsets(doc: HandwritingDoc, snapshots: HwSnapshot[]): ([number, number] | null)[] {
  const width = Math.max(1, ...snapshots.map((s) => s.width));
  let y = 0;
  const offsets = snapshots.map((s) => {
    const o: [number, number] = [(width - s.width) / 2 - s.x, y - s.y];
    y += s.height + VIEWER_PAGE_GAP;
    return o;
  });
  return pageSlots(doc).map((slot) => (slot === null ? null : offsets[slot] ?? null));
}
