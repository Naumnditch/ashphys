import type { CheatSheet, Point } from '../types';

/* AS 9702 · coursebook 2.4 Deducing acceleration. One page. Numbers recomputed in the tests. */

// Axes: origin (50, 190); 18 px per second, 12 px per m s⁻¹.
const X = (t: number) => 50 + 18 * t;
const Y = (v: number) => 190 - 12 * v;
const A: Point = [X(0), Y(0)];
const B: Point = [X(4), Y(12)];
const C: Point = [X(10), Y(12)];
const D: Point = [X(14), Y(0)];

export const as24DeducingAcceleration: CheatSheet = {
  slug: 'as-2-4-deducing-acceleration',
  topicId: '5e4207c2-e358-4374-b5ab-92bbcb2b87e7',
  curriculumId: 'as',
  title: 'Deducing acceleration',
  lessonCode: '2.4',
  chapter: { number: 2, title: 'Accelerated motion' },
  syllabusSections: ['2.4'],
  goal: 'Find acceleration from the gradient of a velocity–time graph.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'On a velocity–time graph the gradient is $\\Delta v/\\Delta t$, which is the acceleration. A steeper line means a larger acceleration; a horizontal line means constant velocity (zero acceleration); a line sloping down means the object is slowing.',
      'A straight line means uniform acceleration. For a curved line, draw a tangent at the moment you want and find its gradient with a large triangle.',
    ],
    keyTerms: [{ term: 'Gradient', source: 'paraphrase', text: 'Change in velocity ÷ change in time, read from a large triangle on the line.' }],
    figures: ['vt-graph'],
  },

  derivations: [],

  equations: [{ name: 'Acceleration = gradient of v–t', latex: String.raw`a = \frac{\Delta v}{\Delta t}` }],

  symbols: [
    { symbol: 'v', meaning: 'velocity', unit: '\\mathrm{m\\,s^{-1}}' },
    { symbol: 't', meaning: 'time', unit: '\\mathrm{s}' },
    { symbol: 'a', meaning: 'acceleration', unit: '\\mathrm{m\\,s^{-2}}' },
  ],

  samples: [
    {
      title: 'Reading the graph',
      question: 'Use the graph in Fig. 1 to find the acceleration during each of the three stages.',
      steps: [
        { text: 'A to B:', latex: String.raw`a = \frac{12 - 0}{4 - 0} = 3.0\ \mathrm{m\,s^{-2}}` },
        { text: 'B to C: the line is horizontal, so the velocity is constant: $a = 0$.' },
        { text: 'C to D: the gradient is negative, so it is slowing:', latex: String.raw`a = \frac{0 - 12}{14 - 10} = -3.0\ \mathrm{m\,s^{-2}}` },
      ],
      answer: '+3.0 m s⁻², then 0, then −3.0 m s⁻²',
      unitCheck: String.raw`\frac{\mathrm{m\,s^{-1}}}{\mathrm{s}} = \mathrm{m\,s^{-2}}`,
    },
  ],

  practice: [
    { question: 'What does a horizontal line on a velocity–time graph show?', answer: 'Constant velocity (zero acceleration)' },
    { question: 'A straight line goes from (0 s, 4.0 m s⁻¹) to (5.0 s, 14 m s⁻¹). Find the acceleration.', answer: '2.0 m s⁻²' },
    { question: 'A tangent to a curved v–t graph passes through (0 s, 2.0 m s⁻¹) and (4.0 s, 10 m s⁻¹). Find the acceleration there.', answer: '2.0 m s⁻²' },
    { question: 'A v–t line falls from 20 m s⁻¹ to 0 in 8.0 s. Find the acceleration.', answer: '−2.5 m s⁻²' },
  ],

  other: {
    mistakes: [{ wrong: 'Read a horizontal v–t line as “at rest”.', right: 'That is an s–t graph. On a v–t graph it means constant velocity.' }],
    tips: ['Check the axes first: s–t gradient = velocity; v–t gradient = acceleration.'],
    syllabus: ['9702 topic 2: acceleration from the gradient of a v–t graph. Coursebook 2.4.'],
    links: [{ label: 'Practice questions for this lesson', href: '/practice/5e4207c2-e358-4374-b5ab-92bbcb2b87e7?c=as' }],
  },

  diagrams: [
    {
      id: 'vt-graph',
      title: 'A velocity–time graph',
      caption: 'Steeper line = larger acceleration. Flat = constant velocity. Downward slope = slowing down.',
      alt: 'Velocity against time. A straight line rises from 0 at 0 s to 12 m/s at 4 s, stays flat at 12 m/s until 10 s, then falls in a straight line to 0 at 14 s.',
      width: 320,
      height: 230,
      shapes: [
        { kind: 'arrow', from: [50, 190], to: [50, 22], role: 'ink' },
        { kind: 'arrow', from: [50, 190], to: [312, 190], role: 'ink' },
        { kind: 'label', at: [58, 28], text: 'v / m s⁻¹', style: 'note' },
        { kind: 'label', at: [314, 224], text: 't / s', anchor: 'end', style: 'note' },
        { kind: 'curve', points: [A, B, C, D], role: 'ink' },
        { kind: 'line', from: [50, B[1]], to: B, role: 'muted', dashed: true, thin: true },
        { kind: 'line', from: [B[0], A[1]], to: B, role: 'muted', dashed: true, thin: true },
        { kind: 'line', from: [C[0], A[1]], to: C, role: 'muted', dashed: true, thin: true },
        { kind: 'label', at: [44, B[1] + 4], text: '12', anchor: 'end', style: 'note' },
        { kind: 'label', at: [44, 194], text: '0', anchor: 'end', style: 'note' },
        { kind: 'label', at: [B[0], 206], text: '4', anchor: 'middle', style: 'note' },
        { kind: 'label', at: [C[0], 206], text: '10', anchor: 'middle', style: 'note' },
        { kind: 'label', at: [D[0], 206], text: '14', anchor: 'middle', style: 'note' },
        { kind: 'label', at: [X(1.6), Y(7)], text: 'A→B', anchor: 'end', style: 'note', role: 'muted' },
        { kind: 'label', at: [X(7), Y(12) - 8], text: 'B→C', anchor: 'middle', style: 'note', role: 'muted' },
        { kind: 'label', at: [X(12.4), Y(7)], text: 'C→D', style: 'note', role: 'muted' },
        { kind: 'dot', at: A, radius: 2.5 },
        { kind: 'dot', at: B, radius: 2.5 },
        { kind: 'dot', at: C, radius: 2.5 },
        { kind: 'dot', at: D, radius: 2.5 },
      ],
    },
  ],
};
