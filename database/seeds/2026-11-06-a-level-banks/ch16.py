# Chapter 16 Circular motion — 16.2 to 16.7 (16.1 already has 55 and is not topped up).
# Executed by ../2026-11-06-a-level-banks.py with _lib.py in scope.

# ═════════════════════════ 16.2 Radians and angular speed ═════════════════════════
lesson('16.2')

d_ = Q('75°'); th = radians(d_.v)
N('E', 1, f'A door swings open through an angle of {d_}. Convert this angle to radians.', th, 'rad',
  f'θ in radians = 75 × π ÷ 180 = {sf(th)} rad', [], aq='θ')
d_ = Q('210°'); th = radians(d_.v)
N('E', 1, f'Between 1 o\'clock and 8 o\'clock the hour hand of a clock turns through {d_}. Express this angle in radians.', th, 'rad',
  f'θ = 210 × π ÷ 180 = {sf(th)} rad (7π/6)', [], aq='θ')
r_ = Q('1.20 rad'); dg = degrees(r_.v)
N('E', 1, f'A radar dish is rotated through {r_} to track an aircraft. What is this angle in degrees?', dg, '°',
  f'angle in degrees = 1.20 × 180 ÷ π = {sf(dg)}°', [], aq='angle')
r_ = Q('0.35 rad'); dg = degrees(r_.v)
N('E', 1, f'The arm of a metronome swings through {r_} from one side to the other. Find the angle in degrees.', dg, '°',
  f'angle = 0.35 × 180 ÷ π = {sf(dg, 2)}°', [], sig=2, aq='angle')
L_, a_ = Q('0.80 m'), Q('0.25 rad'); s_ = L_.v * a_.v
N('E', 2, f'A pendulum bob hangs on a string of length {L_}. It swings through an angle of {a_}. Calculate the length of the arc it moves along.', s_, 'm',
  f'Arc length s = rθ (θ in radians) = 0.80 × 0.25 = {sf(s_, 2)} m', ['C1: s = rθ with θ in radians'], sig=2, aq='s')
r_, s2 = Q('0.34 m'), Q('0.85 m'); th = s2.v / r_.v
N('E', 2, f'The valve on a bicycle wheel is {r_} from the axle. It moves {s2} along its circular path. Through what angle, in radians, has the wheel turned?', th, 'rad',
  f'θ = s/r = 0.85 ÷ 0.34 = {sf(th, 2)} rad', ['C1: θ = s/r'], sig=2, aq='θ')
T_ = Q('0.40 s'); w = 2 * pi / T_.v
N('E', 2, f'A ceiling fan completes one revolution every {T_}. Calculate its angular speed.', w, 'rad s⁻¹',
  f'ω = 2π/T = 2π ÷ 0.40 = {sf(w)} rad s⁻¹', ['C1: ω = 2π/T'], aq='ω')
n_ = Q('7200 rev min⁻¹'); w = n_.v
N('E', 2, f'A computer hard-disk platter is rated at {n_}. Express this as an angular speed in rad s⁻¹.', w, 'rad s⁻¹',
  f'7200 ÷ 60 = 120 revolutions per second. ω = 2π × 7200 ÷ 60 = {sf(w)} rad s⁻¹',
  ['C1: ÷ 60 and × 2π'], aq='ω')
w_ = Q('2.1 rad s⁻¹'); T = 2 * pi / w_.v
N('E', 2, f'A playground roundabout turns with an angular speed of {w_}. How long does it take to go round once?', T, 's',
  f'T = 2π/ω = 2π ÷ 2.1 = {sf(T, 2)} s', ['C1: T = 2π/ω'], sig=2, aq='T')
M('E', 1, 'Which statement defines the radian?',
  'The angle subtended at the centre of a circle by an arc equal in length to the radius',
  ['The angle subtended at the centre of a circle by an arc equal in length to the diameter',
   'One three-hundred-and-sixtieth of a complete revolution',
   'The angle turned through in one second by an object moving in a circle'],
  'One radian is the angle at the centre of a circle when the arc length equals the radius, so θ = s/r. A full circle is 2π rad = 360°. The other options describe 2 rad, one degree and the angular speed.')
M('E', 1, 'How many radians are there in one complete revolution?', '2π', ['π', '360', 'π/2'],
  'The circumference is 2πr, so the angle for a full circle is s/r = 2πr/r = 2π rad (= 360°).')

# ── medium ──
n_, t_ = Q('90 rev min⁻¹'), Q('2.5 s'); w = n_.v; th = w * t_.v
N('M', 3, f'A potter\'s wheel rotates steadily at {n_}. Calculate the angle, in radians, that it turns through in {t_}.', th, 'rad',
  f'ω = 2π × 90 ÷ 60 = {sf(w)} rad s⁻¹. θ = ωt = {sf(w)} × 2.5 = {sf(th)} rad',
  ['C1: ω = 2π × (rev per min) ÷ 60', 'C1: θ = ωt'], aq='θ',
  cm='using the revolutions per minute directly as ω, without converting minutes to seconds and revolutions to radians.')
t_ = Q('4.0 s'); th = 33 * 2 * pi / 60 * t_.v
N('M', 3, f'A turntable plays a record at 33 rev min⁻¹. A dust particle sits on the record. How many degrees does it turn through in {t_}?', degrees(th), '°',
  f'ω = 2π × 33 ÷ 60 = {sf(33 * 2 * pi / 60)} rad s⁻¹. θ = ωt = {sf(33 * 2 * pi / 60)} × 4.0 = {sf(th)} rad. In degrees: {sf(th)} × 180 ÷ π = {sf(degrees(th))}°',
  ['C1: ω in rad s⁻¹', 'C1: θ = ωt', 'C1: conversion to degrees'], aq='θ')
T_, r_ = Q('24.0 h'), Q('6.37 × 10⁶ m'); w = 2 * pi / T_.v; v = w * r_.v
N('M', 3, f'The Earth turns once on its axis every {T_}. Its equatorial radius is {r_}. Calculate the speed of a point on the Equator due to this rotation.', v, 'm s⁻¹',
  f'T = 24.0 × 3600 = 86400 s. ω = 2π ÷ 86400 = {sf(w)} rad s⁻¹. v = ωr = {sf(w)} × 6.37 × 10⁶ = {sf(v)} m s⁻¹',
  ['C1: ω = 2π/T with T in seconds', 'C1: v = ωr'], aq='v')
T_, r_ = Q('4.2 s'), Q('45 m'); v = 2 * pi * r_.v / T_.v
N('M', 3, f'The blades of a large wind turbine are {r_} long and turn once every {T_}. Calculate the speed of a blade tip.', v, 'm s⁻¹',
  f'ω = 2π/T = 2π ÷ 4.2 = {sf(2 * pi / 4.2)} rad s⁻¹. v = ωr = {sf(2 * pi / 4.2)} × 45 = {sf(v)} m s⁻¹',
  ['C1: ω = 2π/T', 'C1: v = ωr'], aq='v')
M('M', 3, 'A rigid disc rotates at a steady rate. Point X is 4.0 cm from the axis and point Y is 12.0 cm from the axis. Which row compares their angular speeds ω and their speeds v?',
  'ω the same for both; v of Y is three times v of X',
  ['ω of Y is three times ω of X; v the same for both', 'ω the same for both; v the same for both', 'ω of X is three times ω of Y; v of Y is three times v of X'],
  'Every point on a rigid rotating body turns through the same angle in the same time, so ω is the same. v = ωr, so v ∝ r: Y is 3 times as far from the axis and moves 3 times as fast.',
  ['C1: all points on a rigid body have the same ω', 'C1: v = ωr so v is proportional to r'],
  cm='thinking the outer point turns "faster" in angle. It covers more distance, not more angle.')
M('M', 3, 'A car travels round a roundabout. Its front-left and front-right wheels have the same diameter. The left wheels are on the inside of the bend. Which statement is correct?',
  'The right wheels have the larger angular speed about their axles',
  ['The left wheels have the larger angular speed about their axles', 'Both have the same angular speed because the wheels are identical', 'Both have the same linear speed because they are on the same car'],
  'The outer (right) wheels travel round a larger circle in the same time, so they cover a greater distance and have a higher linear speed. For a rolling wheel v = ωr with the same wheel radius, so the right wheels must spin faster about their axles. (This is why a car needs a differential.)',
  ['C1: outer wheels cover a larger circle in the same time, so larger v', 'C1: v = ωr for rolling, same r so larger ω'])
s_, d_ = Q('62 m'), Q('150°'); th = radians(d_.v); r = s_.v / th
N('M', 3, f'An athlete running round the curved end of a track covers {s_} while her direction of motion turns through {d_}. Calculate the radius of the curve.', r, 'm',
  f'θ = 150 × π ÷ 180 = {sf(th)} rad. r = s/θ = 62 ÷ {sf(th)} = {sf(r)} m',
  ['C1: θ converted to radians', 'C1: r = s/θ'], aq='r', cm='dividing the arc length by the angle in degrees.')
r_, d_ = Q('1.8 km'), Q('24°'); s = r_.v * radians(d_.v)
N('M', 3, f'A railway curve has a radius of {r_}. Along the curve the direction of the track changes by {d_}. Calculate the length of track on the curve.', s, 'm',
  f'θ = 24 × π ÷ 180 = {sf(radians(24))} rad. s = rθ = 1800 × {sf(radians(24))} = {sf(s)} m',
  ['C1: angle in radians', 'C1: s = rθ with r in m'], aq='s')
N('M', 3, 'Calculate the ratio (angular speed of the minute hand of a clock) / (angular speed of the hour hand).', 12, None,
  'Minute hand: T = 3600 s. Hour hand: T = 12 h = 43200 s. ω = 2π/T, so the ratio = (2π/3600)/(2π/43200) = 12',
  ['C1: period of hour hand is 12 h, of minute hand 1 h', 'C1: ω ∝ 1/T'], sig=2, aq='ratio',
  cm='taking the hour hand period as 24 h — it goes round twice a day.')
w_, t_ = Q('420 rad s⁻¹'), Q('30 s'); nrev = w_.v * t_.v / (2 * pi)
N('M', 3, f'A laboratory centrifuge spins at {w_} for {t_}. How many revolutions does it make?', nrev, None,
  f'Angle = ωt = 420 × 30 = 12600 rad. Revolutions = 12600 ÷ 2π = {sf(nrev)}',
  ['C1: θ = ωt', 'C1: number of revolutions = θ/2π'], aq='number of revolutions', tol=0.02)
N('M', 3, 'A flywheel turning at 95 rad s⁻¹ is used to store energy. Calculate the time it takes to complete 18 revolutions.', 18 * 2 * pi / 95, 's',
  f'18 revolutions = 18 × 2π = {sf(36 * pi)} rad. t = θ/ω = 36π ÷ 95 = {sf(36 * pi / 95)} s',
  ['C1: angle = 2π × number of revolutions', 'C1: t = θ/ω'], aq='t')
dth = radians(15); s_ = 6.37e6 * dth
N('M', 4, 'Two towns lie on the same line of longitude, at latitudes 32° N and 47° N. Treat the Earth as a sphere of radius 6.37 × 10⁶ m. Calculate the distance between them measured along the Earth\'s surface.', s_, 'm',
  f'Angle at the Earth\'s centre = 47 − 32 = 15° = 15 × π ÷ 180 = {sf(dth)} rad. s = rθ = 6.37 × 10⁶ × {sf(dth)} = {sf(s_)} m',
  ['C1: angle at centre is the difference in latitude', 'C1: conversion to radians', 'C1: s = rθ'], aq='s')
dth = radians(17); s_ = 6.37e6 * dth
N('M', 4, 'A ship sails due north along a line of longitude, from latitude 5° S to latitude 12° N. The Earth\'s radius is 6.37 × 10⁶ m. How far does the ship sail?', s_, 'm',
  f'The positions are on opposite sides of the Equator, so the angle at the centre is 5 + 12 = 17° = {sf(dth)} rad. s = rθ = 6.37 × 10⁶ × {sf(dth)} = {sf(s_)} m',
  ['C1: angle 17° (latitudes added across the Equator)', 'C1: conversion to radians', 'C1: s = rθ'], aq='s',
  cm='subtracting 5 from 12: the two positions are on opposite sides of the Equator.')
na_ = Q('1.5 rev s⁻¹'); wa = na_.v; wb = wa * 10.0 / 4.0
N('M', 4, f'A bicycle chain links a front sprocket of radius 10.0 cm to a rear sprocket of radius 4.0 cm. The rider turns the pedals (and the front sprocket) at {na_}. Calculate the angular speed of the rear sprocket.', wb, 'rad s⁻¹',
  f'ω₁ = 2π × 1.5 = {sf(wa)} rad s⁻¹. The chain moves at the same speed round both sprockets, so ω₁r₁ = ω₂r₂ and ω₂ = ω₁r₁/r₂ = {sf(wa)} × 10.0 ÷ 4.0 = {sf(wb)} rad s⁻¹',
  ['C1: ω₁ = 2πf', 'C1: same chain speed at both sprockets', 'C1: ω₂ = ω₁r₁/r₂'], aq='ω₂',
  cm='assuming the two sprockets have the same angular speed.')
wb = 2 * pi * 24 * 2.5 / 15
N('M', 4, 'In a workshop, a belt runs without slipping round a motor pulley of radius 2.5 cm and a lathe pulley of radius 15 cm. The motor pulley makes 24 revolutions every second. Find the angular speed of the lathe pulley.', wb, 'rad s⁻¹',
  f'ω_motor = 2π × 24 = {sf(2 * pi * 24)} rad s⁻¹. Same belt speed: ω_lathe = ω_motor × r_motor/r_lathe = {sf(2 * pi * 24)} × 2.5 ÷ 15 = {sf(wb)} rad s⁻¹',
  ['C1: ω = 2πf', 'C1: v the same at both pulleys', 'C1: ratio of radii'], aq='ω')
M('M', 3, 'A gymnast does a complete somersault (one full turn) in 0.80 s. A diver does 2½ somersaults in 1.6 s. Which statement about their average angular speeds is correct?',
  'The diver\'s average angular speed is 1.25 times the gymnast\'s',
  ['The gymnast\'s average angular speed is 1.25 times the diver\'s', 'They have the same average angular speed', 'The diver\'s average angular speed is 2.5 times the gymnast\'s'],
  'Gymnast: ω = 2π ÷ 0.80 = 7.85 rad s⁻¹. Diver: ω = 2.5 × 2π ÷ 1.6 = 9.82 rad s⁻¹. Ratio = 9.82 ÷ 7.85 = 1.25.',
  ['C1: ω = θ/t for each', 'C1: ratio'])
th_ = Q('0.60 rad'); t_ = Q('0.15 s'); w = th_.v / t_.v
N('M', 3, f'A golfer\'s club swings through {th_} in {t_} just before it hits the ball. The club head is 1.1 m from the golfer\'s shoulders, the centre of the swing. Estimate the speed of the club head, assuming steady rotation.', w * 1.1, 'm s⁻¹',
  f'ω = θ/t = 0.60 ÷ 0.15 = {sf(w)} rad s⁻¹. v = ωr = {sf(w)} × 1.1 = {sf(w * 1.1, 2)} m s⁻¹',
  ['C1: ω = θ/t', 'C1: v = ωr'], sig=2, aq='v')
M('M', 3, 'A wheel of radius 0.30 m rotates at 4.0 rad s⁻¹. A student says the rim moves at 4.0 × 0.30 × 2π m s⁻¹. What is wrong with this?',
  'The factor 2π should not be there: v = ωr already gives the speed in m s⁻¹ when ω is in rad s⁻¹',
  ['Nothing: v = 2πωr', 'The radius should be squared', 'The speed should be ω/r'],
  'The radian is defined by s = rθ, so v = rω directly gives 1.2 m s⁻¹. The 2π belongs only in converting revolutions to radians (ω = 2πf).',
  ['C1: v = ωr with ω in rad s⁻¹', 'C1: 2π only converts revolutions to radians'])

# ── hard ──
for lat in (51.5, 30.0):
    w = 2 * pi / 86400
    r = 6.37e6 * cos(radians(lat))
    v = w * r
    stem = (f'London is at latitude {lat}° N. The Earth (radius 6.37 × 10⁶ m) rotates once every 24.0 hours. (a) Calculate the angular speed of the Earth. (b) Explain why London moves in a circle of radius R cos {lat}°, and calculate this radius. (c) Calculate the speed of London due to the Earth\'s rotation. Give only the answer to (c).'
            if lat == 51.5 else
            f'A rocket launch site is chosen close to the Equator because the Earth\'s spin gives a rocket a "free" eastward speed. Compare a site at latitude {lat}° N. (a) Show that the Earth\'s angular speed is 7.27 × 10⁻⁵ rad s⁻¹ (period 24.0 h). (b) Find the distance of the {lat}° N site from the Earth\'s axis (Earth radius 6.37 × 10⁶ m). (c) Calculate the eastward speed the site has because of the rotation. Give only the answer to (c).')
    N('H', 5, stem, v, 'm s⁻¹',
      f'(a) ω = 2π/T = 2π ÷ 86400 = {sf(w)} rad s⁻¹. (b) The point circles the Earth\'s axis, so its radius is its perpendicular distance from the axis, R cos(latitude) = 6.37 × 10⁶ × cos {lat} = {sf(r)} m. (c) v = ωr = {sf(w)} × {sf(r)} = {sf(v)} m s⁻¹',
      ['C1: T = 86 400 s', 'A1: ω = 7.27 × 10⁻⁵ rad s⁻¹', 'B1: r = R cos(latitude), perpendicular distance to the axis', 'C1: v = ωr'], aq='v',
      cm='using the Earth\'s radius R as the radius of the circle. Only a point on the Equator moves in a circle of radius R.')
v_, D_, s_ = Q('25 m s⁻¹'), Q('0.62 m'), Q('1.0 km')
r = D_.v / 2; w = v_.v / r; rpm = w * 60 / (2 * pi)
N('H', 5, f'A car travels at a steady {v_} on a motorway. Each wheel has diameter {D_} and rolls without slipping. (a) Calculate the angular speed of a wheel. (b) Express this angular speed in rev min⁻¹. (c) Calculate the number of revolutions a wheel makes while the car travels {s_}. Give only the answer to (b).', rpm, 'rev min⁻¹',
  f'(a) r = 0.62 ÷ 2 = {sf(r)} m. ω = v/r = 25 ÷ {sf(r)} = {sf(w)} rad s⁻¹. (b) in rev min⁻¹: {sf(w)} × 60 ÷ (2π) = {sf(rpm)} rev min⁻¹. (c) circumference = 2πr = {sf(2 * pi * r)} m, so revolutions = 1000 ÷ {sf(2 * pi * r, 4)} = {sf(1000 / (2 * pi * r))}',
  ['C1: r = half the diameter', 'A1: ω value', 'C1: × 60 ÷ 2π', 'A1: rev min⁻¹', 'B1: (c) distance ÷ circumference'],
  cm='using the diameter instead of the radius in v = ωr, which halves ω.')
v_, D_ = Q('13.5 m s⁻¹'), Q('0.70 m'); r = D_.v / 2; w = v_.v / r; nrev = 500 / (2 * pi * r)
N('H', 5, f'A rider on a motorbike travels 500 m at {v_}. The motorbike\'s wheels have diameter {D_}. (a) Calculate the time taken. (b) Calculate the angular speed of the wheels. (c) Use your answers to find the number of revolutions each wheel makes. Give only the answer to (c).', nrev, None,
  f'(a) t = 500 ÷ 13.5 = {sf(500 / 13.5)} s. (b) ω = v/r = 13.5 ÷ 0.35 = {sf(w)} rad s⁻¹. (c) angle = ωt = {sf(w)} × {sf(500 / 13.5)} = {sf(w * 500 / 13.5)} rad, revolutions = {sf(w * 500 / 13.5, 4)} ÷ 2π = {sf(nrev)}',
  ['A1: t', 'C1: ω = v/r with r = d/2', 'A1: ω', 'C1: θ = ωt', 'C1: ÷ 2π'], aq='revolutions', tol=0.02)
w = 6.3 / 2.0; v = w * 0.15
N('H', 5, 'A student films a turntable and records the angle θ turned at time t: t = 0, 0.5, 1.0, 1.5, 2.0 s; θ = 0, 1.6, 3.1, 4.7, 6.3 rad. (a) Describe the graph of θ against t and state what it shows about the motion. (b) Determine the angular speed from the gradient. (c) A coin sits 0.15 m from the axis. Calculate its speed. Give only the answer to (c).', v, 'm s⁻¹',
  f'(a) A straight line through the origin: θ ∝ t, so the angular speed is constant. (b) gradient = Δθ/Δt = 6.3 ÷ 2.0 = {sf(w)} rad s⁻¹. (c) v = ωr = {sf(w)} × 0.15 = {sf(v, 2)} m s⁻¹',
  ['B1: straight line through origin', 'B1: constant angular speed', 'C1: gradient = Δθ/Δt', 'A1: ω', 'C1: v = ωr'], sig=2, aq='v',
  cm='using one reading without checking the graph is a straight line through the origin.')
w = 4.5 / 8.0; v = w * 2.4
N('H', 5, 'A rotating platform at a science museum is timed. Its angular position is: at 0 s, 0 rad; at 2.0 s, 1.1 rad; at 4.0 s, 2.3 rad; at 6.0 s, 3.4 rad; at 8.0 s, 4.5 rad. (a) Show that the platform rotates at an approximately constant rate. (b) Use the data to find the period of rotation. (c) A visitor stands 2.4 m from the axis. Calculate the visitor\'s speed. Give only the answer to (c).', v, 'm s⁻¹',
  f'(a) Each 2.0 s interval adds about 1.1 rad, so Δθ/Δt is constant. (b) ω = 4.5 ÷ 8.0 = {sf(w)} rad s⁻¹, T = 2π/ω = {sf(2 * pi / w)} s. (c) v = ωr = {sf(w)} × 2.4 = {sf(v, 2)} m s⁻¹',
  ['B1: equal increases in equal times', 'C1: ω from the data', 'A1: T', 'C1: v = ωr', 'A1: v'], sig=2, aq='v')
L_ = Q('1.2 m'); w = 2 * pi / 3600; v = w * L_.v
N('H', 5, f'The minute hand of the clock on a town hall is {L_} long. (a) Show that its angular speed is about 1.7 × 10⁻³ rad s⁻¹. (b) Calculate the speed of the tip of the hand. (c) Calculate the angle, in degrees, the hand turns through in 10 s. Give only the answer to (b).', v, 'm s⁻¹',
  f'(a) ω = 2π/T = 2π ÷ 3600 = {sf(w)} rad s⁻¹ ≈ 1.7 × 10⁻³ rad s⁻¹. (b) v = ωr = {sf(w)} × 1.2 = {sf(v)} m s⁻¹. (c) angle = ωt = {sf(w)} × 10 = {sf(w * 10)} rad = {sf(degrees(w * 10))}°',
  ['M1: ω = 2π/T with T = 3600 s', 'A1: ω shown to more s.f. than given', 'C1: v = ωr', 'A1: v', 'B1: (c) angle in degrees'], aq='v')
T_, r_ = Q('687 days'), Q('2.28 × 10¹¹ m'); w = 2 * pi / T_.v; arc = w * 86400 * r_.v
N('H', 5, f'Mars moves in an approximately circular orbit of radius {r_} around the Sun with an orbital period of {T_}. (a) Calculate the angular speed of Mars in its orbit. (b) Calculate the distance Mars travels along its orbit in one day. (c) Explain why Mars is accelerating even though its speed is constant. Give only the answer to (b).', arc, 'm',
  f'(a) T = 687 × 86400 = {sf(T_.v)} s, ω = 2π/T = 2π ÷ {sf(T_.v)} = {sf(w)} rad s⁻¹. (b) In one day it turns through ωt = {sf(w)} × 86400 = {sf(w * 86400)} rad, so s = rθ = 2.28 × 10¹¹ × {sf(w * 86400)} = {sf(arc)} m. (c) Its direction of motion changes continuously, so its velocity changes: there is an acceleration towards the Sun.',
  ['C1: T in seconds', 'A1: ω value', 'C1: θ = ωt for one day', 'A1: s', 'B1: velocity direction changes, so acceleration'], aq='s')
T_, r_ = Q('225 days'), Q('1.08 × 10¹¹ m'); w = 2 * pi / T_.v; days = (pi / 2) / w / 86400
N('H', 5, f'Venus orbits the Sun in a circle of radius {r_} with period {T_}. (a) Calculate its angular speed. (b) Calculate its orbital speed. (c) Calculate how many days it takes Venus to move a quarter of the way round its orbit, and explain why equal angles would take unequal times if the orbit were an ellipse. Give only the number of days in (c).', days, 'days',
  f'(a) ω = 2π ÷ (225 × 86400) = {sf(w)} rad s⁻¹. (b) v = ωr = {sf(w)} × 1.08 × 10¹¹ = {sf(w * 1.08e11)} m s⁻¹. (c) For a circle the angular speed is constant, so t = (π/2) ÷ ω = {sf((pi / 2) / w)} s = {sf((pi / 2) / w)} ÷ 86400 = {sf(days)} days. In an ellipse ω is not constant, so equal angles take unequal times.',
  ['A1: ω', 'C1: v = ωr', 'A1: v', 'C1: t = θ/ω with θ = π/2', 'B1: angular speed varies in an ellipse'], aq='t')
w1 = 2 * pi * 50; v = w1 * 0.030; w2 = v / 0.090; t60 = 120 * pi / w2
N('H', 6, 'A motor turns a small pulley of radius 3.0 cm at a frequency of 50 Hz. A belt connects it, without slipping, to a large pulley of radius 9.0 cm. (a) Calculate the angular speed of the small pulley. (b) Calculate the speed of the belt. (c) Calculate the angular speed of the large pulley. (d) Calculate the time taken for the large pulley to make 60 revolutions. Give only the answer to (d).', t60, 's',
  f'(a) ω₁ = 2πf = 2π × 50 = {sf(w1)} rad s⁻¹. (b) v = ω₁r₁ = {sf(w1)} × 0.030 = {sf(v)} m s⁻¹. (c) ω₂ = v/r₂ = {sf(v)} ÷ 0.090 = {sf(w2)} rad s⁻¹. (d) 60 revolutions = 120π rad, t = 120π ÷ {sf(w2, 4)} = {sf(t60)} s',
  ['C1: ω₁ = 2πf', 'C1: v = ω₁r₁', 'C1: belt speed the same at both pulleys', 'C1: ω₂ = v/r₂', 'C1: angle for 60 revolutions = 120π rad', 'A1: t'], aq='t')
f2 = 12 * 5 / 20
N('H', 6, 'A tape drive uses two reels. The tape leaves a full reel of outer radius 20.0 cm and is wound onto an empty hub of radius 5.0 cm at the same tape speed. The hub turns at 12 Hz. (a) Calculate the tape speed. (b) Calculate the frequency of the full reel. (c) Explain what happens to the frequency of the hub as tape builds up on it, if the tape speed stays constant. Give only the answer to (b).', f2, 'Hz',
  f'(a) v = ωr = 2π × 12 × 0.050 = {sf(2 * pi * 12 * 0.05)} m s⁻¹. (b) f = v/(2πr) = {sf(2 * pi * 12 * 0.05, 4)} ÷ (2π × 0.200) = {sf(f2)} Hz. (c) As the radius of tape on the hub grows, f = v/2πr falls: the hub slows down.',
  ['C1: v = ωr = 2πfr', 'A1: v', 'C1: same v at both reels', 'A1: f', 'B1: f ∝ 1/r', 'B1: hub slows as r increases'], aq='f')
N('H', 5, 'A simple pendulum of length 1.50 m is pulled aside until the string makes 12.0° with the vertical, and released. (a) Convert 12.0° to radians. (b) Calculate the length of the arc the bob travels from release to the lowest point. (c) Calculate the straight-line (chord) distance between those two positions and comment on the difference. Give only the answer to (b).', 1.50 * radians(12.0), 'm',
  f'(a) θ = 12.0 × π ÷ 180 = {sf(radians(12.0))} rad. (b) s = rθ = 1.50 × {sf(radians(12.0))} = {sf(1.50 * radians(12.0))} m. (c) chord = 2r sin(θ/2) = 2 × 1.50 × sin 6.0 = {sf(2 * 1.5 * sin(radians(6)))} m: shorter by only about 0.2 %, so for small angles the arc and chord are almost equal.',
  ['C1: θ in radians', 'A1: 0.209 rad', 'C1: s = rθ', 'A1: arc length', 'B1: (c) chord = 2r sin(θ/2) and comparison'], aq='s')
w = 2 * pi / (27.3 * 86400); v = w * 3.84e8
N('H', 5, 'The Moon orbits the Earth at a distance of 3.84 × 10⁸ m with a period of 27.3 days. (a) Calculate the angular speed of the Moon. (b) Calculate the angle, in degrees, the Moon moves round its orbit in one day. (c) Calculate the orbital speed of the Moon. Give only the answer to (c).', v, 'm s⁻¹',
  f'(a) T = 27.3 × 86400 = {sf(27.3 * 86400)} s. ω = 2π ÷ {sf(27.3 * 86400)} = {sf(w)} rad s⁻¹. (b) 360 ÷ 27.3 = {sf(360 / 27.3)}° per day. (c) v = ωr = {sf(w)} × 3.84 × 10⁸ = {sf(v)} m s⁻¹',
  ['C1: T in seconds', 'A1: ω', 'B1: angle per day', 'C1: v = ωr', 'A1: v'], aq='v')

# ═════════════════════════ 16.3 Steady speed, changing velocity ═════════════════════════
lesson('16.3')

M('E', 1, 'An object moves in a circle at constant speed. Which quantity is constant?', 'Its kinetic energy',
  ['Its velocity', 'Its momentum', 'Its acceleration'],
  'Speed is constant, so ½mv² is constant. Velocity, momentum and acceleration are vectors whose directions change continuously round the circle.')
M('E', 1, 'A stone is whirled in a horizontal circle at constant speed. In which direction is its acceleration?', 'Towards the centre of the circle',
  ['Along the tangent, in the direction of motion', 'Outwards, away from the centre', 'Zero, because the speed is constant'],
  'The velocity changes direction, so there is an acceleration. It points in the direction of the change in velocity, which is towards the centre (centripetal).')
M('E', 1, 'At any instant, what is the direction of the velocity of a body moving in a circle?', 'Along the tangent to the circle',
  ['Towards the centre of the circle', 'Away from the centre of the circle', 'Along the radius, in the direction of rotation'],
  'The velocity is always along the tangent, at 90° to the radius. If the centripetal force were removed, the body would carry on along this tangent.')
M('E', 1, 'A car drives round a circular track at a steady 20 m s⁻¹. Which statement is correct?',
  'The car is accelerating because its direction of motion is changing',
  ['The car is not accelerating because its speed is constant', 'The car is accelerating because its speed is increasing', 'The car is in equilibrium because the forces on it balance'],
  'Acceleration is the rate of change of velocity. Velocity is a vector, so a change of direction alone is a change of velocity. The car accelerates towards the centre. There is a resultant force, so it is not in equilibrium.')
M('E', 1, 'The string holding a ball moving in a horizontal circle breaks. Ignoring gravity, how does the ball move immediately afterwards?',
  'In a straight line along the tangent at the point where the string broke',
  ['In a straight line directly away from the centre', 'In a curved path of larger radius', 'In a straight line towards the centre'],
  'Once the string breaks there is no centripetal force, so by Newton\'s first law the ball continues with the velocity it had at that instant: along the tangent.')
M('E', 1, 'Which statement about a body moving in a circle at constant speed is correct?', 'The resultant force on it is perpendicular to its velocity',
  ['The resultant force on it is in the direction of its velocity', 'The resultant force on it is zero', 'The resultant force on it points away from the centre'],
  'The resultant force is centripetal: towards the centre, at right angles to the velocity. Because it is perpendicular to the motion it does no work, so the speed stays constant.')
M('E', 1, 'Why does the centripetal force on a body in uniform circular motion do no work on it?',
  'The force is always perpendicular to the direction of motion',
  ['The force is too small to do work', 'The body returns to its starting point after each revolution', 'The force is balanced by an outward centrifugal force'],
  'Work = Fs cos θ and θ = 90° between the force and the displacement at every instant, so no work is done and the kinetic energy (and speed) stays constant.')
M('E', 1, 'Sparks fly off a grinding wheel that spins at constant speed. In which direction does each spark leave the wheel?', 'Along the tangent to the rim at the point where it leaves',
  ['Radially outwards from the centre', 'Towards the centre of the wheel', 'Vertically downwards'],
  'A spark that breaks free has no centripetal force on it, so it carries on with the velocity it had: along the tangent.')
v_ = Q('6.0 m s⁻¹'); dv = 2 * v_.v
N('E', 2, f'A ball on a string moves in a horizontal circle at a constant speed of {v_}. Calculate the magnitude of its change in velocity between two points on opposite sides of the circle.', dv, 'm s⁻¹',
  'Half a revolution apart, the velocities are equal in size and opposite in direction. Δv = v − (−v) = 2v = 2 × 6.0 = 12 m s⁻¹',
  ['C1: velocities are opposite in direction'], sig=2, aq='Δv', cm='answering zero because the speed is unchanged.')
v_ = Q('8.0 m s⁻¹'); dv = sqrt(2) * v_.v
N('E', 2, f'A model aeroplane flies in a circle on a control line at a steady {v_}. What is the size of its change in velocity during a quarter of a lap?', dv, 'm s⁻¹',
  f'After a quarter turn the velocity has turned through 90°. The two velocity vectors are at right angles, so |Δv| = √(8.0² + 8.0²) = {sf(dv, 2)} m s⁻¹',
  ['C1: velocities at 90°, so use Pythagoras'], sig=2, aq='|Δv|')
v_, r_ = Q('12 m s⁻¹'), Q('30 m'); T = 2 * pi * r_.v / v_.v
N('E', 2, f'A cyclist rides round a circular track of radius {r_} at a steady {v_}. Calculate the time for one lap.', T, 's',
  f'One lap is 2πr. T = 2πr/v = 2π × 30 ÷ 12 = {sf(T, 2)} s', ['C1: distance = 2πr'], sig=2, aq='T')
v_, T_ = Q('7.7 km s⁻¹'), Q('92 minutes'); r = v_.v * T_.v / (2 * pi)
N('E', 2, f'The International Space Station moves at about {v_} and completes an orbit in {T_}. Estimate the radius of its orbit.', r, 'm',
  f'v = 2πr/T, so r = vT/2π = 7700 × 5520 ÷ 2π = {sf(r)} m', ['C1: v = 2πr/T with SI units'], aq='r')
r_, T_ = Q('0.20 m'), Q('1.5 s'); v = 2 * pi * r_.v / T_.v
N('E', 2, f'A toy train goes round a circular track of radius {r_} once every {T_}. Calculate its speed.', v, 'm s⁻¹',
  f'v = 2πr/T = 2π × 0.20 ÷ 1.5 = {sf(v, 2)} m s⁻¹', ['C1: v = 2πr/T'], sig=2, aq='v')
M('E', 1, 'A body moves in a circle at a constant speed. Through what angle does its velocity turn while it travels half way round?', '180°', ['90°', '0°', '360°'],
  'The velocity is always along the tangent, so it turns through the same angle as the radius: half a revolution, 180°.')
M('E', 1, 'Which describes the motion of a satellite in a circular orbit?', 'Constant speed, changing velocity', ['Constant speed, constant velocity', 'Changing speed, constant velocity', 'Changing speed, changing velocity'],
  'In a circular orbit the speed is constant, but the direction changes all the time, so the velocity changes.')
v_ = Q('3.0 m s⁻¹'); dv = 2 * v_.v * sin(radians(30))
N('E', 2, f'A child on a roundabout moves at a steady {v_}. Calculate the size of the change in velocity when the child has moved through 60° around the centre.', dv, 'm s⁻¹',
  f'The velocity turns through 60°. Two sides of length 3.0 with 60° between them form an equilateral triangle, so |Δv| = 2 × 3.0 × sin 30 = {sf(dv, 2)} m s⁻¹',
  ['C1: vector triangle with 60° between the velocities'], sig=2, aq='|Δv|')

# ── medium ──
v_ = Q('20 m s⁻¹'); dv = 2 * v_.v * sin(radians(60))
N('M', 3, f'A racing car drives round a circular track at {v_}. Calculate the magnitude of its change in velocity as it moves round an arc that subtends 120° at the centre of the track.', dv, 'm s⁻¹',
  f'The velocity turns through 120°. The vector triangle has two sides of 20 m s⁻¹, so |Δv| = 2v sin(θ/2) = 2 × 20 × sin 60 = {sf(dv)} m s⁻¹',
  ['C1: velocity turns through the same angle as the radius', 'C1: vector triangle: |Δv| = 2v sin(θ/2) or cosine rule'], aq='|Δv|', cm='subtracting the speeds and getting zero.')
v_ = Q('2.4 m s⁻¹'); dv = 2 * v_.v * sin(radians(15))
N('M', 3, f'A fairground horse on a carousel moves at {v_}. By how much does its velocity change while it turns through 30° about the axis?', dv, 'm s⁻¹',
  f'|Δv| = 2v sin(θ/2) = 2 × 2.4 × sin 15 = {sf(dv)} m s⁻¹. (The cosine rule, √(2.4² + 2.4² − 2 × 2.4 × 2.4 × cos 30), gives the same.)',
  ['C1: angle between velocities = 30°', 'C1: vector triangle'], aq='|Δv|')
v_, r_ = Q('4.0 m s⁻¹'), Q('2.0 m'); T = 2 * pi * r_.v / v_.v; t = T / 4; dv = sqrt(2) * v_.v; aav = dv / t
N('M', 4, f'A skater glides at a steady {v_} round a circle of radius {r_}. (a) Find the time to travel a quarter of the circle. (b) Calculate the magnitude of the average acceleration over that quarter circle. Give only the answer to (b).', aav, 'm s⁻²',
  f'(a) T = 2πr/v = 2π × 2.0 ÷ 4.0 = {sf(T)} s, so a quarter takes {sf(t)} s. (b) |Δv| = √2 × 4.0 = {sf(dv)} m s⁻¹, average acceleration = {sf(dv)} ÷ {sf(t)} = {sf(aav)} m s⁻². (The instantaneous value v²/r = 8.0 m s⁻² is close.)',
  ['C1: time for quarter = T/4', 'C1: |Δv| = √2 v', 'C1: average a = Δv/Δt'], aq='a', cm='using the change in speed (zero) instead of the change in velocity.')
M('M', 3, 'A ball on a string moves anticlockwise in a horizontal circle, viewed from above. At the moment it is due north of the centre it is moving west. In which direction is the change in its velocity over a very short time at that moment?',
  'South', ['West', 'North', 'East'],
  'The change in velocity points in the direction of the acceleration, which is towards the centre: the ball is due north of the centre, so the centre is due south of the ball.',
  ['C1: change in velocity is in the direction of the acceleration', 'C1: acceleration is towards the centre'])
M('M', 3, 'A body moves round a circle at constant speed. Which pair of graphs would be correct for one revolution?',
  'Speed–time graph a horizontal line; magnitude of acceleration–time graph a horizontal line',
  ['Speed–time graph a horizontal line; magnitude of acceleration–time graph zero throughout', 'Speed–time graph a sine curve; magnitude of acceleration–time graph a horizontal line', 'Speed–time graph a horizontal line; magnitude of acceleration–time graph a sine curve'],
  'The speed is constant, so its graph is horizontal. The acceleration has constant magnitude v²/r (only its direction rotates), so its magnitude also gives a horizontal line. It is not zero.',
  ['C1: speed constant', 'C1: acceleration constant in magnitude, changing in direction'])
dp = 0.40 * sqrt(2) * 9.0
N('M', 3, 'A 0.40 kg ball moves round a horizontal circle at 9.0 m s⁻¹. Calculate the magnitude of the change in its momentum over a quarter of a revolution.', dp, 'kg m s⁻¹',
  f'|Δv| = √2 × 9.0 = {sf(sqrt(2) * 9)} m s⁻¹. |Δp| = m|Δv| = 0.40 × {sf(sqrt(2) * 9)} = {sf(dp)} kg m s⁻¹',
  ['C1: momentum is a vector, velocity changes direction', 'C1: |Δv| from vector triangle'], aq='|Δp|', cm='concluding that momentum does not change because the speed is constant.')
dp = 1.2 * 2 * 14
N('M', 3, 'A 1.2 kg hammer head is swung round in a circle at a steady 14 m s⁻¹. What is the size of the change in its momentum between one instant and half a revolution later?', dp, 'kg m s⁻¹',
  f'Half a turn later the velocity is reversed: |Δv| = 2 × 14 = 28 m s⁻¹. |Δp| = 1.2 × 28 = {sf(dp)} kg m s⁻¹',
  ['C1: velocity reversed after half a turn', 'C1: Δp = mΔv'], aq='|Δp|')
v_, T_ = Q('0.60 m s⁻¹'), Q('0.80 s'); w = 2 * pi / T_.v; r = v_.v / w
N('M', 3, f'A bead slides at a steady {v_} round a circular wire, completing a lap every {T_}. Calculate (a) its angular speed and (b) the radius of the wire loop. Give only the answer to (b).', r, 'm',
  f'(a) ω = 2π/T = 2π ÷ 0.80 = {sf(w)} rad s⁻¹. (b) r = v/ω = 0.60 ÷ {sf(w, 4)} = {sf(r)} m',
  ['C1: ω = 2π/T', 'C1: v = ωr rearranged'], aq='r')
v_, T_ = Q('25 m s⁻¹'), Q('18 s'); r = v_.v * T_.v / (2 * pi)
N('M', 3, f'An aircraft circles an airport at a steady {v_}, taking {T_} for each complete circle. Calculate the radius of its circle and the angle its velocity turns through each second, in degrees. Give the radius.', r, 'm',
  f'r = vT/2π = 25 × 18 ÷ 2π = {sf(r)} m. The velocity turns through 360° every 18 s, i.e. {sf(360 / 18, 2)}° each second.',
  ['C1: v = 2πr/T', 'C1: angle per second'], aq='r')
M('M', 3, 'A satellite moves in a circular orbit at constant speed. A student says: "The satellite has no acceleration because no work is done on it." Which is the best response?',
  'Work is zero because the force is perpendicular to the velocity, but the force still changes the direction of the velocity, so there is an acceleration',
  ['The student is correct: no work means no change in velocity', 'Work is done on the satellite, so its speed must change', 'There is no force on the satellite, so it has no acceleration'],
  'No work is done because the gravitational force is at 90° to the motion, so the speed (and kinetic energy) is constant. A force perpendicular to the velocity still changes its direction, so the velocity changes and the satellite accelerates towards the Earth.',
  ['C1: force perpendicular to velocity does no work', 'C1: but changes the direction of velocity, so acceleration'])
M('M', 3, 'An object moves round a circle at a steady speed. Its speed is then doubled while the radius stays the same. What happens to the size of the change in velocity over a quarter of a revolution, and to the time taken for that quarter?',
  'Change in velocity doubles; time halves', ['Change in velocity doubles; time doubles', 'Change in velocity is unchanged; time halves', 'Change in velocity quadruples; time is unchanged'],
  '|Δv| = √2 v, so it doubles when v doubles. The quarter circle has the same length, so the time halves. (The average acceleration |Δv|/t therefore rises by a factor of 4, matching a = v²/r.)',
  ['C1: |Δv| ∝ v', 'C1: t ∝ 1/v'])
v_, d_ = Q('3.0 m s⁻¹'), Q('0.90 m'); r = d_.v / 2; t = pi * r / v_.v; a = 2 * v_.v / t
N('M', 4, f'A conker on a string moves round a circle of diameter {d_} at a steady {v_}. (a) Calculate the time to go halfway round. (b) Calculate the average acceleration of the conker over this half circle. Give only the answer to (b).', a, 'm s⁻²',
  f'(a) half the circumference = πr = π × 0.45 = {sf(pi * r)} m, so t = {sf(pi * r)} ÷ 3.0 = {sf(t)} s. (b) |Δv| = 2v = 6.0 m s⁻¹, average acceleration = 6.0 ÷ {sf(t)} = {sf(a)} m s⁻²',
  ['C1: half circumference = πr with r = d/2', 'C1: Δv = 2v for half a revolution', 'C1: average a = Δv/t'], aq='a')
M('M', 3, 'A toy car runs round a circular track at a steady speed. It is moved to a track of half the radius and runs at the same speed. What happens to the angle its velocity turns through each second?',
  'It doubles', ['It halves', 'It stays the same', 'It quadruples'],
  'The velocity turns at the same rate as the radius: the angular speed ω = v/r. With v the same and r halved, ω doubles.',
  ['C1: velocity turns at the rate ω', 'C1: ω = v/r'])
M('M', 3, 'Which of the following is NOT an example of a body moving with constant speed but changing velocity?',
  'A ball rolling at a steady speed along a straight, level corridor', ['A point on the rim of a spinning bicycle wheel', 'A geostationary satellite', 'A car going round a roundabout at a steady 10 m s⁻¹'],
  'In a straight line at steady speed both the speed and direction are constant, so the velocity is constant. The other three all change direction.',
  ['C1: velocity changes if direction changes', 'C1: identifies the straight-line motion'])
aa = 2 * 15 * sin(radians(20)) / 3.0
N('M', 4, 'A car is driving round a circular bend at a steady 15 m s⁻¹. At one instant it is heading due east. 3.0 s later it is heading 40° north of east. Calculate the magnitude of the average acceleration over these 3.0 s.', aa, 'm s⁻²',
  f'|Δv| = 2v sin(θ/2) = 2 × 15 × sin 20 = {sf(2 * 15 * sin(radians(20)))} m s⁻¹. Average acceleration = {sf(2 * 15 * sin(radians(20)))} ÷ 3.0 = {sf(aa)} m s⁻²',
  ['C1: angle between velocities 40°', 'C1: |Δv| from vector triangle', 'C1: a = Δv/Δt'], aq='a')

# ── hard ──
v_, r_, m_ = Q('6.0 m s⁻¹'), Q('1.5 m'), Q('0.20 kg'); T = 2 * pi * r_.v / v_.v; t = T / 6; a = v_.v / t
N('H', 5, f'A ball of mass {m_} moves in a horizontal circle of radius {r_} at a constant speed of {v_}. (a) Calculate the period. (b) Find the magnitude of the change in velocity as it moves through 60° round the circle. (c) Calculate the average acceleration over this 60° arc and compare it with v²/r. Give only the average acceleration in (c).', a, 'm s⁻²',
  f'(a) T = 2πr/v = 2π × 1.5 ÷ 6.0 = {sf(T)} s. (b) The velocity turns through 60°: |Δv| = 2v sin 30° = 6.0 m s⁻¹ (an equilateral vector triangle). (c) The arc takes T/6 = {sf(t)} s, so average a = 6.0 ÷ {sf(t)} = {sf(a)} m s⁻². v²/r = 24 m s⁻²: the average over a finite arc is a little smaller and approaches v²/r as the arc shrinks.',
  ['C1: T = 2πr/v', 'C1: |Δv| = 2v sin 30° = v', 'C1: time for 60° = T/6', 'A1: average acceleration', 'B1: comparison with v²/r'], aq='a')
N('H', 6, 'A puck on frictionless ice is tied by a string to a pin and moves in a circle of radius 2.0 m at 3.0 m s⁻¹. The string breaks when the puck is due east of the pin and moving north. (a) State the direction of the velocity just after the string breaks. (b) Describe the path of the puck afterwards. (c) Calculate how far the puck is from the pin 2.0 s after the string breaks. Give only the answer to (c).', sqrt(2.0 ** 2 + 6.0 ** 2), 'm',
  f'(a) North, along the tangent. (b) A straight line at constant speed (no horizontal force on frictionless ice). (c) In 2.0 s it moves 3.0 × 2.0 = 6.0 m north from a point 2.0 m east of the pin. Distance = √(2.0² + 6.0²) = {sf(sqrt(40))} m',
  ['B1: north / along the tangent', 'B1: straight line', 'B1: constant speed', 'C1: displacement 6.0 m along the tangent', 'C1: Pythagoras with the radius', 'A1: 6.3 m'], sig=2,
  cm='expecting the puck to fly radially outwards.')
v_, r_, dt = Q('2.0 m s⁻¹'), Q('0.50 m'), Q('0.010 s'); th = v_.v * dt.v / r_.v; dv = 2 * v_.v * sin(th / 2); a_est = dv / dt.v
N('H', 6, f'A point on a spinning disc moves at a steady {v_} in a circle of radius {r_}. (a) Calculate the angle, in radians, through which its velocity turns in a time interval of {dt}. (b) Use the vector triangle to calculate the magnitude of the change in velocity in this interval. (c) Hence estimate the acceleration and show that it is close to v²/r. Give only your estimate in (c).', a_est, 'm s⁻²',
  f'(a) The arc length is vΔt = 0.020 m, so θ = s/r = 0.020 ÷ 0.50 = {sf(th)} rad. (b) |Δv| = 2v sin(θ/2) ≈ vθ = 2.0 × {sf(th)} = {sf(dv)} m s⁻¹. (c) a ≈ |Δv|/Δt = {sf(dv)} ÷ 0.010 = {sf(a_est)} m s⁻², and v²/r = 8.0 m s⁻²: almost identical, because the interval is short.',
  ['C1: θ = vΔt/r', 'A1: θ', 'C1: |Δv| = 2v sin(θ/2) or ≈ vθ', 'C1: a = Δv/Δt', 'A1: estimate', 'B1: compares with v²/r'], aq='a')
v_, r_, dt = Q('16 m s⁻¹'), Q('40 m'), Q('0.10 s'); th = v_.v * dt.v / r_.v; dv = 2 * v_.v * sin(th / 2); a_est = dv / dt.v
N('H', 6, f'A motorcyclist rides round a circular test track of radius {r_} at a steady {v_}. A data logger records the velocity every {dt}. (a) Show that the velocity direction changes by 0.040 rad between readings. (b) Calculate the size of the change in velocity between readings. (c) Use your answer to estimate the motorcyclist\'s acceleration, and state its direction. Give only the size of the acceleration in (c).', a_est, 'm s⁻²',
  f'(a) θ = vΔt/r = 16 × 0.10 ÷ 40 = {sf(th, 2)} rad. (b) |Δv| ≈ vθ = 16 × 0.040 = {sf(dv)} m s⁻¹. (c) a ≈ {sf(dv)} ÷ 0.10 = {sf(a_est)} m s⁻², towards the centre of the track (v²/r = 6.4 m s⁻²).',
  ['M1: θ = vΔt/r', 'A1: 0.040 rad', 'C1: |Δv| ≈ vθ', 'C1: a = Δv/Δt', 'A1: a', 'B1: towards the centre'], aq='a')
dv = 2 * 10.0 * sin(radians(22.5))
N('H', 5, 'A remote-controlled car drives anticlockwise round a circular track at a steady 10.0 m s⁻¹. At time t₁ it is moving due north. Later, at time t₂, it is moving north-west. (a) State the two velocities and the angle between them. (b) Calculate the magnitude of the change in velocity. (c) State the direction of the change in velocity. Give only the answer to (b).', dv, 'm s⁻¹',
  f'(a) 10.0 m s⁻¹ north and 10.0 m s⁻¹ north-west: 45° apart. Δv = v₂ − v₁, the third side of an isosceles triangle. (b) |Δv| = 2v sin(θ/2) = 2 × 10.0 × sin 22.5 = {sf(dv)} m s⁻¹. (c) Roughly west-south-west: towards the centre of the arc between the two positions.',
  ['B1: angle between velocities 45°', 'C1: Δv = v₂ − v₁ as a vector', 'C1: 2v sin(θ/2) or cosine rule', 'A1: |Δv|', 'B1: direction towards the centre'], aq='|Δv|')
v_, r_ = Q('4.5 m s⁻¹'), Q('0.75 m'); w = v_.v / r_.v; T = 2 * pi / w; n10 = 10 / T
N('H', 5, f'A chair on a fairground ride moves at a steady {v_} in a horizontal circle of radius {r_}. (a) Explain why the chair is accelerating. (b) Calculate its angular speed. (c) Calculate the number of revolutions it makes in 10 s. Give only the answer to (c).', n10, None,
  f'(a) Its direction changes continuously, so its velocity changes: it accelerates towards the centre. (b) ω = v/r = 4.5 ÷ 0.75 = {sf(w)} rad s⁻¹. (c) T = 2π/ω = {sf(T)} s, number of revolutions = 10 ÷ {sf(T, 4)} = {sf(n10)}',
  ['B1: velocity direction changes', 'B1: acceleration towards centre', 'C1: ω = v/r', 'C1: T = 2π/ω or n = ωt/2π', 'A1: number of revolutions'], aq='n')
tq = pi * 0.5 / 2 / 2.0; aq_ = sqrt(8) / tq
N('H', 6, 'A particle moves anticlockwise round a circle of radius 0.50 m at a constant 2.0 m s⁻¹. Take the centre as origin. At t = 0 it is at (0.50 m, 0). (a) State its velocity components at t = 0. (b) Calculate the time it takes to reach (0, 0.50 m). (c) State its velocity components there. (d) Calculate the magnitude of the average acceleration between these two points. Give only the answer to (d).', aq_, 'm s⁻²',
  f'(a) vₓ = 0, v_y = +2.0 m s⁻¹. (b) A quarter circle: t = (π × 0.50 ÷ 2) ÷ 2.0 = {sf(tq)} s. (c) vₓ = −2.0 m s⁻¹, v_y = 0. (d) Δv = (−2.0, −2.0), |Δv| = √(2.0² + 2.0²) = {sf(sqrt(8))} m s⁻¹, average a = {sf(sqrt(8))} ÷ {sf(tq)} = {sf(aq_)} m s⁻²',
  ['B1: (0, +2.0)', 'C1: time for quarter circle', 'B1: (−2.0, 0)', 'C1: Δv components', 'C1: average a = |Δv|/t', 'A1: a'], aq='a')

# ═════════════════════════ 16.4 Angular speed ═════════════════════════
lesson('16.4')

T_ = Q('27.3 days'); w = 2 * pi / T_.v
N('E', 2, f'The Moon goes round the Earth once every {T_}. Calculate its angular speed.', w, 'rad s⁻¹',
  f'T = 27.3 × 86400 = {sf(T_.v)} s. ω = 2π/T = 2π ÷ {sf(T_.v)} = {sf(w)} rad s⁻¹', ['C1: ω = 2π/T in seconds'], aq='ω')
w = 2 * pi / 60
N('E', 1, 'Calculate the angular speed of the second hand of a watch.', w, 'rad s⁻¹', f'T = 60 s, so ω = 2π/T = 2π ÷ 60 = {sf(w)} rad s⁻¹', [], aq='ω')
T_ = Q('0.050 s'); w = 2 * pi / T_.v
N('E', 1, f'A spinning top completes one turn every {T_}. What is its angular speed?', w, 'rad s⁻¹', f'ω = 2π/T = 2π ÷ 0.050 = {sf(w)} rad s⁻¹', [], aq='ω')
f_ = Q('50 Hz'); w = 2 * pi * f_.v
N('E', 1, f'The rotor of an electricity generator turns at {f_}. Calculate its angular speed.', w, 'rad s⁻¹', f'ω = 2πf = 2π × 50 = {sf(w)} rad s⁻¹', [], aq='ω')
w = 2 * pi * 3.5
N('E', 1, 'A propeller on a model boat rotates 3.5 times each second. Calculate its angular speed.', w, 'rad s⁻¹', f'f = 3.5 Hz, ω = 2πf = 2π × 3.5 = {sf(w)} rad s⁻¹', [], aq='ω')
w_ = Q('0.26 rad s⁻¹'); T = 2 * pi / w_.v
N('E', 2, f'A Ferris wheel turns with an angular speed of {w_}. How long does one ride (one full turn) last?', T, 's', f'T = 2π/ω = 2π ÷ 0.26 = {sf(T, 2)} s', ['C1: T = 2π/ω'], sig=2, aq='T')
w_, r_ = Q('8.0 rad s⁻¹'), Q('0.25 m'); v = w_.v * r_.v
N('E', 1, f'A grindstone of radius {r_} rotates at {w_}. Calculate the speed of its rim.', v, 'm s⁻¹', f'v = ωr = 8.0 × 0.25 = {sf(v, 2)} m s⁻¹', [], sig=2, aq='v')
v_, r_ = Q('1.8 m s⁻¹'), Q('0.30 m'); w = v_.v / r_.v
N('E', 2, f'The rim of a spinning wheel of radius {r_} moves at {v_}. Calculate the angular speed of the wheel.', w, 'rad s⁻¹', f'ω = v/r = 1.8 ÷ 0.30 = {sf(w)} rad s⁻¹', ['C1: v = ωr rearranged'], aq='ω')
w_, v_ = Q('0.12 rad s⁻¹'), Q('36 m s⁻¹'); r = v_.v / w_.v
N('E', 2, f'A train goes round a curve at {v_}, its direction changing at {w_}. Calculate the radius of the curve.', r, 'm', f'r = v/ω = 36 ÷ 0.12 = {sf(r, 2)} m', ['C1: r = v/ω'], sig=2, aq='r')
M('E', 1, 'Which equation relates the speed v of a point on a rotating body to the angular speed ω and the distance r from the axis?', 'v = ωr', ['v = ω/r', 'v = ωr²', 'v = r/ω'],
  'In one revolution the point travels 2πr in a time T = 2π/ω, so v = 2πr ÷ (2π/ω) = ωr.')
M('E', 1, 'A disc rotates at a constant rate. Which quantity is the same for all points on the disc?', 'Angular speed', ['Speed', 'Velocity', 'Centripetal acceleration'],
  'Every point turns through the same angle in the same time, so ω is the same. v = ωr and a = ω²r both depend on r.')
f_ = Q('0.50 Hz'); w = 2 * pi * f_.v
N('E', 2, f'A lighthouse lamp rotates at {f_}. Calculate its angular speed.', w, 'rad s⁻¹',
  f'ω = 2πf = 2π × 0.50 = {sf(w)} rad s⁻¹. (A ship sees one flash per revolution, every T = 1/f = 2.0 s.)', ['C1: ω = 2πf'], aq='ω')
M('E', 1, 'What is the angular speed of the Earth spinning on its axis, to two significant figures?', '7.3 × 10⁻⁵ rad s⁻¹', ['7.3 × 10⁻⁵ rad min⁻¹', '2.0 × 10⁻⁷ rad s⁻¹', '0.26 rad s⁻¹'],
  'ω = 2π/T = 2π ÷ 86400 s = 7.3 × 10⁻⁵ rad s⁻¹. 2.0 × 10⁻⁷ rad s⁻¹ is the Earth\'s orbital angular speed round the Sun, and 0.26 rad is the angle turned per hour.')
N('E', 2, 'An electric drill turns at 1500 rev min⁻¹. Calculate its angular speed.', 1500 * 2 * pi / 60, 'rad s⁻¹',
  f'ω = 2π × 1500 ÷ 60 = {sf(1500 * 2 * pi / 60)} rad s⁻¹', ['C1: rev min⁻¹ to rad s⁻¹'], aq='ω')

# ── medium ──
d_, n_ = Q('12 cm'), Q('33 rev min⁻¹'); w = n_.v; v = w * d_.v / 2
N('M', 3, f'A small record of diameter {d_} turns at {n_}. Calculate the speed of a point on its edge.', v, 'm s⁻¹',
  f'ω = 2π × 33 ÷ 60 = {sf(w)} rad s⁻¹. r = 0.060 m. v = ωr = {sf(w)} × 0.060 = {sf(v)} m s⁻¹',
  ['C1: ω from rev min⁻¹', 'C1: r = d/2 in metres'], aq='v')
w = 45 * 2 * pi / 60; v = w * 0.15
N('M', 3, 'A record player\'s 30 cm diameter platter is switched from 33 to 45 rev min⁻¹. Calculate the speed of the rim at 45 rev min⁻¹.', v, 'm s⁻¹',
  f'ω = 2π × 45 ÷ 60 = {sf(w)} rad s⁻¹. v = ωr = {sf(w)} × 0.15 = {sf(v)} m s⁻¹', ['C1: ω in rad s⁻¹', 'C1: radius 0.15 m'], aq='v')
r1_, r2_, w_ = Q('2.0 cm'), Q('8.0 cm'), Q('30 rad s⁻¹'); dv = w_.v * (r2_.v - r1_.v)
N('M', 3, f'Two marks on a rotating disc lie on the same radius, at {r1_} and {r2_} from the axis. The disc spins at {w_}. Calculate the difference in their speeds.', dv, 'm s⁻¹',
  f'Both have the same ω. v₁ = ωr₁ = 30 × 0.020 = {sf(30 * 0.02)} m s⁻¹, v₂ = 30 × 0.080 = {sf(30 * 0.08)} m s⁻¹. Difference = 30 × 0.060 = {sf(dv)} m s⁻¹',
  ['C1: same ω for both', 'C1: v = ωr for each'], aq='Δv')
N('M', 3, 'Two children sit on a roundabout turning at 0.60 rad s⁻¹, one 1.5 m and one 4.5 m from the centre. Calculate the speed of each child and hence the factor by which the outer child is faster. Give the factor.', 3.0, None,
  'v = ωr: inner 0.60 × 1.5 = 0.90 m s⁻¹, outer 0.60 × 4.5 = 2.7 m s⁻¹. Factor = 2.7 ÷ 0.90 = 3.0',
  ['C1: same ω for both children', 'C1: v = ωr for each'], sig=2, aq='factor')
v_, T_ = Q('7.66 km s⁻¹'), Q('92.7 minutes'); w = 2 * pi / T_.v; r = v_.v / w
N('M', 3, f'A low-orbit satellite travels at {v_} with a period of {T_}. Calculate (a) its angular speed and (b) its orbital radius. Give only the answer to (b).', r, 'm',
  f'(a) T = 92.7 × 60 = {sf(T_.v)} s, ω = 2π ÷ {sf(T_.v)} = {sf(w)} rad s⁻¹. (b) r = v/ω = 7660 ÷ {sf(w, 4)} = {sf(r)} m',
  ['C1: ω = 2π/T with T in seconds', 'C1: r = v/ω'], aq='r')
w = 2 * pi / 86400
N('M', 3, 'A geostationary satellite moves at 3.07 km s⁻¹ and has the same angular speed as the rotating Earth (period 24.0 h). Calculate the radius of its orbit.', 3070 / w, 'm',
  f'ω = 2π ÷ 86400 = {sf(w)} rad s⁻¹. r = v/ω = 3070 ÷ {sf(w, 4)} = {sf(3070 / w)} m', ['C1: ω for a 24 h period', 'C1: r = v/ω'], aq='r')
th_q, t_q = Q('18 rad'), Q('4.0 s'); w = th_q.v / t_q.v; f = w / (2 * pi)
N('M', 3, f'A rotating shaft turns through {th_q} in {t_q} at a steady rate. Calculate its frequency of rotation.', f, 'Hz',
  f'ω = θ/t = 18 ÷ 4.0 = {sf(w)} rad s⁻¹. f = ω/2π = {sf(w)} ÷ 2π = {sf(f)} Hz', ['C1: ω = θ/t', 'C1: f = ω/2π'], aq='f')
M('M', 3, 'Wheel P has radius r and rotates at angular speed ω. Wheel Q has radius 2r and rotates at angular speed ω/4. What is the ratio (speed of rim of P)/(speed of rim of Q)?',
  '2', ['½', '8', '4'], 'v_P = ωr. v_Q = (ω/4)(2r) = ωr/2. Ratio = ωr ÷ (ωr/2) = 2.', ['C1: v = ωr for each wheel', 'C1: ratio calculated'],
  cm='multiplying the factors the wrong way round and getting ½.')
M('M', 3, 'The Earth spins on its axis and also orbits the Sun. How does the angular speed of its spin compare with the angular speed of its orbit?',
  'The spin is about 365 times faster', ['The orbit is about 365 times faster', 'They are equal', 'The spin is about 24 times faster'],
  'ω = 2π/T. Spin: T ≈ 1 day. Orbit: T ≈ 365 days. Ratio ω_spin/ω_orbit = 365 ÷ 1 ≈ 365.', ['C1: ω ∝ 1/T', 'C1: periods 1 day and 365 days'])
f_, r_ = Q('2.5 Hz'), Q('0.40 m'); w = 2 * pi * f_.v; v = w * r_.v
N('M', 3, f'A lawn sprinkler arm of length {r_} rotates at {f_}. Calculate the speed of the nozzle at the tip of the arm.', v, 'm s⁻¹',
  f'ω = 2πf = 2π × 2.5 = {sf(w)} rad s⁻¹. v = ωr = {sf(w)} × 0.40 = {sf(v)} m s⁻¹', ['C1: ω = 2πf', 'C1: v = ωr'], aq='v')
n_ = Q('700 rev min⁻¹'); v_ = Q('44 m s⁻¹'); w = n_.v; r = v_.v / w
N('M', 4, f'The cutting tip of a lawnmower blade moves at {v_} when the blade spins at {n_}. Calculate the distance from the axis to the tip.', r, 'm',
  f'ω = 2π × 700 ÷ 60 = {sf(w)} rad s⁻¹. r = v/ω = 44 ÷ {sf(w, 4)} = {sf(r)} m',
  ['C1: × 2π', 'C1: ÷ 60', 'C1: r = v/ω'], aq='r', cm='forgetting the factor 2π when converting revolutions to radians.')
a, b_, t_ = Q('40 rad s⁻¹'), Q('10 rad s⁻¹'), Q('6.0 s'); nrev = (a.v - b_.v) * t_.v / (2 * pi)
N('M', 4, f'Two discs on the same axle start with their marks lined up. They rotate in the same direction at {a} and {b_}. How many more revolutions has the faster disc made after {t_}?', nrev, None,
  f'Extra angle = (ω₁ − ω₂)t = (40 − 10) × 6.0 = 180 rad. Extra revolutions = 180 ÷ 2π = {sf(nrev)}',
  ['C1: relative angular speed ω₁ − ω₂', 'C1: angle = ωt', 'C1: ÷ 2π'], aq='extra revolutions', tol=0.02)
N('M', 3, 'A bicycle travels at 6.0 m s⁻¹. Its wheels have radius 0.35 m. Calculate the angular speed of the wheels.', 6.0 / 0.35, 'rad s⁻¹',
  f'For rolling without slipping the bicycle\'s speed equals the speed of the rim relative to the axle: ω = v/r = 6.0 ÷ 0.35 = {sf(6 / 0.35)} rad s⁻¹',
  ['B1: rolling: v of bicycle = v of rim relative to axle', 'C1: ω = v/r'], aq='ω')
t_meet = 1 / (1 / 60 - 1 / 3600)
N('M', 4, 'At exactly 12:00 the minute and second hands of a clock point the same way. Calculate the time, in seconds, until the second hand next overtakes the minute hand.', t_meet, 's',
  f'ω_s = 2π/60, ω_m = 2π/3600. The second hand gains a full turn (2π) when (ω_s − ω_m)t = 2π, so t = 1 ÷ (1/60 − 1/3600) = {sf(t_meet)} s',
  ['C1: angular speeds of both hands', 'C1: relative angular speed', 'C1: gain of 2π'], aq='t')

# ── hard ──
d_, v_, s_ = Q('0.66 m'), Q('9.0 m s⁻¹'), Q('2.0 km'); r = d_.v / 2; w = v_.v / r; f = w / (2 * pi); t = s_.v / v_.v; nrev = f * t
N('H', 6, f'A cyclist rides at a steady {v_}. The bicycle wheels have diameter {d_} and roll without slipping. (a) Calculate the angular speed of a wheel. (b) Calculate the frequency of rotation of a wheel. (c) Calculate the time taken to ride {s_} and hence the number of revolutions each wheel makes. Give only the number of revolutions in (c).', nrev, None,
  f'(a) r = 0.33 m, ω = v/r = 9.0 ÷ 0.33 = {sf(w)} rad s⁻¹. (b) f = ω/2π = {sf(w)} ÷ 2π = {sf(f)} Hz. (c) t = 2000 ÷ 9.0 = {sf(t)} s, revolutions = ft = {sf(f, 4)} × {sf(t, 4)} = {sf(nrev)}',
  ['C1: r = d/2', 'A1: ω', 'A1: f = ω/2π', 'C1: t = s/v', 'C1: revolutions = ft (or s/2πr)', 'A1: number of revolutions'], aq='n')
for lat in (60.0, 20.0):
    w = 2 * pi / 86164; v_eq = w * 6.37e6; v_lat = v_eq * cos(radians(lat))
    place = 'Oslo, at latitude 60° N' if lat == 60 else 'a town at latitude 20° S'
    N('H', 5, f'The Earth rotates once on its axis in 86 164 s (the sidereal day). Its radius is 6.37 × 10⁶ m. (a) Calculate the angular speed of the Earth. (b) Calculate the speed of a point on the Equator. (c) Calculate the speed of {place}, and explain why every point on the Earth has the same angular speed. Give only the speed in (c).', v_lat, 'm s⁻¹',
      f'(a) ω = 2π ÷ 86164 = {sf(w)} rad s⁻¹. (b) v = ωR = {sf(w)} × 6.37 × 10⁶ = {sf(v_eq)} m s⁻¹. (c) r = R cos {lat:g}°, so v = {sf(v_eq)} × cos {lat:g} = {sf(v_lat)} m s⁻¹. The Earth is rigid, so every point turns through 2π in the same time.',
      ['A1: ω', 'C1: v = ωR', 'C1: r = R cos(latitude)', 'A1: v at latitude', 'B1: rigid body: same angle in the same time'], aq='v')
w = 8.4 / 6.0; v = w * 0.80
N('H', 6, 'The angle turned by a rotating shop sign is recorded: t = 0 s, θ = 0; t = 1.5 s, θ = 2.1 rad; t = 3.0 s, θ = 4.2 rad; t = 4.5 s, θ = 6.3 rad; t = 6.0 s, θ = 8.4 rad. (a) Show that the angular speed is constant. (b) Determine the angular speed. (c) Calculate the period. (d) Calculate the speed of the edge of the sign, 0.80 m from the axis. Give only the answer to (d).', v, 'm s⁻¹',
  f'(a) Each 1.5 s adds 2.1 rad, so θ ∝ t and ω is constant. (b) ω = 8.4 ÷ 6.0 = {sf(w)} rad s⁻¹. (c) T = 2π/ω = 2π ÷ {sf(w)} = {sf(2 * pi / w)} s. (d) v = ωr = {sf(w)} × 0.80 = {sf(v)} m s⁻¹',
  ['B1: equal Δθ in equal Δt', 'C1: gradient of θ against t', 'A1: ω', 'A1: T', 'C1: v = ωr', 'A1: v'], aq='v')
v_, r_ = Q('22 m s⁻¹'), Q('150 m'); w = v_.v / r_.v; t90 = (pi / 2) / w
N('H', 5, f'A motorway slip road curves through 90° as an arc of radius {r_}. A car takes it at a steady {v_}. (a) Calculate the angular speed of the car about the centre of the curve. (b) Calculate the time taken to go round the curve. (c) Calculate the length of the curve. Give only the answer to (b).', t90, 's',
  f'(a) ω = v/r = 22 ÷ 150 = {sf(w)} rad s⁻¹. (b) 90° = π/2 rad, t = θ/ω = (π/2) ÷ {sf(w, 4)} = {sf(t90)} s. (c) s = rθ = 150 × π/2 = {sf(150 * pi / 2)} m (check: vt = {sf(22 * t90)} m).',
  ['C1: ω = v/r', 'A1: ω', 'C1: θ = π/2 rad', 'A1: t', 'B1: s = rθ'], aq='t')
N('H', 6, 'A geostationary satellite stays above the same point on the Equator. (a) State its period in seconds. (b) Calculate its angular speed. (c) Its orbital radius is 4.22 × 10⁷ m. Calculate its orbital speed. (d) Explain why its angular speed equals that of a person on the Equator, although their speeds are very different. Give only the answer to (c).', 2 * pi / 86164 * 4.22e7, 'm s⁻¹',
  f'(a) One sidereal day, 86 164 s (≈ 24 h). (b) ω = 2π ÷ 86164 = {sf(2 * pi / 86164)} rad s⁻¹. (c) v = ωr = {sf(2 * pi / 86164)} × 4.22 × 10⁷ = {sf(2 * pi / 86164 * 4.22e7)} m s⁻¹. (d) Both turn through 2π in the same time, so ω is equal. v = ωr and the satellite\'s r is about 6.6 times larger, so it moves 6.6 times faster.',
  ['B1: T = 24 h / 86 164 s', 'A1: ω', 'C1: v = ωr', 'A1: v', 'B1: same period so same ω', 'B1: v ∝ r'], aq='v')
N('H', 5, 'A car engine crankshaft turns at 3000 rev min⁻¹. A point on the crankshaft is 4.5 cm from the axis. (a) Calculate the angular speed of the crankshaft. (b) Calculate the speed of the point. (c) The engine speed rises to 4500 rev min⁻¹. Calculate the new speed of the point. Give only the answer to (b).', 3000 * 2 * pi / 60 * 0.045, 'm s⁻¹',
  f'(a) ω = 2π × 3000 ÷ 60 = {sf(100 * pi)} rad s⁻¹. (b) v = ωr = {sf(100 * pi)} × 0.045 = {sf(100 * pi * 0.045)} m s⁻¹. (c) v ∝ ω, so v = {sf(100 * pi * 0.045)} × 4500 ÷ 3000 = {sf(150 * pi * 0.045)} m s⁻¹',
  ['C1: × 2π', 'C1: ÷ 60', 'A1: ω = 314 rad s⁻¹', 'C1: v = ωr with r in metres', 'B1: (c) v ∝ ω'], aq='v')
fb = 1.2 * 40 / 15; vb = 2 * pi * fb * 0.34
N('H', 6, 'On a bicycle, the pedals turn a front cog with 40 teeth. The chain links it to a rear cog with 15 teeth, fixed to the back wheel of radius 0.34 m. The rider pedals at 1.2 rev s⁻¹. (a) Explain why the rear cog turns 40/15 times for each turn of the pedals. (b) Calculate the frequency and angular speed of the back wheel. (c) Calculate the speed of the bicycle. Give only the answer to (c).', vb, 'm s⁻¹',
  f'(a) The chain moves the same number of teeth past each cog, so each pedal turn moves 40 teeth, which is 40/15 turns of the rear cog. (b) f = 1.2 × 40 ÷ 15 = {sf(fb)} Hz, ω = 2πf = {sf(2 * pi * fb)} rad s⁻¹. (c) v = ωr = {sf(2 * pi * fb)} × 0.34 = {sf(vb)} m s⁻¹',
  ['B1: same number of teeth per second at both cogs', 'C1: f = 1.2 × 40/15', 'C1: ω = 2πf', 'C1: v = ωr', 'B1: rolling without slipping', 'A1: v'], aq='v')

# ═════════════════════════ 16.5 Centripetal forces ═════════════════════════
lesson('16.5')

M('E', 1, 'What provides the centripetal force on a car driving round a flat, unbanked bend?', 'Friction between the tyres and the road',
  ['The weight of the car', 'The normal contact force from the road', 'The driving force of the engine'],
  'On a flat road the weight and the normal force are vertical and cancel. The only horizontal force towards the centre is the sideways friction of the road on the tyres.')
M('E', 1, 'What provides the centripetal force on the Moon as it orbits the Earth?', 'The gravitational pull of the Earth',
  ['The gravitational pull of the Sun', 'The Moon\'s own weight acting outwards', 'The Moon\'s orbital speed'],
  'The Earth\'s gravitational force on the Moon acts towards the Earth (the centre of the orbit) and provides the centripetal force.')
M('E', 1, 'A ball on a string is whirled in a horizontal circle. In which direction is the resultant force on the ball?', 'Towards the centre of the circle',
  ['Along the direction of motion', 'Away from the centre of the circle', 'Vertically downwards'],
  'For uniform circular motion the resultant force is centripetal: always directed towards the centre of the circle.')
M('E', 1, 'In a simple model of a hydrogen atom, an electron moves in a circle around the proton. What provides the centripetal force?', 'The electric attraction between the electron and the proton',
  ['The gravitational attraction between the electron and the proton', 'The strong nuclear force', 'The magnetic field of the proton'],
  'The electrostatic attraction between the opposite charges is about 10³⁹ times larger than the gravitational attraction, and acts towards the proton.')
M('E', 1, 'Which statement about centripetal force is correct?', 'It is the name for the resultant force needed to keep a body moving in a circle',
  ['It is an extra force that appears whenever a body moves in a circle', 'It acts outwards from the centre', 'It is always provided by gravity'],
  'Centripetal force is not a new type of force: it is the resultant of the real forces (tension, friction, gravity, normal contact…) and it acts towards the centre.')
m_, v_, r_ = Q('0.20 kg'), Q('4.0 m s⁻¹'), Q('0.80 m'); F = m_.v * v_.v ** 2 / r_.v
N('E', 2, f'A {m_} ball is swung on a cord at {v_} in a horizontal circle of radius {r_}. Calculate the centripetal force on it.', F, 'N',
  f'F = mv²/r = 0.20 × 4.0² ÷ 0.80 = {sf(F, 2)} N', ['C1: F = mv²/r'], sig=2, aq='F')
m_, v_, r_ = Q('1200 kg'), Q('15 m s⁻¹'), Q('45 m'); F = m_.v * v_.v ** 2 / r_.v
N('E', 2, f'What resultant force is needed to keep a {m_} car moving at {v_} round a bend of radius {r_}?', F, 'N',
  f'F = mv²/r = 1200 × 15² ÷ 45 = {sf(F, 2)} N', ['C1: F = mv²/r'], sig=2, aq='F')
m_, w_, r_ = Q('0.050 kg'), Q('12 rad s⁻¹'), Q('0.30 m'); F = m_.v * w_.v ** 2 * r_.v
N('E', 2, f'A {m_} toy on the end of a rotating arm of length {r_} turns at {w_}. Calculate the centripetal force on the toy.', F, 'N',
  f'F = mω²r = 0.050 × 12² × 0.30 = {sf(F, 2)} N', ['C1: F = mω²r'], sig=2, aq='F')
F_, v_, r_ = Q('36 N'), Q('6.0 m s⁻¹'), Q('0.50 m'); m = F_.v * r_.v / v_.v ** 2
N('E', 2, f'A tension of {F_} keeps a stone moving at {v_} in a horizontal circle of radius {r_}. Calculate the mass of the stone.', m, 'kg',
  f'm = Fr/v² = 36 × 0.50 ÷ 6.0² = {sf(m, 2)} kg', ['C1: F = mv²/r rearranged'], sig=2, aq='m')
m_, F_, r_ = Q('800 kg'), Q('5000 N'), Q('80 m'); v = sqrt(F_.v * r_.v / m_.v)
N('E', 2, f'Friction can provide a centripetal force of up to {F_} on an {m_} car on a bend of radius {r_}. What is the highest speed the car can have on the bend?', v, 'm s⁻¹',
  f'v = √(Fr/m) = √(5000 × 80 ÷ 800) = {sf(v, 2)} m s⁻¹', ['C1: v² = Fr/m'], sig=2, aq='v')
M('E', 1, 'The speed of a body moving in a circle of fixed radius is doubled. By what factor does the centripetal force needed change?', '4', ['2', '½', '8'],
  'F = mv²/r, so F ∝ v². Doubling v multiplies F by 2² = 4.')
M('E', 1, 'A car goes round a bend of radius r at speed v. The same car goes round a bend of radius 2r at the same speed. What is the ratio (centripetal force on the second bend)/(centripetal force on the first)?', '½', ['2', '¼', '1'],
  'F = mv²/r, so with m and v fixed F ∝ 1/r. Doubling r halves F.')
m_, w_, r_ = Q('2.0 kg'), Q('3.0 rad s⁻¹'), Q('1.5 m'); F = m_.v * w_.v ** 2 * r_.v
N('E', 2, f'A {m_} sack hangs from the end of a rotating crane arm, {r_} from the axis. The arm rotates at {w_}. Calculate the horizontal force on the sack needed for this motion.', F, 'N',
  f'F = mω²r = 2.0 × 3.0² × 1.5 = {sf(F, 2)} N', ['C1: F = mω²r'], sig=2, aq='F')
m_, F_, r_ = Q('0.15 kg'), Q('9.6 N'), Q('0.60 m'); v = sqrt(F_.v * r_.v / m_.v)
N('E', 2, f'A {m_} ball on a string of length {r_} moves in a horizontal circle with a string tension of {F_}. Ignore gravity. Calculate the speed of the ball.', v, 'm s⁻¹',
  f'v = √(Fr/m) = √(9.6 × 0.60 ÷ 0.15) = {sf(v, 2)} m s⁻¹', ['C1: v² = Fr/m'], sig=2, aq='v')
m_, a_ = Q('65 kg'), Q('5.3 m s⁻²'); F = m_.v * a_.v
N('E', 1, f'A {m_} skater moving round a circle has a centripetal acceleration of {a_}. Calculate the resultant force on her.', F, 'N', f'F = ma = 65 × 5.3 = {sf(F, 2)} N', [], sig=2, aq='F')

# ── medium ──
m_, L_, T_ = Q('0.25 kg'), Q('0.60 m'), Q('0.50 s'); w = 2 * pi / T_.v; F = m_.v * w ** 2 * L_.v
N('M', 3, f'A mass of {m_} on a string is whirled in a horizontal circle of radius {L_}, making one revolution every {T_}. Ignoring gravity, calculate the tension in the string.', F, 'N',
  f'ω = 2π/T = 2π ÷ 0.50 = {sf(w)} rad s⁻¹. Tension = mω²r = 0.25 × {sf(w)}² × 0.60 = {sf(F)} N',
  ['C1: ω = 2π/T', 'C1: tension provides the centripetal force, F = mω²r'], aq='tension')
F = 0.080 * (2 * pi / 0.80) ** 2 * 1.2
N('M', 3, 'An athlete practising with a light training hammer (mass 0.080 kg) swings it round a horizontal circle of radius 1.2 m, completing a turn every 0.80 s. What tension does the wire carry?', F, 'N',
  f'ω = 2π ÷ 0.80 = {sf(2 * pi / 0.8)} rad s⁻¹. T = mω²r = 0.080 × {sf(2 * pi / 0.8)}² × 1.2 = {sf(F)} N',
  ['C1: ω from the period', 'C1: tension = mω²r'], aq='tension')
m_, v_, r_ = Q('1100 kg'), Q('18 m s⁻¹'), Q('60 m'); F = m_.v * v_.v ** 2 / r_.v
N('M', 3, f'A car of mass {m_} drives round a flat circular bend of radius {r_} at {v_}. Calculate the friction force the road must exert on the car, and state its direction.', F, 'N',
  f'Friction is the only horizontal force, so it provides the centripetal force: F = mv²/r = 1100 × 18² ÷ 60 = {sf(F)} N, directed towards the centre of the bend.',
  ['C1: friction provides the centripetal force', 'C1: F = mv²/r'], aq='F')
F_, m_, r_ = Q('480 N'), Q('75 kg'), Q('20 m'); v = sqrt(F_.v * r_.v / m_.v)
N('M', 3, f'A cyclist and bicycle (total mass {m_}) lean into a flat bend of radius {r_}. The tyres can grip with a sideways friction force of at most {F_}. Calculate the greatest speed at which the cyclist can take the bend.', v, 'm s⁻¹',
  f'At the limit, maximum friction = mv²/r, so v = √(Fr/m) = √(480 × 20 ÷ 75) = {sf(v)} m s⁻¹', ['C1: maximum friction = mv²/r', 'C1: rearranged for v'], aq='v_max')
M('M', 3, 'A coin is placed on a turntable that rotates at a steady rate. The coin is moved further from the centre and the turntable runs at the same rate. What happens to the friction force needed to stop the coin sliding?',
  'It increases in proportion to the distance from the centre', ['It decreases', 'It stays the same', 'It increases in proportion to the square of the distance'],
  'F = mω²r with ω fixed, so F ∝ r. This is why a coin near the rim slides off first.', ['C1: ω the same', 'C1: F = mω²r ∝ r'],
  cm='using F = mv²/r and saying F ∝ 1/r — v is not constant here, ω is.')
m_, v_, r_ = Q('35 kg'), Q('3.0 m s⁻¹'), Q('2.5 m'); T = m_.v * 9.81 + m_.v * v_.v ** 2 / r_.v
N('M', 4, f'A child of mass {m_} on a swing passes through the lowest point at {v_}. The swing\'s chains are {r_} long. Calculate the total tension in the chains at the lowest point.' + take('g'), T, 'N',
  f'At the lowest point the resultant upward force provides the centripetal force: T − mg = mv²/r. T = mg + mv²/r = 35 × 9.81 + 35 × 3.0² ÷ 2.5 = {sf(T)} N',
  ['C1: T − mg = mv²/r', 'C1: mg', 'C1: mv²/r'], aq='T', cm='setting T = mv²/r and forgetting the weight.')
m_, v_, r_ = Q('0.40 kg'), Q('5.0 m s⁻¹'), Q('0.75 m'); T = m_.v * 9.81 + m_.v * v_.v ** 2 / r_.v
N('M', 4, f'A bucket and water of total mass {m_} is swung in a vertical circle of radius {r_}. At the bottom of the circle it moves at {v_}. What force does the person\'s hand exert on the handle at that point?' + take('g'), T, 'N',
  f'T − mg = mv²/r, so T = 0.40 × 9.81 + 0.40 × 5.0² ÷ 0.75 = {sf(T)} N, upwards', ['C1: T − mg = mv²/r', 'C1: mg', 'C1: mv²/r'], aq='T')
v_, r_ = Q('25 m s⁻¹'), Q('80 m'); a = v_.v ** 2 / r_.v; ratio = a / 9.81
N('M', 3, f'A rider on a fairground loop moves at {v_} round a circle of radius {r_}. Calculate the centripetal acceleration as a multiple of g.' + take('g'), ratio, None,
  f'a = v²/r = 25² ÷ 80 = {sf(a)} m s⁻². In units of g: {sf(a)} ÷ 9.81 = {sf(ratio)}', ['C1: a = v²/r', 'C1: divide by g'], aq='a/g')
m_, r_, T_ = Q('7.35 × 10²² kg'), Q('3.84 × 10⁸ m'), Q('27.3 days'); w = 2 * pi / T_.v; F = m_.v * w ** 2 * r_.v
N('M', 4, f'The Moon (mass {m_}) moves in a circular orbit of radius {r_} with a period of {T_}. Calculate the gravitational force the Earth exerts on it.', F, 'N',
  f'T = {sf(T_.v)} s. ω = 2π/T = {sf(w)} rad s⁻¹. F = mω²r = 7.35 × 10²² × ({sf(w)})² × 3.84 × 10⁸ = {sf(F)} N',
  ['C1: T in seconds', 'C1: ω = 2π/T', 'B1: gravity provides the centripetal force: F = mω²r'], aq='F')
M('M', 3, 'A student says that a passenger in a car going round a bend is "thrown outwards by centrifugal force". Which is the correct explanation of what the passenger feels?',
  'The passenger tends to continue in a straight line; the door pushes inwards on the passenger to provide the centripetal force',
  ['An outward centrifugal force acts on the passenger and is balanced by the door', 'The car pushes outwards on the passenger', 'Gravity acts outwards on a bend'],
  'In the ground frame there is no outward force. The passenger\'s inertia keeps them moving in a straight line until the door (or seat friction) supplies the inward, centripetal force. The push of the door is what they feel.',
  ['C1: inertia / tendency to move along tangent', 'C1: inward force from the door is the centripetal force'])
m_, r_, F_ = Q('0.30 kg'), Q('0.50 m'), Q('60 N'); w = sqrt(F_.v / (m_.v * r_.v)); rpm = w * 60 / (2 * pi)
N('M', 4, f'A string breaks if its tension exceeds {F_}. It is used to whirl a {m_} mass in a horizontal circle of radius {r_} (ignore gravity). Calculate the maximum rate of rotation in rev min⁻¹.', rpm, 'rev min⁻¹',
  f'F = mω²r, so ω_max = √(F/mr) = √(60 ÷ (0.30 × 0.50)) = {sf(w)} rad s⁻¹. In rev min⁻¹: {sf(w, 4)} × 60 ÷ (2π) = {sf(rpm)}',
  ['C1: F = mω²r', 'C1: ω_max', 'C1: convert to rev min⁻¹'], aq='maximum rate')
M('M', 3, 'A mass on a string moves in a horizontal circle. The speed is kept constant and the string is lengthened from 0.5 m to 1.0 m. What happens to the tension?',
  'It halves', ['It doubles', 'It is unchanged', 'It quarters'], 'At constant speed, T = mv²/r ∝ 1/r. Doubling the radius halves the tension.', ['C1: v constant', 'C1: T ∝ 1/r'])
M('M', 4, 'Two identical cars go round the same circular bend. Car A goes at 10 m s⁻¹, car B at 20 m s⁻¹. Car A needs a friction force of 2.0 kN. Which statement is correct?',
  'Car B needs 8.0 kN of friction, so it is more likely to skid', ['Car B needs 4.0 kN of friction', 'Car B needs 2.0 kN of friction because the bend is the same', 'Car B needs 1.0 kN of friction because it spends less time on the bend'],
  'F = mv²/r ∝ v². Doubling the speed needs 2² = 4 times the force: 4 × 2.0 = 8.0 kN. If the maximum friction is less than this, car B skids.',
  ['C1: F ∝ v²', 'C1: factor 4', 'C1: 8.0 kN'])

# ── hard ──
m_, r_, v_ = Q('900 kg'), Q('40 m'), Q('14 m s⁻¹'); F = m_.v * v_.v ** 2 / r_.v; mu = F / (m_.v * 9.81); vmax = sqrt(9.81 * r_.v * 0.80)
N('H', 6, f'A car of mass {m_} travels round a flat bend of radius {r_} at {v_}. (a) Calculate the centripetal force required. (b) This force is provided by friction. Calculate the ratio (friction force)/(weight). (c) On a dry day the maximum friction is 0.80 times the weight. Calculate the maximum safe speed round this bend. Give only the answer to (c).' + take('g'), vmax, 'm s⁻¹',
  f'(a) F = mv²/r = 900 × 14² ÷ 40 = {sf(F)} N. (b) ratio = {sf(F)} ÷ (900 × 9.81) = {sf(mu)}. (c) 0.80mg = mv²/r, so v = √(0.80gr) = √(0.80 × 9.81 × 40) = {sf(vmax)} m s⁻¹ — the mass cancels.',
  ['C1: F = mv²/r', 'A1: F', 'A1: ratio', 'C1: 0.80 mg = mv²/r', 'M1: mass cancels', 'A1: v_max'], aq='v_max')
vwet = sqrt(0.35 * 9.81 * 25); vdry = sqrt(0.80 * 9.81 * 25)
N('H', 6, 'Road engineers check a tight bend of radius 25 m. The maximum sideways friction on a car is 0.80 of its weight on a dry road but only 0.35 of its weight on ice. (a) Show that the maximum speed does not depend on the car\'s mass. (b) Calculate the maximum speed on the dry road. (c) Calculate the maximum speed on ice, and the percentage reduction. Give only the maximum speed on ice.' + take('g'), vwet, 'm s⁻¹',
  f'(a) kmg = mv²/r gives v = √(kgr): m cancels. (b) v = √(0.80 × 9.81 × 25) = {sf(vdry)} m s⁻¹. (c) v = √(0.35 × 9.81 × 25) = {sf(vwet)} m s⁻¹, a reduction of {sf((1 - vwet / vdry) * 100, 2)} %.',
  ['M1: friction = kmg equated to mv²/r', 'A1: mass cancels', 'A1: dry speed', 'C1: same method with 0.35', 'A1: speed on ice', 'B1: percentage reduction'], aq='v_ice')
m_, L_, v_ = Q('0.50 kg'), Q('0.80 m'), Q('7.0 m s⁻¹')
Tb = m_.v * v_.v ** 2 / L_.v + m_.v * 9.81; v_top = sqrt(v_.v ** 2 - 4 * 9.81 * L_.v); Tt = m_.v * v_top ** 2 / L_.v - m_.v * 9.81
assert Tt > 0, 'string would go slack at the top'
N('H', 7, f'A ball of mass {m_} on a string of length {L_} is swung in a vertical circle. At the bottom its speed is {v_}. Air resistance is negligible. (a) Calculate the tension at the bottom. (b) Use energy conservation to find the speed at the top. (c) Calculate the tension at the top. Give only the answer to (c).' + take('g'), Tt, 'N',
  f'(a) T − mg = mv²/r: T = 0.50 × 7.0² ÷ 0.80 + 0.50 × 9.81 = {sf(Tb)} N. (b) ½mv_top² = ½mv² − mg(2L): v_top = √(7.0² − 4 × 9.81 × 0.80) = {sf(v_top)} m s⁻¹. (c) At the top, T + mg = mv²/r: T = 0.50 × {sf(v_top)}² ÷ 0.80 − 0.50 × 9.81 = {sf(Tt)} N',
  ['C1: T − mg = mv²/r at bottom', 'A1: T bottom', 'C1: energy: height gain 2L', 'A1: v at top', 'C1: T + mg = mv²/r at top', 'A1: T top', 'B1: tension greatest at the bottom'], aq='T_top')
r_ = Q('8.0 m'); vmin = sqrt(9.81 * r_.v)
N('H', 5, f'A roller-coaster car goes round a vertical loop of radius {r_}. (a) State the forces on the car at the top of the loop and their directions. (b) Show that the minimum speed at the top for the car to stay in contact with the track is √(gr). (c) Calculate this minimum speed. Give only the answer to (c).' + take('g'), vmin, 'm s⁻¹',
  f'(a) Weight mg downwards and the normal contact force N from the track, also downwards (the track is above the car). (b) N + mg = mv²/r. The car only just stays in contact when N = 0, so mg = mv²/r and v = √(gr). (c) v = √(9.81 × 8.0) = {sf(vmin)} m s⁻¹',
  ['B1: both forces downwards at the top', 'M1: N + mg = mv²/r', 'M1: N = 0 at the minimum speed', 'C1: v = √(gr)', 'A1: v_min'], aq='v_min')
h_min = 2.5 * 15
N('H', 5, 'A designer wants a frictionless toy car to coast round a vertical loop of radius 15 cm after rolling from rest down a slope. (a) Write an expression for the minimum speed at the top of the loop. (b) Use energy conservation to show that the start of the slope must be at least 2.5r above the bottom of the loop. (c) Calculate this minimum height in cm. Give only the answer to (c).', h_min, 'cm',
  f'(a) mg = mv²/r at the top, so v_min² = gr. (b) mgh = mg(2r) + ½m(gr), so h = 2r + r/2 = 2.5r. (c) h = 2.5 × 15 = {sf(h_min)} cm',
  ['C1: mg = mv²/r', 'A1: v² = gr', 'M1: energy equation including 2r', 'M1: h = 2.5r shown', 'A1: h'], aq='h')
m_, r_, n_ = Q('60 kg'), Q('3.0 m'), Q('24 rev min⁻¹'); w = n_.v; Nf = m_.v * w ** 2 * r_.v
N('H', 6, f'A "rotor" fairground ride is a vertical cylinder of radius {r_}. Riders stand against the wall, the cylinder spins at {n_}, and the floor drops away. A rider has mass {m_}. (a) Calculate the angular speed. (b) Calculate the normal contact force of the wall on the rider. (c) State which force stops the rider sliding down, and calculate its size. Give only the answer to (b).' + take('g'), Nf, 'N',
  f'(a) ω = 2π × 24 ÷ 60 = {sf(w)} rad s⁻¹. (b) The wall\'s normal force is the only horizontal force, so it provides the centripetal force: N = mω²r = 60 × {sf(w)}² × 3.0 = {sf(Nf)} N. (c) Upward friction from the wall balances the weight: 60 × 9.81 = {sf(60 * 9.81)} N.',
  ['C1: ω from rev min⁻¹', 'A1: ω', 'B1: normal force provides centripetal force', 'C1: N = mω²r', 'A1: N', 'B1: friction = weight'], aq='N')
m_, r_, T_ = Q('420 kg'), Q('7.0 × 10⁶ m'), Q('97 min'); w = 2 * pi / T_.v; F = m_.v * w ** 2 * r_.v
N('H', 5, f'A weather satellite of mass {m_} moves in a circular orbit of radius {r_} with period {T_}. (a) Calculate its angular speed. (b) Calculate the centripetal force on it. (c) Deduce the gravitational field strength at this distance from the Earth\'s centre. Give only the answer to (c).', w ** 2 * r_.v, 'N kg⁻¹',
  f'(a) T = 97 × 60 = 5820 s, ω = 2π/T = {sf(w)} rad s⁻¹. (b) F = mω²r = 420 × ({sf(w)})² × 7.0 × 10⁶ = {sf(F)} N. (c) Gravity provides this force, so g = F/m = ω²r = ({sf(w)})² × 7.0 × 10⁶ = {sf(w ** 2 * r_.v)} N kg⁻¹',
  ['C1: T in s', 'A1: ω', 'C1: F = mω²r', 'A1: F', 'B1: g = F/m = ω²r'], aq='g')
N('H', 6, 'A small block of mass 0.15 kg sits on a horizontal turntable 0.12 m from the axis. The maximum friction force between the block and the turntable is 0.45 N. The turntable is slowly speeded up from rest. (a) State what provides the centripetal force on the block. (b) Calculate the angular speed at which the block starts to slide. (c) The block is moved to 0.24 m from the axis. Deduce the new angular speed at which it slides. Give only the answer to (b).', sqrt(0.45 / (0.15 * 0.12)), 'rad s⁻¹',
  f'(a) Static friction from the turntable, towards the axis. (b) Sliding starts when mω²r = F_max: ω = √(F/mr) = √(0.45 ÷ (0.15 × 0.12)) = {sf(sqrt(0.45 / 0.018))} rad s⁻¹. (c) ω ∝ 1/√r, so ω = {sf(sqrt(0.45 / 0.018))} ÷ √2 = {sf(sqrt(0.45 / 0.036))} rad s⁻¹',
  ['B1: friction towards the centre', 'C1: F_max = mω²r', 'C1: rearrangement', 'A1: ω', 'M1: ω ∝ 1/√r', 'A1: new ω'], aq='ω')

# ═════════════════════════ 16.6 Calculating acceleration and force ═════════════════════════
lesson('16.6')

v_, r_ = Q('12 m s⁻¹'), Q('30 m'); a = v_.v ** 2 / r_.v
N('E', 2, f'A go-kart takes a bend of radius {r_} at {v_}. Calculate its centripetal acceleration.', a, 'm s⁻²', f'a = v²/r = 12² ÷ 30 = {sf(a, 2)} m s⁻²', ['C1: a = v²/r'], sig=2, aq='a')
v_, r_ = Q('7.7 × 10³ m s⁻¹'), Q('6.8 × 10⁶ m'); a = v_.v ** 2 / r_.v
N('E', 2, f'What is the centripetal acceleration of a satellite orbiting at {v_} at a distance of {r_} from the Earth\'s centre?', a, 'm s⁻²',
  f'a = v²/r = (7.7 × 10³)² ÷ 6.8 × 10⁶ = {sf(a, 2)} m s⁻²', ['C1: a = v²/r'], sig=2, aq='a')
w_, r_ = Q('4.0 rad s⁻¹'), Q('0.25 m'); a = w_.v ** 2 * r_.v
N('E', 2, f'A paint mixer stirs at {w_}. A blob of paint is {r_} from the axis. Calculate its centripetal acceleration.', a, 'm s⁻²', f'a = ω²r = 4.0² × 0.25 = {sf(a, 2)} m s⁻²', ['C1: a = ω²r'], sig=2, aq='a')
a_, r_ = Q('9.0 m s⁻²'), Q('4.0 m'); v = sqrt(a_.v * r_.v)
N('E', 2, f'An astronaut-training centrifuge arm of radius {r_} gives the trainee a centripetal acceleration of {a_}. How fast is the trainee moving?', v, 'm s⁻¹', f'v = √(ar) = √(9.0 × 4.0) = {sf(v, 2)} m s⁻¹', ['C1: a = v²/r rearranged'], sig=2, aq='v')
a_, w_ = Q('16 m s⁻²'), Q('2.0 rad s⁻¹'); r = a_.v / w_.v ** 2
N('E', 2, f'A rotating fairground arm turns at {w_}. A seat at its end has centripetal acceleration {a_}. How far is the seat from the axis?', r, 'm', f'r = a/ω² = 16 ÷ 2.0² = {sf(r, 2)} m', ['C1: a = ω²r rearranged'], sig=2, aq='r')
v_, w_ = Q('3.0 m s⁻¹'), Q('5.0 rad s⁻¹'); a = v_.v * w_.v
N('E', 2, f'A conker moves in a circle with speed {v_} and angular speed {w_}. Calculate its centripetal acceleration without first finding the radius.', a, 'm s⁻²',
  f'a = v²/r and v = ωr give a = vω = 3.0 × 5.0 = {sf(a, 2)} m s⁻²', ['C1: a = vω'], sig=2, aq='a')
M('E', 1, 'Which expression is NOT equal to the centripetal acceleration of a body moving in a circle?', 'ω/r', ['v²/r', 'ω²r', 'vω'],
  'a = v²/r = ω²r = vω (using v = ωr). ω/r has units of rad s⁻¹ m⁻¹, not m s⁻².')
M('E', 1, 'What is the SI unit of centripetal acceleration?', 'm s⁻²', ['m s⁻¹', 'rad s⁻²', 'N kg'],
  'Like any acceleration, centripetal acceleration is a rate of change of velocity, measured in m s⁻² (equivalent to N kg⁻¹).')
M('E', 1, 'The angular speed of a body moving in a circle of fixed radius is tripled. By what factor does its centripetal acceleration change?', '9', ['3', '6', '27'],
  'a = ω²r, so a ∝ ω². Tripling ω multiplies a by 3² = 9.')
m_, a_ = Q('2.5 kg'), Q('8.0 m s⁻²'); F = m_.v * a_.v
N('E', 1, f'A {m_} parcel on a rotating carousel conveyor has a centripetal acceleration of {a_}. Calculate the resultant force on it.', F, 'N', f'F = ma = 2.5 × 8.0 = {sf(F, 2)} N', [], sig=2, aq='F')
M('E', 1, 'A body moves in a circle with constant speed. In which direction is its acceleration?', 'Along the radius, towards the centre', ['Along the tangent', 'Along the radius, away from the centre', 'Perpendicular to the plane of the circle'],
  'Centripetal acceleration a = v²/r is always directed along the radius towards the centre.')
v_, r_ = Q('0.80 m s⁻¹'), Q('0.40 m'); a = v_.v ** 2 / r_.v
N('E', 2, f'An ant clings to the edge of a turntable of radius {r_}. The edge moves at {v_}. Calculate the ant\'s centripetal acceleration.', a, 'm s⁻²', f'a = v²/r = 0.80² ÷ 0.40 = {sf(a, 2)} m s⁻²', ['C1: a = v²/r'], sig=2, aq='a')
w_, r_ = Q('0.50 rad s⁻¹'), Q('20 m'); a = w_.v ** 2 * r_.v
N('E', 2, f'A capsule on a slowly turning observation wheel is {r_} from the axle. The wheel turns at {w_}. Find the centripetal acceleration of the capsule.', a, 'm s⁻²', f'a = ω²r = 0.50² × 20 = {sf(a, 2)} m s⁻²', ['C1: a = ω²r'], sig=2, aq='a')

# ── medium ──
T_, r_ = Q('2.0 s'), Q('0.50 m'); a = 4 * pi ** 2 * r_.v / T_.v ** 2
N('M', 3, f'A conker on a string moves in a circle of radius {r_}, making one revolution every {T_}. Calculate its centripetal acceleration.', a, 'm s⁻²',
  f'ω = 2π/T = 2π ÷ 2.0 = {sf(pi)} rad s⁻¹. a = ω²r = {sf(pi)}² × 0.50 = {sf(a)} m s⁻²', ['C1: ω = 2π/T', 'C1: a = ω²r'], aq='a')
a = 4 * pi ** 2 * 4.5 / 6.0 ** 2
N('M', 3, 'A large park roundabout of radius 4.5 m takes 6.0 s per turn. What centripetal acceleration does a child at its edge experience?', a, 'm s⁻²',
  f'a = 4π²r/T² = 4π² × 4.5 ÷ 6.0² = {sf(a)} m s⁻²', ['C1: ω = 2π/T', 'C1: a = ω²r = 4π²r/T²'], aq='a')
n_, r_ = Q('1200 rev min⁻¹'), Q('0.25 m'); w = n_.v; a = w ** 2 * r_.v
N('M', 4, f'The drum of a washing machine has radius {r_} and spins at {n_}. Calculate the centripetal acceleration of the clothes against the drum, as a multiple of g.' + take('g'), a / 9.81, None,
  f'ω = 2π × 1200 ÷ 60 = {sf(w)} rad s⁻¹. a = ω²r = ({sf(w)})² × 0.25 = {sf(a)} m s⁻². Multiple of g = {sf(a)} ÷ 9.81 = {sf(a / 9.81)}',
  ['C1: ω from rev min⁻¹', 'C1: a = ω²r', 'C1: ÷ g'], aq='a/g')
w = 5000 * 2 * pi / 60; r = 2.0e4 * 9.81 / w ** 2
N('M', 4, 'A blood centrifuge must give a sample an acceleration of 2.0 × 10⁴ g when it spins at 5000 rev min⁻¹. How far from the axis must the sample tube be?' + take('g'), r, 'm',
  f'ω = 2π × 5000 ÷ 60 = {sf(w)} rad s⁻¹. a = 2.0 × 10⁴ × 9.81 = {sf(2e4 * 9.81)} m s⁻². r = a/ω² = {sf(2e4 * 9.81)} ÷ ({sf(w)})² = {sf(r)} m',
  ['C1: ω from rev min⁻¹', 'C1: a in m s⁻²', 'C1: r = a/ω²'], aq='r')
r_, T_ = Q('3.84 × 10⁸ m'), Q('27.3 days'); a = 4 * pi ** 2 * r_.v / T_.v ** 2
N('M', 3, f'Calculate the centripetal acceleration of the Moon in its orbit (radius {r_}, period {T_}).', a, 'm s⁻²',
  f'T = {sf(T_.v)} s. a = 4π²r/T² = 4π² × 3.84 × 10⁸ ÷ ({sf(T_.v)})² = {sf(a)} m s⁻²', ['C1: T in seconds', 'C1: a = 4π²r/T²'], aq='a')
r_, T_ = Q('1.50 × 10¹¹ m'), Q('365 days'); a = 4 * pi ** 2 * r_.v / T_.v ** 2; F = 5.97e24 * a
N('M', 4, f'The Earth (mass 5.97 × 10²⁴ kg) orbits the Sun at {r_} once every {T_}. Find the gravitational force of the Sun on the Earth from its orbital motion.', F, 'N',
  f'T = {sf(T_.v)} s. a = 4π²r/T² = {sf(a)} m s⁻². F = ma = 5.97 × 10²⁴ × {sf(a)} = {sf(F)} N',
  ['C1: T in seconds', 'C1: a = 4π²r/T²', 'C1: F = ma'], aq='F')
m_, r_, v1, v2 = Q('0.40 kg'), Q('1.2 m'), Q('3.0 m s⁻¹'), Q('6.0 m s⁻¹'); dF = m_.v * (v2.v ** 2 - v1.v ** 2) / r_.v
N('M', 3, f'A {m_} ball is whirled in a horizontal circle of radius {r_}. Its speed is increased from {v1} to {v2}. By how much must the tension increase?', dF, 'N',
  f'F = mv²/r. F₁ = 0.40 × 3.0² ÷ 1.2 = {sf(0.4 * 9 / 1.2)} N, F₂ = 0.40 × 6.0² ÷ 1.2 = {sf(0.4 * 36 / 1.2)} N. Increase = 12.0 − 3.00 = {sf(dF)} N',
  ['C1: F = mv²/r', 'C1: both forces calculated'], aq='ΔF', cm='doubling the force when the speed doubles — F depends on v².')
M('M', 3, 'Two cars of equal mass go round the same circular track. Car X takes 20 s per lap and car Y takes 40 s per lap. What is the ratio (centripetal force on X)/(centripetal force on Y)?',
  '4', ['2', '½', '¼'], 'F = mω²r = 4π²mr/T². With m and r the same, F ∝ 1/T². T_Y = 2T_X, so F_X/F_Y = (40/20)² = 4.', ['C1: F ∝ ω² ∝ 1/T²', 'C1: ratio squared'])
m_, r_, a_ = Q('70 kg'), Q('6.0 m'), Q('15 m s⁻²'); T = 2 * pi * sqrt(r_.v / a_.v)
N('M', 3, f'A pilot-training rig spins a {m_} pilot in a circle of radius {r_} so that the centripetal acceleration is {a_}. Calculate the period of rotation.', T, 's',
  f'a = ω²r so ω = √(a/r) = √(15 ÷ 6.0) = {sf(sqrt(2.5))} rad s⁻¹. T = 2π/ω = 2π ÷ {sf(sqrt(2.5), 4)} = {sf(T)} s',
  ['C1: ω = √(a/r)', 'C1: T = 2π/ω'], aq='T')
M('M', 3, 'A stone tied to a string is whirled in a horizontal circle. The string is shortened to half its length while the period stays the same. What happens to the tension?',
  'It halves', ['It doubles', 'It stays the same', 'It quadruples'],
  'With the period (and so ω) fixed, F = mω²r ∝ r. Halving r halves the tension.', ['C1: ω constant', 'C1: F ∝ r'],
  cm='using F = mv²/r with v fixed — but v changes when r changes at constant period.')
m_, v_, r_ = Q('80 kg'), Q('10 m s⁻¹'), Q('20 m'); w = v_.v / r_.v; F = m_.v * w ** 2 * r_.v
N('M', 3, f'A {m_} motorcyclist rides at {v_} round a circle of radius {r_}. Calculate (a) the angular speed and (b) the centripetal force, using F = mω²r. Give only the answer to (b).', F, 'N',
  f'(a) ω = v/r = 10 ÷ 20 = {sf(w)} rad s⁻¹. (b) F = mω²r = 80 × {sf(w)}² × 20 = {sf(F)} N (the same as mv²/r)', ['C1: ω = v/r', 'C1: F = mω²r'], aq='F')
d_, f_ = Q('22 cm'), Q('0.75 Hz'); r = d_.v / 2; a = (2 * pi * f_.v) ** 2 * r
N('M', 4, f'A child spins a toy wheel of diameter {d_} at {f_}. Calculate the centripetal acceleration of a point on the rim.', a, 'm s⁻²',
  f'r = 0.11 m. ω = 2πf = 2π × 0.75 = {sf(2 * pi * f_.v)} rad s⁻¹. a = ω²r = ({sf(2 * pi * f_.v)})² × 0.11 = {sf(a)} m s⁻²',
  ['C1: r = d/2 in m', 'C1: ω = 2πf', 'C1: a = ω²r'], aq='a')
a_mars = 4 * pi ** 2 * 9.38e6 / (7.66 * 3600) ** 2
N('M', 3, 'Phobos orbits Mars in a circle of radius 9.38 × 10⁶ m, taking 7.66 hours per orbit. Calculate the centripetal acceleration of Phobos.', a_mars, 'm s⁻²',
  f'T = 7.66 × 3600 = {sf(7.66 * 3600)} s. a = 4π²r/T² = 4π² × 9.38 × 10⁶ ÷ ({sf(7.66 * 3600)})² = {sf(a_mars)} m s⁻²', ['C1: T in seconds', 'C1: a = 4π²r/T²'], aq='a')

# ── hard ──
for h_orb in (400e3, 2000e3):
    r = 6.37e6 + h_orb; gfield = 9.81 * (6.37e6 / r) ** 2; v = sqrt(gfield * r); T = 2 * pi * r / v
    stem = (f'A crewed space station orbits {h_orb / 1e3:g} km above the Earth\'s surface. The Earth\'s radius is 6.37 × 10⁶ m and g at the surface is 9.81 m s⁻². (a) Show that the gravitational field strength at the orbit is {sf(gfield, 2)} N kg⁻¹ (g ∝ 1/r²). (b) Explain why the centripetal acceleration equals this field strength. (c) Calculate the orbital speed. (d) Calculate the period. Give only the answer to (d).'
            if h_orb == 400e3 else
            f'Mission planners place a navigation satellite in a circular orbit at an altitude of {h_orb / 1e3:g} km. They know only that g = 9.81 N kg⁻¹ at the surface of the Earth (radius 6.37 × 10⁶ m) and that g falls off as 1/r². (a) Find g at the satellite\'s orbit. (b) State why this is the satellite\'s centripetal acceleration. (c) Find its orbital speed. (d) Find how long one orbit takes. Give only the answer to (d).')
    N('H', 6, stem, T, 's',
      f'(a) r = 6.37 × 10⁶ + {h_orb:.0f} = {sf(r)} m. g = 9.81 × (6.37 × 10⁶ ÷ {sf(r, 4)})² = {sf(gfield)} N kg⁻¹. (b) Gravity is the only force, so a = F/m = g. (c) v = √(gr) = √({sf(gfield, 4)} × {sf(r, 4)}) = {sf(v)} m s⁻¹. (d) T = 2πr/v = 2π × {sf(r, 4)} ÷ {sf(v, 4)} = {sf(T)} s',
      ['M1: r = R + h', 'M1: inverse-square scaling', 'B1: gravity provides the centripetal force', 'C1: v = √(gr)', 'C1: T = 2πr/v', 'A1: T'], aq='T')
m_, r_, v_ = Q('0.050 kg'), Q('0.20 m'), Q('1.5 m s⁻¹'); a = v_.v ** 2 / r_.v; F = m_.v * a; F2 = F * 4
N('H', 5, f'A marble of mass {m_} rolls round the inside of a horizontal circular ring of radius {r_} at {v_}. (a) Calculate its centripetal acceleration. (b) Calculate the force from the ring on the marble. (c) The speed is doubled. Calculate the new force. Give only the answer to (c).', F2, 'N',
  f'(a) a = v²/r = 1.5² ÷ 0.20 = {sf(a)} m s⁻². (b) F = ma = 0.050 × {sf(a)} = {sf(F)} N, horizontal and towards the centre. (c) F ∝ v², so F = {sf(F)} × 2² = {sf(F2)} N',
  ['C1: a = v²/r', 'A1: a', 'C1: F = ma', 'B1: towards the centre', 'B1: F ∝ v²'], aq='F')
w = sqrt(9.81 / 1800); T = 2 * pi / w
N('H', 5, 'A science-fiction space station is a ring of radius 1.8 km that rotates to give "artificial gravity". Astronauts stand on the inside of the outer wall. (a) Explain how rotation makes the astronauts feel a weight. (b) Calculate the angular speed needed for the floor to push on them with a force equal to their weight on Earth. (c) Calculate the period of rotation. Give only the answer to (c).' + take('g'), T, 's',
  f'(a) The floor must push inwards on each astronaut to provide the centripetal force. They feel this contact force as weight. (b) a = ω²r = 9.81, so ω = √(9.81 ÷ 1800) = {sf(w)} rad s⁻¹. (c) T = 2π/ω = 2π ÷ {sf(w, 4)} = {sf(T)} s',
  ['B1: floor provides centripetal force, felt as weight', 'C1: a = ω²r', 'A1: ω', 'C1: T = 2π/ω', 'A1: T'], aq='T')
w = 2 * pi / 30; r = 0.38 * 9.81 / w ** 2
N('H', 5, 'A Mars-mission habitat is spun so that astronauts experience 0.38 g, the gravity on Mars. Engineers want a period of 30 s so that the spin does not cause motion sickness. (a) Calculate the angular speed. (b) Calculate the radius needed. (c) Explain why a larger radius makes the "gravity" more uniform from head to foot. Give only the answer to (b).' + take('g'), r, 'm',
  f'(a) ω = 2π ÷ 30 = {sf(w)} rad s⁻¹. (b) r = a/ω² = 0.38 × 9.81 ÷ ({sf(w)})² = {sf(r)} m. (c) a = ω²r, so a person of height h feels a fractional difference h/r between head and feet: a large r makes this small.',
  ['C1: ω = 2π/T', 'A1: ω', 'C1: r = a/ω²', 'A1: r', 'B1: a ∝ r, fractional change h/r'], aq='r')
m_, L_ = Q('0.40 kg'), Q('1.2 m'); th = radians(30); T = m_.v * 9.81 / cos(th); r = L_.v * sin(th); v = sqrt(9.81 * r * tan(th))
N('H', 7, f'A mass of {m_} on a string of length {L_} moves in a horizontal circle as a conical pendulum, the string making 30° with the vertical. (a) Resolve vertically to find the tension. (b) Find the radius of the circle. (c) Resolve horizontally and calculate the speed of the mass. Give only the answer to (c).' + take('g'), v, 'm s⁻¹',
  f'(a) T cos 30° = mg, so T = 0.40 × 9.81 ÷ cos 30 = {sf(T)} N. (b) r = L sin 30° = 1.2 × sin 30 = {sf(r)} m. (c) T sin θ = mv²/r. Dividing by the vertical equation: tan θ = v²/(rg), so v = √(rg tan θ) = √({sf(r)} × 9.81 × tan 30) = {sf(v)} m s⁻¹',
  ['C1: T cos θ = mg', 'A1: T', 'B1: r = L sin θ', 'C1: T sin θ = mv²/r', 'M1: combine: tan θ = v²/rg', 'A1: v', 'B1: horizontal component provides centripetal force'], aq='v')
a_e = 8.2e-8 / 9.11e-31; v_e = sqrt(a_e * 5.3e-11)
N('H', 6, 'An electron moves in a circular orbit of radius 5.3 × 10⁻¹¹ m around a proton. The electric force on it is 8.2 × 10⁻⁸ N. (a) State the direction of the force. (b) Calculate the centripetal acceleration of the electron. (c) Calculate its speed. (d) Calculate the time for one orbit. Give only the answer to (c).' + take('me'), v_e, 'm s⁻¹',
  f'(a) Towards the proton (attraction). (b) a = F/m = 8.2 × 10⁻⁸ ÷ 9.11 × 10⁻³¹ = {sf(a_e)} m s⁻². (c) v = √(ar) = √({sf(a_e)} × 5.3 × 10⁻¹¹) = {sf(v_e)} m s⁻¹. (d) T = 2πr/v = 2π × 5.3 × 10⁻¹¹ ÷ {sf(v_e)} = {sf(2 * pi * 5.3e-11 / v_e)} s',
  ['B1: towards the proton', 'C1: a = F/m', 'A1: a', 'C1: v = √(ar)', 'A1: v', 'B1: (d) T = 2πr/v'], aq='v')
v = sqrt(1800 * 1.5 / 7.26)
N('H', 5, 'An athlete spins a 7.26 kg hammer in a horizontal circle of radius 1.5 m. The wire can take a maximum tension of 1800 N. Ignore the hammer\'s weight. (a) State the relationship between the tension and the speed. (b) Calculate the maximum speed of the hammer. (c) Calculate the maximum angular speed. Give only the answer to (b).', v, 'm s⁻¹',
  f'(a) The tension provides the centripetal force: T = mv²/r. (b) v = √(Tr/m) = √(1800 × 1.5 ÷ 7.26) = {sf(v)} m s⁻¹. (c) ω = v/r = {sf(v, 4)} ÷ 1.5 = {sf(v / 1.5)} rad s⁻¹',
  ['B1: T = mv²/r', 'C1: rearranged for v', 'A1: v_max', 'C1: ω = v/r', 'A1: ω_max'], aq='v_max')
grad = 6.70 / 16.0; m_fit = grad * 0.60
N('H', 6, 'A student whirls a bung on a string in a horizontal circle of radius 0.60 m and measures the tension F for different speeds v: v = 1.0, 2.0, 3.0, 4.0 m s⁻¹ gives F = 0.42, 1.66, 3.76, 6.70 N. (a) State what graph should be plotted to give a straight line through the origin. (b) Explain how the gradient is related to the mass of the bung. (c) Use the last data point to estimate the gradient, and calculate the mass of the bung. Give only the mass in (c).', m_fit, 'kg',
  f'(a) F against v². (b) F = (m/r)v², so gradient = m/r and m = gradient × r. (c) gradient ≈ 6.70 ÷ 16.0 = {sf(grad)} N s² m⁻², m = {sf(grad)} × 0.60 = {sf(m_fit, 2)} kg (the first point agrees: 0.42 ÷ 1.0 × 0.60 = 0.25 kg).',
  ['B1: F against v²', 'M1: F = (m/r)v²', 'A1: gradient = m/r', 'C1: gradient from data', 'C1: m = gradient × r', 'A1: m'], sig=2, aq='m')

# ═════════════════════════ 16.7 The origins of centripetal forces ═════════════════════════
lesson('16.7')

M('E', 1, 'A weather satellite orbiting the Earth moves in a circular path. What provides its centripetal force?', 'The gravitational force of the Earth',
  ['Friction with the thin upper atmosphere', 'Tension in its solar-panel arms', 'The normal contact force'],
  'Gravity is the only significant force on an orbiting satellite and it points towards the Earth\'s centre.')
M('E', 1, 'Which force keeps a racing car on its curved path as it takes a flat, unbanked hairpin bend?', 'Friction between the tyres and the road',
  ['The weight of the car', 'Air resistance', 'The tension in the seat belts'],
  'The weight and the normal force are vertical. The sideways friction of the road on the tyres is horizontal and towards the centre.')
M('E', 1, 'A conker is whirled on a string in a horizontal circle; the string slopes down slightly from the hand. What is the origin of the centripetal force on the conker?', 'The horizontal component of the tension in the string',
  ['The weight of the conker', 'Air resistance', 'The vertical component of the tension'],
  'The tension acts along the string. Its horizontal component points towards the centre of the circle; its vertical component balances the weight.')
M('E', 1, 'Wet towels go round pressed against the wall of a spin-drier drum. What force on the towels acts towards the axis of the drum?', 'The normal contact force of the drum wall',
  ['Friction between the towels and the drum', 'The weight of the towels', 'Air pressure in the drum'],
  'The drum wall pushes inwards (normal to its surface) on the towels. Water escapes through the holes because nothing pushes it inwards.')
M('E', 1, 'An aircraft banks its wings to turn in a horizontal circle. What provides the centripetal force?', 'The horizontal component of the lift force',
  ['The thrust of the engines', 'The weight of the aircraft', 'Drag'],
  'Banking tilts the lift force. Its vertical component balances the weight and its horizontal component points towards the centre of the turn.')
M('E', 1, 'A train rounds a curve on level track. Where does the centripetal force on the train come from?', 'The sideways push of the outer rail on the wheel flanges',
  ['The weight of the train', 'The driving force of the locomotive', 'Air resistance'],
  'The outer rail pushes inwards on the flanges of the wheels, providing the centripetal force.')
m_, v_, r_ = Q('0.30 kg'), Q('3.0 m s⁻¹'), Q('0.60 m'); F = m_.v * v_.v ** 2 / r_.v
N('E', 2, f'A {m_} puck on an air table is tethered to a central peg and glides at {v_} in a circle of radius {r_}. Calculate the tension in the tether.', F, 'N',
  f'The tether tension provides the centripetal force: T = mv²/r = 0.30 × 3.0² ÷ 0.60 = {sf(F, 2)} N', ['C1: tension = mv²/r'], sig=2, aq='T')
M('E', 1, 'A car is driven at a steady speed over the top of a hump-backed bridge. At the top, how does the normal contact force N on the car compare with its weight W?', 'N is less than W',
  ['N equals W', 'N is greater than W', 'N is zero at any speed'], 'At the top the resultant force must point down, towards the centre of the curve: W − N = mv²/r, so N < W.')
M('E', 1, 'A passenger sits in a car going round a bend at constant speed. Which statement is correct?', 'The seat and door push the passenger towards the centre of the bend',
  ['An outward centrifugal force acts on the passenger', 'No resultant force acts on the passenger', 'The passenger accelerates away from the centre'],
  'To move in a circle the passenger needs a resultant force towards the centre. It is provided by friction from the seat and the push of the door.')
M('E', 1, 'A road is banked on a bend. Which force has a horizontal component that helps to provide the centripetal force, even with no friction?', 'The normal contact force from the road',
  ['The weight of the car', 'The driving force', 'Air resistance'], 'On a banked road the normal force is tilted towards the centre. Its horizontal component provides some or all of the centripetal force.')
v_, r_ = Q('12 m s⁻¹'), Q('25 m'); a = v_.v ** 2 / r_.v
N('E', 2, f'A cyclist rides at {v_} round a circular velodrome turn of radius {r_}. Calculate the resultant force needed towards the centre for each kilogram of the cyclist\'s mass.', a, 'N kg⁻¹',
  f'F/m = v²/r = 12² ÷ 25 = {sf(a, 2)} N kg⁻¹', ['C1: F/m = v²/r'], sig=2, aq='F/m')
m_, v_, r_ = Q('0.60 kg'), Q('2.0 m s⁻¹'), Q('0.50 m'); T = m_.v * 9.81 + m_.v * v_.v ** 2 / r_.v
N('E', 2, f'A {m_} pendulum bob on a string of length {r_} swings through its lowest point at {v_}. Calculate the tension in the string there.' + take('g'), T, 'N',
  f'T − mg = mv²/r, so T = 0.60 × 9.81 + 0.60 × 2.0² ÷ 0.50 = {sf(T)} N', ['C1: T − mg = mv²/r'], aq='T')
M('E', 1, 'Which force provides the centripetal force on a person standing on the Equator as the Earth rotates?', 'A small part of the gravitational pull of the Earth (the rest is balanced by the normal force)',
  ['The normal contact force of the ground, which pushes outwards', 'A centrifugal force due to the rotation', 'Air resistance'],
  'The person moves in a circle, so the resultant force must point to the centre. The normal force is slightly less than the full gravitational pull; the difference, mω²R, is the centripetal force.')

# ── medium ──
m_, v_, r_ = Q('1200 kg'), Q('12 m s⁻¹'), Q('40 m'); Nf = m_.v * 9.81 - m_.v * v_.v ** 2 / r_.v
N('M', 3, f'A {m_} car goes over the top of a hump-backed bridge, a circular arc of radius {r_}, at {v_}. Calculate the normal contact force of the road on the car at the top.' + take('g'), Nf, 'N',
  f'At the top the resultant force is downwards towards the centre: mg − N = mv²/r. N = 1200 × 9.81 − 1200 × 12² ÷ 40 = {sf(Nf)} N',
  ['C1: mg − N = mv²/r', 'C1: correct substitution'], aq='N', cm='adding mv²/r to the weight, which is the case at the bottom of a dip, not the top of a hump.')
frac = 8.0 ** 2 / (30 * 9.81)
N('M', 3, 'A loaded truck crests a rise in the road at 8.0 m s⁻¹. The top of the rise is a circular arc of radius 30 m. By what fraction is the force of the road on the truck reduced compared with when the road is level?' + take('g'), frac, None,
  f'On the level N = mg. At the crest N = mg − mv²/r, so the fractional reduction = (mv²/r)/(mg) = v²/(rg) = 8.0² ÷ (30 × 9.81) = {sf(frac)}',
  ['C1: mg − N = mv²/r', 'C1: fraction = v²/rg'], aq='fraction')
r_ = Q('20 m'); v = sqrt(9.81 * r_.v)
N('M', 3, f'A rally car approaches a crest whose top is a circular arc of radius {r_}. Calculate the speed at which the car would just leave the ground at the top.' + take('g'), v, 'm s⁻¹',
  f'The car loses contact when N = 0, so mg = mv²/r and v = √(gr) = √(9.81 × 20) = {sf(v)} m s⁻¹', ['C1: N = 0 at loss of contact', 'C1: v = √(gr)'], aq='v')
r_ = Q('120 m'); v = sqrt(9.81 * r_.v * tan(radians(15)))
N('M', 4, f'A bend of radius {r_} is banked at 15° to the horizontal. Calculate the speed at which a car can go round it with no sideways friction.' + take('g'), v, 'm s⁻¹',
  f'Vertically: N cos θ = mg. Horizontally: N sin θ = mv²/r. Dividing: tan θ = v²/(rg), so v = √(rg tan θ) = √(120 × 9.81 × tan 15) = {sf(v)} m s⁻¹',
  ['C1: N cos θ = mg', 'C1: N sin θ = mv²/r', 'C1: tan θ = v²/rg'], aq='v')
th = degrees(atan(25 ** 2 / (250 * 9.81)))
N('M', 4, 'A motorway engineer wants cars to take a curve of radius 250 m at 25 m s⁻¹ with no sideways friction. What angle of banking is needed?' + take('g'), th, '°',
  f'N cos θ = mg and N sin θ = mv²/r, so tan θ = v²/(rg) = 25² ÷ (250 × 9.81) = {sf(625 / 2452.5)}. θ = tan⁻¹ {sf(625 / 2452.5)} = {sf(th)}°',
  ['C1: vertical: N cos θ = mg', 'C1: horizontal: N sin θ = mv²/r', 'C1: tan θ = v²/rg'], aq='θ')
th = degrees(atan(20 ** 2 / (150 * 9.81)))
N('M', 4, 'A light aircraft flies at 20 m s⁻¹ in a horizontal circle of radius 150 m. At what angle must it bank its wings so that the lift alone provides the centripetal force?' + take('g'), th, '°',
  f'L cos θ = mg and L sin θ = mv²/r, so tan θ = v²/(rg) = 20² ÷ (150 × 9.81) = {sf(400 / 1471.5)}. θ = tan⁻¹ {sf(400 / 1471.5)} = {sf(th)}°',
  ['C1: vertical component of lift balances weight', 'C1: horizontal component = mv²/r', 'C1: tan θ = v²/rg'], aq='θ')
m_, r_, n_ = Q('0.80 kg'), Q('0.25 m'), Q('120 rev min⁻¹'); w = n_.v; F = m_.v * w ** 2 * r_.v
N('M', 4, f'Wet clothing of mass {m_} rotates in a spin drier drum of radius {r_} at {n_}. Calculate the normal contact force of the drum on the clothing.', F, 'N',
  f'ω = 2π × 120 ÷ 60 = {sf(w)} rad s⁻¹. The drum\'s push provides the centripetal force: F = mω²r = 0.80 × {sf(w)}² × 0.25 = {sf(F)} N',
  ['C1: ω in rad s⁻¹', 'B1: normal force provides centripetal force', 'C1: F = mω²r'], aq='F')
M('M', 3, 'A bucket of water is swung in a vertical circle. Why does the water stay in the bucket at the top, even though the bucket is upside down?',
  'Its weight (plus the push of the bucket base) is just what is needed to provide the centripetal force, so the water moves round the circle with the bucket',
  ['A centrifugal force pushes the water up into the bucket', 'There is no gravity acting on the water while it moves', 'Air pressure holds the water in'],
  'At the top the water needs a downward resultant force mv²/r. If v² ≥ gr its weight alone is not enough, so the bucket base pushes down on it too. The water follows the circle and does not fall out.',
  ['C1: centripetal force needed downwards at top', 'C1: weight + contact force provides it (v² ≥ gr)'])
m_, v_, r_ = Q('55 kg'), Q('6.0 m s⁻¹'), Q('8.0 m'); Nb = m_.v * 9.81 + m_.v * v_.v ** 2 / r_.v
N('M', 3, f'A {m_} roller-coaster rider passes through the bottom of a dip, a circular arc of radius {r_}, at {v_}. Calculate the force of the seat on the rider.' + take('g'), Nb, 'N',
  f'At the bottom, N − mg = mv²/r. N = 55 × 9.81 + 55 × 6.0² ÷ 8.0 = {sf(Nb)} N (the rider feels heavier)', ['C1: N − mg = mv²/r', 'C1: substitution'], aq='N')
M('M', 4, 'A car goes round a banked bend faster than the speed for which the bend was designed. Which statement is correct?',
  'Friction must act down the slope to provide the extra centripetal force',
  ['Friction must act up the slope', 'No friction is needed at any speed on a banked bend', 'The normal force alone provides more force at higher speed'],
  'At the design speed the horizontal component of N alone provides mv²/r. At a higher speed more inward force is needed: the car tends to slide up the slope, so friction acts down the slope and adds an inward component.',
  ['C1: more centripetal force needed at higher speed', 'C1: car tends to slide up/out', 'C1: friction down the slope adds inward component'])
m_, L_, d_ = Q('0.25 kg'), Q('0.50 m'), Q('0.30 m'); v2 = 2 * 9.81 * d_.v; T = m_.v * 9.81 + m_.v * v2 / L_.v
N('M', 4, f'A pendulum bob of mass {m_} on a string of length {L_} is released from rest at a height {d_} above its lowest point. Calculate the tension in the string at the lowest point.' + take('g'), T, 'N',
  f'Energy: v² = 2gh = 2 × 9.81 × 0.30 = {sf(v2)} m² s⁻². At the bottom T − mg = mv²/L: T = 0.25 × 9.81 + 0.25 × {sf(v2)} ÷ 0.50 = {sf(T)} N',
  ['C1: v² = 2gh', 'C1: T − mg = mv²/L', 'C1: substitution'], aq='T')
v_, r_ = Q('5.0 m s⁻¹'), Q('3.0 m'); lean = degrees(atan(v_.v ** 2 / (r_.v * 9.81)))
N('M', 4, f'A cyclist rides round a flat circular path of radius {r_} at {v_}. To stay balanced the cyclist leans inwards so that the resultant of the friction and normal forces passes through the centre of mass. Calculate the angle of lean from the vertical.' + take('g'), lean, '°',
  f'N = mg (vertical) and friction F = mv²/r (horizontal, inwards). tan θ = F/N = v²/(rg) = 5.0² ÷ (3.0 × 9.81) = {sf(25 / 29.43)}, so θ = tan⁻¹ {sf(25 / 29.43)} = {sf(lean)}°',
  ['C1: N = mg', 'C1: friction = mv²/r', 'C1: tan θ = v²/rg'], aq='θ')
M('M', 3, 'A satellite in a low circular orbit and a ball on a string whirled in a horizontal circle both move in circles. Which statement is correct?',
  'Gravity provides the centripetal force on the satellite; tension provides it for the ball',
  ['Both are kept in orbit by centrifugal force', 'Gravity provides the centripetal force in both cases', 'Neither needs a centripetal force because their speeds are constant'],
  'The centripetal force is always provided by a real force: gravity for the satellite, the string tension (horizontal component) for the ball.',
  ['C1: identifies gravity for satellite', 'C1: identifies tension for ball'])

# ── hard ──
m_, r_, v_ = Q('1500 kg'), Q('90 m'), Q('20 m s⁻¹'); th = radians(12.0)
v0 = sqrt(9.81 * r_.v * tan(th)); a = v_.v ** 2 / r_.v; Ff = m_.v * (a * cos(th) - 9.81 * sin(th))
N('H', 7, f'A bend of radius {r_} is banked at 12°. A car of mass {m_} goes round it at {v_}. (a) Calculate the design speed, at which no friction is needed. (b) Explain why friction is needed at {v_} and state its direction. (c) By resolving parallel to the slope, calculate the friction force needed. Give only the answer to (c).' + take('g'), Ff, 'N',
  f'(a) v₀ = √(rg tan θ) = √(90 × 9.81 × tan 12) = {sf(v0)} m s⁻¹. (b) 20 m s⁻¹ is faster than the design speed, so more centripetal force is needed than N sin θ can give: friction acts down the slope. (c) Along the slope: F + mg sin θ = m(v²/r) cos θ, so F = 1500 × ({sf(a)} × cos 12 − 9.81 × sin 12) = {sf(Ff)} N',
  ['C1: tan θ = v²/rg', 'A1: design speed', 'B1: faster than design speed', 'B1: friction down the slope', 'C1: resolving along the slope', 'C1: centripetal acceleration v²/r', 'A1: F'], aq='F')
m_, v_, r_ = Q('1000 kg'), Q('20 m s⁻¹'), Q('60 m'); Ntop = m_.v * 9.81 - m_.v * v_.v ** 2 / r_.v; Nbot = m_.v * 9.81 + m_.v * v_.v ** 2 / r_.v
N('H', 6, f'A car of mass {m_} drives at a constant {v_} over a hump and then through a dip. Both are circular arcs of radius {r_}. (a) Calculate the normal force at the top of the hump. (b) Calculate the normal force at the bottom of the dip. (c) Explain why the driver feels lighter over the hump. Give only the answer to (b).' + take('g'), Nbot, 'N',
  f'(a) mg − N = mv²/r: N = 1000 × 9.81 − 1000 × 20² ÷ 60 = {sf(Ntop)} N. (b) N − mg = mv²/r: N = 1000 × 9.81 + 1000 × 20² ÷ 60 = {sf(Nbot)} N. (c) At the top the seat pushes up on the driver with less than their weight, because part of their weight is used as the centripetal force. The contact force is what we feel as weight.',
  ['C1: top: mg − N = mv²/r', 'A1: N top', 'C1: bottom: N − mg = mv²/r', 'A1: N bottom', 'B1: contact force less than weight at top'], aq='N')
m_, L_ = Q('0.15 kg'), Q('0.80 m'); th = radians(40); w = sqrt(9.81 / (L_.v * cos(th))); P = 2 * pi / w; T = m_.v * 9.81 / cos(th)
N('H', 7, f'A ball of mass {m_} hangs from a string of length {L_} and moves in a horizontal circle so that the string makes 40° with the vertical (a conical pendulum). (a) Identify the forces on the ball and the origin of the centripetal force. (b) Calculate the tension. (c) Show that ω² = g/(L cos θ). (d) Calculate the period. Give only the answer to (d).' + take('g'), P, 's',
  f'(a) Weight mg down and tension T along the string. The horizontal component T sin θ is the centripetal force. (b) T cos θ = mg: T = 0.15 × 9.81 ÷ cos 40 = {sf(T)} N. (c) T sin θ = mω²r = mω²L sin θ, so T = mω²L. With T = mg/cos θ: ω² = g/(L cos θ). (d) ω = √(9.81 ÷ (0.80 × cos 40)) = {sf(w)} rad s⁻¹, period = 2π/ω = 2π ÷ {sf(w, 4)} = {sf(P)} s',
  ['B1: T sin θ is the centripetal force', 'C1: T cos θ = mg', 'A1: T', 'M1: T sin θ = mω²L sin θ', 'M1: combine to ω² = g/(L cos θ)', 'C1: period = 2π/ω', 'A1: period'], aq='period')
v_b = sqrt(8.24e-8 * 5.29e-11 / 9.11e-31)
N('H', 6, 'In the Bohr model of hydrogen, the electron moves round the proton in a circle of radius 5.29 × 10⁻¹¹ m. (a) State the origin of the centripetal force. (b) The force is 8.24 × 10⁻⁸ N. Calculate the speed of the electron. (c) Calculate the gravitational force between the electron and proton and use it to explain why gravity is ignored. Give only the answer to (b).' + take('me', 'mp', 'G'), v_b, 'm s⁻¹',
  f'(a) The electric (Coulomb) attraction between the electron and the proton. (b) F = mv²/r so v = √(Fr/m) = √(8.24 × 10⁻⁸ × 5.29 × 10⁻¹¹ ÷ 9.11 × 10⁻³¹) = {sf(v_b)} m s⁻¹. (c) F_g = Gm_em_p/r² = 6.67 × 10⁻¹¹ × 9.11 × 10⁻³¹ × 1.67 × 10⁻²⁷ ÷ (5.29 × 10⁻¹¹)² = {sf(6.67e-11 * 9.11e-31 * 1.67e-27 / 5.29e-11 ** 2)} N, about 10³⁹ times smaller than the electric force.',
  ['B1: electric attraction', 'C1: F = mv²/r', 'A1: v', 'C1: gravitational force formula', 'B1: comparison: negligible'], aq='v')
w = 2 * pi / 86164; dN = 70 * w ** 2 * 6.37e6
N('H', 5, 'A 70 kg person stands on bathroom scales on the Equator. (a) Explain why the scales read slightly less than the person\'s true weight mg. (b) Calculate the angular speed of the Earth (rotation period 86 164 s). (c) Calculate by how much the scale reading is reduced. Earth\'s radius = 6.37 × 10⁶ m. Give only the answer to (c).', dN, 'N',
  f'(a) The person moves in a circle, so the resultant force (mg − N) must equal mω²R towards the centre: N is less than mg. (b) ω = 2π ÷ 86164 = {sf(w)} rad s⁻¹. (c) mg − N = mω²R = 70 × ({sf(w)})² × 6.37 × 10⁶ = {sf(dN)} N',
  ['B1: resultant force towards centre needed', 'M1: mg − N = mω²R', 'A1: ω', 'C1: substitution', 'A1: reduction'], aq='mg − N')
vmax = sqrt(12 * 9.81 * (tan(radians(30)) + 0.40) / (1 - 0.40 * tan(radians(30))))
N('H', 7, 'A stunt rider takes a curve of radius 12 m on a track banked at 30°. Friction can be up to 0.40 times the normal force. (a) Explain why there is a maximum speed. (b) For the maximum speed, friction acts down the slope with F = 0.40N. Write the vertical and horizontal force equations. (c) Show that v² = rg(tan θ + 0.40)/(1 − 0.40 tan θ) and calculate the maximum speed. Give only the speed in (c).' + take('g'), vmax, 'm s⁻¹',
  f'(a) Above the design speed the rider tends to slide up the slope, and friction can only supply a limited extra inward force. (b) Vertical: N cos θ − F sin θ = mg. Horizontal: N sin θ + F cos θ = mv²/r. (c) With F = 0.40N, dividing: v²/(rg) = (sin θ + 0.40 cos θ)/(cos θ − 0.40 sin θ) = (tan θ + 0.40)/(1 − 0.40 tan θ). v = √(12 × 9.81 × (tan 30 + 0.40) ÷ (1 − 0.40 × tan 30)) = {sf(vmax)} m s⁻¹',
  ['B1: friction limited', 'C1: vertical equation', 'C1: horizontal equation', 'M1: substitute F = 0.40N', 'M1: divide equations', 'C1: substitution', 'A1: v_max'], aq='v_max')

# ═════════════════════════ extras to reach 50 per lesson ═════════════════════════
lesson('16.3')
v_ = Q('0.35 m s⁻¹'); r_ = Q('0.12 m'); T = 2 * pi * r_.v / v_.v
N('M', 3, f'A ladybird walks at a steady {v_} round the rim of a jar lid of radius {r_}. (a) How long does one lap take? (b) Through what angle does its velocity turn in 1.0 s? Give only the angle in (b), in radians.', v_.v / r_.v, 'rad',
  f'(a) T = 2πr/v = 2π × 0.12 ÷ 0.35 = {sf(T)} s. (b) The velocity turns at the angular speed ω = v/r = 0.35 ÷ 0.12 = {sf(v_.v / r_.v)} rad s⁻¹, so in 1.0 s it turns {sf(v_.v / r_.v)} rad.',
  ['C1: T = 2πr/v', 'C1: velocity turns at the rate ω = v/r'], aq='angle')
M('M', 3, 'Two cars go round the same roundabout at the same constant speed, one on the inner lane and one on the outer lane. Which statement is correct?',
  'The inner car\'s velocity changes direction faster, so it has the larger acceleration',
  ['Both have the same acceleration because their speeds are equal', 'The outer car has the larger acceleration because it travels further', 'Neither car accelerates because the speeds are constant'],
  'a = v²/r. With equal v, the smaller radius gives the larger acceleration: the inner car\'s direction turns through more angle each second (ω = v/r is larger).',
  ['C1: a = v²/r with v the same', 'C1: smaller r gives larger a'])
N('M', 4, 'An airliner in a holding pattern flies at a steady 150 m s⁻¹ round a circle. It turns from heading north to heading east in 50 s. (a) Calculate the size of the change in velocity. (b) Calculate the average acceleration. Give only the answer to (b).', 150 * sqrt(2) / 50, 'm s⁻²',
  f'(a) The heading turns through 90°, so |Δv| = √(150² + 150²) = {sf(150 * sqrt(2))} m s⁻¹. (b) average a = {sf(150 * sqrt(2))} ÷ 50 = {sf(150 * sqrt(2) / 50)} m s⁻²',
  ['C1: velocities at 90°', 'C1: |Δv| by Pythagoras', 'C1: a = Δv/Δt'], aq='a')
rr = 0.25; vv = 2 * pi * rr / 0.50; ke = 0.5 * 0.10 * vv ** 2
N('H', 5, 'A 0.10 kg ball on a string is whirled in a horizontal circle of radius 0.25 m, once every 0.50 s. (a) Calculate its speed. (b) Calculate its kinetic energy. (c) Explain why its kinetic energy stays constant but its momentum does not, and calculate the magnitude of the change in momentum over half a revolution. Give only the answer to (c).', 2 * 0.10 * vv, 'kg m s⁻¹',
  f'(a) v = 2πr/T = 2π × 0.25 ÷ 0.50 = {sf(vv)} m s⁻¹. (b) Ek = ½mv² = 0.5 × 0.10 × {sf(vv)}² = {sf(ke)} J. (c) Ek depends only on speed (a scalar); momentum is a vector and reverses direction after half a turn: |Δp| = 2mv = 2 × 0.10 × {sf(vv)} = {sf(2 * 0.1 * vv)} kg m s⁻¹',
  ['C1: v = 2πr/T', 'A1: Ek', 'B1: Ek scalar, p vector', 'C1: Δp = 2mv', 'A1: |Δp|'], aq='|Δp|')
N('H', 6, 'A small satellite moves in a circular orbit at 7.5 km s⁻¹. Ground controllers observe that its velocity direction changes by 1.2° every 15 s. (a) Calculate the angular speed of the satellite in rad s⁻¹. (b) Calculate the radius of its orbit. (c) Calculate its centripetal acceleration, and state its direction. Give only the answer to (b).', 7500 / (radians(1.2) / 15), 'm',
  f'(a) ω = Δθ/Δt = (1.2 × π ÷ 180) ÷ 15 = {sf(radians(1.2) / 15)} rad s⁻¹. (b) r = v/ω = 7500 ÷ {sf(radians(1.2) / 15, 4)} = {sf(7500 / (radians(1.2) / 15))} m. (c) a = vω = 7500 × {sf(radians(1.2) / 15, 4)} = {sf(7500 * radians(1.2) / 15)} m s⁻², towards the Earth\'s centre.',
  ['C1: angle in radians', 'A1: ω', 'C1: r = v/ω', 'A1: r', 'B1: a = vω towards the centre', 'B1: direction'], aq='r')
N('H', 5, 'A long-exposure photograph shows a light on a fairground arm tracing a circular arc of length 2.4 m during a 0.50 s exposure. The arm is 3.0 m long and rotates steadily. (a) Calculate the speed of the light. (b) Calculate the angle, in degrees, that its velocity turned through during the exposure. (c) Calculate the size of the change in velocity during the exposure. Give only the answer to (c).', 2 * 4.8 * sin(0.8 / 2), 'm s⁻¹',
  f'(a) v = 2.4 ÷ 0.50 = {sf(4.8, 2)} m s⁻¹. (b) θ = s/r = 2.4 ÷ 3.0 = 0.80 rad = {sf(degrees(0.8))}°. (c) |Δv| = 2v sin(θ/2) = 2 × 4.8 × sin {sf(degrees(0.4))} = {sf(2 * 4.8 * sin(0.4))} m s⁻¹',
  ['C1: v = s/t', 'C1: θ = s/r', 'A1: θ in degrees', 'C1: |Δv| = 2v sin(θ/2)', 'A1: |Δv|'], aq='|Δv|')

lesson('16.4')
N('E', 2, 'The tip of a ceiling fan blade is 0.60 m from the axis and moves at 9.0 m s⁻¹. Calculate the fan\'s angular speed.', 15.0, 'rad s⁻¹',
  'ω = v/r = 9.0 ÷ 0.60 = 15 rad s⁻¹', ['C1: ω = v/r'], sig=2, aq='ω')
M('E', 1, 'A wheel turns at a frequency f. Which expression gives its angular speed?', '2πf', ['f/2π', 'πf', '2π/f'],
  'In each revolution the wheel turns through 2π rad and there are f revolutions per second, so ω = 2πf.')
N('M', 3, 'A centrifuge rotor 15 cm in radius reaches a rim speed of 110 m s⁻¹. Calculate its rotation rate in revolutions per second.', 110 / 0.15 / (2 * pi), 'Hz',
  f'ω = v/r = 110 ÷ 0.15 = {sf(110 / 0.15)} rad s⁻¹. f = ω/2π = {sf(110 / 0.15)} ÷ 2π = {sf(110 / 0.15 / (2 * pi))} Hz',
  ['C1: ω = v/r with r in m', 'C1: f = ω/2π'], aq='f')
N('M', 3, 'A 3.5-inch floppy disk drive (an old storage device) turned the disk at 300 rev min⁻¹. A read head 3.0 cm from the axis follows the track. Calculate the speed of the track under the head.', 300 * 2 * pi / 60 * 0.030, 'm s⁻¹',
  f'ω = 2π × 300 ÷ 60 = {sf(10 * pi)} rad s⁻¹. v = ωr = {sf(10 * pi)} × 0.030 = {sf(10 * pi * 0.03)} m s⁻¹', ['C1: ω from rev min⁻¹', 'C1: v = ωr'], aq='v')
M('M', 3, 'A satellite in a low orbit has period 90 min; a geostationary satellite has period 24 h. What is the ratio (angular speed of the low satellite)/(angular speed of the geostationary one)?',
  '16', ['1/16', '4', '24'], 'ω = 2π/T, so the ratio = T_geo/T_low = (24 × 60) ÷ 90 = 16.', ['C1: ω ∝ 1/T', 'C1: periods in the same unit'])
N('H', 6, 'A washing machine drum of radius 0.24 m speeds up from rest. A student records the time for each complete turn: 1st turn 0.80 s, 2nd 0.40 s, 3rd 0.27 s, 4th 0.20 s. (a) Calculate the average angular speed during the 4th turn. (b) Calculate the average speed of a sock on the drum wall during the 4th turn. (c) Describe how the angular speed changes over the four turns, using the data. Give only the answer to (b).', 2 * pi / 0.20 * 0.24, 'm s⁻¹',
  f'(a) ω = 2π ÷ 0.20 = {sf(2 * pi / 0.2)} rad s⁻¹. (b) v = ωr = {sf(2 * pi / 0.2)} × 0.24 = {sf(2 * pi / 0.2 * 0.24)} m s⁻¹. (c) The time per turn falls (0.80, 0.40, 0.27, 0.20 s), so the average angular speed rises: roughly 7.9, 16, 23 and 31 rad s⁻¹, increasing by about 8 rad s⁻¹ per turn.',
  ['C1: ω = 2π/t for one turn', 'A1: ω', 'C1: v = ωr', 'A1: v', 'B1: angular speed increases', 'B1: quantitative use of data'], aq='v')

lesson('16.5')
N('E', 2, 'A 1500 kg car drives round a bend of radius 60 m at 20 m s⁻¹. Calculate the centripetal force on the car.', 1500 * 400 / 60, 'N',
  'F = mv²/r = 1500 × 20² ÷ 60 = 10 000 N', ['C1: F = mv²/r'], sig=2, aq='F')
M('E', 1, 'A planet moves in a circular orbit around a star. If the star had no gravity, how would the planet move?', 'In a straight line at constant speed', ['In the same circle', 'Spiralling outwards', 'Directly away from the star'],
  'With no centripetal force there is no resultant force, so by Newton\'s first law the planet would continue in a straight line at constant velocity.')
N('M', 3, 'A 60 kg astronaut on a training centrifuge moves in a circle of radius 8.0 m at 14 m s⁻¹. Calculate the force the seat must exert towards the centre, and express it as a multiple of her weight. Give the multiple.' + take('g'), 60 * 14 ** 2 / 8.0 / (60 * 9.81), None,
  f'F = mv²/r = 60 × 14² ÷ 8.0 = {sf(60 * 196 / 8)} N. Weight = 60 × 9.81 = {sf(588.6)} N. Multiple = {sf(60 * 196 / 8)} ÷ {sf(588.6)} = {sf(60 * 196 / 8 / 588.6)}',
  ['C1: F = mv²/r', 'C1: ratio to mg'], aq='multiple')
M('M', 3, 'A student whirls a rubber bung on a string in a horizontal circle and lets go of the string when the bung is at the north side of the circle, moving east. Which describes the bung\'s horizontal motion afterwards?',
  'It travels east in a straight line', ['It travels north, away from the centre', 'It continues in the same circle', 'It travels south towards the centre'],
  'With no tension there is no horizontal force, so the bung keeps the velocity it had: east, along the tangent.', ['C1: no centripetal force after release', 'C1: continues along the tangent'])
N('M', 4, 'A 0.20 kg mass is attached to a spring of natural length 0.30 m and stiffness 80 N m⁻¹ and whirled in a horizontal circle on a smooth table, so that the spring stretches to 0.35 m. Calculate the speed of the mass.', sqrt(80 * 0.05 * 0.35 / 0.20), 'm s⁻¹',
  f'Spring tension = kx = 80 × 0.05 = 4.0 N. This provides mv²/r with r = 0.35 m, so v = √(Tr/m) = √(4.0 × 0.35 ÷ 0.20) = {sf(sqrt(4 * 0.35 / 0.2))} m s⁻¹',
  ['C1: T = kx with x = 0.05 m', 'C1: T = mv²/r', 'C1: r = stretched length'], aq='v', cm='using the natural length 0.30 m as the radius.')

lesson('16.6')
N('E', 2, 'The tip of a helicopter rotor blade moves at 200 m s⁻¹ in a circle of radius 5.0 m. Calculate its centripetal acceleration.', 200 ** 2 / 5.0, 'm s⁻²',
  'a = v²/r = 200² ÷ 5.0 = 8000 m s⁻²', ['C1: a = v²/r'], sig=2, aq='a')
N('E', 2, 'A spinning sycamore seed turns at 15 rad s⁻¹. The tip of its wing is 3.0 cm from the axis. Calculate the centripetal acceleration of the tip.', 15 ** 2 * 0.030, 'm s⁻²',
  f'a = ω²r = 15² × 0.030 = {sf(225 * 0.03, 2)} m s⁻²', ['C1: a = ω²r with r in m'], sig=2, aq='a')
M('E', 1, 'Two points on a rotating turntable are at distances r and 3r from the axis. What is the ratio (centripetal acceleration of the outer point)/(that of the inner point)?', '3', ['9', '1', '⅓'],
  'Both have the same ω and a = ω²r ∝ r, so the ratio is 3.')
M('E', 1, 'A car goes round a bend at constant speed. Which change would halve its centripetal acceleration?', 'Doubling the radius of the bend at the same speed', ['Halving the speed on the same bend', 'Doubling the mass of the car', 'Doubling the speed on a bend of twice the radius'],
  'a = v²/r. Doubling r halves a. Halving v quarters a, mass has no effect on a, and doubling both v and r doubles a.')
N('M', 3, 'A dancer spins with her arms out at 1.5 revolutions per second. Her fingertips are 0.75 m from the axis. Calculate the centripetal acceleration of her fingertips.', (2 * pi * 1.5) ** 2 * 0.75, 'm s⁻²',
  f'ω = 2πf = 2π × 1.5 = {sf(3 * pi)} rad s⁻¹. a = ω²r = ({sf(3 * pi)})² × 0.75 = {sf(9 * pi ** 2 * 0.75)} m s⁻²', ['C1: ω = 2πf', 'C1: a = ω²r'], aq='a')
N('M', 4, 'A car rounds a bend with a centripetal acceleration of 4.5 m s⁻². The bend has radius 50 m. (a) Calculate the speed of the car. (b) Calculate the time it takes to go round a quarter of a full circle of this radius. Give only the answer to (b).', (pi * 50 / 2) / sqrt(4.5 * 50), 's',
  f'(a) v = √(ar) = √(4.5 × 50) = {sf(sqrt(225))} m s⁻¹. (b) quarter circle = πr/2 = {sf(pi * 25)} m, t = {sf(pi * 25)} ÷ 15 = {sf(pi * 25 / 15)} s',
  ['C1: v = √(ar)', 'C1: arc length πr/2', 'C1: t = s/v'], aq='t')
N('M', 3, 'The International Space Station has a centripetal acceleration of 8.7 m s⁻² and orbits at a radius of 6.77 × 10⁶ m. Calculate its period.', 2 * pi * sqrt(6.77e6 / 8.7), 's',
  f'a = 4π²r/T², so T = 2π√(r/a) = 2π × √(6.77 × 10⁶ ÷ 8.7) = {sf(2 * pi * sqrt(6.77e6 / 8.7))} s', ['C1: a = 4π²r/T²', 'C1: rearranged for T'], aq='T')

lesson('16.7')
N('M', 3, 'A 45 kg child on a playground swing (chains 2.0 m long) has a speed of 4.0 m s⁻¹ at the lowest point. Calculate the force of the seat on the child there.' + take('g'), 45 * 9.81 + 45 * 16 / 2.0, 'N',
  f'N − mg = mv²/r, so N = 45 × 9.81 + 45 × 4.0² ÷ 2.0 = {sf(45 * 9.81 + 45 * 8)} N', ['C1: N − mg = mv²/r', 'C1: substitution'], aq='N')
N('M', 3, 'A railway engineer wants trains to take a curve of radius 800 m at 40 m s⁻¹ so that the outer rail does not have to push sideways on the flanges. At what angle should the track be banked?' + take('g'), degrees(atan(1600 / (800 * 9.81))), '°',
  f'tan θ = v²/(rg) = 40² ÷ (800 × 9.81) = {sf(1600 / 7848)}. θ = tan⁻¹ {sf(1600 / 7848)} = {sf(degrees(atan(1600 / 7848)))}°', ['C1: banking provides centripetal force', 'C1: tan θ = v²/rg'], aq='θ')
M('M', 3, 'A car crosses a hump-backed bridge faster and faster on successive trips. Which statement describes what happens to the normal contact force at the top?',
  'It decreases, and becomes zero at v = √(gr)', ['It increases with speed', 'It stays equal to the weight', 'It decreases but can never reach zero'],
  'mg − N = mv²/r, so N = m(g − v²/r) falls as v rises and reaches zero when v² = gr. Faster than that the car leaves the road.', ['C1: N = m(g − v²/r)', 'C1: N = 0 at v = √(gr)'])
N('M', 4, 'A pilot pulls out of a dive at the bottom of a vertical circle of radius 400 m at 120 m s⁻¹. The pilot\'s mass is 75 kg. Calculate the force of the seat on the pilot, as a multiple of the pilot\'s weight.' + take('g'), (9.81 + 120 ** 2 / 400) / 9.81, None,
  f'N − mg = mv²/r, so N/mg = 1 + v²/(rg) = 1 + 120² ÷ (400 × 9.81) = {sf(1 + 14400 / 3924)}',
  ['C1: N − mg = mv²/r', 'C1: divide by mg', 'C1: substitution'], aq='N/mg')
N('M', 4, 'An Olympic cyclist rides round a velodrome bend of radius 25 m banked at 42°. At what speed is no sideways friction needed?' + take('g'), sqrt(25 * 9.81 * tan(radians(42))), 'm s⁻¹',
  f'v = √(rg tan θ) = √(25 × 9.81 × tan 42) = {sf(sqrt(25 * 9.81 * tan(radians(42))))} m s⁻¹', ['C1: N cos θ = mg', 'C1: N sin θ = mv²/r', 'C1: v = √(rg tan θ)'], aq='v')
M('M', 3, 'A coin sits on a horizontal turntable that is slowly speeded up. Which statement explains why the coin eventually slides off?',
  'The friction force needed, mω²r, rises above the maximum friction the surface can provide', ['A centrifugal force grows until it overcomes friction', 'The weight of the coin decreases as the turntable speeds up', 'The normal force increases until it pushes the coin off'],
  'Friction provides the centripetal force mω²r. As ω rises, the required friction rises. When it exceeds the maximum available, the coin cannot follow the circle and slides off (along the tangent at first).',
  ['C1: friction provides mω²r', 'C1: exceeds maximum friction'])
N('M', 3, 'A stone of mass 0.15 kg is whirled in a vertical circle of radius 0.70 m on a string. At the top it moves at 4.0 m s⁻¹. Calculate the tension in the string at the top.' + take('g'), 0.15 * 16 / 0.70 - 0.15 * 9.81, 'N',
  f'At the top, T + mg = mv²/r, so T = 0.15 × 4.0² ÷ 0.70 − 0.15 × 9.81 = {sf(0.15 * 16 / 0.7 - 0.15 * 9.81)} N', ['C1: T + mg = mv²/r at the top', 'C1: substitution'], aq='T')
