# A Level bank fill (2026-11-06) — progress log

Brief: every A Level lesson except Chapter 22 gets ≥ 50 questions in its A Level
bank (`problems.curriculum_id = 'a-level'`), ~17 easy / 20 medium / 13 hard
(difficulty_level 1 / 2 / 3, marks 1–2 / 3–4 / 5–7), each with worked solution +
mark scheme in `explanation`. Chapter 22 (22.1–22.5) is never touched
(fingerprint in ch22-baseline.json). 16.1 (55 existing) only gets mark schemes.

## Workflow per chapter file
1. Write `chNN.py` (lesson('key') then N()/M() calls). Plan counts per lesson: PLAN.md.
2. `python3 -I database/seeds/2026-11-06-a-level-banks.py chNN` → fix every REJECTED
   line and add questions until no lesson is "BELOW 50".
3. `npx vitest run lib/practice/__tests__/aLevelBankFill20261106Seed.test.ts`
4. commit + `git push -u origin ccr-e1e09bda-y6z7f7`; note the commit SHA and
   `md5sum sql/chNN.sql`.
5. Supabase execute_sql:
   `select net.http_get(url := 'https://raw.githubusercontent.com/Naumnditch/ashphys/<SHA>/database/seeds/2026-11-06-a-level-banks/sql/chNN.sql', timeout_milliseconds := 30000)`
   → request id; check `select status_code, octet_length(content), md5(content) from net._http_response where id = <id>`;
   then `do $$ declare body text; begin select content into body from net._http_response where id = <id> and status_code = 200; if body is null or md5(body) <> '<md5>' then raise exception 'checksum mismatch'; end if; execute body; end $$;`
   and re-count the lessons.
6. Record it below.

## Writing rules the checks enforce (learned the hard way)
- Stems must differ in wording, not just numbers (difflib ≥ 0.90 on digit-stripped
  stems = rejected). Vary the scenario and the unknown asked for.
- Every numeric solution needs a printed step `= <numbers only> = <answer>` that the
  independent parser re-evaluates to the stored answer. Standard form `a × 10ⁿ` is
  one number; `x ÷ 2π` means x/(2π); use `tan⁻¹ 0.27` for inverse trig; no letters
  inside that step. A clause tail after ':' is fine ("In units of g: 7.81 ÷ 9.81 = 0.796").
- Mark-scheme lines start `C1: ` / `M1: ` / `A1: ` / `B1: ` and total the marks;
  the final `A1: <answer>` is appended (or fills the last value-less A line).
- Answer in a unit the grader cannot convert and whose factor ≠ 1 (µF, kΩ, MeV, eV,
  days, rev min⁻¹, km s⁻¹ …) → the stem must contain that unit text. Never ask in g.
- Physical plausibility asserts where a variant could be impossible (slack strings etc.).
- No zero answers (ungradeable). Never print `X° = Y rad` as if equal numbers — write
  "60°, which is π/3 rad" or put the radian value in a separate clause. Trig in printed
  steps is in degrees (`cos 57.3°`); convert ωt in radians to degrees before printing.
- Squaring an sf() standard-form value: wrap it, `({sf(x)})²` — never `{sf(x)}²`.
- Never leave `... if False else None` draft lines (the strip step only removes single lines).
- Bash heredocs appending to chapter files must end with an `EOF` line.
- Answers below ~1e-10 in SI fail the grader's absolute epsilon (1e-12): ask "in units of 10⁻²¹ J"
  (unit '10⁻²¹ J', pass the SI value — N() scales it) or in eV / a grader prefix.
- Builder assertion failures (mark totals etc.) now appear as REJECTED lines, not crashes.
- Mark totals: listed lines must sum to marks−1 (final A1 appended) or to marks exactly.
- Run the DO block in its own execute_sql call: a failing statement later in the same batch
  rolls the whole batch back. problems.topic_id is a uuid — count by joining a VALUES list of
  (topic uuid, code) from lessons.json, not with LIKE.
- Existing rows also use difficulty_level 4 and 5; they are counted as hard (≥ 3).
- Prefixed units (nC, µC, mN, mm, ns …): pass the value in that unit (2.0 for "2.0 nC") and print a
  step that evaluates to it ("In µC: 3.0 × 10⁻⁶ × 10⁶ = 3.0"). Only '10ⁿ X' units take the SI value.
- Do not put a parenthetical straight after a printed result ("= 6.02 × 10²² (volume …)"): the
  checker reads it as part of the expression. Put side remarks in their own sentence.
- Ch22 check: run ch22-fingerprint.sql verbatim and compare with ch22-baseline.json
  (2026-11-07 after ch23: all 14 counts and hashes identical). Count lessons with
  topics.a_level_topic_code (e.g. like '24.%').

## Figures (2026-11-07)
- Columns problems.figure_svg / figure_alt: migration `database/seeds/2026-11-07-problem-figures.sql`
  (applied 2026-11-07 as Supabase migration `problem_figures`). The practice API passes them through
  lib/practice/figure.ts (sanitizer) and components/practice/QuestionFigure.tsx draws them.
- `figs/<file>.py`: `F('<stem substring>', lambda s: generator(...))`. The match must hit exactly one
  stem of that content file (otherwise FIGURE SPEC ERROR and exit 1). Numbers come from the stem via
  `grab(s, r'...')`; every value label printed on a figure (any text with a digit, unless value=False)
  must appear in the stem, or the figure is dropped with a REJECTED FIGURE line.
- Generators live in `_figs.py` (house style: one font stack, sizes 14/12, line weights 0.9/1.4/2.0/2.6,
  currentColor + --fig-* variables, viewBox only, <title>/<desc>).
- Render check (PNGs outside the repo): `FIGOUT=<scratch>/figjson python3 -I database/seeds/2026-11-06-a-level-banks.py chNN`
  then `node database/seeds/2026-11-06-a-level-banks/tools/figcheck.js <scratch>/figjson/chNN.json <scratch>/out-chNN --sheets`
  → clipping/overlap/size report + light and dark contact sheets to inspect.
- A figure must not give the answer away; skip pure calculation and definition questions.

## Applied to production
| file | lessons | commit | md5 | applied | counts after |
|---|---|---|---|---|---|
| ch16 | 16.2–16.7 | 15a82b0 | 00f88542ee9cadbe6493ee60c27d2a36 | 2026-11-06 (pg_net id 4) | 16.2 51, 16.3–16.7 50 each |
| ch17 | 17.1–17.7 | bdcd5e1 | 1d9760b6fa819299ddf34e3a8e5ed736 | 2026-11-06 (pg_net id 5) | 17.1 51, 17.2 52, 17.3 50, 17.4 50, 17.5 51, 17.6 50, 17.7 50 |
| ch18a + ch18b | 18.1–18.10 | c1941d6 | d005fec900d1d1a7d62cd472cad96104 / a42635b75165592391a65ef9c85c10ea | 2026-11-06 (pg_net ids 6, 7) | all 50 |
| ch19 | 19.1–19.6 | fd8f04a (SQL same as ea02146) | 32aac7ce9869c99a06323696959ba9ea | 2026-11-06 (pg_net id 8) | 19.1 50, 19.2 51, 19.3 50, 19.4 50, 19.5 50, 19.6 53 |
| ch20a + ch20b | 20.1–20.8 | 955c2cc | daa4c97e03824f41b4cba2926e363b95 / df2425c119612789b2ccea09976756b1 | 2026-11-06 (pg_net ids 9, 10) | all 50 (20.4 18/19/13, others 17/20/13) |
| ch21 | 21.1–21.4 | 4b6c00e | ae97bf2944c593ff0fdd2472654b7bed | 2026-11-06 (pg_net id 11) | all 50 (17/20/13) |
| ch23a + ch23b | 23.1–23.7 | 6057970 | 5c799bb74cf3c9117e49d39c68bb78ec / 26f58596a1a4dbf566b1f162949c8c61 | 2026-11-07 (pg_net ids 12, 13) | all 50 (17/20/13) |
| ch24a + ch24b | 24.1–24.8 | f8d353d | 8e89d05e3a5789000ae074529a5fddba / 7dd24d665ab5c64674fcc059bc8214e6 | 2026-11-07 (pg_net ids 14, 15) | all 50 (17/20/13) |
| ch25a + ch25b | 25.1–25.5 | f5b45bb | f08cee7ff4f1e89b640471f79afd516f / 5a7b10fe5611c7032057e0172916b20a | 2026-11-07 (pg_net ids 16, 17) | all 50 (17/20/13) |
| ch26a + ch26b | 26.1–26.5 | e032416 | cdffe80738add4eb1f1136e4824adfe8 / ed1bd05d17e1160f18dbf4d563691635 | 2026-11-07 (pg_net ids 18, 19) | all 50 (17/20/13) |
| ch27 | 27.1–27.4 | 4bd5cfc | 592dcee493fc9ca926d4c021f7ae6a6a | 2026-11-07 (pg_net id 20) | all 50 (17/20/13) |

## Figures applied (full chapter SQL re-applied: same rows, figure_svg / figure_alt added)
| file | commit | md5 | pg_net | figures per lesson |
|---|---|---|---|---|
| ch27 | 6ff4338 | 39f545e1d673aa1547e64e586cffff80 | 21 | 27.1 10, 27.2 21, 27.3 7, 27.4 18 |
| ch26a + ch26b | 3201ca2 | 513b7714c234174f384b26f82f0e3afc / 33b994549e856de649b670eda031d279 | 22, 23 | 26.1 18, 26.2 18, 26.3 12, 26.4 19, 26.5 11 |
| ch25a + ch25b | 540640e | b3490690643d9bf2ca6a1570f4af6729 / 1df9b5bcbd850709a849eae494b2d4d1 | 24, 25 | 25.1 8, 25.2 13, 25.3 22, 25.4 13, 25.5 15 |
| ch24a + ch24b | 7dafda7 | 393787e852d081ebf93c5c058f8c8d56 / 2749433c43190568d1efe533081e4aff | 26, 27 | 24.1 14, 24.2 10, 24.3 9, 24.4 15, 24.5 9, 24.6 10, 24.7 0, 24.8 5 |
| ch23a + ch23b (+ ch26a regenerated) | 06131d2 | 1ae1ee0e620b1ce7ab8553dd73b124f2 / eb6d7667afe447b9fef1b8d615f1f5ea / 6670ea28daff2099e841e56a191bf9ee | 28, 29, 30 | 23.1 14, 23.2 8, 23.3 15, 23.4 20, 23.5 17, 23.6 24, 23.7 15 |
