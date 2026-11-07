"""Inline SVG figures for the A Level bank fill (2026-11-07).

Every figure is drawn from the numbers of its own question: callers pass the
values (or the stem, which helpers parse) and the generators compute every
coordinate. House style, shared by all generators:

  * one sans-serif stack, sizes 14 (labels) and 12 (ticks, small notes)
  * line weights thin 0.9 / axis 1.4 / main 2.0 / bold 2.6 (user units)
  * ink = currentColor; accents through CSS variables with fallbacks:
      --fig-accent, --fig-accent-2, --fig-muted, --fig-grid, --fig-fill
    (defined per theme in app/globals.css), so one SVG works in light and dark
  * viewBox only (no width/height), <title> + <desc>, role="img"
  * no scripts, raster images, external assets, <style>, links or foreignObject

A generator returns Figure(svg, alt, values): `values` are the value labels it
printed, which the driver checks against the question stem.
"""
import hashlib
import math
import re

ACC = 'var(--fig-accent,#1d4ed8)'
ACC2 = 'var(--fig-accent-2,#b45309)'
MUT = 'var(--fig-muted,#6b7280)'
GRID = 'var(--fig-grid,#d1d5db)'
FILLC = 'var(--fig-fill,rgba(29,78,216,0.10))'
INK = 'currentColor'
FONT = "ui-sans-serif,system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"
FS, FST = 14, 12
LW = dict(thin=0.9, axis=1.4, main=2.0, bold=2.6)
MINUS = '−'


def esc(s):
    return str(s).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('"', '&quot;')


def r1(v):
    s = f'{v:.1f}'
    return s[:-2] if s.endswith('.0') else s


def text_w(s, size=FS):
    """Rough rendered width for layout (the render check measures the real one)."""
    w = 0.0
    for ch in str(s):
        if ch in 'il.,:;|!\'’ ':
            w += 0.30
        elif ch in '⁰¹²³⁴⁵⁶⁷⁸⁹⁻₀₁₂₃₄₅₆₇₈₉ₑ':
            w += 0.40
        elif ch in 'mwMWΩ×':
            w += 0.85
        elif ch.isupper() or ch in 'µπθλρεσ':
            w += 0.66
        else:
            w += 0.56
    return w * size


class Figure:
    def __init__(self, svg, alt, values):
        self.svg, self.alt, self.values = svg, alt, list(values)


class Canvas:
    def __init__(self, w, h):
        self.w, self.h = w, h
        self.els = []
        self.values = []

    # ── primitives ──────────────────────────────────────────────────────
    def _st(self, color, lw, fill='none', dash=None, cap='round'):
        s = f'stroke:{color};stroke-width:{LW.get(lw, lw)};fill:{fill};stroke-linecap:{cap};stroke-linejoin:round'
        if dash:
            s += f';stroke-dasharray:{dash}'
        return s

    def line(self, x1, y1, x2, y2, color=INK, lw='main', dash=None):
        self.els.append(f'<line x1="{r1(x1)}" y1="{r1(y1)}" x2="{r1(x2)}" y2="{r1(y2)}" style="{self._st(color, lw, dash=dash)}"/>')

    def poly(self, pts, color=INK, lw='main', fill='none', closed=False, dash=None):
        p = ' '.join(f'{r1(x)},{r1(y)}' for x, y in pts)
        tag = 'polygon' if closed else 'polyline'
        self.els.append(f'<{tag} points="{p}" style="{self._st(color, lw, fill, dash)}"/>')

    def path(self, d, color=INK, lw='main', fill='none', dash=None):
        self.els.append(f'<path d="{d}" style="{self._st(color, lw, fill, dash)}"/>')

    def rect(self, x, y, w, h, color=INK, lw='main', fill='none', rx=0, dash=None):
        self.els.append(f'<rect x="{r1(x)}" y="{r1(y)}" width="{r1(w)}" height="{r1(h)}" rx="{rx}" style="{self._st(color, lw, fill, dash)}"/>')

    def circle(self, cx, cy, r, color=INK, lw='main', fill='none', dash=None):
        self.els.append(f'<circle cx="{r1(cx)}" cy="{r1(cy)}" r="{r1(r)}" style="{self._st(color, lw, fill, dash)}"/>')

    def dot(self, cx, cy, r=3.2, color=INK):
        self.els.append(f'<circle cx="{r1(cx)}" cy="{r1(cy)}" r="{r1(r)}" style="fill:{color};stroke:none"/>')

    def text(self, x, y, s, size=FS, anchor='middle', color=INK, weight=None, italic=False, value=None):
        """value: True = a given value (checked against the stem); None = checked if it contains a digit;
        False = structural label (tick numbers, 'n = 2', axis names)."""
        if value or (value is None and re.search(r'[0-9]', str(s))):
            self.values.append(str(s))
        st = f'fill:{color}'
        if weight:
            st += f';font-weight:{weight}'
        if italic:
            st += ';font-style:italic'
        self.els.append(f'<text x="{r1(x)}" y="{r1(y)}" font-size="{size}" text-anchor="{anchor}" '
                        f'dominant-baseline="central" style="{st}">{esc(s)}</text>')

    def arrowhead(self, x, y, ang, color=INK, size=9):
        a1, a2 = ang + math.radians(155), ang - math.radians(155)
        pts = [(x, y), (x + size * math.cos(a1), y + size * math.sin(a1)), (x + size * math.cos(a2), y + size * math.sin(a2))]
        p = ' '.join(f'{r1(px)},{r1(py)}' for px, py in pts)
        self.els.append(f'<polygon points="{p}" style="fill:{color};stroke:none"/>')

    def arrow(self, x1, y1, x2, y2, color=INK, lw='main', head=9, dash=None, both=False):
        ang = math.atan2(y2 - y1, x2 - x1)
        hx, hy = x2 - head * 0.7 * math.cos(ang), y2 - head * 0.7 * math.sin(ang)
        sx, sy = x1, y1
        if both:
            sx, sy = x1 + head * 0.7 * math.cos(ang), y1 + head * 0.7 * math.sin(ang)
            self.arrowhead(x1, y1, ang + math.pi, color, head)
        self.line(sx, sy, hx, hy, color, lw, dash)
        self.arrowhead(x2, y2, ang, color, head)

    def dim(self, x1, y1, x2, y2, label, side=1, value=None, size=FST, off=12, color=None):
        """Dimension arrow with a label beside its middle (side: +1 above/right, −1 below/left)."""
        color = color or MUT
        self.arrow(x1, y1, x2, y2, color, 'thin', head=7, both=True)
        mx, my = (x1 + x2) / 2, (y1 + y2) / 2
        if abs(y2 - y1) < abs(x2 - x1):
            self.text(mx, my - side * off, label, size, value=value)
        else:
            anchor = 'start' if side > 0 else 'end'
            self.text(mx + side * 6, my, label, size, anchor=anchor, value=value)

    def svg(self, title, desc):
        body = ''.join(self.els)
        h = hashlib.sha1((title + desc + body).encode('utf-8')).hexdigest()[:8]
        fid = f'fg{h}'
        return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {r1(self.w)} {r1(self.h)}" role="img" '
                f'aria-labelledby="{fid}-t {fid}-d" style="font-family:{FONT};max-width:100%;height:auto">'
                f'<title id="{fid}-t">{esc(title)}</title><desc id="{fid}-d">{esc(desc)}</desc>{body}</svg>')

    def done(self, title, desc):
        return Figure(self.svg(title, desc), desc, self.values)


# ═════════════════════════ number helpers ═════════════════════════

def nice_step(span, n=5):
    raw = span / max(n, 1)
    mag = 10 ** math.floor(math.log10(raw))
    for m in (1, 2, 2.5, 5, 10):
        if m * mag >= raw * 0.999:
            return m * mag
    return 10 * mag


def ticks(lo, hi, n=5):
    step = nice_step(hi - lo, n)
    start = math.ceil(lo / step - 1e-9) * step
    out, v = [], start
    while v <= hi + step * 1e-6:
        out.append(round(v, 10))
        v += step
    return out, step


def fmt(v, step=None):
    if step is None:
        step = abs(v) if v else 1
    d = max(0, -math.floor(math.log10(step) + 1e-9))
    if step / 10 ** math.floor(math.log10(step) + 1e-9) in (2.5,) and d >= 0:
        d += 1
    s = f'{v:.{d}f}'
    if abs(float(s)) == 0:
        s = '0'
    return s.replace('-', MINUS)


def numbers_after(stem, label):
    """The comma-separated numbers that follow `label =` in a stem, e.g. 't/s ='."""
    i = stem.index(label)
    tail = stem[i + len(label):]
    tail = tail.split('=', 1)[1]
    m = re.match(r'\s*([−\-]?\d+(?:\.\d+)?(?:\s*,\s*[−\-]?\d+(?:\.\d+)?)*)', tail)
    if not m:
        raise ValueError(f'no numbers after {label!r}')
    return [float(x.strip().replace('−', '-')) for x in m.group(1).split(',')]


# ═════════════════════════ graphs ═════════════════════════

def plot(xlabel, ylabel, series, title, desc, xr=None, yr=None, w=400, h=290, notes=(), hlines=(), vlines=(),
         xticks=None, yticks=None, grid=True, nx=5, ny=5, legend=None, xtl=None, ytl=None, dims=(), ybreak=False):
    """xy graph. series: dicts with x, y (data units), kind 'line'|'points'|'step', color, dash, lw.
    notes: (x, y, text, anchor, dx, dy, is_value). hlines/vlines: (value, label or None, is_value)."""
    xs = [x for s in series for x in s['x']] + [v for v, *_ in vlines]
    ys = [y for s in series for y in s['y']] + [v for v, *_ in hlines]
    if xr is None:
        xr = (min(0, min(xs)), max(xs))
    if yr is None:
        lo, hi = min(0, min(ys)), max(ys)
        pad = (hi - lo) * 0.08
        yr = (lo - (pad if lo < 0 else 0), hi + pad)
    if xtl is not None:   # explicit (value, label) ticks, e.g. symbolic 'T/2', 'T'
        xtv, xlabs = [v for v, _ in xtl], [t for _, t in xtl]
    else:
        xtv, xs_step = ticks(*xr, nx) if xticks is None else (xticks, (xticks[1] - xticks[0]) if len(xticks) > 1 else 1)
        xr = (min(xr[0], xtv[0]), max(xr[1], xtv[-1]))
        xlabs = [fmt(v, xs_step) for v in xtv]
    if ytl is not None:
        ytv, ylabs = [v for v, _ in ytl], [t for _, t in ytl]
    else:
        ytv, ys_step = ticks(*yr, ny) if yticks is None else (yticks, (yticks[1] - yticks[0]) if len(yticks) > 1 else 1)
        yr = (min(yr[0], ytv[0]), max(yr[1], ytv[-1]))
        ylabs = [fmt(v, ys_step) for v in ytv]
    left = max([text_w(s, FST) for s in ylabs] + [8]) + 16
    top, bottom, right = 34, 48, 18
    c = Canvas(w, h)
    pw, ph = w - left - right, h - top - bottom
    X = lambda v: left + (v - xr[0]) / (xr[1] - xr[0]) * pw
    Y = lambda v: top + ph - (v - yr[0]) / (yr[1] - yr[0]) * ph
    if grid:
        for v in xtv:
            c.line(X(v), top, X(v), top + ph, GRID, 'thin')
        for v in ytv:
            c.line(left, Y(v), left + pw, Y(v), GRID, 'thin')
    ax_y = Y(0) if yr[0] <= 0 <= yr[1] else top + ph
    ax_x = X(0) if xr[0] <= 0 <= xr[1] else left
    c.line(left, ax_y, left + pw + 6, ax_y, INK, 'axis')
    c.line(ax_x, top + ph, ax_x, top - 6, INK, 'axis')
    c.arrowhead(left + pw + 10, ax_y, 0, INK, 7)
    c.arrowhead(ax_x, top - 10, -math.pi / 2, INK, 7)
    mid_axis = ax_y < top + ph - 1
    for v, s in zip(xtv, xlabs):
        c.line(X(v), ax_y, X(v), ax_y + 4, INK, 'thin')
        if mid_axis and not grid and v != 0:   # labels sit under the plot, so guide them up to the axis
            c.line(X(v), top, X(v), top + ph, GRID, 'thin', dash='2 3')
        if s:
            c.text(X(v), top + ph + 12, s, FST, value=False)
    for v, s in zip(ytv, ylabs):
        c.line(ax_x - 4, Y(v), ax_x, Y(v), INK, 'thin')
        if s:
            c.text(ax_x - 7, Y(v), s, FST, anchor='end', value=False)
    c.text(left + pw / 2, top + ph + 32, xlabel, FS, value=False)
    c.text(max(4, ax_x - 4), 14, ylabel, FS, anchor='start', value=False)
    for v, lab, isv in hlines:
        c.line(left, Y(v), left + pw, Y(v), MUT, 'thin', dash='5 4')
        if lab:
            c.text(left + pw - 2, Y(v) - 10, lab, FST, anchor='end', value=isv)
    for v, lab, isv in vlines:
        c.line(X(v), top, X(v), top + ph, MUT, 'thin', dash='5 4')
        if lab:
            c.text(X(v) + 4, (top + ph - 9) if mid_axis else (top + 8), lab, FST, anchor='start', value=isv)
    for s in series:
        col = s.get('color', ACC)
        pts = [(X(x), Y(y)) for x, y in zip(s['x'], s['y'])]
        kind = s.get('kind', 'line')
        if kind == 'line':
            runs, run = [], []
            for (px, py), y in zip(pts, s['y']):   # drop parts outside the y range (zoomed axes)
                if yr[0] - 1e-9 <= y <= yr[1] + 1e-9:
                    run.append((px, py))
                elif run:
                    runs.append(run)
                    run = []
            if run:
                runs.append(run)
            for rn in runs:
                if len(rn) > 1:
                    c.poly(rn, col, s.get('lw', 'main'), dash=s.get('dash'))
        elif kind == 'points':
            for px, py in pts:
                c.line(px - 4, py - 4, px + 4, py + 4, col, 'axis')
                c.line(px - 4, py + 4, px + 4, py - 4, col, 'axis')
        elif kind == 'dots':
            for px, py in pts:
                c.dot(px, py, 3.4, col)
    for x, y, t, anchor, dx, dy, isv in notes:
        c.text(X(x) + dx, Y(y) + dy, t, FST, anchor=anchor, value=isv)
    for x1, y1, x2, y2, t, side, isv in dims:   # dimension arrows in data units
        c.dim(X(x1), Y(y1), X(x2), Y(y2), t, side=side, value=isv)
    if ybreak:   # axis does not start at zero
        for k in (0, 6):
            c.line(ax_x - 6, top + ph - 10 - k, ax_x + 6, top + ph - 16 - k, INK, 'thin')
    if legend:   # one row in the header, right-aligned
        widths = [30 + text_w(lab, FST) + 14 for lab, _, _ in legend]
        lx = w - right - sum(widths)
        for (lab, col, dash), wd in zip(legend, widths):
            c.line(lx, 14, lx + 22, 14, col, 'main', dash=dash)
            c.text(lx + 28, 14, lab, FST, anchor='start', value=False if len(lab) < 3 else None)
            lx += wd
    return c.done(title, desc)


def curve(f, x0, x1, n=160):
    xs = [x0 + (x1 - x0) * i / n for i in range(n + 1)]
    return xs, [f(x) for x in xs]


# ═════════════════════════ data table (optionally with a plot below) ═════════════════════════

def table(headers, rows, title, desc, w=400, values=True, canvas=None, y0=8):
    c = canvas or Canvas(w, 0)
    ncol = len(headers)
    colw = [max([text_w(headers[i], FS)] + [text_w(r[i], FS) for r in rows]) + 24 for i in range(ncol)]
    tw = sum(colw)
    x0 = (w - tw) / 2
    rh = 28
    y = y0
    c.rect(x0, y, tw, rh * (len(rows) + 1), INK, 'thin')
    c.rect(x0, y, tw, rh, INK, 'thin', fill=FILLC)
    x = x0
    for i, hd in enumerate(headers):
        c.text(x + colw[i] / 2, y + rh / 2, hd, FS, weight=600, value=False)
        if i:
            c.line(x, y, x, y + rh * (len(rows) + 1), INK, 'thin')
        x += colw[i]
    for j, row in enumerate(rows):
        yy = y + rh * (j + 1)
        c.line(x0, yy, x0 + tw, yy, INK, 'thin')
        x = x0
        for i, cell in enumerate(row):
            c.text(x + colw[i] / 2, yy + rh / 2, cell, FS, value=values)
            x += colw[i]
    hgt = y + rh * (len(rows) + 1) + 8
    if canvas is None:
        c.h = hgt
        return c.done(title, desc)
    return hgt


def table_rows_from_stem(stem, labels):
    cols = [numbers_after(stem, lab) for lab in labels]
    n = len(cols[0])
    assert all(len(cl) == n for cl in cols), 'table columns differ in length'
    raw = []
    for lab in labels:
        i = stem.index(lab)
        tail = stem[i + len(lab):].split('=', 1)[1]
        m = re.match(r'\s*([−\-]?\d+(?:\.\d+)?(?:\s*,\s*[−\-]?\d+(?:\.\d+)?)*)', tail)
        raw.append([x.strip() for x in m.group(1).split(',')])
    return cols, [list(r) for r in zip(*raw)]


# ═════════════════════════ circuits ═════════════════════════

class El:
    """One component drawn horizontally on a wire. kind: R C cell battery ac lamp diode switch V A G wire var_R"""

    def __init__(self, kind, label=None, value=True, w=None, flip=False, closed=False):
        self.kind, self.label, self.value, self.flip, self.closed = kind, label, value, flip, closed
        self.w = w or max(64, (text_w(label, FS) + 16) if label else 0)

    def size(self):
        return self.w, (30 if self.label else 18), 18

    def draw(self, c, x, y, w, below=False):
        cx = x + w / 2
        k = self.kind
        half = {'R': 18, 'var_R': 18, 'C': 5, 'cell': 5, 'battery': 12, 'ac': 12, 'lamp': 11, 'diode': 9, 'switch': 14,
                'V': 12, 'A': 12, 'G': 12, 'wire': 0, 'scope': 20}[k]
        c.line(x, y, cx - half, y, INK, 'main')
        c.line(cx + half, y, x + w, y, INK, 'main')
        if k in ('R', 'var_R'):
            c.rect(cx - 18, y - 7, 36, 14, INK, 'main')
            if k == 'var_R':
                c.arrow(cx - 16, y + 12, cx + 16, y - 14, INK, 'thin', head=7)
        elif k == 'C':
            c.line(cx - 5, y - 12, cx - 5, y + 12, INK, 'bold')
            c.line(cx + 5, y - 12, cx + 5, y + 12, INK, 'bold')
        elif k in ('cell', 'battery'):
            offs = [-5] if k == 'cell' else [-12, 2]
            for o in offs:
                c.line(cx + o, y - 13, cx + o, y + 13, INK, 'main')  # long plate (+)
                c.line(cx + o + 10, y - 7, cx + o + 10, y + 7, INK, 'bold')  # short plate (−)
            if k == 'battery':
                c.line(cx - 2, y, cx + 2, y, INK, 'thin', dash='2 2')
        elif k == 'ac':
            c.circle(cx, y, 12, INK, 'main')
            c.path(f'M{r1(cx-7)},{r1(y)} q3.5,-7 7,0 t7,0', INK, 'axis')
        elif k == 'lamp':
            c.circle(cx, y, 11, INK, 'main')
            d = 11 / math.sqrt(2)
            c.line(cx - d, y - d, cx + d, y + d, INK, 'axis')
            c.line(cx - d, y + d, cx + d, y - d, INK, 'axis')
        elif k == 'diode':
            s = -1 if self.flip else 1
            c.poly([(cx - 9 * s, y - 9), (cx - 9 * s, y + 9), (cx + 7 * s, y)], INK, 'main', closed=True)
            c.line(cx + 9 * s, y - 9, cx + 9 * s, y + 9, INK, 'main')
            c.line(cx + 7 * s, y, cx + 9 * s, y, INK, 'main')
        elif k == 'switch':
            c.dot(cx - 14, y, 2.6)
            c.dot(cx + 14, y, 2.6)
            if self.closed:
                c.line(cx - 14, y, cx + 14, y, INK, 'main')
            else:
                c.line(cx - 14, y, cx + 12, y - 12, INK, 'main')
        elif k in ('V', 'A', 'G'):
            c.circle(cx, y, 12, INK, 'main')
            c.text(cx, y + 0.5, k, FST, weight=600, value=False)
        elif k == 'scope':
            c.rect(cx - 20, y - 13, 40, 26, INK, 'main', rx=4)
            c.path(f'M{r1(cx-13)},{r1(y)} q3.25,-9 6.5,0 t6.5,0 t6.5,0 t6.5,0', ACC, 'axis')
        if self.label:
            ly = y + (24 if below else -24)
            c.text(cx, ly, self.label, FS, value=self.value)


class Series:
    def __init__(self, *items):
        self.items = list(items)

    def size(self):
        ss = [i.size() for i in self.items]
        return sum(s[0] for s in ss), max(s[1] for s in ss), max(s[2] for s in ss)

    def draw(self, c, x, y, w, below=False):
        nat = self.size()[0]
        extra = (w - nat) / len(self.items)
        for it in self.items:
            iw = it.size()[0] + extra
            it.draw(c, x, y, iw, below)
            x += iw


class Par:
    STUB, GAP = 16, 6

    def __init__(self, *branches):
        self.br = list(branches)

    def size(self):
        ss = [b.size() for b in self.br]
        w = max(s[0] for s in ss) + 2 * self.STUB
        down = ss[0][2] + sum(self.GAP + s[1] + s[2] for s in ss[1:])
        return w, ss[0][1], down

    def draw(self, c, x, y, w, below=False):
        ss = [b.size() for b in self.br]
        ys = [y]
        for i in range(1, len(self.br)):
            ys.append(ys[-1] + ss[i - 1][2] + self.GAP + ss[i][1])
        x1, x2 = x + self.STUB, x + w - self.STUB
        c.line(x, y, x1, y, INK, 'main')
        c.line(x2, y, x + w, y, INK, 'main')
        c.line(x1, y, x1, ys[-1], INK, 'main')
        c.line(x2, y, x2, ys[-1], INK, 'main')
        for b, by in zip(self.br, ys):
            b.draw(c, x1, by, x2 - x1, below)
        c.dot(x1, y)
        c.dot(x2, y)


def loop(top, bottom, title, desc, margin=26, gap=46, w_min=300):
    tw, tup, tdown = top.size()
    bw, bup, bdown = bottom.size()
    W = max(tw, bw, w_min - 2 * margin)
    c = Canvas(W + 2 * margin, 0)
    yt = margin + tup - 8
    yb = yt + tdown + gap + bup
    top.draw(c, margin, yt, W)
    bottom.draw(c, margin, yb, W, below=True)
    c.line(margin, yt, margin, yb, INK, 'main')
    c.line(margin + W, yt, margin + W, yb, INK, 'main')
    c.h = yb + bdown + 22
    return c.done(title, desc)


def circuit(net, source, title, desc, **kw):
    return loop(net, source if isinstance(source, (Series, Par)) else Series(source), title, desc, **kw)


# ═════════════════════════ energy levels ═════════════════════════

def energy_levels(levels, title, desc, transitions=(), w=400, h=300, unit='eV'):
    """levels: (name, label, value). transitions: (i_from, i_to, label or None, is_value)."""
    vals = [v for _, _, v in levels]
    lo, hi = min(vals), max(vals)
    top, bot = 26, h - 22
    ys = [bot - (v - lo) / ((hi - lo) or 1) * (bot - top) for v in vals]
    order = sorted(range(len(ys)), key=lambda i: -ys[i])  # bottom (lowest energy) first
    for a, b in zip(order, order[1:]):  # keep at least 20 px between neighbouring levels
        if ys[a] - ys[b] < 20:
            ys[b] = ys[a] - 20
    c = Canvas(w, h)
    x1, x2 = 110, w - 110
    for (name, lab, v), y in zip(levels, ys):
        c.line(x1, y, x2, y, INK, 'main')
        if name:
            c.text(x1 - 8, y, name, FST, anchor='end', value=False)
        if lab:
            c.text(x2 + 8, y, lab, FST, anchor='start', value=True)
    n = len(transitions)
    for k, (i, j, lab, isv) in enumerate(transitions):
        x = x1 + (x2 - x1) * (k + 1) / (n + 1)
        col = ACC if vals[j] < vals[i] else ACC2
        c.arrow(x, ys[i], x, ys[j], col, 'main', head=9)
        if lab:
            c.text(x + 6, (ys[i] + ys[j]) / 2, lab, FST, anchor='start', color=col, value=isv)
    c.text(14, 12, f'energy / {unit}', FST, anchor='start', value=False)
    c.line(14, h - 14, 14, 24, MUT, 'thin')
    c.arrowhead(14, 20, -math.pi / 2, MUT, 7)
    return c.done(title, desc)


# ═════════════════════════ fields ═════════════════════════

def plates(title, desc, top='+', bottom=MINUS, labels=(), gap_label=None, n_lines=7, w=400, h=220, beam=None,
           field_dir='down', length_label=None):
    """Parallel horizontal plates with a uniform field. beam: dict(path='straight'|'up'|'down', label, v_label)."""
    c = Canvas(w, h)
    x0, x1 = 90, w - 90
    yt, yb = 50, h - 50
    c.rect(x0, yt - 8, x1 - x0, 8, INK, 'thin', fill=FILLC)
    c.rect(x0, yb, x1 - x0, 8, INK, 'thin', fill=FILLC)
    c.text(x0 - 12, yt - 4, top, FS, anchor='end', weight=600)
    c.text(x0 - 12, yb + 4, bottom, FS, anchor='end', weight=600)
    for i in range(n_lines):
        x = x0 + 20 + (x1 - x0 - 40) * i / (n_lines - 1)
        if field_dir == 'down':
            c.arrow(x, yt + 6, x, yb - 6, ACC, 'thin', head=7)
        else:
            c.arrow(x, yb - 6, x, yt + 6, ACC, 'thin', head=7)
    if gap_label:
        c.dim(x1 + 22, yt, x1 + 22, yb, gap_label, side=1)
    if length_label:
        c.dim(x0, yb + 26, x1, yb + 26, length_label, side=-1, off=12)
    for x, y, t, anchor, isv in labels:
        c.text(x, y, t, FS, anchor=anchor, value=isv)
    if beam:
        ym = (yt + yb) / 2
        c.arrow(20, ym, x0 - 4, ym, ACC2, 'main')
        if beam.get('label'):
            c.text(22, ym - 14, beam['label'], FST, anchor='start', value=beam.get('is_value', False))
        if beam['path'] == 'straight':
            c.line(x0, ym, x1 + 40, ym, ACC2, 'main', dash='6 4')
        else:
            s = -1 if beam['path'] == 'up' else 1
            pts = [(x0 + (x1 - x0) * t, ym + s * 0.7 * (yb - yt) / 2 * t * t) for t in [i / 30 for i in range(31)]]
            c.poly(pts, ACC2, 'main', dash='6 4')
    return c.done(title, desc)


def radial(title, desc, sign='+', inward=None, label=None, n=12, w=300, h=260, r0=26, r1_=110, body_label=None):
    c = Canvas(w, h)
    cx, cy = w / 2, h / 2
    c.circle(cx, cy, r0, INK, 'main', fill=FILLC)
    if body_label:
        c.text(cx, cy, body_label, FS, weight=600)
    inward = (sign == MINUS) if inward is None else inward
    for i in range(n):
        a = 2 * math.pi * i / n + math.pi / n
        p1 = (cx + (r0 + 6) * math.cos(a), cy + (r0 + 6) * math.sin(a))
        p2 = (cx + r1_ * math.cos(a), cy + r1_ * math.sin(a))
        if inward:
            c.arrow(*p2, *p1, ACC, 'axis', head=8)
        else:
            c.arrow(*p1, *p2, ACC, 'axis', head=8)
    if label:
        c.text(cx, h - 10, label, FST, value=True)
    return c.done(title, desc)


def b_region(c, x, y, w, h, into=True, step=34):
    """Symbols for a uniform field into (×) or out of (•) the page, filling a box."""
    c.rect(x, y, w, h, MUT, 'thin', dash='4 4')
    nx, ny = max(2, int(w // step)), max(2, int(h // step))
    for i in range(nx):
        for j in range(ny):
            px = x + (i + 0.5) * w / nx
            py = y + (j + 0.5) * h / ny
            if into:
                c.line(px - 4, py - 4, px + 4, py + 4, MUT, 'axis')
                c.line(px - 4, py + 4, px + 4, py - 4, MUT, 'axis')
            else:
                c.circle(px, py, 4.5, MUT, 'thin')
                c.dot(px, py, 1.6, MUT)


def wire_section(c, cx, cy, out=True, r=9):
    c.circle(cx, cy, r, INK, 'main', fill=FILLC)
    if out:
        c.dot(cx, cy, 2.6)
    else:
        d = r * 0.6
        c.line(cx - d, cy - d, cx + d, cy + d, INK, 'axis')
        c.line(cx - d, cy + d, cx + d, cy - d, INK, 'axis')


def wire_circles(title, desc, out=True, radii=(30, 60, 90), w=300, h=260, label=None, point=None):
    """Magnetic field lines round a long straight wire seen end-on. point: (r_px, angle_deg, label)."""
    c = Canvas(w, h)
    cx, cy = w / 2, h / 2 - 6
    for r in radii:
        c.circle(cx, cy, r, ACC, 'axis')
        # arrowhead at the top of each circle: anticlockwise for current out of the page
        c.arrowhead(cx + (-1 if out else 1) * 2, cy - r, math.pi if out else 0, ACC, 8)
    wire_section(c, cx, cy, out)
    c.text(cx - 19, cy + 1, 'I', FS, italic=True, value=False)
    if point:
        rp, ang, lab = point
        a = math.radians(ang)
        px, py = cx + rp * math.cos(a), cy - rp * math.sin(a)
        c.dot(px, py, 3.4, ACC2)
        c.text(px + 8, py - 10, lab, FST, anchor='start', color=ACC2)
    if label:
        c.text(cx, h - 12, label, FST, value=True)
    return c.done(title, desc)


def hanging_mass(title, desc, angle_deg, side_force_label='F', weight_label='W', tension_label='T',
                 angle_label=None, field_label=None, field_dir='right', w=300, h=270):
    c = Canvas(w, h)
    px, py = w / 2 - 30, 30
    L = 150
    a = math.radians(angle_deg)
    bx, by = px + L * math.sin(a), py + L * math.cos(a)
    c.line(px - 50, py, px + 50, py, INK, 'axis')
    for i in range(6):
        c.line(px - 45 + i * 18, py, px - 53 + i * 18, py - 8, INK, 'thin')
    c.line(px, py, px, py + 70, MUT, 'thin', dash='4 4')
    c.line(px, py, bx, by, INK, 'axis')
    if angle_label:
        c.path(f'M{r1(px)},{r1(py+40)} A40,40 0 0,0 {r1(px+40*math.sin(a))},{r1(py+40*math.cos(a))}', MUT, 'thin')
        c.text(px + 14 + 30 * math.sin(a / 2), py + 54 * math.cos(a / 2) + 4, angle_label, FST, anchor='start', value=True)
    c.circle(bx, by, 12, INK, 'main', fill=FILLC)
    tl = 60
    c.arrow(bx - 12 * math.sin(a), by - 12 * math.cos(a), bx - (12 + tl) * math.sin(a), by - (12 + tl) * math.cos(a), ACC, 'main')
    mx, my = bx - (12 + tl / 2) * math.sin(a), by - (12 + tl / 2) * math.cos(a)
    c.text(mx + 14 * math.cos(a), my - 14 * math.sin(a) + 2, tension_label, FS, anchor='start', color=ACC)
    c.arrow(bx, by + 12, bx, by + 70, ACC, 'main')
    c.text(bx + 10, by + 66, weight_label, FS, anchor='start', color=ACC)
    s = 1 if field_dir == 'right' else -1
    c.arrow(bx + 12 * s, by, bx + 70 * s, by, ACC2, 'main')
    c.text(bx + 76 * s, by, side_force_label, FS, anchor='start' if s > 0 else 'end', color=ACC2)
    if field_label:
        c.arrow(20, h - 18, 90, h - 18, MUT, 'axis', head=8)
        c.text(98, h - 18, field_label, FST, anchor='start', value=True)
    return c.done(title, desc)


def vectors(title, desc, arrows, w=320, h=240, origin=None, scale=1.0, angle_marks=()):
    """arrows: (dx, dy, label, color, is_value) from a common origin, in px (dy up positive)."""
    c = Canvas(w, h)
    ox, oy = origin or (w / 2, h / 2)
    for dx, dy, lab, col, isv in arrows:
        ex, ey = ox + dx * scale, oy - dy * scale
        c.arrow(ox, oy, ex, ey, col, 'main')
        ang = math.atan2(-(ey - oy), ex - ox)
        lx, ly = ex + 14 * math.cos(ang), ey - 14 * math.sin(ang)
        anchor = 'start' if math.cos(ang) > 0.3 else ('end' if math.cos(ang) < -0.3 else 'middle')
        c.text(lx, ly, lab, FST, anchor=anchor, color=col, value=isv)
    c.dot(ox, oy, 3.4)
    for a0, a1, r, lab, isv in angle_marks:
        p0 = (ox + r * math.cos(math.radians(a0)), oy - r * math.sin(math.radians(a0)))
        p1 = (ox + r * math.cos(math.radians(a1)), oy - r * math.sin(math.radians(a1)))
        sweep = 0 if a1 > a0 else 1
        c.path(f'M{r1(p0[0])},{r1(p0[1])} A{r},{r} 0 0,{sweep} {r1(p1[0])},{r1(p1[1])}', MUT, 'thin')
        am = math.radians((a0 + a1) / 2)
        c.text(ox + (r + 14) * math.cos(am), oy - (r + 14) * math.sin(am), lab, FST, value=isv)
    return c.done(title, desc)


# ═════════════════════════ stem parsing ═════════════════════════

def grab(stem, pattern, i=1):
    r"""A number from the stem: grab(s, r'peak ([\d.]+) divisions'). Minus signs and standard form handled."""
    m = re.search(pattern, stem)
    if not m:
        raise ValueError(f'pattern {pattern!r} not in stem')
    t = m.group(i).replace('−', '-').replace(' ', '')
    if '×10' in t:
        a, e = t.split('×10')
        return float(a) * 10 ** int(e.translate(str.maketrans('⁻⁰¹²³⁴⁵⁶⁷⁸⁹', '-0123456789')))
    return float(t)


# ═════════════════════════ alternating currents ═════════════════════════

def wave_xy(f, t0, t1, n=400):
    """Sample f(t) on [t0, t1]."""
    xs = [t0 + (t1 - t0) * i / n for i in range(n + 1)]
    return xs, [f(x) for x in xs]


def steps_xy(levels, cycles=2.0, t0=0.0):
    """Piecewise-constant waveform: levels = [(value, duration), ...] repeated; vertical edges included."""
    period = sum(d for _, d in levels)
    xs, ys, t = [], [], t0
    while t < t0 + cycles * period - 1e-12:
        for v, d in levels:
            if t >= t0 + cycles * period - 1e-12:
                break
            xs += [t, min(t + d, t0 + cycles * period)]
            ys += [v, v]
            t += d
    return xs, ys


def scope(title, desc, traces, gain=None, base=None, nx=10, ny=8, d=34):
    """Oscilloscope screen. traces: dict(amp, period, shift=0, offset=0, color) in divisions;
    a trace with period None is a horizontal line at offset; 'vertical' draws a time-base-off line of half-length amp."""
    need = max(abs(tr.get('offset', 0)) + tr.get('amp', 0) for tr in traces)
    ny = max(ny, 2 * math.ceil(need + 0.3))
    W, x0, y0 = nx * d + 40, 20, 12
    c = Canvas(W, y0 + ny * d + (14 if gain or base else 8) + 20 * bool(gain) + 20 * bool(base))
    c.rect(x0, y0, nx * d, ny * d, INK, 'axis', rx=6)
    for i in range(1, nx):
        c.line(x0 + i * d, y0, x0 + i * d, y0 + ny * d, GRID, 'thin')
    for j in range(1, ny):
        c.line(x0, y0 + j * d, x0 + nx * d, y0 + j * d, GRID, 'thin')
    cx, cy = x0 + nx * d / 2, y0 + ny * d / 2
    c.line(x0, cy, x0 + nx * d, cy, MUT, 'thin')
    c.line(cx, y0, cx, y0 + ny * d, MUT, 'thin')
    for k in range(1, nx * 5):
        c.line(x0 + k * d / 5, cy - 3, x0 + k * d / 5, cy + 3, MUT, 'thin')
    for k in range(1, ny * 5):
        c.line(cx - 3, y0 + k * d / 5, cx + 3, y0 + k * d / 5, MUT, 'thin')
    for tr in traces:
        col = tr.get('color', ACC)
        if tr.get('vertical'):
            c.line(cx, cy - tr['amp'] * d, cx, cy + tr['amp'] * d, col, 'bold')
            continue
        if tr.get('period') is None:
            c.line(x0, cy - tr.get('offset', 0) * d, x0 + nx * d, cy - tr.get('offset', 0) * d, col, 'main')
            continue
        n = 400
        pts = []
        for i in range(n + 1):
            u = nx * i / n
            v = tr.get('offset', 0) + tr['amp'] * math.sin(2 * math.pi * (u - tr.get('shift', 0)) / tr['period'])
            if tr.get('rectify') == 'full':
                v = abs(v)
            elif tr.get('rectify') == 'half':
                v = max(0.0, v)
            pts.append((x0 + u * d, cy - v * d))
        c.poly(pts, col, 'main')
    yl = y0 + ny * d + 18
    if gain:
        c.text(x0, yl, f'Y-gain: {gain}', FST, anchor='start')
        yl += 20
    if base:
        c.text(x0, yl, f'time-base: {base}', FST, anchor='start')
    return c.done(title, desc)


def rectified_xy(V0, f, cycles=2.0, full=True, RC=None, n=900, drop=0.0):
    """Rectified sine (and, with RC, the smoothed capacitor p.d. for an ideal charging diode). t in ms."""
    T = 1 / f
    ts = [cycles * T * i / n for i in range(n + 1)]
    raw = [max(0.0, (abs if full else (lambda x: x))(V0 * math.sin(2 * math.pi * f * t))) for t in ts]
    out = None
    if RC:
        out, vc = [], 0.0
        for k, t in enumerate(ts):
            if k:
                vc *= math.exp(-(t - ts[k - 1]) / RC)
            vc = max(vc, raw[k])
            out.append(vc)
    return [t * 1000 for t in ts], raw, out


def _rot(px, py, ox, oy, a):
    ca, sa = math.cos(a), math.sin(a)
    return ox + px * ca - py * sa, oy + px * sa + py * ca


def diode_on(c, x1, y1, x2, y2, color=INK):
    """A diode drawn on the straight wire from (x1,y1) to (x2,y2): anode at the first point."""
    a = math.atan2(y2 - y1, x2 - x1)
    L = math.hypot(x2 - x1, y2 - y1)
    mx, my = (x1 + x2) / 2, (y1 + y2) / 2
    c.line(x1, y1, *_rot(-9, 0, mx, my, a), color, 'main')
    c.line(*_rot(9, 0, mx, my, a), x2, y2, color, 'main')
    tri = [_rot(-9, -9, mx, my, a), _rot(-9, 9, mx, my, a), _rot(7, 0, mx, my, a)]
    c.poly(tri, color, 'main', closed=True)
    c.line(*_rot(8, -9, mx, my, a), *_rot(8, 9, mx, my, a), color, 'main')
    c.line(*_rot(7, 0, mx, my, a), *_rot(8, 0, mx, my, a), color, 'main')
    assert L > 30


def vcomp(c, kind, x, y1, y2, label=None, side=1, value=None):
    """A component on a vertical wire from y1 (top) to y2: kind R, C, ac, cell, lamp, V, A."""
    cy = (y1 + y2) / 2
    half = {'R': 18, 'C': 5, 'ac': 12, 'cell': 5, 'lamp': 11, 'V': 12, 'A': 12, 'G': 12}[kind]
    c.line(x, y1, x, cy - half, INK, 'main')
    c.line(x, cy + half, x, y2, INK, 'main')
    if kind == 'R':
        c.rect(x - 7, cy - 18, 14, 36, INK, 'main')
    elif kind == 'C':
        c.line(x - 12, cy - 5, x + 12, cy - 5, INK, 'bold')
        c.line(x - 12, cy + 5, x + 12, cy + 5, INK, 'bold')
    elif kind == 'cell':
        c.line(x - 13, cy - 5, x + 13, cy - 5, INK, 'main')
        c.line(x - 7, cy + 5, x + 7, cy + 5, INK, 'bold')
    elif kind == 'ac':
        c.circle(x, cy, 12, INK, 'main')
        c.path(f'M{r1(x-7)},{r1(cy)} q3.5,-7 7,0 t7,0', INK, 'axis')
    elif kind == 'lamp':
        c.circle(x, cy, 11, INK, 'main')
        d = 11 / math.sqrt(2)
        c.line(x - d, cy - d, x + d, cy + d, INK, 'axis')
        c.line(x - d, cy + d, x + d, cy - d, INK, 'axis')
    elif kind in ('V', 'A', 'G'):
        c.circle(x, cy, 12, INK, 'main')
        c.text(x, cy + 0.5, kind, FST, weight=600, value=False)
    if label:
        c.text(x + side * (half + 10 if kind in ('R',) else 20), cy, label, FS, anchor='start' if side > 0 else 'end', value=value)


def bridge(title, desc, supply=None, load='R', load_label=None, cap_label=None, out_signs=True, broken=None, w=456, h=270):
    """Full-wave bridge rectifier: a.c. supply on the left, diamond of four diodes, load (and smoothing capacitor)
    on the right. broken: index 0–3 of a diode drawn as an open circuit (gap)."""
    c = Canvas(w, h)
    T, B, L, R = (227, 40), (227, 200), (157, 120), (297, 120)
    xs = 97
    c.line(xs, T[1], T[0], T[1], INK, 'main')
    c.line(xs, B[1], B[0], B[1], INK, 'main')
    vcomp(c, 'ac', xs, T[1], B[1], supply, side=-1)
    pairs = [(T, R), (B, R), (L, T), (L, B)]
    for k, (p, q) in enumerate(pairs):
        if broken == k:
            mx, my = (p[0] + q[0]) / 2, (p[1] + q[1]) / 2
            c.line(p[0], p[1], p[0] + (mx - p[0]) * 0.6, p[1] + (my - p[1]) * 0.6, INK, 'main')
            c.line(q[0], q[1], q[0] + (mx - q[0]) * 0.6, q[1] + (my - q[1]) * 0.6, INK, 'main')
        else:
            diode_on(c, *p, *q)
    xl = 387
    ybot = h - 26
    c.line(R[0], R[1], xl, R[1], INK, 'main')
    c.line(L[0], L[1], L[0], ybot, INK, 'main')
    c.line(L[0], ybot, xl, ybot, INK, 'main')
    if cap_label is not None:
        xc = 334
        vcomp(c, 'C', xc, R[1], ybot, cap_label or None, side=-1)
        c.dot(xc, R[1])
        c.dot(xc, ybot)
    vcomp(c, load, xl, R[1], ybot, load_label, side=1)
    for p in (T, B, L, R):
        c.dot(*p)
    if out_signs:
        c.text(R[0] + 12, R[1] - 13, '+', FS, weight=600, value=False)
        c.text(L[0] - 13, L[1] - 13, MINUS, FS, weight=600, value=False)
    return c.done(title, desc)


def smoothed_graph(title, desc, V0, f, RC, full=True, cycles=2.5, zoom=False, peak_label=None, min_label=None,
                   ripple_label=None, symbolic=False, t_unit='ms', show_raw=True):
    """Rectified sine (dashed) and the smoothed output for a given time constant, computed from the stem's numbers.
    zoom: y axis from just below the trough (axis break drawn). Only stem values are printed on the y axis."""
    ts, raw, sm = rectified_xy(V0, f, cycles, full, RC)
    T = 1000 / f
    lo = min(sm[len(sm) // 4:])
    series = []
    if show_raw:
        series.append(dict(x=ts, y=raw, color=MUT, lw='axis', dash='5 4'))
    series.append(dict(x=ts, y=sm, color=ACC))
    if zoom:
        span = V0 - lo
        yr = (lo - 1.6 * span, V0 + 0.5 * span)
    else:
        yr = (0, V0 * 1.12)
    ytl = []
    if peak_label:
        ytl.append((V0, peak_label))
    if min_label:
        ytl.append((lo, min_label))
    if not zoom:
        ytl.append((0, '0'))
    xtl = [(0, '0')] + ([(T * k, ('T' if k == 1 else f'{k}T')) for k in range(1, int(cycles) + 1)] if symbolic else [])
    dims, hl, xr = [], [], (0, ts[-1])
    if ripple_label:
        ext = 0.3 * ts[-1]
        xr = (0, ts[-1] + ext)
        series.append(dict(x=[0, ts[-1] + ext * 0.9], y=[lo, lo], color=MUT, lw='thin', dash='3 3'))
        series.append(dict(x=[0, ts[-1] + ext * 0.9], y=[V0, V0], color=MUT, lw='thin', dash='3 3'))
        dims.append((ts[-1] + ext * 0.82, lo, ts[-1] + ext * 0.82, V0, ripple_label, -1, None))
    xl = 't' if symbolic else f't / {t_unit}'
    return plot(xl, 'V', series, title, desc, xr=xr, yr=yr,
                xtl=xtl if symbolic else None, ytl=ytl, dims=dims, ybreak=zoom, nx=6, grid=not symbolic)


def rc_for_trough(V0, Vmin, f, full=True):
    """Time constant that makes the smoothed output fall from V0 to Vmin between peaks (bisection on the model)."""
    lo, hi = 1e-4, 1e3
    for _ in range(80):
        mid = math.sqrt(lo * hi)
        _, _, sm = rectified_xy(V0, f, 2.5, full, mid, n=1500)
        trough = min(sm[len(sm) // 3:])
        if trough < Vmin:
            lo = mid
        else:
            hi = mid
    return math.sqrt(lo * hi)


# ═════════════════════════ composition ═════════════════════════

def _body(fig):
    s = fig.svg
    return s[s.index('</desc>') + 7:s.rindex('</svg>')]


def _vb(fig):
    m = re.search(r'viewBox="0 0 ([\d.]+) ([\d.]+)"', fig.svg)
    return float(m.group(1)), float(m.group(2))


def stack(figs, title, desc, gap=4):
    """Stack figures vertically (e.g. a data table above its graph), centred on the widest."""
    W = max(_vb(f)[0] for f in figs)
    c = Canvas(W, 0)
    y = 0
    for f in figs:
        w, h = _vb(f)
        c.els.append(f'<g transform="translate({r1((W - w) / 2)},{r1(y)})">{_body(f)}</g>')
        c.values += f.values
        y += h + gap
    c.h = y - gap
    return c.done(title, desc)


def table_plot(headers, rows, title, desc, plot_kw):
    """A data table with its graph below. plot_kw: arguments for plot() (same numbers as the table)."""
    t = table(headers, rows, title, desc)
    p = plot(title=title, desc=desc, **plot_kw)
    return stack([t, p], title, desc)


def blocks(items, title, desc, w=440, box_h=46, arrows=True):
    """A left-to-right chain of labelled boxes; item = text or list of lines (first line bold)."""
    n = len(items)
    gapx = 22
    bw = (w - 20 - gapx * (n - 1)) / n
    lines_max = max(len(i) if isinstance(i, (list, tuple)) else 1 for i in items)
    bh = max(box_h, 18 * lines_max + 14)
    c = Canvas(w, bh + 20)
    x = 10
    for k, it in enumerate(items):
        ls = list(it) if isinstance(it, (list, tuple)) else [it]
        c.rect(x, 10, bw, bh, INK, 'axis', fill=FILLC, rx=6)
        y0 = 10 + bh / 2 - 9 * (len(ls) - 1)
        for j, t in enumerate(ls):
            c.text(x + bw / 2, y0 + 18 * j, t, FST, weight=600 if j == 0 and len(ls) > 1 else None)
        if arrows and k < n - 1:
            c.arrow(x + bw + 3, 10 + bh / 2, x + bw + gapx - 3, 10 + bh / 2, INK, 'axis', head=7)
        x += bw + gapx
    return c.done(title, desc)


# ═════════════════════════ electromagnetic induction ═════════════════════════

def field_symbols(c, x, y, w, h, into=True, step=30, color=None, skip=()):
    """× (into the page) or • (out of the page) symbols filling a box; skip: boxes (x, y, w, h) kept clear."""
    color = color or MUT
    nx, ny = max(1, int(w // step)), max(1, int(h // step))
    for i in range(nx):
        for j in range(ny):
            px, py = x + (i + 0.5) * w / nx, y + (j + 0.5) * h / ny
            if any(sx - 6 <= px <= sx + sw + 6 and sy - 6 <= py <= sy + sh + 6 for sx, sy, sw, sh in skip):
                continue
            if into:
                c.line(px - 4, py - 4, px + 4, py + 4, color, 'axis')
                c.line(px - 4, py + 4, px + 4, py - 4, color, 'axis')
            else:
                c.circle(px, py, 4.5, color, 'thin')
                c.dot(px, py, 1.6, color)


def field_legend(c, x, y, text, into=True, value=None):
    if into:
        c.line(x - 4, y - 4, x + 4, y + 4, MUT, 'axis')
        c.line(x - 4, y + 4, x + 4, y - 4, MUT, 'axis')
    else:
        c.circle(x, y, 4.5, MUT, 'thin')
        c.dot(x, y, 1.6, MUT)
    c.text(x + 12, y, text, FST, anchor='start', value=value)


def compass(c, x, y, size=16):
    c.arrow(x, y + size, x, y - size, MUT, 'axis', head=7)
    c.text(x, y - size - 9, 'N', FST, weight=600, value=False)


def rails(title, desc, L_label=None, v_label='v', B_label=None, R_label=None, into=True, rails=True,
          force_label=None, north=False, current=None, w=420, h=250):
    """Top view: a rod sliding on two rails (joined by a resistor) through a uniform field."""
    c = Canvas(w, h)
    y1, y2 = 70, 180
    xr0, xr1 = 84, 340
    rod = 240
    if rails:
        c.line(xr0, y1, xr1, y1, INK, 'main')
        c.line(xr0, y2, xr1, y2, INK, 'main')
        if R_label is not None:
            vcomp(c, 'R', xr0, y1, y2, R_label or None, side=-1)
        else:
            c.line(xr0, y1, xr0, y2, INK, 'main')
    field_symbols(c, 104, y1 + 6 if rails else 40, 226, (y2 - y1 - 12) if rails else 170, into)
    c.line(rod, y1 - 16, rod, y2 + 16, ACC2, 'bold')
    c.arrow(rod + 6, y1 - 26, rod + 70, y1 - 26, ACC2, 'main')
    c.text(rod + 76, y1 - 26, v_label, FST, anchor='start', color=ACC2)
    if force_label:
        c.arrow(rod - 6, y2 + 26, rod - 66, y2 + 26, ACC, 'main')
        c.text(rod - 72, y2 + 26, force_label, FST, anchor='end', color=ACC)
    if L_label:
        c.dim(xr1 + 16, y1, xr1 + 16, y2, L_label, side=1)
    if B_label:
        field_legend(c, 24, h - 16, B_label, into)
    if north:
        compass(c, 28, 40)
    return c.done(title, desc)


def rod_angle(title, desc, theta_deg, theta_label, v_label='v', B_label='B', w=340, h=230):
    """Side view: field lines across the page, a rod end-on (perpendicular to the page) moving at θ to them."""
    c = Canvas(w, h)
    for k in range(5):
        y = 30 + k * 40
        c.arrow(20, y, w - 20, y, ACC, 'thin', head=7)
    c.text(w - 22, 16, B_label, FST, anchor='end', color=ACC)
    ox, oy = (110, 150) if theta_deg >= 0 else (170, 70)
    c.circle(ox, oy, 9, INK, 'main', fill=FILLC)
    c.dot(ox, oy, 2.4)
    a = math.radians(theta_deg)
    L = 130
    c.arrow(ox + 11 * math.cos(a), oy - 11 * math.sin(a), ox + L * math.cos(a), oy - L * math.sin(a), ACC2, 'bold')
    c.text(ox + (L + 12) * math.cos(a), oy - (L + 12) * math.sin(a) - (14 if abs(math.sin(a)) < 0.3 else 0), v_label, FST,
           anchor='start' if math.cos(a) > 0.3 else 'middle', color=ACC2)
    if theta_label:
        c.line(ox, oy, ox + 90, oy, MUT, 'thin', dash='4 3')
        r = 50
        c.path(f'M{r1(ox + r)},{r1(oy)} A{r},{r} 0 0,0 {r1(ox + r * math.cos(a))},{r1(oy - r * math.sin(a))}', MUT, 'axis')
        c.text(ox + (r + 14) * math.cos(a / 2), oy - (r + 14) * math.sin(a / 2), theta_label, FST, anchor='start')
    c.text(ox - 16, oy - 18, 'rod (end-on)', FST, anchor='end', value=False)
    return c.done(title, desc)


def coil_turns(c, cx, cy, length, radius, n, axis='h', color=INK):
    """A coil seen from the side: n turns as ellipses, back halves muted, front halves solid."""
    for i in range(n):
        u = -length / 2 + length * (i + 0.5) / n
        if axis == 'h':
            x, y = cx + u, cy
            c.path(f'M{r1(x)},{r1(y - radius)} A6,{r1(radius)} 0 0,0 {r1(x)},{r1(y + radius)}', MUT, 'thin')
            c.path(f'M{r1(x)},{r1(y - radius)} A6,{r1(radius)} 0 0,1 {r1(x)},{r1(y + radius)}', color, 'main')
        else:
            x, y = cx, cy + u
            c.path(f'M{r1(x - radius)},{r1(y)} A{r1(radius)},6 0 0,1 {r1(x + radius)},{r1(y)}', MUT, 'thin')
            c.path(f'M{r1(x - radius)},{r1(y)} A{r1(radius)},6 0 0,0 {r1(x + radius)},{r1(y)}', color, 'main')


def bar_magnet(c, x, y, w, h, near='N', vertical=False):
    """Bar magnet; `near` is the pole at the right end (horizontal) or the bottom end (vertical)."""
    far = 'S' if near == 'N' else 'N'
    if not vertical:
        c.rect(x, y, w / 2, h, INK, 'main')
        c.rect(x + w / 2, y, w / 2, h, INK, 'main', fill=FILLC)
        c.text(x + w / 4, y + h / 2, far, FS, weight=700, value=False)
        c.text(x + 3 * w / 4, y + h / 2, near, FS, weight=700, value=False)
    else:
        c.rect(x, y, w, h / 2, INK, 'main')
        c.rect(x, y + h / 2, w, h / 2, INK, 'main', fill=FILLC)
        c.text(x + w / 2, y + h / 4, far, FS, weight=700, value=False)
        c.text(x + w / 2, y + 3 * h / 4, near, FS, weight=700, value=False)


def meter_below(c, x1, x2, y_top, y_m, kind='G', label=None):
    """Leads from (x1, y_top) and (x2, y_top) down to a meter (G, V, A, R, lamp or a data logger box)."""
    xm = (x1 + x2) / 2
    c.line(x1, y_top, x1, y_m, INK, 'main')
    c.line(x2, y_top, x2, y_m, INK, 'main')
    if kind == 'logger':
        c.line(x1, y_m, xm - 46, y_m, INK, 'main')
        c.line(xm + 46, y_m, x2, y_m, INK, 'main')
        c.rect(xm - 46, y_m - 14, 92, 28, INK, 'main', rx=4)
        c.text(xm, y_m, 'data logger', FST, value=False)
    else:
        Series(El(kind, label)).draw(c, x1, y_m, x2 - x1, below=True)


def magnet_coil(title, desc, near='N', motion='towards', meter='G', motion_label=None, dist_label=None, w=420, h=230):
    """A bar magnet beside a coil connected to a meter. motion: 'towards', 'away' or None."""
    c = Canvas(w, h)
    my = 95
    bar_magnet(c, 24, my - 18, 120, 36, near)
    coil_turns(c, 285, my, 120, 34, 7)
    x1, x2 = 225, 345
    c.line(x1, my, x1, my + 34, INK, 'main')
    c.line(x2, my, x2, my + 34, INK, 'main')
    if meter:
        meter_below(c, x1, x2, my + 34, h - 40, meter)
    else:   # open circuit: two loose ends
        for x in (x1, x2):
            c.line(x, my + 34, x, my + 70, INK, 'main')
            c.circle(x, my + 74, 3.5, INK, 'axis', fill='none')
        c.text((x1 + x2) / 2, my + 96, 'ends not connected', FST, value=False)
    if motion:
        ax0, ax1 = (40, 128) if motion == 'towards' else (128, 40)
        c.arrow(ax0, my - 40, ax1, my - 40, ACC2, 'main')
        if motion_label:
            c.text(84, my - 56, motion_label, FST, color=ACC2)
    if dist_label:
        c.dim(150, my - 52, 270, my - 52, dist_label, side=1, off=12)
    return c.done(title, desc)


def falling_magnet(title, desc, container='coil', near='N', drop_label=None, meter='G', v_label='v', w=320, h=320):
    """A magnet falling (north pole first by default) towards a coil or down a copper tube."""
    c = Canvas(w, h)
    cx = 140
    if container == 'tube':
        c.rect(cx - 30, 30, 60, h - 50, INK, 'main', fill=FILLC)
        c.rect(cx - 22, 30, 44, h - 50, INK, 'thin', fill='none')
        bar_magnet(c, cx - 12, 110, 24, 64, near, vertical=True)
        c.arrow(cx + 50, 120, cx + 50, 190, ACC2, 'main')
        c.text(cx + 58, 155, v_label, FST, anchor='start', color=ACC2)
        c.text(cx + 40, 40, 'copper tube', FST, anchor='start', value=False)
    else:
        bar_magnet(c, cx - 12, 24, 24, 64, near, vertical=True)
        c.arrow(cx + 30, 40, cx + 30, 100, ACC2, 'main')
        c.text(cx + 38, 70, v_label, FST, anchor='start', color=ACC2)
        top = 190
        coil_turns(c, cx, top + 40, 80, 42, 6, axis='v')
        if drop_label:
            c.dim(cx - 64, 88, cx - 64, top, drop_label, side=-1)
        c.line(cx + 42, top + 4, cx + 110, top + 4, INK, 'main')
        c.line(cx + 42, top + 76, cx + 110, top + 76, INK, 'main')
        vcomp(c, meter if meter in ('G', 'V', 'A', 'R') else 'G', cx + 110, top + 4, top + 76, None)
    return c.done(title, desc)


def two_coils(title, desc, left=None, right=None, np_label=None, ns_label=None, switch=None, ring=False, w=450, h=250,
              np_value=None, ns_value=None):
    """Two coils on an iron core (a transformer, or Faraday's ring). left/right: dict(kind, label) for the
    primary supply (ac, cell) and the secondary load (G, V, lamp, R); switch: None, 'open' or 'closed'."""
    c = Canvas(w, h)
    ox0, ox1, oy0, oy1 = 150, 300, 40, 200
    t = 30
    rx = 22 if ring else 6
    d = (f'M{ox0},{oy0 + rx} a{rx},{rx} 0 0,1 {rx},{-rx} h{ox1 - ox0 - 2 * rx} a{rx},{rx} 0 0,1 {rx},{rx} '
         f'v{oy1 - oy0 - 2 * rx} a{rx},{rx} 0 0,1 {-rx},{rx} h{-(ox1 - ox0 - 2 * rx)} a{rx},{rx} 0 0,1 {-rx},{-rx} Z '
         f'M{ox0 + t},{oy0 + t} h{ox1 - ox0 - 2 * t} v{oy1 - oy0 - 2 * t} h{-(ox1 - ox0 - 2 * t)} Z')
    c.path(d, MUT, 'axis', fill=FILLC + ';fill-rule:evenodd')
    for side, spec in ((0, left), (1, right)):
        xl = ox0 if side == 0 else ox1 - t
        n = 7
        ys = [oy0 + 50 + i * 10 for i in range(n)]
        for y in ys:
            c.line(xl - 4, y, xl + t + 4, y + 6, INK if side == 0 else ACC, 'main')
        xe = xl - 4 if side == 0 else xl + t + 4
        xs = 100 if side == 0 else 370
        col = INK
        if side == 0 and switch:
            c.line(xe, ys[0], 137, ys[0], col, 'main')
            c.line(113, ys[0], xs, ys[0], col, 'main')
        else:
            c.line(xe, ys[0], xs, ys[0], col, 'main')
        c.line(xe, ys[-1] + 6, xs, ys[-1] + 6, col, 'main')
        if spec:
            kind = spec['kind']
            vcomp(c, kind if kind in ('ac', 'cell', 'R', 'lamp', 'V', 'A', 'G') else 'R', xs, ys[0], ys[-1] + 6,
                  spec.get('label'), side=-1 if side == 0 else 1, value=spec.get('value'))
        else:
            c.line(xs, ys[0], xs, ys[-1] + 6, col, 'main')
    if np_label:
        c.text(ox0 + t / 2, oy1 + 22, np_label, FST, value=np_value)
    if ns_label:
        c.text(ox1 - t / 2, oy1 + 22, ns_label, FST, value=ns_value)
    if switch:
        sx, sy = 125, oy0 + 50
        c.dot(sx - 12, sy, 2.6)
        c.dot(sx + 12, sy, 2.6)
        if switch == 'closed':
            c.line(sx - 12, sy, sx + 12, sy, INK, 'main')
        else:
            c.line(sx - 12, sy, sx + 10, sy - 11, INK, 'main')
    return c.done(title, desc)


def coil_angle(title, desc, theta_deg, theta_label=None, B_label=None, coil_label=None, w=340, h=230, normal=True,
               rotation=False, poles=False):
    """Side view: uniform field across the page and a flat coil (edge-on, as a line) whose normal makes θ with the field."""
    c = Canvas(w, h)
    x0, x1 = (64, w - 64) if poles else (16, w - 16)
    if poles:
        c.rect(14, 30, 44, h - 60, INK, 'main', fill=FILLC)
        c.rect(w - 58, 30, 44, h - 60, INK, 'main', fill=FILLC)
        c.text(36, h / 2, 'N', FS, weight=700, value=False)
        c.text(w - 36, h / 2, 'S', FS, weight=700, value=False)
    lines_y = [40 + k * (h - 80) / 4 for k in range(5)]
    for y in lines_y:
        c.arrow(x0, y, x1, y, ACC, 'thin', head=7)
    gaps = [(p + q) / 2 for p, q in zip(lines_y, lines_y[1:])]
    gap_y = lambda y: min(gaps, key=lambda g: abs(g - y))  # noqa: E731  labels sit between field lines
    cx, cy = w / 2, h / 2
    a = math.radians(theta_deg)
    pa = a + math.pi / 2
    L = 64
    c.line(cx - L * math.cos(pa), cy + L * math.sin(pa), cx + L * math.cos(pa), cy - L * math.sin(pa), INK, 'bold')
    for sgn in (1, -1):
        c.circle(cx + sgn * L * math.cos(pa), cy - sgn * L * math.sin(pa), 5, INK, 'main', fill=FILLC)
    c.dot(cx, cy, 2.6)
    if normal:
        c.arrow(cx, cy, cx + 80 * math.cos(a), cy - 80 * math.sin(a), ACC2, 'main', dash='5 3')
        tx, ty = cx + 80 * math.cos(a), cy - 80 * math.sin(a)
        right = tx + 10 + text_w('normal', FST) < x1
        c.text(tx + 10 if right else tx - 10, gap_y(ty), 'normal', FST, color=ACC2, anchor='start' if right else 'end', value=False)
    if theta_label and theta_deg:
        r = 34
        c.path(f'M{r1(cx + r)},{r1(cy)} A{r},{r} 0 0,0 {r1(cx + r * math.cos(a))},{r1(cy - r * math.sin(a))}', MUT, 'axis')
        c.text(cx + (r + 8) * math.cos(a / 2), gap_y(cy - (r + 10) * math.sin(a / 2)), theta_label, FST, anchor='start')
    if rotation:
        c.path(f'M{r1(cx - 30)},{r1(cy + 22)} A36,36 0 0,0 {r1(cx + 30)},{r1(cy + 22)}', MUT, 'axis')
        c.arrowhead(cx + 30, cy + 22, -0.75, MUT, 7)
    if B_label:
        c.text(x1, 22, B_label, FST, anchor='end', color=ACC)
    if coil_label:
        c.text(cx, h - 10, coil_label, FST)
    return c.done(title, desc)


def loop_region(title, desc, inside=0.4, motion='in', side_label=None, v_label='v', B_label=None, into=True,
                vertical=False, turns_label=None, w=420, h=260):
    """Top view of a square coil entering ('in') or leaving ('out') a region of uniform field on the right
    (vertical=True: the field region is below and the loop falls into it)."""
    c = Canvas(w, h)
    s = 110
    if not vertical:
        bx = 220
        ry0, ry1 = 50, h - 50
        c.rect(bx, ry0, w - bx - 14, ry1 - ry0, MUT, 'thin', dash='5 4', fill=FILLC)
        field_symbols(c, bx, ry0, w - bx - 14, ry1 - ry0, into)
        x = bx - s * (1 - inside)
        y = (ry0 + ry1 - s) / 2
        c.rect(x, y, s, s, ACC2, 'bold')
        dx = 1 if motion == 'in' else -1
        ax = x - 10 if dx > 0 else x + s + 10
        if dx > 0:
            c.arrow(x - 70, y + s / 2, x - 8, y + s / 2, ACC2, 'main')
            c.text(x - 74, y + s / 2, v_label, FST, anchor='end', color=ACC2)
        else:
            c.arrow(x - 8, y + s / 2, x - 70, y + s / 2, ACC2, 'main')
            c.text(x - 74, y + s / 2, v_label, FST, anchor='end', color=ACC2)
        if side_label:
            c.dim(x, ry1 + 10, x + s, ry1 + 10, side_label, side=-1, off=14)
        if B_label:
            field_legend(c, w - 150, 30, B_label, into)
        if turns_label:
            c.text(x + s / 2, 30, turns_label, FST, color=ACC2)
    else:
        by, bb = 150, h - 34
        c.rect(30, by, w - 60, bb - by, MUT, 'thin', dash='5 4', fill=FILLC)
        field_symbols(c, 30, by, w - 60, bb - by, into)
        lw_, lh = 120, 100
        x, y = 150, by + 30 - lh
        c.rect(x, y, lw_, lh, ACC2, 'bold')
        c.arrow(x + lw_ + 26, y + 10, x + lw_ + 26, y + 70, ACC2, 'main')
        c.text(x + lw_ + 34, y + 40, v_label, FST, anchor='start', color=ACC2)
        if side_label:
            c.dim(x, y - 14, x + lw_, y - 14, side_label, side=1, off=12)
        if B_label:
            field_legend(c, 36, h - 14, B_label, into)
    return c.done(title, desc)


def solenoid_coil(title, desc, sol_label=None, coil_label=None, inside=False, current_label=None, w=420, h=200):
    c = Canvas(w, h)
    cy = 90
    coil_turns(c, w / 2, cy, 300, 40, 16)
    c.line(w / 2 - 150, cy - 40, 40, cy - 40, INK, 'main')
    c.line(w / 2 + 150, cy + 40, w - 40, cy + 40, INK, 'main')
    if inside:
        coil_turns(c, w / 2, cy, 34, 18, 4, color=ACC2)
    else:
        coil_turns(c, w / 2, cy, 40, 50, 4, color=ACC2)
    if current_label:
        c.text(40, cy - 54, current_label, FST, anchor='start')
    if sol_label:
        c.text(w / 2, h - 34, sol_label, FST)
    if coil_label:
        c.text(w / 2, h - 14, coil_label, FST, color=ACC2)
    return c.done(title, desc)


def jumping_ring(title, desc, cut=False, supply='ac', switch='open', w=320, h=280):
    c = Canvas(w, h)
    cx = 120
    c.rect(cx - 16, 30, 32, h - 50, MUT, 'axis', fill=FILLC)
    coil_turns(c, cx, h - 70, 80, 34, 7, axis='v')
    ry = 90
    if cut:
        c.path(f'M{r1(cx - 30)},{ry} A30,8 0 0,0 {r1(cx + 24)},{ry + 5}', ACC2, 'bold')
        c.path(f'M{r1(cx - 30)},{ry} A30,8 0 0,1 {r1(cx + 30)},{ry}', ACC2, 'axis')
        c.path(f'M{r1(cx + 30)},{ry} A30,8 0 0,1 {r1(cx + 28)},{ry + 2}', ACC2, 'axis')
    else:
        c.path(f'M{r1(cx - 30)},{ry} A30,8 0 0,0 {r1(cx + 30)},{ry}', ACC2, 'bold')
        c.path(f'M{r1(cx - 30)},{ry} A30,8 0 0,1 {r1(cx + 30)},{ry}', ACC2, 'axis')
    c.text(cx + 40, ry - 8, 'aluminium ring' + (' (cut)' if cut else ''), FST, anchor='start', color=ACC2, value=False)
    c.text(cx + 24, 44, 'iron core', FST, anchor='start', value=False)
    y1, y2 = h - 108, h - 32
    sx = 205
    if switch:
        c.line(cx + 34, y1, sx - 14, y1, INK, 'main')
        c.line(sx + 14, y1, 250, y1, INK, 'main')
        c.dot(sx - 14, y1, 2.6)
        c.dot(sx + 14, y1, 2.6)
        if switch == 'closed':
            c.line(sx - 14, y1, sx + 14, y1, INK, 'main')
        else:
            c.line(sx - 14, y1, sx + 12, y1 - 12, INK, 'main')
    else:
        c.line(cx + 34, y1, 250, y1, INK, 'main')
    c.line(cx + 34, y2, 250, y2, INK, 'main')
    vcomp(c, supply, 250, y1, y2, None)
    return c.done(title, desc)


def shrinking_loop(title, desc, r_label=None, rate_label=None, B_label=None, into=True, w=340, h=260):
    """A circular loop face-on to a uniform field (into the page) whose radius is shrinking."""
    c = Canvas(w, h)
    cx, cy, R = w / 2, h / 2 - 10, 80
    field_symbols(c, 20, 14, w - 40, h - 64, into, skip=[(cx - 4, cy - 30, R + 10, 30)])
    c.circle(cx, cy, R, ACC2, 'bold')
    c.dot(cx, cy, 2.6)
    c.line(cx, cy, cx + R, cy, INK, 'thin')
    if r_label:
        c.text(cx + R / 2, cy - 12, r_label, FST)
    for ang in (45, 135, 225, 315):
        a = math.radians(ang)
        c.arrow(cx + (R + 26) * math.cos(a), cy - (R + 26) * math.sin(a), cx + (R + 6) * math.cos(a), cy - (R + 6) * math.sin(a), ACC2, 'main', head=7)
    if rate_label:
        c.text(cx, h - 30, rate_label, FST, color=ACC2)
    if B_label:
        field_legend(c, 24, h - 12, B_label, into)
    return c.done(title, desc)
