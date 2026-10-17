/**
 * The recipient search against a real Postgres: more people than the old
 * 10-result page, names saved with stray spaces, and two students who share
 * a name.
 *
 *   TEST_DATABASE_URL=postgres://user:pass@localhost:5432/ashphys_test npm run test:db
 *
 * Loads database/tests/base-schema.sql if the database has no `users` table,
 * plus minimal sections/subscriptions tables if missing. Every test runs in a
 * transaction that is rolled back. Skipped without TEST_DATABASE_URL.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { Client } from 'pg';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const url = process.env.TEST_DATABASE_URL;
const root = path.resolve(__dirname, '../../..');
const db = vi.hoisted(() => ({ client: null as null | import('pg').Client }));

vi.mock('@/lib/db/client', () => ({ query: (text: string, params?: unknown[]) => db.client!.query(text, params as never) }));

import { searchSubscribers } from '../store';

describe.skipIf(!url)('recipient search (TEST_DATABASE_URL)', () => {
  beforeAll(async () => {
    db.client = new Client({ connectionString: url });
    await db.client.connect();
    const c = db.client;
    const has = async (t: string) => (await c.query(`SELECT to_regclass($1) IS NOT NULL AS ok`, [t])).rows[0].ok;
    if (!(await has('public.users'))) await c.query(readFileSync(path.join(root, 'database/tests/base-schema.sql'), 'utf8'));
    if (!(await has('public.sections'))) await c.query(`CREATE TABLE sections (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text)`);
    if (!(await has('public.subscriptions'))) {
      await c.query(`DO $$ BEGIN CREATE TYPE subscription_status AS ENUM ('active','cancelled','expired'); EXCEPTION WHEN duplicate_object THEN NULL; END $$`);
      await c.query(`CREATE TABLE subscription_plans (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text, tier_level int NOT NULL)`);
      await c.query(
        `CREATE TABLE subscriptions (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), student_id uuid, plan_id uuid,
           status subscription_status, end_date timestamptz)`
      );
    }
  });

  afterAll(async () => {
    await db.client?.end();
  });

  beforeEach(async () => {
    await db.client!.query('BEGIN');
    await db.client!.query(`DELETE FROM users`);
    const people: [string, string, string, string][] = [
      ['Abdelrahman ', 'Mostafa', 'abdo.m@example.com', 'student'],
      ['Hamza', 'Abdelrahman ', 'hamza@example.com', 'student'],
      ['Muhammad ', 'Saleem', 'msaleem@example.com', 'student'],
      ['Ahmed', 'Hassan', 'ahmed.h1@example.com', 'student'],
      ['Ahmed', 'Hassan', 'ahmed.h2@example.com', 'student'],
      ['Tara', 'Teacher', 'tara@school.example', 'teacher'],
      ['Owner', 'Admin', 'owner@example.com', 'admin'],
    ];
    for (let i = 0; i < 20; i++) people.push([`Pupil${String(i).padStart(2, '0')}`, 'Example', `pupil${i}@example.com`, 'student']);
    for (const [first, last, email, role] of people) {
      await db.client!.query(`INSERT INTO users (first_name, last_name, email, role) VALUES ($1, $2, $3, $4::user_role)`, [first, last, email, role]);
    }
    const plan = await db.client!.query(`INSERT INTO subscription_plans (name, tier_level) VALUES ('Pro', 2) RETURNING id`);
    await db.client!.query(
      `INSERT INTO subscriptions (student_id, plan_id, status) SELECT id, $1, 'active' FROM users WHERE email = 'msaleem@example.com'`,
      [plan.rows[0].id]
    );
  });

  afterEach(async () => {
    await db.client!.query('ROLLBACK');
  });

  const emails = async (q: string) => (await searchSubscribers(q)).subscribers.map((s) => s.email);

  it('an empty search returns every non-admin, far more than the old 10', async () => {
    const { subscribers, total } = await searchSubscribers('');
    expect(subscribers).toHaveLength(26);
    expect(total).toBe(26);
    expect(subscribers.some((s) => s.role === 'admin' as never)).toBe(false);
  });

  it('a search matching more than 10 people returns them all', async () => {
    expect(await emails('pupil')).toHaveLength(20);
  });

  it('finds full names saved with stray spaces, in either order', async () => {
    expect(await emails('Abdelrahman Mostafa')).toEqual(['abdo.m@example.com']);
    expect(await emails('mostafa abdel')).toEqual(['abdo.m@example.com']);
    expect(await emails('muhammad saleem')).toEqual(['msaleem@example.com']);
    expect((await emails('abdelrahman')).sort()).toEqual(['abdo.m@example.com', 'hamza@example.com']);
  });

  it('matches part of an email and keeps people who share a name apart', async () => {
    expect(await emails('SCHOOL.EX')).toEqual(['tara@school.example']);
    expect(await emails('ahmed hassan')).toEqual(['ahmed.h1@example.com', 'ahmed.h2@example.com']);
  });

  it('keeps tiers and trims names', async () => {
    const [s] = (await searchSubscribers('saleem')).subscribers;
    expect(s.tierName).toBe('Pro');
    expect(s.firstName).toBe('Muhammad');
  });

  it('respects a smaller page size but still reports the full total', async () => {
    const { subscribers, total } = await searchSubscribers('pupil', 5);
    expect(subscribers).toHaveLength(5);
    expect(total).toBe(20);
  });
});
