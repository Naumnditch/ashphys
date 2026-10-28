# AshPhys announcement videos

The pipeline behind the homepage **What's New** slot: real footage of the
running site, captured with Playwright, assembled by a template-driven
Remotion composition, encoded with ffmpeg, published to the `site_updates`
table. The first announcement is `updates/handwritten-worked-solutions/`.

This folder is its **own npm workspace**: nothing here is installed with the
site or on Vercel (the site's `tsconfig.json` and `vitest.config.ts` exclude
it). It uses React 19 because Remotion's transitions package needs it; the
site stays on React 18.

```
video/
  updates/<slug>/config.json     the announcement: scenes, captions, cameras, outputs
  updates/<slug>/capture.mjs     its shot list against the real site
  updates/<slug>/strokes/*.json  showcase handwriting, read from the database
  scripts/                       export-demo-data, seed, fetch-strokes, capture, build, verify, publish
  src/                           the Remotion template (no announcement is hard-coded in it)
  public/brand/logo.png          the site logo (copied from public/assets/logo.png)
  public/captures/<slug>/        captured footage (git-ignored)
  out/<slug>/                    renders (git-ignored)
```

## Policies

- **Everything on screen comes from the real site.** Stills and interaction
  clips are screenshots of a real build; device frames, captions, cursors,
  callouts and the CTA card are the only things drawn. Never mock up UI.
- **Handwriting is never redrawn.** The replay draws the stored strokes with
  the site's own geometry (`lib/handwriting/geometry.ts`, `svg.ts`): no fonts,
  no OCR, no tracing. Inconsistencies are listed for the author to fix in the
  admin canvas, then re-captured — never edited in the video.
- **Capture only a local or staging build seeded with demo data.** The scripts
  refuse `ashphys.org` and refuse to seed a non-local database unless
  `DEMO_DB_ALLOW_REMOTE=1` (a staging copy, never production).
- **Test accounts only**, credentials from environment variables
  (`TEST_STUDENT_EMAIL`, `TEST_STUDENT_PASSWORD`, `TEST_ADMIN_EMAIL`,
  `TEST_ADMIN_PASSWORD`), never logged, never committed. The seed names them
  "Test Student" / "Demo Teacher". Before every screenshot the capture blurs
  anything that looks like an email address and reports it. No real students,
  receipts or payment data are ever loaded into the demo database (the export
  reads lessons, questions, plans and the showcase lessons' handwriting only).
- **Silent** unless audio licensing is clearly safe; no stock footage.
- **Remotion licence**: free for individuals and for-profit organisations with
  up to 3 employees (checked 2026-10-28 in `node_modules/remotion/LICENSE.md`,
  v4.0.534). AshPhys is run by one teacher, so the free licence applies. If
  AshPhys ever has 4+ employees, buy a company licence at remotion.pro.

## Adding an announcement

All commands run from `video/` unless noted. Install once:
`npm --prefix video install` (from the site root) — needs Node 22 and ffmpeg
with libx264/libvpx-vp9/libwebp.

1. **Config.** Copy `updates/handwritten-worked-solutions/` to
   `updates/<slug>/` and edit `config.json` (see *Config* below). The slug is
   also the `site_updates.slug` and the storage folder.
2. **Showcase handwriting** (if the update shows handwriting). Describe each
   question by fragments of its text in `config.showcase`, then:
   ```
   DATABASE_URL=<production, read-only use> npm run fetch-strokes -- --update=<slug>
   ```
   It lists the newest matching `question_handwriting` row per key (lesson,
   question number, stroke count, version, updated_at, answer) and writes
   nothing. Check them, then re-run with `--confirm` to save
   `strokes/<key>.json` (the stored `doc` and server snapshots, untouched).
3. **Demo database.**
   ```
   SOURCE_DATABASE_URL=<production> npm run export-demo-data -- --update=<slug>
   DATABASE_URL=postgresql://…@localhost:5433/ashphys TEST_STUDENT_EMAIL=… TEST_STUDENT_PASSWORD=… \
     TEST_ADMIN_EMAIL=… TEST_ADMIN_PASSWORD=… npm run seed [-- --student-tier=free|plus|pro]
   ```
   The export is read-only and writes `.cache/demo/` (schema DDL + the
   showcase lessons' rows). The seed loads it into an empty local database,
   applies the handwriting and site-updates migrations, creates the two test
   accounts, and resets the test student (no attempts, no solution views).
   `npm run seed -- --reset-only` just resets before another capture. The app
   connects with TLS, so local Postgres needs `ssl = on` (any self-signed cert).
4. **Run the site** against it (from the site root):
   `DATABASE_URL=… JWT_SECRET=<random> npm run build && npx next start -p 3100`.
5. **Capture.**
   ```
   CAPTURE_BASE_URL=http://localhost:3100 TEST_…=… npm run capture -- --update=<slug> [--only=shot,shot]
   ```
   `capture.mjs` scripts the real UI with the helpers in `scripts/capture.mjs`:
   `session(role, 'desktop'|'tablet', scale?)` (logs in through the real login
   page; desktop 1920×1080 @2x, tablet landscape 1366×1024 @2x), `shot(id, …,
   {rects})` (PNG + named element rectangles), `sequence(id, …, frames, step)`
   (a real interaction recorded frame by frame, with the pointer path),
   `inkTransform` / `setInkVisible` (the viewer's exact transform; the
   "plate" = the same view with the ink hidden), `pen()` (Chromium pen input).
   Output: `public/captures/<slug>/` + `manifest.json`.
6. **Preview** in Remotion Studio: `npm run studio`. Compositions:
   `Announcement` (16:9 master), `AnnouncementVertical` (9:16),
   `HeroLoop` (720p loop), `ReplayCheck` (debug, below).
7. **Verify the replay**: `npm run verify -- --update=<slug>` renders the last
   frame of every handwriting scene at the capture's own pixel scale and
   diffs it with the real viewer showing the stored page (fails on any ink
   more than one device pixel away from the stored ink).
8. **Render**: `npm run video:build -- --update=<slug>` (site root) →
   `out/<slug>/`: `film-1080p.mp4/.webm` (H.264 CRF 20 yuv420p faststart /
   VP9), `loop-720p.mp4/.webm` (two-pass under `outputs.heroLoop.maxBytes`),
   `vertical-1080x1920.mp4/.webm`, `poster.webp/.jpg` (+ 1080p PNG),
   `captions.srt/.vtt`, `build.json`.
9. **Publish**: either
   - `SUPABASE_URL=… SUPABASE_SERVICE_ROLE_KEY=… DATABASE_URL=… npm run publish -- --update=<slug> [--draft]`
     (uploads to the public `site-updates` bucket, upserts the row, live now), or
   - `npm run publish -- --update=<slug> --target=static --sql` (copies the
     files into the site's `public/video/updates/<slug>/`, prints the row's SQL), or
   - by hand at **/admin/updates**: New announcement → title/slug/summary/CTA →
     upload each file into its slot → Save & publish. Unpublish/Publish/Edit
     later from the same page. The hero shows the newest live row.

Set `CHROME_PATH` to use a local Chrome/chrome-headless-shell for capture and
render. Remotion launches Chrome with `--no-proxy-server`, so behind an HTTPS
proxy (Google Fonts must load) point `CHROME_PATH` at a small wrapper that
swaps in `--proxy-server=…` (keep TLS verification on).

## Config

```jsonc
{
  "slug": "…", "title": "…", "summary": "…",          // title/summary also go into site_updates
  "cta": { "label": "…", "href": "/…" },
  "fps": 30,
  "brand": { "logo": "brand/logo.png", "url": "ashphys.org", "font": "Inter",
             "colors": { "ink", "muted", "page", "surface", "accent", "accentSoft", "highlight", "grid" } },
  "showcase": { "A": { "questionIncludes": ["…"], "answer": "…" } },
  "transition": { "type": "fade" | "slide" | "none", "seconds": 0.4 },
  "scenes": [ /* in order; each { id, type, seconds, captions?: [{ from, to, text }] } */ ],
  "outputs": {
    "heroLoop": { "scenes": [ids], "width", "height", "maxBytes", "captions": false, "loop": true, "sceneOverrides": {} },
    "vertical": { "width": 1080, "height": 1920, "sceneOverrides": { "<scene id>": { /* any scene fields */ } } },
    "poster": { "scene": "<id>", "at": seconds }
  }
}
```

Scene types (times are seconds from the scene's start; rectangles are
`"<shot id>:<rect name>"`, `"shot:a+b"` for the box around several):

| type | fields |
|---|---|
| `title` | `kicker`, `title` (words spring in), `subtitle` |
| `screens` | `device` (`browser`/`tablet`), `shots: [{ capture, at }]` (cuts), `clip: { capture, at }` (a captured sequence over them), `cursor: [{ at, target, click? }]`, `camera: [{ at, zoom, focus? }]` (spring Ken Burns), `callouts: [{ from, to, text, anchor, side }]` |
| `handwriting` | `strokes` (key), `plate` / `reference` (captures), `device`, `replay: { pauseCompression, startDelay, endHold, penSpeed }`, `camera: { mode: "follow", minZoom, maxZoom, settle }`, `highlights: [{ label, strokes: [[first, last], …] }]` |
| `sequence` | `capture` (frame sequence), `device`, `camera`, `callouts` |
| `cta` | `title`, `button` (styled like the hero's primary button), `note` |

Captions are burned in from this list and written to `.srt`/`.vtt` from the
same resolved timeline, so they always agree.

## The handwriting replay

`src/handwriting/`:

- `timeline.ts` — when each stroke is written. Stored order is the writing
  order (the canvas appends strokes; erasing removes or splits strokes in
  place), and the replay keeps it.
  - Strokes with timestamps (`[x, y, p, t]` points + `t0`, saved since
    2026-10-28): the writer's own pace inside each stroke and the real gaps
    between strokes, pauses capped at `pauseCompression` (0.4 s).
  - Strokes without (everything written before 2026-10-28): duration ∝ stroke
    length with an eased pen, short pauses growing with the distance the pen
    travels, longer at a new line / colour change / another part of the page.
  - Then one global speed-up fits the scene; `highlights` add a 0.45 s beat
    after the highlighted result (output seconds).
- `HandwritingReplay.tsx` — finished strokes are drawn with the site's own
  `strokeSvg()` markup (byte-identical to what students see); the stroke in
  progress grows point by point through perfect-freehand with its stored
  pressure (`last: false`, like the live canvas), colour, opacity and tool
  (highlighter multiplies, shapes grow along their outline). A tip dot and an
  Apple Pencil–style stylus follow the pen; highlights pulse behind the ink
  and are gone before the last frame, which is exactly the stored page.
- Alignment: the layer reproduces the viewer's SVG (same `viewBox`,
  `preserveAspectRatio`, per-page `translate`) over the captured plate, at
  the box the site actually paints it in (Chromium snaps the viewer's SVG to
  whole CSS pixels; inside the video's transformed layers nothing snaps, so
  `snap.ts` applies it explicitly — without it the ink lands ⅓ px off).
- `camera.ts` — groups strokes into regions and springs the camera to each
  just before the pen gets there, then back to the whole page.
- **Erased strokes**: there are none to replay — the stored format has no
  eraser strokes; erased ink is absent and pixel-erased strokes are stored as
  the pieces that remain, which replay as written.
- **Pages**: replayed in order; empty pages are skipped like in the viewer.
- **Performance**: finished strokes' markup is computed once per timeline;
  per frame only the active stroke's outline is computed. Camera paths are
  precomputed per scene (deterministic, any frame can render on its own).

**Debug** (`ReplayCheck` in Studio): props `scene`, `mode`
(`replay` | `reference` | `snapshot` — the stored server snapshot laid out like
the viewer | `difference` — anything not black on the last frame is drift |
`side-by-side`), `showIndices` (stroke numbers at each stroke's start, the
active one red), `showHud` (stroke index, time, pacing source, speed-up).
Scrub with the Studio timeline.

## Stroke schema (question_handwriting.doc)

```
{ v: 1, pages: [{ id, background: blank|grid|lined, strokes: [{
    id, tool: pen|highlighter|shape, shape?: line|arrow|rect|ellipse|polyline,
    color: #rrggbb, width, opacity, pressure: bool,
    t0?: ms since the Unix epoch when the stroke started      (since 2026-10-28)
    points: [[x, y, pressure, t?]]   t = ms since the stroke's first point (since 2026-10-28)
}] }] }
```

Backward compatible: old strokes keep three numbers per point and no `t0`;
validation keeps timing only when every point of a stroke has it (made
non-decreasing, never fails a save over timing), the SVG students see is
identical with or without it, and lasso moves / eraser cuts carry it along.

## Tests

`npm test` (timeline, camera-free logic, the showcase strokes replay exactly
once in stored order with untouched points), `npm run typecheck`,
`npm run verify -- --update=<slug>` (pixel check against the real viewer).
