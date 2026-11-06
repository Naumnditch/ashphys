"""A Level (Cambridge 9702) question-bank fill, 2026-11-06.

Usage (from the repo root; -I is fine, nothing is imported from the cwd):
    python3 -I database/seeds/2026-11-06-a-level-banks.py            # every chapter file
    python3 -I database/seeds/2026-11-06-a-level-banks.py ch18 ch19  # just these

Owner's brief: every A Level lesson except Chapter 22 "Coulomb's law"
(22.1–22.5, untouched) gets at least 50 original exam-style questions in its
A Level bank (`problems.curriculum_id = 'a-level'`, the only bank the practice
engine serves an A Level student), split roughly 17 easy / 20 medium / 13 hard
counting the questions it already has. Lessons that already have 50+ are not
topped up.

Layout (directory 2026-11-06-a-level-banks/):
  lessons.json            snapshot of every A Level lesson (topic id, chapter id,
                          code, cite, existing count / max problem_number /
                          difficulty split), taken from production 2026-11-06
  existing-a-level-stems.json   the existing A Level stems, for duplicate checks
  ch22-baseline.json      Chapter 22 fingerprint before any write
  _lib.py                 Q() quantities, sf()/stored(), N()/M() builders
  _verify.py              independent re-evaluation of printed working
  chNN.py, p1.py, p2.py, maths.py   the questions (EDIT THESE)
  sql/<file>.sql          GENERATED, one per content file (never hand-edit)
  rejected.json           GENERATED: questions dropped by a quality check, and why
  bank-report.json        GENERATED: per-lesson before/after/split

Rows are INSERT … ON CONFLICT (id) DO UPDATE with uuid5 ids keyed on
(topic, position written), so re-running a file is safe and corrections
overwrite in place. New questions are numbered after the lesson's existing
ones, easy → medium → hard.
"""
import collections
import difflib
import json
import os
import re
import sys
import uuid

HERE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '2026-11-06-a-level-banks')
NS_TAG = 'ashphys/problem/a-level/bank-fill-2026-11-06'
TARGET = 50
SPLIT = {1: 17, 2: 20, 3: 13}
BANNED_TOPIC_PREFIX = '22.'

LESSONS = {r['key']: r for r in json.load(open(os.path.join(HERE, 'lessons.json')))}
EXISTING = collections.defaultdict(list)
_code_to_keys = collections.defaultdict(list)
for r in LESSONS.values():
    _code_to_keys[r['code']].append(r['key'])
for s in json.load(open(os.path.join(HERE, 'existing-a-level-stems.json'))):
    for k in _code_to_keys[s['code']]:
        EXISTING[k].append(s['qt'])


def load(name):
    ns = {}
    lib = os.path.join(HERE, '_lib.py')
    exec(compile(open(lib, encoding='utf-8').read(), lib, 'exec'), ns)
    path = os.path.join(HERE, f'{name}.py')
    exec(compile(open(path, encoding='utf-8').read(), path, 'exec'), ns)
    return ns['QUESTIONS']


LIB = {}
exec(compile(open(os.path.join(HERE, '_lib.py'), encoding='utf-8').read(), '_lib.py', 'exec'), LIB)
verify_ns = {}
_vp = os.path.join(HERE, '_verify.py')
exec(compile(open(_vp, encoding='utf-8').read(), _vp, 'exec'), verify_ns)
check_question = verify_ns['check_question']


def uid(s):
    return str(uuid.uuid5(uuid.NAMESPACE_URL, s))


def lit(v):
    if v is None:
        return 'NULL'
    if isinstance(v, bool):
        return 'true' if v else 'false'
    if isinstance(v, (int, float)):
        return repr(v)
    return "'" + str(v).replace("'", "''") + "'"


def norm_stem(t):
    t = re.sub(r'[\d.,]+', '#', t.lower())
    t = re.sub(r'[⁻⁰¹²³⁴⁵⁶⁷⁸⁹]+', '^', t)
    return re.sub(r'\s+', ' ', t).strip()


# Units the grader resolves (lib/grading/numericAnswer.ts resolveUnit): a base
# symbol, optionally with one SI prefix n u/µ m c k M G.
GRADER_BASE = {'N', 'C', 'm', 'J', 'V', 's', 'A', 'W', 'K', 'T', 'Hz', 'Pa', 'kg', 'g'}
GRADER_PFX = {'n': 1e-9, 'µ': 1e-6, 'm': 1e-3, 'c': 1e-2, 'k': 1e3, 'M': 1e6, 'G': 1e9}
SI_ALT = {'F': 1, 'Ω': 1, 'Wb': 1, 'Bq': 1, 'H': 1}


def grader_unit(u):
    if not u:
        return None
    if u in GRADER_BASE:
        return (u, 1.0)
    if len(u) > 1 and u[0] in GRADER_PFX and u[1:] in GRADER_BASE and u[1:] != 'kg':
        return (u, GRADER_PFX[u[0]])
    return None


def si_alternate(u):
    """For an answer asked in µF / kΩ / MBq …: the factor to SI, so the SI value is accepted too."""
    if not u:
        return None
    if u in SI_ALT:
        return None
    if len(u) > 1 and u[0] in GRADER_PFX and u[1:] in SI_ALT:
        return GRADER_PFX[u[0]]
    return None


def answer_columns(q):
    """answer_correct, answer_unit, alternates for a numeric question."""
    val, unit = q['value'], q['unit']
    gu = grader_unit(unit)
    alts = list(q['alts'])
    if gu and gu[1] != 1.0:
        # "486 nm": the grader reads 4.86e-7 m and also accepts a bare 486.
        correct = f"{stored(val)} {unit.replace('µ', 'u')}"
    else:
        correct = stored(val)
        f = si_alternate(unit)
        if f:
            alts.append(stored(val * f))
    return correct, unit, alts


def stored(x, n=4):
    if x == 0:
        return '0'
    neg = x < 0
    x = abs(x)
    e = int(f'{x:e}'.split('e')[1])
    trim = lambda s: s.rstrip('0').rstrip('.') if '.' in s else s  # noqa: E731
    out = trim(f'{x:.{max(n - 1 - e, 0)}f}') if -3 <= e < 5 else f"{trim(f'{x / 10**e:.{n - 1}f}')}e{e}"
    return f'-{out}' if neg else out


def _factor_or_unknown(u):
    try:
        f = LIB['unit_factor'](u)
        return 1 if abs(f - 1) < 1e-12 else f
    except KeyError:
        return None   # an unknown unit must be named in the stem


def quality(q, lesson_qs, existing):
    """Reasons this question fails a quality check (empty list = passes)."""
    if q.get('build_error'):
        return [f"build check failed: {q['build_error']}"]
    why = []
    if not q['text'] or len(q['text']) < 25:
        why.append('stem missing or too short')
    if 'Mark scheme (' not in q['explanation']:
        why.append('no mark scheme')
    if len(q['sol'].strip()) < 20:
        why.append('worked solution missing or too short')
    if q['difficulty'] not in (1, 2, 3):
        why.append('no difficulty tag')
    if not isinstance(q['marks'], int) or q['marks'] < 1:
        why.append('no mark total')
    if re.search(r'\\u[0-9a-fA-F]{4}', q['text'] + q['explanation'] + ''.join(q.get('options', []))):
        why.append('literal \\u escape in text')
    if q['kind'] == 'numeric':
        ok, problems, _ = check_question(q)
        if not ok:
            why.extend(problems)
        u = q['unit']
        gu = grader_unit(u)
        graded = abs(q['value']) * (gu[1] if gu else 1.0)
        if graded < 1e-10:
            why.append(f"answer {q['value']:.3g} is too small for the grader (absolute epsilon 1e-12): ask in eV, a prefixed unit or 'units of 10ⁿ'")
        if u == 'g':
            why.append('answer asked in grams: the grader reads g as 10⁻³ kg, ask in kg or mg')
        elif u and grader_unit(u) is None and u not in q['text'] and _factor_or_unknown(u) != 1:
            # the stored number is not SI and the grader cannot convert it, so the stem must name the unit
            why.append(f"answer unit {u!r} is not named in the stem")
    else:
        if len(set(q['options'])) != 4:
            why.append('MCQ options not distinct')
    me = norm_stem(q['text'])
    for other in lesson_qs:
        if other is q:
            break
        if difflib.SequenceMatcher(None, me, norm_stem(other['text'])).ratio() >= 0.90:
            why.append(f'near-duplicate of an earlier stem in this lesson: "{other["text"][:70]}…"')
            break
    for old in existing:
        if difflib.SequenceMatcher(None, me, norm_stem(old)).ratio() >= 0.90:
            why.append(f'near-duplicate of an existing question: "{old[:70]}…"')
            break
    return why


def build(name, rejected, report):
    qs = load(name)
    by_lesson = collections.OrderedDict()
    for q in qs:
        assert q['lesson'] in LESSONS, f'{name}: unknown lesson key {q["lesson"]}'
        L = LESSONS[q['lesson']]
        assert not (L['code'] or '').startswith(BANNED_TOPIC_PREFIX), f'{name}: Chapter 22 is out of scope'
        by_lesson.setdefault(q['lesson'], []).append(q)

    out = [
        f'-- A Level (9702) bank fill 2026-11-06 — {name}. GENERATED by',
        '-- database/seeds/2026-11-06-a-level-banks.py from 2026-11-06-a-level-banks/' + name + '.py: edit that, not this.',
        '-- INSERT … ON CONFLICT (id) DO UPDATE: re-running is safe. Chapter 22 is never touched.',
    ]
    topics = sorted({LESSONS[k]['topic'] for k in by_lesson})
    out.append(
        'DO $$ BEGIN IF (SELECT count(*) FROM topics WHERE id IN (' + ', '.join(lit(t) for t in topics) +
        ") AND 'a-level' = ANY(curriculum_ids) AND coalesce(a_level_topic_code, '') NOT LIKE '22.%') <> "
        f"{len(topics)} THEN RAISE EXCEPTION 'lesson guard failed: a topic is missing, not A Level, or in Chapter 22'; END IF; END $$;"
    )
    cols = ('id, chapter_id, topic_id, curriculum_id, topic_code, syllabus_cite, problem_number, "order", question_text, '
            'question_image_url, difficulty_level, answer_type, answer_correct, answer_unit, answer_unit_required, '
            'answer_tolerance, answer_sign_sensitive, answer_alternates, explanation, points')
    upd = ', '.join(f'{c} = EXCLUDED.{c}' for c in [
        'chapter_id', 'topic_id', 'curriculum_id', 'topic_code', 'syllabus_cite', 'problem_number', '"order"',
        'question_text', 'question_image_url', 'difficulty_level', 'answer_type', 'answer_correct', 'answer_unit',
        'answer_unit_required', 'answer_tolerance', 'answer_sign_sensitive', 'answer_alternates', 'explanation', 'points'])
    for key, lqs in by_lesson.items():
        L = LESSONS[key]
        for i, q in enumerate(lqs, 1):
            q['seq'] = i
            q['id'] = uid(f"{NS_TAG}/{L['topic']}/{i}")
        kept = []
        for q in lqs:
            why = quality(q, lqs, EXISTING[key])
            if why:
                rejected.append(dict(lesson=key, file=name, text=q['text'], reasons=why))
            else:
                kept.append(q)
        kept.sort(key=lambda q: (q['difficulty'], q['seq']))
        split = collections.Counter(q['difficulty'] for q in kept)
        before = dict(n=L['n'], d1=L['d1'], d2=L['d2'], d3=L['d3'])
        after_n = L['n'] + len(kept)
        report[key] = dict(code=L['code'], title=L['title'], topic=L['topic'], before=L['n'], new=len(kept),
                           after=after_n, easy=L['d1'] + split[1], medium=L['d2'] + split[2], hard=L['d3'] + split[3],
                           before_split=before, file=name)
        prow, orow = [], []
        for rank, q in enumerate(kept, 1):
            number = L['maxn'] + rank
            if q['kind'] == 'numeric':
                correct, unit, alts = answer_columns(q)
                atype = 'numeric'
            else:
                correct, unit, alts = q['answer'], None, []
                atype = 'multiple_choice'
            alts_sql = 'NULL' if not alts else "ARRAY[" + ', '.join(lit(a) for a in alts) + "]::text[]"
            prow.append(
                f"({lit(q['id'])}, {lit(L['chapter_id'])}, {lit(L['topic'])}, 'a-level', {lit(L['code'])}, {lit(L['cite'])}, "
                f"{number}, {number}, {lit(q['text'])}, NULL, {q['difficulty']}, '{atype}'::answer_type, {lit(correct)}, "
                f"{lit(unit)}, false, {lit(q.get('tol'))}, {lit(bool(q.get('sign')))}, {alts_sql}, {lit(q['explanation'])}, "
                f"{q['marks']})"
            )
            if atype == 'multiple_choice':
                for oi, text in enumerate(q['options']):
                    orow.append(f"({lit(uid(q['id'] + '/option/' + str(oi)))}, {lit(q['id'])}, {lit(text)}, {lit('ABCD'[oi])}, "
                                f"{lit(oi == q['correct_idx'])}, {oi})")
        if prow:
            out.append(f'-- {key} {L["title"]}: {len(prow)} questions')
            out.append(f'INSERT INTO problems ({cols}) VALUES\n' + ',\n'.join(prow) +
                       f'\nON CONFLICT (id) DO UPDATE SET {upd}, updated_at = now();')
        if orow:
            out.append('INSERT INTO problem_options (id, problem_id, option_text, option_letter, is_correct, "order") VALUES\n' +
                       ',\n'.join(orow) + '\nON CONFLICT (id) DO UPDATE SET problem_id = EXCLUDED.problem_id, '
                       'option_text = EXCLUDED.option_text, option_letter = EXCLUDED.option_letter, '
                       'is_correct = EXCLUDED.is_correct, "order" = EXCLUDED."order";')
    os.makedirs(os.path.join(HERE, 'sql'), exist_ok=True)
    with open(os.path.join(HERE, 'sql', f'{name}.sql'), 'w', encoding='utf-8') as fh:
        fh.write('\n'.join(out) + '\n')
    # answer key as the mark scheme states it (stated s.f.), for the vitest grader check
    key_rows = [dict(id=q['id'], lesson=q['lesson'], shown=q['shown'], sig=q['sig'], value=q['value'], sign=bool(q.get('sign')))
                for lqs in by_lesson.values() for q in lqs if q['kind'] == 'numeric' and 'id' in q
                and not any(r['text'] == q['text'] and r['lesson'] == q['lesson'] for r in rejected)]
    with open(os.path.join(HERE, 'sql', f'{name}.key.json'), 'w', encoding='utf-8') as fh:
        json.dump(key_rows, fh, ensure_ascii=False, indent=0)
    return by_lesson


def main():
    names = sys.argv[1:] or sorted(f[:-3] for f in os.listdir(HERE) if re.match(r'^(ch\d\d[a-z]?|p1|p2|maths)\.py$', f))
    rej_path = os.path.join(HERE, 'rejected.json')
    rep_path = os.path.join(HERE, 'bank-report.json')
    rejected_all = json.load(open(rej_path)) if os.path.exists(rej_path) else []
    report = json.load(open(rep_path)) if os.path.exists(rep_path) else {}
    rejected_all = [r for r in rejected_all if r['file'] not in names]
    problems = []
    for name in names:
        rejected = []
        by_lesson = build(name, rejected, report)
        rejected_all.extend(rejected)
        for key in by_lesson:
            r = report[key]
            dev = {d: (r[k] - SPLIT[d]) for d, k in ((1, 'easy'), (2, 'medium'), (3, 'hard'))}
            flag = '' if r['after'] >= TARGET else '   <-- BELOW 50'
            print(f"{name:6} {key:8} before {r['before']:3}  new {r['new']:3}  after {r['after']:3}  "
                  f"E/M/H {r['easy']}/{r['medium']}/{r['hard']}{flag}", file=sys.stderr)
            if r['after'] < TARGET:
                problems.append(f'{key}: only {r["after"]}')
        for rj in rejected:
            print(f"  REJECTED {rj['lesson']}: {rj['text'][:80]}… — {'; '.join(rj['reasons'])}", file=sys.stderr)
    with open(rej_path, 'w', encoding='utf-8') as fh:
        json.dump(rejected_all, fh, ensure_ascii=False, indent=1)
    with open(rep_path, 'w', encoding='utf-8') as fh:
        json.dump(dict(sorted(report.items())), fh, ensure_ascii=False, indent=1)
    if problems:
        print('LESSONS BELOW TARGET: ' + ', '.join(problems), file=sys.stderr)
        sys.exit(1)


if __name__ == '__main__':
    main()
