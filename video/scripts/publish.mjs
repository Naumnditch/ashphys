#!/usr/bin/env node
/**
 * Publish a rendered announcement: put the files where the site can serve
 * them and create/update its site_updates row (the hero then shows it).
 *
 *   # Supabase Storage (the public `site-updates` bucket) + the row:
 *   SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… DATABASE_URL=… \
 *     npm run publish -- --update=<slug> [--draft]
 *
 *   # Or copy the files into the site's public/video/updates/<slug>/ (served by
 *   # Vercel with the next deploy) and print the SQL for the row instead:
 *   npm run publish -- --update=<slug> --target=static --sql
 *
 * The admin page /admin/updates does the same by hand (upload each file,
 * fill in the text, Publish). Keys are read from the environment only.
 */

import { copyFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import { args, pgConfig, readJson, requireEnv, SITE_DIR, updateDir, VIDEO_DIR } from './lib.mjs';

const opts = args();
const slug = opts.update;
const dir = updateDir(slug);
const config = readJson(path.join(dir, 'config.json'));
const out = path.join(VIDEO_DIR, 'out', slug);
const build = readJson(path.join(out, 'build.json'));
const target = opts.target ?? 'storage';
const version = new Date(build.builtAt).getTime().toString(36);

// Row column → built file (and the content type storage gets).
const FILES = {
  video_mp4_url: ['film-1080p.mp4', 'video/mp4'],
  video_webm_url: ['film-1080p.webm', 'video/webm'],
  loop_mp4_url: ['loop-720p.mp4', 'video/mp4'],
  loop_webm_url: ['loop-720p.webm', 'video/webm'],
  poster_url: ['poster.webp', 'image/webp'],
  captions_vtt_url: ['captions.vtt', 'text/vtt'],
};

const urls = {};
for (const [column, [name, type]] of Object.entries(FILES)) {
  const file = path.join(out, name);
  if (!existsSync(file)) {
    console.error(`Missing ${name}: run npm run build -- --update=${slug} first.`);
    process.exit(1);
  }
  const [base, ext] = name.split(/\.(?=[^.]+$)/);
  const objectName = `${base}-${version}.${ext}`;
  if (target === 'static') {
    const dest = path.join(SITE_DIR, 'public', 'video', 'updates', slug);
    mkdirSync(dest, { recursive: true });
    copyFileSync(file, path.join(dest, objectName));
    urls[column] = `/video/updates/${slug}/${objectName}`;
  } else {
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = requireEnv('SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY');
    const objectPath = `${slug}/${objectName}`;
    const res = await fetch(`${SUPABASE_URL}/storage/v1/object/site-updates/${objectPath}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`, apikey: SUPABASE_SERVICE_ROLE_KEY, 'Content-Type': type, 'x-upsert': 'true', 'Cache-Control': 'max-age=31536000' },
      body: readFileSync(file),
    });
    if (!res.ok) {
      console.error(`Upload of ${name} failed: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`);
      process.exit(1);
    }
    urls[column] = `${SUPABASE_URL}/storage/v1/object/public/site-updates/${objectPath}`;
  }
  console.log(`  ${name} → ${urls[column]}`);
}

const row = {
  slug,
  title: config.title.replace(/^New:\s*/i, ''),
  summary: config.summary,
  cta_label: config.cta?.label ?? null,
  cta_href: config.cta?.href ?? null,
  ...urls,
};
const active = !opts.draft;
const cols = Object.keys(row);
const sql = `INSERT INTO site_updates (${cols.join(', ')}, is_active, published_at)
VALUES (${cols.map((c) => `'${String(row[c]).replace(/'/g, "''")}'`).join(', ')}, ${active}, ${active ? 'now()' : 'NULL'})
ON CONFLICT (slug) DO UPDATE SET ${cols.filter((c) => c !== 'slug').map((c) => `${c} = EXCLUDED.${c}`).join(', ')},
  is_active = EXCLUDED.is_active, published_at = coalesce(site_updates.published_at, EXCLUDED.published_at), updated_at = now()`;

if (opts.sql) {
  console.log(`\n-- Run as the database owner (or publish from /admin/updates):\n${sql};`);
} else {
  const { DATABASE_URL } = requireEnv('DATABASE_URL');
  const client = new pg.Client(pgConfig(DATABASE_URL));
  await client.connect();
  try {
    await client.query(sql);
    console.log(`site_updates row "${slug}" ${active ? 'published' : 'saved as a draft'}.`);
  } finally {
    await client.end();
  }
}
