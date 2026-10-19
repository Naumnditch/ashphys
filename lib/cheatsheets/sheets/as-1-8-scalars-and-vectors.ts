import type { CheatSheet } from '../types';

/* AS 9702 · coursebook 1.8 Other examples of scalar and vector quantities. One page. */

export const as18ScalarsVectors: CheatSheet = {
  slug: 'as-1-8-scalars-and-vectors',
  topicId: 'e1b6c84c-afbc-4845-b67b-d5b6bd15720c',
  curriculumId: 'as',
  title: 'Other scalar and vector quantities',
  lessonCode: '1.8',
  chapter: { number: 1, title: 'Kinematics' },
  syllabusSections: ['1.8'],
  goal: 'Classify common quantities as scalars or vectors, and explain why.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'A quantity is a vector if its direction matters and it adds like a vector (tip to tail). Otherwise it is a scalar, and scalars add as ordinary numbers.',
      'Multiplying a vector by a scalar gives a vector in the same direction: weight $W = mg$ and momentum $p = mv$ are vectors because $g$ and $v$ are.',
    ],
    keyTerms: [
      {
        term: 'Scalars',
        source: 'paraphrase',
        text: 'distance, speed, time, mass, energy (including kinetic and potential), power, temperature, density, pressure, charge, current.',
      },
      {
        term: 'Vectors',
        source: 'paraphrase',
        text: 'displacement, velocity, acceleration, force (including weight), momentum, electric and gravitational field strength.',
      },
    ],
  },

  derivations: [],

  equations: [
    {
      name: 'Weight: scalar × vector',
      latex: String.raw`\vec{W} = m\,\vec{g}`,
    },
    {
      name: 'Momentum: scalar × vector',
      latex: String.raw`\vec{p} = m\,\vec{v}`,
    },
  ],

  symbols: [
    { symbol: 'm', meaning: 'mass (scalar)', unit: '\\mathrm{kg}' },
    {
      symbol: '\\vec{g}',
      meaning: 'acceleration of free fall (vector)',
      unit: '\\mathrm{m\\,s^{-2}}',
    },
    {
      symbol: '\\vec{v}',
      meaning: 'velocity (vector)',
      unit: '\\mathrm{m\\,s^{-1}}',
    },
  ],

  samples: [
    {
      title: 'Mass and weight',
      question: 'Explain why weight is a vector but mass is a scalar.',
      steps: [
        {
          text: 'Weight is a force: the gravitational pull on an object, which acts in a direction (downwards, towards the centre of the Earth).',
        },
        {
          text: 'Mass is the amount of matter; it has size only and is the same whichever way the object faces or moves.',
        },
      ],
      answer: 'Weight (a force) has a direction; mass has size only.',
    },
  ],

  practice: [
    { question: 'Is kinetic energy a scalar or a vector?', answer: 'Scalar' },
    { question: 'Is momentum a scalar or a vector?', answer: 'Vector' },
    {
      question: 'Pressure is force ÷ area. Is it a scalar or a vector?',
      answer: 'Scalar (it acts equally in all directions in a fluid)',
    },
    {
      question: 'Two masses of 3 kg and 4 kg are joined. What is the total mass?',
      answer: '7 kg (scalars add as numbers)',
    },
  ],

  other: {
    mistakes: [
      {
        wrong: 'Speed and velocity are the same quantity.',
        right: 'Speed is a scalar; velocity is a vector.',
      },
      {
        wrong: 'A negative value means a quantity is a vector.',
        right: 'Scalars can be negative too (temperature in °C, charge).',
      },
    ],
    tips: ['Ask: does it make sense to say which way it points? If yes, it is a vector.'],
    syllabus: ['9702 topic 1: understand the difference between scalars and vectors and give examples. Coursebook 1.8.'],
    links: [
      {
        label: 'Practice questions for this lesson',
        href: '/practice/e1b6c84c-afbc-4845-b67b-d5b6bd15720c?c=as',
      },
    ],
  },

  diagrams: [],
};
