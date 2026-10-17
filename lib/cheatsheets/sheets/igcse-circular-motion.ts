import type { CheatSheet, Point } from '../types';

/*
 * IGCSE 0625 · coursebook 3.7 Circular motion (extension).
 *
 * Syllabus basis (checked 2026-10-17):
 * - 1.5.1 Effects of forces, Supplement: the qualitative (a)–(c) statement
 *   below, which ends "(F = mv²/r is not required)". So F = mv²/r appears on
 *   this sheet only as a tagged "not examined in 0625" aside.
 * - 6.1.1 The Earth, Supplement: average orbital speed v = 2πr/T, recalled
 *   and used. That is the one equation this sheet expects students to use.
 */

/** A point on a circle, angle in degrees anticlockwise from +x (screen y points down). */
function onCircle(centre: Point, radius: number, deg: number): Point {
  const t = (deg * Math.PI) / 180;
  return [round(centre[0] + radius * Math.cos(t)), round(centre[1] - radius * Math.sin(t))];
}
/** Unit vector along the anticlockwise tangent at `deg`, in screen coordinates. */
function tangent(deg: number): Point {
  const t = (deg * Math.PI) / 180;
  return [-Math.sin(t), -Math.cos(t)];
}
/** Unit vector from the point at `deg` towards the centre, in screen coordinates. */
function inward(deg: number): Point {
  const t = (deg * Math.PI) / 180;
  return [-Math.cos(t), Math.sin(t)];
}
function along(p: Point, dir: Point, length: number): Point {
  return [round(p[0] + dir[0] * length), round(p[1] + dir[1] * length)];
}
function round(n: number) {
  return Math.round(n * 10) / 10;
}

// Figure 1: two positions on one circle, same-length arrows, both at 90°.
const C1: Point = [170, 128];
const R1 = 84;
const A = 50;
const B = 205;
const pA = onCircle(C1, R1, A);
const pB = onCircle(C1, R1, B);
const pR = onCircle(C1, R1, -55);

// Figure 2: ball on a string, released at the top of the circle.
const C2: Point = [210, 150];
const R2 = 72;
const top = onCircle(C2, R2, 90);

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
  sheetBreakBefore: 'worked',

  definitions: [
    {
      term: 'Motion in a circle (syllabus)',
      source: 'syllabus',
      tag: 'supplement',
      text:
        'Describe, qualitatively, motion in a circular path due to a force perpendicular to the motion as: ' +
        '(a) speed increases if force increases, with mass and radius constant; ' +
        '(b) radius decreases if force increases, with mass and speed constant; ' +
        '(c) an increased mass requires an increased force to keep speed and radius constant.',
      note: 'The syllabus adds: “F = mv²/r is not required.”',
    },
    {
      term: 'Uniform circular motion',
      source: 'paraphrase',
      text: 'Moving round a circle at constant speed. The direction of motion changes all the time, so the velocity changes and the object is accelerating, even though its speed does not change.',
    },
    {
      term: 'Centripetal force',
      source: 'paraphrase',
      text: 'The resultant force on an object moving in a circle. It acts towards the centre, at 90° to the velocity, so it changes the direction of motion but not the speed. A real force supplies it: tension (ball on a string), friction (car on a bend) or gravity (Moon, satellites).',
      note: '“Centripetal” = centre-seeking: a job title, not a new force.',
    },
  ],

  equations: [
    {
      name: 'Speed round a circle / average orbital speed',
      latex: String.raw`v = \frac{2\pi r}{T}`,
      tag: 'supplement',
      symbols: [
        { symbol: 'v', meaning: 'speed (average orbital speed)', unit: String.raw`\mathrm{m\,s^{-1}}` },
        { symbol: 'r', meaning: 'radius of the circle or orbit', unit: String.raw`\mathrm{m}` },
        { symbol: 'T', meaning: 'period: time for one complete circle', unit: String.raw`\mathrm{s}` },
      ],
      note: 'Syllabus 6.1.1: recall and use. One lap (2πr) ÷ time.',
    },
    {
      name: 'Centripetal force',
      latex: String.raw`F = \frac{mv^{2}}{r}`,
      tag: 'beyond',
      tagLabel: 'Not examined in 0625 · A Level Ch.16',
      symbols: [
        { symbol: 'F', meaning: 'resultant (centripetal) force', unit: String.raw`\mathrm{N}` },
        { symbol: 'm', meaning: 'mass', unit: String.raw`\mathrm{kg}` },
        { symbol: 'v', meaning: 'speed', unit: String.raw`\mathrm{m\,s^{-1}}` },
        { symbol: 'r', meaning: 'radius', unit: String.raw`\mathrm{m}` },
      ],
      note: 'Shows why (a)–(c) hold: more v or m, or less r, needs more F.',
    },
  ],

  diagrams: [
    {
      id: 'velocity-and-force',
      title: 'Velocity and force',
      caption:
        'Velocity is along the tangent; the resultant force points to the centre, always at 90° to it. Same-length arrows: steady speed, changing direction.',
      alt: 'Top view of a circle with an object shown at two positions. At each, a velocity arrow points along the tangent in the direction of motion and a force arrow points towards the centre, with a right-angle mark between them. A dashed line from the centre marks the radius r.',
      width: 340,
      height: 250,
      seed: 7,
      shapes: [
        { kind: 'circle', centre: C1, radius: R1, role: 'muted' },
        { kind: 'dot', at: C1, radius: 3, role: 'ink' },
        { kind: 'label', at: [C1[0] + 7, C1[1] - 8], text: 'centre', anchor: 'start', size: 'sm', role: 'muted' },
        { kind: 'line', from: C1, to: pR, role: 'ink', dashed: true },
        { kind: 'label', at: [round((C1[0] + pR[0]) / 2) + 10, round((C1[1] + pR[1]) / 2) - 2], text: 'r', role: 'ink' },

        { kind: 'arrow', from: pA, to: along(pA, tangent(A), 62), role: 'velocity' },
        { kind: 'label', at: along(along(pA, tangent(A), 62), [0, -1], 8), text: 'v', role: 'velocity', anchor: 'middle' },
        { kind: 'arrow', from: pA, to: along(pA, inward(A), 50), role: 'force' },
        { kind: 'label', at: along(along(pA, inward(A), 50), [1, 0], 12), text: 'F', role: 'force', anchor: 'start' },
        { kind: 'rightAngle', at: pA, a: tangent(A), b: inward(A), size: 10, role: 'ink' },
        { kind: 'dot', at: pA, radius: 7, role: 'ink' },

        { kind: 'arrow', from: pB, to: along(pB, tangent(B), 62), role: 'velocity' },
        { kind: 'label', at: along(along(pB, tangent(B), 62), [-1, 0], 10), text: 'v', role: 'velocity', anchor: 'end' },
        { kind: 'arrow', from: pB, to: along(pB, inward(B), 50), role: 'force' },
        { kind: 'label', at: along(along(pB, inward(B), 50), [0, -1], 10), text: 'F', role: 'force', anchor: 'middle' },
        { kind: 'rightAngle', at: pB, a: tangent(B), b: inward(B), size: 10, role: 'ink' },
        { kind: 'dot', at: pB, radius: 7, role: 'ink' },
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
      seed: 11,
      shapes: [
        { kind: 'circle', centre: C2, radius: R2, role: 'muted', dashed: true },
        { kind: 'dot', at: C2, radius: 4, role: 'ink' },
        { kind: 'label', at: [C2[0] - 58, C2[1] + 26], text: 'fixed point', anchor: 'start', size: 'sm', role: 'muted' },
        { kind: 'line', from: C2, to: along(C2, [0, -1], 40), role: 'ink' },
        { kind: 'label', at: [C2[0], C2[1] - 47], text: 'string snaps', anchor: 'middle', size: 'sm', role: 'ink' },
        { kind: 'arrow', from: top, to: along(top, [-1, 0], 175), role: 'velocity', dashed: true },
        {
          kind: 'label',
          at: [top[0] - 100, top[1] - 10],
          text: 'actual path: tangent',
          anchor: 'middle',
          size: 'sm',
          role: 'velocity',
        },
        { kind: 'arrow', from: along(top, [0, -1], 10), to: along(top, [0, -1], 58), role: 'muted' },
        { kind: 'cross', at: along(top, [0, -1], 34), size: 9 },
        { kind: 'label', at: [top[0] + 14, top[1] - 38], text: 'not outwards', anchor: 'start', size: 'sm', role: 'muted' },
        { kind: 'dot', at: top, radius: 8, role: 'ink' },
      ],
    },
  ],

  worked: [
    {
      title: 'Orbital period from speed and radius',
      tag: 'supplement',
      question:
        'A satellite orbits in a circle of radius 7.0 × 10⁶ m at a steady 7.5 × 10³ m/s. Calculate the time for one orbit.',
      steps: [
        {
          text: 'Start from v = 2πr/T. T is in the denominator and v is the lone term on the other side, so swap them in one step (cross-multiplication).',
          latex: String.raw`v = \frac{2\pi r}{T} \quad\Longrightarrow\quad T = \frac{2\pi r}{v}`,
          units: String.raw`\frac{\mathrm{m}}{\mathrm{m\,s^{-1}}} = \mathrm{s}\ \checkmark`,
          note: 'One swap, not × T then ÷ v.',
        },
        {
          text: 'Substitute, with units.',
          latex: String.raw`T = \frac{2\pi \times 7.0\times10^{6}\ \mathrm{m}}{7.5\times10^{3}\ \mathrm{m\,s^{-1}}} = 5864\ \mathrm{s}`,
        },
        {
          text: 'The data are to 2 s.f., so give 2 s.f. Divide by 60 s per minute as a sense check.',
          latex: String.raw`T = 5.9\times10^{3}\ \mathrm{s} \approx 98\ \mathrm{min}`,
          units: String.raw`\frac{\mathrm{s}}{\mathrm{s\,min^{-1}}} = \mathrm{min}\ \checkmark`,
          note: 'Low orbits take about 1½ h: plausible.',
        },
      ],
      answer: String.raw`T = 5.9\times10^{3}\ \mathrm{s}\ \ (\text{about }98\text{ minutes})`,
    },
  ],

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

  recall: [
    {
      question: 'In which direction does the resultant force on an object in uniform circular motion act?',
      answer: 'Towards the centre of the circle, at 90° to the velocity.',
    },
    {
      question: 'What provides the centripetal force that keeps the Moon in orbit?',
      answer: 'The gravitational attraction of the Earth.',
    },
    {
      question: 'Mass and radius stay the same but the force increases. What happens to the speed?',
      answer: 'The speed increases.',
    },
    {
      question: 'Mass and speed stay the same but the force increases. What happens to the radius?',
      answer: 'The radius decreases: the object moves in a tighter circle.',
    },
    {
      question: 'Two cars take a bend at the same speed. One has twice the mass. Which needs more friction?',
      answer: 'The heavier car: more mass needs more force for the same speed and radius.',
    },
    {
      question: 'Calculate the speed of a point 0.30 m from the centre of a wheel that turns once every 0.50 s.',
      answer: 'v = 2π × 0.30 m ÷ 0.50 s = 3.8 m/s',
    },
  ],

  summary: [
    'Steady speed in a circle still means acceleration: the direction of the velocity keeps changing.',
    'That needs a resultant force towards the centre, at 90° to the velocity, supplied by tension, friction or gravity.',
    'More force: faster at the same radius, or a tighter circle at the same speed. More mass: more force needed.',
    'Remove the force and the object leaves along the tangent, not outwards.',
    'Average orbital speed: v = 2πr/T, with r in metres and T in seconds.',
  ],
};
