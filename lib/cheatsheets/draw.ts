/**
 * Small geometry helpers for writing diagram data. Screen coordinates: x to
 * the right, y DOWN. Angles in degrees, anticlockwise as seen on screen,
 * 0° = +x (so 90° points up the page).
 */

import type { Point } from './types';

export function round(n: number) {
  return Math.round(n * 10) / 10;
}

export function rad(deg: number) {
  return (deg * Math.PI) / 180;
}

/** Unit vector at `deg` (anticlockwise on screen from +x). */
export function dir(deg: number): Point {
  return [Math.cos(rad(deg)), -Math.sin(rad(deg))];
}

/** The point at `deg` on a circle. */
export function onCircle(centre: Point, radius: number, deg: number): Point {
  const [dx, dy] = dir(deg);
  return [round(centre[0] + radius * dx), round(centre[1] + radius * dy)];
}

/** Unit vector along the anticlockwise tangent at `deg`. */
export function tangent(deg: number): Point {
  return dir(deg + 90);
}

/** Unit vector from the point at `deg` towards the centre. */
export function inward(deg: number): Point {
  return dir(deg + 180);
}

export function along(p: Point, d: Point, length: number): Point {
  return [round(p[0] + d[0] * length), round(p[1] + d[1] * length)];
}

export function add(a: Point, b: Point): Point {
  return [round(a[0] + b[0]), round(a[1] + b[1])];
}

export function sub(a: Point, b: Point): Point {
  return [a[0] - b[0], a[1] - b[1]];
}

export function unit(v: Point): Point {
  const len = Math.hypot(v[0], v[1]) || 1;
  return [v[0] / len, v[1] / len];
}

/** Direction (degrees, screen-anticlockwise from +x) of the vector a → b. */
export function angleOf(a: Point, b: Point): number {
  return (Math.atan2(-(b[1] - a[1]), b[0] - a[0]) * 180) / Math.PI;
}
