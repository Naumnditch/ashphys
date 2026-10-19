import type { CheatSheet } from '../types';

/* AS 9702 · coursebook 2.2 Calculating acceleration. One page. Numbers recomputed in the tests. */

export const as22CalculatingAcceleration: CheatSheet = {
  slug: 'as-2-2-calculating-acceleration',
  topicId: '91cb1c54-423a-4525-a723-99c1e9e9bf6b',
  curriculumId: 'as',
  title: 'Calculating acceleration',
  lessonCode: '2.2',
  chapter: { number: 2, title: 'Accelerated motion' },
  syllabusSections: ['2.2'],
  goal: 'Use a = (v − u)/t and rearrange it for v, u or t.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'For an object with initial velocity $u$ that reaches final velocity $v$ after a time $t$, the acceleration is the change in velocity divided by the time.',
      'The same equation, rearranged, gives the final velocity: $v = u + at$. To find the time, $t$ is in the denominator, so swap it with the lone term $a$ in one step (cross-multiplication): $t = (v - u)/a$.',
    ],
    keyTerms: [
      { term: 'Initial velocity $u$', source: 'paraphrase', text: 'The velocity at the start of the time interval.' },
      { term: 'Final velocity $v$', source: 'paraphrase', text: 'The velocity at the end of the time interval.' },
    ],
  },

  derivations: [],

  equations: [
    { name: 'Acceleration', latex: String.raw`a = \frac{v - u}{t}` },
    { name: 'Final velocity', latex: String.raw`v = u + at` },
    { name: 'Time (swap t and a)', latex: String.raw`t = \frac{v - u}{a}` },
  ],

  symbols: [
    { symbol: 'u', meaning: 'initial velocity', unit: '\\mathrm{m\\,s^{-1}}' },
    { symbol: 'v', meaning: 'final velocity', unit: '\\mathrm{m\\,s^{-1}}' },
    { symbol: 't', meaning: 'time taken', unit: '\\mathrm{s}' },
  ],

  samples: [
    {
      title: 'Velocity and time',
      question:
        'A car moving at 5.0 m s⁻¹ accelerates uniformly at 2.0 m s⁻². Calculate (a) its velocity after 6.0 s and (b) the time it takes to reach 25 m s⁻¹.',
      steps: [
        { text: '(a) Final velocity:', latex: String.raw`v = u + at = 5.0 + 2.0 \times 6.0 = 17\ \mathrm{m\,s^{-1}}` },
        { text: '(b) $t$ is in the denominator: swap $t$ and $a$.', latex: String.raw`t = \frac{v - u}{a} = \frac{25 - 5.0}{2.0} = 10\ \mathrm{s}` },
      ],
      answer: '(a) 17 m s⁻¹ (b) 10 s',
      unitCheck: String.raw`\frac{\mathrm{m\,s^{-1}}}{\mathrm{m\,s^{-2}}} = \mathrm{s}`,
    },
  ],

  practice: [
    { question: 'A train slows from 20 m s⁻¹ to 8.0 m s⁻¹ in 6.0 s. Calculate its acceleration.', answer: '−2.0 m s⁻²' },
    { question: 'A stone falls from rest with $a = 9.81$ m s⁻². Find its velocity after 1.5 s.', answer: '14.7 m s⁻¹ (15 m s⁻¹)' },
    { question: 'A plane needs 75 m s⁻¹ to take off and accelerates from rest at 2.5 m s⁻². How long does it take?', answer: '30 s' },
    { question: 'A cyclist at 6.0 m s⁻¹ decelerates at 0.80 m s⁻². How long until they stop?', answer: '7.5 s' },
  ],

  other: {
    mistakes: [
      { wrong: 'Use $v - u$ the wrong way round.', right: 'Always final minus initial; a negative answer means slowing down.' },
      { wrong: 'Use $a = +0.80$ m s⁻² for a deceleration.', right: 'Use $a = -0.80$ m s⁻², or the time comes out negative.' },
    ],
    tips: ['List $u$, $v$, $a$, $t$ with units before you substitute.'],
    syllabus: ['9702 topic 2: define and use acceleration. Coursebook 2.2.'],
    links: [{ label: 'Practice questions for this lesson', href: '/practice/91cb1c54-423a-4525-a723-99c1e9e9bf6b?c=as' }],
  },

  diagrams: [],
};
