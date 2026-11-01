"""Monochrome diagrams in the style of the Grade 12 First Quarter Examination.

Every box figure is 480 x 360 (rendered to a 960 x 720 PNG), black line work,
light-grey fills, serif labels and grey dimension lines.
"""
import math
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "figs", "svg")
os.makedirs(OUT, exist_ok=True)

K = "#111111"
G = "#666666"
FILL = "#e8e8e8"
SERIF = "Liberation Serif, Times New Roman, serif"

DEFS = f"""<defs>
<marker id="a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,1 L10,5 L0,9 z" fill="{K}"/></marker>
<marker id="g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0,1.5 L10,5 L0,8.5 z" fill="{G}"/></marker>
<marker id="ab" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0.5 L10,5 L0,9.5 z" fill="{K}"/></marker>
</defs>"""


def svg(body, w=480, h=360):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" '
            f'font-family="{SERIF}"><rect width="{w}" height="{h}" fill="#fff"/>{DEFS}{body}</svg>')


def t(x, y, s, size=20, anchor="middle", color=K, italic=False, weight="normal", fam=None):
    st = ' font-style="italic"' if italic else ""
    f = f' font-family="{fam}"' if fam else ""
    return f'<text x="{x:.1f}" y="{y:.1f}" font-size="{size}" text-anchor="{anchor}" fill="{color}" font-weight="{weight}"{st}{f}>{s}</text>'


def ln(x1, y1, x2, y2, c=K, w=2, dash=None, arrow=None, both=False):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    m = ""
    if arrow:
        m = f' marker-end="url(#{arrow})"' + (f' marker-start="url(#{arrow})"' if both else "")
    return f'<line x1="{x1:.1f}" y1="{y1:.1f}" x2="{x2:.1f}" y2="{y2:.1f}" stroke="{c}" stroke-width="{w}" stroke-linecap="round"{d}{m}/>'


def charge(x, y, sign, r=20):
    s = (f'<circle cx="{x}" cy="{y}" r="{r}" fill="#fff" stroke="{K}" stroke-width="2.2"/>'
         + ln(x - r * 0.5, y, x + r * 0.5, y, K, 2.2))
    if sign == "+":
        s += ln(x, y - r * 0.5, x, y + r * 0.5, K, 2.2)
    return s


def hdim(x1, x2, y, label, tick=12, size=20, above=True, italic=False):
    s = ln(x1, y - tick, x1, y + tick, G, 1.3) + ln(x2, y - tick, x2, y + tick, G, 1.3)
    s += ln(x1 + 2, y, x2 - 2, y, G, 1.3, arrow="g", both=True)
    s += t((x1 + x2) / 2, y - 8 if above else y + 24, label, size, italic=italic)
    return s


def vdim(x, y1, y2, label, tick=12, size=20, left=True):
    s = ln(x - tick, y1, x + tick, y1, G, 1.3) + ln(x - tick, y2, x + tick, y2, G, 1.3)
    s += ln(x, y1 + 2, x, y2 - 2, G, 1.3, arrow="g", both=True)
    s += t(x - 10 if left else x + 10, (y1 + y2) / 2 + 7, label, size, anchor="end" if left else "start")
    return s


def arc(cx, cy, r, a1, a2, c=K, w=1.4):
    x1 = cx + r * math.cos(math.radians(a1)); y1 = cy - r * math.sin(math.radians(a1))
    x2 = cx + r * math.cos(math.radians(a2)); y2 = cy - r * math.sin(math.radians(a2))
    sweep = 0 if a2 > a1 else 1
    return f'<path d="M{x1:.1f},{y1:.1f} A{r},{r} 0 0,{sweep} {x2:.1f},{y2:.1f}" fill="none" stroke="{c}" stroke-width="{w}"/>'


def rangle(x, y, s=12, dx=1, dy=-1):
    return f'<path d="M{x + dx * s},{y} L{x + dx * s},{y + dy * s} L{x},{y + dy * s}" fill="none" stroke="{K}" stroke-width="1.3"/>'


def note(s, x=468, y=350):
    return t(x, y, s, 15, anchor="end", color=G)


def north(x, y, L=44):
    return ln(x, y + L / 2, x, y - L / 2, K, 2, arrow="a") + t(x, y - L / 2 - 8, "N", 20)


def graph(xmax, ymax, xmaj, ymaj, xsub, ysub, x0, y0, pw, ph, xlab, ylab, size=18, pts=None,
          extra=None, xfmt="{:g}", yfmt="{:g}", minor="#dddddd", major="#aaaaaa"):
    X = lambda v: x0 + v / xmax * pw
    Y = lambda v: y0 - v / ymax * ph
    s = ""
    nx = round(xmax / xmaj * xsub); ny = round(ymax / ymaj * ysub)
    for i in range(nx + 1):
        x = x0 + i * pw / nx
        s += ln(x, y0, x, y0 - ph, major if i % xsub == 0 else minor, 1.1 if i % xsub == 0 else 0.7)
    for j in range(ny + 1):
        y = y0 - j * ph / ny
        s += ln(x0, y, x0 + pw, y, major if j % ysub == 0 else minor, 1.1 if j % ysub == 0 else 0.7)
    s += ln(x0, y0, x0 + pw + 14, y0, K, 2, arrow="a") + ln(x0, y0, x0, y0 - ph - 14, K, 2, arrow="a")
    v = 0.0
    while v <= xmax + 1e-9:
        s += ln(X(v), y0, X(v), y0 + 6, K, 1.5) + t(X(v), y0 + 6 + size, xfmt.format(round(v, 6)), size)
        v += xmaj
    v = 0.0
    while v <= ymax + 1e-9:
        s += ln(x0 - 6, Y(v), x0, Y(v), K, 1.5) + t(x0 - 10, Y(v) + size * 0.35, yfmt.format(round(v, 6)), size, anchor="end")
        v += ymaj
    s += t(x0 + pw / 2, y0 + 2 * size + 12, xlab, size)
    s += f'<g transform="translate({x0 - 3.1 * size:.0f},{y0 - ph / 2:.0f}) rotate(-90)">{t(0, 0, ylab, size)}</g>'
    if pts:
        s += '<polyline points="' + " ".join(f"{X(a):.1f},{Y(b):.1f}" for a, b in pts) + f'" fill="none" stroke="{K}" stroke-width="2.6" stroke-linejoin="round"/>'
    if extra:
        s += extra(X, Y)
    return s


def car(x, y, w=80, flip=False):
    """Side view of a car; (x, y) is the left end at road level."""
    h = w * 0.28
    s = (f'<path d="M{x},{y - 10} L{x},{y - h} L{x + w * 0.22},{y - h} L{x + w * 0.34},{y - h - w * 0.2} '
         f'L{x + w * 0.70},{y - h - w * 0.2} L{x + w * 0.82},{y - h} L{x + w},{y - h + 4} L{x + w},{y - 10} z" '
         f'fill="{FILL}" stroke="{K}" stroke-width="2"/>')
    s += f'<path d="M{x + w * 0.38},{y - h - 3} L{x + w * 0.44},{y - h - w * 0.16} L{x + w * 0.66},{y - h - w * 0.16} L{x + w * 0.74},{y - h - 3} z" fill="#fff" stroke="{K}" stroke-width="1.3"/>'
    for cx in (x + w * 0.22, x + w * 0.78):
        s += f'<circle cx="{cx:.1f}" cy="{y - 9}" r="{w * 0.1:.1f}" fill="#fff" stroke="{K}" stroke-width="2"/>'
    return s


FIGS = {}


def fig(name):
    def deco(f):
        FIGS[name] = f
        return f
    return deco


# ----------------------------------------------------------------- Section A
@fig("q02_track")
def _():
    cx1, cx2, cy = 165, 315, 165
    def stadium(r, extra):
        return (f'<path d="M{cx1},{cy - r} L{cx2},{cy - r} A{r},{r} 0 0 1 {cx2},{cy + r} L{cx1},{cy + r} '
                f'A{r},{r} 0 0 1 {cx1},{cy - r} z" {extra}/>')
    b = stadium(118, f'fill="{FILL}" stroke="{K}" stroke-width="2.2"') + stadium(78, f'fill="#fff" stroke="{K}" stroke-width="2.2"')
    b += stadium(98, f'fill="none" stroke="{G}" stroke-width="1" stroke-dasharray="6 5"')
    b += ln(240, cy + 78, 240, cy + 118, K, 3)
    b += t(240, cy + 145, "start / finish", 18)
    b += ln(290, cy - 98, 200, cy - 98, K, 2.6, arrow="a") + t(245, cy - 128, "direction of running", 16, color=G)
    b += t(235, cy - 4, "one lap", 20) + t(235, cy + 22, "= 400 m", 20)
    return svg(b)


@fig("q03_walk")
def _():
    b = ln(40, 250, 450, 250, K, 1.6)
    for i in range(9):
        x = 50 + i * 50
        b += ln(x, 244, x, 256, K, 1.4) + t(x, 280, f"{i * 100}", 16)
    b += t(450, 305, "distance from start / m", 16, anchor="end", color=G)
    b += ln(50, 150, 250, 150, K, 2.6, arrow="a") + t(150, 138, "400 m east", 20)
    b += ln(250, 200, 100, 200, K, 2.6, arrow="a") + t(175, 228, "300 m west", 20)
    b += ln(250, 150, 250, 200, G, 1.2, dash="4 4")
    b += f'<circle cx="50" cy="150" r="6" fill="{K}"/>' + t(50, 128, "start", 18)
    b += north(420, 110)
    return svg(b)


@fig("q04_st")
def _():
    def ex(X, Y):
        return (t(X(1.4), Y(7.5), "P", 20, weight="bold") + t(X(5.5), Y(12) - 10, "Q", 20, weight="bold")
                + t(X(9.1), Y(7.5), "R", 20, weight="bold"))
    return svg(graph(10, 14, 2, 2, 2, 2, 90, 290, 350, 250, "time / s", "displacement / m",
                     pts=[(0, 0), (4, 12), (7, 12), (10, 0)], extra=ex))


@fig("q05_car")
def _():
    b = ln(20, 250, 460, 250, K, 2)
    b += car(40, 250, 90) + car(290, 250, 90)
    b += ln(140, 205, 200, 205, K, 2.4, arrow="a") + t(85, 170, "5.0 m s⁻¹", 20)
    b += ln(390, 205, 450, 205, K, 2.4, arrow="a") + t(335, 170, "25 m s⁻¹", 20)
    b += hdim(85, 335, 300, "time taken = 8.0 s", size=20, above=False)
    return svg(b)


@fig("q06_graphs")
def _():
    b = ""
    cells = [("A", "s", "line"), ("B", "v", "flat"), ("C", "v", "line"), ("D", "s", "flat")]
    for i, (L, q, k) in enumerate(cells):
        ox = 50 + (i % 2) * 230; oy = 150 + (i // 2) * 175
        b += ln(ox, oy, ox + 160, oy, K, 1.8, arrow="a") + ln(ox, oy, ox, oy - 120, K, 1.8, arrow="a")
        b += t(ox - 14, oy - 100, q, 22, italic=True) + t(ox + 160, oy + 22, "t", 22, italic=True) + t(ox - 10, oy + 18, "0", 16)
        if k == "line":
            b += ln(ox, oy, ox + 135, oy - 95, K, 2.6)
        else:
            b += ln(ox, oy - 55, ox + 140, oy - 55, K, 2.6)
        b += t(ox + 80, oy + 28, L, 22, weight="bold", fam="Liberation Sans, Arial")
    return svg(b)


@fig("q07_journey")
def _():
    b = ln(20, 200, 460, 200, K, 2)
    for x, lab in ((40, "A"), (240, "B"), (440, "C")):
        b += ln(x, 188, x, 212, K, 2) + t(x, 240, lab, 22, weight="bold", fam="Liberation Sans, Arial")
    b += car(45, 198, 70)
    b += ln(48, 140, 236, 140, K, 2.2, arrow="a", both=True) + t(140, 105, "30 km", 20) + t(140, 128, "in 0.50 h", 18)
    b += ln(244, 140, 436, 140, K, 2.2, arrow="a", both=True) + t(340, 105, "30 km", 20) + t(340, 128, "in 1.0 h", 18)
    return svg(b)


@fig("q08_force")
def _():
    ox, oy, L, th = 170, 300, 210, 35
    ex, ey = ox + L * math.sin(math.radians(th)), oy - L * math.cos(math.radians(th))
    b = ln(ox, oy, ox, 50, G, 1.4, dash="7 5") + ln(ox, oy, 430, oy, G, 1.4, dash="7 5")
    b += t(ox, 40, "vertical", 16, color=G) + t(430, oy + 24, "horizontal", 16, anchor="end", color=G)
    b += ln(ox, oy, ex, ey, K, 3, arrow="a") + t(ex + 10, ey + 4, "F", 24, italic=True, anchor="start")
    b += arc(ox, oy, 60, 90, 90 - th) + t(ox + 18, oy - 70, "θ", 22, italic=True)
    b += f'<circle cx="{ox}" cy="{oy}" r="5" fill="{K}"/>'
    return svg(b)


@fig("q09_perp")
def _():
    ox, oy = 150, 280
    b = f'<circle cx="{ox}" cy="{oy}" r="6" fill="{K}"/>' + t(ox - 14, oy + 22, "O", 20)
    b += ln(ox, oy, ox + 160, oy, K, 3, arrow="a") + t(ox + 80, oy + 30, "5.0 N", 20)
    b += ln(ox, oy, ox, oy - 220, K, 3, arrow="a") + t(ox - 14, oy - 110, "8.0 N", 20, anchor="end")
    b += rangle(ox, oy, 16)
    return svg(b)


@fig("q10_components")
def _():
    ox, oy, s = 70, 290, 22
    ex, ey = ox + 12 * s, oy - 9 * s
    b = ln(ox, oy, ex, ey, K, 3, arrow="a") + t((ox + ex) / 2 - 22, (oy + ey) / 2 - 10, "15 m s⁻¹", 20, anchor="end")
    b += ln(ox, oy, ex, oy, G, 2, dash="8 5", arrow="g") + t((ox + ex) / 2, oy + 30, "horizontal component = ?", 18)
    b += ln(ex, oy, ex, ey, G, 2, dash="8 5", arrow="g") + t(ex + 12, (oy + ey) / 2 + 6, "9.0 m s⁻¹", 20, anchor="start")
    b += rangle(ex, oy, 12, -1, -1)
    return svg(b)


@fig("q11_two_forces")
def _():
    ox, oy = 120, 260
    b = f'<circle cx="{ox}" cy="{oy}" r="6" fill="{K}"/>'
    b += ln(ox, oy, ox + 110, oy, K, 3, arrow="a") + t(ox + 55, oy + 30, "5.0 N", 20)
    a = 55
    ex, ey = ox + 230 * math.cos(math.radians(a)), oy - 230 * math.sin(math.radians(a))
    b += ln(ox, oy, ex, ey, K, 3, arrow="a") + t(ex + 10, ey + 10, "12 N", 20, anchor="start")
    b += arc(ox, oy, 55, 0, a) + t(ox + 70, oy - 30, "θ", 22, italic=True, anchor="start")
    b += t(240, 335, "θ can be changed", 17, color=G)
    return svg(b)


@fig("q12_charges")
def _():
    b = t(40, 40, "before", 17, anchor="start", color=G)
    b += charge(110, 90, "+", 18) + charge(250, 90, "+", 18)
    b += t(110, 135, "Q₁", 20, italic=True) + t(250, 135, "Q₂", 20, italic=True)
    b += hdim(110, 250, 160, "r", above=False, italic=True)
    b += ln(20, 205, 460, 205, G, 1, dash="5 5")
    b += t(40, 235, "after", 17, color=G, anchor="start")
    b += charge(110, 262, "+", 18) + charge(390, 262, "+", 18)
    b += t(110, 302, "2Q₁", 20, italic=True) + t(390, 302, "Q₂", 20, italic=True)
    b += hdim(110, 390, 320, "2r", above=False, italic=True)
    return svg(b)


@fig("q13_two")
def _():
    b = charge(120, 150, "+", 24) + charge(360, 150, "-", 24)
    b += t(120, 205, "+2.0 μC", 20) + t(360, 205, "−3.0 μC", 20)
    b += hdim(120, 360, 260, "0.30 m", above=False)
    return svg(b)


@fig("q14_midpoint")
def _():
    y = 170
    b = ln(80, y, 400, y, G, 1.2, dash="6 5")
    b += charge(80, y, "+", 24) + charge(400, y, "+", 24) + charge(240, y, "+", 13)
    b += t(80, y - 40, "X", 20, weight="bold", fam="Liberation Sans, Arial") + t(400, y - 40, "Y", 20, weight="bold", fam="Liberation Sans, Arial")
    b += t(80, y + 52, "+Q", 21, italic=True) + t(400, y + 52, "+Q", 21, italic=True) + t(240, y - 28, "+q", 21, italic=True)
    b += t(240, y + 40, "M", 18, weight="bold", fam="Liberation Sans, Arial")
    b += hdim(80, 240, y + 95, "d", above=False, italic=True) + hdim(240, 400, y + 95, "d", above=False, italic=True)
    return svg(b)


@fig("q15_triangle")
def _():
    cx, cy = 140, 290
    b = f'<path d="M{cx},{cy} L{cx},{cy - 220} L{cx + 240},{cy} z" fill="none" stroke="{G}" stroke-width="1.4" stroke-dasharray="7 5"/>'
    b += rangle(cx, cy, 16)
    b += charge(cx, cy - 220, "+", 20) + charge(cx + 240, cy, "+", 20) + charge(cx, cy, "+", 15)
    b += t(cx - 30, cy - 213, "+Q", 22, italic=True, anchor="end") + t(cx + 240, cy + 46, "+Q", 22, italic=True)
    b += t(cx - 26, cy + 8, "+q", 22, italic=True, anchor="end")
    b += t(cx - 16, cy - 105, "r", 24, italic=True, anchor="end") + t(cx + 120, cy + 32, "r", 24, italic=True)
    return svg(b)


# ----------------------------------------------------------------- Section B
@fig("q16_map")
def _():
    P, Q, R = (70, 300), (320, 300), (320, 60)
    b = ""
    for a, c in ((P, Q), (Q, R)):
        b += ln(*a, *c, "#bdbdbd", 18)
        b += ln(*a, *c, "#ffffff", 1.6, dash="10 8")
    b += ln(P[0] + 6, P[1] - 30, Q[0] - 10, Q[1] - 30, K, 2.6, arrow="a") + t(195, 258, "600 m, 120 s", 20)
    b += ln(Q[0] + 30, Q[1] - 10, R[0] + 30, R[1] + 10, K, 2.6, arrow="a")
    b += t(Q[0] + 42, 175, "800 m,", 20, anchor="start") + t(Q[0] + 42, 200, "200 s", 20, anchor="start")
    b += ln(*P, *R, K, 1.6, dash="8 6")
    for p in (P, Q, R):
        b += f'<circle cx="{p[0]}" cy="{p[1]}" r="8" fill="#fff" stroke="{K}" stroke-width="2.4"/>'
    b += t(P[0] - 6, P[1] + 36, "P", 22, weight="bold", fam="Liberation Sans, Arial")
    b += t(Q[0], Q[1] + 38, "Q", 22, weight="bold", fam="Liberation Sans, Arial")
    b += t(R[0] - 20, R[1] + 8, "R", 22, weight="bold", fam="Liberation Sans, Arial", anchor="end")
    b += north(430, 80) + note("not to scale")
    return svg(b)


@fig("q17_lights")
def _():
    b = ln(10, 250, 470, 250, K, 2)
    b += f'<rect x="28" y="70" width="26" height="70" rx="4" fill="{FILL}" stroke="{K}" stroke-width="2"/>' + ln(41, 140, 41, 250, K, 3)
    for i, f in enumerate(("#fff", "#fff", K)):
        b += f'<circle cx="41" cy="{84 + i * 21}" r="7" fill="{f}" stroke="{K}" stroke-width="1.5"/>'
    b += t(41, 55, "lights", 16, color=G)
    b += car(60, 250, 80)
    xs = [65, 185, 395, 465]
    labs = [("speeds up", "6.0 s"), ("constant velocity", "20 s"), ("brakes", "5.0 s")]
    for (a, c), (l1, l2) in zip(zip(xs, xs[1:]), labs):
        b += ln(a, 300, c, 300, G, 1.3, arrow="g", both=True) + ln(a, 288, a, 312, G, 1.3) + ln(c, 288, c, 312, G, 1.3)
        b += t((a + c) / 2, 327, l1, 16) + t((a + c) / 2, 347, l2, 16)
    b += ln(150, 200, 230, 200, K, 2.4, arrow="a") + t(190, 188, "a = 2.5 m s⁻²", 18).replace(">a =", "><tspan font-style=\"italic\">a</tspan> =")
    b += note("not to scale", 468, 30)
    return svg(b)


@fig("q18_sledge")
def _():
    gy = 270
    b = f'<rect x="0" y="{gy}" width="480" height="90" fill="#f2f2f2"/>' + ln(0, gy, 480, gy, K, 2)
    x0 = 50
    b += f'<path d="M{x0 - 8},{gy - 5} L{x0 + 160},{gy - 5} q26,0 30,-26" fill="none" stroke="{K}" stroke-width="3" stroke-linecap="round"/>'
    for x in (x0 + 25, x0 + 125):
        b += ln(x, gy - 5, x, gy - 30, K, 2.4)
    b += f'<rect x="{x0 - 4}" y="{gy - 46}" width="170" height="16" fill="{FILL}" stroke="{K}" stroke-width="2"/>'
    b += f'<rect x="{x0 + 30}" y="{gy - 84}" width="90" height="38" fill="#fff" stroke="{K}" stroke-width="1.6"/>' + t(x0 + 75, gy - 58, "load", 17, color=G)
    ax, ay = x0 + 186, gy - 31
    L, th = 220, 35
    ex, ey = ax + L * math.cos(math.radians(th)), ay - L * math.sin(math.radians(th))
    b += ln(ax, ay, ex, ey, K, 3, arrow="a") + t(ex - 6, ey - 14, "50 N", 22, anchor="end")
    b += ln(ax, ay, ax + 150, ay, G, 1.4, dash="7 5")
    b += arc(ax, ay, 70, 0, th) + t(ax + 82, ay - 16, "35°", 20, anchor="start")
    b += t(ax + 40, ay - 92, "rope", 17, color=G)
    return svg(b)


@fig("q18_drone")
def _():
    cx, cy = 130, 250
    b = ln(cx, cy, cx + 300, cy, K, 3, arrow="a") + ln(cx, cy, cx, cy - 170, K, 3, arrow="a")
    b += t(cx + 230, cy + 36, "15 m s⁻¹", 22) + t(cx + 230, cy + 60, "horizontal", 16, color=G)
    b += t(cx + 16, cy - 150, "6.0 m s⁻¹", 22, anchor="start") + t(cx + 16, cy - 128, "vertical", 16, color=G, anchor="start")
    for dx in (-60, 60):
        b += ln(cx, cy, cx + dx, cy - 12, K, 3.5) + ln(cx + dx, cy - 12, cx + dx, cy - 19, K, 2.4)
        b += f'<ellipse cx="{cx + dx}" cy="{cy - 21}" rx="34" ry="5" fill="{FILL}" stroke="{K}" stroke-width="1.6"/>'
    b += f'<rect x="{cx - 28}" y="{cy - 12}" width="56" height="26" rx="9" fill="{FILL}" stroke="{K}" stroke-width="2"/>'
    b += f'<circle cx="{cx}" cy="{cy + 18}" r="6" fill="#fff" stroke="{K}" stroke-width="2"/>'
    b += t(cx - 40, cy + 60, "drone", 17, color=G)
    return svg(b)


@fig("q19_line")
def _():
    A, B, C, y = 60, 180, 420, 160
    b = ln(30, y, 450, y, G, 1.2, dash="6 5")
    b += charge(A, y, "+", 24) + charge(B, y, "+", 22) + charge(C, y, "-", 24)
    for x, L, q in ((A, "A", "+3.0 μC"), (B, "B", "+2.0 μC"), (C, "C", "−4.0 μC")):
        b += t(x, y - 40, L, 21, weight="bold", fam="Liberation Sans, Arial") + t(x, y + 52, q, 19)
    b += hdim(A, B, y + 100, "0.10 m", above=False) + hdim(B, C, y + 100, "0.20 m", above=False)
    return svg(b)


@fig("q19_triangle")
def _():
    O, X, Y = (150, 270), (150, 60), (430, 270)
    b = f'<path d="M{O[0]},{O[1]} L{X[0]},{X[1]} L{Y[0]},{Y[1]} z" fill="none" stroke="{G}" stroke-width="1.4" stroke-dasharray="7 5"/>'
    b += rangle(*O, 16)
    b += charge(*X, "+", 22) + charge(*Y, "-", 22) + charge(*O, "+", 18)
    b += t(X[0] + 32, X[1] + 7, "X   +3.0 μC", 19, anchor="start")
    b += t(Y[0] - 4, Y[1] - 34, "Y", 20, weight="bold", fam="Liberation Sans, Arial") + t(Y[0] - 10, Y[1] + 48, "−3.0 μC", 19)
    b += t(O[0] - 28, O[1] - 20, "O", 20, weight="bold", fam="Liberation Sans, Arial", anchor="end")
    b += t(O[0] + 30, O[1] - 26, "+2.0 μC", 19, anchor="start")
    b += vdim(70, X[1], O[1], "0.30 m", size=19)
    b += hdim(O[0], Y[0], 342, "0.40 m", above=True)
    return svg(b)


# ----------------------------------------------------------------- Section C
@fig("q20_setup")
def _():
    b = ""
    y = 230
    b += f'<rect x="20" y="{y}" width="440" height="16" fill="{FILL}" stroke="{K}" stroke-width="2"/>'
    b += f'<rect x="40" y="{y + 30}" width="400" height="26" fill="#fff" stroke="{K}" stroke-width="1.6"/>'
    for i in range(0, 41):
        x = 40 + i * 10
        h = 12 if i % 10 == 0 else (8 if i % 5 == 0 else 5)
        b += ln(x, y + 30, x, y + 30 + h, K, 1)
    for i, lab in ((0, "0"), (10, "0.40"), (20, "0.80"), (30, "1.20")):
        b += t(40 + i * 10, y + 52, lab, 12)
    b += t(240, y + 80, "metre rule (distance d / m)", 16, color=G)
    b += car(40, y, 70)
    b += ln(115, y - 40, 190, y - 40, K, 2.4, arrow="a") + t(150, y - 52, "constant speed", 16)
    for x in (40, 200):
        b += ln(x, y - 12, x, y + 22, K, 1.6, dash="4 3")
    cx, cy = 380, 95
    b += f'<circle cx="{cx}" cy="{cy}" r="48" fill="#fff" stroke="{K}" stroke-width="3"/>'
    b += f'<rect x="{cx - 9}" y="{cy - 66}" width="18" height="14" rx="3" fill="{K}"/>'
    b += f'<rect x="{cx - 36}" y="{cy - 14}" width="72" height="28" rx="4" fill="{FILL}" stroke="{K}" stroke-width="1.4"/>'
    b += t(cx, cy + 8, "2.0 s", 20, fam="Liberation Mono, monospace")
    b += t(cx, cy + 74, "stopwatch", 16, color=G)
    b += t(40, 40, "toy car", 17, anchor="start", color=G) + ln(70, 48, 75, y - 30, G, 1)
    return svg(b)


def practical_grid(answers=False):
    def ex(X, Y):
        if not answers:
            return ""
        pts = [(1.0, 0.40), (2.0, 0.80), (3.1, 1.20), (4.0, 1.60), (5.0, 2.00)]
        s = ln(X(0), Y(0), X(6), Y(2.4), K, 2)
        for a, c in pts:
            s += ln(X(a) - 7, Y(c) - 7, X(a) + 7, Y(c) + 7, K, 2.2) + ln(X(a) - 7, Y(c) + 7, X(a) + 7, Y(c) - 7, K, 2.2)
        s += ln(X(2.5), Y(0), X(2.5), Y(1.0), G, 1.8, dash="8 6") + ln(X(0), Y(1.0), X(2.5), Y(1.0), G, 1.8, dash="8 6")
        s += t(X(2.5) + 10, Y(0.5), "t = 2.5 s → d = 1.0 m", 22, anchor="start")
        return s
    return svg(graph(6, 2.4, 1, 0.4, 5, 5, 120, 640, 780, 580, "t / s", "d / m", size=26, extra=ex,
                     xfmt="{:g}", yfmt="{:.1f}", minor="#d6d6d6", major="#8c8c8c"), 960, 720)


@fig("q20_grid")
def _():
    return practical_grid(False)


@fig("ms_q20_graph")
def _():
    return practical_grid(True)


if __name__ == "__main__":
    for name, f in FIGS.items():
        open(os.path.join(OUT, name + ".svg"), "w").write(f())
    print(len(FIGS), "figures")
