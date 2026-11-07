# Figures for ch01a.py (Chapter 1, 1.1 to 1.4). Vector paths are built from the stated legs and bearings;
# s–t graphs are generated from the stated points, gradients and equations.


def _b(L, bearing):
    """A leg of length L on a compass bearing: (east, north)."""
    return L * sin(radians(bearing)), L * cos(radians(bearing))


def _st(pts, title, desc, xr, yr, xt, yt, notes=(), extra=(), xlabel='t / s', ylabel='s / m', **kw):
    return plot(xlabel, ylabel, [dict(x=[p[0] for p in pts], y=[p[1] for p in pts])] + list(extra), title, desc,
                xr=xr, yr=yr, xticks=xt, yticks=yt, notes=list(notes), **kw)


def _pts_(pairs):
    return dict(x=[p[0] for p in pairs], y=[p[1] for p in pairs], kind='points', color=ACC2)


def _n(x, y, t, anchor='start', dx=8, dy=-10, v=True):
    return (x, y, t, anchor, dx, dy, v)


# ── 1.1 ──
F('A light gate records that a card of length 10.0 cm takes 0.040 s to pass through it', lambda s: light_gates(
    'Card and light gate', 'A trolley carrying a 10.0 cm card passes through a light gate.', card_label='10.0 cm card', two=False))
F('A ticker-timer makes 50 dots each second. Ten dot-spaces on a tape measure 12.0 cm', lambda s: ticker_tape(
    'Ticker tape', 'A ticker tape with eleven equally spaced dots; the ten spaces between the first and last dots measure 12.0 cm.', [1.2] * 10, dim=(0, 10, '12.0 cm')))
F('On a ticker tape, the spacing between dots increases along the tape', lambda s: ticker_tape(
    'Ticker tape', 'A ticker tape on which the spaces between successive dots get steadily larger along the tape.', [0.5 + 0.25 * k for k in range(9)]))
F('A train passes through a 1.2 km tunnel at 30 m s⁻¹', lambda s: star_line(
    'Train and tunnel', 'A 300 m train approaching a 1.2 km tunnel; the rear must clear the tunnel exit.',
    [dict(x=0, kind='planet', label='rear', value=False), dict(x=0.3, kind='planet', label='front', value=False),
     dict(x=1.0, kind='planet', label='entrance', value=False), dict(x=2.2, kind='planet', label='exit', value=False)],
    [(0, 1, '300 m', None), (2, 3, '1.2 km', None)], note='not to scale'))

# ── 1.2 ──
F('A hiker walks 3.0 km east and then 4.0 km north', lambda s: walk(
    'Two legs of a walk', 'A walk of 3.0 km east followed by 4.0 km north, with the resultant displacement dashed from start to finish.',
    [(3.0, 0, '3.0 km'), (0, 4.0, '4.0 km')], resultant='s'))
F('A car drives 8.0 km west then 6.0 km south', lambda s: walk(
    'Car journey', 'A car drives 8.0 km west and then 6.0 km south; the resultant displacement is dashed.',
    [(-8.0, 0, '8.0 km'), (0, -6.0, '6.0 km')], resultant='s'))
F('A walker goes 5.0 km north then 12 km east', lambda s: walk(
    'Walk north then east', 'A walk of 5.0 km north then 12 km east, with the resultant dashed and the angle θ east of north marked at the start.',
    [(0, 5.0, '5.0 km'), (12, 0, '12 km')], resultant='s', angle=('θ', 'north')))
F('A boat sails 2.4 km east and then 1.0 km north', lambda s: walk(
    'Boat journey', 'A boat sails 2.4 km east and then 1.0 km north; the resultant displacement is dashed.',
    [(2.4, 0, '2.4 km'), (0, 1.0, '1.0 km')], resultant='s'))
F('A robot moves 6.0 m east, 3.0 m north and then 2.0 m west', lambda s: walk(
    'Robot path', 'A robot moves 6.0 m east, 3.0 m north and then 2.0 m west; the resultant displacement is dashed.',
    [(6.0, 0, '6.0 m'), (0, 3.0, '3.0 m'), (-2.0, 0, '2.0 m')], resultant='s'))
F('A ship sails 30 km due south and then 40 km due west', lambda s: walk(
    'Ship voyage', 'A ship sails 30 km south and then 40 km west; the resultant is dashed from the start.',
    [(0, -30, '30 km'), (-40, 0, '40 km')], resultant='s'))
F('A walker goes 600 m on a bearing of 090° and then 800 m on a bearing of 180°', lambda s: walk(
    'Walk on bearings', 'A walk of 600 m on a bearing of 090° (east) and then 800 m on a bearing of 180° (south); the resultant is dashed.',
    [(*_b(600, 90), '600 m'), (*_b(800, 180), '800 m')], resultant='s'))
F('A rugby player runs 18 m forward and 7.5 m sideways', lambda s: walk(
    'Rugby run', 'A run of 18 m forward and 7.5 m sideways, with the resultant displacement dashed and its angle θ to the forward direction marked.',
    [(0, 18, '18 m forward'), (7.5, 0, '7.5 m')], resultant='s', angle=('θ', 'north'), north=False))
F('A yacht sails 8.0 km north, then 6.0 km east, then 2.0 km south. (a) Find the net north', lambda s: walk(
    'Yacht course', 'A yacht sails 8.0 km north, 6.0 km east and then 2.0 km south; the resultant displacement is dashed.',
    [(0, 8.0, '8.0 km'), (6.0, 0, '6.0 km'), (0, -2.0, '2.0 km')], resultant='s'))
F('A hiker walks 5.0 km on a bearing of 060°, then 5.0 km on a bearing of 150°', lambda s: walk(
    'Two bearings', 'A walk of 5.0 km on a bearing of 060° followed by 5.0 km on a bearing of 150°; the resultant is dashed.',
    [(*_b(5.0, 60), '5.0 km'), (*_b(5.0, 150), '5.0 km')], resultant='s'))
F('A plane flies 300 km due east and then 400 km on a bearing of 030°', lambda s: walk(
    'Flight path', 'A plane flies 300 km east and then 400 km on a bearing of 030°; the resultant displacement is dashed.',
    [(300, 0, '300 km'), (*_b(400, 30), '400 km')], resultant='s'))
F('A golf ball moves 120 m north with one shot and 50 m east with the next', lambda s: walk(
    'Two golf shots', 'A golf ball moves 120 m north and then 50 m east; the resultant displacement is dashed.',
    [(0, 120, '120 m'), (50, 0, '50 m')], resultant='s'))
F('A sailor goes 10 km north, 10 km east, 10 km south and then 4.0 km west', lambda s: walk(
    'Four legs', 'A sailor goes 10 km north, 10 km east, 10 km south and 4.0 km west; the resultant displacement is dashed.',
    [(0, 10, '10 km'), (10, 0, '10 km'), (0, -10, '10 km'), (-4.0, 0, '4.0 km')], resultant='s'))
F('Starting from a jetty, a kayaker paddles 2.0 km towards the north-east', lambda s: walk(
    'Kayak route', 'A kayaker paddles 2.0 km north-east (045°) and then 2.0 km south-east (135°); the resultant is dashed.',
    [(*_b(2.0, 45), '2.0 km'), (*_b(2.0, 135), '2.0 km')], resultant='s', start_label='jetty'))
F('A city is laid out in square blocks of side 150 m', lambda s: walk(
    'Taxi route', 'A taxi drives 4 blocks east, 3 blocks north and 1 block west on a grid of 150 m blocks; the resultant is dashed.',
    [(4, 0, '4 blocks'), (0, 3, '3 blocks'), (-1, 0, '1 block')], resultant='s'))

# ── 1.3 ──
F('A walker goes 400 m east in 300 s and then 300 m north in 200 s. Calculate the magnitude', lambda s: walk(
    'Walk east then north', 'A walk of 400 m east (300 s) then 300 m north (200 s); the resultant displacement is dashed.',
    [(400, 0, '400 m'), (0, 300, '300 m')], resultant='s'))
F('A plane flies 400 km north in 50 minutes and then 300 km west in 40 minutes', lambda s: walk(
    'Flight north then west', 'A plane flies 400 km north and then 300 km west; the resultant is dashed with the angle θ west of north marked.',
    [(0, 400, '400 km'), (-300, 0, '300 km')], resultant='s', angle=('θ', 'north')))
F('A car drives 12 km north at 60 km h⁻¹ and then 9.0 km east at 45 km h⁻¹', lambda s: walk(
    'Car route', 'A car drives 12 km north and then 9.0 km east; the resultant displacement is dashed.',
    [(0, 12, '12 km'), (9.0, 0, '9.0 km')], resultant='s'))
F('A boat travels 3.0 km east in 10 minutes, then 4.0 km north in 15 minutes', lambda s: walk(
    'Boat route', 'A boat travels 3.0 km east and then 4.0 km north; the resultant displacement is dashed.',
    [(3.0, 0, '3.0 km'), (0, 4.0, '4.0 km')], resultant='s'))
F('A drone flies 600 m north at 12 m s⁻¹ and then 800 m east at 16 m s⁻¹', lambda s: walk(
    'Drone flight', 'A drone flies 600 m north and then 800 m east; the resultant displacement is dashed.',
    [(0, 600, '600 m'), (800, 0, '800 m')], resultant='s'))
F('A ferry crosses a 1.2 km wide river, arriving 0.50 km downstream', lambda s: walk(
    'Ferry crossing', 'A ferry crosses a river 1.2 km wide and lands 0.50 km downstream; the components are drawn and the displacement is dashed.',
    [(0, 1.2, '1.2 km across'), (0.50, 0, '0.50 km')], resultant='s', north=False))
F('A spider crawls round three sides of a square of side 0.60 m in 12 s', lambda s: walk(
    'Spider path', 'A spider crawls along three sides of a square of side 0.60 m; the displacement from start to finish is dashed.',
    [(0.60, 0, '0.60 m'), (0, 0.60, '0.60 m'), (-0.60, 0, '0.60 m')], resultant='s', north=False))

# ── 1.4 ──
F('A displacement–time graph is a straight line from (0 s, 0 m) to (8.0 s, 40 m)', lambda s: _st(
    [(0, 0), (8.0, 40)], 'Displacement–time graph', 'A straight line from the origin to (8.0 s, 40 m).', (0, 10), (0, 50), [0, 2, 4, 6, 8, 10], [0, 10, 20, 30, 40, 50],
    notes=[_n(8.0, 40, '(8.0, 40)', 'end', -8, -10)]))
F('A displacement–time graph falls in a straight line from 60 m at 0 s to 0 m at 12 s', lambda s: _st(
    [(0, 60), (12, 0)], 'Displacement–time graph', 'A straight line falling from 60 m at t = 0 to 0 m at 12 s.', (0, 14), (0, 70), [0, 2, 4, 6, 8, 10, 12, 14], [0, 20, 40, 60],
    notes=[_n(0, 60, '60 m', 'start', 8, -10), _n(12, 0, '12 s', 'middle', 0, -12)]))
F('Between t = 2.0 s and t = 6.0 s a cyclist', lambda s: _st(
    [(2.0, 10), (6.0, 30)], 'Cyclist displacement–time graph', 'A straight s–t line from (2.0 s, 10 m) to (6.0 s, 30 m).', (0, 8), (0, 40), [0, 2, 4, 6, 8], [0, 10, 20, 30, 40],
    notes=[_n(2.0, 10, '(2.0, 10)', 'start', 8, 12), _n(6.0, 30, '(6.0, 30)', 'end', -8, -10)]))
F('A toy train is 20 m from the station at t = 0 and 80 m away at t = 10 s', lambda s: _st(
    [(0, 20), (10, 80)], 'Toy train displacement–time graph', 'A straight s–t line from 20 m at t = 0 to 80 m at 10 s.', (0, 12), (0, 100), [0, 2, 4, 6, 8, 10, 12], [0, 20, 40, 60, 80, 100],
    notes=[_n(0, 20, '20 m', 'start', 8, 12), _n(10, 80, '(10, 80)', 'end', -8, -10)]))
F('An s–t graph has these straight sections: 0–4.0 s from 0 to 20 m; 4.0–10 s constant at 20 m; 10–14 s from 20 m back to 0. Calculate the velocity', lambda s: _st(
    [(0, 0), (4.0, 20), (10, 20), (14, 0)], 'Out, wait and back', 'An s–t graph rising from 0 to 20 m in 4.0 s, level at 20 m until 10 s, then falling back to 0 at 14 s.',
    (0, 16), (0, 25), [0, 2, 4, 6, 8, 10, 12, 14, 16], [0, 5, 10, 15, 20, 25]))
F('An s–t graph has these straight sections: 0–4.0 s from 0 to 20 m; 4.0–10 s constant at 20 m; 10–14 s from 20 m back to 0. Calculate the average speed', lambda s: _st(
    [(0, 0), (4.0, 20), (10, 20), (14, 0)], 'Out, wait and back', 'An s–t graph rising from 0 to 20 m in 4.0 s, level at 20 m until 10 s, then falling back to 0 at 14 s.',
    (0, 16), (0, 25), [0, 2, 4, 6, 8, 10, 12, 14, 16], [0, 5, 10, 15, 20, 25]))
_TC = lambda t: 17.5 + 4.5 * (t - 5.0) + 0.45 * (t - 5.0) ** 2  # noqa: E731  tangent at 5.0 s: s = 4.0 + 4.5(t − 2.0)
F('A tangent drawn to a curved s–t graph at t = 5.0 s passes through (2.0 s, 4.0 m) and (8.0 s, 31 m)', lambda s: plot(
    't / s', 's / m', [dict(x=curve(_TC, 0, 9)[0], y=curve(_TC, 0, 9)[1]),
                       dict(x=[2.0, 8.0], y=[4.0, 31], color=ACC2, dash='6 4'), _pts_([(2.0, 4.0), (8.0, 31)])],
    'Tangent to an s–t curve', 'A curved s–t graph with a dashed tangent at t = 5.0 s passing through (2.0 s, 4.0 m) and (8.0 s, 31 m).',
    xr=(0, 9), yr=(0, 50), xticks=[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], yticks=[0, 10, 20, 30, 40, 50],
    notes=[_n(2.0, 4.0, '(2.0, 4.0)', 'start', 12, 2), _n(8.0, 31, '(8.0, 31)', 'start', 8, 12)]))
F('A car\'s s–t graph is a straight line through (5.0 s, 30 m) and (15 s, 230 m)', lambda s: _st(
    [(0, -70), (16, 250)], 'Car displacement–time graph', 'A straight s–t line through (5.0 s, 30 m) and (15 s, 230 m), extended back towards t = 0.',
    (0, 16), (-80, 250), [0, 4, 8, 12, 16], [-80, 0, 80, 160, 240], notes=[_n(5.0, 30, '(5.0, 30)', 'end', -8, -8), _n(15, 230, '(15, 230)', 'end', -8, -10)],
    extra=[_pts_([(5.0, 30), (15, 230)])]))
F('An object moves so that s = 2.0t² (s in m, t in s)', lambda s: plot(
    't / s', 's / m', [dict(x=curve(lambda t: 2.0 * t ** 2, 0, 3.5)[0], y=curve(lambda t: 2.0 * t ** 2, 0, 3.5)[1]),
                       dict(x=[1.0, 3.0], y=[2.0, 18], color=ACC2, dash='6 4')],
    's = 2.0t²', 'The curve s = 2.0t² from 0 to 3.5 s with a dashed chord joining the points at t = 1.0 s and t = 3.0 s.',
    xr=(0, 3.5), yr=(0, 25), xticks=[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5], yticks=[0, 5, 10, 15, 20, 25]))
F('A lift\'s s–t graph rises from 0 to 12 m between 0 and 8.0 s', lambda s: _st(
    [(0, 0), (8.0, 12), (15, 12), (19, 4.0)], 'Lift displacement–time graph', 'An s–t graph for a lift: up from 0 to 12 m in 8.0 s, level until 15 s, then down to 4.0 m at 19 s.',
    (0, 20), (0, 15), [0, 4, 8, 12, 16, 20], [0, 3, 6, 9, 12, 15]))
F('A cyclist\'s s–t graph is a straight line through (0 s, 500 m) and (100 s, 0 m)', lambda s: _st(
    [(0, 500), (100, 0)], 'Cyclist returning', 'A straight s–t line falling from 500 m at t = 0 to 0 at 100 s; the 200 m level is marked.',
    (0, 120), (0, 600), [0, 20, 40, 60, 80, 100, 120], [0, 100, 200, 300, 400, 500, 600], hlines=[(200, '200 m', None)],
    notes=[_n(0, 500, '500 m', 'start', 8, -10), _n(100, 0, '100 s', 'middle', 0, -12)]))
F('Car A starts at s = 0 at 20 m s⁻¹. Car B starts at s = 200 m', lambda s: _st(
    [(0, 0), (40, 800)], 'Two cars', 'Displacement–time lines for car A (from 0 at 20 m s⁻¹) and car B (from 200 m at 12 m s⁻¹).',
    (0, 40), (0, 800), [0, 10, 20, 30, 40], [0, 200, 400, 600, 800], extra=[dict(x=[0, 40], y=[200, 200 + 12 * 40], color=ACC2, dash='6 4')],
    legend=[('A', ACC, None), ('B', ACC2, '6 4')]))
F('An object has s = 5.0t − t² (s in m, t in s)', lambda s: plot(
    't / s', 's / m', [dict(x=curve(lambda t: 5.0 * t - t ** 2, 0, 5.0)[0], y=curve(lambda t: 5.0 * t - t ** 2, 0, 5.0)[1])],
    's = 5.0t − t²', 'The curve s = 5.0t − t² from 0 to 5.0 s: it rises, reaches a maximum and falls back to zero.',
    xr=(0, 5), yr=(0, 8), xticks=[0, 1, 2, 3, 4, 5], yticks=[0, 2, 4, 6, 8]))
F('A walker leaves home at 1.5 m s⁻¹. 200 s later her brother', lambda s: _st(
    [(0, 0), (700, 1050)], 'Walker and brother', 'Displacement–time lines: the walker from home at 1.5 m s⁻¹ from t = 0, her brother from home at 2.5 m s⁻¹ from t = 200 s.',
    (0, 700), (0, 1200), [0, 100, 200, 300, 400, 500, 600, 700], [0, 300, 600, 900, 1200], extra=[dict(x=[200, 680], y=[0, 1200], color=ACC2, dash='6 4')],
    legend=[('walker', ACC, None), ('brother', ACC2, '6 4')]))
F('A ball is thrown upwards. Its s–t graph is a parabola reaching 11.25 m at 1.5 s', lambda s: plot(
    't / s', 's / m', [dict(x=curve(lambda t: 11.25 - 5.0 * (t - 1.5) ** 2, 0, 3.0)[0], y=curve(lambda t: 11.25 - 5.0 * (t - 1.5) ** 2, 0, 3.0)[1])],
    'Ball thrown upwards', 'A parabolic s–t graph rising from 0 to a maximum of 11.25 m at 1.5 s and returning to 0 at 3.0 s.',
    xr=(0, 3.0), yr=(0, 14), xticks=[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0], yticks=[0, 2, 4, 6, 8, 10, 12, 14],
    notes=[_n(1.5, 11.25, '11.25 m', 'middle', 0, -12)]))
F('An s–t graph: 0 to 6.0 s rises from 0 to 18 m (straight)', lambda s: _st(
    [(0, 0), (6.0, 18), (9.0, 18), (15, -6.0)], 'Three-stage motion', 'An s–t graph rising from 0 to 18 m in 6.0 s, level until 9.0 s, then falling to −6.0 m at 15 s.',
    (0, 16), (-8, 20), [0, 3, 6, 9, 12, 15], [-8, -4, 0, 4, 8, 12, 16, 20]))
F('A cyclist rides at constant velocity and is at 80 m at t = 4.0 s and 200 m at t = 12 s', lambda s: _st(
    [(0, 20), (20, 320)], 'Cyclist displacement–time graph', 'A straight s–t line through (4.0 s, 80 m) and (12 s, 200 m).',
    (0, 20), (0, 320), [0, 4, 8, 12, 16, 20], [0, 80, 160, 240, 320], notes=[_n(4.0, 80, '(4.0, 80)', 'start', 8, 12), _n(12, 200, '(12, 200)', 'start', 8, 12)],
    extra=[_pts_([(4.0, 80), (12, 200)])]))
F('Two trains approach each other on parallel tracks', lambda s: _st(
    [(0, 0), (40, 1000)], 'Two trains', 'Displacement–time lines: train P from 0 at +25 m s⁻¹ and train Q from 1500 m at −35 m s⁻¹.',
    (0, 40), (0, 1600), [0, 10, 20, 30, 40], [0, 400, 800, 1200, 1600], extra=[dict(x=[0, 40], y=[1500, 100], color=ACC2, dash='6 4')],
    legend=[('P', ACC, None), ('Q', ACC2, '6 4')]))
F('A car\'s s–t graph rises in straight lines from 0 to 300 m in the first 20 s and from 300 m to 700 m', lambda s: _st(
    [(0, 0), (20, 300), (60, 700)], 'Two-stage journey', 'An s–t graph rising in straight lines from 0 to 300 m in 20 s and from 300 m to 700 m in the next 40 s.',
    (0, 60), (0, 800), [0, 10, 20, 30, 40, 50, 60], [0, 200, 400, 600, 800]))
F('Object A\'s s–t graph is a straight line through the origin with gradient 4.0 m s⁻¹', lambda s: _st(
    [(0, 0), (15, 60)], 'Two objects', 'Displacement–time lines: A through the origin with gradient 4.0 m s⁻¹; B starting at 60 m with gradient −2.0 m s⁻¹.',
    (0, 15), (0, 70), [0, 5, 10, 15], [0, 20, 40, 60], extra=[dict(x=[0, 15], y=[60, 30], color=ACC2, dash='6 4')],
    legend=[('A', ACC, None), ('B', ACC2, '6 4')]))
F('An object obeys s = 0.50t³', lambda s: plot(
    't / s', 's / m', [dict(x=curve(lambda t: 0.5 * t ** 3, 0, 3.0)[0], y=curve(lambda t: 0.5 * t ** 3, 0, 3.0)[1]),
                       dict(x=[2.0, 2.2], y=[4.0, 0.5 * 2.2 ** 3], color=ACC2, lw='bold')],
    's = 0.50t³', 'The curve s = 0.50t³ from 0 to 3.0 s, with the short chord between t = 2.0 s and t = 2.2 s highlighted.',
    xr=(0, 3), yr=(0, 14), xticks=[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0], yticks=[0, 2, 4, 6, 8, 10, 12, 14]))
