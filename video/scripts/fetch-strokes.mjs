#!/usr/bin/env node
/**
 * Read the showcase questions' stored strokes straight from the database
 * (question_handwriting.doc — tool, colour, width, opacity, points with
 * x, y, pressure and, for newer strokes, t) and save them next to the
 * announcement config, with the server-rendered snapshot for comparison.
 *
 *   DATABASE_URL=… npm run fetch-strokes -- --update=<slug>            # shows the matches, writes nothing
 *   DATABASE_URL=… npm run fetch-strokes -- --update=<slug> --confirm  # writes strokes/<key>.json
 *
 * Read-only on the database.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import { args, pgConfig, readJson, requireEnv, updateDir } from './lib.mjs';
import { describeMatch, findShowcase } from './showcase.mjs';

const opts = args();
const dir = updateDir(opts.update);
const config = readJson(path.join(dir, 'config.json'));
const { DATABASE_URL } = requireEnv('DATABASE_URL');

const client = new pg.Client(pgConfig(DATABASE_URL));
await client.connect();
try {
  await client.query('BEGIN READ ONLY');
  const found = await findShowcase(client, config.showcase);
  for (const [key, m] of Object.entries(found)) console.log(describeMatch(key, m));
  if (!opts.confirm) {
    console.log('\nCheck these are the right questions, then re-run with --confirm to save their strokes.');
    process.exit(0);
  }
  mkdirSync(path.join(dir, 'strokes'), { recursive: true });
  for (const [key, m] of Object.entries(found)) {
    const { rows } = await client.query(`SELECT doc, snapshots, version, updated_at FROM question_handwriting WHERE id = $1`, [m.id]);
    const row = rows[0];
    const strokes = row.doc.pages.flatMap((p) => p.strokes);
    const timed = strokes.filter((s) => s.points.every((q) => q.length === 4)).length;
    const out = {
      key,
      source: {
        handwritingId: m.id,
        lessonId: m.lesson_id,
        questionId: m.question_id,
        lesson: m.topic_name,
        questionNumber: m.problem_number,
        question: m.question_text,
        answer: m.answer_correct,
        version: row.version,
        updatedAt: new Date(row.updated_at).toISOString(),
      },
      timing: { timedStrokes: timed, totalStrokes: strokes.length },
      doc: row.doc,
      snapshots: row.snapshots,
    };
    writeFileSync(path.join(dir, 'strokes', `${key}.json`), JSON.stringify(out));
    console.log(`saved strokes/${key}.json — ${strokes.length} strokes, ${timed} with timestamps`);
  }
  await client.query('COMMIT');
} finally {
  await client.end();
}
