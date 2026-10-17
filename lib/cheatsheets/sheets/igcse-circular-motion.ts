import type { CheatSheet, Point } from '../types';
import { along, inward, onCircle, round, tangent } from '../draw';

/*
 * IGCSE 0625 · coursebook 3.7 Circular motion (extension).
 *
 * Syllabus basis (checked 2026-10-17):
 * - 1.5.1 Effects of forces, Supplement: the qualitative (a)–(c) statement
 *   below, which ends "(F = mv²/r is not required)". So F = mv²/r appears on
 *   this sheet only tagged as not examined in 0625.
 * - 6.1.1 The Earth, Supplement: average orbital speed v = 2πr/T, recalled
 *   and used. That is the one equation this sheet expects students to use.
 *
 * Every number in the samples and practice answers is recomputed in
 * lib/cheatsheets/__tests__/cheatsheets.test.ts.
 */

// Fig. 1 · two positions on one circle: same-length arrows, both at 90°.
const C1: Point = [170, 128];
const R1 = 84;
const A = 50;
const B = 205;
const pA = onCircle(C1, R1, A);
const pB = onCircle(C1, R1, B);
const pR = onCircle(C1, R1, -55);

// Fig. 2 · ball on a string, released at the top of the circle.
const C2: Point = [210, 150];
const R2 = 72;
const top = onCircle(C2, R2, 90);

// Fig. 3 · one lap: distance 2πr in time T.
const C3: Point = [160, 108];
const R3 = 72;
const lapStart = onCircle(C3, R3, 30);

export const igcseCircularMotion: CheatSheet = {
  slug: 'igcse-circular-motion',
  topicId: 'db2c98d5-dd86-5faf-9121-5533bdd5d212',
  curriculumId: 'igcse',
  title: 'Circular motion',
  lessonCode: '3.7',
  chapter: { number: 3, title: 'Forces and Motion' },
  syllabusSections: ['1.5.1', '6.1.1'],
  goal: 'Explain why moving in a circle at steady speed needs a force towards the centre, and how that force depends on speed, mass and radius.',
  reviewed: '2026-10-17',

  explanation: {
    paragraphs: [
      'An object moving round a circle at steady speed keeps changing direction, so its velocity changes: it is accelerating, even though its speed is constant.',
      'That needs a resultant force towards the centre, at 90° to the velocity: the centripetal force. It changes the direction of motion but not the speed.',
      'The force always comes from a real force: tension (a ball on a string), friction (a car on a bend) or gravity (the Moon, satellites, planets). Remove it and the object carries on in a straight line along the tangent.',
      'More force gives a higher speed at the same radius, or a tighter circle at the same speed. More mass needs more force for the same speed and radius.',
    ],
    keyTerms: [
      {
        term: 'Motion in a circle (syllabus)',
        source: 'syllabus',
        tag: 'supplement',
        text:
          'Describe, qualitatively, motion in a circular path due to a force perpendicular to the motion as: ' +
          '(a) speed increases if force increases, with mass and radius constant; ' +
          '(b) radius decreases if force increases, with mass and speed constant; ' +
          '(c) an increased mass requires an increased force to keep speed and radius constant.',
      },
      {
        term: 'Centripetal force',
        source: 'paraphrase',
        text: 'The resultant force on an object moving in a circle. It acts towards the centre, at 90° to the velocity.',
      },
      {
        term: 'Average orbital speed (syllabus)',
        source: 'syllabus',
        tag: 'supplement',
        text: 'Defined by $v = 2\\pi r/T$, where $r$ is the average radius of the orbit and $T$ is the orbital period.',
      },
    ],
    figures: ['velocity-and-force', 'string-breaks'],
  },

  derivations: [
    {
      id: 'speed',
      title: 'Speed round a circle',
      tag: 'supplement',
      setup: 'Average speed is distance ÷ time. In one period $T$ the object goes once round the circle.',
      figure: 'one-lap',
      steps: [
        { text: 'The distance for one lap is the circumference:', latex: String.raw`d = 2\pi r` },
        { text: 'The time for one lap is the period $T$:', latex: String.raw`v = \frac{d}{t} = \frac{2\pi r}{T}` },
      ],
      result: String.raw`v = \frac{2\pi r}{T}`,
    },
    {
      id: 'rearranging',
      title: 'Rearranging for T and r',
      tag: 'supplement',
      setup: 'Exam questions often give the speed and ask for the period or the radius.',
      steps: [
        {
          text: 'For $T$: $T$ is in the denominator and $v$ is the lone term on the other side, so swap them in one step (cross-multiplication).',
          latex: String.raw`v = \frac{2\pi r}{T} \;\Longrightarrow\; T = \frac{2\pi r}{v}`,
        },
        {
          text: 'For $r$: multiply both sides by $T$ and divide both by $2\\pi$.',
          latex: String.raw`v = \frac{2\pi r}{T} \;\Longrightarrow\; r = \frac{vT}{2\pi}`,
        },
      ],
      result: String.raw`T = \frac{2\pi r}{v} \qquad r = \frac{vT}{2\pi}`,
    },
    {
      id: 'why',
      title: 'Why statements (a)–(c) are true',
      tag: 'beyond',
      tagLabel: 'Not examined in 0625 · A Level Ch.16',
      setup:
        'At A Level the force needed is $F = mv^2/r$. You will not be asked to use it, but it shows where (a)–(c) come from.',
      steps: [
        { text: '(a) Same $m$ and $r$: a bigger $F$ goes with a bigger $v$.' },
        { text: '(b) Same $m$ and $v$: a bigger $F$ goes with a smaller $r$.' },
        { text: '(c) Same $v$ and $r$: a bigger $m$ needs a bigger $F$.' },
      ],
      result: String.raw`F = \frac{mv^{2}}{r}`,
    },
  ],

  equations: [
    {
      name: 'Average orbital speed',
      latex: String.raw`v = \frac{2\pi r}{T}`,
      tag: 'supplement',
      note: 'recall and use it: it is not given',
    },
    { name: 'Rearranged for the period', latex: String.raw`T = \frac{2\pi r}{v}`, tag: 'supplement' },
    { name: 'Rearranged for the radius', latex: String.raw`r = \frac{vT}{2\pi}`, tag: 'supplement' },
    {
      name: 'Centripetal force',
      latex: String.raw`F = \frac{mv^{2}}{r}`,
      tag: 'beyond',
      tagLabel: 'Not examined in 0625',
      note: 'A Level Ch.16',
    },
  ],

  symbols: [
    { symbol: 'v', meaning: 'speed (average orbital speed)', unit: '\\mathrm{m\\,s^{-1}}' },
    { symbol: 'r', meaning: 'radius of the circle or orbit', unit: '\\mathrm{m}' },
    { symbol: 'T', meaning: 'period: time for one complete circle', unit: '\\mathrm{s}' },
    { symbol: 'F', meaning: 'resultant (centripetal) force', unit: '\\mathrm{N}' },
    { symbol: 'm', meaning: 'mass', unit: '\\mathrm{kg}' },
  ],

  samples: [
    {
      title: 'Orbital period from speed and radius',
      tag: 'supplement',
      question:
        'A satellite orbits in a circle of radius 7.0 × 10⁶ m at a steady 7.5 × 10³ m/s. Calculate the time for one orbit.',
      steps: [
        {
          text: '$T$ is in the denominator and $v$ is the lone term on the other side: swap them in one step.',
          latex: String.raw`v = \frac{2\pi r}{T} \;\Longrightarrow\; T = \frac{2\pi r}{v}`,
        },
        {
          text: 'Substitute, with units:',
          latex: String.raw`T = \frac{2\pi \times 7.0\times10^{6}\ \mathrm{m}}{7.5\times10^{3}\ \mathrm{m\,s^{-1}}} = 5864\ \mathrm{s}`,
        },
        {
          text: 'The data are to 2 s.f., so give 2 s.f. Dividing by 60 s per minute is a sense check: low orbits take about 1½ hours.',
          latex: String.raw`T = 5.9\times10^{3}\ \mathrm{s} \approx 98\ \mathrm{min}`,
        },
      ],
      answer: String.raw`$T = 5.9\times10^{3}\ \mathrm{s}$ (about 98 minutes)`,
      unitCheck: String.raw`\frac{\mathrm{m}}{\mathrm{m\,s^{-1}}} = \mathrm{s}`,
    },
    {
      title: 'Orbital speed of the Moon',
      tag: 'supplement',
      question:
        'The Moon orbits the Earth at an average radius of 3.84 × 10⁸ m with a period of 27.3 days. Calculate its average orbital speed.',
      steps: [
        {
          text: 'Convert the period to seconds first:',
          latex: String.raw`T = 27.3 \times 24 \times 3600\ \mathrm{s} = 2.359\times10^{6}\ \mathrm{s}`,
        },
        {
          text: 'Substitute into $v = 2\\pi r/T$:',
          latex: String.raw`v = \frac{2\pi \times 3.84\times10^{8}\ \mathrm{m}}{2.359\times10^{6}\ \mathrm{s}} = 1023\ \mathrm{m\,s^{-1}}`,
        },
      ],
      answer: String.raw`$v = 1.02\times10^{3}$ m/s (3 s.f., like the data)`,
      unitCheck: String.raw`\frac{\mathrm{m}}{\mathrm{s}} = \mathrm{m\,s^{-1}}`,
    },
    {
      title: 'Describing the force on a car',
      question:
        'A car drives round a roundabout at constant speed. Explain why it needs a resultant force, state what provides it, and describe how the force needed changes if the car goes faster round the same circle.',
      steps: [
        {
          text: 'Its direction of travel keeps changing, so its velocity changes: it is accelerating, and acceleration needs a resultant force.',
        },
        { text: 'The force acts towards the centre of the roundabout. Friction between the tyres and the road provides it.' },
        { text: 'Same mass and radius, higher speed: statement (a) says a larger force goes with a larger speed.' },
      ],
      answer: 'A larger friction force towards the centre is needed.',
    },
  ],

  practice: [
    {
      question: 'In which direction does the resultant force on an object in uniform circular motion act?',
      answer: 'Towards the centre, at 90° to the velocity.',
    },
    {
      question: 'What provides the centripetal force that keeps the Moon in orbit?',
      answer: 'The gravitational attraction of the Earth.',
    },
    { question: 'Mass and radius stay the same but the force increases. What happens to the speed?', answer: 'It increases.' },
    { question: 'Mass and speed stay the same but the force increases. What happens to the radius?', answer: 'It decreases.' },
    {
      question: 'A stone on a string is whirled in a horizontal circle and the string snaps. Describe its path just after.',
      answer: 'A straight line along the tangent at the point of release.',
    },
    {
      question: 'Calculate the speed of a point 0.30 m from the centre of a wheel that turns once every 0.50 s.',
      answer: '3.8 m/s',
    },
    {
      question: 'A satellite has an orbital radius of 6.7 × 10⁶ m and a period of 90 minutes. Calculate its orbital speed.',
      answer: '7.8 × 10³ m/s',
    },
    {
      question: 'The Earth orbits the Sun at 30 km/s, once every 365 days. Calculate the radius of its orbit.',
      answer: '1.5 × 10¹¹ m',
    },
  ],

  other: {
    mistakes: [
      {
        wrong: 'Constant speed means no acceleration.',
        right: 'The direction changes, so the velocity changes: it accelerates towards the centre.',
      },
      {
        wrong: 'A “centrifugal force” pushes the object outwards.',
        right: 'The resultant force points inwards. Feeling thrown out is your body carrying on in a straight line.',
      },
      {
        wrong: 'A released ball flies outwards along the radius.',
        right: 'It moves off along the tangent at the point of release.',
      },
      {
        wrong: 'Draw centripetal force as an extra arrow beside tension or gravity.',
        right: 'It is the resultant of those real forces, not another force.',
      },
      {
        wrong: 'Use the diameter in v = 2πr/T, or T in minutes.',
        right: 'r is the radius in metres; T is the period in seconds.',
      },
    ],
    tips: [
      '“Explain” questions: velocity changes direction → acceleration → resultant force towards the centre → name what provides it.',
      '“Describe” questions on (a)–(c): say which two quantities stay constant, then how the force and the third one change.',
    ],
    syllabus: [
      '0625 1.5.1 (Supplement): describe circular motion qualitatively, statements (a)–(c). The syllabus adds: “F = mv²/r is not required.”',
      '0625 6.1.1 (Supplement): define average orbital speed by v = 2πr/T, and recall and use it.',
      'Going further: A Level Chapter 16 adds F = mv²/r, vertical circles and conical pendulums.',
    ],
    links: [
      { label: 'Circular Motion Lab (simulation)', href: '/simulations/circular-motion' },
      { label: 'IGCSE practice questions for this lesson', href: '/practice/db2c98d5-dd86-5faf-9121-5533bdd5d212?c=igcse' },
    ],
  },

  diagrams: [
    {
      id: 'velocity-and-force',
      title: 'Velocity and force',
      caption:
        'Velocity is along the tangent; the resultant force points to the centre, always at 90° to it. Same-length arrows: steady speed, changing direction.',
      alt: 'Top view of a circle with an object shown at two positions. At each, a velocity arrow points along the tangent in the direction of motion and a force arrow points towards the centre, with a right-angle mark between them. A dashed line from the centre marks the radius r.',
      width: 340,
      height: 250,
      shapes: [
        { kind: 'circle', centre: C1, radius: R1, role: 'muted' },
        { kind: 'dot', at: C1, radius: 2.5 },
        { kind: 'label', at: [C1[0] + 7, C1[1] - 8], text: 'centre', style: 'note', role: 'muted' },
        { kind: 'line', from: C1, to: pR, role: 'ink', dashed: true, thin: true },
        { kind: 'label', at: [round((C1[0] + pR[0]) / 2) + 10, round((C1[1] + pR[1]) / 2) - 2], text: 'r' },

        { kind: 'arrow', from: pA, to: along(pA, tangent(A), 62), role: 'velocity' },
        { kind: 'label', at: along(along(pA, tangent(A), 62), [0, -1], 6), text: 'v', role: 'velocity', anchor: 'middle' },
        { kind: 'arrow', from: pA, to: along(pA, inward(A), 50), role: 'force' },
        { kind: 'label', at: along(along(pA, inward(A), 50), [1, 0], 8), text: 'F', role: 'force' },
        { kind: 'rightAngle', at: pA, a: tangent(A), b: inward(A), size: 9 },
        { kind: 'dot', at: pA, radius: 7 },

        { kind: 'arrow', from: pB, to: along(pB, tangent(B), 62), role: 'velocity' },
        { kind: 'label', at: along(along(pB, tangent(B), 62), [-1, 0], 8), text: 'v', role: 'velocity', anchor: 'end' },
        { kind: 'arrow', from: pB, to: along(pB, inward(B), 50), role: 'force' },
        { kind: 'label', at: along(along(pB, inward(B), 50), [0, -1], 8), text: 'F', role: 'force', anchor: 'middle' },
        { kind: 'rightAngle', at: pB, a: tangent(B), b: inward(B), size: 9 },
        { kind: 'dot', at: pB, radius: 7 },
      ],
    },
    {
      id: 'string-breaks',
      title: 'If the string breaks',
      caption:
        'No inward force, so nothing turns the ball: it moves off in a straight line along the tangent (Newton’s first law), not outwards.',
      alt: 'Top view of a ball whirled anticlockwise on a string around a fixed point. At the top of the circle the string breaks. A dashed straight line continues from the ball along the tangent, labelled actual path. An arrow pointing straight outwards from the centre is crossed out, labelled not outwards.',
      width: 340,
      height: 240,
      shapes: [
        { kind: 'circle', centre: C2, radius: R2, role: 'muted', dashed: true },
        { kind: 'dot', at: C2, radius: 3.5 },
        { kind: 'label', at: [C2[0] - 58, C2[1] + 26], text: 'fixed point', style: 'note', role: 'muted' },
        { kind: 'line', from: C2, to: along(C2, [0, -1], 40), role: 'ink' },
        { kind: 'label', at: [C2[0], C2[1] - 47], text: 'string snaps', anchor: 'middle', style: 'note' },
        { kind: 'arrow', from: top, to: along(top, [-1, 0], 175), role: 'velocity', dashed: true },
        {
          kind: 'label',
          at: [top[0] - 100, top[1] - 10],
          text: 'actual path: tangent',
          anchor: 'middle',
          style: 'note',
          role: 'velocity',
        },
        { kind: 'arrow', from: along(top, [0, -1], 10), to: along(top, [0, -1], 58), role: 'muted' },
        { kind: 'cross', at: along(top, [0, -1], 34), size: 9 },
        { kind: 'label', at: [top[0] + 14, top[1] - 38], text: 'not outwards', style: 'note', role: 'muted' },
        { kind: 'dot', at: top, radius: 8 },
      ],
    },
    {
      id: 'one-lap',
      title: 'One lap',
      caption: 'In one period T the object travels once round: a distance equal to the circumference 2πr.',
      alt: 'A circle of radius r with an arrow running most of the way round it, labelled distance 2 pi r in time T.',
      width: 300,
      height: 230,
      shapes: [
        { kind: 'circle', centre: C3, radius: R3, role: 'muted', dashed: true },
        { kind: 'dot', at: C3, radius: 2.5 },
        { kind: 'line', from: C3, to: onCircle(C3, R3, 250), role: 'ink', thin: true },
        { kind: 'label', at: [C3[0] - 20, C3[1] + 34], text: 'r', anchor: 'middle' },
        { kind: 'arc', centre: C3, radius: R3 + 12, from: 30, to: 324, role: 'velocity' },
        { kind: 'arrow', from: onCircle(C3, R3 + 12, 322), to: onCircle(C3, R3 + 12, 332), role: 'velocity' },
        { kind: 'label', at: [C3[0] - R3 - 20, C3[1] + 6], text: '2πr', role: 'velocity', anchor: 'end' },
        {
          kind: 'label',
          at: [C3[0], C3[1] + R3 + 36],
          text: 'one lap in time T',
          anchor: 'middle',
          style: 'note',
          role: 'muted',
        },
        { kind: 'dot', at: lapStart, radius: 6 },
        { kind: 'label', at: along(lapStart, [1, 0], 10), text: 'start', style: 'note', role: 'muted' },
      ],
    },
  ],

  pages: [
    ['explanation'],
    ['derivations'],
    ['equations', { section: 'samples', from: 0, to: 2 }],
    [{ section: 'samples', from: 2 }, 'practice', 'other'],
  ],
};
