# Figures for ch23b.py (23.5 capacitors and resistors, 23.6 networks, 23.7 discharge). Numbers from the stems.
C_ = lambda v: El('C', v)  # noqa: E731
R_ = lambda v: El('R', v)  # noqa: E731


def cell(v=None):
    return El('cell', v)


def disch(s, V0, RC, title, desc, t_end=None, hl=(), vl=(), unit='V', ylabel='V / V', xticks=None):
    t_end = t_end or 4 * RC
    xs, ys = wave_xy(lambda t: V0 * exp(-t / RC), 0, t_end)
    return plot('t / s', ylabel, [dict(x=xs, y=ys)], title, desc, xr=(0, t_end), yr=(0, V0 * 1.12), hlines=hl, vlines=vl, xticks=xticks)


# ── 23.5 ──
F('A capacitor in series with a resistor is connected to a battery and left for a long time', lambda s: circuit(
    Series(R_(None), C_(None)), cell(), 'Capacitor and resistor in series', 'A capacitor in series with a resistor across a battery.'))
F('A 12 V battery charges a 470 µF capacitor through a 2.0 kΩ resistor', lambda s: circuit(
    Series(R_('2.0 kΩ'), C_('470 µF')), cell('12 V'), 'Charging circuit', 'A 12 V battery charging a 470 µF capacitor through a 2.0 kΩ resistor.'))
F('A 1.0 kΩ and a 2.0 kΩ resistor are connected in series to a 9.0 V battery. A 100 µF capacitor is connected across the 2.0 kΩ', lambda s: circuit(
    Series(R_('1.0 kΩ'), Par(R_('2.0 kΩ'), C_('100 µF'))), cell('9.0 V'), 'Capacitor across a resistor',
    'A 9.0 V battery with a 1.0 kΩ resistor in series with a 2.0 kΩ resistor; a 100 µF capacitor is connected across the 2.0 kΩ resistor.'))
F('A capacitor and resistor in series are connected to a battery. A long time later', lambda s: circuit(
    Series(R_(None), C_(None)), cell(), 'Capacitor and resistor in series', 'A capacitor in series with a resistor connected to a battery.'))
F('A 1.5 kΩ resistor and an uncharged capacitor are connected in parallel directly across a 6.0 V battery', lambda s: circuit(
    Par(R_('1.5 kΩ'), C_(None)), cell('6.0 V'), 'Resistor and capacitor in parallel', 'A 1.5 kΩ resistor and an uncharged capacitor in parallel directly across a 6.0 V battery.'))
F('A 2.0 µF capacitor is connected in series with two 4.0 µF capacitors that are in parallel with each other', lambda s: network(
    Series(C_('2.0 µF'), Par(C_('4.0 µF'), C_('4.0 µF'))), 'Capacitor network', 'Between terminals A and B: a 2.0 µF capacitor in series with two 4.0 µF capacitors in parallel.'))
F('A 5.0 V supply is connected across a 1.0 kΩ resistor in series with a 3.3 kΩ resistor. A 10 µF capacitor', lambda s: circuit(
    Series(R_('1.0 kΩ'), Par(R_('3.3 kΩ'), C_('10 µF'))), cell('5.0 V'), 'Capacitor across a resistor',
    'A 5.0 V supply across a 1.0 kΩ resistor in series with a 3.3 kΩ resistor; a 10 µF capacitor is connected in parallel with the 3.3 kΩ resistor.'))
F('An uncharged capacitor in series with a resistor is switched onto a battery. What are the p.d.s immediately', lambda s: circuit(
    Series(R_(None), C_(None)), Series(cell(), El('switch')), 'Switching on', 'An uncharged capacitor in series with a resistor, a battery and an open switch.'))
F('An uncharged capacitor is connected in series with a 4.7 kΩ resistor to a 12 V battery', lambda s: circuit(
    Series(R_('4.7 kΩ'), C_(None)), Series(cell('12 V'), El('switch')), 'Charging circuit', 'An uncharged capacitor in series with a 4.7 kΩ resistor, a 12 V battery and a switch.'))
F('A 12 V battery is connected across a 2.0 kΩ resistor R₁ in series with a 4.0 kΩ resistor R₂', lambda s: circuit(
    Series(Par(R_('R₁ = 2.0 kΩ'), C_('10 µF')), Par(R_('R₂ = 4.0 kΩ'), C_('20 µF'))), cell('12 V'), 'Capacitors across resistors',
    'A 12 V battery across R₁ = 2.0 kΩ in series with R₂ = 4.0 kΩ; a 10 µF capacitor is connected across R₁ and a 20 µF capacitor across R₂.'))
F('Three components, each of value 6.0 (6.0 Ω for resistors or 6.0 µF for capacitors)', lambda s: stack([
    network(Series(Par(R_('6.0 Ω'), R_('6.0 Ω')), R_('6.0 Ω')), 'x', 'x'),
    network(Series(Par(C_('6.0 µF'), C_('6.0 µF')), C_('6.0 µF')), 'x', 'x')],
    'Resistors and capacitors compared', 'Two networks between terminals A and B: two 6.0 Ω resistors in parallel in series with a third 6.0 Ω resistor; and two 6.0 µF capacitors in parallel in series with a third 6.0 µF capacitor.'))
F('A 6.0 V battery is connected across two parallel branches. Branch 1 is a 1.0 kΩ resistor in series with a 2.0 kΩ resistor', lambda s: circuit(
    Par(Series(R_('1.0 kΩ'), R_('2.0 kΩ')), Series(C_('2.0 µF'), C_('4.0 µF'))), cell('6.0 V'), 'Resistor and capacitor branches',
    'A 6.0 V battery across two parallel branches: a 1.0 kΩ resistor in series with a 2.0 kΩ resistor, and a 2.0 µF capacitor in series with a 4.0 µF capacitor.'))
F('A real 100 µF capacitor can be modelled as an ideal capacitor in parallel with a 10 MΩ', lambda s: network(
    Par(C_('100 µF'), R_('10 MΩ leakage')), 'Leaky capacitor model', 'Model of a real capacitor between terminals A and B: an ideal 100 µF capacitor in parallel with a 10 MΩ leakage resistance.'))
F('A 2.0 µF and an 8.0 µF capacitor are connected in series across a 100 V supply', lambda s: circuit(
    Series(C_('2.0 µF'), C_('8.0 µF')), cell('100 V'), 'Capacitors in series', 'A 2.0 µF and an 8.0 µF capacitor in series across a 100 V supply.'))
F('A battery of e.m.f. 12 V and internal resistance 0.50 Ω is connected to a 5.5 Ω resistor', lambda s: circuit(
    Par(R_('5.5 Ω'), C_('1000 µF')), Series(cell('12 V'), R_('r = 0.50 Ω')), 'Capacitor across the battery',
    'A battery of e.m.f. 12 V and internal resistance 0.50 Ω connected to a 5.5 Ω resistor, with a 1000 µF capacitor directly across the battery terminals.'))
F('An uncharged 47 µF capacitor is connected in series with a 10 kΩ resistor to a 9.0 V battery', lambda s: circuit(
    Series(R_('10 kΩ'), C_('47 µF')), Series(cell('9.0 V'), El('switch')), 'Charging circuit', 'An uncharged 47 µF capacitor in series with a 10 kΩ resistor, a 9.0 V battery and a switch.'))
F('A 12 V battery is connected in series with a 10 kΩ resistor to a 220 µF capacitor. A 20 kΩ resistor is connected in parallel', lambda s: circuit(
    Series(R_('10 kΩ'), Par(C_('220 µF'), R_('20 kΩ'))), cell('12 V'), 'Charging with a parallel resistor',
    'A 12 V battery in series with a 10 kΩ resistor and a 220 µF capacitor; a 20 kΩ resistor is connected in parallel with the capacitor.'))

# ── 23.6 ──
NW = 'Capacitor network'
F('A 2.0 µF and a 3.0 µF capacitor are in parallel, and the pair is in series with a 5.0 µF capacitor', lambda s: network(
    Series(Par(C_('2.0 µF'), C_('3.0 µF')), C_('5.0 µF')), NW, 'Between A and B: a 2.0 µF and a 3.0 µF capacitor in parallel, in series with a 5.0 µF capacitor.'))
F('A branch of two 4.0 µF capacitors in series has a 2.0 µF capacitor connected across it', lambda s: network(
    Par(Series(C_('4.0 µF'), C_('4.0 µF')), C_('2.0 µF')), NW, 'Between A and B: two 4.0 µF capacitors in series, with a 2.0 µF capacitor connected across the pair.'))
F('Three 3.0 µF capacitors are connected so that two are in series and that pair is in parallel with the third', lambda s: network(
    Par(Series(C_('3.0 µF'), C_('3.0 µF')), C_('3.0 µF')), NW, 'Between A and B: two 3.0 µF capacitors in series, in parallel with a third 3.0 µF capacitor.'))
F('A network has two 10 µF capacitors in parallel with each other, and also in parallel with a branch', lambda s: network(
    Par(C_('10 µF'), C_('10 µF'), Series(C_('10 µF'), C_('10 µF'))), NW, 'Between A and B: two 10 µF capacitors in parallel, also in parallel with a branch of two 10 µF capacitors in series.'))
F('Two 1.0 µF capacitors in parallel are connected in series with another two 1.0 µF capacitors in parallel', lambda s: network(
    Series(Par(C_('1.0 µF'), C_('1.0 µF')), Par(C_('1.0 µF'), C_('1.0 µF'))), NW, 'Between A and B: two 1.0 µF capacitors in parallel, in series with another two 1.0 µF capacitors in parallel.'))
F('A 6.0 µF capacitor is in series with a parallel pair made of a 2.0 µF and a 4.0 µF capacitor', lambda s: network(
    Series(C_('6.0 µF'), Par(C_('2.0 µF'), C_('4.0 µF'))), NW, 'Between A and B: a 6.0 µF capacitor in series with a 2.0 µF and a 4.0 µF capacitor in parallel.'))
F('Four 8.0 µF capacitors are arranged as two series pairs, and the pairs are connected side by side', lambda s: network(
    Par(Series(C_('8.0 µF'), C_('8.0 µF')), Series(C_('8.0 µF'), C_('8.0 µF'))), NW, 'Between A and B: two series pairs of 8.0 µF capacitors connected in parallel.'))
F('A 2.0 µF and a 4.0 µF capacitor in parallel are connected in series with a 3.0 µF capacitor across 12 V', lambda s: circuit(
    Series(Par(C_('2.0 µF'), C_('4.0 µF')), C_('3.0 µF')), cell('12 V'), NW, 'A 2.0 µF and a 4.0 µF capacitor in parallel, in series with a 3.0 µF capacitor, across 12 V.'))
F('In a network, a 2.0 µF and a 4.0 µF capacitor are in parallel, and the pair is in series with a 3.0 µF capacitor across 12 V', lambda s: circuit(
    Series(Par(C_('2.0 µF'), C_('4.0 µF')), C_('3.0 µF')), cell('12 V'), NW, 'A 2.0 µF and a 4.0 µF capacitor in parallel, in series with a 3.0 µF capacitor, across 12 V; the 3.0 µF capacitor has 8.0 V across it.'))
F('A branch of a 6.0 µF capacitor in series with a 3.0 µF capacitor is connected in parallel with a 4.0 µF capacitor', lambda s: circuit(
    Par(Series(C_('6.0 µF'), C_('3.0 µF')), C_('4.0 µF')), cell('9.0 V'), NW, 'A 6.0 µF capacitor in series with a 3.0 µF capacitor, in parallel with a 4.0 µF capacitor, across a 9.0 V supply.'))
F('An unknown capacitor X is in series with a 6.0 µF capacitor, and a 2.0 µF capacitor is connected in parallel', lambda s: network(
    Par(Series(C_('X'), C_('6.0 µF')), C_('2.0 µF')), NW, 'Between A and B: an unknown capacitor X in series with a 6.0 µF capacitor, with a 2.0 µF capacitor in parallel with the pair; the combined capacitance is 5.0 µF.'))
F('A 3.0 µF capacitor is in series with a parallel pair of two 3.0 µF capacitors, across 12 V', lambda s: circuit(
    Series(C_('3.0 µF'), Par(C_('3.0 µF'), C_('3.0 µF'))), cell('12 V'), NW, 'A 3.0 µF capacitor in series with two 3.0 µF capacitors in parallel, across 12 V.'))
F('A 2.0 µF capacitor is in series with a parallel pair made of a 6.0 µF and a 4.0 µF capacitor. Which capacitor', lambda s: network(
    Series(C_('2.0 µF'), Par(C_('6.0 µF'), C_('4.0 µF'))), NW, 'Between A and B: a 2.0 µF capacitor in series with a 6.0 µF and a 4.0 µF capacitor in parallel.'))
F('Two 10 µF capacitors in series are connected in parallel with another two 10 µF capacitors in series, and the network is connected across 20 V', lambda s: circuit(
    Par(Series(C_('10 µF'), C_('10 µF')), Series(C_('10 µF'), C_('10 µF'))), cell('20 V'), NW, 'Two series pairs of 10 µF capacitors connected in parallel across 20 V.'))
F('Two 1.0 µF capacitors in series are connected in parallel with a 1.0 µF capacitor, and this combination is in series with a 1.5 µF', lambda s: network(
    Series(Par(Series(C_('1.0 µF'), C_('1.0 µF')), C_('1.0 µF')), C_('1.5 µF')), NW, 'Between A and B: two 1.0 µF capacitors in series, in parallel with a 1.0 µF capacitor, all in series with a 1.5 µF capacitor.'))
F('A 4.0 µF capacitor C₁ is in series with a parallel pair C₂ = 2.0 µF and C₃ = 2.0 µF, across a 12 V supply', lambda s: circuit(
    Series(C_('C₁ = 4.0 µF'), Par(C_('C₂ = 2.0 µF'), C_('C₃ = 2.0 µF'))), cell('12 V'), NW, 'C₁ = 4.0 µF in series with C₂ = 2.0 µF and C₃ = 2.0 µF in parallel, across a 12 V supply.'))
F('A 3.0 µF capacitor is in series with a parallel pair of a 6.0 µF and a 3.0 µF capacitor, across 24 V. Calculate the p.d.', lambda s: circuit(
    Series(C_('3.0 µF'), Par(C_('6.0 µF'), C_('3.0 µF'))), cell('24 V'), NW, 'A 3.0 µF capacitor in series with a 6.0 µF and a 3.0 µF capacitor in parallel, across 24 V.'))
F('A 3.0 µF capacitor is in series with a parallel pair of a 6.0 µF and a 3.0 µF capacitor, across 24 V; the series', lambda s: circuit(
    Series(C_('3.0 µF'), Par(C_('6.0 µF'), C_('3.0 µF'))), cell('24 V'), NW, 'A 3.0 µF capacitor in series with a 6.0 µF and a 3.0 µF capacitor in parallel, across 24 V; the series 3.0 µF capacitor has 18 V across it.'))
F('A 5.0 µF capacitor is connected in parallel with a branch of two 10 µF capacitors in series, across 15 V', lambda s: circuit(
    Par(C_('5.0 µF'), Series(C_('10 µF'), C_('10 µF'))), cell('15 V'), NW, 'A 5.0 µF capacitor in parallel with two 10 µF capacitors in series, across 15 V.'))
F('In a network, C₁ = 2.0 µF and C₂ = 3.0 µF are in parallel; this pair is in series with C₃ = 10 µF', lambda s: circuit(
    Par(Series(Par(C_('C₁ = 2.0 µF'), C_('C₂ = 3.0 µF')), C_('C₃ = 10 µF')), C_('C₄ = 1.0 µF')), cell('12 V'), NW,
    'C₁ = 2.0 µF and C₂ = 3.0 µF in parallel, in series with C₃ = 10 µF; the whole branch is in parallel with C₄ = 1.0 µF, across 12 V.'))
F('A 12 µF capacitor is in series with a parallel pair of an 8.0 µF and a 4.0 µF capacitor, across 20 V', lambda s: circuit(
    Series(C_('12 µF'), Par(C_('8.0 µF'), C_('4.0 µF'))), cell('20 V'), NW, 'A 12 µF capacitor in series with an 8.0 µF and a 4.0 µF capacitor in parallel, across 20 V.'))
F('A 4.0 µF capacitor C₁ is charged to 12 V and disconnected. It is then connected across a series pair', lambda s: loop(
    Series(C_('C₁ = 4.0 µF, 12 V'), El('switch')), Series(C_('C₂ = 6.0 µF'), C_('C₃ = 3.0 µF')),
    'Charge sharing with a series pair', 'C₁ = 4.0 µF, charged to 12 V, is connected through a switch across a series pair of uncharged capacitors C₂ = 6.0 µF and C₃ = 3.0 µF.'))
F('A 3.0 µF capacitor C₁ is in series with a parallel pair of a 2.0 µF capacitor C₂ and an unknown capacitor C₃', lambda s: circuit(
    Series(C_('C₁ = 3.0 µF'), Par(C_('C₂ = 2.0 µF'), C_('C₃'))), cell('10 V'), NW, 'C₁ = 3.0 µF in series with C₂ = 2.0 µF and an unknown C₃ in parallel, across a 10 V supply; C₁ has 6.0 V across it.'))
F('In a network, C₁ = 6.0 µF is in series with C₂ = 3.0 µF; this pair is in parallel with C₃ = 4.0 µF', lambda s: circuit(
    Series(Par(Series(C_('C₁ = 6.0 µF'), C_('C₂ = 3.0 µF')), C_('C₃ = 4.0 µF')), C_('C₄ = 12 µF')), cell('24 V'), NW,
    'C₁ = 6.0 µF in series with C₂ = 3.0 µF; this pair in parallel with C₃ = 4.0 µF; the block in series with C₄ = 12 µF, across a 24 V supply.'))

# ── 23.7 ──
F('The resistance through which a capacitor discharges is increased. What happens?', lambda s: circuit(
    Series(C_(None), El('switch')), R_(None), 'Discharge circuit', 'A charged capacitor connected through a switch across a resistor.'))
F('A 470 µF capacitor charged to 9.0 V discharges through a 10 kΩ resistor', lambda s: disch(
    s, 9.0, 470e-6 * 10e3, 'Discharge curve', 'Graph of p.d. against time for a 470 µF capacitor discharging from 9.0 V through 10 kΩ (time constant 4.7 s). A dashed line marks t = 3.0 s.',
    vl=[(3.0, 't = 3.0 s', True)], t_end=15, xticks=[0, 3, 6, 9, 12, 15]))
F('A capacitor discharges from 12 V through a resistor with a time constant of 2.2 s', lambda s: disch(
    s, 12, 2.2, 'Discharge curve', 'Graph of p.d. against time for a capacitor discharging from 12 V with a time constant of 2.2 s.', t_end=10))
F('A 100 µF capacitor discharges through a resistor. Its p.d. falls from 10 V to 5.0 V in 6.9 s', lambda s: disch(
    s, 10, 6.9 / log(2), 'Discharge curve', 'Graph of p.d. against time for a 100 µF capacitor discharging from 10 V; the p.d. reaches 5.0 V at 6.9 s (dashed lines).',
    hl=[(5.0, '5.0 V', True)], vl=[(6.9, '6.9 s', True)], t_end=28))
F('The initial discharge current of a capacitor is 2.0 mA and the time constant is 4.0 s', lambda s: disch(
    s, 2.0, 4.0, 'Discharge current', 'Graph of discharge current against time: it falls exponentially from 2.0 mA with a time constant of 4.0 s. A dashed line marks t = 5.0 s.',
    vl=[(5.0, 't = 5.0 s', True)], t_end=16, ylabel='I / mA'))
F('A graph of ln(V/V) against t for a discharging capacitor has a gradient of −0.25 s⁻¹', lambda s: plot(
    't / s', 'ln(V/V)', [dict(x=[0, 8], y=[2.2, 2.2 - grab(s, r'gradient of −([\d.]+)') * 8])], 'ln V against time',
    'Graph of ln(V/V) against time for a discharging capacitor: a straight line with a gradient of −0.25 s⁻¹.', xr=(0, 8.5), yr=(0, 2.5),
    xticks=[0, 2, 4, 6, 8], yticks=[0, 0.5, 1.0, 1.5, 2.0], notes=[(4, 1.2, 'gradient −0.25 s⁻¹', 'start', 10, -8, True)]))
F('A high-resistance digital voltmeter (10 MΩ) is connected across a charged 1.0 µF capacitor', lambda s: network(
    Par(C_('1.0 µF'), El('V', '10 MΩ voltmeter')), 'Voltmeter across a capacitor', 'A charged 1.0 µF capacitor with a 10 MΩ digital voltmeter connected across it.'))
F('A capacitor discharges through a 100 kΩ resistor. The p.d. is recorded: t/s = 0, 10, 20, 30, 40', lambda s: table_plot(
    ['t / s', 'V / V'], table_rows_from_stem(s, ['t/s', 'V/V'])[1], 'Discharge readings',
    'Table and graph of p.d. against time for a capacitor discharging through 100 kΩ: t = 0, 10, 20, 30, 40 s give V = 12.0, 7.3, 4.4, 2.7, 1.6 V, an exponential decay.',
    dict(xlabel='t / s', ylabel='V / V', series=[dict(x=numbers_after(s, 't/s'), y=numbers_after(s, 'V/V'), kind='points')],
         xr=(0, 44), yr=(0, 13), xticks=[0, 10, 20, 30, 40], yticks=[0, 4, 8, 12], h=250)))
F('The p.d. across a 470 µF capacitor discharging through a resistor halves every 3.5 s', lambda s: plot(
    't / s', 'V', [dict(x=wave_xy(lambda t: t, 0, 14)[0], y=[2 ** (-t / 3.5) for t in wave_xy(lambda t: t, 0, 14)[0]])],
    'Halving every 3.5 s', 'Graph of p.d. against time for a 470 µF capacitor: the p.d. falls from V₀ to V₀/2 at 3.5 s, V₀/4 at 7.0 s and V₀/8 at 10.5 s.',
    xr=(0, 14), yr=(0, 1.12), xticks=[0, 3.5, 7, 10.5, 14], ytl=[(0, '0'), (0.25, 'V₀/4'), (0.5, 'V₀/2'), (1, 'V₀')]))
F('A timer circuit switches a light off when the p.d. across a discharging 1000 µF capacitor falls from 9.0 V to 3.0 V', lambda s: disch(
    s, 9.0, 60 / log(3), 'Timer discharge', 'Graph of p.d. against time for the 1000 µF timer capacitor discharging from 9.0 V; the light switches off when the p.d. reaches 3.0 V, after the 60 s delay.',
    hl=[(3.0, '3.0 V', True)], vl=[(60, '60 s', True)], t_end=120, xticks=[0, 20, 40, 60, 80, 100, 120]))
F('A 100 µF capacitor charged to 10 V discharges through a 20 kΩ resistor for 2.0 s', lambda s: plot(
    't / s', 'V / V', [dict(x=wave_xy(lambda t: t, 0, 5)[0], y=[10 * exp(-min(t, 2.0) / 2.0) * exp(-max(t - 2.0, 0) / 0.5) for t in wave_xy(lambda t: t, 0, 5)[0]])],
    'Two-stage discharge', 'Graph of p.d. against time: the 100 µF capacitor discharges from 10 V through 20 kΩ (RC = 2.0 s) until 2.0 s, then much faster through 5.0 kΩ (RC = 0.5 s).',
    xr=(0, 5), yr=(0, 11), vlines=[(2.0, 'switch to 5.0 kΩ', True)], xticks=[0, 1, 2, 3, 4, 5]))
F('A capacitor initially charged to 9.0 V discharges through a resistor. The current is 0.50 mA at the start', lambda s: disch(
    s, 0.50, 20 / log(0.50 / 0.18), 'Discharge current', 'Graph of discharge current against time: 0.50 mA at the start, falling exponentially to 0.18 mA after 20 s.',
    hl=[(0.18, '0.18 mA', True)], vl=[(20, '20 s', True)], t_end=60, ylabel='I / mA', xticks=[0, 10, 20, 30, 40, 50, 60]))
F('A 470 µF capacitor charged to 12 V discharges through a 1.0 kΩ resistor', lambda s: disch(
    s, 12, 0.47, 'Discharge curve', 'Graph of p.d. against time for a 470 µF capacitor discharging from 12 V through 1.0 kΩ (time constant 0.47 s).', t_end=2.0))
F('A student measures the time t½ for the p.d. across a capacitor to fall from 10 V to 5.0 V using different resistors', lambda s: table_plot(
    ['R / kΩ', 't½ / s'], table_rows_from_stem(s, ['R/kΩ', 't½/s'])[1], 'Half-time against resistance',
    'Table and graph of the time for the p.d. to halve against resistance: R = 10, 20, 30, 40 kΩ give t½ = 0.70, 1.38, 2.08, 2.77 s, a straight line through the origin.',
    dict(xlabel='R / kΩ', ylabel='t½ / s', series=[dict(x=numbers_after(s, 'R/kΩ'), y=numbers_after(s, 't½/s'), kind='points')],
         xr=(0, 44), yr=(0, 3.1), xticks=[0, 10, 20, 30, 40], yticks=[0, 1, 2, 3], h=250)))
F('In a pacemaker, a 2.0 µF capacitor charged to 5.0 V discharges through heart tissue of resistance 500 Ω', lambda s: plot(
    't / ms', 'V / V', [dict(x=wave_xy(lambda t: t, 0, 4)[0], y=[5.0 * exp(-t / (2.0e-6 * 500 * 1e3)) for t in wave_xy(lambda t: t, 0, 4)[0]])],
    'Pacemaker pulse', 'Graph of p.d. against time in ms for a 2.0 µF capacitor discharging from 5.0 V through 500 Ω (time constant 1.0 ms); the pulse ends when the p.d. reaches 1.0 V (dashed line).',
    xr=(0, 4), yr=(0, 5.6), hlines=[(1.0, '1.0 V', True)], xticks=[0, 1, 2, 3, 4]))
