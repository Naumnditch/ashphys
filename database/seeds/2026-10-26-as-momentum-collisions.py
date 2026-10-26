"""Usage: python3 database/seeds/2026-10-26-as-momentum-collisions.py \
    database/seeds/2026-10-26-as-momentum-collisions.sql \
    components/practice/momentumBankDiagramData.ts [--json out.json]

AS Level (Cambridge 9702) coursebook Chapter 6 "Momentum": a fresh,
tier-ordered 20-question (Q1-Q20) AS bank for three lessons, in the order the
owner asked for ("start with normal momentum, include creative ideas, then
jump into collisions"):

  6.1 The idea of momentum                    p = mv, vector sign, change in
                                              momentum, p and Ek, creative contexts
  6.2 Conservation of momentum and collisions sticking, bouncing, recoil,
                                              unknown masses, crash reconstruction
  6.3 Understanding collisions                elastic / inelastic, KE lost,
                                              relative speed of approach =
                                              separation, ballistic pendulum,
                                              neutron moderation, stacked-ball drop

Tiers, in order within each lesson (same scheme as the AS Kinematics banks):
  Q1-Q6   Foundation    (difficulty_level 1, 1 mark)
  Q7-Q13  Intermediate  (difficulty_level 2, 2 marks)
  Q14-Q18 Challenging   (difficulty_level 3, multi-part, 3-5 marks)
  Q19-Q20 Stretch       (difficulty_level 4, 9702 Paper 2/4 style, 5-6 marks)

Every numeric answer and every number quoted in a worked explanation is
computed here from the question's own values (never hand-typed), and every
figure is generated from those same values into momentumBankDiagramData.ts,
rendered by components/practice/MomentumBankDiagrams.tsx. g = 9.81 m s⁻²,
right (or the stated direction) positive.

These three lessons already had small AS banks (6, 8 and 6 rows, no attempts,
no submissions, no Q&A threads, no quiz links as of 2026-10-26). A DELETE
against the live problems table hangs in this environment (PROJECT_STATUS,
"Known gotchas"), so those rows are overwritten in place: each existing row is
reused by a new question OF THE SAME answer_type (so a reused multiple-choice
row keeps its four option rows, overwritten, and a numeric row never inherits
stray options), and only the surplus is a fresh INSERT with a uuid5 id.
Re-running the SQL is a no-op.
"""
import json
import sys
import uuid
from math import pi, sqrt

G = 9.81  # m s^-2


def uid(name):
    return str(uuid.uuid5(uuid.NAMESPACE_URL, f'ashphys/{name}'))


SUP = str.maketrans('-0123456789', '⁻⁰¹²³⁴⁵⁶⁷⁸⁹')


def sf(x, n=3):
    """Formats x to n significant figures the way a worked solution would write it."""
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
    """The answer_correct value, plain ASCII, as precise as sf() but parseable."""
    if x == 0:
        return '0'
    neg = x < 0
    x = abs(x)
    e = int(f'{x:e}'.split('e')[1])
    trim = lambda s: s.rstrip('0').rstrip('.') if '.' in s else s
    out = trim(f'{x:.{max(n - 1 - e, 0)}f}') if -3 <= e < 5 else f"{trim(f'{x / 10**e:.{n - 1}f}')}e{e}"
    return f'-{out}' if neg else out


def round_sf(x, n):
    if x == 0:
        return 0.0
    e = int(f'{abs(x):e}'.split('e')[1])
    return round(x, n - 1 - e)


def q(s):
    s = str(s)
    # A literal ';' anywhere in the SQL text (even inside quotes) hangs the
    # Supabase SQL tool here, so route it through chr(59) concatenation.
    if ';' not in s:
        return "'" + s.replace("'", "''") + "'"
    parts = s.split(';')
    return '(' + " || chr(59) || ".join("'" + p.replace("'", "''") + "'" for p in parts) + ')'


def opt(v):
    return 'NULL' if v is None else (q(v) if isinstance(v, str) else str(v))


def b(v):
    return 'true' if v else 'false'


MS = 'm s⁻¹'
KMS = 'kg m s⁻¹'
CHAPTER = '4fb48180-724d-4250-acde-e3277c2c9ed6'

LESSONS = {
    '6.1': dict(topic='196ffab0-6cca-4898-8909-a56000ff9fd7', title='The idea of momentum'),
    '6.2': dict(topic='42c67aa7-36ea-56ea-881a-771edd16371c', title='Conservation of momentum and collisions'),
    '6.3': dict(topic='ac47b348-a080-47b5-a3b9-a2a40915eb56', title='Understanding collisions'),
}

# Existing AS rows (queried live 2026-10-26, ordered by problem_number), reused in place.
EXISTING = {
    '6.1': [
        {'id': '0c5ab716-adef-45c9-8552-dce792d7c57f', 'type': 'numeric'},
        {'id': '49b7f02b-4edc-4d85-bb9d-78e67c1461c9', 'type': 'numeric'},
        {'id': 'c73f86c3-0b06-49b9-820c-de2d4b88efea', 'type': 'numeric'},
        {'id': '81db1a0f-7046-4b02-8cf6-11b8622053d8', 'type': 'numeric'},
        {'id': '4e0a0da9-4d86-4fab-b7a6-14336c22548e', 'type': 'numeric'},
        {'id': '63c610b2-0197-4735-96d1-82a63aa4efbb', 'type': 'multiple_choice', 'options': [
            '54698210-6e2d-4bcb-8829-6ea60079c4a9', 'db36a3b8-09c2-4d20-8a3a-6cfffd3a5a82',
            'b61d39e9-e0c2-4b1e-91c4-fca5f3f2db17', '0f5402a2-7695-40b7-8d3b-b366617ee0fa']},
    ],
    '6.2': [
        {'id': '1bd9e80f-574a-4f8d-b0ae-314f47aeb4a4', 'type': 'numeric'},
        {'id': 'fc896940-00cb-471c-a03b-ee19dce109ed', 'type': 'numeric'},
        {'id': 'dd5f8c99-8730-4418-b2b3-9243c737af4f', 'type': 'numeric'},
        {'id': '46f89dd8-9b4b-4996-8c2a-4a22888055cf', 'type': 'numeric'},
        {'id': 'ceacc00b-45f3-4fb6-9d0e-312d622d7fa7', 'type': 'multiple_choice', 'options': [
            'ab714c98-fbeb-4f32-b606-2b5dfdbbc210', '95f957e8-cf22-4c78-b1a9-10293451348c',
            '0f5e32b8-dca5-4257-b71a-483aa3d3447e', '404df94c-c228-4c82-9dd6-7afb4558362d']},
        {'id': '20a07229-d500-41da-8a4b-048d76d04726', 'type': 'multiple_choice', 'options': [
            'f377cc0c-fc5a-42ab-866f-8582bf9b5dcf', '6497ae06-13d5-4acf-8dd6-94d8f3a97ade',
            'a1b68b04-23d7-41ee-a262-2a984237017b', 'aeb892f2-9c3d-47da-9b88-bac08e49938d']},
        {'id': 'c5c1f907-6937-4293-9a88-5f2618ec0a32', 'type': 'numeric'},
        {'id': 'd27334c0-2b90-478f-9932-8974e2a1e0d7', 'type': 'multiple_choice', 'options': [
            'f66f17b6-a982-4be4-86cb-8ace8d1fcab9', 'e1d628b0-a764-43c4-affe-5048d814fa37',
            '51803727-c8a7-4a2f-a3cd-75bb934f7012', 'acdfd30a-7071-4145-9e40-800f9d0eda9e']},
    ],
    '6.3': [
        {'id': '813fbd8d-8f13-47e2-a168-f1db25c9f36e', 'type': 'numeric'},
        {'id': 'cd4ed4b8-4fd9-414e-b8cc-d0a8b223975f', 'type': 'numeric'},
        {'id': '4b74f3fa-23a0-4cd7-b5e8-884edb38b15a', 'type': 'numeric'},
        {'id': 'a0a3d99a-f564-48d7-b7c9-5331f9914e1c', 'type': 'numeric'},
        {'id': '0a6db659-eca3-44af-bfda-fde05341be07', 'type': 'multiple_choice', 'options': [
            '7025503a-7757-4ea4-b9d4-470e3124323c', 'e33f1e35-94dc-4e7e-8985-b6f6b2f155d2',
            'c96771fb-3312-455b-ac8e-767c83d354d5', 'eefd4ad3-2d21-4023-8686-37194dd391bd']},
        {'id': '21289c9c-721c-4376-a974-4352171631f3', 'type': 'multiple_choice', 'options': [
            'ba7f123a-3527-44d2-800c-928f42f1da21', '89457bfd-17ed-4bc8-9afb-ca2c3068a6f2',
            '0462fe49-1333-4d2c-9b6a-d046cb6ad819', '10902dd6-e1ec-4212-8a8d-3f4ce5eb0ebe']},
    ],
}

TIER_DIFF = {'F': 1, 'I': 2, 'C': 3, 'S': 4}
TIER_RANGE = {'F': range(1, 7), 'I': range(7, 14), 'C': range(14, 19), 'S': range(19, 21)}

questions = []
diagrams = {}
counters = {}


def fig(code, slug, kind, **props):
    key = f'mom6-{code.replace(".", "-")}-{slug}'
    assert key not in diagrams, key
    diagrams[key] = dict(kind=kind, props=props)
    return f'diagram:{key}'


def body(mass, dir, v=None, unknown=False, shape='trolley', name=None, w=None):
    d = dict(mass=mass, dir=dir)
    if v is not None:
        d['v'] = v
    if unknown:
        d['unknown'] = True
        d.setdefault('v', '?')
    if shape != 'trolley':
        d['shape'] = shape
    if name:
        d['name'] = name
    if w:
        d['w'] = w
    return d


def add(code, tier, text, explanation, answer=None, unit=None, figure=None,
        kind='numeric', options=None, correct_idx=0, tolerance=None,
        sign_sensitive=False, marks=None):
    L = LESSONS[code]
    n = counters[code] = counters.get(code, 0) + 1
    assert n in TIER_RANGE[tier], f'{code} #{n}: tier {tier} does not cover slot {n}'
    assert 'Common mistake:' in explanation, f'{code} #{n}: explanation must end with a common mistake'
    default_marks = {'F': 1, 'I': 2, 'C': 4, 'S': 6}[tier]
    row = dict(
        id=uid(f'problem/as/momentum-2026-10-26/{L["topic"]}/{n}'),
        topic=L['topic'], chapter=CHAPTER, code=code,
        cite=f'9702 coursebook {code} · {L["title"]}', number=n, text=text, figure=figure,
        kind=kind, difficulty=TIER_DIFF[tier], tier=tier,
        marks=marks if marks is not None else default_marks, explanation=explanation,
    )
    if kind == 'numeric':
        assert answer is not None
        # A Cambridge-style 2 s.f. answer must still grade correct: widen the default
        # 2% window to 5% whenever rounding to 2 s.f. alone moves the value by > 1.8%.
        if tolerance is None and answer != 0:
            if abs(round_sf(answer, 2) - answer) / abs(answer) > 0.018:
                tolerance = 0.05
        row.update(answer=stored(answer), unit=unit, tolerance=tolerance, sign=sign_sensitive, value=answer)
    else:
        assert options and len(options) == 4, f'{code} #{n}: MCQ needs exactly 4 options'
        assert len(set(options)) == 4
        # The practice page shows options in stored order, so spread the correct
        # letter evenly and deterministically (C, A, D, B, C, ...) instead of always A.
        n_mcq = sum(1 for x in questions if x['kind'] == 'multiple_choice')
        target = (2, 0, 3, 1)[n_mcq % 4]
        right = options[correct_idx]
        others = [o for i, o in enumerate(options) if i != correct_idx]
        options = others[:target] + [right] + others[target:]
        row.update(options=options, correct_idx=target, answer=right)
    questions.append(row)
    return row


# ════════════════════════════════════════════════════════════════════════
# 6.1 The idea of momentum — "normal" momentum, with creative contexts
# ════════════════════════════════════════════════════════════════════════

add('6.1', 'F', 'Which of these is a correct SI unit for momentum?',
    'Momentum p = mv, so its unit is kg × m s⁻¹ = kg m s⁻¹. (This is the same as N s, because 1 N = 1 kg m s⁻².) Common mistake: writing kg m s⁻², which is the unit of FORCE (mass × acceleration), not momentum.',
    kind='multiple_choice',
    options=['kg m s⁻¹', 'kg m s⁻²', 'kg m² s⁻²', 'N s⁻¹'])

p = 55 * 28
add('6.1', 'F', f'A cheetah of mass 55 kg sprints at 28 {MS}. Calculate the magnitude of its momentum.',
    f'p = mv = 55 × 28 = {sf(p)} {KMS}. Common mistake: using ½mv² (kinetic energy) instead of mv.',
    answer=p, unit='kg m/s',
    figure=fig('6.1', 'q2', 'collision', before=[body('55 kg', 1, f'28 {MS}', shape='block', name='cheetah')]))

m_bee = 0.10e-3
p = m_bee * 7.0
add('6.1', 'F', f'A honeybee of mass 0.10 g flies at 7.0 {MS}. Calculate its momentum.',
    f'Convert the mass to kilograms first: 0.10 g = 0.10 × 10⁻³ kg = 1.0 × 10⁻⁴ kg. Then p = mv = 1.0 × 10⁻⁴ × 7.0 = {sf(p, 2)} {KMS}. Common mistake: leaving the mass in grams, which gives an answer 1000 times too large (0.70).',
    answer=p, unit='kg m/s')

v = 46 / 20
add('6.1', 'F', f'A curling stone of mass 20 kg slides across the ice with a momentum of 46 {KMS}. Calculate its speed.',
    f'Rearrange p = mv: v = p ÷ m = 46 ÷ 20 = {sf(v, 2)} {MS}. Common mistake: multiplying instead of dividing (46 × 20 = 920).',
    answer=v, unit='m/s',
    figure=fig('6.1', 'q4', 'collision', before=[body('20 kg', 1, '?', unknown=True, shape='puck', name='curling stone')], surface='ice', note=f'p = 46 {KMS}'))

add('6.1', 'F', f'A ball moves east at 4.0 {MS}. A moment later it moves west at 4.0 {MS}. Which statement is correct?',
    'Momentum is a vector: it has the direction of the velocity. The SIZE of the momentum is the same, but its direction has reversed, so the momentum has changed (taking east as positive it went from +4m to −4m). Common mistake: thinking that "same speed" means "same momentum" — that is only true for a scalar like kinetic energy.',
    kind='multiple_choice',
    options=['Its momentum has changed, because its direction has changed',
             'Its momentum is unchanged, because its speed is unchanged',
             'Its momentum has become zero',
             'Its kinetic energy has changed, but its momentum has not'])

m = 0.050 / 25
add('6.1', 'F', f'A hailstone falls at 25 {MS} with a momentum of 0.050 {KMS}. Calculate its mass.',
    f'm = p ÷ v = 0.050 ÷ 25 = {sf(m, 2)} kg (that is {sf(m * 1000, 2)} g). Common mistake: dividing the speed by the momentum (25 ÷ 0.050 = 500), which gives an impossibly heavy hailstone — always sense-check the size of your answer.',
    answer=m, unit='kg')

# ── Intermediate ──
dp = 0.057 * (30 + 22)
add('6.1', 'I', f'A tennis ball of mass 57 g hits a wall at 30 {MS} and rebounds along the same line at 22 {MS}. Calculate the magnitude of the change in its momentum.',
    f'Take towards the wall as positive. Initial p = 0.057 × (+30) = +{sf(0.057 * 30)} {KMS}. Final p = 0.057 × (−22) = −{sf(0.057 * 22)} {KMS}. Change = final − initial = −{sf(0.057 * 22)} − {sf(0.057 * 30)} = −{sf(dp)} {KMS}, so the magnitude is {sf(dp)} {KMS}. Common mistake: subtracting the speeds (30 − 22 = 8) and getting 0.46 — the ball reverses, so the speeds ADD.',
    answer=dp, unit='kg m/s',
    figure=fig('6.1', 'q7', 'collision', before=[body('57 g', 1, f'30 {MS}', shape='ball')], after=[body('57 g', -1, f'22 {MS}', shape='ball')], wall=True, note='towards the wall positive'))

p_car, p_lorry = 1200 * 15, 9000 * 2.5
total = p_car - p_lorry
add('6.1', 'I', f'A car of mass 1200 kg travels north at 15 {MS}. A lorry of mass 9000 kg travels south at 2.5 {MS}. Calculate the magnitude of the total momentum of the car and lorry together.',
    f'Take north as positive. Car: +1200 × 15 = +{sf(p_car)} {KMS}. Lorry: 9000 × (−2.5) = −{sf(p_lorry)} {KMS}. Total = {sf(p_car)} − {sf(p_lorry)} = {sf(total)} {KMS}: a magnitude of {sf(abs(total))} {KMS}, directed SOUTH (the slow lorry has more momentum than the fast car). Common mistake: adding the two magnitudes (40 500) as if momentum were a scalar.',
    answer=abs(total), unit='kg m/s',
    figure=fig('6.1', 'q8', 'collision', before=[body('1200 kg', 1, f'15 {MS}', shape='car', name='car (north)'), body('9000 kg', -1, f'2.5 {MS}', shape='block', name='lorry (south)', w=96)], note='north drawn to the right'))

pb, pball = 0.010 * 400, 1.0 * 4.0
keb, keball = 0.5 * 0.010 * 400**2, 0.5 * 1.0 * 4.0**2
add('6.1', 'I', f'A bullet of mass 10 g moves at 400 {MS}. A ball of mass 1.0 kg moves at 4.0 {MS}. Which statement is correct?',
    f'Momentum: bullet 0.010 × 400 = {sf(pb, 2)} {KMS}, ball 1.0 × 4.0 = {sf(pball, 2)} {KMS} — exactly equal. Kinetic energy: bullet ½ × 0.010 × 400² = {sf(keb)} J, ball ½ × 1.0 × 4.0² = {sf(keball, 2)} J. Same momentum, but the bullet carries 100 times the energy, because Ek = p²/2m and the bullet\'s mass is 100 times smaller. That is why the bullet does far more damage. Common mistake: assuming equal momentum means equal kinetic energy.',
    kind='multiple_choice',
    options=['They have equal momentum, but the bullet has 100 times more kinetic energy',
             'They have equal momentum and equal kinetic energy',
             'The bullet has 100 times more momentum than the ball',
             'The ball has more momentum, because it is heavier'],
    figure=fig('6.1', 'q9', 'lineup', items=[dict(name='bullet', mass='10 g', speed=f'400 {MS}'), dict(name='ball', mass='1.0 kg', speed=f'4.0 {MS}')]))

p = sqrt(2 * 0.16 * 72)
add('6.1', 'I', 'A cricket ball of mass 0.16 kg has kinetic energy 72 J. Calculate its momentum.',
    f'Ek = ½mv² and p = mv combine to Ek = p²/2m, so p = √(2mEk) = √(2 × 0.16 × 72) = √{sf(2 * 0.16 * 72, 4)} = {sf(p, 2)} {KMS}. (Check: v = p/m = {sf(p / 0.16, 2)} {MS}, and ½ × 0.16 × {sf(p / 0.16, 2)}² = 72 J.) Common mistake: forgetting the factor 2, giving √(0.16 × 72) = 3.4.',
    answer=p, unit='kg m/s')

v = 0.45 * 20 / 5.0
add('6.1', 'I', f'A bowling ball of mass 5.0 kg and a football of mass 0.45 kg have the same momentum. The football moves at 20 {MS}. Calculate the speed of the bowling ball.',
    f'Momentum of the football = 0.45 × 20 = {sf(0.45 * 20, 2)} {KMS}. The bowling ball has the same momentum, so v = {sf(0.45 * 20, 2)} ÷ 5.0 = {sf(v, 2)} {MS}. Common mistake: assuming equal momentum means equal speed.',
    answer=v, unit='m/s',
    figure=fig('6.1', 'q11', 'collision', before=[body('5.0 kg', 1, '?', unknown=True, shape='ball', name='bowling ball', w=46), body('0.45 kg', 1, f'20 {MS}', shape='ball', name='football', w=30)], note='same momentum'))

add('6.1', 'I', 'A ball is thrown vertically upwards. What is its momentum at the very top of its flight?',
    'At the highest point the ball is instantaneously at rest (v = 0), so p = mv = 0. Its acceleration is still g downwards there, so its momentum immediately starts to grow again, now downwards. Common mistake: confusing "momentum is zero" with "force is zero" — gravity still acts at the top.',
    kind='multiple_choice',
    options=['Zero', 'Its maximum value', 'Equal to its weight, mg', 'The same as when it was thrown'])

factor = 3**2
add('6.1', 'I', 'The momentum of a car increases by a factor of 3. Its mass does not change. By what factor does its kinetic energy increase?',
    f'With m fixed, p = mv means v also triples. Ek = ½mv² ∝ v², so Ek increases by 3² = {factor}. Equivalently, Ek = p²/2m ∝ p². Common mistake: answering 3, as if kinetic energy were proportional to momentum.',
    answer=factor)

# ── Challenging ──
grad = 2.4 / 3.0
p_half = grad * 1.5
v_half = p_half / 0.80
add('6.1', 'C', 'The graph shows how the momentum of a 0.80 kg trolley changes as it is pushed from rest. (a) Calculate the maximum speed of the trolley. (b) Calculate the speed of the trolley at t = 1.5 s. (c) State what the gradient of the first section of the graph represents. Give only the answer to (b).',
    f'(a) Maximum p = 2.4 {KMS}, so v_max = 2.4 ÷ 0.80 = {sf(2.4 / 0.80, 2)} {MS}. (b) The momentum rises at a constant rate, gradient = 2.4 ÷ 3.0 = {sf(grad, 2)} {KMS} per second, so at 1.5 s p = {sf(grad, 2)} × 1.5 = {sf(p_half, 2)} {KMS} and v = {sf(p_half, 2)} ÷ 0.80 = {sf(v_half, 2)} {MS}. (c) The gradient is the rate of change of momentum, which equals the resultant force on the trolley ({sf(grad, 2)} N here). Common mistake: reading the momentum (1.2) off the graph and giving that as the speed, forgetting to divide by the mass.',
    answer=v_half, unit='m/s', marks=4,
    figure=fig('6.1', 'q14', 'graph', points=[dict(t=0, y=0), dict(t=3, y=2.4), dict(t=5, y=2.4)], xLabel='t', yLabel='p', xUnit='s', yUnit=KMS, yMax=3.0, xMax=5))

r, T = 1.50e11, 365.25 * 24 * 3600
v_e = 2 * pi * r / T
p_e = 5.97e24 * v_e
add('6.1', 'C', 'The Earth (mass 5.97 × 10²⁴ kg) moves in an approximately circular orbit of radius 1.50 × 10¹¹ m around the Sun, taking 365.25 days per orbit. (a) Calculate the Earth\'s orbital speed. (b) Calculate the magnitude of the Earth\'s momentum. (c) Explain why the Earth\'s momentum is NOT constant, even though its speed is. Give only the answer to (b).',
    f'(a) T = 365.25 × 24 × 3600 = {sf(T, 4)} s. v = 2πr/T = 2π × 1.50 × 10¹¹ ÷ {sf(T, 4)} = {sf(v_e)} {MS}. (b) p = mv = 5.97 × 10²⁴ × {sf(v_e)} = {sf(p_e)} {KMS}. (c) Momentum is a vector. The Earth\'s direction of motion changes continuously around the orbit, so its momentum changes direction (the Sun\'s gravitational pull is the force causing this change). Common mistake: using the time in days, not seconds, which makes v 86 400 times too large.',
    answer=p_e, unit='kg m/s', marks=4)

v1 = sqrt(2 * G * 1.8)
v2 = sqrt(2 * G * 1.25)
dp = 0.050 * (v1 + v2)
add('6.1', 'C', 'A 50 g ball is dropped from a height of 1.80 m onto a hard floor and rebounds to a height of 1.25 m. Air resistance is negligible. (a) Calculate the speed of the ball just before it hits the floor. (b) Calculate the speed just after it leaves the floor. (c) Calculate the magnitude of the change in momentum of the ball during the bounce. Give only the answer to (c).',
    f'(a) v = √(2gh) = √(2 × 9.81 × 1.80) = {sf(v1)} {MS} (downwards). (b) v = √(2 × 9.81 × 1.25) = {sf(v2)} {MS} (upwards). (c) Take up as positive: Δp = m(v_after − v_before) = 0.050 × ({sf(v2)} − (−{sf(v1)})) = 0.050 × {sf(v1 + v2)} = {sf(dp)} {KMS}. Common mistake: using 0.050 × ({sf(v1)} − {sf(v2)}) = {sf(0.050 * (v1 - v2), 2)}, ignoring the reversal of direction.',
    answer=dp, unit='kg m/s', marks=4,
    figure=fig('6.1', 'q16', 'drop', h1=1.80, h2=1.25, h1Label='1.80 m', h2Label='1.25 m', ballLabel='50 g'))

items = [('small car', 900, 1.0), ('sprinter', 80, 10), ('cyclist + bike', 95, 8.0), ('ice-hockey puck', 0.17, 45)]
mom = {n: m_ * v_ for n, m_, v_ in items}
order = sorted(mom, key=mom.get, reverse=True)
add('6.1', 'C', 'Which of the four objects shown would be hardest to stop in a given time? Choose the list that orders them from LARGEST to SMALLEST momentum.',
    f'Momentum decides how hard an object is to stop in a given time (the force needed is Δp/Δt). Car: 900 × 1.0 = {sf(mom["small car"])} {KMS}. Sprinter: 80 × 10 = {sf(mom["sprinter"])} {KMS}. Cyclist: 95 × 8.0 = {sf(mom["cyclist + bike"])} {KMS}. Puck: 0.17 × 45 = {sf(mom["ice-hockey puck"])} {KMS}. Order: {", ".join(order)}. The slow-rolling car beats the sprinter. Common mistake: ranking by speed (puck first) or by mass alone.',
    kind='multiple_choice', marks=3,
    options=['small car, sprinter, cyclist + bike, ice-hockey puck',
             'ice-hockey puck, sprinter, cyclist + bike, small car',
             'small car, cyclist + bike, sprinter, ice-hockey puck',
             'sprinter, cyclist + bike, small car, ice-hockey puck'],
    figure=fig('6.1', 'q17', 'lineup', items=[dict(name=n, mass=f'{ml} kg', speed=f'{vl} {MS}') for (n, _, _), ml, vl in zip(items, ['900', '80', '95', '0.17'], ['1.0', '10', '8.0', '45'])]))
assert order == ['small car', 'sprinter', 'cyclist + bike', 'ice-hockey puck']

v3 = (0.15 - 0.20 * 0.60 - 0.30 * (-0.40)) / 0.50
add('6.1', 'C', f'Three gliders move along a straight air track. Glider A (0.20 kg) moves at +0.60 {MS}, glider B (0.30 kg) moves at −0.40 {MS} and glider C (0.50 kg) moves with an unknown velocity. The total momentum of the three gliders is +0.15 {KMS}. (a) Show that the momenta of A and B cancel. (b) Calculate the velocity of C, including its sign.',
    f'(a) A: 0.20 × 0.60 = +{sf(0.12, 2)} {KMS}. B: 0.30 × (−0.40) = −{sf(0.12, 2)} {KMS}. They add to zero. (b) So all of the total momentum belongs to C: 0.50 × v = +0.15, v = +{sf(v3, 2)} {MS} (in the positive direction). Common mistake: adding the magnitudes of A and B (0.24) and getting a negative velocity for C.',
    answer=v3, unit='m/s', sign_sensitive=True, marks=3,
    figure=fig('6.1', 'q18', 'collision', before=[body('A 0.20 kg', 1, f'0.60 {MS}'), body('B 0.30 kg', -1, f'0.40 {MS}'), body('C 0.50 kg', 1, '?', unknown=True)], note='right is positive'))

# ── Stretch ──
P = 3.0e4
ek_car, ek_truck = P**2 / (2 * 1500), P**2 / (2 * 6000)
F = 7500
d_car, d_truck = ek_car / F, ek_truck / F
t_stop = P / F
add('6.1', 'S', f'(a) Show that the kinetic energy of an object of mass m and momentum p is Ek = p²/2m. A car of mass 1500 kg and a truck of mass 6000 kg each have momentum 3.0 × 10⁴ {KMS}. Both brake with the same constant braking force, 7500 N. (b) Calculate the kinetic energy of each. (c) Calculate the stopping distance of the car. (d) Show that both take the same time to stop. Give only the answer to (c).',
    f'(a) Ek = ½mv² = ½m(p/m)² = p²/2m. (b) Car: (3.0 × 10⁴)² ÷ (2 × 1500) = {sf(ek_car)} J. Truck: (3.0 × 10⁴)² ÷ (2 × 6000) = {sf(ek_truck)} J. (c) The braking force does work F × d = Ek, so d = {sf(ek_car)} ÷ 7500 = {sf(d_car, 2)} m (the truck needs only {sf(d_truck, 2)} m). (d) Force = rate of change of momentum, so t = Δp ÷ F = 3.0 × 10⁴ ÷ 7500 = {sf(t_stop, 2)} s for BOTH. Same momentum and same force means the same stopping TIME, but the lighter car, with four times the kinetic energy, travels four times as far. Common mistake: assuming equal momentum means equal stopping distance.',
    answer=d_car, unit='m', marks=6,
    figure=fig('6.1', 'q19', 'lineup', items=[dict(name='car', mass='1500 kg', speed='?'), dict(name='truck', mass='6000 kg', speed='?')], caption=f'both: p = 3.0 × 10⁴ {KMS}, braking force 7500 N'))

pA, EA = 6.0, 15.0
vA = 2 * EA / pA
mA = pA**2 / (2 * EA)
mB = (2 * pA)**2 / (2 * (EA / 2))
add('6.1', 'S', f'A sensor measures only the momentum and the kinetic energy of objects rolling past it. (a) Object X has momentum 6.0 {KMS} and kinetic energy 15 J. Without being given either its mass or its speed, deduce its speed and its mass. (b) Object Y has TWICE the momentum of X but HALF its kinetic energy. Calculate the mass of Y. Give only the answer to (b).',
    f'(a) Ek = ½mv² = ½(mv)v = ½pv, so v = 2Ek/p = 2 × 15 ÷ 6.0 = {sf(vA, 2)} {MS}, and m = p/v = 6.0 ÷ {sf(vA, 2)} = {sf(mA, 2)} kg (check: Ek = p²/2m = 36 ÷ 2.4 = 15 J). (b) m = p²/2Ek = (12)² ÷ (2 × 7.5) = 144 ÷ 15 = {sf(mB, 2)} kg — eight times the mass of X, because m ∝ p²/Ek and (2²) ÷ (½) = 8. Common mistake: assuming that doubling p and halving Ek simply doubles or halves the mass.',
    answer=mB, unit='kg', marks=6)


# ════════════════════════════════════════════════════════════════════════
# 6.2 Conservation of momentum and collisions
# ════════════════════════════════════════════════════════════════════════

add('6.2', 'F', 'Which statement is the principle of conservation of momentum?',
    'The total momentum of a system of interacting objects stays constant, provided no resultant external force acts on the system. It holds for every collision and explosion, elastic or not. Common mistake: thinking each object keeps its own momentum, or that momentum is conserved only in elastic collisions.',
    kind='multiple_choice',
    options=['The total momentum of a system remains constant, provided no resultant external force acts on it',
             'The momentum of each object in a collision remains constant',
             'Momentum is conserved only when a collision is elastic',
             'The total kinetic energy of a system remains constant in a collision'])

v = 0.50 * 4.0 / 2.0
add('6.2', 'F', f'A trolley of mass 0.50 kg moving at 4.0 {MS} collides with a stationary trolley of mass 1.5 kg. They stick together. Calculate their speed after the collision.',
    f'Momentum before = 0.50 × 4.0 + 1.5 × 0 = {sf(2.0, 2)} {KMS}. After, the combined mass is 2.0 kg: 2.0 × v = {sf(2.0, 2)}, so v = {sf(v, 2)} {MS}. Common mistake: dividing by 1.5 kg (only the second trolley) instead of the combined 2.0 kg.',
    answer=v, unit='m/s',
    figure=fig('6.2', 'q2', 'collision', before=[body('0.50 kg', 1, f'4.0 {MS}'), body('1.5 kg', 0)], after=[body('0.50 kg + 1.5 kg', 1, '?', unknown=True, w=130)]))

v = 30000 * 2.0 / 50000
add('6.2', 'F', f'A railway wagon of mass 30 000 kg rolls at 2.0 {MS} into a stationary wagon of mass 20 000 kg. The wagons couple together. Calculate their speed just after coupling.',
    f'Momentum before = 30 000 × 2.0 = {sf(60000)} {KMS}. After: 50 000 × v = 60 000, so v = {sf(v, 2)} {MS}. Common mistake: averaging the speeds ((2.0 + 0) ÷ 2 = 1.0) — this only works when the masses are equal.',
    answer=v, unit='m/s',
    figure=fig('6.2', 'q3', 'collision', before=[body('30 t', 1, f'2.0 {MS}', w=72), body('20 t', 0, w=60)], after=[body('30 t + 20 t', 1, '?', unknown=True, w=136)], note='1 t = 1000 kg'))

v = 60 * 2.5 / 75
add('6.2', 'F', f'Two ice skaters, of mass 60 kg and 75 kg, stand at rest facing each other and push apart. The 60 kg skater moves off at 2.5 {MS}. Calculate the speed of the 75 kg skater.',
    f'Total momentum before = 0, so after the push the momenta are equal and opposite: 60 × 2.5 = 75 × v, v = {sf(60 * 2.5)} ÷ 75 = {sf(v, 2)} {MS}, in the opposite direction. Common mistake: thinking the heavier skater moves faster because they "push harder" — the forces are equal and opposite (Newton\'s third law).',
    answer=v, unit='m/s',
    figure=fig('6.2', 'q4', 'collision', before=[body('60 kg', 0, shape='person'), body('75 kg', 0, shape='person')], after=[body('60 kg', -1, f'2.5 {MS}', shape='person'), body('75 kg', 1, '?', unknown=True, shape='person')], surface='ice'))

add('6.2', 'F', 'A ball is released and falls towards the ground, gaining momentum. Which statement explains why this does NOT break the principle of conservation of momentum?',
    'The ball on its own is not an isolated system: the Earth\'s gravitational pull is an external force on it. Take the ball AND the Earth as the system: the ball pulls the Earth up with an equal and opposite force, so the Earth gains an equal momentum upwards and the total stays zero. The Earth\'s huge mass means its velocity change is far too small to notice. Common mistake: concluding that momentum is not conserved when one object speeds up.',
    kind='multiple_choice',
    options=['The Earth gains an equal and opposite momentum, so the total momentum of ball + Earth is constant',
             'Momentum is only conserved in horizontal motion',
             'Gravity is not a force, so it cannot change momentum',
             'The ball loses potential energy, which balances the momentum gained'])

m2 = 2.0 * 3.0 / 1.2 - 2.0
add('6.2', 'F', f'A 2.0 kg trolley moving at 3.0 {MS} hits a stationary trolley and they stick together, moving at 1.2 {MS}. Calculate the mass of the second trolley.',
    f'Momentum before = 2.0 × 3.0 = {sf(6.0, 2)} {KMS}. After: (2.0 + m) × 1.2 = 6.0, so 2.0 + m = {sf(6.0 / 1.2, 2)} kg and m = {sf(m2, 2)} kg. Common mistake: giving 5.0 kg — that is the COMBINED mass, not the second trolley alone.',
    answer=m2, unit='kg',
    figure=fig('6.2', 'q6', 'collision', before=[body('2.0 kg', 1, f'3.0 {MS}'), body('m = ?', 0)], after=[body('2.0 kg + m', 1, f'1.2 {MS}', w=124)]))

# ── Intermediate ──
v = (1200 * 20 - 1600 * 12) / 2800
add('6.2', 'I', f'A car of mass 1200 kg travelling east at 20 {MS} collides head-on with a car of mass 1600 kg travelling west at 12 {MS}. The cars lock together. Taking east as positive, calculate their velocity just after the collision, including its sign.',
    f'Momentum before = 1200 × (+20) + 1600 × (−12) = {sf(24000)} − {sf(19200)} = +{sf(4800)} {KMS}. After: 2800 × v = 4800, v = +{sf(v)} {MS} (east). Common mistake: giving the westbound momentum a positive sign too, which gives 15.4 {MS}.',
    answer=v, unit='m/s', sign_sensitive=True,
    figure=fig('6.2', 'q7', 'collision', before=[body('1200 kg', 1, f'20 {MS}', shape='car'), body('1600 kg', -1, f'12 {MS}', shape='car')], after=[body('2800 kg', 1, '?', unknown=True, shape='car', w=120)], note='east (right) is positive'))

v2 = (0.30 * 5.0 - 0.30 * 1.0) / 0.20
add('6.2', 'I', f'An air-hockey puck of mass 0.30 kg moving at 5.0 {MS} hits a stationary puck of mass 0.20 kg head-on. After the collision the first puck continues in the same direction at 1.0 {MS}. Calculate the speed of the second puck.',
    f'Before: 0.30 × 5.0 = {sf(1.5, 2)} {KMS}. After: 0.30 × 1.0 + 0.20 × v = 1.5, so 0.20v = {sf(1.2, 2)} and v = {sf(v2, 2)} {MS}. Common mistake: forgetting the first puck still carries momentum after the collision (giving 7.5 {MS}).',
    answer=v2, unit='m/s',
    figure=fig('6.2', 'q8', 'collision', before=[body('0.30 kg', 1, f'5.0 {MS}', shape='puck'), body('0.20 kg', 0, shape='puck', w=38)], after=[body('0.30 kg', 1, f'1.0 {MS}', shape='puck'), body('0.20 kg', 1, '?', unknown=True, shape='puck', w=38)]))

v2 = (2.0 * 6.0 + 2.0 * 2.0) / 4.0
add('6.2', 'I', f'A 2.0 kg trolley moving at 6.0 {MS} hits a stationary 4.0 kg trolley. The 2.0 kg trolley rebounds at 2.0 {MS}. Calculate the speed of the 4.0 kg trolley after the collision.',
    f'Take the original direction as positive. Before: 2.0 × 6.0 = +{sf(12, 2)} {KMS}. After: 2.0 × (−2.0) + 4.0v = 12, so 4.0v = 12 + 4.0 = 16 and v = {sf(v2, 2)} {MS}. Common mistake: treating the rebound as +2.0 {MS}, which gives 2.0 {MS} — the minus sign matters.',
    answer=v2, unit='m/s',
    figure=fig('6.2', 'q9', 'collision', before=[body('2.0 kg', 1, f'6.0 {MS}'), body('4.0 kg', 0, w=76)], after=[body('2.0 kg', -1, f'2.0 {MS}'), body('4.0 kg', 1, '?', unknown=True, w=76)]))

v_ast = 1.5 * 6.0 / 85
t = 12 / v_ast
add('6.2', 'I', f'An astronaut of total mass 85 kg is floating at rest 12 m from her spacecraft, with a broken thruster. She throws a 1.5 kg wrench directly away from the spacecraft at 6.0 {MS}. Calculate how long it takes her to drift back to the spacecraft.',
    f'Total momentum before = 0. After: 85v = 1.5 × 6.0 = {sf(9.0, 2)} {KMS}, so she moves towards the spacecraft at v = 9.0 ÷ 85 = {sf(v_ast)} {MS}. Time = distance ÷ speed = 12 ÷ {sf(v_ast)} = {sf(t)} s (about two minutes). Common mistake: using the wrench\'s speed (6.0 {MS}) for the astronaut.',
    answer=t, unit='s',
    figure=fig('6.2', 'q10', 'collision', before=[body('85 kg', 0, shape='person', name='astronaut'), body('1.5 kg', 0, shape='block', w=30, name='wrench')], after=[body('85 kg', -1, '?', unknown=True, shape='person'), body('1.5 kg', 1, f'6.0 {MS}', shape='block', w=30)], titles=('BEFORE THE THROW', 'AFTER'), note='the spacecraft is 12 m to the left'))

add('6.2', 'I', 'A rifle "kicks" much less painfully when it is held tightly against the shoulder than when it is held loosely. Which explanation is correct?',
    'The bullet\'s forward momentum is fixed, so the rifle (plus whatever moves with it) must gain an equal backward momentum. Held tightly, the rifle and the shooter\'s body move together, so the recoiling mass is much larger and the recoil SPEED much smaller: the body is not hit by a fast-moving rifle. Common mistake: thinking holding tightly reduces the recoil momentum — it cannot, because momentum is conserved.',
    kind='multiple_choice',
    options=['The recoil momentum is shared by the rifle and the body together, so the recoil speed is much smaller',
             'Holding tightly reduces the momentum given to the bullet',
             'Holding tightly makes momentum not conserved',
             'The shoulder absorbs the bullet\'s kinetic energy'])

v = 0.012 * 350 / 2.012
add('6.2', 'I', f'A bullet of mass 12 g travelling at 350 {MS} embeds itself in a 2.0 kg wooden block resting on frictionless ice. Calculate the speed of the block (with the bullet inside) just afterwards.',
    f'Before: 0.012 × 350 = {sf(4.2, 2)} {KMS}. After, the mass is 2.0 + 0.012 = 2.012 kg: v = 4.2 ÷ 2.012 = {sf(v)} {MS}. Common mistake: leaving 12 g as 12 kg in the calculation.',
    answer=v, unit='m/s',
    figure=fig('6.2', 'q12', 'collision', before=[body('12 g', 1, f'350 {MS}', shape='ball', w=16), body('2.0 kg', 0, shape='block')], after=[body('2.012 kg', 1, '?', unknown=True, shape='block', w=72)], surface='ice'))

v = 4.0 * 6.0 / 54
add('6.2', 'I', f'A person of mass 50 kg stands on a stationary skateboard of negligible mass and catches a 4.0 kg medicine ball thrown horizontally at 6.0 {MS}. Calculate the speed at which the person, skateboard and ball move off.',
    f'Before: 4.0 × 6.0 = {sf(24, 2)} {KMS} (the person has none). After, everything moves together: (50 + 4.0)v = 24, so v = 24 ÷ 54 = {sf(v)} {MS}. Common mistake: dividing by 50 kg and forgetting that the ball is now moving with the person.',
    answer=v, unit='m/s',
    figure=fig('6.2', 'q13', 'collision', before=[body('4.0 kg', 1, f'6.0 {MS}', shape='ball', w=26), body('50 kg', 0, shape='person')], after=[body('54 kg', 1, '?', unknown=True, shape='person')]))

# ── Challenging ──
v1 = 1000 * 18 / 2200
v2 = 1000 * 18 / 3000
add('6.2', 'C', f'In a motorway pile-up, car A (1000 kg) travelling at 18 {MS} runs into stationary car B (1200 kg) and they lock together. The pair then runs into stationary car C (800 kg) and all three lock together. Ignore friction during the collisions. (a) Calculate the speed of A and B just after the first collision. (b) Calculate the speed of all three just after the second collision. (c) Explain why the answer to (b) can be found without the answer to (a). Give only the answer to (b).',
    f'(a) 1000 × 18 = 2200 × v₁, v₁ = {sf(v1)} {MS}. (b) The momentum is still {sf(18000)} {KMS}: 3000 × v₂ = 18 000, v₂ = {sf(v2, 2)} {MS}. (c) No external horizontal force acts at any stage, so the total momentum of the whole system (A + B + C) is the same at the end as at the start, whatever happens in between. Common mistake: carrying a rounded v₁ into part (b) and getting 5.98 or 6.02 instead of exactly 6.0.',
    answer=v2, unit='m/s', marks=4,
    figure=fig('6.2', 'q14', 'collision', before=[body('A 1000 kg', 1, f'18 {MS}', shape='car', w=96), body('B', 0, shape='car', w=64), body('C', 0, shape='car', w=56)], after=[body('A + B + C', 1, '?', unknown=True, shape='car', w=150)], titles=('BEFORE', 'AFTER BOTH COLLISIONS')))

v_after = 0.60 / 1.5
u_dart = v_after * 0.500 / 0.025
add('6.2', 'C', f'A student measures the speed of a toy dart. The 25 g dart is fired into a 0.475 kg trolley and sticks. Light gates show the trolley then covers 0.60 m in 1.5 s at constant speed. (a) Calculate the speed of the trolley after the impact. (b) Calculate the speed of the dart before the impact. Give only the answer to (b).',
    f'(a) v = 0.60 ÷ 1.5 = {sf(v_after, 2)} {MS}. (b) Combined mass = 0.025 + 0.475 = {sf(0.500, 2)} kg. Momentum after = 0.500 × {sf(v_after, 2)} = {sf(0.500 * v_after, 2)} {KMS}, which equals the dart\'s momentum before: u = {sf(0.500 * v_after, 2)} ÷ 0.025 = {sf(u_dart, 2)} {MS}. Common mistake: using the trolley\'s mass alone (0.475 kg) instead of trolley + dart.',
    answer=u_dart, unit='m/s', marks=3,
    figure=fig('6.2', 'q15', 'collision', before=[body('25 g', 1, '?', unknown=True, shape='ball', w=16), body('0.475 kg', 0)], after=[body('0.500 kg', 1, f'0.40 {MS}', w=80)]))

mB = (0.80 * 0.75 + 0.80 * 0.15) / 0.45
add('6.2', 'C', f'Trolley A (0.80 kg) moving at 0.75 {MS} collides with a stationary trolley B of unknown mass. After the collision A moves backwards at 0.15 {MS} and B moves forwards at 0.45 {MS}. (a) Write the momentum equation for the collision, with forwards positive. (b) Calculate the mass of B.',
    f'(a) 0.80 × 0.75 + 0 = 0.80 × (−0.15) + m_B × 0.45. (b) {sf(0.60, 2)} = −{sf(0.12, 2)} + 0.45 m_B, so 0.45 m_B = {sf(0.72, 2)} and m_B = {sf(mB, 2)} kg. Common mistake: writing A\'s final momentum as +0.12, which gives m_B = 1.1 kg.',
    answer=mB, unit='kg', marks=3,
    figure=fig('6.2', 'q16', 'collision', before=[body('A 0.80 kg', 1, f'0.75 {MS}'), body('B', 0)], after=[body('A', -1, f'0.15 {MS}'), body('B', 1, f'0.45 {MS}')]))

v = 40 * 3.0 / 50
add('6.2', 'C', f'A 40 kg cart rolls along a frictionless track at 3.0 {MS}. A 10 kg sack of sand is dropped vertically into the cart. (a) Calculate the speed of the cart after the sack lands in it. (b) Later, the sack falls straight down through a trapdoor in the floor of the moving cart. Calculate the speed of the cart after the sack has fallen out. Give only the answer to (b).',
    f'(a) The sack has no horizontal momentum, so horizontally: 40 × 3.0 = 50v, v = {sf(v, 2)} {MS}. (b) When the sack drops through the trapdoor it is moving horizontally with the cart, at {sf(v, 2)} {MS}, and it keeps that horizontal velocity as it leaves. Momentum after = 40v′ + 10 × {sf(v, 2)} = 50 × {sf(v, 2)}, so v′ = {sf(v, 2)} {MS}: the cart does NOT speed back up. Common mistake: expecting the cart to return to 3.0 {MS} once the extra mass is gone.',
    answer=v, unit='m/s', marks=4,
    figure=fig('6.2', 'q17', 'collision', before=[body('40 kg', 1, f'3.0 {MS}', w=86)], after=[body('40 kg + 10 kg', 1, '?', unknown=True, w=110)], titles=('BEFORE THE SACK LANDS', 'WITH THE SACK')))

vA = (55 * 4.0 + 65 * 3.0 - 65 * 6.0) / 55
add('6.2', 'C', f'In a speed-skating relay, skater A (55 kg) moving at 4.0 {MS} catches up with team-mate B (65 kg) moving at 3.0 {MS} in the same direction, and pushes B forwards. Just after the push, B moves at 6.0 {MS}. Friction is negligible. (a) Calculate the total momentum of the two skaters. (b) Calculate A\'s velocity just after the push.',
    f'(a) 55 × 4.0 + 65 × 3.0 = {sf(220)} + {sf(195)} = {sf(415)} {KMS}. (b) After: 55v_A + 65 × 6.0 = 415, so 55v_A = 415 − {sf(390)} = 25 and v_A = {sf(vA)} {MS} — still forwards, but much slower. Common mistake: assuming A must stop or move backwards after pushing.',
    answer=vA, unit='m/s', marks=3, sign_sensitive=True,
    figure=fig('6.2', 'q18', 'collision', before=[body('A 55 kg', 1, f'4.0 {MS}', shape='person'), body('B 65 kg', 1, f'3.0 {MS}', shape='person')], after=[body('A', 1, '?', unknown=True, shape='person'), body('B', 1, f'6.0 {MS}', shape='person')], surface='ice', note='forwards (right) is positive'))

# ── Stretch ──
M_tot = 60 + 20 + 3 * 5.0
v_after = []
mom, mass = 0.0, M_tot
for _ in range(3):
    mass -= 5.0
    v_new = (mom + 5.0 * 8.0) / mass
    v_after.append(v_new)
    mom = mass * v_new
v_final = v_after[-1]
assert abs(v_final - 3 * 5.0 * 8.0 / 80) < 1e-12
add('6.2', 'S', f'A 60 kg student sits on a 20 kg cart at rest on frictionless ice, holding three 5.0 kg bricks. She throws the bricks backwards one at a time, each at 8.0 {MS} relative to the ground. (a) Calculate the cart\'s speed after the first throw. (b) Calculate its speed after all three throws. (c) Show that the answer to (b) is the same as if she had thrown all three bricks together at 8.0 {MS}. Give only the answer to (b).',
    f'Forwards positive; the total momentum is zero throughout. (a) After throw 1: 90v₁ + 5.0 × (−8.0) = 0, v₁ = 40 ÷ 90 = {sf(v_after[0])} {MS}. (b) Throw 2: 90 × {sf(v_after[0])} = 85v₂ − 40, v₂ = {sf(v_after[1])} {MS}. Throw 3: 85 × {sf(v_after[1])} = 80v₃ − 40, v₃ = {sf(v_final, 2)} {MS}. (c) All three bricks end with momentum 3 × 5.0 × (−8.0) = −120 {KMS}, so the 80 kg student + cart must have +120: v = 120 ÷ 80 = {sf(v_final, 2)} {MS}, the same. (Because each speed is fixed relative to the GROUND, the order does not matter. A rocket is different: it ejects fuel at a fixed speed relative to ITSELF.) Common mistake: subtracting the mass of all three bricks before the first throw.',
    answer=v_final, unit='m/s', marks=6,
    figure=fig('6.2', 'q19', 'collision', before=[body('80 kg + 3 bricks', 0, shape='trolley', w=120)], after=[body('5.0 kg', -1, f'8.0 {MS}', shape='block', w=30), body('80 kg', 1, '?', unknown=True, w=96)], surface='ice', titles=('START', 'AFTER ALL THREE THROWS')))

a_skid = 6.5
v_common = sqrt(2 * a_skid * 9.0)
u_A = v_common * 2500 / 1100
add('6.2', 'S', f'Crash investigators reconstruct a rear-end collision. Car A (1100 kg) hit car B (1400 kg), which was stationary at traffic lights. The cars locked together and skidded 9.0 m to rest. Tests show that a skidding car on this road decelerates at 6.5 m s⁻². (a) Calculate the speed of the locked cars just after the impact. (b) Calculate the speed of car A just before the impact. (c) The speed limit is 50 km h⁻¹. Was car A speeding? Give only the answer to (b), in {MS}.',
    f'(a) Skidding to rest: v² = u² + 2as gives 0 = v² − 2 × 6.5 × 9.0, so v = √{sf(2 * a_skid * 9.0, 3)} = {sf(v_common)} {MS}. (b) Momentum is conserved in the impact (it is so brief that friction does not change it noticeably): 1100u = 2500 × {sf(v_common)}, u = {sf(u_A)} {MS}. (c) {sf(u_A)} {MS} × 3.6 = {sf(u_A * 3.6)} km h⁻¹: yes, well over 50 km h⁻¹. Common mistake: applying the skid to car A alone (1100 kg), or using the skid speed {sf(v_common)} {MS} as car A\'s speed.',
    answer=u_A, unit='m/s', marks=6,
    figure=fig('6.2', 'q20', 'collision', before=[body('A 1100 kg', 1, '?', unknown=True, shape='car'), body('B 1400 kg', 0, shape='car')], after=[body('A + B', 1, 'then skid 9.0 m', shape='car', w=140)], titles=('JUST BEFORE', 'JUST AFTER')))


# ════════════════════════════════════════════════════════════════════════
# 6.3 Understanding collisions — elastic, inelastic, relative speeds
# ════════════════════════════════════════════════════════════════════════

add('6.3', 'F', 'What is meant by an elastic collision?',
    'An elastic collision is one in which the total kinetic energy of the objects is the same after the collision as before. Momentum is conserved in EVERY collision, so that is not what makes it elastic. Common mistake: defining "elastic" as "momentum is conserved", or as "the objects bounce apart" (objects can bounce apart and still lose kinetic energy).',
    kind='multiple_choice',
    options=['A collision in which the total kinetic energy is conserved',
             'A collision in which momentum is conserved',
             'Any collision in which the objects bounce apart',
             'A collision in which the objects stick together'])

add('6.3', 'F', 'Which statement describes a perfectly inelastic collision?',
    'In a perfectly inelastic collision the objects stick together and move off with a common velocity. This loses the most kinetic energy that conservation of momentum allows (though not necessarily ALL of it). Common mistake: thinking all kinetic energy must be lost — the stuck-together objects usually keep moving.',
    kind='multiple_choice',
    options=['The objects stick together and move with a common velocity',
             'All of the kinetic energy is always lost',
             'Momentum is not conserved',
             'The objects separate with the same relative speed as they approached'])

ke_b = 0.5 * 2.0 * 3.0**2
ke_a = 0.5 * 3.0 * 2.0**2
add('6.3', 'F', f'A 2.0 kg trolley moving at 3.0 {MS} collides with a stationary 1.0 kg trolley. They stick together and move off at 2.0 {MS}. Calculate the kinetic energy lost in the collision.',
    f'KE before = ½ × 2.0 × 3.0² = {sf(ke_b, 2)} J. KE after = ½ × 3.0 × 2.0² = {sf(ke_a, 2)} J (use the combined mass). Lost = {sf(ke_b, 2)} − {sf(ke_a, 2)} = {sf(ke_b - ke_a, 2)} J. Common mistake: using 2.0 kg instead of the combined 3.0 kg after the collision.',
    answer=ke_b - ke_a, unit='J',
    figure=fig('6.3', 'q3', 'collision', before=[body('2.0 kg', 1, f'3.0 {MS}'), body('1.0 kg', 0, w=54)], after=[body('3.0 kg', 1, f'2.0 {MS}', w=120)]))

add('6.3', 'F', f'Ball A moves to the right at 5.0 {MS}. Ball B moves to the left at 2.0 {MS}, directly towards A. Calculate their relative speed of approach.',
    f'Moving towards each other, the speeds add: 5.0 + 2.0 = {sf(7.0, 2)} {MS}. (With right positive: 5.0 − (−2.0) = 7.0.) Common mistake: subtracting (5.0 − 2.0 = 3.0), which is the relative speed only when both move the SAME way.',
    answer=7.0, unit='m/s',
    figure=fig('6.3', 'q4', 'collision', before=[body('A', 1, f'5.0 {MS}', shape='ball'), body('B', -1, f'2.0 {MS}', shape='ball')]))

add('6.3', 'F', 'In an inelastic car crash, kinetic energy is "lost". Where does it go?',
    'Energy is always conserved overall. In an inelastic collision kinetic energy is transferred to other forms: internal energy (the materials heat up), sound, and the work done permanently deforming the cars. Common mistake: saying the energy is destroyed, or that it is turned into momentum (momentum is not a form of energy).',
    kind='multiple_choice',
    options=['Mostly into internal (thermal) energy, sound and the work done deforming the cars',
             'It is destroyed in the collision',
             'It is converted into extra momentum',
             'It is stored as gravitational potential energy'])

add('6.3', 'F', f'Two objects move in the same direction along a line: the one behind at 6.0 {MS} and the one in front at 1.0 {MS}. The faster one catches up and they collide elastically. Calculate their relative speed of separation after the collision.',
    f'Relative speed of approach = 6.0 − 1.0 = {sf(5.0, 2)} {MS} (same direction, so subtract). For an elastic collision, relative speed of separation = relative speed of approach = {sf(5.0, 2)} {MS}. Common mistake: adding the speeds (7.0) even though the objects move the same way.',
    answer=5.0, unit='m/s')

# ── Intermediate ──
ke_before, ke_after = 0.5 * 1.0 * 6.0**2, 0.5 * 1.0 * 2.0**2 + 0.5 * 2.0 * 4.0**2
assert abs(1.0 * 6.0 - (1.0 * -2.0 + 2.0 * 4.0)) < 1e-12 and abs(ke_before - ke_after) < 1e-12
add('6.3', 'I', f'A 1.0 kg ball moving at 6.0 {MS} hits a stationary 2.0 kg ball. Afterwards the 1.0 kg ball rebounds at 2.0 {MS} and the 2.0 kg ball moves forwards at 4.0 {MS}. Which conclusion is correct?',
    f'Momentum: before 1.0 × 6.0 = 6.0; after 1.0 × (−2.0) + 2.0 × 4.0 = 6.0 ✓. Kinetic energy: before ½ × 1.0 × 6.0² = {sf(ke_before, 2)} J; after ½ × 1.0 × 2.0² + ½ × 2.0 × 4.0² = {sf(0.5 * 4.0, 2)} + {sf(16, 2)} = {sf(ke_after, 2)} J ✓. Both are conserved, so the collision is elastic. (Check: approach 6.0 {MS}, separation 4.0 − (−2.0) = 6.0 {MS}.) Common mistake: forgetting the rebound sign and deciding momentum is not conserved.',
    kind='multiple_choice',
    options=['Momentum and kinetic energy are both conserved, so the collision is elastic',
             'Momentum is conserved but kinetic energy is lost, so the collision is inelastic',
             'Momentum is not conserved, so the data must be wrong',
             'Kinetic energy is gained, so energy must have been released'],
    figure=fig('6.3', 'q7', 'collision', before=[body('1.0 kg', 1, f'6.0 {MS}', shape='ball'), body('2.0 kg', 0, shape='ball', w=44)], after=[body('1.0 kg', -1, f'2.0 {MS}', shape='ball'), body('2.0 kg', 1, f'4.0 {MS}', shape='ball', w=44)]))

v = 1.2 * 5.0 / 2.4
lost_pct = (0.5 * 1.2 * 25 - 0.5 * 2.4 * v**2) / (0.5 * 1.2 * 25) * 100
add('6.3', 'I', f'A 1.2 kg trolley moving at 5.0 {MS} collides with an identical stationary trolley and they stick together. Calculate the percentage of the kinetic energy that is lost.',
    f'Common speed: 1.2 × 5.0 = 2.4v, v = {sf(v, 2)} {MS}. KE before = ½ × 1.2 × 5.0² = {sf(15, 2)} J. KE after = ½ × 2.4 × {sf(v, 2)}² = {sf(0.5 * 2.4 * v**2)} J. Lost = {sf(15 - 0.5 * 2.4 * v**2)} J, which is {sf(lost_pct, 2)}%. (For equal masses sticking, half the kinetic energy is always lost.) Common mistake: assuming that because the speed halves, the kinetic energy halves for each trolley and so nothing is lost overall.',
    answer=lost_pct, unit='%')

add('6.3', 'I', f'A snooker cue ball moving at 2.0 {MS} hits a stationary red ball of the same mass head-on. The collision is elastic. Calculate the speed of the red ball just afterwards.',
    f'For equal masses in a head-on elastic collision with one at rest, the velocities are exchanged: the cue ball stops dead and the red moves off at {sf(2.0, 2)} {MS}. Check: momentum m × 2.0 = m × 0 + m × 2.0 ✓, KE ½m(2.0)² = ½m(2.0)² ✓, separation speed 2.0 = approach speed 2.0 ✓. This is how Newton\'s cradle works. Common mistake: sharing the speed equally (1.0 {MS} each), which conserves momentum but loses half the kinetic energy.',
    answer=2.0, unit='m/s',
    figure=fig('6.3', 'q9', 'collision', before=[body('cue', 1, f'2.0 {MS}', shape='ball', w=30), body('red', 0, shape='ball', w=30)], after=[body('cue', 0, shape='ball', w=30), body('red', 1, '?', unknown=True, shape='ball', w=30)], note='equal masses, elastic'))

v = 0.010 * 300 / 2.0
ke_b = 0.5 * 0.010 * 300**2
ke_a = 0.5 * 2.0 * v**2
add('6.3', 'I', f'A 10 g bullet travelling at 300 {MS} embeds itself in a 1.99 kg block resting on a frictionless surface. Calculate the kinetic energy lost in the collision.',
    f'Common velocity: 0.010 × 300 = 2.0 × v (combined mass 2.00 kg), v = {sf(v, 2)} {MS}. KE before = ½ × 0.010 × 300² = {sf(ke_b)} J. KE after = ½ × 2.0 × {sf(v, 2)}² = {sf(ke_a)} J. Lost = {sf(ke_b - ke_a)} J — over 99% of the bullet\'s kinetic energy becomes internal energy of the bullet and block. Common mistake: assuming kinetic energy is conserved and using ½mv² to find the block\'s speed.',
    answer=ke_b - ke_a, unit='J',
    figure=fig('6.3', 'q10', 'collision', before=[body('10 g', 1, f'300 {MS}', shape='ball', w=16), body('1.99 kg', 0, shape='block')], after=[body('2.00 kg', 1, '?', unknown=True, shape='block', w=72)]))

add('6.3', 'I', 'Which of these collisions is (to a very good approximation) perfectly elastic?',
    'Collisions between gas molecules are elastic: if kinetic energy were lost in every molecular collision, a gas in a sealed, insulated container would cool down on its own, and it does not. The other three all transfer kinetic energy to internal energy, sound and deformation. Common mistake: choosing the collision in which the objects bounce, without checking whether kinetic energy is actually kept.',
    kind='multiple_choice',
    options=['A collision between two gas molecules',
             'A car crashing into a wall',
             'A lump of modelling clay hitting the floor',
             'A dart hitting a dartboard'])

v_small = 1.0 * 0.60 / 0.50
ke_rel = 0.5 * 0.50 * v_small**2 + 0.5 * 1.0 * 0.60**2
add('6.3', 'I', f'Two trolleys of mass 0.50 kg and 1.0 kg are held at rest with a compressed spring between them. When released, the 1.0 kg trolley moves off at 0.60 {MS}. Calculate the total kinetic energy given to the trolleys by the spring.',
    f'Total momentum stays zero: 0.50v = 1.0 × 0.60, so the 0.50 kg trolley moves the other way at {sf(v_small, 2)} {MS}. KE = ½ × 0.50 × {sf(v_small, 2)}² + ½ × 1.0 × 0.60² = {sf(0.5 * 0.5 * v_small**2)} + {sf(0.5 * 0.36)} = {sf(ke_rel, 2)} J. This kinetic energy came from the spring\'s elastic potential energy: total kinetic energy INCREASES here, even though momentum is conserved. Common mistake: giving only the 1.0 kg trolley\'s kinetic energy (0.18 J).',
    answer=ke_rel, unit='J',
    figure=fig('6.3', 'q12', 'collision', before=[body('0.50 kg', 0, w=56), body('1.0 kg', 0, w=70)], after=[body('0.50 kg', -1, '?', unknown=True, w=56), body('1.0 kg', 1, f'0.60 {MS}', w=70)], titles=('SPRING COMPRESSED', 'AFTER RELEASE')))

vB = -2.0 + 6.0
add('6.3', 'I', f'Two balls of equal mass collide head-on and elastically. Before the collision ball A moves at +4.0 {MS} and ball B at −2.0 {MS}. After the collision ball A moves at −2.0 {MS}. Use the relative speed of separation to calculate the velocity of B after the collision.',
    f'Relative speed of approach = 4.0 − (−2.0) = {sf(6.0, 2)} {MS}. Elastic, so relative speed of separation = {sf(6.0, 2)} {MS}: v_B − v_A = 6.0, v_B = −2.0 + 6.0 = +{sf(vB, 2)} {MS}. Check momentum: m(4.0) + m(−2.0) = 2.0m before, m(−2.0) + m(4.0) = 2.0m after ✓ (equal masses swap velocities). Common mistake: writing the separation as v_A − v_B, which gives −8.0 {MS}.',
    answer=vB, unit='m/s', sign_sensitive=True,
    figure=fig('6.3', 'q13', 'collision', before=[body('A', 1, f'4.0 {MS}', shape='ball'), body('B', -1, f'2.0 {MS}', shape='ball')], after=[body('A', -1, f'2.0 {MS}', shape='ball'), body('B', 1, '?', unknown=True, shape='ball')], note='equal masses, right is positive'))

# ── Challenging ──
m1, m2, u = 0.20, 0.10, 3.0
v1 = (m1 - m2) / (m1 + m2) * u
v2 = 2 * m1 / (m1 + m2) * u
assert abs(v2 - v1 - u) < 1e-12
add('6.3', 'C', f'A 0.20 kg ball moving at 3.0 {MS} collides head-on and elastically with a stationary 0.10 kg ball. (a) Write down the momentum equation and the relative-speed equation for the collision. (b) Solve them to find the velocity of the 0.10 kg ball afterwards. (c) Check that kinetic energy is conserved. Give only the answer to (b).',
    f'(a) Momentum: 0.20 × 3.0 = 0.20v₁ + 0.10v₂. Relative speeds: v₂ − v₁ = 3.0. (b) From the second, v₁ = v₂ − 3.0. Substituting: 0.60 = 0.20(v₂ − 3.0) + 0.10v₂ = 0.30v₂ − 0.60, so v₂ = {sf(v2, 2)} {MS} (and v₁ = {sf(v1, 2)} {MS}). (c) Before: ½ × 0.20 × 3.0² = {sf(0.9, 2)} J. After: ½ × 0.20 × {sf(v1, 2)}² + ½ × 0.10 × {sf(v2, 2)}² = {sf(0.5 * m1 * v1**2, 2)} + {sf(0.5 * m2 * v2**2, 2)} = {sf(0.5 * m1 * v1**2 + 0.5 * m2 * v2**2, 2)} J ✓. Common mistake: trying to solve with the KE equation (quadratic) when the relative-speed equation is linear and much quicker.',
    answer=v2, unit='m/s', marks=4,
    figure=fig('6.3', 'q14', 'collision', before=[body('0.20 kg', 1, f'3.0 {MS}', shape='ball', w=40), body('0.10 kg', 0, shape='ball', w=30)], after=[body('0.20 kg', 1, f'{sf(v1, 2)} {MS}', shape='ball', w=40), body('0.10 kg', 1, '?', unknown=True, shape='ball', w=30)]))

frac = 1800 / (1200 + 1800) * 100
v = 1200 * 15 / 3000
lost = 0.5 * 1200 * 15**2 - 0.5 * 3000 * v**2
assert abs(lost / (0.5 * 1200 * 15**2) * 100 - frac) < 1e-9
add('6.3', 'C', f'(a) An object of mass m moving at speed u hits a stationary object of mass M and they stick together. Show that the fraction of the kinetic energy lost is M/(m + M). (b) A 1200 kg car travelling at 15 {MS} runs into the back of a stationary 1800 kg van and they lock together. Calculate the percentage of the car\'s kinetic energy that is lost. Give only the answer to (b).',
    f'(a) Common velocity v = mu/(m + M). KE after = ½(m + M)v² = ½m²u²/(m + M). Fraction kept = [½m²u²/(m + M)] ÷ [½mu²] = m/(m + M), so fraction lost = 1 − m/(m + M) = M/(m + M). (b) Fraction lost = 1800 ÷ 3000 = 0.60, i.e. {sf(frac, 2)}%. (Check: v = 18 000 ÷ 3000 = {sf(v, 2)} {MS}, KE {sf(0.5 * 1200 * 225)} J → {sf(0.5 * 3000 * v**2)} J.) The heavier the stationary object, the larger the share of kinetic energy lost. Common mistake: using m/(m + M) = 40%, which is the fraction KEPT.',
    answer=frac, unit='%', marks=4)

v3 = (3.0 * 4.0 - 1.0 * 7.0) / 3.0
ke_b = 0.5 * 3.0 * 4.0**2
ke_a = 0.5 * 3.0 * v3**2 + 0.5 * 1.0 * 7.0**2
assert ke_a > ke_b
add('6.3', 'C', f'A student claims that a 3.0 kg ball moving at 4.0 {MS} hit a stationary 1.0 kg ball, which then moved off at 7.0 {MS}. Use conservation of momentum to find the 3.0 kg ball\'s speed afterwards, then compare the kinetic energies. What can you conclude?',
    f'Momentum: 3.0 × 4.0 = 3.0v + 1.0 × 7.0, so v = 5.0 ÷ 3.0 = {sf(v3)} {MS}. KE before = ½ × 3.0 × 4.0² = {sf(ke_b, 2)} J. KE after = ½ × 3.0 × {sf(v3)}² + ½ × 1.0 × 7.0² = {sf(0.5 * 3.0 * v3**2)} + {sf(24.5)} = {sf(ke_a)} J. The kinetic energy would have INCREASED, which is impossible for a simple collision: energy would have to come from somewhere, e.g. a compressed spring or an explosive charge. (Relative speeds agree: approach 4.0 {MS}, separation 7.0 − {sf(v3)} = {sf(7.0 - v3)} {MS} — faster than approach.) Common mistake: checking only momentum and accepting the claim.',
    kind='multiple_choice', marks=4,
    options=['The claim is impossible for a simple collision: the kinetic energy would increase',
             'The collision is elastic: momentum and kinetic energy are both conserved',
             'The collision is inelastic: some kinetic energy is lost',
             'The claim is impossible because momentum is not conserved'],
    figure=fig('6.3', 'q16', 'collision', before=[body('3.0 kg', 1, f'4.0 {MS}', shape='ball', w=46), body('1.0 kg', 0, shape='ball', w=30)], after=[body('3.0 kg', 1, '?', unknown=True, shape='ball', w=46), body('1.0 kg', 1, f'7.0 {MS}', shape='ball', w=30)], note='"measured" data'))

pct = (1 - 1.2 / 2.0) * 100
ratio = sqrt(1.2 / 2.0)
add('6.3', 'C', 'A ball is dropped from a height of 2.0 m onto a hard floor and bounces back up to 1.2 m. Air resistance is negligible. (a) Calculate the percentage of the ball\'s kinetic energy lost during the bounce. (b) Calculate the ratio (speed just after the bounce) ÷ (speed just before). (c) Is the ball–floor collision elastic? Give only the answer to (a).',
    f'(a) Just before impact Ek = mg × 2.0, just after Ek = mg × 1.2 (all of it becomes potential energy at the top). Fraction lost = (2.0 − 1.2) ÷ 2.0 = 0.40, i.e. {sf(pct, 2)}%. (b) Ek ∝ v², so v_after/v_before = √(1.2/2.0) = {sf(ratio)}. (c) No — it is inelastic, because kinetic energy is lost (to internal energy and sound). Momentum of ball + Earth is still conserved. Common mistake: taking the speed ratio as 1.2/2.0 = 0.60 — heights are proportional to v², not v.',
    answer=pct, unit='%', marks=4,
    figure=fig('6.3', 'q17', 'drop', h1=2.0, h2=1.2, h1Label='2.0 m', h2Label='1.2 m'))

h = 0.080
v_block = sqrt(2 * G * h)
u_b = v_block * 1.500 / 0.015
ke_lost_pct = (1 - 0.015 / 1.500) * 100
add('6.3', 'C', f'A ballistic pendulum measures the speed of an air-rifle pellet. The 15 g pellet embeds in a 1.485 kg block hanging from light strings, and the block swings up through a vertical height of 8.0 cm. (a) Calculate the speed of the block just after the impact. (b) Calculate the speed of the pellet. (c) Explain why kinetic energy is conserved during the swing but NOT during the impact. Give only the answer to (b).',
    f'(a) During the swing kinetic energy becomes gravitational potential energy: ½mv² = mgh, v = √(2gh) = √(2 × 9.81 × 0.080) = {sf(v_block)} {MS}. (b) Momentum is conserved in the impact: 0.015 × u = 1.500 × {sf(v_block)}, u = {sf(u_b)} {MS}. (c) The impact is perfectly inelastic: about {sf(ke_lost_pct, 2)}% of the pellet\'s kinetic energy becomes internal energy. During the swing only gravity does work (the string tension is perpendicular to the motion), so mechanical energy is conserved there. Common mistake: equating the pellet\'s kinetic energy directly to mgh, which gives about 13 {MS}, far too small.',
    answer=u_b, unit='m/s', marks=5,
    figure=fig('6.3', 'q18', 'pendulum', bulletLabel='15 g', speedLabel='u = ?', blockLabel='1.485 kg', hLabel='8.0 cm'))

# ── Stretch ──
mn, mc = 1.0, 12.0
keep = ((mn - mc) / (mn + mc))**2
transfer_pct = (1 - keep) * 100
add('6.3', 'S', f'(a) A particle of mass m₁ moving at u collides head-on and elastically with a stationary particle of mass m₂. Show that its velocity afterwards is v₁ = (m₁ − m₂)u/(m₁ + m₂). (b) In a nuclear reactor, fast neutrons are slowed by elastic collisions with moderator nuclei. A neutron (mass 1.0 u) collides head-on with a stationary carbon-12 nucleus (mass 12 u). Calculate the percentage of the neutron\'s kinetic energy transferred to the carbon nucleus. (c) Explain why hydrogen-rich water slows neutrons in far fewer collisions. Give only the answer to (b).',
    f'(a) Momentum: m₁u = m₁v₁ + m₂v₂. Relative speeds (elastic): v₂ − v₁ = u, so v₂ = u + v₁. Substituting: m₁u = m₁v₁ + m₂u + m₂v₁, so v₁(m₁ + m₂) = (m₁ − m₂)u and v₁ = (m₁ − m₂)u/(m₁ + m₂). (b) v₁/u = (1 − 12)/(1 + 12) = −11/13, so the fraction of KE the neutron keeps = (11/13)² = {sf(keep)}. Transferred = 1 − {sf(keep)} = {sf(1 - keep)}, i.e. {sf(transfer_pct)}%. (c) A hydrogen nucleus (a proton) has almost the same mass as a neutron, so m₁ − m₂ ≈ 0: in a head-on collision the neutron stops and passes nearly ALL its kinetic energy on, just like equal snooker balls. Common mistake: using the speed ratio 11/13 as the energy ratio — kinetic energy goes with v², so square it.',
    answer=transfer_pct, unit='%', marks=6,
    figure=fig('6.3', 'q19', 'collision', before=[body('n, 1.0 u', 1, 'u', shape='ball', w=24), body('C, 12 u', 0, shape='ball', w=56)], after=[body('n', -1, '11u/13', shape='ball', w=24), body('C', 1, '?', unknown=True, shape='ball', w=56)], note='head-on, elastic'))

h0 = 1.2
v0 = sqrt(2 * G * h0)
v_small = 3 * v0
h_small = v_small**2 / (2 * G)
assert abs(h_small - 9 * h0) < 1e-9
add('6.3', 'S', f'A tennis ball rests on top of a basketball and the pair is dropped from a height of 1.2 m (measured to the bottom of the basketball). The basketball\'s mass is much larger than the tennis ball\'s, and every collision is elastic. The basketball bounces off the floor first and, moving upwards, immediately meets the tennis ball, which is still moving downwards. (a) Calculate the speed of both balls just before the basketball hits the floor. (b) Use relative speeds to show that the tennis ball leaves the basketball at three times this speed. (c) Calculate the ideal height the tennis ball rises to, measured from where it leaves the basketball. Give only the answer to (c).',
    f'(a) v = √(2gh) = √(2 × 9.81 × 1.2) = {sf(v0)} {MS}, downwards, for both. (b) The basketball rebounds elastically from the floor at {sf(v0)} {MS} upwards. The tennis ball is still moving down at {sf(v0)} {MS}, so the relative speed of approach is 2 × {sf(v0)} = {sf(2 * v0)} {MS}. Elastic, so it separates at {sf(2 * v0)} {MS} RELATIVE TO the basketball, and the much heavier basketball is barely affected and still moves up at {sf(v0)} {MS}. Tennis ball speed = {sf(v0)} + {sf(2 * v0)} = {sf(v_small)} {MS} = 3v. (c) h = v²/2g = {sf(v_small)}² ÷ (2 × 9.81) = {sf(h_small)} m — nine times the drop height, because h ∝ v² and 3² = 9. (Real balls lose energy, so they rise less, but the effect is still dramatic.) Common mistake: assuming the tennis ball can at most return to 1.2 m, or adding speeds as 2v rather than v + 2v.',
    answer=h_small, unit='m', marks=6,
    figure=fig('6.3', 'q20', 'drop', h1=1.2, h2=3.6, h1Label='1.2 m', h2Label='?', stacked=True, ballLabel='basketball', smallLabel='tennis ball', caption='not to scale'))


# ════════════════════════════════════════════════════════════════════════
# Validate before emitting anything.
# ════════════════════════════════════════════════════════════════════════
for code in LESSONS:
    qs = [p for p in questions if p['code'] == code]
    assert sorted(p['number'] for p in qs) == list(range(1, 21)), f'{code}: {len(qs)} questions'
    texts = [p['text'] for p in qs]
    assert len(set(texts)) == 20, f'{code}: duplicate question text'
    n_mcq = sum(1 for p in qs if p['kind'] == 'multiple_choice')
    n_old_mcq = sum(1 for r in EXISTING[code] if r['type'] == 'multiple_choice')
    n_old_num = len(EXISTING[code]) - n_old_mcq
    assert n_mcq >= n_old_mcq and 20 - n_mcq >= n_old_num, f'{code}: cannot reuse every existing row by type'
for p in questions:
    if p['figure']:
        assert p['figure'].replace('diagram:', '') in diagrams
    if p['kind'] == 'numeric':
        assert p['value'] == p['value'] and abs(p['value']) < 1e40

print(f'{len(questions)} questions across {len(LESSONS)} lessons, {len(diagrams)} figures, '
      f'{sum(1 for p in questions if p["figure"])} questions with a figure', file=sys.stderr)

# ════════════════════════════════════════════════════════════════════════
# SQL
# ════════════════════════════════════════════════════════════════════════
out = [
    '-- AS Level (9702) Chapter 6 Momentum: 6.1 The idea of momentum, 6.2 Conservation of',
    '-- momentum and collisions, 6.3 Understanding collisions. 20 tier-ordered questions each.',
    '-- GENERATED by 2026-10-26-as-momentum-collisions.py: edit that, never this file.',
    '-- Existing AS rows of these lessons are overwritten in place (UPDATE by id, matched',
    '-- by answer_type) because a DELETE hangs the SQL tool here, and the surplus is a',
    '-- fresh INSERT with a uuid5 id and ON CONFLICT DO NOTHING. Re-running is a no-op.',
    '',
]

for code in LESSONS:
    qs = sorted((p for p in questions if p['code'] == code), key=lambda p: p['number'])
    pools = {
        'numeric': [r for r in EXISTING[code] if r['type'] == 'numeric'],
        'multiple_choice': [r for r in EXISTING[code] if r['type'] == 'multiple_choice'],
    }
    for p in qs:
        answer_type = 'multiple_choice' if p['kind'] == 'multiple_choice' else 'numeric'
        tol = p['tolerance'] if p.get('tolerance') is not None else 'NULL'
        pool = pools[answer_type]
        if pool:
            old = pool.pop(0)
            p['row_id'] = old['id']
            out.append(
                'UPDATE problems SET '
                f"chapter_id = {q(p['chapter'])}, topic_id = {q(p['topic'])}, curriculum_id = 'as', "
                f"topic_code = {q(p['code'])}, syllabus_cite = {q(p['cite'])}, problem_number = {p['number']}, "
                f"\"order\" = {p['number']}, question_text = {q(p['text'])}, question_image_url = {opt(p['figure'])}, "
                f"difficulty_level = {p['difficulty']}, answer_type = '{answer_type}'::answer_type, "
                f"answer_correct = {q(p['answer'])}, answer_unit = {opt(p.get('unit'))}, "
                f"answer_unit_required = false, answer_tolerance = {tol}, "
                f"answer_sign_sensitive = {b(p.get('sign', False))}, explanation = {q(p['explanation'])}, "
                f"points = {p['marks']} WHERE id = {q(old['id'])};"
            )
            if answer_type == 'multiple_choice':
                for oi, text in enumerate(p['options']):
                    out.append(
                        f"UPDATE problem_options SET problem_id = {q(old['id'])}, option_text = {q(text)}, "
                        f"option_letter = {q('ABCD'[oi])}, is_correct = {b(oi == p['correct_idx'])}, \"order\" = {oi} "
                        f"WHERE id = {q(old['options'][oi])};"
                    )
        else:
            p['row_id'] = p['id']
            out.append(
                'INSERT INTO problems (id, chapter_id, topic_id, curriculum_id, topic_code, syllabus_cite, problem_number, "order", '
                'question_text, question_image_url, difficulty_level, answer_type, answer_correct, answer_unit, answer_unit_required, '
                'answer_tolerance, answer_sign_sensitive, explanation, points) VALUES ('
                f"{q(p['id'])}, {q(p['chapter'])}, {q(p['topic'])}, 'as', {q(p['code'])}, {q(p['cite'])}, "
                f"{p['number']}, {p['number']}, {q(p['text'])}, {opt(p['figure'])}, {p['difficulty']}, "
                f"'{answer_type}'::answer_type, {q(p['answer'])}, {opt(p.get('unit'))}, false, "
                f"{tol}, {b(p.get('sign', False))}, {q(p['explanation'])}, {p['marks']}) ON CONFLICT (id) DO NOTHING;"
            )
            if answer_type == 'multiple_choice':
                for oi, text in enumerate(p['options']):
                    out.append(
                        'INSERT INTO problem_options (id, problem_id, option_text, option_letter, is_correct, "order") VALUES ('
                        f"{q(uid('option/' + p['id'] + '/' + str(oi)))}, {q(p['id'])}, {q(text)}, {q('ABCD'[oi])}, "
                        f"{b(oi == p['correct_idx'])}, {oi}) ON CONFLICT (id) DO NOTHING;"
                    )
    assert not pools['numeric'] and not pools['multiple_choice'], f'{code}: unused existing rows'

with open(sys.argv[1], 'w') as fh:
    fh.write('\n'.join(out) + '\n')

ts = [
    '// GENERATED by database/seeds/2026-10-26-as-momentum-collisions.py — do not hand-edit.',
    '// The exact numbers and labels behind each AS Chapter 6 question figure; rendered by',
    '// components/practice/MomentumBankDiagrams.tsx.',
    '// eslint-disable-next-line @typescript-eslint/no-explicit-any',
    'export const MOMENTUM_BANK_DIAGRAM_DATA: Record<string, { kind: string; props: any }> = ' +
    json.dumps(diagrams, ensure_ascii=False, indent=1) + ';',
    '',
]
with open(sys.argv[2], 'w') as fh:
    fh.write('\n'.join(ts))

if '--json' in sys.argv:
    with open(sys.argv[sys.argv.index('--json') + 1], 'w') as fh:
        json.dump(questions, fh, ensure_ascii=False, indent=1, default=str)
