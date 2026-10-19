import type { CheatSheet } from '../types';

/* AS 9702 · coursebook 2.3 Units of acceleration. One page. Numbers recomputed in the tests. */

export const as23UnitsOfAcceleration: CheatSheet = {
  slug: 'as-2-3-units-of-acceleration',
  topicId: 'cfa4c849-4465-4806-9a6e-29163a3db134',
  curriculumId: 'as',
  title: 'Units of acceleration',
  lessonCode: '2.3',
  chapter: { number: 2, title: 'Accelerated motion' },
  syllabusSections: ['2.3'],
  goal: 'Explain why acceleration is in m s⁻², and convert other units to it.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'Acceleration is a change in velocity (m s⁻¹) divided by a time (s), so its SI unit is metres per second per second: m s⁻² (also written m/s²).',
      'An acceleration of 3 m s⁻² means the velocity grows by 3 m s⁻¹ every second. Before calculating, convert every quantity to SI units: km h⁻¹ to m s⁻¹ (divide by 3.6), minutes to seconds, cm to m.',
    ],
    keyTerms: [{ term: 'm s⁻²', source: 'paraphrase', text: 'Metres per second per second: the change in velocity, in m s⁻¹, each second.' }],
  },

  derivations: [],

  equations: [
    { name: 'The unit of a', latex: String.raw`\frac{\mathrm{m\,s^{-1}}}{\mathrm{s}} = \mathrm{m\,s^{-2}}` },
    { name: 'km h⁻¹ to m s⁻¹', latex: String.raw`1\ \mathrm{km\,h^{-1}} = \frac{1}{3.6}\ \mathrm{m\,s^{-1}}` },
  ],

  symbols: [
    { symbol: 'a', meaning: 'acceleration', unit: '\\mathrm{m\\,s^{-2}}' },
    { symbol: 'v', meaning: 'velocity', unit: '\\mathrm{m\\,s^{-1}}' },
    { symbol: 't', meaning: 'time', unit: '\\mathrm{s}' },
  ],

  samples: [
    {
      title: '0 to 100 km h⁻¹',
      question: 'A car accelerates from rest to 100 km h⁻¹ in 8.0 s. Calculate its average acceleration in m s⁻².',
      steps: [
        { text: 'Convert the velocity to m s⁻¹:', latex: String.raw`v = \frac{100}{3.6} = 27.8\ \mathrm{m\,s^{-1}}` },
        { text: 'Divide by the time:', latex: String.raw`a = \frac{27.8 - 0}{8.0} = 3.47\ \mathrm{m\,s^{-2}}` },
      ],
      answer: String.raw`$a = 3.5\ \mathrm{m\,s^{-2}}$ (2 s.f.)`,
      unitCheck: String.raw`\frac{\mathrm{m\,s^{-1}}}{\mathrm{s}} = \mathrm{m\,s^{-2}}`,
    },
  ],

  practice: [
    { question: 'A motorbike goes from rest to 60 km h⁻¹ in 5.0 s. Find its acceleration.', answer: '3.3 m s⁻²' },
    { question: 'A rocket’s speed rises by 30 m s⁻¹ every 2.0 s. Find its acceleration.', answer: '15 m s⁻²' },
    { question: 'Express 1.2 cm s⁻² in m s⁻².', answer: '0.012 m s⁻²' },
    { question: 'A train slows from 72 km h⁻¹ to rest in 1.0 minute. Find its acceleration.', answer: '−0.33 m s⁻²' },
  ],

  other: {
    mistakes: [
      { wrong: 'Give acceleration in m s⁻¹.', right: 'm s⁻¹ is velocity; acceleration is m s⁻².' },
      { wrong: 'Divide km h⁻¹ by seconds.', right: 'Convert to m s⁻¹ (÷ 3.6) and minutes to seconds first.' },
    ],
    tips: ['Write the unit at every step; a wrong unit shows a missed conversion.'],
    syllabus: ['9702 topic 2: define and use acceleration; SI units. Coursebook 2.3.'],
    links: [{ label: 'Practice questions for this lesson', href: '/practice/cfa4c849-4465-4806-9a6e-29163a3db134?c=as' }],
  },

  diagrams: [],
};
