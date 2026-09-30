"""Usage: python3 database/seeds/2026-09-30-a-level-circular-gravitation.py database/seeds/2026-09-30-a-level-circular-gravitation.sql [--json out.json]

A Level (Cambridge 9702) practice banks for units 12 and 13, built from the
owner's worksheets: the "Circular Motion and Gravitation Notes" (sections 1–5,
with their worked examples and fill-in questions) and the exam-style question
sheet (spaceship, theme-park car, geostationary TV satellite, ball on a cord,
conical pendulum, observation wheel, Discovery/Hubble, Phobos, skaters, hammer
throw, baggage belt, merry-go-round, whistle, Earth–Moon, ISS, orbit change).

Each question goes to the A Level lesson its syllabus section belongs to:
  12.1 Radians and angular speed              (9702 12.1)
  12.2 Circular motion (shared with IGCSE 3.7) (9702 12.2)
  13.1 Gravitational fields and field lines    (9702 13.1)
  13.2 Gravitation and orbits (shared, 24.3)   (9702 13.2)
  13.3 Field strength of a point mass          (9702 13.3)
  13.4 Gravitational potential                 (9702 13.4)
All rows are curriculum_id 'a-level', so they form each lesson's A Level bank
and never appear in the IGCSE bank of the shared lessons.

Every answer is computed here from the question's own numbers, and the
explanation's figures are formatted from the same computation, so the text
and the stored answer cannot disagree. Written-answer parts ("explain",
"draw an arrow") become multiple choice with the misconceptions as the wrong
options. The figures are original SVG, keyed "diagram:circ-…"/"diagram:grav-…"
in components/practice/CircularGravityDiagrams.tsx.

Deviations from the source keys, on purpose:
  * g = 9.81 m/s² throughout (the notes use 9.8), as in the rest of the A Level bank.
  * The 1450 kg satellite's key gives ΔEp = +5.72 × 10⁹ J; moving to a LOWER
    orbit the change is −5.72 × 10⁹ J, which is what is stored (sign-sensitive).
  * Ana's mass (55 kg) comes from the start of the original exam question
    ("Jon (mass 75 kg) … Ana (mass 55 kg)"); the sheet's excerpt omitted it.
  * "Show that" parts ask for the value instead, so the answer isn't given away.

All ids are uuid5, so re-running is a no-op.
"""
import json
import sys
import uuid
from math import pi, sqrt, sin, cos, tan, asin, acos, atan, degrees, radians

g = 9.81
G = 6.67e-11
M_E98 = 5.98e24  # the notes (and the Discovery question) use 5.98 × 10²⁴ kg
M_E97 = 5.97e24  # the exam-style sheet mostly uses 5.97 × 10²⁴ kg
R_E = 6.38e6


def uid(name):
    return str(uuid.uuid5(uuid.NAMESPACE_URL, f'ashphys/{name}'))


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


def sci(x, n=3):
    """Always standard form: 3.25 × 10⁴."""
    if x < 0:
        return '−' + sci(-x, n)
    e = int(f'{x:e}'.split('e')[1])
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


def round_sf(x, n):
    if x == 0:
        return 0.0
    e = int(f'{abs(x):e}'.split('e')[1])
    return round(x, n - 1 - e)


def q(s):
    return "'" + s.replace("'", "''") + "'"


def opt(v):
    return 'NULL' if v is None else q(v)


# ════════════════════════════════════════════════════════════════════════
# Lessons (all already exist; see the 2026-09-29 multi-curriculum seed)
# ════════════════════════════════════════════════════════════════════════
LESSONS = {
    '12.1': ('0245e29c-acd6-5c5f-b1b3-bf9431a0fa6b', '68a0e773-5e33-5982-9251-befc479a5b0e',
             '9702 12.1 Kinematics of uniform circular motion'),
    '12.2': ('db2c98d5-dd86-5faf-9121-5533bdd5d212', 'a86aff95-adbc-4634-af1f-528e375e2230',
             '9702 12.2 Centripetal acceleration'),
    '13.1': ('748a497a-deae-518a-a929-236d0930052b', 'ecdccf4c-21ed-53ba-9d9d-c67e8c623cc6',
             '9702 13.1 Gravitational field'),
    '13.2': ('1585a36a-5b5c-5505-abe3-98e37e28c48b', 'ac5e5832-2f40-4487-ba6b-19b47d21baac',
             '9702 13.2 Gravitational force between point masses'),
    '13.3': ('f779851e-a0d7-547b-b5a0-d558fa4769be', 'ecdccf4c-21ed-53ba-9d9d-c67e8c623cc6',
             '9702 13.3 Gravitational field of a point mass'),
    '13.4': ('d22251cb-cf0a-5cdb-a0a6-bea9552467ec', 'ecdccf4c-21ed-53ba-9d9d-c67e8c623cc6',
             '9702 13.4 Gravitational potential'),
}

questions = []
bank_counter = {}


class Bank:
    """The A Level questions for one lesson."""

    def __init__(self, code):
        self.code = code
        self.topic, self.chapter, self.cite = LESSONS[code]

    def _add(self, **kw):
        bank_counter[self.code] = bank_counter.get(self.code, 0) + 1
        n = bank_counter[self.code]
        questions.append(dict(
            id=uid(f'problem/a-level/worksheet-2026-09-30/{self.topic}/{n}'), topic=self.topic, chapter=self.chapter,
            curriculum='a-level', code=self.code, cite=self.cite, number=n, **kw))

    def num(self, text, answer, unit, explanation, difficulty, figure=None, sign=False):
        # A 2-significant-figure answer is the natural one for much of this data;
        # where rounding to 2 s.f. moves it more than the default 2%, allow 5%.
        tolerance = 0.05 if abs(round_sf(answer, 2) - answer) / abs(answer) > 0.018 else None
        self._add(text=text, answer=stored(answer), value=answer, unit=unit, explanation=explanation,
                  difficulty=difficulty, figure=figure, tolerance=tolerance, sign=sign, type='numeric', options=None)

    def mcq(self, text, correct, wrong, explanation, difficulty, figure=None, keep_order=False):
        """`correct` is the right option; `wrong` the distractors. The practice
        page shows options in stored order, so the right one is placed at a
        position derived from the question text rather than always first."""
        assert len(wrong) == 3
        if keep_order:
            options = [(o, o == correct) for o in wrong_and(correct, wrong)]
        else:
            slot = sum(map(ord, text)) % 4
            options = [(o, False) for o in wrong]
            options.insert(slot, (correct, True))
        assert sum(ok for _, ok in options) == 1
        self._add(text=text, answer=correct, value=None, unit=None, explanation=explanation, difficulty=difficulty,
                  figure=figure, tolerance=None, sign=False, type='multiple_choice', options=options)


def wrong_and(correct, wrong):
    return sorted([correct, *wrong])


def fig(key):
    return f'diagram:{key}'


G_TEXT = 'Take g = 9.81 m/s².'
GRAV = 'Use G = 6.67 × 10⁻¹¹ N m² kg⁻²'
E98 = 'take the mass of the Earth as 5.98 × 10²⁴ kg'
E97 = 'take the mass of the Earth as 5.97 × 10²⁴ kg'
E98R = 'take the Earth’s mass as 5.98 × 10²⁴ kg and its radius as 6.38 × 10⁶ m'
E97R = 'take the Earth’s mass as 5.97 × 10²⁴ kg and its radius as 6.38 × 10⁶ m'


# ════════════════════════════════════════════════════════════════════════
# 12.1 Kinematics of uniform circular motion
# ════════════════════════════════════════════════════════════════════════
b = Bank('12.1')

b.mcq('A mass on a string is whirled round a horizontal circle at a constant speed. In which direction is the mass moving at any instant?',
      'Along the tangent to the circle',
      ['Towards the centre of the circle', 'Directly away from the centre of the circle', 'Along the string'],
      'At every instant the velocity is along the tangent — at right angles to the radius (the string). That is why the mass flies off along a tangent if the string breaks. It is the ACCELERATION, not the velocity, that points towards the centre.',
      1, fig('circ-mass-on-string'))

b.mcq('An object moves round a circle of radius r at a constant speed, taking a time T (the period) for each revolution. Which expression gives its speed?',
      '2πr/T', ['πr²/T', '2πT/r', 'rT/2π'],
      'In one period the object travels once round the circumference, 2πr. Speed = distance ÷ time = 2πr/T. In A Level terms this is v = rω, where the angular speed is ω = 2π/T.',
      1)

T = 2.10 * 60
w = 2 * pi / T
v = 3622 * w
b.num('An aircraft flies round a complete horizontal circle of radius 3622 m in 2.10 minutes, at a constant speed. Calculate its speed.',
      v, 'm/s',
      f'Convert the time first: 2.10 min × 60 = {T:.0f} s. The angular speed is ω = 2π/T = 2π ÷ {T:.0f} = {sf(w)} rad/s, so v = rω = 3622 × {sf(w)} = {sf(v)} m/s. (Or directly: v = 2πr/T = 2π × 3622 ÷ {T:.0f}.)',
      2, fig('circ-aircraft-loop'))

w = 2 * pi / 1.40
v = 0.500 * w
b.num('A referee swings her 40.0 g whistle round a horizontal circle of radius 0.500 m above her head at a constant speed, taking 1.40 s for each rotation. Calculate the speed of the whistle.',
      v, 'm/s',
      f'ω = 2π/T = 2π ÷ 1.40 = {sf(w)} rad/s, and v = rω = 0.500 × {sf(w)} = {sf(v)} m/s. (Equivalently v = 2πr/T.) The whistle’s mass does not affect its speed.',
      1, fig('circ-whistle-plan'))

b.mcq('Jason stands near the edge of a merry-go-round that turns clockwise at a constant speed, as shown. What is the direction of his velocity at the instant shown?',
      'Along the tangent to his circular path, in the direction the merry-go-round is turning',
      ['Towards the centre of the merry-go-round', 'Directly away from the centre of the merry-go-round',
       'Along the tangent to his path, against the direction the merry-go-round is turning'],
      'Velocity is always along the tangent to the path, pointing the way the object is going. The merry-go-round turns clockwise, so Jason’s velocity is along the tangent in the clockwise sense — at right angles to the radius from the centre to him.',
      1, fig('circ-merry-go-round'))

b.mcq('A suitcase rides on a horizontal circular conveyor belt of radius 7.0 m that turns clockwise at a constant speed. At the instant shown the suitcase is at the right-hand side of the circle. In which direction is it moving?',
      'Along the tangent, towards the bottom of the diagram',
      ['Along the tangent, towards the top of the diagram', 'Towards the centre of the belt', 'Away from the centre of the belt'],
      'The velocity is along the tangent, at right angles to the radius. At the right-hand side of the circle, a clockwise belt is carrying the suitcase straight down the page at that instant.',
      1, fig('circ-baggage-belt'))

b.mcq('The suitcase on the circular belt moves at a constant speed. Why is its motion described as accelerated?',
      'Its velocity keeps changing direction, and a change in velocity is an acceleration',
      ['It is not accelerated — its speed does not change', 'The belt keeps speeding up and slowing down',
       'Its acceleration points along its direction of motion'],
      'Acceleration is the rate of change of VELOCITY, and velocity is a vector. The speed stays the same but the direction changes continuously, so the velocity changes and the suitcase accelerates — towards the centre of the circle.',
      1, fig('circ-baggage-belt'))

b.mcq('Janet swings a ball on a string round a horizontal circle above her head at a constant speed. Which statement explains why the ball is accelerating?',
      'The direction of its velocity changes all the time, so its velocity changes',
      ['Its speed increases every time it goes round', 'The string pulls it outwards, away from Janet’s hand',
       'It is not accelerating, because its speed is constant'],
      'Velocity is speed in a particular direction. Going round the circle the ball’s direction changes continuously, so its velocity changes even though its speed doesn’t — and a changing velocity is an acceleration (towards the centre, a = v²/r).',
      2, fig('circ-ball-overhead'))

b.mcq('Jon spins Ana round a horizontal circle on the ice, holding her by the arm. While she is still moving in the circle he lets go. Ignoring friction from the ice, how does Ana move immediately afterwards?',
      'In a straight line along the tangent to the circle, at the speed she had when he let go',
      ['Straight outwards, directly away from Jon', 'She keeps going round the same circle, gradually slowing down',
       'Along a curved path that spirals outwards'],
      'Once Jon lets go there is no horizontal force on Ana (the ice is frictionless), so by Newton’s first law her velocity stays constant: same speed, same direction. At the moment of release that direction was along the tangent, so she glides off in a straight line along the tangent at her circling speed.',
      2, fig('circ-skaters'))


# ════════════════════════════════════════════════════════════════════════
# 12.2 Centripetal acceleration (the shared "Circular motion" lesson)
# ════════════════════════════════════════════════════════════════════════
b = Bank('12.2')

b.mcq('An object moves round a circle at a constant speed. In which direction does its acceleration point?',
      'Towards the centre of the circle',
      ['Along the tangent, in the direction of motion', 'Directly away from the centre of the circle',
       'Nowhere — it has no acceleration, because its speed is constant'],
      'The change in velocity, Δv, between two nearby points on the circle always points towards the centre, so the acceleration does too. That is why it is called centripetal (“centre-seeking”) acceleration, of size a = v²/r = rω².',
      1, fig('circ-mass-on-string'))

b.mcq('Which force provides the centripetal force in each case? (1) A mass whirled round in a circle on the end of a string. (2) A car rounding a corner on a flat road. (3) The Moon orbiting the Earth.',
      '(1) tension, (2) friction, (3) gravity',
      ['(1) tension, (2) the engine’s driving force, (3) gravity', '(1) weight, (2) friction, (3) centrifugal force',
       '(1) centrifugal force, (2) friction, (3) the Moon’s momentum'],
      'Centripetal force is not a new kind of force: it is the resultant force towards the centre, and some real force has to supply it. On a string it is the tension; for a car on a flat road it is the sideways friction between the tyres and the road; for the Moon it is the Earth’s gravitational pull.',
      1)

b.mcq('“Centripetal” means centre-seeking and “centrifugal” means centre-fleeing. In an inertial frame of reference (one in which Newton’s laws hold), which statement about a “centrifugal force” on an object moving in a circle is correct?',
      'It is not a real force: nothing pushes the object outwards — it only needs a force inwards to stop it moving in a straight line',
      ['It is a real outward force that balances the centripetal force', 'It is the reaction to the centripetal force, and it acts on the object itself',
       'It only acts while the object’s speed is changing'],
      'In an inertial frame only real forces act. By Newton’s first law an object keeps moving in a straight line unless a force deflects it, so a circling object needs a resultant force INWARDS, not outwards. The “outward force” we seem to feel is our own inertia — an apparent force that only appears in a rotating frame of reference.',
      2)

b.mcq('Riding in the back seat of a car that turns a corner, you slide across the seat as if pushed outwards, away from the centre of the turn. Which is the correct explanation?',
      'By Newton’s first law your body tends to keep moving in a straight line; the car turns beneath you until the seat, seatbelt or door pushes you towards the centre of the turn',
      ['A centrifugal force pushes you outwards, away from the centre of the turn', 'The centripetal force on you acts outwards, away from the centre',
       'Your weight gains a sideways component while the car turns'],
      'Nothing pushes you outwards. You carry on in a straight line (inertia) while the car curves away beneath you, so relative to the car you seem to slide outwards. The real forces on you — friction from the seat, then the push of the seatbelt or door — act towards the centre of the turn and give you your centripetal acceleration.',
      2)

F = 0.50 * 2.3**2 / 0.20
b.num('A 0.50 kg mass on a frictionless table is tied to a string that passes through a hole in the centre of the table to a hanging mass. The 0.50 kg mass moves round a circle of radius 0.20 m at 2.3 m/s. Calculate the centripetal force on it.',
      F, 'N',
      f'F = mv²/r = 0.50 × 2.3² ÷ 0.20 = 0.50 × 5.29 ÷ 0.20 = {sf(F)} N. The tension in the string supplies this force.',
      2, fig('circ-table-hole'))
M = F / g
b.num(f'The 0.50 kg mass circles at 2.3 m/s on a radius of 0.20 m, held in its circle by a string that runs through the hole in the frictionless table to a hanging mass M, which stays at rest. Calculate M. {G_TEXT}',
      M, 'kg',
      f'The hanging mass is in equilibrium, so the tension equals its weight, Mg. The same tension is the centripetal force on the circling mass, mv²/r = 0.50 × 2.3² ÷ 0.20 = {sf(F)} N. So Mg = {sf(F)} N and M = {sf(F)} ÷ 9.81 = {sf(M)} kg.',
      3, fig('circ-table-hole'))

a = 14**2 / 96
b.num('A car travelling at 14 m/s goes round an unbanked (flat) bend of radius 96 m. Calculate its centripetal acceleration.',
      a, 'm/s²',
      f'a = v²/r = 14² ÷ 96 = 196 ÷ 96 = {sf(a)} m/s², directed towards the centre of the bend.',
      1, fig('circ-flat-bend'))
mu = a / g
b.num(f'The car goes round the flat bend of radius 96 m at 14 m/s, with sideways friction from the road providing all of the centripetal force. The friction force can be at most μ × (normal contact force), where μ is the coefficient of friction. Calculate the minimum value of μ that lets the car round the bend. {G_TEXT}',
      mu, None,
      f'On a flat road the normal contact force equals the weight, mg, so the largest possible friction force is μmg. It must be at least the centripetal force: μmg = mv²/r. The mass cancels, so μ = v²/(rg) = 14² ÷ (96 × 9.81) = {sf(a)} ÷ 9.81 = {sf(mu, 2)}.',
      3, fig('circ-flat-bend'))

b.mcq('A mass on a string moves in a vertical circle. T is the tension in the string and mg is the weight of the mass. Which expressions give the resultant (centripetal) force on the mass at the top and at the bottom of the circle?',
      'Top: T + mg.   Bottom: T − mg',
      ['Top: T − mg.   Bottom: T + mg', 'Top: T + mg.   Bottom: T + mg', 'Top: T.   Bottom: T'],
      'The resultant force must point towards the centre. At the top the string pulls down (towards the centre) and so does the weight, so they add: F = T + mg. At the bottom the string pulls up (towards the centre) but the weight still pulls down, so F = T − mg. That is why the tension is greatest at the bottom.',
      2, fig('circ-ball-cord-top-bottom'))

Fc = 1.7 * 4 * pi**2 * 0.60 / 1.1**2
W = 1.7 * g
w = 2 * pi / 1.1
b.num(f'A 1.7 kg object is swung on the end of a 0.60 m string in a vertical circle, taking 1.1 s for each revolution. Treating its speed as constant, calculate the tension in the string at the top of the circle. {G_TEXT}',
      Fc - W, 'N',
      f'The centripetal force needed is F = mrω², with ω = 2π/T = 2π ÷ 1.1 = {sf(w)} rad/s: F = 1.7 × 0.60 × {sf(w)}² = {sf(Fc)} N. At the top the tension and the weight both point towards the centre: T + mg = F. So T = {sf(Fc)} − (1.7 × 9.81) = {sf(Fc)} − {sf(W)} = {sf(Fc - W)} N.',
      3, fig('circ-vertical-string'))
b.num(f'The same 1.7 kg object on a 0.60 m string goes round its vertical circle once every 1.1 s. Treating its speed as constant, calculate the tension in the string at the bottom of the circle. {G_TEXT}',
      Fc + W, 'N',
      f'As before, F = m × 4π²r/T² = 1.7 × 4π² × 0.60 ÷ 1.1² = {sf(Fc)} N. At the bottom the tension pulls up, towards the centre, while the weight pulls down: T − mg = F. So T = {sf(Fc)} + {sf(W)} = {sf(Fc + W)} N — about three times the tension at the top.',
      3, fig('circ-vertical-string'))

b.mcq('A mass on a string is swung in a vertical circle with only just enough speed to keep it moving in the circle. What is the tension in the string when the mass is at the top?',
      'Zero — its weight alone provides the centripetal force',
      ['Equal to the weight of the mass', 'Twice the weight of the mass', 'Equal to the centripetal force plus the weight'],
      'At the top, T + mg = mv²/r. The slowest the mass can go is when the string is only just taut, T = 0, so mg = mv²/r. The resultant force is then just the weight: for that instant the mass is “weightless”, in free fall, like an object in orbit.',
      2)

v = sqrt(g * 0.75)
b.num(f'An object is swung in a vertical circle of radius 0.75 m. Calculate the minimum speed it must have at the top of the circle to stay in circular motion. {G_TEXT}',
      v, 'm/s',
      f'At the minimum speed the weight alone provides the centripetal force at the top: mg = mv²/r. The mass cancels, so v = √(gr) = √(9.81 × 0.75) = {sf(v)} m/s. Any slower and the weight would be more than the centripetal force needed, so the object would fall inside the circle.',
      2, fig('circ-vertical-top'))

b.mcq('A car travels at a constant speed round a frictionless banked bend, as shown. Which forces act on the car?',
      'Only its weight and the normal contact force from the road',
      ['Its weight, the normal contact force and a centripetal force', 'Its weight, the normal contact force and friction up the slope',
       'Its weight, the normal contact force and an outward centrifugal force'],
      'On a frictionless bend only two real forces act: the weight (vertically down) and the normal contact force (perpendicular to the road surface). The centripetal force is not an extra force — it is the resultant of these two.',
      2, fig('circ-banked-road'))
b.mcq('On a frictionless banked bend, what provides the centripetal force on the car?',
      'The horizontal component of the normal contact force, towards the centre of the bend',
      ['The component of the car’s weight down the slope', 'The vertical component of the normal contact force', 'Friction between the tyres and the road'],
      'The normal contact force is tilted towards the centre of the bend. Its vertical component balances the weight (N cosθ = mg) and its horizontal component is the centripetal force (N sinθ = mv²/r). So on a banked bend the normal force is larger than the weight: it both holds the car up and pushes it round.',
      3, fig('circ-banked-road'))

tan_t = 22**2 / (475 * g)
th = degrees(atan(tan_t))
b.num(f'A bend of radius 475 m is to be banked so that a car can go round it at 22 m/s without needing any friction. Calculate the angle θ at which the road must be banked. {G_TEXT}',
      th, '°',
      f'Vertically N cosθ = mg; horizontally N sinθ = mv²/r. Dividing, tanθ = v²/(rg) = 22² ÷ (475 × 9.81) = 484 ÷ {sf(475 * g, 4)} = {tan_t:.3f}, so θ = {th:.2f}°, about 6°.',
      3, fig('circ-banked-road-475'))

Fc = 0.25 * g * tan(radians(28))
T = sqrt(0.25 * 4 * pi**2 * 0.80 / Fc)
b.num(f'A 0.25 kg toy plane on a string flies round a horizontal circle of radius 0.80 m. The string makes an angle of 28° with the vertical. Calculate the period of the plane’s motion. {G_TEXT}',
      T, 's',
      f'Weight: mg = 0.25 × 9.81 = {sf(0.25 * g)} N. The tension’s vertical component balances the weight and its horizontal component is the centripetal force, so tan28° = F/mg and F = {sf(0.25 * g)} × tan28° = {sf(Fc)} N. Then F = m × 4π²r/T² gives T = √(m × 4π²r ÷ F) = √(0.25 × 4π² × 0.80 ÷ {sf(Fc)}) = {sf(T)} s.',
      4, fig('circ-toy-plane'))

b.mcq('Alice rides in a car on a theme-park ride. The car travels round a circular track that is banked, as shown, and friction is negligible. Which two forces act on the car?',
      'Its weight, vertically downwards, and the normal reaction from the track, at right angles to the track surface',
      ['Its weight, vertically downwards, and the centripetal force, horizontally towards the centre',
       'The normal reaction, vertically upwards, and friction, down the slope',
       'Its weight, at right angles to the track surface, and the normal reaction, vertically upwards'],
      'With no friction the track can only push at right angles to its surface — the normal reaction, tilted towards the centre of the circle. The other force is the weight, vertically down. Their resultant is horizontal and towards the centre: it IS the centripetal force, not a third force.',
      2, fig('circ-theme-park'))
Fc = 960 * g * tan(radians(20))
b.num(f'The mass of Alice’s car and its passengers is 9.60 × 10² kg, and the frictionless track is banked at 20° to the horizontal. Calculate the size of the centripetal force on the car. {G_TEXT}',
      Fc, 'N',
      f'In the vector diagram the normal reaction N is at 20° to the vertical, and its vertical component balances the weight: N cos20° = mg. The resultant of N and the weight is horizontal: F = mg tan20° = 960 × 9.81 × tan20° = {sf(960 * g, 4)} × {tan(radians(20)):.3f} = {sci(Fc)} N, towards the centre of the circle.',
      3, fig('circ-theme-park'))

F = 0.250 * 4.00**2 / 1.20
b.num('A 0.250 kg ball on the end of a cord 1.20 m long is swung in a vertical circle. At the position shown its speed is 4.00 m/s. Calculate the centripetal force on the ball at this instant.',
      F, 'N',
      f'F = mv²/r = 0.250 × 4.00² ÷ 1.20 = 4.00 ÷ 1.20 = {sf(F)} N, directed along the cord towards the centre of the circle.',
      1, fig('circ-ball-cord'))

b.mcq('Why does a ball swung on a cord in a vertical circle move fastest at the bottom of the circle?',
      'As it goes down from the top to the bottom, gravitational potential energy is converted to kinetic energy',
      ['The tension in the cord is greatest at the bottom, so it pulls the ball faster', 'The centripetal force is smallest at the bottom',
       'Its weight acts along its direction of motion at the bottom'],
      'The tension is always at right angles to the ball’s velocity, so it does no work. Only gravity changes the ball’s energy: going down it loses gravitational potential energy and gains the same amount of kinetic energy, so it is fastest at the lowest point and slowest at the top.',
      2, fig('circ-ball-cord-top-bottom'))
b.mcq('The ball is swung in a vertical circle with the cord taut all the way round. How does the tension in the cord at the bottom of the circle compare with the tension at the top?',
      'It is larger at the bottom',
      ['It is larger at the top', 'It is the same at the top and the bottom', 'It is zero at the bottom'],
      'At the top the weight helps to provide the centripetal force: T_top = mv_top²/r − mg. At the bottom the tension must supply the centripetal force AND hold up the weight: T_bottom = mv_bottom²/r + mg. The ball is also faster at the bottom, so the tension there is larger for both reasons.',
      3, fig('circ-ball-cord-top-bottom'))
b.mcq('Compare the centripetal (resultant) force on the ball at the top and at the bottom of its vertical circle.',
      'Both point towards the centre — down at the top and up at the bottom — and it is larger at the bottom',
      ['Both point downwards, and they are equal in size', 'Both point towards the centre, and they are equal in size',
       'It points away from the centre at the bottom'],
      'The centripetal force always points towards the centre, so it is downwards at the top and upwards at the bottom. Its size is mv²/r, and the ball is faster at the bottom, so the centripetal force is larger there.',
      3, fig('circ-ball-cord-top-bottom'))

v_top = sqrt(g * 1.20)
b.num(f'The 0.250 kg ball is swung in a vertical circle on a cord 1.20 m long. Calculate the minimum speed it must have at the top of the circle for the cord to stay taut. {G_TEXT}',
      v_top, 'm/s',
      f'At the minimum speed the tension at the top is zero, so the weight alone provides the centripetal force: mg = mv²/r, giving v = √(gr) = √(9.81 × 1.20) = {sf(v_top)} m/s. Any slower and the weight is more than is needed to pull the ball round, so the cord goes slack and the ball leaves the circle.',
      2, fig('circ-ball-cord-top'))

dh = (4.00**2 - 3.43**2) / (2 * g)
th = degrees(acos(1 - dh / 1.20))
b.num(f'The ball has its minimum speed of 3.43 m/s at the top of the circle (cord 1.20 m). Using conservation of energy, calculate the angle θ from the top of the circle — measured at the centre, from the upward vertical — at which the ball’s speed has risen to 4.00 m/s. {G_TEXT}',
      th, '°',
      f'Kinetic energy gained = potential energy lost: ½m(v² − v_top²) = mgΔh, so Δh = (4.00² − 3.43²) ÷ (2 × 9.81) = {sf(dh)} m. The ball has dropped Δh = r − r cosθ below the top, so cosθ = 1 − Δh/r = 1 − {sf(dh)} ÷ 1.20 = {1 - dh / 1.2:.3f}, and θ = {th:.1f}°.',
      4, fig('circ-ball-cord-angle'))

s = 0.290 / 1.55
th = degrees(asin(s))
b.num('A 1.80 kg bob on a cord 1.55 m long swings as a conical pendulum, moving round a horizontal circle of radius 0.290 m. Calculate the angle θ between the cord and the vertical.',
      th, '°',
      f'The cord is the hypotenuse of a right-angled triangle whose side opposite θ is the radius: sinθ = r/L = 0.290 ÷ 1.55 = {s:.3f}, so θ = {th:.1f}°.',
      3, fig('circ-conical-bob'))
Tn = 1.80 * g / cos(radians(th))
b.num(f'The 1.80 kg bob of a conical pendulum moves round a horizontal circle of radius 0.290 m on a cord 1.55 m long. Calculate the tension in the cord. {G_TEXT}',
      Tn, 'N',
      f'First the angle: sinθ = 0.290 ÷ 1.55, so θ = {th:.1f}°. The bob neither rises nor falls, so the vertical component of the tension balances its weight: T cosθ = mg. T = (1.80 × 9.81) ÷ cos{th:.1f}° = {sf(1.8 * g, 4)} ÷ {cos(radians(th)):.3f} = {sf(Tn)} N.',
      3, fig('circ-conical-bob'))
v = sqrt(0.290 * g * tan(radians(th)))
b.num(f'Calculate the speed the 1.80 kg bob must have to move round its horizontal circle of radius 0.290 m on the 1.55 m cord. {G_TEXT}',
      v, 'm/s',
      f'The horizontal component of the tension is the centripetal force, T sinθ = mv²/r, while vertically T cosθ = mg. Dividing, tanθ = v²/(rg), so v = √(rg tanθ) = √(0.290 × 9.81 × tan{th:.1f}°) = √(0.290 × 9.81 × {tan(radians(th)):.3f}) = {sf(v)} m/s. (With T = {sf(Tn)} N, v = √(T sinθ × r ÷ m) gives the same.)',
      4, fig('circ-conical-bob'))

F = 1.0e4 * 0.26**2 / 68
b.num('The London Eye is a giant wheel with 32 passenger capsules evenly spaced round its rim. Each capsule has a mass of 1.0 × 10⁴ kg, is 68 m from the centre of the wheel and moves at a constant 0.26 m/s. Calculate the centripetal force that keeps a capsule moving in its vertical circle.',
      F, 'N',
      f'F = mv²/r = 1.0 × 10⁴ × 0.26² ÷ 68 = 676 ÷ 68 = {sf(F)} N — tiny compared with the capsule’s weight of about 10⁵ N, because the wheel turns so slowly.',
      1, fig('circ-observation-wheel'))
b.mcq('A passenger stands on the floor of a capsule at the position shown, on the side of the turning wheel. Which forces act on her, and how do they give her centripetal force?',
      'Her weight downwards, the normal contact force from the floor upwards (very slightly less than her weight) and a small sideways friction force from the floor towards the wheel’s axis; their resultant points at the centre of the wheel',
      ['Only her weight and the normal contact force, which are equal and opposite, so there is no resultant force',
       'Her weight, the normal contact force and an outward centrifugal force, which together balance',
       'Only her weight, which points towards the centre of the wheel'],
      'She moves in a circle, so the resultant force on her must point towards the centre of the wheel — at this position, down and towards the axis. Gravity pulls her down, the floor pushes up with a little less than her weight, and friction from the floor pushes her sideways towards the axis. Together they give a small resultant, mv²/r, towards the centre.',
      3, fig('circ-observation-wheel'))

b.mcq('Jon spins Ana round a horizontal circle on the ice by holding her arm, as shown. In which direction does the tension force from Jon’s arm act on Ana at the instant shown?',
      'Along the arm, towards Jon at the centre of the circle',
      ['Along the tangent, in her direction of motion', 'Along the arm, away from Jon', 'Vertically upwards'],
      'Jon’s arm pulls Ana towards him, along the arm. Because Jon is at the centre, this tension points towards the centre of the circle — it is the centripetal force that keeps Ana on her circular path.',
      1, fig('circ-skaters'))
v = sqrt(5.00e2 * 0.95 / 55)
b.num('Ana (mass 55 kg) moves round a horizontal circle of radius 0.95 m, and the tension force in Jon’s arm is 5.00 × 10² N. Calculate Ana’s speed, giving your answer to an appropriate number of significant figures.',
      v, 'm/s',
      f'The tension is the centripetal force: T = mv²/r, so v = √(Tr/m) = √(5.00 × 10² × 0.95 ÷ 55) = √{sf(500 * 0.95 / 55)} = {sf(v, 2)} m/s — to 2 significant figures, because the radius and Ana’s mass are only given to 2 s.f.',
      2, fig('circ-skaters'))

b.mcq('Jan swings a 10 kg iron ball on a steel wire round a horizontal circle, shown from above. In which direction is the ball’s acceleration at the instant shown?',
      'Along the wire, towards Jan at the centre',
      ['In the direction of its velocity', 'Along the wire, away from Jan', 'Nowhere — it has no acceleration, because it moves at a constant speed'],
      'In uniform circular motion the acceleration is centripetal: it points towards the centre of the circle — here along the wire, towards Jan — at right angles to the velocity.',
      1, fig('circ-hammer-throw'))
b.mcq('In which direction does the steel wire pull on Jan?',
      'Along the wire, towards the iron ball',
      ['Along the wire, away from the iron ball', 'In the direction of the ball’s velocity', 'It does not pull on Jan at all — it only pulls the ball'],
      'A taut wire pulls on both of its ends. It pulls the ball inwards, towards Jan (the centripetal force), and by Newton’s third law it pulls Jan outwards, towards the ball, with a force of the same size — which is why a hammer thrower leans back.',
      2, fig('circ-hammer-throw'))
b.mcq('The iron ball moves round its horizontal circle at a constant speed. Why is a horizontal force needed on the ball?',
      'Its velocity is always changing direction, so it is accelerating, and by Newton’s second law an acceleration needs a resultant force',
      ['To keep its speed constant against its tendency to slow down', 'To balance the outward centrifugal force on the ball',
       'No force is needed, because the speed is constant'],
      'Constant speed is not constant velocity. The ball’s direction keeps changing, so its velocity changes: it accelerates towards the centre. By F = ma that needs a resultant force towards the centre, supplied by the tension in the wire.',
      2, fig('circ-hammer-throw'))
v = 2 * pi * 2.0 / 1.5
F = 10 * v**2 / 2.0
b.num('The 10 kg iron ball goes round a horizontal circle of radius 2.0 m, taking 1.5 s for each rotation. Calculate the centripetal force on the ball.',
      F, 'N',
      f'v = 2πr/T = 2π × 2.0 ÷ 1.5 = {sf(v)} m/s, so F = mv²/r = 10 × {sf(v)}² ÷ 2.0 = {sf(F)} N. (Or F = mrω², with ω = 2π/T = {sf(2 * pi / 1.5)} rad/s.)',
      2, fig('circ-hammer-throw'))
b.mcq('After a few rotations the ball moves round a circle of the same radius, but with a shorter period. What happens to the horizontal force that the wire exerts on Jan?',
      'It increases, because the centripetal force F = 4π²mr/T² gets bigger as T gets smaller',
      ['It decreases, because the ball takes less time to go round', 'It stays the same, because the radius has not changed',
       'It increases, but only in proportion to 1/T'],
      'A shorter period means a higher speed (v = 2πr/T), and the centripetal force mv²/r = 4π²mr/T² depends on 1/T². The wire must pull harder on the ball — and so, by Newton’s third law, harder on Jan too. Halving the period would quadruple the force.',
      2, fig('circ-hammer-throw'))

T = sqrt(18 * 4 * pi**2 * 7.0 / 5.5)
b.num('An 18 kg suitcase rides on a horizontal circular conveyor belt of radius 7.0 m. The unbalanced (resultant) force on it is 5.5 N. Calculate the time the belt takes to complete one rotation.',
      T, 's',
      f'The unbalanced force is the centripetal force: F = m × 4π²r/T². Rearranging, T = √(m × 4π²r ÷ F) = √(18 × 4π² × 7.0 ÷ 5.5) = √{sf(18 * 4 * pi**2 * 7 / 5.5)} = {sf(T)} s.',
      3, fig('circ-baggage-belt'))

w = 2 * pi / 15
F = 65 * 4.0 * w**2
b.num('Jason (mass 65 kg) stands on a merry-go-round, 4.0 m from its centre. The merry-go-round takes 15 s to make a complete turn. Calculate the centripetal force needed to keep him moving in his circle.',
      F, 'N',
      f'ω = 2π/T = 2π ÷ 15 = {sf(w)} rad/s, so F = mrω² = 65 × 4.0 × {sf(w)}² = {sf(F)} N. (Or v = 2πr/T = {sf(2 * pi * 4 / 15)} m/s and F = mv²/r.)',
      2, fig('circ-merry-go-round'))

a = 4 * pi**2 * 0.75 / 0.84**2
b.num('Janet’s ball moves round a horizontal circle of radius 0.75 m, taking 0.84 s to go round her head once. Calculate the acceleration of the ball.',
      a, 'm/s²',
      f'a = 4π²r/T² = 4π² × 0.75 ÷ 0.84² = {sf(4 * pi**2 * 0.75)} ÷ {0.84**2:.4f} = {sf(a)} m/s², towards the centre of the circle. (Or v = 2πr/T = {sf(2 * pi * 0.75 / 0.84)} m/s and a = v²/r.)',
      2, fig('circ-ball-overhead'))
b.mcq('Which force makes Janet’s ball accelerate as it goes round its circle, and how does it change the ball’s velocity?',
      'The tension in the string: it acts towards the centre, at right angles to the velocity, so it changes the ball’s direction but not its speed',
      ['The ball’s weight: it acts towards the centre of the circle', 'The tension in the string: it acts along the direction of motion and speeds the ball up',
       'Air resistance: it acts against the motion and turns the ball'],
      'The string pulls the ball towards the centre of the circle. That force is always perpendicular to the ball’s velocity, so it does no work and the speed stays the same — but it continually changes the direction of the velocity, which is a centripetal acceleration.',
      2, fig('circ-ball-overhead'))

v = 2 * pi * 0.500 / 1.40
F = 0.0400 * v**2 / 0.500
b.num('The referee’s 40.0 g whistle moves round a horizontal circle of radius 0.500 m, taking 1.40 s for each rotation. Calculate the horizontal force that the string exerts on the whistle.',
      F, 'N',
      f'v = 2πr/T = 2π × 0.500 ÷ 1.40 = {sf(v)} m/s, and 40.0 g = 0.0400 kg. The string’s horizontal pull is the centripetal force: F = mv²/r = 0.0400 × {sf(v)}² ÷ 0.500 = {sf(F)} N, towards the centre.',
      2, fig('circ-whistle-plan'))
b.mcq('Considering the horizontal forces on the whistle, why does it keep moving round its circle at a constant speed?',
      'The only horizontal force is the string’s pull towards the centre; being at right angles to the velocity, it changes the direction of motion but not the speed',
      ['The horizontal forces on it are balanced, so it keeps moving at a constant speed', 'The string’s pull balances an outward centrifugal force',
       'The string’s pull acts along the direction of motion, keeping the speed up'],
      'Horizontally the only force is the string’s tension (ignoring air resistance). It points towards the centre, perpendicular to the whistle’s velocity. A force at right angles to the motion does no work, so the speed stays the same, but it keeps turning the velocity — so the whistle goes round in a circle.',
      2, fig('circ-whistle-plan'))
F2 = 0.0400 * 1.0**2 / 0.500
b.num('The speed of the 40.0 g whistle is reduced to 1.0 m/s, still on a circle of radius 0.500 m. Calculate the new horizontal force needed to keep it moving in the circle.',
      F2, 'N',
      f'F = mv²/r = 0.0400 × 1.0² ÷ 0.500 = {sf(F2, 2)} N — about five times smaller than before, because F depends on v².',
      2, fig('circ-whistle-plan'))
b.mcq(f'At 1.0 m/s the whistle needs a horizontal force of only 0.080 N, while its weight is about {sf(0.04 * g, 2)} N. What is the likely result of reducing its speed?',
      'The string sags: the whistle drops lower and moves round a smaller circle, with the string at a steeper angle',
      ['The whistle keeps moving in the same horizontal circle, just more slowly', 'The whistle flies off along a tangent',
       'The whistle moves outwards into a bigger circle'],
      'The string has to hold the whistle up as well as pull it round: the vertical part of the tension balances the weight and the horizontal part is the centripetal force. When the horizontal force needed falls to 0.080 N — far less than the weight — the string hangs much more steeply, like a conical pendulum, so the whistle drops and circles on a smaller radius.',
      3, fig('circ-whistle-plan'))


# ════════════════════════════════════════════════════════════════════════
# 13.1 Gravitational field
# ════════════════════════════════════════════════════════════════════════
b = Bank('13.1')

b.mcq('What is a gravitational field?',
      'A region in which a mass experiences a force',
      ['A region in which an electric charge experiences a force', 'The path followed by an object in orbit',
       'The force between two masses divided by the distance between them'],
      'A gravitational field is a field of force: a region of space in which any mass placed there experiences a gravitational force. Every mass is surrounded by one — it is the “area of influence” through which masses attract each other without touching.',
      1)
b.mcq('Gravitational field strength g at a point is defined as…',
      'the gravitational force per unit mass on a small mass placed at that point',
      ['the gravitational force on any object placed at that point', 'the work done per unit mass in bringing a small mass from infinity to that point',
       'the mass per unit volume of the body producing the field'],
      'g = F/m, measured in N/kg. Near the Earth’s surface it is 9.81 N/kg, which is why it is also the acceleration of free fall, 9.81 m/s² (1 N/kg = 1 m/s²). The work done per unit mass from infinity defines the gravitational POTENTIAL, not the field strength.',
      1)
b.mcq('Is gravitational field strength a scalar or a vector quantity?',
      'A vector, because it is a force per unit mass and so has a direction',
      ['A scalar, because it only has a size', 'A scalar, because mass is a scalar', 'A vector, but only close to the Earth’s surface'],
      'Gravitational fields are force fields. Force is a vector, so force per unit mass is a vector too: at every point g has a size and a direction (towards the mass producing the field). That is why fields are drawn with arrows.',
      1)
b.mcq('The diagram shows field lines around a planet. What does the spacing of the field lines show?',
      'The field strength: it is strongest where the lines are closest together',
      ['The field strength: it is strongest where the lines are furthest apart', 'The direction in which masses near the planet are moving',
       'Nothing — only the direction of the arrows has any meaning'],
      'The arrows show the direction of the force on a mass (towards the planet) and the density of the lines shows the field strength. The lines crowd together near the surface, where the field is strongest, and spread out further away, where it is weaker.',
      2, fig('grav-field-lines'))
b.mcq('An astronaut travels from the Earth to the Moon. Which statement is correct?',
      'Her mass stays the same, but her weight changes',
      ['Her weight stays the same, but her mass changes', 'Both her mass and her weight stay the same', 'Both her mass and her weight change'],
      'Mass is the amount of matter in her body and is the same everywhere. Weight is the gravitational force on her, W = mg, so it depends on the field strength where she is — on the Moon g is only about 1.6 N/kg, so she weighs about a sixth of her weight on Earth.',
      1)


# ════════════════════════════════════════════════════════════════════════
# 13.2 Gravitational force between point masses (the shared "Gravitation and orbits" lesson)
# ════════════════════════════════════════════════════════════════════════
b = Bank('13.2')

b.mcq('According to Newton’s law of gravitation, the gravitational force between two point masses is…',
      'proportional to the product of their masses and inversely proportional to the square of their separation',
      ['proportional to the sum of their masses and inversely proportional to their separation',
       'proportional to the product of their masses and inversely proportional to their separation',
       'proportional to the product of their masses and to the square of their separation'],
      'F = Gm₁m₂/r², where r is the distance between the centres of mass and G = 6.67 × 10⁻¹¹ N m² kg⁻². Doubling one mass doubles the force; doubling the separation quarters it.',
      1)

F = G * 75 * 75 / 0.95**2
b.num(f'Two students, each of mass 75 kg, stand with their centres of mass 0.95 m apart. Treating them as point masses, calculate the gravitational force between them. {GRAV}.',
      F, 'N',
      f'F = Gm₁m₂/r² = 6.67 × 10⁻¹¹ × 75 × 75 ÷ 0.95² = {sf(F)} N — far too small to notice, which is why we only feel the gravity of huge masses like the Earth.',
      2, fig('grav-two-students'))

b.num('A satellite weighs 9000 N on the Earth’s surface. What would the gravitational force on it be if its mass were tripled and it were moved to twice its distance from the Earth’s centre?',
      9000 * 3 / 4, 'N',
      'F = GMm/r², so F ∝ m/r². Tripling m multiplies the force by 3; doubling r divides it by 2² = 4. New force = 9000 × 3 ÷ 4 = 6750 N.',
      3, fig('grav-weight-scaling'))

b.mcq('The Moon is pulled towards the Earth by gravity. Why doesn’t it fall down onto the Earth?',
      'It is falling towards the Earth all the time, but its sideways speed carries it round the Earth instead of into it',
      ['The Earth’s gravity does not reach as far as the Moon', 'An outward centrifugal force on the Moon balances the Earth’s gravity',
       'The Sun’s gravity pulls it away from the Earth just as strongly'],
      'Gravity is the centripetal force on the Moon. It accelerates the Moon towards the Earth continuously, but because the Moon is also moving sideways, this “falling” only bends its path into a circle round the Earth. The same is true of any satellite — which is why astronauts in orbit feel weightless: they are in free fall.',
      2, fig('grav-moon-orbit'))

v = sqrt(G * M_E98 / 8.50e7)
b.num(f'A 4500 kg satellite orbits the Earth at an orbital radius of 8.50 × 10⁷ m. Calculate its orbital speed. {GRAV} and {E98}.',
      v, 'm/s',
      f'Gravity provides the centripetal force: GMm/r² = mv²/r. The satellite’s mass cancels, so v = √(GM/r) = √(6.67 × 10⁻¹¹ × 5.98 × 10²⁴ ÷ 8.50 × 10⁷) = √({sci(G * M_E98 / 8.5e7)}) = {sci(v)} m/s.',
      3, fig('grav-orbit-85e7'))

T = 2 * pi * sqrt((2.20e7)**3 / (G * M_E98))
b.num(f'A satellite orbits the Earth at a radius of 2.20 × 10⁷ m. Calculate its orbital period. {GRAV} and {E98}.',
      T, 's',
      f'GMm/r² = m × 4π²r/T², so T² = 4π²r³/(GM) = 4π² × (2.20 × 10⁷)³ ÷ (6.67 × 10⁻¹¹ × 5.98 × 10²⁴) = {sci(T**2)} s², and T = {sci(T)} s — about {T / 3600:.0f} hours.',
      3, fig('grav-orbit-22e7'))

b.mcq('Two identical satellites orbit the Earth. Satellite A’s orbital radius is twice satellite B’s. Which satellite travels faster?',
      'B — it is closer, where the gravitational pull is stronger, so it must move faster to stay in orbit',
      ['A — it has further to travel in each orbit', 'Neither — identical satellites travel at the same speed',
       'A — the weaker pull on it slows it down less'],
      f'For a circular orbit v = √(GM/r). The closer satellite feels a stronger pull, so it needs a larger speed for that pull to be exactly the centripetal force it needs. Here v_B = √2 × v_A ≈ {sqrt(2):.2f} v_A.',
      2, fig('grav-two-orbits'))
b.mcq('Two identical satellites are in circular orbits of the same radius: A orbits the Sun and B orbits the Earth. Which satellite travels faster?',
      'A — the Sun’s much larger mass gives a stronger pull at that radius, so A must move faster to stay in orbit',
      ['B — the Earth is smaller, so B goes round it more quickly', 'Neither — at the same orbital radius the speeds are equal',
       'B — the Sun’s stronger pull slows A down'],
      'v = √(GM/r): at the same radius, the orbital speed depends only on the mass M of the central body. The Sun is about 330 000 times as massive as the Earth, so A must travel about √330 000 ≈ 575 times as fast.',
      2, fig('grav-sun-earth'))

Tday = 24 * 3600
r3 = G * M_E98 * Tday**2 / (4 * pi**2)
r = r3 ** (1 / 3)
b.num(f'A geostationary satellite stays above the same point on the equator: it orbits once in the time the Earth takes to spin once, 24 hours. Calculate the radius of its orbit. {GRAV} and {E98}.',
      r, 'm',
      f'T = 24 × 3600 = 86 400 s. From GMm/r² = m × 4π²r/T², r³ = GMT²/(4π²) = 6.67 × 10⁻¹¹ × 5.98 × 10²⁴ × 86 400² ÷ 4π² = {sci(r3)} m³, so r = {sci(r)} m — about {round((r - R_E) / 1e6)} 000 km above the surface.',
      4, fig('grav-geostationary'))
v = 2 * pi * 4.22e7 / Tday
b.num('A geostationary satellite orbits at a radius of 4.22 × 10⁷ m, going round once every 24 hours. Calculate its orbital speed.',
      v, 'm/s',
      f'T = 24 h = 86 400 s. v = 2πr/T = 2π × 4.22 × 10⁷ ÷ 86 400 = {sci(v)} m/s.',
      3, fig('grav-geostationary'))

r = 5220e3 + 351e3
M = 4 * pi**2 * r**3 / (G * (5.46e3)**2)
b.num(f'A spaceship goes into a circular orbit around a planet, at a height of 351 km above the planet’s surface, with a period of 5.46 × 10³ s. The planet’s radius is 5220 km. Calculate the mass of the planet. {GRAV}.',
      M, 'kg',
      f'Measure the orbital radius from the planet’s centre: r = 5220 km + 351 km = 5571 km = {sci(r, 4)} m. Gravity provides the centripetal force, GMm/r² = mrω² with ω = 2π/T, so M = 4π²r³/(GT²) = 4π² × ({sci(r, 4)})³ ÷ (6.67 × 10⁻¹¹ × (5.46 × 10³)²) = {sci(M)} kg.',
      4, fig('grav-spaceship-planet'))

b.mcq('A 300 kg television satellite is in a geostationary orbit round the Earth. Name the force that keeps it in its circular orbit, and state the direction in which this force acts.',
      'The gravitational pull of the Earth, towards the centre of the Earth',
      ['The gravitational pull of the Earth, along the direction of the satellite’s motion', 'A centrifugal force, away from the Earth',
       'The thrust of the satellite’s engines, towards the centre of the Earth'],
      'Gravity (the satellite’s weight) is the only force acting on it. It points towards the centre of the Earth, at right angles to the satellite’s velocity — exactly what is needed to provide the centripetal force for a circular orbit. No engine is needed to stay in orbit.',
      1, fig('grav-tv-satellite'))
F = G * M_E97 * 300 / (4.22e7)**2
b.num(f'The 300 kg television satellite orbits at a radius of 4.22 × 10⁷ m from the centre of the Earth. Calculate the gravitational force on it. {GRAV} and {E97}.',
      F, 'N',
      f'F = GMm/r² = 6.67 × 10⁻¹¹ × 5.97 × 10²⁴ × 300 ÷ (4.22 × 10⁷)² = {sf(F)} N — compared with about {sf(300 * g, 2)} N at the Earth’s surface.',
      2, fig('grav-tv-satellite'))
v = sqrt(G * M_E97 / 4.22e7)
b.num(f'Calculate the orbital speed of the television satellite, which orbits at a radius of 4.22 × 10⁷ m. {GRAV} and {E97}.',
      v, 'm/s',
      f'The gravitational force is the centripetal force: GMm/r² = mv²/r, so v = √(GM/r) = √(6.67 × 10⁻¹¹ × 5.97 × 10²⁴ ÷ 4.22 × 10⁷) = {sci(v)} m/s. (Check: 2πr/T with T = 24 h gives the same.)',
      3, fig('grav-tv-satellite'))

b.mcq('The space shuttle Discovery, with the Hubble space telescope attached to it by a cable, is in a circular orbit of radius 7.00 × 10⁶ m. Which force keeps the shuttle and telescope in their orbit, and in which direction does it act?',
      'The Earth’s gravitational force, directed towards the centre of the Earth',
      ['The Earth’s gravitational force, directed along the shuttle’s velocity', 'The tension in the cable, directed towards the telescope',
       'A centrifugal force, directed away from the Earth'],
      'The only significant force on the shuttle–telescope system is the Earth’s gravity. It acts towards the Earth’s centre, perpendicular to the velocity, and is the centripetal force of the orbit. The cable’s tension is an internal force between the shuttle and the telescope, so it does not affect the motion of the system as a whole.',
      1, fig('grav-shuttle-orbit'))

w = 2 * pi / 2.76e4
M = 4 * pi**2 * (9.38e6)**3 / (G * (2.76e4)**2)
b.num(f'Phobos, one of the moons of Mars, orbits Mars at a mean radius of 9.38 × 10⁶ m with a period of 2.76 × 10⁴ s. Calculate the mass of Mars. {GRAV}.',
      M, 'kg',
      f'Gravity provides Phobos’s centripetal force: GMm/r² = mrω², with ω = 2π/T = {sci(w)} rad/s. So M = ω²r³/G = 4π²r³/(GT²) = 4π² × (9.38 × 10⁶)³ ÷ (6.67 × 10⁻¹¹ × (2.76 × 10⁴)²) = {sci(M)} kg.',
      4, fig('grav-phobos'))

b.mcq('A planet of mass m moves in a circular orbit of radius r and period T round a star of mass M. Equating the gravitational force on the planet to the centripetal force it needs gives which relationship?',
      'T² = (4π²/GM) r³', ['T² = (GM/4π²) r³', 'T² = (4π²/GM) r²', 'T = (4π²/GM) r³'],
      'GMm/r² = mv²/r with v = 2πr/T. Substituting: GMm/r² = m(4π²r²/T²)/r = 4π²mr/T², so T² = (4π²/GM) r³. The planet’s mass cancels — and T² ∝ r³ is Kepler’s third law.',
      3, fig('grav-star-planet'))
b.mcq('By equating the gravitational force on a planet to the centripetal force it needs, find an expression for its orbital speed v in a circular orbit of radius r round a star of mass M.',
      'v = √(GM/r)', ['v = √(GMr)', 'v = GM/r', 'v = √(GM/r²)'],
      'GMm/r² = mv²/r. Cancel m and one factor of r: v² = GM/r, so v = √(GM/r). The orbital speed falls as the orbit gets bigger, and does not depend on the planet’s own mass.',
      2, fig('grav-star-planet'))

b.mcq('F_E is the gravitational force exerted on the Earth by the Moon, and F_m is the gravitational force exerted on the Moon by the Earth. Which statement is correct?',
      'F_E and F_m are equal in size and opposite in direction: F_E acts on the Earth towards the Moon, and F_m acts on the Moon towards the Earth',
      ['F_E is much larger than F_m, because the Earth is much more massive', 'F_m is much larger than F_E, because the Moon is less massive',
       'F_E and F_m are equal in size, and both act towards the Earth'],
      'The two forces are a Newton’s third law pair: both equal Gm₁m₂/r², so they are the same size, and they point towards each other along the line joining the centres. The Moon accelerates much more only because its mass is much smaller.',
      2, fig('grav-earth-moon'))
F = G * 5.97e24 * 7.35e22 / (3.84e8)**2
b.num(f'The Earth has a mass of 5.97 × 10²⁴ kg and the Moon a mass of 7.35 × 10²² kg. Their centres are 3.84 × 10⁸ m apart. Calculate the gravitational force between the Earth and the Moon. {GRAV}.',
      F, 'N',
      f'F = Gm₁m₂/r² = 6.67 × 10⁻¹¹ × 5.97 × 10²⁴ × 7.35 × 10²² ÷ (3.84 × 10⁸)² = {sci(F)} N.',
      2, fig('grav-earth-moon'))

r_iss = R_E + 408e3
b.num('The International Space Station (ISS), of mass 4.20 × 10⁵ kg, orbits the Earth at a height of 408 km above the Earth’s surface. Taking the radius of the Earth as 6.38 × 10⁶ m, calculate the distance between the centre of the Earth and the ISS.',
      r_iss, 'm',
      f'Distances in the law of gravitation are measured from the centre of the Earth, so add the Earth’s radius to the height (in metres): r = 6.38 × 10⁶ + 408 × 10³ = {sci(r_iss, 4)} m.',
      1, fig('grav-iss-orbit'))
F = G * M_E97 * 4.20e5 / r_iss**2
b.num(f'The ISS (mass 4.20 × 10⁵ kg) orbits 6.788 × 10⁶ m from the centre of the Earth. Calculate the gravitational force between the Earth and the ISS. {GRAV} and {E97}.',
      F, 'N',
      f'F = GMm/r² = 6.67 × 10⁻¹¹ × 5.97 × 10²⁴ × 4.20 × 10⁵ ÷ (6.788 × 10⁶)² = {sci(F)} N — about {100 * F / (4.2e5 * g):.0f}% of the ISS’s weight on the ground.',
      2, fig('grav-iss-orbit'))


# ════════════════════════════════════════════════════════════════════════
# 13.3 Gravitational field of a point mass
# ════════════════════════════════════════════════════════════════════════
b = Bank('13.3')

b.mcq('A campfire seems to give out a “heat field”: it feels stronger as you move closer, and stronger again if the fire is made bigger. In what similar way does the gravitational field strength around a planet behave?',
      'It is stronger closer to the planet, and stronger for a more massive planet',
      ['It is stronger closer to the planet, but does not depend on the planet’s mass', 'It is the same at all distances, but stronger for a more massive planet',
       'It is weaker closer to the planet'],
      'For a point mass — or a uniform sphere, outside it — g = GM/r²: g increases as the distance r from the centre decreases, and increases in proportion to the mass M.',
      1)
b.mcq('Near the Earth’s surface we use g = 9.81 N/kg. Why can’t this value be used to find the gravitational force on a satellite in a high orbit?',
      'Because g = GM/r² gets smaller as the distance r from the Earth’s centre increases',
      ['Because g is zero once you are above the atmosphere', 'Because g only applies to objects that are falling',
       'Because the satellite’s mass changes in orbit'],
      'g is only roughly constant close to the surface, where r hardly changes. Further out g = GM/r² falls with the square of the distance from the Earth’s centre: at twice the Earth’s radius it is a quarter of 9.81 N/kg. Gravity never switches off in orbit — it is what keeps the satellite going round.',
      2)

gm = G * 7.35e22 / (1.74e6)**2
b.num(f'The Moon has a mass of 7.35 × 10²² kg and a radius of 1.74 × 10⁶ m. Calculate the gravitational field strength at its surface. {GRAV}.',
      gm, 'N/kg',
      f'g = GM/r² = 6.67 × 10⁻¹¹ × 7.35 × 10²² ÷ (1.74 × 10⁶)² = {sf(gm)} N/kg — about a sixth of the value on Earth.',
      2, fig('grav-moon-radius'))
gs = G * M_E98 / (7.00e6)**2
b.num(f'The space shuttle and telescope orbit the Earth at a radius of 7.00 × 10⁶ m. Calculate the gravitational field strength (the acceleration due to gravity) at this height, giving your answer to an appropriate number of significant figures. {GRAV} and {E98}.',
      gs, 'N/kg',
      f'g = GM/r² = 6.67 × 10⁻¹¹ × 5.98 × 10²⁴ ÷ (7.00 × 10⁶)² = {sf(gs)} N/kg, to 3 significant figures like the data. That is only about {100 * (1 - gs / g):.0f}% less than at the surface — astronauts float because they are in free fall, not because gravity has gone.',
      2, fig('grav-shuttle-orbit'))
gi = G * M_E97 / r_iss**2
b.num(f'Calculate the gravitational field strength due to the Earth at any point in the orbit of the ISS, 6.788 × 10⁶ m from the Earth’s centre. {GRAV} and {E97}.',
      gi, 'N/kg',
      f'g = GM/r² = 6.67 × 10⁻¹¹ × 5.97 × 10²⁴ ÷ (6.788 × 10⁶)² = {sf(gi)} N/kg. (Or divide the force on the ISS by its mass: {sci(G * M_E97 * 4.2e5 / r_iss**2)} N ÷ 4.20 × 10⁵ kg gives the same.)',
      2, fig('grav-iss-orbit'))


# ════════════════════════════════════════════════════════════════════════
# 13.4 Gravitational potential
# ════════════════════════════════════════════════════════════════════════
b = Bank('13.4')

b.mcq('In the expression Eₚ = −GMm/r for the gravitational potential energy of two masses, where is the zero of potential energy?',
      'When the masses are infinitely far apart',
      ['When the masses are touching', 'At the surface of the larger mass', 'At the centre of the larger mass'],
      'Eₚ = −GMm/r tends to zero as r → ∞, so the reference point (Eₚ = 0) is infinite separation. The gravitational potential φ = −GM/r uses the same zero: it is the work done per unit mass in bringing a small mass from infinity.',
      1)
b.mcq('Why is the gravitational potential energy of a mass near a planet always negative?',
      'Its zero is at infinity and gravity is attractive: work must be done ON the mass to take it away to infinity, so at any finite distance it has less energy than at infinity',
      ['Because the mass is below the reference height, which is at the planet’s surface', 'Because gravitational forces are negative',
       'Because the mass is moving towards the planet'],
      'Bringing a mass in from infinity, gravity does work on it and its potential energy falls below the zero at infinity. To take it back out you would have to supply that energy. So at every finite distance Eₚ = −GMm/r is negative, and it gets more negative the closer the mass is.',
      2)
b.mcq('Which graph shows how the gravitational potential energy Eₚ of a mass varies with its distance r from the centre of a planet of radius R, for r ≥ R?',
      'Graph C', ['Graph A', 'Graph B', 'Graph D'],
      'Eₚ = −GMm/r: it is negative everywhere, most negative at the surface (r = R), and rises towards zero as r → ∞ — graph C. A has the wrong sign, B is a straight line (like mgh, which only works close to the surface), and D starts at zero and falls, which would mean the mass loses energy as it moves away.',
      2, fig('grav-ep-graphs'), keep_order=True)

r = 3.60e7 + R_E
Ep = -G * M_E98 * 2500 / r
b.num(f'A 2500 kg satellite is in orbit 3.60 × 10⁷ m above the Earth’s surface. Calculate its gravitational potential energy due to the Earth, including the sign. {GRAV} and {E98R}.',
      Ep, 'J',
      f'Measure r from the Earth’s centre: r = 3.60 × 10⁷ + 6.38 × 10⁶ = {sci(r, 4)} m. Eₚ = −GMm/r = −6.67 × 10⁻¹¹ × 5.98 × 10²⁴ × 2500 ÷ {sci(r, 4)} = {sci(Ep)} J. It is negative because the zero of potential energy is at infinity.',
      3, fig('grav-satellite-altitude'), sign=True)
v = sqrt(G * M_E98 / r)
Ek = 0.5 * 2500 * v**2
b.num(f'The same 2500 kg satellite orbits 4.238 × 10⁷ m from the Earth’s centre. Calculate its total energy (kinetic plus gravitational potential), including the sign. {GRAV} and {E98}.',
      Ek + Ep, 'J',
      f'In a circular orbit GMm/r² = mv²/r, so v = √(GM/r) = {sci(v)} m/s and Eₖ = ½mv² = GMm/(2r) = {sci(Ek)} J. With Eₚ = −GMm/r = {sci(Ep)} J, the total is E = Eₖ + Eₚ = {sci(Ek + Ep)} J — exactly half of Eₚ. It is negative: the satellite is bound to the Earth.',
      4, fig('grav-satellite-altitude'), sign=True)
b.mcq('For a satellite in a circular orbit, how is its kinetic energy Eₖ related to its gravitational potential energy Eₚ?',
      'Eₖ = −½Eₚ', ['Eₖ = −Eₚ', 'Eₖ = ½Eₚ', 'Eₖ = −2Eₚ'],
      'In orbit GMm/r² = mv²/r, so mv² = GMm/r and Eₖ = ½mv² = GMm/(2r). Since Eₚ = −GMm/r, Eₖ = −½Eₚ — a positive number, because Eₚ is negative. The total energy is then Eₖ + Eₚ = ½Eₚ.',
      3)

W = G * M_E98 * 4500 * (1 / 1.8e7 - 1 / 4.2e7)
b.num(f'How much work must be done to move a 4500 kg satellite from an orbital radius of 1.8 × 10⁷ m out to an orbital radius of 4.2 × 10⁷ m? Consider only the change in its gravitational potential energy (ignore any change in kinetic energy). {GRAV} and {E98}.',
      W, 'J',
      f'W = ΔEₚ = (−GMm/r_f) − (−GMm/r_i) = GMm(1/r_i − 1/r_f) = 6.67 × 10⁻¹¹ × 5.98 × 10²⁴ × 4500 × (1/1.8 × 10⁷ − 1/4.2 × 10⁷) = {sci(W)} J. It is positive: moving away from the Earth, the potential energy rises towards zero.',
      3, fig('grav-orbit-raise'))

ri, rf = R_E + 3.50e5, R_E
dEp = G * M_E98 * 250 * (1 / ri - 1 / rf)
v = sqrt(2 * -dEp / 250)
b.num(f'A 250 kg capsule of waste is released from rest at an altitude of 3.50 × 10⁵ m above the Earth’s surface. Ignoring air resistance, calculate the speed at which it would hit the Earth. {GRAV} and {E98R}.',
      v, 'm/s',
      f'r_i = 6.38 × 10⁶ + 3.50 × 10⁵ = {sci(ri)} m and r_f = 6.38 × 10⁶ m. The change in potential energy is ΔEₚ = GMm(1/r_i − 1/r_f) = {sci(dEp)} J, so the capsule gains {sci(-dEp)} J of kinetic energy. ½mv² = {sci(-dEp)} J gives v = √(2 × {sci(-dEp)} ÷ 250) = {sci(v)} m/s. (Using mgh with g = 9.81 N/kg would overestimate it, because g weakens with height.)',
      4, fig('grav-iss-drop'))

Ek = G * M_E98 * 2.35e16 / R_E
b.num(f'An asteroid of mass 2.35 × 10¹⁶ kg starts from rest a very long way from the Earth (take its initial kinetic and potential energy as zero) and falls to the Earth. Calculate the energy released on impact — the kinetic energy it has when it reaches the Earth’s surface. {GRAV} and {E98R}.',
      Ek, 'J',
      f'Energy is conserved: Eₖ + Eₚ = 0 at the start, so at the surface Eₖ = −Eₚ = GMm/R = 6.67 × 10⁻¹¹ × 5.98 × 10²⁴ × 2.35 × 10¹⁶ ÷ 6.38 × 10⁶ = {sci(Ek)} J.',
      3, fig('grav-asteroid'))

b.mcq('To escape completely from the Earth’s gravitational field, an object launched from the surface must be given enough kinetic energy to…',
      'make up for all of its (negative) gravitational potential energy, so that it can just reach infinity',
      ['lift it to the top of the atmosphere', 'put it into a circular orbit', 'overcome its weight at the Earth’s surface'],
      'At infinity Eₚ = 0. To get there the object needs at least enough kinetic energy to cancel its negative potential energy at the surface: ½mv² = GMm/R. That gives the escape speed, v = √(2GM/R). Reaching an orbit is not enough — an orbiting satellite is still bound to the Earth.',
      2)
v = sqrt(2 * G * M_E98 / R_E)
b.num(f'At what speed would you need to throw a 1.0 kg rock upwards from the Earth’s surface for it to escape completely from the Earth’s gravitational field? Ignore air resistance and the Earth’s rotation. {GRAV} and {E98R}.',
      v, 'm/s',
      f'At the minimum speed the total energy is zero: ½mv² − GMm/R = 0, so v = √(2GM/R) = √(2 × 6.67 × 10⁻¹¹ × 5.98 × 10²⁴ ÷ 6.38 × 10⁶) = {sci(v)} m/s — about 11 km/s. The rock’s mass cancels.',
      3, fig('grav-escape'))
b.mcq('Does the mass of the rock affect the speed it needs to escape from the Earth?',
      'No: the mass cancels, so every object needs the same escape speed — but a heavier rock needs more kinetic energy to reach it',
      ['Yes: a heavier rock needs a higher escape speed', 'Yes: a heavier rock needs a lower escape speed, because gravity pulls it harder',
       'No: and a heavier rock also needs no more kinetic energy'],
      '½mv² = GMm/R: m appears on both sides and cancels, giving v = √(2GM/R) for any mass. The kinetic energy needed, ½mv², is still proportional to the mass, so a heavier rock needs more energy to be launched at the same speed.',
      2)

r1, r2 = R_E + 980e3, R_E + 480e3
dEp = G * M_E97 * 1450 * (1 / r1 - 1 / r2)
b.num(f'A 1450 kg satellite moves from an orbit 980 km above the Earth’s surface to a lower orbit 480 km above the surface. Calculate the change in its gravitational potential energy, including the sign. {GRAV} and {E97R}.',
      dEp, 'J',
      f'Radii from the Earth’s centre: r₁ = 6.38 × 10⁶ + 980 × 10³ = {sci(r1)} m and r₂ = 6.38 × 10⁶ + 480 × 10³ = {sci(r2)} m. ΔEₚ = Eₚ(final) − Eₚ(initial) = GMm(1/r₁ − 1/r₂) = 6.67 × 10⁻¹¹ × 5.97 × 10²⁴ × 1450 × (1/{sci(r1)} − 1/{sci(r2)}) = {sci(dEp)} J. It is negative: moving closer to the Earth, the potential energy decreases.',
      3, fig('grav-orbit-lower'), sign=True)


# ════════════════════════════════════════════════════════════════════════
# SQL
# ════════════════════════════════════════════════════════════════════════
bank_sizes = {code: bank_counter.get(code, 0) for code in LESSONS}

out = [
    '-- A Level (9702) practice banks for units 12 and 13 — motion in a circle and',
    '-- gravitational fields — from the owner\'s worksheets. GENERATED by',
    '-- 2026-09-30-a-level-circular-gravitation.py: edit that, never this file.',
    f'-- {len(questions)} questions: ' + ', '.join(f'{code} {n}' for code, n in bank_sizes.items()) + '.',
    '-- Idempotent: uuid5 ids, ON CONFLICT DO NOTHING.',
    'BEGIN;',
    '',
    '-- The six lessons must already serve the A Level curriculum.',
    '''DO $$
DECLARE missing INT;
BEGIN
  SELECT 6 - COUNT(*) INTO missing FROM topics
  WHERE id IN (''' + ', '.join(q(t) for t, _, _ in LESSONS.values()) + ''')
    AND 'a-level' = ANY(curriculum_ids);
  IF missing > 0 THEN RAISE EXCEPTION '% lesson(s) are missing or not in the A Level curriculum', missing; END IF;
END $$;''',
    '',
]
for qn in questions:
    out.append(
        'INSERT INTO problems (id, chapter_id, topic_id, curriculum_id, topic_code, syllabus_cite, problem_number, "order", '
        'question_text, question_image_url, difficulty_level, answer_type, answer_correct, answer_unit, answer_tolerance, '
        'answer_sign_sensitive, explanation, points) VALUES ('
        f"{q(qn['id'])}, {q(qn['chapter'])}, {q(qn['topic'])}, {q(qn['curriculum'])}, {q(qn['code'])}, {q(qn['cite'])}, "
        f"{qn['number']}, {qn['number']}, {q(qn['text'])}, {opt(qn['figure'])}, {qn['difficulty']}, {q(qn['type'])}::answer_type, "
        f"{q(qn['answer'])}, {opt(qn['unit'])}, {qn['tolerance'] if qn['tolerance'] is not None else 'NULL'}, "
        f"{'true' if qn['sign'] else 'false'}, {q(qn['explanation'])}, {min(qn['difficulty'], 3)}) ON CONFLICT (id) DO NOTHING;")
    if qn['options']:
        for i, (text, ok) in enumerate(qn['options']):
            oid = uid(f"option/{qn['id']}/{i}")
            out.append(
                'INSERT INTO problem_options (id, problem_id, option_text, option_letter, is_correct, "order") VALUES ('
                f"{q(oid)}, {q(qn['id'])}, {q(text)}, {q('ABCD'[i])}, {'true' if ok else 'false'}, {i + 1}) ON CONFLICT (id) DO NOTHING;")
out.append('')
out.append('-- Every question must belong to a curriculum its lesson serves.')
out.append('''DO $$
DECLARE bad INT;
BEGIN
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
        json.dump(questions, fh, ensure_ascii=False, indent=1)

print(f'{len(questions)} questions: {bank_sizes}', file=sys.stderr)
