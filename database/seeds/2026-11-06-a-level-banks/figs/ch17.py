# Figures for ch17.py (Chapter 17 gravitational fields). Numbers come from the stems.
RE = 6.37e6

# ── 17.1 ──
F('Two stars P and Q of equal mass are a distance d apart. Where is the resultant gravitational field strength', lambda s: bodies(
    'Two equal stars', 'Two stars P and Q of equal mass a distance d apart.', [(0, 0, 16, 'P'), (10, 0, 16, 'Q')], dims=[(0, -2.0, 10, -2.0, 'd', -1)]))
F('At a point P, the gravitational field of planet A is 3.0 N kg⁻¹ due north', lambda s: vectors(
    'Two fields at P', 'Vector diagram at P (north up the page): planet A gives 3.0 N kg⁻¹ due north and planet B gives 4.0 N kg⁻¹ due east.',
    [(0, 3.0 * 35, '3.0 N kg⁻¹ north (A)', ACC, True), (4.0 * 35, 0, '4.0 N kg⁻¹ east (B)', ACC2, True)], origin=(70, 180), w=380, h=230))
F('A GPS satellite orbits at 2.0 × 10⁷ m above the Earth\'s surface', lambda s: planet_orbits(
    'GPS satellite orbit', 'The Earth (radius 6.37 × 10⁶ m) and the circular orbit of a GPS satellite 2.0 × 10⁷ m above the surface, drawn to scale.',
    RE, [dict(r=RE + grab(s, r'orbits at ([\d.]+ × 10⁷) m'), height_label='2.0 × 10⁷ m')], planet_label='Earth'))
F('A spacecraft travels from the Earth (mass 5.97 × 10²⁴ kg) to the Moon (mass 7.35 × 10²² kg)', lambda s: bodies(
    'Earth and Moon', 'The Earth (5.97 × 10²⁴ kg) and the Moon (7.35 × 10²² kg) with centres 3.84 × 10⁸ m apart; somewhere between them the resultant field is zero.',
    [(0, 0, 22, 'Earth'), (3.84, 0, 8, 'Moon')], dims=[(0, -0.6, 3.84, -0.6, '3.84 × 10⁸ m', -1)]))
F('A table gives the gravitational field strength g at distances r from the centre of a planet', lambda s: (lambda pts: table_plot(
    ['r / R', 'g / N kg⁻¹'], [[r, g] for r, g in pts], 'Field strength against distance',
    'Table and graph of g against distance from the centre of a planet, in planet radii R: g = 9.8 N kg⁻¹ at 1.0R, 2.45 at 2.0R, 1.09 at 3.0R and so on, falling steeply.',
    dict(xlabel='r / R', ylabel='g / N kg⁻¹', series=[dict(x=[float(r) for r, _ in pts], y=[float(g) for _, g in pts], kind='points')],
         xr=(0, max(float(r) for r, _ in pts) + 0.5), yr=(0, 11), xticks=[0, 1, 2, 3, 4], yticks=[0, 2, 4, 6, 8, 10], h=250)))(
    re.findall(r'r = ([\d.]+)R, g = ([\d.]+) N', s)))
F('Two identical stars, each of mass 2.0 × 10³⁰ kg, are 4.0 × 10¹¹ m apart. Point P is on the perpendicular bisector', lambda s: bodies(
    'Two stars and a point P', 'Two identical stars of mass 2.0 × 10³⁰ kg, 4.0 × 10¹¹ m apart. Point P lies on the perpendicular bisector of the line joining them, 1.5 × 10¹¹ m from the midpoint.',
    [(-2.0, 0, 14, 'star'), (2.0, 0, 14, 'star')], points=[(0, 1.5, 'P')], dims=[(-2.0, -0.6, 2.0, -0.6, '4.0 × 10¹¹ m', -1), (0.25, 0, 0.25, 1.5, '1.5 × 10¹¹ m', 1)]))

# ── 17.2 ──
F('A satellite orbits at a height of 6.37 × 10⁶ m above the Earth\'s surface (one Earth radius)', lambda s: planet_orbits(
    'Satellite one Earth radius up', 'The Earth (radius 6.37 × 10⁶ m) and a satellite orbiting 6.37 × 10⁶ m above the surface, so its orbit radius is two Earth radii.',
    RE, [dict(r=2 * RE, height_label='6.37 × 10⁶ m')], planet_label='Earth'))
F('At the surface of a planet of radius R, g = 12.0 N kg⁻¹. Calculate g at a height of 0.50R above the surface', lambda s: planet_orbits(
    'Point above a planet', 'A planet of radius R with surface field strength 12.0 N kg⁻¹, and a point at a height of 0.50R above the surface (1.5R from the centre).',
    1.0, [dict(r=1.5, height_label='0.50R', sat=False, dash='4 3')], planet_label='radius R'))
F('The Moon\'s mass is 1/81 of the Earth\'s. Their centres are 3.84 × 10⁸ m apart', lambda s: bodies(
    'Earth and Moon', 'The Earth and the Moon (mass 1/81 of the Earth\'s) with centres 3.84 × 10⁸ m apart.',
    [(0, 0, 22, 'Earth'), (3.84, 0, 8, 'Moon')], dims=[(0, -0.6, 3.84, -0.6, '3.84 × 10⁸ m', -1)]))
F('A probe records g at different distances r from the centre of the Earth', lambda s: (lambda pts: plot(
    'r / 10⁷ m', 'g / N kg⁻¹', [dict(x=[r for r, _ in pts], y=[g for _, g in pts], kind='points')], 'Field strength against distance',
    'Graph of the probe readings of g against distance from the Earth\'s centre, falling steeply as r increases.',
    xr=(0, 4.4), yr=(0, 9), xticks=[0, 1, 2, 3, 4], yticks=[0, 2, 4, 6, 8]))(
    [(grab(m[0] + ' m', r'(.+) m') / 1e7, float(m[1])) for m in re.findall(r'r = ([\d.]+ × 10⁷) m, g = ([\d.]+) N', s)]))
F('Two stars orbit their common centre. Star A has mass 3.0 × 10³⁰ kg and star B has mass 1.0 × 10³⁰ kg', lambda s: bodies(
    'Binary stars', 'Star A (3.0 × 10³⁰ kg) and star B (1.0 × 10³⁰ kg), centres 2.0 × 10¹¹ m apart, orbiting their common centre C.',
    [(0, 0, 18, 'A'), (2.0, 0, 11, 'B')], points=[(0.5, 0, 'C', 'below')], dims=[(0, -0.4, 2.0, -0.4, '2.0 × 10¹¹ m', -1)]))

# ── 17.3 ──
F('A 1500 kg satellite is moved from a circular orbit of radius 7.0 × 10⁶ m to one of radius 4.2 × 10⁷ m', lambda s: planet_orbits(
    'Changing orbit', 'The Earth and two circular orbits drawn to scale: the inner orbit of radius 7.0 × 10⁶ m and the outer orbit of radius 4.2 × 10⁷ m.',
    RE, [dict(r=7.0e6, label='7.0 × 10⁶ m'), dict(r=4.2e7, label='4.2 × 10⁷ m', dash='6 4')], planet_label='', sat_angle=60))
F('A graph of the gravitational potential energy Ep of a 1.0 kg mass against distance r from the centre of a planet is a curve', lambda s: (lambda pts: plot(
    'r / 10⁷ m', 'Ep / 10⁷ J', [dict(x=[r for r, _ in pts], y=[e for _, e in pts], kind='points')], 'Potential energy against distance',
    'Graph of the gravitational potential energy of a 1.0 kg mass against distance from the planet\'s centre: the values are negative and approach zero as r increases.',
    xr=(0, max(r for r, _ in pts) + 0.5), yr=(-4.5, 0), xticks=[0, 1, 2, 3, 4, 5], yticks=[-4, -3, -2, -1, 0]))(
    [(grab(m[0] + ' m', r'(.+) m') / 1e7, -grab(m[1] + ' J', r'(.+) J') / 1e7) for m in re.findall(r'r = ([\d.]+ × 10⁷) m, Ep = −([\d.]+ × 10⁷) J', s)]))

# ── 17.4 ──
F('A gravitational potential–distance graph for a planet has a tangent at r = 1.5 × 10⁷ m with gradient 1.8 J kg⁻¹ m⁻¹', lambda s: (lambda r0, gr: (lambda GM: plot(
    'r / 10⁷ m', 'φ / 10⁷ J kg⁻¹', [dict(x=wave_xy(lambda r: r, 0.5, 4.0)[0], y=[-GM / (r * 1e7) / 1e7 for r in wave_xy(lambda r: r, 0.5, 4.0)[0]]),
                                    dict(x=[r0 / 1e7 - 0.9, r0 / 1e7 + 0.9], y=[(-GM / r0 - gr * 0.9e7) / 1e7, (-GM / r0 + gr * 0.9e7) / 1e7], color=ACC2, dash='5 4')],
    'Potential against distance', 'Graph of gravitational potential against distance from the planet\'s centre, with a dashed tangent at r = 1.5 × 10⁷ m of gradient 1.8 J kg⁻¹ m⁻¹.',
    xr=(0, 4.0), yr=(-8.5, 0), xticks=[0, 1, 2, 3, 4], yticks=[-8, -6, -4, -2, 0]))(gr * r0 ** 2))(
    grab(s, r'tangent at r = ([\d.]+ × 10⁷) m'), grab(s, r'gradient ([\d.]+) J')))
F('Equipotentials around a planet are drawn at −8.0, −6.0, −4.0 and −2.0 MJ kg⁻¹', lambda s: equipotentials(
    'Equipotentials', 'Equipotential surfaces around a planet at −8.0, −6.0, −4.0 and −2.0 MJ kg⁻¹, drawn with radii proportional to 1/|φ|, so they get further apart going outwards.',
    [-8.0, -6.0, -4.0, -2.0], ['−8.0', '−6.0', '−4.0', '−2.0 MJ kg⁻¹']))
F('A spacecraft is at rest at the point between the Earth and Moon where the resultant field is zero', lambda s: bodies(
    'Neutral point', 'The spacecraft at the point between the Earth and the Moon where the resultant field is zero: 3.46 × 10⁸ m from the Earth\'s centre and 3.8 × 10⁷ m from the Moon\'s.',
    [(0, 0, 22, 'Earth'), (3.84, 0, 8, 'Moon')], points=[(3.46, 0, 'spacecraft', 'below')], dims=[(0, -0.7, 3.46, -0.7, '3.46 × 10⁸ m', -1), (3.46, 0.55, 3.84, 0.55, '3.8 × 10⁷ m', 1)]))
F('A student plots φ against 1/r for a planet using: 1/r = 1.0 × 10⁻⁷ m⁻¹', lambda s: (lambda pts: plot(
    '(1/r) / 10⁻⁷ m⁻¹', 'φ / 10⁷ J kg⁻¹', [dict(x=[a for a, _ in pts], y=[b for _, b in pts], kind='points')], 'φ against 1/r',
    'Graph of gravitational potential against 1/r: the points lie on a straight line through the origin with negative gradient.',
    xr=(0, 4), yr=(-10, 0), xticks=[0, 1, 2, 3, 4], yticks=[-10, -8, -6, -4, -2, 0]))(
    [(grab(a + ' x', r'(.+) x') / 1e-7, -grab(b + ' x', r'(.+) x') / 1e7) for a, b in re.findall(r'1/r = ([\d.]+ × 10⁻⁷) m⁻¹, φ = −([\d.]+ × 10⁷) J', s)]))
F('Two stars, each of mass 3.0 × 10³⁰ kg, are 6.0 × 10¹¹ m apart', lambda s: bodies(
    'Two equal stars', 'Two stars, each of mass 3.0 × 10³⁰ kg, 6.0 × 10¹¹ m apart, with M the midpoint between them.',
    [(0, 0, 14, 'star'), (6.0, 0, 14, 'star')], points=[(3.0, 0, 'M')], dims=[(0, -1.0, 6.0, -1.0, '6.0 × 10¹¹ m', -1)]))

# ── 17.5 ──
F('Satellite X orbits a planet at radius r with speed v. Satellite Y orbits the same planet at radius 9r', lambda s: planet_orbits(
    'Two orbits', 'A planet with two circular orbits drawn to scale: satellite X at radius r and satellite Y at radius 9r.',
    0.5, [dict(r=1.0, label='X: r'), dict(r=9.0, label='Y: 9r', dash='6 4')], sat_angle=70))
F('A satellite in a circular orbit is slowed slightly by air resistance and drops into a lower circular orbit', lambda s: planet_orbits(
    'Dropping to a lower orbit', 'A planet with the satellite\'s original circular orbit (dashed) and the lower circular orbit it drops into (solid).',
    1.0, [dict(r=1.6, label='lower orbit'), dict(r=2.0, label='original orbit', dash='6 4')], planet_label='', sat_angle=40))

# ── 17.6 ──
F('A student plots T² (in s²) against r³ (in m³) for four satellites of a planet', lambda s: plot(
    'r³ / 10²² m³', 'T² / 10⁹ s²', [dict(x=[0, 8], y=[0, 8 * grab(s, r'gradient ([\d.]+ × 10⁻¹³)') * 1e22 / 1e9])], 'T² against r³',
    'Graph of T² against r³ for four satellites: a straight line through the origin with gradient 2.3 × 10⁻¹³ s² m⁻³.',
    xr=(0, 8.5), yr=(0, 20), xticks=[0, 2, 4, 6, 8], yticks=[0, 5, 10, 15, 20], notes=[(0.3, 17, 'gradient 2.3 × 10⁻¹³ s² m⁻³', 'start', 0, 0, True)]))
F('A binary star system: two equal stars, each of mass M, orbit their common centre', lambda s: bodies(
    'Binary stars', 'Two equal stars, each of mass M, at opposite ends of a diameter of a circle of radius r about their common centre C, so they are 2r apart.',
    [(-1, 0, 12, 'M'), (1, 0, 12, 'M')], points=[(0, 0, 'C')], dims=[(-1, -0.3, 0, -0.3, 'r', -1), (0, -0.3, 1, -0.3, 'r', -1)]))

# ── 17.7 ──
F('A geostationary satellite orbits at 4.22 × 10⁷ m from the Earth\'s centre. Calculate its height', lambda s: planet_orbits(
    'Geostationary orbit', 'The Earth (radius 6.37 × 10⁶ m) and a geostationary orbit of radius 4.22 × 10⁷ m from the Earth\'s centre, drawn to scale.',
    RE, [dict(r=grab(s, r'orbits at ([\d.]+ × 10⁷) m'), radius_label='4.22 × 10⁷ m')], planet_label=''))
F('A geostationary satellite is directly above a ground station on the Equator', lambda s: planet_orbits(
    'Relay by a geostationary satellite', 'A geostationary satellite directly above a ground station on the Equator; signals travel straight up and down between them.',
    RE, [dict(r=4.22e7, sat=True, angle=90)], ground='ground station'))
F('Calculate the minimum number of geostationary satellites needed so that every point on the Equator can see at least one', lambda s: planet_orbits(
    'Coverage from a geostationary satellite', 'The Earth and a geostationary orbit of radius 4.22 × 10⁷ m drawn to scale; dashed lines from one satellite touch the Earth, marking the part of the Equator it can see.',
    RE, [dict(r=4.22e7, angle=90, radius_label='4.22 × 10⁷ m')], tangents=True))
F('A satellite of mass 1200 kg is moved from a low orbit (radius 6.80 × 10⁶ m) to a geostationary orbit', lambda s: planet_orbits(
    'Low orbit and geostationary orbit', 'The Earth with a low orbit of radius 6.80 × 10⁶ m and a geostationary orbit of radius 4.22 × 10⁷ m, drawn to scale.',
    RE, [dict(r=6.80e6, label='6.80 × 10⁶ m'), dict(r=4.22e7, label='4.22 × 10⁷ m', dash='6 4')], sat_angle=60))
