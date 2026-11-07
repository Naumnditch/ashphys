# Figures for ch23a.py (23.1–23.4 capacitance). Numbers come from the stems.


def ser(caps, V, title, desc, sw=False):
    src = Series(El('cell', V), El('switch', closed=True)) if sw else El('cell', V)
    return circuit(Series(*[El('C', c) for c in caps]), src, title, desc)


def par(caps, V, title, desc):
    return circuit(Par(*[El('C', c) for c in caps]), El('cell', V), title, desc)


def rc(title, desc, C=None, R=None, V=None, closed=False):
    return circuit(Series(El('R', R), El('C', C)), Series(El('cell', V), El('switch', closed=closed)), title, desc)


def tp(s, cols, heads, title, desc, xr, yr, xt, yt):
    return table_plot(heads, table_rows_from_stem(s, cols)[1], title, desc,
                      dict(xlabel=heads[0], ylabel=heads[1], series=[dict(x=numbers_after(s, cols[0]), y=numbers_after(s, cols[1]), kind='points')],
                           xr=xr, yr=yr, xticks=xt, yticks=yt, h=250))


# ── 23.1 ──
F('For a parallel-plate capacitor, C = ε₀A/d. It stays connected to a battery while its plate separation is doubled', lambda s: cap_plates(
    'Parallel-plate capacitor', 'A parallel-plate capacitor with plate separation d, connected to a battery that stays connected while d is doubled.',
    gap_label='d', supply='battery', charges=True))
F('A parallel-plate capacitor has plates of area 0.040 m² separated by 1.0 mm of air', lambda s: cap_plates(
    'Parallel-plate capacitor', 'Two parallel plates, each of area 0.040 m², separated by 1.0 mm of air.',
    area_label='area 0.040 m²', gap_label='1.0 mm'))
F('A capacitor is charged through a resistor from a battery. Why does the charging current decrease with time?', lambda s: rc(
    'Charging circuit', 'A capacitor in series with a resistor, a battery and a switch.'))
F('A charged capacitor is disconnected from its battery. A sheet of dielectric is then slid between its plates', lambda s: cap_plates(
    'Isolated charged capacitor', 'A charged parallel-plate capacitor, disconnected from its battery (isolated), with a sheet of dielectric slid between the plates.',
    dielectric='dielectric', charges=True))
F('While a capacitor charges, the current falls steadily from 3.0 mA to zero in 4.0 s', lambda s: plot(
    't / s', 'I / mA', [dict(x=[0, grab(s, r'zero in ([\d.]+) s')], y=[grab(s, r'from ([\d.]+) mA'), 0], kind='area'),
                        dict(x=[0, grab(s, r'zero in ([\d.]+) s')], y=[grab(s, r'from ([\d.]+) mA'), 0])],
    'Charging current', 'Graph of charging current against time: a straight line falling from 3.0 mA at t = 0 to zero at 4.0 s. The shaded area under the line is the charge stored.',
    xr=(0, 4.5), yr=(0, 3.5), xticks=[0, 1, 2, 3, 4], yticks=[0, 1, 2, 3]))
F('A capacitor is connected through a resistor to a 6.0 V battery and left for a long time', lambda s: rc(
    'Charging circuit', 'A capacitor in series with a resistor, a 6.0 V battery and a closed switch.', V='6.0 V', closed=True))
F('A capacitor has plates of area 0.020 m² separated by a 0.50 mm sheet of dielectric', lambda s: cap_plates(
    'Capacitor with a dielectric', 'Two parallel plates of area 0.020 m² separated by a 0.50 mm sheet of dielectric of relative permittivity 4.0.',
    area_label='area 0.020 m²', gap_label='0.50 mm', dielectric='εᵣ = 4.0'))
F('A capacitor is charged by a constant current of 0.10 mA. The p.d. across it is recorded', lambda s: tp(
    s, ['t/s', 'V/V'], ['t / s', 'V / V'], 'p.d. against time at constant current',
    'Table and graph of p.d. against time for a capacitor charged by a constant 0.10 mA: t = 0, 10, 20, 30, 40 s give V = 0, 2.1, 4.3, 6.4, 8.5 V, a straight line through the origin.',
    (0, 44), (0, 9.5), [0, 10, 20, 30, 40], [0, 2, 4, 6, 8]))
F('A parallel-plate air capacitor has plates of area 0.25 m² separated by 2.0 mm', lambda s: cap_plates(
    'Parallel-plate capacitor', 'Two parallel plates of area 0.25 m² separated by 2.0 mm of air.', area_label='area 0.25 m²', gap_label='2.0 mm'))
F('A thundercloud and the ground can be modelled as a parallel-plate capacitor', lambda s: cap_plates(
    'Cloud and ground as a capacitor', 'Model: the base of a thundercloud, of area 1.0 × 10⁷ m², and the ground beneath it form a parallel-plate capacitor with a separation of 1.0 km.',
    top_label='cloud base: area 1.0 × 10⁷ m²', bottom_label='ground', gap_label='1.0 km', charges=True))
F('A student uses a coulombmeter to measure the charge on a capacitor at different p.d.s', lambda s: tp(
    s, ['V/V', 'Q/µC'], ['V / V', 'Q / µC'], 'Charge against p.d.',
    'Table and graph of charge against p.d.: V = 2.0, 4.0, 6.0, 8.0 V give Q = 0.94, 1.90, 2.80, 3.78 µC, close to a straight line through the origin.',
    (0, 9), (0, 4.2), [0, 2, 4, 6, 8], [0, 1, 2, 3, 4]))
F('An air-filled capacitor of 200 pF stays connected to a 50 V supply while a slab of dielectric', lambda s: cap_plates(
    'Inserting a dielectric', 'An air-filled 200 pF capacitor connected to a 50 V supply; a slab of dielectric of relative permittivity 3.0 is inserted to fill the gap.',
    area_label='200 pF (air)', dielectric='εᵣ = 3.0', supply='50 V'))
F('A 60 pF parallel-plate capacitor is charged to 120 V and then disconnected from the supply', lambda s: cap_plates(
    'Isolated capacitor', 'A 60 pF parallel-plate capacitor charged to 120 V and disconnected; its plate separation d is then increased to four times its original value.',
    area_label='60 pF, 120 V', gap_label='d', charges=True))
F('A capacitor is charged from a 9.0 V supply through a resistor. The current is recorded', lambda s: tp(
    s, ['t/s', 'I/mA'], ['t / s', 'I / mA'], 'Charging current against time',
    'Table and graph of charging current against time: t = 0, 10, 20, 30 s give I = 2.0, 1.2, 0.72, 0.43 mA, a curve falling towards zero.',
    (0, 33), (0, 2.2), [0, 10, 20, 30], [0, 0.5, 1.0, 1.5, 2.0]))

# ── 23.2 ──
F('A capacitor is charged fully from a battery through a resistor. What fraction of the energy', lambda s: rc(
    'Charging circuit', 'A capacitor charged from a battery through a resistor and a switch.'))
F('A 100 µF capacitor is charged to 12 V by a battery through a resistor', lambda s: rc(
    'Charging circuit', 'A 100 µF capacitor charged to 12 V by a 12 V battery through a resistor and a switch.', C='100 µF', V='12 V'))
F('A graph of p.d. against charge for a capacitor is a straight line from the origin to 8.0 V at 4.0 mC', lambda s: plot(
    'Q / mC', 'V / V', [dict(x=[0, grab(s, r'at ([\d.]+) mC')], y=[0, grab(s, r'to ([\d.]+) V at')], kind='area'),
                        dict(x=[0, grab(s, r'at ([\d.]+) mC')], y=[0, grab(s, r'to ([\d.]+) V at')])],
    'p.d. against charge', 'Graph of p.d. against charge: a straight line from the origin to 8.0 V at 4.0 mC; the shaded triangle under it represents the energy stored.',
    xr=(0, 4.5), yr=(0, 9), xticks=[0, 1, 2, 3, 4], yticks=[0, 2, 4, 6, 8]))
F('A 4700 µF capacitor discharges from 9.0 V to 3.0 V', lambda s: (lambda C, V1, V2: plot(
    'Q / mC', 'V / V', [dict(x=[C * V2 * 1e3, C * V1 * 1e3], y=[V2, V1], kind='area'), dict(x=[0, C * V1 * 1e3 * 1.08], y=[0, V1 * 1.08])],
    'Energy released', 'Graph of p.d. against charge for the 4700 µF capacitor: a straight line through the origin. The shaded strip between 3.0 V and 9.0 V is the energy released.',
    xr=(0, C * V1 * 1e3 * 1.1), yr=(0, V1 * 1.15), hlines=[(V1, '9.0 V', True), (V2, '3.0 V', True)], nx=5))(4700e-6, grab(s, r'from ([\d.]+) V'), grab(s, r'to ([\d.]+) V')))
F('A student charges a capacitor and records: V/V = 0, 2.5, 5.0, 7.5, 10.0', lambda s: tp(
    s, ['V/V', 'Q/mC'], ['V / V', 'Q / mC'], 'Charge against p.d.',
    'Table and graph of charge against p.d.: V = 0, 2.5, 5.0, 7.5, 10.0 V give Q = 0, 1.1, 2.2, 3.3, 4.4 mC, a straight line through the origin.',
    (0, 11), (0, 5), [0, 2.5, 5.0, 7.5, 10.0], [0, 1, 2, 3, 4]))
F('A 100 µF capacitor charged to 12 V is connected across an uncharged 50 µF capacitor', lambda s: share_circuit(
    'Sharing charge', 'A 100 µF capacitor charged to 12 V is joined through a switch to an uncharged 50 µF capacitor.', '100 µF, 12 V', '50 µF'))
F('A student measures the energy stored in a capacitor at several p.d.s', lambda s: tp(
    s, ['V/V', 'W/mJ'], ['V / V', 'W / mJ'], 'Energy against p.d.',
    'Table and graph of energy stored against p.d.: V = 2.0, 4.0, 6.0, 8.0 V give W = 0.94, 3.76, 8.46, 15.0 mJ, a curve rising more and more steeply.',
    (0, 9), (0, 16), [0, 2, 4, 6, 8], [0, 5, 10, 15]))
F('An 80 pF parallel-plate capacitor (C = ε₀A/d) is charged to 250 V and disconnected', lambda s: cap_plates(
    'Isolated capacitor', 'An 80 pF parallel-plate capacitor charged to 250 V and disconnected; its plates are pulled apart until the separation d is three times as large.',
    area_label='80 pF, 250 V', gap_label='d', charges=True))

# ── 23.3 ──
F('Across a 9.0 V supply, a 33 µF capacitor sits alongside two other capacitors in parallel', lambda s: par(
    ['33 µF', 'C₂', 'C₃'], '9.0 V', 'Three capacitors in parallel', 'A 33 µF capacitor and two other capacitors, C₂ and C₃, connected in parallel across a 9.0 V supply.'))
F('Capacitors of 2.0 µF, 3.0 µF and 5.0 µF are connected in parallel across a 6.0 V supply', lambda s: par(
    ['2.0 µF', '3.0 µF', '5.0 µF'], '6.0 V', 'Three capacitors in parallel', 'Capacitors of 2.0 µF, 3.0 µF and 5.0 µF in parallel across a 6.0 V supply.'))
F('A 3.0 µF capacitor and a 7.0 µF capacitor are in parallel and together hold a total charge of 50 µC', lambda s: par(
    ['3.0 µF', '7.0 µF'], 'V', 'Two capacitors in parallel', 'A 3.0 µF and a 7.0 µF capacitor in parallel across a supply of p.d. V; together they hold 50 µC.'))
F('Capacitors of 10 µF and 20 µF are in parallel across a 6.0 V supply. A 30 µF capacitor is then added', lambda s: par(
    ['10 µF', '20 µF', '30 µF'], '6.0 V', 'Adding a capacitor in parallel', 'Capacitors of 10 µF and 20 µF in parallel across a 6.0 V supply, with a 30 µF capacitor added in parallel.'))
F('A 20 µF capacitor charged to 9.0 V is disconnected from its supply and connected across an uncharged 10 µF', lambda s: share_circuit(
    'Sharing charge', 'A 20 µF capacitor charged to 9.0 V is joined through a switch to an uncharged 10 µF capacitor.', '20 µF, 9.0 V', '10 µF'))
F('A 20 µF capacitor charged to 9.0 V is connected across an uncharged 10 µF capacitor, and the common p.d. becomes 6.0 V', lambda s: share_circuit(
    'Sharing charge', 'A 20 µF capacitor charged to 9.0 V joined through a switch to an uncharged 10 µF capacitor; afterwards both are at 6.0 V.', '20 µF, 9.0 V', '10 µF'))
F('A 47 µF capacitor and a 100 µF capacitor are connected in parallel across 12 V', lambda s: par(
    ['47 µF', '100 µF'], '12 V', 'Two capacitors in parallel', 'A 47 µF and a 100 µF capacitor in parallel across a 12 V supply.'))
F('Capacitors of 22 µF, 47 µF and 33 µF are connected in parallel to a battery', lambda s: par(
    ['22 µF', '47 µF', '33 µF'], None, 'Three capacitors in parallel', 'Capacitors of 22 µF, 47 µF and 33 µF connected in parallel to a battery.'))
F('A capacitor of capacitance C charged to p.d. V is connected across an identical uncharged capacitor', lambda s: share_circuit(
    'Sharing charge', 'A capacitor C charged to p.d. V is joined through a switch to an identical uncharged capacitor C.', 'C, charged to V', 'C, uncharged'))
F('A 470 µF capacitor is charged to 12 V and then connected across an uncharged 220 µF capacitor', lambda s: share_circuit(
    'Sharing charge', 'A 470 µF capacitor charged to 12 V is joined through a switch to an uncharged 220 µF capacitor.', '470 µF, 12 V', '220 µF'))
F('A 10 µF capacitor C₁ is charged to 12 V and connected across an uncharged 20 µF capacitor C₂', lambda s: share_circuit(
    'Sharing charge', 'Capacitor C₁ (10 µF) charged to 12 V is joined through a switch to an uncharged 20 µF capacitor C₂.', 'C₁: 10 µF, 12 V', 'C₂: 20 µF'))
F('A student connects increasing numbers n of nominally identical capacitors in parallel', lambda s: tp(
    s, ['n =', 'C/µF'], ['n', 'C / µF'], 'Capacitance against number in parallel',
    'Table and graph of total capacitance against the number n of capacitors in parallel: n = 1, 2, 3, 4 give C = 4.6, 9.5, 14.0, 18.9 µF, close to a straight line through the origin.',
    (0, 4.5), (0, 21), [0, 1, 2, 3, 4], [0, 5, 10, 15, 20]))
F('A 20 µF capacitor charged to 10 V and a 30 µF capacitor charged to 5.0 V are joined', lambda s: share_circuit(
    'Joining charged capacitors', 'A 20 µF capacitor charged to 10 V and a 30 µF capacitor charged to 5.0 V are joined through a switch, positive plate to positive plate.', '20 µF, 10 V', '30 µF, 5.0 V'))
F('A 10 µF and a 40 µF capacitor are connected in parallel across a 20 V supply', lambda s: par(
    ['10 µF', '40 µF'], '20 V', 'Two capacitors in parallel', 'A 10 µF and a 40 µF capacitor in parallel across a 20 V supply.'))
F('To measure an unknown capacitance C, a 470 µF capacitor is charged to 9.0 V', lambda s: share_circuit(
    'Measuring an unknown capacitance', 'A 470 µF capacitor charged to 9.0 V is joined through a switch to an unknown, uncharged capacitor C; a high-resistance voltmeter across C then reads 6.3 V.',
    '470 µF, 9.0 V', 'C', meter=True))

# ── 23.4 ──
SR = 'Capacitors in series'
F('Two 2.0 µF capacitors in series are connected across a 12 V supply', lambda s: ser(['2.0 µF', '2.0 µF'], '12 V', SR, 'Two 2.0 µF capacitors in series across a 12 V supply.'))
F('Three 1.0 µF capacitors are connected in series across a 9.0 V supply', lambda s: ser(['1.0 µF'] * 3, '9.0 V', SR, 'Three 1.0 µF capacitors in series across a 9.0 V supply.'))
F('How do the inner plates of two capacitors in series become charged', lambda s: ser(['C₁', 'C₂'], None, SR, 'Two capacitors C₁ and C₂ in series across a battery; their inner plates are joined to each other but not to the battery.'))
F('A 4.0 µF and a 6.0 µF capacitor are connected in series across a 20 V supply. Calculate the charge', lambda s: ser(['4.0 µF', '6.0 µF'], '20 V', SR, 'A 4.0 µF and a 6.0 µF capacitor in series across a 20 V supply.'))
F('A 4.0 µF and a 6.0 µF capacitor in series across 20 V each carry 48 µC', lambda s: ser(['4.0 µF', '6.0 µF'], '20 V', SR, 'A 4.0 µF and a 6.0 µF capacitor in series across a 20 V supply; each carries 48 µC.'))
F('Capacitors of 2.0 µF, 3.0 µF and 6.0 µF are connected in series across a 12 V supply', lambda s: ser(['2.0 µF', '3.0 µF', '6.0 µF'], '12 V', SR, 'Capacitors of 2.0 µF, 3.0 µF and 6.0 µF in series across a 12 V supply.'))
F('Two 100 µF capacitors in series are charged to a total p.d. of 50 V', lambda s: ser(['100 µF', '100 µF'], '50 V', SR, 'Two 100 µF capacitors in series charged by a 50 V supply.'))
F('A 2.0 µF and an 8.0 µF capacitor are in series across a 10 V supply', lambda s: ser(['2.0 µF', '8.0 µF'], '10 V', SR, 'A 2.0 µF and an 8.0 µF capacitor in series across a 10 V supply.'))
F('A 22 µF and a 47 µF capacitor in series are connected across 9.0 V', lambda s: ser(['22 µF', '47 µF'], '9.0 V', SR, 'A 22 µF and a 47 µF capacitor in series across 9.0 V.'))
F('Three identical 0.30 µF capacitors, each rated at 2.0 kV, are connected in series across a 5.0 kV supply', lambda s: ser(['0.30 µF'] * 3, '5.0 kV', SR, 'Three 0.30 µF capacitors, each rated at 2.0 kV, in series across a 5.0 kV supply.'))
F('A 10 µF and a 40 µF capacitor are connected in series across 25 V', lambda s: ser(['10 µF', '40 µF'], '25 V', SR, 'A 10 µF and a 40 µF capacitor in series across 25 V.'))
F('A 3.3 µF and a 6.8 µF capacitor in series are charged by a 15 V supply', lambda s: ser(['3.3 µF', '6.8 µF'], '15 V', SR, 'A 3.3 µF and a 6.8 µF capacitor in series charged by a 15 V supply.'))
F('A capacitive voltage divider uses a 100 pF capacitor in series with a 900 pF capacitor', lambda s: ser(['100 pF', '900 pF'], '1000 V', 'Capacitive voltage divider', 'A 100 pF capacitor in series with a 900 pF capacitor across a 1000 V source.'))
F('A 2.0 µF capacitor and a 3.0 µF capacitor are each rated at 50 V. They are connected in series', lambda s: ser(['2.0 µF (50 V)', '3.0 µF (50 V)'], None, SR, 'A 2.0 µF and a 3.0 µF capacitor, each rated at 50 V, in series across a supply.'))
F('A 4.0 µF and a 12 µF capacitor are connected in series across a 16 V supply', lambda s: ser(['4.0 µF', '12 µF'], '16 V', SR, 'A 4.0 µF and a 12 µF capacitor in series across a 16 V supply.'))
F('A 2.0 µF and a 6.0 µF capacitor are connected in series across a 12 V supply. They are then disconnected', lambda s: ser(['2.0 µF', '6.0 µF'], '12 V', SR, 'A 2.0 µF and a 6.0 µF capacitor in series across a 12 V supply (before they are reconnected in parallel).'))
F('Three 6.0 µF capacitors are connected in series across an 18 V supply. One of them breaks down', lambda s: ser(['6.0 µF'] * 3, '18 V', SR, 'Three 6.0 µF capacitors in series across an 18 V supply (before one of them fails).'))
F('A student connects n identical capacitors in series and measures the combined capacitance C', lambda s: tp(
    s, ['n =', '(1/C)/µF⁻¹'], ['n', '(1/C) / µF⁻¹'], '1/C against number in series',
    'Table and graph of 1/C against the number n of identical capacitors in series: n = 1, 2, 3, 4 give 1/C = 0.213, 0.426, 0.638, 0.851 µF⁻¹, a straight line through the origin.',
    (0, 4.5), (0, 0.95), [0, 1, 2, 3, 4], [0, 0.2, 0.4, 0.6, 0.8]))
F('An unknown capacitor is connected in series with a 10 µF capacitor across a 12 V supply', lambda s: circuit(
    Series(El('C', 'C'), Par(El('C', '10 µF'), El('V', '8.0 V'))), El('cell', '12 V'),
    'Finding an unknown capacitance', 'An unknown capacitor C in series with a 10 µF capacitor across a 12 V supply; a high-resistance voltmeter across the 10 µF capacitor reads 8.0 V.'))
F('Three identical 3.3 µF capacitors are connected in series across a 9.9 V supply', lambda s: ser(['3.3 µF'] * 3, '9.9 V', SR, 'Three 3.3 µF capacitors in series across a 9.9 V supply.'))
