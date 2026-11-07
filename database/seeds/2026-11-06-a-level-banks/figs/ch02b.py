# Figures for ch02b.py (Chapter 2, 2.6 to 2.10): light gates, ticker tapes, multiflash images and graphs
# generated from the lengths, times, speeds and equations stated in each stem.


def _vt(pts, title, desc, xr, yr, xt, yt, shade=False, notes=(), extra=(), xlabel='t / s', ylabel='v / m s⁻¹', **kw):
    series = []
    if shade:
        series.append(dict(x=[p[0] for p in pts], y=[p[1] for p in pts], kind='area'))
    series.append(dict(x=[p[0] for p in pts], y=[p[1] for p in pts]))
    return plot(xlabel, ylabel, series + list(extra), title, desc, xr=xr, yr=yr, xticks=xt, yticks=yt, notes=list(notes), **kw)


def _n(x, y, t, anchor='start', dx=8, dy=-10, v=True):
    return (x, y, t, anchor, dx, dy, v)


def _fn(f, x0, x1, **kw):
    xs, ys = curve(f, x0, x1)
    return dict(x=xs, y=ys, **kw)


def _split(u, v, t, title, desc, xr, yr, xt, yt):
    """Trapezium under a straight v–t line split by a dashed line at v = u into ut and ½at²."""
    return plot('t / s', 'v / m s⁻¹', [dict(x=[0, t], y=[u, v], kind='area'), dict(x=[0, t], y=[u, v]),
                                      dict(x=[0, t], y=[u, u], color=MUT, dash='5 4', lw='thin'),
                                      dict(x=[t, t], y=[0, v], color=MUT, lw='thin')],
                title, desc, xr=xr, yr=yr, xticks=xt, yticks=yt,
                notes=[(t / 2, u / 2, 'ut', 'middle', 0, 4, False), (t * 0.68, u + (v - u) * 0.38, '½at²', 'middle', 0, 4, False)])


# ── 2.6 ──
F('A 5.0 cm card on a trolley blocks a light gate for 0.10 s', lambda s: light_gates(
    'Card and light gate', 'A trolley carrying a 5.0 cm card passing through one light gate.', card_label='5.0 cm card', two=False))
F('Five dot-spaces on a 50 Hz ticker tape measure 4.0 cm', lambda s: ticker_tape(
    'Ticker tape', 'A ticker tape with six dots; the five spaces between them measure 4.0 cm.', [0.8] * 5, dim=(0, 5, '4.0 cm'), w=380))
F('On a ticker tape from a trolley, the dots get further apart along the tape', lambda s: ticker_tape(
    'Ticker tape', 'A ticker tape whose dot spacing increases steadily along its length.', [0.4 + 0.2 * k for k in range(9)]))
F('A trolley passes gate A at 0.30 m s⁻¹ and gate B at 0.70 m s⁻¹, 0.50 s later', lambda s: light_gates(
    'Two light gates', 'A trolley with a card passing light gates A and B.', card_label='card'))
F('In a stroboscopic photograph, a falling ball appears at equal time intervals', lambda s: strobe(
    'Multiflash photograph', 'Images of a falling ball at equal time intervals beside a vertical scale; the gaps between images grow.',
    [0.5 * 9.81 * (k * 0.1) ** 2 * 100 for k in range(6)], [0, 20, 40, 60, 80, 100, 120, 140]))
F('A 4.0 cm card blocks gate A for 0.080 s and gate B for 0.040 s', lambda s: light_gates(
    'Two light gates', 'A trolley carrying a 4.0 cm card passing light gates A and B.', card_label='4.0 cm card'))
F('A double-interrupt card has two 2.0 cm segments', lambda s: light_gates(
    'Double-interrupt card', 'A trolley carrying a double-interrupt card (two 2.0 cm segments) passing a single light gate.', card_label='2.0 cm segments', two=False))
F('On a 50 Hz ticker tape, the first 5-space section measures 2.0 cm and the next 5-space section 3.5 cm', lambda s: ticker_tape(
    'Two tape sections', 'A ticker tape with ten spaces; the first five measure 2.0 cm and the next five 3.5 cm.', [0.4] * 5 + [0.7] * 5, dim=(0, 5, '2.0 cm')))
F('A strobe photo of a ball rolling down a slope shows images 2.0 cm, 4.0 cm, 6.0 cm, 8.0 cm apart', lambda s: strobe(
    'Rolling ball', 'Multiflash images of a ball rolling down a slope; successive gaps are 2.0, 4.0, 6.0 and 8.0 cm.',
    [0, 2.0, 6.0, 12.0, 20.0], [0, 5, 10, 15, 20], horizontal=True, w=420, h=150))
F('In the strobe photo with gaps 2.0, 4.0, 6.0 and 8.0 cm at 0.10 s intervals', lambda s: strobe(
    'Rolling ball', 'Multiflash images 0.10 s apart of a ball rolling down a slope; successive gaps are 2.0, 4.0, 6.0 and 8.0 cm.',
    [0, 2.0, 6.0, 12.0, 20.0], [0, 5, 10, 15, 20], horizontal=True, w=420, h=150))
F('A strobe flashing at 10 Hz photographs a ball dropped from rest. The images are at 0, 4.9, 19.6, 44.1 and 78.4 cm', lambda s: strobe(
    'Falling ball at 10 Hz', 'Multiflash images 0.10 s apart of a ball dropped from rest, at 0, 4.9, 19.6, 44.1 and 78.4 cm below the release point.',
    [0, 4.9, 19.6, 44.1, 78.4], [0, 20, 40, 60, 80]))
F('A trolley carrying a 3.0 cm card passes gate A (block time 0.060 s)', lambda s: light_gates(
    'Gates 0.50 m apart', 'A trolley carrying a 3.0 cm card passing light gates A and B, 0.50 m apart.', card_label='3.0 cm card', sep_label='0.50 m'))
F('A ticker tape (50 Hz) is cut into 5-space strips of lengths 1.0, 1.8, 2.6, 3.4 and 4.2 cm', lambda s: plot(
    'strip number', 'strip length / cm', [dict(x=[1, 2, 3, 4, 5], y=[1.0, 1.8, 2.6, 3.4, 4.2], kind='points')],
    'Tape-strip chart', 'Five 5-space strips stuck side by side form a bar chart of strip length: 1.0, 1.8, 2.6, 3.4 and 4.2 cm.',
    xr=(0, 6), yr=(0, 5), xticks=[0, 1, 2, 3, 4, 5, 6], yticks=[0, 1, 2, 3, 4, 5]))
F('A 25 Hz stroboscope photographs a trolley; successive gaps are 1.6 cm, 2.0 cm and 2.4 cm', lambda s: strobe(
    'Trolley at 25 Hz', 'Multiflash images of a trolley at 25 Hz; successive gaps are 1.6, 2.0 and 2.4 cm.', [0, 1.6, 3.6, 6.0], [0, 2, 4, 6], horizontal=True, w=420, h=150))
F('A motion sensor records a trolley at 0.50, 0.58, 0.72 and 0.92 m at 0.10 s intervals', lambda s: plot(
    't / s', 's / m', [dict(x=[0, 0.1, 0.2, 0.3], y=[0.50, 0.58, 0.72, 0.92], kind='points')],
    'Motion-sensor data', 'Displacement against time from a motion sensor: 0.50, 0.58, 0.72 and 0.92 m at 0.10 s intervals.',
    xr=(0, 0.3), yr=(0.4, 1.0), xticks=[0, 0.1, 0.2, 0.3], yticks=[0.4, 0.6, 0.8, 1.0], ybreak=True))

# ── 2.7 ──
F('A trolley released from rest passes light gates 0.30 m and 0.90 m down a ramp', lambda s: light_gates(
    'Gates 0.60 m apart', 'A trolley passing two light gates on a ramp, 0.30 m and 0.90 m from its release point (0.60 m apart).', card_label='card', sep_label='0.60 m'))
F('A graph of s against t² for a trolley released from rest has gradient 0.36 m s⁻²', lambda s: plot(
    't² / s²', 's / m', [dict(x=[0, 4], y=[0, 1.44])], 's against t²', 'A straight line through the origin on a graph of s against t², gradient 0.36 m s⁻².',
    xr=(0, 4), yr=(0, 1.6), xticks=[0, 1, 2, 3, 4], yticks=[0, 0.4, 0.8, 1.2, 1.6]))
F('A graph of v² against s for a trolley has gradient 1.6 m s⁻²', lambda s: plot(
    's / m', 'v² / m² s⁻²', [dict(x=[0, 1.0], y=[0, 1.6])], 'v² against s', 'A straight line through the origin on a graph of v² against s, gradient 1.6 m s⁻².',
    xr=(0, 1.0), yr=(0, 2.0), xticks=[0, 0.2, 0.4, 0.6, 0.8, 1.0], yticks=[0, 0.5, 1.0, 1.5, 2.0]))
F('A trolley is released from rest on a ramp. A light gate 0.64 m down the ramp records a 4.0 cm card', lambda s: light_gates(
    'Single gate on a ramp', 'A trolley carrying a 4.0 cm card passing a light gate 0.64 m from its release point.', card_label='4.0 cm card', two=False))
F('In an experiment s is measured for several t from rest: (0.50 s, 0.15 m), (1.00 s, 0.60 m)', lambda s: plot(
    't² / s²', 's / m', [dict(x=[0.25, 1.0, 2.25, 4.0], y=[0.15, 0.60, 1.35, 2.40], kind='points')],
    's against t²', 'Points for s against t²: (0.25, 0.15), (1.00, 0.60), (2.25, 1.35) and (4.00, 2.40), on a straight line through the origin.',
    xr=(0, 4), yr=(0, 2.5), xticks=[0, 1, 2, 3, 4], yticks=[0, 0.5, 1.0, 1.5, 2.0, 2.5]))
F('Gates A and B are 0.75 m apart. A 5.0 cm card takes 0.10 s at A and 0.050 s at B', lambda s: light_gates(
    'Gates 0.75 m apart', 'A trolley carrying a 5.0 cm card passing light gates A and B, 0.75 m apart.', card_label='5.0 cm card', sep_label='0.75 m'))
F('A trolley\'s velocity is measured at 0.2 s intervals: 0.10, 0.22, 0.34, 0.46 m s⁻¹', lambda s: _vt(
    [(0, 0.10), (0.6, 0.46)], 'Trolley velocities', 'Velocity readings 0.10, 0.22, 0.34 and 0.46 m s⁻¹ at 0.2 s intervals, on a straight line.',
    (0, 0.6), (0, 0.5), [0, 0.2, 0.4, 0.6], [0, 0.1, 0.2, 0.3, 0.4, 0.5], extra=[dict(x=[0, 0.2, 0.4, 0.6], y=[0.10, 0.22, 0.34, 0.46], kind='points', color=ACC2)]))
F('A glider on an air track is pulled by a falling mass. Light gates 0.50 m apart', lambda s: light_gates(
    'Air-track glider', 'A glider carrying a card passing two light gates 0.50 m apart.', card_label='card', sep_label='0.50 m'))
F('A ramp 1.50 m long has one end raised by 0.12 m', lambda s: walk(
    'Ramp', 'A ramp 1.50 m long with one end raised 0.12 m above the bench.', [(sqrt(1.5 ** 2 - 0.12 ** 2), 0, 'bench', False), (0, 0.12, '0.12 m')], resultant='1.50 m', north=False))
F('A trolley passes gate A at 0.45 m s⁻¹ and gate B, 0.50 m further on, at 0.85 m s⁻¹', lambda s: light_gates(
    'Gates 0.50 m apart', 'A trolley passing light gates A and B, 0.50 m apart.', card_label='card', sep_label='0.50 m'))

# ── 2.8 ──
F('A ball is thrown upwards at 15 m s⁻¹ from the top of a 20 m cliff and falls to the beach below', lambda s: plot(
    't / s', 'height above beach / m', [_fn(lambda t: 20 + 15 * t - 4.905 * t * t, 0, (15 + sqrt(225 + 392.4)) / 9.81)],
    'Ball thrown from a cliff', 'Height above the beach against time for a ball thrown up at 15 m s⁻¹ from a 20 m cliff: it rises, turns and falls past the cliff top to the beach.',
    xr=(0, 4.5), yr=(0, 35), xticks=[0, 1, 2, 3, 4], yticks=[0, 10, 20, 30], hlines=[(20, 'cliff top, 20 m', None)]))
F('A car travelling at 18 m s⁻¹ passes a stationary police car, which immediately accelerates at 3.0 m s⁻²', lambda s: plot(
    't / s', 's / m', [_fn(lambda t: 18 * t, 0, 14), _fn(lambda t: 1.5 * t * t, 0, 14, color=ACC2, dash='6 4')],
    'Police chase', 'Displacement–time graphs: the car at a steady 18 m s⁻¹ (straight line) and the police car accelerating at 3.0 m s⁻² from rest (curve); they cross at 12 s.',
    xr=(0, 14), yr=(0, 300), xticks=[0, 2, 4, 6, 8, 10, 12, 14], yticks=[0, 100, 200, 300], legend=[('car', ACC, None), ('police', ACC2, '6 4')]))
F('A train starts from rest, accelerates at 0.60 m s⁻² for 40 s, travels at constant speed for 2.0 minutes', lambda s: _vt(
    [(0, 0), (40, 24), (160, 24), (190, 0)], 'Train journey', 'A v–t graph rising to 24 m s⁻¹ in 40 s, constant for 120 s, falling to rest in 30 s, with the area shaded.',
    (0, 200), (0, 30), [0, 40, 80, 120, 160, 200], [0, 10, 20, 30], shade=True))
F('A car driver sees a hazard 50 m ahead while moving at 20 m s⁻¹', lambda s: _vt(
    [(0, 20), (0.70, 20), (4.70, 0)], 'Thinking and braking', 'A v–t graph constant at 20 m s⁻¹ for the 0.70 s reaction time and then falling to zero at 5.0 m s⁻², with the area shaded.',
    (0, 5), (0, 25), [0, 1, 2, 3, 4, 5], [0, 5, 10, 15, 20, 25], shade=True))
F('A parachutist falls freely from rest for 3.0 s and then opens the parachute', lambda s: _vt(
    [(0, 0), (3.0, 29.43), (3.0 + (29.43 - 5.0) / 12, 5.0), (6.0, 5.0)], 'Parachute opening', 'A v–t graph rising at 9.81 m s⁻² for 3.0 s, falling at 12 m s⁻² to 5.0 m s⁻¹, then constant (down positive).',
    (0, 6), (0, 35), [0, 1, 2, 3, 4, 5, 6], [0, 10, 20, 30]))
F('Car A starts from rest with acceleration 2.0 m s⁻² just as car B, 50 m behind it', lambda s: plot(
    't / s', 's / m', [_fn(lambda t: 50 + t * t, 0, 12), _fn(lambda t: 15 * t, 0, 12, color=ACC2, dash='6 4')],
    'Catching up', 'Displacement–time graphs from B\'s start: car A starting at 50 m with acceleration 2.0 m s⁻² (curve) and car B at a steady 15 m s⁻¹ (line).',
    xr=(0, 12), yr=(0, 200), xticks=[0, 2, 4, 6, 8, 10, 12], yticks=[0, 50, 100, 150, 200], legend=[('A', ACC, None), ('B', ACC2, '6 4')]))

# ── 2.9 ──
F('The area under a v–t graph for uniform acceleration can be split into a rectangle and a triangle. What does the rectangle', lambda s: _split(
    4.0, 10, 3.0, 'Splitting the area', 'The trapezium under a straight v–t line from u to v, split by a dashed line at v = u into a rectangle (ut) and a triangle (½at²).',
    (0, 3.5), (0, 12), [0, 1, 2, 3], [0, 4, 8, 12]))
F('In the same split, what does the triangle represent?', lambda s: _split(
    4.0, 10, 3.0, 'Splitting the area', 'The trapezium under a straight v–t line split into a rectangle (ut) and a triangle (½at²).',
    (0, 3.5), (0, 12), [0, 1, 2, 3], [0, 4, 8, 12]))
F('For u = 4.0 m s⁻¹, a = 2.0 m s⁻² and t = 3.0 s, calculate the rectangle part', lambda s: _split(
    4.0, 10, 3.0, 'Rectangle and triangle', 'A v–t line from 4.0 m s⁻¹ rising at 2.0 m s⁻² for 3.0 s; the area is split into the rectangle ut and the triangle ½at².',
    (0, 3.5), (0, 12), [0, 1, 2, 3], [0, 4, 8, 12]))
F('Taking the same motion (u = 4.0 m s⁻¹, a = 2.0 m s⁻², t = 3.0 s)', lambda s: _split(
    4.0, 10, 3.0, 'Rectangle and triangle', 'A v–t line from 4.0 m s⁻¹ rising at 2.0 m s⁻² for 3.0 s; the area is split into the rectangle ut and the triangle ½at².',
    (0, 3.5), (0, 12), [0, 1, 2, 3], [0, 4, 8, 12]))
F('A v–t line rises from 5.0 m s⁻¹ to 11 m s⁻¹ in 4.0 s. Calculate the trapezium area', lambda s: _split(
    5.0, 11, 4.0, 'Trapezium area', 'A straight v–t line from 5.0 to 11 m s⁻¹ over 4.0 s, with the trapezium shaded and split at 5.0 m s⁻¹.',
    (0, 4.5), (0, 12), [0, 1, 2, 3, 4], [0, 4, 8, 12]))
F('A v–t graph from u to v in time t is split into a rectangle of height u and a triangle', lambda s: plot(
    't', 'v', [dict(x=[0, 4], y=[3, 9], kind='area'), dict(x=[0, 4], y=[3, 9]), dict(x=[0, 4], y=[3, 3], color=MUT, dash='5 4', lw='thin'),
               dict(x=[4, 4], y=[0, 9], color=MUT, lw='thin')],
    'General derivation', 'A straight v–t line from u at t = 0 to v at time t; the area is split into a rectangle of height u and a triangle of height v − u.',
    xr=(0, 4.6), yr=(0, 10), xtl=[(0, '0'), (4, 't')], ytl=[(0, '0'), (3, 'u'), (9, 'v')], grid=False,
    notes=[(2, 1.5, 'ut', 'middle', 0, 4, False), (2.8, 5.0, '½(v − u)t', 'middle', 0, 4, False)]))
F('For a car moving from 12 m s⁻¹ to 4.0 m s⁻¹ in 4.0 s, calculate the displacement using s = (u + v)t/2', lambda s: _vt(
    [(0, 12), (4.0, 4.0)], 'Decelerating car', 'A straight v–t line falling from 12 to 4.0 m s⁻¹ over 4.0 s, with the trapezium under it shaded.',
    (0, 4.5), (0, 14), [0, 1, 2, 3, 4], [0, 4, 8, 12], shade=True))
F('An object accelerates uniformly from rest. (a) Use s = ½at² to show that the distance in the nth second', lambda s: _vt(
    [(0, 0), (5.0, 15)], 'Distance in each second', 'A straight v–t line from rest with gradient 3.0 m s⁻² for 5.0 s; the strips for each second have areas in the ratio 1 : 3 : 5 : 7 : 9.',
    (0, 5), (0, 16), [0, 1, 2, 3, 4, 5], [0, 3, 6, 9, 12, 15], shade=True,
    extra=[dict(x=[k, k], y=[0, 3 * k], color=MUT, lw='thin') for k in (1, 2, 3, 4)]))
F('A train passes two posts 100 m apart, taking 8.0 s for the first 100 m and 6.0 s for the next 100 m', lambda s: star_line(
    'Three posts', 'Three posts 100 m apart along a track; the train takes 8.0 s for the first gap and 6.0 s for the second.',
    [dict(x=0, kind='planet', label='post 1', value=False), dict(x=1, kind='planet', label='post 2', value=False), dict(x=2, kind='planet', label='post 3', value=False)],
    [(0, 1, '100 m, 8.0 s', None), (1, 2, '100 m, 6.0 s', None)]))
F('A cyclist passes point P at 4.0 m s⁻¹ and point Q, 60 m further on, at 8.0 m s⁻¹', lambda s: _vt(
    [(0, 4.0), (10, 8.0)], 'P to Q', 'A straight v–t line from 4.0 m s⁻¹ at P to 8.0 m s⁻¹ at Q, 10 s later, with the 60 m area shaded.',
    (0, 10), (0, 10), [0, 2, 4, 6, 8, 10], [0, 2, 4, 6, 8, 10], shade=True))
F('A runner speeds up from 4.0 m s⁻¹ to 10 m s⁻¹ with a uniform acceleration of 3.0 m s⁻²', lambda s: _vt(
    [(0, 4.0), (2.0, 10)], 'Runner speeding up', 'A straight v–t line from 4.0 to 10 m s⁻¹ with gradient 3.0 m s⁻², with the area under it shaded.',
    (0, 2.5), (0, 12), [0, 0.5, 1.0, 1.5, 2.0, 2.5], [0, 4, 8, 12], shade=True))

# ── 2.10 ──
F('A car\'s speed rises from 0 to 12 m s⁻¹ in the first 4.0 s and from 12 to 18 m s⁻¹ in the next 4.0 s. Calculate the acceleration in the first', lambda s: _vt(
    [(0, 0), (4.0, 12), (8.0, 18)], 'Changing acceleration', 'A v–t graph rising to 12 m s⁻¹ in 4.0 s and then less steeply to 18 m s⁻¹ at 8.0 s.',
    (0, 8), (0, 20), [0, 2, 4, 6, 8], [0, 5, 10, 15, 20]))
F('A sphere falling in oil has speeds 0.10, 0.17, 0.21 and 0.23 m s⁻¹ at 0.1 s intervals. Calculate its average acceleration over the first', lambda s: plot(
    't / s', 'v / m s⁻¹', [dict(x=[0, 0.1, 0.2, 0.3], y=[0.10, 0.17, 0.21, 0.23], kind='points'), _fn(lambda t: 0.25 - 0.15 * exp(-t / 0.13), 0, 0.3, color=MUT, lw='thin')],
    'Sphere falling in oil', 'Speed readings 0.10, 0.17, 0.21 and 0.23 m s⁻¹ at 0.1 s intervals, on a curve levelling off.',
    xr=(0, 0.3), yr=(0, 0.3), xticks=[0, 0.1, 0.2, 0.3], yticks=[0, 0.1, 0.2, 0.3]))
F('A car\'s velocity is given by v = 0.30t²', lambda s: plot(
    't / s', 'v / m s⁻¹', [_fn(lambda t: 0.3 * t * t, 0, 5), dict(x=[2.0, 4.0], y=[1.2, 4.8], color=ACC2, dash='6 4')],
    'v = 0.30t²', 'The curve v = 0.30t² from 0 to 5.0 s, with the chord between t = 2.0 s and t = 4.0 s dashed.',
    xr=(0, 5), yr=(0, 8), xticks=[0, 1, 2, 3, 4, 5], yticks=[0, 2, 4, 6, 8]))
F('A tangent to a skydiver\'s v–t curve at 4.0 s passes through (0 s, 12 m s⁻¹) and (8.0 s, 44 m s⁻¹)', lambda s: plot(
    't / s', 'v / m s⁻¹', [_fn(lambda t: 28 + 4.0 * (t - 4) - 0.25 * (t - 4) ** 2, 0, 12), dict(x=[0, 8.0], y=[12, 44], color=ACC2, dash='6 4')],
    'Tangent to a skydiver curve', 'A skydiver\'s curved v–t graph with a dashed tangent at 4.0 s through (0 s, 12 m s⁻¹) and (8.0 s, 44 m s⁻¹).',
    xr=(0, 12), yr=(0, 50), xticks=[0, 2, 4, 6, 8, 10, 12], yticks=[0, 10, 20, 30, 40, 50],
    notes=[(0, 12, '12', 'start', 8, 12, True), (8.0, 44, '(8.0, 44)', 'end', -8, -10, True)]))
F('A car\'s acceleration falls steadily from 4.0 m s⁻² at t = 0 to zero at t = 6.0 s', lambda s: plot(
    't / s', 'a / m s⁻²', [dict(x=[0, 6.0], y=[4.0, 0], kind='area'), dict(x=[0, 6.0], y=[4.0, 0])],
    'Acceleration–time graph', 'An a–t graph falling in a straight line from 4.0 m s⁻² to zero at 6.0 s, with the triangle under it shaded.',
    xr=(0, 7), yr=(0, 5), xticks=[0, 1, 2, 3, 4, 5, 6, 7], yticks=[0, 1, 2, 3, 4, 5]))
F('A train\'s acceleration is 0.50 m s⁻² for 20 s and then 0.20 m s⁻² for 30 s, starting from rest. Calculate its final speed', lambda s: plot(
    't / s', 'a / m s⁻²', [dict(x=[0, 20, 20, 50], y=[0.50, 0.50, 0.20, 0.20], kind='area'), dict(x=[0, 20, 20, 50], y=[0.50, 0.50, 0.20, 0.20])],
    'Two-stage acceleration', 'An a–t graph at 0.50 m s⁻² for 20 s then 0.20 m s⁻² for 30 s, with the area shaded.',
    xr=(0, 50), yr=(0, 0.6), xticks=[0, 10, 20, 30, 40, 50], yticks=[0, 0.2, 0.4, 0.6]))
F('A sprinter\'s speed is 0, 6.0, 8.5, 9.6 and 10.0 m s⁻¹ at t = 0, 1, 2, 3 and 4 s. Estimate the distance', lambda s: _vt(
    [(0, 0), (1, 6.0), (2, 8.5), (3, 9.6), (4, 10.0)], 'Sprinter', 'Speed readings 0, 6.0, 8.5, 9.6 and 10.0 m s⁻¹ at 0–4 s joined by straight lines, with the area (trapezia) shaded.',
    (0, 4), (0, 12), [0, 1, 2, 3, 4], [0, 4, 8, 12], shade=True))
F('An a–t graph for a lift (up positive): +1.2 m s⁻² for 2.0 s, 0 for 5.0 s, −0.80 m s⁻² for 3.0 s', lambda s: plot(
    't / s', 'a / m s⁻²', [dict(x=[0, 2, 2, 7, 7, 10], y=[1.2, 1.2, 0, 0, -0.8, -0.8])],
    'Lift acceleration', 'An a–t graph: +1.2 m s⁻² for 2.0 s, zero for 5.0 s, then −0.80 m s⁻² for 3.0 s.',
    xr=(0, 10), yr=(-1.0, 1.5), xticks=[0, 2, 4, 6, 8, 10], yticks=[-1.0, -0.5, 0, 0.5, 1.0, 1.5]))
F('A falling ball\'s speed is recorded as 0, 9.0, 16.5, 22.0, 25.5 m s⁻¹ at 0, 1, 2, 3, 4 s', lambda s: _vt(
    [(0, 0), (1, 9.0), (2, 16.5), (3, 22.0), (4, 25.5)], 'Falling with air resistance', 'Speeds 0, 9.0, 16.5, 22.0 and 25.5 m s⁻¹ at 0–4 s (joined), with the free-fall line v = 9.81t dashed for comparison.',
    (0, 4), (0, 40), [0, 1, 2, 3, 4], [0, 10, 20, 30, 40], extra=[dict(x=[0, 4], y=[0, 39.24], color=MUT, dash='5 4', lw='thin')]))
F('A car accelerates from rest with a = 3.0 − 0.50t', lambda s: plot(
    't / s', 'a / m s⁻²', [dict(x=[0, 6.0], y=[3.0, 0], kind='area'), dict(x=[0, 6.0], y=[3.0, 0])],
    'a = 3.0 − 0.50t', 'An a–t graph falling in a straight line from 3.0 m s⁻² to zero at 6.0 s, with the area shaded.',
    xr=(0, 7), yr=(0, 4), xticks=[0, 1, 2, 3, 4, 5, 6, 7], yticks=[0, 1, 2, 3, 4]))
F('A rocket\'s acceleration rises uniformly from 20 m s⁻² to 30 m s⁻² over 10 s', lambda s: plot(
    't / s', 'a / m s⁻²', [dict(x=[0, 10], y=[20, 30], kind='area'), dict(x=[0, 10], y=[20, 30])],
    'Rising acceleration', 'An a–t graph rising in a straight line from 20 to 30 m s⁻² over 10 s, with the trapezium shaded.',
    xr=(0, 12), yr=(0, 35), xticks=[0, 2, 4, 6, 8, 10, 12], yticks=[0, 10, 20, 30]))
F('A car starting from rest has acceleration 3.0 m s⁻² for the first 4.0 s, after which its acceleration decreases uniformly to zero at 10 s', lambda s: plot(
    't / s', 'a / m s⁻²', [dict(x=[0, 4, 10], y=[3.0, 3.0, 0], kind='area'), dict(x=[0, 4, 10], y=[3.0, 3.0, 0])],
    'a–t graph', 'An a–t graph constant at 3.0 m s⁻² for 4.0 s and then falling in a straight line to zero at 10 s, with the area shaded.',
    xr=(0, 11), yr=(0, 4), xticks=[0, 2, 4, 6, 8, 10], yticks=[0, 1, 2, 3, 4]))
F('A car\'s velocity is v = 15(1 − e^(−t/3.0))', lambda s: plot(
    't / s', 'v / m s⁻¹', [_fn(lambda t: 15 * (1 - exp(-t / 3)), 0, 12), dict(x=[2.5, 3.5], y=[15 * (1 - exp(-2.5 / 3)), 15 * (1 - exp(-3.5 / 3))], color=ACC2, lw='bold')],
    'Approaching 15 m s⁻¹', 'The curve v = 15(1 − e^(−t/3.0)) levelling off towards 15 m s⁻¹, with the chord from 2.5 s to 3.5 s highlighted.',
    xr=(0, 12), yr=(0, 16), xticks=[0, 2, 4, 6, 8, 10, 12], yticks=[0, 4, 8, 12, 16]))
F('A cyclist\'s speed is 2.0, 3.5, 4.5 and 5.0 m s⁻¹ at t = 0, 2.0, 4.0 and 6.0 s', lambda s: _vt(
    [(0, 2.0), (2.0, 3.5), (4.0, 4.5), (6.0, 5.0)], 'Cyclist', 'Speed readings 2.0, 3.5, 4.5 and 5.0 m s⁻¹ at 0, 2.0, 4.0 and 6.0 s joined by straight lines, with the trapezia shaded.',
    (0, 6), (0, 6), [0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6], shade=True))
F('An a–t graph shows 2.0 m s⁻² for 3.0 s and then 1.0 m s⁻² for 4.0 s', lambda s: plot(
    't / s', 'a / m s⁻²', [dict(x=[0, 3, 3, 7], y=[2.0, 2.0, 1.0, 1.0], kind='area'), dict(x=[0, 3, 3, 7], y=[2.0, 2.0, 1.0, 1.0])],
    'a–t graph', 'An a–t graph at 2.0 m s⁻² for 3.0 s then 1.0 m s⁻² for 4.0 s, with the area shaded.',
    xr=(0, 8), yr=(0, 2.5), xticks=[0, 1, 2, 3, 4, 5, 6, 7, 8], yticks=[0, 0.5, 1.0, 1.5, 2.0, 2.5]))
