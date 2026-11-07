# Figures for ch28a.py (Chapter 28 quantum physics, 28.1 to 28.6). Numbers come from the stems.
H_LEVELS = [('n = 1', -13.6), ('n = 2', -3.40), ('n = 3', -1.51), ('n = 4', -0.85), ('n = 5', -0.54)]


def hyd(s, upto=5, arrows=(), title='Hydrogen energy levels', desc=''):
    """Hydrogen levels n = 1..upto; a level's value is printed only if the stem quotes it."""
    lv = []
    for name, v in H_LEVELS[:upto]:
        t = f'{MINUS}{abs(v):.2f}'.replace('13.60', '13.6')
        lab = f'{t} eV' if t in s else None
        lv.append((name, lab, v))
    return energy_levels(lv, title, desc, transitions=[(i, j, None, False) for i, j in arrows], h=280)


def levels_from(s, title, desc, names=None, arrows=()):
    """An atom's levels read from the stem (all values in eV, written −x.x eV)."""
    vals = [float(v) for v in re.findall(r'−(\d+\.\d+) eV', s)]
    seen = []
    for v in vals:
        if v not in seen:
            seen.append(v)
    seen.sort(reverse=True)            # most negative (ground) first
    lv = [((names[i] if names else ''), f'{MINUS}{v:.1f} eV', -v) for i, v in enumerate(seen)]
    return energy_levels(lv, title, desc, transitions=[(i, j, None, False) for i, j in arrows], h=260)


# ── 28.3 ──
F('In a photocell the current stops increasing once the anode is made sufficiently positive', lambda s: (lambda Vs, Is: plot(
    'V / V', 'I (arbitrary units)', [dict(x=[-Vs - 0.6, -Vs, -Vs + 0.5, 0, 0.6, 1.5, 3.0], y=[0, 0, 0.55 * Is, 0.85 * Is, 0.97 * Is, Is, Is])], 'Photocell characteristic',
    'Graph of photocurrent I against anode potential V for a photocell: zero below the stopping potential, rising through V = 0 and levelling off at a saturation current for positive V.',
    xr=(-2.5, 3.0), yr=(0, 1.2), xticks=[-2, -1, 0, 1, 2, 3], yticks=[0, 0.5, 1.0], notes=[(1.6, 1.08, 'saturation current', 'start', 0, 0, False)], vlines=[(-Vs, '−Vₛ', False)]))(1.4, 1.0))
F('A 1.0 mW beam of ultraviolet light of wavelength 300 nm falls on a photocell', lambda s: photocell(
    'Photocell circuit', 'A vacuum photocell lit by a 1.0 mW ultraviolet beam of wavelength 300 nm. The curved cathode and the rod anode are connected through a microammeter to a cell that makes the anode positive.',
    light_label='300 nm, 1.0 mW'))
F('Light of wavelength 400 nm and power 5.0 mW falls on a sodium cathode', lambda s: photocell(
    'Sodium photocell', 'A photocell with a sodium cathode lit by light of wavelength 400 nm and power 5.0 mW; the anode is held positive by a cell and the photocurrent is read on a microammeter.',
    light_label='400 nm, 5.0 mW'))
F('With light of wavelength 400 nm the stopping potential for a surface is 1.05 V', lambda s: photocell(
    'Measuring the stopping potential', 'A photocell connected to a variable supply that makes the anode negative, in series with a sensitive meter; the supply is raised until the current just falls to zero.',
    meter='', reverse=True, light_label='400 nm or 500 nm', supply_label='variable'))
F('A student measures Ek(max) = 0.40 eV for light of 6.0 × 10¹⁴ Hz', lambda s: plot(
    'f / 10¹⁴ Hz', 'Ek(max) / eV', [dict(x=[6.0, 8.0], y=[grab(s, r'Ek\(max\) = ([\d.]+) eV for light of 6'), grab(s, r'Ek\(max\) = ([\d.]+) eV for light of 8')], kind='points'),
                                    dict(x=[6.0, 8.0], y=[grab(s, r'Ek\(max\) = ([\d.]+) eV for light of 6'), grab(s, r'Ek\(max\) = ([\d.]+) eV for light of 8')], color=MUT, dash='4 3')],
    'Two measurements', 'Graph of maximum kinetic energy against frequency with two measured points, (6.0 × 10¹⁴ Hz, 0.40 eV) and (8.0 × 10¹⁴ Hz, 1.23 eV), joined by a straight line.',
    xr=(0, 9), yr=(0, 1.6), xticks=[0, 2, 4, 6, 8], yticks=[0, 0.4, 0.8, 1.2, 1.6]))
F('A student measures the maximum kinetic energy of photoelectrons for four frequencies', lambda s: (lambda f, E: table_plot(
    ['f / 10¹⁴ Hz'] + [f'{x:.1f}' for x in f], [['Ek(max) / eV'] + [f'{y:.2f}' for y in E]], 'Photoelectron energies',
    'Table and graph of the maximum kinetic energy of the photoelectrons against the frequency of the light: four points lying on a straight line.',
    dict(xlabel='f / 10¹⁴ Hz', ylabel='Ek(max) / eV', series=[dict(x=f, y=E, kind='points')], xr=(5, 10), yr=(0, 1.6),
         xticks=[5, 6, 7, 8, 9, 10], yticks=[0, 0.4, 0.8, 1.2, 1.6], h=240)))(
    [float(x) for x in re.search(r'f = ([\d., ]+) × 10¹⁴', s).group(1).split(',')],
    [float(x) for x in re.search(r'Ek\(max\) = ([\d., ]+) eV', s).group(1).split(',')]))

# ── 28.4 ──
F('The table gives the work functions of five metals', lambda s: (lambda rows: table(
    ['metal', 'work function / eV'], [[m.capitalize(), v] for m, v in rows], 'Work functions',
    'Table of work functions: caesium 2.1 eV, potassium 2.3 eV, sodium 2.4 eV, calcium 2.9 eV and zinc 4.3 eV.', w=360))(
    re.findall(r'([A-Za-z]+) (\d\.\d) eV', s.split('wavelength 450 nm')[1])))
F('The graph shows the maximum kinetic energy of photoelectrons against frequency for a metal', lambda s: (lambda f0: plot(
    'f / 10¹⁴ Hz', 'Ek(max) / eV', [dict(x=[f0, 10.0], y=[0, 6.63e-34 * (10.0 - f0) * 1e14 / 1.60e-19])], 'Ek(max) against frequency',
    'Graph of maximum kinetic energy against frequency for a metal: a straight line rising from the frequency axis at 5.6 × 10¹⁴ Hz.',
    xr=(0, 10.5), yr=(0, 2.0), xticks=[0, 2, 4, 6, 8, 10], yticks=[0, 0.5, 1.0, 1.5, 2.0], vlines=[(f0, '5.6', False)]))(
    grab(s, r'axis at ([\d.]+) × 10¹⁴')))
F('For a metal, Ek(max) = 0.80 eV with light of 7.5 × 10¹⁴ Hz and 1.84 eV', lambda s: plot(
    'f / 10¹⁴ Hz', 'Ek(max) / eV', [dict(x=[7.5, 10.0], y=[grab(s, r'= ([\d.]+) eV with light of 7'), grab(s, r'and ([\d.]+) eV with light')], kind='points')],
    'Two measurements', 'Graph of maximum kinetic energy against frequency with two measured points: 0.80 eV at 7.5 × 10¹⁴ Hz and 1.84 eV at 1.00 × 10¹⁵ Hz.',
    xr=(0, 11), yr=(0, 2.0), xticks=[0, 2, 4, 6, 8, 10], yticks=[0, 0.5, 1.0, 1.5, 2.0]))
F('A graph of stopping potential against frequency has a gradient of 4.1 × 10⁻¹⁵ V s', lambda s: (lambda k, f0: plot(
    'f / 10¹⁴ Hz', 'Vₛ / V', [dict(x=[f0, 10.0], y=[0, k * (10.0 - f0) * 1e14])], 'Stopping potential against frequency',
    'Graph of stopping potential against frequency: a straight line of gradient 4.1 × 10⁻¹⁵ V s meeting the frequency axis at 5.2 × 10¹⁴ Hz.',
    xr=(0, 10.5), yr=(0, 2.5), xticks=[0, 2, 4, 6, 8, 10], yticks=[0, 0.5, 1.0, 1.5, 2.0, 2.5], vlines=[(f0, '5.2', False)]))(
    grab(s, r'gradient of ([\d.]+ × 10⁻¹⁵)'), grab(s, r'axis at ([\d.]+) × 10¹⁴')))

# ── 28.5 ──
F('A beam of light strikes a mirror at 60° to the normal and reflects', lambda s: mirror_rays(
    'Reflection from a mirror', 'A light beam strikes a plane mirror at 60° to the normal and reflects at 60° on the other side of the normal.',
    grab(s, r'at (\d+)° to the normal'), '60°'))

# ── 28.6 ──
F('In a hydrogen atom an electron drops from the −1.51 eV level to the −3.40 eV level', lambda s: hyd(
    s, 4, [(2, 1)], desc='Energy level diagram for hydrogen (n = 1 to 4); an arrow shows the electron falling from the −1.51 eV level (n = 3) to the −3.40 eV level (n = 2).'))
F('A mercury atom has levels at −10.4 eV (ground state) and −5.5 eV', lambda s: levels_from(
    s, 'Two levels of mercury', 'Two energy levels of a mercury atom, the ground state at −10.4 eV and an excited level at −5.5 eV, with an arrow for the fall to the ground state.',
    names=['ground state', 'excited'], arrows=[(1, 0)]))
F('An atom has four energy levels. How many different photon energies can be emitted', lambda s: energy_levels(
    [('n = 1', None, -10), ('n = 2', None, -5), ('n = 3', None, -2.6), ('n = 4', None, -1.2)], 'Four energy levels',
    'Energy level diagram of an atom with four levels, n = 1 (ground state) to n = 4, with no transitions marked.', h=240))
F('An electron in a hydrogen atom falls from −0.85 eV to −1.51 eV', lambda s: hyd(
    s, 4, [(3, 2)], desc='Energy level diagram for hydrogen (n = 1 to 4); an arrow shows the electron falling from −0.85 eV (n = 4) to −1.51 eV (n = 3).'))
F('In hydrogen, an electron falls from the −0.54 eV level to the −3.40 eV level', lambda s: hyd(
    s, 5, [(4, 1)], desc='Energy level diagram for hydrogen (n = 1 to 5); an arrow shows the electron falling from −0.54 eV (n = 5) to −3.40 eV (n = 2).'))
F('A hydrogen atom in its ground state (−13.6 eV) absorbs a photon of 12.09 eV', lambda s: hyd(
    s, 4, [(0, 2)], desc='Energy level diagram for hydrogen (n = 1 to 4); an upward arrow shows the atom being excited from the ground state at −13.6 eV by absorbing a photon.'))
F('An electron with kinetic energy 12.5 eV collides with a hydrogen atom in its ground state', lambda s: hyd(
    s, 4, desc='Energy level diagram for hydrogen with levels at −13.6 eV (ground state), −3.40 eV, −1.51 eV and −0.85 eV.'))
F('An atom has energy levels at −8.0 eV, −4.0 eV, −2.5 eV and −1.0 eV', lambda s: levels_from(
    s, 'Energy levels of an atom', 'Energy level diagram of an atom with levels at −8.0 eV, −4.0 eV, −2.5 eV and −1.0 eV.'))
F('A simple model atom has only three levels, at −7.0 eV, −4.0 eV and −1.5 eV', lambda s: levels_from(
    s, 'A three-level atom', 'Energy level diagram of a model atom with three levels at −7.0 eV, −4.0 eV and −1.5 eV.'))
F('An electron with 6.0 eV of kinetic energy collides with a mercury atom in its ground state', lambda s: energy_levels(
    [('ground state', None, 0.0), ('first excited', '+4.9 eV', 4.9)], 'Mercury: first excitation',
    'Energy level diagram of mercury showing the ground state and the first excited state 4.9 eV above it, with an upward arrow for the excitation.',
    transitions=[(0, 1, None, False)], h=220))
F('Calculate (wavelength of the −1.51 → −3.40 eV line) ÷ (wavelength of the −0.85 → −3.40 eV line)', lambda s: hyd(
    s, 4, [(2, 1), (3, 1)], desc='Energy level diagram for hydrogen (n = 1 to 4) with two downward arrows ending on the −3.40 eV level: one from −1.51 eV and one from −0.85 eV.'))
F('A hydrogen atom is excited to the n = 3 level. How many different photon energies', lambda s: hyd(
    s, 3, desc='Energy level diagram for hydrogen showing the n = 1, n = 2 and n = 3 levels.'))
F('Two visible lines of hydrogen come from transitions to the −3.40 eV level', lambda s: hyd(
    s, 4, [(2, 1), (3, 1)], desc='Energy level diagram for hydrogen (n = 1 to 4) with the two transitions ending on −3.40 eV: from −1.51 eV and from −0.85 eV.'))
F('An atom has energy levels at −12.0 eV, −7.5 eV, −4.0 eV and −1.8 eV', lambda s: levels_from(
    s, 'Energy levels of an atom', 'Energy level diagram of an atom with levels at −12.0 eV, −7.5 eV, −4.0 eV and −1.8 eV.'))
F('Electrons accelerated through 11.0 V collide with hydrogen atoms in the ground state', lambda s: hyd(
    s, 3, desc='Energy level diagram for hydrogen showing the ground state at −13.6 eV and the levels at −3.40 eV and −1.51 eV.'))
F('Hydrogen atoms are excited to the −0.54 eV level (n = 5)', lambda s: hyd(
    s, 5, [(4, 0)], desc='Energy level diagram for hydrogen (n = 1 to 5) with an arrow from the −0.54 eV level (n = 5) down to the ground state.'))
F('In a helium–neon laser the light comes from a transition in neon', lambda s: energy_levels(
    [('ground state', None, 0.0), ('', '18.70 eV', 18.70), ('', '20.66 eV', 20.66)], 'Neon laser levels',
    'Energy level diagram for neon: the ground state and two excited levels at 18.70 eV and 20.66 eV above it, with the laser transition from 20.66 eV down to 18.70 eV.',
    transitions=[(2, 1, None, False)], h=240))
F('An atom has levels at −9.0 eV (ground), −5.2 eV and −3.1 eV', lambda s: levels_from(
    s, 'Energy levels of an atom', 'Energy level diagram of an atom with its ground state at −9.0 eV and excited levels at −5.2 eV and −3.1 eV.'))
