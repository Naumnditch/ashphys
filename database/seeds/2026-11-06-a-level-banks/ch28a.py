# Chapter 28 Quantum physics — part a: 28.1 to 28.6.
HP, CL, QE, ME, MP = 6.63e-34, 3.00e8, 1.60e-19, 9.11e-31, 1.67e-27
HC = HP * CL


def ephot(lam):
    return HC / lam


def lam_db(m, v):
    return HP / (m * v)


# ═════════════════════════ 28.1 Modelling with particles and waves (17/18/9) ═════════════════════════
lesson('28.1')
N('E', 2, 'A red laser pointer emits light of wavelength 650 nm. Calculate the energy carried by one of its photons, in units of 10⁻¹⁹ J.' + take('h', 'c'), ephot(650e-9), '10⁻¹⁹ J',
  f'E = hc/λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 650 × 10⁻⁹ = {sf(ephot(650e-9))} J', ['C1: E = hc/λ'], aq='E')
M('E', 1, 'Which observation is evidence that light behaves as a stream of particles?', 'The photoelectric effect', ['Two-slit interference', 'Diffraction through a narrow gap', 'Polarisation by a filter'], 'Photoelectric emission shows light delivers energy in individual quanta.')
N('E', 2, 'A photon of violet light has a frequency of 7.3 × 10¹⁴ Hz. Calculate the photon energy in units of 10⁻¹⁹ J.' + take('h'), HP * 7.3e14, '10⁻¹⁹ J',
  f'E = hf = 6.63 × 10⁻³⁴ × 7.3 × 10¹⁴ = {sf(HP * 7.3e14)} J', ['C1: E = hf'], sig=2, aq='E')
M('E', 1, 'A beam of electrons passes through a thin layer of graphite and forms rings on a screen. What does this show?', 'Electrons can behave as waves', ['Electrons have negative charge', 'Electrons are much lighter than atoms', 'Graphite emits light when struck'], 'The rings are a diffraction pattern, a wave effect.')
N('E', 2, 'A proton travels at 2.0 × 10⁵ m s⁻¹. Calculate its de Broglie wavelength in units of 10⁻¹² m.' + take('h', 'mp'), lam_db(MP, 2.0e5), '10⁻¹² m',
  f'λ = h/mv = 6.63 × 10⁻³⁴ ÷ (1.67 × 10⁻²⁷ × 2.0 × 10⁵) = {sf(lam_db(MP, 2.0e5))} m', ['C1: λ = h/p'], aq='λ')
M('E', 1, 'The energy of a single photon is directly proportional to which quantity?', 'The frequency of the radiation', ['The wavelength of the radiation', 'The intensity of the beam', 'The amplitude of the wave'], 'E = hf, so doubling the frequency doubles the energy of each photon.')
N('E', 1, 'A photon carries 3.0 × 10⁻¹⁹ J. Express this energy in electronvolts (eV).' + take('e'), 3.0e-19 / QE, 'eV',
  f'E = 3.0 × 10⁻¹⁹ ÷ 1.60 × 10⁻¹⁹ = {sf(3.0e-19 / QE)} eV', [], aq='E')
M('E', 1, 'Which experiment is usually quoted as evidence that light is a wave?', 'Young\'s double-slit experiment', ['The photoelectric effect', 'Line emission spectra', 'The emission of electrons from a hot filament'], 'Interference fringes need superposition of waves.')
N('E', 2, 'Electrons in a diffraction tube have a de Broglie wavelength of 0.15 nm. Calculate their momentum in units of 10⁻²⁴ kg m s⁻¹.' + take('h'), HP / 0.15e-9, '10⁻²⁴ kg m s⁻¹',
  f'p = h/λ = 6.63 × 10⁻³⁴ ÷ 0.15 × 10⁻⁹ = {sf(HP / 0.15e-9)} kg m s⁻¹', ['C1: p = h/λ'], aq='p')
M('E', 1, 'Which description fits the particle model of light?', 'Energy arrives in discrete packets, each absorbed at one point', ['Energy spreads out evenly over the whole wavefront', 'Light bends round obstacles', 'Two beams can cancel to give darkness'], 'Photons are localised quanta of energy.')
N('E', 2, 'Green light from a mercury lamp has photons of energy 2.27 eV. Calculate the energy of each photon in units of 10⁻¹⁹ J.' + take('e'), 2.27 * QE, '10⁻¹⁹ J',
  f'E = 2.27 × 1.60 × 10⁻¹⁹ = {sf(2.27 * QE)} J', ['C1: 1 eV = 1.60 × 10⁻¹⁹ J'], aq='E')
M('E', 1, 'What is meant by a quantum of energy?', 'The smallest discrete amount of energy that can be transferred in a process', ['Any very small amount of energy', 'The energy of one mole of photons', 'The energy needed to remove an electron from a metal'], 'Energy in electromagnetic radiation is transferred in whole numbers of quanta (photons).')
N('E', 2, 'An ultraviolet photon has an energy of 6.6 × 10⁻¹⁹ J. Calculate its wavelength.' + take('h', 'c'), HC / 6.6e-19, 'm',
  f'λ = hc/E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 6.6 × 10⁻¹⁹ = {sf(HC / 6.6e-19)} m', ['C1: λ = hc/E'], aq='λ')
M('E', 1, 'For electrons to be diffracted noticeably by a crystal, how must their de Broglie wavelength compare with the spacing of the atoms?', 'It must be of a similar size', ['It must be much larger', 'It must be much smaller', 'It makes no difference'], 'Diffraction is most marked when the wavelength is similar to the gap size.')
N('E', 2, 'A neutron (mass 1.67 × 10⁻²⁷ kg) leaves a reactor at 2200 m s⁻¹. Calculate its de Broglie wavelength.' + take('h'), lam_db(1.67e-27, 2200), 'm',
  f'λ = h/mv = 6.63 × 10⁻³⁴ ÷ (1.67 × 10⁻²⁷ × 2200) = {sf(lam_db(1.67e-27, 2200))} m', ['C1: λ = h/mv'], aq='λ')
M('E', 1, 'Which statement about a photon is correct?', 'It travels at the speed of light and has no rest mass', ['It has a negative charge', 'It travels more slowly than light in a vacuum', 'It always has the same energy'], 'Photons are massless quanta of electromagnetic radiation.')
N('E', 2, 'A laser emits 4.0 × 10¹⁶ photons each second, each of energy 3.1 × 10⁻¹⁹ J. Calculate its output power.', 4.0e16 * 3.1e-19, 'W',
  f'P = nE = 4.0 × 10¹⁶ × 3.1 × 10⁻¹⁹ = {sf(4.0e16 * 3.1e-19)} W', ['C1: P = (photons per second) × E'], sig=2, aq='P')
# medium
N('M', 3, 'A helium–neon laser of output power 0.50 mW emits light of wavelength 633 nm. Calculate the number of photons it emits each second.' + take('h', 'c'), 0.50e-3 / ephot(633e-9), None,
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 633 × 10⁻⁹ = {sf(ephot(633e-9), 4)} J. n = 0.50 × 10⁻³ ÷ {sf(ephot(633e-9), 4)} = {sf(0.50e-3 / ephot(633e-9))}', ['C1: E = hc/λ', 'C1: n = P/E'], aq='n')
N('M', 4, 'An electron is accelerated from rest through a potential difference of 50 V. Calculate its de Broglie wavelength.' + take('h', 'me', 'e'), HP / sqrt(2 * ME * QE * 50), 'm',
  f'Ek = eV = 1.60 × 10⁻¹⁹ × 50 = 8.0 × 10⁻¹⁸ J. p = √(2mEk) = √(2 × 9.11 × 10⁻³¹ × 8.0 × 10⁻¹⁸) = {sf(sqrt(2 * ME * 8e-18), 4)} kg m s⁻¹. λ = 6.63 × 10⁻³⁴ ÷ {sf(sqrt(2 * ME * 8e-18), 4)} = {sf(HP / sqrt(2 * ME * QE * 50))} m',
  ['C1: Ek = eV', 'C1: p = √(2mEk)', 'C1: λ = h/p'], aq='λ')
M('M', 3, 'An electron and a proton have the same de Broglie wavelength. Which statement is correct?', 'They have the same momentum', ['They have the same speed', 'They have the same kinetic energy', 'The proton has the larger momentum'], 'λ = h/p, so equal λ means equal p; the proton is slower and has less kinetic energy.', ['C1: λ = h/p', 'C1: equal λ ⇒ equal p'])
N('M', 3, 'A blue line in the spectrum of hydrogen has wavelength 410 nm. Calculate the photon energy in eV.' + take('h', 'c', 'e'), ephot(410e-9) / QE, 'eV',
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 410 × 10⁻⁹ = {sf(ephot(410e-9), 4)} J. In eV: {sf(ephot(410e-9), 4)} ÷ 1.60 × 10⁻¹⁹ = {sf(ephot(410e-9) / QE)} eV', ['C1: E = hc/λ', 'C1: ÷ e'], aq='E')
N('M', 4, 'Electrons have a de Broglie wavelength of 0.20 nm. Calculate their kinetic energy in eV.' + take('h', 'me', 'e'), (HP / 0.20e-9) ** 2 / (2 * ME) / QE, 'eV',
  f'p = 6.63 × 10⁻³⁴ ÷ 0.20 × 10⁻⁹ = {sf(HP / 0.2e-9, 4)} kg m s⁻¹. Ek = p²/2m = ({sf(HP / 0.2e-9, 4)})² ÷ (2 × 9.11 × 10⁻³¹) = {sf((HP / 0.2e-9) ** 2 / (2 * ME), 4)} J. In eV: {sf((HP / 0.2e-9) ** 2 / (2 * ME), 4)} ÷ 1.60 × 10⁻¹⁹ = {sf((HP / 0.2e-9) ** 2 / (2 * ME) / QE)} eV',
  ['C1: p = h/λ', 'C1: Ek = p²/2m', 'C1: ÷ e'], aq='Ek')
M('M', 3, 'Why is the wave model of light unable to explain the photoelectric effect?', 'A wave would deliver energy continuously, so even dim light of any frequency should eventually release electrons', ['Waves cannot carry energy', 'Waves cannot travel through a vacuum', 'The wave model predicts no electrons for bright light'], 'Emission depends on frequency, not intensity, and is instant: energy arrives in photons.', ['C1: wave energy spread and continuous', 'C1: threshold frequency observed'])
N('M', 3, 'Calculate (energy of a photon of blue light, 450 nm) ÷ (energy of a photon of red light, 700 nm).', 700 / 450, None,
  f'E ∝ 1/λ, so ratio = 700 ÷ 450 = {sf(700 / 450)}', ['C1: E = hc/λ', 'C1: ratio of wavelengths inverted'], aq='ratio')
N('M', 3, 'In an electron diffraction tube the electrons have a de Broglie wavelength of 5.0 × 10⁻¹¹ m. Calculate the speed of the electrons.' + take('h', 'me'), HP / (ME * 5.0e-11), 'm s⁻¹',
  f'v = h/mλ = 6.63 × 10⁻³⁴ ÷ (9.11 × 10⁻³¹ × 5.0 × 10⁻¹¹) = {sf(HP / (ME * 5.0e-11))} m s⁻¹', ['C1: λ = h/mv', 'C1: rearranged'], aq='v')
M('M', 3, 'In the photon model, what determines the intensity of a beam of monochromatic light?', 'The number of photons arriving per second per unit area', ['The energy of each photon', 'The frequency of the light', 'The speed of the photons'], 'For fixed frequency, each photon has the same energy, so intensity ∝ photon flux.', ['C1: photon energy fixed by f', 'C1: intensity ∝ number per second per area'])
N('M', 4, 'Light of wavelength 550 nm and intensity 2.0 W m⁻² falls on a detector of area 1.0 × 10⁻⁴ m². How many photons reach the detector each second?' + take('h', 'c'), 2.0 * 1.0e-4 / ephot(550e-9), None,
  f'P = IA = 2.0 × 1.0 × 10⁻⁴ = 2.0 × 10⁻⁴ W. E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 550 × 10⁻⁹ = {sf(ephot(550e-9), 4)} J. n = 2.0 × 10⁻⁴ ÷ {sf(ephot(550e-9), 4)} = {sf(2e-4 / ephot(550e-9))}',
  ['C1: P = IA', 'C1: photon energy', 'C1: n = P/E'], aq='n')
M('M', 3, 'The accelerating voltage in an electron diffraction tube is increased. What happens to the rings on the screen?', 'They get smaller because the electrons\' de Broglie wavelength decreases', ['They get larger because the wavelength increases', 'They do not change', 'They disappear because faster electrons cannot diffract'], 'Higher p.d. gives larger momentum and λ = h/p is smaller, so the diffraction angle is smaller.', ['C1: momentum increases', 'C1: λ decreases so angles smaller'])
N('M', 3, 'An α-particle (mass 6.64 × 10⁻²⁷ kg) moves at 1.5 × 10⁷ m s⁻¹. Calculate its de Broglie wavelength in units of 10⁻¹⁵ m.' + take('h'), lam_db(6.64e-27, 1.5e7), '10⁻¹⁵ m',
  f'λ = h/mv = 6.63 × 10⁻³⁴ ÷ (6.64 × 10⁻²⁷ × 1.5 × 10⁷) = {sf(lam_db(6.64e-27, 1.5e7))} m', ['C1: p = mv', 'C1: λ = h/p'], aq='λ')
N('M', 3, 'A green laser has wavelength 532 nm. Calculate the momentum of one of its photons in units of 10⁻²⁷ kg m s⁻¹.' + take('h'), HP / 532e-9, '10⁻²⁷ kg m s⁻¹',
  f'p = h/λ = 6.63 × 10⁻³⁴ ÷ 532 × 10⁻⁹ = {sf(HP / 532e-9)} kg m s⁻¹', ['C1: p = h/λ', 'C1: nm to m'], aq='p')
M('M', 4, 'An X-ray photon and an electron both have a wavelength of 0.10 nm. Which statement is correct?', 'The photon has much more energy than the electron', ['The electron has much more energy than the photon', 'They have equal energies', 'They have different momenta'], 'Both have p = h/λ. The photon energy is pc ≈ 12 keV; the electron energy is p²/2m ≈ 150 eV.', ['C1: equal momenta', 'C1: photon E = pc', 'C1: electron E = p²/2m much smaller'])
N('M', 4, 'An electron moves at 1.0 × 10⁶ m s⁻¹. Calculate the wavelength of a photon that has the same momentum as the electron. Give your answer in nm.' + take('h', 'me'), HP / (ME * 1.0e6) * 1e9, 'nm',
  f'p = 9.11 × 10⁻³¹ × 1.0 × 10⁶ = 9.11 × 10⁻²⁵ kg m s⁻¹. λ = 6.63 × 10⁻³⁴ ÷ 9.11 × 10⁻²⁵ = {sf(HP / 9.11e-25, 4)} m. In nm: {sf(HP / 9.11e-25, 4)} × 10⁹ = {sf(HP / 9.11e-25 * 1e9)}',
  ['C1: p = mv', 'C1: λ = h/p', 'C1: convert to nm'], aq='λ')
M('M', 3, 'Why is no diffraction seen when a cricket ball is thrown through a doorway?', 'Its de Broglie wavelength is far smaller than the width of the doorway', ['Cricket balls have no de Broglie wavelength', 'The doorway is too narrow', 'Only charged particles can diffract'], 'λ = h/mv ≈ 10⁻³⁴ m for a ball, far too small to diffract.', ['C1: λ = h/mv tiny', 'C1: compare with gap'])
N('M', 3, 'An infrared laser of wavelength 1064 nm has an output of 1.0 W. How many photons does it emit per second?' + take('h', 'c'), 1.0 / ephot(1064e-9), None,
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 1064 × 10⁻⁹ = {sf(ephot(1064e-9), 4)} J. n = 1.0 ÷ {sf(ephot(1064e-9), 4)} = {sf(1.0 / ephot(1064e-9))}', ['C1: photon energy', 'C1: n = P/E'], aq='n')
M('M', 3, 'Which pair of observations supports wave–particle duality for electrons?', 'Electrons are deflected by fields as charged particles, and they form diffraction patterns', ['Electrons are emitted from metals, and they can be absorbed', 'Electrons have charge, and they have mass', 'Electrons travel in straight lines, and they produce X-rays'], 'Deflection shows particle behaviour; diffraction shows wave behaviour.', ['C1: particle evidence', 'C1: wave evidence'])
N('M', 3, 'A radio station broadcasts at 98 MHz. Calculate the energy of one of its photons in units of 10⁻²⁶ J.' + take('h'), HP * 98e6, '10⁻²⁶ J',
  f'E = hf = 6.63 × 10⁻³⁴ × 98 × 10⁶ = {sf(HP * 98e6)} J', ['C1: E = hf', 'C1: MHz to Hz'], sig=2, aq='E')
# hard
N('H', 5, 'Electrons are accelerated from rest through 150 V and directed at a crystal whose atomic planes are 2.1 × 10⁻¹⁰ m apart. (a) Calculate the kinetic energy of each electron in joules. (b) Calculate the momentum. (c) Calculate the de Broglie wavelength. (d) State whether noticeable diffraction is expected. Give only the answer to (c).' + take('h', 'me', 'e'), HP / sqrt(2 * ME * QE * 150), 'm',
  f'(a) Ek = 1.60 × 10⁻¹⁹ × 150 = 2.4 × 10⁻¹⁷ J. (b) p = √(2 × 9.11 × 10⁻³¹ × 2.4 × 10⁻¹⁷) = {sf(sqrt(2 * ME * 2.4e-17), 4)} kg m s⁻¹. (c) λ = 6.63 × 10⁻³⁴ ÷ {sf(sqrt(2 * ME * 2.4e-17), 4)} = {sf(HP / sqrt(2 * ME * 2.4e-17))} m. (d) Yes: λ is similar to the plane spacing.',
  ['C1: Ek = eV', 'C1: p = √(2mEk)', 'C1: λ = h/p', 'B1: comparison with spacing'], aq='λ')
N('H', 6, 'A 5.0 mW laser emits light of wavelength 405 nm. All the light is absorbed by a small black card. (a) Calculate the photon energy. (b) Calculate the number of photons absorbed per second. (c) Calculate the momentum of one photon. (d) Calculate the force on the card. Give only the answer to (d), in units of 10⁻¹¹ N.' + take('h', 'c'), 5.0e-3 / CL, '10⁻¹¹ N',
  f'(a) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 405 × 10⁻⁹ = {sf(ephot(405e-9), 4)} J. (b) n = 5.0 × 10⁻³ ÷ {sf(ephot(405e-9), 4)} = {sf(5e-3 / ephot(405e-9), 4)} s⁻¹. (c) p = 6.63 × 10⁻³⁴ ÷ 405 × 10⁻⁹ = {sf(HP / 405e-9, 4)} kg m s⁻¹. (d) F = np = {sf(5e-3 / ephot(405e-9), 4)} × {sf(HP / 405e-9, 4)} = {sf(5e-3 / CL)} N',
  ['C1: photon energy', 'C1: photon rate', 'C1: photon momentum', 'M1: F = rate of change of momentum', 'C1: value'], aq='F')
N('H', 6, 'An electron and a photon each have an energy of 2.0 keV. (a) Calculate the wavelength of the photon. (b) Calculate the momentum of the electron. (c) Calculate the de Broglie wavelength of the electron. (d) Calculate (photon wavelength) ÷ (electron wavelength). Give only the answer to (d).' + take('h', 'c', 'me', 'e'), (HC / (2000 * QE)) / (HP / sqrt(2 * ME * 2000 * QE)), None,
  f'E = 2000 × 1.60 × 10⁻¹⁹ = 3.2 × 10⁻¹⁶ J. (a) λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 3.2 × 10⁻¹⁶ = {sf(HC / 3.2e-16, 4)} m. (b) p = √(2 × 9.11 × 10⁻³¹ × 3.2 × 10⁻¹⁶) = {sf(sqrt(2 * ME * 3.2e-16), 4)} kg m s⁻¹. (c) λₑ = 6.63 × 10⁻³⁴ ÷ {sf(sqrt(2 * ME * 3.2e-16), 4)} = {sf(HP / sqrt(2 * ME * 3.2e-16), 4)} m. (d) {sf(HC / 3.2e-16, 4)} ÷ {sf(HP / sqrt(2 * ME * 3.2e-16), 4)} = {sf((HC / 3.2e-16) / (HP / sqrt(2 * ME * 3.2e-16)))}',
  ['C1: keV to J', 'C1: photon λ = hc/E', 'C1: electron p = √(2mE)', 'C1: λₑ = h/p', 'C1: ratio'], aq='ratio')
N('H', 5, 'Sunlight of intensity 1000 W m⁻² falls on a solar cell of area 0.020 m². Treat the light as photons of mean wavelength 550 nm. (a) Calculate the power reaching the cell. (b) Calculate the energy of one photon. (c) Calculate the number of photons reaching the cell per second. Give only the answer to (c).' + take('h', 'c'), 1000 * 0.020 / ephot(550e-9), None,
  f'(a) P = 1000 × 0.020 = 20 W. (b) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 550 × 10⁻⁹ = {sf(ephot(550e-9), 4)} J. (c) n = 20 ÷ {sf(ephot(550e-9), 4)} = {sf(20 / ephot(550e-9))}',
  ['C1: P = IA', 'C1: photon energy', 'M1: n = P/E', 'B1: mean wavelength assumption'], aq='n')
N('H', 5, 'A very dim beam of light of wavelength 600 nm and power 1.0 × 10⁻¹⁶ W passes through a double slit to a detector 1.2 m away. (a) Calculate the number of photons per second. (b) Calculate the mean distance between successive photons along the beam. (c) Explain why an interference pattern still builds up. Give only the answer to (b).' + take('h', 'c'), CL / (1.0e-16 / ephot(600e-9)), 'm',
  f'(a) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 600 × 10⁻⁹ = {sf(ephot(600e-9), 4)} J, so n = 1.0 × 10⁻¹⁶ ÷ {sf(ephot(600e-9), 4)} = {sf(1e-16 / ephot(600e-9), 4)} s⁻¹. (b) Spacing = c/n = 3.00 × 10⁸ ÷ {sf(1e-16 / ephot(600e-9), 4)} = {sf(CL / (1e-16 / ephot(600e-9)))} m. (c) The photons pass the slits one at a time, yet each arrives with the probability given by the wave pattern.',
  ['C1: photon rate', 'M1: spacing = c ÷ rate', 'C1: value', 'B1: one photon at a time; wave gives probability'], aq='spacing')
N('H', 6, 'A beam of neutrons is to be diffracted by a crystal, so the neutrons need a de Broglie wavelength of 0.18 nm. A neutron has mass 1.67 × 10⁻²⁷ kg. (a) Calculate the momentum required. (b) Calculate the speed. (c) Calculate the kinetic energy in eV. Give only the answer to (c).' + take('h', 'e'), (HP / 0.18e-9) ** 2 / (2 * 1.67e-27) / QE, 'eV',
  f'(a) p = 6.63 × 10⁻³⁴ ÷ 0.18 × 10⁻⁹ = {sf(HP / 0.18e-9, 4)} kg m s⁻¹. (b) v = {sf(HP / 0.18e-9, 4)} ÷ 1.67 × 10⁻²⁷ = {sf(HP / 0.18e-9 / 1.67e-27, 4)} m s⁻¹. (c) Ek = p²/2m = ({sf(HP / 0.18e-9, 4)})² ÷ (2 × 1.67 × 10⁻²⁷) = {sf((HP / 0.18e-9) ** 2 / (2 * 1.67e-27), 4)} J. In eV: {sf((HP / 0.18e-9) ** 2 / (2 * 1.67e-27), 4)} ÷ 1.60 × 10⁻¹⁹ = {sf((HP / 0.18e-9) ** 2 / (2 * 1.67e-27) / QE)} eV',
  ['C1: p = h/λ', 'C1: v = p/m', 'C1: Ek = p²/2m', 'C1: J to eV', 'B1: slow (thermal) neutrons suffice'], aq='Ek')
N('H', 5, 'A camera flash releases 2.0 J of light energy in 1.0 ms. Treat the light as photons of wavelength 500 nm. (a) Calculate the mean power of the flash. (b) Calculate the photon energy. (c) Calculate the number of photons emitted. Give only the answer to (c).' + take('h', 'c'), 2.0 / ephot(500e-9), None,
  f'(a) P = 2.0 ÷ 1.0 × 10⁻³ = 2000 W. (b) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 500 × 10⁻⁹ = {sf(ephot(500e-9), 4)} J. (c) N = 2.0 ÷ {sf(ephot(500e-9), 4)} = {sf(2.0 / ephot(500e-9))}',
  ['C1: P = E/t', 'C1: photon energy', 'M1: N = total energy ÷ photon energy', 'B1: single wavelength assumed'], aq='N')
N('H', 6, 'Radio waves of 100 MHz and X-rays of 3.0 × 10¹⁸ Hz are both electromagnetic. (a) Calculate the photon energy of each. (b) Calculate (X-ray photon energy) ÷ (radio photon energy). (c) Explain why the particle nature is obvious for X-rays but not for radio waves. Give only the answer to (b).' + take('h'), 3.0e18 / 100e6, None,
  f'(a) Radio: 6.63 × 10⁻³⁴ × 100 × 10⁶ = {sf(HP * 1e8)} J; X-ray: 6.63 × 10⁻³⁴ × 3.0 × 10¹⁸ = {sf(HP * 3e18)} J. (b) Ratio = 3.0 × 10¹⁸ ÷ 100 × 10⁶ = {sf(3e18 / 1e8)}. (c) A radio signal contains enormous numbers of tiny quanta, so it seems continuous; one X-ray photon can ionise an atom.',
  ['C1: radio E', 'C1: X-ray E', 'C1: ratio = ratio of frequencies', 'B1: many small quanta', 'B1: single X-ray photon detectable'], sig=2, aq='ratio')
N('H', 5, 'A beam of electrons and a beam of red light (650 nm) are to give the same diffraction pattern with a given grating, so they must have the same wavelength. (a) Calculate the momentum the electrons need. (b) Calculate their speed. (c) Calculate the accelerating p.d. needed, starting from rest. Give only the answer to (c), in units of 10⁻⁶ V.' + take('h', 'me', 'e'), (HP / 650e-9) ** 2 / (2 * ME) / QE, '10⁻⁶ V',
  f'(a) p = 6.63 × 10⁻³⁴ ÷ 650 × 10⁻⁹ = {sf(HP / 650e-9, 4)} kg m s⁻¹. (b) v = {sf(HP / 650e-9, 4)} ÷ 9.11 × 10⁻³¹ = {sf(HP / 650e-9 / ME, 4)} m s⁻¹. (c) V = p²/(2me) = ({sf(HP / 650e-9, 4)})² ÷ (2 × 9.11 × 10⁻³¹ × 1.60 × 10⁻¹⁹) = {sf((HP / 650e-9) ** 2 / (2 * ME * QE))} V',
  ['C1: p = h/λ', 'C1: v = p/m', 'M1: eV = p²/2m', 'C1: value'], aq='V')

# ═════════════════════════ 28.2 Photons: energy and momentum (16/17/9) ═════════════════════════
lesson('28.2')
N('E', 2, 'A sodium street lamp emits yellow light of wavelength 589 nm. Calculate the energy of one photon of this light in units of 10⁻¹⁹ J.' + take('h', 'c'), ephot(589e-9), '10⁻¹⁹ J',
  f'E = hc/λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 589 × 10⁻⁹ = {sf(ephot(589e-9))} J', ['C1: E = hc/λ'], aq='E')
M('E', 1, 'What is the unit of the Planck constant?', 'J s', ['J s⁻¹', 'J Hz', 'W s⁻¹'], 'h = E/f, so its unit is J ÷ s⁻¹ = J s.')
N('E', 2, 'Microwaves in an oven have a frequency of 2.45 × 10⁹ Hz. Calculate the energy of one microwave photon in units of 10⁻²⁴ J.' + take('h'), HP * 2.45e9, '10⁻²⁴ J',
  f'E = hf = 6.63 × 10⁻³⁴ × 2.45 × 10⁹ = {sf(HP * 2.45e9)} J', ['C1: E = hf'], aq='E')
M('E', 1, 'The wavelength of a beam of light is halved. What happens to the energy of each photon?', 'It doubles', ['It halves', 'It is unchanged', 'It increases by a factor of four'], 'E = hc/λ, so E ∝ 1/λ.')
N('E', 2, 'A photon of infrared radiation has an energy of 1.5 × 10⁻¹⁹ J. Calculate its frequency.' + take('h'), 1.5e-19 / HP, 'Hz',
  f'f = E/h = 1.5 × 10⁻¹⁹ ÷ 6.63 × 10⁻³⁴ = {sf(1.5e-19 / HP)} Hz', ['C1: f = E/h'], aq='f')
M('E', 1, 'Which expression gives the momentum p of a photon of energy E?', 'p = E/c', ['p = Ec', 'p = E/c²', 'p = hE'], 'p = h/λ = hf/c = E/c.')
N('E', 2, 'A gamma-ray photon has a frequency of 2.4 × 10²⁰ Hz. Calculate its energy in units of 10⁻¹³ J.' + take('h'), HP * 2.4e20, '10⁻¹³ J',
  f'E = hf = 6.63 × 10⁻³⁴ × 2.4 × 10²⁰ = {sf(HP * 2.4e20)} J', ['C1: E = hf'], sig=2, aq='E')
M('E', 1, 'One electronvolt is the energy transferred when', 'an electron moves through a potential difference of 1 V', ['one joule moves an electron through 1 m', 'a photon of frequency 1 Hz is absorbed', 'an electron moves at 1 m s⁻¹'], '1 eV = 1.60 × 10⁻¹⁹ C × 1 V = 1.60 × 10⁻¹⁹ J.')
N('E', 2, 'A photon of ultraviolet light has an energy of 4.8 eV. Calculate this energy in units of 10⁻¹⁹ J.' + take('e'), 4.8 * QE, '10⁻¹⁹ J',
  f'E = 4.8 × 1.60 × 10⁻¹⁹ = {sf(4.8 * QE)} J', ['C1: × 1.60 × 10⁻¹⁹'], sig=2, aq='E')
M('E', 1, 'Which colour of visible light has photons of the greatest energy?', 'Violet', ['Red', 'Yellow', 'Green'], 'Violet has the highest frequency in the visible spectrum.')
N('E', 2, 'Calculate the momentum of a photon of ultraviolet light of wavelength 250 nm, in units of 10⁻²⁷ kg m s⁻¹.' + take('h'), HP / 250e-9, '10⁻²⁷ kg m s⁻¹',
  f'p = h/λ = 6.63 × 10⁻³⁴ ÷ 250 × 10⁻⁹ = {sf(HP / 250e-9)} kg m s⁻¹', ['C1: p = h/λ'], aq='p')
M('E', 1, 'A beam of monochromatic light is made brighter without changing its colour. What increases?', 'The number of photons arriving per second', ['The energy of each photon', 'The frequency of each photon', 'The speed of each photon'], 'Colour fixes photon energy; brightness is photon rate.')
N('E', 2, 'A photon has an energy of 2.0 eV. Calculate its energy in joules and hence its frequency.' + take('e', 'h'), 2.0 * QE / HP, 'Hz',
  f'E = 2.0 × 1.60 × 10⁻¹⁹ = 3.2 × 10⁻¹⁹ J. f = 3.2 × 10⁻¹⁹ ÷ 6.63 × 10⁻³⁴ = {sf(3.2e-19 / HP)} Hz', ['C1: eV to J then f = E/h'], aq='f')
N('E', 2, 'An X-ray photon has a momentum of 6.6 × 10⁻²⁴ kg m s⁻¹. Calculate its energy in units of 10⁻¹⁵ J.' + take('c'), 6.6e-24 * CL, '10⁻¹⁵ J',
  f'E = pc = 6.6 × 10⁻²⁴ × 3.00 × 10⁸ = {sf(6.6e-24 * CL)} J', ['C1: E = pc'], sig=2, aq='E')
M('E', 1, 'Which equation links the energy of a photon to its wavelength?', 'E = hc/λ', ['E = hλ/c', 'E = h/λ', 'E = λ/hc'], 'E = hf and f = c/λ, so E = hc/λ: shorter wavelengths give more energetic photons.')
N('E', 1, 'A photon has an energy of 5.0 × 10⁻¹⁹ J. Calculate its momentum in units of 10⁻²⁷ kg m s⁻¹.' + take('c'), 5.0e-19 / CL, '10⁻²⁷ kg m s⁻¹',
  f'p = E/c = 5.0 × 10⁻¹⁹ ÷ 3.00 × 10⁸ = {sf(5.0e-19 / CL)} kg m s⁻¹', [], sig=2, aq='p')
# medium
N('M', 3, 'A photon of energy 3.5 eV is emitted by an LED. Calculate the wavelength of the light in nm.' + take('h', 'c', 'e'), HC / (3.5 * QE) * 1e9, 'nm',
  f'E = 3.5 × 1.60 × 10⁻¹⁹ = 5.6 × 10⁻¹⁹ J. λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 5.6 × 10⁻¹⁹ = {sf(HC / 5.6e-19, 4)} m. In nm: {sf(HC / 5.6e-19, 4)} × 10⁹ = {sf(HC / 5.6e-19 * 1e9)}',
  ['C1: eV to J', 'C1: λ = hc/E'], aq='λ')
N('M', 3, 'A lamp emits 1.5 W of light of wavelength 590 nm. How many photons does it emit per second?' + take('h', 'c'), 1.5 / ephot(590e-9), None,
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 590 × 10⁻⁹ = {sf(ephot(590e-9), 4)} J. n = 1.5 ÷ {sf(ephot(590e-9), 4)} = {sf(1.5 / ephot(590e-9))}',
  ['C1: photon energy', 'C1: n = P/E'], aq='n')
N('M', 3, 'Show that the energy in eV of a photon of wavelength λ nm is about 1240/λ, and use this to find the energy of a 310 nm photon in eV.' + take('h', 'c', 'e'), HC / (310e-9 * QE), 'eV',
  f'hc/e = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 1.60 × 10⁻¹⁹ = 1.243 × 10⁻⁶ V m, which is 1243 eV nm. E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (310 × 10⁻⁹ × 1.60 × 10⁻¹⁹) = {sf(HC / (310e-9 * QE))} eV',
  ['C1: hc/e evaluated', 'C1: division by λ'], aq='E')
M('M', 3, 'Photon X has twice the wavelength of photon Y. What is (momentum of X) ÷ (momentum of Y)?', '0.5', ['2', '4', '0.25'], 'p = h/λ, so doubling λ halves p.', ['C1: p = h/λ', 'C1: inverse proportion'])
N('M', 3, 'A beam of photons, each of energy 2.2 × 10⁻¹⁹ J, delivers 8.8 mW. Calculate the number of photons arriving per second.', 8.8e-3 / 2.2e-19, None,
  f'n = P/E = 8.8 × 10⁻³ ÷ 2.2 × 10⁻¹⁹ = {sf(8.8e-3 / 2.2e-19)}', ['C1: P = nE', 'C1: mW to W'], sig=2, aq='n')
N('M', 4, 'A photon has a momentum of 1.2 × 10⁻²⁷ kg m s⁻¹. Calculate its energy in eV.' + take('c', 'e'), 1.2e-27 * CL / QE, 'eV',
  f'E = pc = 1.2 × 10⁻²⁷ × 3.00 × 10⁸ = 3.6 × 10⁻¹⁹ J. In eV: 3.6 × 10⁻¹⁹ ÷ 1.60 × 10⁻¹⁹ = {sf(3.6e-19 / QE)} eV',
  ['C1: E = pc', 'C1: value in J', 'C1: ÷ e'], aq='E')
M('M', 3, 'Two lasers emit the same power. Laser P emits red light and laser Q emits blue light. Which statement is correct?', 'Laser P emits more photons per second', ['Laser Q emits more photons per second', 'Both emit the same number of photons per second', 'Laser Q\'s photons have less momentum'], 'Red photons carry less energy each, so more are needed for the same power.', ['C1: E red < E blue', 'C1: n = P/E'])
N('M', 3, 'A photon of visible light has momentum 1.3 × 10⁻²⁷ kg m s⁻¹. Calculate its wavelength in nm.' + take('h'), HP / 1.3e-27 * 1e9, 'nm',
  f'λ = h/p = 6.63 × 10⁻³⁴ ÷ 1.3 × 10⁻²⁷ = {sf(HP / 1.3e-27, 4)} m. In nm: {sf(HP / 1.3e-27, 4)} × 10⁹ = {sf(HP / 1.3e-27 * 1e9)}',
  ['C1: λ = h/p', 'C1: convert to nm'], aq='λ')
N('M', 4, 'A 100 W light bulb converts 5.0% of its power into visible light. Treating this light as photons of wavelength 560 nm, calculate the number of visible photons emitted per second.' + take('h', 'c'), 5.0 / ephot(560e-9), None,
  f'Visible power = 0.050 × 100 = 5.0 W. E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 560 × 10⁻⁹ = {sf(ephot(560e-9), 4)} J. n = 5.0 ÷ {sf(ephot(560e-9), 4)} = {sf(5.0 / ephot(560e-9))}',
  ['C1: useful power', 'C1: photon energy', 'C1: n = P/E'], aq='n')
M('M', 3, 'Which graph would be a straight line through the origin?', 'Photon energy against frequency', ['Photon energy against wavelength', 'Photon momentum against wavelength', 'Photon frequency against wavelength'], 'E = hf, so E ∝ f with gradient h.', ['C1: E = hf', 'C1: gradient h'])
N('M', 3, 'Calculate (energy of an X-ray photon of wavelength 0.050 nm) ÷ (energy of a visible photon of wavelength 500 nm).', 500 / 0.050, None,
  f'E ∝ 1/λ, so ratio = 500 ÷ 0.050 = {sf(500 / 0.050)}', ['C1: E ∝ 1/λ', 'C1: same units used'], sig=2, aq='ratio')
N('M', 3, 'A pulse from a laser contains 3.0 × 10¹⁵ photons of wavelength 694 nm. Calculate the energy of the pulse.' + take('h', 'c'), 3.0e15 * ephot(694e-9), 'J',
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 694 × 10⁻⁹ = {sf(ephot(694e-9), 4)} J per photon. Total = 3.0 × 10¹⁵ × {sf(ephot(694e-9), 4)} = {sf(3e15 * ephot(694e-9))} J',
  ['C1: photon energy', 'C1: × number'], aq='E')
M('M', 4, 'A photon is absorbed by a surface. Which quantity is transferred to the surface?', 'Both energy hf and momentum h/λ', ['Energy only, because photons have no mass', 'Momentum only', 'Mass equal to hf/c'], 'A photon carries momentum p = E/c, so absorption transfers both, giving radiation pressure.', ['C1: energy transferred', 'C1: momentum p = h/λ', 'C1: radiation pressure exists'])
N('M', 3, 'Each photon from an ultraviolet lamp carries 8.0 × 10⁻¹⁹ J of energy. What momentum does one photon carry? Give the answer in units of 10⁻²⁷ kg m s⁻¹.' + take('c'), 8.0e-19 / CL, '10⁻²⁷ kg m s⁻¹',
  f'p = E/c = 8.0 × 10⁻¹⁹ ÷ 3.00 × 10⁸ = {sf(8.0e-19 / CL)} kg m s⁻¹', ['C1: p = E/c', 'C1: substitution'], aq='p')
N('M', 4, 'A photon of energy 1.8 eV is emitted by a red LED. Calculate the frequency of the light.' + take('e', 'h'), 1.8 * QE / HP, 'Hz',
  f'E = 1.8 × 1.60 × 10⁻¹⁹ = 2.88 × 10⁻¹⁹ J. f = 2.88 × 10⁻¹⁹ ÷ 6.63 × 10⁻³⁴ = {sf(2.88e-19 / HP)} Hz',
  ['C1: eV to J', 'C1: f = E/h', 'C1: substitution'], aq='f')
M('M', 3, 'Two photons have energies of 2.0 eV and 4.0 eV. What is (wavelength of the 2.0 eV photon) ÷ (wavelength of the 4.0 eV photon)?', '2', ['0.5', '4', '0.25'], 'λ = hc/E: halving E doubles λ.', ['C1: λ ∝ 1/E', 'C1: ratio'])
# hard
N('H', 5, 'A laser emits pulses of light of wavelength 532 nm. Each pulse lasts 10 ns and carries 0.20 J. (a) Calculate the mean power during a pulse. (b) Calculate the energy of one photon. (c) Calculate the number of photons in one pulse. Give only the answer to (c).' + take('h', 'c'), 0.20 / ephot(532e-9), None,
  f'(a) P = 0.20 ÷ 10 × 10⁻⁹ = 2.0 × 10⁷ W. (b) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 532 × 10⁻⁹ = {sf(ephot(532e-9), 4)} J. (c) N = 0.20 ÷ {sf(ephot(532e-9), 4)} = {sf(0.20 / ephot(532e-9))}',
  ['C1: P = E/t', 'C1: photon energy', 'M1: N = pulse energy ÷ photon energy', 'B1: correct units'], aq='N')
N('H', 6, 'A solar sail of area 100 m² faces the Sun at a distance where the intensity is 1.4 kW m⁻². The sail reflects all the light straight back. (a) Calculate the power arriving at the sail. (b) Explain why reflection doubles the momentum change of each photon. (c) Calculate the force on the sail. Give only the answer to (c), in mN.' + take('c'), 2 * 1.4e3 * 100 / CL * 1e3, 'mN',
  f'(a) P = 1.4 × 10³ × 100 = 1.4 × 10⁵ W. (b) Each photon arrives with p and leaves with −p, so Δp = 2p. (c) F = 2P/c = 2 × 1.4 × 10⁵ ÷ 3.00 × 10⁸ = {sf(2 * 1.4e5 / CL)} N. In mN: {sf(2 * 1.4e5 / CL, 4)} × 10³ = {sf(2 * 1.4e5 / CL * 1e3)}',
  ['C1: P = IA', 'B1: Δp = 2p on reflection', 'M1: F = 2P/c', 'C1: value', 'C1: conversion to mN'], aq='F')
N('H', 5, 'A detector records 5.0 × 10⁸ photons of wavelength 450 nm per second. (a) Calculate the energy of one photon. (b) Calculate the power received. (c) The detector has an area of 4.0 mm². Calculate the intensity at the detector. Give only the answer to (c).' + take('h', 'c'), 5.0e8 * ephot(450e-9) / 4.0e-6, 'W m⁻²',
  f'(a) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 450 × 10⁻⁹ = {sf(ephot(450e-9), 4)} J. (b) P = 5.0 × 10⁸ × {sf(ephot(450e-9), 4)} = {sf(5e8 * ephot(450e-9), 4)} W. (c) I = {sf(5e8 * ephot(450e-9), 4)} ÷ 4.0 × 10⁻⁶ = {sf(5e8 * ephot(450e-9) / 4e-6)} W m⁻²',
  ['C1: photon energy', 'C1: P = nE', 'C1: mm² to m²', 'C1: I = P/A'], aq='I')
N('H', 6, 'A 2.0 W beam of light of wavelength 600 nm is completely absorbed by a 1.0 g piece of foil hanging in a vacuum. (a) Calculate the momentum of one photon. (b) Calculate the number of photons absorbed per second. (c) Calculate the force on the foil. (d) Calculate the acceleration of the foil. Give only the answer to (d), in units of 10⁻⁶ m s⁻².' + take('h', 'c'), 2.0 / CL / 1.0e-3, '10⁻⁶ m s⁻²',
  f'(a) p = 6.63 × 10⁻³⁴ ÷ 600 × 10⁻⁹ = {sf(HP / 600e-9, 4)} kg m s⁻¹. (b) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 600 × 10⁻⁹ = {sf(ephot(600e-9), 4)} J, so n = 2.0 ÷ {sf(ephot(600e-9), 4)} = {sf(2.0 / ephot(600e-9), 4)} s⁻¹. (c) F = np = {sf(2.0 / ephot(600e-9), 4)} × {sf(HP / 600e-9, 4)} = {sf(2.0 / CL, 4)} N. (d) a = F/m = {sf(2.0 / CL, 4)} ÷ 1.0 × 10⁻³ = {sf(2.0 / CL / 1e-3)} m s⁻²',
  ['C1: photon momentum', 'C1: photon rate', 'C1: F = np (or P/c)', 'C1: mass in kg', 'C1: a = F/m'], aq='a')
N('H', 5, 'A star emits 3.8 × 10²⁶ W, and its light can be treated as photons of mean wavelength 500 nm. (a) Calculate the photon energy. (b) Calculate the number of photons emitted each second. (c) Explain why the photon nature of starlight can be seen with sensitive detectors on Earth. Give only the answer to (b).' + take('h', 'c'), 3.8e26 / ephot(500e-9), None,
  f'(a) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 500 × 10⁻⁹ = {sf(ephot(500e-9), 4)} J. (b) n = 3.8 × 10²⁶ ÷ {sf(ephot(500e-9), 4)} = {sf(3.8e26 / ephot(500e-9))}. (c) Far away the photons are spread so thinly that a detector receives them one at a time, as separate counts.',
  ['C1: photon energy', 'M1: n = P/E', 'C1: value', 'B1: photons arrive individually at low intensity'], aq='n')
N('H', 6, 'A photon of wavelength 0.071 nm is produced in an X-ray tube. (a) Calculate its energy in joules. (b) Calculate its energy in keV. (c) Calculate its momentum. (d) Calculate the minimum accelerating p.d. across the tube. Give only the answer to (b), in keV.' + take('h', 'c', 'e'), HC / 0.071e-9 / QE / 1e3, 'keV',
  f'(a) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 0.071 × 10⁻⁹ = {sf(HC / 0.071e-9, 4)} J. (b) In keV: {sf(HC / 0.071e-9, 4)} ÷ 1.60 × 10⁻¹⁶ = {sf(HC / 0.071e-9 / 1.6e-16)} keV. (c) p = 6.63 × 10⁻³⁴ ÷ 0.071 × 10⁻⁹ = {sf(HP / 0.071e-9)} kg m s⁻¹. (d) eV = E, so V ≈ 17.5 kV.',
  ['C1: E = hc/λ', 'C1: 1 keV = 1.60 × 10⁻¹⁶ J', 'C1: value', 'C1: p = h/λ', 'B1: V = E/e'], aq='E')
N('H', 5, 'Green light of wavelength 520 nm from a 4.0 mW laser is spread evenly over a circle of diameter 2.0 mm. (a) Calculate the intensity. (b) Calculate the number of photons per second. (c) Calculate the number of photons arriving per second on each mm². Give only the answer to (c).' + take('h', 'c'), 4.0e-3 / ephot(520e-9) / (pi * 1.0 ** 2), None,
  f'(a) A = π × (1.0 × 10⁻³)² = {sf(pi * 1e-6, 4)} m², I = 4.0 × 10⁻³ ÷ {sf(pi * 1e-6, 4)} = {sf(4e-3 / (pi * 1e-6), 4)} W m⁻². (b) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 520 × 10⁻⁹ = {sf(ephot(520e-9), 4)} J, n = 4.0 × 10⁻³ ÷ {sf(ephot(520e-9), 4)} = {sf(4e-3 / ephot(520e-9), 4)} s⁻¹. (c) Area = π × 1.0² = {sf(pi, 4)} mm², so {sf(4e-3 / ephot(520e-9), 4)} ÷ {sf(pi, 4)} = {sf(4e-3 / ephot(520e-9) / pi)}',
  ['C1: area of beam', 'C1: photon energy', 'C1: photon rate', 'C1: per mm²'], aq='n')
N('H', 5, 'A photon of energy 1.0 MeV is a gamma ray. (a) Convert this energy into joules. (b) Calculate its frequency. (c) Calculate its momentum. Give only the answer to (c), in units of 10⁻²² kg m s⁻¹.' + take('e', 'h', 'c'), 1.0e6 * QE / CL, '10⁻²² kg m s⁻¹',
  f'(a) E = 1.0 × 10⁶ × 1.60 × 10⁻¹⁹ = 1.6 × 10⁻¹³ J. (b) f = 1.6 × 10⁻¹³ ÷ 6.63 × 10⁻³⁴ = {sf(1.6e-13 / HP)} Hz. (c) p = E/c = 1.6 × 10⁻¹³ ÷ 3.00 × 10⁸ = {sf(1.6e-13 / CL)} kg m s⁻¹',
  ['C1: MeV to J', 'C1: f = E/h', 'M1: p = E/c', 'C1: value'], aq='p')
N('E', 2, 'How many photons, each of energy 4.0 eV, together carry a total energy of 1.0 J?' + take('e'), 1.0 / (4.0 * QE), None,
  f'E = 4.0 × 1.60 × 10⁻¹⁹ = 6.4 × 10⁻¹⁹ J. N = 1.0 ÷ 6.4 × 10⁻¹⁹ = {sf(1.0 / 6.4e-19)}', ['C1: eV to J then N = total ÷ E'], aq='N')
M('E', 1, 'Which type of electromagnetic radiation has photons of the lowest energy?', 'Radio waves', ['Gamma rays', 'Visible light', 'Ultraviolet'], 'Radio waves have the lowest frequency, and E = hf.')
N('M', 3, 'A photon counter registers photons that each carry 1.2 × 10⁻¹⁸ J. Calculate the wavelength of this radiation in nm.' + take('h', 'c'), HC / 1.2e-18 * 1e9, 'nm',
  f'λ = hc/E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 1.2 × 10⁻¹⁸ = {sf(HC / 1.2e-18, 4)} m. In nm: {sf(HC / 1.2e-18, 4)} × 10⁹ = {sf(HC / 1.2e-18 * 1e9)}', ['C1: λ = hc/E', 'C1: convert to nm'], aq='λ')


def ev_of(nm):
    """photon energy in eV for a wavelength in nm"""
    return HC / (nm * 1e-9) / QE


def nm_of(ev):
    """wavelength in nm of a photon of energy ev"""
    return HC / (ev * QE) * 1e9


def vmax(ev):
    return sqrt(2 * ev * QE / ME)


# ═════════════════════════ 28.3 The photoelectric effect (17/17/11) ═════════════════════════
lesson('28.3')
N('E', 2, 'Photons of energy 3.2 eV fall on a metal whose work function is 2.3 eV. Calculate the maximum kinetic energy of the emitted electrons, in eV.', 3.2 - 2.3, 'eV',
  'Ek(max) = hf − Φ = 3.2 − 2.3 = 0.90 eV', ['C1: hf = Φ + Ek(max)'], sig=2, aq='Ek(max)')
M('E', 1, 'What is meant by the work function of a metal?', 'The minimum energy needed to release an electron from the surface of the metal', ['The energy of the photons that fall on the metal', 'The kinetic energy of the fastest emitted electron', 'The energy needed to melt the metal'], 'Electrons nearest the surface need the least energy, Φ, to escape.')
N('E', 2, 'The fastest photoelectrons from a surface have a kinetic energy of 2.4 × 10⁻¹⁹ J. Calculate the stopping potential.' + take('e'), 2.4e-19 / QE, 'V',
  'V_s = Ek(max)/e = 2.4 × 10⁻¹⁹ ÷ 1.60 × 10⁻¹⁹ = 1.5 V', ['C1: eV_s = Ek(max)'], sig=2, aq='V_s')
M('E', 1, 'Light above the threshold frequency falls on a metal. Its intensity is increased, with the frequency unchanged. What happens?', 'More electrons are emitted per second, with the same maximum kinetic energy', ['The electrons are emitted with more kinetic energy', 'Fewer electrons are emitted', 'Emission stops'], 'More photons per second release more electrons, but each photon still has energy hf.')
N('E', 2, 'Potassium has a work function of 2.1 eV. Express this in units of 10⁻¹⁹ J.' + take('e'), 2.1 * QE, '10⁻¹⁹ J',
  f'Φ = 2.1 × 1.60 × 10⁻¹⁹ = {sf(2.1 * QE)} J', ['C1: × 1.60 × 10⁻¹⁹'], sig=2, aq='Φ')
M('E', 1, 'The frequency of light shining on a metal is increased (it is already above the threshold). What happens to the maximum kinetic energy of the photoelectrons?', 'It increases', ['It decreases', 'It stays the same', 'It falls to zero'], 'Ek(max) = hf − Φ rises with f.')
N('E', 2, 'Photoelectrons are just stopped by a potential difference of 0.80 V. Calculate their maximum kinetic energy in units of 10⁻¹⁹ J.' + take('e'), 0.80 * QE, '10⁻¹⁹ J',
  f'Ek(max) = eV_s = 1.60 × 10⁻¹⁹ × 0.80 = {sf(0.8 * QE)} J', ['C1: Ek = eV_s'], sig=2, aq='Ek(max)')
M('E', 1, 'When light above the threshold frequency first reaches a metal surface, how long is it before electrons are emitted?', 'Emission begins at once, with no measurable delay', ['About a second', 'It depends on the intensity: dim light takes hours', 'Emission only starts once the metal warms up'], 'Each photon gives its energy to one electron instantly.')
N('E', 2, 'Photons of energy 5.0 × 10⁻¹⁹ J strike a metal with a work function of 3.2 × 10⁻¹⁹ J. Calculate the maximum kinetic energy of the photoelectrons, in units of 10⁻¹⁹ J.', 5.0e-19 - 3.2e-19, '10⁻¹⁹ J',
  'Ek(max) = hf − Φ = 5.0 × 10⁻¹⁹ − 3.2 × 10⁻¹⁹ = 1.8 × 10⁻¹⁹ J', ['C1: Ek(max) = hf − Φ'], sig=2, aq='Ek(max)')
M('E', 1, 'In the photon explanation of the photoelectric effect, how many electrons can one photon release?', 'At most one', ['Exactly two', 'As many as its energy allows', 'None, photons only heat the metal'], 'A photon is absorbed by a single electron in a one-to-one interaction.')
N('E', 2, 'Photons of energy 3.4 eV release electrons whose maximum kinetic energy is 1.1 eV. Calculate the work function of the metal in eV.', 3.4 - 1.1, 'eV',
  'Φ = hf − Ek(max) = 3.4 − 1.1 = 2.3 eV', ['C1: Φ = hf − Ek(max)'], sig=2, aq='Φ')
M('E', 1, 'Why do photoelectrons emitted by monochromatic light have a range of kinetic energies up to a maximum?', 'Electrons below the surface lose some energy before escaping', ['The photons have a range of energies', 'Some photons are slower than others', 'The work function varies with time'], 'Only electrons at the surface leave with the full hf − Φ.')
N('E', 2, 'Zinc has a work function of 4.3 eV. Ultraviolet photons of energy 5.0 eV fall on a zinc plate. What is the maximum kinetic energy of the emitted electrons, in eV?', 5.0 - 4.3, 'eV',
  'Ek(max) = 5.0 − 4.3 = 0.70 eV', ['C1: Ek(max) = hf − Φ'], sig=2, aq='Ek(max)')
M('E', 1, 'Which equation is Einstein\'s photoelectric equation?', 'hf = Φ + ½mv²(max)', ['hf = Φ − ½mv²(max)', 'Φ = hf + ½mv²(max)', 'hf = ½mv²(max)'], 'Photon energy = work function + maximum kinetic energy.')
N('E', 2, 'Photoelectrons leave a surface with a maximum kinetic energy of 1.0 eV. Calculate their maximum speed.' + take('e', 'me'), vmax(1.0), 'm s⁻¹',
  f'Ek = 1.0 × 1.60 × 10⁻¹⁹ = 1.6 × 10⁻¹⁹ J. v = √(2Ek/m) = √(2 × 1.6 × 10⁻¹⁹ ÷ 9.11 × 10⁻³¹) = {sf(vmax(1.0))} m s⁻¹', ['C1: ½mv² = Ek'], aq='v')
M('E', 1, 'Very bright red light falls on a metal whose threshold frequency is in the ultraviolet. What is observed?', 'No electrons are emitted', ['Many slow electrons are emitted', 'A few fast electrons are emitted', 'Electrons are emitted after a delay'], 'Each red photon has too little energy, however many arrive.')
N('E', 1, 'Photoelectrons from a cathode are just stopped by a potential difference of 1.8 V. What is their maximum kinetic energy in eV?', 1.8, 'eV',
  'Ek(max) = eV_s, so in eV: Ek(max) = 1 × 1.8 = 1.8 eV', [], sig=2, aq='Ek(max)')
# medium
N('M', 3, 'Violet light of wavelength 400 nm falls on potassium, work function 2.3 eV. Calculate the maximum kinetic energy of the photoelectrons in eV.' + take('h', 'c', 'e'), ev_of(400) - 2.3, 'eV',
  f'hf = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (400 × 10⁻⁹ × 1.60 × 10⁻¹⁹) = {sf(ev_of(400), 4)} eV. Ek(max) = {sf(ev_of(400), 4)} − 2.3 = {sf(ev_of(400) - 2.3)} eV',
  ['C1: photon energy in eV', 'C1: subtract Φ'], aq='Ek(max)')
N('M', 3, 'Light of wavelength 500 nm falls on caesium (work function 2.1 eV). Calculate the stopping potential.' + take('h', 'c', 'e'), ev_of(500) - 2.1, 'V',
  f'hf = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (500 × 10⁻⁹ × 1.60 × 10⁻¹⁹) = {sf(ev_of(500), 4)} eV. V_s = {sf(ev_of(500), 4)} − 2.1 = {sf(ev_of(500) - 2.1)} V',
  ['C1: photon energy', 'C1: eV_s = hf − Φ'], aq='V_s')
N('M', 4, 'Ultraviolet light of wavelength 250 nm releases photoelectrons that are stopped by a potential difference of 1.6 V. Calculate the work function in eV.' + take('h', 'c', 'e'), ev_of(250) - 1.6, 'eV',
  f'hf = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (250 × 10⁻⁹ × 1.60 × 10⁻¹⁹) = {sf(ev_of(250), 4)} eV. Ek(max) = 1.6 eV, so Φ = {sf(ev_of(250), 4)} − 1.6 = {sf(ev_of(250) - 1.6)} eV',
  ['C1: photon energy', 'C1: Ek(max) = eV_s', 'C1: Φ = hf − Ek(max)'], aq='Φ')
M('M', 3, 'A graph is plotted of the maximum kinetic energy of photoelectrons against the frequency of the light. What does its gradient equal?', 'The Planck constant h', ['The work function', 'The threshold frequency', 'The electron charge e'], 'Ek(max) = hf − Φ is a straight line of gradient h.', ['C1: equation in y = mx + c form', 'C1: gradient h'])
M('M', 3, 'On the same graph of Ek(max) against frequency, where does the line cross the frequency axis?', 'At the threshold frequency', ['At the work function', 'At the origin', 'At the Planck constant'], 'Ek(max) = 0 when hf = Φ, i.e. f = f₀.', ['C1: Ek = 0 at intercept', 'C1: f₀ = Φ/h'])
N('M', 3, 'Light of wavelength 350 nm falls on a metal of work function 2.6 eV. Calculate the maximum speed of the photoelectrons.' + take('h', 'c', 'e', 'me'), vmax(ev_of(350) - 2.6), 'm s⁻¹',
  f'hf = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (350 × 10⁻⁹ × 1.60 × 10⁻¹⁹) = {sf(ev_of(350), 4)} eV, so Ek = {sf(ev_of(350) - 2.6, 4)} eV = {sf((ev_of(350) - 2.6) * QE, 4)} J. v = √(2 × {sf((ev_of(350) - 2.6) * QE, 4)} ÷ 9.11 × 10⁻³¹) = {sf(vmax(ev_of(350) - 2.6))} m s⁻¹',
  ['C1: Ek(max) in eV', 'C1: v = √(2Ek/m)'], aq='v')
N('M', 3, 'A photocell passes a current of 2.0 µA. How many photoelectrons reach the anode each second?' + take('e'), 2.0e-6 / QE, None,
  f'n = I/e = 2.0 × 10⁻⁶ ÷ 1.60 × 10⁻¹⁹ = {sf(2.0e-6 / QE)}', ['C1: I = ne', 'C1: µA to A'], aq='n')
M('M', 3, 'The frequency of light falling on a metal is doubled (it is above the threshold before and after). How does the maximum kinetic energy of the photoelectrons change?', 'It more than doubles', ['It exactly doubles', 'It increases by less than double', 'It is unchanged'], 'Ek = hf − Φ: doubling f gives 2hf − Φ = 2Ek + Φ.', ['C1: Ek = hf − Φ', 'C1: 2hf − Φ > 2(hf − Φ)'])
N('M', 4, 'A 1.0 mW beam of ultraviolet light of wavelength 300 nm falls on a photocell. One photon in 50 releases an electron, and all these electrons are collected. Calculate the photocurrent in µA.' + take('h', 'c', 'e'), 1.0e-3 / ephot(300e-9) / 50 * QE * 1e6, 'µA',
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 300 × 10⁻⁹ = {sf(ephot(300e-9), 4)} J. Photons per second = 1.0 × 10⁻³ ÷ {sf(ephot(300e-9), 4)} = {sf(1e-3 / ephot(300e-9), 4)}. I = {sf(1e-3 / ephot(300e-9), 4)} ÷ 50 × 1.60 × 10⁻¹⁹ = {sf(1e-3 / ephot(300e-9) / 50 * QE, 4)} A. In µA: {sf(1e-3 / ephot(300e-9) / 50 * QE, 4)} × 10⁶ = {sf(1e-3 / ephot(300e-9) / 50 * QE * 1e6)}',
  ['C1: photon rate', 'C1: electron rate', 'C1: I = ne'], aq='I')
M('M', 3, 'What does the stopping potential in a photoelectric experiment measure?', 'The maximum kinetic energy of the photoelectrons, in eV', ['The work function of the metal', 'The number of photons per second', 'The threshold wavelength'], 'eV_s = Ek(max): the most energetic electrons are just stopped.', ['C1: eV_s', 'C1: = Ek(max)'])
N('M', 3, 'Light of frequency 1.2 × 10¹⁵ Hz releases photoelectrons that are stopped by 2.0 V. Calculate the work function of the metal in eV.' + take('h', 'e'), HP * 1.2e15 / QE - 2.0, 'eV',
  f'hf = 6.63 × 10⁻³⁴ × 1.2 × 10¹⁵ ÷ 1.60 × 10⁻¹⁹ = {sf(HP * 1.2e15 / QE, 4)} eV. Φ = {sf(HP * 1.2e15 / QE, 4)} − 2.0 = {sf(HP * 1.2e15 / QE - 2.0)} eV',
  ['C1: hf in eV', 'C1: Φ = hf − eV_s'], aq='Φ')
M('M', 4, 'Which observation could the wave model of light not explain?', 'Photoelectrons are emitted immediately even when the light is very dim', ['The photocurrent increases with intensity', 'Light can be reflected from the metal', 'Light is absorbed by the metal'], 'A spread-out wave would need time to deliver Φ to one electron; photons deliver it at once.', ['C1: wave energy spread over surface', 'C1: time delay predicted', 'C1: none observed'])
N('M', 3, 'A metal has a work function of 3.0 × 10⁻¹⁹ J. Light of frequency 6.0 × 10¹⁴ Hz falls on it. Calculate the maximum kinetic energy of the photoelectrons in units of 10⁻¹⁹ J.' + take('h'), HP * 6.0e14 - 3.0e-19, '10⁻¹⁹ J',
  f'hf = 6.63 × 10⁻³⁴ × 6.0 × 10¹⁴ = {sf(HP * 6e14, 4)} J. Ek(max) = {sf(HP * 6e14, 4)} − 3.0 × 10⁻¹⁹ = {sf(HP * 6e14 - 3e-19)} J',
  ['C1: hf', 'C1: subtract Φ'], aq='Ek(max)')
M('M', 3, 'In a photocell the current stops increasing once the anode is made sufficiently positive. Why?', 'All the photoelectrons emitted each second are already being collected', ['The photons run out', 'The anode starts emitting electrons', 'The work function increases'], 'The current is limited by the emission rate, which depends on the light intensity.', ['C1: saturation current', 'C1: set by photon rate'])
N('M', 4, 'A student measures Ek(max) = 0.40 eV for light of 6.0 × 10¹⁴ Hz and Ek(max) = 1.23 eV for light of 8.0 × 10¹⁴ Hz. Use these two points to calculate the Planck constant, in units of 10⁻³⁴ J s.' + take('e'), (1.23 - 0.40) * QE / 2.0e14, '10⁻³⁴ J s',
  f'Gradient = ΔEk/Δf = (1.23 − 0.40) × 1.60 × 10⁻¹⁹ ÷ 2.0 × 10¹⁴ = {sf((1.23 - 0.40) * QE / 2e14)} J s',
  ['C1: gradient of Ek against f', 'C1: eV to J', 'C1: Δf'], aq='h')
N('M', 3, 'Light of wavelength 420 nm gives a stopping potential of 1.20 V. Calculate the work function of the surface in eV.' + take('h', 'c', 'e'), ev_of(420) - 1.20, 'eV',
  f'hf = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (420 × 10⁻⁹ × 1.60 × 10⁻¹⁹) = {sf(ev_of(420), 4)} eV. Φ = {sf(ev_of(420), 4)} − 1.20 = {sf(ev_of(420) - 1.20)} eV',
  ['C1: photon energy', 'C1: Φ = hf − eV_s'], aq='Φ')
M('M', 3, 'The same ultraviolet light falls on two metals, P with work function 2.0 eV and Q with 4.0 eV. Which statement is correct?', 'Electrons from P have the larger maximum kinetic energy', ['Electrons from Q have the larger maximum kinetic energy', 'Both give the same maximum kinetic energy', 'Only Q emits electrons'], 'Ek(max) = hf − Φ is larger for the smaller Φ.', ['C1: same hf', 'C1: smaller Φ larger Ek'])
# hard
N('H', 5, 'Light of wavelength 400 nm and power 5.0 mW falls on a sodium cathode (work function 2.28 eV). One photon in 500 releases an electron. (a) Calculate the photon energy in eV. (b) Calculate the maximum kinetic energy of the photoelectrons. (c) Calculate the photocurrent when all emitted electrons are collected. Give only the answer to (c), in µA.' + take('h', 'c', 'e'), 5.0e-3 / ephot(400e-9) / 500 * QE * 1e6, 'µA',
  f'(a) {sf(ev_of(400), 4)} eV. (b) {sf(ev_of(400), 4)} − 2.28 = {sf(ev_of(400) - 2.28)} eV. (c) Photons per second = 5.0 × 10⁻³ ÷ {sf(ephot(400e-9), 4)} = {sf(5e-3 / ephot(400e-9), 4)}; electrons = ÷ 500; I = {sf(5e-3 / ephot(400e-9), 4)} ÷ 500 × 1.60 × 10⁻¹⁹ = {sf(5e-3 / ephot(400e-9) / 500 * QE, 4)} A. In µA: {sf(5e-3 / ephot(400e-9) / 500 * QE, 4)} × 10⁶ = {sf(5e-3 / ephot(400e-9) / 500 * QE * 1e6)}',
  ['C1: photon energy', 'C1: Ek(max)', 'C1: photon rate', 'C1: I = ne'], aq='I')
N('H', 6, 'A student measures the maximum kinetic energy of photoelectrons for four frequencies: f = 6.0, 7.0, 8.0, 9.0 × 10¹⁴ Hz gives Ek(max) = 0.19, 0.60, 1.02, 1.43 eV. (a) Explain why a graph of Ek(max) against f should be a straight line. (b) Use the first and last points to find the gradient in eV per 10¹⁴ Hz. (c) Find the threshold frequency. Give only the answer to (c), in units of 10¹⁴ Hz.', (6.0 - 0.19 / ((1.43 - 0.19) / 3.0)) * 1e14, '10¹⁴ Hz',
  f'(a) Ek(max) = hf − Φ has the form y = mx + c. (b) Gradient = (1.43 − 0.19) ÷ (9.0 − 6.0) = {sf((1.43 - 0.19) / 3.0, 4)} eV per 10¹⁴ Hz, which is {sf((1.43 - 0.19) / 3.0e14, 4)} eV Hz⁻¹. (c) Ek = 0 at f₀: f₀ = 6.0 × 10¹⁴ − 0.19 ÷ {sf((1.43 - 0.19) / 3.0e14, 4)} = {sf((6.0 - 0.19 / ((1.43 - 0.19) / 3.0)) * 1e14)} Hz',
  ['B1: straight-line form', 'C1: gradient', 'M1: extrapolate to Ek = 0', 'C1: value', 'B1: gradient corresponds to h'], aq='f₀')
N('H', 5, 'Ultraviolet light of wavelength 200 nm falls on copper, work function 4.7 eV. (a) Calculate the maximum kinetic energy of the photoelectrons in eV. (b) Calculate their maximum momentum. (c) Calculate the de Broglie wavelength of the fastest photoelectrons, in nm.' + take('h', 'c', 'e', 'me'), HP / sqrt(2 * ME * (ev_of(200) - 4.7) * QE) * 1e9, 'nm',
  f'(a) hf = {sf(ev_of(200), 4)} eV, Ek = {sf(ev_of(200) - 4.7, 4)} eV = {sf((ev_of(200) - 4.7) * QE, 4)} J. (b) p = √(2 × 9.11 × 10⁻³¹ × {sf((ev_of(200) - 4.7) * QE, 4)}) = {sf(sqrt(2 * ME * (ev_of(200) - 4.7) * QE), 4)} kg m s⁻¹. (c) λ = 6.63 × 10⁻³⁴ ÷ {sf(sqrt(2 * ME * (ev_of(200) - 4.7) * QE), 4)} = {sf(HP / sqrt(2 * ME * (ev_of(200) - 4.7) * QE), 4)} m. In nm: {sf(HP / sqrt(2 * ME * (ev_of(200) - 4.7) * QE), 4)} × 10⁹ = {sf(HP / sqrt(2 * ME * (ev_of(200) - 4.7) * QE) * 1e9)}',
  ['C1: Ek(max)', 'C1: eV to J', 'C1: p = √(2mEk)', 'C1: λ = h/p'], aq='λ')
N('H', 6, 'With light of wavelength 400 nm the stopping potential for a surface is 1.05 V; with 500 nm it is 0.43 V. (a) Write the photoelectric equation for each wavelength in terms of h, c, λ, e, V_s and Φ. (b) Subtract to eliminate Φ. (c) Calculate h. Give only the answer to (c), in units of 10⁻³⁴ J s.' + take('c', 'e'), QE * (1.05 - 0.43) / (CL * (1 / 400e-9 - 1 / 500e-9)), '10⁻³⁴ J s',
  f'(a) hc/λ = Φ + eV_s for each. (b) hc(1/λ₁ − 1/λ₂) = e(V₁ − V₂). (c) h = 1.60 × 10⁻¹⁹ × (1.05 − 0.43) ÷ (3.00 × 10⁸ × (2.5 × 10⁶ − 2.0 × 10⁶)) = {sf(QE * 0.62 / (CL * 0.5e6))} J s',
  ['B1: two equations', 'M1: eliminate Φ', 'C1: 1/λ values', 'C1: substitution', 'C1: value'], aq='h')
N('H', 5, 'A clean zinc plate (work function 4.3 eV) is lit first with ultraviolet of wavelength 250 nm and then with 300 nm. (a) Calculate the photon energy for each wavelength in eV. (b) State which wavelength releases electrons. (c) Calculate the maximum kinetic energy of the electrons released, in eV.' + take('h', 'c', 'e'), ev_of(250) - 4.3, 'eV',
  f'(a) 250 nm: {sf(ev_of(250), 4)} eV; 300 nm: {sf(ev_of(300), 4)} eV. (b) Only 250 nm, since 4.14 eV < 4.3 eV. (c) Ek = {sf(ev_of(250), 4)} − 4.3 = {sf(ev_of(250) - 4.3)} eV',
  ['C1: both photon energies', 'B1: comparison with Φ', 'M1: Ek = hf − Φ', 'C1: value'], aq='Ek(max)')
N('H', 6, 'Light of frequency 1.5 × 10¹⁵ Hz falls on a metal of work function 4.2 eV. (a) Calculate the photon energy in eV. (b) Calculate the maximum kinetic energy of the photoelectrons in joules. (c) Calculate their maximum speed. Give only the answer to (c), in units of 10⁵ m s⁻¹.' + take('h', 'e', 'me'), vmax(HP * 1.5e15 / QE - 4.2), '10⁵ m s⁻¹',
  f'(a) E = 6.63 × 10⁻³⁴ × 1.5 × 10¹⁵ ÷ 1.60 × 10⁻¹⁹ = {sf(HP * 1.5e15 / QE, 4)} eV. (b) Ek = ({sf(HP * 1.5e15 / QE, 4)} − 4.2) × 1.60 × 10⁻¹⁹ = {sf((HP * 1.5e15 / QE - 4.2) * QE, 4)} J. (c) v = √(2 × {sf((HP * 1.5e15 / QE - 4.2) * QE, 4)} ÷ 9.11 × 10⁻³¹) = {sf(vmax(HP * 1.5e15 / QE - 4.2))} m s⁻¹',
  ['C1: photon energy', 'C1: Ek in eV', 'C1: eV to J', 'M1: ½mv² = Ek', 'C1: value'], aq='v')
N('H', 6, 'In a wave model, light of intensity 1.0 × 10⁻³ W m⁻² falls on a metal of work function 2.3 eV, and each electron can collect energy only from an area of about 1.0 × 10⁻¹⁹ m². (a) Calculate the power reaching this area. (b) Calculate the time needed to collect 2.3 eV. (c) Explain how this conflicts with experiment. Give only the answer to (b), in s.' + take('e'), 2.3 * QE / (1.0e-3 * 1.0e-19), 's',
  f'(a) P = 1.0 × 10⁻³ × 1.0 × 10⁻¹⁹ = 1.0 × 10⁻²² W. (b) t = 2.3 × 1.60 × 10⁻¹⁹ ÷ 1.0 × 10⁻²² = {sf(2.3 * QE / 1e-22)} s. (c) Emission is observed immediately, even at low intensity, because the energy comes in photons.',
  ['C1: P = IA', 'C1: Φ in J', 'M1: t = E/P', 'C1: value', 'B1: no delay observed'], aq='t')
N('H', 5, 'An isolated metal sphere (work function 4.5 eV) is lit by ultraviolet of wavelength 200 nm. As electrons leave, the sphere becomes positively charged. (a) Calculate the maximum kinetic energy of the photoelectrons in eV. (b) Explain why emission eventually stops. (c) Calculate the potential of the sphere when emission stops. Give only the answer to (c).' + take('h', 'c', 'e'), ev_of(200) - 4.5, 'V',
  f'(a) {sf(ev_of(200), 4)} − 4.5 = {sf(ev_of(200) - 4.5, 4)} eV. (b) The positive sphere attracts the electrons back; once its potential equals the stopping potential none escape. (c) V = {sf(ev_of(200), 4)} − 4.5 = {sf(ev_of(200) - 4.5)} V',
  ['C1: photon energy', 'C1: Ek(max)', 'B1: attraction back', 'C1: V = Ek/e'], aq='V')
N('H', 5, 'Light of wavelength 300 nm and then 250 nm falls on a metal of work function 3.6 eV. (a) Calculate Ek(max) for each wavelength in eV. (b) Calculate (maximum speed with 250 nm) ÷ (maximum speed with 300 nm).' + take('h', 'c', 'e'), sqrt((ev_of(250) - 3.6) / (ev_of(300) - 3.6)), None,
  f'(a) 300 nm: {sf(ev_of(300), 4)} − 3.6 = {sf(ev_of(300) - 3.6, 4)} eV; 250 nm: {sf(ev_of(250), 4)} − 3.6 = {sf(ev_of(250) - 3.6, 4)} eV. (b) v ∝ √Ek: ratio = √({sf(ev_of(250) - 3.6, 4)} ÷ {sf(ev_of(300) - 3.6, 4)}) = {sf(sqrt((ev_of(250) - 3.6) / (ev_of(300) - 3.6)))}',
  ['C1: both photon energies', 'C1: both Ek(max)', 'M1: v ∝ √Ek', 'C1: ratio'], aq='ratio')
N('H', 6, 'Light of wavelength 420 nm and power 0.10 mW falls on a photocell, which gives a current of 0.60 µA. (a) Calculate the number of photons arriving per second. (b) Calculate the number of electrons emitted per second. (c) Calculate the percentage of photons that release an electron.' + take('h', 'c', 'e'), 0.60e-6 / QE / (1.0e-4 / ephot(420e-9)) * 100, '%',
  f'(a) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 420 × 10⁻⁹ = {sf(ephot(420e-9), 4)} J; n = 1.0 × 10⁻⁴ ÷ {sf(ephot(420e-9), 4)} = {sf(1e-4 / ephot(420e-9), 4)} s⁻¹. (b) 0.60 × 10⁻⁶ ÷ 1.60 × 10⁻¹⁹ = {sf(0.6e-6 / QE, 4)} s⁻¹. (c) {sf(0.6e-6 / QE, 4)} ÷ {sf(1e-4 / ephot(420e-9), 4)} × 100 = {sf(0.6e-6 / QE / (1e-4 / ephot(420e-9)) * 100)} %',
  ['C1: photon energy', 'C1: photon rate', 'C1: electron rate', 'M1: ratio × 100', 'C1: value'], aq='efficiency')
N('H', 5, 'A metal has a threshold wavelength of 540 nm. (a) Calculate its work function in eV. (b) Light of wavelength 400 nm falls on it. Calculate the maximum kinetic energy of the photoelectrons in eV.' + take('h', 'c', 'e'), ev_of(400) - ev_of(540), 'eV',
  f'(a) Φ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (540 × 10⁻⁹ × 1.60 × 10⁻¹⁹) = {sf(ev_of(540), 4)} eV. (b) hf = {sf(ev_of(400), 4)} eV, so Ek = {sf(ev_of(400), 4)} − {sf(ev_of(540), 4)} = {sf(ev_of(400) - ev_of(540))} eV',
  ['C1: Φ = hc/λ₀', 'C1: photon energy', 'M1: Ek = hf − Φ', 'C1: value'], aq='Ek(max)')


# ═════════════════════════ 28.4 Threshold frequency and wavelength (17/19/8) ═════════════════════════
lesson('28.4')
N('E', 2, 'Calcium needs at least 2.9 eV to free an electron from its surface. What is the lowest frequency of light that can do this? Give your answer in units of 10¹⁴ Hz.' + take('h', 'e'), 2.9 * QE / HP, '10¹⁴ Hz',
  f'f₀ = Φ/h = 2.9 × 1.60 × 10⁻¹⁹ ÷ 6.63 × 10⁻³⁴ = {sf(2.9 * QE / HP)} Hz', ['C1: f₀ = Φ/h'], aq='f₀')
M('E', 1, 'What is the threshold wavelength of a metal?', 'The longest wavelength of light that can release electrons from it', ['The shortest wavelength that can release electrons', 'The wavelength of the fastest photoelectrons', 'The wavelength at which the metal glows'], 'λ₀ = hc/Φ; longer wavelengths have photons with too little energy.')
N('E', 2, 'A surface has a threshold frequency of 1.1 × 10¹⁵ Hz. Calculate its work function in eV.' + take('h', 'e'), HP * 1.1e15 / QE, 'eV',
  f'Φ = hf₀ = 6.63 × 10⁻³⁴ × 1.1 × 10¹⁵ ÷ 1.60 × 10⁻¹⁹ = {sf(HP * 1.1e15 / QE)} eV', ['C1: Φ = hf₀ in eV'], aq='Φ')
M('E', 1, 'Which metal has the highest threshold frequency?', 'The one with the largest work function', ['The one with the smallest work function', 'The one with the most free electrons', 'The one that is the best conductor'], 'f₀ = Φ/h, so a larger work function needs a higher-frequency photon.')
N('E', 2, 'A metal has a threshold wavelength of 680 nm. Calculate its threshold frequency in units of 10¹⁴ Hz.' + take('c'), CL / 680e-9, '10¹⁴ Hz',
  f'f₀ = c/λ₀ = 3.00 × 10⁸ ÷ 680 × 10⁻⁹ = {sf(CL / 680e-9)} Hz', ['C1: f₀ = c/λ₀'], aq='f₀')
M('E', 1, 'Light of wavelength longer than the threshold wavelength falls on a metal. What happens?', 'No electrons are emitted, whatever the intensity', ['Electrons are emitted slowly', 'Only a few fast electrons are emitted', 'Electrons are emitted after the metal has warmed'], 'Each photon has less energy than Φ.')
N('E', 2, 'The work function of a metal is 3.6 × 10⁻¹⁹ J. Calculate its threshold frequency in units of 10¹⁴ Hz.' + take('h'), 3.6e-19 / HP, '10¹⁴ Hz',
  f'f₀ = 3.6 × 10⁻¹⁹ ÷ 6.63 × 10⁻³⁴ = {sf(3.6e-19 / HP)} Hz', ['C1: f₀ = Φ/h'], aq='f₀')
M('E', 1, 'Which equation links the work function Φ to the threshold frequency f₀?', 'Φ = hf₀', ['Φ = f₀/h', 'Φ = hf₀²', 'Φ = h/f₀'], 'At threshold the photon energy just equals Φ.')
N('E', 2, 'A metal emits electrons only for light of frequency above 8.0 × 10¹⁴ Hz. Calculate the corresponding threshold wavelength in nm.' + take('c'), CL / 8.0e14 * 1e9, 'nm',
  f'λ₀ = c/f₀ = 3.00 × 10⁸ ÷ 8.0 × 10¹⁴ = {sf(CL / 8e14, 4)} m. In nm: {sf(CL / 8e14, 4)} × 10⁹ = {sf(CL / 8e14 * 1e9)}', ['C1: λ₀ = c/f₀'], aq='λ₀')
M('E', 1, 'Increasing the intensity of light whose frequency is below the threshold frequency', 'still releases no electrons', ['releases electrons after a short delay', 'releases more electrons each second', 'increases the maximum kinetic energy'], 'Intensity changes photon numbers, not the energy of each photon.')
N('E', 2, 'Calculate the work function, in eV, of a metal whose threshold wavelength is 290 nm.' + take('h', 'c', 'e'), ev_of(290), 'eV',
  f'Φ = hc/λ₀ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (290 × 10⁻⁹ × 1.60 × 10⁻¹⁹) = {sf(ev_of(290))} eV', ['C1: Φ = hc/λ₀'], aq='Φ')
M('E', 1, 'In which unit is a work function often quoted?', 'eV', ['V', 'Hz', 'nm'], 'Φ is an energy, often given in electronvolts (1 eV = 1.60 × 10⁻¹⁹ J).')
N('E', 2, 'A metal has a work function of 1.9 eV. Calculate its threshold wavelength in nm.' + take('h', 'c', 'e'), nm_of(1.9), 'nm',
  f'λ₀ = hc/Φ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (1.9 × 1.60 × 10⁻¹⁹) = {sf(nm_of(1.9) * 1e-9, 4)} m. In nm: {sf(nm_of(1.9) * 1e-9, 4)} × 10⁹ = {sf(nm_of(1.9))}', ['C1: λ₀ = hc/Φ'], aq='λ₀')
M('E', 1, 'Metal X has a threshold wavelength of 500 nm and metal Y one of 300 nm. Which statement is correct?', 'Y has the larger work function', ['X has the larger work function', 'They have equal work functions', 'Y has the larger threshold wavelength'], 'Φ = hc/λ₀: a shorter λ₀ means a larger Φ.')
N('E', 2, 'A metal has a threshold frequency of 5.0 × 10¹⁴ Hz. Calculate its work function in units of 10⁻¹⁹ J.' + take('h'), HP * 5.0e14, '10⁻¹⁹ J',
  f'Φ = hf₀ = 6.63 × 10⁻³⁴ × 5.0 × 10¹⁴ = {sf(HP * 5e14)} J', ['C1: Φ = hf₀'], aq='Φ')
M('E', 1, 'Which describes light exactly at the threshold frequency falling on a metal surface?', 'Electrons can just escape, with zero kinetic energy', ['Electrons escape with the maximum possible speed', 'No energy is absorbed', 'Two electrons are released per photon'], 'hf₀ = Φ leaves nothing for kinetic energy.')
N('E', 1, 'A metal stops emitting electrons when the frequency of the light falls below 6.2 × 10¹⁴ Hz. What wavelength, in nm, does this frequency correspond to?' + take('c'), CL / 6.2e14 * 1e9, 'nm',
  f'λ = c/f = 3.00 × 10⁸ ÷ 6.2 × 10¹⁴ = {sf(CL / 6.2e14, 4)} m. In nm: {sf(CL / 6.2e14, 4)} × 10⁹ = {sf(CL / 6.2e14 * 1e9)}', [], aq='λ₀')
# medium
N('M', 3, 'The table gives the work functions of five metals. Light of wavelength 450 nm falls on each in turn. How many of the metals emit photoelectrons? Caesium 2.1 eV, potassium 2.3 eV, sodium 2.4 eV, calcium 2.9 eV, zinc 4.3 eV.' + take('h', 'c', 'e'), 3, None,
  f'Photon energy = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (450 × 10⁻⁹ × 1.60 × 10⁻¹⁹) = {sf(ev_of(450))} eV. Only caesium, potassium and sodium have Φ below this, so the number is 1 + 1 + 1 = 3',
  ['C1: photon energy in eV', 'C1: compare with each Φ'], sig=1, aq='number')
N('M', 3, 'Show that ultraviolet radiation is needed to free electrons from zinc (work function 4.3 eV) by calculating its threshold wavelength in nm.' + take('h', 'c', 'e'), nm_of(4.3), 'nm',
  f'λ₀ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (4.3 × 1.60 × 10⁻¹⁹) = {sf(nm_of(4.3) * 1e-9, 4)} m. In nm: {sf(nm_of(4.3) * 1e-9, 4)} × 10⁹ = {sf(nm_of(4.3))}', ['C1: Φ in J', 'C1: λ₀ = hc/Φ'], aq='λ₀')
M('M', 3, 'Light of wavelength just shorter than the threshold wavelength releases photoelectrons from a metal. The wavelength is then increased beyond the threshold. What happens?', 'Emission stops, because each photon now has less energy than the work function', ['Emission continues but more slowly', 'The electrons are emitted faster', 'Emission stops only if the intensity is reduced'], 'Longer λ means smaller hf; below Φ no electron can escape.', ['C1: E = hc/λ falls', 'C1: below Φ no emission'])
N('M', 4, 'Light of wavelength 380 nm releases photoelectrons with a maximum kinetic energy of 0.60 eV. Calculate the threshold wavelength of the metal in nm.' + take('h', 'c', 'e'), nm_of(ev_of(380) - 0.60), 'nm',
  f'hf = {sf(ev_of(380), 4)} eV, so Φ = {sf(ev_of(380), 4)} − 0.60 = {sf(ev_of(380) - 0.6, 4)} eV. λ₀ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ ({sf(ev_of(380) - 0.6, 4)} × 1.60 × 10⁻¹⁹) = {sf(nm_of(ev_of(380) - 0.6) * 1e-9, 4)} m. In nm: {sf(nm_of(ev_of(380) - 0.6) * 1e-9, 4)} × 10⁹ = {sf(nm_of(ev_of(380) - 0.6))}',
  ['C1: photon energy', 'C1: Φ', 'C1: λ₀ = hc/Φ'], aq='λ₀')
N('M', 3, 'The graph shows the maximum kinetic energy of photoelectrons against frequency for a metal; the line meets the frequency axis at 5.6 × 10¹⁴ Hz. Calculate the work function of the metal in eV.' + take('h', 'e'), HP * 5.6e14 / QE, 'eV',
  f'Φ = hf₀ = 6.63 × 10⁻³⁴ × 5.6 × 10¹⁴ ÷ 1.60 × 10⁻¹⁹ = {sf(HP * 5.6e14 / QE)} eV', ['C1: f₀ from intercept', 'C1: Φ = hf₀'], aq='Φ')
M('M', 3, 'Light of wavelength 600 nm releases no electrons from a metal. Which change could make it release electrons?', 'Using light of a shorter wavelength', ['Using a brighter 600 nm source', 'Shining the light for longer', 'Using light of a longer wavelength'], 'Only raising the photon energy (shorter λ) can exceed Φ.', ['C1: photon energy must exceed Φ', 'C1: shorter λ'])
N('M', 3, 'A metal has a work function of 2.6 eV. Light of wavelength 500 nm falls on it. By how many eV is the photon energy below the work function?' + take('h', 'c', 'e'), 2.6 - ev_of(500), 'eV',
  f'Photon energy = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (500 × 10⁻⁹ × 1.60 × 10⁻¹⁹) = {sf(ev_of(500), 4)} eV. Shortfall = 2.6 − {sf(ev_of(500), 4)} = {sf(2.6 - ev_of(500))} eV',
  ['C1: photon energy', 'C1: comparison'], aq='shortfall')
N('M', 3, 'A metal has a threshold wavelength of 260 nm. Calculate the maximum kinetic energy, in eV, of photoelectrons released by light of wavelength 200 nm.' + take('h', 'c', 'e'), ev_of(200) - ev_of(260), 'eV',
  f'Ek = hc/λ − hc/λ₀ = {sf(ev_of(200), 4)} − {sf(ev_of(260), 4)} = {sf(ev_of(200) - ev_of(260))} eV', ['C1: Φ = hc/λ₀', 'C1: hf'], aq='Ek(max)')
M('M', 3, 'Graphs of Ek(max) against frequency are drawn for two different metals. How are the lines related?', 'They are parallel but cross the frequency axis at different points', ['They have different gradients but the same intercept', 'They are identical', 'They are perpendicular'], 'Gradient = h for every metal; intercept f₀ = Φ/h differs.', ['C1: same gradient h', 'C1: different f₀'])
N('M', 4, 'A metal has a threshold frequency of 1.05 × 10¹⁵ Hz. Light of frequency 1.50 × 10¹⁵ Hz falls on it. Calculate the maximum kinetic energy of the photoelectrons in units of 10⁻¹⁹ J.' + take('h'), HP * (1.50e15 - 1.05e15), '10⁻¹⁹ J',
  f'Ek = h(f − f₀) = 6.63 × 10⁻³⁴ × (1.50 × 10¹⁵ − 1.05 × 10¹⁵) = {sf(HP * 0.45e15)} J', ['C1: Φ = hf₀', 'C1: Ek = hf − hf₀', 'C1: substitution'], aq='Ek(max)')
M('M', 3, 'How does the threshold frequency of a metal depend on the intensity of the light?', 'It does not depend on intensity at all', ['It falls as the intensity rises', 'It rises as the intensity rises', 'It is proportional to the intensity'], 'f₀ = Φ/h is a property of the metal surface.', ['C1: f₀ = Φ/h', 'C1: independent of intensity'])
N('M', 3, 'Calculate (threshold wavelength of a metal with Φ = 2.0 eV) ÷ (threshold wavelength of a metal with Φ = 5.0 eV).', 5.0 / 2.0, None,
  'λ₀ = hc/Φ, so the ratio = 5.0 ÷ 2.0 = 2.5', ['C1: λ₀ ∝ 1/Φ', 'C1: ratio'], sig=2, aq='ratio')
N('M', 3, 'What is the longest wavelength of light, in nm, that can eject electrons from a surface of work function 3.2 × 10⁻¹⁹ J?' + take('h', 'c'), HC / 3.2e-19 * 1e9, 'nm',
  f'λ₀ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 3.2 × 10⁻¹⁹ = {sf(HC / 3.2e-19, 4)} m. In nm: {sf(HC / 3.2e-19, 4)} × 10⁹ = {sf(HC / 3.2e-19 * 1e9)}', ['C1: λ₀ = hc/Φ', 'C1: nm'], aq='λ₀')
M('M', 4, 'On a graph of Ek(max) against frequency, the line is extended back to cross the Ek axis. What does that intercept equal?', '−Φ, the negative of the work function', ['+Φ', 'Zero', 'The threshold frequency'], 'Ek = hf − Φ: at f = 0 the line gives −Φ.', ['C1: y = mx + c form', 'C1: c = −Φ', 'C1: negative sign'])
N('M', 4, 'Light of wavelength 350 nm falls on metal A, whose work function is 2.2 eV. Calculate the maximum speed of the photoelectrons in units of 10⁵ m s⁻¹.' + take('h', 'c', 'e', 'me'), vmax(ev_of(350) - 2.2), '10⁵ m s⁻¹',
  f'hf = {sf(ev_of(350), 4)} eV; Ek = {sf(ev_of(350) - 2.2, 4)} eV = {sf((ev_of(350) - 2.2) * QE, 4)} J. v = √(2 × {sf((ev_of(350) - 2.2) * QE, 4)} ÷ 9.11 × 10⁻³¹) = {sf(vmax(ev_of(350) - 2.2))} m s⁻¹',
  ['C1: photon energy', 'C1: Ek(max)', 'C1: v = √(2Ek/m)'], aq='v')
N('M', 3, 'A metal has a threshold frequency of 6.0 × 10¹⁴ Hz. Light of frequency 9.0 × 10¹⁴ Hz falls on it. Calculate the stopping potential.' + take('h', 'e'), HP * 3.0e14 / QE, 'V',
  f'eV_s = h(f − f₀), so V_s = 6.63 × 10⁻³⁴ × 3.0 × 10¹⁴ ÷ 1.60 × 10⁻¹⁹ = {sf(HP * 3e14 / QE)} V', ['C1: h(f − f₀)', 'C1: ÷ e'], aq='V_s')
M('M', 3, 'Light of frequency only slightly above the threshold frequency falls on a metal. Which statement is correct?', 'Electrons are emitted, but the fastest have very little kinetic energy', ['No electrons are emitted', 'Electrons are emitted with large kinetic energies', 'Electrons are emitted only after a delay'], 'Ek(max) = h(f − f₀) is small but positive.', ['C1: emission occurs', 'C1: Ek small'])
N('M', 3, 'A metal has a threshold wavelength of 550 nm. Calculate its work function in units of 10⁻¹⁹ J.' + take('h', 'c'), HC / 550e-9, '10⁻¹⁹ J',
  f'Φ = hc/λ₀ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 550 × 10⁻⁹ = {sf(HC / 550e-9)} J', ['C1: Φ = hc/λ₀', 'C1: nm to m'], aq='Φ')
M('M', 3, 'Why can light below the threshold frequency never release electrons, however long it shines?', 'Each electron absorbs one whole photon, and one photon has less energy than Φ', ['The light is reflected', 'The electrons absorb energy too slowly', 'The metal cools down'], 'Photon absorption is all-or-nothing and one photon per electron.', ['C1: one photon per electron', 'C1: hf < Φ'])
# hard
N('H', 5, 'Caesium has a work function of 2.1 eV. (a) Calculate its threshold wavelength in nm. (b) Visible light runs from 400 nm to 700 nm. Calculate the fraction of this range of wavelengths that can release photoelectrons from caesium.' + take('h', 'c', 'e'), (nm_of(2.1) - 400) / 300, None,
  f'(a) λ₀ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (2.1 × 1.60 × 10⁻¹⁹) = {sf(nm_of(2.1) * 1e-9, 4)} m, which is {sf(nm_of(2.1), 4)} nm. (b) Wavelengths from 400 nm to {sf(nm_of(2.1), 3)} nm work: fraction = ({sf(nm_of(2.1), 4)} − 400) ÷ 300 = {sf((nm_of(2.1) - 400) / 300)}',
  ['C1: λ₀ = hc/Φ', 'C1: value', 'M1: range shorter than λ₀', 'C1: fraction'], aq='fraction')
N('H', 6, 'For a metal, Ek(max) = 0.80 eV with light of 7.5 × 10¹⁴ Hz and 1.84 eV with light of 1.00 × 10¹⁵ Hz. (a) Calculate the gradient of the Ek–f graph in eV per Hz. (b) Hence find h. (c) Find the threshold frequency. Give only the answer to (c), in units of 10¹⁴ Hz.' + take('e'), (7.5e14 - 0.80 / ((1.84 - 0.80) / 2.5e14)), '10¹⁴ Hz',
  f'(a) Gradient = (1.84 − 0.80) ÷ 2.5 × 10¹⁴ = {sf(1.04 / 2.5e14, 4)} eV Hz⁻¹. (b) h = {sf(1.04 / 2.5e14, 4)} × 1.60 × 10⁻¹⁹ = {sf(1.04 / 2.5e14 * QE)} J s. (c) f₀ = 7.5 × 10¹⁴ − 0.80 ÷ {sf(1.04 / 2.5e14, 4)} = {sf(7.5e14 - 0.80 / (1.04 / 2.5e14))} Hz',
  ['C1: gradient', 'C1: h in J s', 'M1: Ek = 0 at f₀', 'C1: substitution', 'C1: value'], aq='f₀')
N('H', 5, 'A mercury lamp gives ultraviolet light of wavelength 254 nm. It falls in turn on potassium (Φ = 2.3 eV), magnesium (Φ = 3.7 eV) and platinum (Φ = 6.4 eV). (a) Calculate the photon energy in eV. (b) State which metals emit electrons. (c) Calculate the maximum kinetic energy of the electrons from magnesium, in eV.' + take('h', 'c', 'e'), ev_of(254) - 3.7, 'eV',
  f'(a) {sf(ev_of(254), 4)} eV. (b) Potassium and magnesium; platinum needs 6.4 eV. (c) Ek = {sf(ev_of(254), 4)} − 3.7 = {sf(ev_of(254) - 3.7)} eV',
  ['C1: photon energy', 'B1: comparison with each Φ', 'M1: Ek = hf − Φ', 'C1: value'], aq='Ek(max)')
N('H', 6, 'Light of wavelength 300 nm gives photoelectrons with a stopping potential of 1.20 V. (a) Calculate the photon energy in eV. (b) Calculate the work function. (c) Calculate the threshold wavelength in nm. Give only the answer to (c).' + take('h', 'c', 'e'), nm_of(ev_of(300) - 1.20), 'nm',
  f'(a) {sf(ev_of(300), 4)} eV. (b) Φ = {sf(ev_of(300), 4)} − 1.20 = {sf(ev_of(300) - 1.2, 4)} eV. (c) λ₀ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ ({sf(ev_of(300) - 1.2, 4)} × 1.60 × 10⁻¹⁹) = {sf(nm_of(ev_of(300) - 1.2) * 1e-9, 4)} m. In nm: {sf(nm_of(ev_of(300) - 1.2) * 1e-9, 4)} × 10⁹ = {sf(nm_of(ev_of(300) - 1.2))}',
  ['C1: photon energy', 'C1: Φ = hf − eV_s', 'M1: λ₀ = hc/Φ', 'C1: J conversion', 'C1: value'], aq='λ₀')
N('H', 5, 'Caesium has a threshold frequency of 4.5 × 10¹⁴ Hz. Infrared radiation of wavelength 1000 nm falls on it. (a) Calculate the frequency of the radiation. (b) Explain why no electrons are emitted. (c) Calculate the work function of caesium in eV.' + take('c', 'h', 'e'), HP * 4.5e14 / QE, 'eV',
  f'(a) f = 3.00 × 10⁸ ÷ 1000 × 10⁻⁹ = 3.0 × 10¹⁴ Hz. (b) It is below f₀, so each photon has less energy than Φ. (c) Φ = 6.63 × 10⁻³⁴ × 4.5 × 10¹⁴ ÷ 1.60 × 10⁻¹⁹ = {sf(HP * 4.5e14 / QE)} eV',
  ['C1: f = c/λ', 'B1: f < f₀', 'M1: Φ = hf₀', 'C1: value'], aq='Φ')
N('H', 6, 'Light of wavelength 600 nm releases photoelectrons from a metal. Light of 300 nm releases photoelectrons whose maximum kinetic energy is three times as large. (a) Calculate the photon energy for each wavelength in eV. (b) Write an equation linking the two kinetic energies and Φ. (c) Calculate Φ in eV.' + take('h', 'c', 'e'), (3 * ev_of(600) - ev_of(300)) / 2, 'eV',
  f'(a) {sf(ev_of(600), 4)} eV and {sf(ev_of(300), 4)} eV. (b) {sf(ev_of(300), 4)} − Φ = 3({sf(ev_of(600), 4)} − Φ). (c) 2Φ = 3 × {sf(ev_of(600), 4)} − {sf(ev_of(300), 4)}, so Φ = (3 × {sf(ev_of(600), 4)} − {sf(ev_of(300), 4)}) ÷ 2 = {sf((3 * ev_of(600) - ev_of(300)) / 2)} eV',
  ['C1: both photon energies', 'B1: equation', 'M1: rearranged for Φ', 'C1: substitution', 'C1: value'], aq='Φ')
N('H', 5, 'A graph of stopping potential against frequency has a gradient of 4.1 × 10⁻¹⁵ V s and meets the frequency axis at 5.2 × 10¹⁴ Hz. (a) Show that the gradient equals h/e. (b) Calculate h. (c) Calculate the work function in eV.' + take('e'), 4.1e-15 * 5.2e14, 'eV',
  f'(a) eV_s = hf − Φ gives V_s = (h/e)f − Φ/e. (b) h = 4.1 × 10⁻¹⁵ × 1.60 × 10⁻¹⁹ = {sf(4.1e-15 * QE)} J s. (c) Φ/e = gradient × f₀ = 4.1 × 10⁻¹⁵ × 5.2 × 10¹⁴ = {sf(4.1e-15 * 5.2e14)} V, so Φ = {sf(4.1e-15 * 5.2e14)} eV',
  ['B1: gradient h/e', 'C1: h', 'M1: Φ = (h/e)f₀ in eV', 'C1: value'], aq='Φ')
N('H', 6, 'Two lasers of equal power, one violet (400 nm) and one red (600 nm), shine in turn on a metal of work function 1.9 eV. Each photon has the same chance of releasing an electron. (a) Show that both lasers release electrons. (b) Calculate Ek(max) for the violet laser in eV. (c) Calculate (photocurrent with red) ÷ (photocurrent with violet). Give only the answer to (c).' + take('h', 'c', 'e'), 600 / 400, None,
  f'(a) Photon energies {sf(ev_of(400), 4)} eV and {sf(ev_of(600), 4)} eV, both above 1.9 eV. (b) {sf(ev_of(400), 4)} − 1.9 = {sf(ev_of(400) - 1.9)} eV. (c) Photon rate = P/E ∝ λ, so ratio = 600 ÷ 400 = 1.5',
  ['C1: both photon energies', 'B1: both above Φ', 'C1: Ek(max)', 'M1: n ∝ λ for equal power', 'C1: ratio'], sig=2, aq='ratio')

# ═════════════════════════ 28.5 Photons have momentum too (17/19/8) ═════════════════════════
lesson('28.5')
N('E', 2, 'Calculate the momentum of a photon of deep red light of wavelength 700 nm, in units of 10⁻²⁷ kg m s⁻¹.' + take('h'), HP / 700e-9, '10⁻²⁷ kg m s⁻¹',
  f'p = h/λ = 6.63 × 10⁻³⁴ ÷ 700 × 10⁻⁹ = {sf(HP / 700e-9)} kg m s⁻¹', ['C1: p = h/λ'], aq='p')
M('E', 1, 'Which expression gives the momentum of a photon of wavelength λ?', 'h/λ', ['hλ', 'λ/h', 'hc/λ'], 'The de Broglie relation applies to photons: p = h/λ.')
N('E', 2, 'A photon has a momentum of 3.3 × 10⁻²⁷ kg m s⁻¹. What is its wavelength in nm?' + take('h'), HP / 3.3e-27 * 1e9, 'nm',
  f'λ = h/p = 6.63 × 10⁻³⁴ ÷ 3.3 × 10⁻²⁷ = {sf(HP / 3.3e-27, 4)} m. In nm: {sf(HP / 3.3e-27, 4)} × 10⁹ = {sf(HP / 3.3e-27 * 1e9)}', ['C1: λ = h/p'], aq='λ')
M('E', 1, 'A photon of momentum p is reflected straight back from a mirror. What is the size of the change in its momentum?', '2p', ['p', 'Zero', 'p/2'], 'Momentum goes from +p to −p.')
N('E', 2, 'A photon of extreme ultraviolet light has an energy of 2.0 × 10⁻¹⁸ J. Calculate its momentum in units of 10⁻²⁷ kg m s⁻¹.' + take('c'), 2.0e-18 / CL, '10⁻²⁷ kg m s⁻¹',
  f'p = E/c = 2.0 × 10⁻¹⁸ ÷ 3.00 × 10⁸ = {sf(2.0e-18 / CL)} kg m s⁻¹', ['C1: p = E/c'], aq='p')
M('E', 1, 'A beam of light of power P is completely absorbed by a surface. What force does it exert?', 'P/c', ['Pc', '2P/c', 'P/c²'], 'Momentum arrives at a rate (P/c) per second.')
N('E', 2, 'A 3.0 W beam of light is completely absorbed by a black surface. Calculate the force on the surface in units of 10⁻⁸ N.' + take('c'), 3.0 / CL, '10⁻⁸ N',
  'F = P/c = 3.0 ÷ 3.00 × 10⁸ = 1.0 × 10⁻⁸ N', ['C1: F = P/c'], sig=2, aq='F')
M('E', 1, 'Which photon has the greater momentum?', 'An X-ray photon', ['A radio-wave photon', 'An infrared photon', 'They are all equal'], 'p = h/λ, and X-rays have the shortest wavelength.')
N('E', 2, 'A 6.0 W laser beam is reflected straight back by a mirror. Calculate the force on the mirror in units of 10⁻⁸ N.' + take('c'), 2 * 6.0 / CL, '10⁻⁸ N',
  'F = 2P/c = 2 × 6.0 ÷ 3.00 × 10⁸ = 4.0 × 10⁻⁸ N', ['C1: F = 2P/c for reflection'], sig=2, aq='F')
M('E', 1, 'A light vane spinning in a near-vacuum is often used to suggest that light pushes on surfaces. Which property of photons does radiation pressure depend on?', 'Their momentum', ['Their charge', 'Their rest mass', 'Their temperature'], 'Photons carry momentum p = h/λ even though they have no mass.')
N('E', 2, 'An X-ray photon has an energy of 10 keV. Calculate its momentum in units of 10⁻²⁴ kg m s⁻¹.' + take('e', 'c'), 10e3 * QE / CL, '10⁻²⁴ kg m s⁻¹',
  f'E = 10 × 10³ × 1.60 × 10⁻¹⁹ = 1.6 × 10⁻¹⁵ J. p = 1.6 × 10⁻¹⁵ ÷ 3.00 × 10⁸ = {sf(1.6e-15 / CL)} kg m s⁻¹', ['C1: keV to J then p = E/c'], aq='p')
M('E', 1, 'How does the momentum of a photon depend on its wavelength?', 'It is inversely proportional to the wavelength', ['It is proportional to the wavelength', 'It is independent of the wavelength', 'It is proportional to the square of the wavelength'], 'p = h/λ, so halving the wavelength doubles the momentum.')
N('E', 2, 'Each second, 2.4 × 10¹⁷ photons, each of momentum 1.1 × 10⁻²⁷ kg m s⁻¹, are absorbed by a target. Calculate the force on the target in units of 10⁻¹⁰ N.', 2.4e17 * 1.1e-27, '10⁻¹⁰ N',
  f'F = (photons per second) × p = 2.4 × 10¹⁷ × 1.1 × 10⁻²⁷ = {sf(2.4e17 * 1.1e-27)} N', ['C1: F = rate of momentum transfer'], aq='F')
M('E', 1, 'Which unit is equivalent to kg m s⁻¹, the unit of photon momentum?', 'N s', ['J s', 'N m', 'W s'], 'Impulse (N s) and momentum share the same unit.')
N('E', 2, 'Calculate (momentum of a 400 nm photon) ÷ (momentum of an 800 nm photon).', 800 / 400, None,
  'p ∝ 1/λ, so ratio = 800 ÷ 400 = 2.0', ['C1: p = h/λ'], sig=2, aq='ratio')
M('E', 1, 'The same beam of light falls on a perfectly reflecting surface and then on a perfectly absorbing one. How does the force compare?', 'The force on the reflecting surface is twice as large', ['The force on the absorbing surface is twice as large', 'The forces are equal', 'There is no force on the reflecting surface'], 'Reflection reverses each photon\'s momentum, a change of 2p.')
N('E', 1, 'A photon has a momentum of 2.2 × 10⁻²⁷ kg m s⁻¹. Calculate its energy in units of 10⁻¹⁹ J.' + take('c'), 2.2e-27 * CL, '10⁻¹⁹ J',
  f'E = pc = 2.2 × 10⁻²⁷ × 3.00 × 10⁸ = {sf(2.2e-27 * CL)} J', [], sig=2, aq='E')
# medium
N('M', 3, 'A 1.0 mW laser beam is completely absorbed by a target. Calculate the force on the target in units of 10⁻¹² N.' + take('c'), 1.0e-3 / CL, '10⁻¹² N',
  f'F = P/c = 1.0 × 10⁻³ ÷ 3.00 × 10⁸ = {sf(1.0e-3 / CL)} N', ['C1: F = P/c', 'C1: mW to W'], aq='F')
N('M', 3, 'Sunlight of intensity 1.36 kW m⁻² falls at right angles on a 1.0 m² black panel in space. Calculate the force of the light on the panel in units of 10⁻⁶ N.' + take('c'), 1.36e3 / CL, '10⁻⁶ N',
  f'P = 1.36 × 10³ × 1.0 = 1360 W. F = 1360 ÷ 3.00 × 10⁸ = {sf(1360 / CL)} N', ['C1: P = IA', 'C1: F = P/c'], aq='F')
N('M', 4, 'A 2.0 W laser emits light of wavelength 450 nm, all absorbed by a target. (a) Calculate the photon momentum. (b) Calculate the photons per second. Give the force on the target in units of 10⁻⁹ N.' + take('h', 'c'), 2.0 / CL, '10⁻⁹ N',
  f'p = 6.63 × 10⁻³⁴ ÷ 450 × 10⁻⁹ = {sf(HP / 450e-9, 4)} kg m s⁻¹. n = 2.0 ÷ {sf(ephot(450e-9), 4)} = {sf(2.0 / ephot(450e-9), 4)} s⁻¹. F = {sf(2.0 / ephot(450e-9), 4)} × {sf(HP / 450e-9, 4)} = {sf(2.0 / CL)} N',
  ['C1: photon momentum', 'C1: photon rate', 'C1: F = np'], aq='F')
M('M', 3, 'Why is a solar sail made from a highly reflective material rather than a black one?', 'Reflected photons change momentum by 2p, giving twice the force', ['Black materials absorb no momentum', 'Reflective materials are lighter', 'Reflected light has a shorter wavelength'], 'Δp = 2p on reflection, p on absorption.', ['C1: Δp = 2p reflected', 'C1: force doubled'])
N('M', 3, 'Light of intensity 1.0 kW m⁻² is absorbed by a surface at normal incidence. Calculate the radiation pressure in units of 10⁻⁶ Pa.' + take('c'), 1.0e3 / CL, '10⁻⁶ Pa',
  f'p = I/c = 1.0 × 10³ ÷ 3.00 × 10⁸ = {sf(1.0e3 / CL)} Pa', ['C1: pressure = F/A = I/c', 'C1: value'], aq='pressure')
N('M', 3, 'Find the wavelength, in nm, of a photon whose momentum equals that of an electron moving at 2.0 × 10⁶ m s⁻¹.' + take('h', 'me'), HP / (ME * 2.0e6) * 1e9, 'nm',
  f'p = 9.11 × 10⁻³¹ × 2.0 × 10⁶ = 1.822 × 10⁻²⁴ kg m s⁻¹. λ = 6.63 × 10⁻³⁴ ÷ 1.822 × 10⁻²⁴ = {sf(HP / 1.822e-24, 4)} m. In nm: {sf(HP / 1.822e-24, 4)} × 10⁹ = {sf(HP / 1.822e-24 * 1e9)}',
  ['C1: p = mv', 'C1: λ = h/p'], aq='λ')
M('M', 3, 'A photon and an electron have the same momentum. Which has the greater energy (for an electron moving much slower than light)?', 'The photon', ['The electron', 'They have equal energies', 'It depends on the wavelength'], 'Photon E = pc; electron E = p²/2m = (pv)/2, and v ≪ c.', ['C1: E = pc for photon', 'C1: E = p²/2m much smaller'])
N('M', 4, 'A photon has a momentum of 5.0 × 10⁻²⁸ kg m s⁻¹. Calculate its frequency in units of 10¹⁴ Hz.' + take('c', 'h'), 5.0e-28 * CL / HP, '10¹⁴ Hz',
  f'E = pc = 5.0 × 10⁻²⁸ × 3.00 × 10⁸ = 1.5 × 10⁻¹⁹ J. f = E/h = 1.5 × 10⁻¹⁹ ÷ 6.63 × 10⁻³⁴ = {sf(1.5e-19 / HP)} Hz',
  ['C1: E = pc', 'C1: f = E/h', 'C1: value'], aq='f')
N('M', 3, 'A blue LED emits photons of 3.0 eV. What momentum does each photon carry away from the LED? Give the answer in units of 10⁻²⁷ kg m s⁻¹.' + take('e', 'c'), 3.0 * QE / CL, '10⁻²⁷ kg m s⁻¹',
  f'E = 3.0 × 1.60 × 10⁻¹⁹ = 4.8 × 10⁻¹⁹ J. p = 4.8 × 10⁻¹⁹ ÷ 3.00 × 10⁸ = {sf(4.8e-19 / CL)} kg m s⁻¹', ['C1: eV to J', 'C1: p = E/c'], aq='p')
M('M', 3, 'An isolated atom at rest emits a photon. What happens to the atom?', 'It recoils in the opposite direction with momentum equal in size to the photon\'s', ['It stays at rest because a photon has no mass', 'It moves in the same direction as the photon', 'It loses mass equal to h/λ'], 'Total momentum stays zero.', ['C1: conservation of momentum', 'C1: equal and opposite'])
N('M', 3, 'A mirror reflects a 0.50 W laser beam straight back. Calculate the force on the mirror in units of 10⁻⁹ N.' + take('c'), 2 * 0.50 / CL, '10⁻⁹ N',
  f'F = 2P/c = 2 × 0.50 ÷ 3.00 × 10⁸ = {sf(1.0 / CL)} N', ['C1: Δp = 2p', 'C1: F = 2P/c'], aq='F')
N('M', 4, 'How many photons of wavelength 532 nm must be absorbed each second to give a force of 1.0 nN?' + take('h'), 1.0e-9 / (HP / 532e-9), None,
  f'p = 6.63 × 10⁻³⁴ ÷ 532 × 10⁻⁹ = {sf(HP / 532e-9, 4)} kg m s⁻¹. n = F/p = 1.0 × 10⁻⁹ ÷ {sf(HP / 532e-9, 4)} = {sf(1e-9 / (HP / 532e-9))}',
  ['C1: photon momentum', 'C1: F = np', 'C1: nN to N'], aq='n')
M('M', 3, 'A beam of light strikes a mirror at 60° to the normal and reflects. In which direction is the force on the mirror?', 'Along the normal, into the mirror', ['Along the surface of the mirror', 'Along the incident beam', 'Along the reflected beam'], 'Only the momentum component along the normal is reversed.', ['C1: parallel component unchanged', 'C1: normal component reversed'])
N('M', 3, 'A sodium atom (mass 3.8 × 10⁻²⁶ kg) at rest absorbs a photon of wavelength 589 nm. Calculate the recoil speed of the atom in units of 10⁻² m s⁻¹.' + take('h'), HP / 589e-9 / 3.8e-26, '10⁻² m s⁻¹',
  f'p = 6.63 × 10⁻³⁴ ÷ 589 × 10⁻⁹ = {sf(HP / 589e-9, 4)} kg m s⁻¹. v = p/m = {sf(HP / 589e-9, 4)} ÷ 3.8 × 10⁻²⁶ = {sf(HP / 589e-9 / 3.8e-26)} m s⁻¹',
  ['C1: photon momentum', 'C1: v = p/m'], aq='v')
N('M', 3, 'In laser cooling, each absorbed photon slows an atom by 2.96 cm s⁻¹. Estimate the number of photons needed to slow the atom from 300 m s⁻¹ to rest.', 300 / 0.0296, None,
  f'N = 300 ÷ 0.0296 = {sf(300 / 0.0296)}', ['C1: cm s⁻¹ to m s⁻¹', 'C1: N = total Δv ÷ Δv per photon'], aq='N')
M('M', 4, 'Comet dust tails point away from the Sun. What causes this?', 'The momentum carried by sunlight pushes on the small dust grains', ['The Sun\'s gravity repels dust', 'The dust is electrically charged by sunlight', 'The comet\'s motion leaves the dust behind'], 'For tiny grains radiation force can exceed gravity, since force ∝ area and gravity ∝ volume.', ['C1: radiation pressure', 'C1: photon momentum', 'C1: area/volume argument'])
N('M', 3, 'Caesium-137 emits gamma rays of energy 0.66 MeV. Calculate the momentum of one of these photons in units of 10⁻²² kg m s⁻¹.' + take('e', 'c'), 0.66e6 * QE / CL, '10⁻²² kg m s⁻¹',
  f'E = 0.66 × 10⁶ × 1.60 × 10⁻¹⁹ = {sf(0.66e6 * QE, 4)} J. p = {sf(0.66e6 * QE, 4)} ÷ 3.00 × 10⁸ = {sf(0.66e6 * QE / CL)} kg m s⁻¹', ['C1: MeV to J', 'C1: p = E/c'], aq='p')
N('M', 3, 'What power of light must be absorbed by a surface to exert a force of 2.0 × 10⁻⁷ N on it?' + take('c'), 2.0e-7 * CL, 'W',
  'P = Fc = 2.0 × 10⁻⁷ × 3.00 × 10⁸ = 60 W', ['C1: F = P/c', 'C1: rearranged'], sig=2, aq='P')
M('M', 3, 'Why do we not feel the push of light from a torch?', 'The force P/c is extremely small for everyday powers', ['Light has no momentum', 'The light is reflected', 'Only lasers exert forces'], 'A 1 W torch exerts about 3 × 10⁻⁹ N.', ['C1: F = P/c', 'C1: c very large'])
# hard
N('H', 5, 'A solar sail of area 400 m² and total mass 20 kg faces the Sun where the intensity is 1.36 kW m⁻². The sail reflects all the light straight back. (a) Calculate the power reaching the sail. (b) Calculate the force on it. (c) Calculate its acceleration. Give only the answer to (c), in units of 10⁻⁴ m s⁻².' + take('c'), 2 * 1.36e3 * 400 / CL / 20, '10⁻⁴ m s⁻²',
  f'(a) P = 1.36 × 10³ × 400 = 5.44 × 10⁵ W. (b) F = 2P/c = 2 × 5.44 × 10⁵ ÷ 3.00 × 10⁸ = {sf(2 * 5.44e5 / CL, 4)} N. (c) a = {sf(2 * 5.44e5 / CL, 4)} ÷ 20 = {sf(2 * 5.44e5 / CL / 20)} m s⁻²',
  ['C1: P = IA', 'M1: F = 2P/c', 'C1: force', 'C1: a = F/m'], aq='a')
N('H', 6, 'An X-ray photon of wavelength 0.050 nm is scattered straight back by an electron. Assume its wavelength is unchanged. (a) Calculate the photon momentum. (b) Calculate the change in the photon\'s momentum. (c) Calculate the speed given to the electron, initially at rest. Give only the answer to (c), in units of 10⁷ m s⁻¹.' + take('h', 'me'), 2 * HP / 0.050e-9 / ME, '10⁷ m s⁻¹',
  f'(a) p = 6.63 × 10⁻³⁴ ÷ 0.050 × 10⁻⁹ = {sf(HP / 0.05e-9, 4)} kg m s⁻¹. (b) Δp = 2 × {sf(HP / 0.05e-9, 4)} = {sf(2 * HP / 0.05e-9, 4)} kg m s⁻¹. (c) v = {sf(2 * HP / 0.05e-9, 4)} ÷ 9.11 × 10⁻³¹ = {sf(2 * HP / 0.05e-9 / ME)} m s⁻¹',
  ['C1: p = h/λ', 'M1: Δp = 2p', 'C1: conservation of momentum', 'C1: v = Δp/m', 'B1: approximation stated'], aq='v')
N('H', 6, 'A 5.0 mW laser beam is reflected straight back by a tiny mirror of mass 0.20 g, which is free to move in a vacuum. (a) Calculate the force on the mirror. (b) Calculate its acceleration. (c) Calculate the speed it reaches after 10 s. Give only the answer to (b), in units of 10⁻⁷ m s⁻².' + take('c'), 2 * 5.0e-3 / CL / 0.20e-3, '10⁻⁷ m s⁻²',
  f'(a) F = 2P/c = 2 × 5.0 × 10⁻³ ÷ 3.00 × 10⁸ = {sf(1e-2 / CL, 4)} N. (b) a = {sf(1e-2 / CL, 4)} ÷ 0.20 × 10⁻³ = {sf(1e-2 / CL / 0.2e-3)} m s⁻². (c) v = at = {sf(1e-2 / CL / 0.2e-3, 4)} × 10 = {sf(1e-2 / CL / 0.2e-3 * 10)} m s⁻¹',
  ['M1: F = 2P/c', 'C1: force', 'C1: mass in kg', 'C1: a = F/m', 'C1: v = at'], aq='a')
N('H', 5, 'Sunlight of intensity 1.36 kW m⁻² reaches the Earth (radius 6.37 × 10⁶ m). Assume it is all absorbed. (a) Calculate the area the Earth presents to the Sun. (b) Calculate the total power absorbed. (c) Calculate the force of sunlight on the Earth, in units of 10⁸ N.' + take('c'), 1.36e3 * pi * 6.37e6 ** 2 / CL, '10⁸ N',
  f'(a) A = π × (6.37 × 10⁶)² = {sf(pi * 6.37e6 ** 2, 4)} m². (b) P = 1.36 × 10³ × {sf(pi * 6.37e6 ** 2, 4)} = {sf(1.36e3 * pi * 6.37e6 ** 2, 4)} W. (c) F = {sf(1.36e3 * pi * 6.37e6 ** 2, 4)} ÷ 3.00 × 10⁸ = {sf(1.36e3 * pi * 6.37e6 ** 2 / CL)} N',
  ['C1: cross-sectional area πR²', 'C1: P = IA', 'M1: F = P/c', 'C1: value'], aq='F')
N('H', 5, 'A "photon rocket" would push itself along by emitting a beam of light. (a) Show that the thrust is P/c, where P is the beam power. (b) Calculate the beam power needed for a thrust of 1.0 N. Give only the answer to (b), in units of 10⁸ W.' + take('c'), 1.0 * CL, '10⁸ W',
  '(a) Light leaves carrying momentum P/c per second, so the rocket gains equal and opposite momentum at that rate. (b) P = Fc = 1.0 × 3.00 × 10⁸ = 3.0 × 10⁸ W',
  ['B1: momentum per second P/c', 'M1: Newton\'s third law', 'C1: P = Fc', 'C1: value'], sig=2, aq='P')
N('H', 6, 'A 1.0 W laser beam is focused onto a spot of diameter 10 µm on an absorbing surface. (a) Calculate the area of the spot. (b) Calculate the intensity. (c) Calculate the radiation pressure on the spot.' + take('c'), 1.0 / (pi * 5e-6 ** 2) / CL, 'Pa',
  f'(a) A = π × (5.0 × 10⁻⁶)² = {sf(pi * 25e-12, 4)} m². (b) I = 1.0 ÷ {sf(pi * 25e-12, 4)} = {sf(1 / (pi * 25e-12), 4)} W m⁻². (c) p = I/c = {sf(1 / (pi * 25e-12), 4)} ÷ 3.00 × 10⁸ = {sf(1 / (pi * 25e-12) / CL)} Pa',
  ['C1: radius from diameter', 'C1: area', 'C1: I = P/A', 'M1: pressure = I/c', 'C1: value'], aq='pressure')
N('H', 5, 'A 1.0 ms pulse of light carrying 3.0 J is completely absorbed by a 2.0 g block at rest on a frictionless surface. (a) Calculate the momentum carried by the pulse. (b) Calculate the speed of the block afterwards. Give only the answer to (b), in units of 10⁻⁶ m s⁻¹.' + take('c'), 3.0 / CL / 2.0e-3, '10⁻⁶ m s⁻¹',
  f'(a) p = E/c = 3.0 ÷ 3.00 × 10⁸ = 1.0 × 10⁻⁸ kg m s⁻¹, whatever the wavelength. (b) v = p/m = 1.0 × 10⁻⁸ ÷ 2.0 × 10⁻³ = {sf(1e-8 / 2e-3)} m s⁻¹',
  ['M1: total momentum = E/c', 'C1: value', 'M1: conservation of momentum', 'C1: v'], sig=2, aq='v')
N('H', 6, 'A laser of wavelength 780 nm is used to slow rubidium atoms (mass 1.42 × 10⁻²⁵ kg) moving at 250 m s⁻¹ towards it. (a) Calculate the photon momentum. (b) Calculate the change in speed of an atom per absorbed photon. (c) Calculate the number of photons needed to stop an atom. Give only the answer to (c).' + take('h'), 250 / (HP / 780e-9 / 1.42e-25), None,
  f'(a) p = 6.63 × 10⁻³⁴ ÷ 780 × 10⁻⁹ = {sf(HP / 780e-9, 4)} kg m s⁻¹. (b) Δv = {sf(HP / 780e-9, 4)} ÷ 1.42 × 10⁻²⁵ = {sf(HP / 780e-9 / 1.42e-25, 4)} m s⁻¹. (c) N = 250 ÷ {sf(HP / 780e-9 / 1.42e-25, 4)} = {sf(250 / (HP / 780e-9 / 1.42e-25))}',
  ['C1: photon momentum', 'M1: Δv = p/m', 'C1: value', 'M1: N = v ÷ Δv', 'C1: value', 'B1: re-emission random so averages out'], aq='N')

# ═════════════════════════ 28.6 Energy levels and line spectra (17/16/9) ═════════════════════════
lesson('28.6')
N('E', 2, 'In a hydrogen atom an electron drops from the −1.51 eV level to the −3.40 eV level. Calculate the energy of the emitted photon in eV.', 3.40 - 1.51, 'eV',
  'ΔE = −1.51 − (−3.40) = 3.40 − 1.51 = 1.89 eV', ['C1: hf = E₁ − E₂'], aq='E')
M('E', 1, 'What is the ground state of an atom?', 'Its lowest possible energy level', ['Its highest energy level', 'The level at 0 eV', 'The state after ionisation'], 'Electrons normally occupy the lowest available levels.')
N('E', 2, 'A photon of energy 1.89 eV is emitted by a hydrogen atom. Calculate its wavelength in nm.' + take('h', 'c', 'e'), nm_of(1.89), 'nm',
  f'λ = hc/E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (1.89 × 1.60 × 10⁻¹⁹) = {sf(nm_of(1.89) * 1e-9, 4)} m. In nm: {sf(nm_of(1.89) * 1e-9, 4)} × 10⁹ = {sf(nm_of(1.89))}', ['C1: λ = hc/E'], aq='λ')
M('E', 1, 'How is a bright line in an emission spectrum produced?', 'An electron drops to a lower energy level and emits a photon of that energy difference', ['An electron absorbs a photon and rises to a higher level', 'The atom is ionised', 'The nucleus emits a photon'], 'Emitted photon energy = E(upper) − E(lower).')
N('E', 2, 'An electron is in the −3.40 eV level of a hydrogen atom. How much energy is needed to ionise the atom from this level? Give your answer in units of 10⁻¹⁹ J.' + take('e'), 3.40 * QE, '10⁻¹⁹ J',
  f'E = 3.40 × 1.60 × 10⁻¹⁹ = {sf(3.40 * QE)} J', ['C1: raise the electron to 0 eV'], aq='E')
M('E', 1, 'What causes the dark lines in an absorption spectrum?', 'Atoms absorb photons whose energies match the gaps between their levels', ['Atoms emit extra photons at those wavelengths', 'The light is reflected at those wavelengths', 'Dust blocks those wavelengths'], 'Absorbed photons are re-emitted in all directions, so those wavelengths are dim.')
N('E', 2, 'A mercury atom has levels at −10.4 eV (ground state) and −5.5 eV. Calculate the photon energy when an electron falls from −5.5 eV to the ground state, in eV.', 10.4 - 5.5, 'eV',
  'ΔE = −5.5 − (−10.4) = 10.4 − 5.5 = 4.9 eV', ['C1: difference of levels'], sig=2, aq='E')
M('E', 1, 'What is meant by excitation of an atom?', 'An electron is raised to a higher energy level within the atom', ['An electron is removed from the atom', 'The atom gains a proton', 'The atom emits a photon'], 'Excitation leaves the electron bound; ionisation removes it.')
N('E', 2, 'An atom has four energy levels. How many different photon energies can be emitted as electrons fall between these levels?', 6, None,
  'Each pair of levels gives one line: 3 + 2 + 1 = 6', ['C1: count all pairs'], sig=1, aq='number')
M('E', 1, 'On an energy level diagram, what does the level at 0 eV represent?', 'The electron has just been freed from the atom', ['The ground state', 'The nucleus', 'The first excited state'], 'Bound states have negative energy; 0 eV is the ionisation limit.')
N('E', 2, 'A hydrogen atom emits a photon of energy 2.55 eV. Calculate its wavelength in nm.' + take('h', 'c', 'e'), nm_of(2.55), 'nm',
  f'λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (2.55 × 1.60 × 10⁻¹⁹) = {sf(nm_of(2.55) * 1e-9, 4)} m. In nm: {sf(nm_of(2.55) * 1e-9, 4)} × 10⁹ = {sf(nm_of(2.55))}', ['C1: λ = hc/E'], aq='λ')
M('E', 1, 'Which transition gives the emitted photon of shortest wavelength?', 'The one with the largest energy difference', ['The one with the smallest energy difference', 'The one ending in the highest level', 'All transitions give the same wavelength'], 'λ = hc/ΔE, so the biggest energy drop gives the shortest wavelength.')
N('E', 2, 'The Lyman-alpha line of hydrogen has photon energy 10.2 eV. Calculate its frequency in units of 10¹⁵ Hz.' + take('e', 'h'), 10.2 * QE / HP, '10¹⁵ Hz',
  f'f = E/h = 10.2 × 1.60 × 10⁻¹⁹ ÷ 6.63 × 10⁻³⁴ = {sf(10.2 * QE / HP)} Hz', ['C1: eV to J then f = E/h'], aq='f')
M('E', 1, 'What is the ionisation energy of an atom?', 'The energy needed to remove an electron completely from the ground state', ['The energy of the ground state photon', 'The energy to move an electron up one level', 'The energy of the emitted line'], 'It takes the electron from the ground state to 0 eV.')
N('E', 2, 'An electron in a hydrogen atom falls from −0.85 eV to −1.51 eV. Calculate the photon energy in eV.', 1.51 - 0.85, 'eV',
  'ΔE = −0.85 − (−1.51) = 1.51 − 0.85 = 0.66 eV', ['C1: difference of levels'], sig=2, aq='E')
M('E', 1, 'A photon passes through a gas of atoms in their ground state. When is it absorbed?', 'Only when its energy exactly matches the energy gap to a higher level (or exceeds the ionisation energy)', ['Whenever its energy is greater than any energy gap', 'Always', 'Never'], 'Bound-to-bound transitions need an exact energy match.')
N('E', 1, 'Sodium has a ground state at −5.14 eV and an excited level at −3.03 eV. How much energy, in eV, is needed to excite an electron from the ground state to this level?', 5.14 - 3.03, 'eV',
  'ΔE = −3.03 − (−5.14) = 5.14 − 3.03 = 2.11 eV', [], aq='ΔE')
# medium
N('M', 3, 'In hydrogen, an electron falls from the −0.54 eV level to the −3.40 eV level. Calculate the wavelength of the emitted light in nm.' + take('h', 'c', 'e'), nm_of(3.40 - 0.54), 'nm',
  f'ΔE = 3.40 − 0.54 = 2.86 eV. λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (2.86 × 1.60 × 10⁻¹⁹) = {sf(nm_of(2.86) * 1e-9, 4)} m. In nm: {sf(nm_of(2.86) * 1e-9, 4)} × 10⁹ = {sf(nm_of(2.86))}',
  ['C1: energy difference', 'C1: λ = hc/E'], aq='λ')
N('M', 3, 'A hydrogen atom in its ground state (−13.6 eV) absorbs a photon of 12.09 eV. How much more energy, in eV, would then be needed to ionise it?', 13.6 - 12.09, 'eV',
  'New level = −13.6 + 12.09 = −1.51 eV. Energy to ionise = 13.6 − 12.09 = 1.51 eV', ['C1: new level', 'C1: raise to 0 eV'], aq='E')
M('M', 3, 'An electron with kinetic energy 12.5 eV collides with a hydrogen atom in its ground state (levels −13.6, −3.40, −1.51, −0.85 eV). Which is the highest level the atom can be excited to?', 'The −1.51 eV level', ['The −3.40 eV level only', 'The −0.85 eV level', 'It is ionised'], '−1.51 needs 12.09 eV ≤ 12.5 eV; −0.85 needs 12.75 eV. A colliding electron can give part of its energy.', ['C1: energy needed for each level', 'C1: partial transfer allowed'])
N('M', 3, 'Mercury vapour emits a strong ultraviolet line at 254 nm. Calculate the energy gap between the two levels involved, in eV.' + take('h', 'c', 'e'), ev_of(254), 'eV',
  f'ΔE = hc/λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (254 × 10⁻⁹ × 1.60 × 10⁻¹⁹) = {sf(ev_of(254))} eV', ['C1: E = hc/λ', 'C1: in eV'], aq='ΔE')
N('M', 4, 'An atom has energy levels at −8.0 eV, −4.0 eV, −2.5 eV and −1.0 eV. Calculate the longest wavelength it can emit, in nm.' + take('h', 'c', 'e'), nm_of(1.5), 'nm',
  f'Smallest gap = −1.0 − (−2.5) = 1.5 eV. λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (1.5 × 1.60 × 10⁻¹⁹) = {sf(nm_of(1.5) * 1e-9, 4)} m. In nm: {sf(nm_of(1.5) * 1e-9, 4)} × 10⁹ = {sf(nm_of(1.5))}',
  ['M1: smallest gap gives longest λ', 'C1: gap', 'C1: λ = hc/E'], aq='λ')
M('M', 3, 'Why does each element have its own characteristic set of spectral lines?', 'Each element has its own pattern of energy levels', ['Each element has a different number of neutrons', 'Atoms of each element vibrate at their own frequency', 'Each element reflects different colours'], 'Photon energies equal the gaps between levels, which differ from element to element.', ['C1: levels unique', 'C1: lines = level gaps'])
N('M', 3, 'An electron with 6.0 eV of kinetic energy collides with a mercury atom in its ground state and raises it to the first excited state, 4.9 eV above the ground state. What kinetic energy, in eV, does the electron keep?', 6.0 - 4.9, 'eV',
  'Ek left = 6.0 − 4.9 = 1.1 eV', ['C1: energy conservation', 'C1: value'], sig=2, aq='Ek')
N('M', 3, 'In hydrogen, an electron falls from −1.51 eV to −13.6 eV. Calculate the frequency of the emitted photon in units of 10¹⁵ Hz.' + take('e', 'h'), (13.6 - 1.51) * QE / HP, '10¹⁵ Hz',
  f'ΔE = 13.6 − 1.51 = 12.09 eV. f = 12.09 × 1.60 × 10⁻¹⁹ ÷ 6.63 × 10⁻³⁴ = {sf(12.09 * QE / HP)} Hz', ['C1: energy difference', 'C1: f = E/h'], aq='f')
M('M', 3, 'White light passes through cool sodium vapour and then into a spectrometer. What is seen?', 'A continuous spectrum crossed by dark lines at sodium\'s characteristic wavelengths', ['Bright lines on a dark background', 'A continuous spectrum with no lines', 'Only yellow light'], 'Sodium atoms absorb photons that match their level gaps and re-emit them in all directions.', ['C1: absorption', 'C1: dark lines at matching wavelengths'])
N('M', 4, 'Hydrogen emits ultraviolet light of wavelength 121.6 nm when an electron falls to the ground state (−13.6 eV). Calculate the photon energy in eV, which is the energy of the upper level above the ground state.' + take('h', 'c', 'e'), ev_of(121.6), 'eV',
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (121.6 × 10⁻⁹ × 1.60 × 10⁻¹⁹) = {sf(ev_of(121.6))} eV',
  ['C1: E = hc/λ', 'C1: nm to m', 'C1: J to eV'], aq='E')
M('M', 3, 'The visible lines of hydrogen (the Balmer series) all end on the same level. Which?', 'The −3.40 eV level (n = 2)', ['The ground state (n = 1)', 'The −1.51 eV level (n = 3)', 'The 0 eV level'], 'Transitions to n = 2 have gaps of 1.9–3.4 eV, which are visible photons.', ['C1: n = 2', 'C1: visible energies'])
N('M', 3, 'Calculate (wavelength of the −1.51 → −3.40 eV line) ÷ (wavelength of the −0.85 → −3.40 eV line) for hydrogen.', (3.40 - 0.85) / (3.40 - 1.51), None,
  f'λ ∝ 1/ΔE: ratio = (3.40 − 0.85) ÷ (3.40 − 1.51) = 2.55 ÷ 1.89 = {sf(2.55 / 1.89)}', ['C1: both energy gaps', 'C1: inverse ratio'], aq='ratio')
M('M', 3, 'A hydrogen atom is excited to the n = 3 level. How many different photon energies could it emit on its way back to the ground state (by any route)?', '3', ['2', '1', '6'], '3 → 1, 3 → 2 and 2 → 1.', ['C1: list transitions', 'C1: count'])
N('M', 3, 'The yellow sodium line has a wavelength of 589 nm. Calculate the energy gap between the levels involved, in units of 10⁻¹⁹ J.' + take('h', 'c'), HC / 589e-9, '10⁻¹⁹ J',
  f'ΔE = hc/λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 589 × 10⁻⁹ = {sf(HC / 589e-9)} J', ['C1: E = hc/λ', 'C1: substitution'], aq='ΔE')
N('M', 4, 'A simple model atom has only three levels, at −7.0 eV, −4.0 eV and −1.5 eV. Which emitted photon has the shortest wavelength? Calculate that wavelength in nm.' + take('h', 'c', 'e'), nm_of(5.5), 'nm',
  f'Largest gap = −1.5 − (−7.0) = 5.5 eV. λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (5.5 × 1.60 × 10⁻¹⁹) = {sf(nm_of(5.5) * 1e-9, 4)} m. In nm: {sf(nm_of(5.5) * 1e-9, 4)} × 10⁹ = {sf(nm_of(5.5))}',
  ['M1: largest gap', 'C1: gap value', 'C1: λ = hc/E'], aq='λ')
M('M', 3, 'Which observation is the best evidence that atoms have discrete energy levels?', 'Gases emit and absorb light only at certain sharp wavelengths', ['Hot solids glow with a continuous spectrum', 'Light is diffracted by a grating', 'Metals conduct electricity'], 'Sharp lines mean only certain photon energies, so only certain level gaps.', ['C1: line spectra', 'C1: fixed photon energies'])
# hard
N('H', 5, 'Two visible lines of hydrogen come from transitions to the −3.40 eV level: one from −1.51 eV and one from −0.85 eV. (a) Calculate the photon energy of each line. (b) Calculate the wavelength of each in nm. (c) Calculate the difference between the two wavelengths, in nm.' + take('h', 'c', 'e'), nm_of(1.89) - nm_of(2.55), 'nm',
  f'(a) 3.40 − 1.51 = 1.89 eV; 3.40 − 0.85 = 2.55 eV. (b) λ = hc/E: {sf(nm_of(1.89), 4)} nm and {sf(nm_of(2.55), 4)} nm. (c) {sf(nm_of(1.89), 4)} − {sf(nm_of(2.55), 4)} = {sf(nm_of(1.89) - nm_of(2.55))} nm',
  ['C1: both energies', 'C1: λ for 1.89 eV', 'C1: λ for 2.55 eV', 'C1: difference'], aq='Δλ')
N('H', 6, 'An atom has energy levels at −12.0 eV, −7.5 eV, −4.0 eV and −1.8 eV. (a) State its ionisation energy. (b) State how many different lines it can emit. (c) Calculate the longest wavelength it can emit, in nm. Give only the answer to (c).' + take('h', 'c', 'e'), nm_of(2.2), 'nm',
  f'(a) 12.0 eV. (b) 3 + 2 + 1 = 6 lines. (c) Smallest gap = 4.0 − 1.8 = 2.2 eV; λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (2.2 × 1.60 × 10⁻¹⁹) = {sf(nm_of(2.2) * 1e-9, 4)} m. In nm: {sf(nm_of(2.2) * 1e-9, 4)} × 10⁹ = {sf(nm_of(2.2))}',
  ['B1: ionisation energy', 'B1: six lines', 'M1: smallest gap', 'C1: gap value', 'C1: λ = hc/E'], aq='λ')
N('H', 5, 'In a fluorescent tube, mercury atoms emit ultraviolet photons of wavelength 254 nm. The coating absorbs each one and emits a visible photon of wavelength 550 nm, the rest of the energy becoming heat. (a) Calculate both photon energies in eV. (b) Calculate the percentage of each ultraviolet photon\'s energy that leaves as visible light.' + take('h', 'c', 'e'), 254 / 550 * 100, '%',
  f'(a) {sf(ev_of(254), 4)} eV and {sf(ev_of(550), 4)} eV. (b) E ∝ 1/λ, so the fraction = 254 ÷ 550 × 100 = {sf(254 / 550 * 100)} %',
  ['C1: UV photon energy', 'C1: visible photon energy', 'M1: ratio of energies', 'C1: percentage'], aq='percentage')
N('H', 6, 'Electrons accelerated through 11.0 V collide with hydrogen atoms in the ground state (levels −13.6, −3.40, −1.51 eV). (a) State which excited level can be reached. (b) Calculate the kinetic energy an electron keeps after exciting an atom. (c) Calculate the wavelength of the light emitted when the atom returns to the ground state, in nm. Give only the answer to (c).' + take('h', 'c', 'e'), nm_of(10.2), 'nm',
  f'(a) −3.40 eV, needing 10.2 eV; −1.51 eV needs 12.09 eV, too much. (b) 11.0 − 10.2 = 0.8 eV. (c) λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (10.2 × 1.60 × 10⁻¹⁹) = {sf(nm_of(10.2) * 1e-9, 4)} m. In nm: {sf(nm_of(10.2) * 1e-9, 4)} × 10⁹ = {sf(nm_of(10.2))}',
  ['C1: electron energy 11.0 eV', 'B1: only n = 2 reachable', 'C1: energy kept', 'M1: λ = hc/ΔE', 'C1: value'], aq='λ')
N('H', 5, 'A photon of energy 15.0 eV is absorbed by a hydrogen atom in its ground state (−13.6 eV). (a) Explain why the atom is ionised. (b) Calculate the kinetic energy of the freed electron in eV. (c) Calculate its speed. Give only the answer to (c), in units of 10⁵ m s⁻¹.' + take('e', 'me'), vmax(15.0 - 13.6), '10⁵ m s⁻¹',
  f'(a) 15.0 eV exceeds the ionisation energy, 13.6 eV. (b) Ek = 15.0 − 13.6 = 1.4 eV. (c) v = √(2 × 1.4 × 1.60 × 10⁻¹⁹ ÷ 9.11 × 10⁻³¹) = {sf(vmax(1.4))} m s⁻¹',
  ['B1: above ionisation energy', 'C1: Ek', 'C1: eV to J', 'C1: v = √(2Ek/m)'], aq='v')
N('H', 6, 'Hydrogen atoms are excited to the −0.54 eV level (n = 5). (a) State how many different lines can be emitted as the atoms return to the ground state. (b) Calculate the photon energy for the 5 → 1 transition. (c) Calculate its wavelength in nm. Give only the answer to (c).' + take('h', 'c', 'e'), nm_of(13.6 - 0.54), 'nm',
  f'(a) 4 + 3 + 2 + 1 = 10 lines. (b) 13.6 − 0.54 = 13.06 eV. (c) λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (13.06 × 1.60 × 10⁻¹⁹) = {sf(nm_of(13.06) * 1e-9, 4)} m. In nm: {sf(nm_of(13.06) * 1e-9, 4)} × 10⁹ = {sf(nm_of(13.06))}',
  ['B1: ten lines', 'C1: energy gap', 'M1: λ = hc/ΔE', 'C1: J conversion', 'C1: value'], aq='λ')
N('H', 5, 'In a helium–neon laser the light comes from a transition in neon between levels 20.66 eV and 18.70 eV above the ground state. (a) Calculate the photon energy. (b) Calculate the wavelength in nm. Give only the answer to (b).' + take('h', 'c', 'e'), nm_of(20.66 - 18.70), 'nm',
  f'(a) 20.66 − 18.70 = 1.96 eV. (b) λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (1.96 × 1.60 × 10⁻¹⁹) = {sf(nm_of(1.96) * 1e-9, 4)} m. In nm: {sf(nm_of(1.96) * 1e-9, 4)} × 10⁹ = {sf(nm_of(1.96))}',
  ['C1: energy difference', 'M1: λ = hc/E', 'C1: conversion', 'C1: value'], aq='λ')
N('H', 5, 'The spectrum of a star shows a dark line at 656 nm. (a) Calculate the energy of photons of this wavelength in eV. (b) Hydrogen has levels at −1.51 eV and −3.40 eV. Show that this line could be due to hydrogen. (c) Explain why the line is dark.' + take('h', 'c', 'e'), ev_of(656), 'eV',
  f'(a) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (656 × 10⁻⁹ × 1.60 × 10⁻¹⁹) = {sf(ev_of(656))} eV. (b) 3.40 − 1.51 = 1.89 eV, a match. (c) Hydrogen in the cooler outer layers absorbs these photons and re-emits them in all directions.',
  ['C1: photon energy', 'C1: gap = 1.89 eV', 'B1: match', 'B1: absorption and re-emission in all directions'], aq='E')
N('H', 6, 'An atom has levels at −9.0 eV (ground), −5.2 eV and −3.1 eV. An electron with 4.5 eV of kinetic energy collides with the atom in its ground state. (a) Show that it can excite the atom to −5.2 eV but not to −3.1 eV. (b) Calculate the kinetic energy the electron keeps. (c) Calculate the wavelength emitted when the atom returns to its ground state, in nm. Give only the answer to (c).' + take('h', 'c', 'e'), nm_of(3.8), 'nm',
  f'(a) −5.2 needs 3.8 eV ≤ 4.5 eV; −3.1 needs 5.9 eV. (b) 4.5 − 3.8 = 0.7 eV. (c) λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (3.8 × 1.60 × 10⁻¹⁹) = {sf(nm_of(3.8) * 1e-9, 4)} m. In nm: {sf(nm_of(3.8) * 1e-9, 4)} × 10⁹ = {sf(nm_of(3.8))}',
  ['C1: energies needed', 'B1: comparison', 'C1: energy kept', 'M1: λ = hc/ΔE', 'C1: value'], aq='λ')
