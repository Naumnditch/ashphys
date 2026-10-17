#!/usr/bin/env node
/**
 * Builds the downloadable PDFs for every cheat sheet with Chromium's print
 * engine: vector text, real KaTeX, the same output as the browser's
 * Print → Save as PDF. One A4 and one US Letter file per sheet, with the quick
 * recall answers printed.
 *
 *   npm run build && npx next start -p 3100     # in one terminal
 *   node scripts/cheatsheet-pdfs.mjs http://localhost:3100
 *
 * Writes public/cheat-sheets/pdf/<slug>-<paper>.pdf and manifest.json, which
 * records the sha256 of each sheet's data file. lib/cheatsheets tests fail when
 * a data file changes without its PDFs being rebuilt.
 *
 * Exits non-zero if a sheet prints to more pages than it has sheets (content
 * overflowing a page), so overflow is caught here rather than by a student.
 *
 * Needs Playwright (not a project dependency): `npx playwright` or a global
 * install. Set CHROMIUM_PATH to use a specific Chromium binary.
 */

import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const SHEETS_DIR = path.join(ROOT, 'lib/cheatsheets/sheets');
const OUT_DIR = path.join(ROOT, 'public/cheat-sheets/pdf');
const base = (process.argv[2] || 'http://localhost:3000').replace(/\/+$/, '');

function loadPlaywright() {
  const tries = [ROOT + '/', execSync('npm root -g').toString().trim() + '/'];
  for (const from of tries) {
    try {
      return createRequire(from)('playwright');
    } catch {
      // try the next location
    }
  }
  console.error('Playwright is not installed. Run: npm i -g playwright');
  process.exit(1);
}

/** Pages in a PDF, without a PDF library: count the page objects. */
function pageCount(buf) {
  return (buf.toString('latin1').match(/\/Type\s*\/Page(?!s)/g) || []).length;
}

const { chromium } = loadPlaywright();
const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
mkdirSync(OUT_DIR, { recursive: true });

const manifest = {};
let failed = false;
const files = readdirSync(SHEETS_DIR).filter((f) => f.endsWith('.ts'));

for (const file of files) {
  const slug = file.replace(/\.ts$/, '');
  const hash = createHash('sha256')
    .update(readFileSync(path.join(SHEETS_DIR, file)))
    .digest('hex');
  const entry = { hash, files: {} };
  for (const paper of ['a4', 'letter']) {
    const page = await browser.newPage();
    await page.goto(`${base}/cheat-sheets/${slug}`, { waitUntil: 'networkidle' });
    await page.evaluate(
      ([p]) => localStorage.setItem('ashphys-cheatsheet-prefs', JSON.stringify({ paper: p, tint: false, answers: true })),
      [paper],
    );
    await page.reload({ waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const sheets = await page.locator('.cs-page').count();
    const pdf = await page.pdf({ preferCSSPageSize: true, printBackground: true });
    const pages = pageCount(pdf);
    const name = `${slug}-${paper}.pdf`;
    writeFileSync(path.join(OUT_DIR, name), pdf);
    entry.files[paper] = { file: name, pages, sheets, bytes: pdf.length };
    const ok = pages === sheets;
    if (!ok) failed = true;
    console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}: ${pages} page(s) for ${sheets} sheet(s), ${Math.round(pdf.length / 1024)} KB`);
    await page.close();
  }
  manifest[slug] = entry;
}

writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
await browser.close();
if (failed) {
  console.error('A sheet overflowed its page(s). Trim its content or move sheetBreakBefore.');
  process.exit(1);
}
