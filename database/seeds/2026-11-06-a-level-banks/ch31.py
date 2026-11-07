# Chapter 31 Astronomy and cosmology: 31.1 to 31.4.
CL, SIG, WIEN = 3.00e8, 5.67e-8, 2.90e-3
LY, PC, MPC = 9.46e15, 3.09e16, 3.09e22


def flux(L, d):
    return L / (4 * pi * d ** 2)


def lum(r, T):
    return 4 * pi * r ** 2 * SIG * T ** 4


# ═════════════════════════ 31.1 Standard candles and luminosity (17/17/8) ═════════════════════════
lesson('31.1')
N('E', 2, 'A star of luminosity 3.0 × 10²⁷ W is 2.0 × 10¹⁷ m from the Earth. Calculate the radiant flux intensity at the Earth, in units of 10⁻⁹ W m⁻².', flux(3.0e27, 2.0e17), '10⁻⁹ W m⁻²',
  f'F = L/4πd² = 3.0 × 10²⁷ ÷ (4π × (2.0 × 10¹⁷)²) = {sf(flux(3e27, 2e17))} W m⁻²', ['C1: F = L/4πd²'], aq='F')
M('E', 1, 'What is the luminosity of a star?', 'The total power it radiates as electromagnetic radiation', ['The power received per square metre at the Earth', 'How bright it looks in the sky', 'Its surface temperature'], 'Luminosity is measured in watts.')
N('E', 2, 'The flux intensity from a lamp is 12 W m⁻² at a certain distance. Calculate the flux intensity at half that distance.', 12 * 4, 'W m⁻²',
  'F ∝ 1/d²: halving d multiplies F by 4: F = 12 × 4 = 48 W m⁻²', ['C1: inverse square'], sig=2, aq='F')
M('E', 1, 'What is meant by a standard candle in astronomy?', 'An object of known luminosity, whose distance can be found from the flux received', ['A star of known temperature', 'The brightest star in a galaxy', 'A star at a known distance'], 'Measuring F and knowing L gives d.')
N('E', 2, 'A star\'s luminosity is 2.0 × 10³⁰ W. Calculate the total power passing through a sphere of radius 1.0 × 10¹⁸ m centred on the star.', 2.0e30, 'W',
  'All the power crosses any sphere around the star: P = 2.0 × 10³⁰ × 1 = 2.0 × 10³⁰ W', ['C1: energy conservation'], sig=2, aq='P')
M('E', 1, 'Which type of object is used as a standard candle for measuring very large distances?', 'Type 1a supernovae', ['Red giants of unknown size', 'Comets', 'Nearby planets'], 'Type 1a supernovae reach almost the same peak luminosity.')
N('E', 2, 'Express a distance of 4.2 light-years in metres, in units of 10¹⁶ m (1 light-year = 9.46 × 10¹⁵ m).', 4.2 * LY, '10¹⁶ m',
  f'd = 4.2 × 9.46 × 10¹⁵ = {sf(4.2 * LY)} m', ['C1: × 9.46 × 10¹⁵'], aq='d')
M('E', 1, 'Which variable stars act as standard candles because their luminosity is linked to their period?', 'Cepheid variables', ['White dwarfs', 'Neutron stars', 'Black holes'], 'Their period–luminosity relationship gives L.')
N('E', 2, 'A standard candle of luminosity 5.0 × 10²⁸ W gives a flux intensity of 1.0 × 10⁻⁸ W m⁻². Calculate its distance in units of 10¹⁸ m.', sqrt(5.0e28 / (4 * pi * 1.0e-8)), '10¹⁸ m',
  f'd = √(L/4πF) = √(5.0 × 10²⁸ ÷ (4π × 1.0 × 10⁻⁸)) = {sf(sqrt(5e28 / (4 * pi * 1e-8)))} m', ['C1: rearranged formula'], aq='d')
M('E', 1, 'In which unit is radiant flux intensity measured?', 'W m⁻²', ['W', 'J', 'W m⁻¹'], 'It is power per unit area.')
N('E', 2, 'The distance to a star is tripled. By what factor does the flux intensity received fall?', 9, None,
  'F ∝ 1/d²: factor = 3² = 9', ['C1: inverse square'], sig=1, aq='factor')
M('E', 1, 'Why does the flux intensity from a star fall with distance?', 'The same power spreads over a larger spherical area', ['The light slows down', 'The light is absorbed by empty space', 'The star cools down'], 'Area of a sphere = 4πd².')
N('E', 2, 'Calculate the area of a sphere of radius 1.5 × 10¹¹ m, in units of 10²³ m².', 4 * pi * 1.5e11 ** 2, '10²³ m²',
  f'A = 4πr² = 4π × (1.5 × 10¹¹)² = {sf(4 * pi * 1.5e11 ** 2)} m²', ['C1: A = 4πr²'], aq='A')
M('E', 1, 'Two identical stars are at distances d and 2d from the Earth. How does the flux from the nearer star compare?', 'It is four times larger', ['It is twice as large', 'It is half as large', 'It is the same'], 'F ∝ 1/d², so the star at half the distance gives 2² = 4 times the flux.')
N('E', 2, 'A star 8.0 × 10¹⁶ m away gives a flux intensity of 2.0 × 10⁻⁹ W m⁻². Calculate its luminosity, in units of 10²⁶ W.', 2.0e-9 * 4 * pi * 8.0e16 ** 2, '10²⁶ W',
  f'L = 4πd²F = 4π × (8.0 × 10¹⁶)² × 2.0 × 10⁻⁹ = {sf(2e-9 * 4 * pi * 8e16 ** 2)} W', ['C1: L = 4πd²F'], aq='L')
M('E', 1, 'What must be known about a standard candle to find its distance?', 'Its luminosity', ['Its mass', 'Its age', 'Its colour only'], 'With L known and F measured, d = √(L/4πF).')
N('E', 1, 'Express 1.0 parsec (3.09 × 10¹⁶ m) in light-years (1 ly = 9.46 × 10¹⁵ m).', PC / LY, 'ly',
  f'1 pc = 3.09 × 10¹⁶ ÷ 9.46 × 10¹⁵ = {sf(PC / LY)} ly', [], aq='d')
# medium
N('M', 3, 'A Cepheid variable has a luminosity of 4.0 × 10²⁹ W and gives a flux intensity of 3.2 × 10⁻¹¹ W m⁻² at the Earth. Calculate its distance in light-years (1 ly = 9.46 × 10¹⁵ m).', sqrt(4.0e29 / (4 * pi * 3.2e-11)) / LY, 'ly',
  f'd = √(4.0 × 10²⁹ ÷ (4π × 3.2 × 10⁻¹¹)) = {sf(sqrt(4e29 / (4 * pi * 3.2e-11)), 4)} m. In ly: {sf(sqrt(4e29 / (4 * pi * 3.2e-11)), 4)} ÷ 9.46 × 10¹⁵ = {sf(sqrt(4e29 / (4 * pi * 3.2e-11)) / LY)}', ['C1: d = √(L/4πF)', 'C1: m to ly'], aq='d')
N('M', 3, 'Two stars appear equally bright. Star X is 3.0 times further away than star Y. Calculate (luminosity of X) ÷ (luminosity of Y).', 3.0 ** 2, None,
  'Equal F means L ∝ d²: ratio = 3.0² = 9.0', ['C1: L = 4πd²F', 'C1: ratio'], sig=2, aq='ratio')
M('M', 3, 'Why are Cepheid variables useful for measuring distances?', 'Their period of variation depends on their luminosity, so measuring the period gives L', ['They are all at the same distance', 'They do not vary in brightness', 'They emit only one wavelength'], 'Then d follows from L and the measured flux.', ['C1: period–luminosity relation', 'C1: L then d'])
N('M', 4, 'A type 1a supernova has a peak luminosity of 1.0 × 10³⁶ W and a peak flux intensity at the Earth of 2.0 × 10⁻¹⁵ W m⁻². Calculate its distance in Mpc (1 Mpc = 3.09 × 10²² m).', sqrt(1.0e36 / (4 * pi * 2.0e-15)) / MPC, 'Mpc',
  f'd = √(1.0 × 10³⁶ ÷ (4π × 2.0 × 10⁻¹⁵)) = {sf(sqrt(1e36 / (4 * pi * 2e-15)), 4)} m. In Mpc: {sf(sqrt(1e36 / (4 * pi * 2e-15)), 4)} ÷ 3.09 × 10²² = {sf(sqrt(1e36 / (4 * pi * 2e-15)) / MPC)}',
  ['C1: rearranged', 'C1: value in m', 'C1: m to Mpc'], aq='d')
N('M', 3, 'The Sun\'s luminosity is 3.8 × 10²⁶ W. Calculate the flux intensity at Mars, 2.3 × 10¹¹ m from the Sun.', flux(3.8e26, 2.3e11), 'W m⁻²',
  f'F = 3.8 × 10²⁶ ÷ (4π × (2.3 × 10¹¹)²) = {sf(flux(3.8e26, 2.3e11))} W m⁻²', ['C1: formula', 'C1: substitution'], aq='F')
M('M', 3, 'A standard candle is partly hidden by dust, which absorbs some of its light. How does this affect the distance calculated from it?', 'The distance is overestimated', ['The distance is underestimated', 'It has no effect', 'The luminosity is overestimated'], 'Less flux suggests a larger d.', ['C1: F reduced', 'C1: d = √(L/4πF) larger'])
N('M', 3, 'The flux intensity from a star falls from 6.4 × 10⁻⁹ W m⁻² to 1.6 × 10⁻⁹ W m⁻² when measured from a point further away along the same line. Calculate (new distance) ÷ (old distance).', sqrt(6.4 / 1.6), None,
  'd ∝ 1/√F: ratio = √(6.4 ÷ 1.6) = 2.0', ['C1: F ∝ 1/d²', 'C1: square root'], sig=2, aq='ratio')
N('M', 3, 'A star 50 light-years away (1 ly = 9.46 × 10¹⁵ m) gives a flux intensity of 4.0 × 10⁻⁹ W m⁻². Calculate its luminosity in units of 10²⁷ W.', 4 * pi * (50 * LY) ** 2 * 4.0e-9, '10²⁷ W',
  f'd = 50 × 9.46 × 10¹⁵ = {sf(50 * LY, 4)} m. L = 4π × ({sf(50 * LY, 4)})² × 4.0 × 10⁻⁹ = {sf(4 * pi * (50 * LY) ** 2 * 4e-9)} W', ['C1: ly to m', 'C1: L = 4πd²F'], aq='L')
M('M', 3, 'Which step is needed to use a standard candle?', 'Measure the radiant flux intensity received at the Earth', ['Measure the star\'s mass', 'Measure the star\'s speed', 'Measure the star\'s radius directly'], 'Known L and measured F give d.', ['C1: measure F', 'C1: L known'])
N('M', 4, 'Sunlight at the top of the Earth\'s atmosphere has an intensity of 1.36 kW m⁻², 1.50 × 10¹¹ m from the Sun. Calculate the Sun\'s luminosity, in units of 10²⁶ W.', 4 * pi * 1.50e11 ** 2 * 1.36e3, '10²⁶ W',
  f'L = 4πd²F = 4π × (1.50 × 10¹¹)² × 1.36 × 10³ = {sf(4 * pi * 1.5e11 ** 2 * 1.36e3)} W', ['M1: L = 4πd²F', 'C1: kW to W', 'C1: value'], aq='L')
N('M', 3, 'Calculate the flux intensity from the Sun (L = 3.8 × 10²⁶ W) at Jupiter, 7.8 × 10¹¹ m away.', flux(3.8e26, 7.8e11), 'W m⁻²',
  f'F = 3.8 × 10²⁶ ÷ (4π × (7.8 × 10¹¹)²) = {sf(flux(3.8e26, 7.8e11))} W m⁻²', ['C1: formula', 'C1: value'], aq='F')
M('M', 3, 'Astronomers check distances found with Cepheids against another method for nearby stars. Which method is used for the nearest stars?', 'Stellar parallax', ['Hubble\'s law', 'Redshift', 'Type 1a supernovae'], 'Parallax calibrates the distance ladder.', ['C1: parallax', 'C1: calibration'])
N('M', 3, 'Two identical Cepheids have the same period. One appears 25 times brighter than the other. Calculate (distance of fainter) ÷ (distance of brighter).', sqrt(25), None,
  'Same L, so d ∝ 1/√F: ratio = √25 = 5.0', ['C1: same luminosity', 'C1: √ of flux ratio'], sig=2, aq='ratio')
N('M', 3, 'A star of luminosity 7.6 × 10²⁸ W is 2.5 × 10¹⁸ m away. Calculate the flux intensity in units of 10⁻¹⁰ W m⁻².', flux(7.6e28, 2.5e18), '10⁻¹⁰ W m⁻²',
  f'F = 7.6 × 10²⁸ ÷ (4π × (2.5 × 10¹⁸)²) = {sf(flux(7.6e28, 2.5e18))} W m⁻²', ['C1: formula', 'C1: value'], aq='F')
M('M', 4, 'Why is a single, very distant type 1a supernova more useful than a Cepheid for measuring the distance to its galaxy?', 'It is far more luminous, so it can be seen at much greater distances', ['It lasts for many years', 'It has a known mass', 'It does not need a flux measurement'], 'Peak luminosities around 10³⁶ W are detectable across the Universe.', ['C1: very high luminosity', 'C1: visible at great distance', 'C1: still a standard candle'])
N('M', 3, 'A detector on a telescope of area 0.50 m² collects 2.0 × 10⁻¹² W from a star. Calculate the radiant flux intensity, in units of 10⁻¹² W m⁻².', 2.0e-12 / 0.50, '10⁻¹² W m⁻²',
  'F = P/A = 2.0 × 10⁻¹² ÷ 0.50 = 4.0 × 10⁻¹² W m⁻²', ['C1: F = P/A', 'C1: value'], sig=2, aq='F')
# hard
N('H', 5, 'A Cepheid of luminosity 6.0 × 10²⁹ W is observed in a nearby galaxy, giving a flux intensity of 2.5 × 10⁻¹³ W m⁻². (a) Calculate the distance in m. (b) Express it in light-years (1 ly = 9.46 × 10¹⁵ m). Give only the answer to (b), in units of 10⁶ ly.', sqrt(6.0e29 / (4 * pi * 2.5e-13)) / LY, '10⁶ ly',
  f'(a) d = √(6.0 × 10²⁹ ÷ (4π × 2.5 × 10⁻¹³)) = {sf(sqrt(6e29 / (4 * pi * 2.5e-13)), 4)} m. (b) {sf(sqrt(6e29 / (4 * pi * 2.5e-13)), 4)} ÷ 9.46 × 10¹⁵ = {sf(sqrt(6e29 / (4 * pi * 2.5e-13)) / LY)} ly',
  ['C1: d formula', 'C1: value in m', 'M1: m to ly', 'C1: value'], aq='d')
N('H', 6, 'A star X is 4.0 × 10¹⁷ m away and gives a flux of 5.0 × 10⁻⁹ W m⁻². Star Y gives a flux of 2.0 × 10⁻¹⁰ W m⁻² and has 4.0 times the luminosity of X. (a) Calculate the luminosity of X. (b) Calculate the luminosity of Y. (c) Calculate the distance of Y. Give only the answer to (c), in units of 10¹⁸ m.', sqrt(4 * 4 * pi * 4.0e17 ** 2 * 5.0e-9 / (4 * pi * 2.0e-10)), '10¹⁸ m',
  f'(a) L = 4π × (4.0 × 10¹⁷)² × 5.0 × 10⁻⁹ = {sf(4 * pi * 4e17 ** 2 * 5e-9, 4)} W. (b) 4.0 × {sf(4 * pi * 4e17 ** 2 * 5e-9, 4)} = {sf(16 * pi * 4e17 ** 2 * 5e-9, 4)} W. (c) d = √({sf(16 * pi * 4e17 ** 2 * 5e-9, 4)} ÷ (4π × 2.0 × 10⁻¹⁰)) = {sf(sqrt(16 * pi * 4e17 ** 2 * 5e-9 / (4 * pi * 2e-10)))} m',
  ['C1: L of X', 'C1: L of Y', 'M1: d = √(L/4πF)', 'C1: substitution', 'C1: value'], aq='d')
N('H', 5, 'A solar panel of area 2.0 m² on a probe near Mars (2.3 × 10¹¹ m from the Sun, L = 3.8 × 10²⁶ W) is 20% efficient. (a) Calculate the flux intensity at Mars. (b) Calculate the electrical power produced.', 0.20 * 2.0 * flux(3.8e26, 2.3e11), 'W',
  f'(a) F = 3.8 × 10²⁶ ÷ (4π × (2.3 × 10¹¹)²) = {sf(flux(3.8e26, 2.3e11), 4)} W m⁻². (b) P = 0.20 × 2.0 × {sf(flux(3.8e26, 2.3e11), 4)} = {sf(0.4 * flux(3.8e26, 2.3e11))} W',
  ['C1: flux', 'M1: P = efficiency × FA', 'C1: substitution', 'C1: value'], aq='P')
N('H', 6, 'Dust between the Earth and a standard candle absorbs 20% of its light. The candle\'s luminosity is 3.0 × 10²⁹ W and the flux received is 1.2 × 10⁻¹² W m⁻². (a) Calculate the distance assuming no absorption. (b) Calculate the true distance. (c) Calculate the percentage error in (a). Give only the answer to (b), in units of 10²⁰ m.', sqrt(3.0e29 / (4 * pi * 1.2e-12 / 0.80)), '10²⁰ m',
  f'(a) √(3.0 × 10²⁹ ÷ (4π × 1.2 × 10⁻¹²)) = {sf(sqrt(3e29 / (4 * pi * 1.2e-12)), 4)} m. (b) True flux without dust = 1.2 × 10⁻¹² ÷ 0.80 = 1.5 × 10⁻¹²; d = √(3.0 × 10²⁹ ÷ (4π × 1.5 × 10⁻¹²)) = {sf(sqrt(3e29 / (4 * pi * 1.5e-12)))} m. (c) About 12% too large.',
  ['C1: naive distance', 'M1: correct the flux', 'C1: true distance', 'C1: value', 'C1: percentage error'], aq='d')
N('H', 5, 'Two Cepheids have periods that imply luminosities in the ratio 3.0 : 1. The brighter-luminosity one gives 1.5 times the flux of the other. (a) Write L = 4πd²F for each. (b) Calculate (distance of the more luminous) ÷ (distance of the less luminous).', sqrt(3.0 / 1.5), None,
  f'(a) L₁ = 4πd₁²F₁, L₂ = 4πd₂²F₂. (b) d₁/d₂ = √((L₁/L₂) ÷ (F₁/F₂)) = √(3.0 ÷ 1.5) = {sf(sqrt(2))}',
  ['B1: both equations', 'M1: divide', 'C1: substitution', 'C1: value'], aq='ratio')
N('H', 6, 'The Sun (L = 3.8 × 10²⁶ W) is seen from a star 4.0 × 10¹⁶ m away. (a) Calculate the flux intensity received there from the Sun. (b) A telescope there has a mirror of area 1.0 m². Calculate the power it collects from the Sun. (c) Taking photons of 550 nm (energy 3.6 × 10⁻¹⁹ J), calculate the photons collected per second. Give only the answer to (b), in units of 10⁻⁸ W.', flux(3.8e26, 4.0e16) * 1.0, '10⁻⁸ W',
  f'(a) F = 3.8 × 10²⁶ ÷ (4π × (4.0 × 10¹⁶)²) = {sf(flux(3.8e26, 4e16), 4)} W m⁻². (b) P = {sf(flux(3.8e26, 4e16), 4)} × 1.0 = {sf(flux(3.8e26, 4e16))} W. (c) ≈ {sf(flux(3.8e26, 4e16) / 3.6e-19, 2)} photons per second.',
  ['C1: flux', 'M1: P = FA', 'C1: value', 'C1: photon rate', 'B1: units'], aq='P')
N('H', 5, 'A galaxy contains a type 1a supernova of peak luminosity 8.0 × 10³⁵ W. Its peak flux at the Earth is 5.0 × 10⁻¹⁶ W m⁻². (a) Calculate its distance. (b) Express it in Mpc (1 Mpc = 3.09 × 10²² m).', sqrt(8.0e35 / (4 * pi * 5.0e-16)) / MPC, 'Mpc',
  f'(a) d = √(8.0 × 10³⁵ ÷ (4π × 5.0 × 10⁻¹⁶)) = {sf(sqrt(8e35 / (4 * pi * 5e-16)), 4)} m. (b) {sf(sqrt(8e35 / (4 * pi * 5e-16)), 4)} ÷ 3.09 × 10²² = {sf(sqrt(8e35 / (4 * pi * 5e-16)) / MPC)} Mpc',
  ['C1: formula', 'C1: value', 'M1: m to Mpc', 'C1: value'], aq='d')
N('H', 6, 'Earth receives 1.36 kW m⁻² from the Sun at 1.50 × 10¹¹ m. (a) Calculate the solar flux at Venus, 1.08 × 10¹¹ m from the Sun. (b) Calculate the flux at Saturn, 1.43 × 10¹² m from the Sun. Give only the answer to (a), in kW m⁻².', 1.36 * (1.50 / 1.08) ** 2, 'kW m⁻²',
  f'(a) F = 1.36 × (1.50 × 10¹¹ ÷ 1.08 × 10¹¹)² = {sf(1.36 * (1.5 / 1.08) ** 2)} kW m⁻². (b) 1.36 × (1.50 ÷ 14.3)² ≈ 0.015 kW m⁻².',
  ['M1: inverse square ratio', 'C1: substitution', 'C1: value', 'C1: Saturn', 'B1: units'], aq='F')

N('E', 2, 'A lighthouse lamp radiates 2.0 kW equally in all directions. Calculate the intensity 500 m away, in units of 10⁻⁴ W m⁻².', flux(2.0e3, 500), '10⁻⁴ W m⁻²',
  f'I = 2.0 × 10³ ÷ (4π × 500²) = {sf(flux(2e3, 500))} W m⁻²', ['C1: I = P/4πd²'], aq='I')

# ═════════════════════════ 31.2 Luminosity and radiant flux intensity (16/18/10) ═════════════════════════
lesson('31.2')
N('E', 2, 'Sirius has a luminosity of 9.7 × 10²⁷ W and is 8.1 × 10¹⁶ m away. Calculate the radiant flux intensity at the Earth, in units of 10⁻⁸ W m⁻².', flux(9.7e27, 8.1e16), '10⁻⁸ W m⁻²',
  f'F = 9.7 × 10²⁷ ÷ (4π × (8.1 × 10¹⁶)²) = {sf(flux(9.7e27, 8.1e16))} W m⁻²', ['C1: F = L/4πd²'], aq='F')
M('E', 1, 'What is the radiant flux intensity received from a star?', 'The power from the star passing through unit area at right angles to the light', ['The total power the star emits', 'The energy of one photon from the star', 'The star\'s surface temperature'], 'It is the power per unit area at the observer: F = L/4πd².')
N('E', 2, 'A star of luminosity 4.0 × 10²⁶ W is at a distance where the flux intensity is 2.0 × 10⁻⁸ W m⁻². Calculate the area of the sphere over which its power is spread, in units of 10³⁴ m².', 4.0e26 / 2.0e-8, '10³⁴ m²',
  'A = L/F = 4.0 × 10²⁶ ÷ 2.0 × 10⁻⁸ = 2.0 × 10³⁴ m²', ['C1: A = L/F'], sig=2, aq='A')
M('E', 1, 'The luminosity of a star doubles while its distance stays the same. What happens to the flux received?', 'It doubles', ['It halves', 'It quadruples', 'It stays the same'], 'F = L/4πd², so at fixed d the flux is proportional to L.')
N('E', 2, 'A star gives a flux intensity of 60 W m⁻² at one distance. Calculate the flux at four times that distance.', 60 / 16, 'W m⁻²',
  'F = 60 ÷ 4² = 3.75 W m⁻²', ['C1: inverse square'], aq='F')
M('E', 1, 'How does the flux intensity F depend on the distance d from a star?', 'F ∝ 1/d²', ['F ∝ d', 'F ∝ 1/d', 'F ∝ d²'], 'Power spreads over 4πd².')
N('E', 2, 'A star\'s flux intensity at the Earth is 3.0 × 10⁻⁹ W m⁻² and it is 6.0 × 10¹⁷ m away. Calculate its luminosity, in units of 10²⁷ W.', 3.0e-9 * 4 * pi * 6.0e17 ** 2, '10²⁷ W',
  f'L = 4πd²F = 4π × (6.0 × 10¹⁷)² × 3.0 × 10⁻⁹ = {sf(3e-9 * 4 * pi * 6e17 ** 2)} W', ['C1: L = 4πd²F'], aq='L')
M('E', 1, 'Why is a nearby dim star sometimes brighter in the sky than a distant luminous one?', 'Flux depends on distance as well as luminosity', ['The distant star is cooler', 'Light from distant stars is slower', 'Brightness depends only on temperature'], 'F = L/4πd²: a small d can outweigh a small L.')
N('E', 2, 'The Sun (luminosity 3.8 × 10²⁶ W) is 5.8 × 10¹⁰ m from Mercury. Calculate the solar flux at Mercury, in kW m⁻².', flux(3.8e26, 5.8e10) / 1e3, 'kW m⁻²',
  f'F = 3.8 × 10²⁶ ÷ (4π × (5.8 × 10¹⁰)²) = {sf(flux(3.8e26, 5.8e10), 4)} W m⁻². In kW m⁻²: {sf(flux(3.8e26, 5.8e10), 4)} ÷ 10³ = {sf(flux(3.8e26, 5.8e10) / 1e3)}', ['C1: formula'], aq='F')
M('E', 1, 'Which quantity is the same for all observers of a star, wherever they are?', 'Its luminosity', ['The flux intensity received', 'Its apparent brightness', 'The angle it fills in the sky'], 'L is a property of the star itself.')
N('E', 2, 'A star\'s flux at the Earth is 2.5 × 10⁻¹⁰ W m⁻². How much power falls on a telescope mirror of area 4.0 m²?', 2.5e-10 * 4.0, 'W',
  'P = FA = 2.5 × 10⁻¹⁰ × 4.0 = 1.0 × 10⁻⁹ W', ['C1: P = FA'], sig=2, aq='P')
M('E', 1, 'In the formula F = L/4πd², what does 4πd² represent?', 'The surface area of a sphere of radius d centred on the star', ['The area of the star', 'The area of the telescope', 'The volume of space around the star'], 'The power spreads uniformly over this sphere.')
N('E', 2, 'Two stars have the same luminosity. Star P is 5.0 times further away than star Q. Calculate (flux from Q) ÷ (flux from P).', 25, None,
  'F ∝ 1/d²: ratio = 5.0² = 25', ['C1: inverse square'], sig=2, aq='ratio')
M('E', 1, 'A star is twice as far away as another of the same luminosity. What fraction of the nearer star\'s flux do we receive from it?', 'One quarter', ['One half', 'Twice as much', 'The same'], 'F ∝ 1/d², so doubling d gives 1/2² = 1/4.')
N('E', 2, 'A lamp of power 60 W radiates equally in all directions. Calculate the intensity 2.0 m away.', flux(60, 2.0), 'W m⁻²',
  f'I = 60 ÷ (4π × 2.0²) = {sf(flux(60, 2.0))} W m⁻²', ['C1: I = P/4πd²'], aq='I')
N('E', 1, 'A star of luminosity 1.0 × 10²⁸ W is 1.0 × 10¹⁸ m away. Calculate the flux intensity in units of 10⁻¹⁰ W m⁻².', flux(1.0e28, 1.0e18), '10⁻¹⁰ W m⁻²',
  f'F = 1.0 × 10²⁸ ÷ (4π × (1.0 × 10¹⁸)²) = {sf(flux(1e28, 1e18))} W m⁻²', [], aq='F')
# medium
N('M', 3, 'Star A has 100 times the luminosity of star B but appears equally bright. Calculate (distance of A) ÷ (distance of B).', sqrt(100), None,
  'Equal F: d ∝ √L, so ratio = √100 = 10', ['C1: F equal', 'C1: √ of L ratio'], sig=2, aq='ratio')
N('M', 3, 'A star 2.0 × 10¹⁷ m away gives a flux of 8.0 × 10⁻⁹ W m⁻². Calculate the flux received from it at a planet 5.0 × 10¹⁶ m from the star.', 8.0e-9 * (2.0e17 / 5.0e16) ** 2, 'W m⁻²',
  f'F₂ = F₁(d₁/d₂)² = 8.0 × 10⁻⁹ × (2.0 × 10¹⁷ ÷ 5.0 × 10¹⁶)² = {sf(8e-9 * 16)} W m⁻²', ['C1: inverse square ratio', 'C1: value'], aq='F')
M('M', 3, 'Why can radiant flux intensity be measured directly but luminosity cannot?', 'Flux is what a detector on Earth receives; luminosity also needs the distance', ['Luminosity is too large to measure', 'Detectors measure luminosity', 'Flux depends only on temperature'], 'L = 4πd²F, so finding L also needs the distance d.', ['C1: F measured', 'C1: d needed for L'])
N('M', 4, 'A star of luminosity 2.0 × 10²⁸ W gives a flux of 1.1 × 10⁻¹⁰ W m⁻². Calculate its distance in light-years (1 ly = 9.46 × 10¹⁵ m).', sqrt(2.0e28 / (4 * pi * 1.1e-10)) / LY, 'ly',
  f'd = √(2.0 × 10²⁸ ÷ (4π × 1.1 × 10⁻¹⁰)) = {sf(sqrt(2e28 / (4 * pi * 1.1e-10)), 4)} m. In ly: {sf(sqrt(2e28 / (4 * pi * 1.1e-10)), 4)} ÷ 9.46 × 10¹⁵ = {sf(sqrt(2e28 / (4 * pi * 1.1e-10)) / LY)}', ['C1: rearrange', 'C1: value in m', 'C1: m to ly'], aq='d')
N('M', 3, 'The flux from the Sun at the Earth is 1.36 kW m⁻². Calculate the flux at Neptune, which is 30 times further from the Sun.', 1.36e3 / 30 ** 2, 'W m⁻²',
  f'F = 1360 ÷ 30² = {sf(1360 / 900)} W m⁻²', ['C1: inverse square', 'C1: value'], aq='F')
M('M', 3, 'Star P has 4 times the luminosity of star Q and is twice as far away. How do their fluxes at the Earth compare?', 'They are equal', ['P\'s flux is twice Q\'s', 'P\'s flux is half Q\'s', 'P\'s flux is four times Q\'s'], 'F ∝ L/d², and 4 ÷ 2² = 1, so the fluxes are equal.', ['C1: F ∝ L/d²', 'C1: ratio 1'])
N('M', 3, 'A star is 3.1 × 10¹⁷ m away and its luminosity is 1.5 × 10²⁷ W. Calculate the power received by a telescope mirror of area 10 m².', 10 * flux(1.5e27, 3.1e17), 'W',
  f'F = 1.5 × 10²⁷ ÷ (4π × (3.1 × 10¹⁷)²) = {sf(flux(1.5e27, 3.1e17), 4)} W m⁻². P = 10 × {sf(flux(1.5e27, 3.1e17), 4)} = {sf(10 * flux(1.5e27, 3.1e17))} W', ['C1: flux', 'C1: P = FA'], aq='P')
N('M', 3, 'The flux from a star is measured as 4.5 × 10⁻¹⁰ W m⁻² and its distance is 12 light-years (1 ly = 9.46 × 10¹⁵ m). Calculate its luminosity in units of 10²⁶ W.', 4 * pi * (12 * LY) ** 2 * 4.5e-10, '10²⁶ W',
  f'd = 12 × 9.46 × 10¹⁵ = {sf(12 * LY, 4)} m. L = 4π × ({sf(12 * LY, 4)})² × 4.5 × 10⁻¹⁰ = {sf(4 * pi * (12 * LY) ** 2 * 4.5e-10)} W', ['C1: ly to m', 'C1: L = 4πd²F'], aq='L')
M('M', 3, 'What assumption is made when using F = L/4πd²?', 'The star radiates equally in all directions and no light is absorbed on the way', ['The star is a perfect sphere of known radius', 'The star is not moving', 'The star has the same temperature as the Sun'], 'Isotropic emission and no absorption.', ['C1: isotropic', 'C1: no absorption'])
N('M', 3, 'At what distance from the Sun (L = 3.8 × 10²⁶ W) is the flux 100 W m⁻²? Give your answer in units of 10¹¹ m.', sqrt(3.8e26 / (4 * pi * 100)), '10¹¹ m',
  f'd = √(3.8 × 10²⁶ ÷ (4π × 100)) = {sf(sqrt(3.8e26 / (400 * pi)))} m', ['C1: rearranged', 'C1: value'], aq='d')
N('M', 4, 'The Sun\'s luminosity is 3.8 × 10²⁶ W. A star has 25 times this luminosity and gives the same flux at the Earth as the Sun would give from 10 light-years away. Calculate the distance of the star in light-years (ly).', 10 * sqrt(25), 'ly',
  'Equal F: d ∝ √L, so d = 10 × √25 = 50 ly', ['M1: d ∝ √L for equal F', 'C1: √25', 'C1: value'], sig=2, aq='d')
M('M', 3, 'A star\'s flux at the Earth is halved. If its luminosity is unchanged, by what factor has its distance changed?', 'It has increased by a factor of √2', ['It has doubled', 'It has halved', 'It has increased by a factor of 4'], 'F ∝ 1/d², so d ∝ 1/√F.', ['C1: d ∝ 1/√F', 'C1: √2'])
N('M', 3, 'A probe measures the flux from the Sun as 4.0 kW m⁻². How far is it from the Sun (L = 3.8 × 10²⁶ W), in units of 10¹⁰ m?', sqrt(3.8e26 / (4 * pi * 4.0e3)), '10¹⁰ m',
  f'd = √(3.8 × 10²⁶ ÷ (4π × 4.0 × 10³)) = {sf(sqrt(3.8e26 / (4 * pi * 4e3)))} m', ['C1: rearrange', 'C1: kW to W'], aq='d')
N('M', 3, 'Calculate (flux from the Sun at Venus, 1.08 × 10¹¹ m) ÷ (flux at the Earth, 1.50 × 10¹¹ m).', (1.50 / 1.08) ** 2, None,
  f'Ratio = (1.50 ÷ 1.08)² = {sf((1.5 / 1.08) ** 2)}', ['C1: inverse square', 'C1: value'], aq='ratio')
M('M', 4, 'A galaxy contains 10¹¹ stars, each of about the Sun\'s luminosity. How does the flux from the galaxy compare with that from a single such star at the same distance?', 'It is 10¹¹ times larger', ['It is the same', 'It is 10⁵·⁵ times larger', 'It is 10²² times larger'], 'Luminosities add; flux ∝ L.', ['C1: luminosities add', 'C1: F ∝ L', 'C1: factor 10¹¹'])
N('M', 3, 'A star\'s flux is 7.2 × 10⁻⁹ W m⁻² and its luminosity is 3.6 × 10²⁷ W. Calculate its distance in units of 10¹⁷ m.', sqrt(3.6e27 / (4 * pi * 7.2e-9)), '10¹⁷ m',
  f'd = √(3.6 × 10²⁷ ÷ (4π × 7.2 × 10⁻⁹)) = {sf(sqrt(3.6e27 / (4 * pi * 7.2e-9)))} m', ['C1: rearrange', 'C1: value'], aq='d')
N('M', 3, 'A star is 15 light-years away and gives the same flux at the Earth as a star of luminosity 2.0 × 10²⁶ W at 5.0 light-years. Calculate the first star\'s luminosity in units of 10²⁷ W.', 2.0e26 * (15 / 5.0) ** 2, '10²⁷ W',
  'Equal F: L ∝ d², so L = 2.0 × 10²⁶ × (15 ÷ 5.0)² = 1.8 × 10²⁷ W', ['C1: L ∝ d²', 'C1: value'], sig=2, aq='L')
# hard
N('H', 5, 'Proxima Centauri is 4.0 × 10¹⁶ m away and gives a flux of 3.6 × 10⁻¹¹ W m⁻². (a) Calculate its luminosity. (b) Calculate (its luminosity) ÷ (the Sun\'s, 3.8 × 10²⁶ W). Give only the answer to (b), in units of 10⁻³.', 4 * pi * 4.0e16 ** 2 * 3.6e-11 / 3.8e26, '10⁻³',
  f'(a) L = 4π × (4.0 × 10¹⁶)² × 3.6 × 10⁻¹¹ = {sf(4 * pi * 4e16 ** 2 * 3.6e-11, 4)} W. (b) {sf(4 * pi * 4e16 ** 2 * 3.6e-11, 4)} ÷ 3.8 × 10²⁶ = {sf(4 * pi * 4e16 ** 2 * 3.6e-11 / 3.8e26)}',
  ['C1: L = 4πd²F', 'C1: value', 'M1: ratio', 'C1: value'], aq='ratio')
N('H', 6, 'A binary system has two stars at the same distance. Together they give a flux of 6.0 × 10⁻¹⁰ W m⁻²; star 1 has twice the luminosity of star 2. The system is 3.0 × 10¹⁷ m away. (a) Calculate the total luminosity. (b) Calculate the luminosity of star 2. (c) Calculate the flux from star 1 alone. Give only the answer to (b), in units of 10²⁶ W.', 4 * pi * 3.0e17 ** 2 * 6.0e-10 / 3, '10²⁶ W',
  f'(a) L = 4π × (3.0 × 10¹⁷)² × 6.0 × 10⁻¹⁰ = {sf(4 * pi * 9e34 * 6e-10, 4)} W. (b) L₂ = {sf(4 * pi * 9e34 * 6e-10, 4)} ÷ 3 = {sf(4 * pi * 9e34 * 6e-10 / 3)} W. (c) 2/3 × 6.0 × 10⁻¹⁰ = 4.0 × 10⁻¹⁰ W m⁻².',
  ['C1: total L', 'M1: share 2 : 1', 'C1: value', 'C1: flux of star 1', 'B1: fluxes add'], aq='L₂')
N('H', 5, 'A space telescope can detect stars that give a flux of at least 1.0 × 10⁻¹⁸ W m⁻². (a) Calculate the greatest distance at which it can detect a star like the Sun (3.8 × 10²⁶ W). (b) Express it in light-years (1 ly = 9.46 × 10¹⁵ m). Give only the answer to (b), in units of 10⁵ ly.', sqrt(3.8e26 / (4 * pi * 1.0e-18)) / LY, '10⁵ ly',
  f'(a) d = √(3.8 × 10²⁶ ÷ (4π × 1.0 × 10⁻¹⁸)) = {sf(sqrt(3.8e26 / (4 * pi * 1e-18)), 4)} m. (b) {sf(sqrt(3.8e26 / (4 * pi * 1e-18)), 4)} ÷ 9.46 × 10¹⁵ = {sf(sqrt(3.8e26 / (4 * pi * 1e-18)) / LY)} ly',
  ['C1: rearrange', 'C1: value', 'M1: m to ly', 'C1: value'], aq='d')
N('H', 6, 'An exoplanet orbits 1.2 × 10¹¹ m from a star of luminosity 5.0 × 10²⁶ W. (a) Calculate the flux at the planet. (b) The planet has radius 6.0 × 10⁶ m and absorbs 70% of the radiation falling on its cross-section. Calculate the power absorbed. Give only the answer to (b), in units of 10¹⁶ W.', 0.70 * flux(5.0e26, 1.2e11) * pi * 6.0e6 ** 2, '10¹⁶ W',
  f'(a) F = 5.0 × 10²⁶ ÷ (4π × (1.2 × 10¹¹)²) = {sf(flux(5e26, 1.2e11), 4)} W m⁻². (b) P = 0.70 × {sf(flux(5e26, 1.2e11), 4)} × π × (6.0 × 10⁶)² = {sf(0.7 * flux(5e26, 1.2e11) * pi * 36e12)} W',
  ['C1: flux', 'M1: cross-sectional area πr²', 'C1: × 0.70', 'C1: substitution', 'C1: value'], aq='P')
N('H', 5, 'Two stars have luminosities in the ratio 9 : 1 and give fluxes at the Earth in the ratio 1 : 4. Calculate (distance of the more luminous) ÷ (distance of the other).', sqrt(9 * 4), None,
  'd ∝ √(L/F): ratio = √(9 × 4) = 6.0', ['M1: d = √(L/4πF)', 'C1: ratio of L', 'C1: ratio of F', 'C1: value'], sig=2, aq='ratio')
N('H', 6, 'The Sun\'s luminosity is 3.8 × 10²⁶ W. (a) Calculate the solar flux at the Earth (1.50 × 10¹¹ m). (b) Calculate the total power intercepted by the Earth (radius 6.37 × 10⁶ m). (c) Calculate the fraction of the Sun\'s output that the Earth intercepts. Give only the answer to (c), in units of 10⁻¹⁰.', pi * 6.37e6 ** 2 / (4 * pi * 1.50e11 ** 2), '10⁻¹⁰',
  f'(a) F = 3.8 × 10²⁶ ÷ (4π × (1.50 × 10¹¹)²) = {sf(flux(3.8e26, 1.5e11), 4)} W m⁻². (b) P = {sf(flux(3.8e26, 1.5e11), 4)} × π × (6.37 × 10⁶)² = {sf(flux(3.8e26, 1.5e11) * pi * 6.37e6 ** 2, 4)} W. (c) πR² ÷ 4πd² = (6.37 × 10⁶)² ÷ (4 × (1.50 × 10¹¹)²) = {sf(6.37e6 ** 2 / (4 * 1.5e11 ** 2))}',
  ['C1: flux', 'C1: cross-section', 'C1: power', 'M1: fraction', 'C1: value'], aq='fraction')
N('H', 5, 'A Cepheid in the Andromeda galaxy has a luminosity of 1.2 × 10³⁰ W and gives a flux of 4.0 × 10⁻¹⁵ W m⁻². (a) Calculate the distance to Andromeda. (b) Express it in Mpc (1 Mpc = 3.09 × 10²² m).', sqrt(1.2e30 / (4 * pi * 4.0e-15)) / MPC, 'Mpc',
  f'(a) d = √(1.2 × 10³⁰ ÷ (4π × 4.0 × 10⁻¹⁵)) = {sf(sqrt(1.2e30 / (4 * pi * 4e-15)), 4)} m. (b) {sf(sqrt(1.2e30 / (4 * pi * 4e-15)), 4)} ÷ 3.09 × 10²² = {sf(sqrt(1.2e30 / (4 * pi * 4e-15)) / MPC)} Mpc',
  ['C1: rearrange', 'C1: value', 'M1: m to Mpc', 'C1: value'], aq='d')
N('H', 6, 'A star of luminosity L at distance d gives a flux F. (a) Show that a star of luminosity 4L at distance 3d gives a flux of 4F/9. (b) Calculate this flux when F = 9.0 × 10⁻⁹ W m⁻².', 4 / 9 * 9.0e-9, 'W m⁻²',
  '(a) F′ = 4L ÷ (4π(3d)²) = (4/9) × L/(4πd²) = 4F/9. (b) F′ = 4 ÷ 9 × 9.0 × 10⁻⁹ = 4.0 × 10⁻⁹ W m⁻²',
  ['M1: substitute 4L and 3d', 'B1: 4F/9 shown', 'C1: substitution', 'C1: value', 'B1: units'], sig=2, aq='F′')
N('H', 5, 'A star 1.5 × 10¹⁸ m away gives a flux of 2.4 × 10⁻¹⁰ W m⁻². (a) Calculate its luminosity. (b) Calculate the flux it would give at 10 pc (1 pc = 3.09 × 10¹⁶ m). Give only the answer to (b), in units of 10⁻⁷ W m⁻².', 4 * pi * 1.5e18 ** 2 * 2.4e-10 / (4 * pi * (10 * PC) ** 2), '10⁻⁷ W m⁻²',
  f'(a) L = 4π × (1.5 × 10¹⁸)² × 2.4 × 10⁻¹⁰ = {sf(4 * pi * 2.25e36 * 2.4e-10, 4)} W. (b) F = 2.4 × 10⁻¹⁰ × (1.5 × 10¹⁸ ÷ 3.09 × 10¹⁷)² = {sf(2.4e-10 * (1.5e18 / (10 * PC)) ** 2)} W m⁻²',
  ['C1: L', 'C1: 10 pc in m', 'M1: inverse square', 'C1: value'], aq='F')
N('H', 6, 'An astronomer measures fluxes from two Cepheids of the same period (so equal luminosity): 8.0 × 10⁻¹² W m⁻² from one in our galaxy at a known 6.0 × 10¹⁹ m, and 2.0 × 10⁻¹⁷ W m⁻² from one in another galaxy. (a) Explain why equal periods imply equal luminosities. (b) Calculate the distance to the other galaxy. Give only the answer to (b), in units of 10²² m.', 6.0e19 * sqrt(8.0e-12 / 2.0e-17), '10²² m',
  f'(a) The period–luminosity law links them. (b) d₂ = d₁√(F₁/F₂) = 6.0 × 10¹⁹ × √(8.0 × 10⁻¹² ÷ 2.0 × 10⁻¹⁷) = {sf(6e19 * sqrt(4e5))} m',
  ['B1: period–luminosity', 'M1: d ∝ 1/√F', 'C1: flux ratio', 'C1: substitution', 'C1: value'], aq='d')
N('E', 2, 'Polaris has a luminosity of 8.6 × 10²⁹ W and gives a flux of 1.6 × 10⁻⁹ W m⁻² at the Earth. Calculate its distance in units of 10¹⁸ m.', sqrt(8.6e29 / (4 * pi * 1.6e-9)), '10¹⁸ m',
  f'd = √(8.6 × 10²⁹ ÷ (4π × 1.6 × 10⁻⁹)) = {sf(sqrt(8.6e29 / (4 * pi * 1.6e-9)))} m', ['C1: d = √(L/4πF)'], aq='d')

# ═════════════════════════ 31.3 Stellar radii: Wien and Stefan–Boltzmann (17/16/9) ═════════════════════════
lesson('31.3')
N('E', 2, 'Betelgeuse emits most strongly at a wavelength of 830 nm. Calculate its surface temperature.' + take('wien'), WIEN / 830e-9, 'K',
  f'T = 2.90 × 10⁻³ ÷ 830 × 10⁻⁹ = {sf(WIEN / 830e-9)} K', ['C1: λmax T = constant'], aq='T')
M('E', 1, 'How does the peak wavelength of a star\'s spectrum change as its surface temperature rises?', 'It becomes shorter', ['It becomes longer', 'It stays the same', 'It becomes zero'], 'Wien: λmax ∝ 1/T, so hotter stars peak at shorter wavelengths.')
N('E', 2, 'Rigel has a surface temperature of 12 000 K. Calculate the wavelength at which it emits most strongly, in nm.' + take('wien'), WIEN / 12000 * 1e9, 'nm',
  f'λ = 2.90 × 10⁻³ ÷ 12 000 = {sf(WIEN / 12000, 4)} m. In nm: {sf(WIEN / 12000, 4)} × 10⁹ = {sf(WIEN / 12000 * 1e9)}', ['C1: λmax = b/T'], aq='λmax')
M('E', 1, 'Which equation is the Stefan–Boltzmann law for a star of radius r and surface temperature T?', 'L = 4πr²σT⁴', ['L = σT⁴', 'L = 4πr²σT²', 'L = πr²σT⁴'], 'Power per unit area σT⁴ times the surface area 4πr².')
N('E', 2, 'A star has a radius of 5.0 × 10⁸ m and a surface temperature of 4000 K. Calculate its luminosity, in units of 10²⁵ W.' + take('sigma'), lum(5.0e8, 4000), '10²⁵ W',
  f'L = 4πr²σT⁴ = 4π × (5.0 × 10⁸)² × 5.67 × 10⁻⁸ × 4000⁴ = {sf(lum(5e8, 4000))} W', ['C1: L = 4πr²σT⁴'], aq='L')
M('E', 1, 'What colour is a star with a very high surface temperature?', 'Blue-white', ['Red', 'Orange', 'Yellow'], 'Its spectrum peaks at short (blue/ultraviolet) wavelengths.')
N('E', 2, 'The surface temperature of a star is doubled while its radius stays the same. By what factor does its luminosity increase?', 2 ** 4, None,
  'L ∝ T⁴: factor = 2⁴ = 16', ['C1: T⁴ dependence'], sig=2, aq='factor')
M('E', 1, 'What is meant by a black body?', 'An object that absorbs all radiation falling on it and emits the maximum possible at each wavelength for its temperature', ['An object that emits no radiation', 'An object that reflects all light', 'A cold dark cloud of dust'], 'Stars are close to black-body emitters.')
N('E', 2, 'The radius of a star is tripled while its surface temperature stays the same. By what factor does its luminosity increase?', 9, None,
  'L ∝ r²: factor = 3² = 9', ['C1: r² dependence'], sig=1, aq='factor')
M('E', 1, 'What does σ represent in the Stefan–Boltzmann law?', 'The Stefan–Boltzmann constant, 5.67 × 10⁻⁸ W m⁻² K⁻⁴', ['The star\'s radius', 'The Wien constant', 'The surface area of the star'], 'It links the power per unit area to T⁴.')
N('E', 2, 'A red dwarf emits most strongly at 1000 nm. Calculate its surface temperature.' + take('wien'), WIEN / 1000e-9, 'K',
  f'T = 2.90 × 10⁻³ ÷ 1000 × 10⁻⁹ = {sf(WIEN / 1e-6)} K', ['C1: T = b/λmax'], aq='T')
M('E', 1, 'Which quantities must be known to find a star\'s radius from the Stefan–Boltzmann law?', 'Its luminosity and its surface temperature', ['Its mass and its distance', 'Its colour only', 'Its age and its speed'], 'From L = 4πr²σT⁴, r = √(L/4πσT⁴), so both L and T are needed.')
N('E', 2, 'Calculate the power radiated by each square metre of a star\'s surface at 6000 K, in units of 10⁷ W m⁻².' + take('sigma'), SIG * 6000 ** 4, '10⁷ W m⁻²',
  f'P/A = σT⁴ = 5.67 × 10⁻⁸ × 6000⁴ = {sf(SIG * 6000 ** 4)} W m⁻²', ['C1: σT⁴'], aq='P/A')
M('E', 1, 'In which unit is the Wien constant measured?', 'm K', ['m K⁻¹', 'K m⁻¹', 'W m⁻² K⁻⁴'], 'λmax T = constant, so the unit is metre kelvin.')
N('E', 2, 'Calculate (peak wavelength of a 3000 K star) ÷ (peak wavelength of a 9000 K star).', 9000 / 3000, None,
  'λmax ∝ 1/T: ratio = 9000 ÷ 3000 = 3.0', ['C1: inverse proportion'], sig=2, aq='ratio')
M('E', 1, 'Two stars have the same surface temperature, but one is much larger. Which statement is correct?', 'The larger star has the greater luminosity', ['The smaller star has the greater luminosity', 'They have equal luminosities', 'The larger star has a shorter peak wavelength'], 'L ∝ r² at fixed T; the peak wavelength depends only on T.')
N('E', 1, 'A star\'s spectrum peaks at 290 nm. Calculate its surface temperature.' + take('wien'), WIEN / 290e-9, 'K',
  f'T = 2.90 × 10⁻³ ÷ 290 × 10⁻⁹ = {sf(WIEN / 290e-9)} K', [], aq='T')
# medium
N('M', 3, 'A star has a luminosity of 1.5 × 10²⁸ W and a surface temperature of 9500 K. Calculate its radius, in units of 10⁹ m.' + take('sigma'), sqrt(1.5e28 / (4 * pi * SIG * 9500 ** 4)), '10⁹ m',
  f'r = √(L/4πσT⁴) = √(1.5 × 10²⁸ ÷ (4π × 5.67 × 10⁻⁸ × 9500⁴)) = {sf(sqrt(1.5e28 / (4 * pi * SIG * 9500 ** 4)))} m', ['C1: rearranged', 'C1: substitution'], aq='r')
N('M', 4, 'A star\'s spectrum peaks at 450 nm and its luminosity is 2.0 × 10²⁷ W. Calculate its radius, in units of 10⁹ m.' + take('wien', 'sigma'), sqrt(2.0e27 / (4 * pi * SIG * (WIEN / 450e-9) ** 4)), '10⁹ m',
  f'T = 2.90 × 10⁻³ ÷ 450 × 10⁻⁹ = {sf(WIEN / 450e-9, 4)} K. r = √(2.0 × 10²⁷ ÷ (4π × 5.67 × 10⁻⁸ × ({sf(WIEN / 450e-9, 4)})⁴)) = {sf(sqrt(2e27 / (4 * pi * SIG * (WIEN / 450e-9) ** 4)))} m',
  ['C1: T from Wien', 'C1: Stefan–Boltzmann rearranged', 'C1: value'], aq='r')
M('M', 3, 'A red giant and a white dwarf have similar luminosities. What can be concluded?', 'The red giant is much larger and much cooler', ['The white dwarf is larger', 'They have the same radius', 'The red giant is hotter'], 'L = 4πr²σT⁴: lower T must be offset by larger r.', ['C1: L same', 'C1: cooler means larger'])
N('M', 3, 'Star A has twice the radius of star B and half its surface temperature. Calculate (luminosity of A) ÷ (luminosity of B).', 2 ** 2 * 0.5 ** 4, None,
  'L ∝ r²T⁴: ratio = 2² × (0.5)⁴ = 0.25', ['C1: r² factor', 'C1: T⁴ factor'], aq='ratio')
N('M', 3, 'Treat the Sun as a black body whose surface is at 5800 K. Find the peak of its emission spectrum, giving the wavelength in nm.' + take('wien'), WIEN / 5800 * 1e9, 'nm',
  f'λ = 2.90 × 10⁻³ ÷ 5800 = {sf(WIEN / 5800, 4)} m. In nm: {sf(WIEN / 5800, 4)} × 10⁹ = {sf(WIEN / 5800 * 1e9)}', ['C1: Wien', 'C1: nm'], aq='λmax')
M('M', 3, 'How does the shape of a black-body spectrum change as the temperature rises?', 'The peak moves to shorter wavelengths and the whole curve rises', ['The peak moves to longer wavelengths', 'Only the height increases', 'The curve becomes a single line'], 'Wien\'s law and the Stefan–Boltzmann law together.', ['C1: peak shifts shorter', 'C1: total power increases'])
N('M', 3, 'Calculate the total power output of a white dwarf 7.0 × 10⁶ m in radius whose surface is at 25 000 K. Give the answer in units of 10²⁵ W.' + take('sigma'), lum(7.0e6, 25000), '10²⁵ W',
  f'L = 4π × (7.0 × 10⁶)² × 5.67 × 10⁻⁸ × 25 000⁴ = {sf(lum(7e6, 25000))} W', ['C1: formula', 'C1: substitution'], aq='L')
N('M', 4, 'A star\'s luminosity is 81 times that of the Sun and its surface temperature is the same as the Sun\'s. Calculate (radius of the star) ÷ (radius of the Sun).', sqrt(81), None,
  'Same T: L ∝ r², so r ratio = √81 = 9.0', ['M1: L ∝ r² at fixed T', 'C1: √81', 'C1: value'], sig=2, aq='ratio')
M('M', 3, 'Why can the radius of a distant star be found even though it cannot be seen as a disc?', 'Its luminosity (from flux and distance) and its temperature (from Wien\'s law) give r through L = 4πr²σT⁴', ['Its radius equals its distance', 'All stars have the same radius', 'Its radius is found from its colour alone'], 'Combine the two laws.', ['C1: L known', 'C1: T from spectrum'])
N('M', 3, 'A star has a radius of 2.5 × 10¹⁰ m and a luminosity of 4.0 × 10³⁰ W. Calculate its surface temperature.' + take('sigma'), (4.0e30 / (4 * pi * 2.5e10 ** 2 * SIG)) ** 0.25, 'K',
  f'T = (L/4πr²σ)^(1/4) = (4.0 × 10³⁰ ÷ (4π × (2.5 × 10¹⁰)² × 5.67 × 10⁻⁸))^0.25 = {sf((4e30 / (4 * pi * 2.5e10 ** 2 * SIG)) ** 0.25)} K', ['C1: rearranged', 'C1: fourth root'], aq='T')
N('M', 3, 'Calculate (power per unit area from a 10 000 K star) ÷ (power per unit area from a 5000 K star).', 2 ** 4, None,
  'σT⁴ ratio = (10 000 ÷ 5000)⁴ = 16', ['C1: ∝ T⁴', 'C1: value'], sig=2, aq='ratio')
M('M', 4, 'The Sun\'s spectrum peaks in the visible region, at about 500 nm. Where does the spectrum of a star at 3000 K peak?', 'In the infrared', ['In the ultraviolet', 'In the X-ray region', 'Exactly at 500 nm'], 'λmax = 2.90 × 10⁻³ ÷ 3000 ≈ 970 nm.', ['C1: Wien', 'C1: ~970 nm', 'C1: infrared'])
N('M', 3, 'Calculate the peak wavelength, in µm, for the cosmic microwave background at 2.7 K.' + take('wien'), WIEN / 2.7 * 1e6, 'µm',
  f'λ = 2.90 × 10⁻³ ÷ 2.7 = {sf(WIEN / 2.7, 4)} m. In µm: {sf(WIEN / 2.7, 4)} × 10⁶ = {sf(WIEN / 2.7 * 1e6)}', ['C1: Wien', 'C1: m to µm'], aq='λmax')
N('M', 3, 'A star\'s temperature rises by 10%. By what percentage does its luminosity rise, if its radius is unchanged?', (1.10 ** 4 - 1) * 100, '%',
  f'L ∝ T⁴: factor = 1.10⁴ = {sf(1.1 ** 4, 4)}; rise = ({sf(1.1 ** 4, 4)} − 1) × 100 = {sf((1.1 ** 4 - 1) * 100)} %', ['C1: T⁴', 'C1: percentage'], aq='rise')
N('M', 3, 'Two stars have equal radii. One has a surface temperature of 7500 K and the other 5000 K. Calculate (luminosity of the hotter star) ÷ (luminosity of the cooler star).', (7500 / 5000) ** 4, None,
  f'Equal r: L ∝ T⁴, so ratio = (7500 ÷ 5000)⁴ = {sf(1.5 ** 4)}', ['C1: L ∝ T⁴ at fixed r', 'C1: value'], aq='ratio')
N('M', 3, 'A star has a luminosity of 3.8 × 10²⁶ W and a radius of 7.0 × 10⁸ m. Calculate the power emitted by each square metre of its surface, in units of 10⁷ W m⁻².', 3.8e26 / (4 * pi * 7.0e8 ** 2), '10⁷ W m⁻²',
  f'P/A = L ÷ 4πr² = 3.8 × 10²⁶ ÷ (4π × (7.0 × 10⁸)²) = {sf(3.8e26 / (4 * pi * 7.0e8 ** 2))} W m⁻²', ['C1: area 4πr²', 'C1: value'], aq='P/A')
N('M', 3, 'A star\'s spectrum peaks at 380 nm. Calculate the power radiated by each square metre of its surface, in units of 10⁸ W m⁻².' + take('wien', 'sigma'), SIG * (WIEN / 380e-9) ** 4, '10⁸ W m⁻²',
  f'T = 2.90 × 10⁻³ ÷ 380 × 10⁻⁹ = {sf(WIEN / 380e-9, 4)} K. P/A = σT⁴ = 5.67 × 10⁻⁸ × {sf(WIEN / 380e-9, 4)}⁴ = {sf(SIG * (WIEN / 380e-9) ** 4)} W m⁻²', ['C1: T from Wien', 'C1: σT⁴'], aq='P/A')
# hard
N('H', 5, 'Sirius A has a luminosity of 9.7 × 10²⁷ W and its spectrum peaks at 290 nm. (a) Calculate its surface temperature. (b) Calculate its radius. Give only the answer to (b), in units of 10⁹ m.' + take('wien', 'sigma'), sqrt(9.7e27 / (4 * pi * SIG * (WIEN / 290e-9) ** 4)), '10⁹ m',
  f'(a) T = 2.90 × 10⁻³ ÷ 290 × 10⁻⁹ = {sf(WIEN / 290e-9)} K. (b) r = √(9.7 × 10²⁷ ÷ (4π × 5.67 × 10⁻⁸ × ({sf(WIEN / 290e-9)})⁴)) = {sf(sqrt(9.7e27 / (4 * pi * SIG * (WIEN / 290e-9) ** 4)))} m',
  ['C1: T', 'M1: r = √(L/4πσT⁴)', 'C1: substitution', 'C1: value'], aq='r')
N('H', 6, 'A star 2.0 × 10¹⁷ m away gives a flux of 6.0 × 10⁻⁹ W m⁻², and its spectrum peaks at 600 nm. (a) Calculate its luminosity. (b) Calculate its surface temperature. (c) Calculate its radius. Give only the answer to (c), in units of 10⁸ m.' + take('wien', 'sigma'), sqrt(4 * pi * 2.0e17 ** 2 * 6.0e-9 / (4 * pi * SIG * (WIEN / 600e-9) ** 4)), '10⁸ m',
  f'(a) L = 4π × (2.0 × 10¹⁷)² × 6.0 × 10⁻⁹ = {sf(4 * pi * 4e34 * 6e-9, 4)} W. (b) T = 2.90 × 10⁻³ ÷ 600 × 10⁻⁹ = {sf(WIEN / 600e-9, 4)} K. (c) r = √({sf(4 * pi * 4e34 * 6e-9, 4)} ÷ (4π × 5.67 × 10⁻⁸ × ({sf(WIEN / 600e-9, 4)})⁴)) = {sf(sqrt(4 * pi * 4e34 * 6e-9 / (4 * pi * SIG * (WIEN / 600e-9) ** 4)))} m',
  ['C1: L = 4πd²F', 'C1: T from Wien', 'M1: r from Stefan–Boltzmann', 'C1: substitution', 'C1: value'], aq='r')
N('H', 5, 'A red giant has a surface temperature of 3500 K and a luminosity 1000 times the Sun\'s (Sun: 5800 K). (a) Write L ∝ r²T⁴ for both stars. (b) Calculate (radius of the giant) ÷ (radius of the Sun).', sqrt(1000 * (5800 / 3500) ** 4), None,
  f'(a) L_g/L_s = (r_g/r_s)² (T_g/T_s)⁴. (b) r_g/r_s = √(1000 × (5800 ÷ 3500)⁴) = {sf(sqrt(1000 * (5800 / 3500) ** 4))}',
  ['B1: ratio form', 'M1: rearrange for r ratio', 'C1: substitution', 'C1: value'], aq='ratio')
N('H', 6, 'The Sun (radius 6.96 × 10⁸ m, surface temperature 5800 K) radiates as a black body. (a) Calculate its luminosity. (b) Calculate the flux at the Earth, 1.50 × 10¹¹ m away. Give only the answer to (b), in kW m⁻².' + take('sigma'), lum(6.96e8, 5800) / (4 * pi * 1.50e11 ** 2) / 1e3, 'kW m⁻²',
  f'(a) L = 4π × (6.96 × 10⁸)² × 5.67 × 10⁻⁸ × 5800⁴ = {sf(lum(6.96e8, 5800), 4)} W. (b) F = {sf(lum(6.96e8, 5800), 4)} ÷ (4π × (1.50 × 10¹¹)²) = {sf(lum(6.96e8, 5800) / (4 * pi * 1.5e11 ** 2), 4)} W m⁻². In kW m⁻²: {sf(lum(6.96e8, 5800) / (4 * pi * 1.5e11 ** 2), 4)} ÷ 10³ = {sf(lum(6.96e8, 5800) / (4 * pi * 1.5e11 ** 2) / 1e3)}',
  ['C1: L', 'C1: substitution', 'M1: F = L/4πd²', 'C1: value', 'C1: kW conversion'], aq='F')
N('H', 5, 'Two stars have the same luminosity. Star X has a peak wavelength of 400 nm and star Y one of 800 nm. (a) Calculate (temperature of X) ÷ (temperature of Y). (b) Calculate (radius of Y) ÷ (radius of X).', 2.0 ** 2, None,
  '(a) T ∝ 1/λmax: 800 ÷ 400 = 2.0. (b) Equal L: r ∝ 1/T², so r_Y/r_X = (2.0)² = 4.0',
  ['C1: temperature ratio', 'M1: r ∝ 1/T² for equal L', 'C1: substitution', 'C1: value'], sig=2, aq='ratio')
N('H', 6, 'A white dwarf of radius 6.0 × 10⁶ m has a luminosity of 2.0 × 10²⁴ W. (a) Calculate its surface temperature. (b) Calculate its peak wavelength in nm. Give only the answer to (b).' + take('sigma', 'wien'), WIEN / (2.0e24 / (4 * pi * 6.0e6 ** 2 * SIG)) ** 0.25 * 1e9, 'nm',
  f'(a) T = (2.0 × 10²⁴ ÷ (4π × (6.0 × 10⁶)² × 5.67 × 10⁻⁸))^0.25 = {sf((2e24 / (4 * pi * 36e12 * SIG)) ** 0.25, 4)} K. (b) λ = 2.90 × 10⁻³ ÷ {sf((2e24 / (4 * pi * 36e12 * SIG)) ** 0.25, 4)} = {sf(WIEN / (2e24 / (4 * pi * 36e12 * SIG)) ** 0.25, 4)} m. In nm: {sf(WIEN / (2e24 / (4 * pi * 36e12 * SIG)) ** 0.25, 4)} × 10⁹ = {sf(WIEN / (2e24 / (4 * pi * 36e12 * SIG)) ** 0.25 * 1e9)}',
  ['C1: T rearranged', 'C1: value', 'M1: Wien', 'C1: conversion', 'C1: value'], aq='λmax')
N('H', 5, 'Star P has radius 3.0 × 10⁹ m and temperature 8000 K; star Q has radius 1.5 × 10¹⁰ m and temperature 4000 K. (a) Calculate both luminosities. (b) Calculate (luminosity of Q) ÷ (luminosity of P).' + take('sigma'), lum(1.5e10, 4000) / lum(3.0e9, 8000), None,
  f'(a) P: {sf(lum(3e9, 8000), 4)} W; Q: {sf(lum(1.5e10, 4000), 4)} W. (b) Ratio = (1.5 × 10¹⁰ ÷ 3.0 × 10⁹)² × (4000 ÷ 8000)⁴ = {sf(lum(1.5e10, 4000) / lum(3e9, 8000))}',
  ['C1: L of P', 'C1: L of Q', 'M1: ratio of r²T⁴', 'C1: value'], aq='ratio')
N('H', 6, 'A star of luminosity 3.0 × 10²⁸ W at 4.0 × 10¹⁸ m has a spectrum peaking at 500 nm. (a) Calculate the flux at the Earth. (b) Calculate its temperature. (c) Calculate its radius. Give only the answer to (c), in units of 10⁹ m.' + take('wien', 'sigma'), sqrt(3.0e28 / (4 * pi * SIG * (WIEN / 500e-9) ** 4)), '10⁹ m',
  f'(a) F = 3.0 × 10²⁸ ÷ (4π × (4.0 × 10¹⁸)²) = {sf(flux(3e28, 4e18), 3)} W m⁻². (b) T = 2.90 × 10⁻³ ÷ 500 × 10⁻⁹ = 5800 K. (c) r = √(3.0 × 10²⁸ ÷ (4π × 5.67 × 10⁻⁸ × 5800⁴)) = {sf(sqrt(3e28 / (4 * pi * SIG * 5800 ** 4)))} m',
  ['C1: flux', 'C1: T', 'M1: r from L and T', 'C1: substitution', 'C1: value'], aq='r')
N('H', 5, 'The cosmic microwave background behaves as a black body at 2.73 K. (a) Calculate its peak wavelength in mm. (b) Calculate the power per unit area it radiates, in units of 10⁻⁶ W m⁻².' + take('wien', 'sigma'), SIG * 2.73 ** 4, '10⁻⁶ W m⁻²',
  f'(a) λ = 2.90 × 10⁻³ ÷ 2.73 = {sf(WIEN / 2.73, 4)} m, about 1.06 mm. (b) σT⁴ = 5.67 × 10⁻⁸ × 2.73⁴ = {sf(SIG * 2.73 ** 4)} W m⁻²',
  ['C1: Wien', 'C1: mm', 'M1: σT⁴', 'C1: value'], aq='P/A')

# ═════════════════════════ 31.4 Hubble's law and the Big Bang (17/18/7) ═════════════════════════
lesson('31.4')
N('E', 2, 'A spectral line of laboratory wavelength 656 nm is observed at 663 nm in the light from a galaxy. Calculate the galaxy\'s speed of recession, in units of 10⁶ m s⁻¹.' + take('c'), (663 - 656) / 656 * CL, '10⁶ m s⁻¹',
  f'v = cΔλ/λ = 3.00 × 10⁸ × (663 − 656) ÷ 656 = {sf(7 / 656 * CL)} m s⁻¹', ['C1: Δλ/λ = v/c'], aq='v')
M('E', 1, 'What is meant by redshift?', 'An increase in the observed wavelength of light from a receding source', ['A decrease in wavelength from an approaching source', 'Light turning red as it cools', 'Light being absorbed by dust'], 'Δλ/λ ≈ v/c for a receding source.')
N('E', 2, 'A galaxy is 3.0 × 10²⁴ m away. Taking H₀ = 2.3 × 10⁻¹⁸ s⁻¹, calculate its recession speed, in units of 10⁶ m s⁻¹.', 2.3e-18 * 3.0e24, '10⁶ m s⁻¹',
  'v = H₀d = 2.3 × 10⁻¹⁸ × 3.0 × 10²⁴ = 6.9 × 10⁶ m s⁻¹', ['C1: v = H₀d'], sig=2, aq='v')
M('E', 1, 'What does Hubble\'s law say about galaxies?', 'Their speed of recession is proportional to their distance', ['Nearer galaxies recede faster', 'All galaxies move at the same speed', 'Galaxies are moving towards us'], 'Hubble\'s law is v = H₀d, so recession speed ∝ distance.')
N('E', 2, 'A galaxy recedes at 1.5 × 10⁷ m s⁻¹. Taking H₀ = 2.3 × 10⁻¹⁸ s⁻¹, calculate its distance, in units of 10²⁴ m.', 1.5e7 / 2.3e-18, '10²⁴ m',
  f'd = v/H₀ = 1.5 × 10⁷ ÷ 2.3 × 10⁻¹⁸ = {sf(1.5e7 / 2.3e-18)} m', ['C1: d = v/H₀'], aq='d')
M('E', 1, 'Which observation suggests that the Universe is expanding?', 'Light from distant galaxies is redshifted, more for more distant galaxies', ['Stars twinkle', 'The Sun rises each day', 'Some stars are brighter than others'], 'Recession speed grows with distance.')
N('E', 2, 'A galaxy recedes at 6.0 × 10⁶ m s⁻¹. Calculate the fractional change in wavelength Δλ/λ of its light.' + take('c'), 6.0e6 / CL, None,
  'Δλ/λ = v/c = 6.0 × 10⁶ ÷ 3.00 × 10⁸ = 0.020', ['C1: Δλ/λ = v/c'], sig=2, aq='Δλ/λ')
M('E', 1, 'What is the cosmic microwave background radiation?', 'Radiation left over from the hot early Universe, now cooled to about 2.7 K', ['Microwaves from mobile phones', 'Radiation from the Sun', 'Heat from the Earth\'s core'], 'It is strong evidence for the Big Bang.')
N('E', 2, 'Taking H₀ = 2.3 × 10⁻¹⁸ s⁻¹, estimate the age of the Universe in years (1 year = 3.16 × 10⁷ s), in units of 10¹⁰ years.', 1 / 2.3e-18 / 3.16e7, '10¹⁰ years',
  f'T ≈ 1/H₀ = 1 ÷ 2.3 × 10⁻¹⁸ = {sf(1 / 2.3e-18, 4)} s, which is {sf(1 / 2.3e-18, 4)} ÷ 3.16 × 10⁷ = {sf(1 / 2.3e-18 / 3.16e7)} years', ['C1: T = 1/H₀ then years'], aq='T')
M('E', 1, 'Light from a galaxy is blueshifted. What does this show?', 'The galaxy is moving towards us', ['The galaxy is moving away from us', 'The galaxy is very hot', 'The galaxy is not moving'], 'Approach shortens the observed wavelength.')
N('E', 2, 'A line with laboratory wavelength 500 nm is seen at 510 nm. Calculate Δλ/λ.', 10 / 500, None,
  'Δλ/λ = (510 − 500) ÷ 500 = 0.020', ['C1: Δλ ÷ λ'], sig=2, aq='Δλ/λ')
M('E', 1, 'In Hubble\'s law, what are the units of H₀ in SI?', 's⁻¹', ['m s⁻¹', 's', 'm'], 'H₀ = v/d: (m s⁻¹) ÷ m.')
N('E', 2, 'A galaxy recedes at 2.1 × 10⁶ m s⁻¹. A line emitted at 486 nm is observed at a longer wavelength. Calculate the shift Δλ, in nm.' + take('c'), 486 * 2.1e6 / CL, 'nm',
  f'Δλ = λv/c = 486 × 2.1 × 10⁶ ÷ 3.00 × 10⁸ = {sf(486 * 2.1e6 / CL)} nm', ['C1: Δλ = λv/c'], aq='Δλ')
M('E', 1, 'What is the Big Bang theory?', 'The Universe began from an extremely hot, dense state and has been expanding ever since', ['The Universe has always been the same size', 'Stars explode and form galaxies', 'The Solar System formed from a supernova'], 'Supported by redshift and the cosmic microwave background.')
N('E', 2, 'Express a distance of 100 Mpc in metres, in units of 10²⁴ m (1 Mpc = 3.09 × 10²² m).', 100 * MPC, '10²⁴ m',
  'd = 100 × 3.09 × 10²² = 3.09 × 10²⁴ m', ['C1: × 3.09 × 10²²'], aq='d')
M('E', 1, 'Why must galaxies used to test Hubble\'s law have distances measured independently, for example with standard candles?', 'Hubble\'s law relates speed to distance, so both must be measured separately to test it', ['Speeds cannot be measured', 'Standard candles give speeds', 'Distances are found from redshift alone'], 'Redshift gives v; standard candles give d.')
N('E', 1, 'Taking H₀ = 2.3 × 10⁻¹⁸ s⁻¹, how fast is a galaxy at a distance of 5.0 × 10²⁴ m moving away from us? Give the speed in units of 10⁷ m s⁻¹.', 2.3e-18 * 5.0e24, '10⁷ m s⁻¹',
  'v = 2.3 × 10⁻¹⁸ × 5.0 × 10²⁴ = 1.15 × 10⁷ m s⁻¹', [], aq='v')
# medium
N('M', 3, 'A line of laboratory wavelength 393 nm is observed at 405 nm from a galaxy. Taking H₀ = 2.3 × 10⁻¹⁸ s⁻¹, calculate the distance of the galaxy, in units of 10²⁵ m.' + take('c'), (405 - 393) / 393 * CL / 2.3e-18, '10²⁵ m',
  f'v = 3.00 × 10⁸ × (405 − 393) ÷ 393 = {sf(12 / 393 * CL, 4)} m s⁻¹. d = {sf(12 / 393 * CL, 4)} ÷ 2.3 × 10⁻¹⁸ = {sf(12 / 393 * CL / 2.3e-18)} m', ['C1: v from redshift', 'C1: d = v/H₀'], aq='d')
N('M', 4, 'H₀ is often quoted as 70 km s⁻¹ Mpc⁻¹. Convert it to s⁻¹ (1 Mpc = 3.09 × 10²² m), in units of 10⁻¹⁸ s⁻¹.', 70e3 / MPC, '10⁻¹⁸ s⁻¹',
  f'H₀ = 70 × 10³ ÷ 3.09 × 10²² = {sf(70e3 / MPC)} s⁻¹', ['M1: km to m', 'C1: Mpc to m', 'C1: value'], aq='H₀')
M('M', 3, 'Why does 1/H₀ give an estimate of the age of the Universe?', 'If expansion has been at constant speed, every galaxy took time d/v = 1/H₀ to reach its present distance', ['H₀ is the age measured in years', 'It is the time light takes to cross a galaxy', 'It is the lifetime of the Sun'], 'd/v is the same for all galaxies.', ['C1: d/v', 'C1: constant expansion assumed'])
N('M', 3, 'A galaxy 200 Mpc away recedes at 1.4 × 10⁴ km s⁻¹. Calculate H₀ in km s⁻¹ Mpc⁻¹.', 1.4e4 / 200, 'km s⁻¹ Mpc⁻¹',
  'H₀ = v/d = 1.4 × 10⁴ ÷ 200 = 70 km s⁻¹ Mpc⁻¹', ['C1: H₀ = v/d', 'C1: value'], sig=2, aq='H₀')
N('M', 3, 'A galaxy recedes at 4.5 × 10⁶ m s⁻¹. The hydrogen line at 656 nm is redshifted. Calculate the observed wavelength in nm.' + take('c'), 656 * (1 + 4.5e6 / CL), 'nm',
  f'λ = 656 × (1 + 4.5 × 10⁶ ÷ 3.00 × 10⁸) = {sf(656 * (1 + 4.5e6 / CL), 4)} nm', ['C1: Δλ = λv/c', 'C1: add to λ'], sig=4, aq='λ')
M('M', 3, 'Which observation is the strongest evidence for the Big Bang, besides galaxy redshifts?', 'The cosmic microwave background radiation, uniform in all directions', ['The Sun\'s spectrum', 'The existence of black holes', 'The motion of the planets'], 'It is the cooled radiation from the early Universe.', ['C1: CMB', 'C1: uniform, black-body'])
N('M', 3, 'Galaxy A is 3.0 times as far away as galaxy B. Calculate (recession speed of A) ÷ (recession speed of B).', 3.0, None,
  'v ∝ d: ratio = 3.0 ÷ 1 = 3.0', ['C1: Hubble\'s law', 'C1: value'], sig=2, aq='ratio')
N('M', 4, 'A quasar\'s light shows Δλ/λ = 0.15. Assuming v = cΔλ/λ and H₀ = 2.3 × 10⁻¹⁸ s⁻¹, calculate its distance in units of 10²⁵ m.' + take('c'), 0.15 * CL / 2.3e-18, '10²⁵ m',
  f'v = 0.15 × 3.00 × 10⁸ = 4.5 × 10⁷ m s⁻¹. d = 4.5 × 10⁷ ÷ 2.3 × 10⁻¹⁸ = {sf(4.5e7 / 2.3e-18)} m', ['C1: v', 'C1: d = v/H₀', 'C1: value'], aq='d')
M('M', 3, 'The redshift of distant galaxies is not caused by them all moving away from a central point. What is the modern interpretation?', 'Space itself is expanding, stretching the light as it travels', ['The galaxies are cooling down', 'Dust reddens the light', 'Gravity slows the light'], 'Every observer sees the same pattern.', ['C1: expansion of space', 'C1: no centre'])
N('M', 3, 'A galaxy has a recession speed of 2.0 × 10⁷ m s⁻¹ and a distance of 9.0 × 10²⁴ m. Calculate H₀ from these values, in units of 10⁻¹⁸ s⁻¹.', 2.0e7 / 9.0e24, '10⁻¹⁸ s⁻¹',
  f'H₀ = v/d = 2.0 × 10⁷ ÷ 9.0 × 10²⁴ = {sf(2e7 / 9e24)} s⁻¹', ['C1: H₀ = v/d', 'C1: value'], aq='H₀')
N('M', 3, 'Taking H₀ = 70 km s⁻¹ Mpc⁻¹, calculate the recession speed of a galaxy 50 Mpc away, in km s⁻¹.', 70 * 50, 'km s⁻¹',
  'v = 70 × 50 = 3500 km s⁻¹', ['C1: v = H₀d', 'C1: units'], sig=2, aq='v')
M('M', 4, 'How would a larger value of H₀ affect the estimated age of the Universe?', 'The age would be smaller, since T ≈ 1/H₀', ['The age would be larger', 'The age would be unchanged', 'The age would be negative'], 'Faster expansion means less time to reach present distances.', ['C1: T ∝ 1/H₀', 'C1: younger', 'C1: assumption of constant rate'])
N('M', 3, 'A calcium line at 397 nm is observed at 401 nm from a galaxy. Calculate its recession speed in km s⁻¹.' + take('c'), (401 - 397) / 397 * CL / 1e3, 'km s⁻¹',
  f'v = 3.00 × 10⁸ × 4 ÷ 397 = {sf(4 / 397 * CL, 4)} m s⁻¹. In km s⁻¹: {sf(4 / 397 * CL, 4)} ÷ 10³ = {sf(4 / 397 * CL / 1e3)}', ['C1: Δλ/λ = v/c', 'C1: m to km'], aq='v')
N('M', 3, 'The age of the Universe is estimated as 1/H₀ with H₀ = 2.2 × 10⁻¹⁸ s⁻¹. Calculate the age in seconds, in units of 10¹⁷ s.', 1 / 2.2e-18, '10¹⁷ s',
  f'T = 1 ÷ 2.2 × 10⁻¹⁸ = {sf(1 / 2.2e-18)} s', ['C1: T = 1/H₀', 'C1: value'], aq='T')
M('M', 3, 'Two galaxies show redshifts Δλ/λ of 0.010 and 0.030. What does this show about their distances, according to Hubble\'s law?', 'The second is about three times as far away', ['The first is three times as far away', 'They are the same distance', 'The second is nine times as far away'], 'Δλ/λ = v/c, so v ∝ Δλ/λ; Hubble: d = v/H₀, so the distance ratio is 0.030 ÷ 0.010 = 3.', ['C1: v ∝ z', 'C1: d ∝ v'])
N('M', 3, 'A galaxy is 1.5 × 10²⁵ m away. Taking H₀ = 2.3 × 10⁻¹⁸ s⁻¹, calculate the observed wavelength of a line emitted at 500 nm.' + take('c'), 500 * (1 + 2.3e-18 * 1.5e25 / CL), 'nm',
  f'v = 2.3 × 10⁻¹⁸ × 1.5 × 10²⁵ = 3.45 × 10⁷ m s⁻¹. λ = 500 × (1 + 3.45 × 10⁷ ÷ 3.00 × 10⁸) = {sf(500 * (1 + 3.45e7 / CL))} nm', ['C1: v = H₀d', 'C1: λ(1 + v/c)'], aq='λ')
N('M', 3, 'A galaxy is 120 Mpc away. Taking H₀ = 70 km s⁻¹ Mpc⁻¹, calculate the shift Δλ of a hydrogen line emitted at 656 nm, in nm.' + take('c'), 656 * 70 * 120 / 3e5, 'nm',
  f'v = H₀d = 70 × 120 = 8400 km s⁻¹. Δλ = λv/c = 656 × 8400 ÷ 3.00 × 10⁵ = {sf(656 * 8400 / 3e5)} nm', ['C1: v = H₀d', 'C1: Δλ = λv/c'], aq='Δλ')
N('M', 3, 'The light from a galaxy has Δλ/λ = 0.042. Taking H₀ = 70 km s⁻¹ Mpc⁻¹, calculate the distance of the galaxy in Mpc.' + take('c'), 0.042 * 3e5 / 70, 'Mpc',
  f'v = 0.042 × 3.00 × 10⁵ = 1.26 × 10⁴ km s⁻¹. d = v/H₀ = 1.26 × 10⁴ ÷ 70 = {sf(0.042 * 3e5 / 70)} Mpc', ['C1: v = cΔλ/λ', 'C1: d = v/H₀'], aq='d')
N('M', 4, 'A galaxy 4.0 × 10²⁴ m away recedes at 9.2 × 10⁶ m s⁻¹. Use these values to estimate the age of the Universe, in units of 10¹⁰ years (1 year = 3.16 × 10⁷ s).', 4.0e24 / 9.2e6 / 3.16e7, '10¹⁰ years',
  f'T = d/v = 4.0 × 10²⁴ ÷ 9.2 × 10⁶ = {sf(4e24 / 9.2e6, 4)} s, which is {sf(4e24 / 9.2e6, 4)} ÷ 3.16 × 10⁷ = {sf(4e24 / 9.2e6 / 3.16e7)} years', ['M1: T = d/v = 1/H₀', 'C1: value in s', 'C1: years'], aq='T')
# hard
N('H', 6, 'Light from a galaxy contains a hydrogen line at 691 nm; the laboratory wavelength is 656 nm. (a) Calculate the recession speed. (b) Calculate the distance using H₀ = 2.3 × 10⁻¹⁸ s⁻¹. (c) Express it in Mpc (1 Mpc = 3.09 × 10²² m). Give only the answer to (c).' + take('c'), (691 - 656) / 656 * CL / 2.3e-18 / MPC, 'Mpc',
  f'(a) v = 3.00 × 10⁸ × 35 ÷ 656 = {sf(35 / 656 * CL, 4)} m s⁻¹. (b) d = {sf(35 / 656 * CL, 4)} ÷ 2.3 × 10⁻¹⁸ = {sf(35 / 656 * CL / 2.3e-18, 4)} m. (c) {sf(35 / 656 * CL / 2.3e-18, 4)} ÷ 3.09 × 10²² = {sf(35 / 656 * CL / 2.3e-18 / MPC)} Mpc',
  ['C1: v', 'C1: d = v/H₀', 'C1: value in m', 'M1: m to Mpc', 'C1: value'], aq='d')
N('H', 5, 'A type 1a supernova of luminosity 1.0 × 10³⁶ W in a galaxy gives a flux of 1.0 × 10⁻¹⁵ W m⁻². The galaxy recedes at 6.5 × 10⁶ m s⁻¹. (a) Calculate the distance. (b) Calculate H₀ from this galaxy, in units of 10⁻¹⁸ s⁻¹.', 6.5e6 / sqrt(1.0e36 / (4 * pi * 1.0e-15)), '10⁻¹⁸ s⁻¹',
  f'(a) d = √(1.0 × 10³⁶ ÷ (4π × 1.0 × 10⁻¹⁵)) = {sf(sqrt(1e36 / (4 * pi * 1e-15)), 4)} m. (b) H₀ = 6.5 × 10⁶ ÷ {sf(sqrt(1e36 / (4 * pi * 1e-15)), 4)} = {sf(6.5e6 / sqrt(1e36 / (4 * pi * 1e-15)))} s⁻¹',
  ['C1: d from standard candle', 'C1: value', 'M1: H₀ = v/d', 'C1: value'], aq='H₀')
N('H', 6, 'Taking H₀ = 70 km s⁻¹ Mpc⁻¹ (1 Mpc = 3.09 × 10²² m, 1 year = 3.16 × 10⁷ s): (a) convert H₀ to s⁻¹; (b) estimate the age of the Universe in years. Give only the answer to (b), in units of 10¹⁰ years.', 1 / (70e3 / MPC) / 3.16e7, '10¹⁰ years',
  f'(a) H₀ = 70 × 10³ ÷ 3.09 × 10²² = {sf(70e3 / MPC, 4)} s⁻¹. (b) T = 1 ÷ {sf(70e3 / MPC, 4)} = {sf(MPC / 70e3, 4)} s, which is {sf(MPC / 70e3, 4)} ÷ 3.16 × 10⁷ = {sf(MPC / 70e3 / 3.16e7)} years',
  ['C1: unit conversion', 'C1: H₀ in s⁻¹', 'M1: T = 1/H₀', 'C1: s to years', 'C1: value'], aq='T')
N('H', 5, 'Three galaxies have distances 2.0, 4.0 and 6.0 × 10²⁴ m and recession speeds 4.4, 9.0 and 13.6 × 10⁶ m s⁻¹. (a) Explain how a graph of v against d tests Hubble\'s law. (b) Use the first and last galaxies to find H₀, in units of 10⁻¹⁸ s⁻¹.', (13.6e6 - 4.4e6) / (4.0e24), '10⁻¹⁸ s⁻¹',
  f'(a) A straight line through the origin shows v ∝ d; its gradient is H₀. (b) H₀ = (13.6 × 10⁶ − 4.4 × 10⁶) ÷ (6.0 × 10²⁴ − 2.0 × 10²⁴) = {sf((13.6e6 - 4.4e6) / 4e24)} s⁻¹',
  ['B1: straight line through origin', 'M1: gradient', 'C1: substitution', 'C1: value'], aq='H₀')
N('H', 6, 'A galaxy\'s light shows a line at 518.0 nm whose laboratory wavelength is 486.1 nm. (a) Calculate Δλ/λ. (b) Calculate the recession speed in km s⁻¹. (c) Taking H₀ = 70 km s⁻¹ Mpc⁻¹, calculate the distance in Mpc. Give only the answer to (c).' + take('c'), (518.0 - 486.1) / 486.1 * CL / 1e3 / 70, 'Mpc',
  f'(a) Δλ/λ = (518.0 − 486.1) ÷ 486.1 = {sf((518 - 486.1) / 486.1, 4)}. (b) v = {sf((518 - 486.1) / 486.1, 4)} × 3.00 × 10⁵ = {sf((518 - 486.1) / 486.1 * 3e5, 4)} km s⁻¹. (c) d = {sf((518 - 486.1) / 486.1 * 3e5, 4)} ÷ 70 = {sf((518 - 486.1) / 486.1 * 3e5 / 70)} Mpc',
  ['C1: Δλ/λ', 'C1: c in km s⁻¹', 'C1: v', 'M1: d = v/H₀', 'C1: value'], aq='d')
N('H', 5, 'The cosmic microwave background peaks at a wavelength of 1.06 mm. (a) Calculate its temperature. (b) Explain why this supports the Big Bang.' + take('wien'), WIEN / 1.06e-3, 'K',
  f'(a) T = 2.90 × 10⁻³ ÷ 1.06 × 10⁻³ = {sf(WIEN / 1.06e-3)} K. (b) It is the expected black-body glow of the hot early Universe, stretched to microwaves by expansion.',
  ['C1: mm to m', 'M1: Wien', 'C1: value', 'B1: cooled remnant of hot early Universe'], aq='T')
N('H', 6, 'Galaxy X shows Δλ/λ = 0.020 and galaxy Y shows Δλ/λ = 0.050. (a) Calculate both recession speeds. (b) Taking H₀ = 2.3 × 10⁻¹⁸ s⁻¹, calculate the distance between them if they lie in the same direction from us, in units of 10²⁴ m.' + take('c'), (0.050 - 0.020) * CL / 2.3e-18, '10²⁴ m',
  f'(a) X: 0.020 × 3.00 × 10⁸ = 6.0 × 10⁶ m s⁻¹; Y: 0.050 × 3.00 × 10⁸ = 1.5 × 10⁷ m s⁻¹. (b) Δd = (1.5 × 10⁷ − 6.0 × 10⁶) ÷ 2.3 × 10⁻¹⁸ = {sf(9e6 / 2.3e-18)} m',
  ['C1: speed X', 'C1: speed Y', 'M1: d = v/H₀ for each', 'C1: difference', 'C1: value'], aq='Δd')
