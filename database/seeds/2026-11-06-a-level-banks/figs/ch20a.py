# Figures for ch20a.py (20.1–20.4 particles of a gas, pressure, moles, Boyle's law). Numbers from the stems.

F('Smoke particles in air, viewed through a microscope, move in a jerky, random way', lambda s: brownian(
    'Path of a smoke particle', 'The path of one smoke particle seen through a microscope: a series of short straight steps in random directions.'))
F('A gas exerts a pressure of 1.2 × 10⁵ Pa on a piston of area 0.015 m²', lambda s: piston_cylinder(
    'Gas pushing on a piston', 'Gas at 1.2 × 10⁵ Pa trapped in a cylinder under a piston of area 0.015 m².', area_label='piston area 0.015 m²', atm_label='gas pressure 1.2 × 10⁵ Pa'))
F('A cubic box of side 0.10 m contains 3.0 × 10²² helium atoms', lambda s: molecule_box(
    'Atoms in a box', 'A cubic box of side 0.10 m containing helium atoms; one atom is shown moving towards a face.', L_label='0.10 m'))
F('A molecule of mass m moves in a cubical box of side L with velocity components (u, v, w)', lambda s: molecule_box(
    'Molecule in a cubical box', 'A molecule of mass m in a cubical box of side L, with velocity components u (along x, towards the shaded wall), v and w.',
    L_label='L', comps=True))
F('A vertical cylinder is closed at the top by a frictionless piston of mass 4.0 kg and area 2.0 × 10⁻³ m²', lambda s: piston_cylinder(
    'Gas under a piston', 'A vertical cylinder of gas closed at the top by a frictionless piston of mass 4.0 kg and area 2.0 × 10⁻³ m², with atmospheric pressure 1.0 × 10⁵ Pa above it.',
    mass_label='piston 4.0 kg', area_label='area 2.0 × 10⁻³ m²', atm_label='atmosphere: 1.0 × 10⁵ Pa'))
F('A syringe holds 40 cm³ of air at 100 kPa. The plunger is pushed in slowly', lambda s: syringe(
    'Compressing air in a syringe', 'A sealed syringe holding 40 cm³ of air at 100 kPa; the plunger is pushed in slowly until the pressure is 160 kPa.',
    gas_frac=0.8, label='40 cm³ at 100 kPa', push='in'))
F('A bubble of air has a volume of 2.0 cm³ at the bottom of a lake, where the pressure is 3.0 × 10⁵ Pa', lambda s: bubble_lake(
    'Rising bubble', 'A bubble of volume 2.0 cm³ at the bottom of a lake, where the pressure is 3.0 × 10⁵ Pa, rises to just below the surface, where the pressure is 1.0 × 10⁵ Pa.',
    bottom_label='2.0 cm³ at 3.0 × 10⁵ Pa', top_label='? at 1.0 × 10⁵ Pa'))
F('A tyre pump cylinder contains 120 cm³ of air at 1.0 × 10⁵ Pa', lambda s: syringe(
    'Pump cylinder', 'A pump cylinder containing 120 cm³ of air at 1.0 × 10⁵ Pa is squeezed until the air occupies 40 cm³.', gas_frac=0.9,
    label='120 cm³ at 1.0 × 10⁵ Pa', push='in'))
F('A sealed syringe of air at 101 kPa is pulled out from 15 cm³ to 45 cm³', lambda s: syringe(
    'Expanding air in a syringe', 'A sealed syringe of air at 101 kPa with its plunger pulled out so the volume increases from 15 cm³ to 45 cm³.',
    gas_frac=0.3, label='15 cm³ at 101 kPa', push='out'))
F('A bubble rises from the bottom of a 15 m deep lake to the surface', lambda s: bubble_lake(
    'Rising bubble', 'A bubble of volume 1.5 cm³ at the bottom of a lake 15 m deep rises to the surface, where the pressure is 1.0 × 10⁵ Pa.',
    depth_label='15 m', bottom_label='1.5 cm³', top_label='1.0 × 10⁵ Pa at the surface'))
F('A student plots p against 1/V for air in a syringe and gets a straight line that does not quite pass through the origin', lambda s: plot(
    '1/V', 'p', [dict(x=[0, 1.0], y=[0.08, 1.0]), dict(x=[0.25, 0.5, 0.75, 1.0], y=[0.08 + 0.92 * k for k in (0.25, 0.5, 0.75, 1.0)], kind='points')],
    'p against 1/V', 'Graph of pressure against 1/V for air in a syringe: the points lie on a straight line that does not quite pass through the origin.',
    xr=(0, 1.1), yr=(0, 1.1), xtl=[(0, '0')], ytl=[(0, '0')], grid=False))
F('On a p–V graph, two isothermals (Boyle\'s-law curves) are drawn for the same gas', lambda s: plot(
    'V', 'p', [dict(x=wave_xy(lambda v: v, 0.25, 2.5)[0], y=[1 / v for v in wave_xy(lambda v: v, 0.25, 2.5)[0]]),
               dict(x=wave_xy(lambda v: v, 0.5, 2.5)[0], y=[2 / v for v in wave_xy(lambda v: v, 0.5, 2.5)[0]], color=ACC2)],
    'Two isothermals', 'p–V graph of two Boyle\'s-law curves for the same gas: curve B lies further from the origin than curve A.',
    xr=(0, 2.6), yr=(0, 4.4), xtl=[(0, '0')], ytl=[(0, '0')], grid=False, notes=[(2.3, 1 / 2.3, 'A', 'start', 6, 12, False), (2.3, 2 / 2.3, 'B', 'start', 6, -12, False)]))
F('A gas is held in a 25 cm long tube by a column of mercury', lambda s: air_column(
    'Air trapped by mercury', 'A uniform tube, closed at the bottom, traps a 20 cm column of air under a column of mercury; atmospheric pressure is 76 cm Hg.',
    col_label='20 cm', tube_label='tube 25 cm long'))
F('A bicycle pump has a 30 cm long barrel. The outlet valve opens when the pressure inside reaches 4.0 × 10⁵ Pa', lambda s: syringe(
    'Bicycle pump', 'A bicycle pump barrel 30 cm long full of air at 1.0 × 10⁵ Pa; the outlet valve opens when the pressure reaches 4.0 × 10⁵ Pa.',
    gas_frac=0.95, label='30 cm barrel at 1.0 × 10⁵ Pa', push='in'))
F('Two flasks are joined by a closed tap. Flask A (2.0 litres) holds gas at 3.0 × 10⁵ Pa', lambda s: two_flasks(
    'Two flasks and a tap', 'Flask A (2.0 litres) holds gas at 3.0 × 10⁵ Pa and is joined by a closed tap to flask B (3.0 litres), which is evacuated.',
    'A', 'B', '2.0 litres, 3.0 × 10⁵ Pa', '3.0 litres, vacuum'))
F('A diver at a depth where the pressure is 3.5 × 10⁵ Pa breathes out a bubble of volume 3.0 cm³', lambda s: bubble_lake(
    'Diver\'s bubble', 'A bubble of volume 3.0 cm³ breathed out where the pressure is 3.5 × 10⁵ Pa rises to the surface, where the pressure is 1.0 × 10⁵ Pa.',
    bottom_label='3.0 cm³ at 3.5 × 10⁵ Pa', top_label='1.0 × 10⁵ Pa'))
F('A student tests Boyle\'s law with a syringe connected to a pressure gauge by a tube of internal volume 2.0 cm³', lambda s: syringe(
    'Syringe and gauge', 'A syringe connected to a pressure gauge by a tube of internal volume 2.0 cm³. The syringe reads 18.0 cm³ at 100 kPa.',
    gas_frac=0.72, label='18.0 cm³ at 100 kPa', gauge='tube: 2.0 cm³'))
F('A sealed glass bulb of volume 50 cm³ contains air at 1.0 × 10⁵ Pa. It is connected via a tap to an evacuated bulb', lambda s: two_flasks(
    'Bulb and evacuated bulb', 'A glass bulb of volume 50 cm³ containing air at 1.0 × 10⁵ Pa, connected through a tap to an evacuated bulb.',
    None, None, '50 cm³, 1.0 × 10⁵ Pa', 'vacuum'))
F('Data for air at constant temperature: V/cm³ = 10, 15, 20, 25, 30', lambda s: table_plot(
    ['V / cm³', 'p / kPa'], table_rows_from_stem(s, ['V/cm³', 'p/kPa'])[1], 'Pressure against volume',
    'Table and graph of pressure against volume for air at constant temperature: V = 10, 15, 20, 25, 30 cm³ give p = 300, 200, 150, 120, 100 kPa, a curve with p falling as V rises.',
    dict(xlabel='V / cm³', ylabel='p / kPa', series=[dict(x=numbers_after(s, 'V/cm³'), y=numbers_after(s, 'p/kPa'), kind='points')],
         xr=(0, 33), yr=(0, 330), xticks=[0, 10, 20, 30], yticks=[0, 100, 200, 300], h=250)))
F('A vertical cylinder holds air below a frictionless piston of mass 10 kg and area 5.0 × 10⁻³ m²', lambda s: piston_cylinder(
    'Air under a loaded piston', 'A vertical cylinder of air under a frictionless piston of mass 10 kg and area 5.0 × 10⁻³ m²; the air column is 20 cm high and a 5.0 kg mass is placed on the piston. Atmospheric pressure is 1.0 × 10⁵ Pa.',
    mass_label='piston 10 kg', area_label='area 5.0 × 10⁻³ m²', height_label='20 cm', extra_mass='5.0 kg', atm_label='atmosphere 1.0 × 10⁵ Pa'))
F('A U-tube manometer with water is used to measure the pressure of a gas being compressed in a syringe', lambda s: manometer(
    'U-tube manometer', 'A water U-tube manometer connected to the gas in a syringe: after compression the water levels differ by 34 cm.',
    diff_label='34 cm', gas_label='to syringe'))
F('A fixed mass of gas is compressed at constant temperature. A student records: p = 1.0 × 10⁵ Pa', lambda s: plot(
    'V / 10⁻⁴ m³', 'p / 10⁵ Pa', [dict(x=[float(v) for _, v in re.findall(r'p = ([\d.]+) × 10⁵ Pa, V = ([\d.]+) × 10⁻⁴', s)],
                                     y=[float(p) for p, _ in re.findall(r'p = ([\d.]+) × 10⁵ Pa, V = ([\d.]+) × 10⁻⁴', s)], kind='points')], 'Pressure against volume',
    'Graph of the four readings: p = 1.0, 2.0, 4.0, 8.0 × 10⁵ Pa at V = 6.00, 3.00, 1.52, 0.78 × 10⁻⁴ m³, lying on a curve.',
    xr=(0, 6.6), yr=(0, 8.8), xticks=[0, 2, 4, 6], yticks=[0, 2, 4, 6, 8]))
