# Figures for ch25a.py (25.1–25.3 charged particles in fields). Numbers come from the stems.
E_, MP, ME = 1.60e-19, 1.67e-27, 9.11e-31

# ── 25.1 ──
F('A proton moves at 4.0 × 10⁵ m s⁻¹ at 60° to a magnetic field of 0.25 T', lambda s: rod_angle(
    'Proton at an angle to the field', 'Horizontal field lines of flux density 0.25 T across the page; a proton moves at 4.0 × 10⁵ m s⁻¹ in a direction at 60° to the field lines.',
    grab(s, r'at (\d+)° to'), '60°', v_label='v = 4.0 × 10⁵ m s⁻¹', B_label='B = 0.25 T', body='proton'))
F('A proton moves due east through a magnetic field that points vertically upwards', lambda s: particle_field(
    'Proton in a vertical field', 'Top view with north up the page: a proton moving due east (to the right) through a uniform magnetic field pointing vertically upwards, out of the page.',
    into=False, v_dir=0, sign='+', north=True, B_label='B upwards (out of the page)'))
F('With speed 5.0 × 10⁶ m s⁻¹, an electron crosses a 0.10 T field at 40° to the field lines', lambda s: rod_angle(
    'Electron at an angle to the field', 'Horizontal field lines of flux density 0.10 T; an electron moves at 5.0 × 10⁶ m s⁻¹ at 40° to the field lines.',
    grab(s, r'at (\d+)° to'), '40°', v_label='v = 5.0 × 10⁶ m s⁻¹', B_label='B = 0.10 T', body='electron'))
F('An electron moves due north in a magnetic field that points vertically downwards', lambda s: particle_field(
    'Electron in a vertical field', 'Top view with north up the page: an electron moving due north through a uniform magnetic field pointing vertically downwards, into the page.',
    into=True, v_dir=90, sign=MINUS, north=True, B_label='B downwards (into the page)'))
F('An electron moves at 2.0 × 10⁶ m s⁻¹ at 30° to a uniform field of 5.0 mT', lambda s: rod_angle(
    'Electron at an angle to the field', 'Horizontal field lines of flux density 5.0 mT; an electron moves at 2.0 × 10⁶ m s⁻¹ at 30° to the field lines.',
    grab(s, r'at (\d+)° to'), '30°', v_label='v = 2.0 × 10⁶ m s⁻¹', B_label='B = 5.0 mT', body='electron'))
F('Sea water flows at 2.0 m s⁻¹ along a horizontal channel 0.20 m wide', lambda s: hall_slab(
    'Sea water in a field', 'Top view of a horizontal channel 0.20 m wide in which sea water flows at 2.0 m s⁻¹, at right angles to a vertical 0.50 T field (into the page). A voltmeter is connected across the width of the channel.',
    I_label='flow 2.0 m s⁻¹', width_label='0.20 m', B_label='B = 0.50 T (vertical)'))
F('The magnetic force on electrons of fixed speed in a 0.10 T field is measured for different angles', lambda s: table_plot(
    ['θ / °', 'F / 10⁻¹⁴ N'], table_rows_from_stem(s, ['θ/°', 'F/10⁻¹⁴ N'])[1], 'Force against angle',
    'Table and graph of the magnetic force F (in units of 10⁻¹⁴ N) against the angle θ between velocity and field: θ = 0, 30, 60, 90° give F = 0, 2.4, 4.2, 4.8, plotted as points.',
    dict(xlabel='θ / °', ylabel='F / 10⁻¹⁴ N', series=[dict(x=numbers_after(s, 'θ/°'), y=numbers_after(s, 'F/10⁻¹⁴ N'), kind='points')],
         xr=(0, 100), yr=(0, 5.5), xticks=[0, 30, 60, 90], yticks=[0, 1, 2, 3, 4, 5], h=250)))
F('In a mass spectrometer, a singly charged ion of mass 4.0 × 10⁻²⁶ kg moves at 1.0 × 10⁵ m s⁻¹', lambda s: semicircles(
    'Mass spectrometer', 'A singly charged ion of mass 4.0 × 10⁻²⁶ kg enters a uniform 0.10 T field (out of the page) through a slit at 1.0 × 10⁵ m s⁻¹ and travels a semicircle to the detector.',
    [4.0e-26 * 1.0e5 / (E_ * 0.10)], entry_label='1.0 × 10⁵ m s⁻¹', B_label='B = 0.10 T'))

# ── 25.2 ──
F('Electrons accelerated from rest through 200 V enter a field of 1.0 mT at right angles', lambda s: circle_orbit(
    'Electron beam bent into a circle', 'Electrons accelerated through 200 V leave an electron gun and move in a circle in a uniform 1.0 mT field directed into the page.',
    into=True, clockwise=True, gun=True, B_label='B = 1.0 mT'))
F('Two singly charged isotopes, of masses m and 1.1m, enter the same magnetic field at the same speed', lambda s: semicircles(
    'Two isotopes', 'Two singly charged isotopes, of masses m and 1.1m, enter the same uniform field at the same speed and travel semicircles to a detector.',
    [1.0, 1.1], labels=['m', '1.1m']))
F('In a mass spectrometer, singly charged ions are accelerated from rest through 2000 V and enter a field of 0.20 T', lambda s: semicircles(
    'Mass spectrometer', 'Singly charged ions accelerated through 2000 V enter a uniform 0.20 T field (out of the page) and travel a semicircle of radius 0.144 m to the detector.',
    [grab(s, r'radius ([\d.]+) m')], labels=['r = 0.144 m'], acc_label='2000 V', B_label='B = 0.20 T'))
F('A cyclotron has dees of radius 0.50 m in a field of 1.5 T', lambda s: cyclotron(
    'Cyclotron', 'Top view of a cyclotron: two hollow D-shaped electrodes (dees) of radius 0.50 m with a gap between them, in a uniform 1.5 T field out of the page. An alternating p.d. across the gap accelerates protons along a spiral path.',
    R_label='0.50 m', B_label='B = 1.5 T'))
F('In a cloud chamber in a magnetic field, a charged particle\'s track is a spiral of decreasing radius', lambda s: spiral_track(
    'Spiral track', 'A charged particle track in a cloud chamber in a uniform field into the page: a spiral whose radius decreases as the particle moves.'))
F('Calculate the frequency of the alternating p.d. needed in a cyclotron to accelerate protons in a field of 1.2 T', lambda s: cyclotron(
    'Cyclotron', 'Top view of a cyclotron: two D-shaped dees with a gap between them in a uniform 1.2 T field out of the page, connected to an alternating supply; protons follow a spiral path.',
    B_label='B = 1.2 T'))
F('A uniform magnetic field points into the page. A particle moving across the page curves clockwise', lambda s: circle_orbit(
    'Curving path', 'A uniform field directed into the page; a charged particle moving across the page follows a clockwise circular path.',
    into=True, clockwise=True, full=False))
F('The direction of the magnetic field acting on a circling charged particle is reversed', lambda s: circle_orbit(
    'Circling particle', 'A charged particle moving clockwise in a circle in a uniform field directed into the page (before the field is reversed).',
    into=True, clockwise=True))
F('Singly charged magnesium ions of masses 3.98 × 10⁻²⁶ kg', lambda s: semicircles(
    'Magnesium isotopes', 'Singly charged ²⁴Mg⁺ and ²⁶Mg⁺ ions accelerated through 1000 V enter a uniform 0.25 T field and travel semicircles to a detector; the heavier ions travel the larger semicircle.',
    [sqrt(2 * m * 1000 / E_) / 0.25 for m in (3.98e-26, 4.32e-26)], labels=['²⁴Mg⁺', '²⁶Mg⁺'], acc_label='1000 V', B_label='B = 0.25 T'))
F('A cyclotron for protons has dees of radius 0.40 m in a field of 1.2 T', lambda s: cyclotron(
    'Cyclotron', 'Top view of a proton cyclotron: two D-shaped dees of radius 0.40 m in a 1.2 T field out of the page; each crossing of the gap adds 20 keV, and the protons spiral outwards.',
    R_label='0.40 m', B_label='B = 1.2 T', supply_label='20 keV per crossing'))
F('An electron track in a field of 2.0 mT has a radius of 5.0 cm at first and 3.0 cm later', lambda s: spiral_track(
    'Electron losing energy', 'An electron track in a uniform 2.0 mT field directed out of the page: a spiral whose radius shrinks from 5.0 cm at first to 3.0 cm later as the electron loses energy.',
    r_labels=['5.0 cm', '3.0 cm'], B_label='B = 2.0 mT', into=False))
F('Electrons moving at 2.0 × 10⁷ m s⁻¹ enter a region 2.0 cm wide containing a uniform field of 2.0 mT', lambda s: strip_arc(
    'Beam crossing a field region', 'Electrons moving at 2.0 × 10⁷ m s⁻¹ enter a region 2.0 cm wide containing a uniform 2.0 mT field at right angles to their motion; inside, they move on a circular arc and leave deflected.',
    grab(s, r'region ([\d.]+) cm'), ME * 2.0e7 / (E_ * 2.0e-3) * 100, width_label='2.0 cm', B_label='B = 2.0 mT', v_label='2.0 × 10⁷ m s⁻¹'))
F('In a fine-beam tube, electrons are accelerated through different p.d.s V and circle in a fixed field of 1.0 mT', lambda s: table_plot(
    ['V / V', 'r / cm'], table_rows_from_stem(s, ['V/V', 'r/cm'])[1], 'Radius against accelerating p.d.',
    'Table and graph of the radius of the electron circle against accelerating p.d. at 1.0 mT: V = 100, 200, 300, 400 V give r = 3.37, 4.77, 5.84, 6.74 cm, plotted as points on a rising curve.',
    dict(xlabel='V / V', ylabel='r / cm', series=[dict(x=numbers_after(s, 'V/V'), y=numbers_after(s, 'r/cm'), kind='points')],
         xr=(0, 420), yr=(0, 7.5), xticks=[0, 100, 200, 300, 400], yticks=[0, 2, 4, 6], h=250)))

# ── 25.3 ──
def sel(title, desc, **kw):
    return selector(title, desc, **kw)


F('Ions pass straight through crossed fields of 6.0 × 10⁴ V m⁻¹ and 0.020 T', lambda s: sel(
    'Velocity selector', 'Crossed fields: parallel plates give an electric field of 6.0 × 10⁴ V m⁻¹ down the page, and a 0.020 T magnetic field points into the page. Ions entering from the left pass straight through.',
    E_label='E = 6.0 × 10⁴ V m⁻¹', B_label='B = 0.020 T', particle='ions'))
F('In a velocity selector, what condition must be met for a charged particle to pass through undeflected?', lambda s: sel(
    'Velocity selector', 'A velocity selector: parallel plates (top positive) give an electric field down the page, and a uniform magnetic field points into the page. A particle enters from the left; the dashed line is the undeflected path.',
    particle='particle'))
F('A velocity selector uses an electric field of 2.0 × 10⁴ V m⁻¹ to select ions moving at 4.0 × 10⁵ m s⁻¹', lambda s: sel(
    'Velocity selector', 'A velocity selector: an electric field of 2.0 × 10⁴ V m⁻¹ between the plates and a magnetic field B into the page select ions moving at 4.0 × 10⁵ m s⁻¹.',
    E_label='E = 2.0 × 10⁴ V m⁻¹', B_label='B = ?', v_label='4.0 × 10⁵ m s⁻¹', particle='ions'))
F('In a velocity selector, how are particles slower than E/B deflected?', lambda s: sel(
    'Velocity selector', 'A velocity selector with the top plate positive and a magnetic field into the page; particles enter from the left.',
    particle='particles'))
F('Both the electric field and the magnetic field in a velocity selector are reversed', lambda s: sel(
    'Velocity selector', 'A velocity selector before the change: top plate positive (electric field down the page) and magnetic field into the page; particles of the selected speed pass straight through.',
    particle='particles'))
F('A velocity selector is set for positive ions. Negative ions of the same speed are sent through instead', lambda s: sel(
    'Velocity selector', 'A velocity selector set for positive ions: top plate positive and magnetic field into the page; positive ions of the selected speed pass straight through.',
    particle='positive ions'))
F('Calculate the p.d. needed across plates 8.0 mm apart so that a velocity selector with B = 0.040 T', lambda s: sel(
    'Velocity selector', 'A velocity selector with plates 8.0 mm apart and a magnetic field of 0.040 T into the page, selecting ions of speed 5.0 × 10⁵ m s⁻¹.',
    gap_label='8.0 mm', B_label='B = 0.040 T', v_label='5.0 × 10⁵ m s⁻¹', particle='ions'))
F('A velocity selector has plates 10 mm apart with a p.d. of 500 V and a magnetic field of 0.10 T', lambda s: sel(
    'Velocity selector', 'A velocity selector with plates 10 mm apart, a p.d. of 500 V between them and a magnetic field of 0.10 T into the page.',
    gap_label='10 mm', E_label='p.d. 500 V', B_label='B = 0.10 T', particle='ions'))
F('Electrons accelerated from rest through 2.0 kV enter crossed fields with B = 1.0 mT', lambda s: sel(
    'Crossed fields for electrons', 'Electrons accelerated through 2.0 kV enter crossed fields: plates 1.0 cm apart and a magnetic field of 1.0 mT. The top plate is positive and the magnetic field points into the page.',
    gap_label='1.0 cm', B_label='B = 1.0 mT', particle='electrons'))
F('A selector has E = 3.0 × 10⁴ V m⁻¹ and B = 0.10 T. A proton enters at 4.5 × 10⁵ m s⁻¹', lambda s: sel(
    'Velocity selector', 'A velocity selector with E = 3.0 × 10⁴ V m⁻¹ and B = 0.10 T into the page; a proton enters from the left at 4.5 × 10⁵ m s⁻¹.',
    E_label='E = 3.0 × 10⁴ V m⁻¹', B_label='B = 0.10 T', v_label='4.5 × 10⁵ m s⁻¹', particle='proton', paths=()))
F('In a mass spectrometer, ions selected at 2.0 × 10⁵ m s⁻¹ enter a second field of 0.50 T', lambda s: semicircles(
    'Mass spectrometer', 'Ions selected at 2.0 × 10⁵ m s⁻¹ enter a second uniform field of 0.50 T (out of the page) and travel a semicircle to the detector.',
    [3.9e-26 * 2.0e5 / (E_ * 0.50)], entry_label='2.0 × 10⁵ m s⁻¹', B_label='B = 0.50 T'))
F('In a Bainbridge mass spectrometer, a selector with E = 1.0 × 10⁴ V m⁻¹ and B₁ = 0.050 T', lambda s: semicircles(
    'Bainbridge mass spectrometer', 'Ions leaving a velocity selector (E = 1.0 × 10⁴ V m⁻¹, B₁ = 0.050 T) enter a field B₂ = 0.050 T and travel a semicircle of radius 0.083 m to the detector.',
    [grab(s, r'radius ([\d.]+) m')], labels=['r = 0.083 m'], entry_label='from the selector', B_label='B₂ = 0.050 T'))
F('An electron moving at 1.0 × 10⁷ m s⁻¹ passes between plates 4.0 cm long where the electric field is 2.0 × 10³ V m⁻¹', lambda s: plates(
    'Electron between plates', 'An electron moving at 1.0 × 10⁷ m s⁻¹ enters midway between parallel plates 4.0 cm long with a field of 2.0 × 10³ V m⁻¹; it is deflected towards the positive plate.',
    length_label='4.0 cm', labels=[(200, 20, 'E = 2.0 × 10³ V m⁻¹', 'middle', None)], beam=dict(path='up', label='1.0 × 10⁷ m s⁻¹', is_value=None)))
F('Calculate the magnetic flux density needed to cancel the deflection of an electron moving at 1.0 × 10⁷ m s⁻¹', lambda s: sel(
    'Cancelling the deflection', 'An electron moving at 1.0 × 10⁷ m s⁻¹ between plates giving an electric field of 2.0 × 10³ V m⁻¹; a magnetic field B between the plates cancels the deflection.',
    E_label='E = 2.0 × 10³ V m⁻¹', B_label='B = ?', v_label='1.0 × 10⁷ m s⁻¹', particle='electron'))
F('In a selector, the top plate is positive, so the electric field points down the page. Positive ions move from left to right', lambda s: plates(
    'Selector plates', 'Parallel plates with the top plate positive, so the electric field points down the page; positive ions enter from the left moving to the right. The magnetic field is not shown.',
    beam=dict(path='straight', label='positive ions', is_value=False)))
F('A selector uses B = 0.30 T and plates 2.0 cm apart', lambda s: sel(
    'Velocity selector', 'A velocity selector with plates 2.0 cm apart and a 0.30 T magnetic field into the page, selecting particles moving at 2.0 × 10⁵ m s⁻¹.',
    gap_label='2.0 cm', B_label='B = 0.30 T', v_label='2.0 × 10⁵ m s⁻¹', particle='particles'))
F('Electrons accelerated through 2.5 kV pass undeflected between plates 1.5 cm apart with a p.d. of 450 V', lambda s: sel(
    'Crossed fields', 'Electrons accelerated through 2.5 kV pass undeflected between plates 1.5 cm apart with a p.d. of 450 V, in a magnetic field of 1.0 mT.',
    gap_label='1.5 cm', E_label='p.d. 450 V', B_label='B = 1.0 mT', particle='electrons'))
F('Singly charged ²⁰Ne⁺ and ²²Ne⁺ ions', lambda s: semicircles(
    'Neon isotopes', 'Singly charged ²⁰Ne⁺ and ²²Ne⁺ ions leave a velocity selector (E = 2.0 × 10⁴ V m⁻¹, B₁ = 0.10 T) at the same speed and enter a field B₂ = 0.20 T, travelling semicircles to the detector.',
    [m * (2.0e4 / 0.10) / (E_ * 0.20) for m in (3.32e-26, 3.65e-26)], labels=['²⁰Ne⁺', '²²Ne⁺'], entry_label='from the selector', B_label='B₂ = 0.20 T'))
F('A velocity selector has E = 1.5 × 10⁴ V m⁻¹ and B = 0.050 T. A proton enters at 2.0 × 10⁵ m s⁻¹', lambda s: sel(
    'Velocity selector', 'A velocity selector with E = 1.5 × 10⁴ V m⁻¹ and B = 0.050 T into the page; a proton enters from the left at 2.0 × 10⁵ m s⁻¹.',
    E_label='E = 1.5 × 10⁴ V m⁻¹', B_label='B = 0.050 T', v_label='2.0 × 10⁵ m s⁻¹', particle='proton', paths=()))
F('Electrons moving at 2.4 × 10⁷ m s⁻¹ pass between plates 5.0 cm long where E = 1.2 × 10⁴ V m⁻¹', lambda s: plates(
    'Electrons between plates', 'Electrons moving at 2.4 × 10⁷ m s⁻¹ enter midway between plates 5.0 cm long with a field of 1.2 × 10⁴ V m⁻¹ and are deflected towards the positive plate.',
    length_label='5.0 cm', labels=[(200, 20, 'E = 1.2 × 10⁴ V m⁻¹', 'middle', None)], beam=dict(path='up', label='2.4 × 10⁷ m s⁻¹', is_value=None)))
F('Free electrons drift at 1.0 × 10⁻⁴ m s⁻¹ along a metal strip 1.0 cm wide', lambda s: hall_slab(
    'Metal strip in a field', 'Top view of a metal strip 1.0 cm wide carrying a current along its length, at right angles to a 0.50 T field into the page; the free electrons drift at 1.0 × 10⁻⁴ m s⁻¹ and a voltage develops across the width.',
    width_label='1.0 cm', B_label='B = 0.50 T', carriers='electron drift speed 1.0 × 10⁻⁴ m s⁻¹'))
F('For a beam of fixed speed, the electric field needed to cancel the magnetic deflection is measured', lambda s: table_plot(
    ['B / mT', 'E / 10⁴ V m⁻¹'], table_rows_from_stem(s, ['B/mT', 'E/10⁴ V m⁻¹'])[1], 'Balancing field against flux density',
    'Table and graph of the electric field needed to cancel the magnetic deflection against flux density: B = 0.50, 1.0, 1.5, 2.0 mT need E = 1.0, 2.0, 3.0, 4.0 × 10⁴ V m⁻¹, a straight line through the origin.',
    dict(xlabel='B / mT', ylabel='E / 10⁴ V m⁻¹', series=[dict(x=numbers_after(s, 'B/mT'), y=numbers_after(s, 'E/10⁴ V m⁻¹'), kind='points')],
         xr=(0, 2.2), yr=(0, 4.5), xticks=[0, 0.5, 1.0, 1.5, 2.0], yticks=[0, 1, 2, 3, 4], h=250)))
