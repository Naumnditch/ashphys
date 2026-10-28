/**
 * Shot list for "Handwritten worked solutions" — scripted against the real
 * site (see video/scripts/capture.mjs for the helpers and the safety rules).
 *
 * Desktop 1920×1080 @2x (plates and references @3x so the camera can zoom
 * into the handwriting), tablet landscape 1366×1024 @2x.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const strokesOf = (key) => JSON.parse(readFileSync(path.join(here, 'strokes', `${key}.json`), 'utf8'));

const QUESTION_RECTS = {
  questionPanel: 'section[aria-label^="Question "]',
  answerInput: 'input[placeholder="Your answer"]',
  checkButton: 'button:has-text("Check Answer")',
  solutionPanel: 'section[aria-label="Worked solution"], section:has(> div > span:has-text("Worked solution"))',
  topBar: 'nav[aria-label="Questions"]',
};

/** Open the lesson's practice page on the showcase question, unanswered. */
async function openQuestion(h, s, key) {
  const src = strokesOf(key).source;
  await s.page.goto(`${h.baseUrl}/practice/${src.lessonId}?c=a-level`, { waitUntil: 'networkidle' });
  await h.settle(s.page);
  const current = await s.page.locator('nav[aria-label="Questions"] button').nth(1).getAttribute('aria-label');
  if (!current?.startsWith(`Question ${src.questionNumber} of`)) {
    await s.page.locator('nav[aria-label="Questions"] button').nth(1).click();
    await s.page.locator(`button[aria-label^="Question ${src.questionNumber},"]`).click();
    await h.settle(s.page, 400);
  }
  // Confirm we are on the question the strokes belong to before capturing anything.
  const text = await s.page.locator('section[aria-label^="Question "] p.mb-5').first().innerText();
  if (text.trim() !== src.question.trim()) throw new Error(`Showcase ${key}: the page shows a different question:\n${text}`);
  // Park the mouse off the content (screenshots have no cursor; the video draws its own).
  await s.page.mouse.move(5, s.viewport.height - 5);
  return src;
}

/** Wrong answer → feedback → open the solution; captures the states and the viewer's ink transform. */
async function wrongAnswerFlow(h, s, key, wrong, prefix) {
  await openQuestion(h, s, key);
  if (h.want(`${prefix}-question`)) await h.shot(`${prefix}-question`, s, { rects: QUESTION_RECTS });
  const input = s.page.locator('input[placeholder="Your answer"]').first();
  await input.click();
  await input.pressSequentially(wrong, { delay: 40 });
  await s.page.mouse.move(5, s.viewport.height - 5);
  await h.settle(s.page, 200);
  if (h.want(`${prefix}-typed`)) await h.shot(`${prefix}-typed`, s, { rects: QUESTION_RECTS });
  await s.page.locator('button:has-text("Check Answer")').click();
  await s.page.locator('text=Not quite').first().waitFor();
  await s.page.locator('button:has-text("Show the worked solution")').waitFor();
  await s.page.mouse.move(5, s.viewport.height - 5);
  await h.settle(s.page, 500);
  if (h.want(`${prefix}-feedback`)) {
    await h.shot(`${prefix}-feedback`, s, {
      rects: { ...QUESTION_RECTS, feedback: 'div:has(> p:has-text("Not quite"))', openSolution: 'button:has-text("Show the worked solution")' },
    });
  }
  await s.page.locator('button:has-text("Show the worked solution")').click();
  await s.page.locator('[aria-roledescription="zoomable solution"] svg > g').first().waitFor();
  await s.page.mouse.move(5, s.viewport.height - 5);
  await h.settle(s.page, 800);
}

/** Answer wrong again in another context (same student): already unlocked, so it opens without spending a view. */
async function reopenSolution(h, s, key, wrong) {
  await openQuestion(h, s, key);
  const input = s.page.locator('input[placeholder="Your answer"]').first();
  await input.fill(wrong);
  await s.page.locator('button:has-text("Check Answer")').click();
  await s.page.locator('text=Not quite').first().waitFor();
  const offer = s.page.locator('button:has-text("Show the worked solution")');
  if (await offer.isVisible().catch(() => false)) await offer.click();
  await s.page.locator('[aria-roledescription="zoomable solution"] svg > g').first().waitFor({ timeout: 15000 });
  await s.page.mouse.move(5, s.viewport.height - 5);
  await h.settle(s.page, 800);
}

const VIEWER_RECTS = {
  viewer: '[aria-roledescription="zoomable solution"]',
  zoomIn: 'button[aria-label="Zoom in"]',
  zoomOut: 'button[aria-label="Zoom out"]',
  fullscreenButton: 'button[aria-label="Full screen"], button[aria-label="Enter full screen"], button[aria-label*="ull screen"]',
};

/** The finished page (reference) and the same view with the ink hidden (plate), plus the exact transform. */
async function referenceAndPlate(h, s, prefix, suffix = '') {
  const ink = await h.inkTransform(s.page);
  if (!ink) throw new Error(`${prefix}: the solution viewer is not showing`);
  await h.shot(`${prefix}-solution${suffix}`, s, { rects: VIEWER_RECTS, extra: { ink } });
  await h.setInkVisible(s.page, false);
  await h.shot(`${prefix}-plate${suffix}`, s, { rects: VIEWER_RECTS, extra: { ink } });
  await h.setInkVisible(s.page, true);
}

/** Map a point in stored stroke coordinates to viewport px with the viewer's transform. */
const toScreen = (m, x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

export async function capture(h) {
  // ---------------------------------------------------------------- Question A (student, desktop)
  // The plates/references are taken at 3x in their own context (same layout, more pixels).
  {
    const s = await h.session('student', 'desktop');
    await wrongAnswerFlow(h, s, 'A', '2.26', 'a');
    if (h.want('a-solution-2x')) await h.shot('a-solution-2x', s, { rects: VIEWER_RECTS, extra: { ink: await h.inkTransform(s.page) } });

    if (h.want('a-zoompan')) {
      // Planned in stored coordinates and re-anchored to the viewer's live transform before
      // each move, so every press starts inside the viewer: zoom into the force diagram, pan to
      // the geometry sketch, pan down to the final T = 1.87 s, then full screen.
      const viewerBox = await s.page.locator(VIEWER_RECTS.viewer).boundingBox();
      const centre = [viewerBox.x + viewerBox.width * 0.5, viewerBox.y + viewerBox.height * 0.52];
      const screenOf = async (x, y) => toScreen((await h.inkTransform(s.page)).matrix, x, y);
      const ease = (t) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, t)));
      const ZOOM_FRAMES = 40;
      const ZOOM = 2.0; // ~118% → ~235%
      const wheelPerFrame = -Math.log(ZOOM) / 0.006 / ZOOM_FRAMES; // the viewer's wheel → zoom curve (lib/handwriting/view.ts)
      const plan = [];
      let pos = [viewerBox.x + viewerBox.width * 0.7, viewerBox.y + viewerBox.height * 0.75];
      await s.page.mouse.move(pos[0], pos[1]);
      const diagram = await screenOf(560, -80);
      // Phases: [name, frames]
      const phases = [
        ['toDiagram', 12],
        ['zoom', ZOOM_FRAMES],
        ['hold1', 8],
        ['toDrag1', 10],
        ['drag1', 36],
        ['hold2', 8],
        ['toDrag2', 8],
        ['drag2', 34],
        ['hold3', 8],
        ['toFullscreen', 10],
        ['click', 1],
        ['hold4', 5],
      ];
      for (const [name, n] of phases) for (let k = 0; k < n; k++) plan.push([name, k, n]);
      let from = pos;
      let to = pos;
      let dragFrom = null;
      let dragTo = null;
      await h.sequence(
        'a-zoompan',
        s,
        plan.length,
        async (i) => {
          const [name, k, n] = plan[i];
          let event = null;
          const glide = async (target) => {
            if (k === 0) (from = pos), (to = await target());
            const t = ease((k + 1) / n);
            pos = [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
            await s.page.mouse.move(pos[0], pos[1]);
          };
          const drag = async (contentFrom, contentTo) => {
            if (k === 0) {
              // Content point that should end at the viewer centre; press where the pointer is.
              const a = await screenOf(...contentFrom);
              const want = contentTo;
              dragFrom = pos;
              dragTo = [pos[0] + (want[0] - a[0]), pos[1] + (want[1] - a[1])];
              await s.page.mouse.down();
              event = { kind: 'press' };
            }
            const t = ease((k + 1) / n);
            pos = [dragFrom[0] + (dragTo[0] - dragFrom[0]) * t, dragFrom[1] + (dragTo[1] - dragFrom[1]) * t];
            await s.page.mouse.move(pos[0], pos[1]);
            if (k === n - 1) await s.page.mouse.up();
          };
          switch (name) {
            case 'toDiagram':
              await glide(async () => diagram);
              break;
            case 'zoom':
              if (k === 0) event = { kind: 'pinch' };
              await s.page.keyboard.down('Control');
              await s.page.mouse.wheel(0, wheelPerFrame);
              await s.page.keyboard.up('Control');
              break;
            case 'toDrag1':
              // Start the first pan from the right half of the viewer (it moves the page left).
              await glide(async () => [viewerBox.x + viewerBox.width * 0.86, viewerBox.y + viewerBox.height * 0.3]);
              break;
            case 'drag1':
              await drag([1000, -110], centre); // geometry sketch → centre
              break;
            case 'toDrag2':
              await glide(async () => [viewerBox.x + viewerBox.width * 0.45, viewerBox.y + viewerBox.height * 0.86]);
              break;
            case 'drag2':
              await drag([700, 476], centre); // final line → centre
              break;
            case 'toFullscreen': {
              await glide(async () => {
                const b = await s.page.locator(VIEWER_RECTS.fullscreenButton).first().boundingBox();
                return [b.x + b.width / 2, b.y + b.height / 2];
              });
              break;
            }
            case 'click':
              await s.page.mouse.down();
              await s.page.mouse.up();
              await s.page.waitForTimeout(500);
              event = { kind: 'click' };
              break;
            default:
              break;
          }
          return { pointer: pos, event };
        },
        { rects: VIEWER_RECTS }
      );
      // Leave full screen again for the next shots.
      await s.page.keyboard.press('Escape').catch(() => {});
    }
  }
  {
    const s = await h.session('student', 'desktop', 3);
    await reopenSolution(h, s, 'A', '2.26');
    if (h.want('a-solution') || h.want('a-plate')) await referenceAndPlate(h, s, 'a');
  }

  // ---------------------------------------------------------------- Question B (student, desktop)
  {
    const s = await h.session('student', 'desktop');
    await wrongAnswerFlow(h, s, 'B', '6.41e22', 'b');
  }
  {
    const s = await h.session('student', 'desktop', 3);
    await reopenSolution(h, s, 'B', '6.41e22');
    if (h.want('b-solution') || h.want('b-plate')) await referenceAndPlate(h, s, 'b');
  }

  // ---------------------------------------------------------------- Tablet landscape: full-screen viewer
  {
    const s = await h.session('student', 'tablet');
    await reopenSolution(h, s, 'A', '2.26');
    if (h.want('a-solution-tablet') || h.want('a-plate-tablet')) await referenceAndPlate(h, s, 'a', '-tablet');
    if (h.want('a-fullscreen-tablet')) {
      await s.page.locator(VIEWER_RECTS.fullscreenButton).first().click();
      await h.settle(s.page, 800);
      await h.shot('a-fullscreen-tablet', s, { rects: VIEWER_RECTS, extra: { ink: await h.inkTransform(s.page) } });
    }
  }

  {
    const s = await h.session('student', 'tablet');
    await reopenSolution(h, s, 'B', '6.41e22');
    if (h.want('b-solution-tablet') || h.want('b-plate-tablet')) await referenceAndPlate(h, s, 'b', '-tablet');
  }

  // ---------------------------------------------------------------- Admin canvas (tablet landscape)
  {
    const s = await h.session('admin', 'tablet');
    await openQuestion(h, s, 'A');
    await s.page.locator('[role="radiogroup"][aria-label="Admin mode"] [role="radio"]').first().click().catch(() => {});
    await s.page.locator('canvas').first().waitFor();
    await h.settle(s.page, 1200);
    const ADMIN_RECTS = {
      toolbar: '[role="toolbar"]',
      canvas: 'canvas',
      modeSwitch: '[role="radiogroup"][aria-label="Admin mode"]',
    };
    if (h.want('admin-canvas')) await h.shot('admin-canvas', s, { rects: ADMIN_RECTS });

    if (h.want('admin-writing')) {
      // A real writing clip on the TEST admin account: the real canvas, fed the owner's
      // own pen points (a line of Question A) through Chromium's pen input, on a question
      // whose handwriting is empty in the local demo database (production is never touched).
      const src = strokesOf('A');
      const strokes = src.doc.pages[0].strokes;
      const pick = [...strokes.slice(88, 93), ...strokes.slice(229, 234)]; // "T = 2.26 N", as written
      const empty = h.config.capture?.adminWritingQuestion ?? 2;
      await s.page.locator('nav[aria-label="Questions"] button').nth(1).click();
      await s.page.locator(`button[aria-label^="Question ${empty},"]`).click();
      await s.page.locator('canvas').first().waitFor();
      await h.settle(s.page, 1000);
      const canvas = await s.page.locator('canvas').first().boundingBox();
      let minX = Infinity;
      let minY = Infinity;
      for (const st of pick) for (const [x, y] of st.points) (minX = Math.min(minX, x)), (minY = Math.min(minY, y));
      const scale = 2.2; // write it large enough to read on a tablet frame
      const origin = [canvas.x + 120, canvas.y + 140];
      const at = (x, y) => [origin[0] + (x - minX) * scale, origin[1] + (y - minY) * scale];
      // Points per frame so the clip lasts ~2.5 s at 30 fps; a short lift between strokes.
      const totalPts = pick.reduce((n, st) => n + st.points.length, 0);
      const perFrame = Math.max(1, Math.ceil(totalPts / 60));
      const queue = [];
      for (const st of pick) {
        st.points.forEach(([x, y, p], i) => queue.push({ type: i === 0 ? 'down' : 'move', x, y, p }));
        const [lx, ly, lp] = st.points[st.points.length - 1];
        queue.push({ type: 'up', x: lx, y: ly, p: lp });
        queue.push({ type: 'pause' }, { type: 'pause' });
      }
      let q = 0;
      let pointer = null;
      const frames = Math.ceil(queue.length / perFrame) + 20;
      await h.sequence(
        'admin-writing',
        s,
        frames,
        async () => {
          for (let k = 0; k < perFrame && q < queue.length; k++, q++) {
            const e = queue[q];
            if (e.type === 'pause') {
              k = perFrame; // a pause ends the frame
              continue;
            }
            const [sx, sy] = at(e.x, e.y);
            pointer = [sx, sy];
            const type = e.type === 'down' ? 'mousePressed' : e.type === 'up' ? 'mouseReleased' : 'mouseMoved';
            await h.pen(s, type, sx, sy, Math.max(0.05, e.p));
          }
          await s.page.waitForTimeout(16);
          return { pointer };
        },
        { rects: ADMIN_RECTS }
      );
      // Let autosave finish (this is the local demo database).
      await s.page.locator('text=Saved').first().waitFor({ timeout: 20000 }).catch(() => {});
    }
  }
}
