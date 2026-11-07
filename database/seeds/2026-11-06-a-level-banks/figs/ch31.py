# Figures for ch31.py (Chapter 31 astronomy and cosmology). Distances, luminosities, peak wavelengths and spectral
# lines come from the stems; black-body curves are computed from the Planck formula at the temperature that the
# stated peak wavelength gives (T = 2.90 × 10⁻³ m K ÷ λmax).
WIEN_ = 2.90e-3


def _T(nm):
    return WIEN_ / (nm * 1e-9)


def _earth(x=0):
    return dict(x=x, kind='earth', label='Earth', value=False)


# ── 31.1 ──
F('Calculate the total power passing through a sphere of radius 1.0 × 10¹⁸ m centred on the star', lambda s: point_source(
    'Sphere around a star', 'A star of luminosity 2.0 × 10³⁰ W radiating equally in all directions, with part of a sphere of radius 1.0 × 10¹⁸ m centred on it.',
    '1.0 × 10¹⁸ m', power_label='2.0 × 10³⁰ W'))
F('Two identical stars are at distances d and 2d from the Earth', lambda s: star_line(
    'Two identical stars', 'Two identical stars on the same line of sight from the Earth, at distances d and 2d.',
    [_earth(), dict(x=1, label='A', value=False), dict(x=2, label='B', value=False)], [(0, 1, 'd', False), (0, 2, '2d', None)]))
F('Two stars appear equally bright. Star X is 3.0 times further away than star Y', lambda s: star_line(
    'Two equally bright stars', 'Stars Y and X give the same flux at the Earth; Y is at distance d and X at 3.0d.',
    [_earth(), dict(x=1, label='Y', value=False), dict(x=3, label='X', value=False)], [(0, 1, 'd', False), (0, 2, '3.0d', None)]))
F('The flux intensity from a star falls from 6.4 × 10⁻⁹ W m⁻² to 1.6 × 10⁻⁹ W m⁻²', lambda s: star_line(
    'Flux at two points', 'A star and two points on the same line away from it: the flux is 6.4 × 10⁻⁹ W m⁻² at the nearer point and 1.6 × 10⁻⁹ W m⁻² at the further one. Not to scale.',
    [dict(x=0, label='star', value=False), dict(x=1, kind='planet', sub='6.4 × 10⁻⁹ W m⁻²'), dict(x=2.2, kind='planet', sub='1.6 × 10⁻⁹ W m⁻²')],
    [(0, 1, 'old distance', False), (0, 2, 'new distance', False)], h=214, note='not to scale'))
F('Sunlight at the top of the Earth\'s atmosphere has an intensity of 1.36 kW m⁻²', lambda s: star_line(
    'Sunlight at the Earth', 'The Sun and the Earth 1.50 × 10¹¹ m apart; the intensity at the top of the Earth\'s atmosphere is 1.36 kW m⁻².',
    [dict(x=0, kind='sun', label='Sun', value=False), dict(x=1.5, kind='earth', label='Earth', sub='1.36 kW m⁻²')], [(0, 1, '1.50 × 10¹¹ m', None)]))
F('A solar panel of area 2.0 m² on a probe near Mars', lambda s: star_line(
    'Probe near Mars', 'The Sun, of luminosity 3.8 × 10²⁶ W, and a probe near Mars 2.3 × 10¹¹ m away carrying a solar panel of area 2.0 m².',
    [dict(x=0, kind='sun', label='Sun', sub='3.8 × 10²⁶ W'), dict(x=2.3, kind='planet', label='probe', sub='panel 2.0 m²')], [(0, 1, '2.3 × 10¹¹ m', None)]))
F('Earth receives 1.36 kW m⁻² from the Sun at 1.50 × 10¹¹ m', lambda s: star_line(
    'Venus, Earth and Saturn', 'The Sun with Venus at 1.08 × 10¹¹ m, the Earth at 1.50 × 10¹¹ m and Saturn at 1.43 × 10¹² m; the Earth receives 1.36 kW m⁻². Not to scale.',
    [dict(x=0, kind='sun', label='Sun', value=False), dict(x=1.08, kind='planet', label='Venus', value=False),
     dict(x=1.5, kind='earth', label='Earth', sub='1.36 kW m⁻²'), dict(x=2.6, kind='planet', label='Saturn', value=False)],
    [(0, 1, '1.08 × 10¹¹ m', None), (0, 2, '1.50 × 10¹¹ m', None), (0, 3, '1.43 × 10¹² m', None)], w=500, h=250, note='not to scale'))
F('A lighthouse lamp radiates 2.0 kW equally in all directions', lambda s: point_source(
    'Lighthouse lamp', 'A lamp of power 2.0 kW radiating equally in all directions, with a detector 500 m away on a sphere centred on the lamp.',
    '500 m', power_label='2.0 kW'))

# ── 31.2 ──
F('Two stars have the same luminosity. Star P is 5.0 times further away than star Q', lambda s: star_line(
    'Two stars of equal luminosity', 'Stars Q and P have the same luminosity; Q is at distance d from the Earth and P at 5.0d. Not to scale.',
    [_earth(), dict(x=1, label='Q', value=False), dict(x=2.6, label='P', value=False)], [(0, 1, 'd', False), (0, 2, '5.0d', None)], note='not to scale'))
F('A lamp of power 60 W radiates equally in all directions', lambda s: point_source(
    'Lamp radiating in all directions', 'A 60 W lamp radiating equally in all directions, with a detector 2.0 m away on a sphere centred on the lamp.',
    '2.0 m', power_label='60 W'))
F('Star A has 100 times the luminosity of star B but appears equally bright', lambda s: star_line(
    'Equally bright stars', 'Star B of luminosity L and star A of luminosity 100L appear equally bright from the Earth. Not to scale.',
    [_earth(), dict(x=1, label='B', sub='L', value=False), dict(x=2.4, label='A', sub='100L')],
    [(0, 1, 'distance of B', False), (0, 2, 'distance of A', False)], note='not to scale'))
F('A star 2.0 × 10¹⁷ m away gives a flux of 8.0 × 10⁻⁹ W m⁻². Calculate the flux received from it at a planet', lambda s: star_line(
    'Star, planet and Earth', 'A star with a planet 5.0 × 10¹⁶ m from it and the Earth 2.0 × 10¹⁷ m from it; the flux at the Earth is 8.0 × 10⁻⁹ W m⁻².',
    [dict(x=0, label='star', value=False), dict(x=0.5, kind='planet', label='planet', value=False), dict(x=2.0, kind='earth', label='Earth', sub='8.0 × 10⁻⁹ W m⁻²')],
    [(0, 1, '5.0 × 10¹⁶ m', None), (0, 2, '2.0 × 10¹⁷ m', None)]))
F('Calculate the flux at Neptune, which is 30 times further from the Sun', lambda s: star_line(
    'Earth and Neptune', 'The Sun with the Earth at distance d, where the flux is 1.36 kW m⁻², and Neptune at 30d. Not to scale.',
    [dict(x=0, kind='sun', label='Sun', value=False), dict(x=1, kind='earth', label='Earth', sub='1.36 kW m⁻²'), dict(x=3.2, kind='planet', label='Neptune', value=False)],
    [(0, 1, 'd', False), (0, 2, '30d', None)], note='not to scale'))
F('Star P has 4 times the luminosity of star Q and is twice as far away', lambda s: star_line(
    'Stars P and Q', 'Star Q of luminosity L at distance d from the Earth, and star P of luminosity 4L at distance 2d.',
    [_earth(), dict(x=1, label='Q', sub='L', value=False), dict(x=2, label='P', sub='4L')], [(0, 1, 'd', False), (0, 2, '2d', False)]))
F('Calculate (flux from the Sun at Venus, 1.08 × 10¹¹ m) ÷ (flux at the Earth, 1.50 × 10¹¹ m)', lambda s: star_line(
    'Venus and the Earth', 'The Sun with Venus 1.08 × 10¹¹ m away and the Earth 1.50 × 10¹¹ m away, drawn to scale.',
    [dict(x=0, kind='sun', label='Sun', value=False), dict(x=1.08, kind='planet', label='Venus', value=False), dict(x=1.5, kind='earth', label='Earth', value=False)],
    [(0, 1, '1.08 × 10¹¹ m', None), (0, 2, '1.50 × 10¹¹ m', None)]))
F('A star is 15 light-years away and gives the same flux at the Earth as a star of luminosity 2.0 × 10²⁶ W', lambda s: star_line(
    'Two stars giving equal flux', 'A star of luminosity 2.0 × 10²⁶ W 5.0 light-years from the Earth and a second star 15 light-years away that gives the same flux.',
    [_earth(), dict(x=5, label='second', sub='2.0 × 10²⁶ W'), dict(x=15, label='first', sub='L = ?', value=False)],
    [(0, 1, '5.0 light-years', None), (0, 2, '15 light-years', None)]))
F('Show that a star of luminosity 4L at distance 3d gives a flux of 4F/9', lambda s: star_line(
    'Two stars', 'A star of luminosity L at distance d from the Earth giving flux F, and a star of luminosity 4L at distance 3d.',
    [_earth(), dict(x=1, sub='L', value=False), dict(x=3, sub='4L')], [(0, 1, 'd', False), (0, 2, '3d', None)]))

# ── 31.3 ──
F('Betelgeuse emits most strongly at a wavelength of 830 nm', lambda s: blackbody(
    'Spectrum of Betelgeuse', 'Black-body spectrum of Betelgeuse: relative intensity against wavelength from 0 to 2500 nm, peaking at 830 nm, with the visible band 400–700 nm shaded.',
    [(_T(830), None, None)], 2500, peaks=[(830, 'λmax = 830 nm', True)], xticks=[0, 500, 1000, 1500, 2000, 2500], visible=True))
F('A red dwarf emits most strongly at 1000 nm', lambda s: blackbody(
    'Spectrum of a red dwarf', 'Black-body spectrum of a red dwarf: relative intensity against wavelength from 0 to 3000 nm, peaking at 1000 nm, with the visible band shaded.',
    [(_T(1000), None, None)], 3000, peaks=[(1000, 'λmax = 1000 nm', True)], xticks=[0, 1000, 2000, 3000], visible=True))
F('A star\'s spectrum peaks at 290 nm. Calculate its surface temperature', lambda s: blackbody(
    'Spectrum of a hot star', 'Black-body spectrum of a star: relative intensity against wavelength from 0 to 1500 nm, peaking at 290 nm in the ultraviolet, with the visible band shaded.',
    [(_T(290), None, None)], 1500, peaks=[(290, 'λmax = 290 nm', True)], xticks=[0, 300, 600, 900, 1200, 1500], visible=True))
F('A star\'s spectrum peaks at 450 nm and its luminosity is 2.0 × 10²⁷ W', lambda s: blackbody(
    'Stellar spectrum', 'Black-body spectrum of a star: relative intensity against wavelength from 0 to 2000 nm, peaking at 450 nm.',
    [(_T(450), None, None)], 2000, peaks=[(450, 'λmax = 450 nm', True)], xticks=[0, 500, 1000, 1500, 2000]))
F('The Sun\'s spectrum peaks in the visible region, at about 500 nm', lambda s: blackbody(
    'Spectrum of the Sun', 'Black-body spectrum of the Sun: relative intensity against wavelength from 0 to 2000 nm, peaking at about 500 nm inside the shaded visible band (400–700 nm).',
    [(_T(500), None, None)], 2000, peaks=[(500, '500 nm', True)], xticks=[0, 500, 1000, 1500, 2000], visible=True))
F('A star\'s spectrum peaks at 380 nm', lambda s: blackbody(
    'Stellar spectrum', 'Black-body spectrum of a star: relative intensity against wavelength from 0 to 1500 nm, peaking at 380 nm.',
    [(_T(380), None, None)], 1500, peaks=[(380, 'λmax = 380 nm', True)], xticks=[0, 300, 600, 900, 1200, 1500]))
F('Sirius A has a luminosity of 9.7 × 10²⁷ W and its spectrum peaks at 290 nm', lambda s: blackbody(
    'Spectrum of Sirius A', 'Black-body spectrum of Sirius A: relative intensity against wavelength from 0 to 1500 nm, peaking at 290 nm, with the visible band shaded.',
    [(_T(290), None, None)], 1500, peaks=[(290, 'λmax = 290 nm', True)], xticks=[0, 300, 600, 900, 1200, 1500], visible=True))
F('and its spectrum peaks at 600 nm. (a) Calculate its luminosity', lambda s: blackbody(
    'Stellar spectrum', 'Black-body spectrum of a star: relative intensity against wavelength from 0 to 2500 nm, peaking at 600 nm.',
    [(_T(600), None, None)], 2500, peaks=[(600, 'λmax = 600 nm', True)], xticks=[0, 500, 1000, 1500, 2000, 2500]))
F('Two stars have the same luminosity. Star X has a peak wavelength of 400 nm and star Y one of 800 nm', lambda s: blackbody(
    'Two stars of equal luminosity', 'Spectra of stars X and Y, which have the same luminosity (equal areas under the curves): X peaks at 400 nm and Y, with the lower and broader curve, at 800 nm.',
    [(_T(400), 'X', False), (_T(800), 'Y', False)], 2500, peaks=[(400, '400 nm', True), (800, '800 nm', True)],
    xticks=[0, 500, 1000, 1500, 2000, 2500], equal_power=True))

# ── 31.4 ──
F('A spectral line of laboratory wavelength 656 nm is observed at 663 nm', lambda s: redshift_strips(
    'Redshifted line', 'A spectral line at 656 nm in the laboratory spectrum appears at 663 nm in the spectrum of a galaxy.',
    [(656, '656 nm')], [(663, '663 nm')], 620, 700, [620, 640, 660, 680, 700]))
F('A line with laboratory wavelength 500 nm is seen at 510 nm', lambda s: redshift_strips(
    'Shifted line', 'A line at 500 nm in the laboratory spectrum is seen at 510 nm in the observed spectrum.',
    [(500, '500 nm')], [(510, '510 nm')], 460, 540, [460, 480, 500, 520, 540], names=('laboratory', 'observed')))
F('A line of laboratory wavelength 393 nm is observed at 405 nm from a galaxy', lambda s: redshift_strips(
    'Redshifted line', 'A line at 393 nm in the laboratory spectrum appears at 405 nm in the spectrum of a galaxy.',
    [(393, '393 nm')], [(405, '405 nm')], 360, 440, [360, 380, 400, 420, 440]))
F('A calcium line at 397 nm is observed at 401 nm from a galaxy', lambda s: redshift_strips(
    'Redshifted calcium line', 'A calcium line at 397 nm in the laboratory spectrum appears at 401 nm in the spectrum of a galaxy.',
    [(397, '397 nm')], [(401, '401 nm')], 380, 420, [380, 390, 400, 410, 420]))
F('Light from a galaxy contains a hydrogen line at 691 nm; the laboratory wavelength is 656 nm', lambda s: redshift_strips(
    'Redshifted hydrogen line', 'A hydrogen line at 656 nm in the laboratory spectrum appears at 691 nm in the spectrum of a galaxy.',
    [(656, '656 nm')], [(691, '691 nm')], 620, 720, [620, 640, 660, 680, 700, 720]))
F('A galaxy\'s light shows a line at 518.0 nm whose laboratory wavelength is 486.1 nm', lambda s: redshift_strips(
    'Redshifted line', 'A line at 486.1 nm in the laboratory spectrum appears at 518.0 nm in the spectrum of a galaxy.',
    [(486.1, '486.1 nm')], [(518.0, '518.0 nm')], 460, 540, [460, 480, 500, 520, 540]))
F('Three galaxies have distances 2.0, 4.0 and 6.0 × 10²⁴ m', lambda s: plot(
    'distance d / 10²⁴ m', 'recession speed v / 10⁶ m s⁻¹',
    [dict(x=[grab(s, r'distances ([\d.]+),'), grab(s, r'distances [\d.]+, ([\d.]+) and'), grab(s, r'and ([\d.]+) × 10²⁴ m')],
          y=[grab(s, r'speeds ([\d.]+),'), grab(s, r'speeds [\d.]+, ([\d.]+) and'), grab(s, r'and ([\d.]+) × 10⁶ m s⁻¹')], kind='points')],
    'Hubble graph data', 'Recession speed against distance for three galaxies: (2.0, 4.4), (4.0, 9.0) and (6.0, 13.6), with d in units of 10²⁴ m and v in units of 10⁶ m s⁻¹.',
    xr=(0, 7), yr=(0, 16), xticks=[0, 1, 2, 3, 4, 5, 6, 7], yticks=[0, 4, 8, 12, 16]))
F('A galaxy has a recession speed of 2.0 × 10⁷ m s⁻¹ and a distance of 9.0 × 10²⁴ m', lambda s: plot(
    'distance d / 10²⁴ m', 'recession speed v / 10⁷ m s⁻¹',
    [dict(x=[0, 10], y=[0, 10 * 2.0 / 9.0], color=MUT, dash='6 4', lw='thin'),
     dict(x=[0, 9.0], y=[2.0, 2.0], color=MUT, dash='3 3', lw='thin'), dict(x=[9.0, 9.0], y=[0, 2.0], color=MUT, dash='3 3', lw='thin'),
     dict(x=[9.0], y=[2.0], kind='points')],
    'Galaxy on a Hubble graph', 'A galaxy plotted at distance 9.0 × 10²⁴ m and recession speed 2.0 × 10⁷ m s⁻¹, on a line through the origin.',
    xr=(0, 10), yr=(0, 2.5), xticks=[0, 2, 4, 6, 8, 10], yticks=[0, 0.5, 1.0, 1.5, 2.0, 2.5]))
F('A galaxy 200 Mpc away recedes at 1.4 × 10⁴ km s⁻¹', lambda s: plot(
    'distance d / Mpc', 'recession speed v / 10³ km s⁻¹',
    [dict(x=[0, 250], y=[0, 250 * 14 / 200], color=MUT, dash='6 4', lw='thin'),
     dict(x=[0, 200], y=[14, 14], color=MUT, dash='3 3', lw='thin'), dict(x=[200, 200], y=[0, 14], color=MUT, dash='3 3', lw='thin'),
     dict(x=[200], y=[14], kind='points')],
    'Galaxy on a Hubble graph', 'A galaxy plotted at distance 200 Mpc and recession speed 1.4 × 10⁴ km s⁻¹, on a line through the origin.',
    xr=(0, 250), yr=(0, 20), xticks=[0, 50, 100, 150, 200, 250], yticks=[0, 5, 10, 15, 20]))
F('The cosmic microwave background peaks at a wavelength of 1.06 mm', lambda s: blackbody(
    'Cosmic microwave background', 'Black-body spectrum of the cosmic microwave background: relative intensity against wavelength from 0 to 5 mm, peaking at 1.06 mm.',
    [(WIEN_ / 1.06e-3, None, None)], 5, unit='mm', peaks=[(1.06, 'λmax = 1.06 mm', True)], xticks=[0, 1, 2, 3, 4, 5]))
F('Galaxy X shows Δλ/λ = 0.020 and galaxy Y shows Δλ/λ = 0.050', lambda s: star_line(
    'Two galaxies in one direction', 'Galaxies X (Δλ/λ = 0.020) and Y (Δλ/λ = 0.050) lie in the same direction from the Earth; the distance between them is to be found.',
    [_earth(), dict(x=2, kind='galaxy', label='X', sub='Δλ/λ = 0.020'), dict(x=5, kind='galaxy', label='Y', sub='Δλ/λ = 0.050')],
    [(1, 2, 'distance between them', False)]))
