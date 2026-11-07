# Figures for ch20b.py (20.5–20.8 temperature, ideal gas equation, kinetic theory). Numbers from the stems.

F('A gas syringe holds 150 cm³ of gas at 300 K. The gas is cooled at constant pressure to 200 K', lambda s: syringe(
    'Cooling gas in a syringe', 'A gas syringe holding 150 cm³ of gas at 300 K; the gas is cooled to 200 K at constant pressure, so the plunger moves in.',
    gas_frac=0.75, label='150 cm³ at 300 K'))
F('In an experiment to investigate the pressure law, a flask of air is heated in a water bath', lambda s: water_bath(
    'Pressure-law apparatus', 'A flask of air, completely under water in a water bath with a heater and thermometer, connected by a short tube to a pressure gauge.'))
F('Two samples of the same gas are each heated at the same constant pressure. Graphs of volume against thermodynamic temperature', lambda s: plot(
    'T / K', 'V', [dict(x=[0, 400], y=[0, 2.0]), dict(x=[0, 400], y=[0, 1.0], color=ACC2)], 'Volume against temperature',
    'Graphs of volume against thermodynamic temperature for two samples of the same gas at the same constant pressure: two straight lines through the origin, line A steeper than line B.',
    xr=(0, 420), yr=(0, 2.2), xticks=[0, 100, 200, 300, 400], ytl=[(0, '0')], notes=[(400, 2.0, 'A', 'start', 6, 0, False), (400, 1.0, 'B', 'start', 6, 0, False)]))
F('A student uses a flask of air connected to a pressure gauge to test the pressure law', lambda s: table_plot(
    ['θ / °C', 'p / kPa'], table_rows_from_stem(s, ['θ/°C', 'p/kPa'])[1], 'Pressure against Celsius temperature',
    'Table and graph of pressure against Celsius temperature for a flask of air: θ = 0 to 100 °C in 20 °C steps give p = 100.0, 107.3, 114.6, 122.0, 129.3, 136.6 kPa, a straight line that does not pass through the origin.',
    dict(xlabel='θ / °C', ylabel='p / kPa', series=[dict(x=numbers_after(s, 'θ/°C'), y=numbers_after(s, 'p/kPa'), kind='points')],
         xr=(0, 110), yr=(90, 140), xticks=[0, 20, 40, 60, 80, 100], yticks=[90, 100, 110, 120, 130, 140], h=250, ybreak=True)))
F('Two glass bulbs, each of volume 1.0 litre, are joined by a narrow tube of negligible volume', lambda s: two_flasks(
    'Two joined bulbs', 'Two glass bulbs, each of volume 1.0 litre, joined by a narrow tube. Bulb A is kept at 273 K; bulb B is heated to 373 K.',
    'A', 'B', '1.0 litre, 273 K', '1.0 litre, 373 K', tap=False))
F('A capillary tube of uniform bore traps a thread of air under a short index of mercury', lambda s: table_plot(
    ['θ / °C', 'L / cm'], table_rows_from_stem(s, ['θ/°C', 'air-column length L/cm'])[1], 'Air-column length against temperature',
    'Table and graph of the trapped air-column length against temperature: θ = 10, 30, 50, 70, 90 °C give L = 5.66, 6.06, 6.46, 6.86, 7.26 cm, a straight line.',
    dict(xlabel='θ / °C', ylabel='L / cm', series=[dict(x=numbers_after(s, 'θ/°C'), y=numbers_after(s, 'air-column length L/cm'), kind='points')],
         xr=(0, 100), yr=(5.0, 7.6), xticks=[0, 20, 40, 60, 80, 100], yticks=[5.0, 5.5, 6.0, 6.5, 7.0, 7.5], h=250, ybreak=True)))
F('For a fixed amount of an ideal gas, a graph of pV (y-axis) against T (x-axis) is a straight line through the origin', lambda s: plot(
    'T / K', 'pV / J', [dict(x=[0, 400], y=[0, 400 * grab(s, r'gradient ([\d.]+) J')])], 'pV against T',
    'Graph of pV against thermodynamic temperature for a fixed amount of ideal gas: a straight line through the origin with gradient 2.5 J K⁻¹.',
    xr=(0, 420), yr=(0, 1100), xticks=[0, 100, 200, 300, 400], yticks=[0, 250, 500, 750, 1000]))
F('A bubble of volume 1.2 cm³ is released at a depth of 25 m in a lake', lambda s: bubble_lake(
    'Rising bubble', 'A bubble of volume 1.2 cm³ released at a depth of 25 m, where the water is at 4 °C, rises to the surface, where the water is at 20 °C and the pressure is 1.0 × 10⁵ Pa.',
    depth_label='25 m', bottom_label='1.2 cm³ at 4 °C', top_label='20 °C, 1.0 × 10⁵ Pa'))
F('A fixed amount of gas is held in a rigid vessel of volume 2.0 × 10⁻³ m³. Readings: T/K = 250, 300, 350, 400', lambda s: table_plot(
    ['T / K', 'p / kPa'], table_rows_from_stem(s, ['T/K', 'p/kPa'])[1], 'Pressure against temperature',
    'Table and graph of pressure against thermodynamic temperature in a rigid 2.0 × 10⁻³ m³ vessel: T = 250, 300, 350, 400 K give p = 62.3, 74.8, 87.2, 99.7 kPa, on a straight line through the origin.',
    dict(xlabel='T / K', ylabel='p / kPa', series=[dict(x=numbers_after(s, 'T/K'), y=numbers_after(s, 'p/kPa'), kind='points'),
],
         xr=(0, 420), yr=(0, 110), xticks=[0, 100, 200, 300, 400], yticks=[0, 25, 50, 75, 100], h=250)))
F('In one cylinder of a petrol engine, 5.0 × 10⁻⁴ m³ of fuel–air mixture at 1.0 × 10⁵ Pa and 300 K is compressed', lambda s: blocks(
    [['before', '5.0 × 10⁻⁴ m³', '1.0 × 10⁵ Pa, 300 K'], ['after', '5.0 × 10⁻⁵ m³', '2.0 × 10⁶ Pa']],
    'Compression in an engine cylinder', 'The fuel–air mixture in one engine cylinder before compression (5.0 × 10⁻⁴ m³ at 1.0 × 10⁵ Pa and 300 K) and after compression (5.0 × 10⁻⁵ m³ at 2.0 × 10⁶ Pa).', w=420))
F('A computer model gives the r.m.s. speed of nitrogen molecules at different temperatures', lambda s: table_plot(
    ['T / K', 'c_rms / m s⁻¹'], table_rows_from_stem(s, ['T/K', 'c_rms/m s⁻¹'])[1], 'r.m.s. speed against temperature',
    'Table and graph of the r.m.s. speed of nitrogen molecules against temperature: T = 200, 300, 400, 500 K give c_rms = 422, 517, 597, 667 m s⁻¹, a curve that rises less and less steeply.',
    dict(xlabel='T / K', ylabel='c_rms / m s⁻¹', series=[dict(x=numbers_after(s, 'T/K'), y=numbers_after(s, 'c_rms/m s⁻¹'), kind='points')],
         xr=(0, 550), yr=(0, 750), xticks=[0, 100, 200, 300, 400, 500], yticks=[0, 200, 400, 600], h=250)))
F('A gas in a cylinder expands rapidly, pushing a piston outwards, and no energy is supplied by heating', lambda s: syringe(
    'Gas expanding against a piston', 'Gas in a cylinder expanding rapidly and pushing a piston outwards, with no energy supplied by heating.', gas_frac=0.6, push='out'))
F('A computer model gives the mean translational kinetic energy ⟨E⟩ of gas molecules', lambda s: table_plot(
    ['T / K', '⟨E⟩ / 10⁻²¹ J'], table_rows_from_stem(s, ['T/K', '⟨E⟩/10⁻²¹ J'])[1], 'Mean kinetic energy against temperature',
    'Table and graph of mean translational kinetic energy against temperature: T = 100, 200, 300, 400 K give ⟨E⟩ = 2.07, 4.14, 6.21, 8.28 × 10⁻²¹ J, a straight line through the origin.',
    dict(xlabel='T / K', ylabel='⟨E⟩ / 10⁻²¹ J', series=[dict(x=numbers_after(s, 'T/K'), y=numbers_after(s, '⟨E⟩/10⁻²¹ J'), kind='points')],
         xr=(0, 440), yr=(0, 9), xticks=[0, 100, 200, 300, 400], yticks=[0, 2, 4, 6, 8], h=250)))
