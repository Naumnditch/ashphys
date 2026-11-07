# Figures for ch19.py (Chapter 19 thermodynamics). Numbers come from the stems.


# ── 19.1 ──
F('A temperature–time graph for a liquid cooling to a solid shows a horizontal section at 54 °C', lambda s: plot(
    't / min', 'θ / °C', [dict(x=[0, 4, 12, 16], y=[80, grab(s, r'at (\d+) °C'), grab(s, r'at (\d+) °C'), 30])], 'Cooling curve',
    'Temperature against time for a liquid cooling to a solid: the temperature falls, stays constant at 54 °C for a while, then falls again.',
    xr=(0, 17), yr=(0, 90), xticks=[0, 4, 8, 12, 16], yticks=[0, 20, 40, 60, 80], hlines=[(grab(s, r'at (\d+) °C'), '54 °C', True)]))
F('A heater supplies energy at a constant rate to 0.30 kg of a substance that starts as a solid', lambda s: (lambda t1, T0, T1, t2: plot(
    't / s', 'θ / °C', [dict(x=[0, t1, t1 + t2, t1 + t2 + 60], y=[T0, T1, T1, T1 + 30])], 'Heating curve',
    'Temperature against time: the solid warms from 20 °C to 80 °C in 120 s, stays at 80 °C for 300 s while it melts, then the liquid warms again.',
    xr=(0, 500), yr=(0, 120), xticks=[0, 100, 200, 300, 400, 500], yticks=[0, 20, 40, 60, 80, 100]))(
    grab(s, r'in (\d+) s, stays'), grab(s, r'from (\d+) °C to'), grab(s, r'to (\d+) °C in'), grab(s, r'for (\d+) s, then')))

# ── 19.2 ──
F('A gas expands at a constant pressure of 2.0 × 10⁵ Pa, increasing its volume by 3.0 × 10⁻³ m³', lambda s: plot(
    'V', 'p / 10⁵ Pa', [dict(x=[1, 4], y=[2.0, 2.0], kind='area'), dict(x=[1, 4], y=[2.0, 2.0])], 'Expansion at constant pressure',
    'p–V graph: a horizontal line at 2.0 × 10⁵ Pa as the volume increases by 3.0 × 10⁻³ m³. The shaded rectangle under the line is the work done by the gas.',
    xr=(0, 5), yr=(0, 2.6), xtl=[(1, 'V₁'), (4, 'V₁ + 3.0 × 10⁻³ m³')], yticks=[0, 0.5, 1.0, 1.5, 2.0, 2.5]))
F('Calculate the work done on a gas when it is compressed at a constant pressure of 1.2 × 10⁵ Pa from 4.0 × 10⁻³ m³ to 2.5 × 10⁻³ m³', lambda s: plot(
    'V / 10⁻³ m³', 'p / 10⁵ Pa', [dict(x=[2.5, 4.0], y=[1.2, 1.2], kind='area'), dict(x=[4.0, 2.5], y=[1.2, 1.2])],
    'Compression at constant pressure', 'p–V graph: a horizontal line at 1.2 × 10⁵ Pa from 4.0 × 10⁻³ m³ to 2.5 × 10⁻³ m³; the shaded area is the work done on the gas.',
    xr=(0, 5), yr=(0, 1.6), xticks=[0, 1.0, 2.0, 3.0, 4.0, 5.0], yticks=[0, 0.4, 0.8, 1.2, 1.6],
    ))
F('A gas in a cylinder expands at a pressure of 1.0 × 10⁵ Pa. The piston of area 0.020 m² moves out 0.15 m', lambda s: piston_cylinder(
    'Gas pushing a piston out', 'Gas at 1.0 × 10⁵ Pa in a cylinder pushes a piston of area 0.020 m² outwards through 0.15 m.',
    area_label='piston area 0.020 m²', atm_label='gas at 1.0 × 10⁵ Pa; piston moves out 0.15 m'))
F('A gas at a constant pressure of 1.5 × 10⁵ Pa is heated with 900 J and expands from 2.0 × 10⁻³ m³ to 4.0 × 10⁻³ m³', lambda s: plot(
    'V / 10⁻³ m³', 'p / 10⁵ Pa', [dict(x=[2.0, 4.0], y=[1.5, 1.5], kind='area'), dict(x=[2.0, 4.0], y=[1.5, 1.5])],
    'Expansion at constant pressure', 'p–V graph: a horizontal line at 1.5 × 10⁵ Pa from 2.0 × 10⁻³ m³ to 4.0 × 10⁻³ m³; the shaded area is the work done by the gas.',
    xr=(0, 5), yr=(0, 2.0), xticks=[0, 1, 2, 3, 4, 5], yticks=[0, 0.5, 1.0, 1.5, 2.0]))
F('A gas is compressed at a constant 3.0 × 10⁵ Pa from 0.050 m³ to 0.035 m³', lambda s: plot(
    'V / m³', 'p / 10⁵ Pa', [dict(x=[0.035, 0.050], y=[3.0, 3.0], kind='area'), dict(x=[0.050, 0.035], y=[3.0, 3.0])],
    'Compression at constant pressure', 'p–V graph: a horizontal line at 3.0 × 10⁵ Pa from 0.050 m³ to 0.035 m³; the shaded area is the work done on the gas.',
    xr=(0, 0.06), yr=(0, 4), xticks=[0, 0.01, 0.02, 0.03, 0.04, 0.05, 0.06], yticks=[0, 1, 2, 3, 4]))
F('A gas cylinder\'s piston (area 0.015 m²) is pushed in 8.0 cm against a constant gas pressure of 2.4 × 10⁵ Pa', lambda s: piston_cylinder(
    'Compressing gas with a piston', 'A piston of area 0.015 m² is pushed 8.0 cm into a cylinder against a constant gas pressure of 2.4 × 10⁵ Pa.',
    area_label='piston area 0.015 m²', atm_label='gas at 2.4 × 10⁵ Pa; piston pushed in 8.0 cm'))
F('A p–V graph shows a gas expanding at constant pressure 4.0 × 10⁵ Pa from 1.0 × 10⁻³ m³ to 3.5 × 10⁻³ m³', lambda s: plot(
    'V / 10⁻³ m³', 'p / 10⁵ Pa', [dict(x=[1.0, 3.5], y=[4.0, 4.0], kind='area'), dict(x=[1.0, 3.5], y=[4.0, 4.0])],
    'p–V graph', 'p–V graph: the gas expands at a constant 4.0 × 10⁵ Pa from 1.0 × 10⁻³ m³ to 3.5 × 10⁻³ m³; the area under the line is shaded.',
    xr=(0, 4.2), yr=(0, 5), xticks=[0, 1, 2, 3, 4], yticks=[0, 1, 2, 3, 4, 5]))
F('A gas is taken round a cycle ABCA. A → B: heated at constant volume, 500 J supplied', lambda s: (lambda xs, ys: plot(
    'V', 'p', [dict(x=[1, 1], y=[1, 3]), dict(x=xs, y=ys), dict(x=[3, 1], y=[1, 1])], 'Cycle ABCA',
    'p–V diagram of cycle ABCA: A to B is a vertical line (constant volume, 500 J supplied), B to C is an isothermal expansion curve (350 J of work done by the gas), and C to A is a horizontal compression at 1.0 × 10⁵ Pa by 2.0 × 10⁻³ m³.',
    xr=(0, 3.6), yr=(0, 3.6), xtl=[(0, '0')], ytl=[(0, '0'), (1, '1.0 × 10⁵ Pa')], grid=False,
    notes=[(1, 1, 'A', 'end', -6, 8, False), (1, 3, 'B', 'end', -6, 0, False), (3, 1, 'C', 'start', 6, -8, False)]))(
    wave_xy(lambda v: v, 1, 3)[0], [3 / v for v in wave_xy(lambda v: v, 1, 3)[0]]))
F('A gas follows a straight-line path on a p–V diagram from (1.0 × 10⁻³ m³, 3.0 × 10⁵ Pa) to (4.0 × 10⁻³ m³, 1.0 × 10⁵ Pa)', lambda s: plot(
    'V / 10⁻³ m³', 'p / 10⁵ Pa', [dict(x=[1.0, 4.0], y=[3.0, 1.0], kind='area'), dict(x=[1.0, 4.0], y=[3.0, 1.0])],
    'Straight-line path', 'p–V graph: a straight line from 1.0 × 10⁻³ m³ at 3.0 × 10⁵ Pa to 4.0 × 10⁻³ m³ at 1.0 × 10⁵ Pa; the shaded trapezium under it is the work done by the gas.',
    xr=(0, 4.5), yr=(0, 3.5), xticks=[0, 1, 2, 3, 4], yticks=[0, 1, 2, 3]))
F('A gas is heated at constant volume from A to B, receiving 300 J, then expands at constant pressure 2.0 × 10⁵ Pa', lambda s: plot(
    'V / 10⁻³ m³', 'p / 10⁵ Pa', [dict(x=[1.0, 2.5], y=[2.0, 2.0], kind='area'), dict(x=[1.0, 1.0, 2.5], y=[1.0, 2.0, 2.0])],
    'Two-stage change', 'p–V graph: A to B is a vertical line at 1.0 × 10⁻³ m³ (heated at constant volume, 300 J); B to C is a horizontal line at 2.0 × 10⁵ Pa from 1.0 × 10⁻³ m³ to 2.5 × 10⁻³ m³ (750 J supplied). The pressure at A is drawn schematically.',
    xr=(0, 3), yr=(0, 2.6), xticks=[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0], yticks=[0, 0.5, 1.0, 1.5, 2.0, 2.5],
    notes=[(1.0, 1.0, 'A', 'end', -6, 0, False), (1.0, 2.0, 'B', 'end', -6, -8, False), (2.5, 2.0, 'C', 'start', 6, -8, False)]))
F('A gas expands from 1.0 × 10⁻³ m³ to 3.0 × 10⁻³ m³. On a p–V graph its pressure falls linearly from 5.0 × 10⁵ Pa to 2.0 × 10⁵ Pa', lambda s: plot(
    'V / 10⁻³ m³', 'p / 10⁵ Pa', [dict(x=[1.0, 3.0], y=[5.0, 2.0], kind='area'), dict(x=[1.0, 3.0], y=[5.0, 2.0])],
    'Linear p–V path', 'p–V graph: the pressure falls linearly from 5.0 × 10⁵ Pa at 1.0 × 10⁻³ m³ to 2.0 × 10⁵ Pa at 3.0 × 10⁻³ m³; the shaded area is the work done by the gas.',
    xr=(0, 3.5), yr=(0, 5.6), xticks=[0, 1, 2, 3], yticks=[0, 1, 2, 3, 4, 5]))
F('A gas in a cylinder at 1.0 × 10⁵ Pa occupies 2.4 × 10⁻³ m³. It is compressed at constant pressure to 1.6 × 10⁻³ m³', lambda s: plot(
    'V / 10⁻³ m³', 'p / 10⁵ Pa', [dict(x=[1.6, 2.4], y=[1.0, 1.0], kind='area'), dict(x=[2.4, 1.6, 1.6], y=[1.0, 1.0, 1.6])],
    'Compression then heating', 'p–V graph: compression at a constant 1.0 × 10⁵ Pa from 2.4 × 10⁻³ m³ to 1.6 × 10⁻³ m³ (shaded area: work done on the gas), then heating at constant volume, shown as a vertical line rising at 1.6 × 10⁻³ m³.',
    xr=(0, 3), yr=(0, 2), xticks=[0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8], yticks=[0, 0.5, 1.0, 1.5, 2.0]))

# ── 19.5 ──
def calib(s, x0, y0, x1, y1, xq, xlabel, ylabel, title, desc, xr, yr, xt, yt, q_is_y=False, qlab=None):
    series = [dict(x=[x0, x1], y=[y0, y1])]
    hl, vl = [], []
    if q_is_y:
        hl = [(xq, qlab, True)]
    else:
        vl = [(xq, qlab, True)]
    return plot(xlabel, ylabel, series, title, desc, xr=xr, yr=yr, xticks=xt, yticks=yt, hlines=hl, vlines=vl)


F('A resistance thermometer has resistance 100.0 Ω at 0 °C and 138.5 Ω at 100 °C', lambda s: calib(
    s, 0, 100.0, 100, 138.5, 119.2, 'θ / °C', 'R / Ω', 'Calibration line', 'Calibration graph of resistance against temperature: a straight line from 100.0 Ω at 0 °C to 138.5 Ω at 100 °C. A dashed line marks 119.2 Ω.',
    (0, 110), (95, 145), [0, 20, 40, 60, 80, 100], [100, 110, 120, 130, 140], q_is_y=True, qlab='119.2 Ω'))
F('A liquid-in-glass thermometer has a 4.0 cm column at 0 °C and 24.0 cm at 100 °C', lambda s: calib(
    s, 0, 4.0, 100, 24.0, 15.0, 'θ / °C', 'column length / cm', 'Calibration line', 'Calibration graph of column length against temperature: a straight line from 4.0 cm at 0 °C to 24.0 cm at 100 °C. A dashed line marks 15.0 cm.',
    (0, 110), (0, 26), [0, 20, 40, 60, 80, 100], [0, 5, 10, 15, 20, 25], q_is_y=True, qlab='15.0 cm'))
F('A thermocouple gives 0.0 mV at 0 °C and 4.1 mV at 100 °C', lambda s: calib(
    s, 0, 0.0, 100, 4.1, 2.9, 'θ / °C', 'E / mV', 'Thermocouple calibration', 'Calibration graph of thermocouple e.m.f. against temperature: a straight line from 0.0 mV at 0 °C to 4.1 mV at 100 °C. A dashed line marks 2.9 mV.',
    (0, 110), (0, 4.6), [0, 20, 40, 60, 80, 100], [0, 1, 2, 3, 4], q_is_y=True, qlab='2.9 mV'))
F('A platinum resistance thermometer reads 108.0 Ω in a cold bath and 136.0 Ω in boiling water', lambda s: calib(
    s, 0, 100.0, 100, 136.0, 108.0, 'θ / °C', 'R / Ω', 'Platinum scale', 'Calibration graph for the platinum scale: a straight line from 100.0 Ω at 0 °C to 136.0 Ω at 100 °C. A dashed line marks the cold-bath reading, 108.0 Ω.',
    (0, 110), (95, 140), [0, 20, 40, 60, 80, 100], [100, 110, 120, 130, 140], q_is_y=True, qlab='108.0 Ω'))
F('A thermistor has resistance 5.0 kΩ at 0 °C and 0.50 kΩ at 100 °C', lambda s: calib(
    s, 0, 5.0, 100, 0.50, 1.5, 'θ / °C', 'R / kΩ', 'Linear-scale assumption', 'Graph of thermistor resistance against temperature assuming a linear scale: a straight line from 5.0 kΩ at 0 °C to 0.50 kΩ at 100 °C. A dashed line marks 1.5 kΩ.',
    (0, 110), (0, 5.5), [0, 20, 40, 60, 80, 100], [0, 1, 2, 3, 4, 5], q_is_y=True, qlab='1.5 kΩ'))
F('A thermocouple\'s e.m.f. follows E = aθ + bθ², with a = 40 µV K⁻¹ and b = 0.040 µV K⁻²', lambda s: (lambda a, b: plot(
    'θ / °C', 'E / mV', [dict(x=wave_xy(lambda t: t, 0, 300)[0], y=[(a * t + b * t * t) / 1000 for t in wave_xy(lambda t: t, 0, 300)[0]])],
    'Thermocouple e.m.f.', 'Graph of thermocouple e.m.f. E = aθ + bθ² against temperature from 0 to 300 °C, with a = 40 µV K⁻¹ and b = 0.040 µV K⁻²: a curve that gets steeper.',
    xr=(0, 300), yr=(0, 16), xticks=[0, 50, 100, 150, 200, 250, 300], yticks=[0, 4, 8, 12, 16]))(grab(s, r'a = (\d+) µV'), grab(s, r'b = ([\d.]+) µV')))
F('A student uses the expansion of alcohol in a thermometer. Between 0 °C and 100 °C the column grows from 2.0 cm to 22.0 cm', lambda s: calib(
    s, 0, 2.0, 100, 22.0, 11.5, 'θ / °C', 'column length / cm', 'Alcohol thermometer scale', 'Calibration line for the alcohol thermometer: from 2.0 cm at 0 °C to 22.0 cm at 100 °C. A dashed line marks the 11.5 cm reading at the true temperature of 50 °C.',
    (0, 110), (0, 24), [0, 20, 40, 60, 80, 100], [0, 5, 10, 15, 20], q_is_y=True, qlab='11.5 cm'))
F('A home-made thermometer uses the length of a mercury thread: 3.20 cm at the ice point and 18.60 cm at the steam point', lambda s: calib(
    s, 0, 3.20, 100, 18.60, 13.50, 'θ / °C', 'thread length / cm', 'Thermometer scale', 'Calibration line for the mercury thread: 3.20 cm at the ice point (0 °C) and 18.60 cm at the steam point (100 °C). A dashed line marks the sauna reading, 13.50 cm.',
    (0, 110), (0, 20), [0, 20, 40, 60, 80, 100], [0, 5, 10, 15, 20], q_is_y=True, qlab='13.50 cm'))

# ── 19.6 ──
F('In an electrical method, a 40 W heater in a 1.0 kg aluminium block raises its temperature by 12.5 K in 300 s', lambda s: electrical_heating(
    'Electrical method', 'A 1.0 kg aluminium block, insulated, with a 40 W electric heater and a thermometer in holes in the block; an ammeter and voltmeter measure the heater current and p.d.',
    block_label='1.0 kg aluminium', power_label='heater: 40 W'))
F('A heater runs at 12 V and 4.0 A for 5.0 minutes in a 0.80 kg block', lambda s: electrical_heating(
    'Electrical method', 'A 0.80 kg block, insulated, with a heater and thermometer; the heater runs at 12 V and 4.0 A for 5.0 minutes.',
    block_label='0.80 kg block', power_label='heater: 12 V, 4.0 A'))
F('A copper block of mass 0.60 kg is heated by a 50 W heater. A graph of temperature against time is a straight line of gradient 0.20 K s⁻¹', lambda s: plot(
    't / s', 'θ / °C', [dict(x=[0, 200], y=[20, 20 + 200 * grab(s, r'gradient ([\d.]+) K')])], 'Temperature against time',
    'Graph of temperature against time for the 0.60 kg copper block heated at 50 W: a straight line of gradient 0.20 K s⁻¹ (the starting temperature is drawn at 20 °C).',
    xr=(0, 220), yr=(0, 70), xticks=[0, 50, 100, 150, 200], yticks=[0, 20, 40, 60], notes=[(100, 40, 'gradient 0.20 K s⁻¹', 'start', 12, 8, True)]))
F('A student uses an electrical method on a 1.0 kg aluminium block and plots temperature against time', lambda s: plot(
    't / s', 'θ / °C', [dict(x=[0, 600], y=[20, 20 + 600 * grab(s, r'gradient ([\d.]+) K')])], 'Temperature against time',
    'Graph of temperature against time for the 1.0 kg aluminium block heated at 42 W: the straight part has a gradient of 0.045 K s⁻¹ (the starting temperature is drawn at 20 °C).',
    xr=(0, 650), yr=(0, 55), xticks=[0, 100, 200, 300, 400, 500, 600], yticks=[0, 10, 20, 30, 40, 50], notes=[(300, 33.5, 'gradient 0.045 K s⁻¹', 'start', 12, 8, True)]))
