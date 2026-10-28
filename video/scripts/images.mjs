/** Raw pixel access through ffmpeg (no image libraries needed). */

import { execFileSync } from 'node:child_process';

export function ffmpegBin() {
  return process.env.FFMPEG_PATH || 'ffmpeg';
}

/** Decode (a crop of) an image to RGB bytes. */
export function readRgb(file, crop) {
  const vf = crop ? ['-vf', `crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}`] : [];
  return execFileSync(ffmpegBin(), ['-v', 'error', '-i', file, ...vf, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: 1 << 30 });
}

export function imageSize(file) {
  const out = execFileSync('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file]).toString().trim();
  const [w, h] = out.split(',').map(Number);
  return { w, h };
}
