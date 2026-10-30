#!/usr/bin/env node
/**
 * Stand up the LOCAL database the capture build runs against:
 *   1. the live schema (video/.cache/demo/schema.sql, from export-demo-data),
 *   2. the site's own idempotent migrations for handwriting, site_updates and
 *      shared solutions (student workspaces + "Share my solution"),
 *   3. the exported demo rows (lessons, questions, handwritten solutions),
 *   4. a TEST student and a TEST admin from environment variables (plus an
 *      optional second TEST student, "Test Reader", from TEST_STUDENT2_*),
 *   5. a clean slate for the test students (no attempts, no solution views, no
 *      workspaces, no shared solutions).
 *
 *   DATABASE_URL=postgresql://…@localhost:5433/ashphys \
 *   TEST_STUDENT_EMAIL=… TEST_STUDENT_PASSWORD=… TEST_ADMIN_EMAIL=… TEST_ADMIN_PASSWORD=… \
 *   [TEST_STUDENT2_EMAIL=… TEST_STUDENT2_PASSWORD=…] \
 *   npm run seed -- [--student-tier=free|plus|pro] [--reset-only]
 *
 * Refuses to touch anything but localhost unless DEMO_DB_ALLOW_REMOTE=1 (a
 * staging copy). Never point it at production. Credentials are read from the
 * environment and never printed.
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import { args, pgConfig, requireEnv, SITE_DIR, VIDEO_DIR } from './lib.mjs';

const opts = args();
const env = requireEnv('DATABASE_URL', 'TEST_STUDENT_EMAIL', 'TEST_STUDENT_PASSWORD', 'TEST_ADMIN_EMAIL', 'TEST_ADMIN_PASSWORD');
const host = new URL(env.DATABASE_URL).hostname;
if (!['localhost', '127.0.0.1'].includes(host) && process.env.DEMO_DB_ALLOW_REMOTE !== '1') {
  console.error(`Refusing to seed ${host}: the demo database must be local (set DEMO_DB_ALLOW_REMOTE=1 for a staging copy, never production).`);
  process.exit(1);
}

const TIERS = { free: 0, plus: 1, pro: 2 };
const studentTier = TIERS[opts['student-tier'] ?? 'free'];
if (studentTier === undefined) {
  console.error('--student-tier must be free, plus or pro');
  process.exit(1);
}

const client = new pg.Client(pgConfig(env.DATABASE_URL));
await client.connect();

async function runStatements(sql) {
  // One statement per entry; views can depend on each other, so retry what failed until nothing changes.
  let pending = sql.split(/;\s*\n(?=CREATE |ALTER )/).map((s) => s.trim()).filter(Boolean);
  while (pending.length) {
    const failed = [];
    let lastError = null;
    for (const s of pending) {
      try {
        await client.query(s);
      } catch (e) {
        if (!/already exists|multiple primary keys/.test(e.message)) {
          failed.push(s);
          lastError = e;
        }
      }
    }
    if (failed.length === pending.length) throw new Error(`${failed.length} schema statement(s) failed, e.g. ${lastError.message}`);
    pending = failed;
  }
}

try {
  const demo = path.join(VIDEO_DIR, '.cache', 'demo');
  if (!opts['reset-only']) {
    if (!existsSync(path.join(demo, 'schema.sql'))) throw new Error('Run `npm run export-demo-data -- --update=<slug>` first.');
    const fresh = !(await client.query(`SELECT to_regclass('public.users') IS NOT NULL AS ok`)).rows[0].ok;
    if (fresh) await runStatements(readFileSync(path.join(demo, 'schema.sql'), 'utf8'));
    for (const m of ['2026-10-28-question-handwriting.sql', '2026-10-28-site-updates.sql', '2026-10-29-shared-solutions.sql']) {
      await client.query(readFileSync(path.join(SITE_DIR, 'database', 'seeds', m), 'utf8'));
    }

    const data = JSON.parse(readFileSync(path.join(demo, 'demo-data.json'), 'utf8'));
    for (const table of ['courses', 'chapters', 'topics', 'problems', 'problem_options', 'subscription_plans', 'question_handwriting']) {
      const rows = data[table] ?? [];
      if (!rows.length) continue;
      await client.query(
        `INSERT INTO ${table} SELECT * FROM jsonb_populate_recordset(NULL::${table}, $1::jsonb) ON CONFLICT DO NOTHING`,
        [JSON.stringify(rows)]
      );
      console.log(`  ${table}: ${rows.length}`);
    }
  }

  // Handwriting back to the exported state (the capture's writing clip draws on a demo question).
  const demoFile = path.join(VIDEO_DIR, '.cache', 'demo', 'demo-data.json');
  if (existsSync(demoFile)) {
    const rows = JSON.parse(readFileSync(demoFile, 'utf8')).question_handwriting ?? [];
    if (rows.length) {
      await client.query(
        `INSERT INTO question_handwriting SELECT * FROM jsonb_populate_recordset(NULL::question_handwriting, $1::jsonb)
         ON CONFLICT (id) DO UPDATE SET doc = EXCLUDED.doc, snapshots = EXCLUDED.snapshots, preview = EXCLUDED.preview,
           page_count = EXCLUDED.page_count, stroke_count = EXCLUDED.stroke_count, version = EXCLUDED.version`,
        [JSON.stringify(rows)]
      );
    }
  }

  // Test accounts: fixed obviously-fake names, credentials only from the environment.
  const upsertUser = async (email, password, role, first, last) => {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await client.query(
      `INSERT INTO users (email, password_hash, role, status, first_name, last_name, email_notifications)
       VALUES (lower($1), $2, $3::user_role, 'active', $4, $5, false)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = EXCLUDED.role, status = 'active',
         first_name = EXCLUDED.first_name, last_name = EXCLUDED.last_name
       RETURNING id`,
      [email, hash, role, first, last]
    );
    return rows[0].id;
  };
  const studentId = await upsertUser(env.TEST_STUDENT_EMAIL, env.TEST_STUDENT_PASSWORD, 'student', 'Test', 'Student');
  const adminId = await upsertUser(env.TEST_ADMIN_EMAIL, env.TEST_ADMIN_PASSWORD, 'admin', 'Demo', 'Teacher');
  // Optional second student: the one who sees an approved shared solution on the question page.
  const readerId =
    process.env.TEST_STUDENT2_EMAIL && process.env.TEST_STUDENT2_PASSWORD
      ? await upsertUser(process.env.TEST_STUDENT2_EMAIL, process.env.TEST_STUDENT2_PASSWORD, 'student', 'Test', 'Reader')
      : null;
  await client.query(`UPDATE question_handwriting SET created_by = coalesce(created_by, $1), updated_by = coalesce(updated_by, $1)`, [adminId]);

  // Clean slate for the students: no answers, no views, no workspaces or shared solutions,
  // no age answer, no sessions left over from a previous capture.
  for (const id of [studentId, readerId].filter(Boolean)) for (const sql of [
    `DELETE FROM practice_attempts WHERE student_id = $1`,
    `DELETE FROM practice_sessions WHERE student_id = $1`,
    `DELETE FROM topic_mastery WHERE student_id = $1`,
    `DELETE FROM user_solution_views WHERE user_id = $1`,
    `DELETE FROM solution_access_log WHERE user_id = $1`,
    `DELETE FROM subscriptions WHERE student_id = $1`,
    `DELETE FROM shared_solutions WHERE user_id = $1`,
    `DELETE FROM student_workspaces WHERE user_id = $1`,
    `UPDATE users SET age_band = NULL, age_band_declared_at = NULL WHERE id = $1`,
    `UPDATE sessions SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL`,
  ]) {
    await client.query(sql, [id]).catch((e) => {
      if (!/does not exist/.test(e.message)) throw e;
    });
  }
  await client.query(`UPDATE sessions SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL`, [adminId]);
  if (studentTier > 0) {
    for (const id of [studentId, readerId].filter(Boolean)) {
      await client.query(
        `INSERT INTO subscriptions (student_id, plan_id, status, start_date, end_date, tier)
         SELECT $1, id, 'active', now(), now() + interval '30 days', 'premium' FROM subscription_plans WHERE tier_level = $2 ORDER BY "order" LIMIT 1`,
        [id, studentTier]
      );
    }
  }
  console.log(`Seeded. Test student tier: ${Object.keys(TIERS)[studentTier]}${readerId ? ' (both test students)' : ''}.`);
} finally {
  await client.end();
}
