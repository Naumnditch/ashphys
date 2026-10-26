import type { CheatSheet, Point } from '../types';

/* AS 9702 · coursebook 6.7 Understanding motion. One page. Numbers recomputed in the tests. */

const box = (x0: number, x1: number, y0: number, y1: number): Point[] => [
  [x0, y1],
  [x0, y0],
  [x1, y0],
  [x1, y1],
];
// Fig. 1 · two skaters push apart: equal and opposite forces, drawn from the contact face, 0.5 px per N.
const F = 120;
const K = 0.5;

export const as67UnderstandingMotion: CheatSheet = {
  slug: 'as-6-7-understanding-motion',
  topicId: 'f20d4d4e-5a12-4a02-b275-90e6d20b69b2',
  curriculumId: 'as',
  title: 'Understanding motion',
  lessonCode: '6.7',
  chapter: { number: 6, title: 'Momentum' },
  syllabusSections: ['6.7'],
  goal: 'Link Newton’s three laws to momentum, and explain conservation of momentum with the third law.',
  reviewed: '2026-10-26',

  explanation: {
    paragraphs: [
      'First law: an object stays at rest or at constant velocity unless a resultant force acts. Second law: the resultant force equals the rate of change of momentum. Third law: when A pushes on B, B pushes on A with an equal and opposite force of the same type.',
      'In a collision the two forces of a third-law pair act for the same time, so the two changes in momentum are equal and opposite. That is why the total momentum is conserved.',
    ],
    keyTerms: [{ term: 'Third-law pair', source: 'paraphrase', text: 'Equal, opposite forces of the same type, acting on two different objects.' }],
    figures: ['n3'],
  },

  derivations: [],

  equations: [
    { name: 'Second law', latex: String.raw`F = \frac{\Delta p}{\Delta t}` },
    { name: 'Third law', latex: String.raw`F_\mathrm{AB} = -F_\mathrm{BA}` },
    { name: 'So momentum is conserved', latex: String.raw`\Delta p_\mathrm{A} = -\Delta p_\mathrm{B}` },
  ],

  symbols: [
    { symbol: 'F_\\mathrm{AB}', meaning: 'force on A by B', unit: '\\mathrm{N}' },
    { symbol: '\\Delta p', meaning: 'change in momentum', unit: '\\mathrm{kg\\,m\\,s^{-1}}' },
  ],

  samples: [
    {
      title: 'Skaters push apart',
      question:
        'Skaters A (60 kg) and B (80 kg) stand at rest and push apart with a force of 120 N for 0.50 s (Fig. 1). Find each skater’s velocity and their total momentum.',
      steps: [
        {
          text: 'Equal and opposite forces for the same time:',
          latex: String.raw`\Delta p = F\,\Delta t = 120 \times 0.50 = 60\ \mathrm{kg\,m\,s^{-1}} \text{ each}`,
        },
        {
          text: 'Velocities (A to the left, negative):',
          latex: String.raw`v_\mathrm{A} = -\frac{60}{60} = -1.0\ \mathrm{m\,s^{-1}}, \quad v_\mathrm{B} = \frac{60}{80} = 0.75\ \mathrm{m\,s^{-1}}`,
        },
      ],
      answer: 'A: 1.0 m s⁻¹ left; B: 0.75 m s⁻¹ right; total momentum still zero',
    },
  ],

  practice: [
    { question: 'State Newton’s first law.', answer: 'At rest or constant velocity unless a resultant force acts' },
    { question: 'The Earth pulls a book down. What is the third-law partner of this force?', answer: 'The book’s gravitational pull on the Earth, upwards' },
    { question: 'A rocket ejects 50 kg of gas per second at 2000 m s⁻¹. Find the thrust.', answer: '1.0 × 10⁵ N' },
    { question: 'Why are a book’s weight and the table’s push on it not a third-law pair?', answer: 'They act on the same object and are different types' },
  ],

  other: {
    mistakes: [{ wrong: 'Third-law forces cancel out.', right: 'They act on different objects, so they never cancel.' }],
    tips: ['For a third-law pair, swap the names: “force of A on B” ↔ “force of B on A”.'],
    syllabus: ['9702 topic 3: Newton’s laws of motion; force and momentum. Coursebook 6.7.'],
    links: [{ label: 'Practice questions for this lesson', href: '/practice/f20d4d4e-5a12-4a02-b275-90e6d20b69b2?c=as' }],
  },

  diagrams: [
    {
      id: 'n3',
      title: 'A third-law pair',
      caption: 'Each skater pushes the other: 120 N on each, in opposite directions, for the same time.',
      alt: 'Two skaters, A of 60 kg on the left and B of 80 kg on the right, are in contact. A force of 120 N on A points left and an equal force of 120 N on B points right.',
      width: 300,
      height: 130,
      shapes: [
        { kind: 'surface', from: [10, 100], to: [290, 100], side: 'right' },
        { kind: 'polygon', points: box(100, 150, 40, 100), fill: 'soft' },
        { kind: 'polygon', points: box(100, 150, 40, 100) },
        { kind: 'polygon', points: box(150, 210, 34, 100), fill: 'soft' },
        { kind: 'polygon', points: box(150, 210, 34, 100) },
        { kind: 'label', at: [125, 82], text: 'A', anchor: 'middle' },
        { kind: 'label', at: [125, 95], text: '60 kg', anchor: 'middle', style: 'note' },
        { kind: 'label', at: [180, 82], text: 'B', anchor: 'middle' },
        { kind: 'label', at: [180, 95], text: '80 kg', anchor: 'middle', style: 'note' },
        { kind: 'arrow', from: [148, 56], to: [148 - K * F, 56], role: 'force' },
        { kind: 'arrow', from: [152, 64], to: [152 + K * F, 64], role: 'force' },
        { kind: 'label', at: [84, 60], text: 'F_{BA}', anchor: 'end', role: 'force' },
        { kind: 'label', at: [218, 68], text: 'F_{AB}', role: 'force' },
        { kind: 'label', at: [150, 20], text: 'contact', anchor: 'middle', style: 'note', role: 'muted' },
      ],
    },
  ],
};
