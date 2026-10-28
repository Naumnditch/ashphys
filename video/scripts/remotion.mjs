/** Bundle the composition once and render from it (shared by build and verify). */

import path from 'node:path';
import { bundle } from '@remotion/bundler';
import { renderMedia, renderStill, selectComposition } from '@remotion/renderer';
import { makeWebpackOverride } from '../webpack-override.mjs';
import { VIDEO_DIR } from './lib.mjs';

let served = null;

export async function serveUrl() {
  if (!served) {
    process.stdout.write('Bundling the composition… ');
    served = await bundle({
      entryPoint: path.join(VIDEO_DIR, 'src', 'index.ts'),
      webpackOverride: makeWebpackOverride(VIDEO_DIR),
      publicDir: path.join(VIDEO_DIR, 'public'),
    });
    console.log('done');
  }
  return served;
}

/** CHROME_PATH: a local Chrome / chrome-headless-shell (otherwise Remotion downloads its own). */
const browserExecutable = () => process.env.CHROME_PATH || null;

export async function composition(id, inputProps) {
  return selectComposition({ serveUrl: await serveUrl(), id, inputProps, browserExecutable: browserExecutable(), logLevel: 'warn' });
}

export async function still(id, inputProps, { frame, output, scale = 1, imageFormat = 'png' }) {
  const comp = await composition(id, inputProps);
  await renderStill({ composition: comp, serveUrl: await serveUrl(), inputProps, frame, output, scale, imageFormat, browserExecutable: browserExecutable(), logLevel: 'warn', overwrite: true });
  return comp;
}

/** A near-lossless intermediate; the final web encodes are done with ffmpeg from it. */
export async function media(id, inputProps, output) {
  const comp = await composition(id, inputProps);
  let last = -1;
  await renderMedia({
    composition: comp,
    serveUrl: await serveUrl(),
    inputProps,
    codec: 'h264',
    crf: 10,
    x264Preset: 'veryfast',
    muted: true,
    imageFormat: 'jpeg',
    jpegQuality: 96,
    outputLocation: output,
    browserExecutable: browserExecutable(),
    logLevel: 'warn',
    overwrite: true,
    concurrency: Number(process.env.RENDER_CONCURRENCY) || null,
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 20) * 5;
      if (pct !== last) {
        last = pct;
        process.stdout.write(`\r  ${id}: ${pct}%   `);
      }
    },
  });
  process.stdout.write('\n');
  return comp;
}
