#!/usr/bin/env node
/**
 * Export what the capture build needs from a real database (READ-ONLY):
 * the live schema as DDL and the rows of the lessons that hold the
 * announcement's showcase questions (courses, chapters, topics, problems,
 * options, plans, and those lessons' handwritten solutions). No users,
 * attempts, payments or any other personal data are read.
 *
 *   SOURCE_DATABASE_URL=… npm run export-demo-data -- --update=<slug>
 *
 * Writes video/.cache/demo/schema.sql and demo-data.json (git-ignored), which
 * `npm run seed` loads into a LOCAL database.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import { args, pgConfig, readJson, requireEnv, updateDir, VIDEO_DIR } from './lib.mjs';
import { findShowcase } from './showcase.mjs';

const { update } = args();
const dir = updateDir(update);
const config = readJson(path.join(dir, 'config.json'));
const { SOURCE_DATABASE_URL } = requireEnv('SOURCE_DATABASE_URL');

const DDL = `
WITH enums AS (
  SELECT 1 AS ord, t.typname::text AS k, 'CREATE TYPE ' || quote_ident(t.typname) || ' AS ENUM (' || string_agg(quote_literal(e.enumlabel), ', ' ORDER BY e.enumsortorder) || ');' AS ddl
  FROM pg_type t JOIN pg_enum e ON e.enumtypid = t.oid JOIN pg_namespace n ON n.oid = t.typnamespace WHERE n.nspname = 'public' GROUP BY t.typname
), tbls AS (
  SELECT 2, c.relname::text, 'CREATE TABLE ' || quote_ident(c.relname) || ' (' || string_agg(quote_ident(a.attname) || ' ' || format_type(a.atttypid, a.atttypmod) || coalesce(' DEFAULT ' || pg_get_expr(d.adbin, d.adrelid), '') || CASE WHEN a.attnotnull THEN ' NOT NULL' ELSE '' END, ', ' ORDER BY a.attnum) || ');'
  FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace JOIN pg_attribute a ON a.attrelid = c.oid AND a.attnum > 0 AND NOT a.attisdropped LEFT JOIN pg_attrdef d ON d.adrelid = c.oid AND d.adnum = a.attnum
  WHERE n.nspname = 'public' AND c.relkind = 'r' GROUP BY c.relname
), cons AS (
  SELECT CASE con.contype WHEN 'p' THEN 3 WHEN 'u' THEN 4 WHEN 'c' THEN 5 ELSE 6 END, con.conrelid::regclass::text || '.' || con.conname,
  'ALTER TABLE ' || con.conrelid::regclass::text || ' ADD CONSTRAINT ' || quote_ident(con.conname) || ' ' || pg_get_constraintdef(con.oid) || ';'
  FROM pg_constraint con JOIN pg_namespace n ON n.oid = con.connamespace WHERE n.nspname = 'public' AND con.contype IN ('p','u','c','f') AND con.conrelid <> 0
), idx AS (
  SELECT 7, i.indexname::text, i.indexdef || ';' FROM pg_indexes i WHERE i.schemaname = 'public' AND NOT EXISTS (SELECT 1 FROM pg_constraint c WHERE c.conname = i.indexname)
), vws AS (
  SELECT 9, v.viewname::text, 'CREATE VIEW ' || quote_ident(v.viewname) || ' AS ' || v.definition FROM pg_views v WHERE v.schemaname = 'public'
)
SELECT string_agg(ddl, E'\\n' ORDER BY ord, k) AS ddl FROM (SELECT * FROM enums UNION ALL SELECT * FROM tbls UNION ALL SELECT * FROM cons UNION ALL SELECT * FROM idx UNION ALL SELECT * FROM vws) x`;

const DATA = `
WITH lessons AS (SELECT unnest($1::uuid[]) AS id),
crs AS (SELECT DISTINCT c.course_id AS id FROM chapters c JOIN topics t ON t.chapter_id = c.id WHERE t.id IN (SELECT id FROM lessons)),
chs AS (SELECT id FROM chapters WHERE course_id IN (SELECT id FROM crs)),
probs AS (SELECT id FROM problems WHERE topic_id IN (SELECT id FROM lessons))
SELECT jsonb_build_object(
 'courses', (SELECT jsonb_agg(to_jsonb(x) - 'created_by') FROM courses x WHERE id IN (SELECT id FROM crs)),
 'chapters', (SELECT jsonb_agg(to_jsonb(x)) FROM chapters x WHERE id IN (SELECT id FROM chs)),
 'topics', (SELECT jsonb_agg(to_jsonb(x)) FROM topics x WHERE chapter_id IN (SELECT id FROM chs)),
 'problems', (SELECT jsonb_agg(to_jsonb(x)) FROM problems x WHERE id IN (SELECT id FROM probs)),
 'problem_options', (SELECT jsonb_agg(to_jsonb(x)) FROM problem_options x WHERE problem_id IN (SELECT id FROM probs)),
 'subscription_plans', (SELECT jsonb_agg(to_jsonb(x) - 'shopier_url_monthly' - 'shopier_url_yearly' - 'shopier_url_quarterly') FROM subscription_plans x),
 'question_handwriting', (SELECT jsonb_agg(to_jsonb(x) - 'created_by' - 'updated_by') FROM question_handwriting x WHERE lesson_id IN (SELECT id FROM lessons))
) AS data`;

const client = new pg.Client(pgConfig(SOURCE_DATABASE_URL));
await client.connect();
try {
  await client.query('BEGIN READ ONLY');
  const found = await findShowcase(client, config.showcase);
  const lessons = [...new Set(Object.values(found).map((f) => f.lesson_id))];
  const ddl = (await client.query(DDL)).rows[0].ddl;
  const data = (await client.query(DATA, [lessons])).rows[0].data;
  await client.query('COMMIT');
  const out = path.join(VIDEO_DIR, '.cache', 'demo');
  mkdirSync(out, { recursive: true });
  writeFileSync(path.join(out, 'schema.sql'), ddl);
  writeFileSync(path.join(out, 'demo-data.json'), JSON.stringify(data));
  console.log(`Exported schema + ${Object.entries(data).map(([k, v]) => `${(v ?? []).length} ${k}`).join(', ')} to ${path.relative(process.cwd(), out)}`);
} finally {
  await client.end();
}
