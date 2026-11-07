// Render-check inline SVG question figures (run outside the repo: PNGs go to <outdir>).
// usage: FIGOUT=<dir> python3 -I database/seeds/2026-11-06-a-level-banks.py chNN
//        node tools/figcheck.js <dir>/chNN.json <scratch outdir> --sheets
// For every figure: render in light and dark themes at 400 px wide, measure each
// <text> bounding box (clipping against the viewBox, overlap with other text),
// and write contact sheets (PNG) for visual review.
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const [, , inFile, outDir, ...flags] = process.argv;
const figs = JSON.parse(fs.readFileSync(inFile, 'utf8'));
fs.mkdirSync(outDir, { recursive: true });

const THEMES = {
  light: { bg: '#ffffff', fg: '#111827', vars: '--fig-accent:#1d4ed8;--fig-accent-2:#b45309;--fig-muted:#6b7280;--fig-grid:#d1d5db;--fig-fill:rgba(29,78,216,0.10)' },
  dark: { bg: '#0b1220', fg: '#e5e7eb', vars: '--fig-accent:#93c5fd;--fig-accent-2:#fbbf24;--fig-muted:#9ca3af;--fig-grid:#4b5563;--fig-fill:rgba(147,197,253,0.16)' },
};

function page(theme, cells, cols) {
  const t = THEMES[theme];
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  :root{${t.vars}} body{margin:0;background:${t.bg};color:${t.fg};font-family:system-ui,sans-serif}
  .grid{display:grid;grid-template-columns:repeat(${cols},420px);gap:10px;padding:10px}
  .cell{border:1px solid #8884;padding:6px;width:406px}
  .k{font-size:11px;opacity:.75;margin-bottom:4px;word-break:break-all}
  .fig svg{display:block;width:100%;height:auto}
  </style></head><body><div class="grid">${cells}</div></body></html>`;
}

(async () => {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1320, height: 900 }, deviceScaleFactor: 1 });
  const pg = await ctx.newPage();
  const problems = [];
  // geometry pass (light theme, one page with everything)
  const cells = figs.map((f, i) => `<div class="cell"><div class="fig" id="f${i}">${f.svg}</div></div>`).join('');
  await pg.setContent(page('light', cells, 3));
  const geo = await pg.evaluate(() => {
    const out = [];
    document.querySelectorAll('.fig').forEach((d) => {
      const svg = d.querySelector('svg');
      const vb = svg.viewBox.baseVal;
      // boxes in viewBox units, after any <g transform> (getBBox alone is local to the element)
      const sr = svg.getBoundingClientRect();
      const k = vb.width / sr.width;
      const texts = [...svg.querySelectorAll('text')].map((t) => {
        const r = t.getBoundingClientRect();
        const b = t.getBBox();
        const kh = b.height / (r.height || 1); // keep the font-box height convention of getBBox
        return { s: t.textContent, x: (r.left - sr.left) * k + vb.x, y: (r.top - sr.top) * k + vb.y, w: r.width * k, h: r.height * k };
      });
      out.push({ vb: [vb.x, vb.y, vb.width, vb.height], texts, bytes: new TextEncoder().encode(svg.outerHTML).length });
    });
    return out;
  });
  geo.forEach((g, i) => {
    const f = figs[i];
    const [vx, vy, vw, vh] = g.vb;
    const issues = [];
    for (const t of g.texts) {
      if (t.x < vx - 0.5 || t.y < vy - 0.5 || t.x + t.w > vx + vw + 0.5 || t.y + t.h > vy + vh + 0.5)
        issues.push(`clipped "${t.s}" [${t.x.toFixed(1)},${t.y.toFixed(1)},${t.w.toFixed(1)},${t.h.toFixed(1)}] in ${vw}x${vh}`);
    }
    for (let a = 0; a < g.texts.length; a++)
      for (let b = a + 1; b < g.texts.length; b++) {
        const p = g.texts[a], q = g.texts[b];
        // shrink boxes slightly: glyph boxes include line-gap padding
        const ix = Math.min(p.x + p.w, q.x + q.w) - Math.max(p.x, q.x);
        const iy = Math.min(p.y + p.h - 2, q.y + q.h - 2) - Math.max(p.y + 2, q.y + 2);
        if (ix > 1 && iy > 1) issues.push(`overlap "${p.s}" / "${q.s}" (${ix.toFixed(1)}x${iy.toFixed(1)})`);
      }
    if (g.bytes > 61440) issues.push(`too large: ${g.bytes} bytes`);
    if (issues.length) problems.push({ key: f.key, issues });
  });
  // contact sheets: 9 per sheet, light and dark
  if (flags.includes('--sheets')) {
    const per = 9;
    for (let s = 0; s * per < figs.length; s++) {
      for (const theme of ['light', 'dark']) {
        const chunk = figs.slice(s * per, s * per + per);
        const c = chunk.map((f) => `<div class="cell"><div class="k">${f.key}</div><div class="fig">${f.svg}</div></div>`).join('');
        await pg.setContent(page(theme, c, 3));
        const file = path.join(outDir, `sheet-${String(s + 1).padStart(2, '0')}-${theme}.png`);
        await pg.screenshot({ path: file, fullPage: true });
      }
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(outDir, 'problems.json'), JSON.stringify(problems, null, 1));
  console.log(`${figs.length} figures checked, ${problems.length} with issues`);
  for (const p of problems) console.log(`- ${p.key}: ${p.issues.join('; ')}`);
})();
