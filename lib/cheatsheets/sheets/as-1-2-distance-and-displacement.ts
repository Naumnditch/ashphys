import type { CheatSheet, Point } from '../types';

/* AS 9702 · coursebook 1.2 Distance and displacement, scalar and vector. One page. */

// 40 px per km: 3.0 km east, then 4.0 km north.
const O: Point = [60, 200];
const E: Point = [180, 200];
const NE: Point = [180, 40];

export const as12DistanceDisplacement: CheatSheet = {
  slug: 'as-1-2-distance-and-displacement',
  topicId: 'cbfde8f1-1390-4f8a-b259-ff4ad9ad516e',
  curriculumId: 'as',
  title: 'Distance and displacement',
  lessonCode: '1.2',
  chapter: { number: 1, title: 'Kinematics' },
  syllabusSections: ['1.2'],
  goal: 'Tell distance from displacement and scalars from vectors, and find a displacement from two perpendicular moves.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'Distance is the total length of the path travelled: a scalar. Displacement is the straight-line distance from the start to the finish in a stated direction: a vector.',
      'Scalars have size only (distance, speed, time, mass, energy). Vectors have size and direction (displacement, velocity, acceleration, force), so a vector answer needs a direction.',
    ],
    keyTerms: [
      {
        term: 'Displacement',
        source: 'paraphrase',
        text: 'The distance moved in a particular direction from a starting point.',
      },
      {
        term: 'Scalar and vector',
        source: 'paraphrase',
        text: 'A scalar has magnitude only; a vector has magnitude and direction.',
      },
    ],
    figures: ['walk'],
  },

  derivations: [],

  equations: [
    {
      name: 'Two perpendicular moves',
      latex: String.raw`s = \sqrt{x^{2} + y^{2}}`,
    },
    { name: 'Direction', latex: String.raw`\tan\theta = \frac{y}{x}` },
  ],

  symbols: [
    { symbol: 's', meaning: 'size of the displacement', unit: '\\mathrm{m}' },
    {
      symbol: 'x,\\ y',
      meaning: 'perpendicular parts of the journey',
      unit: '\\mathrm{m}',
    },
    {
      symbol: '\\theta',
      meaning: 'angle from the x direction',
      unit: '^\\circ',
    },
  ],

  samples: [
    {
      title: 'A walk east then north',
      question: 'A walker goes 3.0 km east and then 4.0 km north. Calculate the distance walked and the displacement.',
      steps: [
        {
          text: 'Distance adds the path lengths:',
          latex: String.raw`d = 3.0 + 4.0 = 7.0\ \mathrm{km}`,
        },
        {
          text: 'Displacement is the straight line from start to finish:',
          latex: String.raw`s = \sqrt{3.0^{2} + 4.0^{2}} = 5.0\ \mathrm{km}`,
        },
        {
          text: 'Direction:',
          latex: String.raw`\theta = \tan^{-1}\frac{4.0}{3.0} = 53^\circ \text{ north of east}`,
        },
      ],
      answer: 'distance 7.0 km; displacement 5.0 km at 53° north of east',
    },
  ],

  practice: [
    {
      question: 'A runner completes one lap of a 400 m track. State the distance and the displacement.',
      answer: '400 m; zero',
    },
    {
      question: 'Sort into scalars and vectors: mass, weight, time, velocity.',
      answer: 'scalars: mass, time; vectors: weight, velocity',
    },
    {
      question: 'A walker goes 6.0 m north and then 8.0 m west. Calculate the displacement.',
      answer: '10 m at 53° west of north',
    },
    {
      question: 'A car drives 5.0 km east, then 2.0 km west. State the distance and the displacement.',
      answer: '7.0 km; 3.0 km east',
    },
  ],

  other: {
    mistakes: [
      {
        wrong: 'Displacement can never be zero if you moved.',
        right: 'Back at the start, the displacement is zero; the distance is not.',
      },
    ],
    tips: ['Sketch the path; draw the displacement from start to end and give its direction.'],
    syllabus: ['9702 topics 1 and 2: scalars and vectors; define and use displacement. Coursebook 1.2.'],
    links: [
      {
        label: 'Practice questions for this lesson',
        href: '/practice/cbfde8f1-1390-4f8a-b259-ff4ad9ad516e?c=as',
      },
    ],
  },

  diagrams: [
    {
      id: 'walk',
      title: 'Distance or displacement',
      caption: 'The path (grey) is 7.0 km long; the displacement (black) is the 5.0 km straight line from start to finish.',
      alt: 'A path 3.0 km east then 4.0 km north drawn in grey, and a black arrow from the start to the finish, the displacement, at angle theta north of east.',
      width: 300,
      height: 230,
      shapes: [
        { kind: 'arrow', from: O, to: E, role: 'muted' },
        { kind: 'arrow', from: E, to: NE, role: 'muted' },
        { kind: 'arrow', from: O, to: NE, role: 'ink' },
        {
          kind: 'label',
          at: [120, 222],
          text: '3.0 km',
          anchor: 'middle',
          style: 'note',
          role: 'muted',
        },
        {
          kind: 'label',
          at: [190, 124],
          text: '4.0 km',
          style: 'note',
          role: 'muted',
        },
        {
          kind: 'label',
          at: [104, 112],
          text: 's = 5.0 km',
          anchor: 'end',
          style: 'note',
        },
        { kind: 'arc', centre: O, radius: 34, from: 0, to: 53.13 },
        { kind: 'label', at: [102, 190], text: 'θ' },
        { kind: 'dot', at: O, radius: 3 },
        {
          kind: 'label',
          at: [O[0] - 6, O[1] + 4],
          text: 'start',
          anchor: 'end',
          style: 'note',
          role: 'muted',
        },
        { kind: 'arrow', from: [262, 70], to: [262, 30], role: 'ink' },
        {
          kind: 'label',
          at: [262, 22],
          text: 'N',
          anchor: 'middle',
          style: 'note',
        },
      ],
    },
  ],
};
