# Chapter 17 Gravitational fields — 17.1 to 17.7.
GM_E = 6.67e-11 * 5.97e24
EARTH = ' Take G = 6.67 × 10⁻¹¹ N m² kg⁻², the mass of the Earth = 5.97 × 10²⁴ kg and its radius = 6.37 × 10⁶ m.'
GONLY = ' Take G = 6.67 × 10⁻¹¹ N m² kg⁻².'

# ═════════════════════════ 17.1 Gravitational fields and field lines ═════════════════════════
lesson('17.1')
m_, W_ = Q('2.5 kg'), Q('24.5 N'); g1 = W_.v / m_.v
N('E', 1, f'A {m_} mass hangs from a newton-meter, which reads {W_}. Calculate the gravitational field strength at that place.', g1, 'N kg⁻¹', f'g = F/m = 24.5 ÷ 2.5 = {sf(g1)} N kg⁻¹', [], aq='g')
g_ = Q('1.62 N kg⁻¹'); m_ = Q('85 kg'); W = g_.v * m_.v
N('E', 1, f'The gravitational field strength on the Moon\'s surface is {g_}. What is the weight of an {m_} astronaut standing there?', W, 'N', f'W = mg = 85 × 1.62 = {sf(W)} N', [], aq='W')
W_, g_ = Q('1150 N'), Q('3.71 N kg⁻¹'); m = W_.v / g_.v
N('E', 2, f'A rover weighs {W_} on the surface of Mars, where the gravitational field strength is {g_}. Calculate the mass of the rover.', m, 'kg', f'm = W/g = 1150 ÷ 3.71 = {sf(m)} kg', ['C1: W = mg rearranged'], aq='m')
M('E', 1, 'Which unit is a correct unit of gravitational field strength?', 'N kg⁻¹', ['kg N⁻¹', 'N m⁻²', 'J kg'], 'g is the force per unit mass, F/m, so its unit is N kg⁻¹ (equivalent to m s⁻²).')
M('E', 1, 'Which describes the gravitational field lines around an isolated spherical planet?', 'Radial, pointing inwards towards the centre of the planet', ['Radial, pointing outwards from the planet', 'Parallel and equally spaced', 'Circles centred on the planet'],
  'The force on a test mass is always towards the planet\'s centre, so the field lines are radial and point inwards. They get further apart with distance, showing g decreasing.')
M('E', 1, 'Close to the Earth\'s surface, over a region a few kilometres across, the gravitational field is described as uniform. What does this mean?', 'The field strength has the same size and direction everywhere in the region',
  ['The field strength is zero', 'The field lines are radial and spread out', 'The field strength doubles every kilometre'],
  'Over a small region the field lines are effectively parallel and equally spaced: g has the same magnitude (≈ 9.81 N kg⁻¹) and direction (vertically down) everywhere.')
M('E', 1, 'Why is gravitational field strength a vector quantity?', 'It is a force per unit mass, and force has direction', ['It has a unit', 'It can be measured with a newton-meter', 'It decreases with distance'],
  'g = F/m. Force is a vector and mass is a scalar, so g has a direction: the direction of the force on a mass placed in the field.')
M('E', 1, 'What do the arrows on gravitational field lines show?', 'The direction of the force on a small mass placed in the field', ['The direction a mass moves at constant speed', 'The direction of increasing field strength', 'The path an orbiting satellite follows'],
  'Field lines show the direction of the gravitational force on a test mass. Their closeness shows the strength of the field.')
g_ = Q('24.8 N kg⁻¹'); m_ = Q('0.40 kg'); F = g_.v * m_.v
N('E', 1, f'The gravitational field strength at the cloud tops of Jupiter is about {g_}. Calculate the gravitational force on a {m_} probe there.', F, 'N', f'F = mg = 0.40 × 24.8 = {sf(F)} N', [], aq='F')
W1, W2 = 9.81 * 70, 8.87 * 70
N('E', 2, 'A 70 kg astronaut weighs 687 N on Earth. On Venus she would weigh 621 N. Calculate the gravitational field strength at the surface of Venus.', 621 / 70, 'N kg⁻¹', f'g = W/m = 621 ÷ 70 = {sf(621 / 70)} N kg⁻¹', ['C1: g = W/m'], aq='g')
M('E', 1, 'A student says "an astronaut on the International Space Station is weightless because there is no gravity in space". Which correction is right?', 'Gravity at the ISS is about 90% of that on the ground; the astronaut is in free fall around the Earth',
  ['Gravity at the ISS is exactly zero', 'Gravity at the ISS is stronger than on the ground', 'The ISS shields the astronaut from gravity'],
  'At 400 km altitude g ≈ 8.7 N kg⁻¹. Both the station and the astronaut fall towards the Earth with the same acceleration, so nothing pushes on the astronaut and they feel weightless.')
M('E', 1, 'Which statement about a gravitational field is correct?', 'It is a region in which a mass experiences a force', ['It is a region in which a charge experiences a force', 'It only exists close to the surface of a planet', 'It repels masses as well as attracting them'],
  'Any mass creates a gravitational field around it; another mass in that region feels an attractive force. Gravity is never repulsive.')
M('E', 2, 'Field lines are drawn around two planets. Around planet P the lines are drawn twice as close together as around planet Q, at the same distance from each centre. What does this show?', 'The field strength near P is greater than near Q', ['P has a smaller mass than Q', 'The field near P points outwards', 'The fields have the same strength'],
  'The closer the field lines, the stronger the field. At the same distance, a stronger field means a more massive planet.', ['C1: closer lines = stronger field'])

# ── medium ──
gP = 9.81 * 0.5 * 2.0
N('M', 3, 'For a uniform spherical planet, g at the surface is proportional to its density × its radius. Planet K has half the Earth\'s density and twice the Earth\'s radius. Calculate g at the surface of K.' + take('g'), gP, 'N kg⁻¹',
  f'g = GM/R² with M = (4/3)πR³ρ gives g = (4/3)πGρR, so g ∝ ρR. g_K = 9.81 × 0.5 × 2.0 = {sf(gP)} N kg⁻¹',
  ['C1: g ∝ ρR (from g = GM/R² and M = ⁴⁄₃πR³ρ)', 'C1: factors 0.5 and 2.0'], aq='g_K', cm='using g ∝ M/R² with M unchanged.')
N('M', 3, 'A planet has 4.0 times the mass of the Earth and 2.0 times its radius. Calculate the gravitational field strength at its surface.' + take('g'), 9.81 * 4.0 / 2.0 ** 2, 'N kg⁻¹',
  f'g = GM/R² ∝ M/R². g = 9.81 × 4.0 ÷ 2.0² = {sf(9.81 * 4 / 4)} N kg⁻¹', ['C1: g ∝ M/R²', 'C1: substitution of factors'], aq='g')
N('M', 3, 'A pendulum clock is moved from the Earth to a planet where it swings with a period 1.20 times as long. The period of a pendulum is proportional to 1/√g. Calculate g on the planet.' + take('g'), 9.81 / 1.20 ** 2, 'N kg⁻¹',
  f'T ∝ 1/√g, so g ∝ 1/T². g = 9.81 ÷ 1.20² = {sf(9.81 / 1.44)} N kg⁻¹', ['C1: g ∝ 1/T²', 'C1: substitution'], aq='g')
M('M', 3, 'A uniform gravitational field is shown by field lines. Which pattern represents it?', 'Parallel, equally spaced lines with arrows all pointing the same way', ['Radial lines spreading out from a point', 'Parallel lines that get closer together downwards', 'Concentric circles'],
  'A uniform field has the same strength and direction everywhere: parallel lines (same direction) equally spaced (same strength).',
  ['C1: parallel = same direction', 'C1: equal spacing = same strength'])
M('M', 3, 'Two stars P and Q of equal mass are a distance d apart. Where is the resultant gravitational field strength due to the two stars zero?', 'At the midpoint of the line joining them', ['Nowhere: gravitational fields always add', 'At a point beyond Q, on the line PQ', 'At every point on the perpendicular bisector of PQ'],
  'At the midpoint the two fields are equal in size and opposite in direction, so they cancel. Elsewhere on the perpendicular bisector the fields have components that add towards the line PQ.',
  ['C1: fields are vectors in opposite directions between the stars', 'C1: equal masses, equal distances: midpoint'])
M('M', 4, 'At a point X, the Earth\'s gravitational field strength is 2.5 N kg⁻¹ towards the Earth and the Moon\'s is 0.40 N kg⁻¹ towards the Moon, in the opposite direction. Which is the resultant field at X?', '2.1 N kg⁻¹ towards the Earth', ['2.9 N kg⁻¹ towards the Earth', '2.1 N kg⁻¹ towards the Moon', '1.45 N kg⁻¹ towards the Earth'],
  'The fields are vectors in opposite directions. Resultant = 2.5 − 0.40 = 2.1 N kg⁻¹, in the direction of the larger one (towards the Earth).',
  ['C1: fields are vectors', 'C1: opposite directions so subtract', 'C1: direction of larger field'])
N('M', 3, 'At a point P, the gravitational field of planet A is 3.0 N kg⁻¹ due north and the field of planet B is 4.0 N kg⁻¹ due east. Calculate the magnitude of the resultant gravitational field strength at P.', 5.0, 'N kg⁻¹',
  'The fields are at right angles, so g = √(3.0² + 4.0²) = 5.0 N kg⁻¹ (at tan⁻¹(4/3) = 53° east of north)', ['C1: vector addition', 'C1: Pythagoras'], sig=2, aq='g')
m_, a_ = Q('0.060 kg'), Q('3.7 m s⁻²')
N('M', 3, f'A {m_} hammer is dropped by an astronaut on Mars and accelerates at {a_} (no atmosphere effects). Calculate (a) the gravitational field strength and (b) the gravitational force on the hammer. Give only the answer to (b).', 0.060 * 3.7, 'N',
  f'(a) In free fall the acceleration equals the field strength: g = 3.7 N kg⁻¹. (b) F = mg = 0.060 × 3.7 = {sf(0.222)} N', ['B1: g = free-fall acceleration', 'C1: F = mg'], aq='F')
M('M', 3, 'Why can gravitational field strength be given in m s⁻² as well as in N kg⁻¹?', 'Because a mass in free fall accelerates at g, and 1 N kg⁻¹ = 1 m s⁻²', ['Because gravity only acts on moving objects', 'Because N and m s⁻² are the same unit', 'Because weight is measured in kilograms'],
  'F = mg and F = ma for free fall, so a = g. 1 N = 1 kg m s⁻², so 1 N kg⁻¹ = 1 m s⁻².', ['C1: free-fall acceleration = g', 'C1: unit equivalence'])
m_ = Q('5.0 kg'); g_ = Q('9.79 N kg⁻¹'); g2 = Q('9.83 N kg⁻¹')
N('M', 3, f'A {m_} mass is weighed at the Equator, where g = {g_}, and at the North Pole, where g = {g2}. Calculate the difference in its weight.', 5.0 * (9.83 - 9.79), 'N',
  f'W = mg. Difference = m Δg = 5.0 × (9.83 − 9.79) = {sf(0.2, 2)} N', ['C1: W = mg at each place', 'C1: difference'], sig=2, aq='ΔW')
M('M', 3, 'A spherical planet has field lines drawn on a diagram. A student draws the lines at twice the distance from the centre four times further apart in area. What does this represent?', 'g falls to one quarter when the distance from the centre doubles', ['g halves when the distance doubles', 'g is the same at all distances', 'g doubles when the distance doubles'],
  'The same number of radial lines passes through a sphere of area 4πr². Doubling r gives 4 times the area, so the line density, and g, falls to one quarter: g ∝ 1/r².', ['C1: line density ∝ 1/r²', 'C1: g quartered'])
N('M', 4, 'An astronaut drops a feather and a hammer together on the Moon (g = 1.62 N kg⁻¹) from a height of 1.5 m. Calculate the time they take to reach the ground and explain why they land together.', sqrt(2 * 1.5 / 1.62), 's',
  f'There is no air resistance, so both accelerate at g. s = ½gt², t = √(2s/g) = √(2 × 1.5 ÷ 1.62) = {sf(sqrt(3 / 1.62))} s. The acceleration does not depend on mass, so they land together.',
  ['B1: acceleration = g, independent of mass', 'C1: s = ½gt²', 'C1: rearranged for t'], aq='t')
N('M', 3, 'A planet\'s radius is 0.53 times the Earth\'s and its surface field strength is 3.7 N kg⁻¹. By what factor is its mass smaller than the Earth\'s?' + take('g'), 1 / (3.7 / 9.81 * 0.53 ** 2), None,
  f'M = gR²/G, so M_planet/M_Earth = (3.7 ÷ 9.81) × 0.53² = {sf(3.7 / 9.81 * 0.53 ** 2)}. The planet is smaller by a factor of 1 ÷ {sf(3.7 / 9.81 * 0.53 ** 2, 4)} = {sf(1 / (3.7 / 9.81 * 0.53 ** 2))}',
  ['C1: M ∝ gR²', 'C1: ratio of g and square of radius ratio'], aq='factor')
M('M', 3, 'The field strength at the Earth\'s surface is 9.81 N kg⁻¹. Which change would NOT change the field strength at the surface?', 'Doubling the mass of a person standing there', ['Doubling the Earth\'s mass at the same radius', 'Halving the Earth\'s radius at the same mass', 'Moving the person to the top of a very high mountain'],
  'g is a property of the field (GM/r²), not of the test mass. Changing the Earth\'s mass or radius, or the distance from the centre, all change g.', ['C1: g = GM/r²', 'C1: independent of test mass'])
N('M', 4, 'A space probe hovers at a point where its weight is 52 N. At the Earth\'s surface the same probe weighs 470 N. How many Earth radii from the Earth\'s centre is the probe?', sqrt(470 / 52), None,
  f'W ∝ 1/r². r/R = √(470 ÷ 52) = {sf(sqrt(470 / 52))} Earth radii', ['C1: W ∝ g ∝ 1/r²', 'C1: ratio of weights', 'C1: square root'], aq='r/R')
M('M', 3, 'A test mass is moved from the surface of a planet to a point one planet-radius above the surface. What happens to the gravitational force on it?', 'It falls to one quarter', ['It halves', 'It falls to one ninth', 'It stays the same'],
  'One radius above the surface is a distance 2R from the centre. F ∝ 1/r², so F falls by a factor of 2² = 4.', ['C1: distance from centre = 2R', 'C1: inverse square'], cm='taking the distance as R instead of 2R and answering "it halves".')
N('M', 3, 'Near the surface of a planet, a 2.0 kg ball takes 1.10 s to fall from rest through 3.0 m in a vacuum chamber. Calculate the gravitational field strength there.', 2 * 3.0 / 1.10 ** 2, 'N kg⁻¹',
  f's = ½gt², so g = 2s/t² = 2 × 3.0 ÷ 1.10² = {sf(6 / 1.21)} N kg⁻¹', ['C1: s = ½gt²', 'C1: rearranged for g'], aq='g')

# ── hard ──
N('H', 5, 'Planet X has radius 3.4 × 10⁶ m. A probe of mass 120 kg on its surface weighs 445 N. (a) Calculate g at the surface. (b) Calculate the mass of planet X. (c) Calculate its mean density. Give only the answer to (b).' + GONLY, (445 / 120) * (3.4e6) ** 2 / 6.67e-11, 'kg',
  f'(a) g = W/m = 445 ÷ 120 = {sf(445 / 120)} N kg⁻¹. (b) g = GM/R², M = gR²/G = {sf(445 / 120)} × (3.4 × 10⁶)² ÷ 6.67 × 10⁻¹¹ = {sf((445 / 120) * 3.4e6 ** 2 / 6.67e-11)} kg. (c) ρ = M/(⁴⁄₃πR³) = {sf(((445 / 120) * 3.4e6 ** 2 / 6.67e-11) / (4 / 3 * pi * 3.4e6 ** 3))} kg m⁻³',
  ['C1: g = W/m', 'A1: g', 'C1: M = gR²/G', 'A1: M', 'B1: density with V = ⁴⁄₃πR³'], aq='M')
gE = GM_E / (6.37e6 + 2.0e7) ** 2
N('H', 5, 'A GPS satellite orbits at 2.0 × 10⁷ m above the Earth\'s surface. (a) Calculate its distance from the Earth\'s centre. (b) Calculate the gravitational field strength there. (c) Explain why the field lines around the Earth would be drawn much further apart at this distance than near the surface. Give only the answer to (b).' + EARTH, gE, 'N kg⁻¹',
  f'(a) r = 6.37 × 10⁶ + 2.0 × 10⁷ = {sf(2.637e7)} m. (b) g = GM/r² = 6.67 × 10⁻¹¹ × 5.97 × 10²⁴ ÷ (2.637 × 10⁷)² = {sf(gE)} N kg⁻¹. (c) The field is much weaker (g ∝ 1/r²): the same number of lines spreads over a much larger sphere, so they are further apart.',
  ['C1: r = R + h', 'C1: g = GM/r²', 'A1: g', 'B1: weaker field', 'B1: line spacing shows strength'], aq='g')
d = 3.84e8; x = d / (1 + sqrt(7.35e22 / 5.97e24))
N('H', 6, 'A spacecraft travels from the Earth (mass 5.97 × 10²⁴ kg) to the Moon (mass 7.35 × 10²² kg). The centres are 3.84 × 10⁸ m apart. (a) Explain why there is a point between them where the resultant gravitational field is zero. (b) Show that at that point (distance x from the Earth\'s centre) x/(d − x) = √(M_E/M_M). (c) Calculate x. Give only the answer to (c).', x, 'm',
  f'(a) Between them the Earth\'s field points towards the Earth and the Moon\'s towards the Moon; somewhere they are equal in size and cancel. (b) GM_E/x² = GM_M/(d − x)², so x²/(d − x)² = M_E/M_M and x/(d − x) = √(M_E/M_M). (c) √(5.97 × 10²⁴ ÷ 7.35 × 10²²) = {sf(sqrt(5.97e24 / 7.35e22))}, so x = 3.84 × 10⁸ ÷ (1 + 1 ÷ {sf(sqrt(5.97e24 / 7.35e22), 4)}) = {sf(x)} m',
  ['B1: opposite directions between them', 'M1: GM_E/x² = GM_M/(d − x)²', 'M1: square root of both sides', 'C1: ratio value', 'C1: rearranged for x', 'A1: x'], aq='x')
gs = [(1.0, 9.8), (2.0, 2.45), (3.0, 1.09), (4.0, 0.61)]
N('H', 6, 'A table gives the gravitational field strength g at distances r from the centre of a planet, in units of the planet\'s radius R: r = 1.0R, g = 9.8 N kg⁻¹; r = 2.0R, g = 2.45 N kg⁻¹; r = 3.0R, g = 1.09 N kg⁻¹; r = 4.0R, g = 0.61 N kg⁻¹. (a) Show that the data fit g ∝ 1/r². (b) Describe the graph of g against 1/r². (c) Predict g at r = 5.0R. Give only the answer to (c).', 9.8 / 25, 'N kg⁻¹',
  f'(a) g × r² is constant: 9.8 × 1.0² = 9.8, 2.45 × 2.0² = 9.8, 1.09 × 3.0² = 9.81, 0.61 × 4.0² = 9.76. (b) A straight line through the origin with gradient 9.8 N kg⁻¹ (in units of R²). (c) g = 9.8 ÷ 5.0² = {sf(9.8 / 25)} N kg⁻¹',
  ['M1: gr² calculated for at least three points', 'A1: constant, so inverse square', 'B1: straight line through origin', 'C1: g = 9.8/25', 'A1: g'], aq='g')
N('H', 5, 'A student models the Earth as a uniform sphere and argues that g inside it, at a distance r from the centre, is proportional to r. (a) Using the model, calculate g at a depth of 1000 km. (b) Calculate g at a height of 1000 km above the surface. (c) State which is larger and explain. Give only the answer to (b).' + take('g') + ' The Earth\'s radius is 6.37 × 10⁶ m.', 9.81 * (6.37e6 / 7.37e6) ** 2, 'N kg⁻¹',
  f'(a) g ∝ r inside: g = 9.81 × 5.37 × 10⁶ ÷ 6.37 × 10⁶ = {sf(9.81 * 5.37 / 6.37)} N kg⁻¹. (b) Outside g ∝ 1/r²: g = 9.81 × (6.37 × 10⁶ ÷ 7.37 × 10⁶)² = {sf(9.81 * (6.37 / 7.37) ** 2)} N kg⁻¹. (c) Inside it is larger here: g falls linearly inside but as 1/r² outside, which falls faster at first.',
  ['C1: inside: g ∝ r', 'A1: g at depth', 'C1: outside: g ∝ 1/r²', 'A1: g at height', 'B1: comparison'], aq='g')
N('H', 6, 'Two identical stars, each of mass 2.0 × 10³⁰ kg, are 4.0 × 10¹¹ m apart. Point P is on the perpendicular bisector of the line joining them, 1.5 × 10¹¹ m from the midpoint. (a) Calculate the distance from P to each star. (b) Calculate the field strength at P due to one star. (c) Calculate the resultant field strength at P and state its direction. Give only the size of the resultant in (c).' + GONLY, 2 * 6.67e-11 * 2.0e30 / (2.5e11) ** 2 * (1.5 / 2.5), 'N kg⁻¹',
  f'(a) √((2.0 × 10¹¹)² + (1.5 × 10¹¹)²) = 2.5 × 10¹¹ m. (b) g = GM/r² = 6.67 × 10⁻¹¹ × 2.0 × 10³⁰ ÷ (2.5 × 10¹¹)² = {sf(6.67e-11 * 2e30 / 6.25e22)} N kg⁻¹. (c) The components along the line joining the stars cancel; the components towards the midpoint add: 2 × {sf(6.67e-11 * 2e30 / 6.25e22, 4)} × 1.5 ÷ 2.5 = {sf(2 * 6.67e-11 * 2e30 / 6.25e22 * 0.6)} N kg⁻¹, towards the midpoint.',
  ['C1: Pythagoras: 2.5 × 10¹¹ m', 'C1: g = GM/r²', 'A1: g from one star', 'M1: parallel components cancel', 'M1: perpendicular components add (× cos θ)', 'A1: resultant and direction'], aq='g')
N('H', 5, 'A small, dense asteroid has mass 4.5 × 10¹⁵ kg and radius 1.2 km. (a) Calculate the gravitational field strength at its surface. (b) An astronaut of mass 90 kg (with suit) stands on it. Calculate the astronaut\'s weight. (c) Suggest why the astronaut must move very carefully. Give only the answer to (a).' + GONLY, 6.67e-11 * 4.5e15 / 1200 ** 2, 'N kg⁻¹',
  f'(a) g = GM/R² = 6.67 × 10⁻¹¹ × 4.5 × 10¹⁵ ÷ 1200² = {sf(6.67e-11 * 4.5e15 / 1.44e6)} N kg⁻¹. (b) W = mg = 90 × {sf(6.67e-11 * 4.5e15 / 1.44e6)} = {sf(90 * 6.67e-11 * 4.5e15 / 1.44e6)} N. (c) The weight is tiny, so even a small jump could reach a speed large enough to leave the asteroid (or take a very long time to come down).',
  ['C1: g = GM/R² with R in m', 'A1: g', 'C1: W = mg', 'A1: W', 'B1: small weight / easy to escape'], aq='g')
r1 = 6.37e6 + 8.85e3
N('H', 5, 'A climber stands on the summit of Mount Everest, 8.85 km above sea level. (a) Calculate g at the summit. (b) Calculate the percentage decrease from the sea-level value of 9.82 N kg⁻¹ given by the same model. (c) Explain why a climber does not notice this change. Give only the answer to (b).' + EARTH, (1 - (6.37e6 / r1) ** 2) * 100, '%',
  f'(a) g = GM/r² = 6.67 × 10⁻¹¹ × 5.97 × 10²⁴ ÷ (6.37885 × 10⁶)² = {sf(GM_E / r1 ** 2)} N kg⁻¹. (b) g ∝ 1/r², so the fraction remaining is (6.37 ÷ 6.37885)² = {sf((6.37e6 / r1) ** 2, 5)}. Percentage decrease = (1 − {sf((6.37e6 / r1) ** 2, 5)}) × 100 = {sf((1 - (6.37e6 / r1) ** 2) * 100)} %. (c) 0.3 % is far too small to feel; weight changes by about 2 N for a 70 kg person.',
  ['C1: r = R + h', 'A1: g at summit', 'C1: ratio (R/r)²', 'A1: percentage decrease', 'B1: change too small to notice'], aq='decrease')
N('H', 6, 'In a thought experiment, a tunnel is drilled straight through a uniform Earth, and a ball dropped into it. Inside a uniform sphere, g ∝ r. (a) Show that the ball\'s acceleration is a = −(g₀/R)x, where x is its distance from the centre and g₀ = 9.81 N kg⁻¹. (b) State what kind of motion this is. (c) Calculate the time for the ball to reach the far side. Earth\'s radius = 6.37 × 10⁶ m. Give only the answer to (c).', pi * sqrt(6.37e6 / 9.81), 's',
  f'(a) At distance x from the centre, g = g₀x/R towards the centre, so a = −(g₀/R)x. (b) Acceleration ∝ −displacement: simple harmonic motion. (c) ω = √(g₀/R), T = 2π√(R/g₀). The far side is half a period away: t = π × √(6.37 × 10⁶ ÷ 9.81) = {sf(pi * sqrt(6.37e6 / 9.81))} s (about 42 minutes).',
  ['M1: g = g₀x/R', 'A1: a = −(g₀/R)x', 'B1: s.h.m.', 'C1: T = 2π√(R/g₀)', 'C1: half a period', 'A1: t'], aq='t')
N('H', 5, 'The table compares two moons. Moon A: mass 1.5 × 10²³ kg, radius 2.6 × 10⁶ m. Moon B: mass 4.8 × 10²² kg, radius 1.6 × 10⁶ m. (a) Calculate g at the surface of each moon. (b) Deduce which moon a lander would need a stronger braking rocket for, explaining your choice. Give only g for moon B.' + GONLY, 6.67e-11 * 4.8e22 / 1.6e6 ** 2, 'N kg⁻¹',
  f'(a) g_A = 6.67 × 10⁻¹¹ × 1.5 × 10²³ ÷ (2.6 × 10⁶)² = {sf(6.67e-11 * 1.5e23 / 2.6e6 ** 2)} N kg⁻¹. g_B = 6.67 × 10⁻¹¹ × 4.8 × 10²² ÷ (1.6 × 10⁶)² = {sf(6.67e-11 * 4.8e22 / 1.6e6 ** 2)} N kg⁻¹. (b) Moon A, because its surface field (and the lander\'s weight to be balanced) is larger.',
  ['C1: g = GM/R²', 'A1: g_A', 'A1: g_B', 'B1: compares', 'B1: braking force must exceed weight'], aq='g_B')

# ═════════════════════════ 17.2 Field strength of a point mass ═════════════════════════
lesson('17.2')
F = 6.67e-11 * 1200 * 1500 / 3.0 ** 2
N('E', 2, 'Two cars of mass 1200 kg and 1500 kg are parked with their centres of mass 3.0 m apart. Treating them as point masses, calculate the gravitational force between them.' + GONLY, F, 'N',
  f'F = Gm₁m₂/r² = 6.67 × 10⁻¹¹ × 1200 × 1500 ÷ 3.0² = {sf(F)} N', ['C1: F = Gm₁m₂/r²'], aq='F')
N('E', 2, 'Calculate the gravitational force between the Earth (5.97 × 10²⁴ kg) and the Sun (1.99 × 10³⁰ kg), whose centres are 1.50 × 10¹¹ m apart.' + GONLY, 6.67e-11 * 5.97e24 * 1.99e30 / 1.5e11 ** 2, 'N',
  f'F = GMm/r² = 6.67 × 10⁻¹¹ × 1.99 × 10³⁰ × 5.97 × 10²⁴ ÷ (1.50 × 10¹¹)² = {sf(6.67e-11 * 5.97e24 * 1.99e30 / 1.5e11 ** 2)} N', ['C1: Newton\'s law of gravitation'], aq='F')
g_ = 6.67e-11 * 1.90e27 / 7.0e7 ** 2
N('E', 2, 'A probe descending into Jupiter\'s atmosphere reaches the cloud tops, 7.0 × 10⁷ m from the planet\'s centre. Jupiter\'s mass is 1.90 × 10²⁷ kg. What gravitational field strength does the probe measure there?' + GONLY, g_, 'N kg⁻¹', f'g = GM/R² = 6.67 × 10⁻¹¹ × 1.90 × 10²⁷ ÷ (7.0 × 10⁷)² = {sf(g_, 2)} N kg⁻¹', ['C1: g = GM/R²'], sig=2, aq='g')
M('E', 1, 'Newton\'s law of gravitation states that the force between two point masses is…', 'proportional to the product of the masses and inversely proportional to the square of their separation',
  ['proportional to the sum of the masses and inversely proportional to their separation', 'proportional to the product of the masses and to the square of their separation', 'independent of the masses and inversely proportional to the separation'],
  'F = Gm₁m₂/r². Doubling either mass doubles F; doubling r reduces F to a quarter.')
M('E', 1, 'The distance between two point masses is tripled. What happens to the gravitational force between them?', 'It becomes one ninth as large', ['It becomes one third as large', 'It becomes three times as large', 'It becomes one sixth as large'],
  'F ∝ 1/r². Tripling r divides F by 3² = 9.')
M('E', 1, 'What is the value of the gravitational constant G, with its unit?', '6.67 × 10⁻¹¹ N m² kg⁻²', ['6.67 × 10⁻¹¹ N kg⁻¹', '9.81 N m² kg⁻²', '6.67 × 10¹¹ N m² kg⁻²'],
  'From F = Gm₁m₂/r², G = Fr²/(m₁m₂), so its unit is N m² kg⁻². Its value is 6.67 × 10⁻¹¹ N m² kg⁻².')
M('E', 1, 'Why can a planet be treated as a point mass when calculating the gravitational force on a distant satellite?', 'Its mass is distributed spherically symmetrically, so it acts as if concentrated at its centre', ['It is very small compared with the satellite', 'Gravity only acts at the centre of a planet', 'The satellite\'s mass is negligible'],
  'For a spherically symmetric body, the field outside it is the same as if all the mass were at the centre.')
r_ = 6.37e6 + 3.5e5; g_ = GM_E / r_ ** 2
N('E', 2, 'Calculate the gravitational field strength 350 km above the Earth\'s surface.' + EARTH, g_, 'N kg⁻¹', f'r = 6.37 × 10⁶ + 3.5 × 10⁵ = 6.72 × 10⁶ m. g = GM/r² = 6.67 × 10⁻¹¹ × 5.97 × 10²⁴ ÷ (6.72 × 10⁶)² = {sf(g_)} N kg⁻¹', ['C1: r = R + h'], aq='g')
N('E', 2, 'The Sun has mass 1.99 × 10³⁰ kg. Calculate its gravitational field strength at the Earth\'s orbit, 1.50 × 10¹¹ m away.' + GONLY, 6.67e-11 * 1.99e30 / 1.5e11 ** 2, 'N kg⁻¹',
  f'g = GM/r² = 6.67 × 10⁻¹¹ × 1.99 × 10³⁰ ÷ (1.50 × 10¹¹)² = {sf(6.67e-11 * 1.99e30 / 2.25e22)} N kg⁻¹', ['C1: g = GM/r²'], aq='g')
M('E', 1, 'The gravitational field strength at the surface of a planet is g. What is it at a height above the surface equal to the planet\'s radius?', 'g/4', ['g/2', 'g', 'g/9'],
  'At that height the distance from the centre is 2R, and g ∝ 1/r², so it is g/2² = g/4.')
N('E', 2, 'A 1.0 kg mass and a 4.0 kg mass are 0.20 m apart. Calculate the gravitational force between them.' + GONLY, 6.67e-11 * 4.0 / 0.04, 'N', f'F = Gm₁m₂/r² = 6.67 × 10⁻¹¹ × 1.0 × 4.0 ÷ 0.20² = {sf(6.67e-11 * 4 / 0.04)} N', ['C1: F = Gm₁m₂/r²'], aq='F')
M('E', 1, 'Two masses attract each other with a force F. Both masses are doubled and their separation is doubled. What is the new force?', 'F', ['2F', '4F', 'F/2'], 'F ∝ m₁m₂/r²: the product of the masses rises by 4 and r² rises by 4, so the force is unchanged.')
N('E', 2, 'Engineers designing a Mercury lander need the planet\'s surface gravity. Mercury is a sphere of radius 2.44 × 10⁶ m and mass 3.30 × 10²³ kg. Find g at its surface.' + GONLY, 6.67e-11 * 3.3e23 / 2.44e6 ** 2, 'N kg⁻¹', f'g = GM/R² = 6.67 × 10⁻¹¹ × 3.30 × 10²³ ÷ (2.44 × 10⁶)² = {sf(6.67e-11 * 3.3e23 / 2.44e6 ** 2)} N kg⁻¹', ['C1: g = GM/R²'], aq='g')
M('E', 1, 'Which equation gives the gravitational field strength g at a distance r from the centre of a planet of mass M?', 'g = GM/r²', ['g = GM/r', 'g = GMr²', 'g = −GM/r'], 'The force on a mass m is GMm/r², so the force per unit mass is GM/r². (−GM/r is the potential, not the field strength.)')
N('E', 2, 'Find the gravitational force exerted by a 0.50 kg lead sphere on a 0.020 kg ball whose centre is 6.0 cm from the sphere\'s centre.' + GONLY, 6.67e-11 * 0.5 * 0.02 / 0.06 ** 2, 'N', f'F = Gm₁m₂/r² = 6.67 × 10⁻¹¹ × 0.50 × 0.020 ÷ 0.060² = {sf(6.67e-11 * 0.01 / 0.0036)} N', ['C1: r in metres'], aq='F')
M('E', 1, 'The Earth pulls the Moon with a force F. What is the size of the force the Moon exerts on the Earth?', 'F, because forces between bodies are an equal and opposite pair', ['Less than F, because the Moon is smaller', 'More than F, because the Earth is bigger', 'Zero, because the Moon orbits the Earth'],
  'By Newton\'s third law the gravitational forces on the two bodies are equal in size and opposite in direction, whatever their masses. Gm₁m₂/r² is the same for both.')

# ── medium ──
g_r = 9.81 * (6.37e6 / (2 * 6.37e6 + 0)) ** 2
N('M', 3, 'A satellite orbits at a height of 6.37 × 10⁶ m above the Earth\'s surface (one Earth radius). The surface field strength is 9.81 N kg⁻¹. Without using G, calculate g at the satellite.', 9.81 / 4, 'N kg⁻¹',
  f'Distance from centre = 2R. g ∝ 1/r², so g = 9.81 × (R/2R)² = 9.81 ÷ 4 = {sf(9.81 / 4)} N kg⁻¹', ['C1: r = 2R', 'C1: inverse-square ratio'], aq='g', cm='using the height (R) instead of the distance from the centre (2R).')
h = sqrt(GM_E / 4.9) - 6.37e6
N('M', 4, 'At what height above the Earth\'s surface is the gravitational field strength equal to 1.0 N kg⁻¹?' + EARTH, sqrt(GM_E / 1.0) - 6.37e6, 'm',
  f'r = √(GM/g) = √(6.67 × 10⁻¹¹ × 5.97 × 10²⁴ ÷ 1.0) = {sf(sqrt(GM_E))} m. Height = r − R = {sf(sqrt(GM_E), 4)} − 6.37 × 10⁶ = {sf(sqrt(GM_E) - 6.37e6)} m',
  ['C1: g = GM/r²', 'C1: r = √(GM/g)', 'C1: subtract R'], aq='h')
N('M', 3, 'The Earth\'s surface field strength is 9.81 N kg⁻¹. Use this and the Earth\'s radius (6.37 × 10⁶ m) to calculate the mass of the Earth.' + GONLY, 9.81 * 6.37e6 ** 2 / 6.67e-11, 'kg',
  f'g = GM/R², so M = gR²/G = 9.81 × (6.37 × 10⁶)² ÷ 6.67 × 10⁻¹¹ = {sf(9.81 * 6.37e6 ** 2 / 6.67e-11)} kg', ['C1: g = GM/R²', 'C1: M = gR²/G'], aq='M')
M('M', 3, 'Planet P has twice the mass of planet Q and three times its radius. What is the ratio (surface field strength of P)/(surface field strength of Q)?', '2/9', ['2/3', '6', '9/2'], 'g = GM/R² ∝ M/R²: ratio = 2 ÷ 3² = 2/9.', ['C1: g ∝ M/R²', 'C1: ratio'])
F1 = 6.67e-11 * 7.35e22 * 5.97e24 / 3.84e8 ** 2
N('M', 3, 'Calculate the acceleration of the Moon towards the Earth due to the Earth\'s gravity. The Earth–Moon distance is 3.84 × 10⁸ m.' + EARTH, GM_E / 3.84e8 ** 2, 'm s⁻²',
  f'a = g at the Moon = GM/r² = 6.67 × 10⁻¹¹ × 5.97 × 10²⁴ ÷ (3.84 × 10⁸)² = {sf(GM_E / 3.84e8 ** 2)} m s⁻². (The Moon\'s mass is not needed.)', ['B1: acceleration = field strength', 'C1: g = GM/r²'], aq='a')
N('M', 3, 'Two lead spheres of mass 150 kg each have their centres 0.40 m apart. A student says the gravitational force between them is "too small to measure". Calculate the force, and compare it with the weight of a 1 mg grain of sand. Give the force.' + GONLY + take('g'), 6.67e-11 * 150 * 150 / 0.16, 'N',
  f'F = Gm₁m₂/r² = 6.67 × 10⁻¹¹ × 150 × 150 ÷ 0.40² = {sf(6.67e-11 * 22500 / 0.16)} N. The grain weighs 1 × 10⁻⁶ × 9.81 = 9.8 × 10⁻⁶ N — about the same as this force, so it is tiny but measurable with a sensitive torsion balance.',
  ['C1: F = Gm₁m₂/r²', 'C1: substitution', 'B1: comparison'], aq='F')
M('M', 3, 'A spacecraft travels away from the Earth. At distance r from the centre the field strength is g. At what distance is the field strength g/16?', '4r', ['16r', '2r', '256r'], 'g ∝ 1/r². For g to fall by 16, r must increase by √16 = 4.', ['C1: g ∝ 1/r²', 'C1: √16 = 4'])
N('M', 4, 'A neutron star has a mass of 2.8 × 10³⁰ kg and a radius of 12 km. Calculate the gravitational field strength at its surface, and express it as a multiple of g on Earth (9.81 N kg⁻¹). Give the multiple.' + GONLY, 6.67e-11 * 2.8e30 / 12000 ** 2 / 9.81, None,
  f'g = GM/R² = 6.67 × 10⁻¹¹ × 2.8 × 10³⁰ ÷ 12000² = {sf(6.67e-11 * 2.8e30 / 1.44e8)} N kg⁻¹. Multiple = {sf(6.67e-11 * 2.8e30 / 1.44e8)} ÷ 9.81 = {sf(6.67e-11 * 2.8e30 / 1.44e8 / 9.81)}',
  ['C1: R in metres', 'C1: g = GM/R²', 'C1: ÷ 9.81'], aq='multiple')
N('M', 3, 'A 1500 kg satellite is in orbit 2.0 × 10⁷ m from the Earth\'s centre. Calculate the gravitational force on it.' + EARTH, 6.67e-11 * 5.97e24 * 1500 / 2.0e7 ** 2, 'N',
  f'F = GMm/r² = 6.67 × 10⁻¹¹ × 5.97 × 10²⁴ × 1500 ÷ (2.0 × 10⁷)² = {sf(GM_E * 1500 / 4e14)} N', ['C1: F = GMm/r²', 'C1: r is distance from centre'], aq='F')
M('M', 3, 'The Moon\'s mass is 1/81 of the Earth\'s and its radius is 0.27 times the Earth\'s. Approximately what fraction of the Earth\'s surface field strength is the Moon\'s?', '1/6', ['1/81', '1/22', '1/3'],
  'g ∝ M/R²: (1/81) ÷ 0.27² = (1/81) ÷ 0.0729 = 0.17 ≈ 1/6.', ['C1: g ∝ M/R²', 'C1: calculation'])
N('M', 4, 'A comet passes the Sun at a distance of 8.0 × 10⁹ m. Its mass is 2.2 × 10¹⁴ kg. Calculate (a) the Sun\'s field strength there and (b) the force on the comet. Sun\'s mass = 1.99 × 10³⁰ kg. Give only the answer to (b).' + GONLY, 6.67e-11 * 1.99e30 * 2.2e14 / 8.0e9 ** 2, 'N',
  f'(a) g = GM/r² = 6.67 × 10⁻¹¹ × 1.99 × 10³⁰ ÷ (8.0 × 10⁹)² = {sf(6.67e-11 * 1.99e30 / 6.4e19)} N kg⁻¹. (b) F = mg = 2.2 × 10¹⁴ × {sf(6.67e-11 * 1.99e30 / 6.4e19)} = {sf(2.2e14 * 6.67e-11 * 1.99e30 / 6.4e19)} N',
  ['C1: g = GM/r²', 'C1: F = mg', 'C1: substitution'], aq='F')
N('M', 3, 'At the surface of a planet of radius R, g = 12.0 N kg⁻¹. Calculate g at a height of 0.50R above the surface.', 12.0 / 1.5 ** 2, 'N kg⁻¹',
  f'r = 1.5R. g = 12.0 × (1/1.5)² = {sf(12 / 2.25)} N kg⁻¹', ['C1: r = 1.5R', 'C1: inverse square'], aq='g')
M('M', 3, 'A student measures the weight of a mass at the Earth\'s surface and then on a mountain 4 km high. Which best describes the result?', 'The weight on the mountain is about 0.1 % smaller', ['The weight on the mountain is about 50 % smaller', 'The weight is exactly the same', 'The weight on the mountain is larger because it is nearer the Sun'],
  'r increases from 6370 km to 6374 km: g falls by a factor (6370/6374)² ≈ 0.9987, a decrease of about 0.13 %.', ['C1: r from centre changes by 4 km out of 6370 km', 'C1: inverse-square fraction'])
N('M', 4, 'The gravitational force between two identical spheres is 2.5 × 10⁻⁸ N when their centres are 0.30 m apart. Calculate the mass of each sphere.' + GONLY, sqrt(2.5e-8 * 0.09 / 6.67e-11), 'kg',
  f'F = Gm²/r², so m = r√(F/G) = √(2.5 × 10⁻⁸ × 0.30² ÷ 6.67 × 10⁻¹¹) = {sf(sqrt(2.5e-8 * 0.09 / 6.67e-11))} kg', ['C1: F = Gm²/r²', 'C1: rearranged', 'C1: square root'], aq='m')
N('M', 3, 'A probe measures g = 0.53 N kg⁻¹ at a distance of 5.0 × 10⁷ m from the centre of an unknown moon. Calculate the moon\'s mass.' + GONLY, 0.53 * 5.0e7 ** 2 / 6.67e-11, 'kg',
  f'M = gr²/G = 0.53 × (5.0 × 10⁷)² ÷ 6.67 × 10⁻¹¹ = {sf(0.53 * 2.5e15 / 6.67e-11)} kg', ['C1: g = GM/r²', 'C1: rearranged for M'], aq='M')
M('M', 3, 'Why do we usually ignore the gravitational force between two people standing next to each other?', 'It is about 10⁻⁷ N, far smaller than every other force on them', ['It is zero because people are not spherical', 'It is cancelled by the Earth\'s gravity', 'Gravity only acts between very large masses'],
  'For two 70 kg people 1 m apart, F = 6.67 × 10⁻¹¹ × 70 × 70 ÷ 1² ≈ 3 × 10⁻⁷ N, utterly negligible compared with their weights (≈ 700 N) or friction.', ['C1: estimate of the force', 'C1: comparison with other forces'])

# ── hard ──
d = 3.84e8; xE = d / (1 + 1 / 9)
N('H', 6, 'The Moon\'s mass is 1/81 of the Earth\'s. Their centres are 3.84 × 10⁸ m apart. (a) Explain why a spacecraft travelling between them feels no resultant gravitational force at one point. (b) Show that this point is 9/10 of the way from the Earth to the Moon. (c) Calculate its distance from the Earth\'s centre. Give only the answer to (c).', 0.9 * d, 'm',
  f'(a) The two fields point in opposite directions between the bodies; at one point they are equal in size. (b) GM_E/x² = G(M_E/81)/(d − x)² gives (d − x)/x = 1/9, so x = 9d/10. (c) x = 0.9 × 3.84 × 10⁸ = {sf(0.9 * d)} m',
  ['B1: opposite fields', 'M1: GM_E/x² = GM_M/(d − x)²', 'M1: square root: x/(d − x) = 9', 'A1: x = 9d/10', 'C1: substitution', 'A1: x'], aq='x')
gE_moon = GM_E / 3.84e8 ** 2; gS = 6.67e-11 * 1.99e30 / 1.5e11 ** 2
N('H', 6, 'The Moon (mass 7.35 × 10²² kg) is pulled by both the Earth and the Sun. Earth–Moon distance 3.84 × 10⁸ m; Sun–Moon distance 1.50 × 10¹¹ m; Sun\'s mass 1.99 × 10³⁰ kg. (a) Calculate the Earth\'s pull on the Moon. (b) Calculate the Sun\'s pull on the Moon. (c) Calculate the ratio (Sun\'s pull)/(Earth\'s pull) and comment. Give only the ratio in (c).' + EARTH, gS / gE_moon, None,
  f'(a) F = GM_Em/r² = 6.67 × 10⁻¹¹ × 5.97 × 10²⁴ × 7.35 × 10²² ÷ (3.84 × 10⁸)² = {sf(gE_moon * 7.35e22)} N. (b) F = 6.67 × 10⁻¹¹ × 1.99 × 10³⁰ × 7.35 × 10²² ÷ (1.50 × 10¹¹)² = {sf(gS * 7.35e22)} N. (c) ratio = {sf(gS * 7.35e22, 4)} ÷ {sf(gE_moon * 7.35e22, 4)} = {sf(gS / gE_moon)}: the Sun pulls the Moon about twice as hard as the Earth does, but it pulls the Earth too, so the Moon still orbits the Earth.',
  ['C1: F = GMm/r²', 'A1: Earth\'s pull', 'A1: Sun\'s pull', 'C1: ratio', 'B1: comment'], aq='ratio')
N('H', 5, 'A planet of radius 4.0 × 10⁶ m has a surface field strength of 6.0 N kg⁻¹. (a) Calculate its mass. (b) Calculate the height above its surface at which g = 1.5 N kg⁻¹. (c) Explain why the answer to (b) does not depend on the value of G. Give only the answer to (b).' + GONLY, 4.0e6, 'm',
  f'(a) M = gR²/G = 6.0 × (4.0 × 10⁶)² ÷ 6.67 × 10⁻¹¹ = {sf(6.0 * 1.6e13 / 6.67e-11)} kg. (b) g falls by 4, so r doubles: r = 2 × 4.0 × 10⁶ = 8.0 × 10⁶ m, height = 8.0 × 10⁶ − 4.0 × 10⁶ = 4.0 × 10⁶ m. (c) Only the ratio g/g₀ = (R/r)² is used; G cancels.',
  ['C1: M = gR²/G', 'A1: M', 'M1: g ∝ 1/r², factor 4 → r doubles', 'A1: height', 'B1: ratio method, G cancels'], sig=2, aq='h')
data = [(7.0e6, 8.13), (1.0e7, 3.98), (2.0e7, 0.995), (4.0e7, 0.249)]
N('H', 6, 'A probe records g at different distances r from the centre of the Earth: r = 7.0 × 10⁶ m, g = 8.13 N kg⁻¹; r = 1.0 × 10⁷ m, g = 3.98 N kg⁻¹; r = 2.0 × 10⁷ m, g = 0.995 N kg⁻¹; r = 4.0 × 10⁷ m, g = 0.249 N kg⁻¹. (a) Suggest a graph to plot to test g = GM/r². (b) Use the data at r = 2.0 × 10⁷ m to determine GM. (c) Hence calculate the mass of the Earth. Give only the answer to (c).' + GONLY, 0.995 * 2.0e7 ** 2 / 6.67e-11, 'kg',
  f'(a) g against 1/r²: a straight line through the origin of gradient GM. (b) GM = gr² = 0.995 × (2.0 × 10⁷)² = {sf(0.995 * 4e14)} N m² kg⁻¹. (c) M = GM/G = {sf(0.995 * 4e14)} ÷ 6.67 × 10⁻¹¹ = {sf(0.995 * 4e14 / 6.67e-11)} kg',
  ['B1: g against 1/r²', 'B1: straight line through origin', 'C1: GM = gr²', 'A1: GM', 'C1: M = GM/G', 'A1: M'], aq='M')
N('H', 5, 'Two stars orbit their common centre. Star A has mass 3.0 × 10³⁰ kg and star B has mass 1.0 × 10³⁰ kg; their centres are 2.0 × 10¹¹ m apart. (a) Calculate the gravitational force between them. (b) State and explain how the force on A compares with the force on B. (c) Calculate the acceleration of star B. Give only the answer to (c).' + GONLY, 6.67e-11 * 3.0e30 / 2.0e11 ** 2, 'm s⁻²',
  f'(a) F = Gm₁m₂/r² = 6.67 × 10⁻¹¹ × 3.0 × 10³⁰ × 1.0 × 10³⁰ ÷ (2.0 × 10¹¹)² = {sf(6.67e-11 * 3e60 / 4e22)} N. (b) Equal in size and opposite in direction (Newton\'s third law). (c) a_B = F/m_B = {sf(6.67e-11 * 3e60 / 4e22)} ÷ 1.0 × 10³⁰ = {sf(6.67e-11 * 3e30 / 4e22)} m s⁻²',
  ['C1: Newton\'s law', 'A1: F', 'B1: equal and opposite', 'C1: a = F/m', 'A1: a'], aq='a')
N('H', 6, 'A spherical asteroid has a mean density of 2500 kg m⁻³ and radius 5.0 km. (a) Calculate its mass. (b) Calculate g at its surface. (c) A rock is dropped from 2.0 m above the surface. Calculate the time it takes to land, assuming g is constant. Give only the answer to (c).' + GONLY, sqrt(2 * 2.0 / (6.67e-11 * 2500 * 4 / 3 * pi * 5000 ** 3 / 5000 ** 2)), 's',
  f'(a) M = ρ × ⁴⁄₃πR³ = 2500 × ⁴⁄₃ × π × 5000³ = {sf(2500 * 4 / 3 * pi * 5000 ** 3)} kg. (b) g = GM/R² = 6.67 × 10⁻¹¹ × {sf(2500 * 4 / 3 * pi * 5000 ** 3)} ÷ 5000² = {sf(6.67e-11 * 2500 * 4 / 3 * pi * 5000)} N kg⁻¹. (c) t = √(2s/g) = √(2 × 2.0 ÷ {sf(6.67e-11 * 2500 * 4 / 3 * pi * 5000)}) = {sf(sqrt(4 / (6.67e-11 * 2500 * 4 / 3 * pi * 5000)))} s',
  ['C1: M = ρV', 'A1: M', 'C1: g = GM/R²', 'A1: g', 'C1: s = ½gt²', 'A1: t'], aq='t')
N('H', 5, 'In a Cavendish-type experiment, a 0.73 kg lead ball is attracted by a 158 kg lead sphere whose centre is 0.23 m away. (a) Calculate the gravitational force on the small ball. (b) Calculate the acceleration this would give the small ball if it were free to move. (c) Explain why such experiments must be shielded from air currents. Give only the answer to (a).' + GONLY, 6.67e-11 * 0.73 * 158 / 0.23 ** 2, 'N',
  f'(a) F = Gm₁m₂/r² = 6.67 × 10⁻¹¹ × 0.73 × 158 ÷ 0.23² = {sf(6.67e-11 * 0.73 * 158 / 0.0529)} N. (b) a = F/m = {sf(6.67e-11 * 0.73 * 158 / 0.0529)} ÷ 0.73 = {sf(6.67e-11 * 158 / 0.0529)} m s⁻². (c) The gravitational force is about 10⁻⁷ N: tiny air movements exert comparable forces and would swamp it.',
  ['C1: F = Gm₁m₂/r²', 'A1: F', 'C1: a = F/m', 'A1: a', 'B1: force tiny compared with disturbances'], aq='F')
N('H', 5, 'A satellite in orbit 8.0 × 10⁶ m from the Earth\'s centre measures g = 6.22 N kg⁻¹. At the Earth\'s surface, g = 9.81 N kg⁻¹. (a) Use only these values to show that the Earth\'s radius is about 6.4 × 10⁶ m. (b) Calculate g at 1.6 × 10⁷ m from the Earth\'s centre. Give only the answer to (b).', 6.22 * (8.0e6 / 1.6e7) ** 2, 'N kg⁻¹',
  f'(a) g ∝ 1/r²: R = 8.0 × 10⁶ × √(6.22 ÷ 9.81) = {sf(8e6 * sqrt(6.22 / 9.81))} m ≈ 6.4 × 10⁶ m. (b) Doubling r quarters g: g = 6.22 ÷ 4 = {sf(6.22 / 4)} N kg⁻¹',
  ['M1: inverse-square ratio', 'M1: R = r√(g/g₀)', 'A1: R ≈ 6.4 × 10⁶ m', 'C1: r doubles', 'A1: g'], aq='g')
F_moon = 6.67e-11 * 7.35e22 * 1.0 / (3.84e8 - 6.37e6) ** 2
N('H', 6, 'Tides are caused because the Moon pulls the near side of the Earth harder than the far side. Moon\'s mass = 7.35 × 10²² kg, Earth–Moon centre distance = 3.84 × 10⁸ m, Earth\'s radius = 6.37 × 10⁶ m. (a) Calculate the Moon\'s field strength at the point on the Earth nearest the Moon. (b) Calculate it at the point furthest from the Moon. (c) Calculate the difference. Give only the answer to (c).' + GONLY,
  6.67e-11 * 7.35e22 * (1 / (3.84e8 - 6.37e6) ** 2 - 1 / (3.84e8 + 6.37e6) ** 2), 'N kg⁻¹',
  f'(a) g = GM/r² = 6.67 × 10⁻¹¹ × 7.35 × 10²² ÷ (3.7763 × 10⁸)² = {sf(6.67e-11 * 7.35e22 / (3.84e8 - 6.37e6) ** 2, 4)} N kg⁻¹. (b) g = 6.67 × 10⁻¹¹ × 7.35 × 10²² ÷ (3.9037 × 10⁸)² = {sf(6.67e-11 * 7.35e22 / (3.84e8 + 6.37e6) ** 2, 4)} N kg⁻¹. (c) difference = {sf(6.67e-11 * 7.35e22 / (3.84e8 - 6.37e6) ** 2, 4)} − {sf(6.67e-11 * 7.35e22 / (3.84e8 + 6.37e6) ** 2, 4)} = {sf(6.67e-11 * 7.35e22 * (1 / (3.84e8 - 6.37e6) ** 2 - 1 / (3.84e8 + 6.37e6) ** 2))} N kg⁻¹',
  ['C1: near-side distance d − R', 'A1: g near', 'C1: far-side distance d + R', 'A1: g far', 'B1: difference (about 7%)', 'A1: difference'], sig=2, aq='Δg')

# ═════════════════════════ 17.3 Energy in a gravitational field ═════════════════════════
lesson('17.3')
m_, h_ = Q('2.0 kg'), Q('3.5 m'); dE = m_.v * 9.81 * h_.v
N('E', 1, f'A {m_} bag of flour is lifted onto a shelf {h_} higher. Calculate its gain in gravitational potential energy.' + take('g'), dE, 'J', f'ΔEp = mgΔh = 2.0 × 9.81 × 3.5 = {sf(dE)} J', [], aq='ΔEp')
N('E', 2, 'A 65 kg hiker climbs a hill 420 m high. Calculate the gravitational potential energy she gains.' + take('g'), 65 * 9.81 * 420, 'J', f'ΔEp = mgΔh = 65 × 9.81 × 420 = {sf(65 * 9.81 * 420)} J', ['C1: ΔEp = mgΔh'], aq='ΔEp')
M('E', 1, 'Why can ΔEp = mgΔh be used for a crane lifting a load but not for a rocket leaving the Earth?', 'g is almost constant over a few metres but falls significantly over thousands of kilometres', ['The rocket is moving too fast', 'mgΔh only applies to objects at rest', 'Rockets are not affected by gravity'],
  'mgΔh assumes a uniform field. Over large distances g = GM/r² decreases, so the energy change must be found from −GMm/r.')
M('E', 1, 'Where is the zero of gravitational potential energy taken when using Ep = −GMm/r?', 'At an infinite distance from the mass', ['At the surface of the Earth', 'At the centre of the Earth', 'At the height of a geostationary orbit'],
  'Ep = −GMm/r tends to zero as r → ∞, so zero is defined at infinity; everywhere nearer it is negative.')
N('E', 2, 'Calculate the gravitational potential energy of a 1.0 kg mass at the Earth\'s surface, taking zero at infinity.' + EARTH, -GM_E / 6.37e6, 'J',
  f'Ep = −GMm/r = −6.67 × 10⁻¹¹ × 5.97 × 10²⁴ × 1.0 ÷ 6.37 × 10⁶ = {sf(-GM_E / 6.37e6)} J', ['C1: Ep = −GMm/r'], sign=True, aq='Ep')
M('E', 1, 'A satellite moves from a low orbit to a higher orbit. What happens to its gravitational potential energy?', 'It increases (becomes less negative)', ['It decreases (becomes more negative)', 'It stays the same', 'It becomes positive'],
  'Ep = −GMm/r. Larger r makes Ep less negative, i.e. larger. Work must be done against gravity to raise the satellite.')
M('E', 1, 'Which quantity is the work done per unit mass in bringing a small mass from infinity to a point in a gravitational field?', 'The gravitational potential at the point', ['The gravitational field strength at the point', 'The gravitational potential energy of the mass', 'The escape speed from the point'],
  'Gravitational potential φ is defined as the work done per unit mass in bringing a small test mass from infinity to the point. It is negative because the field does the work.')
N('E', 2, 'A 0.15 kg ball is thrown up and rises 18 m. Calculate the minimum speed it was thrown with (ignore air resistance).' + take('g'), sqrt(2 * 9.81 * 18), 'm s⁻¹', f'½mv² = mgh, so v = √(2gh) = √(2 × 9.81 × 18) = {sf(sqrt(2 * 9.81 * 18))} m s⁻¹', ['C1: ½mv² = mgh'], aq='v')
N('E', 2, 'A 1200 kg lift rises 35 m at constant speed. How much work does the motor do against gravity?' + take('g'), 1200 * 9.81 * 35, 'J', f'W = mgΔh = 1200 × 9.81 × 35 = {sf(1200 * 9.81 * 35)} J', ['C1: work = gain in Ep'], aq='W')
M('E', 1, 'Gravitational potential energy near a planet is negative. Which statement explains this?', 'Work must be done on a mass to move it out to infinity, where Ep is zero', ['Gravity is a repulsive force', 'The mass has negative mass', 'Kinetic energy is always positive so Ep must be negative'],
  'With zero at infinity, a mass near the planet has less energy than at infinity: energy must be supplied to remove it, so its Ep is below zero.')
N('E', 2, 'How much gravitational potential energy does a 5.0 kg mass lose when it falls 12 m on the Moon, where g = 1.62 N kg⁻¹?', 5.0 * 1.62 * 12, 'J', f'ΔEp = mgΔh = 5.0 × 1.62 × 12 = {sf(5 * 1.62 * 12)} J', ['C1: ΔEp = mgΔh with Moon g'], aq='ΔEp')
M('E', 1, 'An object falls freely towards the Earth from a great height. Which describes the energy changes?', 'Ep becomes more negative and Ek increases by the same amount', ['Ep becomes less negative and Ek increases', 'Ep and Ek both increase', 'Ep stays constant and Ek increases'],
  'Gravity does positive work on the falling object: its Ep decreases (more negative) and its Ek increases by the same amount, so the total energy is constant.')
N('E', 2, 'A 420 kg space probe is at a distance of 2.0 × 10⁷ m from the Earth\'s centre. Calculate its gravitational potential energy.' + EARTH, -GM_E * 420 / 2.0e7, 'J',
  f'Ep = −GMm/r = −6.67 × 10⁻¹¹ × 5.97 × 10²⁴ × 420 ÷ 2.0 × 10⁷ = {sf(-GM_E * 420 / 2e7)} J', ['C1: Ep = −GMm/r'], sign=True, aq='Ep')
M('E', 1, 'Which equation gives the escape speed from the surface of a planet of mass M and radius R?', 'v = √(2GM/R)', ['v = √(GM/R)', 'v = 2GM/R', 'v = √(GM/R²)'],
  'To escape, ½mv² ≥ GMm/R, so v = √(2GM/R). (√(GM/R) is the speed of a low circular orbit.)')
N('E', 2, 'A 2.5 kg rock rolls down a cliff 60 m high on the Earth. Ignoring friction, calculate its speed at the bottom.' + take('g'), sqrt(2 * 9.81 * 60), 'm s⁻¹', f'v = √(2gh) = √(2 × 9.81 × 60) = {sf(sqrt(2 * 9.81 * 60))} m s⁻¹', ['C1: Ep lost = Ek gained'], aq='v')
M('E', 1, 'Does the escape speed from the Earth depend on the mass of the object being launched?', 'No: both ½mv² and GMm/R are proportional to m, so m cancels', ['Yes: heavier objects need a higher speed', 'Yes: lighter objects need a higher speed', 'No: escape speed depends only on the launch angle'],
  '½mv² = GMm/R gives v = √(2GM/R), independent of m.')
N('E', 2, 'A 60 kg diver steps off a 10 m platform. Calculate the kinetic energy she has gained just before reaching the water.' + take('g'), 60 * 9.81 * 10, 'J', f'Ek = Ep lost = mgh = 60 × 9.81 × 10 = {sf(5886)} J', ['C1: energy conservation'], aq='Ek')

# ── medium ──
r1, r2 = 6.37e6, 6.37e6 + 4.0e5; dE = GM_E * 1000 * (1 / r1 - 1 / r2)
N('M', 3, 'Calculate the work needed to lift a 1000 kg satellite from the Earth\'s surface to a height of 400 km, using Ep = −GMm/r.' + EARTH, dE, 'J',
  f'ΔEp = GMm(1/r₁ − 1/r₂) = 6.67 × 10⁻¹¹ × 5.97 × 10²⁴ × 1000 × (1 ÷ 6.37 × 10⁶ − 1 ÷ 6.77 × 10⁶) = {sf(dE)} J',
  ['C1: ΔEp = −GMm/r₂ − (−GMm/r₁)', 'C1: r₂ = R + h', 'C1: substitution'], aq='ΔEp')
N('M', 3, 'For the same lift (1000 kg, surface to 400 km) a student uses mgh with g = 9.81 N kg⁻¹. Calculate the percentage by which this overestimates the work, given that the true value is 3.69 × 10⁹ J.' + take('g'), (1000 * 9.81 * 4.0e5 / 3.69e9 - 1) * 100, '%',
  f'mgh = 1000 × 9.81 × 4.0 × 10⁵ = {sf(1000 * 9.81 * 4e5)} J. Overestimate = ({sf(3.924e9, 4)} ÷ 3.69 × 10⁹ − 1) × 100 = {sf((3.924e9 / 3.69e9 - 1) * 100, 2)} %: g is smaller higher up, so mgh with surface g is too large.',
  ['C1: mgh calculated', 'C1: percentage difference', 'B1: g decreases with height'], sig=2, aq='overestimate')
ve = sqrt(2 * GM_E / 6.37e6)
N('M', 3, 'Calculate the escape speed from the surface of the Earth.' + EARTH, ve, 'm s⁻¹', f'v = √(2GM/R) = √(2 × 6.67 × 10⁻¹¹ × 5.97 × 10²⁴ ÷ 6.37 × 10⁶) = {sf(ve)} m s⁻¹', ['C1: ½mv² = GMm/R', 'C1: v = √(2GM/R)'], aq='v_esc')
vm = sqrt(2 * 6.67e-11 * 7.35e22 / 1.74e6)
N('M', 3, 'The Moon has mass 7.35 × 10²² kg and radius 1.74 × 10⁶ m. Calculate the escape speed from its surface, and suggest why the Moon has no atmosphere. Give the speed.' + GONLY, vm, 'm s⁻¹',
  f'v = √(2GM/R) = √(2 × 6.67 × 10⁻¹¹ × 7.35 × 10²² ÷ 1.74 × 10⁶) = {sf(vm)} m s⁻¹. Gas molecules in sunlight move fast enough that a fraction reach this speed and escape over time.',
  ['C1: v = √(2GM/R)', 'C1: substitution', 'B1: molecules escape'], aq='v_esc')
M('M', 3, 'A satellite is moved from an orbit of radius r to one of radius 2r around the same planet. What happens to its gravitational potential energy?', 'It doubles in value but halves in size, i.e. from −X to −X/2', ['It doubles, from −X to −2X', 'It quarters', 'It does not change'],
  'Ep = −GMm/r ∝ −1/r. Doubling r halves the magnitude: −X becomes −X/2, which is an increase.', ['C1: Ep ∝ −1/r', 'C1: becomes less negative'])
N('M', 4, 'A 250 kg piece of space debris falls from rest at 7.0 × 10⁶ m from the Earth\'s centre to 6.5 × 10⁶ m (ignore air resistance). Calculate the kinetic energy it gains.' + EARTH, GM_E * 250 * (1 / 6.5e6 - 1 / 7.0e6), 'J',
  f'ΔEk = −ΔEp = GMm(1/r₂ − 1/r₁) = 6.67 × 10⁻¹¹ × 5.97 × 10²⁴ × 250 × (1 ÷ 6.5 × 10⁶ − 1 ÷ 7.0 × 10⁶) = {sf(GM_E * 250 * (1 / 6.5e6 - 1 / 7e6))} J',
  ['C1: Ek gained = Ep lost', 'C1: GMm(1/r₂ − 1/r₁)', 'C1: substitution'], aq='ΔEk')
M('M', 3, 'A rocket engine fails just as the rocket reaches the escape speed from the Earth, moving vertically. What happens next (ignore air resistance)?', 'It keeps moving away, slowing down, and its speed approaches zero as it approaches infinity', ['It falls back to the Earth', 'It moves away at constant speed', 'It goes into a circular orbit'],
  'At exactly escape speed the total energy is zero. As r → ∞, Ep → 0, so Ek → 0: it slows but never quite stops and never returns.', ['C1: total energy zero', 'C1: speed tends to zero at infinity'])
N('M', 4, 'Mars has mass 6.42 × 10²³ kg and radius 3.39 × 10⁶ m. A probe is launched from its surface at 3.0 km s⁻¹. Calculate the escape speed from Mars and decide whether the probe escapes. Give the escape speed.' + GONLY, sqrt(2 * 6.67e-11 * 6.42e23 / 3.39e6), 'm s⁻¹',
  f'v = √(2GM/R) = √(2 × 6.67 × 10⁻¹¹ × 6.42 × 10²³ ÷ 3.39 × 10⁶) = {sf(sqrt(2 * 6.67e-11 * 6.42e23 / 3.39e6))} m s⁻¹. 3.0 km s⁻¹ is less than this, so the probe does not escape (it falls back or, if launched sideways, orbits).',
  ['C1: v = √(2GM/R)', 'A1: escape speed', 'B1: conclusion'], aq='v_esc')
N('M', 3, 'A ball is thrown vertically upwards from the surface of a small moon with g = 0.15 N kg⁻¹ at 2.0 m s⁻¹. Assuming g is constant, how high does it rise?', 2.0 ** 2 / (2 * 0.15), 'm',
  f'½mv² = mgh, so h = v²/(2g) = 2.0² ÷ (2 × 0.15) = {sf(4 / 0.3)} m', ['C1: ½mv² = mgh', 'C1: rearrangement'], aq='h')
M('M', 3, 'Why does a satellite in a stable circular orbit not need its engines to stay in orbit?', 'Gravity is perpendicular to its velocity, so it does no work and the kinetic energy is constant', ['There is no gravity in orbit', 'Its engines run continuously at a low level', 'Its potential energy is zero in orbit'],
  'In a circular orbit the gravitational force is always at 90° to the motion. It changes the direction but does no work, so the speed and energies stay constant. (Drag from the thin atmosphere is ignored.)',
  ['C1: force perpendicular to velocity', 'C1: no work, so no energy change'])
N('M', 4, 'A 3.0 kg mass is moved from 1.0 × 10⁷ m to 2.0 × 10⁷ m from the centre of the Earth. Calculate the change in its gravitational potential energy, giving the sign.' + EARTH, GM_E * 3.0 * (1 / 1.0e7 - 1 / 2.0e7), 'J',
  f'ΔEp = (−GMm/r₂) − (−GMm/r₁) = GMm(1/r₁ − 1/r₂) = 6.67 × 10⁻¹¹ × 5.97 × 10²⁴ × 3.0 × (1 ÷ 1.0 × 10⁷ − 1 ÷ 2.0 × 10⁷) = {sf(GM_E * 3 * 5e-8)} J (an increase)',
  ['C1: Ep at each radius', 'C1: subtraction in the correct order', 'C1: substitution'], sign=True, aq='ΔEp')
M('M', 4, 'A small mass m falls from rest at a great distance (infinity) to the surface of a planet of mass M and radius R. What is its speed on arrival (no atmosphere)?', '√(2GM/R)', ['√(GM/R)', '2GM/R', '√(2GMR)'],
  'Energy conservation: 0 = ½mv² − GMm/R, so v = √(2GM/R): the escape speed in reverse.', ['C1: total energy zero at infinity', 'C1: ½mv² = GMm/R', 'C1: rearranged'])
N('M', 3, 'A 600 kg satellite in a circular orbit of radius 7.2 × 10⁶ m has kinetic energy GMm/2r. Calculate its kinetic energy.' + EARTH, GM_E * 600 / (2 * 7.2e6), 'J',
  f'Ek = GMm/2r = 6.67 × 10⁻¹¹ × 5.97 × 10²⁴ × 600 ÷ (2 × 7.2 × 10⁶) = {sf(GM_E * 600 / 1.44e7)} J', ['C1: Ek = GMm/2r', 'C1: substitution'], aq='Ek')
N('M', 4, 'A meteorite is falling towards the Earth. At 1.0 × 10⁸ m from the centre it moves at 2.0 km s⁻¹. Ignoring the atmosphere, calculate its speed when it is 1.0 × 10⁷ m from the centre.' + EARTH, sqrt(2000 ** 2 + 2 * GM_E * (1 / 1.0e7 - 1 / 1.0e8)), 'm s⁻¹',
  f'½v₂² = ½v₁² + GM(1/r₂ − 1/r₁): v₂ = √(2000² + 2 × 3.98 × 10¹⁴ × (1 ÷ 1.0 × 10⁷ − 1 ÷ 1.0 × 10⁸)) = {sf(sqrt(2000 ** 2 + 2 * 3.98e14 * 9e-8))} m s⁻¹',
  ['C1: energy conservation per unit mass', 'C1: Ep change', 'C1: rearranged for v₂'], aq='v')
M('M', 3, 'Two satellites of mass m and 2m orbit at the same radius. Which statement is correct?', 'The heavier satellite has twice the gravitational potential energy (twice as negative) but the same speed', ['Both have the same potential energy', 'The heavier one moves twice as fast', 'The heavier one has half the potential energy'],
  'Ep = −GMm/r ∝ m, so the 2m satellite\'s Ep is twice as negative. The orbital speed √(GM/r) is independent of the satellite\'s mass.', ['C1: Ep ∝ m', 'C1: speed independent of m'])
N('M', 3, 'A rock of mass 4.0 kg rests on the surface of an asteroid of mass 8.0 × 10¹⁶ kg and radius 2.0 km. Calculate the minimum energy needed to remove the rock to infinity.' + GONLY, 6.67e-11 * 8.0e16 * 4.0 / 2000, 'J',
  f'E = GMm/R = 6.67 × 10⁻¹¹ × 8.0 × 10¹⁶ × 4.0 ÷ 2000 = {sf(6.67e-11 * 8e16 * 4 / 2000)} J', ['C1: energy needed = −Ep at surface', 'C1: GMm/R with R in m'], aq='E')

# ── hard ──
m = 1500; r1, r2 = 7.0e6, 4.2e7
dEp = GM_E * m * (1 / r1 - 1 / r2); dEk = GM_E * m / 2 * (1 / r2 - 1 / r1)
N('H', 6, 'A 1500 kg satellite is moved from a circular orbit of radius 7.0 × 10⁶ m to one of radius 4.2 × 10⁷ m. For a circular orbit Ek = GMm/2r. (a) Calculate the change in gravitational potential energy. (b) Calculate the change in kinetic energy. (c) Calculate the energy the rocket motors must supply (ignore losses). Give only the answer to (c).' + EARTH, dEp + dEk, 'J',
  f'(a) ΔEp = GMm(1/r₁ − 1/r₂) = 3.98 × 10¹⁴ × 1500 × (1 ÷ 7.0 × 10⁶ − 1 ÷ 4.2 × 10⁷) = {sf(dEp)} J. (b) ΔEk = (GMm/2)(1/r₂ − 1/r₁) = −½ΔEp = {sf(dEk)} J. (c) energy supplied = ΔEp + ΔEk = {sf(dEp, 4)} + ({sf(dEk, 4)}) = {sf(dEp + dEk)} J',
  ['C1: ΔEp formula', 'A1: ΔEp', 'C1: ΔEk = −½ΔEp', 'A1: ΔEk', 'C1: total = ΔEp + ΔEk', 'A1: energy'], aq='E')
Rj, Mj = 7.0e7, 1.90e27
N('H', 5, 'Jupiter has mass 1.90 × 10²⁷ kg and radius 7.0 × 10⁷ m. (a) Calculate the escape speed from Jupiter. (b) Compare it with the escape speed from the Earth (11.2 km s⁻¹). (c) Use energy ideas to explain why Jupiter has kept hydrogen in its atmosphere but the Earth has not. Give only the answer to (a).' + GONLY, sqrt(2 * 6.67e-11 * Mj / Rj), 'm s⁻¹',
  f'(a) v = √(2GM/R) = √(2 × 6.67 × 10⁻¹¹ × 1.90 × 10²⁷ ÷ 7.0 × 10⁷) = {sf(sqrt(2 * 6.67e-11 * Mj / Rj))} m s⁻¹. (b) About {sf(sqrt(2 * 6.67e-11 * Mj / Rj) / 11200, 2)} times the Earth\'s. (c) Light hydrogen molecules move fastest at a given temperature; on Earth a significant fraction exceeds 11 km s⁻¹ over geological time, but almost none reach Jupiter\'s much higher escape speed (and Jupiter is colder).',
  ['C1: v = √(2GM/R)', 'A1: v', 'B1: comparison', 'B1: molecular speeds vs escape speed', 'B1: lighter molecules faster'], aq='v_esc')
N('H', 6, 'A projectile is fired vertically upwards from the Earth\'s surface at 5.0 km s⁻¹. Ignore air resistance and the Earth\'s rotation. (a) Explain why ½mv² = mgh would give the wrong maximum height. (b) Use Ep = −GMm/r to find the distance from the Earth\'s centre at which it stops. (c) Calculate the maximum height above the surface. Give only the answer to (c).' + EARTH,
  1 / (1 / 6.37e6 - 5000 ** 2 / (2 * GM_E)) - 6.37e6, 'm',
  f'(a) The height is a large fraction of R, so g is not constant. (b) ½v² − GM/R = −GM/r: 1/r = 1/R − v²/(2GM) = 1 ÷ 6.37 × 10⁶ − 5000² ÷ (2 × 3.98 × 10¹⁴) = {sf(1 / 6.37e6 - 25e6 / 7.96e14, 4)} m⁻¹, r = {sf(1 / (1 / 6.37e6 - 25e6 / (2 * GM_E)))} m. (c) h = r − R = {sf(1 / (1 / 6.37e6 - 25e6 / (2 * GM_E)), 4)} − 6.37 × 10⁶ = {sf(1 / (1 / 6.37e6 - 25e6 / (2 * GM_E)) - 6.37e6)} m',
  ['B1: g not uniform over this distance', 'C1: energy conservation with −GMm/r', 'M1: rearranged for 1/r', 'A1: r', 'C1: h = r − R', 'A1: h'], aq='h')
N('H', 5, 'A black hole is an object whose escape speed is at least the speed of light. (a) Show that the radius R of a black hole of mass M is 2GM/c². (b) Calculate R for a black hole with the mass of the Sun, 1.99 × 10³⁰ kg. (c) Comment on whether a Newtonian argument is really valid here. Give only the answer to (b).' + take('G', 'c'), 2 * 6.67e-11 * 1.99e30 / 3.0e8 ** 2, 'm',
  f'(a) √(2GM/R) = c gives R = 2GM/c². (b) R = 2 × 6.67 × 10⁻¹¹ × 1.99 × 10³⁰ ÷ (3.00 × 10⁸)² = {sf(2 * 6.67e-11 * 1.99e30 / 9e16)} m (about 3 km). (c) It is not: at speeds near c relativity is needed, although the result happens to match general relativity.',
  ['M1: escape speed = c', 'A1: R = 2GM/c²', 'C1: substitution', 'A1: R', 'B1: relativity needed'], aq='R')
v0 = 7.66e3
N('H', 6, 'An astronaut on the International Space Station (orbit radius 6.77 × 10⁶ m, speed 7.66 km s⁻¹) throws a 0.50 kg tool. (a) Calculate the tool\'s kinetic energy in the orbit. (b) Calculate its gravitational potential energy. (c) Calculate its total energy and explain the sign. Give only the total energy in (c).' + EARTH, 0.5 * 0.5 * v0 ** 2 - GM_E * 0.5 / 6.77e6, 'J',
  f'(a) Ek = ½mv² = 0.5 × 0.50 × 7660² = {sf(0.25 * v0 ** 2)} J. (b) Ep = −GMm/r = −3.98 × 10¹⁴ × 0.50 ÷ 6.77 × 10⁶ = {sf(-GM_E * 0.5 / 6.77e6)} J. (c) E = {sf(0.25 * v0 ** 2, 4)} + ({sf(-GM_E * 0.5 / 6.77e6, 4)}) = {sf(0.25 * v0 ** 2 - GM_E * 0.5 / 6.77e6)} J. It is negative: the tool is bound to the Earth; energy would be needed to escape.',
  ['C1: Ek = ½mv²', 'A1: Ek', 'C1: Ep = −GMm/r', 'A1: Ep', 'C1: total', 'B1: negative means bound'], sign=True, aq='E')
N('H', 5, 'A 2000 kg spacecraft coasts from a distance of 4.0 × 10⁸ m from the Earth\'s centre towards the Earth, starting at 1.0 km s⁻¹. Ignore the Moon. (a) Calculate its gravitational potential energy at the start. (b) Calculate the speed it would have at 1.0 × 10⁸ m from the Earth\'s centre. Give only the answer to (b).' + EARTH, sqrt(1000 ** 2 + 2 * GM_E * (1 / 1e8 - 1 / 4e8)), 'm s⁻¹',
  f'(a) Ep = −GMm/r = −3.98 × 10¹⁴ × 2000 ÷ 4.0 × 10⁸ = {sf(-GM_E * 2000 / 4e8)} J. (b) ½v² = ½(1000)² + GM(1/r₂ − 1/r₁): v = √(1000² + 2 × 3.98 × 10¹⁴ × (1 ÷ 1.0 × 10⁸ − 1 ÷ 4.0 × 10⁸)) = {sf(sqrt(1e6 + 2 * 3.98e14 * 7.5e-9))} m s⁻¹',
  ['C1: Ep = −GMm/r', 'A1: Ep', 'C1: energy conservation', 'C1: Ep difference', 'A1: v'], aq='v')
N('H', 6, 'A graph of the gravitational potential energy Ep of a 1.0 kg mass against distance r from the centre of a planet is a curve. Readings: r = 1.0 × 10⁷ m, Ep = −4.0 × 10⁷ J; r = 2.0 × 10⁷ m, Ep = −2.0 × 10⁷ J. (a) Show that the readings fit Ep ∝ −1/r. (b) Determine GM for the planet. (c) The gradient of the Ep–r graph equals the force on the mass. Calculate the force at r = 2.0 × 10⁷ m. Give only the answer to (c).', 4.0e14 / 2.0e7 ** 2, 'N',
  f'(a) Ep × r = −4.0 × 10¹⁴ J m for both, so Ep ∝ −1/r. (b) Ep = −GMm/r with m = 1.0 kg: GM = 4.0 × 10¹⁴ N m² kg⁻¹. (c) F = dEp/dr = GMm/r² = 4.0 × 10¹⁴ ÷ (2.0 × 10⁷)² = {sf(4e14 / 4e14)} N (towards the planet)',
  ['M1: Ep × r constant', 'A1: Ep ∝ −1/r', 'C1: GM from Ep r', 'A1: GM', 'M1: F = GMm/r² from gradient', 'A1: F'], sig=2, aq='F')

# ═════════════════════════ 17.4 Gravitational potential ═════════════════════════
lesson('17.4')
phi = -GM_E / 6.37e6
N('E', 2, 'Calculate the gravitational potential at the surface of the Earth.' + EARTH, phi, 'J kg⁻¹', f'φ = −GM/r = −6.67 × 10⁻¹¹ × 5.97 × 10²⁴ ÷ 6.37 × 10⁶ = {sf(phi)} J kg⁻¹', ['C1: φ = −GM/r'], sign=True, aq='φ')
N('E', 2, 'Calculate the gravitational potential at the surface of the Moon (mass 7.35 × 10²² kg, radius 1.74 × 10⁶ m).' + GONLY, -6.67e-11 * 7.35e22 / 1.74e6, 'J kg⁻¹', f'φ = −GM/R = −6.67 × 10⁻¹¹ × 7.35 × 10²² ÷ 1.74 × 10⁶ = {sf(-6.67e-11 * 7.35e22 / 1.74e6)} J kg⁻¹', ['C1: φ = −GM/R'], sign=True, aq='φ')
M('E', 1, 'Define gravitational potential at a point.', 'The work done per unit mass in bringing a small test mass from infinity to that point',
  ['The work done in bringing a mass from the surface to that point', 'The force per unit mass at that point', 'The energy of a 1 kg mass at the surface of the Earth'],
  'φ = W/m for a test mass brought from infinity. Because gravity is attractive, the work done by an external agent is negative, so φ < 0.')
M('E', 1, 'What is the unit of gravitational potential?', 'J kg⁻¹', ['N kg⁻¹', 'J', 'N m kg'], 'Potential is work (J) per unit mass (kg): J kg⁻¹.')
M('E', 1, 'How does the gravitational potential change as you move away from the Earth towards infinity?', 'It increases from a negative value towards zero', ['It decreases towards zero', 'It increases to a positive maximum', 'It stays constant'],
  'φ = −GM/r. As r increases, φ becomes less negative and approaches zero at infinity.')
N('E', 2, 'A 5.0 kg mass is at a point where the gravitational potential is −3.6 × 10⁷ J kg⁻¹. Calculate its gravitational potential energy.', -3.6e7 * 5.0, 'J', 'Ep = mφ = 5.0 × (−3.6 × 10⁷) = −1.8 × 10⁸ J', ['C1: Ep = mφ'], sig=2, sign=True, aq='Ep')
N('E', 2, 'The gravitational potential at point A is −6.0 × 10⁷ J kg⁻¹ and at point B is −2.0 × 10⁷ J kg⁻¹. Calculate the work done to move a 1.0 kg mass from A to B.', 4.0e7, 'J', 'W = mΔφ = 1.0 × (−2.0 × 10⁷ − (−6.0 × 10⁷)) = 4.0 × 10⁷ J', ['C1: W = mΔφ'], sig=2, aq='W')
M('E', 1, 'What is an equipotential surface in a gravitational field?', 'A surface on which every point has the same gravitational potential', ['A surface where the field strength is zero', 'A surface along which a mass accelerates freely', 'A surface perpendicular to the Earth\'s axis'],
  'On an equipotential no work is done moving a mass along it. Around a spherical planet the equipotentials are concentric spheres, perpendicular to the field lines.')
M('E', 1, 'How are equipotentials and gravitational field lines oriented relative to each other?', 'They are always perpendicular', ['They are always parallel', 'They meet at 45°', 'Field lines lie along the equipotentials'],
  'No work is done moving along an equipotential, so there is no component of the field along it: field lines cross equipotentials at 90°.')
N('E', 2, 'Find the gravitational potential at a distance of 4.22 × 10⁷ m from the Earth\'s centre (geostationary orbit).' + EARTH, -GM_E / 4.22e7, 'J kg⁻¹', f'φ = −GM/r = −6.67 × 10⁻¹¹ × 5.97 × 10²⁴ ÷ 4.22 × 10⁷ = {sf(-GM_E / 4.22e7)} J kg⁻¹', ['C1: φ = −GM/r'], sign=True, aq='φ')
M('E', 1, 'The gravitational potential at distance r from a point mass is φ. What is it at distance 3r?', 'φ/3', ['3φ', 'φ/9', '9φ'], 'φ = −GM/r ∝ 1/r. At 3r it is one third of φ (still negative, closer to zero).')
N('E', 2, 'Jupiter (mass 1.90 × 10²⁷ kg) has radius 7.0 × 10⁷ m. Calculate the gravitational potential at its cloud tops.' + GONLY, -6.67e-11 * 1.9e27 / 7.0e7, 'J kg⁻¹', f'φ = −GM/R = −6.67 × 10⁻¹¹ × 1.90 × 10²⁷ ÷ 7.0 × 10⁷ = {sf(-6.67e-11 * 1.9e27 / 7e7)} J kg⁻¹', ['C1: φ = −GM/R'], sign=True, aq='φ')
M('E', 1, 'Gravitational potential is a scalar. What does this mean when combining the potentials due to two planets at a point?', 'The potentials simply add as numbers', ['They must be added as vectors', 'Only the larger one counts', 'They cancel if the planets are on opposite sides'],
  'Potential has no direction. The total potential is the algebraic sum: φ = −GM₁/r₁ − GM₂/r₂.')
M('E', 1, 'Which of these is equal to the gravitational field strength at a point?', 'Minus the potential gradient, −dφ/dr', ['The potential at the point', 'The potential divided by the distance', 'The area under the φ–r graph'],
  'g = −dφ/dr: the field points down the potential gradient, towards lower (more negative) potential.')
N('E', 2, 'A 70 kg astronaut stands on Mars, where the gravitational potential is −1.26 × 10⁷ J kg⁻¹. Calculate the astronaut\'s gravitational potential energy.', 70 * -1.26e7, 'J', f'Ep = mφ = 70 × (−1.26 × 10⁷) = {sf(-70 * 1.26e7)} J', ['C1: Ep = mφ'], sign=True, aq='Ep')
M('E', 1, 'At which point is the gravitational potential due to the Earth greatest (least negative)?', 'At a point a long way from the Earth', ['At the Earth\'s surface', 'At the centre of the Earth', 'In a low orbit'], 'φ = −GM/r rises towards zero as r increases, so it is greatest far away.')

# ── medium ──
phi1, phi2 = -GM_E / 6.37e6, -GM_E / (6.37e6 + 2.0e6)
N('M', 3, 'Calculate the change in gravitational potential between the Earth\'s surface and a point 2000 km above it.' + EARTH, phi2 - phi1, 'J kg⁻¹',
  f'φ₁ = −GM/R = {sf(phi1)} J kg⁻¹, φ₂ = −GM/(R + h) = −3.98 × 10¹⁴ ÷ 8.37 × 10⁶ = {sf(phi2)} J kg⁻¹. Δφ = {sf(phi2, 4)} − ({sf(phi1, 4)}) = {sf(phi2 - phi1)} J kg⁻¹',
  ['C1: φ at each point', 'C1: r = R + h', 'C1: Δφ = φ₂ − φ₁'], aq='Δφ')
N('M', 3, 'A 50 kg payload is raised through a gravitational potential difference of 3.5 × 10⁶ J kg⁻¹. Calculate the energy needed, and explain why it does not matter which path is taken.', 50 * 3.5e6, 'J',
  'W = mΔφ = 50 × 3.5 × 10⁶ = 1.75 × 10⁸ J. Potential depends only on position, so the work done against gravity depends only on the start and end points.',
  ['C1: W = mΔφ', 'B1: path independent'], aq='W')
x = 3.84e8 / 10 * 9
phiN = -6.67e-11 * 5.97e24 / x - 6.67e-11 * 7.35e22 / (3.84e8 - x)
N('M', 4, 'Calculate the total gravitational potential at the point 3.46 × 10⁸ m from the Earth\'s centre on the line to the Moon (3.84 × 10⁸ m away). Moon\'s mass = 7.35 × 10²² kg.' + EARTH, -GM_E / 3.46e8 - 6.67e-11 * 7.35e22 / (3.84e8 - 3.46e8), 'J kg⁻¹',
  f'φ = −GM_E/r_E − GM_M/r_M = −3.98 × 10¹⁴ ÷ 3.46 × 10⁸ − 6.67 × 10⁻¹¹ × 7.35 × 10²² ÷ 3.8 × 10⁷ = {sf(-GM_E / 3.46e8 - 6.67e-11 * 7.35e22 / 3.8e7)} J kg⁻¹',
  ['C1: potentials add as scalars', 'C1: distance from Moon 3.8 × 10⁷ m', 'C1: substitution'], sign=True, aq='φ')
M('M', 3, 'The gravitational potential at the surface of a planet is −5.0 × 10⁷ J kg⁻¹. What is the minimum energy needed to remove a 2.0 kg mass from the surface to infinity?', '1.0 × 10⁸ J', ['5.0 × 10⁷ J', '−1.0 × 10⁸ J', '2.5 × 10⁷ J'],
  'W = mΔφ = 2.0 × (0 − (−5.0 × 10⁷)) = 1.0 × 10⁸ J. The energy supplied is positive.', ['C1: Δφ = 0 − φ', 'C1: W = mΔφ'])
N('M', 3, 'At a distance r from a planet\'s centre the gravitational potential is −2.4 × 10⁷ J kg⁻¹ and the field strength is 4.0 N kg⁻¹. Calculate r, using g = −φ/r for a point mass.', 2.4e7 / 4.0, 'm',
  'φ = −GM/r and g = GM/r², so g = −φ/r and r = −φ/g = 2.4 × 10⁷ ÷ 4.0 = 6.0 × 10⁶ m', ['C1: g = −φ/r', 'C1: rearranged'], sig=2, aq='r')
N('M', 4, 'The potential at the surface of a planet of radius 3.0 × 10⁶ m is −1.2 × 10⁷ J kg⁻¹. Calculate the escape speed from the planet.', sqrt(2 * 1.2e7), 'm s⁻¹',
  f'½v² = −φ (energy per unit mass needed to reach φ = 0), so v = √(2 × 1.2 × 10⁷) = {sf(sqrt(2.4e7))} m s⁻¹', ['C1: ½mv² = m|φ|', 'C1: rearranged', 'B1: radius not needed'], aq='v_esc')
M('M', 3, 'Which graph shape shows how the gravitational potential φ varies with distance r from the centre of a planet, outside the planet?', 'A curve rising from a large negative value towards zero, getting less steep', ['A straight line through the origin', 'A curve falling from zero to large negative values', 'A horizontal line'],
  'φ = −GM/r: negative, approaching zero as r → ∞, with gradient GM/r² (the field strength) decreasing with r.', ['C1: negative values approaching zero', 'C1: gradient decreases'])
N('M', 3, 'A rock falls from rest at a point where φ = −6.0 × 10⁶ J kg⁻¹ to the surface of a moon where φ = −8.5 × 10⁶ J kg⁻¹. There is no atmosphere. Calculate its landing speed.', sqrt(2 * 2.5e6), 'm s⁻¹',
  f'Ek gained per kg = −Δφ = 8.5 × 10⁶ − 6.0 × 10⁶ = 2.5 × 10⁶ J kg⁻¹. ½v² = 2.5 × 10⁶, v = √(2 × 2.5 × 10⁶) = {sf(sqrt(5e6))} m s⁻¹', ['C1: energy per kg = Δφ', 'C1: ½v² = Δφ'], aq='v')
M('M', 4, 'Two points X and Y are on the same equipotential around the Earth. A satellite moves from X to Y. Which is correct?', 'No net work is done by gravity, whatever path the satellite takes', ['Work done depends on the path', 'The satellite must stay at the same speed throughout', 'The field strength is zero between X and Y'],
  'Work done by gravity = −mΔφ, and Δφ = 0 between X and Y. Gravity is a conservative field, so this is path independent.', ['C1: Δφ = 0', 'C1: W = mΔφ', 'C1: path independence'])
N('M', 3, 'The gravitational potential at a point due to two moons is the sum of their potentials. At point P, moon A gives −4.0 × 10⁶ J kg⁻¹ and moon B gives −2.5 × 10⁶ J kg⁻¹. Calculate the work needed to take a 10 kg probe from P to infinity.', 10 * 6.5e6, 'J',
  'Total φ = −4.0 × 10⁶ + (−2.5 × 10⁶) = −6.5 × 10⁶ J kg⁻¹. W = m(0 − φ) = 10 × 6.5 × 10⁶ = 6.5 × 10⁷ J', ['C1: potentials add', 'C1: W = −mφ'], sig=2, aq='W')
N('M', 4, 'A gravitational potential–distance graph for a planet has a tangent at r = 1.5 × 10⁷ m with gradient 1.8 J kg⁻¹ m⁻¹. (a) State the field strength there. (b) Calculate GM for the planet. Give only the answer to (b).', 1.8 * 1.5e7 ** 2, 'N m² kg⁻¹',
  f'(a) g = gradient = 1.8 N kg⁻¹ (towards the planet). (b) g = GM/r², so GM = gr² = 1.8 × (1.5 × 10⁷)² = {sf(1.8 * 2.25e14)} N m² kg⁻¹', ['B1: g = dφ/dr', 'C1: g = GM/r²', 'C1: GM = gr²'], aq='GM')
M('M', 3, 'A student claims that the gravitational potential halfway between two equal stars is zero because the fields cancel there. What is wrong?', 'The fields cancel but the potentials add: the potential is twice the (negative) potential due to one star', ['Nothing: zero field means zero potential', 'The potential is positive there', 'The potentials cancel but the fields add'],
  'Field strength is a vector and cancels at the midpoint. Potential is a scalar: −GM/d − GM/d = −2GM/d, which is not zero.', ['C1: field vectors cancel', 'C1: potentials are scalars and add'])
N('M', 3, 'The gravitational potential at the surface of an asteroid of radius 3.0 km is −24 J kg⁻¹. Calculate the mass of the asteroid.' + GONLY, 24 * 3000 / 6.67e-11, 'kg',
  f'φ = −GM/R, so M = −φR/G = 24 × 3000 ÷ 6.67 × 10⁻¹¹ = {sf(24 * 3000 / 6.67e-11)} kg', ['C1: φ = −GM/R', 'C1: rearranged with R in m'], aq='M')

# ── hard ──
r_s = 6.37e6; r_o = 4.22e7
N('H', 5, 'A 2500 kg communications satellite is launched from the Earth\'s surface into a geostationary orbit of radius 4.22 × 10⁷ m. (a) Calculate the gravitational potential at the surface and at the orbit. (b) Calculate the increase in the satellite\'s gravitational potential energy. (c) Explain why the launch must supply more energy than this. Give only the answer to (b).' + EARTH, 2500 * GM_E * (1 / r_s - 1 / r_o), 'J',
  f'(a) φ_surface = −3.98 × 10¹⁴ ÷ 6.37 × 10⁶ = {sf(-GM_E / r_s)} J kg⁻¹, φ_orbit = −3.98 × 10¹⁴ ÷ 4.22 × 10⁷ = {sf(-GM_E / r_o)} J kg⁻¹. (b) ΔEp = mΔφ = 2500 × ({sf(-GM_E / r_o, 4)} − ({sf(-GM_E / r_s, 4)})) = {sf(2500 * GM_E * (1 / r_s - 1 / r_o))} J. (c) The satellite also needs kinetic energy to orbit at 3.07 km s⁻¹, and energy is wasted lifting fuel and against air resistance.',
  ['C1: φ = −GM/r', 'A1: both potentials', 'C1: ΔEp = mΔφ', 'A1: ΔEp', 'B1: kinetic energy and losses'], aq='ΔEp')
N('H', 6, 'Equipotentials around a planet are drawn at −8.0, −6.0, −4.0 and −2.0 MJ kg⁻¹. (a) Explain why the equipotentials are spheres that get further apart moving outwards, although the potential steps are equal. (b) The −8.0 and −6.0 MJ kg⁻¹ equipotentials have radii 5.0 × 10⁶ m and 6.67 × 10⁶ m. Estimate the average field strength between them. (c) Calculate GM from the −8.0 MJ kg⁻¹ surface. Give only the answer to (b).', 2.0e6 / (6.67e6 - 5.0e6), 'N kg⁻¹',
  f'(a) φ ∝ −1/r: equal steps in φ need larger steps in r as r grows (the field weakens). (b) g ≈ Δφ/Δr = 2.0 × 10⁶ ÷ (6.67 × 10⁶ − 5.0 × 10⁶) = {sf(2e6 / 1.67e6)} N kg⁻¹. (c) GM = −φr = 8.0 × 10⁶ × 5.0 × 10⁶ = 4.0 × 10¹³ N m² kg⁻¹.',
  ['B1: φ ∝ −1/r', 'B1: field weakens so spacing increases', 'C1: g = Δφ/Δr', 'A1: g', 'C1: GM = −φr', 'A1: GM'], aq='g')
N('H', 5, 'A spacecraft is at rest at the point between the Earth and Moon where the resultant field is zero, 3.46 × 10⁸ m from the Earth\'s centre (3.8 × 10⁷ m from the Moon\'s). Moon\'s mass = 7.35 × 10²² kg, radius 1.74 × 10⁶ m. (a) Calculate the potential at this point. (b) Calculate the potential at the Moon\'s surface (include the Earth\'s contribution, taking the Earth–Moon distance as 3.84 × 10⁸ m). (c) Calculate the speed with which the spacecraft would reach the Moon\'s surface if given a tiny push towards the Moon. Give only the answer to (c).' + EARTH,
  sqrt(2 * ((-GM_E / 3.46e8 - 6.67e-11 * 7.35e22 / 3.8e7) - (-GM_E / 3.84e8 - 6.67e-11 * 7.35e22 / 1.74e6))), 'm s⁻¹',
  f'(a) φ = −3.98 × 10¹⁴ ÷ 3.46 × 10⁸ − 4.90 × 10¹² ÷ 3.8 × 10⁷ = {sf(-GM_E / 3.46e8 - 6.67e-11 * 7.35e22 / 3.8e7)} J kg⁻¹. (b) φ = −3.98 × 10¹⁴ ÷ 3.84 × 10⁸ − 4.90 × 10¹² ÷ 1.74 × 10⁶ = {sf(-GM_E / 3.84e8 - 6.67e-11 * 7.35e22 / 1.74e6)} J kg⁻¹. (c) ½v² = Δφ: v = √(2 × ({sf(-GM_E / 3.46e8 - 6.67e-11 * 7.35e22 / 3.8e7, 4)} − ({sf(-GM_E / 3.84e8 - 6.67e-11 * 7.35e22 / 1.74e6, 4)}))) = {sf(sqrt(2 * ((-GM_E / 3.46e8 - 6.67e-11 * 7.35e22 / 3.8e7) - (-GM_E / 3.84e8 - 6.67e-11 * 7.35e22 / 1.74e6))))} m s⁻¹',
  ['C1: potentials add', 'A1: φ at neutral point', 'A1: φ at Moon surface', 'C1: ½v² = Δφ', 'A1: v'], aq='v')
N('H', 5, 'A student plots φ against 1/r for a planet using: 1/r = 1.0 × 10⁻⁷ m⁻¹, φ = −3.0 × 10⁷ J kg⁻¹; 1/r = 2.0 × 10⁻⁷ m⁻¹, φ = −6.0 × 10⁷ J kg⁻¹; 1/r = 3.0 × 10⁻⁷ m⁻¹, φ = −9.0 × 10⁷ J kg⁻¹. (a) Describe the graph. (b) Determine GM from it. (c) Calculate the planet\'s mass. Give only the answer to (c).' + GONLY, 3.0e14 / 6.67e-11, 'kg',
  f'(a) A straight line through the origin with negative gradient: φ ∝ −1/r. (b) gradient = −3.0 × 10⁷ ÷ 1.0 × 10⁻⁷ = −3.0 × 10¹⁴ J m kg⁻¹ = −GM, so GM = 3.0 × 10¹⁴ N m² kg⁻¹. (c) M = 3.0 × 10¹⁴ ÷ 6.67 × 10⁻¹¹ = {sf(3e14 / 6.67e-11)} kg',
  ['B1: straight line through origin, negative gradient', 'C1: gradient = −GM', 'A1: GM', 'C1: M = GM/G', 'A1: M'], aq='M')
N('H', 6, 'Two stars, each of mass 3.0 × 10³⁰ kg, are 6.0 × 10¹¹ m apart. (a) Calculate the gravitational potential at the midpoint. (b) State the field strength at the midpoint and explain the difference in behaviour of φ and g. (c) Calculate the minimum energy a 1000 kg probe at the midpoint needs to escape from both stars. Give only the answer to (c).' + GONLY, 1000 * 2 * 6.67e-11 * 3.0e30 / 3.0e11, 'J',
  f'(a) φ = −2GM/(d/2) = −2 × 6.67 × 10⁻¹¹ × 3.0 × 10³⁰ ÷ 3.0 × 10¹¹ = {sf(-2 * 6.67e-11 * 3e30 / 3e11)} J kg⁻¹. (b) g = 0: the vector fields cancel, but potential is a scalar and the contributions add. (c) E = m × |φ| = 1000 × {sf(2 * 6.67e-11 * 3e30 / 3e11)} = {sf(1000 * 2 * 6.67e-11 * 3e30 / 3e11)} J',
  ['C1: distance d/2 from each', 'A1: φ', 'B1: g = 0', 'B1: scalar vs vector', 'C1: E = m|φ|', 'A1: E'], aq='E')

# ═════════════════════════ 17.5 Orbiting under gravity ═════════════════════════
lesson('17.5')
M('E', 1, 'A satellite is in a circular orbit around the Earth. Which force provides the centripetal force?', 'The gravitational attraction of the Earth', ['The thrust of the satellite\'s engines', 'The centrifugal force on the satellite', 'The gravitational attraction of the Sun'],
  'Gravity towards the Earth\'s centre is the only significant force and it provides the centripetal force GMm/r² = mv²/r.')
M('E', 1, 'For a circular orbit of radius r around a planet of mass M, which expression gives the orbital speed?', '√(GM/r)', ['√(2GM/r)', 'GM/r²', '√(GMr)'], 'GMm/r² = mv²/r gives v² = GM/r, so v = √(GM/r).')
N('E', 2, 'Calculate the orbital speed of a satellite in a circular orbit of radius 8.0 × 10⁶ m around the Earth.' + EARTH, sqrt(GM_E / 8.0e6), 'm s⁻¹', f'v = √(GM/r) = √(6.67 × 10⁻¹¹ × 5.97 × 10²⁴ ÷ 8.0 × 10⁶) = {sf(sqrt(GM_E / 8e6))} m s⁻¹', ['C1: v = √(GM/r)'], aq='v')
M('E', 1, 'Two satellites orbit the Earth at the same radius. One has twice the mass of the other. How do their orbital speeds compare?', 'They are equal', ['The heavier one is twice as fast', 'The heavier one is half as fast', 'The heavier one is √2 times as fast'], 'v = √(GM/r) does not contain the satellite\'s mass.')
M('E', 1, 'A satellite moves to an orbit of larger radius around the same planet. What happens to its orbital speed?', 'It decreases', ['It increases', 'It stays the same', 'It becomes zero'], 'v = √(GM/r) ∝ 1/√r, so a larger orbit is slower.')
N('E', 2, 'The Moon orbits the Earth at a radius of 3.84 × 10⁸ m. Calculate its orbital speed.' + EARTH, sqrt(GM_E / 3.84e8), 'm s⁻¹', f'v = √(GM/r) = √(6.67 × 10⁻¹¹ × 5.97 × 10²⁴ ÷ 3.84 × 10⁸) = {sf(sqrt(GM_E / 3.84e8))} m s⁻¹', ['C1: v = √(GM/r)'], aq='v')
N('E', 2, 'Calculate the speed of the Earth in its orbit around the Sun (orbit radius 1.50 × 10¹¹ m, Sun\'s mass 1.99 × 10³⁰ kg).' + GONLY, sqrt(6.67e-11 * 1.99e30 / 1.5e11), 'm s⁻¹', f'v = √(GM/r) = √(6.67 × 10⁻¹¹ × 1.99 × 10³⁰ ÷ 1.50 × 10¹¹) = {sf(sqrt(6.67e-11 * 1.99e30 / 1.5e11))} m s⁻¹', ['C1: v = √(GM/r)'], aq='v')
M('E', 1, 'Which equation is used to derive the orbital speed of a satellite?', 'GMm/r² = mv²/r', ['GMm/r = ½mv²', 'mg = GMm/r', 'mv = GMm/r²'], 'The gravitational force provides the centripetal force, so GMm/r² = mv²/r.')
N('E', 2, 'A probe orbits Venus (mass 4.87 × 10²⁴ kg) at a radius of 7.0 × 10⁶ m. Calculate its orbital speed.' + GONLY, sqrt(6.67e-11 * 4.87e24 / 7.0e6), 'm s⁻¹', f'v = √(GM/r) = √(6.67 × 10⁻¹¹ × 4.87 × 10²⁴ ÷ 7.0 × 10⁶) = {sf(sqrt(6.67e-11 * 4.87e24 / 7e6))} m s⁻¹', ['C1: v = √(GM/r)'], aq='v')
M('E', 1, 'A satellite\'s orbit radius is made four times larger. By what factor does its orbital speed change?', '½', ['¼', '2', '√2'], 'v ∝ 1/√r, so increasing r by 4 divides v by √4 = 2.')
# medium
N('M', 3, 'A moon orbits a planet at 2.5 × 10⁸ m with a speed of 1.4 km s⁻¹. Calculate the mass of the planet.' + GONLY, 1400 ** 2 * 2.5e8 / 6.67e-11, 'kg',
  f'v² = GM/r, so M = v²r/G = 1400² × 2.5 × 10⁸ ÷ 6.67 × 10⁻¹¹ = {sf(1400 ** 2 * 2.5e8 / 6.67e-11)} kg', ['C1: v² = GM/r', 'C1: M = v²r/G', 'C1: speed in m s⁻¹'], aq='M')
N('M', 3, 'A satellite orbits the Earth at 6.9 km s⁻¹. Calculate the radius of its orbit.' + EARTH, GM_E / 6900 ** 2, 'm', f'r = GM/v² = 6.67 × 10⁻¹¹ × 5.97 × 10²⁴ ÷ 6900² = {sf(GM_E / 6900 ** 2)} m', ['C1: v² = GM/r', 'C1: rearranged for r', 'C1: v in m s⁻¹'], aq='r')
M('M', 3, 'A satellite in a circular orbit has kinetic energy Ek. What is its gravitational potential energy?', '−2Ek', ['−Ek', '−Ek/2', '2Ek'], 'Ek = ½mv² = GMm/2r and Ep = −GMm/r = −2Ek.', ['C1: Ek = GMm/2r', 'C1: Ep = −GMm/r'])
N('M', 4, 'The Hubble Space Telescope orbits 540 km above the Earth\'s surface. Calculate its orbital speed and the time for one orbit. Give the time in minutes.' + EARTH, 2 * pi * 6.91e6 / sqrt(GM_E / 6.91e6) / 60, 'minutes',
  f'r = 6.37 × 10⁶ + 5.4 × 10⁵ = 6.91 × 10⁶ m. v = √(GM/r) = √(3.98 × 10¹⁴ ÷ 6.91 × 10⁶) = {sf(sqrt(GM_E / 6.91e6))} m s⁻¹. T = 2πr/v = 2π × 6.91 × 10⁶ ÷ {sf(sqrt(GM_E / 6.91e6), 4)} = {sf(2 * pi * 6.91e6 / sqrt(GM_E / 6.91e6))} s. In minutes: {sf(2 * pi * 6.91e6 / sqrt(GM_E / 6.91e6), 4)} ÷ 60 = {sf(2 * pi * 6.91e6 / sqrt(GM_E / 6.91e6) / 60)}',
  ['C1: r = R + h', 'C1: v = √(GM/r)', 'C1: T = 2πr/v', ], aq='T')
M('M', 3, 'Satellite X orbits a planet at radius r with speed v. Satellite Y orbits the same planet at radius 9r. What is the speed of Y?', 'v/3', ['v/9', '3v', 'v/81'], 'v ∝ 1/√r: √9 = 3, so Y moves at v/3.', ['C1: v ∝ r^(−½)', 'C1: √9'])
N('M', 3, 'Show that the orbital speed of a satellite just above the Earth\'s surface (ignore air) is √(gR), and calculate it. g = 9.81 N kg⁻¹, R = 6.37 × 10⁶ m.', sqrt(9.81 * 6.37e6), 'm s⁻¹',
  f'mg = mv²/R, so v = √(gR) = √(9.81 × 6.37 × 10⁶) = {sf(sqrt(9.81 * 6.37e6))} m s⁻¹', ['M1: gravity = mv²/R', 'C1: substitution'], aq='v')
N('M', 3, 'A satellite of mass 800 kg is in a circular orbit of radius 1.2 × 10⁷ m. Calculate its total energy (Ek + Ep = −GMm/2r).' + EARTH, -GM_E * 800 / (2 * 1.2e7), 'J', f'E = −GMm/2r = −3.98 × 10¹⁴ × 800 ÷ (2 × 1.2 × 10⁷) = {sf(-GM_E * 800 / 2.4e7)} J', ['C1: E = −GMm/2r', 'C1: substitution'], sign=True, aq='E')
M('M', 4, 'A satellite in a circular orbit is slowed slightly by air resistance and drops into a lower circular orbit. What happens to its speed?', 'It increases', ['It decreases', 'It stays the same', 'It becomes zero'],
  'In the lower orbit v = √(GM/r) is larger. Air resistance removes energy, but the satellite loses twice as much Ep as it gains Ek, so its speed rises.', ['C1: v = √(GM/r)', 'C1: smaller r', 'C1: larger v'])
N('M', 4, 'A planet orbits a star of mass 3.0 × 10³⁰ kg at 2.0 × 10¹¹ m. Calculate the distance it travels along its orbit in one Earth year (3.16 × 10⁷ s).' + GONLY, sqrt(6.67e-11 * 3e30 / 2e11) * 3.16e7, 'm',
  f'v = √(GM/r) = √(6.67 × 10⁻¹¹ × 3.0 × 10³⁰ ÷ 2.0 × 10¹¹) = {sf(sqrt(6.67e-11 * 3e30 / 2e11))} m s⁻¹. Distance = vt = {sf(sqrt(6.67e-11 * 3e30 / 2e11), 4)} × 3.16 × 10⁷ = {sf(sqrt(6.67e-11 * 3e30 / 2e11) * 3.16e7)} m',
  ['C1: v = √(GM/r)', 'A1: v', 'C1: distance = vt'], aq='distance')

# ── extras 17.1–17.4 ──
lesson('17.1')
N('M', 3, 'A spring balance is calibrated on Earth (g = 9.81 N kg⁻¹) to show mass in kg. On a moon it reads 0.35 kg for an object whose true mass is 2.0 kg. Calculate the gravitational field strength on the moon.', 9.81 * 0.35 / 2.0, 'N kg⁻¹',
  f'The balance measures force: reading × 9.81 = weight. Weight = 0.35 × 9.81 = {sf(0.35 * 9.81)} N, so g = weight ÷ true mass = {sf(0.35 * 9.81)} ÷ 2.0 = {sf(0.35 * 9.81 / 2)} N kg⁻¹',
  ['C1: balance reads force/9.81', 'C1: weight = reading × 9.81', 'C1: g = W/m'], aq='g')
M('M', 3, 'A uniform gravitational field acts vertically downwards. A ball is thrown horizontally in it. Which describes the force on the ball during its flight (no air resistance)?', 'Constant in size and direction, vertically downwards', ['Horizontal, in the direction of the throw', 'Decreasing as the ball falls', 'Changing direction along the path'],
  'In a uniform field g is the same everywhere, so F = mg is constant and always vertically down — this gives the parabolic path.', ['C1: uniform field: same g everywhere', 'C1: direction downwards'])
N('M', 3, 'A planet has the same density as the Earth but twice its radius. Calculate the gravitational field strength at its surface.' + take('g'), 9.81 * 2, 'N kg⁻¹',
  f'g = (4/3)πGρR, so with the same ρ, g ∝ R. g = 2 × 9.81 = {sf(19.62)} N kg⁻¹', ['C1: M ∝ ρR³', 'C1: g ∝ M/R² ∝ ρR'], aq='g')
M('E', 1, 'Which statement about the Earth\'s gravitational field outside the Earth is correct?', 'It is radial and its strength decreases with distance from the centre', ['It is uniform at all heights', 'It is zero above the atmosphere', 'It points away from the Earth'],
  'Outside the Earth the field is radial (towards the centre) with g = GM/r², decreasing with distance.')
N('H', 5, 'An astronaut on an unknown planet drops a hammer from rest at a height of 1.80 m and times its fall as 0.85 s (no atmosphere). The planet\'s radius is 4.6 × 10⁶ m. (a) Calculate g on the planet. (b) Calculate the planet\'s mass. (c) Compare g with the Earth\'s value and state one effect on the astronaut. Give only the answer to (b).' + GONLY, (2 * 1.80 / 0.85 ** 2) * 4.6e6 ** 2 / 6.67e-11, 'kg',
  f'(a) g = 2s/t² = 2 × 1.80 ÷ 0.85² = {sf(3.6 / 0.7225)} N kg⁻¹. (b) M = gR²/G = {sf(3.6 / 0.7225)} × (4.6 × 10⁶)² ÷ 6.67 × 10⁻¹¹ = {sf((3.6 / 0.7225) * 4.6e6 ** 2 / 6.67e-11)} kg. (c) About half of Earth\'s g, so the astronaut weighs about half as much and can jump higher.',
  ['C1: s = ½gt²', 'A1: g', 'C1: M = gR²/G', 'A1: M', 'B1: comparison and effect'], aq='M')
N('H', 6, 'A gravimeter (a very sensitive device for measuring g) reads 9.80 N kg⁻¹ at sea level and 9.79 N kg⁻¹ at the top of a tall building, at the same location. (a) Explain why g is smaller at the top. (b) Use g ∝ 1/r² to estimate the height of the building. Take R = 6.37 × 10⁶ m. (c) Suggest why the reading also depends on the rock under the gravimeter. Give only the height in (b).', 6.37e6 * (sqrt(9.80 / 9.79) - 1), 'm',
  f'(a) It is further from the Earth\'s centre. (b) r/R = √(9.80 ÷ 9.79) = {sf(sqrt(9.80 / 9.79), 6)}, so h = 6.37 × 10⁶ × ({sf(sqrt(9.80 / 9.79), 6)} − 1) = {sf(6.37e6 * (sqrt(9.80 / 9.79) - 1))} m. (c) Dense rock (or ore) nearby adds a little to the field; low-density rock reduces it.',
  ['B1: further from centre', 'C1: r/R = √(g₀/g)', 'M1: h = R(r/R − 1)', 'A1: h', 'B1: local density variations', 'B1: denser rock larger g'], sig=2, aq='h')

lesson('17.2')
N('M', 3, 'At what distance from the centre of the Earth would a 70 kg person weigh 100 N?' + EARTH, sqrt(GM_E * 70 / 100), 'm',
  f'F = GMm/r², so r = √(GMm/F) = √(3.98 × 10¹⁴ × 70 ÷ 100) = {sf(sqrt(GM_E * 70 / 100))} m', ['C1: F = GMm/r²', 'C1: rearranged for r'], aq='r')
M('E', 1, 'A planet\'s radius is doubled while its mass stays the same. What happens to the gravitational field strength at its surface?', 'It falls to one quarter', ['It halves', 'It doubles', 'It is unchanged'], 'g = GM/R²: doubling R with M fixed divides g by 4.')

lesson('17.3')
N('M', 3, 'A 15 000 kg rocket rises from the Earth\'s surface to a height of 250 km. Calculate the increase in its gravitational potential energy, using Ep = −GMm/r.' + EARTH, GM_E * 15000 * (1 / 6.37e6 - 1 / 6.62e6), 'J',
  f'ΔEp = GMm(1/R − 1/r) = 3.98 × 10¹⁴ × 15000 × (1 ÷ 6.37 × 10⁶ − 1 ÷ 6.62 × 10⁶) = {sf(GM_E * 15000 * (1 / 6.37e6 - 1 / 6.62e6))} J',
  ['C1: r = R + h', 'C1: ΔEp = GMm(1/r₁ − 1/r₂)', 'C1: substitution'], aq='ΔEp')
M('M', 3, 'A probe is launched from the Earth\'s surface at 15 km s⁻¹ (greater than the escape speed, 11.2 km s⁻¹). Ignoring other bodies and air, what is its speed a very long way from the Earth?', 'About 10 km s⁻¹', ['Zero', '15 km s⁻¹', '3.8 km s⁻¹'],
  '½v∞² = ½v₀² − ½v_esc², so v∞ = √(15² − 11.2²) = √(225 − 125) ≈ 10 km s⁻¹.', ['C1: energy conservation', 'C1: v∞² = v₀² − v_esc²'])
N('E', 2, 'A 0.20 kg apple falls 3.0 m from a tree. Calculate the decrease in its gravitational potential energy.' + take('g'), 0.20 * 9.81 * 3.0, 'J', f'ΔEp = mgh = 0.20 × 9.81 × 3.0 = {sf(5.886)} J', ['C1: ΔEp = mgh'], aq='ΔEp')
N('H', 5, 'A space elevator lifts a 1000 kg capsule from the Earth\'s surface to geostationary height (orbit radius 4.22 × 10⁷ m). (a) Calculate the gain in gravitational potential energy. (b) Explain why mgh with g = 9.81 N kg⁻¹ would give a very wrong answer. (c) The capsule must also move at 3.07 km s⁻¹ at the top. Calculate the kinetic energy it needs there. Give only the answer to (a).' + EARTH, GM_E * 1000 * (1 / 6.37e6 - 1 / 4.22e7), 'J',
  f'(a) ΔEp = GMm(1/R − 1/r) = 3.98 × 10¹⁴ × 1000 × (1 ÷ 6.37 × 10⁶ − 1 ÷ 4.22 × 10⁷) = {sf(GM_E * 1000 * (1 / 6.37e6 - 1 / 4.22e7))} J. (b) g falls to about 0.22 N kg⁻¹ at the top, so mgh would greatly overestimate (by about 4.5 times). (c) Ek = ½mv² = 0.5 × 1000 × 3070² = {sf(0.5 * 1000 * 3070 ** 2)} J',
  ['C1: ΔEp formula', 'A1: ΔEp', 'B1: g not uniform', 'C1: Ek = ½mv²', 'A1: Ek'], aq='ΔEp')

lesson('17.4')
N('M', 3, 'The gravitational potential at a height h above a planet is −4.0 × 10⁷ J kg⁻¹ and at the surface it is −6.0 × 10⁷ J kg⁻¹. A 3.0 kg mass falls from rest from height h to the surface (no air). Calculate its kinetic energy on arrival.', 3.0 * 2.0e7, 'J',
  'Ek = mΔφ = 3.0 × (−4.0 × 10⁷ − (−6.0 × 10⁷)) = 6.0 × 10⁷ J', ['C1: loss of Ep = mΔφ', 'C1: Ek gained = Ep lost'], sig=2, aq='Ek')
M('M', 3, 'Which expression gives the gravitational potential energy of a mass m at a point where the gravitational potential is φ?', 'mφ', ['φ/m', '−mφ', 'mφ²'], 'φ is energy per unit mass, so Ep = mφ (negative, because φ is negative).', ['C1: φ defined per unit mass', 'C1: Ep = mφ'])
N('E', 2, 'Calculate the gravitational potential due to the Sun at the Earth\'s orbit, 1.50 × 10¹¹ m away. Sun\'s mass = 1.99 × 10³⁰ kg.' + GONLY, -6.67e-11 * 1.99e30 / 1.5e11, 'J kg⁻¹',
  f'φ = −GM/r = −6.67 × 10⁻¹¹ × 1.99 × 10³⁰ ÷ 1.50 × 10¹¹ = {sf(-6.67e-11 * 1.99e30 / 1.5e11)} J kg⁻¹', ['C1: φ = −GM/r'], sign=True, aq='φ')

# ═════════════════════════ 17.6 The orbital period ═════════════════════════
lesson('17.6')
T = 2 * pi * sqrt(8.0e6 ** 3 / GM_E)
N('E', 2, 'Calculate the orbital period of a satellite in a circular orbit of radius 8.0 × 10⁶ m around the Earth.' + EARTH, T, 's', f'T = 2π√(r³/GM) = 2π × √((8.0 × 10⁶)³ ÷ 3.98 × 10¹⁴) = {sf(T)} s', ['C1: T² = 4π²r³/GM'], aq='T')
M('E', 1, 'Kepler\'s third law for circular orbits around the same central body states that…', 'T² is proportional to r³', ['T is proportional to r', 'T² is proportional to r²', 'T³ is proportional to r²'],
  'From GMm/r² = mω²r with ω = 2π/T: T² = (4π²/GM) r³, so T² ∝ r³.')
M('E', 1, 'Does the orbital period of a satellite in a circular orbit depend on the satellite\'s mass?', 'No — only on the orbit radius and the mass of the central body', ['Yes: heavier satellites orbit more slowly', 'Yes: heavier satellites orbit faster', 'Only for satellites close to the planet'], 'T² = 4π²r³/GM: the satellite\'s mass cancels out.')
N('E', 2, 'A moon orbits a planet of mass 6.0 × 10²⁶ kg at a radius of 5.0 × 10⁸ m. Calculate its orbital period.' + GONLY, 2 * pi * sqrt(5.0e8 ** 3 / (6.67e-11 * 6e26)), 's',
  f'T = 2π√(r³/GM) = 2π × √((5.0 × 10⁸)³ ÷ (6.67 × 10⁻¹¹ × 6.0 × 10²⁶)) = {sf(2 * pi * sqrt(1.25e26 / (4.002e16)))} s', ['C1: T = 2π√(r³/GM)'], aq='T')
M('E', 1, 'Satellite B orbits a planet at four times the radius of satellite A. How many times longer is B\'s period?', '8', ['4', '16', '2'], 'T ∝ r^(3/2): 4^(3/2) = 8.')
N('E', 2, 'A planet takes 4.5 Earth years to orbit its star. A second planet orbits the same star at 0.50 times the first planet\'s orbit radius. Calculate the second planet\'s period in Earth years.', 4.5 * 0.5 ** 1.5, 'years',
  f'T ∝ r^(3/2), so T₂ = 4.5 × 0.50^(3/2) = 4.5 × √(0.50³) = {sf(4.5 * sqrt(0.125))} years', ['C1: T² ∝ r³'], aq='T')
M('E', 1, 'For circular orbits around the Earth, which graph gives a straight line through the origin?', 'T² against r³', ['T against r', 'T against r²', 'T² against r'], 'T² = (4π²/GM)r³: plotting T² against r³ gives a straight line through the origin with gradient 4π²/GM.')
N('E', 2, 'Calculate the orbital period, in days, of a satellite orbiting the Earth at a radius of 1.0 × 10⁸ m.' + EARTH, 2 * pi * sqrt(1e24 / GM_E) / 86400, 'days',
  f'T = 2π√(r³/GM) = 2π × √((1.0 × 10⁸)³ ÷ 3.98 × 10¹⁴) = {sf(2 * pi * sqrt(1e24 / GM_E))} s. In days: {sf(2 * pi * sqrt(1e24 / GM_E), 4)} ÷ 86400 = {sf(2 * pi * sqrt(1e24 / GM_E) / 86400)}', ['C1: T = 2π√(r³/GM)'], aq='T')
M('E', 1, 'Which quantity is the same for all satellites in circular orbits around the Earth?', 'T²/r³', ['T/r', 'v²r²', 'T²r³'], 'T²/r³ = 4π²/GM, which depends only on the Earth\'s mass.')
N('E', 2, 'A satellite has period 2.0 h at a certain orbit radius. Another satellite of the same planet orbits at 2.0 times the radius. Calculate its period.', 2.0 * 2.0 ** 1.5, 'h',
  f'T ∝ r^(3/2): T = 2.0 × 2.0^(3/2) = 2.0 × √(2.0³) = {sf(2 * sqrt(8))} h', ['C1: T ∝ r^1.5'], aq='T')
M('E', 1, 'A satellite moves into a higher circular orbit. Which change happens?', 'Its period increases and its speed decreases', ['Its period and speed both increase', 'Its period decreases and its speed increases', 'Its period stays the same'],
  'T ∝ r^(3/2) and v ∝ r^(−1/2): higher orbits are slower and take longer.')
N('E', 2, 'Saturn\'s moon Titan orbits at 1.22 × 10⁹ m with a period of 15.9 days. Calculate its orbital speed.', 2 * pi * 1.22e9 / (15.9 * 86400), 'm s⁻¹', f'v = 2πr/T = 2π × 1.22 × 10⁹ ÷ (15.9 × 86400) = {sf(2 * pi * 1.22e9 / 1373760)} m s⁻¹', ['C1: v = 2πr/T with T in s'], aq='v')
M('E', 1, 'Planets further from the Sun take longer to orbit it. Which reason is correct?', 'They move more slowly and have further to travel', ['They are heavier', 'The Sun\'s gravity is stronger further out', 'They spin more slowly on their axes'], 'Further out, v = √(GM/r) is smaller and the circumference 2πr is larger, so T = 2πr/v grows as r^(3/2).')
N('E', 2, 'A satellite takes 100 minutes to orbit the Earth at 7.3 km s⁻¹. Calculate the radius of its orbit.', 7300 * 6000 / (2 * pi), 'm', f'r = vT/2π = 7300 × 6000 ÷ 2π = {sf(7300 * 6000 / (2 * pi))} m', ['C1: v = 2πr/T'], aq='r')
N('E', 2, 'Mars orbits the Sun at 1.52 times the Earth\'s orbit radius. Use Kepler\'s third law to calculate its orbital period in Earth years.', 1.52 ** 1.5, 'years', f'T ∝ r^(3/2): T = 1.52^(3/2) = √(1.52³) = {sf(sqrt(1.52 ** 3))} years', ['C1: T² ∝ r³ with Earth as reference'], aq='T')
M('E', 1, 'The gravitational force on a satellite provides its centripetal force. Which equation follows directly?', 'GM/r² = 4π²r/T²', ['GM/r = 4π²r²/T', 'GM r² = 4πT', 'GM/r² = 2πr/T'], 'GMm/r² = mω²r = m(2π/T)²r, so GM/r² = 4π²r/T².')
# medium
r = (GM_E * (12 * 3600) ** 2 / (4 * pi ** 2)) ** (1 / 3)
r = (GM_E * 43200 ** 2 / (4 * pi ** 2)) ** (1 / 3)
N('M', 3, 'A navigation satellite has an orbital period of 12.0 hours. Calculate its orbital radius.' + EARTH, r, 'm',
  f'T = 43200 s. r = (GMT²/4π²)^(1/3) = (3.98 × 10¹⁴ × 43200² ÷ (4π²))^(1/3) = {sf(r)} m', ['C1: T in seconds', 'C1: r³ = GMT²/4π²', 'C1: cube root'], aq='r')
N('M', 3, 'Io orbits Jupiter at 4.22 × 10⁸ m with a period of 1.77 days. Calculate the mass of Jupiter.' + GONLY, 4 * pi ** 2 * 4.22e8 ** 3 / (6.67e-11 * (1.77 * 86400) ** 2), 'kg',
  f'T = 1.77 × 86400 = {sf(1.77 * 86400)} s. M = 4π²r³/GT² = 4π² × (4.22 × 10⁸)³ ÷ (6.67 × 10⁻¹¹ × ({sf(1.77 * 86400)})²) = {sf(4 * pi ** 2 * 4.22e8 ** 3 / (6.67e-11 * (1.77 * 86400) ** 2))} kg',
  ['C1: T in seconds', 'C1: M = 4π²r³/GT²', 'C1: substitution'], aq='M')
N('M', 4, 'The Earth orbits the Sun once a year (3.16 × 10⁷ s) at 1.50 × 10¹¹ m. Use this to determine the mass of the Sun.' + GONLY, 4 * pi ** 2 * 1.5e11 ** 3 / (6.67e-11 * 3.16e7 ** 2), 'kg',
  f'M = 4π²r³/GT² = 4π² × (1.50 × 10¹¹)³ ÷ (6.67 × 10⁻¹¹ × (3.16 × 10⁷)²) = {sf(4 * pi ** 2 * 1.5e11 ** 3 / (6.67e-11 * 3.16e7 ** 2))} kg',
  ['C1: gravity provides centripetal force', 'C1: M = 4π²r³/GT²', 'C1: substitution'], aq='M')
M('M', 3, 'Two moons orbit the same planet. Moon P has period 2.0 days and moon Q has period 16 days. What is the ratio (orbit radius of Q)/(orbit radius of P)?', '4', ['8', '2', '64'], 'r ∝ T^(2/3): (16/2)^(2/3) = 8^(2/3) = 4.', ['C1: r³ ∝ T²', 'C1: 8^(2/3) = 4'])
N('M', 3, 'A planet of mass 4.0 × 10²⁴ kg has a moon with orbital period 25 days. Calculate the radius of the moon\'s orbit.' + GONLY, (6.67e-11 * 4e24 * (25 * 86400) ** 2 / (4 * pi ** 2)) ** (1 / 3), 'm',
  f'r = (GMT²/4π²)^(1/3) = (6.67 × 10⁻¹¹ × 4.0 × 10²⁴ × (25 × 86400)² ÷ (4π²))^(1/3) = {sf((6.67e-11 * 4e24 * (25 * 86400) ** 2 / (4 * pi ** 2)) ** (1 / 3))} m',
  ['C1: T in s', 'C1: r³ = GMT²/4π²', 'C1: cube root'], aq='r')
M('M', 3, 'Show which expression gives the orbital period of a satellite skimming the surface of a planet of radius R and uniform density ρ.', 'T = √(3π/Gρ)', ['T = 2πR√(ρ/G)', 'T = √(Gρ/3π)', 'T = 2π√(R/Gρ)'],
  'T² = 4π²R³/GM with M = ⁴⁄₃πR³ρ gives T² = 3π/(Gρ): the period depends only on density.', ['C1: M = ⁴⁄₃πR³ρ', 'C1: substitution into T² = 4π²R³/GM'])
N('M', 3, 'A planet of mean density 5500 kg m⁻³ is orbited by a satellite just above its surface. Calculate the period, using T = √(3π/Gρ).' + GONLY, sqrt(3 * pi / (6.67e-11 * 5500)), 's',
  f'T = √(3π ÷ (6.67 × 10⁻¹¹ × 5500)) = {sf(sqrt(3 * pi / (6.67e-11 * 5500)))} s', ['C1: formula', 'C1: substitution'], aq='T')
N('M', 4, 'A space station orbits at 420 km above the Earth\'s surface. Calculate how many complete orbits it makes in one day.' + EARTH, 86400 / (2 * pi * sqrt((6.37e6 + 4.2e5) ** 3 / GM_E)), None,
  f'r = 6.79 × 10⁶ m. T = 2π√(r³/GM) = 2π × √((6.79 × 10⁶)³ ÷ 3.98 × 10¹⁴) = {sf(2 * pi * sqrt(6.79e6 ** 3 / GM_E))} s. Orbits per day = 86400 ÷ {sf(2 * pi * sqrt(6.79e6 ** 3 / GM_E), 4)} = {sf(86400 / (2 * pi * sqrt(6.79e6 ** 3 / GM_E)))}',
  ['C1: r = R + h', 'C1: T = 2π√(r³/GM)', 'C1: 86 400/T'], aq='orbits', tol=0.02)
M('M', 3, 'Two planets orbit the same star. Planet A has twice the orbit radius of planet B. Which is correct about their speeds and periods?', 'A is slower by √2 and takes 2√2 times as long', ['A is faster by √2 and takes 2√2 times as long', 'A is slower by 2 and takes 4 times as long', 'A has the same speed and twice the period'],
  'v ∝ r^(−½): v_A = v_B/√2. T ∝ r^(3/2): T_A = 2^(3/2) T_B = 2√2 T_B.', ['C1: v ∝ r^(−1/2)', 'C1: T ∝ r^(3/2)'])
N('M', 3, 'The ratio T²/r³ for satellites of a particular planet is 9.9 × 10⁻¹⁴ s² m⁻³. Calculate the mass of the planet.' + GONLY, 4 * pi ** 2 / (6.67e-11 * 9.9e-14), 'kg',
  f'T²/r³ = 4π²/GM, so M = 4π² ÷ (G × T²/r³) = 4π² ÷ (6.67 × 10⁻¹¹ × 9.9 × 10⁻¹⁴) = {sf(4 * pi ** 2 / (6.67e-11 * 9.9e-14))} kg', ['C1: T²/r³ = 4π²/GM', 'C1: rearranged for M'], aq='M')
N('M', 4, 'A satellite orbits a moon of mass 7.35 × 10²² kg once every 2.0 hours. Calculate its orbital radius, and its height above the moon\'s surface (radius 1.74 × 10⁶ m). Give the height.' + GONLY, (6.67e-11 * 7.35e22 * 7200 ** 2 / (4 * pi ** 2)) ** (1 / 3) - 1.74e6, 'm',
  f'r = (GMT²/4π²)^(1/3) = (6.67 × 10⁻¹¹ × 7.35 × 10²² × 7200² ÷ (4π²))^(1/3) = {sf((6.67e-11 * 7.35e22 * 7200 ** 2 / (4 * pi ** 2)) ** (1 / 3))} m. Height = {sf((6.67e-11 * 7.35e22 * 7200 ** 2 / (4 * pi ** 2)) ** (1 / 3), 4)} − 1.74 × 10⁶ = {sf((6.67e-11 * 7.35e22 * 7200 ** 2 / (4 * pi ** 2)) ** (1 / 3) - 1.74e6)} m',
  ['C1: T in s', 'C1: cube-root formula', 'C1: subtract radius'], aq='h')
M('M', 3, 'A student derives T² = 4π²r³/GM. Which is the key physical assumption?', 'The gravitational force on the satellite provides exactly the centripetal force for a circular orbit', ['The satellite\'s mass is much larger than the planet\'s', 'There is a centrifugal force balancing gravity', 'The satellite moves at the escape speed'],
  'Setting GMm/r² = mω²r assumes a circular orbit with gravity as the only (centripetal) force, and that M ≫ m so the planet stays still.', ['C1: gravity = centripetal force', 'C1: circular orbit'])
N('M', 3, 'Neptune orbits the Sun at 30.1 times the Earth\'s orbit radius. Calculate its orbital period in Earth years.', 30.1 ** 1.5, 'years', f'T = 30.1^(3/2) = √(30.1³) = {sf(sqrt(30.1 ** 3))} years', ['C1: T² ∝ r³', 'C1: Earth as reference (1 year, 1 unit)'], aq='T')
N('M', 4, 'A moon has orbital radius 1.9 × 10⁸ m and period 3.5 days. A second moon of the same planet has period 14 days. Calculate the orbital radius of the second moon without using G.', 1.9e8 * 4 ** (2 / 3), 'm',
  f'r ∝ T^(2/3): r₂ = 1.9 × 10⁸ × (14 ÷ 3.5)^(2/3) = 1.9 × 10⁸ × 4^(2/3) = {sf(1.9e8 * 4 ** (2 / 3))} m', ['C1: T² ∝ r³', 'C1: ratio of periods = 4', 'C1: 4^(2/3)'], aq='r')
M('M', 4, 'Astronomers measure the period T and radius r of the orbits of several moons of a planet and plot lg T against lg r. What is the gradient of the line?', '1.5', ['2/3', '3', '2'], 'T = kr^(3/2), so lg T = 1.5 lg r + lg k: a straight line of gradient 1.5.', ['C1: T ∝ r^(3/2)', 'C1: logs give gradient = power', 'C1: 1.5'])
N('M', 3, 'A satellite in a 98-minute orbit is moved to an orbit with 4.0 times the period. By what factor does its orbital radius increase?', 4.0 ** (2 / 3), None, f'r ∝ T^(2/3): factor = 4.0^(2/3) = {sf(4 ** (2 / 3))}', ['C1: T² ∝ r³', 'C1: power 2/3'], aq='factor')
# hard
N('H', 6, 'Data for moons of a planet: moon A r = 1.0 × 10⁸ m, T = 1.0 × 10⁵ s; moon B r = 4.0 × 10⁸ m, T = 8.0 × 10⁵ s; moon C r = 9.0 × 10⁸ m, T = 2.7 × 10⁶ s. (a) Show that the data obey Kepler\'s third law. (b) Calculate T²/r³. (c) Calculate the mass of the planet. Give only the answer to (c).' + GONLY, 4 * pi ** 2 / (6.67e-11 * 1.0e10 / 1.0e24), 'kg',
  f'(a) T²/r³: A = (1.0 × 10⁵)² ÷ (1.0 × 10⁸)³ = 1.0 × 10⁻¹⁴, B = (8.0 × 10⁵)² ÷ (4.0 × 10⁸)³ = 1.0 × 10⁻¹⁴, C = (2.7 × 10⁶)² ÷ (9.0 × 10⁸)³ = 1.0 × 10⁻¹⁴ s² m⁻³: constant. (b) 1.0 × 10⁻¹⁴ s² m⁻³. (c) M = 4π² ÷ (G × T²/r³) = 4π² ÷ (6.67 × 10⁻¹¹ × 1.0 × 10⁻¹⁴) = {sf(4 * pi ** 2 / 6.67e-25)} kg',
  ['M1: T²/r³ for at least two moons', 'A1: constant', 'A1: value', 'C1: T²/r³ = 4π²/GM', 'C1: rearranged', 'A1: M'], aq='M')
N('H', 5, 'A satellite is to be placed in a circular orbit with period 6.0 hours. (a) Calculate its orbital radius. (b) Calculate its height above the surface. (c) Calculate its orbital speed. Give only the answer to (b).' + EARTH, (GM_E * 21600 ** 2 / (4 * pi ** 2)) ** (1 / 3) - 6.37e6, 'm',
  f'(a) T = 21600 s, r = (GMT²/4π²)^(1/3) = (3.98 × 10¹⁴ × 21600² ÷ (4π²))^(1/3) = {sf((GM_E * 21600 ** 2 / (4 * pi ** 2)) ** (1 / 3))} m. (b) h = {sf((GM_E * 21600 ** 2 / (4 * pi ** 2)) ** (1 / 3), 4)} − 6.37 × 10⁶ = {sf((GM_E * 21600 ** 2 / (4 * pi ** 2)) ** (1 / 3) - 6.37e6)} m. (c) v = 2πr/T = {sf(2 * pi * (GM_E * 21600 ** 2 / (4 * pi ** 2)) ** (1 / 3) / 21600)} m s⁻¹',
  ['C1: T in s', 'C1: r³ = GMT²/4π²', 'A1: r', 'A1: h', 'B1: v = 2πr/T'], aq='h')
N('H', 6, '(a) Starting from Newton\'s law of gravitation, derive T² = (4π²/GM)r³ for a circular orbit. (b) A distant star has a planet with orbital radius 7.5 × 10⁹ m and period 4.2 days. Calculate the mass of the star. (c) Express it as a multiple of the Sun\'s mass (1.99 × 10³⁰ kg). Give only the multiple in (c).' + GONLY, 4 * pi ** 2 * 7.5e9 ** 3 / (6.67e-11 * (4.2 * 86400) ** 2) / 1.99e30, None,
  f'(a) GMm/r² = mω²r and ω = 2π/T, so GM/r² = 4π²r/T² and T² = (4π²/GM)r³. (b) M = 4π²r³/GT² = 4π² × (7.5 × 10⁹)³ ÷ (6.67 × 10⁻¹¹ × (4.2 × 86400)²) = {sf(4 * pi ** 2 * 7.5e9 ** 3 / (6.67e-11 * (4.2 * 86400) ** 2))} kg. (c) multiple = {sf(4 * pi ** 2 * 7.5e9 ** 3 / (6.67e-11 * (4.2 * 86400) ** 2), 4)} ÷ 1.99 × 10³⁰ = {sf(4 * pi ** 2 * 7.5e9 ** 3 / (6.67e-11 * (4.2 * 86400) ** 2) / 1.99e30)}',
  ['M1: GMm/r² = mω²r', 'M1: ω = 2π/T', 'A1: T² = 4π²r³/GM', 'C1: T in s', 'A1: M', 'A1: multiple'], aq='multiple')
N('H', 5, 'A planet orbits a star with period 225 days at radius 1.08 × 10¹¹ m. A comet passes the same star in a nearly circular path at 2.7 × 10¹¹ m. (a) Calculate GM for the star from the planet\'s data. (b) Calculate the comet\'s period in days, if its path were circular. Give only the answer to (b).', 225 * (2.7 / 1.08) ** 1.5, 'days',
  f'(a) GM = 4π²r³/T² = 4π² × (1.08 × 10¹¹)³ ÷ (225 × 86400)² = {sf(4 * pi ** 2 * 1.08e11 ** 3 / (225 * 86400) ** 2)} N m² kg⁻¹. (b) T ∝ r^(3/2): T = 225 × (2.7 ÷ 1.08)^1.5 = {sf(225 * 2.5 ** 1.5)} days',
  ['C1: GM = 4π²r³/T²', 'A1: GM', 'C1: Kepler ratio', 'C1: power 3/2', 'A1: T'], aq='T')
N('H', 6, 'Two planets orbit a star. Planet X has period 1.0 year and radius 1.0 AU. Planet Y has period 8.0 years. (a) Calculate the orbit radius of Y in AU. (b) Calculate the ratio of their orbital speeds v_X/v_Y. (c) Explain why the planets\' masses are not needed. Give only the answer to (b).', 2.0, None,
  f'(a) r ∝ T^(2/3): r_Y = 8.0^(2/3) = 4.0 AU. (b) v = 2πr/T: v_X/v_Y = (1.0 ÷ 1.0) ÷ (4.0 ÷ 8.0) = 2.0. (c) T² = 4π²r³/GM depends only on the star\'s mass M; the planet\'s mass cancels.',
  ['C1: r ∝ T^(2/3)', 'A1: 4.0 AU', 'C1: v = 2πr/T', 'A1: ratio', 'B1: planet mass cancels', 'B1: only star mass M'], sig=2, aq='ratio')
N('H', 5, 'A student plots T² (in s²) against r³ (in m³) for four satellites of a planet and obtains a straight line through the origin with gradient 2.3 × 10⁻¹³ s² m⁻³. (a) Explain why the line passes through the origin. (b) Calculate the mass of the planet. (c) Calculate the period of a satellite at r = 5.0 × 10⁷ m. Give only the answer to (c).' + GONLY, sqrt(2.3e-13 * 5.0e7 ** 3), 's',
  f'(a) T² = (4π²/GM)r³ has no constant term. (b) M = 4π² ÷ (G × gradient) = 4π² ÷ (6.67 × 10⁻¹¹ × 2.3 × 10⁻¹³) = {sf(4 * pi ** 2 / (6.67e-11 * 2.3e-13))} kg. (c) T = √(2.3 × 10⁻¹³ × (5.0 × 10⁷)³) = {sf(sqrt(2.3e-13 * 1.25e23))} s',
  ['B1: T² ∝ r³ with no intercept', 'C1: gradient = 4π²/GM', 'A1: M', 'C1: T² = gradient × r³', 'A1: T'], aq='T')
N('H', 6, 'A binary star system: two equal stars, each of mass M, orbit their common centre at the ends of a diameter of a circle of radius r (so they are 2r apart). (a) Show that the force on each star is GM²/4r². (b) Show that T² = 16π²r³/GM. (c) For r = 1.5 × 10¹¹ m and T = 3.2 × 10⁷ s, calculate M. Give only the answer to (c).' + GONLY, 16 * pi ** 2 * 1.5e11 ** 3 / (6.67e-11 * 3.2e7 ** 2), 'kg',
  f'(a) Separation 2r: F = GM·M/(2r)² = GM²/4r². (b) GM²/4r² = Mω²r = M(4π²/T²)r, so T² = 16π²r³/GM. (c) M = 16π²r³/(GT²) = 16π² × (1.5 × 10¹¹)³ ÷ (6.67 × 10⁻¹¹ × (3.2 × 10⁷)²) = {sf(16 * pi ** 2 * 1.5e11 ** 3 / (6.67e-11 * 3.2e7 ** 2))} kg',
  ['M1: separation 2r', 'A1: GM²/4r²', 'M1: equated to Mω²r', 'A1: T² expression', 'C1: rearranged', 'A1: M'], aq='M')

lesson('17.6')
M('M', 3, 'Kepler found that for the planets, T²/r³ has the same value. A newly discovered dwarf planet has an orbit radius 40 times the Earth\'s. Which period is closest?', '250 years', ['40 years', '1600 years', '6.3 years'],
  'T = 40^(3/2) years = √(64 000) ≈ 253 years.', ['C1: T² ∝ r³ relative to the Earth', 'C1: 40^1.5'])

# ═════════════════════════ 17.7 Orbiting the Earth ═════════════════════════
lesson('17.7')
M('E', 1, 'Which is NOT a requirement for a geostationary orbit?', 'The satellite must have a mass of exactly 1000 kg', ['The orbit must be above the Equator', 'The period must equal the Earth\'s rotation period (about 24 h)', 'The satellite must move in the same direction as the Earth rotates'],
  'Geostationary: equatorial, period one sidereal day, moving west to east. The orbit does not depend on the satellite\'s mass.')
M('E', 1, 'Why are geostationary satellites useful for satellite television?', 'They stay above the same point on the Earth, so dishes need not track them', ['They are close to the Earth, giving strong signals', 'They pass over the poles, covering the whole Earth', 'They move faster than the Earth rotates'],
  'A geostationary satellite has the same angular speed as the Earth, so it appears fixed in the sky and a fixed dish can point at it.')
M('E', 1, 'A polar-orbiting satellite passes over both poles. Why is this orbit useful for Earth observation?', 'The Earth rotates beneath it, so over successive orbits it can view every part of the surface', ['It stays above one point on the Equator', 'It is always in sunlight', 'It never passes over the oceans'],
  'Each orbit passes over a different strip of the Earth as the planet rotates underneath, so the whole surface is mapped in a day or so.')
M('E', 1, 'Astronauts on the International Space Station float freely. What is the correct explanation?', 'They and the station are in free fall around the Earth, with the same acceleration', ['There is no gravity at the ISS', 'The station\'s engines cancel gravity', 'The astronauts are too far away to feel the Earth\'s pull'],
  'Gravity at 400 km is about 90 % of its surface value. Everything in the station accelerates towards the Earth at the same rate, so there is no contact force and the astronauts feel weightless.')
M('E', 1, 'Low Earth orbit satellites have periods of about 90 minutes. What is the approximate period of a geostationary satellite?', '24 hours', ['90 minutes', '12 hours', '27 days'],
  'A geostationary satellite must keep pace with the Earth\'s rotation: one orbit per (sidereal) day, about 24 h.')
N('E', 2, 'A geostationary satellite orbits at 4.22 × 10⁷ m from the Earth\'s centre. Calculate its height above the surface.' + ' Earth\'s radius = 6.37 × 10⁶ m.', 4.22e7 - 6.37e6, 'm', f'h = r − R = 4.22 × 10⁷ − 6.37 × 10⁶ = {sf(4.22e7 - 6.37e6)} m', ['C1: h = r − R'], aq='h')
N('E', 2, 'Calculate the speed of a geostationary satellite, orbit radius 4.22 × 10⁷ m, period 86 164 s.', 2 * pi * 4.22e7 / 86164, 'm s⁻¹', f'v = 2πr/T = 2π × 4.22 × 10⁷ ÷ 86164 = {sf(2 * pi * 4.22e7 / 86164)} m s⁻¹', ['C1: v = 2πr/T'], aq='v')
N('E', 2, 'A satellite in low Earth orbit is 500 km above the surface. Calculate its distance from the Earth\'s centre. Earth\'s radius = 6.37 × 10⁶ m.', 6.87e6, 'm', 'r = R + h = 6.37 × 10⁶ + 5.0 × 10⁵ = 6.87 × 10⁶ m', ['C1: r = R + h'], aq='r')
M('E', 1, 'A ground station sees a geostationary satellite. In which direction does the satellite appear to move across the sky?', 'It does not move: it stays in the same position', ['East to west once a day', 'West to east once a day', 'North to south every 90 minutes'], 'It turns with the Earth, so relative to an observer on the ground it is stationary.')
M('E', 1, 'Signals to a geostationary satellite and back take a noticeable time. Approximately how long does a signal take to go up and down again (straight above the transmitter)?', '0.24 s', ['0.0024 s', '2.4 s', '24 s'], 'The height is about 3.6 × 10⁷ m. Distance up and down ≈ 7.2 × 10⁷ m, time = 7.2 × 10⁷ ÷ 3.0 × 10⁸ ≈ 0.24 s.')
N('E', 2, 'Calculate the time for a radio signal to travel from the ground to a geostationary satellite directly overhead, 3.58 × 10⁷ m above the surface.' + take('c'), 3.58e7 / 3.0e8, 's', f't = d/c = 3.58 × 10⁷ ÷ 3.00 × 10⁸ = {sf(3.58e7 / 3e8)} s', ['C1: t = d/c'], aq='t')
M('E', 1, 'What is the direction of motion of a geostationary satellite?', 'West to east, the same way the Earth rotates', ['East to west', 'North to south', 'It has no motion'], 'To stay above the same point it must move round in the same sense as the Earth spins: west to east.')
M('E', 1, 'Which of these satellites would most likely be in a low polar orbit?', 'A weather-mapping and imaging satellite', ['A satellite TV broadcaster', 'A communications relay for a fixed dish', 'A satellite parked at the Earth–Sun balance point'], 'Low polar orbits give high-resolution views of the whole globe as the Earth turns underneath.')
N('E', 2, 'A polar satellite takes 100 minutes per orbit. How many orbits does it complete in one day?', 1440 / 100, None, 'orbits per day = 1440 ÷ 100 = 14.4', ['C1: minutes in a day ÷ period'], aq='orbits')
M('E', 1, 'A satellite in a circular orbit is at a height of 300 km. What is the main reason it eventually falls to Earth unless boosted?', 'Drag from the very thin upper atmosphere removes energy', ['Gravity at that height increases over time', 'Its engines run out of fuel, so it stops orbiting', 'The Moon pulls it down'],
  'Even at 300 km there is a tiny amount of air. Drag removes energy, the orbit shrinks, and eventually the satellite re-enters.')
N('E', 2, 'An astronaut has mass 75 kg. On the ISS, where g = 8.7 N kg⁻¹, calculate the gravitational force on the astronaut.', 75 * 8.7, 'N', f'F = mg = 75 × 8.7 = {sf(652.5)} N — not zero, even though the astronaut feels weightless.', ['C1: F = mg with g at the orbit'], aq='F')
N('E', 2, 'The ISS orbits 6.79 × 10⁶ m from the Earth\'s centre at 7.66 km s⁻¹. Calculate the time for one orbit in minutes.', 2 * pi * 6.79e6 / 7660 / 60, 'minutes', f'T = 2πr/v = 2π × 6.79 × 10⁶ ÷ 7660 = {sf(2 * pi * 6.79e6 / 7660)} s. In minutes: {sf(2 * pi * 6.79e6 / 7660, 4)} ÷ 60 = {sf(2 * pi * 6.79e6 / 7660 / 60)}', ['C1: T = 2πr/v'], aq='T')
# medium
r = (GM_E * 86164 ** 2 / (4 * pi ** 2)) ** (1 / 3)
N('M', 3, 'Show that the radius of a geostationary orbit is about 4.2 × 10⁷ m, using a sidereal day of 86 164 s.' + EARTH + ' Give your value.', r, 'm',
  f'r = (GMT²/4π²)^(1/3) = (3.98 × 10¹⁴ × 86164² ÷ (4π²))^(1/3) = {sf(r)} m', ['C1: GMm/r² = mω²r', 'C1: r³ = GMT²/4π²', 'C1: substitution and cube root'], aq='r')
N('M', 3, 'Calculate the gravitational field strength at a geostationary orbit, radius 4.22 × 10⁷ m, and compare it with g at the surface. Give the field strength.' + EARTH, GM_E / 4.22e7 ** 2, 'N kg⁻¹',
  f'g = GM/r² = 3.98 × 10¹⁴ ÷ (4.22 × 10⁷)² = {sf(GM_E / 4.22e7 ** 2)} N kg⁻¹, about 1/44 of the surface value.', ['C1: g = GM/r²', 'C1: substitution', 'B1: comparison'], aq='g')
M('M', 3, 'A geostationary satellite drifts slightly lower than the correct orbit radius. What happens to it, as seen from the ground?', 'It slowly drifts eastwards, because its period is now slightly less than a day', ['It slowly drifts westwards', 'It stays fixed overhead', 'It falls straight down'],
  'A lower orbit has a shorter period (T ∝ r^(3/2)), so the satellite gets ahead of the rotating Earth and appears to move east.', ['C1: lower orbit, shorter period', 'C1: moves ahead of the Earth (east)'])
N('M', 4, 'A satellite in a low circular orbit 350 km above the Earth passes overhead. Calculate its orbital speed and period. Give the period in minutes.' + EARTH, 2 * pi * sqrt(6.72e6 ** 3 / GM_E) / 60, 'minutes',
  f'r = 6.72 × 10⁶ m. v = √(GM/r) = √(3.98 × 10¹⁴ ÷ 6.72 × 10⁶) = {sf(sqrt(GM_E / 6.72e6))} m s⁻¹. T = 2πr/v = 2π × 6.72 × 10⁶ ÷ {sf(sqrt(GM_E / 6.72e6), 4)} = {sf(2 * pi * sqrt(6.72e6 ** 3 / GM_E))} s. In minutes: {sf(2 * pi * sqrt(6.72e6 ** 3 / GM_E), 4)} ÷ 60 = {sf(2 * pi * sqrt(6.72e6 ** 3 / GM_E) / 60)}',
  ['C1: r = R + h', 'C1: v = √(GM/r)', 'C1: T = 2πr/v'], aq='T')
M('M', 3, 'Why must a geostationary satellite be above the Equator?', 'The centre of its circular orbit must be the Earth\'s centre, and only an equatorial orbit keeps it over one point as the Earth spins', ['Gravity is strongest over the Equator', 'The Equator is closest to the Sun', 'Signals cannot reach the poles'],
  'Any orbit is centred on the Earth\'s centre. An inclined orbit would carry the satellite north and south of the Equator each day, so it could not stay above one point.', ['C1: orbit centred on Earth\'s centre', 'C1: inclined orbit oscillates north–south'])
T15 = 86164 / 15; r15 = (GM_E * T15 ** 2 / (4 * pi ** 2)) ** (1 / 3)
N('M', 4, 'An Earth-observation satellite is designed to make exactly 15 orbits per sidereal day (86 164 s). Calculate its orbital radius and its height above the surface. Give the height.' + EARTH, r15 - 6.37e6, 'm',
  f'T = 86164 ÷ 15 = {sf(T15)} s. r = (GMT²/4π²)^(1/3) = (3.98 × 10¹⁴ × {sf(T15, 4)}² ÷ (4π²))^(1/3) = {sf(r15)} m. Height = {sf(r15, 4)} − 6.37 × 10⁶ = {sf(r15 - 6.37e6)} m',
  ['C1: T = day/15', 'C1: r from Kepler/Newton', 'C1: h = r − R'], aq='h')
M('M', 3, 'An astronaut on the ISS drops a pen. Which describes what happens?', 'The pen floats beside the astronaut because both are falling around the Earth at the same rate', ['The pen falls to the floor at 8.7 m s⁻²', 'The pen flies upward', 'The pen falls slowly because gravity is weak'],
  'The pen, astronaut and station all have the same acceleration (g at that height) towards the Earth, so relative to the station the pen stays put.', ['C1: everything has the same acceleration', 'C1: no relative motion'])
N('M', 3, 'A 120 kg satellite is in a geostationary orbit (r = 4.22 × 10⁷ m). Calculate the gravitational force on it.' + EARTH, 6.67e-11 * 5.97e24 * 120 / 4.22e7 ** 2, 'N',
  f'F = GMm/r² = 6.67 × 10⁻¹¹ × 5.97 × 10²⁴ × 120 ÷ (4.22 × 10⁷)² = {sf(GM_E * 120 / 4.22e7 ** 2)} N', ['C1: F = GMm/r²', 'C1: r from centre'], aq='F')
M('M', 3, 'Why do most satellite launches from the ground head eastwards?', 'They gain the Earth\'s rotational speed (up to about 465 m s⁻¹ at the Equator)', ['The air is thinner to the east', 'Gravity is weaker to the east', 'East is towards the Sun'],
  'The launch site already moves east with the rotating Earth, so launching east reduces the extra speed the rocket must supply.', ['C1: Earth\'s surface moves east', 'C1: less extra speed needed'])
N('M', 4, 'A geostationary satellite is directly above a ground station on the Equator. A phone call relayed by it travels ground → satellite → ground, then the reply comes back the same way. Calculate the delay between speaking and hearing the reply, due to the signal travel time. Height = 3.58 × 10⁷ m.' + take('c'), 4 * 3.58e7 / 3.0e8, 's',
  f'Total path = 4 × 3.58 × 10⁷ = {sf(4 * 3.58e7)} m. t = {sf(1.432e8)} ÷ 3.00 × 10⁸ = {sf(1.432e8 / 3e8)} s', ['C1: four legs', 'C1: t = d/c', 'C1: substitution'], aq='t')
N('M', 3, 'At what height above the Earth\'s surface would a satellite have an orbital period of 2.0 hours?' + EARTH, (GM_E * 7200 ** 2 / (4 * pi ** 2)) ** (1 / 3) - 6.37e6, 'm',
  f'r = (3.98 × 10¹⁴ × 7200² ÷ (4π²))^(1/3) = {sf((GM_E * 7200 ** 2 / (4 * pi ** 2)) ** (1 / 3))} m. h = {sf((GM_E * 7200 ** 2 / (4 * pi ** 2)) ** (1 / 3), 4)} − 6.37 × 10⁶ = {sf((GM_E * 7200 ** 2 / (4 * pi ** 2)) ** (1 / 3) - 6.37e6)} m',
  ['C1: T in s', 'C1: r³ = GMT²/4π²', 'C1: h = r − R'], aq='h')
M('M', 4, 'Two satellites are in circular orbits: S₁ geostationary, S₂ in a low polar orbit. Which row is correct?', 'S₁ has the longer period and lower speed; S₂ has the stronger gravitational field acting on it per kg', ['S₁ has the shorter period and higher speed', 'Both have the same speed', 'S₂ has the longer period because it travels over the poles'],
  'Higher orbit: longer period (T ∝ r^1.5), lower speed (v ∝ r^−0.5), weaker g (∝ 1/r²). S₁ is much higher than S₂.', ['C1: T ∝ r^1.5', 'C1: v ∝ r^−0.5', 'C1: g ∝ 1/r²'])
M('M', 3, 'An astronaut of mass 80 kg sits on bathroom scales in a spacecraft in orbit. What do the scales read?', 'Zero, because the astronaut and scales fall together and press on each other with no force', ['784 N, the astronaut\'s weight on Earth', 'About 700 N, the weight at orbital height', 'A negative reading, because of centrifugal force'],
  'Scales measure the contact force. In orbit both the scales and the astronaut accelerate at g, so there is no contact force and the reading is zero, even though gravity still pulls on the astronaut.', ['C1: scales measure contact force', 'C1: both in free fall'])
N('M', 4, 'A satellite is in a circular orbit of radius 2.66 × 10⁷ m (a GPS orbit). Calculate its period in hours and the number of orbits it makes per day.' + EARTH + ' Give the period in hours.', 2 * pi * sqrt(2.66e7 ** 3 / GM_E) / 3600, 'h',
  f'T = 2π√(r³/GM) = 2π × √((2.66 × 10⁷)³ ÷ 3.98 × 10¹⁴) = {sf(2 * pi * sqrt(2.66e7 ** 3 / GM_E))} s. In hours: {sf(2 * pi * sqrt(2.66e7 ** 3 / GM_E), 4)} ÷ 3600 = {sf(2 * pi * sqrt(2.66e7 ** 3 / GM_E) / 3600)} — about two orbits per day.',
  ['C1: T = 2π√(r³/GM)', 'C1: convert to hours', 'C1: orbits per day'], aq='T')
M('M', 3, 'A satellite in a low orbit fires its engine briefly to move into a higher circular orbit. Which change happens once it is in the new orbit?', 'Its kinetic energy is smaller, its potential energy larger and its total energy larger', ['Its kinetic energy is larger', 'Its total energy is smaller', 'All its energies are unchanged'],
  'Higher circular orbit: v is smaller, so Ek = GMm/2r is smaller; Ep = −GMm/r is less negative; total E = −GMm/2r is less negative, i.e. larger (the engine did work).', ['C1: Ek ∝ 1/r', 'C1: E = −GMm/2r increases'])
N('M', 3, 'A satellite orbiting just above the Moon\'s surface (radius 1.74 × 10⁶ m, g = 1.62 N kg⁻¹) needs what orbital speed? Use v = √(gR).', sqrt(1.62 * 1.74e6), 'm s⁻¹', f'v = √(gR) = √(1.62 × 1.74 × 10⁶) = {sf(sqrt(1.62 * 1.74e6))} m s⁻¹', ['C1: mg = mv²/R', 'C1: substitution'], aq='v')
N('M', 4, 'Calculate the minimum number of geostationary satellites needed so that every point on the Equator can see at least one, given that a satellite at radius 4.22 × 10⁷ m can see the Equator over an angle of 2 cos⁻¹(R/r) at the Earth\'s centre (R = 6.37 × 10⁶ m). Give the angle in degrees.', 2 * degrees(acos(6.37e6 / 4.22e7)), '°',
  f'R/r = 6.37 × 10⁶ ÷ 4.22 × 10⁷ = {sf(6.37e6 / 4.22e7)}. Angle = 2 cos⁻¹ {sf(6.37e6 / 4.22e7)} = {sf(2 * degrees(acos(6.37e6 / 4.22e7)))}°, so 360 ÷ 163 → at least 3 satellites.',
  ['C1: R/r', 'C1: inverse cosine', 'B1: 3 satellites'], aq='angle')
# hard
N('H', 6, 'A telecommunications company plans a geostationary satellite. (a) State three properties of a geostationary orbit. (b) Use Newton\'s law of gravitation and circular motion to derive r³ = GMT²/4π². (c) Calculate the orbital height above the surface. Give only the answer to (c).' + EARTH, r - 6.37e6, 'm',
  f'(a) Equatorial; period equal to the Earth\'s rotation period (≈ 24 h); moving west to east. (b) GMm/r² = mω²r = m(4π²/T²)r, so r³ = GMT²/4π². (c) r = (3.98 × 10¹⁴ × 86164² ÷ (4π²))^(1/3) = {sf(r)} m, h = {sf(r, 4)} − 6.37 × 10⁶ = {sf(r - 6.37e6)} m',
  ['B1: equatorial', 'B1: 24 h period and same direction', 'M1: GMm/r² = mω²r', 'A1: r³ = GMT²/4π²', 'C1: substitution', 'A1: h'], aq='h')
N('H', 5, 'A satellite of mass 1200 kg is moved from a low orbit (radius 6.80 × 10⁶ m) to a geostationary orbit (radius 4.22 × 10⁷ m). (a) Calculate its total orbital energy in each orbit, using E = −GMm/2r. (b) Calculate the energy that must be supplied. Give only the answer to (b).' + EARTH, GM_E * 1200 / 2 * (1 / 6.80e6 - 1 / 4.22e7), 'J',
  f'(a) E₁ = −3.98 × 10¹⁴ × 1200 ÷ (2 × 6.80 × 10⁶) = {sf(-GM_E * 1200 / 1.36e7)} J. E₂ = −3.98 × 10¹⁴ × 1200 ÷ (2 × 4.22 × 10⁷) = {sf(-GM_E * 1200 / 8.44e7)} J. (b) ΔE = E₂ − E₁ = {sf(-GM_E * 1200 / 8.44e7, 4)} − ({sf(-GM_E * 1200 / 1.36e7, 4)}) = {sf(GM_E * 600 * (1 / 6.8e6 - 1 / 4.22e7))} J',
  ['C1: E = −GMm/2r', 'A1: E₁', 'A1: E₂', 'C1: ΔE = E₂ − E₁', 'A1: energy'], aq='ΔE')
N('H', 7, 'An astronaut on the ISS (orbit radius 6.79 × 10⁶ m) says she feels weightless. (a) Calculate g at the ISS. (b) Express it as a percentage of the surface value (9.81 N kg⁻¹). (c) Calculate the station\'s centripetal acceleration from its speed of 7.66 km s⁻¹, and use it to explain the weightlessness. Give only the percentage in (b).' + EARTH, GM_E / 6.79e6 ** 2 / 9.81 * 100, '%',
  f'(a) g = GM/r² = 3.98 × 10¹⁴ ÷ (6.79 × 10⁶)² = {sf(GM_E / 6.79e6 ** 2)} N kg⁻¹. (b) Percentage = {sf(GM_E / 6.79e6 ** 2)} ÷ 9.81 × 100 = {sf(GM_E / 6.79e6 ** 2 / 9.81 * 100)} %. (c) a = v²/r = 7660² ÷ 6.79 × 10⁶ = {sf(7660 ** 2 / 6.79e6)} m s⁻², equal to g: the station and the astronaut fall freely together, so there is no contact force and she feels weightless.',
  ['C1: g = GM/r²', 'A1: g', 'A1: percentage', 'C1: a = v²/r', 'A1: a ≈ g', 'B1: free fall together', 'B1: no contact force'], aq='percentage')

lesson('17.7')
N('M', 3, 'A satellite moves in a circular orbit 1200 km above the Earth\'s surface. Calculate the gravitational field strength at the orbit and hence the satellite\'s centripetal acceleration.' + EARTH, GM_E / 7.57e6 ** 2, 'm s⁻²',
  f'r = 6.37 × 10⁶ + 1.2 × 10⁶ = 7.57 × 10⁶ m. a = g = GM/r² = 3.98 × 10¹⁴ ÷ (7.57 × 10⁶)² = {sf(GM_E / 7.57e6 ** 2)} m s⁻²', ['C1: r = R + h', 'C1: g = GM/r²', 'B1: centripetal acceleration = g'], aq='a')
N('H', 5, 'A satellite in a low circular orbit at radius 6.70 × 10⁶ m has a speed of 7.71 km s⁻¹. (a) Calculate its period. (b) An observer on the Equator sees it pass overhead. Explain why the time until it is next overhead is longer than its period, if it orbits in the same direction as the Earth spins. (c) Calculate that time, given that the Earth turns at 7.29 × 10⁻⁵ rad s⁻¹. Give only the answer to (c).', 2 * pi / (7710 / 6.70e6 - 7.29e-5), 's',
  f'(a) T = 2πr/v = 2π × 6.70 × 10⁶ ÷ 7710 = {sf(2 * pi * 6.7e6 / 7710)} s. (b) The observer is carried round in the same direction, so the satellite must go a little more than one full orbit to catch up. (c) Relative angular speed = v/r − ω_E = 7710 ÷ 6.70 × 10⁶ − 7.29 × 10⁻⁵ = {sf(7710 / 6.7e6 - 7.29e-5)} rad s⁻¹, t = 2π ÷ {sf(7710 / 6.7e6 - 7.29e-5, 4)} = {sf(2 * pi / (7710 / 6.7e6 - 7.29e-5))} s',
  ['C1: T = 2πr/v', 'A1: T', 'B1: observer moves in the same direction', 'C1: relative angular speed', 'A1: t'], aq='t')
