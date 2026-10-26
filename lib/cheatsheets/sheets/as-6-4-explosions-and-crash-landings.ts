import type { CheatSheet, Point } from '../types';

/* AS 9702 · coursebook 6.4 Explosions and crash-landings. One page. Numbers recomputed in the tests. */

const box = (x0: number, x1: number, y0: number, y1: number): Point[] => [
  [x0, y1],
  [x0, y0],
  [x1, y0],
  [x1, y1],
];

export const as64ExplosionsCrashLandings: CheatSheet = {
  slug: 'as-6-4-explosions-and-crash-landings',
  topicId: '06f5a312-80c6-4307-af2d-783a8611a0f6',
  curriculumId: 'as',
  title: 'Explosions and crash-landings',
  lessonCode: '6.4',
  chapter: { number: 6, title: 'Momentum' },
  syllabusSections: ['6.4'],
  goal: 'Use zero total momentum to find recoil velocities, and explain where momentum goes in a crash-landing.',
  reviewed: '2026-10-26',

  explanation: {
    paragraphs: [
      'An object at rest has zero momentum. When it explodes or pushes apart, the pieces still have zero total momentum: they fly apart with equal and opposite momenta. Kinetic energy is created from chemical or elastic potential energy, so it is not conserved.',
      'When a falling object lands and stops, its momentum is not lost: it is passed to the Earth. The Earth’s mass is so large that its change in velocity is far too small to notice.',
    ],
    keyTerms: [{ term: 'Recoil', source: 'paraphrase', text: 'The backward motion of one part when another is pushed or fired forwards.' }],
    figures: ['recoil'],
  },

  derivations: [],

  equations: [
    { name: 'From rest', latex: String.raw`0 = m_1v_1 + m_2v_2` },
    { name: 'Recoil velocity', latex: String.raw`v_2 = -\frac{m_1v_1}{m_2}` },
  ],

  symbols: [
    { symbol: 'm', meaning: 'mass of each part', unit: '\\mathrm{kg}' },
    { symbol: 'v', meaning: 'velocity of each part after', unit: '\\mathrm{m\\,s^{-1}}' },
  ],

  samples: [
    {
      title: 'Rifle recoil',
      question: 'A 4.0 kg rifle fires a 0.010 kg bullet at 400 m s⁻¹. Calculate the recoil velocity of the rifle and the total kinetic energy released.',
      steps: [
        { text: 'Total momentum stays zero:', latex: String.raw`v_2 = -\frac{0.010 \times 400}{4.0} = -1.0\ \mathrm{m\,s^{-1}}` },
        {
          text: 'Kinetic energy of both parts:',
          latex: String.raw`E_\mathrm{k} = \tfrac{1}{2}(0.010)(400)^{2} + \tfrac{1}{2}(4.0)(1.0)^{2} = 800 + 2.0 = 802\ \mathrm{J}`,
        },
      ],
      answer: '1.0 m s⁻¹ backwards; 802 J (8.0 × 10² J)',
      unitCheck: String.raw`\frac{\mathrm{kg\,m\,s^{-1}}}{\mathrm{kg}} = \mathrm{m\,s^{-1}}`,
    },
  ],

  practice: [
    { question: 'An object at rest explodes into pieces. What is their total momentum?', answer: 'Zero' },
    {
      question: 'Skaters of 60 kg and 40 kg push apart from rest. The 40 kg skater moves at 3.0 m s⁻¹. Find the other’s velocity.',
      answer: '2.0 m s⁻¹ the opposite way',
    },
    { question: 'A 2.0 kg object at rest splits into 0.50 kg at 12 m s⁻¹ and the rest. Find the speed of the rest.', answer: '4.0 m s⁻¹ the opposite way' },
    { question: 'A 0.50 kg ball hits the ground at 6.0 m s⁻¹ and stops. What happens to its 3.0 kg m s⁻¹ of momentum?', answer: 'It goes to the Earth' },
  ],

  other: {
    mistakes: [{ wrong: 'Kinetic energy is conserved in an explosion.', right: 'It increases; it comes from stored energy.' }],
    tips: ['The heavier part always moves off more slowly: equal momenta, unequal masses.'],
    syllabus: ['9702 topic 3: apply conservation of momentum, including changes in kinetic energy. Coursebook 6.4.'],
    links: [{ label: 'Practice questions for this lesson', href: '/practice/06f5a312-80c6-4307-af2d-783a8611a0f6?c=as' }],
  },

  diagrams: [
    {
      id: 'recoil',
      title: 'Pushing apart from rest',
      caption: 'Equal and opposite momenta: the small mass moves fast, the large mass slowly.',
      alt: 'Before: a large block and a small block touch, at rest. After: the large block moves left slowly (short arrow) and the small block moves right quickly (long arrow).',
      width: 300,
      height: 160,
      shapes: [
        { kind: 'surface', from: [10, 70], to: [290, 70], side: 'right' },
        { kind: 'surface', from: [10, 150], to: [290, 150], side: 'right' },
        { kind: 'label', at: [12, 24], text: 'before: at rest, p = 0', style: 'note', role: 'muted' },
        { kind: 'label', at: [12, 104], text: 'after', style: 'note', role: 'muted' },
        { kind: 'polygon', points: box(110, 170, 38, 70), fill: 'soft' },
        { kind: 'polygon', points: box(110, 170, 38, 70) },
        { kind: 'polygon', points: box(170, 190, 56, 70), fill: 'soft' },
        { kind: 'polygon', points: box(170, 190, 56, 70) },
        { kind: 'label', at: [140, 60], text: 'M', anchor: 'middle' },
        { kind: 'polygon', points: box(70, 130, 118, 150), fill: 'soft' },
        { kind: 'polygon', points: box(70, 130, 118, 150) },
        { kind: 'polygon', points: box(210, 230, 136, 150), fill: 'soft' },
        { kind: 'polygon', points: box(210, 230, 136, 150) },
        { kind: 'label', at: [100, 140], text: 'M', anchor: 'middle' },
        { kind: 'arrow', from: [68, 134], to: [44, 134], role: 'velocity' },
        { kind: 'label', at: [56, 126], text: 'V', anchor: 'middle', role: 'velocity' },
        { kind: 'arrow', from: [232, 143], to: [288, 143], role: 'velocity' },
        { kind: 'label', at: [260, 134], text: 'v', anchor: 'middle', role: 'velocity' },
        { kind: 'label', at: [220, 130], text: 'm', anchor: 'middle' },
      ],
    },
  ],
};
