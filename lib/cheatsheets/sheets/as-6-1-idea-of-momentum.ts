import type { CheatSheet } from '../types';

/* AS 9702 · coursebook 6.1 The idea of momentum. One page. Numbers recomputed in the tests. */

// Fig. 1 · a ball rebounds from a wall; 2.4 px per m s⁻¹ (25 → 60 px, 15 → 36 px).
const K = 2.4;

export const as61IdeaOfMomentum: CheatSheet = {
  slug: 'as-6-1-idea-of-momentum',
  topicId: '196ffab0-6cca-4898-8909-a56000ff9fd7',
  curriculumId: 'as',
  title: 'The idea of momentum',
  lessonCode: '6.1',
  chapter: { number: 6, title: 'Momentum' },
  syllabusSections: ['6.1'],
  goal: 'Calculate momentum and the change in momentum, with the direction as a sign.',
  reviewed: '2026-10-26',

  explanation: {
    paragraphs: [
      'Momentum is mass × velocity. It is a vector: choose a positive direction, and an object moving the other way has negative momentum. Its unit is kg m s⁻¹ (the same as N s).',
      'When an object rebounds, its velocity changes sign, so the change in momentum is larger than either momentum on its own: $\\Delta p = mv - mu$ with $v$ negative.',
    ],
    keyTerms: [{ term: 'Linear momentum', source: 'paraphrase', text: 'The product of an object’s mass and its velocity.' }],
    figures: ['rebound'],
  },

  derivations: [],

  equations: [
    { name: 'Momentum', latex: String.raw`p = mv` },
    { name: 'Change in momentum', latex: String.raw`\Delta p = mv - mu` },
  ],

  symbols: [
    { symbol: 'p', meaning: 'momentum', unit: '\\mathrm{kg\\,m\\,s^{-1}}' },
    { symbol: 'm', meaning: 'mass', unit: '\\mathrm{kg}' },
    { symbol: 'u,\\ v', meaning: 'velocity before, after', unit: '\\mathrm{m\\,s^{-1}}' },
  ],

  samples: [
    {
      title: 'A rebound',
      question: 'A 0.060 kg ball hits a wall at 25 m s⁻¹ and rebounds along the same line at 15 m s⁻¹ (Fig. 1). Calculate the change in its momentum.',
      steps: [
        { text: 'Towards the wall is positive, so $u = +25$ and $v = -15$ m s⁻¹:', latex: String.raw`\Delta p = m(v - u) = 0.060\,(-15 - 25)` },
        { text: 'Evaluate:', latex: String.raw`\Delta p = -2.4\ \mathrm{kg\,m\,s^{-1}}` },
      ],
      answer: '2.4 kg m s⁻¹, directed away from the wall',
      unitCheck: String.raw`\mathrm{kg} \times \mathrm{m\,s^{-1}} = \mathrm{kg\,m\,s^{-1}}`,
    },
  ],

  practice: [
    { question: 'Find the momentum of a 70 kg runner moving at 8.0 m s⁻¹.', answer: '560 kg m s⁻¹' },
    { question: 'A 0.40 kg ball has momentum 6.0 kg m s⁻¹. Find its speed.', answer: '15 m s⁻¹' },
    { question: 'A 2.0 kg trolley moves at +3.0 m s⁻¹ and a 1.5 kg trolley at −4.0 m s⁻¹. Find their total momentum.', answer: 'Zero' },
    { question: 'A 0.20 kg ball hits the floor at 5.0 m s⁻¹ and bounces up at 3.0 m s⁻¹. Find the size of its change in momentum.', answer: '1.6 kg m s⁻¹' },
  ],

  other: {
    mistakes: [
      { wrong: 'Rebound: $\\Delta p = m(25 - 15)$', right: 'The velocity reverses: $\\Delta p = m(-15 - 25)$' },
      { wrong: 'Add momenta as positive numbers.', right: 'Give each a sign for its direction first.' },
    ],
    tips: ['Draw an arrow for your positive direction before you write any velocity.'],
    syllabus: ['9702 topic 3: define and use linear momentum. Coursebook 6.1.'],
    links: [{ label: 'Practice questions for this lesson', href: '/practice/196ffab0-6cca-4898-8909-a56000ff9fd7?c=as' }],
  },

  diagrams: [
    {
      id: 'rebound',
      title: 'A ball rebounds from a wall',
      caption: 'The velocity changes sign, so $\\Delta p = m(v - u)$ is bigger than $mu$ or $mv$.',
      alt: 'Before: a ball moves to the right towards a wall at 25 m/s. After: the ball moves to the left away from the wall at 15 m/s, shown by a shorter arrow.',
      width: 300,
      height: 170,
      shapes: [
        { kind: 'surface', from: [262, 14], to: [262, 166], side: 'left' },
        { kind: 'label', at: [16, 54], text: 'before', style: 'note', role: 'muted' },
        { kind: 'label', at: [16, 134], text: 'after', style: 'note', role: 'muted' },
        { kind: 'circle', centre: [150, 50], radius: 12, fill: 'soft' },
        { kind: 'circle', centre: [150, 50], radius: 12 },
        { kind: 'arrow', from: [164, 50], to: [164 + K * 25, 50], role: 'velocity' },
        { kind: 'label', at: [194, 38], text: '+25 m s⁻¹', anchor: 'middle', style: 'note', role: 'velocity' },
        { kind: 'circle', centre: [150, 130], radius: 12, fill: 'soft' },
        { kind: 'circle', centre: [150, 130], radius: 12 },
        { kind: 'arrow', from: [136, 130], to: [136 - K * 15, 130], role: 'velocity' },
        { kind: 'label', at: [114, 116], text: '−15 m s⁻¹', anchor: 'middle', style: 'note', role: 'velocity' },
        { kind: 'arrow', from: [60, 90], to: [96, 90], role: 'muted' },
        { kind: 'label', at: [102, 94], text: '+ direction', style: 'note', role: 'muted' },
      ],
    },
  ],
};
