/**
 * Turns a cheat-sheet diagram (plain data) into hand-drawn SVG paths with
 * Rough.js's generator. The generator needs no DOM, so diagrams render on the
 * server: they are in the first paint, in print and in the PDF, with no
 * client JavaScript. Every shape gets a fixed seed, so the wobble is the same
 * on every render.
 *
 * Colours are not set here. Each path carries its role and the stylesheet maps
 * roles to colours (`currentColor`), so dark mode and ink-saver printing just
 * restyle the same SVG.
 */

import rough from 'roughjs';
import type { Options } from 'roughjs/bin/core';
import type { Diagram, DiagramRole, DiagramShape, Point } from './types';

export interface RoughPath {
  role: DiagramRole;
  d: string;
  /** `currentColor` for filled shapes (dots, arrowheads), otherwise none. */
  fill: 'currentColor' | 'none';
  strokeWidth: number;
  dashed: boolean;
}

export interface RoughLabel {
  role: DiagramRole;
  at: Point;
  text: string;
  anchor: 'start' | 'middle' | 'end';
  size: 'sm' | 'md';
}

const ARROW_HEAD = 9;

function strokeWidthFor(role: DiagramRole) {
  if (role === 'force' || role === 'velocity' || role === 'acceleration') return 2.2;
  if (role === 'muted') return 1.3;
  return 1.6;
}

function sub(a: Point, b: Point): Point {
  return [a[0] - b[0], a[1] - b[1]];
}
function unit(v: Point): Point {
  const len = Math.hypot(v[0], v[1]) || 1;
  return [v[0] / len, v[1] / len];
}

/** The filled triangle at the tip of an arrow pointing from `from` to `to`. */
export function arrowHead(from: Point, to: Point, size = ARROW_HEAD): Point[] {
  const [ux, uy] = unit(sub(to, from));
  const back: Point = [to[0] - ux * size, to[1] - uy * size];
  const half = size * 0.5;
  return [to, [back[0] - uy * half, back[1] + ux * half], [back[0] + uy * half, back[1] - ux * half]];
}

export function renderDiagram(diagram: Diagram): { paths: RoughPath[]; labels: RoughLabel[] } {
  const gen = rough.generator();
  const paths: RoughPath[] = [];
  const labels: RoughLabel[] = [];
  let n = 0;

  const opts = (role: DiagramRole, extra: Options = {}): Options => ({
    seed: diagram.seed * 100 + ++n,
    roughness: 1.1,
    bowing: 0.8,
    stroke: 'currentColor',
    strokeWidth: strokeWidthFor(role),
    disableMultiStroke: role === 'muted',
    ...extra,
  });

  const push = (role: DiagramRole, drawable: ReturnType<typeof gen.line>, dashed = false) => {
    for (const p of gen.toPaths(drawable)) {
      const filled = p.fill !== undefined && p.fill !== 'none';
      paths.push({ role, d: p.d, fill: filled ? 'currentColor' : 'none', strokeWidth: p.strokeWidth, dashed: dashed && !filled });
    }
  };

  for (const shape of diagram.shapes as DiagramShape[]) {
    switch (shape.kind) {
      case 'circle': {
        const role = shape.role ?? 'ink';
        push(role, gen.circle(shape.centre[0], shape.centre[1], shape.radius * 2, opts(role)), shape.dashed);
        break;
      }
      case 'line': {
        const role = shape.role ?? 'ink';
        push(role, gen.line(shape.from[0], shape.from[1], shape.to[0], shape.to[1], opts(role)), shape.dashed);
        break;
      }
      case 'arrow': {
        const head = arrowHead(shape.from, shape.to);
        // The shaft stops at the base of the head so the tip stays sharp.
        const [ux, uy] = unit(sub(shape.to, shape.from));
        const shaftEnd: Point = [shape.to[0] - ux * ARROW_HEAD * 0.8, shape.to[1] - uy * ARROW_HEAD * 0.8];
        push(shape.role, gen.line(shape.from[0], shape.from[1], shaftEnd[0], shaftEnd[1], opts(shape.role)), shape.dashed);
        push(
          shape.role,
          gen.polygon(head, opts(shape.role, { fill: 'currentColor', fillStyle: 'solid', roughness: 0.4, strokeWidth: 1 })),
        );
        break;
      }
      case 'dot': {
        const role = shape.role ?? 'ink';
        push(
          role,
          gen.circle(
            shape.at[0],
            shape.at[1],
            shape.radius * 2,
            opts(role, { fill: 'currentColor', fillStyle: 'solid', roughness: 0.6 }),
          ),
        );
        break;
      }
      case 'rightAngle': {
        const role = shape.role ?? 'ink';
        const a = unit(shape.a);
        const b = unit(shape.b);
        const s = shape.size;
        const p1: Point = [shape.at[0] + a[0] * s, shape.at[1] + a[1] * s];
        const p2: Point = [p1[0] + b[0] * s, p1[1] + b[1] * s];
        const p3: Point = [shape.at[0] + b[0] * s, shape.at[1] + b[1] * s];
        push(role, gen.linearPath([p1, p2, p3], opts(role, { strokeWidth: 1.1, roughness: 0.5 })));
        break;
      }
      case 'cross': {
        const { at, size } = shape;
        push('ink', gen.line(at[0] - size, at[1] - size, at[0] + size, at[1] + size, opts('ink')));
        push('ink', gen.line(at[0] - size, at[1] + size, at[0] + size, at[1] - size, opts('ink')));
        break;
      }
      case 'label':
        labels.push({
          role: shape.role ?? 'ink',
          at: shape.at,
          text: shape.text,
          anchor: shape.anchor ?? 'start',
          size: shape.size ?? 'md',
        });
        break;
    }
  }
  return { paths, labels };
}

/** The colour-coded roles a diagram uses, for its legend. */
export function rolesUsed(diagrams: Diagram[]): DiagramRole[] {
  const order: DiagramRole[] = ['force', 'velocity', 'acceleration'];
  const used = new Set(diagrams.flatMap((d) => d.shapes.map((s) => ('role' in s ? s.role : undefined))));
  return order.filter((r) => used.has(r));
}
