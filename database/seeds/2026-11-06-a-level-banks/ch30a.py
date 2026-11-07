# Chapter 30 Medical physics — part a: 30.1 to 30.4.
HP, CL, QE, ME = 6.63e-34, 3.00e8, 1.60e-19, 9.11e-31
HC = HP * CL
LN2 = log(2)


def lam_min(volts):
    return HC / (QE * volts)


# ═════════════════════════ 30.1 X-ray imaging and CT (17/16/9) ═════════════════════════
lesson('30.1')
N('E', 1, 'An X-ray tube has 120 kV across it. What is the greatest photon energy it can produce, in keV?', 120, 'keV',
  'An electron gains 1 eV per volt: E(max) = 1 × 120 = 120 keV', [], sig=3, aq='E(max)')
M('E', 1, 'Which process produces the continuous spectrum of X-rays in an X-ray tube?', 'Fast electrons decelerating rapidly in the target', ['Electrons falling between energy levels in the filament', 'The target glowing because it is hot', 'Positrons annihilating in the target'], 'This braking radiation (bremsstrahlung) has a continuous range of photon energies.')
N('E', 2, 'Calculate the shortest wavelength of the X-rays from a tube operating at 40 kV, in units of 10⁻¹¹ m.' + take('h', 'c', 'e'), lam_min(40e3), '10⁻¹¹ m',
  f'λ(min) = hc/eV = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (1.60 × 10⁻¹⁹ × 40 × 10³) = {sf(lam_min(40e3))} m', ['C1: eV = hc/λ(min)'], aq='λ(min)')
M('E', 1, 'Why is tungsten used for the target of an X-ray tube?', 'It has a very high melting point and a high proton number', ['It is a good thermal insulator', 'It emits electrons easily', 'It is transparent to X-rays'], 'About 99% of the beam energy becomes heat, and high Z gives efficient X-ray production.')
N('E', 2, 'Electrons in an X-ray tube are accelerated through 30 kV. Calculate the kinetic energy of each electron at the target, in units of 10⁻¹⁵ J.' + take('e'), 30e3 * QE, '10⁻¹⁵ J',
  'Ek = eV = 1.60 × 10⁻¹⁹ × 30 × 10³ = 4.8 × 10⁻¹⁵ J', ['C1: Ek = eV'], sig=2, aq='Ek')
M('E', 1, 'What causes the sharp lines (characteristic X-rays) in an X-ray spectrum?', 'Electrons in target atoms dropping into vacancies in inner shells', ['Electrons slowing down gradually', 'The filament emitting light', 'X-rays reflecting from the target'], 'The line energies are set by the target element\'s inner-shell levels.')
N('E', 2, 'An X-ray tube carries a current of 5.0 mA. How many electrons strike the target each second?' + take('e'), 5.0e-3 / QE, None,
  f'n = I/e = 5.0 × 10⁻³ ÷ 1.60 × 10⁻¹⁹ = {sf(5e-3 / QE)}', ['C1: n = I/e'], aq='n')
M('E', 1, 'Why is the inside of an X-ray tube a vacuum?', 'So that the electrons are not stopped by collisions with gas molecules', ['To keep the tube cool', 'To stop the X-rays escaping', 'To make the filament glow'], 'Electrons must reach the target with their full energy.')
N('E', 2, 'An X-ray tube operates at 100 kV with a current of 10 mA. Calculate the electrical power input in kW.', 100e3 * 10e-3 / 1e3, 'kW',
  'P = VI = 100 × 10³ × 10 × 10⁻³ = 1000 W, which is 1000 ÷ 1000 = 1.0 kW', ['C1: P = VI'], sig=2, aq='P')
M('E', 1, 'In an X-ray tube, most of the electrons\' kinetic energy becomes', 'thermal energy in the target', ['X-ray photons', 'light', 'sound'], 'Typically only about 1% becomes X-rays.')
N('E', 2, 'An X-ray tube takes 1000 W of electrical power and is 1.0% efficient at producing X-rays. Calculate the X-ray power.', 0.010 * 1000, 'W',
  'P = 0.010 × 1000 = 10 W', ['C1: efficiency × input'], sig=2, aq='P')
M('E', 1, 'Which control on an X-ray machine changes the intensity of the beam without changing the photon energies?', 'The tube current', ['The accelerating voltage', 'The target material', 'The aluminium filter'], 'More electrons per second give more X-ray photons per second.')
N('E', 2, 'Calculate the shortest X-ray wavelength produced at 100 kV, in units of 10⁻¹² m.' + take('h', 'c', 'e'), lam_min(100e3), '10⁻¹² m',
  f'λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (1.60 × 10⁻¹⁹ × 100 × 10³) = {sf(lam_min(100e3))} m', ['C1: λ = hc/eV'], aq='λ(min)')
M('E', 1, 'What sets the hardness (penetrating power) of an X-ray beam?', 'The accelerating voltage across the tube', ['The tube current', 'The exposure time', 'The distance to the patient'], 'Higher voltage gives higher photon energies.')
N('E', 2, 'An X-ray tube works at 80 kV and 20 mA, and 99% of the input power becomes heat in the anode. Calculate the rate of heat production.', 0.99 * 80e3 * 20e-3, 'W',
  f'P = 0.99 × 80 × 10³ × 20 × 10⁻³ = {sf(0.99 * 1600)} W', ['C1: 99% of VI'], aq='P')
M('E', 1, 'Why do bones appear white on an X-ray film or digital image?', 'Bone absorbs X-rays strongly, so little radiation reaches the detector behind it', ['Bone emits light when X-rays hit it', 'X-rays pass easily through bone', 'Bone reflects X-rays back to the tube'], 'Less exposure of the detector gives a lighter area.')
N('E', 1, 'Calculate the highest X-ray frequency produced by a tube at 50 kV, in units of 10¹⁹ Hz.' + take('e', 'h'), 50e3 * QE / HP, '10¹⁹ Hz',
  f'f = eV/h = 1.60 × 10⁻¹⁹ × 50 × 10³ ÷ 6.63 × 10⁻³⁴ = {sf(50e3 * QE / HP)} Hz', [], aq='f(max)')
# medium
N('M', 3, 'A dental X-ray tube runs at 25 kV. Calculate the cut-off wavelength of its spectrum, in units of 10⁻¹¹ m.' + take('h', 'c', 'e'), lam_min(25e3), '10⁻¹¹ m',
  f'λ(min) = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (1.60 × 10⁻¹⁹ × 25 × 10³) = {sf(lam_min(25e3))} m', ['C1: eV = hc/λ', 'C1: kV to V'], aq='λ(min)')
N('M', 3, 'What tube voltage, in kV, is needed for the X-ray spectrum to extend down to 0.020 nm?' + take('h', 'c', 'e'), HC / (QE * 0.020e-9) / 1e3, 'kV',
  f'V = hc/eλ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (1.60 × 10⁻¹⁹ × 0.020 × 10⁻⁹) = {sf(HC / (QE * 0.02e-9), 4)} V. In kV: {sf(HC / (QE * 0.02e-9), 4)} ÷ 10³ = {sf(HC / (QE * 0.02e-9) / 1e3)}', ['C1: V = hc/eλ', 'C1: nm to m'], aq='V')
M('M', 3, 'The voltage across an X-ray tube is increased, with the current unchanged. How does the spectrum change?', 'The minimum wavelength decreases and the intensity increases; the characteristic lines stay at the same wavelengths', ['The characteristic lines move to shorter wavelengths', 'The minimum wavelength increases', 'Only the intensity changes'], 'λ(min) = hc/eV; line wavelengths depend on the target element.', ['C1: λ(min) falls', 'C1: lines fixed'])
M('M', 3, 'The current in an X-ray tube is doubled, with the voltage unchanged. How does the spectrum change?', 'The intensity at every wavelength doubles; the shape and the minimum wavelength are unchanged', ['The minimum wavelength halves', 'The characteristic lines disappear', 'The intensity quadruples'], 'Twice as many electrons per second, each with the same energy.', ['C1: twice the photon rate', 'C1: same photon energies'])
N('M', 3, 'An X-ray tube emits 12 W of X-rays with a mean photon energy of 40 keV. How many photons does it emit per second?' + take('e'), 12 / (40e3 * QE), None,
  f'E = 40 × 10³ × 1.60 × 10⁻¹⁹ = 6.4 × 10⁻¹⁵ J. n = 12 ÷ 6.4 × 10⁻¹⁵ = {sf(12 / 6.4e-15)}', ['C1: keV to J', 'C1: n = P/E'], aq='n')
N('M', 4, 'An X-ray exposure at 50 kV and 100 mA lasts 0.50 s. 99% of the energy becomes heat in an anode of heat capacity 300 J K⁻¹. Calculate the temperature rise of the anode.', 0.99 * 50e3 * 0.100 * 0.50 / 300, 'K',
  f'Energy = 0.99 × 50 × 10³ × 0.100 × 0.50 = {sf(0.99 * 50e3 * 0.1 * 0.5, 4)} J. ΔT = {sf(0.99 * 50e3 * 0.1 * 0.5, 4)} ÷ 300 = {sf(0.99 * 50e3 * 0.1 * 0.5 / 300)} K', ['C1: energy = VIt', 'C1: 99% to heat', 'C1: ΔT = E/C'], aq='ΔT')
M('M', 3, 'Why does the anode of a powerful X-ray tube rotate?', 'To spread the heating over a larger area of the target', ['To make the X-rays more penetrating', 'To focus the electrons', 'To produce characteristic lines'], 'The focal spot moves around the rim, so no single point overheats.', ['C1: heat spread', 'C1: target not damaged'])
N('M', 3, 'In a low-voltage demonstration X-ray tube, electrons are accelerated from rest through 5.0 kV. Calculate their speed at the target, in units of 10⁷ m s⁻¹ (ignore relativity).' + take('e', 'me'), sqrt(2 * QE * 5.0e3 / ME), '10⁷ m s⁻¹',
  f'v = √(2eV/m) = √(2 × 1.60 × 10⁻¹⁹ × 5.0 × 10³ ÷ 9.11 × 10⁻³¹) = {sf(sqrt(2 * QE * 5e3 / ME))} m s⁻¹', ['C1: eV = ½mv²', 'C1: substitution'], aq='v')
N('M', 3, 'A characteristic line of tungsten has a photon energy of 59 keV. Calculate its wavelength in units of 10⁻¹¹ m.' + take('h', 'c', 'e'), HC / (59e3 * QE), '10⁻¹¹ m',
  f'λ = hc/E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (59 × 10³ × 1.60 × 10⁻¹⁹) = {sf(HC / (59e3 * QE))} m', ['C1: keV to J', 'C1: λ = hc/E'], aq='λ')
M('M', 3, 'A patient drinks a barium compound before an X-ray of the stomach. Why does this help?', 'Barium has a high proton number and absorbs X-rays strongly, outlining the stomach', ['Barium makes the stomach tissue thinner', 'Barium emits its own X-rays', 'Barium reduces the dose to the patient'], 'Attenuation rises steeply with proton number.', ['C1: high Z', 'C1: strong absorption gives contrast'])
N('M', 3, 'An exposure uses a tube current of 200 mA for 0.050 s. Calculate the charge that flows through the tube, in mC.', 200e-3 * 0.050 * 1e3, 'mC',
  'Q = It = 200 × 10⁻³ × 0.050 = 0.010 C. In mC: 0.010 × 10³ = 10', ['C1: Q = It', 'C1: C to mC'], sig=2, aq='Q')
N('M', 3, 'In an exposure, 0.010 C of electrons is accelerated through 90 kV. Calculate the energy delivered to the target.', 0.010 * 90e3, 'J',
  'E = QV = 0.010 × 90 × 10³ = 900 J', ['C1: E = QV', 'C1: kV to V'], sig=2, aq='E')
M('M', 3, 'Why is an X-ray tube surrounded by lead shielding with a small window?', 'So that X-rays leave only in the useful direction, protecting staff and the patient', ['To cool the tube', 'To make the beam harder', 'To stop electrons leaving the tube'], 'Lead strongly absorbs X-rays.', ['C1: absorbs stray X-rays', 'C1: beam only through window'])
N('M', 4, 'Calculate (cut-off wavelength at 50 kV) ÷ (cut-off wavelength at 100 kV).', 100 / 50, None,
  'λ(min) = hc/eV ∝ 1/V: ratio = 100 ÷ 50 = 2.0', ['M1: λ(min) ∝ 1/V', 'C1: ratio of voltages', 'C1: value'], sig=2, aq='ratio')
M('M', 3, 'What is the main advantage of a CT scan over a single X-ray photograph?', 'It shows separate slices, so overlapping organs do not hide each other', ['It gives a much smaller dose', 'It is much quicker', 'It does not use X-rays'], 'A radiograph is a single shadow of everything along each path.', ['C1: slices / 3-D information', 'C1: no overlap of structures'])
N('M', 3, 'An X-ray photon has a wavelength of 0.060 nm. Calculate its energy in keV.' + take('h', 'c', 'e'), HC / 0.060e-9 / QE / 1e3, 'keV',
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 0.060 × 10⁻⁹ = {sf(HC / 0.06e-9, 4)} J. In keV: {sf(HC / 0.06e-9, 4)} ÷ 1.60 × 10⁻¹⁶ = {sf(HC / 0.06e-9 / 1.6e-16)}', ['C1: E = hc/λ', 'C1: J to keV'], aq='E')
# hard
N('H', 5, 'An X-ray tube operates at 80 kV with a current of 25 mA and an efficiency of 1.0%. (a) Calculate the input power. (b) Calculate the X-ray power. (c) Calculate the heat produced in the anode during a 5.0 s exposure.', 0.99 * 80e3 * 25e-3 * 5.0, 'J',
  '(a) P = 80 × 10³ × 25 × 10⁻³ = 2000 W. (b) 0.010 × 2000 = 20 W. (c) Heat = (2000 − 20) × 5.0 = 9900 J',
  ['C1: input power', 'C1: X-ray power', 'M1: heat rate = input − X-ray', 'C1: value'], sig=2, aq='heat')
N('H', 6, 'A tube at 100 kV produces 5.0 W of X-rays. Assume the mean photon energy is one third of the maximum. (a) Calculate the maximum photon energy in J. (b) Calculate the mean photon energy. (c) Calculate the number of photons emitted per second.' + take('e'), 5.0 / (100e3 * QE / 3), None,
  f'(a) E = 1.60 × 10⁻¹⁹ × 100 × 10³ = 1.6 × 10⁻¹⁴ J. (b) 1.6 × 10⁻¹⁴ ÷ 3 = {sf(1.6e-14 / 3, 4)} J. (c) n = 5.0 ÷ {sf(1.6e-14 / 3, 4)} = {sf(5.0 / (1.6e-14 / 3))}',
  ['C1: E(max) = eV', 'C1: mean energy', 'M1: n = P/E', 'C1: substitution', 'C1: value'], aq='n')
N('H', 5, 'A radiograph uses a tube current of 300 mA for 0.10 s. (a) Calculate the charge passing through the tube. (b) Calculate the number of electrons that strike the target.' + take('e'), 300e-3 * 0.10 / QE, None,
  f'(a) Q = 300 × 10⁻³ × 0.10 = 0.030 C. (b) N = 0.030 ÷ 1.60 × 10⁻¹⁹ = {sf(0.03 / QE)}',
  ['C1: Q = It', 'C1: value', 'M1: N = Q/e', 'C1: value'], aq='N')
N('H', 5, 'In tungsten the K shell is at −69.5 keV and the L shell at −11.5 keV. (a) Calculate the energy of the photon emitted when an electron drops from L to K. (b) Calculate its wavelength in units of 10⁻¹¹ m.' + take('h', 'c', 'e'), HC / ((69.5 - 11.5) * 1e3 * QE), '10⁻¹¹ m',
  f'(a) E = 69.5 − 11.5 = 58.0 keV. (b) λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (58.0 × 10³ × 1.60 × 10⁻¹⁹) = {sf(HC / (58e3 * QE))} m',
  ['C1: energy difference', 'C1: keV to J', 'M1: λ = hc/E', 'C1: value'], aq='λ')
N('H', 6, 'For the tungsten K line to appear, an incoming electron must be able to remove a K-shell electron (binding energy 69.5 keV). (a) Explain why a tube at 60 kV shows no K lines. (b) State the minimum tube voltage for K lines, in kV. (c) Calculate the cut-off wavelength at that voltage, in units of 10⁻¹¹ m. Give only the answer to (c).' + take('h', 'c', 'e'), lam_min(69.5e3), '10⁻¹¹ m',
  f'(a) Electrons of 60 keV cannot ionise the K shell. (b) 69.5 kV. (c) λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (1.60 × 10⁻¹⁹ × 69.5 × 10³) = {sf(lam_min(69.5e3))} m',
  ['B1: electron energy < K binding energy', 'C1: 69.5 kV', 'M1: λ = hc/eV', 'C1: substitution', 'C1: value'], aq='λ(min)')
N('H', 5, 'A student measures the cut-off wavelength of an X-ray tube at 40 kV as 0.0310 nm. (a) Write the equation linking the cut-off wavelength and the voltage. (b) Use the measurement to find the Planck constant, in units of 10⁻³⁴ J s.' + take('e', 'c'), QE * 40e3 * 0.0310e-9 / CL, '10⁻³⁴ J s',
  f'(a) eV = hc/λ(min). (b) h = eVλ/c = 1.60 × 10⁻¹⁹ × 40 × 10³ × 0.0310 × 10⁻⁹ ÷ 3.00 × 10⁸ = {sf(QE * 40e3 * 0.031e-9 / CL)} J s',
  ['B1: equation', 'M1: rearranged for h', 'C1: substitution', 'C1: value'], aq='h')
N('H', 6, 'An X-ray tube has a 1.0% efficiency and must give an X-ray power of 15 W at 75 kV. (a) Calculate the input power needed. (b) Calculate the tube current in mA. (c) Calculate the rate at which heat is produced.', 15 / 0.010 / 75e3 * 1e3, 'mA',
  f'(a) P = 15 ÷ 0.010 = 1500 W. (b) I = 1500 ÷ 75 × 10³ = 0.020 A. In mA: 0.020 × 10³ = 20. (c) 1500 − 15 = 1485 W',
  ['C1: input power', 'M1: I = P/V', 'C1: A to mA', 'C1: value', 'C1: heat rate'], sig=2, aq='I')
N('H', 5, 'A beam has photons of maximum energy 120 keV. (a) State the tube voltage. (b) Calculate the cut-off frequency in units of 10¹⁹ Hz. (c) Calculate the cut-off wavelength.' + take('e', 'h'), 120e3 * QE / HP, '10¹⁹ Hz',
  f'(a) 120 kV. (b) f = eV/h = 1.60 × 10⁻¹⁹ × 120 × 10³ ÷ 6.63 × 10⁻³⁴ = {sf(120e3 * QE / HP)} Hz. (c) λ = c/f ≈ 1.04 × 10⁻¹¹ m',
  ['C1: voltage', 'M1: f = eV/h', 'C1: value', 'C1: λ = c/f'], aq='f(max)')
N('H', 6, 'An X-ray tube is used at 60 kV and 50 mA for 0.20 s. (a) Calculate the energy supplied. (b) Calculate the energy of the X-rays if 0.80% is converted. (c) Taking a mean photon energy of 25 keV, calculate the number of X-ray photons produced. Give only the answer to (c).' + take('e'), 60e3 * 50e-3 * 0.20 * 0.0080 / (25e3 * QE), None,
  f'(a) E = 60 × 10³ × 50 × 10⁻³ × 0.20 = 600 J. (b) 0.0080 × 600 = 4.8 J. (c) N = 4.8 ÷ (25 × 10³ × 1.60 × 10⁻¹⁹) = {sf(4.8 / (25e3 * QE))}',
  ['C1: E = VIt', 'C1: X-ray energy', 'C1: photon energy in J', 'M1: N = E/E(photon)', 'C1: value'], aq='N')

# ═════════════════════════ 30.2 X-ray attenuation (17/19/8) ═════════════════════════
lesson('30.2')
N('E', 2, 'A lead sheet has a half-value thickness of 0.30 mm. How many half-value thicknesses are there in a 1.2 mm sheet?', 1.2 / 0.30, None,
  'n = 1.2 ÷ 0.30 = 4.0', ['C1: thickness ÷ x½'], sig=2, aq='n')
N('E', 2, 'A beam passes through 4 half-value thicknesses of a shield. What percentage of its intensity gets through?', 0.5 ** 4 * 100, '%',
  'Fraction = (1/2)⁴ = 0.0625, so 0.0625 × 100 = 6.25 %', ['C1: (½)⁴'], aq='percentage')
M('E', 1, 'Two equal thicknesses of a material are placed one after the other in an X-ray beam. Which statement is correct?', 'Each layer transmits the same fraction of the intensity reaching it', ['Each layer absorbs the same amount of energy per second', 'The second layer absorbs nothing', 'The first layer absorbs everything'], 'Attenuation removes a constant fraction per thickness.')

N('E', 2, 'For one X-ray beam, soft tissue has μ = 0.18 cm⁻¹. What fraction of the beam\'s intensity survives a 2.0 cm layer of tissue?', exp(-0.18 * 2.0), None,
  f'I/I₀ = e^(−μx) = e^(−0.18 × 2.0) = {sf(exp(-0.36))}', ['C1: I = I₀e^(−μx)'], aq='fraction')
M('E', 1, 'What does the linear attenuation coefficient μ of a material measure?', 'The fraction of the beam\'s intensity removed per unit thickness', ['The thickness that stops the beam completely', 'The density of the material', 'The energy of each X-ray photon'], 'I = I₀e^(−μx): larger μ means faster attenuation.')
N('E', 2, 'Lead has a linear attenuation coefficient of 0.45 mm⁻¹ for a particular X-ray beam. Calculate its half-value thickness in mm.', LN2 / 0.45, 'mm',
  f'x½ = ln 2 ÷ μ = 0.693 ÷ 0.45 = {sf(LN2 / 0.45)} mm', ['C1: x½ = ln 2/μ'], aq='x½')
M('E', 1, 'Which unit could be used for the linear attenuation coefficient?', 'm⁻¹', ['m', 'W m⁻²', 'kg m⁻³'], 'μx must be dimensionless.')
N('E', 2, 'Every 2.5 cm of a plastic halves the intensity of an X-ray beam. Find the linear attenuation coefficient of the plastic in cm⁻¹.', LN2 / 2.5, 'cm⁻¹',
  f'μ = ln 2 ÷ x½ = 0.693 ÷ 2.5 = {sf(LN2 / 2.5)} cm⁻¹', ['C1: μ = ln 2/x½'], aq='μ')
M('E', 1, 'How does the intensity of an X-ray beam change as it passes through a uniform material?', 'It falls exponentially with thickness', ['It falls linearly to zero', 'It stays constant then drops', 'It increases'], 'Each equal thickness removes the same fraction.')
N('E', 2, 'An X-ray beam of intensity 800 W m⁻² passes through two half-value thicknesses of tissue. Calculate the intensity that emerges.', 800 / 4, 'W m⁻²',
  'I = 800 × (1/2)² = 200 W m⁻²', ['C1: halve twice'], sig=2, aq='I')
M('E', 1, 'Material P has a larger linear attenuation coefficient than material Q for the same X-rays. Which is correct?', 'P absorbs the beam more strongly, so its half-value thickness is smaller', ['P absorbs less strongly', 'P has the larger half-value thickness', 'They have the same half-value thickness'], 'x½ = ln 2/μ, so a larger μ means stronger absorption and a thinner half-value layer.')
N('E', 2, 'Express a linear attenuation coefficient of 0.30 cm⁻¹ in m⁻¹.', 0.30 * 100, 'm⁻¹',
  'μ = 0.30 × 100 = 30 m⁻¹', ['C1: 1 cm⁻¹ = 100 m⁻¹'], sig=2, aq='μ')
M('E', 1, 'Why does bone show up clearly on an X-ray image of a limb?', 'Its attenuation coefficient is much larger than that of soft tissue', ['It is thinner than soft tissue', 'It reflects X-rays', 'Its attenuation coefficient is smaller than that of soft tissue'], 'The contrast comes from the difference in μ.')
N('E', 2, 'An X-ray beam passes through 2.0 mm of a material with μ = 1.2 mm⁻¹. What fraction of the intensity gets through?', exp(-2.4), None,
  f'I/I₀ = e^(−1.2 × 2.0) = {sf(exp(-2.4))}', ['C1: e^(−μx)'], aq='fraction')
M('E', 1, 'What is the half-value thickness of a material for an X-ray beam?', 'The thickness that reduces the beam intensity to half', ['Half the thickness that stops the beam', 'The thickness of half the patient', 'The thickness that halves the photon energy'], 'Putting I = I₀/2 into I = I₀e^(−μx) gives x½ = ln 2/μ.')
N('E', 2, 'A filter has a half-value thickness of 4.0 mm. What fraction of the beam intensity passes through 12 mm of it?', 0.5 ** 3, None,
  '12 ÷ 4.0 = 3 half-value thicknesses: fraction = (1/2)³ = 0.125', ['C1: three halvings'], sig=3, aq='fraction')
M('E', 1, 'In which unit is the intensity of an X-ray beam measured?', 'W m⁻²', ['W', 'J', 'm⁻¹'], 'Intensity is power per unit area.')
N('E', 2, 'A beam of intensity 50 W m⁻² enters a material with μ = 20 m⁻¹. Calculate the intensity after 0.050 m.', 50 * exp(-20 * 0.050), 'W m⁻²',
  f'I = 50 × e^(−20 × 0.050) = {sf(50 * exp(-1.0))} W m⁻²', ['C1: I = I₀e^(−μx)'], aq='I')
N('E', 2, 'A material has μ = 0.693 cm⁻¹. What thickness, in cm, reduces a beam to one quarter of its intensity?', 2 * LN2 / 0.693, 'cm',
  f'x½ = 0.693 ÷ 0.693 = 1.0 cm; one quarter needs two half-value thicknesses: x = 2 × 1.0 = {sf(2 * LN2 / 0.693, 2)} cm', ['C1: x½ then two of them'], sig=2, aq='x')
N('E', 1, 'What percentage of an X-ray beam passes through one half-value thickness of a material?', 50, '%',
  'By definition the intensity halves: 0.5 × 100 = 50 %', [], sig=2, aq='percentage')
# medium
N('M', 3, 'Soft tissue has μ = 0.25 cm⁻¹ for an X-ray beam. What thickness reduces the beam to 10% of its intensity?', log(10) / 0.25, 'cm',
  f'0.10 = e^(−0.25x), so x = ln 10 ÷ 0.25 = {sf(log(10) / 0.25)} cm', ['C1: equation', 'C1: take logs'], aq='x')
N('M', 3, 'An X-ray beam keeps 40% of its intensity after passing through 3.0 cm of a material. Calculate μ in cm⁻¹.', log(1 / 0.40) / 3.0, 'cm⁻¹',
  f'0.40 = e^(−3.0μ), so μ = ln(1 ÷ 0.40) ÷ 3.0 = {sf(log(2.5) / 3)} cm⁻¹', ['C1: equation', 'C1: take logs'], aq='μ')
N('M', 3, 'Calculate (intensity after 1.0 cm of bone, μ = 3.0 cm⁻¹) ÷ (intensity after 1.0 cm of soft tissue, μ = 0.20 cm⁻¹), for the same incident beam.', exp(-3.0) / exp(-0.20), None,
  f'Ratio = e^(−3.0) ÷ e^(−0.20) = e^(−2.8) = {sf(exp(-2.8))}', ['C1: both transmitted fractions', 'C1: ratio'], aq='ratio')
M('M', 3, 'What gives the contrast between bone and soft tissue on an X-ray image?', 'The large difference between their linear attenuation coefficients', ['The difference in their temperatures', 'The difference in their electrical resistances', 'The fact that bone emits X-rays'], 'Different μ give different transmitted intensities.', ['C1: different μ', 'C1: different transmitted intensities'])
N('M', 4, 'Lead has μ = 5.5 mm⁻¹ for a beam. What thickness of lead in an apron, in mm, cuts the intensity to 1.0%?', log(100) / 5.5, 'mm',
  f'0.010 = e^(−5.5x), so x = ln 100 ÷ 5.5 = {sf(log(100) / 5.5)} mm', ['C1: fraction 0.010', 'C1: take logs', 'C1: value'], aq='x')
N('M', 3, 'An X-ray beam passes through 3.0 cm of soft tissue (μ = 0.20 cm⁻¹) and then 1.0 cm of bone (μ = 0.60 cm⁻¹). What fraction of the intensity emerges?', exp(-0.20 * 3.0 - 0.60 * 1.0), None,
  f'Fraction = e^(−0.20 × 3.0 − 0.60 × 1.0) = e^(−1.2) = {sf(exp(-1.2))}', ['C1: add the μx terms', 'C1: value'], aq='fraction')
M('M', 3, 'On which factors does the linear attenuation coefficient of a material depend?', 'The material (its density and proton number) and the X-ray photon energy', ['Only the thickness of the material', 'Only the intensity of the beam', 'Only the size of the patient'], 'μ is a property of the material for a given photon energy.', ['C1: material', 'C1: photon energy'])
N('M', 3, 'Muscle has a linear attenuation coefficient of 25 m⁻¹ for a beam. Calculate its half-value thickness in mm.', LN2 / 25 * 1e3, 'mm',
  f'x½ = 0.693 ÷ 25 = {sf(LN2 / 25, 4)} m. In mm: {sf(LN2 / 25, 4)} × 10³ = {sf(LN2 / 25 * 1e3)}', ['C1: x½ = ln 2/μ', 'C1: m to mm'], aq='x½')
N('M', 3, 'What fraction of the intensity remains after 1.5 half-value thicknesses?', 0.5 ** 1.5, None,
  f'Fraction = 0.5^1.5 = {sf(0.5 ** 1.5)}', ['C1: (½)ⁿ', 'C1: n = 1.5'], aq='fraction')
N('M', 4, 'How many half-value thicknesses are needed to reduce an X-ray beam to 1/1000 of its intensity?', log(1000) / LN2, None,
  f'(1/2)ⁿ = 1/1000, so n = ln 1000 ÷ ln 2 = {sf(log(1000) / LN2)}', ['M1: (½)ⁿ = 10⁻³', 'C1: take logs', 'C1: value'], aq='n')
M('M', 3, 'Why are low-energy X-ray photons a problem in a medical beam?', 'They are absorbed in the patient\'s skin and add to the dose without reaching the detector', ['They pass through the patient without being absorbed', 'They make the image too sharp', 'They damage the X-ray tube'], 'Soft X-rays have large μ; an aluminium filter removes them first.', ['C1: large μ for low energy', 'C1: dose without image'])
N('M', 3, 'Soft tissue has a density of 1.06 g cm⁻³ and a linear attenuation coefficient of 0.21 cm⁻¹. Calculate its mass attenuation coefficient μ/ρ in cm² g⁻¹.', 0.21 / 1.06, 'cm² g⁻¹',
  f'μ/ρ = 0.21 ÷ 1.06 = {sf(0.21 / 1.06)} cm² g⁻¹', ['C1: μ_m = μ/ρ', 'C1: value'], aq='μ/ρ')
N('M', 3, 'Bone has a mass attenuation coefficient of 0.050 m² kg⁻¹ and a density of 1900 kg m⁻³. Calculate its linear attenuation coefficient in m⁻¹.', 0.050 * 1900, 'm⁻¹',
  'μ = (μ/ρ) × ρ = 0.050 × 1900 = 95 m⁻¹', ['C1: μ = μ_m ρ', 'C1: value'], sig=2, aq='μ')
M('M', 3, 'A graph of ln I against thickness x is plotted for an X-ray beam passing through a material. What is its gradient?', '−μ', ['μ', 'ln 2/μ', '−1/μ'], 'Taking logs of I = I₀e^(−μx) gives ln I = ln I₀ − μx, a straight line of gradient −μ.', ['C1: take logs', 'C1: gradient −μ'])
N('M', 3, 'A graph of ln I against thickness (in cm) has a gradient of −0.35 cm⁻¹. Calculate the half-value thickness in cm.', LN2 / 0.35, 'cm',
  f'μ = 0.35 cm⁻¹. x½ = 0.693 ÷ 0.35 = {sf(LN2 / 0.35)} cm', ['C1: μ from gradient', 'C1: x½ = ln 2/μ'], aq='x½')
N('M', 3, 'A beam of intensity 1.0 × 10³ W m⁻² passes through 5.0 cm of tissue with μ = 0.15 cm⁻¹. Calculate the emerging intensity.', 1.0e3 * exp(-0.75), 'W m⁻²',
  f'I = 1.0 × 10³ × e^(−0.15 × 5.0) = {sf(1e3 * exp(-0.75))} W m⁻²', ['C1: I = I₀e^(−μx)', 'C1: μx = 0.75'], aq='I')
M('M', 3, 'The voltage across an X-ray tube is raised. What happens to the attenuation of the beam in tissue?', 'It decreases, because higher-energy photons are more penetrating', ['It increases', 'It is unchanged', 'It becomes zero'], 'μ falls as photon energy rises (over the diagnostic range).', ['C1: higher photon energy', 'C1: smaller μ'])
N('M', 4, 'What thickness of aluminium (μ = 0.80 cm⁻¹) attenuates a beam as much as 2.0 mm of lead (μ = 50 cm⁻¹)?', 50 * 0.20 / 0.80, 'cm',
  'Equal attenuation needs equal μx: x = 50 × 0.20 ÷ 0.80 = 12.5 cm', ['M1: μ₁x₁ = μ₂x₂', 'C1: mm to cm', 'C1: value'], aq='x')
M('M', 3, 'Why is X-ray attenuation in a uniform material exponential?', 'Each thin layer removes the same fraction of the intensity reaching it', ['Each layer removes the same amount of intensity', 'The photons slow down as they go', 'The photons gain energy'], 'The rate of loss is proportional to the intensity present, dI/dx = −μI, which gives an exponential.', ['C1: constant fraction per layer', 'C1: gives exponential'])
# hard
N('H', 5, 'A beam crosses a limb along two paths: path A through 6.0 cm of soft tissue (μ = 0.20 cm⁻¹), and path B through 4.0 cm of soft tissue and 2.0 cm of bone (μ = 0.60 cm⁻¹). (a) Calculate the fraction transmitted along A. (b) Calculate the fraction along B. (c) Calculate (intensity along A) ÷ (intensity along B).', exp(-1.2) / exp(-0.20 * 4.0 - 0.60 * 2.0), None,
  f'(a) e^(−0.20 × 6.0) = {sf(exp(-1.2), 4)}. (b) e^(−0.20 × 4.0 − 0.60 × 2.0) = {sf(exp(-2.0), 4)}. (c) {sf(exp(-1.2), 4)} ÷ {sf(exp(-2.0), 4)} = {sf(exp(-1.2) / exp(-2.0))}',
  ['C1: path A', 'C1: path B', 'M1: ratio', 'C1: value'], aq='ratio')
N('H', 6, 'A wall must reduce the X-ray intensity in the next room to 0.10% of its value. Concrete has a half-value thickness of 2.4 cm for this beam. (a) Calculate μ for concrete. (b) Calculate the thickness of concrete needed, in cm.', log(1000) / (LN2 / 2.4), 'cm',
  f'(a) μ = 0.693 ÷ 2.4 = {sf(LN2 / 2.4, 4)} cm⁻¹. (b) 0.0010 = e^(−μx), so x = ln 1000 ÷ {sf(LN2 / 2.4, 4)} = {sf(log(1000) / (LN2 / 2.4))} cm',
  ['C1: μ', 'C1: fraction 0.0010', 'M1: take logs', 'C1: substitution', 'C1: value'], aq='x')
N('H', 5, 'An X-ray beam has intensities of 60 W m⁻² after 2.0 cm of a material and 15 W m⁻² after 5.0 cm. (a) Calculate μ. (b) Calculate the incident intensity.', 60 / exp(-log(4) / 3.0 * 2.0), 'W m⁻²',
  f'(a) 15 ÷ 60 = e^(−3.0μ), so μ = ln 4 ÷ 3.0 = {sf(log(4) / 3, 4)} cm⁻¹. (b) I₀ = 60 × e^({sf(log(4) / 3, 4)} × 2.0) = {sf(60 / exp(-log(4) / 3 * 2))} W m⁻²',
  ['M1: ratio of intensities', 'C1: μ', 'M1: back to x = 0', 'C1: value'], aq='I₀')
N('H', 6, 'An X-ray beam is measured through layers of aluminium: x = 0, 2.0, 4.0, 6.0 mm gives I = 100, 62, 38, 24 units. (a) Explain why ln I should be plotted against x. (b) Use the first and last values to find μ. (c) Calculate the half-value thickness in mm. Give only the answer to (c).', LN2 / (log(100 / 24) / 6.0), 'mm',
  f'(a) ln I = ln I₀ − μx is linear. (b) μ = ln(100 ÷ 24) ÷ 6.0 = {sf(log(100 / 24) / 6, 4)} mm⁻¹. (c) x½ = 0.693 ÷ {sf(log(100 / 24) / 6, 4)} = {sf(LN2 / (log(100 / 24) / 6))} mm',
  ['B1: linear form', 'C1: ln values', 'M1: gradient', 'C1: μ', 'C1: x½'], aq='x½')
N('H', 5, 'A beam passes through 4.0 cm of soft tissue (μ = 0.20 cm⁻¹), 1.0 cm of bone (μ = 0.60 cm⁻¹) and another 4.0 cm of soft tissue. (a) Calculate the total μx. (b) Calculate the fraction transmitted.', exp(-(0.20 * 8.0 + 0.60)), None,
  f'(a) μx = 0.20 × 8.0 + 0.60 × 1.0 = 2.2. (b) e^(−2.2) = {sf(exp(-2.2))}',
  ['C1: tissue total', 'C1: add bone', 'M1: e^(−Σμx)', 'C1: value'], aq='fraction')
N('H', 6, 'A 2.0 mm aluminium filter has μ = 0.90 mm⁻¹ for 20 keV photons and μ = 0.070 mm⁻¹ for 60 keV photons. (a) Calculate the fraction of each energy transmitted. (b) Calculate (fraction of 20 keV transmitted) ÷ (fraction of 60 keV transmitted). (c) Explain how the filter "hardens" the beam. Give only the answer to (b).', exp(-1.8) / exp(-0.14), None,
  f'(a) 20 keV: e^(−1.8) = {sf(exp(-1.8), 4)}; 60 keV: e^(−0.14) = {sf(exp(-0.14), 4)}. (b) {sf(exp(-1.8), 4)} ÷ {sf(exp(-0.14), 4)} = {sf(exp(-1.8) / exp(-0.14))}. (c) Low-energy photons are removed far more, so the mean photon energy rises.',
  ['C1: 20 keV fraction', 'C1: 60 keV fraction', 'M1: ratio', 'C1: value', 'B1: hardening'], aq='ratio')
N('H', 5, 'A material has a half-value thickness of 3.0 mm. (a) Calculate μ. (b) Calculate the percentage of the intensity transmitted through 10 mm.', exp(-LN2 / 3.0 * 10) * 100, '%',
  f'(a) μ = 0.693 ÷ 3.0 = {sf(LN2 / 3, 4)} mm⁻¹. (b) e^(−{sf(LN2 / 3, 4)} × 10) × 100 = {sf(exp(-LN2 / 3 * 10) * 100)} %',
  ['C1: μ', 'M1: e^(−μx)', 'C1: substitution', 'C1: value'], aq='percentage')
N('H', 6, 'A patient is 4.0 cm thicker than average. Tissue has μ = 0.20 cm⁻¹. (a) Calculate the extra attenuation factor e^(μΔx). (b) By what factor must the exposure (mA s) be increased to give the same detector intensity? (c) State one disadvantage. Give only the answer to (b).', exp(0.20 * 4.0), None,
  f'(a) e^(0.20 × 4.0) = {sf(exp(0.8))}. (b) The exposure must rise by the same factor, {sf(exp(0.8))}. (c) The patient dose is larger.',
  ['C1: μΔx = 0.80', 'C1: factor', 'M1: intensity ∝ exposure', 'C1: value', 'B1: higher dose'], aq='factor')

# ═════════════════════════ 30.3 Improving X-ray images (17/19/8) ═════════════════════════
lesson('30.3')
N('E', 2, 'An intensifying screen reduces the exposure time needed by a factor of 25. Without it, the exposure would last 0.50 s. Calculate the exposure time with the screen.', 0.50 / 25, 's',
  't = 0.50 ÷ 25 = 0.020 s', ['C1: divide by the factor'], sig=2, aq='t')
M('E', 1, 'What is meant by the sharpness of an X-ray image?', 'How clearly the edges of structures are defined', ['How bright the image is', 'How large the image is', 'The difference in brightness between tissues'], 'Blurred edges mean poor sharpness.')
N('E', 2, 'An X-ray tube has a focal spot 1.0 mm wide. The object is 0.90 m from the focal spot and 0.10 m from the detector. Calculate the width of the blurred edge (penumbra) in mm, using width = spot size × (object–detector distance ÷ source–object distance).', 1.0 * 0.10 / 0.90, 'mm',
  f'w = 1.0 × 0.10 ÷ 0.90 = {sf(0.10 / 0.90)} mm', ['C1: similar triangles'], aq='w')
M('E', 1, 'How does a smaller focal spot affect an X-ray image?', 'It makes the image sharper', ['It makes the image blurrier', 'It increases the contrast only', 'It has no effect'], 'A point-like source gives a smaller penumbra.')
N('E', 2, 'The X-ray intensity 1.0 m from a tube is 400 units. Assuming an inverse-square law, calculate the intensity 2.0 m from the tube.', 400 / 4, None,
  'I ∝ 1/d²: I = 400 × (1.0 ÷ 2.0)² = 100 units', ['C1: inverse square'], sig=2, aq='I')
M('E', 1, 'Which of these is NOT a benefit of collimating an X-ray beam to the area being examined?', 'It makes each X-ray photon more energetic', ['It reduces the dose to the patient', 'It reduces scattered radiation', 'It improves contrast'], 'Collimation limits the beam area; it does not change photon energy.')
N('E', 2, 'Behind bone 20% of the incident intensity reaches the detector; behind soft tissue 80% does. Calculate the contrast ratio (soft tissue ÷ bone).', 0.80 / 0.20, None,
  'Ratio = 0.80 ÷ 0.20 = 4.0', ['C1: ratio of intensities'], sig=2, aq='ratio')
M('E', 1, 'Why are contrast media such as iodine or barium chosen?', 'They have high proton numbers, so they attenuate X-rays strongly', ['They are good conductors', 'They are radioactive', 'They glow when lit by X-rays'], 'Attenuation increases steeply with proton number.')
N('E', 2, 'An exposure uses 200 mA for 0.10 s. Calculate the charge that flows, in mC.', 200e-3 * 0.10 * 1e3, 'mC',
  'Q = It = 200 × 10⁻³ × 0.10 = 0.020 C. In mC: 0.020 × 10³ = 20', ['C1: Q = It'], sig=2, aq='Q')
M('E', 1, 'Where is an anti-scatter grid placed?', 'Between the patient and the detector', ['Between the tube and the patient', 'Inside the X-ray tube', 'Behind the detector'], 'It stops scattered X-rays from the patient reaching the detector.')
N('E', 2, 'An anti-scatter grid transmits 80% of the primary beam. The primary intensity reaching the grid is 1000 units. Calculate the primary intensity reaching the detector.', 0.80 * 1000, None,
  'I = 0.80 × 1000 = 800 units', ['C1: fraction transmitted'], sig=2, aq='I')
M('E', 1, 'How does scattered radiation affect an X-ray image?', 'It fogs the image and reduces contrast', ['It makes the image sharper', 'It increases contrast', 'It has no effect on the image'], 'Scattered photons arrive from random directions.')
N('E', 2, 'A radiograph gives a dose of 2.0 mGy with a 0.10 s exposure. Assuming the dose is proportional to exposure time, calculate the dose for a 0.25 s exposure, in mGy.', 2.0 * 0.25 / 0.10, 'mGy',
  'D = 2.0 × 0.25 ÷ 0.10 = 5.0 mGy', ['C1: proportional scaling'], sig=2, aq='D')
M('E', 1, 'What is one advantage of a digital X-ray detector over film?', 'The image can be adjusted and sent electronically straight away', ['It needs no X-rays', 'It removes all scattered radiation', 'It gives no dose to the patient'], 'Digital images can be processed, stored and shared at once.')
N('E', 2, 'A digital detector 43 cm wide has 3000 pixels across it. Calculate the width of one pixel in mm.', 430 / 3000, 'mm',
  f'w = 430 ÷ 3000 = {sf(430 / 3000)} mm', ['C1: width ÷ number of pixels'], aq='w')
M('E', 1, 'How should the patient be placed relative to the detector for the sharpest image?', 'As close to the detector as possible', ['As far from the detector as possible', 'Halfway between the tube and the detector', 'Touching the X-ray tube'], 'A small object-detector distance reduces the penumbra.')
N('E', 1, 'Without screens an exposure would take 2.0 s. Screens reduce it by a factor of 40. Calculate the new exposure time.', 2.0 / 40, 's',
  't = 2.0 ÷ 40 = 0.050 s', [], sig=2, aq='t')
# medium
N('M', 3, 'A focal spot of 0.80 mm is 1.2 m from an object, which is 0.30 m from the detector. Calculate the penumbra width in mm.', 0.80 * 0.30 / 1.2, 'mm',
  'w = 0.80 × 0.30 ÷ 1.2 = 0.20 mm', ['C1: similar triangles', 'C1: substitution'], sig=2, aq='w')
N('M', 4, 'A focal spot is 0.60 mm wide and the object–detector distance is 0.15 m. What is the smallest source–object distance that keeps the penumbra below 0.20 mm?', 0.60 * 0.15 / 0.20, 'm',
  'd = 0.60 × 0.15 ÷ 0.20 = 0.45 m', ['M1: w = s × (b/a)', 'C1: rearranged', 'C1: value'], sig=2, aq='d')
N('M', 3, 'A beam crosses 1.0 cm of bone (μ = 0.60 cm⁻¹) on one path and 1.0 cm of soft tissue (μ = 0.20 cm⁻¹) on another. Calculate (transmitted intensity through tissue) ÷ (through bone).', exp(-0.20) / exp(-0.60), None,
  f'Ratio = e^(−0.20) ÷ e^(−0.60) = e^(0.40) = {sf(exp(0.40))}', ['C1: transmitted fractions', 'C1: ratio'], aq='ratio')
M('M', 3, 'The tube voltage is lowered for a soft-tissue X-ray (such as mammography). Why?', 'Lower-energy photons give a bigger difference in attenuation between similar tissues, improving contrast', ['Lower voltage reduces the dose', 'Lower-energy photons pass straight through', 'It makes the image sharper'], 'The difference in μ between soft tissues is larger at low energies.', ['C1: larger μ difference', 'C1: better contrast'])
N('M', 3, 'A patient is moved from 1.0 m to 1.5 m from the tube. Assuming an inverse-square law, what fraction of the original intensity now reaches the patient?', (1.0 / 1.5) ** 2, None,
  f'Fraction = (1.0 ÷ 1.5)² = {sf((1 / 1.5) ** 2)}', ['C1: I ∝ 1/d²', 'C1: value'], aq='fraction')
N('M', 3, 'Before a grid, the scattered intensity equals the primary intensity. The grid transmits 90% of the primary and 10% of the scatter. Calculate (scattered intensity ÷ primary intensity) after the grid.', 0.10 / 0.90, None,
  f'Ratio = 0.10 ÷ 0.90 = {sf(0.10 / 0.90)}', ['C1: both transmissions', 'C1: ratio'], aq='ratio')
M('M', 3, 'Why is barium sulfate given as a meal before an X-ray of the digestive tract?', 'It coats the gut wall and absorbs X-rays strongly, so the gut outline shows clearly', ['It makes the gut transparent to X-rays', 'It reduces the X-ray dose', 'It is radioactive and emits X-rays'], 'Barium has a high proton number.', ['C1: high Z absorber', 'C1: outlines soft tissue'])
N('M', 3, 'Each 40 keV X-ray photon absorbed by an intensifying screen produces light photons of 2.5 eV, with 15% of the X-ray energy becoming light. How many light photons are produced per X-ray photon?', 0.15 * 40e3 / 2.5, None,
  'N = 0.15 × 40 × 10³ ÷ 2.5 = 2400', ['C1: light energy', 'C1: ÷ photon energy'], sig=2, aq='N')
N('M', 4, 'A screen reduces the exposure time by a factor of 30, and moving the detector from 1.0 m to 1.2 m from the tube increases it by the inverse-square factor. Without either change the exposure was 0.60 s. Calculate the new exposure time.', 0.60 / 30 * (1.2 / 1.0) ** 2, 's',
  f't = 0.60 ÷ 30 × (1.2 ÷ 1.0)² = {sf(0.60 / 30 * 1.44)} s', ['C1: screen factor', 'C1: inverse-square factor', 'C1: combined'], aq='t')
M('M', 3, 'Why can the focal spot of an X-ray tube not simply be made as small as possible?', 'The heat from the electron beam would be concentrated on a tiny area and damage the target', ['A small spot gives no X-rays', 'A small spot gives a blurred image', 'A small spot reduces contrast'], 'Smaller spots improve sharpness but raise the heat per unit area.', ['C1: heating', 'C1: trade-off with sharpness'])
N('M', 3, 'An exposure of 40 mA s gives a dose of 0.80 mGy. Assuming dose is proportional to mA s, calculate the dose for 25 mA s, in mGy.', 0.80 * 25 / 40, 'mGy',
  'D = 0.80 × 25 ÷ 40 = 0.50 mGy', ['C1: proportional', 'C1: value'], sig=2, aq='D')
N('M', 3, 'An object is 0.20 m from the detector and the detector is 1.0 m from the focal spot. Calculate the magnification of its shadow.', 1.0 / 0.80, None,
  'M = (source–detector) ÷ (source–object) = 1.0 ÷ 0.80 = 1.25', ['C1: source–object = 0.80 m', 'C1: ratio'], aq='M')
M('M', 3, 'What is the purpose of the lead strips in an anti-scatter grid?', 'To absorb X-rays travelling at an angle to the primary beam', ['To absorb the primary beam', 'To focus the X-rays', 'To produce light'], 'Scattered photons hit the strips; primary photons pass between them.', ['C1: angled photons absorbed', 'C1: primary passes'])
N('M', 3, 'A detector has pixels 0.10 mm wide. One line pair (one dark and one light line) needs at least two pixels. What is the finest resolution in line pairs per mm?', 1 / (2 * 0.10), 'line pairs per mm',
  'Resolution = 1 ÷ (2 × 0.10) = 5.0 line pairs per mm', ['C1: two pixels per line pair', 'C1: value'], sig=2, aq='resolution')
N('M', 3, 'Behind two regions of an image the intensities are 150 and 50 units. Calculate the contrast, defined as (I₁ − I₂) ÷ (I₁ + I₂).', (150 - 50) / (150 + 50), None,
  'C = (150 − 50) ÷ (150 + 50) = 0.50', ['C1: substitution', 'C1: value'], sig=2, aq='contrast')
M('M', 3, 'Why is an iodine compound injected to show blood vessels on an X-ray image?', 'Iodine has a high proton number, so the blood containing it absorbs X-rays strongly', ['Iodine reduces blood flow', 'Iodine makes the vessels wider', 'Iodine is a gas that shows up as a shadow'], 'Iodine fills the vessels and outlines them.', ['C1: high Z', 'C1: vessels outlined'])
N('M', 3, 'The detector is moved from 1.0 m to 1.2 m from the tube. By what factor must the exposure time increase to keep the same detector intensity?', (1.2 / 1.0) ** 2, None,
  'Factor = (1.2 ÷ 1.0)² = 1.44', ['C1: inverse square', 'C1: value'], aq='factor')
N('M', 4, 'A focal spot is 1.2 mm wide. An object is 0.70 m from the spot and 0.30 m from the detector. Calculate the penumbra width in mm.', 1.2 * 0.30 / 0.70, 'mm',
  f'w = 1.2 × 0.30 ÷ 0.70 = {sf(1.2 * 0.30 / 0.70)} mm', ['M1: similar triangles', 'C1: distances', 'C1: value'], aq='w')
M('M', 3, 'How does an anti-scatter grid affect the exposure that must be given?', 'The exposure must be increased, because the grid also absorbs some of the primary beam', ['The exposure can be reduced', 'The exposure is unchanged', 'The exposure must be halved'], 'Better contrast comes at the cost of a larger dose.', ['C1: grid absorbs some primary', 'C1: more exposure needed'])
# hard
N('H', 5, 'A focal spot is 1.5 mm wide. A patient\'s bone is 0.80 m from the spot and 0.20 m from the detector. (a) Calculate the magnification. (b) Calculate the penumbra width, in mm.', 1.5 * 0.20 / 0.80, 'mm',
  '(a) M = 1.00 ÷ 0.80 = 1.25. (b) w = 1.5 × 0.20 ÷ 0.80 = 0.375 mm',
  ['C1: source–detector distance', 'C1: magnification', 'M1: penumbra formula', 'C1: value'], aq='w')
N('H', 6, 'A beam of intensity I₀ reaches a limb. Path A crosses 8.0 cm of tissue (μ = 0.20 cm⁻¹); path B crosses 6.0 cm of tissue and 2.0 cm of bone (μ = 0.55 cm⁻¹). (a) Calculate the fraction transmitted on each path. (b) Calculate the contrast (I_A − I_B) ÷ (I_A + I_B).', (exp(-1.6) - exp(-1.2 - 1.1)) / (exp(-1.6) + exp(-1.2 - 1.1)), None,
  f'(a) A: e^(−1.6) = {sf(exp(-1.6), 4)}; B: e^(−1.2 − 1.1) = {sf(exp(-2.3), 4)}. (b) ({sf(exp(-1.6), 4)} − {sf(exp(-2.3), 4)}) ÷ ({sf(exp(-1.6), 4)} + {sf(exp(-2.3), 4)}) = {sf((exp(-1.6) - exp(-2.3)) / (exp(-1.6) + exp(-2.3)))}',
  ['C1: path A', 'C1: path B', 'M1: contrast formula', 'C1: substitution', 'C1: value'], aq='contrast')
N('H', 5, 'An exposure at 1.0 m without screens takes 1.2 s. It is repeated at 1.5 m using screens that reduce the exposure by a factor of 20. (a) Calculate the inverse-square factor. (b) Calculate the new exposure time.', 1.2 * (1.5 / 1.0) ** 2 / 20, 's',
  f'(a) (1.5 ÷ 1.0)² = 2.25. (b) t = 1.2 × 2.25 ÷ 20 = {sf(1.2 * 2.25 / 20)} s',
  ['C1: inverse-square factor', 'C1: screen factor', 'M1: combine', 'C1: value'], aq='t')
N('H', 6, 'Without a grid, 60% of the photons reaching the detector are scattered. A grid transmits 75% of the primary photons and 8.0% of the scattered photons. (a) Calculate the fraction of primary photons before the grid. (b) Calculate the fraction of the photons reaching the detector that are scattered once the grid is used. Give only the answer to (b), as a percentage.', 0.6 * 0.08 / (0.6 * 0.08 + 0.4 * 0.75) * 100, '%',
  f'(a) 1 − 0.60 = 0.40. (b) Scatter: 0.60 × 0.080 = 0.048; primary: 0.40 × 0.75 = 0.30. Percentage = 0.048 ÷ (0.048 + 0.30) × 100 = {sf(0.048 / 0.348 * 100)} %',
  ['C1: primary fraction', 'C1: scatter after grid', 'C1: primary after grid', 'M1: ratio', 'C1: value'], aq='percentage')
N('H', 5, 'Blood vessels filled with iodine contrast (μ = 4.0 cm⁻¹) are 0.30 cm across and surrounded by tissue (μ = 0.20 cm⁻¹). (a) Calculate the transmitted fraction across 0.30 cm of vessel. (b) Calculate it across 0.30 cm of tissue. (c) Calculate (tissue fraction) ÷ (vessel fraction). Give only the answer to (c).', exp(-0.06) / exp(-1.2), None,
  f'(a) e^(−4.0 × 0.30) = {sf(exp(-1.2), 4)}. (b) e^(−0.20 × 0.30) = {sf(exp(-0.06), 4)}. (c) {sf(exp(-0.06), 4)} ÷ {sf(exp(-1.2), 4)} = {sf(exp(-0.06) / exp(-1.2))}',
  ['C1: vessel', 'C1: tissue', 'M1: ratio', 'C1: value'], aq='ratio')
N('H', 6, 'An X-ray beam has an intensity of 6.0 W m⁻² at 1.0 m from the focal spot. A patient 20 cm thick (μ = 0.20 cm⁻¹) lies with the far side 1.6 m from the spot. (a) Calculate the intensity at 1.6 m without the patient. (b) Calculate the intensity reaching the detector behind the patient.', 6.0 * (1.0 / 1.6) ** 2 * exp(-4.0), 'W m⁻²',
  f'(a) I = 6.0 × (1.0 ÷ 1.6)² = {sf(6 * (1 / 1.6) ** 2, 4)} W m⁻². (b) I = {sf(6 * (1 / 1.6) ** 2, 4)} × e^(−0.20 × 20) = {sf(6 * (1 / 1.6) ** 2 * exp(-4))} W m⁻²',
  ['C1: inverse square', 'C1: value', 'C1: μx = 4.0', 'M1: multiply', 'C1: value'], aq='I')
N('H', 5, 'An intensifying screen absorbs 30% of the 50 keV X-ray photons reaching it, and converts 12% of the absorbed energy into light photons of 2.4 eV. (a) Calculate the light energy per absorbed X-ray photon in eV. (b) Calculate the number of light photons produced per incident X-ray photon.', 0.30 * 0.12 * 50e3 / 2.4, None,
  f'(a) 0.12 × 50 × 10³ = 6000 eV. (b) N = 0.30 × 6000 ÷ 2.4 = {sf(0.3 * 6000 / 2.4)}',
  ['C1: light energy', 'M1: × 0.30', 'C1: ÷ 2.4 eV', 'C1: value'], aq='N')
N('H', 6, 'A digital detector has 3000 × 3000 pixels, each storing a 14-bit value. (a) Calculate the number of pixels. (b) Calculate the image size in bits. (c) Calculate the image size in megabytes (MB), taking 1 byte = 8 bits and 1 MB = 10⁶ bytes. Give only the answer to (c).', 3000 * 3000 * 14 / 8 / 1e6, 'MB',
  f'(a) 3000 × 3000 = 9.0 × 10⁶. (b) 9.0 × 10⁶ × 14 = 1.26 × 10⁸ bits. (c) 1.26 × 10⁸ ÷ 8 ÷ 10⁶ = {sf(1.26e8 / 8 / 1e6)} MB',
  ['C1: pixels', 'C1: bits', 'M1: ÷ 8 for bytes', 'C1: ÷ 10⁶ for MB', 'C1: value'], aq='size')

# ═════════════════════════ 30.4 Computerised axial tomography (17/17/10) ═════════════════════════
lesson('30.4')
N('E', 2, 'A CT slice is reconstructed as 512 × 512 pixels. How many pixels does the slice contain?', 512 * 512, None,
  'N = 512 × 512 = 262 144 pixels', ['C1: rows × columns'], sig=6, aq='N')
N('E', 2, 'In a 2 × 2 block of voxels, the left column reads 7 and its top voxel has a value of 3. What is the value of its bottom voxel?', 7 - 3, None,
  'Column reading = sum of its voxels: bottom = 7 − 3 = 4', ['C1: readings are sums'], sig=1, aq='value')

N('E', 2, 'A CT data set is 256 × 256 pixels in each of 50 slices. How many voxels does it contain?', 256 * 256 * 50, None,
  'N = 256 × 256 × 50 = 3 276 800, about 3.28 × 10⁶', ['C1: multiply the three numbers'], sig=3, aq='N')
M('E', 1, 'What is a voxel in a CT scan?', 'A small volume element of the patient whose attenuation is calculated', ['A single X-ray photon', 'A detector element', 'A thin slice of film'], 'CT computes a value for each voxel, which is shown as a pixel in a slice.')
N('E', 2, 'A CT scan covers 120 mm of a patient in 40 equal slices. Calculate the thickness of each slice in mm.', 120 / 40, 'mm',
  't = 120 ÷ 40 = 3.0 mm', ['C1: length ÷ number'], sig=2, aq='t')
M('E', 1, 'How does the X-ray source move during a CT scan?', 'It rotates around the patient', ['It stays fixed above the patient', 'It moves along a straight line only', 'It vibrates rapidly'], 'Projections are needed from many angles.')
N('E', 2, 'A CT image is 512 pixels across and represents a width of 250 mm. Calculate the width of one pixel in mm.', 250 / 512, 'mm',
  f'w = 250 ÷ 512 = {sf(250 / 512)} mm', ['C1: width ÷ pixels'], aq='w')
M('E', 1, 'What does each detector reading in a CT scanner measure?', 'The total attenuation along one path through the patient', ['The attenuation of a single voxel', 'The temperature of the patient', 'The thickness of the patient'], 'The computer works out individual voxel values from many such sums.')
N('E', 2, 'The diagram shows a 2 × 2 block of voxels. The detector reading along the top row is 9, and the left voxel of that row has a value of 4. What is the value of the right voxel of the top row?', 9 - 4, None,
  'Row reading = sum of its voxels: right voxel = 9 − 4 = 5', ['C1: readings are sums'], sig=1, aq='value')
M('E', 1, 'Why does a CT scan usually give a larger dose than a single radiograph?', 'Many X-ray projections are taken through the same region', ['CT uses gamma rays', 'CT uses a higher tube voltage only', 'CT has no shielding'], 'Each slice needs projections from many angles.')
N('E', 2, 'A CT scanner takes 0.50 s per rotation and makes 64 rotations. Calculate the scan time.', 0.50 * 64, 's',
  't = 0.50 × 64 = 32 s', ['C1: time per rotation × number'], sig=2, aq='t')
M('E', 1, 'What is a key advantage of CT over a plain radiograph for soft tissue?', 'It can distinguish tissues whose attenuation coefficients differ only slightly', ['It uses no X-rays', 'It gives a smaller dose', 'It is much cheaper'], 'Computed values separate small differences in μ.')
N('E', 2, 'A CT scan gives an effective dose of 8.0 mSv and a chest radiograph 0.020 mSv. Calculate (CT dose) ÷ (radiograph dose).', 8.0 / 0.020, None,
  'Ratio = 8.0 ÷ 0.020 = 400', ['C1: ratio'], sig=2, aq='ratio')
M('E', 1, 'How is the calculated attenuation of each voxel displayed in a CT image?', 'As a shade of grey in the corresponding pixel', ['As a number printed on the patient', 'As a sound', 'As the colour of the X-ray beam'], 'Higher attenuation is usually shown lighter.')
N('E', 2, 'A CT scanner records projections every 1.0° through one full rotation. How many projections does it record per rotation?', 360 / 1.0, None,
  'One rotation is 360°, so N = 360 ÷ 1.0 = 360 projections', ['C1: 360° ÷ step'], sig=2, aq='N')
M('E', 1, 'In a helical (spiral) CT scan, what happens during the scan?', 'The patient moves steadily through the rotating X-ray beam', ['The patient rotates', 'The detector stays still and the tube is off', 'Only one slice is scanned'], 'The tube traces a helix relative to the patient.')
N('E', 2, 'In a helical scan the table moves 40 mm in each 0.50 s rotation. Calculate the table speed in mm s⁻¹.', 40 / 0.50, 'mm s⁻¹',
  'v = 40 ÷ 0.50 = 80 mm s⁻¹', ['C1: distance ÷ time'], sig=2, aq='v')
M('E', 1, 'Why is CT especially useful for imaging the brain?', 'It shows small differences between soft tissues inside the skull', ['X-rays cannot pass through the skull otherwise', 'The brain contains bone', 'CT uses no radiation'], 'A plain radiograph would be dominated by the skull.')
N('E', 1, 'A CT slice is 512 × 512 pixels, each stored as 2 bytes. Calculate the size of one slice in bytes.', 512 * 512 * 2, 'bytes',
  'Size = 512 × 512 × 2 = 524 288 bytes', [], sig=6, aq='size')
# medium
N('M', 3, 'The diagram shows a 2 × 2 block of voxels with top row reading 7, bottom row 11, left column 8 and right column 10. A diagonal reading through the top-left and bottom-right voxels is 9. Find the value of the top-left voxel.', 3, None,
  'Let the top-left be a. Top-right = 7 − a, bottom-left = 8 − a, bottom-right = 9 − a. Bottom row: (8 − a) + (9 − a) = 11, so a = (17 − 11) ÷ 2 = 3',
  ['M1: express others in terms of a', 'C1: bottom-row equation'], sig=1, aq='a')
N('M', 4, 'A 2 × 2 block of voxels has top row 10, bottom row 14, left column 9 and right column 15. The diagonal through the top-left and bottom-right voxels reads 13. Find the value of the bottom-right voxel.', 9, None,
  'Top-left a: top-right 10 − a, bottom-left 9 − a, bottom-right 13 − a. Bottom row: 22 − 2a = 14, so a = (22 − 14) ÷ 2 = 4; bottom-right = 13 − 4 = 9',
  ['M1: unknowns in terms of a', 'C1: solve for a', 'C1: bottom-right'], sig=1, aq='value')
M('M', 3, 'What mainly limits the spatial resolution of a CT image?', 'The size of the voxels', ['The colour of the display', 'The patient\'s weight', 'The tube current alone'], 'Detail smaller than a voxel is averaged out.', ['C1: voxel size', 'C1: averaging within voxel'])
N('M', 3, 'A CT voxel is 0.50 mm × 0.50 mm × 1.0 mm. Calculate its volume in mm³.', 0.50 * 0.50 * 1.0, 'mm³',
  'V = 0.50 × 0.50 × 1.0 = 0.25 mm³', ['C1: product', 'C1: units'], sig=2, aq='V')
N('M', 3, 'A region 300 mm × 300 mm × 150 mm is imaged with voxels 0.50 mm × 0.50 mm × 1.0 mm. How many voxels is that?', (300 / 0.5) * (300 / 0.5) * 150, None,
  'N = (300 ÷ 0.50) × (300 ÷ 0.50) × (150 ÷ 1.0) = 5.4 × 10⁷', ['C1: voxels along each side', 'C1: product'], sig=2, aq='N')
M('M', 3, 'Why must a patient keep still during a CT scan?', 'The image is reconstructed from many projections assumed to be of the same object; movement blurs it', ['Movement increases the dose', 'Movement changes the tube voltage', 'Movement switches off the detectors'], 'Inconsistent projections produce artefacts.', ['C1: projections combined', 'C1: movement causes blur or artefacts'])
N('M', 3, 'A CT gantry makes one rotation every 0.40 s. Calculate its angular speed.', 2 * pi / 0.40, 'rad s⁻¹',
  f'ω = 2π ÷ 0.40 = {sf(2 * pi / 0.40)} rad s⁻¹', ['C1: ω = 2π/T', 'C1: value'], aq='ω')
N('M', 3, 'A CT detector arc has 900 elements, each recording 1000 readings per 0.50 s rotation. How many readings are recorded per second?', 900 * 1000 / 0.50, None,
  'Readings = 900 × 1000 ÷ 0.50 = 1.8 × 10⁶', ['C1: per rotation', 'C1: per second'], sig=2, aq='readings')
M('M', 3, 'Why is an iodine contrast agent sometimes injected before a CT scan?', 'It raises the attenuation of blood, making vessels and some organs stand out', ['It lowers the dose', 'It makes the patient keep still', 'It speeds up the scan'], 'High-Z iodine increases μ where it collects.', ['C1: increases μ', 'C1: improves contrast'])
N('M', 3, 'A path through a patient crosses 4 voxels, and the total attenuation along it is 2.4. What is the mean attenuation per voxel?', 2.4 / 4, None,
  'Mean = 2.4 ÷ 4 = 0.60', ['C1: total ÷ number', 'C1: value'], sig=2, aq='mean')
M('M', 3, 'What does the computer in a CT scanner calculate from the detector readings?', 'The attenuation of each voxel in the slice', ['The thickness of the patient only', 'The X-ray tube voltage', 'The temperature of each voxel'], 'Back-projection solves for individual voxel values.', ['C1: voxel attenuation', 'C1: from many projections'])
N('M', 3, 'In a helical CT scan the table moves 20 mm per rotation and the beam is 10 mm wide. Calculate the pitch (table movement per rotation ÷ beam width).', 20 / 10, None,
  'Pitch = 20 ÷ 10 = 2.0', ['C1: ratio', 'C1: value'], sig=2, aq='pitch')
N('M', 3, 'A scan covers 400 mm of a patient at a table speed of 80 mm s⁻¹. Calculate the scan time.', 400 / 80, 's',
  't = 400 ÷ 80 = 5.0 s', ['C1: t = d/v', 'C1: value'], sig=2, aq='t')
M('M', 3, 'Why does a CT scanner use a fan-shaped beam and an arc of detectors?', 'So that many paths through the slice are measured at once for each angle', ['To reduce the tube voltage', 'To make the beam more penetrating', 'To avoid using a computer'], 'Each detector records one path.', ['C1: many paths per projection', 'C1: faster data collection'])
N('M', 3, 'A 64-slice scanner covers 40 mm along the patient in each rotation. Calculate the slice thickness in mm.', 40 / 64, 'mm',
  't = 40 ÷ 64 = 0.625 mm', ['C1: width ÷ slices', 'C1: value'], aq='t')
# hard
N('H', 5, 'The diagram shows a 2 × 2 block of voxels with top row 12, bottom row 8, left column 11 and right column 9. The diagonal through the top-left and bottom-right voxels reads 10. (a) Write the voxel values in terms of the top-left value a. (b) Find a. (c) Find the value of the bottom-left voxel. Give only the answer to (c).', 11 - 6.5, None,
  '(a) Top-right 12 − a, bottom-left 11 − a, bottom-right 10 − a. (b) Bottom row: (11 − a) + (10 − a) = 8, so a = (21 − 8) ÷ 2 = 6.5. (c) Bottom-left = 11 − 6.5 = 4.5',
  ['B1: expressions', 'M1: use the bottom-row sum', 'C1: a', 'C1: value'], sig=2, aq='value')
N('H', 6, 'In a 2 × 2 block, top row 16, bottom row 6, left column 13 and right column 9; the diagonal through top-left and bottom-right reads 11. (a) Find all four voxel values. (b) Identify which voxel is most likely bone. (c) Give the value of that voxel.', 9, None,
  '(a) With top-left a: bottom-right 11 − a, bottom-left 13 − a. Bottom row: (13 − a) + (11 − a) = 6, so a = (24 − 6) ÷ 2 = 9; top-right = 16 − 9 = 7, bottom-left = 4, bottom-right = 2. (b) The top-left voxel has the highest attenuation. (c) Its value is 9.',
  ['M1: method', 'C1: a', 'C1: other values', 'B1: bone has highest attenuation', 'C1: value'], sig=1, aq='value')
N('H', 5, 'A CT scan has 200 slices, each 512 × 512 pixels stored as 2 bytes. (a) Calculate the bytes per slice. (b) Calculate the total data in MB (1 MB = 10⁶ bytes).', 512 * 512 * 2 * 200 / 1e6, 'MB',
  f'(a) 512 × 512 × 2 = 524 288 bytes. (b) 524 288 × 200 ÷ 10⁶ = {sf(524288 * 200 / 1e6)} MB',
  ['C1: per slice', 'M1: × slices', 'C1: ÷ 10⁶', 'C1: value'], aq='size')
N('H', 6, 'A helical CT scanner rotates once every 0.50 s with a beam width of 40 mm and a pitch of 1.5. (a) Calculate the table movement per rotation. (b) Calculate the table speed. (c) Calculate the time to scan 600 mm. Give only the answer to (c).', 600 / (1.5 * 40 / 0.50), 's',
  '(a) 1.5 × 40 = 60 mm. (b) 60 ÷ 0.50 = 120 mm s⁻¹. (c) t = 600 ÷ 120 = 5.0 s',
  ['C1: pitch × width', 'C1: per rotation', 'C1: speed', 'M1: t = d/v', 'C1: value'], sig=2, aq='t')
N('H', 5, 'A beam path crosses 10 voxels, each 1.0 cm long: 9 are soft tissue (μ = 0.20 cm⁻¹) and one is bone (μ = 0.50 cm⁻¹). (a) Calculate the total μx. (b) Calculate the fraction of the beam transmitted.', exp(-(9 * 0.20 + 0.50)), None,
  f'(a) μx = 9 × 0.20 × 1.0 + 0.50 × 1.0 = 2.3. (b) e^(−2.3) = {sf(exp(-2.3))}',
  ['C1: tissue sum', 'C1: add bone', 'M1: e^(−Σμx)', 'C1: value'], aq='fraction')
N('H', 6, 'A CT scan deposits a dose of 10 mGy in a 5.0 kg region of the body (1 Gy = 1 J kg⁻¹). (a) Calculate the energy absorbed, in mJ. (b) Explain why the risk is still considered acceptable for a diagnosis.', 10e-3 * 5.0 * 1e3, 'mJ',
  '(a) E = 10 × 10⁻³ × 5.0 = 0.050 J. In mJ: 0.050 × 10³ = 50. (b) The diagnostic benefit outweighs the small extra cancer risk.',
  ['C1: Gy as J kg⁻¹', 'M1: E = D × m', 'C1: value', 'C1: J to mJ', 'B1: benefit vs risk'], sig=2, aq='E')
N('H', 5, 'A CT scanner records 1000 projections per rotation with 800 detector elements, each reading stored as 2 bytes. (a) Calculate the number of readings per rotation. (b) Calculate the data per rotation, in MB (1 MB = 10⁶ bytes).', 1000 * 800 * 2 / 1e6, 'MB',
  '(a) 1000 × 800 = 8.0 × 10⁵. (b) 8.0 × 10⁵ × 2 ÷ 10⁶ = 1.6 MB',
  ['C1: readings', 'C1: bytes', 'M1: ÷ 10⁶', 'C1: value'], sig=2, aq='size')
N('H', 6, 'A slice is 400 mm across and imaged as 512 × 512 pixels; the slice is 1.0 mm thick. (a) Calculate the pixel width. (b) Calculate the voxel volume in mm³. (c) A tumour 2.0 mm across is imaged. How many voxels wide is it? Give only the answer to (b).', (400 / 512) ** 2 * 1.0, 'mm³',
  f'(a) 400 ÷ 512 = {sf(400 / 512, 4)} mm. (b) V = ({sf(400 / 512, 4)})² × 1.0 = {sf((400 / 512) ** 2)} mm³. (c) 2.0 ÷ {sf(400 / 512, 4)} ≈ 2.6 voxels.',
  ['C1: pixel width', 'M1: volume = w² × t', 'C1: substitution', 'C1: value', 'C1: tumour width in voxels'], aq='V')
N('H', 5, 'A 2 × 2 voxel block has these readings: top row 5.0, bottom row 3.0, left column 4.5, right column 3.5, and diagonal (top-left + bottom-right) 4.0. (a) Find the top-left value. (b) Find the top-right value. Give only the answer to (b).', 5.0 - 2.75, None,
  '(a) Bottom-left = 4.5 − a, bottom-right = 4.0 − a, so (4.5 − a) + (4.0 − a) = 3.0, a = (8.5 − 3.0) ÷ 2 = 2.75. (b) Top-right = 5.0 − 2.75 = 2.25',
  ['M1: express in a', 'C1: equation', 'C1: a', 'C1: top-right'], aq='value')
N('H', 6, 'A CT examination gives an effective dose of 6.0 mSv, while natural background gives about 2.4 mSv per year. (a) Calculate the scan dose in years of background. (b) Calculate the dose from 15 chest radiographs of 0.020 mSv each, and compare. Give only the answer to (a), in years.', 6.0 / 2.4, 'years',
  '(a) 6.0 ÷ 2.4 = 2.5 years. (b) 15 × 0.020 = 0.30 mSv, far less than one CT scan.',
  ['M1: ratio', 'C1: value', 'C1: radiograph total', 'B1: comparison', 'B1: units consistent'], sig=2, aq='equivalent')
