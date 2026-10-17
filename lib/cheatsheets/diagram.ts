/**
 * Turns diagram data into exact SVG primitives: paths with fixed stroke
 * widths, filled arrowheads, angle arcs and hatching. Pure, so it runs on the
 * server (diagrams are in the first paint, in print and in the PDF) and in
 * tests.
 *
 * Colours are not set here. Each primitive carries its role and the stylesheet
 * maps roles to colours (`currentColor`), so dark mode and printing restyle the
 * same SVG.
 */

import { add, rad, sub, unit } from './draw';
import type { Diagram, DiagramRole, DiagramShape, Point } from './types';

export interface SvgPath {
  role: DiagramRole;
  d: string;
  fill: 'none' | 'currentColor' | 'soft';
  strokeWidth: number;
  dashed: boolean;
}

export interface SvgLabel {
  role: DiagramRole;
  at: Point;
  text: string;
  anchor: 'start' | 'middle' | 'end';
  style: 'math' | 'note';
}

const HEAD_LENGTH = 10;
const HEAD_WIDTH = 7;

function strokeWidthFor(role: DiagramRole) {
  if (role === 'force' || role === 'velocity' || role === 'acceleration') return 2.2;
  if (role === 'muted') return 1.2;
  return 1.6;
}

const f = (n: number) => Math.round(n * 100) / 100;
const M = (p: Point) => `M${f(p[0])} ${f(p[1])}`;
const L = (p: Point) => `L${f(p[0])} ${f(p[1])}`;

/** The arrowhead triangle at `to` for an arrow from `from`: tip, then the two back corners. */
export function arrowHead(from: Point, to: Point, length = HEAD_LENGTH, width = HEAD_WIDTH): Point[] {
  const [ux, uy] = unit(sub(to, from));
  const back: Point = [to[0] - ux * length, to[1] - uy * length];
  const half = width / 2;
  return [to, [back[0] - uy * half, back[1] + ux * half], [back[0] + uy * half, back[1] - ux * half]];
}

/** SVG arc path for an angle marker, degrees anticlockwise on screen. */
export function arcPath(centre: Point, radius: number, fromDeg: number, toDeg: number): string {
  const p = (deg: number): Point => [centre[0] + radius * Math.cos(rad(deg)), centre[1] - radius * Math.sin(rad(deg))];
  const sweep = toDeg - fromDeg;
  const large = Math.abs(sweep) > 180 ? 1 : 0;
  // Screen y points down, so anticlockwise on screen is SVG sweep-flag 0.
  const flag = sweep > 0 ? 0 : 1;
  return `${M(p(fromDeg))} A${f(radius)} ${f(radius)} 0 ${large} ${flag} ${f(p(toDeg)[0])} ${f(p(toDeg)[1])}`;
}

export function renderDiagram(diagram: Diagram): { paths: SvgPath[]; labels: SvgLabel[] } {
  const paths: SvgPath[] = [];
  const labels: SvgLabel[] = [];
  const stroke = (role: DiagramRole, d: string, dashed = false, width = strokeWidthFor(role)) =>
    paths.push({ role, d, fill: 'none', strokeWidth: width, dashed });
  const filled = (role: DiagramRole, d: string, fill: SvgPath['fill'] = 'currentColor') =>
    paths.push({ role, d, fill, strokeWidth: fill === 'soft' ? strokeWidthFor(role) : 0, dashed: false });

  for (const shape of diagram.shapes as DiagramShape[]) {
    switch (shape.kind) {
      case 'circle': {
        const role = shape.role ?? 'ink';
        const [cx, cy] = shape.centre;
        const r = shape.radius;
        const d = `M${f(cx - r)} ${f(cy)} a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0 a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`;
        if (shape.fill === 'soft') filled(role, d, 'soft');
        else stroke(role, d, shape.dashed);
        break;
      }
      case 'ellipse': {
        const role = shape.role ?? 'ink';
        const [cx, cy] = shape.centre;
        const { rx, ry } = shape;
        stroke(
          role,
          `M${f(cx - rx)} ${f(cy)} a${f(rx)} ${f(ry)} 0 1 0 ${f(2 * rx)} 0 a${f(rx)} ${f(ry)} 0 1 0 ${f(-2 * rx)} 0Z`,
          shape.dashed,
        );
        break;
      }
      case 'line': {
        const role = shape.role ?? 'ink';
        stroke(role, `${M(shape.from)} ${L(shape.to)}`, shape.dashed, shape.thin ? 1 : strokeWidthFor(role));
        break;
      }
      case 'arrow': {
        const head = arrowHead(shape.from, shape.to);
        // The shaft stops inside the head so the tip stays sharp.
        const [ux, uy] = unit(sub(shape.to, shape.from));
        const shaftEnd: Point = [shape.to[0] - ux * HEAD_LENGTH * 0.7, shape.to[1] - uy * HEAD_LENGTH * 0.7];
        stroke(shape.role, `${M(shape.from)} ${L(shaftEnd)}`, shape.dashed);
        filled(shape.role, `${M(head[0])} ${L(head[1])} ${L(head[2])}Z`);
        break;
      }
      case 'dot': {
        const role = shape.role ?? 'ink';
        const [cx, cy] = shape.at;
        const r = shape.radius;
        filled(role, `M${f(cx - r)} ${f(cy)} a${f(r)} ${f(r)} 0 1 0 ${f(2 * r)} 0 a${f(r)} ${f(r)} 0 1 0 ${f(-2 * r)} 0Z`);
        break;
      }
      case 'polygon': {
        const role = shape.role ?? 'ink';
        const d = `${M(shape.points[0])} ${shape.points.slice(1).map(L).join(' ')}Z`;
        if (shape.fill === 'soft') filled(role, d, 'soft');
        else stroke(role, d);
        break;
      }
      case 'arc':
        stroke(shape.role ?? 'ink', arcPath(shape.centre, shape.radius, shape.from, shape.to), false, 1.2);
        break;
      case 'rightAngle': {
        const a = unit(shape.a);
        const b = unit(shape.b);
        const s = shape.size;
        const p1: Point = [shape.at[0] + a[0] * s, shape.at[1] + a[1] * s];
        const p2: Point = [p1[0] + b[0] * s, p1[1] + b[1] * s];
        const p3: Point = [shape.at[0] + b[0] * s, shape.at[1] + b[1] * s];
        stroke(shape.role ?? 'ink', `${M(p1)} ${L(p2)} ${L(p3)}`, false, 1.1);
        break;
      }
      case 'cross': {
        const { at, size } = shape;
        stroke('ink', `M${f(at[0] - size)} ${f(at[1] - size)} L${f(at[0] + size)} ${f(at[1] + size)}`);
        stroke('ink', `M${f(at[0] - size)} ${f(at[1] + size)} L${f(at[0] + size)} ${f(at[1] - size)}`);
        break;
      }
      case 'surface': {
        stroke('ink', `${M(shape.from)} ${L(shape.to)}`, false, 1.6);
        // Short hatches every 10 units, on the chosen side, at 45° to the surface.
        const along = sub(shape.to, shape.from);
        const len = Math.hypot(along[0], along[1]);
        const u = unit(along);
        const n: Point = shape.side === 'left' ? [u[1], -u[0]] : [-u[1], u[0]];
        const hatch: Point = unit(add(n, [-u[0], -u[1]]));
        let d = '';
        for (let s = 6; s < len; s += 10) {
          const p: Point = [shape.from[0] + u[0] * s, shape.from[1] + u[1] * s];
          d += `${M(p)} ${L([p[0] + hatch[0] * 7, p[1] + hatch[1] * 7])} `;
        }
        stroke('muted', d.trim(), false, 1);
        break;
      }
      case 'label':
        labels.push({
          role: shape.role ?? 'ink',
          at: shape.at,
          text: shape.text,
          anchor: shape.anchor ?? 'start',
          style: shape.style ?? 'math',
        });
        break;
    }
  }
  return { paths, labels };
}

/**
 * Splits a math label into runs: letters italic, `_x` / `_{xy}` an upright
 * subscript, `|cos|` upright text (function names, units).
 * "F_T |cos| θ" → F (italic), T (subscript), " ", cos (upright), " θ" (italic).
 */
export function labelRuns(text: string): { text: string; sub: boolean; upright: boolean }[] {
  const runs: { text: string; sub: boolean; upright: boolean }[] = [];
  const re = /_(\{([^}]*)\}|(.))|\|([^|]*)\|/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) runs.push({ text: text.slice(last, m.index), sub: false, upright: false });
    if (m[4] !== undefined) runs.push({ text: m[4], sub: false, upright: true });
    else runs.push({ text: m[2] ?? m[3], sub: true, upright: true });
    last = m.index + m[0].length;
  }
  if (last < text.length) runs.push({ text: text.slice(last), sub: false, upright: false });
  return runs;
}

/** The colour-coded roles the diagrams use, for the legend, in a fixed order. */
export function rolesUsed(diagrams: Diagram[]): DiagramRole[] {
  const order: DiagramRole[] = ['force', 'velocity', 'acceleration'];
  const used = new Set(
    diagrams.flatMap((d) => d.shapes.filter((s) => s.kind === 'arrow').map((s) => ('role' in s ? s.role : undefined))),
  );
  return order.filter((r) => used.has(r));
}
