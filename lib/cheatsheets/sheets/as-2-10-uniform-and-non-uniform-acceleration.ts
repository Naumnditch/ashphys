import type { CheatSheet, Point } from '../types';

/* AS 9702 · coursebook 2.10 Uniform and non-uniform acceleration. One page. Numbers recomputed in the tests. */

// Axes: origin (50, 190); 20 px per second, 11 px per m s⁻¹. Curve v = 12(1 − e^(−t/3)), tangent at t = 3 s.
const X = (t: number) => 50 + 20 * t;
const Y = (v: number) => 190 - 11 * v;
const vOf = (t: number) => 12 * (1 - Math.exp(-t / 3));
const slope = 4 * Math.exp(-1);
const tangentAt = (t: number): Point => [X(t), Y(vOf(3) + slope * (t - 3))];
const curve: Point[] = Array.from({ length: 25 }, (_, i) => [X(i / 2), Y(vOf(i / 2))]);

export const as210UniformNonUniform: CheatSheet = {
  slug: 'as-2-10-uniform-and-non-uniform-acceleration',
  topicId: '643b6cd1-3fbe-4618-9330-b9d737f06161',
  curriculumId: 'as',
  title: 'Uniform and non-uniform acceleration',
  lessonCode: '2.10',
  chapter: { number: 2, title: 'Accelerated motion' },
  syllabusSections: ['2.10'],
  goal: 'Tell uniform from non-uniform acceleration on a graph, and handle a curved v–t graph.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'Uniform acceleration means a constant acceleration: a straight v–t graph. Only then can the suvat equations be used.',
      'Non-uniform acceleration gives a curved v–t graph. The acceleration at an instant is the gradient of the tangent there; the displacement is still the area under the curve, estimated by counting squares.',
    ],
    keyTerms: [
      { term: 'Uniform acceleration', source: 'paraphrase', text: 'Constant acceleration: equal changes in velocity in equal times.' },
      { term: 'Non-uniform acceleration', source: 'paraphrase', text: 'The acceleration changes with time; the v–t graph curves.' },
    ],
    figures: ['curve'],
  },

  derivations: [],

  equations: [
    { name: 'Acceleration at an instant', latex: String.raw`a = \text{gradient of the tangent}` },
    { name: 'Displacement', latex: String.raw`s = \text{area under the curve}` },
  ],

  symbols: [
    { symbol: 'a', meaning: 'acceleration', unit: '\\mathrm{m\\,s^{-2}}' },
    { symbol: 's', meaning: 'displacement', unit: '\\mathrm{m}' },
  ],

  samples: [
    {
      title: 'Tangent to a curve',
      question:
        'In Fig. 1 the tangent at 3.0 s passes through (1.0 s, 4.6 m s⁻¹) and (5.0 s, 10.5 m s⁻¹). Find the acceleration at 3.0 s, and say why $v = u + at$ cannot be used here.',
      steps: [
        { text: 'Gradient of the tangent:', latex: String.raw`a = \frac{10.5 - 4.6}{5.0 - 1.0} = 1.48\ \mathrm{m\,s^{-2}}` },
        { text: 'The graph curves, so the acceleration is not constant: suvat does not apply.' },
      ],
      answer: String.raw`$a = 1.5\ \mathrm{m\,s^{-2}}$ at 3.0 s; acceleration not constant, so no suvat`,
    },
  ],

  practice: [
    { question: 'A v–t curve gets less steep as time goes on. Describe the acceleration.', answer: 'Positive but decreasing' },
    { question: 'A tangent passes through (2.0 s, 3.0 m s⁻¹) and (6.0 s, 15 m s⁻¹). Find the acceleration.', answer: '3.0 m s⁻²' },
    { question: 'Under a curved v–t graph there are 46 squares, each 1.0 m s⁻¹ by 0.50 s. Estimate the displacement.', answer: '23 m' },
    { question: 'Can $v^2 = u^2 + 2as$ be used for a skydiver before terminal velocity?', answer: 'No: the acceleration is not constant' },
  ],

  other: {
    mistakes: [
      { wrong: 'Join two points on the curve to find the acceleration at an instant.', right: 'That is an average; draw the tangent at the instant.' },
    ],
    tips: ['Draw the tangent long, then use a large triangle on it.'],
    syllabus: ['9702 topic 2: gradient and area of a v–t graph. Coursebook 2.10.'],
    links: [{ label: 'Practice questions for this lesson', href: '/practice/643b6cd1-3fbe-4618-9330-b9d737f06161?c=as' }],
  },

  diagrams: [
    {
      id: 'curve',
      title: 'Non-uniform acceleration',
      caption: 'The curve flattens: the acceleration falls. The dashed tangent’s gradient is the acceleration at 3.0 s.',
      alt: 'Velocity against time. A curve rises steeply from the origin and levels off towards 12 m/s. A dashed tangent touches it at 3 s. A thin dashed straight line from the origin shows uniform acceleration for comparison.',
      width: 320,
      height: 230,
      shapes: [
        { kind: 'arrow', from: [50, 190], to: [50, 22], role: 'ink' },
        { kind: 'arrow', from: [50, 190], to: [312, 190], role: 'ink' },
        { kind: 'label', at: [58, 28], text: 'v / m s⁻¹', style: 'note' },
        { kind: 'label', at: [314, 224], text: 't / s', anchor: 'end', style: 'note' },
        { kind: 'line', from: [X(0), Y(0)], to: [X(10), Y(12)], role: 'muted', dashed: true, thin: true },
        { kind: 'label', at: [X(10) + 4, Y(12) - 4], text: 'uniform', style: 'note', role: 'muted' },
        { kind: 'curve', points: curve, role: 'velocity' },
        { kind: 'line', from: tangentAt(0.5), to: tangentAt(6.5), role: 'acceleration', dashed: true },
        { kind: 'dot', at: tangentAt(3), radius: 2.5 },
        { kind: 'label', at: [X(11), Y(vOf(11)) + 26], text: 'non-uniform', anchor: 'middle', style: 'note', role: 'velocity' },
        { kind: 'label', at: [X(3), 206], text: '3', anchor: 'middle', style: 'note' },
        { kind: 'label', at: [X(12), 206], text: '12', anchor: 'middle', style: 'note' },
        { kind: 'label', at: [44, Y(12) + 4], text: '12', anchor: 'end', style: 'note' },
      ],
    },
  ],
};
