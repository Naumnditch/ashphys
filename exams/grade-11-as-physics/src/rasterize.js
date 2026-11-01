const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
(async () => {
  const dir = path.join(__dirname, '..', 'figs', 'svg');
  const out = path.join(__dirname, '..', 'figs');
  const b = await chromium.launch();
  for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.svg'))) {
    const s = fs.readFileSync(path.join(dir, f), 'utf8');
    const w = +s.match(/width="(\d+)"/)[1], h = +s.match(/height="(\d+)"/)[1];
    const scale = w === 480 ? 2 : 1;
    const p = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: scale });
    await p.setContent(`<html><body style="margin:0">${s}</body></html>`);
    await p.screenshot({ path: path.join(out, f.replace('.svg', '.png')), clip: { x: 0, y: 0, width: w, height: h } });
    await p.close();
  }
  await b.close();
})();
