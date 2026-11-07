# Figures for ch26a.py (26.1–26.3 electromagnetic induction). Numbers come from the stems (grab).


def flux_graph(title, desc, ts, ys, xlabel, ylabel, xticks=None, yticks=None):
    return plot(xlabel, ylabel, [dict(x=ts, y=ys)], title, desc, xr=(0, ts[-1] * 1.05), yr=(0, max(ys) * 1.15),
                xticks=xticks, yticks=yticks)


# ── 26.1 ──
F('A magnet is pushed into a coil connected to a meter. It is then pushed in faster', lambda s: magnet_coil(
    'Magnet and coil', 'A bar magnet, north pole nearest, is pushed towards a coil whose ends are connected to a sensitive meter (galvanometer).',
    near='N', motion='towards'))
F('A magnet is pushed into a coil south pole first instead of north pole first', lambda s: magnet_coil(
    'Magnet and coil', 'A bar magnet is pushed south pole first towards a coil connected to a galvanometer.',
    near='S', motion='towards'))
F('Which change would increase the e.m.f. induced when a magnet moves into a coil at a fixed speed?', lambda s: magnet_coil(
    'Magnet and coil', 'A bar magnet moves towards a coil connected to a galvanometer.', near='N', motion='towards'))
F('A straight wire moves along the direction of a uniform magnetic field', lambda s: rod_angle(
    'Wire moving along the field', 'Side view: horizontal field lines B across the page and a straight wire seen end-on; its velocity v points along the field lines.',
    0.001, None))
F('A coil connected to nothing (an open circuit) has a magnet pushed into it', lambda s: magnet_coil(
    'Magnet and an open coil', 'A bar magnet, north pole first, is pushed towards a coil whose two ends are left unconnected.',
    near='N', motion='towards', meter=None))
F('Faraday wound two coils on an iron ring. When was an e.m.f. induced in the second coil?', lambda s: two_coils(
    "Faraday's iron ring", "Two separate coils wound on an iron ring. The first coil is connected to a cell through a switch; the second coil is connected to a galvanometer.",
    left=dict(kind='cell'), right=dict(kind='G'), switch='open', ring=True))
F('A flat coil moves sideways, without turning, inside a large region of uniform magnetic field', lambda s: loop_region(
    'Coil moving inside a field', 'Top view: a square coil completely inside a large region of uniform magnetic field directed into the page, moving sideways with velocity v.',
    inside=1.0, motion='in'))
F('A 0.50 m rod moves at 6.0 m s⁻¹ through a 0.20 T field, with its velocity at 30° to the field lines', lambda s: rod_angle(
    'Rod moving at an angle to the field', 'Side view: horizontal field lines of flux density 0.20 T and a 0.50 m rod seen end-on (perpendicular to the page). Its velocity of 6.0 m s⁻¹ is at 30° to the field lines.',
    grab(s, r'at (\d+)° to the field'), '30°', v_label='v = 6.0 m s⁻¹', B_label='B = 0.20 T'))
F('A 0.30 m rod moves at 4.0 m s⁻¹ across a 0.50 T field on rails connected by a 2.0 Ω resistor', lambda s: rails(
    'Rod on rails', 'Top view: a 0.30 m rod slides at 4.0 m s⁻¹ along two parallel rails joined by a 2.0 Ω resistor, in a uniform 0.50 T field into the page.',
    L_label='0.30 m', v_label='4.0 m s⁻¹', B_label='B = 0.50 T into the page', R_label='2.0 Ω'))
F('A bar magnet falls through a horizontal coil connected to a data logger', lambda s: falling_magnet(
    'Magnet falling through a coil', 'A bar magnet falls, north pole first, towards and through a horizontal coil whose ends are connected to a meter recording the e.m.f.',
    container='coil'))
F("In Faraday's iron-ring experiment, the current in the first coil is steady", lambda s: two_coils(
    "Faraday's iron ring", 'Two coils on an iron ring. The first is connected to a cell through a closed switch, so a steady current flows; the second is connected to a galvanometer.',
    left=dict(kind='cell'), right=dict(kind='G'), switch='closed', ring=True))
F('A metal rod 0.25 m long slides at a steady 4.0 m s⁻¹ along two rails joined by a 0.50 Ω resistor', lambda s: rails(
    'Rod on rails', 'Top view: a 0.25 m rod slides at a steady 4.0 m s⁻¹ along rails joined by a 0.50 Ω resistor, at right angles to a uniform 0.60 T field into the page. A force F keeps it moving.',
    L_label='0.25 m', v_label='4.0 m s⁻¹', B_label='B = 0.60 T into the page', R_label='0.50 Ω'))
F('A magnet falls through a 500-turn coil. One e.m.f. pulse is roughly a triangle', lambda s: plot(
    't / s', 'E / mV', [dict(x=[0, grab(s, r'duration of ([\d.]+) s') / 2, grab(s, r'duration of ([\d.]+) s')], y=[0, grab(s, r'peak of (\d+) mV'), 0])],
    'e.m.f. pulse', 'Graph of e.m.f. in mV against time in s: a triangular pulse rising from 0 to a peak of 40 mV at 0.05 s and back to 0 at 0.10 s.',
    xr=(0, 0.12), yr=(0, 48), xticks=[0, 0.02, 0.04, 0.06, 0.08, 0.10, 0.12], yticks=[0, 10, 20, 30, 40]))
F('A square coil of 20 turns and side 0.050 m is pulled at a steady 0.25 m s⁻¹ out of a region', lambda s: loop_region(
    'Coil leaving a field', 'Top view: a square coil of 20 turns and side 0.050 m, with one side still inside a region of uniform 0.30 T field into the page, pulled out of the region at 0.25 m s⁻¹.',
    inside=0.35, motion='out', side_label='0.050 m', v_label='0.25 m s⁻¹', B_label='B = 0.30 T', turns_label='20 turns'))
F('A horizontal east–west rod 1.5 m long is dropped from rest', lambda s: rod_angle(
    'Falling rod', "Side view looking along the rod: the Earth's horizontal field of 1.8 × 10⁻⁵ T runs across the page and the 1.5 m east–west rod, seen end-on, falls vertically, at 90° to the field.",
    -90, None, v_label='v', B_label='B = 1.8 × 10⁻⁵ T'))
F('A search coil of 500 turns and area 1.0 cm² lies face-on to a uniform field', lambda s: coil_angle(
    'Search coil face-on', 'Side view: a uniform field across the page and a flat search coil seen edge-on, face-on to the field (its normal along the field). It is turned over through 180°.',
    0, coil_label='500 turns, area 1.0 cm²', rotation=True))
F('A rod 0.20 m long accelerates uniformly from rest across a field of 0.50 T', lambda s: plot(
    't / s', 'E / V', [dict(x=[0, grab(s, r'in ([\d.]+) s\.')], y=[0, grab(s, r'to ([\d.]+) V in')])],
    'e.m.f. of an accelerating rod', 'Graph of induced e.m.f. against time: a straight line from 0 at t = 0 to 0.40 V at t = 2.0 s.',
    xr=(0, 2.2), yr=(0, 0.46), xticks=[0, 0.5, 1.0, 1.5, 2.0], yticks=[0, 0.1, 0.2, 0.3, 0.4]))
F('A rod 0.20 m long is moved at different speeds across a uniform field: v/m s⁻¹ = 1.0, 2.0, 3.0, 4.0', lambda s: table_plot(
    ['v / m s⁻¹', 'E / V'], table_rows_from_stem(s, ['v/m s⁻¹', 'E/V'])[1], 'e.m.f. against speed',
    'Table and graph of induced e.m.f. against speed for a 0.20 m rod: v = 1.0, 2.0, 3.0, 4.0 m s⁻¹ give E = 0.08, 0.16, 0.24, 0.32 V, plotted as points on a straight line through the origin.',
    dict(xlabel='v / m s⁻¹', ylabel='E / V', series=[dict(x=numbers_after(s, 'v/m s⁻¹'), y=numbers_after(s, 'E/V'), kind='points')],
         xr=(0, 4.5), yr=(0, 0.36), xticks=[0, 1, 2, 3, 4], yticks=[0, 0.1, 0.2, 0.3], h=250)))

# ── 26.2 ──
F('A metal rod moves at right angles to a magnetic field. Why does one end become negative?', lambda s: rails(
    'Rod moving through a field', 'Top view: a metal rod moving with velocity v at right angles to a uniform magnetic field directed into the page; there are no rails, so no current can flow.',
    rails=False, B_label='B into the page'))
F('A 0.40 m rod moving at 2.5 m s⁻¹ at right angles to a 0.15 T field sweeps out an area each second', lambda s: rails(
    'Rod sweeping out an area', 'Top view: a 0.40 m rod moving at 2.5 m s⁻¹ at right angles to a uniform 0.15 T field into the page.',
    rails=False, L_label=None, v_label='2.5 m s⁻¹', B_label='B = 0.15 T into the page'))
F('A 50-turn coil of area 0.010 m² is in a field of 0.10 T, with its normal at 60° to the field', lambda s: coil_angle(
    'Coil at an angle to the field', 'Side view: a uniform 0.10 T field across the page and a flat 50-turn coil of area 0.010 m², seen edge-on, whose normal makes 60° with the field.',
    grab(s, r'normal at (\d+)°'), '60°', B_label='B = 0.10 T', coil_label='50 turns, area 0.010 m²'))
F('Why does a coil rotating steadily in a uniform field produce an alternating e.m.f.?', lambda s: coil_angle(
    'Rotating coil', 'End view of a flat coil rotating steadily about a central axis in the uniform field between the poles of a magnet; the dashed arrow is the normal to the coil.',
    35, None, rotation=True, poles=True))
F('At which position of a coil rotating in a uniform field is the induced e.m.f. greatest?', lambda s: coil_angle(
    'Rotating coil', 'End view of a flat coil rotating about a central axis in the uniform field between magnet poles; the dashed arrow is the normal to the plane of the coil.',
    35, None, rotation=True, poles=True))
F('A closed loop moves through a uniform field, staying completely inside it', lambda s: loop_region(
    'Loop inside a uniform field', 'Top view: a closed square loop completely inside a large region of uniform field directed into the page, moving with velocity v.',
    inside=1.0, motion='in'))
F('An e.m.f.–time graph for a coil is a triangle with a peak of 0.30 V and a duration of 0.040 s', lambda s: plot(
    't / s', 'E / V', [dict(x=[0, grab(s, r'duration of ([\d.]+) s') / 2, grab(s, r'duration of ([\d.]+) s')], y=[0, grab(s, r'peak of ([\d.]+) V'), 0])],
    'Triangular e.m.f. pulse', 'Graph of e.m.f. against time: a triangle rising from 0 to a peak of 0.30 V at 0.020 s and returning to 0 at 0.040 s.',
    xr=(0, 0.048), yr=(0, 0.36), xticks=[0, 0.01, 0.02, 0.03, 0.04], yticks=[0, 0.1, 0.2, 0.3]))
F('A coil rotates in a uniform field about an axis parallel to the field', lambda s: coil_angle(
    'Coil and field', 'Side view of a uniform field across the page and a flat coil whose rotation axis (along its normal, dashed) is parallel to the field lines.',
    0, None, rotation=False))
F('A 40-turn coil of area 2.0 × 10⁻⁴ m² is inside a solenoid where B = 0.050 T', lambda s: solenoid_coil(
    'Coil inside a solenoid', 'A long solenoid with a small 40-turn coil of area 2.0 × 10⁻⁴ m² placed inside it, at its middle, with the plane of the coil at right angles to the field B = 0.050 T along the axis.',
    sol_label='solenoid: B = 0.050 T inside', coil_label='40-turn coil, area 2.0 × 10⁻⁴ m²', inside=True))
F('A rod lying north–south moves due east through a magnetic field pointing vertically downwards', lambda s: rails(
    'Rod moving east', 'Top view with north up the page: a rod lying north–south moves due east (to the right) through a uniform field pointing vertically downwards, into the page.',
    rails=False, B_label='B downwards (into the page)', north=True))
F('Find the flux linkage of a 200-turn coil of area 0.0030 m² when a 0.040 T field makes an angle of 50° with its normal', lambda s: coil_angle(
    'Coil at an angle to the field', 'Side view: a uniform 0.040 T field across the page and a 200-turn coil of area 0.0030 m², seen edge-on; its normal makes 50° with the field.',
    grab(s, r'angle of (\d+)°'), '50°', B_label='B = 0.040 T', coil_label='200 turns, area 0.0030 m²'))
F('For a coil rotating in a uniform field, in which position is the flux linkage greatest?', lambda s: coil_angle(
    'Rotating coil', 'End view of a flat coil rotating about a central axis in the uniform field between magnet poles; the dashed arrow is the normal to the coil.',
    35, None, rotation=True, poles=True))
F('(a) A rod of length L moves at speed v at right angles to a field B. By considering the forces on a free electron', lambda s: rails(
    'Moving rod', 'Top view: a rod of length L moving at speed v at right angles to a uniform field B directed into the page.',
    rails=False, L_label='L', B_label='B into the page'))
F('The flux linkage of a coil changes as follows: it rises steadily from 0 to 0.12 Wb', lambda s: flux_graph(
    'Flux linkage against time', 'Graph of flux linkage against time: rises steadily from 0 to 0.12 Wb between t = 0 and 0.040 s, stays at 0.12 Wb until 0.080 s, then falls steadily to zero at 0.10 s.',
    [0, grab(s, r'and ([\d.]+) s, stays'), grab(s, r'until ([\d.]+) s'), grab(s, r'by ([\d.]+) s')], [0, grab(s, r'to ([\d.]+) Wb'), grab(s, r'to ([\d.]+) Wb'), 0],
    't / s', 'NΦ / Wb', xticks=[0, 0.02, 0.04, 0.06, 0.08, 0.10], yticks=[0, 0.04, 0.08, 0.12]))
F('A square coil of 10 turns and side 0.10 m moves at 0.50 m s⁻¹ into a region of uniform field 0.40 T', lambda s: loop_region(
    'Coil entering a field', 'Top view: a square coil of 10 turns and side 0.10 m moving at 0.50 m s⁻¹ into a region of uniform 0.40 T field into the page; the region is wider than the coil.',
    inside=0.4, motion='in', side_label='0.10 m', v_label='0.50 m s⁻¹', B_label='B = 0.40 T', turns_label='10 turns'))
F('A long solenoid with 2000 turns per metre has a 100-turn coil of area 4.0 × 10⁻⁴ m² wound round its middle', lambda s: solenoid_coil(
    'Coil round a solenoid', 'A long solenoid with 2000 turns per metre; a 100-turn coil of area 4.0 × 10⁻⁴ m² is wound round its middle. The solenoid current rises from 0 to 3.0 A.',
    sol_label='solenoid: 2000 turns per metre', coil_label='100-turn coil, area 4.0 × 10⁻⁴ m²', current_label='I: 0 → 3.0 A'))
F('A rod 0.50 m long carrying an induced current of 2.0 A moves at 3.0 m s⁻¹ across a field of 0.40 T', lambda s: rails(
    'Rod on rails', 'Top view: a 0.50 m rod on rails, carrying an induced current of 2.0 A, moves at 3.0 m s⁻¹ across a uniform 0.40 T field into the page.',
    L_label='0.50 m', v_label='3.0 m s⁻¹', B_label='B = 0.40 T into the page', R_label=''))
F('A 1000-turn coil of area 0.010 m² hangs with its plane vertical, facing north', lambda s: coil_angle(
    'Coil facing north', "Top view: the Earth's horizontal field of 2.0 × 10⁻⁵ T points north (across the page) and the 1000-turn coil, seen edge-on, faces north so its normal lies along the field. It is turned through 180°.",
    0, None, B_label='2.0 × 10⁻⁵ T north', coil_label='1000 turns, area 0.010 m²', rotation=True))

# ── 26.3 ──
F('A graph of flux linkage against time for a coil is a straight line from 0.020 Wb at t = 0 to 0.080 Wb at t = 0.050 s', lambda s: plot(
    't / s', 'NΦ / Wb', [dict(x=[0, grab(s, r'Wb at t = ([\d.]+) s')], y=[grab(s, r'line from ([\d.]+) Wb'), grab(s, r'to ([\d.]+) Wb at t = [\d.]+ s')])],
    'Flux linkage against time', 'Graph of flux linkage against time: a straight line from 0.020 Wb at t = 0 to 0.080 Wb at t = 0.050 s.',
    xr=(0, 0.056), yr=(0, 0.092), xticks=[0, 0.01, 0.02, 0.03, 0.04, 0.05], yticks=[0, 0.02, 0.04, 0.06, 0.08]))
F('The field inside a solenoid falls steadily from 0.12 T to zero in 0.060 s. A 150-turn coil', lambda s: solenoid_coil(
    'Coil round a solenoid', 'A long solenoid with a 150-turn coil of radius 1.0 cm wound round its middle. The field inside the solenoid falls steadily from 0.12 T to zero in 0.060 s.',
    sol_label='solenoid: B falls from 0.12 T to zero in 0.060 s', coil_label='150-turn coil, radius 1.0 cm'))
F('A 0.10 m rod moves at 2.0 m s⁻¹ along rails across a 0.50 T field. The total circuit resistance is 0.20 Ω', lambda s: rails(
    'Rod on rails', 'Top view: a 0.10 m rod slides at 2.0 m s⁻¹ along rails across a uniform 0.50 T field into the page; the circuit resistance is 0.20 Ω.',
    L_label='0.10 m', v_label='2.0 m s⁻¹', B_label='B = 0.50 T into the page', R_label='0.20 Ω'))
F('A 300-turn coil of area 4.0 × 10⁻³ m² is turned from face-on to edge-on in a field of 0.050 T', lambda s: coil_angle(
    'Coil turned through 90°', 'Side view: a uniform 0.050 T field across the page and a 300-turn coil of area 4.0 × 10⁻³ m², shown face-on (normal along the field); it is turned until it is edge-on.',
    0, None, B_label='B = 0.050 T', coil_label='300 turns, area 4.0 × 10⁻³ m²', rotation=True))
F('A coil is pulled out of a magnetic field, first slowly and then quickly', lambda s: loop_region(
    'Coil leaving a field', 'Top view: a square coil partly inside a region of uniform field into the page, being pulled out of the region with velocity v.',
    inside=0.4, motion='out'))
F('The flux linkage of a rotating coil varies as a sine curve. At which points is the induced e.m.f. greatest?', lambda s: plot(
    't', 'NΦ', [dict(x=wave_xy(lambda t: t, 0, 2)[0], y=[cos(2 * pi * t) for t in wave_xy(lambda t: t, 0, 2)[0]])],
    'Flux linkage of a rotating coil', 'Graph of flux linkage NΦ against time t for a coil rotating steadily: a cosine curve between +NΦ₀ and −NΦ₀ over two periods T.',
    xr=(0, 2), yr=(-1.2, 1.2), xtl=[(0, '0'), (0.5, 'T/2'), (1, 'T'), (1.5, '3T/2'), (2, '2T')], ytl=[(-1, '−NΦ₀'), (0, '0'), (1, 'NΦ₀')], grid=False))
F('A 200-turn coil of area 2.0 × 10⁻³ m² is face-on to a field that rises steadily from 0 to 0.50 T in 0.20 s', lambda s: flux_graph(
    'Flux density against time', 'Graph of flux density B against time: rises steadily from 0 to 0.50 T in 0.20 s, stays at 0.50 T for 0.30 s (until 0.50 s), then falls steadily to zero in 0.10 s (at 0.60 s).',
    [0, grab(s, r'T in ([\d.]+) s'), grab(s, r'T in ([\d.]+) s') + grab(s, r'constant for ([\d.]+) s'),
     grab(s, r'T in ([\d.]+) s') + grab(s, r'constant for ([\d.]+) s') + grab(s, r'to zero in ([\d.]+) s')],
    [0, grab(s, r'to ([\d.]+) T'), grab(s, r'to ([\d.]+) T'), 0], 't / s', 'B / T',
    xticks=[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6], yticks=[0, 0.1, 0.2, 0.3, 0.4, 0.5]))
F('A rod 0.20 m long rests on horizontal rails joined by a 0.40 Ω resistor, at right angles to a vertical field of 0.50 T', lambda s: rails(
    'Rod pulled along rails', 'Top view: a 0.20 m rod on horizontal rails joined by a 0.40 Ω resistor, in a vertical 0.50 T field (into the page). A constant force of 0.10 N pulls the rod.',
    L_label='0.20 m', v_label='F = 0.10 N', B_label='B = 0.50 T (vertical, into the page)', R_label='0.40 Ω'))
F('A 100-turn coil of area 0.0050 m² rotates in a uniform field. The peak e.m.f. is measured at different frequencies', lambda s: table_plot(
    ['f / Hz', 'E₀ / V'], table_rows_from_stem(s, ['f/Hz', 'E₀/V'])[1], 'Peak e.m.f. against frequency',
    'Table and graph of peak e.m.f. against frequency: f = 5.0, 10, 15, 20 Hz give E₀ = 1.6, 3.1, 4.7, 6.3 V, plotted as points close to a straight line through the origin.',
    dict(xlabel='f / Hz', ylabel='E₀ / V', series=[dict(x=numbers_after(s, 'f/Hz'), y=numbers_after(s, 'E₀/V'), kind='points')],
         xr=(0, 22), yr=(0, 7), xticks=[0, 5, 10, 15, 20], yticks=[0, 2, 4, 6], h=250)))
F('A long solenoid with 1000 turns per metre carries a current I = 2.0 + 5.0t', lambda s: solenoid_coil(
    'Coil round a solenoid', 'A long solenoid with 1000 turns per metre carrying a current I = 2.0 + 5.0t; a 50-turn coil of area 3.0 × 10⁻⁴ m² is wound round its middle.',
    sol_label='solenoid: 1000 turns per metre, I = 2.0 + 5.0t', coil_label='50-turn coil, area 3.0 × 10⁻⁴ m²'))
F('A rod with resistance 0.50 Ω moves at 3.0 m s⁻¹ along rails across a 0.40 T field', lambda s: rails(
    'Rod on rails', 'Top view: a 0.50 m rod of resistance 0.50 Ω moves at 3.0 m s⁻¹ along rails joined by a 1.5 Ω resistor, across a uniform 0.40 T field into the page.',
    L_label='0.50 m', v_label='3.0 m s⁻¹', B_label='B = 0.40 T into the page', R_label='1.5 Ω'))
F('A circular loop of wire lies face-on to a field of 0.50 T. Its radius is decreasing', lambda s: shrinking_loop(
    'Shrinking loop', 'A circular loop of wire face-on to a uniform 0.50 T field into the page. Its radius, 0.10 m at this instant, is decreasing at 0.020 m s⁻¹ (arrows point inwards).',
    r_label='0.10 m', rate_label='radius decreasing at 0.020 m s⁻¹', B_label='B = 0.50 T into the page'))
