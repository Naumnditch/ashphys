import type { CheatSheet, Point } from '../types';
import { along, dir } from '../draw';

/* AS 9702 · coursebook 1.5 Combining displacements (the shared Prep "Vectors" lesson). One page. */

// Fig. 1 · resolving v at 30° into components.
const O: Point = [50, 190];
const TH = 30;
const tip = along(O, dir(TH), 200);

export const as15CombiningDisplacements: CheatSheet = {
  slug: 'as-1-5-combining-displacements',
  topicId: '11e7164b-e47d-4b4d-8bad-1002c892ba20',
  curriculumId: 'as',
  title: 'Combining displacements',
  lessonCode: '1.5',
  chapter: { number: 1, title: 'Kinematics' },
  syllabusSections: ['1.5'],
  goal: 'Add two vectors tip to tail, and split one vector into two perpendicular components.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'To add vectors, draw them tip to tail: the resultant runs from the start of the first to the end of the last. For two perpendicular vectors use Pythagoras and $\\tan\\theta$; for any other angle use a scale drawing.',
      'Resolving does the reverse: one vector at angle θ to the x direction is replaced by two perpendicular components that together have the same effect.',
    ],
    keyTerms: [
      {
        term: 'Resultant',
        source: 'paraphrase',
        text: 'The single vector with the same effect as two or more vectors together.',
      },
      {
        term: 'Components',
        source: 'paraphrase',
        text: 'Two perpendicular vectors that add up to the original vector.',
      },
    ],
    figures: ['resolve'],
  },

  derivations: [],

  equations: [
    {
      name: 'Resultant of perpendicular vectors',
      latex: String.raw`R = \sqrt{a^{2} + b^{2}}`,
    },
    { name: 'Its direction', latex: String.raw`\tan\theta = \frac{b}{a}` },
    {
      name: 'Components',
      latex: String.raw`v_x = v\cos\theta,\ \ v_y = v\sin\theta`,
    },
  ],

  symbols: [
    {
      symbol: 'a,\\ b',
      meaning: 'two perpendicular vectors',
      unit: '\\text{(their unit)}',
    },
    { symbol: 'R', meaning: 'resultant', unit: '\\text{(same unit)}' },
    { symbol: '\\theta', meaning: 'angle to the x direction', unit: '^\\circ' },
  ],

  samples: [
    {
      title: 'Resolving a velocity',
      question: 'A ball is kicked at 20 m s⁻¹ at 30° above the horizontal. Calculate the horizontal and vertical components of its velocity.',
      steps: [
        {
          text: 'Horizontal (adjacent to θ):',
          latex: String.raw`v_x = 20\cos 30^\circ = 17.3\ \mathrm{m\,s^{-1}}`,
        },
        {
          text: 'Vertical (opposite θ):',
          latex: String.raw`v_y = 20\sin 30^\circ = 10.0\ \mathrm{m\,s^{-1}}`,
        },
      ],
      answer: '17 m s⁻¹ horizontally, 10 m s⁻¹ vertically',
      unitCheck: String.raw`\text{components keep the vector's unit: } \mathrm{m\,s^{-1}}`,
    },
  ],

  practice: [
    {
      question: 'Find the resultant of 12 N east and 5.0 N north.',
      answer: '13 N at 23° north of east',
    },
    {
      question: 'Resolve a 50 N force at 40° above the horizontal.',
      answer: '38 N horizontal, 32 N vertical',
    },
    {
      question: 'Two forces of 3 N and 4 N act on a point. What are the largest and smallest possible resultants?',
      answer: '7 N and 1 N',
    },
    {
      question: 'Find the vertical component of a velocity of 8.0 m s⁻¹ at 60° to the horizontal.',
      answer: '6.9 m s⁻¹',
    },
  ],

  other: {
    mistakes: [
      {
        wrong: 'Add the sizes of two vectors at an angle (3 N + 4 N = 7 N).',
        right: 'Only when they point the same way. At 90°: √(3² + 4²) = 5 N.',
      },
      {
        wrong: 'Use sin for the side next to the angle.',
        right: 'Adjacent side: cos θ. Opposite side: sin θ.',
      },
    ],
    tips: ['Always draw the vector triangle and mark θ before choosing sin or cos.'],
    syllabus: ['9702 topic 1: add and subtract coplanar vectors; represent a vector as two perpendicular components. Coursebook 1.5.'],
    links: [
      {
        label: 'Vector Addition Sandbox (simulation)',
        href: '/simulations/vector-addition',
      },
      {
        label: 'Practice questions for this lesson',
        href: '/practice/11e7164b-e47d-4b4d-8bad-1002c892ba20?c=as',
      },
    ],
  },

  diagrams: [
    {
      id: 'resolve',
      title: 'Resolving into components',
      caption: 'v cos θ is adjacent to the angle; v sin θ is opposite it.',
      alt: 'A velocity v at angle theta above the horizontal, with a dashed horizontal component v cos theta and a dashed vertical component v sin theta forming a right-angled triangle.',
      width: 290,
      height: 220,
      shapes: [
        { kind: 'arrow', from: O, to: tip, role: 'velocity' },
        {
          kind: 'arrow',
          from: O,
          to: [tip[0], O[1]],
          role: 'velocity',
          dashed: true,
        },
        {
          kind: 'arrow',
          from: [tip[0], O[1]],
          to: tip,
          role: 'velocity',
          dashed: true,
        },
        {
          kind: 'rightAngle',
          at: [tip[0], O[1]],
          a: [-1, 0],
          b: [0, -1],
          size: 9,
        },
        { kind: 'arc', centre: O, radius: 40, from: 0, to: TH },
        {
          kind: 'label',
          at: along(O, dir(TH / 2), 52),
          text: 'θ',
          anchor: 'middle',
        },
        {
          kind: 'label',
          at: [130, 96],
          text: 'v',
          role: 'velocity',
          anchor: 'end',
        },
        {
          kind: 'label',
          at: [(O[0] + tip[0]) / 2, O[1] + 22],
          text: 'v |cos| θ',
          anchor: 'middle',
          role: 'velocity',
        },
        {
          kind: 'label',
          at: [tip[0] + 8, (O[1] + tip[1]) / 2 + 6],
          text: 'v |sin| θ',
          role: 'velocity',
        },
      ],
    },
  ],
};
