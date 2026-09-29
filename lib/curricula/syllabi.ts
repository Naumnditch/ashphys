/**
 * Syllabus structure for each curriculum: the units a curriculum page groups
 * its lessons under, and the section titles a topic code resolves to.
 *
 * Sources (section numbering and titles as published by the exam boards):
 *   - Cambridge IGCSE Physics 0625, syllabus for examination 2023–2025
 *   - Cambridge International AS & A Level Physics 9702, 2025–2027
 *   - IB Diploma Programme Physics guide, first assessment 2025
 *
 * Only structure lives here (codes and titles). Which lesson covers which
 * section is data, in the `topics` table's topic code columns.
 */

export interface SyllabusSection {
  code: string;
  title: string;
}

export interface SyllabusUnit {
  code: string;
  title: string;
  /** e.g. "AS", "A Level", "SL & HL", "AHL" (IB additional higher level). */
  level?: string;
  sections: SyllabusSection[];
}

const s = (code: string, title: string): SyllabusSection => ({ code, title });

const CAMBRIDGE_MATHS: SyllabusUnit = {
  code: 'Maths',
  title: 'Mathematical requirements',
  sections: [s('Maths', 'Mathematical skills used throughout the syllabus')],
};

export const IGCSE_0625: SyllabusUnit[] = [
  CAMBRIDGE_MATHS,
  {
    code: '1',
    title: 'Motion, forces and energy',
    sections: [
      s('1.1', 'Physical quantities and measurement techniques'),
      s('1.2', 'Motion'),
      s('1.3', 'Mass and weight'),
      s('1.4', 'Density'),
      s('1.5.1', 'Effects of forces'),
      s('1.5.2', 'Turning effect of forces'),
      s('1.5.3', 'Centre of gravity'),
      s('1.6', 'Momentum'),
      s('1.7.1', 'Energy'),
      s('1.7.2', 'Work'),
      s('1.7.3', 'Energy resources'),
      s('1.7.4', 'Power'),
      s('1.8', 'Pressure'),
    ],
  },
  {
    code: '2',
    title: 'Thermal physics',
    sections: [
      s('2.1.1', 'States of matter'),
      s('2.1.2', 'Particle model'),
      s('2.1.3', 'Gases and the absolute scale of temperature'),
      s('2.2.1', 'Thermal expansion of solids, liquids and gases'),
      s('2.2.2', 'Specific heat capacity'),
      s('2.2.3', 'Melting, boiling and evaporation'),
      s('2.3.1', 'Conduction'),
      s('2.3.2', 'Convection'),
      s('2.3.3', 'Radiation'),
      s('2.3.4', 'Consequences of thermal energy transfer'),
    ],
  },
  {
    code: '3',
    title: 'Waves',
    sections: [
      s('3.1', 'General properties of waves'),
      s('3.2.1', 'Reflection of light'),
      s('3.2.2', 'Refraction of light'),
      s('3.2.3', 'Thin lenses'),
      s('3.2.4', 'Dispersion of light'),
      s('3.3', 'Electromagnetic spectrum'),
      s('3.4', 'Sound'),
    ],
  },
  {
    code: '4',
    title: 'Electricity and magnetism',
    sections: [
      s('4.1', 'Simple phenomena of magnetism'),
      s('4.2.1', 'Electric charge'),
      s('4.2.2', 'Electric current'),
      s('4.2.3', 'Electromotive force and potential difference'),
      s('4.2.4', 'Resistance'),
      s('4.2.5', 'Electrical energy and electrical power'),
      s('4.3.1', 'Circuit diagrams and circuit components'),
      s('4.3.2', 'Series and parallel circuits'),
      s('4.3.3', 'Action and use of circuit components'),
      s('4.4', 'Electrical safety'),
      s('4.5.1', 'Electromagnetic induction'),
      s('4.5.2', 'The a.c. generator'),
      s('4.5.3', 'Magnetic effect of a current'),
      s('4.5.4', 'Force on a current-carrying conductor'),
      s('4.5.5', 'The d.c. motor'),
      s('4.5.6', 'The transformer'),
    ],
  },
  {
    code: '5',
    title: 'Nuclear physics',
    sections: [
      s('5.1.1', 'The atom'),
      s('5.1.2', 'The nucleus'),
      s('5.2.1', 'Detection of radioactivity'),
      s('5.2.2', 'The three types of nuclear emission'),
      s('5.2.3', 'Radioactive decay'),
      s('5.2.4', 'Half-life'),
      s('5.2.5', 'Safety precautions'),
    ],
  },
  {
    code: '6',
    title: 'Space physics',
    sections: [
      s('6.1.1', 'The Earth'),
      s('6.1.2', 'The Solar System'),
      s('6.2.1', 'The Sun as a star'),
      s('6.2.2', 'Stars'),
      s('6.2.3', 'The Universe'),
    ],
  },
];

const AS_UNITS: SyllabusUnit[] = [
  {
    code: '1',
    title: 'Physical quantities and units',
    level: 'AS',
    sections: [
      s('1.1', 'Physical quantities'),
      s('1.2', 'SI units'),
      s('1.3', 'Errors and uncertainties'),
      s('1.4', 'Scalars and vectors'),
    ],
  },
  { code: '2', title: 'Kinematics', level: 'AS', sections: [s('2.1', 'Equations of motion')] },
  {
    code: '3',
    title: 'Dynamics',
    level: 'AS',
    sections: [
      s('3.1', "Momentum and Newton's laws of motion"),
      s('3.2', 'Non-uniform motion'),
      s('3.3', 'Linear momentum and its conservation'),
    ],
  },
  {
    code: '4',
    title: 'Forces, density and pressure',
    level: 'AS',
    sections: [s('4.1', 'Turning effects of forces'), s('4.2', 'Equilibrium of forces'), s('4.3', 'Density and pressure')],
  },
  {
    code: '5',
    title: 'Work, energy and power',
    level: 'AS',
    sections: [s('5.1', 'Energy conservation'), s('5.2', 'Gravitational potential energy and kinetic energy')],
  },
  {
    code: '6',
    title: 'Deformation of solids',
    level: 'AS',
    sections: [s('6.1', 'Stress and strain'), s('6.2', 'Elastic and plastic behaviour')],
  },
  {
    code: '7',
    title: 'Waves',
    level: 'AS',
    sections: [
      s('7.1', 'Progressive waves'),
      s('7.2', 'Transverse and longitudinal waves'),
      s('7.3', 'Doppler effect for sound waves'),
      s('7.4', 'Electromagnetic spectrum'),
      s('7.5', 'Polarisation'),
    ],
  },
  {
    code: '8',
    title: 'Superposition',
    level: 'AS',
    sections: [
      s('8.1', 'Stationary waves'),
      s('8.2', 'Diffraction'),
      s('8.3', 'Interference'),
      s('8.4', 'The diffraction grating'),
    ],
  },
  {
    code: '9',
    title: 'Electricity',
    level: 'AS',
    sections: [s('9.1', 'Electric current'), s('9.2', 'Potential difference and power'), s('9.3', 'Resistance and resistivity')],
  },
  {
    code: '10',
    title: 'D.C. circuits',
    level: 'AS',
    sections: [s('10.1', 'Practical circuits'), s('10.2', "Kirchhoff's laws"), s('10.3', 'Potential dividers')],
  },
  {
    code: '11',
    title: 'Particle physics',
    level: 'AS',
    sections: [s('11.1', 'Atoms, nuclei and radiation'), s('11.2', 'Fundamental particles')],
  },
];

const A2_UNITS: SyllabusUnit[] = [
  {
    code: '12',
    title: 'Motion in a circle',
    level: 'A Level',
    sections: [s('12.1', 'Kinematics of uniform circular motion'), s('12.2', 'Centripetal acceleration')],
  },
  {
    code: '13',
    title: 'Gravitational fields',
    level: 'A Level',
    sections: [
      s('13.1', 'Gravitational field'),
      s('13.2', 'Gravitational force between point masses'),
      s('13.3', 'Gravitational field of a point mass'),
      s('13.4', 'Gravitational potential'),
    ],
  },
  {
    code: '14',
    title: 'Temperature',
    level: 'A Level',
    sections: [
      s('14.1', 'Thermal equilibrium'),
      s('14.2', 'Temperature scales'),
      s('14.3', 'Specific heat capacity and specific latent heat'),
    ],
  },
  {
    code: '15',
    title: 'Ideal gases',
    level: 'A Level',
    sections: [s('15.1', 'The mole'), s('15.2', 'Equation of state'), s('15.3', 'Kinetic theory of gases')],
  },
  {
    code: '16',
    title: 'Thermodynamics',
    level: 'A Level',
    sections: [s('16.1', 'Internal energy'), s('16.2', 'The first law of thermodynamics')],
  },
  {
    code: '17',
    title: 'Oscillations',
    level: 'A Level',
    sections: [
      s('17.1', 'Simple harmonic oscillations'),
      s('17.2', 'Energy in simple harmonic motion'),
      s('17.3', 'Damped and forced oscillations, resonance'),
    ],
  },
  {
    code: '18',
    title: 'Electric fields',
    level: 'A Level',
    sections: [
      s('18.1', 'Electric fields and field lines'),
      s('18.2', 'Uniform electric fields'),
      s('18.3', 'Electric force between point charges'),
      s('18.4', 'Electric field of a point charge'),
      s('18.5', 'Electric potential'),
    ],
  },
  {
    code: '19',
    title: 'Capacitance',
    level: 'A Level',
    sections: [
      s('19.1', 'Capacitors and capacitance'),
      s('19.2', 'Energy stored in a capacitor'),
      s('19.3', 'Discharging a capacitor'),
    ],
  },
  {
    code: '20',
    title: 'Magnetic fields',
    level: 'A Level',
    sections: [
      s('20.1', 'Concept of a magnetic field'),
      s('20.2', 'Force on a current-carrying conductor'),
      s('20.3', 'Force on a moving charge'),
      s('20.4', 'Magnetic fields due to currents'),
      s('20.5', 'Electromagnetic induction'),
    ],
  },
  {
    code: '21',
    title: 'Alternating currents',
    level: 'A Level',
    sections: [s('21.1', 'Characteristics of alternating currents'), s('21.2', 'Rectification and smoothing')],
  },
  {
    code: '22',
    title: 'Quantum physics',
    level: 'A Level',
    sections: [
      s('22.1', 'Energy and momentum of a photon'),
      s('22.2', 'Photoelectric effect'),
      s('22.3', 'Wave–particle duality'),
      s('22.4', 'Energy levels in atoms and line spectra'),
    ],
  },
  {
    code: '23',
    title: 'Nuclear physics',
    level: 'A Level',
    sections: [s('23.1', 'Mass defect and nuclear binding energy'), s('23.2', 'Radioactive decay')],
  },
  {
    code: '24',
    title: 'Medical physics',
    level: 'A Level',
    sections: [
      s('24.1', 'Production and use of ultrasound'),
      s('24.2', 'Production and use of X-rays'),
      s('24.3', 'PET scanning'),
    ],
  },
  {
    code: '25',
    title: 'Astronomy and cosmology',
    level: 'A Level',
    sections: [s('25.1', 'Standard candles'), s('25.2', 'Stellar radii'), s('25.3', 'Hubble’s law and the Big Bang theory')],
  },
];

export const AS_9702: SyllabusUnit[] = [CAMBRIDGE_MATHS, ...AS_UNITS];

/** A Level is the whole of AS plus units 12–25. */
export const A_LEVEL_9702: SyllabusUnit[] = [CAMBRIDGE_MATHS, ...AS_UNITS, ...A2_UNITS];

export const IB_PHYSICS: SyllabusUnit[] = [
  {
    code: 'Tools',
    title: 'Tools for physics',
    sections: [s('Tool 3', 'Tool 3: Mathematics')],
  },
  {
    code: 'A',
    title: 'Space, time and motion',
    sections: [
      s('A.1', 'Kinematics'),
      s('A.2', 'Forces and momentum'),
      s('A.3', 'Work, energy and power'),
      s('A.4', 'Rigid body mechanics (HL)'),
      s('A.5', 'Galilean and special relativity (HL)'),
    ],
  },
  {
    code: 'B',
    title: 'The particulate nature of matter',
    sections: [
      s('B.1', 'Thermal energy transfers'),
      s('B.2', 'Greenhouse effect'),
      s('B.3', 'Gas laws'),
      s('B.4', 'Thermodynamics (HL)'),
      s('B.5', 'Current and circuits'),
    ],
  },
  {
    code: 'C',
    title: 'Wave behaviour',
    sections: [
      s('C.1', 'Simple harmonic motion'),
      s('C.2', 'Wave model'),
      s('C.3', 'Wave phenomena'),
      s('C.4', 'Standing waves and resonance'),
      s('C.5', 'Doppler effect'),
    ],
  },
  {
    code: 'D',
    title: 'Fields',
    sections: [
      s('D.1', 'Gravitational fields'),
      s('D.2', 'Electric and magnetic fields'),
      s('D.3', 'Motion in electromagnetic fields'),
      s('D.4', 'Induction (HL)'),
    ],
  },
  {
    code: 'E',
    title: 'Nuclear and quantum physics',
    sections: [
      s('E.1', 'Structure of the atom'),
      s('E.2', 'Quantum physics (HL)'),
      s('E.3', 'Radioactive decay'),
      s('E.4', 'Fission'),
      s('E.5', 'Fusion and stars'),
    ],
  },
];

export const SYLLABI: Record<'igcse' | 'as' | 'a-level' | 'ib', SyllabusUnit[]> = {
  igcse: IGCSE_0625,
  as: AS_9702,
  'a-level': A_LEVEL_9702,
  ib: IB_PHYSICS,
};
