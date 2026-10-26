import type { CheatSheet } from '../types';

/* AS 9702 · coursebook 6.6 Momentum and Newton's laws of motion. One page. Numbers recomputed in the tests. */

export const as66MomentumNewtonsLaws: CheatSheet = {
  slug: 'as-6-6-momentum-and-newtons-laws',
  topicId: '291b09fb-6132-5b3e-9e36-6e892aedc194',
  curriculumId: 'as',
  title: 'Momentum and Newton’s laws of motion',
  lessonCode: '6.6',
  chapter: { number: 6, title: 'Momentum' },
  syllabusSections: ['6.6'],
  goal: 'Use force = rate of change of momentum, including for collisions and streams of fluid.',
  reviewed: '2026-10-26',

  explanation: {
    paragraphs: [
      'Newton’s second law in its general form: the resultant force on an object equals its rate of change of momentum. For a constant mass, $\\Delta p/\\Delta t = m\\,\\Delta v/\\Delta t = ma$.',
      'Rearranged, $F\\Delta t = \\Delta p$: the same change in momentum over a longer time needs a smaller force. That is why crumple zones, airbags and bending your knees on landing protect you.',
    ],
    keyTerms: [{ term: 'Force (Newton’s second law)', source: 'paraphrase', text: 'The resultant force on an object equals its rate of change of momentum.' }],
  },

  derivations: [],

  equations: [
    { name: 'Newton’s second law', latex: String.raw`F = \frac{\Delta p}{\Delta t}` },
    { name: 'Constant mass', latex: String.raw`F = ma` },
    { name: 'Rearranged', latex: String.raw`F\,\Delta t = \Delta p` },
  ],

  symbols: [
    { symbol: 'F', meaning: 'resultant force', unit: '\\mathrm{N}' },
    { symbol: '\\Delta p', meaning: 'change in momentum', unit: '\\mathrm{kg\\,m\\,s^{-1}}' },
    { symbol: '\\Delta t', meaning: 'time taken', unit: '\\mathrm{s}' },
  ],

  samples: [
    {
      title: 'Hitting a ball',
      question:
        'A 0.15 kg ball arrives at a bat at 20 m s⁻¹ and leaves in the opposite direction at 30 m s⁻¹. Contact lasts 0.010 s. Calculate the average force on the ball.',
      steps: [
        {
          text: 'Return direction positive, so $u = -20$ m s⁻¹:',
          latex: String.raw`\Delta p = 0.15\,(30 - (-20)) = 7.5\ \mathrm{kg\,m\,s^{-1}}`,
        },
        { text: 'Rate of change of momentum:', latex: String.raw`F = \frac{7.5}{0.010} = 750\ \mathrm{N}` },
      ],
      answer: '750 N, in the direction the ball leaves',
      unitCheck: String.raw`\frac{\mathrm{kg\,m\,s^{-1}}}{\mathrm{s}} = \mathrm{kg\,m\,s^{-2}} = \mathrm{N}`,
    },
  ],

  practice: [
    { question: 'A 1000 kg car goes from rest to 20 m s⁻¹ in 8.0 s. Find the average resultant force.', answer: '2500 N' },
    { question: 'A hose sends 2.0 kg of water per second at 15 m s⁻¹ onto a wall, where it stops. Find the force on the wall.', answer: '30 N' },
    { question: 'A momentum change of 12 kg m s⁻¹ takes 0.040 s. Find the average force.', answer: '300 N' },
    { question: 'Why do you bend your knees when you land from a jump?', answer: 'Longer stopping time, so a smaller force for the same Δp' },
  ],

  other: {
    mistakes: [{ wrong: 'Use $F = ma$ for a stream of fluid.', right: 'Use $F = \\Delta p/\\Delta t$: mass per second × change in velocity.' }],
    tips: ['Check units: kg m s⁻¹ per second is kg m s⁻², which is N.'],
    syllabus: ['9702 topic 3: define and use force as rate of change of momentum. Coursebook 6.6.'],
    links: [{ label: 'Practice questions for this lesson', href: '/practice/291b09fb-6132-5b3e-9e36-6e892aedc194?c=as' }],
  },

  diagrams: [],
};
