# Chapter 26 Electromagnetic induction — part a: 26.1 to 26.3.
QE = 1.60e-19
MU0 = 4 * pi * 1e-7

# ═════════════════════════ 26.1 Observing induction (16/17/11) ═════════════════════════
lesson('26.1')
N('E', 2, 'A metal rod 0.20 m long moves at 5.0 m s⁻¹ at right angles to a uniform field of 0.15 T. Calculate the e.m.f. induced across its ends.', 0.15 * 0.20 * 5.0, 'V',
  'E = BLv = 0.15 × 0.20 × 5.0 = 0.15 V', ['C1: E = BLv'], sig=2, aq='E')
M('E', 1, 'What is needed for an e.m.f. to be induced in a coil?', 'A change in the magnetic flux linking the coil', ['A steady current in the coil', 'A strong magnet held still inside it', 'An iron core'], 'Only a changing flux linkage induces an e.m.f.')
M('E', 1, 'A magnet is pushed into a coil connected to a meter. It is then pushed in faster. What happens to the meter reading?', 'It is larger', ['It is smaller', 'It is the same', 'It is zero'], 'The flux changes more quickly, so the induced e.m.f. is larger.')
N('E', 2, 'A 0.40 m rod moves at right angles to a field of 0.050 T. Calculate the speed needed to induce an e.m.f. of 0.10 V.', 0.10 / (0.050 * 0.40), 'm s⁻¹',
  'v = E/(BL) = 0.10 ÷ (0.050 × 0.40) = 5.0 m s⁻¹', ['C1: rearranged E = BLv'], sig=2, aq='v')
M('E', 1, 'A magnet is pushed into a coil south pole first instead of north pole first, at the same speed. What happens to the induced e.m.f.?', 'It has the same size but the opposite direction', ['It doubles', 'It becomes zero', 'It is the same in size and direction'], 'Reversing the field reverses the direction of the flux change.')
N('E', 2, 'An aircraft with a wingspan of 30 m flies horizontally at 250 m s⁻¹ where the vertical component of the Earth\'s field is 4.0 × 10⁻⁵ T. Calculate the e.m.f. between its wing tips.', 4.0e-5 * 30 * 250, 'V',
  'E = BLv = 4.0 × 10⁻⁵ × 30 × 250 = 0.30 V', ['C1: E = BLv with vertical component'], sig=2, aq='E')
M('E', 1, 'Which change would increase the e.m.f. induced when a magnet moves into a coil at a fixed speed?', 'Using a coil with more turns', ['Using a weaker magnet', 'Using fewer turns', 'Holding the magnet still'], 'E is proportional to the number of turns N.')
N('E', 2, 'The flux through each turn of a 400-turn coil drops by 3.0 × 10⁻⁴ Wb over 0.15 s. Calculate the average induced e.m.f.', 400 * 3.0e-4 / 0.15, 'V',
  'E = NΔΦ/Δt = 400 × 3.0 × 10⁻⁴ ÷ 0.15 = 0.80 V', ['C1: E = NΔΦ/Δt'], sig=2, aq='E')
M('E', 1, 'A straight wire moves along the direction of a uniform magnetic field. What e.m.f. is induced across it?', 'None', ['BLv', 'Half of BLv', 'It depends on the length only'], 'It does not cut any field lines, so no flux is swept out.')
N('E', 2, 'A horizontal rod 0.50 m long falls at 3.0 m s⁻¹ through a horizontal field of 0.20 T at right angles to the rod. Calculate the e.m.f. across it.', 0.20 * 0.50 * 3.0, 'V',
  'E = BLv = 0.20 × 0.50 × 3.0 = 0.30 V', ['C1: E = BLv'], sig=2, aq='E')
M('E', 1, 'A coil connected to nothing (an open circuit) has a magnet pushed into it. Which statement is correct?', 'An e.m.f. is induced, but no current flows', ['A current flows, but no e.m.f. is induced', 'Both an e.m.f. and a current are produced', 'Neither is produced'], 'An e.m.f. appears whenever flux changes; a current needs a complete circuit.')
N('E', 1, 'A rod moving through a field has an induced e.m.f. of 12 mV. Its speed is doubled. What is the new e.m.f., in mV?', 24, 'mV', 'E ∝ v: 2 × 12 = 24 mV', [], sig=2, aq='E')
M('E', 1, 'Faraday wound two coils on an iron ring. When was an e.m.f. induced in the second coil?', 'Only while the current in the first coil was being switched on or off', ['All the time the current in the first coil was steady', 'Only when the ring was removed', 'Never'], 'Only a changing current gives a changing flux in the ring.')
N('E', 2, 'A 0.25 m rod moving at 8.0 m s⁻¹ at right angles to a field has an induced e.m.f. of 0.050 V. Calculate the flux density.', 0.050 / (0.25 * 8.0), 'T',
  'B = E/(Lv) = 0.050 ÷ (0.25 × 8.0) = 0.025 T', ['C1: B = E/(Lv)'], sig=2, aq='B')
M('E', 1, 'A flat coil moves sideways, without turning, inside a large region of uniform magnetic field. What e.m.f. is induced?', 'None, because the flux linkage stays constant', ['A steady e.m.f.', 'An alternating e.m.f.', 'An e.m.f. that grows with time'], 'The same flux passes through the coil at every position.')
N('E', 2, 'A 0.50 m rod moves at 6.0 m s⁻¹ through a 0.20 T field, with its velocity at 30° to the field lines (the rod is at right angles to both). Calculate the induced e.m.f.', 0.20 * 0.50 * 6.0 * sin(radians(30)), 'V',
  'E = BLv sin θ = 0.20 × 0.50 × 6.0 × sin 30° = 0.30 V', ['C1: only the velocity component across the field'], sig=2, aq='E')
# medium
N('M', 3, 'A 0.30 m rod moves at 4.0 m s⁻¹ across a 0.50 T field on rails connected by a 2.0 Ω resistor. Ignoring other resistance, calculate the current.', 0.50 * 0.30 * 4.0 / 2.0, 'A',
  'E = BLv = 0.50 × 0.30 × 4.0 = 0.60 V. I = E/R = 0.60 ÷ 2.0 = 0.30 A', ['C1: E = BLv', 'C1: I = E/R'], sig=2, aq='I')
N('M', 3, 'A train axle 1.4 m long moves at 30 m s⁻¹ where the vertical component of the Earth\'s field is 4.0 × 10⁻⁵ T. Calculate the e.m.f. across the axle, in mV.', 4.0e-5 * 1.4 * 30 * 1000, 'mV',
  f'E = BLv = 4.0 × 10⁻⁵ × 1.4 × 30 = {sf(4e-5 * 1.4 * 30)} V. In mV: {sf(4e-5 * 1.4 * 30, 4)} × 1000 = {sf(4e-5 * 1.4 * 30 * 1000)}', ['C1: E = BLv', 'C1: conversion'], aq='E')
M('M', 3, 'A bar magnet falls through a horizontal coil connected to a data logger. Which describes the e.m.f.–time graph?', 'Two pulses of opposite sign; the second is taller and narrower because the magnet is moving faster', ['One pulse only', 'Two identical pulses of the same sign', 'A steady e.m.f. while the magnet is inside'], 'Flux increases as it enters and decreases as it leaves; it accelerates as it falls.', ['C1: opposite signs entering and leaving', 'C1: second pulse faster, larger'])
N('M', 4, 'A magnet is pushed into a 200-turn coil in 0.20 s, and the flux through each turn rises from zero to 3.0 × 10⁻⁵ Wb. Calculate the average induced e.m.f., in mV.', 200 * 3.0e-5 / 0.20 * 1000, 'mV',
  'Δ(NΦ) = 200 × 3.0 × 10⁻⁵ = 6.0 × 10⁻³ Wb. E = 6.0 × 10⁻³ ÷ 0.20 = 0.030 V. In mV: 0.030 × 1000 = 30', ['C1: flux linkage', 'C1: E = Δ(NΦ)/Δt', 'C1: conversion'], sig=2, aq='E')
N('M', 3, 'A 0.40 m rod moves 0.50 m in 0.25 s at right angles to a 0.30 T field. Calculate the induced e.m.f.', 0.30 * 0.40 * 0.50 / 0.25, 'V',
  'Flux cut = BLd = 0.30 × 0.40 × 0.50 = 0.060 Wb. E = 0.060 ÷ 0.25 = 0.24 V', ['C1: flux cut', 'C1: ÷ time'], sig=2, aq='E')
M('M', 3, 'The length of a moving rod is doubled and its speed is halved, in the same field. What happens to the induced e.m.f.?', 'It stays the same', ['It doubles', 'It halves', 'It quadruples'], 'E = BLv: doubling L and halving v leaves the product Lv, and so E, unchanged.', ['C1: E = BLv', 'C1: product unchanged'])
N('M', 3, 'A rod of length L rotating about one end at angular speed ω in a field B at right angles has an e.m.f. E = ½BωL². Calculate E for a 6.0 m helicopter blade at 30 rad s⁻¹ in a vertical field of 5.0 × 10⁻⁵ T.', 0.5 * 5.0e-5 * 30 * 6.0 ** 2, 'V',
  f'E = ½BωL² = 0.5 × 5.0 × 10⁻⁵ × 30 × 6.0² = {sf(0.5 * 5e-5 * 30 * 36)} V', ['C1: formula', 'C1: substitution'], aq='E')
N('M', 4, 'A rod moving across a field produces an e.m.f. of 0.60 V and is connected to a 2.0 Ω resistor. Calculate the power dissipated in the resistor.', 0.60 ** 2 / 2.0, 'W',
  'P = E²/R = 0.60² ÷ 2.0 = 0.18 W', ['C1: current or P = V²/R', 'C1: substitution', 'B1: power comes from the work done moving the rod'], sig=2, aq='P')
M('M', 3, 'Why is no e.m.f. induced in a coil that moves without rotating inside a uniform field?', 'The flux linkage of the coil does not change', ['The field is too weak', 'The coil has too few turns', 'The coil must be made of iron'], 'E = rate of change of flux linkage, which is zero here.', ['C1: E depends on change of NΦ', 'C1: NΦ constant'])
N('M', 3, 'The flux linkage of a coil changes by 4.5 × 10⁻³ Wb in 0.090 s. Calculate the average induced e.m.f.', 4.5e-3 / 0.090, 'V',
  'E = Δ(NΦ)/Δt = 4.5 × 10⁻³ ÷ 0.090 = 0.050 V', ['C1: E = Δ(NΦ)/Δt', 'C1: substitution'], sig=2, aq='E')
N('M', 3, 'The flux through each turn of a coil changes by 2.4 × 10⁻⁵ Wb in 0.010 s, inducing an average e.m.f. of 0.12 V. Calculate the number of turns.', 0.12 * 0.010 / 2.4e-5, 'turns',
  'N = EΔt/ΔΦ = 0.12 × 0.010 ÷ 2.4 × 10⁻⁵ = 50 turns', ['C1: rearranged', 'C1: value'], sig=2, aq='N')
M('M', 3, 'In Faraday\'s iron-ring experiment, the current in the first coil is steady. What is the reading on a meter connected to the second coil?', 'Zero', ['A steady non-zero reading', 'An alternating reading', 'A reading that slowly increases'], 'A steady current gives a constant flux, so there is no change of flux linkage.', ['C1: constant flux', 'C1: no e.m.f.'])
N('M', 3, 'A 0.50 m rod moves at right angles to a 0.80 T field. Calculate the speed needed for an e.m.f. of 1.0 V.', 1.0 / (0.80 * 0.50), 'm s⁻¹',
  'v = E/(BL) = 1.0 ÷ (0.80 × 0.50) = 2.5 m s⁻¹', ['C1: rearranged', 'C1: value'], sig=2, aq='v')
M('M', 4, 'Coil A has 100 turns of area A. Coil B has 200 turns of area A/2. They are in the same changing field. How do their induced e.m.f.s compare?', 'They are equal', ['A has twice the e.m.f. of B', 'B has twice the e.m.f. of A', 'B has four times the e.m.f. of A'], 'E = NA dB/dt: 100A = 200 × A/2.', ['C1: E = NA dB/dt', 'C1: NA equal', 'C1: equal e.m.f.'])
N('M', 3, 'A space tether 20 km long moves at 7.5 km s⁻¹ at right angles to a field of 3.0 × 10⁻⁵ T. Calculate the e.m.f. along it.', 3.0e-5 * 20e3 * 7.5e3, 'V',
  'E = BLv = 3.0 × 10⁻⁵ × 20 × 10³ × 7.5 × 10³ = 4500 V', ['C1: units converted', 'C1: E = BLv'], sig=2, aq='E')
N('M', 3, 'A wire 0.10 m long is swung 0.050 m across a 0.60 T field in 0.020 s. Calculate the average e.m.f.', 0.60 * 0.10 * 0.050 / 0.020, 'V',
  'v = 0.050 ÷ 0.020 = 2.5 m s⁻¹. E = BLv = 0.60 × 0.10 × 2.5 = 0.15 V', ['C1: average speed', 'C1: E = BLv'], sig=2, aq='E')
M('M', 3, 'Which observation shows that the induced e.m.f. depends on the rate of change of flux?', 'Moving the magnet faster gives a larger meter deflection for the same movement', ['Reversing the magnet reverses the deflection', 'Holding the magnet still gives no deflection', 'Adding an iron core changes the deflection'], 'The same flux change in less time gives a larger e.m.f.', ['C1: same flux change', 'C1: shorter time, larger e.m.f.'])
# hard
N('H', 6, 'A metal rod 0.25 m long slides at a steady 4.0 m s⁻¹ along two rails joined by a 0.50 Ω resistor, at right angles to a field of 0.60 T. (a) Calculate the induced e.m.f. (b) Calculate the current. (c) Calculate the force needed to keep the rod moving at constant speed. (d) Show that the mechanical power equals the electrical power. Give only the answer to (c).', 0.60 * (0.60 * 0.25 * 4.0 / 0.50) * 0.25, 'N',
  '(a) E = 0.60 × 0.25 × 4.0 = 0.60 V. (b) I = 0.60 ÷ 0.50 = 1.2 A. (c) The current in the rod feels F = BIL = 0.60 × 1.2 × 0.25 = 0.18 N opposing the motion, so 0.18 N is needed. (d) Fv = 0.18 × 4.0 = 0.72 W and EI = 0.60 × 1.2 = 0.72 W.',
  ['C1: E = BLv', 'C1: I = E/R', 'M1: opposing force BIL', 'C1: value', 'B1: Fv = EI'], sig=2, aq='F')
N('H', 5, 'An airliner with a wingspan of 60 m flies horizontally at 270 m s⁻¹ where the vertical component of the Earth\'s field is 4.5 × 10⁻⁵ T. (a) Calculate the e.m.f. between the wing tips. (b) Explain why this e.m.f. cannot be used to light a lamp connected between the wing tips on board. Give only the answer to (a).', 4.5e-5 * 60 * 270, 'V',
  f'(a) E = 4.5 × 10⁻⁵ × 60 × 270 = {sf(4.5e-5 * 60 * 270)} V. (b) The connecting wires move with the aircraft and have the same e.m.f. induced in them, so there is no net e.m.f. round the circuit.',
  ['C1: vertical component', 'C1: E = BLv', 'B1: wires also cut field', 'B1: e.m.f.s cancel round loop'], aq='E')
N('H', 6, 'A magnet falls through a 500-turn coil. One e.m.f. pulse is roughly a triangle with a peak of 40 mV and a duration of 0.10 s. (a) Explain why the area under an e.m.f.–time graph equals the change in flux linkage. (b) Estimate the change in flux linkage during the pulse. (c) Calculate the change in flux through each turn, in µWb. Give only the answer to (c).', 0.5 * 0.040 * 0.10 / 500 * 1e6, 'µWb',
  '(a) E = d(NΦ)/dt, so ∫E dt = Δ(NΦ). (b) Area = 0.5 × 0.040 × 0.10 = 2.0 × 10⁻³ Wb. (c) ΔΦ = 2.0 × 10⁻³ ÷ 500 = 4.0 × 10⁻⁶ Wb. In µWb: 4.0 × 10⁻⁶ × 10⁶ = 4.0',
  ['B1: area = Δ(NΦ)', 'C1: triangle area', 'C1: ÷ N', 'C1: conversion', 'M1: units V s = Wb'], sig=2, aq='ΔΦ')
N('H', 5, 'When the current in a primary coil is switched on, the flux through each turn of a 300-turn secondary coil rises from zero to 2.0 × 10⁻⁵ Wb in 5.0 ms. (a) Calculate the average e.m.f. induced in the secondary. (b) Explain why there is no e.m.f. once the primary current is steady. Give only the answer to (a).', 300 * 2.0e-5 / 5.0e-3, 'V',
  '(a) E = 300 × 2.0 × 10⁻⁵ ÷ 5.0 × 10⁻³ = 1.2 V. (b) A steady current gives a constant flux, so the flux linkage no longer changes.',
  ['C1: Δ(NΦ)', 'C1: Δt in s', 'C1: E', 'B1: no change, no e.m.f.'], sig=2, aq='E')
N('H', 6, 'A copper disc of radius 0.10 m rotates at 50 revolutions per second about its axis, in a uniform field of 0.40 T parallel to the axis. The e.m.f. between centre and rim is E = ½BωR². (a) Calculate the angular speed. (b) Calculate the e.m.f. (c) Explain why this e.m.f. is steady, not alternating. Give only the answer to (b).', 0.5 * 0.40 * 2 * pi * 50 * 0.10 ** 2, 'V',
  f'(a) ω = 2π × 50 = {sf(2 * pi * 50)} rad s⁻¹. (b) E = 0.5 × 0.40 × {sf(2 * pi * 50, 4)} × 0.10² = {sf(0.5 * 0.4 * 2 * pi * 50 * 0.01)} V. (c) Each radius cuts the field at the same steady rate in the same sense, so the e.m.f. does not reverse.',
  ['C1: ω = 2πf', 'C1: E formula', 'C1: substitution', 'B1: steady rate of cutting', 'B1: no reversal'], aq='E')
N('H', 5, 'A square coil of 20 turns and side 0.050 m is pulled at a steady 0.25 m s⁻¹ out of a region of uniform field 0.30 T, with its plane at right angles to the field. (a) Calculate the e.m.f. while one side is still in the field. (b) Calculate the time taken to leave the field. (c) Show that e.m.f. × time equals the change in flux linkage. Give only the answer to (a).', 20 * 0.30 * 0.050 * 0.25, 'V',
  '(a) E = NBLv = 20 × 0.30 × 0.050 × 0.25 = 0.075 V. (b) t = 0.050 ÷ 0.25 = 0.20 s. (c) Et = 0.075 × 0.20 = 0.015 Wb, and NBA = 20 × 0.30 × 0.050² = 0.015 Wb.',
  ['C1: E = NBLv', 'C1: t = L/v', 'C1: Et', 'B1: equals NBA'], sig=2, aq='E')
N('H', 6, 'A horizontal east–west rod 1.5 m long is dropped from rest. The Earth\'s horizontal field is 1.8 × 10⁻⁵ T, at right angles to the rod. (a) Calculate the speed of the rod after 2.0 s. (b) Calculate the e.m.f. across it then, in mV. (c) Explain why the e.m.f. increases steadily during the fall. Give only the answer to (b).' + take('g'), 1.8e-5 * 1.5 * g * 2.0 * 1000, 'mV',
  f'(a) v = gt = 9.81 × 2.0 = 19.6 m s⁻¹. (b) E = 1.8 × 10⁻⁵ × 1.5 × 19.62 = {sf(1.8e-5 * 1.5 * 19.62)} V. In mV: {sf(1.8e-5 * 1.5 * 19.62, 4)} × 1000 = {sf(1.8e-5 * 1.5 * 19.62 * 1000)}. (c) E ∝ v, and v increases uniformly with time.',
  ['C1: v = gt', 'C1: E = BLv', 'C1: conversion', 'B1: E ∝ v', 'B1: uniform acceleration'], aq='E')
N('H', 5, 'A search coil of 500 turns and area 1.0 cm² lies face-on to a uniform field. It is turned over in 0.050 s, and the average e.m.f. is 0.12 V. (a) Explain why the change in flux linkage is 2NBA. (b) Calculate B. Give only the answer to (b).', 0.12 * 0.050 / (2 * 500 * 1.0e-4), 'T',
  '(a) The flux linkage changes from +NBA to −NBA. (b) B = EΔt/(2NA) = 0.12 × 0.050 ÷ (2 × 500 × 1.0 × 10⁻⁴) = 0.060 T',
  ['B1: reversal gives 2NBA', 'C1: area in m²', 'C1: rearranged', 'C1: value'], sig=2, aq='B')
N('H', 5, 'A rod 0.20 m long accelerates uniformly from rest across a field of 0.50 T. The induced e.m.f. rises steadily from 0 to 0.40 V in 2.0 s. (a) Calculate the speed of the rod at 2.0 s. (b) Calculate its acceleration. (c) Sketch, in words, the e.m.f.–time graph. Give only the answer to (b).', 0.40 / (0.50 * 0.20) / 2.0, 'm s⁻²',
  '(a) v = E/(BL) = 0.40 ÷ (0.50 × 0.20) = 4.0 m s⁻¹. (b) a = 4.0 ÷ 2.0 = 2.0 m s⁻². (c) A straight line through the origin, because E ∝ v ∝ t.',
  ['C1: v = E/(BL)', 'C1: a = v/t', 'C1: value', 'B1: linear graph'], sig=2, aq='a')
N('H', 5, 'A rod 0.20 m long is moved at different speeds across a uniform field: v/m s⁻¹ = 1.0, 2.0, 3.0, 4.0 and E/V = 0.08, 0.16, 0.24, 0.32. (a) Describe the relationship. (b) Calculate the gradient of the E–v graph. (c) Calculate B. Give only the answer to (c).', 0.08 / 1.0 / 0.20, 'T',
  '(a) E ∝ v. (b) Gradient = (0.32 − 0.08) ÷ (4.0 − 1.0) = 0.080 V s m⁻¹. (c) Gradient = BL, so B = 0.080 ÷ 0.20 = 0.40 T',
  ['B1: proportional', 'C1: gradient', 'M1: gradient = BL', 'C1: value'], sig=2, aq='B')
N('H', 6, 'A 100-turn coil with a total resistance of 5.0 Ω has the flux through each turn changed by 4.0 × 10⁻⁴ Wb. (a) Show that the charge that flows is Q = Δ(NΦ)/R. (b) Calculate Q, in mC. (c) Explain why Q does not depend on how quickly the flux changes. Give only the answer to (b).', 100 * 4.0e-4 / 5.0 * 1000, 'mC',
  '(a) I = E/R = (1/R) d(NΦ)/dt, so Q = ∫I dt = Δ(NΦ)/R. (b) Q = 100 × 4.0 × 10⁻⁴ ÷ 5.0 = 8.0 × 10⁻³ C. In mC: 8.0 × 10⁻³ × 1000 = 8.0. (c) A faster change gives a larger current for a shorter time; the product is the same.',
  ['M1: I = E/R', 'B1: integrate to get Q', 'C1: substitution', 'C1: conversion', 'B1: rate cancels'], sig=2, aq='Q')

# ═════════════════════════ 26.2 Explaining electromagnetic induction (17/18/9) ═════════════════════════
lesson('26.2')
M('E', 1, 'Which expression gives the magnetic flux through a flat coil of area A at right angles to a uniform field B?', 'Φ = BA', ['Φ = B/A', 'Φ = A/B', 'Φ = BA²'], 'Flux is flux density times the area at right angles to the field.')
N('E', 2, 'A door-shaped loop of area 2.0 m² is face-on to the Earth\'s field of 45 µT. Calculate the flux through it.', 45e-6 * 2.0, 'Wb',
  'Φ = BA = 45 × 10⁻⁶ × 2.0 = 9.0 × 10⁻⁵ Wb', ['C1: Φ = BA with B in T'], sig=2, aq='Φ')
M('E', 1, 'What is the flux linkage of a coil?', 'The number of turns multiplied by the flux through each turn, NΦ', ['The flux through one turn only', 'The flux divided by the number of turns', 'The current multiplied by the number of turns'], 'Each turn contributes the same flux.')
N('E', 2, 'A 150-turn generator coil has 4.0 × 10⁻⁴ Wb through each turn. Calculate its flux linkage.', 150 * 4.0e-4, 'Wb',
  'NΦ = 150 × 4.0 × 10⁻⁴ = 0.060 Wb', ['C1: NΦ'], sig=2, aq='NΦ')
M('E', 1, 'Which statement is Faraday\'s law of electromagnetic induction?', 'The induced e.m.f. is equal to the rate of change of magnetic flux linkage', ['The induced e.m.f. is equal to the flux linkage', 'The induced current opposes the change producing it', 'The induced e.m.f. is equal to the rate of change of current'], 'E = d(NΦ)/dt in magnitude.')
N('E', 2, 'The flux linkage of a coil changes at a steady rate of 0.25 Wb s⁻¹. What e.m.f. is induced?', 0.25, 'V',
  'E = rate of change of flux linkage = 0.25 × 1 = 0.25 V', ['C1: 1 Wb s⁻¹ = 1 V'], sig=2, aq='E')
M('E', 1, 'A metal rod moves at right angles to a magnetic field. Why does one end become negative?', 'The magnetic force on the free electrons pushes them towards that end', ['Positive ions leave that end', 'The field creates electrons there', 'The rod is heated at that end'], 'F = Bev acts along the rod on each moving electron.')
N('E', 2, 'A rod 0.50 m long moves at 3.0 m s⁻¹ across a 0.20 T field. Using E_field = vB inside the rod, calculate the e.m.f. across it.', 3.0 * 0.20 * 0.50, 'V',
  'Electric field in the rod = vB = 3.0 × 0.20 = 0.60 V m⁻¹. e.m.f. = 0.60 × 0.50 = 0.30 V', ['C1: E_field = vB then × L'], sig=2, aq='E')
M('E', 1, 'In what sense is "cutting field lines" equivalent to Faraday\'s law?', 'The rate at which a conductor sweeps out flux equals the rate of change of flux linkage', ['Cutting lines creates new flux', 'Only coils can cut field lines', 'Cutting lines stops the induced e.m.f.'], 'A rod of length L moving at v sweeps out BLv webers per second.')
N('E', 2, 'A 0.40 m rod moving at 2.5 m s⁻¹ at right angles to a 0.15 T field sweeps out an area each second. Calculate the flux it cuts per second, which equals the e.m.f.', 0.15 * 0.40 * 2.5, 'V',
  'Area per second = 0.40 × 2.5 = 1.0 m² s⁻¹. Flux per second = 0.15 × 1.0 = 0.15 Wb s⁻¹, so E = 0.15 V', ['C1: area swept × B'], sig=2, aq='E')
M('E', 1, 'Which unit is equivalent to the volt?', 'Wb s⁻¹', ['Wb s', 'T m⁻²', 'Wb A⁻¹'], 'E = rate of change of flux linkage.')
N('E', 1, 'A 50-turn coil of area 0.010 m² is in a field of 0.10 T, with its normal at 60° to the field. Calculate its flux linkage.', 50 * 0.10 * 0.010 * cos(radians(60)), 'Wb',
  'NΦ = NBA cos 60° = 50 × 0.10 × 0.010 × 0.50 = 0.025 Wb', [], sig=2, aq='NΦ')
M('E', 1, 'Why does a coil rotating steadily in a uniform field produce an alternating e.m.f.?', 'Its flux linkage varies sinusoidally, so the rate of change reverses each half turn', ['The field reverses each half turn', 'The coil\'s resistance changes', 'The coil speeds up and slows down'], 'NΦ = NBA cos ωt; E = NBAω sin ωt.')
N('E', 2, 'A coil of 80 turns and area 0.0050 m² rotates in a field of 0.25 T. Calculate its maximum flux linkage.', 80 * 0.25 * 0.0050, 'Wb',
  'NΦ_max = NBA = 80 × 0.25 × 0.0050 = 0.10 Wb', ['C1: NBA'], sig=2, aq='NΦ')
M('E', 1, 'At which position of a coil rotating in a uniform field is the induced e.m.f. greatest?', 'When the plane of the coil is parallel to the field, so the flux linkage is zero but changing fastest', ['When the plane is at right angles to the field', 'When the flux linkage is greatest', 'The e.m.f. is the same at all positions'], 'E is the gradient of the NΦ–t graph, largest where NΦ crosses zero.')
N('E', 2, 'In half a turn, the flux linkage of a coil changes from +0.10 Wb to −0.10 Wb in 0.010 s. Calculate the average e.m.f.', 0.20 / 0.010, 'V',
  'Δ(NΦ) = 0.10 − (−0.10) = 0.20 Wb. E = 0.20 ÷ 0.010 = 20 V', ['C1: change includes sign'], sig=2, aq='E')
M('E', 1, 'A closed loop moves through a uniform field, staying completely inside it. Why is there no net e.m.f. around the loop?', 'The flux through the loop does not change', ['No field lines are cut by any part of the loop', 'The loop has no resistance', 'The e.m.f. is cancelled by the field'], 'The e.m.f.s in opposite sides are equal and opposite, matching zero change of flux.')
# medium
N('M', 3, 'A rod moves at 5.0 m s⁻¹ at right angles to a field of 0.40 T. Calculate the magnetic force on each free electron in it, in units of 10⁻¹⁹ N.' + take('e'), QE * 5.0 * 0.40, '10⁻¹⁹ N',
  f'F = Bev = 0.40 × 1.60 × 10⁻¹⁹ × 5.0 = {sf(0.4 * QE * 5)} N', ['C1: F = Bev', 'C1: value'], sig=2, aq='F')
N('M', 3, 'The flux linkage of a coil rises steadily from 0 to 0.050 Wb in 0.020 s. Calculate the induced e.m.f.', 0.050 / 0.020, 'V',
  'E = gradient = 0.050 ÷ 0.020 = 2.5 V', ['C1: gradient of NΦ–t', 'C1: value'], sig=2, aq='E')
M('M', 3, 'For a coil rotating at constant speed in a uniform field, how is the e.m.f.–time graph related to the flux-linkage–time graph?', 'The e.m.f. is the (negative) gradient of the flux-linkage graph, so it is a sine curve when flux linkage is a cosine curve', ['They are identical', 'The e.m.f. is the area under the flux-linkage graph', 'The e.m.f. is constant'], 'E = −d(NΦ)/dt, so the e.m.f. graph is the gradient of the flux-linkage graph.', ['C1: E = gradient', 'C1: 90° phase difference'])
N('M', 4, 'A coil\'s flux linkage falls from its maximum, 0.10 Wb, to zero during a quarter turn. The coil turns at 50 revolutions per second. Calculate the average e.m.f. during this quarter turn.', 0.10 / (1 / 50 / 4), 'V',
  'Time for a quarter turn = (1/50) ÷ 4 = 5.0 × 10⁻³ s. E = 0.10 ÷ 5.0 × 10⁻³ = 20 V', ['C1: period', 'C1: quarter period', 'C1: average e.m.f.'], sig=2, aq='E')
N('M', 3, 'An e.m.f.–time graph for a coil is a triangle with a peak of 0.30 V and a duration of 0.040 s. Calculate the change in flux linkage.', 0.5 * 0.30 * 0.040, 'Wb',
  'Δ(NΦ) = area under graph = 0.5 × 0.30 × 0.040 = 6.0 × 10⁻³ Wb', ['M1: area = Δ(NΦ)', 'C1: triangle area'], sig=2, aq='Δ(NΦ)')
M('M', 3, 'A coil rotates in a uniform field about an axis parallel to the field. What e.m.f. is induced?', 'None, because the flux linkage stays constant', ['An alternating e.m.f.', 'A steady e.m.f.', 'An e.m.f. that doubles each turn'], 'The plane of the coil always contains the field direction, so the flux stays zero.', ['C1: flux unchanged', 'C1: no e.m.f.'])
N('M', 3, 'A 40-turn coil of area 2.0 × 10⁻⁴ m² is inside a solenoid where B = 0.050 T, with its plane at right angles to the field. Calculate its flux linkage.', 40 * 0.050 * 2.0e-4, 'Wb',
  'NΦ = 40 × 0.050 × 2.0 × 10⁻⁴ = 4.0 × 10⁻⁴ Wb', ['C1: Φ = BA', 'C1: × N'], sig=2, aq='NΦ')
N('M', 4, 'The current in the solenoid in which a coil sits is reversed in 0.10 s, so the coil\'s flux linkage goes from +4.0 × 10⁻⁴ Wb to −4.0 × 10⁻⁴ Wb. Calculate the average e.m.f., in mV.', 2 * 4.0e-4 / 0.10 * 1000, 'mV',
  'Δ(NΦ) = 2 × 4.0 × 10⁻⁴ = 8.0 × 10⁻⁴ Wb. E = 8.0 × 10⁻⁴ ÷ 0.10 = 8.0 × 10⁻³ V. In mV: 8.0 × 10⁻³ × 1000 = 8.0', ['B1: reversal doubles change', 'C1: E = Δ(NΦ)/Δt', 'C1: conversion'], sig=2, aq='E')
M('M', 3, 'A rod lying north–south moves due east through a magnetic field pointing vertically downwards. Which end of the rod becomes positive?', 'The north end', ['The south end', 'Neither: no e.m.f. is induced', 'Both ends equally'], 'The force on the free electrons pushes them to the south end, leaving the north end positive.', ['C1: force on electrons', 'C1: north end positive'])
N('M', 3, 'Find the flux linkage of a 200-turn coil of area 0.0030 m² when a 0.040 T field makes an angle of 50° with its normal.', 200 * 0.040 * 0.0030 * cos(radians(50)), 'Wb',
  f'NΦ = NBA cos θ = 200 × 0.040 × 0.0030 × cos 50° = {sf(200 * 0.04 * 0.003 * cos(radians(50)))} Wb', ['C1: NBA cos θ', 'C1: substitution'], aq='NΦ')
N('M', 3, 'A rod 1.2 m long moves at 0.50 m s⁻¹ at right angles to a field of 0.80 T. Calculate the induced e.m.f.', 0.80 * 1.2 * 0.50, 'V',
  'E = BLv = 0.80 × 1.2 × 0.50 = 0.48 V', ['C1: E = BLv', 'C1: value'], sig=2, aq='E')
M('M', 4, 'Why is the unit Wb s⁻¹ equivalent to the volt?', 'Wb = T m² = (N A⁻¹ m⁻¹)(m²) = N m A⁻¹, and N m A⁻¹ s⁻¹ = J C⁻¹ = V', ['Wb = V, so Wb s⁻¹ = V s⁻¹', 'Because e.m.f. is measured in webers', 'Wb s⁻¹ = A, which equals V'], 'Work per unit charge: J ÷ (A s) = V.', ['C1: Wb in N m A⁻¹', 'C1: ÷ s gives J C⁻¹', 'C1: = V'])
N('M', 3, 'A 50-turn coil of area 0.020 m² lies face-on to a field that is increasing at 0.40 T s⁻¹. Calculate the induced e.m.f.', 50 * 0.020 * 0.40, 'V',
  'E = NA dB/dt = 50 × 0.020 × 0.40 = 0.40 V', ['C1: E = NA dB/dt', 'C1: value'], sig=2, aq='E')
N('M', 3, 'Calculate the rate of change of flux density needed to induce 1.5 V in a 300-turn coil of area 0.010 m², face-on to the field.', 1.5 / (300 * 0.010), 'T s⁻¹',
  'dB/dt = E/(NA) = 1.5 ÷ (300 × 0.010) = 0.50 T s⁻¹', ['C1: rearranged', 'C1: value'], sig=2, aq='dB/dt')
M('M', 3, 'For a coil rotating in a uniform field, in which position is the flux linkage greatest?', 'When the plane of the coil is at right angles to the field', ['When the plane of the coil is parallel to the field', 'At 45°', 'It is the same at all positions'], 'NΦ = NBA cos θ is largest when the normal is along the field.', ['C1: normal along B', 'C1: NBA'])
N('M', 4, 'A 0.25 m rod moving across a 0.20 T field has an e.m.f. of 0.15 V across it. Using E_field = vB inside the rod, calculate the speed of the rod.', 0.15 / 0.25 / 0.20, 'm s⁻¹',
  'Electric field in rod = 0.15 ÷ 0.25 = 0.60 V m⁻¹. v = E_field/B = 0.60 ÷ 0.20 = 3.0 m s⁻¹', ['C1: field = e.m.f./L', 'M1: eE = Bev', 'C1: v'], sig=2, aq='v')
N('M', 3, 'A 100-turn coil of area 0.010 m² rotates at 100 rad s⁻¹ in a field of 0.20 T. Calculate the peak e.m.f., using E₀ = NBAω.', 100 * 0.20 * 0.010 * 100, 'V',
  'E₀ = NBAω = 100 × 0.20 × 0.010 × 100 = 20 V', ['C1: E₀ = NBAω', 'C1: value'], sig=2, aq='E₀')
M('M', 3, 'A stationary coil is placed in a magnetic field whose strength is changing. Why is an e.m.f. induced, although nothing moves?', 'The flux linkage is changing, and Faraday\'s law depends only on the rate of change of flux linkage', ['A moving field always contains moving charges', 'The coil becomes magnetised', 'The changing field heats the coil'], 'It does not matter whether the flux changes because of motion or because B changes.', ['C1: changing NΦ', 'C1: cause irrelevant'])
# hard
N('H', 5, '(a) A rod of length L moves at speed v at right angles to a field B. By considering the forces on a free electron when charge stops building up, show that the e.m.f. is BLv. (b) Calculate the e.m.f. for L = 0.30 m, v = 2.0 m s⁻¹ and B = 0.50 T. Give only the answer to (b).', 0.50 * 0.30 * 2.0, 'V',
  '(a) In equilibrium eE = Bev, so E = vB; the p.d. across the rod is EL = BLv. (b) e.m.f. = 0.50 × 0.30 × 2.0 = 0.30 V',
  ['M1: eE = Bev', 'B1: E = vB', 'B1: V = EL = BLv', 'C1: value'], sig=2, aq='E')
N('H', 6, 'The flux linkage of a coil changes as follows: it rises steadily from 0 to 0.12 Wb between t = 0 and 0.040 s, stays constant until 0.080 s, then falls steadily to zero by 0.10 s. (a) Calculate the e.m.f. during the rise. (b) State the e.m.f. while it is constant. (c) Calculate the size of the e.m.f. during the fall. (d) Explain why the e.m.f.s in (a) and (c) have opposite signs. Give only the answer to (c).', 0.12 / 0.020, 'V',
  '(a) E = 0.12 ÷ 0.040 = 3.0 V. (b) Zero. (c) E = 0.12 ÷ (0.10 − 0.080) = 6.0 V. (d) The flux linkage increases in one case and decreases in the other, so the gradients have opposite signs.',
  ['C1: gradient during rise', 'B1: zero when constant', 'C1: fall time 0.020 s', 'C1: value', 'B1: opposite gradients'], sig=2, aq='E')
N('H', 5, 'A 50-turn coil of area 0.020 m² rotates at 10 revolutions per second in a field of 0.30 T. (a) Calculate the peak e.m.f., using E₀ = NBA × 2πf. (b) Calculate the average e.m.f. during a quarter turn from maximum flux linkage. Give only the answer to (a).', 50 * 0.30 * 0.020 * 2 * pi * 10, 'V',
  f'(a) E₀ = 50 × 0.30 × 0.020 × 2π × 10 = {sf(50 * 0.3 * 0.02 * 2 * pi * 10)} V. (b) Δ(NΦ) = 50 × 0.30 × 0.020 = 0.30 Wb in a quarter period of 0.025 s, so E = 0.30 ÷ 0.025 = 12 V.',
  ['C1: ω = 2πf', 'C1: E₀ = NBAω', 'C1: quarter period', 'C1: average e.m.f.'], aq='E₀')
N('H', 6, 'A square coil of 10 turns and side 0.10 m moves at 0.50 m s⁻¹ into a region of uniform field 0.40 T, with its plane at right angles to the field. The region is wider than the coil. (a) Calculate the e.m.f. while the coil is entering. (b) State the e.m.f. once the coil is completely inside. (c) Calculate the maximum flux linkage. (d) Explain why the e.m.f. reverses as the coil leaves. Give only the answer to (a).', 10 * 0.40 * 0.10 * 0.50, 'V',
  '(a) E = NBLv = 10 × 0.40 × 0.10 × 0.50 = 0.20 V. (b) Zero, because the flux linkage is constant. (c) NBA = 10 × 0.40 × 0.10² = 0.040 Wb. (d) The flux linkage then decreases, so its rate of change has the opposite sign.',
  ['C1: E = NBLv', 'B1: zero inside', 'C1: NBA', 'B1: decreasing flux reverses e.m.f.', 'C1: value'], sig=2, aq='E')
N('H', 5, 'A 200-turn search coil of area 1.0 × 10⁻⁴ m² is placed face-on in an alternating field B = B₀ sin ωt with B₀ = 0.010 T and frequency 50 Hz. (a) Show that the peak e.m.f. is NAB₀ω. (b) Calculate it. Give only the answer to (b).', 200 * 1.0e-4 * 0.010 * 2 * pi * 50, 'V',
  f'(a) NΦ = NAB₀ sin ωt, so E = NAB₀ω cos ωt with peak NAB₀ω. (b) E₀ = 200 × 1.0 × 10⁻⁴ × 0.010 × 2π × 50 = {sf(200 * 1e-4 * 0.01 * 2 * pi * 50)} V',
  ['M1: differentiate NΦ', 'B1: peak NAB₀ω', 'C1: ω = 2πf', 'C1: value'], aq='E₀')
N('H', 6, 'A long solenoid with 2000 turns per metre has a 100-turn coil of area 4.0 × 10⁻⁴ m² wound round its middle. The solenoid current rises steadily from 0 to 3.0 A in 0.050 s. (a) Calculate the change in flux density inside the solenoid, using B = µ₀nI. (b) Calculate the change in flux linkage of the coil. (c) Calculate the induced e.m.f., in mV. Give only the answer to (c).' + take('mu0'), 100 * 4.0e-4 * MU0 * 2000 * 3.0 / 0.050 * 1000, 'mV',
  f'(a) ΔB = 4π × 10⁻⁷ × 2000 × 3.0 = {sf(MU0 * 6000)} T. (b) Δ(NΦ) = 100 × 4.0 × 10⁻⁴ × {sf(MU0 * 6000, 4)} = {sf(100 * 4e-4 * MU0 * 6000)} Wb. (c) E = {sf(100 * 4e-4 * MU0 * 6000, 4)} ÷ 0.050 = {sf(100 * 4e-4 * MU0 * 6000 / 0.05)} V. In mV: {sf(100 * 4e-4 * MU0 * 6000 / 0.05, 4)} × 1000 = {sf(100 * 4e-4 * MU0 * 6000 / 0.05 * 1000)}',
  ['C1: ΔB = µ₀nΔI', 'C1: Δ(NΦ)', 'C1: E = Δ(NΦ)/Δt', 'C1: conversion', 'M1: same flux through coil'], aq='E')
N('H', 5, 'A rod 0.50 m long carrying an induced current of 2.0 A moves at 3.0 m s⁻¹ across a field of 0.40 T. (a) Calculate the magnetic force on the rod. (b) Explain why this force opposes the motion. (c) Calculate the rate at which work must be done to keep the rod moving. Give only the answer to (c).', 0.40 * 2.0 * 0.50 * 3.0, 'W',
  '(a) F = BIL = 0.40 × 2.0 × 0.50 = 0.40 N. (b) If it helped the motion, the rod would speed up and gain energy from nowhere. (c) P = Fv = 0.40 × 3.0 = 1.2 W',
  ['C1: F = BIL', 'B1: energy conservation', 'C1: P = Fv', 'C1: value'], sig=2, aq='P')
N('H', 5, 'A 1000-turn coil of area 0.010 m² hangs with its plane vertical, facing north, where the Earth\'s horizontal field is 2.0 × 10⁻⁵ T. It is turned through 180° in 0.10 s. (a) Calculate the initial flux linkage. (b) Calculate the change in flux linkage. (c) Calculate the average e.m.f., in mV. Give only the answer to (c).', 2 * 1000 * 2.0e-5 * 0.010 / 0.10 * 1000, 'mV',
  '(a) NΦ = 1000 × 2.0 × 10⁻⁵ × 0.010 = 2.0 × 10⁻⁴ Wb. (b) It reverses: change = 2 × 2.0 × 10⁻⁴ = 4.0 × 10⁻⁴ Wb. (c) E = 4.0 × 10⁻⁴ ÷ 0.10 = 4.0 × 10⁻³ V. In mV: 4.0 × 10⁻³ × 1000 = 4.0',
  ['C1: NBA', 'B1: reversal doubles change', 'C1: E', 'C1: conversion'], sig=2, aq='E')
N('H', 5, 'An e.m.f. pulse from a coil has an area under its e.m.f.–time graph of 3.0 × 10⁻³ V s. (a) State what this area represents. (b) Give the change in flux linkage, in mWb. (c) The coil has 150 turns. Calculate the change in flux through each turn. Give only the answer to (b).', 3.0, 'mWb',
  '(a) The change in flux linkage, since ∫E dt = Δ(NΦ). (b) 3.0 × 10⁻³ Wb. In mWb: 3.0 × 10⁻³ × 1000 = 3.0. (c) ΔΦ = 3.0 × 10⁻³ ÷ 150 = 2.0 × 10⁻⁵ Wb.',
  ['B1: area = Δ(NΦ)', 'C1: value in mWb', 'C1: ÷ N', 'B1: V s = Wb'], sig=2, aq='Δ(NΦ)')

# ═════════════════════════ 26.3 Electromagnetic induction (17/15/10) ═════════════════════════
lesson('26.3')
N('E', 2, 'The flux through each turn of a 250-turn coil changes by 1.6 × 10⁻⁴ Wb in 0.040 s. Calculate the average e.m.f.', 250 * 1.6e-4 / 0.040, 'V',
  'E = NΔΦ/Δt = 250 × 1.6 × 10⁻⁴ ÷ 0.040 = 1.0 V', ['C1: E = NΔΦ/Δt'], sig=2, aq='E')
N('E', 2, 'A 60-turn coil of area 0.0050 m² is face-on to a field that rises from 0 to 0.40 T in 0.20 s. Calculate the average e.m.f.', 60 * 0.0050 * 0.40 / 0.20, 'V',
  'E = NAΔB/Δt = 60 × 0.0050 × 0.40 ÷ 0.20 = 0.60 V', ['C1: E = NAΔB/Δt'], sig=2, aq='E')
M('E', 1, 'In Faraday\'s law written as E = −d(NΦ)/dt, what does the minus sign represent?', 'Lenz\'s law: the induced e.m.f. opposes the change producing it', ['That the e.m.f. is always negative', 'That flux is a vector', 'That energy is lost as heat'], 'The sign shows the direction of the induced e.m.f.')
N('E', 2, 'A flux linkage change of 0.050 Wb produces an average e.m.f. of 2.5 V. How long did the change take?', 0.050 / 2.5, 's',
  'Δt = Δ(NΦ)/E = 0.050 ÷ 2.5 = 0.020 s', ['C1: rearranged'], sig=2, aq='Δt')
M('E', 1, 'A coil sits in a strong, constant magnetic field. What e.m.f. is induced?', 'None, because the flux linkage is not changing', ['A large e.m.f., because the field is strong', 'A small alternating e.m.f.', 'An e.m.f. equal to NBA'], 'Only a change of flux linkage induces an e.m.f.')
N('E', 2, 'A 0.15 m conductor on a wheel moves at 12 m s⁻¹ at right angles to a 0.25 T field. Calculate the e.m.f. induced across it.', 0.25 * 0.15 * 12, 'V',
  'E = BLv = 0.25 × 0.15 × 12 = 0.45 V', ['C1: E = BLv'], sig=2, aq='E')
M('E', 1, 'From which graph can the induced e.m.f. in a coil be found as the gradient?', 'Flux linkage against time', ['Flux linkage against current', 'Current against time', 'e.m.f. against time'], 'E = d(NΦ)/dt, the gradient of the flux linkage against time graph.')
N('E', 2, 'A single loop of area 0.030 m² is face-on to a field increasing at 0.50 T s⁻¹. Calculate the induced e.m.f.', 0.030 * 0.50, 'V',
  'E = A dB/dt = 0.030 × 0.50 = 0.015 V', ['C1: E = A dB/dt'], sig=2, aq='E')
M('E', 1, 'The rate of change of flux linkage in a coil is doubled. What happens to the induced e.m.f.?', 'It doubles', ['It halves', 'It stays the same', 'It quadruples'], 'E is equal to the rate of change of flux linkage.')
N('E', 2, 'An average e.m.f. of 0.30 V is induced in a coil for 0.50 s. Calculate the change in flux linkage.', 0.30 * 0.50, 'Wb',
  'Δ(NΦ) = E × Δt = 0.30 × 0.50 = 0.15 Wb', ['C1: Δ(NΦ) = EΔt'], sig=2, aq='Δ(NΦ)')
M('E', 1, 'What does the size of the induced e.m.f. in a coil depend on?', 'The rate at which the flux linkage changes', ['The size of the flux linkage', 'The resistance of the coil only', 'The direction of the field only'], 'A large but constant flux gives no e.m.f.')
N('E', 2, 'Ten turns of wire enclose an area of 0.020 m². The field through them is switched from +0.30 T to −0.30 T in 0.10 s. Find the average e.m.f.', 10 * 0.020 * 0.60 / 0.10, 'V',
  'ΔB = 0.30 − (−0.30) = 0.60 T. E = NAΔB/Δt = 10 × 0.020 × 0.60 ÷ 0.10 = 1.2 V', ['C1: ΔB includes reversal'], sig=2, aq='E')
M('E', 1, 'The same change of flux linkage happens in four different times. When is the induced e.m.f. largest?', 'When the change happens in the shortest time', ['When it happens in the longest time', 'It is the same in each case', 'When the flux linkage is largest'], 'E = Δ(NΦ)/Δt, so for the same change the shortest time gives the largest e.m.f.')
N('E', 1, 'A flux change induces an average e.m.f. of 0.80 V. The same change is made in twice the time. What is the new average e.m.f.?', 0.40, 'V', 'E ∝ 1/Δt: 0.80 ÷ 2 = 0.40 V', [], sig=2, aq='E')
M('E', 1, 'How is the e.m.f. E = BLv for a moving rod related to Faraday\'s law?', 'It is Faraday\'s law applied to the flux the rod sweeps out per second, BLv', ['It is a separate law that has nothing to do with flux', 'It applies only to coils', 'It gives the current, not the e.m.f.'], 'Flux swept per second = B × (L × v).')
N('E', 2, 'A magnet is pulled out of an 80-turn coil, and the flux through each turn falls from 5.0 × 10⁻⁵ Wb to zero in 0.025 s. Calculate the average e.m.f.', 80 * 5.0e-5 / 0.025, 'V',
  'E = NΔΦ/Δt = 80 × 5.0 × 10⁻⁵ ÷ 0.025 = 0.16 V', ['C1: E = NΔΦ/Δt'], sig=2, aq='E')
M('E', 1, 'A changing magnetic field passes through a coil whose ends are not connected. Which statement is correct?', 'An e.m.f. is induced across the ends but no current flows', ['No e.m.f. is induced', 'A current flows but there is no e.m.f.', 'The coil becomes a permanent magnet'], 'Faraday\'s law gives the e.m.f.; a current needs a closed circuit.')
# medium
N('M', 3, 'A graph of flux linkage against time for a coil is a straight line from 0.020 Wb at t = 0 to 0.080 Wb at t = 0.050 s. Calculate the induced e.m.f.', (0.080 - 0.020) / 0.050, 'V',
  'E = gradient = (0.080 − 0.020) ÷ 0.050 = 1.2 V', ['C1: gradient of NΦ–t', 'C1: value'], sig=2, aq='E')
N('M', 3, 'A 50-turn coil in a constant field of 0.20 T is squashed so that its area falls from 0.010 m² to 0.0040 m² in 0.30 s. Calculate the average e.m.f.', 50 * 0.20 * (0.010 - 0.0040) / 0.30, 'V',
  'Δ(NΦ) = NBΔA = 50 × 0.20 × (0.010 − 0.0040) = 0.060 Wb. E = 0.060 ÷ 0.30 = 0.20 V', ['C1: ΔA', 'C1: E = NBΔA/Δt'], sig=2, aq='E')
M('M', 3, 'The flux density through a coil increases at a steady rate. Which describes the graph of induced e.m.f. against time?', 'A horizontal line: the e.m.f. is constant', ['A straight line rising from the origin', 'A curve that levels off', 'A sine curve'], 'A constant rate of change of flux gives a constant e.m.f.', ['C1: constant dΦ/dt', 'C1: constant E'])
N('M', 4, 'The field inside a solenoid falls steadily from 0.12 T to zero in 0.060 s. A 150-turn coil of radius 1.0 cm is wound round the solenoid. Calculate the average e.m.f., in mV.', 150 * pi * 0.010 ** 2 * 0.12 / 0.060 * 1000, 'mV',
  f'A = π × 0.010² = {sf(pi * 1e-4)} m². E = NAΔB/Δt = 150 × {sf(pi * 1e-4, 4)} × 0.12 ÷ 0.060 = {sf(150 * pi * 1e-4 * 2)} V. In mV: {sf(150 * pi * 1e-4 * 2, 4)} × 1000 = {sf(150 * pi * 1e-4 * 2 * 1000)}', ['C1: area', 'C1: E = NAΔB/Δt', 'C1: conversion'], aq='E')
N('M', 3, 'A 0.10 m rod moves at 2.0 m s⁻¹ along rails across a 0.50 T field. The total circuit resistance is 0.20 Ω. Calculate the current.', 0.50 * 0.10 * 2.0 / 0.20, 'A',
  'E = BLv = 0.50 × 0.10 × 2.0 = 0.10 V. I = 0.10 ÷ 0.20 = 0.50 A', ['C1: E = BLv', 'C1: I = E/R'], sig=2, aq='I')
M('M', 3, 'The number of turns on a coil is doubled and the same change of flux per turn takes half as long. By what factor does the e.m.f. change?', '4', ['2', '1', '½'], 'E = NΔΦ/Δt: 2 ÷ ½ = 4.', ['C1: E ∝ N/Δt', 'C1: factor 4'])
N('M', 3, 'A 300-turn coil of area 4.0 × 10⁻³ m² is turned from face-on to edge-on in a field of 0.050 T in 0.025 s. Calculate the average e.m.f.', 300 * 0.050 * 4.0e-3 / 0.025, 'V',
  'Δ(NΦ) = NBA = 300 × 0.050 × 4.0 × 10⁻³ = 0.060 Wb. E = 0.060 ÷ 0.025 = 2.4 V', ['C1: flux linkage change', 'C1: E'], sig=2, aq='E')
N('M', 4, 'A 0.30 m rod moves across a 0.40 T field and must produce an average e.m.f. of 0.24 V while it moves 0.50 m. How long should the movement take?', 0.40 * 0.30 * 0.50 / 0.24, 's',
  'Flux swept = BLd = 0.40 × 0.30 × 0.50 = 0.060 Wb. t = 0.060 ÷ 0.24 = 0.25 s', ['C1: flux swept', 'M1: E = flux/t', 'C1: t'], sig=2, aq='t')
M('M', 3, 'Which equation expresses Faraday\'s and Lenz\'s laws together?', 'E = −d(NΦ)/dt', ['E = +NΦ', 'E = BIL', 'E = −NΦ/t²'], 'The magnitude is the rate of change of flux linkage; the sign gives the opposing direction.', ['C1: rate of change', 'C1: minus sign'])
N('M', 3, 'A 400-turn coil has an induced e.m.f. of 1.2 V. Calculate the rate of change of flux through each turn.', 1.2 / 400, 'Wb s⁻¹',
  'dΦ/dt = E/N = 1.2 ÷ 400 = 3.0 × 10⁻³ Wb s⁻¹', ['C1: E = N dΦ/dt', 'C1: value'], sig=2, aq='dΦ/dt')
N('M', 3, 'A 500-turn coil of area 2.0 × 10⁻³ m² faces a changing field and has an e.m.f. of 2.0 V. Calculate the rate of change of the flux density.', 2.0 / (500 * 2.0e-3), 'T s⁻¹',
  'dB/dt = E/(NA) = 2.0 ÷ (500 × 2.0 × 10⁻³) = 2.0 T s⁻¹', ['C1: rearranged', 'C1: value'], sig=2, aq='dB/dt')
M('M', 4, 'A coil is pulled out of a magnetic field, first slowly and then quickly. Which statement is correct?', 'The quick pull gives a larger e.m.f. for a shorter time; the total change of flux linkage is the same', ['The slow pull gives the larger e.m.f.', 'Both give the same e.m.f.', 'The quick pull changes the flux linkage more'], 'The same Δ(NΦ) over a shorter Δt gives a larger E.', ['C1: same Δ(NΦ)', 'C1: E ∝ 1/Δt', 'C1: area under E–t same'])
N('M', 3, 'A flux linkage change of 0.030 Wb takes place in 0.050 s in a coil connected to a total resistance of 4.0 Ω. Calculate the average current.', 0.030 / 0.050 / 4.0, 'A',
  'E = 0.030 ÷ 0.050 = 0.60 V. I = 0.60 ÷ 4.0 = 0.15 A', ['C1: average e.m.f.', 'C1: I = E/R'], sig=2, aq='I')
N('M', 4, 'A coil of total resistance 4.0 Ω has its flux linkage changed by 0.030 Wb. Calculate the charge that flows, in mC.', 0.030 / 4.0 * 1000, 'mC',
  'Q = Δ(NΦ)/R = 0.030 ÷ 4.0 = 7.5 × 10⁻³ C. In mC: 7.5 × 10⁻³ × 1000 = 7.5', ['M1: Q = It = (E/R)t', 'C1: Q = Δ(NΦ)/R', 'C1: conversion'], sig=2, aq='Q')
M('M', 3, 'The flux linkage of a rotating coil varies as a sine curve. At which points is the induced e.m.f. greatest?', 'Where the flux linkage is zero', ['Where the flux linkage is a maximum', 'Where the flux linkage is a minimum only', 'It is constant throughout'], 'The gradient of a sine curve is greatest where it crosses zero.', ['C1: E = gradient', 'C1: steepest at zero'])
# hard
N('H', 6, 'A 200-turn coil of area 2.0 × 10⁻³ m² is face-on to a field that rises steadily from 0 to 0.50 T in 0.20 s, stays constant for 0.30 s, then falls steadily to zero in 0.10 s. (a) Calculate the e.m.f. during the rise. (b) State the e.m.f. while the field is constant. (c) Calculate the size of the e.m.f. during the fall. Give only the answer to (c).', 200 * 2.0e-3 * 0.50 / 0.10, 'V',
  '(a) E = 200 × 2.0 × 10⁻³ × 0.50 ÷ 0.20 = 1.0 V. (b) Zero. (c) E = 200 × 2.0 × 10⁻³ × 0.50 ÷ 0.10 = 2.0 V, in the opposite direction.',
  ['C1: rise e.m.f.', 'B1: zero when constant', 'C1: fall e.m.f.', 'B1: opposite sign', 'M1: E = NA dB/dt'], sig=2, aq='E')
N('H', 5, 'A generator coil of 500 turns and area 0.010 m² turns at 3000 revolutions per minute in a field of 0.15 T. (a) Calculate its angular speed. (b) Calculate the peak e.m.f., using E₀ = NBAω. Give only the answer to (b).', 500 * 0.15 * 0.010 * 3000 * 2 * pi / 60, 'V',
  f'(a) ω = 3000 × 2π ÷ 60 = {sf(3000 * 2 * pi / 60)} rad s⁻¹. (b) E₀ = 500 × 0.15 × 0.010 × {sf(3000 * 2 * pi / 60, 4)} = {sf(500 * 0.15 * 0.01 * 3000 * 2 * pi / 60)} V',
  ['C1: rev min⁻¹ to rad s⁻¹', 'C1: E₀ = NBAω', 'C1: substitution', 'C1: value'], aq='E₀')
N('H', 6, 'A rod 0.20 m long rests on horizontal rails joined by a 0.40 Ω resistor, at right angles to a vertical field of 0.50 T. A constant horizontal force of 0.10 N pulls the rod. (a) Show that the opposing magnetic force at speed v is B²L²v/R. (b) Explain why the rod reaches a terminal speed. (c) Calculate the terminal speed. Give only the answer to (c).', 0.10 * 0.40 / (0.50 ** 2 * 0.20 ** 2), 'm s⁻¹',
  '(a) E = BLv, I = BLv/R, F = BIL = B²L²v/R. (b) The opposing force grows with speed until it equals 0.10 N. (c) v = FR/(B²L²) = 0.10 × 0.40 ÷ (0.50² × 0.20²) = 4.0 m s⁻¹',
  ['M1: chain E → I → F', 'B1: B²L²v/R', 'B1: force grows with speed', 'C1: rearranged', 'C1: value'], sig=2, aq='v')
N('H', 5, 'A 50-turn search coil of area 2.0 × 10⁻⁴ m², connected to a circuit of total resistance 25 Ω, is pulled quickly out of a magnetic field. A charge of 1.2 × 10⁻⁴ C flows. (a) Calculate the change in flux linkage. (b) Calculate the flux density. Give only the answer to (b).', 1.2e-4 * 25 / (50 * 2.0e-4), 'T',
  '(a) Δ(NΦ) = QR = 1.2 × 10⁻⁴ × 25 = 3.0 × 10⁻³ Wb. (b) B = Δ(NΦ)/(NA) = 3.0 × 10⁻³ ÷ (50 × 2.0 × 10⁻⁴) = 0.30 T',
  ['M1: Q = Δ(NΦ)/R', 'C1: Δ(NΦ)', 'C1: B = Δ(NΦ)/(NA)', 'C1: value'], sig=2, aq='B')
N('H', 6, 'A 100-turn coil of area 0.0050 m² rotates in a uniform field. The peak e.m.f. is measured at different frequencies: f/Hz = 5.0, 10, 15, 20 and E₀/V = 1.6, 3.1, 4.7, 6.3. (a) Show that E₀ is proportional to f. (b) Calculate the gradient of the E₀–f graph using the first and last points. (c) Use E₀ = NBA × 2πf to find B. Give only the answer to (c).', (6.3 - 1.6) / 15 / (2 * pi * 100 * 0.0050), 'T',
  f'(a) E₀/f ≈ 0.31 V Hz⁻¹ for every reading. (b) Gradient = (6.3 − 1.6) ÷ (20 − 5.0) = {sf(4.7 / 15)} V s. (c) B = gradient ÷ (2πNA) = {sf(4.7 / 15, 4)} ÷ (2π × 100 × 0.0050) = {sf(4.7 / 15 / (2 * pi * 0.5))} T',
  ['B1: E₀/f constant', 'C1: gradient', 'M1: gradient = 2πNBA', 'C1: rearranged', 'C1: value'], aq='B')
N('H', 5, 'A long solenoid with 1000 turns per metre carries a current I = 2.0 + 5.0t (in A, with t in s). A 50-turn coil of area 3.0 × 10⁻⁴ m² is wound round it. (a) Calculate the rate of change of the field inside, using B = µ₀nI. (b) Calculate the e.m.f. induced in the coil, in µV. Give only the answer to (b).' + take('mu0'), 50 * 3.0e-4 * MU0 * 1000 * 5.0 * 1e6, 'µV',
  f'(a) dB/dt = µ₀n dI/dt = 4π × 10⁻⁷ × 1000 × 5.0 = {sf(MU0 * 5000)} T s⁻¹. (b) E = NA dB/dt = 50 × 3.0 × 10⁻⁴ × {sf(MU0 * 5000, 4)} = {sf(50 * 3e-4 * MU0 * 5000)} V. In µV: {sf(50 * 3e-4 * MU0 * 5000, 4)} × 10⁶ = {sf(50 * 3e-4 * MU0 * 5000 * 1e6)}',
  ['C1: dI/dt = 5.0 A s⁻¹', 'C1: dB/dt', 'C1: E = NA dB/dt', 'C1: conversion'], aq='E')
N('H', 6, 'A rod with resistance 0.50 Ω moves at 3.0 m s⁻¹ along rails across a 0.40 T field. The rod is 0.50 m long and the rails are joined by a 1.5 Ω resistor. (a) Calculate the e.m.f. (b) Calculate the current. (c) Calculate the p.d. across the 1.5 Ω resistor. Give only the answer to (c).', 0.40 * 0.50 * 3.0 / 2.0 * 1.5, 'V',
  '(a) E = 0.40 × 0.50 × 3.0 = 0.60 V. (b) I = 0.60 ÷ (1.5 + 0.50) = 0.30 A. (c) V = IR = 0.30 × 1.5 = 0.45 V: less than the e.m.f. because of the rod\'s internal resistance.',
  ['C1: E = BLv', 'M1: rod acts as source with internal resistance', 'C1: I', 'C1: V = IR', 'B1: lost volts in rod'], sig=2, aq='V')
N('H', 5, 'For a sinusoidal supply, the r.m.s. voltage across a transformer\'s primary coil is related to the peak flux Φ₀ in its core by V = 4.44fNΦ₀. A primary coil of 1000 turns is connected to 230 V at 50 Hz. (a) Calculate the peak flux in the core, in mWb. (b) Explain why the core needs to be made of a magnetic material. Give only the answer to (a).', 230 / (4.44 * 50 * 1000) * 1000, 'mWb',
  f'(a) Φ₀ = 230 ÷ (4.44 × 50 × 1000) = {sf(230 / (4.44 * 50 * 1000))} Wb. In mWb: {sf(230 / (4.44 * 50 * 1000), 4)} × 1000 = {sf(230 / (4.44 * 50 * 1000) * 1000)}. (b) Iron concentrates the flux, so a large flux links both coils with a small magnetising current.',
  ['C1: rearranged', 'C1: substitution', 'C1: conversion', 'B1: core concentrates and links flux'], aq='Φ₀')
N('H', 6, 'A circular loop of wire lies face-on to a field of 0.50 T. Its radius is decreasing at 0.020 m s⁻¹, and is 0.10 m at the instant considered. (a) Show that the rate of change of area is 2πr dr/dt. (b) Calculate the induced e.m.f. at this instant, in mV. Give only the answer to (b).', 0.50 * 2 * pi * 0.10 * 0.020 * 1000, 'mV',
  f'(a) A = πr², so dA/dt = 2πr dr/dt. (b) E = B dA/dt = 0.50 × 2π × 0.10 × 0.020 = {sf(0.5 * 2 * pi * 0.1 * 0.02)} V. In mV: {sf(0.5 * 2 * pi * 0.1 * 0.02, 4)} × 1000 = {sf(0.5 * 2 * pi * 0.1 * 0.02 * 1000)}',
  ['M1: differentiate A = πr²', 'B1: 2πr dr/dt', 'C1: E = B dA/dt', 'C1: substitution', 'C1: conversion'], aq='E')
N('H', 5, 'A 2000-turn coil of area 0.020 m² lies flat on a bench where the vertical component of the Earth\'s field is 4.5 × 10⁻⁵ T. It is flipped over in 0.10 s. (a) Calculate the change in flux linkage. (b) Calculate the average e.m.f., in mV. Give only the answer to (b).', 2 * 2000 * 4.5e-5 * 0.020 / 0.10 * 1000, 'mV',
  '(a) Δ(NΦ) = 2NBA = 2 × 2000 × 4.5 × 10⁻⁵ × 0.020 = 3.6 × 10⁻³ Wb. (b) E = 3.6 × 10⁻³ ÷ 0.10 = 0.036 V. In mV: 0.036 × 1000 = 36',
  ['B1: flipping doubles change', 'C1: Δ(NΦ)', 'C1: E', 'C1: conversion'], sig=2, aq='E')
