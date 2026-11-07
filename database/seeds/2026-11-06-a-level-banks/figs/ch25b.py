# Figures for ch25b.py (25.4 Hall effect, 25.5 discovering the electron). Numbers come from the stems.
E_, ME = 1.60e-19, 9.11e-31

# ── 25.4 ──
F('What causes a Hall voltage across a current-carrying slab in a magnetic field?', lambda s: hall_slab(
    'Hall slab', 'Top view of a thin slab carrying a current I along its length in a magnetic field into the page; a voltmeter is connected across the width of the slab.',
    B_label='B into the page'))
F('A semiconductor slice has 1.0 × 10²² charge carriers per m³ and is 1.0 mm thick', lambda s: hall_slab(
    'Semiconductor Hall slice', 'A semiconductor slice 1.0 mm thick with 1.0 × 10²² charge carriers per m³ carries 10 mA in a 0.10 T field into the page; the Hall voltage is measured across its width.',
    I_label='I = 10 mA', thick_label='thickness 1.0 mm', carriers='1.0 × 10²² carriers per m³', B_label='B = 0.10 T'))
F('Charge carriers drift at 0.20 m s⁻¹ through a semiconductor slice 5.0 mm wide in a field of 0.40 T', lambda s: hall_slab(
    'Hall slice', 'A semiconductor slice 5.0 mm wide in a 0.40 T field into the page; its charge carriers drift along it at 0.20 m s⁻¹ and the Hall voltage appears across the width.',
    I_label='carriers drift at 0.20 m s⁻¹', width_label='5.0 mm', B_label='B = 0.40 T'))
F('A Hall probe 0.50 mm thick carries 20 mA in a field of 0.50 T and gives a Hall voltage of 2.5 mV', lambda s: hall_slab(
    'Hall probe', 'A Hall probe 0.50 mm thick carrying 20 mA in a 0.50 T field into the page gives a Hall voltage of 2.5 mV across its width.',
    I_label='I = 20 mA', thick_label='thickness 0.50 mm', carriers='Hall voltage 2.5 mV', B_label='B = 0.50 T'))
F('A copper strip 0.10 mm thick carries 5.0 A at right angles to a 1.0 T field', lambda s: hall_slab(
    'Copper strip', 'A copper strip 0.10 mm thick carrying 5.0 A at right angles to a 1.0 T field (into the page); copper has 8.5 × 10²⁸ free electrons per m³.',
    I_label='I = 5.0 A', thick_label='thickness 0.10 mm', carriers='8.5 × 10²⁸ free electrons per m³', B_label='B = 1.0 T'))
F('A semiconductor Hall probe has 2.0 × 10²¹ carriers per m³ and is 0.20 mm thick', lambda s: hall_slab(
    'Semiconductor Hall probe', 'A semiconductor Hall probe 0.20 mm thick with 2.0 × 10²¹ carriers per m³ carrying 5.0 mA in a 0.25 T field into the page.',
    I_label='I = 5.0 mA', thick_label='thickness 0.20 mm', carriers='2.0 × 10²¹ carriers per m³', B_label='B = 0.25 T'))
F('A semiconductor slice 5.0 mm wide and 0.20 mm thick carries 5.0 mA', lambda s: hall_slab(
    'Semiconductor slice', 'A semiconductor slice 5.0 mm wide and 0.20 mm thick carrying 5.0 mA, with 2.0 × 10²¹ carriers per m³.',
    I_label='I = 5.0 mA', width_label='5.0 mm', thick_label='thickness 0.20 mm', carriers='2.0 × 10²¹ carriers per m³', voltmeter=False))
F('A Hall probe reads 3.0 mV when its face is at right angles to a field', lambda s: coil_angle(
    'Hall probe turned', 'Side view: a uniform field across the page and a flat Hall probe seen edge-on; the normal to its face is turned to 40° from the field direction.',
    grab(s, r'at (\d+)° to the field'), '40°', coil_label='Hall probe (face at an angle)'))
F('A sodium strip (2.5 × 10²⁸ free electrons per m³) is 0.050 mm thick and carries 1.0 A', lambda s: hall_slab(
    'Sodium strip', 'A sodium strip 0.050 mm thick with 2.5 × 10²⁸ free electrons per m³, carrying 1.0 A in a 1.0 T field into the page.',
    I_label='I = 1.0 A', thick_label='thickness 0.050 mm', carriers='2.5 × 10²⁸ free electrons per m³', B_label='B = 1.0 T'))
F('A Hall probe 0.20 mm thick carries 10 mA. Readings: B/T = 0.10, 0.20, 0.30, 0.40', lambda s: table_plot(
    ['B / T', 'V_H / mV'], table_rows_from_stem(s, ['B/T', 'V_H/mV'])[1], 'Hall voltage against flux density',
    'Table and graph of Hall voltage against flux density for a probe 0.20 mm thick carrying 10 mA: B = 0.10, 0.20, 0.30, 0.40 T give V_H = 1.1, 2.2, 3.3, 4.4 mV, a straight line through the origin.',
    dict(xlabel='B / T', ylabel='V_H / mV', series=[dict(x=numbers_after(s, 'B/T'), y=numbers_after(s, 'V_H/mV'), kind='points')],
         xr=(0, 0.45), yr=(0, 5), xticks=[0, 0.1, 0.2, 0.3, 0.4], yticks=[0, 1, 2, 3, 4, 5], h=250)))
F('A semiconductor slice is 4.0 mm wide and 0.25 mm thick, carries 2.0 mA and has 5.0 × 10²¹ carriers per m³', lambda s: hall_slab(
    'Semiconductor slice', 'A semiconductor slice 4.0 mm wide and 0.25 mm thick carrying 2.0 mA, with 5.0 × 10²¹ carriers per m³, in a 0.40 T field into the page.',
    I_label='I = 2.0 mA', width_label='4.0 mm', thick_label='thickness 0.25 mm', carriers='5.0 × 10²¹ carriers per m³', B_label='B = 0.40 T'))
F('A p-type semiconductor slice 0.15 mm thick carries 6.0 mA in a field of 0.30 T', lambda s: hall_slab(
    'p-type slice', 'A p-type semiconductor slice 0.15 mm thick carrying 6.0 mA in a 0.30 T field into the page gives a Hall voltage of 2.4 mV.',
    I_label='I = 6.0 mA', thick_label='thickness 0.15 mm', carriers='Hall voltage 2.4 mV', B_label='B = 0.30 T'))
F('A long solenoid has 3000 turns per metre and carries 2.0 A, so that B = µ₀nI', lambda s: solenoid_coil(
    'Hall probe in a solenoid', 'A long solenoid with 3000 turns per metre carrying 2.0 A; a Hall probe 0.20 mm thick with 1.0 × 10²² carriers per m³, carrying 20 mA, sits inside at the middle.',
    sol_label='solenoid: 3000 turns per metre, 2.0 A', coil_label='Hall probe inside: 0.20 mm thick, 20 mA', inside=True))

# ── 25.5 ──
F('Cathode rays passing between two charged plates bend towards the positive plate', lambda s: plates(
    'Cathode rays between plates', 'A beam of cathode rays enters midway between two charged parallel plates (top positive) and bends towards the positive plate.',
    beam=dict(path='up', label='cathode rays', is_value=False)))
F('A beam of electrons moving at 1.0 × 10⁷ m s⁻¹ is bent into a circle of radius 5.7 cm by a field of 1.0 mT', lambda s: circle_orbit(
    'Electron beam in a circle', 'An electron beam moving at 1.0 × 10⁷ m s⁻¹ is bent into a circle of radius 5.7 cm by a uniform 1.0 mT field directed into the page.',
    into=True, clockwise=True, gun=True, r_label='5.7 cm', B_label='B = 1.0 mT'))
F("In Thomson's apparatus a beam is undeflected when E = 1.5 × 10⁴ V m⁻¹ and B = 5.0 × 10⁻⁴ T", lambda s: selector(
    "Thomson's crossed fields", 'Crossed electric and magnetic fields: E = 1.5 × 10⁴ V m⁻¹ between the plates and B = 5.0 × 10⁻⁴ T; the electron beam passes straight through.',
    E_label='E = 1.5 × 10⁴ V m⁻¹', B_label='B = 5.0 × 10⁻⁴ T', particle='electron beam'))
F('In a fine-beam tube, electrons accelerated through 250 V follow a circle of radius 4.4 cm in a field of 1.2 mT', lambda s: circle_orbit(
    'Fine-beam tube', 'In a fine-beam tube, electrons accelerated through 250 V leave the electron gun and follow a circle of radius 4.4 cm in a uniform 1.2 mT field.',
    into=True, clockwise=True, gun=True, r_label='4.4 cm', B_label='B = 1.2 mT'))
F('Electrons accelerated through 200 V enter a field of 0.80 mT at right angles. Using e/m', lambda s: circle_orbit(
    'Electron path in a field', 'Electrons accelerated through 200 V enter a uniform 0.80 mT field at right angles and move in a circle.',
    into=True, clockwise=True, gun=True, B_label='B = 0.80 mT'))
F("Thomson's beam is undeflected with E = 2.0 × 10⁴ V m⁻¹ and B = 1.0 mT", lambda s: selector(
    "Thomson's crossed fields", 'Crossed fields with E = 2.0 × 10⁴ V m⁻¹ and B = 1.0 mT leave the electron beam undeflected; with E removed the beam follows a circle of radius 11.4 cm.',
    E_label='E = 2.0 × 10⁴ V m⁻¹', B_label='B = 1.0 mT', particle='electron beam'))
F('In a fine-beam tube, the accelerating p.d. is increased while B stays the same', lambda s: circle_orbit(
    'Fine-beam tube', 'In a fine-beam tube, electrons from an electron gun follow a circular path in a uniform magnetic field directed into the page.',
    into=True, clockwise=True, gun=True))
F('Electrons moving at 2.0 × 10⁷ m s⁻¹ pass between plates 5.0 cm long where E = 1.0 × 10⁴ V m⁻¹', lambda s: plates(
    'Electrons between plates', 'Electrons moving at 2.0 × 10⁷ m s⁻¹ enter midway between plates 5.0 cm long with a field of 1.0 × 10⁴ V m⁻¹ and are deflected towards the positive plate.',
    length_label='5.0 cm', labels=[(200, 20, 'E = 1.0 × 10⁴ V m⁻¹', 'middle', None)], beam=dict(path='up', label='2.0 × 10⁷ m s⁻¹', is_value=None)))
F('Electrons accelerated through 250 V follow a circle of radius 6.0 cm in a field of 0.90 mT', lambda s: circle_orbit(
    'Electron circle', 'Electrons accelerated through 250 V follow a circle of radius 6.0 cm in a uniform 0.90 mT field.',
    into=True, clockwise=True, gun=True, r_label='6.0 cm', B_label='B = 0.90 mT'))
F('In a fine-beam tube, the direction of the magnetic field is reversed. What happens to the beam?', lambda s: circle_orbit(
    'Fine-beam tube', 'In a fine-beam tube, electrons leave the gun and circle clockwise in a uniform field directed into the page (before the field is reversed).',
    into=True, clockwise=True, gun=True))
F("In Thomson's apparatus, plates 3.0 cm apart have a p.d. of 1500 V and the magnetic field is 1.5 mT", lambda s: selector(
    "Thomson's apparatus", 'Plates 3.0 cm apart with a p.d. of 1500 V and a magnetic field of 1.5 mT; electrons of one speed pass straight through.',
    gap_label='3.0 cm', E_label='p.d. 1500 V', B_label='B = 1.5 mT', particle='electrons'))
F('In a fine-beam tube with a fixed field of 1.0 mT, the radius r is measured for different accelerating p.d.s V', lambda s: table_plot(
    ['V / V', 'r / cm'], table_rows_from_stem(s, ['V/V', 'r/cm'])[1], 'Radius against p.d.',
    'Table and graph of the radius of the electron circle against accelerating p.d. at 1.0 mT: V = 150, 200, 250, 300 V give r = 4.13, 4.77, 5.33, 5.84 cm, plotted as points.',
    dict(xlabel='V / V', ylabel='r / cm', series=[dict(x=numbers_after(s, 'V/V'), y=numbers_after(s, 'r/cm'), kind='points')],
         xr=(0, 320), yr=(0, 7), xticks=[0, 100, 200, 300], yticks=[0, 2, 4, 6], h=250)))
F('In a Thomson-type experiment, plates 2.0 cm apart with a p.d. of 400 V', lambda s: plates(
    'Thomson-type experiment', 'Plates 2.0 cm apart and 6.0 cm long with a p.d. of 400 V. With the magnetic field off, the beam is deflected by 3.96 mm over the length of the plates.',
    gap_label='2.0 cm', length_label='6.0 cm', labels=[(200, 20, 'p.d. 400 V', 'middle', None)], beam=dict(path='up', label='electrons', is_value=False)))
F('An oil drop of mass 9.6 × 10⁻¹⁵ kg is held stationary between plates 1.0 cm apart', lambda s: oil_drop(
    'Oil drop held stationary', 'An oil drop of mass 9.6 × 10⁻¹⁵ kg held stationary between horizontal plates 1.0 cm apart with a p.d. of 980 V: the upward electric force balances its weight.',
    gap_label='1.0 cm', V_label='p.d. 980 V', mass_label='9.6 × 10⁻¹⁵ kg'))
F('Electrons moving at 2.0 × 10⁷ m s⁻¹ cross a region 3.0 cm wide containing a field of 1.0 mT', lambda s: strip_arc(
    'Beam crossing a field region', 'Electrons moving at 2.0 × 10⁷ m s⁻¹ cross a region 3.0 cm wide containing a uniform 1.0 mT field and leave deflected through 15.3°.',
    grab(s, r'region ([\d.]+) cm'), ME * 2.0e7 / (E_ * 1.0e-3) * 100, width_label='3.0 cm', B_label='B = 1.0 mT', v_label='2.0 × 10⁷ m s⁻¹'))
