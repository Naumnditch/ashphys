# Chapter 29 Nuclear physics — part a: 29.1 to 29.4.
CL, QE, U, ME, HP = 3.00e8, 1.60e-19, 1.66e-27, 9.11e-31, 6.63e-34
MEV = 1.60e-13
UMEV = 931.5
MPU, MNU = 1.007276, 1.008665
NA_ = 6.02e23


def mev(kg):
    return kg * CL ** 2 / MEV


# ═════════════════════════ 29.1 Balanced equations (16/17/11) ═════════════════════════
lesson('29.1')
N('E', 1, 'Polonium-210 (proton number 84) decays by emitting an α-particle. What is the proton number of the daughter nucleus?', 82, None,
  'An α-particle carries away 2 protons: Z = 84 − 2 = 82', [], sig=2, aq='Z')
M('E', 1, 'Which particles leave the nucleus in β⁻ decay?', 'An electron and an antineutrino', ['A positron and a neutrino', 'Two protons and two neutrons', 'A neutron and a photon'], 'β⁻ decay: n → p + e⁻ + ν̄.')
N('E', 1, 'Carbon-14 decays by β⁻ emission. What is the nucleon number of the daughter nucleus?', 14, None,
  'An electron has nucleon number 0, so A = 14 − 0 = 14', [], sig=2, aq='A')
M('E', 1, 'Which particle is emitted as β⁺ radiation?', 'A positron', ['An electron', 'A helium nucleus', 'A proton'], 'β⁺ particles are positrons, the antiparticles of electrons.')
N('E', 2, 'Sodium-22 (proton number 11) decays by β⁺ emission. Calculate the proton number of the daughter nucleus.', 10, None,
  'A proton becomes a neutron: Z = 11 − 1 = 10', ['C1: β⁺ lowers Z by one'], sig=2, aq='Z')
M('E', 1, 'A nucleus emits a γ-ray photon. What happens to its nucleon number and proton number?', 'Neither changes', ['Both decrease by 1', 'The nucleon number decreases by 4', 'The proton number increases by 1'], 'A γ-photon carries energy only, with no charge or nucleons.')
N('E', 2, 'Thorium-232 (proton number 90) emits an α-particle. How many neutrons are in the daughter nucleus?', 140, None,
  'Daughter: A = 232 − 4 = 228, Z = 90 − 2 = 88, so N = 228 − 88 = 140', ['C1: A and Z of daughter'], sig=3, aq='N')
M('E', 1, 'In β⁻ decay, what change happens inside the nucleus?', 'A neutron changes into a proton', ['A proton changes into a neutron', 'A neutron is ejected', 'Two protons combine'], 'A neutron turns into a proton, emitting an electron and an antineutrino: n → p + e⁻ + ν̄.')
N('E', 2, 'Uranium-238 has proton number 92. How many neutrons does its nucleus contain?', 146, None,
  'N = A − Z = 238 − 92 = 146', ['C1: N = A − Z'], sig=3, aq='N')
M('E', 1, 'Which particle is emitted together with the positron in β⁺ decay?', 'A neutrino', ['An antineutrino', 'An electron', 'An α-particle'], 'A proton becomes a neutron, a positron and a neutrino: p → n + e⁺ + ν.')
N('E', 2, 'Uranium-238 eventually becomes lead-206 by a series of α and β⁻ decays. How many α-particles are emitted in the whole series?', (238 - 206) / 4, None,
  'Only α decay changes A, by 4 each time: number = (238 − 206) ÷ 4 = 8', ['C1: β decay leaves A unchanged'], sig=1, aq='α decays')
M('E', 1, 'Which description of an α-particle is correct?', 'A helium-4 nucleus: two protons and two neutrons', ['A fast electron', 'A high-energy photon', 'A hydrogen atom'], 'Its charge is +2e and its nucleon number is 4.')
N('E', 2, 'Two deuterium (hydrogen-2) nuclei fuse to form helium-3 and one other particle. What is the nucleon number of that particle?', 1, None,
  'Nucleon number is conserved, so A = 2 + 2 − 3 = 1. The particle is a neutron.', ['C1: nucleon number conserved'], sig=1, aq='A')
M('E', 1, 'Which two quantities must be the same on both sides of every nuclear equation?', 'Total nucleon number and total charge (proton number)', ['Total mass and total speed', 'Number of neutrons and number of electrons', 'Total kinetic energy and total momentum only'], 'A and Z are conserved in nuclear reactions.')
N('E', 2, 'Cobalt-60 (proton number 27) decays by β⁻ emission followed by γ emission. What is the proton number of the final nucleus?', 28, None,
  'β⁻ raises Z by one, γ changes nothing: Z = 27 + 1 = 28', ['C1: β⁻ adds one proton'], sig=2, aq='Z')
N('E', 1, 'Bismuth-212 emits an α-particle. What is the nucleon number of the daughter nucleus?', 208, None,
  'The α-particle removes 4 nucleons: A = 212 − 4 = 208', [], sig=3, aq='A')
# medium
N('M', 3, 'Radon-222 (proton number 86) decays by α emission, the daughter decays by α emission, and the next two decays are β⁻. What is the proton number of the final nucleus?', 86 - 2 - 2 + 1 + 1, None,
  'Z = 86 − 2 − 2 + 1 + 1 = 84', ['C1: −2 for each α', 'C1: +1 for each β⁻'], sig=2, aq='Z')
N('M', 3, 'Uranium-235 absorbs a neutron and splits into xenon-140 and strontium-94, releasing some neutrons. How many neutrons are released?', 235 + 1 - 140 - 94, None,
  'Nucleon numbers: 235 + 1 = 140 + 94 + n, so n = 236 − 234 = 2', ['C1: nucleon number conserved', 'C1: include the absorbed neutron'], sig=1, aq='neutrons')
M('M', 3, 'Which of these nuclear equations is balanced? (Each nucleus is written as element-A with proton number Z in brackets.)', 'radium-226 (88) → radon-222 (86) + helium-4 (2)', ['radium-226 (88) → radon-222 (88) + helium-4 (2)', 'radium-226 (88) → radon-224 (86) + helium-4 (2)', 'radium-226 (88) → radon-222 (87) + helium-4 (2)'], 'A: 226 = 222 + 4; Z: 88 = 86 + 2.', ['C1: check A', 'C1: check Z'])
N('M', 3, 'Rutherford fired α-particles at nitrogen-14 (proton number 7); a proton was emitted. What is the proton number of the nucleus formed?', 7 + 2 - 1, None,
  'Z = 7 + 2 − 1 = 8, which is oxygen', ['C1: add the α-particle', 'C1: subtract the proton'], sig=1, aq='Z')
N('M', 3, 'In the same reaction (nitrogen-14 + α-particle → new nucleus + proton), what is the nucleon number of the new nucleus?', 14 + 4 - 1, None,
  'A = 14 + 4 − 1 = 17, so oxygen-17 is formed', ['C1: nucleon numbers added', 'C1: proton subtracted'], sig=2, aq='A')
M('M', 3, 'Why did Pauli propose that a neutrino is emitted in β decay?', 'β-particles have a continuous range of energies, so another particle must carry the missing energy', ['β-particles are always emitted at the same energy', 'The daughter nucleus was found to be charged', 'α-particles have a range of energies'], 'Without a third particle, energy and momentum would not be conserved.', ['C1: continuous β spectrum', 'C1: energy conservation needs a third particle'])
N('M', 4, 'Thorium-232 (proton number 90) decays to lead-208 (proton number 82) through a series of α and β⁻ decays. Calculate the number of β⁻ decays.', 82 - (90 - 2 * 6), None,
  'α decays = (232 − 208) ÷ 4 = 6, lowering Z by 12 to 78. β⁻ decays each raise Z by 1: number = 82 − 78 = 4',
  ['C1: number of α decays', 'C1: effect of α on Z', 'C1: β⁻ count from Z'], sig=1, aq='β⁻ decays')
N('M', 3, 'Fluorine-18 (proton number 9) decays by β⁺ emission. How many neutrons does the daughter nucleus contain?', 18 - 8, None,
  'Daughter: A = 18, Z = 9 − 1 = 8, so N = 18 − 8 = 10', ['C1: β⁺ lowers Z', 'C1: N = A − Z'], sig=2, aq='N')
M('M', 3, 'A nucleus in an excited state emits a γ-ray. What is the effect on the nucleus?', 'Its energy decreases but its nucleon number and proton number are unchanged', ['It becomes a different element', 'Its nucleon number decreases by 1', 'Its proton number increases by 1'], 'γ emission removes excess energy only.', ['C1: energy lost', 'C1: A and Z unchanged'])
N('M', 3, 'Beryllium-7 (proton number 4) decays by capturing one of its own inner electrons. What is the proton number of the daughter nucleus?', 3, None,
  'p + e⁻ → n + ν, so Z = 4 − 1 = 3, which is lithium-7', ['C1: a proton becomes a neutron', 'C1: Z falls by 1'], sig=1, aq='Z')
M('M', 3, 'Which type of decay increases the neutron-to-proton ratio of a nucleus?', 'β⁺ decay', ['β⁻ decay', 'γ emission', 'None of them can'], 'β⁺ turns a proton into a neutron: N rises by 1, Z falls by 1.', ['C1: p → n', 'C1: ratio N/Z rises'])
N('M', 3, 'Two helium-3 nuclei fuse to form helium-4 and some protons. How many protons are released?', 2, None,
  'Nucleons: 3 + 3 − 4 = 2; charge: 2 + 2 − 2 = 2, so both are protons: 1 + 1 = 2', ['C1: nucleon balance', 'C1: charge balance'], sig=1, aq='protons')
N('M', 3, 'Radium-226 (proton number 88) emits an α-particle. Calculate the charge on the daughter nucleus in units of 10⁻¹⁷ C.' + take('e'), (88 - 2) * QE, '10⁻¹⁷ C',
  f'Z = 88 − 2 = 86. Q = 86 × 1.60 × 10⁻¹⁹ = {sf(86 * QE)} C', ['C1: daughter Z', 'C1: Q = Ze'], aq='Q')
M('M', 3, 'In β⁻ decay, how does the quark content of the nucleon change?', 'A down quark changes into an up quark', ['An up quark changes into a down quark', 'A down quark changes into a strange quark', 'Nothing changes; only an electron is emitted'], 'udd (neutron) → uud (proton).', ['C1: udd → uud', 'C1: d → u'])
N('M', 4, 'A nucleus decays by α emission and then by two β⁻ emissions, ending as uranium-234 (proton number 92). What was the nucleon number of the original nucleus?', 234 + 4, None,
  'β⁻ decays leave A unchanged and α removes 4: A = 234 + 4 = 238', ['M1: work backwards', 'C1: β⁻ leaves A', 'C1: α adds 4 going back'], sig=3, aq='A')
M('M', 3, 'Which quantities are conserved in β⁻ decay?', 'Charge, nucleon number and lepton number', ['Charge only', 'Nucleon number only', 'Proton number and neutron number separately'], 'An electron and an antineutrino keep lepton number zero.', ['C1: charge and nucleon number', 'C1: lepton number with antineutrino'])
N('M', 3, 'Carbon-11 (proton number 6) is a β⁺ emitter used in PET scanning. How many neutrons are in its daughter nucleus?', 11 - 5, None,
  'Daughter: A = 11, Z = 6 − 1 = 5, N = 11 − 5 = 6', ['C1: Z − 1', 'C1: N = A − Z'], sig=1, aq='N')
# hard
N('H', 5, 'Uranium-238 (proton number 92) decays to stable lead-206 (proton number 82). (a) Calculate the number of α decays. (b) Calculate the change in proton number caused by the α decays alone. (c) Calculate the number of β⁻ decays.', 82 - (92 - 2 * 8), None,
  '(a) (238 − 206) ÷ 4 = 8. (b) 8 × 2 = 16, giving Z = 92 − 16 = 76. (c) β⁻ decays raise Z: 82 − 76 = 6',
  ['C1: α count', 'C1: Z after α decays', 'M1: β⁻ raise Z by 1', 'C1: β⁻ count'], sig=1, aq='β⁻ decays')
N('H', 5, 'Plutonium-239 (proton number 94) absorbs a neutron and splits into barium-144 (proton number 56), another nucleus X and three neutrons. (a) Find the proton number of X. (b) Find the nucleon number of X. Give only the answer to (b).', 239 + 1 - 144 - 3, None,
  '(a) Z = 94 − 56 = 38 (strontium). (b) A = 239 + 1 − 144 − 3 = 93',
  ['C1: charge balance', 'C1: include absorbed neutron', 'M1: nucleon balance', 'C1: value'], sig=2, aq='A')
N('H', 6, 'Americium-241 (proton number 95), used in smoke detectors, emits α-particles. (a) Write the proton and nucleon numbers of the daughter. (b) Calculate the number of neutrons in the daughter. (c) State why the daughter is a different element.', 237 - 93, None,
  '(a) A = 241 − 4 = 237, Z = 95 − 2 = 93. (b) N = 237 − 93 = 144. (c) Its proton number has changed.',
  ['C1: daughter A', 'C1: daughter Z', 'M1: N = A − Z', 'C1: value', 'B1: element set by Z'], sig=3, aq='N')
N('H', 5, 'Aluminium-27 (proton number 13) is bombarded with α-particles and forms phosphorus-30 plus a neutron. The phosphorus then decays by β⁺ emission to silicon. (a) Check the first equation balances. (b) Find the proton number of silicon. (c) Find its nucleon number. Give only the answer to (c).', 30, None,
  '(a) Nucleon numbers: 27 + 4 = 31 and 30 + 1 = 31; proton numbers: 13 + 2 = 15 and 15 + 0 = 15. (b) Z = 15 − 1 = 14. (c) A is unchanged by β⁺: A = 30 + 0 = 30',
  ['B1: balance shown', 'C1: phosphorus Z = 15', 'C1: silicon Z = 14', 'C1: A unchanged'], sig=2, aq='A')
N('H', 6, 'Neptunium-237 (proton number 93) decays by α, then β⁻, then α, then α. (a) Find the nucleon number of the final nucleus. (b) Find its proton number. (c) Find the number of neutrons in it. Give only the answer to (c).', (237 - 12) - (93 - 2 + 1 - 2 - 2), None,
  '(a) A = 237 − 3 × 4 = 225. (b) Z = 93 − 2 + 1 − 2 − 2 = 88. (c) N = 225 − 88 = 137',
  ['C1: A after three α', 'C1: Z changes', 'C1: value of Z', 'M1: N = A − Z', 'C1: value'], sig=3, aq='N')
N('H', 5, 'In the Sun, four protons are turned into one helium-4 nucleus, two neutrinos and some positrons. (a) Use nucleon number to show that no other nucleons are produced. (b) Use charge conservation to find the number of positrons.', 2, None,
  '(a) 4 × 1 = 4, so the helium-4 nucleus uses all the nucleons. (b) Charge: 4 × (+1) = +2 + n × (+1), so n = 4 − 2 = 2',
  ['B1: nucleon balance', 'M1: charge balance', 'C1: neutrinos carry no charge', 'C1: value'], sig=1, aq='positrons')
N('H', 6, 'A nucleus X decays by β⁻, then α, then α, ending as radium-226 (proton number 88). (a) Work backwards to find the nucleus before the last α decay. (b) Find the nucleon number of X. (c) Find the proton number of X. Give only the answer to (c).', 88 + 2 + 2 - 1, None,
  '(a) A = 226 + 4 = 230, Z = 88 + 2 = 90. (b) A = 230 + 4 = 234 (unchanged by β⁻). (c) Before the first α: Z = 92; β⁻ raised Z by 1, so X had Z = 88 + 2 + 2 − 1 = 91',
  ['M1: reverse each step', 'C1: before last α', 'C1: nucleon number', 'C1: undo β⁻', 'C1: value'], sig=2, aq='Z')
N('H', 5, 'Strontium-90 (proton number 38) decays by β⁻ to yttrium, which decays by β⁻ again. (a) Find the number of neutrons in strontium-90. (b) Find the proton number of the final product. Give only the answer to (b).', 38 + 2, None,
  '(a) N = 90 − 38 = 52. (b) Each β⁻ adds 1 to Z: Z = 38 + 1 + 1 = 40, which is zirconium-90',
  ['C1: N = A − Z', 'M1: β⁻ raises Z', 'C1: value', 'B1: A stays 90'], sig=2, aq='Z')
N('H', 5, 'Uranium-235 (proton number 92) decays to lead-207 (proton number 82) by α and β⁻ decays. (a) Find the number of α decays. (b) Find the number of β⁻ decays.', 82 - (92 - 2 * 7), None,
  '(a) (235 − 207) ÷ 4 = 7. (b) After 7 α decays Z = 92 − 14 = 78, so β⁻ decays = 82 − 78 = 4',
  ['C1: α count', 'C1: Z after α', 'M1: β⁻ raise Z', 'C1: value'], sig=1, aq='β⁻ decays')
N('H', 6, 'In a reactor, uranium-238 (proton number 92) absorbs a neutron and then undergoes two β⁻ decays. (a) Find the nucleon number of the nucleus formed after neutron capture. (b) Find the proton number of the final nucleus. (c) Name the element formed, given that Z = 94 is plutonium. Give only the answer to (b).', 92 + 2, None,
  '(a) A = 238 + 1 = 239. (b) Z = 92 + 1 + 1 = 94. (c) Plutonium-239.',
  ['C1: neutron capture adds 1 to A', 'C1: Z unchanged by capture', 'M1: each β⁻ adds 1', 'C1: value', 'B1: plutonium'], sig=2, aq='Z')
N('H', 5, 'Polonium-210 (proton number 84) emits an α-particle. (a) Find the proton number of the daughter. (b) Calculate the charge on the daughter nucleus. (c) Show that charge is conserved. Give only the answer to (b), in units of 10⁻¹⁷ C.' + take('e'), 82 * QE, '10⁻¹⁷ C',
  f'(a) Z = 84 − 2 = 82. (b) Q = 82 × 1.60 × 10⁻¹⁹ = {sf(82 * QE)} C. (c) 82e + 2e = 84e.',
  ['C1: Z', 'M1: Q = Ze', 'C1: value', 'B1: charge balance'], aq='Q')

# ═════════════════════════ 29.2 Mass and energy (17/18/9) ═════════════════════════
lesson('29.2')
N('E', 2, 'Calculate the energy equivalent of 1.0 g of matter, in units of 10¹³ J.' + take('c'), 1.0e-3 * CL ** 2, '10¹³ J',
  'E = mc² = 1.0 × 10⁻³ × (3.00 × 10⁸)² = 9.0 × 10¹³ J', ['C1: E = mc²'], sig=2, aq='E')
M('E', 1, 'What does E = mc² tell us?', 'Mass and energy are equivalent: a change in energy goes with a change in mass', ['Energy is always lost in reactions', 'Mass can only be destroyed in nuclear reactions', 'Energy travels at the speed of light'], 'Any energy change ΔE corresponds to a mass change ΔE/c².')
N('E', 2, 'What mass is equivalent to 1.0 J of energy? Give your answer in units of 10⁻¹⁷ kg.' + take('c'), 1.0 / CL ** 2, '10⁻¹⁷ kg',
  f'm = E/c² = 1.0 ÷ (3.00 × 10⁸)² = {sf(1 / CL ** 2)} kg', ['C1: m = E/c²'], aq='m')
M('E', 1, 'How is the unified atomic mass unit u defined?', 'One twelfth of the mass of a carbon-12 atom', ['The mass of a proton', 'The mass of a hydrogen atom', 'One sixteenth of the mass of an oxygen-16 atom'], 'u = 1.66 × 10⁻²⁷ kg.')
N('E', 2, 'Convert a mass of 0.0050 u into kilograms, in units of 10⁻³⁰ kg.' + take('u'), 0.0050 * U, '10⁻³⁰ kg',
  f'm = 0.0050 × 1.66 × 10⁻²⁷ = {sf(0.005 * U)} kg', ['C1: × 1.66 × 10⁻²⁷'], aq='m')
M('E', 1, 'When separate protons and neutrons join to form a nucleus, what happens to the total mass?', 'It decreases, because energy is released', ['It increases', 'It stays exactly the same', 'It becomes zero'], 'The released binding energy corresponds to the mass defect.')
N('E', 2, 'A reaction converts 2.0 × 10⁻³⁰ kg of mass into energy. Calculate the energy in MeV.' + take('c') + ' Take 1 MeV = 1.60 × 10⁻¹³ J.', mev(2.0e-30), 'MeV',
  f'E = 2.0 × 10⁻³⁰ × (3.00 × 10⁸)² = 1.8 × 10⁻¹³ J. In MeV: 1.8 × 10⁻¹³ ÷ 1.60 × 10⁻¹³ = {sf(mev(2e-30))}', ['C1: E = mc² then ÷ 1.60 × 10⁻¹³'], aq='E')
M('E', 1, 'What kind of quantity is measured in MeV?', 'Energy', ['Mass only', 'Charge', 'Potential difference'], '1 MeV = 1.60 × 10⁻¹³ J; it is also used for mass via E = mc².')
N('E', 2, 'A nuclear reaction has a mass defect of 0.010 u. Taking 1 u as equivalent to 931.5 MeV, calculate the energy released in MeV.', 0.010 * UMEV, 'MeV',
  'E = 0.010 × 931.5 = 9.315 MeV', ['C1: × 931.5'], sig=4, aq='E')
M('E', 1, 'Why are mass changes not noticed in chemical reactions?', 'The energy changes are so small that Δm = ΔE/c² is far too tiny to measure', ['Chemical reactions do not involve energy', 'Mass is only equivalent to energy in nuclei', 'Chemical energy has no mass'], 'A few eV per molecule gives a mass change of about 10⁻⁹ of the total.')
N('E', 2, 'A reaction releases 1.0 MJ. Calculate the mass lost, in units of 10⁻¹¹ kg.' + take('c'), 1.0e6 / CL ** 2, '10⁻¹¹ kg',
  f'Δm = E/c² = 1.0 × 10⁶ ÷ (3.00 × 10⁸)² = {sf(1e6 / CL ** 2)} kg', ['C1: Δm = E/c²'], aq='Δm')
M('E', 1, 'In a nuclear reaction, which quantity is always conserved?', 'Total mass–energy', ['Total rest mass', 'Total kinetic energy', 'The number of protons'], 'Rest mass can change into energy and back, but mass–energy is conserved.')
N('E', 2, 'A reaction loses 1.0 × 10⁻²⁹ kg of mass. Calculate the energy released in MeV.' + take('c') + ' Take 1 MeV = 1.60 × 10⁻¹³ J.', mev(1.0e-29), 'MeV',
  f'E = 1.0 × 10⁻²⁹ × (3.00 × 10⁸)² = 9.0 × 10⁻¹³ J. In MeV: 9.0 × 10⁻¹³ ÷ 1.60 × 10⁻¹³ = {sf(mev(1e-29))}', ['C1: E = mc² then convert'], aq='E')
M('E', 1, 'The rest energy of an electron is about', '0.51 MeV', ['511 MeV', '0.51 eV', '938 MeV'], 'mₑc² = 9.11 × 10⁻³¹ × (3.00 × 10⁸)² ≈ 8.2 × 10⁻¹⁴ J ≈ 0.51 MeV.')
N('E', 2, 'The Sun loses 4.3 × 10⁹ kg of mass each second. Calculate its power output in units of 10²⁶ W.' + take('c'), 4.3e9 * CL ** 2, '10²⁶ W',
  f'P = (Δm/t)c² = 4.3 × 10⁹ × (3.00 × 10⁸)² = {sf(4.3e9 * CL ** 2)} W', ['C1: P = rate of mass loss × c²'], aq='P')
N('E', 2, 'Calculate the rest energy of a proton (mass 1.67 × 10⁻²⁷ kg) in MeV.' + take('c') + ' Take 1 MeV = 1.60 × 10⁻¹³ J.', mev(1.67e-27), 'MeV',
  f'E = 1.67 × 10⁻²⁷ × (3.00 × 10⁸)² = {sf(1.67e-27 * CL ** 2, 4)} J. In MeV: {sf(1.67e-27 * CL ** 2, 4)} ÷ 1.60 × 10⁻¹³ = {sf(mev(1.67e-27))}', ['C1: E = mc² in MeV'], aq='E')
N('E', 1, 'Express 1.0 MeV in units of 10⁻¹³ J.' + take('e'), 1.0e6 * QE, '10⁻¹³ J',
  'E = 1.0 × 10⁶ × 1.60 × 10⁻¹⁹ = 1.6 × 10⁻¹³ J', [], sig=2, aq='E')
# medium
N('M', 3, 'A nuclear power station produces 1.0 GW of thermal power for one year (3.16 × 10⁷ s). Calculate the mass converted into energy.' + take('c'), 1.0e9 * 3.16e7 / CL ** 2, 'kg',
  f'E = Pt = 1.0 × 10⁹ × 3.16 × 10⁷ = 3.16 × 10¹⁶ J. Δm = 3.16 × 10¹⁶ ÷ (3.00 × 10⁸)² = {sf(3.16e16 / CL ** 2)} kg', ['C1: E = Pt', 'C1: Δm = E/c²'], aq='Δm')
N('M', 3, 'An electron and a positron at rest annihilate completely. Calculate the total energy released, in units of 10⁻¹³ J.' + take('me', 'c'), 2 * ME * CL ** 2, '10⁻¹³ J',
  f'E = 2mₑc² = 2 × 9.11 × 10⁻³¹ × (3.00 × 10⁸)² = {sf(2 * ME * CL ** 2)} J', ['C1: two rest masses', 'C1: E = mc²'], aq='E')
N('M', 4, 'An electron and a positron at rest annihilate, producing two identical photons. Calculate the wavelength of each photon in units of 10⁻¹² m.' + take('me', 'c', 'h'), HP * CL / (ME * CL ** 2), '10⁻¹² m',
  f'Each photon has E = mₑc² = 9.11 × 10⁻³¹ × (3.00 × 10⁸)² = {sf(ME * CL ** 2, 4)} J. λ = hc/E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ {sf(ME * CL ** 2, 4)} = {sf(HP * CL / (ME * CL ** 2))} m',
  ['M1: two photons share 2mₑc²', 'C1: E per photon', 'C1: λ = hc/E'], aq='λ')
M('M', 3, 'In a nuclear reaction the total rest mass of the products is less than that of the reactants. What follows?', 'Energy is released, mostly as kinetic energy of the products', ['Energy must be supplied', 'Mass has been destroyed without trace', 'Charge has been lost'], 'ΔE = Δm c² appears as kinetic energy and radiation.', ['C1: Δm > 0 means energy released', 'C1: appears as kinetic energy'])
N('M', 3, 'A reaction has a mass defect of 0.0024 u. Calculate the energy released, in units of 10⁻¹³ J.' + take('u', 'c'), 0.0024 * U * CL ** 2, '10⁻¹³ J',
  f'Δm = 0.0024 × 1.66 × 10⁻²⁷ = {sf(0.0024 * U, 4)} kg. E = {sf(0.0024 * U, 4)} × (3.00 × 10⁸)² = {sf(0.0024 * U * CL ** 2)} J', ['C1: u to kg', 'C1: E = mc²'], aq='E')
N('M', 3, 'A gamma photon can create an electron–positron pair if it has at least enough energy for their rest masses. Calculate this threshold energy in MeV.' + take('me', 'c') + ' Take 1 MeV = 1.60 × 10⁻¹³ J.', mev(2 * ME), 'MeV',
  f'E = 2mₑc² = 2 × 9.11 × 10⁻³¹ × (3.00 × 10⁸)² = {sf(2 * ME * CL ** 2, 4)} J. In MeV: {sf(2 * ME * CL ** 2, 4)} ÷ 1.60 × 10⁻¹³ = {sf(mev(2 * ME))}', ['C1: 2mₑc²', 'C1: in MeV'], aq='E')
M('M', 3, 'After fission, why is the total mass of the fragments and neutrons less than the mass of the original nucleus and neutron?', 'The products are more tightly bound, and the extra binding energy is released', ['Some neutrons are destroyed', 'Mass is converted into charge', 'The fragments are moving, which reduces their mass'], 'Higher binding energy per nucleon means lower mass per nucleon.', ['C1: products more tightly bound', 'C1: energy released corresponds to Δm'])
N('M', 3, 'The fusion of deuterium and tritium has a mass defect of 0.0189 u. Taking 1 u as equivalent to 931.5 MeV, calculate the energy released.', 0.0189 * UMEV, 'MeV',
  f'E = 0.0189 × 931.5 = {sf(0.0189 * UMEV)} MeV', ['C1: × 931.5', 'C1: substitution'], aq='E')
N('M', 4, 'Each fission of uranium-235 releases about 200 MeV. Calculate the energy released when 1.0 kg of uranium-235 (molar mass 235 g mol⁻¹) undergoes fission, in units of 10¹³ J.' + take('NA') + ' Take 1 MeV = 1.60 × 10⁻¹³ J.', 1000 / 235 * NA_ * 200 * MEV, '10¹³ J',
  f'N = 1000 ÷ 235 × 6.02 × 10²³ = {sf(1000 / 235 * NA_, 4)}. E = {sf(1000 / 235 * NA_, 4)} × 200 × 1.60 × 10⁻¹³ = {sf(1000 / 235 * NA_ * 200 * MEV)} J',
  ['C1: number of nuclei', 'C1: energy per fission in J', 'C1: total'], aq='E')
M('M', 3, 'A kettle of water is heated from 20 °C to 100 °C. What happens to the mass of the water?', 'It increases by a tiny amount equal to the energy supplied ÷ c²', ['It stays exactly the same', 'It decreases by energy ÷ c²', 'It increases by about 1%'], 'Internal energy has mass; ΔE/c² is around 10⁻¹² kg.', ['C1: energy gained', 'C1: Δm = ΔE/c² tiny'])
N('M', 3, '1.0 kg of water is heated through 80 K (specific heat capacity 4200 J kg⁻¹ K⁻¹). Calculate the increase in its mass, in units of 10⁻¹² kg.' + take('c'), 1.0 * 4200 * 80 / CL ** 2, '10⁻¹² kg',
  f'ΔE = 1.0 × 4200 × 80 = 3.36 × 10⁵ J. Δm = 3.36 × 10⁵ ÷ (3.00 × 10⁸)² = {sf(3.36e5 / CL ** 2)} kg', ['C1: ΔE = mcΔθ', 'C1: Δm = ΔE/c²'], aq='Δm')
N('M', 3, 'In deuterium–tritium fusion, reactants of total mass 5.030 u lose 0.0189 u. What percentage of the mass is converted into energy?', 0.0189 / 5.030 * 100, '%',
  f'Percentage = 0.0189 ÷ 5.030 × 100 = {sf(0.0189 / 5.030 * 100)} %', ['C1: fraction', 'C1: × 100'], aq='percentage')
M('M', 3, 'Why does a nuclear reaction release millions of times more energy per kilogram of fuel than burning a chemical fuel?', 'Nuclear binding energies are millions of electronvolts per nucleon, compared with a few electronvolts per bond', ['Nuclear fuels are denser', 'Chemical reactions are slower', 'Nuclear reactions destroy all of the mass'], 'MeV per reaction compared with eV per reaction.', ['C1: MeV scale', 'C1: eV scale'])
N('M', 3, 'What mass is equivalent to 1.0 MeV? Give your answer in units of 10⁻³⁰ kg.' + take('c') + ' Take 1 MeV = 1.60 × 10⁻¹³ J.', MEV / CL ** 2, '10⁻³⁰ kg',
  f'm = E/c² = 1.60 × 10⁻¹³ ÷ (3.00 × 10⁸)² = {sf(MEV / CL ** 2)} kg', ['C1: MeV to J', 'C1: m = E/c²'], aq='m')
N('M', 3, 'An α-particle has a kinetic energy of 5.3 MeV. Express this in units of 10⁻¹³ J.' + take('e'), 5.3e6 * QE, '10⁻¹³ J',
  'E = 5.3 × 10⁶ × 1.60 × 10⁻¹⁹ = 8.48 × 10⁻¹³ J', ['C1: MeV to eV', 'C1: eV to J'], aq='E')
M('M', 4, 'Which process shows energy turning into mass?', 'A γ-ray photon producing an electron–positron pair', ['An α-particle slowing down in air', 'A nucleus emitting a β-particle', 'An electron and positron annihilating'], 'Pair production creates rest mass from photon energy; annihilation is the reverse.', ['C1: pair production', 'C1: photon energy ≥ 2mₑc²', 'C1: annihilation is the reverse'])
N('M', 3, 'A reactor delivers 3.0 GW of thermal power. Calculate the mass converted into energy each second, in units of 10⁻⁸ kg.' + take('c'), 3.0e9 / CL ** 2, '10⁻⁸ kg',
  f'Δm per second = P/c² = 3.0 × 10⁹ ÷ (3.00 × 10⁸)² = {sf(3e9 / CL ** 2)} kg', ['C1: E = Pt', 'C1: Δm = E/c²'], aq='Δm')
# hard
N('H', 5, 'The Sun radiates 3.85 × 10²⁶ W and has a mass of 2.0 × 10³⁰ kg. (a) Calculate the mass it loses each second. (b) Calculate the mass lost in 1.0 × 10¹⁰ years (1 year = 3.16 × 10⁷ s). (c) Calculate this as a fraction of the Sun\'s mass. Give only the answer to (c).' + take('c'), 3.85e26 / CL ** 2 * 1e10 * 3.16e7 / 2.0e30, None,
  f'(a) 3.85 × 10²⁶ ÷ (3.00 × 10⁸)² = {sf(3.85e26 / CL ** 2, 4)} kg s⁻¹. (b) {sf(3.85e26 / CL ** 2, 4)} × 1.0 × 10¹⁰ × 3.16 × 10⁷ = {sf(3.85e26 / CL ** 2 * 3.16e17, 4)} kg. (c) {sf(3.85e26 / CL ** 2 * 3.16e17, 4)} ÷ 2.0 × 10³⁰ = {sf(3.85e26 / CL ** 2 * 3.16e17 / 2e30)}',
  ['C1: Δm/t = P/c²', 'C1: total time', 'M1: ratio', 'C1: value'], aq='fraction')
N('H', 6, 'An electron and a positron, each with negligible kinetic energy, annihilate into two photons. (a) Explain why two photons are produced, not one. (b) Calculate the energy of each photon in MeV. (c) Calculate the wavelength of each photon. Give only the answer to (b).' + take('me', 'c') + ' Take 1 MeV = 1.60 × 10⁻¹³ J.', mev(ME), 'MeV',
  f'(a) Total momentum is zero, so the photons must travel in opposite directions. (b) E = mₑc² = 9.11 × 10⁻³¹ × (3.00 × 10⁸)² = {sf(ME * CL ** 2, 4)} J; in MeV: {sf(ME * CL ** 2, 4)} ÷ 1.60 × 10⁻¹³ = {sf(mev(ME))}. (c) λ = hc/E ≈ 2.4 × 10⁻¹² m',
  ['B1: momentum conservation', 'C1: E = mₑc² each', 'C1: value in J', 'C1: in MeV', 'C1: wavelength'], aq='E')
N('H', 5, 'A gamma photon of energy 3.0 MeV produces an electron–positron pair. (a) Calculate the rest energy of an electron in MeV. (b) Calculate the total kinetic energy of the pair.' + take('me', 'c') + ' Take 1 MeV = 1.60 × 10⁻¹³ J.', 3.0 - mev(2 * ME), 'MeV',
  f'(a) mₑc² = 9.11 × 10⁻³¹ × (3.00 × 10⁸)² ÷ 1.60 × 10⁻¹³ = {sf(mev(ME), 4)} MeV. (b) Ek = 3.0 − 2 × {sf(mev(ME), 4)} = {sf(3.0 - mev(2 * ME))} MeV',
  ['C1: rest energy', 'M1: two rest energies', 'C1: subtraction', 'C1: value'], aq='Ek')
N('H', 6, 'A power station supplies 1.2 GW of electrical power with an efficiency of 35%. (a) Calculate the thermal power. (b) Calculate the energy released in one day. (c) Calculate the mass converted into energy each day, in kg.' + take('c'), 1.2e9 / 0.35 * 86400 / CL ** 2, 'kg',
  f'(a) 1.2 × 10⁹ ÷ 0.35 = {sf(1.2e9 / 0.35, 4)} W. (b) E = {sf(1.2e9 / 0.35, 4)} × 86400 = {sf(1.2e9 / 0.35 * 86400, 4)} J. (c) Δm = {sf(1.2e9 / 0.35 * 86400, 4)} ÷ (3.00 × 10⁸)² = {sf(1.2e9 / 0.35 * 86400 / CL ** 2)} kg',
  ['C1: thermal power', 'C1: seconds in a day', 'C1: energy', 'M1: Δm = E/c²', 'C1: value'], aq='Δm')
N('H', 5, 'In one fission, uranium-235 (235.0439 u) absorbs a neutron (1.0087 u) and produces barium-141 (140.9144 u), krypton-92 (91.9262 u) and three neutrons. (a) Calculate the mass defect in u. (b) Calculate the energy released in MeV, taking 1 u as 931.5 MeV.', (235.0439 + 1.0087 - (140.9144 + 91.9262 + 3 * 1.0087)) * UMEV, 'MeV',
  f'(a) Δm = (235.0439 + 1.0087) − (140.9144 + 91.9262 + 3 × 1.0087) = {sf(235.0439 + 1.0087 - (140.9144 + 91.9262 + 3 * 1.0087), 4)} u. (b) E = {sf(235.0439 + 1.0087 - (140.9144 + 91.9262 + 3 * 1.0087), 4)} × 931.5 = {sf((235.0439 + 1.0087 - (140.9144 + 91.9262 + 3 * 1.0087)) * UMEV)} MeV',
  ['C1: mass before', 'C1: mass after', 'M1: × 931.5', 'C1: value'], aq='E')
N('H', 6, 'Deuterium (2.0141 u) and tritium (3.0160 u) fuse to give helium-4 (4.0026 u) and a neutron (1.0087 u). (a) Calculate the energy released per reaction in J. (b) Calculate the mass of fuel used per reaction in kg. (c) Calculate the energy released per kilogram of fuel, in units of 10¹⁴ J kg⁻¹.' + take('u', 'c'), (2.0141 + 3.0160 - 4.0026 - 1.0087) * U * CL ** 2 / ((2.0141 + 3.0160) * U), '10¹⁴ J kg⁻¹',
  f'(a) Δm = 5.0301 − 5.0113 = 0.0188 u = {sf(0.0188 * U, 4)} kg; E = {sf(0.0188 * U, 4)} × (3.00 × 10⁸)² = {sf(0.0188 * U * CL ** 2, 4)} J. (b) 5.0301 × 1.66 × 10⁻²⁷ = {sf(5.0301 * U, 4)} kg. (c) {sf(0.0188 * U * CL ** 2, 4)} ÷ {sf(5.0301 * U, 4)} = {sf(0.0188 * CL ** 2 / 5.0301)} J kg⁻¹',
  ['C1: mass defect', 'C1: E = Δmc²', 'C1: fuel mass', 'M1: energy ÷ mass', 'C1: value'], aq='E per kg')
N('H', 5, 'Burning coal releases about 30 MJ per kg; fission of uranium-235 releases about 8.2 × 10¹³ J per kg. (a) Calculate (energy per kg from fission) ÷ (energy per kg from coal). (b) Explain the size of the ratio in terms of the energies involved.', 8.2e13 / 30e6, None,
  f'(a) 8.2 × 10¹³ ÷ 30 × 10⁶ = {sf(8.2e13 / 30e6)}. (b) Each fission releases about 200 MeV; each chemical bond change releases only a few eV.',
  ['C1: same units', 'M1: ratio', 'C1: value', 'B1: MeV compared with eV'], aq='ratio')
N('H', 5, 'A 1.0 kg mass is lifted 10 m (g = 9.81 m s⁻²). (a) Calculate the gain in gravitational potential energy. (b) Calculate the corresponding increase in the mass of the Earth–mass system. Give only the answer to (b), in units of 10⁻¹⁵ kg.' + take('c'), 1.0 * 9.81 * 10 / CL ** 2, '10⁻¹⁵ kg',
  f'(a) ΔE = mgh = 1.0 × 9.81 × 10 = 98.1 J. (b) Δm = 98.1 ÷ (3.00 × 10⁸)² = {sf(98.1 / CL ** 2)} kg',
  ['C1: mgh', 'M1: Δm = ΔE/c²', 'C1: substitution', 'C1: value'], aq='Δm')
N('H', 6, 'An electron and a positron each have 1.0 MeV of kinetic energy when they meet head-on and annihilate into two photons of equal energy. (a) Calculate the rest energy of each particle in MeV. (b) Calculate the energy of each photon. (c) Calculate the photon wavelength in units of 10⁻¹³ m.' + take('me', 'c', 'h') + ' Take 1 MeV = 1.60 × 10⁻¹³ J.', HP * CL / ((mev(ME) + 1.0) * MEV), '10⁻¹³ m',
  f'(a) mₑc² = 9.11 × 10⁻³¹ × (3.00 × 10⁸)² ÷ 1.60 × 10⁻¹³ = {sf(mev(ME), 4)} MeV. (b) Each photon: {sf(mev(ME), 4)} + 1.0 = {sf(mev(ME) + 1.0, 4)} MeV. (c) λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ ({sf(mev(ME) + 1.0, 4)} × 1.60 × 10⁻¹³) = {sf(HP * CL / ((mev(ME) + 1.0) * MEV))} m',
  ['C1: rest energy', 'M1: total energy shared', 'C1: photon energy', 'C1: MeV to J', 'C1: λ = hc/E'], aq='λ')
N('E', 2, 'A nuclear battery loses 2.0 × 10⁻¹⁴ kg of mass as energy. Calculate the energy released, in kJ.' + take('c'), 2.0e-14 * CL ** 2 / 1e3, 'kJ',
  f'E = mc² = 2.0 × 10⁻¹⁴ × (3.00 × 10⁸)² = {sf(2e-14 * CL ** 2)} J. In kJ: {sf(2e-14 * CL ** 2, 4)} ÷ 10³ = {sf(2e-14 * CL ** 2 / 1e3)}', ['C1: E = mc² then convert'], sig=2, aq='E')

# ═════════════════════════ 29.3 Energy released in radioactive decay (17/19/8) ═════════════════════════
lesson('29.3')
N('E', 2, 'In an α decay the mass decreases by 0.0060 u. Taking 1 u as equivalent to 931.5 MeV, calculate the energy released.', 0.0060 * UMEV, 'MeV',
  f'E = 0.0060 × 931.5 = {sf(0.006 * UMEV)} MeV', ['C1: × 931.5'], aq='E')
M('E', 1, 'Where does the energy released in an α decay mainly go?', 'Into the kinetic energy of the α-particle and the recoiling daughter nucleus', ['Into the mass of the α-particle', 'Into heating the nucleus before decay', 'Into the electrons of the atom only'], 'The mass loss Δm × c² becomes kinetic energy (and sometimes a γ-ray).')
N('E', 2, 'An α-particle is emitted with 4.8 MeV of kinetic energy. Express this energy in units of 10⁻¹³ J.' + take('e'), 4.8e6 * QE, '10⁻¹³ J',
  'E = 4.8 × 10⁶ × 1.60 × 10⁻¹⁹ = 7.68 × 10⁻¹³ J', ['C1: MeV to J'], aq='E')
M('E', 1, 'In an α decay, why does the α-particle receive most of the kinetic energy?', 'Momentum is shared equally and opposite, so the much lighter α-particle moves much faster', ['The daughter nucleus absorbs energy', 'α-particles are charged', 'The daughter nucleus is always at rest'], 'Equal momenta: Ek = p²/2m is largest for the smallest mass.')
N('E', 2, 'An α-particle (mass 6.64 × 10⁻²⁷ kg) has 5.0 MeV of kinetic energy. Calculate its speed in units of 10⁷ m s⁻¹.' + take('e'), sqrt(2 * 5.0e6 * QE / 6.64e-27), '10⁷ m s⁻¹',
  f'Ek = 5.0 × 10⁶ × 1.60 × 10⁻¹⁹ = 8.0 × 10⁻¹³ J. v = √(2 × 8.0 × 10⁻¹³ ÷ 6.64 × 10⁻²⁷) = {sf(sqrt(2 * 8e-13 / 6.64e-27))} m s⁻¹', ['C1: ½mv² = Ek'], aq='v')
M('E', 1, 'Why do β-particles from one isotope have a continuous range of energies?', 'The energy released is shared between the β-particle and an (anti)neutrino', ['Some β-particles are slowed by the nucleus', 'The nucleus has many energy levels', 'β-particles collide with each other'], 'The sharing varies from decay to decay.')
N('E', 2, 'A free neutron decays, releasing 0.78 MeV. Express this energy in units of 10⁻¹³ J.' + take('e'), 0.78e6 * QE, '10⁻¹³ J',
  f'E = 0.78 × 10⁶ × 1.60 × 10⁻¹⁹ = {sf(0.78e6 * QE)} J', ['C1: MeV to J'], aq='E')
M('E', 1, 'Why is a γ-ray often emitted just after an α or β decay?', 'The daughter nucleus is left in an excited state and drops to its ground state', ['The parent nucleus emits it before decaying', 'The α-particle emits it as it slows', 'The electrons of the atom emit it'], 'Nuclei have energy levels; γ-photons carry away the excess.')
N('E', 2, 'Cobalt-60 emits γ-rays of energy 1.17 MeV. Calculate their wavelength in units of 10⁻¹² m.' + take('h', 'c', 'e'), HP * CL / (1.17e6 * QE), '10⁻¹² m',
  f'E = 1.17 × 10⁶ × 1.60 × 10⁻¹⁹ = {sf(1.17e6 * QE, 4)} J. λ = hc/E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ {sf(1.17e6 * QE, 4)} = {sf(HP * CL / (1.17e6 * QE))} m', ['C1: λ = hc/E'], aq='λ')
M('E', 1, 'A decay can happen spontaneously only if', 'the total mass of the products is less than the mass of the parent', ['the products are heavier than the parent', 'the parent is at a high temperature', 'energy is supplied from outside'], 'The mass decrease supplies the energy released.')
N('E', 2, 'Polonium-210 (209.9829 u) decays into lead-206 (205.9745 u) and an α-particle (4.0026 u). Calculate the mass decrease in u.', 209.9829 - 205.9745 - 4.0026, 'u',
  'Δm = 209.9829 − (205.9745 + 4.0026) = 0.0058 u', ['C1: parent − products'], sig=2, aq='Δm')
M('E', 1, 'How does the total rest mass of the products of a decay compare with the rest mass of the parent?', 'It is smaller', ['It is larger', 'It is equal', 'It can be larger or smaller'], 'Energy is released, so Δm = E/c² is lost.')
N('E', 2, 'The decay of polonium-210 has a mass decrease of 0.0058 u. Taking 1 u as 931.5 MeV, calculate the energy released.', 0.0058 * UMEV, 'MeV',
  f'E = 0.0058 × 931.5 = {sf(0.0058 * UMEV)} MeV', ['C1: × 931.5'], aq='E')
M('E', 1, 'Which quantity is shared equally (in size) between an α-particle and the daughter nucleus when a stationary nucleus decays?', 'Momentum', ['Kinetic energy', 'Speed', 'Mass'], 'The parent was at rest, so the momenta are equal and opposite.')
N('E', 2, 'A source undergoes 3.7 × 10¹⁰ decays per second, each releasing 2.0 MeV that is absorbed. Calculate the heating power in mW.' + take('e'), 3.7e10 * 2.0e6 * QE * 1e3, 'mW',
  f'P = 3.7 × 10¹⁰ × 2.0 × 10⁶ × 1.60 × 10⁻¹⁹ = {sf(3.7e10 * 2e6 * QE, 4)} W. In mW: {sf(3.7e10 * 2e6 * QE, 4)} × 10³ = {sf(3.7e10 * 2e6 * QE * 1e3)}', ['C1: power = decays per second × energy'], aq='P')
N('E', 2, 'In an α decay the α-particle has nucleon number 4 and the daughter nucleon number 222. Calculate (kinetic energy of the α-particle) ÷ (kinetic energy of the daughter).', 222 / 4, None,
  'Equal momenta and Ek = p²/2m, so the ratio = 222 ÷ 4 = 55.5', ['C1: Ek ∝ 1/m for equal p'], sig=3, aq='ratio')
N('E', 1, 'The β-particles from tritium have a maximum energy of 0.0186 MeV. Express this in keV.', 0.0186 * 1e3, 'keV',
  'E = 0.0186 × 10³ = 18.6 keV', [], aq='E')
# medium
N('M', 3, 'Radium-226 decays to radon-222 by α emission, releasing 4.87 MeV. Calculate the kinetic energy of the α-particle, assuming the radium was at rest.', 4.87 * 222 / 226, 'MeV',
  f'The α-particle takes the fraction 222/226 of the energy: Ek = 4.87 × 222 ÷ 226 = {sf(4.87 * 222 / 226)} MeV', ['M1: momentum shared equally', 'C1: fraction 222/226'], aq='Ek')
N('M', 4, 'An α-particle (4 u) leaves a nucleus at rest with a speed of 1.5 × 10⁷ m s⁻¹. The daughter has a mass of 222 u. Calculate the recoil speed of the daughter.', 4 / 222 * 1.5e7, 'm s⁻¹',
  f'Momentum: 222 × v = 4 × 1.5 × 10⁷, so v = 4 × 1.5 × 10⁷ ÷ 222 = {sf(4 / 222 * 1.5e7)} m s⁻¹', ['M1: total momentum zero', 'C1: equation', 'C1: value'], aq='v')
M('M', 3, 'Why do α-particles from one isotope all have the same energy, while β-particles have a spread of energies?', 'α decay produces two bodies sharing momentum in a fixed way; β decay produces three bodies (including a neutrino)', ['β-particles lose energy in the nucleus', 'α-particles are heavier so cannot lose energy', 'β decay releases no fixed energy'], 'Two-body decay fixes the energies; three-body decay allows any share.', ['C1: α two-body', 'C1: β three-body with neutrino'])
N('M', 3, 'Carbon-14 β decay releases 0.156 MeV. What is the greatest possible kinetic energy of the emitted electron, in units of 10⁻¹⁴ J?' + take('e'), 0.156e6 * QE, '10⁻¹⁴ J',
  f'When the antineutrino gets almost nothing, Ek(max) ≈ 0.156 × 10⁶ × 1.60 × 10⁻¹⁹ = {sf(0.156e6 * QE)} J', ['M1: maximum when neutrino energy ≈ 0', 'C1: MeV to J'], aq='Ek(max)')
N('M', 3, 'The atomic masses of carbon-14 and nitrogen-14 are 14.003242 u and 14.003074 u. Using atomic masses for β⁻ decay, calculate the energy released, taking 1 u as 931.5 MeV.', (14.003242 - 14.003074) * UMEV, 'MeV',
  f'Δm = 14.003242 − 14.003074 = 0.000168 u. E = 0.000168 × 931.5 = {sf(0.000168 * UMEV)} MeV', ['C1: mass difference', 'C1: × 931.5'], aq='E')
N('M', 3, 'A plutonium-238 power source has an activity of 1.0 × 10¹⁵ Bq, and each decay releases 5.5 MeV. Calculate the heat output in W.' + take('e'), 1.0e15 * 5.5e6 * QE, 'W',
  f'P = 1.0 × 10¹⁵ × 5.5 × 10⁶ × 1.60 × 10⁻¹⁹ = {sf(1e15 * 5.5e6 * QE)} W', ['C1: energy per decay in J', 'C1: × decays per second'], aq='P')
M('M', 3, 'After an α decay, a daughter nucleus emits a γ-ray of fixed energy. What does this show?', 'Nuclei have discrete energy levels', ['The daughter is unstable to β decay', 'Energy is not conserved in decay', 'The α-particle has a continuous spectrum'], 'Fixed γ energies match differences between nuclear levels.', ['C1: discrete γ energy', 'C1: nuclear energy levels'])
N('M', 3, 'A radon sample undergoes 1.0 × 10¹² decays, each releasing 5.6 MeV. Calculate the total energy released.' + take('e'), 1.0e12 * 5.6e6 * QE, 'J',
  f'E = 1.0 × 10¹² × 5.6 × 10⁶ × 1.60 × 10⁻¹⁹ = {sf(1e12 * 5.6e6 * QE)} J', ['C1: energy per decay', 'C1: × number of decays'], aq='E')
N('M', 3, 'Caesium-137 sources emit γ-rays of 0.662 MeV. Calculate their frequency in units of 10²⁰ Hz.' + take('e', 'h'), 0.662e6 * QE / HP, '10²⁰ Hz',
  f'E = 0.662 × 10⁶ × 1.60 × 10⁻¹⁹ = {sf(0.662e6 * QE, 4)} J. f = E/h = {sf(0.662e6 * QE, 4)} ÷ 6.63 × 10⁻³⁴ = {sf(0.662e6 * QE / HP)} Hz', ['C1: MeV to J', 'C1: f = E/h'], aq='f')
M('M', 3, 'In β⁻ decay, the energy released is shared between which particles?', 'The electron, the antineutrino and (a little) the recoiling nucleus', ['The electron only', 'The electron and a neutrino only, never the nucleus', 'The proton and the neutron'], 'Three bodies share energy and momentum.', ['C1: electron and antineutrino', 'C1: recoil small'])
N('M', 4, 'An α-particle of 5.0 MeV is stopped in air, losing on average 35 eV for each ion pair it produces. How many ion pairs does it produce?', 5.0e6 / 35, None,
  f'N = 5.0 × 10⁶ ÷ 35 = {sf(5e6 / 35)}', ['C1: MeV to eV', 'C1: energy ÷ energy per pair', 'C1: value'], aq='N')
N('M', 3, 'An α source of activity 2.0 × 10⁹ Bq emits 5.0 MeV α-particles, all absorbed in its casing. Calculate the heating power in mW.' + take('e'), 2.0e9 * 5.0e6 * QE * 1e3, 'mW',
  f'P = 2.0 × 10⁹ × 5.0 × 10⁶ × 1.60 × 10⁻¹⁹ = {sf(2e9 * 5e6 * QE, 4)} W. In mW: {sf(2e9 * 5e6 * QE, 4)} × 10³ = {sf(2e9 * 5e6 * QE * 1e3)}', ['C1: energy per decay', 'C1: power'], sig=2, aq='P')
M('M', 3, 'Why is the kinetic energy of the recoiling daughter in α decay usually ignored?', 'Its large mass means it takes only a few per cent of the energy', ['It has no momentum', 'It is uncharged', 'It decays again at once'], 'Ek(daughter)/Ek(α) = mα/m(daughter).', ['C1: equal momenta', 'C1: Ek inversely proportional to mass'])
N('M', 3, 'In an α decay the α-particle (4 u) gets 4.78 MeV and the daughter has mass 222 u. Calculate the kinetic energy of the daughter in keV.', 4.78 * 4 / 222 * 1e3, 'keV',
  f'Ek(daughter) = 4.78 × 4 ÷ 222 = {sf(4.78 * 4 / 222, 4)} MeV. In keV: {sf(4.78 * 4 / 222, 4)} × 10³ = {sf(4.78 * 4 / 222 * 1e3)}', ['C1: Ek ∝ 1/m', 'C1: MeV to keV'], aq='Ek')
N('M', 3, 'A positron from β⁺ decay annihilates with an electron, both nearly at rest. The rest energy of each is 0.511 MeV. Calculate the total γ-ray energy produced.', 2 * 0.511, 'MeV',
  'E = 2 × 0.511 = 1.022 MeV', ['C1: two rest energies', 'C1: total'], sig=4, aq='E')
M('M', 3, 'Which type of decay causes the largest decrease in the mass of the nucleus?', 'α decay', ['β⁻ decay', 'β⁺ decay', 'γ emission'], 'α decay removes 4 nucleons; β and γ change the mass only slightly.', ['C1: α removes 4 u', 'C1: others small'])
N('M', 3, 'A free neutron (1.008665 u) decays into a proton (1.007276 u) and an electron (0.000549 u). Taking 1 u as 931.5 MeV, calculate the energy released.', (1.008665 - 1.007276 - 0.000549) * UMEV, 'MeV',
  f'Δm = 1.008665 − 1.007276 − 0.000549 = {sf(1.008665 - 1.007276 - 0.000549, 4)} u. E = {sf(1.008665 - 1.007276 - 0.000549, 4)} × 931.5 = {sf((1.008665 - 1.007276 - 0.000549) * UMEV)} MeV', ['C1: mass difference', 'C1: × 931.5'], aq='E')
N('M', 4, 'Americium-241 at rest decays to neptunium-237 by α emission. Calculate (speed of the α-particle) ÷ (speed of the neptunium nucleus).', 237 / 4, None,
  'Equal momenta: 4v(α) = 237v(Np), so the ratio = 237 ÷ 4 = 59.25', ['M1: momentum conservation', 'C1: masses in u', 'C1: ratio'], sig=4, aq='ratio')
M('M', 3, 'A graph of the number of β-particles against their kinetic energy is drawn for one isotope. What shape is it?', 'A continuous curve from zero up to a maximum energy', ['A single sharp line', 'Several sharp lines', 'A flat line at all energies'], 'The energy is shared with the antineutrino in varying amounts.', ['C1: continuous', 'C1: maximum energy = Q'])
# hard
N('H', 5, 'Uranium-238 (238.0508 u) decays to thorium-234 (234.0436 u) by emitting an α-particle (4.0026 u). (a) Calculate the mass decrease in u. (b) Calculate the energy released in MeV, taking 1 u as 931.5 MeV. (c) Calculate the kinetic energy of the α-particle. Give only the answer to (c).', (238.0508 - 234.0436 - 4.0026) * UMEV * 234 / 238, 'MeV',
  f'(a) Δm = 238.0508 − 234.0436 − 4.0026 = 0.0046 u. (b) E = 0.0046 × 931.5 = {sf(0.0046 * UMEV, 4)} MeV. (c) Ek(α) = {sf(0.0046 * UMEV, 4)} × 234 ÷ 238 = {sf(0.0046 * UMEV * 234 / 238)} MeV',
  ['C1: mass decrease', 'C1: energy', 'M1: share 234/238', 'C1: value'], aq='Ek')
N('H', 6, 'Polonium-212 at rest decays to lead-208, emitting an α-particle of kinetic energy 6.0 MeV. (a) Calculate the kinetic energy of the lead nucleus in MeV. (b) Calculate the mass of the lead nucleus in kg (1 u = 1.66 × 10⁻²⁷ kg). (c) Calculate its recoil speed. Give only the answer to (c).' + take('e'), sqrt(2 * 6.0 * 4 / 208 * 1e6 * QE / (208 * U)), 'm s⁻¹',
  f'(a) Ek = 6.0 × 4 ÷ 208 = {sf(6.0 * 4 / 208, 4)} MeV = {sf(6.0 * 4 / 208 * 1e6 * QE, 4)} J. (b) m = 208 × 1.66 × 10⁻²⁷ = {sf(208 * U, 4)} kg. (c) v = √(2 × {sf(6.0 * 4 / 208 * 1e6 * QE, 4)} ÷ {sf(208 * U, 4)}) = {sf(sqrt(2 * 6.0 * 4 / 208 * 1e6 * QE / (208 * U)))} m s⁻¹',
  ['M1: Ek ∝ 1/m', 'C1: Ek of lead', 'C1: J conversion', 'C1: mass', 'C1: speed'], aq='v')
N('H', 5, 'A radioisotope power source contains plutonium-238 with an activity of 6.3 × 10¹⁴ Bq. Each decay releases 5.6 MeV, and 6.0% of the heat is turned into electrical energy. (a) Calculate the heat output. (b) Calculate the electrical power.' + take('e'), 6.3e14 * 5.6e6 * QE * 0.060, 'W',
  f'(a) P = 6.3 × 10¹⁴ × 5.6 × 10⁶ × 1.60 × 10⁻¹⁹ = {sf(6.3e14 * 5.6e6 * QE, 4)} W. (b) 0.060 × {sf(6.3e14 * 5.6e6 * QE, 4)} = {sf(6.3e14 * 5.6e6 * QE * 0.06)} W',
  ['C1: energy per decay', 'C1: heat output', 'M1: × efficiency', 'C1: value'], aq='P')
N('H', 6, 'Cobalt-60 β⁻ decays to an excited state of nickel-60, which emits γ-rays of 1.17 MeV and 1.33 MeV in turn. (a) Calculate the total γ energy per decay. (b) Calculate the wavelength of the 1.33 MeV γ-ray. Give only the answer to (b), in units of 10⁻¹³ m.' + take('h', 'c', 'e'), HP * CL / (1.33e6 * QE), '10⁻¹³ m',
  f'(a) 1.17 + 1.33 = 2.50 MeV. (b) E = 1.33 × 10⁶ × 1.60 × 10⁻¹⁹ = {sf(1.33e6 * QE, 4)} J; λ = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ {sf(1.33e6 * QE, 4)} = {sf(HP * CL / (1.33e6 * QE))} m',
  ['C1: total', 'C1: MeV to J', 'M1: λ = hc/E', 'C1: substitution', 'C1: value'], aq='λ')
N('H', 5, 'A radium source of activity 3.7 × 10¹⁰ Bq releases 4.87 MeV per decay, all absorbed by 50 g of water (specific heat capacity 4200 J kg⁻¹ K⁻¹). (a) Calculate the energy absorbed in one hour. (b) Calculate the temperature rise of the water.' + take('e'), 3.7e10 * 4.87e6 * QE * 3600 / (0.050 * 4200), 'K',
  f'(a) E = 3.7 × 10¹⁰ × 4.87 × 10⁶ × 1.60 × 10⁻¹⁹ × 3600 = {sf(3.7e10 * 4.87e6 * QE * 3600, 4)} J. (b) ΔT = {sf(3.7e10 * 4.87e6 * QE * 3600, 4)} ÷ (0.050 × 4200) = {sf(3.7e10 * 4.87e6 * QE * 3600 / 210)} K',
  ['C1: energy per second', 'C1: × 3600', 'M1: ΔT = E/mc', 'C1: value'], aq='ΔT')
N('H', 6, 'Fluorine-18 decays by β⁺ emission, releasing 0.63 MeV. The positron then annihilates with an electron, both effectively at rest (rest energy 0.511 MeV each). (a) Calculate the energy of each annihilation photon. (b) Calculate the total energy released per fluorine-18 decay, including the annihilation.', 0.63 + 2 * 0.511, 'MeV',
  '(a) Each photon has 0.511 MeV. (b) Total = 0.63 + 2 × 0.511 = 1.652 MeV',
  ['B1: two photons of 0.511 MeV', 'C1: annihilation total 1.022 MeV', 'M1: add decay energy', 'C1: value', 'B1: both particles effectively at rest'], sig=4, aq='E')
N('H', 5, 'Tritium (atomic mass 3.016049 u) β⁻ decays to helium-3 (atomic mass 3.016029 u). (a) Calculate the mass decrease in u. (b) Calculate the energy released in keV, taking 1 u as 931.5 MeV.', (3.016049 - 3.016029) * UMEV * 1e3, 'keV',
  f'(a) Δm = 3.016049 − 3.016029 = 0.000020 u. (b) E = 0.000020 × 931.5 × 10³ = {sf(0.00002 * UMEV * 1e3)} keV',
  ['C1: mass difference', 'M1: × 931.5', 'C1: MeV to keV', 'C1: value'], aq='E')
N('H', 6, 'Radon-222 (222.0176 u) decays into polonium-218 (218.0090 u) and an α-particle (4.0026 u). (a) Calculate the energy released in MeV, taking 1 u as 931.5 MeV. (b) Calculate the kinetic energy of the α-particle. (c) Calculate its speed (α mass 6.64 × 10⁻²⁷ kg). Give only the answer to (c), in units of 10⁷ m s⁻¹.' + take('e'), sqrt(2 * (222.0176 - 218.0090 - 4.0026) * UMEV * 218 / 222 * 1e6 * QE / 6.64e-27), '10⁷ m s⁻¹',
  f'(a) Δm = 222.0176 − 218.0090 − 4.0026 = 0.0060 u; E = 0.0060 × 931.5 = {sf(0.006 * UMEV, 4)} MeV. (b) Ek = {sf(0.006 * UMEV, 4)} × 218 ÷ 222 = {sf(0.006 * UMEV * 218 / 222, 4)} MeV = {sf(0.006 * UMEV * 218 / 222 * 1e6 * QE, 4)} J. (c) v = √(2 × {sf(0.006 * UMEV * 218 / 222 * 1e6 * QE, 4)} ÷ 6.64 × 10⁻²⁷) = {sf(sqrt(2 * 0.006 * UMEV * 218 / 222 * 1e6 * QE / 6.64e-27))} m s⁻¹',
  ['C1: mass decrease', 'C1: energy', 'C1: α share', 'C1: J conversion', 'C1: speed'], aq='v')

# ═════════════════════════ 29.4 Mass defect and binding energy (17/17/8) ═════════════════════════
lesson('29.4')
N('E', 2, 'In a deuteron, one proton (1.007276 u) is bound to one neutron (1.008665 u). The deuteron\'s mass is 2.013553 u. By how many u is the deuteron lighter than its separate parts?', MPU + MNU - 2.013553, 'u',
  f'Δm = 1.007276 + 1.008665 − 2.013553 = {sf(MPU + MNU - 2.013553, 4)} u', ['C1: nucleons − nucleus'], sig=4, aq='Δm')
M('E', 1, 'What is the binding energy of a nucleus?', 'The energy needed to separate it completely into its individual protons and neutrons', ['The energy holding electrons in the atom', 'The kinetic energy of the nucleons', 'The energy released when it decays'], 'It equals the mass defect × c².')
N('E', 2, 'The mass defect of a deuterium nucleus is 0.002388 u. Taking 1 u as 931.5 MeV, calculate its binding energy.', 0.002388 * UMEV, 'MeV',
  f'BE = 0.002388 × 931.5 = {sf(0.002388 * UMEV)} MeV', ['C1: × 931.5'], aq='BE')
M('E', 1, 'Near which nucleon number is the binding energy per nucleon greatest?', 'About 56 (iron and nickel)', ['About 4 (helium)', 'About 238 (uranium)', 'About 1 (hydrogen)'], 'The curve peaks at about 8.8 MeV per nucleon near iron-56.')
N('E', 2, 'Oxygen-16 has a binding energy of 127.6 MeV. Calculate its binding energy per nucleon.', 127.6 / 16, 'MeV',
  f'BE per nucleon = 127.6 ÷ 16 = {sf(127.6 / 16)} MeV', ['C1: ÷ nucleon number'], aq='BE/A')
M('E', 1, 'How does the mass of a nucleus compare with the total mass of its separate protons and neutrons?', 'The nucleus has less mass', ['The nucleus has more mass', 'They are equal', 'It depends on the temperature'], 'The difference is the mass defect.')
N('E', 2, 'Uranium-235 has a binding energy per nucleon of 7.59 MeV. Calculate its total binding energy.', 235 * 7.59, 'MeV',
  f'BE = 235 × 7.59 = {sf(235 * 7.59, 4)} MeV', ['C1: × A'], sig=4, aq='BE')
M('E', 1, 'A nucleus with a higher binding energy per nucleon is', 'more stable', ['less stable', 'more radioactive', 'always heavier'], 'Each nucleon is more tightly bound.')
N('E', 2, 'Convert a mass defect of 0.100 u into kilograms, in units of 10⁻²⁸ kg.' + take('u'), 0.100 * U, '10⁻²⁸ kg',
  f'Δm = 0.100 × 1.66 × 10⁻²⁷ = {sf(0.1 * U)} kg', ['C1: × 1.66 × 10⁻²⁷'], aq='Δm')
M('E', 1, 'Why does the fission of a uranium nucleus release energy?', 'The fragments have a higher binding energy per nucleon than uranium', ['The fragments have a lower binding energy per nucleon', 'Neutrons carry energy into the nucleus', 'The nucleus gains mass'], 'Moving towards the peak of the curve releases energy.')
N('E', 2, 'The 92.2 MeV needed to pull a carbon-12 nucleus completely apart is shared among its 12 nucleons. What is the average energy per nucleon, in MeV?', 92.2 / 12, 'MeV',
  f'BE per nucleon = 92.2 ÷ 12 = {sf(92.2 / 12)} MeV', ['C1: ÷ 12'], aq='BE/A')
M('E', 1, 'Which of these nuclei has the lowest binding energy per nucleon?', 'Hydrogen-2', ['Helium-4', 'Iron-56', 'Uranium-238'], 'Deuterium is very weakly bound, at about 1.1 MeV per nucleon.')
N('E', 2, 'Each of the four nucleons in an α-particle is bound by 7.07 MeV on average. What total energy, in MeV, is needed to break the α-particle into separate nucleons?', 4 * 7.07, 'MeV',
  f'BE = 4 × 7.07 = {sf(4 * 7.07, 4)} MeV', ['C1: × A'], sig=4, aq='BE')
M('E', 1, 'In which unit is binding energy per nucleon usually quoted?', 'MeV per nucleon', ['kg per nucleon', 'MeV per second', 'J per kilogram'], 'It is an energy divided by the number of nucleons.')
N('E', 2, 'A helium-4 nucleus is 0.0304 u lighter than its four separate nucleons. Express this mass difference in units of 10⁻²⁹ kg.' + take('u'), 0.0304 * U, '10⁻²⁹ kg',
  f'Δm = 0.0304 × 1.66 × 10⁻²⁷ = {sf(0.0304 * U)} kg', ['C1: × 1.66 × 10⁻²⁷'], aq='Δm')
N('E', 2, 'Lithium-7 has a binding energy of 39.2 MeV. How much energy, in units of 10⁻¹² J, is needed to separate it into its nucleons?' + take('e'), 39.2e6 * QE, '10⁻¹² J',
  f'E = 39.2 × 10⁶ × 1.60 × 10⁻¹⁹ = {sf(39.2e6 * QE)} J', ['C1: MeV to J'], aq='E')
N('E', 1, 'Nickel-62 is the most tightly bound nucleus known, with 8.79 MeV per nucleon. How much energy, in MeV, would separate all 62 of its nucleons?', 62 * 8.79, 'MeV',
  f'BE = 62 × 8.79 = {sf(62 * 8.79, 4)} MeV', [], sig=4, aq='BE')
# medium
N('M', 3, 'A lithium-7 nucleus (3 protons, 4 neutrons) has a mass of 7.014357 u. Taking a proton as 1.007276 u and a neutron as 1.008665 u, calculate the mass defect in u.', 3 * MPU + 4 * MNU - 7.014357, 'u',
  f'Δm = 3 × 1.007276 + 4 × 1.008665 − 7.014357 = {sf(3 * MPU + 4 * MNU - 7.014357, 4)} u', ['C1: mass of nucleons', 'C1: subtract nucleus'], sig=4, aq='Δm')
N('M', 4, 'The mass defect of lithium-7 is 0.04213 u. Taking 1 u as 931.5 MeV, calculate its binding energy per nucleon.', 0.04213 * UMEV / 7, 'MeV',
  f'BE = 0.04213 × 931.5 = {sf(0.04213 * UMEV, 4)} MeV. BE/A = {sf(0.04213 * UMEV, 4)} ÷ 7 = {sf(0.04213 * UMEV / 7)} MeV', ['C1: BE from Δm', 'C1: ÷ 7', 'C1: units'], aq='BE/A')
N('M', 3, 'A carbon-12 nucleus (6 protons, 6 neutrons) has a mass of 11.996709 u. Taking a proton as 1.007276 u, a neutron as 1.008665 u and 1 u as 931.5 MeV, calculate its binding energy.', (6 * MPU + 6 * MNU - 11.996709) * UMEV, 'MeV',
  f'Δm = 6 × 1.007276 + 6 × 1.008665 − 11.996709 = {sf(6 * MPU + 6 * MNU - 11.996709, 5)} u. BE = {sf(6 * MPU + 6 * MNU - 11.996709, 5)} × 931.5 = {sf((6 * MPU + 6 * MNU - 11.996709) * UMEV)} MeV', ['C1: mass defect', 'C1: × 931.5'], aq='BE')
M('M', 3, 'Why must energy be supplied to separate a nucleus into its nucleons?', 'The strong nuclear force holds the nucleons together; work must be done against it', ['The nucleons repel each other', 'Gravity holds the nucleus together', 'Electrons hold the nucleons together'], 'The work done equals the binding energy.', ['C1: strong force attractive', 'C1: work done = BE'])
N('M', 3, 'Two deuterium nuclei (binding energy 2.22 MeV each) fuse to form helium-4 (binding energy 28.3 MeV). Calculate the energy released.', 28.3 - 2 * 2.22, 'MeV',
  'E = 28.3 − 2 × 2.22 = 23.86 MeV', ['M1: BE(products) − BE(reactants)', 'C1: two deuterons'], sig=4, aq='E')
N('M', 4, 'Uranium-236 (binding energy 7.6 MeV per nucleon) splits into barium-141 (8.3 MeV per nucleon), krypton-92 (8.7 MeV per nucleon) and three neutrons. Calculate the energy released.', 141 * 8.3 + 92 * 8.7 - 236 * 7.6, 'MeV',
  f'E = 141 × 8.3 + 92 × 8.7 − 236 × 7.6 = {sf(141 * 8.3 + 92 * 8.7 - 236 * 7.6, 4)} MeV', ['C1: BE of fragments', 'C1: BE of uranium', 'C1: difference'], sig=4, aq='E')
M('M', 3, 'From the binding energy per nucleon curve, which process can release energy?', 'Fusion of light nuclei and fission of heavy nuclei', ['Only fusion of heavy nuclei', 'Only fission of light nuclei', 'Fission of iron nuclei'], 'Both move nuclei towards the peak near A = 56.', ['C1: light nuclei fuse', 'C1: heavy nuclei split'])
N('M', 3, 'A nucleus has a binding energy of 1784 MeV. Taking 1 u as 931.5 MeV, calculate its mass defect in u.', 1784 / UMEV, 'u',
  f'Δm = 1784 ÷ 931.5 = {sf(1784 / UMEV)} u', ['C1: Δm = BE ÷ 931.5', 'C1: value'], aq='Δm')
M('M', 3, 'Which reaction releases energy?', 'Two light nuclei combining into a nucleus with a higher binding energy per nucleon', ['A nucleus near iron splitting into two lighter nuclei', 'A heavy nucleus absorbing a proton to become heavier still', 'Two iron nuclei fusing'], 'Energy is released when the products are more tightly bound.', ['C1: increase in BE per nucleon', 'C1: releases energy'])
N('M', 3, 'Helium-4 has a binding energy of 28.30 MeV and helium-3 a binding energy of 7.72 MeV. How much energy is needed to remove one neutron from helium-4?', 28.30 - 7.72, 'MeV',
  'E = 28.30 − 7.72 = 20.58 MeV', ['M1: difference in binding energies', 'C1: value'], sig=4, aq='E')
N('M', 4, 'Iron-56 contains 26 protons and 30 neutrons, and its nucleus has a mass of 55.920674 u. With mₚ = 1.007276 u, mₙ = 1.008665 u and 1 u equivalent to 931.5 MeV, find the binding energy per nucleon.', (26 * MPU + 30 * MNU - 55.920674) * UMEV / 56, 'MeV',
  f'Δm = 26 × 1.007276 + 30 × 1.008665 − 55.920674 = {sf(26 * MPU + 30 * MNU - 55.920674, 5)} u. BE = {sf(26 * MPU + 30 * MNU - 55.920674, 5)} × 931.5 = {sf((26 * MPU + 30 * MNU - 55.920674) * UMEV, 5)} MeV. BE/A = {sf((26 * MPU + 30 * MNU - 55.920674) * UMEV, 5)} ÷ 56 = {sf((26 * MPU + 30 * MNU - 55.920674) * UMEV / 56)} MeV',
  ['C1: mass defect', 'C1: BE', 'C1: ÷ 56'], aq='BE/A')
M('M', 3, 'Why does the binding energy per nucleon decrease for very heavy nuclei?', 'The electrostatic repulsion between the many protons grows, while the strong force acts only between near neighbours', ['Heavy nuclei have fewer neutrons', 'The strong force gets stronger with distance', 'Gravity pulls the nucleons apart'], 'Coulomb repulsion acts across the whole nucleus.', ['C1: proton repulsion long range', 'C1: strong force short range'])
N('M', 3, 'A nucleus has a mass defect of 5.0 × 10⁻²⁹ kg. Calculate its binding energy in units of 10⁻¹² J.' + take('c'), 5.0e-29 * CL ** 2, '10⁻¹² J',
  'BE = Δm c² = 5.0 × 10⁻²⁹ × (3.00 × 10⁸)² = 4.5 × 10⁻¹² J', ['C1: E = mc²', 'C1: value'], sig=2, aq='BE')
N('M', 3, 'How strongly, on average, is each nucleon held in uranium-238, whose total binding energy is 1802 MeV? Give the binding energy per nucleon in MeV.', 1802 / 238, 'MeV',
  f'BE/A = 1802 ÷ 238 = {sf(1802 / 238)} MeV', ['C1: ÷ 238', 'C1: value'], aq='BE/A')
M('M', 3, 'Which statement about the mass defect is correct?', 'It is the difference between the mass of the separate nucleons and the mass of the nucleus', ['It is the mass of the electrons in the atom', 'It is the mass lost when a nucleus decays', 'It is negative for stable nuclei'], 'Δm = Zmₚ + Nmₙ − M(nucleus).', ['C1: definition', 'C1: positive for bound nuclei'])
N('M', 4, 'Deuterium (binding energy 2.22 MeV) and tritium (binding energy 8.48 MeV) fuse into helium-4 (binding energy 28.30 MeV) and a neutron. Calculate the energy released.', 28.30 - 2.22 - 8.48, 'MeV',
  'E = 28.30 − (2.22 + 8.48) = 17.6 MeV', ['M1: BE after − BE before', 'C1: neutron has no binding energy', 'C1: value'], aq='E')
N('M', 3, 'Helium-3 is made of two protons and one neutron; its nucleus has a mass of 3.014932 u. With mₚ = 1.007276 u, mₙ = 1.008665 u and 1 u equivalent to 931.5 MeV, how much energy binds it together?', (2 * MPU + MNU - 3.014932) * UMEV, 'MeV',
  f'Δm = 2 × 1.007276 + 1.008665 − 3.014932 = {sf(2 * MPU + MNU - 3.014932, 4)} u. BE = {sf(2 * MPU + MNU - 3.014932, 4)} × 931.5 = {sf((2 * MPU + MNU - 3.014932) * UMEV)} MeV', ['C1: mass defect', 'C1: × 931.5'], aq='BE')
# hard
N('H', 5, 'An oxygen-16 nucleus (8 protons, 8 neutrons) has a mass of 15.990526 u. Taking a proton as 1.007276 u, a neutron as 1.008665 u and 1 u as 931.5 MeV: (a) calculate the mass defect; (b) calculate the binding energy; (c) calculate the binding energy per nucleon. Give only the answer to (c).', (8 * MPU + 8 * MNU - 15.990526) * UMEV / 16, 'MeV',
  f'(a) Δm = 8 × 1.007276 + 8 × 1.008665 − 15.990526 = {sf(8 * MPU + 8 * MNU - 15.990526, 5)} u. (b) BE = {sf(8 * MPU + 8 * MNU - 15.990526, 5)} × 931.5 = {sf((8 * MPU + 8 * MNU - 15.990526) * UMEV, 4)} MeV. (c) {sf((8 * MPU + 8 * MNU - 15.990526) * UMEV, 4)} ÷ 16 = {sf((8 * MPU + 8 * MNU - 15.990526) * UMEV / 16)} MeV',
  ['C1: nucleon masses', 'C1: mass defect', 'C1: BE', 'C1: ÷ 16'], aq='BE/A')
N('H', 6, 'In one fission, uranium-236 (binding energy 7.59 MeV per nucleon) splits into xenon-140 (8.29 MeV per nucleon), strontium-94 (8.59 MeV per nucleon) and two neutrons. (a) Calculate the total binding energy of uranium-236. (b) Calculate the total binding energy of the fragments. (c) Calculate the energy released. Give only the answer to (c).', 140 * 8.29 + 94 * 8.59 - 236 * 7.59, 'MeV',
  f'(a) 236 × 7.59 = {sf(236 * 7.59, 5)} MeV. (b) 140 × 8.29 + 94 × 8.59 = {sf(140 * 8.29 + 94 * 8.59, 5)} MeV. (c) {sf(140 * 8.29 + 94 * 8.59, 5)} − {sf(236 * 7.59, 5)} = {sf(140 * 8.29 + 94 * 8.59 - 236 * 7.59)} MeV',
  ['C1: BE of U', 'C1: BE of Xe', 'C1: BE of Sr', 'M1: difference', 'C1: value'], aq='E')
N('H', 5, 'Fusing two deuterium nuclei (2.0141 u each) into helium-4 releases 23.8 MeV. (a) Calculate the number of deuterium nuclei in 1.0 kg. (b) Calculate the energy released when 1.0 kg of deuterium is fused, in units of 10¹⁴ J.' + take('u') + ' Take 1 MeV = 1.60 × 10⁻¹³ J.', 1.0 / (2.0141 * U) / 2 * 23.8 * MEV, '10¹⁴ J',
  f'(a) N = 1.0 ÷ (2.0141 × 1.66 × 10⁻²⁷) = {sf(1 / (2.0141 * U), 4)}. (b) Reactions = N ÷ 2; E = {sf(1 / (2.0141 * U), 4)} ÷ 2 × 23.8 × 1.60 × 10⁻¹³ = {sf(1 / (2.0141 * U) / 2 * 23.8 * MEV)} J',
  ['C1: number of nuclei', 'M1: two nuclei per reaction', 'C1: MeV to J', 'C1: value'], aq='E')
N('H', 6, 'Oxygen-16 has a binding energy of 127.6 MeV and nitrogen-15 a binding energy of 115.5 MeV. (a) Explain why removing a proton from oxygen-16 leaves nitrogen-15. (b) Calculate the energy needed to remove one proton from oxygen-16. (c) Compare it with the average binding energy per nucleon of oxygen-16. Give only the answer to (b).', 127.6 - 115.5, 'MeV',
  '(a) Z falls from 8 to 7 and A from 16 to 15. (b) E = 127.6 − 115.5 = 12.1 MeV. (c) It is larger than the average, 127.6 ÷ 16 = 7.98 MeV.',
  ['B1: Z and A change', 'M1: difference of binding energies', 'C1: value', 'C1: average', 'B1: comparison'], aq='E')
N('H', 5, 'Iron-56 has a binding energy of 492 MeV and uranium-238 one of 1802 MeV. (a) Calculate the binding energy per nucleon of each. (b) Calculate (BE per nucleon of iron) − (BE per nucleon of uranium).', 492 / 56 - 1802 / 238, 'MeV',
  f'(a) Iron: 492 ÷ 56 = {sf(492 / 56, 4)} MeV; uranium: 1802 ÷ 238 = {sf(1802 / 238, 4)} MeV. (b) {sf(492 / 56, 4)} − {sf(1802 / 238, 4)} = {sf(492 / 56 - 1802 / 238)} MeV',
  ['C1: iron', 'C1: uranium', 'M1: difference', 'B1: iron more stable'], aq='Δ(BE/A)')
N('H', 6, 'Nickel-58 (28 protons, 30 neutrons) has a binding energy per nucleon of 8.73 MeV. Taking a proton as 1.007276 u, a neutron as 1.008665 u and 1 u as 931.5 MeV: (a) calculate its total binding energy; (b) calculate its mass defect in u; (c) calculate the mass of the nucleus in u. Give only the answer to (c).', 28 * MPU + 30 * MNU - 58 * 8.73 / UMEV, 'u',
  f'(a) BE = 58 × 8.73 = {sf(58 * 8.73, 5)} MeV. (b) Δm = {sf(58 * 8.73, 5)} ÷ 931.5 = {sf(58 * 8.73 / UMEV, 5)} u. (c) M = 28 × 1.007276 + 30 × 1.008665 − {sf(58 * 8.73 / UMEV, 5)} = {sf(28 * MPU + 30 * MNU - 58 * 8.73 / UMEV, 7)} u',
  ['C1: total BE', 'C1: mass defect', 'C1: mass of nucleons', 'M1: subtract', 'C1: value'], sig=7, aq='M')
N('H', 5, 'Each fission of uranium-235 releases 177 MeV. (a) Calculate the number of nuclei in 1.0 kg of uranium-235 (molar mass 0.235 kg mol⁻¹). (b) Calculate the energy released if all of them undergo fission, in units of 10¹³ J.' + take('NA') + ' Take 1 MeV = 1.60 × 10⁻¹³ J.', 1.0 / 0.235 * NA_ * 177 * MEV, '10¹³ J',
  f'(a) N = 1.0 ÷ 0.235 × 6.02 × 10²³ = {sf(1 / 0.235 * NA_, 4)}. (b) E = {sf(1 / 0.235 * NA_, 4)} × 177 × 1.60 × 10⁻¹³ = {sf(1 / 0.235 * NA_ * 177 * MEV)} J',
  ['C1: moles', 'C1: nuclei', 'M1: × energy per fission in J', 'C1: value'], aq='E')
N('H', 6, 'Polonium-210 (binding energy 1645.2 MeV) decays into lead-206 (1622.3 MeV) and helium-4 (28.3 MeV). (a) Calculate the total binding energy of the products. (b) Calculate the energy released in the decay. (c) Explain why the decay can occur. Give only the answer to (b).', 1622.3 + 28.3 - 1645.2, 'MeV',
  '(a) 1622.3 + 28.3 = 1650.6 MeV. (b) E = 1650.6 − 1645.2 = 5.4 MeV. (c) The products are more tightly bound in total, so energy is released.',
  ['C1: products', 'M1: difference', 'C1: value', 'B1: products more tightly bound', 'B1: energy released spontaneously'], sig=2, aq='E')
