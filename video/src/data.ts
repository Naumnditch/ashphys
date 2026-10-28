/**
 * Announcement registry (every updates/<slug>/config.json and its strokes,
 * bundled by webpack) and the pure resolution of a variant: which scenes,
 * how long, where each starts after transitions, and the absolute captions
 * (the same list is burned in and written to .srt/.vtt by the build).
 */

import { staticFile } from 'remotion';
import type { AnnouncementData, Caption, Manifest, Scene, StrokesFile, UpdateConfig, VariantName } from './types';

declare const require: {
  context(dir: string, recursive: boolean, re: RegExp): { keys(): string[]; (key: string): unknown };
};

export interface RegisteredUpdate {
  config: UpdateConfig;
  strokes: Record<string, StrokesFile>;
}

const ctx = require.context('../updates', true, /\.json$/);
export const UPDATES: Record<string, RegisteredUpdate> = {};
for (const key of ctx.keys()) {
  const m = /^\.\/([^/]+)\/(?:(config)|strokes\/([^/]+))\.json$/.exec(key);
  if (!m) continue;
  const mod = ctx(key) as { default?: unknown };
  const value = (mod && typeof mod === 'object' && 'default' in mod ? mod.default : mod) as UpdateConfig | StrokesFile;
  const entry = (UPDATES[m[1]] ??= { config: undefined as unknown as UpdateConfig, strokes: {} });
  if (m[2]) entry.config = value as UpdateConfig;
  else entry.strokes[m[3]] = value as StrokesFile;
}
export const SLUGS = Object.keys(UPDATES).filter((s) => UPDATES[s].config);

export async function loadManifest(slug: string): Promise<Manifest> {
  const res = await fetch(staticFile(`captures/${slug}/manifest.json`));
  if (!res.ok) throw new Error(`No captures for "${slug}": run \`npm run capture -- --update=${slug}\` first (see video/README.md).`);
  return (await res.json()) as Manifest;
}

export function resolveVariant(config: UpdateConfig, manifest: Manifest, variant: VariantName): AnnouncementData {
  const fps = config.fps;
  const v = variant === 'master' ? undefined : config.outputs[variant];
  const width = v?.width ?? 1920;
  const height = v?.height ?? 1080;
  const wanted = v?.scenes ?? config.scenes.map((s) => s.id);
  const scenes: Scene[] = wanted.map((id) => {
    const base = config.scenes.find((s) => s.id === id);
    if (!base) throw new Error(`Variant ${variant} lists unknown scene "${id}"`);
    return { ...base, ...(v?.sceneOverrides?.[id] ?? {}) } as Scene;
  });
  const transitionFrames = config.transition.type === 'none' ? 0 : Math.round(config.transition.seconds * fps);
  const starts: Record<string, number> = {};
  let at = 0;
  for (const s of scenes) {
    starts[s.id] = at;
    at += Math.round(s.seconds * fps) - transitionFrames;
  }
  const durationInFrames = at + transitionFrames;

  const captions: Caption[] = [];
  for (const s of scenes) {
    for (const c of s.captions ?? []) captions.push({ from: starts[s.id] / fps + c.from, to: starts[s.id] / fps + c.to, text: c.text });
  }
  captions.sort((a, b) => a.from - b.from);
  for (let i = 0; i + 1 < captions.length; i++) captions[i].to = Math.min(captions[i].to, captions[i + 1].from - 0.05);
  const end = durationInFrames / fps;
  for (const c of captions) c.to = Math.min(c.to, end);

  return {
    config,
    manifest,
    strokes: {},
    variant,
    width,
    height,
    scenes,
    captions: captions.map((c) => ({ ...c, from: round3(c.from), to: round3(c.to) })),
    showCaptions: v?.captions ?? variant !== 'heroLoop',
    loop: v?.loop ?? variant === 'heroLoop',
    starts,
    durationInFrames,
    transitionFrames,
  };
}

const round3 = (n: number) => Math.round(n * 1000) / 1000;
