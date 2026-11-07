# Figures for ch18a.py (18.1–18.5 oscillations). Every curve is computed from the stem's numbers (grab / regex).


def toks(s, pattern):
    """The comma-separated numbers captured by a regex group, as written in the stem."""
    return [t.strip() for t in re.search(pattern, s).group(1).split(',')]


def two_waves(f1, f2, t_end, xlabel, ylabel, title, desc, yr, xticks, ytl=None, yticks=None, labels=('A', 'B'), xtl=None):
    xs = wave_xy(lambda t: t, 0, t_end, 500)[0]
    return plot(xlabel, ylabel, [dict(x=xs, y=[f1(t) for t in xs]), dict(x=xs, y=[f2(t) for t in xs], color=ACC2, dash='6 4')],
                title, desc, xr=(0, t_end), yr=yr, xticks=xticks, ytl=ytl, yticks=yticks, xtl=xtl,
                legend=[(labels[0], ACC, None), (labels[1], ACC2, '6 4')])


def ellipse_vx(X, V, title, desc, xt, yt, point=None):
    th = [2 * pi * i / 240 for i in range(241)]
    extra = [dict(x=[point[0]], y=[point[1]], kind='dots')] if point else []
    return plot('x / cm', 'v / m s⁻¹', [dict(x=[X * cos(a) for a in th], y=[V * sin(a) for a in th])] + extra, title, desc,
                xr=(-X * 1.3, X * 1.3), yr=(-V * 1.3, V * 1.3), xticks=xt, yticks=yt)


# ── 18.1 ──
F('A 1.2 kg trolley is held between two springs with a combined spring constant of 300 N m⁻¹', lambda s: spring_h(
    'Trolley between springs', 'A 1.2 kg trolley on a horizontal track held between two springs fixed to walls; together the springs have a spring constant of 300 N m⁻¹.',
    mass_label='1.2 kg'))
F('A spring stretches by 6.0 cm when a 0.30 kg mass is hung on it', lambda s: spring_v(
    'Mass on a spring', 'A 0.30 kg mass hanging at rest on a spring, which it has stretched by 6.0 cm from its unstretched length.',
    mass_label='0.30 kg', ext_label='6.0 cm'))
F('A 0.50 kg mass on a single spring oscillates with period 0.80 s. Two identical springs are now placed side by side', lambda s: spring_v(
    'Two springs side by side', 'A 0.50 kg mass supported by two identical springs side by side (in parallel). On one spring alone its period was 0.80 s.',
    mass_label='0.50 kg', double=True))
F('A student measures the period T of a simple pendulum for different lengths L', lambda s: table_plot(
    ['L / m', 'T / s'], [list(r) for r in zip(toks(s, r'L = ([\d., ]+) m'), toks(s, r'T = ([\d., ]+) s'))], 'Period against length',
    'Table and graph of the period of a simple pendulum against its length: L = 0.20, 0.40, 0.60, 0.80, 1.00 m give T = 0.90, 1.27, 1.55, 1.79, 2.01 s, a curve that rises less and less steeply.',
    dict(xlabel='L / m', ylabel='T / s', series=[dict(x=[float(v) for v in toks(s, r'L = ([\d., ]+) m')], y=[float(v) for v in toks(s, r'T = ([\d., ]+) s')], kind='points')],
         xr=(0, 1.1), yr=(0, 2.2), xticks=[0, 0.2, 0.4, 0.6, 0.8, 1.0], yticks=[0, 0.5, 1.0, 1.5, 2.0], h=250)))
F('A spring extends by 4.9 cm when a 0.20 kg mass hangs at rest on it. The mass is pulled down a further 3.0 cm', lambda s: spring_v(
    'Pulling the mass down', 'A 0.20 kg mass hanging at rest on a spring that it has extended by 4.9 cm; the mass is then pulled down a further 3.0 cm and released.',
    mass_label='0.20 kg', ext_label='4.9 cm', pull_label='3.0 cm'))
F('A mass of 0.50 kg on a spring of constant 50 N m⁻¹ is driven by a vibrator whose frequency can be varied', lambda s: spring_v(
    'Driven mass–spring system', 'A 0.50 kg mass on a spring of constant 50 N m⁻¹ hangs from a vibrator that drives the top of the spring up and down at a frequency that can be varied.',
    mass_label='0.50 kg', k_label='k = 50 N m⁻¹', vibrator=True))
F('A pendulum consists of a 50 g bob on a 1.50 m string. It is displaced by 6.0 cm and released', lambda s: pendulum(
    'Simple pendulum', 'A pendulum with a 50 g bob on a 1.50 m string, displaced sideways by 6.0 cm from its equilibrium position (dashed) and released.',
    L_label='1.50 m', disp_label='6.0 cm', bob_label='50 g'))
F('Two different springs, A (k = 40 N m⁻¹) and B (k = 160 N m⁻¹), each carry a 0.40 kg mass', lambda s: hstack([
    spring_v('x', 'x', mass_label='0.40 kg', k_label='A: k = 40 N m⁻¹', w=260),
    spring_v('x', 'x', mass_label='0.40 kg', k_label='B: k = 160 N m⁻¹', w=260)],
    'Two springs', 'Spring A (k = 40 N m⁻¹) and spring B (k = 160 N m⁻¹), each carrying a 0.40 kg mass.'))
F('A glider of mass 0.25 kg on a horizontal air track is held between two stretched springs', lambda s: spring_h(
    'Glider between springs', 'A 0.25 kg glider on a horizontal air track held between two stretched springs, each of spring constant 12 N m⁻¹, fixed to the ends of the track.',
    mass_label='0.25 kg', k_labels=('12 N m⁻¹', '12 N m⁻¹'), glider=True))
F('A student hangs masses on a spring and times 20 oscillations each time', lambda s: table(
    ['m / kg', '20T / s'], [list(r) for r in re.findall(r'm = ([\d.]+) kg, 20T = ([\d.]+) s', s)], 'Timings', 
    'Table of timings: m = 0.10 kg gives 20 oscillations in 9.0 s; m = 0.40 kg gives 20 oscillations in 17.8 s.'))

# ── 18.2 ──
F('A data-logger trace of an oscillating trolley shows the displacement going from +4.0 cm to −4.0 cm and back', lambda s: plot(
    't', 'x / cm', [dict(x=wave_xy(lambda t: t, 0, 2)[0], y=[grab(s, r'from \+([\d.]+) cm') * cos(2 * pi * t) for t in wave_xy(lambda t: t, 0, 2)[0]])],
    'Data-logger trace', 'Displacement against time for an oscillating trolley: the displacement goes from +4.0 cm to −4.0 cm and back, repeatedly.',
    xr=(0, 2), yr=(-5, 5), xtl=[(0, '0')], ytl=[(-4, '−4.0'), (0, '0'), (4, '+4.0')], grid=False))
F('On an oscilloscope screen, one complete cycle of a trace spans 4.0 divisions. The time base is 2.0 ms per division', lambda s: scope(
    'Oscilloscope trace', 'An oscilloscope trace in which one complete cycle spans 4.0 divisions; the time base is 2.0 ms per division.',
    [dict(amp=3, period=grab(s, r'spans ([\d.]+) divisions'))], base='2.0 ms per division'))
F('A displacement–time graph of an oscillation repeats every 0.40 s', lambda s: plot(
    't / s', 'x', [dict(x=wave_xy(lambda t: t, 0, 1.2)[0], y=[sin(2 * pi * t / grab(s, r'every ([\d.]+) s')) for t in wave_xy(lambda t: t, 0, 1.2)[0]])],
    'Displacement against time', 'Displacement–time graph of an oscillation that repeats every 0.40 s; three cycles are shown.',
    xr=(0, 1.2), yr=(-1.2, 1.2), xticks=[0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2], ytl=[(0, '0')]))
F('A displacement–time graph shows 6 complete cycles in 1.5 s', lambda s: plot(
    't / s', 'x', [dict(x=wave_xy(lambda t: t, 0, 1.5, 800)[0], y=[sin(2 * pi * 6 * t / 1.5) for t in wave_xy(lambda t: t, 0, 1.5, 800)[0]])],
    'Displacement against time', 'Displacement–time graph showing 6 complete cycles in 1.5 s.',
    xr=(0, 1.5), yr=(-1.2, 1.2), xticks=[0, 0.5, 1.0, 1.5], ytl=[(0, '0')]))
F('An oscilloscope shows a sinusoidal trace with peak-to-peak height 5.6 divisions', lambda s: scope(
    'Oscilloscope trace', 'An oscilloscope trace of a vibrating plate: peak-to-peak height 5.6 divisions at 0.50 cm per division; one cycle is 3.2 divisions wide at 5.0 ms per division.',
    [dict(amp=grab(s, r'height ([\d.]+) divisions') / 2, period=grab(s, r'cycle is ([\d.]+) divisions'))], gain='0.50 cm per division', base='5.0 ms per division'))
F('A light gate records a pendulum bob of width 2.0 cm blocking the beam for 25 ms', lambda s: pendulum(
    'Light gate at the lowest point', 'A pendulum swinging with amplitude 8.0 cm; a light gate at the lowest point of the swing is blocked for 25 ms by the 2.0 cm wide bob.',
    disp_label='8.0 cm', bob_label='bob 2.0 cm wide', gate=True))
F('A student measures the period of a mass–spring system for masses 0.10, 0.20, 0.30, 0.40 kg', lambda s: table_plot(
    ['m / kg', 'T / s'], [list(r) for r in zip(toks(s, r'masses ([\d., ]+) kg'), toks(s, r'T = ([\d., ]+) s'))], 'Period against mass',
    'Table and graph of period against mass: m = 0.10, 0.20, 0.30, 0.40 kg give T = 0.41, 0.58, 0.71, 0.82 s.',
    dict(xlabel='m / kg', ylabel='T / s', series=[dict(x=[float(v) for v in toks(s, r'masses ([\d., ]+) kg')], y=[float(v) for v in toks(s, r'T = ([\d., ]+) s')], kind='points')],
         xr=(0, 0.45), yr=(0, 0.9), xticks=[0, 0.1, 0.2, 0.3, 0.4], yticks=[0, 0.2, 0.4, 0.6, 0.8], h=250)))
F('An oscilloscope time base is set at 0.20 ms per division. A sound wave trace shows 2.5 cycles across 10 divisions', lambda s: scope(
    'Oscilloscope trace', 'An oscilloscope trace showing 2.5 cycles across the 10 divisions of the screen; the time base is 0.20 ms per division.',
    [dict(amp=2.5, period=10 / grab(s, r'shows ([\d.]+) cycles'))], base='0.20 ms per division'))
F('A student investigates how the period T of a mass–spring system depends on the mass m', lambda s: table_plot(
    ['m / kg', 'T / s'], [list(r) for r in zip(toks(s, r'm = ([\d., ]+) kg'), toks(s, r'T = ([\d., ]+) s'))], 'Period against mass',
    'Table and graph of period against mass: m = 0.10, 0.20, 0.30, 0.40, 0.50 kg give T = 0.40, 0.56, 0.69, 0.80, 0.89 s.',
    dict(xlabel='m / kg', ylabel='T / s', series=[dict(x=[float(v) for v in toks(s, r'm = ([\d., ]+) kg')], y=[float(v) for v in toks(s, r'T = ([\d., ]+) s')], kind='points')],
         xr=(0, 0.55), yr=(0, 1.0), xticks=[0, 0.1, 0.2, 0.3, 0.4, 0.5], yticks=[0, 0.2, 0.4, 0.6, 0.8, 1.0], h=250)))
F('A motion sensor records the displacement x of a trolley oscillating between springs', lambda s: (lambda pts: plot(
    't / s', 'x / cm', [dict(x=[p[0] for p in pts], y=[p[1] for p in pts], kind='points')], 'Motion-sensor readings',
    'Displacement against time from the motion sensor: 0 at t = 0, +3.0 cm at 0.30 s, 0 at 0.60 s, −3.0 cm at 0.90 s and 0 at 1.20 s.',
    xr=(0, 1.3), yr=(-4, 4), xticks=[0, 0.3, 0.6, 0.9, 1.2], yticks=[-3, 0, 3]))(
    [(0.0, 0.0)] + [(float(t), float(x.replace('−', '-').replace('+', ''))) for x, t in re.findall(r'([+−]?[\d.]+) cm at t = ([\d.]+) s', s)] +
    [(float(t), 0.0) for t in re.findall(r'(?<![\d.])0 at t = ([\d.]+) s', s) if float(t) > 0]))
F('A position sensor records an oscillating glider: the displacement is +5.0 cm at t = 0', lambda s: (lambda pts: plot(
    't / s', 'x / cm', [dict(x=[p[0] for p in pts], y=[p[1] for p in pts], kind='points')], 'Position-sensor readings',
    'Displacement against time from the position sensor: +5.0 cm at t = 0, 0 at 0.35 s, −5.0 cm at 0.70 s and +5.0 cm again at 1.40 s.',
    xr=(0, 1.5), yr=(-6, 6), xticks=[0, 0.35, 0.7, 1.05, 1.4], yticks=[-5, 0, 5]))(
    [(float(t), float(x.replace('−', '-').replace('+', ''))) for x, t in re.findall(r'([+−][\d.]+) cm (?:again )?at t = ([\d.]+) s?', s)] +
    [(float(t), 0.0) for t in re.findall(r', 0 at t = ([\d.]+) s', s)] + [(0.0, grab(s, r'is \+([\d.]+) cm at t = 0'))]))
F('An oscilloscope with time base 5.0 ms per division and y-gain 2.0 V per division shows the output of a vibration sensor', lambda s: scope(
    'Oscilloscope trace', 'The output of a vibration sensor (1.0 V per mm) on an oscilloscope: one cycle spans 7.2 divisions and the peak-to-peak height is 4.4 divisions. Y-gain 2.0 V per division; time base 5.0 ms per division.',
    [dict(amp=grab(s, r'height is ([\d.]+) divisions') / 2, period=grab(s, r'spans ([\d.]+) divisions'))], gain='2.0 V per division', base='5.0 ms per division'))

# ── 18.3 ──
F('Two pendulums swing with the same frequency. One reaches its maximum displacement a quarter of a period after the other', lambda s: two_waves(
    lambda t: cos(2 * pi * t), lambda t: cos(2 * pi * (t - 0.25)), 2, 't', 'x', 'Two pendulums',
    'Displacement against time for two pendulums of the same frequency: B (dashed) reaches each maximum a quarter of a period after A.',
    (-1.3, 1.6), None, ytl=[(0, '0')], xtl=[(0, '0'), (0.25, 'T/4'), (1, 'T'), (2, '2T')]))
F('A swing has a period of 3.0 s. A second swing starts 1.5 s later and has the same period', lambda s: (lambda T, d: two_waves(
    lambda t: sin(2 * pi * t / T), lambda t: sin(2 * pi * (t - d) / T) if t >= d else 0.0, 2 * T, 't / s', 'x', 'Two swings',
    'Displacement against time: swing A starts at t = 0 with period 3.0 s; swing B (dashed) starts 1.5 s later with the same period.',
    (-1.3, 1.6), [0, 1.5, 3.0, 4.5, 6.0], ytl=[(0, '0')]))(grab(s, r'period of ([\d.]+) s'), grab(s, r'starts ([\d.]+) s later')))
F('Two pendulums each of period 1.60 s are released 0.20 s apart', lambda s: (lambda T, d: two_waves(
    lambda t: cos(2 * pi * t / T), lambda t: cos(2 * pi * (t - d) / T) if t >= d else 1.0, 2 * T, 't / s', 'x', 'Two pendulums',
    'Displacement against time for two pendulums of period 1.60 s, each released from its maximum displacement: B (dashed) is released 0.20 s after A.',
    (-1.3, 1.6), [0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4, 2.8, 3.2], ytl=[(0, '0')]))(grab(s, r'period ([\d.]+) s'), grab(s, r'released ([\d.]+) s apart')))
F('An object oscillates with x = 4.0 sin(3πt) cm, with t in s', lambda s: plot(
    't / s', 'x / cm', [dict(x=wave_xy(lambda t: t, 0, 4 / 3)[0], y=[grab(s, r'x = ([\d.]+) sin') * sin(3 * pi * t) for t in wave_xy(lambda t: t, 0, 4 / 3)[0]])],
    'x = 4.0 sin(3πt)', 'Graph of x = 4.0 sin(3πt) cm against time from 0 to 4/3 s: two complete cycles of amplitude 4.0 cm.',
    xr=(0, 4 / 3), yr=(-5, 5), xticks=[0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2], yticks=[-4, -2, 0, 2, 4]))
F('Two oscillations of the same frequency are drawn on the same displacement–time axes. The peaks of B occur 2.0 ms after those of A', lambda s: (lambda d, T: two_waves(
    lambda t: cos(2 * pi * t / T), lambda t: cos(2 * pi * (t - d) / T), 2 * T, 't / ms', 'x', 'Two oscillations',
    'Displacement against time for oscillations A and B of period 8.0 ms: each peak of B (dashed) comes 2.0 ms after the matching peak of A.',
    (-1.3, 1.6), [0, 2, 4, 6, 8, 10, 12, 14, 16], ytl=[(0, '0')]))(grab(s, r'occur ([\d.]+) ms after'), grab(s, r'period is ([\d.]+) ms')))
F('A displacement–time graph shows two oscillations, X and Y, of period 40 ms', lambda s: two_waves(
    lambda t: grab(s, r'X has amplitude ([\d.]+) mm') * cos(2 * pi * t / 40), lambda t: grab(s, r'Y has amplitude ([\d.]+) mm') * cos(2 * pi * (t - grab(s, r'maximum at t = (\d+) ms')) / 40),
    80, 't / ms', 'x / mm', 'Oscillations X and Y',
    'Displacement against time for X (amplitude 3.0 mm, maximum at t = 0) and Y (dashed; amplitude 2.0 mm, maximum at t = 30 ms), both of period 40 ms.',
    (-3.6, 4.4), [0, 10, 20, 30, 40, 50, 60, 70, 80], yticks=[-3, -2, -1, 0, 1, 2, 3], labels=('X', 'Y')))
F('Oscillator P obeys x_P = 5.0 sin(4πt) cm and Q obeys x_Q = 5.0 sin(4πt + π/3) cm', lambda s: two_waves(
    lambda t: 5.0 * sin(4 * pi * t), lambda t: 5.0 * sin(4 * pi * t + pi / 3), 1.0, 't / s', 'x / cm', 'Oscillators P and Q',
    'Graphs of x_P = 5.0 sin(4πt) cm (solid) and x_Q = 5.0 sin(4πt + π/3) cm (dashed) from t = 0 to 1.0 s.',
    (-6, 7.5), [0, 0.25, 0.5, 0.75, 1.0], yticks=[-5, 0, 5], labels=('P', 'Q')))
F('A displacement–time graph shows two oscillations of the same frequency 25 Hz. Their peaks are separated by 12 ms', lambda s: (lambda T, d: two_waves(
    lambda t: cos(2 * pi * t / T), lambda t: cos(2 * pi * (t - d) / T), 2 * T, 't / ms', 'x', 'Two 25 Hz oscillations',
    'Displacement against time for two 25 Hz oscillations (period 40 ms) whose peaks are 12 ms apart.',
    (-1.3, 1.6), [0, 12, 20, 40, 60, 80], ytl=[(0, '0')]))(1000 / grab(s, r'frequency (\d+) Hz'), grab(s, r'separated by (\d+) ms')))

# ── 18.4 ──
F('A graph of acceleration against displacement for an oscillator is a straight line through the origin, passing through (0.040 m, −2.5 m s⁻²)', lambda s: plot(
    'x / m', 'a / m s⁻²', [dict(x=[-0.04, 0.04], y=[2.5, -2.5]), dict(x=[0.04], y=[-2.5], kind='dots')], 'Acceleration against displacement',
    'Graph of acceleration against displacement: a straight line through the origin with negative gradient, passing through (0.040 m, −2.5 m s⁻²).',
    xr=(-0.05, 0.05), yr=(-3, 3), xticks=[-0.04, -0.02, 0, 0.02, 0.04], yticks=[-2.5, 0, 2.5]))
F('A test tube weighted at the bottom floats upright in water and bobs up and down', lambda s: test_tube(
    'Floating test tube', 'A test tube weighted at the bottom floats upright in water and bobs up and down.'))
F('For a floating test tube of cross-sectional area 2.0 cm² and mass 0.040 kg', lambda s: test_tube(
    'Floating test tube', 'A weighted test tube of cross-sectional area 2.0 cm² and mass 0.040 kg floats upright in water and bobs up and down.',
    area_label='area 2.0 cm²', mass_label='mass 0.040 kg'))
F('A 0.20 kg mass on a spring of constant 80 N m⁻¹ is pulled 4.0 cm below equilibrium and released', lambda s: spring_v(
    'Mass pulled down', 'A 0.20 kg mass on a spring of constant 80 N m⁻¹ is pulled 4.0 cm below its equilibrium position and released.',
    mass_label='0.20 kg', k_label='k = 80 N m⁻¹', pull_label='4.0 cm'))
F('A platform vibrates vertically with s.h.m. of frequency 5.0 Hz. A small coin rests on it', lambda s: platform_coin(
    'Coin on a vibrating platform', 'A small coin rests on a horizontal platform that a vibrator moves up and down with s.h.m. of frequency 5.0 Hz.', f_label='5.0 Hz'))
F('A U-tube contains a column of liquid of total length 0.60 m', lambda s: u_tube(
    'Liquid oscillating in a U-tube', 'A U-tube containing a liquid column of total length 0.60 m, displaced so that one side is higher than the equilibrium level; released, it oscillates.',
    L_label='total liquid length 0.60 m'))
F('A ball bearing of mass 20 g rolls in a curved track of radius of curvature 0.40 m', lambda s: curved_track(
    'Ball in a curved track', 'A 20 g ball bearing rolling back and forth near the bottom of a curved track of radius of curvature 0.40 m.',
    R_label='radius of curvature 0.40 m', mass_label='20 g'))
F('A 0.50 kg block on a frictionless surface is attached to a spring of constant 200 N m⁻¹ and pulled 8.0 cm', lambda s: spring_h(
    'Block on a spring', 'A 0.50 kg block on a frictionless surface attached to a spring of constant 200 N m⁻¹, pulled 8.0 cm from its equilibrium position.',
    mass_label='0.50 kg', k_labels=('200 N m⁻¹', None), x_label='8.0 cm', glider=True, single=True))

# ── 18.5 ──
def tgraph(f, t_end, xl, yl, title, desc, yr, xt, yt, **kw):
    return shm_graph(f, t_end, xl, yl, title, desc, yr, xt, yt, **kw)


F('A displacement–time graph of s.h.m. has peaks at +6.0 cm and the time between successive peaks is 0.80 s', lambda s: (lambda A, T: tgraph(
    lambda t: A * cos(2 * pi * t / T), 2 * T, 't / s', 'x / cm', 'Displacement against time',
    'Displacement–time graph of s.h.m. with peaks at +6.0 cm, 0.80 s apart.', (-7, 7), [0, 0.4, 0.8, 1.2, 1.6], [-6, -3, 0, 3, 6]))(
    grab(s, r'peaks at \+([\d.]+) cm'), grab(s, r'peaks is ([\d.]+) s')))
F('A velocity–time graph of an s.h.m. has a maximum of 0.50 m s⁻¹ and period 2.0 s', lambda s: (lambda V, T: tgraph(
    lambda t: V * cos(2 * pi * t / T), 2 * T, 't / s', 'v / m s⁻¹', 'Velocity against time',
    'Velocity–time graph of s.h.m. with a maximum velocity of 0.50 m s⁻¹ and period 2.0 s.', (-0.6, 0.6), [0, 1, 2, 3, 4], [-0.5, 0, 0.5]))(
    grab(s, r'maximum of ([\d.]+) m'), grab(s, r'period ([\d.]+) s')))
F('An acceleration–time graph for s.h.m. has maximum value 9.0 m s⁻² and period 0.50 s', lambda s: (lambda A, T: tgraph(
    lambda t: -A * cos(2 * pi * t / T), 2 * T, 't / s', 'a / m s⁻²', 'Acceleration against time',
    'Acceleration–time graph of s.h.m. with maximum value 9.0 m s⁻² and period 0.50 s.', (-10, 10), [0, 0.25, 0.5, 0.75, 1.0], [-9, 0, 9]))(
    grab(s, r'maximum value ([\d.]+) m'), grab(s, r'period ([\d.]+) s')))
F('An x–t graph of s.h.m. passes through zero moving upwards at t = 0 and first reaches its maximum at t = 0.15 s', lambda s: (lambda tq: plot(
    't / s', 'x', [dict(x=wave_xy(lambda t: t, 0, 8 * tq)[0], y=[sin(2 * pi * t / (4 * tq)) for t in wave_xy(lambda t: t, 0, 8 * tq)[0]])],
    'Displacement against time', 'x–t graph of s.h.m. passing through zero moving upwards at t = 0 and first reaching its maximum at t = 0.15 s (dashed line).',
    xr=(0, 8 * tq), yr=(-1.2, 1.2), xticks=[0, 0.3, 0.6, 0.9, 1.2], ytl=[(0, '0')], vlines=[(tq, '0.15 s', True)]))(grab(s, r'maximum at t = ([\d.]+) s')))
F('The gradient of an x–t graph of s.h.m. at the equilibrium crossing is 0.24 m s⁻¹. The amplitude is 3.0 cm', lambda s: (lambda g, A: tgraph(
    lambda t: A * sin(g / (A / 100) * t), 2 * pi / (g / (A / 100)) * 2, 't / s', 'x / cm', 'Gradient at the crossing',
    'x–t graph of s.h.m. of amplitude 3.0 cm; the dashed tangent at the equilibrium crossing (t = 0) has a gradient of 0.24 m s⁻¹.',
    (-4, 4), [0, 0.4, 0.8, 1.2, 1.6], [-3, 0, 3], extra=[dict(x=[0, 0.16], y=[0, g * 100 * 0.16], color=ACC2, dash='5 4')]))(
    grab(s, r'crossing is ([\d.]+) m'), grab(s, r'amplitude is ([\d.]+) cm')))
F('A displacement–time graph of s.h.m. has amplitude 4.0 cm and period 1.2 s. Calculate the gradient', lambda s: (lambda A, T: tgraph(
    lambda t: A * sin(2 * pi * t / T), 2 * T, 't / s', 'x / cm', 'Displacement against time',
    'x–t graph of s.h.m. with amplitude 4.0 cm and period 1.2 s; a dashed line marks x = 2.0 cm.', (-5, 5), [0, 0.6, 1.2, 1.8, 2.4], [-4, -2, 0, 2, 4],
    hlines=[(2.0, '2.0 cm', True)]))(grab(s, r'amplitude ([\d.]+) cm'), grab(s, r'period ([\d.]+) s')))
F('A v–t graph for an oscillator has a maximum of 0.62 m s⁻¹, and the time between successive maxima is 0.45 s', lambda s: (lambda V, T: tgraph(
    lambda t: V * cos(2 * pi * t / T), 2 * T, 't / s', 'v / m s⁻¹', 'Velocity against time',
    'v–t graph with maxima of 0.62 m s⁻¹ that are 0.45 s apart.', (-0.75, 0.75), [0, 0.45, 0.9], [-0.62, 0, 0.62]))(
    grab(s, r'maximum of ([\d.]+) m'), grab(s, r'maxima is ([\d.]+) s')))
F('An s.h.m. obeys x = 0.080 sin(5.0t) m. Calculate the gradient of the x–t graph at t = 0.20 s', lambda s: tgraph(
    lambda t: 0.080 * sin(5.0 * t), 2.6, 't / s', 'x / m', 'x = 0.080 sin(5.0t)',
    'Graph of x = 0.080 sin(5.0t) m against time; a dashed line marks t = 0.20 s.', (-0.1, 0.1), [0, 0.5, 1.0, 1.5, 2.0, 2.5], [-0.08, -0.04, 0, 0.04, 0.08],
    vlines=[(grab(s, r'at t = ([\d.]+) s'), '0.20 s', True)]))
F('An x–t graph of s.h.m. shows x = 3.0 cm at t = 0 (a maximum) and period 2.4 s', lambda s: (lambda A, T: tgraph(
    lambda t: A * cos(2 * pi * t / T), T, 't / s', 'x / cm', 'Displacement against time',
    'x–t graph of s.h.m. starting at its maximum, x = 3.0 cm, at t = 0, with period 2.4 s; a dashed line marks t = 0.40 s.',
    (-3.6, 3.6), [0, 0.4, 0.8, 1.2, 1.6, 2.0, 2.4], [-3, 0, 3], vlines=[(0.40, '0.40 s', True)]))(grab(s, r'x = ([\d.]+) cm at t = 0'), grab(s, r'period ([\d.]+) s')))
F('A velocity–displacement graph for an oscillator is an ellipse crossing the x-axis at ±5.0 cm', lambda s: ellipse_vx(
    grab(s, r'at ±([\d.]+) cm'), grab(s, r'at ±([\d.]+) m s'), 'Velocity against displacement',
    'Velocity–displacement graph: an ellipse crossing the x-axis at ±5.0 cm and the v-axis at ±0.40 m s⁻¹.', [-5, 0, 5], [-0.4, 0, 0.4]))
F('A velocity–time graph of s.h.m. is v = 0.15 cos(10t) m s⁻¹', lambda s: plot(
    't / s', 'v / m s⁻¹', [dict(x=wave_xy(lambda t: t, 0, pi / 20)[0], y=[0.15 * cos(10 * t) for t in wave_xy(lambda t: t, 0, pi / 20)[0]], kind='area'),
                           dict(x=wave_xy(lambda t: t, 0, 1.26)[0], y=[0.15 * cos(10 * t) for t in wave_xy(lambda t: t, 0, 1.26)[0]])],
    'v = 0.15 cos(10t)', 'Graph of v = 0.15 cos(10t) m s⁻¹ against time; the shaded area runs from t = 0 to π/20 s (a quarter period).',
    xr=(0, 1.26), yr=(-0.18, 0.18), xticks=[0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2], yticks=[-0.15, 0, 0.15]))
F('On a displacement–time graph for s.h.m. with period 0.60 s and amplitude 5.0 cm, starting from a maximum', lambda s: (lambda A, T: tgraph(
    lambda t: A * cos(2 * pi * t / T), 2 * T, 't / s', 'x / cm', 'Displacement against time',
    'x–t graph of s.h.m. with period 0.60 s and amplitude 5.0 cm, starting from a maximum; a dashed line marks t = 0.25 s.',
    (-6, 6), [0, 0.3, 0.6, 0.9, 1.2], [-5, 0, 5], vlines=[(0.25, '0.25 s', True)]))(grab(s, r'amplitude ([\d.]+) cm'), grab(s, r'period ([\d.]+) s')))
F('An x–t graph of s.h.m. crosses zero at t = 0.10 s and next crosses zero at t = 0.35 s', lambda s: (lambda t1, t2, A: tgraph(
    lambda t: A * sin(pi * (t - t1) / (t2 - t1)), 4 * (t2 - t1) + t1, 't / s', 'x / cm', 'Zero crossings',
    'x–t graph of s.h.m. of amplitude 1.5 cm that crosses zero at t = 0.10 s and next at t = 0.35 s.', (-2, 2), [0, 0.1, 0.35, 0.6, 0.85, 1.1], [-1.5, 0, 1.5]))(
    grab(s, r'zero at t = ([\d.]+) s and'), grab(s, r'next crosses zero at t = ([\d.]+) s'), grab(s, r'amplitude is ([\d.]+) cm')))
F('In a v–t graph of s.h.m., the velocity is zero at t = 0.30 s and at t = 0.70 s, and negative between them', lambda s: (lambda t1, t2: plot(
    't / s', 'v', [dict(x=wave_xy(lambda t: t, 0, 1.4)[0], y=[-sin(pi * (t - t1) / (t2 - t1)) for t in wave_xy(lambda t: t, 0, 1.4)[0]])],
    'Velocity against time', 'v–t graph of s.h.m.: the velocity is zero at t = 0.30 s and t = 0.70 s and negative between them.',
    xr=(0, 1.4), yr=(-1.2, 1.2), xticks=[0, 0.3, 0.7, 1.1], ytl=[(0, '0')]))(grab(s, r'zero at t = ([\d.]+) s and'), grab(s, r'and at t = ([\d.]+) s')))
F('A graph of acceleration a against displacement x for an oscillator is a straight line from (−0.030 m, +2.7 m s⁻²)', lambda s: plot(
    'x / m', 'a / m s⁻²', [dict(x=[-0.030, 0.030], y=[2.7, -2.7])], 'Acceleration against displacement',
    'Graph of acceleration against displacement: a straight line from (−0.030 m, +2.7 m s⁻²) to (+0.030 m, −2.7 m s⁻²) through the origin.',
    xr=(-0.04, 0.04), yr=(-3.2, 3.2), xticks=[-0.03, 0, 0.03], yticks=[-2.7, 0, 2.7]))
F('A displacement–time graph shows x = −2.0 cm at t = 0, rising to +2.0 cm at t = 0.30 s for the first time', lambda s: (lambda A, th: tgraph(
    lambda t: -A * cos(pi * t / th), 4 * th, 't / s', 'x / cm', 'Displacement against time',
    'x–t graph starting at x = −2.0 cm at t = 0 and first reaching +2.0 cm at t = 0.30 s.', (-2.6, 2.6), [0, 0.3, 0.6, 0.9, 1.2], [-2, 0, 2]))(
    grab(s, r'x = −([\d.]+) cm at t = 0'), grab(s, r'at t = ([\d.]+) s for the first')))
F('A mass oscillates with x = 0.060 cos(4πt) m', lambda s: tgraph(
    lambda t: 0.060 * cos(4 * pi * t), 1.0, 't / s', 'x / m', 'x = 0.060 cos(4πt)', 'Graph of x = 0.060 cos(4πt) m from t = 0 to 1.0 s: two cycles.',
    (-0.075, 0.075), [0, 0.25, 0.5, 0.75, 1.0], [-0.06, -0.03, 0, 0.03, 0.06]))
F('A displacement–time graph of a vibrating beam shows amplitude 1.2 mm and 6 complete cycles in 15 ms', lambda s: (lambda A, n, T: tgraph(
    lambda t: A * sin(2 * pi * n * t / T), T, 't / ms', 'x / mm', 'Vibrating beam', 'x–t graph of a vibrating beam: amplitude 1.2 mm, 6 complete cycles in 15 ms.',
    (-1.5, 1.5), [0, 2.5, 5, 7.5, 10, 12.5, 15], [-1.2, 0, 1.2], n=900))(grab(s, r'amplitude ([\d.]+) mm'), grab(s, r'(\d+) complete cycles'), grab(s, r'in (\d+) ms')))
F('A student uses a motion sensor to obtain these readings for an oscillating glider: t/s: 0, 0.10', lambda s: table_plot(
    ['t / s', 'x / cm'], [list(r) for r in zip(toks(s, r't/s: ([\d., ]+);'), toks(s, r'x/cm: ([\d., ]+)\.'))], 'Motion-sensor readings',
    'Table and graph of glider displacement against time: t = 0, 0.10, 0.20, 0.30, 0.40 s give x = 0, 2.9, 4.8, 4.8, 2.9 cm.',
    dict(xlabel='t / s', ylabel='x / cm', series=[dict(x=[float(v) for v in toks(s, r't/s: ([\d., ]+);')], y=[float(v) for v in toks(s, r'x/cm: ([\d., ]+)\.')], kind='points')],
         xr=(0, 0.45), yr=(0, 5.5), xticks=[0, 0.1, 0.2, 0.3, 0.4], yticks=[0, 1, 2, 3, 4, 5], h=250)))
F('A sketch of velocity against displacement for an s.h.m. is an ellipse. When the mass is 3.0 cm from equilibrium', lambda s: (lambda x1, v1, A: ellipse_vx(
    A, v1 / sqrt(1 - (x1 / A) ** 2), 'Velocity against displacement',
    'Velocity–displacement ellipse for s.h.m. of amplitude 5.0 cm; the marked point is at 3.0 cm from equilibrium with speed 0.48 m s⁻¹.',
    [-5, -3, 0, 3, 5], [-0.48, 0, 0.48], point=(x1, v1)))(grab(s, r'mass is ([\d.]+) cm'), grab(s, r'speed is ([\d.]+) m'), grab(s, r'amplitude is ([\d.]+) cm')))
F('An oscillator\'s displacement is x = 0.040 sin(2πft) m with f = 2.5 Hz', lambda s: tgraph(
    lambda t: 0.040 * sin(2 * pi * grab(s, r'f = ([\d.]+) Hz') * t), 0.8, 't / s', 'x / m', 'x = 0.040 sin(2πft)',
    'Graph of x = 0.040 sin(2πft) m with f = 2.5 Hz from t = 0 to 0.8 s: two cycles.', (-0.05, 0.05), [0, 0.2, 0.4, 0.6, 0.8], [-0.04, 0, 0.04]))
F('A velocity–time graph of a vibrating bridge shows v = 0.090 sin(2.5t) m s⁻¹', lambda s: tgraph(
    lambda t: 0.090 * sin(2.5 * t), 5.0, 't / s', 'v / m s⁻¹', 'v = 0.090 sin(2.5t)', 'Graph of v = 0.090 sin(2.5t) m s⁻¹ for a vibrating bridge, from t = 0 to 5.0 s.',
    (-0.11, 0.11), [0, 1, 2, 3, 4, 5], [-0.09, 0, 0.09]))
F('A displacement–time graph for a mass on a spring is x = 0.050 sin(πt) m', lambda s: tgraph(
    lambda t: 0.050 * sin(pi * t), 4.0, 't / s', 'x / m', 'x = 0.050 sin(πt)', 'Graph of x = 0.050 sin(πt) m from t = 0 to 4.0 s: two cycles of period 2.0 s.',
    (-0.06, 0.06), [0, 1, 2, 3, 4], [-0.05, 0, 0.05]))
F('An acceleration–time graph for an oscillating object is a = −2.4 cos(4.0t) m s⁻²', lambda s: tgraph(
    lambda t: -2.4 * cos(4.0 * t), 3.2, 't / s', 'a / m s⁻²', 'a = −2.4 cos(4.0t)', 'Graph of a = −2.4 cos(4.0t) m s⁻² from t = 0 to 3.2 s.',
    (-3, 3), [0, 0.8, 1.6, 2.4, 3.2], [-2.4, 0, 2.4]))
