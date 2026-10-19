import type { CheatSheet, Point } from '../types';

/* AS 9702 · coursebook 2.13 Motion in two dimensions: projectiles. One page. Numbers recomputed in the tests. g = 9.81 m s⁻². */

// A stone thrown horizontally at 15 m s⁻¹ from a 45 m cliff: 3.3 px per m, launch point (40, 50).
const G = 9.81;
const UX = 15;
const K = 3.3;
const at = (t: number): Point => [40 + K * UX * t, 50 + K * 0.5 * G * t * t];
const T_LAND = Math.sqrt((2 * 45) / G);
const GROUND = 50 + K * 45;
const path: Point[] = Array.from({ length: 21 }, (_, i) => at((T_LAND * i) / 20));
// Velocity arrows: 2 px per m s⁻¹.
const V = 2;
const P1 = at(1);
const P2 = at(2);

export const as213ProjectileMotion: CheatSheet = {
  slug: 'as-2-13-projectile-motion',
  topicId: '22a42568-867c-5245-91eb-c50c73e0ecb6',
  curriculumId: 'as',
  title: 'Projectile motion',
  lessonCode: '2.13',
  chapter: { number: 2, title: 'Accelerated motion' },
  syllabusSections: ['2.13'],
  goal: 'Treat horizontal and vertical motion separately for an object launched horizontally.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'With no air resistance, a projectile’s horizontal and vertical motions are independent. Horizontally there is no force, so the velocity stays constant. Vertically it accelerates at $g$ downwards, exactly like a dropped object.',
      'The time in the air is the link: find it from the vertical motion, then use it for the horizontal distance. The path is a parabola.',
    ],
    keyTerms: [{ term: 'Projectile', source: 'paraphrase', text: 'An object moving under gravity alone after it is launched.' }],
    figures: ['cliff'],
  },

  derivations: [],

  equations: [
    { name: 'Horizontal (constant)', latex: String.raw`x = u_x t` },
    { name: 'Vertical (from rest)', latex: String.raw`y = \tfrac{1}{2}gt^{2}` },
    { name: 'Vertical velocity', latex: String.raw`v_y = gt` },
  ],

  symbols: [
    { symbol: 'x,\\ y', meaning: 'horizontal, vertical distance', unit: '\\mathrm{m}' },
    { symbol: 'u_x', meaning: 'horizontal velocity', unit: '\\mathrm{m\\,s^{-1}}' },
    { symbol: 'v_y', meaning: 'vertical velocity', unit: '\\mathrm{m\\,s^{-1}}' },
  ],

  samples: [
    {
      title: 'Rolling off a table',
      question: 'A ball rolls off a table 1.8 m high at 3.0 m s⁻¹. Calculate how far from the table it lands.',
      steps: [
        { text: 'Vertical: falls 1.8 m from rest:', latex: String.raw`t = \sqrt{\frac{2y}{g}} = \sqrt{\frac{2 \times 1.8}{9.81}} = 0.606\ \mathrm{s}` },
        { text: 'Horizontal: constant 3.0 m s⁻¹:', latex: String.raw`x = u_x t = 3.0 \times 0.606 = 1.82\ \mathrm{m}` },
      ],
      answer: String.raw`$x = 1.8\ \mathrm{m}$ from the table`,
      unitCheck: String.raw`\mathrm{m\,s^{-1}} \times \mathrm{s} = \mathrm{m}`,
    },
  ],

  practice: [
    { question: 'A ball is dropped as an identical ball is thrown horizontally from the same height. Which lands first?', answer: 'They land together' },
    { question: 'A stone is thrown horizontally at 15 m s⁻¹ from a 45 m cliff (Fig. 1). How long is it in the air?', answer: '3.0 s (3.03 s)' },
    { question: 'How far from the cliff does it land?', answer: '45 m (45.4 m)' },
    { question: 'Find its vertical velocity just before it lands.', answer: '30 m s⁻¹ (29.7 m s⁻¹) downwards' },
  ],

  other: {
    mistakes: [{ wrong: 'Let the horizontal velocity change during the flight.', right: 'With no air resistance it stays $u_x$; only $v_y$ grows.' }],
    tips: ['Make two columns, horizontal and vertical; only $t$ crosses between them.'],
    syllabus: ['9702 topic 2: uniform velocity plus a perpendicular uniform acceleration. Coursebook 2.13.'],
    links: [{ label: 'Practice questions for this lesson', href: '/practice/22a42568-867c-5245-91eb-c50c73e0ecb6?c=as' }],
  },

  diagrams: [
    {
      id: 'cliff',
      title: 'Thrown horizontally from a cliff',
      caption: 'The horizontal arrows stay the same length; the vertical arrows grow by $g$ every second.',
      alt: 'A stone leaves the top of a cliff horizontally and follows a parabola to the ground. At the start, after 1 s and after 2 s, a horizontal velocity arrow of the same length is drawn; a downward vertical velocity arrow grows longer with time.',
      width: 232,
      height: 214,
      shapes: [
        { kind: 'surface', from: [8, 50], to: [40, 50], side: 'right' },
        { kind: 'surface', from: [40, 50], to: [40, GROUND], side: 'right' },
        { kind: 'surface', from: [40, GROUND], to: [226, GROUND], side: 'right' },
        { kind: 'curve', points: path, role: 'muted', dashed: true },
        { kind: 'dot', at: [40, 50], radius: 3.5 },
        { kind: 'dot', at: P1, radius: 3.5 },
        { kind: 'dot', at: P2, radius: 3.5 },
        { kind: 'arrow', from: [40, 50], to: [40 + V * UX, 50], role: 'velocity' },
        { kind: 'arrow', from: P1, to: [P1[0] + V * UX, P1[1]], role: 'velocity' },
        { kind: 'arrow', from: P1, to: [P1[0], P1[1] + V * G], role: 'velocity' },
        { kind: 'arrow', from: P2, to: [P2[0] + V * UX, P2[1]], role: 'velocity' },
        { kind: 'arrow', from: P2, to: [P2[0], P2[1] + V * 2 * G], role: 'velocity' },
        { kind: 'label', at: [40 + V * UX + 4, 46], text: 'u_x', role: 'velocity' },
        { kind: 'label', at: [P1[0] + V * UX + 4, P1[1] + 4], text: 'u_x', role: 'velocity' },
        { kind: 'label', at: [P2[0] + V * UX + 4, P2[1] + 4], text: 'u_x', role: 'velocity' },
        { kind: 'label', at: [P1[0] - 5, P1[1] + 18], text: 'v_y', anchor: 'end', role: 'velocity' },
        { kind: 'label', at: [P2[0] - 5, P2[1] + 30], text: 'v_y', anchor: 'end', role: 'velocity' },
        { kind: 'label', at: [56, 120], text: 'cliff', style: 'note', role: 'muted' },
      ],
    },
  ],
};
