"""Independent arithmetic check of worked solutions (no eval, own parser).

Every "= <numbers only> = <result>" step printed in a worked solution is read
back from the TEXT, evaluated here, and compared with the result printed after
it. A numeric question passes when at least one printed step evaluates to its
stored answer, so the stated answer is recomputed from the working shown to the
student, not taken from the generator's variables.
"""
import math
import re

_SUPMAP = {'⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁻': '-'}
_SUPRUN = re.compile('[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+')
_RESULT = re.compile(r'^\s*(−|-)?(\d+(?:\.\d+)?)(?:\s*×\s*10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+))?')


_STDFORM = re.compile(r'(\d+(?:\.\d+)?)\s*×\s*10([⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+)')


def _norm(s):
    s = re.sub(r'(?<=\d) (?=\d{3}(?!\d))', '', s)   # 43 200 -> 43200
    # a standard-form number "6.37 × 10⁶" is ONE number, as a reader takes it
    s = _STDFORM.sub(lambda m: '(' + m.group(1) + 'e' + ''.join(_SUPMAP[ch] for ch in m.group(2)) + ')', s)
    for f in ('sin', 'cos', 'tan'):
        s = s.replace(f + '⁻¹', ' a' + f + ' ')
    s = s.replace('−', '-').replace('×', '*').replace('÷', '/').replace('·', '*').replace('π', ' pi ')
    s = s.replace('√', ' sqrt ')
    s = _SUPRUN.sub(lambda m: '^(' + ''.join(_SUPMAP[c] for c in m.group(0)) + ')', s)
    s = s.replace('e^', ' exp ')
    return s


_TOK = re.compile(r'\s*(?:((?:\d+\.\d+|\d+|\.\d+)(?:e-?\d+)?)|(pi|sqrt|asin|acos|atan|sin|cos|tan|ln|lg|exp)|([-+*/^()]))')


def tokenize(s):
    s = _norm(s).strip()
    pos, out = 0, []
    while pos < len(s):
        m = _TOK.match(s, pos)
        if not m or m.end() == pos:
            return None
        pos = m.end()
        if m.group(1):
            out.append(('n', float(m.group(1))))
        elif m.group(2):
            out.append(('f', m.group(2)))
        else:
            out.append(('o', m.group(3)))
        while pos < len(s) and s[pos] == ' ':
            pos += 1
    return out


class _P:
    def __init__(self, toks):
        self.t, self.i = toks, 0

    def peek(self):
        return self.t[self.i] if self.i < len(self.t) else (None, None)

    def take(self):
        tok = self.peek()
        self.i += 1
        return tok

    def expr(self):
        v = self.term()
        while self.peek() in (('o', '+'), ('o', '-')):
            op = self.take()[1]
            r = self.term()
            v = v + r if op == '+' else v - r
        return v

    def term(self):
        v = self.implicit()
        while self.peek() in (('o', '*'), ('o', '/')):
            op = self.take()[1]
            r = self.implicit()
            v = v * r if op == '*' else v / r
        return v

    def implicit(self):
        # juxtaposition binds tighter than × and ÷, as a reader takes "x ÷ 2π"
        v = self.unary()
        while True:
            k, x = self.peek()
            if k in ('n', 'f') or (k, x) == ('o', '('):
                v = v * self.unary()
            else:
                return v

    def unary(self):
        if self.peek() == ('o', '-'):
            self.take()
            return -self.unary()
        if self.peek() == ('o', '+'):
            self.take()
            return self.unary()
        return self.power()

    def power(self):
        v = self.atom()
        if self.peek() == ('o', '^'):
            self.take()
            return v ** self.unary()
        return v

    def atom(self):
        k, x = self.take()
        if k == 'n':
            return x
        if k == 'f':
            if x == 'pi':
                return math.pi
            arg = self.power()
            return {'sqrt': math.sqrt, 'sin': lambda a: math.sin(math.radians(a)),
                    'cos': lambda a: math.cos(math.radians(a)), 'tan': lambda a: math.tan(math.radians(a)),
                    'ln': math.log, 'lg': math.log10, 'exp': math.exp,
                    'asin': lambda a: math.degrees(math.asin(a)), 'acos': lambda a: math.degrees(math.acos(a)),
                    'atan': lambda a: math.degrees(math.atan(a))}[x](arg)
        if (k, x) == ('o', '('):
            v = self.expr()
            if self.take() != ('o', ')'):
                raise ValueError('unbalanced')
            return v
        raise ValueError(f'unexpected {k} {x}')


def evaluate(s):
    toks = tokenize(s)
    if not toks:
        return None
    p = _P(toks)
    try:
        v = p.expr()
    except (ValueError, ZeroDivisionError, OverflowError, TypeError, IndexError):
        return None
    if p.i != len(toks):
        return None
    return v if isinstance(v, (int, float)) and math.isfinite(v) else None


def read_result(s):
    """The number at the start of s ('1.28 × 10⁻¹³ N. …') and half a unit in its last digit."""
    s = re.sub(r'^(\s*[−-]?\d{1,3})((?: \d{3})+)(?!\d)', lambda m: m.group(1) + m.group(2).replace(' ', ''), s)
    m = _RESULT.match(s)
    if not m:
        return None
    sign = -1 if m.group(1) else 1
    mant = m.group(2)
    ex = int(''.join(_SUPMAP[c] for c in m.group(3))) if m.group(3) else 0
    if '.' in mant:
        decimals = len(mant.split('.')[1])
    else:
        decimals = -(len(mant) - len(mant.rstrip('0'))) if mant.strip('0') else 0   # 340 is 2 s.f.
    half = 0.5 * 10 ** (-decimals) * 10 ** ex
    return sign * float(mant) * 10 ** ex, half


def steps(text):
    """[(expr_text, value, result, half)] for every numeric '= expr = result' step in text."""
    parts = text.split('=')
    out = []
    for i in range(1, len(parts) - 1):
        seg = parts[i].strip().rstrip(',')
        if not seg or not re.search(r'\d', seg):
            continue
        # allow a trailing approximation sign or a leading 'so' etc.? no: numbers only
        val = evaluate(seg)
        if val is None:
            # the numeric tail of a clause: "In units of g: 7.81 ÷ 9.81"
            for start in range(1, len(seg)):
                if seg[start - 1] in ' :(' and seg[start] not in ' )':
                    before = seg[:start].rstrip()
                    if before and before[-1] in '×÷/*+−-^(√':
                        continue   # the tail is only part of a longer product
                    cand = seg[start:]
                    if re.search(r'\d', cand):
                        val = evaluate(cand)
                        if val is not None:
                            seg = cand
                            break
            if val is None:
                continue
        res = read_result(parts[i + 1].replace('≈', ''))
        if res is None:
            continue
        out.append((seg, val, res[0], res[1]))
    return out


def check_question(qn):
    """Returns (ok, problems, n_steps) for a numeric question dict built by _lib.N."""
    problems = []
    st = steps(qn['sol'])
    for seg, val, res, half in st:
        if abs(val - res) > half * 1.0001 + 0.012 * abs(res):
            problems.append(f'step "{seg.strip()}" evaluates to {val:.6g}, the solution prints {res:.6g}')
    target = qn['value']
    sig = qn.get('sig', 3)
    half_sig = 0.5 * 10 ** (int(f'{abs(target):e}'.split('e')[1]) - sig + 1) if target else 0
    hit = any(abs(res - target) <= max(half, half_sig) * 1.0001 + 0.006 * abs(target) and abs(val - target) <= 0.025 * abs(target) + 1e-300
              for seg, val, res, half in st)
    if not hit:
        problems.append(f'no printed step evaluates to the stored answer {target:.6g}')
    return (not problems), problems, len(st)
