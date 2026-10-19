import type { CheatSheet, Point } from '../types';
import { along, dir } from '../draw';

/* AS 9702 · coursebook 2.14 Understanding projectiles. One page. Numbers recomputed in the tests. g = 9.81 m s⁻². */

// Fig. 1 · launched at 20 m s⁻¹ and 50° over level ground: 6 px per m, launch point (40, 150).
const G = 9.81;
const U = 20;
const TH = 50;
const K = 6;
const O: Point = [40, 150];
const ux = U * Math.cos((TH * Math.PI) / 180);
const uy = U * Math.sin((TH * Math.PI) / 180);
const FLIGHT = (2 * uy) / G;
const at = (t: number): Point => [O[0] + K * ux * t, O[1] - K * (uy * t - 0.5 * G * t * t)];
const path: Point[] = Array.from({ length: 25 }, (_, i) => at((FLIGHT * i) / 24));
const TOP = at(FLIGHT / 2);
const LAND = at(FLIGHT);
// Velocity arrows: 4 px per m s⁻¹.
const V = 4;
const tip = along(O, dir(TH), V * U);

export const as214UnderstandingProjectiles: CheatSheet = {
  slug: 'as-2-14-understanding-projectiles',
  topicId: '71e8bd3f-97fc-4cc7-9864-8ce994d6e5b6',
  curriculumId: 'as',
  title: 'Understanding projectiles',
  lessonCode: '2.14',
  chapter: { number: 2, title: 'Accelerated motion' },
  syllabusSections: ['2.14'],
  goal: 'Solve problems for a projectile launched at an angle by resolving its initial velocity.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'Resolve the launch velocity into $u\\cos\\theta$ horizontally (constant all flight) and $u\\sin\\theta$ vertically (decelerated by $g$ on the way up). At the highest point the vertical velocity is zero, but the horizontal velocity is not.',
      'Over level ground the flight is symmetrical: time up = time down. Without air resistance the range is greatest at 45°. Air resistance lowers the height and the range and makes the descent steeper.',
    ],
    keyTerms: [{ term: 'Range', source: 'paraphrase', text: 'The horizontal distance travelled before landing.' }],
    figures: ['angled'],
  },

  derivations: [],

  equations: [
    { name: 'Components', latex: String.raw`u_x = u\cos\theta,\quad u_y = u\sin\theta` },
    { name: 'Level ground', latex: String.raw`T = \frac{2u_y}{g},\quad R = u_x T` },
    { name: 'Max height', latex: String.raw`H = \frac{u_y^{2}}{2g}` },
  ],

  symbols: [
    { symbol: 'u,\\ \\theta', meaning: 'launch speed and angle', unit: '\\mathrm{m\\,s^{-1}},\\ ^\\circ' },
    { symbol: 'T', meaning: 'time of flight', unit: '\\mathrm{s}' },
    { symbol: 'H,\\ R', meaning: 'max height, range', unit: '\\mathrm{m}' },
  ],

  samples: [
    {
      title: 'A kicked ball',
      question: 'A ball is kicked at 20 m s⁻¹ at 30° above level ground. Find its time of flight, range and maximum height.',
      steps: [
        { text: 'Components:', latex: String.raw`u_x = 20\cos 30^\circ = 17.3\ \mathrm{m\,s^{-1}}, \quad u_y = 20\sin 30^\circ = 10.0\ \mathrm{m\,s^{-1}}` },
        {
          text: 'Vertical gives the time; horizontal the range:',
          latex: String.raw`T = \frac{2 \times 10.0}{9.81} = 2.04\ \mathrm{s}, \quad R = 17.3 \times 2.04 = 35.3\ \mathrm{m}`,
        },
        { text: 'At the top $v_y = 0$:', latex: String.raw`H = \frac{10.0^{2}}{2 \times 9.81} = 5.10\ \mathrm{m}` },
      ],
      answer: '2.0 s; 35 m; 5.1 m',
      unitCheck: String.raw`\frac{(\mathrm{m\,s^{-1}})^{2}}{\mathrm{m\,s^{-2}}} = \mathrm{m}`,
    },
  ],

  practice: [
    { question: 'What is the velocity of a projectile at its highest point?', answer: '$u\\cos\\theta$, horizontal' },
    { question: 'Thrown at 25 m s⁻¹ at 60°: find the maximum height.', answer: '23.9 m (24 m)' },
    { question: 'At 15 m s⁻¹ and 40°: find the time of flight.', answer: '1.97 s (2.0 s)' },
    { question: 'Which launch angle gives the longest range?', answer: '45° (no air resistance)' },
  ],

  other: {
    mistakes: [{ wrong: 'Use $u$ in the vertical equations.', right: 'Vertical: $u\\sin\\theta$. Horizontal: $u\\cos\\theta$.' }],
    tips: ['Find $T$ from the vertical motion first; it links the two directions.'],
    syllabus: ['9702 topic 2: projectile motion without air resistance. Coursebook 2.14.'],
    links: [{ label: 'Practice questions for this lesson', href: '/practice/71e8bd3f-97fc-4cc7-9864-8ce994d6e5b6?c=as' }],
  },

  diagrams: [
    {
      id: 'angled',
      title: 'Launched at an angle',
      caption: 'At the top only $u\\cos\\theta$ is left: the vertical velocity is zero.',
      alt: 'A projectile is launched from level ground at angle theta with velocity u, resolved into dashed components u cos theta and u sin theta. Its parabolic path reaches maximum height H halfway, where the velocity is horizontal, and lands at range R.',
      width: 310,
      height: 180,
      shapes: [
        { kind: 'surface', from: [16, O[1]], to: [300, O[1]], side: 'right' },
        { kind: 'curve', points: path, role: 'muted', dashed: true },
        { kind: 'arrow', from: O, to: tip, role: 'velocity' },
        { kind: 'arrow', from: O, to: [tip[0], O[1]], role: 'velocity', dashed: true },
        { kind: 'arrow', from: [tip[0], O[1]], to: tip, role: 'velocity', dashed: true },
        { kind: 'arc', centre: O, radius: 18, from: 0, to: TH },
        { kind: 'label', at: along(O, dir(TH / 2), 26), text: 'θ', anchor: 'middle' },
        { kind: 'label', at: [tip[0] - 6, tip[1] - 2], text: 'u', anchor: 'end', role: 'velocity' },
        { kind: 'label', at: [tip[0] + 5, (O[1] + tip[1]) / 2 + 4], text: 'u |sin| θ', role: 'velocity' },
        { kind: 'label', at: [(O[0] + tip[0]) / 2, O[1] + 20], text: 'u |cos| θ', anchor: 'middle', role: 'velocity' },
        { kind: 'dot', at: TOP, radius: 3 },
        { kind: 'arrow', from: TOP, to: [TOP[0] + V * ux, TOP[1]], role: 'velocity' },
        { kind: 'label', at: [TOP[0] + V * ux + 4, TOP[1] + 4], text: 'u |cos| θ', role: 'velocity' },
        { kind: 'line', from: TOP, to: [TOP[0], O[1]], role: 'muted', dashed: true, thin: true },
        { kind: 'label', at: [TOP[0] + 5, (TOP[1] + O[1]) / 2 + 4], text: 'H' },
        { kind: 'label', at: [LAND[0], O[1] + 20], text: 'R', anchor: 'middle' },
        { kind: 'dot', at: LAND, radius: 2.5 },
      ],
    },
  ],
};
