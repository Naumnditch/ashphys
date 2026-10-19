import type { CheatSheet, Point } from '../types';

/* AS 9702 · coursebook 2.7 Determining velocity and acceleration in the laboratory. One page. */

// Tape chart: strips of 5 spaces (0.10 s) side by side, 46 px per 0.10 s and 20 px per cm, base at y = 180.
const BASE = 180;
const LENGTHS = [2.0, 4.0, 6.0];
const xAt = (t: number) => 50 + 460 * t;
const yAt = (cm: number) => BASE - 20 * cm;
const strip = (i: number): Point[] => [
  [xAt(0.1 * i) + 2, BASE],
  [xAt(0.1 * i) + 2, yAt(LENGTHS[i])],
  [xAt(0.1 * (i + 1)) - 2, yAt(LENGTHS[i])],
  [xAt(0.1 * (i + 1)) - 2, BASE],
];
// The tops lie on a straight line: length = 1.0 + 20 t cm (t in s, strip centres at 0.05, 0.15, 0.25 s).
const fit = (t: number): Point => [xAt(t), yAt(1.0 + 20 * t)];

export const as27LabVelocityAcceleration: CheatSheet = {
  slug: 'as-2-7-velocity-and-acceleration-in-the-laboratory',
  topicId: 'c16862d4-9430-4015-95fa-20d7cf89a45d',
  curriculumId: 'as',
  title: 'Velocity and acceleration in the lab',
  lessonCode: '2.7',
  chapter: { number: 2, title: 'Accelerated motion' },
  syllabusSections: ['2.7'],
  goal: 'Analyse a ticker tape to find velocities and an acceleration.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'A ticker-timer prints dots on a moving tape at 50 per second, so each space between dots is 0.020 s. Cut the tape into strips of 5 spaces: each strip is 0.10 s, and its length ÷ 0.10 s is the average velocity during it.',
      'Stuck side by side, the strips form a velocity–time graph (a tape chart). Strips growing by the same amount each time mean uniform acceleration. Motion sensors and video analysis give the same data automatically.',
    ],
    keyTerms: [{ term: 'Ticker-timer', source: 'paraphrase', text: 'Marks a dot on a tape every 0.020 s (50 Hz) as the tape is pulled through.' }],
    figures: ['tape-chart'],
  },

  derivations: [],

  equations: [
    { name: 'Velocity from one strip', latex: String.raw`v = \frac{\text{strip length}}{0.10\ \mathrm{s}}` },
    { name: 'Acceleration', latex: String.raw`a = \frac{\Delta v}{\Delta t}` },
  ],

  symbols: [
    { symbol: 'v', meaning: 'average velocity during a strip', unit: '\\mathrm{m\\,s^{-1}}' },
    { symbol: '\\Delta t', meaning: 'time between strip centres', unit: '\\mathrm{s}' },
  ],

  samples: [
    {
      title: 'A tape chart',
      question:
        'Five-space strips from a 50 Hz ticker-timer are 2.0 cm, 4.0 cm and 6.0 cm long (Fig. 1). Find the velocity during each strip and the acceleration.',
      steps: [
        {
          text: 'Each strip lasts 5 × 0.020 = 0.10 s:',
          latex: String.raw`v = \frac{0.020}{0.10},\ \frac{0.040}{0.10},\ \frac{0.060}{0.10} = 0.20,\ 0.40,\ 0.60\ \mathrm{m\,s^{-1}}`,
        },
        { text: 'The velocity rises by 0.20 m s⁻¹ every 0.10 s:', latex: String.raw`a = \frac{0.20}{0.10} = 2.0\ \mathrm{m\,s^{-2}}` },
      ],
      answer: '0.20, 0.40, 0.60 m s⁻¹; uniform acceleration 2.0 m s⁻²',
      unitCheck: String.raw`\frac{\mathrm{m\,s^{-1}}}{\mathrm{s}} = \mathrm{m\,s^{-2}}`,
    },
  ],

  practice: [
    { question: 'How long is 10 spaces on a 50 Hz ticker tape?', answer: '0.20 s' },
    { question: 'A five-space strip is 3.5 cm long. Find the average velocity.', answer: '0.35 m s⁻¹' },
    { question: 'Five-space strips are 1.5, 2.5 and 3.5 cm long. Find the acceleration.', answer: '1.0 m s⁻²' },
    { question: 'All the strips on a tape chart are the same length. What does that show?', answer: 'Constant velocity (zero acceleration)' },
  ],

  other: {
    mistakes: [{ wrong: 'Count the dots instead of the spaces.', right: 'Time = number of spaces × 0.020 s; 6 dots make 5 spaces.' }],
    tips: ['The acceleration uses the time between strip centres: 0.10 s for neighbouring strips.'],
    syllabus: ['9702 topic 2: measure velocity and acceleration. Coursebook 2.7.'],
    links: [{ label: 'Practice questions for this lesson', href: '/practice/c16862d4-9430-4015-95fa-20d7cf89a45d?c=as' }],
  },

  diagrams: [
    {
      id: 'tape-chart',
      title: 'A tape chart',
      caption: 'Equal steps in strip length mean equal rises in velocity: uniform acceleration.',
      alt: 'Three paper strips stand side by side on a time axis, 2.0, 4.0 and 6.0 cm tall, each with six evenly spaced dots. A dashed line through their tops is straight.',
      width: 270,
      height: 220,
      shapes: [
        ...LENGTHS.map((_, i) => ({ kind: 'polygon' as const, points: strip(i), fill: 'soft' as const })),
        ...LENGTHS.flatMap((l, i) =>
          Array.from({ length: 6 }, (_, k) => ({ kind: 'dot' as const, at: [xAt(0.1 * i + 0.05), yAt(l * (0.08 + (0.84 * k) / 5))] as Point, radius: 1.8 })),
        ),
        { kind: 'arrow', from: [50, BASE], to: [50, 30], role: 'ink' },
        { kind: 'arrow', from: [50, BASE], to: [250, BASE], role: 'ink' },
        { kind: 'line', from: fit(0), to: fit(0.32), role: 'muted', dashed: true, thin: true },
        { kind: 'label', at: [44, 34], text: 'length / cm', anchor: 'end', style: 'note' },
        { kind: 'label', at: [252, 210], text: 'time / s', anchor: 'end', style: 'note' },
        { kind: 'label', at: [44, yAt(2) + 4], text: '2', anchor: 'end', style: 'note' },
        { kind: 'label', at: [44, yAt(4) + 4], text: '4', anchor: 'end', style: 'note' },
        { kind: 'label', at: [44, yAt(6) + 4], text: '6', anchor: 'end', style: 'note' },
        { kind: 'label', at: [xAt(0.1), 196], text: '0.1', anchor: 'middle', style: 'note' },
        { kind: 'label', at: [xAt(0.2), 196], text: '0.2', anchor: 'middle', style: 'note' },
        { kind: 'label', at: [xAt(0.3), 196], text: '0.3', anchor: 'middle', style: 'note' },
      ],
    },
  ],
};
