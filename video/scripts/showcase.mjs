/**
 * Locate an announcement's showcase questions in question_handwriting by the
 * text of the question (never by a hard-coded id), newest updated_at first.
 * Each config entry: { "questionIncludes": ["fragment", …], "answer": "1.868" }.
 */

export async function findShowcase(client, showcase) {
  const found = {};
  for (const [key, spec] of Object.entries(showcase)) {
    const patterns = spec.questionIncludes.map((s) => `%${s.replace(/[\\%_]/g, (c) => `\\${c}`)}%`);
    const { rows } = await client.query(
      `SELECT h.id, h.lesson_id, h.question_id, h.stroke_count, h.page_count, h.version, h.updated_at,
              p.problem_number, p.question_text, p.answer_correct, p.answer_unit, p.curriculum_id, t.topic_name
       FROM question_handwriting h
       JOIN problems p ON p.id = h.question_id
       JOIN topics t ON t.id = h.lesson_id
       WHERE h.stroke_count > 0 AND p.question_text ILIKE ALL($1::text[])
       ORDER BY h.updated_at DESC`,
      [patterns]
    );
    if (rows.length === 0) throw new Error(`Showcase ${key}: no handwritten solution matches ${JSON.stringify(spec.questionIncludes)}`);
    const match = rows[0];
    if (spec.answer && String(match.answer_correct) !== String(spec.answer)) {
      throw new Error(`Showcase ${key}: the newest match (Q${match.problem_number}, ${match.topic_name}) has answer ${match.answer_correct}, expected ${spec.answer}`);
    }
    found[key] = { ...match, otherMatches: rows.length - 1 };
  }
  return found;
}

export function describeMatch(key, m) {
  return (
    `${key}: ${m.topic_name} · Q${m.problem_number} (${m.curriculum_id}) · ${m.stroke_count} strokes on ${m.page_count} page(s) · ` +
    `version ${m.version} · updated ${new Date(m.updated_at).toISOString()} · answer ${m.answer_correct}${m.answer_unit ? ` ${m.answer_unit}` : ''}` +
    (m.otherMatches ? ` · (${m.otherMatches} older match(es) ignored)` : '') +
    `\n   “${m.question_text}”`
  );
}
