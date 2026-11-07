# Figures for ch28b.py (Chapter 28 quantum physics, 28.7 to 28.11). Numbers come from the stems.
H_LEVELS = [('n = 1', -13.6), ('n = 2', -3.40), ('n = 3', -1.51), ('n = 4', -0.85), ('n = 5', -0.54)]


def hyd(s, upto=4, arrows=(), title='Hydrogen energy levels', desc=''):
    lv = []
    for name, v in H_LEVELS[:upto]:
        t = f'{MINUS}{abs(v):.2f}'.replace('13.60', '13.6')
        lv.append((name, f'{t} eV' if t in s else None, v))
    return energy_levels(lv, title, desc, transitions=[(i, j, None, False) for i, j in arrows], h=280)


def lpm_angle(s, lpm_pat, nm_pat, n=1):
    lpm = grab(s, lpm_pat)
    lam = grab(s, nm_pat) * 1e-9
    return degrees(asin(n * lam * lpm * 1e3))


# ── 28.7 ──
F('A diffraction grating with slit spacing 2.0 × 10⁻⁶ m is used to view the 589 nm line of sodium', lambda s: grating(
    'Viewing a line with a grating', 'Light of wavelength 589 nm falls normally on a grating of slit spacing 2.0 × 10⁻⁶ m; the first-order beams leave at an angle θ on each side of the straight-through beam.',
    [(1, degrees(asin(grab(s, r'(\d+) nm line') * 1e-9 / grab(s, r'spacing ([\d.]+ × 10⁻⁶) m'))))], spacing_label='d = 2.0 × 10⁻⁶ m', angle_mark=(1, 'θ')))
F('A grating with 600 lines per mm is used to view the red 656 nm line of hydrogen', lambda s: grating(
    'Hydrogen red line', 'Light of wavelength 656 nm falls normally on a grating with 600 lines per mm; first-order beams leave at angle θ.',
    [(1, lpm_angle(s, r'with (\d+) lines per mm', r'red (\d+) nm'))], spacing_label='600 lines per mm', angle_mark=(1, 'θ')))
F('A grating with 400 lines per mm is used to view the 486 nm and 656 nm lines of hydrogen', lambda s: spectrum_lines(
    'Two hydrogen lines', 'Spectrum strip from 400 nm to 700 nm showing the two hydrogen lines at 486 nm and 656 nm.',
    [(486, '486'), (656, '656')], 400, 700, [400, 500, 600, 700]))
F('The yellow sodium "line" is really two lines, at 589.0 nm and 589.6 nm', lambda s: spectrum_lines(
    'The sodium doublet', 'A magnified spectrum strip from 588.5 nm to 590.0 nm showing the two sodium lines at 589.0 nm and 589.6 nm.',
    [(589.0, '589.0'), (589.6, '589.6')], 588.5, 590.0, [(588.5, '588.5'), (589.0, '589.0'), (589.5, '589.5'), (590.0, '590.0')]))
F('A mercury lamp emits lines at 436 nm and 546 nm', lambda s: spectrum_lines(
    'Two mercury lines', 'Spectrum strip from 400 nm to 700 nm showing mercury lines at 436 nm and 546 nm.',
    [(436, '436'), (546, '546')], 400, 700, [400, 500, 600, 700]))
F('Electrons with 10.5 eV of kinetic energy collide with hydrogen atoms in the ground state', lambda s: hyd(
    s, 3, desc='Energy level diagram for hydrogen with levels at −13.6 eV (ground state), −3.40 eV and −1.51 eV.'))
F('A hydrogen atom in the −0.85 eV level returns to the ground state (−13.6 eV) in two steps', lambda s: hyd(
    s, 4, [(3, 1), (1, 0)], desc='Energy level diagram for hydrogen with two arrows: from −0.85 eV down to −3.40 eV, then from −3.40 eV down to the ground state at −13.6 eV.'))
F('A grating with 500 lines per mm shows an unknown yellow line in the second order at 36.2°', lambda s: grating(
    'Second-order line', 'A grating with 500 lines per mm; the unknown line appears in the second order at 36.2° to the straight-through beam (the first order lies between).',
    [(1, degrees(asin(sin(radians(grab(s, r'at ([\d.]+)°'))) / 2))), (2, grab(s, r'at ([\d.]+)°'))], spacing_label='500 lines per mm', angle_mark=(2, '36.2°')))
F('Hydrogen atoms are excited to the n = 3 level (−1.51 eV)', lambda s: hyd(
    s, 3, desc='Energy level diagram for hydrogen showing the n = 3 level at −1.51 eV, n = 2 at −3.40 eV and the ground state at −13.6 eV.'))
F('Electrons with 12.2 eV of kinetic energy pass through hydrogen gas in the ground state', lambda s: hyd(
    s, 4, desc='Energy level diagram for hydrogen with levels at −13.6 eV, −3.40 eV, −1.51 eV and −0.85 eV.'))
F('The 656 nm hydrogen line is seen in the first order at 23.2° with an unlabelled grating', lambda s: grating(
    'Measuring a grating', 'The 656 nm hydrogen line leaves the grating in the first order at 23.2° to the straight-through beam.',
    [(1, grab(s, r'at ([\d.]+)°'))], angle_mark=(1, '23.2°')))
F('An atom with three energy levels emits lines with photon energies of 1.5 eV, 2.5 eV and 4.0 eV', lambda s: energy_levels(
    [('ground state', '−6.0 eV', -6.0), ('', None, -3.5), ('', None, -2.0)], 'Three-level atom',
    'Energy level diagram of an atom with its ground state at −6.0 eV and two higher levels, with the three possible downward transitions marked.',
    transitions=[(2, 1, None, False), (1, 0, None, False), (2, 0, None, False)], h=250))
F('Light from a hydrogen lamp falls on a grating with 300 lines per mm', lambda s: grating(
    'Orders from a grating', 'The 656 nm hydrogen line falls on a grating with 300 lines per mm; the first three orders leave at increasing angles on each side.',
    [(n, degrees(asin(n * 656e-9 * 300e3))) for n in (1, 2, 3)], spacing_label='300 lines per mm', symmetric=False))

# ── 28.8 ──
F('A student finds the voltage V at which LEDs of different colours start to emit', lambda s: (lambda lam, V: table_plot(
    ['λ / nm'] + [f'{x:g}' for x in lam], [['V / V'] + [f'{y:.2f}' for y in V]], 'LED threshold voltages',
    'Table of LED wavelength and switch-on voltage, and a graph of V against 1/λ: the points lie on a straight line through the origin.',
    dict(xlabel='(1/λ) / 10⁶ m⁻¹', ylabel='V / V', series=[dict(x=[1e3 / x for x in lam], y=V, kind='points')], xr=(0, 2.5), yr=(0, 3.0),
         xticks=[0, 0.5, 1.0, 1.5, 2.0, 2.5], yticks=[0, 1, 2, 3], h=240)))(
    [float(x) for x in re.search(r'λ = ([\d, ]+) nm', s).group(1).split(',')],
    [float(x) for x in re.search(r'V = ([\d., ]+) V', s).group(1).split(',')]))

# ── 28.9 ──
F('Light of wavelength 600 nm passes through two slits 0.50 mm apart onto a screen 1.5 m away', lambda s: double_slit(
    'Two-slit experiment', 'Laser light of wavelength 600 nm passes through two slits 0.50 mm apart; bright fringes form on a screen 1.5 m away.',
    a_label='0.50 mm', D_label='1.5 m', x_label='x'))
F('Two slits 0.50 mm apart give fringes 2.4 mm apart on a screen 2.0 m away', lambda s: double_slit(
    'Two-slit fringes', 'Two slits 0.50 mm apart produce bright fringes 2.4 mm apart on a screen 2.0 m away.',
    a_label='0.50 mm', D_label='2.0 m', x_label='2.4 mm'))
F('Ten fringe spacings measure 12.0 mm on a screen 0.80 m from two slits 0.40 mm apart', lambda s: double_slit(
    'Measuring fringes', 'Two slits 0.40 mm apart and a screen 0.80 m away; ten fringe spacings on the screen measure 12.0 mm in total.',
    a_label='0.40 mm', D_label='0.80 m', x_label='x'))
F('Two slits 0.30 mm apart give fringes 2.1 mm apart on a screen 1.2 m away', lambda s: double_slit(
    'Two-slit fringes', 'Two slits 0.30 mm apart produce bright fringes 2.1 mm apart on a screen 1.2 m away.',
    a_label='0.30 mm', D_label='1.2 m', x_label='2.1 mm'))
F('Light of wavelength 550 nm falls on a grating with 300 lines per mm', lambda s: grating(
    'Grating with 300 lines per mm', 'Light of wavelength 550 nm falls normally on a grating with 300 lines per mm; the first-order beams leave at angle θ.',
    [(1, lpm_angle(s, r'with (\d+) lines per mm', r'wavelength (\d+) nm'))], spacing_label='300 lines per mm', angle_mark=(1, 'θ')))
F('The second-order image of a 546 nm mercury line is at 40.0° for a grating', lambda s: grating(
    'Second-order image', 'The 546 nm mercury line leaves a grating in the second order at 40.0° to the straight-through beam.',
    [(1, degrees(asin(sin(radians(40.0)) / 2))), (2, grab(s, r'at ([\d.]+)° for'))], angle_mark=(2, '40.0°')))
F('A grating with 600 lines per mm shows the sodium line in the second order at 45.0°', lambda s: grating(
    'Sodium line, second order', 'A grating with 600 lines per mm shows the sodium line in the second order at 45.0° to the straight-through beam.',
    [(1, degrees(asin(sin(radians(45.0)) / 2))), (2, grab(s, r'order at ([\d.]+)°'))], spacing_label='600 lines per mm', angle_mark=(2, '45.0°')))
F('A 60 W lamp gives out 3.0 W of visible light', lambda s: point_source(
    'Light spreading from a lamp', 'A lamp radiating 3.0 W of visible light equally in all directions; the light crosses a sphere of radius 2.0 m centred on the lamp.',
    '2.0 m', power_label='3.0 W visible'))

# ── 28.10 ──
F('In an electron diffraction tube a ring has a radius of 2.0 cm when the accelerating voltage is 2.0 kV', lambda s: diffraction_tube(
    'Electron diffraction tube', 'An electron diffraction tube: electrons from the gun, accelerated through 2.0 kV, pass through graphite and form rings on the screen; a ring has radius 2.0 cm.',
    V_label='2.0 kV', r_label='2.0 cm'))
F('In an electron diffraction tube, electrons are accelerated through 4.0 kV onto graphite', lambda s: diffraction_tube(
    'Electron diffraction tube', 'Electrons accelerated through 4.0 kV pass through graphite; the screen is 0.14 m beyond the graphite and shows rings of radius r.',
    V_label='4.0 kV', L_label='0.14 m', r_label='r'))
F('The accelerating voltage of an electron diffraction tube is raised from 10 kV to 25 kV', lambda s: diffraction_tube(
    'Changing the accelerating voltage', 'An electron diffraction tube; the accelerating voltage is raised from 10 kV to 25 kV and the rings on the screen are compared.',
    V_label='10 kV → 25 kV'))

# ── 28.11 ──
F('A 2.0 W source emits light of wavelength 600 nm equally in all directions', lambda s: point_source(
    'Photons spreading out', 'A 2.0 W source of 600 nm light radiating equally in all directions, and a sphere of radius 5.0 m around it.',
    '5.0 m', power_label='2.0 W'))
F('A detector of area 1.0 cm² is 3.0 m from a 5.0 W source of 590 nm light', lambda s: point_source(
    'Detector near a lamp', 'A detector of area 1.0 cm² placed 3.0 m from a 5.0 W source of 590 nm light that radiates equally in all directions.',
    '3.0 m', power_label='5.0 W', detector_label='1.0 cm²'))
