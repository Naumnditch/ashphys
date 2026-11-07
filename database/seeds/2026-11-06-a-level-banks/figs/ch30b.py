# Figures for ch30b.py (Chapter 30 medical physics, 30.5 to 30.8). Numbers come from the stems.

# ── 30.5 ──
F('What is the purpose of the backing block behind the piezoelectric crystal in a transducer?', lambda s: transducer(
    'Ultrasound transducer', 'Cross-section of an ultrasound transducer: a piezoelectric crystal between electrodes, a backing block behind it, a matching layer in front, and the pulse leaving the face.'))
F('How does a piezoelectric crystal produce ultrasound?', lambda s: transducer(
    'Ultrasound transducer', 'Cross-section of an ultrasound transducer showing the piezoelectric crystal, its electrodes and leads, the backing block and the matching layer.'))
F('A crystal resonates when its thickness is half a wavelength', lambda s: transducer(
    'Transducer crystal', 'Cross-section of an ultrasound transducer; the thickness of the piezoelectric crystal sets its resonant frequency.'))

# ── 30.6 ──
F('A ship\'s sonar pulse returns from the sea bed after 0.40 s', lambda s: sonar(
    'Echo sounding', 'A ship sends a sonar pulse straight down to the sea bed; the echo returns 0.40 s later.', labels=[(140, 'echo after 0.40 s')]))
F('A ship sends a sonar pulse; the echo from a shoal returns after 0.18 s', lambda s: sonar(
    'Shoal and sea bed', 'A ship\'s sonar pulse gives an echo from a shoal of fish after 0.18 s and from the sea bed after 0.52 s.',
    labels=[(110, 'shoal: 0.18 s'), (190, 'sea bed: 0.52 s')]))
F('An echo sounder on a boat sends pulses straight down', lambda s: sonar(
    'Echo sounding from a boat', 'A boat sends sonar pulses straight down to the sea bed; the echo time grows from 0.030 s to 0.090 s as the boat moves into deeper water.',
    labels=[(140, '0.030 s, then 0.090 s')]))
F('The A-scan shows echoes from the front and back of an organ at 40 µs and 105 µs', lambda s: ascan(
    'A-scan of an organ', 'A-scan trace of echo amplitude against time: the transmitted pulse at 0 and echoes from the front and back of an organ at 40 µs and 105 µs.',
    [(0, 1.0), (grab(s, r'at (\d+) µs and'), 0.55), (grab(s, r'and (\d+) µs after'), 0.35)], 140, [0, 20, 40, 60, 80, 100, 120, 140]))
F('The time base of an A-scan display is 20 µs per division', lambda s: ascan(
    'A-scan trace', 'A-scan trace with a time base of 20 µs per division: the transmitted pulse at 0 and an echo 3.5 divisions later.',
    [(0, 1.0), (grab(s, r'echo is ([\d.]+) divisions'), 0.5)], 6, [0, 1, 2, 3, 4, 5, 6], xlabel='time / divisions'))
F('The A-scan time base is 10 µs per division. An echo is 6.4 divisions after the pulse', lambda s: ascan(
    'A-scan trace', 'A-scan trace with a time base of 10 µs per division: the transmitted pulse at 0 and an echo 6.4 divisions later.',
    [(0, 1.0), (grab(s, r'echo is ([\d.]+) divisions'), 0.45)], 10, [0, 2, 4, 6, 8, 10], xlabel='time / divisions'))
F('An A-scan of an eye shows echoes at 8.0 µs (front of lens)', lambda s: ascan(
    'A-scan of an eye', 'A-scan of an eye: the transmitted pulse at 0 and echoes at 8.0 µs (front of lens), 13.2 µs (back of lens) and 31.0 µs (retina).',
    [(0, 1.0), (8.0, 0.6), (13.2, 0.5), (31.0, 0.4)], 40, [0, 10, 20, 30, 40]))
F('The A-scan shows the transmitted pulse at 0, a peak at 26 µs and a peak at 91 µs', lambda s: ascan(
    'A-scan trace', 'A-scan trace: the transmitted pulse at 0 and echoes at 26 µs and 91 µs; the grid lines are 13 µs apart.',
    [(0, 1.0), (26, 0.6), (91, 0.35)], 130, [0, 13, 26, 39, 52, 65, 78, 91, 104, 117, 130]))

# ── 30.7 ──
F('An A-scan of an eye shows echoes at 6.5 µs (cornea)', lambda s: ascan(
    'A-scan of an eye', 'A-scan of an eye: the transmitted pulse at 0 and echoes at 6.5 µs (cornea), 9.0 µs (front of lens), 15.0 µs (back of lens) and 33.0 µs (retina).',
    [(0, 1.0), (6.5, 0.7), (9.0, 0.55), (15.0, 0.5), (33.0, 0.4)], 40, [0, 10, 20, 30, 40]))

# ── 30.8 ──
F('Two annihilation photons reach opposite detectors 400 ps apart', lambda s: pet_ring(
    'PET detector ring', 'End-on view of a PET detector ring. An annihilation off the centre sends two photons in opposite directions along the line of response to detectors A and B, arriving 400 ps apart.',
    offset=0.24, offset_label='d'))
F('A detector ring has a radius of 0.40 m. An annihilation occurs on the line joining two opposite detectors', lambda s: pet_ring(
    'Locating an annihilation', 'A PET ring of radius 0.40 m. An annihilation on the line between opposite detectors A and B sends photons to both; the photon reaching A arrives 1.0 ns earlier.',
    offset=-0.375, offset_label='d'))
F('In PET, what is a "line of response"?', lambda s: pet_ring(
    'Line of response', 'End-on view of a PET detector ring around a patient, with two photons from an annihilation travelling in opposite directions to two detectors.', offset=0.2))
F('An annihilation occurs 10 cm from the centre, on the line between two opposite detectors', lambda s: pet_ring(
    'Off-centre annihilation', 'A PET detector ring with an annihilation 10 cm from the centre on the line joining two opposite detectors.',
    offset=0.25, offset_label='10 cm'))
