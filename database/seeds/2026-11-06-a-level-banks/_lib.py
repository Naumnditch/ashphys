"""Shared helpers for the 2026-11-06 A Level question-bank fill.

Every chapter file (chNN.py, p1.py, p2.py, maths.py) is executed by the driver
(../2026-11-06-a-level-banks.py) with this module's names already in scope. A
chapter file calls lesson('<key>') and then N(...) / M(...) once per question.

Conventions (copied from the existing 9702 seeds, e.g. 2026-10-26-as-momentum-
collisions.py and 2026-09-30-a-level-circular-gravitation.py):
  * one graded answer per question: a number (answer_type 'numeric') or one of
    four options (answer_type 'multiple_choice'); a multi-part question names
    the part that is graded ("Give only the answer to (b).") and works the
    other parts in the explanation;
  * the explanation is the worked solution, then the mark scheme, then
    (optionally) a common mistake. The schema has no mark-scheme column, so the
    mark scheme lives in the explanation as "Mark scheme (n marks)." followed by
    one "C1: …" / "M1: …" / "A1: …" / "B1: …" sentence per mark;
  * difficulty_level 1 = easy (1–2 marks), 2 = medium (3–4 marks),
    3 = hard (5–7 marks) — the practice page labels these Foundation,
    Intermediate and Challenging;
  * points = the marks;
  * numeric answers are stored to 4 s.f. in the unit the question asks for;
    a 2 s.f. answer widens the 2 % default tolerance to 5 % when rounding alone
    moves it by more than 1.8 % (same rule as the momentum and kinematics seeds).

Every given number in a stem should come from Q('3.0 cm') so the stem and the
computation can never disagree: str(Q) is exactly the text shown, Q.v is the SI
value.
"""
import math
import re
from math import pi, sqrt, sin, cos, tan, asin, acos, atan, atan2, radians, degrees, exp, log, log10  # noqa: F401

SUP = str.maketrans('-0123456789', '⁻⁰¹²³⁴⁵⁶⁷⁸⁹')
_UNSUP = str.maketrans('⁻⁰¹²³⁴⁵⁶⁷⁸⁹', '-0123456789')


# ───────────────────────────── number formatting ─────────────────────────────

def _exp10(x):
    return int(f'{abs(x):e}'.split('e')[1])


def round_sf(x, n):
    if x == 0:
        return 0.0
    return round(x, n - 1 - _exp10(x))


def sf(x, n=3):
    """x to n significant figures, written the way a worked solution writes it."""
    if x == 0:
        return '0'
    if x < 0:
        return '−' + sf(-x, n)
    x = round_sf(x, n)
    e = _exp10(x)
    if -3 <= e < 4:
        if e >= n - 1:
            return str(int(round(x)))
        return f'{x:.{n - 1 - e}f}'
    m = f'{x / 10**e:.{n - 1}f}'
    return f'{m} × 10{str(e).translate(SUP)}'


def stored(x, n=4):
    """answer_correct: plain ASCII, n s.f., parseable by the grader."""
    if x == 0:
        return '0'
    neg = x < 0
    x = abs(x)
    e = _exp10(x)
    trim = lambda s: s.rstrip('0').rstrip('.') if '.' in s else s  # noqa: E731
    if -3 <= e < 5:
        out = trim(f'{x:.{max(n - 1 - e, 0)}f}')
    else:
        out = f"{trim(f'{x / 10**e:.{n - 1}f}')}e{e}"
    return f'-{out}' if neg else out


# ───────────────────────────── given quantities ──────────────────────────────

# Exact unit text → factor to SI. Prefixed forms of the PREFIXABLE units are
# resolved automatically. Anything else must be added here, so an unknown unit
# fails loudly instead of being read as SI.
UNITS = {
    '': 1, 'm': 1, 's': 1, 'kg': 1, 'g': 1e-3, 'N': 1, 'J': 1, 'W': 1, 'V': 1, 'A': 1, 'C': 1,
    'Ω': 1, 'F': 1, 'T': 1, 'Hz': 1, 'Pa': 1, 'Wb': 1, 'H': 1, 'K': 1, 'mol': 1, 'Bq': 1,
    'rad': 1, 'rad s⁻¹': 1, 'rad s⁻²': 1, '°': 1, '°C': 1, '%': 1, 'N m': 1, 'N s': 1, 'kg m s⁻¹': 1,
    'm s⁻¹': 1, 'm s⁻²': 1, 'km s⁻¹': 1e3, 'km h⁻¹': 1 / 3.6, 'cm s⁻¹': 1e-2, 'mm s⁻¹': 1e-3,
    'm²': 1, 'cm²': 1e-4, 'mm²': 1e-6, 'km²': 1e6, 'm³': 1, 'cm³': 1e-6, 'mm³': 1e-9, 'litre': 1e-3, 'litres': 1e-3,
    'kg m⁻³': 1, 'g cm⁻³': 1e3, 'N m⁻¹': 1, 'N C⁻¹': 1, 'V m⁻¹': 1, 'kV m⁻¹': 1e3, 'N kg⁻¹': 1, 'J kg⁻¹': 1,
    'J kg⁻¹ K⁻¹': 1, 'J g⁻¹ K⁻¹': 1e3, 'J kg⁻¹ °C⁻¹': 1, 'kJ kg⁻¹': 1e3, 'MJ kg⁻¹': 1e6, 'J K⁻¹': 1, 'J mol⁻¹': 1,
    'mol⁻¹': 1, 'Ω m': 1, 'Ω cm': 1e-2, 'W m⁻²': 1, 'mW m⁻²': 1e-3, 'µW m⁻²': 1e-6, 'nW m⁻²': 1e-9,
    'm⁻¹': 1, 'cm⁻¹': 1e2, 'mm⁻¹': 1e3, 'lines per mm': 1e3, 'lines mm⁻¹': 1e3, 'lines per cm': 1e2,
    'min': 60, 'minutes': 60, 'minute': 60, 'h': 3600, 'hours': 3600, 'hour': 3600, 'day': 86400, 'days': 86400,
    'year': 3.156e7, 'years': 3.156e7, 'eV': 1.60e-19, 'keV': 1.60e-16, 'MeV': 1.60e-13, 'GeV': 1.60e-10,
    'u': 1.66e-27, 'rev min⁻¹': 2 * math.pi / 60, 'rpm': 2 * math.pi / 60, 'rev s⁻¹': 2 * math.pi,
    'A m⁻²': 1, 'C m⁻²': 1, 'm³ mol⁻¹': 1, 'kg mol⁻¹': 1, 'g mol⁻¹': 1e-3, 'atm': 1.01e5,
    'kW h': 3.6e6, 'kWh': 3.6e6, 'ly': 9.46e15, 'pc': 3.09e16, 'Mpc': 3.09e22, 'AU': 1.50e11,
    'km s⁻¹ Mpc⁻¹': 1 / 3.09e19, 's⁻¹': 1, 'min⁻¹': 1 / 60, 'h⁻¹': 1 / 3600, 'day⁻¹': 1 / 86400, 'year⁻¹': 1 / 3.156e7,
    'counts per minute': 1 / 60, 'counts min⁻¹': 1 / 60, 'counts s⁻¹': 1, 'kg s⁻¹': 1, 'm³ s⁻¹': 1, 'Pa s': 1,
    'dB': 1, 'times': 1, 'turns': 1, 'turns m⁻¹': 1, 'cycles': 1, 'oscillations': 1, 'photons s⁻¹': 1,
    'K s⁻¹': 1, 'K min⁻¹': 1 / 60, 'J kg⁻¹ K⁻¹ ': 1, 'kg m⁻²': 1, 'W m⁻¹ K⁻¹': 1, 'J m⁻³': 1, 'mol m⁻³': 1, 'm⁻³': 1, 'kg m²': 1, 'N m²': 1,
    'N m² kg⁻¹': 1, 'N m² kg⁻²': 1, 'J m kg⁻¹': 1, 'N s² m⁻¹': 1, 'm² s⁻²': 1, 'J s': 1, 'W m⁻² K⁻⁴': 1, 'm K': 1, 'T m A⁻¹': 1, 'H m⁻¹': 1, 'C kg⁻¹': 1, 'T s⁻¹': 1, 'Wb s⁻¹': 1, 'V s': 1, 'A s⁻¹': 1,
    'electrons': 1, 'nuclei': 1, 'H m⁻¹': 1, 'F m⁻¹': 1, 'Wb m⁻²': 1, 'T m': 1, 'N A⁻¹ m⁻¹': 1,
}
PREFIXABLE = {'m', 's', 'g', 'N', 'J', 'W', 'V', 'A', 'C', 'Ω', 'F', 'T', 'Hz', 'Pa', 'Wb', 'H', 'Bq', 'eV', 'N m⁻¹', 'V m⁻¹'}
PREFIX = {'p': 1e-12, 'n': 1e-9, 'µ': 1e-6, 'm': 1e-3, 'c': 1e-2, 'k': 1e3, 'M': 1e6, 'G': 1e9}

_NUM = re.compile(r'^\s*([−-]?\d+(?:\.\d+)?)(?:\s*×\s*10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+))?\s*(.*?)\s*$')


def unit_factor(u):
    if u in UNITS:
        return UNITS[u]
    for p, f in PREFIX.items():
        if u.startswith(p) and u[len(p):] in PREFIXABLE:
            return f * UNITS[u[len(p):]]
    raise KeyError(f'unknown unit {u!r} — add it to UNITS in _lib.py')


def parse_number(text):
    m = _NUM.match(text)
    if not m:
        raise ValueError(f'cannot read a quantity from {text!r}')
    mant = float(m.group(1).replace('−', '-'))
    ex = int(m.group(2).translate(_UNSUP)) if m.group(2) else 0
    return mant * 10**ex, m.group(3)


class Q:
    """A given quantity: Q('2.5 × 10⁶ m s⁻¹'). str() is the text, .v the SI value, .n the number as written."""

    def __init__(self, text, si=None):
        self.s = text
        self.n, self.unit = parse_number(text)
        self.v = si if si is not None else self.n * unit_factor(self.unit)
        m = _NUM.match(text)
        self.sf = len(m.group(1).replace('−', '').replace('-', '').replace('.', '').lstrip('0')) or 1

    def __str__(self):
        return self.s

    def __format__(self, spec):
        return self.s

    def num(self):
        """The number part only, as written (for substitutions in a worked solution)."""
        return _NUM.match(self.s).group(1) + (f' × 10{_NUM.match(self.s).group(2)}' if _NUM.match(self.s).group(2) else '')

    def __repr__(self):
        return f'Q({self.s!r})'


def num(x, n=3):
    """A computed value written for a substitution line (alias of sf)."""
    return sf(x, n)


def sq(q):
    """Number of a Q (or float) for substitutions: Q('3.0 cm') → '0.030' if converted else as written."""
    return q.num() if isinstance(q, Q) else sf(q)


# ──────────────────────────────── constants ──────────────────────────────────
# Cambridge 9702 data-sheet values.
K = {
    'g': ('g', '9.81 m s⁻²', 9.81),
    'c': ('c', '3.00 × 10⁸ m s⁻¹', 3.00e8),
    'e': ('e', '1.60 × 10⁻¹⁹ C', 1.60e-19),
    'h': ('h', '6.63 × 10⁻³⁴ J s', 6.63e-34),
    'me': ('mₑ', '9.11 × 10⁻³¹ kg', 9.11e-31),
    'mp': ('mₚ', '1.67 × 10⁻²⁷ kg', 1.67e-27),
    'u': ('1 u', '1.66 × 10⁻²⁷ kg', 1.66e-27),
    'NA': ('N_A', '6.02 × 10²³ mol⁻¹', 6.02e23),
    'k': ('k', '1.38 × 10⁻²³ J K⁻¹', 1.38e-23),
    'R': ('R', '8.31 J K⁻¹ mol⁻¹', 8.31),
    'G': ('G', '6.67 × 10⁻¹¹ N m² kg⁻²', 6.67e-11),
    'e0': ('ε₀', '8.85 × 10⁻¹² F m⁻¹', 8.85e-12),
    'mu0': ('µ₀', '4π × 10⁻⁷ H m⁻¹', 4 * math.pi * 1e-7),
    'sigma': ('σ', '5.67 × 10⁻⁸ W m⁻² K⁻⁴', 5.67e-8),
    'wien': ('the Wien constant', '2.90 × 10⁻³ m K', 2.90e-3),
    'kc': ('1/4πε₀', '8.99 × 10⁹ m F⁻¹', 8.99e9),
}
g, c, e, h, me, mp, u, NA, kB, R, G, e0, mu0, sigma, wien, kc = (K[k][2] for k in
    ('g', 'c', 'e', 'h', 'me', 'mp', 'u', 'NA', 'k', 'R', 'G', 'e0', 'mu0', 'sigma', 'wien', 'kc'))


def take(*names):
    """' Take g = 9.81 m s⁻².' — the constants a question uses, stated in its stem."""
    parts = [f'{K[n][0]} = {K[n][1]}' for n in names]
    if len(parts) == 1:
        return f' Take {parts[0]}.'
    return ' Take ' + ', '.join(parts[:-1]) + f' and {parts[-1]}.'


# ─────────────────────────────── the builders ────────────────────────────────

QUESTIONS = []          # every question built so far, in order written
_STATE = {'lesson': None, 'mcq': {}}
DIFF = {'E': 1, 'M': 2, 'H': 3}
MARK_RANGE = {'E': range(1, 3), 'M': range(3, 5), 'H': range(5, 8)}
_MS_CODE = re.compile(r'^(?:[CMAB]\d|M\d)\b')


def lesson(key):
    _STATE['lesson'] = key


def _mark_lines(ms, mk, final):
    lines = [s.strip() for s in ms]
    given = sum(int(m.group(1)) for m in (re.match(r'^[CMAB](\d): ', s) for s in lines) if m)
    if final and given < mk:
        lines.append(final)
    elif final and given == mk:
        # the graded part's A mark: the last A line that does not already state a value
        for i in range(len(lines) - 1, -1, -1):
            if lines[i].startswith('A') and not re.search(r'\d', lines[i][3:]):
                lines[i] = lines[i][:2] + final[2:]
                break
    total = 0
    out = []
    for s in lines:
        m = re.match(r'^([CMAB])(\d): ', s)
        assert m, f'mark-scheme line must start "C1: ", "M1: ", "A1: " or "B1: ", got {s!r}'
        total += int(m.group(2))
        out.append(s if s.endswith('.') else s + '.')
    assert total == mk, f'mark scheme totals {total}, question is worth {mk}: {lines}'
    return out


def _explanation(sol, ms_lines, mk, cm):
    sol = sol.strip()
    if not sol.endswith('.'):
        sol += '.'
    text = f"{sol} Mark scheme ({mk} mark{'s' if mk != 1 else ''}). " + ' '.join(ms_lines)
    if cm:
        text += f' Common mistake: {cm.strip()}' + ('' if cm.strip().endswith('.') else '.')
    return text


def _safe(builder):
    """Run a builder; an assertion becomes a recorded build error (the driver rejects it)."""
    def wrapped(*a, **k):
        try:
            return builder(*a, **k)
        except AssertionError as err:
            q = dict(lesson=_STATE['lesson'], d=a[0] if a else 'E', difficulty=DIFF.get(a[0] if a else 'E', 1),
                     marks=a[1] if len(a) > 1 else 1, kind='numeric' if builder.__name__ == '_N' else 'multiple_choice',
                     text=str(a[2]) if len(a) > 2 else '', value=1.0, sig=3, shown='', unit=None, sign=False, tol=None,
                     alts=[], explanation='', sol='', options=['a', 'b', 'c', 'd'], correct_idx=0, answer='a',
                     build_error=str(err))
            QUESTIONS.append(q)
            return q
    return wrapped


def _N(d, mk, stem, ans, unit, sol, ms, sig=3, sign=False, tol=None, cm=None, aq=None, alts=None):
    """A numeric question.

    d    'E' | 'M' | 'H'          mk   marks (E 1–2, M 3–4, H 5–7)
    ans  the answer, in `unit` (the unit the stem asks for, or SI)
    unit display + answer_unit ('m s⁻¹', 'µF', 'nm', None for a pure number)
    sol  worked solution (prose + substitutions, ending with the answer)
    ms   method-mark lines; the final A1 line "A1: <aq> = <answer> <unit>" is
         appended automatically unless the last line already starts with A
    sig  significant figures of the stated answer
    """
    assert d in DIFF and mk in MARK_RANGE[d], f'{_STATE["lesson"]}: {d} question cannot be worth {mk}'
    assert ans == ans and abs(ans) < 1e60, 'answer must be a finite number'
    assert abs(ans) > 1e-60, 'a zero answer cannot be graded (any small value would pass): ask for a non-zero quantity'
    scale = 1.0
    if unit and unit.startswith('10') and ' ' in unit:
        # "in units of 10⁻²¹ J": ans is given in SI; store and show the scaled number
        scale = 10 ** int(unit.split(' ')[0][2:].translate(_UNSUP))
        ans = ans / scale
        shown = f'{sf(ans, sig)} × {unit}'
    else:
        shown = sf(ans, sig) + (f' {unit}' if unit and unit not in ('%', '°') else (unit or ''))
    final = f'A1: {aq + " = " if aq else ""}{shown}'
    ms_lines = _mark_lines(ms, mk, final)
    if tol is None and ans != 0 and abs(round_sf(ans, 2) - ans) / abs(ans) > 0.018 and sig <= 2:
        tol = 0.05
    if tol is None and ans != 0 and abs(round_sf(ans, sig) - ans) / abs(ans) > 0.018:
        tol = 0.05
    q = dict(lesson=_STATE['lesson'], d=d, difficulty=DIFF[d], marks=mk, kind='numeric', text=stem.strip(),
             value=ans, sig=sig, shown=shown, stated=sf(ans, sig), unit=unit, sign=sign, tol=tol, alts=alts or [], scale=scale,
             explanation=_explanation(sol, ms_lines, mk, cm), sol=sol)
    QUESTIONS.append(q)
    return q


def _M(d, mk, stem, right, wrong, sol, ms=None, cm=None):
    """A multiple-choice question: `right` is the correct option, `wrong` the three distractors."""
    assert d in DIFF and mk in MARK_RANGE[d], f'{_STATE["lesson"]}: {d} MCQ cannot be worth {mk}'
    assert len(wrong) == 3 and len({right, *wrong}) == 4, 'an MCQ needs 4 different options'
    key = _STATE['lesson']
    k = _STATE['mcq'][key] = _STATE['mcq'].get(key, 0) + 1
    slot = (2, 0, 3, 1)[(k - 1) % 4]     # spread the right letter: C, A, D, B, …
    opts = list(wrong[:slot]) + [right] + list(wrong[slot:])
    letter = 'ABCD'[slot]
    final = f'A1: {letter} ({right})' if mk > 1 else f'B1: {letter} ({right})'
    ms_lines = _mark_lines(ms or [], mk, final)
    q = dict(lesson=key, d=d, difficulty=DIFF[d], marks=mk, kind='multiple_choice', text=stem.strip(),
             options=opts, correct_idx=slot, answer=right,
             explanation=_explanation(sol, ms_lines, mk, cm), sol=sol)
    QUESTIONS.append(q)
    return q


N = _safe(_N)
M = _safe(_M)


def pick(seq, i):
    """seq[i % len(seq)] — handy for rotating contexts across variants."""
    return seq[i % len(seq)]
