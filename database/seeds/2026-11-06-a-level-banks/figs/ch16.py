# Figures for ch16.py (Chapter 16 circular motion). Numbers come from the stems.


def _pairs(s, pat):
    return [(float(a), float(b)) for a, b in re.findall(pat, s)]


def _lists(s, pat):
    m = re.search(pat, s)
    return [[float(v) for v in g.split(',')] for g in m.groups()]


def _raw(s, pat):
    m = re.search(pat, s)
    return [[v.strip() for v in g.split(',')] for g in m.groups()]


def _deg(s, pat):
    return grab(s, pat)


# ── 16.2 ──
F('Two towns lie on the same line of longitude, at latitudes 32° N and 47° N', lambda s: latitude(
    'Two towns on one meridian', 'Cross-section of the Earth through its axis. Two towns on the same line of longitude, at latitudes 32° N and 47° N, with the radii to each town drawn from the centre and the surface arc between them highlighted.',
    [(_deg(s, r'latitudes (\d+)° N'), '32° N'), (_deg(s, r'and (\d+)° N'), '47° N')], arc=True))
F('A ship sails due north along a line of longitude, from latitude 5° S to latitude 12° N', lambda s: latitude(
    'Sailing along a meridian', 'Cross-section of the Earth through its axis. The ship starts at latitude 5° S and sails north along the surface to latitude 12° N; the arc it sails along is highlighted.',
    [(-_deg(s, r'from latitude (\d+)° S'), '5° S'), (_deg(s, r'to latitude (\d+)° N'), '12° N')], arc=True))
F('London is at latitude 51.5° N. The Earth (radius 6.37 × 10⁶ m) rotates once every 24.0 hours', lambda s: latitude(
    'London on the rotating Earth', 'Cross-section of the Earth through its axis. London is at latitude 51.5° N; the radius R from the centre to London and the horizontal distance R cos 51.5° from the axis to London are drawn.',
    [(_deg(s, r'latitude ([\d.]+)° N'), 'London, 51.5° N')], axis_radius='R cos 51.5°'))
F('Compare a site at latitude 30.0° N', lambda s: latitude(
    'Launch site at 30° N', 'Cross-section of the Earth through its axis. A launch site at latitude 30.0° N, with its distance r from the Earth\'s axis drawn as a horizontal line.',
    [(_deg(s, r'latitude ([\d.]+)° N'), 'site, 30.0° N')], axis_radius='r'))
F('A bicycle chain links a front sprocket of radius 10.0 cm to a rear sprocket of radius 4.0 cm', lambda s: belt_drive(
    'Bicycle chain drive', 'A front sprocket of radius 10.0 cm linked by a chain to a rear sprocket of radius 4.0 cm, drawn to scale.',
    grab(s, r'front sprocket of radius ([\d.]+) cm'), grab(s, r'rear sprocket of radius ([\d.]+) cm'),
    ('front sprocket', 'radius 10.0 cm'), ('rear sprocket', 'radius 4.0 cm'), chain=True))
F('a belt runs without slipping round a motor pulley of radius 2.5 cm and a lathe pulley of radius 15 cm', lambda s: belt_drive(
    'Belt drive', 'A motor pulley of radius 2.5 cm joined by a belt to a lathe pulley of radius 15 cm, drawn to scale.',
    grab(s, r'motor pulley of radius ([\d.]+) cm'), grab(s, r'lathe pulley of radius ([\d.]+) cm'),
    ('motor pulley', 'radius 2.5 cm'), ('lathe pulley', 'radius 15 cm')))
F('A motor turns a small pulley of radius 3.0 cm at a frequency of 50 Hz', lambda s: belt_drive(
    'Belt drive', 'A small pulley of radius 3.0 cm, turned by a motor at 50 Hz, joined by a belt to a large pulley of radius 9.0 cm, drawn to scale.',
    grab(s, r'small pulley of radius ([\d.]+) cm'), grab(s, r'large pulley of radius ([\d.]+) cm'),
    ('small pulley, 50 Hz', 'radius 3.0 cm'), ('large pulley', 'radius 9.0 cm')))
F('A student films a turntable and records the angle θ turned at time t', lambda s: (lambda t, th, raw: table_plot(
    ['t / s'] + raw[0], [['θ / rad'] + raw[1]], 'Angle against time',
    'Table and graph of the angle turned by the turntable against time: the points lie on a straight line through the origin.',
    dict(xlabel='t / s', ylabel='θ / rad', series=[dict(x=t, y=th, kind='points')], xr=(0, 2.2), yr=(0, 7),
         xticks=[0, 0.5, 1.0, 1.5, 2.0], yticks=[0, 1, 2, 3, 4, 5, 6, 7], h=240)))(
    *_lists(s, r't = ([\d., ]+) s; θ = ([\d., ]+) rad'), _raw(s, r't = ([\d., ]+) s; θ = ([\d., ]+) rad')))
F('A rotating platform at a science museum is timed', lambda s: (lambda pts: plot(
    't / s', 'θ / rad', [dict(x=[a for a, _ in pts], y=[b for _, b in pts], kind='points')], 'Angular position against time',
    'Graph of the platform\'s angular position against time from 0 to 8.0 s: the points lie close to a straight line through the origin.',
    xr=(0, 9), yr=(0, 5), xticks=[0, 2, 4, 6, 8], yticks=[0, 1, 2, 3, 4, 5]))(
    _pairs(s, r'at ([\d.]+) s, ([\d.]+) rad')))

# ── 16.3 ──
F('A child on a roundabout moves at a steady 3.0 m s⁻¹. Calculate the size of the change in velocity when the child has moved through 60°', lambda s: (lambda a: circle_turn(
    'Two positions on a roundabout', 'Top view of the child\'s circular path. The child moves anticlockwise at 3.0 m s⁻¹; two positions 60° apart around the centre are shown with the velocity at each, along the tangent.',
    [-a / 2, a / 2], '3.0 m s⁻¹', angle_label='60°'))(grab(s, r'through (\d+)°')))
F('A racing car drives round a circular track at 20 m s⁻¹. Calculate the magnitude of its change in velocity as it moves round an arc that subtends 120°', lambda s: (lambda a: circle_turn(
    'Two positions on a circular track', 'Top view of the circular track. The car moves anticlockwise at 20 m s⁻¹; two positions on an arc subtending 120° at the centre are shown with the velocity at each, along the tangent.',
    [-a / 2, a / 2], '20 m s⁻¹', angle_label='120°'))(grab(s, r'subtends (\d+)°')))
F('A fairground horse on a carousel moves at 2.4 m s⁻¹', lambda s: (lambda a: circle_turn(
    'Two positions on a carousel', 'Top view of the carousel. The horse moves anticlockwise at 2.4 m s⁻¹; two positions 30° apart about the axis are shown with the velocity at each, along the tangent.',
    [-a / 2, a / 2], '2.4 m s⁻¹', angle_label='30°'))(grab(s, r'through (\d+)°')))
F('A car is driving round a circular bend at a steady 15 m s⁻¹. At one instant it is heading due east', lambda s: (lambda a: circle_turn(
    'Car on a circular bend', 'Top view with north up the page. The car goes anticlockwise round the bend at 15 m s⁻¹: first heading due east, then 3.0 s later heading 40° north of east. The radii to the two positions make 40° at the centre.',
    [-90, -90 + a], '15 m s⁻¹', angle_label='40°', north=True,
    labels=[('heading east', -12, 22, 'end'), ('3.0 s later', 14, 4, 'start')]))(grab(s, r'heading (\d+)° north of east')))
F('An airliner in a holding pattern flies at a steady 150 m s⁻¹ round a circle', lambda s: circle_turn(
    'Holding pattern', 'Top view with north up the page. The airliner flies clockwise round the circle at 150 m s⁻¹: first heading north on the west side of the circle, then heading east at the north side.',
    [180, 90], '150 m s⁻¹', ccw=False, north=True, w=400, cx=220,
    labels=[('heading north', -14, 26, 'end'), ('heading east', 14, -16, 'start')]))
F('A puck on frictionless ice is tied by a string to a pin and moves in a circle of radius 2.0 m at 3.0 m s⁻¹', lambda s: circle_turn(
    'Puck on a string', 'Top view with north up the page. The puck moves anticlockwise at 3.0 m s⁻¹ round a pin on a circle of radius 2.0 m. It is shown due east of the pin, moving north, at the moment the string breaks.',
    [0], '3.0 m s⁻¹', R_label='2.0 m', north=True, centre_label='pin', labels=[('puck', 14, 16, 'start')]))
F('A particle moves anticlockwise round a circle of radius 0.50 m at a constant 2.0 m s⁻¹. Take the centre as origin', lambda s: circle_turn(
    'Particle on a circle', 'Axes with origin at the centre of a circle of radius 0.50 m. The particle moves anticlockwise at 2.0 m s⁻¹; it is shown at (0.50 m, 0) and at (0, 0.50 m) with its velocity at each.',
    [0, 90], '2.0 m s⁻¹', axes=True, w=420, cx=190,
    labels=[('(0.50 m, 0)', 12, 18, 'start'), ('(0, 0.50 m)', 12, -18, 'start')]))

# ── 16.4 ──
F('The angle turned by a rotating shop sign is recorded', lambda s: (lambda pts: plot(
    't / s', 'θ / rad', [dict(x=[a for a, _ in pts], y=[b for _, b in pts], kind='points')], 'Angle against time',
    'Graph of the angle turned by the shop sign against time from 0 to 6.0 s: the points lie on a straight line through the origin.',
    xr=(0, 6.6), yr=(0, 9), xticks=[0, 1.5, 3.0, 4.5, 6.0], yticks=[0, 2, 4, 6, 8]))(
    _pairs(s, r't = ([\d.]+) s, θ = ([\d.]+)')))
F('On a bicycle, the pedals turn a front cog with 40 teeth', lambda s: belt_drive(
    'Front and rear cogs', 'A front cog with 40 teeth linked by a chain to a rear cog with 15 teeth; the cog sizes are in the ratio of their numbers of teeth.',
    grab(s, r'front cog with (\d+) teeth'), grab(s, r'rear cog with (\d+) teeth'),
    ('front cog (pedals)', '40 teeth'), ('rear cog', '15 teeth'), chain=True))

# ── 16.5 ──
F('A child of mass 35 kg on a swing passes through the lowest point at 3.0 m s⁻¹', lambda s: swing(
    'Swing at its lowest point', 'A child\'s swing hanging from chains 2.5 m long, shown at the lowest point of its arc, moving at 3.0 m s⁻¹.',
    L_label='2.5 m', v_label='3.0 m s⁻¹'))
F('A bucket and water of total mass 0.40 kg is swung in a vertical circle of radius 0.75 m', lambda s: vertical_circle(
    'Bucket in a vertical circle', 'Side view. A bucket of water swung in a vertical circle of radius 0.75 m from a hand at the centre, shown at the bottom of the circle moving at 5.0 m s⁻¹.',
    r_label='0.75 m', at='bottom', v_label='5.0 m s⁻¹', obj='bucket', hand='hand'))
F('A ball of mass 0.50 kg on a string of length 0.80 m is swung in a vertical circle. At the bottom its speed is 7.0 m s⁻¹', lambda s: vertical_circle(
    'Ball in a vertical circle', 'Side view. A ball on a string of length 0.80 m swung in a vertical circle, shown at the bottom moving at 7.0 m s⁻¹.',
    r_label='0.80 m', at='bottom', v_label='7.0 m s⁻¹'))
F('A roller-coaster car goes round a vertical loop of radius 8.0 m', lambda s: vertical_circle(
    'Roller-coaster loop', 'Side view of a vertical loop of track of radius 8.0 m, with the car on the inside of the track at the top of the loop.',
    r_label='8.0 m', at='top', obj='car', string=False, track=True))
F('A "rotor" fairground ride is a vertical cylinder of radius 3.0 m', lambda s: rotor(
    'Rotor ride', 'Side view of the rotor: a vertical cylinder of radius 3.0 m spinning about its axis at 24 rev min⁻¹, with a rider pressed against the inside of the wall after the floor drops away.', '3.0 m'))
F('A small block of mass 0.15 kg sits on a horizontal turntable 0.12 m from the axis', lambda s: turntable(
    'Block on a turntable', 'Top view of the turntable rotating about its centre. The block is 0.12 m from the axis; its later position, 0.24 m from the axis, is shown dashed.',
    [grab(s, r'turntable ([\d.]+) m from'), grab(s, r'moved to ([\d.]+) m from')], ['0.12 m', '0.24 m']))
F('A 0.20 kg mass is attached to a spring of natural length 0.30 m and stiffness 80 N m⁻¹', lambda s: turntable(
    'Mass whirled on a spring', 'Top view of a smooth table. A mass on a spring attached to a central peg moves in a horizontal circle; the stretched spring is 0.35 m long.',
    [grab(s, r'stretches to ([\d.]+) m')], ['0.35 m'], spring=True))

# ── 16.6 ──
F('A science-fiction space station is a ring of radius 1.8 km', lambda s: ring_station(
    'Rotating space station', 'A ring-shaped space station of radius 1.8 km rotating about its hub; an astronaut stands on the inside of the outer wall with their head towards the centre.', '1.8 km'))
F('A mass of 0.40 kg on a string of length 1.2 m moves in a horizontal circle as a conical pendulum', lambda s: conical(
    'Conical pendulum', 'A conical pendulum: a 0.40 kg mass on a string of length 1.2 m moves in a horizontal circle of radius r, with the string at 30° to the vertical.',
    '1.2 m', grab(s, r'making (\d+)° with'), '30°'))
F('A student whirls a bung on a string in a horizontal circle of radius 0.60 m and measures the tension F', lambda s: (lambda v, f: table_plot(
    ['v / m s⁻¹'] + [f'{x:.1f}' for x in v], [['F / N'] + [f'{x:.2f}' for x in f]], 'Tension against speed',
    'Table and graph of the string tension F against the bung\'s speed v for a circle of radius 0.60 m: F rises more and more steeply as v increases.',
    dict(xlabel='v / m s⁻¹', ylabel='F / N', series=[dict(x=v, y=f, kind='points')], xr=(0, 4.5), yr=(0, 7),
         xticks=[0, 1, 2, 3, 4], yticks=[0, 1, 2, 3, 4, 5, 6, 7], h=240)))(
    *_lists(s, r'v = ([\d., ]+) m s⁻¹ gives F = ([\d., ]+) N')))

# ── 16.7 ──
F('A 1200 kg car goes over the top of a hump-backed bridge, a circular arc of radius 40 m, at 12 m s⁻¹', lambda s: road_profile(
    'Hump-backed bridge', 'Side view of a hump-backed bridge whose top is a circular arc of radius 40 m, with the car at the top moving at 12 m s⁻¹.',
    'hump', 'radius 40 m', '12 m s⁻¹'))
F('A rally car approaches a crest whose top is a circular arc of radius 20 m', lambda s: road_profile(
    'Crest in the road', 'Side view of a crest whose top is a circular arc of radius 20 m, with the rally car at the top.',
    'hump', 'radius 20 m'))
F('A 55 kg roller-coaster rider passes through the bottom of a dip, a circular arc of radius 8.0 m, at 6.0 m s⁻¹', lambda s: road_profile(
    'Bottom of a dip', 'Side view of a dip in the roller-coaster track, a circular arc of radius 8.0 m, with the car at the bottom moving at 6.0 m s⁻¹.',
    'dip', 'radius 8.0 m', '6.0 m s⁻¹'))
F('A car of mass 1000 kg drives at a constant 20 m s⁻¹ over a hump and then through a dip', lambda s: road_profile(
    'Hump and dip', 'Side view of a road with a hump followed by a dip, both circular arcs of radius 60 m, with their centres marked; the car is at the top of the hump moving at 20 m s⁻¹.',
    'both', 'radius 60 m', '20 m s⁻¹', w=480, h=270))
F('A bend of radius 120 m is banked at 15° to the horizontal', lambda s: banked_track(
    'Banked bend', 'Cross-section of a bend of radius 120 m banked at 15° to the horizontal, with a car on the slope; the centre of the bend is on the lower side.',
    grab(s, r'banked at (\d+)°'), '15°', 'radius 120 m'))
F('A motorway engineer wants cars to take a curve of radius 250 m at 25 m s⁻¹ with no sideways friction', lambda s: banked_track(
    'Banked curve', 'Cross-section of a curve of radius 250 m banked at an angle θ to the horizontal, with a car on the slope; the centre of the curve is on the lower side.',
    math.degrees(math.atan(grab(s, r'at (\d+) m s⁻¹') ** 2 / (grab(s, r'radius (\d+) m') * 9.81))), 'θ', 'radius 250 m'))
F('A bend of radius 90 m is banked at 12°. A car of mass 1500 kg goes round it at 20 m s⁻¹', lambda s: banked_track(
    'Banked bend', 'Cross-section of a bend of radius 90 m banked at 12° to the horizontal, with the car on the slope; the centre of the bend is on the lower side.',
    grab(s, r'banked at (\d+)°'), '12°', 'radius 90 m'))
F('A ball of mass 0.15 kg hangs from a string of length 0.80 m and moves in a horizontal circle so that the string makes 40° with the vertical', lambda s: conical(
    'Conical pendulum', 'A conical pendulum: a 0.15 kg ball on a string of length 0.80 m moves in a horizontal circle of radius r, with the string at 40° to the vertical.',
    '0.80 m', grab(s, r'string makes (\d+)° with'), '40°'))
F('A stunt rider takes a curve of radius 12 m on a track banked at 30°', lambda s: banked_track(
    'Banked track', 'Cross-section of a track banked at 30° to the horizontal on a curve of radius 12 m, with the rider\'s vehicle on the slope; the centre of the curve is on the lower side.',
    grab(s, r'banked at (\d+)°'), '30°', 'radius 12 m'))
F('A 45 kg child on a playground swing (chains 2.0 m long) has a speed of 4.0 m s⁻¹ at the lowest point', lambda s: swing(
    'Swing at its lowest point', 'A playground swing hanging from chains 2.0 m long, shown at the lowest point of its arc, moving at 4.0 m s⁻¹.',
    L_label='2.0 m', v_label='4.0 m s⁻¹'))
F('A railway engineer wants trains to take a curve of radius 800 m at 40 m s⁻¹', lambda s: banked_track(
    'Banked railway curve', 'Cross-section of a railway curve of radius 800 m with the track banked at an angle θ to the horizontal; the centre of the curve is on the lower side.',
    math.degrees(math.atan(grab(s, r'at (\d+) m s⁻¹') ** 2 / (grab(s, r'radius (\d+) m') * 9.81))), 'θ', 'radius 800 m'))
F('A pilot pulls out of a dive at the bottom of a vertical circle of radius 400 m at 120 m s⁻¹', lambda s: vertical_circle(
    'Pulling out of a dive', 'Side view of the aircraft at the bottom of a vertical circle of radius 400 m, moving horizontally at 120 m s⁻¹.',
    r_label='400 m', at='bottom', v_label='120 m s⁻¹', obj='plane', string=False))
F('An Olympic cyclist rides round a velodrome bend of radius 25 m banked at 42°', lambda s: banked_track(
    'Velodrome bend', 'Cross-section of a velodrome bend of radius 25 m banked at 42° to the horizontal; the centre of the bend is on the lower side.',
    grab(s, r'banked at (\d+)°'), '42°', 'radius 25 m'))
F('A stone of mass 0.15 kg is whirled in a vertical circle of radius 0.70 m on a string. At the top it moves at 4.0 m s⁻¹', lambda s: vertical_circle(
    'Stone at the top of a vertical circle', 'Side view. A stone on a string whirled in a vertical circle of radius 0.70 m, shown at the top of the circle moving at 4.0 m s⁻¹.',
    r_label='0.70 m', at='top', v_label='4.0 m s⁻¹'))
F('A pendulum bob of mass 0.25 kg on a string of length 0.50 m is released from rest at a height 0.30 m above its lowest point', lambda s: swing(
    'Pendulum released from rest', 'A pendulum on a string of length 0.50 m released from rest (dashed) at a height of 0.30 m above its lowest point, and shown at the lowest point.',
    L_label='0.50 m', release=(grab(s, r'length ([\d.]+) m'), grab(s, r'height ([\d.]+) m'), '0.30 m'), bob='ball'))
