import type { CheatSheet, Point } from '../types';

/* AS 9702 · coursebook 1.7 Subtracting vectors. One page. */

// 4 px per m s⁻¹: v₁ = 20 m s⁻¹ north, v₂ = 20 m s⁻¹ east.
const A1: Point = [40, 170];
const A2: Point = [40, 90];
const B1: Point = [80, 190];
const B2: Point = [160, 190];
// Triangle: v₂ + (−v₁) = Δv.
const Q: Point = [190, 70];
const Q1: Point = [270, 70];
const Q2: Point = [270, 150];

export const as17SubtractingVectors: CheatSheet = {
  slug: 'as-1-7-subtracting-vectors',
  topicId: '19109221-dd23-4986-8f92-84b0ea2c6033',
  curriculumId: 'as',
  title: 'Subtracting vectors',
  lessonCode: '1.7',
  chapter: { number: 1, title: 'Kinematics' },
  syllabusSections: ['1.7'],
  goal: 'Find a change in velocity, Δv = v₂ − v₁, by adding the reverse of the first vector.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'To subtract a vector, add its reverse: $\\vec{a} - \\vec{b} = \\vec{a} + (-\\vec{b})$, where $-\\vec{b}$ has the same size as $\\vec{b}$ but points the opposite way.',
      'The most common use is a change in velocity: $\\Delta\\vec{v} = \\vec{v}_2 - \\vec{v}_1$ (final minus initial). Even at constant speed, a change of direction gives a non-zero $\\Delta v$.',
    ],
    keyTerms: [
      {
        term: 'Change in velocity',
        source: 'paraphrase',
        text: 'Final velocity minus initial velocity, found as a vector.',
      },
    ],
    figures: ['subtract'],
  },

  derivations: [],

  equations: [
    {
      name: 'Subtracting a vector',
      latex: String.raw`\vec{a} - \vec{b} = \vec{a} + (-\vec{b})`,
    },
    {
      name: 'Change in velocity',
      latex: String.raw`\Delta\vec{v} = \vec{v}_{2} - \vec{v}_{1}`,
    },
  ],

  symbols: [
    {
      symbol: '\\vec{v}_{1},\\ \\vec{v}_{2}',
      meaning: 'initial and final velocity',
      unit: '\\mathrm{m\\,s^{-1}}',
    },
    {
      symbol: '\\Delta\\vec{v}',
      meaning: 'change in velocity',
      unit: '\\mathrm{m\\,s^{-1}}',
    },
  ],

  samples: [
    {
      title: 'A car turning a corner',
      question: 'A car travelling north at 20 m s⁻¹ turns and travels east at 20 m s⁻¹. Find its change in velocity.',
      steps: [
        {
          text: 'Add the reverse of $v_1$ (20 m s⁻¹ south) to $v_2$ (20 m s⁻¹ east): the two are perpendicular.',
          latex: String.raw`|\Delta v| = \sqrt{20^{2} + 20^{2}} = 28.3\ \mathrm{m\,s^{-1}}`,
        },
        { text: 'Direction: equal east and south parts, so 45° between them.' },
      ],
      answer: '28 m s⁻¹ towards the south-east (45° south of east)',
    },
  ],

  practice: [
    {
      question: 'A ball moving right at 6.0 m s⁻¹ rebounds moving left at 4.0 m s⁻¹. Find the change in velocity.',
      answer: '10 m s⁻¹ to the left',
    },
    {
      question: 'A velocity changes from 3.0 m s⁻¹ east to 4.0 m s⁻¹ north. Find Δv.',
      answer: '5.0 m s⁻¹ at 53° north of west',
    },
    {
      question: 'Find A − B for A = 7.0 N east and B = 2.0 N east.',
      answer: '5.0 N east',
    },
    {
      question: 'A velocity changes from 10 m s⁻¹ north to 10 m s⁻¹ south. Find Δv.',
      answer: '20 m s⁻¹ south',
    },
  ],

  other: {
    mistakes: [
      {
        wrong: 'Subtract the speeds: 20 − 20 = 0, so no change.',
        right: 'The direction changed, so Δv is not zero.',
      },
      { wrong: 'Work out v₁ − v₂.', right: 'Δv = final − initial: v₂ − v₁.' },
    ],
    tips: ['In one dimension, give each velocity a sign (+ one way, − the other) and subtract the numbers.'],
    syllabus: ['9702 topic 1: add and subtract coplanar vectors. Coursebook 1.7.'],
    links: [
      {
        label: 'Practice questions for this lesson',
        href: '/practice/19109221-dd23-4986-8f92-84b0ea2c6033?c=as',
      },
    ],
  },

  diagrams: [
    {
      id: 'subtract',
      title: 'Δv = v₂ − v₁ = v₂ + (−v₁)',
      caption: 'Draw v₂, then add the reverse of v₁ at its tip. Δv runs from the start of v₂ to the end of −v₁.',
      alt: 'Left: the initial velocity v1 pointing north and the final velocity v2 pointing east, equal in length. Right: v2 drawn east, then minus v1 drawn south from its tip, and delta v from the start of v2 to the end of minus v1, pointing south-east.',
      width: 300,
      height: 220,
      shapes: [
        { kind: 'arrow', from: A1, to: A2, role: 'velocity' },
        {
          kind: 'label',
          at: [32, 132],
          text: 'v_1',
          anchor: 'end',
          role: 'velocity',
        },
        { kind: 'arrow', from: B1, to: B2, role: 'velocity' },
        {
          kind: 'label',
          at: [120, 212],
          text: 'v_2',
          anchor: 'middle',
          role: 'velocity',
        },
        { kind: 'arrow', from: Q, to: Q1, role: 'velocity' },
        {
          kind: 'label',
          at: [230, 60],
          text: 'v_2',
          anchor: 'middle',
          role: 'velocity',
        },
        { kind: 'arrow', from: Q1, to: Q2, role: 'velocity', dashed: true },
        { kind: 'label', at: [278, 114], text: '−v_1', role: 'velocity' },
        { kind: 'arrow', from: Q, to: Q2, role: 'acceleration' },
        {
          kind: 'label',
          at: [216, 124],
          text: 'Δv',
          anchor: 'end',
          role: 'acceleration',
        },
      ],
    },
  ],
};
