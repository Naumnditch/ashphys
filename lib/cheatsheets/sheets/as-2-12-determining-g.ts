import type { CheatSheet, Point } from '../types';

/* AS 9702 · coursebook 2.12 Determining g. One page. Numbers recomputed in the tests. */

// s against t² for a falling ball: origin (50, 190); 1100 px per s², 140 px per m. Data on s = ½ g t², g = 9.81.
const X = (t2: number) => 50 + 1100 * t2;
const Y = (s: number) => 190 - 140 * s;
const HEIGHTS = [0.2, 0.4, 0.6, 0.8, 1.0];
const points: Point[] = HEIGHTS.map((s) => [X((2 * s) / 9.81), Y(s)]);

export const as212DeterminingG: CheatSheet = {
  slug: 'as-2-12-determining-g',
  topicId: 'f2b48a0f-392d-4e95-bbe4-c2ee1de168d9',
  curriculumId: 'as',
  title: 'Determining g',
  lessonCode: '2.12',
  chapter: { number: 2, title: 'Accelerated motion' },
  syllabusSections: ['2.12'],
  goal: 'Describe a free-fall experiment to find g, and get g from a graph of s against t².',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'Drop a small steel ball from rest from an electromagnet. Switching off the magnet starts a timer; the ball hitting a trapdoor stops it. Measure the height $s$ with a metre rule and repeat each height, averaging $t$.',
      'From rest, $s = \\tfrac12 g t^2$, so a graph of $s$ against $t^2$ is a straight line through the origin with gradient $g/2$. Light gates with a falling card, or video, can also be used.',
    ],
    keyTerms: [{ term: 'Free fall', source: 'paraphrase', text: 'Falling with only the weight acting: acceleration $g$, no air resistance.' }],
    figures: ['s-t2'],
  },

  derivations: [],

  equations: [
    { name: 'From rest', latex: String.raw`s = \tfrac{1}{2}gt^{2}` },
    { name: 'One drop', latex: String.raw`g = \frac{2s}{t^{2}}` },
    { name: 'From the graph', latex: String.raw`g = 2 \times \text{gradient of } s\text{–}t^{2}` },
  ],

  symbols: [
    { symbol: 's', meaning: 'height fallen', unit: '\\mathrm{m}' },
    { symbol: 't', meaning: 'time to fall', unit: '\\mathrm{s}' },
    { symbol: 'g', meaning: 'acceleration of free fall', unit: '\\mathrm{m\\,s^{-2}}' },
  ],

  samples: [
    {
      title: 'One drop',
      question: 'A ball falls 1.20 m from rest in a mean time of 0.495 s. Calculate $g$.',
      steps: [
        { text: 'Rearrange $s = \\tfrac12 gt^2$:', latex: String.raw`g = \frac{2s}{t^{2}} = \frac{2 \times 1.20}{0.495^{2}} = 9.79\ \mathrm{m\,s^{-2}}` },
      ],
      answer: String.raw`$g = 9.79\ \mathrm{m\,s^{-2}}$ (3 s.f.)`,
      unitCheck: String.raw`\frac{\mathrm{m}}{\mathrm{s^{2}}} = \mathrm{m\,s^{-2}}`,
    },
  ],

  practice: [
    { question: 'The gradient of a graph of $s$ against $t^2$ is 4.95 m s⁻². Find $g$.', answer: '9.90 m s⁻²' },
    { question: 'A ball falls 0.80 m from rest in 0.40 s. Find $g$.', answer: '10 m s⁻²' },
    { question: 'Why use a small, dense ball?', answer: 'Air resistance is negligible compared with its weight' },
    { question: 'Why repeat each height and average the times?', answer: 'To reduce the effect of random errors' },
  ],

  other: {
    mistakes: [{ wrong: 'Plot $s$ against $t$ and take the gradient as $g$.', right: 'That curves; plot $s$ against $t^2$ and double the gradient.' }],
    tips: ['Measure $s$ from the bottom of the ball to the trapdoor.'],
    syllabus: ['9702 topic 2: describe an experiment to find g using a falling object. Coursebook 2.12.'],
    links: [{ label: 'Practice questions for this lesson', href: '/practice/f2b48a0f-392d-4e95-bbe4-c2ee1de168d9?c=as' }],
  },

  diagrams: [
    {
      id: 's-t2',
      title: 's against t²',
      caption: 'A straight line through the origin: gradient $= g/2$.',
      alt: 'Graph of height fallen s in metres against time squared in seconds squared. Five data points from 0.2 m to 1.0 m lie on a straight best-fit line through the origin.',
      width: 320,
      height: 230,
      shapes: [
        { kind: 'arrow', from: [50, 190], to: [50, 22], role: 'ink' },
        { kind: 'arrow', from: [50, 190], to: [312, 190], role: 'ink' },
        { kind: 'label', at: [44, 26], text: 's / m', anchor: 'end', style: 'note' },
        { kind: 'label', at: [314, 224], text: 't² / s²', anchor: 'end', style: 'note' },
        { kind: 'line', from: [X(0), Y(0)], to: [X(0.22), Y((9.81 / 2) * 0.22)], role: 'ink' },
        ...points.map((p) => ({ kind: 'dot' as const, at: p, radius: 3 })),
        { kind: 'line', from: points[1], to: [points[4][0], points[1][1]], role: 'muted', dashed: true, thin: true },
        { kind: 'line', from: [points[4][0], points[1][1]], to: points[4], role: 'muted', dashed: true, thin: true },
        { kind: 'label', at: [(points[1][0] + points[4][0]) / 2, points[1][1] + 14], text: 'gradient = g/2', anchor: 'middle', style: 'note' },
        { kind: 'label', at: [44, Y(1) + 4], text: '1.0', anchor: 'end', style: 'note' },
        { kind: 'label', at: [44, Y(0.5) + 4], text: '0.5', anchor: 'end', style: 'note' },
        { kind: 'label', at: [X(0.1), 206], text: '0.10', anchor: 'middle', style: 'note' },
        { kind: 'label', at: [X(0.2), 206], text: '0.20', anchor: 'middle', style: 'note' },
      ],
    },
  ],
};
