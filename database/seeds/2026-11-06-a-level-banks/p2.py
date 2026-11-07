# P2 Planning, analysis and evaluation (Paper 5 skills): P2.1 to P2.5.


def lg(x):
    return log10(x)


# ═════════════════════════ P2.1 Planning and analysis (17/17/10) ═════════════════════════
lesson('P2.1')
M('E', 1, 'A student investigates how the period of a pendulum depends on the length of its string. Which is the independent variable?', 'The length of the string', ['The period', 'The mass of the bob', 'The amplitude of the swing'], 'The independent variable is the one the experimenter changes deliberately.')
M('E', 1, 'A student records how the current in a thermistor changes as the thermistor is heated in a water bath. Which is the dependent variable?', 'The current', ['The temperature of the water', 'The supply voltage', 'The volume of water'], 'The dependent variable is the one measured as the other is changed.')
M('E', 1, 'In an investigation of how the extension of a spring depends on the load hung from it, which should be a control variable?', 'The spring used (same material, coil diameter and number of turns)', ['The load', 'The extension', 'The number of readings'], 'Everything except the load and the extension must stay the same.')
N('E', 2, 'It is suggested that y = kx². What gradient would a graph of lg y against lg x have if the suggestion is correct?', 2, None,
  'lg y = lg k + 2 lg x, so the gradient is n = 2 × 1 = 2', ['C1: lg y = n lg x + lg k'], sig=1, aq='gradient')
N('E', 2, 'The straight line on a graph of lg I against lg d cuts the lg I axis at 1.30. If I = kdⁿ, find k.', 10 ** 1.30, None,
  f'lg k = 1.30, so k = 10^1.30 = {sf(10 ** 1.3)}', ['C1: intercept = lg k'], aq='k')
M('E', 1, 'A quantity y is expected to be related to x by y = ax + b, where a and b are constants. Which graph gives a straight line?', 'y against x', ['lg y against lg x', 'y against x²', '1/y against x'], 'y = ax + b is already the equation of a straight line, gradient a and intercept b.')
M('E', 1, 'Which graph should be plotted to test whether the period T of a pendulum is proportional to √L?', 'T against √L', ['T against L', 'T² against √L', 'lg T against L'], 'If T ∝ √L, a graph of T against √L is a straight line through the origin.')
N('E', 2, 'For a relationship v = k/u, a student plots v against 1/u. The straight line passes through the origin and the point (0.50, 6.0). Find k.', 6.0 / 0.50, None,
  'k is the gradient: k = 6.0 ÷ 0.50 = 12', ['C1: gradient = k'], sig=2, aq='k')
M('E', 1, 'What is meant by a control variable in an experiment?', 'A quantity kept constant so that it cannot affect the dependent variable', ['The quantity that is measured', 'The quantity that is changed', 'A quantity that is ignored'], 'Only one variable should be changed at a time.')
M('E', 1, 'A student wants to test whether the power P in a resistor is proportional to V². Which graph should give a straight line through the origin?', 'P against V²', ['P against V', 'P² against V', 'lg P against V'], 'If P = kV², plotting P against V² gives a line of gradient k through the origin.')
N('E', 1, 'Data suggest that y = 4.0xⁿ. When x = 2.0, y = 32. Calculate n.', log10(32 / 4.0) / log10(2.0), None,
  f'2.0ⁿ = 32 ÷ 4.0 = 8, so n = lg 8 ÷ lg 2 = {sf(log10(8) / log10(2), 2)}', [], sig=2, aq='n')
M('E', 1, 'Why is a graph of lg y against lg x drawn when y = kxⁿ with n unknown?', 'lg y = n lg x + lg k is a straight-line equation, so n is the gradient', ['It always passes through the origin', 'It makes the readings more precise', 'It removes the need for a best-fit line'], 'Taking logs turns the power law into a straight line.')
N('E', 2, 'A graph of ln y against x is a straight line with gradient −0.25 m⁻¹. If y = y₀e^(−kx), state k.', 0.25, 'm⁻¹',
  'ln y = ln y₀ − kx, so k = −(gradient) = −(−0.25) = 0.25 m⁻¹', ['C1: gradient = −k'], sig=2, aq='k')
M('E', 1, 'A student changes the angle of a ramp and times a trolley rolling down it. Which is the independent variable?', 'The angle of the ramp', ['The time taken', 'The mass of the trolley', 'The length of the ramp'], 'The angle is the quantity the student chooses to change.')
N('E', 2, 'A best-fit line on a log–log graph has the equation lg y = 1.5 lg x + 0.48. Calculate y when x = 4.0.', 10 ** 0.48 * 4.0 ** 1.5, None,
  f'y = 10^0.48 × 4.0^1.5 = {sf(10 ** 0.48 * 8)}', ['C1: y = kxⁿ with k = 10^0.48'], aq='y')
M('E', 1, 'What should the hypothesis in an experimental plan state?', 'The expected relationship between the independent and dependent variables', ['The list of apparatus', 'The safety precautions', 'The final result'], 'For example: "T is proportional to √L".')
M('E', 1, 'A plan uses a 5 kV supply. Which precaution is appropriate?', 'Use insulated leads and switch the supply off before changing any connection', ['Wear safety goggles only', 'Use a smaller ammeter', 'Keep the room dark'], 'High voltages are an electrocution hazard.')
# medium
N('M', 3, 'The intensity I at distance d from a small lamp is thought to follow I = kdⁿ. When d = 0.20 m, I = 25.0 W m⁻²; when d = 0.40 m, I = 6.25 W m⁻². Calculate n.', log10(6.25 / 25.0) / log10(0.40 / 0.20), None,
  f'n = lg(6.25 ÷ 25.0) ÷ lg(0.40 ÷ 0.20) = {sf(log10(0.25) / log10(2), 3)}', ['C1: ratio of intensities', 'C1: ratio of distances, logs'], sign=True, aq='n')
M('M', 3, 'It is suggested that the resistance R of a wire of fixed length is related to its diameter d by R = k/d². Which graph and result would support this?', 'A graph of R against 1/d² is a straight line through the origin', ['A graph of R against d is a straight line', 'A graph of R against d² is a straight line through the origin', 'A graph of lg R against lg d has gradient +2'], 'R ∝ 1/d² means R against 1/d² is a line through the origin (or lg R against lg d has gradient −2).', ['C1: plot R against 1/d²', 'C1: straight line through origin'])
N('M', 3, 'A graph of lg F against lg r has gradient −2.1 and meets the lg F axis at 0.70, with F in N and r in m. Using F = krⁿ, calculate F when r = 3.0 m.', 10 ** 0.70 * 3.0 ** -2.1, 'N',
  f'k = 10^0.70 = {sf(10 ** 0.7, 4)}; F = {sf(10 ** 0.7, 4)} × 3.0^(−2.1) = {sf(10 ** 0.7 * 3 ** -2.1)} N', ['C1: k from the intercept', 'C1: n = −2.1 used'], aq='F')
M('M', 3, 'A student plans to find how the frequency of the fundamental of a stretched wire depends on its tension. Which quantities must be kept constant?', 'The vibrating length and the type and diameter of the wire', ['The tension and the frequency', 'Only the room temperature', 'The mass hung from the wire'], 'f depends on length, tension and mass per unit length; only the tension is varied.', ['C1: length', 'C1: wire (mass per unit length)'])
N('M', 3, 'The relationship T = 2π√(m/k) for a mass on a spring is tested by plotting T² against m. The gradient is 0.16 s² kg⁻¹. Calculate the spring constant k.', 4 * pi ** 2 / 0.16, 'N m⁻¹',
  f'T² = (4π²/k)m, so k = 4π² ÷ 0.16 = {sf(4 * pi ** 2 / 0.16)} N m⁻¹', ['C1: gradient = 4π²/k', 'C1: rearranged'], aq='k')
N('M', 4, 'A quantity follows y = ae^(bx). A graph of ln y against x has gradient 0.35 and intercept 1.20 on the ln y axis. Calculate y when x = 4.0.', exp(1.20 + 0.35 * 4.0), None,
  f'ln y = 1.20 + 0.35 × 4.0 = 2.60, so y = e^(2.60) = {sf(exp(2.6))}', ['M1: ln y = ln a + bx', 'C1: ln y = 2.60', 'C1: exponentiate'], aq='y')
M('M', 3, 'A student thinks the time t for a ball to roll down a slope of angle θ obeys t = k/√(sin θ). What should be plotted to test this?', 't against 1/√(sin θ), expecting a straight line through the origin', ['t against θ', 't² against sin θ', 't against sin θ'], 'Plotting t against 1/√(sin θ) linearises the expected relationship.', ['C1: correct axes', 'C1: line through origin'])
N('M', 3, 'Using s = ½at², a student plots s against t² for a trolley released from rest. The gradient is 0.42 m s⁻². Calculate the acceleration a.', 2 * 0.42, 'm s⁻²',
  'Gradient = a/2, so a = 2 × 0.42 = 0.84 m s⁻²', ['C1: gradient = ½a', 'C1: value'], sig=2, aq='a')
N('M', 3, 'The best-fit line on a graph of lg y against lg x passes through (0.20, 1.10) and (0.80, 2.30). If y = kxⁿ, find n.', (2.30 - 1.10) / (0.80 - 0.20), None,
  'n = gradient = (2.30 − 1.10) ÷ (0.80 − 0.20) = 2.0', ['C1: gradient = n', 'C1: values from two points'], sig=2, aq='n')
N('M', 4, 'A line on a graph of lg y against lg x passes through (0.30, 0.95) and (0.90, 2.15). For y = kxⁿ, calculate k.', 10 ** (0.95 - 2.0 * 0.30), None,
  f'n = (2.15 − 0.95) ÷ (0.90 − 0.30) = 2.0. lg k = 0.95 − 2.0 × 0.30 = 0.35, so k = 10^0.35 = {sf(10 ** 0.35)}', ['C1: gradient', 'M1: intercept from a point', 'C1: inverse log'], aq='k')
M('M', 3, 'Why should a plan include a short trial (preliminary) experiment?', 'To choose suitable ranges, apparatus and values before the main readings are taken', ['To produce the final graph', 'To replace repeat readings', 'To avoid calculating uncertainties'], 'A trial run shows which values are practical and measurable.', ['C1: choose range', 'C1: check apparatus works'])
M('M', 3, 'An experiment uses a sealed γ-ray source. Which set of precautions is appropriate?', 'Handle it with long tongs, keep it at a distance and minimise the time it is out of its lead box', ['Wear rubber gloves only', 'Keep it in water', 'Hold it close so the count rate is high'], 'Distance, time and shielding reduce the dose.', ['C1: tongs/distance', 'C1: minimise time, store shielded'])
N('M', 3, 'The count rate C through an absorber of thickness x follows C = C₀e^(−µx). A graph of ln C against x has gradient −0.12 mm⁻¹. Calculate the thickness that halves the count rate, in mm.', log(2) / 0.12, 'mm',
  f'µ = 0.12 mm⁻¹; x½ = ln 2 ÷ 0.12 = {sf(log(2) / 0.12)} mm', ['C1: µ = −gradient', 'C1: x½ = ln 2/µ'], aq='x½')
M('M', 3, 'How can a student decide whether data fit y = kxⁿ rather than y = kx + c?', 'Plot lg y against lg x: a power law gives a straight line whose gradient is n', ['Plot y against x and look for a curve', 'Calculate the mean of y', 'Plot x against y'], 'Only a power law gives a straight log–log graph.', ['C1: log–log graph', 'C1: straight line test'])
N('M', 3, 'A power law y = kxⁿ has n = 0.50 according to a log–log graph, and y = 6.0 when x = 4.0. Calculate k.', 6.0 / 4.0 ** 0.5, None,
  'k = y ÷ xⁿ = 6.0 ÷ 4.0^0.50 = 3.0', ['C1: k = y/xⁿ', 'C1: substitution'], sig=2, aq='k')
M('M', 4, 'A plan is to measure the resistance of a wire as its length is varied. Why should the current be kept small and switched off between readings?', 'So that the wire does not heat up, because its resistance changes with temperature', ['So that the ammeter reads more precisely', 'So that the length stays the same', 'To save energy from the supply'], 'Temperature is a control variable that the current could change.', ['C1: heating effect', 'C1: R depends on temperature', 'C1: temperature controlled'])
N('M', 3, 'A student times the fall of a ball through a fixed height for different heights h and plots t² against h. The gradient is 0.204 s² m⁻¹. Calculate g.', 2 / 0.204, 'm s⁻²',
  f'h = ½gt², so t² = (2/g)h and g = 2 ÷ 0.204 = {sf(2 / 0.204)} m s⁻²', ['C1: gradient = 2/g', 'C1: rearranged'], aq='g')
# hard
N('H', 5, 'A student records x = 1.0, 2.0, 4.0, 8.0 and y = 3.0, 8.5, 24, 68 and suspects y = kxⁿ. (a) Explain why a graph of lg y against lg x is useful. (b) Use the first and last pairs of values to find n.', log10(68 / 3.0) / log10(8.0 / 1.0), None,
  f'(a) lg y = n lg x + lg k, a straight line of gradient n. (b) n = (lg 68 − lg 3.0) ÷ (lg 8.0 − lg 1.0) = {sf(log10(68 / 3) / log10(8))}',
  ['B1: lg y = n lg x + lg k', 'B1: gradient gives n', 'M1: logs of first and last points', 'C1: substitution'], aq='n')
N('H', 6, 'A pendulum obeys T = 2π√(L/g). A student plots T² against L and finds a gradient of 4.05 s² m⁻¹. (a) Show that the gradient equals 4π²/g. (b) Calculate g.', 4 * pi ** 2 / 4.05, 'm s⁻²',
  f'(a) T² = 4π²L/g, a straight line through the origin of gradient 4π²/g. (b) g = 4π² ÷ 4.05 = {sf(4 * pi ** 2 / 4.05)} m s⁻²',
  ['B1: square both sides', 'B1: compare with y = mx', 'M1: g = 4π²/gradient', 'C1: substitution', 'C1: value'], aq='g')
N('H', 5, 'The amplitude A of a damped oscillation follows A = A₀e^(−t/τ). A graph of ln(A/mm) against t/s passes through (0, 2.30) and (20, 1.50). (a) State what the gradient represents. (b) Calculate τ.', 20 / (2.30 - 1.50), 's',
  f'(a) ln A = ln A₀ − t/τ, so the gradient is −1/τ. (b) Gradient = (1.50 − 2.30) ÷ (20 − 0) = −0.040 s⁻¹, so τ = 1 ÷ 0.040 = {sf(1 / 0.04)} s',
  ['B1: gradient = −1/τ', 'C1: gradient value', 'M1: τ = −1/gradient', 'C1: value'], aq='τ')
N('H', 6, 'A capacitor discharges through a 47 kΩ resistor, so V = V₀e^(−t/RC). A graph of ln(V/V) against t/s has gradient −0.050 s⁻¹. (a) Write ln V in terms of t. (b) Calculate RC. (c) Calculate C in µF.', 1 / 0.050 / 47e3 * 1e6, 'µF',
  f'(a) ln V = ln V₀ − t/RC. (b) RC = 1 ÷ 0.050 = 20 s. (c) C = 20 ÷ 47 × 10³ = {sf(20 / 47e3, 4)} F. In µF: {sf(20 / 47e3, 4)} × 10⁶ = {sf(20 / 47e3 * 1e6)}',
  ['B1: ln V linear in t', 'C1: gradient = −1/RC', 'C1: RC = 20 s', 'M1: C = RC/R', 'C1: µF'], aq='C')
M('H', 5, 'A plan is needed to find how the terminal speed v of a steel sphere falling through oil depends on its radius r. Which plan is best?', 'Use spheres of several radii (measured with a micrometer), time each between two marks low in the tube after checking equal times for equal distances, keep the oil at constant temperature, and plot lg v against lg r', ['Drop one sphere from different heights and time its fall from the top of the tube', 'Use spheres of different materials and the same radius', 'Time each sphere over the whole tube with a stopwatch and plot v against r only'], 'Only the radius should change; terminal speed must be measured where it is constant; viscosity depends on temperature.',
  ['C1: vary r, measure with micrometer', 'C1: speed measured after terminal speed reached', 'C1: control temperature of oil', 'C1: log–log analysis'])
N('H', 5, 'For a stretched string, f = (1/2L)√(T/µ). With L = 0.80 m, a graph of f against √T has gradient 6.5 Hz N^(−1/2). (a) Express the gradient in terms of L and µ. (b) Calculate µ, in units of 10⁻³ kg m⁻¹.', (1 / (2 * 0.80 * 6.5)) ** 2, '10⁻³ kg m⁻¹',
  f'(a) gradient = 1/(2L√µ). (b) √µ = 1 ÷ (2 × 0.80 × 6.5) = {sf(1 / (2 * 0.8 * 6.5), 4)}, so µ = ({sf(1 / (2 * 0.8 * 6.5), 4)})² = {sf((1 / (2 * 0.8 * 6.5)) ** 2)} kg m⁻¹',
  ['B1: gradient = 1/(2L√µ)', 'M1: rearranged for √µ', 'C1: substitution', 'C1: square'], aq='µ')
N('H', 6, 'A graph of lg y against lg x is a straight line through (0.40, 1.62) and (1.20, 0.82). For y = kxⁿ: (a) find n; (b) find k; (c) find y when x = 5.0. Give only the answer to (c).', 10 ** (1.62 + 1.0 * 0.40) * 5.0 ** -1.0, None,
  f'(a) n = (0.82 − 1.62) ÷ (1.20 − 0.40) = −1.0. (b) lg k = 1.62 + 1.0 × 0.40 = 2.02, k = 10^2.02 = {sf(10 ** 2.02, 4)}. (c) y = {sf(10 ** 2.02, 4)} × 5.0^(−1.0) = {sf(10 ** 2.02 / 5)}',
  ['C1: n', 'M1: lg k from a point', 'C1: k', 'M1: y = kxⁿ', 'C1: value'], aq='y')
N('H', 5, 'For a filament lamp, I = kVⁿ. A graph of lg(I/A) against lg(V/V) has gradient 0.60 and intercept −1.40. (a) Find k. (b) Calculate the current at 6.0 V, in mA.', 10 ** -1.40 * 6.0 ** 0.60 * 1e3, 'mA',
  f'(a) k = 10^(−1.40) = {sf(10 ** -1.4, 4)}. (b) I = {sf(10 ** -1.4, 4)} × 6.0^0.60 = {sf(10 ** -1.4 * 6 ** 0.6, 4)} A. In mA: {sf(10 ** -1.4 * 6 ** 0.6, 4)} × 10³ = {sf(10 ** -1.4 * 6 ** 0.6 * 1e3)}',
  ['C1: k from intercept', 'M1: I = kVⁿ', 'C1: substitution', 'C1: mA'], aq='I')
N('H', 5, 'The range of a projectile launched at a fixed angle θ from ground level is R = v²sin 2θ/g. A graph of R against v² has gradient 0.085 s² m⁻¹. (a) State the gradient in terms of θ and g. (b) Calculate θ, the smaller possible angle.' + take('g'), degrees(asin(0.085 * 9.81)) / 2, '°',
  f'(a) gradient = sin 2θ/g. (b) sin 2θ = 0.085 × 9.81 = {sf(0.085 * 9.81, 4)}, so θ = sin⁻¹(0.085 × 9.81) ÷ 2 = {sf(degrees(asin(0.085 * 9.81)) / 2)}°',
  ['B1: gradient = sin 2θ/g', 'M1: sin 2θ = gradient × g', 'C1: inverse sine', 'C1: halve'], aq='θ')
N('H', 5, 'A student finds the time t for a trolley to run down a ramp of length 1.20 m for several heights h and plots 1/t² against h. Theory gives 1/t² = gh/(2s²) for a ramp of length s, ignoring friction. (a) State the expected gradient in terms of g and s. (b) Calculate the expected gradient, in s⁻² m⁻¹.' + take('g'), 9.81 / (2 * 1.20 ** 2), 's⁻² m⁻¹',
  f'(a) gradient = g/(2s²). (b) Gradient = 9.81 ÷ (2 × 1.20²) = {sf(9.81 / (2 * 1.44))} s⁻² m⁻¹',
  ['B1: gradient = g/2s²', 'M1: substitution', 'C1: s squared', 'C1: value'], aq='gradient')

# ═════════════════════════ P2.2 Planning (17/17/10) ═════════════════════════
lesson('P2.2')
M('E', 1, 'Which instrument is most suitable for measuring the diameter of a wire of about 0.3 mm?', 'A micrometer screw gauge', ['A metre rule', 'Vernier calipers reading to 0.1 mm', 'A tape measure'], 'A micrometer reads to 0.01 mm.')
M('E', 1, 'How should a student measure the period of a pendulum of about 1 s most accurately with a stopwatch?', 'Time 20 oscillations and divide by 20', ['Time one oscillation once', 'Time half an oscillation and double it', 'Count oscillations in 1 s'], 'Timing many oscillations reduces the effect of reaction time.')
N('E', 2, 'A student times 20 oscillations of a pendulum as 31.6 s. Calculate the period.', 31.6 / 20, 's',
  'T = 31.6 ÷ 20 = 1.58 s', ['C1: total time ÷ number of oscillations'], aq='T')
M('E', 1, 'A wire about one metre long is stretched along a bench. Which measuring device should a student use to find its full length?', 'A metre rule', ['A micrometer', 'Vernier calipers', 'A protractor'], 'A metre rule reads to 1 mm, enough for about 1 m.')
M('E', 1, 'Which instrument measures the temperature of a water bath during an experiment?', 'A thermometer (or thermocouple) placed in the water', ['A barometer', 'A voltmeter alone', 'A stopwatch'], 'Temperature is measured directly in the liquid.')
N('E', 2, 'A student plans to vary the load on a wire from 0.5 N to 4.0 N in equal steps, taking 8 readings in all. Calculate the size of each step.', (4.0 - 0.5) / 7, 'N',
  'Step = (4.0 − 0.5) ÷ 7 = 0.50 N', ['C1: 7 intervals for 8 readings'], sig=2, aq='step')
M('E', 1, 'How can a student avoid parallax error when reading the length of a spring against a metre rule?', 'Read the scale with the eye level with, and perpendicular to, the reading', ['Read from above at an angle', 'Use a longer rule', 'Take only one reading'], 'Viewing at an angle shifts the apparent reading.')
M('E', 1, 'Which meter, and how connected, is used to measure a current of about 50 mA through a resistor?', 'A milliammeter in series with the resistor', ['A voltmeter in parallel with the resistor', 'An ammeter in parallel with the resistor', 'A voltmeter in series with the resistor'], 'Ammeters are always connected in series.')
M('E', 1, 'How should a voltmeter be connected to measure the potential difference across a resistor?', 'In parallel with the resistor', ['In series with the resistor', 'In series with the supply', 'Across the ammeter'], 'A voltmeter compares the potentials at the two ends.')
N('E', 2, 'A micrometer gives a reading of 0.42 mm for a wire, but it reads +0.02 mm when closed. Calculate the true diameter in mm.', 0.40, 'mm',
  'True diameter = 0.42 − 0.02 = 0.40 mm', ['C1: subtract the zero error'], sig=2, aq='d')
M('E', 1, 'Why should the diameter of a wire be measured at several points along it and in different directions?', 'The wire may not be uniform or perfectly round, so a mean value is better', ['To check the micrometer is working', 'Because the wire stretches', 'To find its length'], 'Averaging allows for variation in the wire.')
M('E', 1, 'Why is a fiducial marker placed at the centre of a pendulum\'s swing?', 'To judge the start and end of each oscillation precisely', ['To measure the amplitude', 'To stop the pendulum', 'To measure the length'], 'The bob moves fastest at the centre, so its passage is sharp.')
N('E', 1, 'A card of length 5.0 cm cuts a light beam for 0.025 s. Calculate the speed of the card.', 0.050 / 0.025, 'm s⁻¹',
  'v = 0.050 ÷ 0.025 = 2.0 m s⁻¹', [], sig=2, aq='v')
M('E', 1, 'How can a student check that a metre rule clamped next to a hanging spring is vertical?', 'Use a set square on the bench (or a plumb line) against the rule', ['Look at it from a distance', 'Measure its length', 'Use a protractor on the spring'], 'A set square or plumb line gives a vertical reference.')
M('E', 1, 'What is the main advantage of a data logger over taking readings by hand?', 'It can take many readings at short, precisely timed intervals', ['It never needs calibrating', 'It removes all uncertainty', 'It chooses the variables'], 'Useful for fast changes such as a capacitor discharge.')
N('E', 2, 'A stack of 200 identical sheets of paper is 22 mm thick. Calculate the thickness of one sheet, in mm.', 22 / 200, 'mm',
  't = 22 ÷ 200 = 0.11 mm', ['C1: total ÷ number'], sig=2, aq='t')
M('E', 1, 'Which instrument is best for measuring the mass of a small object of about 50 g?', 'A top-pan balance', ['A newton meter reading to 1 N', 'A measuring cylinder', 'A metre rule'], 'A top-pan balance reads to 0.1 g or better.')
# medium
M('M', 3, 'How can the time for a ball to fall 0.50 m from rest be measured accurately?', 'Release it from an electromagnet that starts an electronic timer, and stop the timer with a light gate or trapdoor', ['Drop it by hand and time it with a stopwatch', 'Film it at 5 frames per second', 'Count while it falls'], 'The fall time is about 0.3 s, too short for hand timing.', ['C1: electromagnet release', 'C1: electronic timer/light gate'])
M('M', 3, 'A student plans to vary the temperature of a thermistor between 20 °C and 80 °C. Which method is best?', 'Place it in a water bath heated slowly, stirring and reading the temperature with a thermometer close to it', ['Hold it in the hand', 'Heat it directly with a Bunsen flame', 'Pass a large current through it'], 'A stirred water bath gives a uniform, measurable temperature.', ['C1: water bath with heater', 'C1: stir, thermometer near thermistor'])
N('M', 3, 'A student times 20 swings as 26.4 s, with a reaction-time uncertainty of 0.2 s in the total. Calculate the percentage uncertainty in the period.', 0.2 / 26.4 * 100, '%',
  f'% uncertainty = 0.2 ÷ 26.4 × 100 = {sf(0.2 / 26.4 * 100)} %', ['C1: same % for T and total', 'C1: value'], aq='% uncertainty')
M('M', 3, 'How should the cross-sectional area of a resistance wire be found in a plan?', 'Measure the diameter with a micrometer at several places, find the mean and use A = πd²/4', ['Measure the length and divide by the volume', 'Use a metre rule across the wire', 'Weigh the wire'], 'A micrometer gives the small diameter precisely.', ['C1: micrometer, several readings', 'C1: A = πd²/4'])
M('M', 3, 'In a plan to measure the terminal speed of a sphere in a tall tube of oil, how is the terminal speed measured?', 'Time the sphere between two marks low in the tube, after checking that it takes equal times over equal distances', ['Time the fall from the surface to the bottom', 'Measure the speed as it enters the oil', 'Divide the tube length by the total time'], 'Only below a certain depth is the speed constant.', ['C1: two marks low down', 'C1: check constant speed'])
N('M', 3, 'A sphere falling at terminal speed takes 1.60 s to pass between two marks 20.0 cm apart. Calculate its terminal speed in m s⁻¹.', 0.200 / 1.60, 'm s⁻¹',
  'v = 0.200 ÷ 1.60 = 0.125 m s⁻¹', ['C1: cm to m', 'C1: v = d/t'], aq='v')
M('M', 3, 'In an investigation of how the current in a wire depends on its length, how is the p.d. across the wire kept constant?', 'Adjust a variable resistor in series until the voltmeter across the wire shows the same reading each time', ['Use a longer wire', 'Use a different ammeter', 'Change the supply each time without measuring'], 'The p.d. must be monitored and adjusted.', ['C1: variable resistor', 'C1: voltmeter monitors p.d.'])
N('M', 3, 'A 12 V supply of negligible internal resistance is to drive a current of no more than 0.50 A through a 4.7 Ω resistor. Calculate the minimum extra series resistance needed.', 12 / 0.50 - 4.7, 'Ω',
  'R_total = 12 ÷ 0.50 = 24 Ω, so extra R = 24 − 4.7 = 19.3 Ω', ['C1: total resistance', 'C1: subtract 4.7 Ω'], aq='R')
M('M', 3, 'How should a Hall probe be positioned to measure the largest flux density at a point?', 'Rotate it until the reading is a maximum, so that its face is perpendicular to the field', ['Hold it parallel to the field', 'Move it as far as possible from the magnet', 'Point it at the bench'], 'The Hall voltage depends on the component of B normal to the probe.', ['C1: rotate to maximum', 'C1: face perpendicular to B'])
N('E', 2, 'A metre rule beside a wire shows its ends at the 12.3 cm and 87.6 cm marks. Calculate the length of the wire in cm.', 87.6 - 12.3, 'cm',
  'L = 87.6 − 12.3 = 75.3 cm', ['C1: difference of readings'], aq='L')
M('M', 3, 'During a Young modulus experiment, why should the loads be removed one at a time and the extension re-measured?', 'To check that the wire returns to its original length, so the elastic limit has not been exceeded', ['To find the mass of the loads', 'To let the wire cool', 'To measure the diameter again'], 'Readings beyond the elastic limit would not obey Hooke\'s law.', ['C1: unloading readings', 'C1: elastic limit check'])
N('M', 3, 'A 2.00 m length of wire has a mass of 7.6 g. Calculate its mass per unit length, in units of 10⁻³ kg m⁻¹.', 7.6e-3 / 2.00, '10⁻³ kg m⁻¹',
  f'µ = 7.6 × 10⁻³ ÷ 2.00 = {sf(7.6e-3 / 2)} kg m⁻¹', ['C1: g to kg', 'C1: m/L'], sig=2, aq='µ')
M('M', 3, 'An investigation uses a light-dependent resistor and a lamp. How can stray light be prevented from affecting the readings?', 'Work in a darkened room, or enclose the lamp and LDR in a black tube', ['Use a brighter lamp', 'Use a larger LDR', 'Take readings quickly'], 'Background light changes the LDR resistance.', ['C1: darken room/enclose', 'C1: background light is a control variable'])
N('M', 4, 'The intensity from a small lamp falls as 1/d². An LDR is 0.50 m from the lamp. How far from the lamp should it be moved so that the intensity halves?', 0.50 * sqrt(2), 'm',
  f'I ∝ 1/d², so d₂ = 0.50 × √2 = {sf(0.5 * sqrt(2))} m', ['M1: inverse square', 'C1: d ∝ 1/√I', 'C1: value'], aq='d')
M('M', 3, 'Why should readings of the dependent variable be repeated at each value of the independent variable?', 'Repeats show the spread of the readings, reveal anomalies and give a mean with less random error', ['Repeats remove systematic errors', 'Repeats make the range wider', 'Repeats are needed only if the first reading is zero'], 'The half-range of repeats also estimates the uncertainty.', ['C1: mean reduces random error', 'C1: identifies anomalies/uncertainty'])
N('E', 2, 'Vernier calipers show a main-scale reading of 2.3 cm and the vernier adds 0.07 cm. State the reading, in cm.', 2.37, 'cm',
  'Reading = 2.3 + 0.07 = 2.37 cm', ['C1: add vernier to main scale'], aq='reading')
M('M', 3, 'Why should the independent variable be varied over as wide a range as possible?', 'A wide range shows the trend clearly and lets the gradient be found more precisely', ['It reduces the number of readings needed', 'It removes systematic errors', 'It keeps the apparatus safe'], 'Closely bunched points give a poorly defined gradient.', ['C1: trend over range', 'C1: precise gradient'])
N('M', 3, 'In a plan, the time for 10 oscillations of a spring–mass system is expected to be about 6 s. With a reaction-time uncertainty of 0.2 s, calculate the percentage uncertainty in the period.', 0.2 / 6 * 100, '%',
  f'% uncertainty = 0.2 ÷ 6 × 100 = {sf(0.2 / 6 * 100)} %', ['C1: absolute ÷ total', 'C1: × 100'], aq='% uncertainty')
# hard
M('H', 5, 'Which plan best determines how the period T of a mass–spring system depends on the mass m?', 'Use one spring; add slotted masses measured on a balance; time 20 oscillations for each with a fiducial mark, repeating; plot lg T against lg m', ['Use a different spring for each mass and time one oscillation', 'Keep the mass fixed and change the amplitude', 'Time oscillations with a large amplitude so they are easy to see, and plot T against m only'], 'Only m is varied; many oscillations and repeats reduce uncertainty; a log graph finds the power.',
  ['C1: same spring (control)', 'C1: mass measured on balance', 'C1: time many oscillations, fiducial mark', 'C1: log–log analysis'])
N('H', 5, 'A wire of length 0.800 m and diameter 0.32 mm has a resistance of 5.6 Ω. (a) Calculate its cross-sectional area. (b) Calculate the resistivity of its metal, in units of 10⁻⁷ Ω m.', 5.6 * pi * (0.16e-3) ** 2 / 0.800, '10⁻⁷ Ω m',
  f'(a) A = π × (0.16 × 10⁻³)² = {sf(pi * 0.16e-3 ** 2, 4)} m². (b) ρ = RA/L = 5.6 × {sf(pi * 0.16e-3 ** 2, 4)} ÷ 0.800 = {sf(5.6 * pi * 0.16e-3 ** 2 / 0.8)} Ω m',
  ['C1: radius from diameter', 'C1: area', 'M1: ρ = RA/L', 'C1: substitution'], aq='ρ')
N('H', 6, 'A tuning fork of 500 Hz is held over a tube closed at one end. Resonance occurs at air-column lengths of 0.165 m and 0.505 m. (a) Explain why the difference is half a wavelength. (b) Calculate the wavelength. (c) Calculate the speed of sound.', 500 * 2 * (0.505 - 0.165), 'm s⁻¹',
  f'(a) Successive resonances differ by one loop of the standing wave, λ/2. (b) λ = 2 × (0.505 − 0.165) = 0.68 m. (c) v = fλ = 500 × 0.68 = {sf(500 * 0.68)} m s⁻¹',
  ['B1: successive resonances λ/2 apart', 'C1: difference', 'C1: λ', 'M1: v = fλ', 'C1: value'], aq='v')
N('H', 5, 'A wire 2.50 m long and 0.50 mm in diameter extends by 2.4 mm under a load of 40 N. (a) Calculate the stress. (b) Calculate the Young modulus, in units of 10¹¹ Pa.', 40 * 2.50 / (pi * 0.25e-3 ** 2 * 2.4e-3), '10¹¹ Pa',
  f'(a) A = π × (0.25 × 10⁻³)² = {sf(pi * 0.25e-3 ** 2, 4)} m²; stress = 40 ÷ {sf(pi * 0.25e-3 ** 2, 4)} = {sf(40 / (pi * 0.25e-3 ** 2), 4)} Pa. (b) E = {sf(40 / (pi * 0.25e-3 ** 2), 4)} ÷ (2.4 × 10⁻³ ÷ 2.50) = {sf(40 * 2.5 / (pi * 0.25e-3 ** 2 * 2.4e-3))} Pa',
  ['C1: area', 'C1: stress', 'M1: strain = e/L', 'C1: E = stress/strain'], aq='E')
M('H', 5, 'A coil of wire is heated in a water bath from 20 °C to 90 °C to see how its resistance changes. Which set of controls and precautions is most complete?', 'Stir the water and wait for steady readings; keep the current small to avoid self-heating; use the same coil and meter throughout; take care with hot water and keep electrical connections dry', ['Heat quickly with a large current; read once at each temperature', 'Use a new coil at each temperature', 'Measure only at 20 °C and 90 °C'], 'Uniform temperature, no self-heating, same apparatus, and safety with hot water and electricity.',
  ['C1: stir/equilibrium', 'C1: small current', 'C1: same coil and meters', 'C1: safety'])
N('H', 5, 'A 50 W heater runs for 300 s in a 0.80 kg aluminium block and its temperature rises by 18.5 K. (a) Calculate the energy supplied. (b) Calculate the specific heat capacity of aluminium, ignoring losses.', 50 * 300 / (0.80 * 18.5), 'J kg⁻¹ K⁻¹',
  f'(a) E = 50 × 300 = 15 000 J. (b) c = 15 000 ÷ (0.80 × 18.5) = {sf(15000 / (0.8 * 18.5))} J kg⁻¹ K⁻¹',
  ['C1: E = Pt', 'M1: c = E/(mΔθ)', 'C1: substitution', 'C1: unit'], aq='c')
N('H', 6, 'An LDR whose resistance varies from 2.0 kΩ (bright) to 20 kΩ (dark) is in series with a 10 kΩ resistor across a 6.0 V supply. The output is taken across the 10 kΩ resistor. (a) Calculate the output in bright light. (b) Calculate the output in the dark. Give only the answer to (b).', 6.0 * 10 / (10 + 20), 'V',
  f'(a) V = 6.0 × 10 ÷ (10 + 2.0) = {sf(6 * 10 / 12)} V. (b) V = 6.0 × 10 ÷ (10 + 20) = {sf(6 * 10 / 30)} V',
  ['M1: potential divider ratio', 'C1: bright value', 'C1: total resistance in dark', 'C1: substitution', 'C1: value'], sig=2, aq='V')
M('H', 5, 'A plan must measure g to better than 1% with a falling ball. Which choice of apparatus and method is best?', 'Electromagnet release and light gates connected to an electronic timer; several heights measured with a metre rule; plot h against t² and use the gradient', ['A stopwatch and a single height of 0.5 m', 'A stopwatch and a ruler held by hand', 'A video at 10 frames per second'], 'Fall times are short, so electronic timing and a graph over several heights are needed.',
  ['C1: electronic timing', 'C1: several heights', 'C1: graph of h against t²', 'C1: g = 2 × gradient'])
N('H', 5, 'A pendulum has a period of about 0.80 s. The total time is measured with a reaction-time uncertainty of 0.2 s. (a) Find the shortest total time for a percentage uncertainty of 1%. (b) Calculate the minimum number of oscillations to time.', 0.2 / 0.01 / 0.80, None,
  f'(a) t = 0.2 ÷ 0.01 = 20 s. (b) n = 20 ÷ 0.80 = {sf(20 / 0.8, 2)}',
  ['M1: % uncertainty = 0.2/t', 'C1: t = 20 s', 'M1: n = t/T', 'C1: value'], sig=2, aq='n')
N('H', 5, 'A card 4.0 cm long passes through two light gates 0.60 m apart, cutting the beams for 0.080 s and then 0.040 s. (a) Calculate both speeds. (b) Calculate the acceleration.', ((0.040 / 0.040) ** 2 - (0.040 / 0.080) ** 2) / (2 * 0.60), 'm s⁻²',
  f'(a) u = 0.040 ÷ 0.080 = 0.50 m s⁻¹; v = 0.040 ÷ 0.040 = 1.0 m s⁻¹. (b) a = (1.0² − 0.50²) ÷ (2 × 0.60) = {sf(0.75 / 1.2)} m s⁻²',
  ['C1: u', 'C1: v', 'M1: v² = u² + 2as', 'C1: value'], aq='a')

# ═════════════════════════ P2.3 Analysis of the data (17/19/8) ═════════════════════════
lesson('P2.3')
N('E', 2, 'A straight line on a graph passes through (0.0, 1.2) and (4.0, 9.2). Calculate its gradient.', (9.2 - 1.2) / 4.0, None,
  'Gradient = (9.2 − 1.2) ÷ (4.0 − 0.0) = 2.0', ['C1: Δy/Δx'], sig=2, aq='gradient')
N('E', 2, 'A line of gradient 2.5 passes through the point (2.0, 7.0). Find where it crosses the y-axis.', 7.0 - 2.5 * 2.0, None,
  'c = y − mx = 7.0 − 2.5 × 2.0 = 2.0', ['C1: c = y − mx'], sig=2, aq='c')
M('E', 1, 'For v² = u² + 2as, which graph gives a straight line from which a is found?', 'v² against s, with gradient 2a', ['v against s, with gradient a', 'v² against s², with gradient 2a', 's against v, with gradient a'], 'Compare with y = mx + c: y = v², x = s, m = 2a, c = u².')
N('E', 2, 'A graph of v² against s for a trolley has gradient 4.6 m s⁻². Calculate the acceleration.', 4.6 / 2, 'm s⁻²',
  'Gradient = 2a, so a = 4.6 ÷ 2 = 2.3 m s⁻²', ['C1: gradient = 2a'], sig=2, aq='a')
M('E', 1, 'For a wire, R = ρL/A. If R is plotted against L, what is the gradient?', 'ρ/A', ['ρA', 'A/ρ', 'ρ'], 'R = (ρ/A)L is a line through the origin of gradient ρ/A.')
N('E', 2, 'A graph of R against L for a wire of cross-sectional area 1.5 × 10⁻⁷ m² has gradient 12 Ω m⁻¹. Calculate the resistivity, in units of 10⁻⁶ Ω m.', 12 * 1.5e-7, '10⁻⁶ Ω m',
  'ρ = gradient × A = 12 × 1.5 × 10⁻⁷ = 1.8 × 10⁻⁶ Ω m', ['C1: ρ = gradient × A'], sig=2, aq='ρ')
M('E', 1, 'How should a best-fit straight line be drawn through plotted points?', 'With the points scattered about evenly on either side of it', ['Through the first and last points', 'Through the origin always', 'Joining every point dot to dot'], 'It need not pass through any particular point.')
N('E', 1, 'Calculate lg 250, to three decimal places.', log10(250), None,
  f'Using the calculator log key: lg 250 = {sf(log10(250), 4)}. Check: 10 raised to this power returns 250.', [], sig=4, aq='lg 250')
M('E', 1, 'Which choice of scales on a graph is best?', 'Scales that make the plotted points occupy more than half of the grid in each direction', ['Scales with awkward steps such as 3 or 7 per square', 'Scales that keep all the points in one corner', 'Different scales on each half of an axis'], 'Large, simple scales make plotting and reading accurate.')
N('E', 2, 'A graph of V against I for a resistor is a straight line through the origin with gradient 47 V A⁻¹. State the resistance.', 47, 'Ω',
  'R = V/I = gradient = 47 × 1 = 47 Ω', ['C1: R = gradient'], sig=2, aq='R')
M('E', 1, 'A graph of terminal p.d. V against current I for a cell is a straight line, V = E − Ir. What does the intercept on the V axis give?', 'The e.m.f. E', ['The internal resistance r', 'The maximum current', 'The external resistance'], 'When I = 0 there are no lost volts, so V = E.')
N('E', 2, 'For a cell, V = E − Ir. A graph of V against I has gradient −0.80 V A⁻¹. Find the internal resistance.', 0.80, 'Ω',
  'Gradient = −r, so r = −(−0.80) = 0.80 Ω', ['C1: gradient = −r'], sig=2, aq='r')
M('E', 1, 'One plotted point lies far from an otherwise clear straight-line trend. What should be done?', 'Check or repeat that reading; if it is still anomalous, ignore it when drawing the line', ['Draw the line through it', 'Delete all the readings', 'Draw a curve to include it'], 'Anomalous points should not distort the best-fit line.')
N('E', 1, 'Calculate ln 20.0, to three significant figures.', log(20.0), None,
  f'Using the calculator ln key: ln 20.0 = {sf(log(20))}. Check: e raised to this power returns 20.0.', [], aq='ln 20.0')
M('E', 1, 'Why is the mean of several repeated readings used?', 'It reduces the effect of random errors', ['It removes systematic errors', 'It makes the reading more accurate whatever the error', 'It avoids the need for a graph'], 'Random errors scatter either side of the true value and partly cancel.')
N('E', 2, 'Four repeat timings are 2.42 s, 2.38 s, 2.46 s and 2.40 s. Calculate the mean.', (2.42 + 2.38 + 2.46 + 2.40) / 4, 's',
  'Mean = (2.42 + 2.38 + 2.46 + 2.40) ÷ 4 = 2.42 s', ['C1: sum ÷ 4'], aq='mean')
N('E', 2, 'A graph of current I against p.d. V for a resistor is a straight line through the origin with gradient 0.020 A V⁻¹. Calculate the resistance.', 1 / 0.020, 'Ω',
  'Gradient = I/V = 1/R, so R = 1 ÷ 0.020 = 50 Ω', ['C1: gradient = 1/R'], sig=2, aq='R')
M('E', 1, 'When y values are recorded to 3 significant figures, how many decimal places should values of lg y be given to?', '3 decimal places', ['1 decimal place', '3 significant figures', 'As many as the calculator shows'], 'The decimal places of a logarithm match the significant figures of the data.')
# medium
N('M', 3, 'A student plots T² against L for a pendulum and obtains a gradient of 4.02 s² m⁻¹. Calculate g, using T = 2π√(L/g).', 4 * pi ** 2 / 4.02, 'm s⁻²',
  f'Gradient = 4π²/g, so g = 4π² ÷ 4.02 = {sf(4 * pi ** 2 / 4.02)} m s⁻²', ['C1: gradient = 4π²/g', 'C1: rearranged'], aq='g')
N('M', 3, 'A graph of charge Q against p.d. V for a capacitor has gradient 4.7 × 10⁻⁴ C V⁻¹. Calculate the capacitance in µF.', 470, 'µF',
  'C = gradient = 4.7 × 10⁻⁴ F. In µF: 4.7 × 10⁻⁴ × 10⁶ = 470', ['C1: C = Q/V = gradient', 'C1: µF'], sig=2, aq='C')
N('M', 3, 'In a photoelectric experiment, a graph of stopping voltage V against frequency f has gradient 4.1 × 10⁻¹⁵ V s. Calculate the Planck constant, in units of 10⁻³⁴ J s.' + take('e'), 1.60e-19 * 4.1e-15, '10⁻³⁴ J s',
  f'eV = hf − Φ, so gradient = h/e and h = 1.60 × 10⁻¹⁹ × 4.1 × 10⁻¹⁵ = {sf(1.6e-19 * 4.1e-15)} J s', ['C1: gradient = h/e', 'C1: h = e × gradient'], aq='h')
N('M', 3, 'A graph of stopping voltage against frequency has gradient 4.1 × 10⁻¹⁵ V s and meets the frequency axis at 5.5 × 10¹⁴ Hz. Calculate the work function in eV.', 4.1e-15 * 5.5e14, 'eV',
  f'Φ/e = gradient × f₀ = 4.1 × 10⁻¹⁵ × 5.5 × 10¹⁴ = {sf(4.1e-15 * 5.5e14)} V, so Φ = {sf(4.1e-15 * 5.5e14)} eV', ['C1: threshold frequency', 'C1: Φ = hf₀'], aq='Φ')
N('M', 4, 'To test y = kx², a student plots y against x². The best-fit line passes through (4.0, 10.2) and (36.0, 90.6). Calculate k.', (90.6 - 10.2) / (36.0 - 4.0), None,
  f'k = gradient = (90.6 − 10.2) ÷ (36.0 − 4.0) = {sf(80.4 / 32)}', ['M1: k is the gradient', 'C1: Δy', 'C1: Δx'], aq='k')
M('M', 3, 'A graph of y against x curves upwards through the origin. How can a student decide whether y ∝ x² or y ∝ x³?', 'Plot lg y against lg x and see whether the gradient is 2 or 3', ['Measure the gradient at the origin', 'Plot y against x again with a larger scale', 'Find the mean of y'], 'The log–log gradient gives the power.', ['C1: log–log plot', 'C1: gradient = power'])
N('M', 3, 'A force–extension graph is a straight line through the origin of gradient 25 N m⁻¹. Calculate the elastic potential energy stored at an extension of 0.080 m.', 0.5 * 25 * 0.080 ** 2, 'J',
  f'E = area under graph = 0.5 × 25 × 0.080² = {sf(0.5 * 25 * 0.0064)} J', ['C1: area of triangle', 'C1: F = kx'], sig=2, aq='E')
N('M', 3, 'A velocity–time graph rises uniformly from 2.0 m s⁻¹ at t = 0 to 14.0 m s⁻¹ at t = 6.0 s. Calculate the displacement in this time.', (2.0 + 14.0) / 2 * 6.0, 'm',
  's = area = (2.0 + 14.0) ÷ 2 × 6.0 = 48 m', ['C1: area under v–t graph', 'C1: trapezium'], sig=2, aq='s')
N('M', 3, 'For a capacitor discharging through a resistor, a graph of ln V against t has gradient −0.025 s⁻¹. Calculate the time constant.', 1 / 0.025, 's',
  'Gradient = −1/RC, so RC = 1 ÷ 0.025 = 40 s', ['C1: gradient = −1/RC', 'C1: value'], sig=2, aq='RC')
N('M', 3, 'A graph of lg(T/s) against lg(L/m) has gradient 0.48 and intercept 0.30. Predict T for L = 0.64 m.', 10 ** 0.30 * 0.64 ** 0.48, 's',
  f'T = 10^0.30 × 0.64^0.48 = {sf(10 ** 0.3 * 0.64 ** 0.48)} s', ['C1: k = 10^0.30', 'C1: T = kLⁿ'], aq='T')
M('M', 3, 'Why is it better to plot T² against L than T against L for a pendulum?', 'T² ∝ L gives a straight line through the origin, so g can be found from the gradient', ['T against L is a straight line', 'It reduces the uncertainty in L', 'It avoids measuring T'], 'Linearising lets the constant be found from a gradient.', ['C1: straight line', 'C1: constant from gradient'])
N('M', 3, 'A graph of pressure p against 1/V for 0.10 mol of gas has gradient 250 Pa m³. Calculate the temperature of the gas.' + take('R'), 250 / (0.10 * 8.31), 'K',
  f'pV = nRT, so gradient = nRT and T = 250 ÷ (0.10 × 8.31) = {sf(250 / 0.831)} K', ['C1: gradient = nRT', 'C1: rearranged'], aq='T')
N('M', 3, 'A graph of ln(activity) against time has gradient −0.0231 min⁻¹. Calculate the half-life, in minutes.', log(2) / 0.0231, 'min',
  f'λ = 0.0231 min⁻¹; t½ = ln 2 ÷ 0.0231 = {sf(log(2) / 0.0231)} min', ['C1: λ = −gradient', 'C1: t½ = ln 2/λ'], aq='t½')
N('M', 4, 'For a diffraction grating, a graph of sin θ against order n has gradient 0.295. The slit spacing is 2.0 µm. Calculate the wavelength in nm.', 0.295 * 2.0e-6 * 1e9, 'nm',
  f'd sin θ = nλ, so gradient = λ/d and λ = 0.295 × 2.0 × 10⁻⁶ = {sf(0.295 * 2e-6)} m. In nm: {sf(0.295 * 2e-6)} × 10⁹ = {sf(590)}', ['M1: gradient = λ/d', 'C1: substitution', 'C1: nm'], aq='λ')
M('M', 3, 'How large should the triangle used to measure a gradient be?', 'As large as possible, with its hypotenuse covering more than half the length of the line', ['As small as possible', 'Exactly one grid square', 'Drawn between two plotted points only'], 'A large triangle reduces the relative reading error.', ['C1: large triangle', 'C1: more than half the line'])
N('M', 3, 'A graph of resistance R against temperature θ for a wire is a straight line, R = R₀(1 + αθ), with intercept 20.0 Ω and gradient 0.078 Ω K⁻¹. Calculate α, in units of 10⁻³ K⁻¹.', 0.078 / 20.0, '10⁻³ K⁻¹',
  f'Gradient = R₀α, so α = 0.078 ÷ 20.0 = {sf(0.078 / 20)} K⁻¹', ['C1: gradient = R₀α', 'C1: intercept = R₀'], sig=2, aq='α')
N('M', 3, 'For a cell, 1/I = R/E + r/E. A graph of 1/I against R has gradient 0.125 A⁻¹ Ω⁻¹ and intercept 0.25 A⁻¹. Calculate r.', 0.25 / 0.125, 'Ω',
  'E = 1 ÷ 0.125 = 8.0 V; r = intercept × E = 0.25 × 8.0 = 2.0 Ω', ['C1: E = 1/gradient', 'C1: r = intercept × E'], sig=2, aq='r')
N('M', 3, 'For a cell, R = E/I − r. A graph of R against 1/I has gradient 6.0 V and meets the R axis at −1.5 Ω. Calculate the internal resistance.', 1.5, 'Ω',
  'Intercept = −r, so r = −(−1.5) = 1.5 Ω', ['C1: intercept = −r', 'C1: value'], sig=2, aq='r')
N('M', 3, 'For a current-carrying wire in a field, F = BIL. A graph of F against I has gradient 0.024 N A⁻¹ for a wire of length 0.050 m in the field. Calculate B.', 0.024 / 0.050, 'T',
  'Gradient = BL, so B = 0.024 ÷ 0.050 = 0.48 T', ['C1: gradient = BL', 'C1: value'], sig=2, aq='B')
# hard
N('H', 5, 'A pendulum gives L/m = 0.20, 0.40, 0.60, 0.80, 1.00 and T/s = 0.90, 1.27, 1.55, 1.79, 2.01. (a) Explain why T² is plotted against L. (b) Use the first and last readings to estimate the gradient of T² against L. (c) Hence find g.', 4 * pi ** 2 / ((2.01 ** 2 - 0.90 ** 2) / (1.00 - 0.20)), 'm s⁻²',
  f'(a) T² = (4π²/g)L, a straight line through the origin. (b) Gradient = (2.01² − 0.90²) ÷ (1.00 − 0.20) = {sf((2.01 ** 2 - 0.81) / 0.8, 4)} s² m⁻¹. (c) g = 4π² ÷ {sf((2.01 ** 2 - 0.81) / 0.8, 4)} = {sf(4 * pi ** 2 / ((2.01 ** 2 - 0.81) / 0.8))} m s⁻²',
  ['B1: linear form', 'C1: T² values', 'C1: gradient', 'M1: g = 4π²/gradient'], aq='g')
N('H', 6, 'Readings x = 2.0, 3.0, 5.0, 8.0 and y = 11.3, 20.8, 44.7, 90.5 are thought to obey y = kxⁿ. (a) Use the first and last readings to find n. (b) Find k. Give only the answer to (b).', 11.3 / 2.0 ** (log10(90.5 / 11.3) / log10(4.0)), None,
  f'(a) n = (lg 90.5 − lg 11.3) ÷ (lg 8.0 − lg 2.0) = {sf(log10(90.5 / 11.3) / log10(4), 4)}. (b) k = 11.3 ÷ 2.0^{sf(log10(90.5 / 11.3) / log10(4), 4)} = {sf(11.3 / 2 ** (log10(90.5 / 11.3) / log10(4)))}',
  ['C1: logs of data', 'M1: gradient of log–log', 'C1: n', 'M1: k = y/xⁿ', 'C1: value'], aq='k')
N('H', 5, 'A count rate (corrected for background) is 640, 452, 320, 226 and 160 counts per minute at t = 0, 5, 10, 15 and 20 min. (a) Explain why ln C against t is a straight line. (b) Use the first and last readings to find the half-life, in minutes.', 20 * log(2) / log(640 / 160), 'min',
  f'(a) C = C₀e^(−λt) gives ln C = ln C₀ − λt. (b) λ = (ln 640 − ln 160) ÷ 20 = {sf(log(4) / 20, 4)} min⁻¹; t½ = ln 2 ÷ {sf(log(4) / 20, 4)} = {sf(20 * log(2) / log(4))} min',
  ['B1: linear form', 'C1: gradient = −λ', 'M1: t½ = ln 2/λ', 'C1: value'], sig=2, aq='t½')
N('H', 5, 'For a thin converging lens, uv = f(u + v). A student finds u = 20 cm, v = 60 cm and u = 30 cm, v = 30 cm. (a) Calculate uv and u + v for each pair. (b) Find f from the gradient of uv against (u + v), in cm.', (20 * 60 - 30 * 30) / ((20 + 60) - (30 + 30)), 'cm',
  '(a) 1200 cm² and 80 cm; 900 cm² and 60 cm. (b) f = gradient = (1200 − 900) ÷ (80 − 60) = 15 cm',
  ['C1: uv values', 'C1: u + v values', 'M1: gradient = f', 'C1: substitution'], sig=2, aq='f')
N('H', 6, 'A graph of acceleration a against displacement x for an oscillator is a straight line through the origin with gradient −158 s⁻². (a) Explain why this shows simple harmonic motion. (b) Calculate the angular frequency. (c) Calculate the frequency.', sqrt(158) / (2 * pi), 'Hz',
  f'(a) a ∝ −x. (b) ω = √158 = {sf(sqrt(158), 4)} rad s⁻¹. (c) f = {sf(sqrt(158), 4)} ÷ 2π = {sf(sqrt(158) / (2 * pi))} Hz',
  ['B1: a proportional to −x', 'M1: gradient = −ω²', 'C1: ω', 'M1: f = ω/2π', 'C1: value'], aq='f')
N('H', 5, 'For a black body, P = kTⁿ is expected with n = 4. A graph of lg P against lg T passes through (3.20, 1.30) and (3.50, 2.47). (a) Calculate the gradient. (b) Calculate the percentage difference between this gradient and 4.', abs((2.47 - 1.30) / (3.50 - 3.20) - 4) / 4 * 100, '%',
  f'(a) Gradient = (2.47 − 1.30) ÷ (3.50 − 3.20) = {sf(1.17 / 0.3, 2)}. (b) % difference = (4 − 3.9) ÷ 4 × 100 = {sf((4 - 1.17 / 0.3) / 4 * 100, 2)} %',
  ['C1: Δ(lg P)', 'C1: gradient', 'M1: % difference', 'C1: value'], aq='% difference')
N('H', 5, 'Light of intensity I passes through n identical filters: I = I₀rⁿ. A graph of lg I against n has gradient −0.097. (a) Explain why the graph is a straight line. (b) Calculate r, the fraction transmitted by one filter.', 10 ** -0.097, None,
  f'(a) lg I = lg I₀ + n lg r, linear in n. (b) lg r = −0.097, so r = 10^(−0.097) = {sf(10 ** -0.097)}',
  ['B1: lg form', 'B1: gradient = lg r', 'M1: inverse log', 'C1: value'], aq='r')
N('H', 6, 'In an experiment, V = 1.00, 2.00, 3.00, 4.00 V across a component give I = 0.050, 0.141, 0.260, 0.400 A. (a) Show that I is not proportional to V. (b) Assuming I = kVⁿ, use the first and last readings to find n.', log10(0.400 / 0.050) / log10(4.00), None,
  f'(a) I/V = 0.050, 0.0705, 0.0867, 0.100: not constant. (b) n = (lg 0.400 − lg 0.050) ÷ (lg 4.00 − lg 1.00) = {sf(log10(8) / log10(4))}',
  ['C1: ratio I/V calculated', 'B1: ratio not constant', 'M1: log–log gradient', 'C1: substitution', 'C1: value'], aq='n')

# ═════════════════════════ P2.4 Treatment of uncertainties (17/18/9) ═════════════════════════
lesson('P2.4')
N('E', 2, 'A supply is labelled 12.0 V ± 2.5%. Calculate the absolute uncertainty in its voltage.', 12.0 * 0.025, 'V',
  'ΔV = 2.5 ÷ 100 × 12.0 = 0.30 V', ['C1: % × value'], sig=2, aq='ΔV')
N('E', 2, 'A length is measured as 25.0 ± 0.5 cm. Calculate its percentage uncertainty.', 0.5 / 25.0 * 100, '%',
  '% uncertainty = 0.5 ÷ 25.0 × 100 = 2.0 %', ['C1: absolute ÷ value × 100'], sig=2, aq='% uncertainty')
N('E', 2, 'Two lengths, 12.4 ± 0.2 cm and 3.6 ± 0.1 cm, are added. Calculate the absolute uncertainty of the total, in cm.', 0.3, 'cm',
  'For a sum, add absolute uncertainties: 0.2 + 0.1 = 0.3 cm', ['C1: add absolute uncertainties'], sig=1, aq='Δ')
N('E', 2, 'The ends of a spring are at 85.2 ± 0.1 cm and 12.7 ± 0.1 cm on a rule. Calculate the absolute uncertainty in the length of the spring, in cm.', 0.2, 'cm',
  'For a difference, the absolute uncertainties still add: 0.1 + 0.1 = 0.2 cm', ['C1: add for a difference'], sig=1, aq='Δ')
N('E', 2, 'A resistance is found from R = V/I, with V uncertain by 2.0% and I by 1.5%. Calculate the percentage uncertainty in R.', 3.5, '%',
  '% in R = 2.0 + 1.5 = 3.5 %', ['C1: add percentages for a quotient'], sig=2, aq='% uncertainty')
N('E', 2, 'A speed v has a percentage uncertainty of 1.5%. Calculate the percentage uncertainty in v².', 3.0, '%',
  '% in v² = 2 × 1.5 = 3.0 %', ['C1: power × %'], sig=2, aq='% uncertainty')
M('E', 1, 'How is the uncertainty in a set of repeated readings usually estimated?', 'Half the range of the readings', ['The largest reading', 'The mean of the readings', 'The smallest reading'], 'Half of (largest − smallest) covers the spread either side of the mean.')
N('E', 2, 'Repeat readings of a diameter are 3.42, 3.48, 3.45 and 3.39 mm. Estimate the uncertainty as half the range, in mm.', (3.48 - 3.39) / 2, 'mm',
  'Uncertainty = (3.48 − 3.39) ÷ 2 = 0.045 mm', ['C1: half the range'], sig=2, aq='Δd')
M('E', 1, 'What does the length of an error bar on a graph represent?', 'The absolute uncertainty in the plotted value, drawn above and below (or either side of) the point', ['The percentage uncertainty only', 'The size of the scale division', 'The difference from the best-fit line'], 'Each bar extends ± the absolute uncertainty.')
M('E', 1, 'What is the "worst acceptable line" on a graph with error bars?', 'The steepest or shallowest straight line that still passes through all the error bars', ['The line through the first and last points', 'A line that misses all the points', 'The best-fit line drawn twice'], 'Its gradient is used to estimate the uncertainty in the gradient.')
N('E', 2, 'A length of 45 mm is read on a rule with each end uncertain by ±0.5 mm. Calculate the percentage uncertainty in the length.', 1.0 / 45 * 100, '%',
  f'Δ = 0.5 + 0.5 = 1.0 mm; % = 1.0 ÷ 45 × 100 = {sf(100 / 45, 2)} %', ['C1: two readings, add'], sig=2, aq='% uncertainty')
M('E', 1, 'A meter reads 0.02 A when no current flows. What type of error does this cause in every reading?', 'A systematic (zero) error', ['A random error', 'A parallax error only', 'No error'], 'It shifts all readings by the same amount.')
N('E', 2, 'Ten oscillations take 15.3 s with a reaction-time uncertainty of ±0.1 s. Calculate the percentage uncertainty in the period.', 0.1 / 15.3 * 100, '%',
  f'% = 0.1 ÷ 15.3 × 100 = {sf(0.1 / 15.3 * 100, 2)} %', ['C1: same % as total time'], sig=2, aq='% uncertainty')
M('E', 1, 'A value y = 50 ± 5 is to be plotted as lg y. How is the error bar for lg y found?', 'Calculate lg(55) − lg(50) (or lg 50 − lg 45)', ['Use lg 5', 'Use 5 ÷ 50', 'Use lg 50 ÷ 5'], 'The bar is the change in lg y caused by the uncertainty in y.')
N('E', 2, 'A quantity y = 50 ± 5. Calculate the uncertainty in lg y using lg(y + Δy) − lg y.', log10(55) - log10(50), None,
  f'Δ(lg y) = lg 55 − lg 50 = {sf(log10(55) - log10(50), 2)}', ['C1: difference of logs'], sig=2, aq='Δ(lg y)')
N('E', 2, 'Three readings of a current are 0.52 A, 0.55 A and 0.49 A. Estimate the uncertainty in the mean as half the range.', 0.03, 'A',
  'Uncertainty = (0.55 − 0.49) ÷ 2 = 0.03 A', ['C1: half the range'], sig=1, aq='ΔI')
M('E', 1, 'Which statement describes precise readings?', 'Repeated readings that are close to each other', ['Readings close to the true value', 'Readings with no systematic error', 'Readings taken with expensive instruments'], 'Precision is about spread; accuracy is closeness to the true value.')
N('E', 1, 'A length is 2.50 ± 0.02 m. Calculate its percentage uncertainty.', 0.02 / 2.50 * 100, '%',
  '% = 0.02 ÷ 2.50 × 100 = 0.8 %', [], sig=1, aq='% uncertainty')
# medium
N('M', 3, 'The volume of a cylinder is V = πd²L/4. The diameter has an uncertainty of 2.0% and the length 1.0%. Calculate the percentage uncertainty in V.', 5.0, '%',
  '% in V = 2 × 2.0 + 1.0 = 5.0 %', ['C1: d² doubles its %', 'C1: add L'], sig=2, aq='% uncertainty')
N('M', 3, 'g is found from g = 4π²L/T². L is uncertain by 0.5% and T by 1.0%. Calculate the percentage uncertainty in g.', 2.5, '%',
  '% in g = 0.5 + 2 × 1.0 = 2.5 %', ['C1: T² doubles', 'C1: sum'], sig=2, aq='% uncertainty')
N('M', 3, 'Density is found from ρ = m/(πr²h). The uncertainties are 1.0% in m, 2.0% in r and 0.5% in h. Calculate the percentage uncertainty in ρ.', 5.5, '%',
  '% in ρ = 1.0 + 2 × 2.0 + 0.5 = 5.5 %', ['C1: r² term', 'C1: total'], sig=2, aq='% uncertainty')
N('M', 3, 'The best-fit line on a graph has gradient 4.20 and the worst acceptable line has gradient 4.55. Calculate the absolute uncertainty in the gradient.', 0.35, None,
  'Δm = 4.55 − 4.20 = 0.35', ['C1: worst − best', 'C1: value'], sig=2, aq='Δm')
N('M', 3, 'A best-fit gradient is 2.50 and the worst acceptable gradient is 2.70. Calculate the percentage uncertainty in the gradient.', 0.20 / 2.50 * 100, '%',
  '% = (2.70 − 2.50) ÷ 2.50 × 100 = 8.0 %', ['C1: absolute uncertainty', 'C1: percentage'], sig=2, aq='% uncertainty')
N('M', 3, 'The best-fit line has a y-intercept of 0.60 and the worst acceptable line one of 0.45. State the uncertainty in the y-intercept.', 0.15, None,
  'Δc = 0.60 − 0.45 = 0.15', ['C1: difference of intercepts', 'C1: value'], sig=2, aq='Δc')
N('M', 4, 'A spring constant is found from k = 4π²/m, where m = 0.160 ± 0.008 s² kg⁻¹ is the gradient of T² against mass. Calculate k and its absolute uncertainty. Give only the uncertainty, in N m⁻¹.', 4 * pi ** 2 / 0.160 * 0.05, 'N m⁻¹',
  f'k = 4π² ÷ 0.160 = {sf(4 * pi ** 2 / 0.16, 4)} N m⁻¹; % = 0.008 ÷ 0.160 × 100 = 5.0 %; Δk = 0.050 × {sf(4 * pi ** 2 / 0.16, 4)} = {sf(4 * pi ** 2 / 0.16 * 0.05, 2)} N m⁻¹',
  ['C1: k', 'C1: % in gradient = % in k', 'C1: absolute'], sig=2, aq='Δk')
N('M', 3, 'A speed is found from v = √(2gh). The height h has a 4.0% uncertainty. Calculate the percentage uncertainty in v.', 2.0, '%',
  '% in v = 0.5 × 4.0 = 2.0 %', ['C1: power ½', 'C1: value'], sig=2, aq='% uncertainty')
N('M', 3, 'To find a resistivity a student uses ρ = πd²R/(4L), with R known to 2.0%, d to 1.5% and L to 0.2%. What is the percentage uncertainty in ρ?', 2.0 + 3.0 + 0.2, '%',
  '% in ρ = 2.0 + 2 × 1.5 + 0.2 = 5.2 %', ['C1: d² term', 'C1: total'], sig=2, aq='% uncertainty')
N('M', 3, 'A resistivity of 4.9 × 10⁻⁷ Ω m has an uncertainty of 5.2%. Calculate the absolute uncertainty, in units of 10⁻⁷ Ω m.', 4.9e-7 * 0.052, '10⁻⁷ Ω m',
  f'Δρ = 0.052 × 4.9 × 10⁻⁷ = {sf(4.9e-7 * 0.052, 2)} Ω m', ['C1: fraction × value', 'C1: units'], sig=2, aq='Δρ')
N('M', 3, 'A value x = 2.0 ± 0.1 is plotted as lg x. Calculate the uncertainty in lg x.', log10(2.1) - log10(2.0), None,
  f'Δ(lg x) = lg 2.1 − lg 2.0 = {sf(log10(2.1) - log10(2.0), 2)}', ['C1: lg of upper value', 'C1: difference'], sig=2, aq='Δ(lg x)')
N('M', 3, 'A time t = 40 ± 2 s is plotted as ln(t/s). Calculate the uncertainty in ln t.', log(42) - log(40), None,
  f'Δ(ln t) = ln 42 − ln 40 = {sf(log(42) - log(40), 2)}', ['C1: ln of upper value', 'C1: difference'], sig=2, aq='Δ(ln t)')
N('M', 3, 'An object distance u = 25.0 ± 0.5 cm is plotted as 1/u. Calculate the absolute uncertainty in 1/u, in units of 10⁻³ cm⁻¹.', (1 / 24.5 - 1 / 25.0) * 1e3, '10⁻³ cm⁻¹',
  f'Δ(1/u) = 1 ÷ 24.5 − 1 ÷ 25.0 = {sf(1 / 24.5 - 1 / 25, 3)} cm⁻¹. In units of 10⁻³ cm⁻¹: {sf(1 / 24.5 - 1 / 25, 3)} × 10³ = {sf((1 / 24.5 - 1 / 25) * 1e3)}', ['C1: 1/(u − Δu)', 'C1: difference'], aq='Δ(1/u)')
N('M', 3, 'Ten oscillations take 15.6 ± 0.2 s. Calculate the absolute uncertainty in the period.', 0.02, 's',
  'ΔT = 0.2 ÷ 10 = 0.02 s', ['C1: divide uncertainty by 10', 'C1: value'], sig=1, aq='ΔT')
M('M', 3, 'How can the percentage uncertainty in measuring the thickness of a thin sheet of glass be reduced?', 'Use a micrometer rather than a ruler, and measure at several points to find a mean', ['Use a metre rule more carefully', 'Measure only once', 'Use a top-pan balance'], 'A smaller instrument resolution and averaging both help.', ['C1: higher-resolution instrument', 'C1: repeat and average'])
N('M', 3, 'The side of a square sheet is 12.0 ± 0.1 cm. Calculate the absolute uncertainty in its area, in cm².', 2 * 0.1 / 12.0 * 144, 'cm²',
  f'% in side = 0.1 ÷ 12.0 × 100 = {sf(100 * 0.1 / 12, 3)} %; % in area = 2 × {sf(100 * 0.1 / 12, 3)} = {sf(200 * 0.1 / 12, 3)} %; ΔA = 144 × {sf(200 * 0.1 / 12, 3)} ÷ 100 = {sf(2 * 0.1 / 12 * 144, 2)} cm²', ['C1: double %', 'C1: absolute'], sig=2, aq='ΔA')
N('M', 3, 'Power is found from P = V²/R. V has a 2.0% uncertainty and R a 3.0% uncertainty. Calculate the percentage uncertainty in P.', 7.0, '%',
  '% in P = 2 × 2.0 + 3.0 = 7.0 %', ['C1: V² term', 'C1: total'], sig=2, aq='% uncertainty')
N('M', 4, 'Kinetic energy is found from ½mv². m has an uncertainty of 0.5% and v = 4.0 ± 0.1 m s⁻¹. Calculate the percentage uncertainty in the kinetic energy.', 0.5 + 2 * 2.5, '%',
  '% in v = 0.1 ÷ 4.0 × 100 = 2.5 %; % in E = 0.5 + 2 × 2.5 = 5.5 %', ['C1: % in v', 'M1: double for v²', 'C1: add m'], sig=2, aq='% uncertainty')
# hard
N('H', 5, 'A pendulum has L = 0.800 ± 0.002 m and T = 1.80 ± 0.02 s. (a) Calculate g. (b) Calculate the percentage uncertainty in g. (c) Calculate the absolute uncertainty in g. Give only the answer to (c).', 4 * pi ** 2 * 0.8 / 1.8 ** 2 * (0.002 / 0.8 + 2 * 0.02 / 1.8), 'm s⁻²',
  f'(a) g = 4π² × 0.800 ÷ 1.80² = {sf(4 * pi ** 2 * 0.8 / 3.24, 4)} m s⁻². (b) % = 0.25 + 2 × {sf(2 / 1.8, 3)} = {sf(0.25 + 4 / 1.8, 3)} %. (c) Δg = {sf(0.25 + 4 / 1.8, 3)} ÷ 100 × {sf(4 * pi ** 2 * 0.8 / 3.24, 4)} = {sf(4 * pi ** 2 * 0.8 / 3.24 * (0.0025 + 0.04 / 1.8), 2)} m s⁻²',
  ['C1: g', 'C1: % in L', 'C1: 2 × % in T', 'M1: absolute = % × value'], sig=2, aq='Δg')
N('H', 6, 'The Young modulus is found from E = 4FL/(πd²e). The uncertainties are 1.0% in F, 0.2% in L, 2.0% in d and 4.0% in e. (a) Explain why the uncertainty in d counts twice. (b) Calculate the percentage uncertainty in E.', 1.0 + 0.2 + 4.0 + 4.0, '%',
  '(a) d is squared. (b) % in E = 1.0 + 0.2 + 2 × 2.0 + 4.0 = 9.2 %',
  ['B1: d² doubles its %', 'C1: F and L', 'C1: e', 'M1: sum of terms', 'C1: value'], sig=2, aq='% uncertainty')
N('H', 5, 'A graph with error bars has a best-fit gradient of 3.12. The worst acceptable line passes through (0.0, 0.60) and (5.0, 17.6). (a) Calculate the gradient of the worst acceptable line. (b) Calculate the percentage uncertainty in the gradient.', ((17.6 - 0.60) / 5.0 - 3.12) / 3.12 * 100, '%',
  f'(a) m = (17.6 − 0.60) ÷ 5.0 = {sf(17.0 / 5, 3)}. (b) % = ({sf(17.0 / 5, 3)} − 3.12) ÷ 3.12 × 100 = {sf((3.4 - 3.12) / 3.12 * 100)} %',
  ['C1: worst gradient', 'M1: difference from best', 'C1: ÷ best', 'C1: value'], aq='% uncertainty')
N('H', 5, 'A graph of T² against mass has gradient 3.95 ± 0.15 s² kg⁻¹, and the spring constant is k = 4π²/gradient. (a) Calculate k. (b) Calculate the absolute uncertainty in k, in N m⁻¹.', 4 * pi ** 2 / 3.95 * 0.15 / 3.95, 'N m⁻¹',
  f'(a) k = 4π² ÷ 3.95 = {sf(4 * pi ** 2 / 3.95, 4)} N m⁻¹. (b) % = 0.15 ÷ 3.95 × 100 = {sf(15 / 3.95, 3)} %; Δk = {sf(15 / 3.95, 3)} ÷ 100 × {sf(4 * pi ** 2 / 3.95, 4)} = {sf(4 * pi ** 2 / 3.95 * 0.15 / 3.95, 2)} N m⁻¹',
  ['C1: k', 'C1: % in gradient', 'M1: same % in k', 'C1: absolute'], sig=2, aq='Δk')
N('H', 6, 'A log–log graph gives a best-fit gradient of 1.48 and a worst acceptable gradient of 1.62. (a) State n with its uncertainty. (b) Explain whether the data support n = 1.5. Give the uncertainty in n as your answer.', 1.62 - 1.48, None,
  '(a) Δn = 1.62 − 1.48 = 0.14, so n = 1.48 ± 0.14. (b) 1.5 lies between 1.34 and 1.62, so the data support n = 1.5.',
  ['C1: Δn = worst − best', 'C1: n stated with uncertainty', 'M1: range of n', 'B1: 1.5 within range', 'B1: conclusion'], sig=2, aq='Δn')
N('H', 5, 'A specific heat capacity is found from c = Pt/(mΔθ). P has 2.0% uncertainty, t 0.5%, m 0.2%, and Δθ = 18.5 ± 0.5 K. (a) Calculate the percentage uncertainty in Δθ. (b) Calculate the percentage uncertainty in c.', 2.0 + 0.5 + 0.2 + 0.5 / 18.5 * 100, '%',
  f'(a) 0.5 ÷ 18.5 × 100 = {sf(50 / 18.5, 3)} %. (b) % in c = 2.0 + 0.5 + 0.2 + {sf(50 / 18.5, 3)} = {sf(2.7 + 50 / 18.5, 2)} %',
  ['C1: % in Δθ', 'M1: add all %', 'C1: sum', 'C1: value'], sig=2, aq='% uncertainty')
N('H', 6, 'A best-fit line has gradient 2.40 and y-intercept 1.20. The worst acceptable line passes through (1.0, 3.9) and (5.0, 13.3). (a) Calculate the gradient of the worst line. (b) Calculate its y-intercept. (c) Calculate the uncertainty in the y-intercept.', (3.9 - (13.3 - 3.9) / 4.0 * 1.0) - 1.20, None,
  f'(a) m = (13.3 − 3.9) ÷ (5.0 − 1.0) = {sf(9.4 / 4, 3)}. (b) c = 3.9 − {sf(9.4 / 4, 3)} × 1.0 = {sf(3.9 - 2.35, 3)}. (c) Δc = {sf(3.9 - 2.35, 3)} − 1.20 = {sf(3.9 - 2.35 - 1.2, 2)}',
  ['C1: worst gradient', 'M1: c = y − mx', 'C1: worst intercept', 'M1: difference', 'C1: value'], sig=2, aq='Δc')
N('H', 5, 'The e.m.f. of a cell is the intercept of a V–I graph. The best-fit intercept is 1.52 V and the worst acceptable intercept is 1.47 V. (a) State E with its uncertainty. (b) Calculate the percentage uncertainty in E.', 0.05 / 1.52 * 100, '%',
  f'(a) E = 1.52 ± 0.05 V. (b) % = 0.05 ÷ 1.52 × 100 = {sf(5 / 1.52, 2)} %',
  ['C1: ΔE', 'C1: E stated', 'M1: % = ΔE/E × 100', 'C1: value'], sig=2, aq='% uncertainty')
N('H', 5, 'A card of width 5.0 ± 0.1 cm cuts a light gate for 0.0250 ± 0.0005 s, and the trolley mass is 0.200 ± 0.002 kg. (a) Calculate the percentage uncertainty in the speed. (b) Calculate the percentage uncertainty in the kinetic energy.', 1.0 + 2 * (2.0 + 2.0), '%',
  '(a) % in v = 0.1 ÷ 5.0 × 100 + 0.0005 ÷ 0.0250 × 100 = 4.0 %. (b) % in E = 1.0 + 2 × 4.0 = 9.0 %',
  ['C1: % in width and time', 'C1: % in v', 'M1: double for v²', 'C1: add mass'], sig=2, aq='% uncertainty')

# ═════════════════════════ P2.5 Conclusions and evaluation of results (17/19/8) ═════════════════════════
lesson('P2.5')
N('E', 2, 'A class measures the speed of sound in air as 336 m s⁻¹; the accepted value is 343 m s⁻¹. By what percentage is the class value below the accepted one?', (343 - 336) / 343 * 100, '%',
  f'% = (343 − 336) ÷ 343 × 100 = {sf(700 / 343)} %', ['C1: difference ÷ accepted'], aq='% difference')
N('E', 2, 'A result is quoted as 4.2 ± 0.3. State the lowest value within its uncertainty.', 3.9, None,
  'Lower limit = 4.2 − 0.3 = 3.9', ['C1: value − uncertainty'], sig=2, aq='lower limit')
M('E', 1, 'A measured value is 8.2 ± 0.5 and the accepted value is 8.5. Does the result agree with the accepted value?', 'Yes, because 8.5 lies between 7.7 and 8.7', ['No, because 8.2 is not 8.5', 'No, because the uncertainty is too large', 'It is impossible to say'], 'Agreement means the accepted value lies within the range of the result.')
M('E', 1, 'An experiment gives 2.10 ± 0.05 for a constant whose textbook value is 2.30. What should the student conclude?', 'No, because 2.30 is outside the range 2.05 to 2.15', ['Yes, because the values are close', 'Yes, because the uncertainty is small', 'It agrees within 10%, so yes'], 'The accepted value must lie inside the range of the result.')
M('E', 1, 'In an evaluation, what is a limitation?', 'A problem with the procedure or apparatus that causes uncertainty in the results', ['A way of improving the experiment', 'The final answer', 'The independent variable'], 'Each limitation should be matched with an improvement.')
M('E', 1, 'Reaction time makes hand-timing of a short fall unreliable. Which improvement is best?', 'Use light gates connected to an electronic timer', ['Use a different stopwatch', 'Ask a friend to time it', 'Drop the object from a lower height'], 'Electronic timing removes human reaction time.')
M('E', 1, 'Readings of a pointer against a scale suffer from parallax. Which improvement is best?', 'Read with the eye level with the pointer, or use a mirror scale', ['Use a longer scale', 'Take readings faster', 'Use a brighter light'], 'Viewing perpendicular to the scale removes parallax.')
M('E', 1, 'A graph of y against x is a straight line through the origin, within the error bars. What is the conclusion?', 'y is proportional to x', ['y is inversely proportional to x', 'y and x are unrelated', 'y = x² for these data'], 'A straight line through the origin shows direct proportion.')
M('E', 1, 'A graph of y against x is a straight line with a positive intercept on the y-axis. What can be concluded?', 'y increases linearly with x but is not proportional to it', ['y is proportional to x', 'y is inversely proportional to x', 'There is no relationship'], 'Proportionality requires the line to pass through the origin.')
N('E', 2, 'A resistance is found to be 12.6 ± 0.4 Ω. Calculate its percentage uncertainty.', 0.4 / 12.6 * 100, '%',
  f'% = 0.4 ÷ 12.6 × 100 = {sf(40 / 12.6, 2)} %', ['C1: absolute ÷ value × 100'], sig=2, aq='% uncertainty')
M('E', 1, 'Why should an experiment be repeated?', 'To check reliability, spot anomalous readings and reduce random error by averaging', ['To remove systematic errors', 'To make the answer match the accepted value', 'To use up the apparatus time'], 'Repeats deal with random, not systematic, errors.')
M('E', 1, 'In a specific heat capacity experiment, much energy is lost to the surroundings. Which improvement is best?', 'Insulate the block (lag it) and start below room temperature', ['Use a larger thermometer', 'Heat for a shorter time with no insulation', 'Use a heavier block without insulation'], 'Lagging reduces heat loss.')
N('E', 2, 'A student obtains 1.52 for a quantity whose accepted value is 1.60. Calculate the percentage difference from the accepted value.', (1.60 - 1.52) / 1.60 * 100, '%',
  '% = (1.60 − 1.52) ÷ 1.60 × 100 = 5.0 %', ['C1: difference ÷ accepted'], sig=2, aq='% difference')
M('E', 1, 'An ammeter has a zero error. How should the readings be corrected?', 'Subtract the zero reading from every reading', ['Take more readings', 'Average the readings', 'Ignore the first reading'], 'A zero error is a systematic error and is corrected, not averaged.')
M('E', 1, 'Does taking more repeat readings reduce a systematic error?', 'No, because a systematic error shifts every reading by the same amount', ['Yes, always', 'Yes, if more than ten readings are taken', 'Only if the mean is used'], 'Averaging reduces only random errors.')
N('E', 2, 'A diameter is measured as 1.20 ± 0.06 mm; the manufacturer states 1.30 mm. Calculate how far the accepted value lies above the upper limit of the measurement, in mm.', 1.30 - 1.26, 'mm',
  'Upper limit = 1.20 + 0.06 = 1.26 mm; gap = 1.30 − 1.26 = 0.04 mm', ['C1: upper limit'], sig=1, aq='gap')
M('E', 1, 'Which pair of values (experiment, theory) shows agreement within the experimental uncertainty?', '6.2 ± 0.3 and 6.4', ['6.2 ± 0.1 and 6.4', '5.8 ± 0.2 and 6.4', '7.0 ± 0.3 and 6.4'], 'Only 6.2 ± 0.3 has a range (5.9 to 6.5) that includes 6.4.')
N('E', 2, 'Two students time the same event as 2.6 ± 0.1 s and 2.9 ± 0.1 s. Calculate the gap between the upper limit of the first value and the lower limit of the second.', 0.1, 's',
  'Upper limit of first = 2.7 s; lower limit of second = 2.8 s; gap = 2.8 − 2.7 = 0.1 s', ['C1: both limits'], sig=1, aq='gap')
M('E', 1, 'Points on a graph are widely scattered about the best-fit line. What does this suggest?', 'Large random errors in the readings', ['A large systematic error', 'That the relationship is proportional', 'That the scale is too large'], 'Random errors cause scatter; systematic errors shift the line.')
# medium
M('M', 3, 'A spring constant is measured as 24.6 ± 1.2 N m⁻¹; the manufacturer states 26.0 N m⁻¹. What should be concluded?', 'The result does not agree: the upper limit, 25.8 N m⁻¹, is below 26.0 N m⁻¹', ['It agrees because the values differ by less than 10%', 'It agrees because 26.0 − 24.6 is close to 1.2', 'No conclusion can be drawn'], 'Compare the accepted value with the range of the result.', ['C1: upper limit 25.8', 'C1: accepted value outside range'])
N('M', 3, 'A student finds g = 9.45 m s⁻² with an uncertainty of 2.0%. Calculate the percentage difference from the accepted value of 9.81 m s⁻².', (9.81 - 9.45) / 9.81 * 100, '%',
  f'% difference = (9.81 − 9.45) ÷ 9.81 × 100 = {sf(36 / 9.81)} %', ['C1: difference', 'C1: ÷ accepted × 100'], aq='% difference')
M('M', 3, 'A result differs from the accepted value by 3.7%, while its uncertainty is 2.0%. What is the most likely explanation?', 'A systematic error not included in the uncertainty', ['Random errors alone', 'The accepted value is wrong', 'Too many readings were taken'], 'A difference larger than the uncertainty points to an unaccounted systematic error.', ['C1: difference > uncertainty', 'C1: systematic error'])
M('M', 3, 'A ball\'s fall time from 0.40 m (about 0.29 s) is measured with a stopwatch. Which limitation and improvement go together?', 'Reaction time is large compared with the time measured; use light gates with an electronic timer', ['The ball is too heavy; use a lighter ball', 'The height is too large; use 0.10 m', 'The stopwatch reads to 0.01 s; use one that reads to 0.1 s'], 'A reaction time of ~0.2 s is most of the fall time.', ['C1: reaction time limitation', 'C1: light gates improvement'])
M('M', 3, 'A wire\'s diameter was measured once, at one end. Which limitation and improvement go together?', 'The wire may not be uniform; measure at several points along it and in different directions, then average', ['The wire is too long; cut it shorter', 'The micrometer is too precise; use a ruler', 'The wire is too hot; cool it'], 'One reading cannot reveal variation.', ['C1: non-uniform wire', 'C1: several readings averaged'])
M('M', 3, 'A log–log graph gives n = 2.12 ± 0.10. Does this support the hypothesis that n = 2?', 'No: the range 2.02 to 2.22 does not include 2', ['Yes, because 2.12 rounds to 2', 'Yes, because the uncertainty is small', 'No conclusion is possible'], 'Check whether 2 lies within n ± Δn.', ['C1: range calculated', 'C1: conclusion'])
M('M', 3, 'A student uses large amplitudes when timing a pendulum. What is the limitation, and the improvement?', 'Large amplitudes change the period from 2π√(L/g); use small amplitudes (under about 10°)', ['Large amplitudes make the bob heavier; use a lighter bob', 'Large amplitudes make the string shorter; use a longer string', 'There is no limitation'], 'The simple formula holds only for small angles.', ['C1: small-angle approximation', 'C1: use small amplitude'])
M('M', 4, 'In a resistance–length experiment, the wire gets warm as readings are taken. What is the limitation and its improvement?', 'Its resistance rises with temperature; use a small current and switch off between readings', ['The wire stretches; use a thicker wire', 'The ammeter heats up; use a voltmeter', 'The length changes; use a longer ruler'], 'Self-heating changes a control variable.', ['C1: temperature rise', 'C1: R changes', 'C1: small current/switch off'])
M('M', 3, 'Which change reduces the percentage uncertainty in a measured period?', 'Timing a larger number of oscillations', ['Using a heavier bob', 'Timing a single oscillation more carefully', 'Releasing the bob from a larger angle'], 'The same timing uncertainty is spread over more oscillations.', ['C1: more oscillations', 'C1: % = Δt/total'])
N('M', 3, 'A specific heat capacity is measured as 4350 J kg⁻¹ K⁻¹ with an uncertainty of 6%. Calculate the lower limit of the result, in J kg⁻¹ K⁻¹.', 4350 * 0.94, 'J kg⁻¹ K⁻¹',
  f'Δc = 0.06 × 4350 = 261; lower limit = 4350 − 261 = {sf(4350 * 0.94)} J kg⁻¹ K⁻¹', ['C1: absolute uncertainty', 'C1: subtract'], aq='lower limit')
M('M', 3, 'A V–I graph for a component is a straight line through the origin within its error bars. What is the conclusion?', 'The component obeys Ohm\'s law over this range: V ∝ I', ['The component is a filament lamp', 'The resistance increases with current', 'The component has no resistance'], 'Proportionality means constant resistance.', ['C1: straight line through origin', 'C1: constant resistance'])
N('M', 3, 'Calculate the percentage difference between an experimental value of 0.236 ± 0.012 and the accepted value of 0.250.', (0.250 - 0.236) / 0.250 * 100, '%',
  '% difference = (0.250 − 0.236) ÷ 0.250 × 100 = 5.6 %', ['C1: difference', 'C1: ÷ accepted × 100'], sig=2, aq='% difference')
M('M', 3, 'The distance from a lamp to an LDR is hard to measure because the filament is inside the bulb. Which improvement is best?', 'Use a small LED, or plot a graph so that the unknown offset appears as an intercept', ['Use a brighter bulb', 'Measure to the outside of the glass and ignore the error', 'Move the LDR further away'], 'An unknown constant offset can be found from a graph.', ['C1: offset limitation', 'C1: point source or intercept'])
M('M', 3, 'A graph that should pass through the origin has a clear non-zero intercept. What does this suggest?', 'A systematic error, such as a zero error or an unmeasured length (for example an end correction)', ['Random error only', 'Too few readings', 'An anomalous point'], 'A constant offset in every reading shifts the line.', ['C1: systematic error', 'C1: example'])
N('M', 4, 'For a resonance tube, L = v/4f − e. A graph of L against 1/f has intercept −0.012 m on the L axis. Calculate the end correction e, in mm.', 12, 'mm',
  'Intercept = −e, so e = 0.012 m. In mm: 0.012 × 10³ = 12', ['M1: intercept = −e', 'C1: e = 0.012 m', 'C1: mm'], sig=2, aq='e')
M('M', 3, 'Only four readings were taken over a narrow range of the independent variable. Which improvement is best?', 'Take more readings (at least six) over a wider range', ['Repeat the same four readings', 'Use a smaller range', 'Draw a curve instead of a line'], 'More, widely spread readings define the trend and gradient.', ['C1: more readings', 'C1: wider range'])
M('M', 3, 'A single reading in a set looks anomalous. What should the evaluation suggest?', 'Repeat that reading and take repeat readings for every value', ['Include it in the mean', 'Use it to define the line', 'Delete the whole set'], 'Repeats show whether a reading is anomalous.', ['C1: repeat', 'C1: check before rejecting'])
N('M', 3, 'A cell\'s e.m.f. is measured as 1.47 ± 0.03 V; its label says 1.50 V. Calculate the upper limit of the measurement and decide whether it agrees with the label. Give the upper limit.', 1.50, 'V',
  'Upper limit = 1.47 + 0.03 = 1.50 V, which equals the label value, so the measurement just agrees.', ['C1: upper limit', 'C1: comparison'], sig=3, aq='upper limit')
N('M', 3, 'A focal length is measured as 14.2 ± 0.6 cm. Calculate its percentage uncertainty.', 0.6 / 14.2 * 100, '%',
  f'% = 0.6 ÷ 14.2 × 100 = {sf(60 / 14.2, 2)} %', ['C1: Δf/f', 'C1: × 100'], sig=2, aq='% uncertainty')
# hard
N('H', 5, 'A student measures the resistivity of a wire as (5.2 ± 0.3) × 10⁻⁷ Ω m. Constantan has resistivity 4.9 × 10⁻⁷ Ω m. (a) Calculate the lower limit of the result. (b) Explain whether the wire could be constantan. Give the lower limit, in units of 10⁻⁷ Ω m.', 4.9e-7, '10⁻⁷ Ω m',
  '(a) Lower limit = (5.2 − 0.3) × 10⁻⁷ = 4.9 × 10⁻⁷ Ω m. (b) 4.9 lies just inside the range 4.9 to 5.5, so it could be constantan (only just).',
  ['C1: lower limit', 'C1: upper limit', 'M1: compare with accepted', 'B1: conclusion'], sig=2, aq='lower limit')
N('H', 6, 'A graph of T² against L has gradient 4.10 ± 0.12 s² m⁻¹. (a) Calculate g. (b) Calculate its absolute uncertainty. (c) State whether the result agrees with 9.81 m s⁻². Give only the answer to (b).', 4 * pi ** 2 / 4.10 * 0.12 / 4.10, 'm s⁻²',
  f'(a) g = 4π² ÷ 4.10 = {sf(4 * pi ** 2 / 4.1, 4)} m s⁻². (b) % = 0.12 ÷ 4.10 × 100 = {sf(12 / 4.1, 3)} %; Δg = {sf(12 / 4.1, 3)} ÷ 100 × {sf(4 * pi ** 2 / 4.1, 4)} = {sf(4 * pi ** 2 / 4.1 * 0.12 / 4.1, 2)} m s⁻². (c) The range 9.35 to 9.91 includes 9.81, so it agrees.',
  ['C1: g', 'C1: % in gradient', 'M1: absolute uncertainty', 'C1: range', 'B1: agrees'], sig=2, aq='Δg')
M('H', 5, 'A V–I graph for a resistor gives a straight line with a clear positive intercept on the V axis, although Ohm\'s law predicts a line through the origin. Which evaluation is best?', 'The voltmeter probably has a zero error (a systematic error); check and correct its zero, then repeat; the gradient still gives R', ['The resistor does not obey Ohm\'s law; discard the results', 'Random errors caused the intercept; take more readings', 'The current was too small; use a larger current only'], 'An offset in V shifts the line but leaves the gradient unchanged.',
  ['C1: intercept means systematic error', 'C1: zero error identified', 'C1: correction', 'C1: gradient unaffected'])
N('H', 5, 'Planck\'s constant is found from LEDs using h = e × (gradient)/c, where a graph of V against 1/λ has gradient 1.24 × 10⁻⁶ V m. (a) Calculate h, in units of 10⁻³⁴ J s. (b) Calculate the percentage difference from 6.63 × 10⁻³⁴ J s.' + take('e', 'c'), 1.60e-19 * 1.24e-6 / 3.00e8, '10⁻³⁴ J s',
  f'(a) h = 1.60 × 10⁻¹⁹ × 1.24 × 10⁻⁶ ÷ 3.00 × 10⁸ = {sf(1.6e-19 * 1.24e-6 / 3e8)} J s. (b) % = (6.63 − 6.61) ÷ 6.63 × 100 ≈ 0.3 %.',
  ['M1: h = e × gradient/c', 'C1: substitution', 'C1: value', 'C1: % difference'], aq='h')
N('H', 6, 'A spring constant is found statically as 25.0 ± 0.5 N m⁻¹ and dynamically from k = 4π²/m, where m = 1.62 ± 0.08 s² kg⁻¹. (a) Calculate the dynamic k. (b) Calculate its absolute uncertainty. (c) State whether the two values agree. Give only the answer to (b), in N m⁻¹.', 4 * pi ** 2 / 1.62 * 0.08 / 1.62, 'N m⁻¹',
  f'(a) k = 4π² ÷ 1.62 = {sf(4 * pi ** 2 / 1.62, 4)} N m⁻¹. (b) % = 0.08 ÷ 1.62 × 100 = {sf(8 / 1.62, 3)} %; Δk = {sf(8 / 1.62, 3)} ÷ 100 × {sf(4 * pi ** 2 / 1.62, 4)} = {sf(4 * pi ** 2 / 1.62 * 0.08 / 1.62, 2)} N m⁻¹. (c) The ranges 24.5–25.5 and 23.2–25.6 overlap, so they agree.',
  ['C1: dynamic k', 'C1: % uncertainty', 'M1: absolute uncertainty', 'C1: ranges', 'B1: overlap, agree'], sig=2, aq='Δk')
M('H', 5, 'A force–extension graph is straight at first but curves at the highest loads. Which conclusion and evaluation are best?', 'Hooke\'s law holds only up to the limit of proportionality; the spring constant should be found from the straight part only', ['The whole graph shows Hooke\'s law', 'The curved part shows random error; ignore it', 'The spring constant is the gradient of the curved part'], 'Beyond the limit of proportionality F is not proportional to x.',
  ['C1: linear region identified', 'C1: limit of proportionality', 'C1: gradient from straight part', 'C1: conclusion limited to range'])
N('H', 5, 'A glass block has refractive index n = 1.52 ± 0.03. (a) Calculate the speed of light in the glass. (b) Calculate the absolute uncertainty in this speed, in units of 10⁸ m s⁻¹.' + take('c'), 3.00e8 / 1.52 * 0.03 / 1.52, '10⁸ m s⁻¹',
  f'(a) v = 3.00 × 10⁸ ÷ 1.52 = {sf(3e8 / 1.52, 4)} m s⁻¹. (b) % = 0.03 ÷ 1.52 × 100 = {sf(3 / 1.52, 3)} %; Δv = {sf(3 / 1.52, 3)} ÷ 100 × {sf(3e8 / 1.52, 4)} = {sf(3e8 / 1.52 * 0.03 / 1.52, 2)} m s⁻¹',
  ['C1: v = c/n', 'C1: % in n', 'M1: same % in v', 'C1: absolute'], sig=2, aq='Δv')
N('H', 6, 'Five measurements of g are 9.62, 9.85, 9.74, 9.90 and 9.69 m s⁻². (a) Calculate the mean. (b) Estimate the uncertainty as half the range. (c) Calculate the percentage uncertainty.', (9.90 - 9.62) / 2 / ((9.62 + 9.85 + 9.74 + 9.90 + 9.69) / 5) * 100, '%',
  f'(a) Mean = (9.62 + 9.85 + 9.74 + 9.90 + 9.69) ÷ 5 = {sf(48.8 / 5, 3)} m s⁻². (b) Δg = (9.90 − 9.62) ÷ 2 = 0.14 m s⁻². (c) % = 0.14 ÷ {sf(48.8 / 5, 3)} × 100 = {sf(14 / 9.76, 2)} %',
  ['C1: mean', 'C1: range', 'C1: half range', 'M1: % = Δg/g × 100', 'C1: value'], sig=2, aq='% uncertainty')
