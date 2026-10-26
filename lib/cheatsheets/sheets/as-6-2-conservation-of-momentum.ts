import type { CheatSheet, Point } from '../types';

/* AS 9702 · coursebook 6.2 Modelling collisions (lesson: Conservation of momentum and collisions). One page. Numbers recomputed in the tests. */

// Fig. 1 · trolleys before and after sticking; 20 px per m s⁻¹.
const K = 20;
const box = (x0: number, x1: number, y: number): Point[] => [
  [x0, y],
  [x0, y - 24],
  [x1, y - 24],
  [x1, y],
];

export const as62ConservationOfMomentum: CheatSheet = {
  slug: 'as-6-2-conservation-of-momentum',
  topicId: '42c67aa7-36ea-56ea-881a-771edd16371c',
  curriculumId: 'as',
  title: 'Conservation of momentum and collisions',
  lessonCode: '6.2',
  chapter: { number: 6, title: 'Momentum' },
  syllabusSections: ['6.2'],
  goal: 'Use conservation of momentum to find an unknown velocity or mass after a collision.',
  reviewed: '2026-10-26',

  explanation: {
    paragraphs: [
      'In a collision the objects push on each other with equal and opposite forces, so the momentum one gains the other loses. The total momentum of the system stays the same, provided no resultant external force acts on it.',
      'Write total momentum before = total momentum after, with a sign for every velocity. If the objects stick together they move off with one shared velocity.',
    ],
    keyTerms: [
      {
        term: 'Principle of conservation of momentum',
        source: 'paraphrase',
        text: 'The total momentum of a system stays constant, provided no resultant external force acts on it.',
      },
    ],
    figures: ['stick'],
  },

  derivations: [],

  equations: [
    { name: 'Conservation of momentum', latex: String.raw`m_1u_1 + m_2u_2 = m_1v_1 + m_2v_2` },
    { name: 'They stick together', latex: String.raw`m_1u_1 + m_2u_2 = (m_1 + m_2)\,v` },
  ],

  symbols: [
    { symbol: 'm', meaning: 'mass of each object', unit: '\\mathrm{kg}' },
    { symbol: 'u,\\ v', meaning: 'velocity before, after', unit: '\\mathrm{m\\,s^{-1}}' },
  ],

  samples: [
    {
      title: 'Trolleys that stick',
      question:
        'A 2.0 kg trolley moving at 3.0 m s⁻¹ hits a stationary 1.0 kg trolley and they stick together (Fig. 1). Calculate their velocity just after the collision.',
      steps: [
        { text: 'Momentum before = momentum after:', latex: String.raw`2.0 \times 3.0 + 1.0 \times 0 = (2.0 + 1.0)\,v` },
        { text: '$v$ is multiplied by 3.0; divide:', latex: String.raw`v = \frac{6.0}{3.0} = 2.0\ \mathrm{m\,s^{-1}}` },
      ],
      answer: '2.0 m s⁻¹ in the original direction',
      unitCheck: String.raw`\frac{\mathrm{kg\,m\,s^{-1}}}{\mathrm{kg}} = \mathrm{m\,s^{-1}}`,
    },
  ],

  practice: [
    { question: 'A 4.0 kg trolley at 5.0 m s⁻¹ hits a stationary 1.0 kg trolley and they stick. Find their velocity.', answer: '4.0 m s⁻¹' },
    {
      question: 'A 0.50 kg ball at 6.0 m s⁻¹ hits a stationary 1.5 kg block and rebounds at 1.5 m s⁻¹. Find the block’s velocity.',
      answer: '2.5 m s⁻¹ forwards',
    },
    {
      question: 'A 2.0 kg trolley at 4.0 m s⁻¹ meets a 3.0 kg trolley moving at 2.0 m s⁻¹ towards it. They stick. Find the velocity.',
      answer: '0.40 m s⁻¹ in the 2.0 kg trolley’s direction',
    },
    { question: 'When is the total momentum of a system conserved?', answer: 'When no resultant external force acts on it' },
  ],

  other: {
    mistakes: [{ wrong: 'Write the rebound velocity as positive.', right: 'Moving back is negative: $v = -1.5$ m s⁻¹' }],
    tips: ['Sketch “before” and “after” with arrows and masses; then write one equation.'],
    syllabus: ['9702 topic 3: state and apply the principle of conservation of momentum. Coursebook 6.2.'],
    links: [{ label: 'Practice questions for this lesson', href: '/practice/42c67aa7-36ea-56ea-881a-771edd16371c?c=as' }],
  },

  diagrams: [
    {
      id: 'stick',
      title: 'Two trolleys stick together',
      caption: 'Momentum before: $2.0 \\times 3.0 = 6.0$ kg m s⁻¹. After: $3.0 \\times 2.0 = 6.0$ kg m s⁻¹.',
      alt: 'Before: a 2.0 kg trolley moves right at 3.0 m/s towards a 1.0 kg trolley at rest. After: the two trolleys are joined and move right together at 2.0 m/s.',
      width: 300,
      height: 170,
      shapes: [
        { kind: 'surface', from: [10, 70], to: [290, 70], side: 'right' },
        { kind: 'surface', from: [10, 150], to: [290, 150], side: 'right' },
        { kind: 'label', at: [12, 24], text: 'before', style: 'note', role: 'muted' },
        { kind: 'label', at: [12, 104], text: 'after', style: 'note', role: 'muted' },
        { kind: 'polygon', points: box(40, 100, 66), fill: 'soft' },
        { kind: 'polygon', points: box(40, 100, 66) },
        { kind: 'polygon', points: box(190, 240, 66), fill: 'soft' },
        { kind: 'polygon', points: box(190, 240, 66) },
        { kind: 'label', at: [70, 58], text: '2.0 kg', anchor: 'middle', style: 'note' },
        { kind: 'label', at: [215, 58], text: '1.0 kg', anchor: 'middle', style: 'note' },
        { kind: 'arrow', from: [100, 54], to: [100 + K * 3, 54], role: 'velocity' },
        { kind: 'label', at: [130, 36], text: '3.0 m s⁻¹', anchor: 'middle', style: 'note', role: 'velocity' },
        { kind: 'label', at: [215, 36], text: 'at rest', anchor: 'middle', style: 'note', role: 'muted' },
        { kind: 'polygon', points: box(100, 160, 146), fill: 'soft' },
        { kind: 'polygon', points: box(100, 160, 146) },
        { kind: 'polygon', points: box(160, 210, 146), fill: 'soft' },
        { kind: 'polygon', points: box(160, 210, 146) },
        { kind: 'label', at: [130, 138], text: '2.0 kg', anchor: 'middle', style: 'note' },
        { kind: 'label', at: [185, 138], text: '1.0 kg', anchor: 'middle', style: 'note' },
        { kind: 'arrow', from: [210, 134], to: [210 + K * 2, 134], role: 'velocity' },
        { kind: 'label', at: [230, 116], text: '2.0 m s⁻¹', anchor: 'middle', style: 'note', role: 'velocity' },
      ],
    },
  ],
};
