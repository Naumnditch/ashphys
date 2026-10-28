#!/usr/bin/env node
/**
 * Capture real footage of the running site for one announcement.
 *
 *   CAPTURE_BASE_URL=http://localhost:3100 \
 *   TEST_STUDENT_EMAIL=… TEST_STUDENT_PASSWORD=… TEST_ADMIN_EMAIL=… TEST_ADMIN_PASSWORD=… \
 *   npm run capture -- --update=<slug> [--only=a-question,a-zoompan]
 *
 * Runs updates/<slug>/capture.mjs, which scripts the real UI through this
 * file's helpers. Everything is a screenshot of the real page: nothing is
 * mocked or redrawn. Output: public/captures/<slug>/ (stills, frame
 * sequences) and manifest.json (viewport, scale, element rectangles, the
 * handwriting viewer's logical→screen transform, cursor paths).
 *
 * Safety: credentials come only from the environment and are never logged;
 * the base URL must be a local or staging build (never production, never real
 * student accounts); before every screenshot the page is scanned for email
 * addresses and anything that looks like one is blurred (and reported).
 */

import { mkdirSync, rmSync, writeFileSync, existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';
import { args, readJson, requireEnv, updateDir, VIDEO_DIR } from './lib.mjs';

const opts = args();
const slug = opts.update;
const dir = updateDir(slug);
const config = readJson(path.join(dir, 'config.json'));
const creds = requireEnv('TEST_STUDENT_EMAIL', 'TEST_STUDENT_PASSWORD', 'TEST_ADMIN_EMAIL', 'TEST_ADMIN_PASSWORD');
const baseUrl = (process.env.CAPTURE_BASE_URL ?? 'http://localhost:3100').replace(/\/$/, '');
if (/(^|\.)ashphys\.org$/.test(new URL(baseUrl).hostname)) {
  console.error('Refusing to capture production: run a local or staging build seeded with demo data (see video/README.md).');
  process.exit(1);
}
const only = opts.only ? new Set(String(opts.only).split(',')) : null;

const outDir = path.join(VIDEO_DIR, 'public', 'captures', slug);
mkdirSync(outDir, { recursive: true });
const manifestPath = path.join(outDir, 'manifest.json');
const manifest = existsSync(manifestPath) ? JSON.parse(readFileSync(manifestPath, 'utf8')) : { slug, shots: {} };
manifest.baseUrl = baseUrl;

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || undefined,
  args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--hide-scrollbars'],
});

const VIEWPORTS = {
  desktop: { viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 2 },
  // iPad Pro 12.9" held landscape.
  tablet: {
    viewport: { width: 1366, height: 1024 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  },
};

const contexts = new Map();

/** A logged-in browser context per role + form factor (log in through the real login page). */
async function session(role, form = 'desktop', scale) {
  const key = `${role}:${form}:${scale ?? ''}`;
  if (contexts.has(key)) return contexts.get(key);
  const spec = { ...VIEWPORTS[form] };
  if (scale) spec.deviceScaleFactor = scale;
  const context = await browser.newContext({ ...spec, colorScheme: 'light', reducedMotion: 'no-preference', locale: 'en-GB', timezoneId: 'UTC' });
  const page = await context.newPage();
  // One device per role: reuse the signed-in session of this role's first context (the site
  // limits how many devices an account may use, and each new login would count as one).
  const sibling = [...contexts.entries()].find(([k]) => k.startsWith(`${role}:`))?.[1];
  if (sibling) {
    await context.addCookies(await sibling.context.cookies());
    const s = { context, page, form, scale: spec.deviceScaleFactor, viewport: spec.viewport };
    contexts.set(key, s);
    return s;
  }
  await page.goto(`${baseUrl}/auth/login`, { waitUntil: 'networkidle' });
  const email = role === 'admin' ? creds.TEST_ADMIN_EMAIL : creds.TEST_STUDENT_EMAIL;
  const password = role === 'admin' ? creds.TEST_ADMIN_PASSWORD : creds.TEST_STUDENT_PASSWORD;
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await Promise.all([
    page.waitForURL((u) => !u.pathname.startsWith('/auth/login'), { timeout: 30000 }),
    page.locator('form button[type="submit"]').first().click(),
  ]).catch(async () => {
    throw new Error(`Login as the test ${role} failed (check the TEST_* variables and that the demo database is seeded).`);
  });
  const s = { context, page, form, scale: spec.deviceScaleFactor, viewport: spec.viewport };
  contexts.set(key, s);
  return s;
}

/** Blur anything that looks like an email address (the test accounts' included) before a screenshot. */
async function protectPrivacy(page, id) {
  const hits = await page.evaluate(() => {
    const re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
    const found = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const n = walker.currentNode;
      if (n.textContent && re.test(n.textContent) && n.parentElement) {
        n.parentElement.style.filter = 'blur(6px)';
        found.push(n.parentElement.tagName);
      }
    }
    for (const el of document.querySelectorAll('input')) {
      if (re.test(el.value)) {
        el.style.filter = 'blur(6px)';
        found.push('INPUT');
      }
    }
    return found;
  });
  if (hits.length) console.warn(`  ${id}: blurred ${hits.length} element(s) showing an email address`);
}

async function rectsOf(page, selectors = {}) {
  const out = {};
  for (const [name, sel] of Object.entries(selectors)) {
    const box = await page.locator(sel).first().boundingBox().catch(() => null);
    if (box) out[name] = [box.x, box.y, box.width, box.height].map((v) => Math.round(v * 10) / 10);
    else console.warn(`  rect "${name}" (${sel}) not found`);
  }
  return out;
}

/** The read-only viewer's mapping from stored stroke coordinates to viewport CSS px, and its box. */
async function inkTransform(page) {
  return page.evaluate(() => {
    const svg = document.querySelector('[aria-roledescription="zoomable solution"] svg');
    // One <g> per non-empty page, each holding paper, grid and an inner <g> of ink in stored coordinates.
    const inks = svg ? [...svg.querySelectorAll(':scope > g')].map((g) => g.querySelector(':scope > g')).filter(Boolean) : [];
    if (!svg || inks.length === 0) return null;
    const pages = inks.map((ink) => {
      const m = ink.getScreenCTM();
      return [m.a, m.b, m.c, m.d, m.e, m.f];
    });
    const r = svg.getBoundingClientRect();
    return { matrix: pages[0], pages, clip: [r.x, r.y, r.width, r.height], viewBox: svg.getAttribute('viewBox') };
  });
}

/** Hide (or show) the stored ink in the viewer, leaving paper and grid: the replay's background plate. */
async function setInkVisible(page, visible) {
  await page.evaluate((v) => {
    for (const g of document.querySelectorAll('[aria-roledescription="zoomable solution"] svg > g > g')) g.style.visibility = v ? '' : 'hidden';
  }, visible);
}

function want(id) {
  return !only || only.has(id);
}

const helpers = {
  baseUrl,
  config,
  session,
  want,
  inkTransform,
  setInkVisible,
  rectsOf,
  async settle(page, ms = 600) {
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(ms);
  },
  /** One still at the session's scale (PNG), with named element rectangles. */
  async shot(id, s, { rects = {}, extra = {} } = {}) {
    await protectPrivacy(s.page, id);
    const file = `${id}.png`;
    await s.page.screenshot({ path: path.join(outDir, file), animations: 'disabled', caret: 'hide' });
    manifest.shots[id] = {
      kind: 'still',
      file,
      form: s.form,
      viewport: s.viewport,
      scale: s.scale,
      path: new URL(s.page.url()).pathname,
      rects: await rectsOf(s.page, rects),
      ...extra,
    };
    console.log(`  ✓ ${id}`);
    return manifest.shots[id];
  },
  /**
   * A real interaction recorded frame by frame: `step(i)` drives the page
   * (wheel, drag, click…) and returns the pointer position for the cursor
   * overlay; a JPEG is taken after every step.
   */
  async sequence(id, s, frames, step, { fps = 30, rects = {} } = {}) {
    const seqDir = path.join(outDir, id);
    rmSync(seqDir, { recursive: true, force: true });
    mkdirSync(seqDir, { recursive: true });
    const pointer = [];
    const events = [];
    for (let i = 0; i < frames; i++) {
      const r = (await step(i)) ?? {};
      pointer.push(r.pointer ?? null);
      if (r.event) events.push({ frame: i, ...r.event });
      if (i === 0) await protectPrivacy(s.page, id);
      await s.page.screenshot({ path: path.join(seqDir, `${String(i).padStart(4, '0')}.jpg`), type: 'jpeg', quality: 92, animations: 'disabled', caret: 'hide' });
    }
    manifest.shots[id] = {
      kind: 'sequence',
      dir: id,
      frames,
      fps,
      form: s.form,
      viewport: s.viewport,
      scale: s.scale,
      path: new URL(s.page.url()).pathname,
      rects: await rectsOf(s.page, rects),
      pointer,
      events,
    };
    console.log(`  ✓ ${id} (${frames} frames)`);
    return manifest.shots[id];
  },
  /** Pen input through Chromium's input pipeline (pointerType "pen", real pressure). */
  async pen(s, type, x, y, pressure) {
    const cdp = s.cdp ?? (s.cdp = await s.context.newCDPSession(s.page));
    await cdp.send('Input.dispatchMouseEvent', {
      type,
      x,
      y,
      button: 'left',
      buttons: type === 'mouseReleased' ? 0 : 1,
      clickCount: type === 'mouseMoved' ? 0 : 1,
      pointerType: 'pen',
      force: pressure,
    });
  },
};

try {
  const mod = await import(pathToFileURL(path.join(dir, 'capture.mjs')).href);
  await mod.capture(helpers);
  manifest.capturedAt = new Date().toISOString();
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));
  console.log(`Manifest: ${path.relative(process.cwd(), manifestPath)}`);
} finally {
  await browser.close();
}
