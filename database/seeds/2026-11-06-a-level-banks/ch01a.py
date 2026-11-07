# Chapter 1 Kinematics: describing motion, 1.1 to 1.4.

# ═════════════════════════ 1.1 Speed (17/20/13) ═════════════════════════
lesson('1.1')
N('E', 2, 'A cyclist travels 4.8 km in 12 minutes. Calculate her average speed in m s⁻¹.', 4800 / (12 * 60), 'm s⁻¹',
  'v = 4800 ÷ (12 × 60) = 6.7 m s⁻¹', ['C1: km to m and min to s'], sig=2, aq='v')
M('E', 1, 'Which equation defines average speed?', 'Average speed = total distance travelled ÷ total time taken', ['Average speed = displacement × time', 'Average speed = time ÷ distance', 'Average speed = final speed ÷ 2'], 'Speed is the rate of covering distance.')
N('E', 2, 'Convert a speed of 72 km h⁻¹ into m s⁻¹.', 72 * 1000 / 3600, 'm s⁻¹',
  'v = 72 × 1000 ÷ 3600 = 20 m s⁻¹', ['C1: × 1000 ÷ 3600'], sig=2, aq='v')
N('E', 2, 'A sprinter runs 100 m in 10.4 s. Calculate the average speed.', 100 / 10.4, 'm s⁻¹',
  'v = 100 ÷ 10.4 = 9.62 m s⁻¹', ['C1: v = d/t'], aq='v')
M('E', 1, 'What is the SI unit of speed?', 'm s⁻¹', ['km h⁻¹', 'm s⁻²', 'm'], 'Metres per second, written m s⁻¹.')
N('E', 2, 'A snail crawls at 1.5 mm s⁻¹. How far does it crawl in 5.0 minutes, in metres?', 1.5e-3 * 300, 'm',
  'd = 1.5 × 10⁻³ × 300 = 0.45 m', ['C1: mm to m, min to s'], sig=2, aq='d')
N('E', 2, 'Convert 15 m s⁻¹ into km h⁻¹.', 15 * 3.6, 'km h⁻¹',
  'v = 15 × 3600 ÷ 1000 = 54 km h⁻¹', ['C1: × 3.6'], sig=2, aq='v')
M('E', 1, 'A car\'s speedometer reads 50 km h⁻¹. What does this reading show?', 'The instantaneous speed', ['The average speed for the journey', 'The velocity', 'The distance travelled'], 'A speedometer shows the speed at that instant.')
N('E', 2, 'Light travels at 3.0 × 10⁸ m s⁻¹. How long does it take to travel 1.5 × 10¹¹ m from the Sun to the Earth?', 1.5e11 / 3.0e8, 's',
  't = 1.5 × 10¹¹ ÷ 3.0 × 10⁸ = 500 s', ['C1: t = d/v'], sig=2, aq='t')
N('E', 2, 'A train travels at a steady 45 m s⁻¹ for 8.0 minutes. Calculate the distance covered, in km.', 45 * 480 / 1000, 'km',
  'd = 45 × 480 = 21 600 m. In km: 21 600 ÷ 1000 = 21.6', ['C1: d = vt with t in s'], aq='d')
M('E', 1, 'Which quantity can be found from the distance a runner covers and the time taken?', 'Average speed', ['Acceleration', 'Instantaneous speed at the finish', 'Mass'], 'Average speed = distance ÷ time.')
N('E', 1, 'A walker covers 3.6 km in 1.0 hour. Calculate the average speed in m s⁻¹.', 3600 / 3600, 'm s⁻¹',
  'v = 3600 ÷ 3600 = 1.0 m s⁻¹', [], sig=2, aq='v')
N('E', 2, 'Sound travels at 340 m s⁻¹ in air. How far away is a lightning strike if the thunder arrives 4.5 s after the flash?', 340 * 4.5, 'm',
  'd = 340 × 4.5 = 1530 m', ['C1: d = vt'], aq='d')
M('E', 1, 'Why is the average speed of a car on a journey usually less than its top speed?', 'It stops, slows down and speeds up during the journey', ['Average speed is always half the top speed', 'The distance is measured wrongly', 'Speed is a vector'], 'Average speed takes account of all the slow parts.')
N('E', 2, 'An athlete runs 400 m in 52 s. Calculate the average speed.', 400 / 52, 'm s⁻¹',
  'v = 400 ÷ 52 = 7.69 m s⁻¹', ['C1: v = d/t'], aq='v')
N('E', 2, 'A swimmer completes 50 m at an average speed of 1.6 m s⁻¹. Calculate the time taken.', 50 / 1.6, 's',
  't = 50 ÷ 1.6 = 31.3 s', ['C1: t = d/v'], aq='t')
M('E', 1, 'A ball rolls 2.0 m in the first second and 1.5 m in the next second. What can you say about its speed?', 'It is slowing down', ['It is constant', 'It is speeding up', 'It is zero'], 'Less distance in each equal time means a falling speed.')
# medium
N('M', 3, 'A car travels 30 km at 60 km h⁻¹ and then 30 km at 90 km h⁻¹. Calculate its average speed for the whole journey in km h⁻¹.', 60 / (30 / 60 + 30 / 90), 'km h⁻¹',
  'Times: 30 ÷ 60 = 0.500 h and 30 ÷ 90 = 0.333 h. Average speed = 60 ÷ (0.500 + 0.3333) = 72 km h⁻¹', ['C1: time of each stage', 'C1: total distance ÷ total time'], sig=2, aq='v')
N('M', 3, 'A light gate records that a card of length 10.0 cm takes 0.040 s to pass through it. Calculate the speed of the trolley carrying the card.', 0.100 / 0.040, 'm s⁻¹',
  'v = 0.100 ÷ 0.040 = 2.5 m s⁻¹', ['C1: cm to m', 'C1: v = length ÷ time'], sig=2, aq='v')
N('M', 3, 'A runner covers the first 200 m of a race in 25 s and the next 200 m in 31 s. Calculate the average speed for the 400 m.', 400 / 56, 'm s⁻¹',
  'v = 400 ÷ (25 + 31) = 7.14 m s⁻¹', ['C1: total time', 'C1: total distance ÷ total time'], aq='v')
M('M', 3, 'Why is the average speed for a journey not the mean of the speeds in two equal-distance stages?', 'More time is spent at the lower speed, so the lower speed counts for more', ['Speeds cannot be averaged at all', 'Because speed is a vector', 'Because the distances are different'], 'Average speed = total distance ÷ total time.', ['C1: unequal times', 'C1: weighting to lower speed'])
N('M', 3, 'A ship sails at 18 knots, where 1 knot = 0.514 m s⁻¹. How far does it travel in 2.5 hours, in km?', 18 * 0.514 * 2.5 * 3600 / 1000, 'km',
  'v = 18 × 0.514 = 9.25 m s⁻¹. d = 9.252 × 9000 = 83 268 m. In km: 83 268 ÷ 1000 = 83.3', ['C1: knots to m s⁻¹', 'C1: d = vt'], aq='d')
N('M', 3, 'A radar pulse travels at 3.0 × 10⁸ m s⁻¹ to an aircraft and back in 2.0 × 10⁻⁴ s. Calculate the distance to the aircraft, in km.', 3.0e8 * 2.0e-4 / 2 / 1000, 'km',
  'd = 3.0 × 10⁸ × 2.0 × 10⁻⁴ ÷ 2 = 30 000 m. In km: 30 000 ÷ 1000 = 30', ['C1: there and back, so halve', 'C1: value'], sig=2, aq='d')
N('M', 3, 'A bus completes a 12 km route in 40 minutes, including 10 minutes spent stopped. Calculate its average speed while moving, in km h⁻¹.', 12 / 0.5, 'km h⁻¹',
  'Moving time = 30 min = 0.50 h. v = 12 ÷ 0.50 = 24 km h⁻¹', ['C1: moving time', 'C1: v = d/t'], sig=2, aq='v')
M('M', 3, 'How can the speed of a trolley be measured using one light gate?', 'Fix a card of known length to the trolley and divide its length by the time it blocks the beam', ['Measure the time the trolley takes to stop', 'Count the number of times it passes the gate', 'Weigh the trolley'], 'Speed = length of card ÷ interruption time.', ['C1: card of known length', 'C1: speed = length/time'])
N('M', 3, 'A car travelling at 31 m s⁻¹ passes a speed camera that photographs it twice, 0.50 s apart. How far apart are the car\'s positions in the two photographs?', 31 * 0.50, 'm',
  'd = 31 × 0.50 = 15.5 m', ['C1: d = vt', 'C1: value'], aq='d')
N('M', 4, 'A jogger runs 3.0 km at 2.5 m s⁻¹ and walks the next 1.0 km at 1.25 m s⁻¹. Calculate the average speed for the 4.0 km.', 4000 / (3000 / 2.5 + 1000 / 1.25), 'm s⁻¹',
  'Times: 3000 ÷ 2.5 = 1200 s and 1000 ÷ 1.25 = 800 s. v = 4000 ÷ (1200 + 800) = 2.0 m s⁻¹', ['C1: first time', 'C1: second time', 'C1: average'], sig=2, aq='v')
N('M', 3, 'A ticker-timer makes 50 dots each second. Ten dot-spaces on a tape measure 12.0 cm. Calculate the average speed of the tape.', 0.120 / (10 / 50), 'm s⁻¹',
  'Time = 10 ÷ 50 = 0.20 s. v = 0.120 ÷ 0.20 = 0.60 m s⁻¹', ['C1: time for 10 spaces', 'C1: v = d/t'], sig=2, aq='v')
M('M', 3, 'On a ticker tape, the spacing between dots increases along the tape. What does this show?', 'The object was speeding up', ['The object was slowing down', 'The object moved at constant speed', 'The timer frequency was increasing'], 'Equal time intervals with growing distances mean rising speed.', ['C1: equal time between dots', 'C1: larger distance per interval'])
N('M', 3, 'A satellite orbits the Earth once every 90 minutes in a circle of radius 6.7 × 10⁶ m. Calculate its speed, in units of 10³ m s⁻¹.', 2 * pi * 6.7e6 / 5400, '10³ m s⁻¹',
  f'v = 2π × 6.7 × 10⁶ ÷ 5400 = {sf(2 * pi * 6.7e6 / 5400)} m s⁻¹', ['C1: circumference', 'C1: period in s'], aq='v')
N('M', 3, 'An aircraft cruises at 250 m s⁻¹. How long does it take to fly 5400 km, in hours?', 5.4e6 / 250 / 3600, 'h',
  't = 5.4 × 10⁶ ÷ 250 = 21 600 s. In hours: 21 600 ÷ 3600 = 6.0', ['C1: km to m', 'C1: s to h'], sig=2, aq='t')
N('M', 3, 'Two runners start together. One runs at 6.0 m s⁻¹ and the other at 5.0 m s⁻¹. How far apart are they after 2.0 minutes?', (6.0 - 5.0) * 120, 'm',
  'Separation = (6.0 − 5.0) × 120 = 120 m', ['C1: time in s', 'C1: difference in distances'], sig=2, aq='Δd')
M('M', 3, 'A student times a toy car over 1.0 m with a stopwatch, getting 0.8 s. Why is this speed measurement unreliable?', 'Reaction time (about 0.2 s) is a large fraction of the time measured', ['The distance is too long', 'Stopwatches cannot measure seconds', 'The car is too light'], 'Use a longer distance or electronic timing.', ['C1: reaction time', 'C1: compared with 0.8 s'])
N('M', 3, 'A car travels 150 km in 2 hours 30 minutes. Calculate its average speed in m s⁻¹.', 150000 / 9000, 'm s⁻¹',
  't = 2.5 × 3600 = 9000 s. v = 150 000 ÷ 9000 = 16.7 m s⁻¹', ['C1: time in s', 'C1: v'], aq='v')
N('M', 3, 'An echo from a cliff is heard 1.8 s after a shout. Sound travels at 330 m s⁻¹. Calculate the distance to the cliff.', 330 * 1.8 / 2, 'm',
  'd = 330 × 1.8 ÷ 2 = 297 m', ['C1: there and back', 'C1: d = vt/2'], aq='d')
N('M', 3, 'A lorry travels at 22 m s⁻¹. A car behind it travels at 28 m s⁻¹. How long does the car take to close a 90 m gap?', 90 / 6, 's',
  'Closing speed = 28 − 22 = 6 m s⁻¹. t = 90 ÷ 6 = 15 s', ['C1: relative speed', 'C1: t = d/v'], sig=2, aq='t')
# hard
N('H', 5, 'A cyclist rides 12 km uphill at 15 km h⁻¹ and returns down the same road at 40 km h⁻¹. (a) Calculate the time for each stage. (b) Calculate the average speed for the round trip, in km h⁻¹.', 24 / (12 / 15 + 12 / 40), 'km h⁻¹',
  '(a) 12 ÷ 15 = 0.80 h; 12 ÷ 40 = 0.30 h. (b) v = 24 ÷ (0.80 + 0.30) = 21.8 km h⁻¹',
  ['C1: uphill time', 'C1: downhill time', 'M1: total distance ÷ total time', 'C1: value'], aq='v')
N('H', 6, 'A car must average 80 km h⁻¹ over a 160 km trip. It covers the first 80 km at 64 km h⁻¹. (a) Calculate the time allowed for the whole trip. (b) Calculate the time used so far. (c) Calculate the average speed needed for the rest, in km h⁻¹.', 80 / (2.0 - 80 / 64), 'km h⁻¹',
  '(a) 160 ÷ 80 = 2.0 h. (b) 80 ÷ 64 = 1.25 h. (c) v = 80 ÷ (2.0 − 1.25) = 107 km h⁻¹',
  ['C1: total time', 'C1: time so far', 'M1: remaining time', 'C1: remaining distance ÷ time', 'C1: value'], aq='v')
N('H', 5, 'In a relay, four runners each run 100 m. Their times are 10.8 s, 10.2 s, 10.5 s and 10.1 s. (a) Calculate the team\'s average speed. (b) By how much does the fastest runner\'s average speed exceed the team\'s?', 100 / 10.1 - 400 / (10.8 + 10.2 + 10.5 + 10.1), 'm s⁻¹',
  f'(a) v = 400 ÷ (10.8 + 10.2 + 10.5 + 10.1) = {sf(400 / 41.6, 4)} m s⁻¹. (b) 100 ÷ 10.1 = {sf(100 / 10.1, 4)} m s⁻¹; difference = {sf(100 / 10.1, 4)} − {sf(400 / 41.6, 4)} = {sf(100 / 10.1 - 400 / 41.6, 2)} m s⁻¹',
  ['C1: total time', 'C1: team speed', 'M1: fastest speed', 'C1: difference'], sig=2, aq='Δv')
N('H', 6, 'A sound pulse from a ship takes 0.24 s to return from a shoal of fish and 0.80 s to return from the sea bed. Sound travels at 1500 m s⁻¹ in sea water. (a) Calculate the depth of the shoal. (b) Calculate the depth of the sea bed. (c) Calculate the distance between the shoal and the sea bed.', 1500 * (0.80 - 0.24) / 2, 'm',
  '(a) 1500 × 0.24 ÷ 2 = 180 m. (b) 1500 × 0.80 ÷ 2 = 600 m. (c) 600 − 180 = 420 m',
  ['M1: halve the echo time', 'C1: shoal depth', 'C1: sea-bed depth', 'C1: subtraction', 'C1: value'], sig=2, aq='Δd')
N('H', 5, 'A train passes through a 1.2 km tunnel at 30 m s⁻¹. The train is 300 m long. (a) Explain why the train travels further than 1.2 km between the front entering and the rear leaving. (b) Calculate the time from the front entering to the rear leaving.', 1500 / 30, 's',
  '(a) The rear must also clear the tunnel, so the train travels 1200 + 300 = 1500 m. (b) t = 1500 ÷ 30 = 50 s',
  ['B1: tunnel + train length', 'C1: 1500 m', 'M1: t = d/v', 'C1: value'], sig=2, aq='t')
N('H', 5, 'Two cars start 5.0 km apart and drive towards each other at 20 m s⁻¹ and 30 m s⁻¹. (a) Calculate their closing speed. (b) Calculate how far the slower car has travelled when they meet.', 20 * 5000 / 50, 'm',
  '(a) 20 + 30 = 50 m s⁻¹. (b) t = 5000 ÷ 50 = 100 s; d = 20 × 100 = 2000 m',
  ['C1: closing speed', 'M1: time to meet', 'C1: t = 100 s', 'C1: distance'], sig=2, aq='d')
N('H', 6, 'A runner completes 25 laps of a 400 m track in 28 minutes 20 seconds. (a) Calculate the total distance. (b) Calculate the average speed. (c) Calculate the average time per lap.', 1700 / 25, 's',
  '(a) 25 × 400 = 10 000 m. (b) t = 28 × 60 + 20 = 1700 s; v = 10 000 ÷ 1700 = 5.88 m s⁻¹. (c) 1700 ÷ 25 = 68 s',
  ['C1: distance', 'C1: time in s', 'C1: average speed', 'M1: time per lap', 'C1: value'], sig=2, aq='t')
N('H', 5, 'A delivery van averages 50 km h⁻¹ in town for 18 km and 100 km h⁻¹ on a motorway for 75 km. (a) Calculate the time for each part. (b) Calculate the average speed for the whole trip, in km h⁻¹.', 93 / (18 / 50 + 75 / 100), 'km h⁻¹',
  '(a) 18 ÷ 50 = 0.36 h; 75 ÷ 100 = 0.75 h. (b) v = 93 ÷ (0.36 + 0.75) = 83.8 km h⁻¹',
  ['C1: town time', 'C1: motorway time', 'M1: total ÷ total', 'C1: value'], aq='v')
N('H', 5, 'Light from the Moon takes 1.28 s to reach the Earth. A laser pulse is sent to a reflector on the Moon and back. (a) Calculate the Earth–Moon distance. (b) Calculate the time for the round trip of the pulse.' + take('c'), 2 * 1.28, 's',
  '(a) d = 3.00 × 10⁸ × 1.28 = 3.84 × 10⁸ m. (b) t = 2 × 1.28 = 2.56 s',
  ['C1: d = ct', 'C1: value', 'M1: there and back', 'C1: value'], aq='t')
N('H', 6, 'A car accelerates so that it covers 4.0 m, 12 m and 20 m in three successive seconds. (a) Calculate the average speed in each second. (b) Calculate the average speed over the three seconds. (c) State whether its speed was constant.', 36 / 3, 'm s⁻¹',
  '(a) 4.0, 12 and 20 m s⁻¹. (b) v = (4.0 + 12 + 20) ÷ 3 = 12 m s⁻¹. (c) No, it increased.',
  ['C1: each average speed', 'C1: total distance', 'M1: ÷ total time', 'C1: value', 'B1: not constant'], sig=2, aq='v')
N('H', 5, 'A pulse of ultrasound travels through 4.5 cm of tissue and back in 60 µs. (a) Calculate the total distance travelled. (b) Calculate the speed of ultrasound in the tissue.', 0.090 / 60e-6, 'm s⁻¹',
  '(a) 2 × 4.5 = 9.0 cm. (b) v = 0.090 ÷ 60 × 10⁻⁶ = 1500 m s⁻¹',
  ['C1: twice the depth', 'C1: cm to m', 'M1: v = d/t with µs', 'C1: value'], sig=2, aq='v')

N('E', 2, 'A marathon of 42.2 km is run in 2 hours 5 minutes. Calculate the average speed in m s⁻¹.', 42200 / 7500, 'm s⁻¹',
  't = 2 × 3600 + 5 × 60 = 7500 s. v = 42 200 ÷ 7500 = 5.63 m s⁻¹', ['C1: units converted'], aq='v')
N('M', 3, 'A car is driven at a steady 27 m s⁻¹ for 15 minutes. How far does it travel, in km?', 27 * 900 / 1000, 'km',
  'd = 27 × 900 = 24 300 m. In km: 24 300 ÷ 1000 = 24.3', ['C1: minutes to seconds', 'C1: d = vt'], aq='d')
M('E', 1, 'Which of these speeds is the greatest?', '100 km h⁻¹', ['25 m s⁻¹', '1.6 km per minute', '0.020 km s⁻¹'], 'In m s⁻¹ they are 27.8, 25, 26.7 and 20.')
N('H', 5, 'A passenger walks at 1.2 m s⁻¹ along a moving walkway that moves at 0.40 m s⁻¹ in the same direction. The walkway is 60 m long. (a) Calculate her speed relative to the ground. (b) Calculate the time to travel the length of the walkway.', 60 / 1.6, 's',
  '(a) v = 1.2 + 0.40 = 1.6 m s⁻¹. (b) t = 60 ÷ 1.6 = 37.5 s', ['M1: add speeds', 'C1: 1.6 m s⁻¹', 'M1: t = d/v', 'C1: value'], aq='t')
N('M', 3, 'A runner\'s stride is 1.8 m long and she takes 3.0 strides each second. Calculate her speed.', 1.8 * 3.0, 'm s⁻¹',
  'v = 1.8 × 3.0 = 5.4 m s⁻¹', ['C1: distance per second', 'C1: value'], sig=2, aq='v')

# ═════════════════════════ 1.2 Distance and displacement, scalar and vector (17/20/13) ═════════════════════════
lesson('1.2')
M('E', 1, 'What is the difference between distance and displacement?', 'Displacement is distance in a stated direction; distance has no direction', ['They are the same quantity', 'Distance is a vector and displacement is a scalar', 'Displacement is always larger'], 'Displacement is a vector quantity.')
M('E', 1, 'Which of these is a vector quantity?', 'Displacement', ['Distance', 'Speed', 'Time'], 'A vector has both magnitude and direction.')
M('E', 1, 'Which of these is a scalar quantity?', 'Distance', ['Displacement', 'Velocity', 'Force'], 'A scalar has magnitude only.')
N('E', 2, 'A boy walks 40 m north and then 15 m south. Calculate his displacement from the start.', 40 - 15, 'm',
  'Displacement = 40 − 15 = 25 m north', ['C1: subtract opposite directions'], sig=2, aq='s')
N('E', 2, 'A boy walks 40 m north and then 15 m south. Calculate the distance he walks.', 40 + 15, 'm',
  'Distance = 40 + 15 = 55 m', ['C1: add distances'], sig=2, aq='d')
N('E', 2, 'A hiker walks 3.0 km east and then 4.0 km north. Calculate the magnitude of her displacement.', 5.0, 'km',
  's = √(3.0² + 4.0²) = 5.0 km', ['C1: Pythagoras'], sig=2, aq='s')
M('E', 1, 'A runner completes one full lap of a 400 m track. What is her displacement at the finish?', 'Zero', ['400 m', '200 m', '127 m'], 'She ends where she started.')
N('E', 2, 'A runner completes 2.5 laps of a 400 m circular track. Calculate the distance run.', 2.5 * 400, 'm',
  'd = 2.5 × 400 = 1000 m', ['C1: laps × length'], sig=2, aq='d')
M('E', 1, 'What two things must be stated to describe a displacement fully?', 'A magnitude and a direction', ['A magnitude and a time', 'A speed and a direction', 'A distance and a time'], 'For example 25 m due north.')
N('E', 2, 'A lift rises 24 m from the ground floor and then descends 9.0 m. Calculate its displacement from the ground floor.', 24 - 9.0, 'm',
  's = 24 − 9.0 = 15 m upwards', ['C1: up − down'], sig=2, aq='s')
M('E', 1, 'Which statement about a vector quantity is correct?', 'It is fully described only when its direction is given', ['It can never be negative', 'It has no unit', 'It is always larger than a scalar'], 'Direction is part of the quantity.')
N('E', 1, 'An ant walks along three sides of a square of side 20 cm. Calculate the distance it walks, in cm.', 60, 'cm',
  'Three sides: d = 3 × 20 = 60 cm', [], sig=2, aq='d')
N('E', 2, 'An ant walks along three sides of a square of side 20 cm. Calculate the magnitude of its displacement, in cm.', 20, 'cm',
  'Three sides leave it one side from the start: s = 20 × 1 = 20 cm', ['C1: ends one side from start'], sig=2, aq='s')
M('E', 1, 'Can the magnitude of a displacement ever be greater than the distance travelled?', 'No, it can be equal or smaller but never greater', ['Yes, always', 'Yes, on curved paths', 'Only when moving backwards'], 'The straight line is the shortest path.')
N('E', 2, 'A ball is thrown 6.0 m straight up and falls back into the thrower\'s hand. Calculate the distance it travels.', 12, 'm',
  'd = 6.0 + 6.0 = 12 m', ['C1: up + down'], sig=2, aq='d')
M('E', 1, 'A ball is thrown straight up and caught at the same height. What is its displacement?', 'Zero', ['Twice the maximum height', 'The maximum height', 'Half the maximum height'], 'It returns to its starting point.')
N('E', 2, 'A car drives 8.0 km west then 6.0 km south. Calculate the magnitude of its displacement.', 10.0, 'km',
  's = √(8.0² + 6.0²) = 10 km', ['C1: Pythagoras'], sig=2, aq='s')
# medium
N('M', 3, 'A cyclist rides half way round a circular track of radius 50 m. Calculate (a) the distance and (b) the magnitude of the displacement. Give the answer to (b).', 100, 'm',
  '(a) d = π × 50 = 157 m. (b) s = 2 × 50 = 100 m (the diameter).', ['C1: half circumference', 'C1: diameter'], sig=2, aq='s')
N('M', 3, 'A cyclist rides half way round a circular track of radius 50 m. Calculate the distance ridden.', pi * 50, 'm',
  f'Half the circumference: d = π × 50 = {sf(pi * 50)} m', ['C1: half of 2πr', 'C1: value'], aq='d')
N('M', 3, 'A walker goes 5.0 km north then 12 km east. Calculate the direction of her displacement as an angle east of north.', degrees(atan(12 / 5.0)), '°',
  f'θ = tan⁻¹(12 ÷ 5.0) = {sf(degrees(atan(12 / 5)))}°', ['C1: tan θ = east/north', 'C1: angle'], aq='θ')
N('M', 3, 'A boat sails 2.4 km east and then 1.0 km north. Calculate the magnitude of its displacement.', sqrt(2.4 ** 2 + 1.0 ** 2), 'km',
  's = √(2.4² + 1.0²) = 2.6 km', ['C1: right angle', 'C1: Pythagoras'], sig=2, aq='s')
M('M', 3, 'A dog runs around a field and returns to its owner. Which statement is correct?', 'Its displacement is zero but the distance it ran is not', ['Its distance is zero but its displacement is not', 'Both are zero', 'Both are the same non-zero value'], 'Returning to the start gives zero displacement.', ['C1: displacement zero', 'C1: distance non-zero'])
N('M', 3, 'A robot moves 6.0 m east, 3.0 m north and then 2.0 m west. Calculate the magnitude of its final displacement.', 5.0, 'm',
  'Net east = 6.0 − 2.0 = 4.0 m; north = 3.0 m. s = √(4.0² + 3.0²) = 5.0 m', ['C1: net east component', 'C1: Pythagoras'], sig=2, aq='s')
N('M', 3, 'A pendulum bob swings from one end of its swing to the other, a straight-line separation of 12 cm, along an arc of length 13 cm. Calculate (arc distance) ÷ (displacement).', 13 / 12, None,
  'Ratio = 13 ÷ 12 = 1.08', ['C1: distance is the arc', 'C1: displacement is the chord'], aq='ratio')
N('M', 3, 'A ship sails 30 km due south and then 40 km due west. Calculate the bearing of its final position from the start.', 180 + degrees(atan(40 / 30)), '°',
  f'Angle west of south = tan⁻¹(40 ÷ 30) = {sf(degrees(atan(40 / 30)))}°. Bearing = 180 + {sf(degrees(atan(40 / 30)))} = {sf(180 + degrees(atan(4 / 3)))}°', ['C1: angle west of south', 'C1: bearing'], aq='bearing')
M('M', 3, 'Why is it wrong to add a 3 km displacement north and a 4 km displacement east to get 7 km?', 'They are vectors in different directions, so they must be added with a vector diagram (giving 5 km)', ['Displacements can never be added', 'They should be subtracted to give 1 km', 'They should be multiplied'], 'Vectors at right angles add by Pythagoras.', ['C1: vectors', 'C1: direction matters'])
N('M', 3, 'A swimmer swims 4 lengths of a 25 m pool, starting and finishing at the same end. Calculate the distance swum and state the displacement. Give the distance.', 100, 'm',
  'd = 4 × 25 = 100 m; the displacement is zero because she finishes at the start.', ['C1: distance', 'C1: zero displacement'], sig=2, aq='d')
N('M', 3, 'A climber rises 300 m vertically while moving 400 m horizontally. Calculate the magnitude of her displacement.', 500, 'm',
  's = √(300² + 400²) = 500 m', ['C1: right-angled components', 'C1: Pythagoras'], sig=2, aq='s')
N('M', 4, 'A car goes round three-quarters of a circular roundabout of radius 20 m. Calculate the magnitude of its displacement.', sqrt(2) * 20, 'm',
  f'Start and end are 90° apart on the circle: s = √(20² + 20²) = {sf(sqrt(2) * 20)} m', ['M1: positions 90° apart', 'C1: chord', 'C1: value'], aq='s')
N('M', 3, 'A car goes round three-quarters of a circular roundabout of radius 20 m. Calculate the distance travelled.', 0.75 * 2 * pi * 20, 'm',
  f'd = 0.75 × 2π × 20 = {sf(0.75 * 2 * pi * 20)} m', ['C1: fraction of circumference', 'C1: value'], aq='d')
M('M', 3, 'Which pair contains one scalar and one vector?', 'Distance and displacement', ['Speed and distance', 'Force and displacement', 'Mass and time'], 'Distance is scalar; displacement is vector.', ['C1: distance scalar', 'C1: displacement vector'])
N('M', 3, 'A drone flies 120 m north, rises 50 m, then flies 120 m south. Calculate the magnitude of its displacement.', 50, 'm',
  'North and south cancel: s = 120 − 120 + 50 = 50 m upwards', ['C1: horizontal parts cancel', 'C1: vertical remains'], sig=2, aq='s')
N('M', 3, 'A drone flies 120 m north, rises 50 m, then flies 120 m south. Calculate the distance it flies.', 290, 'm',
  'd = 120 + 50 + 120 = 290 m', ['C1: add all lengths', 'C1: value'], sig=2, aq='d')
M('M', 3, 'A student says "the car\'s displacement is 40 km". What is missing?', 'The direction, e.g. 40 km north-east', ['The time taken', 'The speed', 'Nothing'], 'A vector needs a direction.', ['C1: displacement is a vector', 'C1: direction required'])
N('M', 3, 'A walker goes 600 m on a bearing of 090° and then 800 m on a bearing of 180°. Calculate the magnitude of the displacement.', 1000, 'm',
  's = √(600² + 800²) = 1000 m', ['C1: perpendicular legs', 'C1: Pythagoras'], sig=2, aq='s')
N('M', 3, 'A rugby player runs 18 m forward and 7.5 m sideways. Calculate the angle of his displacement from the forward direction.', degrees(atan(7.5 / 18)), '°',
  f'θ = tan⁻¹(7.5 ÷ 18) = {sf(degrees(atan(7.5 / 18)))}°', ['C1: tan θ = side/forward', 'C1: value'], aq='θ')
# hard
N('H', 5, 'A yacht sails 8.0 km north, then 6.0 km east, then 2.0 km south. (a) Find the net north and east displacements. (b) Calculate the magnitude of the resultant displacement.', sqrt(6.0 ** 2 + 6.0 ** 2), 'km',
  f'(a) North: 8.0 − 2.0 = 6.0 km; east: 6.0 km. (b) s = √(6.0² + 6.0²) = {sf(sqrt(72))} km',
  ['C1: north component', 'C1: east component', 'M1: Pythagoras', 'C1: value'], aq='s')
N('H', 6, 'A yacht sails 8.0 km north, then 6.0 km east, then 2.0 km south. (a) Find the resultant displacement. (b) Find its bearing from the start. Give the bearing.', 45, '°',
  '(a) 6.0 km north and 6.0 km east, so s = 8.49 km. (b) tan θ = 6.0 ÷ 6.0, θ = tan⁻¹(6.0 ÷ 6.0) = 45°, a bearing of 045°.',
  ['C1: components', 'C1: magnitude', 'M1: tan θ = east/north', 'C1: angle', 'C1: bearing'], sig=2, aq='bearing')
N('H', 5, 'A child runs once round a circular path of diameter 30 m, then a further quarter lap. (a) Calculate the distance run. (b) Calculate the magnitude of the displacement.', sqrt(2) * 15, 'm',
  f'(a) d = 1.25 × π × 30 = {sf(1.25 * pi * 30)} m. (b) A quarter lap from the start: s = √(15² + 15²) = {sf(sqrt(2) * 15)} m',
  ['C1: circumference', 'C1: distance', 'M1: chord for 90°', 'C1: value'], aq='s')
N('H', 6, 'A hiker walks 5.0 km on a bearing of 060°, then 5.0 km on a bearing of 150°. (a) Find the east and north components of each leg. (b) Calculate the magnitude of the total displacement.', sqrt(50), 'km',
  f'(a) Leg 1: east 5.0 sin 60° = 4.33, north 5.0 cos 60° = 2.50. Leg 2: east 5.0 sin 150° = 2.50, north 5.0 cos 150° = −4.33. (b) s = √((4.33 + 2.50)² + (2.50 − 4.33)²) = {sf(sqrt(50))} km',
  ['C1: leg 1 components', 'C1: leg 2 components', 'M1: add components', 'C1: Pythagoras', 'C1: value'], aq='s')
N('H', 5, 'An insect crawls from one corner of a 3.0 cm cube to the opposite corner along three edges. (a) Calculate the distance crawled. (b) Calculate the magnitude of its displacement, in cm.', 3.0 * sqrt(3), 'cm',
  f'(a) d = 3 × 3.0 = 9.0 cm. (b) s = √(3.0² + 3.0² + 3.0²) = {sf(3 * sqrt(3))} cm',
  ['C1: distance', 'M1: three perpendicular components', 'C1: Pythagoras in 3D', 'C1: value'], aq='s')
N('H', 6, 'A ball rolls 4.0 m east, bounces off a wall, rolls 1.5 m west and stops. It took 3.0 s. (a) Calculate the distance. (b) Calculate the displacement. (c) Calculate (average speed) ÷ (magnitude of average velocity).', 5.5 / 2.5, None,
  '(a) d = 4.0 + 1.5 = 5.5 m. (b) s = 4.0 − 1.5 = 2.5 m east. (c) Ratio = (5.5 ÷ 3.0) ÷ (2.5 ÷ 3.0) = 2.2',
  ['C1: distance', 'C1: displacement', 'M1: speed and velocity', 'C1: ratio', 'C1: value'], sig=2, aq='ratio')
N('H', 5, 'A plane flies 300 km due east and then 400 km on a bearing of 030°. (a) Calculate the total east and north displacements. (b) Calculate the magnitude of the resultant.', sqrt((300 + 400 * sin(radians(30))) ** 2 + (400 * cos(radians(30))) ** 2), 'km',
  f'(a) East = 300 + 400 sin 30° = 500 km; north = 400 cos 30° = {sf(400 * cos(radians(30)), 4)} km. (b) s = √(500² + {sf(400 * cos(radians(30)), 4)}²) = {sf(sqrt(500 ** 2 + (400 * cos(radians(30))) ** 2))} km',
  ['C1: east', 'C1: north', 'M1: Pythagoras', 'C1: value'], aq='s')
N('H', 5, 'A diver jumps up 0.80 m from a board 3.0 m above the water and then falls into the water. (a) Calculate the distance travelled until she reaches the water. (b) Calculate her displacement at the water surface from the board.', 3.0, 'm',
  '(a) d = 0.80 + 0.80 + 3.0 = 4.6 m. (b) Up 0.80 m, down 0.80 m and down 3.0 m: s = 0.80 − 0.80 + 3.0 = 3.0 m downwards.',
  ['C1: up and back down', 'C1: total distance', 'M1: start to finish', 'C1: value'], sig=2, aq='s')
N('H', 6, 'A city is laid out in square blocks of side 150 m. A taxi drives 4 blocks east, 3 blocks north and then 1 block west. (a) Calculate the distance driven. (b) Calculate the magnitude of the displacement. (c) Calculate its angle north of east.', degrees(atan(3 / 3)), '°',
  '(a) d = 8 × 150 = 1200 m. (b) Net 3 blocks east and 3 north: s = √(450² + 450²) = 636 m. (c) θ = tan⁻¹(450 ÷ 450) = 45°',
  ['C1: distance', 'C1: components', 'C1: magnitude', 'M1: tan θ', 'C1: value'], sig=2, aq='θ')
N('H', 5, 'A satellite moves through one-sixth of a circular orbit of radius 7000 km. (a) Calculate the distance travelled along the orbit. (b) Calculate the magnitude of its displacement.', 7000, 'km',
  f'(a) d = 2π × 7000 ÷ 6 = {sf(2 * pi * 7000 / 6)} km. (b) The chord for 60° equals the radius: s = 7000 × 1 = 7000 km.',
  ['C1: arc length', 'M1: chord for 60°', 'C1: equilateral triangle', 'C1: value'], sig=2, aq='s')

N('E', 2, 'A cat climbs 2.5 m up a tree and then jumps 1.0 m down onto a branch. Calculate its displacement from the ground.', 1.5, 'm',
  's = 2.5 − 1.0 = 1.5 m upwards', ['C1: up − down'], sig=2, aq='s')
M('E', 1, 'Which statement describes a displacement rather than a distance?', '"The ship is 12 km north-west of the port"', ['"The ship sailed 30 km today"', '"The track is 400 m long"', '"The journey was 5 km"'], 'Only the first gives a direction from a reference point.')
N('M', 3, 'A golf ball moves 120 m north with one shot and 50 m east with the next. Calculate the magnitude of its displacement.', 130, 'm',
  's = √(120² + 50²) = 130 m', ['C1: perpendicular', 'C1: Pythagoras'], sig=2, aq='s')
N('M', 3, 'Starting from a jetty, a kayaker paddles 2.0 km towards the north-east (045°) and then 2.0 km towards the south-east (135°). How far is she from the jetty?', 2.0 * sqrt(2), 'km',
  f'The legs are at 90° to each other: s = √(2.0² + 2.0²) = {sf(2 * sqrt(2))} km', ['C1: legs perpendicular', 'C1: Pythagoras'], aq='s')
N('H', 5, 'A sailor goes 10 km north, 10 km east, 10 km south and then 4.0 km west. (a) Calculate the distance sailed. (b) Calculate the magnitude of the displacement.', 6.0, 'km',
  '(a) d = 10 + 10 + 10 + 4.0 = 34 km. (b) North and south cancel; east: s = 10 − 4.0 = 6.0 km east', ['C1: distance', 'M1: north and south cancel', 'C1: east − west', 'C1: value'], sig=2, aq='s')

# ═════════════════════════ 1.3 Speed and velocity (17/20/13) ═════════════════════════
lesson('1.3')
M('E', 1, 'How is the velocity of an object defined?', 'The rate of change of displacement', ['The rate of change of distance', 'Distance × time', 'The change in speed'], 'Velocity = displacement ÷ time, a vector.')
M('E', 1, 'Which quantity is a vector?', 'Velocity', ['Speed', 'Distance', 'Time'], 'Velocity has a direction.')
N('E', 2, 'A car moves 360 m due north in 24 s. Calculate its average velocity.', 15, 'm s⁻¹',
  'v = 360 ÷ 24 = 15 m s⁻¹ north', ['C1: v = s/t'], sig=2, aq='v')
M('E', 1, 'A car goes round a bend at a constant 20 m s⁻¹. What is changing?', 'Its velocity, because its direction changes', ['Its speed', 'Nothing', 'Its mass'], 'Velocity includes direction.')
N('E', 2, 'A runner completes a 400 m lap in 80 s. Calculate her average speed.', 5.0, 'm s⁻¹',
  'v = 400 ÷ 80 = 5.0 m s⁻¹', ['C1: distance ÷ time'], sig=2, aq='speed')
M('E', 1, 'A runner completes a 400 m lap in 80 s, finishing where she started. What is her average velocity?', 'Zero', ['5.0 m s⁻¹', '2.5 m s⁻¹', '10 m s⁻¹'], 'Zero displacement means zero average velocity.')
N('E', 2, 'A lift moves 30 m downwards in 12 s. Calculate its average velocity, taking upwards as positive.', -2.5, 'm s⁻¹',
  'v = −30 ÷ 12 = −2.5 m s⁻¹', ['C1: sign shows direction'], sig=2, sign=True, aq='v')
M('E', 1, 'Two cars travel at 25 m s⁻¹, one north and one south. Which statement is correct?', 'They have the same speed but different velocities', ['They have the same velocity', 'They have different speeds', 'Both have zero velocity'], 'Velocity includes direction.')
N('E', 2, 'An aircraft flies 900 km due west in 1.5 h. Calculate its average velocity in km h⁻¹.', 600, 'km h⁻¹',
  'v = 900 ÷ 1.5 = 600 km h⁻¹ west', ['C1: v = s/t'], sig=2, aq='v')
M('E', 1, 'What is the SI unit of velocity?', 'm s⁻¹', ['m s⁻²', 'm', 's'], 'The same unit as speed.')
N('E', 2, 'A ball moves at a constant velocity of 4.0 m s⁻¹ east. Calculate its displacement after 6.0 s.', 24, 'm',
  's = 4.0 × 6.0 = 24 m east', ['C1: s = vt'], sig=2, aq='s')
M('E', 1, 'Can an object have a constant speed but a changing velocity?', 'Yes, if it moves in a circle', ['No, never', 'Only if it slows down', 'Only in a straight line'], 'Direction changes on a curved path.')
N('E', 1, 'A tortoise moves 1.2 m east in 20 s. Calculate its average velocity.', 0.060, 'm s⁻¹',
  'v = 1.2 ÷ 20 = 0.060 m s⁻¹ east', [], sig=2, aq='v')
M('E', 1, 'Velocity can be negative. What does a negative velocity show?', 'Motion in the direction chosen as negative', ['The object is slowing down', 'The speed is below zero', 'The object is at rest'], 'The sign gives the direction.')
N('E', 2, 'A cyclist rides 2.0 km east in 400 s. Calculate her average velocity.', 5.0, 'm s⁻¹',
  'v = 2000 ÷ 400 = 5.0 m s⁻¹ east', ['C1: km to m'], sig=2, aq='v')
M('E', 1, 'A car\'s velocity is "20 m s⁻¹ north-east". What is its speed?', '20 m s⁻¹', ['14 m s⁻¹', '28 m s⁻¹', '0 m s⁻¹'], 'Speed is the magnitude of velocity.')
N('E', 2, 'A train travels 54 km due south in 30 minutes. Calculate its average velocity in m s⁻¹.', 54000 / 1800, 'm s⁻¹',
  'v = 54 000 ÷ 1800 = 30 m s⁻¹ south', ['C1: units to m and s'], sig=2, aq='v')
# medium
N('M', 3, 'A walker goes 400 m east in 300 s and then 300 m north in 200 s. Calculate her average speed.', 700 / 500, 'm s⁻¹',
  'Speed = (400 + 300) ÷ (300 + 200) = 1.4 m s⁻¹', ['C1: total distance', 'C1: total time'], sig=2, aq='speed')
N('M', 3, 'A walker goes 400 m east in 300 s and then 300 m north in 200 s. Calculate the magnitude of her average velocity.', 500 / 500, 'm s⁻¹',
  's = √(400² + 300²) = 500 m; v = 500 ÷ 500 = 1.0 m s⁻¹', ['C1: displacement', 'C1: ÷ total time'], sig=2, aq='v')
M('M', 3, 'Why is the average speed of a round trip never less than the magnitude of its average velocity?', 'Distance is always at least as large as the magnitude of displacement, and the times are the same', ['Speed is a vector', 'Velocity is always zero', 'Distance is always smaller'], 'Both are divided by the same time.', ['C1: distance ≥ |displacement|', 'C1: same time'])
N('M', 3, 'A ball is thrown up and caught 2.4 s later at the same height. It rose 7.0 m. Calculate its average speed.', 14 / 2.4, 'm s⁻¹',
  'Speed = (7.0 + 7.0) ÷ 2.4 = 5.83 m s⁻¹', ['C1: distance up and down', 'C1: ÷ time'], aq='speed')
N('M', 3, 'A boat moves 1.2 km north in 4.0 minutes and then 0.5 km south in 2.0 minutes. Calculate its average velocity over the 6.0 minutes.', 700 / 360, 'm s⁻¹',
  'Displacement = 1200 − 500 = 700 m north. v = 700 ÷ 360 = 1.94 m s⁻¹ north', ['C1: net displacement', 'C1: ÷ time in s'], aq='v')
N('M', 3, 'A car travels at 20 m s⁻¹ north for 50 s and then at 10 m s⁻¹ south for 30 s. Calculate its final displacement.', 20 * 50 - 10 * 30, 'm',
  's = 20 × 50 − 10 × 30 = 700 m north', ['C1: each displacement', 'C1: subtract'], sig=2, aq='s')
N('M', 4, 'A car travels at 20 m s⁻¹ north for 50 s and then at 10 m s⁻¹ south for 30 s. Calculate its average velocity.', 700 / 80, 'm s⁻¹',
  's = 1000 − 300 = 700 m north; v = 700 ÷ 80 = 8.75 m s⁻¹ north', ['C1: displacements', 'C1: net', 'C1: ÷ total time'], aq='v')
M('M', 3, 'A satellite orbits at constant speed. Which statement is correct?', 'Its velocity changes continuously because its direction changes', ['Its velocity is constant', 'Its speed changes', 'It has no velocity'], 'Uniform circular motion has constant speed but changing velocity.', ['C1: direction changes', 'C1: velocity changes'])
N('M', 3, 'A runner runs half a lap of a circular track of radius 32 m in 25 s. Calculate her average speed.', pi * 32 / 25, 'm s⁻¹',
  f'd = π × 32 = {sf(pi * 32, 4)} m. Speed = {sf(pi * 32, 4)} ÷ 25 = {sf(pi * 32 / 25)} m s⁻¹', ['C1: half circumference', 'C1: ÷ time'], aq='speed')
N('M', 3, 'A runner runs half a lap of a circular track of radius 32 m in 25 s. Calculate the magnitude of her average velocity.', 64 / 25, 'm s⁻¹',
  's = 2 × 32 = 64 m; v = 64 ÷ 25 = 2.56 m s⁻¹', ['C1: diameter', 'C1: ÷ time'], aq='v')
M('M', 3, 'A stone is dropped and falls 20 m. Taking upwards as positive, what is the sign of its velocity and displacement?', 'Both negative', ['Both positive', 'Velocity positive, displacement negative', 'Velocity negative, displacement zero'], 'Both point downwards.', ['C1: downward', 'C1: negative'])
N('M', 3, 'A swimmer swims 50 m out along a pool in 40 s and back in 45 s. Calculate her average speed for the two lengths.', 100 / 85, 'm s⁻¹',
  'Speed = 100 ÷ (40 + 45) = 1.18 m s⁻¹', ['C1: total distance', 'C1: total time'], aq='speed')
M('M', 3, 'For the swimmer who swims a length and back, what is her average velocity, and why?', 'Zero, because she ends where she started', ['1.18 m s⁻¹', '2.35 m s⁻¹', 'It depends on her speed'], 'Average velocity = displacement ÷ time.', ['C1: zero displacement', 'C1: zero velocity'])
N('M', 3, 'A bird flies 300 m north-east in 25 s. Calculate the northward component of its average velocity.', 300 * cos(radians(45)) / 25, 'm s⁻¹',
  f'v = 300 ÷ 25 = 12 m s⁻¹; northward component = 12 × cos 45° = {sf(12 * cos(radians(45)))} m s⁻¹', ['C1: v', 'C1: component'], aq='v_N')
N('M', 3, 'A car averages 25 m s⁻¹ on a 7.5 km road that runs due east. How long does it take?', 7500 / 25, 's',
  't = 7500 ÷ 25 = 300 s', ['C1: km to m', 'C1: t = s/v'], sig=2, aq='t')
N('M', 3, 'A lift goes up 20 m in 10 s, waits 5.0 s and comes down 12 m in 6.0 s. Calculate its average velocity, taking up as positive.', 8 / 21, 'm s⁻¹',
  'Displacement = 20 − 12 = 8.0 m; v = 8.0 ÷ (10 + 5.0 + 6.0) = 0.381 m s⁻¹', ['C1: net displacement', 'C1: total time including the wait'], aq='v')
M('M', 3, 'A car\'s speedometer shows 60 km h⁻¹ as it rounds a bend. Can its velocity be found from the speedometer alone?', 'No, the speedometer gives only the speed, not the direction', ['Yes, speed and velocity are the same', 'Yes, if the car is turning', 'No, because the reading is in km h⁻¹'], 'The direction must also be known.', ['C1: speedometer gives magnitude', 'C1: direction needed'])
N('M', 4, 'A boat travels 3.0 km east in 10 minutes, then 4.0 km north in 15 minutes. Calculate the magnitude of its average velocity in km h⁻¹.', 5.0 / (25 / 60), 'km h⁻¹',
  's = √(3.0² + 4.0²) = 5.0 km; t = 25 min = 0.4167 h; v = 5.0 ÷ 0.4167 = 12 km h⁻¹', ['C1: displacement', 'C1: time in h', 'C1: v'], sig=2, aq='v')
# hard
N('H', 5, 'A runner completes 1.5 laps of a circular track of radius 40 m in 90 s. (a) Calculate her average speed. (b) Calculate the magnitude of her average velocity.', 80 / 90, 'm s⁻¹',
  f'(a) d = 1.5 × 2π × 40 = {sf(1.5 * 2 * pi * 40, 4)} m; speed = {sf(1.5 * 2 * pi * 40, 4)} ÷ 90 = {sf(1.5 * 2 * pi * 40 / 90)} m s⁻¹. (b) She ends opposite the start: s = 80 m; v = 80 ÷ 90 = 0.889 m s⁻¹',
  ['C1: distance', 'C1: speed', 'M1: displacement = diameter', 'C1: velocity'], aq='v')
N('H', 6, 'A plane flies 400 km north in 50 minutes and then 300 km west in 40 minutes. (a) Calculate the average speed in km h⁻¹. (b) Calculate the magnitude of the average velocity in km h⁻¹. (c) Calculate its direction west of north.', degrees(atan(300 / 400)), '°',
  '(a) 700 ÷ 1.5 = 467 km h⁻¹. (b) s = 500 km; v = 500 ÷ 1.5 = 333 km h⁻¹. (c) θ = tan⁻¹(300 ÷ 400) = 36.9°',
  ['C1: average speed', 'C1: displacement', 'C1: velocity', 'M1: tan θ', 'C1: angle'], aq='θ')
N('H', 5, 'A ball is dropped from 5.0 m, bounces and rises to 3.2 m, taking 1.8 s in total. (a) Calculate the distance travelled. (b) Calculate the displacement. (c) Calculate the average velocity, taking down as positive.', 1.8 / 1.8, 'm s⁻¹',
  '(a) 5.0 + 3.2 = 8.2 m. (b) 5.0 − 3.2 = 1.8 m downwards. (c) v = 1.8 ÷ 1.8 = 1.0 m s⁻¹ downwards',
  ['C1: distance', 'C1: displacement', 'M1: v = s/t', 'C1: value'], sig=2, aq='v')
N('H', 6, 'A car drives 12 km north at 60 km h⁻¹ and then 9.0 km east at 45 km h⁻¹. (a) Calculate the time for each stage. (b) Calculate the average speed. (c) Calculate the magnitude of the average velocity, in km h⁻¹.', 15 / 0.4, 'km h⁻¹',
  '(a) 12 ÷ 60 = 0.20 h; 9.0 ÷ 45 = 0.20 h. (b) 21 ÷ 0.40 = 52.5 km h⁻¹. (c) s = √(12² + 9.0²) = 15 km; v = 15 ÷ 0.40 = 37.5 km h⁻¹',
  ['C1: times', 'C1: average speed', 'C1: displacement', 'M1: ÷ total time', 'C1: value'], aq='v')
N('H', 5, 'A spider crawls round three sides of a square of side 0.60 m in 12 s. (a) Calculate its average speed. (b) Calculate the magnitude of its average velocity. (c) Calculate their ratio, speed ÷ velocity.', 3.0, None,
  '(a) 1.8 ÷ 12 = 0.15 m s⁻¹. (b) Displacement = 0.60 m; 0.60 ÷ 12 = 0.050 m s⁻¹. (c) 0.15 ÷ 0.050 = 3.0',
  ['C1: speed', 'C1: displacement', 'C1: velocity', 'C1: ratio'], sig=2, aq='ratio')
N('H', 5, 'A train travels at 40 m s⁻¹ east for 3.0 minutes, stops for 1.0 minute, then travels at 30 m s⁻¹ west for 2.0 minutes. (a) Calculate the final displacement. (b) Calculate the average velocity over the 6.0 minutes.', (40 * 180 - 30 * 120) / 360, 'm s⁻¹',
  '(a) 40 × 180 − 30 × 120 = 3600 m east. (b) v = 3600 ÷ 360 = 10 m s⁻¹ east',
  ['C1: east displacement', 'C1: west displacement', 'M1: net ÷ total time', 'C1: value'], sig=2, aq='v')
N('H', 6, 'An object moves round a circle of radius 2.0 m at a constant speed of 4.0 m s⁻¹. (a) Calculate the time for a quarter turn. (b) Calculate the magnitude of the displacement in that time. (c) Calculate the magnitude of the average velocity.', sqrt(8) / (2 * pi * 2.0 / 4 / 4.0), 'm s⁻¹',
  f'(a) t = (2π × 2.0 ÷ 4) ÷ 4.0 = {sf(pi / 4, 4)} s. (b) s = √(2.0² + 2.0²) = {sf(sqrt(8), 4)} m. (c) v = {sf(sqrt(8), 4)} ÷ {sf(pi / 4, 4)} = {sf(sqrt(8) / (pi / 4))} m s⁻¹',
  ['C1: arc length', 'C1: time', 'C1: chord', 'M1: v = s/t', 'C1: value'], aq='v')
N('H', 5, 'A ferry crosses a 1.2 km wide river, arriving 0.50 km downstream, in 6.0 minutes. (a) Calculate the magnitude of its displacement. (b) Calculate the magnitude of its average velocity.', 1300 / 360, 'm s⁻¹',
  '(a) s = √(1.2² + 0.50²) = 1.3 km. (b) v = 1300 ÷ 360 = 3.61 m s⁻¹',
  ['C1: Pythagoras', 'C1: value', 'M1: ÷ time in s', 'C1: value'], aq='v')
N('H', 6, 'A cyclist rides 6.0 km due east at 24 km h⁻¹ and returns 2.0 km due west at 16 km h⁻¹. (a) Calculate the total time. (b) Calculate the average speed. (c) Calculate the average velocity, in km h⁻¹.', 4.0 / (6.0 / 24 + 2.0 / 16), 'km h⁻¹',
  '(a) 0.25 + 0.125 = 0.375 h. (b) 8.0 ÷ 0.375 = 21.3 km h⁻¹. (c) Displacement 4.0 km east; v = 4.0 ÷ 0.375 = 10.7 km h⁻¹ east',
  ['C1: times', 'C1: average speed', 'C1: displacement', 'M1: ÷ time', 'C1: value'], aq='v')
N('H', 5, 'A ball travels at 12 m s⁻¹ towards a wall, rebounds at 9.0 m s⁻¹, and the round trip to the wall 6.0 m away and back to the start takes how long? (a) Calculate the time out. (b) Calculate the time back. (c) Give the total time.', 6.0 / 12 + 6.0 / 9.0, 's',
  f'(a) 6.0 ÷ 12 = 0.50 s. (b) 6.0 ÷ 9.0 = 0.667 s. (c) 0.50 + 0.667 = {sf(0.5 + 6 / 9)} s',
  ['C1: out', 'C1: back', 'M1: add', 'C1: value'], aq='t')

N('E', 2, 'A swimmer crosses a 50 m pool straight across in 40 s. Calculate her average velocity.', 50 / 40, 'm s⁻¹',
  'v = 50 ÷ 40 = 1.25 m s⁻¹ across the pool', ['C1: v = s/t'], aq='v')
M('E', 1, 'A car moves with constant velocity. What must be true?', 'Both its speed and its direction are constant', ['Only its speed is constant', 'Only its direction is constant', 'It is at rest'], 'Constant velocity means no change in magnitude or direction.')
N('M', 3, 'A hare runs 90 m east in 6.0 s and then 30 m west in 4.0 s. Calculate its average velocity.', 60 / 10, 'm s⁻¹',
  'Displacement = 90 − 30 = 60 m east; v = 60 ÷ (6.0 + 4.0) = 6.0 m s⁻¹ east', ['C1: net displacement', 'C1: total time'], sig=2, aq='v')
N('M', 3, 'A car is 2.0 km east of a town at 10:00 and 14.0 km east of it at 10:15. Calculate its average velocity in m s⁻¹.', 12000 / 900, 'm s⁻¹',
  'v = (14 000 − 2000) ÷ 900 = 13.3 m s⁻¹ east', ['C1: displacement', 'C1: time in s'], aq='v')
N('E', 2, 'A ship\'s velocity is 8.0 m s⁻¹ due west. How long does it take to move 2.4 km west?', 2400 / 8.0, 's',
  't = 2400 ÷ 8.0 = 300 s', ['C1: t = s/v'], sig=2, aq='t')
N('H', 5, 'A drone flies 600 m north at 12 m s⁻¹ and then 800 m east at 16 m s⁻¹. (a) Calculate the total time. (b) Calculate the magnitude of its average velocity.', 1000 / 100, 'm s⁻¹',
  '(a) t = 600 ÷ 12 + 800 ÷ 16 = 100 s. (b) s = √(600² + 800²) = 1000 m; v = 1000 ÷ 100 = 10 m s⁻¹', ['C1: times', 'C1: displacement', 'M1: ÷ total time', 'C1: value'], sig=2, aq='v')

# ═════════════════════════ 1.4 Displacement–time graphs (17/20/13) ═════════════════════════
lesson('1.4')
M('E', 1, 'What does the gradient of a displacement–time graph represent?', 'The velocity', ['The acceleration', 'The distance', 'The displacement'], 'The gradient is Δs/Δt, the rate of change of displacement.')
M('E', 1, 'A displacement–time graph is a horizontal line. What does this show?', 'The object is at rest', ['It moves at constant velocity', 'It is accelerating', 'It moves backwards'], 'Displacement does not change.')
M('E', 1, 'A displacement–time graph is a straight sloping line. What does this show?', 'Constant velocity', ['Constant acceleration', 'The object is at rest', 'Changing velocity'], 'A constant gradient means a constant velocity.')
N('E', 2, 'A displacement–time graph is a straight line from (0 s, 0 m) to (8.0 s, 40 m). Calculate the velocity.', 5.0, 'm s⁻¹',
  'v = gradient = 40 ÷ 8.0 = 5.0 m s⁻¹', ['C1: gradient'], sig=2, aq='v')
M('E', 1, 'A displacement–time graph curves upwards, getting steeper. What does this show?', 'The velocity is increasing', ['The velocity is decreasing', 'The object is at rest', 'The velocity is constant'], 'A steeper gradient means a larger velocity.')
N('E', 2, 'Between t = 2.0 s and t = 6.0 s a cyclist\'s displacement rises steadily from 10 m to 30 m. What is her velocity?', 5.0, 'm s⁻¹',
  'v = (30 − 10) ÷ (6.0 − 2.0) = 5.0 m s⁻¹', ['C1: Δs/Δt'], sig=2, aq='v')
M('E', 1, 'On a displacement–time graph, what does a line sloping downwards show?', 'Motion back towards the starting point (negative velocity)', ['The object is slowing down', 'The object is at rest', 'The object is falling'], 'A negative gradient means a negative velocity.')
N('E', 2, 'A displacement–time graph falls in a straight line from 60 m at 0 s to 0 m at 12 s. Calculate the velocity.', -5.0, 'm s⁻¹',
  'v = (0 − 60) ÷ (12 − 0) = −5.0 m s⁻¹', ['C1: negative gradient'], sig=2, sign=True, aq='v')
M('E', 1, 'Which feature of an s–t graph gives the instantaneous velocity at a point on a curve?', 'The gradient of the tangent at that point', ['The area under the graph', 'The value of s at that point', 'The intercept'], 'Draw a tangent and find its gradient.')
N('E', 2, 'An s–t graph is a straight line through the origin with gradient 3.5 m s⁻¹. Calculate the displacement at 12 s.', 42, 'm',
  'From s = vt: s = 3.5 × 12 = 42 m', ['C1: s = vt'], sig=2, aq='s')
M('E', 1, 'Two straight s–t lines start at the origin. Line A is steeper than line B. What does this show?', 'A has the greater velocity', ['B has the greater velocity', 'They have equal velocities', 'A is accelerating'], 'Steeper means a larger Δs per Δt.')
N('E', 2, 'A toy train is 20 m from the station at t = 0 and 80 m away at t = 10 s, and its s–t graph is straight. Find its velocity.', 6.0, 'm s⁻¹',
  'v = (80 − 20) ÷ 10 = 6.0 m s⁻¹', ['C1: gradient'], sig=2, aq='v')
M('E', 1, 'On an s–t graph, what does the intercept on the displacement axis show?', 'The starting displacement at t = 0', ['The final velocity', 'The acceleration', 'The total time'], 'At t = 0 the graph gives s₀.')
N('E', 2, 'A car\'s s–t graph rises in a straight line by 150 m in 6.0 s. Calculate its velocity.', 25, 'm s⁻¹',
  'v = 150 ÷ 6.0 = 25 m s⁻¹', ['C1: gradient'], sig=2, aq='v')
M('E', 1, 'A displacement–time graph becomes less steep with time. What is happening?', 'The object is slowing down', ['The object is speeding up', 'The object is stationary', 'The object is moving backwards at constant speed'], 'A decreasing gradient means a decreasing velocity.')
N('E', 2, 'A walker\'s s–t graph is a straight line through (0 s, 0 m) and (50 s, 70 m). Calculate her velocity.', 1.4, 'm s⁻¹',
  'v = 70 ÷ 50 = 1.4 m s⁻¹', ['C1: gradient'], sig=2, aq='v')
M('E', 1, 'Can a displacement–time graph be a vertical line?', 'No, it would mean infinite velocity', ['Yes, for a stationary object', 'Yes, for constant speed', 'Yes, when accelerating'], 'An object cannot change position in zero time.')
# medium
N('M', 3, 'An s–t graph has these straight sections: 0–4.0 s from 0 to 20 m; 4.0–10 s constant at 20 m; 10–14 s from 20 m back to 0. Calculate the velocity in the last section.', -20 / 4.0, 'm s⁻¹',
  'v = (0 − 20) ÷ (14 − 10) = −5.0 m s⁻¹', ['C1: Δs', 'C1: Δt and sign'], sig=2, sign=True, aq='v')
N('M', 3, 'An s–t graph has these straight sections: 0–4.0 s from 0 to 20 m; 4.0–10 s constant at 20 m; 10–14 s from 20 m back to 0. Calculate the average speed over the 14 s.', 40 / 14, 'm s⁻¹',
  'Distance = 20 + 20 = 40 m. Speed = 40 ÷ 14 = 2.86 m s⁻¹', ['C1: distance out and back', 'C1: ÷ 14 s'], aq='speed')
N('M', 3, 'A tangent drawn to a curved s–t graph at t = 5.0 s passes through (2.0 s, 4.0 m) and (8.0 s, 31 m). Calculate the instantaneous velocity at 5.0 s.', 27 / 6.0, 'm s⁻¹',
  'v = (31 − 4.0) ÷ (8.0 − 2.0) = 4.5 m s⁻¹', ['C1: gradient of tangent', 'C1: value'], sig=2, aq='v')
M('M', 3, 'A ball\'s s–t graph is a curve that rises, levels off at the top and falls. What happens at the top?', 'The velocity is momentarily zero', ['The velocity is greatest', 'The acceleration is zero', 'The ball stops for a long time'], 'Zero gradient means zero velocity.', ['C1: gradient zero', 'C1: velocity zero'])
N('M', 3, 'Two runners start together. Runner A\'s s–t graph has gradient 6.0 m s⁻¹ and runner B\'s 5.0 m s⁻¹. How far ahead is A after 40 s?', 40, 'm',
  'Gap = (6.0 − 5.0) × 40 = 40 m', ['C1: difference in gradients', 'C1: × time'], sig=2, aq='Δs')
N('M', 3, 'A car\'s s–t graph is a straight line through (5.0 s, 30 m) and (15 s, 230 m). Find where the line meets the s axis (t = 0).', 30 - 20 * 5.0, 'm',
  'v = (230 − 30) ÷ (15 − 5.0) = 20 m s⁻¹. s₀ = 30 − 20 × 5.0 = −70 m', ['C1: gradient', 'C1: extrapolate to t = 0'], sig=2, sign=True, aq='s₀')
M('M', 3, 'How does an s–t graph show that an object is accelerating?', 'The graph is curved, with its gradient changing', ['The graph is a straight line', 'The graph is horizontal', 'The graph passes through the origin'], 'A changing gradient means a changing velocity.', ['C1: curved', 'C1: gradient changes'])
N('M', 3, 'An object moves so that s = 2.0t² (s in m, t in s). Calculate the average velocity between t = 1.0 s and t = 3.0 s.', (2 * 9 - 2 * 1) / 2, 'm s⁻¹',
  's(1.0) = 2.0 m; s(3.0) = 18 m. v = (18 − 2.0) ÷ (3.0 − 1.0) = 8.0 m s⁻¹', ['C1: both displacements', 'C1: gradient of chord'], sig=2, aq='v')
N('M', 3, 'A car moving at a steady 15 m s⁻¹ passes a marker at t = 0 at s = 40 m. Calculate its displacement at t = 8.0 s.', 40 + 15 * 8.0, 'm',
  's = 40 + 15 × 8.0 = 160 m', ['C1: s = s₀ + vt', 'C1: value'], sig=2, aq='s')
M('M', 3, 'Two s–t graphs cross at t = 6.0 s. What does this show?', 'The two objects are at the same position at 6.0 s', ['They have the same velocity at 6.0 s', 'They both stop at 6.0 s', 'They collide at 6.0 s with equal speeds'], 'Equal s at the same t means the same place.', ['C1: same displacement', 'C1: not same velocity'])
N('M', 3, 'A runner at constant speed passes 120 m at 20 s and 210 m at 35 s. Calculate her velocity.', 90 / 15, 'm s⁻¹',
  'v = (210 − 120) ÷ (35 − 20) = 6.0 m s⁻¹', ['C1: Δs', 'C1: Δt'], sig=2, aq='v')
N('M', 3, 'A lift\'s s–t graph rises from 0 to 12 m between 0 and 8.0 s, stays at 12 m until 15 s, then falls to 4.0 m at 19 s. Calculate the velocity between 15 s and 19 s.', -8 / 4, 'm s⁻¹',
  'v = (4.0 − 12) ÷ (19 − 15) = −2.0 m s⁻¹', ['C1: Δs negative', 'C1: value'], sig=2, sign=True, aq='v')
N('M', 4, 'The lift whose s–t graph rises from 0 to 12 m in 8.0 s, waits until 15 s and descends to 4.0 m at 19 s: calculate its average velocity over the 19 s.', 4.0 / 19, 'm s⁻¹',
  'Displacement = 4.0 − 0 = 4.0 m; v = 4.0 ÷ 19 = 0.211 m s⁻¹', ['M1: start to finish displacement', 'C1: total time', 'C1: value'], aq='v')
M('M', 3, 'A curved s–t graph has a tangent of gradient 8.0 m s⁻¹ at 3.0 s and 12 m s⁻¹ at 5.0 s. What does this show?', 'The object is accelerating', ['It is decelerating', 'It moves at constant velocity', 'It is at rest'], 'Velocity increases from 8.0 to 12 m s⁻¹.', ['C1: tangent gradients', 'C1: velocity increasing'])
N('M', 3, 'From the tangents to an s–t graph, the velocity is 8.0 m s⁻¹ at 3.0 s and 12 m s⁻¹ at 5.0 s. Calculate the average acceleration between these times.', 4.0 / 2.0, 'm s⁻²',
  'a = (12 − 8.0) ÷ (5.0 − 3.0) = 2.0 m s⁻²', ['C1: Δv', 'C1: ÷ Δt'], sig=2, aq='a')
N('M', 3, 'A cyclist\'s s–t graph is a straight line through (0 s, 500 m) and (100 s, 0 m). When does she pass the 200 m mark?', (500 - 200) / 5.0, 's',
  'v = −500 ÷ 100 = −5.0 m s⁻¹. t = (500 − 200) ÷ 5.0 = 60 s', ['C1: velocity', 'C1: time'], sig=2, aq='t')
M('M', 3, 'Why can an s–t graph show the direction of motion but a distance–time graph cannot?', 'Displacement can be negative or decrease, but distance only increases', ['Distance is a vector', 'Displacement has no direction', 'Time can be negative'], 'Distance never decreases.', ['C1: displacement signed', 'C1: distance never decreases'])
N('M', 3, 'A train\'s s–t graph shows 1.2 km at 2.0 min and 4.8 km at 5.0 min, in a straight line. Calculate its velocity in m s⁻¹.', 3600 / 180, 'm s⁻¹',
  'v = (4800 − 1200) ÷ ((5.0 − 2.0) × 60) = 20 m s⁻¹', ['C1: units', 'C1: gradient'], sig=2, aq='v')
# hard
N('H', 5, 'Car A starts at s = 0 at 20 m s⁻¹. Car B starts at s = 200 m at the same time and moves at 12 m s⁻¹ in the same direction. (a) Write s for each car in terms of t. (b) Calculate when their s–t lines cross.', 200 / 8, 's',
  '(a) s_A = 20t; s_B = 200 + 12t. (b) 20t = 200 + 12t gives t = 200 ÷ 8 = 25 s',
  ['B1: equations', 'M1: equate', 'C1: rearrange', 'C1: value'], sig=2, aq='t')
N('H', 6, 'An object has s = 5.0t − t² (s in m, t in s). (a) Calculate s at t = 1.0 s and t = 4.0 s. (b) Find when its s–t graph is at a maximum. (c) Calculate the maximum displacement.', 5.0 * 2.5 - 2.5 ** 2, 'm',
  '(a) s(1.0) = 4.0 m; s(4.0) = 4.0 m. (b) By symmetry the maximum is midway: t = (1.0 + 4.0) ÷ 2 = 2.5 s. (c) s = 5.0 × 2.5 − 2.5² = 6.25 m',
  ['C1: s values', 'M1: symmetry or zero gradient', 'C1: t = 2.5 s', 'M1: substitute', 'C1: value'], aq='s_max')
N('H', 5, 'A tangent to a curved s–t graph at t = 4.0 s passes through (1.0 s, 0 m) and (6.0 s, 40 m). A tangent at t = 8.0 s passes through (5.0 s, 20 m) and (10 s, 100 m). (a) Calculate both velocities. (b) Calculate the average acceleration.', (80 / 5.0 - 40 / 5.0) / 4.0, 'm s⁻²',
  '(a) 40 ÷ 5.0 = 8.0 m s⁻¹ and 80 ÷ 5.0 = 16 m s⁻¹. (b) a = (16 − 8.0) ÷ (8.0 − 4.0) = 2.0 m s⁻²',
  ['C1: first gradient', 'C1: second gradient', 'M1: a = Δv/Δt', 'C1: value'], sig=2, aq='a')
N('H', 6, 'A walker leaves home at 1.5 m s⁻¹. 200 s later her brother leaves home along the same path at 2.5 m s⁻¹. (a) Write s for each in terms of t (from when she leaves). (b) Calculate when he catches her. (c) Calculate how far from home this is.', 1.5 * 500, 'm',
  '(a) s₁ = 1.5t; s₂ = 2.5(t − 200). (b) 1.5t = 2.5t − 500 gives t = 500 s. (c) s = 1.5 × 500 = 750 m',
  ['B1: first equation', 'B1: second equation with delay', 'M1: equate', 'C1: t', 'C1: distance'], sig=2, aq='s')
N('H', 5, 'A ball is thrown upwards. Its s–t graph is a parabola reaching 11.25 m at 1.5 s and returning to 0 at 3.0 s. (a) State its velocity at 1.5 s. (b) Calculate the average velocity between 0 and 1.5 s.', 11.25 / 1.5, 'm s⁻¹',
  '(a) Zero (the graph is horizontal at the top). (b) v = 11.25 ÷ 1.5 = 7.5 m s⁻¹',
  ['B1: zero at top', 'M1: chord gradient', 'C1: substitution', 'C1: value'], sig=2, aq='v')
N('H', 6, 'An s–t graph: 0 to 6.0 s rises from 0 to 18 m (straight); 6.0 to 9.0 s horizontal; 9.0 to 15 s falls to −6.0 m (straight). (a) Calculate the velocity in each moving section. (b) Calculate the total distance. (c) Calculate the average speed.', (18 + 24) / 15, 'm s⁻¹',
  '(a) 18 ÷ 6.0 = 3.0 m s⁻¹; (−6.0 − 18) ÷ 6.0 = −4.0 m s⁻¹. (b) 18 + 24 = 42 m. (c) 42 ÷ 15 = 2.8 m s⁻¹',
  ['C1: first velocity', 'C1: second velocity', 'C1: distance', 'M1: ÷ 15 s', 'C1: value'], sig=2, aq='speed')
N('H', 5, 'A cyclist rides at constant velocity and is at 80 m at t = 4.0 s and 200 m at t = 12 s. (a) Calculate her velocity. (b) Calculate her displacement at t = 0. (c) Calculate when she passes 300 m.', (300 - 20) / 15, 's',
  '(a) v = 120 ÷ 8.0 = 15 m s⁻¹. (b) s₀ = 80 − 15 × 4.0 = 20 m. (c) t = (300 − 20) ÷ 15 = 18.7 s',
  ['C1: velocity', 'C1: s₀', 'M1: rearrange s = s₀ + vt', 'C1: value'], aq='t')
N('H', 6, 'An object obeys s = 0.50t³ (s in m, t in s). (a) Calculate s at 2.0 s and 2.2 s. (b) Estimate the velocity at about 2.1 s from these values. (c) Explain why this is only an estimate.', (0.5 * 2.2 ** 3 - 0.5 * 8) / 0.2, 'm s⁻¹',
  f'(a) 4.0 m and {sf(0.5 * 2.2 ** 3, 4)} m. (b) v = ({sf(0.5 * 2.2 ** 3, 4)} − 4.0) ÷ 0.2 = {sf((0.5 * 2.2 ** 3 - 4) / 0.2)} m s⁻¹. (c) It is the gradient of a chord, not of the tangent.',
  ['C1: s(2.0)', 'C1: s(2.2)', 'M1: chord gradient', 'C1: value', 'B1: chord not tangent'], aq='v')
N('H', 5, 'Two trains approach each other on parallel tracks. Train P is at s = 0 moving at +25 m s⁻¹; train Q is at s = 1500 m moving at −35 m s⁻¹. (a) Write s for each. (b) Calculate when they pass each other.', 1500 / 60, 's',
  '(a) s_P = 25t; s_Q = 1500 − 35t. (b) 25t = 1500 − 35t gives t = 1500 ÷ 60 = 25 s',
  ['B1: s_P', 'B1: s_Q', 'M1: equate', 'C1: value'], sig=2, aq='t')
N('E', 2, 'On a straight s–t graph a trolley moves from 0.40 m at 1.0 s to 1.60 m at 4.0 s. Calculate its velocity.', 1.2 / 3.0, 'm s⁻¹',
  'v = (1.60 − 0.40) ÷ (4.0 − 1.0) = 0.40 m s⁻¹', ['C1: Δs/Δt'], sig=2, aq='v')
M('E', 1, 'What does the area under a displacement–time graph represent?', 'It has no useful physical meaning', ['The velocity', 'The acceleration', 'The distance travelled'], 'Velocity comes from the gradient; area is used for v–t graphs.')
N('M', 3, 'A car\'s s–t graph rises in straight lines from 0 to 300 m in the first 20 s and from 300 m to 700 m in the next 40 s. Calculate its average velocity over the 60 s.', 700 / 60, 'm s⁻¹',
  'v = 700 ÷ 60 = 11.7 m s⁻¹', ['C1: total displacement', 'C1: total time'], aq='v')
N('M', 3, 'For a car whose s–t graph rises from 300 m at 20 s to 700 m at 60 s in a straight line, calculate its velocity in that interval.', 400 / 40, 'm s⁻¹',
  'v = (700 − 300) ÷ (60 − 20) = 10 m s⁻¹', ['C1: Δs', 'C1: Δt'], sig=2, aq='v')
N('M', 3, 'A tangent to the s–t graph of a falling ball at t = 3.0 s passes through (2.0 s, 5.0 m) and (4.0 s, 64 m). Calculate the ball\'s speed at 3.0 s.', 59 / 2.0, 'm s⁻¹',
  'v = (64 − 5.0) ÷ (4.0 − 2.0) = 29.5 m s⁻¹', ['C1: tangent gradient', 'C1: value'], aq='v')
N('H', 5, 'Object A\'s s–t graph is a straight line through the origin with gradient 4.0 m s⁻¹. Object B\'s starts at 60 m with gradient −2.0 m s⁻¹. (a) Write an equation for each line. (b) Calculate the displacement where the lines cross.', 4.0 * 10, 'm',
  '(a) s_A = 4.0t; s_B = 60 − 2.0t. (b) 4.0t = 60 − 2.0t gives t = 60 ÷ 6.0 = 10 s, so s = 4.0 × 10 = 40 m', ['B1: equations', 'M1: equate', 'C1: t = 10 s', 'C1: value'], sig=2, aq='s')
M('E', 1, 'A car slows down and stops at traffic lights. Which shape is its s–t graph?', 'A curve that becomes less steep and levels off to horizontal', ['A straight line through the origin', 'A curve that becomes steeper', 'A horizontal line throughout'], 'The gradient (velocity) falls to zero.')
