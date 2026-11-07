# Chapter 2 Accelerated motion: 2.1 to 2.5.

# ═════════════════════════ 2.1 The meaning of acceleration (17/20/13) ═════════════════════════
lesson('2.1')
M('E', 1, 'What is meant by the acceleration of an object?', 'The rate of change of velocity', ['The rate of change of distance', 'The change in speed', 'Velocity divided by distance'], 'a = Δv/Δt, the change in velocity per unit time.')
M('E', 1, 'Is acceleration a scalar or a vector quantity?', 'A vector, because velocity is a vector', ['A scalar', 'A scalar unless the object turns', 'Neither'], 'Acceleration has the direction of Δv.')
N('E', 2, 'A car speeds up from rest to 18 m s⁻¹ in 6.0 s. Calculate its acceleration.', 3.0, 'm s⁻²',
  'a = (18 − 0) ÷ 6.0 = 3.0 m s⁻²', ['C1: a = Δv/t'], sig=2, aq='a')
M('E', 1, 'A car has an acceleration of 2 m s⁻². What does this mean?', 'Its velocity increases by 2 m s⁻¹ every second', ['It travels 2 m every second', 'Its speed is 2 m s⁻¹', 'It travels 2 m in the first second only'], 'Acceleration is the change of velocity per second.')
M('E', 1, 'What is meant by a deceleration?', 'An acceleration that reduces the speed', ['Any negative velocity', 'Motion backwards', 'A constant velocity'], 'The acceleration is opposite to the velocity.')
N('E', 2, 'A cyclist slows from 8.0 m s⁻¹ to 2.0 m s⁻¹ in 3.0 s. Calculate her acceleration.', -2.0, 'm s⁻²',
  'a = (2.0 − 8.0) ÷ 3.0 = −2.0 m s⁻²', ['C1: negative for slowing'], sig=2, sign=True, aq='a')
M('E', 1, 'A car moves at a constant 25 m s⁻¹ along a straight road. What is its acceleration?', 'Zero', ['25 m s⁻²', '2.5 m s⁻²', '9.81 m s⁻²'], 'The velocity does not change.')
M('E', 1, 'Can an object accelerate while its speed stays constant?', 'Yes, if its direction changes', ['No, never', 'Only when it is falling', 'Only if it slows down'], 'For example uniform circular motion.')
N('E', 2, 'A ball rolls down a slope, its velocity rising by 0.60 m s⁻¹ every second. State its acceleration.', 0.60, 'm s⁻²',
  'a = 0.60 ÷ 1.0 = 0.60 m s⁻²', ['C1: change per second'], sig=2, aq='a')
M('E', 1, 'A ball is thrown straight up. Taking up as positive, what is the sign of its acceleration while it rises?', 'Negative', ['Positive', 'Zero', 'It changes sign at the top'], 'Gravity acts downwards all the time.')
N('E', 2, 'A sprinter reaches 9.0 m s⁻¹ from rest in 2.0 s. Calculate her average acceleration.', 4.5, 'm s⁻²',
  'a = 9.0 ÷ 2.0 = 4.5 m s⁻²', ['C1: a = Δv/t'], sig=2, aq='a')
M('E', 1, 'Which of these is accelerating?', 'A car going round a roundabout at constant speed', ['A car parked on a hill', 'A train moving at constant velocity on a straight track', 'A book resting on a table'], 'Its direction, and so its velocity, is changing.')
N('E', 1, 'A trolley\'s velocity increases from 0.20 m s⁻¹ to 0.80 m s⁻¹ in 2.0 s. Calculate its acceleration.', 0.30, 'm s⁻²',
  'a = (0.80 − 0.20) ÷ 2.0 = 0.30 m s⁻²', [], sig=2, aq='a')
M('E', 1, 'A car accelerates at 3 m s⁻² from rest. What is its speed after 4 s?', '12 m s⁻¹', ['7 m s⁻¹', '1.3 m s⁻¹', '48 m s⁻¹'], 'v = u + at = 0 + 3 × 4 = 12 m s⁻¹.')
N('E', 2, 'A lorry accelerates at 0.50 m s⁻² for 20 s from 4.0 m s⁻¹. Calculate its final velocity.', 4.0 + 0.50 * 20, 'm s⁻¹',
  'v = 4.0 + 0.50 × 20 = 14 m s⁻¹', ['C1: v = u + at'], sig=2, aq='v')
M('E', 1, 'A moving car has a negative velocity and a negative acceleration. What is happening?', 'It is speeding up in the negative direction', ['It is slowing down', 'It is at rest', 'It is moving in the positive direction'], 'Velocity and acceleration in the same direction mean speeding up.')
N('E', 2, 'A boat moving at 6.0 m s⁻¹ decelerates at 0.40 m s⁻². How long does it take to stop?', 6.0 / 0.40, 's',
  't = 6.0 ÷ 0.40 = 15 s', ['C1: t = Δv/a'], sig=2, aq='t')
# medium
M('M', 3, 'A ball moving up a slope slows down, stops and rolls back. Taking up the slope as positive, which describes its acceleration?', 'Negative and constant throughout', ['Positive then negative', 'Zero at the top', 'Negative then positive'], 'The component of gravity down the slope does not change.', ['C1: direction down slope', 'C1: constant, including at the top'])
N('M', 3, 'A jet accelerates from 60 m s⁻¹ to 80 m s⁻¹ at 2.5 m s⁻². How long does this take?', 20 / 2.5, 's',
  't = (80 − 60) ÷ 2.5 = 8.0 s', ['C1: Δv', 'C1: t = Δv/a'], sig=2, aq='t')
N('M', 3, 'A car travelling at 72 km h⁻¹ stops in 4.0 s. Calculate its acceleration.', -20 / 4.0, 'm s⁻²',
  'u = 72 ÷ 3.6 = 20 m s⁻¹; a = (0 − 20) ÷ 4.0 = −5.0 m s⁻²', ['C1: km h⁻¹ to m s⁻¹', 'C1: a with sign'], sig=2, sign=True, aq='a')
M('M', 3, 'At the highest point of a ball thrown vertically upwards, what are its velocity and acceleration?', 'Velocity zero; acceleration 9.81 m s⁻² downwards', ['Both zero', 'Velocity 9.81 m s⁻¹; acceleration zero', 'Velocity zero; acceleration zero'], 'Gravity still acts at the top.', ['C1: v = 0', 'C1: a = g downwards'])
N('M', 3, 'Taking up as positive, a ball is thrown upwards at 15 m s⁻¹ and is caught moving downwards at 15 m s⁻¹ after 3.06 s. Calculate its average acceleration.', -30 / 3.06, 'm s⁻²',
  f'a = (−15 − 15) ÷ 3.06 = {sf(-30 / 3.06)} m s⁻²', ['C1: Δv = −30 m s⁻¹', 'C1: ÷ time'], sign=True, aq='a')
N('M', 3, 'A train decelerates uniformly from 30 m s⁻¹ at 0.75 m s⁻². What is its velocity after 24 s?', 30 - 0.75 * 24, 'm s⁻¹',
  'v = 30 − 0.75 × 24 = 12 m s⁻¹', ['C1: v = u + at, a negative', 'C1: value'], sig=2, aq='v')
M('M', 3, 'Car A goes from 0 to 27 m s⁻¹ in 9.0 s; car B from 10 to 30 m s⁻¹ in 5.0 s. Which has the greater acceleration?', 'Car B (4.0 m s⁻² against 3.0 m s⁻²)', ['Car A', 'They are equal', 'Cannot tell without masses'], 'Compare Δv/t for each.', ['C1: car A 3.0', 'C1: car B 4.0'])
N('M', 3, 'A rocket accelerates uniformly from rest at 25 m s⁻². How long does it take to reach 1.5 km s⁻¹?', 1500 / 25, 's',
  't = 1500 ÷ 25 = 60 s', ['C1: km s⁻¹ to m s⁻¹', 'C1: t = v/a'], sig=2, aq='t')
M('M', 3, 'A lift moving up begins to slow down as it nears the top floor. Taking up as positive, what are the signs of velocity and acceleration?', 'Velocity positive, acceleration negative', ['Both positive', 'Both negative', 'Velocity negative, acceleration positive'], 'Slowing means a opposes v.', ['C1: v up', 'C1: a down'])
N('M', 3, 'A cheetah accelerates from 5.0 m s⁻¹ to 25 m s⁻¹ in 3.2 s. Calculate its acceleration.', 20 / 3.2, 'm s⁻²',
  'a = (25 − 5.0) ÷ 3.2 = 6.25 m s⁻²', ['C1: Δv', 'C1: ÷ t'], aq='a')
N('M', 3, 'A parachutist falling at 50 m s⁻¹ opens the parachute and slows to 8.0 m s⁻¹ in 3.0 s. Taking down as positive, calculate the average acceleration.', (8.0 - 50) / 3.0, 'm s⁻²',
  'a = (8.0 − 50) ÷ 3.0 = −14 m s⁻²', ['C1: Δv negative', 'C1: value'], sig=2, sign=True, aq='a')
M('M', 3, 'Why do we say a car on a circular track at constant speed is accelerating?', 'Its velocity changes because its direction changes', ['Its speed changes', 'It travels a long distance', 'Its engine is working'], 'Acceleration is the rate of change of velocity, a vector.', ['C1: velocity is a vector', 'C1: direction changes'])
N('M', 3, 'A car accelerates at 2.4 m s⁻² for 5.0 s and reaches 22 m s⁻¹. Calculate its initial velocity.', 22 - 2.4 * 5.0, 'm s⁻¹',
  'u = v − at = 22 − 2.4 × 5.0 = 10 m s⁻¹', ['C1: rearranged', 'C1: value'], sig=2, aq='u')
N('M', 3, 'A tennis ball is hit, changing its velocity from 20 m s⁻¹ towards the racket to 30 m s⁻¹ away in 0.0040 s. Calculate the magnitude of its average acceleration.', 50 / 0.0040, 'm s⁻²',
  'a = (30 + 20) ÷ 0.0040 = 12 500 m s⁻²', ['C1: Δv = 50', 'C1: ÷ t'], aq='a')
M('M', 3, 'An object\'s velocity changes from +4 m s⁻¹ to −4 m s⁻¹. Which is true?', 'Its speed is unchanged but it has accelerated', ['It has not accelerated', 'Its acceleration was zero', 'Its speed has doubled'], 'Δv = −8 m s⁻¹ even though the speed is the same.', ['C1: speed same', 'C1: Δv non-zero'])
N('M', 3, 'A bus decelerates at 1.5 m s⁻² from 18 m s⁻¹. How long does it take to halve its speed?', 9 / 1.5, 's',
  't = (18 − 9.0) ÷ 1.5 = 6.0 s', ['C1: Δv = 9.0', 'C1: t = Δv/a'], sig=2, aq='t')
N('M', 4, 'A runner accelerates uniformly from rest to 8.0 m s⁻¹ in 2.5 s and then decelerates uniformly to rest in 4.0 s. Calculate (magnitude of first acceleration) ÷ (magnitude of deceleration).', (8 / 2.5) / (8 / 4.0), None,
  'a₁ = 8.0 ÷ 2.5 = 3.2 m s⁻²; a₂ = 8.0 ÷ 4.0 = 2.0 m s⁻²; ratio = 3.2 ÷ 2.0 = 1.6', ['C1: a₁', 'C1: a₂', 'C1: ratio'], sig=2, aq='ratio')
M('M', 3, 'A stone is thrown upwards. When does its acceleration change?', 'Never — it is g downwards throughout (ignoring air resistance)', ['At the top', 'When it starts falling', 'When it reaches its starting height'], 'Only gravity acts on it, so a = g downwards at all times.', ['C1: constant g', 'C1: direction down'])
# hard
N('H', 5, 'A car moving at 12 m s⁻¹ accelerates uniformly at 1.8 m s⁻² for 6.0 s, then decelerates uniformly to rest in 8.0 s. (a) Calculate the maximum speed. (b) Calculate the deceleration.', (12 + 1.8 * 6.0) / 8.0, 'm s⁻²',
  '(a) v = 12 + 1.8 × 6.0 = 22.8 m s⁻¹. (b) a = 22.8 ÷ 8.0 = 2.85 m s⁻²',
  ['C1: v = u + at', 'C1: 22.8 m s⁻¹', 'M1: a = Δv/t', 'C1: value'], aq='a')
N('H', 6, 'A ball hits the ground at 9.0 m s⁻¹ and rebounds at 6.0 m s⁻¹; contact lasts 0.025 s. Taking up as positive: (a) state the initial and final velocities with signs; (b) calculate Δv; (c) calculate the average acceleration.', 15 / 0.025, 'm s⁻²',
  '(a) u = −9.0 m s⁻¹, v = +6.0 m s⁻¹. (b) Δv = 6.0 − (−9.0) = 15 m s⁻¹. (c) a = 15 ÷ 0.025 = 600 m s⁻²',
  ['C1: signs', 'C1: Δv', 'M1: a = Δv/t', 'C1: value', 'B1: direction up'], sig=2, aq='a')
N('H', 5, 'A satellite moves in a circle at 7.0 km s⁻¹. Its velocity turns through 90° in 1200 s. (a) Calculate |Δv|. (b) Calculate the magnitude of its average acceleration over this time.', 7000 * sqrt(2) / 1200, 'm s⁻²',
  f'(a) |Δv| = √(7000² + 7000²) = {sf(7000 * sqrt(2), 4)} m s⁻¹. (b) a = {sf(7000 * sqrt(2), 4)} ÷ 1200 = {sf(7000 * sqrt(2) / 1200)} m s⁻²',
  ['M1: vector change', 'C1: |Δv|', 'M1: ÷ t', 'C1: value'], aq='a')
N('H', 6, 'A train has a maximum acceleration of 0.80 m s⁻² and a maximum deceleration of 1.2 m s⁻². Between stations it reaches 24 m s⁻¹. (a) Calculate the time to reach 24 m s⁻¹ from rest. (b) Calculate the time to stop from 24 m s⁻¹. (c) Calculate the shortest total time spent accelerating and braking.', 24 / 0.80 + 24 / 1.2, 's',
  '(a) t₁ = 24 ÷ 0.80 = 30 s. (b) t₂ = 24 ÷ 1.2 = 20 s. (c) t = 30 + 20 = 50 s',
  ['M1: t = Δv/a', 'C1: t₁', 'C1: t₂', 'C1: sum', 'C1: value'], sig=2, aq='t')
N('H', 5, 'A sprinter accelerates uniformly from rest at 3.6 m s⁻² until reaching 10.8 m s⁻¹, then runs at constant speed. (a) Calculate the time spent accelerating. (b) State her acceleration after this time.', 10.8 / 3.6, 's',
  '(a) t = 10.8 ÷ 3.6 = 3.0 s. (b) Zero, because her velocity is then constant.',
  ['M1: t = Δv/a', 'C1: value', 'B1: zero', 'B1: reason'], sig=2, aq='t')
N('H', 5, 'A lift starts from rest, accelerates upwards at 1.5 m s⁻² for 2.0 s, moves at constant speed and then decelerates at 1.0 m s⁻² to rest. (a) Calculate the maximum speed. (b) Calculate the braking time.', 3.0 / 1.0, 's',
  '(a) v = 1.5 × 2.0 = 3.0 m s⁻¹. (b) t = 3.0 ÷ 1.0 = 3.0 s',
  ['C1: v = at', 'C1: 3.0 m s⁻¹', 'M1: t = v/a', 'C1: value'], sig=2, aq='t')
N('H', 6, 'A car travels round a bend, its velocity changing from 20 m s⁻¹ north to 20 m s⁻¹ east in 5.0 s. (a) Explain why the car accelerates although its speed is constant. (b) Calculate |Δv|. (c) Calculate the average acceleration.', 20 * sqrt(2) / 5.0, 'm s⁻²',
  f'(a) Velocity is a vector and its direction changes. (b) |Δv| = √(20² + 20²) = {sf(20 * sqrt(2), 4)} m s⁻¹. (c) a = {sf(20 * sqrt(2), 4)} ÷ 5.0 = {sf(4 * sqrt(2))} m s⁻²',
  ['B1: direction change', 'M1: vector subtraction', 'C1: |Δv|', 'M1: ÷ t', 'C1: value'], aq='a')
N('H', 5, 'A skier\'s speed rises from 4.0 m s⁻¹ to 16 m s⁻¹ down a slope in 6.0 s, then falls to 10 m s⁻¹ in 2.0 s on flat snow. (a) Calculate each acceleration. (b) Calculate the average acceleration over the 8.0 s.', (10 - 4.0) / 8.0, 'm s⁻²',
  '(a) (16 − 4.0) ÷ 6.0 = 2.0 m s⁻²; (10 − 16) ÷ 2.0 = −3.0 m s⁻². (b) a = (10 − 4.0) ÷ 8.0 = 0.75 m s⁻²',
  ['C1: slope', 'C1: flat', 'M1: overall Δv/t', 'C1: value'], sig=2, aq='a')
N('H', 6, 'A cyclist accelerates from 3.0 m s⁻¹ at 0.50 m s⁻² for 12 s, then brakes at 2.5 m s⁻². (a) Calculate her speed after 12 s. (b) Calculate the braking time to stop. (c) Calculate the total time from the start of accelerating to stopping.', 12 + (3.0 + 0.5 * 12) / 2.5, 's',
  '(a) v = 3.0 + 0.50 × 12 = 9.0 m s⁻¹. (b) t = 9.0 ÷ 2.5 = 3.6 s. (c) 12 + 3.6 = 15.6 s',
  ['C1: speed', 'M1: braking time', 'C1: 3.6 s', 'M1: total', 'C1: value'], aq='t')

M('E', 1, 'A train moving forwards has an acceleration of −0.5 m s⁻². What is happening?', 'It is slowing down by 0.5 m s⁻¹ every second', ['It is moving backwards', 'It is speeding up', 'It is at rest'], 'The acceleration is opposite to the velocity.')
N('E', 2, 'A skier accelerates from 2.0 m s⁻¹ at 1.5 m s⁻² for 4.0 s. Calculate her final speed.', 2.0 + 1.5 * 4.0, 'm s⁻¹',
  'v = 2.0 + 1.5 × 4.0 = 8.0 m s⁻¹', ['C1: v = u + at'], sig=2, aq='v')
N('M', 3, 'A ball rolling at 4.0 m s⁻¹ across a rough floor stops in 5.0 s. Calculate its average acceleration.', -4.0 / 5.0, 'm s⁻²',
  'a = (0 − 4.0) ÷ 5.0 = −0.80 m s⁻²', ['C1: Δv negative', 'C1: value'], sig=2, sign=True, aq='a')
M('M', 3, 'An object\'s velocity is zero at one instant. Must its acceleration be zero at that instant?', 'No; for example a ball at the top of its flight has v = 0 but a = g', ['Yes, always', 'Yes, unless it is in a circle', 'Only if it is falling'], 'Zero velocity does not mean zero rate of change of velocity.', ['C1: no', 'C1: example'])
N('E', 1, 'A horse\'s velocity increases by 1.2 m s⁻¹ each second for 5.0 s from rest. Calculate its final velocity.', 6.0, 'm s⁻¹',
  'v = 1.2 × 5.0 = 6.0 m s⁻¹', [], sig=2, aq='v')
N('M', 3, 'A car accelerates at 1.6 m s⁻² from 9.0 m s⁻¹. How long does it take to reach 25 m s⁻¹?', 16 / 1.6, 's',
  't = (25 − 9.0) ÷ 1.6 = 10 s', ['C1: Δv', 'C1: t = Δv/a'], sig=2, aq='t')
N('H', 5, 'A ball rolls up a ramp at 5.0 m s⁻¹ and decelerates at 2.0 m s⁻². (a) Calculate when it stops. (b) Calculate its velocity 4.0 s after starting up the ramp, taking up the ramp as positive.', 5.0 - 2.0 * 4.0, 'm s⁻¹',
  '(a) t = 5.0 ÷ 2.0 = 2.5 s. (b) v = 5.0 − 2.0 × 4.0 = −3.0 m s⁻¹, rolling back down', ['C1: stopping time', 'M1: v = u + at', 'C1: value', 'B1: sign meaning'], sig=2, sign=True, aq='v')

# ═════════════════════════ 2.2 Calculating acceleration (17/20/13) ═════════════════════════
lesson('2.2')
N('E', 2, 'A motorbike accelerates from 5.0 m s⁻¹ to 25 m s⁻¹ in 4.0 s. Calculate its acceleration.', 5.0, 'm s⁻²',
  'a = (25 − 5.0) ÷ 4.0 = 5.0 m s⁻²', ['C1: a = (v − u)/t'], sig=2, aq='a')
M('E', 1, 'Which equation is used to calculate acceleration?', 'a = (v − u) ÷ t', ['a = v × t', 'a = (u − v) × t', 'a = s ÷ t'], 'Change in velocity divided by time taken.')
N('E', 2, 'A bowling ball goes from rest to 6.0 m s⁻¹ in 0.80 s. Calculate its acceleration.', 7.5, 'm s⁻²',
  'a = 6.0 ÷ 0.80 = 7.5 m s⁻²', ['C1: a = v/t from rest'], sig=2, aq='a')
N('E', 2, 'A plane lands at 70 m s⁻¹ and stops in 28 s. Calculate its acceleration.', -2.5, 'm s⁻²',
  'a = (0 − 70) ÷ 28 = −2.5 m s⁻²', ['C1: negative'], sig=2, sign=True, aq='a')
N('E', 2, 'A falling stone\'s speed increases from 4.9 m s⁻¹ to 14.7 m s⁻¹ in 1.0 s. Calculate its acceleration.', 9.8, 'm s⁻²',
  'a = (14.7 − 4.9) ÷ 1.0 = 9.8 m s⁻²', ['C1: Δv/t'], sig=2, aq='a')
N('E', 2, 'A car accelerates at 3.5 m s⁻² for 4.0 s from rest. Calculate its final speed.', 14, 'm s⁻¹',
  'v = 0 + 3.5 × 4.0 = 14 m s⁻¹', ['C1: v = u + at'], sig=2, aq='v')
M('E', 1, 'In a = (v − u)/t, what does u represent?', 'The initial velocity', ['The final velocity', 'The average velocity', 'The displacement'], 'u is the velocity at the start of the interval.')
N('E', 2, 'A trolley slows from 1.2 m s⁻¹ to 0.30 m s⁻¹ in 1.5 s. Calculate its acceleration.', -0.60, 'm s⁻²',
  'a = (0.30 − 1.2) ÷ 1.5 = −0.60 m s⁻²', ['C1: Δv/t with sign'], sig=2, sign=True, aq='a')
N('E', 2, 'A rocket reaches 300 m s⁻¹ from rest in 12 s. Calculate its average acceleration.', 25, 'm s⁻²',
  'a = 300 ÷ 12 = 25 m s⁻²', ['C1: a = v/t'], sig=2, aq='a')
N('E', 2, 'A van brakes at 4.0 m s⁻² from 20 m s⁻¹. Calculate the time to stop.', 5.0, 's',
  't = 20 ÷ 4.0 = 5.0 s', ['C1: t = Δv/a'], sig=2, aq='t')
N('E', 1, 'A skateboard goes from 2.0 m s⁻¹ to 5.0 m s⁻¹ in 2.0 s. Calculate its acceleration.', 1.5, 'm s⁻²',
  'a = (5.0 − 2.0) ÷ 2.0 = 1.5 m s⁻²', [], sig=2, aq='a')
M('E', 1, 'What does a negative value of a = (v − u)/t show when the motion is in the positive direction?', 'The object is slowing down', ['The object is speeding up', 'The object is at rest', 'The object is moving backwards'], 'v is less than u, so v − u is negative.')
N('E', 2, 'A swimmer pushes off a wall, reaching 2.4 m s⁻¹ from rest in 0.60 s. Calculate her acceleration.', 4.0, 'm s⁻²',
  'a = 2.4 ÷ 0.60 = 4.0 m s⁻²', ['C1: a = v/t'], sig=2, aq='a')
N('E', 2, 'Starting at 5.0 m s⁻¹, a train gains speed at 0.25 m s⁻² for one minute (60 s). What speed does it reach?', 5.0 + 0.25 * 60, 'm s⁻¹',
  'v = 5.0 + 0.25 × 60 = 20 m s⁻¹', ['C1: v = u + at'], sig=2, aq='v')
N('E', 2, 'A golf ball leaves the club at 70 m s⁻¹ after 0.50 ms of contact, starting from rest. Calculate its acceleration.', 70 / 0.50e-3, 'm s⁻²',
  'a = 70 ÷ 0.50 × 10⁻³ = 140 000 m s⁻²', ['C1: ms to s'], sig=2, aq='a')
M('E', 1, 'A car accelerates uniformly. Which pair of measurements is enough to calculate its acceleration?', 'Its velocity at two times and the time between them', ['Its mass and speed', 'Its distance travelled only', 'Its final speed only'], 'a = (v − u)/t needs u, v and t.')
N('E', 2, 'A lift accelerates from rest to 2.0 m s⁻¹ in 1.6 s. Calculate its acceleration.', 1.25, 'm s⁻²',
  'a = 2.0 ÷ 1.6 = 1.25 m s⁻²', ['C1: a = v/t'], aq='a')
# medium
N('M', 3, 'A car accelerates uniformly from 36 km h⁻¹ to 90 km h⁻¹ in 6.0 s. Calculate its acceleration in m s⁻².', (25 - 10) / 6.0, 'm s⁻²',
  'u = 36 ÷ 3.6 = 10 m s⁻¹; v = 90 ÷ 3.6 = 25 m s⁻¹; a = (25 − 10) ÷ 6.0 = 2.5 m s⁻²', ['C1: convert speeds', 'C1: a'], sig=2, aq='a')
N('M', 3, 'A ball rolling up a slope at 3.0 m s⁻¹ has an acceleration of −1.2 m s⁻². Calculate its velocity after 4.0 s.', 3.0 - 1.2 * 4.0, 'm s⁻¹',
  'v = 3.0 + (−1.2) × 4.0 = −1.8 m s⁻¹ (rolling back down)', ['C1: v = u + at', 'C1: sign'], sig=2, sign=True, aq='v')
M('M', 3, 'In the slope problem above, what does the negative final velocity mean?', 'The ball has stopped and is now rolling back down the slope', ['The ball has stopped', 'The calculation is wrong', 'The ball is slowing down'], 'The sign gives the direction.', ['C1: reversed direction', 'C1: passed through zero'])
N('M', 3, 'A dragster accelerates from rest at 30 m s⁻² for 3.5 s and then at 15 m s⁻² for 2.0 s. Calculate its final speed.', 30 * 3.5 + 15 * 2.0, 'm s⁻¹',
  'v = 30 × 3.5 + 15 × 2.0 = 135 m s⁻¹', ['C1: first stage', 'C1: second stage'], aq='v')
N('M', 3, 'A boat accelerates at 0.80 m s⁻² from 3.0 m s⁻¹. How long does it take to reach 15 m s⁻¹?', 12 / 0.80, 's',
  't = (15 − 3.0) ÷ 0.80 = 15 s', ['C1: rearranged', 'C1: value'], sig=2, aq='t')
N('M', 3, 'A ball is dropped onto a floor at 5.0 m s⁻¹ and rebounds at 4.0 m s⁻¹. The contact time is 0.012 s. Calculate the magnitude of its average acceleration.', 9.0 / 0.012, 'm s⁻²',
  'a = (4.0 + 5.0) ÷ 0.012 = 750 m s⁻²', ['C1: Δv = 9.0 m s⁻¹', 'C1: ÷ t'], sig=2, aq='a')
M('M', 3, 'A student calculates a = (u − v)/t by mistake for a car speeding up. What will be wrong with her answer?', 'Its sign will be negative instead of positive', ['Its size will double', 'Its unit will be wrong', 'Nothing'], 'The magnitude is right but the direction is reversed.', ['C1: magnitude correct', 'C1: sign wrong'])
N('M', 3, 'A car accelerates uniformly. Its speed is 8.0 m s⁻¹ at t = 2.0 s and 20 m s⁻¹ at t = 6.0 s. Calculate its acceleration.', 12 / 4.0, 'm s⁻²',
  'a = (20 − 8.0) ÷ (6.0 − 2.0) = 3.0 m s⁻²', ['C1: Δv', 'C1: Δt'], sig=2, aq='a')
N('M', 3, 'The same car (8.0 m s⁻¹ at 2.0 s, 20 m s⁻¹ at 6.0 s, uniform acceleration): calculate its speed at t = 0.', 8.0 - 3.0 * 2.0, 'm s⁻¹',
  'a = 12 ÷ 4.0 = 3.0 m s⁻²; u = 8.0 − 3.0 × 2.0 = 2.0 m s⁻¹', ['C1: acceleration', 'C1: extrapolate back'], sig=2, aq='u')
N('M', 4, 'A train decelerates uniformly from 40 m s⁻¹ to 16 m s⁻¹ in 30 s and continues at the same rate. Calculate how much longer it takes to stop.', 16 / (24 / 30), 's',
  'a = (16 − 40) ÷ 30 = −0.80 m s⁻². Further time = 16 ÷ 0.80 = 20 s', ['C1: deceleration', 'M1: same rate', 'C1: time'], sig=2, aq='t')
N('M', 3, 'A sprinter\'s speed is 6.0 m s⁻¹ after 1.0 s and 9.6 m s⁻¹ after 2.5 s. Calculate her average acceleration in this interval.', 3.6 / 1.5, 'm s⁻²',
  'a = (9.6 − 6.0) ÷ (2.5 − 1.0) = 2.4 m s⁻²', ['C1: Δv', 'C1: Δt'], sig=2, aq='a')
M('M', 3, 'Which situation has the largest acceleration: A 0 → 20 m s⁻¹ in 4 s; B 10 → 30 m s⁻¹ in 5 s; C 30 → 0 m s⁻¹ in 5 s?', 'C (6 m s⁻² in size)', ['A (5 m s⁻²)', 'B (4 m s⁻²)', 'They are all equal'], 'Compare |Δv|/t: 5, 4 and 6 m s⁻².', ['C1: values', 'C1: compare magnitudes'])
N('M', 3, 'A cyclist freewheels down a hill, accelerating from 4.0 m s⁻¹ at 0.35 m s⁻² for 40 s. Calculate her final speed.', 4.0 + 0.35 * 40, 'm s⁻¹',
  'v = 4.0 + 0.35 × 40 = 18 m s⁻¹', ['C1: v = u + at', 'C1: value'], sig=2, aq='v')
N('M', 3, 'An electron is accelerated from 2.0 × 10⁶ m s⁻¹ to 8.0 × 10⁶ m s⁻¹ in 3.0 × 10⁻⁹ s. Calculate its acceleration, in units of 10¹⁵ m s⁻².', 6.0e6 / 3.0e-9, '10¹⁵ m s⁻²',
  'a = (8.0 × 10⁶ − 2.0 × 10⁶) ÷ 3.0 × 10⁻⁹ = 2.0 × 10¹⁵ m s⁻²', ['C1: Δv', 'C1: ÷ t'], sig=2, aq='a')
N('M', 3, 'A car brakes from 25 m s⁻¹ at 6.5 m s⁻². Calculate its speed 2.0 s after the brakes are applied.', 25 - 6.5 * 2.0, 'm s⁻¹',
  'v = 25 − 6.5 × 2.0 = 12 m s⁻¹', ['C1: negative a', 'C1: value'], sig=2, aq='v')
M('M', 3, 'A car\'s velocity is +10 m s⁻¹ and its acceleration is −2 m s⁻². What is its velocity 8 s later if the acceleration stays constant?', '−6 m s⁻¹', ['+26 m s⁻¹', '0', '+6 m s⁻¹'], 'v = 10 + (−2) × 8 = −6 m s⁻¹.', ['C1: v = u + at', 'C1: sign'])
N('M', 3, 'A ball thrown upwards at 18 m s⁻¹ decelerates at 9.81 m s⁻². How long does it take to reach its highest point?', 18 / 9.81, 's',
  't = 18 ÷ 9.81 = 1.83 s', ['C1: v = 0 at top', 'C1: t = u/g'], aq='t')
N('M', 3, 'A lorry\'s speed increases from 15 m s⁻¹ to 21 m s⁻¹ while it travels for 12 s. Calculate its acceleration.', 6 / 12, 'm s⁻²',
  'a = (21 − 15) ÷ 12 = 0.50 m s⁻²', ['C1: Δv', 'C1: ÷ t'], sig=2, aq='a')
# hard
N('H', 5, 'A car accelerates uniformly from rest. After 3.0 s its speed is 7.5 m s⁻¹. (a) Calculate its acceleration. (b) Calculate its speed after a further 5.0 s at the same acceleration.', 2.5 * 8.0, 'm s⁻¹',
  '(a) a = 7.5 ÷ 3.0 = 2.5 m s⁻². (b) v = 7.5 + 2.5 × 5.0 = 20 m s⁻¹',
  ['C1: a', 'C1: value', 'M1: v = u + at', 'C1: value'], sig=2, aq='v')
N('H', 6, 'A test car crashes into a wall at 15 m s⁻¹ and stops in 0.090 s. A dummy with a seat belt stops in 0.15 s. (a) Calculate the car\'s deceleration. (b) Calculate the dummy\'s deceleration. (c) Express the dummy\'s deceleration in units of g (g = 9.81 m s⁻²).', 15 / 0.15 / 9.81, None,
  f'(a) a = 15 ÷ 0.090 = {sf(15 / 0.09)} m s⁻². (b) a = 15 ÷ 0.15 = 100 m s⁻². (c) 100 ÷ 9.81 = {sf(100 / 9.81)}',
  ['C1: car', 'C1: dummy', 'M1: ÷ g', 'C1: value', 'B1: longer time, smaller deceleration'], aq='a/g')
N('H', 5, 'A train passes signal A at 20 m s⁻¹ and signal B, 50 s later, at 30 m s⁻¹, accelerating uniformly. It keeps accelerating at the same rate. (a) Calculate its acceleration. (b) Calculate its speed 20 s after passing B.', 30 + 0.20 * 20, 'm s⁻¹',
  '(a) a = (30 − 20) ÷ 50 = 0.20 m s⁻². (b) v = 30 + 0.20 × 20 = 34 m s⁻¹',
  ['C1: Δv', 'C1: a', 'M1: v = u + at', 'C1: value'], sig=2, aq='v')
N('H', 6, 'A ball is thrown vertically upwards at 24 m s⁻¹. Taking up as positive and g = 9.81 m s⁻²: (a) calculate the time to the top; (b) calculate its velocity 4.0 s after release; (c) explain the sign.', 24 - 9.81 * 4.0, 'm s⁻¹',
  f'(a) t = 24 ÷ 9.81 = {sf(24 / 9.81)} s. (b) v = 24 − 9.81 × 4.0 = {sf(24 - 39.24)} m s⁻¹. (c) Negative: it is moving downwards after passing the top.',
  ['C1: time to top', 'M1: v = u + at', 'C1: substitution', 'C1: value', 'B1: sign'], sign=True, aq='v')
N('H', 5, 'A rocket accelerates from rest at 20 m s⁻² for 15 s, then its engine stops and it decelerates at 9.81 m s⁻². (a) Calculate its speed when the engine stops. (b) Calculate the further time until it stops rising.', 300 / 9.81, 's',
  f'(a) v = 20 × 15 = 300 m s⁻¹. (b) t = 300 ÷ 9.81 = {sf(300 / 9.81)} s',
  ['C1: v = at', 'C1: 300', 'M1: t = v/g', 'C1: value'], aq='t')
N('H', 5, 'A car driver reacts in 0.70 s and then brakes at 6.0 m s⁻² from 24 m s⁻¹. (a) Calculate the braking time. (b) Calculate the total time from seeing a hazard to stopping.', 0.70 + 24 / 6.0, 's',
  '(a) t = 24 ÷ 6.0 = 4.0 s. (b) 0.70 + 4.0 = 4.7 s',
  ['M1: t = Δv/a', 'C1: 4.0 s', 'M1: add reaction time', 'C1: value'], sig=2, aq='t')
N('H', 6, 'A lift accelerates upwards at 1.2 m s⁻² for 2.5 s, travels at constant speed for 6.0 s and decelerates to rest in 2.0 s. (a) Calculate the top speed. (b) Calculate the deceleration. (c) Calculate the total time.', 3.0 / 2.0, 'm s⁻²',
  '(a) v = 1.2 × 2.5 = 3.0 m s⁻¹. (b) a = 3.0 ÷ 2.0 = 1.5 m s⁻². (c) 2.5 + 6.0 + 2.0 = 10.5 s',
  ['C1: top speed', 'M1: a = Δv/t', 'C1: deceleration', 'C1: total time', 'B1: answer (b)'], sig=2, aq='a')
N('H', 5, 'A sprinter covers the first 2.0 s of a race with uniform acceleration, reaching 9.0 m s⁻¹. A rival reaches 9.0 m s⁻¹ in 2.4 s. (a) Calculate both accelerations. (b) Calculate their difference.', 9.0 / 2.0 - 9.0 / 2.4, 'm s⁻²',
  '(a) 9.0 ÷ 2.0 = 4.5 m s⁻²; 9.0 ÷ 2.4 = 3.75 m s⁻². (b) 4.5 − 3.75 = 0.75 m s⁻²',
  ['C1: first', 'C1: second', 'M1: difference', 'C1: value'], sig=2, aq='Δa')
N('H', 6, 'A particle has velocity 6.0 m s⁻¹ east, and 4.0 s later 8.0 m s⁻¹ north. (a) Calculate |Δv|. (b) Calculate the magnitude of its average acceleration. (c) Find the direction of the acceleration as an angle west of north.', degrees(atan(6 / 8)), '°',
  f'(a) |Δv| = √(6.0² + 8.0²) = 10 m s⁻¹. (b) a = 10 ÷ 4.0 = 2.5 m s⁻². (c) θ = tan⁻¹(6.0 ÷ 8.0) = {sf(degrees(atan(0.75)))}°',
  ['C1: |Δv|', 'C1: a', 'M1: components of Δv', 'M1: tan θ', 'C1: value'], aq='θ')

N('E', 2, 'Flying off a fence, a pigeon goes from 3.0 m s⁻¹ to 12 m s⁻¹ in just 1.5 s. What is its acceleration?', 9.0 / 1.5, 'm s⁻²',
  'a = (12 − 3.0) ÷ 1.5 = 6.0 m s⁻²', ['C1: Δv/t'], sig=2, aq='a')
N('E', 2, 'Friction on the ice reduces a puck\'s velocity from 9.0 m s⁻¹ to 6.0 m s⁻¹ over 2.0 s. Find its acceleration.', -1.5, 'm s⁻²',
  'a = (6.0 − 9.0) ÷ 2.0 = −1.5 m s⁻²', ['C1: negative'], sig=2, sign=True, aq='a')
N('M', 3, 'A lift accelerates downwards from rest at 0.90 m s⁻². Calculate its speed after 2.5 s.', 0.90 * 2.5, 'm s⁻¹',
  'v = 0 + 0.90 × 2.5 = 2.25 m s⁻¹', ['C1: v = u + at', 'C1: value'], aq='v')
N('M', 3, 'A car moving at 14 m s⁻¹ accelerates at 1.2 m s⁻² for 7.5 s. Calculate its final speed in km h⁻¹.', (14 + 1.2 * 7.5) * 3.6, 'km h⁻¹',
  'v = 14 + 1.2 × 7.5 = 23 m s⁻¹. In km h⁻¹: 23 × 3.6 = 82.8', ['C1: v = u + at', 'C1: × 3.6'], aq='v')
N('E', 2, 'How long does a bus accelerating at 1.25 m s⁻² take to go from rest to 15 m s⁻¹?', 15 / 1.25, 's',
  't = 15 ÷ 1.25 = 12 s', ['C1: t = v/a'], sig=2, aq='t')
N('M', 3, 'Cars A and B both reach 30 m s⁻¹ from rest; A takes 6.0 s and B takes 10 s. Calculate (acceleration of A) ÷ (acceleration of B).', 10 / 6.0, None,
  'a_A = 30 ÷ 6.0 = 5.0 m s⁻²; a_B = 30 ÷ 10 = 3.0 m s⁻²; ratio = 5.0 ÷ 3.0 = 1.67', ['C1: both', 'C1: ratio'], aq='ratio')
N('H', 5, 'A spacecraft\'s speed rises from 0 to 1.2 km s⁻¹ in 120 s, then from 1.2 km s⁻¹ to 7.8 km s⁻¹ in 400 s. (a) Calculate each acceleration. (b) Calculate the average acceleration over the 520 s.', 7800 / 520, 'm s⁻²',
  '(a) 1200 ÷ 120 = 10 m s⁻²; (7800 − 1200) ÷ 400 = 16.5 m s⁻². (b) a = 7800 ÷ 520 = 15 m s⁻²', ['C1: first', 'C1: second', 'M1: overall Δv/t', 'C1: value'], sig=2, aq='a')
N('M', 3, 'A ball is thrown straight down at 5.0 m s⁻¹ and accelerates at 9.81 m s⁻². Calculate its speed after 1.5 s.', 5.0 + 9.81 * 1.5, 'm s⁻¹',
  'v = 5.0 + 9.81 × 1.5 = 19.7 m s⁻¹', ['C1: v = u + at', 'C1: value'], aq='v')

# ═════════════════════════ 2.3 Units of acceleration (17/20/13) ═════════════════════════
lesson('2.3')
M('E', 1, 'What is the SI unit of acceleration?', 'm s⁻²', ['m s⁻¹', 'm s', 'N'], 'Metres per second, per second.')
M('E', 1, 'Why is acceleration measured in m s⁻²?', 'It is a change of velocity (m s⁻¹) per second (s)', ['It is a distance per second', 'It is a force per mass in kg', 'It is a speed times a time'], '(m s⁻¹) ÷ s = m s⁻².')
N('E', 2, 'Convert an acceleration of 3.6 km h⁻¹ per second into m s⁻².', 3.6 / 3.6, 'm s⁻²',
  '3.6 km h⁻¹ = 3.6 ÷ 3.6 = 1.0 m s⁻¹, so a = 1.0 m s⁻²', ['C1: km h⁻¹ to m s⁻¹'], sig=2, aq='a')
M('E', 1, 'Which unit could NOT be a unit of acceleration?', 'm s⁻¹', ['km h⁻¹ s⁻¹', 'cm s⁻²', 'N kg⁻¹'], 'm s⁻¹ is a unit of velocity.')
N('E', 2, 'Express 250 cm s⁻² in m s⁻².', 2.5, 'm s⁻²',
  'a = 250 ÷ 100 = 2.5 m s⁻²', ['C1: cm to m'], sig=2, aq='a')
M('E', 1, 'Which is equivalent to 1 m s⁻²?', '1 N kg⁻¹', ['1 J kg⁻¹', '1 W kg⁻¹', '1 kg N⁻¹'], 'F = ma, so N kg⁻¹ = m s⁻².')
N('E', 2, 'Express 9.81 m s⁻² in km h⁻¹ s⁻¹ (km h⁻¹ gained per second).', 9.81 * 3.6, 'km h⁻¹ s⁻¹',
  '9.81 m s⁻¹ = 9.81 × 3.6 = 35.3 km h⁻¹, so 35.3 km h⁻¹ s⁻¹', ['C1: × 3.6'], aq='a')
M('E', 1, 'A car\'s acceleration is given as "0 to 100 km h⁻¹ in 8 s". Which quantity is being described?', 'Average acceleration', ['Top speed', 'Distance travelled', 'Power'], 'A change of speed in a time.')
N('E', 2, 'A car goes from 0 to 100 km h⁻¹ in 8.0 s. Calculate its average acceleration in m s⁻².', (100 / 3.6) / 8.0, 'm s⁻²',
  f'v = 100 ÷ 3.6 = {sf(100 / 3.6, 4)} m s⁻¹; a = {sf(100 / 3.6, 4)} ÷ 8.0 = {sf(100 / 3.6 / 8)} m s⁻²', ['C1: convert then divide'], aq='a')
M('E', 1, 'Which SI base units make up the unit of acceleration?', 'm and s', ['kg, m and s', 'N and kg', 'm only'], 'The unit m s⁻² uses only metres and seconds.')
N('E', 2, 'Express an acceleration of 0.050 m s⁻² in mm s⁻².', 50, 'mm s⁻²',
  'a = 0.050 × 1000 = 50 mm s⁻²', ['C1: m to mm'], sig=2, aq='a')
M('E', 1, 'A student writes the acceleration of a car as "3 m/s". What is wrong?', 'The unit is that of velocity, not acceleration; it should be m s⁻²', ['Nothing', 'It should be in km', 'It should be in N'], 'Acceleration needs per second squared.')
N('E', 1, 'Convert 2.0 km h⁻¹ s⁻¹ to m s⁻².', 2.0 / 3.6, 'm s⁻²',
  f'a = 2.0 ÷ 3.6 = {sf(2 / 3.6)} m s⁻²', [], aq='a')
M('E', 1, 'In what unit is the gravitational field strength g usually quoted, and is it equivalent to m s⁻²?', 'N kg⁻¹, which is equivalent to m s⁻²', ['N, which is not equivalent', 'kg N⁻¹', 'J kg⁻¹, which is equivalent'], 'g is both a field strength and an acceleration.')
N('E', 2, 'An acceleration is 1.8 × 10³ cm s⁻². Express it in m s⁻².', 18, 'm s⁻²',
  'a = 1.8 × 10³ ÷ 100 = 18 m s⁻²', ['C1: ÷ 100'], sig=2, aq='a')
M('E', 1, 'Which expression has the units of acceleration?', 'velocity² ÷ distance', ['velocity × time', 'distance ÷ time', 'velocity ÷ distance'], '(m² s⁻²) ÷ m = m s⁻².')
N('E', 2, 'A train\'s speed changes by 54 km h⁻¹ in 30 s. Calculate its acceleration in m s⁻².', 15 / 30, 'm s⁻²',
  'Δv = 54 ÷ 3.6 = 15 m s⁻¹; a = 15 ÷ 30 = 0.50 m s⁻²', ['C1: convert Δv'], sig=2, aq='a')
# medium
M('M', 3, 'Show which expression is homogeneous with acceleration: (A) F/m (B) v/s (C) s/t', 'F/m only', ['v/s only', 's/t only', 'All three'], 'F/m: N kg⁻¹ = m s⁻². v/s has unit s⁻¹; s/t is m s⁻¹.', ['C1: F/m correct', 'C1: others checked'])
N('M', 3, 'A car decelerates from 108 km h⁻¹ to rest in 6.0 s. Calculate the magnitude of its deceleration in m s⁻².', 30 / 6.0, 'm s⁻²',
  'u = 108 ÷ 3.6 = 30 m s⁻¹; a = 30 ÷ 6.0 = 5.0 m s⁻²', ['C1: convert', 'C1: a'], sig=2, aq='a')
N('M', 3, 'An aircraft catapult takes a jet from rest to 270 km h⁻¹ in 2.5 s. Calculate the acceleration in m s⁻².', 75 / 2.5, 'm s⁻²',
  'v = 270 ÷ 3.6 = 75 m s⁻¹; a = 75 ÷ 2.5 = 30 m s⁻²', ['C1: convert', 'C1: a'], sig=2, aq='a')
N('M', 3, 'Express the catapult acceleration of 30 m s⁻² as a multiple of g (g = 9.81 m s⁻²).', 30 / 9.81, None,
  f'30 ÷ 9.81 = {sf(30 / 9.81)}, so about 3.1g', ['C1: ÷ g', 'C1: value'], aq='a/g')
M('M', 3, 'Why can an acceleration be given in "g"?', 'It compares the acceleration with that of free fall, 9.81 m s⁻²', ['g is the SI unit of acceleration', 'g means grams', 'Because forces are measured in g'], 'For example, pilots experience several g.', ['C1: ratio', 'C1: to 9.81 m s⁻²'])
N('M', 3, 'A pilot experiences 6.0g. Calculate this acceleration in m s⁻².', 6.0 * 9.81, 'm s⁻²',
  'a = 6.0 × 9.81 = 58.9 m s⁻²', ['C1: × 9.81', 'C1: value'], aq='a')
N('M', 3, 'A snail\'s speed increases by 1.2 mm s⁻¹ in 4.0 s. Calculate its acceleration in m s⁻², in units of 10⁻⁴ m s⁻².', 1.2e-3 / 4.0, '10⁻⁴ m s⁻²',
  'a = 1.2 × 10⁻³ ÷ 4.0 = 3.0 × 10⁻⁴ m s⁻²', ['C1: mm to m', 'C1: ÷ t'], sig=2, aq='a')
M('M', 3, 'A quantity is calculated as (velocity change) ÷ (time) × (time) ÷ (distance). What are its units?', 's⁻¹', ['m s⁻²', 'm', 'no unit'], '(m s⁻¹ ÷ s) × s ÷ m = s⁻¹.', ['C1: combine', 'C1: simplify'])
N('M', 3, 'In v² = u² + 2as, show that the units are consistent by finding the unit of 2as when a is in m s⁻² and s in m. Then calculate 2as for a = 3.0 m s⁻² and s = 24 m, in m² s⁻².', 2 * 3.0 * 24, 'm² s⁻²',
  '2as has units m s⁻² × m = m² s⁻², the same as v². 2as = 2 × 3.0 × 24 = 144 m² s⁻²', ['C1: units', 'C1: value'], aq='2as')
N('M', 3, 'A Formula 1 car brakes from 300 km h⁻¹ to 80 km h⁻¹ in 2.0 s. Calculate its deceleration in m s⁻².', (300 - 80) / 3.6 / 2.0, 'm s⁻²',
  f'Δv = (300 − 80) ÷ 3.6 = {sf(220 / 3.6, 4)} m s⁻¹; a = {sf(220 / 3.6, 4)} ÷ 2.0 = {sf(220 / 3.6 / 2)} m s⁻²', ['C1: Δv in m s⁻¹', 'C1: a'], aq='a')
N('M', 3, 'Express the Formula 1 braking deceleration of 30.6 m s⁻² in units of g (g = 9.81 m s⁻²).', 30.6 / 9.81, None,
  f'In units of g: 30.6 ÷ 9.81 = {sf(30.6 / 9.81)}', ['C1: ÷ g', 'C1: value'], aq='a/g')
M('M', 3, 'A student says the unit of acceleration is "m per s per s". Is this right?', 'Yes, m s⁻¹ s⁻¹ = m s⁻²', ['No, it is m per s', 'No, it is m s²', 'No, acceleration has no unit'], 'Velocity per unit time.', ['C1: equivalent', 'C1: reason'])
N('M', 3, 'A car manual gives a deceleration of 0.80g for emergency braking. Calculate the time to stop from 31 m s⁻¹.', 31 / (0.80 * 9.81), 's',
  f'a = 0.80 × 9.81 = {sf(0.8 * 9.81, 4)} m s⁻²; t = 31 ÷ {sf(0.8 * 9.81, 4)} = {sf(31 / (0.8 * 9.81))} s', ['C1: a in m s⁻²', 'C1: t'], aq='t')
N('M', 4, 'A space probe\'s ion engine produces an acceleration of 9.0 × 10⁻⁵ m s⁻². How long does it take to gain 1.0 km s⁻¹, in days?', 1000 / 9.0e-5 / 86400, 'days',
  f't = 1000 ÷ 9.0 × 10⁻⁵ = {sf(1000 / 9e-5, 4)} s. In days: {sf(1000 / 9e-5, 4)} ÷ 86 400 = {sf(1000 / 9e-5 / 86400)}', ['C1: km s⁻¹ to m s⁻¹', 'C1: time in s', 'C1: days'], aq='t')
M('M', 3, 'Which of these is a correct way to state the free-fall acceleration on the Moon?', '1.6 m s⁻²', ['1.6 m s⁻¹', '1.6 N', '1.6 kg'], 'An acceleration needs m s⁻² (or N kg⁻¹).', ['C1: m s⁻²', 'C1: others wrong'])
N('M', 3, 'An acceleration of 4.0 m s⁻² acts for 1 minute from rest. Calculate the speed reached, in km h⁻¹.', 4.0 * 60 * 3.6, 'km h⁻¹',
  'v = 4.0 × 60 = 240 m s⁻¹. In km h⁻¹: 240 × 3.6 = 864', ['C1: v = at', 'C1: × 3.6'], aq='v')
N('M', 3, 'An acceleration is 7.2 km h⁻¹ per minute. Express it in m s⁻², in units of 10⁻² m s⁻².', 7.2 / 3.6 / 60, '10⁻² m s⁻²',
  f'7.2 km h⁻¹ = 2.0 m s⁻¹; a = 2.0 ÷ 60 = {sf(2 / 60)} m s⁻²', ['C1: convert speed', 'C1: per minute to per second'], aq='a')
# hard
N('H', 5, 'A car accelerates from 0 to 60 miles per hour in 7.5 s (1 mile = 1609 m). (a) Convert 60 miles per hour to m s⁻¹. (b) Calculate the average acceleration in m s⁻².', 60 * 1609 / 3600 / 7.5, 'm s⁻²',
  f'(a) v = 60 × 1609 ÷ 3600 = {sf(60 * 1609 / 3600, 4)} m s⁻¹. (b) a = {sf(60 * 1609 / 3600, 4)} ÷ 7.5 = {sf(60 * 1609 / 3600 / 7.5)} m s⁻²',
  ['C1: miles to m', 'C1: h to s', 'M1: a = v/t', 'C1: value'], aq='a')
N('H', 6, 'An astronaut must not exceed 4.0g. A rocket reaches 7.8 km s⁻¹ from rest. (a) Calculate the maximum acceleration in m s⁻². (b) Calculate the minimum time to reach 7.8 km s⁻¹. (c) Give the answer to (b) in minutes.', 7800 / (4.0 * 9.81) / 60, 'min',
  f'(a) a = 4.0 × 9.81 = 39.2 m s⁻². (b) t = 7800 ÷ 39.24 = {sf(7800 / 39.24, 4)} s. (c) {sf(7800 / 39.24, 4)} ÷ 60 = {sf(7800 / 39.24 / 60)} min',
  ['C1: a', 'C1: km s⁻¹ to m s⁻¹', 'M1: t = v/a', 'C1: seconds', 'C1: minutes'], aq='t')
N('H', 5, 'Show that F/m has the units of acceleration, given that 1 N = 1 kg m s⁻². Then calculate the acceleration of a 1500 kg car pushed by a resultant force of 2700 N.', 2700 / 1500, 'm s⁻²',
  'Units: kg m s⁻² ÷ kg = m s⁻². a = 2700 ÷ 1500 = 1.8 m s⁻²',
  ['M1: base units of N', 'B1: cancels to m s⁻²', 'M1: a = F/m', 'C1: value'], sig=2, aq='a')
N('H', 6, 'A cyclist\'s speed rises from 18 km h⁻¹ to 36 km h⁻¹ in 0.25 minutes. (a) Convert the speeds to m s⁻¹. (b) Convert the time to s. (c) Calculate the acceleration in m s⁻².', (10 - 5) / 15, 'm s⁻²',
  f'(a) 5.0 m s⁻¹ and 10 m s⁻¹. (b) 0.25 × 60 = 15 s. (c) a = (10 − 5.0) ÷ 15 = {sf(5 / 15)} m s⁻²',
  ['C1: speeds', 'C1: time', 'M1: a = Δv/t', 'C1: substitution', 'C1: value'], aq='a')
N('H', 5, 'Light-gate data give a speed of 42 cm s⁻¹ and, 0.60 s later, 78 cm s⁻¹. (a) Calculate the acceleration in cm s⁻². (b) Express it in m s⁻².', 0.36 / 0.60, 'm s⁻²',
  '(a) a = (78 − 42) ÷ 0.60 = 60 cm s⁻². (b) 60 ÷ 100 = 0.60 m s⁻²',
  ['C1: Δv', 'C1: a in cm s⁻²', 'M1: ÷ 100', 'C1: value'], sig=2, aq='a')
N('H', 5, 'Using base units, show that √(2as) has the same units as velocity, and calculate √(2as) for a = 2.5 m s⁻² and s = 45 m.', sqrt(2 * 2.5 * 45), 'm s⁻¹',
  f'Units: √(m s⁻² × m) = √(m² s⁻²) = m s⁻¹. √(2 × 2.5 × 45) = {sf(sqrt(225))} m s⁻¹',
  ['M1: multiply units', 'B1: square root gives m s⁻¹', 'C1: substitution', 'C1: value'], sig=2, aq='v')
N('H', 6, 'A cheetah reaches 100 km h⁻¹ from rest in 3.0 s. A car reaches 100 km h⁻¹ in 4.5 s. (a) Convert 100 km h⁻¹ to m s⁻¹. (b) Calculate both accelerations. (c) Calculate the ratio cheetah ÷ car.', 4.5 / 3.0, None,
  f'(a) {sf(100 / 3.6, 4)} m s⁻¹. (b) {sf(100 / 3.6 / 3, 3)} m s⁻² and {sf(100 / 3.6 / 4.5, 3)} m s⁻². (c) Ratio = 4.5 ÷ 3.0 = 1.5',
  ['C1: conversion', 'C1: cheetah', 'C1: car', 'M1: ratio', 'C1: value'], sig=2, aq='ratio')
N('H', 5, 'Constant acceleration a for time t from rest gives speed v = at. (a) Show the units of at are m s⁻¹. (b) Find the time for a = 0.15 m s⁻² to give 54 km h⁻¹.', 15 / 0.15, 's',
  '(a) m s⁻² × s = m s⁻¹. (b) 54 km h⁻¹ = 15 m s⁻¹; t = 15 ÷ 0.15 = 100 s',
  ['B1: units', 'C1: convert speed', 'M1: t = v/a', 'C1: value'], sig=2, aq='t')
N('H', 5, 'A falling object\'s speed increases by 32 ft s⁻¹ every second, where 1 ft = 0.305 m. (a) Express the acceleration in m s⁻². (b) Calculate the percentage difference from 9.81 m s⁻².', abs(32 * 0.305 - 9.81) / 9.81 * 100, '%',
  f'(a) a = 32 × 0.305 = {sf(32 * 0.305, 3)} m s⁻². (b) % = (9.81 − {sf(32 * 0.305, 3)}) ÷ 9.81 × 100 = {sf((9.81 - 9.76) / 9.81 * 100, 2)} %',
  ['C1: ft to m', 'C1: value', 'M1: % difference', 'C1: value'], sig=2, aq='% difference')

N('E', 2, 'A cyclist\'s speed rises by 0.72 km h⁻¹ every second (0.72 km h⁻¹ s⁻¹). What is her acceleration in m s⁻²?', 0.72 / 3.6, 'm s⁻²',
  'a = 0.72 ÷ 3.6 = 0.20 m s⁻²', ['C1: ÷ 3.6'], sig=2, aq='a')
M('E', 1, 'Which is the largest acceleration: 1 m s⁻², 100 cm s⁻², 3.6 km h⁻¹ s⁻¹ or 2 N kg⁻¹?', '2 N kg⁻¹', ['1 m s⁻²', '100 cm s⁻²', '3.6 km h⁻¹ s⁻¹'], 'The first three all equal 1 m s⁻²; 2 N kg⁻¹ is 2 m s⁻².')
N('M', 3, 'A sports car is advertised as reaching 60 km h⁻¹ from rest in 3.0 s. Calculate its average acceleration in m s⁻².', 60 / 3.6 / 3.0, 'm s⁻²',
  f'v = 60 ÷ 3.6 = {sf(60 / 3.6, 4)} m s⁻¹; a = {sf(60 / 3.6, 4)} ÷ 3.0 = {sf(60 / 3.6 / 3)} m s⁻²', ['C1: convert', 'C1: a'], aq='a')
N('M', 3, 'The free-fall acceleration on the Moon is 1.6 m s⁻². Express it as a fraction of 9.81 m s⁻².', 1.6 / 9.81, None,
  f'Fraction = 1.6 ÷ 9.81 = {sf(1.6 / 9.81)}', ['C1: ratio', 'C1: value'], aq='fraction')
N('E', 2, 'A slow conveyor belt speeds up at 45 mm s⁻². Write this acceleration in m s⁻².', 0.045, 'm s⁻²',
  'a = 45 ÷ 1000 = 0.045 m s⁻²', ['C1: mm to m'], sig=2, aq='a')
N('M', 3, 'A roller coaster gives riders an acceleration of 3.5g. Express this in m s⁻².', 3.5 * 9.81, 'm s⁻²',
  'a = 3.5 × 9.81 = 34.3 m s⁻²', ['C1: × g', 'C1: value'], aq='a')
N('H', 5, 'A car accelerates at 2.5 m s⁻² for 12 s from rest. (a) Calculate its final speed in m s⁻¹. (b) Express this speed in km h⁻¹.', 2.5 * 12 * 3.6, 'km h⁻¹',
  '(a) v = 2.5 × 12 = 30 m s⁻¹. (b) 30 × 3.6 = 108 km h⁻¹', ['M1: v = at', 'C1: 30 m s⁻¹', 'M1: × 3.6', 'C1: value'], aq='v')
M('M', 3, 'Which value equals 1 cm s⁻²?', '0.01 m s⁻²', ['100 m s⁻²', '0.1 m s⁻²', '10 m s⁻²'], '1 cm = 0.01 m, so 1 cm s⁻² = 0.01 m s⁻².', ['C1: cm to m', 'C1: value'])

# ═════════════════════════ 2.4 Deducing acceleration (17/20/13) ═════════════════════════
lesson('2.4')
M('E', 1, 'What does the gradient of a velocity–time graph represent?', 'The acceleration', ['The displacement', 'The velocity', 'The distance'], 'Gradient = Δv/Δt, which is the acceleration.')
M('E', 1, 'A velocity–time graph is a horizontal line above the time axis. What does it show?', 'Constant velocity (zero acceleration)', ['The object is at rest', 'Constant acceleration', 'Increasing acceleration'], 'Zero gradient means zero acceleration.')
N('E', 2, 'A v–t graph rises in a straight line from 0 to 12 m s⁻¹ in 4.0 s. Calculate the acceleration.', 3.0, 'm s⁻²',
  'a = gradient = 12 ÷ 4.0 = 3.0 m s⁻²', ['C1: gradient'], sig=2, aq='a')
N('E', 2, 'A v–t graph falls in a straight line from 20 m s⁻¹ to 0 in 8.0 s. Calculate the acceleration.', -2.5, 'm s⁻²',
  'a = (0 − 20) ÷ 8.0 = −2.5 m s⁻²', ['C1: negative gradient'], sig=2, sign=True, aq='a')
M('E', 1, 'A v–t graph is a straight line sloping upwards. What does it show?', 'Uniform (constant) acceleration', ['Constant velocity', 'Increasing acceleration', 'Deceleration'], 'Constant gradient means constant acceleration.')
M('E', 1, 'A v–t graph slopes downwards towards the time axis. What does it show?', 'The object is decelerating (slowing down)', ['It is speeding up', 'It is at rest', 'It moves at constant velocity'], 'Negative gradient with positive v means slowing.')
N('E', 2, 'A v–t graph is a straight line from (0 s, 4.0 m s⁻¹) to (5.0 s, 14 m s⁻¹). Calculate the acceleration.', 2.0, 'm s⁻²',
  'a = (14 − 4.0) ÷ 5.0 = 2.0 m s⁻²', ['C1: Δv/Δt'], sig=2, aq='a')
M('E', 1, 'How is acceleration found from a curved v–t graph at a particular time?', 'By drawing a tangent and finding its gradient', ['By reading the value of v', 'By finding the area', 'By dividing v by t'], 'The gradient of the tangent gives instantaneous acceleration.')
N('E', 2, 'A v–t line for a falling stone goes from 0 at t = 0 to 29.4 m s⁻¹ at t = 3.0 s. Calculate its acceleration.', 9.8, 'm s⁻²',
  'a = 29.4 ÷ 3.0 = 9.8 m s⁻²', ['C1: gradient'], sig=2, aq='a')
M('E', 1, 'Two straight v–t lines start at the origin; line P is steeper than line Q. Which statement is correct?', 'P has the greater acceleration', ['Q has the greater acceleration', 'P has travelled less far', 'They have equal accelerations'], 'Steeper gradient means larger acceleration.')
N('E', 1, 'A cyclist\'s v–t graph rises steadily by 6.0 m s⁻¹ in 10 s. Calculate her acceleration.', 0.60, 'm s⁻²',
  'a = 6.0 ÷ 10 = 0.60 m s⁻²', [], sig=2, aq='a')
M('E', 1, 'A v–t graph curves, becoming less steep. What happens to the acceleration?', 'It decreases', ['It increases', 'It is constant', 'It is zero throughout'], 'The gradient, which is the acceleration, falls.')
N('E', 2, 'A train\'s v–t graph is a straight line from 30 m s⁻¹ at 10 s to 18 m s⁻¹ at 25 s. Calculate its acceleration.', -12 / 15, 'm s⁻²',
  'a = (18 − 30) ÷ (25 − 10) = −0.80 m s⁻²', ['C1: Δv/Δt'], sig=2, sign=True, aq='a')
M('E', 1, 'Where on a v–t graph is the object at rest?', 'Where the graph lies on the time axis (v = 0)', ['Where the graph is horizontal above the axis', 'Where the graph is steepest', 'Where the graph crosses the v axis'], 'v = 0 means at rest.')
N('E', 2, 'A lift\'s v–t graph rises from 0 to 2.4 m s⁻¹ in 3.0 s. Calculate the lift\'s acceleration.', 0.80, 'm s⁻²',
  'a = 2.4 ÷ 3.0 = 0.80 m s⁻²', ['C1: gradient'], sig=2, aq='a')
M('E', 1, 'A v–t graph crosses the time axis from positive to negative velocity in a straight line. What happens at the crossing?', 'The object stops momentarily and reverses', ['The acceleration becomes zero', 'The object speeds up', 'Nothing changes'], 'v changes sign; a is unchanged.')
N('E', 2, 'A toy car\'s v–t graph is a straight line through (1.0 s, 0.50 m s⁻¹) and (3.0 s, 1.70 m s⁻¹). Calculate its acceleration.', 1.2 / 2.0, 'm s⁻²',
  'a = (1.70 − 0.50) ÷ (3.0 − 1.0) = 0.60 m s⁻²', ['C1: gradient'], sig=2, aq='a')
# medium
N('M', 3, 'A v–t graph has three straight sections: 0 to 10 m s⁻¹ in 0–5.0 s; constant 10 m s⁻¹ for 5.0–12 s; 10 m s⁻¹ to 0 for 12–16 s. Calculate the acceleration in the last section.', -10 / 4.0, 'm s⁻²',
  'a = (0 − 10) ÷ (16 − 12) = −2.5 m s⁻²', ['C1: Δv', 'C1: Δt'], sig=2, sign=True, aq='a')
N('M', 3, 'A tangent to a curved v–t graph at t = 4.0 s passes through (1.0 s, 2.0 m s⁻¹) and (7.0 s, 14 m s⁻¹). Calculate the acceleration at 4.0 s.', 12 / 6.0, 'm s⁻²',
  'a = (14 − 2.0) ÷ (7.0 − 1.0) = 2.0 m s⁻²', ['C1: tangent gradient', 'C1: value'], sig=2, aq='a')
M('M', 3, 'A ball is thrown upwards and caught. Taking up as positive, what does its v–t graph look like?', 'A straight line sloping downwards, crossing the time axis at the top of the flight', ['A horizontal line', 'A V shape', 'A straight line sloping upwards'], 'Constant negative gradient −g throughout.', ['C1: straight, negative gradient', 'C1: crosses axis at top'])
N('M', 3, 'The v–t graph of a thrown ball is a straight line from +15 m s⁻¹ at t = 0 to −15 m s⁻¹ at t = 3.06 s. Calculate its gradient.', -30 / 3.06, 'm s⁻²',
  f'a = (−15 − 15) ÷ 3.06 = {sf(-30 / 3.06)} m s⁻²', ['C1: Δv = −30', 'C1: value'], sign=True, aq='a')
N('M', 3, 'A car\'s v–t graph is a straight line through (2.0 s, 8.0 m s⁻¹) and (8.0 s, 26 m s⁻¹). Find the velocity at t = 0.', 8.0 - 3.0 * 2.0, 'm s⁻¹',
  'a = (26 − 8.0) ÷ 6.0 = 3.0 m s⁻²; u = 8.0 − 3.0 × 2.0 = 2.0 m s⁻¹', ['C1: gradient', 'C1: extrapolate'], sig=2, aq='u')
M('M', 3, 'On a v–t graph for a skydiver, the curve flattens to a horizontal line. What is happening?', 'The acceleration falls to zero as she reaches terminal velocity', ['She stops', 'Her acceleration increases', 'She reaches the ground'], 'Zero gradient means zero acceleration.', ['C1: gradient decreasing', 'C1: terminal velocity'])
N('M', 3, 'Tangents to a skydiver\'s v–t curve have gradients 9.8 m s⁻² at t = 0 and 4.2 m s⁻² at t = 5.0 s. Calculate the average rate at which the acceleration decreases, in m s⁻³.', (9.8 - 4.2) / 5.0, 'm s⁻³',
  'Rate = (9.8 − 4.2) ÷ 5.0 = 1.12 m s⁻³', ['C1: Δa', 'C1: ÷ t'], aq='rate')
N('M', 3, 'Two cars start from rest together. Car A\'s v–t graph has gradient 2.0 m s⁻² and car B\'s 3.0 m s⁻². What is the difference in their speeds after 6.0 s?', 6.0, 'm s⁻¹',
  'Δv = (3.0 − 2.0) × 6.0 = 6.0 m s⁻¹', ['C1: v = at for each', 'C1: difference'], sig=2, aq='Δv')
M('M', 3, 'What does a v–t graph with a positive but decreasing gradient show about a car?', 'It is speeding up, but less and less quickly', ['It is slowing down', 'It has constant acceleration', 'It is moving backwards'], 'Positive gradient: speeding up; decreasing gradient: smaller acceleration.', ['C1: speeding up', 'C1: acceleration decreasing'])
N('M', 3, 'A v–t graph shows a bouncing ball (up positive) going from −6.0 m s⁻¹ to +4.5 m s⁻¹ in 0.030 s at the bounce. Calculate the average acceleration during the bounce.', 10.5 / 0.030, 'm s⁻²',
  'a = (4.5 − (−6.0)) ÷ 0.030 = 350 m s⁻²', ['C1: Δv = 10.5', 'C1: ÷ t'], sig=2, aq='a')
N('M', 3, 'A v–t graph rises from 0 to 8.0 m s⁻¹ in 4.0 s and then from 8.0 m s⁻¹ to 12 m s⁻¹ in the next 4.0 s (both straight). Calculate the change in acceleration between the two stages.', 2.0 - 1.0, 'm s⁻²',
  'a₁ = 8.0 ÷ 4.0 = 2.0 m s⁻²; a₂ = 4.0 ÷ 4.0 = 1.0 m s⁻²; change = 2.0 − 1.0 = 1.0 m s⁻²', ['C1: both gradients', 'C1: difference'], sig=2, aq='Δa')
M('M', 3, 'What is shown by a v–t graph that is a straight line passing through the origin?', 'Uniform acceleration from rest', ['Constant velocity', 'Uniform deceleration to rest', 'Increasing acceleration'], 'v = at: a constant gradient starting from rest.', ['C1: constant gradient', 'C1: starts at rest'])
N('M', 3, 'A v–t graph is a straight line from 25 m s⁻¹ at t = 0 with gradient −1.25 m s⁻². When does the object stop?', 25 / 1.25, 's',
  't = 25 ÷ 1.25 = 20 s', ['C1: v = 0', 'C1: t = u/|a|'], sig=2, aq='t')
N('M', 4, 'A tangent to a v–t curve at t = 10 s passes through (4.0 s, 0 m s⁻¹) and (16 s, 30 m s⁻¹). The velocity at 10 s is 17 m s⁻¹. Calculate the acceleration at 10 s, and state whether the tangent is above or below the curve point. Give the acceleration.', 30 / 12, 'm s⁻²',
  'a = (30 − 0) ÷ (16 − 4.0) = 2.5 m s⁻². The tangent at 10 s gives 15 m s⁻¹ there, below 17 m s⁻¹, so it was drawn wrongly or the reading is off.',
  ['M1: tangent gradient', 'C1: value', 'C1: check'], sig=2, aq='a')
M('M', 3, 'A v–t graph has negative velocity and a positive gradient. What is the object doing?', 'Moving in the negative direction and slowing down', ['Moving in the negative direction and speeding up', 'Moving in the positive direction and speeding up', 'At rest'], 'Acceleration opposes velocity.', ['C1: negative direction', 'C1: slowing'])
N('M', 3, 'A lift\'s v–t graph shows it slowing from 3.0 m s⁻¹ to rest in 2.0 s, taking up as positive. State the gradient of this section.', -1.5, 'm s⁻²',
  'a = (0 − 3.0) ÷ 2.0 = −1.5 m s⁻²', ['C1: Δv', 'C1: sign'], sig=2, sign=True, aq='a')
N('M', 3, 'A car\'s v–t graph rises from 5.0 m s⁻¹ to 17 m s⁻¹ in a straight line over 8.0 s. Calculate its velocity at the halfway time, 4.0 s.', 11, 'm s⁻¹',
  'a = 12 ÷ 8.0 = 1.5 m s⁻²; v = 5.0 + 1.5 × 4.0 = 11 m s⁻¹', ['C1: gradient', 'C1: value'], sig=2, aq='v')
# hard
N('H', 5, 'A v–t graph: 0 to 6.0 s rises from 0 to 18 m s⁻¹; 6.0 to 10 s constant; 10 to 13 s falls to 0 (all straight). (a) Calculate the acceleration in the first section. (b) Calculate the deceleration in the last section. (c) Calculate their ratio.', 3.0 / 6.0, None,
  '(a) a₁ = 18 ÷ 6.0 = 3.0 m s⁻². (b) a₃ = 18 ÷ 3.0 = 6.0 m s⁻². (c) Ratio a₁ ÷ a₃ = 3.0 ÷ 6.0 = 0.50',
  ['C1: a₁', 'C1: a₃', 'M1: ratio', 'C1: value'], sig=2, aq='ratio')
N('H', 6, 'A v–t curve for a car obeys v = 30(1 − e^(−t/10)) m s⁻¹. (a) Calculate v at t = 10 s and t = 12 s. (b) Estimate the acceleration at about 11 s from these. (c) State what happens to the acceleration as t increases.', 30 * (exp(-1) - exp(-1.2)) / 2, 'm s⁻²',
  f'(a) v(10) = 30 × (1 − e^(−1)) = {sf(30 * (1 - exp(-1)), 4)} m s⁻¹; v(12) = {sf(30 * (1 - exp(-1.2)), 4)} m s⁻¹. (b) a = ({sf(30 * (1 - exp(-1.2)), 4)} − {sf(30 * (1 - exp(-1)), 4)}) ÷ 2 = {sf(30 * (exp(-1) - exp(-1.2)) / 2)} m s⁻². (c) It falls towards zero.',
  ['C1: v(10)', 'C1: v(12)', 'M1: chord gradient', 'C1: value', 'B1: decreases to zero'], aq='a')
N('H', 5, 'A ball dropped from rest hits the ground at 8.0 m s⁻¹ after 0.82 s and rebounds at 6.0 m s⁻¹, rising for 0.61 s. Taking down as positive: (a) calculate the gradient while falling; (b) calculate the gradient while rising; (c) comment.', -6.0 / 0.61 * -1, 'm s⁻²',
  f'(a) 8.0 ÷ 0.82 = {sf(8 / 0.82)} m s⁻². (b) (0 − (−6.0)) ÷ 0.61 = {sf(6 / 0.61)} m s⁻². (c) Both are about g and in the same direction (down).',
  ['C1: falling gradient', 'M1: rising with signs', 'C1: value', 'B1: both ≈ g'], aq='a')
N('H', 6, 'Two trains pass on parallel tracks at t = 0. Train X\'s v–t graph is constant at 20 m s⁻¹. Train Y\'s rises from 8.0 m s⁻¹ with gradient 0.60 m s⁻². (a) Write v for each train. (b) Calculate when they have equal velocities. (c) State the gradient of X\'s graph.', 12 / 0.60, 's',
  '(a) v_X = 20; v_Y = 8.0 + 0.60t. (b) 8.0 + 0.60t = 20 gives t = 12 ÷ 0.60 = 20 s. (c) Zero.',
  ['B1: equations', 'M1: equate', 'C1: rearrange', 'C1: value', 'B1: zero gradient'], sig=2, aq='t')
N('H', 5, 'A cyclist\'s v–t graph rises from 2.0 m s⁻¹ to 8.0 m s⁻¹ in 4.0 s, stays constant for 6.0 s, and falls to 5.0 m s⁻¹ in 3.0 s. (a) Calculate both accelerations. (b) Calculate the average acceleration over the 13 s.', 3.0 / 13, 'm s⁻²',
  f'(a) (8.0 − 2.0) ÷ 4.0 = 1.5 m s⁻²; (5.0 − 8.0) ÷ 3.0 = −1.0 m s⁻². (b) (5.0 − 2.0) ÷ 13 = {sf(3 / 13)} m s⁻²',
  ['C1: first', 'C1: last', 'M1: overall Δv/Δt', 'C1: value'], aq='a')
N('H', 5, 'For a falling sphere in oil, tangents to its v–t curve give 5.0 m s⁻² at 0.10 s and 1.0 m s⁻² at 0.40 s, while v = 0.38 m s⁻¹ and 0.60 m s⁻¹ there. (a) Explain why the gradient decreases. (b) Calculate the average acceleration between 0.10 s and 0.40 s.', (0.60 - 0.38) / 0.30, 'm s⁻²',
  f'(a) Drag increases with speed, so the resultant force falls. (b) a = (0.60 − 0.38) ÷ (0.40 − 0.10) = {sf(0.22 / 0.3)} m s⁻²',
  ['B1: drag increases', 'B1: resultant force decreases', 'M1: chord Δv/Δt', 'C1: value'], aq='a')
N('H', 6, 'A v–t graph for a lift (up positive): 0–2.0 s rises to 2.5 m s⁻¹; 2.0–8.0 s constant; 8.0–10.5 s falls to 0. (a) Calculate each acceleration. (b) State the acceleration from 2.0 s to 8.0 s. (c) Calculate the ratio of the largest to smallest non-zero magnitudes.', (2.5 / 2.0) / (2.5 / 2.5), None,
  '(a) 2.5 ÷ 2.0 = 1.25 m s⁻²; (0 − 2.5) ÷ 2.5 = −1.0 m s⁻². (b) Zero. (c) 1.25 ÷ 1.0 = 1.25',
  ['C1: first', 'C1: last', 'B1: zero', 'M1: ratio', 'C1: value'], aq='ratio')
N('H', 5, 'A rocket\'s v–t graph is a straight line from 0 to 400 m s⁻¹ in 20 s, then a straight line falling with gradient −9.81 m s⁻². (a) Calculate the gradient of the first part. (b) Calculate the time after burnout at which the graph reaches v = 0.', 400 / 9.81, 's',
  f'(a) 400 ÷ 20 = 20 m s⁻². (b) t = 400 ÷ 9.81 = {sf(400 / 9.81)} s',
  ['C1: gradient', 'C1: value', 'M1: t = v/g', 'C1: value'], aq='t')

N('E', 2, 'At t = 0 a scooter moves at 2.0 m s⁻¹; its v–t graph rises steadily to 10 m s⁻¹ at t = 4.0 s. Find its acceleration.', 2.0, 'm s⁻²',
  'a = (10 − 2.0) ÷ 4.0 = 2.0 m s⁻²', ['C1: gradient'], sig=2, aq='a')
N('E', 2, 'A swimmer\'s v–t graph falls steadily from 1.8 m s⁻¹ to 1.2 m s⁻¹ over 3.0 s. Calculate her acceleration.', -0.20, 'm s⁻²',
  'a = (1.2 − 1.8) ÷ 3.0 = −0.20 m s⁻²', ['C1: negative gradient'], sig=2, sign=True, aq='a')
N('M', 3, 'A trolley\'s velocity is recorded: t/s = 0, 1.0, 2.0, 3.0, 4.0 and v/m s⁻¹ = 0, 2.5, 5.0, 7.5, 10. Plotting v against t, calculate the acceleration.', 2.5, 'm s⁻²',
  'Gradient = (10 − 0) ÷ (4.0 − 0) = 2.5 m s⁻²', ['C1: straight line', 'C1: gradient'], sig=2, aq='a')
N('M', 3, 'An object\'s velocity is given by v = 12 − 3.0t (v in m s⁻¹, t in s). State the gradient of its v–t graph.', -3.0, 'm s⁻²',
  'Gradient = coefficient of t = −3.0 × 1 = −3.0 m s⁻²', ['C1: compare with v = u + at', 'C1: value'], sig=2, sign=True, aq='a')
M('M', 3, 'Which v–t graph shape shows an object whose acceleration is increasing?', 'A curve that gets steeper with time', ['A straight sloping line', 'A curve that levels off', 'A horizontal line'], 'Increasing gradient means increasing acceleration.', ['C1: gradient = a', 'C1: steeper'])
M('E', 1, 'A car\'s v–t graph is horizontal at 15 m s⁻¹ for 10 s. What is its acceleration during this time?', 'Zero', ['15 m s⁻²', '1.5 m s⁻²', '150 m s⁻²'], 'A horizontal line has zero gradient.')
N('H', 5, 'Readings for a car: t/s = 0, 2.0, 4.0, 6.0 and v/m s⁻¹ = 1.0, 4.0, 9.0, 16. (a) Show that the acceleration is not constant. (b) Calculate the average acceleration between 2.0 s and 6.0 s.', 12 / 4.0, 'm s⁻²',
  '(a) The changes in v over each 2.0 s are 3.0, 5.0 and 7.0 m s⁻¹, so not equal. (b) a = (16 − 4.0) ÷ (6.0 − 2.0) = 3.0 m s⁻²', ['C1: unequal changes', 'B1: not constant', 'M1: chord gradient', 'C1: value'], sig=2, aq='a')
N('M', 3, 'The gradient of a curved v–t graph at 3.0 s is found by drawing a tangent, which crosses the v axis at 1.0 m s⁻¹ and reaches 13 m s⁻¹ at 6.0 s. What is the acceleration?', 12 / 6.0, 'm s⁻²',
  'a = (13 − 1.0) ÷ (6.0 − 0) = 2.0 m s⁻²', ['C1: tangent points', 'C1: gradient'], sig=2, aq='a')
N('M', 3, 'A bouncing ball\'s v–t graph has a gradient of −9.81 m s⁻² while it is in the air (up positive). It leaves the floor at 7.0 m s⁻¹. How long until it reaches the top?', 7.0 / 9.81, 's',
  f't = 7.0 ÷ 9.81 = {sf(7 / 9.81)} s', ['C1: v = 0 at top', 'C1: t = u/g'], aq='t')
N('E', 2, 'The v–t graph of a falling apple rises by 4.9 m s⁻¹ in 0.50 s. Calculate its acceleration.', 9.8, 'm s⁻²',
  'a = 4.9 ÷ 0.50 = 9.8 m s⁻²', ['C1: gradient'], sig=2, aq='a')

# ═════════════════════════ 2.5 Deducing displacement (17/20/13) ═════════════════════════
lesson('2.5')
M('E', 1, 'What does the area under a velocity–time graph represent?', 'The displacement', ['The acceleration', 'The velocity', 'The time'], 'Area = velocity × time.')
N('E', 2, 'A v–t graph is a horizontal line at 12 m s⁻¹ from 0 to 5.0 s. Calculate the displacement.', 60, 'm',
  's = area = 12 × 5.0 = 60 m', ['C1: rectangle area'], sig=2, aq='s')
N('E', 2, 'A v–t graph rises in a straight line from 0 to 10 m s⁻¹ in 4.0 s. Calculate the displacement.', 20, 'm',
  's = area of triangle = 0.5 × 10 × 4.0 = 20 m', ['C1: triangle area'], sig=2, aq='s')
N('E', 2, 'Over 6.0 s a cyclist\'s speed increases steadily from 4.0 m s⁻¹ to 10 m s⁻¹. Use the area under her v–t graph to find how far she travels.', 42, 'm',
  's = area of trapezium = (4.0 + 10) ÷ 2 × 6.0 = 42 m', ['C1: trapezium'], sig=2, aq='s')
M('E', 1, 'Which feature of a v–t graph gives the distance travelled when the velocity is always positive?', 'The area between the graph and the time axis', ['The gradient', 'The intercept', 'The highest point'], 'Area = displacement = distance here.')
N('E', 2, 'A car decelerates uniformly from 16 m s⁻¹ to rest in 5.0 s. Using the area under its v–t graph, calculate the braking distance.', 40, 'm',
  's = 0.5 × 16 × 5.0 = 40 m', ['C1: triangle'], sig=2, aq='s')
M('E', 1, 'What is the unit of area under a v–t graph?', 'm', ['m s⁻¹', 'm s⁻²', 's'], 'Area = (m s⁻¹) × s, which gives metres.')
N('E', 2, 'A runner\'s v–t graph is constant at 5.5 m s⁻¹ for 20 s. Calculate the distance run.', 110, 'm',
  's = 5.5 × 20 = 110 m', ['C1: v × t'], sig=2, aq='s')
N('E', 2, 'A ball rolls from rest with uniform acceleration, reaching 3.0 m s⁻¹ after 2.0 s. Calculate the distance rolled using the area under the v–t graph.', 3.0, 'm',
  's = 0.5 × 3.0 × 2.0 = 3.0 m', ['C1: triangle'], sig=2, aq='s')
M('E', 1, 'A v–t graph has a section below the time axis. What does the area of that section represent?', 'Displacement in the negative direction', ['Negative time', 'Negative acceleration only', 'No motion'], 'Areas below the axis count as negative displacement.')
N('E', 1, 'A trolley moves at 0.40 m s⁻¹ for 8.0 s. Calculate the displacement from its v–t graph.', 3.2, 'm',
  's = 0.40 × 8.0 = 3.2 m', [], sig=2, aq='s')
M('E', 1, 'Two v–t graphs cover the same time. Which object travels further?', 'The one with the larger area under its graph', ['The one with the steeper graph', 'The one with the higher starting velocity', 'The one that ends at rest'], 'Area gives displacement.')
N('E', 2, 'A lift\'s v–t graph is a rectangle 2.0 m s⁻¹ high and 6.0 s long. Calculate how far it rises.', 12, 'm',
  's = 2.0 × 6.0 = 12 m', ['C1: rectangle'], sig=2, aq='s')
N('E', 2, 'A cyclist accelerates uniformly from 2.0 m s⁻¹ to 6.0 m s⁻¹ in 5.0 s. Calculate the distance from the area under the v–t graph.', 20, 'm',
  's = (2.0 + 6.0) ÷ 2 × 5.0 = 20 m', ['C1: trapezium'], sig=2, aq='s')
M('E', 1, 'A v–t graph is curved. How can the area under it be estimated?', 'By counting squares under the curve', ['By measuring the gradient', 'By reading the maximum value', 'By multiplying the final velocity by the time'], 'Each square represents a known displacement.')
N('E', 2, 'On a v–t graph each square represents 1.0 m s⁻¹ by 0.5 s. What displacement does one square represent?', 0.5, 'm',
  'Area of one square = 1.0 × 0.5 = 0.5 m', ['C1: v × t for a square'], sig=1, aq='s')
N('E', 2, 'A curved v–t graph encloses about 46 squares, each worth 0.5 m. Estimate the displacement.', 23, 'm',
  'Estimate: s = 46 × 0.5 = 23 m', ['C1: squares × value'], sig=2, aq='s')
# medium
N('M', 3, 'A car\'s v–t graph rises from 0 to 15 m s⁻¹ in 5.0 s, stays at 15 m s⁻¹ for 10 s and falls to 0 in 3.0 s. Calculate the total displacement.', 0.5 * 15 * 5 + 15 * 10 + 0.5 * 15 * 3, 'm',
  's = 0.5 × 15 × 5.0 + 15 × 10 + 0.5 × 15 × 3.0 = 210 m', ['C1: three areas', 'C1: sum'], sig=2, aq='s')
N('M', 3, 'For the same journey (0–15 m s⁻¹ in 5.0 s, 10 s at 15 m s⁻¹, 3.0 s to stop), calculate the average speed.', 210 / 18, 'm s⁻¹',
  'v = 210 ÷ 18 = 11.7 m s⁻¹', ['C1: total distance', 'C1: ÷ 18 s'], aq='v')
N('M', 3, 'A ball thrown up at 12 m s⁻¹ has a straight-line v–t graph reaching 0 at 1.22 s. Calculate the maximum height from the area.', 0.5 * 12 * 1.22, 'm',
  's = 0.5 × 12 × 1.22 = 7.32 m', ['C1: triangle', 'C1: value'], aq='h')
M('M', 3, 'A v–t graph for a thrown ball (up positive) has equal areas above and below the time axis. What does this show?', 'The ball returns to its starting height (zero displacement)', ['The ball travels zero distance', 'The ball stops in mid-air', 'The ball rises twice as far as it falls'], 'Net area = displacement.', ['C1: equal and opposite areas', 'C1: zero displacement'])
N('M', 3, 'A v–t graph (up positive) goes from +8.0 m s⁻¹ to −12 m s⁻¹ in a straight line over 2.04 s, crossing zero at 0.816 s. Calculate the displacement at 2.04 s.', 0.5 * 8 * 0.816 - 0.5 * 12 * (2.04 - 0.816), 'm',
  's = 0.5 × 8.0 × 0.816 − 0.5 × 12 × (2.04 − 0.816) = −4.08 m', ['C1: area above', 'C1: area below subtracted'], sign=True, aq='s')
N('M', 3, 'For that ball (from +8.0 m s⁻¹ to −12 m s⁻¹, crossing zero at 0.816 s, ending at 2.04 s), calculate the distance travelled.', 0.5 * 8 * 0.816 + 0.5 * 12 * (2.04 - 0.816), 'm',
  'd = 0.5 × 8.0 × 0.816 + 0.5 × 12 × 1.224 = 10.6 m', ['C1: both areas positive', 'C1: sum'], aq='d')
N('M', 4, 'A train accelerates uniformly from rest to 24 m s⁻¹ in 40 s, then travels at 24 m s⁻¹. How long after starting has it travelled 1200 m?', 40 + (1200 - 0.5 * 24 * 40) / 24, 's',
  'First 40 s: 0.5 × 24 × 40 = 480 m. Remaining 1200 − 480 = 720 m at 24 m s⁻¹ takes 720 ÷ 24 = 30 s. Total = 40 + 30 = 70 s', ['C1: area first stage', 'M1: remaining distance', 'C1: total time'], sig=2, aq='t')
M('M', 3, 'Why is the area under a v–t graph equal to the displacement?', 'For each short interval, Δs = vΔt, which is the area of a thin strip; adding all strips gives the total', ['Because area always equals distance', 'Because v = s × t', 'Because the gradient is the acceleration'], 'Area = sum of v Δt over all the strips.', ['C1: strip area vΔt', 'C1: sum'])
N('M', 3, 'A sprinter accelerates uniformly from rest to 10 m s⁻¹ in 4.0 s, then runs at 10 m s⁻¹. Calculate the distance covered in the first 10 s.', 0.5 * 10 * 4 + 10 * 6, 'm',
  's = 0.5 × 10 × 4.0 + 10 × 6.0 = 80 m', ['C1: triangle', 'C1: rectangle'], sig=2, aq='s')
N('M', 3, 'A car at 20 m s⁻¹ brakes after a reaction time of 0.60 s, stopping uniformly in a further 4.0 s. Calculate the stopping distance using the v–t graph.', 20 * 0.60 + 0.5 * 20 * 4.0, 'm',
  's = 20 × 0.60 + 0.5 × 20 × 4.0 = 52 m', ['C1: thinking distance', 'C1: braking area'], sig=2, aq='s')
N('M', 3, 'A v–t graph rises in a straight line from 6.0 m s⁻¹ to 18 m s⁻¹ over 8.0 s. Calculate the average velocity.', 12, 'm s⁻¹',
  's = (6.0 + 18) ÷ 2 × 8.0 = 96 m; average v = 96 ÷ 8.0 = 12 m s⁻¹', ['C1: area', 'C1: ÷ time'], sig=2, aq='v')
M('M', 3, 'For uniform acceleration, why is the average velocity (u + v)/2?', 'The v–t graph is a straight line, so the area equals the mean of u and v times t', ['Because velocity is a vector', 'Because the acceleration is zero', 'It is true for any motion'], 'The trapezium area is ½(u + v)t.', ['C1: straight line', 'C1: trapezium'])
N('M', 3, 'Each large square on a v–t graph is 5.0 m s⁻¹ by 2.0 s. The area under a curve is about 13.5 large squares. Estimate the displacement.', 13.5 * 10, 'm',
  'One square = 5.0 × 2.0 = 10 m; s = 13.5 × 10 = 135 m', ['C1: square value', 'C1: total'], aq='s')
N('M', 3, 'A lift (up positive) rises at 2.0 m s⁻¹ for 12 s, waits for 5.0 s, then descends at 2.5 m s⁻¹ for 6.0 s (ignore acceleration times). Calculate its final displacement.', 2.0 * 12 - 2.5 * 6.0, 'm',
  's = 2.0 × 12 − 2.5 × 6.0 = 9.0 m above the start', ['C1: up area', 'C1: down area subtracted'], sig=2, aq='s')
N('M', 3, 'Using the area under a v–t graph, calculate the displacement of an object that moves from 3.0 m s⁻¹ to 9.0 m s⁻¹ with uniform acceleration 1.5 m s⁻².', (3 + 9) / 2 * (6 / 1.5), 'm',
  't = (9.0 − 3.0) ÷ 1.5 = 4.0 s; s = (3.0 + 9.0) ÷ 2 × 4.0 = 24 m', ['C1: time from gradient', 'C1: area'], sig=2, aq='s')
N('M', 4, 'A cyclist rides at 8.0 m s⁻¹ for 30 s, slows uniformly to 4.0 m s⁻¹ in 10 s and rides at 4.0 m s⁻¹ for 20 s. Calculate the total distance.', 8 * 30 + 6 * 10 + 4 * 20, 'm',
  's = 8.0 × 30 + (8.0 + 4.0) ÷ 2 × 10 + 4.0 × 20 = 380 m', ['C1: first rectangle', 'C1: trapezium', 'C1: second rectangle'], sig=2, aq='s')
M('M', 3, 'A curved v–t graph rises from 0. Which estimate of displacement is better: counting squares or using a single triangle from the origin to the end point?', 'Counting squares, because the triangle ignores the curvature', ['The triangle is always exact', 'They are always equal', 'Neither can work'], 'Counting squares follows the real curve.', ['C1: curve ≠ straight line', 'C1: squares more accurate'])
N('M', 3, 'A car moving at 30 m s⁻¹ decelerates uniformly at 2.0 m s⁻² to rest. Find the stopping distance from the area under its v–t graph.', 0.5 * 30 * 15, 'm',
  't = 30 ÷ 2.0 = 15 s; s = 0.5 × 30 × 15 = 225 m', ['C1: time to stop', 'C1: triangle area'], aq='s')
# hard
N('H', 5, 'A car accelerates uniformly from rest to 20 m s⁻¹ in 8.0 s, travels at 20 m s⁻¹ for 30 s, then decelerates uniformly to rest in 5.0 s. (a) Calculate the total distance. (b) Calculate the average speed.', (0.5 * 20 * 8 + 20 * 30 + 0.5 * 20 * 5) / 43, 'm s⁻¹',
  f'(a) s = 0.5 × 20 × 8.0 + 20 × 30 + 0.5 × 20 × 5.0 = 730 m. (b) v = 730 ÷ 43 = {sf(730 / 43)} m s⁻¹',
  ['C1: triangle areas', 'C1: rectangle', 'C1: total', 'M1: ÷ total time'], aq='v')
N('H', 6, 'A ball is thrown up at 14 m s⁻¹ from the edge of a cliff and lands at the bottom moving at 26 m s⁻¹ (up positive; g = 9.81 m s⁻²). (a) Calculate the time to the top. (b) Calculate the total time of flight. (c) Use areas under the v–t graph to find the cliff height.', 0.5 * 26 * (26 / 9.81) - 0.5 * 14 * (14 / 9.81), 'm',
  f'(a) 14 ÷ 9.81 = {sf(14 / 9.81, 4)} s. (b) Total = (14 + 26) ÷ 9.81 = {sf(40 / 9.81, 4)} s. (c) Area below − area above = 0.5 × 26 × {sf(26 / 9.81, 4)} − 0.5 × 14 × {sf(14 / 9.81, 4)} = {sf(0.5 * 26 * 26 / 9.81 - 0.5 * 14 * 14 / 9.81)} m',
  ['C1: time up', 'C1: total time', 'M1: area above', 'M1: net area', 'C1: value'], aq='h')
N('H', 5, 'Car P starts from rest with acceleration 2.0 m s⁻². At the same moment car Q passes it at a steady 12 m s⁻¹. (a) Using v–t graphs, explain why P is furthest behind when their velocities are equal. (b) Calculate that greatest separation.', 12 * 6.0 - 0.5 * 2.0 * 36, 'm',
  '(a) Until then Q is faster, so the gap grows; afterwards it shrinks. Equal at t = 12 ÷ 2.0 = 6.0 s. (b) Gap = 12 × 6.0 − 0.5 × 2.0 × 6.0² = 36 m',
  ['B1: equal velocities', 'C1: t = 6.0 s', 'M1: difference of areas', 'C1: value'], sig=2, aq='Δs')
N('H', 6, 'A lift (up positive) accelerates from rest at 1.0 m s⁻² for 3.0 s, moves at constant speed for 10 s and decelerates at 1.5 m s⁻² to rest. (a) Calculate the maximum speed. (b) Calculate the braking time. (c) Calculate the height risen from the v–t graph.', 0.5 * 3 * 3 + 3 * 10 + 0.5 * 3 * 2, 'm',
  '(a) v = 1.0 × 3.0 = 3.0 m s⁻¹. (b) t = 3.0 ÷ 1.5 = 2.0 s. (c) h = 0.5 × 3.0 × 3.0 + 3.0 × 10 + 0.5 × 3.0 × 2.0 = 37.5 m',
  ['C1: speed', 'C1: braking time', 'M1: sum of areas', 'C1: substitution', 'C1: value'], aq='h')
N('H', 5, 'A sprinter\'s v–t graph rises linearly from 0 to 11 m s⁻¹ in 4.5 s and stays at 11 m s⁻¹. (a) Calculate the distance in the first 4.5 s. (b) Calculate the time to complete 100 m.', 4.5 + (100 - 0.5 * 11 * 4.5) / 11, 's',
  f'(a) 0.5 × 11 × 4.5 = 24.75 m. (b) Remaining 75.25 m at 11 m s⁻¹ takes {sf(75.25 / 11, 4)} s; total = 4.5 + {sf(75.25 / 11, 4)} = {sf(4.5 + 75.25 / 11)} s',
  ['C1: triangle area', 'M1: remaining distance', 'C1: time at constant speed', 'C1: total'], aq='t')
N('H', 6, 'A train must travel 2.0 km between stations, accelerating uniformly at 0.50 m s⁻² to 20 m s⁻¹, cruising, then braking uniformly at 1.0 m s⁻². (a) Calculate the accelerating and braking distances. (b) Calculate the cruising time. (c) Calculate the total time.', 40 + (2000 - 400 - 200) / 20 + 20, 's',
  '(a) 0.5 × 20 × 40 = 400 m (40 s); 0.5 × 20 × 20 = 200 m (20 s). (b) (2000 − 400 − 200) ÷ 20 = 70 s. (c) 40 + 70 + 20 = 130 s',
  ['C1: accelerating distance', 'C1: braking distance', 'M1: remaining at 20 m s⁻¹', 'C1: cruise time', 'C1: total'], sig=2, aq='t')
N('H', 5, 'A ball dropped from rest falls for 0.60 s, bounces and rises for 0.40 s, taking down as positive with g = 9.81 m s⁻². (a) Calculate the speeds at impact and just after the bounce. (b) Calculate the net displacement after the 1.0 s (ignore the bounce time).', 0.5 * 9.81 * 0.6 ** 2 - 0.5 * 9.81 * 0.4 ** 2, 'm',
  f'(a) 9.81 × 0.60 = {sf(9.81 * 0.6, 3)} m s⁻¹; 9.81 × 0.40 = {sf(9.81 * 0.4, 3)} m s⁻¹. (b) s = 0.5 × 9.81 × 0.60² − 0.5 × 9.81 × 0.40² = {sf(0.5 * 9.81 * (0.36 - 0.16))} m below the release point',
  ['C1: impact speed', 'C1: rebound speed', 'M1: net area', 'C1: value'], aq='s')
N('H', 6, 'The v–t graph of a car is v = 3t (m s⁻¹) for 0 ≤ t ≤ 6.0 s, then v = 18 m s⁻¹. (a) Calculate the displacement at 6.0 s. (b) Calculate the displacement at 15 s. (c) Calculate the average velocity over 15 s.', (0.5 * 18 * 6 + 18 * 9) / 15, 'm s⁻¹',
  '(a) 0.5 × 18 × 6.0 = 54 m. (b) 54 + 18 × 9.0 = 216 m. (c) 216 ÷ 15 = 14.4 m s⁻¹',
  ['C1: triangle', 'C1: rectangle', 'C1: total', 'M1: ÷ time', 'C1: value'], aq='v')
N('H', 5, 'A car travelling at 25 m s⁻¹ sees an obstacle 60 m ahead. The driver reacts in 0.50 s and brakes at 7.0 m s⁻². (a) Calculate the thinking distance. (b) Calculate the braking distance. (c) Decide whether the car stops in time; give the stopping distance.', 25 * 0.5 + 25 ** 2 / (2 * 7.0), 'm',
  f'(a) 25 × 0.50 = 12.5 m. (b) t = 25 ÷ 7.0 = {sf(25 / 7, 4)} s; area = 0.5 × 25 × {sf(25 / 7, 4)} = {sf(0.5 * 25 * 25 / 7, 4)} m. (c) Total = 12.5 + {sf(0.5 * 25 * 25 / 7, 4)} = {sf(12.5 + 0.5 * 625 / 7)} m, more than 60 m, so it does not stop in time.',
  ['C1: thinking', 'C1: braking', 'C1: total', 'B1: conclusion'], aq='s')
N('E', 2, 'A walker moves at a steady 1.4 m s⁻¹ for 3.0 minutes. Use the area under the v–t graph to find the distance walked.', 1.4 * 180, 'm',
  's = 1.4 × 180 = 252 m', ['C1: time in s'], aq='s')
N('M', 3, 'A v–t graph rises in a straight line from 0 to 8.0 m s⁻¹ in 4.0 s and then falls in a straight line to 0 in the next 6.0 s. Calculate the displacement.', 0.5 * 8 * 10, 'm',
  's = 0.5 × 8.0 × (4.0 + 6.0) = 40 m', ['C1: one triangle of base 10 s', 'C1: value'], sig=2, aq='s')
N('M', 3, 'A trolley\'s speed readings are t/s = 0, 1.0, 2.0, 3.0, 4.0 and v/m s⁻¹ = 0, 2.0, 4.0, 6.0, 8.0. Use the area under the v–t graph to find the displacement in the 4.0 s.', 0.5 * 8 * 4, 'm',
  's = 0.5 × 8.0 × 4.0 = 16 m', ['C1: straight line from origin', 'C1: triangle area'], sig=2, aq='s')
N('E', 2, 'A train decelerates uniformly from 25 m s⁻¹ to 15 m s⁻¹ in 20 s. Calculate the distance it covers in that time.', 20 * 20, 'm',
  's = (25 + 15) ÷ 2 × 20 = 400 m', ['C1: trapezium'], sig=2, aq='s')
N('M', 3, 'An object\'s velocity is v = 2.0 + 1.5t (m s⁻¹) for 0 ≤ t ≤ 6.0 s. Calculate the displacement in the 6.0 s from the area under its v–t graph.', (2 + 11) / 2 * 6, 'm',
  'v(6.0) = 2.0 + 1.5 × 6.0 = 11 m s⁻¹; s = (2.0 + 11) ÷ 2 × 6.0 = 39 m', ['C1: final velocity', 'C1: trapezium'], sig=2, aq='s')
N('H', 5, 'Cyclist A starts from rest, accelerates at 1.0 m s⁻² for 10 s and then rides at constant speed. Cyclist B rides at a steady 8.0 m s⁻¹ from the same start at the same time. (a) Find the displacement of each after 20 s. (b) Calculate how far B is ahead.', 160 - 150, 'm',
  '(a) A: 0.5 × 10 × 10 + 10 × 10 = 150 m; B: 8.0 × 20 = 160 m. (b) 160 − 150 = 10 m', ['C1: A', 'C1: B', 'M1: difference', 'C1: value'], sig=2, aq='Δs')
M('M', 3, 'A v–t graph returns to zero velocity. The area above the time axis is 30 m and below it is 10 m. What are the displacement and the distance travelled?', 'Displacement 20 m; distance 40 m', ['Displacement 40 m; distance 20 m', 'Both 40 m', 'Both 20 m'], 'Displacement = 30 − 10; distance = 30 + 10.', ['C1: net area', 'C1: total area'])
N('E', 2, 'An escalator carries a passenger at a steady 0.75 m s⁻¹ for 40 s. Find the distance travelled from the area under the v–t graph.', 30, 'm',
  's = 0.75 × 40 = 30 m', ['C1: rectangle'], sig=2, aq='s')
N('M', 3, 'A ball accelerates uniformly at 2.0 m s⁻² from 1.0 m s⁻¹ for 3.0 s. Use the area under its v–t graph to calculate the displacement.', 1.0 * 3 + 0.5 * 2.0 * 9, 'm',
  'v = 1.0 + 2.0 × 3.0 = 7.0 m s⁻¹; s = (1.0 + 7.0) ÷ 2 × 3.0 = 12 m', ['C1: final velocity', 'C1: trapezium'], sig=2, aq='s')
