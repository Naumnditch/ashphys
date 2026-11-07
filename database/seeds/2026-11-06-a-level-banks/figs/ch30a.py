# Figures for ch30a.py (Chapter 30 medical physics, 30.1 to 30.4). Numbers come from the stems.

# ── 30.1 ──
F('An X-ray tube carries a current of 5.0 mA. How many electrons strike the target each second?', lambda s: xray_tube(
    'X-ray tube', 'An X-ray tube: electrons from the heated cathode cross the vacuum to the tungsten target on the anode; X-rays leave through a window. The tube current is 5.0 mA.',
    I_label='tube current 5.0 mA'))
F('Why is the inside of an X-ray tube a vacuum?', lambda s: xray_tube(
    'X-ray tube', 'An X-ray tube: a heated cathode, an evacuated glass envelope, an angled tungsten target on the anode and a window through which the X-rays leave.'))
F('An X-ray tube works at 80 kV and 20 mA, and 99% of the input power becomes heat in the anode', lambda s: xray_tube(
    'X-ray tube at 80 kV', 'An X-ray tube with 80 kV across it and a tube current of 20 mA; most of the electrons\' energy heats the anode.',
    V_label='80 kV', I_label='20 mA'))
F('The voltage across an X-ray tube is increased, with the current unchanged. How does the spectrum change?', lambda s: xray_spectrum(
    'X-ray spectrum', 'Graph of relative intensity against wavelength for an X-ray tube: a continuous spectrum starting at a cut-off wavelength, with two sharp characteristic lines; a second spectrum (dashed) is for a higher tube voltage.',
    80, compare=110))
F('The current in an X-ray tube is doubled, with the voltage unchanged', lambda s: xray_spectrum(
    'X-ray spectrum', 'Graph of relative intensity against wavelength for an X-ray tube: a continuous spectrum from a cut-off wavelength with two sharp characteristic lines.', 80))
F('Why does the anode of a powerful X-ray tube rotate?', lambda s: xray_tube(
    'X-ray tube', 'An X-ray tube: the electron beam strikes a small focal spot on the tungsten target of the anode, where almost all of its energy becomes heat.'))

# ── 30.2 ──
F('An X-ray beam passes through 3.0 cm of soft tissue (μ = 0.20 cm⁻¹) and then 1.0 cm of bone', lambda s: layers(
    'Tissue then bone', 'An X-ray beam of intensity I₀ crossing 3.0 cm of soft tissue (μ = 0.20 cm⁻¹) and then 1.0 cm of bone (μ = 0.60 cm⁻¹).',
    [(150, 'soft tissue', '3.0 cm'), (50, 'bone', '1.0 cm')]))
F('A beam crosses a limb along two paths: path A through 6.0 cm of soft tissue', lambda s: layers(
    'Path B through a limb', 'Path B through the limb: 4.0 cm of soft tissue (μ = 0.20 cm⁻¹) and 2.0 cm of bone (μ = 0.60 cm⁻¹); path A is 6.0 cm of soft tissue only.',
    [(100, 'soft tissue', '2.0 cm'), (100, 'bone', '2.0 cm'), (100, 'soft tissue', '2.0 cm')]))
F('A beam passes through 4.0 cm of soft tissue (μ = 0.20 cm⁻¹), 1.0 cm of bone', lambda s: layers(
    'Three layers', 'An X-ray beam crossing 4.0 cm of soft tissue, 1.0 cm of bone and another 4.0 cm of soft tissue.',
    [(120, 'soft tissue', '4.0 cm'), (40, 'bone', '1.0 cm'), (120, 'soft tissue', '4.0 cm')]))
F('An X-ray beam is measured through layers of aluminium', lambda s: (lambda x, I: table_plot(
    ['x / mm'] + [f'{v:.1f}' for v in x], [['I'] + [f'{v:g}' for v in I]], 'Attenuation by aluminium',
    'Table and graph of beam intensity against aluminium thickness: 100, 62, 38 and 24 units at 0, 2.0, 4.0 and 6.0 mm, falling exponentially.',
    dict(xlabel='x / mm', ylabel='I (arbitrary units)', series=[dict(x=x, y=I, kind='points')], xr=(0, 7), yr=(0, 110), xticks=[0, 2, 4, 6], yticks=[0, 25, 50, 75, 100], h=240)))(
    [float(v) for v in re.search(r'x = ([\d., ]+) mm', s).group(1).split(',')], [float(v) for v in re.search(r'I = ([\d, ]+) units', s).group(1).split(',')]))
F('An X-ray beam of intensity 800 W m⁻² passes through two half-value thicknesses of tissue', lambda s: (lambda xs: plot(
    'thickness / half-value thicknesses', 'I / W m⁻²', [dict(x=xs, y=[800 * 0.5 ** x for x in xs])], 'Attenuation curve',
    'Graph of X-ray intensity against thickness, measured in half-value thicknesses: it starts at 800 W m⁻² and halves for every half-value thickness.',
    xr=(0, 4), yr=(0, 850), xticks=[0, 1, 2, 3, 4], yticks=[0, 200, 400, 600, 800]))([4 * i / 200 for i in range(201)]))

# ── 30.3 ──
F('An X-ray tube has a focal spot 1.0 mm wide. The object is 0.90 m from the focal spot', lambda s: penumbra(
    'Penumbra', 'A focal spot 1.0 mm wide, an object edge 0.90 m from the spot and a detector 0.10 m beyond the object; rays from the two sides of the spot give a blurred edge, the penumbra.',
    spot_label='1.0 mm', a_label='0.90 m', b_label='0.10 m'))
F('A focal spot of 0.80 mm is 1.2 m from an object, which is 0.30 m from the detector', lambda s: penumbra(
    'Penumbra', 'A focal spot 0.80 mm wide 1.2 m from an object, which is 0.30 m from the detector; the penumbra forms at the edge of the shadow.',
    spot_label='0.80 mm', a_label='1.2 m', b_label='0.30 m'))
F('A focal spot is 0.60 mm wide and the object–detector distance is 0.15 m', lambda s: penumbra(
    'Choosing the source distance', 'A focal spot 0.60 mm wide, an object at an unknown distance d from the spot, and a detector 0.15 m beyond the object.',
    spot_label='0.60 mm', a_label='d', b_label='0.15 m'))
F('A focal spot is 1.2 mm wide. An object is 0.70 m from the spot and 0.30 m from the detector', lambda s: penumbra(
    'Penumbra', 'A focal spot 1.2 mm wide, an object 0.70 m from the spot and 0.30 m from the detector, and the penumbra at the edge of its shadow.',
    spot_label='1.2 mm', a_label='0.70 m', b_label='0.30 m'))
F('A focal spot is 1.5 mm wide. A patient\'s bone is 0.80 m from the spot and 0.20 m from the detector', lambda s: penumbra(
    'Magnification and penumbra', 'A focal spot 1.5 mm wide, a bone 0.80 m from the spot and 0.20 m from the detector, with the penumbra at the edge of its shadow.',
    spot_label='1.5 mm', a_label='0.80 m', b_label='0.20 m'))

# ── 30.4 ──
F('The diagram shows a 2 × 2 block of voxels. The detector reading along the top row is 9', lambda s: voxel_grid(
    'Voxel readings', 'A 2 × 2 block of voxels. The beam along the top row gives a reading of 9; the top-left voxel has the value 4 and the other values are unknown.',
    [[4, '?'], [None, None]], rows=(9, None)))
F('The diagram shows a 2 × 2 block of voxels with top row reading 7, bottom row 11', lambda s: voxel_grid(
    'Reconstructing a block', 'A 2 × 2 block of voxels with readings: top row 7, bottom row 11, left column 8, right column 10, and 9 along the diagonal from top-left to bottom-right.',
    [['a', None], [None, None]], rows=(7, 11), cols=(8, 10), diag=9))
F('A 2 × 2 block of voxels has top row 10, bottom row 14, left column 9 and right column 15', lambda s: voxel_grid(
    'Reconstructing a block', 'A 2 × 2 block of voxels with readings: top row 10, bottom row 14, left column 9, right column 15, and 13 along the diagonal from top-left to bottom-right.',
    [[None, None], [None, '?']], rows=(10, 14), cols=(9, 15), diag=13))
F('In a 2 × 2 block of voxels, the left column reads 7 and its top voxel has a value of 3', lambda s: voxel_grid(
    'Column reading', 'A 2 × 2 block of voxels; the beam down the left column gives a reading of 7 and the top-left voxel has the value 3.',
    [[3, None], ['?', None]], cols=(7, None)))
F('The diagram shows a 2 × 2 block of voxels with top row 12, bottom row 8, left column 11 and right column 9', lambda s: voxel_grid(
    'Reconstructing a block', 'A 2 × 2 block of voxels with readings: top row 12, bottom row 8, left column 11, right column 9, and 10 along the diagonal from top-left to bottom-right.',
    [['a', None], ['?', None]], rows=(12, 8), cols=(11, 9), diag=10))
F('In a 2 × 2 block, top row 16, bottom row 6, left column 13 and right column 9', lambda s: voxel_grid(
    'Finding the bone voxel', 'A 2 × 2 block of voxels with readings: top row 16, bottom row 6, left column 13, right column 9, and 11 along the diagonal from top-left to bottom-right.',
    [[None, None], [None, None]], rows=(16, 6), cols=(13, 9), diag=11))
F('A 2 × 2 voxel block has these readings: top row 5.0, bottom row 3.0', lambda s: voxel_grid(
    'Reconstructing a block', 'A 2 × 2 block of voxels with readings: top row 5.0, bottom row 3.0, left column 4.5, right column 3.5, and 4.0 along the diagonal from top-left to bottom-right.',
    [['a', '?'], [None, None]], rows=('5.0', '3.0'), cols=('4.5', '3.5'), diag='4.0'))
F('Why does a CT scanner use a fan-shaped beam and an arc of detectors?', lambda s: ct_gantry(
    'CT scanner', 'End-on view of a CT scanner: the X-ray tube and an opposite arc of detectors rotate together round the patient; a fan-shaped beam crosses the slice.'))
F('How does the X-ray source move during a CT scan?', lambda s: ct_gantry(
    'CT scanner', 'End-on view of a CT scanner showing the X-ray tube, the patient and an arc of detectors on the opposite side, with the direction of rotation.'))
