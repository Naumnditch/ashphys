# Chapter 2 Accelerated motion: 2.6 to 2.10.


def suvat_v(u, a, t):
    return u + a * t


def suvat_s(u, a, t):
    return u * t + 0.5 * a * t * t


# ═════════════════════════ 2.6 Measuring velocity and acceleration (17/20/13) ═════════════════════════
lesson('2.6')
M('E', 1, 'A light gate is connected to a timer. What does it measure directly?', 'The time for which an object blocks its beam', ['The speed of the object', 'The distance travelled', 'The acceleration'], 'Speed is then found from the length of the card ÷ the time.')
N('E', 2, 'A 5.0 cm card on a trolley blocks a light gate for 0.10 s. Calculate the speed of the trolley.', 0.050 / 0.10, 'm s⁻¹',
  'v = 0.050 ÷ 0.10 = 0.50 m s⁻¹', ['C1: length ÷ time'], sig=2, aq='v')
M('E', 1, 'Why is a light gate better than a stopwatch for timing a fast trolley?', 'It removes human reaction time and times to the millisecond', ['It is cheaper', 'It also measures mass', 'It needs no electricity'], 'Electronic timing is far more precise for short times.')
N('E', 2, 'A ticker-timer makes 50 dots per second. What time interval separates two adjacent dots?', 1 / 50, 's',
  't = 1 ÷ 50 = 0.020 s', ['C1: 1/f'], sig=2, aq='t')
M('E', 1, 'On a ticker tape from a trolley, the dots get further apart along the tape. What does this show?', 'The trolley was accelerating', ['It was decelerating', 'It moved at constant speed', 'It was at rest'], 'Equal times with increasing distances mean increasing speed.')
N('E', 2, 'Five dot-spaces on a 50 Hz ticker tape measure 4.0 cm. Calculate the average speed over these spaces.', 0.040 / 0.10, 'm s⁻¹',
  't = 5 × 0.020 = 0.10 s; v = 0.040 ÷ 0.10 = 0.40 m s⁻¹', ['C1: time for 5 spaces'], sig=2, aq='v')
M('E', 1, 'How does an ultrasonic motion sensor find the distance to a trolley?', 'It times how long an ultrasound pulse takes to reflect back', ['It weighs the trolley', 'It counts dots on a tape', 'It measures light intensity'], 'distance = speed of sound × time ÷ 2.')
N('E', 2, 'A video camera records 25 frames per second. What time passes between successive frames?', 1 / 25, 's',
  't = 1 ÷ 25 = 0.040 s', ['C1: 1/frame rate'], sig=2, aq='t')
N('E', 2, 'Between two video frames 0.040 s apart, a ball moves 18 cm. Calculate its average speed.', 0.18 / 0.040, 'm s⁻¹',
  'v = 0.18 ÷ 0.040 = 4.5 m s⁻¹', ['C1: cm to m'], sig=2, aq='v')
M('E', 1, 'Which quantity must be measured, together with the speeds at two light gates, to find the acceleration?', 'The time taken to travel between the gates', ['The mass of the trolley', 'The length of the ramp only', 'The height of the gates'], 'a = (v − u)/t, so the time between the gates is needed.')
N('E', 2, 'A trolley passes gate A at 0.30 m s⁻¹ and gate B at 0.70 m s⁻¹, 0.50 s later. Calculate its acceleration.', 0.40 / 0.50, 'm s⁻²',
  'a = (0.70 − 0.30) ÷ 0.50 = 0.80 m s⁻²', ['C1: Δv/t'], sig=2, aq='a')
M('E', 1, 'In a stroboscopic photograph, a falling ball appears at equal time intervals. How does the photo show that the ball accelerates?', 'The gaps between successive images increase', ['The images get smaller', 'The gaps stay the same', 'The ball appears blurred'], 'Larger distances in equal times mean larger speeds.')
N('E', 1, 'A stroboscope flashes 20 times per second. What is the time between flashes?', 0.050, 's',
  't = 1 ÷ 20 = 0.050 s', [], sig=2, aq='t')
M('E', 1, 'What is an advantage of using a data logger with a motion sensor?', 'It records many readings very quickly and can plot graphs directly', ['It removes all systematic errors', 'It needs no calibration', 'It measures mass as well'], 'Useful for rapidly changing motion.')
N('E', 2, 'An ultrasound pulse from a motion sensor returns after 0.012 s. Sound travels at 340 m s⁻¹. How far away is the trolley?', 340 * 0.012 / 2, 'm',
  'd = 340 × 0.012 ÷ 2 = 2.04 m', ['C1: halve the echo time'], aq='d')
M('E', 1, 'Why should the card on a trolley be narrow when finding its speed at one point with a light gate?', 'The speed changes little while the card passes, so it is close to the instantaneous speed', ['Narrow cards are cheaper', 'It makes the trolley lighter', 'It increases the time measured'], 'The measured value is an average over the card length.')
N('E', 2, 'A ball in a multiflash photograph moves 12 cm between flashes 0.050 s apart. Calculate its speed.', 0.12 / 0.050, 'm s⁻¹',
  'v = 0.12 ÷ 0.050 = 2.4 m s⁻¹', ['C1: d/t'], sig=2, aq='v')
N('E', 2, 'A 10 cm card on a falling object cuts a light beam for 0.025 s. Calculate its speed.', 0.10 / 0.025, 'm s⁻¹',
  'v = 0.10 ÷ 0.025 = 4.0 m s⁻¹', ['C1: length ÷ time'], sig=2, aq='v')
# medium
N('M', 3, 'A 4.0 cm card blocks gate A for 0.080 s and gate B for 0.040 s; the trolley takes 0.60 s from A to B. Calculate its acceleration.', ((0.04 / 0.04) - (0.04 / 0.08)) / 0.60, 'm s⁻²',
  'u = 0.040 ÷ 0.080 = 0.50 m s⁻¹; v = 0.040 ÷ 0.040 = 1.0 m s⁻¹; a = (1.0 − 0.50) ÷ 0.60 = 0.833 m s⁻²', ['C1: both speeds', 'C1: a = Δv/t'], aq='a')
N('M', 3, 'A double-interrupt card has two 2.0 cm segments. A single light gate records 0.040 s for the first and 0.025 s for the second, with 0.30 s between the starts of the two blocks. Calculate the acceleration.', ((0.02 / 0.025) - (0.02 / 0.040)) / 0.30, 'm s⁻²',
  'u = 0.020 ÷ 0.040 = 0.50 m s⁻¹; v = 0.020 ÷ 0.025 = 0.80 m s⁻¹; a = (0.80 − 0.50) ÷ 0.30 = 1.0 m s⁻²', ['C1: speeds', 'C1: a'], sig=2, aq='a')
M('M', 3, 'Why do speeds from a light gate tend to be slightly lower than the instantaneous speed at the gate for an accelerating trolley?', 'The light gate gives the average speed over the card, which matches the speed at the middle of the card\'s time, not when its front reaches the beam', ['The beam slows the trolley', 'The card is always too wide', 'The timer starts late'], 'For uniform acceleration the average equals the speed at mid-time.', ['C1: average over card', 'C1: mid-time speed'])
N('M', 3, 'On a 50 Hz ticker tape, the first 5-space section measures 2.0 cm and the next 5-space section 3.5 cm. Calculate the acceleration of the tape.', ((0.035 / 0.10) - (0.020 / 0.10)) / 0.10, 'm s⁻²',
  'v₁ = 0.020 ÷ 0.10 = 0.20 m s⁻¹; v₂ = 0.035 ÷ 0.10 = 0.35 m s⁻¹; the mid-points are 0.10 s apart: a = (0.35 − 0.20) ÷ 0.10 = 1.5 m s⁻²', ['C1: speeds', 'C1: time between mid-points'], sig=2, aq='a')
N('M', 3, 'A motion sensor records a trolley at 0.40 m at t = 0 and 0.85 m at t = 0.50 s. Calculate its average velocity.', 0.45 / 0.50, 'm s⁻¹',
  'v = (0.85 − 0.40) ÷ 0.50 = 0.90 m s⁻¹', ['C1: Δs', 'C1: ÷ Δt'], sig=2, aq='v')
M('M', 3, 'A student finds that the ticker-timer frequency is really 48 Hz, not 50 Hz. How does this affect her calculated speeds?', 'Her speeds are too high, because each interval is really longer than 0.020 s', ['Her speeds are too low', 'They are unaffected', 'Only the accelerations are affected'], 'v = d/t with t underestimated gives v too large.', ['C1: true interval longer', 'C1: v overestimated'])
N('M', 3, 'In a video at 30 frames per second, a cyclist moves 0.42 m between frames 10 and 11 and 0.48 m between frames 20 and 21. Calculate her average acceleration.', ((0.48 * 30) - (0.42 * 30)) / (10 / 30), 'm s⁻²',
  'v₁ = 0.42 × 30 = 12.6 m s⁻¹; v₂ = 0.48 × 30 = 14.4 m s⁻¹; Δt = 10 ÷ 30 = 0.333 s; a = (14.4 − 12.6) ÷ 0.3333 = 5.4 m s⁻²', ['C1: speeds', 'C1: time between'], sig=2, aq='a')
N('M', 3, 'Two light gates 0.80 m apart are passed in 0.50 s by a trolley whose speed at the first gate is 1.2 m s⁻¹. Assuming uniform acceleration, calculate its speed at the second gate.', 2 * 0.80 / 0.50 - 1.2, 'm s⁻¹',
  'Average speed = 0.80 ÷ 0.50 = 1.6 m s⁻¹ = (u + v)/2, so v = 2 × 1.6 − 1.2 = 2.0 m s⁻¹', ['C1: average speed', 'C1: (u + v)/2'], sig=2, aq='v')
M('M', 3, 'A strobe photo of a ball rolling down a slope shows images 2.0 cm, 4.0 cm, 6.0 cm, 8.0 cm apart. What does this show?', 'Uniform acceleration, because the gaps increase by equal amounts', ['Constant speed', 'Non-uniform acceleration', 'Deceleration'], 'Equal increases in distance per interval mean equal increases in speed.', ['C1: equal increments', 'C1: constant a'])
N('M', 3, 'In the strobe photo with gaps 2.0, 4.0, 6.0 and 8.0 cm at 0.10 s intervals, calculate the acceleration.', 0.020 / 0.10 ** 2, 'm s⁻²',
  'The gap increases by 2.0 cm each interval: a = Δs ÷ T² = 0.020 ÷ 0.10² = 2.0 m s⁻²', ['C1: increment', 'C1: a = Δs/T²'], sig=2, aq='a')
N('M', 4, 'A sound pulse returns to a motion sensor after 6.0 ms, and 0.20 s later a pulse returns after 9.0 ms. Taking sound speed 340 m s⁻¹, calculate the trolley\'s average speed between the pulses.', (340 * 9.0e-3 / 2 - 340 * 6.0e-3 / 2) / 0.20, 'm s⁻¹',
  'd₁ = 340 × 6.0 × 10⁻³ ÷ 2 = 1.02 m; d₂ = 340 × 9.0 × 10⁻³ ÷ 2 = 1.53 m; v = (1.53 − 1.02) ÷ 0.20 = 2.55 m s⁻¹', ['C1: first distance', 'C1: second distance', 'C1: v'], aq='v')
M('M', 3, 'Which source of error is reduced by using a narrower card on a light gate?', 'The difference between average speed over the card and the speed at the gate', ['Reaction time', 'Zero error in the timer', 'Friction on the track'], 'A shorter card gives a speed closer to the instantaneous value.', ['C1: average vs instantaneous', 'C1: shorter time interval'])
N('M', 3, 'A trolley accelerates uniformly from rest past a light gate 0.45 m down a ramp. The 5.0 cm card takes 0.050 s to pass. Calculate the acceleration (use v² = 2as).', (0.050 / 0.050) ** 2 / (2 * 0.45), 'm s⁻²',
  'v = 0.050 ÷ 0.050 = 1.0 m s⁻¹; a = 1.0² ÷ (2 × 0.45) = 1.11 m s⁻²', ['C1: v', 'C1: a = v²/2s'], aq='a')
M('M', 3, 'Why might a motion sensor give unreliable readings for a trolley very close to it?', 'The echo returns before the sensor is ready to detect it (minimum range)', ['Sound travels too slowly', 'The trolley absorbs all sound', 'The trolley is too heavy'], 'Sensors have a minimum working distance.', ['C1: minimum range', 'C1: echo timing'])
N('M', 3, 'A falling ball is filmed at 50 frames per second. It moves 3.9 cm between two frames and 4.3 cm between the next two. Calculate its acceleration.', (0.043 - 0.039) / 0.020 ** 2, 'm s⁻²',
  'a = Δs ÷ T² = (0.043 − 0.039) ÷ 0.020² = 10 m s⁻²', ['C1: T = 0.020 s', 'C1: a = Δs/T²'], sig=2, aq='a')
N('M', 3, 'A light gate timer reads 0.0625 s for a 2.5 cm card. Calculate the speed.', 0.025 / 0.0625, 'm s⁻¹',
  'v = 0.025 ÷ 0.0625 = 0.40 m s⁻¹', ['C1: cm to m', 'C1: v'], sig=2, aq='v')
M('M', 3, 'How could the acceleration of a trolley be measured using only one light gate?', 'Use a double-interrupt card and measure each block time and the time between them', ['It cannot be done', 'Use a wider card', 'Measure the mass'], 'Two speeds and the time between them give a.', ['C1: two segments', 'C1: two speeds and interval'])
N('M', 3, 'A ticker tape section of 10 spaces (50 Hz) is 9.0 cm long. Calculate the average speed in this section.', 0.090 / 0.20, 'm s⁻¹',
  't = 10 × 0.020 = 0.20 s; v = 0.090 ÷ 0.20 = 0.45 m s⁻¹', ['C1: time', 'C1: v'], sig=2, aq='v')
# hard
N('H', 5, 'A trolley carrying a 3.0 cm card passes gate A (block time 0.060 s) and gate B (block time 0.030 s). Gates A and B are 0.50 m apart. (a) Calculate both speeds. (b) Use v² = u² + 2as to find the acceleration.', ((0.03 / 0.03) ** 2 - (0.03 / 0.06) ** 2) / (2 * 0.50), 'm s⁻²',
  '(a) u = 0.030 ÷ 0.060 = 0.50 m s⁻¹; v = 0.030 ÷ 0.030 = 1.0 m s⁻¹. (b) a = (1.0² − 0.50²) ÷ (2 × 0.50) = 0.75 m s⁻²',
  ['C1: u', 'C1: v', 'M1: v² = u² + 2as', 'C1: value'], sig=2, aq='a')
N('H', 6, 'A strobe flashing at 10 Hz photographs a ball dropped from rest. The images are at 0, 4.9, 19.6, 44.1 and 78.4 cm below the release point. (a) Find the gaps between images. (b) Find the increase in gap per interval. (c) Calculate g.', (0.343 - 0.245) / 0.10 ** 2, 'm s⁻²',
  '(a) 4.9, 14.7, 24.5, 34.3 cm. (b) 9.8 cm each interval. (c) g = Δs ÷ T² = 0.098 ÷ 0.10² = 9.8 m s⁻²',
  ['C1: gaps', 'C1: equal increment', 'M1: Δs = aT²', 'C1: T = 0.10 s', 'C1: value'], sig=2, aq='g')
N('H', 5, 'A motion sensor gives a trolley\'s displacement as 0.20 m at 0.0 s, 0.30 m at 0.5 s and 0.50 m at 1.0 s. (a) Calculate the average velocity in each half-second. (b) Calculate the acceleration, assuming it is uniform.', (0.40 - 0.20) / 0.5, 'm s⁻²',
  '(a) 0.10 ÷ 0.5 = 0.20 m s⁻¹; 0.20 ÷ 0.5 = 0.40 m s⁻¹. (b) These are the speeds at 0.25 s and 0.75 s: a = (0.40 − 0.20) ÷ 0.5 = 0.40 m s⁻²',
  ['C1: first velocity', 'C1: second velocity', 'M1: mid-interval times', 'C1: value'], sig=2, aq='a')
_TB = (-0.40 + sqrt(0.16 + 4 * 1.0 * 0.010)) / 2
N('H', 6, 'A 1.0 cm card is used at a light gate on a trolley accelerating at 2.0 m s⁻². The trolley reaches the gate at 0.40 m s⁻¹. (a) Use s = ut + ½at² to find the block time. (b) Calculate the speed the light gate reports. (c) Calculate the percentage difference from 0.40 m s⁻¹.', (0.010 / _TB - 0.40) / 0.40 * 100, '%',
  f'(a) Solving 1.0t² + 0.40t − 0.010 (set to zero) gives t ≈ {sf(_TB, 4)} s. (b) v = 0.010 ÷ {sf(_TB, 4)} = {sf(0.010 / _TB, 4)} m s⁻¹. (c) % = ({sf(0.010 / _TB, 4)} − 0.40) ÷ 0.40 × 100 = {sf((0.010 / _TB - 0.4) / 0.4 * 100)} %',
  ['M1: quadratic set up', 'C1: t', 'C1: reported speed', 'M1: % difference', 'C1: value'], aq='% difference')
N('H', 5, 'A ticker tape (50 Hz) is cut into 5-space strips of lengths 1.0, 1.8, 2.6, 3.4 and 4.2 cm. (a) Explain why the strips can be used as a v–t graph. (b) Calculate the acceleration.', 0.0080 / 0.10 / 0.10, 'm s⁻²',
  '(a) Each strip is the distance in 0.10 s, proportional to the average speed. (b) Each strip is 0.8 cm longer, so Δv = 0.0080 ÷ 0.10 = 0.080 m s⁻¹ per 0.10 s: a = 0.080 ÷ 0.10 = 0.80 m s⁻²',
  ['B1: strip length ∝ speed', 'C1: Δv per strip', 'M1: a = Δv/Δt', 'C1: value'], sig=2, aq='a')
N('H', 5, 'A ball rolls down a ramp and passes two light gates 0.60 m apart. Its speeds are 0.80 m s⁻¹ and 1.4 m s⁻¹. (a) Calculate the time between the gates, assuming uniform acceleration. (b) Calculate the acceleration.', (1.4 - 0.80) / (0.60 / ((0.80 + 1.4) / 2)), 'm s⁻²',
  f'(a) t = 0.60 ÷ ((0.80 + 1.4) ÷ 2) = {sf(0.6 / 1.1, 4)} s. (b) a = (1.4 − 0.80) ÷ {sf(0.6 / 1.1, 4)} = {sf(0.6 / (0.6 / 1.1))} m s⁻²',
  ['M1: average speed', 'C1: time', 'M1: a = Δv/t', 'C1: value'], aq='a')
N('H', 6, 'A camera at 240 frames per second films a sprinter\'s start. Her hip moves 1.0 cm between frames 1 and 2 and 2.5 cm between frames 61 and 62. (a) Calculate her speed at each time. (b) Calculate the time between the two measurements. (c) Calculate her average acceleration.', (0.025 * 240 - 0.010 * 240) / (60 / 240), 'm s⁻²',
  '(a) 0.010 × 240 = 2.4 m s⁻¹; 0.025 × 240 = 6.0 m s⁻¹. (b) 60 ÷ 240 = 0.25 s. (c) a = (6.0 − 2.4) ÷ 0.25 = 14.4 m s⁻²',
  ['C1: first speed', 'C1: second speed', 'C1: time', 'M1: a = Δv/t', 'C1: value'], aq='a')
N('H', 5, 'A student uses a stopwatch to time a trolley over 2.00 m and gets 1.60 s, with a reaction-time uncertainty of ±0.2 s. (a) Calculate the average speed. (b) Calculate the percentage uncertainty in the speed.', 0.2 / 1.60 * 100, '%',
  '(a) v = 2.00 ÷ 1.60 = 1.25 m s⁻¹. (b) % = 0.2 ÷ 1.60 × 100 = 12.5 %',
  ['C1: speed', 'M1: % in time', 'C1: same % in speed', 'C1: value'], aq='% uncertainty')
N('H', 5, 'A falling card 8.0 cm long passes a light gate 0.50 m below its release point. (a) Calculate the speed at the gate from v² = 2gh. (b) Calculate the time the card takes to pass the gate, ignoring the change in speed.' + take('g'), 0.080 / sqrt(2 * 9.81 * 0.50), 's',
  f'(a) v = √(2 × 9.81 × 0.50) = {sf(sqrt(9.81), 4)} m s⁻¹. (b) t = 0.080 ÷ {sf(sqrt(9.81), 4)} = {sf(0.08 / sqrt(9.81))} s',
  ['M1: v² = 2gh', 'C1: speed', 'M1: t = L/v', 'C1: value'], aq='t')

N('E', 2, 'A motion sensor takes 20 readings per second. What time separates successive position readings?', 1 / 20, 's',
  't = 1 ÷ 20 = 0.050 s', ['C1: 1/rate'], sig=2, aq='t')
N('E', 2, 'A ball rolls between two marks 0.36 m apart in 0.90 s. Calculate its average speed.', 0.40, 'm s⁻¹',
  'v = 0.36 ÷ 0.90 = 0.40 m s⁻¹', ['C1: d/t'], sig=2, aq='v')
N('M', 3, 'A 4.8 cm card blocks the first light gate for 0.12 s and a second gate 0.80 s later for 0.080 s. Calculate the acceleration.', ((0.048 / 0.080) - (0.048 / 0.12)) / 0.80, 'm s⁻²',
  'u = 0.048 ÷ 0.12 = 0.40 m s⁻¹; v = 0.048 ÷ 0.080 = 0.60 m s⁻¹; a = (0.60 − 0.40) ÷ 0.80 = 0.25 m s⁻²', ['C1: speeds', 'C1: a'], sig=2, aq='a')
N('M', 3, 'A 25 Hz stroboscope photographs a trolley; successive gaps are 1.6 cm, 2.0 cm and 2.4 cm. Calculate the acceleration.', 0.004 / 0.04 ** 2, 'm s⁻²',
  'T = 1 ÷ 25 = 0.040 s; the gap grows by 0.40 cm: a = 0.0040 ÷ 0.040² = 2.5 m s⁻²', ['C1: T and Δs', 'C1: a = Δs/T²'], sig=2, aq='a')
M('E', 1, 'Which instrument is best for measuring the length of the card on a trolley, about 5 cm?', 'Vernier calipers', ['A metre rule', 'A tape measure', 'A protractor'], 'Calipers read to 0.01 cm, reducing the percentage uncertainty.')
M('M', 3, 'A ticker tape from a trolley shows equally spaced dots along its whole length. What is the trolley\'s acceleration?', 'Zero, because equal distances in equal times mean constant velocity', ['Positive and constant', 'Negative', 'It cannot be found'], 'No change in the spacing means no change in speed.', ['C1: equal spacing', 'C1: constant velocity'])
N('H', 5, 'A motion sensor records a trolley at 0.50, 0.58, 0.72 and 0.92 m at 0.10 s intervals. (a) Calculate the average velocity in each interval. (b) Calculate the acceleration, assuming it is uniform.', (2.0 - 0.8) / 0.20, 'm s⁻²',
  '(a) 0.08 ÷ 0.10 = 0.80, 0.14 ÷ 0.10 = 1.4, 0.20 ÷ 0.10 = 2.0 m s⁻¹. (b) These rise by 0.60 m s⁻¹ every 0.10 s: a = (2.0 − 0.80) ÷ 0.20 = 6.0 m s⁻²', ['C1: velocities', 'C1: equal increases', 'M1: Δv/Δt', 'C1: value'], sig=2, aq='a')
N('M', 3, 'A light gate gives a speed of 0.40 m s⁻¹ for a 5.0 cm card. The block time has an uncertainty of ±0.002 s. Calculate the percentage uncertainty in the block time.', 0.002 / (0.050 / 0.40) * 100, '%',
  't = 0.050 ÷ 0.40 = 0.125 s; % = 0.002 ÷ 0.125 × 100 = 1.6 %', ['C1: block time', 'C1: percentage'], sig=2, aq='% uncertainty')

# ═════════════════════════ 2.7 Determining velocity and acceleration in the laboratory (17/20/13) ═════════════════════════
lesson('2.7')
M('E', 1, 'A trolley is released on a ramp and passes one light gate. What extra information is needed to find its speed?', 'The length of the card that blocks the beam', ['The mass of the trolley', 'The height of the ramp', 'The angle of the gate'], 'speed = card length ÷ block time.')
M('E', 1, 'Why is the ramp sometimes tilted slightly so that a pushed trolley runs at constant speed?', 'To compensate for friction', ['To increase the acceleration', 'To make the light gates work', 'To reduce air resistance'], 'Then any acceleration is due only to the applied force.')
N('E', 2, 'A trolley\'s 6.0 cm card blocks a light gate for 0.15 s. Calculate its speed.', 0.40, 'm s⁻¹',
  'v = 0.060 ÷ 0.15 = 0.40 m s⁻¹', ['C1: length ÷ time'], sig=2, aq='v')
M('E', 1, 'Which arrangement can measure the acceleration of a trolley?', 'Two light gates a measured distance apart, or one gate with a double-interrupt card', ['A single stopwatch and a ruler', 'A top-pan balance', 'A thermometer and a clock'], 'Two speeds are needed.')
N('E', 2, 'A trolley\'s speed at gate 1 is 0.60 m s⁻¹ and at gate 2 is 1.20 m s⁻¹; the timer records 0.40 s between them. Calculate the acceleration.', 1.5, 'm s⁻²',
  'a = (1.20 − 0.60) ÷ 0.40 = 1.5 m s⁻²', ['C1: Δv/t'], sig=2, aq='a')
M('E', 1, 'Why are measurements repeated when finding the acceleration of a trolley?', 'To reduce random error and spot anomalous results', ['To remove systematic error', 'To make the trolley faster', 'To change the independent variable'], 'A mean of repeats is more reliable.')
N('E', 2, 'Repeat block times at a light gate are 0.121 s, 0.118 s and 0.124 s. Calculate the mean.', (0.121 + 0.118 + 0.124) / 3, 's',
  'Mean = (0.121 + 0.118 + 0.124) ÷ 3 = 0.121 s', ['C1: mean'], aq='t')
M('E', 1, 'What is the advantage of plotting a v–t graph from several measurements rather than using two speeds?', 'The gradient of the best-fit line averages out random errors', ['It removes the need for a timer', 'It makes the ramp steeper', 'It removes friction'], 'More points give a more reliable acceleration.')
N('E', 2, 'A trolley starts from rest and reaches 0.90 m s⁻¹ at a light gate 1.5 s after release. Calculate its average acceleration.', 0.60, 'm s⁻²',
  'a = 0.90 ÷ 1.5 = 0.60 m s⁻²', ['C1: a = v/t'], sig=2, aq='a')
M('E', 1, 'A student measures the distance between two light gates with a metre rule. Which instrument resolution is typical?', '1 mm', ['1 cm', '1 µm', '1 m'], 'Metre rules are marked in millimetres.')
N('E', 2, 'A trolley released from rest travels 0.80 m in 1.6 s with uniform acceleration. Calculate its acceleration using s = ½at².', 2 * 0.80 / 1.6 ** 2, 'm s⁻²',
  'a = 2 × 0.80 ÷ 1.6² = 0.625 m s⁻²', ['C1: a = 2s/t²'], aq='a')
M('E', 1, 'Why should the trolley be released rather than pushed when measuring acceleration down a ramp?', 'So that its initial velocity is zero and known', ['To make it heavier', 'So that friction is removed', 'To keep the light gate cool'], 'A push gives an unknown starting speed.')
N('E', 2, 'A ball rolls 1.2 m from rest down a ramp in 2.0 s. Calculate its acceleration.', 2 * 1.2 / 4.0, 'm s⁻²',
  'a = 2s ÷ t² = 2 × 1.2 ÷ 2.0² = 0.60 m s⁻²', ['C1: s = ½at²'], sig=2, aq='a')
M('E', 1, 'Which graph should give a straight line for a trolley accelerating uniformly from rest?', 'v against t', ['s against t', 'a against t, sloping', 'v against s'], 'v = at is linear in t.')
N('E', 1, 'A trolley at 0.25 m s⁻¹ accelerates at 0.50 m s⁻² for 2.0 s. Calculate its final speed.', 1.25, 'm s⁻¹',
  'v = 0.25 + 0.50 × 2.0 = 1.25 m s⁻¹', [], aq='v')
M('E', 1, 'What is the effect of friction on the measured acceleration of a trolley rolling down a ramp?', 'It makes the measured acceleration smaller than the frictionless value', ['It makes it larger', 'It has no effect', 'It makes it negative'], 'Friction opposes the motion.')
N('E', 2, 'A light gate records 0.050 s for a 2.5 cm card. Calculate the trolley speed.', 0.50, 'm s⁻¹',
  'v = 0.025 ÷ 0.050 = 0.50 m s⁻¹', ['C1: length ÷ time'], sig=2, aq='v')
# medium
N('M', 3, 'A trolley released from rest passes light gates 0.30 m and 0.90 m down a ramp at 0.60 m s⁻¹ and 1.04 m s⁻¹. Calculate its acceleration.', (1.04 ** 2 - 0.60 ** 2) / (2 * 0.60), 'm s⁻²',
  'a = (1.04² − 0.60²) ÷ (2 × 0.60) = 0.601 m s⁻²', ['C1: v² = u² + 2as', 'C1: s = 0.60 m'], aq='a')
M('M', 3, 'A student plots s against t² for a trolley released from rest. What should the graph look like, and what is its gradient?', 'A straight line through the origin with gradient a/2', ['A curve with gradient a', 'A horizontal line', 'A straight line with gradient 2a'], 's = ½at², so s ∝ t² with gradient a/2.', ['C1: straight line through origin', 'C1: gradient a/2'])
N('M', 3, 'A graph of s against t² for a trolley released from rest has gradient 0.36 m s⁻². Calculate the acceleration.', 0.72, 'm s⁻²',
  'Gradient = a/2, so a = 2 × 0.36 = 0.72 m s⁻²', ['C1: gradient = a/2', 'C1: value'], sig=2, aq='a')
N('M', 3, 'A graph of v² against s for a trolley has gradient 1.6 m s⁻². Calculate its acceleration.', 0.80, 'm s⁻²',
  'v² = u² + 2as, so gradient = 2a and a = 1.6 ÷ 2 = 0.80 m s⁻²', ['C1: gradient = 2a', 'C1: value'], sig=2, aq='a')
M('M', 3, 'A student finds the trolley\'s acceleration is much less than g sin θ. What is the most likely cause?', 'Friction (and rolling resistance) acting up the ramp', ['The trolley is too light', 'The light gates are too far apart', 'The card is too narrow'], 'Without friction a = g sin θ.', ['C1: friction', 'C1: opposes motion'])
N('M', 3, 'A frictionless trolley on a ramp inclined at 5.0° should have acceleration g sin θ. Calculate it.' + take('g'), 9.81 * sin(radians(5.0)), 'm s⁻²',
  f'a = 9.81 × sin 5.0° = {sf(9.81 * sin(radians(5)))} m s⁻²', ['C1: a = g sin θ', 'C1: value'], aq='a')
N('M', 3, 'The measured acceleration down a 5.0° ramp is 0.72 m s⁻², while g sin θ is 0.855 m s⁻². Calculate the percentage by which friction reduces the acceleration.', (0.855 - 0.72) / 0.855 * 100, '%',
  f'% = (0.855 − 0.72) ÷ 0.855 × 100 = {sf(0.135 / 0.855 * 100)} %', ['C1: difference', 'C1: percentage'], aq='%')
M('M', 3, 'Why does a v–t graph from light-gate data for a trolley sometimes not pass through the origin even though it started from rest?', 'The times are measured from when the trolley is released, but the first gate is some distance down the ramp', ['The trolley moves backwards', 'Light gates measure acceleration', 'The graph is always curved'], 'Points start part-way along the line; the extrapolated line should pass through the origin.', ['C1: first reading after release', 'C1: extrapolation'])
N('M', 3, 'A trolley passes gate A at 0.45 m s⁻¹ and gate B, 0.50 m further on, at 0.85 m s⁻¹. Calculate the time between the gates assuming uniform acceleration.', 0.50 / ((0.45 + 0.85) / 2), 's',
  f't = 0.50 ÷ ((0.45 + 0.85) ÷ 2) = {sf(0.5 / 0.65)} s', ['C1: average speed', 'C1: t = s/v_avg'], aq='t')
N('M', 4, 'A trolley released from rest is timed over 0.40 m, 0.80 m and 1.20 m, taking 1.00 s, 1.41 s and 1.73 s. Use the 1.20 m reading to calculate the acceleration, and check it against the 0.40 m reading.', 2 * 1.20 / 1.73 ** 2, 'm s⁻²',
  f'a = 2 × 1.20 ÷ 1.73² = {sf(2.4 / 1.73 ** 2)} m s⁻². Check: 2 × 0.40 ÷ 1.00² = 0.80 m s⁻², consistent.', ['M1: a = 2s/t²', 'C1: value', 'C1: consistency check'], aq='a')
M('M', 3, 'Why is the length of the card measured with vernier calipers rather than a metre rule?', 'The card is short, so a more precise instrument reduces its percentage uncertainty', ['Calipers measure time', 'Rules cannot measure cards', 'It makes the trolley faster'], 'A small length needs a small resolution.', ['C1: short length', 'C1: % uncertainty reduced'])
N('M', 3, 'The card length is 2.50 ± 0.05 cm and the block time 0.0500 ± 0.0005 s. Calculate the percentage uncertainty in the speed.', 0.05 / 2.50 * 100 + 0.0005 / 0.0500 * 100, '%',
  '% = 0.05 ÷ 2.50 × 100 + 0.0005 ÷ 0.0500 × 100 = 3.0 %', ['C1: % in length', 'C1: % in time, added'], sig=2, aq='% uncertainty')
N('M', 3, 'A trolley\'s velocity is measured at 0.2 s intervals: 0.10, 0.22, 0.34, 0.46 m s⁻¹. Calculate the acceleration.', 0.12 / 0.2, 'm s⁻²',
  'Velocity increases by 0.12 m s⁻¹ every 0.2 s: a = 0.12 ÷ 0.2 = 0.60 m s⁻²', ['C1: constant increase', 'C1: a'], sig=2, aq='a')
M('M', 3, 'A student wants to show that acceleration down a ramp depends on its angle. Which variable must be kept constant?', 'The trolley and the surface of the ramp (to keep friction the same)', ['The angle', 'The acceleration', 'The time'], 'Only the angle should change.', ['C1: control variable', 'C1: reason'])
N('M', 3, 'A trolley starting from rest takes 2.5 s to travel 1.5 m down a ramp. Calculate its speed at the end.', 2 * 1.5 / 2.5, 'm s⁻¹',
  'Average speed = 1.5 ÷ 2.5 = 0.60 m s⁻¹ = v/2, so v = 2 × 0.60 = 1.2 m s⁻¹', ['C1: average speed', 'C1: v = 2 × average'], sig=2, aq='v')
N('M', 3, 'A glider on an air track is pulled by a falling mass. Light gates 0.50 m apart record speeds of 0.40 m s⁻¹ and 0.90 m s⁻¹. Calculate the glider\'s acceleration.', (0.81 - 0.16) / 1.0, 'm s⁻²',
  'a = (0.90² − 0.40²) ÷ (2 × 0.50) = 0.65 m s⁻²', ['C1: v² = u² + 2as', 'C1: value'], sig=2, aq='a')
M('M', 3, 'Why is an air track used for some acceleration experiments?', 'It almost removes friction, so the measured acceleration matches theory more closely', ['It makes the glider heavier', 'It increases air resistance', 'It removes the need for timing'], 'The glider floats on a cushion of air.', ['C1: reduces friction', 'C1: closer to theory'])
N('M', 3, 'A double-interrupt card has 3.0 cm segments. The block times are 0.060 s and 0.040 s, and the time between the two blocks is 0.25 s. Calculate the acceleration.', ((0.03 / 0.04) - (0.03 / 0.06)) / 0.25, 'm s⁻²',
  'u = 0.030 ÷ 0.060 = 0.50 m s⁻¹; v = 0.030 ÷ 0.040 = 0.75 m s⁻¹; a = (0.75 − 0.50) ÷ 0.25 = 1.0 m s⁻²', ['C1: speeds', 'C1: a'], sig=2, aq='a')
# hard
N('H', 5, 'A trolley is released from rest on a ramp. A light gate 0.64 m down the ramp records a 4.0 cm card taking 0.040 s. (a) Calculate the speed at the gate. (b) Calculate the acceleration. (c) Calculate the time from release to the gate.', 1.0 / (1.0 ** 2 / (2 * 0.64)), 's',
  '(a) v = 0.040 ÷ 0.040 = 1.0 m s⁻¹. (b) a = 1.0² ÷ (2 × 0.64) = 0.781 m s⁻². (c) t = 1.0 ÷ 0.7813 = 1.28 s',
  ['C1: speed', 'M1: a = v²/2s', 'C1: value', 'C1: time'], aq='t')
N('H', 6, 'In an experiment s is measured for several t from rest: (0.50 s, 0.15 m), (1.00 s, 0.60 m), (1.50 s, 1.35 m), (2.00 s, 2.40 m). (a) Explain why s should be plotted against t². (b) Calculate the gradient using the first and last points. (c) Calculate the acceleration.', 2 * (2.40 - 0.15) / (4.00 - 0.25), 'm s⁻²',
  '(a) s = ½at², so s against t² is a straight line through the origin of gradient a/2. (b) Gradient = (2.40 − 0.15) ÷ (2.00² − 0.50²) = 0.60 m s⁻². (c) a = 2 × 0.60 = 1.2 m s⁻²',
  ['B1: linear form', 'C1: t² values', 'C1: gradient', 'M1: a = 2 × gradient', 'C1: value'], sig=2, aq='a')
N('H', 5, 'A trolley on a 6.0° ramp has a measured acceleration of 0.82 m s⁻². (a) Calculate g sin θ. (b) Calculate the deceleration due to friction.' + take('g'), 9.81 * sin(radians(6)) - 0.82, 'm s⁻²',
  f'(a) g sin θ = 9.81 × sin 6.0° = {sf(9.81 * sin(radians(6)), 3)} m s⁻². (b) {sf(9.81 * sin(radians(6)), 3)} − 0.82 = {sf(9.81 * sin(radians(6)) - 0.82, 2)} m s⁻²',
  ['C1: g sin θ', 'C1: value', 'M1: difference', 'C1: value'], sig=2, aq='a_f')
N('H', 6, 'Gates A and B are 0.75 m apart. A 5.0 cm card takes 0.10 s at A and 0.050 s at B. (a) Calculate both speeds. (b) Calculate the acceleration. (c) Calculate the time between the gates.', (1.0 - 0.5) / ((1.0 ** 2 - 0.5 ** 2) / 1.5), 's',
  '(a) 0.050 ÷ 0.10 = 0.50 m s⁻¹; 0.050 ÷ 0.050 = 1.0 m s⁻¹. (b) a = (1.0² − 0.50²) ÷ (2 × 0.75) = 0.50 m s⁻². (c) t = (1.0 − 0.50) ÷ 0.50 = 1.0 s',
  ['C1: u', 'C1: v', 'M1: v² = u² + 2as', 'C1: a', 'C1: t'], sig=2, aq='t')
N('H', 5, 'A student finds a = 1.55 m s⁻² for a trolley on a 10° ramp, while g sin θ = 1.70 m s⁻². The uncertainty in a is ±0.05 m s⁻². (a) Calculate the range of the measured value. (b) Calculate the percentage difference from g sin θ.', (1.70 - 1.55) / 1.70 * 100, '%',
  f'(a) 1.50 to 1.60 m s⁻². (b) % = (1.70 − 1.55) ÷ 1.70 × 100 = {sf(15 / 1.7, 2)} %; the difference is beyond the uncertainty, suggesting friction.',
  ['C1: range', 'M1: % difference', 'C1: value', 'B1: conclusion'], sig=2, aq='% difference')
N('H', 5, 'A trolley\'s speed is measured at gates 0.20 m apart: 0.50 m s⁻¹ and then 0.70 m s⁻¹. A third gate 0.20 m further reads 0.86 m s⁻¹. (a) Calculate a between the first two gates. (b) Calculate a between the last two gates.', (0.86 ** 2 - 0.70 ** 2) / 0.40, 'm s⁻²',
  f'(a) (0.70² − 0.50²) ÷ (2 × 0.20) = 0.60 m s⁻². (b) (0.86² − 0.70²) ÷ (2 × 0.20) = {sf((0.86 ** 2 - 0.49) / 0.4)} m s⁻²',
  ['M1: v² = u² + 2as', 'C1: first a', 'C1: second a', 'C1: comparison'], aq='a')
N('H', 6, 'A ball is released from rest at the top of a 1.80 m ramp and its time to the bottom is 1.20 s. (a) Calculate its acceleration. (b) Calculate its speed at the bottom. (c) A light gate at the bottom gives 2.85 m s⁻¹. Calculate the percentage difference from (b).', abs(2.85 - 2 * 1.80 / 1.20) / (2 * 1.80 / 1.20) * 100, '%',
  '(a) a = 2 × 1.80 ÷ 1.20² = 2.5 m s⁻². (b) v = 2.5 × 1.20 = 3.0 m s⁻¹. (c) % = (3.0 − 2.85) ÷ 3.0 × 100 = 5.0 %',
  ['C1: a', 'C1: v', 'M1: % difference', 'C1: substitution', 'C1: value'], sig=2, aq='% difference')
N('H', 5, 'A glider of mass 0.40 kg on an air track is accelerated by a resultant force of 0.12 N. Gates 0.60 m apart are passed at 0.50 m s⁻¹ then v. (a) Calculate the acceleration from F = ma. (b) Calculate v.', sqrt(0.50 ** 2 + 2 * 0.30 * 0.60), 'm s⁻¹',
  f'(a) a = 0.12 ÷ 0.40 = 0.30 m s⁻². (b) v = √(0.50² + 2 × 0.30 × 0.60) = {sf(sqrt(0.25 + 0.36))} m s⁻¹',
  ['C1: a', 'M1: v² = u² + 2as', 'C1: substitution', 'C1: value'], aq='v')

N('E', 2, 'The two light gates are measured to be 50.0 cm apart with an uncertainty of ±0.1 cm. Calculate the percentage uncertainty.', 0.1 / 50.0 * 100, '%',
  '% = 0.1 ÷ 50.0 × 100 = 0.2 %', ['C1: Δx/x × 100'], sig=1, aq='% uncertainty')
M('E', 1, 'To investigate how a trolley\'s acceleration depends on the slope, which variable is changed?', 'The angle of the ramp', ['The mass of the card', 'The light-gate spacing only', 'The timer'], 'The angle is the independent variable.')
N('M', 3, 'A ramp 1.50 m long has one end raised by 0.12 m. Calculate the acceleration of a frictionless trolley on it.' + take('g'), 9.81 * 0.12 / 1.50, 'm s⁻²',
  'sin θ = 0.12 ÷ 1.50 = 0.080; a = 9.81 × 0.12 ÷ 1.50 = 0.785 m s⁻²', ['C1: sin θ', 'C1: a = g sin θ'], aq='a')
N('M', 3, 'A trolley released from rest reaches a light gate 0.50 m down a ramp at 0.80 m s⁻¹. Calculate its acceleration.', 0.64 / 1.0, 'm s⁻²',
  'a = 0.80² ÷ (2 × 0.50) = 0.64 m s⁻²', ['C1: v² = 2as', 'C1: value'], sig=2, aq='a')
N('M', 3, 'From rest, a trolley covers 0.90 m in 1.50 s. Find its acceleration assuming it is uniform.', 2 * 0.90 / 1.5 ** 2, 'm s⁻²',
  'a = 2 × 0.90 ÷ 1.50² = 0.80 m s⁻²', ['C1: s = ½at²', 'C1: value'], sig=2, aq='a')
N('H', 5, 'A student measures a trolley\'s acceleration on a 6.0° ramp as 0.94 m s⁻². (a) Calculate g sin 6.0°. (b) Calculate the deceleration caused by friction.' + take('g'), 9.81 * sin(radians(6)) - 0.94, 'm s⁻²',
  f'(a) 9.81 × sin 6.0° = {sf(9.81 * sin(radians(6)), 4)} m s⁻². (b) {sf(9.81 * sin(radians(6)), 4)} − 0.94 = {sf(9.81 * sin(radians(6)) - 0.94, 2)} m s⁻²', ['C1: g sin θ', 'C1: value', 'M1: difference', 'C1: value'], sig=2, aq='a_f')
N('E', 2, 'A trolley passes the first gate at 0.35 m s⁻¹ and accelerates at 0.50 m s⁻² for 0.80 s to the second gate. Calculate its speed at the second gate.', 0.35 + 0.5 * 0.8, 'm s⁻¹',
  'v = 0.35 + 0.50 × 0.80 = 0.75 m s⁻¹', ['C1: v = u + at'], sig=2, aq='v')
M('M', 3, 'Why are the positions of the light gates marked on the ramp before repeat runs?', 'So that the distance between them stays the same for every run', ['So the trolley stops there', 'To change the angle', 'To calibrate the timer'], 'A fixed separation is a control variable.', ['C1: same s each run', 'C1: fair comparison'])
N('M', 3, 'The gradient of a v–t graph from lab data is 0.48 m s⁻² with an uncertainty of ±0.03 m s⁻². Calculate the percentage uncertainty.', 0.03 / 0.48 * 100, '%',
  '% = 0.03 ÷ 0.48 × 100 = 6.25 %', ['C1: Δa/a', 'C1: × 100'], aq='% uncertainty')

# ═════════════════════════ 2.8 The equations of motion (17/20/13) ═════════════════════════
lesson('2.8')
M('E', 1, 'Under what condition can the equations of motion (suvat) be used?', 'When the acceleration is constant (uniform) and the motion is in a straight line', ['Whenever an object moves', 'Only when the object starts from rest', 'Only for falling objects'], 'They assume uniform acceleration.')
N('E', 2, 'A car starts from rest and accelerates at 2.5 m s⁻² for 8.0 s. Calculate its final velocity.', 20, 'm s⁻¹',
  'v = u + at = 0 + 2.5 × 8.0 = 20 m s⁻¹', ['C1: v = u + at'], sig=2, aq='v')
N('E', 2, 'A car starts from rest and accelerates at 2.5 m s⁻² for 8.0 s. Calculate how far it travels.', 0.5 * 2.5 * 64, 'm',
  's = ut + ½at² = 0 + 0.5 × 2.5 × 8.0² = 80 m', ['C1: s = ½at²'], sig=2, aq='s')
N('E', 2, 'A cyclist accelerates from 3.0 m s⁻¹ to 7.0 m s⁻¹ over 20 m. Calculate her acceleration.', (49 - 9) / 40, 'm s⁻²',
  'a = (7.0² − 3.0²) ÷ (2 × 20) = 1.0 m s⁻²', ['C1: v² = u² + 2as'], sig=2, aq='a')
M('E', 1, 'Which equation of motion does not contain the time t?', 'v² = u² + 2as', ['v = u + at', 's = ut + ½at²', 's = (u + v)t/2'], 'Use it when t is neither known nor wanted.')
N('E', 2, 'A ball rolls from 2.0 m s⁻¹ to 6.0 m s⁻¹ in 4.0 s with uniform acceleration. Calculate the distance rolled.', (2 + 6) / 2 * 4, 'm',
  's = (u + v)t ÷ 2 = (2.0 + 6.0) × 4.0 ÷ 2 = 16 m', ['C1: s = (u + v)t/2'], sig=2, aq='s')
N('E', 2, 'A train slows uniformly from 30 m s⁻¹ to rest at 0.50 m s⁻². Calculate the braking distance.', 900 / 1.0, 'm',
  's = (0 − 30²) ÷ (2 × −0.50) = 900 m', ['C1: v² = u² + 2as'], sig=2, aq='s')
M('E', 1, 'In the suvat equations, what does s stand for?', 'Displacement', ['Speed', 'Time', 'Distance only along a curve'], 's is the displacement from the starting point.')
N('E', 2, 'A stone dropped from rest falls for 2.0 s. Calculate the distance fallen.' + take('g'), 0.5 * 9.81 * 4, 'm',
  's = 0.5 × 9.81 × 2.0² = 19.6 m', ['C1: s = ½gt²'], aq='s')
N('E', 2, 'An object accelerates from 4.0 m s⁻¹ at 3.0 m s⁻² for 5.0 s. Calculate its final velocity.', 19, 'm s⁻¹',
  'v = 4.0 + 3.0 × 5.0 = 19 m s⁻¹', ['C1: v = u + at'], sig=2, aq='v')
M('E', 1, 'A car brakes with uniform deceleration. Taking its direction of motion as positive, which quantity is negative?', 'The acceleration a', ['The initial velocity u', 'The displacement s', 'The time t'], 'Deceleration is acceleration opposite to motion.')
N('E', 2, 'A runner accelerates from rest at 2.0 m s⁻² over 9.0 m. Calculate her final speed.', 6.0, 'm s⁻¹',
  'v = √(0 + 2 × 2.0 × 9.0) = 6.0 m s⁻¹', ['C1: v² = 2as'], sig=2, aq='v')
N('E', 1, 'A car moving at 12 m s⁻¹ brakes at 4.0 m s⁻². How long does it take to stop?', 3.0, 's',
  't = (0 − 12) ÷ (−4.0) = 3.0 s', [], sig=2, aq='t')
M('E', 1, 'How many of the five suvat quantities must be known to find the others?', 'Three', ['Two', 'Four', 'All five'], 'Each equation links four of them.')
N('E', 2, 'A ball is thrown down a well at 5.0 m s⁻¹ and hits the water 2.0 s later. Calculate the depth.' + take('g'), 5.0 * 2.0 + 0.5 * 9.81 * 4, 'm',
  's = 5.0 × 2.0 + 0.5 × 9.81 × 2.0² = 29.6 m', ['C1: s = ut + ½at²'], aq='s')
N('E', 2, 'A plane accelerates from rest at 4.0 m s⁻² until it reaches its take-off speed of 80 m s⁻¹. Calculate the runway length needed.', 6400 / 8, 'm',
  's = 80² ÷ (2 × 4.0) = 800 m', ['C1: v² = 2as'], sig=2, aq='s')
M('E', 1, 'A ball is thrown straight up. Taking up as positive, what value of a is used in the suvat equations?', '−9.81 m s⁻²', ['+9.81 m s⁻²', '0', 'It changes at the top'], 'g acts downwards throughout.')
# medium
N('M', 3, 'A car moving at 15 m s⁻¹ accelerates at 1.5 m s⁻² for 6.0 s. Calculate the distance covered in this time.', suvat_s(15, 1.5, 6.0), 'm',
  's = 15 × 6.0 + 0.5 × 1.5 × 6.0² = 117 m', ['C1: s = ut + ½at²', 'C1: value'], aq='s')
N('M', 3, 'A ball is thrown vertically upwards at 18 m s⁻¹. Calculate the maximum height reached.' + take('g'), 18 ** 2 / (2 * 9.81), 'm',
  'h = 18² ÷ (2 × 9.81) = 16.5 m', ['C1: v = 0 at top', 'C1: v² = u² + 2as'], aq='h')
N('M', 3, 'A car decelerates uniformly from 25 m s⁻¹ to 10 m s⁻¹ over 70 m. Calculate its deceleration.', (625 - 100) / 140, 'm s⁻²',
  'a = (10² − 25²) ÷ (2 × 70) = −3.75 m s⁻², so the deceleration is (25² − 10²) ÷ (2 × 70) = 3.75 m s⁻²', ['C1: v² = u² + 2as', 'C1: magnitude'], aq='a')
N('M', 3, 'A stone thrown upwards at 12 m s⁻¹ from a cliff top lands on the beach 3.0 s later. Taking up as positive, calculate its displacement.' + take('g'), 12 * 3.0 - 0.5 * 9.81 * 9, 'm',
  's = 12 × 3.0 − 0.5 × 9.81 × 3.0² = −8.15 m (8.15 m below the start)', ['C1: a = −9.81', 'C1: value with sign'], sign=True, aq='s')
N('M', 3, 'A sprinter accelerates uniformly from rest to 10 m s⁻¹ over the first 20 m. Calculate the time taken.', 20 / 5.0, 's',
  's = (u + v)t ÷ 2, so t = 2 × 20 ÷ (0 + 10) = 4.0 s', ['C1: s = (u + v)t/2', 'C1: rearranged'], sig=2, aq='t')
M('M', 3, 'A car travels 50 m while slowing uniformly from 20 m s⁻¹ to 10 m s⁻¹. Which pair of equations gives a and t most directly?', 'v² = u² + 2as for a, then s = (u + v)t/2 for t', ['s = ut + ½at² for both', 'v = u + at for both', 'None can be used'], 'Choose equations containing the known quantities.', ['C1: a from v²', 'C1: t from average'])
N('M', 3, 'A car slows uniformly from 20 m s⁻¹ to 10 m s⁻¹ over 50 m. Calculate the time taken.', 2 * 50 / 30, 's',
  't = 2 × 50 ÷ (20 + 10) = 3.33 s', ['C1: s = (u + v)t/2', 'C1: value'], aq='t')
N('M', 3, 'An electron accelerates uniformly from rest at 4.0 × 10¹⁴ m s⁻² over 2.0 cm. Calculate its final speed, in units of 10⁶ m s⁻¹.', sqrt(2 * 4.0e14 * 0.020), '10⁶ m s⁻¹',
  f'v = √(2 × 4.0 × 10¹⁴ × 0.020) = {sf(sqrt(1.6e13))} m s⁻¹', ['C1: v² = 2as', 'C1: cm to m'], aq='v')
N('M', 3, 'A ball is dropped from a 45 m tower. Calculate the time it takes to reach the ground.' + take('g'), sqrt(2 * 45 / 9.81), 's',
  't = √(2 × 45 ÷ 9.81) = 3.03 s', ['C1: s = ½gt²', 'C1: value'], aq='t')
N('M', 3, 'A ball is dropped from a 45 m tower. Calculate its speed on reaching the ground.' + take('g'), sqrt(2 * 9.81 * 45), 'm s⁻¹',
  'v = √(2 × 9.81 × 45) = 29.7 m s⁻¹', ['C1: v² = 2gs', 'C1: value'], aq='v')
N('M', 4, 'A car travelling at 30 m s⁻¹ brakes uniformly and stops in 75 m. Calculate the time taken to stop.', 2 * 75 / 30, 's',
  'a = −30² ÷ (2 × 75) = −6.0 m s⁻²; t = 30 ÷ 6.0 = 5.0 s', ['C1: a', 'M1: t = Δv/a or average speed', 'C1: value'], sig=2, aq='t')
N('M', 3, 'A lift accelerates upwards from rest at 0.80 m s⁻² for 3.0 s. Calculate the height it rises in that time.', 0.5 * 0.80 * 9, 'm',
  's = 0.5 × 0.80 × 3.0² = 3.6 m', ['C1: s = ½at²', 'C1: value'], sig=2, aq='s')
M('M', 3, 'A ball is thrown upwards at 10 m s⁻¹ and caught at the same height. Why does s = 0 give two solutions for t?', 'One is t = 0 (at release) and the other is when it returns', ['The equation is wrong', 'Because a is negative', 'Because the ball stops twice'], 'ut + ½at² = 0 has roots t = 0 and t = −2u/a.', ['C1: t = 0', 'C1: return time'])
N('M', 3, 'A ball is thrown upwards at 10 m s⁻¹ and caught at the same height. Calculate the time of flight.' + take('g'), 2 * 10 / 9.81, 's',
  't = 2 × 10 ÷ 9.81 = 2.04 s', ['C1: s = 0', 'C1: t = 2u/g'], aq='t')
N('M', 3, 'A train accelerates uniformly from 8.0 m s⁻¹ to 20 m s⁻¹ while travelling 280 m. Calculate its acceleration.', (400 - 64) / 560, 'm s⁻²',
  'a = (20² − 8.0²) ÷ (2 × 280) = 0.60 m s⁻²', ['C1: v² = u² + 2as', 'C1: value'], sig=2, aq='a')
N('M', 3, 'A hockey puck slides 24 m and stops, decelerating uniformly at 0.75 m s⁻². Calculate its initial speed.', sqrt(2 * 0.75 * 24), 'm s⁻¹',
  'u = √(2 × 0.75 × 24) = 6.0 m s⁻¹', ['C1: 0 = u² − 2as', 'C1: value'], sig=2, aq='u')
N('M', 3, 'A rocket accelerates upwards from rest at 15 m s⁻² for 10 s. Calculate its height at the end of the burn.', 0.5 * 15 * 100, 'm',
  's = 0.5 × 15 × 10² = 750 m', ['C1: s = ½at²', 'C1: value'], sig=2, aq='h')
N('M', 3, 'A bullet passes through a 0.12 m thick plank, slowing from 400 m s⁻¹ to 250 m s⁻¹. Calculate its deceleration, in units of 10⁵ m s⁻².', (400 ** 2 - 250 ** 2) / (2 * 0.12), '10⁵ m s⁻²',
  f'a = (400² − 250²) ÷ (2 × 0.12) = {sf((160000 - 62500) / 0.24)} m s⁻² (as a deceleration)', ['C1: v² = u² + 2as', 'C1: value'], aq='a')
# hard
N('H', 5, 'A car passes a point at 12 m s⁻¹ and accelerates uniformly at 2.0 m s⁻². (a) Calculate its speed after travelling a further 64 m. (b) Calculate the time taken.', (sqrt(144 + 256) - 12) / 2.0, 's',
  '(a) v = √(12² + 2 × 2.0 × 64) = 20 m s⁻¹. (b) t = (20 − 12) ÷ 2.0 = 4.0 s',
  ['M1: v² = u² + 2as', 'C1: v = 20', 'M1: v = u + at', 'C1: value'], sig=2, aq='t')
N('H', 6, 'A ball is thrown upwards at 15 m s⁻¹ from the top of a 20 m cliff and falls to the beach below. Taking up as positive: (a) write the equation for its displacement −20 m; (b) solve for the time of flight; (c) calculate its speed at impact.' + take('g'), sqrt(15 ** 2 + 2 * 9.81 * 20), 'm s⁻¹',
  f'(a) The displacement 15t − 4.905t² must equal −20 m. (b) t = (15 + √(15² + 4 × 4.905 × 20)) ÷ (2 × 4.905) = {sf((15 + sqrt(225 + 392.4)) / 9.81, 3)} s. (c) v = √(15² + 2 × 9.81 × 20) = {sf(sqrt(225 + 392.4))} m s⁻¹',
  ['B1: equation with signs', 'M1: quadratic formula', 'C1: time', 'M1: v² = u² + 2as', 'C1: value'], aq='v')
N('H', 5, 'Two cars start from rest together. Car A accelerates at 2.0 m s⁻² and car B at 3.0 m s⁻². (a) Calculate how far ahead B is after 10 s. (b) Calculate B\'s speed at that time.', 0.5 * 3.0 * 100 - 0.5 * 2.0 * 100, 'm',
  '(a) s_B − s_A = 0.5 × 3.0 × 10² − 0.5 × 2.0 × 10² = 50 m. (b) v_B = 3.0 × 10 = 30 m s⁻¹',
  ['M1: s = ½at² each', 'C1: difference', 'C1: value', 'C1: v_B'], sig=2, aq='Δs')
N('H', 6, 'A car travelling at 18 m s⁻¹ passes a stationary police car, which immediately accelerates at 3.0 m s⁻². (a) Write the displacement of each car after time t. (b) Calculate when the police car catches up. (c) Calculate the police car\'s speed then.', 3.0 * 12, 'm s⁻¹',
  '(a) s₁ = 18t; s₂ = 1.5t². (b) 1.5t² = 18t gives t = 12 s. (c) v = 3.0 × 12 = 36 m s⁻¹',
  ['B1: s₁', 'B1: s₂', 'M1: equate', 'C1: t = 12 s', 'C1: speed'], sig=2, aq='v')
N('H', 5, 'A stone is dropped down a well and the splash is heard 2.4 s later. Ignoring the time for the sound to travel up: (a) calculate the depth; (b) explain whether the true depth is larger or smaller.' + take('g'), 0.5 * 9.81 * 2.4 ** 2, 'm',
  f'(a) s = 0.5 × 9.81 × 2.4² = {sf(0.5 * 9.81 * 5.76)} m. (b) Smaller: part of the 2.4 s is the sound returning, so the fall time is less.',
  ['M1: s = ½gt²', 'C1: value', 'B1: smaller', 'B1: reason'], aq='h')
N('H', 6, 'A train starts from rest, accelerates at 0.60 m s⁻² for 40 s, travels at constant speed for 2.0 minutes and then decelerates at 0.80 m s⁻² to rest. (a) Calculate the top speed. (b) Calculate the distance in each stage. (c) Calculate the total distance.', 0.5 * 0.6 * 1600 + 24 * 120 + 24 ** 2 / 1.6, 'm',
  '(a) v = 0.60 × 40 = 24 m s⁻¹. (b) 0.5 × 0.60 × 40² = 480 m; 24 × 120 = 2880 m; 24² ÷ (2 × 0.80) = 360 m. (c) 480 + 2880 + 360 = 3720 m',
  ['C1: top speed', 'C1: stage 1', 'C1: stage 2', 'C1: stage 3', 'C1: total'], aq='s')
N('H', 5, 'A ball rolls up a slope at 6.0 m s⁻¹ with deceleration 1.5 m s⁻². (a) Calculate how far up the slope it travels. (b) Calculate its velocity 6.0 s after starting, taking up the slope as positive.', 6.0 - 1.5 * 6.0, 'm s⁻¹',
  '(a) s = 6.0² ÷ (2 × 1.5) = 12 m. (b) v = 6.0 − 1.5 × 6.0 = −3.0 m s⁻¹ (rolling back down)',
  ['C1: distance', 'M1: v = u + at with sign', 'C1: value', 'B1: interpretation'], sig=2, sign=True, aq='v')
N('H', 6, 'A car driver sees a hazard 50 m ahead while moving at 20 m s⁻¹. Her reaction time is 0.70 s and the car decelerates at 5.0 m s⁻². (a) Calculate the thinking distance. (b) Calculate the braking distance. (c) Calculate by how much the car stops short of the hazard.', 50 - (20 * 0.7 + 400 / 10), 'm',
  '(a) 20 × 0.70 = 14 m. (b) 20² ÷ (2 × 5.0) = 40 m. (c) Total 54 m, which is more than 50 m: the car does not stop in time; it would need 50 − 54 = −4.0 m, i.e. it travels 4.0 m too far.',
  ['C1: thinking', 'C1: braking', 'C1: total', 'M1: compare', 'C1: value'], sig=2, sign=True, aq='Δs')
N('H', 5, 'A parachutist falls freely from rest for 3.0 s and then opens the parachute, decelerating at 12 m s⁻² until her speed is 5.0 m s⁻¹. (a) Calculate the speed when the parachute opens. (b) Calculate the distance fallen while decelerating.' + take('g'), ((9.81 * 3) ** 2 - 25) / 24, 'm',
  f'(a) v = 9.81 × 3.0 = {sf(29.43, 4)} m s⁻¹. (b) s = ({sf(29.43, 4)}² − 5.0²) ÷ (2 × 12) = {sf((29.43 ** 2 - 25) / 24)} m',
  ['C1: free-fall speed', 'M1: v² = u² + 2as', 'C1: substitution', 'C1: value'], aq='s')

N('E', 2, 'A cyclist brakes uniformly from 8.0 m s⁻¹ to rest over 16 m. Calculate her deceleration.', 64 / 32, 'm s⁻²',
  'a = 8.0² ÷ (2 × 16) = 2.0 m s⁻²', ['C1: v² = u² + 2as'], sig=2, aq='a')
N('E', 2, 'A ball rolls from rest down a slope with acceleration 0.50 m s⁻² for 6.0 s. Calculate the distance rolled.', 0.5 * 0.5 * 36, 'm',
  's = 0.5 × 0.50 × 6.0² = 9.0 m', ['C1: s = ½at²'], sig=2, aq='s')
N('E', 2, 'A car speeds up uniformly from 10 m s⁻¹ to 25 m s⁻¹ in 5.0 s. Calculate its displacement in this time.', (10 + 25) / 2 * 5, 'm',
  's = (10 + 25) × 5.0 ÷ 2 = 87.5 m', ['C1: s = (u + v)t/2'], aq='s')
N('M', 3, 'A stone is thrown vertically upwards at 20 m s⁻¹. Calculate the time it takes to reach its highest point.' + take('g'), 20 / 9.81, 's',
  't = 20 ÷ 9.81 = 2.04 s', ['C1: v = 0 at top', 'C1: t = u/g'], aq='t')
N('M', 3, 'A car accelerates at 1.2 m s⁻² from 5.0 m s⁻¹. How far does it travel before reaching 17 m s⁻¹?', (17 ** 2 - 25) / 2.4, 'm',
  's = (17² − 5.0²) ÷ (2 × 1.2) = 110 m', ['C1: v² = u² + 2as', 'C1: value'], sig=2, aq='s')
N('M', 3, 'A train passes a signal at 25 m s⁻¹ and stops 500 m further on, decelerating uniformly. Calculate the deceleration.', 625 / 1000, 'm s⁻²',
  'a = 25² ÷ (2 × 500) = 0.625 m s⁻²', ['C1: v² = u² + 2as', 'C1: value'], aq='a')
N('M', 3, 'An object dropped from rest falls 5.0 m. Calculate its speed.' + take('g'), sqrt(2 * 9.81 * 5), 'm s⁻¹',
  'v = √(2 × 9.81 × 5.0) = 9.90 m s⁻¹', ['C1: v² = 2gs', 'C1: value'], aq='v')
N('M', 3, 'A sprinter accelerates uniformly from rest at 3.0 m s⁻². How long does she take to cover 24 m?', sqrt(2 * 24 / 3.0), 's',
  't = √(2 × 24 ÷ 3.0) = 4.0 s', ['C1: s = ½at²', 'C1: rearranged'], sig=2, aq='t')
N('H', 5, 'A ball is thrown upwards at 12 m s⁻¹. (a) Write an expression for its height after time t. (b) Calculate the later time at which it is 5.0 m above the start.' + take('g'), (12 + sqrt(144 - 4 * 4.905 * 5)) / 9.81, 's',
  f'(a) h = 12t − 4.905t². (b) Setting h to 5.0 m and using the quadratic formula: t = (12 + √(12² − 4 × 4.905 × 5.0)) ÷ 9.81 = {sf((12 + sqrt(144 - 98.1)) / 9.81)} s',
  ['B1: expression', 'M1: quadratic', 'C1: substitution', 'C1: later root'], aq='t')
N('H', 5, 'Car A starts from rest with acceleration 2.0 m s⁻² just as car B, 50 m behind it, passes at a steady 15 m s⁻¹. (a) Write the displacement of each from B\'s starting point. (b) Find when B first draws level with A.', 5.0, 's',
  '(a) s_A = 50 + t²; s_B = 15t. (b) t² − 15t + 50 (set to zero) has roots 5 and 10, so B first draws level at t = (15 − √(15² − 4 × 50)) ÷ 2 = 5.0 s',
  ['B1: equations', 'M1: equate', 'C1: quadratic', 'C1: smaller root'], sig=2, aq='t')

# ═════════════════════════ 2.9 Deriving the equations of motion (17/20/13) ═════════════════════════
lesson('2.9')
M('E', 1, 'Which equation of motion comes directly from the definition of acceleration?', 'v = u + at', ['s = ut + ½at²', 'v² = u² + 2as', 's = vt'], 'a = (v − u)/t rearranges to v = u + at.')
M('E', 1, 'Which feature of a v–t graph is used to derive s = (u + v)t/2?', 'The area under the graph (a trapezium)', ['The gradient', 'The intercept', 'The maximum value'], 'Area = average of parallel sides × width.')
M('E', 1, 'For uniform acceleration, what is the average velocity between u and v?', '(u + v)/2', ['u + v', 'v − u', '(v − u)/2'], 'The v–t graph is a straight line.')
N('E', 2, 'For uniform acceleration from 6.0 m s⁻¹ to 14 m s⁻¹, calculate the average velocity.', 10, 'm s⁻¹',
  'v_avg = (6.0 + 14) ÷ 2 = 10 m s⁻¹', ['C1: (u + v)/2'], sig=2, aq='v')
M('E', 1, 'The area under a v–t graph for uniform acceleration can be split into a rectangle and a triangle. What does the rectangle represent?', 'ut, the displacement at the initial speed', ['½at²', 'v²', 'at'], 'Rectangle height u, width t.')
M('E', 1, 'In the same split, what does the triangle represent?', '½at², the extra displacement due to the acceleration', ['ut', '(u + v)/2', 'at'], 'Triangle base t, height at.')
N('E', 2, 'For u = 4.0 m s⁻¹, a = 2.0 m s⁻² and t = 3.0 s, calculate the rectangle part (ut) of the area under the v–t graph.', 12, 'm',
  'ut = 4.0 × 3.0 = 12 m', ['C1: u × t'], sig=2, aq='ut')
N('E', 2, 'Taking the same motion (u = 4.0 m s⁻¹, a = 2.0 m s⁻², t = 3.0 s), find the extra displacement ½at² shown by the triangle on the v–t graph.', 9.0, 'm',
  '½at² = 0.5 × 2.0 × 3.0² = 9.0 m', ['C1: ½at²'], sig=2, aq='s_tri')
M('E', 1, 'Which equation is obtained by eliminating t between v = u + at and s = (u + v)t/2?', 'v² = u² + 2as', ['s = ut + ½at²', 'v = u + at', 's = vt − ½at²'], 'Substitute t = (v − u)/a.')
M('E', 1, 'Which equation is obtained by substituting v = u + at into s = (u + v)t/2?', 's = ut + ½at²', ['v² = u² + 2as', 'a = (v − u)/t', 's = vt'], '(u + u + at)t/2 = ut + ½at².')
N('E', 2, 'Check s = ut + ½at² against s = (u + v)t/2 for u = 2.0 m s⁻¹, a = 4.0 m s⁻² and t = 3.0 s by calculating s.', 2 * 3 + 0.5 * 4 * 9, 'm',
  's = 2.0 × 3.0 + 0.5 × 4.0 × 3.0² = 24 m (and v = 14 m s⁻¹ gives (2.0 + 14) × 3.0 ÷ 2 = 24 m)', ['C1: either route'], sig=2, aq='s')
M('E', 1, 'Why must the acceleration be constant for these derivations?', 'The v–t graph must be a straight line for the area and gradient expressions to hold', ['Because time must be constant', 'Because velocity must be zero', 'They work for any acceleration'], 'A curved graph has a different area.')
N('E', 1, 'Calculate the gradient of a v–t line from u = 3.0 m s⁻¹ to v = 15 m s⁻¹ over t = 4.0 s.', 3.0, 'm s⁻²',
  'a = (15 − 3.0) ÷ 4.0 = 3.0 m s⁻²', [], sig=2, aq='a')
M('E', 1, 'What does the area of the trapezium under a straight v–t line equal?', '½(u + v)t', ['(v − u)t', 'uvt', '½(v − u)t'], 'Mean of parallel sides times width.')
N('E', 2, 'A v–t line rises from 5.0 m s⁻¹ to 11 m s⁻¹ in 4.0 s. Calculate the trapezium area.', 32, 'm',
  's = 0.5 × (5.0 + 11) × 4.0 = 32 m', ['C1: ½(u + v)t'], sig=2, aq='s')
M('E', 1, 'Which quantity is absent from s = (u + v)t/2?', 'The acceleration a', ['The time t', 'The initial velocity u', 'The displacement s'], 'Useful when a is not known.')
N('E', 2, 'Using v² = u² + 2as, find v when u = 3.0 m s⁻¹, a = 2.0 m s⁻² and s = 4.0 m.', 5.0, 'm s⁻¹',
  'v = √(3.0² + 2 × 2.0 × 4.0) = 5.0 m s⁻¹', ['C1: substitution'], sig=2, aq='v')
# medium
M('M', 3, 'Starting from v = u + at, which step gives v² = u² + 2as?', 'Square to get v² = u² + 2uat + a²t², then use s = ut + ½at² to replace 2a(ut + ½at²) by 2as', ['Divide by t', 'Multiply by a', 'Add u to both sides'], 'v² = u² + 2a(ut + ½at²) = u² + 2as.', ['C1: square', 'C1: substitute s'])
N('M', 3, 'For u = 5.0 m s⁻¹, a = 2.0 m s⁻², t = 4.0 s, calculate v² using v = u + at, and show it equals u² + 2as. Give v² in m² s⁻².', (5 + 8) ** 2, 'm² s⁻²',
  'v = 5.0 + 2.0 × 4.0 = 13 m s⁻¹, v² = 169; s = 5.0 × 4.0 + 0.5 × 2.0 × 4.0² = 36 m; u² + 2as = 5.0² + 2 × 2.0 × 36 = 169', ['C1: v', 'C1: check'], aq='v²')
N('M', 3, 'Derive and use s = vt − ½at² to find s when v = 20 m s⁻¹, a = 3.0 m s⁻² and t = 4.0 s.', 20 * 4 - 0.5 * 3 * 16, 'm',
  'With u = v − at in s = (u + v)t/2: s = vt − ½at² = 20 × 4.0 − 0.5 × 3.0 × 4.0² = 56 m', ['C1: substitute u', 'C1: value'], sig=2, aq='s')
M('M', 3, 'Why is s = vt − ½at² useful?', 'It gives s when the initial velocity is unknown but the final velocity is known', ['It gives a when s is unknown', 'It works for non-uniform acceleration', 'It removes the need for a'], 'It is the "no-u" equation.', ['C1: u absent', 'C1: use'])
N('M', 3, 'A car decelerates uniformly to rest in 6.0 s over 45 m. Use s = vt − ½at² with v = 0 to find the deceleration.', 2 * 45 / 36, 'm s⁻²',
  'With v = 0, s = −½at², so a = −2 × 45 ÷ 6.0² = −2.5 m s⁻²; the deceleration is 2 × 45 ÷ 6.0² = 2.5 m s⁻²', ['C1: v = 0', 'C1: value'], sig=2, aq='a')
M('M', 3, 'A v–t graph from u to v in time t is split into a rectangle of height u and a triangle of height (v − u). Which expression for the triangle area leads to ½at²?', '½t(v − u) with v − u = at', ['t(v − u)', '½tv', 'uv'], 'Substitute v − u = at.', ['C1: triangle area', 'C1: substitution'])
N('M', 3, 'For a car moving from 12 m s⁻¹ to 4.0 m s⁻¹ in 4.0 s, calculate the displacement using s = (u + v)t/2.', 32, 'm',
  's = (12 + 4.0) × 4.0 ÷ 2 = 32 m', ['C1: equation', 'C1: value'], sig=2, aq='s')
N('M', 3, 'For the same car (12 → 4.0 m s⁻¹ in 4.0 s), calculate s using s = ut + ½at² to confirm the result.', 12 * 4 + 0.5 * (-2.0) * 16, 'm',
  'a = (4.0 − 12) ÷ 4.0 = −2.0 m s⁻²; s = 12 × 4.0 + 0.5 × (−2.0) × 4.0² = 32 m', ['C1: a', 'C1: s'], sig=2, aq='s')
M('M', 3, 'A student says s = vt for an accelerating car. Why is this wrong?', 'It assumes the velocity is constant at its final value; with acceleration the average velocity is less than v', ['Because s is a scalar', 'Because v is negative', 'It is correct'], 'Use the average velocity (u + v)/2.', ['C1: constant v assumed', 'C1: average velocity'])
N('M', 3, 'Show that the units of ut + ½at² are metres, and evaluate it for u = 0.50 m s⁻¹, a = 0.20 m s⁻², t = 10 s.', 0.5 * 10 + 0.5 * 0.2 * 100, 'm',
  'Units: (m s⁻¹)(s) = m and (m s⁻²)(s²) = m. s = 0.50 × 10 + 0.5 × 0.20 × 10² = 15 m', ['C1: units', 'C1: value'], sig=2, aq='s')
N('M', 4, 'From v² = u² + 2as, derive an expression for s and calculate the stopping distance of a car from 26 m s⁻¹ with deceleration 6.5 m s⁻².', 26 ** 2 / (2 * 6.5), 'm',
  's = (v² − u²) ÷ 2a; with v = 0 and a = −6.5: s = 26² ÷ (2 × 6.5) = 52 m', ['M1: rearrangement', 'C1: signs', 'C1: value'], sig=2, aq='s')
M('M', 3, 'Why does the derivation of s = ut + ½at² from a v–t graph require u, v and a to be in the same direction?', 'The graph and the areas assume one-dimensional motion with a chosen positive direction', ['Because time is a vector', 'Because v must be zero', 'It does not; any directions work'], 'Signs handle opposite directions along one line.', ['C1: straight-line motion', 'C1: sign convention'])
N('M', 3, 'For u = 0, show that s = ½at² and v² = 2as are consistent by computing v from both for a = 4.0 m s⁻² and t = 2.5 s.', 10, 'm s⁻¹',
  's = 0.5 × 4.0 × 2.5² = 12.5 m; v = √(2 × 4.0 × 12.5) = 10 m s⁻¹, equal to at = 4.0 × 2.5 = 10 m s⁻¹', ['C1: s', 'C1: v both ways'], sig=2, aq='v')
N('M', 3, 'A ball is dropped. Using s = ½gt², calculate the ratio of distance fallen in the first 2.0 s to that in the first 1.0 s.', 4.0, None,
  'Ratio = (2.0 ÷ 1.0)² = 4.0', ['C1: s ∝ t²', 'C1: value'], sig=2, aq='ratio')
N('M', 3, 'For uniform acceleration from rest, the distances in successive equal time intervals are in the ratio 1 : 3 : 5 : … Calculate the distance in the third second for a = 2.0 m s⁻².', 0.5 * 2 * 9 - 0.5 * 2 * 4, 'm',
  's(3) − s(2) = 0.5 × 2.0 × 3² − 0.5 × 2.0 × 2² = 5.0 m', ['C1: s at 3 s and 2 s', 'C1: difference'], sig=2, aq='s')
M('M', 3, 'Which equation would you derive and use to find the time for a known u, v and s (a unknown)?', 's = (u + v)t/2, rearranged to t = 2s/(u + v)', ['v² = u² + 2as', 's = ut + ½at²', 'v = u + at'], 'It is the only one without a.', ['C1: equation', 'C1: rearrangement'])
N('M', 3, 'A sledge slows uniformly from 8.0 m s⁻¹ to 2.0 m s⁻¹ over 25 m. Calculate the time taken.', 2 * 25 / 10, 's',
  't = 2 × 25 ÷ (8.0 + 2.0) = 5.0 s', ['C1: t = 2s/(u + v)', 'C1: value'], sig=2, aq='t')
N('M', 3, 'Using the trapezium idea, find the displacement of a cyclist whose speed rises uniformly from 2.5 m s⁻¹ to 7.5 m s⁻¹ in 12 s.', 0.5 * 10 * 12, 'm',
  's = 0.5 × (2.5 + 7.5) × 12 = 60 m', ['C1: trapezium', 'C1: value'], sig=2, aq='s')
# hard
N('H', 5, 'Derive v² = u² + 2as from v = u + at and s = (u + v)t/2, then calculate v for u = 6.0 m s⁻¹, a = 1.5 m s⁻², s = 40 m.', sqrt(36 + 120), 'm s⁻¹',
  f't = (v − u)/a; s = (u + v)(v − u)/(2a) = (v² − u²)/(2a), so v² = u² + 2as. v = √(6.0² + 2 × 1.5 × 40) = {sf(sqrt(156))} m s⁻¹',
  ['M1: eliminate t', 'B1: difference of squares', 'C1: substitution', 'C1: value'], aq='v')
N('H', 6, 'An object accelerates uniformly from rest. (a) Use s = ½at² to show that the distance in the nth second is a(2n − 1)/2. (b) Calculate the distance in the 5th second for a = 3.0 m s⁻². (c) Calculate the total distance in the first 5 s.', 0.5 * 3 * 25, 'm',
  '(a) s(n) − s(n − 1) = ½a[n² − (n − 1)²] = a(2n − 1)/2. (b) 3.0 × (2 × 5 − 1) ÷ 2 = 13.5 m. (c) 0.5 × 3.0 × 5² = 37.5 m',
  ['M1: difference of s', 'B1: algebra', 'C1: fifth second', 'M1: s = ½at²', 'C1: value'], aq='s')
N('H', 5, 'A train passes two posts 100 m apart, taking 8.0 s for the first 100 m and 6.0 s for the next 100 m, accelerating uniformly. (a) Calculate its average speeds in each interval. (b) Using these as speeds at mid-times, calculate the acceleration.', (100 / 6 - 100 / 8) / 7.0, 'm s⁻²',
  f'(a) 100 ÷ 8.0 = 12.5 m s⁻¹; 100 ÷ 6.0 = {sf(100 / 6, 4)} m s⁻¹. (b) Mid-times are 4.0 s and 11 s, 7.0 s apart: a = ({sf(100 / 6, 4)} − 12.5) ÷ 7.0 = {sf((100 / 6 - 12.5) / 7)} m s⁻²',
  ['C1: average speeds', 'M1: speeds at mid-times', 'C1: Δt = 7.0 s', 'C1: value'], aq='a')
N('H', 6, 'Using s = ut + ½at², derive an expression for the time for a ball thrown upwards at u to return to its starting height, then (a) evaluate it for u = 14.7 m s⁻¹ and (b) find the maximum height.' + take('g'), 14.7 ** 2 / (2 * 9.81), 'm',
  f'0 = ut − ½gt² gives t = 2u/g. (a) t = 2 × 14.7 ÷ 9.81 = {sf(29.4 / 9.81, 3)} s. (b) h = 14.7² ÷ (2 × 9.81) = {sf(14.7 ** 2 / 19.62)} m',
  ['M1: s = 0', 'B1: t = 2u/g', 'C1: value', 'M1: v² = u² − 2gh', 'C1: value'], aq='h')
N('H', 5, 'A car moving at u accelerates uniformly for 5.0 s, covering 75 m and reaching 20 m s⁻¹. (a) Use s = (u + v)t/2 to find u. (b) Find the acceleration.', (20 - (2 * 75 / 5.0 - 20)) / 5.0, 'm s⁻²',
  '(a) 75 = (u + 20) × 5.0 ÷ 2, so u = 2 × 75 ÷ 5.0 − 20 = 10 m s⁻¹. (b) a = (20 − 10) ÷ 5.0 = 2.0 m s⁻²',
  ['M1: rearrange', 'C1: u', 'M1: a = Δv/t', 'C1: value'], sig=2, aq='a')
N('H', 5, 'For constant acceleration, show that the speed at the mid-point in time is (u + v)/2 but the speed at the mid-point in distance is √((u² + v²)/2). Calculate the second for u = 2.0 m s⁻¹ and v = 14 m s⁻¹.', sqrt((4 + 196) / 2), 'm s⁻¹',
  f'Mid-distance: v_m² = u² + 2a(s/2) = u² + (v² − u²)/2 = (u² + v²)/2. v_m = √((2.0² + 14²) ÷ 2) = {sf(sqrt(100))} m s⁻¹',
  ['M1: v² = u² + 2a(s/2)', 'B1: algebra', 'C1: substitution', 'C1: value'], sig=2, aq='v_m')
N('H', 6, 'A cyclist passes point P at 4.0 m s⁻¹ and point Q, 60 m further on, at 8.0 m s⁻¹, accelerating uniformly. (a) Calculate the acceleration. (b) Calculate the time from P to Q. (c) Calculate her speed half way in time between P and Q.', 6.0, 'm s⁻¹',
  '(a) a = (8.0² − 4.0²) ÷ (2 × 60) = 0.40 m s⁻². (b) t = 2 × 60 ÷ (4.0 + 8.0) = 10 s. (c) v = 4.0 + 0.40 × 5.0 = 6.0 m s⁻¹',
  ['C1: a', 'C1: t', 'M1: mid-time', 'C1: substitution', 'C1: value'], sig=2, aq='v')
N('H', 5, 'Show that for a body decelerating uniformly to rest, the stopping distance is proportional to u². If a car stops in 20 m from 15 m s⁻¹, calculate its stopping distance from 30 m s⁻¹ with the same deceleration.', 20 * 4, 'm',
  's = u²/(2a), so s ∝ u². Doubling u multiplies s by 2² = 4: s = 20 × 4 = 80 m',
  ['M1: s = u²/2a', 'B1: s ∝ u²', 'M1: factor 4', 'C1: value'], sig=2, aq='s')

N('E', 2, 'Using v = u + at, calculate a when u = 2.0 m s⁻¹, v = 11 m s⁻¹ and t = 3.0 s.', 3.0, 'm s⁻²',
  'a = (11 − 2.0) ÷ 3.0 = 3.0 m s⁻²', ['C1: rearranged'], sig=2, aq='a')
M('E', 1, 'Which equation of motion does not involve the final velocity v?', 's = ut + ½at²', ['v = u + at', 'v² = u² + 2as', 's = (u + v)t/2'], 'Use it when v is unknown and not needed.')
M('E', 1, 'Which equation of motion does not involve the displacement s?', 'v = u + at', ['s = ut + ½at²', 'v² = u² + 2as', 's = (u + v)t/2'], 'It comes straight from the definition of a.')
N('M', 3, 'Show that s = (u + v)t/2 and s = ut + ½at² agree for u = 3.0 m s⁻¹, a = 1.0 m s⁻², t = 6.0 s. Give s.', 3 * 6 + 0.5 * 36, 'm',
  'v = 3.0 + 1.0 × 6.0 = 9.0 m s⁻¹; (3.0 + 9.0) × 6.0 ÷ 2 = 36 m and 3.0 × 6.0 + 0.5 × 1.0 × 6.0² = 36 m', ['C1: v', 'C1: both give 36 m'], sig=2, aq='s')
N('M', 3, 'A runner speeds up from 4.0 m s⁻¹ to 10 m s⁻¹ with a uniform acceleration of 3.0 m s⁻². Rearrange v² = u² + 2as to find the distance covered.', (100 - 16) / 6, 'm',
  's = (10² − 4.0²) ÷ (2 × 3.0) = 14 m', ['C1: rearranged', 'C1: value'], sig=2, aq='s')
M('M', 3, 'In deriving the equations of motion from a v–t graph, what is the gradient used for?', 'It defines the acceleration, giving a = (v − u)/t', ['It gives the displacement', 'It gives the average velocity', 'It is not used'], 'Gradient → v = u + at; area → s equations.', ['C1: gradient = a', 'C1: v = u + at'])
N('H', 5, 'For a body decelerating uniformly from u to rest at a: (a) show that the stopping time is u/a; (b) show that the stopping distance is u²/2a; (c) calculate the stopping distance for u = 18 m s⁻¹ and a = 4.5 m s⁻².', 18 ** 2 / 9, 'm',
  '(a) 0 = u − at gives t = u/a. (b) s = ut − ½at² = u²/a − u²/2a = u²/2a. (c) s = 18² ÷ (2 × 4.5) = 36 m',
  ['B1: time', 'B1: distance', 'M1: substitution', 'C1: value'], sig=2, aq='s')
N('H', 5, 'For an object falling from rest, show using s = ½gt² that the distances fallen in successive intervals of length T differ by gT². Calculate gT² for T = 0.10 s.' + take('g'), 9.81 * 0.01, 'm',
  'Interval n covers ½g(nT)² − ½g((n − 1)T)² = ½gT²(2n − 1); successive intervals differ by gT². gT² = 9.81 × 0.10² = 0.0981 m',
  ['M1: difference of squares', 'B1: increments of gT²', 'C1: substitution', 'C1: value'], aq='gT²')
N('M', 3, 'Rearrange v² = u² + 2as to find u, and calculate u when v = 13 m s⁻¹, a = 2.0 m s⁻² and s = 36 m.', sqrt(169 - 144), 'm s⁻¹',
  'u = √(v² − 2as) = √(13² − 2 × 2.0 × 36) = 5.0 m s⁻¹', ['C1: rearranged', 'C1: value'], sig=2, aq='u')
N('M', 3, 'A v–t line rises from rest to 9.0 m s⁻¹ in 6.0 s. Using the triangle area, show that s = ½vt and calculate s.', 0.5 * 9 * 6, 'm',
  'Area = ½ × base × height = 0.5 × 9.0 × 6.0 = 27 m', ['C1: triangle', 'C1: value'], sig=2, aq='s')

# ═════════════════════════ 2.10 Uniform and non-uniform acceleration (17/20/13) ═════════════════════════
lesson('2.10')
M('E', 1, 'What is meant by uniform acceleration?', 'Acceleration that stays constant in size and direction', ['Acceleration that is zero', 'Acceleration that keeps increasing', 'Acceleration of a falling object only'], 'Its v–t graph is a straight line.')
M('E', 1, 'Which v–t graph shows non-uniform acceleration?', 'A curved line', ['A straight sloping line', 'A horizontal line', 'A straight line through the origin'], 'A changing gradient means a changing acceleration.')
M('E', 1, 'Can the suvat equations be used for non-uniform acceleration?', 'No, they apply only when the acceleration is constant', ['Yes, always', 'Only for falling objects', 'Only if the object starts from rest'], 'Non-uniform motion needs graphs or other methods.')
M('E', 1, 'A skydiver jumps from a plane. How does her acceleration change as she speeds up?', 'It decreases because air resistance increases', ['It stays at 9.81 m s⁻²', 'It increases', 'It becomes negative immediately'], 'The resultant force falls.')
N('E', 2, 'A car\'s speed rises from 0 to 12 m s⁻¹ in the first 4.0 s and from 12 to 18 m s⁻¹ in the next 4.0 s. Calculate the acceleration in the first 4.0 s.', 3.0, 'm s⁻²',
  'a = 12 ÷ 4.0 = 3.0 m s⁻²', ['C1: Δv/t'], sig=2, aq='a')
N('E', 2, 'For that car, calculate the acceleration in the second 4.0 s interval (12 to 18 m s⁻¹).', 1.5, 'm s⁻²',
  'a = (18 − 12) ÷ 4.0 = 1.5 m s⁻²', ['C1: Δv/t'], sig=2, aq='a')
M('E', 1, 'From those two values (3.0 then 1.5 m s⁻²), what kind of acceleration does the car have?', 'Non-uniform (decreasing) acceleration', ['Uniform acceleration', 'Zero acceleration', 'Increasing acceleration'], 'The acceleration changed.')
M('E', 1, 'How is the instantaneous acceleration found from a curved v–t graph?', 'From the gradient of the tangent at that time', ['From the area under the curve', 'From the final velocity', 'From the intercept'], 'Draw a tangent and measure its gradient.')
M('E', 1, 'A ball falling in a vacuum has which kind of acceleration?', 'Uniform, equal to g', ['Non-uniform', 'Zero', 'Increasing'], 'Only gravity acts, so a = g at all times.')
N('E', 2, 'A curved v–t graph has a tangent of gradient 2.4 m s⁻² at t = 3.0 s. State the instantaneous acceleration at 3.0 s.', 2.4, 'm s⁻²',
  'a = gradient of tangent = 2.4 × 1 = 2.4 m s⁻²', ['C1: tangent gradient'], sig=2, aq='a')
M('E', 1, 'Which describes a car moving at constant speed round a circular track?', 'Its acceleration has constant size but changing direction, so it is non-uniform', ['Uniform acceleration', 'Zero acceleration', 'Increasing speed'], 'Direction of a changes continuously.')
N('E', 2, 'A sphere falling in oil has speeds 0.10, 0.17, 0.21 and 0.23 m s⁻¹ at 0.1 s intervals. Calculate its average acceleration over the first interval.', 0.07 / 0.1, 'm s⁻²',
  'a = (0.17 − 0.10) ÷ 0.1 = 0.70 m s⁻²', ['C1: Δv/Δt'], sig=2, aq='a')
M('E', 1, 'For the sphere in oil (speeds 0.10, 0.17, 0.21, 0.23 m s⁻¹), what is happening to its acceleration?', 'It is decreasing towards zero', ['It is constant', 'It is increasing', 'It is negative'], 'The speed increases by smaller amounts each interval.')
M('E', 1, 'What can be found from a curved v–t graph by counting squares under it?', 'The displacement', ['The acceleration at a point', 'The mass', 'The force'], 'Area gives displacement for any v–t graph.')
N('E', 1, 'A tangent to a v–t curve rises 6.0 m s⁻¹ over 4.0 s. Calculate the acceleration it shows.', 1.5, 'm s⁻²',
  'a = 6.0 ÷ 4.0 = 1.5 m s⁻²', [], sig=2, aq='a')
M('E', 1, 'Why is the average acceleration over an interval not the same as the instantaneous acceleration for non-uniform motion?', 'The acceleration changes during the interval, so the average differs from the value at any one instant', ['Because velocity is a vector', 'They are always the same', 'Because time is a scalar'], 'Only for uniform acceleration are they equal.')
N('E', 2, 'A rocket\'s speed rises from 100 m s⁻¹ to 250 m s⁻¹ in 5.0 s, with increasing acceleration. Calculate its average acceleration.', 30, 'm s⁻²',
  'a = (250 − 100) ÷ 5.0 = 30 m s⁻²', ['C1: Δv/t'], sig=2, aq='a')
# medium
M('M', 3, 'Why does a rocket\'s acceleration increase as it burns fuel, even with constant thrust?', 'Its mass decreases, so the same force gives a larger acceleration', ['The thrust increases', 'Gravity increases', 'Air resistance increases'], 'a = F/m with m falling.', ['C1: mass decreases', 'C1: a = F/m'])
N('M', 3, 'A car\'s velocity is given by v = 0.30t² (v in m s⁻¹, t in s). Calculate its average acceleration between t = 2.0 s and t = 4.0 s.', (0.3 * 16 - 0.3 * 4) / 2.0, 'm s⁻²',
  'v(2.0) = 1.2 m s⁻¹; v(4.0) = 4.8 m s⁻¹; a = (4.8 − 1.2) ÷ 2.0 = 1.8 m s⁻²', ['C1: both velocities', 'C1: Δv/Δt'], sig=2, aq='a')
M('M', 3, 'For v = 0.30t², is the acceleration uniform?', 'No; the v–t graph is a curve, so the acceleration increases with time', ['Yes, it is 0.30 m s⁻²', 'Yes, it is 0.60 m s⁻²', 'It is zero'], 'Here a = dv/dt = 0.60t, which grows with t.', ['C1: curved graph', 'C1: a increases'])
N('M', 3, 'A tangent to a skydiver\'s v–t curve at 4.0 s passes through (0 s, 12 m s⁻¹) and (8.0 s, 44 m s⁻¹). Calculate her acceleration at 4.0 s.', 32 / 8.0, 'm s⁻²',
  'a = (44 − 12) ÷ 8.0 = 4.0 m s⁻²', ['C1: tangent gradient', 'C1: value'], sig=2, aq='a')
N('M', 3, 'A sphere in oil has speeds 0.10, 0.17, 0.21, 0.23 m s⁻¹ at 0.1 s intervals. Calculate the average acceleration over the whole 0.3 s.', 0.13 / 0.3, 'm s⁻²',
  'a = (0.23 − 0.10) ÷ 0.3 = 0.433 m s⁻²', ['C1: overall Δv', 'C1: ÷ 0.3 s'], aq='a')
M('M', 3, 'Why can s = ut + ½at² not be used to find how far a skydiver falls in the first 10 s?', 'Her acceleration is not constant because air resistance increases with speed', ['Because u is not zero', 'Because g is not known', 'Because she is moving downwards'], 'suvat needs uniform acceleration.', ['C1: a not constant', 'C1: reason'])
N('M', 3, 'An estimate of the area under a curved v–t graph gives 38 large squares, each 1.0 m s⁻¹ × 1.0 s. Estimate the displacement.', 38, 'm',
  'Each square = 1.0 × 1.0 = 1.0 m; s = 38 × 1.0 = 38 m', ['C1: square value', 'C1: value'], sig=2, aq='s')
N('M', 3, 'A car\'s acceleration falls steadily from 4.0 m s⁻² at t = 0 to zero at t = 6.0 s. Using the area under its a–t graph, calculate its gain in speed.', 0.5 * 4.0 * 6.0, 'm s⁻¹',
  'Δv = area under a–t graph = 0.5 × 4.0 × 6.0 = 12 m s⁻¹', ['C1: area under a–t gives Δv', 'C1: triangle'], sig=2, aq='Δv')
M('M', 3, 'What does the area under an acceleration–time graph represent?', 'The change in velocity', ['The displacement', 'The acceleration', 'The force'], 'Area = sum of a Δt = total change in velocity.', ['C1: area', 'C1: Δv'])
N('M', 3, 'A train\'s acceleration is 0.50 m s⁻² for 20 s and then 0.20 m s⁻² for 30 s, starting from rest. Calculate its final speed.', 0.5 * 20 + 0.2 * 30, 'm s⁻¹',
  'v = 0.50 × 20 + 0.20 × 30 = 16 m s⁻¹', ['C1: each stage', 'C1: sum'], sig=2, aq='v')
N('M', 4, 'For that train (0.50 m s⁻² for 20 s, then 0.20 m s⁻² for 30 s from rest), calculate the total distance travelled.', 0.5 * 0.5 * 400 + 10 * 30 + 0.5 * 0.2 * 900, 'm',
  'Stage 1: 0.5 × 0.50 × 20² = 100 m, reaching 10 m s⁻¹. Stage 2: 10 × 30 + 0.5 × 0.20 × 30² = 390 m. Total = 100 + 390 = 490 m', ['C1: stage 1', 'C1: stage 2', 'C1: total'], sig=2, aq='s')
M('M', 3, 'A motion with two stages of different constant accelerations can be analysed with suvat. Why?', 'The acceleration is uniform within each stage, so suvat applies to each stage separately', ['suvat always works', 'Because the average acceleration is used', 'Because the final speed is zero'], 'Use the end of stage 1 as the start of stage 2.', ['C1: piecewise uniform', 'C1: link stages'])
N('M', 3, 'A ball falls with air resistance. Its speed is 8.6 m s⁻¹ after 1.0 s and 15.8 m s⁻¹ after 2.0 s. Calculate its average acceleration in the second second.', 7.2, 'm s⁻²',
  'a = (15.8 − 8.6) ÷ 1.0 = 7.2 m s⁻²', ['C1: Δv', 'C1: ÷ 1.0 s'], sig=2, aq='a')
M('M', 3, 'In that fall (average acceleration 7.2 m s⁻² in the second second), why is it less than 9.81 m s⁻²?', 'Air resistance opposes the motion and grows with speed', ['g is smaller higher up', 'The ball is losing mass', 'The timer is wrong'], 'The resultant force is less than the weight.', ['C1: drag', 'C1: resultant force reduced'])
N('M', 3, 'A sprinter\'s speed is 0, 6.0, 8.5, 9.6 and 10.0 m s⁻¹ at t = 0, 1, 2, 3 and 4 s. Estimate the distance in the first 4 s by treating each second as uniform acceleration.', (0 + 6) / 2 + (6 + 8.5) / 2 + (8.5 + 9.6) / 2 + (9.6 + 10) / 2, 'm',
  's = (0 + 6.0)/2 + (6.0 + 8.5)/2 + (8.5 + 9.6)/2 + (9.6 + 10.0)/2 = 29.1 m', ['C1: trapezia', 'C1: sum'], aq='s')
N('M', 3, 'For the sprinter (0, 6.0, 8.5, 9.6, 10.0 m s⁻¹ at 0–4 s), calculate the average acceleration in the first second and in the fourth second. Give the first minus the fourth.', 6.0 - 0.4, 'm s⁻²',
  'First: 6.0 ÷ 1 = 6.0 m s⁻²; fourth: (10.0 − 9.6) ÷ 1 = 0.40 m s⁻²; difference = 6.0 − 0.40 = 5.6 m s⁻²', ['C1: both', 'C1: difference'], sig=2, aq='Δa')
# hard
N('H', 5, 'A car\'s velocity is v = 20(1 − e^(−t/5.0)) m s⁻¹. (a) Calculate v at 5.0 s. (b) The acceleration is a = 4.0e^(−t/5.0). Calculate it at 5.0 s. (c) State the limit of a as t becomes large.', 4.0 * exp(-1), 'm s⁻²',
  f'(a) v = 20 × (1 − e^(−1)) = {sf(20 * (1 - exp(-1)))} m s⁻¹. (b) a = 4.0 × e^(−1) = {sf(4 * exp(-1))} m s⁻². (c) Zero.',
  ['C1: v', 'M1: substitution in a', 'C1: value', 'B1: limit zero'], aq='a')
N('H', 6, 'An a–t graph for a lift (up positive): +1.2 m s⁻² for 2.0 s, 0 for 5.0 s, −0.80 m s⁻² for 3.0 s, from rest. (a) Calculate the speed after 2.0 s. (b) Calculate the speed at 10 s. (c) Calculate the total height risen.', 0.5 * 1.2 * 4 + 2.4 * 5 + 2.4 * 3 - 0.5 * 0.8 * 9, 'm',
  '(a) v = 1.2 × 2.0 = 2.4 m s⁻¹. (b) v = 2.4 − 0.80 × 3.0 = 0. (c) 0.5 × 1.2 × 2.0² + 2.4 × 5.0 + (2.4 × 3.0 − 0.5 × 0.80 × 3.0²) = 2.4 + 12 + 3.6 = 18 m',
  ['C1: speed', 'C1: final speed', 'M1: suvat per stage', 'C1: stage distances', 'C1: total'], sig=2, aq='h')
N('H', 5, 'A sphere in oil reaches terminal velocity 0.25 m s⁻¹. Its speed is 0.20 m s⁻¹ at t = 0.10 s and 0.24 m s⁻¹ at t = 0.20 s. (a) Calculate its average acceleration in this interval. (b) State and explain its acceleration at terminal velocity.', 0.04 / 0.10, 'm s⁻²',
  '(a) a = (0.24 − 0.20) ÷ 0.10 = 0.40 m s⁻². (b) Zero: the weight is balanced by drag and upthrust, so the velocity is constant.',
  ['C1: Δv', 'C1: value', 'B1: zero', 'B1: balanced forces'], sig=2, aq='a')
N('H', 6, 'A falling ball\'s speed is recorded as 0, 9.0, 16.5, 22.0, 25.5 m s⁻¹ at 0, 1, 2, 3, 4 s. (a) Show the acceleration is non-uniform. (b) Estimate the distance fallen in 4 s using trapezia. (c) Compare with the distance if a were 9.81 m s⁻² throughout.' + take('g'), 0.5 * 9.81 * 16 - ((0 + 9) / 2 + (9 + 16.5) / 2 + (16.5 + 22) / 2 + (22 + 25.5) / 2), 'm',
  f'(a) Δv per second: 9.0, 7.5, 5.5, 3.5, not constant. (b) s = 4.5 + 12.75 + 19.25 + 23.75 = 60.25 m. (c) 0.5 × 9.81 × 4² = 78.48 m, so 78.48 − 60.25 = {sf(78.48 - 60.25)} m more',
  ['C1: changing Δv', 'M1: trapezium areas', 'C1: estimate', 'C1: free-fall value', 'C1: difference'], aq='Δs')
N('H', 5, 'A car accelerates from rest with a = 3.0 − 0.50t (m s⁻², 0 ≤ t ≤ 6.0 s). (a) Sketch the a–t graph and state its value at 6.0 s. (b) Calculate the speed at 6.0 s from the area under the a–t graph.', 0.5 * 3.0 * 6.0, 'm s⁻¹',
  '(a) A straight line from 3.0 m s⁻² falling to 0 at 6.0 s. (b) Δv = 0.5 × 3.0 × 6.0 = 9.0 m s⁻¹',
  ['B1: straight line to zero', 'M1: area = Δv', 'C1: triangle', 'C1: value'], sig=2, aq='v')
N('H', 5, 'A train accelerates from rest at 0.80 m s⁻² for 15 s and then at 0.40 m s⁻² for a further 25 s. (a) Calculate the speed after 15 s. (b) Calculate the speed after 40 s. (c) Calculate the average acceleration over 40 s.', (0.8 * 15 + 0.4 * 25) / 40, 'm s⁻²',
  '(a) 0.80 × 15 = 12 m s⁻¹. (b) 12 + 0.40 × 25 = 22 m s⁻¹. (c) a = 22 ÷ 40 = 0.55 m s⁻²',
  ['C1: first speed', 'C1: second speed', 'M1: Δv/t', 'C1: value'], sig=2, aq='a')
N('H', 6, 'A cyclist\'s speed rises from 4.0 m s⁻¹ with acceleration 1.0 m s⁻² for 4.0 s, then 0.25 m s⁻² for 8.0 s. (a) Calculate the speed at 4.0 s and at 12 s. (b) Calculate the distance in each stage. (c) Calculate the average speed over 12 s.', (4 * 4 + 0.5 * 16 + 8 * 8 + 0.5 * 0.25 * 64) / 12, 'm s⁻¹',
  f'(a) 4.0 + 1.0 × 4.0 = 8.0 m s⁻¹; 8.0 + 0.25 × 8.0 = 10 m s⁻¹. (b) 4.0 × 4.0 + 0.5 × 1.0 × 4.0² = 24 m; 8.0 × 8.0 + 0.5 × 0.25 × 8.0² = 72 m. (c) (24 + 72) ÷ 12 = {sf(96 / 12)} m s⁻¹',
  ['C1: speeds', 'C1: stage 1', 'C1: stage 2', 'M1: total ÷ time', 'C1: value'], sig=2, aq='v')
N('H', 5, 'Explain why a parachutist\'s v–t graph has a steep curve after the parachute opens and then levels off. Then calculate the average deceleration if she slows from 55 m s⁻¹ to 6.0 m s⁻¹ in 2.5 s.', (55 - 6) / 2.5, 'm s⁻²',
  'Drag suddenly exceeds weight, so she decelerates; as she slows, drag falls until it equals weight again and v is constant. a = (55 − 6.0) ÷ 2.5 = 19.6 m s⁻²',
  ['B1: drag > weight', 'B1: drag falls to equal weight', 'M1: Δv/t', 'C1: value'], aq='a')
N('E', 2, 'A car\'s speed is 0, 4.0, 8.0 and 12 m s⁻¹ at t = 0, 1.0, 2.0 and 3.0 s. Calculate its acceleration.', 4.0, 'm s⁻²',
  'Speed rises by 4.0 m s⁻¹ each second: a = 4.0 ÷ 1.0 = 4.0 m s⁻²', ['C1: constant increase'], sig=2, aq='a')
M('E', 1, 'Which of these has uniform acceleration?', 'A stone falling in a vacuum', ['A skydiver before terminal velocity', 'A car pulling away in traffic', 'A ball bouncing on a floor'], 'Only gravity acts on the stone.')
N('E', 2, 'At t = 2.0 s a v–t curve has a tangent of gradient 5.0 m s⁻². Estimate the change in velocity in the next 0.10 s.', 0.50, 'm s⁻¹',
  'Δv ≈ a Δt = 5.0 × 0.10 = 0.50 m s⁻¹', ['C1: Δv = aΔt'], sig=2, aq='Δv')
M('E', 1, 'A car\'s speed increases by 2, then 4, then 6 m s⁻¹ in successive seconds. What kind of acceleration is this?', 'Increasing (non-uniform) acceleration', ['Uniform acceleration', 'Zero acceleration', 'Deceleration'], 'The change per second is growing.')
N('M', 3, 'An object\'s velocity is v = 2.0t + 0.50t² (v in m s⁻¹, t in s). Calculate its average acceleration from t = 0 to t = 4.0 s.', (2 * 4 + 0.5 * 16) / 4, 'm s⁻²',
  'v(4.0) = 2.0 × 4.0 + 0.50 × 4.0² = 16 m s⁻¹; a = 16 ÷ 4.0 = 4.0 m s⁻²', ['C1: v(4.0)', 'C1: Δv/Δt'], sig=2, aq='a')
N('M', 3, 'An a–t graph shows 2.0 m s⁻² for 3.0 s and then 1.0 m s⁻² for 4.0 s. Calculate the total change in velocity.', 2 * 3 + 1 * 4, 'm s⁻¹',
  'Δv = 2.0 × 3.0 + 1.0 × 4.0 = 10 m s⁻¹', ['C1: area of each part', 'C1: sum'], sig=2, aq='Δv')
N('M', 3, 'A rocket\'s acceleration rises uniformly from 20 m s⁻² to 30 m s⁻² over 10 s. Calculate its gain in speed.', (20 + 30) / 2 * 10, 'm s⁻¹',
  'Δv = area under a–t = (20 + 30) ÷ 2 × 10 = 250 m s⁻¹', ['C1: trapezium', 'C1: value'], sig=2, aq='Δv')
M('M', 3, 'Is the acceleration of a bouncing ball uniform throughout its motion?', 'No: it is g downwards in the air but large and upwards while in contact with the floor', ['Yes, always g', 'Yes, always zero', 'Only during the bounce'], 'The contact force acts briefly.', ['C1: in flight g', 'C1: contact large upward'])
N('M', 3, 'A ball falling through air has speeds of 12.0 m s⁻¹ at 1.5 s and 15.2 m s⁻¹ at 2.0 s. Calculate its average acceleration over this interval.', 3.2 / 0.5, 'm s⁻²',
  'a = (15.2 − 12.0) ÷ 0.50 = 6.4 m s⁻²', ['C1: Δv', 'C1: ÷ Δt'], sig=2, aq='a')
N('E', 2, 'Tangents to a v–t curve give accelerations of 8.0 m s⁻² at 1.0 s and 2.0 m s⁻² at 5.0 s. By how much has the acceleration fallen?', 6.0, 'm s⁻²',
  'Fall = 8.0 − 2.0 = 6.0 m s⁻²', ['C1: difference'], sig=2, aq='Δa')
N('H', 5, 'A car\'s velocity is v = 15(1 − e^(−t/3.0)) m s⁻¹. (a) Calculate v at 2.5 s and 3.5 s. (b) Estimate the acceleration at 3.0 s from the chord.', 15 * (exp(-2.5 / 3) - exp(-3.5 / 3)) / 1.0, 'm s⁻²',
  f'(a) v(2.5) = {sf(15 * (1 - exp(-2.5 / 3)), 4)} m s⁻¹; v(3.5) = {sf(15 * (1 - exp(-3.5 / 3)), 4)} m s⁻¹. (b) a ≈ ({sf(15 * (1 - exp(-3.5 / 3)), 4)} − {sf(15 * (1 - exp(-2.5 / 3)), 4)}) ÷ 1.0 = {sf(15 * (exp(-2.5 / 3) - exp(-3.5 / 3)))} m s⁻²',
  ['C1: v(2.5)', 'C1: v(3.5)', 'M1: chord gradient', 'C1: value'], aq='a')
N('H', 5, 'A car starting from rest has acceleration 3.0 m s⁻² for the first 4.0 s, after which its acceleration decreases uniformly to zero at 10 s. (a) Calculate its speed at 4.0 s. (b) Calculate its speed at 10 s from the area under the a–t graph.', 12 + 0.5 * 3.0 * 6.0, 'm s⁻¹',
  '(a) 3.0 × 4.0 = 12 m s⁻¹. (b) v = 12 + 0.5 × 3.0 × 6.0 = 21 m s⁻¹', ['C1: rectangle', 'M1: triangle area', 'C1: sum', 'C1: value'], sig=2, aq='v')
N('M', 3, 'A cyclist\'s speed is 2.0, 3.5, 4.5 and 5.0 m s⁻¹ at t = 0, 2.0, 4.0 and 6.0 s. Estimate the distance travelled using trapezia.', (2 + 3.5) + (3.5 + 4.5) + (4.5 + 5.0), 'm',
  's = (2.0 + 3.5) ÷ 2 × 2.0 + (3.5 + 4.5) ÷ 2 × 2.0 + (4.5 + 5.0) ÷ 2 × 2.0 = 23 m', ['C1: trapezia', 'C1: sum'], sig=2, aq='s')
