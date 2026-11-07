# Chapter 1 Kinematics: vectors, 1.5 to 1.8.


def mag(x, y):
    return sqrt(x * x + y * y)


def cosrule(a, b, ang):
    """Third side when sides a and b enclose angle ang (degrees)."""
    return sqrt(a * a + b * b - 2 * a * b * cos(radians(ang)))


# ═════════════════════════ 1.5 Combining displacements (17/20/13) ═════════════════════════
lesson('1.5')
N('E', 2, 'A girl walks 12 m east and then 5.0 m north. Calculate the magnitude of her resultant displacement.', 13, 'm',
  's = √(12² + 5.0²) = 13 m', ['C1: Pythagoras'], sig=2, aq='s')
M('E', 1, 'Two displacements are added by drawing them head to tail. What represents the resultant?', 'The arrow from the tail of the first to the head of the last', ['The longer of the two arrows', 'The arrow from the head of the first to the tail of the second', 'The sum of the two lengths'], 'This is the triangle (head-to-tail) rule.')
N('E', 2, 'Displacements of 7.0 m and 3.0 m are added. Calculate the largest possible resultant.', 10, 'm',
  'Largest when in the same direction: 7.0 + 3.0 = 10 m', ['C1: same direction'], sig=2, aq='s_max')
N('E', 2, 'What is the minimum size of the resultant when displacements of 7.0 m and 3.0 m are combined in any directions?', 4.0, 'm',
  'Smallest when opposite: 7.0 − 3.0 = 4.0 m', ['C1: opposite directions'], sig=2, aq='s_min')
M('E', 1, 'A scale drawing uses 1 cm to represent 2 km. How long is the arrow for a 7 km displacement?', '3.5 cm', ['7 cm', '14 cm', '2 cm'], 'Length = 7 ÷ 2 = 3.5 cm.')
N('E', 2, 'On a scale drawing where 1 cm represents 50 m, the resultant arrow is 6.4 cm long. What displacement does it represent?', 6.4 * 50, 'm',
  's = 6.4 × 50 = 320 m', ['C1: length × scale'], sig=2, aq='s')
N('E', 2, 'A rambler walks 9.0 km north then 12 km west. Calculate the magnitude of her displacement.', 15, 'km',
  's = √(9.0² + 12²) = 15 km', ['C1: Pythagoras'], sig=2, aq='s')
M('E', 1, 'Why must a scale drawing of displacements use the same scale for every arrow?', 'So that the lengths can be compared and the resultant read correctly', ['Because displacements are scalars', 'So the arrows fit on the page', 'Because the angles depend on the scale'], 'Mixing scales would distort the triangle.')
N('E', 2, 'A ship sails 6.0 km north and then 8.0 km east. Calculate the angle of its resultant displacement east of north.', degrees(atan(8.0 / 6.0)), '°',
  'θ = tan⁻¹(8.0 ÷ 6.0) = 53.1°', ['C1: tan θ = 8.0/6.0'], aq='θ')
M('E', 1, 'Two displacements are at right angles. Which method gives the magnitude of their resultant?', 'Pythagoras\' theorem', ['Adding the magnitudes', 'Subtracting the magnitudes', 'Multiplying the magnitudes'], 'The resultant is the hypotenuse of a right-angled triangle.')
N('E', 2, 'A diver swims 15 m horizontally and 8.0 m vertically downwards. Calculate the magnitude of her displacement.', 17, 'm',
  's = √(15² + 8.0²) = 17 m', ['C1: Pythagoras'], sig=2, aq='s')
M('E', 1, 'Does the order in which two displacements are added change the resultant?', 'No, the resultant is the same', ['Yes, it reverses the resultant', 'Yes, it doubles the resultant', 'Only if they are at right angles'], 'Vector addition is commutative.')
N('E', 1, 'A mouse runs 1.2 m east and then 0.50 m south. Calculate the magnitude of its displacement.', 1.3, 'm',
  's = √(1.2² + 0.50²) = 1.3 m', [], sig=2, aq='s')
N('E', 2, 'A car drives 20 km east and then 20 km north. Calculate the magnitude of its displacement.', 20 * sqrt(2), 'km',
  f's = √(20² + 20²) = {sf(20 * sqrt(2))} km', ['C1: Pythagoras'], aq='s')
M('E', 1, 'A car drives 20 km east and then 20 km north. In which direction is its resultant displacement?', 'North-east (bearing 045°)', ['North', 'East', 'South-west'], 'Equal perpendicular components give 45°.')
N('E', 2, 'Three displacements of 4.0 m, 5.0 m and 2.0 m all point due east. Calculate the resultant.', 11, 'm',
  's = 4.0 + 5.0 + 2.0 = 11 m east', ['C1: same direction, add'], sig=2, aq='s')
M('E', 1, 'A boy walks 50 m north and 50 m south. Which statement is correct?', 'His resultant displacement is zero but he walked 100 m', ['His resultant displacement is 100 m', 'His resultant is 50 m north', 'He walked zero distance'], 'Opposite equal displacements cancel.')
# medium
N('M', 3, 'A hiker walks 5.0 km east and then 8.0 km on a bearing of 030°. Using the cosine rule, calculate the magnitude of her displacement.', cosrule(5.0, 8.0, 120), 'km',
  f'The angle between the legs inside the triangle is 120°. s = √(5.0² + 8.0² − 2 × 5.0 × 8.0 × cos 120°) = {sf(cosrule(5, 8, 120))} km', ['C1: angle 120°', 'C1: cosine rule'], aq='s')
N('M', 3, 'A boat sails 4.0 km on a bearing of 060° and then 4.0 km on a bearing of 120°. Calculate the magnitude of its displacement.', 4.0 * sin(radians(60)) * 2, 'km',
  f'East: 4.0 sin 60° + 4.0 sin 120° = {sf(8 * sin(radians(60)), 4)} km; north: 4.0 cos 60° + 4.0 cos 120° = 0. s = 4.0 × sin 60° × 2 = {sf(8 * sin(radians(60)))} km', ['C1: components', 'C1: resultant'], aq='s')
N('M', 3, 'A displacement of 10 km is directed 30° north of east. Calculate its northward component.', 10 * sin(radians(30)), 'km',
  'North component = 10 sin 30° = 5.0 km', ['C1: sine for the component', 'C1: value'], sig=2, aq='s_N')
N('M', 3, 'A walker\'s displacement is 10 km at 30° north of east. How far east of the start is she?', 10 * cos(radians(30)), 'km',
  f'East component = 10 cos 30° = {sf(10 * cos(radians(30)))} km', ['C1: cosine for the component', 'C1: value'], aq='s_E')
M('M', 3, 'What is the parallelogram rule for adding two displacements?', 'Draw both from the same point, complete the parallelogram; the diagonal from that point is the resultant', ['Add the two lengths and keep the first direction', 'Draw them head to tail and take the longer side', 'Subtract the shorter from the longer'], 'It gives the same result as the triangle rule.', ['C1: common origin', 'C1: diagonal is resultant'])
N('M', 3, 'A plane flies 200 km north then 150 km on a bearing of 090°, then 50 km south. Calculate the magnitude of the resultant displacement.', mag(150, 150), 'km',
  f'North: 200 − 50 = 150 km; east: 150 km. s = √(150² + 150²) = {sf(mag(150, 150))} km', ['C1: net components', 'C1: Pythagoras'], aq='s')
N('M', 4, 'A hiker walks 6.0 km on a bearing of 040° and then 4.0 km on a bearing of 130°. (The legs are at right angles.) Calculate the bearing of her final position from the start.', 40 + degrees(atan(4.0 / 6.0)), '°',
  f'Angle between first leg and resultant = tan⁻¹(4.0 ÷ 6.0) = {sf(degrees(atan(4 / 6)), 3)}°. Bearing = 40 + {sf(degrees(atan(4 / 6)), 3)} = {sf(40 + degrees(atan(4 / 6)))}°', ['M1: right angle between legs', 'C1: angle', 'C1: add to 040°'], aq='bearing')
N('M', 3, 'Two displacements of 3.0 m and 4.0 m have a resultant of 5.0 m. Calculate the angle between them.', 90, '°',
  '5.0² = 3.0² + 4.0², so cos θ = (3.0² + 4.0² − 5.0²) ÷ (2 × 3.0 × 4.0) = 0. Then θ = cos⁻¹(0) = 90°', ['C1: Pythagoras holds', 'C1: right angle'], sig=2, aq='θ')
N('M', 3, 'A walker goes 3.0 km north-east and then 3.0 km north-west. Calculate the magnitude of the resultant.', 3.0 * sqrt(2), 'km',
  f'The legs are perpendicular: s = √(3.0² + 3.0²) = {sf(3 * sqrt(2))} km due north', ['C1: perpendicular legs', 'C1: Pythagoras'], aq='s')
M('M', 3, 'A student draws 4 cm north and 3 cm east to represent two displacements, and measures the resultant as 5 cm. What must she also measure?', 'The angle of the resultant (its direction)', ['The time taken', 'The length of each arrow again', 'Nothing more'], 'A displacement needs a magnitude and a direction.', ['C1: direction', 'C1: protractor'])
N('M', 3, 'A yacht has components of displacement 7.5 km east and 4.0 km south. Calculate the angle of its displacement south of east.', degrees(atan(4.0 / 7.5)), '°',
  f'θ = tan⁻¹(4.0 ÷ 7.5) = {sf(degrees(atan(4 / 7.5)))}°', ['C1: tan θ', 'C1: value'], aq='θ')
N('M', 3, 'A crane lifts a load 12 m vertically and swings it 9.0 m horizontally. Calculate the load\'s displacement magnitude.', 15, 'm',
  's = √(12² + 9.0²) = 15 m', ['C1: perpendicular', 'C1: value'], sig=2, aq='s')
N('M', 3, 'A displacement of 25 m makes an angle of 40° with the horizontal. Calculate its vertical component.', 25 * sin(radians(40)), 'm',
  f'Vertical = 25 sin 40° = {sf(25 * sin(radians(40)))} m', ['C1: sin for vertical', 'C1: value'], aq='s_v')
N('M', 4, 'Two displacements, 8.0 km and 5.0 km, are separated by an angle of 60° when drawn from the same point. Calculate the magnitude of their resultant.', cosrule(8.0, 5.0, 120), 'km',
  f'In the head-to-tail triangle the enclosed angle is 180 − 60 = 120°. s = √(8.0² + 5.0² − 2 × 8.0 × 5.0 × cos 120°) = {sf(cosrule(8, 5, 120))} km', ['M1: triangle angle 120°', 'C1: cosine rule', 'C1: value'], aq='s')
M('M', 3, 'A resultant displacement is to be found from three legs at various angles. Which method is most reliable?', 'Resolve each into perpendicular components, add the components, then combine', ['Add the three magnitudes', 'Average the three angles', 'Use only the longest leg'], 'Components can be added as ordinary numbers.', ['C1: resolve', 'C1: add components, Pythagoras'])
N('M', 3, 'A bird flies 300 m on a bearing of 210°. Calculate the southward component of its displacement.', 300 * cos(radians(30)), 'm',
  f'210° is 30° west of south. South component = 300 cos 30° = {sf(300 * cos(radians(30)))} m', ['C1: angle from south', 'C1: value'], aq='s_S')
N('M', 3, 'A walker covers 2.5 km north, 1.5 km east and 0.5 km north. Calculate the magnitude of her displacement.', mag(3.0, 1.5), 'km',
  f'North: 2.5 + 0.5 = 3.0 km; east: 1.5 km. s = √(3.0² + 1.5²) = {sf(mag(3, 1.5))} km', ['C1: combine north legs', 'C1: Pythagoras'], aq='s')
N('M', 3, 'A boat travels 900 m due east and then 1200 m due south. Calculate the bearing of its final position from the start.', 180 - degrees(atan(900 / 1200)), '°',
  f'Angle east of south = tan⁻¹(900 ÷ 1200) = {sf(degrees(atan(0.75)), 3)}°. Bearing = 180 − {sf(degrees(atan(0.75)), 3)} = {sf(180 - degrees(atan(0.75)))}°', ['C1: angle', 'C1: bearing'], aq='bearing')
# hard
N('H', 5, 'A hiker walks 4.0 km on a bearing of 030°, then 6.0 km on a bearing of 120°. (a) Show that the legs are perpendicular. (b) Calculate the magnitude of the resultant. (c) Find its bearing.', 30 + degrees(atan(6.0 / 4.0)), '°',
  f'(a) 120 − 30 = 90°. (b) s = √(4.0² + 6.0²) = {sf(mag(4, 6))} km. (c) Angle from first leg = tan⁻¹(6.0 ÷ 4.0) = {sf(degrees(atan(1.5)), 3)}°; bearing = 30 + {sf(degrees(atan(1.5)), 3)} = {sf(30 + degrees(atan(1.5)))}°',
  ['B1: right angle', 'C1: magnitude', 'M1: angle from first leg', 'C1: bearing'], aq='bearing')
N('H', 6, 'A ship sails 12 km on a bearing of 050°, then 8.0 km on a bearing of 170°. (a) Resolve both legs into east and north components. (b) Find the resultant components. (c) Calculate the magnitude of the resultant displacement.', mag(12 * sin(radians(50)) + 8 * sin(radians(170)), 12 * cos(radians(50)) + 8 * cos(radians(170))), 'km',
  f'(a) Leg 1: E = 12 sin 50° = {sf(12 * sin(radians(50)), 4)}, N = 12 cos 50° = {sf(12 * cos(radians(50)), 4)}. Leg 2: E = 8.0 sin 170° = {sf(8 * sin(radians(170)), 4)}, N = 8.0 cos 170° = {sf(8 * cos(radians(170)), 4)}. (b) E = {sf(12 * sin(radians(50)) + 8 * sin(radians(170)), 4)}, N = {sf(12 * cos(radians(50)) + 8 * cos(radians(170)), 4)}. (c) s = √({sf(12 * sin(radians(50)) + 8 * sin(radians(170)), 4)}² + ({sf(12 * cos(radians(50)) + 8 * cos(radians(170)), 4)})²) = {sf(mag(12 * sin(radians(50)) + 8 * sin(radians(170)), 12 * cos(radians(50)) + 8 * cos(radians(170))))} km',
  ['C1: leg 1 components', 'C1: leg 2 components', 'C1: sums', 'M1: Pythagoras', 'C1: value'], aq='s')
N('H', 5, 'Two displacements of 5.0 m and 12 m are drawn from the same point at an angle of 90° to each other. (a) Calculate the resultant. (b) Calculate the angle between the resultant and the 12 m displacement.', degrees(atan(5.0 / 12)), '°',
  f'(a) s = √(5.0² + 12²) = 13 m. (b) θ = tan⁻¹(5.0 ÷ 12) = {sf(degrees(atan(5 / 12)))}°',
  ['C1: Pythagoras', 'C1: 13 m', 'M1: tan θ', 'C1: value'], aq='θ')
N('H', 6, 'An orienteer runs 800 m on a bearing of 000°, then 600 m on a bearing of 270°, then 400 m on a bearing of 180°. (a) Find the net north and west displacements. (b) Calculate the distance from the start. (c) Find the bearing from the start.', 360 - degrees(atan(600 / 400)), '°',
  f'(a) North: 800 − 400 = 400 m; west: 600 m. (b) s = √(400² + 600²) = {sf(mag(400, 600))} m. (c) Angle west of north = tan⁻¹(600 ÷ 400) = {sf(degrees(atan(1.5)), 3)}°; bearing = 360 − {sf(degrees(atan(1.5)), 3)} = {sf(360 - degrees(atan(1.5)))}°',
  ['C1: north', 'C1: west', 'C1: magnitude', 'M1: angle from north', 'C1: bearing'], aq='bearing')
N('H', 5, 'A displacement of 15 km has an eastward component of 9.0 km. (a) Calculate its northward component (it points north of east). (b) Calculate its angle north of east.', degrees(acos(9.0 / 15)), '°',
  f'(a) N = √(15² − 9.0²) = 12 km. (b) θ = cos⁻¹(9.0 ÷ 15) = {sf(degrees(acos(0.6)))}°',
  ['M1: Pythagoras rearranged', 'C1: 12 km', 'M1: cos θ', 'C1: value'], aq='θ')
N('H', 5, 'A climber moves 30 m up a slope inclined at 35° to the horizontal and then 20 m horizontally. (a) Find the horizontal and vertical components of the first leg. (b) Calculate the magnitude of the total displacement.', mag(30 * cos(radians(35)) + 20, 30 * sin(radians(35))), 'm',
  f'(a) Horizontal = 30 cos 35° = {sf(30 * cos(radians(35)), 4)} m; vertical = 30 sin 35° = {sf(30 * sin(radians(35)), 4)} m. (b) s = √(({sf(30 * cos(radians(35)), 4)} + 20)² + ({sf(30 * sin(radians(35)), 4)})²) = {sf(mag(30 * cos(radians(35)) + 20, 30 * sin(radians(35))))} m',
  ['C1: horizontal', 'C1: vertical', 'M1: add horizontal', 'C1: Pythagoras'], aq='s')
N('H', 6, 'A boat sails 10 km on a bearing of 045° and then 10 km on a bearing of 315°. (a) Calculate the resultant east and north components. (b) Calculate the magnitude. (c) State its direction.', 20 * cos(radians(45)), 'km',
  f'(a) East: 10 sin 45° + 10 sin 315° = 0; north: 10 cos 45° + 10 cos 315° = {sf(20 * cos(radians(45)), 4)} km. (b) s = 20 × cos 45° = {sf(20 * cos(radians(45)))} km. (c) Due north.',
  ['C1: east components cancel', 'C1: north sum', 'M1: resultant', 'C1: value', 'B1: due north'], aq='s')
N('H', 5, 'Two displacements, 6.0 m and 9.0 m, have a resultant of 12 m. (a) Use the cosine rule to find the angle in the triangle opposite the 12 m side. (b) State the angle between the two displacements when drawn from a common point.', 180 - degrees(acos((6.0 ** 2 + 9.0 ** 2 - 12 ** 2) / (2 * 6.0 * 9.0))), '°',
  f'(a) cos C = (6.0² + 9.0² − 12²) ÷ (2 × 6.0 × 9.0) = {sf((36 + 81 - 144) / 108, 3)}, C = {sf(degrees(acos(-27 / 108)), 4)}°. (b) Angle = 180 − {sf(degrees(acos(-27 / 108)), 4)} = {sf(180 - degrees(acos(-27 / 108)))}°',
  ['M1: cosine rule rearranged', 'C1: angle in triangle', 'M1: supplement', 'C1: value'], aq='θ')
N('H', 6, 'A walker goes 2.0 km east, 3.0 km north, 4.0 km east and 5.0 km north. (a) Find the net components. (b) Calculate the magnitude of the displacement. (c) Calculate its angle north of east.', degrees(atan(8.0 / 6.0)), '°',
  f'(a) East 6.0 km, north 8.0 km. (b) s = √(6.0² + 8.0²) = 10 km. (c) θ = tan⁻¹(8.0 ÷ 6.0) = {sf(degrees(atan(8 / 6)))}°',
  ['C1: east', 'C1: north', 'C1: magnitude', 'M1: tan θ', 'C1: value'], aq='θ')
N('H', 5, 'A plane must end up 500 km due north of its start. It first flies 300 km due east. (a) Find the components of the second leg it must fly. (b) Calculate the length of that leg.', mag(300, 500), 'km',
  f'(a) 300 km west and 500 km north. (b) L = √(300² + 500²) = {sf(mag(300, 500))} km',
  ['M1: resultant − first leg', 'C1: components', 'M1: Pythagoras', 'C1: value'], aq='L')

N('E', 2, 'On a map of scale 1 cm to 500 m, a walk is drawn as 3.0 cm north and then 4.0 cm east. What is the real resultant displacement, in m?', 5.0 * 500, 'm',
  'Arrow length = √(3.0² + 4.0²) = 5.0 cm, so s = 5.0 × 500 = 2500 m', ['C1: scale applied'], sig=2, aq='s')
M('E', 1, 'Which method adds two vectors that are drawn starting from the same point?', 'The parallelogram method', ['The triangle method only', 'Subtraction of lengths', 'Multiplying the lengths'], 'Complete the parallelogram; its diagonal is the resultant.')
N('M', 3, 'A bee flies 30 m north-east, then 30 m south-east, then 30 m south-west. Calculate the magnitude of its displacement.', 30, 'm',
  'The NE and SW legs cancel, leaving the SE leg: s = 30 + 30 − 30 = 30 m towards the south-east', ['C1: opposite legs cancel', 'C1: value'], sig=2, aq='s')
N('M', 3, 'A ball is kicked 25 m due east and then 15 m towards the north-east. Calculate the magnitude of its displacement.', cosrule(25, 15, 135), 'm',
  f'Angle inside the triangle = 135°. s = √(25² + 15² − 2 × 25 × 15 × cos 135°) = {sf(cosrule(25, 15, 135))} m', ['C1: 135° angle', 'C1: cosine rule'], aq='s')
N('H', 5, 'A hiker walks 5.0 km on a bearing of 000°, 5.0 km on a bearing of 120° and 3.0 km on a bearing of 240°. (a) Explain why three equal legs at 120° to each other would cancel. (b) Hence calculate the magnitude of the resultant.', 2.0, 'km',
  '(a) They form a closed equilateral triangle. (b) The third leg is 2.0 km short of closing it, so s = 5.0 − 3.0 = 2.0 km on a bearing of 060°',
  ['B1: closed triangle', 'M1: shortfall in third leg', 'C1: magnitude', 'C1: direction'], sig=2, aq='s')
N('M', 3, 'A diver descends 18 m vertically while drifting 6.0 m horizontally. Calculate the angle of her displacement below the horizontal.', degrees(atan(18 / 6)), '°',
  f'θ = tan⁻¹(18 ÷ 6.0) = {sf(degrees(atan(3)))}°', ['C1: tan θ = vertical/horizontal', 'C1: value'], aq='θ')

# ═════════════════════════ 1.6 Combining velocities (17/20/13) ═════════════════════════
lesson('1.6')
N('E', 2, 'A boat heads straight across a river at 4.0 m s⁻¹ relative to the water. The current flows at 3.0 m s⁻¹. Calculate the boat\'s resultant speed.', 5.0, 'm s⁻¹',
  'v = √(4.0² + 3.0²) = 5.0 m s⁻¹', ['C1: Pythagoras'], sig=2, aq='v')
M('E', 1, 'A swimmer swims at 1.5 m s⁻¹ downstream in a river flowing at 0.5 m s⁻¹. What is her speed relative to the bank?', '2.0 m s⁻¹', ['1.0 m s⁻¹', '1.5 m s⁻¹', '0.5 m s⁻¹'], 'Velocities in the same direction add.')
M('E', 1, 'The same swimmer (1.5 m s⁻¹ in still water) swims upstream against a 0.5 m s⁻¹ current. What is her speed relative to the bank?', '1.0 m s⁻¹', ['2.0 m s⁻¹', '0.5 m s⁻¹', '1.5 m s⁻¹'], 'Opposite velocities subtract.')
N('E', 2, 'An aircraft flies north at 200 m s⁻¹ in a wind blowing east at 50 m s⁻¹. Calculate its resultant speed.', mag(200, 50), 'm s⁻¹',
  f'v = √(200² + 50²) = {sf(mag(200, 50))} m s⁻¹', ['C1: Pythagoras'], aq='v')
M('E', 1, 'How are two velocities at right angles combined?', 'By vector addition: the resultant is the hypotenuse of the right-angled triangle', ['By adding the speeds', 'By subtracting the speeds', 'By averaging them'], 'Use Pythagoras for the size and trigonometry for the angle.')
N('E', 2, 'A passenger walks forwards at 1.5 m s⁻¹ in a train moving at 30 m s⁻¹. Calculate her speed relative to the ground.', 31.5, 'm s⁻¹',
  'v = 30 + 1.5 = 31.5 m s⁻¹', ['C1: add, same direction'], aq='v')
N('E', 2, 'A passenger walks towards the back of a train at 1.5 m s⁻¹ while the train moves forwards at 30 m s⁻¹. Calculate her velocity relative to the ground.', 28.5, 'm s⁻¹',
  'v = 30 − 1.5 = 28.5 m s⁻¹ forwards', ['C1: subtract, opposite'], aq='v')
M('E', 1, 'A boat crosses a river heading straight across. What effect does the current have?', 'It carries the boat downstream, so it lands further down the far bank', ['It makes the crossing faster', 'It has no effect', 'It makes the boat land upstream'], 'The current adds a velocity along the river.')
N('E', 2, 'A boat heads across a river at 3.0 m s⁻¹ while the current flows at 3.0 m s⁻¹. Calculate the angle between the boat\'s resultant velocity and the bank.', 45, '°',
  'tan θ = 3.0 ÷ 3.0, so θ = tan⁻¹(3.0 ÷ 3.0) = 45°', ['C1: equal components'], sig=2, aq='θ')
M('E', 1, 'Rain falls vertically at 8 m s⁻¹. A wind blows horizontally at 6 m s⁻¹. What is the speed of the raindrops?', '10 m s⁻¹', ['14 m s⁻¹', '2 m s⁻¹', '8 m s⁻¹'], 'Resultant = √(8² + 6²) = 10 m s⁻¹.')
N('E', 2, 'A drone flies east at 12 m s⁻¹ in a wind blowing north at 5.0 m s⁻¹. Calculate its resultant speed.', 13, 'm s⁻¹',
  'v = √(12² + 5.0²) = 13 m s⁻¹', ['C1: Pythagoras'], sig=2, aq='v')
M('E', 1, 'A plane flies into a headwind. What happens to its speed relative to the ground?', 'It is reduced by the wind speed', ['It is increased by the wind speed', 'It is unchanged', 'It becomes zero'], 'A headwind is opposite to the motion.')
N('E', 2, 'A plane has an airspeed of 240 m s⁻¹ and flies into a 40 m s⁻¹ headwind. Calculate its ground speed.', 200, 'm s⁻¹',
  'v = 240 − 40 = 200 m s⁻¹', ['C1: subtract'], sig=2, aq='v')
N('E', 2, 'A plane with airspeed 240 m s⁻¹ has a 40 m s⁻¹ tailwind. Calculate its ground speed.', 280, 'm s⁻¹',
  'v = 240 + 40 = 280 m s⁻¹', ['C1: add'], sig=2, aq='v')
M('E', 1, 'A person runs at 3 m s⁻¹ along the deck of a ship that moves at 3 m s⁻¹ in the opposite direction. What is the person\'s velocity relative to the sea?', 'Zero', ['6 m s⁻¹', '3 m s⁻¹', '9 m s⁻¹'], 'The two velocities cancel.')
N('E', 1, 'A conveyor belt moves at 0.80 m s⁻¹. A box slides along it at 0.30 m s⁻¹ in the same direction relative to the belt. Calculate the box\'s speed relative to the floor.', 1.1, 'm s⁻¹',
  'v = 0.80 + 0.30 = 1.1 m s⁻¹', [], sig=2, aq='v')
M('E', 1, 'Which is the correct way to describe a velocity "relative to the water"?', 'The velocity an observer moving with the water would measure', ['The velocity measured from the bank', 'The speed of the water', 'The velocity of the bank'], 'Relative velocity depends on the observer.')
# medium
N('M', 3, 'A boat heads straight across a 60 m wide river at 2.0 m s⁻¹ relative to the water; the current flows at 1.5 m s⁻¹. Calculate the time to cross.', 30, 's',
  't = 60 ÷ 2.0 = 30 s (only the across component matters)', ['C1: across component only', 'C1: value'], sig=2, aq='t')
N('M', 3, 'A boat heads straight across a 60 m wide river at 2.0 m s⁻¹ relative to the water; the current flows at 1.5 m s⁻¹. How far downstream does it land?', 1.5 * 30, 'm',
  't = 60 ÷ 2.0 = 30 s; drift = 1.5 × 30 = 45 m', ['C1: crossing time', 'C1: drift'], sig=2, aq='x')
N('M', 3, 'A boat that moves at 5.0 m s⁻¹ in still water must travel straight across a river flowing at 3.0 m s⁻¹. At what angle to the straight-across direction, upstream, must it head?', degrees(asin(3.0 / 5.0)), '°',
  f'sin θ = 3.0 ÷ 5.0, θ = sin⁻¹(3.0 ÷ 5.0) = {sf(degrees(asin(0.6)))}°', ['C1: upstream component cancels current', 'C1: sin θ'], aq='θ')
N('M', 3, 'A boat that moves at 5.0 m s⁻¹ in still water heads upstream at an angle so that it goes straight across a river flowing at 3.0 m s⁻¹. Calculate its speed across the river.', 4.0, 'm s⁻¹',
  'v = √(5.0² − 3.0²) = 4.0 m s⁻¹', ['C1: Pythagoras with hypotenuse 5.0', 'C1: value'], sig=2, aq='v')
N('M', 3, 'A plane heads due north at 180 m s⁻¹ while the wind blows from the west at 40 m s⁻¹. Calculate the angle of its track east of north.', degrees(atan(40 / 180)), '°',
  f'θ = tan⁻¹(40 ÷ 180) = {sf(degrees(atan(40 / 180)))}°', ['C1: wind from west blows east', 'C1: tan θ'], aq='θ')
M('M', 3, 'A wind "from the west" acts on a plane. In which direction does it push the plane?', 'Towards the east', ['Towards the west', 'Towards the north', 'It has no direction'], 'Winds are named by where they come from.', ['C1: from the west', 'C1: blows east'])
N('M', 3, 'Rain falls vertically at 6.0 m s⁻¹. A cyclist rides at 4.0 m s⁻¹. At what angle to the vertical does the rain appear to fall, as seen by the cyclist?', degrees(atan(4.0 / 6.0)), '°',
  f'θ = tan⁻¹(4.0 ÷ 6.0) = {sf(degrees(atan(4 / 6)))}°', ['C1: relative velocity', 'C1: tan θ'], aq='θ')
N('M', 3, 'A ball is thrown horizontally at 8.0 m s⁻¹ from a truck moving at 12 m s⁻¹ in the same direction. Calculate the ball\'s horizontal speed relative to the road.', 20, 'm s⁻¹',
  'v = 12 + 8.0 = 20 m s⁻¹', ['C1: add velocities', 'C1: value'], sig=2, aq='v')
N('M', 3, 'A ball is thrown sideways at 8.0 m s⁻¹, at right angles to the motion of a truck moving at 12 m s⁻¹. Calculate the ball\'s horizontal speed relative to the road.', mag(12, 8), 'm s⁻¹',
  f'v = √(12² + 8.0²) = {sf(mag(12, 8))} m s⁻¹', ['C1: right angles', 'C1: Pythagoras'], aq='v')
N('M', 4, 'A swimmer who can swim at 1.2 m s⁻¹ heads straight across a river 48 m wide flowing at 0.90 m s⁻¹. Calculate the distance she actually travels relative to the bank.', mag(48, 0.9 * 40), 'm',
  f't = 48 ÷ 1.2 = 40 s; drift = 0.90 × 40 = 36 m; distance = √(48² + 36²) = {sf(mag(48, 36))} m', ['C1: time', 'C1: drift', 'C1: resultant'], sig=2, aq='d')
M('M', 3, 'Why does heading a boat upstream at an angle increase the time to cross a river?', 'Part of its velocity is used to cancel the current, leaving a smaller component across the river', ['The current speeds up', 'The river becomes wider', 'The boat slows down in still water'], 'Only the across component carries it over.', ['C1: component cancels current', 'C1: smaller across component'])
N('M', 3, 'A plane must fly due east at a ground speed of 250 m s⁻¹ while a wind blows from the south at 30 m s⁻¹. Calculate the airspeed it needs.', mag(250, 30), 'm s⁻¹',
  f'Air velocity = ground velocity − wind: 250 east and 30 south. v = √(250² + 30²) = {sf(mag(250, 30))} m s⁻¹', ['C1: subtract wind', 'C1: Pythagoras'], aq='v')
N('M', 3, 'A man walks across the deck of a ferry at 1.4 m s⁻¹, at right angles to its motion at 4.8 m s⁻¹. Calculate his speed relative to the water.', mag(4.8, 1.4), 'm s⁻¹',
  'v = √(4.8² + 1.4²) = 5.0 m s⁻¹', ['C1: perpendicular velocities', 'C1: value'], sig=2, aq='v')
N('M', 3, 'A river flows at 2.5 m s⁻¹. A boat heads directly upstream at 6.0 m s⁻¹ relative to the water. How long does it take to travel 700 m upstream?', 700 / 3.5, 's',
  'Ground speed = 6.0 − 2.5 = 3.5 m s⁻¹; t = 700 ÷ 3.5 = 200 s', ['C1: relative speed', 'C1: t = d/v'], sig=2, aq='t')
N('M', 3, 'A kite moves at 3.0 m s⁻¹ horizontally and 4.0 m s⁻¹ vertically. Calculate the angle of its velocity above the horizontal.', degrees(atan(4 / 3)), '°',
  f'θ = tan⁻¹(4.0 ÷ 3.0) = {sf(degrees(atan(4 / 3)))}°', ['C1: tan θ = vertical/horizontal', 'C1: value'], aq='θ')
M('M', 3, 'Two cars approach each other head-on, at 20 m s⁻¹ and 25 m s⁻¹. What is the speed of one relative to the other?', '45 m s⁻¹', ['5 m s⁻¹', '22.5 m s⁻¹', '25 m s⁻¹'], 'Relative velocity = v₁ − v₂ with opposite signs: 20 − (−25).', ['C1: opposite directions', 'C1: magnitudes add'])
N('M', 3, 'A velocity of 15 m s⁻¹ is directed at 25° above the horizontal. Calculate its horizontal component.', 15 * cos(radians(25)), 'm s⁻¹',
  f'v_x = 15 cos 25° = {sf(15 * cos(radians(25)))} m s⁻¹', ['C1: cosine', 'C1: value'], aq='v_x')
N('M', 3, 'What is the upward part of a velocity of 15 m s⁻¹ aimed 25° above the horizontal?', 15 * sin(radians(25)), 'm s⁻¹',
  f'v_y = 15 sin 25° = {sf(15 * sin(radians(25)))} m s⁻¹', ['C1: sine', 'C1: value'], aq='v_y')
# hard
N('H', 5, 'A plane with airspeed 220 m s⁻¹ heads due north. A wind of 50 m s⁻¹ blows towards the north-east. (a) Find the east and north components of the wind. (b) Calculate the ground speed.', mag(50 * sin(radians(45)), 220 + 50 * cos(radians(45))), 'm s⁻¹',
  f'(a) East = 50 sin 45° = {sf(50 * sin(radians(45)), 4)}; north = 50 cos 45° = {sf(50 * cos(radians(45)), 4)} m s⁻¹. (b) v = √({sf(50 * sin(radians(45)), 4)}² + (220 + {sf(50 * cos(radians(45)), 4)})²) = {sf(mag(50 * sin(radians(45)), 220 + 50 * cos(radians(45))))} m s⁻¹',
  ['C1: wind components', 'M1: add north components', 'C1: Pythagoras', 'C1: value'], aq='v')
N('H', 6, 'A boat crosses a river 120 m wide. It can move at 4.0 m s⁻¹ in still water and the current is 2.0 m s⁻¹. It is steered to land directly opposite. (a) Calculate the angle upstream at which it must head. (b) Calculate its speed across. (c) Calculate the crossing time.', 120 / sqrt(4.0 ** 2 - 2.0 ** 2), 's',
  f'(a) sin θ = 2.0 ÷ 4.0, θ = sin⁻¹(2.0 ÷ 4.0) = 30°. (b) v = √(4.0² − 2.0²) = {sf(sqrt(12), 4)} m s⁻¹. (c) t = 120 ÷ {sf(sqrt(12), 4)} = {sf(120 / sqrt(12))} s',
  ['M1: upstream component = current', 'C1: angle', 'C1: across speed', 'M1: t = width/speed', 'C1: value'], aq='t')
N('H', 5, 'A pilot wants to fly due east. The plane\'s airspeed is 150 m s⁻¹ and a wind blows due north at 30 m s⁻¹. (a) Calculate the angle south of east at which the pilot must head. (b) Calculate the ground speed.', sqrt(150 ** 2 - 30 ** 2), 'm s⁻¹',
  f'(a) sin θ = 30 ÷ 150, θ = sin⁻¹(30 ÷ 150) = {sf(degrees(asin(0.2)))}°. (b) v = √(150² − 30²) = {sf(sqrt(150 ** 2 - 900))} m s⁻¹',
  ['M1: southward component cancels wind', 'C1: angle', 'M1: Pythagoras', 'C1: value'], aq='v')
N('H', 6, 'A swimmer heads at 30° upstream of straight across a river 40 m wide. She swims at 1.6 m s⁻¹ in still water; the current is 0.50 m s⁻¹. (a) Find her velocity components across and along the river. (b) Calculate the crossing time. (c) Calculate where she lands relative to the point opposite.', (1.6 * sin(radians(30)) - 0.50) * 40 / (1.6 * cos(radians(30))), 'm',
  f'(a) Across: 1.6 cos 30° = {sf(1.6 * cos(radians(30)), 4)} m s⁻¹; upstream: 1.6 sin 30° − 0.50 = 0.30 m s⁻¹. (b) t = 40 ÷ {sf(1.6 * cos(radians(30)), 4)} = {sf(40 / (1.6 * cos(radians(30))), 4)} s. (c) x = 0.30 × {sf(40 / (1.6 * cos(radians(30))), 4)} = {sf(0.3 * 40 / (1.6 * cos(radians(30))))} m upstream',
  ['C1: across component', 'C1: along component', 'C1: time', 'M1: displacement along', 'C1: value'], aq='x')
N('H', 5, 'Raindrops fall vertically at 7.0 m s⁻¹. To a passenger in a car, they appear to fall at 60° to the vertical. (a) Draw the relative-velocity triangle. (b) Calculate the speed of the car.', 7.0 * tan(radians(60)), 'm s⁻¹',
  f'(a) Rain relative to car = rain velocity − car velocity. (b) tan 60° = v ÷ 7.0, v = 7.0 × tan 60° = {sf(7 * tan(radians(60)))} m s⁻¹',
  ['B1: relative velocity triangle', 'M1: tan 60° = v/7.0', 'C1: rearrange', 'C1: value'], aq='v')
N('H', 6, 'A ship sails north at 8.0 m s⁻¹. A sailor runs across the deck from the west side to the east side at 3.0 m s⁻¹, while the sea current flows south at 1.5 m s⁻¹. (a) Find the sailor\'s north and east velocity components relative to the sea bed. (b) Calculate his speed relative to the sea bed.', mag(3.0, 8.0 - 1.5), 'm s⁻¹',
  f'(a) North: 8.0 − 1.5 = 6.5 m s⁻¹; east: 3.0 m s⁻¹. (b) v = √(6.5² + 3.0²) = {sf(mag(6.5, 3))} m s⁻¹',
  ['C1: north component', 'C1: east component', 'M1: Pythagoras', 'C1: substitution', 'C1: value'], aq='v')
N('H', 5, 'A ferry travels at 6.0 m s⁻¹ relative to the water, heading 40° upstream from straight across. The current is 2.5 m s⁻¹. (a) Find the components of its velocity relative to the bank. (b) Calculate its speed relative to the bank.', mag(6.0 * cos(radians(40)), 6.0 * sin(radians(40)) - 2.5), 'm s⁻¹',
  f'(a) Across: 6.0 cos 40° = {sf(6 * cos(radians(40)), 4)}; upstream: 6.0 sin 40° − 2.5 = {sf(6 * sin(radians(40)) - 2.5, 4)} m s⁻¹. (b) v = √({sf(6 * cos(radians(40)), 4)}² + {sf(6 * sin(radians(40)) - 2.5, 4)}²) = {sf(mag(6 * cos(radians(40)), 6 * sin(radians(40)) - 2.5))} m s⁻¹',
  ['C1: across', 'C1: along', 'M1: Pythagoras', 'C1: value'], aq='v')
N('H', 6, 'An aircraft flies from A to B, 600 km due north, and back. Its airspeed is 250 km h⁻¹ and a wind blows from the east at 50 km h⁻¹. (a) Calculate its ground speed when heading to fly due north. (b) Calculate the time for the round trip, in hours.', 1200 / sqrt(250 ** 2 - 50 ** 2), 'h',
  f'(a) v = √(250² − 50²) = {sf(sqrt(250 ** 2 - 2500), 4)} km h⁻¹ (the same both ways). (b) t = 1200 ÷ {sf(sqrt(250 ** 2 - 2500), 4)} = {sf(1200 / sqrt(250 ** 2 - 2500))} h',
  ['M1: crosswind cancelled', 'C1: ground speed', 'B1: same both ways', 'M1: total distance ÷ speed', 'C1: value'], aq='t')
N('H', 5, 'Two ships leave a port at the same time: P sails north at 10 m s⁻¹ and Q sails east at 7.5 m s⁻¹. (a) Calculate the speed of Q relative to P. (b) Calculate the distance between them after 20 minutes, in km.', mag(10, 7.5) * 1200 / 1000, 'km',
  f'(a) v = √(10² + 7.5²) = 12.5 m s⁻¹. (b) d = 12.5 × 1200 = 15 000 m. In km: 15 000 ÷ 1000 = 15',
  ['M1: relative velocity', 'C1: value', 'M1: d = vt', 'C1: km'], sig=2, aq='d')
N('H', 5, 'A drone flies with airspeed 18 m s⁻¹, heading due east, in a wind of 6.0 m s⁻¹ blowing towards the south-west. (a) Find the wind\'s east and north components. (b) Calculate the drone\'s ground speed.', mag(18 - 6 * cos(radians(45)), -6 * sin(radians(45))), 'm s⁻¹',
  f'(a) East: −6.0 cos 45° = {sf(-6 * cos(radians(45)), 4)}; north: −6.0 sin 45° = {sf(-6 * sin(radians(45)), 4)} m s⁻¹. (b) v = √((18 − {sf(6 * cos(radians(45)), 4)})² + {sf(6 * sin(radians(45)), 4)}²) = {sf(mag(18 - 6 * cos(radians(45)), 6 * sin(radians(45))))} m s⁻¹',
  ['C1: wind components', 'M1: add to airspeed', 'C1: Pythagoras', 'C1: value'], aq='v')

N('E', 2, 'A lift rises at 2.0 m s⁻¹. A toy dropped inside falls at 3.0 m s⁻¹ relative to the lift. Calculate the speed of the toy relative to the building.', 1.0, 'm s⁻¹',
  'Taking up as positive: v = 2.0 − 3.0 = −1.0 m s⁻¹, so its speed is 3.0 − 2.0 = 1.0 m s⁻¹ downwards', ['C1: combine with signs'], sig=2, aq='v')
N('M', 3, 'A walkway carries people forwards at 0.75 m s⁻¹. A child runs backwards along it at 2.0 m s⁻¹ relative to the walkway. How long does the child take to move 25 m relative to the ground?', 25 / 1.25, 's',
  'v = 2.0 − 0.75 = 1.25 m s⁻¹ backwards; t = 25 ÷ 1.25 = 20 s', ['C1: relative velocity', 'C1: t = d/v'], sig=2, aq='t')
N('M', 3, 'A canoeist paddles north at 2.4 m s⁻¹ relative to the water in a current flowing east at 0.70 m s⁻¹. Calculate her speed relative to the bank.', 2.5, 'm s⁻¹',
  'v = √(2.4² + 0.70²) = 2.5 m s⁻¹', ['C1: perpendicular', 'C1: Pythagoras'], sig=2, aq='v')
M('M', 3, 'A plane points due north but its track over the ground is north-east. What does this show about the wind?', 'It blows towards the east with a speed equal to the plane\'s airspeed', ['It blows towards the north', 'It blows towards the west', 'There is no wind'], 'A 45° track needs equal north and east components.', ['C1: eastward wind', 'C1: equal components'])
N('H', 5, 'A boat moves at 3.0 m s⁻¹ in still water and crosses a river 90 m wide with a current of 1.8 m s⁻¹, heading straight across. (a) Calculate the crossing time. (b) Calculate how far downstream it lands.', 1.8 * 30, 'm',
  '(a) t = 90 ÷ 3.0 = 30 s. (b) x = 1.8 × 30 = 54 m', ['M1: across component only', 'C1: time', 'M1: drift = current × time', 'C1: value'], sig=2, aq='x')
N('E', 2, 'An escalator moves upwards at 0.60 m s⁻¹ and a woman walks up it at 0.90 m s⁻¹ relative to the steps. Calculate her speed relative to the building.', 1.5, 'm s⁻¹',
  'v = 0.60 + 0.90 = 1.5 m s⁻¹', ['C1: add, same direction'], sig=2, aq='v')

# ═════════════════════════ 1.7 Subtracting vectors (17/20/13) ═════════════════════════
lesson('1.7')
N('E', 2, 'A ball moving at 6.0 m s⁻¹ to the right hits a wall and rebounds at 4.0 m s⁻¹ to the left. Calculate the magnitude of its change in velocity.', 10, 'm s⁻¹',
  'Taking right as positive: Δv = −4.0 − 6.0 = −10 m s⁻¹, so the magnitude is 4.0 + 6.0 = 10 m s⁻¹', ['C1: signs for directions'], sig=2, aq='Δv')
M('E', 1, 'How is the change in velocity Δv found?', 'Δv = final velocity − initial velocity, as a vector subtraction', ['Δv = final speed − initial speed', 'Δv = initial velocity − final velocity', 'Δv = final velocity + initial velocity'], 'Subtracting a vector means adding its negative.')
M('E', 1, 'If v is a vector, what is meant by the vector −v?', 'A vector of the same size as v pointing in the opposite direction', ['A vector of zero size', 'v rotated by 90°', 'v with half the size'], 'Subtracting v is the same as adding −v.')
N('E', 2, 'A car\'s velocity changes from 12 m s⁻¹ east to 20 m s⁻¹ east. Calculate its change in velocity.', 8.0, 'm s⁻¹',
  'Δv = 20 − 12 = 8.0 m s⁻¹ east', ['C1: final − initial'], sig=2, aq='Δv')
N('E', 2, 'A ball falling at 8.0 m s⁻¹ bounces up at 5.0 m s⁻¹. Taking upwards as positive, calculate its change in velocity.', 13, 'm s⁻¹',
  'Δv = 5.0 − (−8.0) = 13 m s⁻¹ upwards', ['C1: initial is negative'], sig=2, aq='Δv')
M('E', 1, 'A car goes round a bend at a steady 15 m s⁻¹. Is its change in velocity zero?', 'No, because the direction of the velocity changes', ['Yes, because the speed is constant', 'Yes, because it does not accelerate', 'Only if it stops'], 'Velocity is a vector.')
N('E', 2, 'A car travelling at 25 m s⁻¹ north slows to 10 m s⁻¹ north. Calculate its change in velocity, taking north as positive.', -15, 'm s⁻¹',
  'Δv = 10 − 25 = −15 m s⁻¹ (15 m s⁻¹ south)', ['C1: final − initial'], sig=2, sign=True, aq='Δv')
M('E', 1, 'A ball rebounds from a wall at the same speed it hit it. What is its change in speed?', 'Zero', ['Twice its speed', 'Its speed', 'It cannot be found'], 'Speed is unchanged; velocity is not.')
M('E', 1, 'A ball rebounds from a wall at the same speed v it hit it. What is the magnitude of its change in velocity?', '2v', ['Zero', 'v', 'v/2'], 'The velocity reverses: v − (−v) = 2v.')
N('E', 2, 'A ball moving at 9.0 m s⁻¹ is caught and stopped. Taking its initial direction as positive, calculate its change in velocity.', -9.0, 'm s⁻¹',
  'Δv = 0 − 9.0 = −9.0 m s⁻¹', ['C1: final zero'], sig=2, sign=True, aq='Δv')
M('E', 1, 'To find a − b with a scale drawing, which pair of arrows is drawn head to tail?', 'a and −b', ['a and b', '−a and b', 'b and −b'], 'Subtraction is addition of the negative.')
N('E', 2, 'A cyclist\'s velocity changes from 4.0 m s⁻¹ east to 4.0 m s⁻¹ north. Calculate the magnitude of the change in velocity.', 4.0 * sqrt(2), 'm s⁻¹',
  f'Δv = v₂ − v₁ has components 4.0 north and 4.0 west: |Δv| = √(4.0² + 4.0²) = {sf(4 * sqrt(2))} m s⁻¹', ['C1: perpendicular, Pythagoras'], aq='Δv')
M('E', 1, 'A cyclist\'s velocity changes from 4.0 m s⁻¹ east to 4.0 m s⁻¹ north. In which direction is Δv?', 'North-west', ['North-east', 'South-east', 'East'], 'Δv = v₂ + (−v₁): north plus west.')
N('E', 2, 'Taking west as positive, a train slows from 30 m s⁻¹ to 18 m s⁻¹. Calculate its change in velocity.', -12, 'm s⁻¹',
  'Δv = 18 − 30 = −12 m s⁻¹, that is 12 m s⁻¹ towards the east', ['C1: subtraction'], sig=2, sign=True, aq='Δv')
N('E', 1, 'A ball thrown upward at 12 m s⁻¹ is caught on the way down moving at 12 m s⁻¹. Calculate the magnitude of its change in velocity.', 24, 'm s⁻¹',
  'Taking up as positive: Δv = −12 − 12 = −24 m s⁻¹, so the magnitude is 12 + 12 = 24 m s⁻¹', [], sig=2, aq='Δv')
M('E', 1, 'Which quantity is found by subtracting two velocity vectors?', 'The change in velocity (or a relative velocity)', ['The distance travelled', 'The average speed', 'The time taken'], 'For example Δv = v₂ − v₁, or v_A − v_B for a relative velocity.')
N('E', 2, 'Car A moves east at 30 m s⁻¹ and car B moves east at 22 m s⁻¹. Calculate the velocity of A relative to B.', 8.0, 'm s⁻¹',
  'v_AB = v_A − v_B = 30 − 22 = 8.0 m s⁻¹ east', ['C1: v_A − v_B'], sig=2, aq='v_AB')
# medium
N('M', 3, 'A car rounds a 90° bend, its velocity changing from 15 m s⁻¹ north to 15 m s⁻¹ east in 6.0 s. Calculate the magnitude of the average acceleration.', 15 * sqrt(2) / 6.0, 'm s⁻²',
  f'|Δv| = √(15² + 15²) = {sf(15 * sqrt(2), 4)} m s⁻¹; a = {sf(15 * sqrt(2), 4)} ÷ 6.0 = {sf(15 * sqrt(2) / 6)} m s⁻²', ['C1: |Δv|', 'C1: ÷ time'], aq='a')
N('M', 3, 'A tennis ball arrives at 20 m s⁻¹ and is returned along the same line at 30 m s⁻¹. The contact time is 5.0 ms. Calculate the magnitude of its average acceleration.', 50 / 5.0e-3, 'm s⁻²',
  '|Δv| = 30 − (−20) = 50 m s⁻¹; a = 50 ÷ 5.0 × 10⁻³ = 10 000 m s⁻²', ['C1: |Δv| = 50', 'C1: ÷ time in s'], sig=2, aq='a')
N('M', 3, 'An ice-hockey puck is moving east at 6.0 m s⁻¹ when it is struck; afterwards it moves north at 8.0 m s⁻¹. Find the magnitude of the change in its velocity.', 10, 'm s⁻¹',
  '|Δv| = √(6.0² + 8.0²) = 10 m s⁻¹', ['C1: −v₁ is 6.0 west', 'C1: Pythagoras'], sig=2, aq='Δv')
N('M', 3, 'A puck\'s velocity changes from 6.0 m s⁻¹ east to 8.0 m s⁻¹ north. Calculate the angle of Δv measured west of north.', degrees(atan(6.0 / 8.0)), '°',
  f'Δv has components 8.0 north and 6.0 west: θ = tan⁻¹(6.0 ÷ 8.0) = {sf(degrees(atan(0.75)))}°', ['C1: components', 'C1: angle'], aq='θ')
M('M', 3, 'Car A travels north at 20 m s⁻¹ and car B east at 20 m s⁻¹. What is the velocity of A relative to B?', '28 m s⁻¹ towards the north-west', ['28 m s⁻¹ towards the north-east', '40 m s⁻¹ north', 'Zero'], 'v_A − v_B = north 20 + west 20.', ['C1: v_A − v_B', 'C1: magnitude and direction'])
N('M', 3, 'A ball hits a floor at 7.0 m s⁻¹ at 90° and rebounds at 5.0 m s⁻¹. The contact time is 0.020 s. Calculate the average acceleration during contact.', 12 / 0.020, 'm s⁻²',
  '|Δv| = 5.0 + 7.0 = 12 m s⁻¹; a = 12 ÷ 0.020 = 600 m s⁻²', ['C1: |Δv|', 'C1: ÷ t'], sig=2, aq='a')
N('M', 4, 'A ball strikes a wall at 10 m s⁻¹ at 60° to the wall and rebounds at the same speed and angle. Calculate the magnitude of the change in velocity.', 2 * 10 * sin(radians(60)), 'm s⁻¹',
  f'Only the component perpendicular to the wall reverses: |Δv| = 2 × 10 × sin 60° = {sf(20 * sin(radians(60)))} m s⁻¹', ['M1: parallel component unchanged', 'C1: perpendicular component', 'C1: doubled'], aq='Δv')
N('M', 3, 'A runner\'s velocity changes from 5.0 m s⁻¹ north to 3.0 m s⁻¹ south. Calculate the change in velocity, taking north as positive.', -8.0, 'm s⁻¹',
  'Δv = −3.0 − 5.0 = −8.0 m s⁻¹ (8.0 m s⁻¹ south)', ['C1: signs', 'C1: value'], sig=2, sign=True, aq='Δv')
M('M', 3, 'Why can the change in velocity of an object moving at constant speed be non-zero?', 'Because velocity is a vector and its direction can change', ['Because its mass changes', 'Because speed is a vector', 'Because time is a vector'], 'Δv depends on direction too.', ['C1: vector', 'C1: direction change'])
N('M', 3, 'Train P moves north at 25 m s⁻¹ and train Q moves south at 15 m s⁻¹. Calculate the speed of P relative to Q.', 40, 'm s⁻¹',
  'v_PQ = 25 − (−15) = 40 m s⁻¹ north', ['C1: opposite signs', 'C1: value'], sig=2, aq='v_PQ')
N('M', 3, 'A satellite moving at 7.5 km s⁻¹ goes a quarter of the way round a circular orbit. Calculate the magnitude of its change in velocity, in km s⁻¹.', 7.5 * sqrt(2), 'km s⁻¹',
  f'The velocity turns through 90°: |Δv| = √(7.5² + 7.5²) = {sf(7.5 * sqrt(2))} km s⁻¹', ['C1: 90° turn', 'C1: Pythagoras'], aq='Δv')
N('M', 3, 'After half an orbit, a satellite circling at 7.5 km s⁻¹ is moving in the opposite direction. What is the magnitude of its velocity change, in km s⁻¹?', 15, 'km s⁻¹',
  'The velocity reverses: |Δv| = 7.5 + 7.5 = 15 km s⁻¹', ['C1: reversal', 'C1: value'], sig=2, aq='Δv')
N('M', 3, 'Velocity v₁ = 10 m s⁻¹ east and v₂ = 10 m s⁻¹ at 60° north of east. Calculate |v₂ − v₁|.', 10.0, 'm s⁻¹',
  f'The triangle is equilateral (60° between equal sides): |Δv| = √(10² + 10² − 2 × 10 × 10 × cos 60°) = 10 m s⁻¹', ['C1: cosine rule', 'C1: value'], sig=2, aq='Δv')
M('M', 3, 'Two cyclists ride side by side north at 6 m s⁻¹. What is the velocity of one relative to the other?', 'Zero', ['12 m s⁻¹ north', '6 m s⁻¹ north', '6 m s⁻¹ south'], 'Equal velocities: v₁ − v₂ = 6 − 6 = 0.', ['C1: equal velocities', 'C1: relative velocity zero'])
N('M', 3, 'A boat moves at 5.0 m s⁻¹ east and a seagull flies at 12 m s⁻¹ north. Calculate the speed of the gull relative to the boat.', 13, 'm s⁻¹',
  'v = √(12² + 5.0²) = 13 m s⁻¹', ['C1: v_gull − v_boat', 'C1: Pythagoras'], sig=2, aq='v')
N('M', 4, 'A hockey ball travelling at 14 m s⁻¹ east is struck so that it leaves at 14 m s⁻¹ north. The stick is in contact for 0.050 s. Calculate the average acceleration.', 14 * sqrt(2) / 0.050, 'm s⁻²',
  f'|Δv| = √(14² + 14²) = {sf(14 * sqrt(2), 4)} m s⁻¹; a = {sf(14 * sqrt(2), 4)} ÷ 0.050 = {sf(14 * sqrt(2) / 0.05)} m s⁻²', ['M1: Δv perpendicular', 'C1: value', 'C1: a'], aq='a')
N('M', 3, 'A lift moving down at 3.0 m s⁻¹ comes to rest and then moves up at 2.0 m s⁻¹. Taking up as positive, calculate its total change in velocity.', 5.0, 'm s⁻¹',
  'Δv = 2.0 − (−3.0) = 5.0 m s⁻¹ upwards', ['C1: signs', 'C1: value'], sig=2, aq='Δv')
# hard
N('H', 5, 'A car\'s velocity changes from 20 m s⁻¹ north to 20 m s⁻¹ west in 8.0 s. (a) Draw the vector diagram for Δv. (b) Calculate |Δv|. (c) Calculate the average acceleration.', 20 * sqrt(2) / 8.0, 'm s⁻²',
  f'(a) Δv = v₂ + (−v₁): 20 west plus 20 south. (b) |Δv| = √(20² + 20²) = {sf(20 * sqrt(2), 4)} m s⁻¹. (c) a = {sf(20 * sqrt(2), 4)} ÷ 8.0 = {sf(20 * sqrt(2) / 8)} m s⁻² towards the south-west',
  ['B1: diagram', 'C1: |Δv|', 'M1: a = Δv/t', 'C1: value'], aq='a')
N('H', 6, 'A ship at 6.0 m s⁻¹ due north changes course to 6.0 m s⁻¹ on a bearing of 060° in 40 s. (a) Find the components of each velocity. (b) Calculate |Δv|. (c) Calculate the average acceleration.', 6.0 / 40, 'm s⁻²',
  f'(a) v₁ = (0, 6.0); v₂ = (6.0 sin 60°, 6.0 cos 60°) = ({sf(6 * sin(radians(60)), 4)}, 3.0). (b) |Δv| = √({sf(6 * sin(radians(60)), 4)}² + (3.0 − 6.0)²) = 6.0 m s⁻¹. (c) a = 6.0 ÷ 40 = {sf(6 / 40)} m s⁻²',
  ['C1: v₁', 'C1: v₂ components', 'M1: subtract components', 'C1: |Δv|', 'C1: value'], sig=2, aq='a')
N('H', 5, 'A ball hits a wall at 12 m s⁻¹ at 30° to the normal and rebounds at 9.0 m s⁻¹ at 30° to the normal on the other side. (a) Find the change in the normal component. (b) Find the change in the parallel component. (c) Calculate |Δv|.', mag(12 * cos(radians(30)) + 9 * cos(radians(30)), 12 * sin(radians(30)) - 9 * sin(radians(30))), 'm s⁻¹',
  f'(a) Normal: 9.0 cos 30° + 12 cos 30° = {sf(21 * cos(radians(30)), 4)} m s⁻¹. (b) Parallel: 9.0 sin 30° − 12 sin 30° = −1.5 m s⁻¹. (c) |Δv| = √({sf(21 * cos(radians(30)), 4)}² + 1.5²) = {sf(mag(21 * cos(radians(30)), 1.5))} m s⁻¹',
  ['C1: normal change', 'C1: parallel change', 'M1: Pythagoras', 'C1: value'], aq='Δv')
N('H', 6, 'Ship A sails east at 8.0 m s⁻¹; ship B sails north at 6.0 m s⁻¹. (a) Calculate the velocity of B relative to A (magnitude). (b) Calculate its direction west of north. (c) Calculate how much the separation changes in 10 minutes if they start at the same point.', 10 * 600 / 1000, 'km',
  '(a) v_BA = v_B − v_A: 6.0 north and 8.0 west; |v| = √(6.0² + 8.0²) = 10 m s⁻¹. (b) θ = tan⁻¹(8.0 ÷ 6.0) = 53.1° west of north. (c) d = 10 × 600 = 6000 m. In km: 6000 ÷ 1000 = 6.0',
  ['M1: v_B − v_A', 'C1: magnitude', 'C1: direction', 'M1: d = vt', 'C1: value'], sig=2, aq='d')
N('H', 5, 'A car travels round a circular track at 18 m s⁻¹. (a) Calculate |Δv| after one-sixth of a lap. (b) Explain why |Δv| is greatest after half a lap.', 18.0, 'm s⁻¹',
  '(a) The velocity turns through 60°, forming an equilateral triangle: |Δv| = √(18² + 18² − 2 × 18 × 18 × cos 60°) = 18 m s⁻¹. (b) After half a lap the velocity has reversed, so |Δv| = 36 m s⁻¹, the largest possible.',
  ['M1: angle turned 60°', 'C1: cosine rule', 'C1: value', 'B1: reversal gives 2v'], sig=2, aq='Δv')
N('H', 5, 'A bat changes a ball\'s velocity from 25 m s⁻¹ horizontally towards the batter to 35 m s⁻¹ at 30° above the horizontal away from the batter. (a) Find the horizontal and vertical components of Δv. (b) Calculate |Δv|.', mag(35 * cos(radians(30)) + 25, 35 * sin(radians(30))), 'm s⁻¹',
  f'(a) Horizontal: 35 cos 30° + 25 = {sf(35 * cos(radians(30)) + 25, 4)} m s⁻¹; vertical: 35 sin 30° = 17.5 m s⁻¹. (b) |Δv| = √({sf(35 * cos(radians(30)) + 25, 4)}² + 17.5²) = {sf(mag(35 * cos(radians(30)) + 25, 17.5))} m s⁻¹',
  ['C1: horizontal', 'C1: vertical', 'M1: Pythagoras', 'C1: value'], aq='Δv')
N('H', 6, 'Rain falls vertically at 5.0 m s⁻¹. A runner moves east at 3.0 m s⁻¹. (a) Write the velocity of the rain relative to the runner as a vector subtraction. (b) Calculate its magnitude. (c) Calculate the angle to the vertical at which she should tilt her umbrella.', degrees(atan(3 / 5)), '°',
  f'(a) v_rel = v_rain − v_runner. (b) |v| = √(5.0² + 3.0²) = {sf(mag(5, 3))} m s⁻¹. (c) θ = tan⁻¹(3.0 ÷ 5.0) = {sf(degrees(atan(0.6)))}°, tilted forwards',
  ['B1: subtraction', 'C1: components', 'C1: magnitude', 'M1: tan θ', 'C1: value'], aq='θ')
N('H', 5, 'An object moves in a circle of radius 0.50 m at 2.0 m s⁻¹. (a) Calculate the time for a quarter turn. (b) Calculate |Δv| for a quarter turn. (c) Calculate the average acceleration over the quarter turn.', 2 * sqrt(2) / (pi * 0.5 / 2 / 2.0), 'm s⁻²',
  f'(a) t = (2π × 0.50 ÷ 4) ÷ 2.0 = {sf(pi * 0.5 / 4, 4)} s. (b) |Δv| = √(2.0² + 2.0²) = {sf(2 * sqrt(2), 4)} m s⁻¹. (c) a = {sf(2 * sqrt(2), 4)} ÷ {sf(pi * 0.5 / 4, 4)} = {sf(2 * sqrt(2) / (pi * 0.5 / 4))} m s⁻²',
  ['C1: time', 'C1: |Δv|', 'M1: a = Δv/t', 'C1: value'], aq='a')
N('H', 5, 'A ball is thrown at 20 m s⁻¹ at 40° above the horizontal and later moves at 16.3 m s⁻¹ at 20° below the horizontal. (a) Show that the horizontal component is unchanged (to 2 s.f.). (b) Calculate the change in vertical velocity, taking up as positive.', -16.3 * sin(radians(20)) - 20 * sin(radians(40)), 'm s⁻¹',
  f'(a) 20 cos 40° = {sf(20 * cos(radians(40)), 3)} and 16.3 cos 20° = {sf(16.3 * cos(radians(20)), 3)} m s⁻¹. (b) Δv_y = −16.3 sin 20° − 20 sin 40° = {sf(-16.3 * sin(radians(20)) - 20 * sin(radians(40)))} m s⁻¹',
  ['C1: horizontal components', 'B1: equal', 'M1: final − initial vertical', 'C1: value'], sign=True, aq='Δv_y')

N('E', 2, 'A bus speeds up from 8.0 m s⁻¹ to 14 m s⁻¹ along a straight road. Calculate its change in velocity.', 6.0, 'm s⁻¹',
  'Δv = 14 − 8.0 = 6.0 m s⁻¹ forwards', ['C1: final − initial'], sig=2, aq='Δv')
M('E', 1, 'A ball falls vertically and bounces straight back up more slowly. In which direction is its change in velocity?', 'Upwards', ['Downwards', 'Horizontal', 'There is no change'], 'Δv = v_up − v_down points upwards.')
N('M', 3, 'A model boat heading north at 3.0 m s⁻¹ is turned so that it heads east at 4.0 m s⁻¹. By how much has its velocity changed (magnitude)?', 5.0, 'm s⁻¹',
  '|Δv| = √(3.0² + 4.0²) = 5.0 m s⁻¹', ['C1: perpendicular', 'C1: Pythagoras'], sig=2, aq='Δv')
N('M', 3, 'A football moving west at 18 m s⁻¹ is kicked back east at 22 m s⁻¹. The kick lasts 0.10 s. Calculate the magnitude of the average acceleration.', 40 / 0.10, 'm s⁻²',
  '|Δv| = 22 + 18 = 40 m s⁻¹; a = 40 ÷ 0.10 = 400 m s⁻²', ['C1: |Δv|', 'C1: ÷ t'], sig=2, aq='a')
N('H', 5, 'Car A travels north at 15 m s⁻¹ and car B travels east at 20 m s⁻¹. (a) Write the velocity of B relative to A as a vector subtraction. (b) Calculate its magnitude. (c) Calculate its angle east of south.', degrees(atan(20 / 15)), '°',
  f'(a) v_BA = v_B − v_A: 20 east and 15 south. (b) √(20² + 15²) = 25 m s⁻¹. (c) θ = tan⁻¹(20 ÷ 15) = {sf(degrees(atan(20 / 15)))}°',
  ['B1: subtraction', 'C1: magnitude', 'M1: tan θ', 'C1: value'], aq='θ')
M('M', 3, 'Why is |Δv| for a ball that rebounds from a wall larger than its change in speed?', 'The direction reverses, so the two speeds add in Δv', ['Speed is a vector', 'The wall adds energy', 'Δv ignores direction'], 'For a rebound |Δv| = v₁ + v₂.', ['C1: reversal', 'C1: magnitudes add'])
N('E', 2, 'A trolley moving at 0.80 m s⁻¹ hits a buffer and rebounds at 0.60 m s⁻¹. Taking the initial direction as positive, calculate its change in velocity.', -1.4, 'm s⁻¹',
  'Δv = −0.60 − 0.80 = −1.4 m s⁻¹', ['C1: signs'], sig=2, sign=True, aq='Δv')
N('M', 3, 'A pendulum bob passes the lowest point at 1.2 m s⁻¹ to the left, and half a period later at 1.2 m s⁻¹ to the right. Calculate the magnitude of its change in velocity.', 2.4, 'm s⁻¹',
  '|Δv| = 1.2 + 1.2 = 2.4 m s⁻¹', ['C1: reversal', 'C1: value'], sig=2, aq='Δv')

# ═════════════════════════ 1.8 Other examples of scalar and vector quantities (17/20/13) ═════════════════════════
lesson('1.8')
M('E', 1, 'Which list contains only vector quantities?', 'Force, momentum, acceleration', ['Mass, force, energy', 'Speed, velocity, time', 'Work, power, displacement'], 'Each of these needs a direction.')
M('E', 1, 'Choose the list in which every quantity is a scalar.', 'Mass, energy, temperature', ['Weight, mass, energy', 'Velocity, power, charge', 'Force, time, density'], 'None of these has a direction.')
M('E', 1, 'Is weight a scalar or a vector?', 'A vector, acting vertically downwards', ['A scalar', 'Neither', 'A scalar in space only'], 'Weight is the gravitational force on a mass, so it has a direction.')
M('E', 1, 'Is mass a scalar or a vector?', 'A scalar', ['A vector, downwards', 'A vector, in the direction of motion', 'Both'], 'Mass has magnitude only.')
N('E', 2, 'Two forces of 30 N and 40 N act at right angles on a box. Calculate the magnitude of the resultant force.', 50, 'N',
  'F = √(30² + 40²) = 50 N', ['C1: Pythagoras'], sig=2, aq='F')
N('E', 2, 'Forces of 12 N east and 7.0 N west act on a trolley. Calculate the resultant force.', 5.0, 'N',
  'F = 12 − 7.0 = 5.0 N east', ['C1: subtract opposite forces'], sig=2, aq='F')
M('E', 1, 'Is kinetic energy a scalar or a vector?', 'A scalar', ['A vector in the direction of motion', 'A vector opposite to motion', 'Depends on the speed'], 'Energy has no direction.')
M('E', 1, 'Which quantity is a vector?', 'Momentum', ['Kinetic energy', 'Power', 'Mass'], 'p = mv takes the direction of v.')
N('E', 2, 'Two people push a car with forces of 300 N and 250 N in the same direction. Friction is 150 N. Calculate the resultant force.', 400, 'N',
  'F = 300 + 250 − 150 = 400 N', ['C1: add pushes, subtract friction'], sig=2, aq='F')
M('E', 1, 'Is electric charge a scalar or a vector?', 'A scalar (it can be positive or negative but has no direction)', ['A vector', 'A vector in a wire', 'Neither'], 'A sign is not a direction.')
M('E', 1, 'Is acceleration a scalar or a vector?', 'A vector', ['A scalar', 'A scalar unless circular', 'Neither'], 'a = Δv/Δt, and Δv is a vector.')
N('E', 2, 'A force of 20 N acts at 30° above the horizontal. Calculate its horizontal component.', 20 * cos(radians(30)), 'N',
  f'F_x = 20 cos 30° = {sf(20 * cos(radians(30)))} N', ['C1: cosine'], aq='F_x')
N('E', 2, 'What is the size of the upward part of a 20 N force directed 30° above the horizontal?', 20 * sin(radians(30)), 'N',
  'F_y = 20 sin 30° = 10 N', ['C1: sine'], sig=2, aq='F_y')
M('E', 1, 'Is temperature a scalar or a vector?', 'A scalar', ['A vector, from hot to cold', 'A vector, upwards', 'Both'], 'Temperature has magnitude only.')
M('E', 1, 'Which pair is one scalar and one vector, describing the same motion?', 'Speed and velocity', ['Velocity and momentum', 'Mass and energy', 'Force and weight'], 'Speed is the magnitude of velocity.')
N('E', 1, 'Two forces of 6.0 N and 8.0 N act at right angles. Calculate the resultant.', 10, 'N',
  'F = √(6.0² + 8.0²) = 10 N', [], sig=2, aq='F')
M('E', 1, 'Why can two scalar quantities of the same kind always be added by ordinary arithmetic?', 'They have no direction, so only their sizes combine', ['Because they are always positive', 'Because they have no units', 'Because they are vectors'], 'For vectors the direction must be considered.')
# medium
N('M', 3, 'Two forces of 5.0 N and 12 N act on a point at right angles. Calculate the angle between the resultant and the 12 N force.', degrees(atan(5.0 / 12)), '°',
  f'θ = tan⁻¹(5.0 ÷ 12) = {sf(degrees(atan(5 / 12)))}°', ['C1: resultant 13 N', 'C1: tan θ'], aq='θ')
N('M', 3, 'A 2.0 kg ball moves at 3.0 m s⁻¹ east. Calculate its momentum and state its direction. Give the magnitude.', 6.0, 'kg m s⁻¹',
  'p = 2.0 × 3.0 = 6.0 kg m s⁻¹ east', ['C1: p = mv', 'C1: direction'], sig=2, aq='p')
N('M', 3, 'A 0.50 kg ball moving at 4.0 m s⁻¹ east rebounds at 4.0 m s⁻¹ west. Calculate the magnitude of its change in momentum.', 4.0, 'kg m s⁻¹',
  'Δp = 0.50 × (−4.0 − 4.0) = −4.0 kg m s⁻¹, so the magnitude is 0.50 × 8.0 = 4.0 kg m s⁻¹', ['C1: vector change', 'C1: value'], sig=2, aq='Δp')
M('M', 3, 'A ball rebounds with the same speed. Which quantity changes?', 'Its momentum (but not its kinetic energy)', ['Its kinetic energy (but not its momentum)', 'Both', 'Neither'], 'Momentum is a vector; kinetic energy is a scalar.', ['C1: momentum reverses', 'C1: KE unchanged'])
N('M', 3, 'A box is pulled by a rope with a tension of 80 N at 25° above the horizontal. Calculate the horizontal pull on the box.', 80 * cos(radians(25)), 'N',
  f'F_x = 80 cos 25° = {sf(80 * cos(radians(25)))} N', ['C1: cosine', 'C1: value'], aq='F_x')
N('M', 3, 'A force of 50 N acts at 60° to a second force of 50 N. Calculate the magnitude of the resultant.', 2 * 50 * cos(radians(30)), 'N',
  f'F = √(50² + 50² + 2 × 50 × 50 × cos 60°) = {sf(100 * cos(radians(30)))} N', ['C1: parallelogram rule', 'C1: value'], aq='F')
M('M', 3, 'Which statement about pressure is correct?', 'Pressure is a scalar, even though the force producing it is a vector', ['Pressure is a vector pointing down', 'Pressure is a vector perpendicular to a surface', 'Pressure has no unit'], 'Pressure at a point acts equally in all directions.', ['C1: scalar', 'C1: reason'])
N('M', 3, 'An object of weight 50 N rests on a slope at 30° to the horizontal. Calculate the component of its weight down the slope.', 50 * sin(radians(30)), 'N',
  'F = 50 sin 30° = 25 N', ['C1: sine of slope angle', 'C1: value'], sig=2, aq='F')
N('M', 3, 'For a 50 N block resting on a 30° incline, how large is the weight component that presses it into the surface?', 50 * cos(radians(30)), 'N',
  f'F = 50 cos 30° = {sf(50 * cos(radians(30)))} N', ['C1: cosine', 'C1: value'], aq='F')
N('M', 3, 'Three forces act on a point: 10 N north, 10 N east and 4.0 N south. Calculate the magnitude of the resultant.', mag(10, 6), 'N',
  f'North: 10 − 4.0 = 6.0 N; east: 10 N. F = √(10² + 6.0²) = {sf(mag(10, 6))} N', ['C1: net components', 'C1: Pythagoras'], aq='F')
M('M', 3, 'Why is the work done by a force a scalar even though force and displacement are vectors?', 'Work is a product (F s cos θ) that has magnitude only', ['Because work is always positive', 'Because work has no unit', 'Because force is a scalar'], 'Work is energy transferred.', ['C1: product of vectors', 'C1: energy is scalar'])
N('M', 4, 'A 1200 kg car moves at 15 m s⁻¹ north and then 15 m s⁻¹ east. Calculate the magnitude of its change in momentum.', 1200 * 15 * sqrt(2), 'kg m s⁻¹',
  f'|Δv| = √(15² + 15²) = {sf(15 * sqrt(2), 4)} m s⁻¹; |Δp| = 1200 × {sf(15 * sqrt(2), 4)} = {sf(1200 * 15 * sqrt(2))} kg m s⁻¹', ['M1: vector change', 'C1: |Δv|', 'C1: × mass'], aq='Δp')
N('M', 3, 'Two forces, 7.0 N and 4.0 N, act on an object. Calculate (largest possible resultant) − (smallest possible resultant).', (7 + 4) - (7 - 4), 'N',
  'Largest = 11 N, smallest = 3.0 N; difference = 11 − 3.0 = 8.0 N', ['C1: both extremes', 'C1: difference'], sig=2, aq='ΔF')
M('M', 3, 'Which list is correctly split into scalars | vectors?', 'mass, time, energy | force, velocity, acceleration', ['force, time | mass, energy', 'speed, weight | power, charge', 'velocity, mass | distance, momentum'], 'Check each for a direction.', ['C1: scalars correct', 'C1: vectors correct'])
N('M', 3, 'A sledge is pulled by two ropes, each with tension 150 N, at 20° either side of the direction of motion. Calculate the resultant forward force.', 2 * 150 * cos(radians(20)), 'N',
  f'Sideways components cancel. F = 2 × 150 × cos 20° = {sf(300 * cos(radians(20)))} N', ['C1: symmetry', 'C1: forward components'], aq='F')
N('M', 3, 'A rope pulls with 40 N at 35° to the horizontal. How much of this pull acts vertically upwards?', 40 * sin(radians(35)), 'N',
  f'F_y = 40 sin 35° = {sf(40 * sin(radians(35)))} N', ['C1: sine', 'C1: value'], aq='F_y')
M('M', 3, 'Two forces of equal size act on a point and the resultant is zero. What must be true?', 'They act in exactly opposite directions', ['They act at right angles', 'They act in the same direction', 'This is impossible'], 'Equal and opposite vectors cancel.', ['C1: opposite', 'C1: equal size'])
N('M', 3, 'The resultant of two perpendicular forces is 26 N. One force is 10 N. Calculate the other.', 24, 'N',
  'F = √(26² − 10²) = 24 N', ['C1: Pythagoras rearranged', 'C1: value'], sig=2, aq='F')
# hard
N('H', 5, 'Three forces act on a ring: 20 N east, 30 N at 60° north of east and 25 N south. (a) Find the east and north components of the resultant. (b) Calculate its magnitude.', mag(20 + 30 * cos(radians(60)), 30 * sin(radians(60)) - 25), 'N',
  f'(a) East: 20 + 30 cos 60° = 35 N; north: 30 sin 60° − 25 = {sf(30 * sin(radians(60)) - 25, 3)} N. (b) F = √(35² + {sf(30 * sin(radians(60)) - 25, 3)}²) = {sf(mag(35, 30 * sin(radians(60)) - 25))} N',
  ['C1: east', 'C1: north', 'M1: Pythagoras', 'C1: value'], aq='F')
N('H', 6, 'A 0.15 kg ball hits a wall at 20 m s⁻¹ at 45° to the wall and rebounds at 20 m s⁻¹ at 45° on the other side. (a) Explain which component of velocity changes. (b) Calculate the magnitude of the change in momentum. (c) State its direction.', 0.15 * 2 * 20 * sin(radians(45)), 'kg m s⁻¹',
  f'(a) Only the component perpendicular to the wall reverses. (b) |Δp| = 0.15 × 2 × 20 × sin 45° = {sf(0.15 * 40 * sin(radians(45)))} kg m s⁻¹. (c) Perpendicular to the wall, away from it.',
  ['B1: perpendicular component reverses', 'C1: component', 'M1: doubled × mass', 'C1: value', 'B1: direction'], aq='Δp')
N('H', 5, 'Two forces of 8.0 N and 6.0 N act at 60° to each other. (a) Calculate the magnitude of the resultant. (b) Calculate the angle between the resultant and the 8.0 N force.', degrees(atan(6.0 * sin(radians(60)) / (8.0 + 6.0 * cos(radians(60))))), '°',
  f'(a) Components along 8.0 N: 8.0 + 6.0 cos 60° = 11 N; across: 6.0 sin 60° = {sf(6 * sin(radians(60)), 4)} N; F = √(11² + {sf(6 * sin(radians(60)), 4)}²) = {sf(mag(11, 6 * sin(radians(60))))} N. (b) θ = tan⁻¹({sf(6 * sin(radians(60)), 4)} ÷ 11) = {sf(degrees(atan(6 * sin(radians(60)) / 11)))}°',
  ['C1: components', 'C1: magnitude', 'M1: tan θ', 'C1: value'], aq='θ')
N('H', 6, 'A 2.0 kg trolley moves at 3.0 m s⁻¹ east and a 1.5 kg trolley at 4.0 m s⁻¹ north. (a) Calculate each momentum. (b) Calculate the magnitude of the total momentum. (c) Calculate the total kinetic energy, and explain why it is found by simple addition.', 0.5 * 2.0 * 9 + 0.5 * 1.5 * 16, 'J',
  f'(a) 6.0 kg m s⁻¹ east; 6.0 kg m s⁻¹ north. (b) p = √(6.0² + 6.0²) = {sf(6 * sqrt(2))} kg m s⁻¹. (c) E = 0.5 × 2.0 × 3.0² + 0.5 × 1.5 × 4.0² = 21 J; energy is a scalar.',
  ['C1: momenta', 'M1: vector addition', 'C1: magnitude', 'C1: KE', 'B1: scalar'], sig=2, aq='E')
N('H', 5, 'A lamp of weight 40 N hangs from two cables, each at 30° to the vertical. (a) Explain why the horizontal components of tension cancel. (b) Calculate the tension in each cable.', 40 / (2 * cos(radians(30))), 'N',
  f'(a) The cables are symmetrical and the lamp is in equilibrium. (b) 2T cos 30° = 40, so T = 40 ÷ (2 × cos 30°) = {sf(40 / (2 * cos(radians(30))))} N',
  ['B1: symmetry/equilibrium', 'M1: vertical components = weight', 'C1: rearrange', 'C1: value'], aq='T')
N('H', 6, 'Forces of 15 N north, 20 N east and F act on a point in equilibrium. (a) Explain what equilibrium means for the vector sum. (b) Calculate the magnitude of F. (c) Calculate its direction as an angle west of south.', degrees(atan(20 / 15)), '°',
  f'(a) The resultant of all three is zero. (b) F = √(15² + 20²) = 25 N. (c) F points south-west: θ = tan⁻¹(20 ÷ 15) = {sf(degrees(atan(20 / 15)))}° west of south',
  ['B1: zero resultant', 'M1: F equal and opposite to resultant of others', 'C1: magnitude', 'M1: angle', 'C1: value'], aq='θ')
N('H', 5, 'A crate is pulled with 120 N at 30° above the horizontal while friction is 70 N. (a) Calculate the horizontal component of the pull. (b) Calculate the resultant horizontal force.', 120 * cos(radians(30)) - 70, 'N',
  f'(a) 120 cos 30° = {sf(120 * cos(radians(30)), 4)} N. (b) F = {sf(120 * cos(radians(30)), 4)} − 70 = {sf(120 * cos(radians(30)) - 70)} N',
  ['C1: component', 'C1: value', 'M1: subtract friction', 'C1: value'], aq='F')
N('H', 6, 'A boat is towed by two tugs. Tug A pulls with 4.0 kN at 20° to the boat\'s axis and tug B with 5.0 kN at 15° on the other side. (a) Calculate the forward component of each pull. (b) Calculate the total forward force, in kN. (c) Calculate the net sideways force, in kN.', 5.0 * sin(radians(15)) - 4.0 * sin(radians(20)), 'kN',
  f'(a) 4.0 cos 20° = {sf(4 * cos(radians(20)), 4)} kN; 5.0 cos 15° = {sf(5 * cos(radians(15)), 4)} kN. (b) {sf(4 * cos(radians(20)) + 5 * cos(radians(15)), 3)} kN. (c) 5.0 sin 15° − 4.0 sin 20° = {sf(5 * sin(radians(15)) - 4 * sin(radians(20)), 2)} kN towards the side of tug B',
  ['C1: forward A', 'C1: forward B', 'C1: total', 'M1: sideways components', 'C1: value'], sig=2, aq='F_side')
N('H', 5, 'An aircraft of mass 2.0 × 10⁵ kg changes velocity from 220 m s⁻¹ east to 220 m s⁻¹ north. (a) Calculate |Δv|. (b) Calculate the magnitude of the change in momentum, in units of 10⁷ kg m s⁻¹.', 2.0e5 * 220 * sqrt(2), '10⁷ kg m s⁻¹',
  f'(a) |Δv| = √(220² + 220²) = {sf(220 * sqrt(2), 4)} m s⁻¹. (b) |Δp| = 2.0 × 10⁵ × {sf(220 * sqrt(2), 4)} = {sf(2e5 * 220 * sqrt(2))} kg m s⁻¹',
  ['M1: perpendicular velocities', 'C1: |Δv|', 'M1: × mass', 'C1: value'], aq='Δp')
M('E', 1, 'Which of these is not a vector: force, displacement, density, momentum?', 'Density', ['Force', 'Displacement', 'Momentum'], 'Density is mass per unit volume, a scalar.')
M('E', 1, 'Which of these quantities is a vector: power, work, weight, energy?', 'Weight', ['Power', 'Work', 'Energy'], 'Weight is a force acting downwards.')
N('E', 2, 'Forces of 9.0 N north and 12 N east act on a buoy. Calculate the magnitude of the resultant force.', 15, 'N',
  'F = √(9.0² + 12²) = 15 N', ['C1: Pythagoras'], sig=2, aq='F')
N('M', 3, 'A 3.0 kg mass hangs at rest. Calculate its weight and state its direction.' + take('g'), 3.0 * 9.81, 'N',
  'W = mg = 3.0 × 9.81 = 29.4 N, vertically downwards', ['C1: W = mg', 'C1: direction'], aq='W')
M('M', 3, 'A car\'s speedometer shows 20 m s⁻¹ and its compass shows due north. Which quantity do the two readings together give?', 'Its velocity', ['Its speed only', 'Its acceleration', 'Its displacement'], 'Velocity = speed with a direction.', ['C1: magnitude', 'C1: direction'])
N('M', 3, 'A kite string pulls with 25 N at 50° to the horizontal. Calculate the horizontal component of the pull.', 25 * cos(radians(50)), 'N',
  f'F_x = 25 cos 50° = {sf(25 * cos(radians(50)))} N', ['C1: cosine', 'C1: value'], aq='F_x')
N('H', 5, 'Four forces act on a point: 10 N north, 10 N east, 10 N south and an unknown force F west. The resultant is 4.0 N east. (a) Explain why the north and south forces cancel. (b) Calculate F.', 10 - 4.0, 'N',
  '(a) They are equal and opposite. (b) 10 − F = 4.0, so F = 10 − 4.0 = 6.0 N', ['B1: cancel', 'M1: east − west = resultant', 'C1: rearrange', 'C1: value'], sig=2, aq='F')
