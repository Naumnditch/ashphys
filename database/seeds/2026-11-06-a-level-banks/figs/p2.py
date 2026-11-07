# Figures for p2.py (P2 planning, analysis and evaluation). Graph lines are generated from the gradients,
# intercepts and points stated in each stem; data tables reuse the stem's readings.


def _line(m, c, x0, x1, **kw):
    return dict(x=[x0, x1], y=[m * x0 + c, m * x1 + c], **kw)


def _pts(pairs, **kw):
    return dict(x=[p[0] for p in pairs], y=[p[1] for p in pairs], kind='points', **kw)


def _scatter(f, xs, amp):
    """Points on y = f(x) with a small deterministic scatter of at most ±amp (illustrative data)."""
    return [(x, f(x) + amp * sin(2.3 * k + 0.7)) for k, x in enumerate(xs)]


def _pt_notes(pairs, texts, dx=8, dy=-12, anchor='start'):
    return [(x, y, t, anchor, dx, dy, True) for (x, y), t in zip(pairs, texts)]


# ── P2.1 ──
F('The straight line on a graph of lg I against lg d cuts the lg I axis at 1.30', lambda s: plot(
    'lg (d / m)', 'lg (I / W m⁻²)', [_line(-2.0, 1.30, 0, 0.6)], 'Log–log graph', 'A straight line on a graph of lg I against lg d, falling from the lg I axis, which it cuts at 1.30.',
    xr=(0, 0.6), yr=(0, 1.5), xticks=[0, 0.2, 0.4, 0.6], yticks=[0, 0.5, 1.0, 1.5], notes=[(0, 1.30, '1.30', 'start', 8, -10, True)]))
F('For a relationship v = k/u, a student plots v against 1/u', lambda s: plot(
    '1/u', 'v', [_line(12, 0, 0, 0.6), _pts([(0.50, 6.0)])], 'v against 1/u', 'A straight line through the origin on a graph of v against 1/u, passing through the point (0.50, 6.0).',
    xr=(0, 0.6), yr=(0, 8), xticks=[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6], yticks=[0, 2, 4, 6, 8], notes=_pt_notes([(0.50, 6.0)], ['(0.50, 6.0)'], dx=-8, anchor='end')))
F('A best-fit line on a log–log graph has the equation lg y = 1.5 lg x + 0.48', lambda s: plot(
    'lg x', 'lg y', [_line(1.5, 0.48, 0, 1.0)], 'Best-fit line on a log–log graph', 'The best-fit line lg y = 1.5 lg x + 0.48: a straight line of gradient 1.5 crossing the lg y axis at 0.48.',
    xr=(0, 1.0), yr=(0, 2.2), xticks=[0, 0.2, 0.4, 0.6, 0.8, 1.0], yticks=[0, 0.5, 1.0, 1.5, 2.0], notes=[(0, 0.48, '0.48', 'start', 8, 14, True)]))
F('The intensity I at distance d from a small lamp is thought to follow I = kdⁿ', lambda s: plot(
    'd / m', 'I / W m⁻²', [dict(x=curve(lambda d: 1.0 / d ** 2, 0.18, 0.50)[0], y=curve(lambda d: 1.0 / d ** 2, 0.18, 0.50)[1], color=MUT, dash='5 4', lw='thin'),
                           _pts([(0.20, 25.0), (0.40, 6.25)])],
    'Intensity against distance', 'Intensity against distance from a small lamp: 25.0 W m⁻² at 0.20 m and 6.25 W m⁻² at 0.40 m, on a smooth falling curve.',
    xr=(0, 0.5), yr=(0, 32), xticks=[0, 0.1, 0.2, 0.3, 0.4, 0.5], yticks=[0, 10, 20, 30],
    notes=_pt_notes([(0.20, 25.0), (0.40, 6.25)], ['25.0', '6.25'])))
F('A graph of lg F against lg r has gradient −2.1 and meets the lg F axis at 0.70', lambda s: plot(
    'lg (r / m)', 'lg (F / N)', [_line(-2.1, 0.70, 0, 0.6)], 'lg F against lg r', 'A straight line on a graph of lg F against lg r, meeting the lg F axis at 0.70 and falling with gradient −2.1.',
    xr=(0, 0.6), yr=(-0.6, 0.8), xticks=[0, 0.2, 0.4, 0.6], yticks=[-0.6, -0.4, -0.2, 0, 0.2, 0.4, 0.6, 0.8], notes=[(0, 0.70, '0.70', 'start', 8, -8, True)]))
F('is tested by plotting T² against m. The gradient is 0.16 s² kg⁻¹', lambda s: plot(
    'm / kg', 'T² / s²', [_line(0.16, 0, 0, 1.0)], 'T² against m', 'A straight line through the origin on a graph of T² against m, with gradient 0.16 s² kg⁻¹.',
    xr=(0, 1.0), yr=(0, 0.2), xticks=[0, 0.2, 0.4, 0.6, 0.8, 1.0], yticks=[0, 0.05, 0.10, 0.15, 0.20]))
F('The best-fit line on a graph of lg y against lg x passes through (0.20, 1.10) and (0.80, 2.30)', lambda s: plot(
    'lg x', 'lg y', [_line(2.0, 0.70, 0, 1.0), _pts([(0.20, 1.10), (0.80, 2.30)])], 'Log–log best-fit line',
    'A best-fit line on a graph of lg y against lg x through the points (0.20, 1.10) and (0.80, 2.30).',
    xr=(0, 1.0), yr=(0, 3.0), xticks=[0, 0.2, 0.4, 0.6, 0.8, 1.0], yticks=[0, 1.0, 2.0, 3.0],
    notes=_pt_notes([(0.20, 1.10), (0.80, 2.30)], ['(0.20, 1.10)', '(0.80, 2.30)'], dx=10, dy=8)))
F('A line on a graph of lg y against lg x passes through (0.30, 0.95) and (0.90, 2.15)', lambda s: plot(
    'lg x', 'lg y', [_line(2.0, 0.35, 0, 1.0), _pts([(0.30, 0.95), (0.90, 2.15)])], 'Log–log line',
    'A straight line on a graph of lg y against lg x through (0.30, 0.95) and (0.90, 2.15).',
    xr=(0, 1.0), yr=(0, 2.5), xticks=[0, 0.2, 0.4, 0.6, 0.8, 1.0], yticks=[0, 0.5, 1.0, 1.5, 2.0, 2.5],
    notes=_pt_notes([(0.30, 0.95)], ['(0.30, 0.95)'], dx=10, dy=8) + _pt_notes([(0.90, 2.15)], ['(0.90, 2.15)'], dx=-10, dy=-12, anchor='end')))
F('plots t² against h. The gradient is 0.204 s² m⁻¹', lambda s: plot(
    'h / m', 't² / s²', [_line(0.204, 0, 0, 1.0)], 't² against h', 'A straight line through the origin on a graph of t² against fall height h, gradient 0.204 s² m⁻¹.',
    xr=(0, 1.0), yr=(0, 0.25), xticks=[0, 0.2, 0.4, 0.6, 0.8, 1.0], yticks=[0, 0.05, 0.10, 0.15, 0.20, 0.25]))
F('A student records x = 1.0, 2.0, 4.0, 8.0 and y = 3.0, 8.5, 24, 68', lambda s: table_plot(
    ['x', 'y'], [['1.0', '3.0'], ['2.0', '8.5'], ['4.0', '24'], ['8.0', '68']], 'Readings of y against x',
    'Table and graph of y against x: (1.0, 3.0), (2.0, 8.5), (4.0, 24), (8.0, 68); the points lie on a curve that bends upwards.',
    dict(xlabel='x', ylabel='y', series=[_pts([(1.0, 3.0), (2.0, 8.5), (4.0, 24), (8.0, 68)])], xr=(0, 8), yr=(0, 80),
         xticks=[0, 2, 4, 6, 8], yticks=[0, 20, 40, 60, 80], h=250)))
F('A student plots T² against L and finds a gradient of 4.05 s² m⁻¹', lambda s: plot(
    'L / m', 'T² / s²', [_line(4.05, 0, 0, 1.0)], 'T² against L', 'A straight line through the origin on a graph of T² against pendulum length L, gradient 4.05 s² m⁻¹.',
    xr=(0, 1.0), yr=(0, 5), xticks=[0, 0.2, 0.4, 0.6, 0.8, 1.0], yticks=[0, 1, 2, 3, 4, 5]))
F('A graph of ln(A/mm) against t/s passes through (0, 2.30) and (20, 1.50)', lambda s: plot(
    't / s', 'ln (A / mm)', [_line(-0.04, 2.30, 0, 40), _pts([(0, 2.30), (20, 1.50)])], 'ln A against t',
    'A straight line on a graph of ln A against t through (0, 2.30) and (20, 1.50).',
    xr=(0, 40), yr=(0, 2.5), xticks=[0, 10, 20, 30, 40], yticks=[0, 0.5, 1.0, 1.5, 2.0, 2.5],
    notes=_pt_notes([(0, 2.30), (20, 1.50)], ['(0, 2.30)', '(20, 1.50)'], dx=10, dy=-12)))
F('With L = 0.80 m, a graph of f against √T has gradient 6.5', lambda s: plot(
    '√T / N^(1/2)', 'f / Hz', [_line(6.5, 0, 0, 10)], 'f against √T', 'A straight line through the origin on a graph of frequency f against √T, gradient 6.5 Hz N^(−1/2).',
    xr=(0, 10), yr=(0, 70), xticks=[0, 2, 4, 6, 8, 10], yticks=[0, 10, 20, 30, 40, 50, 60, 70]))
F('A graph of lg y against lg x is a straight line through (0.40, 1.62) and (1.20, 0.82)', lambda s: plot(
    'lg x', 'lg y', [_line(-1.0, 2.02, 0.2, 1.4), _pts([(0.40, 1.62), (1.20, 0.82)])], 'Falling log–log line',
    'A straight line on a graph of lg y against lg x through (0.40, 1.62) and (1.20, 0.82).',
    xr=(0, 1.4), yr=(0, 2.0), xticks=[0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4], yticks=[0, 0.5, 1.0, 1.5, 2.0],
    notes=_pt_notes([(0.40, 1.62)], ['(0.40, 1.62)'], dx=10, dy=-12) + _pt_notes([(1.20, 0.82)], ['(1.20, 0.82)'], dx=-10, dy=14, anchor='end')))
F('For a filament lamp, I = kVⁿ. A graph of lg(I/A) against lg(V/V) has gradient 0.60 and intercept −1.40', lambda s: plot(
    'lg (V / V)', 'lg (I / A)', [_line(0.60, -1.40, 0, 1.2)], 'Log–log graph for a filament lamp',
    'A straight line on a graph of lg I against lg V for a filament lamp, gradient 0.60, meeting the lg I axis at −1.40.',
    xr=(0, 1.2), yr=(-1.6, 0), xticks=[0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2], yticks=[-1.6, -1.2, -0.8, -0.4, 0],
    notes=[(0, -1.40, '−1.40', 'start', 8, 12, True)]))

# ── P2.2 ──
F('A sphere falling at terminal speed takes 1.60 s to pass between two marks 20.0 cm apart', lambda s: fall_tube(
    'Terminal speed in oil', 'A tall tube of oil with two marks 20.0 cm apart low down; a sphere falls between them in 1.60 s.', '20.0 cm', sphere_label='sphere'))
F('A tuning fork of 500 Hz is held over a tube closed at one end', lambda s: resonance_tube(
    'Resonance tube', 'A tube open at the top dipping into water, with a 500 Hz tuning fork above; resonance occurs when the air column is 0.165 m long and again at 0.505 m.',
    0.165, 0.505, '0.165 m', '0.505 m', fork_label='500 Hz'))
F('A card 4.0 cm long passes through two light gates 0.60 m apart', lambda s: light_gates(
    'Two light gates', 'A trolley carrying a 4.0 cm card runs along a track through light gates A and B, 0.60 m apart.', card_label='4.0 cm card', sep_label='0.60 m'))
F('A card of length 5.0 cm cuts a light beam for 0.025 s', lambda s: light_gates(
    'Card and light gate', 'A trolley carrying a 5.0 cm card passes through a single light gate.', card_label='5.0 cm card', two=False))
F('A 50 W heater runs for 300 s in a 0.80 kg aluminium block', lambda s: electrical_heating(
    'Electrical heating of a block', 'A 50 W heater and a thermometer in an insulated 0.80 kg aluminium block, with an ammeter in series with the heater and a voltmeter across it.',
    block_label='0.80 kg', power_label='50 W'))
F('An LDR whose resistance varies from 2.0 kΩ (bright) to 20 kΩ (dark)', lambda s: circuit(
    Series(El('ldr', 'LDR', value=False), Par(El('R', '10 kΩ'), El('V', 'output', value=False))), El('cell', '6.0 V'),
    'LDR potential divider', 'A 6.0 V supply across an LDR in series with a 10 kΩ resistor; the output voltmeter is across the 10 kΩ resistor.'))
F('A 12 V supply of negligible internal resistance is to drive a current of no more than 0.50 A', lambda s: circuit(
    Series(El('A'), El('R', '4.7 Ω'), El('var_R', 'R = ?', value=False)), El('cell', '12 V'),
    'Limiting the current', 'A 12 V supply, an ammeter, a 4.7 Ω resistor and an extra series resistance R to be chosen so that the current is at most 0.50 A.'))
F('Which plan best determines how the period T of a mass–spring system depends on the mass m?', lambda s: spring_v(
    'Mass–spring system', 'A mass hanging on a vertical spring, set oscillating vertically; slotted masses can be added.', mass_label='m', vibrator=False))

# ── P2.3 ──
F('A straight line on a graph passes through (0.0, 1.2) and (4.0, 9.2)', lambda s: plot(
    'x', 'y', [_line(2.0, 1.2, 0, 5.0), _pts([(0.0, 1.2), (4.0, 9.2)])], 'A straight-line graph', 'A straight line through (0.0, 1.2) and (4.0, 9.2).',
    xr=(0, 5), yr=(0, 12), xticks=[0, 1, 2, 3, 4, 5], yticks=[0, 2, 4, 6, 8, 10, 12],
    notes=_pt_notes([(0.0, 1.2), (4.0, 9.2)], ['(0.0, 1.2)', '(4.0, 9.2)'], dx=10, dy=6)))
F('A graph of stopping voltage against frequency has gradient 4.1 × 10⁻¹⁵ V s and meets the frequency axis', lambda s: plot(
    'f / 10¹⁴ Hz', 'stopping voltage / V', [_line(0.41, -0.41 * 5.5, 5.5, 12)], 'Stopping voltage against frequency',
    'A straight line on a graph of stopping voltage against frequency, starting on the frequency axis at 5.5 × 10¹⁴ Hz and rising with gradient 4.1 × 10⁻¹⁵ V s.',
    xr=(0, 12), yr=(0, 3), xticks=[0, 2, 4, 6, 8, 10, 12], yticks=[0, 1, 2, 3], notes=[(5.5, 0, 'f₀', 'middle', 0, -12, False)]))
F('To test y = kx², a student plots y against x². The best-fit line passes through (4.0, 10.2) and (36.0, 90.6)', lambda s: plot(
    'x²', 'y', [_line(80.4 / 32, 10.2 - 80.4 / 32 * 4.0, 0, 40), _pts([(4.0, 10.2), (36.0, 90.6)])], 'y against x²',
    'A best-fit line on a graph of y against x² through (4.0, 10.2) and (36.0, 90.6).',
    xr=(0, 40), yr=(0, 100), xticks=[0, 10, 20, 30, 40], yticks=[0, 20, 40, 60, 80, 100],
    notes=_pt_notes([(4.0, 10.2)], ['(4.0, 10.2)'], dx=10, dy=6) + _pt_notes([(36.0, 90.6)], ['(36.0, 90.6)'], dx=-10, dy=-12, anchor='end')))
F('A force–extension graph is a straight line through the origin of gradient 25 N m⁻¹', lambda s: plot(
    'x / m', 'F / N', [dict(x=[0, 0.080, 0.080], y=[0, 2.0, 0], kind='area'), _line(25, 0, 0, 0.10)], 'Force against extension',
    'A straight line through the origin on a force–extension graph, gradient 25 N m⁻¹; the area under it up to an extension of 0.080 m is shaded.',
    xr=(0, 0.10), yr=(0, 2.6), xticks=[0, 0.02, 0.04, 0.06, 0.08, 0.10], yticks=[0, 0.5, 1.0, 1.5, 2.0, 2.5], vlines=[(0.080, '0.080 m', True)]))
F('A velocity–time graph rises uniformly from 2.0 m s⁻¹ at t = 0 to 14.0 m s⁻¹ at t = 6.0 s', lambda s: plot(
    't / s', 'v / m s⁻¹', [dict(x=[0, 6.0, 6.0, 0], y=[2.0, 14.0, 0, 0], kind='area'), _line(2.0, 2.0, 0, 6.0)], 'Velocity against time',
    'A velocity–time graph rising in a straight line from 2.0 m s⁻¹ at t = 0 to 14.0 m s⁻¹ at 6.0 s, with the area under it shaded.',
    xr=(0, 7), yr=(0, 16), xticks=[0, 1, 2, 3, 4, 5, 6, 7], yticks=[0, 4, 8, 12, 16],
    notes=_pt_notes([(0, 2.0)], ['2.0'], dx=8, dy=14) + _pt_notes([(6.0, 14.0)], ['14.0'], dx=8, dy=-10)))
F('A graph of resistance R against temperature θ for a wire is a straight line', lambda s: plot(
    'θ / °C', 'R / Ω', [_line(0.078, 20.0, 0, 100)], 'Resistance against temperature',
    'A straight line on a graph of R against θ, crossing the R axis at 20.0 Ω with gradient 0.078 Ω K⁻¹.',
    xr=(0, 100), yr=(0, 30), xticks=[0, 20, 40, 60, 80, 100], yticks=[0, 10, 20, 30], notes=[(0, 20.0, '20.0', 'start', 8, 14, True)]))
F('For a cell, 1/I = R/E + r/E. A graph of 1/I against R has gradient 0.125', lambda s: plot(
    'R / Ω', '(1/I) / A⁻¹', [_line(0.125, 0.25, 0, 10)], '1/I against R',
    'A straight line on a graph of 1/I against R, intercept 0.25 A⁻¹ on the 1/I axis and gradient 0.125 A⁻¹ Ω⁻¹.',
    xr=(0, 10), yr=(0, 1.6), xticks=[0, 2, 4, 6, 8, 10], yticks=[0, 0.4, 0.8, 1.2, 1.6], notes=[(0, 0.25, '0.25', 'start', 8, 14, True)]))
F('For a cell, R = E/I − r. A graph of R against 1/I has gradient 6.0 V', lambda s: plot(
    '(1/I) / A⁻¹', 'R / Ω', [_line(6.0, -1.5, 0, 3.0)], 'R against 1/I',
    'A straight line on a graph of R against 1/I with gradient 6.0 V, meeting the R axis at −1.5 Ω.',
    xr=(0, 3.0), yr=(-4, 18), xticks=[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0], yticks=[-4, 0, 4, 8, 12, 16], notes=[(0, -1.5, '−1.5', 'start', 8, 14, True)]))
F('A pendulum gives L/m = 0.20, 0.40, 0.60, 0.80, 1.00 and T/s = 0.90, 1.27, 1.55, 1.79, 2.01', lambda s: table_plot(
    ['L / m', 'T / s'], table_rows_from_stem(s, ['L/m', 'T/s'])[1], 'Pendulum readings',
    'Table and graph of period T against length L: (0.20, 0.90), (0.40, 1.27), (0.60, 1.55), (0.80, 1.79), (1.00, 2.01); the points lie on a curve.',
    dict(xlabel='L / m', ylabel='T / s', series=[dict(x=numbers_after(s, 'L/m'), y=numbers_after(s, 'T/s'), kind='points')],
         xr=(0, 1.0), yr=(0, 2.5), xticks=[0, 0.2, 0.4, 0.6, 0.8, 1.0], yticks=[0, 0.5, 1.0, 1.5, 2.0, 2.5], h=250)))
F('Readings x = 2.0, 3.0, 5.0, 8.0 and y = 11.3, 20.8, 44.7, 90.5', lambda s: table_plot(
    ['x', 'y'], table_rows_from_stem(s, ['Readings x', 'and y'])[1], 'Readings of y against x',
    'Table and graph of y against x: (2.0, 11.3), (3.0, 20.8), (5.0, 44.7), (8.0, 90.5), on a curve bending upwards.',
    dict(xlabel='x', ylabel='y', series=[dict(x=numbers_after(s, 'Readings x'), y=numbers_after(s, 'and y'), kind='points')],
         xr=(0, 8), yr=(0, 100), xticks=[0, 2, 4, 6, 8], yticks=[0, 20, 40, 60, 80, 100], h=250)))
F('A count rate (corrected for background) is 640, 452, 320, 226 and 160 counts per minute', lambda s: table_plot(
    ['t / min', 'C / counts per minute'], [['0', '640'], ['5', '452'], ['10', '320'], ['15', '226'], ['20', '160']], 'Count rate against time',
    'Table and graph of corrected count rate against time: 640, 452, 320, 226 and 160 counts per minute at 0, 5, 10, 15 and 20 min, a falling curve.',
    dict(xlabel='t / min', ylabel='C / counts per minute', series=[_pts([(0, 640), (5, 452), (10, 320), (15, 226), (20, 160)])],
         xr=(0, 20), yr=(0, 700), xticks=[0, 5, 10, 15, 20], yticks=[0, 200, 400, 600], h=250)))
F('A graph of acceleration a against displacement x for an oscillator is a straight line through the origin with gradient −158', lambda s: plot(
    'x / m', 'a / m s⁻²', [_line(-158, 0, -0.05, 0.05)], 'Acceleration against displacement',
    'A straight line through the origin with negative gradient −158 s⁻² on a graph of acceleration against displacement.',
    xr=(-0.05, 0.05), yr=(-8, 8), xticks=[-0.05, -0.025, 0, 0.025, 0.05], yticks=[-8, -4, 0, 4, 8]))
F('A graph of lg P against lg T passes through (3.20, 1.30) and (3.50, 2.47)', lambda s: plot(
    'lg (T / K)', 'lg (P / W)', [_line(3.9, 1.30 - 3.9 * 3.20, 3.15, 3.55), _pts([(3.20, 1.30), (3.50, 2.47)])], 'lg P against lg T',
    'A straight line on a graph of lg P against lg T through (3.20, 1.30) and (3.50, 2.47).',
    xr=(3.1, 3.6), yr=(1.0, 3.0), xticks=[3.1, 3.2, 3.3, 3.4, 3.5, 3.6], yticks=[1.0, 1.5, 2.0, 2.5, 3.0], ybreak=True,
    notes=_pt_notes([(3.20, 1.30), (3.50, 2.47)], ['(3.20, 1.30)', '(3.50, 2.47)'], dx=10, dy=8)))
F('V = 1.00, 2.00, 3.00, 4.00 V across a component give I = 0.050, 0.141, 0.260, 0.400 A', lambda s: table_plot(
    ['V / V', 'I / A'], [['1.00', '0.050'], ['2.00', '0.141'], ['3.00', '0.260'], ['4.00', '0.400']], 'Current against voltage',
    'Table and graph of current against p.d. for a component: (1.00, 0.050), (2.00, 0.141), (3.00, 0.260), (4.00, 0.400), on a curve bending upwards.',
    dict(xlabel='V / V', ylabel='I / A', series=[_pts([(1.00, 0.050), (2.00, 0.141), (3.00, 0.260), (4.00, 0.400)])],
         xr=(0, 4), yr=(0, 0.5), xticks=[0, 1, 2, 3, 4], yticks=[0, 0.1, 0.2, 0.3, 0.4, 0.5], h=250)))

# ── P2.4 ──
_EB1 = _scatter(lambda x: 3.12 * x + 1.0, [1.0, 2.0, 3.0, 4.0, 5.0], 0.15)
F('A graph with error bars has a best-fit gradient of 3.12. The worst acceptable line passes through (0.0, 0.60) and (5.0, 17.6)', lambda s: plot(
    'x', 'y', [dict(x=[p[0] for p in _EB1], y=[p[1] for p in _EB1], err=[1.15] * 5, kind='errbar'),
               _line(3.12, 1.0, 0, 5.5), _line((17.6 - 0.60) / 5.0, 0.60, 0, 5.2, color=ACC2, dash='6 4')],
    'Best-fit and worst acceptable lines', 'Five points with error bars; the best-fit line (gradient 3.12) and a steeper worst acceptable line from (0.0, 0.60) to (5.0, 17.6) that passes through every error bar.',
    xr=(0, 5.5), yr=(0, 20), xticks=[0, 1, 2, 3, 4, 5], yticks=[0, 5, 10, 15, 20],
    legend=[('best fit', ACC, None), ('worst acceptable', ACC2, '6 4')], notes=_pt_notes([(5.0, 17.6)], ['(5.0, 17.6)'], dx=-8, dy=-10, anchor='end')))
_EB2 = _scatter(lambda x: 2.40 * x + 1.20, [1.0, 2.0, 3.0, 4.0, 5.0], 0.08)
F('A best-fit line has gradient 2.40 and y-intercept 1.20. The worst acceptable line passes through (1.0, 3.9) and (5.0, 13.3)', lambda s: plot(
    'x', 'y', [dict(x=[p[0] for p in _EB2], y=[p[1] for p in _EB2], err=[0.4] * 5, kind='errbar'),
               _line(2.40, 1.20, 0, 5.5), _line(2.35, 1.55, 0, 5.5, color=ACC2, dash='6 4')],
    'Worst acceptable line', 'Five points with error bars, the best-fit line (gradient 2.40, intercept 1.20) and a shallower worst acceptable line through (1.0, 3.9) and (5.0, 13.3).',
    xr=(0, 5.5), yr=(0, 15), xticks=[0, 1, 2, 3, 4, 5], yticks=[0, 3, 6, 9, 12, 15],
    legend=[('best fit', ACC, None), ('worst acceptable', ACC2, '6 4')],
    notes=_pt_notes([(1.0, 3.9), (5.0, 13.3)], ['(1.0, 3.9)', '(5.0, 13.3)'], dx=-8, dy=-12, anchor='end')))
_EB3 = _scatter(lambda i: 1.52 - 0.50 * i, [0.2, 0.4, 0.6, 0.8, 1.0], 0.01)
F('The e.m.f. of a cell is the intercept of a V–I graph. The best-fit intercept is 1.52 V', lambda s: plot(
    'I / A', 'V / V', [dict(x=[p[0] for p in _EB3], y=[p[1] for p in _EB3], err=[0.05] * 5, kind='errbar'),
                       _line(-0.50, 1.52, 0, 1.1), _line(-0.42, 1.47, 0, 1.1, color=ACC2, dash='6 4')],
    'Finding the e.m.f.', 'Terminal p.d. against current with error bars; the best-fit line meets the V axis at 1.52 V and the worst acceptable line at 1.47 V.',
    xr=(0, 1.1), yr=(0.9, 1.6), xticks=[0, 0.2, 0.4, 0.6, 0.8, 1.0], yticks=[0.9, 1.1, 1.3, 1.5], ybreak=True,
    legend=[('best fit', ACC, None), ('worst acceptable', ACC2, '6 4')],
    notes=[(0, 1.52, '1.52', 'start', 8, -10, True), (0, 1.47, '1.47', 'start', 8, 24, True)]))

# ── P2.5 ──
_FX = lambda x: 100 * x if x <= 0.04 else 4.0 + 2.0 * (1 - exp(-(x - 0.04) / 0.02))  # noqa: E731
F('A force–extension graph is straight at first but curves at the highest loads', lambda s: plot(
    'extension / m', 'force / N', [_pts([(x, _FX(x)) for x in (0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.07)]),
                                   dict(x=curve(_FX, 0, 0.07)[0], y=curve(_FX, 0, 0.07)[1], color=MUT, lw='thin')],
    'Force against extension', 'Force against extension for a spring: the points lie on a straight line through the origin at first, then curve over at the highest loads.',
    xr=(0, 0.08), yr=(0, 7), xticks=[0, 0.02, 0.04, 0.06, 0.08], yticks=[0, 2, 4, 6]))
F('A V–I graph for a resistor gives a straight line with a clear positive intercept on the V axis', lambda s: plot(
    'I / A', 'V / V', [_pts(_scatter(lambda i: 5.0 * i + 0.65, [0.1, 0.2, 0.3, 0.4, 0.5], 0.05)), _line(5.0, 0.65, 0, 0.6)], 'V against I for a resistor',
    'A V–I graph for a resistor: the best-fit line through the points is straight but meets the V axis above the origin.',
    xr=(0, 0.6), yr=(0, 4), xticks=[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6], yticks=[0, 1, 2, 3, 4]))
F('For a resonance tube, L = v/4f − e. A graph of L against 1/f has intercept −0.012 m', lambda s: plot(
    '(1/f) / 10⁻³ s', 'L / m', [_line(0.085, -0.012, 0, 4)], 'L against 1/f',
    'A straight line on a graph of resonance length L against 1/f, meeting the L axis below the origin at −0.012 m.',
    xr=(0, 4), yr=(-0.05, 0.35), xticks=[0, 1, 2, 3, 4], yticks=[-0.05, 0, 0.1, 0.2, 0.3], notes=[(0, -0.012, '−0.012 m', 'start', 8, 12, True)]))
