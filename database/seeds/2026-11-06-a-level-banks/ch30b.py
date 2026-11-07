# Chapter 30 Medical physics — part b: 30.5 to 30.8.
HP, CL, QE, ME = 6.63e-34, 3.00e8, 1.60e-19, 9.11e-31
LN2 = log(2)
ZU = 'kg m⁻² s⁻¹'


def refl(z1, z2):
    return ((z2 - z1) / (z2 + z1)) ** 2


# ═════════════════════════ 30.5 Ultrasound (17/17/8) ═════════════════════════
lesson('30.5')
N('E', 2, 'An ultrasound probe emits waves of frequency 3.5 MHz into soft tissue, where they travel at 1540 m s⁻¹. Calculate the wavelength in mm.', 1540 / 3.5e6 * 1e3, 'mm',
  f'λ = v/f = 1540 ÷ 3.5 × 10⁶ = {sf(1540 / 3.5e6, 4)} m. In mm: {sf(1540 / 3.5e6, 4)} × 10³ = {sf(1540 / 3.5e6 * 1e3)}', ['C1: λ = v/f'], aq='λ')
M('E', 1, 'Which description of ultrasound is correct?', 'Sound with a frequency above about 20 kHz, the upper limit of human hearing', ['Electromagnetic waves above 20 kHz', 'Sound below 20 Hz', 'Very loud audible sound'], 'Medical ultrasound typically uses 1–15 MHz.')
N('E', 2, 'Fat has a density of 920 kg m⁻³ and ultrasound travels through it at 1450 m s⁻¹. Calculate its specific acoustic impedance in units of 10⁶ kg m⁻² s⁻¹.', 920 * 1450, '10⁶ kg m⁻² s⁻¹',
  f'Z = ρc = 920 × 1450 = {sf(920 * 1450)} kg m⁻² s⁻¹', ['C1: Z = ρc'], aq='Z')
M('E', 1, 'How does a piezoelectric crystal produce ultrasound?', 'An alternating p.d. makes the crystal vibrate at the same frequency', ['Heating the crystal makes it emit sound', 'Light falling on it makes it vibrate', 'A steady p.d. makes it spin'], 'The crystal changes shape with the applied p.d.')
N('E', 2, 'Ultrasound passes from muscle (Z = 1.70 × 10⁶ kg m⁻² s⁻¹) into bone (Z = 7.80 × 10⁶ kg m⁻² s⁻¹). Calculate the intensity reflection coefficient.', refl(1.70, 7.80), None,
  f'α = (Z₂ − Z₁)² ÷ (Z₂ + Z₁)² = (7.80 − 1.70)² ÷ (7.80 + 1.70)² = {sf(refl(1.70, 7.80))}', ['C1: reflection coefficient formula'], aq='α')
M('E', 1, 'What property of two materials decides how much ultrasound is reflected at their boundary?', 'The difference between their acoustic impedances', ['The difference between their temperatures', 'Their colours', 'Their electrical resistances'], 'Large impedance differences give strong reflections.')
N('E', 2, 'A transducer produces ultrasound with a wavelength of 0.50 mm in tissue where the speed is 1500 m s⁻¹. Calculate the frequency in MHz.', 1500 / 0.50e-3 / 1e6, 'MHz',
  'f = v/λ = 1500 ÷ 0.50 × 10⁻³ = 3.0 × 10⁶ Hz. In MHz: 3.0 × 10⁶ ÷ 10⁶ = 3.0', ['C1: f = v/λ'], sig=2, aq='f')
M('E', 1, 'Why is a coupling gel put on the skin before an ultrasound scan?', 'It removes the air gap, which would reflect almost all the ultrasound', ['It cools the skin', 'It increases the frequency', 'It absorbs the ultrasound'], 'Air has a tiny acoustic impedance compared with skin.')
N('E', 2, 'A reflection coefficient at a boundary is 0.0040. What fraction of the incident intensity is transmitted?', 1 - 0.0040, None,
  'Transmitted = 1 − 0.0040 = 0.9960', ['C1: 1 − α'], sig=4, aq='fraction')
M('E', 1, 'In which unit is specific acoustic impedance measured?', 'kg m⁻² s⁻¹', ['kg m⁻³', 'm s⁻¹', 'Pa'], 'Z = ρc: kg m⁻³ × m s⁻¹.')
N('E', 2, 'Bone has an acoustic impedance of 7.8 × 10⁶ kg m⁻² s⁻¹ and a density of 1900 kg m⁻³. Calculate the speed of ultrasound in bone.', 7.8e6 / 1900, 'm s⁻¹',
  f'c = Z/ρ = 7.8 × 10⁶ ÷ 1900 = {sf(7.8e6 / 1900)} m s⁻¹', ['C1: c = Z/ρ'], aq='c')
M('E', 1, 'How does a piezoelectric transducer detect returning ultrasound?', 'The echo makes the crystal vibrate, producing an alternating p.d. across it', ['The echo heats the crystal', 'The echo changes its colour', 'The echo makes it emit light'], 'The piezoelectric effect works both ways.')
N('E', 2, 'Ultrasound of frequency 5.0 MHz has a wavelength of 0.31 mm in muscle. Calculate the speed of ultrasound in muscle.', 5.0e6 * 0.31e-3, 'm s⁻¹',
  f'v = fλ = 5.0 × 10⁶ × 0.31 × 10⁻³ = {sf(5e6 * 0.31e-3)} m s⁻¹', ['C1: v = fλ'], aq='v')
M('E', 1, 'Why is ultrasound thought to be safer than X-rays for scanning a fetus?', 'It is not ionising radiation', ['It travels faster than X-rays', 'It has a shorter wavelength', 'It cannot be absorbed by tissue'], 'At diagnostic intensities ultrasound does not ionise atoms.')
N('E', 2, 'A water bath used for ultrasound tests has ρ = 1000 kg m⁻³, and sound crosses it at 1500 m s⁻¹. What is the specific acoustic impedance of the water, in units of 10⁶ kg m⁻² s⁻¹?', 1000 * 1500, '10⁶ kg m⁻² s⁻¹',
  'Z = ρc = 1000 × 1500 = 1.5 × 10⁶ kg m⁻² s⁻¹', ['C1: Z = ρc'], sig=2, aq='Z')
M('E', 1, 'At a boundary between two materials of equal acoustic impedance, how much ultrasound is reflected?', 'None', ['All of it', 'Half of it', 'It depends only on the frequency'], 'α = (Z₂ − Z₁)²/(Z₂ + Z₁)² = 0 when Z₁ = Z₂.')
N('E', 1, 'Ultrasound of frequency 2.5 MHz travels at 1500 m s⁻¹. Calculate its wavelength in mm.', 1500 / 2.5e6 * 1e3, 'mm',
  'λ = 1500 ÷ 2.5 × 10⁶ = 6.0 × 10⁻⁴ m. In mm: 6.0 × 10⁻⁴ × 10³ = 0.60', [], sig=2, aq='λ')
# medium
N('M', 3, 'Ultrasound meets a boundary between soft tissue (Z = 1.63 × 10⁶ kg m⁻² s⁻¹) and fat (Z = 1.33 × 10⁶ kg m⁻² s⁻¹). Calculate the percentage of the intensity reflected.', refl(1.63, 1.33) * 100, '%',
  f'α = (1.33 − 1.63)² ÷ (1.33 + 1.63)² = {sf(refl(1.63, 1.33), 4)}. Percentage = {sf(refl(1.63, 1.33), 4)} × 100 = {sf(refl(1.63, 1.33) * 100)} %', ['C1: formula', 'C1: × 100'], aq='percentage')
N('M', 4, 'Ultrasound passes from air (Z = 430 kg m⁻² s⁻¹) into skin (Z = 1.7 × 10⁶ kg m⁻² s⁻¹). Calculate the fraction of the intensity transmitted into the skin.', 1 - refl(430, 1.7e6), None,
  f'α = (1.7 × 10⁶ − 430)² ÷ (1.7 × 10⁶ + 430)² = {sf(refl(430, 1.7e6), 6)}. Transmitted = 1 − {sf(refl(430, 1.7e6), 6)} = {sf(1 - refl(430, 1.7e6))}',
  ['C1: reflection coefficient', 'C1: very close to 1', 'C1: transmitted = 1 − α'], aq='fraction')
M('M', 3, 'Why is a gel chosen whose acoustic impedance is close to that of skin?', 'So that very little ultrasound is reflected at the probe–skin boundary', ['So that the gel absorbs the ultrasound', 'So that the frequency increases', 'So that the skin is not heated'], 'Matched impedances give nearly complete transmission.', ['C1: impedance matching', 'C1: little reflection'])
N('M', 3, 'Soft tissue has an acoustic impedance of 1.63 × 10⁶ kg m⁻² s⁻¹ and the speed of ultrasound in it is 1540 m s⁻¹. Calculate its density.', 1.63e6 / 1540, 'kg m⁻³',
  f'ρ = Z/c = 1.63 × 10⁶ ÷ 1540 = {sf(1.63e6 / 1540)} kg m⁻³', ['C1: Z = ρc', 'C1: rearranged'], aq='ρ')
N('M', 3, 'At a boundary 32% of the incident ultrasound intensity is reflected. The incident intensity is 50 mW cm⁻². Calculate the transmitted intensity in mW cm⁻².', 50 * 0.68, 'mW cm⁻²',
  'Transmitted = (1 − 0.32) × 50 = 34 mW cm⁻²', ['C1: 1 − α', 'C1: × incident'], sig=2, aq='I')
M('M', 3, 'Why does a higher ultrasound frequency give finer detail in an image?', 'The wavelength is shorter, so smaller structures can be resolved', ['It travels faster', 'It penetrates further', 'It is reflected more strongly at every boundary'], 'Resolution is limited to roughly one wavelength.', ['C1: λ = v/f smaller', 'C1: finer resolution'])
N('M', 3, 'Ultrasound in tissue is attenuated with an attenuation coefficient of 46 m⁻¹. What fraction of the intensity remains after travelling 30 mm?', exp(-46 * 0.030), None,
  f'I/I₀ = e^(−46 × 0.030) = {sf(exp(-46 * 0.03))}', ['C1: I = I₀e^(−kx)', 'C1: mm to m'], aq='fraction')
N('M', 4, 'Ultrasound travels 40 mm to a boundary and 40 mm back through tissue with attenuation coefficient 50 m⁻¹. At the boundary 1.0% of the intensity is reflected. What fraction of the original intensity returns to the probe?', exp(-50 * 0.080) * 0.010, None,
  f'Fraction = 0.010 × e^(−50 × 0.080) = {sf(0.01 * exp(-4.0))}', ['M1: total path 80 mm', 'C1: attenuation factor', 'C1: × reflection'], aq='fraction')
M('M', 3, 'Why is ultrasound almost completely reflected at a tissue–bone boundary?', 'Bone has a much larger acoustic impedance than soft tissue', ['Bone absorbs all ultrasound', 'Bone has a lower density than tissue', 'Ultrasound cannot travel in solids'], 'The large difference in Z gives a large α.', ['C1: large ΔZ', 'C1: large reflection'])
N('M', 3, 'Muscle has a density of 1075 kg m⁻³ and an acoustic impedance of 1.71 × 10⁶ kg m⁻² s⁻¹. Calculate the wavelength of 4.0 MHz ultrasound in muscle, in mm.', 1.71e6 / 1075 / 4.0e6 * 1e3, 'mm',
  f'c = Z/ρ = 1.71 × 10⁶ ÷ 1075 = {sf(1.71e6 / 1075, 4)} m s⁻¹. λ = {sf(1.71e6 / 1075, 4)} ÷ 4.0 × 10⁶ = {sf(1.71e6 / 1075 / 4e6, 4)} m. In mm: {sf(1.71e6 / 1075 / 4e6, 4)} × 10³ = {sf(1.71e6 / 1075 / 4e6 * 1e3)}',
  ['C1: c = Z/ρ', 'C1: λ = c/f', 'C1: m to mm'], aq='λ')
N('M', 3, 'A probe emits pulses of 4 complete cycles at 2.0 MHz. Calculate the duration of each pulse in µs.', 4 / 2.0e6 * 1e6, 'µs',
  'T = 1 ÷ 2.0 × 10⁶ = 5.0 × 10⁻⁷ s. Pulse = 4 × 5.0 × 10⁻⁷ = 2.0 × 10⁻⁶ s, which in µs is 2.0 × 10⁻⁶ × 10⁶ = 2.0', ['C1: period', 'C1: × 4'], sig=2, aq='duration')
M('M', 3, 'Why is a lower frequency used to image organs deep in the body?', 'Lower-frequency ultrasound is attenuated less, so it penetrates further', ['It gives better resolution', 'It is reflected more strongly', 'It travels faster'], 'Attenuation rises with frequency, so depth and resolution trade off.', ['C1: less attenuation', 'C1: trade-off with resolution'])
N('M', 3, 'Calculate the intensity reflection coefficient at a boundary between blood (Z = 1.59 × 10⁶ kg m⁻² s⁻¹) and muscle (Z = 1.71 × 10⁶ kg m⁻² s⁻¹).', refl(1.59, 1.71), None,
  f'α = (1.71 − 1.59)² ÷ (1.71 + 1.59)² = {sf(refl(1.59, 1.71))}', ['C1: formula', 'C1: substitution'], aq='α')
M('M', 4, 'What is the purpose of the backing block behind the piezoelectric crystal in a transducer?', 'To damp the vibrations quickly so that short pulses are produced', ['To make the crystal vibrate for longer', 'To focus the beam', 'To cool the crystal'], 'Short pulses give good resolution along the beam.', ['C1: damping', 'C1: short pulses', 'C1: better depth resolution'])
N('M', 3, 'A crystal resonates when its thickness is half a wavelength. Ultrasound travels at 4000 m s⁻¹ in the crystal. What thickness gives a 2.0 MHz resonance, in mm?', 4000 / 2.0e6 / 2 * 1e3, 'mm',
  'λ = 4000 ÷ 2.0 × 10⁶ = 2.0 × 10⁻³ m. Thickness = 2.0 × 10⁻³ ÷ 2 = 1.0 × 10⁻³ m, which in mm is 1.0 × 10⁻³ × 10³ = 1.0', ['C1: λ in crystal', 'C1: half of it'], sig=2, aq='t')
# hard
N('H', 5, 'A probe sends ultrasound through gel (Z = 1.50 × 10⁶ kg m⁻² s⁻¹) into skin (Z = 1.70 × 10⁶ kg m⁻² s⁻¹). (a) Calculate the reflection coefficient at the gel–skin boundary. (b) Without gel, air (Z = 430 kg m⁻² s⁻¹) would be between them. Calculate the reflection coefficient at an air–skin boundary. (c) Calculate (fraction transmitted with gel) ÷ (fraction transmitted with air). Give only the answer to (c).', (1 - refl(1.50, 1.70)) / (1 - refl(430e-6, 1.70)), None,
  f'(a) ((1.70 − 1.50) ÷ (1.70 + 1.50))² = {sf(refl(1.5, 1.7), 4)}. (b) ((1.7 × 10⁶ − 430) ÷ (1.7 × 10⁶ + 430))² = {sf(refl(430e-6, 1.7), 6)}. (c) (1 − {sf(refl(1.5, 1.7), 4)}) ÷ (1 − {sf(refl(430e-6, 1.7), 6)}) = {sf((1 - refl(1.5, 1.7)) / (1 - refl(430e-6, 1.7)))}',
  ['C1: gel α', 'C1: air α', 'M1: transmitted fractions', 'C1: value'], aq='ratio')
N('H', 6, 'Ultrasound of intensity 2.0 W m⁻² travels 50 mm through tissue (attenuation coefficient 40 m⁻¹) to a tissue–bone boundary that reflects 43% of the intensity. The echo returns along the same path. (a) Calculate the intensity reaching the boundary. (b) Calculate the reflected intensity. (c) Calculate the intensity of the echo arriving back at the probe. Give only the answer to (c), in units of 10⁻² W m⁻².', 2.0 * exp(-40 * 0.050) * 0.43 * exp(-40 * 0.050), '10⁻² W m⁻²',
  f'(a) 2.0 × e^(−40 × 0.050) = {sf(2 * exp(-2), 4)} W m⁻². (b) 0.43 × {sf(2 * exp(-2), 4)} = {sf(0.43 * 2 * exp(-2), 4)} W m⁻². (c) {sf(0.43 * 2 * exp(-2), 4)} × e^(−40 × 0.050) = {sf(0.43 * 2 * exp(-4))} W m⁻²',
  ['C1: outward attenuation', 'C1: reflection', 'C1: return attenuation', 'M1: multiply factors', 'C1: value'], aq='I')
N('H', 5, 'Bone has a density of 1900 kg m⁻³ and ultrasound travels in it at 4100 m s⁻¹; soft tissue has Z = 1.63 × 10⁶ kg m⁻² s⁻¹. (a) Calculate the acoustic impedance of bone. (b) Calculate the percentage of intensity reflected at a tissue–bone boundary.', refl(1.63e6, 1900 * 4100) * 100, '%',
  f'(a) Z = 1900 × 4100 = {sf(1900 * 4100)} kg m⁻² s⁻¹. (b) ((7.79 × 10⁶ − 1.63 × 10⁶) ÷ (7.79 × 10⁶ + 1.63 × 10⁶))² × 100 = {sf(refl(1.63e6, 1900 * 4100) * 100)} %',
  ['C1: Z = ρc', 'M1: α formula', 'C1: substitution', 'C1: value'], aq='percentage')
N('H', 6, 'A 5.0 MHz probe is used on tissue in which ultrasound travels at 1540 m s⁻¹ and the attenuation coefficient is 0.50 dB cm⁻¹ per MHz. (a) Calculate the wavelength in mm. (b) Calculate the total attenuation, in dB, for a round trip to a depth of 6.0 cm. (c) Explain why a lower frequency might be chosen. Give only the answer to (b).', 0.50 * 5.0 * 12.0, 'dB',
  f'(a) λ = 1540 ÷ 5.0 × 10⁶ = {sf(1540 / 5e6, 4)} m, which is {sf(1540 / 5e6 * 1e3, 3)} mm. (b) Attenuation = 0.50 × 5.0 × 12.0 = 30 dB. (c) Lower frequency is attenuated less, giving a stronger echo from deep tissue, at the cost of resolution.',
  ['C1: λ', 'M1: dB per cm at 5.0 MHz', 'C1: round trip 12 cm', 'C1: value', 'B1: trade-off'], sig=2, aq='attenuation')
N('H', 5, 'Ultrasound crosses fat (Z = 1.38 × 10⁶ kg m⁻² s⁻¹) into muscle (Z = 1.70 × 10⁶ kg m⁻² s⁻¹). (a) Calculate the reflection coefficient. (b) Calculate the fraction of the incident intensity that is transmitted into the muscle and then, after reflecting completely from a deeper bone, transmitted back into the fat. Give only the answer to (b).', (1 - refl(1.38, 1.70)) ** 2, None,
  f'(a) α = ((1.70 − 1.38) ÷ (1.70 + 1.38))² = {sf(refl(1.38, 1.70), 4)}. (b) The boundary is crossed twice: (1 − {sf(refl(1.38, 1.70), 4)})² = {sf((1 - refl(1.38, 1.70)) ** 2)}',
  ['C1: α', 'M1: transmission twice', 'C1: substitution', 'C1: value'], aq='fraction')
N('H', 6, 'An A-scan probe uses a 2.0 MHz pulse lasting 3 cycles in tissue where v = 1540 m s⁻¹. (a) Calculate the pulse duration. (b) Calculate the length of the pulse in the tissue, in mm. (c) Explain why two boundaries closer than about half this length cannot be separated. Give only the answer to (b).', 3 / 2.0e6 * 1540 * 1e3, 'mm',
  f'(a) t = 3 ÷ 2.0 × 10⁶ = 1.5 × 10⁻⁶ s. (b) L = 1540 × 1.5 × 10⁻⁶ = {sf(1540 * 1.5e-6, 4)} m. In mm: {sf(1540 * 1.5e-6, 4)} × 10³ = {sf(1540 * 1.5e-6 * 1e3)}. (c) Their echoes overlap in time.',
  ['C1: duration', 'M1: length = vt', 'C1: m to mm', 'C1: value', 'B1: overlapping echoes'], aq='L')
N('H', 5, 'The intensity of an ultrasound beam falls to 25% of its initial value after passing through 4.0 cm of tissue. (a) Calculate the attenuation coefficient in cm⁻¹. (b) Calculate the distance over which the intensity halves, in cm.', 4.0 / 2, 'cm',
  f'(a) 0.25 = e^(−4.0k), so k = ln 4 ÷ 4.0 = {sf(log(4) / 4, 4)} cm⁻¹. (b) Halving distance = ln 2 ÷ {sf(log(4) / 4, 4)} = 2.0 cm',
  ['M1: exponential equation', 'C1: k', 'M1: ln 2/k', 'C1: value'], sig=2, aq='x½')
N('H', 6, 'An ultrasound beam passes from soft tissue (Z = 1.63 × 10⁶ kg m⁻² s⁻¹) into a kidney (Z = 1.65 × 10⁶ kg m⁻² s⁻¹). (a) Calculate the reflection coefficient. (b) Explain why such a weak echo can still be detected. (c) Calculate the reflected intensity if the incident intensity is 0.50 W m⁻², in units of 10⁻⁵ W m⁻². Give only the answer to (c).', 0.50 * refl(1.63, 1.65), '10⁻⁵ W m⁻²',
  f'(a) α = ((1.65 − 1.63) ÷ (1.65 + 1.63))² = {sf(refl(1.63, 1.65), 4)}. (b) The receiver is very sensitive and the echoes are amplified electronically. (c) 0.50 × {sf(refl(1.63, 1.65), 4)} = {sf(0.5 * refl(1.63, 1.65))} W m⁻²',
  ['C1: α', 'B1: sensitive detection / amplification', 'M1: I = α I₀', 'C1: substitution', 'C1: value'], aq='I')

N('E', 2, 'Ultrasound of frequency 8.0 MHz is used to image an eye, where it travels at 1530 m s⁻¹. Calculate the wavelength in mm.', 1530 / 8.0e6 * 1e3, 'mm',
  f'λ = v/f = 1530 ÷ 8.0 × 10⁶ = {sf(1530 / 8e6, 4)} m. In mm: {sf(1530 / 8e6, 4)} × 10³ = {sf(1530 / 8e6 * 1e3)}', ['C1: λ = v/f'], aq='λ')
N('E', 2, 'At one boundary the intensity reflection coefficient is 0.43. What percentage of the incident intensity passes on through the boundary?', (1 - 0.43) * 100, '%',
  'Transmitted = (1 − 0.43) × 100 = 57 %', ['C1: 1 − α'], sig=2, aq='percentage')

# ═════════════════════════ 30.6 Echo sounding (17/19/8) ═════════════════════════
lesson('30.6')
N('E', 2, 'An echo from a boundary in tissue returns 80 µs after the pulse is sent. The speed of ultrasound in tissue is 1540 m s⁻¹. Calculate the depth of the boundary in mm.', 1540 * 80e-6 / 2 * 1e3, 'mm',
  f'd = vt/2 = 1540 × 80 × 10⁻⁶ ÷ 2 = {sf(1540 * 80e-6 / 2, 4)} m. In mm: {sf(1540 * 80e-6 / 2, 4)} × 10³ = {sf(1540 * 80e-6 / 2 * 1e3)}', ['C1: d = vt/2'], aq='d')
M('E', 1, 'Why is the time for an echo halved when finding the depth of a boundary?', 'The pulse travels to the boundary and back again', ['The speed halves on the way back', 'Only half of the pulse is reflected', 'The detector records twice'], 'The total path is twice the depth.')
N('E', 2, 'A ship\'s sonar pulse returns from the sea bed after 0.40 s. Sound travels at 1500 m s⁻¹ in sea water. Calculate the depth of the sea.', 1500 * 0.40 / 2, 'm',
  'd = vt/2 = 1500 × 0.40 ÷ 2 = 300 m', ['C1: d = vt/2'], sig=2, aq='d')
M('E', 1, 'What does an A-scan display?', 'The strength of the echoes against time, as peaks on a trace', ['A two-dimensional picture of a slice', 'A moving three-dimensional image', 'The colour of the tissue'], 'Peak positions give the depths of boundaries along one line.')
N('E', 2, 'A boundary is 45 mm deep in tissue where v = 1500 m s⁻¹. Calculate the time for its echo to return, in µs.', 2 * 0.045 / 1500 * 1e6, 'µs',
  't = 2d/v = 2 × 0.045 ÷ 1500 = 6.0 × 10⁻⁵ s. In µs: 6.0 × 10⁻⁵ × 10⁶ = 60', ['C1: t = 2d/v'], sig=2, aq='t')
M('E', 1, 'Why is ultrasound sent as short pulses rather than continuously for echo sounding?', 'So that each echo can be timed before the next pulse is sent', ['To save electrical energy', 'To make the waves travel faster', 'To make the echoes louder'], 'The time from emission to echo gives the depth.')
N('E', 2, 'A bat emits a click and hears the echo from a wall 0.020 s later. Sound travels at 340 m s⁻¹ in air. How far away is the wall?', 340 * 0.020 / 2, 'm',
  'd = 340 × 0.020 ÷ 2 = 3.4 m', ['C1: d = vt/2'], sig=2, aq='d')
M('E', 1, 'What does the height of a peak on an A-scan indicate?', 'The strength of the echo from that boundary', ['The depth of the boundary', 'The frequency of the ultrasound', 'The speed of sound in that tissue'], 'Depth comes from the time; height from the amount reflected and attenuation.')
N('E', 2, 'On an A-scan, an echo appears 0.12 ms after the transmitted pulse. If v = 1540 m s⁻¹, calculate the depth of the boundary in cm.', 1540 * 0.12e-3 / 2 * 100, 'cm',
  f'd = 1540 × 0.12 × 10⁻³ ÷ 2 = {sf(1540 * 0.12e-3 / 2, 4)} m. In cm: {sf(1540 * 0.12e-3 / 2, 4)} × 100 = {sf(1540 * 0.12e-3 / 2 * 100)}', ['C1: d = vt/2'], aq='d')
M('E', 1, 'Which quantity must be known to convert echo times into depths?', 'The speed of ultrasound in the tissue', ['The frequency of the ultrasound', 'The intensity of the ultrasound', 'The acoustic impedance of the gel'], 'The depth is d = vt/2, so the speed v in the tissue is needed.')
N('E', 2, 'A fishing boat\'s echo sounder detects a shoal of fish 60 m below. Taking the speed of sound in water as 1500 m s⁻¹, calculate the echo time.', 2 * 60 / 1500, 's',
  't = 2d/v = 2 × 60 ÷ 1500 = 0.080 s', ['C1: t = 2d/v'], sig=2, aq='t')
M('E', 1, 'Two echoes from one pulse arrive at different times. What does the later echo show?', 'A boundary deeper below the probe', ['A stronger reflection', 'A higher frequency', 'A slower pulse'], 'Larger echo time means larger depth.')
N('E', 2, 'Ultrasound of frequency 40 kHz is used by a parking sensor; sound travels at 340 m s⁻¹. Calculate its wavelength in mm.', 340 / 40e3 * 1e3, 'mm',
  'λ = 340 ÷ 40 × 10³ = 8.5 × 10⁻³ m. In mm: 8.5 × 10⁻³ × 10³ = 8.5', ['C1: λ = v/f'], sig=2, aq='λ')
M('E', 1, 'Why must the pulse repetition rate of an echo sounder not be too high?', 'Each echo must return before the next pulse is sent, or the echoes become confused', ['The probe would melt', 'The frequency would change', 'The speed of sound would fall'], 'Deep targets need more time between pulses.')
N('E', 2, 'The time base of an A-scan display is 20 µs per division. An echo is 3.5 divisions after the transmitted pulse. Calculate the echo time in µs.', 3.5 * 20, 'µs',
  't = 3.5 × 20 = 70 µs', ['C1: divisions × time base'], sig=2, aq='t')
N('E', 2, 'An echo returns from a depth of 7.5 cm in tissue after 100 µs. Calculate the speed of ultrasound in the tissue.', 2 * 0.075 / 100e-6, 'm s⁻¹',
  'v = 2d/t = 2 × 0.075 ÷ 100 × 10⁻⁶ = 1500 m s⁻¹', ['C1: v = 2d/t'], sig=2, aq='v')
N('E', 1, 'Sonar on a submarine detects an echo after 1.2 s. Sound travels at 1500 m s⁻¹ in the sea. How far away is the object?', 1500 * 1.2 / 2, 'm',
  'd = 1500 × 1.2 ÷ 2 = 900 m', [], sig=2, aq='d')
# medium
N('M', 3, 'The A-scan shows echoes from the front and back of an organ at 40 µs and 105 µs after the transmitted pulse. Taking v = 1540 m s⁻¹, calculate the thickness of the organ in mm.', 1540 * (105 - 40) * 1e-6 / 2 * 1e3, 'mm',
  f'Δt = 105 − 40 = 65 µs. Thickness = 1540 × 65 × 10⁻⁶ ÷ 2 = {sf(1540 * 65e-6 / 2, 4)} m. In mm: {sf(1540 * 65e-6 / 2, 4)} × 10³ = {sf(1540 * 65e-6 / 2 * 1e3)}', ['C1: time difference', 'C1: d = vΔt/2'], aq='thickness')
N('M', 3, 'An echo sounder must detect objects up to 15 cm deep in tissue (v = 1540 m s⁻¹). What is the greatest pulse repetition frequency it can use, in kHz?', 1540 / (2 * 0.15) / 1e3, 'kHz',
  f'Round trip time = 2 × 0.15 ÷ 1540 = {sf(0.30 / 1540, 4)} s. f = 1 ÷ {sf(0.30 / 1540, 4)} = {sf(1540 / 0.30, 4)} Hz. In kHz: {sf(1540 / 0.30, 4)} ÷ 10³ = {sf(1540 / 0.30 / 1e3)}', ['C1: round-trip time', 'C1: f = 1/t'], aq='f')
M('M', 3, 'An echo appears earlier on an A-scan than expected because the tissue has a higher speed of sound than assumed. What effect does this have on the measured depth?', 'The calculated depth is smaller than the real depth', ['The calculated depth is larger than the real depth', 'The depth is unaffected', 'The echo disappears'], 'The machine uses an assumed v; a faster medium returns echoes sooner.', ['C1: shorter time', 'C1: underestimate'])
N('M', 3, 'For ultrasound of wavelength 0.40 mm, the smallest separation of two boundaries that can be distinguished is about half a wavelength. Calculate this separation in mm.', 0.40 / 2, 'mm',
  'Separation ≈ λ/2 = 0.40 ÷ 2 = 0.20 mm', ['C1: λ/2', 'C1: value'], sig=2, aq='Δx')
N('M', 4, 'An echo from the far side of a 4.0 cm thick organ returns 52 µs after the echo from its near side. Calculate the speed of ultrasound in the organ.', 2 * 0.040 / 52e-6, 'm s⁻¹',
  f'v = 2d/Δt = 2 × 0.040 ÷ 52 × 10⁻⁶ = {sf(2 * 0.04 / 52e-6)} m s⁻¹', ['M1: extra path 2d', 'C1: Δt in s', 'C1: value'], aq='v')
M('M', 3, 'Why can ultrasound not be used to image the lungs?', 'Air in the lungs reflects almost all the ultrasound at the tissue boundary', ['Lungs absorb no ultrasound', 'Ultrasound cannot reach the chest', 'The lungs move too slowly'], 'The impedance mismatch between tissue and air is enormous.', ['C1: air in lungs', 'C1: total reflection'])
N('M', 3, 'A ship sends a sonar pulse; the echo from a shoal returns after 0.18 s and the echo from the sea bed after 0.52 s. Sound travels at 1500 m s⁻¹ in the sea. Calculate the distance between the shoal and the sea bed.', 1500 * (0.52 - 0.18) / 2, 'm',
  'd = 1500 × (0.52 − 0.18) ÷ 2 = 255 m', ['C1: time difference', 'C1: d = vΔt/2'], sig=3, aq='d')
N('M', 3, 'The A-scan time base is 10 µs per division. An echo is 6.4 divisions after the pulse, and v = 1540 m s⁻¹. Calculate the depth in mm.', 1540 * 64e-6 / 2 * 1e3, 'mm',
  f't = 6.4 × 10 = 64 µs. d = 1540 × 64 × 10⁻⁶ ÷ 2 = {sf(1540 * 64e-6 / 2, 4)} m. In mm: {sf(1540 * 64e-6 / 2, 4)} × 10³ = {sf(1540 * 64e-6 / 2 * 1e3)}', ['C1: time from trace', 'C1: d = vt/2'], aq='d')
M('M', 3, 'A boundary deep in the body gives a much smaller echo than an identical boundary near the surface. Why?', 'The ultrasound is attenuated on its longer path there and back', ['Deep boundaries reflect a smaller fraction', 'The speed of sound is lower deep in the body', 'The frequency changes with depth'], 'Intensity falls exponentially with distance travelled.', ['C1: attenuation', 'C1: longer path'])
N('M', 3, 'A dolphin hears the echo of its click from a fish 0.040 s after sending it. Sound travels at 1500 m s⁻¹ in sea water. How far away is the fish?', 1500 * 0.040 / 2, 'm',
  'd = 1500 × 0.040 ÷ 2 = 30 m', ['C1: round trip', 'C1: value'], sig=2, aq='d')
N('M', 4, 'An echo sounder uses 50 kHz pulses in water (v = 1500 m s⁻¹). Each pulse lasts 10 cycles. Calculate the shortest distance between two objects along the beam whose echoes do not overlap, in cm.', 10 / 50e3 * 1500 / 2 * 100, 'cm',
  f'Pulse length in time = 10 ÷ 50 × 10³ = 2.0 × 10⁻⁴ s. Separation = 1500 × 2.0 × 10⁻⁴ ÷ 2 = {sf(1500 * 2e-4 / 2, 4)} m. In cm: {sf(1500 * 2e-4 / 2, 4)} × 100 = {sf(1500 * 2e-4 / 2 * 100)}',
  ['C1: pulse duration', 'M1: echoes separated by more than the pulse', 'C1: halve for round trip'], sig=2, aq='Δd')
M('M', 3, 'In an A-scan, the first large peak at time zero is', 'the transmitted pulse itself (and the echo from the skin surface)', ['the deepest echo', 'background noise only', 'the echo from bone'], 'Echo times are measured from this reference.', ['C1: transmitted pulse', 'C1: reference time'])
N('M', 3, 'In an echo-location test, a pulse is sent towards a cliff 510 m away and the echo heard 3.0 s later. Calculate the speed of sound in air.', 2 * 510 / 3.0, 'm s⁻¹',
  'v = 2d/t = 2 × 510 ÷ 3.0 = 340 m s⁻¹', ['C1: round trip', 'C1: value'], sig=2, aq='v')
N('M', 3, 'An echo returns from the back of an eye 30 µs after the echo from the front. The speed of sound in the eye is 1530 m s⁻¹. Calculate the length of the eye in mm.', 1530 * 30e-6 / 2 * 1e3, 'mm',
  f'L = 1530 × 30 × 10⁻⁶ ÷ 2 = {sf(1530 * 30e-6 / 2, 4)} m. In mm: {sf(1530 * 30e-6 / 2, 4)} × 10³ = {sf(1530 * 30e-6 / 2 * 1e3)}', ['C1: d = vΔt/2', 'C1: m to mm'], aq='L')
M('M', 4, 'An A-scan machine amplifies later echoes more than early ones (time-gain compensation). Why?', 'To make up for the extra attenuation suffered by echoes from deeper boundaries', ['To make deep echoes appear earlier', 'To raise the ultrasound frequency', 'To remove the transmitted pulse'], 'Equal boundaries then give similar peak heights at any depth.', ['C1: attenuation with depth', 'C1: gain increases with time', 'C1: comparable echoes'])
N('M', 3, 'A parking sensor emits 40 kHz pulses and detects an echo from a wall after 6.0 ms. Sound travels at 340 m s⁻¹. How far away is the wall, in cm?', 340 * 6.0e-3 / 2 * 100, 'cm',
  'd = 340 × 6.0 × 10⁻³ ÷ 2 = 1.02 m. In cm: 1.02 × 100 = 102', ['C1: d = vt/2', 'C1: ms and cm'], aq='d')
N('M', 3, 'Calculate the time between an echo from a boundary 30 mm deep and one from a boundary 50 mm deep, in tissue with v = 1500 m s⁻¹, in µs.', 2 * 0.020 / 1500 * 1e6, 'µs',
  'Δt = 2 × (0.050 − 0.030) ÷ 1500 = 2.67 × 10⁻⁵ s. In µs: 2.67 × 10⁻⁵ × 10⁶ = 26.7', ['C1: depth difference', 'C1: Δt = 2Δd/v'], aq='Δt')
M('M', 3, 'Why does echo sounding at sea use much lower frequencies than medical ultrasound?', 'Lower frequencies are attenuated less, so they travel the much greater distances needed', ['Lower frequencies give finer detail', 'Water cannot carry high frequencies at all', 'Lower frequencies travel faster'], 'Range matters more than resolution at sea.', ['C1: attenuation rises with f', 'C1: long range needed'])
# hard
N('H', 5, 'An A-scan of an eye shows echoes at 8.0 µs (front of lens), 13.2 µs (back of lens) and 31.0 µs (retina). The speed of sound is 1640 m s⁻¹ in the lens and 1530 m s⁻¹ elsewhere in the eye. (a) Calculate the thickness of the lens. (b) Calculate the distance from the back of the lens to the retina. Give only the answer to (b), in mm.', 1530 * (31.0 - 13.2) * 1e-6 / 2 * 1e3, 'mm',
  f'(a) 1640 × 5.2 × 10⁻⁶ ÷ 2 = {sf(1640 * 5.2e-6 / 2, 4)} m. (b) 1530 × (31.0 − 13.2) × 10⁻⁶ ÷ 2 = {sf(1530 * 17.8e-6 / 2, 4)} m. In mm: {sf(1530 * 17.8e-6 / 2, 4)} × 10³ = {sf(1530 * 17.8e-6 / 2 * 1e3)}',
  ['C1: lens thickness', 'M1: time difference for vitreous', 'C1: d = vt/2', 'C1: value'], aq='d')
N('H', 6, 'An echo sounder on a boat sends pulses straight down. In shallow water the echo returns after 0.030 s; further out it returns after 0.090 s. Sound travels at 1500 m s⁻¹. (a) Calculate the two depths. (b) The boat travels 400 m between the readings. Calculate the average gradient of the sea bed. (c) Calculate the largest pulse rate that can be used in the deeper water. Give only the answer to (b).', (1500 * 0.090 / 2 - 1500 * 0.030 / 2) / 400, None,
  f'(a) 1500 × 0.030 ÷ 2 = 22.5 m and 1500 × 0.090 ÷ 2 = 67.5 m. (b) (67.5 − 22.5) ÷ 400 = {sf(45 / 400)}. (c) 1 ÷ 0.090 = 11 pulses per second.',
  ['C1: first depth', 'C1: second depth', 'M1: rise ÷ run', 'C1: value', 'C1: pulse rate'], aq='gradient')
N('H', 5, 'Ultrasound pulses of 3.0 MHz are used, each 4 cycles long, in tissue with v = 1540 m s⁻¹. (a) Calculate the wavelength. (b) Calculate the pulse length in the tissue. (c) Estimate the smallest separation of two boundaries along the beam that can be resolved (half the pulse length), in mm.', 4 * 1540 / 3.0e6 / 2 * 1e3, 'mm',
  f'(a) λ = 1540 ÷ 3.0 × 10⁶ = {sf(1540 / 3e6, 4)} m. (b) L = 4 × {sf(1540 / 3e6, 4)} = {sf(4 * 1540 / 3e6, 4)} m. (c) {sf(4 * 1540 / 3e6, 4)} ÷ 2 = {sf(2 * 1540 / 3e6, 4)} m, which in mm is {sf(2 * 1540 / 3e6, 4)} × 10³ = {sf(2 * 1540 / 3e6 * 1e3)}',
  ['C1: λ', 'C1: pulse length', 'M1: half the pulse length', 'C1: value'], aq='Δx')
N('H', 6, 'A probe sends a pulse through 2.0 cm of fat (v = 1450 m s⁻¹) and then muscle (v = 1590 m s⁻¹). An echo from a bone boundary returns 80 µs after the pulse. (a) Calculate the time spent crossing the fat (both ways). (b) Calculate the depth of the bone below the fat–muscle boundary. Give only the answer to (b), in mm.', 1590 * (80e-6 - 2 * 0.020 / 1450) / 2 * 1e3, 'mm',
  f'(a) t = 2 × 0.020 ÷ 1450 = {sf(0.04 / 1450, 4)} s. (b) Remaining time = 80 × 10⁻⁶ − {sf(0.04 / 1450, 4)} = {sf(80e-6 - 0.04 / 1450, 4)} s; d = 1590 × {sf(80e-6 - 0.04 / 1450, 4)} ÷ 2 = {sf(1590 * (80e-6 - 0.04 / 1450) / 2, 4)} m. In mm: {sf(1590 * (80e-6 - 0.04 / 1450) / 2, 4)} × 10³ = {sf(1590 * (80e-6 - 0.04 / 1450) / 2 * 1e3)}',
  ['C1: time in fat', 'M1: subtract from total', 'C1: remaining time', 'C1: d = vt/2', 'C1: value'], aq='d')
N('H', 5, 'A bat flying at 5.0 m s⁻¹ towards a wall emits a click when it is 6.0 m away. Sound travels at 340 m s⁻¹. (a) Show that the bat travels much less than 6.0 m before the echo returns. (b) Calculate the echo time, ignoring the bat\'s motion. Give only the answer to (b), in ms.', 2 * 6.0 / 340 * 1e3, 'ms',
  f'(a) In about 0.035 s it moves 5.0 × 0.035 ≈ 0.18 m. (b) t = 2 × 6.0 ÷ 340 = {sf(12 / 340, 4)} s. In ms: {sf(12 / 340, 4)} × 10³ = {sf(12 / 340 * 1e3)}',
  ['B1: small distance moved', 'M1: t = 2d/v', 'C1: s to ms', 'C1: value'], aq='t')
N('H', 6, 'The A-scan shows the transmitted pulse at 0, a peak at 26 µs and a peak at 91 µs; the time base is 13 µs per division. The speed of sound is 1540 m s⁻¹. (a) Calculate the positions of both peaks in divisions. (b) Calculate the depth of the deeper boundary in mm. (c) Calculate the separation of the boundaries. Give only the answer to (b).', 1540 * 91e-6 / 2 * 1e3, 'mm',
  f'(a) 26 ÷ 13 = 2.0 and 91 ÷ 13 = 7.0 divisions. (b) d = 1540 × 91 × 10⁻⁶ ÷ 2 = {sf(1540 * 91e-6 / 2, 4)} m. In mm: {sf(1540 * 91e-6 / 2, 4)} × 10³ = {sf(1540 * 91e-6 / 2 * 1e3)}. (c) 1540 × 65 × 10⁻⁶ ÷ 2 ≈ 50 mm.',
  ['C1: divisions', 'M1: d = vt/2', 'C1: substitution', 'C1: value', 'C1: separation'], aq='d')
N('H', 5, 'An echo sounder is calibrated in fresh water (v = 1480 m s⁻¹) but used in sea water (v = 1520 m s⁻¹). It shows a depth of 74.0 m. (a) Calculate the echo time. (b) Calculate the true depth.', 1520 * (2 * 74.0 / 1480) / 2, 'm',
  f'(a) t = 2 × 74.0 ÷ 1480 = {sf(148 / 1480, 4)} s. (b) d = 1520 × {sf(148 / 1480, 4)} ÷ 2 = {sf(1520 * (148 / 1480) / 2)} m',
  ['M1: echo time from displayed depth', 'C1: value', 'M1: true speed', 'C1: value'], aq='d')
N('H', 6, 'A transducer emits a pulse every 0.25 ms. (a) Calculate the pulse repetition frequency. (b) Calculate the greatest depth that can be imaged without echoes overlapping the next pulse, in tissue with v = 1540 m s⁻¹. Give only the answer to (b), in cm.', 1540 * 0.25e-3 / 2 * 100, 'cm',
  f'(a) f = 1 ÷ 0.25 × 10⁻³ = 4000 Hz. (b) d = 1540 × 0.25 × 10⁻³ ÷ 2 = {sf(1540 * 0.25e-3 / 2, 4)} m. In cm: {sf(1540 * 0.25e-3 / 2, 4)} × 100 = {sf(1540 * 0.25e-3 / 2 * 100)}',
  ['C1: f = 1/T', 'M1: echo must return within T', 'C1: d = vT/2', 'C1: m to cm', 'C1: value'], aq='d(max)')
N('E', 2, 'A whale\'s call reflects from an iceberg and returns after 2.4 s. Sound travels at 1500 m s⁻¹ in sea water. How far away is the iceberg?', 1500 * 2.4 / 2, 'm',
  'd = vt/2 = 1500 × 2.4 ÷ 2 = 1800 m', ['C1: half the round trip'], sig=2, aq='d')

# ═════════════════════════ 30.7 Ultrasound scanning (17/18/9) ═════════════════════════
lesson('30.7')
N('E', 2, 'Liver tissue has a density of 1060 kg m⁻³ and ultrasound travels through it at 1550 m s⁻¹. Calculate its acoustic impedance in units of 10⁶ kg m⁻² s⁻¹.', 1060 * 1550, '10⁶ kg m⁻² s⁻¹',
  f'Z = ρc = 1060 × 1550 = {sf(1060 * 1550)} kg m⁻² s⁻¹', ['C1: Z = ρc'], aq='Z')
M('E', 1, 'How is a B-scan image formed?', 'Echoes from many lines through the body are combined into a two-dimensional picture of a slice', ['A single line of echoes is shown as a graph', 'X-rays are passed through the body', 'The patient is rotated in front of a fixed probe'], 'An array of transducers sends pulses along many directions.')
N('E', 2, 'Calculate the intensity reflection coefficient at a soft tissue–bone boundary, given Z = 1.63 × 10⁶ kg m⁻² s⁻¹ for tissue and 7.80 × 10⁶ kg m⁻² s⁻¹ for bone.', refl(1.63, 7.80), None,
  f'α = (7.80 − 1.63)² ÷ (7.80 + 1.63)² = {sf(refl(1.63, 7.80))}', ['C1: α formula'], aq='α')
M('E', 1, 'On a B-scan display, what does the brightness of each dot show?', 'The strength of the echo from that point', ['The depth of the point', 'The speed of sound there', 'The temperature of the tissue'], 'Bright dots mark strongly reflecting boundaries.')
N('E', 2, 'An echo returns 52 µs after a pulse is sent into tissue where v = 1540 m s⁻¹. How deep is the reflecting boundary, in mm?', 1540 * 52e-6 / 2 * 1e3, 'mm',
  f'd = 1540 × 52 × 10⁻⁶ ÷ 2 = {sf(1540 * 52e-6 / 2, 4)} m. In mm: {sf(1540 * 52e-6 / 2, 4)} × 10³ = {sf(1540 * 52e-6 / 2 * 1e3)}', ['C1: d = vt/2'], aq='d')
M('E', 1, 'Which part of the body is hardest to image with ultrasound?', 'The inside of the lungs', ['The liver', 'A fetus in the womb', 'The bladder'], 'Air reflects almost all the ultrasound.')
N('E', 2, 'A 7.5 MHz probe is used on tissue where v = 1540 m s⁻¹. Calculate the wavelength in mm.', 1540 / 7.5e6 * 1e3, 'mm',
  f'λ = 1540 ÷ 7.5 × 10⁶ = {sf(1540 / 7.5e6, 4)} m. In mm: {sf(1540 / 7.5e6, 4)} × 10³ = {sf(1540 / 7.5e6 * 1e3)}', ['C1: λ = v/f'], aq='λ')
M('E', 1, 'What does a B-scan probe usually contain?', 'A row (array) of many small piezoelectric crystals', ['A single X-ray tube', 'A radioactive source', 'A loudspeaker and a microphone'], 'The array sends and receives along many lines.')
N('E', 2, 'At a boundary the intensity reflection coefficient is 0.012. What fraction of the incident intensity is transmitted?', 1 - 0.012, None,
  'Transmitted = 1 − 0.012 = 0.988', ['C1: 1 − α'], sig=3, aq='fraction')
M('E', 1, 'What does medical ultrasound imaging detect?', 'Echoes from boundaries between tissues', ['Radiation emitted by the tissues', 'X-rays transmitted through the body', 'Magnetic fields of nuclei'], 'Each boundary reflects part of the pulse.')
N('E', 2, 'A boundary is 9.0 cm deep in tissue where v = 1500 m s⁻¹. How long after the pulse does its echo return, in µs?', 2 * 0.090 / 1500 * 1e6, 'µs',
  't = 2 × 0.090 ÷ 1500 = 1.2 × 10⁻⁴ s. In µs: 1.2 × 10⁻⁴ × 10⁶ = 120', ['C1: t = 2d/v'], sig=2, aq='t')
M('E', 1, 'Why does a B-scanner send many pulses every second?', 'To build up and refresh the image so that moving organs can be watched', ['To heat the tissue', 'To raise the frequency', 'To make each pulse stronger'], 'Real-time imaging needs many frames per second.')
N('E', 2, 'Calculate (acoustic impedance of bone, 7.80 × 10⁶) ÷ (acoustic impedance of soft tissue, 1.63 × 10⁶), both in kg m⁻² s⁻¹.', 7.80 / 1.63, None,
  f'Ratio = 7.80 ÷ 1.63 = {sf(7.80 / 1.63)}', ['C1: ratio'], aq='ratio')
M('E', 1, 'Why do structures behind bone often appear dark on an ultrasound image?', 'Most of the ultrasound is reflected or absorbed at the bone, so little reaches them', ['Bone emits ultrasound', 'Bone makes the ultrasound faster', 'Bone has the same impedance as tissue'], 'This is called acoustic shadowing.')
N('E', 2, 'A scanner shows 30 frames per second, each made of 128 scan lines. How many scan lines are produced per second?', 30 * 128, None,
  'Lines = 30 × 128 = 3840', ['C1: frames × lines'], sig=3, aq='lines')
M('E', 1, 'A higher ultrasound frequency is chosen. What is gained and what is lost?', 'Better resolution is gained; penetration depth is lost', ['Better penetration is gained; resolution is lost', 'Both improve', 'Both get worse'], 'Shorter λ resolves more detail but is attenuated more.')
N('E', 1, 'For blood, ρ = 1060 kg m⁻³ and the speed of sound is 1570 m s⁻¹. What is Z for blood, in units of 10⁶ kg m⁻² s⁻¹?', 1060 * 1570, '10⁶ kg m⁻² s⁻¹',
  f'Z = 1060 × 1570 = {sf(1060 * 1570)} kg m⁻² s⁻¹', [], aq='Z')
# medium
N('M', 3, 'Calculate the percentage of the intensity reflected at a fat–muscle boundary (Z = 1.38 × 10⁶ and 1.70 × 10⁶ kg m⁻² s⁻¹).', refl(1.38, 1.70) * 100, '%',
  f'α = (1.70 − 1.38)² ÷ (1.70 + 1.38)² = {sf(refl(1.38, 1.70), 4)}. Percentage = {sf(refl(1.38, 1.70), 4)} × 100 = {sf(refl(1.38, 1.70) * 100)} %', ['C1: α', 'C1: × 100'], aq='percentage')
N('M', 3, 'Ultrasound crosses a gel–skin boundary (α = 0.0039) and then a fat–muscle boundary (α = 0.011). What fraction of the incident intensity passes through both?', (1 - 0.0039) * (1 - 0.011), None,
  f'Fraction = (1 − 0.0039) × (1 − 0.011) = {sf((1 - 0.0039) * (1 - 0.011))}', ['C1: transmitted at each', 'C1: multiply'], aq='fraction')
N('M', 4, 'Each scan line of a B-scan must wait for echoes from 15 cm deep (v = 1540 m s⁻¹), and each frame has 128 lines. Calculate the greatest possible frame rate.', 1 / (128 * 2 * 0.15 / 1540), 'Hz',
  f'Time per line = 2 × 0.15 ÷ 1540 = {sf(0.30 / 1540, 4)} s. Frame time = 128 × {sf(0.30 / 1540, 4)} = {sf(128 * 0.30 / 1540, 4)} s. Frame rate = 1 ÷ {sf(128 * 0.30 / 1540, 4)} = {sf(1 / (128 * 0.30 / 1540))} Hz',
  ['C1: time per line', 'C1: frame time', 'C1: frame rate'], aq='f')
M('M', 3, 'A B-scan of the abdomen shows a dark band behind a gallstone. What causes it?', 'The stone reflects and absorbs most of the ultrasound, so little reaches the tissue behind it', ['The stone emits no echoes', 'The tissue behind the stone is hollow', 'The probe is faulty'], 'Acoustic shadowing behind strongly reflecting objects.', ['C1: strong reflection/absorption', 'C1: little energy beyond'])
N('M', 3, 'An echo from the far side of a fetal head returns 120 µs after the echo from the near side. The speed of ultrasound in the head is 1540 m s⁻¹. Calculate the width of the head in mm.', 1540 * 120e-6 / 2 * 1e3, 'mm',
  f'w = 1540 × 120 × 10⁻⁶ ÷ 2 = {sf(1540 * 120e-6 / 2, 4)} m. In mm: {sf(1540 * 120e-6 / 2, 4)} × 10³ = {sf(1540 * 120e-6 / 2 * 1e3)}', ['C1: d = vΔt/2', 'C1: value'], aq='w')
N('M', 3, 'A matching layer between a crystal (Z = 30 × 10⁶ kg m⁻² s⁻¹) and skin (Z = 1.7 × 10⁶ kg m⁻² s⁻¹) works best with Z = √(Z₁Z₂). Calculate this value in units of 10⁶ kg m⁻² s⁻¹.', sqrt(30e6 * 1.7e6), '10⁶ kg m⁻² s⁻¹',
  f'Z = √(30 × 10⁶ × 1.7 × 10⁶) = {sf(sqrt(30e6 * 1.7e6))} kg m⁻² s⁻¹', ['C1: geometric mean', 'C1: value'], aq='Z')
M('M', 3, 'How is a B-scan different from an A-scan?', 'A B-scan shows a 2-D image built from many lines; an A-scan shows echo strength against time along one line', ['A B-scan uses X-rays', 'An A-scan shows a picture; a B-scan shows a graph', 'There is no difference'], 'B stands for brightness: echoes appear as bright dots.', ['C1: A-scan one line', 'C1: B-scan 2-D image'])
N('M', 3, 'An ultrasound beam loses intensity by a factor of 100 between the probe and a boundary. Express this loss in decibels, using 10 lg(I₀/I).', 10 * log10(100), 'dB',
  'Loss = 10 × lg 100 = 20 dB', ['C1: 10 lg ratio', 'C1: value'], sig=2, aq='loss')
N('M', 3, 'A beam is attenuated by 1.0 dB per cm. What fraction of its intensity remains after 3.0 cm?', 10 ** (-0.30), None,
  'Loss = 3.0 dB, so I/I₀ = 10^(−3.0 ÷ 10) = 10^(−0.30) = 0.501', ['C1: total dB', 'C1: convert to ratio'], aq='fraction')
M('M', 3, 'Why can ultrasound show heart valves moving but a CT scan cannot easily do so?', 'Ultrasound images are produced in real time at many frames per second', ['CT cannot see the heart', 'Ultrasound uses ionising radiation', 'The heart does not move'], 'Fast frame rates follow motion.', ['C1: real time', 'C1: high frame rate'])
N('M', 3, 'A tissue has an acoustic impedance of 1.65 × 10⁶ kg m⁻² s⁻¹ and a density of 1050 kg m⁻³. Calculate the speed of ultrasound in it.', 1.65e6 / 1050, 'm s⁻¹',
  f'c = Z/ρ = 1.65 × 10⁶ ÷ 1050 = {sf(1.65e6 / 1050)} m s⁻¹', ['C1: c = Z/ρ', 'C1: value'], aq='c')
N('M', 4, 'A boundary 5.0 cm deep reflects 0.90% of the intensity. The tissue has an intensity attenuation coefficient of 0.23 cm⁻¹. What fraction of the transmitted intensity returns to the probe?', 0.0090 * exp(-0.23 * 10), None,
  f'Path = 2 × 5.0 = 10 cm. Fraction = 0.0090 × e^(−0.23 × 10) = {sf(0.009 * exp(-2.3))}', ['M1: round trip', 'C1: attenuation', 'C1: × reflection'], aq='fraction')
M('M', 3, 'Which boundary produces the strongest echo?', 'Soft tissue to air', ['Soft tissue to fat', 'Blood to muscle', 'Gel to skin'], 'The impedance mismatch is largest.', ['C1: largest ΔZ', 'C1: α ≈ 1'])
N('M', 3, 'The smallest detail resolvable is about one wavelength. Estimate it for 5.0 MHz ultrasound in tissue (v = 1540 m s⁻¹), in mm.', 1540 / 5.0e6 * 1e3, 'mm',
  f'λ = 1540 ÷ 5.0 × 10⁶ = {sf(1540 / 5e6, 4)} m. In mm: {sf(1540 / 5e6, 4)} × 10³ = {sf(1540 / 5e6 * 1e3)}', ['C1: λ = v/f', 'C1: value'], aq='λ')
N('M', 3, 'A structure is 2.5 cm thick. Calculate the time between the echoes from its front and back surfaces (v = 1540 m s⁻¹), in µs.', 2 * 0.025 / 1540 * 1e6, 'µs',
  f'Δt = 2 × 0.025 ÷ 1540 = {sf(0.05 / 1540, 4)} s. In µs: {sf(0.05 / 1540, 4)} × 10⁶ = {sf(0.05 / 1540 * 1e6)}', ['C1: Δt = 2d/v', 'C1: s to µs'], aq='Δt')
M('M', 3, 'Give the main advantage of ultrasound over CT for a routine scan of a pregnant woman.', 'It uses no ionising radiation', ['It shows bone in more detail', 'It gives a 3-D image of every organ', 'It needs no skill to operate'], 'Ionising radiation could harm the fetus.', ['C1: non-ionising', 'C1: safe for fetus'])
N('M', 3, 'Calculate the intensity reflection coefficient at the gel–skin boundary, taking Z(gel) = 1.50 × 10⁶ and Z(skin) = 1.70 × 10⁶ kg m⁻² s⁻¹.', refl(1.50, 1.70), None,
  f'α = (1.70 − 1.50)² ÷ (1.70 + 1.50)² = {sf(refl(1.5, 1.7))}', ['C1: formula', 'C1: value'], aq='α')
N('M', 3, 'A scanner builds each frame from 200 lines and shows 25 frames per second. How many pulses per second must it send?', 200 * 25, None,
  'Pulses = 200 × 25 = 5000', ['C1: lines × frames', 'C1: value'], sig=2, aq='pulses')
# hard
N('H', 5, 'A cardiac scanner must image to a depth of 20 cm (v = 1540 m s⁻¹) with 96 lines per frame. (a) Calculate the time for one line. (b) Calculate the time for one frame. (c) Calculate the greatest frame rate.', 1 / (96 * 2 * 0.20 / 1540), 'Hz',
  f'(a) 2 × 0.20 ÷ 1540 = {sf(0.4 / 1540, 4)} s. (b) 96 × {sf(0.4 / 1540, 4)} = {sf(96 * 0.4 / 1540, 4)} s. (c) 1 ÷ {sf(96 * 0.4 / 1540, 4)} = {sf(1 / (96 * 0.4 / 1540))} Hz',
  ['C1: line time', 'C1: frame time', 'M1: rate = 1/time', 'C1: value'], aq='f')
N('H', 6, 'Ultrasound passes from fat (Z = 1.38 × 10⁶) into muscle (Z = 1.70 × 10⁶), then reflects at a muscle–bone boundary (Z = 7.80 × 10⁶, units kg m⁻² s⁻¹) and returns into the fat. Ignore attenuation. (a) Calculate the reflection coefficient at the fat–muscle boundary. (b) Calculate it at the muscle–bone boundary. (c) Calculate the fraction of the incident intensity that returns into the fat from the bone. Give only the answer to (c).', (1 - refl(1.38, 1.70)) ** 2 * refl(1.70, 7.80), None,
  f'(a) {sf(refl(1.38, 1.70), 4)}. (b) ((7.80 − 1.70) ÷ (7.80 + 1.70))² = {sf(refl(1.70, 7.80), 4)}. (c) (1 − {sf(refl(1.38, 1.70), 4)})² × {sf(refl(1.70, 7.80), 4)} = {sf((1 - refl(1.38, 1.70)) ** 2 * refl(1.70, 7.80))}',
  ['C1: first α', 'C1: second α', 'M1: transmit twice, reflect once', 'C1: substitution', 'C1: value'], aq='fraction')
N('H', 5, 'A matching layer works best if its thickness is a quarter of the wavelength in it. Ultrasound of 5.0 MHz travels at 3000 m s⁻¹ in the layer. (a) Calculate the wavelength in the layer. (b) Calculate the ideal thickness, in mm.', 3000 / 5.0e6 / 4 * 1e3, 'mm',
  f'(a) λ = 3000 ÷ 5.0 × 10⁶ = 6.0 × 10⁻⁴ m. (b) t = 6.0 × 10⁻⁴ ÷ 4 = 1.5 × 10⁻⁴ m, which in mm is 1.5 × 10⁻⁴ × 10³ = 0.15',
  ['C1: λ = v/f', 'M1: quarter wavelength', 'C1: value', 'C1: m to mm'], sig=2, aq='t')
N('H', 6, 'A tissue sample has a density of 1050 kg m⁻³; ultrasound pulses take 20.0 µs to cross 1.60 cm of it and return. (a) Calculate the speed of ultrasound. (b) Calculate its acoustic impedance. (c) Calculate the reflection coefficient where it meets a material of Z = 2.0 × 10⁶ kg m⁻² s⁻¹. Give only the answer to (c).', refl(1050 * 2 * 0.016 / 20e-6, 2.0e6), None,
  f'(a) v = 2 × 0.016 ÷ 20.0 × 10⁻⁶ = {sf(0.032 / 20e-6)} m s⁻¹. (b) Z = 1050 × {sf(0.032 / 20e-6)} = {sf(1050 * 0.032 / 20e-6, 4)} kg m⁻² s⁻¹. (c) α = ((2.0 × 10⁶ − {sf(1050 * 0.032 / 20e-6, 4)}) ÷ (2.0 × 10⁶ + {sf(1050 * 0.032 / 20e-6, 4)}))² = {sf(refl(1050 * 0.032 / 20e-6, 2.0e6))}',
  ['C1: v = 2d/t', 'C1: Z = ρv', 'M1: α formula', 'C1: substitution', 'C1: value'], aq='α')
N('H', 5, 'An abdominal probe operates at 3.5 MHz, and the tissue attenuates by 0.50 dB cm⁻¹ per MHz. (a) Calculate the attenuation per cm at this frequency. (b) Calculate the total attenuation for an echo from 8.0 cm deep. (c) Calculate the fraction of intensity remaining from attenuation alone. Give only the answer to (b), in dB.', 0.50 * 3.5 * 16, 'dB',
  '(a) 0.50 × 3.5 = 1.75 dB cm⁻¹. (b) Round trip 16 cm: 1.75 × 16 = 28 dB. (c) 10^(−2.8) ≈ 1.6 × 10⁻³.',
  ['C1: dB per cm', 'M1: round trip', 'C1: value', 'C1: fraction'], sig=2, aq='attenuation')
N('H', 6, 'A B-scan uses 5.0 MHz ultrasound (v = 1540 m s⁻¹) and displays a 15 cm deep field on 500 pixel rows. (a) Calculate the depth represented by each pixel row in mm. (b) Calculate the wavelength in mm. (c) Explain which limits the depth detail more. Give only the answer to (a).', 150 / 500, 'mm',
  f'(a) 150 ÷ 500 = 0.30 mm. (b) λ = 1540 ÷ 5.0 × 10⁶ = {sf(1540 / 5e6, 3)} m, about 0.31 mm. (c) Both are similar, about 0.3 mm, so either can limit the detail.',
  ['C1: field in mm', 'M1: ÷ rows', 'C1: value', 'C1: wavelength', 'B1: comparison'], sig=2, aq='depth per row')
N('H', 5, 'An A-scan of an eye shows echoes at 6.5 µs (cornea), 9.0 µs (front of lens), 15.0 µs (back of lens) and 33.0 µs (retina). Use v = 1530 m s⁻¹ throughout. (a) Calculate the distance from the cornea to the retina. (b) Calculate the lens thickness. Give only the answer to (a), in mm.', 1530 * (33.0 - 6.5) * 1e-6 / 2 * 1e3, 'mm',
  f'(a) d = 1530 × (33.0 − 6.5) × 10⁻⁶ ÷ 2 = {sf(1530 * 26.5e-6 / 2, 4)} m. In mm: {sf(1530 * 26.5e-6 / 2, 4)} × 10³ = {sf(1530 * 26.5e-6 / 2 * 1e3)}. (b) 1530 × 6.0 × 10⁻⁶ ÷ 2 ≈ 4.6 mm.',
  ['C1: time difference', 'M1: d = vt/2', 'C1: value', 'C1: lens'], aq='d')
N('H', 6, 'In a scan, the echo from a liver–kidney boundary (α = 0.0060) is compared with the echo from a liver–bone boundary (α = 0.40) at the same depth. (a) Calculate (bone echo) ÷ (kidney echo). (b) Express this ratio in decibels. Give only the answer to (b).', 10 * log10(0.40 / 0.0060), 'dB',
  f'(a) 0.40 ÷ 0.0060 = {sf(0.4 / 0.006)}. (b) 10 × lg({sf(0.4 / 0.006, 4)}) = {sf(10 * log10(0.4 / 0.006))} dB',
  ['C1: ratio', 'M1: dB = 10 lg ratio', 'C1: substitution', 'C1: value', 'B1: same attenuation for same depth'], aq='ratio')
N('H', 5, 'Blood (Z = 1.66 × 10⁶ kg m⁻² s⁻¹) flows in a vessel surrounded by tissue (Z = 1.63 × 10⁶ kg m⁻² s⁻¹). (a) Calculate the reflection coefficient. (b) Calculate the echo intensity from an incident intensity of 0.20 W m⁻², in units of 10⁻⁵ W m⁻².', 0.20 * refl(1.63, 1.66), '10⁻⁵ W m⁻²',
  f'(a) α = ((1.66 − 1.63) ÷ (1.66 + 1.63))² = {sf(refl(1.63, 1.66), 4)}. (b) 0.20 × {sf(refl(1.63, 1.66), 4)} = {sf(0.2 * refl(1.63, 1.66))} W m⁻²',
  ['C1: α', 'M1: I = αI₀', 'C1: substitution', 'C1: value'], aq='I')

N('E', 2, 'An echo returns from the back wall of a bladder 104 µs after the pulse. Taking v = 1540 m s⁻¹, how deep is the wall, in cm?', 1540 * 104e-6 / 2 * 100, 'cm',
  f'd = 1540 × 104 × 10⁻⁶ ÷ 2 = {sf(1540 * 104e-6 / 2, 4)} m. In cm: {sf(1540 * 104e-6 / 2, 4)} × 100 = {sf(1540 * 104e-6 / 2 * 100)}', ['C1: d = vt/2'], aq='d')

# ═════════════════════════ 30.8 PET scanning (17/19/6) ═════════════════════════
lesson('30.8')
N('E', 2, 'An annihilation photon has an energy of 8.2 × 10⁻¹⁴ J. Calculate its wavelength in units of 10⁻¹² m.' + take('h', 'c'), HP * CL / 8.2e-14, '10⁻¹² m',
  f'λ = hc/E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ 8.2 × 10⁻¹⁴ = {sf(HP * CL / 8.2e-14)} m', ['C1: λ = hc/E'], aq='λ')
M('E', 1, 'What does the tracer used in PET scanning emit?', 'Positrons', ['Electrons', 'α-particles', 'X-rays'], 'Each positron annihilates with an electron nearby.')
N('E', 2, 'Fluorine-18 has a half-life of 110 minutes. A dose has an activity of 400 MBq. Calculate its activity 220 minutes later, in MBq.', 400 / 4, 'MBq',
  '220 ÷ 110 = 2 half-lives: A = 400 × (1/2)² = 100 MBq', ['C1: two half-lives'], sig=2, aq='A')
M('E', 1, 'What is produced when a positron meets an electron?', 'Two γ-ray photons travelling in opposite directions', ['A single α-particle', 'A neutron', 'Two protons'], 'Their mass becomes the energy of two photons.')
N('E', 2, 'An annihilation photon has an energy of 0.511 MeV. Calculate its momentum in units of 10⁻²² kg m s⁻¹.' + take('e', 'c'), 0.511e6 * QE / CL, '10⁻²² kg m s⁻¹',
  f'E = 0.511 × 10⁶ × 1.60 × 10⁻¹⁹ = {sf(0.511e6 * QE, 4)} J. p = E/c = {sf(0.511e6 * QE, 4)} ÷ 3.00 × 10⁸ = {sf(0.511e6 * QE / CL)} kg m s⁻¹', ['C1: p = E/c'], aq='p')
M('E', 1, 'What does a PET scanner detect?', 'Pairs of γ-ray photons arriving at opposite detectors at the same time', ['Single positrons leaving the body', 'X-rays from an external tube', 'Echoes of ultrasound'], 'Coincidence detection identifies annihilations.')
N('E', 2, 'Calculate the time a γ-ray photon takes to cross a detector ring 0.80 m in diameter, in ns.' + take('c'), 0.80 / CL * 1e9, 'ns',
  f't = d/c = 0.80 ÷ 3.00 × 10⁸ = {sf(0.8 / CL, 4)} s. In ns: {sf(0.8 / CL, 4)} × 10⁹ = {sf(0.8 / CL * 1e9)}', ['C1: t = d/c'], aq='t')
M('E', 1, 'Which tracer is most often used in PET?', 'A glucose compound labelled with fluorine-18', ['Iodine-131 in salt solution', 'Barium sulfate', 'Technetium-99m in water'], 'Active cells take up glucose, so the tracer collects there.')
N('E', 2, 'Fluorine-18 has a half-life of 110 minutes (6600 s). Calculate its decay constant in s⁻¹.', LN2 / 6600, 's⁻¹',
  f'λ = 0.693 ÷ 6600 = {sf(LN2 / 6600)} s⁻¹', ['C1: λ = ln 2/t½'], aq='λ')
M('E', 1, 'Where is the fluorine-18 for PET tracers usually produced?', 'In a cyclotron, often at or near the hospital', ['In a nuclear reactor far away', 'By heating ordinary fluorine', 'Inside the PET scanner'], 'Its short half-life means it must be made close to where it is used.')
N('E', 2, 'Calculate the frequency of a 0.511 MeV annihilation photon in units of 10²⁰ Hz.' + take('e', 'h'), 0.511e6 * QE / HP, '10²⁰ Hz',
  f'f = E/h = 0.511 × 10⁶ × 1.60 × 10⁻¹⁹ ÷ 6.63 × 10⁻³⁴ = {sf(0.511e6 * QE / HP)} Hz', ['C1: f = E/h'], aq='f')
M('E', 1, 'In PET, what is a "line of response"?', 'The line joining the two detectors that record a coincident pair of photons', ['The path of the positron', 'The edge of the patient', 'The detector ring itself'], 'The annihilation lies somewhere on this line.')
N('E', 2, 'Two annihilation photons reach opposite detectors 400 ps apart. How far from the midpoint of the line between the detectors did the annihilation happen, in mm?' + take('c'), CL * 400e-12 / 2 * 1e3, 'mm',
  'd = cΔt/2 = 3.00 × 10⁸ × 400 × 10⁻¹² ÷ 2 = 0.060 m. In mm: 0.060 × 10³ = 60', ['C1: d = cΔt/2'], sig=2, aq='d')
M('E', 1, 'What does a PET image mainly show?', 'Where the tracer collects, showing how active tissues are', ['The exact shape of bones', 'The density of tissue', 'The flow of air in the lungs'], 'PET images function (metabolism), not just anatomy.')
N('E', 2, 'What fraction of a fluorine-18 dose (half-life 110 min) remains after 60 minutes?', 0.5 ** (60 / 110), None,
  f'Fraction = 0.5^(60 ÷ 110) = {sf(0.5 ** (60 / 110))}', ['C1: (½)^(t/t½)'], aq='fraction')
M('E', 1, 'Roughly how far does a positron from a PET tracer travel before it annihilates?', 'About a millimetre', ['About a metre', 'Right out of the body', 'About a nanometre'], 'It slows quickly in tissue, then meets an electron.')
N('E', 1, 'Each annihilation photon carries 0.511 MeV. Calculate the total energy of the two photons.', 2 * 0.511, 'MeV',
  'E = 2 × 0.511 = 1.022 MeV', [], sig=4, aq='E')
# medium
N('M', 3, 'A patient needs 370 MBq of fluorine-18 (half-life 110 min) at injection, which happens 2.0 hours after the tracer is made. What activity must be made, in MBq?', 370 * 2 ** (120 / 110), 'MBq',
  f'A₀ = 370 × 2^(120 ÷ 110) = {sf(370 * 2 ** (120 / 110))} MBq', ['C1: hours to minutes', 'C1: A₀ = A × 2^(t/t½)'], aq='A₀')
N('M', 3, 'A fluorine-18 source (λ = 1.05 × 10⁻⁴ s⁻¹) has an activity of 400 MBq. How many fluorine-18 nuclei does it contain?', 400e6 / 1.05e-4, None,
  f'N = A/λ = 400 × 10⁶ ÷ 1.05 × 10⁻⁴ = {sf(400e6 / 1.05e-4)}', ['C1: MBq to Bq', 'C1: N = A/λ'], aq='N')
N('M', 4, 'Two opposite PET detectors record photons from an annihilation that took place 9.0 cm closer to one of them than the centre point. What is the gap between the two arrival times, in ps?' + take('c'), 2 * 0.090 / CL * 1e12, 'ps',
  'One photon travels 0.090 m further and the other 0.090 m less: Δt = 2 × 0.090 ÷ 3.00 × 10⁸ = 6.0 × 10⁻¹⁰ s. In ps: 6.0 × 10⁻¹⁰ × 10¹² = 600', ['M1: path difference 2d', 'C1: Δt = 2d/c', 'C1: s to ps'], sig=2, aq='Δt')
M('M', 3, 'After a PET scan, patients are told to drink plenty of water. Why?', 'Frequent urination removes the tracer from the bladder sooner, lowering the dose', ['Water stops the positrons', 'Water cools the patient', 'Water increases the half-life'], 'Excretion shortens the effective half-life.', ['C1: tracer excreted', 'C1: lower dose'])
N('M', 3, 'An electron and a positron, both nearly at rest, annihilate. Calculate the total energy released in units of 10⁻¹³ J.' + take('me', 'c'), 2 * ME * CL ** 2, '10⁻¹³ J',
  f'E = 2mₑc² = 2 × 9.11 × 10⁻³¹ × (3.00 × 10⁸)² = {sf(2 * ME * CL ** 2)} J', ['C1: two rest masses', 'C1: E = mc²'], aq='E')
N('M', 3, 'A PET scan has 300 MBq of tracer in the patient, and 2.0% of the annihilations are recorded as coincidences. How many coincidences are recorded per second?', 300e6 * 0.020, 's⁻¹',
  'Rate = 0.020 × 300 × 10⁶ = 6.0 × 10⁶ s⁻¹', ['C1: one annihilation per decay', 'C1: × 2.0%'], sig=2, aq='rate')
M('M', 3, 'How does a PET scanner work out where the tracer is?', 'Many lines of response cross at the places where annihilations are most frequent; timing places events along each line', ['It measures the energy of each positron', 'It uses echoes from the tissue', 'It rotates an X-ray tube around the patient'], 'The computer reconstructs the distribution from millions of coincidences.', ['C1: lines of response', 'C1: reconstruction / timing'])
N('M', 3, 'Fluorine-18 has a physical half-life of 110 min and is cleared from the body with a biological half-life of 360 min. Calculate the effective half-life, in min, using 1/T(eff) = 1/T(phys) + 1/T(bio).', 1 / (1 / 110 + 1 / 360), 'min',
  f'T = 1 ÷ (1/110 + 1/360) = {sf(1 / (1 / 110 + 1 / 360))} min', ['C1: formula', 'C1: value'], aq='T(eff)')
N('M', 3, 'A patient contains 200 MBq of a positron emitter, and every annihilation gives two 0.511 MeV photons. Calculate the total power carried by the photons, in mW.' + take('e'), 200e6 * 1.022e6 * QE * 1e3, 'mW',
  f'P = 200 × 10⁶ × 1.022 × 10⁶ × 1.60 × 10⁻¹⁹ = {sf(200e6 * 1.022e6 * QE, 4)} W. In mW: {sf(200e6 * 1.022e6 * QE, 4)} × 10³ = {sf(200e6 * 1.022e6 * QE * 1e3)}', ['C1: energy per decay', 'C1: × activity'], aq='P')
M('M', 3, 'Why are PET scans often combined with CT scans?', 'PET shows where tissue is active and CT shows the anatomy, so together the activity can be located precisely', ['CT removes the need for a tracer', 'PET cannot work without X-rays', 'CT reduces the dose from PET'], 'Function and structure are overlaid.', ['C1: PET functional', 'C1: CT anatomical'])
N('M', 3, 'An annihilation occurs 10 cm from the centre, on the line between two opposite detectors. Calculate the difference in arrival times, in ps.' + take('c'), 2 * 0.10 / CL * 1e12, 'ps',
  f'Δt = 2 × 0.10 ÷ 3.00 × 10⁸ = {sf(0.2 / CL, 4)} s. In ps: {sf(0.2 / CL, 4)} × 10¹² = {sf(0.2 / CL * 1e12)}', ['C1: path difference', 'C1: Δt'], aq='Δt')
N('M', 4, 'How long does it take for the activity of a fluorine-18 dose (half-life 110 min) to fall to 10% of its initial value, in min?', 110 * log(10) / LN2, 'min',
  f't = 110 × ln 10 ÷ ln 2 = {sf(110 * log(10) / LN2)} min', ['M1: 0.10 = (½)^(t/t½)', 'C1: take logs', 'C1: value'], aq='t')
M('M', 3, 'Why is the fluorine-18 tracer attached to glucose?', 'Cells that are very active, such as many cancer cells, take up more glucose, so the tracer collects there', ['Glucose stops the positrons', 'Glucose makes the tracer last longer', 'Glucose absorbs γ-rays'], 'The image shows regions of high metabolism.', ['C1: glucose uptake', 'C1: active tissue highlighted'])
N('M', 3, 'A dose of fluorine-18 contains 3.8 × 10¹² nuclei. Taking the mass of one nucleus as 18 u (1 u = 1.66 × 10⁻²⁷ kg), calculate the mass of fluorine-18 in units of 10⁻¹³ kg.', 3.8e12 * 18 * 1.66e-27, '10⁻¹³ kg',
  f'm = 3.8 × 10¹² × 18 × 1.66 × 10⁻²⁷ = {sf(3.8e12 * 18 * 1.66e-27)} kg', ['C1: mass of one nucleus', 'C1: × N'], aq='m')
N('M', 3, 'Calculate the wavelength of a 0.511 MeV annihilation photon in units of 10⁻¹² m.' + take('h', 'c', 'e'), HP * CL / (0.511e6 * QE), '10⁻¹² m',
  f'λ = hc/E = 6.63 × 10⁻³⁴ × 3.00 × 10⁸ ÷ (0.511 × 10⁶ × 1.60 × 10⁻¹⁹) = {sf(HP * CL / (0.511e6 * QE))} m', ['C1: MeV to J', 'C1: λ = hc/E'], aq='λ')
M('M', 3, 'How does the distance a positron travels before annihilating affect a PET image?', 'It limits the resolution, because the annihilation is not exactly where the tracer nucleus was', ['It improves the resolution', 'It has no effect', 'It changes the photon energy'], 'The positron range blurs the image by about a millimetre.', ['C1: positron range', 'C1: blurring'])
N('M', 3, 'A PET coincidence window is 10 ns. How far does light travel in this time?' + take('c'), CL * 10e-9, 'm',
  'd = c × t = 3.00 × 10⁸ × 10 × 10⁻⁹ = 3.0 m', ['C1: d = ct', 'C1: ns to s'], sig=2, aq='d')
N('M', 3, 'Calculate (activity of a fluorine-18 dose 1 hour after injection) ÷ (its activity 2 hours after injection). The half-life is 110 min.', 2 ** (60 / 110), None,
  f'Ratio = 2^(60 ÷ 110) = {sf(2 ** (60 / 110))}', ['C1: 60 min apart', 'C1: 2^(t/t½)'], aq='ratio')
M('M', 3, 'How are the γ-ray photons detected in a PET scanner?', 'Scintillator crystals produce flashes of light that photomultipliers turn into electrical pulses', ['Photographic film on the ceiling', 'Piezoelectric crystals', 'A GM tube inside the patient'], 'The ring of detectors surrounds the patient.', ['C1: scintillator', 'C1: photomultiplier'])
# hard
N('H', 5, 'A detector ring has a radius of 0.40 m. An annihilation occurs on the line joining two opposite detectors, and the photon reaching detector A arrives 1.0 ns before the photon reaching B. (a) Calculate the path difference. (b) Calculate the distance of the annihilation from the centre, in cm. (c) State which detector it is nearer.' + take('c'), CL * 1.0e-9 / 2 * 100, 'cm',
  '(a) cΔt = 3.00 × 10⁸ × 1.0 × 10⁻⁹ = 0.30 m. (b) d = 0.30 ÷ 2 = 0.15 m, which in cm is 0.15 × 100 = 15. (c) Nearer to A.',
  ['C1: path difference', 'M1: halve it', 'C1: value', 'B1: nearer A'], sig=2, aq='d')
N('H', 6, 'Fluorine-18 (half-life 110 min) is made in a cyclotron 1.5 hours\' drive from the hospital. A patient needs 400 MBq at injection, 30 min after the tracer arrives. (a) Calculate the total time from production to injection. (b) Calculate the activity that must leave the cyclotron, in MBq.', 400 * 2 ** (120 / 110), 'MBq',
  f'(a) 90 + 30 = 120 min. (b) A₀ = 400 × 2^(120 ÷ 110) = {sf(400 * 2 ** (120 / 110))} MBq',
  ['C1: total time', 'M1: A₀ = A × 2^(t/t½)', 'C1: exponent', 'C1: value', 'B1: decay during transport and waiting'], aq='A₀')
N('H', 5, 'A positron and an electron, both at rest, annihilate. (a) Calculate the energy of each photon in J. (b) Calculate the momentum of each photon. (c) Show that the total momentum is zero. Give only the answer to (b), in units of 10⁻²² kg m s⁻¹.' + take('me', 'c'), ME * CL, '10⁻²² kg m s⁻¹',
  f'(a) E = mₑc² = 9.11 × 10⁻³¹ × (3.00 × 10⁸)² = {sf(ME * CL ** 2, 4)} J. (b) p = E/c = {sf(ME * CL ** 2, 4)} ÷ 3.00 × 10⁸ = {sf(ME * CL)} kg m s⁻¹. (c) The photons travel in opposite directions with equal momenta.',
  ['C1: photon energy', 'M1: p = E/c', 'C1: value', 'B1: opposite directions'], aq='p')
N('H', 6, 'A patient receives 370 MBq of fluorine-18 (λ = 1.05 × 10⁻⁴ s⁻¹). Each decay deposits, on average, 0.25 MeV from the positron in the body. (a) Calculate the total number of decays. (b) Calculate the total energy deposited by the positrons, in J.' + take('e'), 370e6 / 1.05e-4 * 0.25e6 * QE, 'J',
  f'(a) N₀ = A₀/λ = 370 × 10⁶ ÷ 1.05 × 10⁻⁴ = {sf(370e6 / 1.05e-4, 4)}. (b) E = {sf(370e6 / 1.05e-4, 4)} × 0.25 × 10⁶ × 1.60 × 10⁻¹⁹ = {sf(370e6 / 1.05e-4 * 0.25e6 * QE)} J',
  ['M1: all nuclei eventually decay', 'C1: N₀ = A₀/λ', 'C1: energy per decay in J', 'M1: multiply', 'C1: value'], aq='E')
N('H', 5, 'A PET scanner can measure arrival-time differences to within 300 ps. (a) Calculate the corresponding uncertainty in position along the line of response. (b) Comment on whether timing alone can give a sharp image. Give only the answer to (a), in cm.' + take('c'), CL * 300e-12 / 2 * 100, 'cm',
  '(a) Δx = cΔt/2 = 3.00 × 10⁸ × 300 × 10⁻¹² ÷ 2 = 0.045 m, which in cm is 0.045 × 100 = 4.5. (b) No: 4.5 cm is coarse, so many crossing lines of response are still needed.',
  ['M1: Δx = cΔt/2', 'C1: substitution', 'C1: value', 'B1: comment'], sig=2, aq='Δx')
N('H', 6, 'Fluorine-18 decays by β⁺ emission to oxygen-18. (a) State the proton number of oxygen if fluorine has 9. (b) The decay releases 0.63 MeV, and the positron then annihilates (photons 0.511 MeV each). Calculate the total energy released per decay, in MeV. (c) Explain why the annihilation photons, not the positrons, are detected.', 0.63 + 2 * 0.511, 'MeV',
  '(a) 9 − 1 = 8. (b) E = 0.63 + 2 × 0.511 = 1.652 MeV. (c) Positrons travel only about 1 mm in tissue; γ-photons escape the body.',
  ['C1: Z = 8', 'C1: annihilation energy', 'M1: add decay energy', 'C1: value', 'B1: photons escape, positrons do not'], sig=4, aq='E')
N('E', 2, 'A fluorine-18 dose has an activity of 600 MBq when injected. What is its activity after one half-life, 110 minutes later, in MBq?', 300, 'MBq',
  'One half-life halves the activity: A = 600 ÷ 2 = 300 MBq', ['C1: halve once'], sig=2, aq='A')
