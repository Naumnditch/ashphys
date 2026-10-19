import type { CheatSheet } from '../types';

/* AS 9702 · coursebook 2.8 The equations of motion. One page. Numbers recomputed in the tests. */

export const as28EquationsOfMotion: CheatSheet = {
  slug: 'as-2-8-equations-of-motion',
  topicId: '69f49b38-4492-521c-be78-56effb528ad2',
  curriculumId: 'as',
  title: 'The equations of motion',
  lessonCode: '2.8',
  chapter: { number: 2, title: 'Accelerated motion' },
  syllabusSections: ['2.8'],
  goal: 'Choose and use the right suvat equation for uniform acceleration in a straight line.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'For uniform (constant) acceleration in a straight line, five quantities describe the motion: $s$, $u$, $v$, $a$ and $t$. Each equation links four of them, so if you know three you can find the others.',
      'Pick the equation that leaves out the quantity you neither know nor need. Choose a positive direction and give every vector ($s$, $u$, $v$, $a$) a sign.',
    ],
    keyTerms: [{ term: 'suvat equations', source: 'paraphrase', text: 'The four equations of uniformly accelerated motion in a straight line.' }],
  },

  derivations: [],

  equations: [
    { name: 'No s', latex: String.raw`v = u + at` },
    { name: 'No a', latex: String.raw`s = \tfrac{1}{2}(u + v)\,t` },
    { name: 'No v', latex: String.raw`s = ut + \tfrac{1}{2}at^{2}` },
    { name: 'No t', latex: String.raw`v^{2} = u^{2} + 2as` },
  ],

  symbols: [
    { symbol: 's', meaning: 'displacement', unit: '\\mathrm{m}' },
    { symbol: 'u,\\ v', meaning: 'initial, final velocity', unit: '\\mathrm{m\\,s^{-1}}' },
    { symbol: 'a', meaning: 'acceleration (constant)', unit: '\\mathrm{m\\,s^{-2}}' },
  ],

  samples: [
    {
      title: 'Braking distance',
      question: 'A car travelling at 25 m s⁻¹ brakes with a constant deceleration of 5.0 m s⁻². Calculate its stopping distance.',
      steps: [
        { text: 'Known: $u = 25$, $v = 0$, $a = -5.0$. Unknown: $s$. No $t$, so use $v^2 = u^2 + 2as$:', latex: String.raw`0 = 25^{2} + 2(-5.0)\,s` },
        { text: 'Rearrange for $s$:', latex: String.raw`s = \frac{625}{10} = 62.5\ \mathrm{m}` },
      ],
      answer: String.raw`$s = 63\ \mathrm{m}$ (2 s.f.)`,
      unitCheck: String.raw`\frac{(\mathrm{m\,s^{-1}})^{2}}{\mathrm{m\,s^{-2}}} = \mathrm{m}`,
    },
  ],

  practice: [
    { question: 'A car accelerates from rest at 2.0 m s⁻² for 8.0 s. How far does it travel?', answer: '64 m' },
    { question: 'A train speeds up from 10 m s⁻¹ to 30 m s⁻¹ over 400 m. Find its acceleration.', answer: '1.0 m s⁻²' },
    { question: 'A ball is thrown straight up at 15 m s⁻¹. Find its maximum height ($g = 9.81$ m s⁻²).', answer: '11.5 m (11 m)' },
    { question: 'A cyclist at 4.0 m s⁻¹ accelerates at 1.5 m s⁻² for 6.0 s. Find the final velocity.', answer: '13 m s⁻¹' },
  ],

  other: {
    mistakes: [{ wrong: 'Make $a$ positive when the object slows down.', right: 'If $u$ is positive and it slows, $a$ is negative.' }],
    tips: ['Write “s = ?, u = …, v = …, a = …, t = …” first; the empty slot picks the equation.'],
    syllabus: ['9702 topic 2: solve problems with the suvat equations. Coursebook 2.8.'],
    links: [{ label: 'Practice questions for this lesson', href: '/practice/69f49b38-4492-521c-be78-56effb528ad2?c=as' }],
  },

  diagrams: [],
};
