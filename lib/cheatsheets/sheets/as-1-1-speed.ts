import type { CheatSheet } from '../types';

/* AS 9702 · coursebook 1.1 Speed. One page. Numbers recomputed in the tests. */

export const as11Speed: CheatSheet = {
  slug: 'as-1-1-speed',
  topicId: 'ffbe7a62-e4c5-4cb6-8a20-6f0177f86d30',
  curriculumId: 'as',
  title: 'Speed',
  lessonCode: '1.1',
  chapter: { number: 1, title: 'Kinematics' },
  syllabusSections: ['1.1'],
  goal: 'Calculate average speed in m s⁻¹ and tell it apart from instantaneous speed.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'Average speed is the total distance travelled divided by the total time taken. In SI units it is measured in m s⁻¹.',
      'Instantaneous speed is the speed at one moment. It is found from a distance measured over a very short time, for example a card cutting through a light gate, or from the gradient of a distance–time graph. Speed is a scalar: it has size but no direction.',
    ],
    keyTerms: [
      {
        term: 'Average speed',
        source: 'paraphrase',
        text: 'Total distance travelled divided by total time taken.',
      },
      {
        term: 'Instantaneous speed',
        source: 'paraphrase',
        text: 'The speed at a particular instant: distance over a very short time interval.',
      },
    ],
  },

  derivations: [],

  equations: [
    { name: 'Average speed', latex: String.raw`v = \frac{d}{t}` },
    {
      name: 'km h⁻¹ to m s⁻¹',
      latex: String.raw`1\ \mathrm{km\,h^{-1}} = \frac{1000\ \mathrm{m}}{3600\ \mathrm{s}} = \frac{1}{3.6}\ \mathrm{m\,s^{-1}}`,
    },
  ],

  symbols: [
    { symbol: 'v', meaning: 'speed', unit: '\\mathrm{m\\,s^{-1}}' },
    { symbol: 'd', meaning: 'distance travelled', unit: '\\mathrm{m}' },
    { symbol: 't', meaning: 'time taken', unit: '\\mathrm{s}' },
  ],

  samples: [
    {
      title: 'Average speed in SI units',
      question: 'A car travels 150 km in 2.5 hours. Calculate its average speed in m s⁻¹.',
      steps: [
        {
          text: 'Convert to metres and seconds first:',
          latex: String.raw`d = 150\,000\ \mathrm{m}, \qquad t = 2.5 \times 3600 = 9000\ \mathrm{s}`,
        },
        {
          text: 'Divide:',
          latex: String.raw`v = \frac{150\,000}{9000} = 16.7\ \mathrm{m\,s^{-1}}`,
        },
      ],
      answer: String.raw`$v = 17\ \mathrm{m\,s^{-1}}$ (2 s.f.)`,
      unitCheck: String.raw`\frac{\mathrm{m}}{\mathrm{s}} = \mathrm{m\,s^{-1}}`,
    },
  ],

  practice: [
    {
      question: 'A sprinter runs 100 m in 9.58 s. Calculate the average speed.',
      answer: '10.4 m s⁻¹',
    },
    { question: 'Convert 72 km h⁻¹ to m s⁻¹.', answer: '20 m s⁻¹' },
    {
      question: 'A card 5.0 cm long cuts through a light gate in 0.020 s. Calculate the speed of the card.',
      answer: '2.5 m s⁻¹',
    },
    {
      question: 'A runner completes a 400 m lap in 50 s. Calculate the average speed.',
      answer: '8.0 m s⁻¹',
    },
  ],

  other: {
    mistakes: [
      {
        wrong: 'Divide kilometres by hours and call it m s⁻¹.',
        right: 'Convert to metres and seconds first (÷ 3.6 for km h⁻¹).',
      },
      {
        wrong: 'Average speed is the average of the speeds.',
        right: 'It is total distance ÷ total time.',
      },
    ],
    tips: ['Write the unit at every step; the unit check catches most conversion slips.'],
    syllabus: ['9702 topic 2: define and use distance and speed. Coursebook 1.1.'],
    links: [
      {
        label: 'Practice questions for this lesson',
        href: '/practice/ffbe7a62-e4c5-4cb6-8a20-6f0177f86d30?c=as',
      },
    ],
  },

  diagrams: [],
};
