# Figures for ch01b.py (Chapter 1, 1.5 to 1.8): vector triangles, components and change-of-velocity diagrams,
# all built from the magnitudes, bearings and angles stated in the stems.


def _b(L, bearing):
    return L * sin(radians(bearing)), L * cos(radians(bearing))


def _comp(L, ang, lab, title, desc, ref='east', north=True, comp_labels=('', '')):
    """A vector of size L at ang above the reference (east or horizontal) drawn as its two components with the
    vector itself dashed and the angle marked."""
    E, N_ = L * cos(radians(ang)), L * sin(radians(ang))
    return walk(title, desc, [(E, 0, comp_labels[0], False), (0, N_, comp_labels[1], False)], resultant=lab,
                angle=(f'{ang:g}°', 'east'), north=north)


# ── 1.5 ──
F('A girl walks 12 m east and then 5.0 m north', lambda s: walk(
    'Two displacements', 'Displacements of 12 m east and 5.0 m north drawn head to tail, with the resultant dashed.',
    [(12, 0, '12 m'), (0, 5.0, '5.0 m')], resultant='s'))
F('A rambler walks 9.0 km north then 12 km west', lambda s: walk(
    'Two displacements', 'Displacements of 9.0 km north and 12 km west drawn head to tail, with the resultant dashed.',
    [(0, 9.0, '9.0 km'), (-12, 0, '12 km')], resultant='s'))
F('A ship sails 6.0 km north and then 8.0 km east', lambda s: walk(
    'Ship displacement', 'A ship sails 6.0 km north then 8.0 km east; the resultant is dashed and its angle θ east of north is marked.',
    [(0, 6.0, '6.0 km'), (8.0, 0, '8.0 km')], resultant='s', angle=('θ', 'north')))
F('A diver swims 15 m horizontally and 8.0 m vertically downwards', lambda s: walk(
    'Diver displacement', 'A diver moves 15 m horizontally and 8.0 m vertically down; the resultant is dashed.',
    [(15, 0, '15 m'), (0, -8.0, '8.0 m')], resultant='s', north=False))
F('A mouse runs 1.2 m east and then 0.50 m south', lambda s: walk(
    'Mouse run', 'A mouse runs 1.2 m east then 0.50 m south; the resultant is dashed.',
    [(1.2, 0, '1.2 m'), (0, -0.50, '0.50 m')], resultant='s'))
F('A hiker walks 5.0 km east and then 8.0 km on a bearing of 030°', lambda s: walk(
    'Using the cosine rule', 'A hike of 5.0 km east followed by 8.0 km on a bearing of 030°; the resultant is dashed.',
    [(5.0, 0, '5.0 km'), (*_b(8.0, 30), '8.0 km')], resultant='s'))
F('A boat sails 4.0 km on a bearing of 060° and then 4.0 km on a bearing of 120°', lambda s: walk(
    'Two bearings', 'A boat sails 4.0 km on a bearing of 060° then 4.0 km on a bearing of 120°; the resultant is dashed.',
    [(*_b(4.0, 60), '4.0 km'), (*_b(4.0, 120), '4.0 km')], resultant='s'))
F('A walker\'s displacement is 10 km at 30° north of east', lambda s: _comp(
    10, 30, '10 km', 'Components of a displacement', 'A 10 km displacement at 30° north of east (dashed) with its east and north components drawn head to tail.'))
F('A plane flies 200 km north then 150 km on a bearing of 090°, then 50 km south', lambda s: walk(
    'Three-leg flight', 'A flight of 200 km north, 150 km east and 50 km south; the resultant is dashed.',
    [(0, 200, '200 km'), (150, 0, '150 km'), (0, -50, '50 km')], resultant='s'))
F('A hiker walks 6.0 km on a bearing of 040° and then 4.0 km on a bearing of 130°', lambda s: walk(
    'Perpendicular legs', 'A hike of 6.0 km on a bearing of 040° then 4.0 km on a bearing of 130°; the resultant is dashed.',
    [(*_b(6.0, 40), '6.0 km'), (*_b(4.0, 130), '4.0 km')], resultant='s'))
F('A walker goes 3.0 km north-east and then 3.0 km north-west', lambda s: walk(
    'North-east then north-west', 'A walk of 3.0 km north-east then 3.0 km north-west; the resultant points due north.',
    [(*_b(3.0, 45), '3.0 km'), (*_b(3.0, 315), '3.0 km')], resultant='s'))
F('A yacht has components of displacement 7.5 km east and 4.0 km south', lambda s: walk(
    'Displacement components', 'Components of 7.5 km east and 4.0 km south drawn head to tail; the displacement is dashed.',
    [(7.5, 0, '7.5 km'), (0, -4.0, '4.0 km')], resultant='s', angle=('θ', 'east')))
F('A crane lifts a load 12 m vertically and swings it 9.0 m horizontally', lambda s: walk(
    'Crane load', 'A load lifted 12 m vertically and moved 9.0 m horizontally; the resultant displacement is dashed.',
    [(0, 12, '12 m'), (9.0, 0, '9.0 m')], resultant='s', north=False))
F('A displacement of 25 m makes an angle of 40° with the horizontal', lambda s: _comp(
    25, 40, '25 m', 'Vertical component', 'A 25 m displacement at 40° to the horizontal (dashed) with its horizontal and vertical components.', north=False))
F('Two displacements, 8.0 km and 5.0 km, are separated by an angle of 60°', lambda s: vector_diff(
    'Parallelogram rule', 'Displacements of 8.0 km and 5.0 km drawn from the same point, 60° apart, with the resultant (dashed) by the parallelogram rule.',
    (8.0, 0), (5.0 * cos(radians(60)), 5.0 * sin(radians(60))), '8.0 km', '5.0 km', ld='s', sum_=True, north=False))
F('A bird flies 300 m on a bearing of 210°', lambda s: walk(
    'Bird flight', 'A displacement of 300 m on a bearing of 210° (dashed) shown with its west and south components.',
    [(-300 * sin(radians(30)), 0, 'west', False), (0, -300 * cos(radians(30)), 'south', False)], resultant='300 m', angle=('30°', 'south')))
F('A walker covers 2.5 km north, 1.5 km east and 0.5 km north', lambda s: walk(
    'Three legs', 'A walk of 2.5 km north, 1.5 km east and 0.5 km north; the resultant is dashed.',
    [(0, 2.5, '2.5 km'), (1.5, 0, '1.5 km'), (0, 0.5, '0.5 km')], resultant='s'))
F('A boat travels 900 m due east and then 1200 m due south', lambda s: walk(
    'Boat course', 'A boat travels 900 m east then 1200 m south; the resultant is dashed.',
    [(900, 0, '900 m'), (0, -1200, '1200 m')], resultant='s'))
F('A hiker walks 4.0 km on a bearing of 030°, then 6.0 km on a bearing of 120°', lambda s: walk(
    'Hike on bearings', 'A hike of 4.0 km on a bearing of 030° then 6.0 km on a bearing of 120°; the resultant is dashed.',
    [(*_b(4.0, 30), '4.0 km'), (*_b(6.0, 120), '6.0 km')], resultant='s'))
F('A ship sails 12 km on a bearing of 050°, then 8.0 km on a bearing of 170°', lambda s: walk(
    'Ship on two bearings', 'A ship sails 12 km on a bearing of 050° then 8.0 km on a bearing of 170°; the resultant is dashed.',
    [(*_b(12, 50), '12 km'), (*_b(8.0, 170), '8.0 km')], resultant='s'))
F('An orienteer runs 800 m on a bearing of 000°, then 600 m on a bearing of 270°', lambda s: walk(
    'Orienteering course', 'Legs of 800 m north, 600 m west and 400 m south; the resultant is dashed.',
    [(0, 800, '800 m'), (-600, 0, '600 m'), (0, -400, '400 m')], resultant='s'))
F('A climber moves 30 m up a slope inclined at 35° to the horizontal and then 20 m horizontally', lambda s: walk(
    'Climb then traverse', 'A climb of 30 m up a 35° slope followed by 20 m horizontally; the resultant displacement is dashed.',
    [(30 * cos(radians(35)), 30 * sin(radians(35)), '30 m'), (20, 0, '20 m')], resultant='s', north=False))
F('A boat sails 10 km on a bearing of 045° and then 10 km on a bearing of 315°', lambda s: walk(
    'North-east then north-west', 'A boat sails 10 km on a bearing of 045° then 10 km on a bearing of 315°; the resultant is dashed.',
    [(*_b(10, 45), '10 km'), (*_b(10, 315), '10 km')], resultant='s'))
F('A walker goes 2.0 km east, 3.0 km north, 4.0 km east and 5.0 km north', lambda s: walk(
    'Staircase walk', 'A walk of 2.0 km east, 3.0 km north, 4.0 km east and 5.0 km north, drawn head to tail.',
    [(2.0, 0, '2.0 km'), (0, 3.0, '3.0 km'), (4.0, 0, '4.0 km'), (0, 5.0, '5.0 km')], resultant=None))
F('A bee flies 30 m north-east, then 30 m south-east, then 30 m south-west', lambda s: walk(
    'Bee flight', 'A bee flies 30 m north-east, 30 m south-east and 30 m south-west; the resultant is dashed.',
    [(*_b(30, 45), '30 m'), (*_b(30, 135), '30 m'), (*_b(30, 225), '30 m')], resultant='s'))
F('A ball is kicked 25 m due east and then 15 m towards the north-east', lambda s: walk(
    'Two kicks', 'Displacements of 25 m east then 15 m north-east; the resultant is dashed.',
    [(25, 0, '25 m'), (*_b(15, 45), '15 m')], resultant='s'))
F('A hiker walks 5.0 km on a bearing of 000°, 5.0 km on a bearing of 120° and 3.0 km on a bearing of 240°', lambda s: walk(
    'Nearly closed triangle', 'Legs of 5.0 km on 000°, 5.0 km on 120° and 3.0 km on 240°; the short resultant is dashed.',
    [(*_b(5.0, 0), '5.0 km'), (*_b(5.0, 120), '5.0 km'), (*_b(3.0, 240), '3.0 km')], resultant='s'))

# ── 1.6 ──
F('A boat heads straight across a river at 4.0 m s⁻¹ relative to the water. The current flows at 3.0 m s⁻¹', lambda s: walk(
    'Boat and current', 'The boat\'s velocity of 4.0 m s⁻¹ across the river and the current\'s 3.0 m s⁻¹ along it, added head to tail; the resultant is dashed.',
    [(0, 4.0, '4.0 m s⁻¹'), (3.0, 0, '3.0 m s⁻¹')], resultant='v', north=False))
F('An aircraft flies north at 200 m s⁻¹ in a wind blowing east at 50 m s⁻¹', lambda s: walk(
    'Aircraft in a crosswind', 'An air velocity of 200 m s⁻¹ north plus a wind of 50 m s⁻¹ east; the resultant ground velocity is dashed.',
    [(0, 200, '200 m s⁻¹'), (50, 0, '50 m s⁻¹')], resultant='v'))
F('A boat heads across a river at 3.0 m s⁻¹ while the current flows at 3.0 m s⁻¹', lambda s: walk(
    'Equal velocities', 'A boat velocity of 3.0 m s⁻¹ across the river plus a current of 3.0 m s⁻¹; the resultant is dashed with its angle θ to the bank.',
    [(0, 3.0, '3.0 m s⁻¹'), (3.0, 0, '3.0 m s⁻¹')], resultant='v', north=False))
F('A drone flies east at 12 m s⁻¹ in a wind blowing north at 5.0 m s⁻¹', lambda s: walk(
    'Drone in wind', 'A drone velocity of 12 m s⁻¹ east plus a wind of 5.0 m s⁻¹ north; the resultant is dashed.',
    [(12, 0, '12 m s⁻¹'), (0, 5.0, '5.0 m s⁻¹')], resultant='v'))
F('A boat heads straight across a 60 m wide river at 2.0 m s⁻¹ relative to the water; the current flows at 1.5 m s⁻¹. How far', lambda s: walk(
    'Crossing a river', 'Velocity of 2.0 m s⁻¹ across a 60 m river plus a 1.5 m s⁻¹ current; the resultant velocity is dashed.',
    [(0, 2.0, '2.0 m s⁻¹'), (1.5, 0, '1.5 m s⁻¹')], resultant='v', north=False))
F('At what angle to the straight-across direction, upstream, must it head?', lambda s: walk(
    'Heading upstream', 'A boat heading upstream at 5.0 m s⁻¹ relative to the water plus a 3.0 m s⁻¹ current gives a resultant straight across (dashed).',
    [(-3.0, 4.0, '5.0 m s⁻¹'), (3.0, 0, '3.0 m s⁻¹')], resultant='v', north=False))
F('A plane heads due north at 180 m s⁻¹ while the wind blows from the west at 40 m s⁻¹', lambda s: walk(
    'Wind from the west', 'An air velocity of 180 m s⁻¹ north plus a wind of 40 m s⁻¹ towards the east; the track is dashed with the angle θ east of north.',
    [(0, 180, '180 m s⁻¹'), (40, 0, '40 m s⁻¹')], resultant='v', angle=('θ', 'north')))
F('Rain falls vertically at 6.0 m s⁻¹. A cyclist rides at 4.0 m s⁻¹', lambda s: walk(
    'Rain seen by a cyclist', 'The rain\'s velocity of 6.0 m s⁻¹ downwards plus the reversed cyclist velocity of 4.0 m s⁻¹ gives the velocity of the rain relative to the cyclist (dashed).',
    [(0, -6.0, '6.0 m s⁻¹'), (-4.0, 0, '4.0 m s⁻¹')], resultant='v', north=False))
F('A ball is thrown sideways at 8.0 m s⁻¹, at right angles to the motion of a truck', lambda s: walk(
    'Ball thrown from a truck', 'The truck\'s velocity of 12 m s⁻¹ plus the ball\'s sideways 8.0 m s⁻¹; the ball\'s resultant velocity is dashed.',
    [(12, 0, '12 m s⁻¹'), (0, 8.0, '8.0 m s⁻¹')], resultant='v', north=False))
F('A swimmer who can swim at 1.2 m s⁻¹ heads straight across a river 48 m wide', lambda s: walk(
    'Swimmer and current', 'A swimmer\'s 1.2 m s⁻¹ across a 48 m river plus a 0.90 m s⁻¹ current; the resultant is dashed.',
    [(0, 1.2, '1.2 m s⁻¹'), (0.90, 0, '0.90 m s⁻¹')], resultant='v', north=False))
F('A plane must fly due east at a ground speed of 250 m s⁻¹ while a wind blows from the south at 30 m s⁻¹', lambda s: walk(
    'Allowing for wind', 'The air velocity (dashed) plus a wind of 30 m s⁻¹ towards the north must give 250 m s⁻¹ due east.',
    [(250, -30, 'air velocity', False), (0, 30, '30 m s⁻¹')], resultant='250 m s⁻¹'))
F('A man walks across the deck of a ferry at 1.4 m s⁻¹', lambda s: walk(
    'Walking on a ferry', 'The ferry\'s 4.8 m s⁻¹ plus the man\'s 1.4 m s⁻¹ across the deck; his resultant velocity is dashed.',
    [(4.8, 0, '4.8 m s⁻¹'), (0, 1.4, '1.4 m s⁻¹')], resultant='v', north=False))
F('A kite moves at 3.0 m s⁻¹ horizontally and 4.0 m s⁻¹ vertically', lambda s: walk(
    'Kite velocity', 'Velocity components of 3.0 m s⁻¹ horizontally and 4.0 m s⁻¹ vertically; the velocity is dashed with its angle θ above the horizontal.',
    [(3.0, 0, '3.0 m s⁻¹'), (0, 4.0, '4.0 m s⁻¹')], resultant='v', angle=('θ', 'east'), north=False))
F('A velocity of 15 m s⁻¹ is directed at 25° above the horizontal. Calculate its horizontal component', lambda s: _comp(
    15, 25, '15 m s⁻¹', 'Velocity components', 'A velocity of 15 m s⁻¹ at 25° above the horizontal (dashed) with its horizontal and vertical components.', north=False))
F('A plane with airspeed 220 m s⁻¹ heads due north. A wind of 50 m s⁻¹ blows towards the north-east', lambda s: walk(
    'North-east wind', 'An air velocity of 220 m s⁻¹ north plus a 50 m s⁻¹ wind towards the north-east; the ground velocity is dashed.',
    [(0, 220, '220 m s⁻¹'), (*_b(50, 45), '50 m s⁻¹')], resultant='v'))
F('A boat crosses a river 120 m wide. It can move at 4.0 m s⁻¹ in still water and the current is 2.0 m s⁻¹', lambda s: walk(
    'Landing directly opposite', 'A heading of 4.0 m s⁻¹ angled upstream plus a 2.0 m s⁻¹ current gives a resultant straight across (dashed).',
    [(-2.0, sqrt(12), '4.0 m s⁻¹'), (2.0, 0, '2.0 m s⁻¹')], resultant='v', north=False))
F('A pilot wants to fly due east. The plane\'s airspeed is 150 m s⁻¹ and a wind blows due north at 30 m s⁻¹', lambda s: walk(
    'Correcting for wind', 'An air velocity of 150 m s⁻¹ angled south of east plus a 30 m s⁻¹ wind north gives a ground velocity due east (dashed).',
    [(sqrt(150 ** 2 - 900), -30, '150 m s⁻¹'), (0, 30, '30 m s⁻¹')], resultant='v'))
F('A swimmer heads at 30° upstream of straight across a river 40 m wide', lambda s: walk(
    'Swimming upstream at an angle', 'A swimmer\'s 1.6 m s⁻¹ at 30° upstream of straight across plus a 0.50 m s⁻¹ current; the resultant is dashed.',
    [(-1.6 * sin(radians(30)), 1.6 * cos(radians(30)), '1.6 m s⁻¹'), (0.50, 0, '0.50 m s⁻¹')], resultant='v', north=False))
F('Raindrops fall vertically at 7.0 m s⁻¹. To a passenger in a car, they appear to fall at 60° to the vertical', lambda s: walk(
    'Rain seen from a car', 'Rain falling at 7.0 m s⁻¹ plus the reversed car velocity gives a relative velocity at 60° to the vertical (dashed).',
    [(0, -7.0, '7.0 m s⁻¹'), (-7.0 * tan(radians(60)), 0, 'car velocity reversed', False)], resultant='v', north=False))
F('A ferry travels at 6.0 m s⁻¹ relative to the water, heading 40° upstream from straight across', lambda s: walk(
    'Ferry heading upstream', 'The ferry\'s 6.0 m s⁻¹ at 40° upstream of straight across plus a 2.5 m s⁻¹ current; the resultant is dashed.',
    [(-6.0 * sin(radians(40)), 6.0 * cos(radians(40)), '6.0 m s⁻¹'), (2.5, 0, '2.5 m s⁻¹')], resultant='v', north=False))
F('A drone flies with airspeed 18 m s⁻¹, heading due east, in a wind of 6.0 m s⁻¹ blowing towards the south-west', lambda s: walk(
    'Drone against a south-west wind', 'An air velocity of 18 m s⁻¹ east plus a 6.0 m s⁻¹ wind towards the south-west; the ground velocity is dashed.',
    [(18, 0, '18 m s⁻¹'), (*_b(6.0, 225), '6.0 m s⁻¹')], resultant='v'))
F('A canoeist paddles north at 2.4 m s⁻¹ relative to the water in a current flowing east at 0.70 m s⁻¹', lambda s: walk(
    'Canoe and current', 'A paddling velocity of 2.4 m s⁻¹ north plus a 0.70 m s⁻¹ current east; the resultant is dashed.',
    [(0, 2.4, '2.4 m s⁻¹'), (0.70, 0, '0.70 m s⁻¹')], resultant='v'))

# ── 1.7 ──
F('A cyclist\'s velocity changes from 4.0 m s⁻¹ east to 4.0 m s⁻¹ north. Calculate', lambda s: vector_diff(
    'Change in velocity', 'Initial velocity 4.0 m s⁻¹ east and final velocity 4.0 m s⁻¹ north from a common point; Δv (dashed) runs from the head of v₁ to the head of v₂.',
    (4.0, 0), (0, 4.0), 'v₁ = 4.0 m s⁻¹', 'v₂ = 4.0 m s⁻¹'))
F('A car rounds a 90° bend, its velocity changing from 15 m s⁻¹ north to 15 m s⁻¹ east', lambda s: vector_diff(
    'Turning a 90° bend', 'Initial velocity 15 m s⁻¹ north and final velocity 15 m s⁻¹ east from a common point, with Δv dashed.',
    (0, 15), (15, 0), 'v₁ = 15 m s⁻¹', 'v₂ = 15 m s⁻¹'))
F('An ice-hockey puck is moving east at 6.0 m s⁻¹ when it is struck', lambda s: vector_diff(
    'Puck struck', 'Initial velocity 6.0 m s⁻¹ east and final velocity 8.0 m s⁻¹ north from a common point, with Δv dashed.',
    (6.0, 0), (0, 8.0), 'v₁ = 6.0 m s⁻¹', 'v₂ = 8.0 m s⁻¹'))
F('A puck\'s velocity changes from 6.0 m s⁻¹ east to 8.0 m s⁻¹ north. Calculate the angle', lambda s: vector_diff(
    'Direction of Δv', 'Initial velocity 6.0 m s⁻¹ east and final velocity 8.0 m s⁻¹ north from a common point; Δv (dashed) points north-west.',
    (6.0, 0), (0, 8.0), 'v₁ = 6.0 m s⁻¹', 'v₂ = 8.0 m s⁻¹'))
F('A ball strikes a wall at 10 m s⁻¹ at 60° to the wall', lambda s: vector_diff(
    'Glancing rebound', 'Velocities of 10 m s⁻¹ before and after a rebound, each at 60° to the wall, drawn from a common point; Δv (dashed) is perpendicular to the wall.',
    (10 * cos(radians(60)), -10 * sin(radians(60))), (10 * cos(radians(60)), 10 * sin(radians(60))), 'v₁ = 10 m s⁻¹', 'v₂ = 10 m s⁻¹', north=False))
F('A satellite moving at 7.5 km s⁻¹ goes a quarter of the way round a circular orbit', lambda s: vector_diff(
    'Quarter orbit', 'Velocities of 7.5 km s⁻¹ at the start and after a quarter orbit, 90° apart, from a common point; Δv is dashed.',
    (7.5, 0), (0, 7.5), 'v₁ = 7.5 km s⁻¹', 'v₂ = 7.5 km s⁻¹', north=False))
F('Velocity v₁ = 10 m s⁻¹ east and v₂ = 10 m s⁻¹ at 60° north of east', lambda s: vector_diff(
    'Equilateral triangle', 'Velocities of 10 m s⁻¹ east and 10 m s⁻¹ at 60° north of east from a common point; Δv is dashed.',
    (10, 0), (10 * cos(radians(60)), 10 * sin(radians(60))), 'v₁ = 10 m s⁻¹', 'v₂ = 10 m s⁻¹'))
F('A hockey ball travelling at 14 m s⁻¹ east is struck so that it leaves at 14 m s⁻¹ north', lambda s: vector_diff(
    'Hockey ball', 'Initial velocity 14 m s⁻¹ east and final velocity 14 m s⁻¹ north from a common point; Δv is dashed.',
    (14, 0), (0, 14), 'v₁ = 14 m s⁻¹', 'v₂ = 14 m s⁻¹'))
F('A car\'s velocity changes from 20 m s⁻¹ north to 20 m s⁻¹ west in 8.0 s', lambda s: vector_diff(
    'North to west', 'Initial velocity 20 m s⁻¹ north and final velocity 20 m s⁻¹ west from a common point; Δv is dashed.',
    (0, 20), (-20, 0), 'v₁ = 20 m s⁻¹', 'v₂ = 20 m s⁻¹'))
F('A ship at 6.0 m s⁻¹ due north changes course to 6.0 m s⁻¹ on a bearing of 060°', lambda s: vector_diff(
    'Change of course', 'Velocities of 6.0 m s⁻¹ north and 6.0 m s⁻¹ on a bearing of 060° from a common point; Δv is dashed.',
    (0, 6.0), _b(6.0, 60), 'v₁ = 6.0 m s⁻¹', 'v₂ = 6.0 m s⁻¹'))
F('Ship A sails east at 8.0 m s⁻¹; ship B sails north at 6.0 m s⁻¹', lambda s: vector_diff(
    'Relative velocity of two ships', 'v(A) = 8.0 m s⁻¹ east and v(B) = 6.0 m s⁻¹ north from a common point; v(B) − v(A) is dashed from the head of v(A) to the head of v(B).',
    (8.0, 0), (0, 6.0), 'A: 8.0 m s⁻¹', 'B: 6.0 m s⁻¹', ld='v(B) − v(A)'))
F('Car A travels north at 15 m s⁻¹ and car B travels east at 20 m s⁻¹', lambda s: vector_diff(
    'Relative velocity of two cars', 'v(A) = 15 m s⁻¹ north and v(B) = 20 m s⁻¹ east from a common point; v(B) − v(A) is dashed.',
    (0, 15), (20, 0), 'A: 15 m s⁻¹', 'B: 20 m s⁻¹', ld='v(B) − v(A)'))
F('A model boat heading north at 3.0 m s⁻¹ is turned so that it heads east at 4.0 m s⁻¹', lambda s: vector_diff(
    'Model boat turning', 'Initial velocity 3.0 m s⁻¹ north and final velocity 4.0 m s⁻¹ east from a common point; Δv is dashed.',
    (0, 3.0), (4.0, 0), 'v₁ = 3.0 m s⁻¹', 'v₂ = 4.0 m s⁻¹'))
F('A boat moves at 5.0 m s⁻¹ east and a seagull flies at 12 m s⁻¹ north', lambda s: vector_diff(
    'Gull relative to boat', 'v(boat) = 5.0 m s⁻¹ east and v(gull) = 12 m s⁻¹ north from a common point; v(gull) − v(boat) is dashed.',
    (5.0, 0), (0, 12), 'boat: 5.0 m s⁻¹', 'gull: 12 m s⁻¹', ld='v(gull) − v(boat)'))
F('Rain falls vertically at 5.0 m s⁻¹. A runner moves east at 3.0 m s⁻¹', lambda s: vector_diff(
    'Rain relative to a runner', 'v(runner) = 3.0 m s⁻¹ east and v(rain) = 5.0 m s⁻¹ down from a common point; v(rain) − v(runner) is dashed.',
    (3.0, 0), (0, -5.0), 'runner: 3.0 m s⁻¹', 'rain: 5.0 m s⁻¹', ld='v(rain) − v(runner)', north=False))

# ── 1.8 ──
F('Two forces of 30 N and 40 N act at right angles on a box', lambda s: vector_diff(
    'Two perpendicular forces', 'Forces of 30 N and 40 N at right angles acting on a point, with their resultant dashed by the parallelogram rule.',
    (40, 0), (0, 30), '40 N', '30 N', ld='F', sum_=True, north=False))
F('A force of 20 N acts at 30° above the horizontal. Calculate its horizontal component', lambda s: _comp(
    20, 30, '20 N', 'Force components', 'A 20 N force at 30° above the horizontal (dashed) with its horizontal and vertical components.', north=False))
F('Two forces of 5.0 N and 12 N act on a point at right angles', lambda s: vector_diff(
    'Resultant of two forces', 'Forces of 12 N and 5.0 N at right angles from a point, with the resultant dashed.',
    (12, 0), (0, 5.0), '12 N', '5.0 N', ld='F', sum_=True, north=False))
F('A box is pulled by a rope with a tension of 80 N at 25° above the horizontal', lambda s: _comp(
    80, 25, '80 N', 'Rope tension', 'A tension of 80 N at 25° above the horizontal (dashed) with its horizontal and vertical components.', north=False))
F('A force of 50 N acts at 60° to a second force of 50 N', lambda s: vector_diff(
    'Two equal forces', 'Two 50 N forces 60° apart from a point, with the resultant dashed by the parallelogram rule.',
    (50, 0), (50 * cos(radians(60)), 50 * sin(radians(60))), '50 N', '50 N', ld='F', sum_=True, north=False))
F('Three forces act on a point: 10 N north, 10 N east and 4.0 N south', lambda s: walk(
    'Three forces', 'Forces of 10 N north, 10 N east and 4.0 N south drawn head to tail; the resultant is dashed.',
    [(0, 10, '10 N'), (10, 0, '10 N'), (0, -4.0, '4.0 N')], resultant='F'))
F('A sledge is pulled by two ropes, each with tension 150 N, at 20° either side', lambda s: vector_diff(
    'Two tow ropes', 'Two 150 N tensions at 20° either side of the direction of motion, with the resultant dashed.',
    (150 * cos(radians(20)), 150 * sin(radians(20))), (150 * cos(radians(20)), -150 * sin(radians(20))), '150 N', '150 N', ld='F', sum_=True, north=False))
F('A kite string pulls with 25 N at 50° to the horizontal', lambda s: _comp(
    25, 50, '25 N', 'Kite string', 'A 25 N pull at 50° to the horizontal (dashed) with its horizontal and vertical components.', north=False))
F('Three forces act on a ring: 20 N east, 30 N at 60° north of east and 25 N south', lambda s: walk(
    'Three forces on a ring', 'Forces of 20 N east, 30 N at 60° north of east and 25 N south drawn head to tail; the resultant is dashed.',
    [(20, 0, '20 N'), (30 * cos(radians(60)), 30 * sin(radians(60)), '30 N'), (0, -25, '25 N')], resultant='F', north=False))
F('Two forces of 8.0 N and 6.0 N act at 60° to each other', lambda s: vector_diff(
    'Forces at 60°', 'Forces of 8.0 N and 6.0 N acting at 60° to each other, with the resultant dashed.',
    (8.0, 0), (6.0 * cos(radians(60)), 6.0 * sin(radians(60))), '8.0 N', '6.0 N', ld='F', sum_=True, north=False))
F('A crate is pulled with 120 N at 30° above the horizontal while friction is 70 N', lambda s: _comp(
    120, 30, '120 N', 'Pulling a crate', 'A pull of 120 N at 30° above the horizontal (dashed) with its horizontal and vertical components.', north=False))
F('Forces of 9.0 N north and 12 N east act on a buoy', lambda s: vector_diff(
    'Forces on a buoy', 'Forces of 9.0 N north and 12 N east from a point, with the resultant dashed.',
    (12, 0), (0, 9.0), '12 N', '9.0 N', ld='F', sum_=True))
