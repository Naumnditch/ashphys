# Figures for ch18b.py (18.6–18.10). Numbers come from the stems.


def tgraph(f, t_end, xl, yl, title, desc, yr, xt, yt, **kw):
    return shm_graph(f, t_end, xl, yl, title, desc, yr, xt, yt, **kw)


def damped(A0, ratio, T, cycles, title, desc, yl='x / cm', xt=None, yt=None, peak_labels=()):
    """Damped oscillation whose peaks fall by the same ratio every period T, sampled from the stem's numbers."""
    k = -log(ratio) / T
    xs = wave_xy(lambda t: t, 0, cycles * T, 900)[0]
    ys = [A0 * exp(-k * t) * cos(2 * pi * t / T) for t in xs]
    notes = [(i * T, A0 * ratio ** i, lab, 'start', 8, -10, True) for i, lab in peak_labels]
    return plot('t / s', yl, [dict(x=xs, y=ys)], title, desc, xr=(0, cycles * T), yr=(-A0 * 1.15, A0 * 1.25), xticks=xt, yticks=yt, notes=notes)


# ── 18.7 ──
F('A body moves with x = 0.15 cos(3.0t) m. Calculate its displacement, velocity and acceleration at t = 0.40 s', lambda s: tgraph(
    lambda t: 0.15 * cos(3.0 * t), 4.2, 't / s', 'x / m', 'x = 0.15 cos(3.0t)', 'Graph of x = 0.15 cos(3.0t) m against time; a dashed line marks t = 0.40 s.',
    (-0.18, 0.18), [0, 1, 2, 3, 4], [-0.15, 0, 0.15], vlines=[(0.40, '0.40 s', True)]))
F('An s.h.m. has x = 0.040 sin(ωt) m with period 0.80 s. Calculate the speed at t = 0.10 s', lambda s: tgraph(
    lambda t: 0.040 * sin(2 * pi * t / 0.80), 1.6, 't / s', 'x / m', 'x = 0.040 sin(ωt)', 'Graph of x = 0.040 sin(ωt) m with period 0.80 s; a dashed line marks t = 0.10 s.',
    (-0.05, 0.05), [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6], [-0.04, 0, 0.04], vlines=[(0.10, '0.10 s', True)]))
F('A mass oscillates with x = 0.12 sin(2πft) m and f = 0.50 Hz', lambda s: tgraph(
    lambda t: 0.12 * sin(2 * pi * 0.50 * t), 4.0, 't / s', 'x / m', 'x = 0.12 sin(2πft)', 'Graph of x = 0.12 sin(2πft) m with f = 0.50 Hz; a dashed line marks x = 0.060 m.',
    (-0.15, 0.15), [0, 1, 2, 3, 4], [-0.12, 0, 0.12], hlines=[(0.060, '0.060 m', True)]))
F('A pendulum of length 0.75 m is released from 5.0 cm to one side', lambda s: pendulum(
    'Released pendulum', 'A pendulum of length 0.75 m released from rest 5.0 cm to one side of its equilibrium position (dashed).', L_label='0.75 m', disp_label='5.0 cm'))
F('A mass on a spring oscillates with x = 0.050 cos(12t) m. Calculate the time taken to move from x = +0.050 m to x = −0.025 m', lambda s: tgraph(
    lambda t: 0.050 * cos(12 * t), 1.05, 't / s', 'x / m', 'x = 0.050 cos(12t)', 'Graph of x = 0.050 cos(12t) m against time; a dashed line marks x = −0.025 m.',
    (-0.06, 0.06), [0, 0.2, 0.4, 0.6, 0.8, 1.0], [-0.05, -0.025, 0, 0.05], hlines=[(-0.025, '−0.025 m', True)]))
F('A graph of v² against x² for an oscillator is a straight line from (0, 0.36 m² s⁻²) to (0.0025 m², 0)', lambda s: plot(
    'x² / m²', 'v² / m² s⁻²', [dict(x=[0, 0.0025], y=[0.36, 0])], 'v² against x²',
    'Graph of v² against x²: a straight line from (0, 0.36 m² s⁻²) to (0.0025 m², 0).', xr=(0, 0.003), yr=(0, 0.42),
    xticks=[0, 0.0005, 0.001, 0.0015, 0.002, 0.0025], yticks=[0, 0.12, 0.24, 0.36]))
F('A trolley between springs oscillates with x = 0.060 sin(3.0t) m', lambda s: spring_h(
    'Trolley between springs', 'A trolley between two springs oscillating with x = 0.060 sin(3.0t) m about its central position.', mass_label='trolley', x_label='0.060 m'))

# ── 18.8 ──
F('A pendulum bob of mass 0.20 kg rises 4.0 cm above its lowest point at each end of its swing', lambda s: pendulum(
    'Swinging pendulum bob', 'A pendulum bob of mass 0.20 kg that rises 4.0 cm above its lowest point at each end of its swing.', bob_label='0.20 kg, 4.0 cm higher', angle=20, w=400))
F('A pendulum of length 1.2 m and bob mass 0.40 kg swings with amplitude 8.0 cm', lambda s: pendulum(
    'Pendulum', 'A pendulum of length 1.2 m with a 0.40 kg bob swinging with amplitude 8.0 cm.', L_label='1.2 m', disp_label='8.0 cm', bob_label='0.40 kg'))
F('A 0.40 kg mass on a spring of constant 160 N m⁻¹ is pulled 5.0 cm from equilibrium and released on a frictionless surface', lambda s: spring_h(
    'Mass on a spring', 'A 0.40 kg mass on a frictionless surface attached to a spring of constant 160 N m⁻¹, pulled 5.0 cm from equilibrium and released.',
    mass_label='0.40 kg', k_labels=('160 N m⁻¹', None), x_label='5.0 cm', glider=True, single=True))
F('A pendulum bob of mass 0.25 kg on a 1.5 m string swings with amplitude 0.12 m', lambda s: pendulum(
    'Pendulum', 'A pendulum bob of mass 0.25 kg on a 1.5 m string swinging with amplitude 0.12 m.', L_label='1.5 m', disp_label='0.12 m', bob_label='0.25 kg'))
F('A graph shows the potential energy of an oscillating 0.10 kg mass against displacement', lambda s: (lambda E, X: plot(
    'x / m', 'E_p / J', [dict(x=wave_xy(lambda x: x, -X, X)[0], y=[E * (x / X) ** 2 for x in wave_xy(lambda x: x, -X, X)[0]])],
    'Potential energy against displacement', 'Potential energy of the oscillating 0.10 kg mass against displacement: a parabola reaching 0.045 J at x = ±0.030 m.',
    xr=(-X * 1.2, X * 1.2), yr=(0, E * 1.2), xticks=[-0.03, -0.015, 0, 0.015, 0.03], yticks=[0, 0.015, 0.03, 0.045]))(
    grab(s, r'reaching ([\d.]+) J'), grab(s, r'x = ±([\d.]+) m')))
F('A trolley of mass 0.80 kg between two springs oscillates with amplitude 8.0 cm and period 1.2 s', lambda s: spring_h(
    'Trolley between springs', 'A 0.80 kg trolley between two springs oscillating with amplitude 8.0 cm and period 1.2 s.', mass_label='0.80 kg', x_label='8.0 cm'))
F('A 0.50 kg pendulum bob on a 2.0 m string is pulled aside so that it is 10 cm higher than its lowest point', lambda s: pendulum(
    'Pendulum pulled aside', 'A 0.50 kg pendulum bob on a 2.0 m string pulled aside so that it is 10 cm higher than its lowest point, then released.',
    L_label='2.0 m', bob_label='0.50 kg, 10 cm higher', angle=18, w=400))

# ── 18.9 ──
F('The amplitude of a damped oscillation falls from 12 cm to 9.0 cm. Calculate the fraction of the energy that remains', lambda s: damped(
    grab(s, r'from (\d+) cm'), grab(s, r'to ([\d.]+) cm') / grab(s, r'from (\d+) cm'), 1.0, 3,
    'Damped oscillation', 'A damped oscillation whose amplitude falls from 12 cm to 9.0 cm (marked) over one cycle.', xt=[0, 1, 2, 3], yt=[-12, -6, 0, 6, 12],
    peak_labels=[(0, '12 cm'), (1, '9.0 cm')]))
F('A student records the peak displacements of a damped oscillator at successive cycles', lambda s: plot(
    'cycle number', 'peak / cm', [dict(x=list(range(len(numbers_after(s.replace('cycles:', 'cycles ='), 'cycles')))), y=numbers_after(s.replace('cycles:', 'cycles ='), 'cycles'), kind='points')],
    'Peak displacements', 'Peak displacements at successive cycles: 10.0, 8.5, 7.2, 6.1 and 5.2 cm, falling by roughly the same fraction each cycle.',
    xr=(0, 4.5), yr=(0, 11), xticks=[0, 1, 2, 3, 4], yticks=[0, 2, 4, 6, 8, 10]))
F('A mass on a spring oscillates in air with period 0.80 s; the amplitude falls from 6.0 cm to 5.4 cm in each cycle', lambda s: damped(
    grab(s, r'from ([\d.]+) cm'), grab(s, r'to ([\d.]+) cm') / grab(s, r'from ([\d.]+) cm'), grab(s, r'period ([\d.]+) s'), 4,
    'Damped oscillation', 'Displacement against time for the mass on a spring in air: period 0.80 s, with the amplitude falling from 6.0 cm to 5.4 cm in each cycle.',
    xt=[0, 0.8, 1.6, 2.4, 3.2], yt=[-6, -3, 0, 3, 6], peak_labels=[(0, '6.0 cm'), (1, '5.4 cm')]))
F('The amplitude A of a damped oscillation is measured: t = 0, 10.0 cm', lambda s: (lambda pts: table_plot(
    ['t / s', 'A / cm'], [[t, a] for t, a in pts], 'Amplitude against time',
    'Table and graph of amplitude against time: 10.0 cm at t = 0, 7.4 cm at 10 s, 5.5 cm at 20 s and 4.1 cm at 30 s, a falling curve.',
    dict(xlabel='t / s', ylabel='A / cm', series=[dict(x=[float(t) for t, _ in pts], y=[float(a) for _, a in pts], kind='points')],
         xr=(0, 33), yr=(0, 11), xticks=[0, 10, 20, 30], yticks=[0, 2, 4, 6, 8, 10], h=250)))(re.findall(r't = (\d+)(?: s)?, ([\d.]+) cm', s)))

# ── 18.10 ──
F("In Barton's pendulums, several pendulums hang from a string with a heavy driver pendulum", lambda s: barton(
    "Barton's pendulums", "Barton's pendulums: several light pendulums of different lengths and one heavy driver pendulum hang from the same horizontal string; one light pendulum has the same length as the driver."))
def resonance_pair(s):
    AX, fX = grab(s, r'peak of (\d+) cm at'), grab(s, r'at ([\d.]+) Hz; curve Y')
    AY, fY = grab(s, r'Y has a peak of (\d+) cm'), grab(s, r'cm at ([\d.]+) Hz\. ')
    f0 = fX
    bY = sqrt(2 * (f0 ** 2 - fY ** 2))      # a peak at sqrt(f0² − b²/2) = fY
    bX = bY * AY / AX                       # lighter damping, taller peak
    fs = wave_xy(lambda f: f, 1.0, 3.0, 600)[0]
    raw = lambda b: [1 / sqrt((f0 ** 2 - f ** 2) ** 2 + (b * f) ** 2) for f in fs]  # noqa: E731
    yX, yY = raw(bX), raw(bY)
    yX = [v * AX / max(yX) for v in yX]      # scale each curve to the peak height the stem gives
    yY = [v * AY / max(yY) for v in yY]
    return plot('f / Hz', 'A / cm', [dict(x=fs, y=yX), dict(x=fs, y=yY, color=ACC2, dash='6 4')], 'Resonance curves',
                'Amplitude against driving frequency for two damping settings: curve X peaks at 8 cm at 2.0 Hz; curve Y (dashed, heavier damping) peaks at 3 cm at 1.95 Hz.',
                xr=(1.0, 3.0), yr=(0, 9), xticks=[1.0, 1.5, 2.0, 2.5, 3.0], yticks=[0, 2, 4, 6, 8],
                notes=[(fX, AX, 'X', 'start', 8, -6, False), (fY, AY, 'Y', 'end', -10, -6, False)])


F('A student drives a mass–spring system and plots amplitude against frequency for two damping settings', resonance_pair)
F('A mass–spring system (m = 0.40 kg, k = 64 N m⁻¹) is driven by a vibrator. Readings of amplitude A against frequency f', lambda s: (lambda pts: table_plot(
    ['f / Hz', 'A / cm'], [[f, a] for f, a in pts], 'Amplitude against frequency',
    'Table and graph of amplitude against driving frequency: 1.0 Hz 0.8 cm, 1.5 Hz 2.0 cm, 2.0 Hz 7.5 cm, 2.5 Hz 2.2 cm, 3.0 Hz 0.9 cm, peaking near 2.0 Hz.',
    dict(xlabel='f / Hz', ylabel='A / cm', series=[dict(x=[float(f) for f, _ in pts], y=[float(a) for _, a in pts], kind='points')],
         xr=(0, 3.3), yr=(0, 8.5), xticks=[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0], yticks=[0, 2, 4, 6, 8], h=250)))(re.findall(r'([\d.]+) Hz ([\d.]+) cm', s)))
