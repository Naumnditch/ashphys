import type { CheatSheet, Point } from '../types';
import { along, dir, onCircle, round } from '../draw';

/*
 * A Level 9702 · coursebook Chapter 22 Coulomb's law (sections 22.1–22.5),
 * syllabus topic 18 Electric fields. A Level only: not in AS.
 *
 * Constants used throughout: 1/(4πε₀) = 8.99 × 10⁹ N m² C⁻² (ε₀ = 8.85 × 10⁻¹² F m⁻¹),
 * e = 1.60 × 10⁻¹⁹ C, G = 6.67 × 10⁻¹¹ N m² kg⁻², g = 9.81 m s⁻². Every number in
 * the samples and practice answers is recomputed in
 * lib/cheatsheets/__tests__/cheatsheets.test.ts.
 */

// Fig. 1 · radial fields: outwards from +Q, inwards to −Q.
const POS: Point = [90, 100];
const NEG: Point = [250, 100];
const RQ = 15;
const LINES = [0, 45, 90, 135, 180, 225, 270, 315];

// Fig. 2 · dipole: fields at the midpoint add.
const DP: Point = [60, 92];
const DN: Point = [290, 92];
const MID: Point = [175, 92];
const EL = 46;

// Fig. 3 · V against r: x = 60 + 25 r/R; + curve y = 125 − 90 R/r, − curve y = 125 + 90 R/r.
const X0 = 60;
const Y0 = 125;
const px = (k: number) => round(X0 + 25 * k);
const pyPos = (k: number) => round(Y0 - 90 / k);
const pyNeg = (k: number) => round(Y0 + 90 / k);
const ks = Array.from({ length: 35 }, (_, i) => 1 + i * 0.25);
// Tangent to the + curve at r = 2R: dy/dx = 2250/(x − 60)² = 0.9 there.
const tx = px(2);
const ty = pyPos(2);

// Fig. 4 · two charges: the neutral point N, a third of the way from the smaller charge.
const Q1: Point = [50, 96];
const Q2: Point = [290, 96];
const N: Point = [round(Q1[0] + (Q2[0] - Q1[0]) / 3), 96];

// Fig. 5 · two charged spheres hanging from one point, threads at θ = 15° to the vertical.
const PIV: Point = [170, 34];
const THREAD = 140;
const TH = 15;
const left = along(PIV, dir(-90 - TH), THREAD);
const right = along(PIV, dir(-90 + TH), THREAD);
const MG = 72;
const Fe = round(MG * Math.tan((TH * Math.PI) / 180));
const Tn = round(MG / Math.cos((TH * Math.PI) / 180));

export const aLevelCoulombsLaw: CheatSheet = {
  slug: 'a-level-coulombs-law',
  topicId: 'b8aa4395-27b6-432e-910b-ea927c228f27',
  // The other Chapter 22 lessons: this sheet covers the whole chapter.
  alsoCovers: [
    'c6c1d1f5-1c6b-4ab4-a15b-beea25426304',
    '98f6ff7c-f938-51ef-8ee8-ad6d4052a483',
    '8bd140d2-aaf1-5218-a708-16b05f8b7b0d',
    '6781cdf3-bd09-40d8-b79b-d7ad72c66cd6',
  ],
  curriculumId: 'a-level',
  title: 'Coulomb’s law and electric fields',
  lessonCode: '22.1',
  chapter: { number: 22, title: 'Coulomb’s law' },
  syllabusSections: ['22.1', '22.2', '22.3', '22.4', '22.5'],
  goal: 'Use F = Qq/4πε₀r², E = Q/4πε₀r² and V = Q/4πε₀r for point charges, combine fields and potentials, and compare with gravity.',
  reviewed: '2026-10-19',

  explanation: {
    paragraphs: [
      'Every charge sets up an electric field around it. The field strength at a point is the force per unit positive charge on a small test charge placed there, $E = F/q$, in N C⁻¹ (the same as V m⁻¹). Like charges repel; unlike charges attract.',
      'Two point charges exert a force $F = \\dfrac{Qq}{4\\pi\\varepsilon_0 r^2}$ on each other: Coulomb’s law, another inverse-square law. Outside a charged conducting sphere, the sphere acts as if its charge were a point charge at its centre, so $r$ is measured from the centre.',
      'Dividing by $q$ gives the field of a point charge, $E = \\dfrac{Q}{4\\pi\\varepsilon_0 r^2}$. It is radial: outwards from a positive charge, inwards towards a negative one. Fields are vectors, so fields from several charges add with their directions.',
      'Electric potential $V = \\dfrac{Q}{4\\pi\\varepsilon_0 r}$ is zero at infinity, positive near a positive charge and negative near a negative one. It is a scalar, so potentials simply add with their signs. Moving a charge $q$ through a potential difference $\\Delta V$ takes energy $q\\Delta V$, and the field is the negative potential gradient, $E = -\\Delta V/\\Delta r$.',
      'The maths matches gravity ($F = GMm/r^2$) with one big difference: gravity only attracts, while electric forces can repel. Between two protons the electric force is about $10^{36}$ times the gravitational one.',
    ],
    keyTerms: [
      {
        term: 'Electric field strength (syllabus)',
        source: 'syllabus',
        text: 'Force per unit positive charge.',
      },
      {
        term: 'Electric potential (syllabus)',
        source: 'syllabus',
        text: 'The work done per unit positive charge in bringing a small test charge from infinity to the point.',
      },
      {
        term: 'Coulomb’s law',
        source: 'paraphrase',
        text: 'Two point charges exert a force on each other proportional to the product of the charges and inversely proportional to the square of their separation.',
      },
      {
        term: 'Field lines',
        source: 'paraphrase',
        text: 'Show the direction of the force on a positive charge. They start on positive charges, end on negative charges, and are closer together where the field is stronger.',
      },
    ],
    figures: ['radial-fields', 'dipole'],
  },

  derivations: [
    {
      id: 'field-strength',
      title: 'Field strength of a point charge',
      setup: 'Put a small positive test charge $q$ at distance $r$ from a point charge $Q$, and use the definition $E = F/q$.',
      steps: [
        { text: 'Coulomb’s law gives the force on the test charge:', latex: String.raw`F = \frac{Qq}{4\pi\varepsilon_{0}r^{2}}` },
        {
          text: 'Field strength is force per unit positive charge, so divide by $q$; the test charge cancels:',
          latex: String.raw`E = \frac{F}{q} = \frac{Q}{4\pi\varepsilon_{0}r^{2}}`,
        },
        { text: 'Inverse square: doubling $r$ quarters $E$. For a negative $Q$ the field points inwards, towards the charge.' },
      ],
      result: String.raw`E = \frac{Q}{4\pi\varepsilon_{0}r^{2}}`,
    },
    {
      id: 'potential',
      title: 'Potential, potential energy and the potential gradient',
      setup:
        'Potential is zero at infinity. Bringing a positive test charge towards a positive $Q$ means pushing against the repulsion, so the work done, and the potential, are positive.',
      figure: 'potential-graph',
      steps: [
        {
          text: 'The potential of a point charge (negative for a negative $Q$):',
          latex: String.raw`V = \frac{Q}{4\pi\varepsilon_{0}r}`,
        },
        {
          text: 'A charge $q$ at that point has potential energy $qV$. The sign tells you the force: positive for repulsion, negative for attraction.',
          latex: String.raw`E_\mathrm{p} = qV = \frac{Qq}{4\pi\varepsilon_{0}r}`,
        },
        { text: 'Moving $q$ through a potential difference $\\Delta V$:', latex: String.raw`\Delta E_\mathrm{p} = q\,\Delta V` },
        {
          text: 'The field strength is the negative of the potential gradient: on a $V$–$r$ graph, $E$ is minus the gradient.',
          latex: String.raw`E = -\frac{\Delta V}{\Delta r}`,
        },
      ],
      result: String.raw`V = \frac{Q}{4\pi\varepsilon_{0}r} \qquad E_\mathrm{p} = \frac{Qq}{4\pi\varepsilon_{0}r}`,
    },
    {
      id: 'combining',
      title: 'Combining two charges',
      setup: 'With several charges, find each one’s field and potential at the point, then combine them.',
      figure: 'neutral-point',
      steps: [
        {
          text: 'Fields are vectors: draw each one (away from +, towards −) and add them with their directions.',
          latex: String.raw`\vec{E} = \vec{E}_{1} + \vec{E}_{2}`,
        },
        {
          text: 'Potentials are scalars: add them with their signs.',
          latex: String.raw`V = \frac{Q_{1}}{4\pi\varepsilon_{0}r_{1}} + \frac{Q_{2}}{4\pi\varepsilon_{0}r_{2}}`,
        },
        {
          text: 'Between two like charges there is a neutral point where the fields cancel. Distance $x$ from $Q_1$, with $d$ between the charges:',
          latex: String.raw`\frac{Q_{1}}{x^{2}} = \frac{Q_{2}}{(d-x)^{2}} \;\Longrightarrow\; \frac{d-x}{x} = \sqrt{\frac{Q_{2}}{Q_{1}}}`,
        },
        { text: 'At the neutral point $E = 0$, but $V$ is not zero: both potentials there are positive.' },
      ],
      result: String.raw`\text{add } E \text{ as vectors,} \quad \text{add } V \text{ as scalars}`,
    },
    {
      id: 'gravity',
      title: 'Electric and gravitational fields compared',
      setup: 'Both are inverse-square fields, so every equation has a partner: replace $GM$ by $Q/4\\pi\\varepsilon_0$.',
      steps: [
        {
          text: 'Force, field and potential side by side:',
          latex: String.raw`\frac{GMm}{r^{2}} \leftrightarrow \frac{Qq}{4\pi\varepsilon_{0}r^{2}}, \qquad \frac{GM}{r^{2}} \leftrightarrow \frac{Q}{4\pi\varepsilon_{0}r^{2}}, \qquad -\frac{GM}{r} \leftrightarrow \frac{Q}{4\pi\varepsilon_{0}r}`,
        },
        {
          text: 'Differences: gravity only attracts and its potential is always negative; electric forces attract or repel and $V$ can have either sign.',
        },
        {
          text: 'Both forces fall as $1/r^2$, so their ratio for two particles does not depend on $r$. For a proton and an electron:',
          latex: String.raw`\frac{F_\mathrm{E}}{F_\mathrm{G}} = \frac{e^{2}}{4\pi\varepsilon_{0}Gm_\mathrm{p}m_\mathrm{e}} = \frac{8.99\times10^{9} \times (1.60\times10^{-19})^{2}}{6.67\times10^{-11} \times 1.67\times10^{-27} \times 9.11\times10^{-31}} = 2.3\times10^{39}`,
        },
      ],
      result: String.raw`\text{same } 1/r^{2} \text{ form;} \quad F_\mathrm{E} \gg F_\mathrm{G} \text{ for particles}`,
    },
  ],

  equations: [
    { name: 'Field strength (definition)', latex: String.raw`E = \frac{F}{q}` },
    { name: 'Coulomb’s law', latex: String.raw`F = \frac{Qq}{4\pi\varepsilon_{0}r^{2}}` },
    { name: 'Field of a point charge', latex: String.raw`E = \frac{Q}{4\pi\varepsilon_{0}r^{2}}`, note: 'r from the centre' },
    { name: 'Electric potential', latex: String.raw`V = \frac{Q}{4\pi\varepsilon_{0}r}`, note: 'zero at infinity; sign of Q' },
    { name: 'Potential energy of two charges', latex: String.raw`E_\mathrm{p} = \frac{Qq}{4\pi\varepsilon_{0}r}` },
    { name: 'Work done / energy change', latex: String.raw`W = q\,\Delta V` },
    { name: 'Field and potential gradient', latex: String.raw`E = -\frac{\Delta V}{\Delta r}` },
    { name: 'Uniform field (parallel plates)', latex: String.raw`E = \frac{\Delta V}{\Delta d}` },
    { name: 'The Coulomb constant', latex: String.raw`\frac{1}{4\pi\varepsilon_{0}} = 8.99\times10^{9}`, note: 'N m² C⁻²' },
  ],

  symbols: [
    { symbol: 'Q,\\ q', meaning: 'charges', unit: '\\mathrm{C}' },
    { symbol: 'r', meaning: 'distance between centres', unit: '\\mathrm{m}' },
    { symbol: '\\varepsilon_{0}', meaning: 'permittivity of free space, 8.85 × 10⁻¹²', unit: '\\mathrm{F\\,m^{-1}}' },
    { symbol: 'F', meaning: 'electric force', unit: '\\mathrm{N}' },
    { symbol: 'E', meaning: 'electric field strength', unit: '\\mathrm{N\\,C^{-1}}' },
    { symbol: 'V', meaning: 'electric potential', unit: '\\mathrm{V}' },
    { symbol: 'E_\\mathrm{p}', meaning: 'electric potential energy', unit: '\\mathrm{J}' },
    { symbol: 'W', meaning: 'work done moving a charge', unit: '\\mathrm{J}' },
    { symbol: 'd', meaning: 'plate separation', unit: '\\mathrm{m}' },
    { symbol: 'e', meaning: 'elementary charge, 1.60 × 10⁻¹⁹', unit: '\\mathrm{C}' },
    { symbol: 'm_\\mathrm{p}', meaning: 'proton mass, 1.67 × 10⁻²⁷', unit: '\\mathrm{kg}' },
    { symbol: 'm_\\mathrm{e}', meaning: 'electron mass, 9.11 × 10⁻³¹', unit: '\\mathrm{kg}' },
  ],

  samples: [
    {
      title: 'Force between two charged spheres',
      question:
        'Two small spheres carry charges of +4.0 nC and −6.0 nC, with their centres 5.0 cm apart. Calculate the force between them and state its direction.',
      steps: [
        {
          text: 'In SI units (nC = 10⁻⁹ C, 5.0 cm = 0.050 m), Coulomb’s law with the size of each charge. Opposite signs, so the force is attractive.',
          latex: String.raw`F = \frac{8.99\times10^{9} \times 4.0\times10^{-9} \times 6.0\times10^{-9}}{0.050^{2}} = 8.63\times10^{-5}\ \mathrm{N}`,
        },
      ],
      answer: String.raw`$F = 8.6\times10^{-5}$ N, attractive`,
      unitCheck: String.raw`\frac{\mathrm{N\,m^{2}\,C^{-2}} \times \mathrm{C} \times \mathrm{C}}{\mathrm{m^{2}}} = \mathrm{N}`,
    },
    {
      title: 'The neutral point between two charges',
      question:
        'Charges of +2.0 μC and +8.0 μC are 30 cm apart. Find the point between them where the electric field is zero, and calculate the potential there.',
      figure: 'neutral-point',
      steps: [
        {
          text: 'At distance $x$ from the 2.0 μC charge the two fields are equal and opposite:',
          latex: String.raw`\frac{2.0}{x^{2}} = \frac{8.0}{(0.30-x)^{2}} \;\Longrightarrow\; \frac{0.30-x}{x} = \sqrt{4} = 2 \;\Longrightarrow\; x = 0.10\ \mathrm{m}`,
        },
        {
          text: 'Potentials add as scalars:',
          latex: String.raw`V = 8.99\times10^{9}\left(\frac{2.0\times10^{-6}}{0.10} + \frac{8.0\times10^{-6}}{0.20}\right) = 5.39\times10^{5}\ \mathrm{V}`,
        },
      ],
      answer: String.raw`10 cm from the +2.0 μC charge; $V = 5.4\times10^{5}$ V there`,
      unitCheck: String.raw`\mathrm{N\,m^{2}\,C^{-2}} \times \frac{\mathrm{C}}{\mathrm{m}} = \mathrm{N\,m\,C^{-1}} = \mathrm{J\,C^{-1}} = \mathrm{V}`,
    },
    {
      title: 'Closest approach of an α-particle',
      question:
        'An α-particle (charge +2e) with 7.7 MeV of kinetic energy is fired straight at a gold nucleus (charge +79e). Calculate how close it gets to the centre of the nucleus.',
      steps: [
        {
          text: 'Kinetic energy in joules:',
          latex: String.raw`E_\mathrm{k} = 7.7\times10^{6} \times 1.60\times10^{-19} = 1.23\times10^{-12}\ \mathrm{J}`,
        },
        {
          text: 'At closest approach it stops for an instant: all the kinetic energy has become electric potential energy.',
          latex: String.raw`E_\mathrm{k} = \frac{Qq}{4\pi\varepsilon_{0}r}`,
        },
        {
          text: '$r$ is in the denominator and $E_\\mathrm{k}$ is the lone term on the other side: swap them in one step (cross-multiplication).',
          latex: String.raw`r = \frac{Qq}{4\pi\varepsilon_{0}E_\mathrm{k}} = \frac{8.99\times10^{9} \times (2 \times 1.60\times10^{-19})(79 \times 1.60\times10^{-19})}{1.23\times10^{-12}} = 2.95\times10^{-14}\ \mathrm{m}`,
        },
      ],
      answer: String.raw`$r = 3.0\times10^{-14}$ m`,
      unitCheck: String.raw`\frac{\mathrm{N\,m^{2}\,C^{-2}} \times \mathrm{C^{2}}}{\mathrm{J}} = \frac{\mathrm{N\,m^{2}}}{\mathrm{N\,m}} = \mathrm{m}`,
    },
    {
      title: 'Two charged spheres hanging from one point',
      question:
        'Two identical small spheres, each of mass 0.20 g and charge Q, hang from the same point on insulating threads 0.50 m long. They repel and come to rest with each thread at 15° to the vertical. Calculate Q.',
      figure: 'suspended',
      steps: [
        {
          text: 'Each sphere is in equilibrium. Resolving, $F_\\mathrm{T}\\cos\\theta = mg$ and $F_\\mathrm{T}\\sin\\theta = F$; dividing the two:',
          latex: String.raw`F = mg\tan\theta = 0.20\times10^{-3} \times 9.81 \times \tan 15^\circ = 5.26\times10^{-4}\ \mathrm{N}`,
        },
        {
          text: 'Separation of the centres:',
          latex: String.raw`d = 2L\sin\theta = 2 \times 0.50 \times \sin 15^\circ = 0.259\ \mathrm{m}`,
        },
        {
          text: 'Coulomb’s law with equal charges, $F = Q^2/(4\\pi\\varepsilon_0 d^2)$:',
          latex: String.raw`Q = d\sqrt{4\pi\varepsilon_{0}F} = 0.259 \times \sqrt{\frac{5.26\times10^{-4}}{8.99\times10^{9}}} = 6.26\times10^{-8}\ \mathrm{C}`,
        },
      ],
      answer: String.raw`$Q = 6.3\times10^{-8}$ C (63 nC)`,
      unitCheck: String.raw`\mathrm{m} \times \sqrt{\frac{\mathrm{N}}{\mathrm{N\,m^{2}\,C^{-2}}}} = \mathrm{m} \times \frac{\mathrm{C}}{\mathrm{m}} = \mathrm{C}`,
    },
  ],

  practice: [
    { question: 'Calculate the force between two protons 1.0 × 10⁻¹⁵ m apart.', answer: '2.3 × 10² N, repulsive' },
    {
      question: 'Calculate the electric field strength 0.20 m from a +5.0 μC point charge.',
      answer: '1.1 × 10⁶ N C⁻¹, away from the charge',
    },
    {
      question: 'Calculate the force on an electron in a field of strength 3.0 × 10⁴ N C⁻¹.',
      answer: '4.8 × 10⁻¹⁵ N, opposite to the field',
    },
    { question: 'Calculate the potential 0.10 m from a −3.0 nC point charge.', answer: '−2.7 × 10² V' },
    {
      question: 'Calculate the work done moving a +2.0 μC charge from a point at 50 V to a point at 250 V.',
      answer: '4.0 × 10⁻⁴ J',
    },
    {
      question: 'The distance from a point charge is doubled. By what factor do F, E and V change?',
      answer: 'F and E to ¼; V to ½',
    },
    {
      question: 'An isolated sphere of radius 0.15 m is charged to a potential of 3.0 × 10⁵ V. Calculate its charge.',
      answer: '5.0 × 10⁻⁶ C',
    },
    {
      question: 'Along a field line the potential falls by 60 V over 2.0 mm. Calculate the field strength there.',
      answer: '3.0 × 10⁴ V m⁻¹',
    },
    {
      question: 'Calculate the ratio of the electric force to the gravitational force between two protons.',
      answer: '1.2 × 10³⁶',
    },
    {
      question: 'Calculate the electric potential energy of an electron and a proton 5.3 × 10⁻¹¹ m apart.',
      answer: '−4.3 × 10⁻¹⁸ J',
    },
  ],

  other: {
    mistakes: [
      {
        wrong: 'Add the fields of two charges as plain numbers.',
        right: 'E is a vector: draw each field’s direction first. V is a scalar: add with signs.',
      },
      { wrong: 'Where E = 0, V must be 0 too.', right: 'No: at the neutral point between like charges E = 0 but V is not.' },
      { wrong: 'Use the distance from the surface of a charged sphere.', right: 'r is measured from the centre.' },
      { wrong: 'Forget to convert nC and μC.', right: 'nC = 10⁻⁹ C, μC = 10⁻⁶ C. Square r in metres.' },
      {
        wrong: 'Electric potential is always negative, like gravitational potential.',
        right: 'V is positive near a positive charge, negative near a negative one.',
      },
    ],
    tips: [
      'Sketch the charges and draw each field arrow (away from +, towards −) before calculating.',
      'Neutral point between like charges: Q₁/x² = Q₂/(d − x)², then take square roots.',
      'Closest approach and similar energy questions: kinetic energy lost = potential energy gained.',
      'Hanging charged spheres: resolve forces, F = mg tan θ, then Coulomb’s law.',
    ],
    syllabus: [
      '9702 topic 18, Electric fields: E = F/q, field lines, Coulomb’s law, E = Q/4πε₀r², V = Q/4πε₀r, E as the negative potential gradient, Ep = Qq/4πε₀r. Coursebook Chapter 22.',
      'A Level only: not part of AS.',
      'For a point outside a charged conducting sphere, treat its charge as a point charge at its centre.',
      'The matching gravity results are in Chapter 17.',
    ],
    links: [
      { label: 'Coulomb’s Law Lab (simulation)', href: '/simulations/coulombs-law' },
      { label: 'Practice: Coulomb’s law (98 questions)', href: '/practice/c6c1d1f5-1c6b-4ab4-a15b-beea25426304?c=a-level' },
      { label: 'Practice: field strength of a point charge', href: '/practice/98f6ff7c-f938-51ef-8ee8-ad6d4052a483?c=a-level' },
      { label: 'Gravitational fields cheat sheet', href: '/cheat-sheets/a-level-gravitational-fields' },
    ],
  },

  diagrams: [
    {
      id: 'radial-fields',
      title: 'Radial fields of point charges',
      caption:
        'Field lines point away from a positive charge and towards a negative one: the direction a positive test charge would be pushed.',
      alt: 'Left: a positive charge with eight field lines pointing radially outwards. Right: a negative charge with eight field lines pointing radially inwards.',
      width: 340,
      height: 200,
      shapes: [
        ...LINES.map((a) => ({
          kind: 'arrow' as const,
          from: onCircle(POS, RQ + 5, a),
          to: onCircle(POS, 72, a),
          role: 'ink' as const,
        })),
        ...LINES.map((a) => ({
          kind: 'arrow' as const,
          from: onCircle(NEG, 72, a),
          to: onCircle(NEG, RQ + 5, a),
          role: 'ink' as const,
        })),
        { kind: 'circle', centre: POS, radius: RQ, role: 'ink', fill: 'soft' },
        { kind: 'circle', centre: POS, radius: RQ, role: 'ink' },
        { kind: 'label', at: [POS[0], POS[1] + 6], text: '+', anchor: 'middle', role: 'ink' },
        { kind: 'circle', centre: NEG, radius: RQ, role: 'ink', fill: 'soft' },
        { kind: 'circle', centre: NEG, radius: RQ, role: 'ink' },
        { kind: 'label', at: [NEG[0], NEG[1] + 6], text: '−', anchor: 'middle', role: 'ink' },
        { kind: 'label', at: [POS[0], 192], text: 'positive charge', anchor: 'middle', style: 'note', role: 'muted' },
        { kind: 'label', at: [NEG[0], 192], text: 'negative charge', anchor: 'middle', style: 'note', role: 'muted' },
      ],
    },
    {
      id: 'dipole',
      title: 'Fields add as vectors',
      caption:
        'Midway between +Q and −Q both fields point the same way (away from +, towards −), so they add; the potentials (+ and −) cancel.',
      alt: 'A positive charge on the left and a negative charge on the right. At the midpoint P, the field from the positive charge points right and the field from the negative charge also points right; drawn tip to tail they give a resultant field twice as long.',
      width: 340,
      height: 170,
      shapes: [
        { kind: 'line', from: DP, to: DN, role: 'muted', dashed: true, thin: true },
        { kind: 'circle', centre: DP, radius: 13, role: 'ink', fill: 'soft' },
        { kind: 'circle', centre: DP, radius: 13, role: 'ink' },
        { kind: 'label', at: [DP[0], DP[1] + 6], text: '+', anchor: 'middle', role: 'ink' },
        { kind: 'circle', centre: DN, radius: 13, role: 'ink', fill: 'soft' },
        { kind: 'circle', centre: DN, radius: 13, role: 'ink' },
        { kind: 'label', at: [DN[0], DN[1] + 6], text: '−', anchor: 'middle', role: 'ink' },
        { kind: 'dot', at: MID, radius: 3 },
        { kind: 'label', at: [MID[0], MID[1] - 10], text: 'P', anchor: 'middle' },
        { kind: 'arrow', from: [MID[0], MID[1] + 26], to: [MID[0] + EL, MID[1] + 26], role: 'force' },
        { kind: 'label', at: [MID[0] + EL / 2, MID[1] + 46], text: 'E_+', anchor: 'middle', role: 'force' },
        { kind: 'arrow', from: [MID[0] + EL, MID[1] + 26], to: [MID[0] + 2 * EL, MID[1] + 26], role: 'force' },
        { kind: 'label', at: [MID[0] + 1.5 * EL, MID[1] + 46], text: 'E_−', anchor: 'middle', role: 'force' },
        { kind: 'arrow', from: [MID[0], MID[1] + 62], to: [MID[0] + 2 * EL, MID[1] + 62], role: 'force' },
        { kind: 'label', at: [MID[0] - 6, MID[1] + 67], text: 'E', anchor: 'end', role: 'force' },
        { kind: 'line', from: [MID[0], MID[1] + 4], to: [MID[0], MID[1] + 66], role: 'muted', dashed: true, thin: true },
      ],
    },
    {
      id: 'potential-graph',
      title: 'Potential against distance',
      caption:
        'Around +Q the potential is positive and falls towards zero; around −Q it is negative and rises towards zero. The field strength is minus the gradient.',
      alt: 'Graph of electric potential V against distance r. One curve, for a positive charge, starts high above the r axis and falls towards zero. A mirror-image curve, for a negative charge, starts far below the axis and rises towards zero. A tangent on the positive curve is labelled: field strength equals minus the gradient.',
      width: 320,
      height: 250,
      shapes: [
        { kind: 'arrow', from: [X0, 240], to: [X0, 12], role: 'ink' },
        { kind: 'label', at: [X0 - 8, 22], text: 'V', anchor: 'end' },
        { kind: 'arrow', from: [X0, Y0], to: [312, Y0], role: 'ink' },
        { kind: 'label', at: [308, Y0 + 20], text: 'r', anchor: 'end' },
        { kind: 'label', at: [X0 - 6, Y0 + 5], text: '0', anchor: 'end' },
        { kind: 'curve', points: ks.map((k) => [px(k), pyPos(k)] as Point), role: 'ink' },
        { kind: 'curve', points: ks.map((k) => [px(k), pyNeg(k)] as Point), role: 'ink', dashed: true },
        { kind: 'label', at: [px(5), pyPos(5) - 10], text: '+Q', anchor: 'middle', role: 'ink' },
        { kind: 'label', at: [px(5), pyNeg(5) + 22], text: '−Q', anchor: 'middle', role: 'ink' },
        { kind: 'line', from: [tx - 26, round(ty - 26 * 0.9)], to: [tx + 26, round(ty + 26 * 0.9)], role: 'ink', thin: true },
        { kind: 'dot', at: [tx, ty], radius: 2.5 },
        { kind: 'label', at: [tx + 22, ty - 16], text: 'E = −gradient', style: 'note' },
      ],
    },
    {
      id: 'neutral-point',
      title: 'The neutral point',
      caption: 'At N the field from each charge has the same size and points the opposite way, so the resultant field is zero.',
      alt: 'A +2.0 microcoulomb charge on the left and a +8.0 microcoulomb charge on the right, 30 cm apart. The neutral point N is one third of the way from the smaller charge. At N, the field from the left charge points right and the field from the right charge points left, equal in length.',
      width: 340,
      height: 170,
      shapes: [
        { kind: 'line', from: Q1, to: Q2, role: 'muted', dashed: true, thin: true },
        { kind: 'circle', centre: Q1, radius: 11, role: 'ink', fill: 'soft' },
        { kind: 'circle', centre: Q1, radius: 11, role: 'ink' },
        { kind: 'label', at: [Q1[0], Q1[1] - 18], text: '+2.0 μC', anchor: 'middle', style: 'note', role: 'ink' },
        { kind: 'circle', centre: Q2, radius: 18, role: 'ink', fill: 'soft' },
        { kind: 'circle', centre: Q2, radius: 18, role: 'ink' },
        { kind: 'label', at: [Q2[0], Q2[1] - 25], text: '+8.0 μC', anchor: 'middle', style: 'note', role: 'ink' },
        { kind: 'dot', at: N, radius: 3 },
        { kind: 'label', at: [N[0], N[1] - 30], text: 'N', anchor: 'middle' },
        { kind: 'arrow', from: [N[0], N[1] - 12], to: [N[0] + 38, N[1] - 12], role: 'force' },
        { kind: 'arrow', from: [N[0], N[1] + 12], to: [N[0] - 38, N[1] + 12], role: 'force' },
        { kind: 'label', at: [N[0] + 42, N[1] - 8], text: 'E_1' },
        { kind: 'label', at: [N[0] - 42, N[1] + 17], text: 'E_2', anchor: 'end' },
        { kind: 'line', from: [Q1[0], 140], to: [N[0], 140], role: 'ink', thin: true },
        { kind: 'label', at: [round((Q1[0] + N[0]) / 2), 158], text: 'x', anchor: 'middle' },
        { kind: 'line', from: [N[0], 140], to: [Q2[0], 140], role: 'ink', thin: true },
        { kind: 'label', at: [round((N[0] + Q2[0]) / 2), 158], text: 'd − x', anchor: 'middle' },
        { kind: 'line', from: [Q1[0], 134], to: [Q1[0], 146], role: 'ink', thin: true },
        { kind: 'line', from: [N[0], 134], to: [N[0], 146], role: 'ink', thin: true },
        { kind: 'line', from: [Q2[0], 134], to: [Q2[0], 146], role: 'ink', thin: true },
      ],
    },
    {
      id: 'suspended',
      title: 'Two charged spheres in equilibrium',
      caption: 'Tension, weight and the electric repulsion balance on each sphere: F = mg tan θ.',
      alt: 'Two small spheres hang from one fixed point on threads of length L, each at angle theta to the vertical. On the right sphere: tension along the thread towards the fixed point, weight mg downwards, and the electric force F horizontally away from the other sphere. The separation d is marked between the spheres.',
      width: 340,
      height: 270,
      shapes: [
        { kind: 'surface', from: [PIV[0] - 60, PIV[1]], to: [PIV[0] + 60, PIV[1]], side: 'left' },
        { kind: 'line', from: PIV, to: [PIV[0], PIV[1] + THREAD], role: 'muted', dashed: true, thin: true },
        { kind: 'line', from: PIV, to: left, role: 'ink' },
        { kind: 'line', from: PIV, to: right, role: 'ink' },
        { kind: 'arc', centre: PIV, radius: 46, from: -90, to: -90 + TH },
        { kind: 'label', at: along(PIV, dir(-90 + TH / 2), 62), text: 'θ', anchor: 'middle' },
        { kind: 'label', at: [round((PIV[0] + left[0]) / 2) - 10, round((PIV[1] + left[1]) / 2)], text: 'L', anchor: 'end' },
        { kind: 'arrow', from: right, to: along(right, dir(90 + TH), Tn), role: 'force' },
        {
          kind: 'label',
          at: [along(right, dir(90 + TH), Tn)[0] + 10, along(right, dir(90 + TH), Tn)[1] + 10],
          text: 'F_T',
          role: 'force',
        },
        { kind: 'arrow', from: right, to: [right[0], right[1] + MG], role: 'force' },
        { kind: 'label', at: [right[0] + 8, right[1] + MG - 2], text: 'mg', role: 'force' },
        { kind: 'arrow', from: right, to: [right[0] + Fe + 10, right[1]], role: 'force' },
        { kind: 'label', at: [right[0] + Fe + 16, right[1] + 5], text: 'F', role: 'force' },
        { kind: 'line', from: [left[0], right[1] + 22], to: [right[0], right[1] + 22], role: 'ink', thin: true },
        { kind: 'label', at: [PIV[0], right[1] + 40], text: 'd', anchor: 'middle' },
        { kind: 'dot', at: left, radius: 8 },
        { kind: 'dot', at: right, radius: 8 },
        { kind: 'label', at: [left[0] - 12, left[1] + 5], text: 'Q', anchor: 'end' },
      ],
    },
  ],

  pages: [
    ['explanation'],
    [{ section: 'derivations', from: 0, to: 2 }],
    [{ section: 'derivations', from: 2 }],
    ['equations', { section: 'samples', from: 0, to: 2 }],
    [{ section: 'samples', from: 2 }],
    ['practice', 'other'],
  ],
};
