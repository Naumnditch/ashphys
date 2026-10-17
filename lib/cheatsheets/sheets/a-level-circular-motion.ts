import type { CheatSheet, Point } from '../types';
import { along, dir, inward, onCircle, round, tangent } from '../draw';

/*
 * A Level 9702 · coursebook Chapter 16 Circular motion (sections 16.1–16.7),
 * syllabus topic 12 Motion in a circle. A Level only: not in AS.
 *
 * Every number in the samples and practice answers is recomputed in
 * lib/cheatsheets/__tests__/cheatsheets.test.ts. g = 9.81 m s⁻² throughout.
 * Tension is written F_T so it never clashes with the period T.
 */

// Fig. 1 · top view: velocity tangent, force and acceleration to the centre.
const C1: Point = [150, 122];
const R1 = 82;
const pA = onCircle(C1, R1, 50);
const pB = onCircle(C1, R1, 210);
const pR = onCircle(C1, R1, -40);
const omegaTip = onCircle(C1, 24, 112);

// Fig. 2 · velocity triangle: two positions Δθ apart, and v₂ − v₁ = Δv.
const O2: Point = [72, 158];
const R2 = 92;
const P1 = onCircle(O2, R2, 60);
const P2 = onCircle(O2, R2, 100);
const Q: Point = [252, 176];
const V1tip = along(Q, tangent(60), 82);
const V2tip = along(Q, tangent(100), 82);

// Fig. 3 · banked track, rear view: road rising away from the centre at θ = 20°.
const BANK = 20;
const roadStart: Point = [30, 196];
const roadEnd = along(roadStart, dir(BANK), 280);
const up = dir(BANK + 90); // normal to the road
const base = along(roadStart, dir(BANK), 140);
const carCorners: Point[] = [
  along(base, dir(BANK), -36),
  along(base, dir(BANK), 36),
  along(along(base, dir(BANK), 36), up, 28),
  along(along(base, dir(BANK), -36), up, 28),
];
const G = along(base, up, 14);
const NLEN = 84;
const Ntip = along(G, up, NLEN);

// Fig. 4 · vertical circle: forces at the top and the bottom.
const C4: Point = [150, 150];
const R4 = 92;
const top: Point = [C4[0], C4[1] - R4];
const bottom: Point = [C4[0], C4[1] + R4];

// Fig. 5 · conical pendulum, θ = 30°.
const P5: Point = [140, 34];
const L5 = 180;
const TH5 = 30;
const bob = along(P5, dir(-90 + TH5), L5);
const O5: Point = [P5[0], bob[1]];
const towardPivot = dir(90 + TH5);
const FT = 74;

export const aLevelCircularMotion: CheatSheet = {
  slug: 'a-level-circular-motion',
  topicId: 'db2c98d5-dd86-5faf-9121-5533bdd5d212',
  // The other Chapter 16 lessons: this sheet covers the whole chapter.
  alsoCovers: [
    '0245e29c-acd6-5c5f-b1b3-bf9431a0fa6b',
    '2cb349de-a9e0-4b56-84d7-768b4df0ca9e',
    '744a91d7-6b75-4fd2-b3c7-17689e965446',
    '9b374880-4182-4886-b234-d78a4ea3ad26',
    '396985e8-749f-49c7-8368-5612a2941d72',
    '685c0bf9-07df-4a2a-bfb1-3c4b387bc137',
  ],
  curriculumId: 'a-level',
  title: 'Circular motion: horizontal, vertical and conical',
  lessonCode: '16.1',
  chapter: { number: 16, title: 'Circular motion' },
  syllabusSections: ['16.1', '16.2', '16.3', '16.4', '16.5', '16.6', '16.7'],
  goal: 'Analyse any circular motion with ω, v = rω and F = mv²/r: strings, bends, banked tracks, vertical circles, conical pendulums.',
  reviewed: '2026-10-17',

  explanation: {
    paragraphs: [
      'An object moving in a circle at constant speed has a velocity whose direction changes all the time, so it is accelerating. The acceleration points to the centre: the centripetal acceleration $a = v^2/r = r\\omega^2$.',
      'By Newton’s second law that needs a resultant force towards the centre, $F = mv^2/r = mr\\omega^2$. It is perpendicular to the velocity, so it changes the direction of motion but not the speed, and it does no work.',
      'The centripetal force is not an extra force: it is the resultant of the real forces (tension, friction, gravity, contact force, lift). The recipe never changes: draw the real forces, resolve along the radius with “towards the centre” positive, and set the resultant equal to $mv^2/r$. In a horizontal circle the vertical components also balance.',
      'Angles are in radians. One revolution is $2\\pi$ rad in one period $T$, so the angular speed is $\\omega = 2\\pi/T = 2\\pi f$ and the speed is $v = r\\omega$.',
    ],
    keyTerms: [
      {
        term: 'Uniform circular motion (syllabus)',
        source: 'syllabus',
        text: 'Understand that a force of constant magnitude that is always perpendicular to the direction of motion causes centripetal acceleration.',
      },
      {
        term: 'Radian',
        source: 'paraphrase',
        text: 'The angle subtended at the centre of a circle by an arc equal in length to the radius. So $\\theta = s/r$ and $2\\pi$ rad $= 360°$.',
      },
      {
        term: 'Angular speed $\\omega$',
        source: 'paraphrase',
        text: 'The rate of change of angular displacement, $\\omega = \\Delta\\theta/\\Delta t$, in rad s⁻¹.',
      },
      {
        term: 'Centripetal force',
        source: 'paraphrase',
        text: 'The resultant force on an object in circular motion, directed towards the centre of the circle.',
      },
    ],
    figures: ['top-view'],
  },

  derivations: [
    {
      id: 'acceleration',
      title: 'Centripetal acceleration and force',
      setup:
        'In a short time $\\Delta t$ the object turns through a small angle $\\Delta\\theta$. Its speed $v$ stays the same; only the direction of its velocity changes.',
      figure: 'velocity-triangle',
      steps: [
        {
          text: '$v_1$ and $v_2$ have the same length $v$ and differ in direction by $\\Delta\\theta$. For a small angle, $\\Delta v$ is an arc of radius $v$:',
          latex: String.raw`\Delta v = v\,\Delta\theta`,
        },
        {
          text: '$\\Delta v$ points towards the centre. Divide by $\\Delta t$, using $\\omega = \\Delta\\theta/\\Delta t$:',
          latex: String.raw`a = \frac{\Delta v}{\Delta t} = v\,\frac{\Delta\theta}{\Delta t} = v\omega`,
        },
        {
          text: 'Substitute $\\omega = v/r$ (or $v = r\\omega$). Newton’s second law, $F = ma$, then gives the resultant force needed.',
          latex: String.raw`a = \frac{v^{2}}{r} = r\omega^{2}`,
        },
      ],
      result: String.raw`a = \frac{v^{2}}{r} = r\omega^{2} \qquad F = \frac{mv^{2}}{r} = mr\omega^{2}`,
    },
    {
      id: 'horizontal',
      title: 'Horizontal circles: string, flat bend, banked track',
      setup: 'The centre is level with the object, so the resultant force is horizontal and the vertical forces balance.',
      figure: 'banked',
      steps: [
        {
          text: 'Ball on a string on a smooth table: the tension alone points to the centre.',
          latex: String.raw`F_\mathrm{T} = \frac{mv^{2}}{r}`,
        },
        {
          text: 'Car on a flat bend: friction from the road points to the centre. If $mv^2/r$ needs more friction than the road can give, the car skids to a wider path.',
          latex: String.raw`F_\mathrm{friction} = \frac{mv^{2}}{r}`,
        },
        {
          text: 'Banked track with no friction (or a banking aircraft, with lift in place of $N$). Resolve the normal contact force $N$:',
          latex: String.raw`N\cos\theta = mg \qquad N\sin\theta = \frac{mv^{2}}{r}`,
        },
        { text: 'Divide the second equation by the first to eliminate $N$:', latex: String.raw`\tan\theta = \frac{v^{2}}{rg}` },
      ],
      result: String.raw`\tan\theta = \frac{v^{2}}{rg}`,
    },
    {
      id: 'vertical',
      title: 'Vertical circles',
      setup:
        'A mass on a string, or a car in a loop. Take “towards the centre” as positive: down at the top, up at the bottom. The speed changes round the circle.',
      figure: 'vertical',
      steps: [
        {
          text: 'Top: tension and weight both point down, towards the centre.',
          latex: String.raw`F_\mathrm{T} + mg = \frac{mv_\mathrm{top}^{2}}{r}`,
        },
        {
          text: 'Bottom: tension points up (towards the centre), weight down.',
          latex: String.raw`F_\mathrm{T} - mg = \frac{mv_\mathrm{bottom}^{2}}{r}`,
        },
        {
          text: 'The string just stays taut at the top when $F_\\mathrm{T} = 0$: gravity alone provides the centripetal force.',
          latex: String.raw`mg = \frac{mv^{2}}{r} \;\Longrightarrow\; v_\mathrm{min} = \sqrt{gr}`,
        },
        {
          text: 'With no energy losses, kinetic energy at the bottom = kinetic energy at the top + $mg(2r)$:',
          latex: String.raw`v_\mathrm{bottom}^{2} = v_\mathrm{top}^{2} + 4gr`,
        },
        {
          text: 'Car over a hump (top of a circle, contact force $N$ up): $mg - N = mv^2/r$, so it leaves the road when $N = 0$, at $v = \\sqrt{gr}$.',
        },
      ],
      result: String.raw`\text{top: } F_\mathrm{T} + mg = \frac{mv^{2}}{r} \qquad \text{bottom: } F_\mathrm{T} - mg = \frac{mv^{2}}{r}`,
    },
    {
      id: 'conical',
      title: 'Conical pendulum',
      setup:
        'A bob on a string of length $L$ moves in a horizontal circle of radius $r$; the string sweeps out a cone at angle $\\theta$ to the vertical.',
      figure: 'conical',
      steps: [
        { text: 'Vertically the bob is in equilibrium:', latex: String.raw`F_\mathrm{T}\cos\theta = mg` },
        {
          text: 'The horizontal component points to the centre and provides the centripetal force:',
          latex: String.raw`F_\mathrm{T}\sin\theta = \frac{mv^{2}}{r}`,
        },
        {
          text: 'Divide to eliminate $F_\\mathrm{T}$ (the same result as the banked track):',
          latex: String.raw`\tan\theta = \frac{v^{2}}{rg}`,
        },
        {
          text: 'With $r = L\\sin\\theta$ and $v = r\\omega$, the horizontal equation gives $F_\\mathrm{T} = mL\\omega^2$. With the vertical one, $\\cos\\theta = g/(L\\omega^2)$, so the period is',
          latex: String.raw`T = \frac{2\pi}{\omega} = 2\pi\sqrt{\frac{L\cos\theta}{g}}`,
        },
      ],
      result: String.raw`\tan\theta = \frac{v^{2}}{rg} \qquad T = 2\pi\sqrt{\frac{L\cos\theta}{g}}`,
    },
  ],

  equations: [
    { name: 'Angular speed', latex: String.raw`\omega = \frac{\Delta\theta}{\Delta t} = \frac{2\pi}{T} = 2\pi f` },
    { name: 'Speed and angular speed', latex: String.raw`v = r\omega` },
    { name: 'Centripetal acceleration', latex: String.raw`a = \frac{v^{2}}{r} = r\omega^{2}`, note: 'towards the centre' },
    { name: 'Centripetal force', latex: String.raw`F = \frac{mv^{2}}{r} = mr\omega^{2}`, note: 'resultant of the real forces' },
    { name: 'Vertical circle: top', latex: String.raw`F_\mathrm{T} + mg = \frac{mv^{2}}{r}` },
    { name: 'Vertical circle: bottom', latex: String.raw`F_\mathrm{T} - mg = \frac{mv^{2}}{r}` },
    { name: 'Least speed at the top', latex: String.raw`v_\mathrm{min} = \sqrt{gr}`, note: 'string slack, loop, hump' },
    { name: 'Banked track, cone', latex: String.raw`\tan\theta = \frac{v^{2}}{rg}` },
    { name: 'Conical pendulum period', latex: String.raw`T = 2\pi\sqrt{\frac{L\cos\theta}{g}}` },
  ],

  symbols: [
    { symbol: '\\theta', meaning: 'angle turned, bank or cone angle', unit: '\\mathrm{rad}' },
    { symbol: '\\omega', meaning: 'angular speed', unit: '\\mathrm{rad\\,s^{-1}}' },
    { symbol: 'T', meaning: 'period (one revolution)', unit: '\\mathrm{s}' },
    { symbol: 'f', meaning: 'frequency (rev per second)', unit: '\\mathrm{Hz}' },
    { symbol: 'r', meaning: 'radius of the circle', unit: '\\mathrm{m}' },
    { symbol: 'v', meaning: 'speed', unit: '\\mathrm{m\\,s^{-1}}' },
    { symbol: 'a', meaning: 'centripetal acceleration', unit: '\\mathrm{m\\,s^{-2}}' },
    { symbol: 'F', meaning: 'centripetal (resultant) force', unit: '\\mathrm{N}' },
    { symbol: 'F_\\mathrm{T}', meaning: 'tension', unit: '\\mathrm{N}' },
    { symbol: 'N', meaning: 'normal contact force', unit: '\\mathrm{N}' },
    { symbol: 'm', meaning: 'mass', unit: '\\mathrm{kg}' },
    { symbol: 'L', meaning: 'length of the string', unit: '\\mathrm{m}' },
    { symbol: 'g', meaning: 'free-fall acceleration, 9.81', unit: '\\mathrm{m\\,s^{-2}}' },
  ],

  samples: [
    {
      title: 'Horizontal circle on a string',
      question:
        'A 0.20 kg puck on a smooth horizontal table is tied to a string and moves in a circle of radius 0.50 m, making 3.0 revolutions per second. Calculate its angular speed, its speed and the tension in the string.',
      steps: [
        {
          text: 'Revolutions per second is the frequency $f$:',
          latex: String.raw`\omega = 2\pi f = 2\pi \times 3.0\ \mathrm{s^{-1}} = 18.85\ \mathrm{rad\,s^{-1}}`,
        },
        {
          text: 'Speed:',
          latex: String.raw`v = r\omega = 0.50\ \mathrm{m} \times 18.85\ \mathrm{rad\,s^{-1}} = 9.42\ \mathrm{m\,s^{-1}}`,
        },
        {
          text: 'The tension is the only horizontal force, so it is the centripetal force:',
          latex: String.raw`F_\mathrm{T} = mr\omega^{2} = 0.20 \times 0.50 \times 18.85^{2} = 35.5\ \mathrm{N}`,
        },
      ],
      answer: String.raw`$\omega = 19\ \mathrm{rad\,s^{-1}},\quad v = 9.4\ \mathrm{m\,s^{-1}},\quad F_\mathrm{T} = 36\ \mathrm{N}$`,
      unitCheck: String.raw`\mathrm{kg} \times \mathrm{m} \times (\mathrm{rad\,s^{-1}})^{2} = \mathrm{kg\,m\,s^{-2}} = \mathrm{N}\ \text{(the radian has no unit)}`,
    },
    {
      title: 'Vertical circle',
      question:
        'A 0.50 kg ball on a string 0.80 m long is whirled in a vertical circle. At the top its speed is 4.0 m s⁻¹. Calculate the tension at the top, the speed at the bottom and the tension at the bottom. Ignore air resistance.',
      figure: 'vertical',
      steps: [
        {
          text: 'Top: tension and weight both point to the centre. Rearrange for the tension:',
          latex: String.raw`F_\mathrm{T} = \frac{mv^{2}}{r} - mg = \frac{0.50 \times 4.0^{2}}{0.80} - 0.50 \times 9.81 = 10.0 - 4.91 = 5.1\ \mathrm{N}`,
        },
        {
          text: 'Energy from top to bottom, a drop of $2r = 1.60$ m:',
          latex: String.raw`v_\mathrm{bottom}^{2} = 4.0^{2} + 4 \times 9.81 \times 0.80 = 47.4 \;\Longrightarrow\; v_\mathrm{bottom} = 6.88\ \mathrm{m\,s^{-1}}`,
        },
        {
          text: 'Bottom: tension up, weight down:',
          latex: String.raw`F_\mathrm{T} = mg + \frac{mv^{2}}{r} = 4.91 + \frac{0.50 \times 47.4}{0.80} = 34.5\ \mathrm{N}`,
        },
        { text: 'Sense check: the bottom tension exceeds the top tension by $6mg = 29.4$ N, as the derivation predicts.' },
      ],
      answer: String.raw`$F_\mathrm{T,top} = 5.1\ \mathrm{N},\quad v_\mathrm{bottom} = 6.9\ \mathrm{m\,s^{-1}},\quad F_\mathrm{T,bottom} = 35\ \mathrm{N}$`,
      unitCheck: String.raw`\frac{\mathrm{kg}\,(\mathrm{m\,s^{-1}})^{2}}{\mathrm{m}} = \mathrm{kg\,m\,s^{-2}} = \mathrm{N}`,
    },
    {
      title: 'Conical pendulum',
      question:
        'A 0.30 kg bob on a string 1.2 m long moves in a horizontal circle with the string at 25° to the vertical. Calculate the tension, the speed of the bob and the period.',
      figure: 'conical',
      steps: [
        {
          text: 'Vertical equilibrium:',
          latex: String.raw`F_\mathrm{T} = \frac{mg}{\cos\theta} = \frac{0.30 \times 9.81}{\cos 25^\circ} = 3.25\ \mathrm{N}`,
        },
        {
          text: 'Radius of the circle (not the string length):',
          latex: String.raw`r = L\sin\theta = 1.2 \times \sin 25^\circ = 0.507\ \mathrm{m}`,
        },
        {
          text: 'From $\\tan\\theta = v^2/(rg)$:',
          latex: String.raw`v = \sqrt{rg\tan\theta} = \sqrt{0.507 \times 9.81 \times \tan 25^\circ} = 1.52\ \mathrm{m\,s^{-1}}`,
        },
        {
          text: 'Period, checked against $2\\pi\\sqrt{L\\cos\\theta/g}$:',
          latex: String.raw`T = \frac{2\pi r}{v} = \frac{2\pi \times 0.507}{1.52} = 2.09\ \mathrm{s}`,
        },
      ],
      answer: String.raw`$F_\mathrm{T} = 3.2\ \mathrm{N},\quad v = 1.5\ \mathrm{m\,s^{-1}},\quad T = 2.1\ \mathrm{s}$`,
      unitCheck: String.raw`\sqrt{\mathrm{m} \times \mathrm{m\,s^{-2}}} = \mathrm{m\,s^{-1}}`,
    },
    {
      title: 'Banked track',
      question:
        'A track is banked at 12° to the horizontal. Calculate the radius of the bend for which a car at 25 m s⁻¹ needs no friction.',
      figure: 'banked',
      steps: [
        {
          text: 'With no friction only $N$ and $mg$ act, so the banked-track result applies:',
          latex: String.raw`\tan\theta = \frac{v^{2}}{rg}`,
        },
        {
          text: '$r$ is in the denominator and $\\tan\\theta$ is the lone term on the other side: swap them in one step (cross-multiplication).',
          latex: String.raw`\tan\theta = \frac{v^{2}}{rg} \;\Longrightarrow\; r = \frac{v^{2}}{g\tan\theta}`,
        },
        {
          text: 'Substitute:',
          latex: String.raw`r = \frac{25^{2}}{9.81 \times \tan 12^\circ} = \frac{625}{2.085} = 299.7\ \mathrm{m}`,
        },
      ],
      answer: String.raw`$r = 3.0 \times 10^{2}\ \mathrm{m}$`,
      unitCheck: String.raw`\frac{(\mathrm{m\,s^{-1}})^{2}}{\mathrm{m\,s^{-2}}} = \mathrm{m}`,
    },
  ],

  practice: [
    { question: 'A wheel turns at 2.5 revolutions per second. Calculate its angular speed.', answer: '16 rad s⁻¹ (15.7)' },
    { question: 'Express an angle of 150° in radians.', answer: '2.6 rad (5π/6)' },
    {
      question: 'A disc turns at 500 revolutions per minute. Calculate the speed of a point 5.5 cm from its centre.',
      answer: '2.9 m s⁻¹',
    },
    {
      question: 'A 1200 kg car takes a flat bend of radius 50 m at 15 m s⁻¹. Calculate the friction force needed.',
      answer: '5.4 × 10³ N',
    },
    {
      question:
        'Calculate the least speed at the top of a vertical loop of radius 6.0 m for a roller-coaster car to stay on the track.',
      answer: '7.7 m s⁻¹',
    },
    {
      question:
        'A car drives over a hump-backed bridge whose top is part of a circle of radius 20 m. Calculate the greatest speed at which it stays in contact with the road.',
      answer: '14 m s⁻¹',
    },
    {
      question:
        '2.0 kg of water in a bucket is swung in a vertical circle of radius 0.90 m. At the bottom its speed is 6.0 m s⁻¹. Calculate the force the bucket exerts on the water there.',
      answer: '1.0 × 10² N (99.6)',
    },
    { question: 'A conical pendulum has a string 0.75 m long at 30° to the vertical. Calculate its period.', answer: '1.6 s' },
    {
      question: 'An aircraft makes a level turn at 120 m s⁻¹, banked at 35°. Calculate the radius of the turn.',
      answer: '2.1 × 10³ m',
    },
    {
      question:
        'A 0.050 kg mass on a string is whirled in a vertical circle with no energy losses. Calculate how much larger the tension is at the bottom than at the top.',
      answer: '2.9 N (6mg)',
    },
  ],

  other: {
    mistakes: [
      {
        wrong: 'Use ω in degrees per second or revolutions per minute.',
        right: 'ω must be in rad s⁻¹: multiply rev s⁻¹ by 2π; divide rpm by 60 first.',
      },
      {
        wrong: 'Draw “centripetal force” as an extra arrow on the free-body diagram.',
        right: 'Draw only the real forces. Their resultant towards the centre equals mv²/r.',
      },
      {
        wrong: 'At the top of a vertical circle, $F_\\mathrm{T} - mg = mv^2/r$.',
        right: 'At the top both forces point to the centre: $F_\\mathrm{T} + mg = mv^2/r$.',
      },
      { wrong: 'Use the string length as the radius of a conical pendulum.', right: 'r = L sin θ.' },
      {
        wrong: 'Constant speed, so the object is in equilibrium.',
        right:
          'Its velocity changes, so there is a resultant force. In a horizontal circle only the vertical components balance.',
      },
    ],
    tips: [
      'Draw the free-body diagram first and mark the centre: “towards the centre” is positive.',
      'Horizontal circle: write two equations (vertical balance, horizontal = mv²/r) and divide them to eliminate the unknown force.',
      'Vertical circle: the speed changes, so link the top and bottom with energy conservation.',
      'The centripetal force is perpendicular to the motion, so it does no work and never changes the kinetic energy.',
    ],
    syllabus: [
      '9702 topic 12, Motion in a circle: the radian, angular displacement, ω = 2π/T, v = rω, a = rω² = v²/r and F = mrω² = mv²/r. Coursebook Chapter 16.',
      'A Level only: not part of AS.',
      'Banked tracks, vertical circles and conical pendulums are not listed separately: exam questions use them as applications of F = mv²/r, so learn the method rather than the special formulas.',
      'Orbits (gravity as the centripetal force) are in Chapter 17.',
    ],
    links: [
      { label: 'Circular Motion Lab: horizontal, vertical and conical (simulation)', href: '/simulations/circular-motion' },
      { label: 'A Level practice questions for this lesson', href: '/practice/db2c98d5-dd86-5faf-9121-5533bdd5d212?c=a-level' },
    ],
  },

  diagrams: [
    {
      id: 'top-view',
      title: 'Velocity, force and acceleration',
      caption: 'Velocity is along the tangent; the resultant force and the acceleration both point to the centre, at 90° to it.',
      alt: 'Top view of a circle with an object at two positions. At one, a velocity arrow along the tangent and a force arrow to the centre, at right angles. At the other, a velocity arrow along the tangent and an acceleration arrow to the centre. A dashed radius r and an angular speed arrow omega.',
      width: 300,
      height: 240,
      shapes: [
        { kind: 'circle', centre: C1, radius: R1, role: 'muted' },
        { kind: 'dot', at: C1, radius: 2.5, role: 'ink' },
        { kind: 'line', from: C1, to: pR, role: 'ink', dashed: true, thin: true },
        { kind: 'label', at: [round((C1[0] + pR[0]) / 2) + 8, round((C1[1] + pR[1]) / 2) - 4], text: 'r' },
        { kind: 'arc', centre: C1, radius: 24, from: 40, to: 112, role: 'muted' },
        { kind: 'arrow', from: onCircle(C1, 24, 104), to: omegaTip, role: 'muted' },
        { kind: 'label', at: [C1[0] + 4, C1[1] - 30], text: 'ω', anchor: 'middle' },

        { kind: 'arrow', from: pA, to: along(pA, tangent(50), 58), role: 'velocity' },
        { kind: 'label', at: along(along(pA, tangent(50), 58), [-1, 0], 8), text: 'v', role: 'velocity', anchor: 'end' },
        { kind: 'arrow', from: pA, to: along(pA, inward(50), 46), role: 'force' },
        { kind: 'label', at: along(along(pA, inward(50), 46), dir(-20), 14), text: 'F', role: 'force' },
        { kind: 'rightAngle', at: pA, a: tangent(50), b: inward(50), size: 9 },
        { kind: 'dot', at: pA, radius: 6.5 },

        { kind: 'arrow', from: pB, to: along(pB, tangent(210), 58), role: 'velocity' },
        { kind: 'label', at: along(along(pB, tangent(210), 58), [-1, 0], 8), text: 'v', role: 'velocity', anchor: 'end' },
        { kind: 'arrow', from: pB, to: along(pB, inward(210), 46), role: 'acceleration' },
        { kind: 'label', at: along(along(pB, inward(210), 46), [0, -1], 7), text: 'a', role: 'acceleration', anchor: 'middle' },
        { kind: 'rightAngle', at: pB, a: tangent(210), b: inward(210), size: 9 },
        { kind: 'dot', at: pB, radius: 6.5 },
      ],
    },
    {
      id: 'velocity-triangle',
      title: 'Why Δv points to the centre',
      caption:
        'Redraw v₁ and v₂ from one point: the change Δv joins their tips and is parallel to the radius, pointing to the centre.',
      alt: 'Left: part of a circle with two positions an angle delta theta apart, each with its velocity along the tangent. Right: the two velocity vectors drawn from one point, an angle delta theta apart, with delta v joining the tip of v1 to the tip of v2, pointing in the direction of the centre.',
      width: 330,
      height: 240,
      shapes: [
        { kind: 'line', from: O2, to: P1, role: 'muted', thin: true },
        { kind: 'line', from: O2, to: P2, role: 'muted', thin: true },
        { kind: 'arc', centre: O2, radius: R2, from: 45, to: 115, role: 'muted' },
        { kind: 'arc', centre: O2, radius: 22, from: 60, to: 100, role: 'ink' },
        { kind: 'label', at: [O2[0] + 4, O2[1] - 28], text: 'Δθ', anchor: 'middle' },
        { kind: 'dot', at: O2, radius: 2.5 },
        { kind: 'arrow', from: P1, to: along(P1, tangent(60), 52), role: 'velocity' },
        { kind: 'label', at: along(P1, tangent(60), 60), text: 'v_1', role: 'velocity', anchor: 'end' },
        { kind: 'arrow', from: P2, to: along(P2, tangent(100), 52), role: 'velocity' },
        { kind: 'label', at: along(along(P2, tangent(100), 52), [0, 1], 18), text: 'v_2', role: 'velocity', anchor: 'middle' },
        { kind: 'dot', at: P1, radius: 5 },
        { kind: 'dot', at: P2, radius: 5 },

        { kind: 'arrow', from: Q, to: V1tip, role: 'velocity' },
        {
          kind: 'label',
          at: [round((Q[0] + V1tip[0]) / 2) + 6, round((Q[1] + V1tip[1]) / 2) - 8],
          text: 'v_1',
          role: 'velocity',
        },
        { kind: 'arrow', from: Q, to: V2tip, role: 'velocity' },
        {
          kind: 'label',
          at: [round((Q[0] + V2tip[0]) / 2) + 4, round((Q[1] + V2tip[1]) / 2) + 20],
          text: 'v_2',
          role: 'velocity',
        },
        { kind: 'arrow', from: V1tip, to: V2tip, role: 'acceleration' },
        {
          kind: 'label',
          at: [round((V1tip[0] + V2tip[0]) / 2) - 8, round((V1tip[1] + V2tip[1]) / 2) + 4],
          text: 'Δv',
          role: 'acceleration',
          anchor: 'end',
        },
        { kind: 'arc', centre: Q, radius: 26, from: 150, to: 190, role: 'ink' },
        { kind: 'label', at: along(Q, dir(170), 46), text: 'Δθ', anchor: 'middle' },
      ],
    },
    {
      id: 'banked',
      title: 'Banked track, rear view',
      caption: '$N\\cos\\theta$ balances the weight; $N\\sin\\theta$ points to the centre of the bend and provides $mv^2/r$.',
      alt: 'A car on a road sloping up at angle theta, seen from behind. The normal contact force N acts perpendicular to the road, at theta to the vertical. Dashed components N cos theta (vertical) and N sin theta (horizontal, towards the centre of the bend). The weight mg acts straight down. An arrow at the top shows the direction of the centre.',
      width: 330,
      height: 240,
      shapes: [
        { kind: 'surface', from: roadStart, to: roadEnd, side: 'right' },
        { kind: 'line', from: roadStart, to: [roadStart[0] + 90, roadStart[1]], role: 'muted', dashed: true, thin: true },
        { kind: 'arc', centre: roadStart, radius: 62, from: 0, to: BANK, role: 'ink' },
        { kind: 'label', at: [roadStart[0] + 72, roadStart[1] - 6], text: 'θ' },
        { kind: 'polygon', points: carCorners, role: 'ink', fill: 'soft' },
        { kind: 'polygon', points: carCorners, role: 'ink' },
        { kind: 'arrow', from: G, to: Ntip, role: 'force' },
        { kind: 'label', at: [Ntip[0] - 6, Ntip[1] - 4], text: 'N', role: 'force', anchor: 'end' },
        {
          kind: 'arrow',
          from: G,
          to: [G[0], round(G[1] - NLEN * Math.cos((BANK * Math.PI) / 180))],
          role: 'force',
          dashed: true,
        },
        {
          kind: 'label',
          at: [G[0] + 6, round(G[1] - NLEN * Math.cos((BANK * Math.PI) / 180)) + 10],
          text: 'N |cos| θ',
          role: 'force',
        },
        {
          kind: 'arrow',
          from: G,
          to: [round(G[0] - NLEN * Math.sin((BANK * Math.PI) / 180)), G[1]],
          role: 'force',
          dashed: true,
        },
        {
          kind: 'label',
          at: [round(G[0] - NLEN * Math.sin((BANK * Math.PI) / 180)) + 2, G[1] - 12],
          text: 'N |sin| θ',
          role: 'force',
          anchor: 'end',
        },
        { kind: 'arrow', from: G, to: [G[0], G[1] + 66], role: 'force' },
        { kind: 'label', at: [G[0] + 8, G[1] + 64], text: 'mg', role: 'force' },
        { kind: 'arc', centre: G, radius: 40, from: 90, to: 90 + BANK, role: 'ink' },
        { kind: 'label', at: along(G, dir(90 + BANK / 2), 50), text: 'θ', anchor: 'middle' },
        { kind: 'arrow', from: [110, 24], to: [40, 24], role: 'muted' },
        { kind: 'label', at: [116, 28], text: 'centre of the bend', style: 'note', role: 'muted' },
      ],
    },
    {
      id: 'vertical',
      title: 'Vertical circle on a string',
      caption:
        'At the top, tension and weight both point to the centre. At the bottom, tension points to the centre and weight away from it.',
      alt: 'A circle in a vertical plane with a mass on a string from the centre. At the top: velocity along the tangent, tension and weight both pointing down towards the centre. At the bottom: velocity along the tangent, tension pointing up to the centre and weight pointing down.',
      width: 300,
      height: 310,
      shapes: [
        { kind: 'circle', centre: C4, radius: R4, role: 'muted', dashed: true },
        { kind: 'line', from: C4, to: [C4[0], top[1] + 8], role: 'ink', thin: true },
        { kind: 'line', from: C4, to: [C4[0], bottom[1] - 8], role: 'ink', thin: true },
        { kind: 'dot', at: C4, radius: 3 },
        { kind: 'label', at: [C4[0] + 10, C4[1] + 4], text: 'centre', style: 'note', role: 'muted' },

        { kind: 'arrow', from: [top[0] - 8, top[1] + 8], to: [top[0] - 8, top[1] + 52], role: 'force' },
        { kind: 'label', at: [top[0] - 14, top[1] + 46], text: 'F_T', role: 'force', anchor: 'end' },
        { kind: 'arrow', from: [top[0] + 8, top[1] + 8], to: [top[0] + 8, top[1] + 44], role: 'force' },
        { kind: 'label', at: [top[0] + 14, top[1] + 42], text: 'mg', role: 'force' },
        { kind: 'arrow', from: top, to: [top[0] - 62, top[1]], role: 'velocity' },
        { kind: 'label', at: [top[0] - 66, top[1] - 8], text: 'v_{top}', role: 'velocity', anchor: 'middle' },
        { kind: 'dot', at: top, radius: 7 },
        { kind: 'label', at: [top[0] + 14, top[1] - 12], text: 'top', style: 'note', role: 'muted' },

        { kind: 'arrow', from: [bottom[0] - 8, bottom[1] - 8], to: [bottom[0] - 8, bottom[1] - 58], role: 'force' },
        { kind: 'label', at: [bottom[0] - 14, bottom[1] - 40], text: 'F_T', role: 'force', anchor: 'end' },
        { kind: 'arrow', from: [bottom[0] + 8, bottom[1] + 8], to: [bottom[0] + 8, bottom[1] + 46], role: 'force' },
        { kind: 'label', at: [bottom[0] + 14, bottom[1] + 44], text: 'mg', role: 'force' },
        { kind: 'arrow', from: bottom, to: [bottom[0] + 62, bottom[1]], role: 'velocity' },
        { kind: 'label', at: [bottom[0] + 66, bottom[1] + 20], text: 'v_{bottom}', role: 'velocity', anchor: 'middle' },
        { kind: 'dot', at: bottom, radius: 7 },
        { kind: 'label', at: [bottom[0] - 16, bottom[1] + 22], text: 'bottom', style: 'note', role: 'muted', anchor: 'end' },
      ],
    },
    {
      id: 'conical',
      title: 'Conical pendulum',
      caption:
        '$F_\\mathrm{T}\\cos\\theta$ balances the weight; $F_\\mathrm{T}\\sin\\theta$ points to the centre of the horizontal circle, of radius $r = L\\sin\\theta$.',
      alt: 'A string of length L hangs from a fixed point at angle theta to the vertical, with a bob moving in a horizontal circle of radius r below the point, at depth h. Forces on the bob: tension along the string towards the pivot, with dashed vertical and horizontal components, and weight mg downwards.',
      width: 330,
      height: 290,
      shapes: [
        { kind: 'surface', from: [P5[0] - 50, P5[1]], to: [P5[0] + 50, P5[1]], side: 'left' },
        { kind: 'ellipse', centre: O5, rx: round(bob[0] - O5[0]), ry: 20, role: 'muted', dashed: true },
        { kind: 'line', from: P5, to: O5, role: 'muted', dashed: true, thin: true },
        { kind: 'label', at: [P5[0] - 8, round((P5[1] + O5[1]) / 2) + 20], text: 'h', anchor: 'end' },
        { kind: 'line', from: O5, to: [round(2 * O5[0] - bob[0]), O5[1]], role: 'muted', dashed: true, thin: true },
        { kind: 'label', at: [round((3 * O5[0] - bob[0]) / 2), O5[1] - 6], text: 'r', anchor: 'middle' },
        { kind: 'dot', at: O5, radius: 2.5 },
        { kind: 'line', from: P5, to: bob, role: 'ink' },
        { kind: 'label', at: [round((P5[0] + bob[0]) / 2) + 10, round((P5[1] + bob[1]) / 2) - 4], text: 'L' },
        { kind: 'arc', centre: P5, radius: 40, from: -90, to: -90 + TH5, role: 'ink' },
        { kind: 'label', at: along(P5, dir(-90 + TH5 / 2), 54), text: 'θ', anchor: 'middle' },
        { kind: 'arrow', from: bob, to: along(bob, towardPivot, FT), role: 'force' },
        { kind: 'label', at: along(along(bob, towardPivot, FT), [-1, 0], 8), text: 'F_T', role: 'force', anchor: 'end' },
        {
          kind: 'arrow',
          from: bob,
          to: [bob[0], round(bob[1] - FT * Math.cos((TH5 * Math.PI) / 180))],
          role: 'force',
          dashed: true,
        },
        {
          kind: 'label',
          at: [bob[0] + 8, round(bob[1] - FT * Math.cos((TH5 * Math.PI) / 180)) + 6],
          text: 'F_T |cos| θ',
          role: 'force',
        },
        {
          kind: 'arrow',
          from: bob,
          to: [round(bob[0] - FT * Math.sin((TH5 * Math.PI) / 180)), bob[1]],
          role: 'force',
          dashed: true,
        },
        { kind: 'label', at: [bob[0] - 8, bob[1] + 38], text: 'F_T |sin| θ', role: 'force', anchor: 'end' },
        { kind: 'arrow', from: bob, to: [bob[0], bob[1] + 62], role: 'force' },
        { kind: 'label', at: [bob[0] + 8, bob[1] + 60], text: 'mg', role: 'force' },
        { kind: 'dot', at: bob, radius: 7 },
      ],
    },
  ],

  pages: [
    ['explanation', { section: 'derivations', from: 0, to: 1 }],
    [{ section: 'derivations', from: 1, to: 3 }],
    [{ section: 'derivations', from: 3 }, 'equations'],
    [{ section: 'samples', from: 0, to: 2 }],
    [{ section: 'samples', from: 2 }],
    ['practice', 'other'],
  ],
};
