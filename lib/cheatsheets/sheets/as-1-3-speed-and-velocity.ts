import type { CheatSheet } from '../types';

/* AS 9702 · coursebook 1.3 Speed and velocity. One page. */

export const as13SpeedVelocity: CheatSheet = {
  slug: 'as-1-3-speed-and-velocity',
  topicId: 'd47d25c0-5538-419d-9d8f-026400e11f72',
  curriculumId: 'as',
  title: 'Speed and velocity',
  lessonCode: '1.3',
  chapter: { number: 1, title: 'Kinematics' },
  syllabusSections: ['1.3'],
  goal: 'Calculate average velocity from displacement and contrast it with average speed.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'Velocity is the rate of change of displacement: speed in a stated direction. It is a vector, so it uses displacement, not distance.',
      'In a straight line, choose one direction as positive; a negative velocity then means moving the other way. Average speed and average velocity differ whenever the motion turns back: a round trip has an average velocity of zero.',
    ],
    keyTerms: [
      {
        term: 'Velocity',
        source: 'paraphrase',
        text: 'The rate of change of displacement (displacement per unit time), with a direction.',
      },
      {
        term: 'Average velocity',
        source: 'paraphrase',
        text: 'Total displacement divided by total time.',
      },
    ],
  },

  derivations: [],

  equations: [
    {
      name: 'Average velocity (Δs: displacement)',
      latex: String.raw`v = \frac{\Delta s}{\Delta t}`,
    },
    {
      name: 'Average speed (d: distance)',
      latex: String.raw`\text{speed} = \frac{d}{t}`,
    },
  ],

  symbols: [
    { symbol: 'v', meaning: 'velocity', unit: '\\mathrm{m\\,s^{-1}}' },
    {
      symbol: '\\Delta s',
      meaning: 'change in displacement',
      unit: '\\mathrm{m}',
    },
    { symbol: 'd', meaning: 'distance travelled', unit: '\\mathrm{m}' },
    { symbol: '\\Delta t,\\ t', meaning: 'time', unit: '\\mathrm{s}' },
  ],

  samples: [
    {
      title: 'There and partly back',
      question: 'A car drives 300 m east in 20 s, then 100 m west in 10 s. Calculate its average speed and its average velocity for the whole trip.',
      steps: [
        {
          text: 'Speed uses the total distance:',
          latex: String.raw`\text{speed} = \frac{300 + 100}{20 + 10} = \frac{400}{30} = 13.3\ \mathrm{m\,s^{-1}}`,
        },
        {
          text: 'Velocity uses the displacement (east positive):',
          latex: String.raw`v = \frac{300 - 100}{30} = \frac{200}{30} = 6.67\ \mathrm{m\,s^{-1}}`,
        },
      ],
      answer: 'average speed 13 m s⁻¹; average velocity 6.7 m s⁻¹ east',
      unitCheck: String.raw`\frac{\mathrm{m}}{\mathrm{s}} = \mathrm{m\,s^{-1}}`,
    },
  ],

  practice: [
    {
      question: 'A ball is thrown 5.0 m straight up and caught at the same height 2.0 s after it was thrown. Calculate its average speed and average velocity.',
      answer: '5.0 m s⁻¹; zero',
    },
    {
      question: 'A train travels 12 km north in 10 minutes. Calculate its average velocity.',
      answer: '20 m s⁻¹ north',
    },
    {
      question: 'Can an object have a constant speed but a changing velocity? Explain.',
      answer: 'Yes, if its direction changes (e.g. moving in a circle).',
    },
    {
      question: 'Taking east as positive, a cyclist has a velocity of −15 m s⁻¹. Describe the motion.',
      answer: '15 m s⁻¹ towards the west',
    },
  ],

  other: {
    mistakes: [
      {
        wrong: 'Use the total distance to find the average velocity.',
        right: 'Use the displacement (start to finish), with a direction.',
      },
      {
        wrong: 'A negative velocity means slowing down.',
        right: 'It means moving in the negative direction.',
      },
    ],
    tips: ['State your positive direction before writing any velocity.'],
    syllabus: ['9702 topic 2: define and use speed and velocity. Coursebook 1.3.'],
    links: [
      {
        label: 'Practice questions for this lesson',
        href: '/practice/d47d25c0-5538-419d-9d8f-026400e11f72?c=as',
      },
    ],
  },

  diagrams: [],
};
