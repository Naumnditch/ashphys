/** Small helpers shared by the pipeline scripts (no dependencies beyond node). */

import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const VIDEO_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const SITE_DIR = path.resolve(VIDEO_DIR, '..');

/** --key=value / --flag arguments. */
export function args(argv = process.argv.slice(2)) {
  const out = {};
  for (const a of argv) {
    const m = /^--([^=]+)(?:=(.*))?$/.exec(a);
    if (m) out[m[1]] = m[2] ?? true;
  }
  return out;
}

export function requireEnv(...names) {
  const missing = names.filter((n) => !process.env[n]);
  if (missing.length) {
    console.error(`Missing environment variable(s): ${missing.join(', ')} (see video/README.md). Values are never printed.`);
    process.exit(1);
  }
  return Object.fromEntries(names.map((n) => [n, process.env[n]]));
}

export function updateDir(slug) {
  if (!slug || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
    console.error('Pass --update=<slug> (lower-case letters, numbers and hyphens).');
    process.exit(1);
  }
  const dir = path.join(VIDEO_DIR, 'updates', slug);
  if (!existsSync(path.join(dir, 'config.json'))) {
    console.error(`No announcement config at ${path.relative(SITE_DIR, dir)}/config.json`);
    process.exit(1);
  }
  return dir;
}

export function readJson(file) {
  return JSON.parse(readFileSync(file, 'utf8'));
}

/** Local Postgres runs without TLS; hosted databases need it. */
export function pgConfig(connectionString) {
  const local = /@(localhost|127\.0\.0\.1)(:\d+)?\//.test(connectionString);
  return { connectionString, ssl: local && !/sslmode=require/.test(connectionString) ? false : { rejectUnauthorized: false } };
}
