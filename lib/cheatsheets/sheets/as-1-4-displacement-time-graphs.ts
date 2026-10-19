import type { CheatSheet, Point } from '../types';

/* AS 9702 · coursebook 1.4 Displacement–time graphs (the shared IGCSE 2.2 lesson). One page. */

// Axes: origin (50, 190); 15 px per second, 4.5 px per metre.
const X = (t: number) => 50 + 15 * t;
const Y = (s: number) => 190 - 4.5 * s;
const A: Point = [X(0), Y(0)];
const B: Point = [X(6), Y(30)];
const C: Point = [X(10), Y(30)];
const D: Point = [X(16), Y(0)];

export const as14DisplacementTimeGraphs: CheatSheet = {
  slug: 'as-1-4-displacement-time-graphs',
  topicId: 'b2e3d430-7699-4dac-9f55-e84c5cd5ce9b',
  curriculumId: 'as',
  title: 'Displacement–time graphs',
  lessonCode: '1.4',
  chapter: { number: 1, title: 'Kinematics' },
  syllabusSections: ['1.4'],
  goal: 'Read velocity from the gradient of a displacement–time graph, including from a tangent to a curve.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'The gradient of a displacement–time graph is the velocity. A straight line means constant velocity; a horizontal line means the object is at rest; a negative gradient means it is moving back towards the start.',
      'A curved line means the velocity is changing. The instantaneous velocity is the gradient of the tangent drawn at that time.',
    ],
    keyTerms: [
      {
        term: 'Gradient',
        source: 'paraphrase',
        text: 'Change in displacement ÷ change in time, read from a large triangle on the line.',
      },
    ],
    figures: ['st-graph'],
  },

  derivations: [],

  equations: [
    {
      name: 'Velocity = gradient',
      latex: String.raw`v = \frac{\Delta s}{\Delta t}`,
    },
  ],

  symbols: [
    { symbol: 's', meaning: 'displacement', unit: '\\mathrm{m}' },
    { symbol: 't', meaning: 'time', unit: '\\mathrm{s}' },
    { symbol: 'v', meaning: 'velocity', unit: '\\mathrm{m\\,s^{-1}}' },
  ],

  samples: [
    {
      title: 'Reading the graph',
      question: 'Use the graph in Fig. 1 to find the velocity during each of the three stages.',
      steps: [
        {
          text: 'A to B:',
          latex: String.raw`v = \frac{30 - 0}{6 - 0} = 5.0\ \mathrm{m\,s^{-1}}`,
        },
        {
          text: 'B to C: the line is horizontal, so the object is at rest: $v = 0$.',
        },
        {
          text: 'C to D: the gradient is negative, so it is moving back:',
          latex: String.raw`v = \frac{0 - 30}{16 - 10} = -5.0\ \mathrm{m\,s^{-1}}`,
        },
      ],
      answer: '+5.0 m s⁻¹, then 0, then −5.0 m s⁻¹ (back towards the start)',
      unitCheck: String.raw`\frac{\mathrm{m}}{\mathrm{s}} = \mathrm{m\,s^{-1}}`,
    },
  ],

  practice: [
    {
      question: 'What does the gradient of a displacement–time graph represent?',
      answer: 'Velocity',
    },
    {
      question: 'A straight line goes from (0 s, 0 m) to (8.0 s, 40 m). Calculate the velocity.',
      answer: '5.0 m s⁻¹',
    },
    {
      question: 'What does a horizontal line on a displacement–time graph show?',
      answer: 'The object is at rest',
    },
    {
      question: 'A tangent to a curved s–t graph passes through (1.0 s, 0 m) and (5.0 s, 24 m). Find the velocity there.',
      answer: '6.0 m s⁻¹',
    },
  ],

  other: {
    mistakes: [
      {
        wrong: 'Read the velocity off the vertical axis.',
        right: 'The vertical axis gives displacement; velocity is the gradient.',
      },
    ],
    tips: ['Use a large gradient triangle; a negative gradient means moving back.'],
    syllabus: ['9702 topic 2: determine velocity using the gradient of a displacement–time graph. Coursebook 1.4.'],
    links: [
      {
        label: 'Distance-Time Graph Explorer (simulation)',
        href: '/simulations/distance-time-graph',
      },
      {
        label: 'Practice questions for this lesson',
        href: '/practice/b2e3d430-7699-4dac-9f55-e84c5cd5ce9b?c=as',
      },
    ],
  },

  diagrams: [
    {
      id: 'st-graph',
      title: 'A displacement–time graph',
      caption: 'Steeper line = faster. Flat = at rest. Downward slope = moving back.',
      alt: 'Displacement against time. A straight line rises from 0 m at 0 s to 30 m at 6 s, stays flat at 30 m until 10 s, then falls in a straight line to 0 m at 16 s. A dashed triangle under the first section shows a rise of 30 m over 6 s.',
      width: 320,
      height: 230,
      shapes: [
        { kind: 'arrow', from: [50, 190], to: [50, 22], role: 'ink' },
        { kind: 'arrow', from: [50, 190], to: [312, 190], role: 'ink' },
        {
          kind: 'label',
          at: [44, 26],
          text: 's / m',
          anchor: 'end',
          style: 'note',
        },
        {
          kind: 'label',
          at: [314, 224],
          text: 't / s',
          anchor: 'end',
          style: 'note',
        },
        { kind: 'curve', points: [A, B, C, D], role: 'ink' },
        {
          kind: 'line',
          from: A,
          to: [B[0], A[1]],
          role: 'muted',
          dashed: true,
          thin: true,
        },
        {
          kind: 'line',
          from: [B[0], A[1]],
          to: B,
          role: 'muted',
          dashed: true,
          thin: true,
        },
        {
          kind: 'line',
          from: [50, B[1]],
          to: B,
          role: 'muted',
          dashed: true,
          thin: true,
        },
        {
          kind: 'label',
          at: [44, B[1] + 4],
          text: '30',
          anchor: 'end',
          style: 'note',
        },
        {
          kind: 'label',
          at: [B[0], 206],
          text: '6',
          anchor: 'middle',
          style: 'note',
        },
        {
          kind: 'label',
          at: [C[0], 206],
          text: '10',
          anchor: 'middle',
          style: 'note',
        },
        {
          kind: 'label',
          at: [D[0], 206],
          text: '16',
          anchor: 'middle',
          style: 'note',
        },
        {
          kind: 'label',
          at: [44, 194],
          text: '0',
          anchor: 'end',
          style: 'note',
        },
        {
          kind: 'label',
          at: [X(1.6), Y(16)],
          text: 'A→B',
          anchor: 'end',
          style: 'note',
          role: 'muted',
        },
        {
          kind: 'label',
          at: [X(8), Y(30) - 8],
          text: 'B→C at rest',
          anchor: 'middle',
          style: 'note',
          role: 'muted',
        },
        {
          kind: 'label',
          at: [X(13.6), Y(16)],
          text: 'C→D',
          style: 'note',
          role: 'muted',
        },
        { kind: 'dot', at: A, radius: 2.5 },
        { kind: 'dot', at: B, radius: 2.5 },
        { kind: 'dot', at: C, radius: 2.5 },
        { kind: 'dot', at: D, radius: 2.5 },
      ],
    },
  ],
};
