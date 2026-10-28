import type { Matrix, Rect } from '../types';

/**
 * The box the site actually paints the viewer's SVG in. Chromium snaps an SVG
 * root to whole CSS pixels in normal page layout (711.39 → 711); inside the
 * video's transformed layers nothing is snapped, so the replay must be placed
 * at the snapped box explicitly or it lands a fraction of a pixel off.
 */
export function paintedBox(clip: Rect): Rect {
  return [Math.round(clip[0]), Math.round(clip[1]), clip[2], clip[3]];
}

/** The same snap applied to a captured logical→screen matrix (used for the camera and the pencil). */
export function snapMatrix(m: Matrix, clip: Rect): Matrix {
  return [m[0], m[1], m[2], m[3], m[4] + Math.round(clip[0]) - clip[0], m[5] + Math.round(clip[1]) - clip[1]];
}
