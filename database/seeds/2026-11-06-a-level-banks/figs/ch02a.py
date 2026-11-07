# Figures for ch02a.py (Chapter 2, 2.1 to 2.5): velocity–time graphs generated from the speeds, times,
# gradients and equations in each stem; shaded areas where a displacement is asked for.


def _vt(pts, title, desc, xr, yr, xt, yt, shade=False, notes=(), extra=(), xlabel='t / s', ylabel='v / m s⁻¹', **kw):
    series = []
    if shade:
        series.append(dict(x=[p[0] for p in pts], y=[p[1] for p in pts], kind='area'))
    series.append(dict(x=[p[0] for p in pts], y=[p[1] for p in pts]))
    return plot(xlabel, ylabel, series + list(extra), title, desc, xr=xr, yr=yr, xticks=xt, yticks=yt, notes=list(notes), **kw)


def _n(x, y, t, anchor='start', dx=8, dy=-10, v=True):
    return (x, y, t, anchor, dx, dy, v)


def _pts_(pairs, color=None):
    return dict(x=[p[0] for p in pairs], y=[p[1] for p in pairs], kind='points', color=color or ACC2)


def _fn(f, x0, x1, **kw):
    xs, ys = curve(f, x0, x1)
    return dict(x=xs, y=ys, **kw)


# ── 2.1 ──
F('A car moving at 12 m s⁻¹ accelerates uniformly at 1.8 m s⁻² for 6.0 s, then decelerates', lambda s: _vt(
    [(0, 12), (6.0, 22.8), (14, 0)], 'Speeding up then braking', 'A v–t graph rising in a straight line from 12 m s⁻¹ for 6.0 s and then falling in a straight line to zero over 8.0 s.',
    (0, 15), (0, 25), [0, 3, 6, 9, 12, 15], [0, 5, 10, 15, 20, 25], notes=[_n(0, 12, '12 m s⁻¹', 'start', 8, 14)]))
F('A lift starts from rest, accelerates upwards at 1.5 m s⁻² for 2.0 s', lambda s: _vt(
    [(0, 0), (2.0, 3.0), (6.0, 3.0), (9.0, 0)], 'Lift journey', 'A lift v–t graph: a straight rise from rest for 2.0 s, constant speed, then a straight fall to rest; the constant-speed time is not to scale.',
    (0, 10), (0, 4), [0, 2, 4, 6, 8, 10], [0, 1, 2, 3, 4], xtl=[(0, '0'), (2.0, '2.0')]))
F('A car travels round a bend, its velocity changing from 20 m s⁻¹ north to 20 m s⁻¹ east in 5.0 s', lambda s: vector_diff(
    'Change of velocity on a bend', 'Velocities of 20 m s⁻¹ north and 20 m s⁻¹ east drawn from a common point, with Δv dashed.',
    (0, 20), (20, 0), 'v₁ = 20 m s⁻¹', 'v₂ = 20 m s⁻¹'))
F('A skier\'s speed rises from 4.0 m s⁻¹ to 16 m s⁻¹ down a slope in 6.0 s', lambda s: _vt(
    [(0, 4.0), (6.0, 16), (8.0, 10)], 'Skier', 'A v–t graph rising in a straight line from 4.0 m s⁻¹ to 16 m s⁻¹ in 6.0 s, then falling to 10 m s⁻¹ at 8.0 s.',
    (0, 8), (0, 20), [0, 2, 4, 6, 8], [0, 4, 8, 12, 16, 20]))
F('A ball rolls up a ramp at 5.0 m s⁻¹ and decelerates at 2.0 m s⁻²', lambda s: _vt(
    [(0, 5.0), (4.0, -3.0)], 'Ball on a ramp', 'A straight v–t line starting at 5.0 m s⁻¹, crossing zero at 2.5 s and continuing below the axis to 4.0 s (up the ramp positive).',
    (0, 4.5), (-4, 6), [0, 1, 2, 3, 4], [-4, -2, 0, 2, 4, 6], notes=[_n(0, 5.0, '5.0 m s⁻¹', 'start', 8, -8)]))

# ── 2.2 ──
F('A car accelerates uniformly. Its speed is 8.0 m s⁻¹ at t = 2.0 s and 20 m s⁻¹ at t = 6.0 s. Calculate its acceleration', lambda s: _vt(
    [(0, 2.0), (7.0, 23)], 'Uniform acceleration', 'A straight v–t line through (2.0 s, 8.0 m s⁻¹) and (6.0 s, 20 m s⁻¹).',
    (0, 7), (0, 25), [0, 1, 2, 3, 4, 5, 6, 7], [0, 5, 10, 15, 20, 25], extra=[_pts_([(2.0, 8.0), (6.0, 20)])],
    notes=[_n(2.0, 8.0, '(2.0, 8.0)', 'start', 10, 12), _n(6.0, 20, '(6.0, 20)', 'end', -10, -8)]))
F('A dragster accelerates from rest at 30 m s⁻² for 3.5 s and then at 15 m s⁻² for 2.0 s', lambda s: _vt(
    [(0, 0), (3.5, 105), (5.5, 135)], 'Dragster', 'A v–t graph rising steeply (30 m s⁻²) for 3.5 s and then less steeply (15 m s⁻²) for 2.0 s.',
    (0, 6), (0, 150), [0, 1, 2, 3, 4, 5, 6], [0, 30, 60, 90, 120, 150]))
F('A lift accelerates upwards at 1.2 m s⁻² for 2.5 s, travels at constant speed for 6.0 s and decelerates to rest in 2.0 s', lambda s: _vt(
    [(0, 0), (2.5, 3.0), (8.5, 3.0), (10.5, 0)], 'Lift v–t graph', 'A lift v–t graph: a straight rise over 2.5 s, constant speed for 6.0 s and a straight fall to rest over 2.0 s.',
    (0, 11), (0, 4), [0, 2, 4, 6, 8, 10], [0, 1, 2, 3, 4]))
F('A train decelerates uniformly from 40 m s⁻¹ to 16 m s⁻¹ in 30 s', lambda s: _vt(
    [(0, 40), (30, 16)], 'Braking train', 'A straight v–t line falling from 40 m s⁻¹ at t = 0 to 16 m s⁻¹ at 30 s, continued (dashed) at the same gradient to v = 0.',
    (0, 55), (0, 45), [0, 10, 20, 30, 40, 50], [0, 10, 20, 30, 40], extra=[dict(x=[30, 50], y=[16, 0], color=MUT, dash='5 4')]))

# ── 2.4 ──
F('A v–t graph rises in a straight line from 0 to 12 m s⁻¹ in 4.0 s', lambda s: _vt(
    [(0, 0), (4.0, 12)], 'Velocity–time graph', 'A straight v–t line from the origin to 12 m s⁻¹ at 4.0 s.', (0, 5), (0, 15), [0, 1, 2, 3, 4, 5], [0, 3, 6, 9, 12, 15]))
F('A v–t graph falls in a straight line from 20 m s⁻¹ to 0 in 8.0 s', lambda s: _vt(
    [(0, 20), (8.0, 0)], 'Velocity–time graph', 'A straight v–t line falling from 20 m s⁻¹ at t = 0 to zero at 8.0 s.', (0, 10), (0, 25), [0, 2, 4, 6, 8, 10], [0, 5, 10, 15, 20, 25]))
F('A v–t graph is a straight line from (0 s, 4.0 m s⁻¹) to (5.0 s, 14 m s⁻¹)', lambda s: _vt(
    [(0, 4.0), (5.0, 14)], 'Velocity–time graph', 'A straight v–t line from (0 s, 4.0 m s⁻¹) to (5.0 s, 14 m s⁻¹).', (0, 6), (0, 16), [0, 1, 2, 3, 4, 5, 6], [0, 4, 8, 12, 16],
    notes=[_n(0, 4.0, '4.0', 'start', 8, 12), _n(5.0, 14, '(5.0, 14)', 'end', -8, -10)]))
F('A v–t line for a falling stone goes from 0 at t = 0 to 29.4 m s⁻¹ at t = 3.0 s', lambda s: _vt(
    [(0, 0), (3.0, 29.4)], 'Falling stone', 'A straight v–t line from the origin to 29.4 m s⁻¹ at 3.0 s.', (0, 3.5), (0, 35), [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5], [0, 10, 20, 30],
    notes=[_n(3.0, 29.4, '29.4', 'end', -8, -10)]))
F('A train\'s v–t graph is a straight line from 30 m s⁻¹ at 10 s to 18 m s⁻¹ at 25 s', lambda s: _vt(
    [(10, 30), (25, 18)], 'Train slowing', 'A straight v–t line from (10 s, 30 m s⁻¹) to (25 s, 18 m s⁻¹).', (0, 30), (0, 35), [0, 5, 10, 15, 20, 25, 30], [0, 10, 20, 30],
    notes=[_n(10, 30, '(10, 30)', 'start', 8, -10), _n(25, 18, '(25, 18)', 'end', -8, 14)]))
F('A lift\'s v–t graph rises from 0 to 2.4 m s⁻¹ in 3.0 s', lambda s: _vt(
    [(0, 0), (3.0, 2.4)], 'Lift accelerating', 'A straight v–t line from the origin to 2.4 m s⁻¹ at 3.0 s.', (0, 4), (0, 3), [0, 1, 2, 3, 4], [0, 1, 2, 3]))
F('A toy car\'s v–t graph is a straight line through (1.0 s, 0.50 m s⁻¹) and (3.0 s, 1.70 m s⁻¹)', lambda s: _vt(
    [(0, -0.10), (4.0, 2.30)], 'Toy car', 'A straight v–t line through (1.0 s, 0.50 m s⁻¹) and (3.0 s, 1.70 m s⁻¹).', (0, 4), (-0.5, 2.5), [0, 1, 2, 3, 4], [-0.5, 0, 0.5, 1.0, 1.5, 2.0, 2.5],
    extra=[_pts_([(1.0, 0.50), (3.0, 1.70)])], notes=[_n(1.0, 0.50, '(1.0, 0.50)', 'start', 10, 12), _n(3.0, 1.70, '(3.0, 1.70)', 'end', -10, -8)]))
F('A v–t graph has three straight sections: 0 to 10 m s⁻¹ in 0–5.0 s', lambda s: _vt(
    [(0, 0), (5.0, 10), (12, 10), (16, 0)], 'Three-stage journey', 'A v–t graph rising to 10 m s⁻¹ in 5.0 s, constant until 12 s, then falling to zero at 16 s.',
    (0, 18), (0, 12), [0, 2, 4, 6, 8, 10, 12, 14, 16, 18], [0, 2, 4, 6, 8, 10, 12]))
_T24 = lambda t: 8.0 + 2.0 * (t - 4.0) - 0.15 * (t - 4.0) ** 2  # noqa: E731  tangent at 4.0 s: v = 2.0 + 2.0(t − 1.0)
F('A tangent to a curved v–t graph at t = 4.0 s passes through (1.0 s, 2.0 m s⁻¹) and (7.0 s, 14 m s⁻¹)', lambda s: plot(
    't / s', 'v / m s⁻¹', [_fn(_T24, 0, 9), dict(x=[1.0, 7.0], y=[2.0, 14], color=ACC2, dash='6 4'), _pts_([(1.0, 2.0), (7.0, 14)])],
    'Tangent to a v–t curve', 'A curved v–t graph with a dashed tangent at t = 4.0 s passing through (1.0 s, 2.0 m s⁻¹) and (7.0 s, 14 m s⁻¹).',
    xr=(0, 9), yr=(0, 16), xticks=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], yticks=[0, 4, 8, 12, 16],
    notes=[_n(1.0, 2.0, '(1.0, 2.0)', 'start', 10, 4), _n(7.0, 14, '(7.0, 14)', 'end', -10, -8)]))
F('The v–t graph of a thrown ball is a straight line from +15 m s⁻¹ at t = 0 to −15 m s⁻¹ at t = 3.06 s', lambda s: _vt(
    [(0, 15), (3.06, -15)], 'Ball thrown upwards', 'A straight v–t line from +15 m s⁻¹ at t = 0 to −15 m s⁻¹ at 3.06 s, crossing zero half-way (up positive).',
    (0, 3.5), (-20, 20), [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5], [-20, -10, 0, 10, 20]))
F('A car\'s v–t graph is a straight line through (2.0 s, 8.0 m s⁻¹) and (8.0 s, 26 m s⁻¹)', lambda s: _vt(
    [(2.0, 8.0), (8.0, 26)], 'Extrapolating a v–t line', 'A straight v–t line through (2.0 s, 8.0 m s⁻¹) and (8.0 s, 26 m s⁻¹); the part before 2.0 s is to be extrapolated.',
    (0, 9), (0, 30), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 10, 20, 30], extra=[dict(x=[0, 2.0], y=[2.0, 8.0], color=MUT, dash='4 3')],
    notes=[_n(2.0, 8.0, '(2.0, 8.0)', 'start', 10, 12), _n(8.0, 26, '(8.0, 26)', 'end', -8, -10)]))
_TAU = 5.0 / log(9.8 / 4.2)
_SKY = lambda t: 9.8 * _TAU * (1 - exp(-t / _TAU))  # noqa: E731  a(0) = 9.8, a(5.0) = 4.2
F('Tangents to a skydiver\'s v–t curve have gradients 9.8 m s⁻² at t = 0 and 4.2 m s⁻² at t = 5.0 s', lambda s: plot(
    't / s', 'v / m s⁻¹', [_fn(_SKY, 0, 20), dict(x=[0, 3.5], y=[0, 9.8 * 3.5], color=ACC2, dash='6 4'),
                           dict(x=[1.5, 8.5], y=[_SKY(5) - 4.2 * 3.5, _SKY(5) + 4.2 * 3.5], color=ACC2, dash='6 4')],
    'Skydiver', 'A skydiver\'s v–t curve rising and levelling off, with dashed tangents at t = 0 (gradient 9.8 m s⁻²) and t = 5.0 s (gradient 4.2 m s⁻²).',
    xr=(0, 20), yr=(0, 60), xticks=[0, 5, 10, 15, 20], yticks=[0, 20, 40, 60]))
F('A v–t graph rises from 0 to 8.0 m s⁻¹ in 4.0 s and then from 8.0 m s⁻¹ to 12 m s⁻¹ in the next 4.0 s', lambda s: _vt(
    [(0, 0), (4.0, 8.0), (8.0, 12)], 'Two gradients', 'A v–t graph rising from 0 to 8.0 m s⁻¹ in 4.0 s and then from 8.0 to 12 m s⁻¹ in the next 4.0 s.',
    (0, 9), (0, 14), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], [0, 2, 4, 6, 8, 10, 12, 14]))
F('A v–t graph is a straight line from 25 m s⁻¹ at t = 0 with gradient −1.25 m s⁻²', lambda s: _vt(
    [(0, 25), (20, 0)], 'Uniform deceleration', 'A straight v–t line falling from 25 m s⁻¹ at t = 0 with gradient −1.25 m s⁻².', (0, 25), (0, 30), [0, 5, 10, 15, 20, 25], [0, 10, 20, 30],
    notes=[_n(0, 25, '25 m s⁻¹', 'start', 8, -8)]))
F('A lift\'s v–t graph shows it slowing from 3.0 m s⁻¹ to rest in 2.0 s', lambda s: _vt(
    [(0, 3.0), (2.0, 0)], 'Lift stopping', 'A straight v–t line falling from 3.0 m s⁻¹ to zero in 2.0 s.', (0, 2.5), (0, 4), [0, 0.5, 1.0, 1.5, 2.0, 2.5], [0, 1, 2, 3, 4]))
F('A car\'s v–t graph rises from 5.0 m s⁻¹ to 17 m s⁻¹ in a straight line over 8.0 s', lambda s: _vt(
    [(0, 5.0), (8.0, 17)], 'Car accelerating', 'A straight v–t line from 5.0 m s⁻¹ at t = 0 to 17 m s⁻¹ at 8.0 s.', (0, 8), (0, 20), [0, 2, 4, 6, 8], [0, 5, 10, 15, 20],
    notes=[_n(0, 5.0, '5.0', 'start', 8, 12), _n(8.0, 17, '17', 'end', -8, -10)]))
F('A v–t graph: 0 to 6.0 s rises from 0 to 18 m s⁻¹; 6.0 to 10 s constant; 10 to 13 s falls to 0', lambda s: _vt(
    [(0, 0), (6.0, 18), (10, 18), (13, 0)], 'Three stages', 'A v–t graph rising to 18 m s⁻¹ in 6.0 s, constant until 10 s, falling to zero at 13 s.',
    (0, 14), (0, 20), [0, 2, 4, 6, 8, 10, 12, 14], [0, 5, 10, 15, 20]))
F('A v–t curve for a car obeys v = 30(1 − e^(−t/10))', lambda s: plot(
    't / s', 'v / m s⁻¹', [_fn(lambda t: 30 * (1 - exp(-t / 10)), 0, 40)], 'Approaching top speed',
    'The curve v = 30(1 − e^(−t/10)): it rises steeply at first and levels off towards 30 m s⁻¹.', xr=(0, 40), yr=(0, 35), xticks=[0, 10, 20, 30, 40], yticks=[0, 10, 20, 30],
    hlines=[(30, '30 m s⁻¹', None)]))
F('Two trains pass on parallel tracks at t = 0. Train X\'s v–t graph is constant at 20 m s⁻¹', lambda s: _vt(
    [(0, 20), (30, 20)], 'Trains X and Y', 'v–t graphs: train X constant at 20 m s⁻¹; train Y rising from 8.0 m s⁻¹ with gradient 0.60 m s⁻².',
    (0, 30), (0, 30), [0, 10, 20, 30], [0, 10, 20, 30], extra=[dict(x=[0, 30], y=[8.0, 26], color=ACC2, dash='6 4')],
    legend=[('X', ACC, None), ('Y', ACC2, '6 4')]))
F('A cyclist\'s v–t graph rises from 2.0 m s⁻¹ to 8.0 m s⁻¹ in 4.0 s, stays constant for 6.0 s', lambda s: _vt(
    [(0, 2.0), (4.0, 8.0), (10, 8.0), (13, 5.0)], 'Cyclist', 'A v–t graph rising from 2.0 to 8.0 m s⁻¹ in 4.0 s, constant for 6.0 s, then falling to 5.0 m s⁻¹ in 3.0 s.',
    (0, 14), (0, 10), [0, 2, 4, 6, 8, 10, 12, 14], [0, 2, 4, 6, 8, 10]))
F('A v–t graph for a lift (up positive): 0–2.0 s rises to 2.5 m s⁻¹', lambda s: _vt(
    [(0, 0), (2.0, 2.5), (8.0, 2.5), (10.5, 0)], 'Lift journey', 'A lift v–t graph rising to 2.5 m s⁻¹ in 2.0 s, constant until 8.0 s, falling to zero at 10.5 s.',
    (0, 11), (0, 3), [0, 2, 4, 6, 8, 10], [0, 1, 2, 3]))
F('A rocket\'s v–t graph is a straight line from 0 to 400 m s⁻¹ in 20 s', lambda s: _vt(
    [(0, 0), (20, 400), (20 + 400 / 9.81, 0)], 'Rocket', 'A rocket v–t graph rising to 400 m s⁻¹ in 20 s and then falling in a straight line with gradient −9.81 m s⁻² to zero.',
    (0, 70), (0, 450), [0, 10, 20, 30, 40, 50, 60, 70], [0, 100, 200, 300, 400]))
F('At t = 0 a scooter moves at 2.0 m s⁻¹; its v–t graph rises steadily to 10 m s⁻¹ at t = 4.0 s', lambda s: _vt(
    [(0, 2.0), (4.0, 10)], 'Scooter', 'A straight v–t line from 2.0 m s⁻¹ at t = 0 to 10 m s⁻¹ at 4.0 s.', (0, 5), (0, 12), [0, 1, 2, 3, 4, 5], [0, 2, 4, 6, 8, 10, 12]))
F('A trolley\'s velocity is recorded: t/s = 0, 1.0, 2.0, 3.0, 4.0 and v/m s⁻¹ = 0, 2.5, 5.0, 7.5, 10', lambda s: table_plot(
    ['t / s', 'v / m s⁻¹'], table_rows_from_stem(s, ['t/s', 'v/m s⁻¹'])[1], 'Trolley velocities',
    'Table and graph of a trolley\'s velocity against time: 0, 2.5, 5.0, 7.5 and 10 m s⁻¹ at 0 to 4.0 s, a straight line through the origin.',
    dict(xlabel='t / s', ylabel='v / m s⁻¹', series=[dict(x=numbers_after(s, 't/s'), y=numbers_after(s, 'v/m s⁻¹'), kind='points')],
         xr=(0, 4), yr=(0, 12), xticks=[0, 1, 2, 3, 4], yticks=[0, 4, 8, 12], h=240)))
F('An object\'s velocity is given by v = 12 − 3.0t', lambda s: _vt(
    [(0, 12), (5.0, -3.0)], 'v = 12 − 3.0t', 'The straight line v = 12 − 3.0t from t = 0 to 5.0 s, crossing the time axis at 4.0 s.', (0, 5), (-4, 14), [0, 1, 2, 3, 4, 5], [-4, 0, 4, 8, 12]))
F('Readings for a car: t/s = 0, 2.0, 4.0, 6.0 and v/m s⁻¹ = 1.0, 4.0, 9.0, 16', lambda s: table_plot(
    ['t / s', 'v / m s⁻¹'], table_rows_from_stem(s, ['t/s', 'v/m s⁻¹'])[1], 'Car velocities',
    'Table and graph of a car\'s velocity: 1.0, 4.0, 9.0 and 16 m s⁻¹ at 0, 2.0, 4.0 and 6.0 s, lying on an upward curve.',
    dict(xlabel='t / s', ylabel='v / m s⁻¹', series=[dict(x=numbers_after(s, 't/s'), y=numbers_after(s, 'v/m s⁻¹'), kind='points')],
         xr=(0, 6), yr=(0, 18), xticks=[0, 2, 4, 6], yticks=[0, 6, 12, 18], h=240)))
_T3 = lambda t: 7.0 + 2.0 * (t - 3.0) + 0.12 * (t - 3.0) ** 2  # noqa: E731  tangent at 3.0 s: v = 1.0 + 2.0t
F('The gradient of a curved v–t graph at 3.0 s is found by drawing a tangent', lambda s: plot(
    't / s', 'v / m s⁻¹', [_fn(_T3, 0, 7), dict(x=[0, 6.0], y=[1.0, 13], color=ACC2, dash='6 4')],
    'Tangent at 3.0 s', 'A curved v–t graph with a dashed tangent at 3.0 s that crosses the v axis at 1.0 m s⁻¹ and reaches 13 m s⁻¹ at 6.0 s.',
    xr=(0, 7), yr=(0, 20), xticks=[0, 1, 2, 3, 4, 5, 6, 7], yticks=[0, 5, 10, 15, 20],
    notes=[_n(0, 1.0, '1.0', 'start', 8, -8), _n(6.0, 13, '13', 'start', 8, 12)]))

# ── 2.5 ──
F('A v–t graph is a horizontal line at 12 m s⁻¹ from 0 to 5.0 s', lambda s: _vt(
    [(0, 12), (5.0, 12)], 'Constant velocity', 'A horizontal v–t line at 12 m s⁻¹ from 0 to 5.0 s with the rectangle under it shaded.', (0, 6), (0, 15), [0, 1, 2, 3, 4, 5, 6], [0, 3, 6, 9, 12, 15],
    shade=True, extra=[dict(x=[5.0, 5.0], y=[0, 12], color=MUT, lw='thin')]))
F('A v–t graph rises in a straight line from 0 to 10 m s⁻¹ in 4.0 s. Calculate the displacement', lambda s: _vt(
    [(0, 0), (4.0, 10)], 'Area under a v–t graph', 'A straight v–t line from the origin to 10 m s⁻¹ at 4.0 s, with the triangle under it shaded.', (0, 5), (0, 12), [0, 1, 2, 3, 4, 5], [0, 4, 8, 12], shade=True))
F('Over 6.0 s a cyclist\'s speed increases steadily from 4.0 m s⁻¹ to 10 m s⁻¹', lambda s: _vt(
    [(0, 4.0), (6.0, 10)], 'Trapezium area', 'A straight v–t line from 4.0 m s⁻¹ to 10 m s⁻¹ over 6.0 s, with the trapezium under it shaded.', (0, 7), (0, 12), [0, 1, 2, 3, 4, 5, 6, 7], [0, 4, 8, 12], shade=True))
F('A car decelerates uniformly from 16 m s⁻¹ to rest in 5.0 s', lambda s: _vt(
    [(0, 16), (5.0, 0)], 'Braking distance', 'A straight v–t line falling from 16 m s⁻¹ to zero in 5.0 s, with the area under it shaded.', (0, 6), (0, 20), [0, 1, 2, 3, 4, 5, 6], [0, 4, 8, 12, 16, 20], shade=True))
F('A ball rolls from rest with uniform acceleration, reaching 3.0 m s⁻¹ after 2.0 s', lambda s: _vt(
    [(0, 0), (2.0, 3.0)], 'Ball rolling from rest', 'A straight v–t line from the origin to 3.0 m s⁻¹ at 2.0 s, with the area under it shaded.', (0, 2.5), (0, 4), [0, 0.5, 1.0, 1.5, 2.0, 2.5], [0, 1, 2, 3, 4], shade=True))
F('A cyclist accelerates uniformly from 2.0 m s⁻¹ to 6.0 m s⁻¹ in 5.0 s', lambda s: _vt(
    [(0, 2.0), (5.0, 6.0)], 'Cyclist speeding up', 'A straight v–t line from 2.0 to 6.0 m s⁻¹ over 5.0 s, with the area under it shaded.', (0, 6), (0, 8), [0, 1, 2, 3, 4, 5, 6], [0, 2, 4, 6, 8], shade=True))
F('A car\'s v–t graph rises from 0 to 15 m s⁻¹ in 5.0 s, stays at 15 m s⁻¹ for 10 s and falls to 0 in 3.0 s. Calculate the total', lambda s: _vt(
    [(0, 0), (5.0, 15), (15, 15), (18, 0)], 'Journey', 'A v–t graph rising to 15 m s⁻¹ in 5.0 s, constant for 10 s and falling to zero in 3.0 s, with the area shaded.',
    (0, 20), (0, 20), [0, 5, 10, 15, 20], [0, 5, 10, 15, 20], shade=True))
F('A ball thrown up at 12 m s⁻¹ has a straight-line v–t graph reaching 0 at 1.22 s', lambda s: _vt(
    [(0, 12), (1.22, 0)], 'Rising ball', 'A straight v–t line from 12 m s⁻¹ falling to zero at 1.22 s, with the triangle under it shaded.', (0, 1.5), (0, 14), [0, 0.5, 1.0, 1.5], [0, 4, 8, 12], shade=True,
    notes=[_n(1.22, 0, '1.22 s', 'middle', 0, -12)]))
F('A v–t graph (up positive) goes from +8.0 m s⁻¹ to −12 m s⁻¹ in a straight line over 2.04 s', lambda s: _vt(
    [(0, 8.0), (2.04, -12)], 'Up and down', 'A straight v–t line from +8.0 m s⁻¹ to −12 m s⁻¹ over 2.04 s, crossing zero at 0.816 s; the areas above and below the axis are shaded.',
    (0, 2.2), (-14, 10), [0, 0.5, 1.0, 1.5, 2.0], [-12, -8, -4, 0, 4, 8], shade=True))
F('For that ball (from +8.0 m s⁻¹ to −12 m s⁻¹, crossing zero at 0.816 s, ending at 2.04 s)', lambda s: _vt(
    [(0, 8.0), (2.04, -12)], 'Up and down', 'A straight v–t line from +8.0 m s⁻¹ to −12 m s⁻¹ over 2.04 s, crossing zero at 0.816 s; the areas above and below the axis are shaded.',
    (0, 2.2), (-14, 10), [0, 0.5, 1.0, 1.5, 2.0], [-12, -8, -4, 0, 4, 8], shade=True))
F('A train accelerates uniformly from rest to 24 m s⁻¹ in 40 s, then travels at 24 m s⁻¹', lambda s: _vt(
    [(0, 0), (40, 24), (80, 24)], 'Train', 'A v–t graph rising in a straight line to 24 m s⁻¹ in 40 s and then constant.', (0, 80), (0, 30), [0, 20, 40, 60, 80], [0, 10, 20, 30]))
F('A sprinter accelerates uniformly from rest to 10 m s⁻¹ in 4.0 s, then runs at 10 m s⁻¹', lambda s: _vt(
    [(0, 0), (4.0, 10), (10, 10)], 'Sprinter', 'A v–t graph rising to 10 m s⁻¹ in 4.0 s and then constant to 10 s, with the area shaded.', (0, 10), (0, 12), [0, 2, 4, 6, 8, 10], [0, 4, 8, 12], shade=True))
F('A car at 20 m s⁻¹ brakes after a reaction time of 0.60 s', lambda s: _vt(
    [(0, 20), (0.60, 20), (4.6, 0)], 'Stopping distance', 'A v–t graph constant at 20 m s⁻¹ for the 0.60 s reaction time and then falling to zero over 4.0 s, with the area shaded.',
    (0, 5), (0, 25), [0, 1, 2, 3, 4, 5], [0, 5, 10, 15, 20, 25], shade=True))
F('A lift (up positive) rises at 2.0 m s⁻¹ for 12 s, waits for 5.0 s, then descends at 2.5 m s⁻¹ for 6.0 s', lambda s: _vt(
    [(0, 2.0), (12, 2.0), (12, 0), (17, 0), (17, -2.5), (23, -2.5)], 'Lift up and down', 'A simplified lift v–t graph: +2.0 m s⁻¹ for 12 s, zero for 5.0 s, −2.5 m s⁻¹ for 6.0 s.',
    (0, 24), (-3, 3), [0, 4, 8, 12, 16, 20, 24], [-3, -2, -1, 0, 1, 2, 3], shade=True))
F('A cyclist rides at 8.0 m s⁻¹ for 30 s, slows uniformly to 4.0 m s⁻¹ in 10 s and rides at 4.0 m s⁻¹ for 20 s', lambda s: _vt(
    [(0, 8.0), (30, 8.0), (40, 4.0), (60, 4.0)], 'Cyclist', 'A v–t graph at 8.0 m s⁻¹ for 30 s, falling to 4.0 m s⁻¹ over 10 s, then constant for 20 s, with the area shaded.',
    (0, 60), (0, 10), [0, 10, 20, 30, 40, 50, 60], [0, 2, 4, 6, 8, 10], shade=True))
F('A car accelerates uniformly from rest to 20 m s⁻¹ in 8.0 s, travels at 20 m s⁻¹ for 30 s', lambda s: _vt(
    [(0, 0), (8.0, 20), (38, 20), (43, 0)], 'Car journey', 'A v–t graph rising to 20 m s⁻¹ in 8.0 s, constant for 30 s, falling to zero in 5.0 s, with the area shaded.',
    (0, 45), (0, 25), [0, 10, 20, 30, 40], [0, 5, 10, 15, 20, 25], shade=True))
F('A ball is thrown up at 14 m s⁻¹ from the edge of a cliff and lands at the bottom moving at 26 m s⁻¹', lambda s: _vt(
    [(0, 14), (40 / 9.81, -26)], 'Ball thrown from a cliff', 'A straight v–t line from +14 m s⁻¹ to −26 m s⁻¹ (up positive), gradient −9.81 m s⁻²; areas above and below the axis are shaded.',
    (0, 4.5), (-30, 20), [0, 1, 2, 3, 4], [-30, -20, -10, 0, 10, 20], shade=True))
F('Car P starts from rest with acceleration 2.0 m s⁻². At the same moment car Q passes it at a steady 12 m s⁻¹', lambda s: _vt(
    [(0, 0), (12, 24)], 'Cars P and Q', 'v–t graphs: car P rising from rest with gradient 2.0 m s⁻²; car Q constant at 12 m s⁻¹. They cross at 6.0 s.',
    (0, 12), (0, 25), [0, 2, 4, 6, 8, 10, 12], [0, 5, 10, 15, 20, 25], extra=[dict(x=[0, 12], y=[12, 12], color=ACC2, dash='6 4')],
    legend=[('P', ACC, None), ('Q', ACC2, '6 4')]))
F('A lift (up positive) accelerates from rest at 1.0 m s⁻² for 3.0 s, moves at constant speed for 10 s', lambda s: _vt(
    [(0, 0), (3.0, 3.0), (13, 3.0), (15, 0)], 'Lift height', 'A lift v–t graph rising to 3.0 m s⁻¹ in 3.0 s, constant for 10 s, falling to zero in 2.0 s, with the area shaded.',
    (0, 16), (0, 4), [0, 2, 4, 6, 8, 10, 12, 14, 16], [0, 1, 2, 3, 4], shade=True))
F('A sprinter\'s v–t graph rises linearly from 0 to 11 m s⁻¹ in 4.5 s and stays at 11 m s⁻¹', lambda s: _vt(
    [(0, 0), (4.5, 11), (12, 11)], '100 m sprint', 'A v–t graph rising linearly to 11 m s⁻¹ in 4.5 s and then constant.', (0, 12), (0, 12), [0, 2, 4, 6, 8, 10, 12], [0, 4, 8, 12]))
F('A train must travel 2.0 km between stations, accelerating uniformly at 0.50 m s⁻² to 20 m s⁻¹', lambda s: _vt(
    [(0, 0), (40, 20), (110, 20), (130, 0)], 'Between stations', 'A trapezium-shaped v–t graph: up to 20 m s⁻¹ in 40 s, cruising, and down to rest in 20 s.',
    (0, 140), (0, 25), [0, 20, 40, 60, 80, 100, 120, 140], [0, 5, 10, 15, 20, 25], shade=True))
F('The v–t graph of a car is v = 3t (m s⁻¹) for 0 ≤ t ≤ 6.0 s, then v = 18 m s⁻¹', lambda s: _vt(
    [(0, 0), (6.0, 18), (15, 18)], 'v = 3t then constant', 'A v–t graph rising as v = 3t to 18 m s⁻¹ at 6.0 s and then constant to 15 s, with the area shaded.',
    (0, 15), (0, 20), [0, 3, 6, 9, 12, 15], [0, 5, 10, 15, 20], shade=True))
F('A car travelling at 25 m s⁻¹ sees an obstacle 60 m ahead', lambda s: _vt(
    [(0, 25), (0.50, 25), (0.50 + 25 / 7.0, 0)], 'Stopping in time?', 'A v–t graph constant at 25 m s⁻¹ for 0.50 s and then falling to zero with gradient −7.0 m s⁻², with the area shaded.',
    (0, 4.5), (0, 30), [0, 1, 2, 3, 4], [0, 10, 20, 30], shade=True))
F('A v–t graph rises in a straight line from 0 to 8.0 m s⁻¹ in 4.0 s and then falls in a straight line to 0 in the next 6.0 s', lambda s: _vt(
    [(0, 0), (4.0, 8.0), (10, 0)], 'Triangle', 'A v–t graph rising to 8.0 m s⁻¹ in 4.0 s and falling to zero at 10 s, with the triangle shaded.', (0, 10), (0, 10), [0, 2, 4, 6, 8, 10], [0, 2, 4, 6, 8, 10], shade=True))
F('A trolley\'s speed readings are t/s = 0, 1.0, 2.0, 3.0, 4.0 and v/m s⁻¹ = 0, 2.0, 4.0, 6.0, 8.0', lambda s: table_plot(
    ['t / s', 'v / m s⁻¹'], table_rows_from_stem(s, ['t/s', 'v/m s⁻¹'])[1], 'Trolley speeds',
    'Table and graph of a trolley\'s speed: 0, 2.0, 4.0, 6.0 and 8.0 m s⁻¹ at 0 to 4.0 s, on a straight line through the origin.',
    dict(xlabel='t / s', ylabel='v / m s⁻¹', series=[dict(x=numbers_after(s, 't/s'), y=numbers_after(s, 'v/m s⁻¹'), kind='points')],
         xr=(0, 4), yr=(0, 10), xticks=[0, 1, 2, 3, 4], yticks=[0, 2, 4, 6, 8, 10], h=240)))
F('A train decelerates uniformly from 25 m s⁻¹ to 15 m s⁻¹ in 20 s', lambda s: _vt(
    [(0, 25), (20, 15)], 'Slowing train', 'A straight v–t line falling from 25 to 15 m s⁻¹ over 20 s, with the trapezium under it shaded.', (0, 20), (0, 30), [0, 5, 10, 15, 20], [0, 10, 20, 30], shade=True))
F('An object\'s velocity is v = 2.0 + 1.5t (m s⁻¹) for 0 ≤ t ≤ 6.0 s', lambda s: _vt(
    [(0, 2.0), (6.0, 11)], 'v = 2.0 + 1.5t', 'The line v = 2.0 + 1.5t from 0 to 6.0 s, with the area under it shaded.', (0, 6), (0, 12), [0, 1, 2, 3, 4, 5, 6], [0, 4, 8, 12], shade=True))
F('Cyclist A starts from rest, accelerates at 1.0 m s⁻² for 10 s and then rides at constant speed', lambda s: _vt(
    [(0, 0), (10, 10), (20, 10)], 'Two cyclists', 'v–t graphs: A rising from rest at 1.0 m s⁻² to 10 m s⁻¹ at 10 s then constant; B constant at 8.0 m s⁻¹.',
    (0, 20), (0, 12), [0, 5, 10, 15, 20], [0, 4, 8, 12], extra=[dict(x=[0, 20], y=[8.0, 8.0], color=ACC2, dash='6 4')],
    legend=[('A', ACC, None), ('B', ACC2, '6 4')]))
F('A ball accelerates uniformly at 2.0 m s⁻² from 1.0 m s⁻¹ for 3.0 s', lambda s: _vt(
    [(0, 1.0), (3.0, 7.0)], 'Ball speeding up', 'A straight v–t line from 1.0 m s⁻¹ with gradient 2.0 m s⁻² for 3.0 s, with the area under it shaded.', (0, 3.5), (0, 8), [0, 1, 2, 3], [0, 2, 4, 6, 8], shade=True))
