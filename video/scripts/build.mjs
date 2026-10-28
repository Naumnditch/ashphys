#!/usr/bin/env node
/**
 * Render one announcement end to end.
 *
 *   npm run video:build -- --update=<slug>          (from the site root)
 *   npm run build -- --update=<slug> [--only=master,hero,vertical,poster]   (from video/)
 *
 * 1. Remotion renders near-lossless intermediates of the master (16:9 1080p),
 *    the hero loop (720p) and the vertical cut (9:16) from the same template.
 * 2. ffmpeg makes the web files:
 *    - master  1920×1080 H.264 (CRF 20, yuv420p, faststart) + VP9 WebM
 *    - hero    1280×720 H.264 + VP9, two-pass to stay under outputs.heroLoop.maxBytes
 *    - vertical 1080×1920 H.264 + VP9
 *    All silent (no audio track).
 * 3. Poster (WebP + JPG) from outputs.poster, captions (.srt + .vtt) from the
 *    same caption list that is burned in.
 * Output: video/out/<slug>/ (git-ignored) and a build.json summary.
 */

import { execFileSync } from 'node:child_process';
import { mkdirSync, statSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { args, readJson, updateDir, VIDEO_DIR } from './lib.mjs';
import { ffmpegBin } from './images.mjs';
import { composition, media, still } from './remotion.mjs';

const opts = args();
const slug = opts.update;
const dir = updateDir(slug);
const config = readJson(path.join(dir, 'config.json'));
if (!existsSync(path.join(VIDEO_DIR, 'public', 'captures', slug, 'manifest.json'))) {
  console.error(`No captures for ${slug}: run npm run capture -- --update=${slug} first.`);
  process.exit(1);
}
const only = opts.only ? new Set(String(opts.only).split(',')) : null;
const want = (k) => !only || only.has(k);
const out = path.join(VIDEO_DIR, 'out', slug);
mkdirSync(out, { recursive: true });
const f = (name) => path.join(out, name);

const ff = (...a) => execFileSync(ffmpegBin(), ['-v', 'error', '-y', ...a], { stdio: 'inherit' });
const size = (file) => statSync(file).size;
const mb = (n) => `${(n / 1e6).toFixed(2)} MB`;
const duration = (file) =>
  Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).toString().trim());

const X264 = ['-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', '-an'];
const VP9 = ['-c:v', 'libvpx-vp9', '-pix_fmt', 'yuv420p', '-row-mt', '1', '-deadline', 'good', '-cpu-used', '2', '-an'];

function encodeQuality(input, base) {
  ff('-i', input, ...X264, '-preset', 'slow', '-crf', '20', f(`${base}.mp4`));
  const log = f(`${base}-vp9`);
  ff('-i', input, ...VP9, '-b:v', '0', '-crf', '33', '-pass', '1', '-passlogfile', log, '-f', 'webm', '/dev/null');
  ff('-i', input, ...VP9, '-b:v', '0', '-crf', '33', '-pass', '2', '-passlogfile', log, f(`${base}.webm`));
}

/** Two-pass to a byte budget (the hero loop must stay small). */
function encodeBudget(input, base, maxBytes) {
  const seconds = duration(input);
  let kbps = Math.floor(((maxBytes * 0.9 * 8) / seconds) / 1000);
  for (let attempt = 0; attempt < 4; attempt++) {
    const log264 = f(`${base}-x264`);
    ff('-i', input, ...X264, '-preset', 'slow', '-b:v', `${kbps}k`, '-maxrate', `${Math.round(kbps * 1.5)}k`, '-bufsize', `${kbps * 2}k`, '-g', '60', '-pass', '1', '-passlogfile', log264, '-f', 'mp4', '/dev/null');
    ff('-i', input, ...X264, '-preset', 'slow', '-b:v', `${kbps}k`, '-maxrate', `${Math.round(kbps * 1.5)}k`, '-bufsize', `${kbps * 2}k`, '-g', '60', '-pass', '2', '-passlogfile', log264, f(`${base}.mp4`));
    const logvp9 = f(`${base}-vp9`);
    const vk = Math.round(kbps * 0.85);
    ff('-i', input, ...VP9, '-b:v', `${vk}k`, '-g', '60', '-pass', '1', '-passlogfile', logvp9, '-f', 'webm', '/dev/null');
    ff('-i', input, ...VP9, '-b:v', `${vk}k`, '-g', '60', '-pass', '2', '-passlogfile', logvp9, f(`${base}.webm`));
    const biggest = Math.max(size(f(`${base}.mp4`)), size(f(`${base}.webm`)));
    if (biggest <= maxBytes) return kbps;
    kbps = Math.floor(kbps * 0.85);
  }
  throw new Error(`${base}: could not get under ${mb(maxBytes)}`);
}

const ts = (s, sep) => {
  const ms = Math.round(s * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  const rest = ms % 1000;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}${sep}${String(rest).padStart(3, '0')}`;
};

const previous = existsSync(f('build.json')) && only ? readJson(f('build.json')) : null;
const summary = { slug, builtAt: previous?.builtAt ?? new Date().toISOString(), files: { ...(previous?.files ?? {}) } };
const note = (key, file, extra = {}) => {
  summary.files[key] = { file: path.relative(VIDEO_DIR, file), bytes: size(file), ...extra };
  console.log(`  ${key}: ${path.relative(process.cwd(), file)} (${mb(size(file))})`);
};

// Captions and timing come from the composition itself, so they always match the render.
const master = await composition('Announcement', { slug, variant: 'master' });
const data = master.props.data;
writeFileSync(f('captions.srt'), data.captions.map((c, i) => `${i + 1}\n${ts(c.from, ',')} --> ${ts(c.to, ',')}\n${c.text}\n`).join('\n'));
writeFileSync(f('captions.vtt'), `WEBVTT\n\n${data.captions.map((c) => `${ts(c.from, '.')} --> ${ts(c.to, '.')}\n${c.text}\n`).join('\n')}`);
note('captionsSrt', f('captions.srt'));
note('captionsVtt', f('captions.vtt'));

if (want('master')) {
  await media('Announcement', { slug, variant: 'master' }, f('master-intermediate.mp4'));
  encodeQuality(f('master-intermediate.mp4'), 'film-1080p');
  note('masterMp4', f('film-1080p.mp4'), { seconds: duration(f('film-1080p.mp4')) });
  note('masterWebm', f('film-1080p.webm'));
}

if (want('hero') && config.outputs.heroLoop) {
  await media('HeroLoop', { slug, variant: 'heroLoop' }, f('loop-intermediate.mp4'));
  const kbps = encodeBudget(f('loop-intermediate.mp4'), 'loop-720p', config.outputs.heroLoop.maxBytes ?? 3_000_000);
  note('loopMp4', f('loop-720p.mp4'), { seconds: duration(f('loop-720p.mp4')), kbps });
  note('loopWebm', f('loop-720p.webm'));
}

if (want('vertical') && config.outputs.vertical) {
  await media('AnnouncementVertical', { slug, variant: 'vertical' }, f('vertical-intermediate.mp4'));
  encodeQuality(f('vertical-intermediate.mp4'), 'vertical-1080x1920');
  note('verticalMp4', f('vertical-1080x1920.mp4'));
  note('verticalWebm', f('vertical-1080x1920.webm'));
}

if (want('poster') && config.outputs.poster) {
  // A frame of the given variant (the hero loop has no burned-in captions), rendered at 1080p.
  const { variant = 'master', scene, at } = config.outputs.poster;
  const id = { master: 'Announcement', heroLoop: 'HeroLoop', vertical: 'AnnouncementVertical' }[variant];
  const comp = await composition(id, { slug, variant });
  const frame = comp.props.data.starts[scene] + Math.round(at * config.fps);
  await still(id, { slug, variant }, { frame, output: f('poster-1080p.png'), scale: 1080 / comp.height });
  ff('-i', f('poster-1080p.png'), '-vf', 'scale=1280:720:flags=lanczos', '-quality', '85', f('poster.webp'));
  ff('-i', f('poster-1080p.png'), '-vf', 'scale=1280:720:flags=lanczos', '-q:v', '3', f('poster.jpg'));
  note('posterWebp', f('poster.webp'), { variant, frame });
  note('posterJpg', f('poster.jpg'));
}

writeFileSync(f('build.json'), JSON.stringify(summary, null, 2));
console.log(`Done: ${path.relative(process.cwd(), out)}/build.json`);
