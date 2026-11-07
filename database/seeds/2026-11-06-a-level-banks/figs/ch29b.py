# Figures for ch29b.py (Chapter 29 nuclear physics, 29.5 to 29.8). Graph data are generated from the
# half-lives and activities the questions use.
LN2_ = log(2)


def decay_curve(title, desc, A0, th, t_end, xlabel, ylabel, xticks, yticks, scale=1.0, extra=(), yr=None, notes=()):
    xs = [t_end * i / 200 for i in range(201)]
    return plot(xlabel, ylabel, [dict(x=xs, y=[A0 * 0.5 ** (t / th) / scale for t in xs])] + list(extra), title, desc,
                xr=(0, t_end), yr=yr or (0, A0 / scale * 1.05), xticks=xticks, yticks=yticks, notes=notes)


# ── 29.5 ──
F('A detector records 1200 counts in 5.0 minutes near a source', lambda s: gm_setup(
    'Counting a source', 'A radioactive source in a holder in front of the window of a GM tube, which is connected to a counter.'))
F('A γ-source gives a corrected count rate of 120 counts s⁻¹ at 10 cm from a detector', lambda s: gm_setup(
    'Source and detector', 'A γ-source facing the window of a GM tube connected to a counter, first 10 cm from the detector and then 20 cm.',
    d_label='10 cm, then 20 cm'))

# ── 29.7 ──
F('The graph shows the activity of a sample against time. Use it to find the half-life', lambda s: decay_curve(
    'Activity against time', 'Graph of the activity of a sample against time from 0 to 120 s: it starts at 800 Bq and falls exponentially, halving every 30 s.',
    800, 30, 120, 't / s', 'A / Bq', [0, 20, 40, 60, 80, 100, 120], [0, 200, 400, 600, 800]))
F('The graph shows a count rate falling with time. Use it to find the half-life, in minutes', lambda s: decay_curve(
    'Count rate against time', 'Graph of count rate against time from 0 to 80 minutes: it starts at 1000 counts per minute and falls exponentially, halving every 20 minutes.',
    1000, 20, 80, 't / min', 'count rate / min⁻¹', [0, 10, 20, 30, 40, 50, 60, 70, 80], [0, 200, 400, 600, 800, 1000]))
F('The graph shows N against t for a sample. Use it to estimate the number', lambda s: decay_curve(
    'Undecayed nuclei against time', 'Graph of the number of undecayed nuclei against time from 0 to 160 s: it starts at 6.0 × 10⁹ and falls exponentially, halving every 40 s.',
    6.0e9, 40, 160, 't / s', 'N / 10⁹', [0, 40, 80, 120, 160], [0, 1, 2, 3, 4, 5, 6], scale=1e9))
F('The graph shows N against t for a sample. (a) Read N₀ and the half-life', lambda s: decay_curve(
    'Undecayed nuclei against time', 'Graph of the number of undecayed nuclei against time from 0 to 160 s: it starts at 6.0 × 10⁹ and falls exponentially, halving every 40 s.',
    6.0e9, 40, 160, 't / s', 'N / 10⁹', [0, 40, 80, 120, 160], [0, 1, 2, 3, 4, 5, 6], scale=1e9))
F('The table and graph show the count rate from a source at 2-minute intervals', lambda s: (lambda ts: table_plot(
    ['t / min'] + [f'{t:g}' for t in ts], [['C / min⁻¹'] + [f'{800 * 0.5 ** (t / 4.0):.0f}' for t in ts]], 'Count rate readings',
    'Table and graph of count rate (background removed) against time every 2 minutes from 0 to 10 minutes, starting at 800 counts per minute and falling exponentially.',
    dict(xlabel='t / min', ylabel='count rate / min⁻¹', series=[dict(x=ts, y=[round(800 * 0.5 ** (t / 4.0)) for t in ts], kind='points'),
                                                               dict(x=[10 * i / 100 for i in range(101)], y=[800 * 0.5 ** (10 * i / 100 / 4.0) for i in range(101)], color=MUT)],
         xr=(0, 10.5), yr=(0, 850), xticks=[0, 2, 4, 6, 8, 10], yticks=[0, 200, 400, 600, 800], h=240)))([0, 2, 4, 6, 8, 10]))
F('The graph shows two decay curves, P and Q, drawn on the same axes', lambda s: (lambda xs: plot(
    't / s', 'A / Bq', [dict(x=xs, y=[600 * 0.5 ** (t / 15) for t in xs]), dict(x=xs, y=[600 * 0.5 ** (t / 45) for t in xs], color=ACC2)],
    'Two decay curves', 'Graph of activity against time for two samples starting at the same activity: curve P falls quickly and curve Q falls more slowly.',
    xr=(0, 90), yr=(0, 650), xticks=[0, 15, 30, 45, 60, 75, 90], yticks=[0, 200, 400, 600], notes=[(12, 600 * 0.5 ** (12 / 15), 'P', 'start', 6, -8, False), (60, 600 * 0.5 ** (60 / 45), 'Q', 'start', 6, -10, False)]))(
    [90 * i / 200 for i in range(201)]))
F('Two points on a straight-line graph of ln A against t are (0 s, 6.0) and (50 s, 4.0)', lambda s: plot(
    't / s', 'ln (A / Bq)', [dict(x=[0, 50], y=[6.0, 4.0], kind='points'), dict(x=[0, 75], y=[6.0, 3.0])], 'ln A against time',
    'Straight-line graph of ln A against time passing through (0 s, 6.0) and (50 s, 4.0).', xr=(0, 80), yr=(0, 7), xticks=[0, 10, 20, 30, 40, 50, 60, 70, 80], yticks=[0, 1, 2, 3, 4, 5, 6, 7]))
F('The graph of ln(A / Bq) against t for a source is a straight line through (0, 6.40) and (100 s, 4.10)', lambda s: plot(
    't / s', 'ln (A / Bq)', [dict(x=[0, 100], y=[6.40, 4.10], kind='points'), dict(x=[0, 150], y=[6.40, 6.40 - 0.023 * 150])], 'ln A against time',
    'Straight-line graph of ln A against time through (0, 6.40) and (100 s, 4.10).', xr=(0, 160), yr=(0, 7), xticks=[0, 40, 80, 120, 160], yticks=[0, 1, 2, 3, 4, 5, 6, 7]))
F('A graph of ln(count rate / counts per minute) against time t (in minutes) has an intercept of 6.9', lambda s: plot(
    't / min', 'ln (C / min⁻¹)', [dict(x=[0, 40], y=[6.9, 6.9 - 0.115 * 40])], 'ln C against time',
    'Straight-line graph of the natural log of count rate against time, with intercept 6.9 and gradient −0.115 min⁻¹.', xr=(0, 40), yr=(0, 8), xticks=[0, 10, 20, 30, 40], yticks=[0, 2, 4, 6, 8]))
F('The tangent to an activity–time curve at t = 0 meets the time axis at t = 50 s', lambda s: (lambda xs: plot(
    't / s', 'A (arbitrary units)', [dict(x=xs, y=[100 * exp(-t / 50) for t in xs]), dict(x=[0, 50], y=[100, 0], color=ACC2, dash='5 4')],
    'Tangent to a decay curve', 'Graph of activity against time with the tangent at t = 0 drawn dashed; the tangent meets the time axis at t = 50 s.',
    xr=(0, 160), yr=(0, 110), xticks=[0, 50, 100, 150], yticks=[0, 50, 100]))([160 * i / 200 for i in range(201)]))
F('The count rate from a source levels off at 30 counts per minute after a long time', lambda s: (lambda xs: plot(
    't / min', 'count rate / min⁻¹', [dict(x=xs, y=[30 + 480 * 0.5 ** (t / 10) for t in xs]), dict(x=[0, 80], y=[30, 30], color=MUT, dash='4 3')],
    'Count rate with background', 'Graph of measured count rate against time: it starts at 510 counts per minute and levels off at 30 counts per minute, the background.',
    xr=(0, 80), yr=(0, 550), xticks=[0, 20, 40, 60, 80], yticks=[0, 100, 200, 300, 400, 500]))([80 * i / 200 for i in range(201)]))
F('A graph of activity against number of undecayed nuclei is a straight line through the origin of gradient', lambda s: plot(
    'N / 10⁶', 'A / 10³ Bq', [dict(x=[0, 5], y=[0, 2.0e-3 * 5e6 / 1e3])], 'Activity against number of nuclei',
    'Straight-line graph through the origin of activity against the number of undecayed nuclei, with gradient 2.0 × 10⁻³ s⁻¹.', xr=(0, 5), yr=(0, 10), xticks=[0, 1, 2, 3, 4, 5], yticks=[0, 2, 4, 6, 8, 10]))
F('The activity of a source is measured every 20 s', lambda s: (lambda t, A: table_plot(
    ['t / s'] + [f'{x:g}' for x in t], [['A / Bq'] + [f'{y:g}' for y in A]], 'Activity readings',
    'Table and graph of activity against time every 20 s: 820, 560, 380, 260 and 180 Bq, falling exponentially.',
    dict(xlabel='t / s', ylabel='A / Bq', series=[dict(x=t, y=A, kind='points')], xr=(0, 90), yr=(0, 900), xticks=[0, 20, 40, 60, 80], yticks=[0, 200, 400, 600, 800], h=240)))(
    [float(x) for x in re.search(r't = ([\d, ]+) s', s).group(1).split(',')], [float(x) for x in re.search(r'A = ([\d, ]+) Bq', s).group(1).split(',')]))
F('A detector records 450, 310, 220 and 160 counts per minute at t = 0, 5, 10 and 15 min', lambda s: (lambda t, C: table_plot(
    ['t / min'] + [f'{x:g}' for x in t], [['count rate / min⁻¹'] + [f'{y:g}' for y in C]], 'Raw count rates',
    'Table and graph of raw count rate against time: 450, 310, 220 and 160 counts per minute at 0, 5, 10 and 15 minutes, with the background of 20 counts per minute shown dashed.',
    dict(xlabel='t / min', ylabel='count rate / min⁻¹', series=[dict(x=t, y=C, kind='points'), dict(x=[0, 16], y=[20, 20], color=MUT, dash='4 3')],
         xr=(0, 16), yr=(0, 500), xticks=[0, 5, 10, 15], yticks=[0, 100, 200, 300, 400, 500], h=240)))(
    [0.0, 5.0, 10.0, 15.0], [float(x) for x in re.search(r'records ([\d, and]+) counts', s).group(1).replace(' and', ',').split(',')]))
F('A graph of A against t is drawn for a sample. At t = 0, A = 900 Bq and the tangent', lambda s: (lambda xs: plot(
    't / s', 'A / Bq', [dict(x=xs, y=[900 * exp(-0.030 * t) for t in xs]), dict(x=[0, 900 / 27], y=[900, 0], color=ACC2, dash='5 4')],
    'Tangent at t = 0', 'Graph of activity against time starting at 900 Bq, with the tangent at t = 0 drawn dashed; its gradient is −27 Bq s⁻¹.',
    xr=(0, 100), yr=(0, 950), xticks=[0, 20, 40, 60, 80, 100], yticks=[0, 300, 600, 900]))([100 * i / 200 for i in range(201)]))
