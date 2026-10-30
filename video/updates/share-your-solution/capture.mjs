/**
 * Shot list for "Share your solution" — scripted against the real site (see
 * video/scripts/capture.mjs for the helpers and the safety rules).
 *
 * Start from a clean demo database (`npm run seed -- --reset-only`): the TEST
 * student must have no workspace or shared solution on the showcase question.
 * Needs TEST_STUDENT2_* as well (the "reader" who sees the approved solution).
 *
 * The demo student's working is real input into the real workspace: typed
 * steps through the keyboard, and pen strokes through Chromium's pen input,
 * written in a handwriting stroke font (src/handwriting/strokeFont.ts) — not
 * the teacher's strokes. The display name is the fictional "Sam T.".
 */

import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { layoutLine } from '../../src/handwriting/strokeFont.ts';

const require = createRequire(import.meta.url);
const FONT = JSON.parse(readFileSync(require.resolve('vara/fonts/Shadows-Into-Light/shadows-into-light.json'), 'utf8'));

const DISPLAY_NAME = 'Sam T.';
const WRONG_ANSWER = '6.41e22';
const STEPS_BEFORE = 'Gravity gives the centripetal force:\nGMm/r² = m(4π²/T²)r\nM = 4π²r³/(GT²)';
const STEPS_TYPED = '\nM = 4π²(9.38×10⁶)³ / (6.67×10⁻¹¹ × (2.76×10⁴)²)\nM = 6.41 × 10²³ kg';

/* ------------------------------------------------------------------ the student's pen working (canvas px at 100 %) */

const sup = (text) => ({ text, scale: 0.6, rise: 0.62 });

/** A line of math: text runs and fractions side by side; returns strokes (baseline y = 0) and its extent. */
function mathLine(items, size) {
  const strokes = [];
  let x = 0;
  let top = 0;
  let bottom = 0;
  const gap = size * 0.32;
  const place = (laid, dx, dy) => {
    for (const s of laid.strokes) strokes.push(s.map(([px, py]) => [px + dx, py + dy]));
    top = Math.min(top, laid.top + dy);
    bottom = Math.max(bottom, laid.bottom + dy);
  };
  for (const it of items) {
    if (it.num) {
      const num = layoutLine(FONT, it.num, size * 0.86);
      const den = layoutLine(FONT, it.den, size * 0.86);
      const w = Math.max(num.width, den.width) + size * 0.3;
      const bar = -size * 0.42;
      place(num, x + (w - num.width) / 2, bar - size * 0.2);
      place(den, x + (w - den.width) / 2, bar + size * 0.2 + size * 0.86);
      strokes.push(wobblyLine([x, bar], [x + w, bar - size * 0.03], 9));
      x += w + gap;
    } else {
      const t = layoutLine(FONT, it, size);
      place(t, x, 0);
      x += t.width + gap;
    }
  }
  return { strokes, width: x - gap, top, bottom };
}

/** Deterministic small wobble, so drawn lines and circles look like a hand did them. */
const wob = (k, seed) => Math.sin(k * 1.7 + seed) * 0.6 + Math.sin(k * 0.53 + seed * 2.1) * 0.9;

function wobblyLine([x0, y0], [x1, y1], seed, n = 18) {
  const pts = [];
  for (let k = 0; k <= n; k++) {
    const t = k / n;
    pts.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t + wob(k, seed) * 0.8]);
  }
  return pts;
}

function wobblyCircle([cx, cy], r, seed, from = -100, sweep = 375) {
  const pts = [];
  const n = Math.max(24, Math.round(r * 0.9));
  for (let k = 0; k <= n; k++) {
    const a = ((from + (sweep * k) / n) * Math.PI) / 180;
    const rr = r * (1 + 0.025 * Math.sin(a * 3 + seed)) + wob(k, seed) * 0.4;
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
  }
  return pts;
}

const shift = (strokes, dx, dy) => strokes.map((s) => s.map(([x, y]) => [x + dx, y + dy]));

/** The working written before the clip starts: a sketch of the orbit and the two equations. */
function workingStrokes() {
  const C = [170, 150];
  const R = 100;
  const a = (-38 * Math.PI) / 180;
  const P = [C[0] + R * Math.cos(a), C[1] + R * Math.sin(a)];
  const sketch = [
    wobblyCircle(C, 36, 1),
    wobblyCircle(C, R, 2, -120, 368),
    wobblyCircle(P, 9, 3),
    wobblyLine(C, [P[0] - 6, P[1] + 5], 4, 14),
    // "r" beside the radius, two thirds of the way out (clear of the planet).
    ...shift(layoutLine(FONT, 'r', 26).strokes, C[0] + (P[0] - C[0]) * 0.62 + 12, C[1] + (P[1] - C[1]) * 0.62 + 30),
    ...shift(layoutLine(FONT, 'M', 22).strokes, C[0] - 9, C[1] + 11),
  ];
  const eq1 = mathLine([{ num: 'GMm', den: [{ text: 'r' }, sup('2')] }, '=', { num: [{ text: '4π' }, sup('2'), { text: 'mr' }], den: [{ text: 'T' }, sup('2')] }], 36);
  const eq2 = mathLine(['M =', { num: [{ text: '4π' }, sup('2'), { text: 'r' }, sup('3')], den: [{ text: 'G T' }, sup('2')] }], 36);
  const eq1At = [380, 145];
  const eq2At = [380, 300];
  // Underline the equation that gives M (the key step).
  const under = wobblyLine([eq2At[0] - 6, eq2At[1] + eq2.bottom + 14], [eq2At[0] + eq2.width + 10, eq2At[1] + eq2.bottom + 10], 7, 24);
  return [...sketch, ...shift(eq1.strokes, ...eq1At), ...shift(eq2.strokes, ...eq2At), under];
}

/** Written during the clip: the answer, then a box around it. */
function answerStrokes() {
  const line = mathLine([[{ text: 'M = 6.41 x 10' }, sup('23'), { text: ' kg' }]], 42);
  const at = [380, 470];
  const box = { x0: at[0] - 20, y0: at[1] + line.top - 20, x1: at[0] + line.width + 22, y1: at[1] + line.bottom + 16 };
  // One continuous stroke round the answer, starting top-left and overshooting it a little, as a hand does.
  const corners = [
    [box.x0 + 6, box.y0 - 2],
    [box.x1, box.y0 + 3],
    [box.x1 - 3, box.y1],
    [box.x0 - 2, box.y1 - 2],
    [box.x0 + 2, box.y0 - 6],
    [box.x0 + 30, box.y0 - 5],
  ];
  const outline = [];
  corners.slice(1).forEach((c, k) => outline.push(...wobblyLine(corners[k], c, 11 + k, 16).slice(k === 0 ? 0 : 1)));
  return { answer: shift(line.strokes, ...at), box: outline, rect: [box.x0 - 8, box.y0 - 8, box.x1 - box.x0 + 16, box.y1 - box.y0 + 16] };
}

/* ------------------------------------------------------------------ page helpers */

/** Open the showcase question on the practice page (checked against the question text). */
async function openQuestion(h, s) {
  const q = h.config.capture.question;
  await s.page.goto(`${h.baseUrl}/practice/${q.lessonId}?c=a-level`, { waitUntil: 'networkidle' });
  await h.settle(s.page);
  const current = await s.page.locator('nav[aria-label="Questions"] button').nth(1).getAttribute('aria-label');
  if (!current?.startsWith(`Question ${q.number} of`)) {
    await s.page.locator('nav[aria-label="Questions"] button').nth(1).click();
    await s.page.locator(`button[aria-label^="Question ${q.number},"]`).click();
    await h.settle(s.page, 600);
  }
  const text = await s.page.locator('section[aria-label^="Question "] p.mb-5').first().innerText();
  for (const fragment of h.config.showcase.B.questionIncludes) {
    if (!text.includes(fragment)) throw new Error(`The page shows a different question (no "${fragment}"):\n${text}`);
  }
  await s.page.mouse.move(5, s.viewport.height - 5);
}

/** Pen input for whole strokes, `perFrame` points at a time (returns a stepper for sequences). */
function penWriter(h, s, origin, strokes) {
  const queue = [];
  strokes.forEach((st, si) => {
    st.forEach(([x, y], i) => {
      const p = 0.42 + 0.14 * Math.sin(i / 4 + si);
      queue.push({ type: i === 0 ? 'mousePressed' : 'mouseMoved', x: origin[0] + x, y: origin[1] + y, p });
    });
    const [lx, ly] = st[st.length - 1];
    queue.push({ type: 'mouseReleased', x: origin[0] + lx, y: origin[1] + ly, p: 0.3 });
  });
  let q = 0;
  return {
    get done() {
      return q >= queue.length;
    },
    total: queue.length,
    async step(n) {
      let last = null;
      for (let k = 0; k < n && q < queue.length; k++, q++) {
        const e = queue[q];
        await h.pen(s, e.type, e.x, e.y, e.p);
        last = [e.x, e.y];
      }
      return last;
    },
  };
}

const ease = (t) => 0.5 - 0.5 * Math.cos(Math.PI * Math.min(1, Math.max(0, t)));

/** A mouse that glides between targets over a number of frames (real mouse events). */
function glider(s, start) {
  let pos = start;
  let from = start;
  let to = start;
  let k = 0;
  let n = 1;
  return {
    get pos() {
      return pos;
    },
    aim(target, frames) {
      from = pos;
      to = target;
      k = 0;
      n = frames;
    },
    async tick() {
      if (k < n) {
        k++;
        const t = ease(k / n);
        pos = [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
        await s.page.mouse.move(pos[0], pos[1]);
      }
      return pos;
    },
  };
}

const centre = async (loc) => {
  const b = await loc.boundingBox();
  return [b.x + b.width / 2, b.y + b.height / 2];
};

const WORKSPACE_RECTS = {
  panel: 'section[aria-label="My working"]',
  canvas: 'section[aria-label="My working"] canvas',
  toolbar: '[role="toolbar"]',
  canvasSaved: 'section[aria-label="My working"] [role="toolbar"] ~ * :text("Saved"), section[aria-label="My working"] :text-is("Saved")',
  stepsBar: 'button:has-text("Typed steps")',
  stepsSaved: 'button:has-text("Typed steps") [role="status"]',
  steps: 'textarea[aria-label^="Typed steps"]',
  shareRow: 'section[aria-label="My working"] div:has(> button:has-text("Share my solution")), section[aria-label="My working"] div:has(> div > button:has-text("Withdraw"))',
  shareButton: 'button:has-text("Share my solution")',
};

export async function capture(h) {
  // ---------------------------------------------------------------- 1. The student works it out (desktop)
  const s = await h.session('student', 'desktop');
  s.page.on('dialog', (d) => d.accept()); // "Withdraw your shared solution?" (scene 5)
  await openQuestion(h, s);
  const canvas = await s.page.locator('section[aria-label="My working"] canvas').first().boundingBox();
  const origin = [canvas.x, canvas.y];

  // Working written and typed before the clip starts.
  await s.page.locator('button:has-text("Typed steps")').click();
  const steps = s.page.locator('textarea[aria-label^="Typed steps"]');
  await steps.fill(STEPS_BEFORE);
  await steps.blur();
  const pre = penWriter(h, s, origin, workingStrokes());
  while (!pre.done) await pre.step(40);
  // Wait for both autosaves and for the one-off "Pencil detected" hint to go away.
  await s.page.locator('button:has-text("Typed steps") [role="status"]:has-text("Saved")').waitFor({ timeout: 20000 });
  await s.page.locator('text=Pencil detected').waitFor({ state: 'hidden', timeout: 20000 }).catch(() => {});
  await s.page.mouse.move(5, s.viewport.height - 5);
  await h.settle(s.page, 1200);

  if (h.want('solve')) {
    const { answer, box, rect } = answerStrokes();
    const writeAnswer = penWriter(h, s, origin, answer);
    const drawBox = penWriter(h, s, origin, [box]);
    const typed = [...STEPS_TYPED];
    let typedAt = 0;
    const phases = [
      ['hold', 6],
      ['answer', 44],
      ['pause', 4],
      ['box', 16],
      ['pause', 6],
      ['type', 44],
      ['saved', 30],
    ];
    const plan = phases.flatMap(([name, n]) => Array.from({ length: n }, (_, k) => [name, k, n]));
    const shotEntry = await h.sequence(
      'solve',
      s,
      plan.length,
      async (i) => {
        const [name, k, n] = plan[i];
        if (name === 'answer') {
          const p = await writeAnswer.step(Math.ceil(writeAnswer.total / n));
          return { pointer: p, tool: 'pen' };
        }
        if (name === 'box') {
          const p = await drawBox.step(Math.ceil(drawBox.total / n));
          return { pointer: p, tool: 'pen' };
        }
        if (name === 'type') {
          if (k === 0) {
            await steps.click();
            await s.page.keyboard.press('Control+End');
            await s.page.mouse.move(5, s.viewport.height - 5);
          }
          const until = Math.round((typed.length * (k + 1)) / n);
          if (until > typedAt) await s.page.keyboard.type(typed.slice(typedAt, until).join(''));
          typedAt = until;
          return {};
        }
        if (name === 'saved' && k === 0) await steps.blur();
        await s.page.waitForTimeout(name === 'saved' ? 60 : 16);
        return {};
      },
      { rects: WORKSPACE_RECTS }
    );
    shotEntry.rects.answer = [origin[0] + rect[0], origin[1] + rect[1], rect[2], rect[3]];
    shotEntry.rects.working = [origin[0] + 30, origin[1] + 20, 900, 520];
    await s.page.locator('button:has-text("Typed steps") [role="status"]:has-text("Saved")').waitFor({ timeout: 20000 });
    await s.page.locator('section[aria-label="My working"] :text-is("Saved")').first().waitFor({ timeout: 20000 }).catch(() => {});
    await h.settle(s.page, 800);
  }

  // ---------------------------------------------------------------- 2. Share my solution (desktop)
  if (h.want('share')) {
    const dlg = () => s.page.locator('form[role="dialog"]');
    const mouse = glider(s, [1500, 760]);
    await s.page.mouse.move(...mouse.pos);
    let dialogRects = null;
    let afterRects = null;
    let typedName = 0;
    const plan = [
      ['hold', 4],
      ['toShare', 12],
      ['clickShare', 1],
      ['open', 8],
      ['toName', 10],
      ['selectName', 2],
      ['typeName', 18],
      ['pause', 4],
      ['toAge', 10],
      ['clickAge', 1],
      ['pause', 4],
      ['toWorked', 8],
      ['clickWorked', 1],
      ['toLicence', 7],
      ['clickLicence', 1],
      ['toParent', 7],
      ['clickParent', 1],
      ['measure', 6],
      ['toSubmit', 10],
      ['clickSubmit', 1],
      ['after', 34],
    ].flatMap(([name, n]) => Array.from({ length: n }, (_, k) => [name, k, n]));
    const target = {
      toShare: () => centre(s.page.locator('button:has-text("Share my solution")')),
      toName: () => centre(dlg().locator('input[type="text"]')),
      toAge: () => centre(dlg().locator('label:has(input[type="radio"])').first()),
      toWorked: () => centre(dlg().locator('input[type="checkbox"]').nth(0)),
      toLicence: () => centre(dlg().locator('input[type="checkbox"]').nth(1)),
      toParent: () => centre(dlg().locator('input[type="checkbox"]').nth(2)),
      toSubmit: () => centre(dlg().locator('button[type="submit"]')),
    };
    const shotEntry = await h.sequence(
      'share',
      s,
      plan.length,
      async (i) => {
        const [name, k, n] = plan[i];
        let event = null;
        if (target[name]) {
          if (k === 0) mouse.aim(await target[name](), n);
          await mouse.tick();
        } else if (name.startsWith('click')) {
          await s.page.mouse.down();
          await s.page.mouse.up();
          event = { kind: 'click' };
          await s.page.waitForTimeout(name === 'clickSubmit' ? 400 : 120);
        } else if (name === 'selectName') {
          if (k === 0) {
            await s.page.mouse.down();
            await s.page.mouse.up();
            event = { kind: 'click' };
          } else await s.page.keyboard.press('Control+A');
        } else if (name === 'typeName') {
          const until = Math.round((DISPLAY_NAME.length * (k + 1)) / n);
          if (until > typedName) await s.page.keyboard.type(DISPLAY_NAME.slice(typedName, until));
          typedName = until;
        } else if (name === 'measure' && k === 0) {
          dialogRects = await h.rectsOf(s.page, {
            dialog: 'form[role="dialog"]',
            nameInput: 'form[role="dialog"] input[type="text"]',
            nameHelp: 'form[role="dialog"] p[id$="-name-help"]',
            age: 'form[role="dialog"] fieldset',
            checkWorked: 'form[role="dialog"] label:has(input[type="checkbox"]) >> nth=0',
            checkLicence: 'form[role="dialog"] label:has(input[type="checkbox"]) >> nth=1',
            checkParent: 'form[role="dialog"] label:has(input[type="checkbox"]) >> nth=2',
            boxWorked: 'form[role="dialog"] input[type="checkbox"] >> nth=0',
            boxLicence: 'form[role="dialog"] input[type="checkbox"] >> nth=1',
            boxParent: 'form[role="dialog"] input[type="checkbox"] >> nth=2',
            submit: 'form[role="dialog"] button[type="submit"]',
          });
        } else if (name === 'after' && k === 6) {
          // The "Shared." notice goes away after a few seconds: measure it while it shows.
          afterRects = await h.rectsOf(s.page, {
            notice: 'section[aria-label="My working"] p[role="status"]',
            pendingChip: 'section[aria-label="My working"] span:text-is("Pending review")',
          });
        } else {
          await s.page.waitForTimeout(name === 'after' ? 50 : 30);
        }
        return { pointer: mouse.pos, event };
      },
      { rects: { ...WORKSPACE_RECTS, shareButton: undefined } }
    );
    Object.assign(shotEntry.rects, dialogRects, afterRects);
    const shared = await s.page.locator('text=Pending review').first().isVisible().catch(() => false);
    if (!shared) throw new Error('share: the submission did not show as pending — is the demo database reset?');
  }

  // ---------------------------------------------------------------- 3. The admin reviews it (desktop 16:10, so the Approve row fits)
  if (h.want('review')) {
    const a = await h.session('admin', 'desktop-tall');
    await a.page.goto(`${h.baseUrl}/admin/shared-solutions`, { waitUntil: 'networkidle' });
    await h.settle(a.page, 1500);
    const card = a.page.locator(`article[aria-label="Student solution by ${DISPLAY_NAME}"]`).first();
    await card.waitFor();
    // Card top just under the window's top edge.
    const top = (await card.boundingBox()).y + (await a.page.evaluate(() => window.scrollY));
    await a.page.evaluate((y) => window.scrollTo(0, y), Math.max(0, top - 16));
    await a.page.mouse.move(5, a.viewport.height - 5);
    await h.settle(a.page, 800);
    const REVIEW_RECTS = {
      card: `article[aria-label="Student solution by ${DISPLAY_NAME}"]`,
      header: 'article header',
      chip: 'article header > span:first-child',
      question: 'article section[aria-label="Question"]',
      teacherPane: 'article section[aria-label="Teacher solution"]',
      studentPane: `article section[aria-label="Student solution by ${DISPLAY_NAME}"]`,
      panes: 'article div.grid:has(> section[aria-label="Teacher solution"])',
      approve: 'article button:text-is("Approve")',
      reject: 'article button:text-is("Reject")',
      verified: 'article label:has-text("Verified against mark scheme")',
      verifiedBox: 'article label:has-text("Verified against mark scheme") input',
      actions: 'article div:has(> button:text-is("Approve"))',
    };
    await h.shot('review-pending', a, { rects: REVIEW_RECTS });
    await a.page.locator('article button:text-is("Approve")').click();
    await a.page.locator('article header :text("Approved")').first().waitFor();
    await a.page.mouse.move(5, a.viewport.height - 5);
    await h.settle(a.page, 600);
    await h.shot('review-approved', a, { rects: { ...REVIEW_RECTS, unpublish: 'article button:has-text("Unpublish")' } });
    await a.page.locator('article label:has-text("Verified against mark scheme") input').check();
    await a.page.locator('article header :text("Verified against mark scheme")').first().waitFor();
    await a.page.mouse.move(5, a.viewport.height - 5);
    await h.settle(a.page, 600);
    await h.shot('review-verified', a, { rects: { ...REVIEW_RECTS, badge: 'article header :text("Verified against mark scheme")' } });
  }

  // ---------------------------------------------------------------- 4. Another student sees it on the question (desktop)
  if (h.want('board')) {
    const r = await h.session('reader', 'desktop');
    await openQuestion(h, r);
    const input = r.page.locator('input[placeholder="Your answer"]').first();
    await input.fill(WRONG_ANSWER);
    await r.page.locator('button:has-text("Check Answer")').click();
    await r.page.locator('text=Not quite').first().waitFor();
    const offer = r.page.locator('button:has-text("Show the worked solution")');
    if (await offer.isVisible().catch(() => false)) await offer.click();
    const solution = r.page.locator('[role="radio"]:has-text("Worked solution")');
    if ((await solution.getAttribute('aria-checked').catch(() => 'true')) !== 'true') await solution.click();
    await r.page.locator(`section[aria-label="Student solution by ${DISPLAY_NAME}"] svg`).first().waitFor({ timeout: 20000 });
    await r.page.mouse.move(5, r.viewport.height - 5);
    await h.settle(r.page, 1500);
    await h.shot('board', r, {
      rects: {
        feedback: 'div:has(> p:has-text("Not quite"))',
        panel: 'section[aria-label="Worked solution"]',
        teacherPane: 'section[aria-label="Teacher solution"]',
        studentPane: `section[aria-label="Student solution by ${DISPLAY_NAME}"]`,
        studentHeader: `section[aria-label="Student solution by ${DISPLAY_NAME}"] > div:first-child`,
        studentTitle: `section[aria-label="Student solution by ${DISPLAY_NAME}"] h3`,
        badge: `section[aria-label="Student solution by ${DISPLAY_NAME}"] > div:first-child :text("Verified")`,
        studentInk: `section[aria-label="Student solution by ${DISPLAY_NAME}"] [aria-roledescription="zoomable solution"]`,
        // The drawn page itself (the viewer fits it to the pane's width).
        studentSheet: `section[aria-label="Student solution by ${DISPLAY_NAME}"] [aria-roledescription="zoomable solution"] svg > g`,
        teacherSheet: 'section[aria-label="Teacher solution"] [aria-roledescription="zoomable solution"] svg > g',
        studentSteps: `section[aria-label="Student solution by ${DISPLAY_NAME}"] p:text-is("Steps") >> xpath=..`,
      },
    });
  }

  // ---------------------------------------------------------------- 5. Withdraw (the student again, desktop)
  if (h.want('withdraw')) {
    await openQuestion(h, s);
    await s.page.locator('button:text-is("Withdraw")').waitFor();
    await h.settle(s.page, 800);
    const WITHDRAW_RECTS = {
      ...WORKSPACE_RECTS,
      withdraw: 'button:text-is("Withdraw")',
      statusRow: 'section[aria-label="My working"] div:has(> div > button:text-is("Withdraw"))',
    };
    await h.shot('withdraw', s, { rects: WITHDRAW_RECTS });
    await s.page.locator('button:text-is("Withdraw")').click();
    await s.page.locator('text=Withdrawn. It is no longer shown to anyone.').waitFor();
    await s.page.mouse.move(5, s.viewport.height - 5);
    // No settle here: the notice disappears after a few seconds.
    await s.page.waitForTimeout(300);
    await h.shot('withdrawn', s, {
      // The notice first: it goes away after a few seconds.
      rects: {
        notice: 'section[aria-label="My working"] p[role="status"]',
        chip: 'section[aria-label="My working"] span:text-is("Withdrawn")',
        statusRow: 'section[aria-label="My working"] div:has(> p[role="status"])',
        panel: WORKSPACE_RECTS.panel,
        steps: WORKSPACE_RECTS.steps,
      },
    });
  }
}
