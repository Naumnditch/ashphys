import type { CheatSheet, Point } from '../types';
import { along, dir, inward, onCircle, round, tangent } from '../draw';

/*
 * A Level 9702 · coursebook Chapter 17 Gravitational fields (sections
 * 17.1–17.7), syllabus topic 13. A Level only: not in AS.
 *
 * Constants used throughout: G = 6.67 × 10⁻¹¹ N m² kg⁻², Earth M = 5.97 × 10²⁴ kg,
 * R = 6.37 × 10⁶ m (these give g = 9.81 N kg⁻¹ at the surface). Every number in
 * the samples and practice answers is recomputed in
 * lib/cheatsheets/__tests__/cheatsheets.test.ts.
 */

// Fig. 1 · radial field of a planet, with a test mass m.
const C1: Point = [150, 130];
const R1 = 42;
const LINES = [0, 45, 90, 135, 180, 225, 270, 315];
const mAt = onCircle(C1, 104, 22.5);

// Fig. 2 · uniform field near the surface.
const GROUND = 196;
const COLS = [60, 105, 150, 195, 240];

// Fig. 3 · φ against r: x = 60 + 25 r/R, y = 40 + 175 R/r (φ = 0 is the r axis at y = 40).
const X0 = 60;
const Y0 = 40;
const px = (rOverR: number) => round(X0 + 25 * rOverR);
const py = (rOverR: number) => round(Y0 + 175 / rOverR);
const curve: Point[] = Array.from({ length: 35 }, (_, i) => 1 + i * 0.25).map((k) => [px(k), py(k)] as Point);
// Tangent at r = 2R: dy/dx = −4375/(x − 60)² = −1.75 there.
const tx = px(2);
const ty = py(2);

// Fig. 4 · a satellite in a circular orbit.
const C4: Point = [150, 125];
const R4 = 95;
const sat = onCircle(C4, R4, 40);
const rEnd = onCircle(C4, R4, -35);

export const aLevelGravitationalFields: CheatSheet = {
  slug: 'a-level-gravitational-fields',
  topicId: '748a497a-deae-518a-a929-236d0930052b',
  // The other Chapter 17 lessons: this sheet covers the whole chapter.
  alsoCovers: [
    'f779851e-a0d7-547b-b5a0-d558fa4769be',
    '3dbf9699-434d-4abd-93a9-3d272b99c33d',
    'd22251cb-cf0a-5cdb-a0a6-bea9552467ec',
    '1585a36a-5b5c-5505-abe3-98e37e28c48b',
    'bfae2a74-7c35-44c1-b9b0-f286554f329b',
    '663cb445-bbf3-4c10-b9c6-b9a0f8be4bbe',
  ],
  curriculumId: 'a-level',
  title: 'Gravitational fields',
  lessonCode: '17.1',
  chapter: { number: 17, title: 'Gravitational fields' },
  syllabusSections: ['17.1', '17.2', '17.3', '17.4', '17.5', '17.6', '17.7'],
  goal: 'Use F = GMm/r², g = GM/r² and φ = −GM/r, and analyse circular orbits, including geostationary satellites.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'A gravitational field is a region in which a mass feels a force. Its strength at a point is the force per unit mass on a small test mass placed there, $g = F/m$, in N kg⁻¹. The force is always attractive.',
      'Two point masses attract with $F = GMm/r^2$: proportional to each mass and inversely proportional to the square of the distance between their centres. Outside a uniform sphere, the sphere acts as if all its mass were at its centre, so $r$ is always measured from the centre. Dividing by $m$ gives the field of a point mass, $g = GM/r^2$.',
      'Field lines show the direction of the force on a mass; their spacing shows the strength. Round a planet they are radial and point inwards. Near the surface they are almost parallel and equally spaced: the field is nearly uniform, so $g \\approx 9.81$ N kg⁻¹ and $\\Delta E_\\mathrm{p} = mg\\Delta h$ work only for heights much smaller than the radius.',
      'Gravitational potential $\\varphi = -GM/r$ is zero at infinity and negative everywhere else: work must be done to pull a mass away. The potential energy of a mass $m$ is $E_\\mathrm{p} = m\\varphi = -GMm/r$, and moving it changes its energy by $m\\Delta\\varphi$.',
      'For an orbit, gravity provides the centripetal force. So $GMm/r^2 = mv^2/r$, giving $v = \\sqrt{GM/r}$ and $T^2 \\propto r^3$, whatever the satellite’s mass.',
    ],
    keyTerms: [
      {
        term: 'Gravitational field strength',
        source: 'paraphrase',
        text: 'The gravitational force per unit mass on a small test mass at that point, $g = F/m$.',
      },
      {
        term: 'Gravitational potential (syllabus)',
        source: 'syllabus',
        text: 'The work done per unit mass in bringing a small test mass from infinity to the point.',
      },
      {
        term: 'Newton’s law of gravitation',
        source: 'paraphrase',
        text: 'Two point masses attract each other with a force proportional to the product of their masses and inversely proportional to the square of their separation.',
      },
      {
        term: 'Geostationary orbit (syllabus)',
        source: 'syllabus',
        text: 'A satellite in a geostationary orbit remains at the same point above the Earth’s surface, with an orbital period of 24 hours, orbiting from west to east, directly above the Equator.',
      },
    ],
    figures: ['radial-field', 'uniform-field'],
  },

  derivations: [
    {
      id: 'field-strength',
      title: 'Field strength of a point mass',
      setup: 'Put a small test mass $m$ at distance $r$ from the centre of a mass $M$, and use the definition $g = F/m$.',
      steps: [
        { text: 'Newton’s law of gravitation gives the force on the test mass:', latex: String.raw`F = \frac{GMm}{r^{2}}` },
        {
          text: 'Field strength is force per unit mass, so divide by $m$; the test mass cancels:',
          latex: String.raw`g = \frac{F}{m} = \frac{GM}{r^{2}}`,
        },
        {
          text: 'At the surface, $r = R$ and $g_0 = GM/R^2$. Dividing the two gives how $g$ falls with distance (inverse square):',
          latex: String.raw`\frac{g}{g_{0}} = \frac{R^{2}}{r^{2}}`,
        },
      ],
      result: String.raw`g = \frac{GM}{r^{2}}`,
    },
    {
      id: 'potential',
      title: 'Potential and potential energy',
      setup:
        'Potential is zero at infinity. A mass coming in from infinity is pulled by the field, so the work done on it per unit mass is negative.',
      figure: 'potential-graph',
      steps: [
        { text: 'The potential of a point mass:', latex: String.raw`\varphi = -\frac{GM}{r}` },
        {
          text: 'The potential energy of a mass $m$ at distance $r$ is $m$ times the potential:',
          latex: String.raw`E_\mathrm{p} = m\varphi = -\frac{GMm}{r}`,
        },
        {
          text: 'Moving from $r_1$ out to $r_2$ raises the potential (towards zero), so it takes energy:',
          latex: String.raw`\Delta E_\mathrm{p} = m\Delta\varphi = GMm\left(\frac{1}{r_{1}} - \frac{1}{r_{2}}\right)`,
        },
        {
          text: 'The field strength is the size of the gradient of the potential–distance graph:',
          latex: String.raw`g = -\frac{\Delta\varphi}{\Delta r}`,
        },
      ],
      result: String.raw`\varphi = -\frac{GM}{r} \qquad E_\mathrm{p} = -\frac{GMm}{r}`,
    },
    {
      id: 'orbits',
      title: 'Circular orbits and T² ∝ r³',
      setup:
        'A satellite of mass $m$ orbits a planet of mass $M$ at radius $r$. Gravity is the only force on it, so gravity provides the centripetal force.',
      figure: 'orbit',
      steps: [
        { text: 'Gravitational force = centripetal force:', latex: String.raw`\frac{GMm}{r^{2}} = \frac{mv^{2}}{r}` },
        {
          text: 'Cancel $m$ and one $r$: the orbital speed does not depend on the satellite’s mass.',
          latex: String.raw`v = \sqrt{\frac{GM}{r}}`,
        },
        {
          text: 'Substitute $v = 2\\pi r/T$ and square:',
          latex: String.raw`\frac{4\pi^{2}r^{2}}{T^{2}} = \frac{GM}{r} \;\Longrightarrow\; T^{2} = \frac{4\pi^{2}}{GM}\,r^{3}`,
        },
        { text: 'For satellites of the same planet $4\\pi^2/GM$ is constant, so $T^2 \\propto r^3$.' },
      ],
      result: String.raw`v = \sqrt{\frac{GM}{r}} \qquad T^{2} = \frac{4\pi^{2}r^{3}}{GM}`,
    },
    {
      id: 'geostationary',
      title: 'Geostationary orbit',
      setup:
        'A geostationary satellite stays above the same point on the Equator: it orbits west to east with the Earth’s rotation, with period $T = 24$ h $= 86\\,400$ s.',
      steps: [
        {
          text: 'Cross-multiply $T^2 = 4\\pi^2 r^3/(GM)$ and divide by $4\\pi^2$:',
          latex: String.raw`r^{3} = \frac{GMT^{2}}{4\pi^{2}} = \frac{6.67\times10^{-11} \times 5.97\times10^{24} \times 86\,400^{2}}{4\pi^{2}} = 7.53\times10^{22}\ \mathrm{m^{3}}`,
        },
        {
          text: 'Take the cube root, then subtract the Earth’s radius for the height:',
          latex: String.raw`r = 4.22\times10^{7}\ \mathrm{m}, \qquad h = r - R = 3.59\times10^{7}\ \mathrm{m}`,
        },
      ],
      result: String.raw`r \approx 4.2\times10^{7}\ \mathrm{m} \quad (h \approx 3.6\times10^{7}\ \mathrm{m})`,
    },
  ],

  equations: [
    { name: 'Field strength (definition)', latex: String.raw`g = \frac{F}{m}` },
    { name: 'Newton’s law of gravitation', latex: String.raw`F = \frac{GMm}{r^{2}}` },
    { name: 'Field of a point mass', latex: String.raw`g = \frac{GM}{r^{2}}`, note: 'r from the centre' },
    { name: 'Gravitational potential', latex: String.raw`\varphi = -\frac{GM}{r}`, note: 'zero at infinity' },
    { name: 'Potential energy', latex: String.raw`E_\mathrm{p} = m\varphi = -\frac{GMm}{r}` },
    { name: 'Change in potential energy', latex: String.raw`\Delta E_\mathrm{p} = m\,\Delta\varphi` },
    { name: 'Orbital speed', latex: String.raw`v = \sqrt{\frac{GM}{r}}`, note: 'from GMm/r² = mv²/r' },
    { name: 'Orbital period (T² ∝ r³)', latex: String.raw`T^{2} = \frac{4\pi^{2}r^{3}}{GM}` },
    { name: 'Near the surface only', latex: String.raw`\Delta E_\mathrm{p} = mg\,\Delta h`, note: 'when Δh ≪ R' },
  ],

  symbols: [
    { symbol: 'G', meaning: 'gravitational constant, 6.67 × 10⁻¹¹', unit: '\\mathrm{N\\,m^{2}\\,kg^{-2}}' },
    { symbol: 'M', meaning: 'mass of the planet or star', unit: '\\mathrm{kg}' },
    { symbol: 'm', meaning: 'mass of the test mass or satellite', unit: '\\mathrm{kg}' },
    { symbol: 'r', meaning: 'distance from the centre', unit: '\\mathrm{m}' },
    { symbol: 'R', meaning: 'radius of the planet', unit: '\\mathrm{m}' },
    { symbol: 'g', meaning: 'gravitational field strength', unit: '\\mathrm{N\\,kg^{-1}}' },
    { symbol: '\\varphi', meaning: 'gravitational potential', unit: '\\mathrm{J\\,kg^{-1}}' },
    { symbol: 'E_\\mathrm{p}', meaning: 'gravitational potential energy', unit: '\\mathrm{J}' },
    { symbol: 'v', meaning: 'orbital speed', unit: '\\mathrm{m\\,s^{-1}}' },
    { symbol: 'T', meaning: 'orbital period', unit: '\\mathrm{s}' },
    { symbol: 'M_\\mathrm{E}', meaning: 'Earth’s mass, 5.97 × 10²⁴', unit: '\\mathrm{kg}' },
    { symbol: 'R_\\mathrm{E}', meaning: 'Earth’s radius, 6.37 × 10⁶', unit: '\\mathrm{m}' },
  ],

  samples: [
    {
      title: 'Field strength above the surface',
      question:
        'The International Space Station orbits 4.1 × 10⁵ m above the Earth’s surface. Calculate the gravitational field strength there. Use the Earth data in the symbols list.',
      steps: [
        {
          text: '$r$ is measured from the centre of the Earth, not from the surface:',
          latex: String.raw`r = R + h = 6.37\times10^{6} + 4.1\times10^{5} = 6.78\times10^{6}\ \mathrm{m}`,
        },
        {
          text: 'Substitute into $g = GM/r^2$:',
          latex: String.raw`g = \frac{6.67\times10^{-11} \times 5.97\times10^{24}}{(6.78\times10^{6})^{2}} = 8.66\ \mathrm{N\,kg^{-1}}`,
        },
        {
          text: 'Sense check: a little less than 9.81 N kg⁻¹. Astronauts feel weightless because they are in free fall, not because $g$ is zero.',
        },
      ],
      answer: String.raw`$g = 8.7\ \mathrm{N\,kg^{-1}}$`,
      unitCheck: String.raw`\frac{\mathrm{N\,m^{2}\,kg^{-2}} \times \mathrm{kg}}{\mathrm{m^{2}}} = \mathrm{N\,kg^{-1}}`,
    },
    {
      title: 'Energy to lift a probe a long way up',
      question:
        'A 500 kg probe is lifted from the Earth’s surface to a height equal to the Earth’s radius. Calculate the increase in its gravitational potential energy.',
      steps: [
        {
          text: 'Potential at the surface ($r = R$) and at height $R$ ($r = 2R$):',
          latex: String.raw`\varphi_{R} = -\frac{GM}{R} = -6.25\times10^{7}\ \mathrm{J\,kg^{-1}}, \qquad \varphi_{2R} = -3.13\times10^{7}\ \mathrm{J\,kg^{-1}}`,
        },
        {
          text: 'Change in potential energy:',
          latex: String.raw`\Delta E_\mathrm{p} = m\Delta\varphi = 500 \times 3.13\times10^{7} = 1.56\times10^{10}\ \mathrm{J}`,
        },
        {
          text: 'Why not $mgh$? It gives $3.1\\times10^{10}$ J, twice too much, because $g$ falls to a quarter of its surface value over this height.',
        },
      ],
      answer: String.raw`$\Delta E_\mathrm{p} = 1.6\times10^{10}\ \mathrm{J}$`,
      unitCheck: String.raw`\mathrm{kg} \times \mathrm{J\,kg^{-1}} = \mathrm{J}`,
    },
    {
      title: 'Speed and period of a satellite',
      question: 'A satellite orbits 2.0 × 10⁶ m above the Earth’s surface. Calculate its orbital speed and its period.',
      figure: 'orbit',
      steps: [
        {
          text: 'Radius of the orbit, from the centre:',
          latex: String.raw`r = 6.37\times10^{6} + 2.0\times10^{6} = 8.37\times10^{6}\ \mathrm{m}`,
        },
        {
          text: 'Gravity provides the centripetal force, so:',
          latex: String.raw`v = \sqrt{\frac{GM}{r}} = \sqrt{\frac{6.67\times10^{-11} \times 5.97\times10^{24}}{8.37\times10^{6}}} = 6.90\times10^{3}\ \mathrm{m\,s^{-1}}`,
        },
        {
          text: 'One orbit is a distance $2\\pi r$:',
          latex: String.raw`T = \frac{2\pi r}{v} = \frac{2\pi \times 8.37\times10^{6}}{6.90\times10^{3}} = 7.62\times10^{3}\ \mathrm{s}`,
        },
      ],
      answer: String.raw`$v = 6.9\times10^{3}\ \mathrm{m\,s^{-1}}$, $T = 7.6\times10^{3}$ s (about 2.1 hours)`,
      unitCheck: String.raw`\sqrt{\frac{\mathrm{N\,m^{2}\,kg^{-2}} \times \mathrm{kg}}{\mathrm{m}}} = \sqrt{\mathrm{m^{2}\,s^{-2}}} = \mathrm{m\,s^{-1}}`,
    },
    {
      title: 'Weighing the Earth with the Moon',
      question:
        'The Moon orbits the Earth at a radius of 3.84 × 10⁸ m with a period of 27.3 days. Calculate the mass of the Earth.',
      steps: [
        { text: 'Period in seconds:', latex: String.raw`T = 27.3 \times 86\,400 = 2.36\times10^{6}\ \mathrm{s}` },
        {
          text: '$M$ is in the denominator and $T^2$ is the lone term on the other side: swap them in one step (cross-multiplication).',
          latex: String.raw`T^{2} = \frac{4\pi^{2}r^{3}}{GM} \;\Longrightarrow\; M = \frac{4\pi^{2}r^{3}}{GT^{2}}`,
        },
        {
          text: 'Substitute:',
          latex: String.raw`M = \frac{4\pi^{2} \times (3.84\times10^{8})^{3}}{6.67\times10^{-11} \times (2.36\times10^{6})^{2}} = 6.02\times10^{24}\ \mathrm{kg}`,
        },
      ],
      answer: String.raw`$M = 6.0\times10^{24}\ \mathrm{kg}$ (close to the accepted $5.97\times10^{24}$ kg)`,
      unitCheck: String.raw`\frac{\mathrm{m^{3}}}{\mathrm{N\,m^{2}\,kg^{-2}} \times \mathrm{s^{2}}} = \frac{\mathrm{m^{3}\,kg^{2}}}{\mathrm{kg\,m^{3}}} = \mathrm{kg}`,
    },
  ],

  practice: [
    {
      question: 'Calculate the gravitational force between two 70 kg people whose centres are 1.0 m apart.',
      answer: '3.3 × 10⁻⁷ N',
    },
    {
      question: 'The Moon has mass 7.35 × 10²² kg and radius 1.74 × 10⁶ m. Calculate the field strength at its surface.',
      answer: '1.6 N kg⁻¹',
    },
    { question: 'A planet’s field strength at distance r is g. What is it at distance 3r?', answer: 'g/9' },
    { question: 'At what height above the Earth’s surface is g half its surface value?', answer: '2.6 × 10⁶ m' },
    { question: 'Calculate the gravitational potential at the Earth’s surface.', answer: '−6.3 × 10⁷ J kg⁻¹' },
    {
      question: 'The potential at a point is −4.0 × 10⁷ J kg⁻¹. Calculate the potential energy of a 200 kg satellite there.',
      answer: '−8.0 × 10⁹ J',
    },
    {
      question: 'Calculate the speed of a satellite in a circular orbit of radius 7.0 × 10⁶ m round the Earth.',
      answer: '7.5 × 10³ m s⁻¹',
    },
    {
      question:
        'Two satellites orbit the same planet; one orbit has 4 times the radius of the other. Calculate the ratio of their periods.',
      answer: '8',
    },
    {
      question: 'Phobos orbits Mars at a radius of 9.38 × 10⁶ m with a period of 7.65 h. Calculate the mass of Mars.',
      answer: '6.4 × 10²³ kg',
    },
    { question: 'Calculate the height above the Earth’s surface of a geostationary satellite.', answer: '3.6 × 10⁷ m' },
  ],

  other: {
    mistakes: [
      { wrong: 'Use the height above the surface as r.', right: 'r is the distance from the centre: r = R + h.' },
      {
        wrong: 'Gravitational potential is positive, like height.',
        right: 'It is zero at infinity and negative everywhere else; it rises towards zero as you move away.',
      },
      { wrong: 'Use mgh for any change in height.', right: 'Only when g is constant (h ≪ R). Otherwise use ΔEp = mΔφ.' },
      { wrong: 'A heavier satellite must orbit faster.', right: 'm cancels: v = √(GM/r) depends only on M and r.' },
      {
        wrong: 'Astronauts float because there is no gravity in orbit.',
        right: 'g is still about 8.7 N kg⁻¹ at the ISS; they are in free fall with the station.',
      },
    ],
    tips: [
      'Write r = R + h at the start of every calculation above a planet.',
      'Orbits: start from GMm/r² = mv²/r (or mrω²), then cancel m.',
      'Ratio questions: use g ∝ 1/r², φ ∝ −1/r and T² ∝ r³; no constants needed.',
      'Convert periods to seconds: 24 h = 86 400 s.',
    ],
    syllabus: [
      '9702 topic 13, Gravitational fields: field strength as force per unit mass, field lines, F = Gm₁m₂/r², g = GM/r², φ = −GM/r, Ep = −GMm/r, circular orbits and geostationary orbits. Coursebook Chapter 17.',
      'A Level only: not part of AS (AS uses ΔEp = mgΔh in a uniform field).',
      'Outside a uniform sphere, treat its mass as a point mass at its centre.',
      'Gravitational and electric fields are compared in Chapter 22.',
    ],
    links: [
      { label: 'Practice: field strength of a point mass', href: '/practice/f779851e-a0d7-547b-b5a0-d558fa4769be?c=a-level' },
      { label: 'Practice: gravitational potential', href: '/practice/d22251cb-cf0a-5cdb-a0a6-bea9552467ec?c=a-level' },
      { label: 'Practice: orbits (32 questions)', href: '/practice/1585a36a-5b5c-5505-abe3-98e37e28c48b?c=a-level' },
    ],
  },

  diagrams: [
    {
      id: 'radial-field',
      title: 'Radial field of a planet',
      caption: 'Field lines point inwards, towards the centre. They spread out with distance: the field gets weaker, as $1/r^2$.',
      alt: 'A planet of mass M with eight field lines pointing radially inwards. A small test mass m at distance r from the centre feels a force F towards the centre.',
      width: 300,
      height: 260,
      shapes: [
        ...LINES.map((a) => ({
          kind: 'arrow' as const,
          from: onCircle(C1, 118, a),
          to: onCircle(C1, R1 + 6, a),
          role: 'ink' as const,
        })),
        { kind: 'circle', centre: C1, radius: R1, role: 'ink', fill: 'soft' },
        { kind: 'circle', centre: C1, radius: R1, role: 'ink' },
        { kind: 'label', at: [C1[0], C1[1] + 6], text: 'M', anchor: 'middle' },
        { kind: 'line', from: C1, to: mAt, role: 'muted', dashed: true, thin: true },
        { kind: 'label', at: [round((C1[0] + mAt[0]) / 2) + 10, round((C1[1] + mAt[1]) / 2) + 18], text: 'r' },
        { kind: 'arrow', from: mAt, to: along(mAt, inward(22.5), 34), role: 'force' },
        {
          kind: 'label',
          at: [round(along(mAt, inward(22.5), 34)[0]) + 4, round(along(mAt, inward(22.5), 34)[1]) - 10],
          text: 'F',
          role: 'force',
        },
        { kind: 'dot', at: mAt, radius: 5 },
        { kind: 'label', at: [mAt[0] + 9, mAt[1] - 6], text: 'm' },
      ],
    },
    {
      id: 'uniform-field',
      title: 'Near the surface: uniform',
      caption: 'Over heights much smaller than the radius, the field lines are parallel and equally spaced, so $g$ is constant.',
      alt: 'A flat strip of the Earth’s surface with five parallel, equally spaced field lines pointing straight down onto it.',
      width: 300,
      height: 260,
      shapes: [
        ...COLS.map((x) => ({
          kind: 'arrow' as const,
          from: [x, 50] as Point,
          to: [x, GROUND - 4] as Point,
          role: 'ink' as const,
        })),
        { kind: 'surface', from: [30, GROUND], to: [270, GROUND], side: 'right' },
        { kind: 'label', at: [150, 34], text: 'parallel, equally spaced', anchor: 'middle', style: 'note', role: 'muted' },
        { kind: 'label', at: [150, GROUND + 34], text: 'Earth’s surface', anchor: 'middle', style: 'note', role: 'muted' },
        { kind: 'label', at: [COLS[COLS.length - 1] + 8, 124], text: 'g', anchor: 'start' },
      ],
    },
    {
      id: 'potential-graph',
      title: 'Potential against distance',
      caption:
        'φ rises from −GM/R at the surface towards zero at infinity. The gradient of the graph at any point is the field strength there.',
      alt: 'Graph of gravitational potential phi against distance r from the centre. The r axis is at the top (phi = 0). The curve starts at minus GM over R at r = R and rises towards zero, flattening out. A tangent at r = 2R is labelled gradient = g.',
      width: 320,
      height: 250,
      shapes: [
        { kind: 'arrow', from: [X0, 236], to: [X0, 14], role: 'ink' },
        { kind: 'label', at: [X0 - 8, 22], text: 'φ', anchor: 'end' },
        { kind: 'arrow', from: [X0, Y0], to: [312, Y0], role: 'ink' },
        { kind: 'label', at: [306, Y0 - 8], text: 'r', anchor: 'end' },
        { kind: 'label', at: [X0 - 6, Y0 + 5], text: '0', anchor: 'end' },
        { kind: 'line', from: [px(1), Y0], to: [px(1), py(1)], role: 'muted', dashed: true, thin: true },
        { kind: 'label', at: [px(1), Y0 - 6], text: 'R', anchor: 'middle' },
        { kind: 'line', from: [X0, py(1)], to: [px(1), py(1)], role: 'muted', dashed: true, thin: true },
        { kind: 'label', at: [X0 - 4, py(1) + 5], text: '−GM/R', anchor: 'end' },
        { kind: 'curve', points: curve, role: 'ink' },
        { kind: 'line', from: [tx - 28, round(ty + 28 * 1.75)], to: [tx + 28, round(ty - 28 * 1.75)], role: 'force', thin: true },
        { kind: 'dot', at: [tx, ty], radius: 2.5, role: 'force' },
        { kind: 'label', at: [tx + 24, ty + 18], text: '|gradient| = g', style: 'note', role: 'force' },
        { kind: 'label', at: [px(5.5), py(5.5) + 30], text: 'φ = −GM/r', anchor: 'middle' },
      ],
    },
    {
      id: 'orbit',
      title: 'A satellite in a circular orbit',
      caption:
        'Gravity is the only force on the satellite: it points to the centre of the orbit and provides the centripetal force.',
      alt: 'A planet of mass M with a dashed circular orbit of radius r. A satellite of mass m on the orbit has a velocity v along the tangent and a gravitational force F towards the planet’s centre, at right angles.',
      width: 300,
      height: 250,
      shapes: [
        { kind: 'circle', centre: C4, radius: R4, role: 'muted', dashed: true },
        { kind: 'circle', centre: C4, radius: 34, role: 'ink', fill: 'soft' },
        { kind: 'circle', centre: C4, radius: 34, role: 'ink' },
        { kind: 'label', at: [C4[0], C4[1] + 6], text: 'M', anchor: 'middle' },
        { kind: 'line', from: along(C4, dir(-35), 34), to: rEnd, role: 'ink', dashed: true, thin: true },
        { kind: 'label', at: [round((C4[0] + rEnd[0]) / 2) + 14, round((C4[1] + rEnd[1]) / 2) + 2], text: 'r' },
        { kind: 'arrow', from: sat, to: along(sat, tangent(40), 56), role: 'velocity' },
        { kind: 'label', at: along(along(sat, tangent(40), 56), [0, -1], 6), text: 'v', role: 'velocity', anchor: 'middle' },
        { kind: 'arrow', from: sat, to: along(sat, inward(40), 44), role: 'force' },
        { kind: 'label', at: along(along(sat, inward(40), 44), dir(-30), 14), text: 'F', role: 'force' },
        { kind: 'rightAngle', at: sat, a: tangent(40), b: inward(40), size: 9 },
        { kind: 'dot', at: sat, radius: 6.5 },
        { kind: 'label', at: [sat[0] + 10, sat[1] - 4], text: 'm' },
      ],
    },
  ],

  pages: [
    ['explanation'],
    [{ section: 'derivations', from: 0, to: 2 }],
    [{ section: 'derivations', from: 2 }],
    ['equations', { section: 'samples', from: 0, to: 1 }],
    [{ section: 'samples', from: 1 }],
    ['practice', 'other'],
  ],
};
