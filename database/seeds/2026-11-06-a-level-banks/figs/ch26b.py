# Figures for ch26b.py (26.4 Lenz's law, 26.5 everyday examples). Numbers come from the stems.

# ── 26.4 ──
F('The north pole of a magnet is pulled away from a coil. What pole forms', lambda s: magnet_coil(
    'Magnet pulled away from a coil', 'A bar magnet with its north pole nearest a coil is pulled away from the coil; the coil is connected to a galvanometer.',
    near='N', motion='away'))
F('A student pushes a magnet 15 cm into a coil against an average magnetic repulsion of 0.20 N', lambda s: magnet_coil(
    'Pushing a magnet into a coil', 'A bar magnet is pushed towards and 15 cm into a coil connected to a galvanometer, against an average repulsive force of 0.20 N.',
    near='N', motion='towards', motion_label='push against 0.20 N', dist_label='15 cm'))
F('An aluminium ring rests on top of a coil wound round a vertical iron core', lambda s: jumping_ring(
    'Jumping ring', 'An aluminium ring rests around a vertical iron core above a coil wound on the core. The coil is connected to a supply through a switch, which is open.',
    supply='ac', switch='open'))
F('The north pole of a magnet is pushed towards the end of a coil. Looking at that end from the magnet', lambda s: magnet_coil(
    'Magnet pushed towards a coil', 'A bar magnet with its north pole nearest the coil is pushed towards the end of a coil connected to a galvanometer.',
    near='N', motion='towards'))
F('A rod 0.20 m long moves at 4.0 m s⁻¹ across a 0.50 T field on rails joined by a 0.10 Ω resistor', lambda s: rails(
    'Magnetic braking', 'Top view: a 0.20 m rod moving at 4.0 m s⁻¹ along rails joined by a 0.10 Ω resistor, in a uniform 0.50 T field into the page. The braking force F opposes the motion.',
    L_label='0.20 m', v_label='4.0 m s⁻¹', B_label='B = 0.50 T into the page', R_label='0.10 Ω', force_label='F'))
F('A magnet of mass 0.020 kg falls down a vertical copper tube at a steady terminal speed', lambda s: falling_magnet(
    'Magnet in a copper tube', 'A magnet of mass 0.020 kg falling down a vertical copper tube at a steady terminal speed of 0.050 m s⁻¹.',
    container='tube', v_label='0.050 m s⁻¹'))
F('A magnet is dropped through a coil connected to a resistor. How does its acceleration compare with g', lambda s: falling_magnet(
    'Magnet falling through a coil', 'A bar magnet falls, north pole first, towards a coil whose ends are connected to a resistor.',
    container='coil', meter='R'))
F('A rod is pushed at 2.0 m s⁻¹ across a 0.30 T field. The rod is 0.50 m long and the circuit resistance is 1.5 Ω', lambda s: rails(
    'Rod on rails', 'Top view: a 0.50 m rod pushed at 2.0 m s⁻¹ along rails across a uniform 0.30 T field into the page; the circuit resistance is 1.5 Ω.',
    L_label='0.50 m', v_label='2.0 m s⁻¹', B_label='B = 0.30 T into the page', R_label='1.5 Ω'))
F('The south pole of a magnet is pulled away from the end of a coil', lambda s: magnet_coil(
    'Magnet pulled away from a coil', 'A bar magnet with its south pole nearest a coil is pulled away from the coil, which is connected to a galvanometer.',
    near='S', motion='away'))
F('A switch in the primary circuit of two coils on an iron core is closed', lambda s: two_coils(
    'Two coils on an iron core', 'Two coils on an iron core. The primary is connected to a cell through a switch that is about to be closed; the secondary is connected to a galvanometer.',
    left=dict(kind='cell'), right=dict(kind='G'), switch='open'))
F('A 0.050 kg magnet falls 0.80 m from rest through a coil and reaches 3.6 m s⁻¹', lambda s: falling_magnet(
    'Magnet falling through a coil', 'A 0.050 kg magnet is released from rest 0.80 m above a coil connected to a galvanometer and falls through it.',
    container='coil', drop_label='0.80 m'))
F('An aluminium ring with a narrow cut in it is placed on a coil that is switched on', lambda s: jumping_ring(
    'Ring with a cut', 'An aluminium ring with a narrow cut in it rests around a vertical iron core above a coil, which is connected to a supply through a switch.',
    cut=True, supply='ac', switch='open'))
F('A loop of resistance 0.25 Ω must carry 0.80 A. It is a 0.20 m rod sliding on rails in a 0.50 T field', lambda s: rails(
    'Rod on rails', 'Top view: a 0.20 m rod sliding along rails in a uniform 0.50 T field into the page; the loop resistance is 0.25 Ω and the current must be 0.80 A.',
    L_label='0.20 m', v_label='v', B_label='B = 0.50 T into the page', R_label='0.25 Ω'))
F('A magnet is pulled away from a coil connected in a closed circuit', lambda s: magnet_coil(
    'Magnet pulled away from a coil', 'A bar magnet is pulled away from a coil that is part of a closed circuit with a galvanometer.',
    near='N', motion='away'))
F('A metal rod 0.20 m long rests across horizontal rails joined by a 0.10 Ω resistor. A uniform field of 0.50 T points vertically downwards', lambda s: rails(
    'Rod pushed east', 'Top view with north up the page: a 0.20 m rod across rails joined by a 0.10 Ω resistor; a 0.50 T field points vertically downwards (into the page) and the rod is pushed east at 4.0 m s⁻¹.',
    L_label='0.20 m', v_label='4.0 m s⁻¹ east', B_label='B = 0.50 T downwards (into the page)', R_label='0.10 Ω', north=True))
F('A strong magnet of mass 0.040 kg falls down a vertical copper tube', lambda s: falling_magnet(
    'Magnet in a copper tube', 'A strong magnet of mass 0.040 kg falling down a vertical copper tube; a magnetic drag force F = kv acts upwards on it.',
    container='tube'))
F('A coil is pulled at a steady 0.50 m s⁻¹ out of a magnetic field against a magnetic force of 0.040 N', lambda s: loop_region(
    'Coil pulled out of a field', 'Top view: a coil partly inside a region of uniform magnetic field into the page, pulled out at a steady 0.50 m s⁻¹ against a magnetic force of 0.040 N over 0.10 m.',
    inside=0.4, motion='out', v_label='0.50 m s⁻¹'))
F('A rectangular loop of mass 0.010 kg and resistance 0.020 Ω falls vertically', lambda s: loop_region(
    'Loop falling into a field', 'A rectangular loop falling vertically with its plane at right angles to a horizontal 0.50 T field (into the page). Its 0.10 m lower side is inside the field region; its upper side is outside.',
    vertical=True, side_label='0.10 m', B_label='B = 0.50 T into the page'))
F('A long solenoid has 2000 turns per metre, and its current increases at 10 A s⁻¹', lambda s: solenoid_coil(
    'Coil inside a solenoid', 'A long solenoid with 2000 turns per metre whose current increases at 10 A s⁻¹; a 20-turn coil of area 1.0 × 10⁻³ m² and resistance 0.50 Ω sits inside, face-on to the field.',
    sol_label='solenoid: 2000 turns per metre, current rising at 10 A s⁻¹', coil_label='20-turn coil, area 1.0 × 10⁻³ m², 0.50 Ω', inside=True))

# ── 26.5 ──
def xf(title, desc, vp=None, np_=None, ns_=None, load='R', load_label=None, value=None):
    return two_coils(title, desc, left=dict(kind='ac', label=vp), right=dict(kind=load, label=load_label, value=value),
                     np_label=np_, ns_label=ns_)


F('A transformer has 1200 turns on its primary and 60 on its secondary', lambda s: xf(
    'Step-down transformer', 'A transformer: 1200 primary turns connected to a 240 V a.c. supply, and 60 secondary turns connected to a load.',
    '240 V a.c.', 'Nₚ = 1200', 'Nₛ = 60'))
F('A phone charger transformer steps 230 V down to 5.0 V', lambda s: xf(
    'Charger transformer', 'A transformer with a 230 V a.c. supply across the primary and an output of 5.0 V across the secondary.',
    '230 V', 'primary', 'secondary', load_label='5.0 V'))
F('An ideal transformer draws 0.10 A from a 230 V supply and gives 11.5 V at its secondary', lambda s: xf(
    'Ideal transformer', 'An ideal transformer drawing 0.10 A from a 230 V supply; the secondary gives 11.5 V across a load.',
    '230 V', 'primary: 0.10 A', 'secondary', load_label='11.5 V'))
F('A transformer has three times as many turns on its secondary as on its primary', lambda s: two_coils(
    'Step-up transformer', 'A transformer whose secondary has three times as many turns (3N) as its primary (N); the primary voltage is 12 V.',
    left=dict(kind='ac', label='12 V'), right=dict(kind='R'), np_label='N turns', ns_label='3N turns', ns_value=False))
F('10 MW is transmitted along a line of resistance 5.0 Ω at 25 kV', lambda s: circuit(
    Series(El('R', 'line 5.0 Ω'), El('R', 'consumers', value=False)), El('ac', '25 kV'),
    'Transmission line', 'Circuit: a 25 kV supply sending 10 MW through a transmission line of resistance 5.0 Ω to the consumers.'))
F('A transformer is 90 % efficient. It takes 0.50 A from a 230 V supply and gives 12 V', lambda s: xf(
    'Transformer', 'A transformer, 90 % efficient, taking 0.50 A from a 230 V supply; its secondary gives 12 V to a load.',
    '230 V', 'primary: 0.50 A', 'secondary', load_label='12 V'))
F('Which change would increase the output voltage of a transformer?', lambda s: xf(
    'Transformer', 'A transformer: an a.c. supply across the primary coil and a load across the secondary coil, both wound on an iron core.',
    None, 'primary', 'secondary'))
F('A doorbell transformer steps 230 V down to 8.0 V. Its primary has 2300 turns', lambda s: xf(
    'Doorbell transformer', 'A transformer with 2300 primary turns connected to 230 V; the secondary gives 8.0 V to a doorbell.',
    '230 V', 'Nₚ = 2300', 'Nₛ = ?', load_label='8.0 V'))
F('A workshop draws 50 kW at 230 V through cables of total resistance 0.40 Ω', lambda s: circuit(
    Series(El('R', 'cables 0.40 Ω'), El('R', 'workshop 50 kW')), El('ac', '230 V'),
    'Workshop supply', 'Circuit: a 230 V supply feeding a workshop that draws 50 kW, through cables of total resistance 0.40 Ω.'))
F('An ideal transformer has Nₛ/Nₚ = 1/20 and draws 0.15 A at its primary', lambda s: xf(
    'Step-down transformer', 'An ideal step-down transformer with Nₛ/Nₚ = 1/20 and a primary current of 0.15 A.',
    '0.15 A', 'primary', 'secondary'))
F('A power station generates 20 MW at 25 kV. A transformer steps this up to 400 kV', lambda s: blocks(
    [['power station', '20 MW at 25 kV'], ['step-up', 'transformer'], ['line', '400 kV, 10 Ω'], ['consumers']],
    'Power transmission', 'Block diagram: a power station generating 20 MW at 25 kV feeds a step-up transformer to 400 kV, which feeds a 10 Ω transmission line to the consumers.'))
F('A transformer with 4000 primary turns and 200 secondary turns is connected to 230 V', lambda s: xf(
    'Transformer and lamp', 'A transformer with 4000 primary turns connected to 230 V and 200 secondary turns connected to a 23 W lamp.',
    '230 V', 'Nₚ = 4000', 'Nₛ = 200', load='lamp', load_label='23 W'))
