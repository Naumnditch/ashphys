// Grade 11 Formula Sheet, in the layout of the Grade 12 Formula Sheet (BW).
// Every equation used in the Grade 11 First Quarter Examination, rearranged so that
// each variable is the subject. Math is typeset with KaTeX; diagrams are inline SVG.
const fs = require('fs');
const path = require('path');
const katex = require('katex');

const K = (tex) => katex.renderToString(tex, { throwOnError: true, output: 'html' });
const LOGO = 'data:image/png;base64,' + fs.readFileSync(path.join(__dirname, '..', 'assets', 'logo.png')).toString('base64');

// ------------------------------------------------------------------ diagrams
const S = 'KaTeX_Main, Times New Roman, serif';
const I = 'KaTeX_Math, Times New Roman, serif';
const DEFS = `<defs>
<marker id="ak" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,1 L10,5 L0,9 z" fill="#111"/></marker>
<marker id="ag" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M0,1.5 L10,5 L0,8.5 z" fill="#777"/></marker></defs>`;
const svg = (w, h, body) => `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">${DEFS}${body}</svg>`;
const L = (x1, y1, x2, y2, o = {}) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.c || '#111'}" stroke-width="${o.w || 1.6}" stroke-linecap="round"${o.d ? ` stroke-dasharray="${o.d}"` : ''}${o.a ? ` marker-end="url(#${o.a})"` : ''}${o.b ? ` marker-start="url(#${o.a})"` : ''}/>`;
const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 12}" text-anchor="${o.an || 'middle'}" fill="${o.c || '#111'}" font-family="${o.i ? I : S}"${o.i ? ' font-style="italic"' : ''}${o.b ? ' font-weight="bold"' : ''}>${s}</text>`;
const V = (x, y, s, sub, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 13}" text-anchor="${o.an || 'middle'}" fill="${o.c || '#111'}" font-family="${I}" font-style="italic">${s}<tspan font-size="${(o.s || 13) * 0.72}" dy="3" font-style="normal" font-family="${S}">${sub}</tspan></text>`;
const charge = (x, y, sign, r = 11) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" stroke="#111" stroke-width="1.6"/>` + L(x - r * 0.5, y, x + r * 0.5, y, { w: 1.6 }) + (sign === '+' ? L(x, y - r * 0.5, x, y + r * 0.5, { w: 1.6 }) : '');
const dim = (x1, x2, y, lab, o = {}) => L(x1, y - 6, x1, y + 6, { c: '#777', w: 1 }) + L(x2, y - 6, x2, y + 6, { c: '#777', w: 1 }) + L(x1 + 1, y, x2 - 1, y, { c: '#777', w: 1, a: 'ag', b: true }) + T((x1 + x2) / 2, y + (o.below ? 15 : -5), lab, { i: o.i !== false, s: 12 });
const arcp = (cx, cy, r, a1, a2) => { const p = (a) => [cx + r * Math.cos(a * Math.PI / 180), cy - r * Math.sin(a * Math.PI / 180)]; const [x1, y1] = p(a1), [x2, y2] = p(a2); return `<path d="M${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 0,${a2 > a1 ? 0 : 1} ${x2.toFixed(1)},${y2.toFixed(1)}" fill="none" stroke="#111" stroke-width="1.1"/>`; };
const ra = (x, y, s = 8, dx = 1, dy = -1) => `<path d="M${x + dx * s},${y} L${x + dx * s},${y + dy * s} L${x},${y + dy * s}" fill="none" stroke="#111" stroke-width="1"/>`;
const car = (x, y, w = 46) => { const h = w * 0.28; return `<path d="M${x},${y - 6} L${x},${y - h} L${x + w * .22},${y - h} L${x + w * .34},${y - h - w * .2} L${x + w * .7},${y - h - w * .2} L${x + w * .82},${y - h} L${x + w},${y - h + 3} L${x + w},${y - 6} z" fill="#e8e8e8" stroke="#111" stroke-width="1.3"/>` + [0.22, 0.78].map((f) => `<circle cx="${x + w * f}" cy="${y - 5}" r="${w * 0.1}" fill="#fff" stroke="#111" stroke-width="1.3"/>`).join(''); };
const legend = (x, y, items) => items.map(([kind, lab], i) => {
  const yy = y + i * 17;
  const mark = kind === 'arrow' ? L(x, yy, x + 18, yy, { w: 2.2, a: 'ak' }) : kind === 'dash' ? L(x, yy, x + 18, yy, { w: 1.6, d: '4 3', a: 'ak' }) : '';
  return mark + `<text x="${x + (mark ? 24 : 0)}" y="${yy + 4}" font-size="11" font-family="${S}">${lab}</text>`;
}).join('');
const iv = (s) => `<tspan font-family="${I}" font-style="italic">${s}</tspan>`;

const D = {
  speed: svg(230, 128, L(10, 96, 222, 96, { w: 1.4 }) + car(18, 96) + L(70, 78, 104, 78, { w: 2.2, a: 'ak' }) + T(87, 70, iv('v'), { s: 13 })
    + L(18, 104, 18, 114, { c: '#777', w: 1 }) + L(200, 104, 200, 114, { c: '#777', w: 1 }) + L(19, 109, 199, 109, { c: '#777', w: 1, a: 'ag', b: true })
    + T(109, 124, `distance ${iv('d')} in time ${iv('t')}`, { s: 11 }) + L(200, 70, 200, 96, { w: 1.2 }) + `<path d="M200,70 L214,74 L200,78 z" fill="#111"/>`
    + T(115, 30, 'speed = distance ÷ time', { s: 11, c: '#555' })),
  accel: svg(230, 128, L(10, 82, 222, 82, { w: 1.4 }) + car(16, 82) + car(160, 82) + T(40, 50, `${iv('u')} (start)`, { s: 12 }) + T(184, 50, `${iv('v')} (end)`, { s: 12 })
    + L(84, 58, 140, 58, { w: 2.2, a: 'ak' }) + T(112, 50, iv('a'), { s: 13 }) + dim(39, 183, 102, `time ${iv('t')}`, { below: true, i: false })),
  graphs: svg(240, 128, (() => {
    let s = '';
    [[12, 's', 'v', 'gradient = velocity'], [128, 'v', 'a', 'gradient = acceleration']].forEach(([ox, y, g, cap]) => {
      const x0 = ox + 14, y0 = 96;
      s += L(x0, y0, x0 + 92, y0, { w: 1.4, a: 'ak' }) + L(x0, y0, x0, 14, { w: 1.4, a: 'ak' }) + T(x0 - 8, 24, iv(y), { s: 13 }) + T(x0 + 92, y0 + 13, iv('t'), { s: 13 });
      s += L(x0, y0, x0 + 82, y0 - 66, { w: 2 }) + L(x0 + 26, y0 - 21, x0 + 66, y0 - 21, { c: '#777', w: 1, d: '3 3' }) + L(x0 + 66, y0 - 21, x0 + 66, y0 - 53, { c: '#777', w: 1, d: '3 3' });
      s += T(x0 + 46, y0 - 8, `Δ${iv('t')}`, { s: 11 }) + T(x0 + 78, y0 - 33, `Δ${iv(y)}`, { s: 11, an: 'start' }) + T(ox + 58, 122, cap, { s: 10, c: '#555' });
    });
    return s;
  })()),
  line: svg(230, 128, L(12, 98, 220, 98, { c: '#777', w: 1 }) + [0, 1, 2, 3, 4].map((i) => L(22 + i * 46, 94, 22 + i * 46, 102, { c: '#777', w: 1 })).join('')
    + `<circle cx="22" cy="34" r="4" fill="#111"/>` + T(22, 22, 'start', { s: 11, c: '#555' })
    + L(22, 34, 206, 34, { w: 2.2, a: 'ak' }) + V(114, 28, 'd', '1', { s: 13 }) + L(206, 56, 68, 56, { w: 2.2, a: 'ak' }) + V(137, 72, 'd', '2', { s: 13 })
    + L(22, 84, 68, 84, { w: 2.2, d: '5 3', a: 'ak' }) + T(45, 80, iv('s'), { s: 13 }) + T(120, 118, 'there and back along one line', { s: 10, c: '#555' })),
  rightJourney: svg(230, 128, L(30, 106, 160, 106, { w: 2.2, a: 'ak' }) + L(162, 104, 162, 22, { w: 2.2, a: 'ak' }) + L(30, 106, 160, 24, { w: 1.6, d: '5 3', a: 'ak' })
    + V(95, 122, 'x', '', { s: 13 }) + T(95, 122, '', {}) + V(174, 68, 'y', '', { s: 13 }) + V(86, 58, 's', '', { s: 13 }) + arcp(30, 106, 30, 0, 32) + T(66, 98, iv('θ'), { s: 12 })
    + ra(162, 106, 8, -1, -1) + `<circle cx="30" cy="106" r="3.5" fill="#111"/>` + T(22, 110, 'P', { s: 11, an: 'end' }) + T(170, 112, 'Q', { s: 11, an: 'start' }) + T(170, 24, 'R', { s: 11, an: 'start' })
    + L(206, 50, 206, 18, { w: 1.4, a: 'ak' }) + T(206, 62, 'N', { s: 11 })),
  components: svg(230, 128, L(40, 108, 190, 108, { c: '#777', w: 1, d: '5 4' }) + L(40, 108, 162, 24, { w: 2.4, a: 'ak' }) + T(98, 58, iv('F'), { s: 14 })
    + L(40, 112, 160, 112, { w: 1.6, d: '6 3', a: 'ak' }) + V(100, 126, 'F', 'x', { s: 13 }) + L(164, 108, 164, 28, { w: 1.6, d: '6 3', a: 'ak' }) + V(178, 72, 'F', 'y', { s: 13, an: 'start' })
    + arcp(40, 108, 28, 0, 35) + T(78, 100, iv('θ'), { s: 12 }) + `<circle cx="40" cy="108" r="3" fill="#111"/>`),
  combine: svg(230, 128, L(36, 108, 156, 108, { w: 2, a: 'ak' }) + V(96, 124, 'F', 'x', { s: 13 }) + L(158, 106, 158, 28, { w: 2, a: 'ak' }) + V(170, 70, 'F', 'y', { s: 13, an: 'start' })
    + L(36, 108, 154, 30, { w: 2.6, a: 'ak' }) + T(86, 62, iv('R'), { s: 14 }) + arcp(36, 108, 30, 0, 33) + T(74, 100, iv('θ'), { s: 12 }) + ra(158, 108, 8, -1, -1)
    + T(200, 20, 'tip to tail', { s: 10, c: '#555' })),
  range: svg(230, 128, (() => {
    let s = '';
    s += T(6, 22, 'same way', { s: 10, c: '#555', an: 'start' }) + L(60, 18, 105, 18, { w: 2.2, a: 'ak' }) + L(105, 18, 175, 18, { w: 2.2, a: 'ak' }) + V(82, 12, 'F', '1', { s: 12 }) + V(140, 12, 'F', '2', { s: 12 });
    s += L(60, 32, 175, 32, { w: 1.4, d: '5 3', a: 'ak' }) + T(180, 36, `${iv('R')}<tspan font-size="8" dy="3">max</tspan>`, { s: 12, an: 'start' });
    s += T(6, 72, 'opposite', { s: 10, c: '#555', an: 'start' }) + L(60, 68, 175, 68, { w: 2.2, a: 'ak' }) + L(175, 78, 125, 78, { w: 2.2, a: 'ak' }) + V(118, 62, 'F', '1', { s: 12 }) + V(150, 94, 'F', '2', { s: 12 });
    s += L(60, 108, 125, 108, { w: 1.4, d: '5 3', a: 'ak' }) + T(130, 112, `${iv('R')}<tspan font-size="8" dy="3">min</tspan>`, { s: 12, an: 'start' });
    return s;
  })()),
  coulomb: svg(230, 128, charge(48, 32, '+') + charge(176, 32, '+') + L(36, 32, 6, 32, { w: 2, a: 'ak' }) + L(188, 32, 218, 32, { w: 2, a: 'ak' }) + T(20, 24, iv('F'), { s: 12 }) + T(204, 24, iv('F'), { s: 12 })
    + dim(48, 176, 52, iv('r'), { below: true }) + T(112, 30, 'like charges repel', { s: 10, c: '#555' })
    + charge(48, 96, '+') + charge(176, 96, '-') + L(60, 96, 90, 96, { w: 2, a: 'ak' }) + L(164, 96, 134, 96, { w: 2, a: 'ak' }) + T(76, 88, iv('F'), { s: 12 }) + T(148, 88, iv('F'), { s: 12 })
    + T(112, 122, 'unlike charges attract', { s: 10, c: '#555' }) + V(48, 120, 'Q', '1', { s: 12 }) + V(176, 120, 'Q', '2', { s: 12 })),
  threeLine: svg(230, 128, L(10, 52, 220, 52, { c: '#999', w: 1, d: '4 4' }) + charge(26, 52, '+') + charge(92, 52, '+') + charge(204, 52, '-')
    + T(26, 30, 'A', { s: 12, b: true }) + T(92, 30, 'B', { s: 12, b: true }) + T(204, 30, 'C', { s: 12, b: true })
    + L(104, 74, 144, 74, { w: 2.2, a: 'ak' }) + V(150, 78, 'F', '1', { s: 12, an: 'start' }) + L(104, 96, 170, 96, { w: 2.2, a: 'ak' }) + V(176, 100, 'F', '2', { s: 12, an: 'start' })
    + T(115, 124, 'A repels B and C attracts B: same way', { s: 10, c: '#555' })),
  triangle: svg(230, 128, `<path d="M118,62 L118,12 L214,62 z" fill="none" stroke="#999" stroke-width="1" stroke-dasharray="4 4"/>` + charge(118, 12, '+', 9) + charge(214, 62, '+', 9) + charge(118, 62, '+', 8)
    + L(118, 72, 118, 120, { w: 2.2, a: 'ak' }) + V(126, 104, 'F', '1', { s: 12, an: 'start' }) + L(108, 62, 44, 62, { w: 2.2, a: 'ak' }) + V(70, 54, 'F', '2', { s: 12 })
    + L(112, 68, 50, 116, { w: 1.6, d: '5 3', a: 'ak' }) + T(66, 112, iv('F'), { s: 13, an: 'end' }) + ra(118, 62, 8) + arcp(118, 62, 26, 180, 218) + T(84, 78, iv('θ'), { s: 11 })
    + T(170, 100, 'right angle', { s: 10, c: '#555' }) + T(170, 112, 'at the charge', { s: 10, c: '#555' })),
  sohcahtoa: svg(170, 96, `<path d="M8,78 L134,78 L134,16 z" fill="none" stroke="#111" stroke-width="1.4"/>` + ra(134, 78, 9, -1, -1) + arcp(8, 78, 24, 0, 26) + T(38, 74, iv('θ'), { s: 12 })
    + T(72, 92, 'adj', { s: 12 }) + T(140, 52, 'opp', { s: 12, an: 'start' }) + T(62, 38, 'hyp', { s: 12 })),
};

// ------------------------------------------------------------------ content
// Each row: [name, description, equation, [rearrangements...]]
const SECTIONS = [
  { n: 1, title: 'Speed, velocity and acceleration', sub: 'speed · velocity · acceleration · equations of motion · motion graphs', groups: [
    { fig: D.speed, cap: 'Distance, displacement and time', rows: [
      ['Average speed', 'total distance ÷ total time', 'v = \\dfrac{d}{t}', ['d = vt', 't = \\dfrac{d}{v}']],
      ['Average velocity', 'displacement ÷ time', 'v = \\dfrac{s}{t}', ['s = vt', 't = \\dfrac{s}{v}']],
      ['Journey in two stages', 'add the distances, add the times', 'v_{\\text{av}} = \\dfrac{d_1 + d_2}{t_1 + t_2}', ['d_2 = v_{\\text{av}}(t_1 + t_2) - d_1', 't_2 = \\dfrac{d_1 + d_2}{v_{\\text{av}}} - t_1']],
    ] },
    { fig: D.accel, cap: 'Uniform acceleration from u to v', rows: [
      ['Acceleration', 'rate of change of velocity', 'a = \\dfrac{v - u}{t}', ['v = u + at', 'u = v - at', 't = \\dfrac{v - u}{a}']],
      ['Displacement', 'constant acceleration', 's = ut + \\tfrac{1}{2}at^2', ['u = \\dfrac{s - \\frac{1}{2}at^2}{t}', 'a = \\dfrac{2(s - ut)}{t^2}']],
      ['Starting from rest', 'u = 0', 's = \\tfrac{1}{2}at^2', ['a = \\dfrac{2s}{t^2}', 't = \\sqrt{\\dfrac{2s}{a}}']],
    ] },
    { fig: D.graphs, cap: 'Gradients of motion graphs', rows: [
      ['Gradient of s–t graph', 'gives the velocity (d–t: speed)', 'v = \\dfrac{\\Delta s}{\\Delta t}', ['\\Delta s = v\\,\\Delta t', '\\Delta t = \\dfrac{\\Delta s}{v}']],
      ['Gradient of v–t graph', 'gives the acceleration', 'a = \\dfrac{\\Delta v}{\\Delta t}', ['\\Delta v = a\\,\\Delta t', '\\Delta t = \\dfrac{\\Delta v}{a}']],
    ] },
  ],
  symbols: [['v', 'speed or velocity, m s⁻¹'], ['u', 'initial velocity, m s⁻¹'], ['a', 'acceleration, m s⁻²'], ['d', 'distance, m'], ['s', 'displacement, m'], ['t', 'time, s'], ['Δ', 'change in']],
  notes: ['Average speed is total distance ÷ total time, never the mean of the two speeds.', 'Braking: <i>a</i> is negative (a deceleration). Flat line on an <i>s–t</i> graph: at rest; on a <i>v–t</i> graph: constant velocity.'] },

  { n: 2, title: 'Distance and displacement', sub: 'scalar and vector · journeys along a line · journeys at right angles', groups: [
    { fig: D.line, cap: 'Opposite directions along one line', rows: [
      ['Total distance', 'add every stage (scalar)', 'd = d_1 + d_2', ['d_1 = d - d_2', 'd_2 = d - d_1']],
      ['Displacement', 'opposite directions subtract', 's = d_1 - d_2', ['d_1 = s + d_2', 'd_2 = d_1 - s']],
      ['Back to the start', 'one full lap or round trip', 's = 0', ['!\\text{average velocity} = \\dfrac{0}{t} = 0']],
    ] },
    { fig: D.rightJourney, cap: 'Two stages at right angles', rows: [
      ['Displacement at right angles', 'Pythagoras', 's = \\sqrt{x^2 + y^2}', ['x = \\sqrt{s^2 - y^2}', 'y = \\sqrt{s^2 - x^2}']],
      ['Direction', 'angle from the first stage', '\\tan\\theta = \\dfrac{y}{x}', ['y = x\\tan\\theta', 'x = \\dfrac{y}{\\tan\\theta}', '\\theta = \\tan^{-1}\\!\\left(\\dfrac{y}{x}\\right)']],
    ] },
  ],
  symbols: [['d', 'distance (scalar), m'], ['s', 'displacement (vector), m'], ['x', 'first stage (e.g. east), m'], ['y', 'second stage (e.g. north), m'], ['θ', 'angle of s from x']],
  notes: ['Distance ≥ displacement; they are equal only for one straight stage in one direction.', 'Always give a displacement with its direction, e.g. 1000 m at 53° north of east.'] },

  { n: 3, title: 'Vectors', sub: 'resolving into components · combining components · resultant of two forces', page: 2, groups: [
    { fig: D.components, cap: 'Resolving a vector into components', rows: [
      ['Horizontal component', 'θ from the horizontal', 'F_x = F\\cos\\theta', ['F = \\dfrac{F_x}{\\cos\\theta}', '\\theta = \\cos^{-1}\\!\\left(\\dfrac{F_x}{F}\\right)']],
      ['Vertical component', 'θ from the horizontal', 'F_y = F\\sin\\theta', ['F = \\dfrac{F_y}{\\sin\\theta}', '\\theta = \\sin^{-1}\\!\\left(\\dfrac{F_y}{F}\\right)']],
      ['θ from the vertical', 'sin and cos swap', 'F_x = F\\sin\\theta', ['F_y = F\\cos\\theta', 'F = \\dfrac{F_x}{\\sin\\theta}']],
    ] },
    { fig: D.combine, cap: 'Combining components into a resultant', rows: [
      ['Resultant', 'Pythagoras', 'R = \\sqrt{F_x^2 + F_y^2}', ['F_x = \\sqrt{R^2 - F_y^2}', 'F_y = \\sqrt{R^2 - F_x^2}']],
      ['Direction', 'angle from the horizontal', '\\tan\\theta = \\dfrac{F_y}{F_x}', ['F_y = F_x\\tan\\theta', 'F_x = \\dfrac{F_y}{\\tan\\theta}', '\\theta = \\tan^{-1}\\!\\left(\\dfrac{F_y}{F_x}\\right)']],
    ] },
    { fig: D.range, cap: 'Largest and smallest resultant', rows: [
      ['Same direction', 'largest resultant', 'R_{\\max} = F_1 + F_2', ['F_1 = R - F_2', 'F_2 = R - F_1']],
      ['Opposite directions', 'smallest resultant', 'R_{\\min} = F_1 - F_2', ['F_1 = R + F_2', 'F_2 = F_1 - R']],
      ['Any angle', 'the resultant lies between', '!F_1 - F_2 \\le R \\le F_1 + F_2', ['!\\text{e.g. } 5\\text{ N and }12\\text{ N: } 7\\text{ N} \\le R \\le 17\\text{ N}']],
    ] },
  ],
  symbols: [['F', 'a force (any vector)'], ['F_x, F_y', 'horizontal and vertical components'], ['R', 'resultant'], ['F_1, F_2', 'two forces, F₁ the larger'], ['θ', 'angle']],
  notes: ['Check where θ is measured from before choosing sin or cos.', 'The same rules work for velocity and displacement vectors.'] },

  { n: 4, title: 'Coulomb’s law', sub: 'electrostatic force · two charges · three charges on a line · right-angled triangle', page: 2, groups: [
    { fig: D.coulomb, cap: 'Force between two point charges', rows: [
      ['Coulomb’s law', 'any two point charges', 'F = \\dfrac{kQ_1Q_2}{r^2}', ['Q_1 = \\dfrac{Fr^2}{kQ_2}', 'Q_2 = \\dfrac{Fr^2}{kQ_1}', 'r = \\sqrt{\\dfrac{kQ_1Q_2}{F}}', 'k = \\dfrac{Fr^2}{Q_1Q_2}']],
      ['Coulomb constant', 'k = 1/4πε₀', 'k = \\dfrac{1}{4\\pi\\varepsilon_0}', ['\\varepsilon_0 = \\dfrac{1}{4\\pi k}']],
      ['Changing Q or r', 'inverse-square law', 'F \\propto \\dfrac{Q_1Q_2}{r^2}', ['r \\times 2 \\Rightarrow F \\div 4', 'Q_1 \\times 2 \\Rightarrow F \\times 2']],
    ] },
    { fig: D.threeLine, cap: 'Three charges on a straight line', rows: [
      ['Same line, same way', 'forces add', 'F = F_1 + F_2', ['F_1 = F - F_2', 'F_2 = F - F_1']],
      ['Same line, opposite ways', 'forces subtract', 'F = F_1 - F_2', ['F_1 = F + F_2', 'F_2 = F_1 - F']],
      ['Midpoint of equal charges', 'equal and opposite', 'F_1 = F_2 \\Rightarrow F = 0', []],
    ] },
    { fig: D.triangle, cap: 'Charge at the right angle of a triangle', rows: [
      ['At right angles', 'Pythagoras', 'F = \\sqrt{F_1^2 + F_2^2}', ['F_1 = \\sqrt{F^2 - F_2^2}', 'F_2 = \\sqrt{F^2 - F_1^2}']],
      ['Direction of the resultant', 'angle from F₂', '\\tan\\theta = \\dfrac{F_1}{F_2}', ['F_1 = F_2\\tan\\theta', 'F_2 = \\dfrac{F_1}{\\tan\\theta}', '\\theta = \\tan^{-1}\\!\\left(\\dfrac{F_1}{F_2}\\right)']],
      ['Two equal forces', 'F₁ = F₂ at 90°', 'F = \\sqrt{2}\\,F_1', ['F_1 = \\dfrac{F}{\\sqrt{2}}']],
    ] },
  ],
  symbols: [['F', 'electrostatic force, N'], ['Q', 'charge, C'], ['r', 'distance between centres, m'], ['k', 'Coulomb constant'], ['ε₀', 'permittivity of free space'], ['F_1, F_2', 'forces on one charge, N'], ['θ', 'angle']],
  notes: ['Convert μC to C (× 10⁻⁶) and cm to m before substituting.', 'Like charges repel, unlike charges attract. Add forces on one charge as vectors: along a line add or subtract; at 90° use Pythagoras.'] },
];

// ------------------------------------------------------------------ html
function pills(eq, alts) {
  const n = 1 + alts.length;
  const wide = [eq, ...alts].some((x) => x.startsWith('!'));
  const cols = n === 4 ? 4 : (wide && n === 2 ? 2 : 3);
  const long = (s) => s.startsWith('!') && cols === 3;
  eq = eq; alts = alts.map((a) => a);
  let html = `<div class="pills" style="grid-template-columns:repeat(${cols},1fr)">`;
  html += `<div class="pill eq${n === 1 ? ' wide' : ''}"${long(eq) && cols === 3 ? ' style="grid-column:span 2"' : ''}>${K(eq.replace(/^!/, ''))}</div>`;
  alts.forEach((a) => { html += `<div class="pill"${long(a) && cols === 3 ? ' style="grid-column:span 2"' : ''}>${K(a.replace(/^!/, ''))}</div>`; });
  return html + '</div>';
}

function section(s) {
  const groups = s.groups.map((g) => `<div class="grp"><div class="card${g.rows.length <= 2 ? ' sm' : ''}">${g.fig}<div class="cap">${g.cap}</div></div><div class="rows">${
    g.rows.map(([name, desc, eq, alts]) => `<div class="row"><div class="name"><b>${name}</b><span>${desc}</span></div>${pills(eq, alts)}</div>`).join('')}</div></div>`).join('');
  const sym = s.symbols.map(([a, b]) => `<span class="sy">${K(a.replace('ε₀', '\\varepsilon_0').replace('θ', '\\theta').replace('Δ', '\\Delta'))} ${b}</span>`).join('');
  return `<div class="sec"><div class="sec-h"><div class="num">${s.n}</div><h2>${s.title}</h2><div class="sub">${s.sub}</div></div>
<div class="body">${groups}</div>
<div class="symb"><div><b>Symbols</b> ${sym}</div><ul>${s.notes.map((n) => `<li>${n}</li>`).join('')}</ul></div></div>`;
}

const head = (cont) => `<div class="top"><img src="${LOGO}" class="logo"/><div class="tt"><h1>Formula Sheet${cont ? ' <span>continued</span>' : ''}</h1>${cont ? '' : '<div class="st">Grade 11 Physics · Speed, velocity and acceleration · Distance and displacement · Vectors · Coulomb’s law</div>'}</div>
${cont ? '' : `<div class="how"><b>How to read it</b><div><span class="pp k"></span>the equation</div><div><span class="pp"></span>the same equation rearranged, so every variable is the subject</div></div>`}</div><div class="rule"><span></span></div>`;

const bottom = `<div class="box"><div><h3>Constants</h3>${['k = 8.99 \\times 10^{9}\\ \\text{N m}^2\\,\\text{C}^{-2}', '\\varepsilon_0 = 8.85 \\times 10^{-12}\\ \\text{F m}^{-1}', 'e = 1.60 \\times 10^{-19}\\ \\text{C}', 'g = 9.81\\ \\text{m s}^{-2}'].map((x) => `<div>${K(x)}</div>`).join('')}</div>
<div><h3>Prefixes and units</h3><div class="g2">${['\\text{micro }(\\mu) = 10^{-6}', '\\text{milli }(\\text{m}) = 10^{-3}', '\\text{nano }(\\text{n}) = 10^{-9}', '\\text{kilo }(\\text{k}) = 10^{3}', '1\\ \\text{h} = 3600\\ \\text{s}', '1\\ \\text{km} = 1000\\ \\text{m}'].map((x) => `<div>${K(x)}</div>`).join('')}</div><div>${K('\\text{km h}^{-1} \\div 3.6 = \\text{m s}^{-1}')}</div></div>
<div><h3>Right-angled triangle</h3><div class="tri">${D.sohcahtoa}<div class="g2">${['\\sin\\theta = \\dfrac{\\text{opp}}{\\text{hyp}}', '\\cos\\theta = \\dfrac{\\text{adj}}{\\text{hyp}}', '\\tan\\theta = \\dfrac{\\text{opp}}{\\text{adj}}'].map((x) => `<div>${K(x)}</div>`).join('')}<div style="grid-column:1/-1">${K('\\text{hyp}^2 = \\text{opp}^2 + \\text{adj}^2')}</div></div></div></div></div>`;

const CSS = `
@page { size: A4; margin: 9mm 9mm 8mm; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: Carlito, Calibri, sans-serif; color: #111; margin: 0; font-size: 9pt; }
.page { break-after: page; position: relative; height: 277mm; overflow: hidden; }
.page:last-child { break-after: auto; }
.top { display: flex; align-items: center; gap: 14px; }
.logo { width: 104px; }
.tt h1 { margin: 0; font-size: 25pt; line-height: 1; }
.tt h1 span { font-size: 18pt; font-weight: normal; color: #777; }
.st { color: #555; font-size: 9.5pt; margin-top: 5px; }
.how { margin-left: auto; border: 1.2px solid #bbb; border-radius: 8px; padding: 6px 10px; width: 290px; font-size: 8.5pt; }
.how b { display: block; margin-bottom: 3px; }
.how div { display: flex; gap: 6px; align-items: center; margin-top: 2px; line-height: 1.15; }
.pp { flex: none; width: 24px; height: 11px; border-radius: 4px; border: 1.2px solid #999; background: #fff; display: inline-block; }
.pp.k { background: #000; border-color: #000; }
.rule { height: 3px; background: #000; margin: 6px 0 8px; position: relative; }
.rule span { position: absolute; left: 0; top: -3px; width: 18%; height: 3px; background: #888; }
.sec { border: 1.6px solid #000; border-radius: 10px; overflow: hidden; margin-bottom: 7px; break-inside: avoid; }
.sec-h { background: #000; color: #fff; display: flex; align-items: center; padding: 5px 12px; }
.num { width: 21px; height: 21px; border-radius: 50%; background: #fff; color: #000; font-weight: bold; display: flex; align-items: center; justify-content: center; margin-right: 10px; font-size: 10.5pt; }
.sec-h h2 { margin: 0; font-size: 14.5pt; }
.sec-h .sub { margin-left: auto; font-size: 8pt; }
.body { background: #f2f2f2; padding: 2px 10px; }
.grp { display: grid; grid-template-columns: 196px 1fr; gap: 10px; padding: 4px 0; border-bottom: 1px solid #bdbdbd; }
.grp:last-child { border-bottom: none; }
.card { background: #fff; border: 1px solid #bdbdbd; border-radius: 8px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 3px 4px; }
.card svg { width: 172px; height: auto; }
.card.sm svg { width: 146px; }
.card .cap { font-size: 7.4pt; color: #555; margin-top: 1px; text-align: center; }
.row { display: grid; grid-template-columns: 118px 1fr; gap: 6px; padding: 2px 0; border-bottom: 1px dashed #bdbdbd; align-items: center; }
.row:last-child { border-bottom: none; }
.name b { display: block; font-size: 9pt; line-height: 1.1; }
.name span { display: block; font-size: 7.2pt; color: #777; line-height: 1.15; margin-top: 1px; }
.pills { display: grid; gap: 4px; }
.pill { border: 1.2px solid #bdbdbd; border-radius: 6px; background: #fff; min-height: 25px; display: flex; align-items: center; justify-content: center; padding: 1px 5px; }
.pill.eq { background: #000; color: #fff; border-color: #000; }
.pill .katex { font-size: 10.3px; }
.symb { background: #fff; border-top: 1px solid #000; padding: 4px 12px; display: grid; grid-template-columns: 1.65fr 1fr; gap: 14px; font-size: 7.8pt; }
.symb .sy { margin-right: 8px; white-space: nowrap; display: inline-block; }
.symb .katex { font-size: 9.5px; }
.symb ul { margin: 0; padding-left: 12px; }
.symb li { margin-bottom: 2px; }
.box { border: 1.6px solid #000; border-radius: 10px; padding: 5px 12px 6px; display: grid; grid-template-columns: 1fr 1.2fr 1.45fr; gap: 14px; break-inside: avoid; }
.box h3 { margin: 0 0 3px; font-size: 10.5pt; }
.box .katex { font-size: 10px; }
.box .g2 { display: grid; grid-template-columns: 1fr 1fr; column-gap: 8px; }
.tri { display: flex; align-items: center; gap: 6px; }
.tri svg { width: 92px; height: auto; flex: none; }
.tri .g2 { row-gap: 4px; }
.tri .katex { margin-right: 6px; }
.pg { position: absolute; bottom: 0; right: 0; font-size: 8pt; color: #888; }
`;

const p1 = SECTIONS.filter((s) => !s.page).map(section).join('');
const p2 = SECTIONS.filter((s) => s.page === 2).map(section).join('');
const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Grade 11 Formula Sheet</title>
<link rel="stylesheet" href="node_modules/katex/dist/katex.min.css"><style>${CSS}</style></head><body>
<div class="page">${head(false)}${p1}${bottom}<div class="pg">Page 1 of 2</div></div>
<div class="page">${head(true)}${p2}<div class="pg">Page 2 of 2</div></div>
</body></html>`;
fs.writeFileSync(path.join(__dirname, 'sheet.html'), html);

(async () => {
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 726, height: 1000 } });
  await p.emulateMedia({ media: 'print' });
  await p.goto('file://' + path.join(__dirname, 'sheet.html'));
  await p.evaluate(() => document.fonts.ready);
  const over = await p.evaluate(() => [...document.querySelectorAll('.page')].map((pg) => {
    const last = [...pg.children].filter((c) => !c.classList.contains('pg')).pop();
    return Math.round(last.getBoundingClientRect().bottom - pg.getBoundingClientRect().top) + '/' + Math.round(pg.getBoundingClientRect().height);
  }));
  console.log('content height per page:', over.join('  '));
  await p.pdf({ path: path.join(__dirname, '..', 'Grade11_Formula_Sheet_BW.pdf'), format: 'A4', printBackground: true, preferCSSPageSize: true });
  await b.close();
})();
