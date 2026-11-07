# Figures for ch29a.py (Chapter 29 nuclear physics, 29.1 to 29.4). Numbers come from the stems.

# ── 29.1 ──
F('Thorium-232 (proton number 90) decays to lead-208 (proton number 82) through a series', lambda s: nz_chart(
    'Thorium-232 to lead-208', 'Chart of proton number against neutron number marking thorium-232 (142 neutrons, 90 protons) and lead-208 (126 neutrons, 82 protons), the start and end of the decay series.',
    [(232 - 90, 90, 'Th-232'), (208 - 82, 82, 'Pb-208')], (120, 150), (80, 94), [120, 125, 130, 135, 140, 145, 150], [80, 82, 84, 86, 88, 90, 92, 94]))
F('Uranium-238 (proton number 92) decays to stable lead-206 (proton number 82)', lambda s: nz_chart(
    'Uranium-238 to lead-206', 'Chart of proton number against neutron number marking uranium-238 (146 neutrons, 92 protons) and lead-206 (124 neutrons, 82 protons).',
    [(238 - 92, 92, 'U-238'), (206 - 82, 82, 'Pb-206')], (120, 150), (80, 94), [120, 125, 130, 135, 140, 145, 150], [80, 82, 84, 86, 88, 90, 92, 94]))
F('Uranium-235 (proton number 92) decays to lead-207 (proton number 82)', lambda s: nz_chart(
    'Uranium-235 to lead-207', 'Chart of proton number against neutron number marking uranium-235 (143 neutrons, 92 protons) and lead-207 (125 neutrons, 82 protons).',
    [(235 - 92, 92, 'U-235'), (207 - 82, 82, 'Pb-207')], (120, 150), (80, 94), [120, 125, 130, 135, 140, 145, 150], [80, 82, 84, 86, 88, 90, 92, 94]))

# ── 29.3 ──
F('An α-particle (4 u) leaves a nucleus at rest with a speed of 1.5 × 10⁷ m s⁻¹', lambda s: decay_recoil(
    'Recoil in α decay', 'Before: a nucleus at rest. After: the daughter nucleus of mass 222 u recoils with unknown speed v while the α-particle of mass 4 u moves the other way at 1.5 × 10⁷ m s⁻¹.',
    left='daughter, 222 u', right='α, 4 u', v_left='v = ?', v_right='1.5 × 10⁷ m s⁻¹'))
F('Americium-241 at rest decays to neptunium-237 by α emission', lambda s: decay_recoil(
    'Americium-241 decay', 'Before: americium-241 at rest. After: the neptunium-237 nucleus and the α-particle move apart in opposite directions.',
    left='neptunium-237', right='α-particle', parent='americium-241 at rest'))
F('Polonium-212 at rest decays to lead-208, emitting an α-particle of kinetic energy 6.0 MeV', lambda s: decay_recoil(
    'Polonium-212 decay', 'Before: polonium-212 at rest. After: the lead-208 nucleus recoils while the α-particle moves off with 6.0 MeV of kinetic energy.',
    left='lead-208', right='α-particle', parent='polonium-212 at rest', v_right='6.0 MeV'))
F('Carbon-14 β decay releases 0.156 MeV', lambda s: (lambda Q: plot(
    'kinetic energy / MeV', 'number of β-particles (relative)', [dict(x=[Q * i / 60 for i in range(61)], y=[(lambda x: sqrt(x + 0.02) * (1 - x) ** 2 * 3.1)(i / 60) for i in range(61)])],
    'β-particle energy spectrum', 'Graph of the relative number of β-particles from carbon-14 against their kinetic energy: a continuous curve from zero up to a maximum of 0.156 MeV.',
    xr=(0, 0.18), yr=(0, 1.2), xticks=[0, 0.05, 0.10, 0.15], yticks=[0, 0.5, 1.0], vlines=[(Q, '0.156', True)]))(grab(s, r'releases ([\d.]+) MeV')))

# ── 29.4 ──
F('From the binding energy per nucleon curve, which process can release energy?', lambda s: be_curve(
    'Binding energy per nucleon', 'Graph of binding energy per nucleon against nucleon number: it rises steeply for light nuclei, peaks at about 8.8 MeV near A = 56 and falls slowly to about 7.6 MeV for the heaviest nuclei.'))
F('Uranium-236 (binding energy 7.6 MeV per nucleon) splits into barium-141', lambda s: be_curve(
    'Fission on the binding energy curve', 'Binding energy per nucleon curve with three points marked: uranium-236 at 7.6 MeV, barium-141 at 8.3 MeV and krypton-92 at 8.7 MeV.',
    marks=[(236, 7.6, 'U-236: 7.6', True), (141, 8.3, 'Ba-141: 8.3', True), (92, 8.7, 'Kr-92: 8.7', True)]))
F('In one fission, uranium-236 (binding energy 7.59 MeV per nucleon) splits into xenon-140', lambda s: be_curve(
    'Fission fragments', 'Binding energy per nucleon curve with uranium-236 (7.59 MeV), xenon-140 (8.29 MeV) and strontium-94 (8.59 MeV) marked.',
    marks=[(236, 7.59, 'U-236: 7.59', True), (140, 8.29, 'Xe-140: 8.29', True), (94, 8.59, 'Sr-94: 8.59', True)]))
F('Iron-56 has a binding energy of 492 MeV and uranium-238 one of 1802 MeV', lambda s: be_curve(
    'Iron and uranium', 'Binding energy per nucleon curve with iron-56 near the peak and uranium-238 at the heavy end marked.',
    marks=[(56, _be_per_nucleon(56), 'Fe-56', False), (238, _be_per_nucleon(238), 'U-238', False)]))
F('Two deuterium nuclei (binding energy 2.22 MeV each) fuse to form helium-4', lambda s: be_curve(
    'Fusion on the binding energy curve', 'Binding energy per nucleon curve with hydrogen-2 (deuterium) near the bottom left and helium-4 much higher, showing that fusing deuterium into helium releases energy.',
    marks=[(2, 1.11, 'H-2', False), (4, 7.07, 'He-4', False)]))
