import { describe, expect, it } from 'vitest';
import { writeFileSync } from 'node:fs';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { pdfText, renderReportPdf, reportFilename } from '@/lib/reports/pdf';
import { sampleReport } from './fixture';

async function readPdf(buf: Buffer) {
  const pdf = await getDocument({ data: new Uint8Array(buf), useSystemFonts: false }).promise;
  const pages: string[] = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    pages.push(content.items.map((it) => ('str' in it ? it.str : '')).join(' '));
  }
  return pages;
}

describe('report PDF', () => {
  it('starts with the student name, carries the note, plan, charts and fits two pages', async () => {
    const buf = await renderReportPdf(sampleReport());
    if (process.env.REPORT_PDF_OUT) writeFileSync(process.env.REPORT_PDF_OUT, buf);
    const pages = await readPdf(buf);
    expect(pages.length).toBeLessThanOrEqual(2);
    const all = pages.join('\n');
    expect(pages[0].indexOf('Yusuf Demir')).toBeLessThan(pages[0].indexOf('A note from your teacher'));
    expect(all).toContain('Mr. Abdelrahman');
    expect(all).toContain('WHAT TO DO NEXT');
    expect(all).toContain('Your teacher');
    expect(all).toContain('STRONG POINTS');
    expect(all).toContain('FOCUS AREAS');
    expect(all).toContain('WEEKLY PROGRESS');
    expect(all).toContain('QUESTIONS TO GO BACK TO');
    expect(all).toMatch(/Page 1 of \d/);
  });

  it('builds a short report for a student with no answers and no note', async () => {
    const r = sampleReport({ note: null, answered: 0 });
    r.lessons = [];
    r.revise = [];
    const pages = await readPdf(await renderReportPdf(r));
    expect(pages).toHaveLength(1);
    expect(pages[0]).toContain('Yusuf Demir');
    expect(pages[0]).not.toContain('A note from your teacher');
    expect(pages[0]).not.toContain('WEEKLY PROGRESS');
  });

  it('drops emoji the font lacks but keeps the star', () => {
    expect(pdfText('📌 Your teacher’s focus ★')).toBe("Your teacher's focus ★");
    expect(reportFilename(sampleReport())).toBe('AshPhys report - Yusuf Demir - 2026-10-27.pdf');
  });
});
