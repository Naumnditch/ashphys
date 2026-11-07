# Chapter 28 Quantum physics — part b: 28.7 to 28.11.
HP, CL, QE, ME, MP = 6.63e-34, 3.00e8, 1.60e-19, 9.11e-31, 1.67e-27
HC = HP * CL
NA_, KB = 6.02e23, 1.38e-23


def ephot(lam):
    return HC / lam


def ev_of(nm):
    return HC / (nm * 1e-9) / QE


def nm_of(ev):
    return HC / (ev * QE) * 1e9


def deg_asin(x):
    return degrees(asin(x))


def lam_e(volts, m=ME):
    """de Broglie wavelength (m) of a particle of charge e accelerated from rest through `volts`"""
    return HP / sqrt(2 * m * QE * volts)


# ═════════════════════════ 28.7 Explaining the origin of line spectra (17/18/9) ═════════════════════════
lesson('28.7')
N('E', 2, 'Hydrogen gas in a discharge tube glows red, with a strong line at 656 nm. Calculate the photon energy of this line in eV.' + take('h', 'c', 'e'), ev_of(656), 'eV',
  f'E = hc/λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (656 × 10⁻⁹ × 1.60 × 10⁻¹⁹) = {sf(ev_of(656))} eV', ['C1: E = hc/λ in eV'], aq='E')
M('E', 1, 'Why does a low-pressure gas in a discharge tube emit light?', 'Electrons collide with atoms and excite them; the atoms then emit photons as they de-excite', ['The gas is hot enough to glow like a filament', 'Electrons are absorbed by the nuclei', 'The glass tube converts electricity into light'], 'Collisions raise electrons to higher levels; each fall emits a photon of the level difference.')
N('E', 2, 'A diffraction grating with slit spacing 2.0 × 10⁻⁶ m is used to view the 589 nm line of sodium. Calculate the first-order angle of the line in degrees.', deg_asin(589e-9 / 2.0e-6), '°',
  f'sin θ = λ/d = 589 × 10⁻⁹ ÷ 2.0 × 10⁻⁶ = {sf(589e-9 / 2e-6, 4)}, so θ = sin⁻¹ {sf(589e-9 / 2e-6, 4)} = {sf(deg_asin(589e-9 / 2e-6))}°', ['C1: d sin θ = nλ'], aq='θ')
M('E', 1, 'What does the emission spectrum of a hot, low-pressure gas look like?', 'Bright coloured lines on a dark background', ['A continuous band of all colours', 'Dark lines on a continuous background', 'A single white line'], 'Only photons of certain energies are emitted.')
N('E', 2, 'A spectral line has a photon energy of 2.11 eV. Calculate its wavelength in nm.' + take('h', 'c', 'e'), nm_of(2.11), 'nm',
  f'λ = hc/E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (2.11 × 1.60 × 10⁻¹⁹) = {sf(nm_of(2.11) * 1e-9, 4)} m. In nm: {sf(nm_of(2.11) * 1e-9, 4)} × 10⁹ = {sf(nm_of(2.11))}', ['C1: λ = hc/E'], aq='λ')
M('E', 1, 'What does an absorption spectrum look like?', 'A continuous spectrum crossed by dark lines', ['Bright lines on a dark background', 'A single bright band', 'A continuous spectrum with no gaps'], 'Atoms remove the photons that match their level gaps.')
N('E', 2, 'A violet line in the hydrogen spectrum has a wavelength of 434 nm. Calculate the energy difference between the levels involved, in units of 10⁻¹⁹ J.' + take('h', 'c'), HC / 434e-9, '10⁻¹⁹ J',
  f'ΔE = hc/λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 434 × 10⁻⁹ = {sf(HC / 434e-9)} J', ['C1: ΔE = hc/λ'], aq='ΔE')
M('E', 1, 'What kind of spectrum does the glowing filament of an incandescent lamp produce?', 'A continuous spectrum', ['A line emission spectrum', 'An absorption spectrum', 'Only infrared lines'], 'A hot dense solid emits all wavelengths.')
N('E', 2, 'A grating has slits 2.0 × 10⁻⁶ m apart. A line appears in the second order at 30.0°. Calculate its wavelength in nm.', 2.0e-6 * sin(radians(30)) / 2 * 1e9, 'nm',
  f'λ = d sin θ / n = 2.0 × 10⁻⁶ × sin 30.0° ÷ 2 = {sf(2e-6 * 0.5 / 2, 4)} m. In nm: {sf(2e-6 * 0.5 / 2, 4)} × 10⁹ = {sf(500.0)}', ['C1: nλ = d sin θ'], aq='λ')
M('E', 1, 'The dark Fraunhofer lines in sunlight are evidence of what?', 'Elements in the cooler outer layers of the Sun absorbing particular wavelengths', ['Dust between the Earth and the Sun', 'Gaps in the Sun\'s surface', 'Interference in the Earth\'s atmosphere'], 'Each set of lines matches the levels of a particular element.')
N('E', 2, 'An atom has five energy levels. How many different spectral lines can it emit?', 10, None,
  'Number of pairs = 4 + 3 + 2 + 1 = 10', ['C1: count each pair once'], sig=2, aq='lines')
M('E', 1, 'Why do absorption lines look dark even though the absorbing atoms re-emit photons?', 'The photons are re-emitted in all directions, so few continue towards the observer', ['The atoms keep the energy permanently', 'The re-emitted photons have different colours', 'The atoms absorb all wavelengths'], 'The beam loses those wavelengths in the forward direction.')
N('E', 2, 'Calculate the frequency of the 656 nm hydrogen line in units of 10¹⁴ Hz.' + take('c'), CL / 656e-9, '10¹⁴ Hz',
  f'f = c/λ = 3.00 × 10⁸ ÷ 656 × 10⁻⁹ = {sf(CL / 656e-9)} Hz', ['C1: f = c/λ'], aq='f')
M('E', 1, 'How can a gas be made to show its emission line spectrum?', 'By passing an electric discharge through it at low pressure', ['By cooling it to a liquid', 'By shining white light through it', 'By compressing it'], 'The discharge excites the atoms, which then emit their characteristic lines.')
N('E', 2, 'Electrons in a discharge tube are accelerated through 15 V. Calculate the kinetic energy of each electron in units of 10⁻¹⁸ J.' + take('e'), 15 * QE, '10⁻¹⁸ J',
  'Ek = eV = 1.60 × 10⁻¹⁹ × 15 = 2.4 × 10⁻¹⁸ J', ['C1: Ek = eV'], sig=2, aq='Ek')
M('E', 1, 'Helium was first discovered from the Sun\'s spectrum. What made this possible?', 'A set of lines matched no element then known on Earth', ['Helium is the brightest element', 'The Sun is made only of helium', 'Helium emits a continuous spectrum'], 'Each element has its own pattern of lines.')
N('E', 1, 'An electron falls through an energy gap of 1.9 eV. Express this gap in units of 10⁻¹⁹ J.' + take('e'), 1.9 * QE, '10⁻¹⁹ J',
  'ΔE = 1.9 × 1.60 × 10⁻¹⁹ = 3.04 × 10⁻¹⁹ J', [], aq='ΔE')
# medium
N('M', 3, 'A grating with 600 lines per mm is used to view the red 656 nm line of hydrogen. Calculate the first-order angle in degrees.', deg_asin(656e-9 * 600e3), '°',
  f'd = 1 ÷ 600 × 10³ = {sf(1 / 600e3, 4)} m. sin θ = 656 × 10⁻⁹ ÷ {sf(1 / 600e3, 4)} = {sf(656e-9 * 600e3, 4)}, so θ = sin⁻¹ {sf(656e-9 * 600e3, 4)} = {sf(deg_asin(656e-9 * 600e3))}°',
  ['C1: d from lines per mm', 'C1: d sin θ = λ'], aq='θ')
N('M', 4, 'A grating with 500 lines per mm shows a line in the first order at 19.5°. Calculate the photon energy of this line in eV.' + take('h', 'c', 'e'), HC / (2.0e-6 * sin(radians(19.5))) / QE, 'eV',
  f'd = 2.0 × 10⁻⁶ m. λ = 2.0 × 10⁻⁶ × sin 19.5° = {sf(2e-6 * sin(radians(19.5)), 4)} m. E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ ({sf(2e-6 * sin(radians(19.5)), 4)} × 1.60 × 10⁻¹⁹) = {sf(HC / (2e-6 * sin(radians(19.5))) / QE)} eV',
  ['C1: d', 'C1: λ = d sin θ', 'C1: E = hc/λ in eV'], aq='E')
M('M', 3, 'Electrons with 10.5 eV of kinetic energy collide with hydrogen atoms in the ground state (levels −13.6, −3.40, −1.51 eV). Which line can then be emitted?', 'Only the line from −3.40 eV to −13.6 eV', ['Lines from −1.51 eV to both lower levels', 'All the lines of hydrogen', 'No lines at all'], 'Only the 10.2 eV excitation is possible with 10.5 eV.', ['C1: 10.2 eV ≤ 10.5 eV < 12.09 eV', 'C1: one transition back'])
N('M', 4, 'The yellow sodium "line" is really two lines, at 589.0 nm and 589.6 nm. Calculate the difference between their photon energies, in units of 10⁻²² J.' + take('h', 'c'), HC / 589.0e-9 - HC / 589.6e-9, '10⁻²² J',
  f'E₁ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 589.0 × 10⁻⁹ = {sf(HC / 589.0e-9, 5)} J. E₂ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 589.6 × 10⁻⁹ = {sf(HC / 589.6e-9, 5)} J. ΔE = {sf(HC / 589.0e-9, 5)} − {sf(HC / 589.6e-9, 5)} = {sf(HC / 589.0e-9 - HC / 589.6e-9)} J',
  ['C1: both energies', 'C1: enough significant figures kept', 'C1: difference'], aq='ΔE')
M('M', 3, 'Cool hydrogen gas, with nearly all its atoms in the ground state, is placed in front of a hot ultraviolet source. Which absorption lines are strongest?', 'Those of the series ending on the ground state (in the ultraviolet)', ['The visible lines ending on n = 2', 'The infrared lines', 'No lines, because cool gas cannot absorb'], 'Absorption starts from the occupied level, here n = 1.', ['C1: atoms in ground state', 'C1: transitions start from n = 1'])
N('M', 3, 'A line in the ultraviolet spectrum of hydrogen has a wavelength of 102.6 nm. Calculate its photon energy in eV.' + take('h', 'c', 'e'), ev_of(102.6), 'eV',
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (102.6 × 10⁻⁹ × 1.60 × 10⁻¹⁹) = {sf(ev_of(102.6))} eV', ['C1: E = hc/λ', 'C1: J to eV'], aq='E')
N('M', 3, 'A mercury lamp emits lines at 436 nm and 546 nm. Calculate (photon energy of the 436 nm line) ÷ (photon energy of the 546 nm line).', 546 / 436, None,
  f'E ∝ 1/λ, so ratio = 546 ÷ 436 = {sf(546 / 436)}', ['C1: E = hc/λ', 'C1: inverse ratio'], aq='ratio')
N('M', 3, 'A hydrogen atom in the −0.85 eV level returns to the ground state (−13.6 eV) in two steps, by way of the −3.40 eV level. Calculate the total energy, in eV, of the two photons emitted.', 13.6 - 0.85, 'eV',
  'Total = (3.40 − 0.85) + (13.6 − 3.40) = 13.6 − 0.85 = 12.75 eV', ['C1: each photon energy', 'C1: sum equals overall drop'], sig=4, aq='E')
N('M', 3, 'Hydrogen has a level at −0.38 eV. Calculate the wavelength, in nm, of the line emitted when an electron falls from this level to −3.40 eV.' + take('h', 'c', 'e'), nm_of(3.40 - 0.38), 'nm',
  f'ΔE = 3.40 − 0.38 = 3.02 eV. λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (3.02 × 1.60 × 10⁻¹⁹) = {sf(nm_of(3.02) * 1e-9, 4)} m. In nm: {sf(nm_of(3.02) * 1e-9, 4)} × 10⁹ = {sf(nm_of(3.02))}',
  ['C1: energy gap', 'C1: λ = hc/ΔE'], aq='λ')
M('M', 3, 'The spectrum of light from a star shows dark lines at exactly the wavelengths of hydrogen\'s visible emission lines. What does this show?', 'Hydrogen in the star\'s cooler outer layers absorbs those wavelengths', ['The star contains no hydrogen', 'Hydrogen in the Earth\'s atmosphere emits those wavelengths', 'The star is moving away from us'], 'Absorption lines occur at the same wavelengths as the element\'s emission lines.', ['C1: absorption', 'C1: same wavelengths as emission'])
N('M', 4, 'A grating with 400 lines per mm is used to view the 486 nm and 656 nm lines of hydrogen. Calculate the angle between the two lines in the first order, in degrees.', deg_asin(656e-9 / 2.5e-6) - deg_asin(486e-9 / 2.5e-6), '°',
  f'd = 2.5 × 10⁻⁶ m. θ₁ = sin⁻¹ (486 × 10⁻⁹ ÷ 2.5 × 10⁻⁶) = {sf(deg_asin(486e-9 / 2.5e-6), 4)}°. θ₂ = sin⁻¹ (656 × 10⁻⁹ ÷ 2.5 × 10⁻⁶) = {sf(deg_asin(656e-9 / 2.5e-6), 4)}°. Difference = {sf(deg_asin(656e-9 / 2.5e-6), 4)} − {sf(deg_asin(486e-9 / 2.5e-6), 4)} = {sf(deg_asin(656e-9 / 2.5e-6) - deg_asin(486e-9 / 2.5e-6))}°',
  ['C1: d', 'C1: both angles', 'C1: difference'], aq='Δθ')
M('M', 3, 'Why does a neon sign glow red-orange rather than white?', 'Neon\'s energy levels give strong lines mainly in the red-orange part of the spectrum', ['The glass is coloured red', 'Neon atoms are red', 'The current is too small for blue light'], 'The colour comes from the photon energies of neon\'s strongest transitions.', ['C1: characteristic levels', 'C1: strong red lines'])
N('M', 3, 'Helium has a bright yellow line at 587.6 nm. Calculate the energy difference between the levels involved, in units of 10⁻¹⁹ J.' + take('h', 'c'), HC / 587.6e-9, '10⁻¹⁹ J',
  f'ΔE = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 587.6 × 10⁻⁹ = {sf(HC / 587.6e-9)} J', ['C1: ΔE = hc/λ', 'C1: substitution'], aq='ΔE')
M('M', 4, 'The voltage across a hydrogen discharge tube is increased, so the electrons gain more energy between collisions. What change is seen in the spectrum?', 'More lines appear, because higher levels can now be reached', ['The existing lines shift to shorter wavelengths', 'The lines become fewer', 'The spectrum becomes continuous'], 'Line wavelengths are fixed by the levels; more energetic collisions populate more levels.', ['C1: wavelengths fixed', 'C1: higher levels excited', 'C1: extra lines'])
N('M', 3, 'A grating has slits 2.0 × 10⁻⁶ m apart. What is the highest order in which the 589 nm sodium line can be seen?', 3, None,
  f'n ≤ d/λ = 2.0 × 10⁻⁶ ÷ 589 × 10⁻⁹ = {sf(2e-6 / 589e-9, 4)}. Orders 1, 2 and 3 have sin θ below 1, so the highest order is 1 + 1 + 1 = 3', ['C1: sin θ ≤ 1', 'C1: whole number below d/λ'], sig=1, aq='n')
N('M', 3, 'What minimum accelerating potential difference gives electrons enough energy to ionise ground-state hydrogen atoms (−13.6 eV) by collision?', 13.6, 'V',
  'eV = 13.6 eV, so V = 13.6 ÷ 1 = 13.6 V', ['C1: ionisation energy 13.6 eV', 'C1: eV = Ek'], aq='V')
M('M', 3, 'Why are the wavelengths of the lines of an element the same whatever the source, from a laboratory lamp to a distant star at rest?', 'They depend only on the energy levels of that element\'s atoms', ['They depend on the temperature of the source', 'They depend on the brightness of the source', 'They depend on the distance of the source'], 'λ = hc/ΔE and ΔE is fixed by the atom.', ['C1: λ = hc/ΔE', 'C1: levels fixed for the element'])
# hard
N('H', 5, 'A grating with 500 lines per mm shows an unknown yellow line in the second order at 36.2°. (a) Calculate the slit spacing. (b) Calculate the wavelength of the line in nm. (c) Calculate its photon energy and suggest which element produced it. Give only the answer to (b).', 2.0e-6 * sin(radians(36.2)) / 2 * 1e9, 'nm',
  f'(a) d = 1 ÷ 500 × 10³ = 2.0 × 10⁻⁶ m. (b) λ = 2.0 × 10⁻⁶ × sin 36.2° ÷ 2 = {sf(2e-6 * sin(radians(36.2)) / 2, 4)} m. In nm: {sf(2e-6 * sin(radians(36.2)) / 2, 4)} × 10⁹ = {sf(2e-6 * sin(radians(36.2)) / 2 * 1e9)}. (c) E = hc/λ ≈ 2.10 eV, which is the sodium line.',
  ['C1: d', 'M1: nλ = d sin θ with n = 2', 'C1: value', 'B1: sodium identified'], aq='λ')
N('H', 6, 'Hydrogen atoms are excited to the n = 3 level (−1.51 eV); the lower levels are −3.40 eV and −13.6 eV. (a) List the possible transitions back to the ground state. (b) Calculate each photon energy. (c) Calculate the shortest wavelength emitted, in nm. Give only the answer to (c).' + take('h', 'c', 'e'), nm_of(13.6 - 1.51), 'nm',
  f'(a) 3 → 1, 3 → 2, 2 → 1. (b) 12.09 eV, 1.89 eV and 10.2 eV. (c) Largest energy 12.09 eV: λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (12.09 × 1.60 × 10⁻¹⁹) = {sf(nm_of(12.09) * 1e-9, 4)} m. In nm: {sf(nm_of(12.09) * 1e-9, 4)} × 10⁹ = {sf(nm_of(12.09))}',
  ['B1: three transitions', 'C1: photon energies', 'M1: largest energy gives shortest λ', 'C1: J conversion', 'C1: value'], aq='λ')
N('H', 5, 'Electrons with 12.2 eV of kinetic energy pass through hydrogen gas in the ground state (levels −13.6, −3.40, −1.51, −0.85 eV). (a) State the highest level that can be reached. (b) List the lines that can then be emitted. (c) Calculate the longest wavelength emitted, in nm. Give only the answer to (c).' + take('h', 'c', 'e'), nm_of(3.40 - 1.51), 'nm',
  f'(a) −1.51 eV (needs 12.09 eV); −0.85 eV needs 12.75 eV. (b) 3 → 2, 3 → 1 and 2 → 1. (c) Smallest gap = 3.40 − 1.51 = 1.89 eV: λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (1.89 × 1.60 × 10⁻¹⁹) = {sf(nm_of(1.89) * 1e-9, 4)} m. In nm: {sf(nm_of(1.89) * 1e-9, 4)} × 10⁹ = {sf(nm_of(1.89))}',
  ['B1: n = 3 reached', 'B1: three lines', 'M1: smallest gap', 'C1: value'], aq='λ')
N('H', 6, 'Sodium vapour absorbs 2.0 mW from a beam of 589 nm light. (a) Calculate the photon energy. (b) Calculate the number of photons absorbed per second. (c) Explain why the vapour does not heat up steadily as a result. Give only the answer to (b).' + take('h', 'c'), 2.0e-3 / ephot(589e-9), None,
  f'(a) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 589 × 10⁻⁹ = {sf(ephot(589e-9), 4)} J. (b) n = 2.0 × 10⁻³ ÷ {sf(ephot(589e-9), 4)} = {sf(2e-3 / ephot(589e-9))}. (c) The excited atoms re-emit photons of the same energy, in all directions.',
  ['C1: photon energy', 'M1: n = P/E', 'C1: mW to W', 'C1: value', 'B1: re-emission in all directions'], aq='n')
N('H', 5, 'The 656 nm hydrogen line is seen in the first order at 23.2° with an unlabelled grating. (a) Calculate the slit spacing. (b) Calculate the number of lines per mm on the grating.', sin(radians(23.2)) / 656e-9 / 1e3, None,
  f'(a) d = λ/sin θ = 656 × 10⁻⁹ ÷ sin 23.2° = {sf(656e-9 / sin(radians(23.2)), 4)} m. (b) Lines per mm = 1 ÷ ({sf(656e-9 / sin(radians(23.2)), 4)} × 10³) = {sf(sin(radians(23.2)) / 656e-9 / 1e3)}',
  ['C1: d = λ/sin θ', 'C1: value', 'M1: lines per mm = 1/d with d in mm', 'C1: value'], aq='N')
N('H', 6, 'An atom with three energy levels emits lines with photon energies of 1.5 eV, 2.5 eV and 4.0 eV. Its ground state is at −6.0 eV. (a) Explain why 1.5 + 2.5 = 4.0. (b) Find the energies of the other two levels. (c) Calculate the wavelength of the 1.5 eV line, in nm. Give only the answer to (c).' + take('h', 'c', 'e'), nm_of(1.5), 'nm',
  f'(a) The 4.0 eV line is the direct drop from top to ground; the other two are the same drop in two steps. (b) −6.0 + 2.5 = −3.5 eV and −6.0 + 4.0 = −2.0 eV. (c) λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (1.5 × 1.60 × 10⁻¹⁹) = {sf(nm_of(1.5) * 1e-9, 4)} m. In nm: {sf(nm_of(1.5) * 1e-9, 4)} × 10⁹ = {sf(nm_of(1.5))}',
  ['B1: energy conservation', 'C1: middle level', 'C1: top level', 'M1: λ = hc/E', 'C1: value'], aq='λ')
N('H', 5, 'Light from a hydrogen lamp falls on a grating with 300 lines per mm. (a) Calculate the slit spacing. (b) Calculate the angle of the 656 nm line in the third order, in degrees. (c) State whether a fourth order exists for this line.', deg_asin(3 * 656e-9 * 300e3), '°',
  f'(a) d = 1 ÷ 300 × 10³ = {sf(1 / 300e3, 4)} m. (b) sin θ = 3 × 656 × 10⁻⁹ ÷ {sf(1 / 300e3, 4)} = {sf(3 * 656e-9 * 300e3, 4)}, θ = sin⁻¹ {sf(3 * 656e-9 * 300e3, 4)} = {sf(deg_asin(3 * 656e-9 * 300e3))}°. (c) For n = 5, sin θ > 1, but n = 4 gives 0.787, so a fourth order exists.',
  ['C1: d', 'M1: nλ = d sin θ', 'C1: value', 'B1: fourth order check'], aq='θ')
N('H', 6, 'A 10 W fluorescent tube converts 60% of its input power into ultraviolet photons of wavelength 254 nm from mercury atoms. (a) Calculate the ultraviolet power. (b) Calculate the photon energy. (c) Calculate the number of ultraviolet photons emitted per second. Give only the answer to (c).' + take('h', 'c'), 6.0 / ephot(254e-9), None,
  f'(a) 0.60 × 10 = 6.0 W. (b) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 254 × 10⁻⁹ = {sf(ephot(254e-9), 4)} J. (c) n = 6.0 ÷ {sf(ephot(254e-9), 4)} = {sf(6.0 / ephot(254e-9))}',
  ['C1: UV power', 'C1: photon energy', 'M1: n = P/E', 'C1: value', 'B1: units consistent'], aq='n')
N('H', 5, 'Electrons accelerated through 10.0 V pass through mercury vapour, whose first excitation energy is 4.9 eV. (a) Explain why an electron can excite at most two atoms. (b) Calculate the wavelength of the light emitted when an excited atom returns to its ground state, in nm. Give only the answer to (b).' + take('h', 'c', 'e'), nm_of(4.9), 'nm',
  f'(a) 10.0 eV ÷ 4.9 eV ≈ 2.04, so two excitations use 9.8 eV and 0.2 eV is left. (b) λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (4.9 × 1.60 × 10⁻¹⁹) = {sf(nm_of(4.9) * 1e-9, 4)} m. In nm: {sf(nm_of(4.9) * 1e-9, 4)} × 10⁹ = {sf(nm_of(4.9))}',
  ['B1: 10.0 eV gives two lots of 4.9 eV', 'M1: λ = hc/E', 'C1: conversion', 'C1: value'], aq='λ')

N('E', 2, 'A spectral line has a frequency of 6.17 × 10¹⁴ Hz. Calculate its wavelength in nm.' + take('c'), CL / 6.17e14 * 1e9, 'nm',
  f'λ = c/f = 3.00 × 10⁸ ÷ 6.17 × 10¹⁴ = {sf(CL / 6.17e14, 4)} m. In nm: {sf(CL / 6.17e14, 4)} × 10⁹ = {sf(CL / 6.17e14 * 1e9)}', ['C1: λ = c/f'], aq='λ')

# ═════════════════════════ 28.8 Photon energies (16/19/9) ═════════════════════════
lesson('28.8')
N('E', 2, 'A violet photon has a frequency of 9.0 × 10¹⁴ Hz. How much energy does it carry? Answer in units of 10⁻¹⁹ J.' + take('h'), HP * 9.0e14, '10⁻¹⁹ J',
  f'E = hf = 6.63 × 10⁻³⁴ × 9.0 × 10¹⁴ = {sf(HP * 9e14)} J', ['C1: E = hf'], aq='E')
M('E', 1, 'How many joules are there in one electronvolt?', '1.60 × 10⁻¹⁹ J', ['1.60 × 10¹⁹ J', '6.63 × 10⁻³⁴ J', '1.00 J'], '1 eV = e × 1 V = 1.60 × 10⁻¹⁹ J.')
N('E', 2, 'Convert a photon energy of 4.0 eV into units of 10⁻¹⁹ J.' + take('e'), 4.0 * QE, '10⁻¹⁹ J',
  'E = 4.0 × 1.60 × 10⁻¹⁹ = 6.4 × 10⁻¹⁹ J', ['C1: × 1.60 × 10⁻¹⁹'], sig=2, aq='E')
M('E', 1, 'Photon A has three times the frequency of photon B. What is (energy of A) ÷ (energy of B)?', '3', ['1/3', '9', '1'], 'E = hf, so E is proportional to f.')
N('E', 2, 'An infrared photon carries 2.4 × 10⁻¹⁹ J. What is this energy in eV?' + take('e'), 2.4e-19 / QE, 'eV',
  'E = 2.4 × 10⁻¹⁹ ÷ 1.60 × 10⁻¹⁹ = 1.5 eV', ['C1: ÷ 1.60 × 10⁻¹⁹'], sig=2, aq='E')
M('E', 1, 'A photon has an energy of about 2 eV. In which region of the electromagnetic spectrum is it?', 'Visible light', ['Gamma rays', 'Radio waves', 'X-rays'], 'Visible photons have energies from about 1.7 eV to 3.3 eV.')
N('E', 2, 'Calculate the energy of an X-ray photon of wavelength 0.020 nm, in keV.' + take('h', 'c', 'e'), HC / 0.020e-9 / QE / 1e3, 'keV',
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 0.020 × 10⁻⁹ = {sf(HC / 0.02e-9, 4)} J. In keV: {sf(HC / 0.02e-9, 4)} ÷ 1.60 × 10⁻¹⁶ = {sf(HC / 0.02e-9 / 1.6e-16)}', ['C1: E = hc/λ then ÷ 1.60 × 10⁻¹⁶'], aq='E')
M('E', 1, 'In the photon energy equation E = hf, what does the symbol h stand for?', 'The Planck constant', ['The height of the wave', 'The number of photons', 'The speed of light'], 'h = 6.63 × 10⁻³⁴ J s links photon energy to frequency.')
N('E', 2, 'Calculate the energy, in eV, of an infrared photon of wavelength 1500 nm.' + take('h', 'c', 'e'), ev_of(1500), 'eV',
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (1500 × 10⁻⁹ × 1.60 × 10⁻¹⁹) = {sf(ev_of(1500))} eV', ['C1: E = hc/λ in eV'], aq='E')
M('E', 1, 'The electronvolt is a unit of which quantity?', 'Energy', ['Potential difference', 'Charge', 'Power'], 'It is the energy gained by an electron moving through 1 V.')
N('E', 2, 'Calculate the wavelength, in nm, of a photon of energy 1.0 eV.' + take('h', 'c', 'e'), nm_of(1.0), 'nm',
  f'λ = hc/E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (1.0 × 1.60 × 10⁻¹⁹) = {sf(nm_of(1.0) * 1e-9, 4)} m. In nm: {sf(nm_of(1.0) * 1e-9, 4)} × 10⁹ = {sf(nm_of(1.0))}', ['C1: λ = hc/E'], aq='λ')
M('E', 1, 'Which photon energy could NOT belong to visible light?', '5.0 eV', ['1.8 eV', '2.5 eV', '3.1 eV'], '5.0 eV is about 250 nm, in the ultraviolet.')
N('E', 2, 'Calculate the energy, in keV, of a photon of frequency 1.0 × 10²⁰ Hz.' + take('h', 'e'), HP * 1.0e20 / QE / 1e3, 'keV',
  f'E = hf = 6.63 × 10⁻³⁴ × 1.0 × 10²⁰ = 6.63 × 10⁻¹⁴ J. In keV: 6.63 × 10⁻¹⁴ ÷ 1.60 × 10⁻¹⁶ = {sf(6.63e-14 / 1.6e-16)}', ['C1: E = hf then convert'], aq='E')
M('E', 1, 'Which list is in order of increasing photon energy?', 'Radio, microwave, infrared, visible', ['Visible, infrared, microwave, radio', 'Infrared, radio, visible, microwave', 'Microwave, radio, visible, infrared'], 'Photon energy rises with frequency.')
N('E', 2, 'A photon has an energy of 3.1 eV. Calculate its frequency in units of 10¹⁴ Hz.' + take('e', 'h'), 3.1 * QE / HP, '10¹⁴ Hz',
  f'f = E/h = 3.1 × 1.60 × 10⁻¹⁹ ÷ 6.63 × 10⁻³⁴ = {sf(3.1 * QE / HP)} Hz', ['C1: eV to J then f = E/h'], aq='f')
N('E', 1, 'Thermal radiation from a warm object has photons of about 6.0 × 10⁻²⁰ J each. Convert this photon energy to eV.' + take('e'), 6.0e-20 / QE, 'eV',
  f'E = 6.0 × 10⁻²⁰ ÷ 1.60 × 10⁻¹⁹ = {sf(6e-20 / QE)} eV', [], aq='E')
# medium
N('M', 3, 'A red LED emits light of wavelength 620 nm and just starts to conduct at 2.0 V. Assuming each electron crossing the junction gives one photon, estimate the Planck constant in units of 10⁻³⁴ J s.' + take('e', 'c'), QE * 2.0 * 620e-9 / CL, '10⁻³⁴ J s',
  f'eV = hc/λ, so h = eVλ/c = 1.60 × 10⁻¹⁹ × 2.0 × 620 × 10⁻⁹ ÷ 3.00 × 10⁸ = {sf(QE * 2 * 620e-9 / CL)} J s', ['C1: eV = hc/λ', 'C1: rearranged for h'], aq='h')
N('M', 3, 'Visible light runs from 380 nm to 750 nm. Calculate the photon energy at the red end, 750 nm, in eV.' + take('h', 'c', 'e'), ev_of(750), 'eV',
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (750 × 10⁻⁹ × 1.60 × 10⁻¹⁹) = {sf(ev_of(750))} eV', ['C1: E = hc/λ', 'C1: in eV'], aq='E')
M('M', 3, 'Which graph of photon energy E against wavelength λ is correct?', 'A curve with E falling as λ increases, E ∝ 1/λ', ['A straight line through the origin', 'A horizontal line', 'A curve with E rising as λ increases'], 'E = hc/λ is an inverse proportion.', ['C1: E = hc/λ', 'C1: inverse relationship'])
N('M', 3, 'Electrons in an X-ray tube are accelerated through 30 kV. Calculate the shortest wavelength of the X-rays produced, in units of 10⁻¹¹ m.' + take('h', 'c', 'e'), HC / (30e3 * QE), '10⁻¹¹ m',
  f'E(max) = eV = 1.60 × 10⁻¹⁹ × 30 × 10³ = 4.8 × 10⁻¹⁵ J. λ(min) = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 4.8 × 10⁻¹⁵ = {sf(HC / 4.8e-15)} m',
  ['C1: E = eV', 'C1: λ = hc/E'], aq='λ(min)')
N('M', 3, 'Calculate the wavelength, in nm, of a photon with just enough energy (13.6 eV) to ionise a hydrogen atom.' + take('h', 'c', 'e'), nm_of(13.6), 'nm',
  f'λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (13.6 × 1.60 × 10⁻¹⁹) = {sf(nm_of(13.6) * 1e-9, 4)} m. In nm: {sf(nm_of(13.6) * 1e-9, 4)} × 10⁹ = {sf(nm_of(13.6))}', ['C1: eV to J', 'C1: λ = hc/E'], aq='λ')
N('M', 3, 'Calculate (energy of a microwave photon of 10 GHz) ÷ (energy of a radio photon of 100 MHz).', 10e9 / 100e6, None,
  'E ∝ f, so ratio = 10 × 10⁹ ÷ 100 × 10⁶ = 100', ['C1: E = hf', 'C1: ratio'], sig=2, aq='ratio')
N('M', 4, 'A green laser pointer of power 5.0 mW emits light of wavelength 520 nm. How many photons does it emit per second?' + take('h', 'c'), 5.0e-3 / ephot(520e-9), None,
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 520 × 10⁻⁹ = {sf(ephot(520e-9), 4)} J. n = 5.0 × 10⁻³ ÷ {sf(ephot(520e-9), 4)} = {sf(5e-3 / ephot(520e-9))}',
  ['C1: photon energy', 'C1: mW to W', 'C1: n = P/E'], aq='n')
N('M', 3, 'Cobalt-60 emits gamma photons of energy 1.25 MeV. Calculate this energy in units of 10⁻¹³ J.' + take('e'), 1.25e6 * QE, '10⁻¹³ J',
  'E = 1.25 × 10⁶ × 1.60 × 10⁻¹⁹ = 2.0 × 10⁻¹³ J', ['C1: MeV to eV', 'C1: eV to J'], sig=2, aq='E')
M('M', 3, 'Why can ultraviolet light cause sunburn while far more intense infrared does not?', 'Each ultraviolet photon has enough energy to break chemical bonds in skin; an infrared photon does not', ['Ultraviolet travels faster than infrared', 'Infrared is reflected by skin', 'Ultraviolet carries more total energy'], 'Damage depends on the energy per photon, not the total power.', ['C1: photon energy', 'C1: bond-breaking threshold'])
N('M', 3, 'Breaking a particular chemical bond needs 3.6 eV. What is the longest wavelength of light, in nm, whose photons can break it?' + take('h', 'c', 'e'), nm_of(3.6), 'nm',
  f'λ = hc/E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (3.6 × 1.60 × 10⁻¹⁹) = {sf(nm_of(3.6) * 1e-9, 4)} m. In nm: {sf(nm_of(3.6) * 1e-9, 4)} × 10⁹ = {sf(nm_of(3.6))}', ['C1: E = hc/λ', 'C1: rearranged'], aq='λ')
N('M', 3, 'Calculate (energy of a 200 nm ultraviolet photon) ÷ (energy of a 1000 nm infrared photon).', 1000 / 200, None,
  'E ∝ 1/λ: ratio = 1000 ÷ 200 = 5.0', ['C1: E ∝ 1/λ', 'C1: ratio'], sig=2, aq='ratio')
M('M', 3, 'Two lamps emit the same power, one at 400 nm and one at 800 nm. Which statement is correct?', 'The 800 nm lamp emits twice as many photons per second', ['The 400 nm lamp emits twice as many photons per second', 'They emit the same number of photons per second', 'The 800 nm photons have twice the energy'], 'n = P/E = Pλ/hc, so for equal power the photon rate is proportional to wavelength.', ['C1: E ∝ 1/λ', 'C1: n ∝ λ for equal power'])
N('M', 4, 'Chlorophyll absorbs red light of wavelength 680 nm. Calculate the energy carried by one mole of these photons, in kJ.' + take('h', 'c', 'NA'), NA_ * ephot(680e-9) / 1e3, 'kJ',
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 680 × 10⁻⁹ = {sf(ephot(680e-9), 4)} J. Per mole = 6.02 × 10²³ × {sf(ephot(680e-9), 4)} = {sf(NA_ * ephot(680e-9), 4)} J. In kJ: {sf(NA_ * ephot(680e-9), 4)} ÷ 10³ = {sf(NA_ * ephot(680e-9) / 1e3)}',
  ['C1: photon energy', 'C1: × N_A', 'C1: J to kJ'], aq='E')
N('M', 3, 'Electrons accelerated through 2.5 kV strike a metal target. Calculate the highest frequency of the X-rays produced, in units of 10¹⁷ Hz.' + take('e', 'h'), 2.5e3 * QE / HP, '10¹⁷ Hz',
  f'hf(max) = eV, so f = 1.60 × 10⁻¹⁹ × 2.5 × 10³ ÷ 6.63 × 10⁻³⁴ = {sf(2.5e3 * QE / HP)} Hz', ['C1: hf = eV', 'C1: substitution'], aq='f')
M('M', 3, 'Radiation is called ionising when one photon can remove an electron from an atom. Roughly which photon energies are ionising?', 'Above about 10 eV (far ultraviolet, X-rays and gamma rays)', ['Above about 0.01 eV', 'Only below 1 eV', 'All photons, whatever their energy'], 'Ionisation energies of atoms are typically 5–25 eV.', ['C1: ionisation energy ~10 eV', 'C1: UV/X/gamma'])
N('M', 3, 'How many photons of 1.0 eV together carry the same energy as one photon of 1.0 keV?', 1000, None,
  'N = 1.0 × 10³ ÷ 1.0 = 1000', ['C1: keV to eV', 'C1: ratio'], sig=2, aq='N')
N('M', 3, 'An X-ray photon carries 1.0 × 10⁻¹⁵ J. Calculate its wavelength in units of 10⁻¹¹ m.' + take('h', 'c'), HC / 1.0e-15, '10⁻¹¹ m',
  f'λ = hc/E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 1.0 × 10⁻¹⁵ = {sf(HC / 1e-15)} m', ['C1: λ = hc/E', 'C1: substitution'], aq='λ')
M('M', 3, 'A useful shortcut gives a photon\'s energy in eV as about 1240 divided by its wavelength in nm. Where does 1240 come from?', 'hc/e expressed in eV nm', ['h/e in eV s', 'c/e in m s⁻¹ C⁻¹', 'The wavelength of a 1 eV photon in µm'], 'hc/e = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 1.60 × 10⁻¹⁹ ≈ 1.24 × 10⁻⁶ V m.', ['C1: E = hc/λ', 'C1: units eV nm'])
# hard
N('H', 6, 'A student finds the voltage V at which LEDs of different colours start to emit: λ = 470, 525, 590, 630 nm gives V = 2.64, 2.37, 2.11, 1.97 V. (a) Explain why eV ≈ hc/λ. (b) Plot V against 1/λ and use the first and last points to find the gradient. (c) Calculate h. Give only the answer to (c), in units of 10⁻³⁴ J s.' + take('e', 'c'), QE * (2.64 - 1.97) / (1 / 470e-9 - 1 / 630e-9) / CL, '10⁻³⁴ J s',
  f'(a) Each electron crossing the junction gives up eV as one photon. (b) Gradient = (2.64 − 1.97) ÷ (1/470 × 10⁻⁹ − 1/630 × 10⁻⁹) = 0.67 ÷ {sf(1 / 470e-9 - 1 / 630e-9, 4)} = {sf(0.67 / (1 / 470e-9 - 1 / 630e-9), 4)} V m. (c) h = e × gradient ÷ c = 1.60 × 10⁻¹⁹ × {sf(0.67 / (1 / 470e-9 - 1 / 630e-9), 4)} ÷ 3.00 × 10⁸ = {sf(QE * 0.67 / (1 / 470e-9 - 1 / 630e-9) / CL)} J s',
  ['B1: energy per electron = photon energy', 'C1: 1/λ values', 'C1: gradient = hc/e', 'M1: h = e × gradient / c', 'C1: value'], aq='h')
N('H', 6, 'An X-ray tube works at 40 kV with a beam current of 2.0 mA, and 1.0% of the electrons\' energy becomes X-rays. (a) Calculate the maximum photon energy in keV. (b) Calculate the shortest wavelength. (c) Calculate the X-ray power. Give only the answer to (b), in units of 10⁻¹¹ m.' + take('h', 'c', 'e'), HC / (40e3 * QE), '10⁻¹¹ m',
  f'(a) 40 keV. (b) λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (40 × 10³ × 1.60 × 10⁻¹⁹) = {sf(HC / (40e3 * QE))} m. (c) Input power = 40 × 10³ × 2.0 × 10⁻³ = 80 W; X-ray power = 0.010 × 80 = 0.80 W.',
  ['C1: max energy = eV', 'M1: λ = hc/E', 'C1: value', 'C1: input power VI', 'C1: 1% of it'], aq='λ(min)')
N('H', 5, 'Sunlight of intensity 1000 W m⁻² reaches the ground. Treat it as photons of wavelength 500 nm. (a) Calculate the photon energy. (b) Calculate the number of photons striking 1.0 m² each second. (c) Explain why the real number is larger.' + take('h', 'c'), 1000 / ephot(500e-9), None,
  f'(a) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 500 × 10⁻⁹ = {sf(ephot(500e-9), 4)} J. (b) n = 1000 ÷ {sf(ephot(500e-9), 4)} = {sf(1000 / ephot(500e-9))}. (c) Much of the power is infrared, whose photons carry less energy, so more photons are needed.',
  ['C1: photon energy', 'M1: n = P/E', 'C1: value', 'B1: infrared photons less energetic'], aq='n')
N('H', 5, 'A dark-adapted eye responds when 5 photons of wavelength 510 nm arrive within 0.10 s. (a) Calculate the photon energy. (b) Calculate the energy delivered. (c) Calculate the mean power delivered, in units of 10⁻¹⁷ W.' + take('h', 'c'), 5 * ephot(510e-9) / 0.10, '10⁻¹⁷ W',
  f'(a) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 510 × 10⁻⁹ = {sf(ephot(510e-9), 4)} J. (b) 5 × {sf(ephot(510e-9), 4)} = {sf(5 * ephot(510e-9), 4)} J. (c) P = {sf(5 * ephot(510e-9), 4)} ÷ 0.10 = {sf(5 * ephot(510e-9) / 0.10)} W',
  ['C1: photon energy', 'C1: total energy', 'M1: P = E/t', 'C1: value'], aq='P')
N('H', 6, 'A photomultiplier tube turns each photon of 420 nm light that it detects into a pulse of 1.0 × 10⁶ electrons. It detects 1000 photons per second. (a) Calculate the light power detected. (b) Calculate the mean output current. Give only the answer to (b), in units of 10⁻¹⁰ A.' + take('h', 'c', 'e'), 1000 * 1.0e6 * QE, '10⁻¹⁰ A',
  f'(a) P = 1000 × 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 420 × 10⁻⁹ = {sf(1000 * ephot(420e-9))} W. (b) I = 1000 × 1.0 × 10⁶ × 1.60 × 10⁻¹⁹ = {sf(1000 * 1e6 * QE)} A',
  ['C1: photon energy', 'C1: power', 'M1: charge per second', 'C1: I = ne', 'B1: gain explained'], sig=2, aq='I')
N('H', 5, 'The mean thermal energy of a molecule at 300 K is of order kT. (a) Calculate kT. (b) Calculate the energy of a 500 nm photon. (c) Calculate (photon energy) ÷ kT. Give only the answer to (c).' + take('k', 'h', 'c'), ephot(500e-9) / (KB * 300), None,
  f'(a) kT = 1.38 × 10⁻²³ × 300 = 4.14 × 10⁻²¹ J. (b) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 500 × 10⁻⁹ = {sf(ephot(500e-9), 4)} J. (c) {sf(ephot(500e-9), 4)} ÷ 4.14 × 10⁻²¹ = {sf(ephot(500e-9) / 4.14e-21)}',
  ['C1: kT', 'C1: photon energy', 'M1: ratio', 'C1: value'], aq='ratio')
N('H', 6, 'A radio telescope receives 1.0 × 10⁻¹⁵ W from a hydrogen cloud at the 21 cm line (1.42 GHz). (a) Calculate the photon energy. (b) Calculate the number of photons received per second. (c) Explain why radio astronomers treat the signal as a wave. Give only the answer to (b).' + take('h'), 1.0e-15 / (HP * 1.42e9), None,
  f'(a) E = 6.63 × 10⁻³⁴ × 1.42 × 10⁹ = {sf(HP * 1.42e9, 4)} J. (b) n = 1.0 × 10⁻¹⁵ ÷ {sf(HP * 1.42e9, 4)} = {sf(1e-15 / (HP * 1.42e9))}. (c) About a billion photons arrive each second, each with tiny energy, so the signal is effectively continuous.',
  ['C1: E = hf', 'C1: GHz to Hz', 'M1: n = P/E', 'C1: value', 'B1: huge numbers of tiny quanta'], aq='n')
N('H', 5, 'A gamma camera detects photons of energy 140 keV from technetium-99m. (a) Convert this energy into joules. (b) Calculate the wavelength in units of 10⁻¹² m.' + take('e', 'h', 'c'), HC / (140e3 * QE), '10⁻¹² m',
  f'(a) E = 140 × 10³ × 1.60 × 10⁻¹⁹ = 2.24 × 10⁻¹⁴ J. (b) λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 2.24 × 10⁻¹⁴ = {sf(HC / 2.24e-14)} m',
  ['C1: keV to J', 'M1: λ = hc/E', 'C1: substitution', 'C1: value'], aq='λ')
N('H', 5, 'A blue LED emits 2.0 × 10¹⁷ photons per second of wavelength 450 nm when it takes 25 mA at 3.2 V. (a) Calculate the light power. (b) Calculate the electrical input power. (c) Calculate the efficiency as a percentage.' + take('h', 'c'), 2.0e17 * ephot(450e-9) / (25e-3 * 3.2) * 100, '%',
  f'(a) P = 2.0 × 10¹⁷ × 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 450 × 10⁻⁹ = {sf(2e17 * ephot(450e-9), 4)} W. (b) 25 × 10⁻³ × 3.2 = 0.080 W. (c) {sf(2e17 * ephot(450e-9), 4)} ÷ 0.080 × 100 = {sf(2e17 * ephot(450e-9) / 0.08 * 100)} %',
  ['C1: light power', 'C1: P = VI', 'M1: efficiency ratio', 'C1: value'], aq='efficiency')
N('E', 2, 'A photon of green light has a wavelength of 530 nm. Calculate its frequency in units of 10¹⁴ Hz.' + take('c'), CL / 530e-9, '10¹⁴ Hz',
  f'f = c/λ = 3.00 × 10⁸ ÷ 530 × 10⁻⁹ = {sf(CL / 530e-9)} Hz', ['C1: f = c/λ'], aq='f')

# ═════════════════════════ 28.9 The nature of light: waves or particles? (17/18/9) ═════════════════════════
lesson('28.9')
M('E', 1, 'Which observation is explained by the wave model of light but not by a simple particle model?', 'Interference fringes from two slits', ['The photoelectric effect', 'Line emission spectra', 'Light travelling in straight lines'], 'Fringes need superposition with path differences, a wave property.')
M('E', 1, 'Which observation needs the particle (photon) model of light?', 'Electrons are emitted from a metal at once, but only above a threshold frequency', ['Light is diffracted by a narrow slit', 'Light can be polarised', 'Light is refracted by glass'], 'Threshold behaviour shows energy arrives in quanta hf.')
N('E', 2, 'Light of wavelength 600 nm passes through two slits 0.50 mm apart onto a screen 1.5 m away. Calculate the fringe spacing in mm.', 600e-9 * 1.5 / 0.50e-3 * 1e3, 'mm',
  f'x = λD/a = 600 × 10⁻⁹ × 1.5 ÷ 0.50 × 10⁻³ = {sf(600e-9 * 1.5 / 0.5e-3)} m. In mm: {sf(600e-9 * 1.5 / 0.5e-3, 4)} × 10³ = {sf(600e-9 * 1.5 / 0.5e-3 * 1e3)}', ['C1: x = λD/a'], sig=2, aq='x')
M('E', 1, 'Who first explained the photoelectric effect by treating light as made of quanta?', 'Albert Einstein', ['Isaac Newton', 'Thomas Young', 'James Clerk Maxwell'], 'Einstein proposed light quanta (photons) in 1905.')
N('E', 2, 'A blue photon has a wavelength of 470 nm. Calculate its energy in units of 10⁻¹⁹ J.' + take('h', 'c'), ephot(470e-9), '10⁻¹⁹ J',
  f'E = hc/λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 470 × 10⁻⁹ = {sf(ephot(470e-9))} J', ['C1: E = hc/λ'], aq='E')
M('E', 1, 'What does the polarisation of light show?', 'Light is a transverse wave', ['Light is a longitudinal wave', 'Light is made of charged particles', 'Light has mass'], 'Only transverse waves can be polarised.')
N('E', 2, 'A detector counts 3.0 × 10⁴ photons per second, each of energy 3.3 × 10⁻¹⁹ J. Calculate the power it receives, in units of 10⁻¹⁴ W.', 3.0e4 * 3.3e-19, '10⁻¹⁴ W',
  f'P = nE = 3.0 × 10⁴ × 3.3 × 10⁻¹⁹ = {sf(3e4 * 3.3e-19)} J s⁻¹', ['C1: P = nE'], sig=2, aq='P')
M('E', 1, 'When a two-slit pattern is built up from very dim light, how does each photon arrive at the screen?', 'As a single localised spot', ['As a faint copy of the whole pattern', 'Spread evenly across the screen', 'As two spots, one from each slit'], 'Individual detections are particle-like; the pattern emerges from many of them.')
N('E', 2, 'Two slits 0.50 mm apart give fringes 2.4 mm apart on a screen 2.0 m away. Calculate the wavelength in nm.', 2.4e-3 * 0.50e-3 / 2.0 * 1e9, 'nm',
  f'λ = ax/D = 0.50 × 10⁻³ × 2.4 × 10⁻³ ÷ 2.0 = {sf(0.5e-3 * 2.4e-3 / 2.0, 4)} m. In nm: {sf(0.5e-3 * 2.4e-3 / 2.0, 4)} × 10⁹ = {sf(0.5e-3 * 2.4e-3 / 2.0 * 1e9)}', ['C1: λ = ax/D'], aq='λ')
M('E', 1, 'Which properties do photons have in common with particles?', 'They carry definite amounts of energy and momentum', ['They have rest mass', 'They carry electric charge', 'They travel more slowly than waves'], 'Each photon carries energy E = hf and momentum p = h/λ, like a particle, but it has no rest mass or charge.')
N('E', 2, 'A 1.0 µW beam of light of wavelength 700 nm falls on a detector. How many photons arrive per second?' + take('h', 'c'), 1.0e-6 / ephot(700e-9), None,
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 700 × 10⁻⁹ = {sf(ephot(700e-9), 4)} J. n = 1.0 × 10⁻⁶ ÷ {sf(ephot(700e-9), 4)} = {sf(1e-6 / ephot(700e-9))}', ['C1: n = P/E'], aq='n')
M('E', 1, 'Newton thought light was a stream of corpuscles. Which observation could his model not explain?', 'Interference and diffraction patterns', ['Reflection from a mirror', 'Light travelling in straight lines', 'Shadows'], 'Patterns of bright and dark need waves superposing.')
N('E', 2, 'Light of wavelength 550 nm falls on a grating with 300 lines per mm. Calculate the first-order angle in degrees.', deg_asin(550e-9 * 300e3), '°',
  f'd = 1 ÷ 300 × 10³ = {sf(1 / 300e3, 4)} m. sin θ = 550 × 10⁻⁹ ÷ {sf(1 / 300e3, 4)} = {sf(550e-9 * 300e3, 4)}, θ = sin⁻¹ {sf(550e-9 * 300e3, 4)} = {sf(deg_asin(550e-9 * 300e3))}°', ['C1: d sin θ = λ'], aq='θ')
M('E', 1, 'In the photon picture, what does a bright fringe in a two-slit pattern represent?', 'A place where photons are most likely to arrive', ['A place where photons collide', 'A place photons cannot reach', 'A place where photons slow down'], 'The wave intensity gives the probability of detecting a photon.')
N('E', 2, 'Calculate the momentum of a photon of wavelength 450 nm in units of 10⁻²⁷ kg m s⁻¹.' + take('h'), HP / 450e-9, '10⁻²⁷ kg m s⁻¹',
  f'p = h/λ = 6.63 × 10⁻³⁴ ÷ 450 × 10⁻⁹ = {sf(HP / 450e-9)} kg m s⁻¹', ['C1: p = h/λ'], aq='p')
M('E', 1, 'Which phenomenon does NOT give evidence for the wave nature of light?', 'The photoelectric effect', ['Diffraction', 'Interference', 'Polarisation'], 'Photoelectric emission is explained by photons.')
N('E', 1, 'A photon of visible light has an energy of 2.0 eV. Express this in units of 10⁻¹⁹ J.' + take('e'), 2.0 * QE, '10⁻¹⁹ J',
  'E = 2.0 × 1.60 × 10⁻¹⁹ = 3.2 × 10⁻¹⁹ J', [], sig=2, aq='E')
# medium
N('M', 3, 'In a single-photon two-slit experiment, light of wavelength 633 nm has a power of 1.0 × 10⁻¹³ W. How many photons pass through the apparatus each second?' + take('h', 'c'), 1.0e-13 / ephot(633e-9), None,
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 633 × 10⁻⁹ = {sf(ephot(633e-9), 4)} J. n = 1.0 × 10⁻¹³ ÷ {sf(ephot(633e-9), 4)} = {sf(1e-13 / ephot(633e-9))}', ['C1: photon energy', 'C1: n = P/E'], aq='n')
N('M', 4, 'A beam of 633 nm light of power 1.0 × 10⁻¹³ W carries photons one after another. Calculate the mean time between successive photons, in µs.' + take('h', 'c'), ephot(633e-9) / 1.0e-13 * 1e6, 'µs',
  f'n = 1.0 × 10⁻¹³ ÷ {sf(ephot(633e-9), 4)} = {sf(1e-13 / ephot(633e-9), 4)} s⁻¹. Mean interval = 1 ÷ {sf(1e-13 / ephot(633e-9), 4)} = {sf(ephot(633e-9) / 1e-13, 4)} s. In µs: {sf(ephot(633e-9) / 1e-13, 4)} × 10⁶ = {sf(ephot(633e-9) / 1e-13 * 1e6)}',
  ['C1: photon rate', 'C1: interval = 1/rate', 'C1: s to µs'], aq='t')
M('M', 3, 'In a very dim two-slit experiment only one photon is in the apparatus at a time, yet fringes still form. What does this show?', 'Each photon\'s behaviour is described by a wave passing through both slits, which gives the probability of where it lands', ['Photons interfere with each other', 'The photons split into two halves', 'The slits emit the photons'], 'The wave predicts the pattern; each detection is a single photon.', ['C1: wave gives probability', 'C1: single photon detection'])
N('M', 3, 'Two slits are lit first with blue light (450 nm) and then with red light (650 nm). Calculate (blue fringe spacing) ÷ (red fringe spacing).', 450 / 650, None,
  f'x ∝ λ, so ratio = 450 ÷ 650 = {sf(450 / 650)}', ['C1: x = λD/a', 'C1: same a and D'], aq='ratio')
N('M', 3, 'X-rays of wavelength 0.15 nm fall on a crystal. Treat a row of atoms 0.28 nm apart as a diffraction grating and calculate the first-order angle in degrees.', deg_asin(0.15 / 0.28), '°',
  f'sin θ = λ/d = 0.15 ÷ 0.28 = {sf(0.15 / 0.28, 4)}, so θ = sin⁻¹ {sf(0.15 / 0.28, 4)} = {sf(deg_asin(0.15 / 0.28))}°', ['C1: d sin θ = λ', 'C1: same units'], aq='θ')
M('M', 3, 'A student says the photoelectric effect proves light is only a stream of particles. What is the best reply?', 'Light also shows interference, so both models are needed: they describe different aspects of its behaviour', ['The student is right: the wave model is wrong', 'The photoelectric effect is a wave effect', 'Particles cannot have energy'], 'Wave–particle duality: neither model alone describes all observations.', ['C1: interference evidence', 'C1: both models needed'])
N('M', 3, 'Light from a star of intensity 1.0 × 10⁻¹⁰ W m⁻² and wavelength 550 nm enters an eye through a pupil of diameter 7.0 mm. How many photons enter per second?' + take('h', 'c'), 1.0e-10 * pi * 3.5e-3 ** 2 / ephot(550e-9), None,
  f'A = π × (3.5 × 10⁻³)² = {sf(pi * 3.5e-3 ** 2, 4)} m². P = 1.0 × 10⁻¹⁰ × {sf(pi * 3.5e-3 ** 2, 4)} = {sf(1e-10 * pi * 3.5e-3 ** 2, 4)} W. n = {sf(1e-10 * pi * 3.5e-3 ** 2, 4)} ÷ {sf(ephot(550e-9), 4)} = {sf(1e-10 * pi * 3.5e-3 ** 2 / ephot(550e-9))}',
  ['C1: pupil area', 'C1: n = P/E'], aq='n')
N('M', 4, 'A 60 W lamp gives out 3.0 W of visible light, treated as photons of 560 nm, equally in all directions. How many photons pass through each square metre per second at 2.0 m from the lamp?' + take('h', 'c'), 3.0 / ephot(560e-9) / (4 * pi * 2.0 ** 2), None,
  f'n = 3.0 ÷ {sf(ephot(560e-9), 4)} = {sf(3.0 / ephot(560e-9), 4)} s⁻¹. Area = 4π × 2.0² = {sf(4 * pi * 4, 4)} m². Flux = {sf(3.0 / ephot(560e-9), 4)} ÷ {sf(4 * pi * 4, 4)} = {sf(3.0 / ephot(560e-9) / (4 * pi * 4))}',
  ['C1: photon rate', 'C1: sphere area 4πr²', 'C1: flux'], aq='flux')
M('M', 3, 'In the wave model the intensity of light is proportional to amplitude². What corresponds to intensity in the photon model?', 'The number of photons per second per unit area, times the photon energy', ['The energy of a single photon', 'The speed of the photons', 'The wavelength of the photons'], 'I = (photon flux) × hf.', ['C1: photon flux', 'C1: × hf'])
N('M', 3, 'A photographic grain needs 1.0 × 10⁻¹² J of 450 nm light to darken. How many photons is that?' + take('h', 'c'), 1.0e-12 / ephot(450e-9), None,
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 450 × 10⁻⁹ = {sf(ephot(450e-9), 4)} J. N = 1.0 × 10⁻¹² ÷ {sf(ephot(450e-9), 4)} = {sf(1e-12 / ephot(450e-9))}', ['C1: photon energy', 'C1: N = E(total)/E'], aq='N')
M('M', 3, 'Maxwell\'s theory predicted waves of electric and magnetic fields travelling at 3.0 × 10⁸ m s⁻¹. Why was this important for the nature of light?', 'It matched the measured speed of light, showing light is an electromagnetic wave', ['It proved light is made of particles', 'It showed light needs a medium', 'It showed light has mass'], 'The predicted speed equalled c, uniting optics and electromagnetism.', ['C1: predicted speed = c', 'C1: light is an EM wave'])
N('M', 3, 'Ten fringe spacings measure 12.0 mm on a screen 0.80 m from two slits 0.40 mm apart. Calculate the wavelength in nm.', 1.2e-3 * 0.40e-3 / 0.80 * 1e9, 'nm',
  f'x = 12.0 ÷ 10 = 1.2 mm. λ = ax/D = 0.40 × 10⁻³ × 1.2 × 10⁻³ ÷ 0.80 = {sf(0.4e-3 * 1.2e-3 / 0.8, 4)} m. In nm: {sf(0.4e-3 * 1.2e-3 / 0.8, 4)} × 10⁹ = {sf(0.4e-3 * 1.2e-3 / 0.8 * 1e9)}', ['C1: one fringe spacing', 'C1: λ = ax/D'], aq='λ')
N('M', 4, 'A very weak 500 nm beam has a power of 1.0 × 10⁻¹⁵ W. Calculate the average distance between successive photons along the beam, in km.' + take('h', 'c'), CL / (1.0e-15 / ephot(500e-9)) / 1e3, 'km',
  f'n = 1.0 × 10⁻¹⁵ ÷ {sf(ephot(500e-9), 4)} = {sf(1e-15 / ephot(500e-9), 4)} s⁻¹. Spacing = c/n = 3.00 × 10⁸ ÷ {sf(1e-15 / ephot(500e-9), 4)} = {sf(CL / (1e-15 / ephot(500e-9)), 4)} m. In km: {sf(CL / (1e-15 / ephot(500e-9)), 4)} ÷ 10³ = {sf(CL / (1e-15 / ephot(500e-9)) / 1e3)}',
  ['C1: photon rate', 'C1: spacing = c ÷ rate', 'C1: m to km'], aq='spacing')
M('M', 3, 'When X-rays scatter from electrons, their wavelength increases. Which model explains this best?', 'Photons colliding with electrons and transferring momentum and energy', ['Waves reflecting from a mirror', 'Waves diffracting around atoms', 'Photons gaining energy from the electrons'], 'This is Compton scattering: a particle-like collision.', ['C1: photon momentum', 'C1: energy lost so λ increases'])
N('M', 3, 'At what speed would an electron have the same wavelength as 550 nm light?' + take('h', 'me'), HP / (ME * 550e-9), 'm s⁻¹',
  f'v = h/mλ = 6.63 × 10⁻³⁴ ÷ (9.11 × 10⁻³¹ × 550 × 10⁻⁹) = {sf(HP / (ME * 550e-9))} m s⁻¹', ['C1: λ = h/mv', 'C1: rearranged'], aq='v')
M('M', 3, 'Which statement best summarises the modern view of light?', 'Light travels as a wave but exchanges energy in photons', ['Light is only a wave', 'Light is only a stream of particles', 'Light is a wave in air but particles in a vacuum'], 'Propagation is wave-like; emission and absorption are quantised.', ['C1: wave propagation', 'C1: quantised interaction'])
N('M', 3, 'The second-order image of a 546 nm mercury line is at 40.0° for a grating. Calculate the number of lines per mm on the grating.', sin(radians(40)) / (2 * 546e-9) / 1e3, None,
  f'd = 2 × 546 × 10⁻⁹ ÷ sin 40.0° = {sf(2 * 546e-9 / sin(radians(40)), 4)} m. Lines per mm = 1 ÷ ({sf(2 * 546e-9 / sin(radians(40)), 4)} × 10³) = {sf(sin(radians(40)) / (2 * 546e-9) / 1e3)}',
  ['C1: d = nλ/sin θ', 'C1: lines per mm'], aq='N')
M('M', 3, 'A photon passes through a two-slit apparatus. When does it behave most like a particle?', 'When it is detected at the screen', ['While it travels between the slits', 'When it passes through the slits', 'It behaves as a particle throughout'], 'Detection and absorption are localised events.', ['C1: detection localised', 'C1: travel described by wave'])
# hard
N('H', 5, 'In a version of Taylor\'s experiment, a two-slit pattern is photographed with light of 550 nm and power 2.0 × 10⁻¹³ W. (a) Calculate the number of photons per second. (b) The apparatus is 1.5 m long. Calculate the mean number of photons inside it at any instant. (c) Comment on the result. Give only the answer to (b).' + take('h', 'c'), 2.0e-13 / ephot(550e-9) * 1.5 / CL, None,
  f'(a) n = 2.0 × 10⁻¹³ ÷ {sf(ephot(550e-9), 4)} = {sf(2e-13 / ephot(550e-9), 4)} s⁻¹. (b) Transit time = 1.5 ÷ 3.00 × 10⁸ = 5.0 × 10⁻⁹ s; number = {sf(2e-13 / ephot(550e-9), 4)} × 5.0 × 10⁻⁹ = {sf(2e-13 / ephot(550e-9) * 5e-9)}. (c) Far fewer than one, so photons pass one at a time, yet fringes form.',
  ['C1: photon rate', 'C1: transit time', 'M1: number = rate × time', 'B1: less than one photon at a time'], aq='N')
N('H', 6, 'A two-slit pattern of 633 nm light builds up on a detector that records 3.0 × 10⁵ photons per second. A clear pattern needs about 1.0 × 10⁶ photons. (a) Calculate the light power reaching the detector. (b) Calculate the time needed for a clear pattern. Give only the answer to (a), in units of 10⁻¹⁴ W.' + take('h', 'c'), 3.0e5 * ephot(633e-9), '10⁻¹⁴ W',
  f'(a) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 633 × 10⁻⁹ = {sf(ephot(633e-9), 4)} J; P = 3.0 × 10⁵ × {sf(ephot(633e-9), 4)} = {sf(3e5 * ephot(633e-9))} W. (b) t = 1.0 × 10⁶ ÷ 3.0 × 10⁵ = 3.3 s',
  ['C1: photon energy', 'M1: P = nE', 'C1: value', 'C1: t = N/n', 'B1: pattern builds statistically'], aq='P')
N('H', 5, 'A 1.0 mW helium–neon laser (632.8 nm) has a beam of diameter 1.0 mm. (a) Calculate the intensity. (b) Calculate the photon energy. (c) Calculate the number of photons crossing each square metre of the beam per second.' + take('h', 'c'), 1.0e-3 / (pi * 0.5e-3 ** 2) / ephot(632.8e-9), None,
  f'(a) I = 1.0 × 10⁻³ ÷ (π × (0.50 × 10⁻³)²) = {sf(1e-3 / (pi * 0.25e-6), 4)} W m⁻². (b) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 632.8 × 10⁻⁹ = {sf(ephot(632.8e-9), 4)} J. (c) {sf(1e-3 / (pi * 0.25e-6), 4)} ÷ {sf(ephot(632.8e-9), 4)} = {sf(1e-3 / (pi * 0.25e-6) / ephot(632.8e-9))}',
  ['C1: beam area', 'C1: intensity', 'C1: photon energy', 'M1: flux = I/E'], aq='flux')
N('H', 6, 'Light of intensity 2.0 × 10⁻⁴ W m⁻² falls on a metal of work function 2.0 eV. In a wave model, each electron can absorb energy only through an area of 1.0 × 10⁻²⁰ m². (a) Calculate the power absorbed by one electron. (b) Calculate the time it would need to gain 2.0 eV. (c) Contrast this with what is observed. Give only the answer to (b), in s.' + take('e'), 2.0 * QE / (2.0e-4 * 1.0e-20), 's',
  f'(a) P = 2.0 × 10⁻⁴ × 1.0 × 10⁻²⁰ = 2.0 × 10⁻²⁴ W. (b) t = 2.0 × 1.60 × 10⁻¹⁹ ÷ 2.0 × 10⁻²⁴ = {sf(2 * QE / 2e-24)} s. (c) Emission is observed within nanoseconds, so energy must arrive in photons.',
  ['C1: P = IA', 'C1: eV to J', 'M1: t = E/P', 'C1: value', 'B1: no delay observed'], aq='t')
N('H', 5, 'X-rays scattered by a crystal whose atomic rows are 0.30 nm apart give a first-order maximum at 14.5°. Treat the rows as a grating. (a) Calculate the wavelength. (b) Calculate the photon energy in keV.' + take('h', 'c', 'e'), HC / (0.30e-9 * sin(radians(14.5))) / QE / 1e3, 'keV',
  f'(a) λ = d sin θ = 0.30 × 10⁻⁹ × sin 14.5° = {sf(0.3e-9 * sin(radians(14.5)), 4)} m. (b) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ {sf(0.3e-9 * sin(radians(14.5)), 4)} = {sf(HC / (0.3e-9 * sin(radians(14.5))), 4)} J. In keV: {sf(HC / (0.3e-9 * sin(radians(14.5))), 4)} ÷ 1.60 × 10⁻¹⁶ = {sf(HC / (0.3e-9 * sin(radians(14.5))) / 1.6e-16)}',
  ['C1: λ = d sin θ', 'C1: photon energy', 'M1: J to keV', 'C1: value'], aq='E')
N('H', 6, 'Two slits 0.30 mm apart give fringes 2.1 mm apart on a screen 1.2 m away. (a) Calculate the wavelength. (b) Calculate the photon energy in eV. (c) Calculate the number of photons per second in a 0.20 mW beam. Give only the answer to (b).' + take('h', 'c', 'e'), HC / (0.30e-3 * 2.1e-3 / 1.2) / QE, 'eV',
  f'(a) λ = ax/D = 0.30 × 10⁻³ × 2.1 × 10⁻³ ÷ 1.2 = {sf(0.3e-3 * 2.1e-3 / 1.2, 4)} m. (b) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ ({sf(0.3e-3 * 2.1e-3 / 1.2, 4)} × 1.60 × 10⁻¹⁹) = {sf(HC / (0.3e-3 * 2.1e-3 / 1.2) / QE)} eV. (c) n = 0.20 × 10⁻³ ÷ (E in J) ≈ {sf(0.2e-3 / (HC / (0.3e-3 * 2.1e-3 / 1.2)), 3)} s⁻¹',
  ['C1: λ = ax/D', 'C1: photon energy in J', 'M1: in eV', 'C1: value', 'C1: photon rate'], aq='E')
N('H', 5, 'Sunlight at Mars has an intensity of 590 W m⁻². Treat it as photons of mean wavelength 550 nm. (a) Calculate the photon energy. (b) Calculate the number of photons arriving on each square metre per second.' + take('h', 'c'), 590 / ephot(550e-9), None,
  f'(a) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 550 × 10⁻⁹ = {sf(ephot(550e-9), 4)} J. (b) n = 590 ÷ {sf(ephot(550e-9), 4)} = {sf(590 / ephot(550e-9))}',
  ['C1: photon energy', 'M1: n = I/E', 'C1: value', 'B1: per m² per s'], aq='n')
N('H', 6, 'A grating with 600 lines per mm shows the sodium line in the second order at 45.0°. (a) Calculate the wavelength in nm. (b) Calculate the photon energy in eV. (c) Calculate the photon momentum. Give only the answer to (a).' + take('h', 'c', 'e'), sin(radians(45)) / 600e3 / 2 * 1e9, 'nm',
  f'(a) d = 1 ÷ 600 × 10³ = {sf(1 / 600e3, 4)} m; λ = {sf(1 / 600e3, 4)} × sin 45.0° ÷ 2 = {sf(sin(radians(45)) / 600e3 / 2, 4)} m. In nm: {sf(sin(radians(45)) / 600e3 / 2, 4)} × 10⁹ = {sf(sin(radians(45)) / 600e3 / 2 * 1e9)}. (b) ≈ 2.11 eV. (c) p = h/λ ≈ 1.13 × 10⁻²⁷ kg m s⁻¹',
  ['C1: d', 'M1: nλ = d sin θ', 'C1: value', 'C1: photon energy', 'C1: photon momentum'], aq='λ')
N('H', 5, 'A faint star gives an intensity of 1.0 × 10⁻¹¹ W m⁻² of light of wavelength 550 nm at the Earth. (a) Calculate the power entering a pupil of diameter 6.0 mm. (b) Calculate the number of photons entering per second.' + take('h', 'c'), 1.0e-11 * pi * 3.0e-3 ** 2 / ephot(550e-9), None,
  f'(a) P = 1.0 × 10⁻¹¹ × π × (3.0 × 10⁻³)² = {sf(1e-11 * pi * 9e-6, 4)} W. (b) n = {sf(1e-11 * pi * 9e-6, 4)} ÷ {sf(ephot(550e-9), 4)} = {sf(1e-11 * pi * 9e-6 / ephot(550e-9))}',
  ['C1: pupil area', 'C1: power', 'M1: n = P/E', 'C1: value'], aq='n')

# ═════════════════════════ 28.10 Wave–particle duality (17/17/8) ═════════════════════════
lesson('28.10')
N('E', 2, 'An electron has a momentum of 2.0 × 10⁻²⁴ kg m s⁻¹. Calculate its de Broglie wavelength in units of 10⁻¹⁰ m.' + take('h'), HP / 2.0e-24, '10⁻¹⁰ m',
  f'λ = h/p = 6.63 × 10⁻³⁴ ÷ 2.0 × 10⁻²⁴ = {sf(HP / 2e-24)} m', ['C1: λ = h/p'], aq='λ')
M('E', 1, 'Which equation gives the de Broglie wavelength λ of a particle of momentum p?', 'λ = h/p', ['λ = hp', 'λ = p/h', 'λ = hc/p'], 'de Broglie proposed λ = h/p for all particles.')
N('E', 2, 'A 0.15 kg cricket ball is bowled at 40 m s⁻¹. Calculate its de Broglie wavelength in units of 10⁻³⁴ m.' + take('h'), HP / (0.15 * 40), '10⁻³⁴ m',
  f'λ = h/mv = 6.63 × 10⁻³⁴ ÷ (0.15 × 40) = {sf(HP / 6.0)} m', ['C1: λ = h/mv'], aq='λ')
M('E', 1, 'Who first suggested that particles such as electrons have a wavelength?', 'Louis de Broglie', ['Albert Einstein', 'Max Planck', 'Niels Bohr'], 'de Broglie extended wave–particle duality from light to matter in 1924.')
N('E', 2, 'An electron moves at 3.0 × 10⁶ m s⁻¹. Calculate its de Broglie wavelength in nm.' + take('h', 'me'), HP / (ME * 3.0e6) * 1e9, 'nm',
  f'λ = 6.63 × 10⁻³⁴ ÷ (9.11 × 10⁻³¹ × 3.0 × 10⁶) = {sf(HP / (ME * 3e6), 4)} m. In nm: {sf(HP / (ME * 3e6), 4)} × 10⁹ = {sf(HP / (ME * 3e6) * 1e9)}', ['C1: λ = h/mv'], aq='λ')
M('E', 1, 'Which experiment first confirmed that electrons diffract?', 'Scattering electrons from a nickel crystal (Davisson and Germer)', ['Millikan\'s oil-drop experiment', 'Rutherford\'s gold-foil experiment', 'Young\'s double-slit experiment with light'], 'Electrons gave diffraction maxima like X-rays.')
N('E', 2, 'A particle has a de Broglie wavelength of 0.050 nm. Calculate its momentum in units of 10⁻²³ kg m s⁻¹.' + take('h'), HP / 0.050e-9, '10⁻²³ kg m s⁻¹',
  f'p = h/λ = 6.63 × 10⁻³⁴ ÷ 0.050 × 10⁻⁹ = {sf(HP / 0.05e-9)} kg m s⁻¹', ['C1: p = h/λ'], aq='p')
M('E', 1, 'The speed of an electron is doubled (well below the speed of light). What happens to its de Broglie wavelength?', 'It halves', ['It doubles', 'It is unchanged', 'It quarters'], 'λ = h/mv, so the wavelength is inversely proportional to the speed and halves.')
N('E', 2, 'Protons leave an accelerator at 1.0 × 10⁶ m s⁻¹. What is the de Broglie wavelength of each proton, in units of 10⁻¹³ m?' + take('h', 'mp'), HP / (MP * 1.0e6), '10⁻¹³ m',
  f'λ = 6.63 × 10⁻³⁴ ÷ (1.67 × 10⁻²⁷ × 1.0 × 10⁶) = {sf(HP / (MP * 1e6))} m', ['C1: λ = h/mv'], aq='λ')
M('E', 1, 'An electron, a proton and an α-particle all move at the same speed. Which has the longest de Broglie wavelength?', 'The electron', ['The proton', 'The α-particle', 'They are all equal'], 'λ = h/mv: the smallest mass gives the longest λ.')
N('E', 2, 'An electron has a de Broglie wavelength of 0.50 nm. Calculate its speed.' + take('h', 'me'), HP / (ME * 0.50e-9), 'm s⁻¹',
  f'v = h/mλ = 6.63 × 10⁻³⁴ ÷ (9.11 × 10⁻³¹ × 0.50 × 10⁻⁹) = {sf(HP / (ME * 0.5e-9))} m s⁻¹', ['C1: v = h/mλ'], aq='v')
M('E', 1, 'In an electron diffraction tube, what acts as the "grating"?', 'The regular layers of atoms in a thin graphite film', ['The phosphor screen', 'The electron gun', 'The glass of the tube'], 'Atomic spacings are similar to the electrons\' wavelength.')
N('E', 2, 'An electron has 1.0 × 10⁻¹⁷ J of kinetic energy. Calculate its momentum in units of 10⁻²⁴ kg m s⁻¹.' + take('me'), sqrt(2 * ME * 1.0e-17), '10⁻²⁴ kg m s⁻¹',
  f'p = √(2mEk) = √(2 × 9.11 × 10⁻³¹ × 1.0 × 10⁻¹⁷) = {sf(sqrt(2 * ME * 1e-17))} kg m s⁻¹', ['C1: p = √(2mEk)'], aq='p')
M('E', 1, 'The accelerating voltage in an electron diffraction tube is increased. What happens to the electrons\' de Broglie wavelength?', 'It decreases', ['It increases', 'It stays the same', 'It becomes zero'], 'Faster electrons have more momentum, so λ = h/p is smaller.')
N('E', 2, 'Electrons have a kinetic energy of 200 eV. Calculate their de Broglie wavelength in units of 10⁻¹¹ m.' + take('h', 'me', 'e'), lam_e(200), '10⁻¹¹ m',
  f'Ek = 200 × 1.60 × 10⁻¹⁹ = 3.2 × 10⁻¹⁷ J. p = √(2 × 9.11 × 10⁻³¹ × 3.2 × 10⁻¹⁷) = {sf(sqrt(2 * ME * 3.2e-17), 4)} kg m s⁻¹. λ = 6.63 × 10⁻³⁴ ÷ {sf(sqrt(2 * ME * 3.2e-17), 4)} = {sf(lam_e(200))} m', ['C1: p from Ek, then λ = h/p'], aq='λ')
M('E', 1, 'Which effect shows that electrons have wave properties?', 'Diffraction', ['Deflection by a magnetic field', 'Ionisation of gases', 'Producing heat when they strike a target'], 'Diffraction is a wave effect.')
N('E', 1, 'A particle moving at 4.0 × 10⁵ m s⁻¹ has a de Broglie wavelength of 1.0 × 10⁻¹² m. Calculate its mass in units of 10⁻²⁷ kg.' + take('h'), HP / (1.0e-12 * 4.0e5), '10⁻²⁷ kg',
  f'm = h/λv = 6.63 × 10⁻³⁴ ÷ (1.0 × 10⁻¹² × 4.0 × 10⁵) = {sf(HP / 4e-7)} kg', [], aq='m')
# medium
N('M', 3, 'Electrons in a diffraction tube are accelerated through 3.0 kV. Calculate their de Broglie wavelength in units of 10⁻¹¹ m.' + take('h', 'me', 'e'), lam_e(3.0e3), '10⁻¹¹ m',
  f'Ek = 1.60 × 10⁻¹⁹ × 3.0 × 10³ = 4.8 × 10⁻¹⁶ J. p = √(2 × 9.11 × 10⁻³¹ × 4.8 × 10⁻¹⁶) = {sf(sqrt(2 * ME * 4.8e-16), 4)} kg m s⁻¹. λ = 6.63 × 10⁻³⁴ ÷ {sf(sqrt(2 * ME * 4.8e-16), 4)} = {sf(lam_e(3e3))} m',
  ['C1: Ek = eV', 'C1: p = √(2mEk)'], aq='λ')
N('M', 4, 'In an electron diffraction tube a ring has a radius of 2.0 cm when the accelerating voltage is 2.0 kV. Taking the ring radius to be proportional to the wavelength, calculate the radius at 4.5 kV, in cm.', 2.0 * sqrt(2.0 / 4.5), 'cm',
  f'λ ∝ 1/√V, so r = 2.0 × √(2.0 ÷ 4.5) = {sf(2.0 * sqrt(2.0 / 4.5))} cm', ['M1: λ ∝ 1/√V', 'C1: r ∝ λ', 'C1: substitution'], aq='r')
M('M', 3, 'For electrons accelerated from rest through a p.d. V, how does the de Broglie wavelength depend on V?', 'λ ∝ 1/√V', ['λ ∝ 1/V', 'λ ∝ √V', 'λ ∝ V'], 'eV = p²/2m so p ∝ √V and λ = h/p ∝ 1/√V.', ['C1: p = √(2meV)', 'C1: λ ∝ 1/√V'])
N('M', 3, 'A slow neutron (mass 1.67 × 10⁻²⁷ kg) has a kinetic energy of 0.025 eV. Calculate its de Broglie wavelength in nm.' + take('h', 'e'), HP / sqrt(2 * 1.67e-27 * 0.025 * QE) * 1e9, 'nm',
  f'Ek = 0.025 × 1.60 × 10⁻¹⁹ = 4.0 × 10⁻²¹ J. p = √(2 × 1.67 × 10⁻²⁷ × 4.0 × 10⁻²¹) = {sf(sqrt(2 * 1.67e-27 * 4e-21), 4)} kg m s⁻¹. λ = 6.63 × 10⁻³⁴ ÷ {sf(sqrt(2 * 1.67e-27 * 4e-21), 4)} = {sf(HP / sqrt(2 * 1.67e-27 * 4e-21), 4)} m. In nm: {sf(HP / sqrt(2 * 1.67e-27 * 4e-21), 4)} × 10⁹ = {sf(HP / sqrt(2 * 1.67e-27 * 4e-21) * 1e9)}',
  ['C1: eV to J', 'C1: p = √(2mEk)'], aq='λ')
N('M', 3, 'Through what potential difference must electrons be accelerated from rest to have a de Broglie wavelength of 0.10 nm?' + take('h', 'me', 'e'), HP ** 2 / (2 * ME * QE * 0.10e-9 ** 2), 'V',
  f'p = 6.63 × 10⁻³⁴ ÷ 0.10 × 10⁻⁹ = 6.63 × 10⁻²⁴ kg m s⁻¹. V = p²/(2me) = (6.63 × 10⁻²⁴)² ÷ (2 × 9.11 × 10⁻³¹ × 1.60 × 10⁻¹⁹) = {sf(HP ** 2 / (2 * ME * QE * 1e-20))} V',
  ['C1: p = h/λ', 'C1: eV = p²/2m'], aq='V')
M('M', 3, 'An electron and a proton have the same kinetic energy. Which has the longer de Broglie wavelength?', 'The electron', ['The proton', 'They are equal', 'It depends on their charges'], 'p = √(2mEk) is smaller for the smaller mass, so λ = h/p is longer.', ['C1: p = √(2mEk)', 'C1: smaller m gives longer λ'])
N('M', 3, 'An electron and a proton move at the same speed. Calculate (wavelength of the electron) ÷ (wavelength of the proton).' + take('me', 'mp'), MP / ME, None,
  f'λ ∝ 1/m at equal v: ratio = 1.67 × 10⁻²⁷ ÷ 9.11 × 10⁻³¹ = {sf(MP / ME)}', ['C1: λ = h/mv', 'C1: ratio of masses'], aq='ratio')
N('M', 4, 'An electron and a proton have equal kinetic energies. Calculate (wavelength of the electron) ÷ (wavelength of the proton).' + take('me', 'mp'), sqrt(MP / ME), None,
  f'λ = h/√(2mEk) ∝ 1/√m: ratio = √(1.67 × 10⁻²⁷ ÷ 9.11 × 10⁻³¹) = {sf(sqrt(MP / ME))}', ['C1: p = √(2mEk)', 'M1: λ ∝ 1/√m', 'C1: value'], aq='ratio')
M('M', 3, 'Why are electron beams, rather than visible light, used to study the arrangement of atoms in crystals?', 'Their de Broglie wavelength can be made similar to the atomic spacing', ['Electrons travel faster than light', 'Electrons are not absorbed by crystals', 'Light cannot pass through crystals at all'], 'Diffraction needs λ comparable to the spacing, about 10⁻¹⁰ m.', ['C1: λ ~ atomic spacing', 'C1: visible λ far too long'])
N('M', 4, 'An electron microscope accelerates electrons through 50 kV. Ignoring relativity, calculate their de Broglie wavelength in units of 10⁻¹² m.' + take('h', 'me', 'e'), lam_e(50e3), '10⁻¹² m',
  f'Ek = 1.60 × 10⁻¹⁹ × 50 × 10³ = 8.0 × 10⁻¹⁵ J. p = √(2 × 9.11 × 10⁻³¹ × 8.0 × 10⁻¹⁵) = {sf(sqrt(2 * ME * 8e-15), 4)} kg m s⁻¹. λ = 6.63 × 10⁻³⁴ ÷ {sf(sqrt(2 * ME * 8e-15), 4)} = {sf(lam_e(50e3))} m',
  ['C1: Ek = eV', 'C1: p = √(2mEk)', 'C1: λ = h/p'], aq='λ')
M('M', 3, 'In an electron diffraction pattern, what do the bright rings show?', 'Directions in which electron waves from many atoms interfere constructively', ['Places where electrons have been stopped by atoms', 'The paths of individual electrons', 'X-rays produced in the graphite'], 'Bright rings are diffraction maxima: high probability of detecting electrons.', ['C1: constructive interference', 'C1: probability of arrival'])
N('M', 3, 'A neutron (mass 1.67 × 10⁻²⁷ kg) has a de Broglie wavelength of 0.20 nm. Calculate its speed.' + take('h'), HP / (1.67e-27 * 0.20e-9), 'm s⁻¹',
  f'v = h/mλ = 6.63 × 10⁻³⁴ ÷ (1.67 × 10⁻²⁷ × 0.20 × 10⁻⁹) = {sf(HP / (1.67e-27 * 0.2e-9))} m s⁻¹', ['C1: λ = h/mv', 'C1: rearranged'], aq='v')
N('M', 3, 'A speck of dust of mass 1.0 × 10⁻¹⁵ kg drifts at 1.0 mm s⁻¹. Calculate its de Broglie wavelength in units of 10⁻¹⁶ m.' + take('h'), HP / (1.0e-15 * 1.0e-3), '10⁻¹⁶ m',
  f'λ = 6.63 × 10⁻³⁴ ÷ (1.0 × 10⁻¹⁵ × 1.0 × 10⁻³) = {sf(HP / 1e-18)} m', ['C1: mm s⁻¹ to m s⁻¹', 'C1: λ = h/mv'], aq='λ')
M('M', 3, 'The kinetic energy of an electron is doubled (non-relativistic). By what factor does its de Broglie wavelength change?', '1/√2', ['1/2', '√2', '2'], 'p = √(2mEk) ∝ √Ek, so λ ∝ 1/√Ek.', ['C1: p ∝ √Ek', 'C1: λ ∝ 1/√Ek'])
N('M', 3, 'Calculate the kinetic energy, in eV, of an electron whose de Broglie wavelength is 1.0 nm.' + take('h', 'me', 'e'), (HP / 1.0e-9) ** 2 / (2 * ME) / QE, 'eV',
  f'p = 6.63 × 10⁻³⁴ ÷ 1.0 × 10⁻⁹ = 6.63 × 10⁻²⁵ kg m s⁻¹. Ek = (6.63 × 10⁻²⁵)² ÷ (2 × 9.11 × 10⁻³¹) = {sf((6.63e-25) ** 2 / (2 * ME), 4)} J. In eV: {sf((6.63e-25) ** 2 / (2 * ME), 4)} ÷ 1.60 × 10⁻¹⁹ = {sf((6.63e-25) ** 2 / (2 * ME) / QE)} eV',
  ['C1: p = h/λ', 'C1: Ek = p²/2m'], aq='Ek')
M('M', 3, 'A single electron is fired at two narrow slits. Which describes where it is detected?', 'At one point, with a probability given by the electron wave\'s interference pattern', ['Always directly behind one slit', 'Spread over the whole screen at once', 'At two points, one behind each slit'], 'Detection is particle-like; the probability pattern is wave-like.', ['C1: single detection point', 'C1: probability from wave'])
N('M', 4, 'Rows of atoms in a crystal are 2.1 × 10⁻¹⁰ m apart. Electrons of de Broglie wavelength 3.0 × 10⁻¹¹ m are diffracted by them. Treating the rows as a grating, calculate the first-order diffraction angle in degrees.', deg_asin(3.0e-11 / 2.1e-10), '°',
  f'sin θ = λ/d = 3.0 × 10⁻¹¹ ÷ 2.1 × 10⁻¹⁰ = {sf(3e-11 / 2.1e-10, 4)}, θ = sin⁻¹ {sf(3e-11 / 2.1e-10, 4)} = {sf(deg_asin(3e-11 / 2.1e-10))}°',
  ['C1: d sin θ = λ', 'C1: ratio', 'C1: angle'], aq='θ')
# hard
N('H', 6, 'In an electron diffraction tube, electrons are accelerated through 4.0 kV onto graphite whose atomic rows are 2.13 × 10⁻¹⁰ m apart. The screen is 0.14 m beyond the graphite. Treat the rows as a grating and the ring radius as r = L tan θ. (a) Calculate the de Broglie wavelength. (b) Calculate θ. (c) Calculate the ring radius in mm. Give only the answer to (c).' + take('h', 'me', 'e'), 0.14 * tan(asin(lam_e(4e3) / 2.13e-10)) * 1e3, 'mm',
  f'(a) p = √(2 × 9.11 × 10⁻³¹ × 1.60 × 10⁻¹⁹ × 4.0 × 10³) = {sf(sqrt(2 * ME * QE * 4e3), 4)} kg m s⁻¹, λ = 6.63 × 10⁻³⁴ ÷ {sf(sqrt(2 * ME * QE * 4e3), 4)} = {sf(lam_e(4e3), 4)} m. (b) θ = sin⁻¹ ({sf(lam_e(4e3), 4)} ÷ 2.13 × 10⁻¹⁰) = {sf(deg_asin(lam_e(4e3) / 2.13e-10), 4)}°. (c) r = 0.14 × tan {sf(deg_asin(lam_e(4e3) / 2.13e-10), 4)}° = {sf(0.14 * tan(asin(lam_e(4e3) / 2.13e-10)), 4)} m. In mm: {sf(0.14 * tan(asin(lam_e(4e3) / 2.13e-10)), 4)} × 10³ = {sf(0.14 * tan(asin(lam_e(4e3) / 2.13e-10)) * 1e3)}',
  ['C1: Ek = eV', 'C1: λ = h/p', 'C1: sin θ = λ/d', 'M1: r = L tan θ', 'C1: value', 'B1: m to mm'], aq='r')
N('H', 6, 'In the Davisson–Germer experiment, electrons of energy 54 eV were scattered by nickel, giving a maximum at 50° from atomic rows 2.15 × 10⁻¹⁰ m apart. (a) Calculate the de Broglie wavelength of the electrons. (b) Calculate the wavelength from d sin θ = λ. (c) Calculate the percentage difference. Give only the answer to (a), in units of 10⁻¹⁰ m.' + take('h', 'me', 'e'), lam_e(54), '10⁻¹⁰ m',
  f'(a) p = √(2 × 9.11 × 10⁻³¹ × 54 × 1.60 × 10⁻¹⁹) = {sf(sqrt(2 * ME * 54 * QE), 4)} kg m s⁻¹, λ = 6.63 × 10⁻³⁴ ÷ {sf(sqrt(2 * ME * 54 * QE), 4)} = {sf(lam_e(54))} m. (b) 2.15 × 10⁻¹⁰ × sin 50° = {sf(2.15e-10 * sin(radians(50)))} m. (c) About {sf(abs(lam_e(54) - 2.15e-10 * sin(radians(50))) / lam_e(54) * 100, 2)} %.',
  ['C1: Ek in J', 'C1: p = √(2mEk)', 'C1: λ = h/p', 'C1: d sin θ', 'B1: close agreement'], aq='λ')
N('H', 5, 'Neutrons in equilibrium with a moderator at 300 K have a mean kinetic energy of (3/2)kT. A neutron has mass 1.67 × 10⁻²⁷ kg. (a) Calculate the mean kinetic energy. (b) Calculate the de Broglie wavelength in nm. Give only the answer to (b).' + take('k', 'h'), HP / sqrt(2 * 1.67e-27 * 1.5 * KB * 300) * 1e9, 'nm',
  f'(a) Ek = 1.5 × 1.38 × 10⁻²³ × 300 = {sf(1.5 * KB * 300)} J. (b) p = √(2 × 1.67 × 10⁻²⁷ × {sf(1.5 * KB * 300)}) = {sf(sqrt(2 * 1.67e-27 * 1.5 * KB * 300), 4)} kg m s⁻¹, λ = 6.63 × 10⁻³⁴ ÷ {sf(sqrt(2 * 1.67e-27 * 1.5 * KB * 300), 4)} = {sf(HP / sqrt(2 * 1.67e-27 * 1.5 * KB * 300), 4)} m. In nm: {sf(HP / sqrt(2 * 1.67e-27 * 1.5 * KB * 300), 4)} × 10⁹ = {sf(HP / sqrt(2 * 1.67e-27 * 1.5 * KB * 300) * 1e9)}',
  ['C1: (3/2)kT', 'M1: p = √(2mEk)', 'C1: λ = h/p', 'C1: value'], aq='λ')
N('H', 6, 'An electron and an X-ray photon both have a wavelength of 0.10 nm. (a) Calculate their common momentum. (b) Calculate the photon energy. (c) Calculate the electron\'s kinetic energy. (d) Calculate (photon energy) ÷ (electron kinetic energy). Give only the answer to (d).' + take('h', 'c', 'me'), (HC / 0.10e-9) / ((HP / 0.10e-9) ** 2 / (2 * ME)), None,
  f'(a) p = 6.63 × 10⁻³⁴ ÷ 0.10 × 10⁻⁹ = 6.63 × 10⁻²⁴ kg m s⁻¹. (b) E = pc = 6.63 × 10⁻²⁴ × 3.00 × 10⁸ = {sf(6.63e-24 * CL, 4)} J. (c) Ek = (6.63 × 10⁻²⁴)² ÷ (2 × 9.11 × 10⁻³¹) = {sf((6.63e-24) ** 2 / (2 * ME), 4)} J. (d) {sf(6.63e-24 * CL, 4)} ÷ {sf((6.63e-24) ** 2 / (2 * ME), 4)} = {sf((HC / 0.10e-9) / ((HP / 0.10e-9) ** 2 / (2 * ME)))}',
  ['C1: p = h/λ', 'C1: E = pc', 'C1: Ek = p²/2m', 'M1: ratio', 'C1: value'], aq='ratio')
N('H', 5, 'An electron microscope uses electrons accelerated through 100 kV. Ignoring relativity, (a) calculate their de Broglie wavelength, and (b) calculate (wavelength of 500 nm light) ÷ (electron wavelength). Give only the answer to (b).' + take('h', 'me', 'e'), 500e-9 / lam_e(100e3), None,
  f'(a) p = √(2 × 9.11 × 10⁻³¹ × 1.60 × 10⁻¹⁹ × 1.0 × 10⁵) = {sf(sqrt(2 * ME * QE * 1e5), 4)} kg m s⁻¹, λ = 6.63 × 10⁻³⁴ ÷ {sf(sqrt(2 * ME * QE * 1e5), 4)} = {sf(lam_e(1e5), 4)} m. (b) 500 × 10⁻⁹ ÷ {sf(lam_e(1e5), 4)} = {sf(500e-9 / lam_e(1e5))}',
  ['C1: Ek = eV', 'C1: λ = h/p', 'M1: ratio', 'C1: value'], aq='ratio')
N('H', 6, 'An α-particle (mass 6.64 × 10⁻²⁷ kg) has a kinetic energy of 5.0 MeV. (a) Convert the energy into joules. (b) Calculate its momentum. (c) Calculate its de Broglie wavelength. (d) Compare it with the size of a nucleus, about 10⁻¹⁴ m. Give only the answer to (c), in units of 10⁻¹⁵ m.' + take('e', 'h'), HP / sqrt(2 * 6.64e-27 * 5.0e6 * QE), '10⁻¹⁵ m',
  f'(a) Ek = 5.0 × 10⁶ × 1.60 × 10⁻¹⁹ = 8.0 × 10⁻¹³ J. (b) p = √(2 × 6.64 × 10⁻²⁷ × 8.0 × 10⁻¹³) = {sf(sqrt(2 * 6.64e-27 * 8e-13), 4)} kg m s⁻¹. (c) λ = 6.63 × 10⁻³⁴ ÷ {sf(sqrt(2 * 6.64e-27 * 8e-13), 4)} = {sf(HP / sqrt(2 * 6.64e-27 * 8e-13))} m. (d) Similar in size, so α-particles probe nuclear dimensions.',
  ['C1: MeV to J', 'C1: p = √(2mEk)', 'M1: λ = h/p', 'C1: value', 'B1: comparison'], aq='λ')
N('H', 5, 'Electrons are to have the same wavelength as X-rays of 0.071 nm. (a) Calculate the momentum needed. (b) Calculate the accelerating potential difference required.' + take('h', 'me', 'e'), (HP / 0.071e-9) ** 2 / (2 * ME * QE), 'V',
  f'(a) p = 6.63 × 10⁻³⁴ ÷ 0.071 × 10⁻⁹ = {sf(HP / 0.071e-9, 4)} kg m s⁻¹. (b) V = p²/(2me) = ({sf(HP / 0.071e-9, 4)})² ÷ (2 × 9.11 × 10⁻³¹ × 1.60 × 10⁻¹⁹) = {sf((HP / 0.071e-9) ** 2 / (2 * ME * QE))} V',
  ['C1: p = h/λ', 'M1: eV = p²/2m', 'C1: substitution', 'C1: value'], aq='V')
N('H', 6, 'The accelerating voltage of an electron diffraction tube is raised from 10 kV to 25 kV. (a) Show that λ ∝ 1/√V. (b) Calculate (new wavelength) ÷ (old wavelength). (c) State what happens to the rings on the screen. Give only the answer to (b).', sqrt(10 / 25), None,
  f'(a) eV = p²/2m gives p = √(2meV), so λ = h/√(2meV). (b) Ratio = √(10 ÷ 25) = {sf(sqrt(10 / 25))}. (c) The rings shrink to about 0.63 of their radius.',
  ['B1: derivation', 'M1: λ ∝ 1/√V', 'C1: ratio', 'B1: rings smaller', 'B1: radius ∝ λ'], aq='ratio')

# ═════════════════════════ 28.11 Revisiting photons (17/18/9) ═════════════════════════
lesson('28.11')
N('E', 2, 'How many photons of wavelength 450 nm are emitted each second by a 1.0 W blue lamp?' + take('h', 'c'), 1.0 / ephot(450e-9), None,
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 450 × 10⁻⁹ = {sf(ephot(450e-9), 4)} J. n = 1.0 ÷ {sf(ephot(450e-9), 4)} = {sf(1.0 / ephot(450e-9))}', ['C1: n = P/E'], aq='n')
M('E', 1, 'In physics, what is meant by the word photon?', 'A quantum of electromagnetic energy', ['A small charged particle in an atom', 'A unit of light intensity', 'A wave of sound'], 'A photon is one packet of electromagnetic radiation, with energy hf.')
N('E', 2, 'Calculate the energy of a 10 GHz microwave photon in units of 10⁻²⁴ J.' + take('h'), HP * 10e9, '10⁻²⁴ J',
  f'E = hf = 6.63 × 10⁻³⁴ × 10 × 10⁹ = {sf(HP * 1e10)} J', ['C1: E = hf'], aq='E')
M('E', 1, 'A photon\'s frequency is doubled. What happens to its energy?', 'It doubles', ['It halves', 'It quadruples', 'It is unchanged'], 'E = hf, so the photon energy is directly proportional to frequency.')
N('E', 2, 'A photon carries 4.0 × 10⁻¹⁹ J. Calculate its wavelength in nm.' + take('h', 'c'), HC / 4.0e-19 * 1e9, 'nm',
  f'λ = hc/E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 4.0 × 10⁻¹⁹ = {sf(HC / 4e-19, 4)} m. In nm: {sf(HC / 4e-19, 4)} × 10⁹ = {sf(HC / 4e-19 * 1e9)}', ['C1: λ = hc/E'], aq='λ')
M('E', 1, 'Which unit could be used for the momentum of a photon?', 'kg m s⁻¹', ['J s', 'kg m s⁻²', 'J s⁻¹'], 'p = h/λ has units J s ÷ m = kg m s⁻¹.')
N('E', 2, 'Calculate the energy, in eV, of a 700 nm photon at the red end of the visible spectrum.' + take('h', 'c', 'e'), ev_of(700), 'eV',
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (700 × 10⁻⁹ × 1.60 × 10⁻¹⁹) = {sf(ev_of(700))} eV', ['C1: E = hc/λ in eV'], aq='E')
M('E', 1, 'At what speed do all photons travel in a vacuum?', '3.00 × 10⁸ m s⁻¹, whatever their energy', ['Faster for higher energies', 'Slower for higher energies', 'At a speed that depends on the source'], 'All electromagnetic radiation travels at c in a vacuum.')
N('E', 2, 'A beam delivers 5.0 × 10¹⁵ photons per second, each of energy 2.5 eV. Calculate the beam power in mW.' + take('e'), 5.0e15 * 2.5 * QE * 1e3, 'mW',
  f'P = 5.0 × 10¹⁵ × 2.5 × 1.60 × 10⁻¹⁹ = {sf(5e15 * 2.5 * QE, 4)} W. In mW: {sf(5e15 * 2.5 * QE, 4)} × 10³ = {sf(5e15 * 2.5 * QE * 1e3)}', ['C1: P = nE'], sig=2, aq='P')
M('E', 1, 'For light of one wavelength, the intensity is proportional to what?', 'The number of photons arriving per second per unit area', ['The energy of each photon', 'The speed of the photons', 'The wavelength'], 'Each photon carries hf; intensity = flux × hf.')
N('E', 2, 'Calculate the energy carried by one mole of photons of wavelength 500 nm, in kJ.' + take('h', 'c', 'NA'), NA_ * ephot(500e-9) / 1e3, 'kJ',
  f'E = 6.02 × 10²³ × 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 500 × 10⁻⁹ = {sf(NA_ * ephot(500e-9), 4)} J. In kJ: {sf(NA_ * ephot(500e-9), 4)} ÷ 10³ = {sf(NA_ * ephot(500e-9) / 1e3)}', ['C1: N_A × hc/λ'], aq='E')
M('E', 1, 'Which photons have enough energy to ionise atoms?', 'X-ray photons', ['Radio-wave photons', 'Microwave photons', 'Infrared photons'], 'Ionisation needs several eV or more per photon.')
N('E', 2, 'A photon has an energy of 3.3 × 10⁻¹⁹ J. Calculate its frequency in units of 10¹⁴ Hz.' + take('h'), 3.3e-19 / HP, '10¹⁴ Hz',
  f'f = E/h = 3.3 × 10⁻¹⁹ ÷ 6.63 × 10⁻³⁴ = {sf(3.3e-19 / HP)} Hz', ['C1: f = E/h'], aq='f')
M('E', 1, 'How are individual photons emitted from an ordinary lamp?', 'At random times and in random directions', ['In a steady stream at equal time intervals', 'All in the same direction', 'Only when the lamp is switched on'], 'Spontaneous emission is random.')
N('E', 2, 'Light of wavelength 500 nm has an intensity of 1.0 W m⁻². How many photons cross each square metre per second?' + take('h', 'c'), 1.0 / ephot(500e-9), None,
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 500 × 10⁻⁹ = {sf(ephot(500e-9), 4)} J. Flux = 1.0 ÷ {sf(ephot(500e-9), 4)} = {sf(1.0 / ephot(500e-9))}', ['C1: flux = I/E'], aq='flux')
M('E', 1, 'A photon passes from air into glass. What happens to its energy?', 'It stays the same, because the frequency is unchanged', ['It increases', 'It decreases', 'It becomes zero'], 'Frequency (and so hf) is set by the source; speed and wavelength change.')
N('E', 1, 'How many photons of energy 1.0 × 10⁻¹⁸ J carry a total energy of 1.0 mJ?', 1.0e-3 / 1.0e-18, None,
  'N = 1.0 × 10⁻³ ÷ 1.0 × 10⁻¹⁸ = 1.0 × 10¹⁵', [], sig=2, aq='N')
# medium
N('M', 3, 'A night-vision camera detects infrared of wavelength 900 nm. Calculate the photon energy in eV.' + take('h', 'c', 'e'), ev_of(900), 'eV',
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (900 × 10⁻⁹ × 1.60 × 10⁻¹⁹) = {sf(ev_of(900))} eV', ['C1: E = hc/λ', 'C1: in eV'], aq='E')
N('M', 3, 'A 2.0 W source emits light of wavelength 600 nm equally in all directions. How many photons cross each square metre per second at 5.0 m from it?' + take('h', 'c'), 2.0 / ephot(600e-9) / (4 * pi * 25), None,
  f'n = 2.0 ÷ {sf(ephot(600e-9), 4)} = {sf(2.0 / ephot(600e-9), 4)} s⁻¹. Flux = {sf(2.0 / ephot(600e-9), 4)} ÷ (4π × 5.0²) = {sf(2.0 / ephot(600e-9) / (4 * pi * 25))}', ['C1: photon rate', 'C1: ÷ 4πr²'], aq='flux')
M('M', 3, 'Light passes from air into water. Which statement about its photons is correct?', 'Their energy stays the same but the wavelength becomes shorter', ['Their energy increases and the wavelength becomes shorter', 'Their energy decreases and the wavelength stays the same', 'Their energy and wavelength both stay the same'], 'f is unchanged, so E = hf is unchanged; λ = v/f falls as v falls.', ['C1: f unchanged', 'C1: λ = v/f decreases'])
N('M', 3, 'A detector counts 20% of the photons reaching it. Light of wavelength 500 nm and power 1.0 pW reaches it. Calculate the count rate.' + take('h', 'c'), 0.20 * 1.0e-12 / ephot(500e-9), 's⁻¹',
  f'n = 1.0 × 10⁻¹² ÷ {sf(ephot(500e-9), 4)} = {sf(1e-12 / ephot(500e-9), 4)} s⁻¹. Counts = 0.20 × {sf(1e-12 / ephot(500e-9), 4)} = {sf(0.2 * 1e-12 / ephot(500e-9))} s⁻¹', ['C1: photon rate', 'C1: × efficiency'], aq='rate')
N('M', 4, 'A 0.10 m² solar cell receives 800 W m⁻² of light, treated as photons of 600 nm. Each photon has a 30% chance of releasing one electron into the circuit. Calculate the current.' + take('h', 'c', 'e'), 0.30 * 80 / ephot(600e-9) * QE, 'A',
  f'P = 800 × 0.10 = 80 W. n = 80 ÷ {sf(ephot(600e-9), 4)} = {sf(80 / ephot(600e-9), 4)} s⁻¹. I = 0.30 × {sf(80 / ephot(600e-9), 4)} × 1.60 × 10⁻¹⁹ = {sf(0.3 * 80 / ephot(600e-9) * QE)} A',
  ['C1: P = IA', 'C1: photon rate', 'C1: I = efficiency × n × e'], aq='I')
M('M', 3, 'How do a gamma-ray photon and a visible photon compare?', 'The gamma photon has more energy and more momentum, but the same speed', ['The gamma photon is faster', 'They have the same momentum', 'The visible photon has more energy'], 'E = hf and p = h/λ both larger for gamma; both travel at c.', ['C1: E and p larger', 'C1: same speed c'])
N('M', 3, 'A photon has an energy of 2.0 eV. Calculate its momentum in units of 10⁻²⁷ kg m s⁻¹.' + take('e', 'c'), 2.0 * QE / CL, '10⁻²⁷ kg m s⁻¹',
  f'E = 2.0 × 1.60 × 10⁻¹⁹ = 3.2 × 10⁻¹⁹ J. p = 3.2 × 10⁻¹⁹ ÷ 3.00 × 10⁸ = {sf(3.2e-19 / CL)} kg m s⁻¹', ['C1: eV to J', 'C1: p = E/c'], aq='p')
N('M', 3, 'Light of wavelength 600 nm in air enters water of refractive index 1.33. What is the wavelength in water, in nm? (The photon energy does not change.)', 600 / 1.33, 'nm',
  f'f is unchanged and v = c/n, so λ = 600 ÷ 1.33 = {sf(600 / 1.33)} nm', ['C1: frequency unchanged', 'C1: λ = λ₀/n'], aq='λ')
M('M', 3, 'Why does a radio receiver not detect individual photons?', 'Each radio photon carries so little energy that enormous numbers arrive, so the signal is effectively continuous', ['Radio waves are not made of photons', 'Radio photons travel too slowly', 'Radio photons are absorbed by the air'], 'E = hf is about 10⁻²⁶ J at 100 MHz.', ['C1: tiny hf', 'C1: huge photon numbers'])
N('M', 3, 'How many 100 keV X-ray photons carry a total energy of 1.0 mJ?' + take('e'), 1.0e-3 / (100e3 * QE), None,
  f'E = 100 × 10³ × 1.60 × 10⁻¹⁹ = 1.6 × 10⁻¹⁴ J. N = 1.0 × 10⁻³ ÷ 1.6 × 10⁻¹⁴ = {sf(1e-3 / 1.6e-14)}', ['C1: keV to J', 'C1: N = total ÷ E'], aq='N')
N('M', 4, 'An eye can register a flash of 100 photons of 500 nm light arriving in 0.10 s. Calculate the mean power of the flash, in units of 10⁻¹⁶ W.' + take('h', 'c'), 100 * ephot(500e-9) / 0.10, '10⁻¹⁶ W',
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 500 × 10⁻⁹ = {sf(ephot(500e-9), 4)} J. Total = 100 × {sf(ephot(500e-9), 4)} = {sf(100 * ephot(500e-9), 4)} J. P = {sf(100 * ephot(500e-9), 4)} ÷ 0.10 = {sf(100 * ephot(500e-9) / 0.1)} W',
  ['C1: photon energy', 'C1: total energy', 'C1: P = E/t'], aq='P')
M('M', 3, 'What does it mean to say that the energy of electromagnetic radiation is quantised?', 'It can only be emitted or absorbed in whole numbers of photons, each of energy hf', ['It always has the same energy, whatever its frequency', 'It travels at a fixed speed', 'Its energy is spread evenly over the wavefront'], 'Energy transfers come in lumps of hf.', ['C1: discrete amounts', 'C1: each hf'])
N('M', 3, 'A photon has a momentum of 1.5 × 10⁻²⁷ kg m s⁻¹. Calculate its energy in eV.' + take('c', 'e'), 1.5e-27 * CL / QE, 'eV',
  f'E = pc = 1.5 × 10⁻²⁷ × 3.00 × 10⁸ = 4.5 × 10⁻¹⁹ J. In eV: 4.5 × 10⁻¹⁹ ÷ 1.60 × 10⁻¹⁹ = {sf(4.5e-19 / QE)} eV', ['C1: E = pc', 'C1: J to eV'], aq='E')
N('M', 3, 'A continuous laser emits 2.0 W of infrared light of wavelength 1064 nm. How many photons does it emit per second?' + take('h', 'c'), 2.0 / ephot(1064e-9), None,
  f'E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 1064 × 10⁻⁹ = {sf(ephot(1064e-9), 4)} J. n = 2.0 ÷ {sf(ephot(1064e-9), 4)} = {sf(2.0 / ephot(1064e-9))}', ['C1: photon energy', 'C1: n = P/E'], aq='n')
M('M', 3, 'Two beams have the same intensity. Beam X is ultraviolet and beam Y is infrared. Which statement is correct?', 'Beam Y has the greater photon flux', ['Beam X has the greater photon flux', 'The photon fluxes are equal', 'Beam X\'s photons have less momentum'], 'Flux = I/hf, so the lower-energy photons must be more numerous.', ['C1: flux = I/E', 'C1: infrared photons smaller E'])
N('M', 3, 'Calculate the frequency of a photon of energy 1.0 keV, in units of 10¹⁷ Hz.' + take('e', 'h'), 1.0e3 * QE / HP, '10¹⁷ Hz',
  f'E = 1.0 × 10³ × 1.60 × 10⁻¹⁹ = 1.6 × 10⁻¹⁶ J. f = 1.6 × 10⁻¹⁶ ÷ 6.63 × 10⁻³⁴ = {sf(1.6e-16 / HP)} Hz', ['C1: keV to J', 'C1: f = E/h'], aq='f')
M('M', 4, 'Which statement about the photons in a beam of monochromatic light is correct?', 'They all have the same energy, and their number per second sets the intensity', ['They have a range of energies that averages to hf', 'Brighter beams have more energetic photons', 'Their energy decreases as the beam spreads out'], 'One frequency means one photon energy hf.', ['C1: single photon energy', 'C1: intensity from number', 'C1: spreading reduces flux, not hf'])
N('M', 3, 'A 40 W filament lamp turns 10% of its power into visible light, treated as photons of 550 nm. How many visible photons does it emit per second?' + take('h', 'c'), 4.0 / ephot(550e-9), None,
  f'Visible power = 0.10 × 40 = 4.0 W. n = 4.0 ÷ {sf(ephot(550e-9), 4)} = {sf(4.0 / ephot(550e-9))}', ['C1: useful power', 'C1: n = P/E'], aq='n')
# hard
N('H', 5, 'A GPS satellite signal of frequency 1.575 GHz reaches a receiver with a power of 1.0 × 10⁻¹⁶ W. (a) Calculate the photon energy. (b) Calculate the number of photons arriving per second. (c) Explain why the signal behaves like a classical wave. Give only the answer to (b).' + take('h'), 1.0e-16 / (HP * 1.575e9), None,
  f'(a) E = 6.63 × 10⁻³⁴ × 1.575 × 10⁹ = {sf(HP * 1.575e9, 4)} J. (b) n = 1.0 × 10⁻¹⁶ ÷ {sf(HP * 1.575e9, 4)} = {sf(1e-16 / (HP * 1.575e9))}. (c) Around 10⁸ photons per second each with tiny energy behave as a continuous wave.',
  ['C1: E = hf', 'M1: n = P/E', 'C1: value', 'B1: many tiny quanta'], aq='n')
N('H', 6, 'A red LED starts to emit at 2.0 V. Each electron crossing the junction gives one photon. It carries 20 mA. (a) Calculate the number of electrons per second. (b) Calculate the photon energy in J. (c) Calculate the wavelength in nm. Give only the answer to (c).' + take('e', 'h', 'c'), HC / (2.0 * QE) * 1e9, 'nm',
  f'(a) n = 20 × 10⁻³ ÷ 1.60 × 10⁻¹⁹ = {sf(20e-3 / QE)} s⁻¹. (b) E = eV = 1.60 × 10⁻¹⁹ × 2.0 = 3.2 × 10⁻¹⁹ J. (c) λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 3.2 × 10⁻¹⁹ = {sf(HC / 3.2e-19, 4)} m. In nm: {sf(HC / 3.2e-19, 4)} × 10⁹ = {sf(HC / 3.2e-19 * 1e9)}',
  ['C1: n = I/e', 'C1: E = eV', 'M1: λ = hc/E', 'C1: conversion', 'C1: value'], aq='λ')
N('H', 5, 'A pulsed laser emits pulses of 50 mJ at 1064 nm, each lasting 5.0 ns. (a) Calculate the peak power. (b) Calculate the number of photons per pulse. (c) Calculate the total momentum of the photons in one pulse. Give only the answer to (b).' + take('h', 'c'), 50e-3 / ephot(1064e-9), None,
  f'(a) P = 50 × 10⁻³ ÷ 5.0 × 10⁻⁹ = 1.0 × 10⁷ W. (b) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 1064 × 10⁻⁹ = {sf(ephot(1064e-9), 4)} J; N = 50 × 10⁻³ ÷ {sf(ephot(1064e-9), 4)} = {sf(50e-3 / ephot(1064e-9))}. (c) p = E/c = 50 × 10⁻³ ÷ 3.00 × 10⁸ = {sf(50e-3 / CL)} kg m s⁻¹',
  ['C1: peak power', 'C1: photon energy', 'M1: N = E/hf', 'C1: value'], aq='N')
N('H', 6, 'A fluorescent dye absorbs ultraviolet photons of 365 nm and re-emits visible photons of 520 nm. (a) Calculate both photon energies in eV. (b) Calculate the energy lost per photon, in eV. (c) Calculate this loss as a percentage of the absorbed energy. Give only the answer to (b).' + take('h', 'c', 'e'), ev_of(365) - ev_of(520), 'eV',
  f'(a) {sf(ev_of(365), 4)} eV and {sf(ev_of(520), 4)} eV. (b) {sf(ev_of(365), 4)} − {sf(ev_of(520), 4)} = {sf(ev_of(365) - ev_of(520))} eV. (c) {sf((ev_of(365) - ev_of(520)) / ev_of(365) * 100, 3)} %.',
  ['C1: UV photon energy', 'C1: visible photon energy', 'M1: difference', 'C1: value', 'C1: percentage'], aq='ΔE')
N('H', 5, 'A telescope collects light from a galaxy with a mirror of area 0.50 m². The intensity at the Earth is 2.0 × 10⁻¹⁴ W m⁻² and the mean wavelength is 600 nm. (a) Calculate the power collected. (b) Calculate the number of photons collected per second.' + take('h', 'c'), 2.0e-14 * 0.50 / ephot(600e-9), None,
  f'(a) P = 2.0 × 10⁻¹⁴ × 0.50 = 1.0 × 10⁻¹⁴ W. (b) n = 1.0 × 10⁻¹⁴ ÷ {sf(ephot(600e-9), 4)} = {sf(1e-14 / ephot(600e-9))}',
  ['C1: P = IA', 'C1: photon energy', 'M1: n = P/E', 'C1: value'], aq='n')
N('H', 6, 'A 2.0 mW laser of wavelength 650 nm shines on a photodiode for 1.0 minute. (a) Calculate the energy delivered. (b) Calculate the number of photons. (c) If 70% of the photons each free one electron, calculate the charge that flows. Give only the answer to (c), in mC.' + take('h', 'c', 'e'), 0.70 * 2.0e-3 * 60 / ephot(650e-9) * QE * 1e3, 'mC',
  f'(a) E = 2.0 × 10⁻³ × 60 = 0.12 J. (b) N = 0.12 ÷ {sf(ephot(650e-9), 4)} = {sf(0.12 / ephot(650e-9), 4)}. (c) Q = 0.70 × {sf(0.12 / ephot(650e-9), 4)} × 1.60 × 10⁻¹⁹ = {sf(0.7 * 0.12 / ephot(650e-9) * QE, 4)} C. In mC: {sf(0.7 * 0.12 / ephot(650e-9) * QE, 4)} × 10³ = {sf(0.7 * 0.12 / ephot(650e-9) * QE * 1e3)}',
  ['C1: E = Pt', 'C1: photon energy', 'C1: N', 'M1: Q = 0.70 N e', 'C1: value'], aq='Q')
N('H', 5, 'An X-ray beam of 30 keV photons delivers 2.0 × 10⁻³ J to a patient. (a) Convert the photon energy into joules. (b) Calculate the number of photons absorbed. Give only the answer to (b).' + take('e'), 2.0e-3 / (30e3 * QE), None,
  f'(a) E = 30 × 10³ × 1.60 × 10⁻¹⁹ = 4.8 × 10⁻¹⁵ J. (b) N = 2.0 × 10⁻³ ÷ 4.8 × 10⁻¹⁵ = {sf(2e-3 / 4.8e-15)}',
  ['C1: keV to J', 'M1: N = total ÷ photon energy', 'C1: value', 'B1: each photon ionises'], aq='N')
N('H', 6, 'Sunlight reaches the top of the atmosphere with an intensity of 1.36 kW m⁻². Model it as photons of 550 nm. (a) Calculate the photon flux. (b) Calculate the radiation pressure on a perfectly absorbing surface. (c) Calculate the momentum delivered to 1.0 m² each second by the photons. Give only the answer to (a).' + take('h', 'c'), 1.36e3 / ephot(550e-9), None,
  f'(a) E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 550 × 10⁻⁹ = {sf(ephot(550e-9), 4)} J; flux = 1.36 × 10³ ÷ {sf(ephot(550e-9), 4)} = {sf(1.36e3 / ephot(550e-9))} m⁻² s⁻¹. (b) p = I/c = 1360 ÷ 3.00 × 10⁸ = {sf(1360 / CL)} Pa. (c) {sf(1360 / CL)} kg m s⁻¹ each second.',
  ['C1: photon energy', 'M1: flux = I/E', 'C1: value', 'C1: pressure I/c', 'B1: momentum per second = force'], aq='flux')
N('H', 5, 'A detector of area 1.0 cm² is 3.0 m from a 5.0 W source of 590 nm light that radiates equally in all directions. (a) Calculate the intensity at the detector. (b) Calculate the number of photons hitting the detector per second.' + take('h', 'c'), 5.0 / (4 * pi * 9) * 1.0e-4 / ephot(590e-9), None,
  f'(a) I = 5.0 ÷ (4π × 3.0²) = {sf(5 / (4 * pi * 9), 4)} W m⁻². (b) P = {sf(5 / (4 * pi * 9), 4)} × 1.0 × 10⁻⁴ = {sf(5 / (4 * pi * 9) * 1e-4, 4)} W; n = {sf(5 / (4 * pi * 9) * 1e-4, 4)} ÷ {sf(ephot(590e-9), 4)} = {sf(5 / (4 * pi * 9) * 1e-4 / ephot(590e-9))}',
  ['C1: inverse-square intensity', 'C1: cm² to m²', 'M1: n = P/E', 'C1: value'], aq='n')
