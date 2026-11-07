# Chapter 27 Alternating currents: 27.1 to 27.4.
R2 = sqrt(2)

# ═════════════════════════ 27.1 Alternating current and r.m.s. values (16/15/11) ═════════════════════════
lesson('27.1')
N('E', 2, 'A North American socket supplies 120 V r.m.s. What is the peak voltage?', 120 * R2, 'V',
  f'V₀ = √2 × V_rms = √2 × 120 = {sf(120 * R2)} V', ['C1: V₀ = √2 V_rms'], aq='V₀')
M('E', 1, 'Which relationship is correct for a sinusoidal alternating current?', 'I_rms = I₀/√2', ['I_rms = I₀/2', 'I_rms = √2 I₀', 'I_rms = I₀'], 'For a sine wave the mean of I² is I₀²/2.')
N('E', 2, 'The current through a lamp varies sinusoidally with an amplitude of 2.4 A. Calculate the r.m.s. current.', 2.4 / R2, 'A',
  f'I_rms = I₀/√2 = 2.4 ÷ √2 = {sf(2.4 / R2)} A', ['C1: I_rms = I₀/√2'], aq='I_rms')
M('E', 1, 'What is the mean value of a sinusoidal alternating current over one complete cycle?', 'Zero', ['I₀/√2', 'I₀/2', 'I₀'], 'The positive and negative halves cancel.')
N('E', 2, 'One complete cycle of an alternating supply lasts 16.7 ms. Calculate its frequency.', 1 / 16.7e-3, 'Hz',
  f'f = 1/T = 1 ÷ 16.7 × 10⁻³ = {sf(1 / 16.7e-3)} Hz', ['C1: f = 1/T'], aq='f')
M('E', 1, 'Why is the r.m.s. value used to describe an alternating current, rather than its mean value?', 'The mean is zero, but the heating effect depends on I², which is always positive', ['The r.m.s. value is always larger than the peak value', 'The mean value cannot be measured', 'The r.m.s. value is the same as the peak value'], 'The r.m.s. value gives the same heating as an equal steady current.')
N('E', 2, 'A 46 Ω resistor is connected to a 230 V r.m.s. supply. Calculate the peak current.', 230 / 46 * R2, 'A',
  f'I_rms = 230 ÷ 46 = 5.0 A. I₀ = √2 × 5.0 = {sf(5 * R2)} A', ['C1: I_rms then × √2'], aq='I₀')
M('E', 1, 'For a sinusoidal supply, what is (peak value) ÷ (r.m.s. value)?', '√2', ['2', '1/√2', '1'], 'For a sine wave V₀ = √2 V_rms, so the ratio is √2 ≈ 1.41.')
N('E', 2, 'A 50 Ω heater gives the same power on a steady current of 4.0 A as on a sinusoidal alternating current. Calculate the peak value of the alternating current.', 4.0 * R2, 'A',
  f'The r.m.s. current equals the equivalent steady current, 4.0 A, so I₀ = √2 × 4.0 = {sf(4 * R2)} A', ['C1: I_rms = equivalent d.c.'], aq='I₀')
M('E', 1, 'What is the unit of frequency?', 'Hz, equivalent to s⁻¹', ['s', 'rad', 'Hz s'], 'Frequency is the number of cycles per second.')
N('E', 2, 'A sinusoidal supply has an r.m.s. voltage of 6.0 V. Calculate its peak-to-peak voltage.', 2 * 6.0 * R2, 'V',
  f'V₀ = √2 × 6.0 = {sf(6 * R2)} V. Peak-to-peak = 2 × {sf(6 * R2, 4)} = {sf(12 * R2)} V', ['C1: V₀ then × 2'], aq='V_pp')
M('E', 1, 'A square-wave voltage switches between +V₀ and −V₀ with equal times at each. What is its r.m.s. value?', 'V₀', ['V₀/√2', 'V₀/2', 'Zero'], 'V² is always V₀², so the r.m.s. value is V₀.')
N('E', 1, 'A sinusoidal current has an r.m.s. value of 0.50 A. Calculate its peak value.', 0.50 * R2, 'A', f'I₀ = √2 × 0.50 = {sf(0.5 * R2)} A', [], aq='I₀')
M('E', 1, 'Which expression gives the mean power dissipated in a resistor R by a sinusoidal current?', 'I_rms²R', ['I₀²R', 'I_rms R', 'I₀R/√2'], 'Mean power = I_rms²R = ½I₀²R.')
N('E', 2, 'A sinusoidal current of peak value 2.0 A flows through a 10 Ω resistor. Calculate the mean power.', 0.5 * 2.0 ** 2 * 10, 'W',
  'P = ½I₀²R = 0.5 × 2.0² × 10 = 20 W', ['C1: ½I₀²R'], sig=2, aq='P')
M('E', 1, 'How does the instantaneous power in a resistor connected to a sinusoidal supply vary?', 'Between zero and twice the mean power', ['Between −P and +P', 'It is constant', 'Between the mean power and zero'], 'P = I₀²R sin²ωt varies from 0 to I₀²R = 2P_mean.')
# medium
N('M', 3, 'A lamp of resistance 240 Ω dissipates a mean power of 60 W on an a.c. supply. Calculate the r.m.s. voltage across it.', sqrt(60 * 240), 'V',
  'V_rms = √(PR) = √(60 × 240) = 120 V', ['C1: P = V_rms²/R', 'C1: rearranged'], sig=2, aq='V_rms')
N('M', 3, 'An r.m.s. current of 2.0 A flows through a 15 Ω resistor. Calculate the peak voltage across it.', 2.0 * 15 * R2, 'V',
  f'V_rms = 2.0 × 15 = 30 V. V₀ = √2 × 30 = {sf(30 * R2)} V', ['C1: V_rms = I_rms R', 'C1: × √2'], aq='V₀')
M('M', 3, 'A resistor is connected first to a 10 V d.c. supply and then to a sinusoidal supply of peak 10 V. Which statement is correct?', 'The d.c. supply gives twice the mean power', ['The a.c. supply gives twice the mean power', 'Both give the same mean power', 'The a.c. supply gives √2 times the mean power'], 'The a.c. has V_rms = 7.07 V, so P is (7.07/10)² = ½ of the d.c. power.', ['C1: V_rms = V₀/√2', 'C1: P ∝ V²'])
N('M', 4, 'A heater is connected to a sinusoidal supply of peak voltage 340 V. Calculate the steady d.c. voltage that would give the same mean power.', 340 / R2, 'V',
  f'Equivalent d.c. = V_rms = 340 ÷ √2 = {sf(340 / R2)} V', ['M1: d.c. equivalent is the r.m.s. value', 'C1: V_rms = V₀/√2', 'C1: value'], aq='V')
N('M', 3, 'A voltage is +4.0 V for half of each cycle and 0 V for the other half. Calculate its r.m.s. value.', sqrt(4.0 ** 2 / 2), 'V',
  f'Mean of V² = (4.0² + 0) ÷ 2 = 8.0 V². V_rms = √8.0 = {sf(sqrt(8))} V', ['C1: mean of the squares', 'C1: square root'], aq='V_rms')
M('M', 3, 'The peak voltage of a sinusoidal supply across a resistor is doubled. What happens to the r.m.s. voltage and to the mean power?', 'The r.m.s. voltage doubles and the mean power quadruples', ['Both double', 'The r.m.s. voltage doubles and the power is unchanged', 'Both quadruple'], 'V_rms ∝ V₀ and P ∝ V_rms².', ['C1: V_rms ∝ V₀', 'C1: P ∝ V²'])
N('M', 3, 'An r.m.s. current of 3.0 A flows through a 20 Ω resistor for 1.0 hour. Calculate the energy dissipated.', 3.0 ** 2 * 20 * 3600, 'J',
  f'P = 3.0² × 20 = 180 W. E = Pt = 180 × 3600 = {sf(180 * 3600)} J', ['C1: P = I_rms²R', 'C1: E = Pt'], aq='E')
N('M', 4, 'For a triangular waveform, I_rms = I₀/√3. Calculate the r.m.s. value of a triangular current of peak 6.0 A.', 6.0 / sqrt(3), 'A',
  f'I_rms = 6.0 ÷ √3 = {sf(6 / sqrt(3))} A', ['C1: formula', 'C1: substitution', 'B1: differs from the sine-wave value 4.24 A'], aq='I_rms')
M('M', 3, 'The mean of an alternating current over a cycle is zero, yet it heats a resistor. Why?', 'Heating depends on I², which is positive for either direction of current', ['The current is never really negative', 'Only the positive half cycles heat the resistor', 'The heating depends on the mean current'], 'P = I²R ≥ 0 at every instant.', ['C1: P ∝ I²', 'C1: always positive'])
N('M', 3, 'An a.c. supply has an r.m.s. voltage of 12 V and drives an r.m.s. current of 0.50 A through a resistor. Calculate the peak power.', 2 * 12 * 0.50, 'W',
  'Mean power = 12 × 0.50 = 6.0 W. Peak power = 2 × 6.0 = 12 W', ['C1: P = V_rms I_rms', 'C1: peak = 2 × mean'], sig=2, aq='P₀')
N('M', 3, 'A 50 V r.m.s. supply drives a sinusoidal current of peak 1.5 A through a resistor. Calculate its resistance.', 50 / (1.5 / R2), 'Ω',
  f'I_rms = 1.5 ÷ √2 = {sf(1.5 / R2)} A. R = 50 ÷ {sf(1.5 / R2, 4)} = {sf(50 / (1.5 / R2))} Ω', ['C1: I_rms', 'C1: R = V_rms/I_rms'], aq='R')
M('M', 4, 'Which describes a graph of I² against time for a sinusoidal current of peak I₀?', 'It oscillates between 0 and I₀² at twice the supply frequency, with a mean of I₀²/2', ['It is a sine curve between −I₀² and +I₀²', 'It is constant at I₀²', 'It oscillates between 0 and I₀² at the supply frequency with mean I₀²'], 'sin² ωt = ½(1 − cos 2ωt).', ['C1: always positive', 'C1: double frequency', 'C1: mean I₀²/2'])
N('M', 3, 'A resistor is connected to a sinusoidal supply of peak 10 V and then to a 6.0 V d.c. supply. Calculate (mean a.c. power) ÷ (d.c. power).', (10 / R2) ** 2 / 6.0 ** 2, None,
  f'P ∝ V²: ratio = (10 ÷ √2)² ÷ 6.0² = 50 ÷ 36 = {sf(50 / 36)}', ['C1: V_rms = 7.07 V', 'C1: ratio of squares'], aq='ratio')
N('M', 3, 'How many times per second does the direction of a 50 Hz alternating current reverse?', 2 * 50, None,
  'The current reverses twice in each cycle: 2 × 50 = 100 times per second', ['C1: two reversals per cycle', 'C1: value'], sig=2, aq='reversals')
M('M', 3, 'A voltmeter connected to the mains reads 230 V. What does this reading represent?', 'The r.m.s. voltage', ['The peak voltage', 'The peak-to-peak voltage', 'The mean voltage'], 'a.c. meters are calibrated to read r.m.s. values.', ['C1: meters read r.m.s.', 'C1: peak is 325 V'])
# hard
N('H', 5, 'A sinusoidal current of peak 3.0 A flows through an 8.0 Ω resistor. (a) Calculate the maximum instantaneous power. (b) Calculate the mean power. (c) Calculate the r.m.s. current. Give only the answer to (b).', 0.5 * 3.0 ** 2 * 8.0, 'W',
  f'(a) P₀ = I₀²R = 3.0² × 8.0 = 72 W. (b) Mean P = 0.5 × 72 = 36 W. (c) I_rms = 3.0 ÷ √2 = {sf(3 / R2)} A; check I_rms²R = 36 W.',
  ['C1: P₀ = I₀²R', 'M1: mean = ½P₀', 'C1: value', 'C1: I_rms'], sig=2, aq='P')
N('H', 6, 'A voltage is +6.0 V for 2.0 ms and −2.0 V for the next 2.0 ms, repeating. (a) Calculate the mean voltage. (b) Calculate the mean of V². (c) Calculate the r.m.s. voltage. (d) Calculate the mean power it delivers to a 10 Ω resistor. Give only the answer to (c).', sqrt((6.0 ** 2 + 2.0 ** 2) / 2), 'V',
  f'(a) Mean = (6.0 − 2.0) ÷ 2 = 2.0 V. (b) Mean of V² = (6.0² + 2.0²) ÷ 2 = 20 V². (c) V_rms = √20 = {sf(sqrt(20))} V. (d) P = V_rms²/R = 20 ÷ 10 = 2.0 W',
  ['C1: mean', 'C1: mean of squares', 'C1: square root', 'C1: P = V_rms²/R', 'B1: r.m.s. ≠ mean'], aq='V_rms')
N('H', 5, 'A 2.8 kW kettle runs on a 230 V r.m.s. supply. (a) Calculate the r.m.s. current. (b) Calculate the peak current. (c) Explain why a 13 A fuse is suitable even though the peak current is larger than 13 A. Give only the answer to (b).', 2800 / 230 * R2, 'A',
  f'(a) I_rms = 2800 ÷ 230 = {sf(2800 / 230)} A. (b) I₀ = √2 × {sf(2800 / 230, 4)} = {sf(2800 / 230 * R2)} A. (c) Fuses respond to heating, which depends on the r.m.s. current, 12.2 A, below 13 A.',
  ['C1: I = P/V', 'C1: × √2', 'C1: value', 'B1: heating depends on r.m.s.'], aq='I₀')
N('H', 6, 'An oscilloscope shows a sinusoidal trace. The Y-gain is 5.0 V per division and the peak is 3.4 divisions above the centre line. The time-base is 2.0 ms per division and one cycle spans 5.0 divisions. (a) Calculate the peak voltage. (b) Calculate the r.m.s. voltage. (c) Calculate the frequency. Give only the answer to (b).', 3.4 * 5.0 / R2, 'V',
  f'(a) V₀ = 3.4 × 5.0 = 17 V. (b) V_rms = 17 ÷ √2 = {sf(17 / R2)} V. (c) T = 5.0 × 2.0 = 10 ms, so f = 1 ÷ 0.010 = 100 Hz',
  ['C1: divisions × Y-gain', 'C1: V_rms', 'C1: period from time-base', 'C1: f = 1/T', 'B1: reading taken from centre line'], aq='V_rms')
N('H', 5, 'A heating element is rated at 2.0 kW on a 230 V r.m.s. supply. (a) State the power on a 230 V d.c. supply. (b) Calculate the power on a sinusoidal supply of peak value 230 V. Give only the answer to (b), in kW.', 2.0 / 2, 'kW',
  '(a) 2.0 kW: 230 V r.m.s. has the same heating effect as 230 V d.c. (b) V_rms = 230 ÷ √2, so P ∝ V² is halved: P = 2.0 ÷ 2 = 1.0 kW',
  ['B1: r.m.s. equals d.c. equivalent', 'M1: P ∝ V_rms²', 'C1: factor ½', 'C1: value'], sig=2, aq='P')
N('H', 5, 'A 3.0 kW heater runs for 4.0 hours a day for 30 days. (a) Calculate the energy used, in kW h. (b) Calculate the energy in joules. Give only the answer to (b).', 3.0e3 * 4.0 * 3600 * 30, 'J',
  '(a) E = 3.0 × 4.0 × 30 = 360 kW h. (b) E = 3.0 × 10³ × 4.0 × 3600 × 30 = 1.296 × 10⁹ J',
  ['C1: kW h', 'C1: hours to seconds', 'C1: value', 'B1: 1 kW h = 3.6 MJ'], aq='E')
N('H', 5, 'A half-wave rectified sinusoidal voltage of peak V₀ has an r.m.s. value of V₀/2. (a) Explain why this is less than V₀/√2. (b) Calculate the mean power it delivers to a 50 Ω resistor when V₀ = 20 V. Give only the answer to (b).', (20 / 2) ** 2 / 50, 'W',
  '(a) One half of every cycle is missing, so the mean of V² is halved. (b) V_rms = 20 ÷ 2 = 10 V; P = 10² ÷ 50 = 2.0 W',
  ['B1: half the cycles removed', 'C1: V_rms = 10 V', 'M1: P = V_rms²/R', 'C1: value'], sig=2, aq='P')
N('H', 6, 'The current in a resistor is I = 4.0 sin(100πt), with I in A and t in s. (a) State the peak current and the frequency. (b) Calculate the r.m.s. current. (c) Calculate the mean power in a 5.0 Ω resistor. (d) Calculate the current at t = 2.5 ms. Give only the answer to (d).', 4.0 * sin(100 * pi * 2.5e-3), 'A',
  f'(a) I₀ = 4.0 A; ω = 100π, so f = 50 Hz. (b) I_rms = 4.0 ÷ √2 = {sf(4 / R2)} A. (c) P = ½ × 4.0² × 5.0 = 40 W. (d) ωt = 100π × 2.5 × 10⁻³ = π/4 rad, which is 45°: I = 4.0 × sin 45° = {sf(4 * sin(radians(45)))} A',
  ['C1: I₀ and f', 'C1: I_rms', 'C1: mean power', 'M1: ωt in degrees', 'C1: instantaneous value'], aq='I')
N('H', 5, 'The UK mains is 230 V r.m.s. and the North American mains is 120 V r.m.s. (a) Calculate both peak voltages. (b) Calculate (power in a resistor on UK mains) ÷ (power in the same resistor on North American mains). Give only the answer to (b).', (230 / 120) ** 2, None,
  f'(a) 230 × √2 = {sf(230 * R2)} V and 120 × √2 = {sf(120 * R2)} V. (b) P ∝ V_rms²: ratio = (230 ÷ 120)² = {sf((230 / 120) ** 2)}',
  ['C1: peak values', 'M1: P ∝ V²', 'C1: ratio', 'B1: r.m.s. values used'], aq='ratio')
N('H', 5, '(a) Show that the mean power delivered to a resistor by a sinusoidal supply is ½V₀I₀. (b) Calculate the mean power when V₀ = 170 V and I₀ = 2.0 A. Give only the answer to (b).', 0.5 * 170 * 2.0, 'W',
  '(a) P = V_rms I_rms = (V₀/√2)(I₀/√2) = ½V₀I₀. (b) P = 0.5 × 170 × 2.0 = 170 W',
  ['M1: use r.m.s. values', 'B1: ½V₀I₀ shown', 'C1: substitution', 'C1: value'], aq='P')
N('H', 6, 'A current of 3.0 A flows for 0.010 s and is then zero for 0.030 s, repeating. (a) Calculate the fraction of each cycle for which the current flows. (b) Calculate the r.m.s. current. (c) Calculate the mean power in a 20 Ω resistor. Give only the answer to (b).', 3.0 * sqrt(0.010 / 0.040), 'A',
  '(a) 0.010 ÷ 0.040 = 0.25. (b) Mean of I² = 0.25 × 3.0² = 2.25 A², so I_rms = √2.25 = 1.5 A. (c) P = 2.25 × 20 = 45 W',
  ['C1: fraction', 'C1: mean of I²', 'C1: square root', 'C1: P = I_rms²R', 'B1: r.m.s. not mean'], sig=2, aq='I_rms')

# ═════════════════════════ 27.2 Alternating voltages (16/16/12) ═════════════════════════
lesson('27.2')
N('E', 2, 'Calculate the angular frequency of a 50 Hz supply.', 2 * pi * 50, 'rad s⁻¹',
  f'ω = 2πf = 2π × 50 = {sf(2 * pi * 50)} rad s⁻¹', ['C1: ω = 2πf'], aq='ω')
M('E', 1, 'In the equation V = V₀ sin ωt, what does V₀ represent?', 'The peak voltage', ['The r.m.s. voltage', 'The peak-to-peak voltage', 'The voltage at t = 0'], 'V₀ is the largest value reached in each cycle.')
N('E', 2, 'An alternating voltage has ω = 100π rad s⁻¹. Calculate its period.', 2 * pi / (100 * pi), 's',
  'T = 2π/ω = 2π ÷ 100π = 0.020 s', ['C1: T = 2π/ω'], sig=2, aq='T')
N('E', 2, 'An oscilloscope trace has a peak 2.5 divisions above the centre line, with the Y-gain at 2.0 V per division. Calculate the peak voltage.', 2.5 * 2.0, 'V',
  'V₀ = 2.5 × 2.0 = 5.0 V', ['C1: divisions × Y-gain'], sig=2, aq='V₀')
M('E', 1, 'What does the time-base control of an oscilloscope set?', 'The time represented by each horizontal division', ['The voltage represented by each vertical division', 'The brightness of the trace', 'The frequency of the signal'], 'It sets how fast the spot sweeps across the screen.')
N('E', 2, 'One cycle of a trace spans 4.0 divisions with the time-base at 5.0 ms per division. Calculate the frequency.', 1 / (4.0 * 5.0e-3), 'Hz',
  'T = 4.0 × 5.0 = 20 ms. f = 1 ÷ 0.020 = 50 Hz', ['C1: T from divisions'], sig=2, aq='f')
M('E', 1, 'What is the peak-to-peak voltage of a sinusoidal supply of peak V₀?', '2V₀', ['V₀', 'V₀/√2', '√2 V₀'], 'It is measured from the top of a crest to the bottom of a trough.')
N('E', 2, 'For V = 12 sin ωt (in volts), calculate V when ωt = 30°.', 12 * sin(radians(30)), 'V',
  'V = 12 × sin 30° = 6.0 V', ['C1: substitution'], sig=2, aq='V')
M('E', 1, 'For V = V₀ sin ωt, what is the voltage a quarter of a period after t = 0?', 'V₀', ['0', '−V₀', 'V₀/√2'], 'ωt = π/2 at t = T/4, and sin 90° = 1.')
N('E', 2, 'An oscilloscope shows a peak of 3.0 divisions with the Y-gain at 5.0 V per division. Calculate the r.m.s. voltage.', 3.0 * 5.0 / R2, 'V',
  f'V₀ = 3.0 × 5.0 = 15 V. V_rms = 15 ÷ √2 = {sf(15 / R2)} V', ['C1: V₀ then ÷ √2'], aq='V_rms')
M('E', 1, 'The frequency of a signal is doubled while the time-base setting is unchanged. What happens to the trace?', 'Twice as many cycles appear across the screen', ['Half as many cycles appear', 'The trace becomes twice as tall', 'The trace does not change'], 'Each cycle takes half as long, so it occupies half as many divisions.')
N('E', 2, 'An alternating voltage is V = 325 sin(314t). Calculate its frequency.', 314 / (2 * pi), 'Hz',
  f'f = ω/2π = 314 ÷ 2π = {sf(314 / (2 * pi))} Hz', ['C1: f = ω/2π'], aq='f')
M('E', 1, 'The Y-gain of an oscilloscope is changed from 5 V per division to 2 V per division. What happens to the trace?', 'It becomes taller', ['It becomes shorter', 'It becomes wider', 'It does not change'], 'Each volt now occupies more of the screen vertically.')
N('E', 1, 'A sinusoidal voltage has a peak of 9.0 V. What is its peak-to-peak value?', 18, 'V', 'V_pp = 2 × 9.0 = 18 V', [], sig=2, aq='V_pp')
M('E', 1, 'Which statement about a sinusoidal alternating voltage is correct?', 'The positive and negative half cycles have the same shape and size', ['The positive half is always larger', 'It is zero for half of each cycle', 'Its mean value is V₀/√2'], 'A sine wave is symmetrical about the time axis.')
N('E', 2, 'An oscilloscope screen is 10 divisions wide, with the time-base at 2.0 ms per division. A 200 Hz signal is displayed. How many complete cycles appear?', 10 * 2.0e-3 * 200, None,
  'Screen time = 10 × 2.0 = 20 ms. Cycles = 0.020 × 200 = 4.0', ['C1: total time × f'], sig=2, aq='cycles')
# medium
N('M', 3, 'A sinusoidal voltage of peak 20 V and frequency 50 Hz is zero at t = 0 and rising. Calculate the voltage at t = 3.0 ms.', 20 * sin(2 * pi * 50 * 3.0e-3), 'V',
  f'ωt = 2π × 50 × 3.0 × 10⁻³ = 0.942 rad, which is {sf(degrees(2 * pi * 50 * 3e-3))}°. V = 20 × sin {sf(degrees(2 * pi * 50 * 3e-3))}° = {sf(20 * sin(2 * pi * 50 * 3e-3))} V', ['C1: ωt', 'C1: V = V₀ sin ωt'], aq='V')
N('M', 3, 'A 50 Hz sinusoidal voltage starts at zero and rises. Calculate the time it takes to first reach half its peak value, in ms.', 1 / (12 * 50) * 1000, 'ms',
  f'sin ωt = 0.50 gives ωt = 30°, which is one twelfth of a cycle. t = T/12 = 0.020 ÷ 12 = {sf(0.02 / 12)} s. In ms: {sf(0.02 / 12, 4)} × 1000 = {sf(0.02 / 12 * 1000)}', ['C1: ωt = 30°', 'C1: fraction of period'], aq='t')
M('M', 3, 'Two sinusoidal signals of the same frequency are displayed together. One reaches its peak a quarter of a period after the other. What is their phase difference?', '90°', ['45°', '180°', '360°'], 'A full period is 360°, so a quarter period is 90°.', ['C1: fraction of period', 'C1: × 360°'])
N('M', 4, 'A trace has a peak-to-peak height of 6.4 divisions with the Y-gain at 0.50 V per division. Calculate the r.m.s. voltage.', 6.4 * 0.50 / 2 / R2, 'V',
  f'V_pp = 6.4 × 0.50 = 3.2 V. V₀ = 1.6 V. V_rms = 1.6 ÷ √2 = {sf(1.6 / R2)} V', ['C1: V_pp', 'C1: V₀ = V_pp/2', 'C1: ÷ √2'], aq='V_rms')
N('M', 3, 'A 12 V r.m.s. sinusoidal supply is to be displayed on an oscilloscope. Calculate its peak-to-peak voltage, which must fit on the screen.', 2 * 12 * R2, 'V',
  f'V_pp = 2√2 × V_rms = 2 × √2 × 12 = {sf(24 * R2)} V', ['C1: V₀ = √2 V_rms', 'C1: × 2'], aq='V_pp')
M('M', 3, 'For a sinusoidal supply connected across a resistor, what is the phase difference between the current and the voltage?', 'Zero: they reach their peaks together', ['90°', '180°', '45°'], 'I = V/R at every instant.', ['C1: I ∝ V', 'C1: in phase'])
N('M', 3, 'What is the frequency of a signal described by V = 5.0 sin(2000t), with t in seconds?', 2000 / (2 * pi), 'Hz',
  f'f = ω/2π = 2000 ÷ 2π = {sf(2000 / (2 * pi))} Hz', ['C1: ω = 2000 rad s⁻¹', 'C1: f = ω/2π'], aq='f')
N('M', 3, 'Calculate the time between successive peaks of a 60 Hz supply, in ms.', 1 / 60 * 1000, 'ms',
  f'T = 1/f = 1 ÷ 60 = {sf(1 / 60)} s. In ms: {sf(1 / 60, 4)} × 1000 = {sf(1000 / 60)}', ['C1: T = 1/f', 'C1: conversion'], aq='T')
M('M', 3, 'The time-base of an oscilloscope is changed from 5 ms per division to 2 ms per division. What happens to a steady sinusoidal trace?', 'Each cycle spreads over more divisions, so fewer cycles are visible', ['More cycles are visible', 'The trace becomes taller', 'The trace becomes a straight line'], 'Each division now represents less time.', ['C1: less time per division', 'C1: cycles spread out'])
N('M', 3, 'In V = V₀ sin ωt, V₀ = 24 V. Find V one twelfth of a period after it crosses zero going upwards.', 24 * sin(radians(30)), 'V',
  'One twelfth of a period corresponds to ωt = 30°. V = 24 × sin 30° = 12 V', ['C1: ωt = 360° ÷ 12', 'C1: substitution'], sig=2, aq='V')
N('M', 3, 'On an oscilloscope set to 2.0 V per division, a sine wave measures 8.4 divisions from crest to trough. Find its r.m.s. value.', 8.4 * 2.0 / 2 / R2, 'V',
  f'V₀ = 8.4 × 2.0 ÷ 2 = 8.4 V. V_rms = 8.4 ÷ √2 = {sf(8.4 / R2)} V', ['C1: V₀', 'C1: ÷ √2'], aq='V_rms')
M('M', 4, 'Which equation describes a 50 Hz sinusoidal supply with an r.m.s. value of 230 V?', 'V = 325 sin(314t)', ['V = 230 sin(314t)', 'V = 325 sin(50t)', 'V = 230 sin(50t)'], 'V₀ = 230√2 = 325 V and ω = 2π × 50 = 314 rad s⁻¹.', ['C1: V₀ = √2 × 230', 'C1: ω = 2πf', 'C1: correct form'])
N('M', 3, 'For a sinusoidal voltage, calculate (instantaneous value) ÷ (peak value) when ωt = 60°.', sin(radians(60)), None,
  f'V/V₀ = sin 60° = {sf(sin(radians(60)))}', ['C1: V/V₀ = sin ωt', 'C1: value'], aq='ratio')
N('M', 3, 'Twelve complete cycles of a signal take 0.20 s. Calculate its frequency.', 12 / 0.20, 'Hz',
  'f = 12 ÷ 0.20 = 60 Hz', ['C1: cycles per second', 'C1: value'], sig=2, aq='f')
M('M', 3, 'An alternating voltage is connected to an oscilloscope with the time-base switched off. What appears on the screen?', 'A vertical line whose length is the peak-to-peak voltage', ['A horizontal line', 'A single dot at the centre', 'A sine wave'], 'With no horizontal sweep, the spot moves only up and down.', ['C1: no horizontal sweep', 'C1: line of length 2V₀'])
N('M', 4, 'For V = 15 sin(100πt), with V in volts and t in seconds, calculate the time at which V first reaches 10 V, in ms.', asin(10 / 15) / (100 * pi) * 1000, 'ms',
  f'sin(100πt) = 10 ÷ 15, so 100πt = sin⁻¹ 0.6667 = {sf(degrees(asin(10 / 15)))}°, which is {sf(asin(10 / 15))} rad. t = {sf(asin(10 / 15), 4)} ÷ (100π) = {sf(asin(10 / 15) / (100 * pi))} s. In ms: {sf(asin(10 / 15) / (100 * pi), 4)} × 1000 = {sf(asin(10 / 15) / (100 * pi) * 1000)}', ['C1: sin⁻¹', 'M1: angle in radians', 'C1: t'], aq='t')
# hard
N('H', 6, 'An oscilloscope with a Y-gain of 2.0 V per division and a time-base of 0.50 ms per division shows a sine wave with a peak-to-peak height of 7.0 divisions and 4.0 divisions per cycle. (a) Calculate the peak voltage. (b) Calculate the r.m.s. voltage. (c) Calculate the frequency. (d) Write the equation for the voltage in the form V = V₀ sin ωt. Give only the answer to (c).', 1 / (4.0 * 0.50e-3), 'Hz',
  f'(a) V₀ = 7.0 × 2.0 ÷ 2 = 7.0 V. (b) V_rms = 7.0 ÷ √2 = {sf(7 / R2)} V. (c) T = 4.0 × 0.50 = 2.0 ms, so f = 1 ÷ 2.0 × 10⁻³ = 500 Hz. (d) ω = 2π × 500 = {sf(2 * pi * 500)} rad s⁻¹, so V = 7.0 sin({sf(2 * pi * 500)}t).',
  ['C1: V₀', 'C1: V_rms', 'C1: T', 'C1: f', 'B1: equation with ω'], sig=2, aq='f')
N('H', 5, 'A voltage is V = 340 sin(100πt), in volts. (a) State the peak voltage and frequency. (b) Calculate V at t = 7.5 ms. (c) Explain the sign of your answer. Give only the answer to (b).', 340 * sin(100 * pi * 7.5e-3), 'V',
  f'(a) 340 V and 50 Hz. (b) ωt = 100π × 7.5 × 10⁻³ = 2.36 rad, which is 135°: V = 340 × sin 135° = {sf(340 * sin(radians(135)))} V. (c) It is positive: 7.5 ms is still in the first half cycle (which lasts 10 ms), after the peak.',
  ['C1: V₀ and f', 'M1: ωt in degrees', 'C1: value', 'B1: within first half cycle'], aq='V')
N('H', 6, 'For a 50 Hz sinusoidal supply, (a) find the phase angles in the first half cycle at which |V| = 0.50V₀. (b) Hence find the fraction of each cycle for which |V| > 0.50V₀. (c) Calculate the total time per cycle for which |V| > 0.50V₀, in ms. Give only the answer to (c).', 2 / 3 * 0.020 * 1000, 'ms',
  '(a) sin θ = 0.50 at 30° and 150°. (b) |V| > 0.50V₀ from 30° to 150° in each half: 120° of every 180°, a fraction 120 ÷ 180 = 0.667. (c) Time = 0.6667 × 20 = 13.3 ms per 20 ms cycle',
  ['C1: 30° and 150°', 'M1: same in negative half', 'C1: fraction', 'C1: × period', 'B1: period 20 ms'], aq='t')
N('H', 5, 'A dual-trace oscilloscope shows two sine waves of the same frequency, each cycle spanning 4.0 divisions. The peaks of one trace are 1.0 division to the right of the peaks of the other. (a) Calculate the phase difference in degrees. (b) State which trace leads. Give only the answer to (a).', 1.0 / 4.0 * 360, '°',
  '(a) Phase difference = 1.0 ÷ 4.0 × 360° = 90°. (b) The trace whose peaks occur first (to the left) leads by 90°.',
  ['C1: fraction of cycle', 'C1: × 360°', 'C1: value', 'B1: earlier trace leads'], sig=2, aq='φ')
N('H', 6, 'A neon lamp lights only when the p.d. across it is more than 200 V. It is connected to the 230 V r.m.s. mains. (a) Calculate the peak mains voltage. (b) Calculate the phase angle at which the lamp first lights in each half cycle. (c) Calculate the fraction of the time for which the lamp is lit. Give only the answer to (c).', (180 - 2 * degrees(asin(200 / (230 * R2)))) / 180, None,
  f'(a) V₀ = 230 × √2 = {sf(230 * R2)} V. (b) sin θ = 200 ÷ {sf(230 * R2, 4)} = {sf(200 / (230 * R2), 4)}, so θ = sin⁻¹ {sf(200 / (230 * R2), 4)} = {sf(degrees(asin(200 / (230 * R2))))}°. (c) It is lit from θ to 180° − θ in each half: fraction = (180 − 2 × {sf(degrees(asin(200 / (230 * R2))), 4)}) ÷ 180 = {sf((180 - 2 * degrees(asin(200 / (230 * R2)))) / 180)}',
  ['C1: V₀', 'C1: sin⁻¹', 'M1: symmetric in each half', 'C1: fraction', 'B1: same for negative half'], aq='fraction')
N('H', 5, 'One cycle of a trace spans 3.5 ± 0.1 divisions with the time-base at 1.0 ms per division. (a) Calculate the frequency. (b) Calculate its percentage uncertainty. Give only the answer to (a).', 1 / 3.5e-3, 'Hz',
  f'(a) T = 3.5 ms, so f = 1 ÷ 3.5 × 10⁻³ = {sf(1 / 3.5e-3)} Hz. (b) Percentage uncertainty = 0.1 ÷ 3.5 × 100 = {sf(0.1 / 3.5 * 100)} %',
  ['C1: T from trace', 'C1: f = 1/T', 'C1: percentage', 'B1: f and T have equal percentage uncertainty'], aq='f')
N('H', 6, 'A signal is V = 3.0 + 4.0 sin ωt, in volts: a steady 3.0 V plus a sinusoidal part of peak 4.0 V. (a) State the maximum and minimum values of V. (b) Use V_rms² = (d.c. part)² + (sinusoidal peak)²/2 to calculate the r.m.s. value. (c) Calculate the mean power it delivers to a 17 Ω resistor. Give only the answer to (b).', sqrt(3.0 ** 2 + 4.0 ** 2 / 2), 'V',
  f'(a) Maximum 7.0 V, minimum −1.0 V. (b) V_rms² = 3.0² + 4.0² ÷ 2 = 17 V², so V_rms = √17 = {sf(sqrt(17))} V. (c) P = 17 ÷ 17 = 1.0 W',
  ['C1: max and min', 'C1: V_rms²', 'C1: square root', 'C1: P = V_rms²/R', 'B1: d.c. and a.c. parts add in quadrature'], aq='V_rms')
N('H', 5, 'A generator\'s e.m.f. is E = 7.85 sin(157t), in volts. (a) Calculate its frequency. (b) Calculate the e.m.f. at t = 4.0 ms. Give only the answer to (b).', 7.85 * sin(157 * 4.0e-3), 'V',
  f'(a) f = 157 ÷ 2π = {sf(157 / (2 * pi))} Hz. (b) ωt = 157 × 4.0 × 10⁻³ = 0.628 rad, which is {sf(degrees(0.628))}°: E = 7.85 × sin {sf(degrees(0.628))}° = {sf(7.85 * sin(0.628))} V',
  ['C1: f = ω/2π', 'C1: ωt', 'M1: in degrees', 'C1: value'], aq='E')
N('H', 6, 'A 10 Ω and a 30 Ω resistor in series are connected to a 12 V r.m.s. sinusoidal supply. An oscilloscope is connected across the 30 Ω resistor. (a) Calculate the r.m.s. p.d. across the 30 Ω resistor. (b) Calculate the peak p.d. across it. (c) Calculate the peak-to-peak p.d. shown on the oscilloscope. Give only the answer to (c).', 2 * 12 * 30 / 40 * R2, 'V',
  f'(a) V = 12 × 30 ÷ 40 = 9.0 V. (b) V₀ = 9.0 × √2 = {sf(9 * R2)} V. (c) V_pp = 2 × {sf(9 * R2, 4)} = {sf(18 * R2)} V',
  ['C1: potential divider', 'C1: × √2', 'C1: × 2', 'B1: r.m.s. values divide like d.c.', 'C1: value'], aq='V_pp')
N('H', 5, 'Aircraft electrical systems use a 400 Hz supply. (a) Calculate the period. (b) Calculate the time taken for the voltage to rise from zero to its peak, in ms. Give only the answer to (b).', 1 / 400 / 4 * 1000, 'ms',
  '(a) T = 1 ÷ 400 = 2.5 × 10⁻³ s. (b) Zero to peak is a quarter cycle: 2.5 × 10⁻³ ÷ 4 = 6.25 × 10⁻⁴ s. In ms: 6.25 × 10⁻⁴ × 1000 = 0.625',
  ['C1: T = 1/f', 'B1: quarter of a cycle', 'C1: value', 'C1: conversion'], aq='t')
N('H', 6, 'Two sinusoidal supplies of the same frequency, each of peak 10 V, are connected in series. (a) State the peak of their sum when they are in phase. (b) State it when they are 180° out of phase. (c) For a 90° phase difference, the peak of the sum is √(10² + 10²). Calculate it. Give only the answer to (c).', sqrt(10 ** 2 + 10 ** 2), 'V',
  f'(a) 20 V. (b) Zero: they cancel at every instant. (c) √(10² + 10²) = {sf(sqrt(200))} V',
  ['B1: in phase add', 'B1: antiphase cancel', 'C1: substitution', 'C1: value', 'M1: peaks not simultaneous for 90°'], aq='V₀')
N('H', 5, 'The 230 V r.m.s. mains is displayed on an oscilloscope through a probe that divides the voltage by 10, with the Y-gain at 10 V per division. (a) Calculate the peak-to-peak mains voltage. (b) Calculate the peak-to-peak height of the trace in divisions. Give only the answer to (b).', 2 * 230 * R2 / 10 / 10, None,
  f'(a) V_pp = 2 × 230 × √2 = {sf(460 * R2)} V. (b) After the probe: {sf(460 * R2, 4)} ÷ 10 = {sf(46 * R2)} V, so height = {sf(46 * R2, 4)} ÷ 10 = {sf(4.6 * R2)} divisions',
  ['C1: V_pp', 'C1: ÷ probe factor', 'C1: ÷ Y-gain', 'B1: fits on screen'], aq='divisions')

# ═════════════════════════ 27.3 Power and alternating current (17/17/10) ═════════════════════════
lesson('27.3')
N('E', 2, 'A lamp on a 120 V r.m.s. supply carries an r.m.s. current of 0.50 A. Calculate its mean power.', 120 * 0.50, 'W',
  'P = V_rms I_rms = 120 × 0.50 = 60 W', ['C1: P = V_rms I_rms'], sig=2, aq='P')
M('E', 1, 'For a resistor on a sinusoidal supply, how is the mean power related to the peak power?', 'Mean power = ½ × peak power', ['Mean power = peak power', 'Mean power = 2 × peak power', 'Mean power = peak power ÷ √2'], 'P = P₀ sin² ωt has a mean of P₀/2.')
N('E', 2, 'A resistor dissipates a mean power of 100 W on a sinusoidal supply. What is the peak power?', 200, 'W', 'P₀ = 2 × 100 = 200 W', ['C1: peak = 2 × mean'], sig=2, aq='P₀')
N('E', 2, 'A 60 W lamp runs on a 230 V r.m.s. supply. Calculate the r.m.s. current.', 60 / 230, 'A',
  f'I = P/V = 60 ÷ 230 = {sf(60 / 230)} A', ['C1: I = P/V'], aq='I')
M('E', 1, 'Which expression gives the mean power in a resistor R on a supply of r.m.s. voltage V_rms?', 'V_rms²/R', ['V₀²/R', 'V_rms/R', 'V_rms²R'], 'Using r.m.s. values, a.c. power formulas look like d.c. ones.')
N('E', 2, 'A 2.0 kW heater runs on a 230 V r.m.s. supply. Calculate its resistance.', 230 ** 2 / 2000, 'Ω',
  f'R = V²/P = 230² ÷ 2000 = {sf(230 ** 2 / 2000)} Ω', ['C1: R = V_rms²/P'], aq='R')
M('E', 1, 'Can the instantaneous power dissipated in a resistor on an a.c. supply be negative?', 'No: P = I²R is never negative', ['Yes, during the negative half cycle', 'Yes, at the peak of each cycle', 'Only when the frequency is high'], 'Energy is always transferred to the resistor.')
N('E', 2, 'A 2.0 kW heater runs for 1.5 hours. Calculate the energy used, in kW h.', 2.0 * 1.5, 'kW h',
  'E = Pt in kW and hours: 2.0 × 1.5 = 3.0 kW h', ['C1: E = Pt in kW and h'], sig=2, aq='E')
M('E', 1, 'Why are mains voltages and currents usually quoted as r.m.s. values?', 'Because r.m.s. values give the same heating effect as equal d.c. values, so power calculations are simple', ['Because they are the largest values', 'Because they are the peak values', 'Because the mean values are always zero'], 'P = V_rms I_rms, just like P = VI for d.c.')
N('E', 2, 'A sinusoidal current of peak 4.0 A flows in a 5.0 Ω resistor. Calculate the mean power.', 0.5 * 4.0 ** 2 * 5.0, 'W',
  'P = ½I₀²R = 0.5 × 4.0² × 5.0 = 40 W', ['C1: ½I₀²R'], sig=2, aq='P')
M('E', 1, 'The r.m.s. voltage across a resistor is doubled. What happens to the mean power?', 'It quadruples', ['It doubles', 'It halves', 'It stays the same'], 'P = V_rms²/R, so doubling V_rms makes the power four times larger.')
N('E', 2, 'How many joules does a 500 W food mixer use in a 10-minute run?', 500 * 600, 'J',
  'E = Pt = 500 × 600 = 3.0 × 10⁵ J', ['C1: t in seconds'], sig=2, aq='E')
M('E', 1, 'What is the peak power dissipated in a resistor carrying a sinusoidal current of peak I₀ at peak voltage V₀?', 'V₀I₀', ['½V₀I₀', 'V₀I₀/√2', '2V₀I₀'], 'At the peak of the cycle, P = V₀I₀.')
N('E', 1, 'A resistor is moved from a 115 V r.m.s. supply to a 230 V r.m.s. supply. By what factor does its mean power increase?', (230 / 115) ** 2, None, 'P ∝ V²: (230 ÷ 115)² = 4.0', [], sig=2, aq='factor')
M('E', 1, 'A fuse is chosen for an appliance on an a.c. supply. Which current is used to choose it?', 'The r.m.s. current', ['The peak current', 'The mean current', 'The peak-to-peak current'], 'A fuse melts because of heating, which depends on I_rms.')
N('E', 2, 'Calculate the r.m.s. voltage needed to give a mean power of 100 W in a 25 Ω resistor.', sqrt(100 * 25), 'V',
  'V_rms = √(PR) = √(100 × 25) = 50 V', ['C1: rearranged'], sig=2, aq='V_rms')
M('E', 1, 'For a resistor on a 50 Hz sinusoidal supply, how does the instantaneous power vary?', 'It rises and falls between zero and a maximum 100 times each second', ['It is constant', 'It reverses direction 100 times a second', 'It varies at 50 Hz between −P₀ and +P₀'], 'P ∝ sin² ωt, which has twice the supply frequency.')
# medium
N('M', 3, 'A 3.0 kW kettle runs on a 230 V r.m.s. supply. Calculate the peak current.', 3000 / 230 * R2, 'A',
  f'I_rms = 3000 ÷ 230 = {sf(3000 / 230)} A. I₀ = √2 × {sf(3000 / 230, 4)} = {sf(3000 / 230 * R2)} A', ['C1: I_rms = P/V', 'C1: × √2'], aq='I₀')
N('M', 3, 'A 2.5 kW oven is used for 3.0 hours. Calculate the energy used, in kW h.', 2.5 * 3.0, 'kW h',
  'E = Pt = 2.5 × 3.0 = 7.5 kW h', ['C1: kW × h', 'C1: value'], sig=2, aq='E')
N('M', 3, 'A resistor is connected to a 50 Hz sinusoidal supply. Calculate the frequency at which the instantaneous power oscillates.', 100, 'Hz',
  'P ∝ sin² ωt = ½(1 − cos 2ωt): frequency = 2 × 50 = 100 Hz', ['M1: sin² doubles frequency', 'C1: value'], sig=2, aq='f')
N('M', 4, 'A 12 V, 24 W lamp (rated for 12 V d.c.) is connected to a sinusoidal supply of peak 12 V. Assuming its resistance is constant, calculate its mean power.', (12 / R2) ** 2 / (12 ** 2 / 24), 'W',
  'R = 12² ÷ 24 = 6.0 Ω. V_rms = 12 ÷ √2, so P = (12 ÷ √2)² ÷ 6.0 = 72 ÷ 6.0 = 12 W', ['C1: R from rating', 'C1: V_rms', 'C1: P = V_rms²/R'], sig=2, aq='P')
N('M', 3, 'A resistive load has a peak voltage of 340 V across it and a peak current of 1.5 A. Calculate the mean power.', 0.5 * 340 * 1.5, 'W',
  'P = ½V₀I₀ = 0.5 × 340 × 1.5 = 255 W', ['C1: ½V₀I₀', 'C1: value'], aq='P')
M('M', 3, 'A resistor is connected first to a 6.0 V d.c. supply and then to a 6.0 V r.m.s. a.c. supply. How do the mean powers compare?', 'They are equal', ['The d.c. power is twice the a.c. power', 'The a.c. power is twice the d.c. power', 'The a.c. power is √2 times the d.c. power'], 'By definition, the r.m.s. value gives the same heating as the equal d.c. value.', ['C1: definition of r.m.s.', 'C1: equal power'])
N('M', 3, 'On a 115 V r.m.s. supply, what r.m.s. current does a 690 W microwave oven draw?', 690 / 115, 'A',
  'I = P/V = 690 ÷ 115 = 6.0 A', ['C1: I = P/V', 'C1: value'], sig=2, aq='I')
N('M', 4, 'A lamp takes a mean power of 60 W from a 50 Hz supply. Calculate the energy it receives during one cycle.', 60 / 50, 'J',
  'E = P × T = 60 × (1 ÷ 50) = 1.2 J', ['C1: T = 1/f', 'M1: E = P_mean × T', 'C1: value'], sig=2, aq='E')
M('M', 3, 'Both the r.m.s. voltage across a resistor and its resistance are doubled. What happens to the mean power?', 'It doubles', ['It quadruples', 'It stays the same', 'It halves'], 'P = V²/R: (2²)/2 = 2.', ['C1: P = V²/R', 'C1: factor 4 ÷ 2'])
N('M', 3, 'A resistor has a peak p.d. of 17 V across it and a peak current of 0.50 A. Calculate its resistance.', 17 / 0.50, 'Ω',
  'R = V₀/I₀ = 17 ÷ 0.50 = 34 Ω', ['C1: R = V/I with peak or r.m.s. values', 'C1: value'], sig=2, aq='R')
N('M', 3, 'A 40 Ω heater and a 6.0 Ω cable resistance are in series on a 230 V r.m.s. supply. Calculate the mean power in the heater.', (230 / 46) ** 2 * 40, 'W',
  'I = 230 ÷ (40 + 6.0) = 5.0 A. P = I²R = 5.0² × 40 = 1000 W', ['C1: series current', 'C1: P = I²R'], sig=2, aq='P')
M('M', 4, 'Why are cables rated by their maximum r.m.s. current?', 'The heating of the cable depends on the mean of I², which is I_rms²', ['The peak current never exceeds the r.m.s. value', 'The mean current is the largest value', 'Insulation only fails at the mean current'], 'Overheating damages insulation; P = I_rms²R.', ['C1: heating ∝ I²', 'C1: mean of I² = I_rms²', 'C1: insulation limit'])
N('M', 3, 'A 9.0 kW electric shower runs for 8.0 minutes. Calculate the energy used, in MJ.', 9.0e3 * 480 / 1e6, 'MJ',
  'E = 9.0 × 10³ × 480 = 4.32 × 10⁶ J. In MJ: 4.32 × 10⁶ ÷ 10⁶ = 4.32', ['C1: t in s', 'C1: conversion'], aq='E')
N('M', 4, 'An appliance takes a mean power of 2.3 kW from a sinusoidal supply. Calculate the peak power, in kW.', 2 * 2.3, 'kW',
  'P₀ = 2 × P_mean = 2 × 2.3 = 4.6 kW', ['M1: P₀ = I₀V₀ = 2I_rmsV_rms', 'C1: factor 2', 'C1: value'], sig=2, aq='P₀')
M('M', 3, 'How many joules are there in 1 kW h?', '3.6 × 10⁶ J', ['1000 J', '3600 J', '3.6 × 10³ J'], '1 kW h = 1000 W × 3600 s.', ['C1: kW to W', 'C1: h to s'])
N('M', 3, 'A 60 W lamp runs on a 230 V r.m.s. supply. Calculate the largest instantaneous current in it.', 60 / 230 * R2, 'A',
  f'I_rms = 60 ÷ 230 = {sf(60 / 230)} A. I₀ = √2 × {sf(60 / 230, 4)} = {sf(60 / 230 * R2)} A', ['C1: I_rms', 'C1: × √2'], aq='I₀')
N('M', 3, 'A heater gives 1.2 kW on a 230 V r.m.s. supply. Calculate its power, in W, when the supply falls to 207 V r.m.s., assuming constant resistance.', 1200 * (207 / 230) ** 2, 'W',
  f'P ∝ V²: P = 1200 × (207 ÷ 230)² = {sf(1200 * (207 / 230) ** 2)} W', ['C1: P ∝ V²', 'C1: value'], aq='P')
# hard
N('H', 5, 'A 3.0 kW heater runs on a 230 V r.m.s. supply. (a) Calculate the r.m.s. current. (b) Calculate the resistance. (c) Calculate the peak current and the peak power. Give only the answer to (b).', 230 ** 2 / 3000, 'Ω',
  f'(a) I_rms = 3000 ÷ 230 = {sf(3000 / 230)} A. (b) R = V²/P = 230² ÷ 3000 = {sf(230 ** 2 / 3000)} Ω. (c) I₀ = √2 × {sf(3000 / 230, 4)} = {sf(3000 / 230 * R2)} A; P₀ = 2 × 3.0 = 6.0 kW.',
  ['C1: I_rms', 'C1: R', 'C1: I₀', 'C1: P₀ = 2P'], aq='R')
N('H', 5, 'A current of 5.0 A flows through a 20 Ω resistor for 0.30 of each cycle and is zero for the rest. (a) Calculate the mean power. (b) Calculate the r.m.s. current. Give only the answer to (a).', 0.30 * 5.0 ** 2 * 20, 'W',
  f'(a) While on, P = 5.0² × 20 = 500 W; mean = 0.30 × 500 = 150 W. (b) I_rms = √(0.30 × 5.0²) = {sf(sqrt(0.3 * 25))} A; check I_rms² × 20 = 150 W.',
  ['C1: power while on', 'M1: × fraction of time', 'C1: value', 'C1: I_rms'], sig=2, aq='P')
N('H', 6, 'An electric shower draws 40 A r.m.s. from a 230 V r.m.s. supply. The cable has a total resistance of 0.10 Ω. (a) Calculate the power drawn from the supply. (b) Calculate the power wasted in the cable. (c) Calculate this as a percentage of the supply power. (d) Suggest why thick cables are used for showers. Give only the answer to (b).', 40 ** 2 * 0.10, 'W',
  f'(a) P = 230 × 40 = 9200 W. (b) P_cable = 40² × 0.10 = 160 W. (c) 160 ÷ 9200 × 100 = {sf(160 / 9200 * 100)} %. (d) Thick cables have low resistance, so less heating at large currents.',
  ['C1: P = VI', 'C1: I²R', 'C1: percentage', 'B1: low resistance', 'C1: value'], sig=2, aq='P')
N('H', 5, 'A 150 W refrigerator runs for 40 % of the time. (a) Calculate the energy it uses in one day, in kW h. (b) Calculate this in MJ. Give only the answer to (a).', 0.150 * 24 * 0.40, 'kW h',
  f'(a) In kW and hours: E = 0.150 × 24 × 0.40 = {sf(0.15 * 24 * 0.4)} kW h. (b) {sf(0.15 * 24 * 0.4, 4)} × 3.6 = {sf(0.15 * 24 * 0.4 * 3.6)} MJ',
  ['C1: W to kW', 'C1: × 24 h × 0.40', 'C1: value', 'B1: 1 kW h = 3.6 MJ'], aq='E')
N('H', 6, 'A 40 Ω lamp is supplied through a single diode from a 230 V r.m.s. mains supply, so it receives only half of each cycle. (a) Calculate the mean power it would take with no diode. (b) Calculate the mean power with the diode. (c) Explain why the lamp flickers at 50 Hz. Give only the answer to (b).', 230 ** 2 / 40 / 2, 'W',
  f'(a) P = 230² ÷ 40 = {sf(230 ** 2 / 40)} W. (b) Only half the cycles deliver energy: P = {sf(230 ** 2 / 40, 4)} ÷ 2 = {sf(230 ** 2 / 80)} W. (c) It receives one pulse of power per cycle, 50 per second.',
  ['C1: full-wave power', 'M1: half the energy', 'C1: value', 'B1: one pulse per cycle', 'B1: flicker at 50 Hz'], aq='P')
N('H', 5, 'A sinusoidal voltage and a square-wave voltage have the same peak value V₀ and are applied in turn to the same resistor. (a) State the r.m.s. value of each. (b) Calculate (mean power with square wave) ÷ (mean power with sine wave). Give only the answer to (b).', 2.0, None,
  '(a) Square wave: V₀. Sine wave: V₀/√2. (b) P ∝ V_rms²: ratio = V₀² ÷ (V₀²/2) = 2 × 1 = 2.0',
  ['C1: square r.m.s.', 'C1: sine r.m.s.', 'M1: P ∝ V_rms²', 'C1: ratio'], sig=2, aq='ratio')
N('H', 6, 'The instantaneous power in a resistor on a sinusoidal supply is P = P₀ sin² ωt, with P₀ = 2.0 kW. (a) State the mean power. (b) Calculate the instantaneous power at t = T/6. (c) Explain why P is never negative. Give only the answer to (b), in kW.', 2.0 * sin(radians(60)) ** 2, 'kW',
  f'(a) P₀/2 = 1.0 kW. (b) At t = T/6, ωt = 60°: P = 2.0 × sin² 60° = 2.0 × {sf(sin(radians(60)) ** 2)} = {sf(2 * sin(radians(60)) ** 2)} kW. (c) sin² is never negative, because P = I²R.',
  ['C1: mean P₀/2', 'M1: ωt = 60°', 'C1: sin² 60°', 'C1: value', 'B1: I² ≥ 0'], aq='P')
N('H', 5, 'Heaters rated 1.0 kW and 2.0 kW (each at 230 V r.m.s.) are connected in series to a 230 V r.m.s. supply. (a) Calculate the resistance of each. (b) Calculate the current. (c) Calculate the power in the 1.0 kW heater. Give only the answer to (c).', (230 / (230 ** 2 / 1000 + 230 ** 2 / 2000)) ** 2 * 230 ** 2 / 1000, 'W',
  f'(a) R₁ = 230² ÷ 1000 = {sf(230 ** 2 / 1000)} Ω; R₂ = 230² ÷ 2000 = {sf(230 ** 2 / 2000)} Ω. (b) I = 230 ÷ ({sf(230 ** 2 / 1000, 4)} + {sf(230 ** 2 / 2000, 4)}) = {sf(230 / (230 ** 2 / 1000 + 230 ** 2 / 2000))} A. (c) P = ({sf(230 / (230 ** 2 / 1000 + 230 ** 2 / 2000), 4)})² × {sf(230 ** 2 / 1000, 4)} = {sf((230 / (230 ** 2 / 1000 + 230 ** 2 / 2000)) ** 2 * 230 ** 2 / 1000)} W',
  ['C1: resistances', 'C1: series current', 'C1: P = I²R', 'B1: less than rated power'], aq='P')
N('H', 5, 'A transmission line operates at 400 kV r.m.s. (a) Calculate the peak voltage, in kV. (b) Calculate the peak-to-peak voltage. (c) Explain why the insulators must be designed for the peak, not the r.m.s., value. Give only the answer to (a).', 400 * R2, 'kV',
  f'(a) V₀ = 400 × √2 = {sf(400 * R2)} kV. (b) V_pp = 2 × {sf(400 * R2, 4)} = {sf(800 * R2)} kV. (c) Breakdown happens at the largest instantaneous voltage.',
  ['C1: × √2', 'C1: value', 'C1: × 2', 'B1: breakdown at peak'], aq='V₀')
N('H', 5, 'A sinusoidal current of peak 2.0 A flows through a 50 Ω resistor for 10 minutes. (a) Calculate the mean power. (b) Calculate the energy dissipated. Give only the answer to (b).', 0.5 * 2.0 ** 2 * 50 * 600, 'J',
  '(a) P = ½ × 2.0² × 50 = 100 W. (b) E = 100 × 600 = 6.0 × 10⁴ J',
  ['C1: ½I₀²R', 'C1: value', 'C1: t in s', 'C1: E = Pt'], sig=2, aq='E')

# ═════════════════════════ 27.4 Rectification and smoothing (16/17/9) ═════════════════════════
lesson('27.4')
M('E', 1, 'What does the output of a half-wave rectifier look like?', 'Only the positive half cycles; the negative half cycles are removed', ['Both half cycles, with the negative ones inverted', 'A steady d.c. voltage', 'Only the negative half cycles'], 'A single diode conducts in one direction only.')
M('E', 1, 'What does the output of a full-wave bridge rectifier look like?', 'A series of positive humps: the negative half cycles are turned positive', ['Only the positive half cycles', 'A steady d.c. voltage with no ripple', 'The same as the a.c. input'], 'Four diodes route both halves of the cycle the same way through the load.')
N('E', 2, 'A 50 Hz supply is full-wave rectified. Calculate the time between successive peaks of the output.', 1 / 100, 's',
  'There are 2 × 50 = 100 peaks per second, so the time between peaks = 1 ÷ 100 = 0.010 s', ['C1: two peaks per cycle'], sig=2, aq='t')
N('E', 2, 'A 1000 µF smoothing capacitor is used with a 2.2 kΩ load. Calculate the time constant.', 1000e-6 * 2.2e3, 's',
  'τ = RC = 2.2 × 10³ × 1000 × 10⁻⁶ = 2.2 s', ['C1: τ = RC'], sig=2, aq='τ')
M('E', 1, 'Which property of a diode is used in a rectifier?', 'It conducts in only one direction', ['It has a constant resistance', 'It stores charge', 'It emits light'], 'Current can flow forwards but not backwards through the diode.')
N('E', 2, 'A transformer gives 12 V r.m.s. to a rectifier. Ignoring the diodes, calculate the peak output voltage.', 12 * R2, 'V',
  f'V₀ = √2 × 12 = {sf(12 * R2)} V', ['C1: V₀ = √2 V_rms'], aq='V₀')
M('E', 1, 'A larger smoothing capacitor is used, with the same load. What happens to the ripple?', 'It decreases', ['It increases', 'It stays the same', 'It disappears completely'], 'A larger RC means the capacitor discharges less between peaks.')
N('E', 2, 'A bridge rectifier is fed with 12 V r.m.s. Two diodes, each with a forward p.d. of 0.70 V, conduct at a time. Calculate the peak output.', 12 * R2 - 1.4, 'V',
  f'V₀ = √2 × 12 − 2 × 0.70 = {sf(12 * R2 - 1.4)} V', ['C1: subtract two diode drops'], aq='V₀')
M('E', 1, 'In a full-wave bridge rectifier, how many diodes conduct at any one time?', '2', ['1', '3', '4'], 'Two diodes conduct during each half cycle, the other two during the next.')
N('E', 2, 'A 60 Hz supply is half-wave rectified. Calculate the frequency of the output pulses.', 60, 'Hz', 'One output pulse per input cycle: pulses per second = 60 × 1 = 60, so f = 60 Hz', ['C1: one pulse per cycle'], sig=2, aq='f')
M('E', 1, 'In a smoothed rectifier, when does the smoothing capacitor charge?', 'When the rectified voltage rises above the capacitor\'s voltage', ['All the time', 'Only when the input is negative', 'Only when the load is disconnected'], 'Between peaks the diodes are reverse-biased and the capacitor discharges through the load.')
N('E', 1, 'A 60 Hz supply is full-wave rectified. How many output peaks are there each second?', 120, None, 'Two output peaks per input cycle: 2 × 60 = 120 peaks per second', [], sig=2, aq='peaks')
M('E', 1, 'Why does a single-diode (half-wave) rectifier waste much of the supply?', 'It blocks the negative half of every cycle, so no energy is delivered for half the time', ['It reverses the current', 'It stores half the energy', 'It doubles the frequency'], 'Only one half cycle in two reaches the load.')
N('E', 2, 'A 470 µF smoothing capacitor is charged to 15 V at a peak. Calculate the charge stored, in mC.', 470e-6 * 15 * 1000, 'mC',
  f'Q = CV = 470 × 10⁻⁶ × 15 = {sf(470e-6 * 15)} C. In mC: {sf(470e-6 * 15, 4)} × 1000 = {sf(470e-6 * 15 * 1000)}', ['C1: Q = CV'], aq='Q')
M('E', 1, 'What is meant by ripple in the output of a smoothed rectifier?', 'The small variation in output voltage that remains after smoothing', ['The negative half cycles', 'The frequency of the a.c. supply', 'The heating of the diodes'], 'The capacitor discharges slightly between peaks.')
N('E', 2, 'A smoothing circuit needs a time constant of 0.50 s with a 500 Ω load. Calculate the capacitance needed, in µF.', 0.50 / 500 * 1e6, 'µF',
  'C = τ/R = 0.50 ÷ 500 = 1.0 × 10⁻³ F. In µF: 1.0 × 10⁻³ × 10⁶ = 1000', ['C1: C = τ/R'], sig=2, aq='C')
# medium
N('M', 3, 'A smoothed full-wave output has a peak of 15 V. Between peaks (0.010 s) the capacitor discharges through the load with RC = 0.50 s. Using ΔV ≈ V₀t/RC, estimate the ripple.', 15 * 0.010 / 0.50, 'V',
  'ΔV ≈ 15 × 0.010 ÷ 0.50 = 0.30 V', ['M1: ΔV ≈ V₀t/RC', 'C1: value'], sig=2, aq='ΔV')
N('M', 3, 'A smoothing capacitor charged to 15 V discharges through a load with RC = 0.20 s for 10 ms between peaks. Calculate the p.d. just before the next peak.', 15 * exp(-0.010 / 0.20), 'V',
  f'V = V₀e^(−t/RC) = 15 × e^(−0.010/0.20) = {sf(15 * exp(-0.05))} V', ['C1: exponential decay', 'C1: value'], aq='V')
M('M', 3, 'The load resistance across a smoothed rectifier is doubled, with the same capacitor. What happens to the ripple?', 'It roughly halves', ['It roughly doubles', 'It stays the same', 'It quadruples'], 'Doubling R doubles RC, so the capacitor discharges about half as much between peaks.', ['C1: RC doubles', 'C1: ΔV ∝ 1/RC'])
N('M', 4, 'A full-wave rectifier on a 50 Hz supply has a peak output of 12 V and feeds a 240 Ω load. Estimate the capacitance needed for a ripple of no more than 0.50 V, in µF, using ΔV ≈ It/C.', (12 / 240) * 0.010 / 0.50 * 1e6, 'µF',
  'I ≈ 12 ÷ 240 = 0.050 A. C ≈ It/ΔV = 0.050 × 0.010 ÷ 0.50 = 1.0 × 10⁻³ F. In µF: 1.0 × 10⁻³ × 10⁶ = 1000', ['C1: load current', 'M1: ΔQ = It = CΔV', 'C1: C'], sig=2, aq='C')
N('M', 3, 'A smoothed rectifier gives about 12 V across a 1.0 kΩ load. Calculate the load current, in mA.', 12 / 1.0e3 * 1000, 'mA',
  'I = V/R = 12 ÷ 1000 = 0.012 A. In mA: 0.012 × 1000 = 12', ['C1: I = V/R', 'C1: conversion'], sig=2, aq='I')
M('M', 3, 'With the same capacitor and load, how does the ripple from a full-wave rectifier compare with that from a half-wave rectifier?', 'It is about half as large, because the capacitor discharges for only half as long between peaks', ['It is twice as large', 'It is the same', 'Full-wave output has no ripple'], 'Full-wave peaks come every T/2 instead of every T.', ['C1: shorter discharge time', 'C1: smaller ripple'])
N('M', 3, 'A 470 µF smoothing capacitor\'s p.d. falls by 0.40 V between peaks. Calculate the charge it supplies to the load in that time, in µC.', 470 * 0.40, 'µC',
  'ΔQ = CΔV = 470 × 10⁻⁶ × 0.40 = 1.88 × 10⁻⁴ C. In µC: 1.88 × 10⁻⁴ × 10⁶ = 188', ['C1: ΔQ = CΔV', 'C1: conversion'], aq='ΔQ')
N('M', 4, 'A 1000 µF smoothing capacitor\'s p.d. falls from 15.0 V to 14.5 V between peaks. Calculate the energy it delivers to the load, in mJ.', 0.5 * 1000e-6 * (15.0 ** 2 - 14.5 ** 2) * 1000, 'mJ',
  f'ΔW = ½C(V₁² − V₂²) = 0.5 × 1000 × 10⁻⁶ × (15.0² − 14.5²) = {sf(0.5e-3 * (225 - 14.5 ** 2))} J. In mJ: {sf(0.5e-3 * (225 - 14.5 ** 2), 4)} × 1000 = {sf(0.5e-3 * (225 - 14.5 ** 2) * 1000)}', ['M1: difference of ½CV²', 'C1: substitution', 'C1: conversion'], aq='ΔW')
M('M', 4, 'Which change would NOT reduce the ripple from a smoothed rectifier?', 'Using a lower-frequency a.c. supply', ['Using a larger capacitor', 'Using full-wave instead of half-wave rectification', 'Increasing the load resistance'], 'A lower frequency means longer gaps between peaks, so more discharge.', ['C1: larger C or R reduces ripple', 'C1: full-wave halves gap', 'C1: lower f increases gap'])
N('M', 3, 'A 9.0 V r.m.s. supply feeds a bridge rectifier whose conducting diodes each drop 0.70 V. Calculate the peak output voltage.', 9.0 * R2 - 1.4, 'V',
  f'V₀ = √2 × 9.0 − 2 × 0.70 = {sf(9 * R2 - 1.4)} V', ['C1: V₀ = √2 V_rms', 'C1: two diode drops'], aq='V₀')
N('M', 3, 'A smoothing circuit has RC = 0.47 s and is fed by a full-wave rectifier on a 50 Hz supply. Calculate (time constant) ÷ (time between peaks).', 0.47 / 0.010, None,
  'Time between peaks = 1 ÷ 100 = 0.010 s. Ratio = 0.47 ÷ 0.010 = 47', ['C1: time between peaks', 'C1: ratio'], sig=2, aq='ratio')
M('M', 3, 'One diode in a bridge rectifier fails, becoming an open circuit. What happens to the output?', 'It becomes half-wave rectified', ['It stays full-wave', 'It becomes zero', 'It becomes a.c.'], 'Only the path through the working pair of diodes remains for one half cycle.', ['C1: one current path lost', 'C1: half-wave output'])
N('M', 3, 'For a smoothed full-wave rectifier on 50 Hz, the ripple must be about 2.0 % of the peak voltage. Using ΔV/V₀ ≈ t/RC, calculate the time constant needed.', 0.010 / 0.020, 's',
  'RC = t ÷ (ΔV/V₀) = 0.010 ÷ 0.020 = 0.50 s', ['C1: t = 0.010 s', 'C1: rearranged'], sig=2, aq='RC')
N('M', 3, 'A smoothing capacitor discharges through a load with RC = 0.20 s. Calculate the time for its p.d. to fall to 95 % of its peak, in ms.', 0.20 * log(1 / 0.95) * 1000, 'ms',
  f't = RC ln(1/0.95) = 0.20 × ln 1.0526 = {sf(0.2 * log(1 / 0.95))} s. In ms: {sf(0.2 * log(1 / 0.95), 4)} × 1000 = {sf(0.2 * log(1 / 0.95) * 1000)}', ['C1: logs', 'C1: conversion'], aq='t')
M('M', 3, 'Why does the smoothing capacitor\'s p.d. rise only during a short part of each cycle?', 'The diodes conduct only when the rectified input is higher than the capacitor\'s p.d.', ['The capacitor is full most of the time', 'The load disconnects the supply', 'The transformer switches off'], 'Most of the time the diodes are reverse-biased.', ['C1: diode forward-biased only near peaks', 'C1: capacitor discharges otherwise'])
N('M', 4, 'A smoothed output rises to a peak of 15.0 V and falls to 14.4 V before the next peak. Estimate the mean output voltage.', (15.0 + 14.4) / 2, 'V',
  'For a small ripple the voltage varies almost linearly, so mean ≈ (15.0 + 14.4) ÷ 2 = 14.7 V', ['M1: average of peak and trough', 'C1: substitution', 'C1: value'], aq='V')
M('M', 3, 'Which describes the smoothed output of a half-wave rectifier?', 'A sharp rise near each positive peak, followed by a slow fall for the rest of the cycle', ['A steady value with no variation', 'Half-sine pulses with gaps between them', 'A square wave'], 'The capacitor charges near the peak and then discharges through the load.', ['C1: charge near peak', 'C1: slow exponential discharge'])
# hard
N('H', 6, 'A transformer gives 12 V r.m.s. to a bridge rectifier; two diodes, each dropping 0.70 V, conduct at a time. The output is smoothed by a 2200 µF capacitor and feeds a 100 Ω load. The supply is 50 Hz. (a) Calculate the peak output voltage. (b) Calculate the time constant. (c) Estimate the ripple using ΔV ≈ V₀t/RC. Give only the answer to (c).', (12 * R2 - 1.4) * 0.010 / (100 * 2200e-6), 'V',
  f'(a) V₀ = √2 × 12 − 1.4 = {sf(12 * R2 - 1.4)} V. (b) RC = 100 × 2200 × 10⁻⁶ = 0.22 s. (c) t = 0.010 s, so ΔV ≈ {sf(12 * R2 - 1.4, 4)} × 0.010 ÷ 0.22 = {sf((12 * R2 - 1.4) * 0.01 / 0.22)} V',
  ['C1: V₀ with diode drops', 'C1: RC', 'C1: t for full-wave', 'M1: ΔV ≈ V₀t/RC', 'C1: value'], aq='ΔV')
N('H', 5, 'A half-wave rectifier on a 50 Hz supply has a smoothing capacitor charged to 10 V at each peak, with RC = 0.10 s. (a) State the time between peaks. (b) Calculate the p.d. just before the next peak. (c) Calculate the ripple. Give only the answer to (c).', 10 * (1 - exp(-0.020 / 0.10)), 'V',
  f'(a) 0.020 s. (b) V = 10 × e^(−0.020/0.10) = {sf(10 * exp(-0.2))} V. (c) Ripple = 10 − {sf(10 * exp(-0.2), 4)} = {sf(10 * (1 - exp(-0.2)))} V',
  ['C1: one peak per cycle', 'C1: V = V₀e^(−t/RC)', 'C1: ripple', 'B1: approximation ΔV ≈ V₀t/RC gives 2.0 V'], aq='ΔV')
N('H', 6, 'A power supply delivers 50 mA to a load from a full-wave rectifier on a 50 Hz supply. The ripple must be no more than 0.20 V. (a) Calculate the charge supplied to the load between peaks. (b) Calculate the smoothing capacitance needed, in µF. Give only the answer to (b).', 0.050 * 0.010 / 0.20 * 1e6, 'µF',
  '(a) ΔQ = It = 0.050 × 0.010 = 5.0 × 10⁻⁴ C. (b) C = ΔQ/ΔV = 5.0 × 10⁻⁴ ÷ 0.20 = 2.5 × 10⁻³ F. In µF: 2.5 × 10⁻³ × 10⁶ = 2500',
  ['C1: t = 0.010 s', 'C1: ΔQ = It', 'M1: C = ΔQ/ΔV', 'C1: value', 'C1: conversion'], sig=2, aq='C')
N('H', 5, 'A full-wave rectifier on a 50 Hz supply feeds 0.12 A to a load through a 1000 µF smoothing capacitor. (a) Calculate the charge delivered between peaks. (b) Calculate the ripple. Give only the answer to (b).', 0.12 * 0.010 / 1000e-6, 'V',
  '(a) ΔQ = 0.12 × 0.010 = 1.2 × 10⁻³ C. (b) ΔV = ΔQ/C = 1.2 × 10⁻³ ÷ 1000 × 10⁻⁶ = 1.2 V',
  ['C1: t between peaks', 'C1: ΔQ', 'M1: ΔV = ΔQ/C', 'C1: value'], sig=2, aq='ΔV')
N('H', 6, 'A smoothed full-wave output on a 50 Hz supply rises to 14.0 V and falls to 13.2 V before each new peak. The load is 470 Ω. (a) State the ripple. (b) Estimate the mean load current. (c) Estimate the smoothing capacitance, in µF. Give only the answer to (c).', ((14.0 + 13.2) / 2 / 470) * 0.010 / 0.80 * 1e6, 'µF',
  f'(a) 14.0 − 13.2 = 0.80 V. (b) I ≈ 13.6 ÷ 470 = {sf(13.6 / 470)} A. (c) C ≈ It/ΔV = {sf(13.6 / 470, 4)} × 0.010 ÷ 0.80 = {sf(13.6 / 470 * 0.01 / 0.8)} F. In µF: {sf(13.6 / 470 * 0.01 / 0.8, 4)} × 10⁶ = {sf(13.6 / 470 * 0.01 / 0.8 * 1e6)}',
  ['C1: ripple', 'C1: mean voltage', 'C1: I = V/R', 'M1: C = It/ΔV', 'C1: value'], aq='C')
N('H', 5, 'A smoothed full-wave rectifier gives a ripple of 0.30 V. (a) Explain why the ripple would roughly double with half-wave rectification and the same capacitor and load. (b) State the expected ripple with half-wave rectification. Give only the answer to (b).', 0.60, 'V',
  '(a) With half-wave rectification the capacitor discharges for a whole period (20 ms) instead of half a period (10 ms) between peaks. (b) ΔV ≈ 2 × 0.30 = 0.60 V',
  ['B1: discharge time doubled', 'M1: ΔV ∝ t', 'C1: factor 2', 'C1: value'], sig=2, aq='ΔV')
N('H', 5, 'A smoothed supply gives a nearly steady 15 V across a 100 Ω load. (a) Calculate the load current. (b) Calculate the power delivered to the load. (c) The transformer supplies 2.6 W. Calculate the efficiency of the rectifier and smoothing circuit. Give only the answer to (b).', 15 ** 2 / 100, 'W',
  f'(a) I = 15 ÷ 100 = 0.15 A. (b) P = 15² ÷ 100 = 2.25 W. (c) Efficiency = 2.25 ÷ 2.6 × 100 = {sf(2.25 / 2.6 * 100)} %, the rest being lost mostly in the diodes.',
  ['C1: I = V/R', 'C1: P = V²/R', 'C1: efficiency', 'B1: losses in diodes'], aq='P')
N('H', 5, 'A bridge rectifier is fed with 6.0 V r.m.s. Each diode has a forward p.d. of 0.70 V. (a) Explain why two diode drops must be subtracted. (b) Calculate the peak output voltage. Give only the answer to (b).', 6.0 * R2 - 1.4, 'V',
  f'(a) In each half cycle, the current passes through two diodes in series with the load. (b) V₀ = √2 × 6.0 − 2 × 0.70 = {sf(6 * R2 - 1.4)} V',
  ['B1: two diodes in each path', 'C1: √2 × 6.0', 'C1: subtract 1.4 V', 'C1: value'], aq='V₀')
N('H', 5, 'A smoothed full-wave rectifier on a 50 Hz supply has a ripple of 0.50 V. The same circuit is then used on a 60 Hz supply. (a) Explain why the ripple changes. (b) Calculate the new ripple, using ΔV ∝ time between peaks. Give only the answer to (b).', 0.50 * 50 / 60, 'V',
  f'(a) At 60 Hz the peaks come more often, so the capacitor discharges for less time. (b) ΔV = 0.50 × 50 ÷ 60 = {sf(0.5 * 50 / 60)} V',
  ['B1: shorter gap between peaks', 'M1: ΔV ∝ 1/f', 'C1: substitution', 'C1: value'], aq='ΔV')
