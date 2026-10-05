"""Usage: python3 database/seeds/2026-10-06-circular-gravitation-challenge.py database/seeds/2026-10-06-circular-gravitation-challenge.sql [--json out.json]

"Circular Motion & Gravitation: Challenge Set" (Cambridge IGCSE Physics 0625,
Chapters 16 and 17, Physics 10 — the owner's PDF with its teacher answer key).

Adds 10 questions to each of the two shared lessons:
  3.7  Circular motion        (A Level 12.2)  circular-motion bank   +10
  24.3 Gravitation and orbits (A Level 13.2)  gravitation bank       +10
Per lesson: the 5 challenge-set questions (Q1–Q5 / Q6–Q10, each asking for its
key quantity — the other parts are worked in the explanation), then 5 further
questions of rising difficulty (3, 3, 4, 4, 5).

Both curriculum banks of each shared lesson receive the same 10 questions, so
the banks grow like this (appended after the existing problem numbers):
  circular motion   IGCSE 35 -> 45,  A Level 45 -> 55
  gravitation       IGCSE  7 -> 17,  A Level 22 -> 32

Every answer is computed here from the question's own numbers and the numbers
in each explanation are formatted from the same computation. Constants are the
PDF's: G = 6.67e-11, g = 9.8 N/kg, Earth M = 5.97e24 kg, R = 6.37e6 m.
All ids are uuid5, so re-running is a no-op.
"""
import json
import sys
import uuid
from math import pi, sqrt, sin, cos, tan, radians

g = 9.8
G = 6.67e-11
M_E = 5.97e24
R_E = 6.37e6


def uid(name):
    return str(uuid.uuid5(uuid.NAMESPACE_URL, f'ashphys/{name}'))


SUP = str.maketrans('-0123456789', '⁻⁰¹²³⁴⁵⁶⁷⁸⁹')


def sf(x, n=3):
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
    e = int(f'{x:e}'.split('e')[1])
    trim = lambda s: s.rstrip('0').rstrip('.') if '.' in s else s
    if -3 <= e < 5:
        return trim(f'{x:.{max(n - 1 - e, 0)}f}')
    return f"{trim(f'{x / 10**e:.{n - 1}f}')}e{e}"


def round_sf(x, n):
    e = int(f'{abs(x):e}'.split('e')[1])
    return round(x, n - 1 - e)


def q(s):
    return "'" + s.replace("'", "''") + "'"


def opt(v):
    return 'NULL' if v is None else q(v)


# (topic id, chapter id, existing bank sizes by curriculum, A Level code + cite)
LESSONS = {
    'circ': dict(topic='db2c98d5-dd86-5faf-9121-5533bdd5d212', chapter='a86aff95-adbc-4634-af1f-528e375e2230',
                 start={'igcse': 35, 'a-level': 45}, code='12.2', cite='9702 12.2 Centripetal acceleration'),
    'grav': dict(topic='1585a36a-5b5c-5505-abe3-98e37e28c48b', chapter='ac5e5832-2f40-4487-ba6b-19b47d21baac',
                 start={'igcse': 7, 'a-level': 22}, code='13.2', cite='9702 13.2 Gravitational force between point masses'),
}

questions = []  # one dict per (question, curriculum)
counts = {}


def add_num(lesson, text, answer, unit, explanation, difficulty, figure=None):
    L = LESSONS[lesson]
    n = counts[lesson] = counts.get(lesson, 0) + 1
    tolerance = 0.05 if abs(round_sf(answer, 2) - answer) / abs(answer) > 0.018 else None
    for cur in ('igcse', 'a-level'):
        number = L['start'][cur] + n
        questions.append(dict(
            id=uid(f'problem/{cur}/challenge-set-2026-10-06/{L["topic"]}/{n}'), topic=L['topic'], chapter=L['chapter'],
            curriculum=cur, code=L['code'] if cur == 'a-level' else None,
            cite=L['cite'] if cur == 'a-level' else None, number=number, text=text, answer=stored(answer),
            unit=unit, explanation=explanation, difficulty=difficulty, figure=figure, tolerance=tolerance,
            lesson=lesson, seq=n, value=answer))


CONST_C = 'Take g = 9.8 N/kg.'
CONST_G = 'Use G = 6.67 × 10⁻¹¹ N m² kg⁻²'
EARTH = 'Earth’s mass = 5.97 × 10²⁴ kg and Earth’s radius = 6.37 × 10⁶ m'

# ════════════════════════════════════════════════════════════════════════
# Circular motion — challenge set Q1–Q5
# ════════════════════════════════════════════════════════════════════════
T1 = 2.0 / 3.0
v1 = 2 * pi * 0.80 / T1
F1 = 0.50 * v1**2 / 0.80
add_num('circ',
        'A 0.50 kg ball on a 0.80 m string moves in a horizontal circle on a frictionless table. It completes 3.0 revolutions in 2.0 s. Calculate the tension in the string.',
        F1, 'N',
        f'Period: T = 2.0 s ÷ 3.0 rev = {sf(T1)} s. (a) Speed: v = 2πr/T = 2π × 0.80 ÷ {sf(T1)} = {sf(v1)} m/s. (b) The tension is the only horizontal force, so it provides the centripetal force: T = mv²/r = 0.50 × {sf(v1)}² ÷ 0.80 = {sf(F1)} N. Check: ω = 2π × 1.5 = {sf(2 * pi * 1.5)} rad/s and mω²r gives the same.',
        2, 'diagram:circ-ch-ball-table')

F2 = 0.60 * 7200
v2d = sqrt(7200 * 50 / 1200)
v2 = sqrt(F2 * 50 / 1200)
add_num('circ',
        'A 1200 kg car takes a flat circular bend of radius 50 m. On a dry road the tyres can provide a maximum friction force of 7200 N. On a wet road this maximum falls by 40%. Calculate the maximum safe speed on the wet road.',
        v2, 'm/s',
        f'Friction provides the centripetal force, F = mv²/r, so v = √(Fr/m). (a) Dry: v = √(7200 × 50 ÷ 1200) = √300 = {sf(v2d)} m/s. (b) Wet: the friction is 0.60 × 7200 = {sf(F2, 4)} N, so v = √({sf(F2, 4)} × 50 ÷ 1200) = √180 = {sf(v2)} m/s. The speed falls by a factor of √0.6 ≈ 0.77, not 0.6, because v ∝ √F.',
        2, 'diagram:circ-ch-car-bend')

w3 = 45 * 2 * pi / 60
a3 = w3**2 * 0.20
add_num('circ',
        'Two coins sit on a turntable rotating at 45 revolutions per minute. Coin A is 0.10 m from the centre and coin B is 0.20 m from the centre. Calculate the centripetal acceleration of coin B.',
        a3, 'm/s²',
        f'Both coins turn together, so they share the same angular speed: ω = 45 × 2π ÷ 60 = {sf(w3)} rad/s. (a) v = ωr, so v ∝ r and v_B/v_A = 0.20/0.10 = 2. (b) a = ω²r = {sf(w3)}² × 0.20 = {sf(a3)} m/s².',
        2, 'diagram:circ-ch-turntable')

v4 = 6.0
Fc4 = 0.50 * v4**2 / 1.2
Ttop4 = Fc4 - 0.50 * g
Tbot4 = Fc4 + 0.50 * g
vmin4 = sqrt(g * 1.2)
add_num('circ',
        f'A 0.50 kg ball is swung in a vertical circle of radius 1.2 m. Assume its speed is 6.0 m/s at both the top and the bottom. Calculate the tension in the string at the top of the circle. {CONST_C}',
        Ttop4, 'N',
        f'The centripetal force needed is mv²/r = 0.50 × 36 ÷ 1.2 = {sf(Fc4)} N, and the weight is mg = 0.50 × 9.8 = {sf(0.5 * g)} N. (a) At the top the tension and the weight both point towards the centre: T + mg = {sf(Fc4)}, so T = {sf(Fc4)} − {sf(0.5 * g)} = {sf(Ttop4)} N. (b) At the bottom the tension points to the centre but the weight points away: T − mg = {sf(Fc4)}, so T = {sf(Tbot4)} N. (c) The string just stays taut when T = 0 at the top: mg = mv²/r, so v = √(gr) = √(9.8 × 1.2) = {sf(vmin4)} m/s.',
        3, 'diagram:circ-ch-vertical')

th5 = radians(30)
T5 = 2 * pi * sqrt(1.0 * cos(th5) / g)
Ten5 = 0.20 * g / cos(th5)
r5 = 1.0 * sin(th5)
v5 = sqrt(Ten5 * sin(th5) * r5 / 0.20)
add_num('circ',
        f'A 0.20 kg bob hangs on a 1.0 m string. It moves in a horizontal circle with the string making 30° with the vertical. Calculate the time for one revolution. {CONST_C}',
        T5, 's',
        f'Vertical: T cos30° = mg (no vertical acceleration). Horizontal: T sin30° = mv²/r. (a) Tension: T = mg/cos30° = 0.20 × 9.8 ÷ {sf(cos(th5))} = {sf(Ten5)} N. (b) The radius is r = L sin30° = 1.0 × 0.50 = {sf(r5)} m — not the string length. (c) Centripetal force = T sin30° = {sf(Ten5 * sin(th5))} N, so v² = Fr/m = {sf(Ten5 * sin(th5))} × {sf(r5)} ÷ 0.20 and v = {sf(v5)} m/s. (d) Period = 2πr/v = 2π × {sf(r5)} ÷ {sf(v5)} = {sf(T5)} s.',
        4, 'diagram:circ-ch-conical')

# ── Circular motion — extension questions (difficulty 3, 3, 4, 4, 5) ─────
m, r, Tmax = 0.30, 0.60, 40.0
vb = sqrt(Tmax * r / m)
add_num('circ',
        f'A 0.30 kg mass is whirled on the end of a 0.60 m string in a horizontal circle on a frictionless table. The string breaks if the tension exceeds 40 N. Calculate the maximum speed the mass can have without the string breaking.',
        vb, 'm/s',
        f'The tension provides the centripetal force, T = mv²/r, so v = √(Tr/m) = √(40 × 0.60 ÷ 0.30) = √80 = {sf(vb)} m/s. Any faster and the tension needed is more than 40 N.',
        3)

mu, rc = 0.85, 40.0
vmu = sqrt(mu * g * rc)
add_num('circ',
        f'The maximum friction force between a car’s tyres and a dry flat road is 0.85 times the car’s weight. Calculate the maximum speed at which the car can take a flat bend of radius 40 m. {CONST_C}',
        vmu, 'm/s',
        f'Maximum friction = 0.85 mg provides the centripetal force: 0.85 mg = mv²/r. The mass cancels, so v = √(0.85 × g × r) = √(0.85 × 9.8 × 40) = √{sf(mu * g * rc)} = {sf(vmu)} m/s, about {sf(vmu * 3.6, 3)} km/h — the same for a small car and a heavy lorry.',
        3, 'diagram:circ-ch-flat-bend-mu')

th, L = radians(40), 0.75
rr = L * sin(th)
vc = sqrt(rr * g * tan(th))
add_num('circ',
        f'A conical pendulum has a bob on a 0.75 m string. The string makes an angle of 40° with the vertical as the bob moves in a horizontal circle. Calculate the speed of the bob. {CONST_C}',
        vc, 'm/s',
        f'The radius is r = L sin40° = 0.75 × {sf(sin(th))} = {sf(rr)} m. Vertically T cosθ = mg and horizontally T sinθ = mv²/r. Dividing: tanθ = v²/(rg), so v = √(r g tanθ) = √({sf(rr)} × 9.8 × {sf(tan(th))}) = {sf(vc)} m/s. The mass cancels, so the bob’s mass is not needed.',
        4)

rl = 0.90
vbot = sqrt(5 * g * rl)
add_num('circ',
        f'A ball is swung on a string in a vertical circle of radius 0.90 m. Calculate the minimum speed it must have at the bottom of the circle for the string to stay taut all the way round. (Its speed changes as it rises: use conservation of energy.) {CONST_C}',
        vbot, 'm/s',
        f'At the top the string only just stays taut when T = 0, so mg = mv_top²/r and v_top² = gr = 9.8 × 0.90 = {sf(g * rl)} m²/s². Rising a height 2r, the ball’s kinetic energy falls by mg(2r): ½mv_bottom² = ½mv_top² + mg(2r), so v_bottom² = v_top² + 4gr = 5gr. Then v_bottom = √(5 × 9.8 × 0.90) = √{sf(5 * g * rl)} = {sf(vbot)} m/s.',
        4, 'diagram:circ-ch-vertical-energy')

mb, rb, vbb = 0.25, 0.90, 7.0
vt2 = vbb**2 - 4 * g * rb
Ttop = mb * vt2 / rb - mb * g
add_num('circ',
        f'A 0.25 kg ball is swung on a string in a vertical circle of radius 0.90 m. Its speed at the bottom of the circle is 7.0 m/s. Calculate the tension in the string at the top of the circle. {CONST_C}',
        Ttop, 'N',
        f'Energy is conserved between bottom and top, which are 2r = 1.8 m apart: v_top² = v_bottom² − 4gr = 49 − 4 × 9.8 × 0.90 = {sf(vt2)} m²/s². At the top, tension and weight both point to the centre: T + mg = mv_top²/r, so T = 0.25 × {sf(vt2)} ÷ 0.90 − 0.25 × 9.8 = {sf(mb * vt2 / rb)} − {sf(mb * g)} = {sf(Ttop)} N. (Check the ball gets there: v_top² must be at least gr = {sf(g * rb)}, and it is.)',
        5, 'diagram:circ-ch-vertical-energy')

# ════════════════════════════════════════════════════════════════════════
# Gravitation — challenge set Q6–Q10
# ════════════════════════════════════════════════════════════════════════
GMx = G * 4.0e24
gs6 = GMx / (5.0e6) ** 2
gh6 = GMx / (1.0e7) ** 2
Wh6 = 70 * gh6
add_num('grav',
        f'Planet X has mass 4.0 × 10²⁴ kg and radius 5.0 × 10⁶ m. Calculate the weight of a 70 kg astronaut at a height of 5.0 × 10⁶ m above the surface of Planet X. {CONST_G}.',
        Wh6, 'N',
        f'GM = 6.67 × 10⁻¹¹ × 4.0 × 10²⁴ = {sf(GMx)}. (a) At the surface g = GM/r² = {sf(GMx)} ÷ (5.0 × 10⁶)² = {sf(gs6)} N/kg. (b) At 5.0 × 10⁶ m above the surface the distance from the centre is r = 1.0 × 10⁷ m, so g = {sf(GMx)} ÷ (1.0 × 10⁷)² = {sf(gh6)} N/kg — doubling r divides g by 4. (c) W = mg: at the surface 70 × {sf(gs6)} = {sf(70 * gs6)} N; at this height 70 × {sf(gh6)} = {sf(Wh6)} N.',
        2, 'diagram:grav-ch-planet')

GM7 = G * M_E
r7 = R_E + 6.0e5
v7 = sqrt(GM7 / r7)
T7 = 2 * pi * r7 / v7
add_num('grav',
        f'A satellite orbits Earth in a circle at an altitude of 600 km. Calculate its orbital period, in minutes. {CONST_G}; {EARTH}.',
        T7 / 60, 'min',
        f'GM = {sf(GM7)}. The orbital radius is measured from the centre: r = 6.37 × 10⁶ + 6.0 × 10⁵ = {sf(r7)} m. Gravity provides the centripetal force: GMm/r² = mv²/r, so (a) v = √(GM/r) = √({sf(GM7)} ÷ {sf(r7)}) = {sf(v7)} m/s. (b) T = 2πr/v = 2π × {sf(r7)} ÷ {sf(v7, 4)} = {sf(T7, 4)} s = {sf(T7 / 60)} minutes.',
        3, 'diagram:grav-ch-leo')

T8 = 86400.0
r8 = (GM7 * T8**2 / (4 * pi**2)) ** (1 / 3)
alt8 = r8 - R_E
v8 = 2 * pi * r8 / T8
add_num('grav',
        f'A geostationary satellite has a period of 24 h. Calculate its altitude above Earth’s surface, in metres. {CONST_G}; {EARTH}.',
        alt8, 'm',
        f'T = 24 h = 86 400 s. Equate the gravitational force to the centripetal force: GM/r² = ω²r = 4π²r/T², so r³ = GMT²/4π². (a) r³ = {sf(GM7)} × 86 400² ÷ (4π²) = {sf(r8**3)} m³, so r = {sf(r8)} m. (b) Altitude = r − R = {sf(r8)} − 6.37 × 10⁶ = {sf(alt8)} m (about 36 000 km). (c) v = 2πr/T = 2π × {sf(r8)} ÷ 86 400 = {sf(v8)} m/s.',
        3, 'diagram:grav-ch-geo')

add_num('grav',
        'Satellites A and B orbit the same planet. B’s orbital radius is 4 times A’s. If A’s orbital period is 2.0 h, calculate B’s orbital period, in hours.',
        2.0 * 4 ** 1.5, 'h',
        'For circular orbits T² ∝ r³, so T ∝ r^(3/2). (a) v = √(GM/r), so v ∝ 1/√r and v_B/v_A = 1/√4 = 1/2. (b) T_B/T_A = 4^(3/2) = 8. (c) T_B = 8 × 2.0 = 16 h. (d) F = GMm/r², so for equal masses F_B/F_A = 1/4² = 1/16 = 0.0625.',
        3, 'diagram:grav-ch-two-orbits')

d10 = 3.84e8
x10 = 0.9 * d10
add_num('grav',
        'The Earth–Moon distance is 3.84 × 10⁸ m, and Earth’s mass is 81 times the Moon’s. At what distance from Earth does a spacecraft on the line between them feel zero net gravitational force? Give your answer in metres.',
        x10, 'm',
        f'Let the craft be x from Earth, so (d − x) from the Moon. Set GM_E m/x² = GM_M m/(d − x)². With M_E = 81 M_M: 81/x² = 1/(d − x)². Take the square root: 9/x = 1/(d − x), so 9(d − x) = x and x = 0.9d = 0.9 × 3.84 × 10⁸ = {sf(x10)} m from Earth ({sf(d10 - x10)} m from the Moon).',
        4, 'diagram:grav-ch-balance')

# ── Gravitation — extension questions (difficulty 3, 3, 4, 4, 5) ─────────
g0 = 4.9
rx = sqrt(GM7 / g0)
hx = rx - R_E
add_num('grav',
        f'At what height above Earth’s surface is the gravitational field strength 4.9 N/kg? Give your answer in metres. {CONST_G}; {EARTH}.',
        hx, 'm',
        f'g = GM/r², so r = √(GM/g) = √({sf(GM7)} ÷ 4.9) = {sf(rx)} m from the centre of the Earth. The height is the distance from the surface: h = r − R = {sf(rx)} − 6.37 × 10⁶ = {sf(hx)} m. (Half the surface value of g is reached about 0.41 R above the surface, not at R/2.)',
        3)

rm = 3.84e8
vm = sqrt(GM7 / rm)
Tm = 2 * pi * rm / vm / 86400
add_num('grav',
        f'The Moon orbits Earth in an almost circular orbit of radius 3.84 × 10⁸ m. Calculate the Moon’s orbital period, in days. {CONST_G}; Earth’s mass = 5.97 × 10²⁴ kg.',
        Tm, 'days',
        f'Gravity provides the centripetal force, so v = √(GM/r) = √({sf(GM7)} ÷ 3.84 × 10⁸) = {sf(vm)} m/s. T = 2πr/v = 2π × 3.84 × 10⁸ ÷ {sf(vm)} = {sf(Tm * 86400)} s = {sf(Tm)} days, which matches the real sidereal month (27.3 days).',
        3, 'diagram:grav-ch-moon-period')

rj, Tj = 4.22e8, 1.77 * 86400
Mj = 4 * pi**2 * rj**3 / (G * Tj**2)
add_num('grav',
        f'A moon orbits a planet in a circle of radius 4.22 × 10⁸ m with a period of 1.77 days. Calculate the mass of the planet. {CONST_G}.',
        Mj, 'kg',
        f'T = 1.77 × 86 400 = {sf(Tj, 4)} s. From GMm/r² = mω²r = 4π²mr/T², the moon’s mass cancels and M = 4π²r³/(GT²) = 4π² × (4.22 × 10⁸)³ ÷ (6.67 × 10⁻¹¹ × ({sf(Tj, 4)})²) = {sf(Mj)} kg — about 300 Earth masses (this is Jupiter and its moon Io).',
        4)

Ts, hs = 90 * 60.0, None
rs = (GM7 * Ts**2 / (4 * pi**2)) ** (1 / 3)
hs = rs - R_E
add_num('grav',
        f'A satellite orbits Earth once every 90 minutes in a circular orbit. Calculate its altitude above Earth’s surface, in metres. {CONST_G}; {EARTH}.',
        hs, 'm',
        f'T = 90 × 60 = {sf(Ts)} s. From GM/r² = 4π²r/T², r³ = GMT²/4π² = {sf(GM7)} × {sf(Ts)}² ÷ 4π² = {sf(rs**3)} m³, so r = {sf(rs)} m. The altitude is r − R = {sf(rs)} − 6.37 × 10⁶ = {sf(hs)} m, about {sf(hs / 1000, 2)} km. (Forgetting to subtract Earth’s radius would give the wrong answer by a factor of about 24.)',
        4, 'diagram:grav-ch-leo-h')

rho = 5500.0
Tr = sqrt(3 * pi / (G * rho))
add_num('grav',
        f'A satellite orbits just above the surface of a planet of uniform density 5500 kg/m³, so its orbital radius is the planet’s radius R. Show that the period does not depend on the size of the planet, and calculate it, in seconds. {CONST_G}.',
        Tr, 's',
        f'Mass of the planet: M = ρ × (4/3)πR³. Gravity provides the centripetal force: GM/R² = 4π²R/T², so T² = 4π²R³/(GM) = 4π²R³ ÷ (G × (4/3)πR³ρ) = 3π/(Gρ). R cancels, so only the density matters: T = √(3π/(Gρ)) = √(3π ÷ (6.67 × 10⁻¹¹ × 5500)) = √({sf(3 * pi / (G * rho))}) = {sf(Tr)} s (about {sf(Tr / 60, 2)} min). Every rocky planet of this density has a surface-skimming orbit of about {sf(Tr / 60, 2)} minutes.',
        5)

# ════════════════════════════════════════════════════════════════════════
# SQL
# ════════════════════════════════════════════════════════════════════════
assert counts == {'circ': 10, 'grav': 10}, counts
out = [
    '-- Circular Motion & Gravitation: Challenge Set (IGCSE 0625 chapters 16-17).',
    '-- GENERATED by 2026-10-06-circular-gravitation-challenge.py: edit that, never this file.',
    '-- 10 questions into each of the two shared lessons, in BOTH curriculum banks:',
    '--   3.7 Circular motion: IGCSE 35 -> 45, A Level 45 -> 55',
    '--   24.3 Gravitation and orbits: IGCSE 7 -> 17, A Level 22 -> 32',
    '-- Idempotent: uuid5 ids, ON CONFLICT DO NOTHING.',
    'BEGIN;',
    '',
    '''DO $$
DECLARE missing INT;
BEGIN
  SELECT 2 - COUNT(*) INTO missing FROM topics
  WHERE id IN (''' + ', '.join(q(L['topic']) for L in LESSONS.values()) + ''')
    AND 'igcse' = ANY(curriculum_ids) AND 'a-level' = ANY(curriculum_ids);
  IF missing > 0 THEN RAISE EXCEPTION '% lesson(s) are missing or do not serve both IGCSE and A Level', missing; END IF;
END $$;''',
    '',
]
for qn in questions:
    out.append(
        'INSERT INTO problems (id, chapter_id, topic_id, curriculum_id, topic_code, syllabus_cite, problem_number, "order", '
        'question_text, question_image_url, difficulty_level, answer_type, answer_correct, answer_unit, answer_tolerance, '
        'answer_sign_sensitive, explanation, points) VALUES ('
        f"{q(qn['id'])}, {q(qn['chapter'])}, {q(qn['topic'])}, {q(qn['curriculum'])}, {opt(qn['code'])}, {opt(qn['cite'])}, "
        f"{qn['number']}, {qn['number']}, {q(qn['text'])}, {opt(qn['figure'])}, {qn['difficulty']}, 'numeric'::answer_type, "
        f"{q(qn['answer'])}, {opt(qn['unit'])}, {qn['tolerance'] if qn['tolerance'] is not None else 'NULL'}, "
        f"false, {q(qn['explanation'])}, {min(qn['difficulty'], 3)}) ON CONFLICT (id) DO NOTHING;")
out.append('')
out.append('COMMIT;')

with open(sys.argv[1], 'w') as fh:
    fh.write('\n'.join(out) + '\n')

if '--json' in sys.argv:
    with open(sys.argv[sys.argv.index('--json') + 1], 'w') as fh:
        json.dump(questions, fh, ensure_ascii=False, indent=1)

print(f'{len(questions)} rows ({len(questions) // 2} questions x 2 curricula)', file=sys.stderr)
