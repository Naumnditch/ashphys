"""Original SVG illustrations for the Grade 11 AS Physics examination."""
import math

INK = "#1b1f24"
NAVY = "#1d4e89"
RED = "#b3261e"
GREEN = "#2e7d32"
GREY = "#6b7280"
LIGHT = "#e5e7eb"
SANS = "Liberation Sans, Arial, sans-serif"
SERIF = "Liberation Serif, Times New Roman, serif"

DEFS = f"""
<svg width="0" height="0" style="position:absolute" aria-hidden="true">
 <defs>
  <marker id="ah-k" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.5,5 z" fill="{INK}"/></marker>
  <marker id="ah-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.5,5 z" fill="{NAVY}"/></marker>
  <marker id="ah-r" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.5,5 z" fill="{RED}"/></marker>
  <marker id="ah-g" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 L2.5,5 z" fill="{GREEN}"/></marker>
  <marker id="ah-s" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,1 L10,5 L0,9 z" fill="{INK}"/></marker>
  <radialGradient id="g-pos" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ffb4a8"/><stop offset="0.55" stop-color="#d9412f"/><stop offset="1" stop-color="#8e1c12"/></radialGradient>
  <radialGradient id="g-neg" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#b3d4ff"/><stop offset="0.55" stop-color="#2f6fc4"/><stop offset="1" stop-color="#173f78"/></radialGradient>
  <radialGradient id="g-ball" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#ffffff"/><stop offset="0.5" stop-color="#9aa4b1"/><stop offset="1" stop-color="#3d4651"/></radialGradient>
  <linearGradient id="g-wood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9c99a"/><stop offset="1" stop-color="#c79a5f"/></linearGradient>
  <linearGradient id="g-snow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f8fc"/><stop offset="1" stop-color="#d6e2ee"/></linearGradient>
  <linearGradient id="g-metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f3f4f6"/><stop offset="1" stop-color="#b8bec7"/></linearGradient>
  <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="{GREY}" stroke-width="1.2"/></pattern>
 </defs>
</svg>
"""


def svg(w, h, body, cls="fig", style=""):
    return (f'<svg class="{cls}" viewBox="0 0 {w} {h}" width="{w}" height="{h}" '
            f'style="{style}" xmlns="http://www.w3.org/2000/svg" font-family="{SANS}">{body}</svg>')


def t(x, y, s, size=13, anchor="middle", color=INK, weight="normal", italic=False, family=None, extra=""):
    fam = family or (SERIF if italic else SANS)
    st = ' font-style="italic"' if italic else ""
    return (f'<text x="{x}" y="{y}" font-size="{size}" text-anchor="{anchor}" fill="{color}" '
            f'font-weight="{weight}" font-family="{fam}"{st} {extra}>{s}</text>')


def line(x1, y1, x2, y2, color=INK, w=1.5, dash=None, arrow=None, start_arrow=False, extra=""):
    d = f' stroke-dasharray="{dash}"' if dash else ""
    m = ""
    if arrow:
        m += f' marker-end="url(#ah-{arrow})"'
        if start_arrow:
            m += f' marker-start="url(#ah-{arrow})"'
    return (f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{color}" stroke-width="{w}"'
            f' stroke-linecap="round"{d}{m} {extra}/>')


def charge(x, y, sign, r=15):
    g = "g-pos" if sign == "+" else "g-neg"
    sym = "+" if sign == "+" else "&#8722;"
    return (f'<circle cx="{x}" cy="{y}" r="{r}" fill="url(#{g})" stroke="#2b2b2b" stroke-width="0.8"/>'
            + t(x, y + r * 0.42, sym, size=r * 1.35, color="#fff", weight="bold"))


def dim(x1, x2, y, label, size=13, tick=8, color=INK):
    """Horizontal dimension line with arrows at both ends."""
    return (line(x1, y - tick, x1, y + tick, color, 1) + line(x2, y - tick, x2, y + tick, color, 1)
            + line(x1 + 1, y, x2 - 1, y, color, 1.1, arrow="k", start_arrow=True)
            + f'<rect x="{(x1 + x2) / 2 - len(label) * 3.6 - 4}" y="{y - 9}" width="{len(label) * 7.2 + 8}" height="18" fill="#fff"/>'
            + t((x1 + x2) / 2, y + 4.5, label, size))


def vdim(x, y1, y2, label, size=13, tick=8, anchor="end", dx=-8):
    return (line(x - tick, y1, x + tick, y1, INK, 1) + line(x - tick, y2, x + tick, y2, INK, 1)
            + line(x, y1 + 1, x, y2 - 1, INK, 1.1, arrow="k", start_arrow=True)
            + t(x + dx, (y1 + y2) / 2 + 4.5, label, size, anchor=anchor))


def arc(cx, cy, r, a1, a2, color=INK, w=1.2):
    """Angle arc, angles in degrees measured anticlockwise from +x (screen y flipped)."""
    x1 = cx + r * math.cos(math.radians(a1)); y1 = cy - r * math.sin(math.radians(a1))
    x2 = cx + r * math.cos(math.radians(a2)); y2 = cy - r * math.sin(math.radians(a2))
    large = 1 if abs(a2 - a1) > 180 else 0
    sweep = 0 if a2 > a1 else 1
    return f'<path d="M{x1:.1f},{y1:.1f} A{r},{r} 0 {large},{sweep} {x2:.1f},{y2:.1f}" fill="none" stroke="{color}" stroke-width="{w}"/>'


def right_angle(x, y, s=10, dx=1, dy=-1, color=INK):
    return (f'<path d="M{x + dx * s},{y} L{x + dx * s},{y + dy * s} L{x},{y + dy * s}" fill="none" '
            f'stroke="{color}" stroke-width="1.1"/>')


def compass(x, y, size=26):
    return (line(x, y + size * 0.55, x, y - size * 0.55, INK, 1.6, arrow="s")
            + line(x - size * 0.45, y, x + size * 0.45, y, INK, 1, )
            + t(x, y - size * 0.55 - 5, "N", 12, weight="bold")
            + t(x + size * 0.45 + 9, y + 4, "E", 11, color=GREY)
            + t(x - size * 0.45 - 9, y + 4, "W", 11, color=GREY)
            + t(x, y + size * 0.55 + 13, "S", 11, color=GREY))


# ---------------------------------------------------------------- graphs
def graph(xmax, ymax, xmajor, ymajor, xsub, ysub, pw, ph, xlabel, ylabel,
          series=(), extra_fn=None, ml=58, mb=46, mt=16, mr=22, xfmt="{:g}", yfmt="{:g}",
          grid_color="#c7d3e0", major_color="#8aa1bb", paper=True):
    W = ml + pw + mr
    H = mt + ph + mb
    X = lambda v: ml + v / xmax * pw
    Y = lambda v: mt + ph - v / ymax * ph
    b = []
    if paper:
        b.append(f'<rect x="{ml}" y="{mt}" width="{pw}" height="{ph}" fill="#fbfdff"/>')
        nx = round(xmax / xmajor * xsub)
        ny = round(ymax / ymajor * ysub)
        for i in range(nx + 1):
            x = ml + i * pw / nx
            major = i % xsub == 0
            b.append(line(round(x, 2), mt, round(x, 2), mt + ph, major_color if major else grid_color,
                          0.9 if major else 0.45))
        for j in range(ny + 1):
            y = mt + ph - j * ph / ny
            major = j % ysub == 0
            b.append(line(ml, round(y, 2), ml + pw, round(y, 2), major_color if major else grid_color,
                          0.9 if major else 0.45))
    # axes
    b.append(line(ml, mt + ph, ml + pw + 12, mt + ph, INK, 1.6, arrow="k"))
    b.append(line(ml, mt + ph, ml, mt - 10, INK, 1.6, arrow="k"))
    v = 0.0
    while v <= xmax + 1e-9:
        x = X(v)
        b.append(line(x, mt + ph, x, mt + ph + 5, INK, 1.2))
        b.append(t(x, mt + ph + 19, xfmt.format(round(v, 6)), 12))
        v += xmajor
    v = 0.0
    while v <= ymax + 1e-9:
        y = Y(v)
        b.append(line(ml - 5, y, ml, y, INK, 1.2))
        if v > 0 or True:
            b.append(t(ml - 9, y + 4, yfmt.format(round(v, 6)), 12, anchor="end"))
        v += ymajor
    b.append(t(ml + pw / 2, H - 6, xlabel, 13))
    b.append(f'<g transform="translate(15,{mt + ph / 2}) rotate(-90)">{t(0, 0, ylabel, 13)}</g>')
    for s in series:
        pts = " ".join(f"{X(a):.1f},{Y(c):.1f}" for a, c in s["pts"])
        b.append(f'<polyline points="{pts}" fill="none" stroke="{s.get("color", NAVY)}" '
                 f'stroke-width="{s.get("w", 2.4)}" stroke-linejoin="round" stroke-linecap="round"/>')
    if extra_fn:
        b.append(extra_fn(X, Y))
    return svg(W, H, "".join(b))


# ---------------------------------------------------------------- Section A figures
def fig_track():
    # stadium shaped 400 m track
    cx1, cx2, cy = 150, 330, 105
    def stadium(r, **kw):
        return (f'<path d="M{cx1},{cy - r} L{cx2},{cy - r} A{r},{r} 0 0 1 {cx2},{cy + r} '
                f'L{cx1},{cy + r} A{r},{r} 0 0 1 {cx1},{cy - r} z" {kw.get("a", "")}/>')
    b = [stadium(88, a='fill="#c8553d"'), stadium(60, a='fill="#7fb069"')]
    for r in (67, 74, 81):
        b.append(stadium(r, a='fill="none" stroke="#f3e9e2" stroke-width="0.9" stroke-dasharray="1 0"'))
    b.append(stadium(88, a=f'fill="none" stroke="{INK}" stroke-width="1.4"'))
    b.append(stadium(60, a=f'fill="none" stroke="{INK}" stroke-width="1.4"'))
    # start/finish line
    b.append(f'<rect x="238" y="{cy + 60}" width="6" height="28" fill="#fff" stroke="{INK}" stroke-width="0.6"/>')
    b.append(t(241, cy + 108, "start / finish", 12))
    # runner marker
    b.append(f'<circle cx="252" cy="{cy + 74}" r="6" fill="{NAVY}" stroke="#fff" stroke-width="1.5"/>')
    # direction arrow inside field
    b.append(f'<path d="M300,{cy + 38} A120,40 0 0 0 300,{cy - 38}" fill="none" stroke="#fff" stroke-width="2.2" marker-end="url(#ah-k)"/>')
    b.append(t(240, cy + 5, "one lap = 400 m", 14, color="#fff", weight="bold"))
    return svg(480, 228, "".join(b))


def fig_walk():
    y0 = 40
    b = [line(30, 110, 450, 110, GREY, 1)]
    for i in range(0, 9):
        x = 50 + i * 50
        b.append(line(x, 105, x, 115, GREY, 1))
        b.append(t(x, 130, f"{i * 100}", 11, color=GREY))
    b.append(t(470, 133, "m", 11, color=GREY, anchor="start"))
    b.append(line(50, 60, 250, 60, NAVY, 2.6, arrow="b"))
    b.append(t(150, 50, "400 m east", 13, color=NAVY))
    b.append(line(250, 85, 100, 85, RED, 2.6, arrow="r"))
    b.append(t(175, 101, "300 m west", 13, color=RED))
    b.append(line(250, 60, 250, 85, GREY, 1, dash="3 3"))
    b.append(f'<circle cx="50" cy="60" r="5" fill="{INK}"/>')
    b.append(t(50, 46, "start", 12))
    b.append(compass(420, 50, 26))
    return svg(490, 140, "".join(b))


def fig_st():
    def extra(X, Y):
        s = ""
        s += t(X(1.7), Y(7.6), "P", 14, weight="bold", color=RED)
        s += t(X(5.5), Y(12) - 9, "Q", 14, weight="bold", color=RED)
        s += t(X(8.9), Y(7.6), "R", 14, weight="bold", color=RED)
        return s
    return graph(10, 14, 2, 2, 2, 2, 330, 210, "time / s", "displacement / m",
                 series=[{"pts": [(0, 0), (4, 12), (7, 12), (10, 0)]}], extra_fn=extra)


def mini(kind, letter):
    w, h = 150, 112
    ox, oy = 26, 92
    b = [line(ox, oy, ox + 112, oy, INK, 1.4, arrow="k"), line(ox, oy, ox, 10, INK, 1.4, arrow="k")]
    yl = "s" if kind in ("s-line", "s-flat") else "v"
    b.append(t(ox - 11, 22, yl, 14, italic=True))
    b.append(t(ox + 112, oy + 16, "t", 14, italic=True))
    b.append(t(ox - 9, oy + 13, "0", 11))
    if kind == "s-line":
        b.append(line(ox, oy, ox + 95, oy - 66, NAVY, 2.4))
    elif kind == "v-flat":
        b.append(line(ox, oy - 45, ox + 100, oy - 45, NAVY, 2.4))
    elif kind == "v-line":
        b.append(line(ox, oy, ox + 95, oy - 66, NAVY, 2.4))
    elif kind == "s-flat":
        b.append(line(ox, oy - 45, ox + 100, oy - 45, NAVY, 2.4))
    b.append(t(w / 2 + 6, h - 2, letter, 14, weight="bold"))
    return svg(w, h + 6, "".join(b))


def fig_force_vertical():
    ox, oy = 90, 150
    L = 120
    th = 35  # angle from vertical
    ex = ox + L * math.sin(math.radians(th)); ey = oy - L * math.cos(math.radians(th))
    b = [line(ox, oy, ox, oy - 135, GREY, 1, dash="5 4"), line(ox, oy, ox + 140, oy, GREY, 1, dash="5 4"),
         t(ox, oy - 140, "vertical", 11, color=GREY), t(ox + 150, oy + 4, "horizontal", 11, color=GREY, anchor="start"),
         line(ox, oy, ex, ey, RED, 2.8, arrow="r"),
         arc(ox, oy, 38, 90, 90 - th), t(ox + 10, oy - 46, "θ", 15, italic=True),
         t(ex + 6, ey - 4, "F", 16, italic=True, anchor="start", color=RED),
         f'<circle cx="{ox}" cy="{oy}" r="4" fill="{INK}"/>']
    return svg(270, 170, "".join(b))


def fig_perp():
    ox, oy = 70, 150
    b = [f'<circle cx="{ox}" cy="{oy}" r="5" fill="{INK}"/>',
         line(ox, oy, ox + 100, oy, RED, 2.8, arrow="r"), t(ox + 50, oy + 20, "5.0 N", 13, color=RED),
         line(ox, oy, ox, oy - 128, RED, 2.8, arrow="r"), t(ox - 10, oy - 64, "8.0 N", 13, color=RED, anchor="end"),
         right_angle(ox, oy, 10, 1, -1), t(ox - 12, oy + 4, "O", 13, anchor="end")]
    return svg(220, 170, "".join(b))


def fig_velocity_components():
    ox, oy = 40, 140
    vx, vy = 12, 9
    s = 11
    ex, ey = ox + vx * s, oy - vy * s
    b = [line(ox, oy, ex, ey, NAVY, 2.8, arrow="b"),
         t((ox + ex) / 2 - 10, (oy + ey) / 2 - 8, "15 m s⁻¹", 13, color=NAVY, anchor="end"),
         line(ox, oy, ex, oy, GREY, 1.6, dash="6 4", arrow="k"), t((ox + ex) / 2, oy + 20, "horizontal component = ?", 12),
         line(ex, oy, ex, ey, GREY, 1.6, dash="6 4", arrow="k"), t(ex + 8, (oy + ey) / 2 + 4, "9.0 m s⁻¹", 13, anchor="start"),
         right_angle(ex, oy, 9, -1, -1)]
    return svg(260, 160, "".join(b))


def fig_two_charges():
    b = [charge(70, 45, "+", 17), charge(300, 45, "-", 17),
         t(70, 90, "+2.0 μC", 13), t(300, 90, "−3.0 μC", 13),
         dim(70, 300, 116, "0.30 m")]
    return svg(370, 132, "".join(b))


def fig_line_zero():
    y = 62
    b = [line(78, y, 367, y, GREY, 1, dash="4 4"),
         charge(60, y, "+", 18), charge(380, y, "+", 13),
         t(60, 30, "X", 14, weight="bold"), t(380, 30, "Y", 14, weight="bold"),
         t(34, y + 6, "+9<tspan font-style=\"italic\" font-family=\"Liberation Serif\">q</tspan>", 15, anchor="end"),
         t(400, y + 6, "+<tspan font-style=\"italic\" font-family=\"Liberation Serif\">q</tspan>", 15, anchor="start"),
         f'<circle cx="300" cy="{y}" r="6" fill="#fff" stroke="{INK}" stroke-width="1.5"/>',
         t(300, y - 14, "P", 14, weight="bold"),
         dim(300, 380, y + 34, "?", size=14),
         dim(60, 380, y + 70, "4d", size=14).replace(">4d<", "><tspan>4</tspan><tspan font-style=\"italic\" font-family=\"Liberation Serif\">d</tspan><")]
    return svg(440, 150, "".join(b))


def fig_triangle_equal():
    cx, cy = 80, 175
    b = [f'<path d="M{cx},{cy} L{cx},{cy - 140} L{cx + 170},{cy} z" fill="#f6f8fb" stroke="{GREY}" stroke-width="1.2" stroke-dasharray="5 4"/>',
         right_angle(cx, cy, 13, 1, -1),
         charge(cx, cy - 140, "+", 15), charge(cx + 170, cy, "+", 15), charge(cx, cy, "+", 12),
         t(cx - 22, cy - 135, "+<tspan font-style=\"italic\">Q</tspan>", 16, anchor="end", family=SERIF),
         t(cx + 170, cy + 34, "+<tspan font-style=\"italic\">Q</tspan>", 16, family=SERIF),
         t(cx - 20, cy + 6, "+<tspan font-style=\"italic\">q</tspan>", 16, anchor="end", family=SERIF),
         t(cx - 16, cy - 66, "r", 17, italic=True, anchor="end"), t(cx + 85, cy + 24, "r", 17, italic=True)]
    return svg(290, 215, "".join(b))


# ---------------------------------------------------------------- Section B figures
def road(x1, y1, x2, y2, w=16):
    return (line(x1, y1, x2, y2, "#9aa1a9", w, extra='stroke-linecap="square"')
            + line(x1, y1, x2, y2, "#ffffff", 1.4, dash="7 6"))


def fig_map():
    P = (60, 262); Q = (300, 262); R = (300, 46)
    trees = [(70, 70), (125, 55), (95, 130), (180, 52), (430, 150), (400, 215), (365, 245), (440, 255), (60, 180)]
    b = [f'<rect x="0" y="0" width="470" height="305" rx="8" fill="#f2f6ee"/>',
         road(P[0] - 20, P[1], Q[0] + 8, Q[1]), road(Q[0], Q[1] + 8, R[0], R[1] - 20),
         ''.join(f'<circle cx="{x}" cy="{y}" r="10" fill="#9ccc8a" stroke="#6c9d5b"/>' for x, y in trees),
         line(P[0] + 4, P[1] - 24, Q[0] - 8, Q[1] - 24, NAVY, 2.8, arrow="b"),
         t((P[0] + Q[0]) / 2 + 30, P[1] - 34, "600 m, 120 s", 17, color=NAVY, weight="bold"),
         line(Q[0] + 24, Q[1] - 8, R[0] + 24, R[1] + 8, NAVY, 2.8, arrow="b"),
         t(Q[0] + 34, (Q[1] + R[1]) / 2 - 2, "800 m,", 17, color=NAVY, weight="bold", anchor="start"),
         t(Q[0] + 34, (Q[1] + R[1]) / 2 + 18, "200 s", 17, color=NAVY, weight="bold", anchor="start"),
         line(P[0], P[1], R[0], R[1], RED, 1.6, dash="7 5"),
         ''.join(f'<circle cx="{x}" cy="{y}" r="7" fill="#fff" stroke="{INK}" stroke-width="2.2"/>' for x, y in (P, Q, R)),
         t(P[0] - 6, P[1] + 30, "P", 19, weight="bold"), t(Q[0], Q[1] + 33, "Q", 19, weight="bold"),
         t(R[0] - 18, R[1] + 6, "R", 19, weight="bold", anchor="end"),
         compass(425, 55, 40).replace('font-size="12"', 'font-size="16"').replace('font-size="11"', 'font-size="14"')]
    return svg(470, 305, "".join(b))


def fig_vt():
    return graph(40, 25, 10, 5, 5, 5, 400, 230, "time / s", "velocity / m s⁻¹",
                 series=[{"pts": [(0, 0), (10, 20), (30, 20), (35, 0)]}])


def fig_sledge():
    gy = 160
    b = [f'<path d="M0,{gy} L420,{gy} L420,200 L0,200 z" fill="url(#g-snow)"/>',
         line(0, gy, 420, gy, "#8fa6bd", 1.4)]
    # sledge
    x0 = 90
    b.append(f'<path d="M{x0 - 6},{gy - 4} L{x0 + 130},{gy - 4} q22,0 26,-22" fill="none" stroke="{INK}" stroke-width="3" stroke-linecap="round"/>')
    for x in (x0 + 18, x0 + 100):
        b.append(line(x, gy - 4, x, gy - 26, INK, 2.4))
    b.append(f'<rect x="{x0 - 4}" y="{gy - 38}" width="140" height="13" rx="3" fill="url(#g-wood)" stroke="#8a5a2b" stroke-width="1.2"/>')
    b.append(f'<rect x="{x0 + 20}" y="{gy - 66}" width="70" height="28" rx="4" fill="#d9e6f2" stroke="{GREY}" stroke-width="1"/>')
    b.append(t(x0 + 55, gy - 47, "load", 14, color=GREY))
    # rope
    ax, ay = x0 + 152, gy - 26
    L = 160; th = 35
    ex, ey = ax + L * math.cos(math.radians(th)), ay - L * math.sin(math.radians(th))
    b.append(line(ax, ay, ex - 30 * math.cos(math.radians(th)), ey + 30 * math.sin(math.radians(th)), "#8a5a2b", 2.2))
    b.append(line(ax, ay, ex, ey, RED, 2.8, arrow="r", extra='opacity="0.95"'))
    b.append(t(ex - 4, ey - 10, "tension = 50 N", 17, color=RED, anchor="middle", weight="bold"))
    b.append(line(ax, ay, ax + 110, ay, GREY, 1, dash="5 4"))
    b.append(arc(ax, ay, 46, 0, th))
    b.append(t(ax + 58, ay - 12, "35°", 17, anchor="start"))
    return svg(470, 200, "".join(b)).replace('viewBox="0 0 470 200"', 'viewBox="0 -20 470 220"').replace('height="200"', 'height="220"', 1)


def fig_drone():
    cx, cy = 70, 120
    b = []
    sx = 11
    # velocity components drawn from the drone's centre (behind the drone)
    b.append(line(cx, cy, cx + 15 * sx + 40, cy, NAVY, 2.8, arrow="b"))
    b.append(line(cx, cy, cx, cy - 6.0 * sx - 40, NAVY, 2.8, arrow="b"))
    b.append(t(cx + 150, cy + 24, "15 m s⁻¹", 16, color=NAVY, weight="bold"))
    b.append(t(cx + 150, cy + 42, "(horizontal)", 13, color=NAVY))
    b.append(t(cx + 12, cy - 86, "6.0 m s⁻¹", 16, color=NAVY, weight="bold", anchor="start"))
    b.append(t(cx + 12, cy - 69, "(vertical)", 13, color=NAVY, anchor="start"))
    for dx in (-44, 44):
        b.append(line(cx, cy, cx + dx, cy - 8, INK, 3))
        b.append(line(cx + dx, cy - 8, cx + dx, cy - 13, INK, 2))
        b.append(f'<ellipse cx="{cx + dx}" cy="{cy - 14}" rx="24" ry="3.5" fill="#cfd6df" stroke="{GREY}" stroke-width="1"/>')
    b.append(f'<rect x="{cx - 20}" y="{cy - 9}" width="40" height="18" rx="7" fill="#3b4652" stroke="{INK}" stroke-width="1"/>')
    b.append(f'<circle cx="{cx}" cy="{cy + 12}" r="4.5" fill="#111" stroke="#666"/>')
    return svg(290, 175, "".join(b))


def fig_three_line():
    A, B, C = 60, 190, 450
    b = [line(30, 50, 480, 50, GREY, 1, dash="4 4"),
         charge(A, 50, "+", 17), charge(B, 50, "+", 15), charge(C, 50, "-", 18),
         t(A, 16, "A", 14, weight="bold"), t(B, 16, "B", 14, weight="bold"), t(C, 16, "C", 14, weight="bold"),
         t(A, 92, "+3.0 μC", 13), t(B, 92, "+2.0 μC", 13), t(C, 92, "−4.0 μC", 13),
         dim(A, B, 122, "0.10 m"), dim(B, C, 122, "0.20 m")]
    return svg(510, 140, "".join(b))


def fig_triangle_numeric():
    O = (100, 210); X = (100, 50); Y = (313, 210)
    b = [f'<path d="M{O[0]},{O[1]} L{X[0]},{X[1]} L{Y[0]},{Y[1]} z" fill="#f6f8fb" stroke="{GREY}" stroke-width="1.2" stroke-dasharray="5 4"/>',
         right_angle(O[0], O[1], 14, 1, -1),
         charge(X[0], X[1], "+", 16), charge(Y[0], Y[1], "-", 17), charge(O[0], O[1], "+", 13),
         t(X[0] + 26, X[1] + 6, "X   +3.0 μC", 15, anchor="start"),
         t(Y[0] + 26, Y[1] + 6, "Y", 15, weight="bold", anchor="start"),
         t(Y[0] + 26, Y[1] + 24, "−3.0 μC", 15, anchor="start"),
         t(O[0] - 20, O[1] - 12, "O", 15, weight="bold", anchor="end"),
         t(O[0] + 22, O[1] - 22, "+2.0 μC", 15, anchor="start"),
         vdim(52, X[1], O[1], "0.30 m", dx=-8, anchor="end", tick=6, size=14),
         dim(O[0], Y[0], 282, "0.40 m", size=14)]
    return svg(400, 298, "".join(b))


# ---------------------------------------------------------------- Section C figures
def fig_ramp():
    b = []
    b.append(f'<rect x="10" y="200" width="580" height="14" fill="url(#g-wood)" stroke="#8a5a2b"/>')
    b.append(f'<rect x="30" y="214" width="14" height="40" fill="#b88a55"/><rect x="556" y="214" width="14" height="40" fill="#b88a55"/>')
    x1, y1, x2, y2 = 60, 118, 566, 199
    b.append(f'<rect x="48" y="131" width="50" height="69" fill="#d8c3a5" stroke="#8a5a2b"/>')
    b.append(t(73, 170, "block", 11, color="#6b4a25"))
    ang = math.degrees(math.atan2(y2 - y1, x2 - x1))
    L = math.hypot(x2 - x1, y2 - y1)
    b.append(f'<g transform="rotate({ang:.3f} {x1} {y1})"><rect x="{x1}" y="{y1}" width="{L:.1f}" height="8" fill="url(#g-metal)" stroke="{GREY}"/></g>')
    def on(s):
        return x1 + s * (x2 - x1), y1 + s * (y2 - y1)
    nx, ny = math.sin(math.radians(ang)), -math.cos(math.radians(ang))
    r = 12
    s0, s1 = 0.07, 0.80
    for s, lab in ((s0, "start line"), (s1, "finish line")):
        px, py = on(s)
        b.append(line(px + nx * 26, py + ny * 26, px - nx * 10, py - ny * 10, RED, 2.4))
        b.append(t(px + nx * 26 - 4, py + ny * 26 - 6, lab, 13, color=RED, weight="bold", anchor="end"))
    bx, by = on(s0 - 0.025)
    b.append(f'<circle cx="{bx + nx * r:.1f}" cy="{by + ny * r:.1f}" r="{r}" fill="url(#g-ball)" stroke="#333"/>')
    (sx, sy), (fx, fy) = on(s0), on(s1)
    off = 58
    b.append(line(sx + nx * off, sy + ny * off, fx + nx * off, fy + ny * off, INK, 1.3, arrow="k", start_arrow=True))
    for px, py in ((sx, sy), (fx, fy)):
        b.append(line(px + nx * 30, py + ny * 30, px + nx * (off + 6), py + ny * (off + 6), GREY, 0.8, dash="3 3"))
    mx, my = (sx + fx) / 2 + nx * (off + 14), (sy + fy) / 2 + ny * (off + 14)
    b.append(t(mx, my, "d", 18, italic=True))
    b.append(t(300, 240, "bench", 12, color=GREY))
    cx, cy = 535, 52
    b.append(f'<circle cx="{cx}" cy="{cy}" r="30" fill="#fff" stroke="{INK}" stroke-width="2.4"/>')
    b.append(f'<rect x="{cx - 6}" y="{cy - 44}" width="12" height="9" rx="2" fill="{INK}"/>')
    b.append(f'<rect x="{cx - 26}" y="{cy - 9}" width="52" height="18" rx="3" fill="#dfe8d8" stroke="{GREY}"/>')
    b.append(t(cx, cy + 5, "0.00 s", 12, family="Liberation Mono, monospace"))
    b.append(t(cx, cy + 46, "stopwatch", 12, color=GREY))
    return svg(600, 258, "".join(b))


PRACT = [  # d, t1, t2, t3
    (0.20, 0.80, 0.84, 0.82),
    (0.40, 1.17, 1.13, 1.15),
    (0.60, 1.40, 1.44, 1.39),
    (0.80, 1.62, 1.66, 1.61),
    (1.00, 1.84, 1.80, 1.85),
]


def practical_graph(answers=False):
    def extra(X, Y):
        if not answers:
            return ""
        s = ""
        pts = [(0.67, 0.20), (1.32, 0.40), (1.99, 0.60), (2.66, 0.80), (3.35, 1.00)]
        s += line(X(0), Y(0), X(3.5), Y(3.5 * 0.300), NAVY, 1.8)
        for a, c in pts:
            s += line(X(a) - 5, Y(c) - 5, X(a) + 5, Y(c) + 5, RED, 1.8) + line(X(a) - 5, Y(c) + 5, X(a) + 5, Y(c) - 5, RED, 1.8)
        # gradient triangle 0.50 -> 3.30
        xa, xb = 0.50, 3.30
        ya, yb = 0.150, 0.990
        s += line(X(xa), Y(ya), X(xb), Y(ya), GREEN, 1.6, dash="6 4")
        s += line(X(xb), Y(ya), X(xb), Y(yb), GREEN, 1.6, dash="6 4")
        s += t((X(xa) + X(xb)) / 2, Y(ya) + 18, "Δ(t²) = 3.30 − 0.50 = 2.80 s²", 12, color=GREEN)
        s += t(X(xb) + 8, (Y(ya) + Y(yb)) / 2, "Δd = 0.990 − 0.150", 12, color=GREEN, anchor="start")
        s += t(X(xb) + 8, (Y(ya) + Y(yb)) / 2 + 16, "= 0.840 m", 12, color=GREEN, anchor="start")
        return s
    return graph(3.5, 1.2, 0.5, 0.2, 5, 5, 500, 400, "t² / s²", "d / m", extra_fn=extra,
                 xfmt="{:.1f}", yfmt="{:.1f}", mr=140 if answers else 30)
