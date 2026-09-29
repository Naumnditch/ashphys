"""Usage: python3 database/seeds/2026-09-29-multi-curriculum-content.py database/seeds/2026-09-29-multi-curriculum-content.sql

Builds the content seed for multi-curriculum support (run AFTER
2026-09-29-multi-curriculum-schema.sql):

  1. Tags every existing lesson (topics row) with the curricula it serves and
     its syllabus code in each: IGCSE 0625, AS & A Level 9702, IB Physics.
  2. Adds the Cambridge 9702 and IB courses, with a lesson for every syllabus
     section no existing lesson covers. Existing lessons that carry a
     simulation are shared into the other curricula rather than duplicated.
  3. Seeds the first curriculum-specific question banks, in the agreed
     priority order: AS, then A Level, then IGCSE, then IB.

Every answer is computed here from the question's own numbers, and the
explanation's figures are formatted from the same computation, so the text
and the stored answer cannot disagree. All ids are uuid5, so re-running is a
no-op for questions and a refresh for lesson tags.

Pass --json to also write the question list as JSON (used to run every stored
answer through the real grader before seeding).
"""
import json
import sys
import uuid
from math import pi, sqrt, sin, cos, tan, asin, degrees, radians, exp, log

g = 9.81
E_CHARGE = 1.60e-19
M_E = 9.11e-31
H = 6.63e-34
C_LIGHT = 3.00e8
EPS0 = 8.85e-12
K_E = 1 / (4 * pi * EPS0)
SIGMA = 5.67e-8

IGCSE_COURSE = '167676f7-8bd8-490d-b020-faf477f41159'


def uid(name):
    return str(uuid.uuid5(uuid.NAMESPACE_URL, f'ashphys/{name}'))


COURSE_9702 = uid('course/9702')
COURSE_IB = uid('course/ib-physics')

SUP = str.maketrans('-0123456789', '⁻⁰¹²³⁴⁵⁶⁷⁸⁹')


def sf(x, n=3):
    """x to n significant figures, in standard form (× 10ⁿ) when very large or small."""
    if x == 0:
        return '0'
    if x < 0:
        return '−' + sf(-x, n)
    e = int(f'{x:e}'.split('e')[1])
    if -3 <= e < 5:
        if e >= n - 1:
            return str(int(round(x, n - 1 - e)))
        return f'{x:.{n - 1 - e}f}'
    m = f'{x / 10**e:.{n - 1}f}'
    return f'{m} × 10{str(e).translate(SUP)}'


def stored(x, n=4):
    """Answer as stored for the grader: plain decimal or e-notation, 4 s.f."""
    if x < 0:
        return '-' + stored(-x, n)
    e = int(f'{x:e}'.split('e')[1])
    trim = lambda s: s.rstrip('0').rstrip('.') if '.' in s else s
    if -3 <= e < 5:
        return trim(f'{x:.{max(n - 1 - e, 0)}f}')
    return f"{trim(f'{x / 10**e:.{n - 1}f}')}e{e}"


def q(s):
    return "'" + s.replace("'", "''") + "'"


def arr(items):
    return 'ARRAY[' + ', '.join(q(i) for i in items) + ']::TEXT[]'


def opt(v):
    return 'NULL' if v is None else q(v)


# ════════════════════════════════════════════════════════════════════════
# 1. Existing lessons: which curricula each one serves, and its code in each
# ════════════════════════════════════════════════════════════════════════
# (id, name, igcse, as/a-level, a-level only, ib, syllabus_reference)
# `as_` fills both as_topic_code and a_level_topic_code (A Level is AS plus
# units 12–25); `al` is for lessons that only the A Level half needs.
EXISTING = [
    # Prep Physics — maths groundwork. Rearranging, graphs, proportionality,
    # trig and standard form are the Cambridge "Mathematical requirements"
    # and the IB's Tool 3.
    ('6cb3f4b2-9376-4bd1-9998-c33501bda11f', 'Rearranging Equations', 'Maths', 'Maths', None, 'Tool 3', None),
    ('04575a57-9fef-430a-871c-7db86e234486', 'Standard Form & Significant Figures', 'Maths', 'Maths', None, 'Tool 3', None),
    ('12a38624-8296-4b35-95b1-524efdeab593', 'Unit Prefixes', 'Maths', '1.2', None, 'Tool 3',
     'Use the SI prefixes from pico (10⁻¹²) to tera (10¹²) and convert cleanly between them.'),
    ('1f4e68db-067c-4cc9-8cd9-2fcadfd4cece', 'Constant of Proportionality', 'Maths', 'Maths', None, 'Tool 3', None),
    ('235adaf3-4c98-49c3-8477-1527cc480cd6', 'Reading and Interpreting Graphs', 'Maths', 'Maths', None, 'Tool 3', None),
    ('0e3dc753-0a9e-4965-8b75-a367852a2eb6', 'Basic Trigonometry for Physics', 'Maths', 'Maths', None, 'Tool 3', None),
    ('87127372-13c1-4275-ae86-1eea6bfc628a', 'Geometric Projections', 'Maths', None, None, None, None),
    ('d4129957-bf5c-49b9-ada0-273f665d3e91', 'Order of Magnitude & Estimation', 'Maths', '1.1', None, 'Tool 3',
     'Make reasonable estimates of physical quantities, and sanity-check an answer by its order of magnitude.'),
    ('11e7164b-e47d-4b4d-8bad-1002c892ba20', 'Vectors: Addition & Resolution', 'Maths', '1.4', None, 'Tool 3',
     'Add and subtract coplanar vectors, and resolve a vector into two perpendicular components.'),
    # 1 Making Measurements
    ('357bb749-b3c4-4147-9cab-5b1816655abc', '1.1 Measuring length and volume', '1.1', None, None, None, None),
    ('5b81d645-5ec7-4f85-ae6c-4a2c3006142c', '1.2 Density', '1.4', None, None, None, None),
    ('b989a55c-7b54-466e-a52d-44ccfeafe8f8', '1.3 Measuring time', '1.1', None, None, None, None),
    # 2 Describing Motion
    ('b53c60f8-2a78-40a6-ba55-4269d5e9c5c6', '2.1 Understanding speed', '1.2', None, None, None, None),
    ('b2e3d430-7699-4dac-9f55-e84c5cd5ce9b', '2.2 Distance-time graphs', '1.2', '2.1', None, 'A.1',
     'Plot and interpret displacement–time graphs: the gradient is the velocity, and a curve means the velocity is changing.'),
    ('73863351-c43d-40c1-bb61-131991f0b1bf', '2.3 Understanding acceleration', '1.2', None, None, None, None),
    ('523b4920-0883-4788-9903-20af1cf97b2e', '2.4 Calculating speed and acceleration', '1.2', None, None, None, None),
    # 3 Forces and Motion
    ('a85bbe17-e2c9-47c2-ae88-e739fc3606bf', '3.1 We have lift-off', '1.5.1', None, None, None, None),
    ('7ef3eb7a-b929-4495-950b-2611125b3506', '3.2 Mass, weight and gravity', '1.3', None, None, None, None),
    ('2a7ebe53-0b0c-4876-98c4-56bf153476ca', '3.3 Falling and turning', '1.5.1', None, None, None, None),
    ('06290016-2fbe-4ff3-aa7e-75bdee8913ef', '3.4 Force, mass and acceleration', '1.5.1', '3.1', None, 'A.2',
     'Resultant force, mass and acceleration: F = ma, and (beyond IGCSE) force as the rate of change of momentum.'),
    ('d17eaeea-5da3-45cc-a5a9-cac96700ab48', '3.5 Momentum', '1.6', None, None, None, None),
    ('fcd85fc6-5aa9-4fd8-a62d-6f733e955bec', '3.6 More about scalars and vectors', '1.1', None, None, None, None),
    ('db2c98d5-dd86-5faf-9121-5533bdd5d212', '3.7 Circular motion (extension)', '1.5.1', None, '12.2', 'A.2',
     'Uniform circular motion: v = 2πr/T, centripetal acceleration a = v²/r and centripetal force F = mv²/r, including vertical circles and conical pendulums.'),
    # 4 Turning Effects
    ('d6901d70-e2b3-46a7-80dc-641a98ba3767', '4.1 The moment of a force', '1.5.2', None, None, None, None),
    ('3035edb1-b03d-42dd-95e8-220ebe86a016', '4.2 Calculating moments', '1.5.2', '4.1', None, 'A.4',
     'Moment = force × perpendicular distance from the pivot; the principle of moments for a body in equilibrium.'),
    ('f3c05242-f854-4468-a35c-b2cf081713e1', '4.3 Stability and centre of gravity', '1.5.3', None, None, None, None),
    # 5 Forces and Matter
    ('69f6db5d-5466-4f9a-a3a8-5522aa5c8838', '5.1 Forces acting on solids', '1.5.1', None, None, None, None),
    ('7bf62773-c04e-4da4-9f88-e5b96f7d3083', '5.2 Stretching springs', '1.5.1', None, None, None, None),
    ('26761189-72fb-48ed-b8d8-71b5c386cf0c', '5.3 The limit of proportionality and the spring constant', '1.5.1', '6.1', None, 'A.2',
     'Hooke’s law, F = kx, the spring constant and the limit of proportionality on a force–extension graph.'),
    ('6d422924-ddde-4165-ac93-51e548052d91', '5.4 Pressure', '1.8', None, None, None, None),
    ('5c5e1c9b-b578-44da-a039-8a04934e18eb', '5.5 Calculating pressure', '1.8', '4.3', None, None,
     'Pressure in a liquid increases with depth: Δp = ρgΔh.'),
    # 6 Energy Stores and Transfers
    ('23ac5522-8a36-4bec-bfc0-c94cd5cb918f', '6.1 Energy stores', '1.7.1', None, None, None, None),
    ('37126390-e9be-46eb-8ed1-cba4c0076045', '6.2 Energy transfers', '1.7.1', None, None, None, None),
    ('09c036c0-f12a-46b8-800e-b88d8e7f431e', '6.3 Conservation of energy', '1.7.1', None, None, None, None),
    ('0ebdbbe4-43e3-4a5e-8bad-f6c596d30fe4', '6.4 Energy calculations', '1.7.1', None, None, None, None),
    # 7 Energy Resources
    ('613c342b-399c-49eb-8fd8-6b2ec0ac2894', '7.1 The energy we use', '1.7.3', None, None, None, None),
    ('f362be68-76dd-4a4a-844f-9e1ed014033d', '7.2 Energy from the Sun', '1.7.3', None, None, None, None),
    # 8 Work and Power
    ('47ecf979-f788-4707-b5d2-ef47bfdc1f52', '8.1 Doing work', '1.7.2', None, None, None, None),
    ('90ad8b5b-35fb-407f-82e2-f4ceecc05c79', '8.2 Calculating work done', '1.7.2', None, None, None, None),
    ('2cefad99-4218-4270-ac72-ef8499d3990d', '8.3 Power', '1.7.4', None, None, None, None),
    ('e7d30949-bcbc-4593-a731-b86770146171', '8.4 Calculating power', '1.7.4', None, None, None, None),
    # 9 The Kinetic Particle Model of Matter
    ('0f2ecb73-9a2a-409d-9f9e-6fdc80a5b226', '9.1 States of matter', '2.1.1', None, None, None, None),
    ('58b00f80-8b09-4819-ad9e-54a64d1a2522', '9.2 The kinetic particle model of matter', '2.1.2', None, None, None, None),
    ('9ea78ea6-ee89-45db-b9d8-f17ea36df492', '9.3 Gases and the kinetic model', '2.1.3', None, None, None, None),
    ('61028809-f2ca-48c2-92b7-e4eea7b65385', '9.4 Temperature and the Celsius scale', '2.1.3', None, None, None, None),
    ('aedaea73-e04d-4a1b-a2c2-8460f1be716e', '9.5 The gas laws', '2.1.3', None, '15.2', 'B.3',
     'The gas laws for a fixed mass of gas: Boyle’s law (pV constant), the pressure law and Charles’s law, on the kelvin scale.'),
    # 10 Thermal Properties of Matter
    ('67432f76-f368-4569-8bd5-5ef06bec4b24', '10.1 Thermal expansion', '2.2.1', None, None, None, None),
    ('fc7987d8-71ca-469f-b789-53279fd9f58d', '10.2 Specific heat capacity', '2.2.2', None, None, 'B.1', None),
    ('0f4f7ee5-a88b-4b68-b327-a4521db219f8', '10.3 Changing state', '2.2.3', None, None, 'B.1', None),
    # 11 Thermal Energy Transfers
    ('28f17e76-8b9d-4106-870e-b4cda672af00', '11.1 Conduction', '2.3.1', None, None, 'B.1', None),
    ('a41f0359-6790-4e36-9ef9-76fa78a6c6ff', '11.2 Convection', '2.3.2', None, None, 'B.1', None),
    ('c77513e5-8c05-49b7-a039-392638f71bbc', '11.3 Radiation', '2.3.3', None, None, 'B.1', None),
    ('9494d320-1ab2-4a76-8741-c320fba37fc7', '11.4 Consequences of thermal energy transfer', '2.3.4', None, None, None, None),
    # 12 Sound
    ('4aeb19ab-dd8c-4e09-8280-e082c0b14b95', '12.1 Making sounds', '3.4', None, None, None, None),
    ('8124de20-4cc7-45ef-94e5-63adc49a766a', '12.2 How does sound travel?', '3.4', None, None, None, None),
    ('daf9691b-fa7d-44e8-ba08-1baf774b26f9', '12.3 The speed of sound', '3.4', None, None, None, None),
    ('4032907a-6f0e-4afe-8359-385a44b6e268', '12.4 Seeing and hearing sounds', '3.4', None, None, None, None),
    # 13 Light
    ('13725c04-ac3a-4c2a-b9f1-0c413ada4974', '13.1 Reflection of light', '3.2.1', None, None, None, None),
    ('4de7c287-4ce1-4d94-83a9-4f67395fc77d', '13.2 Refraction of light', '3.2.2', None, None, 'C.3',
     'Refraction at a boundary: Snell’s law, n = sin i / sin r, and the refractive index as a ratio of wave speeds.'),
    ('2c8c0a3d-39f8-4411-8b96-fb031a7e5a7c', '13.3 Total internal reflection', '3.2.2', None, None, 'C.3', None),
    ('611a36aa-2577-4778-bfd1-874dc3f1a641', '13.4 Lenses', '3.2.3', None, None, None, None),
    ('7768fc60-228e-43b9-8d43-3a64111bfcc0', '13.5 Dispersion of light', '3.2.4', None, None, None, None),
    # 14 Properties of Waves
    ('29f88e95-37de-455e-8758-abbac85758fc', '14.1 Describing waves', '3.1', None, None, 'C.2', None),
    ('a56e07a9-9089-43d0-9874-0283364706bc', '14.2 Speed, frequency and wavelength', '3.1', None, None, 'C.2', None),
    ('5b73e686-9037-41b7-b6ef-82e9443e0098', '14.3 Explaining wave phenomena', '3.1', '8.3', None, 'C.3',
     'Reflection, refraction, diffraction and two-source interference of waves, seen in a ripple tank and Young’s double slit.'),
    # 15 The Electromagnetic Spectrum
    ('b63ae0fc-95d8-41ec-9535-9611a96f71dd', '15.1 Electromagnetic waves', '3.3', None, None, None, None),
    ('f56a3e86-0342-4d29-9103-e98e7d9cce7c', '15.2 Electromagnetic hazards', '3.3', None, None, None, None),
    ('46037e19-d05e-4375-8d74-5a455ea97b9a', '15.3 Communicating using electromagnetic waves', '3.3', None, None, None, None),
    # 16 Magnetism
    ('1c991177-4dd7-4ad6-b34d-f840fbe30509', '16.1 Permanent magnets', '4.1', None, None, None, None),
    ('ff26d540-5d41-496d-abbb-9b197c0210b5', '16.2 Magnetic fields', '4.1', None, None, None, None),
    # 17 Static Electricity
    ('460e1d41-6273-4bc9-be8d-b275f3f4cc23', '17.1 Charging and discharging', '4.2.1', None, None, None, None),
    ('342cc877-cfdc-4836-8fff-c8cc46309750', '17.2 Explaining static electricity', '4.2.1', None, None, None, None),
    ('383d1e6b-c8a8-4607-b15e-189a98874138', '17.3 Electric fields', '4.2.1', None, None, None, None),
    ('c6c1d1f5-1c6b-4ab4-a15b-beea25426304', "17.4 Coulomb's law (extension)", '4.2.1', None, '18.3', 'D.2',
     'Coulomb’s law for point charges, F = Q₁Q₂/(4πε₀r²), including resultant forces from several charges.'),
    # 18 Electrical Quantities
    ('f58c21b2-0c72-4c20-80c1-219fe302cc25', '18.1 Current in electric circuits', '4.2.2', None, None, None, None),
    ('80b00cae-58aa-4247-8f92-f57dbb3ca9e2', '18.2 Voltage in electric circuits', '4.2.3', None, None, None, None),
    ('50821964-69f6-408c-81be-59598b9c64d9', '18.3 Electrical resistance', '4.2.4', '9.3', None, 'B.5',
     'Resistance R = V/I, and the current–voltage characteristic of an ohmic conductor.'),
    ('08d6457b-1519-410a-bd3a-867e3b41ad9a', '18.4 More about electrical resistance', '4.2.4', None, None, None, None),
    ('f8164d33-4aa5-4050-8e83-6e0e985ec3ee', '18.5 Electrical energy, work and power', '4.2.5', None, None, None, None),
    # 19 Electrical Circuits
    ('b543452d-15d8-4c13-aed9-a941259eb531', '19.1 Circuit components', '4.3.3', None, None, None, None),
    ('02d93b6d-3881-426b-acd0-56e75300db80', '19.2 Combinations of resistors', '4.3.2', '10.2', None, 'B.5',
     'Current and p.d. in series and parallel circuits, and the combined resistance of resistors in series and in parallel.'),
    ('875aa1c7-38f4-4f28-8a73-dc61129d4c92', '19.3 Electrical safety', '4.4', None, None, None, None),
    # 20 Electromagnetic Forces
    ('f445b529-b425-4d9f-af3b-7bace8af74b5', '20.1 The magnetic effect of a current', '4.5.3', None, None, None, None),
    ('f49cfc6e-1150-4876-83a6-3da9bf2c7d19', '20.2 Force on a current-carrying conductor', '4.5.4', None, None, None, None),
    ('9d9243fa-2e10-410b-b452-acc01c7d083f', '20.3 Electric motors', '4.5.5', None, None, None, None),
    ('9800f3c8-b995-4f96-b99c-eb2851a0cc82', '20.4 Beams of charged particles and magnetic fields', '4.5.4', None, None, None, None),
    # 21 Electromagnetic Induction
    ('bcd0140d-fefe-480a-b59d-616e317b83a3', '21.1 Generating electricity', '4.5.1', None, None, None, None),
    ('912305ea-f3a3-4ce0-8543-93b6d6b92ad8', '21.2 Power lines and transformers', '4.5.6', None, None, None, None),
    ('f4169652-1c30-4be7-91ae-b99db03cfd6b', '21.3 How transformers work', '4.5.6', None, None, None, None),
    # 22 The Nuclear Atom
    ('93408dd8-ae70-4f3e-b8ef-b7b0695514ed', '22.1 Atomic structure', '5.1.1', None, None, None, None),
    ('fb4dde41-c24f-4e65-94c1-b16d6b4d4c7a', '22.2 Protons, neutrons and electrons', '5.1.2', None, None, None, None),
    # 23 Radioactivity
    ('5dd296d7-ed28-4b19-a2b7-bca701ee977e', '23.1 Radioactivity all around us', '5.2.1', None, None, None, None),
    ('06cfc9df-f282-488d-815c-f516326e0c7d', '23.2 Radioactive decay', '5.2.3', None, None, None, None),
    ('97e38b4a-35e0-45e7-a53f-405ee0ee00fd', '23.3 Activity and half-life', '5.2.4', None, '23.2', 'E.3',
     'The random nature of radioactive decay, activity and half-life; at A Level, the decay constant, A = λN and x = x₀e^(−λt).'),
    ('e037feb3-7322-4c75-852c-2bd78c812404', '23.4 Using radioisotopes', '5.2.5', None, None, None, None),
    # 24 Earth and the Solar System
    ('b465907e-6025-4df6-b0d7-250feb0dc01a', '24.1 Earth, Sun and Moon', '6.1.1', None, None, None, None),
    ('ff6b0343-79e8-442d-9e94-216272b74071', '24.2 The Solar System', '6.1.2', None, None, None, None),
    ('1585a36a-5b5c-5505-abe3-98e37e28c48b', '24.3 Gravitation and orbits (extension)', '6.1.2', None, '13.2', 'D.1',
     'Newton’s law of gravitation, F = Gm₁m₂/r², and circular orbits: orbital speed, period and the mass of the central body.'),
    # 25 Stars and the Universe
    ('aff89259-48b2-4ede-8d8d-4c7d3319cdb5', '25.1 The Sun', '6.2.1', None, None, None, None),
    ('e8ea0798-10c5-400a-8746-fac573013ada', '25.2 Stars and galaxies', '6.2.2', None, None, None, None),
    ('cc43b4db-fde3-4667-b759-f1e1ecfd6003', '25.3 The Universe', '6.2.3', None, None, None, None),
]

assert len(EXISTING) == 101, len(EXISTING)
assert len({e[0] for e in EXISTING}) == 101

# ════════════════════════════════════════════════════════════════════════
# 2. New lessons for syllabus sections no existing lesson covers
# ════════════════════════════════════════════════════════════════════════
UNITS_9702 = {
    1: 'Physical quantities and units', 2: 'Kinematics', 3: 'Dynamics', 4: 'Forces, density and pressure',
    5: 'Work, energy and power', 6: 'Deformation of solids', 7: 'Waves', 8: 'Superposition', 9: 'Electricity',
    10: 'D.C. circuits', 11: 'Particle physics', 12: 'Motion in a circle', 13: 'Gravitational fields',
    14: 'Temperature', 15: 'Ideal gases', 16: 'Thermodynamics', 17: 'Oscillations', 18: 'Electric fields',
    19: 'Capacitance', 20: 'Magnetic fields', 21: 'Alternating currents', 22: 'Quantum physics',
    23: 'Nuclear physics', 24: 'Medical physics', 25: 'Astronomy and cosmology',
}
UNITS_IB = {1: ('A', 'Space, time and motion'), 2: ('B', 'The particulate nature of matter'), 3: ('C', 'Wave behaviour'),
            4: ('D', 'Fields'), 5: ('E', 'Nuclear and quantum physics')}

# (9702 code, title, ib code, syllabus reference)
NEW_9702 = [
    ('1.2', 'SI base units and homogeneity', None,
     'Recall the SI base quantities and units, express derived units as products or quotients of base units, and use them to check that an equation is homogeneous.'),
    ('1.3', 'Errors and uncertainties', 'Tool 3',
     'Distinguish systematic from random errors and accuracy from precision; assess and combine absolute, fractional and percentage uncertainties.'),
    ('2.1', 'Equations of motion', 'A.1',
     'Define displacement, velocity and acceleration; use displacement–time and velocity–time graphs; derive and use the equations of uniformly accelerated motion in a straight line.'),
    ('2.1', 'Projectile motion', 'A.1',
     'Solve problems on motion under uniform acceleration in two dimensions by treating the horizontal and vertical motions independently.'),
    ('3.1', "Momentum and Newton's laws of motion", 'A.2',
     'Define linear momentum; state Newton’s three laws and use F = Δp/Δt, with F = ma as the special case of constant mass; weight as W = mg.'),
    ('3.2', 'Drag and terminal velocity', 'A.2',
     'Describe how air resistance and viscous drag increase with speed, and the motion of an object falling in a uniform field with drag, reaching terminal velocity.'),
    ('3.3', 'Conservation of momentum and collisions', 'A.2',
     'Apply conservation of momentum to collisions and interactions in one and two dimensions; distinguish elastic from inelastic collisions using relative speeds of approach and separation.'),
    ('4.1', 'Couples and torque', 'A.4',
     'Define the moment of a force and the torque of a couple, and apply the principle of moments to a system in equilibrium.'),
    ('4.2', 'Equilibrium and the triangle of forces', 'A.2',
     'Use the conditions for equilibrium — no resultant force and no resultant moment — and represent three coplanar forces in equilibrium with a closed vector triangle.'),
    ('4.3', 'Upthrust and Archimedes’ principle', None,
     'Define density and pressure; derive Δp = ρgΔh; explain upthrust as the pressure difference across a submerged object, and use F = ρgV.'),
    ('5.1', 'Work, efficiency and power', 'A.3',
     'Use work done W = Fs cos θ, the conservation of energy and efficiency, and power as the rate of doing work, including P = Fv.'),
    ('5.2', 'Gravitational potential energy and kinetic energy', 'A.3',
     'Derive ΔEₚ = mgΔh and Eₖ = ½mv² from the equations of motion, and use them in energy-conservation problems.'),
    ('6.1', 'Stress, strain and the Young modulus', None,
     'Define and use stress, strain and the Young modulus, and describe an experiment to determine the Young modulus of a metal wire.'),
    ('6.2', 'Elastic and plastic behaviour', None,
     'Distinguish elastic from plastic deformation, and find the elastic potential energy from the area under a force–extension graph: E = ½Fx = ½kx².'),
    ('7.1', 'Progressive waves', 'C.2',
     'Describe progressive waves by displacement, amplitude, phase difference, period, frequency, wavelength and speed; derive v = fλ; intensity ∝ amplitude².'),
    ('7.2', 'Transverse and longitudinal waves', 'C.2',
     'Compare transverse and longitudinal waves, and analyse graphs of displacement against distance and against time for both.'),
    ('7.3', 'Doppler effect for sound waves', 'C.5',
     'Explain the Doppler shift when a source moves relative to a stationary observer, and use fₒ = fₛv/(v ± vₛ).'),
    ('7.4', 'The electromagnetic spectrum', 'C.2',
     'Recall that all electromagnetic waves travel at c in free space, and the approximate wavelength range of each principal region of the spectrum.'),
    ('7.5', 'Polarisation and Malus’s law', None,
     'Understand polarisation as a property of transverse waves only, and use Malus’s law, I = I₀cos²θ.'),
    ('8.1', 'Stationary waves', 'C.4',
     'Explain how stationary waves form by superposition, identify nodes and antinodes, and use them to find the wavelength of sound.'),
    ('8.2', 'Diffraction', 'C.3',
     'Explain diffraction at a gap or an edge, and how the amount of spreading depends on the wavelength compared with the gap width.'),
    ('8.4', 'The diffraction grating', 'C.3',
     'Use d sin θ = nλ for the angles of the maxima from a diffraction grating, and use a grating to measure wavelength.'),
    ('9.1', 'Electric current and charge carriers', 'B.5',
     'Understand current as a flow of charge carriers; use Q = It and the quantisation of charge; derive and use I = Anvq.'),
    ('9.2', 'Potential difference and power', 'B.5',
     'Define p.d. as energy transferred per unit charge, V = W/Q, and use P = VI, P = I²R and P = V²/R.'),
    ('9.3', 'Resistivity and I–V characteristics', 'B.5',
     'Sketch the I–V characteristics of a metallic conductor, a filament lamp and a diode; use R = ρL/A; describe how an LDR and a thermistor respond.'),
    ('10.1', 'EMF and internal resistance', 'B.5',
     'Distinguish e.m.f. from p.d. in terms of energy, and explain how internal resistance reduces the terminal p.d.'),
    ('10.2', "Kirchhoff's laws", None,
     'Apply Kirchhoff’s first law (conservation of charge) and second law (conservation of energy), and derive the combined resistance of resistors in series and in parallel.'),
    ('10.3', 'Potential dividers', None,
     'Use a potential divider, including one containing a thermistor or LDR, and understand the principle of the potentiometer.'),
    ('11.1', 'The nuclear atom and radioactive decay', 'E.1',
     'Infer the nuclear atom from α-particle scattering; use nuclide notation; describe α, β⁻, β⁺ and γ emission, including the continuous β energy spectrum and (anti)neutrinos.'),
    ('11.2', 'Quarks, hadrons and leptons', None,
     'Describe the quark model — up, down and strange quarks and their charges — baryons and mesons as hadrons, leptons, and the quark changes in β⁻ and β⁺ decay.'),
    # A Level (units 12–25)
    ('12.1', 'Radians and angular speed', 'A.2',
     'Define the radian and angular displacement, and use angular speed ω = 2π/T and v = rω.'),
    ('13.1', 'Gravitational fields and field lines', 'D.1',
     'Understand a gravitational field as a field of force, define gravitational field strength as force per unit mass, and represent fields with field lines.'),
    ('13.3', 'Field strength of a point mass', 'D.1',
     'Derive g = GM/r² from Newton’s law of gravitation, and explain why g is approximately constant close to the Earth’s surface.'),
    ('13.4', 'Gravitational potential', 'D.1',
     'Define gravitational potential as the work done per unit mass bringing a small test mass from infinity; use φ = −GM/r and ΔEₚ = mΔφ.'),
    ('14.1', 'Thermal equilibrium', 'B.1',
     'Understand that thermal energy is transferred from higher to lower temperature, and that regions at the same temperature are in thermal equilibrium.'),
    ('14.2', 'Temperature scales', None,
     'Understand that the thermodynamic scale does not depend on the property of any substance; convert between kelvin and degrees Celsius; use physical properties in thermometers.'),
    ('14.3', 'Specific heat capacity and latent heat', 'B.1',
     'Define and use specific heat capacity and specific latent heat, and describe experiments to measure them.'),
    ('15.1', 'The mole and the Avogadro constant', 'B.3',
     'Understand the amount of substance in moles, and use the Avogadro constant N_A = 6.02 × 10²³ mol⁻¹.'),
    ('15.2', 'The ideal gas equation', 'B.3',
     'Recall and use pV = nRT = NkT for an ideal gas, with the Boltzmann constant k = R/N_A.'),
    ('15.3', 'Kinetic theory of gases', 'B.3',
     'State the assumptions of the kinetic theory; derive pV = ⅓Nm⟨c²⟩; relate the mean translational kinetic energy of a molecule to temperature, ½m⟨c²⟩ = 3⁄2 kT.'),
    ('16.1', 'Internal energy', 'B.4',
     'Understand internal energy as the sum of the random kinetic and potential energies of the molecules, and relate a rise in temperature to a rise in their kinetic energy.'),
    ('16.2', 'The first law of thermodynamics', 'B.4',
     'Use ΔU = q + W, with W = −pΔV the work done on a gas, and the sign convention for each term.'),
    ('17.1', 'Simple harmonic motion', 'C.1',
     'Define SHM by a = −ω²x; use x = x₀ sin ωt and v = ±ω√(x₀² − x²); relate the graphs of displacement, velocity and acceleration.'),
    ('17.2', 'Energy in simple harmonic motion', 'C.1',
     'Describe the interchange between kinetic and potential energy during SHM, and use E = ½mω²x₀².'),
    ('17.3', 'Damped and forced oscillations, resonance', 'C.4',
     'Describe light, critical and heavy damping, forced oscillations and resonance, and how damping changes the resonance curve.'),
    ('18.1', 'Electric fields and field lines', 'D.2',
     'Understand an electric field as a field of force, define field strength as force per unit positive charge, and represent fields with field lines.'),
    ('18.2', 'Uniform electric fields', 'D.3',
     'Use E = ΔV/Δd for the uniform field between parallel plates, and describe the motion of a charged particle entering it.'),
    ('18.4', 'Field strength of a point charge', 'D.2',
     'Use E = Q/(4πε₀r²) for the field strength due to a point charge in free space.'),
    ('18.5', 'Electric potential', 'D.2',
     'Define electric potential; use V = Q/(4πε₀r), electric potential energy Eₚ = qV, and field strength as the negative potential gradient.'),
    ('19.1', 'Capacitors and capacitance', None,
     'Define capacitance, C = Q/V, and derive the combined capacitance of capacitors in series and in parallel.'),
    ('19.2', 'Energy stored in a capacitor', None,
     'Find the energy stored from the area under a p.d.–charge graph, W = ½QV = ½CV².'),
    ('19.3', 'Discharging a capacitor', None,
     'Analyse the discharge of a capacitor through a resistor: time constant τ = RC and x = x₀e^(−t/RC) for current, charge or p.d.'),
    ('20.1', 'Magnetic fields and flux density', 'D.2',
     'Understand a magnetic field as a field of force produced by moving charges or permanent magnets, and represent it with field lines.'),
    ('20.2', 'Force on a current-carrying conductor', 'D.3',
     'Use F = BIL sin θ and Fleming’s left-hand rule, and define magnetic flux density and the tesla.'),
    ('20.3', 'Force on a moving charge', 'D.3',
     'Use F = BQv sin θ; analyse the circular path of a charged particle in a uniform field, velocity selection and the Hall voltage.'),
    ('20.4', 'Magnetic fields due to currents', 'D.2',
     'Sketch the fields of a long straight wire, a flat circular coil and a long solenoid, and explain the forces between current-carrying conductors.'),
    ('20.5', 'Electromagnetic induction', 'D.4',
     'Define magnetic flux and flux linkage, and use Faraday’s and Lenz’s laws to find the size and direction of an induced e.m.f.'),
    ('21.1', 'Alternating current and r.m.s. values', None,
     'Describe sinusoidal a.c. by its period, frequency, peak value and r.m.s. value; use I_rms = I₀/√2 and mean power = ½ × peak power for a resistive load.'),
    ('21.2', 'Rectification and smoothing', None,
     'Distinguish half-wave from full-wave rectification with diodes, and explain smoothing by a capacitor.'),
    ('22.1', 'Photons: energy and momentum', 'E.1',
     'Understand the particulate nature of electromagnetic radiation: photon energy E = hf, momentum p = E/c, and the electronvolt.'),
    ('22.2', 'The photoelectric effect', 'E.2',
     'Explain photoelectric emission using photons, threshold frequency and work function, and use hf = Φ + ½mv²ₘₐₓ.'),
    ('22.3', 'Wave–particle duality', 'E.2',
     'Describe electron diffraction as evidence for the wave nature of particles, and use the de Broglie wavelength λ = h/p.'),
    ('22.4', 'Energy levels and line spectra', 'E.1',
     'Explain emission and absorption line spectra using discrete electron energy levels, hf = E₁ − E₂.'),
    ('23.1', 'Mass defect and binding energy', 'E.3',
     'Use E = mc², mass defect and binding energy per nucleon, and relate the binding-energy-per-nucleon curve to fission and fusion.'),
    ('24.1', 'Ultrasound', None,
     'Explain how piezoelectric transducers generate and detect ultrasound; use specific acoustic impedance Z = ρc and the intensity reflection coefficient.'),
    ('24.2', 'X-ray imaging and CT', None,
     'Explain the production of X-rays, attenuation I = I₀e^(−μx), image contrast and how CT scanning builds a 3D image.'),
    ('24.3', 'PET scanning', None,
     'Explain PET scanning: β⁺-emitting tracers, electron–positron annihilation and detection of the two gamma photons.'),
    ('25.1', 'Standard candles and luminosity', 'E.5',
     'Understand luminosity and radiant flux intensity, F = L/(4πd²), and how standard candles are used to measure distances.'),
    ('25.2', 'Stellar radii: Wien and Stefan–Boltzmann', 'E.5',
     'Use Wien’s displacement law, λₘₐₓ ∝ 1/T, and the Stefan–Boltzmann law, L = 4πσr²T⁴, to estimate the radius of a star.'),
    ('25.3', 'Hubble’s law and the Big Bang', None,
     'Use redshift, Δλ/λ ≈ Δf/f ≈ v/c, and Hubble’s law, v ≈ H₀d, as evidence for an expanding Universe and the Big Bang theory.'),
]

# IB subtopics with nothing to share with a Cambridge lesson
NEW_IB = [
    ('A.4', 'Moment of inertia and angular momentum',
     'Describe rotational motion with torque, moment of inertia, angular acceleration and angular momentum: τ = Iα and L = Iω. (HL)'),
    ('A.5', 'Special relativity',
     'Use Galilean transformations, the postulates of special relativity, Lorentz transformations, time dilation and length contraction. (HL)'),
    ('B.2', 'The greenhouse effect',
     'Model the Earth’s energy balance using the Stefan–Boltzmann law, emissivity and albedo, and explain the greenhouse effect.'),
    ('B.4', 'Entropy and the second law',
     'Apply the first law to gas processes and heat-engine cycles, and understand entropy, the second law of thermodynamics and Carnot efficiency. (HL)'),
    ('E.4', 'Nuclear fission',
     'Describe neutron-induced fission, chain reactions and the parts of a nuclear reactor: moderator, control rods, coolant and shielding.'),
    ('E.5', 'Fusion and stellar evolution',
     'Explain fusion as the energy source of stars, hydrostatic equilibrium, the Hertzsprung–Russell diagram and the evolution of stars of different masses.'),
]

chapters = []   # dicts
new_topics = []  # dicts
topic_by_key = {}


def chapter_9702(unit):
    return uid(f'chapter/9702/{unit}')


def chapter_ib(n):
    return uid(f'chapter/ib/{UNITS_IB[n][0]}')


units_used = sorted({int(code.split('.')[0]) for code, *_ in NEW_9702})
for unit in units_used:
    level = 'AS' if unit <= 11 else 'A Level'
    chapters.append(dict(
        id=chapter_9702(unit), course=COURSE_9702, number=unit, title=UNITS_9702[unit],
        objectives=f'Cambridge International AS & A Level Physics (9702), {level} unit {unit}: {UNITS_9702[unit]}.'))

ib_used = sorted({'ABCDE'.index(code[0]) + 1 for code, *_ in NEW_IB})
for n in ib_used:
    letter, title = UNITS_IB[n]
    chapters.append(dict(
        id=chapter_ib(n), course=COURSE_IB, number=n, title=title,
        objectives=f'IB Diploma Programme Physics, theme {letter}: {title}.'))

order_in_unit = {}
for code, title, ib, ref in NEW_9702:
    unit = int(code.split('.')[0])
    order_in_unit[unit] = order_in_unit.get(unit, 0) + 1
    tid = uid(f'topic/9702/{code}/{title}')
    curricula = ['as', 'a-level'] if unit <= 11 else ['a-level']
    if ib:
        curricula.append('ib')
    t = dict(id=tid, chapter=chapter_9702(unit), name=title, order=order_in_unit[unit], curricula=curricula,
             igcse=None, as_=code if unit <= 11 else None, al=code, ib=ib, ref=ref)
    new_topics.append(t)
    topic_by_key[('9702', code, title)] = t

order_in_theme = {}
for code, title, ref in NEW_IB:
    n = 'ABCDE'.index(code[0]) + 1
    order_in_theme[n] = order_in_theme.get(n, 0) + 1
    t = dict(id=uid(f'topic/ib/{code}/{title}'), chapter=chapter_ib(n), name=title, order=order_in_theme[n],
             curricula=['ib'], igcse=None, as_=None, al=None, ib=code, ref=ref)
    new_topics.append(t)
    topic_by_key[('ib', code, title)] = t

existing_by_name = {name: (tid, igcse, as_, al, ib) for tid, name, igcse, as_, al, ib, _ in EXISTING}
EXISTING_CHAPTER = {  # chapter ids for the existing lessons that get new questions
    '2.4 Calculating speed and acceleration': '157573de-e4fd-418b-9e2b-b4772e5fe137',
    '1.2 Density': '0484b128-3d2d-41b8-bab6-74ac48e74dae',
    '3.4 Force, mass and acceleration': 'a86aff95-adbc-4634-af1f-528e375e2230',
    '23.3 Activity and half-life': 'b6a4f484-3024-480c-acfe-3be0a11b5d17',
}

# ════════════════════════════════════════════════════════════════════════
# 3. Question banks, in priority order: AS → A Level → IGCSE → IB
# ════════════════════════════════════════════════════════════════════════
questions = []
bank_counter = {}

SECTION_TITLES = {}
for code, title, *_ in NEW_9702:
    SECTION_TITLES.setdefault(code, title)


class Bank:
    """Questions for one lesson in one curriculum."""

    def __init__(self, curriculum, topic_id, chapter_id, code, cite):
        self.curriculum, self.topic, self.chapter, self.code, self.cite = curriculum, topic_id, chapter_id, code, cite

    def _add(self, **kw):
        key = (self.topic, self.curriculum)
        bank_counter[key] = bank_counter.get(key, 0) + 1
        n = bank_counter[key]
        questions.append(dict(
            id=uid(f'problem/{self.curriculum}/{self.topic}/{n}'), topic=self.topic, chapter=self.chapter,
            curriculum=self.curriculum, code=self.code, cite=self.cite, number=n, **kw))

    def num(self, text, answer, unit, explanation, difficulty, tolerance=None, sign=False):
        # A prefixed unit is written into the answer itself ("570 nm"), so the
        # grader accepts both "570" and "5.7e-7 m"; see specFromProblem.
        prefixed = unit in ('mm', 'cm', 'nm', 'mA', 'kN', 'kJ', 'kPa', 'ms', 'kW', 'MW')
        ans = f'{stored(answer)} {unit}' if prefixed else stored(answer)
        self._add(text=text, answer=ans, value=answer, unit=unit, explanation=explanation, difficulty=difficulty,
                  tolerance=tolerance, sign=sign, type='numeric', options=None)

    def mcq(self, text, options, explanation, difficulty):
        correct = [o for o, ok in options if ok]
        assert len(correct) == 1
        self._add(text=text, answer=correct[0], value=None, unit=None, explanation=explanation, difficulty=difficulty,
                  tolerance=None, sign=False, type='multiple_choice', options=options)


def new_topic(key):
    t = topic_by_key[key]
    return t['id'], t['chapter']


def existing_topic(name):
    return existing_by_name[name][0], EXISTING_CHAPTER[name]


G_TEXT = 'Take g = 9.81 m/s².'

# ── Phase 1: AS Level ────────────────────────────────────────────────────

b = Bank('as', *new_topic(('9702', '2.1', 'Equations of motion')), '2.1', '9702 2.1 Equations of motion')
b.num('A car accelerates uniformly from 12 m/s to 30 m/s in 6.0 s. Calculate its acceleration.',
      (30 - 12) / 6.0, 'm/s²', 'a = (v − u)/t = (30 − 12) ÷ 6.0 = 3.0 m/s².', 1)
a = 25**2 / (2 * 400)
b.num('A train travelling at 25 m/s brakes uniformly and comes to rest in a distance of 400 m. Calculate the magnitude of its deceleration.',
      a, 'm/s²', f'Use v² = u² + 2as with v = 0: 0 = 25² + 2a × 400, so a = −625 ÷ 800 = −{sf(a)} m/s². The deceleration is {sf(a)} m/s².', 2)
h = 18**2 / (2 * g)
b.num(f'A ball is thrown vertically upwards at 18 m/s. Ignoring air resistance, calculate the maximum height it reaches above the point of release. {G_TEXT}',
      h, 'm', f'At the top v = 0. With a = −9.81 m/s²: 0 = 18² − 2 × 9.81 × s, so s = 324 ÷ 19.62 = {sf(h)} m.', 2)
t = sqrt(2 * 45 / g)
b.num(f'A stone is dropped from rest from the top of a 45 m cliff. Ignoring air resistance, calculate the time it takes to reach the sea below. {G_TEXT}',
      t, 's', f's = ut + ½at² with u = 0: 45 = ½ × 9.81 × t², so t = √(90 ÷ 9.81) = {sf(t)} s.', 2)
s = 4.0 * 6.0 + 0.5 * 1.5 * 6.0**2
b.num('A cyclist moving at 4.0 m/s accelerates uniformly at 1.5 m/s² for 6.0 s. Calculate her displacement during this time.',
      s, 'm', f's = ut + ½at² = 4.0 × 6.0 + ½ × 1.5 × 6.0² = 24 + 27 = {sf(s)} m.', 2)
b.mcq('What does the area under a velocity–time graph represent?',
      [('Displacement', True), ('Acceleration', False), ('Velocity', False), ('Force', False)],
      'Area under a v–t graph is velocity × time, which is displacement. The GRADIENT of a v–t graph is the acceleration.', 1)

b = Bank('as', *new_topic(('9702', '2.1', 'Projectile motion')), '2.1', '9702 2.1 Equations of motion (two dimensions)')
t = sqrt(2 * 1.25 / g)
x = 3.0 * t
b.num(f'A ball rolls off the edge of a horizontal table 1.25 m high at 3.0 m/s. Ignoring air resistance, calculate how far from the foot of the table it lands. {G_TEXT}',
      x, 'm', f'Vertically the ball starts with zero velocity: 1.25 = ½ × 9.81 × t², so t = {sf(t)} s. Horizontally the speed stays 3.0 m/s, so x = 3.0 × {sf(t)} = {sf(x)} m.', 2)
T = 2 * 20 * sin(radians(30)) / g
b.num(f'A projectile is launched from level ground at 20 m/s at 30° above the horizontal. Ignoring air resistance, calculate its time of flight. {G_TEXT}',
      T, 's', f'The vertical component is 20 sin30° = 10 m/s. It lands when the vertical displacement is zero again: t = 2 × 10 ÷ 9.81 = {sf(T)} s.', 2)
R = 20**2 * sin(radians(60)) / g
b.num(f'The same projectile (20 m/s at 30° above the horizontal, from level ground) lands back on the ground. Calculate its horizontal range. {G_TEXT}',
      R, 'm', f'Horizontal velocity = 20 cos30° = {sf(20 * cos(radians(30)))} m/s, time of flight = {sf(T)} s, so range = {sf(20 * cos(radians(30)))} × {sf(T)} = {sf(R)} m.', 3)
vy = 25 * sin(radians(40))
hmax = vy**2 / (2 * g)
b.num(f'A football is kicked at 25 m/s at 40° above the horizontal. Ignoring air resistance, calculate the maximum height it reaches. {G_TEXT}',
      hmax, 'm', f'Only the vertical component matters: u_y = 25 sin40° = {sf(vy)} m/s. At the top v_y = 0, so h = u_y² ÷ 2g = {sf(vy)}² ÷ 19.62 = {sf(hmax)} m.', 3)
b.mcq('A projectile moves through the air with no air resistance. Which statement is true at the highest point of its path?',
      [('Its acceleration is 9.81 m/s² downwards', True), ('Its velocity is zero', False),
       ('Its acceleration is zero', False), ('Its horizontal velocity is zero', False)],
      'Gravity acts throughout the flight, so the acceleration is always g downwards — even at the top. Only the VERTICAL velocity is zero there; the horizontal velocity is unchanged.', 1)

b = Bank('as', *new_topic(('9702', '1.3', 'Errors and uncertainties')), '1.3', '9702 1.3 Errors and uncertainties')
b.num('A length is measured as 25.0 ± 0.1 cm. Calculate the percentage uncertainty in the measurement.',
      0.1 / 25.0 * 100, '%', 'Percentage uncertainty = (absolute uncertainty ÷ value) × 100 = (0.1 ÷ 25.0) × 100 = 0.4%.', 1)
pR = (0.1 / 6.0 + 0.1 / 2.0) * 100
b.num('A resistance is found from R = V/I, where V = 6.0 ± 0.1 V and I = 2.0 ± 0.1 A. Calculate the percentage uncertainty in R.',
      pR, '%', f'For a quotient, add the percentage uncertainties: V has (0.1 ÷ 6.0) × 100 = {sf(0.1 / 6 * 100)}% and I has (0.1 ÷ 2.0) × 100 = 5.0%, so R has {sf(pR)}%.', 2)
b.num('The side of a cube is measured as 2.00 ± 0.02 cm. Calculate the percentage uncertainty in the volume of the cube.',
      3 * 0.02 / 2.00 * 100, '%', 'The side has a 1.0% uncertainty. V = l³, and for a power the percentage uncertainty is multiplied by the power: 3 × 1.0% = 3.0%.', 2)
b.num('Two quantities are measured as A = 5.0 ± 0.2 and B = 3.0 ± 0.1. Calculate the absolute uncertainty in C = A − B.',
      0.3, None, 'For a sum OR a difference, add the absolute uncertainties: 0.2 + 0.1 = 0.3. (Subtracting never cancels uncertainty.)', 2)
b.mcq('A micrometer screw gauge reads 0.02 mm when its jaws are fully closed. What kind of error does this cause in every reading taken with it?',
      [('A systematic error', True), ('A random error', False), ('A parallax error that averages out', False), ('No error, if readings are repeated', False)],
      'A zero error shifts every reading by the same amount in the same direction — that is a systematic error. Repeating readings and averaging reduces random errors only; a systematic error must be corrected by subtracting the zero reading.', 1)
b.mcq('A set of repeated readings are all very close to one another, but far from the true value. How are the readings best described?',
      [('Precise but not accurate', True), ('Accurate but not precise', False), ('Both accurate and precise', False), ('Neither accurate nor precise', False)],
      'Precision is about how close the readings are to each other (small spread). Accuracy is about how close they are to the true value. Close together but off-target is precise but inaccurate — typical of a systematic error.', 1)

b = Bank('as', *new_topic(('9702', '6.1', 'Stress, strain and the Young modulus')), '6.1', '9702 6.1 Stress and strain')
A = pi * (0.25e-3)**2
b.num('A steel wire of diameter 0.50 mm supports a load of 60 N. Calculate the tensile stress in the wire.',
      60 / A, 'Pa', f'Cross-sectional area A = πr² = π × (0.25 × 10⁻³)² = {sf(A)} m². Stress = F/A = 60 ÷ {sf(A)} = {sf(60 / A)} Pa.', 2, tolerance=0.03)
b.num('A wire of original length 2.0 m is stretched by 1.2 mm. Calculate the strain.',
      1.2e-3 / 2.0, None, 'Strain = extension ÷ original length = 1.2 × 10⁻³ m ÷ 2.0 m = 6.0 × 10⁻⁴. Strain is a ratio of two lengths, so it has no unit.', 1)
b.num('A wire under a stress of 3.0 × 10⁸ Pa has a strain of 1.5 × 10⁻³. Calculate the Young modulus of the material.',
      3.0e8 / 1.5e-3, 'Pa', 'Young modulus E = stress ÷ strain = 3.0 × 10⁸ ÷ 1.5 × 10⁻³ = 2.0 × 10¹¹ Pa.', 1)
ext = 40 * 1.5 / (2.0e-7 * 1.2e11)
b.num('A copper wire is 1.5 m long and has a cross-sectional area of 2.0 × 10⁻⁷ m². The Young modulus of copper is 1.2 × 10¹¹ Pa. Calculate the extension when a load of 40 N hangs from it, in mm.',
      ext * 1000, 'mm', f'Rearrange E = FL/(Ax): x = FL/(AE) = (40 × 1.5) ÷ (2.0 × 10⁻⁷ × 1.2 × 10¹¹) = 60 ÷ 24 000 = {sf(ext)} m = {sf(ext * 1000)} mm.', 3)
b.mcq('For a metal wire below its limit of proportionality, the Young modulus is equal to the gradient of which graph?',
      [('Stress against strain', True), ('Strain against stress', False), ('Force against extension', False), ('Extension against force', False)],
      'E = stress ÷ strain, so it is the gradient of a stress (y-axis) against strain (x-axis) graph. The gradient of force against extension is the spring constant k, which depends on the wire’s dimensions — the Young modulus does not.', 1)

b = Bank('as', *new_topic(('9702', '10.2', "Kirchhoff's laws")), '10.2', "9702 10.2 Kirchhoff's laws")
b.num('Currents of 3.0 A and 1.2 A flow into a junction. Two wires carry current away from it; one carries 2.5 A. Calculate the current in the other.',
      3.0 + 1.2 - 2.5, 'A', 'Kirchhoff’s first law: total current in = total current out. 3.0 + 1.2 = 2.5 + I, so I = 1.7 A.', 1)
b.num('Calculate the combined resistance of a 6.0 Ω resistor and a 3.0 Ω resistor connected in parallel.',
      1 / (1 / 6 + 1 / 3), 'Ω', '1/R = 1/6.0 + 1/3.0 = 1/6 + 2/6 = 3/6, so R = 2.0 Ω — less than either resistor alone.', 1)
b.num('A 12 V battery of negligible internal resistance is connected to a 4.0 Ω resistor in series with a parallel pair of 6.0 Ω and 12 Ω resistors. Calculate the current from the battery.',
      12 / (4 + 1 / (1 / 6 + 1 / 12)), 'A', 'The parallel pair: 1/R = 1/6 + 1/12 = 3/12, so R = 4.0 Ω. Total resistance = 4.0 + 4.0 = 8.0 Ω. I = V/R = 12 ÷ 8.0 = 1.5 A.', 2)
b.num('In the same circuit (12 V; 4.0 Ω in series with 6.0 Ω and 12 Ω in parallel), calculate the current in the 12 Ω resistor.',
      1.5 * 4.0 / 12, 'A', 'The battery current is 1.5 A. The p.d. across the parallel pair is 1.5 × 4.0 = 6.0 V (Kirchhoff’s second law: 12 V = 6.0 V across the 4.0 Ω + 6.0 V across the pair). So the 12 Ω resistor carries 6.0 ÷ 12 = 0.50 A.', 3)
b.mcq("Kirchhoff's second law is a consequence of the conservation of which quantity?",
      [('Energy', True), ('Charge', False), ('Momentum', False), ('Current', False)],
      'Round any closed loop the sum of the e.m.f.s equals the sum of the p.d.s: the energy each coulomb gains from sources equals the energy it transfers to components. The FIRST law (currents at a junction) is conservation of charge.', 1)

b = Bank('as', *new_topic(('9702', '9.3', 'Resistivity and I–V characteristics')), '9.3', '9702 9.3 Resistance and resistivity')
b.num('A nichrome wire has resistivity 1.1 × 10⁻⁶ Ω m, length 2.0 m and cross-sectional area 5.0 × 10⁻⁷ m². Calculate its resistance.',
      1.1e-6 * 2.0 / 5.0e-7, 'Ω', 'R = ρL/A = (1.1 × 10⁻⁶ × 2.0) ÷ 5.0 × 10⁻⁷ = 4.4 Ω.', 1)
A = pi * (0.20e-3)**2
rho = 0.20 * A / 1.5
b.num('A wire of length 1.5 m and diameter 0.40 mm has a resistance of 0.20 Ω. Calculate the resistivity of the metal, in Ω m.',
      rho, 'Ω m', f'A = π(d/2)² = π × (0.20 × 10⁻³)² = {sf(A)} m². ρ = RA/L = 0.20 × {sf(A)} ÷ 1.5 = {sf(rho)} Ω m — about the value for copper.', 3, tolerance=0.03)
Rnew = 8.0 * (2.0 / 5.0) / 4
b.num('A 5.0 m length of wire has a resistance of 8.0 Ω. Calculate the resistance of a 2.0 m length of wire made of the same metal but with twice the diameter.',
      Rnew, 'Ω', f'R = ρL/A and A ∝ d². The length is × 2.0/5.0 = 0.4; doubling the diameter makes the area × 4. R = 8.0 × 0.4 ÷ 4 = {sf(Rnew)} Ω.', 3)
b.mcq('A metal wire is stretched until its length doubles. Its volume and resistivity stay the same. By what factor does its resistance change?',
      [('× 4', True), ('× 2', False), ('× ½', False), ('It stays the same', False)],
      'Constant volume means doubling L halves A. R = ρL/A, so R goes × 2 from the length and × 2 again from the halved area: × 4 overall.', 3)
b.mcq('As the p.d. across a filament lamp increases, what happens to its resistance, and why?',
      [('It increases, because the filament gets hotter', True), ('It decreases, because more charge carriers are released', False),
       ('It stays constant, because the lamp is ohmic', False), ('It increases, because the filament gets longer', False)],
      'A hotter metal filament has ions vibrating with larger amplitude, so the electrons collide more often and the resistance rises. That is why its I–V graph curves towards the V axis.', 1)

b = Bank('as', *new_topic(('9702', '8.4', 'The diffraction grating')), '8.4', '9702 8.4 The diffraction grating')
d = 1e-3 / 500
th = degrees(asin(600e-9 / d))
b.num('Light of wavelength 600 nm falls normally on a diffraction grating with 500 lines per mm. Calculate the angle of the first-order maximum, in degrees.',
      th, '°', f'd = 1 ÷ 500 mm = {sf(d)} m. sinθ = nλ/d = 600 × 10⁻⁹ ÷ {sf(d)} = {sf(600e-9 / d)}, so θ = {sf(th)}°.', 2)
b.num('For the same grating (500 lines per mm) and light (600 nm), what is the highest order of maximum that can be observed?',
      int(d / 600e-9), None, f'sinθ cannot exceed 1, so n ≤ d/λ = {sf(d)} ÷ 600 × 10⁻⁹ = {sf(d / 600e-9)}. The highest whole-number order is {int(d / 600e-9)}.', 2)
d = 1e-3 / 300
lam = d * sin(radians(20.0)) / 2
b.num('A grating with 300 lines per mm produces a second-order maximum at 20.0° to the straight-through direction. Calculate the wavelength of the light, in nm.',
      lam * 1e9, 'nm', f'd = 1 ÷ 300 mm = {sf(d)} m. λ = d sinθ / n = {sf(d)} × sin20.0° ÷ 2 = {sf(lam)} m = {sf(lam * 1e9)} nm.', 2)
d = 1e-3 / 400
th = degrees(asin(450e-9 / d))
b.num('Blue light of wavelength 450 nm passes through a grating with 400 lines per mm. Calculate the angle between the two first-order maxima, one either side of the central maximum, in degrees.',
      2 * th, '°', f'd = {sf(d)} m, sinθ = 450 × 10⁻⁹ ÷ {sf(d)} = {sf(450e-9 / d)}, θ = {sf(th)}°. The two first-order maxima are at ±{sf(th)}°, so they are {sf(2 * th)}° apart.', 3)
b.mcq('A diffraction grating is replaced by one with more lines per millimetre. What happens to the maxima for the same light?',
      [('They are further apart', True), ('They are closer together', False), ('They do not move', False), ('More orders become visible', False)],
      'More lines per mm means a smaller slit spacing d. From sinθ = nλ/d, a smaller d gives a larger θ for each order — the maxima spread further apart, and FEWER orders fit before sinθ reaches 1.', 2)

b = Bank('as', *existing_topic('3.4 Force, mass and acceleration'), '3.1', "9702 3.1 Momentum and Newton's laws of motion")
dp = 0.15 * (20 + 15)
b.num('A 0.15 kg ball hits a wall at 20 m/s and rebounds along the same line at 15 m/s. It is in contact with the wall for 0.050 s. Calculate the average force the wall exerts on the ball.',
      dp / 0.050, 'N', f'Taking the rebound direction as positive, Δp = 0.15 × 15 − 0.15 × (−20) = {sf(dp)} kg m/s. F = Δp/Δt = {sf(dp)} ÷ 0.050 = {sf(dp / 0.05)} N. (Velocity is a vector: the speeds add, they do not subtract.)', 3)
b.num('A 1200 kg car accelerates uniformly from rest to 24 m/s in 8.0 s. Calculate the resultant force on the car.',
      1200 * 24 / 8.0, 'N', 'F = Δp/Δt = (1200 × 24 − 0) ÷ 8.0 = 3600 N — the same as F = ma with a = 3.0 m/s², because the mass is constant.', 1)
b.num('Calculate the momentum of a 0.060 kg tennis ball moving at 35 m/s.',
      0.060 * 35, 'kg m/s', 'p = mv = 0.060 × 35 = 2.1 kg m/s, in the direction of motion.', 1)
b.num('Water leaves a hose at 12 m/s at a rate of 2.5 kg per second and hits a wall, where it stops without splashing back. Calculate the force on the wall.',
      2.5 * 12, 'N', 'Each second 2.5 kg of water loses 12 m/s, so the momentum lost per second is 2.5 × 12 = 30 kg m/s. Force = rate of change of momentum = 30 N.', 2)
T = 800 * (g + 1.5)
b.num(f'An 800 kg lift accelerates upwards at 1.5 m/s². Calculate the tension in the cable. {G_TEXT}',
      T, 'N', f'Resultant force upwards = T − mg = ma, so T = m(g + a) = 800 × (9.81 + 1.5) = {sf(T)} N.', 2)

# ── Phase 2: A Level ─────────────────────────────────────────────────────

EPS = 'Take ε₀ = 8.85 × 10⁻¹² F/m.'
b = Bank('a-level', *new_topic(('9702', '18.5', 'Electric potential')), '18.5', '9702 18.5 Electric potential')
V = K_E * 4.0e-9 / 0.20
b.num(f'Calculate the electric potential at a distance of 0.20 m from a point charge of +4.0 nC. {EPS}',
      V, 'V', f'V = Q/(4πε₀r) = 4.0 × 10⁻⁹ ÷ (4π × 8.85 × 10⁻¹² × 0.20) = {sf(V)} V.', 2)
b.num('Calculate the work done in bringing a +2.0 µC charge from infinity to a point where the electric potential is 350 V.',
      2.0e-6 * 350, 'J', 'W = qV = 2.0 × 10⁻⁶ × 350 = 7.0 × 10⁻⁴ J.', 1)
Ep = K_E * 3.0e-6 * -2.0e-6 / 0.050
b.num(f'Calculate the electric potential energy of a +3.0 µC charge and a −2.0 µC charge placed 0.050 m apart. Give the sign. {EPS}',
      Ep, 'J', f'Eₚ = Q₁Q₂/(4πε₀r) = (3.0 × 10⁻⁶ × −2.0 × 10⁻⁶) ÷ (4π × 8.85 × 10⁻¹² × 0.050) = {sf(Ep)} J. It is negative because the charges attract: work must be done to separate them.', 3, sign=True)
v = sqrt(2 * E_CHARGE * 2000 / M_E)
b.num('An electron, initially at rest, is accelerated through a potential difference of 2000 V. Calculate its final speed. Take e = 1.60 × 10⁻¹⁹ C and mₑ = 9.11 × 10⁻³¹ kg.',
      v, 'm/s', f'The energy gained is eV = ½mv², so v = √(2eV/m) = √(2 × 1.60 × 10⁻¹⁹ × 2000 ÷ 9.11 × 10⁻³¹) = {sf(v)} m/s.', 3)
b.mcq('How is the electric field strength at a point related to the electric potential there?',
      [('It is the negative of the potential gradient', True), ('It is equal to the potential', False),
       ('It is the potential divided by the charge', False), ('It is the area under a potential–distance graph', False)],
      'E = −ΔV/Δx: the field points in the direction in which the potential falls fastest, and its size is how steeply it falls.', 2)

b = Bank('a-level', *new_topic(('9702', '19.3', 'Discharging a capacitor')), '19.3', '9702 19.3 Discharging a capacitor')
b.num('Calculate the time constant of a 470 µF capacitor discharging through a 22 kΩ resistor.',
      470e-6 * 22e3, 's', f'τ = RC = 22 × 10³ × 470 × 10⁻⁶ = {sf(470e-6 * 22e3)} s.', 1)
Vt = 12 * exp(-8.0 / (50e3 * 100e-6))
b.num('A 100 µF capacitor is charged to 12 V and then discharged through a 50 kΩ resistor. Calculate the p.d. across it 8.0 s later.',
      Vt, 'V', f'τ = RC = 50 × 10³ × 100 × 10⁻⁶ = 5.0 s. V = V₀e^(−t/RC) = 12 × e^(−8.0/5.0) = 12 × {exp(-1.6):.4f} = {sf(Vt)} V.', 2)
thalf = 10e3 * 220e-6 * log(2)
b.num('A 220 µF capacitor discharges through a 10 kΩ resistor. Calculate the time for its charge to fall to half its initial value.',
      thalf, 's', f'τ = RC = 2.2 s. Setting Q = ½Q₀ in Q = Q₀e^(−t/RC) gives t = RC ln2 = 2.2 × {log(2):.3f} = {sf(thalf)} s.', 3)
b.num('A capacitor charged to 9.0 V starts to discharge through a 4.7 kΩ resistor. Calculate the initial discharge current, in mA.',
      9.0 / 4.7e3 * 1000, 'mA', f'At the start the full 9.0 V is across the resistor: I₀ = V₀/R = 9.0 ÷ 4700 = {sf(9 / 4.7e3)} A = {sf(9 / 4.7)} mA. The capacitance only affects how fast the current then falls.', 1)
b.mcq('After one time constant, approximately what fraction of its initial charge remains on a discharging capacitor?',
      [('37%', True), ('50%', False), ('63%', False), ('10%', False)],
      'Q = Q₀e^(−t/RC); at t = RC, Q = Q₀e⁻¹ = 0.37Q₀. (63% is the fraction LOST — or the fraction gained when charging.)', 1)

b = Bank('a-level', *new_topic(('9702', '17.1', 'Simple harmonic motion')), '17.1', '9702 17.1 Simple harmonic oscillations')
w = 2 * pi / 0.50
b.num('A mass on a spring oscillates with simple harmonic motion of period 0.50 s and amplitude 3.0 cm. Calculate its maximum acceleration.',
      w**2 * 0.030, 'm/s²', f'ω = 2π/T = 2π ÷ 0.50 = {sf(w)} rad/s. The acceleration is largest at the extremes: a = ω²x₀ = {sf(w)}² × 0.030 = {sf(w**2 * 0.03)} m/s².', 2)
b.num('For the same oscillator (period 0.50 s, amplitude 3.0 cm), calculate the maximum speed of the mass.',
      w * 0.030, 'm/s', f'v_max = ωx₀ = {sf(w)} × 0.030 = {sf(w * 0.03)} m/s, reached as the mass passes through the equilibrium position.', 2)
v = w * sqrt(0.030**2 - 0.015**2)
b.num('For the same oscillator (period 0.50 s, amplitude 3.0 cm), calculate the speed of the mass when it is 1.5 cm from the equilibrium position.',
      v, 'm/s', f'v = ω√(x₀² − x²) = {sf(w)} × √(0.030² − 0.015²) = {sf(w)} × {sf(sqrt(0.03**2 - 0.015**2))} = {sf(v)} m/s.', 3)
f = sqrt(64) / (2 * pi)
b.num('The acceleration of an oscillating body is given by a = −64x, in SI units. Calculate its frequency.',
      f, 'Hz', f'Compare with a = −ω²x: ω² = 64, so ω = 8.0 rad/s and f = ω/2π = 8.0 ÷ 2π = {sf(f)} Hz.', 2)
b.mcq('Where in its motion is the acceleration of a body in simple harmonic motion greatest?',
      [('At maximum displacement', True), ('At the equilibrium position', False), ('Halfway between the two', False), ('It is the same everywhere', False)],
      'a = −ω²x, so the acceleration is proportional to the displacement: largest at the extremes (where the speed is zero) and zero at the centre (where the speed is greatest).', 1)

CONSTS_Q = 'Take h = 6.63 × 10⁻³⁴ J s, c = 3.00 × 10⁸ m/s and e = 1.60 × 10⁻¹⁹ C.'
b = Bank('a-level', *new_topic(('9702', '22.2', 'The photoelectric effect')), '22.2', '9702 22.2 Photoelectric effect')
E = H * C_LIGHT / 450e-9
b.num(f'Calculate the energy of a photon of blue light of wavelength 450 nm, in electronvolts. {CONSTS_Q}',
      E / E_CHARGE, 'eV', f'E = hc/λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 450 × 10⁻⁹ = {sf(E)} J. Dividing by 1.60 × 10⁻¹⁹ J/eV gives {sf(E / E_CHARGE)} eV.', 2)
f0 = 2.3 * E_CHARGE / H
b.num(f'A metal has a work function of 2.3 eV. Calculate its threshold frequency. {CONSTS_Q}',
      f0, 'Hz', f'At threshold the photon energy just equals the work function: hf₀ = Φ, so f₀ = (2.3 × 1.60 × 10⁻¹⁹) ÷ 6.63 × 10⁻³⁴ = {sf(f0)} Hz.', 2)
E = H * C_LIGHT / 250e-9 / E_CHARGE
b.num(f'Ultraviolet light of wavelength 250 nm falls on a metal with work function 4.5 eV. Calculate the maximum kinetic energy of the emitted electrons, in eV. {CONSTS_Q}',
      E - 4.5, 'eV', f'Photon energy = hc/λ = {sf(E * E_CHARGE)} J = {sf(E)} eV. Maximum kinetic energy = hf − Φ = {sf(E)} − 4.5 = {sf(E - 4.5)} eV.', 3, tolerance=0.05)
E = H * 7.5e14 / E_CHARGE
b.num(f'Light of frequency 7.5 × 10¹⁴ Hz falls on a surface with work function 2.0 eV. Calculate the stopping potential. {CONSTS_Q}',
      E - 2.0, 'V', f'hf = 6.63 × 10⁻³⁴ × 7.5 × 10¹⁴ = {sf(E * E_CHARGE)} J = {sf(E)} eV. The fastest electrons have {sf(E - 2.0)} eV, so a stopping potential of {sf(E - 2.0)} V stops them.', 3, tolerance=0.05)
b.mcq('The intensity of light shining on a metal is doubled, keeping its frequency the same and above the threshold. What changes?',
      [('The number of electrons emitted per second', True), ('The maximum kinetic energy of the electrons', False),
       ('The threshold frequency', False), ('The work function', False)],
      'Doubling the intensity doubles the number of photons arriving per second, so twice as many electrons are released each second. Each photon still has energy hf, so the maximum kinetic energy hf − Φ is unchanged — the key evidence for photons.', 2)

b = Bank('a-level', *existing_topic('23.3 Activity and half-life'), '23.2', '9702 23.2 Radioactive decay')
lam = log(2) / 1.2e4
b.num('An isotope has a half-life of 1.2 × 10⁴ s. Calculate its decay constant.',
      lam, 's⁻¹', f'λ = ln2 / t½ = 0.693 ÷ 1.2 × 10⁴ = {sf(lam)} s⁻¹.', 1)
b.num('A sample contains 4.0 × 10¹⁸ undecayed nuclei of an isotope with decay constant 2.0 × 10⁻⁶ s⁻¹. Calculate its activity.',
      4.0e18 * 2.0e-6, 'Bq', 'A = λN = 2.0 × 10⁻⁶ × 4.0 × 10¹⁸ = 8.0 × 10¹² Bq.', 1)
b.num('What fraction of the original nuclei in a sample remains undecayed after 3.5 half-lives? Give your answer as a decimal.',
      2**-3.5, None, f'N/N₀ = (½)^3.5 = {2**-3.5:.4f}. Equivalently e^(−λt) with λt = 3.5 ln2.', 2)
A = 800 * 2**(-15 / 6.0)
b.num('A sample has an activity of 800 Bq. Its half-life is 6.0 hours. Calculate its activity 15 hours later.',
      A, 'Bq', f'15 h is 15 ÷ 6.0 = 2.5 half-lives, so A = 800 × (½)^2.5 = 800 × {2**-2.5:.4f} = {sf(A)} Bq. (A = A₀e^(−λt) gives the same answer.)', 2)
b.num('The activity of a sample falls from 1200 Bq to 150 Bq. The half-life is 8.0 days. How many days does this take?',
      3 * 8.0, 'days', '1200 → 600 → 300 → 150 is three halvings, so the time is 3 × 8.0 = 24 days.', 1)

# ── Phase 3: IGCSE ───────────────────────────────────────────────────────

b = Bank('igcse', *existing_topic('2.4 Calculating speed and acceleration'), '1.2', '0625 1.2 Motion')
b.num('A runner completes one lap of a 400 m track in 50 s. Calculate her average speed.',
      400 / 50, 'm/s', 'Average speed = total distance ÷ total time = 400 ÷ 50 = 8.0 m/s.', 1)
b.num('A car speeds up from 5.0 m/s to 25 m/s in 4.0 s. Calculate its acceleration.',
      (25 - 5) / 4.0, 'm/s²', 'a = change in velocity ÷ time = (25 − 5.0) ÷ 4.0 = 5.0 m/s².', 1)
b.num('A train travels at a steady 30 m/s for 2.5 minutes. How far does it travel?',
      30 * 150, 'm', 'Convert the time to seconds first: 2.5 minutes = 150 s. Distance = speed × time = 30 × 150 = 4500 m.', 2)
b.num('A bus slows down steadily from 18 m/s to rest in 6.0 s. Calculate its deceleration.',
      18 / 6.0, 'm/s²', 'a = (0 − 18) ÷ 6.0 = −3.0 m/s². The negative sign means it is slowing down: a deceleration of 3.0 m/s².', 1)
b.num('An object accelerates steadily from rest to 12 m/s in 8.0 s. Using its speed–time graph, calculate how far it travels in this time.',
      0.5 * 8.0 * 12, 'm', 'Distance = area under the speed–time graph. The graph is a triangle: ½ × base × height = ½ × 8.0 × 12 = 48 m.', 2)

b = Bank('igcse', *existing_topic('1.2 Density'), '1.4', '0625 1.4 Density')
b.num('A metal block has a mass of 2.0 kg and a volume of 2.5 × 10⁻⁴ m³. Calculate its density.',
      2.0 / 2.5e-4, 'kg/m³', 'ρ = m/V = 2.0 ÷ 2.5 × 10⁻⁴ = 8000 kg/m³.', 1)
b.num('A stone of mass 66 g is lowered into a measuring cylinder, and the water level rises from 50 cm³ to 72 cm³. Calculate the density of the stone, in g/cm³.',
      66 / 22, 'g/cm³', 'The stone’s volume is the volume of water it displaces: 72 − 50 = 22 cm³. ρ = m/V = 66 ÷ 22 = 3.0 g/cm³.', 2)
b.num('Oil has a density of 920 kg/m³. Calculate the mass of 0.030 m³ of oil.',
      920 * 0.030, 'kg', 'm = ρV = 920 × 0.030 = 27.6 kg.', 1)
b.num('A block of aluminium measures 5.0 cm × 4.0 cm × 2.0 cm. The density of aluminium is 2.7 g/cm³. Calculate its mass, in kg.',
      5 * 4 * 2 * 2.7 / 1000, 'kg', 'Volume = 5.0 × 4.0 × 2.0 = 40 cm³. m = ρV = 2.7 × 40 = 108 g = 0.108 kg.', 2)
b.mcq('An object will float in water if its density is…',
      [('less than the density of water', True), ('greater than the density of water', False),
       ('equal to its mass', False), ('greater than 1 kg/m³', False)],
      'Objects less dense than the liquid float in it; denser objects sink. Water’s density is 1000 kg/m³ (1.0 g/cm³).', 1)

# ── Phase 4: IB ──────────────────────────────────────────────────────────

SIG = 'Take σ = 5.67 × 10⁻⁸ W m⁻² K⁻⁴.'
b = Bank('ib', *new_topic(('ib', 'B.2', 'The greenhouse effect')), 'B.2', 'IB B.2 Greenhouse effect')
I288 = SIGMA * 288**4
b.num(f'Calculate the power radiated per square metre by a black body at 288 K. {SIG}',
      I288, 'W/m²', f'Stefan–Boltzmann: P/A = σT⁴ = 5.67 × 10⁻⁸ × 288⁴ = {sf(I288)} W/m².', 1)
Iin = (1 - 0.30) * 1360 / 4
b.num('The solar constant is 1360 W/m² and the Earth’s albedo is 0.30. Averaged over the whole surface of the Earth, calculate the power absorbed per square metre.',
      Iin, 'W/m²', f'The Earth intercepts sunlight over a disc of area πR² but spreads it over a sphere of 4πR², so divide by 4; then 30% is reflected. (1 − 0.30) × 1360 ÷ 4 = {sf(Iin)} W/m².', 2)
T = (Iin / SIGMA)**0.25
b.num(f'Using an absorbed intensity of {sf(Iin)} W/m², calculate the equilibrium temperature of an Earth with no atmosphere (emissivity 1). {SIG}',
      T, 'K', f'In equilibrium the power emitted equals the power absorbed: σT⁴ = {sf(Iin)}, so T = ({sf(Iin)} ÷ 5.67 × 10⁻⁸)^¼ = {sf(T)} K — about −18 °C, far colder than the real average of 288 K. The difference is the greenhouse effect.', 3)
b.num(f'The Earth’s surface is at 288 K and, with its atmosphere, has an effective emissivity of 0.61. Calculate the power per square metre radiated into space. {SIG}',
      0.61 * I288, 'W/m²', f'P/A = eσT⁴ = 0.61 × 5.67 × 10⁻⁸ × 288⁴ = {sf(0.61 * I288)} W/m² — matching the power absorbed, so the temperature is steady.', 2)
b.mcq('Greenhouse gases such as carbon dioxide warm the Earth mainly because they…',
      [('absorb infrared radiation emitted by the Earth’s surface', True), ('absorb visible light arriving from the Sun', False),
       ('reflect sunlight back into space', False), ('increase the Earth’s albedo', False)],
      'The atmosphere is largely transparent to incoming visible light but greenhouse gas molecules absorb the longer-wavelength infrared the warm surface emits, and re-radiate some of it back down.', 1)

b = Bank('ib', *new_topic(('9702', '2.1', 'Equations of motion')), 'A.1', 'IB A.1 Kinematics')
b.num('A car travelling at 22 m/s brakes with a constant deceleration of 5.5 m/s². Calculate its braking distance.',
      22**2 / (2 * 5.5), 'm', 'v² = u² + 2as with v = 0: s = u²/2a = 22² ÷ (2 × 5.5) = 44 m.', 1)
v = sqrt(2 * g * 20)
b.num(f'A ball is dropped from rest from a height of 20 m. Ignoring air resistance, calculate its speed just before it hits the ground. {G_TEXT}',
      v, 'm/s', f'v² = u² + 2as = 0 + 2 × 9.81 × 20 = {sf(2 * g * 20)}, so v = {sf(v)} m/s.', 1)
t = 2 * 15 / g
b.num(f'A ball is thrown vertically upwards at 15 m/s. Ignoring air resistance, how long is it before it returns to the thrower’s hand? {G_TEXT}',
      t, 's', f'It takes 15 ÷ 9.81 = {sf(15 / g)} s to stop at the top, and the same time to fall back: total {sf(t)} s.', 2)
d = 25 * 0.80 + 25**2 / (2 * 6.0)
b.num('A driver travelling at 25 m/s sees a hazard. Her reaction time is 0.80 s, then the car decelerates at 6.0 m/s². Calculate the total stopping distance.',
      d, 'm', f'Thinking distance = 25 × 0.80 = 20 m at constant speed. Braking distance = u²/2a = 625 ÷ 12 = {sf(625 / 12)} m. Total = {sf(d)} m.', 3)
b.mcq('What does the gradient of a displacement–time graph represent?',
      [('Velocity', True), ('Acceleration', False), ('Distance travelled', False), ('Displacement', False)],
      'Gradient = change in displacement ÷ change in time = velocity. A curved displacement–time graph therefore means the velocity is changing.', 1)

# ════════════════════════════════════════════════════════════════════════
# Checks and output
# ════════════════════════════════════════════════════════════════════════
all_topics = {e[0]: dict(curricula=None) for e in EXISTING}
for tid, name, igcse, as_, al, ib, _ in EXISTING:
    cur = ['igcse']
    if as_:
        cur += ['as', 'a-level']
    elif al:
        cur += ['a-level']
    if ib:
        cur += ['ib']
    all_topics[tid] = dict(curricula=cur)
for t in new_topics:
    all_topics[t['id']] = dict(curricula=t['curricula'])

for qn in questions:
    assert qn['curriculum'] in all_topics[qn['topic']]['curricula'], (qn['text'], qn['curriculum'])

bank_sizes = {}
for qn in questions:
    bank_sizes[qn['curriculum']] = bank_sizes.get(qn['curriculum'], 0) + 1

out = []
out.append('-- Multi-curriculum content (2026-09-29). GENERATED by')
out.append('-- database/seeds/2026-09-29-multi-curriculum-content.py — edit that, not this.')
out.append('-- Run after 2026-09-29-multi-curriculum-schema.sql. Re-running refreshes lesson')
out.append('-- tags and leaves existing questions alone.')
out.append(f'-- New lessons: {len(new_topics)}. New questions: {len(questions)} '
           f'({", ".join(f"{k} {v}" for k, v in bank_sizes.items())}).')
out.append('BEGIN;')
out.append('')
out.append('-- Courses: one per syllabus. The IGCSE course already exists.')
out.append('INSERT INTO courses (id, title, description, code, version, status) VALUES')
out.append(f"  ({q(COURSE_9702)}, 'Cambridge International AS & A Level Physics 9702', "
           f"'AS Level (units 1–11) and A Level (units 12–25) Physics.', '9702', '2025-2027', 'published'),")
out.append(f"  ({q(COURSE_IB)}, 'IB Diploma Programme Physics', "
           f"'IB Physics SL and HL, first assessment 2025. Themes A–E.', 'IB', '2025', 'published')")
out.append('ON CONFLICT (id) DO NOTHING;')
out.append('')
out.append('-- Chapters: one per syllabus unit that has lessons of its own.')
out.append('INSERT INTO chapters (id, course_id, chapter_number, title, learning_objectives, status, "order") VALUES')
out.append(',\n'.join(
    f"  ({q(c['id'])}, {q(c['course'])}, {c['number']}, {q(c['title'])}, {q(c['objectives'])}, 'published', {c['number']})"
    for c in chapters))
out.append('ON CONFLICT (id) DO NOTHING;')
out.append('')
out.append('-- Existing lessons: curricula and syllabus codes.')
for tid, name, igcse, as_, al, ib, ref in EXISTING:
    cur = all_topics[tid]['curricula']
    al_code = al or as_
    out.append(
        f'UPDATE topics SET curriculum_ids = {arr(cur)}, topic_code = {opt(igcse)}, as_topic_code = {opt(as_)}, '
        f'a_level_topic_code = {opt(al_code)}, ib_topic_code = {opt(ib)}'
        + (f', syllabus_reference = {q(ref)}' if ref else '')
        + f' WHERE id = {q(tid)};  -- {name}')
out.append('')
out.append('-- New lessons.')
out.append('INSERT INTO topics (id, chapter_id, topic_name, "order", required_tier, curriculum_ids, topic_code, '
           'as_topic_code, a_level_topic_code, ib_topic_code, syllabus_reference) VALUES')
out.append(',\n'.join(
    f"  ({q(t['id'])}, {q(t['chapter'])}, {q(t['name'])}, {t['order']}, 0, {arr(t['curricula'])}, NULL, "
    f"{opt(t['as_'])}, {opt(t['al'])}, {opt(t['ib'])}, {q(t['ref'])})"
    for t in new_topics))
out.append('ON CONFLICT (id) DO UPDATE SET curriculum_ids = EXCLUDED.curriculum_ids, as_topic_code = EXCLUDED.as_topic_code,')
out.append('  a_level_topic_code = EXCLUDED.a_level_topic_code, ib_topic_code = EXCLUDED.ib_topic_code,')
out.append('  syllabus_reference = EXCLUDED.syllabus_reference;')
out.append('')
out.append('-- Question banks: AS, A Level, IGCSE, IB.')
for qn in questions:
    unit = qn['unit']
    out.append(
        'INSERT INTO problems (id, chapter_id, topic_id, curriculum_id, topic_code, syllabus_cite, problem_number, "order", '
        'question_text, difficulty_level, answer_type, answer_correct, answer_unit, answer_tolerance, answer_sign_sensitive, '
        'explanation, points) VALUES ('
        f"{q(qn['id'])}, {q(qn['chapter'])}, {q(qn['topic'])}, {q(qn['curriculum'])}, {q(qn['code'])}, {q(qn['cite'])}, "
        f"{qn['number']}, {qn['number']}, {q(qn['text'])}, {qn['difficulty']}, {q(qn['type'])}::answer_type, "
        f"{q(qn['answer'])}, {opt(unit)}, {qn['tolerance'] if qn['tolerance'] is not None else 'NULL'}, "
        f"{'true' if qn['sign'] else 'false'}, {q(qn['explanation'])}, {qn['difficulty']}) ON CONFLICT (id) DO NOTHING;")
    if qn['options']:
        for i, (text, ok) in enumerate(qn['options']):
            oid = uid(f"option/{qn['id']}/{i}")
            out.append(
                'INSERT INTO problem_options (id, problem_id, option_text, option_letter, is_correct, "order") VALUES ('
                f"{q(oid)}, {q(qn['id'])}, {q(text)}, {q('ABCD'[i])}, {'true' if ok else 'false'}, {i + 1}) ON CONFLICT (id) DO NOTHING;")
out.append('')
out.append('-- Every lesson must serve at least one curriculum and carry a code for each')
out.append('-- one it serves; every question must belong to a curriculum its lesson serves.')
out.append('''DO $$
DECLARE bad INT;
BEGIN
  SELECT COUNT(*) INTO bad FROM topics
  WHERE ('igcse' = ANY(curriculum_ids) AND topic_code IS NULL)
     OR ('as' = ANY(curriculum_ids) AND as_topic_code IS NULL)
     OR ('a-level' = ANY(curriculum_ids) AND a_level_topic_code IS NULL)
     OR ('ib' = ANY(curriculum_ids) AND ib_topic_code IS NULL);
  IF bad > 0 THEN RAISE EXCEPTION '% lesson(s) are missing a topic code for a curriculum they serve', bad; END IF;

  SELECT COUNT(*) INTO bad FROM problems p JOIN topics t ON t.id = p.topic_id
  WHERE NOT (p.curriculum_id = ANY(t.curriculum_ids));
  IF bad > 0 THEN RAISE EXCEPTION '% question(s) belong to a curriculum their lesson does not serve', bad; END IF;
END $$;''')
out.append('')
out.append('COMMIT;')

with open(sys.argv[1], 'w') as fh:
    fh.write('\n'.join(out) + '\n')

if '--json' in sys.argv:
    with open(sys.argv[sys.argv.index('--json') + 1], 'w') as fh:
        json.dump([{k: v for k, v in qn.items() if k != 'options'} | {'options': qn['options']} for qn in questions], fh,
                  ensure_ascii=False, indent=1)

print(f'{len(new_topics)} new lessons in {len(chapters)} new chapters, {len(questions)} questions: {bank_sizes}',
      file=sys.stderr)
