# Figures for ch27.py (Chapter 27 alternating currents). Every curve is computed
# from the stem's numbers (grab) or, for symbolic stems, drawn in units of V₀ and T.
TT = [(0, '0'), (1, 'T'), (2, '2T')]


def sym_wave(title, desc, f, ylab, ytl, cycles=2, n=400, extra=(), legend=None, hlines=(), xtl=None, vlines=()):
    xs, ys = wave_xy(f, 0, cycles * (1 - 1e-6), n)
    series = [dict(x=xs, y=ys)] + list(extra)
    lo = min(min(s['y']) for s in series)
    hi = max(max(s['y']) for s in series)
    pad = 0.15 * (hi - lo)
    return plot('t', ylab, series, title, desc, xr=(0, cycles), yr=(min(0, lo) - (pad if lo < 0 else 0), hi + pad),
                xtl=xtl or TT[:cycles + 1], ytl=ytl, legend=legend, hlines=hlines, vlines=vlines, grid=False)


def sine_ms(s, V0, f, title, desc, cycles=1, hlines=(), vlines=(), ylab='V / V'):
    T = 1000 / f
    xs, ys = wave_xy(lambda t: V0 * sin(2 * pi * f * t / 1000), 0, cycles * T)
    return plot('t / ms', ylab, [dict(x=xs, y=ys)], title, desc, xr=(0, cycles * T), yr=(-1.15 * V0, 1.15 * V0),
                hlines=hlines, vlines=vlines)


# ── 27.1 ──
F('A square-wave voltage switches between +V₀ and −V₀', lambda s: sym_wave(
    'Square-wave voltage', 'Graph of voltage V against time t for a square wave: V is +V₀ for the first half of each period T and −V₀ for the second half. Two periods are shown.',
    lambda t: 1.0 if (t % 1) < 0.5 else -1.0, 'V', [(-1, '−V₀'), (0, '0'), (1, '+V₀')], n=2000))
F('A resistor is connected first to a 10 V d.c. supply and then to a sinusoidal supply of peak 10 V', lambda s: sym_wave(
    'd.c. and a.c. supplies', 'Graph of p.d. against time t. A horizontal dashed line shows the steady 10 V d.c. supply; a sine curve of peak 10 V shows the a.c. supply, which reaches 10 V only at its peaks.',
    lambda t: grab(s, r'sinusoidal supply of peak (\d+) V') * sin(2 * pi * t), 'V / V', [(-10, '−10'), (0, '0'), (10, '10')],
    extra=[dict(x=[0, 2], y=[grab(s, r'(\d+) V d\.c\.')] * 2, color=ACC2, dash='6 4')],
    legend=[('a.c.', ACC, None), ('d.c.', ACC2, '6 4')]))
F('A voltage is +4.0 V for half of each cycle and 0 V for the other half', lambda s: sym_wave(
    'Rectangular voltage', 'Graph of voltage against time t: the voltage is +4.0 V for the first half of each period T and 0 V for the second half. Two periods are shown.',
    lambda t: grab(s, r'\+([\d.]+) V for half') if (t % 1) < 0.5 else 0.0, 'V / V', [(0, '0'), (4, '4.0')], n=2000))
F('For a triangular waveform, I_rms = I₀/√3', lambda s: sym_wave(
    'Triangular current', 'Graph of current I against time t for a triangular waveform that rises linearly from 0 to a peak of 6.0 A, falls linearly to −6.0 A and returns to 0 in each period T. Two periods are shown.',
    lambda t: grab(s, r'peak ([\d.]+) A') * (4 * abs(((t - 0.25) % 1) - 0.5) - 1) * -1, 'I / A', [(-6, '−6.0'), (0, '0'), (6, '6.0')]))
F('A resistor is connected to a sinusoidal supply of peak 10 V and then to a 6.0 V d.c. supply', lambda s: sym_wave(
    'a.c. and d.c. supplies', 'Graph of p.d. against time t: a sine curve of peak 10 V (the a.c. supply) and a horizontal dashed line at 6.0 V (the d.c. supply). Two periods are shown.',
    lambda t: grab(s, r'peak (\d+) V') * sin(2 * pi * t), 'V / V', [(-10, '−10'), (0, '0'), (6, '6.0'), (10, '10')],
    extra=[dict(x=[0, 2], y=[grab(s, r'([\d.]+) V d\.c\.')] * 2, color=ACC2, dash='6 4')],
    legend=[('a.c.', ACC, None), ('d.c.', ACC2, '6 4')]))
F('A voltage is +6.0 V for 2.0 ms and −2.0 V for the next 2.0 ms', lambda s: plot(
    't / ms', 'V / V', [dict(x=steps_xy([(grab(s, r'\+([\d.]+) V for'), 2.0), (-grab(s, r'and −([\d.]+) V for'), 2.0)], 2)[0],
                             y=steps_xy([(grab(s, r'\+([\d.]+) V for'), 2.0), (-grab(s, r'and −([\d.]+) V for'), 2.0)], 2)[1])],
    'Asymmetric square wave', 'Graph of voltage against time in ms: the voltage is +6.0 V from 0 to 2.0 ms, −2.0 V from 2.0 ms to 4.0 ms, and the pattern repeats to 8.0 ms.',
    xr=(0, 8), yr=(-3, 7), xticks=[0, 2, 4, 6, 8], yticks=[-2, 0, 2, 4, 6]))
F('An oscilloscope shows a sinusoidal trace. The Y-gain is 5.0 V per division', lambda s: scope(
    'Oscilloscope trace', 'An oscilloscope screen with a grid of 1 cm divisions. A sine wave has its peaks 3.4 divisions above the centre line and one cycle spans 5.0 divisions horizontally. Y-gain 5.0 V per division; time-base 2.0 ms per division.',
    [dict(amp=grab(s, r'peak is ([\d.]+) divisions'), period=grab(s, r'cycle spans ([\d.]+) divisions'))],
    gain='5.0 V per division', base='2.0 ms per division'))
F('A half-wave rectified sinusoidal voltage of peak V₀', lambda s: sym_wave(
    'Half-wave rectified voltage', 'Graph of voltage against time t: the positive half of each sine cycle, peak V₀, with zero voltage during the other half of each period T. Two periods are shown.',
    lambda t: max(0.0, sin(2 * pi * t)), 'V', [(0, '0'), (1, 'V₀')]))
F('(a) Show that the mean power delivered to a resistor by a sinusoidal supply is ½V₀I₀', lambda s: sym_wave(
    'Power on an a.c. supply', 'Graph of the instantaneous power P = V₀I₀ sin² ωt against time t. P rises from 0 to a maximum of V₀I₀ and back to 0 twice in each period T; a dashed line marks the level ½V₀I₀ halfway up.',
    lambda t: sin(2 * pi * t) ** 2, 'P', [(0, '0'), (0.5, '½V₀I₀'), (1, 'V₀I₀')], hlines=[(0.5, None, False)]))
F('A current of 3.0 A flows for 0.010 s and is then zero for 0.030 s', lambda s: plot(
    't / s', 'I / A', [dict(x=steps_xy([(grab(s, r'of ([\d.]+) A flows'), grab(s, r'flows for ([\d.]+) s')), (0, grab(s, r'zero for ([\d.]+) s'))], 2)[0],
                             y=steps_xy([(grab(s, r'of ([\d.]+) A flows'), grab(s, r'flows for ([\d.]+) s')), (0, grab(s, r'zero for ([\d.]+) s'))], 2)[1])],
    'Pulsed current', 'Graph of current against time: 3.0 A from 0 to 0.010 s, then zero until 0.040 s, after which the pattern repeats (3.0 A from 0.040 s to 0.050 s, zero to 0.080 s).',
    xr=(0, 0.08), yr=(0, 3.6), xticks=[0, 0.02, 0.04, 0.06, 0.08], yticks=[0, 1, 2, 3]))

# ── 27.2 ──
F('An oscilloscope trace has a peak 2.5 divisions above the centre line', lambda s: scope(
    'Oscilloscope trace', 'An oscilloscope screen with a grid of divisions. A sine wave has its peaks 2.5 divisions above the centre line. Y-gain 2.0 V per division.',
    [dict(amp=grab(s, r'peak ([\d.]+) divisions'), period=4)], gain='2.0 V per division'))
F('One cycle of a trace spans 4.0 divisions with the time-base at 5.0 ms per division', lambda s: scope(
    'Oscilloscope trace', 'An oscilloscope screen with a grid of divisions. A sine wave repeats every 4.0 divisions horizontally, so two and a half cycles fill the 10-division width. Time-base 5.0 ms per division.',
    [dict(amp=3, period=grab(s, r'spans ([\d.]+) divisions'))], base='5.0 ms per division'))
F('For V = 12 sin ωt (in volts), calculate V when ωt = 30°', lambda s: plot(
    'ωt / °', 'V / V', [dict(x=wave_xy(lambda a: a, 0, 360)[0], y=[12 * sin(radians(a)) for a in wave_xy(lambda a: a, 0, 360)[0]])],
    'V = 12 sin ωt', 'Graph of V = 12 sin ωt against ωt from 0° to 360°, peaking at 12 V at 90° and reaching −12 V at 270°. A dashed vertical line marks ωt = 30°.',
    xr=(0, 360), yr=(-14, 14), xticks=[0, 90, 180, 270, 360], yticks=[-12, -6, 0, 6, 12], vlines=[(30, '30°', True)]))
F('An oscilloscope shows a peak of 3.0 divisions with the Y-gain at 5.0 V per division', lambda s: scope(
    'Oscilloscope trace', 'An oscilloscope screen with a grid of divisions. A sine wave has peaks 3.0 divisions above and troughs 3.0 divisions below the centre line. Y-gain 5.0 V per division.',
    [dict(amp=grab(s, r'peak of ([\d.]+) divisions'), period=4)], gain='5.0 V per division'))
F('The frequency of a signal is doubled while the time-base setting is unchanged', lambda s: scope(
    'Oscilloscope trace before the change', 'An oscilloscope screen showing a sine wave with peaks 2.5 divisions high; one cycle spans 5 divisions, so two complete cycles fill the screen. This is the trace before the frequency is changed.',
    [dict(amp=2.5, period=5)]))
F('The Y-gain of an oscilloscope is changed from 5 V per division to 2 V per division', lambda s: scope(
    'Oscilloscope trace before the change', 'An oscilloscope screen showing a sine wave with peaks 1.6 divisions above the centre line and a period of 4 divisions, with the Y-gain at 5 V per division (the setting before the change).',
    [dict(amp=1.6, period=4)], gain='5 V per division'))
F('A sinusoidal voltage of peak 20 V and frequency 50 Hz is zero at t = 0 and rising', lambda s: sine_ms(
    s, grab(s, r'peak (\d+) V'), grab(s, r'frequency (\d+) Hz'), 'Sinusoidal voltage',
    'Graph of voltage against time in ms for one 20 ms cycle of a sine wave of peak 20 V, starting at zero and rising. A dashed vertical line marks t = 3.0 ms.',
    vlines=[(grab(s, r't = ([\d.]+) ms'), 't = 3.0 ms', True)]))
F('A 50 Hz sinusoidal voltage starts at zero and rises. Calculate the time it takes to first reach half its peak value', lambda s: plot(
    't / ms', 'V', [dict(x=wave_xy(lambda t: t, 0, 20)[0], y=[sin(2 * pi * 50 * t / 1000) for t in wave_xy(lambda t: t, 0, 20)[0]])],
    'Reaching half the peak', 'Graph of a 50 Hz sinusoidal voltage against time in ms over one 20 ms cycle, starting at zero and rising to the peak V₀. A dashed horizontal line marks half the peak, ½V₀.',
    xr=(0, 20), yr=(-1.15, 1.15), ytl=[(-1, '−V₀'), (0, '0'), (0.5, '½V₀'), (1, 'V₀')], hlines=[(0.5, None, False)]))
F('Two sinusoidal signals of the same frequency are displayed together. One reaches its peak a quarter of a period after the other', lambda s: sym_wave(
    'Two signals', 'Graph against time t of two sine waves of the same amplitude and period T. The dashed wave reaches each peak a quarter of a period after the solid wave.',
    lambda t: sin(2 * pi * t), 'V', [(0, '0')], extra=[dict(x=wave_xy(lambda t: t, 0, 2)[0], y=[sin(2 * pi * (t - 0.25)) for t in wave_xy(lambda t: t, 0, 2)[0]], color=ACC2, dash='6 4')],
    xtl=[(0, '0'), (0.25, 'T/4'), (0.5, 'T/2'), (1, 'T'), (2, '2T')]))
F('A trace has a peak-to-peak height of 6.4 divisions with the Y-gain at 0.50 V per division', lambda s: scope(
    'Oscilloscope trace', 'An oscilloscope screen with a grid of divisions. A sine wave measures 6.4 divisions from crest to trough (3.2 divisions above and below the centre line). Y-gain 0.50 V per division.',
    [dict(amp=grab(s, r'height of ([\d.]+) divisions') / 2, period=4)], gain='0.50 V per division'))
F('The time-base of an oscilloscope is changed from 5 ms per division to 2 ms per division', lambda s: scope(
    'Oscilloscope trace before the change', 'An oscilloscope screen showing a steady sine wave with one cycle spanning 4 divisions, so two and a half cycles are visible, with the time-base at 5 ms per division (the setting before the change).',
    [dict(amp=2.5, period=4)], base='5 ms per division'))
F('In V = V₀ sin ωt, V₀ = 24 V. Find V one twelfth of a period after it crosses zero going upwards', lambda s: sym_wave(
    'V = V₀ sin ωt', 'Graph of V = V₀ sin ωt against time over one period T, with V₀ = 24 V. A dashed vertical line marks one twelfth of a period, T/12, after the upward zero crossing.',
    lambda t: grab(s, r'V₀ = (\d+) V') * sin(2 * pi * t), 'V / V', [(-24, '−24'), (0, '0'), (24, '24')], cycles=1,
    xtl=[(0, '0'), (1 / 12, 'T/12'), (0.5, 'T/2'), (1, 'T')], vlines=[(1 / 12, None, False)]))
F('On an oscilloscope set to 2.0 V per division, a sine wave measures 8.4 divisions from crest to trough', lambda s: scope(
    'Oscilloscope trace', 'An oscilloscope screen with a grid of divisions. A sine wave measures 8.4 divisions from crest to trough (4.2 divisions above and below the centre line). Y-gain 2.0 V per division.',
    [dict(amp=grab(s, r'measures ([\d.]+) divisions') / 2, period=5)], gain='2.0 V per division'))
F('For V = 15 sin(100πt), with V in volts and t in seconds, calculate the time at which V first reaches 10 V', lambda s: sine_ms(
    s, grab(s, r'V = (\d+) sin'), 50, 'V = 15 sin(100πt)',
    'Graph of V = 15 sin(100πt) against time in ms over one 20 ms cycle, peak 15 V. A dashed horizontal line marks V = 10 V.',
    hlines=[(grab(s, r'reaches (\d+) V'), '10 V', True)]))
F('An oscilloscope with a Y-gain of 2.0 V per division and a time-base of 0.50 ms per division shows a sine wave', lambda s: scope(
    'Oscilloscope trace', 'An oscilloscope screen with a grid of divisions. A sine wave measures 7.0 divisions from crest to trough and each cycle spans 4.0 divisions. Y-gain 2.0 V per division; time-base 0.50 ms per division.',
    [dict(amp=grab(s, r'height of ([\d.]+) divisions') / 2, period=grab(s, r'and ([\d.]+) divisions per cycle'))],
    gain='2.0 V per division', base='0.50 ms per division'))
F('A voltage is V = 340 sin(100πt), in volts', lambda s: sine_ms(
    s, grab(s, r'V = (\d+) sin'), 50, 'V = 340 sin(100πt)',
    'Graph of V = 340 sin(100πt) against time in ms over one 20 ms cycle, peak 340 V. A dashed vertical line marks t = 7.5 ms.',
    vlines=[(grab(s, r't = ([\d.]+) ms'), 't = 7.5 ms', True)]))
F('For a 50 Hz sinusoidal supply, (a) find the phase angles in the first half cycle at which |V| = 0.50V₀', lambda s: plot(
    't / ms', 'V', [dict(x=wave_xy(lambda t: t, 0, 20)[0], y=[sin(2 * pi * 50 * t / 1000) for t in wave_xy(lambda t: t, 0, 20)[0]])],
    'Where |V| > 0.50V₀', 'Graph of a 50 Hz sinusoidal voltage of peak V₀ against time in ms over one 20 ms cycle. Dashed horizontal lines mark +0.50V₀ and −0.50V₀.',
    xr=(0, 20), yr=(-1.15, 1.15), ytl=[(-1, '−V₀'), (-0.5, '−0.50V₀'), (0, '0'), (0.5, '0.50V₀'), (1, 'V₀')],
    hlines=[(0.5, None, False), (-0.5, None, False)]))
F('A dual-trace oscilloscope shows two sine waves of the same frequency, each cycle spanning 4.0 divisions', lambda s: scope(
    'Dual-trace oscilloscope', 'An oscilloscope screen showing two sine waves, each with a cycle of 4.0 divisions. The peaks of the smaller trace are 1.0 division to the right of the peaks of the larger trace.',
    [dict(amp=3.0, period=grab(s, r'spanning ([\d.]+) divisions')),
     dict(amp=2.0, period=grab(s, r'spanning ([\d.]+) divisions'), shift=grab(s, r'are ([\d.]+) division to the right'), color=ACC2)]))
F('A neon lamp lights only when the p.d. across it is more than 200 V', lambda s: sym_wave(
    'Neon lamp on the mains', 'Graph of the 230 V r.m.s. mains p.d. against time t over one period T; its peak is √2 × 230 V. Dashed horizontal lines mark +200 V and −200 V: the lamp is lit while the p.d. is beyond these lines.',
    lambda t: grab(s, r'(\d+) V r\.m\.s') * sqrt(2) * sin(2 * pi * t), 'V / V', [(0, '0'), (200, '200'), (-200, '−200')], cycles=1,
    hlines=[(grab(s, r'more than (\d+) V'), None, False), (-grab(s, r'more than (\d+) V'), None, False)]))
F('A signal is V = 3.0 + 4.0 sin ωt, in volts', lambda s: sym_wave(
    'Sine wave with a steady offset', 'Graph of V = 3.0 + 4.0 sin ωt against time t over two periods T: a sine wave of peak 4.0 V centred on a dashed line at the steady 3.0 V level.',
    lambda t: grab(s, r'V = ([\d.]+) \+') + grab(s, r'\+ ([\d.]+) sin') * sin(2 * pi * t), 'V / V', [(0, '0'), (3, '3.0')],
    hlines=[(grab(s, r'V = ([\d.]+) \+'), None, False)]))
F('A 10 Ω and a 30 Ω resistor in series are connected to a 12 V r.m.s. sinusoidal supply', lambda s: circuit(
    Series(El('R', '10 Ω'), Par(El('R', '30 Ω'), El('scope', 'oscilloscope', value=False))), El('ac', '12 V r.m.s.'),
    'Potential divider on an a.c. supply', 'Circuit: a 12 V r.m.s. a.c. supply in series with a 10 Ω resistor and a 30 Ω resistor. An oscilloscope is connected in parallel with the 30 Ω resistor.'))

# ── 27.3 ──
F('A 40 Ω heater and a 6.0 Ω cable resistance are in series on a 230 V r.m.s. supply', lambda s: circuit(
    Series(El('R', 'cable 6.0 Ω'), El('R', 'heater 40 Ω')), El('ac', '230 V r.m.s.'),
    'Heater and cable', 'Circuit: a 230 V r.m.s. a.c. supply in series with the cable resistance of 6.0 Ω and a 40 Ω heater.'))
F('A current of 5.0 A flows through a 20 Ω resistor for 0.30 of each cycle', lambda s: sym_wave(
    'Pulsed current', 'Graph of current against time t: 5.0 A for the first 0.30 of each period T and zero for the remaining 0.70 of the period. Two periods are shown.',
    lambda t: grab(s, r'of ([\d.]+) A flows') if (t % 1) < grab(s, r'for ([\d.]+) of each') else 0.0, 'I / A', [(0, '0'), (5, '5.0')], n=2000,
    xtl=[(0, '0'), (0.3, '0.30T'), (1, 'T'), (2, '2T')]))
F('An electric shower draws 40 A r.m.s. from a 230 V r.m.s. supply', lambda s: circuit(
    Series(El('R', 'cable 0.10 Ω'), El('R', 'shower', value=False), El('A')), El('ac', '230 V r.m.s.'),
    'Shower circuit', 'Circuit: a 230 V r.m.s. a.c. supply in series with the cable, of total resistance 0.10 Ω, the shower and an ammeter that reads 40 A r.m.s.'))
F('A 40 Ω lamp is supplied through a single diode from a 230 V r.m.s. mains supply', lambda s: circuit(
    Series(El('diode'), El('lamp', '40 Ω')), El('ac', '230 V r.m.s.'),
    'Lamp with a series diode', 'Circuit: a 230 V r.m.s. mains supply in series with a diode and a 40 Ω lamp, so current flows in only one half of each cycle.'))
F('A sinusoidal voltage and a square-wave voltage have the same peak value V₀', lambda s: sym_wave(
    'Sine and square waves', 'Graph against time t over two periods T of a sine wave (solid) and a square wave (dashed), both with peak value V₀: the square wave stays at +V₀ for half of each period and −V₀ for the other half.',
    lambda t: sin(2 * pi * t), 'V', [(-1, '−V₀'), (0, '0'), (1, 'V₀')],
    extra=[dict(x=steps_xy([(1, 0.5), (-1, 0.5)], 2)[0], y=steps_xy([(1, 0.5), (-1, 0.5)], 2)[1], color=ACC2, dash='6 4')],
    legend=[('sine', ACC, None), ('square', ACC2, '6 4')]))
F('The instantaneous power in a resistor on a sinusoidal supply is P = P₀ sin² ωt, with P₀ = 2.0 kW', lambda s: sym_wave(
    'P = P₀ sin² ωt', 'Graph of P = P₀ sin² ωt against time t over one period T, with P₀ = 2.0 kW: P rises from 0 to 2.0 kW at T/4, falls to 0 at T/2 and repeats. A dashed vertical line marks t = T/6.',
    lambda t: grab(s, r'P₀ = ([\d.]+) kW') * sin(2 * pi * t) ** 2, 'P / kW', [(0, '0'), (2, '2.0')], cycles=1,
    xtl=[(0, '0'), (1 / 6, 'T/6'), (0.5, 'T/2'), (1, 'T')], vlines=[(1 / 6, None, False)]))
F('Heaters rated 1.0 kW and 2.0 kW (each at 230 V r.m.s.) are connected in series', lambda s: circuit(
    Series(El('R', '1.0 kW heater'), El('R', '2.0 kW heater')), El('ac', '230 V r.m.s.'),
    'Heaters in series', 'Circuit: a 230 V r.m.s. supply in series with a heater rated 1.0 kW and a heater rated 2.0 kW.'))

# ── 27.4 ──
SYM_RC = 0.035   # schematic stems with no numbers: a time constant that makes the ripple easy to see
F('A larger smoothing capacitor is used, with the same load. What happens to the ripple?', lambda s: smoothed_graph(
    'Smoothed full-wave output', 'Graph of p.d. against time t. The dashed curve is the full-wave rectified p.d.; the solid curve is the smoothed output, which follows each peak and then falls slowly until the next peak, giving a ripple.',
    1.0, 50, SYM_RC, symbolic=True, peak_label='V₀', ripple_label='ripple'))
F('A bridge rectifier is fed with 12 V r.m.s. Two diodes, each with a forward p.d. of 0.70 V', lambda s: bridge(
    'Bridge rectifier', 'Circuit: a 12 V r.m.s. a.c. supply connected to two opposite corners of a bridge of four diodes; the load resistor is connected between the other two corners (+ on the right, − on the left).',
    supply='12 V r.m.s.'))
F('In a full-wave bridge rectifier, how many diodes conduct at any one time?', lambda s: bridge(
    'Bridge rectifier', 'Circuit: an a.c. supply connected to two opposite corners of a bridge of four diodes; the load resistor is connected between the other two corners.'))
F('In a smoothed rectifier, when does the smoothing capacitor charge?', lambda s: smoothed_graph(
    'Smoothed output', 'Graph of p.d. against time t. The dashed curve is the full-wave rectified supply; the solid curve is the capacitor p.d., which rises with the supply near each peak and falls slowly in between.',
    1.0, 50, SYM_RC, symbolic=True, peak_label='V₀'))
F('A smoothed full-wave output has a peak of 15 V. Between peaks (0.010 s)', lambda s: smoothed_graph(
    'Smoothed output', 'Graph (y axis not starting at zero) of the smoothed output p.d. against time in ms: it rises to the 15 V peak, then falls exponentially with RC = 0.50 s for 0.010 s until the next peak. The fall ΔV is the ripple.',
    grab(s, r'peak of (\d+) V'), 1 / (2 * grab(s, r'\(([\d.]+) s\)')), grab(s, r'RC = ([\d.]+) s'), zoom=True, peak_label='15 V',
    ripple_label='ΔV', show_raw=True))
F('A smoothing capacitor charged to 15 V discharges through a load with RC = 0.20 s for 10 ms between peaks', lambda s: smoothed_graph(
    'Smoothing capacitor', 'Graph (y axis not starting at zero) of the smoothed p.d. against time in ms: it reaches 15 V at each peak and decays with RC = 0.20 s for the 10 ms between peaks.',
    grab(s, r'charged to (\d+) V'), 1000 / (2 * grab(s, r'for (\d+) ms')), grab(s, r'RC = ([\d.]+) s'), zoom=True, peak_label='15 V'))
F('The load resistance across a smoothed rectifier is doubled, with the same capacitor', lambda s: bridge(
    'Smoothed bridge rectifier', 'Circuit: an a.c. supply feeding a bridge of four diodes; a smoothing capacitor and the load resistor are connected in parallel across the output.',
    cap_label=''))
F('A full-wave rectifier on a 50 Hz supply has a peak output of 12 V and feeds a 240 Ω load', lambda s: bridge(
    'Smoothed rectifier', 'Circuit: an a.c. supply feeding a full-wave bridge of four diodes; a smoothing capacitor C and the 240 Ω load are in parallel across the output.',
    cap_label='C', load_label='240 Ω'))
F('Which change would NOT reduce the ripple from a smoothed rectifier?', lambda s: bridge(
    'Smoothed bridge rectifier', 'Circuit: an a.c. supply feeding a bridge of four diodes; a smoothing capacitor and the load resistor are connected in parallel across the output.',
    cap_label=''))
F('A 9.0 V r.m.s. supply feeds a bridge rectifier whose conducting diodes each drop 0.70 V', lambda s: bridge(
    'Bridge rectifier', 'Circuit: a 9.0 V r.m.s. a.c. supply connected to two opposite corners of a bridge of four diodes, with the load between the other two corners.',
    supply='9.0 V r.m.s.'))
F('One diode in a bridge rectifier fails, becoming an open circuit', lambda s: bridge(
    'Bridge rectifier with a failed diode', 'Circuit: an a.c. supply feeding a bridge of four diodes with a load across the output. The lower-right diode has failed and is drawn as a break in the circuit.',
    broken=1))
F('Why does the smoothing capacitor\'s p.d. rise only during a short part of each cycle?', lambda s: smoothed_graph(
    'Smoothed output', 'Graph of p.d. against time t. The dashed curve is the full-wave rectified supply; the solid curve is the capacitor p.d., which rises only near each peak of the supply and falls slowly in between.',
    1.0, 50, SYM_RC, symbolic=True, peak_label='V₀'))
F('A smoothed output rises to a peak of 15.0 V and falls to 14.4 V before the next peak', lambda s: smoothed_graph(
    'Smoothed output', 'Graph (y axis not starting at zero) of the smoothed output against time t: it rises to 15.0 V at each peak and falls to 14.4 V just before the next one.',
    grab(s, r'peak of ([\d.]+) V'), 50, rc_for_trough(grab(s, r'peak of ([\d.]+) V'), grab(s, r'falls to ([\d.]+) V'), 50),
    zoom=True, symbolic=True, peak_label='15.0 V', min_label='14.4 V'))
F('A transformer gives 12 V r.m.s. to a bridge rectifier; two diodes, each dropping 0.70 V', lambda s: bridge(
    'Smoothed bridge rectifier', 'Circuit: a 12 V r.m.s. supply from a transformer feeding a bridge of four diodes; a 2200 µF smoothing capacitor and a 100 Ω load are in parallel across the output.',
    supply='12 V r.m.s.', cap_label='2200 µF', load_label='100 Ω'))
F('A half-wave rectifier on a 50 Hz supply has a smoothing capacitor charged to 10 V at each peak', lambda s: smoothed_graph(
    'Smoothed half-wave output', 'Graph of p.d. against time in ms for a half-wave rectifier on 50 Hz. The dashed curve is the rectified supply, peak 10 V; the solid curve is the capacitor p.d., which decays with RC = 0.10 s for a whole 20 ms period between peaks.',
    grab(s, r'charged to (\d+) V'), grab(s, r'on a (\d+) Hz'), grab(s, r'RC = ([\d.]+) s'), full=False, peak_label='10 V'))
F('A full-wave rectifier on a 50 Hz supply feeds 0.12 A to a load through a 1000 µF smoothing capacitor', lambda s: bridge(
    'Smoothed rectifier', 'Circuit: an a.c. supply feeding a full-wave bridge of four diodes; a 1000 µF smoothing capacitor and the load are in parallel across the output.',
    cap_label='1000 µF'))
F('A smoothed full-wave output on a 50 Hz supply rises to 14.0 V and falls to 13.2 V', lambda s: smoothed_graph(
    'Smoothed output', 'Graph (y axis not starting at zero) of the smoothed full-wave output on 50 Hz against time in ms: it rises to 14.0 V at each peak, 10 ms apart, and falls to 13.2 V just before the next one.',
    grab(s, r'rises to ([\d.]+) V'), grab(s, r'on a (\d+) Hz'), rc_for_trough(grab(s, r'rises to ([\d.]+) V'), grab(s, r'falls to ([\d.]+) V'), 50),
    zoom=True, peak_label='14.0 V', min_label='13.2 V'))
F('A bridge rectifier is fed with 6.0 V r.m.s. Each diode has a forward p.d. of 0.70 V', lambda s: bridge(
    'Bridge rectifier', 'Circuit: a 6.0 V r.m.s. a.c. supply connected to two opposite corners of a bridge of four diodes, with the load resistor between the other two corners.',
    supply='6.0 V r.m.s.'))
