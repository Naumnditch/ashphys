import type { CheatSheet } from '../types';

/* AS 9702 · coursebook 2.1 The meaning of acceleration. One page. Numbers recomputed in the tests. */

export const as21MeaningOfAcceleration: CheatSheet = {
  slug: 'as-2-1-meaning-of-acceleration',
  topicId: '8ba3439e-0247-4a40-8f47-a5945e5c2968',
  curriculumId: 'as',
  title: 'The meaning of acceleration',
  lessonCode: '2.1',
  chapter: { number: 2, title: 'Accelerated motion' },
  syllabusSections: ['2.1'],
  goal: 'Say what acceleration is, and recognise speeding up, slowing down and changing direction as acceleration.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'An object accelerates whenever its velocity changes. Acceleration is the rate of change of velocity: how much the velocity changes each second.',
      'Velocity is a vector, so acceleration is a vector too. Speeding up, slowing down and changing direction (even at constant speed) are all accelerations. Slowing down is a negative acceleration (a deceleration) when the positive direction is the direction of motion.',
    ],
    keyTerms: [
      { term: 'Acceleration', source: 'paraphrase', text: 'The rate of change of velocity: change in velocity divided by the time taken.' },
      { term: 'Uniform acceleration', source: 'paraphrase', text: 'The velocity changes by the same amount every second.' },
    ],
  },

  derivations: [],

  equations: [{ name: 'Acceleration', latex: String.raw`a = \frac{\Delta v}{\Delta t}` }],

  symbols: [
    { symbol: 'a', meaning: 'acceleration', unit: '\\mathrm{m\\,s^{-2}}' },
    { symbol: '\\Delta v', meaning: 'change in velocity', unit: '\\mathrm{m\\,s^{-1}}' },
    { symbol: '\\Delta t', meaning: 'time taken', unit: '\\mathrm{s}' },
  ],

  samples: [
    {
      title: 'Speeding up and slowing down',
      question: 'A car speeds up from rest to 24 m s⁻¹ in 8.0 s. Later it slows from 24 m s⁻¹ to 6.0 m s⁻¹ in 3.0 s. Calculate the acceleration in each case.',
      steps: [
        { text: 'Speeding up:', latex: String.raw`a = \frac{24 - 0}{8.0} = 3.0\ \mathrm{m\,s^{-2}}` },
        { text: 'Slowing down: the change in velocity is negative.', latex: String.raw`a = \frac{6.0 - 24}{3.0} = -6.0\ \mathrm{m\,s^{-2}}` },
      ],
      answer: '+3.0 m s⁻², then −6.0 m s⁻² (a deceleration of 6.0 m s⁻²)',
      unitCheck: String.raw`\frac{\mathrm{m\,s^{-1}}}{\mathrm{s}} = \mathrm{m\,s^{-2}}`,
    },
  ],

  practice: [
    { question: 'A sprinter goes from rest to 10 m s⁻¹ in 2.5 s. Calculate the acceleration.', answer: '4.0 m s⁻²' },
    { question: 'A bus slows from 15 m s⁻¹ to 5.0 m s⁻¹ in 4.0 s. Calculate its acceleration.', answer: '−2.5 m s⁻²' },
    { question: 'A train travels at a steady 30 m s⁻¹ in a straight line. What is its acceleration?', answer: 'Zero' },
    { question: 'A car goes round a roundabout at a constant 8.0 m s⁻¹. Is it accelerating? Why?', answer: 'Yes: its direction, so its velocity, changes' },
  ],

  other: {
    mistakes: [
      { wrong: 'A fast object has a large acceleration.', right: 'Acceleration is how quickly the velocity changes, not how big it is.' },
      { wrong: 'Constant speed means zero acceleration.', right: 'Only in a straight line; a change of direction is an acceleration.' },
    ],
    tips: ['Choose a positive direction first; then the sign of $a$ tells you which way it points.'],
    syllabus: ['9702 topic 2: define and use acceleration. Coursebook 2.1.'],
    links: [{ label: 'Practice questions for this lesson', href: '/practice/8ba3439e-0247-4a40-8f47-a5945e5c2968?c=as' }],
  },

  diagrams: [],
};
