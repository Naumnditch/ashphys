/**
 * The student progress report as an A4 PDF, drawn with PDFKit on the server
 * (same toolchain and bundled DejaVu fonts as the practice worksheets, see
 * lib/practice/worksheetPdf.ts). Mirrors the on-screen report: the name in
 * bold first, the score and key numbers, the teacher's note, the action plan,
 * strengths vs focus areas, weekly progress, the study calendar, accuracy by
 * lesson and difficulty, why answers were wrong and the questions to revise.
 *
 * Layout is manual (margins 0, so PDFKit never paginates on its own): each
 * block measures itself and moves to a new page when it would not fit.
 */

import path from 'node:path';
import PDFDocument from 'pdfkit';
import type { StudentReport } from '@/lib/reports/types';
import { formatMinutes, pct } from '@/lib/reports/insights';

type Doc = PDFKit.PDFDocument;

const FONT_DIR = path.join(process.cwd(), 'lib/practice/fonts');
const REGULAR = path.join(FONT_DIR, 'DejaVuSans.ttf');
const BOLD = path.join(FONT_DIR, 'DejaVuSans-Bold.ttf');

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const M = 36;
const CW = PAGE_W - 2 * M;
const BOTTOM = PAGE_H - 44;
const GAP = 12;

const INK = '#111827';
const SUB = '#4b5563';
const MUTED = '#9ca3af';
const LINE = '#e5e7eb';
const SOFT = '#f3f4f6';
const BLUE = '#2563eb';
const RIGHT = '#2a78d6';
const WRONG = '#eb6834';
const HEAT = ['#eef0f3', '#c7dcf7', '#8db8ee', '#4f8fe0', '#1d5fbf'];

const BAND: Record<string, string> = {
  excellent: '#059669',
  good: '#2563eb',
  developing: '#d97706',
  support: '#e11d48',
  start: '#9ca3af',
};

function tone(acc: number | null): string {
  if (acc === null) return '#d1d5db';
  if (acc >= 0.8) return '#10b981';
  if (acc >= 0.6) return '#3b82f6';
  if (acc >= 0.4) return '#f59e0b';
  return '#f43f5e';
}

const TZ = 'Europe/Istanbul';
const date = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: TZ }) : '—';
const shortDay = (day: string) => new Date(`${day}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });

/** Pictographs the bundled font lacks become plain text (or vanish). */
export function pdfText(s: string): string {
  return s
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{200D}]/gu, (ch) => (ch === '★' || ch === '✓' ? ch : ''))
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

class Layout {
  y = M;
  page = 1;
  constructor(public doc: Doc, private footer: string) {}

  ensure(h: number) {
    if (this.y + h > BOTTOM) this.newPage();
  }

  newPage() {
    this.doc.addPage({ size: 'A4', margins: { top: 0, bottom: 0, left: 0, right: 0 } });
    this.page++;
    this.y = M;
  }

  footers() {
    const range = this.doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      this.doc.switchToPage(i);
      this.doc
        .font('regular')
        .fontSize(7.5)
        .fillColor(MUTED)
        .text(this.footer, M, PAGE_H - 30, { width: CW - 60, lineBreak: false })
        .text(`Page ${i + 1} of ${range.count}`, M, PAGE_H - 30, { width: CW, align: 'right', lineBreak: false });
    }
  }
}

function sectionTitle(doc: Doc, text: string, x: number, y: number, w: number, aside?: string) {
  doc.font('bold').fontSize(8.5).fillColor('#6b7280').text(text.toUpperCase(), x, y, { width: w, characterSpacing: 0.6, lineBreak: false });
  if (aside) doc.font('regular').fontSize(7.5).fillColor(MUTED).text(aside, x, y + 0.5, { width: w, align: 'right', lineBreak: false });
  return y + 15;
}

function box(doc: Doc, x: number, y: number, w: number, h: number, fill = '#ffffff', stroke = LINE) {
  doc.roundedRect(x, y, w, h, 7).lineWidth(0.8).fillAndStroke(fill, stroke);
}

function arc(doc: Doc, cx: number, cy: number, r: number, frac: number, color: string, width: number) {
  if (frac <= 0) return;
  if (frac >= 0.999) {
    doc.circle(cx, cy, r).lineWidth(width).strokeColor(color).stroke();
    return;
  }
  const a0 = -Math.PI / 2;
  const a1 = a0 + frac * 2 * Math.PI;
  const x0 = cx + r * Math.cos(a0);
  const y0 = cy + r * Math.sin(a0);
  const x1 = cx + r * Math.cos(a1);
  const y1 = cy + r * Math.sin(a1);
  doc
    .path(`M ${x0} ${y0} A ${r} ${r} 0 ${frac > 0.5 ? 1 : 0} 1 ${x1} ${y1}`)
    .lineWidth(width)
    .lineCap('round')
    .strokeColor(color)
    .stroke();
  doc.lineCap('butt');
}

/** "Label ........ 72% · 31/43" + a bar. Returns the height used. */
function accuracyRow(doc: Doc, x: number, y: number, w: number, label: string, correct: number, attempted: number) {
  const acc = attempted ? correct / attempted : null;
  const right = `${acc === null ? '—' : pct(acc)} · ${correct}/${attempted}`;
  doc.font('regular').fontSize(8).fillColor(SUB);
  const rw = doc.widthOfString(right) + 4;
  doc.font('regular').fontSize(8.5).fillColor(INK).text(pdfText(label), x, y, { width: w - rw - 6, lineBreak: false, ellipsis: true });
  doc.font('bold').fontSize(8).fillColor(SUB).text(right, x, y + 0.5, { width: w, align: 'right', lineBreak: false });
  doc.roundedRect(x, y + 12, w, 4.5, 2.25).fill(SOFT);
  if (acc) doc.roundedRect(x, y + 12, Math.max(4.5, w * acc), 4.5, 2.25).fill(tone(acc));
  return 22;
}

function header(L: Layout, r: StudentReport) {
  const { doc } = L;
  doc.rect(0, 0, PAGE_W, 5).fill(BLUE);
  doc.font('bold').fontSize(8).fillColor(BLUE).text('ASHPHYS  ·  PROGRESS REPORT', M, M - 6, { characterSpacing: 1, lineBreak: false });
  doc.font('regular').fontSize(8).fillColor(MUTED).text(`Generated ${date(r.generatedAt)}`, M, M - 6, { width: CW, align: 'right', lineBreak: false });
  doc.font('bold').fontSize(24).fillColor(INK);
  const name = pdfText(r.student.name);
  const nh = doc.heightOfString(name, { width: CW });
  doc.text(name, M, M + 8, { width: CW });
  let y = M + 8 + nh + 1;
  const meta = [r.student.className, r.student.schoolName, r.student.curricula.join(' · ') || null, r.student.email]
    .filter(Boolean)
    .join('  ·  ');
  doc.font('regular').fontSize(9).fillColor(SUB).text(pdfText(meta), M, y, { width: CW, lineBreak: false, ellipsis: true });
  y += 18;
  doc.moveTo(M, y).lineTo(M + CW, y).lineWidth(0.8).strokeColor(LINE).stroke();
  L.y = y + GAP;
}

function snapshot(L: Layout, r: StudentReport) {
  const { doc } = L;
  const h = r.badges.length ? 128 : 108;
  L.ensure(h);
  const y = L.y;
  box(doc, M, y, CW, h);
  // Score ring
  const cx = M + 52;
  const cy = y + 54;
  doc.circle(cx, cy, 34).lineWidth(8).strokeColor('#eef0f3').stroke();
  const rated = r.score.band.id !== 'start';
  arc(doc, cx, cy, 34, rated ? r.score.value / 100 : 0, BAND[r.score.band.id], 8);
  doc.font('bold').fontSize(20).fillColor(INK).text(rated ? String(r.score.value) : '—', cx - 30, cy - 13, { width: 60, align: 'center', lineBreak: false });
  if (rated) doc.font('regular').fontSize(6).fillColor(MUTED).text('OUT OF 100', cx - 30, cy + 9, { width: 60, align: 'center', lineBreak: false });

  const tx = M + 100;
  doc.font('bold').fontSize(14).fillColor(BAND[r.score.band.id]).text(r.score.band.label, tx, y + 22, { width: 140, lineBreak: false });
  doc.font('regular').fontSize(8.5).fillColor(SUB).text(r.score.band.summary, tx, y + 41, { width: 135 });
  const trendText: Record<string, string> = {
    up: `Improving · ${pct(r.trend.recent)} last 2 weeks`,
    down: `Dipping · ${pct(r.trend.recent)} last 2 weeks (was ${pct(r.trend.previous)})`,
    flat: `Steady · ${pct(r.trend.recent)} last 2 weeks`,
    new: 'Not enough answers to compare yet',
    quiet: 'No answers in the last 2 weeks',
  };
  if (r.kpis.answered > 0)
    doc.font('bold').fontSize(7.5).fillColor(SUB).text(trendText[r.trend.direction], tx, y + 76, { width: 140 });

  // KPIs 2×2
  const k = r.kpis;
  const tiles: [string, string, string][] = [
    ['QUESTIONS DONE', String(k.answered), `${k.right} right · ${k.wrong} still wrong`],
    ['ACCURACY', pct(k.accuracy), `${pct(k.firstTryAccuracy)} right first time`],
    ['LESSONS', `${k.mastered}/${k.practised}`, 'mastered / practised'],
    ['LAST 30 DAYS', `${k.activeDays30} day${k.activeDays30 === 1 ? '' : 's'}`, `${formatMinutes(k.minutes30)}${k.currentStreak > 1 ? ` · ${k.currentStreak}-day streak` : ''}`],
  ];
  const gx = M + 252;
  const gw = (CW - 252 - 12) / 2;
  tiles.forEach(([label, value, sub], i) => {
    const x = gx + (i % 2) * (gw + 6);
    const ty = y + 10 + Math.floor(i / 2) * 45;
    doc.roundedRect(x, ty, gw, 40, 5).fill('#f9fafb');
    doc.font('bold').fontSize(6.5).fillColor(MUTED).text(label, x + 8, ty + 6, { width: gw - 16, characterSpacing: 0.5, lineBreak: false });
    doc.font('bold').fontSize(13).fillColor(INK).text(value, x + 8, ty + 14, { width: gw - 16, lineBreak: false });
    doc.font('regular').fontSize(7).fillColor(SUB).text(sub, x + 8, ty + 29, { width: gw - 16, lineBreak: false, ellipsis: true });
  });

  if (r.badges.length) {
    let bx = M + 12;
    const by = y + h - 22;
    doc.font('bold').fontSize(7.5);
    for (const b of r.badges) {
      const label = pdfText(b.label);
      const w = doc.widthOfString(label) + 14;
      if (bx + w > M + CW - 10) break;
      doc.roundedRect(bx, by, w, 14, 7).fill(SOFT);
      doc.fillColor('#374151').text(label, bx + 7, by + 3.5, { lineBreak: false });
      bx += w + 5;
    }
  }
  L.y = y + h + GAP;
}

function teacherNote(L: Layout, r: StudentReport) {
  const note = r.notes[0];
  if (!note) return;
  const { doc } = L;
  const body = pdfText(note.body.replace(/\n{3,}/g, '\n\n')).replace(/[ \t]*\n[ \t]*/g, '\n');
  doc.font('regular').fontSize(9.5);
  const bh = doc.heightOfString(body, { width: CW - 32, lineGap: 1.5 });
  const h = 26 + bh + 28;
  L.ensure(Math.min(h, BOTTOM - M));
  const y = L.y;
  doc.roundedRect(M, y, CW, h, 7).lineWidth(0.8).fillAndStroke('#fffbeb', '#fde68a');
  doc.rect(M, y + 4, 3.5, h - 8).fill('#f59e0b');
  doc.font('bold').fontSize(9.5).fillColor('#78350f').text('A note from your teacher', M + 16, y + 11, { lineBreak: false });
  doc.font('regular').fontSize(8).fillColor('#92400e').text(date(note.createdAt), M, y + 12, { width: CW - 14, align: 'right', lineBreak: false });
  doc.font('regular').fontSize(9.5).fillColor(INK).text(body, M + 16, y + 28, { width: CW - 32, lineGap: 1.5 });
  doc.font('bold').fontSize(9.5).fillColor('#78350f').text(`— ${pdfText(note.signature)}`, M + 16, y + h - 20, { width: CW - 32, align: 'right', lineBreak: false });
  L.y = y + h + GAP;
}

function plan(L: Layout, r: StudentReport) {
  const { doc } = L;
  const items = r.plan.map((s) => ({ title: pdfText(s.title), detail: pdfText(s.detail), teacher: s.source === 'teacher' }));
  if (!items.length) return;
  const tw = CW - 52;
  const heights = items.map((s) => {
    doc.font('bold').fontSize(9.5);
    const a = doc.heightOfString(s.title, { width: tw });
    doc.font('regular').fontSize(8.5);
    return a + doc.heightOfString(s.detail, { width: tw }) + 12;
  });
  const total = 34 + heights.reduce((a, b) => a + b, 0);
  L.ensure(total);
  let y = L.y;
  box(doc, M, y, CW, total);
  y = sectionTitle(doc, 'What to do next', M + 12, y + 11, CW - 24) + 2;
  items.forEach((s, i) => {
    doc.circle(M + 22, y + 6, 7.5).fill(s.teacher ? '#f59e0b' : SOFT);
    doc.font('bold').fontSize(8.5).fillColor(s.teacher ? '#ffffff' : INK).text(String(i + 1), M + 14.5, y + 2, { width: 15, align: 'center', lineBreak: false });
    doc.font('bold').fontSize(9.5).fillColor(s.teacher ? '#92400e' : INK).text(s.title, M + 38, y, { width: tw });
    const ty = doc.y;
    doc.font('regular').fontSize(8.5).fillColor(SUB).text(s.detail, M + 38, ty + 1, { width: tw });
    y += heights[i];
  });
  L.y = L.y + total + GAP;
}

function strengthsFocus(L: Layout, r: StudentReport) {
  const { doc } = L;
  const colW = (CW - GAP) / 2;
  const rows = Math.max(1, r.strengths.length, r.focus.length);
  const h = 32 + rows * 34;
  L.ensure(h);
  const y = L.y;
  const cols: [string, typeof r.strengths, string][] = [
    ['Strong points', r.strengths, 'Shows once there are 5+ answers in two lessons.'],
    ['Focus areas — revise these', r.focus, 'No weak lesson stands out yet.'],
  ];
  cols.forEach(([title, list, empty], c) => {
    const x = M + c * (colW + GAP);
    box(doc, x, y, colW, h);
    let yy = sectionTitle(doc, title, x + 12, y + 11, colW - 24);
    if (!list.length) {
      doc.font('regular').fontSize(8.5).fillColor(MUTED).text(empty, x + 12, yy, { width: colW - 24 });
      return;
    }
    for (const l of list) {
      accuracyRow(doc, x + 12, yy, colW - 24, `${l.mastered ? '★ ' : ''}${l.name}`, l.correct, l.attempted);
      doc
        .font('regular')
        .fontSize(7)
        .fillColor(MUTED)
        .text(pdfText(c === 1 ? `${l.questionsRight}/${l.questions} questions now right · ${l.chapter}` : l.chapter), x + 12, yy + 19, {
          width: colW - 24,
          height: 9,
          ellipsis: true,
        });
      yy += 34;
    }
  });
  L.y = y + h + GAP;
}

function charts(L: Layout, r: StudentReport) {
  const { doc } = L;
  const colW = (CW - GAP) / 2;
  const h = 150;
  L.ensure(h);
  const y = L.y;

  // Weekly progress (stacked bars)
  box(doc, M, y, colW, h);
  sectionTitle(doc, 'Weekly progress', M + 12, y + 11, colW - 24, 'right / wrong answers');
  const cx = M + 30;
  const cw = colW - 42;
  const top = y + 32;
  const ch = h - 58;
  const max = Math.max(4, ...r.weekly.map((w) => w.correct + w.incorrect));
  const step = Math.pow(10, Math.floor(Math.log10(max)));
  const ymax = Math.ceil(max / step) * step;
  const yy = (v: number) => top + ch * (1 - v / ymax);
  for (const v of [0, ymax / 2, ymax]) {
    doc.moveTo(cx, yy(v)).lineTo(cx + cw, yy(v)).lineWidth(0.5).strokeColor('#eef0f3').stroke();
    doc.font('regular').fontSize(6.5).fillColor(MUTED).text(String(Math.round(v)), M + 8, yy(v) - 3, { width: 18, align: 'right', lineBreak: false });
  }
  const slot = cw / Math.max(1, r.weekly.length);
  const bw = Math.min(12, slot * 0.62);
  r.weekly.forEach((w, i) => {
    const x = cx + i * slot + (slot - bw) / 2;
    if (w.correct) doc.rect(x, yy(w.correct), bw, yy(0) - yy(w.correct)).fill(RIGHT);
    if (w.incorrect) doc.rect(x, yy(w.correct + w.incorrect), bw, yy(w.correct) - yy(w.correct + w.incorrect)).fill(WRONG);
    if (i % 3 === (r.weekly.length - 1) % 3)
      doc.font('regular').fontSize(6).fillColor(MUTED).text(shortDay(w.week), x - 12, top + ch + 4, { width: bw + 24, align: 'center', lineBreak: false });
  });
  doc.rect(M + 12, y + h - 13, 7, 7).fill(RIGHT);
  doc.font('regular').fontSize(7).fillColor(SUB).text('Right', M + 22, y + h - 13, { lineBreak: false });
  doc.rect(M + 52, y + h - 13, 7, 7).fill(WRONG);
  doc.fillColor(SUB).text('Wrong', M + 62, y + h - 13, { lineBreak: false });

  // Study calendar
  const x2 = M + colW + GAP;
  box(doc, x2, y, colW, h);
  sectionTitle(doc, 'Study calendar', x2 + 12, y + 11, colW - 24, `${r.kpis.activeDays30} active days in 30`);
  const days = r.calendar;
  if (days.length) {
    const firstDow = (new Date(`${days[0].day}T00:00:00Z`).getUTCDay() + 6) % 7;
    const cells = [...Array.from({ length: firstDow }, () => null), ...days];
    const nonZero = days.map((d) => d.count).filter((c) => c > 0).sort((a, b) => a - b);
    const q = (p: number) => nonZero[Math.min(nonZero.length - 1, Math.floor(p * nonZero.length))] ?? 1;
    const lvl = (c: number) => (c === 0 ? 0 : c <= q(0.25) ? 1 : c <= q(0.5) ? 2 : c <= q(0.8) ? 3 : 4);
    const S = 11;
    const G = 2.6;
    const left = x2 + 24;
    const ctop = y + 40;
    ['M', 'W', 'F'].forEach((d, i) =>
      doc.font('regular').fontSize(6).fillColor(MUTED).text(d, x2 + 12, ctop + i * 2 * (S + G) + 2.5, { lineBreak: false })
    );
    let lastMonth = '';
    cells.forEach((c, i) => {
      if (!c) return;
      const col = Math.floor(i / 7);
      const row = i % 7;
      const x = left + col * (S + G);
      if (row === 0 || i === firstDow) {
        const m = new Date(`${c.day}T00:00:00Z`).toLocaleDateString('en-GB', { month: 'short', timeZone: 'UTC' });
        if (m !== lastMonth) {
          doc.font('regular').fontSize(6).fillColor(MUTED).text(m, x, ctop - 9, { lineBreak: false });
          lastMonth = m;
        }
      }
      doc.roundedRect(x, ctop + row * (S + G), S, S, 2).fill(HEAT[lvl(c.count)]);
    });
    doc.font('regular').fontSize(7).fillColor(SUB).text(
      `Longest streak ${r.kpis.longestStreak} day${r.kpis.longestStreak === 1 ? '' : 's'} · ${formatMinutes(r.kpis.totalMinutes)} on AshPhys in total`,
      x2 + 12,
      y + h - 14,
      { width: colW - 24, lineBreak: false, ellipsis: true }
    );
  }
  L.y = y + h + GAP;
}

function accuracyAndMistakes(L: Layout, r: StudentReport) {
  const { doc } = L;
  const colW = (CW - GAP) / 2;
  const lessons = [...r.lessons].sort((a, b) => b.attempted - a.attempted).slice(0, 7);
  const diff = r.difficulty.filter((d) => d.attempted > 0);
  const m = r.mistakes;
  const parts: [string, number, string][] = [
    ['Wrong number (method / arithmetic)', m.wrongValue, '#f97316'],
    ['Unit mistake', m.wrongUnit, '#8b5cf6'],
    ['Unreadable answer', m.unreadable, '#64748b'],
    ['Wrong choice / other', m.other, '#f43f5e'],
  ].filter(([, v]) => (v as number) > 0) as [string, number, string][];
  const leftH = 32 + Math.max(1, lessons.length) * 24;
  const rightH = 32 + Math.max(1, diff.length) * 24 + (parts.length ? 24 + parts.length * 13 : 0);
  const h = Math.max(leftH, rightH);
  L.ensure(h);
  const y = L.y;

  box(doc, M, y, colW, h);
  let yy = sectionTitle(doc, 'Accuracy by lesson', M + 12, y + 11, colW - 24, '★ = mastered');
  for (const l of lessons) yy += accuracyRow(doc, M + 12, yy, colW - 24, `${l.mastered ? '★ ' : ''}${l.name}`, l.correct, l.attempted) + 2;

  const x2 = M + colW + GAP;
  box(doc, x2, y, colW, h);
  yy = sectionTitle(doc, 'Accuracy by difficulty', x2 + 12, y + 11, colW - 24);
  for (const d of diff) yy += accuracyRow(doc, x2 + 12, yy, colW - 24, d.label, d.correct, d.attempted) + 2;
  if (parts.length) {
    yy += 4;
    yy = sectionTitle(doc, `Why answers were wrong (${m.total})`, x2 + 12, yy, colW - 24);
    let bx = x2 + 12;
    const bw = colW - 24;
    parts.forEach(([, v, color]) => {
      const w = (v / m.total) * bw;
      doc.rect(bx, yy - 3, w, 5).fill(color);
      bx += w;
    });
    yy += 6;
    for (const [label, v, color] of parts) {
      doc.rect(x2 + 12, yy + 1.5, 6, 6).fill(color);
      doc.font('regular').fontSize(7.5).fillColor(INK).text(`${label}: ${v} (${pct(v / m.total)})`, x2 + 22, yy, { width: bw - 12, lineBreak: false });
      yy += 13;
    }
  }
  L.y = y + h + GAP;
}

function revise(L: Layout, r: StudentReport) {
  const list = r.revise.slice(0, 5);
  if (!list.length) return;
  const { doc } = L;
  const tw = CW - 90;
  const heights = list.map((q) => {
    doc.font('regular').fontSize(8.5);
    return Math.min(doc.heightOfString(pdfText(q.question), { width: tw }), 24) + 16;
  });
  const h = 30 + heights.reduce((a, b) => a + b, 0);
  L.ensure(h);
  const y = L.y;
  box(doc, M, y, CW, h);
  let yy = sectionTitle(doc, 'Questions to go back to', M + 12, y + 11, CW - 24, 'most missed first');
  list.forEach((q, i) => {
    const still = q.stillWrong;
    doc.roundedRect(M + 12, yy, 58, 12, 6).fill(still ? '#ffe4e6' : '#d1fae5');
    doc.font('bold').fontSize(6.5).fillColor(still ? '#be123c' : '#047857').text(still ? 'STILL WRONG' : 'FIXED', M + 12, yy + 3, { width: 58, align: 'center', lineBreak: false });
    doc.font('regular').fontSize(8.5).fillColor(INK).text(pdfText(q.question), M + 78, yy, { width: tw, height: 24, ellipsis: true });
    doc.font('regular').fontSize(7).fillColor(MUTED).text(
      pdfText(`${q.lesson ?? ''}${q.number ? ` · Q${q.number}` : ''} · ${q.wrongTries} wrong ${q.wrongTries === 1 ? 'try' : 'tries'}`),
      M + 78,
      yy + heights[i] - 13,
      { width: tw, lineBreak: false, ellipsis: true }
    );
    yy += heights[i];
  });
  L.y = y + h + GAP;
}

function habits(L: Layout, r: StudentReport) {
  const { doc } = L;
  const hb = r.habits;
  const items: [string, string][] = [
    ['Time per answer', hb.medianTimeMs === null ? '—' : hb.medianTimeMs < 60000 ? `${Math.round(hb.medianTimeMs / 1000)} s` : `${(hb.medianTimeMs / 60000).toFixed(1)} min`],
    ['Hints used', `${hb.hintsUsed}${hb.hintRate === null ? '' : ` (${pct(hb.hintRate)})`}`],
    ['Skipped', String(hb.skipped)],
    ['Not reached yet', String(hb.notReached)],
    ['Practice sessions', String(hb.practiceSessions)],
    ['Lessons opened', String(hb.lessonsOpened)],
    ['Simulations', String(hb.simulations)],
    ['Solutions viewed', String(hb.solutions)],
  ];
  const h = 76;
  L.ensure(h);
  const y = L.y;
  box(doc, M, y, CW, h);
  sectionTitle(doc, 'Study habits', M + 12, y + 11, CW - 24);
  const cw = (CW - 24) / 4;
  items.forEach(([label, value], i) => {
    const x = M + 12 + (i % 4) * cw;
    const yy = y + 27 + Math.floor(i / 4) * 24;
    doc.font('regular').fontSize(7).fillColor(MUTED).text(label, x, yy, { width: cw - 6, lineBreak: false });
    doc.font('bold').fontSize(9.5).fillColor(INK).text(value, x, yy + 9, { width: cw - 6, lineBreak: false });
  });
  L.y = y + h + GAP;
}

function explainer(L: Layout, r: StudentReport) {
  const { doc } = L;
  const parts = r.score.parts.map((p) => `${p.label} ${Math.round(p.weight * 100)}% (${pct(p.value)})`).join(' + ');
  const text =
    `How this report is worked out. Progress score (0–100) = ${parts}. Accuracy uses the latest answer to each question; "right first time" the first. ` +
    'Levels: 85+ Excellent · 70+ On track · 50+ Developing · below 50 Needs support. Strengths and focus areas need at least 5 answers in a lesson. ' +
    'Days are in Istanbul time; time on AshPhys counts gaps of up to 15 minutes between actions.';
  doc.font('regular').fontSize(7);
  const h = doc.heightOfString(text, { width: CW });
  L.ensure(h + 4);
  doc.fillColor(MUTED).text(text, M, L.y, { width: CW });
  L.y += h + 4;
}

export async function renderReportPdf(r: StudentReport): Promise<Buffer> {
  const doc = new PDFDocument({
    size: 'A4',
    margins: { top: 0, bottom: 0, left: 0, right: 0 },
    bufferPages: true,
    font: REGULAR,
    info: { Title: `${pdfText(r.student.name)} — Progress report`, Author: 'AshPhys', Subject: 'Student progress report' },
  });
  doc.registerFont('regular', REGULAR);
  doc.registerFont('bold', BOLD);
  const chunks: Buffer[] = [];
  doc.on('data', (c: Buffer) => chunks.push(c));
  const finished = new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  const L = new Layout(doc, `${pdfText(r.student.name)} · AshPhys progress report · ${date(r.generatedAt)} · ashphys.org`);
  header(L, r);
  snapshot(L, r);
  teacherNote(L, r);
  plan(L, r);
  if (r.kpis.answered > 0) {
    strengthsFocus(L, r);
    charts(L, r);
    accuracyAndMistakes(L, r);
    revise(L, r);
    habits(L, r);
  }
  explainer(L, r);
  L.footers();
  doc.end();
  return finished;
}

export function reportFilename(r: StudentReport): string {
  const day = new Date(r.generatedAt).toISOString().slice(0, 10);
  return `AshPhys report - ${r.student.name} - ${day}.pdf`;
}
