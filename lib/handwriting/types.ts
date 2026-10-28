/**
 * Handwritten worked solutions: the stored vector format.
 *
 * A question's handwriting is one HandwritingDoc. Coordinates are in a fixed
 * logical space (CSS px at 100% zoom, y down); zoom and pan only change the
 * view, never these numbers. A stroke's page index is its page's position in
 * `pages`. Pure types, safe for client and server.
 */

export const HANDWRITING_FORMAT = 1;

export type HwTool = 'pen' | 'highlighter' | 'shape';
/** `polyline` is what a shape becomes once the pixel eraser has cut it. */
export type HwShape = 'line' | 'arrow' | 'rect' | 'ellipse' | 'polyline';
export type HwBackground = 'blank' | 'grid' | 'lined';

/**
 * [x, y, pressure 0–1, t?]. Strokes drawn without a pen record 0.5.
 * `t` (ms since the stroke's first point) is recorded for strokes drawn since
 * 2026-10-28 so they can be replayed at the writer's pace; older strokes have
 * three numbers and stay valid. Nothing that draws a stroke reads `t`.
 */
export type HwPoint = [x: number, y: number, pressure: number, t?: number];

export interface HwStroke {
  id: string;
  tool: HwTool;
  /** Only for tool = 'shape'. line/arrow/rect/ellipse use points[0] → points[1]. */
  shape?: HwShape;
  /** #rrggbb */
  color: string;
  /** Pen/highlighter: nib diameter at mid pressure. Shapes: line width. */
  width: number;
  /** 0–1 */
  opacity: number;
  /** True when the points carry real pen pressure; otherwise it is simulated from speed. */
  pressure: boolean;
  /** When the stroke was started, ms since the Unix epoch (strokes drawn since 2026-10-28). */
  t0?: number;
  points: HwPoint[];
}

export interface HwPage {
  id: string;
  background: HwBackground;
  strokes: HwStroke[];
}

export interface HandwritingDoc {
  v: typeof HANDWRITING_FORMAT;
  pages: HwPage[];
}

/** A rendered page: `body` is SVG markup for viewBox `x y width height`. */
export interface HwSnapshot {
  x: number;
  y: number;
  width: number;
  height: number;
  body: string;
}

export interface Bounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export function emptyPage(id: string, background: HwBackground = 'grid'): HwPage {
  return { id, background, strokes: [] };
}

export function emptyDoc(firstPageId = 'p1'): HandwritingDoc {
  return { v: HANDWRITING_FORMAT, pages: [emptyPage(firstPageId)] };
}

export function countStrokes(doc: HandwritingDoc): number {
  return doc.pages.reduce((n, p) => n + p.strokes.length, 0);
}

/** Short random id for pages and strokes. */
export function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
