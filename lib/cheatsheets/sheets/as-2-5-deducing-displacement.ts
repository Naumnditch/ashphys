import type { CheatSheet, Point } from '../types';

/* AS 9702 · coursebook 2.5 Deducing displacement. One page. Numbers recomputed in the tests. */

// Axes: origin (50, 190); 20 px per second, 13 px per m s⁻¹.
const X = (t: number) => 50 + 20 * t;
const Y = (v: number) => 190 - 13 * v;
const A: Point = [X(0), Y(0)];
const B: Point = [X(4), Y(10)];
const C: Point = [X(10), Y(10)];
const D: Point = [X(12), Y(0)];

export const as25DeducingDisplacement: CheatSheet = {
  slug: 'as-2-5-deducing-displacement',
  topicId: 'c47dfb2d-b9eb-482e-b89f-aecbc8e799cc',
  curriculumId: 'as',
  title: 'Deducing displacement',
  lessonCode: '2.5',
  chapter: { number: 2, title: 'Accelerated motion' },
  syllabusSections: ['2.5'],
  goal: 'Find displacement from the area under a velocity–time graph.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'The area between a velocity–time graph and the time axis is the displacement: velocity × time, added up over the whole journey. Split the area into rectangles and triangles and add them.',
      'Area below the time axis is negative displacement (moving back). For uniform acceleration the area is a trapezium, which gives $s = \\tfrac{1}{2}(u + v)t$.',
    ],
    keyTerms: [{ term: 'Area under a v–t graph', source: 'paraphrase', text: 'The displacement during that time interval.' }],
    figures: ['area'],
  },

  derivations: [],

  equations: [
    { name: 'Displacement = area under v–t', latex: String.raw`s = \text{area under the } v\text{–}t \text{ graph}` },
    { name: 'Uniform acceleration (trapezium)', latex: String.raw`s = \tfrac{1}{2}(u + v)\,t` },
  ],

  symbols: [
    { symbol: 's', meaning: 'displacement', unit: '\\mathrm{m}' },
    { symbol: 'u,\\ v', meaning: 'initial, final velocity', unit: '\\mathrm{m\\,s^{-1}}' },
    { symbol: 't', meaning: 'time', unit: '\\mathrm{s}' },
  ],

  samples: [
    {
      title: 'Adding up the areas',
      question: 'Use the graph in Fig. 1 to find the total displacement and the average velocity for the 12 s journey.',
      steps: [
        {
          text: 'Area 1 (triangle) + area 2 (rectangle) + area 3 (triangle):',
          latex: String.raw`s = \tfrac{1}{2}(4)(10) + (6)(10) + \tfrac{1}{2}(2)(10) = 20 + 60 + 10 = 90\ \mathrm{m}`,
        },
        { text: 'Average velocity = total displacement ÷ total time:', latex: String.raw`\bar v = \frac{90}{12} = 7.5\ \mathrm{m\,s^{-1}}` },
      ],
      answer: '90 m; average velocity 7.5 m s⁻¹',
      unitCheck: String.raw`\mathrm{m\,s^{-1}} \times \mathrm{s} = \mathrm{m}`,
    },
  ],

  practice: [
    { question: 'A car travels at a constant 8.0 m s⁻¹ for 15 s. Find the displacement.', answer: '120 m' },
    { question: 'A car accelerates uniformly from rest to 20 m s⁻¹ in 10 s. Find the distance travelled.', answer: '100 m' },
    { question: 'A cyclist accelerates uniformly from 6.0 m s⁻¹ to 14 m s⁻¹ in 5.0 s. Find the displacement.', answer: '50 m' },
    { question: 'Part of a v–t graph lies below the time axis. What does that part show?', answer: 'Moving in the negative direction (negative displacement)' },
  ],

  other: {
    mistakes: [{ wrong: 'Use $s = vt$ when the velocity is changing.', right: 'Use the area: for uniform acceleration $s = \\tfrac{1}{2}(u + v)t$.' }],
    tips: ['Label the shapes 1, 2, 3 on the graph and write each area with its unit.'],
    syllabus: ['9702 topic 2: displacement from the area under a v–t graph. Coursebook 2.5.'],
    links: [{ label: 'Practice questions for this lesson', href: '/practice/c47dfb2d-b9eb-482e-b89f-aecbc8e799cc?c=as' }],
  },

  diagrams: [
    {
      id: 'area',
      title: 'Area under a v–t graph',
      caption: 'The shaded area is the displacement: two triangles and a rectangle.',
      alt: 'Velocity against time. The velocity rises uniformly from 0 to 10 m/s in 4 s, stays at 10 m/s until 10 s, then falls to 0 at 12 s. The area under the line is shaded and split by dashed lines at 4 s and 10 s into regions 1, 2 and 3.',
      width: 320,
      height: 230,
      shapes: [
        { kind: 'polygon', points: [A, B, C, D], role: 'muted', fill: 'soft' },
        { kind: 'arrow', from: [50, 190], to: [50, 22], role: 'ink' },
        { kind: 'arrow', from: [50, 190], to: [312, 190], role: 'ink' },
        { kind: 'label', at: [58, 28], text: 'v / m s⁻¹', style: 'note' },
        { kind: 'label', at: [314, 224], text: 't / s', anchor: 'end', style: 'note' },
        { kind: 'curve', points: [A, B, C, D], role: 'ink' },
        { kind: 'line', from: [B[0], A[1]], to: B, role: 'muted', dashed: true, thin: true },
        { kind: 'line', from: [C[0], A[1]], to: C, role: 'muted', dashed: true, thin: true },
        { kind: 'label', at: [44, B[1] + 4], text: '10', anchor: 'end', style: 'note' },
        { kind: 'label', at: [44, 194], text: '0', anchor: 'end', style: 'note' },
        { kind: 'label', at: [B[0], 206], text: '4', anchor: 'middle', style: 'note' },
        { kind: 'label', at: [C[0], 206], text: '10', anchor: 'middle', style: 'note' },
        { kind: 'label', at: [D[0], 206], text: '12', anchor: 'middle', style: 'note' },
        { kind: 'label', at: [X(2.8), Y(3)], text: '1', anchor: 'middle', style: 'note' },
        { kind: 'label', at: [X(7), Y(5)], text: '2', anchor: 'middle', style: 'note' },
        { kind: 'label', at: [X(10.6), Y(3)], text: '3', anchor: 'middle', style: 'note' },
      ],
    },
  ],
};
