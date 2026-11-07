# Figures for ch24a.py (24.1–24.4 magnetic fields). Numbers come from the stems.

# ── 24.1 ──
F('Looking at one end of a solenoid, you see the current flowing anticlockwise', lambda s: solenoid_end(
    'End view of a solenoid', 'End view of a solenoid: the current flows anticlockwise round the turns as seen from this end.', anticlockwise=True))
F('A compass needle lies where the Earth\'s horizontal field is 2.0 × 10⁻⁵ T due north', lambda s: vectors(
    'Two horizontal fields', "Vector diagram (top view, north up the page): the Earth's horizontal field of 2.0 × 10⁻⁵ T points due north and the wire's field of 1.5 × 10⁻⁵ T points due east, from the same point.",
    [(0, 2.0 * 50, '2.0 × 10⁻⁵ T north', ACC, True), (1.5 * 50, 0, '1.5 × 10⁻⁵ T east', ACC2, True)], origin=(80, 170)))
F('Two long parallel wires are 10 cm apart and each carries 4.0 A, in opposite directions', lambda s: wires_endon(
    'Two wires, opposite currents', 'Two long parallel wires seen end-on, 10 cm apart, each carrying 4.0 A: one out of the page and one into the page. M is the midpoint between them.',
    [dict(x=0, y=0, out=True, label='4.0 A'), dict(x=10, y=0, out=False, label='4.0 A')], points=[dict(x=5, y=0, label='M')],
    dims=[(0, -2.2, 10, -2.2, '10 cm', -1)], h=200))
F('Two long parallel wires carry equal currents in the same direction. What is the magnetic field midway', lambda s: wires_endon(
    'Two wires, same direction', 'Two long parallel wires seen end-on carrying equal currents in the same direction (out of the page); M is the midpoint between them.',
    [dict(x=0, y=0, out=True, label='I'), dict(x=10, y=0, out=True, label='I')], points=[dict(x=5, y=0, label='M')], h=180))
F('A long vertical wire carries a current upwards. The Earth\'s horizontal field points north', lambda s: wire_in_uniform(
    'Vertical wire in the Earth\'s field', "Top view with north up the page: a long vertical wire carrying current upwards (out of the page) in the Earth's uniform horizontal field pointing north.",
    out=True, B_label='Earth\'s field (north)'))
F('At a point near a wire, the wire produces a horizontal field of 3.0 × 10⁻⁵ T due west', lambda s: vectors(
    'Two horizontal fields', "Vector diagram (top view, north up the page): the wire's field of 3.0 × 10⁻⁵ T points due west and the Earth's horizontal field of 4.0 × 10⁻⁵ T points due north.",
    [(-3.0 * 40, 0, '3.0 × 10⁻⁵ T west', ACC2, True), (0, 4.0 * 40, '4.0 × 10⁻⁵ T north', ACC, True)], origin=(250, 190), w=400, h=230))
F('Two long parallel wires are 0.10 m apart. Wire 1 carries 6.0 A and wire 2 carries 2.0 A in the same direction', lambda s: wires_endon(
    'Two wires, same direction', 'Two long parallel wires seen end-on, 0.10 m apart, carrying 6.0 A (wire 1) and 2.0 A (wire 2) in the same direction, out of the page.',
    [dict(x=0, y=0, out=True, label='wire 1: 6.0 A'), dict(x=0.10, y=0, out=True, label='wire 2: 2.0 A')], dims=[(0, -0.022, 0.10, -0.022, '0.10 m', -1)], h=200))
F('A compass is placed 4.0 cm from a long vertical wire, on the line east of it', lambda s: table_plot(
    ['I / A', 'θ / °'], table_rows_from_stem(s, ['I/A', 'deflection θ/°'])[1], 'Compass deflection against current',
    'Table and graph of compass deflection θ against current I for a wire 4.0 cm away: I = 1.0, 2.0, 3.0, 4.0 A give θ = 15.5, 29.1, 39.8, 48.0°, plotted as points on a curve that flattens.',
    dict(xlabel='I / A', ylabel='θ / °', series=[dict(x=numbers_after(s, 'I/A'), y=numbers_after(s, 'deflection θ/°'), kind='points')],
         xr=(0, 4.4), yr=(0, 55), xticks=[0, 1, 2, 3, 4], yticks=[0, 10, 20, 30, 40, 50], h=250)))
F('Two long parallel wires A and B, 5.0 cm apart, each carry 6.0 A out of the page', lambda s: (lambda AB, AP, BP: wires_endon(
    'Two wires and a point P', 'Two long parallel wires A and B, 5.0 cm apart, each carry 6.0 A out of the page. Point P is 3.0 cm from A and 4.0 cm from B, so AP and BP are at right angles.',
    [dict(x=0, y=0, out=True, label='A'), dict(x=AB, y=0, out=True, label='B')],
    points=[dict(x=(AP ** 2 - BP ** 2 + AB ** 2) / (2 * AB), y=sqrt(AP ** 2 - ((AP ** 2 - BP ** 2 + AB ** 2) / (2 * AB)) ** 2), label='P')],
    dims=[(0, -0.9, AB, -0.9, '5.0 cm', -1)], h=240))(grab(s, r'B, ([\d.]+) cm apart'), grab(s, r'P is ([\d.]+) cm from A'), grab(s, r'and ([\d.]+) cm from B')))
F('A long vertical wire carries 8.0 A. The Earth\'s horizontal field is 2.0 × 10⁻⁵ T', lambda s: wire_in_uniform(
    'Wire in the Earth\'s field', "Top view with north up the page: a long vertical wire carrying 8.0 A upwards (out of the page) in the Earth's uniform horizontal field of 2.0 × 10⁻⁵ T pointing north.",
    out=True, B_label='2.0 × 10⁻⁵ T north', I_label='8.0 A'))
F('A solenoid of length 0.60 m and radius 1.5 cm has 1200 turns and carries 0.50 A', lambda s: solenoid_coil(
    'Solenoid and search coil', 'A solenoid 0.60 m long and of radius 1.5 cm with 1200 turns carrying 0.50 A; a 50-turn search coil is wound tightly round its middle.',
    sol_label='solenoid: 0.60 m, 1200 turns, 0.50 A', coil_label='50-turn search coil'))
F('A Hall probe measures the field at distances r from a long straight wire', lambda s: table_plot(
    ['r / cm', 'B / µT'], table_rows_from_stem(s, ['r/cm', 'B/µT'])[1], 'Field against distance',
    'Table and graph of flux density against distance from a long straight wire: r = 2.0, 4.0, 6.0, 8.0 cm give B = 100, 50, 33, 25 µT, plotted as points on a falling curve.',
    dict(xlabel='r / cm', ylabel='B / µT', series=[dict(x=numbers_after(s, 'r/cm'), y=numbers_after(s, 'B/µT'), kind='points')],
         xr=(0, 9), yr=(0, 110), xticks=[0, 2, 4, 6, 8], yticks=[0, 20, 40, 60, 80, 100], h=250)))
F('An overhead power cable carries a steady current of 300 A at a height of 10 m above the ground', lambda s: wires_endon(
    'Overhead cable', 'Side view: an overhead cable, seen end-on, carrying 300 A at a height of 10 m above the ground; G is the point on the ground directly below it.',
    [dict(x=0, y=grab(s, r'height of (\d+) m'), out=True, label='300 A')], points=[dict(x=0, y=0, label='G (ground)')],
    dims=[(-3, 0, -3, grab(s, r'height of (\d+) m'), '10 m', -1)], h=240, w=320))
F('Two long parallel wires, 0.20 m apart, carry 5.0 A each in opposite directions. Point P', lambda s: wires_endon(
    'Two wires and an outside point', 'Two long parallel wires, 0.20 m apart, carry 5.0 A each in opposite directions (wire 1 out of the page, wire 2 into it). P is on the line through both, 0.10 m outside wire 1 and 0.30 m from wire 2.',
    [dict(x=0, y=0, out=True, label='wire 1'), dict(x=0.20, y=0, out=False, label='wire 2')], points=[dict(x=-0.10, y=0, label='P')],
    dims=[(-0.10, -0.03, 0, -0.03, '0.10 m', -1), (0, -0.03, 0.20, -0.03, '0.20 m', -1)], h=200))

# ── 24.2 ──
F('A 0.30 m wire carrying 2.0 A lies at 60° to a uniform field of 0.50 T', lambda s: wire_angle(
    'Wire at an angle to a field', 'A uniform 0.50 T field across the page and a 0.30 m wire carrying 2.0 A at 60° to the field lines.',
    grab(s, r'at (\d+)° to'), '60°', I_label='2.0 A', B_label='B = 0.50 T'))
F('A wire at right angles to a field feels a force of 0.20 N. What force does it feel when turned to 30° to the field?', lambda s: wire_angle(
    'Wire turned to 30°', 'A uniform field across the page and a current-carrying wire turned so that it is at 30° to the field lines.',
    grab(s, r'turned to (\d+)°'), '30°'))
F('A metal rod of mass 0.010 kg rests across two horizontal rails 0.080 m apart', lambda s: rails(
    'Rod on rails', 'Top view: a rod of mass 0.010 kg rests across horizontal rails 0.080 m apart, connected to a cell so that 5.0 A flows through the rod, in a vertical 0.30 T field (into the page).',
    L_label='0.080 m', v_label=None, B_label='B = 0.30 T (vertical)', R_label='cell', rod_label='5.0 A, 0.010 kg'))
F('A 50 m span of overhead cable carries 300 A at 40° to the Earth\'s field', lambda s: wire_angle(
    'Cable at an angle to the field', "The Earth's uniform field of 4.0 × 10⁻⁵ T across the page and a 50 m span of cable carrying 300 A at 40° to it.",
    grab(s, r'at (\d+)° to'), '40°', I_label='300 A', B_label='B = 4.0 × 10⁻⁵ T'))
F('On a diagram, a uniform field points from left to right across the page, and a wire carries a current into the page', lambda s: wire_cross_field(
    'Wire in a uniform field', 'A uniform field pointing from left to right across the page and a wire, seen end-on, carrying a current into the page.', out=False))
F('A straight wire 0.40 m long carries 2.0 A at right angles to a field of 0.30 T, but only half of its length lies inside', lambda s: wire_partial(
    'Wire partly in a field', 'A straight wire 0.40 m long carrying 2.0 A, with half of its length inside a region of uniform 0.30 T field into the page and half outside.',
    inside=0.5, L_label='0.40 m', I_label='2.0 A', B_label='B = 0.30 T'))
F('In a model rail gun, a rod of mass 0.020 kg lies across two rails 0.10 m apart', lambda s: rails(
    'Model rail gun', 'Top view: a rod of mass 0.020 kg across rails 0.10 m apart in a vertical 0.50 T field (into the page); a cell drives 4.0 A through the rod and a friction force of 0.050 N opposes its motion.',
    L_label='0.10 m', v_label=None, B_label='B = 0.50 T (vertical)', R_label='cell', rod_label='4.0 A, 0.020 kg'))
F('A 0.50 m wire lies along the x-axis carrying 3.0 A in the +x direction. A uniform field of 0.40 T lies in the x–y plane at 30°', lambda s: wire_angle(
    'Wire and field in the x–y plane', 'A 0.50 m wire carrying 3.0 A and a uniform 0.40 T field in the same plane, with 30° between the wire and the field.',
    grab(s, r'at (\d+)° to the x'), '30°', I_label='3.0 A', B_label='B = 0.40 T'))
F('A student measures the force on a 0.040 m length of wire at right angles to a magnetic field for different currents', lambda s: table_plot(
    ['I / A', 'F / mN'], table_rows_from_stem(s, ['I/A', 'F/mN'])[1], 'Force against current',
    'Table and graph of force against current for a 0.040 m wire at right angles to a field: I = 1.0, 2.0, 3.0, 4.0 A give F = 2.4, 4.9, 7.2, 9.7 mN, close to a straight line through the origin.',
    dict(xlabel='I / A', ylabel='F / mN', series=[dict(x=numbers_after(s, 'I/A'), y=numbers_after(s, 'F/mN'), kind='points')],
         xr=(0, 4.4), yr=(0, 11), xticks=[0, 1, 2, 3, 4], yticks=[0, 2, 4, 6, 8, 10], h=250)))
F('A wire is bent into a semicircle of radius 0.10 m and placed in a uniform field of 0.50 T', lambda s: semicircle_wire(
    'Semicircular wire', 'A wire bent into a semicircle of radius 0.10 m carrying 2.0 A, in a uniform 0.50 T field at right angles to the plane of the semicircle (into the page).',
    r_label='0.10 m', I_label='2.0 A', B_label='B = 0.50 T'))

# ── 24.3 ──
F('A field of 0.30 T makes an angle of 30° with the normal to a coil of area 0.010 m²', lambda s: coil_angle(
    'Coil at an angle', 'Side view: a uniform 0.30 T field across the page and a coil of area 0.010 m², seen edge-on, whose normal makes 30° with the field.',
    grab(s, r'angle of (\d+)°'), '30°', B_label='B = 0.30 T', coil_label='area 0.010 m²'))
F('At a location, the Earth\'s field is 50 µT and the angle of dip is 66°', lambda s: dip_figure(
    'Angle of dip', "The Earth's field of 50 µT in the north–vertical plane, pointing downwards at the angle of dip, 66° below the horizontal; its horizontal component B_H points north.",
    grab(s, r'dip is (\d+)°'), total_label='50 µT', h_label='B_H', dip_label='66°'))
F('A 100-turn coil of area 0.0050 m² starts face-on to a 0.20 T field and is turned until its normal is at 60°', lambda s: coil_angle(
    'Coil turned to 60°', 'Side view: a uniform 0.20 T field across the page and a 100-turn coil of area 0.0050 m², seen edge-on, turned so that its normal is at 60° to the field.',
    grab(s, r'normal is at (\d+)°'), '60°', B_label='B = 0.20 T', coil_label='100 turns, area 0.0050 m²', rotation=True))
F('A flux of 3.0 × 10⁻³ Wb passes through a loop of area 0.020 m² whose normal is at 40° to the field', lambda s: coil_angle(
    'Loop at an angle', 'Side view: a uniform field across the page and a loop of area 0.020 m², seen edge-on, whose normal is at 40° to the field; the flux through it is 3.0 × 10⁻³ Wb.',
    grab(s, r'normal is at (\d+)°'), '40°', coil_label='area 0.020 m²'))
F('At a certain place the Earth\'s horizontal field component is 1.9 × 10⁻⁵ T and the angle of dip is 68°', lambda s: dip_figure(
    'Angle of dip', "The Earth's field in the north–vertical plane: the horizontal component of 1.9 × 10⁻⁵ T points north, and the total field points downwards at the angle of dip, 68° below the horizontal.",
    grab(s, r'dip is (\d+)°'), total_label='B', h_label='1.9 × 10⁻⁵ T', dip_label='68°'))
F('A Hall probe is moved along the axis of a bar magnet: d/cm = 2.0, 4.0, 6.0, 8.0', lambda s: table_plot(
    ['d / cm', 'B / mT'], table_rows_from_stem(s, ['d/cm', 'B/mT'])[1], 'Field along the axis of a magnet',
    'Table and graph of flux density against distance along the axis of a bar magnet: d = 2.0, 4.0, 6.0, 8.0 cm give B = 40, 5.0, 1.48, 0.625 mT, a curve that falls very steeply.',
    dict(xlabel='d / cm', ylabel='B / mT', series=[dict(x=numbers_after(s, 'd/cm'), y=numbers_after(s, 'B/mT'), kind='points')],
         xr=(0, 9), yr=(0, 44), xticks=[0, 2, 4, 6, 8], yticks=[0, 10, 20, 30, 40], h=250)))
F('A wire 0.050 m long carrying 2.0 A is placed at different angles θ to a uniform field: θ = 30°, 60°, 90°', lambda s: table_plot(
    ['θ / °', 'F / mN'], [[t, f] for t, f in zip(re.findall(r'(\d+)°', s.split('θ = ')[1].split(' and')[0]), [x.strip() for x in s.split('F/mN = ')[1].split('.')[0].split(',')])], 'Force against angle',
    'Table and graph of force against angle for a 0.050 m wire carrying 2.0 A: θ = 30°, 60°, 90° give F = 12, 21, 24 mN.',
    dict(xlabel='θ / °', ylabel='F / mN', series=[dict(x=[float(t) for t in re.findall(r'(\d+)°', s.split('θ = ')[1].split(' and')[0])], y=numbers_after(s, 'F/mN'), kind='points')],
         xr=(0, 100), yr=(0, 28), xticks=[0, 30, 60, 90], yticks=[0, 5, 10, 15, 20, 25], h=250)))
F('A rectangular loop 0.10 m × 0.20 m lies flat. Half of its area is in a field of 0.20 T pointing upwards', lambda s: split_field_loop(
    'Loop across two fields', 'Top view: a flat rectangular loop 0.10 m × 0.20 m; half of its area is in a 0.20 T field pointing upwards (out of the page, left) and half in a 0.050 T field pointing downwards (into the page, right).',
    left_label='0.20 T upwards', right_label='0.050 T downwards'))
F('A small 30-turn coil of area 1.5 cm² is placed inside a solenoid where the field is 8.0 mT', lambda s: coil_angle(
    'Coil tilted inside a solenoid', 'Side view: the uniform 8.0 mT field along the axis of a solenoid and a small 30-turn coil of area 1.5 cm², seen edge-on, with its normal at 25° to the axis.',
    grab(s, r'at (\d+)° to the solenoid'), '25°', B_label='B = 8.0 mT', coil_label='30 turns, area 1.5 cm²'))

# ── 24.4 ──
F('When a current flows through a wire between the poles of a magnet resting on a top-pan balance', lambda s: top_pan(
    'Top-pan balance', 'A U-shaped magnet with pole pieces rests on a top-pan balance; a fixed horizontal wire, held by a clamp, passes between the poles at right angles to the field.'))
F('A magnet sits on a top-pan balance with a fixed wire passing between its poles. When a current flows, the reading increases', lambda s: top_pan(
    'Top-pan balance', 'A magnet on a top-pan balance with a fixed wire, held by a clamp, passing between its poles.'))
F('A wire carrying 3.0 A crosses a 5.0 cm wide magnetic field at right angles. The balance reading changes by 0.92 g', lambda s: top_pan(
    'Top-pan balance', 'A magnet on a top-pan balance with a fixed wire carrying 3.0 A crossing the 5.0 cm wide field between its poles; the reading changes by 0.92 g.',
    I_label='I = 3.0 A', L_label='field width 5.0 cm'))
F('A Hall probe reads 4.2 mT when the field makes an angle of 30° with the normal to its face', lambda s: coil_angle(
    'Hall probe at an angle', 'Side view: a uniform field across the page and a flat Hall probe, seen edge-on, whose normal makes 30° with the field.',
    grab(s, r'angle of (\d+)°'), '30°', coil_label='Hall probe'))
F('With a current of 3.0 A, the top-pan balance reading changes by 2.4 g', lambda s: top_pan(
    'Top-pan balance', 'A magnet on a top-pan balance with a fixed wire carrying 3.0 A; 0.050 m of the wire lies in the field and the reading changes by 2.4 g.',
    I_label='I = 3.0 A', L_label='L = 0.050 m'))
F('In a top-pan balance experiment the reading increases when the current flows. When the current is reversed', lambda s: top_pan(
    'Top-pan balance', 'A magnet on a top-pan balance with a fixed wire passing between its poles; the reading increases when the current flows.'))
F('A magnet assembly reads 120.00 g on a top-pan balance', lambda s: top_pan(
    'Top-pan balance', 'A magnet assembly on a top-pan balance reading 120.00 g, with a fixed wire crossing its field for 0.040 m; the current is 4.0 A.',
    reading='120.00 g', I_label='I = 4.0 A', L_label='L = 0.040 m'))
F('In a pivoted current balance, the magnetic force on a wire 8.0 cm from the pivot is balanced by a rider of mass 0.50 g', lambda s: pivot_balance(
    'Pivoted current balance', 'A wire frame on a knife-edge pivot: the magnetic force on the wire 8.0 cm from the pivot (in the field, carrying 2.0 A with 0.050 m in the field) is balanced by a 0.50 g rider 4.0 cm from the pivot on the other side.',
    d_force='8.0 cm', d_rider='4.0 cm', rider_label='0.50 g rider', wire_label='2.0 A, 0.050 m in the field'))
F('With the current one way the balance reads 100.62 g; with it reversed the reading is 99.38 g', lambda s: top_pan(
    'Top-pan balance', 'A magnet on a top-pan balance with a fixed wire between its poles; with the current one way the reading is 100.62 g.',
    reading='100.62 g'))
F('A wire in a current balance is accidentally set at 60° to the field', lambda s: wire_angle(
    'Wire at 60° to the field', 'A uniform field across the page and a wire carrying 3.0 A at 60° to the field lines, with 0.050 m of it in the field.',
    grab(s, r'set at (\d+)°'), '60°', I_label='3.0 A'))
F('In a top-pan balance experiment, the length of wire in the field is 0.050 m. Results: I/A = 0.5, 1.0, 1.5, 2.0, 2.5', lambda s: table_plot(
    ['I / A', 'Δm / g'], table_rows_from_stem(s, ['I/A', 'Δm/g'])[1], 'Change in reading against current',
    'Table and graph of the change in balance reading against current for 0.050 m of wire: I = 0.5 to 2.5 A give Δm = 0.31, 0.61, 0.92, 1.22, 1.53 g, a straight line through the origin.',
    dict(xlabel='I / A', ylabel='Δm / g', series=[dict(x=numbers_after(s, 'I/A'), y=numbers_after(s, 'Δm/g'), kind='points')],
         xr=(0, 2.8), yr=(0, 1.7), xticks=[0, 0.5, 1.0, 1.5, 2.0, 2.5], yticks=[0, 0.5, 1.0, 1.5], h=250)))
F('A wire frame on knife edges carries 2.5 A, with a 6.0 cm side at right angles to a magnetic field', lambda s: pivot_balance(
    'Wire frame on knife edges', 'A wire frame on knife edges carrying 2.5 A, with its 6.0 cm side at right angles to a magnetic field; the magnetic force on that side is balanced by a 0.20 g mass hung on the same side at the same distance from the pivot.',
    rider_label='0.20 g mass', wire_label='2.5 A, 6.0 cm side in the field', same_side=True))
F('Hall-probe readings across the 5.0 cm gap between two pole pieces', lambda s: plot(
    'position across the gap / cm', 'B / T', [dict(x=[0.5, 1.5, 2.5, 3.5, 4.5], y=numbers_after(s, 'B/T'), kind='points')],
    'Field across the gap', 'Graph of Hall-probe readings at the midpoints of the five 1.0 cm intervals across the 5.0 cm gap: B = 0.10, 0.18, 0.20, 0.18, 0.10 T, highest at the centre.',
    xr=(0, 5), yr=(0, 0.24), xticks=[0, 1, 2, 3, 4, 5], yticks=[0, 0.05, 0.10, 0.15, 0.20]))
F('A wire in a current balance is at 70° to the field', lambda s: wire_angle(
    'Wire at 70° to the field', 'A uniform field across the page and a wire carrying 2.5 A at 70° to the field lines, with 0.10 m in the field.',
    grab(s, r'at (\d+)° to the field'), '70°', I_label='2.5 A'))
F('A magnet assembly on a top-pan balance reads 150.00 g', lambda s: top_pan(
    'Top-pan balance', 'A magnet assembly on a top-pan balance reading 150.00 g; a wire crossing its field for 4.0 cm carries 3.0 A.',
    reading='150.00 g', I_label='I = 3.0 A', L_label='L = 4.0 cm'))
