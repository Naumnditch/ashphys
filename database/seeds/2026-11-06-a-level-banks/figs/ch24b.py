# Figures for ch24b.py (24.5 currents crossing fields, 24.6 forces between currents, 24.8 comparing forces).

# ── 24.5 ──
F('A uniform field of 0.50 T makes an angle of 40° with a straight wire', lambda s: wire_angle(
    'Field at an angle to a wire', 'A uniform 0.50 T field across the page and a straight wire at 40° to the field lines.',
    grab(s, r'angle of (\d+)°'), '40°', B_label='B = 0.50 T'))
F('A wire at 90° to a field feels a force of 0.40 N. What force does it feel at 150° to the field?', lambda s: wire_angle(
    'Wire at 150° to the field', 'A uniform field across the page and a current-carrying wire at 150° to the field direction (measured from the field direction to the current direction).',
    grab(s, r'at (\d+)° to the field'), '150°'))
F('A vertical wire carries a current upwards where the Earth\'s horizontal field points north', lambda s: wire_in_uniform(
    'Vertical wire in the Earth\'s field', "Top view with north up the page: a vertical wire carrying current upwards (out of the page) where the Earth's horizontal field points north.",
    out=True, B_label="Earth's field (north)"))
F('An L-shaped wire has one 0.10 m arm at right angles to a 0.50 T field and the other 0.10 m arm parallel to it', lambda s: l_wire(
    'L-shaped wire', 'An L-shaped wire carrying 2.0 A in a uniform 0.50 T field across the page: one 0.10 m arm lies along the field and the other 0.10 m arm is at right angles to it.',
    '0.10 m', '0.10 m', field='lines', I_label='2.0 A', B_label='B = 0.50 T'))
F('A wire bent at a right angle has arms of 0.30 m and 0.40 m, both in a plane at right angles to a 0.20 T field', lambda s: l_wire(
    'Bent wire in a field', 'A wire bent at a right angle, with arms of 0.30 m and 0.40 m, carrying 3.0 A in a plane at right angles to a uniform 0.20 T field (into the page).',
    '0.30 m', '0.40 m', field='into', I_label='3.0 A', B_label='B = 0.20 T into the page',
    ratio=grab(s, r'and ([\d.]+) m, both') / grab(s, r'arms of ([\d.]+) m')))
F('A wire 0.050 m long carrying 2.0 A is placed at different angles θ to a field: θ/° = 0, 30, 60, 90', lambda s: table_plot(
    ['θ / °', 'F / mN'], table_rows_from_stem(s, ['θ/°', 'F/mN'])[1], 'Force against angle',
    'Table and graph of the force on a 0.050 m wire carrying 2.0 A against its angle to the field: θ = 0, 30, 60, 90° give F = 0, 15, 26, 30 mN.',
    dict(xlabel='θ / °', ylabel='F / mN', series=[dict(x=numbers_after(s, 'θ/°'), y=numbers_after(s, 'F/mN'), kind='points')],
         xr=(0, 100), yr=(0, 34), xticks=[0, 30, 60, 90], yticks=[0, 10, 20, 30], h=250)))
F('A wire PQR has PQ = 0.20 m along the +x direction and QR = 0.15 m along the +y direction', lambda s: l_wire(
    'Wire PQR', 'A wire PQR: PQ = 0.20 m along +x and QR = 0.15 m along +y, carrying 5.0 A from P to R, in a uniform 0.40 T field along +z (out of the page).',
    'PQ = 0.20 m', 'QR = 0.15 m', field='out', I_label='5.0 A', axes=True, B_label='B = 0.40 T along +z',
    ratio=grab(s, r'QR = ([\d.]+) m') / grab(s, r'PQ = ([\d.]+) m')))
F('A 0.50 m wire lies along the x-axis carrying 2.0 A. The field has a component of 0.30 T along x and 0.40 T along y', lambda s: vectors(
    'Field components', 'The 0.50 m wire lies along the x-axis carrying 2.0 A. The field has a component of 0.30 T along x and 0.40 T along y, drawn from the same point.',
    [(0.30 * 300, 0, '0.30 T along x', ACC, True), (0, 0.40 * 300, '0.40 T along y', ACC2, True)], origin=(70, 180), w=320, h=230))
F('The Earth\'s field at a place is 50 µT at a dip angle of 65°', lambda s: dip_figure(
    'Angle of dip', "The Earth's field of 50 µT in the north–vertical plane, pointing downwards at a dip angle of 65° below the horizontal.",
    grab(s, r'dip angle of (\d+)°'), total_label='50 µT', dip_label='65°'))

# ── 24.6 ──
F('Two parallel wires carry currents of 2.0 A and 8.0 A. How do the forces on the two wires compare?', lambda s: wires_endon(
    'Two parallel wires', 'Two long parallel wires seen end-on, carrying 2.0 A and 8.0 A.',
    [dict(x=0, y=0, out=True, label='2.0 A'), dict(x=10, y=0, out=True, label='8.0 A')], h=170))
F('Two parallel wires attract each other. The current in one of them is reversed', lambda s: wires_endon(
    'Two attracting wires', 'Two long parallel wires seen end-on, both carrying current out of the page, so they attract each other.',
    [dict(x=0, y=0, out=True, label='I₁'), dict(x=10, y=0, out=True, label='I₂')], h=170))
F('Three long parallel wires A, B and C lie equally spaced in a plane, with B in the middle', lambda s: wires_endon(
    'Three parallel wires', 'Three long parallel wires A, B and C seen end-on, equally spaced in a line with B in the middle, all carrying equal currents out of the page.',
    [dict(x=0, y=0, out=True, label='A'), dict(x=10, y=0, out=True, label='B'), dict(x=20, y=0, out=True, label='C')], h=170))
F('Three long parallel wires A, B and C lie in a plane with B midway between them, 0.040 m from each', lambda s: wires_endon(
    'Three parallel wires', 'Three long parallel wires seen end-on, all with current out of the page: A carries 10 A, B (in the middle, 0.040 m from each) carries 5.0 A and C carries 5.0 A.',
    [dict(x=0, y=0, out=True, label='A: 10 A'), dict(x=0.040, y=0, out=True, label='B: 5.0 A'), dict(x=0.080, y=0, out=True, label='C: 5.0 A')],
    dims=[(0, -0.009, 0.040, -0.009, '0.040 m', -1), (0.040, -0.009, 0.080, -0.009, '0.040 m', -1)], h=200))
F('A fixed horizontal wire carries 50 A. A parallel wire directly above it', lambda s: wires_endon(
    'Wire supported magnetically', 'Two long horizontal parallel wires seen end-on: the fixed lower wire carries 50 A out of the page; the wire directly above it, of mass 1.0 × 10⁻³ kg per metre, carries 50 A into the page at separation d.',
    [dict(x=0, y=0, out=True, label=''), dict(x=0, y=10, out=False, label='')], points=[], dims=[(-3, 0, -3, 10, 'd', -1)], w=300, h=220,
    note='lower wire fixed: 50 A; upper wire: 50 A'))
F('In a current balance, a 0.25 m length of wire is held 3.0 mm above a fixed parallel wire', lambda s: wires_endon(
    'Current balance wires', 'Side view of two horizontal parallel wires seen end-on: a 0.25 m length of wire held 3.0 mm above a fixed wire, carrying the same current in the opposite direction.',
    [dict(x=0, y=0, out=True), dict(x=0, y=3.0, out=False)], dims=[(-1.2, 0, -1.2, 3.0, '3.0 mm', -1)], w=300, h=220,
    note='0.25 m length, currents opposite'))
F('Three long parallel wires pass through the corners of an equilateral triangle of side 0.10 m', lambda s: wires_endon(
    'Wires at the corners of a triangle', 'Three long parallel wires seen end-on at the corners of an equilateral triangle of side 0.10 m, each carrying 10 A out of the page.',
    [dict(x=0, y=0, out=True, label='10 A'), dict(x=0.10, y=0, out=True, label='10 A'), dict(x=0.05, y=0.10 * sqrt(3) / 2, out=True, label='10 A')],
    dims=[(0, -0.02, 0.10, -0.02, '0.10 m', -1)], h=240))
F('Three long parallel wires A, B and C lie in a plane. B is 0.040 m from A and 0.060 m from C', lambda s: wires_endon(
    'Three parallel wires', 'Three long parallel wires in a line, seen end-on: A and C each carry 10 A out of the page; B, 0.040 m from A and 0.060 m from C, carries 5.0 A into the page.',
    [dict(x=0, y=0, out=True, label='A: 10 A'), dict(x=0.040, y=0, out=False, label='B: 5.0 A'), dict(x=0.100, y=0, out=True, label='C: 10 A')],
    dims=[(0, -0.012, 0.040, -0.012, '0.040 m', -1), (0.040, -0.012, 0.100, -0.012, '0.060 m', -1)], h=200))
F('A fixed horizontal wire carries 80 A. A parallel wire with a mass of 2.0 g per metre carries 40 A in the opposite direction', lambda s: wires_endon(
    'Floating wire', 'Two long horizontal parallel wires seen end-on: the fixed lower wire carries 80 A out of the page; the upper wire, of mass 2.0 g per metre, carries 40 A into the page and floats directly above it.',
    [dict(x=0, y=0, out=True, label=''), dict(x=0, y=10, out=False, label='')], dims=[(-3, 0, -3, 10, 'd', -1)], w=300, h=220,
    note='lower wire: 80 A; upper wire: 40 A'))
F('Two long parallel wires carry equal currents I. The force per metre is measured at different separations d', lambda s: table_plot(
    ['d / cm', '(F/L) / 10⁻⁴ N m⁻¹'], table_rows_from_stem(s, ['d/cm', '(F/L)/10⁻⁴ N m⁻¹'])[1], 'Force per metre against separation',
    'Table and graph of force per metre against separation for two wires with equal currents: d = 1.0, 2.0, 4.0, 8.0 cm give F/L = 8.0, 4.0, 2.0, 1.0 × 10⁻⁴ N m⁻¹, a falling curve.',
    dict(xlabel='d / cm', ylabel='(F/L) / 10⁻⁴ N m⁻¹', series=[dict(x=numbers_after(s, 'd/cm'), y=numbers_after(s, '(F/L)/10⁻⁴ N m⁻¹'), kind='points')],
         xr=(0, 9), yr=(0, 9), xticks=[0, 2, 4, 6, 8], yticks=[0, 2, 4, 6, 8], h=250)))

# ── 24.8 ──
F('An oil droplet of mass 1.0 × 10⁻¹⁴ kg carries a charge of 3.2 × 10⁻¹⁹ C', lambda s: oil_drop(
    'Droplet held by an electric field', 'A charged oil droplet of mass 1.0 × 10⁻¹⁴ kg between horizontal plates: a vertical electric field gives an upward electric force that balances its weight.',
    mass_label='1.0 × 10⁻¹⁴ kg'))
F('An electron crosses a 0.20 T field at 30° to the field lines with speed 1.0 × 10⁷ m s⁻¹', lambda s: rod_angle(
    'Electron at 30° to a field', 'Horizontal field lines of flux density 0.20 T; an electron moves at 1.0 × 10⁷ m s⁻¹ at 30° to them.',
    grab(s, r'at (\d+)° to'), '30°', v_label='1.0 × 10⁷ m s⁻¹', B_label='B = 0.20 T', body='electron'))
F('An electron moves at 2.0 × 10⁶ m s⁻¹ at right angles to a magnetic field of 0.010 T, in a region that also has an electric field', lambda s: selector(
    'Electric and magnetic fields', 'An electron moving at 2.0 × 10⁶ m s⁻¹ through a region with an electric field of 1.0 × 10⁴ V m⁻¹ between parallel plates and a magnetic field of 0.010 T into the page.',
    E_label='E = 1.0 × 10⁴ V m⁻¹', B_label='B = 0.010 T', v_label='2.0 × 10⁶ m s⁻¹', particle='electron', paths=()))
F('A velocity selector has parallel plates 4.0 mm apart with a p.d. of 600 V, and a magnetic field of 0.050 T', lambda s: selector(
    'Velocity selector', 'A velocity selector: plates 4.0 mm apart with a p.d. of 600 V and a magnetic field of 0.050 T into the page, at right angles to the electric field.',
    gap_label='4.0 mm', E_label='p.d. 600 V', B_label='B = 0.050 T', particle='particles'))
F('Protons moving at 2.0 × 10⁵ m s⁻¹ pass undeflected through crossed electric and magnetic fields', lambda s: selector(
    'Crossed fields', 'Protons moving at 2.0 × 10⁵ m s⁻¹ pass undeflected through crossed fields 0.10 m long: an electric field of 1.0 × 10³ V m⁻¹ and a magnetic field into the page.',
    E_label='E = 1.0 × 10³ V m⁻¹', length_label='0.10 m', v_label='2.0 × 10⁵ m s⁻¹', particle='protons'))
