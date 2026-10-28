/**
 * Server-side validation of a handwriting document before it is stored.
 * Everything that later ends up in the SVG markup is constrained here
 * (numbers, #rrggbb colours, known enums), and numbers are rounded so the
 * stored JSON stays compact.
 */

import { z } from 'zod';
import { HANDWRITING_FORMAT, type HandwritingDoc, type HwPoint } from './types';
import { round1, round2 } from './geometry';

export const MAX_PAGES = 30;
export const MAX_STROKES_PER_PAGE = 6000;
export const MAX_POINTS_PER_STROKE = 10000;
export const MAX_TOTAL_POINTS = 300000;
/** Request body ceiling (Vercel functions refuse bodies over ~4.5 MB). */
export const MAX_BODY_BYTES = 4_000_000;

const COORD_LIMIT = 1_000_000;
const coord = z.number().finite().min(-COORD_LIMIT).max(COORD_LIMIT);
const point = z.tuple([coord, coord, z.number().finite().min(0).max(1)]);
const id = z.string().regex(/^[A-Za-z0-9_-]{1,40}$/, 'bad id');

const stroke = z
  .object({
    id,
    tool: z.enum(['pen', 'highlighter', 'shape']),
    shape: z.enum(['line', 'arrow', 'rect', 'ellipse', 'polyline']).optional(),
    color: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'colour must be #rrggbb'),
    width: z.number().finite().min(0.5).max(120),
    opacity: z.number().finite().min(0.05).max(1),
    pressure: z.boolean(),
    points: z.array(point).min(1).max(MAX_POINTS_PER_STROKE),
  })
  .refine((s) => s.tool !== 'shape' || (s.shape !== undefined && (s.shape === 'polyline' || s.points.length >= 2)), {
    message: 'a shape needs a kind and two points',
  });

const page = z.object({
  id,
  background: z.enum(['blank', 'grid', 'lined']),
  strokes: z.array(stroke).max(MAX_STROKES_PER_PAGE),
});

const docSchema = z.object({
  v: z.literal(HANDWRITING_FORMAT),
  pages: z.array(page).min(1).max(MAX_PAGES),
});

export type ParseResult = { ok: true; doc: HandwritingDoc } | { ok: false; error: string };

export function parseHandwritingDoc(input: unknown): ParseResult {
  const parsed = docSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return { ok: false, error: `Invalid handwriting (${issue.path.join('.') || 'doc'}: ${issue.message})` };
  }
  let total = 0;
  for (const p of parsed.data.pages) for (const s of p.strokes) total += s.points.length;
  if (total > MAX_TOTAL_POINTS) return { ok: false, error: 'This solution has too much ink to save. Erase some strokes or use fewer pages.' };

  const doc: HandwritingDoc = {
    v: HANDWRITING_FORMAT,
    pages: parsed.data.pages.map((p) => ({
      id: p.id,
      background: p.background,
      strokes: p.strokes.map((s) => ({
        id: s.id,
        tool: s.tool,
        ...(s.tool === 'shape' ? { shape: s.shape } : {}),
        color: s.color.toLowerCase(),
        width: round2(s.width),
        opacity: round2(s.opacity),
        pressure: s.pressure,
        points: s.points.map(([x, y, pr]) => [round1(x), round1(y), round2(pr)] as HwPoint),
      })),
    })),
  };
  return { ok: true, doc };
}
