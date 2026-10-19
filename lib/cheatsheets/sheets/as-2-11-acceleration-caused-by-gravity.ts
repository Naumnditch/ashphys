import type { CheatSheet, Point } from '../types';

/* AS 9702 · coursebook 2.11 Acceleration caused by gravity. One page. Numbers recomputed in the tests. g = 9.81 m s⁻². */

// v–t for a ball thrown up at 12 m s⁻¹ (up positive): origin (50, 110); 90 px per second, 6 px per m s⁻¹.
const G = 9.81;
const X = (t: number) => 50 + 90 * t;
const Y = (v: number) => 110 - 6 * v;
const tTop = 12 / G;
const start: Point = [X(0), Y(12)];
const top: Point = [X(tTop), Y(0)];
const end: Point = [X(2 * tTop), Y(-12)];

export const as211AccelerationGravity: CheatSheet = {
  slug: 'as-2-11-acceleration-caused-by-gravity',
  topicId: 'e8c99a42-f3ca-45a2-9197-567cfffa1146',
  curriculumId: 'as',
  title: 'Acceleration caused by gravity',
  lessonCode: '2.11',
  chapter: { number: 2, title: 'Accelerated motion' },
  syllabusSections: ['2.11'],
  goal: 'Use g = 9.81 m s⁻² in the suvat equations for objects falling, or thrown up, without air resistance.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'Near the Earth’s surface, with no air resistance, every object falls with the same acceleration $g = 9.81$ m s⁻², downwards, whatever its mass. This is free fall.',
      'An object thrown upwards has the same downward acceleration all the way: it slows, stops for an instant at the top (where $v = 0$ but $a$ is still $g$) and speeds up on the way down. Take up as positive and use $a = -9.81$ m s⁻², or down as positive and $a = +9.81$.',
    ],
    keyTerms: [
      {
        term: 'Acceleration of free fall $g$',
        source: 'paraphrase',
        text: 'The acceleration of a falling object with no air resistance: 9.81 m s⁻² near the Earth.',
      },
    ],
    figures: ['throw'],
  },

  derivations: [],

  equations: [
    { name: 'Dropped from rest: time', latex: String.raw`s = \tfrac{1}{2}gt^{2}` },
    { name: 'Dropped from rest: speed', latex: String.raw`v^{2} = 2gs` },
  ],

  symbols: [
    { symbol: 'g', meaning: 'acceleration of free fall, 9.81', unit: '\\mathrm{m\\,s^{-2}}' },
    { symbol: 's', meaning: 'distance fallen', unit: '\\mathrm{m}' },
  ],

  samples: [
    {
      title: 'A dropped stone',
      question:
        'A stone is dropped from rest from a bridge 20 m above the water. Ignoring air resistance, calculate the time it takes to fall and its speed when it hits the water.',
      steps: [
        { text: 'Down positive, $u = 0$, $a = 9.81$:', latex: String.raw`t = \sqrt{\frac{2s}{g}} = \sqrt{\frac{2 \times 20}{9.81}} = 2.02\ \mathrm{s}` },
        { text: 'Speed:', latex: String.raw`v = \sqrt{2gs} = \sqrt{2 \times 9.81 \times 20} = 19.8\ \mathrm{m\,s^{-1}}` },
      ],
      answer: '2.0 s; 20 m s⁻¹ (19.8 m s⁻¹)',
      unitCheck: String.raw`\sqrt{\mathrm{m\,s^{-2}} \times \mathrm{m}} = \mathrm{m\,s^{-1}}`,
    },
  ],

  practice: [
    { question: 'A ball is thrown up at 12 m s⁻¹. How long does it take to reach the top?', answer: '1.2 s (1.22 s)' },
    { question: 'How high does that ball rise?', answer: '7.3 m' },
    { question: 'A ball is dropped from rest. Find its speed and the distance fallen after 3.0 s.', answer: '29 m s⁻¹ (29.4); 44 m (44.1)' },
    { question: 'A hammer and a feather are dropped together on the Moon (no air). Which lands first?', answer: 'Neither: they land together' },
  ],

  other: {
    mistakes: [{ wrong: 'At the top of its flight the acceleration is zero.', right: 'Only $v$ is zero; $a$ is still 9.81 m s⁻² downwards.' }],
    tips: ['Write your sign convention (“up +”) at the top of the working.'],
    syllabus: ['9702 topic 2: free fall without air resistance. Coursebook 2.11.'],
    links: [{ label: 'Practice questions for this lesson', href: '/practice/e8c99a42-f3ca-45a2-9197-567cfffa1146?c=as' }],
  },

  diagrams: [
    {
      id: 'throw',
      title: 'v–t for a ball thrown up',
      caption: 'One straight line with gradient $-g$ all the way, through $v = 0$ at the top.',
      alt: 'Velocity against time, up positive. A straight line falls from +12 m/s at time 0 through zero at 1.22 s (the top of the flight) to −12 m/s at 2.45 s.',
      width: 320,
      height: 200,
      shapes: [
        { kind: 'arrow', from: [50, 186], to: [50, 22], role: 'ink' },
        { kind: 'arrow', from: [50, 110], to: [300, 110], role: 'ink' },
        { kind: 'label', at: [58, 28], text: 'v / m s⁻¹', style: 'note' },
        { kind: 'label', at: [302, 102], text: 't / s', anchor: 'end', style: 'note' },
        { kind: 'line', from: start, to: end, role: 'velocity' },
        { kind: 'dot', at: top, radius: 2.5 },
        { kind: 'label', at: [top[0] + 6, top[1] - 18], text: 'top: v = 0, a = −g', style: 'note' },
        { kind: 'label', at: [44, Y(12) + 4], text: '12', anchor: 'end', style: 'note' },
        { kind: 'label', at: [44, Y(-12) + 4], text: '−12', anchor: 'end', style: 'note' },
        { kind: 'label', at: [44, 114], text: '0', anchor: 'end', style: 'note' },
        { kind: 'line', from: [50, Y(-12)], to: end, role: 'muted', dashed: true, thin: true },
        { kind: 'label', at: [X(0.4), Y(9) - 4], text: 'going up', style: 'note', role: 'muted' },
        { kind: 'label', at: [X(1.5) + 15, Y(-3)], text: 'coming down', style: 'note', role: 'muted' },
      ],
    },
  ],
};
