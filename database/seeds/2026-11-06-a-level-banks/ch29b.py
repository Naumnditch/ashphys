# Chapter 29 Nuclear physics — part b: 29.5 to 29.8.
NA_ = 6.02e23
LN2 = log(2)
YR = 3.16e7          # seconds in a year, as stated in stems that use it


def half(t, th):
    return 0.5 ** (t / th)


# ═════════════════════════ 29.5 Randomness and radioactive decay (17/18/9) ═════════════════════════
lesson('29.5')
N('E', 2, 'A tracer solution holds 3.0 × 10¹⁵ radioactive nuclei, each with a probability of 2.0 × 10⁻⁹ of decaying per second. What is the activity of the solution?', 3.0e15 * 2.0e-9, 'Bq',
  'A = λN = 2.0 × 10⁻⁹ × 3.0 × 10¹⁵ = 6.0 × 10⁶ Bq', ['C1: A = λN'], sig=2, aq='A')
M('E', 1, 'Radioactive decay is described as spontaneous. What does this mean?', 'It is not affected by external conditions such as temperature or pressure', ['It happens only when the nucleus is struck', 'Every nucleus decays at the same moment', 'It can be speeded up by heating'], 'Decay depends only on the nucleus itself.')
N('E', 2, 'A source has an activity of 4.5 × 10⁴ Bq and a decay constant of 1.5 × 10⁻⁵ s⁻¹. How many undecayed nuclei does it contain?', 4.5e4 / 1.5e-5, None,
  'N = A/λ = 4.5 × 10⁴ ÷ 1.5 × 10⁻⁵ = 3.0 × 10⁹', ['C1: N = A/λ'], sig=2, aq='N')
M('E', 1, 'Which of these is equal to an activity of one becquerel?', 'One decay per second', ['One count per minute', 'The activity of 1 g of radium', 'One nucleus remaining'], 'Activity is the number of decays per unit time.')
N('E', 2, 'A sample of 6.0 × 10¹⁰ nuclei has an activity of 2.4 × 10³ Bq. Calculate the decay constant.', 2.4e3 / 6.0e10, 's⁻¹',
  'λ = A/N = 2.4 × 10³ ÷ 6.0 × 10¹⁰ = 4.0 × 10⁻⁸ s⁻¹', ['C1: λ = A/N'], sig=2, aq='λ')
M('E', 1, 'What does the decay constant λ of an isotope represent?', 'The probability per unit time that any one nucleus decays', ['The time for half the nuclei to decay', 'The number of nuclei decaying each second', 'The energy released per decay'], 'For a large sample, A = λN.')
N('E', 2, 'A detector records 85 counts per minute near a source, and 20 counts per minute with the source removed. Calculate the corrected count rate in counts per minute.', 85 - 20, 'counts per minute',
  'Corrected = 85 − 20 = 65 counts per minute', ['C1: subtract background'], sig=2, aq='count rate')
M('E', 1, 'Radioactive decay is random. What does this mean?', 'It is impossible to predict which nucleus will decay next or when', ['Nuclei decay in a fixed order', 'Every nucleus decays after the same time', 'Decay happens only when a nucleus is disturbed'], 'Only the probability of decay is fixed.')
N('E', 2, 'An isotope has a decay constant of 0.020 s⁻¹. What is the percentage chance that a particular nucleus decays in the next second?', 0.020 * 100, '%',
  'Probability per second = λ: 0.020 × 100 = 2.0 %', ['C1: probability per second = λ'], sig=2, aq='probability')
M('E', 1, 'Repeated counts from a steady source over equal times give slightly different results. Why?', 'Radioactive decay is random', ['The detector is faulty', 'The source is losing activity quickly', 'The background is zero'], 'Random processes fluctuate about a mean.')
N('E', 2, 'A source has a steady activity of 500 Bq. How many decays occur in 10 s?', 500 * 10, None,
  'Decays = A × t = 500 × 10 = 5000', ['C1: decays = activity × time'], sig=2, aq='decays')
M('E', 1, 'A detector\'s count rate from a source is less than the source\'s activity. Why?', 'Radiation goes off in all directions and not all of it entering the detector is detected', ['Some nuclei decay without emitting anything', 'The source decays more slowly near a detector', 'The background reduces the count'], 'Only a fraction of emissions reach and register in the detector.')
N('E', 2, 'A source undergoes 2.4 × 10⁵ decays each minute. Calculate its activity in Bq.', 2.4e5 / 60, 'Bq',
  'A = 2.4 × 10⁵ ÷ 60 = 4000 Bq', ['C1: per second'], sig=2, aq='A')
M('E', 1, 'The number of undecayed nuclei in a sample is doubled. What happens to the activity?', 'It doubles', ['It halves', 'It is unchanged', 'It quadruples'], 'A = λN, so with λ fixed the activity is proportional to N.')
N('E', 2, 'A source of activity 2000 Bq gives a corrected count rate of 50 s⁻¹. What percentage of the decays are counted?', 50 / 2000 * 100, '%',
  'Percentage = 50 ÷ 2000 × 100 = 2.5 %', ['C1: count rate ÷ activity'], sig=2, aq='percentage')
M('E', 1, 'Which change alters the rate at which a radioactive sample decays?', 'None of these: heating, compressing or chemically combining the sample', ['Heating the sample strongly', 'Putting it under high pressure', 'Combining it chemically with another element'], 'Nuclear decay is unaffected by physical or chemical conditions.')
N('E', 1, 'A sample contains 1.0 × 10⁶ nuclei with decay constant 3.0 × 10⁻⁴ s⁻¹. How many are expected to decay in the next second?', 1.0e6 * 3.0e-4, None,
  'Expected decays = λN = 3.0 × 10⁻⁴ × 1.0 × 10⁶ = 300', [], sig=2, aq='decays')
# medium
N('M', 3, 'A sample contains 1.0 µg of radium-226 (molar mass 0.226 kg mol⁻¹), whose decay constant is 1.37 × 10⁻¹¹ s⁻¹. Calculate its activity.' + take('NA'), 1.0e-9 / 0.226 * NA_ * 1.37e-11, 'Bq',
  f'N = 1.0 × 10⁻⁹ ÷ 0.226 × 6.02 × 10²³ = {sf(1e-9 / 0.226 * NA_, 4)}. A = 1.37 × 10⁻¹¹ × {sf(1e-9 / 0.226 * NA_, 4)} = {sf(1e-9 / 0.226 * NA_ * 1.37e-11)} Bq', ['C1: N from mass', 'C1: A = λN'], aq='A')
N('M', 4, 'A radium-226 source (molar mass 0.226 kg mol⁻¹, decay constant 1.37 × 10⁻¹¹ s⁻¹) has an activity of 3.7 × 10¹⁰ Bq. Calculate the mass of radium in mg.' + take('NA'), 3.7e10 / 1.37e-11 / NA_ * 0.226 * 1e6, 'mg',
  f'N = A/λ = 3.7 × 10¹⁰ ÷ 1.37 × 10⁻¹¹ = {sf(3.7e10 / 1.37e-11, 4)}. m = {sf(3.7e10 / 1.37e-11, 4)} ÷ 6.02 × 10²³ × 0.226 = {sf(3.7e10 / 1.37e-11 / NA_ * 0.226, 4)} kg. In mg: {sf(3.7e10 / 1.37e-11 / NA_ * 0.226, 4)} × 10⁶ = {sf(3.7e10 / 1.37e-11 / NA_ * 0.226 * 1e6)}',
  ['C1: N = A/λ', 'C1: moles × molar mass', 'C1: kg to mg'], aq='m')
M('M', 3, 'A count of N is taken from a random source. Roughly how large is the random uncertainty in it?', '√N', ['N', 'N/2', '1'], 'Random counts scatter by about √N, so larger counts are relatively more precise.', ['C1: Poisson spread', 'C1: √N'])
N('M', 3, 'A count of 400 is recorded in a fixed time. Estimate the percentage uncertainty in the count, taking the uncertainty as √N.', sqrt(400) / 400 * 100, '%',
  '√400 = 20. Percentage = 20 ÷ 400 × 100 = 5.0 %', ['C1: √N', 'C1: percentage'], sig=2, aq='uncertainty')
N('M', 4, 'How many counts must be recorded for the random uncertainty, taken as √N, to be 2.0% of the count?', (1 / 0.020) ** 2, None,
  '√N/N = 1/√N = 0.020, so N = (1 ÷ 0.020)² = 2500', ['M1: √N ÷ N = 1/√N', 'C1: equation', 'C1: value'], sig=2, aq='N')
M('M', 3, 'In a class model, many dice are thrown and every die showing a six is removed. What does this model?', 'Random decay with a fixed probability (1/6) per throw for each die', ['A decay that speeds up as the sample shrinks', 'All nuclei decaying at the same moment', 'A constant number decaying per throw'], 'Each die has the same chance each throw, like λ for a nucleus.', ['C1: fixed probability', 'C1: number removed ∝ number left'])
N('M', 3, 'In the dice model, 600 dice are thrown and the sixes removed, then the rest are thrown again. Predict the number left after two throws.', 600 * (5 / 6) ** 2, None,
  f'Each throw leaves 5/6: N = 600 × (5 ÷ 6)² = {sf(600 * (5 / 6) ** 2)}', ['C1: factor 5/6 each throw', 'C1: two throws'], aq='N')
N('M', 3, 'A source has an activity of 5000 Bq, and 1.2% of its emissions are counted by a detector. Calculate the count rate due to the source in counts s⁻¹.', 5000 * 0.012, 'counts s⁻¹',
  'Count rate = 0.012 × 5000 = 60 counts s⁻¹', ['C1: fraction counted', 'C1: × activity'], sig=2, aq='count rate')
M('M', 3, 'Why does counting for a longer time give a more reliable count rate from a radioactive source?', 'The relative random uncertainty √N/N gets smaller as the count N increases', ['The source becomes more active', 'The background falls with time', 'The detector warms up'], 'Bigger counts reduce the fractional scatter.', ['C1: √N/N = 1/√N', 'C1: falls as N grows'])
N('M', 3, 'On average, 1 in 5000 nuclei of an isotope decays each second. Calculate its decay constant.', 1 / 5000, 's⁻¹',
  'λ = probability per second = 1 ÷ 5000 = 2.0 × 10⁻⁴ s⁻¹', ['C1: λ as a probability', 'C1: value'], sig=2, aq='λ')
N('M', 4, 'A detector records 1200 counts in 5.0 minutes near a source. The background rate is 0.40 counts s⁻¹. Calculate the corrected count rate due to the source in counts s⁻¹.', 1200 / 300 - 0.40, 'counts s⁻¹',
  'Total rate = 1200 ÷ 300 = 4.0 counts s⁻¹. Corrected = 4.0 − 0.40 = 3.6 counts s⁻¹', ['C1: minutes to seconds', 'C1: total rate', 'C1: subtract background'], sig=2, aq='count rate')
M('M', 3, 'Two sources have the same activity. Source X has a smaller decay constant than source Y. Which statement is correct?', 'X contains more undecayed nuclei', ['Y contains more undecayed nuclei', 'They contain the same number of nuclei', 'X has the shorter half-life'], 'N = A/λ: for equal A, smaller λ means larger N.', ['C1: N = A/λ', 'C1: inverse'])
N('M', 3, 'One mole of a nuclide has a decay constant of 1.0 × 10⁻¹⁰ s⁻¹. Calculate its activity.' + take('NA'), NA_ * 1.0e-10, 'Bq',
  'A = λN = 1.0 × 10⁻¹⁰ × 6.02 × 10²³ = 6.02 × 10¹³ Bq', ['C1: N = N_A', 'C1: A = λN'], aq='A')
N('M', 3, 'An iodine-131 source in a hospital has an activity of 8.0 × 10⁵ Bq and a decay constant of 1.0 × 10⁻⁶ s⁻¹. How many iodine-131 nuclei does it contain?', 8.0e5 / 1.0e-6, None,
  'N = A/λ = 8.0 × 10⁵ ÷ 1.0 × 10⁻⁶ = 8.0 × 10¹¹', ['C1: N = A/λ', 'C1: value'], sig=2, aq='N')
M('M', 3, 'Which are major sources of background radiation in most places?', 'Radon gas, rocks and soil, and cosmic rays', ['Mobile phones and radio masts', 'Microwave ovens', 'Sunlight and visible light'], 'Natural sources dominate the background count.', ['C1: natural sources', 'C1: radon a major part'])
N('M', 3, 'A source has a steady activity of 2.0 × 10⁴ Bq. How many decays happen in one hour?', 2.0e4 * 3600, None,
  'Decays = 2.0 × 10⁴ × 3600 = 7.2 × 10⁷', ['C1: hour to seconds', 'C1: decays = A × t'], sig=2, aq='decays')
M('M', 3, 'For a sample of N nuclei, how many are expected to decay in a short time Δt?', 'λNΔt', ['λΔt', 'N/λΔt', 'NΔt/λ'], 'Each nucleus has probability λΔt of decaying.', ['C1: probability λΔt each', 'C1: × N'])
N('M', 3, 'A GM tube records 2.4 × 10³ counts in 1.0 minute from a source whose activity is 1.0 × 10⁵ Bq. What percentage of the decays does it record? (Ignore background.)', 2.4e3 / 60 / 1.0e5 * 100, '%',
  'Count rate = 2.4 × 10³ ÷ 60 = 40 s⁻¹. Percentage = 40 ÷ 1.0 × 10⁵ × 100 = 0.040 %', ['C1: counts per second', 'C1: ratio × 100'], sig=2, aq='percentage')
# hard
N('H', 5, 'A cobalt-60 source contains 1.0 mg of cobalt-60 (molar mass 0.060 kg mol⁻¹), whose decay constant is 4.17 × 10⁻⁹ s⁻¹. (a) Calculate the number of moles. (b) Calculate the number of nuclei. (c) Calculate the activity.' + take('NA'), 1.0e-6 / 0.060 * NA_ * 4.17e-9, 'Bq',
  f'(a) n = 1.0 × 10⁻⁶ ÷ 0.060 = {sf(1e-6 / 0.06, 4)} mol. (b) N = {sf(1e-6 / 0.06, 4)} × 6.02 × 10²³ = {sf(1e-6 / 0.06 * NA_, 4)}. (c) A = 4.17 × 10⁻⁹ × {sf(1e-6 / 0.06 * NA_, 4)} = {sf(1e-6 / 0.06 * NA_ * 4.17e-9)} Bq',
  ['C1: mg to kg', 'C1: moles', 'C1: nuclei', 'C1: A = λN'], aq='A')
N('H', 6, 'A smoke detector contains 0.30 µg of americium-241 (molar mass 0.241 kg mol⁻¹, decay constant 5.08 × 10⁻¹¹ s⁻¹). (a) Calculate the number of nuclei. (b) Calculate the activity. (c) Explain why the activity hardly changes during the life of the detector. Give only the answer to (b).' + take('NA'), 0.30e-9 / 0.241 * NA_ * 5.08e-11, 'Bq',
  f'(a) N = 0.30 × 10⁻⁹ ÷ 0.241 × 6.02 × 10²³ = {sf(0.3e-9 / 0.241 * NA_, 4)}. (b) A = 5.08 × 10⁻¹¹ × {sf(0.3e-9 / 0.241 * NA_, 4)} = {sf(0.3e-9 / 0.241 * NA_ * 5.08e-11)} Bq. (c) λ is tiny, so only a minute fraction decays in ten years.',
  ['C1: µg to kg', 'C1: number of nuclei', 'M1: A = λN', 'C1: value', 'B1: small λ, long half-life'], aq='A')
N('H', 5, 'A detector records 900 counts in 3.0 minutes from a source. The background is 25 counts per minute. (a) Calculate the count rate. (b) Calculate the corrected count rate in counts per minute. (c) Estimate the percentage uncertainty in the 900 counts.', 900 / 3.0 - 25, 'counts per minute',
  '(a) 900 ÷ 3.0 = 300 counts per minute. (b) 300 − 25 = 275 counts per minute. (c) √900 = 30, which is 3.3 %.',
  ['C1: rate', 'M1: subtract background', 'C1: value', 'B1: √N uncertainty'], sig=3, aq='count rate')
N('H', 5, 'In a sample of 2.0 × 10⁹ nuclei, 3.0 × 10⁴ decay in 10 s. Assume the number of nuclei hardly changes in this time. (a) Calculate the activity. (b) Calculate the decay constant.', 3.0e4 / 10 / 2.0e9, 's⁻¹',
  '(a) A = 3.0 × 10⁴ ÷ 10 = 3000 Bq. (b) λ = A/N = 3000 ÷ 2.0 × 10⁹ = 1.5 × 10⁻⁶ s⁻¹',
  ['C1: decays per second', 'M1: λ = A/N', 'C1: value', 'B1: N almost constant'], sig=2, aq='λ')
N('H', 6, 'A class throws 1200 dice repeatedly, removing the sixes each time. (a) Predict the number left after 5 throws. (b) Show that the "half-life" n in throws satisfies (5/6)ⁿ = 0.5. (c) Calculate n.', log(2) / log(6 / 5), None,
  f'(a) 1200 × (5/6)⁵ = {sf(1200 * (5 / 6) ** 5)}. (b) Half remain when (5/6)ⁿ = 1/2. (c) n = ln 2 ÷ ln(6 ÷ 5) = {sf(log(2) / log(6 / 5))}',
  ['C1: number left', 'B1: half-life condition', 'M1: take logs', 'C1: rearranged', 'C1: value'], aq='n')
N('H', 5, 'Air in a room of volume 50 m³ contains radon with an activity of 100 Bq per m³. The decay constant of radon-222 is 2.1 × 10⁻⁶ s⁻¹. (a) Calculate the total radon activity. (b) Calculate the number of radon nuclei in the room.', 100 * 50 / 2.1e-6, None,
  f'(a) A = 100 × 50 = 5000 Bq. (b) N = A/λ = 5000 ÷ 2.1 × 10⁻⁶ = {sf(5000 / 2.1e-6)}',
  ['C1: total activity', 'M1: N = A/λ', 'C1: substitution', 'C1: value'], aq='N')
N('H', 6, 'A patient is given technetium-99m with an activity of 400 MBq. Its decay constant is 3.2 × 10⁻⁵ s⁻¹ and its molar mass is 0.099 kg mol⁻¹. (a) Calculate the number of technetium nuclei. (b) Calculate their mass. Give only the answer to (b), in units of 10⁻¹² kg.' + take('NA'), 400e6 / 3.2e-5 / NA_ * 0.099, '10⁻¹² kg',
  f'(a) N = 400 × 10⁶ ÷ 3.2 × 10⁻⁵ = {sf(400e6 / 3.2e-5, 4)}. (b) m = {sf(400e6 / 3.2e-5, 4)} ÷ 6.02 × 10²³ × 0.099 = {sf(400e6 / 3.2e-5 / NA_ * 0.099)} kg',
  ['C1: MBq to Bq', 'C1: N = A/λ', 'M1: mass = (N/N_A) × M', 'C1: substitution', 'C1: value'], aq='m')
N('H', 5, 'A γ-source gives a corrected count rate of 120 counts s⁻¹ at 10 cm from a detector. Assuming an inverse-square law and no absorption, (a) state how the rate depends on distance, and (b) calculate the corrected count rate at 20 cm.', 120 * (10 / 20) ** 2, 'counts s⁻¹',
  '(a) Rate ∝ 1/d². (b) 120 × (10 ÷ 20)² = 30 counts s⁻¹',
  ['B1: inverse square', 'M1: ratio of squares', 'C1: substitution', 'C1: value'], sig=2, aq='count rate')
N('H', 6, 'Equal masses of strontium-90 (molar mass 0.090 kg mol⁻¹, λ = 7.6 × 10⁻¹⁰ s⁻¹) and caesium-137 (molar mass 0.137 kg mol⁻¹, λ = 7.3 × 10⁻¹⁰ s⁻¹) are compared. (a) Show that the number of nuclei is inversely proportional to the molar mass. (b) Calculate (activity of strontium) ÷ (activity of caesium).', (7.6e-10 / 0.090) / (7.3e-10 / 0.137), None,
  f'(a) N = (m/M)N_A, so N ∝ 1/M for equal m. (b) A ∝ λ/M: ratio = (7.6 × 10⁻¹⁰ ÷ 0.090) ÷ (7.3 × 10⁻¹⁰ ÷ 0.137) = {sf((7.6e-10 / 0.090) / (7.3e-10 / 0.137))}',
  ['B1: N ∝ 1/M', 'M1: A = λN', 'C1: ratio expression', 'C1: substitution', 'C1: value'], aq='ratio')

N('E', 2, 'A source contains 4.0 × 10¹² nuclei and has an activity of 1.0 × 10⁸ Bq. What is the probability that a given nucleus decays in the next second?', 1.0e8 / 4.0e12, None,
  'Probability per second = λ = A/N = 1.0 × 10⁸ ÷ 4.0 × 10¹² = 2.5 × 10⁻⁵', ['C1: λ = A/N'], sig=2, aq='probability')
M('M', 3, 'Two equal samples of the same isotope are kept at 20 °C and at 800 °C. How do their activities compare?', 'They are the same, because nuclear decay does not depend on temperature', ['The hotter sample is more active', 'The cooler sample is more active', 'The hotter sample stops decaying'], 'Nuclear processes are unaffected by the thermal energy of atoms.', ['C1: decay spontaneous', 'C1: same λ, same N'])
N('M', 3, 'A source of activity 6.0 × 10⁴ Bq contains 1.5 × 10¹² undecayed nuclei. Calculate 1/λ, the mean lifetime of a nucleus of this isotope, in seconds.', 1.5e12 / 6.0e4, 's',
  'λ = A/N = 6.0 × 10⁴ ÷ 1.5 × 10¹² = 4.0 × 10⁻⁸ s⁻¹. 1/λ = 1.5 × 10¹² ÷ 6.0 × 10⁴ = 2.5 × 10⁷ s', ['C1: λ = A/N', 'C1: 1/λ'], sig=2, aq='1/λ')

# ═════════════════════════ 29.6 The mathematics of radioactive decay (17/18/9) ═════════════════════════
lesson('29.6')
N('E', 2, 'What fraction of a radioactive sample remains undecayed after six half-lives?', 0.5 ** 6, None,
  'Fraction = (1/2)⁶ = 0.5^6 = 0.0156', ['C1: (1/2)ⁿ'], aq='fraction')
M('E', 1, 'In N = N₀e^(−λt), what does N₀ represent?', 'The number of undecayed nuclei at t = 0', ['The number decayed after time t', 'The half-life', 'The number left after one half-life'], 'N₀ is the starting number of undecayed nuclei.')
N('E', 2, 'The decay constant of an isotope in a laboratory test source is 0.0030 s⁻¹. How long does it take for half of its nuclei to decay?', LN2 / 0.0030, 's',
  f't½ = ln 2 ÷ λ = 0.693 ÷ 0.0030 = {sf(LN2 / 0.003)} s', ['C1: t½ = ln 2/λ'], aq='t½')
M('E', 1, 'What is the half-life of a radioactive isotope?', 'The mean time for half the undecayed nuclei in a sample to decay', ['Half the time for all the nuclei to decay', 'The time for one nucleus to decay', 'The time for the activity to fall to zero'], 'After each half-life N and A halve.')
N('E', 2, 'Iodine-131 has a half-life of 8.0 days. Calculate its decay constant in s⁻¹.', LN2 / (8.0 * 86400), 's⁻¹',
  f't½ = 8.0 × 86400 = 6.912 × 10⁵ s. λ = 0.693 ÷ 6.912 × 10⁵ = {sf(LN2 / (8.0 * 86400))} s⁻¹', ['C1: days to s, then λ = ln 2/t½'], aq='λ')
M('E', 1, 'A source has an activity of 640 Bq. What will its activity be after one half-life?', '320 Bq', ['160 Bq', '0 Bq', '640 Bq'], 'Activity halves in each half-life.')
N('E', 2, 'A sample starts with 8.0 × 10¹² undecayed nuclei. How many remain after three half-lives?', 8.0e12 / 8, None,
  'N = 8.0 × 10¹² × (1/2)³ = 1.0 × 10¹²', ['C1: halve three times'], sig=2, aq='N')
M('E', 1, 'Which equation links the decay constant λ and the half-life t½?', 'λt½ = ln 2', ['λ = t½ ln 2', 'λ/t½ = ln 2', 'λt½ = 2'], 'Setting N = N₀/2 in N = N₀e^(−λt) gives λt½ = ln 2.')
N('E', 2, 'For an isotope with λ = 0.050 s⁻¹, calculate the fraction of nuclei remaining after 20 s.', exp(-0.050 * 20), None,
  f'N/N₀ = e^(−λt) = e^(−0.050 × 20) = {sf(exp(-1.0))}', ['C1: N/N₀ = e^(−λt)'], aq='fraction')
M('E', 1, 'What is the shape of a graph of the number of undecayed nuclei against time?', 'An exponential decay curve', ['A straight line falling to zero', 'A straight line rising', 'A parabola'], 'Equal fractions decay in equal times.')
N('E', 2, 'A source of half-life 6.0 h has an activity of 1600 Bq. Calculate its activity 24 h later.', 1600 * half(24, 6.0), 'Bq',
  'Four half-lives: A = 1600 × (1/2)⁴ = 100 Bq', ['C1: number of half-lives'], sig=2, aq='A')
M('E', 1, 'Which is a correct unit for the decay constant?', 's⁻¹', ['s', 'Bq s', 'kg s⁻¹'], 'λ is a probability per unit time.')
N('E', 2, 'Cobalt-60 has a half-life of 5.3 years. How many years do three half-lives take?', 3 * 5.3, 'years',
  't = 3 × 5.3 = 15.9 years', ['C1: 3 × t½'], aq='t')
M('E', 1, 'A sample contains 1000 radioactive nuclei. After one half-life, how many remain undecayed?', 'About 500, but not exactly, because decay is random', ['Exactly 500', 'Exactly 250', 'None'], 'Half-life describes the average behaviour of large samples.')
N('E', 2, 'What percentage of a sample has decayed after two half-lives?', (1 - 0.25) * 100, '%',
  'Remaining = 1/4, so decayed = (1 − 0.25) × 100 = 75 %', ['C1: 1 − (1/2)²'], sig=2, aq='decayed')
N('E', 2, 'Over what time does the activity of a source halve if its decay constant is 2.5 × 10⁻³ s⁻¹?', LN2 / 2.5e-3, 's',
  f't½ = 0.693 ÷ 2.5 × 10⁻³ = {sf(LN2 / 2.5e-3)} s', ['C1: t½ = ln 2/λ'], aq='t½')
N('E', 1, 'Starting from 1200 Bq, a source decays for a time equal to two of its half-lives. What activity remains?', 1200 / 4, 'Bq',
  'A = 1200 × (1/2)² = 300 Bq', [], sig=2, aq='A')
# medium
N('M', 3, 'In a sample, 2.0% of the remaining nuclei decay each second on average (λ = 0.020 s⁻¹). It begins with 5.0 × 10¹⁰ undecayed nuclei. How many are left after one minute?', 5.0e10 * exp(-0.020 * 60), None,
  f'N = 5.0 × 10¹⁰ × e^(−0.020 × 60) = {sf(5e10 * exp(-1.2))}', ['C1: N = N₀e^(−λt)', 'C1: λt = 1.2'], aq='N')
N('M', 3, 'A medical isotope with a 4.0-hour half-life is delivered with an activity of 1000 Bq. What activity does it have 10 hours after delivery?', 1000 * half(10, 4.0), 'Bq',
  f'A = 1000 × 0.5^(10 ÷ 4.0) = {sf(1000 * half(10, 4))} Bq', ['C1: number of half-lives = 2.5', 'C1: A = A₀(½)^n'], aq='A')
N('M', 4, 'The activity of a sample falls from 2400 Bq to 300 Bq. Its half-life is 2.5 minutes. How long does this take, in seconds?', 3 * 2.5 * 60, 's',
  '2400 → 1200 → 600 → 300 is three half-lives: t = 3 × 2.5 × 60 = 450 s', ['M1: count halvings', 'C1: three half-lives', 'C1: minutes to seconds'], sig=2, aq='t')
N('M', 3, 'An isotope has a decay constant of 0.10 s⁻¹. How long does it take for the activity to fall to 10% of its starting value?', log(10) / 0.10, 's',
  f'0.10 = e^(−0.10t), so t = ln 10 ÷ 0.10 = {sf(log(10) / 0.10)} s', ['C1: A/A₀ = e^(−λt)', 'C1: take logs'], aq='t')
M('M', 3, 'Samples of isotopes P (half-life 2 min) and Q (half-life 20 min) start with the same number of nuclei. Which has the greater initial activity?', 'P, because it has the larger decay constant', ['Q, because it lasts longer', 'They have equal activities', 'It depends on their masses'], 'A = λN and λ = ln 2/t½.', ['C1: A = λN', 'C1: shorter t½ means larger λ'])
N('M', 3, 'Iodine-131 has a half-life of 8.0 days. What fraction of a sample remains after 10 days?', half(10, 8.0), None,
  f'Fraction = 0.5^(10 ÷ 8.0) = {sf(half(10, 8.0))}', ['C1: n = t/t½', 'C1: (½)ⁿ'], aq='fraction')
N('M', 4, 'A hospital receives iodine-131 (half-life 8.0 days) with an activity of 4.0 × 10⁸ Bq. Calculate its activity 30 days later.', 4.0e8 * half(30, 8.0), 'Bq',
  f'A = 4.0 × 10⁸ × 0.5^(30 ÷ 8.0) = {sf(4e8 * half(30, 8.0))} Bq', ['C1: t/t½ = 3.75', 'C1: (½)^3.75', 'C1: value'], aq='A')
N('M', 3, 'The activity of a sample falls from 640 Bq to 40 Bq in 20 minutes. Calculate the half-life in seconds.', 20 / 4 * 60, 's',
  '640 → 40 is a factor of 16 = 2⁴, so four half-lives: t½ = 20 ÷ 4 × 60 = 300 s', ['C1: factor of 16', 'C1: four half-lives'], sig=2, aq='t½')
M('M', 3, 'What fraction of the original nuclei decay during the second half-life?', 'One quarter', ['One half', 'Three quarters', 'One eighth'], 'Half remain after one t½; half of those (¼ of the original) decay in the next.', ['C1: ½ left after first', 'C1: ¼ decays in second'])
N('M', 3, 'An isotope has a decay constant of 0.30 s⁻¹. Calculate the fraction of nuclei left after 5.0 s.', exp(-1.5), None,
  f'N/N₀ = e^(−0.30 × 5.0) = {sf(exp(-1.5))}', ['C1: e^(−λt)', 'C1: λt = 1.5'], aq='fraction')
N('M', 3, 'The number of undecayed nuclei in a sample falls from 6.0 × 10⁹ to 1.5 × 10⁹ in 40 s. Calculate the decay constant.', LN2 / 20, 's⁻¹',
  f'A factor of 4 is two half-lives, so t½ = 20 s. λ = 0.693 ÷ 20 = {sf(LN2 / 20)} s⁻¹', ['C1: two half-lives', 'C1: λ = ln 2/t½'], aq='λ')
M('M', 3, 'Why can the half-life not be found by watching a single nucleus?', 'Decay is random: one nucleus may decay at any time; half-life is a statistical average for many nuclei', ['A single nucleus never decays', 'A single nucleus decays after exactly one half-life', 'Single nuclei cannot be detected'], 'Half-life describes large numbers.', ['C1: random', 'C1: statistical quantity'])
N('M', 4, 'Sodium-24 has a half-life of 15 hours. A sample contains 20 mg of it. What mass of sodium-24 remains after 60 hours, in mg?', 20 * half(60, 15), 'mg',
  '60 ÷ 15 = 4 half-lives: m = 20 × (1/2)⁴ = 1.25 mg', ['C1: number of half-lives', 'C1: mass halves with N', 'C1: value'], aq='m')
N('M', 3, 'Wood from an ancient boat has one quarter of the carbon-14 activity per gram of living wood. Carbon-14 has a half-life of 5730 years. How old is the boat, in years?', 2 * 5730, 'years',
  'One quarter is two half-lives: age = 2 × 5730 = 11460 years', ['C1: two half-lives', 'C1: value'], sig=4, aq='age')
N('M', 3, 'A sample contains 1.0 × 10⁶ nuclei with λ = 0.050 s⁻¹. How many decay in the first 10 s?', 1.0e6 * (1 - exp(-0.5)), None,
  f'Decayed = N₀(1 − e^(−λt)) = 1.0 × 10⁶ × (1 − e^(−0.50)) = {sf(1e6 * (1 - exp(-0.5)))}', ['C1: N₀ − N', 'C1: e^(−0.50)'], aq='decayed')
M('M', 3, 'A graph of ln N against t is drawn for a decaying sample. What is its gradient?', '−λ', ['λ', '−1/λ', 't½'], 'Taking logs of N = N₀e^(−λt) gives ln N = ln N₀ − λt, a straight line of gradient −λ.', ['C1: take logs', 'C1: gradient −λ'])
N('M', 3, 'A sample contains 2.0 × 10¹² nuclei of an isotope with half-life 3.0 hours. Calculate its activity.', LN2 / (3.0 * 3600) * 2.0e12, 'Bq',
  f'λ = 0.693 ÷ (3.0 × 3600) = {sf(LN2 / 10800, 4)} s⁻¹. A = {sf(LN2 / 10800, 4)} × 2.0 × 10¹² = {sf(LN2 / 10800 * 2e12)} Bq', ['C1: λ from t½ in s', 'C1: A = λN'], aq='A')
M('M', 3, 'The mass of a radioactive sample is doubled. What happens to its half-life?', 'It stays the same', ['It doubles', 'It halves', 'It increases by √2'], 'Half-life is a property of the isotope, not of the amount.', ['C1: t½ = ln 2/λ', 'C1: λ independent of N'])
# hard
N('H', 5, 'A sample of an isotope (half-life 2.0 hours) contains 4.0 × 10¹⁴ undecayed nuclei at 08:00. (a) Calculate the decay constant. (b) Calculate the activity at 08:00. (c) Calculate the activity at 14:00.', LN2 / 7200 * 4.0e14 * half(6, 2.0), 'Bq',
  f'(a) λ = 0.693 ÷ 7200 = {sf(LN2 / 7200, 4)} s⁻¹. (b) A₀ = {sf(LN2 / 7200, 4)} × 4.0 × 10¹⁴ = {sf(LN2 / 7200 * 4e14, 4)} Bq. (c) Three half-lives later: A = {sf(LN2 / 7200 * 4e14, 4)} × (1/2)³ = {sf(LN2 / 7200 * 4e14 / 8)} Bq',
  ['C1: λ', 'C1: A = λN', 'M1: three half-lives', 'C1: value'], aq='A')
N('H', 6, 'A patient is injected with technetium-99m (half-life 6.0 h) of activity 500 MBq at 9 a.m. (a) Calculate the activity at 3 p.m. (b) Calculate the activity at 9 p.m. (c) Calculate the fraction of the nuclei that have decayed by 9 p.m. Give only the answer to (b), in MBq.', 500 * half(12, 6.0), 'MBq',
  '(a) One half-life: 250 MBq. (b) Two half-lives: 500 × (1/2)² = 125 MBq. (c) 1 − 1/4 = 0.75.',
  ['C1: 6 h = one half-life', 'C1: 250 MBq', 'M1: two half-lives', 'C1: value', 'C1: fraction decayed'], aq='A')
N('H', 5, 'Living wood gives 15.3 counts per minute per gram from carbon-14 (half-life 5730 years). An old sample gives 4.2 counts per minute per gram. (a) Write the equation linking the two count rates. (b) Calculate the age of the sample, in years.', 5730 * log(15.3 / 4.2) / LN2, 'years',
  f'(a) C = C₀e^(−λt), with C₀ = 15.3 and C = 4.2 counts per minute per gram. (b) λ = 0.693 ÷ 5730 = {sf(LN2 / 5730, 4)} per year; t = ln(15.3 ÷ 4.2) ÷ {sf(LN2 / 5730, 4)} = {sf(5730 * log(15.3 / 4.2) / LN2)} years',
  ['B1: exponential equation', 'C1: λ', 'M1: take logs', 'C1: value'], aq='age')
N('H', 6, 'A hospital needs a sample of an isotope (half-life 6.0 h) to have an activity of 50 MBq when it is used 18 hours after it is prepared. (a) Calculate the number of half-lives. (b) Calculate the activity needed when it is prepared. Give only the answer to (b), in MBq.', 50 * 2 ** 3, 'MBq',
  '(a) 18 ÷ 6.0 = 3. (b) A₀ = 50 × 2³ = 400 MBq',
  ['C1: number of half-lives', 'M1: work backwards', 'C1: × 2³', 'C1: value', 'B1: unit MBq'], sig=2, aq='A₀')
N('H', 5, 'A plutonium-238 power source in a space probe has a half-life of 87.7 years. (a) Calculate the decay constant in year⁻¹. (b) Calculate the percentage of its initial power remaining after 20 years.', half(20, 87.7) * 100, '%',
  f'(a) λ = 0.693 ÷ 87.7 = {sf(LN2 / 87.7, 4)} year⁻¹. (b) P/P₀ = 0.5^(20 ÷ 87.7) × 100 = {sf(half(20, 87.7) * 100)} %',
  ['C1: λ', 'M1: power ∝ activity', 'C1: (½)^(t/t½)', 'C1: value'], aq='percentage')
N('H', 6, 'Source X has an activity of 800 Bq and half-life 2.0 min. Source Y has an activity of 200 Bq and half-life 6.0 min. (a) Write expressions for both activities. (b) Find the time at which they are equal, in s.', log(4) / (LN2 / 2.0 - LN2 / 6.0) * 60, 's',
  f'(a) A_X = 800e^(−λ_X t), A_Y = 200e^(−λ_Y t). (b) λ_X = 0.693 ÷ 2.0 = {sf(LN2 / 2, 4)} min⁻¹, λ_Y = 0.693 ÷ 6.0 = {sf(LN2 / 6, 4)} min⁻¹. Equal when 4 = e^((λ_X − λ_Y)t): t = ln 4 ÷ ({sf(LN2 / 2, 4)} − {sf(LN2 / 6, 4)}) = {sf(log(4) / (LN2 / 2 - LN2 / 6), 4)} min. In s: {sf(log(4) / (LN2 / 2 - LN2 / 6), 4)} × 60 = {sf(log(4) / (LN2 / 2 - LN2 / 6) * 60)}',
  ['B1: two exponentials', 'C1: both λ', 'M1: equate and take logs', 'C1: t in min', 'C1: in s'], aq='t')
N('H', 5, 'A sample has 6.0 × 10¹⁰ undecayed nuclei at t = 0 and a decay constant of 0.020 s⁻¹. (a) Calculate the number remaining at t = 10 s. (b) Calculate the number remaining at t = 20 s. (c) Calculate the number that decay between these times.', 6.0e10 * (exp(-0.2) - exp(-0.4)), None,
  f'(a) 6.0 × 10¹⁰ × e^(−0.20) = {sf(6e10 * exp(-0.2), 4)}. (b) 6.0 × 10¹⁰ × e^(−0.40) = {sf(6e10 * exp(-0.4), 4)}. (c) {sf(6e10 * exp(-0.2), 4)} − {sf(6e10 * exp(-0.4), 4)} = {sf(6e10 * (exp(-0.2) - exp(-0.4)))}',
  ['C1: N at 10 s', 'C1: N at 20 s', 'M1: difference', 'C1: value'], aq='decays')
N('H', 6, 'A patient receives iodine-131 (half-life 8.0 days). (a) Calculate the fraction remaining after 30 days. (b) The initial activity was 3.7 × 10⁸ Bq and λ = 1.0 × 10⁻⁶ s⁻¹. Calculate the initial number of nuclei. (c) Calculate the number of nuclei that have decayed in 30 days. Give only the answer to (c).', 3.7e8 / 1.0e-6 * (1 - half(30, 8.0)), None,
  f'(a) 0.5^(30 ÷ 8.0) = {sf(half(30, 8.0), 4)}. (b) N₀ = 3.7 × 10⁸ ÷ 1.0 × 10⁻⁶ = 3.7 × 10¹⁴. (c) 3.7 × 10¹⁴ × (1 − {sf(half(30, 8.0), 4)}) = {sf(3.7e14 * (1 - half(30, 8.0)))}',
  ['C1: fraction left', 'C1: N₀ = A₀/λ', 'M1: fraction decayed', 'C1: substitution', 'C1: value'], aq='decayed')
N('H', 5, 'A sample has a half-life of 12 s. (a) Show that the time for the activity to fall to one third of its initial value is t½ ln 3/ln 2. (b) Calculate this time.', 12 * log(3) / LN2, 's',
  f'(a) 1/3 = e^(−λt), so t = ln 3 ÷ λ = t½ ln 3 ÷ ln 2. (b) t = 12 × ln 3 ÷ ln 2 = {sf(12 * log(3) / LN2)} s',
  ['B1: e^(−λt) = 1/3', 'M1: λ = ln 2/t½', 'C1: substitution', 'C1: value'], aq='t')

# ═════════════════════════ 29.7 Decay graphs and equations (17/18/9) ═════════════════════════
lesson('29.7')
N('E', 2, 'The graph shows the activity of a sample against time. Use it to find the half-life of the isotope, in s.', 30, 's',
  'The activity falls from 800 Bq to 400 Bq between t = 0 and t = 30 s, so t½ = 30 − 0 = 30 s', ['C1: time for activity to halve'], sig=2, aq='t½')
M('E', 1, 'What is the shape of a graph of activity against time for a radioactive sample?', 'An exponential decay curve that approaches zero', ['A straight line falling to zero', 'A horizontal line', 'A curve that rises then falls'], 'Equal fractions decay in equal times.')
N('E', 2, 'A graph of ln(activity) against time for a source is a straight line of gradient −0.035 s⁻¹. Calculate the half-life.', LN2 / 0.035, 's',
  f'λ = 0.035 s⁻¹. t½ = 0.693 ÷ 0.035 = {sf(LN2 / 0.035)} s', ['C1: λ = −gradient, then t½ = ln 2/λ'], aq='t½')
M('E', 1, 'On a graph of N against t, what does the gradient at a point represent?', 'Minus the activity at that time', ['The decay constant', 'The half-life', 'The number of nuclei'], 'The gradient is dN/dt, the rate of change of N, which equals −A = −λN.')
N('E', 2, 'The graph shows a count rate falling with time. Use it to find the half-life, in minutes.', 20, 'min',
  'The count rate falls from 1000 to 500 counts per minute in 20 minutes: t½ = 20 − 0 = 20 min', ['C1: time to halve, read from graph'], sig=2, aq='t½')
M('E', 1, 'A graph of ln N against time for a radioactive sample is', 'a straight line with a negative gradient', ['an exponential curve', 'a horizontal straight line', 'a straight line through the origin with positive gradient'], 'Taking logs gives ln N = ln N₀ − λt: a straight line of gradient −λ.')
N('E', 2, 'A source has an activity of 1200 Bq at t = 0 and a half-life of 10 s. Calculate its activity at t = 30 s.', 1200 / 8, 'Bq',
  'Three half-lives: A = 1200 × (1/2)³ = 150 Bq', ['C1: (½)³'], sig=2, aq='A')
M('E', 1, 'On a graph of ln A against t, what is the intercept on the ln A axis?', 'ln A₀', ['A₀', '−λ', 't½'], 'At t = 0, ln A = ln A₀.')
N('E', 2, 'A graph of ln(A / Bq) against t meets the ln A axis at 7.6. Calculate the initial activity.', exp(7.6), 'Bq',
  f'A₀ = e^7.6 = {sf(exp(7.6))} Bq', ['C1: A₀ = e^(intercept)'], aq='A₀')
M('E', 1, 'Which quantity can be found directly from the gradient of a graph of ln A against t?', 'The decay constant', ['The initial number of nuclei', 'The background count', 'The energy per decay'], 'ln A = ln A₀ − λt, so the gradient is −λ and λ follows directly.')
N('E', 2, 'Two points on a straight-line graph of ln A against t are (0 s, 6.0) and (50 s, 4.0). Calculate the decay constant.', (6.0 - 4.0) / 50, 's⁻¹',
  'λ = −gradient = (6.0 − 4.0) ÷ 50 = 0.040 s⁻¹', ['C1: gradient from two points'], sig=2, aq='λ')
M('E', 1, 'Why does a decay curve never quite reach zero?', 'Each half-life only halves what is left, so some nuclei always remain (for a very large sample)', ['The detector cannot count low rates', 'Background radiation adds to it', 'The last nuclei never decay'], 'Exponential decay approaches zero asymptotically.')
N('E', 2, 'The count rate from a source levels off at 30 counts per minute after a long time. At the start the count rate was 510 counts per minute. What was the corrected starting count rate, in counts per minute?', 510 - 30, 'counts per minute',
  'The level value is background: corrected = 510 − 30 = 480 counts per minute', ['C1: subtract background'], sig=2, aq='count rate')
M('E', 1, 'A graph of activity A against the number of undecayed nuclei N for one isotope is', 'a straight line through the origin with gradient λ', ['an exponential curve', 'a horizontal line', 'a straight line with gradient −λ'], 'A = λN, so A is proportional to N with gradient λ.')
N('E', 2, 'A graph of activity against number of undecayed nuclei is a straight line through the origin of gradient 2.0 × 10⁻³ s⁻¹. Calculate the half-life.', LN2 / 2.0e-3, 's',
  f't½ = 0.693 ÷ 2.0 × 10⁻³ = {sf(LN2 / 2e-3)} s', ['C1: gradient = λ, then t½ = ln 2/λ'], aq='t½')
N('E', 2, 'The graph shows N against t for a sample. Use it to estimate the number of undecayed nuclei remaining after two half-lives.', 6.0e9 / 4, None,
  'N₀ = 6.0 × 10⁹ from the graph; after two half-lives N = 6.0 × 10⁹ ÷ 4 = 1.5 × 10⁹', ['C1: N₀ read, then quarter it'], sig=2, aq='N')
N('E', 1, 'A source has an activity of 640 Bq. Calculate its activity after four half-lives.', 640 / 16, 'Bq',
  'A = 640 × (1/2)⁴ = 40 Bq', [], sig=2, aq='A')
# medium
N('M', 3, 'The table and graph show the count rate from a source at 2-minute intervals (background already subtracted): t = 0, 2, 4, 6, 8, 10 min gives 800, 566, 400, 283, 200, 141 counts per minute. Use them to find the half-life in minutes.', 4.0, 'min',
  'The count rate falls from 800 to 400 counts per minute between t = 0 and t = 4.0 min, and from 400 to 200 between 4.0 and 8.0 min: t½ = 8.0 − 4.0 = 4.0 min', ['C1: two halvings read', 'C1: consistent half-life'], sig=2, aq='t½')
N('M', 3, 'The graph of ln(A / Bq) against t for a source is a straight line through (0, 6.40) and (100 s, 4.10). Calculate the half-life.', LN2 / ((6.40 - 4.10) / 100), 's',
  f'λ = (6.40 − 4.10) ÷ 100 = 0.023 s⁻¹. t½ = 0.693 ÷ 0.023 = {sf(LN2 / 0.023)} s', ['C1: gradient', 'C1: t½ = ln 2/λ'], aq='t½')
N('M', 4, 'A tangent drawn to an N–t graph at N = 4.0 × 10¹² has a gradient of −2.0 × 10⁹ s⁻¹. Calculate the decay constant.', 2.0e9 / 4.0e12, 's⁻¹',
  'Activity = −gradient = 2.0 × 10⁹ Bq. λ = A/N = 2.0 × 10⁹ ÷ 4.0 × 10¹² = 5.0 × 10⁻⁴ s⁻¹', ['M1: gradient = −A', 'C1: A', 'C1: λ = A/N'], sig=2, aq='λ')
M('M', 3, 'The graph shows two decay curves, P and Q, drawn on the same axes from the same starting activity. Which statement is correct?', 'P falls faster, so P has the shorter half-life and the larger decay constant', ['Q falls faster, so Q has the shorter half-life', 'P has the longer half-life', 'They have the same half-life'], 'Read the time for each curve to halve.', ['C1: compare halving times', 'C1: λ = ln 2/t½'])
N('M', 3, 'After 75 s, what is the activity of a source that started at 2400 Bq, if its half-life is 25 s?', 2400 / 8, 'Bq',
  '75 ÷ 25 = 3 half-lives: A = 2400 × (1/2)³ = 300 Bq', ['C1: number of half-lives', 'C1: (½)³'], sig=2, aq='A')
N('M', 3, 'An isotope has a half-life of 12 s. How long does it take for the activity to fall to one sixteenth of its starting value?', 4 * 12, 's',
  '1/16 = (1/2)⁴: t = 4 × 12 = 48 s', ['C1: four half-lives', 'C1: value'], sig=2, aq='t')
M('M', 3, 'Background radiation is not subtracted before ln(count rate) is plotted against time. How does this affect the graph?', 'At long times the points level off above the straight line', ['The line becomes steeper', 'The intercept becomes zero', 'The graph is unaffected'], 'The count rate approaches the background, not zero.', ['C1: background constant', 'C1: graph flattens'])
N('M', 3, 'An activity follows A = A₀e^(−λt) with A₀ = 500 Bq and λ = 0.0231 s⁻¹. Calculate A at t = 60 s.', 500 * exp(-0.0231 * 60), 'Bq',
  f'A = 500 × e^(−0.0231 × 60) = {sf(500 * exp(-0.0231 * 60))} Bq', ['C1: substitution', 'C1: value'], aq='A')
N('M', 4, 'A graph of ln(count rate / counts per minute) against time t (in minutes) has an intercept of 6.9 and a gradient of −0.115 min⁻¹. Calculate the count rate at t = 20 min, in counts per minute.', exp(6.9 - 0.115 * 20), 'counts per minute',
  f'ln C = 6.9 − 0.115 × 20 = 4.6, so C = e^(6.9 − 0.115 × 20) = {sf(exp(4.6))} counts per minute', ['C1: equation of line', 'C1: ln C at 20 min', 'C1: C = e^(ln C)'], aq='C')
M('M', 3, 'On an activity–time curve, the time for the activity to halve is measured starting from different points on the curve. What is found?', 'The same half-life wherever one starts', ['A longer half-life at later times', 'A shorter half-life at later times', 'A different half-life for each starting point'], 'Exponential decay has a constant halving time.', ['C1: exponential', 'C1: constant t½'])
N('M', 3, 'The activity of a sample falls by 20% in 10 minutes. Calculate the decay constant in s⁻¹.', -log(0.80) / 600, 's⁻¹',
  f'0.80 = e^(−λ × 600), so λ = ln(1 ÷ 0.80) ÷ 600 = {sf(-log(0.8) / 600)} s⁻¹', ['C1: A/A₀ = 0.80', 'C1: take logs'], aq='λ')
N('M', 3, 'What fraction of a sample remains after a time equal to 2.5 half-lives?', 0.5 ** 2.5, None,
  f'Fraction = 0.5^2.5 = {sf(0.5 ** 2.5)}', ['C1: (½)ⁿ with n = 2.5', 'C1: value'], aq='fraction')
M('M', 3, 'Which graph for a radioactive sample is a straight line through the origin?', 'Activity against number of undecayed nuclei', ['Activity against time', 'Number of nuclei against time', 'ln A against time'], 'A = λN, so activity is directly proportional to the number of undecayed nuclei.', ['C1: A = λN', 'C1: proportional'])
N('M', 3, 'How many whole half-lives must pass before the activity of a source falls below 1% of its starting value?', 7, None,
  '(1/2)⁶ = 0.0156, so 1.6% remains after 6 half-lives; (1/2)⁷ = 0.00781, so 0.78% remains after 7. The number is 6 + 1 = 7', ['C1: (½)⁶ > 0.01', 'C1: (½)⁷ < 0.01'], sig=1, aq='n')
N('M', 3, 'The raw count rate near a source is 300 counts per minute, including a background of 20 counts per minute. The source has a half-life of 5 minutes. What raw count rate is expected 10 minutes later, in counts per minute?', (300 - 20) / 4 + 20, 'counts per minute',
  'Corrected rate = 300 − 20 = 280; after two half-lives 280 ÷ 4 = 70; raw = 70 + 20 = 90 counts per minute', ['C1: correct for background', 'C1: two half-lives then add background'], sig=2, aq='count rate')
N('M', 3, 'The tangent to an activity–time curve at t = 0 meets the time axis at t = 50 s. The intercept equals 1/λ. Calculate the half-life.', 50 * LN2, 's',
  f'1/λ = 50 s, so t½ = 0.693 × 50 = {sf(50 * LN2)} s', ['C1: λ = 1/50', 'C1: t½ = ln 2/λ'], aq='t½')
N('M', 3, 'A count rate falls from 1600 to 100 counts per minute in 1.0 hour. Calculate the half-life, in s.', 3600 / 4, 's',
  '1600 → 100 is a factor of 16, four half-lives: t½ = 3600 ÷ 4 = 900 s', ['C1: factor of 16', 'C1: hour to seconds'], sig=2, aq='t½')
# hard
N('H', 6, 'The activity of a source is measured every 20 s: t = 0, 20, 40, 60, 80 s gives A = 820, 560, 380, 260, 180 Bq. (a) Explain why ln A should be plotted against t. (b) Use the first and last readings to find λ. (c) Calculate the half-life. Give only the answer to (c).', LN2 / (log(820 / 180) / 80), 's',
  f'(a) ln A = ln A₀ − λt gives a straight line of gradient −λ. (b) λ = ln(820 ÷ 180) ÷ 80 = {sf(log(820 / 180) / 80, 4)} s⁻¹. (c) t½ = 0.693 ÷ {sf(log(820 / 180) / 80, 4)} = {sf(LN2 / (log(820 / 180) / 80))} s',
  ['B1: linear form', 'C1: ln values', 'M1: gradient', 'C1: λ', 'C1: t½'], aq='t½')
N('H', 5, 'A detector records 450, 310, 220 and 160 counts per minute at t = 0, 5, 10 and 15 min. The background is 20 counts per minute. (a) Correct the readings for background. (b) Use the first and last corrected readings to find λ in min⁻¹. (c) Calculate the half-life in min.', LN2 / (log(430 / 140) / 15), 'min',
  f'(a) 430, 290, 200, 140. (b) λ = ln(430 ÷ 140) ÷ 15 = {sf(log(430 / 140) / 15, 4)} min⁻¹. (c) t½ = 0.693 ÷ {sf(log(430 / 140) / 15, 4)} = {sf(LN2 / (log(430 / 140) / 15))} min',
  ['C1: background removed', 'M1: ln ratio ÷ time', 'C1: λ', 'C1: t½'], aq='t½')
N('H', 6, 'A graph of ln(A / Bq) against t (in minutes) has an intercept of 8.0 and a gradient of −0.050 min⁻¹. (a) Calculate the initial activity. (b) Calculate λ in s⁻¹. (c) Calculate the initial number of undecayed nuclei. Give only the answer to (c).', exp(8.0) / (0.050 / 60), None,
  f'(a) A₀ = e^8.0 = {sf(exp(8.0), 4)} Bq. (b) λ = 0.050 ÷ 60 = {sf(0.05 / 60, 4)} s⁻¹. (c) N₀ = A₀/λ = {sf(exp(8.0), 4)} ÷ {sf(0.05 / 60, 4)} = {sf(exp(8.0) / (0.05 / 60))}',
  ['C1: A₀ from intercept', 'C1: min⁻¹ to s⁻¹', 'M1: N = A/λ', 'C1: substitution', 'C1: value'], aq='N₀')
N('H', 5, 'A sample has an activity of 5.0 MBq at 10:00 and 3.2 MBq at 14:00. (a) Calculate λ in h⁻¹. (b) Calculate the half-life in hours.', 4 * LN2 / log(5.0 / 3.2), 'h',
  f'(a) λ = ln(5.0 ÷ 3.2) ÷ 4.0 = {sf(log(5 / 3.2) / 4, 4)} h⁻¹. (b) t½ = 0.693 ÷ {sf(log(5 / 3.2) / 4, 4)} = {sf(4 * LN2 / log(5 / 3.2))} h',
  ['C1: time interval 4.0 h', 'M1: λ = ln(A₁/A₂)/t', 'C1: λ', 'C1: t½'], aq='t½')
N('H', 6, 'The graph shows N against t for a sample. (a) Read N₀ and the half-life. (b) Calculate λ. (c) Calculate the initial activity. Give only the answer to (c).', 6.0e9 * LN2 / 40, 'Bq',
  f'(a) N₀ = 6.0 × 10⁹; N halves to 3.0 × 10⁹ at t = 40 s, so t½ = 40 s. (b) λ = 0.693 ÷ 40 = {sf(LN2 / 40, 4)} s⁻¹. (c) A₀ = {sf(LN2 / 40, 4)} × 6.0 × 10⁹ = {sf(6e9 * LN2 / 40)} Bq',
  ['C1: N₀', 'C1: t½ from graph', 'C1: λ', 'M1: A = λN', 'C1: value'], aq='A₀')
N('H', 5, 'A count rate of 1000 counts per minute (background negligible) is measured for a source with a decay constant of 0.012 min⁻¹. (a) Write the equation for the count rate C at time t. (b) Calculate the time for C to fall to 250 counts per minute, in minutes.', log(4) / 0.012, 'min',
  f'(a) C = 1000e^(−0.012t). (b) t = ln(1000 ÷ 250) ÷ 0.012 = {sf(log(4) / 0.012)} min',
  ['B1: equation', 'M1: take logs', 'C1: substitution', 'C1: value'], aq='t')
N('H', 6, 'A graph of A against t is drawn for a sample. At t = 0, A = 900 Bq and the tangent to the curve has a gradient of −27 Bq s⁻¹. (a) Explain why dA/dt = −λA. (b) Calculate λ. (c) Calculate the half-life. Give only the answer to (c).', LN2 / (27 / 900), 's',
  f'(a) A = λN, so dA/dt = λ dN/dt = −λ²N = −λA. (b) λ = 27 ÷ 900 = 0.030 s⁻¹. (c) t½ = 0.693 ÷ 0.030 = {sf(LN2 / 0.030)} s',
  ['B1: derivation', 'M1: λ = −(dA/dt)/A', 'C1: λ', 'M1: t½ = ln 2/λ', 'C1: value'], aq='t½')
N('H', 5, 'A source decays so that ln(A / Bq) = 5.5 − 0.0693t, with t in hours. (a) State the initial activity. (b) Calculate the half-life in hours.', LN2 / 0.0693, 'h',
  f'(a) A₀ = e^5.5 = {sf(exp(5.5))} Bq. (b) λ = 0.0693 h⁻¹, so t½ = 0.693 ÷ 0.0693 = {sf(LN2 / 0.0693)} h',
  ['C1: A₀ = e^5.5', 'M1: gradient = −λ', 'C1: λ', 'C1: t½'], aq='t½')
N('H', 6, 'A sample contains two isotopes. After a long time, the graph of ln A against t becomes a straight line of gradient −0.010 s⁻¹, showing only the long-lived isotope remains. (a) Explain why the graph is curved at first. (b) Calculate the half-life of the long-lived isotope. Give only the answer to (b).', LN2 / 0.010, 's',
  f'(a) At first both isotopes contribute; the short-lived one dies away quickly. (b) t½ = 0.693 ÷ 0.010 = {sf(LN2 / 0.010)} s',
  ['B1: two components', 'B1: short-lived decays first', 'M1: gradient = −λ', 'C1: substitution', 'C1: value'], aq='t½')

N('M', 3, 'A source has a decay constant of 0.0462 min⁻¹. Its count rate (background removed) is 640 counts per minute now. What will it be after 45 minutes, in counts per minute?', 640 * exp(-0.0462 * 45), 'counts per minute',
  f'C = 640 × e^(−0.0462 × 45) = {sf(640 * exp(-0.0462 * 45))} counts per minute', ['C1: C = C₀e^(−λt)', 'C1: λt in consistent units'], aq='C')
N('M', 3, 'The graph of ln N against t for a sample has a gradient of −1.2 × 10⁻³ s⁻¹ and an intercept of 30.0. Calculate the initial number of undecayed nuclei.', exp(30.0), None,
  f'N₀ = e^30.0 = {sf(exp(30.0))}', ['C1: N₀ = e^(intercept)', 'C1: value'], aq='N₀')

# ═════════════════════════ 29.8 Decay constant λ and half-life (14/18/13) ═════════════════════════
lesson('29.8')
N('E', 2, 'Radon-222 has a half-life of 3.8 days. Calculate its decay constant in s⁻¹.', LN2 / (3.8 * 86400), 's⁻¹',
  f't½ = 3.8 × 86400 = {sf(3.8 * 86400, 4)} s. λ = 0.693 ÷ {sf(3.8 * 86400, 4)} = {sf(LN2 / (3.8 * 86400))} s⁻¹', ['C1: λ = ln 2/t½ with t½ in s'], aq='λ')
M('E', 1, 'Which equation links the decay constant and the half-life?', 'λ = ln 2 ÷ t½', ['λ = t½ ÷ ln 2', 'λ = 2 ÷ t½', 'λ = t½ × ln 2'], 'Putting N = N₀/2 into N = N₀e^(−λt) gives λt½ = ln 2 ≈ 0.693.')
N('E', 2, 'An isotope has a decay constant of 1.2 × 10⁻⁴ s⁻¹. Calculate its half-life.', LN2 / 1.2e-4, 's',
  f't½ = 0.693 ÷ 1.2 × 10⁻⁴ = {sf(LN2 / 1.2e-4)} s', ['C1: t½ = ln 2/λ'], aq='t½')
M('E', 1, 'An isotope has a large decay constant. What does this tell you?', 'It has a short half-life', ['It has a long half-life', 'It is not radioactive', 'Its activity is always small'], 't½ = ln 2/λ, so a large λ gives a short half-life.')
N('E', 2, 'A short-lived isotope has a half-life of 30 s. Calculate its decay constant.', LN2 / 30, 's⁻¹',
  f'λ = 0.693 ÷ 30 = {sf(LN2 / 30)} s⁻¹', ['C1: λ = ln 2/t½'], aq='λ')
M('E', 1, 'What is the unit of the decay constant when time is measured in hours?', 'h⁻¹', ['h', 'Bq', 'h²'], 'λ is a probability per unit time.')
N('E', 2, 'An isotope has a decay constant of 0.10 min⁻¹. Calculate its half-life in minutes.', LN2 / 0.10, 'min',
  f't½ = 0.693 ÷ 0.10 = {sf(LN2 / 0.10)} min', ['C1: t½ = ln 2/λ'], aq='t½')
M('E', 1, 'How are the decay constant and the half-life related?', 'They are inversely proportional', ['They are directly proportional', 'They are equal', 'They are unrelated'], 'λ × t½ = ln 2, a constant.')
N('E', 2, 'Carbon-14 has a half-life of 5730 years (1 year = 3.16 × 10⁷ s). Calculate its decay constant in units of 10⁻¹² s⁻¹.', LN2 / (5730 * YR), '10⁻¹² s⁻¹',
  f't½ = 5730 × 3.16 × 10⁷ = {sf(5730 * YR, 4)} s. λ = 0.693 ÷ {sf(5730 * YR, 4)} = {sf(LN2 / (5730 * YR))} s⁻¹', ['C1: years to s, then λ'], aq='λ')
M('E', 1, 'Isotope P has a half-life of 10 min and isotope Q a half-life of 40 min. What is (decay constant of P) ÷ (decay constant of Q)?', '4', ['1/4', '2', '1/2'], 'λ = ln 2/t½, so λ is inversely proportional to t½: 40 ÷ 10 = 4.')
N('E', 2, 'A sample of 1.0 × 10¹⁰ nuclei has a half-life of 100 s. Calculate its activity.', LN2 / 100 * 1.0e10, 'Bq',
  f'λ = 0.693 ÷ 100 = 6.93 × 10⁻³ s⁻¹. A = 6.93 × 10⁻³ × 1.0 × 10¹⁰ = {sf(LN2 / 100 * 1e10)} Bq', ['C1: λ then A = λN'], aq='A')
M('E', 1, 'If the decay constant of an isotope were doubled, what would happen to its half-life?', 'It would halve', ['It would double', 'It would stay the same', 'It would quadruple'], 't½ = ln 2/λ, so doubling λ halves the half-life.')
N('E', 2, 'A source of half-life 2.0 hours has an activity of 1000 Bq. Calculate the number of undecayed nuclei.', 1000 * 7200 / LN2, None,
  f'λ = 0.693 ÷ 7200 = {sf(LN2 / 7200, 4)} s⁻¹. N = 1000 ÷ {sf(LN2 / 7200, 4)} = {sf(1000 * 7200 / LN2)}', ['C1: λ in s⁻¹ then N = A/λ'], aq='N')
N('E', 1, 'Isotope X has λ = 0.020 s⁻¹ and isotope Y has λ = 0.0050 s⁻¹. Calculate (half-life of Y) ÷ (half-life of X).', 0.020 / 0.0050, None,
  't½ ∝ 1/λ: ratio = 0.020 ÷ 0.0050 = 4.0', [], sig=2, aq='ratio')
# medium
N('M', 3, 'Strontium-90 has a half-life of 28.8 years (1 year = 3.16 × 10⁷ s) and a molar mass of 0.090 kg mol⁻¹. Calculate the activity of 1.0 g of it.' + take('NA'), LN2 / (28.8 * YR) * 1.0e-3 / 0.090 * NA_, 'Bq',
  f'N = 1.0 × 10⁻³ ÷ 0.090 × 6.02 × 10²³ = {sf(1e-3 / 0.09 * NA_, 4)}. λ = 0.693 ÷ (28.8 × 3.16 × 10⁷) = {sf(LN2 / (28.8 * YR), 4)} s⁻¹. A = {sf(LN2 / (28.8 * YR), 4)} × {sf(1e-3 / 0.09 * NA_, 4)} = {sf(LN2 / (28.8 * YR) * 1e-3 / 0.09 * NA_)} Bq',
  ['C1: N', 'C1: λ in s⁻¹'], aq='A')
N('M', 3, 'A source containing 4.0 × 10¹⁰ undecayed nuclei has an activity of 2.0 × 10⁵ Bq. Calculate the half-life.', LN2 / (2.0e5 / 4.0e10), 's',
  f'λ = 2.0 × 10⁵ ÷ 4.0 × 10¹⁰ = 5.0 × 10⁻⁶ s⁻¹. t½ = 0.693 ÷ 5.0 × 10⁻⁶ = {sf(LN2 / 5e-6)} s', ['C1: λ = A/N', 'C1: t½ = ln 2/λ'], aq='t½')
N('M', 4, 'An isotope has a decay constant of 0.0050 s⁻¹. What fraction of a sample remains after 400 s?', exp(-0.0050 * 400), None,
  f'N/N₀ = e^(−0.0050 × 400) = e^(−2.0) = {sf(exp(-2))}', ['C1: N = N₀e^(−λt)', 'C1: λt = 2.0', 'C1: value'], aq='fraction')
M('M', 3, 'Which half-life is most suitable for a radioactive tracer injected into a patient for a scan?', 'A few hours', ['A few seconds', 'Several years', 'Thousands of years'], 'Long enough to do the scan, short enough to limit the dose.', ['C1: long enough for scan', 'C1: short enough to limit dose'])
N('M', 3, 'An isotope has a half-life of 6.0 hours. How long does it take for 90% of a sample to decay, in seconds?', 6.0 * 3600 * log(10) / LN2, 's',
  f'0.10 = e^(−λt), so t = ln 10 ÷ λ = 6.0 × 3600 × ln 10 ÷ ln 2 = {sf(6 * 3600 * log(10) / LN2)} s', ['C1: 10% remains', 'C1: t = t½ ln 10/ln 2'], aq='t')
N('M', 3, 'Samples of isotopes A (half-life 2.0 h) and B (half-life 6.0 h) contain equal numbers of nuclei. Calculate (activity of A) ÷ (activity of B).', 6.0 / 2.0, None,
  'A = λN and λ ∝ 1/t½: ratio = 6.0 ÷ 2.0 = 3.0', ['C1: A ∝ λ for equal N', 'C1: λ ∝ 1/t½'], sig=2, aq='ratio')
N('M', 4, 'Phosphorus-32 has a half-life of 14.3 days. A sample has an activity of 2.0 MBq. Calculate its activity after 30 days, in MBq.', 2.0 * half(30, 14.3), 'MBq',
  f'A = 2.0 × 0.5^(30 ÷ 14.3) = {sf(2 * half(30, 14.3))} MBq', ['C1: t/t½', 'C1: (½)^(t/t½)', 'C1: value'], aq='A')
M('M', 3, 'A sample of an isotope is cut in half. What happens to the half-life of each piece?', 'It is unchanged', ['It halves', 'It doubles', 'It becomes zero'], 'Half-life is set by λ, a property of the nucleus.', ['C1: t½ = ln 2/λ', 'C1: independent of amount'])
N('M', 3, 'A count rate falls from 400 to 280 counts s⁻¹ in 10 s (background negligible). Calculate the decay constant.', log(400 / 280) / 10, 's⁻¹',
  f'λ = ln(400 ÷ 280) ÷ 10 = {sf(log(400 / 280) / 10)} s⁻¹', ['C1: C = C₀e^(−λt)', 'C1: take logs'], aq='λ')
N('M', 3, 'A count rate falls from 400 to 280 counts s⁻¹ in 10 s (background negligible). Calculate the half-life.', LN2 / (log(400 / 280) / 10), 's',
  f'λ = ln(400 ÷ 280) ÷ 10 = {sf(log(400 / 280) / 10, 4)} s⁻¹. t½ = 0.693 ÷ {sf(log(400 / 280) / 10, 4)} = {sf(LN2 / (log(400 / 280) / 10))} s', ['C1: λ', 'C1: t½ = ln 2/λ'], aq='t½')
M('M', 3, 'What does a decay constant of 0.010 s⁻¹ mean for a single nucleus?', 'It has a 1% chance of decaying in the next second', ['It will decay after 100 s exactly', 'It loses 1% of its mass each second', 'It decays 0.010 times per second'], 'λ is the probability of decay per unit time.', ['C1: probability', 'C1: per second'])
N('M', 3, 'A sample contains 1.0 × 10¹² nuclei of an isotope with a half-life of 1.0 hour. How many decay in the next second?', LN2 / 3600 * 1.0e12, None,
  f'λ = 0.693 ÷ 3600 = {sf(LN2 / 3600, 4)} s⁻¹. Decays = λN = {sf(LN2 / 3600, 4)} × 1.0 × 10¹² = {sf(LN2 / 3600 * 1e12)}', ['C1: λ in s⁻¹', 'C1: λN'], aq='decays')
N('M', 4, 'An isotope has a half-life of 2.0 minutes. How long does it take for the activity to fall by a factor of 1000, in s?', 2.0 * 60 * log(1000) / LN2, 's',
  f't = t½ × ln 1000 ÷ ln 2 = 120 × ln 1000 ÷ ln 2 = {sf(120 * log(1000) / LN2)} s', ['M1: e^(−λt) = 1/1000', 'C1: λ', 'C1: t'], aq='t')
M('M', 3, 'After three half-lives, what fraction of the original nuclei have decayed?', '7/8', ['1/8', '3/4', '1/3'], '(1/2)³ = 1/8 remain.', ['C1: 1/8 remain', 'C1: 1 − 1/8'])
N('M', 3, 'One mole of an isotope with a half-life of 1.0 × 10⁴ s is prepared. Calculate its initial activity.' + take('NA'), LN2 / 1.0e4 * NA_, 'Bq',
  f'λ = 0.693 ÷ 1.0 × 10⁴ = 6.93 × 10⁻⁵ s⁻¹. A = 6.93 × 10⁻⁵ × 6.02 × 10²³ = {sf(LN2 / 1e4 * NA_)} Bq', ['C1: λ', 'C1: A = λN_A'], aq='A')
N('M', 3, 'Polonium-210 has a decay constant of 5.8 × 10⁻⁸ s⁻¹. Calculate its half-life in days.', LN2 / 5.8e-8 / 86400, 'days',
  f't½ = 0.693 ÷ 5.8 × 10⁻⁸ = {sf(LN2 / 5.8e-8, 4)} s. In days: {sf(LN2 / 5.8e-8, 4)} ÷ 86400 = {sf(LN2 / 5.8e-8 / 86400)}', ['C1: t½ in s', 'C1: s to days'], aq='t½')
M('M', 3, 'What shape is a graph of half-life against decay constant for different isotopes?', 'A curve showing inverse proportion', ['A straight line through the origin', 'A horizontal line', 'An exponential decay curve'], 't½ = ln 2/λ, so t½ is inversely proportional to λ.', ['C1: t½ ∝ 1/λ', 'C1: hyperbola'])
N('M', 3, 'Iodine-131 has a half-life of 8.0 days and a molar mass of 0.131 kg mol⁻¹. Calculate the mass of iodine-131 in a source of activity 1.0 MBq, in units of 10⁻¹³ kg.' + take('NA'), 1.0e6 * 8.0 * 86400 / LN2 / NA_ * 0.131, '10⁻¹³ kg',
  f'λ = 0.693 ÷ (8.0 × 86400) = {sf(LN2 / (8 * 86400), 4)} s⁻¹. N = 1.0 × 10⁶ ÷ {sf(LN2 / (8 * 86400), 4)} = {sf(1e6 * 8 * 86400 / LN2, 4)}. m = {sf(1e6 * 8 * 86400 / LN2, 4)} ÷ 6.02 × 10²³ × 0.131 = {sf(1e6 * 8 * 86400 / LN2 / NA_ * 0.131)} kg',
  ['C1: λ and N', 'C1: mass from N'], aq='m')
# hard
N('H', 5, 'A strontium-90 source (half-life 28.8 years) had an activity of 5.0 MBq in 2000. (a) Calculate the number of half-lives between 2000 and 2050. (b) Calculate the activity in 2050, in MBq.', 5.0 * half(50, 28.8), 'MBq',
  f'(a) 50 ÷ 28.8 = {sf(50 / 28.8, 4)}. (b) A = 5.0 × 0.5^(50 ÷ 28.8) = {sf(5 * half(50, 28.8))} MBq',
  ['C1: number of half-lives', 'M1: A = A₀(½)ⁿ', 'C1: substitution', 'C1: value'], aq='A')
N('H', 6, 'Radium-226 has a decay constant of 1.37 × 10⁻¹¹ s⁻¹ and a molar mass of 226 g mol⁻¹. (a) Calculate the number of nuclei in 1.0 g. (b) Calculate the activity of 1.0 g, in units of 10¹⁰ Bq. (c) Calculate the half-life in years (1 year = 3.16 × 10⁷ s). Give only the answer to (b).' + take('NA'), 1.37e-11 * NA_ / 226, '10¹⁰ Bq',
  f'(a) N = 6.02 × 10²³ ÷ 226 = {sf(NA_ / 226, 4)}. (b) A = 1.37 × 10⁻¹¹ × {sf(NA_ / 226, 4)} = {sf(1.37e-11 * NA_ / 226)} Bq. (c) t½ = 0.693 ÷ 1.37 × 10⁻¹¹ ÷ 3.16 × 10⁷ ≈ {sf(LN2 / 1.37e-11 / YR, 4)} years',
  ['C1: N', 'M1: A = λN', 'C1: value', 'C1: t½ in s', 'C1: in years'], aq='A')
N('H', 5, 'A sample\'s activity falls from 8.0 MBq to 5.0 MBq in 6.0 hours. (a) Calculate λ in h⁻¹. (b) Calculate the half-life in hours.', 6.0 * LN2 / log(8.0 / 5.0), 'h',
  f'(a) λ = ln(8.0 ÷ 5.0) ÷ 6.0 = {sf(log(1.6) / 6, 4)} h⁻¹. (b) t½ = 0.693 ÷ {sf(log(1.6) / 6, 4)} = {sf(6 * LN2 / log(1.6))} h',
  ['M1: A = A₀e^(−λt)', 'C1: λ', 'M1: t½ = ln 2/λ', 'C1: value'], aq='t½')
N('H', 6, 'Uranium-238 has a half-life of 4.5 × 10⁹ years. The Earth is about 4.6 × 10⁹ years old. (a) Calculate λ in year⁻¹. (b) Calculate the fraction of the Earth\'s original uranium-238 that remains.', half(4.6e9, 4.5e9), None,
  f'(a) λ = 0.693 ÷ 4.5 × 10⁹ = {sf(LN2 / 4.5e9, 4)} year⁻¹. (b) N/N₀ = 0.5^(4.6 × 10⁹ ÷ 4.5 × 10⁹) = {sf(half(4.6e9, 4.5e9))}',
  ['C1: λ', 'M1: N/N₀ = e^(−λt) or (½)^(t/t½)', 'C1: exponent', 'C1: value', 'B1: about half remains'], aq='fraction')
N('H', 5, 'Uranium-238 has a half-life of 4.5 × 10⁹ years (1 year = 3.16 × 10⁷ s) and a molar mass of 0.238 kg mol⁻¹. (a) Calculate λ in s⁻¹. (b) Calculate the mass of uranium-238 with an activity of 1.0 Bq, in units of 10⁻⁸ kg.' + take('NA'), 1.0 / (LN2 / (4.5e9 * YR)) / NA_ * 0.238, '10⁻⁸ kg',
  f'(a) λ = 0.693 ÷ (4.5 × 10⁹ × 3.16 × 10⁷) = {sf(LN2 / (4.5e9 * YR), 4)} s⁻¹. (b) N = 1.0 ÷ {sf(LN2 / (4.5e9 * YR), 4)} = {sf(1 / (LN2 / (4.5e9 * YR)), 4)}; m = {sf(1 / (LN2 / (4.5e9 * YR)), 4)} ÷ 6.02 × 10²³ × 0.238 = {sf(1 / (LN2 / (4.5e9 * YR)) / NA_ * 0.238)} kg',
  ['C1: λ', 'C1: N = A/λ', 'M1: mass from N', 'C1: value'], aq='m')
N('H', 6, 'Iodine-131 has a physical half-life of 8.0 days, but the body also removes iodine with a biological half-life of 24 days. The effective decay constant is the sum of the two decay constants. (a) Calculate both decay constants in day⁻¹. (b) Calculate the effective half-life in days.', 1 / (1 / 8.0 + 1 / 24), 'days',
  f'(a) λp = 0.693 ÷ 8.0 = {sf(LN2 / 8, 4)} day⁻¹; λb = 0.693 ÷ 24 = {sf(LN2 / 24, 4)} day⁻¹. (b) t½ = 0.693 ÷ ({sf(LN2 / 8, 4)} + {sf(LN2 / 24, 4)}) = {sf(1 / (1 / 8 + 1 / 24))} days',
  ['C1: physical λ', 'C1: biological λ', 'M1: add decay constants', 'C1: t½ = ln 2/λ(eff)', 'C1: value'], aq='t½(eff)')
N('H', 5, 'In living matter, 1 carbon atom in 1.0 × 10¹² is carbon-14 (λ = 3.83 × 10⁻¹² s⁻¹). Carbon has a molar mass of 12 g mol⁻¹. (a) Calculate the number of carbon-14 atoms in 1.0 g of carbon. (b) Calculate the activity of 1.0 g of carbon.' + take('NA'), NA_ / 12 * 1e-12 * 3.83e-12, 'Bq',
  f'(a) N = 6.02 × 10²³ ÷ 12 × 1.0 × 10⁻¹² = {sf(NA_ / 12 * 1e-12, 4)}. (b) A = 3.83 × 10⁻¹² × {sf(NA_ / 12 * 1e-12, 4)} = {sf(NA_ / 12 * 1e-12 * 3.83e-12)} Bq',
  ['C1: atoms of carbon', 'C1: fraction C-14', 'M1: A = λN', 'C1: value'], aq='A')
N('H', 6, 'Plutonium-239 has a half-life of 2.4 × 10⁴ years. (a) Calculate λ in year⁻¹. (b) Calculate the time for 1.0 kg of plutonium-239 to lose 1.0 g by decay, in years.', -log(0.999) / (LN2 / 2.4e4), 'years',
  f'(a) λ = 0.693 ÷ 2.4 × 10⁴ = {sf(LN2 / 2.4e4, 4)} year⁻¹. (b) 0.999 = e^(−λt), so t = ln(1 ÷ 0.999) ÷ {sf(LN2 / 2.4e4, 4)} = {sf(-log(0.999) / (LN2 / 2.4e4))} years',
  ['C1: λ', 'M1: N/N₀ = 0.999', 'C1: take logs', 'C1: substitution', 'C1: value'], aq='t')
N('H', 5, 'Cobalt-60 has a half-life of 5.27 years. (a) Calculate the probability that a particular cobalt-60 nucleus survives one year. (b) Calculate the probability that it decays within one year.', 1 - half(1, 5.27), None,
  f'(a) Survival = 0.5^(1 ÷ 5.27) = {sf(half(1, 5.27), 4)}. (b) Decay = 1 − {sf(half(1, 5.27), 4)} = {sf(1 - half(1, 5.27))}',
  ['M1: survival = (½)^(t/t½)', 'C1: value', 'M1: 1 − survival', 'C1: value'], aq='probability')
N('H', 6, 'A rock contains potassium-40 (half-life 1.25 × 10⁹ years), which decays to argon-40 that is trapped in the rock. There is now 0.50 argon-40 atom for every potassium-40 atom. (a) Show that the fraction of the original potassium remaining is 1/1.5. (b) Calculate the age of the rock, in units of 10⁸ years.', 1.25e9 * log(1.5) / LN2, '10⁸ years',
  f'(a) For every 1 K now there were 1 + 0.50 = 1.5 originally. (b) t = t½ × ln 1.5 ÷ ln 2 = 1.25 × 10⁹ × ln 1.5 ÷ ln 2 = {sf(1.25e9 * log(1.5) / LN2)} years',
  ['B1: N₀ = 1.5N', 'M1: N/N₀ = e^(−λt)', 'C1: take logs', 'C1: substitution', 'C1: value'], aq='age')
N('H', 5, 'Isotopes P (half-life 3.0 h) and Q (half-life 9.0 h) are present in equal numbers at t = 0. (a) Calculate the ratio of their activities at t = 0. (b) Calculate (N of P) ÷ (N of Q) after 9.0 hours.', half(9, 3.0) / half(9, 9.0), None,
  f'(a) A_P/A_Q = λ_P/λ_Q = 9.0 ÷ 3.0 = 3.0. (b) (1/2)³ ÷ (1/2)¹ = {sf(half(9, 3) / half(9, 9))}',
  ['C1: activity ratio', 'M1: three and one half-lives', 'C1: ratio of fractions', 'C1: value'], aq='ratio')
N('H', 6, 'A technetium-99m generator is set up so that a dose of 600 MBq is ready at 8 a.m. The half-life is 6.0 h. (a) Calculate the activity at 2 p.m. (b) Calculate the time after 8 a.m. at which the activity falls to 100 MBq, in hours. Give only the answer to (b).', 6.0 * log(6) / LN2, 'h',
  f'(a) 300 MBq. (b) The activity falls by a factor of 6, so t = 6.0 × ln 6 ÷ ln 2 = {sf(6 * log(6) / LN2)} h',
  ['C1: one half-life', 'M1: exponential equation', 'C1: λ', 'C1: take logs', 'C1: value'], aq='t')
N('H', 5, 'Nuclei of an isotope have a mean lifetime τ = 1/λ. (a) Show that t½ = τ ln 2. (b) An isotope has τ = 2.0 × 10³ s. Calculate its half-life.', 2.0e3 * LN2, 's',
  f'(a) t½ = ln 2/λ = τ ln 2. (b) t½ = 2.0 × 10³ × 0.693 = {sf(2e3 * LN2)} s',
  ['B1: t½ = ln 2/λ', 'M1: τ = 1/λ', 'C1: substitution', 'C1: value'], aq='t½')
