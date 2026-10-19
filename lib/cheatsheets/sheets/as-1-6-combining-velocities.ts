import type { CheatSheet, Point } from '../types';
import { along, angleOf } from '../draw';

/* AS 9702 · coursebook 1.6 Combining velocities. One page. */

// 40 px per m s⁻¹: boat 3.0 m s⁻¹ across, current 1.5 m s⁻¹ downstream.
const S: Point = [90, 196];
const head: Point = [90, 76];
const res: Point = [150, 76];

export const as16CombiningVelocities: CheatSheet = {
  slug: 'as-1-6-combining-velocities',
  topicId: '0e10f0fa-b4fd-4e02-beba-8c15b05746c1',
  curriculumId: 'as',
  title: 'Combining velocities',
  lessonCode: '1.6',
  chapter: { number: 1, title: 'Kinematics' },
  syllabusSections: ['1.6'],
  goal: 'Add velocities as vectors, for boats crossing rivers and aircraft in a wind.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'When something moves through a medium that is itself moving (a boat in a current, a plane in a wind), its velocity relative to the ground is the vector sum of the two velocities.',
      'The parts act independently: the time to cross a river depends only on the velocity across it, and the current only carries the boat downstream while it crosses.',
    ],
    keyTerms: [
      {
        term: 'Resultant velocity',
        source: 'paraphrase',
        text: 'The vector sum of the velocities: the actual velocity relative to the ground.',
      },
    ],
    figures: ['river'],
  },

  derivations: [],

  equations: [
    {
      name: 'Resultant (perpendicular)',
      latex: String.raw`v = \sqrt{v_\mathrm{b}^{2} + v_\mathrm{c}^{2}}`,
    },
    {
      name: 'Angle from straight across',
      latex: String.raw`\tan\theta = \frac{v_\mathrm{c}}{v_\mathrm{b}}`,
    },
    { name: 'Time to cross', latex: String.raw`t = \frac{w}{v_\mathrm{b}}` },
  ],

  symbols: [
    {
      symbol: 'v_\\mathrm{b}',
      meaning: 'boat velocity through the water',
      unit: '\\mathrm{m\\,s^{-1}}',
    },
    {
      symbol: 'v_\\mathrm{c}',
      meaning: 'velocity of the current',
      unit: '\\mathrm{m\\,s^{-1}}',
    },
    { symbol: 'w', meaning: 'width of the river', unit: '\\mathrm{m}' },
  ],

  samples: [
    {
      title: 'Crossing a river',
      question:
        'A boat heads straight across a river 60 m wide at 3.0 m s⁻¹ through the water. The current flows at 1.5 m s⁻¹. Calculate the boat’s resultant velocity, the time to cross and how far downstream it lands.',
      steps: [
        {
          text: 'Resultant velocity:',
          latex: String.raw`v = \sqrt{3.0^{2} + 1.5^{2}} = 3.35\ \mathrm{m\,s^{-1}}, \quad \theta = \tan^{-1}\frac{1.5}{3.0} = 27^\circ`,
        },
        {
          text: 'Only the across-velocity crosses the river; meanwhile the current carries it downstream:',
          latex: String.raw`t = \frac{60}{3.0} = 20\ \mathrm{s}, \qquad x = 1.5 \times 20 = 30\ \mathrm{m}`,
        },
      ],
      answer: '3.4 m s⁻¹ at 27° downstream of straight across; 20 s; 30 m downstream',
      unitCheck: String.raw`\frac{\mathrm{m}}{\mathrm{m\,s^{-1}}} = \mathrm{s}`,
    },
  ],

  practice: [
    {
      question: 'A plane flies north at 200 m s⁻¹ in a wind blowing east at 50 m s⁻¹. Find its resultant velocity.',
      answer: '206 m s⁻¹ at 14° east of north',
    },
    {
      question: 'To land directly opposite, at what angle upstream must the sample’s boat head? What is its speed across?',
      answer: '30° upstream; 2.6 m s⁻¹',
    },
    {
      question: 'A passenger walks forwards at 1.5 m s⁻¹ in a train moving at 20 m s⁻¹. Find their speed over the ground.',
      answer: '21.5 m s⁻¹',
    },
    {
      question: 'A swimmer crosses a 48 m river at 1.2 m s⁻¹ across a 0.50 m s⁻¹ current. Find the crossing time.',
      answer: '40 s',
    },
  ],

  other: {
    mistakes: [
      {
        wrong: 'Use the resultant speed to find the crossing time.',
        right: 'Use only the velocity component across the river.',
      },
    ],
    tips: ['Perpendicular velocities add by Pythagoras, not arithmetic. Say which angle you give.'],
    syllabus: ['9702 topic 1: add coplanar vectors (velocities). Coursebook 1.6.'],
    links: [
      {
        label: 'Practice questions for this lesson',
        href: '/practice/0e10f0fa-b4fd-4e02-beba-8c15b05746c1?c=as',
      },
    ],
  },

  diagrams: [
    {
      id: 'river',
      title: 'A boat crossing a river',
      caption: 'The boat heads straight across ($v_\\mathrm{b}$); the current ($v_\\mathrm{c}$) carries it downstream, so it actually moves along $v$.',
      alt: 'Top view of a river between two banks. From the near bank, the boat velocity v_b points straight across, the current v_c points downstream from its tip, and the resultant v runs diagonally from the start to the end of v_c, at angle theta to straight across.',
      width: 300,
      height: 230,
      shapes: [
        { kind: 'surface', from: [20, 40], to: [280, 40], side: 'left' },
        { kind: 'surface', from: [20, 206], to: [280, 206], side: 'right' },
        { kind: 'arrow', from: S, to: head, role: 'velocity', dashed: true },
        { kind: 'arrow', from: head, to: res, role: 'velocity', dashed: true },
        { kind: 'arrow', from: S, to: res, role: 'velocity' },
        {
          kind: 'label',
          at: [82, 140],
          text: 'v_b',
          anchor: 'end',
          role: 'velocity',
        },
        {
          kind: 'label',
          at: [120, 66],
          text: 'v_c',
          anchor: 'middle',
          role: 'velocity',
        },
        { kind: 'label', at: [130, 150], text: 'v', role: 'velocity' },
        { kind: 'arc', centre: S, radius: 36, from: 90, to: angleOf(S, res) },
        {
          kind: 'label',
          at: along(S, [0.25, -1], 44),
          text: 'θ',
          anchor: 'middle',
        },
        { kind: 'arrow', from: [200, 160], to: [260, 160], role: 'muted' },
        {
          kind: 'label',
          at: [230, 150],
          text: 'current',
          anchor: 'middle',
          style: 'note',
          role: 'muted',
        },
      ],
    },
  ],
};
