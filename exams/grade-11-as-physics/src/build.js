// Builds the Grade 11 AS Physics exam and mark scheme as .docx files,
// reproducing the layout, fonts and colours of the Grade 12 First Quarter Examination.
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType,
  BorderStyle, AlignmentType, VerticalAlign, ShadingType, LineRuleType, Footer, PageNumber,
  LevelFormat,
} = require('docx');

const ROOT = path.join(__dirname, '..');
const FIG = (n) => path.join(ROOT, 'figs', n + '.png');
const INK = '111111', MAROON = '8C2332', GREY = '555555', RED = '990000';
const W = 10106; // content width (A4, 900 dxa side margins)

// ---------------------------------------------------------------- text helpers
// Markup: **bold**, *italic*, ^{sup}, _{sub}
function runs(str, base = {}) {
  const out = [];
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|\^\{[^}]*\}|_\{[^}]*\})/g;
  let last = 0, m;
  const push = (text, extra = {}) => { if (text) out.push(new TextRun({ text, color: INK, ...base, ...extra })); };
  while ((m = re.exec(str))) {
    push(str.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith('**')) push(tok.slice(2, -2), { bold: true });
    else if (tok.startsWith('*')) push(tok.slice(1, -1), { italics: true });
    else if (tok.startsWith('^')) push(tok.slice(2, -1), { superScript: true });
    else push(tok.slice(2, -1), { subScript: true });
    last = m.index + tok.length;
  }
  push(str.slice(last));
  return out;
}
const mk = (n) => new TextRun({ text: `   [${n}]`, bold: true, color: MAROON });
const P = (children, opts = {}) => new Paragraph({ children, ...opts });
const blank = (after = 120) => P([], { spacing: { after } });

function ruled(n, chain = true) {
  const b = { style: BorderStyle.SINGLE, size: 4, color: 'A0A0A0', space: 1 };
  return Array.from({ length: n }, (_, i) => new Paragraph({
    keepNext: chain || i < n - 1, border: { bottom: b, between: b },
    spacing: { line: 400, lineRule: LineRuleType.EXACT }, children: [],
  }));
}

function answerLine(label, unit, marks) {
  const ch = [...runs(label), new TextRun({ text: ' = ______________________ ', color: INK }), ...runs(unit || '')];
  if (marks !== undefined && marks !== null) ch.push(mk(marks));
  return P(ch, { alignment: AlignmentType.RIGHT, spacing: { before: 120, after: 120 }, keepNext: !!(label.startsWith('magnitude') || label.startsWith('force due to X') || label.startsWith('resultant')) });
}

const NONE = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const LINE = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
const noB = { top: NONE, bottom: NONE, left: NONE, right: NONE };
const allB = { top: LINE, bottom: LINE, left: LINE, right: LINE };
const MAR = { top: 70, bottom: 70, left: 100, right: 100 };

function cell(children, width, o = {}) {
  return new TableCell({
    children, width: { size: width, type: WidthType.DXA }, borders: o.borders || noB, margins: MAR,
    verticalAlign: o.valign || VerticalAlign.CENTER, columnSpan: o.span,
    shading: o.fill ? { type: ShadingType.CLEAR, color: 'auto', fill: o.fill } : undefined,
  });
}

function img(name, w, h) {
  return new ImageRun({ type: 'png', data: fs.readFileSync(FIG(name)), transformation: { width: w, height: h } });
}

// Text on the left, framed figure on the right — the Grade 12 question layout.
function withFigure(left, fig) {
  return new Table({
    width: { size: W, type: WidthType.DXA }, columnWidths: [6486, 3620],
    borders: { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE },
    rows: [new TableRow({ cantSplit: true, children: [
      cell(left, 6486, { valign: VerticalAlign.TOP }),
      cell([P([img(fig, 228, 171)], { alignment: AlignmentType.CENTER, keepNext: true })], 3620, { borders: allB }),
    ] })],
  });
}

// Grid table with header row shaded F2F2F2 (Constants / marks tables).
function gridTable(widths, rows, o = {}) {
  return new Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths,
    rows: rows.map((r, i) => new TableRow({ cantSplit: true, tableHeader: i === 0, children: r.map((c, j) => {
      const head = i === 0 || (o.boldLast && i === rows.length - 1);
      const center = o.center && o.center.includes(j);
      return cell([P(runs(String(c), { bold: head || undefined, size: o.size }), {
        spacing: { after: 100 }, alignment: center ? AlignmentType.CENTER : AlignmentType.LEFT })],
      widths[j], { borders: allB, fill: head ? 'F2F2F2' : undefined });
    }) })),
  });
}

// ---------------------------------------------------------------- shared header
function header(sub) {
  const row = (a, b, c, d) => new TableRow({ children: [
    cell([P(runs(a, { bold: true }), { spacing: { after: 100 } })], 1700),
    cell([P(runs(b), { spacing: { after: 100 } })], 3100),
    cell([P(runs(c, { bold: true }), { spacing: { after: 100 } })], 1500),
    cell([P(runs(d), { spacing: { after: 100 } })], 3306),
  ] });
  return [
    P([new ImageRun({ type: 'png', data: fs.readFileSync(FIG('logo')), transformation: { width: 198, height: 78 } })], { spacing: { after: 160 } }),
    P([new TextRun({ text: 'CEZERI BILIM VE TEKNOLOJI OKULLARI', bold: true, color: INK, size: 26 })], { alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
    P([new TextRun({ text: '2026 – 2027 Academic Year', color: INK })], { alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
    P([new TextRun({ text: 'First Quarter Examination', bold: true, color: MAROON, size: 26 })], { alignment: AlignmentType.CENTER, spacing: { after: 40 } }),
    P([new TextRun({ text: sub, italics: true, color: GREY, size: 20 })], { alignment: AlignmentType.CENTER, spacing: { after: 100 } }),
    new Table({
      width: { size: 9606, type: WidthType.DXA }, columnWidths: [1700, 3100, 1500, 3306],
      borders: { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE },
      rows: [
        row('Class:', '11 / ______', 'Name:', '________________________'),
        row('Course:', 'Physics — Grade 11 (AS Level)', 'Date:', '________________________'),
        row('Version:', 'A', 'Duration:', '75 minutes'),
      ],
    }),
  ];
}

const h26 = (s, before = 260) => P([new TextRun({ text: s, bold: true, color: MAROON, size: 26 })], { spacing: { before, after: 100 }, keepNext: true });
function sectionHead(title, note) {
  return [
    P([new TextRun({ text: title, bold: true, color: MAROON, size: 30 })], {
      keepNext: true, spacing: { before: 120, after: 60 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: MAROON, space: 4 } } }),
    P([new TextRun({ text: note, italics: true, color: GREY, size: 20 })], { keepNext: true, spacing: { after: 200 } }),
  ];
}
const footer = (text) => new Footer({ children: [P([
  new TextRun({ text, color: GREY, size: 16 }), new TextRun({ children: [PageNumber.CURRENT], color: GREY, size: 16 }),
], { alignment: AlignmentType.CENTER })] });

// ---------------------------------------------------------------- question builders
const qNum = (n, text) => P([new TextRun({ text: `${n}   `, bold: true, color: INK }), ...runs(text)], { keepNext: true, spacing: { after: 100 } });
const qAsk = (text, marks) => P([...runs(text), ...(marks !== undefined ? [mk(marks)] : [])], { keepNext: true, spacing: { after: 140 }, indent: { left: 360 } });

function optionLines(opts) {
  return opts.map((o, i) => P([new TextRun({ text: 'ABCD'[i] + '      ', bold: true, color: INK }), ...runs(o)],
    { keepNext: true, spacing: { after: 60 }, indent: { left: 360 } }));
}
function optionTable(head, rows, width) {
  const w0 = 600, w = Math.floor((width - w0) / head.length);
  const widths = [w0, ...head.map(() => w)];
  const r = [['', ...head], ...rows.map((x, i) => ['ABCD'[i], ...x])];
  return new Table({
    width: { size: widths.reduce((a, b) => a + b, 0), type: WidthType.DXA }, columnWidths: widths,
    borders: { top: NONE, bottom: NONE, left: NONE, right: NONE, insideHorizontal: NONE, insideVertical: NONE },
    indent: { size: 360, type: WidthType.DXA },
    rows: r.map((row, i) => new TableRow({ cantSplit: true, children: row.map((c, j) => cell([P(
      runs(c, { bold: (j === 0) || undefined, size: i === 0 ? 20 : undefined, color: i === 0 ? GREY : INK }),
      { alignment: j === 0 ? AlignmentType.LEFT : AlignmentType.CENTER, spacing: { after: 40 }, keepNext: true })],
      widths[j], { borders: i === 0 ? { ...noB, bottom: { style: BorderStyle.SINGLE, size: 4, color: '999999' } } : noB })) })),
  });
}

function mcq(n, stem, ask, opts, fig, lines = 3) {
  const body = stem ? [qNum(n, stem), qAsk(ask, 1)] : [P([new TextRun({ text: `${n}   `, bold: true, color: INK }), ...runs(ask), mk(1)], { keepNext: true, spacing: { after: 140 } })];
  if (Array.isArray(opts)) body.push(...optionLines(opts));
  else body.push(optionTable(opts.head, opts.rows, fig ? 6200 : 9000), blank(60));
  const out = fig ? [withFigure(body, fig)] : body;
  return [...out, ...ruled(lines, false), blank(200)];
}

const part = (label, text, marks, indent = 0) => P([
  new TextRun({ text: `(${label})   `, bold: true, color: INK }), ...runs(text), ...(marks !== undefined ? [mk(marks)] : []),
], { keepNext: true, spacing: { before: 120, after: 100 }, indent: { left: 360 + indent, hanging: 0 } });

// ======================================================================== EXAM
function exam() {
  const c = [];
  c.push(...header('Grade 11 Physics — AS Level'));
  c.push(blank(200));
  c.push(gridTable([5206, 2200, 2200], [
    ['PART', 'MARKS', 'GRADE'],
    ['Section A — Multiple choice (Questions 1–15)', '15', '______ / 15'],
    ['Section B — Structured questions (Questions 16–19)', '25', '______ / 25'],
    ['Section C — Practical skills (Question 20)', '10', '______ / 10'],
    ['TOTAL MARKS', '50', '______ / 50'],
  ], { center: [1, 2], boldLast: true }));
  c.push(h26('Instructions'));
  [
    'Answer all 20 questions in Sections A, B and C.',
    'Section A (Paper 1 style): for each question, circle ONE letter, A to D, and show any working in the space provided.',
    'Section B (Paper 2 style): write your answers and your full working in the spaces provided.',
    'Section C (Paper 3 style): complete the table and the graph, then answer the questions.',
    'The number of marks for each question or part is shown in brackets [ ].',
    'Calculators are allowed. Give numerical answers with units, to an appropriate number of significant figures.',
    'You are advised to spend about 20 minutes on Section A, 35 minutes on Section B and 20 minutes on Section C.',
  ].forEach((s) => c.push(P(runs(s, { size: 21 }), { numbering: { reference: 'bul', level: 0 }, spacing: { after: 80 } })));
  c.push(P([new TextRun({ text: 'Academic integrity: ', bold: true, color: RED }),
    new TextRun({ text: 'any attempt at cheating automatically cancels the exam, without prior notice.', bold: true, color: INK })], {
    alignment: AlignmentType.CENTER, spacing: { before: 280 }, indent: { left: 200, right: 200 },
    shading: { type: ShadingType.CLEAR, color: 'auto', fill: 'FBEAEA' },
    border: Object.fromEntries(['top', 'bottom', 'left', 'right'].map((k) => [k, { style: BorderStyle.SINGLE, size: 12, color: RED, space: 6 }])),
  }));
  c.push(P([], { pageBreakBefore: true, spacing: { after: 0 } }));

  // constants + formulae
  c.push(P([new TextRun({ text: 'Constants', bold: true, color: MAROON, size: 26 })], { spacing: { after: 80 } }));
  c.push(gridTable([6106, 4000], [
    ['Quantity', 'Value'],
    ['acceleration of free fall near the Earth’s surface', 'g = 9.81 m s⁻²'],
    ['permittivity of free space', 'ε₀ = 8.85 × 10⁻¹² F m⁻¹'],
    ['Coulomb constant, 1/(4πε₀)', 'k = 8.99 × 10⁹ N m² C⁻²'],
    ['elementary charge', 'e = 1.60 × 10⁻¹⁹ C'],
    ['1 μC = 1 × 10⁻⁶ C;  1 km = 1000 m;  1 h = 3600 s', ''],
  ]));
  c.push(blank(160));
  c.push(P([new TextRun({ text: 'Formulae', bold: true, color: MAROON, size: 26 })], { spacing: { after: 80 } }));
  c.push(gridTable([6106, 4000], [
    ['Quantity', 'Formula'],
    ['average speed', 'speed = distance ÷ time'],
    ['average velocity', 'velocity = displacement ÷ time'],
    ['acceleration', 'a = (v − u) ÷ t'],
    ['uniformly accelerated motion', 'v = u + at;   s = ut + ½at²'],
    ['components of a vector F at angle θ to the horizontal', 'F_{x} = F cos θ;   F_{y} = F sin θ'],
    ['resultant of two perpendicular components', 'R = √(F_{x}² + F_{y}²);   tan θ = F_{y} ÷ F_{x}'],
    ['Coulomb’s law', 'F = kQ_{1}Q_{2} ÷ r²'],
  ]));
  c.push(blank(240));

  // ---------------- Section A
  c.push(...sectionHead('Section A — Multiple choice', 'Answer all questions. Circle one letter, A, B, C or D, and show your working in the space provided.'));
  c.push(...mcq(1, null, 'Which quantity is a **vector**?', ['distance', 'speed', 'time', 'displacement'], null, 0));
  c.push(...mcq(2, 'An athlete runs exactly one lap of a 400 m track, starting and finishing at the same point, as shown. The lap takes 80 s.',
    'What are the athlete’s average speed and average velocity for the lap?',
    { head: ['average speed / m s⁻¹', 'average velocity / m s⁻¹'], rows: [['5.0', '0'], ['0', '5.0'], ['5.0', '5.0'], ['0', '0']] }, 'q02_track'));
  c.push(...mcq(3, 'A student walks 400 m due east and then 300 m due west along the same straight path, as shown.',
    'What are the total distance travelled and the final displacement from the start?',
    { head: ['distance', 'displacement'], rows: [['100 m', '700 m east'], ['700 m', '100 m east'], ['700 m', '700 m east'], ['100 m', '100 m east']] }, 'q03_walk'));
  c.push(...mcq(4, 'The displacement–time graph shows the motion of a toy car along a straight track. It has three sections, P, Q and R.',
    'What is the velocity of the car during section R?', ['−4.0 m s⁻¹', '−3.0 m s⁻¹', '0', '+4.0 m s⁻¹'], 'q04_st'));
  c.push(...mcq(5, 'A car accelerates uniformly from 5.0 m s⁻¹ to 25 m s⁻¹ in 8.0 s, as shown.',
    'What is the acceleration of the car?', ['0.40 m s⁻²', '2.5 m s⁻²', '3.1 m s⁻²', '3.8 m s⁻²'], 'q05_car'));
  c.push(...mcq(6, 'The graphs show how the displacement *s* or the velocity *v* of four objects changes with time *t*.',
    'Which graph shows an object moving with a **constant, non-zero acceleration**?', ['graph A', 'graph B', 'graph C', 'graph D'], 'q06_graphs', 0));
  c.push(...mcq(7, 'A car travels 30 km from A to B in 0.50 h and then a further 30 km from B to C in 1.0 h.',
    'What is the average speed of the car for the whole journey from A to C?', ['30 km h⁻¹', '36 km h⁻¹', '40 km h⁻¹', '45 km h⁻¹'], 'q07_journey'));
  c.push(...mcq(8, 'A force *F* acts at an angle *θ* to the **vertical**, as shown.',
    'Which row gives the horizontal and vertical components of *F*?',
    { head: ['horizontal component', 'vertical component'], rows: [['*F* sin *θ*', '*F* cos *θ*'], ['*F* cos *θ*', '*F* sin *θ*'], ['*F* tan *θ*', '*F*'], ['*F* cos *θ*', '*F* cos *θ*']] }, 'q08_force', 0));
  c.push(...mcq(9, 'Two forces of 5.0 N and 8.0 N act at right angles on a point O, as shown.',
    'What is the magnitude of the resultant force?', ['3.0 N', '6.5 N', '9.4 N', '13 N'], 'q09_perp'));
  c.push(...mcq(10, 'A ball moves with a velocity of 15 m s⁻¹. The vertical component of this velocity is 9.0 m s⁻¹, as shown.',
    'What is the horizontal component of the velocity?', ['6.0 m s⁻¹', '12 m s⁻¹', '17.5 m s⁻¹', '24 m s⁻¹'], 'q10_components'));
  c.push(...mcq(11, 'Two forces of 5.0 N and 12 N act at the same point. The angle *θ* between them can be changed.',
    'Which value **cannot** be the magnitude of their resultant?', ['7.0 N', '13 N', '17 N', '19 N'], 'q11_two_forces'));
  c.push(...mcq(12, 'Two point charges *Q*_{1} and *Q*_{2} exert a force *F* on each other when they are a distance *r* apart. *Q*_{1} is doubled and the distance is increased to 2*r*.',
    'What is the new force between the charges?', ['*F*/4', '*F*/2', '*F*', '2*F*'], 'q12_charges'));
  c.push(...mcq(13, 'Two point charges of +2.0 μC and −3.0 μC are placed 0.30 m apart in air.',
    'What are the magnitude and type of the force between them?',
    { head: ['magnitude of force', 'type of force'], rows: [['0.60 N', 'repulsive'], ['0.18 N', 'attractive'], ['0.18 N', 'repulsive'], ['0.60 N', 'attractive']] }, 'q13_two'));
  c.push(...mcq(14, 'Two equal positive charges +*Q* are fixed at X and Y. A small positive charge +*q* is placed at M, exactly halfway between them on the line XY.',
    'What is the resultant electrostatic force on +*q*?', ['zero', 'towards X', 'towards Y', 'at right angles to XY'], 'q14_midpoint', 0));
  c.push(...mcq(15, 'Three charges are placed at the corners of a right-angled triangle. Each charge +*Q* is a distance *r* from +*q*, and on its own exerts a force of magnitude *F* on +*q*.',
    'What is the magnitude of the resultant force on +*q*?', ['0', '*F*', '√2 *F*', '2*F*'], 'q15_triangle'));

  // ---------------- Section B
  c.push(P([], { pageBreakBefore: true, spacing: { after: 0 } }));
  c.push(...sectionHead('Section B — Structured questions', 'Answer all questions. Show your working in the space provided.'));
  // Q16
  c.push(withFigure([qNum(16, 'A cyclist rides from P to Q and then from Q to R along the two straight roads shown on the map. The road PQ points due east and the road QR points due north.'),
    qAsk('The distance and the time taken for each stage are shown on the map.')], 'q16_map'));
  c.push(part('a', 'State **one** difference between *distance* and *displacement*.', 1), ...ruled(2, false));
  c.push(part('b', 'Calculate the total distance travelled by the cyclist from P to R.'), ...ruled(2), answerLine('distance', 'm', 1));
  c.push(part('c', 'Calculate the magnitude and the direction of the cyclist’s displacement from P to R. Give the direction as an angle measured from due east.'),
    ...ruled(3), answerLine('magnitude', 'm'), answerLine('direction', '° north of east', 2));
  c.push(part('d', 'For the whole journey from P to R, calculate'));
  c.push(part('i', 'the average speed,', undefined, 360), ...ruled(2), answerLine('average speed', 'm s⁻¹', 1));
  c.push(part('ii', 'the magnitude of the average velocity.', undefined, 360), ...ruled(2), answerLine('average velocity', 'm s⁻¹', 1), blank(240));
  // Q17
  c.push(withFigure([qNum(17, 'A car waits at traffic lights. When the lights turn green, the car accelerates uniformly from rest at 2.5 m s⁻² for 6.0 s. It then travels at a constant velocity for 20 s. Finally it brakes and comes to rest in 5.0 s, travelling 37.5 m while braking.')], 'q17_lights'));
  c.push(part('a', 'Calculate the velocity of the car at the end of the first 6.0 s.'), ...ruled(2), answerLine('velocity', 'm s⁻¹', 1));
  c.push(part('b', 'Calculate the distance travelled by the car in the first 6.0 s.'), ...ruled(2), answerLine('distance', 'm', 1));
  c.push(part('c', 'Calculate the distance travelled by the car while it moves at constant velocity.'), ...ruled(2), answerLine('distance', 'm', 1));
  c.push(part('d', 'Calculate the acceleration of the car while it is braking.'), ...ruled(2), answerLine('acceleration', 'm s⁻²', 1));
  c.push(part('e', 'Calculate the average speed of the car for the whole journey.'), ...ruled(3), answerLine('average speed', 'm s⁻¹', 2), blank(240));
  // Q18
  c.push(qNum(18, 'Vectors can be resolved into components and components can be combined into a resultant.'));
  c.push(part('a', 'State the difference between a *scalar* quantity and a *vector* quantity.', 1), ...ruled(2, false));
  c.push(withFigure([part('b', 'A child pulls a loaded sledge across level snow using a rope. The tension in the rope is 50 N and the rope makes an angle of 35° with the horizontal, as shown.'),
    qAsk('Calculate')], 'q18_sledge'));
  c.push(part('i', 'the horizontal component of the tension,', undefined, 360), ...ruled(2), answerLine('horizontal component', 'N', 1));
  c.push(part('ii', 'the vertical component of the tension.', undefined, 360), ...ruled(2), answerLine('vertical component', 'N', 1));
  c.push(withFigure([part('c', 'A drone moves with a horizontal velocity component of 15 m s⁻¹ and a vertical (upward) velocity component of 6.0 m s⁻¹, as shown.'),
    qAsk('Combine the two components to find the resultant velocity of the drone. Give its magnitude and the angle it makes with the horizontal.')], 'q18_drone'));
  c.push(...ruled(4), answerLine('magnitude', 'm s⁻¹'), answerLine('angle to the horizontal', '°', 3), blank(240));
  // Q19
  c.push(withFigure([qNum(19, 'Three point charges A, B and C are fixed in a straight line, as shown.')], 'q19_line'));
  c.push(part('a', 'State whether the force on B due to C is attractive or repulsive. Give a reason for your answer.', 1), ...ruled(2, false));
  c.push(part('b', 'Calculate'));
  c.push(part('i', 'the magnitude of the force on B due to A,', undefined, 360), ...ruled(2), answerLine('force due to A', 'N', 1));
  c.push(part('ii', 'the magnitude of the force on B due to C.', undefined, 360), ...ruled(2), answerLine('force due to C', 'N', 1));
  c.push(part('c', 'Determine the magnitude and the direction of the resultant force on B.'), ...ruled(2), answerLine('resultant force', 'N'),
    P([new TextRun({ text: 'direction: ______________________________', color: INK }), mk(1)], { alignment: AlignmentType.RIGHT, spacing: { before: 120, after: 200 } }));
  c.push(withFigure([part('d', 'Three point charges are fixed at the corners X, O and Y of a right-angled triangle, as shown. The angle at O is 90°.')], 'q19_triangle'));
  c.push(part('i', 'Calculate the force on the charge at O due to the charge at X, and the force on the charge at O due to the charge at Y.', undefined, 360),
    ...ruled(3), answerLine('force due to X', 'N'), answerLine('force due to Y', 'N', 1));
  c.push(part('ii', 'The two forces are at right angles. Determine the magnitude of the resultant force on the charge at O and the angle it makes with the line OY.', undefined, 360),
    ...ruled(3), answerLine('resultant force', 'N'), answerLine('angle with OY', '°', 2));

  // ---------------- Section C
  c.push(P([], { pageBreakBefore: true, spacing: { after: 0 } }));
  c.push(...sectionHead('Section C — Practical skills', 'Answer all parts. Use the results in Table 20.1 and the grid provided.'));
  c.push(withFigure([qNum(20, 'A student investigates a toy car moving at a constant speed along a straight track. She uses a metre rule to mark distances *d* along the track and a stopwatch to measure the time *t* the car takes to travel each distance.'),
    qAsk('Her results are shown in Table 20.1.')], 'q20_setup'));
  const T = [['d / m', 't / s', 'speed = d ÷ t / m s⁻¹'], ['0.40', '1.0', '0.40'], ['0.80', '2.0', '0.40'], ['1.20', '3.1', '0.39'], ['1.60', '4.0', ''], ['2.00', '5.0', '']];
  c.push(blank(80));
  c.push(new Table({
    width: { size: 6600, type: WidthType.DXA }, columnWidths: [2000, 2000, 2600], alignment: AlignmentType.CENTER,
    rows: T.map((r, i) => new TableRow({ cantSplit: true, children: r.map((x, j) => cell([P(runs(i === 0 ? x.replace(/^d /, '*d* ').replace(/^t /, '*t* ').replace('d ÷ t', '*d* ÷ *t*') : x, { bold: i === 0 || undefined }),
      { alignment: AlignmentType.CENTER, spacing: { after: 60 } })], [2000, 2000, 2600][j], { borders: allB, fill: i === 0 ? 'F2F2F2' : undefined })) })),
  }));
  c.push(P(runs('Table 20.1', { italics: true, color: GREY, size: 20 }), { alignment: AlignmentType.CENTER, spacing: { before: 60, after: 120 } }));
  c.push(part('a', 'Name the measuring instrument used to measure'));
  c.push(part('i', 'the distance *d*,', 1, 360), ...ruled(1, false));
  c.push(part('ii', 'the time *t*.', 1, 360), ...ruled(1, false));
  c.push(part('b', 'Complete Table 20.1 by calculating the speed for *d* = 1.60 m and for *d* = 2.00 m.', 2), ...ruled(2, false));
  c.push(part('c', 'On the grid below, plot the points of *d* (y-axis) against *t* (x-axis). Draw a straight line of best fit through your points.', 2));
  c.push(P([img('q20_grid', 576, 432)], { alignment: AlignmentType.CENTER, spacing: { after: 120 } }));
  c.push(part('d', 'Use your graph to find the distance travelled by the car after 2.5 s.'), ...ruled(1), answerLine('distance', 'm', 1));
  c.push(part('e', 'Find the gradient of your line. The gradient is equal to the speed of the car.'), ...ruled(2), answerLine('gradient', 'm s⁻¹', 1));
  c.push(part('f', 'The line is straight and passes through the origin. What does this tell you about the speed of the car?', 1), ...ruled(1, false));
  c.push(part('g', 'Suggest **one** way to make the measurements of time more reliable.', 1), ...ruled(2, false));
  c.push(P([new TextRun({ text: 'END OF EXAMINATION', bold: true, color: MAROON })], { alignment: AlignmentType.CENTER, spacing: { before: 400, after: 100 } }));
  return c;
}

// ======================================================================== MARK SCHEME
const MCQ = [
  [1, 'D', 'Vectors', ['Displacement has both magnitude and direction; distance, speed and time are scalars']],
  [2, 'A', 'Distance and displacement', ['Average speed = 400 ÷ 80 = 5.0 m s⁻¹', 'The athlete finishes at the start, so displacement = 0 and average velocity = 0']],
  [3, 'B', 'Distance and displacement', ['Distance = 400 + 300 = 700 m', 'Displacement = 400 − 300 = 100 m east']],
  [4, 'A', 'Speed, velocity and acceleration', ['Velocity = gradient of section R = (0 − 12) ÷ (10 − 7) = −4.0 m s⁻¹']],
  [5, 'B', 'Speed, velocity and acceleration', ['a = (25 − 5.0) ÷ 8.0 = 2.5 m s⁻²']],
  [6, 'C', 'Speed, velocity and acceleration', ['Constant acceleration gives a straight, sloping velocity–time line']],
  [7, 'C', 'Speed, velocity and acceleration', ['Average speed = total distance ÷ total time = 60 ÷ 1.5 = 40 km h⁻¹ (not the mean of 60 and 30)']],
  [8, 'A', 'Vectors', ['θ is measured from the vertical, so the vertical component is F cos θ and the horizontal component is F sin θ']],
  [9, 'C', 'Vectors', ['R = √(5.0² + 8.0²) = √89 = 9.4 N']],
  [10, 'B', 'Vectors', ['horizontal component = √(15² − 9.0²) = √144 = 12 m s⁻¹']],
  [11, 'D', 'Vectors', ['The resultant lies between 12 − 5.0 = 7.0 N and 12 + 5.0 = 17 N, so 19 N is impossible']],
  [12, 'B', 'Coulomb’s law', ['F ∝ Q₁Q₂ ÷ r²: × 2 for the charge and ÷ 2² = ÷ 4 for the distance, giving F/2']],
  [13, 'D', 'Coulomb’s law', ['F = 8.99 × 10⁹ × 2.0 × 10⁻⁶ × 3.0 × 10⁻⁶ ÷ 0.30² = 0.60 N', 'Unlike charges attract']],
  [14, 'A', 'Coulomb’s law', ['The two charges are equal and the same distance d from M, so the two forces on +q are equal and opposite: resultant = 0']],
  [15, 'C', 'Coulomb’s law', ['The two forces of size F are at right angles: √(F² + F²) = √2 F']],
];

const STRUCT = [
  [16, 6, 'Distance and displacement; speed and velocity', [
    ['(a)', ['Distance is a scalar (magnitude only, total path length); displacement is a vector (has direction; straight line from start to finish)  B1'], 1],
    ['(b)', ['600 + 800 = 1400 m  A1'], 1],
    ['(c)', ['displacement = √(600² + 800²) = 1000 m  A1', 'angle = tan⁻¹(800 ÷ 600) = 53° north of east  B1'], 2],
    ['(d)(i)', ['total time = 120 + 200 = 320 s; average speed = 1400 ÷ 320 = 4.4 m s⁻¹  A1'], 1],
    ['(d)(ii)', ['average velocity = 1000 ÷ 320 = 3.1 m s⁻¹  A1 (allow ECF from (c))'], 1],
  ]],
  [17, 6, 'Speed, velocity and acceleration', [
    ['(a)', ['v = u + at = 0 + 2.5 × 6.0 = 15 m s⁻¹  A1'], 1],
    ['(b)', ['s = ½at² = ½ × 2.5 × 6.0² = 45 m  A1'], 1],
    ['(c)', ['s = 15 × 20 = 300 m  A1 (allow ECF from (a))'], 1],
    ['(d)', ['a = (0 − 15) ÷ 5.0 = −3.0 m s⁻²  A1 (allow “deceleration of 3.0 m s⁻²”)'], 1],
    ['(e)', ['total distance = 45 + 300 + 37.5 = 382.5 m and total time = 6.0 + 20 + 5.0 = 31 s  M1', 'average speed = 382.5 ÷ 31 = 12 m s⁻¹  A1 (allow 12.3)'], 2],
  ]],
  [18, 6, 'Vectors: resolving and combining', [
    ['(a)', ['A scalar has magnitude only; a vector has magnitude and direction  B1'], 1],
    ['(b)(i)', ['50 cos 35° = 41 N  A1'], 1],
    ['(b)(ii)', ['50 sin 35° = 29 N  A1'], 1],
    ['(c)', ['v = √(15² + 6.0²)  M1', 'v = 16 m s⁻¹  A1 (allow 16.2)', 'θ = tan⁻¹(6.0 ÷ 15) = 22° above the horizontal  B1'], 3],
  ]],
  [19, 7, 'Coulomb’s law: charges in a line and on a right-angled triangle', [
    ['(a)', ['Attractive, because B and C have opposite (unlike) signs  B1'], 1],
    ['(b)(i)', ['F = 8.99 × 10⁹ × 3.0 × 10⁻⁶ × 2.0 × 10⁻⁶ ÷ 0.10² = 5.4 N  A1'], 1],
    ['(b)(ii)', ['F = 8.99 × 10⁹ × 2.0 × 10⁻⁶ × 4.0 × 10⁻⁶ ÷ 0.20² = 1.8 N  A1'], 1],
    ['(c)', ['A repels B and C attracts B, so both forces act towards C: 5.4 + 1.8 = 7.2 N towards C (to the right)  B1', 'Magnitude and direction both needed; 3.6 N (subtracting) scores 0'], 1],
    ['(d)(i)', ['F(X) = 8.99 × 10⁹ × 3.0 × 10⁻⁶ × 2.0 × 10⁻⁶ ÷ 0.30² = 0.60 N and F(Y) = 8.99 × 10⁹ × 3.0 × 10⁻⁶ × 2.0 × 10⁻⁶ ÷ 0.40² = 0.34 N  B1 (both values needed)'], 1],
    ['(d)(ii)', ['resultant = √(0.60² + 0.34²) = 0.69 N  A1', 'angle = tan⁻¹(0.60 ÷ 0.34) = 61° (below OY)  A1 (allow 60°–61°; ECF from (i))'], 2],
  ]],
  [20, 10, 'Practical skills: speed of a toy car', [
    ['(a)(i)', ['metre rule (or tape measure / ruler)  B1'], 1],
    ['(a)(ii)', ['stopwatch (or stop clock / timer)  B1'], 1],
    ['(b)', ['d = 1.60 m: 1.60 ÷ 4.0 = 0.40 m s⁻¹  B1', 'd = 2.00 m: 2.00 ÷ 5.0 = 0.40 m s⁻¹  B1'], 2],
    ['(c)', ['all five points plotted correctly (within half a small square)  B1', 'one straight, thin line of best fit through (or very close to) the origin  B1'], 2],
    ['(d)', ['1.0 m (accept 0.95 – 1.05 m, read from the student’s own line)  A1'], 1],
    ['(e)', ['gradient = 2.00 ÷ 5.0 = 0.40 m s⁻¹ (accept 0.38 – 0.42)  A1'], 1],
    ['(f)', ['The speed of the car is constant (it does not change)  B1'], 1],
    ['(g)', ['Any one: repeat each time measurement and take the mean; use light gates / a data logger; film the car and use the video timer  B1', '“Be more careful” scores 0'], 1],
  ]],
];

function msBlock(n, marks, topic, rows) {
  const head = P([new TextRun({ text: `Question ${n}`, bold: true, color: MAROON, size: 24 }),
    new TextRun({ text: `   [${marks} mark${marks > 1 ? 's' : ''}]  —  ${topic}`, italics: true, color: GREY, size: 18 })],
  { keepNext: true, spacing: { before: 200, after: 80 } });
  const widths = [900, 8006, 1200];
  const hdr = new TableRow({ tableHeader: true, children: ['Part', 'Answer / marking points', 'Marks'].map((x, j) =>
    cell([P([new TextRun({ text: x, bold: true, color: INK, size: 22 })], { spacing: { after: 100 }, alignment: j === 2 ? AlignmentType.CENTER : AlignmentType.LEFT })],
      widths[j], { borders: allB, fill: 'F2F2F2' })) });
  const body = rows.map(([label, pts, m]) => new TableRow({ cantSplit: true, children: [
    cell([P([new TextRun({ text: label, bold: true, color: MAROON, size: 22 })], { spacing: { after: 100 } })], 900, { borders: allB, valign: VerticalAlign.TOP }),
    cell(pts.map((p) => P(runs(p, { size: 20 }), { spacing: { after: 50 } })), 8006, { borders: allB, valign: VerticalAlign.TOP }),
    cell([P([new TextRun({ text: String(m), color: INK, size: 22 })], { alignment: AlignmentType.CENTER, spacing: { after: 100 } })], 1200, { borders: allB, valign: VerticalAlign.TOP }),
  ] }));
  return [head, new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: widths, rows: [hdr, ...body] })];
}

function markScheme() {
  const c = [...header('Mark scheme — FOR TEACHER USE ONLY'), blank(200)];
  c.push(P(runs('Marking codes: M = method mark, A = accuracy mark (depends on the M mark), B = independent mark, C = compensatory (award if the final answer is correct). Allow error carried forward (ECF) from an earlier part. Accept answers within ±1 in the last significant figure, and work done with k = 9.0 × 10⁹ N m² C⁻².',
    { italics: true, color: GREY, size: 20 }), { spacing: { after: 160 } }));
  c.push(P([new TextRun({ text: 'Structure', bold: true, color: MAROON, size: 24 })], { spacing: { after: 80 } }));
  c.push(gridTable([3306, 3400, 1700, 1700], [
    ['Section', 'Style', 'Questions', 'Marks'],
    ['A — Multiple choice', 'Paper 1 style', '1–15', '15 (30%)'],
    ['B — Structured questions', 'Paper 2 style', '16–19', '25 (50%)'],
    ['C — Practical skills', 'Paper 3 style', '20', '10 (20%)'],
  ], { size: 22 }));
  c.push(blank(160));
  c.push(P([new TextRun({ text: 'Weighting', bold: true, color: MAROON, size: 24 })], { spacing: { after: 80 } }));
  c.push(gridTable([3906, 3400, 1300, 1500], [
    ['Lesson', 'Questions', 'Count', 'Marks'],
    ['Speed, velocity and acceleration', '4, 5, 6, 7, 17, 20', '6', '20'],
    ['Distance and displacement', '2, 3, 16', '3', '8'],
    ['Vectors: resolving and combining', '1, 8, 9, 10, 11, 18', '6', '11'],
    ['Coulomb’s law (2 and 3 charges; line and right-angled triangle)', '12, 13, 14, 15, 19', '5', '11'],
  ], { size: 22 }));
  c.push(blank(160));
  c.push(P([new TextRun({ text: 'Section A answer key', bold: true, color: MAROON, size: 24 })], { spacing: { after: 80 } }));
  c.push(gridTable([1300, ...Array(15).fill(587)].map((x, i) => (i === 15 ? 10106 - 1300 - 587 * 14 : x)), [
    ['Question', ...MCQ.map((q) => String(q[0]))],
    ['Answer', ...MCQ.map((q) => q[1])],
  ], { center: Array.from({ length: 15 }, (_, i) => i + 1) }));
  c.push(P([], { pageBreakBefore: true, spacing: { after: 0 } }));
  for (const [n, a, topic, pts] of MCQ) {
    c.push(...msBlock(n, 1, topic, [[`Answer ${a}`, [...pts, `Correct option: ${a}  B1`], 1]]));
  }
  for (const [n, m, topic, rows] of STRUCT) {
    c.push(...msBlock(n, m, topic, rows));
  }
  c.push(P(runs('Model answer for Question 20(c) and (d)', { bold: true, color: MAROON, size: 22 }), { spacing: { before: 240, after: 80 }, keepNext: true }));
  c.push(P([img('ms_q20_graph', 480, 360)], { alignment: AlignmentType.CENTER }));
  return c;
}

// ======================================================================== write
function doc(children, footText) {
  return new Document({
    creator: 'Cezeri Bilim ve Teknoloji Okullari',
    styles: { default: { document: { run: { font: 'Calibri', size: 22, color: INK } } } },
    numbering: { config: [{ reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
      style: { paragraph: { indent: { left: 360, hanging: 260 } }, run: { bold: true, color: INK } } }] }] },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 720, right: 900, bottom: 720, left: 900, header: 708, footer: 708 } } },
      footers: { default: footer(footText) },
      children,
    }],
  });
}

(async () => {
  const out = ROOT;
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'Grade11_First_Quarter_Exam.docx'), await Packer.toBuffer(doc(exam(), 'Grade 11 Physics — First Quarter Examination — page ')));
  fs.writeFileSync(path.join(out, 'Grade11_First_Quarter_Exam_MarkScheme.docx'), await Packer.toBuffer(doc(markScheme(), 'First Quarter Examination mark scheme — teacher use only — page ')));
  console.log('written');
})();
