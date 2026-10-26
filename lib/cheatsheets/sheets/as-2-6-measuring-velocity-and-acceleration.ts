import type { CheatSheet, Point } from '../types';

/* AS 9702 · coursebook 2.6 Measuring velocity and acceleration. One page. Numbers recomputed in the tests. */

// Side view: track at y = 170; a trolley carrying a card passes two light gates.
const TRACK = 170;
const gate = (x: number): Point[] => [
  [x - 7, TRACK],
  [x - 7, 92],
  [x + 7, 92],
  [x + 7, TRACK],
];

export const as26MeasuringVelocityAcceleration: CheatSheet = {
  slug: 'as-2-6-measuring-velocity-and-acceleration',
  topicId: '97c777dc-0adf-4df6-bd8f-9c659f0ef783',
  curriculumId: 'as',
  title: 'Measuring velocity and acceleration',
  lessonCode: '2.6',
  chapter: { number: 2, title: 'Accelerated motion' },
  syllabusSections: ['2.6'],
  goal: 'Find a velocity from a light gate and an acceleration from two velocities.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'A light gate times how long a card of known length $L$ blocks its beam. The velocity is $L/t$; a short card over a short time gives close to the instantaneous velocity.',
      'Two light gates give two velocities. Dividing their difference by the time taken between the gates gives the acceleration. Motion sensors, ticker-timers and video do the same job by recording position against time.',
    ],
    keyTerms: [{ term: 'Light gate', source: 'paraphrase', text: 'A beam and sensor connected to a timer; it records how long the beam is blocked.' }],
    figures: ['gates'],
  },

  derivations: [],

  equations: [
    { name: 'Velocity at a gate', latex: String.raw`v = \frac{L}{t}` },
    { name: 'Acceleration between gates', latex: String.raw`a = \frac{v_2 - v_1}{\Delta t}` },
  ],

  symbols: [
    { symbol: 'L', meaning: 'length of the card', unit: '\\mathrm{m}' },
    { symbol: 't', meaning: 'time the beam is blocked', unit: '\\mathrm{s}' },
    { symbol: '\\Delta t', meaning: 'time from gate 1 to gate 2', unit: '\\mathrm{s}' },
  ],

  samples: [
    {
      title: 'Two light gates',
      question: 'A 5.0 cm card blocks gate 1 for 0.050 s and gate 2 for 0.025 s. It takes 0.40 s to travel between the gates. Calculate the acceleration.',
      steps: [
        {
          text: 'Velocities at the gates ($L = 0.050$ m):',
          latex: String.raw`v_1 = \frac{0.050}{0.050} = 1.0\ \mathrm{m\,s^{-1}}, \quad v_2 = \frac{0.050}{0.025} = 2.0\ \mathrm{m\,s^{-1}}`,
        },
        { text: 'Acceleration:', latex: String.raw`a = \frac{2.0 - 1.0}{0.40} = 2.5\ \mathrm{m\,s^{-2}}` },
      ],
      answer: String.raw`$a = 2.5\ \mathrm{m\,s^{-2}}$`,
      unitCheck: String.raw`\frac{\mathrm{m\,s^{-1}}}{\mathrm{s}} = \mathrm{m\,s^{-2}}`,
    },
  ],

  practice: [
    { question: 'A 10 cm card blocks a light gate for 0.20 s. Find the velocity.', answer: '0.50 m s⁻¹' },
    { question: 'A trolley’s velocity rises from 0.50 m s⁻¹ to 1.5 m s⁻¹ in 0.80 s. Find the acceleration.', answer: '1.25 m s⁻² (1.3 m s⁻²)' },
    {
      question: 'Why is a narrow card better for measuring an instantaneous velocity?',
      answer: 'It blocks the beam for a shorter time, so the velocity changes less',
    },
    { question: 'Why use a light gate rather than a hand-held stopwatch?', answer: 'No human reaction time, so a much smaller timing uncertainty' },
  ],

  other: {
    mistakes: [{ wrong: 'Leave the card length in cm.', right: 'Convert to metres first: 5.0 cm = 0.050 m.' }],
    tips: ['$\\Delta t$ is the time between the gates, not the time either gate is blocked.'],
    syllabus: ['9702 topic 2: measure velocity and acceleration. Coursebook 2.6.'],
    links: [{ label: 'Practice questions for this lesson', href: '/practice/97c777dc-0adf-4df6-bd8f-9c659f0ef783?c=as' }],
  },

  diagrams: [
    {
      id: 'gates',
      title: 'A trolley passing two light gates',
      caption: 'Each gate times the card; the timer also records the time between the gates.',
      alt: 'Side view of a trolley on a level track moving to the right. A card stands on the trolley. Two light gates stand over the track ahead of it; each has a beam at the height of the card.',
      width: 320,
      height: 200,
      shapes: [
        { kind: 'surface', from: [16, TRACK], to: [304, TRACK], side: 'right' },
        {
          kind: 'polygon',
          points: [
            [30, 168],
            [30, 146],
            [100, 146],
            [100, 168],
          ],
          fill: 'soft',
        },
        {
          kind: 'polygon',
          points: [
            [30, 168],
            [30, 146],
            [100, 146],
            [100, 168],
          ],
        },
        {
          kind: 'polygon',
          points: [
            [58, 146],
            [58, 112],
            [72, 112],
            [72, 146],
          ],
        },
        { kind: 'arrow', from: [70, 132], to: [128, 132], role: 'velocity' },
        { kind: 'label', at: [132, 128], text: 'v', role: 'velocity' },
        { kind: 'polygon', points: gate(180), fill: 'none' },
        { kind: 'polygon', points: gate(262), fill: 'none' },
        { kind: 'dot', at: [180, 124], radius: 3 },
        { kind: 'dot', at: [262, 124], radius: 3 },
        { kind: 'label', at: [180, 84], text: 'gate 1', anchor: 'middle', style: 'note' },
        { kind: 'label', at: [262, 84], text: 'gate 2', anchor: 'middle', style: 'note' },
        { kind: 'label', at: [65, 104], text: 'card, length L', anchor: 'middle', style: 'note' },
        { kind: 'label', at: [221, 190], text: 'time Δt between gates', anchor: 'middle', style: 'note', role: 'muted' },
      ],
    },
  ],
};
