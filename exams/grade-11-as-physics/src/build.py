"""Builds the Grade 11 AS Physics examination and its mark scheme as HTML."""
import os
import re
import figs as F

OUT = os.path.join(os.path.dirname(__file__), "..", "build")
os.makedirs(OUT, exist_ok=True)

CSS = """
@page { size: A4; margin: 16mm 16mm 18mm 16mm; }
* { box-sizing: border-box; }
html { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
body { font-family: 'Liberation Sans', Arial, sans-serif; font-size: 11pt; color: #1b1f24; line-height: 1.42; margin: 0; }
i.v, .v { font-family: 'Liberation Serif', 'Times New Roman', serif; font-style: italic; font-size: 12pt; }
h1, h2, h3 { margin: 0; }
.page-break { break-before: page; }
.cover { display: flex; flex-direction: column; }
.band { background: #1d4e89; color: #fff; padding: 7mm 9mm 6mm; border-radius: 3mm; }
.band .school { font-size: 10pt; letter-spacing: .14em; text-transform: uppercase; opacity: .85; }
.band h1 { font-size: 25pt; margin-top: 2mm; letter-spacing: .01em; }
.band .sub { font-size: 13pt; margin-top: 1.5mm; }
.band .meta { display: flex; gap: 10mm; margin-top: 5mm; font-size: 10.5pt; }
.band .meta b { display: block; font-size: 8.5pt; letter-spacing: .12em; text-transform: uppercase; opacity: .8; font-weight: normal; }
.cand { display: grid; grid-template-columns: 2.2fr 1fr 1fr; gap: 4mm; margin: 5mm 0 4mm; }
.cand div { border: 1.2px solid #1b1f24; border-radius: 1.5mm; height: 13mm; padding: 1.5mm 2.5mm; font-size: 8.5pt; text-transform: uppercase; letter-spacing: .1em; color: #4b5563; }
.box { border: 1px solid #9aa4b1; border-radius: 2mm; padding: 4mm 5mm; }
.box h3 { font-size: 10pt; letter-spacing: .12em; text-transform: uppercase; color: #1d4e89; margin-bottom: 2mm; }
.box ul { margin: 0; padding-left: 5mm; }
.box li { margin: .6mm 0; font-size: 10pt; }
.cover-grid { display: grid; grid-template-columns: 1.35fr 1fr; gap: 5mm; }
table.exr { border-collapse: collapse; width: 100%; font-size: 10pt; }
table.exr th, table.exr td { border: 1px solid #6b7280; padding: 1.6mm 2mm; text-align: center; }
table.exr th { background: #eef2f7; }
table.exr td.l { text-align: left; }
table.exr tr.tot td { font-weight: bold; background: #eef2f7; }
.data { margin-top: 4mm; }
.data table { width: 100%; border-collapse: collapse; font-size: 10pt; }
.data td { padding: 0.9mm 2mm; border-bottom: 1px solid #e5e7eb; font-size: 9.5pt; }
.data td:first-child { width: 46%; color:#374151; }
.foot-note { margin-top: 6mm; font-size: 9pt; color: #6b7280; border-top: 1px solid #d1d5db; padding-top: 2mm; display: flex; justify-content: space-between; }

.section { display: flex; align-items: baseline; justify-content: space-between; border-bottom: 2.5px solid #1d4e89; padding-bottom: 1.5mm; margin-bottom: 4mm; }
.section h2 { font-size: 15pt; color: #1d4e89; }
.section .info { font-size: 10pt; color: #4b5563; }
.lead { font-size: 10pt; color: #374151; background: #f3f6fa; border-left: 3px solid #1d4e89; padding: 2mm 3mm; margin-bottom: 4mm; }

.q { display: grid; grid-template-columns: 9mm 1fr; margin-bottom: 5.5mm; break-inside: avoid; }
.q > .n { font-weight: bold; font-size: 11.5pt; }
.q p { margin: 0 0 2mm; }
.opts { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1mm 4mm; margin-top: 1.5mm; }
.opts.two { grid-template-columns: repeat(2, 1fr); }
.opts.one { grid-template-columns: 1fr; }
.opts div b { display: inline-block; width: 7mm; }
table.optt { border-collapse: collapse; margin-top: 1.5mm; font-size: 10.5pt; }
table.optt th, table.optt td { padding: 1mm 4mm; text-align: center; }
table.optt th { border-bottom: 1px solid #6b7280; font-weight: normal; color: #374151; }
table.optt td:first-child { font-weight: bold; text-align: left; padding-left: 0; }
.figc { text-align: center; margin: 2mm 0 2.5mm; }
.figc .cap { font-size: 9.5pt; color: #4b5563; margin-top: .5mm; }
.side { display: flex; gap: 5mm; align-items: center; margin-bottom: 2mm; }
.side > div:first-child { flex: 1; }
.side .figc { margin: 0; }
.figrow { display: flex; justify-content: space-around; align-items: flex-end; flex-wrap: wrap; gap: 3mm; margin: 2mm 0; }

.sq { display: grid; grid-template-columns: 9mm 1fr; margin-bottom: 4mm; }
.sq > .n { font-weight: bold; font-size: 12pt; }
.part { display: grid; grid-template-columns: 8mm 1fr; margin: 2mm 0; break-inside: avoid; }
.part .pl { font-weight: bold; }
.subp { display: grid; grid-template-columns: 9mm 1fr; margin: 2mm 0 2mm 8mm; break-inside: avoid; }
.subp .pl { font-weight: normal; }
.mk { float: right; font-weight: bold; margin-left: 3mm; }
.lines div { border-bottom: 1px dotted #6b7280; height: 8.5mm; }
.ans { text-align: right; margin-top: 3mm; }
.ans span.d { display: inline-block; width: 42mm; border-bottom: 1px dotted #1b1f24; margin: 0 1mm; }
.work { height: 18mm; }
.work.s { height: 12mm; }
.work.l { height: 34mm; }
.qtot { text-align: right; font-size: 10pt; color: #4b5563; border-top: 1px solid #d1d5db; padding-top: 1mm; margin-top: 2mm; }

table.res { border-collapse: collapse; margin: 2mm auto; font-size: 10.5pt; }
table.res th, table.res td { border: 1.2px solid #1b1f24; padding: 1.8mm 4mm; text-align: center; min-width: 17mm; }
table.res th { background: #eef2f7; font-weight: normal; }
table.res td.blank { background: #fff; }
.end { text-align: center; margin-top: 8mm; font-weight: bold; letter-spacing: .3em; }

/* mark scheme */
.ms-head { background: #7a1d16; }
table.ms { border-collapse: collapse; width: 100%; font-size: 10pt; margin-bottom: 5mm; }
table.ms th { background: #1d4e89; color: #fff; padding: 1.8mm 2mm; text-align: left; font-weight: bold; }
table.ms td { border-bottom: 1px solid #d1d5db; padding: 1.8mm 2mm; vertical-align: top; }
table.ms td.c { text-align: center; font-weight: bold; white-space: nowrap; }
table.ms td.g { color: #4b5563; font-size: 9.5pt; }
table.ms tr.qh td { background: #eef2f7; font-weight: bold; border-bottom: 1px solid #9aa4b1; }
table.ms tr { break-inside: avoid; }
.key { display: grid; grid-template-columns: repeat(5, 1fr); gap: 2mm; margin-bottom: 4mm; }
.key div { border: 1px solid #9aa4b1; border-radius: 1.5mm; padding: 1.5mm; text-align: center; font-size: 10pt; }
.key div b { display: block; font-size: 15pt; color: #1d4e89; }
.codes { font-size: 9.5pt; color: #374151; }
.codes td { padding: .6mm 3mm .6mm 0; vertical-align: top; }
"""

DATA = """
<div class="box data">
 <h3>Data and formulae</h3>
 <table>
  <tr><td>Coulomb constant</td><td><i class="v">k</i> = 1/(4π<i class="v">ε</i><sub>0</sub>) = 8.99 × 10<sup>9</sup> N m<sup>2</sup> C<sup>−2</sup></td></tr>
  <tr><td>1 μC (microcoulomb)</td><td>1 × 10<sup>−6</sup> C</td></tr>
  <tr><td>Average speed / velocity</td><td><i class="v">v</i> = <i class="v">s</i> / <i class="v">t</i></td></tr>
  <tr><td>Acceleration</td><td><i class="v">a</i> = (<i class="v">v</i> − <i class="v">u</i>) / <i class="v">t</i></td></tr>
  <tr><td>Uniformly accelerated motion</td><td><i class="v">s</i> = <i class="v">ut</i> + ½<i class="v">at</i><sup>2</sup></td></tr>
  <tr><td>Components of a vector <i class="v">F</i> at angle <i class="v">θ</i> to the horizontal</td><td><i class="v">F</i><sub>x</sub> = <i class="v">F</i> cos <i class="v">θ</i>, &nbsp; <i class="v">F</i><sub>y</sub> = <i class="v">F</i> sin <i class="v">θ</i></td></tr>
  <tr><td>Coulomb's law</td><td><i class="v">F</i> = <i class="v">Q</i><sub>1</sub><i class="v">Q</i><sub>2</sub> / (4π<i class="v">ε</i><sub>0</sub><i class="v">r</i><sup>2</sup>)</td></tr>
 </table>
</div>
"""


def S(svgstr, k):
    """Scale an inline SVG figure by factor k."""
    def rep(m):
        return f'width="{float(m.group(1)) * k:.0f}" height="{float(m.group(2)) * k:.0f}"'
    return re.sub(r'width="([\d.]+)" height="([\d.]+)"', rep, svgstr, count=1)


def lines(n):
    return '<div class="lines">' + "<div></div>" * n + "</div>"


def ans(label, unit, mk):
    return f'<div class="ans">{label} = <span class="d"></span> {unit} <span class="mk">[{mk}]</span></div>'


def mcq(n, stem, opts, fig="", layout="", table=None):
    if table:
        head, rows = table
        o = '<table class="optt"><tr><th></th>' + "".join(f"<th>{h}</th>" for h in head) + "</tr>"
        for L, r in zip("ABCD", rows):
            o += f"<tr><td>{L}</td>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>"
        o += "</table>"
    else:
        o = f'<div class="opts {layout}">' + "".join(f"<div><b>{L}</b>{x}</div>" for L, x in zip("ABCD", opts)) + "</div>"
    f = f'<div class="figc">{fig}</div>' if fig else ""
    return f'<div class="q"><div class="n">{n}</div><div>{stem}{f}{o}</div></div>'


# ======================================================================== PAPER
def cover():
    rows = [("A", "Multiple choice (P1)", "1 – 15", 15),
            ("B", "Structured (P2)", "16", 6),
            ("", "", "17", 6), ("", "", "18", 6), ("", "", "19", 7),
            ("C", "Practical skills (P3)", "20", 10)]
    tr = ""
    for s, d, q, m in rows:
        tr += f'<tr><td>{s}</td><td class="l" style="white-space:nowrap">{d}</td><td style="white-space:nowrap">{q}</td><td>{m}</td><td></td></tr>'
    return f"""
<section class="cover">
 <div class="band">
  <div class="school">School Examination &nbsp;·&nbsp; Grade 11</div>
  <h1>AS Level Physics</h1>
  <div class="sub">Kinematics, Vectors and Electrostatic Force</div>
  <div class="meta">
   <div><b>Duration</b>1 hour 15 minutes</div>
   <div><b>Total</b>50 marks</div>
   <div><b>Sections</b>A · B · C</div>
   <div><b>Materials</b>Calculator, ruler, pencil, protractor</div>
  </div>
 </div>
 <div class="cand"><div>Candidate name</div><div>Class</div><div>Date</div></div>
 <div class="cover-grid">
  <div class="box">
   <h3>Instructions</h3>
   <ul>
    <li>Answer <b>all</b> questions in all three sections.</li>
    <li><b>Section A:</b> for each question choose <b>one</b> answer, A, B, C or D, and circle it clearly.</li>
    <li><b>Sections B and C:</b> write your answers in the spaces provided. Show all your working — marks are given for correct method.</li>
    <li>Give numerical answers to an appropriate number of significant figures, with units.</li>
    <li>You may use a calculator. Take <i class="v">k</i> = 8.99 × 10<sup>9</sup> N m<sup>2</sup> C<sup>−2</sup>.</li>
    <li>The number of marks is given in brackets [ ] at the end of each question or part question.</li>
    <li>Diagrams are <b>not</b> drawn to scale unless stated.</li>
   </ul>
  </div>
  <div>
   <table class="exr">
    <tr><th>Section</th><th>Paper style</th><th>Q</th><th>Max</th><th>Mark</th></tr>
    {tr}
    <tr class="tot"><td colspan="3">Total</td><td>50</td><td></td></tr>
   </table>
   <p style="font-size:9.5pt;color:#4b5563;margin-top:3mm">Weighting: Section A 30% · Section B 50% · Section C 20%</p>
  </div>
 </div>
 {DATA}
</section>"""


def section_a():
    q = []
    q.append(mcq(1, "<p>Which quantity is a <b>vector</b>?</p>", ["distance", "speed", "time", "displacement"]))
    q.append(mcq(2, "<p>An athlete runs exactly one lap of the 400 m track shown, starting and finishing at the same point. The lap takes 80 s.</p>",
                 None, fig=S(F.fig_track(), 0.72),
                 table=(["average speed / m s<sup>−1</sup>", "average velocity / m s<sup>−1</sup>"],
                        [["5.0", "0"], ["0", "5.0"], ["5.0", "5.0"], ["0", "0"]])))
    q.append(mcq(3, "<p>A student walks 400 m due east and then 300 m due west along the same straight path.</p>",
                 None, fig=S(F.fig_walk(), 0.9),
                 table=(["total distance travelled", "final displacement from start"],
                        [["100 m", "700 m east"], ["700 m", "100 m east"], ["700 m", "700 m east"], ["100 m", "100 m east"]]),
                 ))
    q.append(mcq(4, "<p>The displacement–time graph shows the motion of a toy car along a straight track. It has three sections, P, Q and R.</p>",
                 ["−4.0 m s<sup>−1</sup>", "−3.0 m s<sup>−1</sup>", "0", "+4.0 m s<sup>−1</sup>"],
                 fig=S(F.fig_st(), 0.85)).replace("</div></div>", "</div></div>", 1)
             .replace('<div class="opts ">', '<p>What is the velocity of the car during section R?</p><div class="opts ">'))
    q.append(mcq(5, "<p>A car accelerates uniformly from 5.0 m s<sup>−1</sup> to 25 m s<sup>−1</sup> in 8.0 s. What is its acceleration?</p>",
                 ["0.40 m s<sup>−2</sup>", "2.5 m s<sup>−2</sup>", "3.1 m s<sup>−2</sup>", "3.8 m s<sup>−2</sup>"]))
    minis = '<div class="figrow">' + F.mini("s-line", "A") + F.mini("v-flat", "B") + F.mini("v-line", "C") + F.mini("s-flat", "D") + "</div>"
    q.append(f'<div class="q"><div class="n">6</div><div><p>Which graph shows an object moving with a <b>constant, non-zero acceleration</b>? '
             f'(<i class="v">s</i> = displacement, <i class="v">v</i> = velocity, <i class="v">t</i> = time)</p>{minis}</div></div>')
    q.append(mcq(7, "<p>A car travels 30 km in 0.50 h and then a further 30 km in 1.0 h. What is its average speed for the whole journey?</p>",
                 ["30 km h<sup>−1</sup>", "36 km h<sup>−1</sup>", "40 km h<sup>−1</sup>", "45 km h<sup>−1</sup>"]))
    q.append(mcq(8, "<p>A force <i class='v'>F</i> acts at an angle <i class='v'>θ</i> to the <b>vertical</b>, as shown.</p>",
                 None, fig=S(F.fig_force_vertical(), 0.85),
                 table=(["horizontal component", "vertical component"],
                        [["<i class='v'>F</i> sin <i class='v'>θ</i>", "<i class='v'>F</i> cos <i class='v'>θ</i>"],
                         ["<i class='v'>F</i> cos <i class='v'>θ</i>", "<i class='v'>F</i> sin <i class='v'>θ</i>"],
                         ["<i class='v'>F</i> tan <i class='v'>θ</i>", "<i class='v'>F</i>"],
                         ["<i class='v'>F</i> cos <i class='v'>θ</i>", "<i class='v'>F</i> cos <i class='v'>θ</i>"]])))
    q.append(mcq(9, "<p>Two forces of 5.0 N and 8.0 N act at right angles on a point O. What is the magnitude of the resultant force?</p>",
                 ["3.0 N", "6.5 N", "9.4 N", "13 N"], fig=S(F.fig_perp(), 0.85)))
    q.append(mcq(10, "<p>A ball moves with a velocity of 15 m s<sup>−1</sup>. The vertical component of this velocity is 9.0 m s<sup>−1</sup>. What is the horizontal component?</p>",
                 ["6.0 m s<sup>−1</sup>", "12 m s<sup>−1</sup>", "17.5 m s<sup>−1</sup>", "24 m s<sup>−1</sup>"], fig=S(F.fig_velocity_components(), 0.9)))
    q.append(mcq(11, "<p>Two forces of 5.0 N and 12 N act at the same point. The angle between them can be changed. Which value <b>cannot</b> be the magnitude of their resultant?</p>",
                 ["7.0 N", "13 N", "17 N", "19 N"]))
    q.append(mcq(12, "<p>Two point charges exert an electrostatic force <i class='v'>F</i> on each other. The distance between them is doubled and the size of <b>one</b> of the charges is also doubled. What is the new force?</p>",
                 ["<i class='v'>F</i>/4", "<i class='v'>F</i>/2", "<i class='v'>F</i>", "2<i class='v'>F</i>"]))
    q.append(mcq(13, "<p>Two point charges are placed 0.30 m apart in air.</p>", None, fig=S(F.fig_two_charges(), 0.9),
                 table=(["magnitude of force on each charge", "type of force"],
                        [["0.60 N", "repulsive"], ["0.18 N", "attractive"], ["0.18 N", "repulsive"], ["0.60 N", "attractive"]])))
    q.append(mcq(14, "<p>Two positive charges +9<i class='v'>q</i> and +<i class='v'>q</i> are fixed at X and Y, a distance 4<i class='v'>d</i> apart. "
                     "A small positive charge placed at point P on the line XY experiences <b>zero</b> resultant force. How far is P from Y?</p>",
                 ["1.0<i class='v'>d</i>", "2.0<i class='v'>d</i>", "3.0<i class='v'>d</i>", "3.6<i class='v'>d</i>"], fig=S(F.fig_line_zero(), 0.95)))
    q.append(mcq(15, "<p>Three charges are placed at the corners of a right-angled triangle. The two charges +<i class='v'>Q</i> are each a distance <i class='v'>r</i> from the charge +<i class='v'>q</i>. "
                     "Each charge +<i class='v'>Q</i> on its own exerts a force of magnitude <i class='v'>F</i> on +<i class='v'>q</i>. What is the magnitude of the resultant force on +<i class='v'>q</i>?</p>",
                 ["0", "<i class='v'>F</i>", "√2 <i class='v'>F</i>", "2<i class='v'>F</i>"], fig=S(F.fig_triangle_equal(), 0.9)))
    head = ('<div class="section"><h2>Section A &nbsp;·&nbsp; Multiple choice</h2><div class="info">15 questions · 1 mark each · 15 marks</div></div>'
            '<div class="lead">For each question there are four possible answers, <b>A</b>, <b>B</b>, <b>C</b> and <b>D</b>. Choose the <b>one</b> you consider correct and circle it.</div>')
    return '<section class="page-break">' + head + "".join(q) + "</section>"


def part(label, body, sub=False):
    cls = "subp" if sub else "part"
    return f'<div class="{cls}"><div class="pl">({label})</div><div>{body}</div></div>'


def section_b():
    head = ('<div class="section"><h2>Section B &nbsp;·&nbsp; Structured questions</h2><div class="info">Answer all questions · 25 marks</div></div>'
            '<div class="lead">Write your answers in the spaces provided. Show your working clearly in all calculations.</div>')
    q16 = f"""
<div class="sq"><div class="n">16</div><div>
<div class="side"><div><p>A cyclist rides from P to Q and then from Q to R along the two straight roads shown on the map in Fig. 16.1.</p><p>The road PQ points due east and the road QR points due north.</p><p>The distance and the time taken for each stage are shown on the map.</p></div>
<div class="figc">{S(F.fig_map(), 0.72)}<div class="cap">Fig. 16.1 (not to scale)</div></div></div>
{part("a", 'State <b>one</b> difference between <i>distance</i> and <i>displacement</i>.<span class="mk">[1]</span>' + lines(2))}
{part("b", 'Calculate the total distance travelled by the cyclist from P to R.' + '<div class="work s"></div>' + ans("distance", "m", 1))}
{part("c", 'Calculate the magnitude and the direction of the cyclist’s displacement from P to R. Give the direction as an angle measured from due east.' + '<div class="work s"></div>'
       + ans("magnitude", "m", "") .replace('<span class="mk">[]</span>', '') + ans("direction", "° north of east", 2))}
{part("d", 'Calculate, for the whole journey from P to R,')}
{part("i", 'the average speed,' + '<div class="work s"></div>' + ans("average speed", "m s<sup>−1</sup>", 1), sub=True)}
{part("ii", 'the magnitude of the average velocity.' + '<div class="work s"></div>' + ans("average velocity", "m s<sup>−1</sup>", 1), sub=True)}
<div class="qtot">[Total: 6]</div>
</div></div>"""

    q17 = f"""
<div class="sq page-break"><div class="n">17</div><div>
<p>A train moves along a straight, level track between two stations. Fig. 17.1 shows how its velocity changes with time.</p>
<div class="figc">{S(F.fig_vt(), 0.85)}<div class="cap">Fig. 17.1</div></div>
{part("a", 'Define <i>acceleration</i>.<span class="mk">[1]</span>' + lines(2))}
{part("b", 'Use Fig. 17.1 to calculate the acceleration of the train')}
{part("i", 'from time <i class="v">t</i> = 0 to <i class="v">t</i> = 10 s,' + '<div class="work s"></div>' + ans("acceleration", "m s<sup>−2</sup>", 1), sub=True)}
{part("ii", 'from time <i class="v">t</i> = 30 s to <i class="v">t</i> = 35 s.' + '<div class="work s"></div>' + ans("acceleration", "m s<sup>−2</sup>", 1), sub=True)}
{part("c", 'Determine the total displacement of the train in the 35 s journey.' + '<div class="work"></div>' + ans("displacement", "m", 2))}
{part("d", 'Hence calculate the average velocity of the train for the journey.' + '<div class="work s"></div>' + ans("average velocity", "m s<sup>−1</sup>", 1))}
<div class="qtot">[Total: 6]</div>
</div></div>"""

    q18 = f"""
<div class="sq page-break"><div class="n">18</div><div>
{part("a", 'State the difference between a <i>scalar</i> quantity and a <i>vector</i> quantity.<span class="mk">[1]</span>' + lines(2))}
{part("b", f'<div class="side"><div>A child pulls a loaded sledge across level snow using a rope. The tension in the rope is 50 N and the rope makes an angle of 35° with the horizontal, as shown in Fig. 18.1.<br><br>Calculate</div><div class="figc">{S(F.fig_sledge(), 0.72)}<div class="cap">Fig. 18.1</div></div></div>')}
{part("i", 'the horizontal component of the tension,' + '<div class="work s"></div>' + ans("horizontal component", "N", 1), sub=True)}
{part("ii", 'the vertical component of the tension.' + '<div class="work s"></div>' + ans("vertical component", "N", 1), sub=True)}
{part("c", f'<div class="side"><div>A drone moves with a horizontal velocity component of 15 m s<sup>−1</sup> and a vertical (upward) velocity component of 6.0 m s<sup>−1</sup>, as shown in Fig. 18.2.<br><br>Combine the two components to determine the resultant velocity of the drone. Give its magnitude and the angle it makes with the horizontal.</div><div class="figc">{S(F.fig_drone(), 0.85)}<div class="cap">Fig. 18.2</div></div></div>'
       + '<div class="work"></div>' + ans("magnitude", "m s<sup>−1</sup>", "").replace('<span class="mk">[]</span>', '') + ans("angle to horizontal", "°", 3))}
<div class="qtot">[Total: 6]</div>
</div></div>"""

    q19 = f"""
<div class="sq page-break"><div class="n">19</div><div>
{part("a", 'State Coulomb’s law.<span class="mk">[1]</span>' + lines(2))}
{part("b", f'Three point charges A, B and C are fixed in a straight line, as shown in Fig. 19.1.<div class="figc">{S(F.fig_three_line(), 0.95)}<div class="cap">Fig. 19.1</div></div>')}
{part("i", 'Calculate the magnitude of the force on B due to A.' + '<div class="work s"></div>' + ans("force due to A", "N", 1), sub=True)}
{part("ii", 'Calculate the magnitude of the force on B due to C.' + '<div class="work s"></div>' + ans("force due to C", "N", 1), sub=True)}
{part("iii", 'Determine the magnitude and the direction of the resultant force on B.' + '<div class="work s"></div>' + ans("resultant force", "N", "").replace('<span class="mk">[]</span>', '') + '<div class="ans">direction: <span class="d" style="width:60mm"></span> <span class="mk">[1]</span></div>', sub=True)}
<div class="qtot" style="border:none;color:#9aa4b1">Question 19 continues on the next page.</div>
</div></div>
<div class="sq page-break"><div class="n"></div><div>
{part("c", f'Three point charges are fixed at the corners X, O and Y of a right-angled triangle, as shown in Fig. 19.2. The angle at O is 90°.<div class="figc">{S(F.fig_triangle_numeric(), 0.88)}<div class="cap">Fig. 19.2</div></div>')}
{part("i", 'Calculate the force on the charge at O due to the charge at X, and the force on the charge at O due to the charge at Y.' + '<div class="work"></div>' + ans("force due to X", "N", "").replace('<span class="mk">[]</span>', '') + ans("force due to Y", "N", 1), sub=True)}
{part("ii", 'On Fig. 19.2, draw arrows to show the directions of these two forces on the charge at O. Then determine the magnitude of the resultant force on the charge at O and the angle it makes with the line OY.' + '<div class="work"></div>' + ans("resultant force", "N", "").replace('<span class="mk">[]</span>', '') + ans("angle with OY", "°", 2), sub=True)}
<div class="qtot">[Total: 7]</div>
</div></div>"""
    return '<section class="page-break">' + head + q16 + q17 + q18 + q19 + "</section>"


def section_c():
    head = ('<div class="section"><h2>Section C &nbsp;·&nbsp; Practical skills</h2><div class="info">1 question · 10 marks</div></div>')
    rows = ""
    for i, (d, a, b, c) in enumerate(F.PRACT):
        if i < 3:
            m = (a + b + c) / 3
            mean = f"{m:.2f}"
            sq = f"{float(mean) ** 2:.2f}"
        else:
            mean = sq = ""
        cls = ' class="blank"' if not mean else ""
        rows += f"<tr><td>{d:.2f}</td><td>{a:.2f}</td><td>{b:.2f}</td><td>{c:.2f}</td><td{cls}>{mean}</td><td{cls}>{sq}</td></tr>"
    q20 = f"""
<div class="sq"><div class="n">20</div><div>
<p>A student investigates the motion of a ball rolling down a straight ramp. The ball is released from rest at the start line and the student uses a stopwatch to measure the time <i class="v">t</i> for the ball to roll a distance <i class="v">d</i> to the finish line.
The finish line is moved and the experiment repeated for different values of <i class="v">d</i>. Each time is measured three times.</p>
<div class="figc">{S(F.fig_ramp(), 0.9)}<div class="cap">Fig. 20.1</div></div>
<p>The ball moves with constant acceleration <i class="v">a</i>, so <i class="v">d</i> and <i class="v">t</i> are related by <i class="v">d</i> = ½<i class="v">at</i><sup>2</sup>. The student’s results are shown in Table 20.1.</p>
<table class="res">
 <tr><th><i class="v">d</i> / m</th><th><i class="v">t</i><sub>1</sub> / s</th><th><i class="v">t</i><sub>2</sub> / s</th><th><i class="v">t</i><sub>3</sub> / s</th><th>mean <i class="v">t</i> / s</th><th><i class="v">t</i><sup>2</sup> / s<sup>2</sup></th></tr>
 {rows}
</table>
<div class="figc"><div class="cap">Table 20.1</div></div>
{part("a", 'Complete Table 20.1 by calculating the mean value of <i class="v">t</i> and the value of <i class="v">t</i><sup>2</sup> for <i class="v">d</i> = 0.80 m and <i class="v">d</i> = 1.00 m.<span class="mk">[2]</span>')}
{part("b", 'On the grid in Fig. 20.2, plot a graph of <i class="v">d</i> on the y-axis against <i class="v">t</i><sup>2</sup> on the x-axis. Draw the straight line of best fit.<span class="mk">[2]</span>')}
<div class="figc">{F.practical_graph()}<div class="cap">Fig. 20.2</div></div>
{part("c", 'Determine the gradient of your line. Show clearly the values you use.' + '<div class="work l"></div>' + ans("gradient", "m s<sup>−2</sup>", 2))}
{part("d", 'Use your answer to (c) and the equation <i class="v">d</i> = ½<i class="v">at</i><sup>2</sup> to determine the acceleration <i class="v">a</i> of the ball.' + '<div class="work s"></div>' + ans("<i class='v'>a</i>", "m s<sup>−2</sup>", 1))}
{part("e", 'For <i class="v">d</i> = 0.80 m, the student takes the uncertainty in <i class="v">t</i> to be half the range of the three readings.')}
{part("i", 'Determine the absolute uncertainty in <i class="v">t</i> for <i class="v">d</i> = 0.80 m.' + '<div class="work s"></div>' + ans("uncertainty", "s", 1), sub=True)}
{part("ii", 'Calculate the percentage uncertainty in the mean value of <i class="v">t</i> for <i class="v">d</i> = 0.80 m.' + '<div class="work s"></div>' + ans("percentage uncertainty", "%", 1), sub=True)}
{part("f", 'Measuring <i class="v">t</i> with a hand-held stopwatch is a source of uncertainty. Suggest <b>one</b> improvement to the method that would make the measurements of <i class="v">t</i> more reliable.<span class="mk">[1]</span>' + lines(2))}
<div class="qtot">[Total: 10]</div>
</div></div>
<div class="end">END OF EXAMINATION</div>"""
    return '<section class="page-break">' + head + q20 + "</section>"


def page(title, body):
    return (f'<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>{title}</title>'
            f"<style>{CSS}</style></head><body>{F.DEFS}{body}</body></html>")


# ======================================================================== MARK SCHEME
KEY = ["D", "A", "B", "A", "B", "C", "C", "A", "C", "B", "D", "B", "D", "A", "C"]
WHY = [
    "Displacement has magnitude and direction.",
    "Speed = 400/80 = 5.0 m s⁻¹; back at start so displacement and velocity = 0.",
    "Distance = 400 + 300 = 700 m; displacement = 400 − 300 = 100 m east.",
    "Gradient of R = (0 − 12)/(10 − 7) = −4.0 m s⁻¹.",
    "a = (25 − 5.0)/8.0 = 2.5 m s⁻².",
    "Constant acceleration ⇒ straight sloping v–t line.",
    "Total distance/total time = 60/1.5 = 40 km h⁻¹ (not the mean of 60 and 30).",
    "θ is measured from the vertical, so vertical = F cos θ, horizontal = F sin θ.",
    "√(5.0² + 8.0²) = √89 = 9.4 N.",
    "√(15² − 9.0²) = √144 = 12 m s⁻¹.",
    "Resultant lies between 12 − 5 = 7 N and 12 + 5 = 17 N.",
    "F ∝ Q₁Q₂/r²: ×2 ÷ 2² = ×½.",
    "F = 8.99×10⁹ × 2.0×10⁻⁶ × 3.0×10⁻⁶ / 0.30² = 0.60 N; unlike charges attract.",
    "9q/x² = q/(4d − x)² ⇒ x = 3d from X, so P is d from Y.",
    "Two perpendicular forces of size F: √(F² + F²) = √2 F.",
]
TOPIC = ["Vectors/scalars", "Speed & velocity", "Distance & displacement", "Velocity from s–t graph", "Acceleration",
         "Motion graphs", "Average speed", "Resolving vectors", "Combining vectors", "Combining/resolving",
         "Resultant range", "Coulomb's law (ratio)", "Coulomb's law (2 charges)", "Coulomb's law (3 charges, line)",
         "Coulomb's law (triangle)"]


def ms_rows(qname, rows):
    h = f'<tr class="qh"><td colspan="4">{qname}</td></tr>'
    for r in rows:
        p, a, m, g = r
        h += f'<tr><td class="c">{p}</td><td>{a}</td><td class="c">{m}</td><td class="g">{g}</td></tr>'
    return h


def mark_scheme():
    keyhtml = '<div class="key">' + "".join(
        f'<div>Q{i + 1}<b>{k}</b></div>' for i, k in enumerate(KEY)) + "</div>"
    why = '<table class="ms"><tr><th style="width:9%">Q</th><th style="width:7%">Key</th><th style="width:25%">Topic</th><th>Reasoning</th></tr>'
    for i, (k, w, tp) in enumerate(zip(KEY, WHY, TOPIC)):
        why += f'<tr><td class="c">{i + 1}</td><td class="c">{k}</td><td>{tp}</td><td>{w}</td></tr>'
    why += "</table>"

    T = '<table class="ms"><tr><th style="width:9%">Part</th><th>Answer / marking points</th><th style="width:9%">Marks</th><th style="width:30%">Guidance</th></tr>'
    b = T
    b += ms_rows("Question 16 — distance, displacement, speed and velocity", [
        ("(a)", "Distance is a scalar (magnitude only) / total path length; displacement is a vector (has direction) / straight-line distance from start to finish.", "B1", "Any one valid difference."),
        ("(b)", "600 + 800 = 1400 m", "A1", ""),
        ("(c)", "displacement = √(600² + 800²) = 1000 m", "A1", "Allow 1.0 km."),
        ("", "angle = tan⁻¹(800/600) = 53° north of east", "B1", "Allow 53.1°; allow bearing 037°."),
        ("(d)(i)", "average speed = 1400 / 320 = 4.4 m s⁻¹", "A1", "Total time 120 + 200 = 320 s. Allow 4.375. ECF from (b)."),
        ("(d)(ii)", "average velocity = 1000 / 320 = 3.1 m s⁻¹", "A1", "Allow 3.125. ECF from (c)."),
    ])
    b += '<tr><td></td><td style="text-align:right;font-weight:bold">Total</td><td class="c">6</td><td></td></tr>'
    b += ms_rows("Question 17 — acceleration and the velocity–time graph", [
        ("(a)", "Rate of change of velocity / change in velocity ÷ time taken.", "B1", "Not ‘change in speed’ / ‘velocity per time’."),
        ("(b)(i)", "a = (20 − 0)/10 = 2.0 m s⁻²", "A1", ""),
        ("(b)(ii)", "a = (0 − 20)/5.0 = −4.0 m s⁻²", "A1", "Allow ‘deceleration of 4.0 m s⁻²’. Sign or the word deceleration needed."),
        ("(c)", "Displacement = area under graph: ½×10×20 + 20×20 + ½×5×20", "C1", "Allow trapezium: ½(20 + 35) × 20."),
        ("", "= 100 + 400 + 50 = 550 m", "A1", ""),
        ("(d)", "average velocity = 550 / 35 = 16 m s⁻¹", "A1", "Allow 15.7. ECF from (c)."),
    ])
    b += '<tr><td></td><td style="text-align:right;font-weight:bold">Total</td><td class="c">6</td><td></td></tr>'
    b += ms_rows("Question 18 — resolving and combining vectors", [
        ("(a)", "A scalar has magnitude only; a vector has magnitude and direction.", "B1", "Both parts needed."),
        ("(b)(i)", "50 cos 35° = 41 N", "A1", "Allow 40.96."),
        ("(b)(ii)", "50 sin 35° = 29 N", "A1", "Allow 28.7."),
        ("(c)", "v = √(15² + 6.0²)", "C1", "Pythagoras with both components."),
        ("", "= √261 = 16 m s⁻¹", "A1", "Allow 16.2."),
        ("", "θ = tan⁻¹(6.0/15) = 22° above the horizontal", "B1", "Allow 21.8°."),
    ])
    b += '<tr><td></td><td style="text-align:right;font-weight:bold">Total</td><td class="c">6</td><td></td></tr>'
    b += ms_rows("Question 19 — Coulomb’s law: charges in a line and on a right-angled triangle", [
        ("(a)", "The force between two point charges is proportional to the product of the charges and inversely proportional to the square of their separation.", "B1", "Allow F = kQ₁Q₂/r² with symbols defined."),
        ("(b)(i)", "F<sub>AB</sub> = 8.99×10⁹ × 3.0×10⁻⁶ × 2.0×10⁻⁶ / 0.10² = 5.4 N", "A1", "5.39 N; repulsive, so it acts on B away from A (to the right)."),
        ("(b)(ii)", "F<sub>CB</sub> = 8.99×10⁹ × 2.0×10⁻⁶ × 4.0×10⁻⁶ / 0.20² = 1.8 N", "A1", "1.80 N; attractive, so it acts on B towards C (to the right)."),
        ("(b)(iii)", "Both forces act in the same direction: 5.4 + 1.8 = 7.2 N, to the right (from A towards C).", "B1", "Magnitude and direction both needed. ECF from (i) and (ii). Answer 3.6 N (subtracting) scores 0."),
        ("(c)(i)", "F<sub>X</sub> = 8.99×10⁹ × 3.0×10⁻⁶ × 2.0×10⁻⁶ / 0.30² = 0.60 N and F<sub>Y</sub> = 8.99×10⁹ × 3.0×10⁻⁶ × 2.0×10⁻⁶ / 0.40² = 0.34 N", "B1", "Both values needed for the mark (0.599 N and 0.337 N)."),
        ("(c)(ii)", "F<sub>X</sub> drawn away from X (downwards); F<sub>Y</sub> drawn towards Y (to the right). Resultant = √(0.60² + 0.34²) = 0.69 N", "B1", "Arrows correct and resultant magnitude 0.68–0.69 N. ECF from (i)."),
        ("", "angle = tan⁻¹(0.60/0.34) = 61° below the line OY", "B1", "Allow 60°–61°. Allow 29°–30° measured from the downward vertical if clearly stated."),
    ])
    b += '<tr><td></td><td style="text-align:right;font-weight:bold">Total</td><td class="c">7</td><td></td></tr>'
    b += "</table>"

    c = T
    c += ms_rows("Question 20 — practical skills: ball rolling down a ramp", [
        ("(a)", "Mean t: 1.63 s (d = 0.80 m) and 1.83 s (d = 1.00 m)", "B1", "Both means correct, given to 2 d.p. (same as raw data)."),
        ("", "t²: 2.66 s² and 3.35 s²", "B1", "Both values correct to 3 s.f. ECF from mean t."),
        ("(b)", "All five points plotted correctly to within half a small square.", "B1", "Points from the student’s own table (ECF)."),
        ("", "Single thin straight line of best fit with points balanced either side; line passes through (or very close to) the origin.", "B1", "No ‘dot-to-dot’ or thick lines."),
        ("(c)", "Triangle uses points on the line, hypotenuse at least half the length of the line, values read correctly, e.g. Δd/Δ(t²) = 0.840/2.80", "C1", "Do not allow use of table values unless they lie on the line."),
        ("", "gradient = 0.30 m s⁻²", "A1", "Accept 0.29 – 0.31."),
        ("(d)", "gradient = a/2 ⇒ a = 2 × 0.30 = 0.60 m s⁻²", "A1", "Accept 0.58 – 0.62. ECF from (c)."),
        ("(e)(i)", "Δt = (1.66 − 1.61)/2 = 0.025 s (≈ 0.03 s)", "A1", "Allow 0.025 or 0.03."),
        ("(e)(ii)", "% uncertainty = 0.025/1.63 × 100 = 1.5 %", "A1", "Allow 1.5 – 1.8 % (1.8 % if 0.03 s used). ECF from (i)."),
        ("(f)", "Any one: use light gates connected to a timer/data-logger; video the motion and use frame-by-frame playback; use larger distances so times are longer (smaller % uncertainty); take more repeat readings and average.", "B1", "Must be a clear improvement to the timing. ‘Be more careful’ / ‘use a better stopwatch’ scores 0."),
    ])
    c += '<tr><td></td><td style="text-align:right;font-weight:bold">Total</td><td class="c">10</td><td></td></tr></table>'

    graph = f'<div class="figc">{S(F.practical_graph(answers=True), 0.78)}<div class="cap">Model answer for 20(b) and (c): points ×, best-fit line through the origin and a large gradient triangle (gradient = 0.840 / 2.80 = 0.30 m s<sup>−2</sup>).</div></div>'

    grid_rows = [
        ("Speed, velocity &amp; acceleration", "4, 5, 6, 7", "16(d), 17", "20(a)–(d)", 5 + 8 + 5),
        ("Distance &amp; displacement", "2, 3", "16(a)–(c)", "—", 2 + 4),
        ("Resolving &amp; combining vectors", "1, 8, 9, 10, 11", "18", "—", 5 + 6),
        ("Coulomb’s law (2 and 3 charges; line &amp; triangle)", "12, 13, 14, 15", "19", "—", 4 + 7),
        ("Experimental skills (data, graphs, uncertainty, improvements)", "—", "—", "20(a)–(f)", 0),
    ]
    spec = '<table class="exr" style="margin-bottom:5mm"><tr><th>Topic / skill</th><th>Section A (MCQ)</th><th>Section B (Structured)</th><th>Section C (Practical)</th></tr>'
    for tp, a, bq, cq, _ in grid_rows:
        spec += f'<tr><td class="l">{tp}</td><td>{a}</td><td>{bq}</td><td>{cq}</td></tr>'
    spec += '<tr class="tot"><td class="l">Marks</td><td>15 (30%)</td><td>25 (50%)</td><td>10 (20%)</td></tr></table>'

    codes = """<table class="codes"><tr><td><b>B1</b></td><td>Independent mark for a correct statement or value.</td></tr>
<tr><td><b>C1</b></td><td>Compensatory mark for correct working — awarded automatically if the final answer is correct.</td></tr>
<tr><td><b>A1</b></td><td>Accuracy mark for a correct final answer (and unit where asked).</td></tr>
<tr><td><b>ECF</b></td><td>Error carried forward — allow a correct method using an earlier wrong value.</td></tr></table>"""

    body = f"""
<section>
 <div class="band ms-head">
  <div class="school">Confidential · For teachers only</div>
  <h1>Mark Scheme</h1>
  <div class="sub">Grade 11 AS Level Physics · School Examination · 50 marks</div>
  <div class="meta"><div><b>Section A</b>15 marks</div><div><b>Section B</b>25 marks</div><div><b>Section C</b>10 marks</div></div>
 </div>
 <div class="box" style="margin:5mm 0">
  <h3>Assessment map</h3>
  {spec}
  <h3>Marking codes</h3>
  {codes}
  <p style="font-size:9.5pt;color:#374151;margin:2mm 0 0">Accept answers to 2 or 3 significant figures unless the guidance says otherwise. Penalise a missing or wrong unit only where the answer line does not already give it.</p>
 </div>
</section>
<section class="page-break">
 <div class="section"><h2>Section A — answer key</h2><div class="info">1 mark each · 15 marks</div></div>
 {keyhtml}
 {why}
 <p style="font-size:9.5pt;color:#374151">Key distribution: A ×4, B ×4, C ×4, D ×3.</p>
</section>
<section class="page-break">
 <div class="section"><h2>Section B — structured questions</h2><div class="info">25 marks</div></div>
 {b}
</section>
<section class="page-break">
 <div class="section"><h2>Section C — practical skills</h2><div class="info">10 marks</div></div>
 {c}
 {graph}
</section>"""
    return body


if __name__ == "__main__":
    exam = page("Grade 11 AS Physics – School Examination", cover() + section_a() + section_b() + section_c())
    ms = page("Grade 11 AS Physics – Mark Scheme", mark_scheme())
    open(os.path.join(OUT, "exam.html"), "w").write(exam)
    open(os.path.join(OUT, "mark_scheme.html"), "w").write(ms)
    print("built")
