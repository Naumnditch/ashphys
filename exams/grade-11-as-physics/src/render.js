const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage();
  const out = path.resolve(__dirname, '..');
  const jobs = [['exam.html', 'Grade11_AS_Physics_Exam.pdf', 'Grade 11 · AS Level Physics · School Examination'],
                ['mark_scheme.html', 'Grade11_AS_Physics_Mark_Scheme.pdf', 'Grade 11 · AS Level Physics · Mark Scheme (confidential)']];
  for (const [src, dst, label] of jobs) {
    await p.goto('file://' + path.resolve(__dirname, '../build', src));
    await p.waitForLoadState('networkidle');
    await p.pdf({ path: path.join(out, dst), format: 'A4', printBackground: true, preferCSSPageSize: true,
      displayHeaderFooter: true, headerTemplate: '<span></span>',
      footerTemplate: `<div style="font-family:Liberation Sans,Arial;font-size:8px;color:#6b7280;width:100%;padding:0 16mm;display:flex;justify-content:space-between"><span>${label}</span><span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>` });
    console.log('wrote', dst);
  }
  await b.close();
})();
