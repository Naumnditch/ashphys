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

## Applied to production
| file | lessons | commit | md5 | applied | counts after |
|---|---|---|---|---|---|
| ch16 | 16.2–16.7 | 15a82b0 | 00f88542ee9cadbe6493ee60c27d2a36 | 2026-11-06 (pg_net id 4) | 16.2 51, 16.3–16.7 50 each |
| ch17 | 17.1–17.7 | bdcd5e1 | 1d9760b6fa819299ddf34e3a8e5ed736 | 2026-11-06 (pg_net id 5) | 17.1 51, 17.2 52, 17.3 50, 17.4 50, 17.5 51, 17.6 50, 17.7 50 |
