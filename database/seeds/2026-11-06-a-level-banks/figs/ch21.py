# Figures for ch21.py (Chapter 21 electric fields). Numbers come from the stems.

# ── 21.1 ──
F('Two identical metal spheres carry charges of +6.0 nC and −2.0 nC. They are touched together', lambda s: spheres_stands(
    'Two charged spheres', 'Two identical metal spheres on insulating stands carrying +6.0 nC and −2.0 nC, before they are touched together.',
    [('', '+6.0 nC'), ('', '−2.0 nC')]))
F('A negatively charged rod is brought near a suspended light ball and the ball is repelled', lambda s: hanging_mass(
    'Ball repelled by a rod', 'A light ball hanging on a thread is pushed away from a negatively charged rod brought near it, so the thread is deflected; F is the electric force on the ball.',
    18, side_force_label='F', weight_label='W', tension_label='T'))
F('A neutral metal sphere is charged by induction using a positively charged rod', lambda s: spheres_stands(
    'Charging by induction', 'A neutral metal sphere on an insulating stand with a positively charged rod held near it; the sphere is connected to earth.',
    [('', '')], rod=('+', 0), earth=0, w=360))
F('Three identical metal spheres A, B and C are on insulating stands. A carries +9.0 nC', lambda s: spheres_stands(
    'Sharing charge', 'Three identical metal spheres A, B and C on insulating stands: A carries +9.0 nC and B and C are uncharged.',
    [('A', '+9.0 nC'), ('B', 'uncharged'), ('C', 'uncharged')]))
F('A gold-leaf electroscope is negatively charged so its leaf is raised', lambda s: electroscope(
    'Charged electroscope', 'A gold-leaf electroscope, negatively charged so that its leaf is raised, with a negatively charged rod brought near its cap without touching.',
    leaf_raised=True, rod=MINUS))
F('An uncharged metal sphere hanging on a thread is attracted towards a positively charged rod', lambda s: hanging_mass(
    'Sphere attracted to a rod', 'An uncharged metal sphere hanging on a thread is pulled towards a positively charged rod, so the thread is deflected towards the rod; F is the attractive force.',
    18, side_force_label='F', weight_label='W', tension_label='T'))
F('Two touching, uncharged metal spheres A and B stand on insulating bases', lambda s: spheres_stands(
    'Induction with two spheres', 'Two touching, uncharged metal spheres A and B on insulating bases, with a positively charged rod held near A.',
    [('A', ''), ('B', '')], touching=(0, 1), rod=('+', 0)))
F('Four identical metal spheres A, B, C and D are on insulating stands. A carries +16 nC', lambda s: spheres_stands(
    'Four spheres', 'Four identical metal spheres on insulating stands: A carries +16 nC, B carries −4.0 nC, and C and D are uncharged.',
    [('A', '+16 nC'), ('B', '−4.0 nC'), ('C', 'uncharged'), ('D', 'uncharged')], w=460))
F('A metal sphere on an insulating stand is charged by induction using a rod carrying +20 nC', lambda s: spheres_stands(
    'Charging by induction', 'A metal sphere on an insulating stand with a rod carrying +20 nC held near it; the sphere is connected to earth and then disconnected.',
    [('', '')], rod=('+', 0), earth=0, w=360))
F('A small metal sphere carries +64 nC. It is touched with an identical uncharged sphere', lambda s: spheres_stands(
    'Repeated sharing', 'A small metal sphere carrying +64 nC and an identical uncharged sphere, which is earthed after each contact.',
    [('', '+64 nC'), ('', 'uncharged')], earth=1))

# ── 21.2 ──
F('Two equal positive point charges are some distance apart. Where is the electric field zero?', lambda s: point_charges(
    'Two equal positive charges', 'Two equal positive point charges a short distance apart.', [(0, 0, '+', '+Q'), (10, 0, '+', '+Q')], h=160))
F('At point P, one charged object produces a field of 3.0 × 10⁴ N C⁻¹ due east', lambda s: vectors(
    'Two fields at P', 'Vector diagram at point P (north up the page): a field of 3.0 × 10⁴ N C⁻¹ due east and a field of 4.0 × 10⁴ N C⁻¹ due north.',
    [(3.0 * 30, 0, '3.0 × 10⁴ N C⁻¹ east', ACC2, True), (0, 4.0 * 30, '4.0 × 10⁴ N C⁻¹ north', ACC, True)], origin=(70, 180), w=360, h=230))
F('At a point, charge A produces a field of 6.0 × 10³ N C⁻¹ due east and charge B produces a field of 2.5 × 10³ N C⁻¹ due west', lambda s: vectors(
    'Opposite fields', 'Vector diagram at the point: charge A gives a field of 6.0 × 10³ N C⁻¹ due east and charge B gives 2.5 × 10³ N C⁻¹ due west.',
    [(6.0 * 20, 0, '6.0 × 10³ N C⁻¹ east', ACC2, True), (-2.5 * 20, 0, '2.5 × 10³ N C⁻¹ west', ACC, True)], origin=(185, 110), w=460, h=200))
F('A small charged sphere of mass 2.0 × 10⁻⁴ kg hangs from an insulating thread in a uniform horizontal electric field', lambda s: hanging_mass(
    'Charged sphere in a field', 'A small charged sphere of mass 2.0 × 10⁻⁴ kg hangs from an insulating thread in a uniform horizontal field of 4.0 × 10⁴ N C⁻¹; the thread makes 15° with the vertical. Forces: tension T, weight W and electric force F.',
    grab(s, r'angle of (\d+)°'), angle_label='15°', field_label='E = 4.0 × 10⁴ N C⁻¹'))
F('A positive and a negative point charge of equal magnitude are placed a short distance apart', lambda s: point_charges(
    'Opposite charges', 'A positive and a negative point charge of equal magnitude a short distance apart, with M the midpoint between them.',
    [(0, 0, '+', '+Q'), (10, 0, MINUS, '−Q')], points=[(5, 0, 'M')], h=160))
F('At a point, the electric field has a horizontal component of 2.0 × 10³ N C⁻¹ and a vertically upward component', lambda s: vectors(
    'Field components', 'Vector diagram: a horizontal field component of 2.0 × 10³ N C⁻¹ and a vertically upward component of 5.0 × 10³ N C⁻¹ from the same point.',
    [(2.0 * 40, 0, '2.0 × 10³ N C⁻¹', ACC2, True), (0, 5.0 * 30, '5.0 × 10³ N C⁻¹', ACC, True)], origin=(80, 190), w=340, h=230))
F('A small sphere of mass 3.0 × 10⁻⁴ kg carries a charge of +25 nC and hangs from an insulating thread', lambda s: hanging_mass(
    'Charged sphere in a field', 'A sphere of mass 3.0 × 10⁻⁴ kg carrying +25 nC hangs from an insulating thread in a uniform horizontal field; the thread settles at 10° to the vertical.',
    grab(s, r'at (\d+)° to the vertical'), angle_label='10°', field_label='E'))
F('At point P, charge A produces an electric field of 8.0 × 10⁴ N C⁻¹ in the +x direction', lambda s: vectors(
    'Two fields at P', 'Vector diagram at P: field A of 8.0 × 10⁴ N C⁻¹ along +x, and field B of 6.0 × 10⁴ N C⁻¹ at 60° above the −x direction.',
    [(8.0 * 18, 0, '8.0 × 10⁴ N C⁻¹', ACC2, True), (-6.0 * 18 * 0.5, 6.0 * 18 * sqrt(3) / 2, '6.0 × 10⁴ N C⁻¹', ACC, True)],
    origin=(170, 170), w=440, h=230, angle_marks=[(120, 180, 36, '60°', True)]))
F('A probe measures the force on a test charge of 2.0 nC at different distances r from the centre of a charged sphere', lambda s: plot(
    'r / m', 'F / 10⁻⁴ N', [dict(x=[0.10, 0.20, 0.30], y=[7.2, 1.8, 0.80], kind='points')], 'Force against distance',
    'Graph of the force on a 2.0 nC test charge against distance from the centre of a charged sphere: 7.2 × 10⁻⁴ N at 0.10 m, 1.8 × 10⁻⁴ N at 0.20 m and 8.0 × 10⁻⁵ N at 0.30 m.',
    xr=(0, 0.35), yr=(0, 8), xticks=[0, 0.1, 0.2, 0.3], yticks=[0, 2, 4, 6, 8]))
F('A test charge of 5.0 nC at point P experiences a force of 3.0 × 10⁻⁴ N directed at 30° above the +x axis', lambda s: vectors(
    'Force on a test charge', 'The force of 3.0 × 10⁻⁴ N on a 5.0 nC test charge at P, directed at 30° above the +x axis.',
    [(150 * cos(radians(30)), 150 * sin(radians(30)), '3.0 × 10⁻⁴ N', ACC2, True), (170, 0, '+x', MUT, False)],
    origin=(60, 170), w=340, h=220, angle_marks=[(0, 30, 50, '30°', True)]))
F('To measure the field at a fixed point, a student places different small test charges there', lambda s: table_plot(
    ['q / nC', 'F / µN'], table_rows_from_stem(s, ['q/nC', 'F/µN'])[1], 'Force against test charge',
    'Table and graph of force against test charge at a fixed point: q = 1.0, 2.0, 3.0, 4.0 nC give F = 24, 49, 71, 97 µN, close to a straight line through the origin.',
    dict(xlabel='q / nC', ylabel='F / µN', series=[dict(x=numbers_after(s, 'q/nC'), y=numbers_after(s, 'F/µN'), kind='points')],
         xr=(0, 4.4), yr=(0, 105), xticks=[0, 1, 2, 3, 4], yticks=[0, 20, 40, 60, 80, 100], h=250)))

# ── 21.3 ──
F('An electron is released from rest close to the negative plate of a pair of parallel plates in a vacuum', lambda s: plates(
    'Electron near the negative plate', 'Parallel plates in a vacuum with a uniform field from the positive (top) plate to the negative (bottom) plate; an electron is released from rest just above the negative plate.',
    particles=[(0.5, 0.1, MINUS, 'electron')]))
F('Parallel plates 0.030 m apart have a p.d. of 600 V. Calculate the force on a charge of 4.0 µC', lambda s: plates(
    'Charge between plates', 'Parallel plates 0.030 m apart with a p.d. of 600 V; a charge of 4.0 µC sits in the uniform field between them.',
    gap_label='0.030 m', labels=[(200, 22, '600 V', 'middle', None)], particles=[(0.5, 0.5, '+', '4.0 µC')]))
F('Two parallel plates are 2.0 cm apart with a p.d. of 400 V between them. Calculate the acceleration of an electron', lambda s: plates(
    'Electron between plates', 'Parallel plates 2.0 cm apart with a p.d. of 400 V; an electron is in the uniform field between them.',
    gap_label='2.0 cm', labels=[(200, 22, '400 V', 'middle', None)], particles=[(0.5, 0.5, MINUS, 'electron')]))
F('An electron starts from rest at the negative plate of a pair of parallel plates 1.0 cm apart', lambda s: plates(
    'Electron crossing the gap', 'Parallel plates 1.0 cm apart with a uniform field of 5.0 × 10³ V m⁻¹; an electron starts from rest at the negative (bottom) plate.',
    gap_label='1.0 cm', labels=[(200, 22, 'E = 5.0 × 10³ V m⁻¹', 'middle', None)], particles=[(0.5, 0.08, MINUS, 'electron')]))
F('An electron enters the uniform field between two horizontal plates, moving horizontally. The upper plate is positive', lambda s: plates(
    'Electron entering the field', 'Two horizontal plates, upper plate positive, with a uniform field between them; an electron enters midway, moving horizontally.',
    beam=dict(path='none', label='electron', is_value=False)))
F('Two parallel plates are 10 cm apart. One is at 0 V and the other at +200 V', lambda s: plates(
    'Potential between plates', 'Parallel plates 10 cm apart: the top plate is at +200 V and the bottom plate at 0 V. Point P is 3.0 cm from the 0 V plate.',
    top='+200 V', bottom='0 V', gap_label='10 cm', particles=[(0.5, 0.3, '', 'P (3.0 cm from 0 V)')]))
F('Two horizontal plates produce a uniform downward field of 5.0 × 10⁴ V m⁻¹. A charge of +2.0 µC is moved', lambda s: plates(
    'Moving a charge between plates', 'Horizontal plates with a uniform downward field of 5.0 × 10⁴ V m⁻¹. A +2.0 µC charge is moved from 1.0 cm above the lower plate to 4.0 cm above it and 3.0 cm to one side.',
    labels=[(200, 22, 'E = 5.0 × 10⁴ V m⁻¹ (down)', 'middle', None)], particles=[(0.3, 0.2, '+', '1.0 cm up'), (0.6, 0.8, '+', '4.0 cm up')], arrows=True))
F('An electron moving at 3.0 × 10⁶ m s⁻¹ heads straight towards a negatively charged plate', lambda s: plates(
    'Electron approaching a negative plate', 'An electron moving at 3.0 × 10⁶ m s⁻¹ heads straight towards the negatively charged (bottom) plate.',
    particles=[(0.5, 0.75, MINUS, '3.0 × 10⁶ m s⁻¹, moving down')]))
F('An electron moving horizontally at 2.0 × 10⁷ m s⁻¹ enters the uniform field between two horizontal plates 5.0 cm long', lambda s: plates(
    'Electron deflected between plates', 'An electron moving horizontally at 2.0 × 10⁷ m s⁻¹ enters the uniform field (1.0 × 10⁴ V m⁻¹) between horizontal plates 5.0 cm long and is deflected towards the positive plate.',
    length_label='5.0 cm', labels=[(200, 22, 'E = 1.0 × 10⁴ V m⁻¹', 'middle', None)], beam=dict(path='up', label='2.0 × 10⁷ m s⁻¹', is_value=None)))
F('Electrons are accelerated from rest through 1500 V. They then pass midway between two horizontal plates that are 4.0 cm long', lambda s: plates(
    'Electron beam between plates', 'Electrons accelerated through 1500 V pass midway between horizontal plates 4.0 cm long and 1.0 cm apart with 60 V between them.',
    length_label='4.0 cm', gap_label='1.0 cm', labels=[(200, 22, '60 V', 'middle', None)], beam=dict(path='up', label='electrons', is_value=False)))
F('An electron leaves the positive plate of a pair of parallel plates with a speed of 4.0 × 10⁶ m s⁻¹', lambda s: plates(
    'Electron leaving the positive plate', 'Plates 2.0 cm apart with 30 V between them; an electron leaves the positive (top) plate at 4.0 × 10⁶ m s⁻¹, moving straight towards the negative plate.',
    gap_label='2.0 cm', labels=[(200, 22, '30 V', 'middle', None)], particles=[(0.5, 0.9, MINUS, '4.0 × 10⁶ m s⁻¹, moving down')]))
F('A small charged sphere hangs between two vertical parallel plates 5.0 cm apart. The horizontal force on it is measured', lambda s: table_plot(
    ['V / V', 'F / mN'], table_rows_from_stem(s, ['V/V', 'F/mN'])[1], 'Force against p.d.',
    'Table and graph of the horizontal force on a charged sphere between plates 5.0 cm apart against p.d.: V = 1000, 2000, 3000, 4000 V give F = 0.85, 1.70, 2.55, 3.40 mN, a straight line through the origin.',
    dict(xlabel='V / V', ylabel='F / mN', series=[dict(x=numbers_after(s, 'V/V'), y=numbers_after(s, 'F/mN'), kind='points')],
         xr=(0, 4400), yr=(0, 3.8), xticks=[0, 1000, 2000, 3000, 4000], yticks=[0, 1, 2, 3], h=250)))
F('Protons are released from rest at the positive plate of a pair of parallel plates 8.0 mm apart', lambda s: plates(
    'Protons crossing the gap', 'Parallel plates 8.0 mm apart with a p.d. of 2.0 kV; protons are released from rest at the positive (top) plate.',
    gap_label='8.0 mm', labels=[(200, 22, '2.0 kV', 'middle', None)], particles=[(0.5, 0.92, '+', 'proton')]))
F('In an electrostatic air cleaner, air flows at 2.0 m s⁻¹ between two parallel plates that are 30 cm long', lambda s: plates(
    'Electrostatic air cleaner', 'Air flows at 2.0 m s⁻¹ between parallel plates 30 cm long and 2.0 cm apart with 8.0 kV between them; a charged dust particle enters halfway between the plates.',
    length_label='30 cm', gap_label='2.0 cm', labels=[(200, 22, '8.0 kV', 'middle', None)], beam=dict(path='straight', label='air at 2.0 m s⁻¹', is_value=None)))
F('Two parallel plates 12 cm apart are at 0 V and +600 V', lambda s: plates(
    'Plates at 0 V and +600 V', 'Parallel plates 12 cm apart: the top plate is at +600 V and the bottom plate at 0 V.', top='+600 V', bottom='0 V', gap_label='12 cm'))

# ── 21.4 ──
F('An oil drop of mass 1.6 × 10⁻¹⁵ kg is held stationary in an upward electric field', lambda s: oil_drop(
    'Stationary oil drop', 'An oil drop of mass 1.6 × 10⁻¹⁵ kg held stationary in an upward electric field of 4.9 × 10⁴ N C⁻¹: the electric force balances its weight.',
    mass_label='1.6 × 10⁻¹⁵ kg', V_label='E = 4.9 × 10⁴ N C⁻¹ (upward)'))
F('An electron moving at 5.0 × 10⁶ m s⁻¹ enters a region where there is a uniform field of 2.0 × 10³ N C⁻¹ in the same direction', lambda s: rod_angle(
    'Electron moving along a field', 'Uniform field lines of 2.0 × 10³ N C⁻¹ pointing to the right; an electron moves to the right, in the same direction as the field, at 5.0 × 10⁶ m s⁻¹.',
    0.001, None, v_label='5.0 × 10⁶ m s⁻¹', B_label='E = 2.0 × 10³ N C⁻¹', body='electron'))
F('In an ink-jet printer, an ink drop of mass 2.0 × 10⁻¹⁰ kg carries a charge of 4.0 × 10⁻¹³ C', lambda s: plates(
    'Ink drop between deflecting plates', 'A positively charged ink drop passes between deflecting plates where the field is 8.0 × 10⁵ N C⁻¹ (upwards), and is deflected along the field.',
    labels=[(200, 22, 'E = 8.0 × 10⁵ N C⁻¹', 'middle', None)], beam=dict(path='up', label='ink drop', is_value=False), top=MINUS, bottom='+', field_dir='up'))
F('An oil drop carrying a negative charge is held stationary between two horizontal plates', lambda s: oil_drop(
    'Stationary oil drop', 'A negatively charged oil drop held stationary between two horizontal plates: the upward electric force balances its weight.'))
F('A small sphere of mass 2.0 × 10⁻⁴ kg carrying a charge of 15 nC hangs on a thread between two vertical parallel plates', lambda s: hanging_mass(
    'Sphere between vertical plates', 'A sphere of mass 2.0 × 10⁻⁴ kg carrying 15 nC hangs on a thread between vertical plates 6.0 cm apart with a p.d. of 3.0 kV; the horizontal field deflects the thread.',
    16, field_label='E (plates 6.0 cm apart, 3.0 kV)'))
F('A positive ion and an electron are released together from the midpoint between two charged parallel plates', lambda s: plates(
    'Ion and electron between plates', 'A positive ion and an electron released together from rest at the midpoint between two charged parallel plates (top positive).',
    particles=[(0.42, 0.5, '+', 'ion'), (0.58, 0.5, MINUS, 'electron')]))
F('An oil drop of radius 1.2 µm and density 900 kg m⁻³ is held stationary between two horizontal plates 8.0 mm apart', lambda s: oil_drop(
    'Stationary oil drop', 'An oil drop of radius 1.2 µm held stationary between horizontal plates 8.0 mm apart with a p.d. of 1065 V.',
    gap_label='8.0 mm', V_label='p.d. 1065 V', mass_label='radius 1.2 µm'))
F('An electron moving at 3.0 × 10⁷ m s⁻¹ enters a uniform field of 2.0 × 10⁴ N C⁻¹ at right angles to the field', lambda s: plates(
    'Electron crossing a field', 'An electron moving at 3.0 × 10⁷ m s⁻¹ enters a uniform field of 2.0 × 10⁴ N C⁻¹ at right angles; the field region is 6.0 cm long.',
    length_label='6.0 cm', labels=[(200, 22, 'E = 2.0 × 10⁴ N C⁻¹', 'middle', None)], beam=dict(path='up', label='3.0 × 10⁷ m s⁻¹', is_value=None)))
F('A proton and an electron enter the same uniform electric field with the same speed, moving at right angles', lambda s: plates(
    'Proton and electron in a field', 'A proton and an electron enter the same uniform field between parallel plates with the same speed, moving at right angles to the field.',
    beam=dict(path='none', label='proton and electron', is_value=False)))
F('An oil drop of mass 4.0 × 10⁻¹⁵ kg carrying a charge of 6.4 × 10⁻¹⁹ C is between horizontal plates where there is an upward field', lambda s: oil_drop(
    'Oil drop in an upward field', 'An oil drop of mass 4.0 × 10⁻¹⁵ kg carrying 6.4 × 10⁻¹⁹ C between horizontal plates with an upward field of 8.0 × 10⁴ N C⁻¹.',
    mass_label='4.0 × 10⁻¹⁵ kg', V_label='E = 8.0 × 10⁴ N C⁻¹ (upward)'))
F('A proton moving at 2.0 × 10⁵ m s⁻¹ enters a region where a uniform field of 1.5 × 10³ N C⁻¹ points opposite to its velocity', lambda s: rod_angle(
    'Proton moving against a field', 'Uniform field lines of 1.5 × 10³ N C⁻¹ pointing to the right; a proton moves to the left, against the field, at 2.0 × 10⁵ m s⁻¹.',
    180, None, v_label='2.0 × 10⁵ m s⁻¹', B_label='E = 1.5 × 10³ N C⁻¹', body='proton'))
F('A ball of mass 0.010 kg carrying +2.0 µC is released from rest in a uniform horizontal electric field', lambda s: vectors(
    'Forces on the ball', 'Forces on a ball of mass 0.010 kg carrying +2.0 µC in a uniform horizontal field of 5.0 × 10⁴ N C⁻¹: its weight acts vertically down and the electric force acts horizontally.',
    [(100, 0, 'electric force', ACC2, False), (0, -98, 'weight', ACC, False)], origin=(120, 70), w=320, h=220))
F('A mineral separator lets a mixture of charged particles fall from rest between two vertical plates', lambda s: (lambda a, H: plot(
    'horizontal displacement / m', 'distance fallen / m', [dict(x=[0.5 * a * (2 * y / 9.81) for y in wave_xy(lambda t: t, 0, H)[0]], y=[-y for y in wave_xy(lambda t: t, 0, H)[0]])],
    'Path in the separator', 'Path of one type of particle falling from rest between vertical plates with a horizontal field of 5.0 × 10⁵ N C⁻¹ and charge-to-mass ratio 2.0 × 10⁻⁶ C kg⁻¹: a straight line slanting sideways as it falls 1.0 m.',
    xr=(0, 0.12), yr=(-1.1, 0), xticks=[0, 0.04, 0.08, 0.12], yticks=[-1.0, -0.5, 0]))(5.0e5 * 2.0e-6, grab(s, r'fall ([\d.]+) m')))
F('In an experiment, the acceleration of identical ions is measured in different uniform fields', lambda s: table_plot(
    ['E / 10⁴ N C⁻¹', 'a / 10¹² m s⁻²'], table_rows_from_stem(s, ['E/10⁴ N C⁻¹', 'a/10¹² m s⁻²'])[1], 'Acceleration against field strength',
    'Table and graph of ion acceleration against field strength: E = 1.0, 2.0, 3.0, 4.0 × 10⁴ N C⁻¹ give a = 0.96, 1.92, 2.88, 3.84 × 10¹² m s⁻², a straight line through the origin.',
    dict(xlabel='E / 10⁴ N C⁻¹', ylabel='a / 10¹² m s⁻²', series=[dict(x=numbers_after(s, 'E/10⁴ N C⁻¹'), y=numbers_after(s, 'a/10¹² m s⁻²'), kind='points')],
         xr=(0, 4.4), yr=(0, 4.2), xticks=[0, 1, 2, 3, 4], yticks=[0, 1, 2, 3, 4], h=250)))
F('An oil drop carrying three excess electrons is held stationary between horizontal plates when the p.d. is 600 V', lambda s: oil_drop(
    'Stationary oil drop', 'An oil drop carrying three excess electrons held stationary between horizontal plates with a p.d. of 600 V.', V_label='p.d. 600 V'))
F('Electrons accelerated from rest through 800 V enter, midway and parallel, between two horizontal plates 5.0 cm long', lambda s: plates(
    'Deflecting an electron beam', 'Electrons accelerated through 800 V enter midway between horizontal plates 5.0 cm long and 2.0 cm apart with 100 V between them; a screen is 20 cm beyond the plates.',
    length_label='5.0 cm', gap_label='2.0 cm', labels=[(200, 22, '100 V', 'middle', None)], beam=dict(path='up', label='electrons', is_value=False)))
