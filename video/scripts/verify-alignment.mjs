#!/usr/bin/env node
/**
 * Pixel check of the handwriting replay against the real viewer: renders the
 * LAST frame of the ReplayCheck composition (plate + replayed ink, at the
 * capture's own pixel scale) and compares it, inside the viewer box, with the
 * reference capture of the same view showing the stored ink.
 *
 *   npm run verify -- --update=<slug>
 *
 * Reports, per handwriting scene: mean channel difference, the share of
 * pixels that differ by more than 24/255 (anti-aliasing noise sits below it),
 * how much of the stored ink the replay covers and how much replayed ink the
 * stored page does not have (drift / doubled / missing strokes show up in
 * these two), and writes a 4×-amplified difference image to out/<slug>/.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { args, readJson, updateDir, VIDEO_DIR } from './lib.mjs';
import { ffmpegBin, readRgb } from './images.mjs';
import { still } from './remotion.mjs';

const opts = args();
const slug = opts.update;
const dir = updateDir(slug);
const config = readJson(path.join(dir, 'config.json'));
const manifest = readJson(path.join(VIDEO_DIR, 'public', 'captures', slug, 'manifest.json'));
const out = path.join(VIDEO_DIR, 'out', slug);
mkdirSync(out, { recursive: true });

const results = [];
for (const scene of config.scenes.filter((s) => s.type === 'handwriting')) {
  const plate = manifest.shots[scene.plate];
  const ref = manifest.shots[scene.reference];
  const scale = ref.scale;
  const frames = Math.round(scene.seconds * config.fps);
  const file = path.join(out, `check-${scene.id}-last.png`);
  await still('ReplayCheck', { slug, scene: scene.id, mode: 'replay', showIndices: false, showHud: false }, { frame: frames - 1, output: file, scale });
  const [cx, cy, cw, ch] = plate.ink.clip;
  // Inset by 2 px: the viewer's own border/scrollbar edge is not part of the page.
  const crop = { x: Math.round((cx + 2) * scale), y: Math.round((cy + 2) * scale), w: Math.floor((cw - 4) * scale / 2) * 2, h: Math.floor((ch - 4) * scale / 2) * 2 };
  const a = readRgb(file, crop);
  const b = readRgb(path.join(VIDEO_DIR, 'public', 'captures', slug, ref.file), crop);
  const platePx = readRgb(path.join(VIDEO_DIR, 'public', 'captures', slug, plate.file), crop);
  let sum = 0;
  let over = 0;
  const n = a.length / 3;
  // "Ink" = clearly different from the empty plate at that pixel.
  const inkMask = (img) => {
    const m = new Uint8Array(n);
    for (let i = 0, j = 0; i < img.length; i += 3, j++) {
      m[j] = Math.max(Math.abs(img[i] - platePx[i]), Math.abs(img[i + 1] - platePx[i + 1]), Math.abs(img[i + 2] - platePx[i + 2])) > 60 ? 1 : 0;
    }
    return m;
  };
  for (let i = 0; i < a.length; i += 3) {
    const d = Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2]));
    sum += Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]);
    if (d > 24) over++;
  }
  const mr = inkMask(b);
  const mp = inkMask(a);
  // Exact overlap, and overlap allowing 1 device pixel (anti-aliasing on stroke edges).
  const near = (m, j) => {
    const x = j % crop.w;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const k = j + dy * crop.w + dx;
      if (x + dx >= 0 && x + dx < crop.w && k >= 0 && k < n && m[k]) return true;
    }
    return false;
  };
  let inkRef = 0;
  let inkBoth = 0;
  let inkExtra = 0;
  let missing1 = 0;
  let extra1 = 0;
  for (let j = 0; j < n; j++) {
    if (mr[j]) {
      inkRef++;
      if (mp[j]) inkBoth++;
      else if (!near(mp, j)) missing1++;
    }
    if (mp[j] && !mr[j]) {
      inkExtra++;
      if (!near(mr, j)) extra1++;
    }
  }
  const diffFile = path.join(out, `check-${scene.id}-difference.png`);
  execFileSync(ffmpegBin(), [
    '-v', 'error', '-y', '-i', file, '-i', path.join(VIDEO_DIR, 'public', 'captures', slug, ref.file),
    '-filter_complex', `[0]crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}[a];[1]crop=${crop.w}:${crop.h}:${crop.x}:${crop.y}[b];[a][b]blend=all_mode=difference,lutrgb=r='min(255,val*4)':g='min(255,val*4)':b='min(255,val*4)'`,
    diffFile,
  ]);
  const r = {
    scene: scene.id,
    strokes: scene.strokes,
    pixels: n,
    meanAbsDiff: +(sum / (n * 3)).toFixed(3),
    pixelsOver24: over,
    pixelsOver24Pct: +((over / n) * 100).toFixed(4),
    storedInkCoveredPct: +((inkBoth / Math.max(1, inkRef)) * 100).toFixed(3),
    extraInkPct: +((inkExtra / Math.max(1, inkRef)) * 100).toFixed(3),
    storedInkMissingBeyond1pxPct: +((missing1 / Math.max(1, inkRef)) * 100).toFixed(4),
    extraInkBeyond1pxPct: +((extra1 / Math.max(1, inkRef)) * 100).toFixed(4),
    differenceImage: path.relative(process.cwd(), diffFile),
  };
  results.push(r);
  console.log(r);
}
writeFileSync(path.join(out, 'alignment.json'), JSON.stringify(results, null, 2));
// Missing or extra ink further than one device pixel from the stored ink = a missing, doubled or drifted stroke.
const bad = results.filter((r) => r.storedInkMissingBeyond1pxPct > 0.05 || r.extraInkBeyond1pxPct > 0.05 || r.storedInkCoveredPct < 98);
if (bad.length) {
  console.error(`Alignment check FAILED for: ${bad.map((r) => r.scene).join(', ')}`);
  process.exit(1);
}
console.log('Alignment check passed: the replay ends exactly on the stored page.');
