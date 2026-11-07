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


def tick_labels(vals):
    """Tick labels with the fewest decimals that show every tick exactly (3.5 stays 3.5, not 4)."""
    d = 0
    while d < 4 and any(abs(round(v, d) - v) > 1e-9 for v in vals):
        d += 1
    out = []
    for v in vals:
        t = f'{v:.{d}f}'
        out.append('0' if abs(v) < 1e-12 else t.replace('-', MINUS))
    return out


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
        xlabs = tick_labels(xtv) if xticks is not None else [fmt(v, xs_step) for v in xtv]
    if ytl is not None:
        ytv, ylabs = [v for v, _ in ytl], [t for _, t in ytl]
    else:
        ytv, ys_step = ticks(*yr, ny) if yticks is None else (yticks, (yticks[1] - yticks[0]) if len(yticks) > 1 else 1)
        yr = (min(yr[0], ytv[0]), max(yr[1], ytv[-1]))
        ylabs = tick_labels(ytv) if yticks is not None else [fmt(v, ys_step) for v in ytv]
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
        elif kind == 'area':   # shaded region between the curve and the x axis
            base = Y(max(yr[0], 0))
            c.poly(pts + [(pts[-1][0], base), (pts[0][0], base)], 'none', 'thin', fill=FILLC, closed=True)
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
    top, bot = 44, h - 22
    ys = [bot - (v - lo) / ((hi - lo) or 1) * (bot - top) for v in vals]
    order = sorted(range(len(ys)), key=lambda i: -ys[i])  # bottom (lowest energy) first
    for a, b in zip(order, order[1:]):  # keep at least 20 px between neighbouring levels
        if ys[a] - ys[b] < 20:
            ys[b] = ys[a] - 20
    if min(ys) < top:                  # crowded: grow the canvas downwards rather than clip the top
        shift = top - min(ys)
        ys = [y + shift for y in ys]
        h += shift
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
           field_dir='down', length_label=None, particles=(), arrows=True):
    """Parallel horizontal plates with a uniform field. beam: dict(path='straight'|'up'|'down', label, v_label)."""
    c = Canvas(w, h)
    x0, x1 = 90, w - 90
    yt, yb = 50, h - 50
    c.rect(x0, yt - 8, x1 - x0, 8, INK, 'thin', fill=FILLC)
    c.rect(x0, yb, x1 - x0, 8, INK, 'thin', fill=FILLC)
    c.text(x0 - 12, yt - 4, top, FS, anchor='end', weight=600)
    c.text(x0 - 12, yb + 4, bottom, FS, anchor='end', weight=600)
    for i in range(n_lines if arrows else 0):
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
    for fx, fy, sign, lab in particles:   # fx, fy as fractions across / up the gap
        px, py = x0 + fx * (x1 - x0), yb - fy * (yb - yt)
        c.circle(px, py, 8, ACC2, 'main', fill=FILLC)
        c.text(px, py + 0.5, sign, FST, weight=700, color=ACC2, value=False)
        if lab:
            c.text(px + 12, py - 12, lab, FST, anchor='start', color=ACC2)
    if beam:
        ym = (yt + yb) / 2
        c.arrow(20, ym, x0 - 4, ym, ACC2, 'main')
        if beam.get('label'):
            c.text(22, ym - 14, beam['label'], FST, anchor='start', value=beam.get('is_value', False))
        if beam['path'] == 'none':
            pass
        elif beam['path'] == 'straight':
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
          force_label=None, north=False, current=None, w=420, h=250, rod_label=None):
    """Top view: a rod sliding on two rails (joined by a resistor) through a uniform field."""
    c = Canvas(w, h)
    y1, y2 = 70, 180
    xr0, xr1 = 84, 340
    rod = 240
    if rails:
        c.line(xr0, y1, xr1, y1, INK, 'main')
        c.line(xr0, y2, xr1, y2, INK, 'main')
        if R_label == 'cell':
            vcomp(c, 'cell', xr0, y1, y2, None)
        elif R_label is not None:
            vcomp(c, 'R', xr0, y1, y2, R_label or None, side=-1)
        else:
            c.line(xr0, y1, xr0, y2, INK, 'main')
    field_symbols(c, 104, y1 + 6 if rails else 40, 226, (y2 - y1 - 12) if rails else 170, into)
    c.line(rod, y1 - 16, rod, y2 + 16, ACC2, 'bold')
    if v_label:
        c.arrow(rod + 6, y1 - 26, rod + 70, y1 - 26, ACC2, 'main')
        c.text(rod + 76, y1 - 26, v_label, FST, anchor='start', color=ACC2)
    if rod_label:
        c.text(rod + 8, y2 + 30, rod_label, FST, anchor='start', color=ACC2)
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


def rod_angle(title, desc, theta_deg, theta_label, v_label='v', B_label='B', w=340, h=230, body='rod (end-on)'):
    """Side view: field lines across the page, a rod end-on (perpendicular to the page) moving at θ to them."""
    c = Canvas(w, h)
    for k in range(5):
        y = 30 + k * 40
        c.arrow(20, y, w - 20, y, ACC, 'thin', head=7)
    c.text(w - 22, 14, B_label, FST, anchor='end', color=ACC)
    ox, oy = (110, 150) if theta_deg >= 0 else (170, 70)
    if math.cos(math.radians(theta_deg)) < -0.3:
        ox = w - 110
    c.circle(ox, oy, 9, INK, 'main', fill=FILLC)
    c.dot(ox, oy, 2.4)
    a = math.radians(theta_deg)
    L = 130
    c.arrow(ox + 11 * math.cos(a), oy - 11 * math.sin(a), ox + L * math.cos(a), oy - L * math.sin(a), ACC2, 'bold')
    tx, ty = ox + (L + 10) * math.cos(a), oy - (L + 10) * math.sin(a)
    gaps = [50 + 40 * k for k in range(4)]
    ly = min(gaps, key=lambda g: abs(g - ty)) if 30 <= ty <= 190 else ty
    c.text(tx, ly, v_label, FST, anchor='start' if math.cos(a) > 0.3 else 'middle', color=ACC2)
    if theta_label:
        c.line(ox, oy, ox + 90, oy, MUT, 'thin', dash='4 3')
        r = 50
        c.path(f'M{r1(ox + r)},{r1(oy)} A{r},{r} 0 0,0 {r1(ox + r * math.cos(a))},{r1(oy - r * math.sin(a))}', MUT, 'axis')
        c.text(ox + (r + 14) * math.cos(a / 2), oy - (r + 14) * math.sin(a / 2), theta_label, FST, anchor='start')
    c.text(ox - 16, oy - 18, body, FST, anchor='end', value=False)
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


# ═════════════════════════ charged particles ═════════════════════════

def particle_field(title, desc, into=True, v_dir=0, sign='+', north=False, B_label=None, v_label='v', w=320, h=230):
    """Top view: a charged particle (sign) moving with velocity at v_dir degrees (0 = right, 90 = up the page)
    through a uniform field into (×) or out of (•) the page."""
    c = Canvas(w, h)
    field_symbols(c, 30, 20, w - 60, h - 64, into, skip=[(w / 2 - 20, (h - 44) / 2 - 20, 40, 40)])
    cx, cy = w / 2, (h - 44) / 2 + 20
    c.circle(cx, cy, 11, ACC2, 'main', fill=FILLC)
    c.text(cx, cy + 0.5, sign, FS, weight=700, color=ACC2, value=False)
    a = math.radians(v_dir)
    c.arrow(cx + 14 * math.cos(a), cy - 14 * math.sin(a), cx + 80 * math.cos(a), cy - 80 * math.sin(a), ACC2, 'bold')
    c.text(cx + 92 * math.cos(a) + (8 if abs(math.cos(a)) < 0.3 else 0), cy - 92 * math.sin(a), v_label, FST,
           anchor='start' if math.cos(a) >= -0.3 else 'end', color=ACC2)
    if north:
        compass(c, 28, 44)
    if B_label:
        field_legend(c, 30, h - 14, B_label, into)
    return c.done(title, desc)


def selector(title, desc, B_label=None, E_label=None, gap_label=None, v_label=None, into=True, top='+', particle=None,
             paths=("straight",), length_label=None, w=440, h=240):
    """Velocity selector / Thomson crossed fields: horizontal plates (E down the page when top is +) with a uniform
    magnetic field between them; a beam enters from the left."""
    c = Canvas(w, h)
    x0, x1, yt, yb = 120, 340, 50, 160
    c.rect(x0, yt - 8, x1 - x0, 8, INK, 'thin', fill=FILLC)
    c.rect(x0, yb, x1 - x0, 8, INK, 'thin', fill=FILLC)
    c.text(x0 - 12, yt - 4, top, FS, weight=700, anchor='end', value=False)
    c.text(x0 - 12, yb + 4, MINUS if top == '+' else '+', FS, weight=700, anchor='end', value=False)
    field_symbols(c, x0 + 6, yt + 6, x1 - x0 - 12, yb - yt - 12, into, step=32, skip=[(x0, (yt + yb) / 2 - 8, x1 - x0, 16)])
    ym = (yt + yb) / 2
    c.arrow(18, ym, x0 - 8, ym, ACC2, 'main')
    if particle:
        c.text(20, ym - 14, particle, FST, anchor='start', color=ACC2, value=False)
    if v_label:
        c.text(20, ym + 16, v_label, FST, anchor='start', color=ACC2)
    for p in paths:
        if p == 'straight':
            c.line(x0, ym, x1 + 10, ym, ACC2, 'main', dash='6 4')
            c.arrowhead(x1 + 16, ym, 0, ACC2, 8)
        else:
            sgn = -1 if p == 'up' else 1
            pts = [(x0 + (x1 - x0) * t, ym + sgn * 40 * t * t) for t in [i / 30 for i in range(31)]]
            c.poly(pts, ACC2, 'main', dash='6 4')
    if gap_label:
        c.dim(x1 + 34, yt, x1 + 34, yb, gap_label, side=1)
    y = yb + 30
    if length_label:
        c.dim(x0, y, x1, y, length_label, side=-1, off=12)
        y += 34
    else:
        y += 8
    if E_label:
        c.text(x0, y, E_label, FST, anchor='start')
        y += 20
    if B_label:
        field_legend(c, x0 + 4, y, B_label, into)
        y += 20
    c.h = y + 4
    return c.done(title, desc)


def semicircles(title, desc, radii, labels=(), into=False, entry_label=None, B_label=None, detector=True, acc_label=None, w=420, h=260):
    """Mass spectrometer: particles enter a field region through a slit at the bottom-left and travel semicircles
    (radii in data units, scaled so the largest fits) to a detector along the entry edge."""
    c = Canvas(w, h)
    rx0, ry0, rx1, ry1 = 60, 20, w - 20, h - 60
    c.rect(rx0, ry0, rx1 - rx0, ry1 - ry0, MUT, 'thin', dash='5 4', fill=FILLC)
    field_symbols(c, rx0, ry0, rx1 - rx0, ry1 - ry0, into, step=34)
    ex = rx0 + 30
    scale = min((rx1 - ex - 20) / (2 * max(radii)), (ry1 - ry0 - 20) / max(radii))
    cols = [ACC2, ACC]
    for k, r in enumerate(radii):
        R = r * scale
        c.path(f'M{r1(ex)},{r1(ry1)} A{r1(R)},{r1(R)} 0 0,1 {r1(ex + 2 * R)},{r1(ry1)}', cols[k % 2], 'bold')
        if k < len(labels) and labels[k]:
            inside_lab = len(radii) > 1 and k == 0
            c.text(ex + R, ry1 - R + (16 if inside_lab else -12), labels[k], FST, color=cols[k % 2])
    c.line(ex, ry1 + 30, ex, ry1, ACC2, 'main')
    c.arrowhead(ex, ry1 - 2, -math.pi / 2, ACC2, 8)
    if entry_label:
        c.text(ex + 8, ry1 + 22, entry_label, FST, anchor='start', color=ACC2)
    if detector:
        c.line(ex + 12, ry1 + 4, rx1 - 4, ry1 + 4, INK, 'bold')
        c.text(rx1 - 6, ry1 + 20, 'detector', FST, anchor='end', value=False)
    if B_label:
        field_legend(c, rx0 + 8, h - 12, B_label, into)
    if acc_label:
        c.text(14, ry1 + 22, acc_label, FST, anchor='start')
    return c.done(title, desc)


def circle_orbit(title, desc, into=True, clockwise=True, r_label=None, B_label=None, sign=None, gun=False, full=True,
                 v_label='v', w=320, h=260):
    """A charged particle on a circular orbit in a uniform field (fine-beam tube style if gun=True)."""
    c = Canvas(w, h)
    field_symbols(c, 16, 14, w - 32, h - 50, into, step=34)
    cx, cy, R = w / 2, (h - 36) / 2 + 4, 80
    if full:
        c.circle(cx, cy, R, ACC2, 'bold')
    else:
        c.path(f'M{r1(cx)},{r1(cy + R)} A{R},{R} 0 0,{1 if clockwise else 0} {r1(cx)},{r1(cy - R)}', ACC2, 'bold')
    # velocity arrow at the bottom of the orbit, along the direction of travel
    d = -1 if clockwise else 1
    bx, by = cx, cy + R
    c.arrow(bx, by, bx + d * 46, by, ACC2, 'main')
    c.text(bx + d * 52, by, v_label, FST, anchor='start' if d > 0 else 'end', color=ACC2)
    if sign:
        c.circle(bx, by, 7, ACC2, 'main', fill=FILLC)
        c.text(bx, by + 0.5, sign, FST, weight=700, color=ACC2, value=False)
    if r_label:
        c.dot(cx, cy, 2.6)
        c.line(cx, cy, cx + R * 0.7071, cy - R * 0.7071, INK, 'thin')
        c.text(cx + R * 0.35 + 6, cy - R * 0.35 + 10, r_label, FST, anchor='start')
    if gun:
        c.rect(bx - 14, by + 4, 28, 14, INK, 'axis', fill=FILLC)
    if B_label:
        field_legend(c, 20, h - 12, B_label, into)
    return c.done(title, desc)


def spiral_track(title, desc, r_labels=(), into=True, B_label=None, w=320, h=260):
    c = Canvas(w, h)
    field_symbols(c, 16, 14, w - 32, h - 50, into, step=34)
    cx, cy = w / 2, (h - 36) / 2 + 4
    pts = []
    for i in range(361):
        t = 3 * math.pi * i / 360
        r = 95 * math.exp(-0.17 * t)
        pts.append((cx + r * math.cos(t), cy - r * math.sin(t)))
    c.poly(pts, ACC2, 'bold')
    if r_labels:   # labels outside the spiral, joined to the points they describe by thin leaders
        c.line(cx + 95, cy, cx + 112, cy + 26, INK, 'thin')
        c.text(cx + 114, cy + 36, r_labels[0], FST, anchor='start', color=ACC2)
        if len(r_labels) > 1:
            r2 = 95 * math.exp(-0.17 * 2 * math.pi)
            c.dot(cx + r2, cy, 2.6, ACC2)
            c.line(cx + r2, cy, cx + 60, cy + 108, INK, 'thin')
            c.text(cx + 64, cy + 114, r_labels[1], FST, anchor='start', color=ACC2)
    if B_label:
        field_legend(c, 20, h - 12, B_label, into)
    return c.done(title, desc)


def cyclotron(title, desc, R_label=None, B_label=None, supply_label=None, into=False, w=360, h=310):
    c = Canvas(w, h)
    cx, cy, R, g = w / 2, 130, 105, 8
    for side in (-1, 1):
        x = cx + side * g
        sweep = 1 if side > 0 else 0
        c.path(f'M{r1(x)},{r1(cy - R)} A{R},{R} 0 0,{sweep} {r1(x)},{r1(cy + R)} Z', INK, 'main', fill=FILLC)
    pts = []
    for i in range(721):
        t = 4 * math.pi * i / 720
        r = 12 + 80 * t / (4 * math.pi)
        pts.append((cx + r * math.sin(t) * (1 if math.sin(t) >= 0 else 1), cy - r * math.cos(t)))
    c.poly(pts, ACC2, 'main')
    c.dot(cx, cy, 3)
    if R_label:
        c.line(cx + g, cy, cx + g + R * 0.866, cy + R * 0.5, INK, 'thin')
        c.text(cx + g + R * 0.5, cy + R * 0.29 + 14, R_label, FST, anchor='start')
    y2 = cy + R + 26
    c.line(cx - g - 30, cy + R - 20, cx - g - 30, y2, INK, 'main')
    c.line(cx + g + 30, cy + R - 20, cx + g + 30, y2, INK, 'main')
    Series(El('ac', supply_label)).draw(c, cx - g - 30, y2, 2 * (g + 30), below=True)
    if B_label:
        field_legend(c, 16, 16, B_label, into)
    return c.done(title, desc)


def strip_arc(title, desc, width, r, width_label=None, B_label=None, into=True, v_label='v', w=400, h=240):
    """A beam entering a strip of uniform field (width, radius in the same units) and leaving deflected on a circular arc."""
    c = Canvas(w, h)
    sx0, sw = 150, 110
    s = sw / width
    R = r * s
    c.rect(sx0, 14, sw, h - 50, MUT, 'thin', dash='5 4', fill=FILLC)
    field_symbols(c, sx0, 14, sw, h - 50, into, step=30)
    y0 = 80
    c.arrow(20, y0, sx0, y0, ACC2, 'main')
    c.text(24, y0 - 14, v_label, FST, anchor='start', color=ACC2)
    th = math.asin(min(1.0, width / r))
    pts = [(sx0 + R * math.sin(th * i / 40), y0 + R * (1 - math.cos(th * i / 40))) for i in range(41)]
    c.poly(pts, ACC2, 'bold')
    ex, ey = pts[-1]
    L = 90
    c.arrow(ex, ey, ex + L * math.cos(th), ey + L * math.sin(th), ACC2, 'main', dash='6 4')
    c.line(ex, ey, ex + 80, ey, MUT, 'thin', dash='3 3')
    if width_label:
        c.dim(sx0, h - 26, sx0 + sw, h - 26, width_label, side=-1, off=11)
    if B_label:
        c.text(20, h - 14, B_label, FST, anchor='start')
    return c.done(title, desc)


def hall_slab(title, desc, I_label='I', B_label=None, width_label=None, thick_label=None, into=True, carriers=None,
              voltmeter=True, w=420, h=260):
    """A thin rectangular slab (top view) carrying a current along its length in a field into the page;
    the Hall voltage is measured across its width by a voltmeter joined to the middle of the two long edges."""
    c = Canvas(w, h)
    x0, x1, y0, y1 = 110, 320, 80, 170
    ym = (y0 + y1) / 2
    c.rect(x0, y0, x1 - x0, y1 - y0, INK, 'main', fill=FILLC)
    field_symbols(c, x0 + 6, y0 + 4, x1 - x0 - 12, y1 - y0 - 8, into, step=30, skip=[(x0, ym - 22, x1 - x0, 44)])
    c.arrow(x0 + 12, ym, x1 - 12, ym, ACC2, 'bold')
    c.text((x0 + x1) / 2, ym - 13, I_label, FST, color=ACC2)
    if voltmeter:
        xm = (x0 + x1) / 2 + 40
        c.dot(xm, y0, 2.6)
        c.dot(xm, y1, 2.6)
        c.line(xm, y0, xm, 40, INK, 'main')
        c.line(xm, 40, 380, 40, INK, 'main')
        c.line(xm, y1, xm, 210, INK, 'main')
        c.line(xm, 210, 380, 210, INK, 'main')
        vcomp(c, 'V', 380, 40, 210, None)
        c.text(398, 125, 'V_H', FST, anchor='start', value=False)
    if width_label:
        c.dim(x0 - 18, y0, x0 - 18, y1, width_label, side=-1)
    y = 236
    if thick_label:
        c.text(x0, y, thick_label, FST, anchor='start')
        y += 20
    if carriers:
        c.text(x0, y, carriers, FST, anchor='start')
        y += 20
    if B_label:
        field_legend(c, 24, y, B_label, into)
        y += 20
    c.h = y
    return c.done(title, desc)


def oil_drop(title, desc, gap_label=None, V_label=None, mass_label=None, w=360, h=230):
    c = Canvas(w, h)
    x0, x1, yt, yb = 70, 290, 50, 170
    c.rect(x0, yt - 8, x1 - x0, 8, INK, 'thin', fill=FILLC)
    c.rect(x0, yb, x1 - x0, 8, INK, 'thin', fill=FILLC)
    c.text(x0 - 12, yt - 4, '+', FS, weight=700, anchor='end', value=False)
    c.text(x0 - 12, yb + 4, MINUS, FS, weight=700, anchor='end', value=False)
    cx, cy = (x0 + x1) / 2, (yt + yb) / 2
    c.circle(cx, cy, 7, ACC2, 'main', fill=FILLC)
    c.arrow(cx, cy - 9, cx, cy - 50, ACC, 'main')
    c.text(cx + 8, cy - 40, 'electric force', FST, anchor='start', color=ACC, value=False)
    c.arrow(cx, cy + 9, cx, cy + 50, ACC, 'main')
    c.text(cx + 8, cy + 40, 'weight', FST, anchor='start', color=ACC, value=False)
    if mass_label:
        c.text(cx - 14, cy, mass_label, FST, anchor='end', color=ACC2)
    if gap_label:
        c.dim(x1 + 22, yt, x1 + 22, yb, gap_label, side=1)
    if V_label:
        c.text((x0 + x1) / 2, yt - 26, V_label, FST)
    return c.done(title, desc)


# ═════════════════════════ magnetic fields ═════════════════════════

def wire_symbol(c, x, y, out=True, r=10, color=INK):
    c.circle(x, y, r, color, 'main', fill=FILLC)
    if out:
        c.dot(x, y, 2.8, color)
    else:
        d = r * 0.6
        c.line(x - d, y - d, x + d, y + d, color, 'axis')
        c.line(x - d, y + d, x + d, y - d, color, 'axis')


def wires_endon(title, desc, wires, points=(), dims=(), w=420, h=230, pad=60, unit_px=None, note=None):
    """Long straight wires seen end-on. wires: dict(x, y, out, label) in data units (y up); points: dict(x, y, label);
    dims: (x1, y1, x2, y2, label, side) in data units. Scaled to fit."""
    xs = [q['x'] for q in list(wires) + list(points)] + [d[0] for d in dims] + [d[2] for d in dims]
    ys = [q['y'] for q in list(wires) + list(points)] + [d[1] for d in dims] + [d[3] for d in dims]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    sp = unit_px or min((w - 2 * pad) / ((x1 - x0) or 1), (h - 2 * pad) / ((y1 - y0) or 1))
    X = lambda v: w / 2 + (v - (x0 + x1) / 2) * sp  # noqa: E731
    Y = lambda v: h / 2 - (v - (y0 + y1) / 2) * sp  # noqa: E731
    c = Canvas(w, h)
    for d in dims:
        c.dim(X(d[0]), Y(d[1]), X(d[2]), Y(d[3]), d[4], side=d[5])
    for q in wires:
        wire_symbol(c, X(q['x']), Y(q['y']), q.get('out', True))
        if q.get('label'):
            c.text(X(q['x']), Y(q['y']) - 24, q['label'], FST)
    for q in points:
        c.dot(X(q['x']), Y(q['y']), 3.6, ACC2)
        if q.get('label'):
            c.text(X(q['x']) + 8, Y(q['y']) - 14, q['label'], FST, anchor='start', color=ACC2)
    if note:
        c.text(w / 2, h - 12, note, FST)
    return c.done(title, desc)


def wire_in_uniform(title, desc, out=True, B_label=None, I_label=None, w=320, h=240, north=True):
    """Top view: a vertical wire (end-on) in the Earth's uniform horizontal field pointing north (up the page)."""
    c = Canvas(w, h)
    for k in range(5):
        x = 40 + k * (w - 80) / 4
        c.arrow(x, h - 30, x, 30, ACC, 'thin', head=7)
    wire_symbol(c, w / 2 + 0.5 * (w - 80) / 4, h / 2, out)
    if I_label:
        c.text(w / 2 + 0.5 * (w - 80) / 4, h / 2 + 26, I_label, FST)
    if B_label:
        c.text(w - 14, 16, B_label, FST, anchor='end', color=ACC)
    if north:
        compass(c, 16, 40, 12)
    return c.done(title, desc)


def wire_angle(title, desc, theta_deg, theta_label=None, I_label='I', B_label='B', w=340, h=230, axis=False):
    """Field lines across the page and a straight wire in the plane of the page at θ to them."""
    c = Canvas(w, h)
    lines_y = [36 + k * (h - 72) / 4 for k in range(5)]
    for y in lines_y:
        c.arrow(16, y, w - 16, y, ACC, 'thin', head=7)
    cx, cy = w / 2 - 20, h / 2
    a = math.radians(theta_deg)
    L = 100
    c.line(cx - L * math.cos(a), cy + L * math.sin(a), cx + L * math.cos(a), cy - L * math.sin(a), INK, 'bold')
    c.arrow(cx + 20 * math.cos(a), cy - 20 * math.sin(a), cx + 70 * math.cos(a), cy - 70 * math.sin(a), ACC2, 'main')
    gaps = [(p + q) / 2 for p, q in zip(lines_y, lines_y[1:])]
    ty = cy - 80 * math.sin(a)
    c.text(cx + 80 * math.cos(a) + 10, min(gaps, key=lambda g: abs(g - ty)), I_label, FST, anchor='start', color=ACC2)
    if theta_label:
        r = 40
        c.path(f'M{r1(cx + r)},{r1(cy)} A{r},{r} 0 0,0 {r1(cx + r * math.cos(a))},{r1(cy - r * math.sin(a))}', MUT, 'axis')
        c.text(cx + r + 8, cy - 18 if theta_deg > 20 else cy - 10, theta_label, FST, anchor='start')
    c.text(w - 18, 18, B_label, FST, anchor='end', color=ACC)
    return c.done(title, desc)


def wire_cross_field(title, desc, out=False, B_label='B', w=320, h=220):
    """A wire seen end-on (current into or out of the page) in a uniform field across the page."""
    c = Canvas(w, h)
    for k in range(5):
        y = 30 + k * (h - 60) / 4
        c.arrow(16, y, w - 16, y, ACC, 'thin', head=7)
    wire_symbol(c, w / 2, h / 2, out, r=13)
    c.text(w - 18, 14, B_label, FST, anchor='end', color=ACC)
    return c.done(title, desc)


def solenoid_end(title, desc, anticlockwise=True, w=260, h=220):
    c = Canvas(w, h)
    cx, cy, R = w / 2, h / 2 - 6, 70
    c.circle(cx, cy, R, INK, 'bold')
    for ang in (90, 210, 330):
        a = math.radians(ang)
        x, y = cx + R * math.cos(a), cy - R * math.sin(a)
        tang = a + (math.pi / 2 if anticlockwise else -math.pi / 2)
        c.arrowhead(x, y, -tang, ACC2, 11)
    c.text(cx, h - 10, 'current direction seen from this end', FST, value=False)
    return c.done(title, desc)


def top_pan(title, desc, reading=None, I_label=None, L_label=None, w=420, h=260):
    """A U-shaped magnet on a top-pan balance with a horizontal wire held between its poles."""
    c = Canvas(w, h)
    # balance
    c.rect(110, 200, 200, 40, INK, 'main', fill=FILLC, rx=4)
    c.rect(140, 186, 140, 14, INK, 'main')
    if reading:
        c.rect(170, 210, 80, 22, INK, 'thin', rx=3)
        c.text(210, 221, reading, FST)
    # magnet (U shape seen from the side) with pole pieces
    c.rect(150, 116, 120, 70, INK, 'main', fill=FILLC)
    c.rect(170, 116, 80, 40, INK, 'main', fill='none')
    c.text(160, 136, 'N', FST, weight=700, value=False)
    c.text(260, 136, 'S', FST, weight=700, value=False)
    # wire crossing the gap (end-on), held by a clamp from above
    wire_symbol(c, 210, 136, out=False, r=8)
    c.line(210, 128, 210, 60, INK, 'main')
    c.line(210, 60, 350, 60, INK, 'main')
    c.rect(330, 50, 50, 20, INK, 'thin', fill=FILLC)
    c.text(355, 82, 'clamp', FST, value=False)
    if I_label:
        c.text(60, 60, I_label, FST, color=ACC2)
    if L_label:
        c.text(60, 84, L_label, FST)
    c.text(202, 96, 'wire', FST, anchor='end', value=False)
    return c.done(title, desc)


def pivot_balance(title, desc, d_force=None, d_rider=None, rider_label=None, wire_label=None, same_side=False, w=420, h=220):
    """A wire frame on a knife-edge pivot: the magnetic force on the far side is balanced by a rider."""
    c = Canvas(w, h)
    px, py = 200, 110
    c.poly([(px - 12, py + 22), (px + 12, py + 22), (px, py)], INK, 'main', fill=FILLC, closed=True)
    c.line(60, py, 360, py, INK, 'bold')
    c.rect(330, py - 30, 60, 60, MUT, 'thin', dash='4 3', fill=FILLC)
    c.text(360, py - 40, 'magnetic field', FST, value=False)
    wire_symbol(c, 360, py, out=False, r=7)
    c.arrow(360, py + 12, 360, py + 56, ACC, 'main')
    c.text(366, py + 48, 'F', FST, anchor='start', color=ACC)
    rx = 280 if same_side else 120
    c.line(rx, py, rx, py + 30, INK, 'thin')
    c.rect(rx - 10, py + 30, 20, 16, ACC2, 'main', fill=FILLC)
    if rider_label:
        c.text(rx, py + 62, rider_label, FST, color=ACC2)
    if d_force:
        c.dim(px, py - 50, 360, py - 50, d_force, side=1, off=12)
    if d_rider:
        c.dim(px, py - 26 if same_side else py - 50, rx, py - 26 if same_side else py - 50, d_rider, side=1, off=12)
    if wire_label:
        c.text(20, h - 14, wire_label, FST, anchor='start')
    return c.done(title, desc)


def wire_partial(title, desc, inside=0.5, L_label=None, I_label=None, B_label=None, into=True, w=420, h=200):
    c = Canvas(w, h)
    rx = 210
    c.rect(rx, 16, w - rx - 16, h - 60, MUT, 'thin', dash='5 4', fill=FILLC)
    field_symbols(c, rx, 16, w - rx - 16, h - 60, into, skip=[(rx, (h - 44) / 2 - 10, w, 20)])
    y = (h - 44) / 2 + 16
    L = 280
    x0 = rx - L * (1 - inside)
    c.line(x0, y, x0 + L, y, INK, 'bold')
    c.arrow(x0 + 10, y - 14, x0 + 70, y - 14, ACC2, 'main')
    if I_label:
        c.text(x0 + 76, y - 14, I_label, FST, anchor='start', color=ACC2)
    if L_label:
        c.dim(x0, y + 22, x0 + L, y + 22, L_label, side=-1, off=12)
    if B_label:
        field_legend(c, rx + 6, h - 14, B_label, into)
    return c.done(title, desc)


def semicircle_wire(title, desc, r_label=None, I_label=None, B_label=None, into=True, w=340, h=230):
    c = Canvas(w, h)
    field_symbols(c, 16, 14, w - 32, h - 50, into, step=34, skip=[(w / 2 - 6, 40, 12, 140)])
    cx, cy, R = w / 2, h - 60, 110
    c.path(f'M{r1(cx - R)},{r1(cy)} A{R},{R} 0 0,1 {r1(cx + R)},{r1(cy)}', ACC2, 'bold')
    c.arrowhead(cx + 3, cy - R, 0, ACC2, 10)
    c.line(cx - R, cy, cx - R - 20, cy, ACC2, 'bold')
    c.line(cx + R, cy, cx + R + 20, cy, ACC2, 'bold')
    if r_label:
        c.line(cx, cy, cx, cy - R, INK, 'thin', dash='3 3')
        c.dot(cx, cy, 2.6)
        c.text(cx + 6, cy - R / 2, r_label, FST, anchor='start')
    if I_label:
        c.text(cx, cy - R - 14, I_label, FST, color=ACC2)
    if B_label:
        field_legend(c, 20, h - 14, B_label, into)
    return c.done(title, desc)


def split_field_loop(title, desc, left_label=None, right_label=None, w=420, h=220):
    """A flat loop lying across two regions: the left half in a field out of the page (upwards), the right half
    in a field into the page (downwards)."""
    c = Canvas(w, h)
    mx = w / 2
    c.rect(20, 20, mx - 20, h - 64, MUT, 'thin', dash='5 4', fill=FILLC)
    c.rect(mx, 20, w - mx - 20, h - 64, MUT, 'thin', dash='5 4')
    field_symbols(c, 20, 20, mx - 20, h - 64, into=False, step=34)
    field_symbols(c, mx, 20, w - mx - 20, h - 64, into=True, step=34)
    c.rect(mx - 120, 50, 240, h - 124, ACC2, 'bold')
    if left_label:
        c.text(30, h - 26, left_label, FST, anchor='start')
    if right_label:
        c.text(w - 30, h - 26, right_label, FST, anchor='end')
    return c.done(title, desc)


def l_wire(title, desc, arm1_label=None, arm2_label=None, field='into', I_label='I', axes=False, B_label=None,
           ratio=1.0, w=360, h=260):
    """An L-shaped wire: arm 1 along +x (left to right), then arm 2 up the page (+y). field: 'into', 'out'
    (perpendicular to the page) or 'lines' (uniform field along +x in the plane of the page)."""
    c = Canvas(w, h)
    L1 = 170
    L2 = L1 * ratio if ratio <= 1 else L1
    if ratio > 1:
        L1 = L2 / ratio
    px, py = 70, h - 70
    if field == 'lines':
        for k in range(4):
            y = 40 + k * 45
            c.arrow(16, y, w - 16, y, ACC, 'thin', head=7)
    else:
        field_symbols(c, 16, 30, w - 32, h - 66, field == 'into', step=34,
                      skip=[(px + 10, py + 4, 120, 24), (px, py + 24, L1, 24), (px + L1 + 6, py - L2 / 2 - 12, 130, 24)])
    qx, qy = px + L1, py
    rx, ry = qx, py - L2
    c.poly([(px, py), (qx, qy), (rx, ry)], ACC2, 'bold')
    c.arrow(px + 20, py + 16, px + 80, py + 16, ACC2, 'main')
    c.text(px + 86, py + 16, I_label, FST, anchor='start', color=ACC2)
    if arm1_label:
        c.text((px + qx) / 2, py + 36, arm1_label, FST)
    if arm2_label:
        c.text(qx + 12, (qy + ry) / 2, arm2_label, FST, anchor='start')
    if axes:
        for lab, (x, y) in zip('PQR', [(px, py), (qx, qy), (rx, ry)]):
            c.dot(x, y, 3)
            c.text(x - 10, y - 10, lab, FST, weight=600, anchor='end', value=False)
        c.arrow(w - 70, h - 20, w - 30, h - 20, INK, 'thin', head=7)
        c.text(w - 24, h - 20, 'x', FST, anchor='start', value=False)
        c.arrow(w - 70, h - 20, w - 70, h - 60, INK, 'thin', head=7)
        c.text(w - 70, h - 68, 'y', FST, value=False)
    if B_label:
        c.text(w - 16, 14, B_label, FST, anchor='end', color=ACC if field == 'lines' else INK)
    return c.done(title, desc)


def dip_figure(title, desc, dip_deg, total_label=None, h_label=None, dip_label=None, w=340, h=240):
    """The Earth's field in the north–vertical plane: total field at the angle of dip below the horizontal,
    with its horizontal (north) and vertical components."""
    c = Canvas(w, h)
    ox, oy = 50, 50
    a = math.radians(dip_deg)
    L = min(230, 170 / max(math.sin(a), 0.2))
    ex, ey = ox + L * math.cos(a), oy + L * math.sin(a)
    c.line(ox, oy, w - 20, oy, MUT, 'thin', dash='4 3')
    c.text(w - 20, oy - 12, 'north (horizontal)', FST, anchor='end', value=False)
    c.arrow(ox, oy, ex, oy, ACC2, 'main')
    c.arrow(ex, oy, ex, ey, ACC2, 'main', dash='5 3')
    c.arrow(ox, oy, ex, ey, ACC, 'bold')
    if h_label:
        c.text((ox + ex) / 2, oy - 12, h_label, FST, color=ACC2)
    c.text(ex + 8, (oy + ey) / 2, 'vertical component', FST, anchor='start', color=ACC2, value=False) if ex < w - 150 else None
    if total_label:
        c.text((ox + ex) / 2 - 14, (oy + ey) / 2 + 6, total_label, FST, anchor='end', color=ACC)
    r = 44
    c.path(f'M{r1(ox + r)},{r1(oy)} A{r},{r} 0 0,1 {r1(ox + r * math.cos(a))},{r1(oy + r * math.sin(a))}', MUT, 'axis')
    if dip_label:
        c.text(ox + (r + 14) * math.cos(a / 2), oy + (r + 14) * math.sin(a / 2), dip_label, FST, anchor='start')
    return c.done(title, desc)


# ═════════════════════════ capacitors ═════════════════════════

def cap_plates(title, desc, area_label=None, gap_label=None, dielectric=None, supply=None, top_label=None,
               bottom_label=None, charges=False, arrow_note=None, w=420, h=240):
    """A parallel-plate capacitor seen side-on: horizontal plates, optional dielectric slab, optional supply."""
    c = Canvas(w, h)
    x0, x1, yt, yb = 100, 300, 60, 150
    if dielectric is not None:
        c.rect(x0, yt + 3, x1 - x0, yb - yt - 6, MUT, 'thin', fill=FILLC)
        if dielectric:
            c.text((x0 + x1) / 2, (yt + yb) / 2, dielectric, FST)
    c.line(x0, yt, x1, yt, INK, 'bold')
    c.line(x0, yb, x1, yb, INK, 'bold')
    if charges:
        for k in range(6):
            x = x0 + 18 + k * (x1 - x0 - 36) / 5
            c.text(x, yt - 10, '+', FST, weight=700, color=ACC2, value=False)
            c.text(x, yb + 11, MINUS, FST, weight=700, color=ACC, value=False)
    if top_label:
        c.text((x0 + x1) / 2, yt - 26, top_label, FST)
    if bottom_label:
        c.text((x0 + x1) / 2, yb + 28, bottom_label, FST)
    if gap_label:
        c.dim(x0 - 22, yt, x0 - 22, yb, gap_label, side=-1)
    if area_label:
        c.text(x1, yt - 16 if not charges else yt - 30, area_label, FST, anchor='end')
    if supply:
        c.line(x1, yt, 370, yt, INK, 'main')
        c.line(x1, yb, 370, yb, INK, 'main')
        vcomp(c, 'cell', 370, yt, yb, supply, side=-1)
    if arrow_note:
        c.text(w / 2, h - 14, arrow_note, FST)
    return c.done(title, desc)


def share_circuit(title, desc, c1_label, c2_label, switch='open', meter=False, w=420):
    """A charged capacitor joined to a second capacitor through a switch (charge sharing)."""
    top = Series(El('C', c1_label), El('switch', closed=(switch == 'closed')))
    bottom = Par(El('V'), El('C', c2_label)) if meter else El('C', c2_label)
    return loop(top, bottom if isinstance(bottom, Par) else Series(bottom), title, desc)


def network(net, title, desc, margin=40):
    """A component network between two terminals A and B (no supply)."""
    if not isinstance(net, (Series, Par)):
        net = Series(net)
    w, up, down = net.size()
    c = Canvas(w + 2 * margin, 0)
    y = 20 + up
    net.draw(c, margin, y, w)
    for x, lab in ((margin - 22, 'A'), (margin + w + 22, 'B')):
        c.line(x, y, margin if lab == 'A' else margin + w, y, INK, 'main')
        c.circle(x, y, 4, INK, 'axis', fill='none')
        c.text(x + (-10 if lab == 'A' else 10), y - 12, lab, FST, weight=600, value=False)
    c.w = w + 2 * margin + 30
    c.els.insert(0, '')
    c.h = y + down + 24
    return c.done(title, desc)


# ═════════════════════════ electric charge and fields ═════════════════════════

def spheres_stands(title, desc, spheres, touching=(), rod=None, earth=None, w=420, h=230):
    """Metal spheres on insulating stands. spheres: (name, charge label); touching: indices drawn in contact;
    rod: (sign text, index the rod is held near); earth: index of a sphere joined to earth."""
    c = Canvas(w, h)
    n = len(spheres)
    R = 28
    xs, x = [], 70
    for i in range(n):
        xs.append(x)
        x += 2 * R if (i in touching and i + 1 in touching) else 2 * R + 46
    shift = (w - (xs[-1] + 70)) / 2
    xs = [v + shift for v in xs]
    cy = 120
    for (name, lab), x in zip(spheres, xs):
        c.circle(x, cy, R, INK, 'main', fill=FILLC)
        c.line(x, cy + R, x, h - 40, MUT, 'bold')
        c.line(x - 22, h - 40, x + 22, h - 40, INK, 'main')
        if name:
            c.text(x, cy - R - 14, name, FS, weight=600, value=False)
        if lab:
            c.text(x, h - 22, lab, FST)
    if rod:
        sign, i = rod
        rx = xs[i] - R - 64
        c.rect(rx - 8, cy - 70, 16, 120, ACC2, 'main', fill=FILLC, rx=4)
        for k in range(4):
            c.text(rx, cy - 54 + k * 28, sign, FST, weight=700, color=ACC2, value=False)
    if earth is not None:
        x = xs[earth]
        c.line(x + R * 0.7, cy + R * 0.7, x + 50, cy + 60, INK, 'main')
        for k, hw in enumerate((14, 9, 4)):
            c.line(x + 50 - hw, cy + 60 + k * 5, x + 50 + hw, cy + 60 + k * 5, INK, 'axis')
    return c.done(title, desc)


def electroscope(title, desc, leaf_raised=True, rod=None, w=300, h=280):
    c = Canvas(w, h)
    cx = 150
    c.rect(cx - 30, 20, 60, 10, INK, 'main', fill=FILLC, rx=3)
    c.line(cx, 30, cx, 170, INK, 'bold')
    c.rect(cx - 80, 90, 160, 150, MUT, 'thin', rx=10)
    c.line(cx - 2, 160, cx - 2, 200, INK, 'main')
    ang = math.radians(35 if leaf_raised else 5)
    c.line(cx + 2, 160, cx + 2 + 44 * math.sin(ang), 160 + 44 * math.cos(ang), ACC2, 'bold')
    c.text(cx + 40, 205, 'gold leaf', FST, anchor='start', color=ACC2, value=False)
    c.text(cx - 40, 25, 'cap', FST, anchor='end', value=False)
    if rod:
        c.rect(cx + 44, 4, 96, 14, ACC2, 'main', fill=FILLC, rx=4)
        for k in range(4):
            c.text(cx + 58 + k * 23, 11, rod, FST, weight=700, color=ACC2, value=False)
    return c.done(title, desc)


def point_charges(title, desc, charges, points=(), dims=(), w=420, h=200, pad=70):
    """Point charges (x, y, sign, label) and marked points (x, y, label) in data units, scaled to fit."""
    xs = [q[0] for q in charges] + [p[0] for p in points]
    ys = [q[1] for q in charges] + [p[1] for p in points]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    sp = min((w - 2 * pad) / ((x1 - x0) or 1), (h - 2 * pad) / ((y1 - y0) or 1))
    X = lambda v: w / 2 + (v - (x0 + x1) / 2) * sp  # noqa: E731
    Y = lambda v: h / 2 - (v - (y0 + y1) / 2) * sp  # noqa: E731
    c = Canvas(w, h)
    for d in dims:
        c.dim(X(d[0]), Y(d[1]), X(d[2]), Y(d[3]), d[4], side=d[5])
    for x, y, sign, lab in charges:
        c.circle(X(x), Y(y), 13, ACC2 if sign == '+' else ACC, 'main', fill=FILLC)
        c.text(X(x), Y(y) + 0.5, sign, FS, weight=700, color=ACC2 if sign == '+' else ACC, value=False)
        if lab:
            c.text(X(x), Y(y) - 26, lab, FST)
    for x, y, lab in points:
        c.dot(X(x), Y(y), 3.6)
        c.text(X(x), Y(y) - 14, lab, FST, weight=600)
    return c.done(title, desc)


# ═════════════════════════ gases ═════════════════════════

def syringe(title, desc, gas_frac=0.6, label=None, gauge=None, push=None, w=420, h=170, tube=False):
    """A gas syringe (horizontal barrel) with the gas filling gas_frac of the barrel; optional gauge on the nozzle."""
    c = Canvas(w, h)
    x0, x1, y0, y1 = 100, 290, 50, 110
    c.rect(x0, y0, x1 - x0, y1 - y0, INK, 'main', rx=3)
    xp = x0 + gas_frac * (x1 - x0)
    c.rect(x0 + 1, y0 + 1, xp - x0 - 2, y1 - y0 - 2, 'none', 'thin', fill=FILLC)
    c.line(xp, y0 + 2, xp, y1 - 2, INK, 'bold')
    c.line(xp, (y0 + y1) / 2, x1 + 50, (y0 + y1) / 2, INK, 'bold')
    c.line(x1 + 50, y0 + 6, x1 + 50, y1 - 6, INK, 'bold')
    for k in range(1, 10):
        x = x0 + k * (x1 - x0) / 10
        c.line(x, y0, x, y0 + (8 if k % 5 == 0 else 5), INK, 'thin')
    c.line(x0, (y0 + y1) / 2, x0 - 40 if (gauge or tube) else x0 - 16, (y0 + y1) / 2, INK, 'bold')
    if gauge:
        c.circle(x0 - 62, (y0 + y1) / 2, 20, INK, 'main', fill=FILLC)
        c.line(x0 - 62, (y0 + y1) / 2, x0 - 52, (y0 + y1) / 2 - 12, INK, 'axis')
        c.text(x0 - 62, (y0 + y1) / 2 + 36, gauge, FST)
    if label:
        c.text((x0 + xp) / 2, y1 + 22, label, FST)
    if push == 'in':
        c.arrow(x1 + 116, (y0 + y1) / 2, x1 + 60, (y0 + y1) / 2, ACC2, 'main')
        c.text(x1 + 88, (y0 + y1) / 2 - 16, 'push', FST, color=ACC2, value=False)
    elif push == 'out':
        c.arrow(x1 + 60, (y0 + y1) / 2, x1 + 116, (y0 + y1) / 2, ACC2, 'main')
        c.text(x1 + 88, (y0 + y1) / 2 - 16, 'pull', FST, color=ACC2, value=False)
    return c.done(title, desc)


def bubble_lake(title, desc, depth_label=None, bottom_label=None, top_label=None, w=360, h=280):
    c = Canvas(w, h)
    ys, yb = 50, h - 30
    c.rect(20, ys, w - 40, yb - ys, ACC, 'thin', fill=FILLC)
    c.line(20, ys, w - 20, ys, ACC, 'main')
    c.line(20, yb, w - 20, yb, INK, 'bold')
    bx = 160
    c.circle(bx, yb - 22, 9, INK, 'main')
    c.circle(bx, ys + 16, 15, INK, 'main')
    c.arrow(bx, yb - 40, bx, ys + 40, ACC2, 'main', dash='5 4')
    if bottom_label:
        c.text(bx + 18, yb - 22, bottom_label, FST, anchor='start')
    if top_label:
        c.text(bx + 24, ys + 16, top_label, FST, anchor='start')
    c.text(w - 26, ys - 14, 'surface', FST, anchor='end', value=False)
    if depth_label:
        c.dim(60, ys, 60, yb, depth_label, side=1)
    return c.done(title, desc)


def piston_cylinder(title, desc, mass_label=None, area_label=None, height_label=None, extra_mass=None, atm_label=None, w=320, h=300):
    """A vertical cylinder of trapped gas under a frictionless piston, with optional masses on top."""
    c = Canvas(w, h)
    x0, x1, yb = 100, 220, h - 30
    yp = 130
    c.line(x0, 60, x0, yb, INK, 'bold')
    c.line(x1, 60, x1, yb, INK, 'bold')
    c.line(x0, yb, x1, yb, INK, 'bold')
    c.rect(x0 + 2, yp + 12, x1 - x0 - 4, yb - yp - 14, 'none', 'thin', fill=FILLC)
    c.rect(x0 + 2, yp, x1 - x0 - 4, 12, INK, 'main', fill=MUT)
    c.text((x0 + x1) / 2, (yp + yb) / 2 + 6, 'gas', FST, value=False)
    top = yp
    if mass_label:
        c.text(x1 + 10, yp + 6, mass_label, FST, anchor='start')
    if extra_mass:
        c.rect((x0 + x1) / 2 - 24, yp - 30, 48, 30, INK, 'main', fill=FILLC)
        c.text((x0 + x1) / 2, yp - 15, extra_mass, FST)
    if area_label:
        c.text((x0 + x1) / 2, yb + 18, area_label, FST)
    if height_label:
        c.dim(x0 - 20, yp + 12, x0 - 20, yb, height_label, side=-1)
    if atm_label:
        c.text((x0 + x1) / 2, 40, atm_label, FST)
    return c.done(title, desc)


def two_flasks(title, desc, a_label=None, b_label=None, a_text=None, b_text=None, tap=True, w=420, h=230):
    c = Canvas(w, h)
    for cx, lab, txt, filled in ((110, a_label, a_text, True), (310, b_label, b_text, False)):
        c.circle(cx, 120, 62, INK, 'main', fill=FILLC if filled else 'none')
        if lab:
            c.text(cx, 120, lab, FS, weight=600, value=False)
        if txt:
            c.text(cx, 206, txt, FST)
    c.line(172, 120, 248, 120, INK, 'bold')
    if tap:
        c.circle(210, 120, 9, INK, 'main', fill=FILLC)
        c.line(210, 109, 210, 131, INK, 'axis')
        c.text(210, 98, 'tap', FST, value=False)
    return c.done(title, desc)


def air_column(title, desc, col_label=None, hg_label=None, tube_label=None, vertical=True, w=260, h=300):
    """A uniform tube closed at the bottom with an air column trapped under a mercury thread."""
    c = Canvas(w, h)
    x0, x1, yb = 110, 140, h - 30
    ya = 150
    yt = 90
    c.path(f'M{x0},{40} V{yb} H{x1} V{40}', INK, 'main')
    c.rect(x0 + 2, ya, x1 - x0 - 4, yb - ya - 2, 'none', 'thin', fill=FILLC)
    c.rect(x0 + 2, yt, x1 - x0 - 4, ya - yt, INK, 'thin', fill=MUT)
    c.text(x1 + 12, (yt + ya) / 2, 'mercury', FST, anchor='start', value=False)
    c.text(x1 + 12, (ya + yb) / 2 + 16, 'trapped air', FST, anchor='start', value=False)
    if col_label:
        c.dim(x0 - 16, ya, x0 - 16, yb, col_label, side=-1)
    if hg_label:
        c.text(x1 + 12, (yt + ya) / 2 + 16, hg_label, FST, anchor='start')
    if tube_label:
        c.text((x0 + x1) / 2, 26, tube_label, FST)
    return c.done(title, desc)


def manometer(title, desc, diff_label=None, gas_label='gas', w=360, h=280):
    c = Canvas(w, h)
    xl, xr, yb = 140, 220, h - 40
    lev_l, lev_r = 170, 120
    c.path(f'M{xl - 12},{60} V{yb} A{(xr - xl) / 2 + 12},{(xr - xl) / 2 + 12} 0 0,0 {xr + 12},{yb} V{40}', INK, 'main')
    c.path(f'M{xl + 12},{60} V{yb} A{(xr - xl) / 2 - 12},{(xr - xl) / 2 - 12} 0 0,0 {xr - 12},{yb} V{40}', INK, 'main')
    c.rect(xl - 10, lev_l, 20, yb - lev_l, 'none', 'thin', fill=FILLC)
    c.rect(xr - 10, lev_r, 20, yb - lev_r, 'none', 'thin', fill=FILLC)
    c.line(xl - 12, 60, 80, 60, INK, 'main')
    c.text(80, 44, gas_label, FST, anchor='middle', value=False)
    c.line(xl + 12, lev_r, xr + 30, lev_r, MUT, 'thin', dash='3 3')
    if diff_label:
        c.dim(xr + 30, lev_r, xr + 30, lev_l, diff_label, side=1)
    c.line(xr - 12, lev_l, xr + 30, lev_l, MUT, 'thin', dash='3 3')
    c.text(xr + 14, 30, 'open to air', FST, anchor='start', value=False)
    return c.done(title, desc)


def water_bath(title, desc, gauge=True, thermometer=True, w=360, h=280):
    c = Canvas(w, h)
    c.rect(40, 90, 230, 160, INK, 'main')
    c.rect(41, 110, 228, 139, 'none', 'thin', fill=FILLC)
    c.text(60, 100, 'water', FST, anchor='start', value=False)
    c.circle(150, 190, 40, INK, 'main')
    c.line(150, 150, 150, 50, INK, 'bold')
    c.line(150, 50, 290, 50, INK, 'bold')
    if gauge:
        c.circle(300, 70, 22, INK, 'main', fill=FILLC)
        c.line(300, 70, 312, 58, INK, 'axis')
        c.text(300, 108, 'pressure gauge', FST, value=False)
    c.text(150, 194, 'air', FST, value=False)
    if thermometer:
        c.rect(230, 60, 8, 150, INK, 'thin', rx=4)
        c.circle(234, 214, 8, INK, 'thin', fill=ACC2)
    c.rect(60, 252, 190, 14, INK, 'thin', fill=MUT)
    c.text(155, 276, 'heater', FST, value=False)
    c.h = 286
    return c.done(title, desc)


def molecule_box(title, desc, L_label=None, comps=False, w=320, h=300):
    """A cubical box (oblique view) with one molecule and its velocity (components optional)."""
    c = Canvas(w, h)
    s, d = 160, 50
    x0, y0 = 60, 90
    c.rect(x0, y0, s, s, INK, 'main')
    c.poly([(x0, y0), (x0 + d, y0 - d), (x0 + s + d, y0 - d), (x0 + s, y0)], INK, 'main')
    c.poly([(x0 + s, y0), (x0 + s + d, y0 - d), (x0 + s + d, y0 + s - d), (x0 + s, y0 + s)], INK, 'main')
    mx, my = x0 + 70, y0 + 80
    c.circle(mx, my, 7, ACC2, 'main', fill=FILLC)
    if comps:
        c.arrow(mx + 8, my, mx + 70, my, ACC2, 'main')
        c.text(mx + 76, my, 'u', FST, anchor='start', color=ACC2, italic=True, value=False)
        c.arrow(mx, my - 8, mx, my - 56, ACC2, 'main')
        c.text(mx, my - 66, 'v', FST, color=ACC2, italic=True, value=False)
        c.arrow(mx - 6, my + 6, mx - 34, my + 34, ACC2, 'main')
        c.text(mx - 42, my + 44, 'w', FST, color=ACC2, italic=True, value=False)
    else:
        c.arrow(mx + 6, my - 3, mx + 70, my - 30, ACC2, 'main')
    if L_label:
        c.dim(x0, y0 + s + 18, x0 + s, y0 + s + 18, L_label, side=-1, off=12)
    return c.done(title, desc)


def brownian(title, desc, n=40, seed=7, w=300, h=240):
    """A random-walk path for a smoke particle (deterministic pseudo-random steps)."""
    c = Canvas(w, h)
    x, y = w / 2, h / 2
    pts = [(x, y)]
    v = seed
    for _ in range(n):
        v = (v * 1103515245 + 12345) % 2 ** 31
        ang = (v % 3600) / 3600 * 2 * math.pi
        v = (v * 1103515245 + 12345) % 2 ** 31
        L = 10 + (v % 20)
        x = min(w - 20, max(20, x + L * math.cos(ang)))
        y = min(h - 20, max(20, y + L * math.sin(ang)))
        pts.append((x, y))
    c.poly(pts, ACC2, 'axis')
    for px, py in pts[::4]:
        c.dot(px, py, 2.2, ACC2)
    return c.done(title, desc)


# ═════════════════════════ thermal physics ═════════════════════════

def hstack(figs, title, desc, gap=10):
    """Place figures side by side, vertically centred."""
    H = max(_vb(f)[1] for f in figs)
    c = Canvas(0, H)
    x = 0
    for f in figs:
        w, h = _vb(f)
        c.els.append(f'<g transform="translate({r1(x)},{r1((H - h) / 2)})">{_body(f)}</g>')
        c.values += f.values
        x += w + gap
    c.w = x - gap
    return c.done(title, desc)


def electrical_heating(title, desc, block_label=None, power_label=None):
    """Electrical method for specific heat capacity: an insulated block with a heater and a thermometer, and the
    heater circuit (ammeter in series, voltmeter across the heater)."""
    b = Canvas(220, 250)
    bx, by, bw, bh = 30, 70, 160, 140
    b.rect(bx - 10, by - 10, bw + 20, bh + 20, MUT, 'thin', dash='4 3')
    b.rect(bx, by, bw, bh, INK, 'main', fill=FILLC)
    b.text(bx + bw / 2, by + bh + 26, 'insulation', FST, value=False)
    hx = bx + 50
    b.rect(hx - 8, by - 30, 16, 110, INK, 'main', fill=MUT)
    b.text(hx, by - 42, 'heater', FST, value=False)
    tx = bx + 115
    b.rect(tx - 4, by - 50, 8, 120, INK, 'thin', rx=4)
    b.circle(tx, by + 72, 7, INK, 'thin', fill=ACC2)
    b.text(tx, by - 60, 'thermometer', FST, value=False)
    if block_label:
        b.text(bx + bw / 2, by + bh - 20, block_label, FST)
    circ = circuit(Series(Par(El('R', 'heater', value=False), El('V')), El('A')), El('cell', power_label), 'x', 'x', w_min=220)
    return hstack([b.done('x', 'x'), circ], title, desc)


# ═════════════════════════ oscillations ═════════════════════════

def zigzag(c, x1, y1, x2, y2, n=10, amp=8, color=INK, lw='axis'):
    """A spring drawn as a zigzag between two points (straight leads at each end)."""
    L = math.hypot(x2 - x1, y2 - y1)
    ux, uy = (x2 - x1) / L, (y2 - y1) / L
    px, py = -uy, ux
    lead = min(10, L * 0.1)
    pts = [(x1, y1), (x1 + ux * lead, y1 + uy * lead)]
    for i in range(1, 2 * n):
        t = lead + (L - 2 * lead) * i / (2 * n)
        s = amp if i % 2 else -amp
        pts.append((x1 + ux * t + px * s, y1 + uy * t + py * s))
    pts += [(x2 - ux * lead, y2 - uy * lead), (x2, y2)]
    c.poly(pts, color, lw)


def ceiling(c, x0, x1, y):
    c.line(x0, y, x1, y, INK, 'axis')
    for x in range(int(x0) + 6, int(x1), 12):
        c.line(x, y, x - 8, y - 8, INK, 'thin')


def spring_v(title, desc, mass_label=None, ext_label=None, pull_label=None, k_label=None, double=False, vibrator=False,
             w=320, h=300):
    """Mass hanging on a vertical spring (or two springs side by side); optional extension and pull-down dims."""
    c = Canvas(w, h)
    cx, top = 130, 40
    if vibrator:
        c.rect(cx - 40, 10, 80, 26, INK, 'main', fill=FILLC, rx=4)
        c.text(cx, 23, 'vibrator', FST, value=False)
        c.arrow(cx + 56, 30, cx + 56, 6, ACC2, 'thin', head=6, both=True)
        top = 36
    else:
        ceiling(c, cx - 60, cx + 60, top)
    ybot = top + 130
    xs = [cx - 18, cx + 18] if double else [cx]
    for x in xs:
        zigzag(c, x, top, x, ybot, n=8, amp=9)
    c.rect(cx - 30, ybot, 60, 40, INK, 'main', fill=FILLC)
    if mass_label:
        c.text(cx, ybot + 20, mass_label, FST)
    if k_label:
        c.text(cx + 22 + (18 if double else 0), top + 65, k_label, FST, anchor='start')
    if ext_label:
        c.line(cx + 40, top + 100, cx + 80, top + 100, MUT, 'thin', dash='3 3')
        c.text(cx + 84, top + 100, 'unstretched end', FST, anchor='start', value=False)
        c.dim(cx + 60, top + 100, cx + 60, ybot, ext_label, side=1)
    if pull_label:
        c.dim(cx - 50, ybot + 40, cx - 50, ybot + 80, pull_label, side=-1)
        c.rect(cx - 30, ybot + 40, 60, 40, MUT, 'thin', dash='4 3')
        c.text(cx, ybot + 92, 'pulled down', FST, value=False)
    return c.done(title, desc)


def spring_h(title, desc, mass_label=None, k_labels=(None, None), x_label=None, glider=False, single=False, w=420, h=200):
    """A trolley or glider on a horizontal track held between two springs fixed to walls (or one spring)."""
    c = Canvas(w, h)
    y = 100
    c.rect(20, y - 50, 10, 80, INK, 'thin', fill=MUT)
    if not single:
        c.rect(w - 30, y - 50, 10, 80, INK, 'thin', fill=MUT)
    c.line(20, y + 30, w - 20, y + 30, INK, 'axis')
    bx0, bx1 = w / 2 - 40, w / 2 + 40
    c.rect(bx0, y - 20, 80, 40, INK, 'main', fill=FILLC, rx=4)
    if not glider:
        c.circle(bx0 + 18, y + 24, 6, INK, 'main')
        c.circle(bx1 - 18, y + 24, 6, INK, 'main')
    zigzag(c, 30, y, bx0, y, n=8, amp=8)
    if not single:
        zigzag(c, bx1, y, w - 30, y, n=8, amp=8)
    if mass_label:
        c.text(w / 2, y, mass_label, FST)
    if k_labels[0]:
        c.text((30 + bx0) / 2, y - 22, k_labels[0], FST)
    if k_labels[1] and not single:
        c.text((bx1 + w - 30) / 2, y - 22, k_labels[1], FST)
    if x_label:
        c.dim(w / 2, y + 52, w / 2 + 60, y + 52, x_label, side=-1, off=12)
        c.line(w / 2, y + 36, w / 2, y + 60, MUT, 'thin', dash='3 3')
    return c.done(title, desc)


def pendulum(title, desc, L_label=None, disp_label=None, bob_label=None, gate=False, angle=12, w=320, h=300):
    c = Canvas(w, h)
    px, py = 150, 40
    ceiling(c, px - 50, px + 50, py)
    L = 200
    a = math.radians(angle)
    bx, by = px + L * math.sin(a), py + L * math.cos(a)
    c.line(px, py, px, py + L + 10, MUT, 'thin', dash='4 3')
    c.line(px, py, bx, by, INK, 'axis')
    c.circle(bx, by, 11, INK, 'main', fill=FILLC)
    c.circle(px, py + L, 11, MUT, 'thin', dash='3 3')
    if L_label:
        c.text(px - 8, py + L / 2, L_label, FST, anchor='end')
    if bob_label:
        c.text(bx + 16, by - (22 if gate else 0), bob_label, FST, anchor='start')
    if disp_label:
        c.dim(px, py + L + 26, bx, py + L + 26, disp_label, side=-1, off=12)
    if gate:
        c.rect(px - 40, py + L - 8, 16, 16, INK, 'main', fill=FILLC)
        c.rect(px + 24, py + L - 8, 16, 16, INK, 'main', fill=FILLC)
        c.line(px - 24, py + L, px + 24, py + L, ACC2, 'thin', dash='3 2')
        c.text(px + 46, py + L, 'light gate', FST, anchor='start', value=False)
    return c.done(title, desc)


def test_tube(title, desc, area_label=None, mass_label=None, w=300, h=280):
    c = Canvas(w, h)
    c.rect(30, 130, w - 60, 130, ACC, 'thin', fill=FILLC)
    c.line(30, 130, w - 30, 130, ACC, 'main')
    cx = w / 2
    c.path(f'M{cx - 18},{60} V{210} A18,18 0 0,0 {cx + 18},{210} V{60}', INK, 'main')
    c.rect(cx - 14, 196, 28, 18, MUT, 'thin', fill=MUT)
    c.arrow(cx + 40, 80, cx + 40, 116, ACC2, 'thin', head=6, both=True)
    c.text(cx + 48, 98, 'bobs', FST, anchor='start', color=ACC2, value=False)
    if area_label:
        c.text(cx, 44, area_label, FST)
    if mass_label:
        c.text(cx, 26, mass_label, FST)
    return c.done(title, desc)


def u_tube(title, desc, L_label=None, w=360, h=280):
    c = Canvas(w, h)
    xl, xr, yb = 100, 200, 180
    c.path(f'M{xl - 14},{40} V{yb} A{(xr - xl) / 2 + 14},{(xr - xl) / 2 + 14} 0 0,0 {xr + 14},{yb} V{40}', INK, 'main')
    c.path(f'M{xl + 14},{40} V{yb} A{(xr - xl) / 2 - 14},{(xr - xl) / 2 - 14} 0 0,0 {xr - 14},{yb} V{40}', INK, 'main')
    c.rect(xl - 12, 90, 24, yb - 90, 'none', 'thin', fill=FILLC)
    c.rect(xr - 12, 130, 24, yb - 130, 'none', 'thin', fill=FILLC)
    c.line(xl - 30, 110, xr + 40, 110, MUT, 'thin', dash='3 3')
    c.text(xr + 44, 110, 'equilibrium level', FST, anchor='start', value=False)
    if L_label:
        c.text((xl + xr) / 2, h - 12, L_label, FST)
    return c.done(title, desc)


def curved_track(title, desc, R_label=None, mass_label=None, w=340, h=240):
    c = Canvas(w, h)
    cx, cy, R = w / 2, -60, 250
    a0 = math.radians(52)
    c.path(f'M{r1(cx - R * math.sin(a0))},{r1(cy + R * math.cos(a0))} A{R},{R} 0 0,0 {r1(cx + R * math.sin(a0))},{r1(cy + R * math.cos(a0))}', INK, 'bold')
    a = math.radians(12)
    bx, by = cx + (R - 12) * math.sin(a), cy + (R - 12) * math.cos(a)
    c.circle(bx, by, 11, ACC2, 'main', fill=FILLC)
    if R_label:
        c.text(cx, h - 12, R_label, FST)
    if mass_label:
        c.text(bx + 18, by - 14, mass_label, FST, anchor='start', color=ACC2)
    return c.done(title, desc)


def platform_coin(title, desc, f_label=None, w=300, h=240):
    c = Canvas(w, h)
    c.rect(70, 110, 160, 14, INK, 'main', fill=FILLC)
    c.rect(130, 100, 40, 10, ACC2, 'main', fill=FILLC)
    c.text(185, 92, 'coin', FST, anchor='start', color=ACC2, value=False)
    c.rect(130, 124, 40, 70, INK, 'main', fill=MUT)
    c.text(150, 210, 'vibrator', FST, value=False)
    c.arrow(250, 90, 250, 140, ACC2, 'thin', head=6, both=True)
    if f_label:
        c.text(258, 115, f_label, FST, anchor='start')
    return c.done(title, desc)


def shm_graph(f, t_end, xlabel, ylabel, title, desc, yr, xticks, yticks, n=400, hlines=(), vlines=(), notes=(), extra=(), dims=()):
    xs, ys = wave_xy(f, 0, t_end, n)
    return plot(xlabel, ylabel, [dict(x=xs, y=ys)] + list(extra), title, desc, xr=(0, t_end), yr=yr, xticks=xticks, yticks=yticks,
                hlines=hlines, vlines=vlines, notes=notes, dims=dims)


def barton(title, desc, n=5, w=420, h=250):
    """Barton's pendulums: a heavy driver (left) and light pendulums of different lengths on one string;
    the middle light pendulum has the driver's length."""
    c = Canvas(w, h)
    c.line(20, 30, w - 20, 30, INK, 'axis')
    lengths = [80 + 24 * i for i in range(n)]
    xs = [150 + i * (w - 190) / (n - 1) for i in range(n)]
    for x, L in zip(xs, lengths):
        c.line(x, 30, x, 30 + L, INK, 'thin')
        c.circle(x, 30 + L + 6, 6, INK, 'thin', fill=FILLC)
    xd, Ld = 60, lengths[n // 2]
    c.line(xd, 30, xd, 30 + Ld, INK, 'axis')
    c.circle(xd, 30 + Ld + 12, 13, ACC2, 'main', fill=FILLC)
    c.text(xd, 30 + Ld + 40, 'heavy driver', FST, color=ACC2, value=False)
    c.text((xs[0] + xs[-1]) / 2, h - 12, 'light pendulums of different lengths', FST, value=False)
    return c.done(title, desc)


# ═════════════════════════ gravitation ═════════════════════════

def planet_orbits(title, desc, R, orbits=(), planet_label=None, w=360, h=320, tangents=None, ground=None, sat_angle=45):
    """A planet of radius R (data units) with circular orbits dict(r, label, dash, height_label, radius_label, sat, angle)
    drawn to scale. Orbits with a height or radius label put their satellite straight above the planet, with the
    arrow vertical and its label to the right, so the text never sits on a sloping line."""
    c = Canvas(w, h)
    cx, cy = w / 2, h / 2
    rmax = max([o['r'] for o in orbits] + [R])
    sc = (min(w, h) / 2 - 34) / rmax
    Rp = max(R * sc, 10)
    c.circle(cx, cy, Rp, INK, 'main', fill=FILLC)
    if planet_label:
        c.text(cx, cy, planet_label, FST, weight=600, value=False)
    for k, o in enumerate(orbits):
        ro = o['r'] * sc
        c.circle(cx, cy, ro, ACC if k == 0 else ACC2, 'axis', dash=o.get('dash'))
        vertical = o.get('height_label') or o.get('radius_label')
        a = math.radians(o.get('angle', 90 if vertical else sat_angle + 25 * k))
        sx, sy = cx + ro * math.cos(a), cy - ro * math.sin(a)
        if o.get('sat', True):
            c.rect(sx - 6, sy - 4, 12, 8, ACC2 if k else ACC, 'main', fill=FILLC)
        if o.get('label'):
            c.text(sx + 12, sy - 12, o['label'], FST, anchor='start' if math.cos(a) >= 0 else 'end')
        if o.get('height_label'):
            ex, ey = cx + Rp * math.cos(a), cy - Rp * math.sin(a)
            tip = 5 if o.get('sat', True) else 0
            c.arrow(ex, ey, sx - tip * math.cos(a), sy + tip * math.sin(a), MUT, 'thin', head=7, both=True)
            c.text((ex + sx) / 2 + 8, (ey + sy) / 2 + 5, o['height_label'], FST, anchor='start')
        if o.get('radius_label'):
            c.line(cx, cy, sx, sy, MUT, 'thin', dash='4 3')
            off = 18 if tangents is not None else 8
            c.text((cx + sx) / 2 + off, (cy + sy) / 2 + 5, o['radius_label'], FST, anchor='start')
    if tangents is not None:
        ro = orbits[0]['r'] * sc
        sx, sy = cx, cy - ro
        half = math.asin(min(1.0, Rp / ro))
        for s in (-1, 1):
            L = math.sqrt(ro ** 2 - Rp ** 2)
            c.line(sx, sy, sx + L * math.sin(s * half), sy + L * math.cos(half), MUT, 'thin', dash='4 3')
    if ground:
        top = cy - orbits[0]['r'] * sc
        c.line(cx, cy - Rp, cx, top, ACC2, 'thin', dash='5 3')
        c.dot(cx, cy - Rp, 3, ACC2)
        c.text(cx + 8, cy - Rp - 8, ground, FST, anchor='start', color=ACC2)
    return c.done(title, desc)


def bodies(title, desc, items, points=(), dims=(), w=420, h=None, pad=70):
    """Masses (x, y, radius_px, label) and marked points (x, y, label[, 'below']) in data units, scaled to fit the
    width; dims are (x1, y1, x2, y2, label, side) in the same units. The height follows the content unless given."""
    xs = [q[0] for q in items] + [p[0] for p in points] + [d[0] for d in dims] + [d[2] for d in dims]
    ys = [q[1] for q in items] + [p[1] for p in points] + [d[1] for d in dims] + [d[3] for d in dims]
    x0, x1, y0, y1 = min(xs), max(xs), min(ys), max(ys)
    sp = (w - 2 * pad) / ((x1 - x0) or 1)
    rmax = max([q[2] for q in items] + [4])
    if h is None:
        h = (y1 - y0) * sp + 2 * (rmax + 36)
    elif y1 > y0:
        sp = min(sp, (h - 2 * (rmax + 36)) / (y1 - y0))
    X = lambda v: w / 2 + (v - (x0 + x1) / 2) * sp  # noqa: E731
    Y = lambda v: h / 2 - (v - (y0 + y1) / 2) * sp  # noqa: E731
    c = Canvas(w, h)
    for d in dims:
        c.dim(X(d[0]), Y(d[1]), X(d[2]), Y(d[3]), d[4], side=d[5])
    for x, y, r, lab in items:
        c.circle(X(x), Y(y), r, INK, 'main', fill=FILLC)
        if lab:
            c.text(X(x), Y(y) - r - 12, lab, FST)
    for pt in points:
        x, y, lab = pt[:3]
        c.dot(X(x), Y(y), 3.6, ACC2)
        if len(pt) > 3 and pt[3] == 'below':
            c.text(X(x), Y(y) + 20, lab, FST, color=ACC2)
        else:
            c.text(X(x) + 8, Y(y) - 12, lab, FST, anchor='start', color=ACC2)
    return c.done(title, desc)


def equipotentials(title, desc, values, labels, w=440, h=340):
    """Equipotential circles round a planet: radius ∝ 1/|φ| (point-mass field), computed from the values.
    Labels sit in a column on the right, joined to their circles by thin horizontal leaders (outermost highest)."""
    c = Canvas(w, h)
    cx, cy = 24 + (min(w, h) / 2 - 24), h / 2
    inv = [1 / abs(v) for v in values]
    sc = (min(w, h) / 2 - 24) / max(inv)
    c.circle(cx, cy, min(inv) * sc * 0.6, INK, 'main', fill=FILLC)
    order = sorted(range(len(values)), key=lambda i: -inv[i])   # outermost first
    lx = cx + max(inv) * sc + 18
    prev = None
    for i in order:
        r = inv[i] * sc
        c.circle(cx, cy, r, ACC, 'axis', dash='5 4')
        ly = cy - 0.72 * r if prev is None else max(cy - 0.72 * r, prev + 26)
        prev = ly
        dy = ly - cy
        px = cx + math.sqrt(max(r * r - dy * dy, 0))
        c.line(px, ly, lx - 4, ly, MUT, 'thin')
        c.dot(px, ly, 2.4, MUT)
        c.text(lx, ly + 5, labels[i], FST, anchor='start')
    return c.done(title, desc)


# ═════════════════════════ circular motion ═════════════════════════

def _pt(cx, cy, r, deg):
    a = math.radians(deg)
    return cx + r * math.cos(a), cy - r * math.sin(a)


def rot_arrow(c, cx, cy, r, a0, a1, color=None, lw='axis', ry=None):
    """Curved arrow on a circle (or ellipse with ry) from angle a0 to a1 (degrees, anticlockwise if a1 > a0)."""
    color = color or MUT
    ry = ry or r
    p0 = (cx + r * math.cos(math.radians(a0)), cy - ry * math.sin(math.radians(a0)))
    p1 = (cx + r * math.cos(math.radians(a1)), cy - ry * math.sin(math.radians(a1)))
    ccw = a1 > a0
    c.path(f'M{r1(p0[0])},{r1(p0[1])} A{r1(r)},{r1(ry)} 0 0,{0 if ccw else 1} {r1(p1[0])},{r1(p1[1])}', color, lw)
    a = math.radians(a1)
    tx, ty = (-r * math.sin(a), -ry * math.cos(a)) if ccw else (r * math.sin(a), ry * math.cos(a))
    c.arrowhead(p1[0], p1[1], math.atan2(ty, tx), color, 8)


def latitude(title, desc, points, arc=False, axis_radius=None, w=380, h=350):
    """Cross-section of the Earth through the axis: points at latitudes (deg, label), north positive;
    arc=True highlights the surface arc between the first two; axis_radius labels the distance of the
    first point from the axis."""
    c = Canvas(w, h)
    cx, cy, R = 150, h / 2, 136
    c.circle(cx, cy, R, INK, 'main', fill=FILLC)
    c.line(cx, cy - R - 16, cx, cy + R + 16, MUT, 'thin', dash='5 4')
    c.text(cx, cy - R - 26, 'N', FST, weight=600, value=False)
    c.text(cx, cy + R + 26, 'S', FST, weight=600, value=False)
    c.line(cx - R, cy, cx + R, cy, MUT, 'thin', dash='5 4')
    c.text(cx - R / 2, cy + 12, 'Equator', FST, color=MUT, value=False)
    c.dot(cx, cy, 2.6)
    if arc and len(points) >= 2:
        (a1, _), (a2, _) = points[0], points[1]
        p1, p2 = _pt(cx, cy, R, a1), _pt(cx, cy, R, a2)
        c.path(f'M{r1(p1[0])},{r1(p1[1])} A{R},{R} 0 0,{0 if a2 > a1 else 1} {r1(p2[0])},{r1(p2[1])}', ACC2, 'bold')
    for k, (lat, lab) in enumerate(points):
        px, py = _pt(cx, cy, R, lat)
        c.line(cx, cy, px, py, INK, 'thin')
        c.dot(px, py, 3.8, ACC2)
        c.text(px + 12, py - (12 if lat >= 0 else -12) * (0.4 if abs(lat) < 20 else 1), lab, FST, anchor='start', color=ACC2)
    if axis_radius:
        lat = points[0][0]
        px, py = _pt(cx, cy, R, lat)
        c.line(cx, py, px, py, ACC, 'main')
        c.text(cx + 4, py + 12, axis_radius, FST, anchor='start', color=ACC)
    return c.done(title, desc)


def belt_drive(title, desc, ra, rb, la, lb, chain=False, w=420, h=250):
    """Two pulleys (radii ra, rb in any unit, drawn to scale) joined by a belt or chain; la/lb are
    (name, radius text) pairs written under each."""
    c = Canvas(w, h)
    sc = 70 / max(ra, rb)
    a, b = max(ra * sc, 10), max(rb * sc, 10)
    y = 100
    x1, x2 = 50 + a, w - 50 - b
    d = x2 - x1
    phi = math.asin((a - b) / d)
    s, co = math.sin(phi), math.cos(phi)
    P1, P2 = (x1 + a * s, y - a * co), (x2 + b * s, y - b * co)
    Q1, Q2 = (x1 + a * s, y + a * co), (x2 + b * s, y + b * co)
    c.circle(x1, y, a, INK, 'main', fill=FILLC)
    c.circle(x2, y, b, INK, 'main', fill=FILLC)
    c.dot(x1, y, 2.8)
    c.dot(x2, y, 2.4)
    dash = '3 3' if chain else None
    c.line(*P1, *P2, ACC2, 'main', dash=dash)
    c.line(*Q1, *Q2, ACC2, 'main', dash=dash)
    c.path(f'M{r1(P1[0])},{r1(P1[1])} A{r1(a)},{r1(a)} 0 {1 if a > b else 0},0 {r1(Q1[0])},{r1(Q1[1])}', ACC2, 'main', dash=dash)
    c.path(f'M{r1(P2[0])},{r1(P2[1])} A{r1(b)},{r1(b)} 0 {1 if b > a else 0},1 {r1(Q2[0])},{r1(Q2[1])}', ACC2, 'main', dash=dash)
    for x, r, (name, rad) in ((x1, a, la), (x2, b, lb)):
        c.text(x, y + max(a, b) + 26, name, FST, value=False)
        c.text(x, y + max(a, b) + 44, rad, FST)
    return c.done(title, desc)


def circle_turn(title, desc, angles, v_label=None, ccw=True, angle_label=None, north=False, labels=(), axes=False,
                R_label=None, centre_label=None, w=360, h=300, cx=None):
    """Top view of uniform circular motion: positions at the given angles (degrees from the +x direction)
    with tangential velocity arrows, an optional angle mark at the centre between the first two positions.
    labels: (text, dx, dy, anchor) per position, offsets from the point."""
    c = Canvas(w, h)
    cx = cx if cx is not None else w / 2
    cy, R = h / 2 + 6, 100
    if axes:
        c.arrow(cx - R - 24, cy, cx + R + 30, cy, INK, 'axis', head=7)
        c.arrow(cx, cy + R + 24, cx, cy - R - 30, INK, 'axis', head=7)
        c.text(cx + R + 40, cy, 'x', FS, italic=True, value=False)
        c.text(cx - 12, cy - R - 30, 'y', FS, italic=True, value=False)
    c.circle(cx, cy, R, MUT, 'axis', dash='5 4')
    c.dot(cx, cy, 3)
    if centre_label:
        c.text(cx - 8, cy + 14, centre_label, FST, anchor='end')
    for k, a in enumerate(angles):
        px, py = _pt(cx, cy, R, a)
        if not axes or a % 90:
            c.line(cx, cy, px, py, MUT, 'thin')
        r_ = math.radians(a)
        tx, ty = (-math.sin(r_), -math.cos(r_)) if ccw else (math.sin(r_), math.cos(r_))
        L = 56
        c.arrow(px, py, px + L * tx, py + L * ty, ACC, 'main')
        close = len(angles) > 1 and abs(angles[1] - angles[0]) < 50
        if v_label and not (close and k == 0):
            ex, ey = px + (L + 12) * tx, py + (L + 12) * ty
            anchor = 'start' if tx > 0.3 else ('end' if tx < -0.3 else 'middle')
            c.text(ex, ey, v_label, FST, anchor=anchor, color=ACC)
        c.circle(px, py, 6, ACC2, 'main', fill=FILLC)
        if k < len(labels) and labels[k]:
            t, dx, dy, anchor = labels[k]
            c.text(px + dx, py + dy, t, FST, anchor=anchor, color=ACC2)
    if angle_label and len(angles) >= 2:
        a0, a1 = angles[0], angles[1]
        p0, p1 = _pt(cx, cy, 30, a0), _pt(cx, cy, 30, a1)
        c.path(f'M{r1(p0[0])},{r1(p0[1])} A30,30 0 0,{0 if a1 > a0 else 1} {r1(p1[0])},{r1(p1[1])}', INK, 'thin')
        mx, my = _pt(cx, cy, 46, (a0 + a1) / 2)
        c.text(mx, my, angle_label, FST)
    if R_label:
        px, py = _pt(cx, cy, R, angles[0])
        r_ = math.radians(angles[0])
        c.text((cx + px) / 2 - 14 * math.sin(r_), (cy + py) / 2 - 14 * math.cos(r_), R_label, FST)
    if north:
        compass(c, w - 28, 50)
    return c.done(title, desc)


def vertical_circle(title, desc, r_label=None, at='bottom', v_label=None, obj='ball', string=True, track=False,
                    hand=None, w=320, h=320):
    """Side view of motion in a vertical circle: a ball or bucket on a string, a car inside a loop track
    or an aircraft on a circular path; the object at the bottom or top with its velocity arrow."""
    c = Canvas(w, h)
    cx, cy, R = w / 2, h / 2, 100
    if track:
        c.circle(cx, cy, R + 4, INK, 'bold')
    else:
        c.circle(cx, cy, R, MUT, 'axis', dash='5 4')
    oy = cy + R if at == 'bottom' else cy - R
    if track:
        oy = cy + R - 9 if at == 'bottom' else cy - R + 9
    if string:
        c.line(cx, cy, cx, oy, INK, 'main')
        c.circle(cx, cy, 5, INK, 'main', fill=FILLC)
        if hand:
            c.text(cx - 10, cy, hand, FST, anchor='end', value=False)
    else:
        c.line(cx, cy, cx, oy, MUT, 'thin', dash='4 3')
        c.dot(cx, cy, 3)
    if r_label:
        c.text(cx + 8, (cy + oy) / 2, r_label, FST, anchor='start')
    if obj == 'ball':
        c.circle(cx, oy, 11, ACC2, 'main', fill=FILLC)
    elif obj == 'bucket':
        top = oy - 14
        c.poly([(cx - 14, top), (cx + 14, top), (cx + 10, oy + 14), (cx - 10, oy + 14)], ACC2, 'main', fill=FILLC, closed=True)
    elif obj == 'car':
        hh = 14
        y0 = oy - hh / 2
        c.rect(cx - 22, y0, 44, hh, ACC2, 'main', fill=FILLC, rx=3)
    elif obj == 'plane':
        c.poly([(cx - 26, oy - 3), (cx + 22, oy - 3), (cx + 30, oy), (cx + 22, oy + 3), (cx - 26, oy + 3)], ACC2, 'main', fill=FILLC, closed=True)
        c.poly([(cx - 4, oy), (cx - 14, oy + 16), (cx - 6, oy + 16), (cx + 8, oy)], ACC2, 'thin', fill=FILLC, closed=True)
    d = 1 if at == 'bottom' else -1
    if track:
        ay = oy - d * 24
        c.arrow(cx - d * 20, ay, cx + d * 36, ay, ACC, 'main')
        if v_label:
            c.text(cx + d * 44, ay, v_label, FST, anchor='start' if d > 0 else 'end', color=ACC)
    else:
        x0 = cx + d * 36
        c.arrow(x0, oy, x0 + d * 56, oy, ACC, 'main')
        if v_label:
            c.text(x0 + d * 28, oy + (20 if at == 'bottom' else -20), v_label, FST, color=ACC)
    return c.done(title, desc)


def swing(title, desc, L_label=None, v_label=None, release=None, bob='seat', w=None, h=300):
    """A swing (or pendulum) at its lowest point; release=(L, h, h_label) also draws the start position,
    at the angle where it is h above the lowest point, with the height marked."""
    w = w or (430 if release else 340)
    c = Canvas(w, h)
    px, py = 150, 34
    ceiling(c, px - 70, px + 70, py)
    L = 200
    if release:
        Ld, hd, hl = release
        th = math.acos(1 - hd / Ld)
        bx, by = px + L * math.sin(th), py + L * math.cos(th)
        c.line(px, py, bx, by, MUT, 'thin', dash='5 4')
        c.circle(bx, by, 10, MUT, 'thin', fill='none', dash='3 2')
        c.path(f'M{r1(bx)},{r1(by)} A{L},{L} 0 0,1 {r1(px)},{r1(py + L)}', MUT, 'thin', dash='3 3')
        xd = bx + 32
        c.line(bx + 14, by, xd + 6, by, MUT, 'thin', dash='3 3')
        c.line(px + 14, py + L, xd + 6, py + L, MUT, 'thin', dash='3 3')
        c.dim(xd, by, xd, py + L, hl, side=1)
    c.line(px, py, px, py + L, INK, 'main')
    if bob == 'seat':
        c.rect(px - 22, py + L - 3, 44, 7, ACC2, 'main', fill=FILLC, rx=2)
        c.line(px - 18, py + L - 3, px, py, INK, 'thin')
        c.line(px + 18, py + L - 3, px, py, INK, 'thin')
    else:
        c.circle(px, py + L, 10, ACC2, 'main', fill=FILLC)
    if L_label:
        c.text(px - 26, py + L * 0.45, L_label, FST, anchor='end')
    if v_label:
        c.arrow(px - 30, py + L + 26, px + 30, py + L + 26, ACC, 'main')
        c.text(px + 40, py + L + 26, v_label, FST, anchor='start', color=ACC)
    return c.done(title, desc)


def road_profile(title, desc, kind='hump', r_label=None, v_label=None, w=420, h=250):
    """Side view of a road over a hump (or through a dip, or a hump then a dip) made of circular arcs, with
    the arc centre and radius marked and a car at the top of the hump (or bottom of the dip)."""
    c = Canvas(w, h)

    def car(x, y_road, up=True):
        c.rect(x - 26, y_road - 26, 52, 18, ACC2, 'main', fill=FILLC, rx=4)
        c.circle(x - 15, y_road - 6, 5.5, ACC2, 'main', fill=FILLC)
        c.circle(x + 15, y_road - 6, 5.5, ACC2, 'main', fill=FILLC)

    th = math.radians(36)
    if kind in ('hump', 'dip'):
        R = 150
        cx = w / 2
        if kind == 'hump':
            top = 70
            cy = top + R
            p0, p1 = (cx - R * math.sin(th), cy - R * math.cos(th)), (cx + R * math.sin(th), cy - R * math.cos(th))
            c.path(f'M{r1(p0[0])},{r1(p0[1])} A{R},{R} 0 0,1 {r1(p1[0])},{r1(p1[1])}', INK, 'bold')
            car(cx, top)
            c.line(cx, top, cx, cy, MUT, 'thin', dash='4 3')
            c.dot(cx, cy, 3)
            c.text(cx + 8, cy - 10, 'centre', FST, anchor='start', color=MUT, value=False)
            if r_label:
                c.text(cx + 8, (top + cy) / 2 + 10, r_label, FST, anchor='start')
            vy = top - 44
        else:
            bot = h - 40
            cy = bot - R
            p0, p1 = (cx - R * math.sin(th), cy + R * math.cos(th)), (cx + R * math.sin(th), cy + R * math.cos(th))
            c.path(f'M{r1(p0[0])},{r1(p0[1])} A{R},{R} 0 0,0 {r1(p1[0])},{r1(p1[1])}', INK, 'bold')
            car(cx, bot)
            c.line(cx, bot - 28, cx, max(cy, 14), MUT, 'thin', dash='4 3')
            if cy > 10:
                c.dot(cx, cy, 3)
            if r_label:
                c.text(cx + 8, (bot - 28 + max(cy, 14)) / 2, r_label, FST, anchor='start')
            vy = bot - 44
        if v_label:
            c.arrow(cx + 40, vy, cx + 96, vy, ACC, 'main')
            c.text(cx + 104, vy, v_label, FST, anchor='start', color=ACC)
        return c.done(title, desc)
    # hump then dip, joined by a straight piece tangent to both
    R = 105
    hx, top = 110, 66
    s, co = math.sin(th), math.cos(th)
    dx = 300
    gap = dx - 2 * R * s
    bot = top + 2 * R * (1 - co) + gap * math.tan(th)
    dxc = hx + dx
    hc, dc = (hx, top + R), (dxc, bot - R)
    a0 = (hx - R * s, top + R * (1 - co))
    a1 = (hx + R * s, top + R * (1 - co))
    b0 = (dxc - R * s, bot - R * (1 - co))
    b1 = (dxc + R * s, bot - R * (1 - co))
    c.path(f'M{r1(a0[0])},{r1(a0[1])} A{R},{R} 0 0,1 {r1(a1[0])},{r1(a1[1])} L{r1(b0[0])},{r1(b0[1])} A{R},{R} 0 0,0 {r1(b1[0])},{r1(b1[1])}', INK, 'bold')
    car(hx, top)
    c.line(hx, top, *hc, MUT, 'thin', dash='4 3')
    c.dot(*hc, 3)
    c.line(dxc, bot, *dc, MUT, 'thin', dash='4 3')
    c.dot(*dc, 3)
    if r_label:
        c.text(hx + 8, (top + hc[1]) / 2 + 8, r_label, FST, anchor='start')
        c.text(dxc - 8, (bot + dc[1]) / 2, r_label, FST, anchor='end')
    c.text(hx, top + R + 16, 'hump centre', FST, color=MUT, value=False)
    c.text(dxc, dc[1] - 14, 'dip centre', FST, color=MUT, value=False)
    if v_label:
        c.arrow(hx + 36, top - 44, hx + 92, top - 44, ACC, 'main')
        c.text(hx + 100, top - 44, v_label, FST, anchor='start', color=ACC)
    return c.done(title, desc)


def banked_track(title, desc, angle, angle_label, r_label=None, w=400, h=250):
    """Cross-section of a banked bend: the surface rises at `angle` (degrees) towards the outside of the
    bend; a vehicle sits on it; the centre of the bend is to the left."""
    c = Canvas(w, h)
    x0, y0 = 50, h - 36
    th = math.radians(angle)
    L = min(310, 150 / math.sin(th))
    ex, ey = x0 + L * math.cos(th), y0 - L * math.sin(th)
    c.poly([(x0, y0), (ex, ey), (ex, y0)], INK, 'main', fill=FILLC, closed=True)
    c.line(x0 - 20, y0, ex + 20, y0, MUT, 'thin')
    ra = 44 if angle >= 20 else 80
    a0, a1 = _pt(x0, y0, ra, 0), _pt(x0, y0, ra, angle)
    c.path(f'M{r1(a0[0])},{r1(a0[1])} A{ra},{ra} 0 0,0 {r1(a1[0])},{r1(a1[1])}', INK, 'thin')
    if angle >= 20:
        lx, ly = _pt(x0, y0, 60, angle / 2)
        c.text(lx, ly, angle_label, FST)
    else:
        lx, ly = _pt(x0, y0, 100, angle / 2)
        c.text(lx, ly, angle_label, FST, anchor='start')
    u = (math.cos(th), -math.sin(th))
    n = (-math.sin(th), -math.cos(th))
    sB = 0.6 * L
    B = (x0 + sB * u[0], y0 + sB * u[1])
    P = lambda a, b: (B[0] + a * u[0] + b * n[0], B[1] + a * u[1] + b * n[1])  # noqa: E731
    c.poly([P(-34, 8), P(34, 8), P(34, 30), P(-34, 30)], ACC2, 'main', fill=FILLC, closed=True)
    for a in (-21, 21):
        q = P(a, 5)
        c.circle(q[0], q[1], 5, ACC2, 'main', fill=FILLC)
    ya = 34
    c.arrow(min(ex, w - 40) - 20, ya, 60, ya, MUT, 'axis', head=8)
    c.text(64, ya - 14, 'towards centre of bend', FST, anchor='start', color=MUT, value=False)
    if r_label:
        c.text(64, ya + 16, r_label, FST, anchor='start')
    return c.done(title, desc)


def conical(title, desc, L_label, angle, angle_label, r_label='r', w=330, h=290):
    """Conical pendulum: string of length L at `angle` to the vertical, bob moving in a horizontal circle."""
    c = Canvas(w, h)
    px, py = 130, 34
    ceiling(c, px - 60, px + 60, py)
    L = 190
    th = math.radians(angle)
    bx, by = px + L * math.sin(th), py + L * math.cos(th)
    rx = L * math.sin(th)
    ry = 0.2 * rx
    c.path(f'M{r1(px - rx)},{r1(by)} A{r1(rx)},{r1(ry)} 0 1,0 {r1(px + rx)},{r1(by)} A{r1(rx)},{r1(ry)} 0 1,0 {r1(px - rx)},{r1(by)}', MUT, 'thin', dash='5 4')
    c.line(px, py, px, by + ry + 14, MUT, 'thin', dash='4 3')
    c.line(px, py, bx, by, INK, 'main')
    c.line(px, by, bx, by, ACC, 'thin', dash='3 3')
    c.text((px + bx) / 2, by - 11, r_label, FST, italic=True, color=ACC, value=False)
    c.circle(bx, by, 10, ACC2, 'main', fill=FILLC)
    p0 = (px, py + 44)
    p1 = (px + 44 * math.sin(th), py + 44 * math.cos(th))
    c.path(f'M{r1(p0[0])},{r1(p0[1])} A44,44 0 0,0 {r1(p1[0])},{r1(p1[1])}', INK, 'thin')
    c.text(px + 72 * math.sin(th / 2), py + 72 * math.cos(th / 2), angle_label, FST)
    mx, my = (px + bx) / 2, (py + by) / 2
    c.text(mx + 12 * math.cos(th), my - 12 * math.sin(th), L_label, FST, anchor='start')
    return c.done(title, desc)


def turntable(title, desc, radii, labels, spring=False, w=340, h=280):
    """Top view: a turntable (or, with spring=True, a mass whirled on a spring round a peg on a smooth table)
    with objects at the given radii; the first is drawn solid, any others dashed."""
    c = Canvas(w, h)
    cx, cy, R = 150, h / 2, 110
    sc = 0.78 * R / max(radii)
    if spring:
        c.circle(cx, cy, radii[0] * sc, MUT, 'thin', dash='5 4')
        c.circle(cx, cy, 5, INK, 'main', fill=MUT)
        c.text(cx - 10, cy - 12, 'peg', FST, anchor='end', value=False)
        zigzag(c, cx + 5, cy, cx + radii[0] * sc - 10, cy, n=9, amp=6)
    else:
        c.circle(cx, cy, R, INK, 'main', fill=FILLC)
        c.dot(cx, cy, 3)
    rot_arrow(c, cx, cy, (radii[0] * sc if spring else R) + 14, 25, 70)
    for k, (r, lab) in enumerate(zip(radii, labels)):
        x = cx + r * sc
        if spring:
            c.circle(x, cy, 10, ACC2, 'main', fill=FILLC)
        else:
            c.rect(x - 8, cy - 8, 16, 16, ACC2, 'main' if k == 0 else 'thin', fill=FILLC if k == 0 else 'none', dash=None if k == 0 else '3 2')
        yd = cy + 26 + 26 * k if not spring else cy + 26
        c.line(x, cy + 10, x, yd + 4, MUT, 'thin', dash='2 2')
        c.dim(cx, yd, x, yd, lab, side=-1)
    return c.done(title, desc)


def rotor(title, desc, r_label, w=340, h=300):
    """Side view of a rotor ride: a vertical cylinder spinning about its axis, a rider pressed against the wall."""
    c = Canvas(w, h)
    cx, top, bot, rx, ry = 160, 54, 240, 110, 18
    c.path(f'M{cx - rx},{top} A{rx},{ry} 0 1,0 {cx + rx},{top} A{rx},{ry} 0 1,0 {cx - rx},{top}', INK, 'main')
    c.line(cx - rx, top, cx - rx, bot, INK, 'main')
    c.line(cx + rx, top, cx + rx, bot, INK, 'main')
    c.path(f'M{cx - rx},{bot} A{rx},{ry} 0 0,0 {cx + rx},{bot}', INK, 'main')
    c.path(f'M{cx - rx},{bot} A{rx},{ry} 0 0,1 {cx + rx},{bot}', MUT, 'thin', dash='4 3')
    c.line(cx, top - 30, cx, bot + 30, MUT, 'thin', dash='6 4')
    rot_arrow(c, cx, top, rx - 20, 200, 330, ry=ry - 6)
    x = cx + rx - 12
    c.circle(x, 112, 9, ACC2, 'main', fill=FILLC)
    c.rect(x - 9, 124, 18, 62, ACC2, 'main', fill=FILLC, rx=6)
    c.text(x - 18, 150, 'rider', FST, anchor='end', color=ACC2, value=False)
    c.dim(cx, 214, cx + rx, 214, r_label, side=1)
    c.text(cx, bot + 40, 'floor drops away', FST, color=MUT, value=False)
    return c.done(title, desc)


def ring_station(title, desc, r_label, w=340, h=350):
    """A rotating ring space station (hub, spokes, ring) with an astronaut standing on the outer wall."""
    c = Canvas(w, h)
    cx, cy = w / 2, 164
    R1, R2 = 118, 142
    c.circle(cx, cy, R2, INK, 'main', fill=FILLC)
    c.circle(cx, cy, R1, INK, 'main', fill='none')
    c.circle(cx, cy, 16, INK, 'main', fill='none')
    for a in (45, 135, 225, 315):
        p0, p1 = _pt(cx, cy, 16, a), _pt(cx, cy, R1, a)
        c.line(*p0, *p1, INK, 'axis')
    fx, fy = cx, cy + R2
    c.line(fx, fy - 2, fx, fy - 12, ACC2, 'main')
    c.line(fx, fy - 12, fx, fy - 20, ACC2, 'main')
    c.circle(fx, fy - 24, 3.5, ACC2, 'main', fill=FILLC)
    c.text(fx + 8, fy + 14, 'astronaut', FST, anchor='start', color=ACC2, value=False)
    c.dot(cx, cy, 2.6)
    c.dim(cx, cy, cx + R2, cy, r_label, side=1)
    rot_arrow(c, cx, cy, R2 + 10, 100, 150)
    return c.done(title, desc)


# ═════════════════════════ quantum physics ═════════════════════════

def photocell(title, desc, meter='µA', reverse=False, light_label=None, supply_label=None, w=380, h=250):
    """A vacuum photocell (curved cathode, rod anode) lit from above, in series with a meter and a cell.
    reverse=True connects the cell so the anode is negative (for stopping-potential measurements)."""
    c = Canvas(w, h)
    cx, cy, r = 175, 104, 56
    c.circle(cx, cy, r, INK, 'axis')
    c.path(f'M150,{cy - 30} A40,40 0 0,0 150,{cy + 30}', INK, 'bold')
    xl = 150 - (40 - math.sqrt(40 ** 2 - 30 ** 2))
    c.line(205, cy - 12, 205, cy + 12, INK, 'bold')
    c.text(128, 34, 'cathode', FST, anchor='end', value=False)
    c.text(205, cy + 28, 'anode', FST, value=False)
    for (x0, y0), (x1, y1) in (((205, 14), (153, cy - 24)), ((222, 24), (155, cy - 10)), ((239, 34), (157, cy + 4))):
        c.arrow(x0, y0, x1, y1, ACC2, 'thin', head=7)
    if light_label:
        c.text(246, 16, light_label, FST, anchor='start', color=ACC2)
    xL, xR, yb = 50, 310, h - 26
    c.line(xl, cy, xL, cy, INK, 'main')
    c.line(205, cy, xR, cy, INK, 'main')
    vcomp(c, 'A', xR, cy, yb, meter, value=False)
    ycell = (cy + yb) / 2
    c.line(xL, cy, xL, ycell - 5, INK, 'main')
    c.line(xL, ycell + 5, xL, yb, INK, 'main')
    long_y, short_y = (ycell - 5, ycell + 5) if reverse else (ycell + 5, ycell - 5)
    c.line(xL - 13, long_y, xL + 13, long_y, INK, 'main')
    c.line(xL - 7, short_y, xL + 7, short_y, INK, 'bold')
    if supply_label:
        c.text(xL + 20, ycell, supply_label, FST, anchor='start', value=False)
    c.line(xL, yb, xR, yb, INK, 'main')
    return c.done(title, desc)


def mirror_rays(title, desc, angle, angle_label, w=360, h=230):
    """A light beam reflecting from a plane mirror at `angle` to the normal, with the normal dashed."""
    c = Canvas(w, h)
    x0, y0 = w / 2, h - 50
    c.line(x0 - 140, y0, x0 + 140, y0, INK, 'bold')
    for x in range(int(x0 - 136), int(x0 + 140), 12):
        c.line(x, y0 + 2, x - 8, y0 + 10, INK, 'thin')
    c.line(x0, y0, x0, 24, MUT, 'thin', dash='5 4')
    c.text(x0, 14, 'normal', FST, color=MUT, value=False)
    a = math.radians(angle)
    L = 150
    p_in = (x0 - L * math.sin(a), y0 - L * math.cos(a))
    p_out = (x0 + L * math.sin(a), y0 - L * math.cos(a))
    c.arrow(*p_in, x0 - 0.45 * L * math.sin(a), y0 - 0.45 * L * math.cos(a), ACC2, 'main')
    c.line(x0 - 0.45 * L * math.sin(a), y0 - 0.45 * L * math.cos(a), x0, y0, ACC2, 'main')
    c.arrow(x0, y0, *p_out, ACC2, 'main')
    for s in (-1, 1):
        q0 = (x0, y0 - 46)
        q1 = (x0 + s * 46 * math.sin(a), y0 - 46 * math.cos(a))
        c.path(f'M{r1(q0[0])},{r1(q0[1])} A46,46 0 0,{1 if s > 0 else 0} {r1(q1[0])},{r1(q1[1])}', INK, 'thin')
        m = (x0 + s * 62 * math.sin(a / 2), y0 - 62 * math.cos(a / 2))
        c.text(*m, angle_label, FST)
    c.text(p_in[0] - 6, p_in[1] - 10, 'incident beam', FST, anchor='middle', color=ACC2, value=False)
    c.text(p_out[0] + 6, p_out[1] - 10, 'reflected beam', FST, anchor='middle', color=ACC2, value=False)
    return c.done(title, desc)


# ═════════════════════════ optics: slits, gratings, spectra ═════════════════════════

def double_slit(title, desc, a_label=None, D_label=None, x_label=None, source='laser', w=440, h=250):
    """Two-slit interference: source on the left, double slit, screen with bright fringes on the right.
    a_label marks the slit separation, D_label the slit-to-screen distance, x_label the fringe spacing."""
    c = Canvas(w, h)
    yc = 116
    xb, xs = 150, 382
    c.rect(18, yc - 12, 56, 24, INK, 'main', fill=FILLC, rx=3)
    c.text(46, yc + 26, source, FST, value=False)
    c.line(74, yc, xb, yc, ACC2, 'main')
    g = 9
    c.line(xb, 34, xb, yc - g - 4, INK, 'bold')
    c.line(xb, yc - g + 4, xb, yc + g - 4, INK, 'bold')
    c.line(xb, yc + g + 4, xb, h - 50, INK, 'bold')
    c.line(xs, 30, xs, h - 46, INK, 'main')
    sp = 22
    for k in range(-4, 5):
        y = yc + k * sp
        hw = 7 - abs(k) * 0.8
        c.rect(xs + 3, y - hw / 2 - 2, 14, hw + 4, ACC, 'thin', fill=ACC if k == 0 else FILLC)
    for ys in (yc - g, yc + g):
        c.line(xb, ys, xs, yc, MUT, 'thin', dash='3 3')
    if a_label:
        c.text(xb + 10, yc - 30, a_label, FST, anchor='start')
        c.line(xb + 8, yc - 24, xb + 2, yc - g, MUT, 'thin')
    if D_label:
        c.dim(xb, h - 30, xs, h - 30, D_label, side=-1)
    if x_label:
        y1, y2 = yc + 2 * sp, yc + 3 * sp
        c.dim(xs - 10, y1, xs - 10, y2, x_label, side=-1)
    c.text(xb, 22, 'double slit', FST, value=False)
    c.text(xs, 18, 'screen', FST, value=False)
    return c.done(title, desc)


def grating(title, desc, orders, spacing_label=None, symmetric=True, angle_mark=None, w=420, h=280):
    """A diffraction grating lit normally from the left; orders: (n, angle_deg); angle_mark: (n, label)
    marks the angle of order n from the straight-through beam."""
    c = Canvas(w, h)
    xg, yc = 140, h / 2
    c.line(20, yc, xg, yc, ACC2, 'main')
    c.arrowhead(xg - 30, yc, 0, ACC2, 8)
    c.line(xg, 30, xg, h - 30, INK, 'bold')
    for y in range(36, int(h - 30), 8):
        c.line(xg - 4, y, xg + 4, y, INK, 'thin')
    L = w - xg - 62
    c.line(xg, yc, xg + L, yc, MUT, 'thin', dash='4 3')
    c.text(xg + L + 4, yc, 'n = 0', FST, anchor='start', value=False)
    for n, ang in orders:
        for s in ((1, -1) if symmetric else (1,)):
            a = math.radians(ang) * s
            Lb = min(L, (yc - 30) / max(abs(math.sin(a)), 1e-6))
            ex, ey = xg + Lb * math.cos(a), yc - Lb * math.sin(a)
            c.arrow(xg, yc, ex, ey, ACC, 'main', head=8)
            if s > 0:
                c.text(ex + 4, ey - 4, f'n = {n}', FST, anchor='start', value=False)
    if angle_mark:
        n, lab = angle_mark
        ang = dict(orders)[n]
        r = 70
        p1 = (xg + r * math.cos(math.radians(ang)), yc - r * math.sin(math.radians(ang)))
        c.path(f'M{r1(xg + r)},{r1(yc)} A{r},{r} 0 0,0 {r1(p1[0])},{r1(p1[1])}', INK, 'thin')
        if any(a2 < ang for _, a2 in orders):      # a lower order runs through the arc: label beyond the beam
            m = (xg + 92 * math.cos(math.radians(ang + 24)), yc - 92 * math.sin(math.radians(ang + 24)))
            c.text(m[0], m[1], lab, FST, anchor='start')
            q = (xg + (r + 2) * math.cos(math.radians(ang * 0.8)), yc - (r + 2) * math.sin(math.radians(ang * 0.8)))
            c.line(m[0] - 2, m[1] + 6, q[0], q[1], MUT, 'thin')
        else:
            m = (xg + (r + 16) * math.cos(math.radians(ang / 2)), yc - (r + 16) * math.sin(math.radians(ang / 2)))
            c.text(m[0], m[1], lab, FST, anchor='start')
    c.text(xg, 18, 'grating', FST, value=False)
    if spacing_label:
        c.text(xg, h - 14, spacing_label, FST)
    return c.done(title, desc)


def diffraction_tube(title, desc, V_label=None, L_label=None, r_label=None, w=460, h=250):
    """Electron diffraction tube (side view) with the ring pattern on the screen shown face-on beside it."""
    c = Canvas(w, h)
    yc = 110
    c.rect(20, yc - 16, 70, 32, INK, 'main', fill=FILLC, rx=4)
    c.text(55, yc + 30, 'electron gun', FST, value=False)
    if V_label:
        c.text(55, yc - 28, V_label, FST)
    c.line(90, yc - 10, 150, yc - 14, INK, 'axis')
    c.line(90, yc + 10, 150, yc + 14, INK, 'axis')
    c.path(f'M150,{yc - 14} A80,80 0 1,1 150,{yc + 14}', INK, 'axis')
    c.line(90, yc, 170, yc, ACC2, 'main')
    c.line(170, yc - 12, 170, yc + 12, INK, 'bold')
    c.text(170, yc + 72, 'graphite', FST, value=False)
    c.line(170, yc + 60, 170, yc + 16, MUT, 'thin')
    xs = 300
    for s in (-1, 1):
        c.line(170, yc, xs, yc + s * 36, ACC, 'thin')
    c.line(170, yc, xs, yc, MUT, 'thin', dash='3 3')
    c.line(xs, yc - 60, xs, yc + 60, ACC, 'bold')
    c.text(xs + 8, yc - 66, 'screen', FST, anchor='start', value=False)
    if L_label:
        c.dim(170, h - 22, xs, h - 22, L_label, side=-1)
    cx2, r1_, r2_ = 400, 22, 36
    c.circle(cx2, yc, 46, INK, 'thin', fill=FILLC)
    c.circle(cx2, yc, r1_, ACC, 'main')
    c.circle(cx2, yc, r2_, ACC, 'main')
    c.dot(cx2, yc, 3, ACC)
    c.text(cx2, yc - 60, 'screen, face on', FST, value=False)
    if r_label:
        c.line(cx2, yc, cx2 + r2_, yc, INK, 'axis')
        c.text(cx2, yc + 62, f'ring radius {r_label}', FST)
    return c.done(title, desc)


def point_source(title, desc, r_label, detector_label=None, power_label=None, w=380, h=240):
    """A point source radiating equally in all directions; a sphere of radius r through a small detector."""
    c = Canvas(w, h)
    sx, sy = 70, h / 2
    R = 230
    c.path(f'M{r1(sx + R * math.cos(math.radians(-30)))},{r1(sy - R * math.sin(math.radians(-30)))} A{R},{R} 0 0,0 {r1(sx + R * math.cos(math.radians(30)))},{r1(sy - R * math.sin(math.radians(30)))}', MUT, 'thin', dash='5 4')
    for a in (-24, -12, 0, 12, 24):
        ex, ey = sx + 60 * math.cos(math.radians(a)), sy - 60 * math.sin(math.radians(a))
        c.arrow(sx + 14 * math.cos(math.radians(a)), sy - 14 * math.sin(math.radians(a)), ex, ey, ACC2, 'thin', head=6)
    c.circle(sx, sy, 8, ACC2, 'main', fill=FILLC)
    if power_label:
        c.text(sx, sy + 26, power_label, FST)
    dx = sx + R
    c.rect(dx - 4, sy - 10, 10, 20, INK, 'main', fill=FILLC)
    if detector_label:
        c.text(dx - 10, sy - 22, detector_label, FST, anchor='end')
    c.dim(sx, sy + 46, dx, sy + 46, r_label, side=-1)
    return c.done(title, desc)


def spectrum_lines(title, desc, lines, lo, hi, ticks, absorption=False, w=440, h=150):
    """A spectrum strip with lines at the given wavelengths (nm): lines = (nm, label or None)."""
    c = Canvas(w, h)
    x0, x1, y0, y1 = 40, w - 30, 40, 90
    X = lambda v: x0 + (v - lo) / (hi - lo) * (x1 - x0)  # noqa: E731
    c.rect(x0, y0, x1 - x0, y1 - y0, INK, 'thin', fill=FILLC if absorption else 'none')
    for nm, lab in lines:
        c.line(X(nm), y0, X(nm), y1, INK if absorption else ACC, 'bold')
        if lab:
            c.text(X(nm), y0 - 12, lab, FST)
    c.line(x0, y1 + 12, x1, y1 + 12, INK, 'axis')
    for t in ticks:
        v, lab = t if isinstance(t, tuple) else (t, fmt(t))
        c.line(X(v), y1 + 12, X(v), y1 + 17, INK, 'thin')
        c.text(X(v), y1 + 28, lab, FST, value=False)
    c.text((x0 + x1) / 2, h - 10, 'wavelength / nm', FST, value=False)
    return c.done(title, desc)



# ═════════════════════════ astronomy ═════════════════════════

def _star(c, x, y, r=9, color=None):
    col = color or ACC2
    for k in range(8):
        a = k * math.pi / 4
        c.line(x + (r + 3) * math.cos(a), y + (r + 3) * math.sin(a), x + (r + 8) * math.cos(a), y + (r + 8) * math.sin(a), col, 'thin')
    c.circle(x, y, r, col, 'main', fill=FILLC)


def _galaxy(c, x, y, rx=16, ry=7):
    c.path(f'M{r1(x - rx)},{r1(y)} A{rx},{ry} 0 1,0 {r1(x + rx)},{r1(y)} A{rx},{ry} 0 1,0 {r1(x - rx)},{r1(y)}', ACC2, 'main', fill=FILLC)
    c.circle(x, y, 3, ACC2, 'main', fill=ACC2)


def star_line(title, desc, bodies, dims=(), w=460, h=190, note=None):
    """Bodies along a line of sight. bodies: dict(x (data units, any scale), kind 'star'|'sun'|'planet'|'earth'|'galaxy',
    label, sub, value). dims: (i, j, label, value) dimension arrows between bodies i and j, stacked below the line."""
    c = Canvas(w, h)
    xs = [b['x'] for b in bodies]
    lo, hi = min(xs), max(xs)
    half = lambda b: max(text_w(b.get('label') or '', FST), text_w(b.get('sub') or '', FST)) / 2 + 8  # noqa: E731
    first, last = min(bodies, key=lambda b: b['x']), max(bodies, key=lambda b: b['x'])
    x0, x1, y = max(46, half(first)), w - max(46, half(last)), 62
    X = lambda v: x0 + (v - lo) / (hi - lo) * (x1 - x0)  # noqa: E731
    c.line(x0, y, x1, y, GRID, 'thin', dash='5 4')
    for b in bodies:
        bx, kind = X(b['x']), b.get('kind', 'star')
        if kind in ('star', 'sun'):
            _star(c, bx, y, 10 if kind == 'sun' else 8)
        elif kind == 'galaxy':
            _galaxy(c, bx, y)
        else:
            c.circle(bx, y, 6 if kind == 'earth' else 5, INK, 'main', fill=FILLC)
        if b.get('label'):
            c.text(bx, y - 30, b['label'], FST, weight=600, value=b.get('value'))
        if b.get('sub'):
            c.text(bx, y + 28, b['sub'], FST, value=b.get('value'))
    for k, (i, j, lab, isv) in enumerate(dims):
        yy = y + 54 + 30 * k
        c.dim(X(bodies[i]['x']), yy, X(bodies[j]['x']), yy, lab, side=-1, value=isv)
        for idx in (i, j):
            c.line(X(bodies[idx]['x']), y + 12, X(bodies[idx]['x']), yy + 4, GRID, 'thin', dash='2 3')
    if note:
        c.text(w - 8, h - 8, note, FST, anchor='end', color=MUT, value=False)
    return c.done(title, desc)


def _planck(lam, T):
    h_, c_, k_ = 6.626e-34, 3.00e8, 1.381e-23
    x = h_ * c_ / (lam * k_ * T)
    if x > 700:
        return 0.0
    return 2 * h_ * c_ ** 2 / lam ** 5 / math.expm1(x)


def blackbody(title, desc, curves, lam_hi, unit='nm', lam_lo=0.0, peaks=(), w=420, h=290, xticks=None, visible=False,
              equal_power=False):
    """Black-body spectra: curves = (T, label or None, is_value). Intensity is relative (tallest peak = 1).
    peaks: (lambda in `unit`, label, is_value) vertical markers. equal_power scales each curve by 1/T⁴ so the areas
    match (stars of equal luminosity)."""
    f = {'nm': 1e-9, 'µm': 1e-6, 'mm': 1e-3}[unit]
    data = []
    for T, lab, isv in curves:
        xs, ys = curve(lambda v: _planck(max(v, lam_hi * 1e-3) * f, T) / (T ** 4 if equal_power else 1), lam_lo, lam_hi, 240)
        data.append((xs, ys, T, lab, isv))
    top = max(max(d[1]) for d in data)
    series, notes, legend = [], [], []
    for k, (xs, ys, T, lab, isv) in enumerate(data):
        yn = [v / top for v in ys]
        col, dash = (ACC, None) if k == 0 else (ACC2, '6 4')
        series.append(dict(x=xs, y=yn, color=col, dash=dash))
        if lab:
            legend.append((lab, col, dash))
    vl = [(v, lab, isv) for v, lab, isv in peaks]
    if visible:
        series.insert(0, dict(x=[400, 700, 700, 400], y=[0, 0, 1.12, 1.12], kind='area'))
        notes.append((550, 0, 'visible', 'middle', 0, -9, False))
    return plot(f'wavelength λ / {unit}', 'intensity (relative)', series, title, desc, xr=(lam_lo, lam_hi), yr=(0, 1.15),
                w=w, h=h, notes=notes, vlines=vl, xticks=xticks, yticks=[0, 0.5, 1.0], ytl=[(0, '0'), (0.5, ''), (1.0, '')],
                legend=legend or None)


def redshift_strips(title, desc, lab, obs, lo, hi, ticks, w=460, h=214, names=('laboratory', 'galaxy')):
    """Two spectrum strips: laboratory lines (top) and the same lines observed from a moving source (bottom).
    lab, obs: lists of (nm, label or None). Dashed links join each pair."""
    c = Canvas(w, h)
    x0, x1 = 104, w - 24
    X = lambda v: x0 + (v - lo) / (hi - lo) * (x1 - x0)  # noqa: E731
    s1, s2 = (34, 66), (106, 138)
    for (ya, yb), name in zip((s1, s2), names):
        c.rect(x0, ya, x1 - x0, yb - ya, INK, 'thin')
        c.text(x0 - 10, (ya + yb) / 2, name, FST, anchor='end', value=False)
    for (nm, t) in lab:
        c.line(X(nm), s1[0], X(nm), s1[1], ACC, 'bold')
        if t:
            c.text(X(nm), s1[0] - 12, t, FST)
    for (nm, t) in obs:
        c.line(X(nm), s2[0], X(nm), s2[1], ACC, 'bold')
        if t:
            c.text(X(nm), s2[1] + 13, t, FST)
    for (a, _), (b, _) in zip(lab, obs):
        c.line(X(a), s1[1], X(b), s2[0], MUT, 'thin', dash='4 3')
    ya = s2[1] + 30
    c.line(x0, ya, x1, ya, INK, 'axis')
    for t in ticks:
        c.line(X(t), ya, X(t), ya + 5, INK, 'thin')
        c.text(X(t), ya + 16, fmt(t), FST, value=False)
    c.text((x0 + x1) / 2, h - 8, 'wavelength / nm', FST, value=False)
    return c.done(title, desc)

# ═════════════════════════ nuclear physics ═════════════════════════

def nz_chart(title, desc, points, nr, zr, nticks, zticks, arrows=(), w=400, h=300):
    """Proton number Z against neutron number N with labelled nuclides: points = (N, Z, label)."""
    series = [dict(x=[p[0]], y=[p[1]], kind='points') for p in points]
    notes = [(p[0], p[1], p[2], 'start', 8, -10, False) for p in points]
    extra = [dict(x=[a[0], a[2]], y=[a[1], a[3]], color=MUT, dash='4 3') for a in arrows]
    return plot('neutron number N', 'proton number Z', series + extra, title, desc, xr=nr, yr=zr, xticks=nticks, yticks=zticks,
                notes=notes, w=w, h=h)


def decay_recoil(title, desc, left='daughter', right='α-particle', v_left=None, v_right=None, parent='parent at rest', w=420, h=200):
    """Before/after sketch of a decay at rest: a parent nucleus, then the daughter and the emitted particle
    moving apart along a line with velocity arrows."""
    c = Canvas(w, h)
    c.text(w / 2, 18, 'before', FST, color=MUT, value=False)
    c.circle(w / 2, 50, 18, INK, 'main', fill=FILLC)
    c.text(w / 2 + 28, 50, parent, FST, anchor='start', value=False)
    c.line(20, 86, w - 20, 86, GRID, 'thin', dash='4 3')
    c.text(w / 2, 104, 'after', FST, color=MUT, value=False)
    yd = 146
    c.circle(w / 2 - 40, yd, 16, INK, 'main', fill=FILLC)
    c.circle(w / 2 + 40, yd, 7, ACC2, 'main', fill=FILLC)
    c.arrow(w / 2 - 62, yd, w / 2 - 102, yd, INK, 'main')
    c.arrow(w / 2 + 52, yd, w / 2 + 132, yd, ACC2, 'main')
    c.text(w / 2 - 40, yd + 30, left, FST, value=False)
    c.text(w / 2 + 40, yd + 30, right, FST, color=ACC2, value=False)
    if v_left:
        c.text(w / 2 - 82, yd - 14, v_left, FST, anchor='middle')
    if v_right:
        c.text(w / 2 + 92, yd - 14, v_right, FST, anchor='middle', color=ACC2)
    return c.done(title, desc)


def _be_per_nucleon(A):
    """Binding energy per nucleon (MeV) from the semi-empirical mass formula along the line of stability."""
    Z = A / (1.98 + 0.0155 * A ** (2 / 3))
    av, as_, ac, aa = 15.75, 17.8, 0.711, 23.7
    B = av * A - as_ * A ** (2 / 3) - ac * Z * (Z - 1) / A ** (1 / 3) - aa * (A - 2 * Z) ** 2 / A
    return B / A


def be_curve(title, desc, marks=(), w=420, h=300, light=True):
    """Binding energy per nucleon against nucleon number: a smooth curve from the semi-empirical formula
    (A ≥ 12) joined to measured values for the lightest nuclei; marks = (A, BE/A, label, is_value)."""
    known = [(2, 1.11), (3, 2.57), (4, 7.07), (6, 5.33), (7, 5.61), (9, 6.46), (12, 7.68)]
    xs = [a for a, _ in known] if light else []
    ys = [b for _, b in known] if light else []
    xs += list(range(14, 241, 2))
    ys += [_be_per_nucleon(a) for a in range(14, 241, 2)]
    series = [dict(x=xs, y=ys)]
    notes = []
    for A, b, lab, isv in marks:
        series.append(dict(x=[A], y=[b], kind='points', color=ACC2))
        notes.append((A, b, lab, 'start' if A < 200 else 'end', 6 if A < 200 else -6, 16, isv))
    return plot('nucleon number A', 'BE per nucleon / MeV', series, title, desc, xr=(0, 250), yr=(0, 10),
                xticks=[0, 50, 100, 150, 200, 250], yticks=[0, 2, 4, 6, 8, 10], notes=notes, w=w, h=h)


def gm_setup(title, desc, d_label=None, w=420, h=200):
    """A radioactive source in a holder facing the window of a GM tube, wired to a counter."""
    c = Canvas(w, h)
    y = 90
    c.rect(30, y - 30, 14, 60, INK, 'main', fill=FILLC)
    c.rect(44, y - 8, 16, 16, ACC2, 'main', fill=FILLC)
    c.text(52, y + 46, 'source', FST, value=False)
    gx = 200
    c.rect(gx, y - 16, 110, 32, INK, 'main', fill=FILLC, rx=6)
    c.line(gx, y - 16, gx, y + 16, ACC, 'bold')
    c.text(gx + 55, y + 34, 'GM tube', FST, value=False)
    c.line(gx + 110, y, gx + 130, y, INK, 'main')
    c.path(f'M{gx + 130},{y} C{gx + 150},{y} {gx + 150},{y + 50} {gx + 170},{y + 50}', INK, 'main')
    c.rect(gx + 170, y + 30, 40, 40, INK, 'main', fill=FILLC, rx=4)
    c.text(gx + 190, y + 86, 'counter', FST, value=False)
    if d_label:
        c.dim(60, y - 44, gx, y - 44, d_label, side=1)
    return c.done(title, desc)


# ═════════════════════════ medical physics ═════════════════════════

def xray_tube(title, desc, V_label=None, I_label=None, w=440, h=230):
    """X-ray tube: heated cathode filament, electron beam to an angled tungsten target on the anode,
    X-rays leaving through a window; evacuated glass envelope."""
    c = Canvas(w, h)
    yc = 100
    c.rect(40, yc - 50, 330, 100, INK, 'axis', rx=40)
    c.text(56, yc - 38, 'vacuum', FST, color=MUT, anchor='start', value=False)
    c.path(f'M80,{yc - 10} q5,-10 10,0 t10,0 t10,0', INK, 'main')
    c.line(80, yc - 10, 60, yc - 10, INK, 'main')
    c.line(110, yc - 10, 120, yc - 20, INK, 'thin')
    c.text(95, yc + 22, 'cathode', FST, value=False)
    c.poly([(290, yc - 30), (330, yc - 30), (330, yc + 30), (290, yc + 10)], INK, 'main', fill=FILLC, closed=True)
    c.line(330, yc, 385, yc, INK, 'bold')
    c.text(318, yc - 42, 'anode (tungsten target)', FST, value=False)
    for dy in (-12, 0, 12):
        c.arrow(115, yc + dy * 0.3, 284, yc - 4 + dy * 0.6, ACC, 'thin', head=6)
    c.text(200, yc + 20, 'electrons', FST, color=ACC, value=False)
    for dx in (-14, 0, 14):
        c.arrow(296 + dx, yc + 6, 286 + dx * 1.6, h - 22, ACC2, 'thin', head=7)
    c.line(262, yc + 50, 318, yc + 50, ACC2, 'main')
    c.text(345, h - 20, 'X-rays', FST, color=ACC2, anchor='start', value=False)
    if V_label:
        c.text(205, 22, V_label, FST)
        c.line(60, yc - 10, 60, 22, INK, 'thin')
        c.line(60, 22, 160, 22, INK, 'thin')
        c.line(250, 22, 385, 22, INK, 'thin')
        c.line(385, 22, 385, yc, INK, 'thin')
    if I_label:
        c.text(205, 40, I_label, FST, color=MUT)
    return c.done(title, desc)


def xray_spectrum(title, desc, kv, lines=(0.0209, 0.0184), w=420, h=280, compare=None):
    """Relative intensity against wavelength for a tungsten-target tube at kv kilovolts (Kramers-type
    continuum from the cut-off λ = hc/eV, with two characteristic lines); compare = second kV to overlay."""
    def curve(kv_):
        lmin = 6.63e-34 * 3.00e8 / (1.60e-19 * kv_ * 1e3) * 1e9
        xs = [lmin + (0.12 - lmin) * i / 300 for i in range(301)]
        ys = [7.7e-4 * max(0.0, (x / lmin - 1)) / x ** 2 for x in xs]   # Kramers' law, same tube current
        if kv_ >= 70:                    # tungsten K lines need electrons above the 69.5 keV K-shell energy
            for L in lines:
                for i, x in enumerate(xs):
                    ys[i] += 1.2 * math.exp(-((x - L) / 0.0005) ** 2)
        return [0.0, lmin] + xs, [0.0, 0.0] + ys, lmin
    xs, ys, lmin = curve(kv)
    series = [dict(x=xs, y=ys)]
    if compare:
        x2, y2, _ = curve(compare)
        series.append(dict(x=x2, y=[v * 1.0 for v in y2], color=ACC2, dash='5 4'))
    return plot('λ / nm', 'relative intensity', series, title, desc, xr=(0, 0.12), yr=(0, 3.0),
                xticks=[0, 0.02, 0.04, 0.06, 0.08, 0.10, 0.12], yticks=[0, 1, 2, 3], w=w, h=h)


def layers(title, desc, items, w=440, h=200):
    """A beam crossing slabs side by side: items = (width_px, name, label)."""
    c = Canvas(w, h)
    x = 70
    y0, y1 = 50, 140
    c.arrow(14, (y0 + y1) / 2, x - 4, (y0 + y1) / 2, ACC2, 'main')
    c.text(14, (y0 + y1) / 2 - 16, 'I₀', FST, anchor='start', color=ACC2, value=False)
    for wd, name, lab in items:
        fill = FILLC if 'bone' not in name else MUT
        c.rect(x, y0, wd, y1 - y0, INK, 'main', fill=fill)
        c.text(x + wd / 2, y0 - 14, name, FST, value=False)
        if lab:
            c.text(x + wd / 2, y1 + 18, lab, FST)
        x += wd
    c.arrow(x + 4, (y0 + y1) / 2, x + 50, (y0 + y1) / 2, ACC2, 'main')
    c.text(x + 56, (y0 + y1) / 2, 'I', FST, anchor='start', color=ACC2, value=False)
    return c.done(title, desc)


def penumbra(title, desc, spot_label=None, a_label=None, b_label=None, w=460, h=300):
    """Geometric unsharpness: a focal spot of finite width, an object edge, and the blurred region
    (penumbra) on the detector; a = source–object distance, b = object–detector distance."""
    c = Canvas(w, h)
    xs, x_obj, x_det = 90, 270, 370
    sp = 30
    c.rect(xs - 8, 120 - sp / 2, 16, sp, ACC2, 'main', fill=FILLC)
    c.text(xs, 120 - sp / 2 - 14, 'focal spot', FST, value=False)
    c.rect(x_obj - 6, 70, 12, 50, INK, 'main', fill=MUT)
    c.line(x_det, 30, x_det, 250, INK, 'bold')
    c.text(x_det, 22, 'detector', FST, value=False)
    ye = 120
    for ys in (120 - sp / 2, 120 + sp / 2):
        k = (x_det - xs) / (x_obj - xs)
        yd = ys + (ye - ys) * k
        c.line(xs, ys, x_det, yd, MUT, 'thin', dash='4 3')
    y_a = 120 - sp / 2 + (ye - (120 - sp / 2)) * (x_det - xs) / (x_obj - xs)
    y_b = 120 + sp / 2 + (ye - (120 + sp / 2)) * (x_det - xs) / (x_obj - xs)
    c.line(x_det + 6, min(y_a, y_b), x_det + 6, max(y_a, y_b), ACC, 'bold')
    c.text(x_det + 12, (y_a + y_b) / 2, 'penumbra', FST, anchor='start', color=ACC, value=False)
    c.text(x_obj, 60, 'object', FST, value=False)
    if spot_label:
        c.text(xs, 120 + sp / 2 + 16, spot_label, FST)
    if a_label:
        c.dim(xs, 270, x_obj, 270, a_label, side=-1)
    if b_label:
        c.dim(x_obj, 270, x_det, 270, b_label, side=-1)
    return c.done(title, desc)


def voxel_grid(title, desc, cells, rows=(None, None), cols=(None, None), diag=None, w=360, h=290):
    """A 2 × 2 block of voxels with the beam readings along rows (right), columns (below) and the
    top-left to bottom-right diagonal; cells = [[tl, tr], [bl, br]] labels."""
    c = Canvas(w, h)
    x0, y0, s = 110, 60, 80
    for r in range(2):
        for k in range(2):
            c.rect(x0 + k * s, y0 + r * s, s, s, INK, 'main', fill=FILLC)
            lab = cells[r][k]
            if lab is not None:
                c.text(x0 + k * s + s / 2, y0 + r * s + s / 2, str(lab), FS, value=not str(lab).isalpha() and str(lab) != '?')
    for r in range(2):
        y = y0 + r * s + s / 2
        c.arrow(30, y, x0 - 6, y, ACC2, 'thin', head=6)
        if rows[r] is not None:
            c.line(x0 + 2 * s + 4, y, x0 + 2 * s + 30, y, MUT, 'thin')
            c.text(x0 + 2 * s + 36, y, str(rows[r]), FS, anchor='start', color=ACC2)
    for k in range(2):
        x = x0 + k * s + s / 2
        c.arrow(x, 18, x, y0 - 6, ACC2, 'thin', head=6)
        if cols[k] is not None:
            c.text(x, y0 + 2 * s + 22, str(cols[k]), FS, color=ACC2)
    if diag is not None:
        c.line(x0 - 24, y0 - 24, x0 + 2 * s + 18, y0 + 2 * s + 18, ACC, 'thin', dash='4 3')
        c.text(x0 + 2 * s + 24, y0 + 2 * s + 26, str(diag), FS, anchor='start', color=ACC)
    return c.done(title, desc)


def ct_gantry(title, desc, w=360, h=320):
    """CT scanner end-on: X-ray tube and an opposite arc of detectors rotating round the patient,
    with a fan-shaped beam through the slice."""
    c = Canvas(w, h)
    cx, cy, R = w / 2, 160, 120
    c.circle(cx, cy, R, MUT, 'thin', dash='5 4')
    c.circle(cx, cy, 48, INK, 'main', fill=FILLC)
    c.text(cx, cy, 'patient', FST, value=False)
    tx, ty = cx, cy - R
    c.rect(tx - 20, ty - 12, 40, 24, ACC2, 'main', fill=FILLC, rx=4)
    c.text(tx + 28, ty - 12, 'X-ray tube', FST, anchor='start', color=ACC2, value=False)
    span = 34
    for a in range(-span, span + 1, 4):
        p = (cx + R * math.sin(math.radians(a)), cy + R * math.cos(math.radians(a)))
        c.rect(p[0] - 4, p[1] - 4, 8, 8, INK, 'thin', fill=FILLC)
    for a in (-span, 0, span):
        p = (cx + R * math.sin(math.radians(a)), cy + R * math.cos(math.radians(a)))
        c.line(tx, ty + 12, p[0], p[1] - 4, ACC2, 'thin')
    c.text(cx + 70, cy + R - 4, 'detector arc', FST, anchor='start', value=False)
    rot_arrow(c, cx, cy, R + 12, 120, 160)
    return c.done(title, desc)


def ascan(title, desc, peaks, t_end, xticks, xlabel='t / µs', tick_labels_=None, w=420, h=240):
    """A-scan trace: sharp pulses of the given heights at the given times (the transmitted pulse at t = 0
    is included in `peaks` by the caller)."""
    xs, ys = [], []
    n = 900
    for i in range(n + 1):
        t = t_end * i / n
        y = 0.0
        for tp, hp in peaks:
            y += hp * math.exp(-((t - tp) / (t_end * 0.006)) ** 2)
        xs.append(t)
        ys.append(y)
    return plot(xlabel, 'echo amplitude', [dict(x=xs, y=ys)], title, desc, xr=(0, t_end), yr=(0, 1.1),
                xticks=xticks, yticks=[0, 0.5, 1.0], w=w, h=h)


def transducer(title, desc, w=380, h=260):
    """Cross-section of an ultrasound transducer: backing block, piezoelectric crystal, matching layer,
    electrodes and leads, with the beam leaving the face."""
    c = Canvas(w, h)
    x0, x1 = 110, 230
    c.rect(x0 - 10, 30, x1 - x0 + 20, 170, INK, 'main')
    c.rect(x0, 40, x1 - x0, 70, MUT, 'thin', fill=FILLC)
    c.text(x1 + 20, 75, 'backing block', FST, anchor='start', value=False)
    c.rect(x0, 110, x1 - x0, 30, ACC, 'main', fill=FILLC)
    c.text(x1 + 20, 125, 'piezoelectric crystal', FST, anchor='start', value=False)
    c.line(x0, 110, x1, 110, INK, 'axis')
    c.line(x0, 140, x1, 140, INK, 'axis')
    c.rect(x0, 140, x1 - x0, 14, ACC2, 'thin', fill=FILLC)
    c.text(x1 + 20, 152, 'matching layer', FST, anchor='start', value=False)
    c.line(x0 + 20, 110, x0 + 20, 12, INK, 'thin')
    c.line(x1 - 20, 140, x1 - 20, 120, INK, 'thin')
    c.text(x0 + 26, 16, 'leads to a.c. supply / receiver', FST, anchor='start', value=False)
    for dx in (20, 60, 100):
        c.arrow(x0 + dx, 206, x0 + dx, 246, ACC2, 'thin', head=6)
    c.text(x1 + 20, 230, 'ultrasound pulse', FST, anchor='start', color=ACC2, value=False)
    return c.done(title, desc)


def sonar(title, desc, labels=(), w=420, h=250):
    """A boat sending a sonar pulse down to the sea bed (and an optional shoal), with depth markers."""
    c = Canvas(w, h)
    sea = 60
    c.line(20, sea, w - 20, sea, ACC, 'axis')
    c.poly([(150, sea - 2), (270, sea - 2), (255, sea + 14), (165, sea + 14)], INK, 'main', fill=FILLC, closed=True)
    c.rect(195, sea - 22, 30, 20, INK, 'thin', fill=FILLC)
    c.arrow(200, sea + 16, 200, h - 34, ACC2, 'thin', head=7)
    c.arrow(220, h - 34, 220, sea + 16, ACC2, 'thin', head=7)
    c.path(f'M20,{h - 30} Q120,{h - 40} 210,{h - 30} T{w - 20},{h - 26}', INK, 'main')
    c.text(w - 30, h - 12, 'sea bed', FST, anchor='end', value=False)
    for k, (y, lab) in enumerate(labels):
        c.text(240, y, lab, FST, anchor='start')
    return c.done(title, desc)


def pet_ring(title, desc, offset=0.0, offset_label=None, w=360, h=320):
    """End-on view of a PET detector ring with an annihilation point on a diameter and the two photons
    travelling to opposite detectors along the line of response; offset is a fraction of the radius."""
    c = Canvas(w, h)
    cx, cy, R = w / 2, 168, 125
    for a in range(0, 360, 10):
        p = (cx + R * math.cos(math.radians(a)), cy - R * math.sin(math.radians(a)))
        c.rect(p[0] - 5, p[1] - 5, 10, 10, INK, 'thin', fill=FILLC)
    c.circle(cx, cy, 60, MUT, 'thin', dash='4 3')
    c.text(cx, cy + 74, 'patient', FST, color=MUT, value=False)
    px = cx + offset * R
    c.line(cx - R + 6, cy, cx + R - 6, cy, MUT, 'thin', dash='5 4')
    c.arrow(px - 6, cy, cx - R + 8, cy, ACC2, 'main', head=8)
    c.arrow(px + 6, cy, cx + R - 8, cy, ACC2, 'main', head=8)
    c.circle(px, cy, 5, ACC, 'main', fill=FILLC)
    c.dot(cx, cy, 2.4)
    c.text(cx - R, cy - 22, 'A', FS, weight=600, value=False)
    c.text(cx + R, cy - 22, 'B', FS, weight=600, value=False)
    c.text(cx, 14, 'ring of detectors', FST, color=MUT, value=False)
    if offset_label:
        c.dim(cx, cy + 26, px, cy + 26, offset_label, side=-1)
    return c.done(title, desc)
