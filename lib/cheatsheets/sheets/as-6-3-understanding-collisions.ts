import type { CheatSheet } from '../types';

/* AS 9702 · coursebook 6.3 Understanding collisions. One page. Numbers recomputed in the tests. */

// Fig. 1 · equal masses, perfectly elastic, head-on: 15 px per m s⁻¹.
const K = 15;

export const as63UnderstandingCollisions: CheatSheet = {
  slug: 'as-6-3-understanding-collisions',
  topicId: 'ac47b348-a080-47b5-a3b9-a2a40915eb56',
  curriculumId: 'as',
  title: 'Understanding collisions',
  lessonCode: '6.3',
  chapter: { number: 6, title: 'Momentum' },
  syllabusSections: ['6.3'],
  goal: 'Tell elastic from inelastic collisions using kinetic energy or relative speeds.',
  reviewed: '2026-10-26',

  explanation: {
    paragraphs: [
      'Momentum is conserved in every collision, and so is total energy. Kinetic energy is conserved only in a perfectly elastic collision; in an inelastic one some becomes internal energy, sound or deformation.',
      'In a perfectly elastic collision the objects separate as fast as they approached. Objects that stick together have the biggest loss of kinetic energy that conservation of momentum allows.',
    ],
    keyTerms: [
      { term: 'Perfectly elastic', source: 'paraphrase', text: 'Total kinetic energy is the same before and after.' },
      { term: 'Inelastic', source: 'paraphrase', text: 'Some kinetic energy is transferred to other forms.' },
    ],
    figures: ['exchange'],
  },

  derivations: [],

  equations: [
    { name: 'Kinetic energy', latex: String.raw`E_\mathrm{k} = \tfrac{1}{2}mv^{2}` },
    { name: 'Perfectly elastic: approach = separation', latex: String.raw`u_1 - u_2 = v_2 - v_1` },
  ],

  symbols: [
    { symbol: 'E_\\mathrm{k}', meaning: 'kinetic energy', unit: '\\mathrm{J}' },
    { symbol: 'u', meaning: 'velocity before', unit: '\\mathrm{m\\,s^{-1}}' },
    { symbol: 'v', meaning: 'velocity after', unit: '\\mathrm{m\\,s^{-1}}' },
  ],

  samples: [
    {
      title: 'Is it elastic?',
      question:
        'A 2.0 kg trolley at 3.0 m s⁻¹ hits a stationary 1.0 kg trolley. They stick together and move at 2.0 m s⁻¹. Show that the collision is inelastic and find the kinetic energy lost.',
      steps: [
        {
          text: 'Kinetic energy before and after:',
          latex: String.raw`E_\mathrm{k} = \tfrac{1}{2}(2.0)(3.0)^{2} = 9.0\ \mathrm{J}, \quad E_\mathrm{k}' = \tfrac{1}{2}(3.0)(2.0)^{2} = 6.0\ \mathrm{J}`,
        },
        { text: 'Kinetic energy fell, so the collision is inelastic:', latex: String.raw`\Delta E_\mathrm{k} = 9.0 - 6.0 = 3.0\ \mathrm{J}` },
      ],
      answer: 'Inelastic; 3.0 J of kinetic energy lost',
      unitCheck: String.raw`\mathrm{kg} \times (\mathrm{m\,s^{-1}})^{2} = \mathrm{J}`,
    },
  ],

  practice: [
    { question: 'Which quantities are conserved in every collision?', answer: 'Momentum and total energy' },
    { question: 'A 0.10 kg ball hits a wall at 8.0 m s⁻¹ and rebounds at 6.0 m s⁻¹. Find the kinetic energy lost.', answer: '1.4 J' },
    { question: 'Two balls approach at a relative speed of 5.0 m s⁻¹ and separate at 3.0 m s⁻¹. Is the collision perfectly elastic?', answer: 'No: inelastic' },
    {
      question: 'A 1.0 kg ball at 6.0 m s⁻¹ hits a stationary 2.0 kg ball elastically. Find both velocities after.',
      answer: '1.0 kg: 2.0 m s⁻¹ back; 2.0 kg: 4.0 m s⁻¹ forwards',
    },
  ],

  other: {
    mistakes: [{ wrong: 'Momentum is lost in an inelastic collision.', right: 'Momentum is always conserved; only kinetic energy is lost.' }],
    tips: ['Elastic problems: use momentum conservation plus approach speed = separation speed.'],
    syllabus: ['9702 topic 3: elastic and inelastic collisions; relative speeds. Coursebook 6.3.'],
    links: [{ label: 'Practice questions for this lesson', href: '/practice/ac47b348-a080-47b5-a3b9-a2a40915eb56?c=as' }],
  },

  diagrams: [
    {
      id: 'exchange',
      title: 'Equal masses, perfectly elastic',
      caption: 'A stops and B moves off at A’s speed: approach speed = separation speed = 4.0 m s⁻¹.',
      alt: 'Before: ball A moves right at 4.0 m/s towards an identical ball B at rest. After: A is at rest and B moves right at 4.0 m/s.',
      width: 300,
      height: 160,
      shapes: [
        { kind: 'label', at: [12, 44], text: 'before', style: 'note', role: 'muted' },
        { kind: 'label', at: [12, 124], text: 'after', style: 'note', role: 'muted' },
        { kind: 'circle', centre: [80, 50], radius: 13, fill: 'soft' },
        { kind: 'circle', centre: [80, 50], radius: 13 },
        { kind: 'circle', centre: [200, 50], radius: 13, fill: 'soft' },
        { kind: 'circle', centre: [200, 50], radius: 13 },
        { kind: 'label', at: [80, 54], text: 'A', anchor: 'middle' },
        { kind: 'label', at: [200, 54], text: 'B', anchor: 'middle' },
        { kind: 'arrow', from: [95, 50], to: [95 + K * 4, 50], role: 'velocity' },
        { kind: 'label', at: [125, 38], text: '4.0 m s⁻¹', anchor: 'middle', style: 'note', role: 'velocity' },
        { kind: 'label', at: [200, 30], text: 'at rest', anchor: 'middle', style: 'note', role: 'muted' },
        { kind: 'circle', centre: [174, 130], radius: 13, fill: 'soft' },
        { kind: 'circle', centre: [174, 130], radius: 13 },
        { kind: 'circle', centre: [200, 130], radius: 13, fill: 'soft' },
        { kind: 'circle', centre: [200, 130], radius: 13 },
        { kind: 'label', at: [174, 134], text: 'A', anchor: 'middle' },
        { kind: 'label', at: [200, 134], text: 'B', anchor: 'middle' },
        { kind: 'arrow', from: [215, 130], to: [215 + K * 4, 130], role: 'velocity' },
        { kind: 'label', at: [245, 118], text: '4.0 m s⁻¹', anchor: 'middle', style: 'note', role: 'velocity' },
        { kind: 'label', at: [174, 108], text: 'at rest', anchor: 'middle', style: 'note', role: 'muted' },
      ],
    },
  ],
};
