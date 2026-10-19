import type { CheatSheet, Point } from '../types';

/* AS 9702 · coursebook 2.9 Deriving the equations of motion. One page. Numbers recomputed in the tests. */

// A v–t line from u to v over time t: origin (50, 190).
const O: Point = [50, 190];
const U: Point = [50, 140];
const V: Point = [250, 50];
const T: Point = [250, 190];
const K: Point = [250, 140];

export const as29DerivingEquationsOfMotion: CheatSheet = {
  slug: 'as-2-9-deriving-the-equations-of-motion',
  topicId: '69bb568e-7993-444e-9ce8-19ebbd98c526',
  curriculumId: 'as',
  title: 'Deriving the equations of motion',
  lessonCode: '2.9',
  chapter: { number: 2, title: 'Accelerated motion' },
  syllabusSections: ['2.9'],
  goal: 'Derive the four suvat equations from a velocity–time graph.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'For uniform acceleration the v–t graph is a straight line from $u$ to $v$: its gradient is $a$ and the area under it is $s$.',
      'Those give the first two equations; algebra gives the other two.',
    ],
    keyTerms: [{ term: 'Uniformly accelerated motion', source: 'paraphrase', text: 'Constant acceleration in a straight line.' }],
  },

  derivations: [
    {
      id: 'suvat',
      title: 'From the v–t graph',
      setup: 'Velocity rises uniformly from $u$ to $v$ in time $t$.',
      figure: 'trapezium',
      steps: [
        { text: 'Gradient = acceleration:', latex: String.raw`a = \frac{v - u}{t} \;\Rightarrow\; v = u + at` },
        { text: 'Area = rectangle + triangle:', latex: String.raw`s = ut + \tfrac{1}{2}(v - u)t = \tfrac{1}{2}(u + v)\,t` },
        { text: 'Put $v - u = at$ into the area:', latex: String.raw`s = ut + \tfrac{1}{2}at^{2}` },
        { text: 'Put $t = (v - u)/a$ into the area:', latex: String.raw`s = \frac{(v + u)(v - u)}{2a} \;\Rightarrow\; v^{2} = u^{2} + 2as` },
      ],
      result: String.raw`\begin{aligned} v &= u + at, & s &= \tfrac{1}{2}(u + v)\,t, \\ s &= ut + \tfrac{1}{2}at^{2}, & v^{2} &= u^{2} + 2as \end{aligned}`,
    },
  ],

  equations: [],

  // The derivation's boxed result is the key-equations box here, so there is no separate section.
  symbols: [],

  samples: [
    {
      title: 'Area check',
      question: 'An object accelerates uniformly from 4.0 m s⁻¹ to 10 m s⁻¹ in 3.0 s. Find $s$ from the area, then check it with $s = ut + \\tfrac{1}{2}at^2$.',
      steps: [
        { text: 'Area (trapezium):', latex: String.raw`s = \tfrac{1}{2}(4.0 + 10)(3.0) = 21\ \mathrm{m}` },
        {
          text: 'Check: $a = (10 - 4.0)/3.0 = 2.0$ m s⁻², so',
          latex: String.raw`s = 4.0(3.0) + \tfrac{1}{2}(2.0)(3.0)^{2} = 12 + 9.0 = 21\ \mathrm{m}\ \checkmark`,
        },
      ],
      answer: String.raw`$s = 21\ \mathrm{m}$ both ways`,
    },
  ],

  practice: [
    { question: 'Which feature of a v–t graph gives $v = u + at$?', answer: 'The gradient' },
    { question: 'Which suvat equation has no $t$, and how is it derived?', answer: '$v^2 = u^2 + 2as$ (eliminate $t$)' },
    { question: 'In $s = ut + \\tfrac12 at^2$, which part of the graph area is $ut$?', answer: 'The rectangle under $u$' },
    { question: 'Find $s$ from the area: $u = 0$, $v = 12$ m s⁻¹, $t = 5.0$ s.', answer: '30 m' },
  ],

  other: {
    mistakes: [{ wrong: 'Use suvat for any motion.', right: 'Only for constant acceleration.' }],
    tips: ['Forgot an equation? Sketch the v–t trapezium.'],
    syllabus: ['9702 topic 2: derive the suvat equations. Coursebook 2.9.'],
    links: [{ label: 'Practice questions for this lesson', href: '/practice/69bb568e-7993-444e-9ce8-19ebbd98c526?c=as' }],
  },

  diagrams: [
    {
      id: 'trapezium',
      title: 'The area under a uniform v–t line',
      caption: 'Rectangle $ut$ plus triangle $\\tfrac12(v - u)t$; the gradient is $a$.',
      alt: 'Velocity against time. A straight line rises from u at time 0 to v at time t. The area under it is split by a dashed line at height u into a rectangle of area ut and a triangle of height v minus u.',
      width: 300,
      height: 220,
      shapes: [
        { kind: 'polygon', points: [O, U, K, T], role: 'muted', fill: 'soft' },
        { kind: 'polygon', points: [U, V, K], role: 'velocity', fill: 'soft' },
        { kind: 'arrow', from: O, to: [50, 22], role: 'ink' },
        { kind: 'arrow', from: O, to: [290, 190], role: 'ink' },
        { kind: 'line', from: U, to: V, role: 'ink' },
        { kind: 'line', from: T, to: V, role: 'muted', dashed: true, thin: true },
        { kind: 'line', from: U, to: K, role: 'muted', dashed: true, thin: true },
        { kind: 'label', at: [44, 26], text: 'v', anchor: 'end' },
        { kind: 'label', at: [292, 210], text: 't', anchor: 'end' },
        { kind: 'label', at: [44, 145], text: 'u', anchor: 'end' },
        { kind: 'label', at: [262, 55], text: 'v' },
        { kind: 'label', at: [250, 208], text: 't', anchor: 'middle' },
        { kind: 'label', at: [150, 172], text: 'ut', anchor: 'middle' },
        { kind: 'label', at: [196, 126], text: '½(v − u)t', anchor: 'middle' },
        { kind: 'label', at: [262, 100], text: 'v − u' },
      ],
    },
  ],
};
