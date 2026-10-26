import type { CheatSheet, Point } from '../types';
import { along, dir } from '../draw';

/* AS 9702 · coursebook 6.5 Collisions in two dimensions. One page. Numbers recomputed in the tests. */

// Fig. 1 · equal 2.0 kg pucks; 20 px per m s⁻¹. A: 5.0 in; after A 3.0 at 53.1° up, B 4.0 at 36.9° down (a 3-4-5 triangle).
const K = 20;
const C: Point = [140, 100];
const A_ANGLE = (Math.atan2(4, 3) * 180) / Math.PI;
const B_ANGLE = (Math.atan2(3, 4) * 180) / Math.PI;
const aEnd = along(C, dir(A_ANGLE), K * 3);
const bEnd = along(C, dir(-B_ANGLE), K * 4);

export const as65CollisionsTwoDimensions: CheatSheet = {
  slug: 'as-6-5-collisions-in-two-dimensions',
  topicId: '696eca14-6b2c-4bf0-afe9-dc8335657d4c',
  curriculumId: 'as',
  title: 'Collisions in two dimensions',
  lessonCode: '6.5',
  chapter: { number: 6, title: 'Momentum' },
  syllabusSections: ['6.5'],
  goal: 'Solve a glancing collision by conserving momentum in two perpendicular directions.',
  reviewed: '2026-10-26',

  explanation: {
    paragraphs: [
      'Momentum is a vector, so in a glancing collision it is conserved in every direction at once. Choose two perpendicular directions ($x$ along the original motion, $y$ across it) and conserve momentum in each separately.',
      'Resolve each momentum into components with $\\cos$ and $\\sin$. If nothing was moving in the $y$ direction before, the $y$-components after must cancel.',
    ],
    keyTerms: [{ term: 'Glancing collision', source: 'paraphrase', text: 'A collision that is not head-on: the objects move off at angles.' }],
    figures: ['glancing'],
  },

  derivations: [],

  equations: [
    { name: 'Along x', latex: String.raw`\textstyle\sum p_x \text{ before} = \sum p_x \text{ after}` },
    { name: 'Along y', latex: String.raw`\textstyle\sum p_y \text{ before} = \sum p_y \text{ after}` },
    { name: 'Components', latex: String.raw`p_x = p\cos\theta,\quad p_y = p\sin\theta` },
  ],

  symbols: [
    { symbol: 'p_x', meaning: 'momentum along x', unit: '\\mathrm{kg\\,m\\,s^{-1}}' },
    { symbol: '\\theta', meaning: 'angle to the x direction', unit: '^\\circ' },
  ],

  samples: [
    {
      title: 'A glancing collision',
      question:
        'A 2.0 kg puck A at 5.0 m s⁻¹ hits an identical puck B at rest. A leaves at 3.0 m s⁻¹ at 53° to its first direction (Fig. 1). Find B’s velocity.',
      steps: [
        { text: 'Along $x$ (masses equal, so they cancel):', latex: String.raw`5.0 = 3.0\cos 53^\circ + v_x \;\Rightarrow\; v_x = 3.2\ \mathrm{m\,s^{-1}}` },
        { text: 'Along $y$ (zero before):', latex: String.raw`0 = 3.0\sin 53^\circ + v_y \;\Rightarrow\; v_y = -2.4\ \mathrm{m\,s^{-1}}` },
        { text: 'Combine:', latex: String.raw`v = \sqrt{3.2^{2} + 2.4^{2}} = 4.0\ \mathrm{m\,s^{-1}}, \quad \theta = \tan^{-1}\frac{2.4}{3.2} = 37^\circ` },
      ],
      answer: '4.0 m s⁻¹ at 37° on the other side of the original direction',
    },
  ],

  practice: [
    { question: 'In a two-dimensional collision, what is conserved separately?', answer: 'Momentum in each of two perpendicular directions' },
    {
      question: 'A 1.0 kg ball moving east at 4.0 m s⁻¹ sticks to a 1.0 kg ball moving north at 4.0 m s⁻¹. Find their velocity.',
      answer: '2.8 m s⁻¹ north-east (45°)',
    },
    {
      question: 'A 3.0 kg object at rest splits into three 1.0 kg pieces; two go east and north at 6.0 m s⁻¹. Find the third.',
      answer: '8.5 m s⁻¹ south-west',
    },
    { question: 'Is the collision in the sample elastic?', answer: 'Yes: 25 J of kinetic energy before and after' },
  ],

  other: {
    mistakes: [{ wrong: 'Add the speeds after: 3.0 + 4.0 = 5.0?', right: 'Add momentum components, never speeds.' }],
    tips: ['Draw the before and after momenta tip to tail: they close a triangle.'],
    syllabus: ['9702 topic 3: conservation of momentum in one and two dimensions. Coursebook 6.5.'],
    links: [{ label: 'Practice questions for this lesson', href: '/practice/696eca14-6b2c-4bf0-afe9-dc8335657d4c?c=as' }],
  },

  diagrams: [
    {
      id: 'glancing',
      title: 'A glancing collision',
      caption: 'A and B move off at angles; their $y$-momenta cancel and their $x$-momenta add up to A’s momentum before.',
      alt: 'Puck A moves right at 5.0 m/s to hit puck B at rest. After the collision A moves at 3.0 m/s at 53 degrees above the original direction and B moves at 4.0 m/s at 37 degrees below it.',
      width: 260,
      height: 172,
      shapes: [
        { kind: 'line', from: C, to: [250, 100], role: 'muted', dashed: true, thin: true },
        { kind: 'arrow', from: [24, 100], to: [24 + K * 5, 100], role: 'velocity' },
        { kind: 'label', at: [60, 90], text: 'u_A = 5.0', anchor: 'middle', role: 'velocity' },
        { kind: 'circle', centre: C, radius: 10, fill: 'soft' },
        { kind: 'circle', centre: C, radius: 10 },
        { kind: 'label', at: [C[0] - 2, C[1] + 26], text: 'B', anchor: 'middle' },
        { kind: 'arrow', from: C, to: aEnd, role: 'velocity' },
        { kind: 'arrow', from: C, to: bEnd, role: 'velocity' },
        { kind: 'label', at: [aEnd[0] + 6, aEnd[1] + 4], text: 'v_A = 3.0', role: 'velocity' },
        { kind: 'label', at: [bEnd[0] - 4, bEnd[1] + 16], text: 'v_B = 4.0', anchor: 'middle', role: 'velocity' },
        { kind: 'arc', centre: C, radius: 26, from: 0, to: A_ANGLE },
        { kind: 'arc', centre: C, radius: 34, from: -B_ANGLE, to: 0 },
        { kind: 'label', at: along(C, dir(A_ANGLE / 2), 38), text: '53°', style: 'note' },
        { kind: 'label', at: along(C, dir(-B_ANGLE / 2), 46), text: '37°', style: 'note' },
      ],
    },
  ],
};
