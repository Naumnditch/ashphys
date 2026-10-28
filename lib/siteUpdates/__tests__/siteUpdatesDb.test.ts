/**
 * "What's New" announcements against a real, THROWAWAY database: the
 * migration's row-level security on its own, and the real admin API routes.
 *
 *   TEST_DATABASE_URL=postgres://user:pass@localhost:5432/ashphys_test npm run test:db
 *
 * Loads database/tests/base-schema.sql if the database is empty, then
 * database/seeds/2026-10-28-site-updates.sql (idempotent). Rows it creates are
 * deleted afterwards. Skipped without TEST_DATABASE_URL.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { Client } from 'pg';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const url = process.env.TEST_DATABASE_URL;
const root = path.resolve(__dirname, '../../..');

const session = vi.hoisted(() => ({ user: null as null | { id: string; role: string } }));
vi.mock('@/lib/auth/session', () => ({ getCurrentUser: async () => session.user }));

describe.skipIf(!url)('site updates (TEST_DATABASE_URL)', () => {
  let db: Client;
  const admin = randomUUID();
  const student = randomUUID();
  const slugs: string[] = [];
  let listRoute: typeof import('@/app/api/admin/site-updates/route');
  let itemRoute: typeof import('@/app/api/admin/site-updates/[id]/route');
  let queries: typeof import('@/lib/siteUpdates/queries');

  const slug = (s: string) => {
    const v = `${s}-${admin.slice(0, 8)}`;
    slugs.push(v);
    return v;
  };

  beforeAll(async () => {
    process.env.DATABASE_URL = url;
    db = new Client({ connectionString: url });
    await db.connect();
    if (!(await db.query(`SELECT to_regclass('public.users') IS NOT NULL AS ok`)).rows[0].ok) {
      await db.query(readFileSync(path.join(root, 'database/tests/base-schema.sql'), 'utf8'));
    }
    await db.query(readFileSync(path.join(root, 'database/seeds/2026-10-28-site-updates.sql'), 'utf8'));
    await db.query(`INSERT INTO users (id, email, role) VALUES ($1, $2, 'admin'), ($3, $4, 'student')`, [
      admin,
      `${admin}@test.local`,
      student,
      `${student}@test.local`,
    ]);
    listRoute = await import('@/app/api/admin/site-updates/route');
    itemRoute = await import('@/app/api/admin/site-updates/[id]/route');
    queries = await import('@/lib/siteUpdates/queries');
  });

  afterAll(async () => {
    if (db) {
      await db.query(`DELETE FROM site_updates WHERE slug = ANY($1)`, [slugs]);
      await db.query(`DELETE FROM users WHERE id = ANY($1)`, [[admin, student]]);
      await db.end();
    }
    const { closePool } = await import('@/lib/db/client');
    await closePool();
  });

  beforeEach(() => {
    session.user = null;
  });

  const as = (id: string, role: string) => {
    session.user = { id, role };
  };
  const post = (body: unknown) => listRoute.POST(new Request('http://localhost/api/admin/site-updates', { method: 'POST', body: JSON.stringify(body) }) as never);
  const patch = (id: string, action: string) =>
    itemRoute.PATCH(new Request('http://localhost', { method: 'PATCH', body: JSON.stringify({ action }) }) as never, { params: { id } });
  const put = (id: string, body: unknown) => itemRoute.PUT(new Request('http://localhost', { method: 'PUT', body: JSON.stringify(body) }) as never, { params: { id } });
  const del = (id: string) => itemRoute.DELETE(new Request('http://localhost', { method: 'DELETE' }) as never, { params: { id } });

  /** Raw SQL as ashphys_user with app.user_id (the database alone, no API). */
  async function asRole<T>(userId: string | null, fn: (c: Client) => Promise<T>): Promise<T> {
    await db.query('BEGIN');
    try {
      await db.query('SET LOCAL ROLE ashphys_user');
      await db.query(`SELECT set_config('app.user_id', $1, true)`, [userId ?? '']);
      return await fn(db);
    } finally {
      await db.query('ROLLBACK');
    }
  }

  it('only admins can use the admin API', async () => {
    expect((await listRoute.GET()).status).toBe(403);
    as(student, 'student');
    expect((await listRoute.GET()).status).toBe(403);
    expect((await post({ slug: slug('nope'), title: 'Nope' })).status).toBe(403);
  });

  it('admin creates a draft, publishes, unpublishes; the public sees it only while live', async () => {
    as(admin, 'admin');
    const res = await post({
      slug: slug('handwriting'),
      title: 'Handwritten worked solutions',
      summary: 'Watch the solution written by hand.',
      videoMp4Url: '/updates/x/film.mp4',
      ctaLabel: 'Try a practice question',
      ctaHref: '/curriculum',
    });
    expect(res.status).toBe(200);
    const { update } = await res.json();
    expect(update.isActive).toBe(false);
    expect(update.publishedAt).toBeNull();
    expect((await queries.getLiveSiteUpdates()).map((u) => u.id)).not.toContain(update.id);

    const pub = await (await patch(update.id, 'publish')).json();
    expect(pub.update.isActive).toBe(true);
    expect(pub.update.publishedAt).not.toBeNull();
    expect((await queries.getLiveSiteUpdates())[0].id).toBe(update.id);

    await patch(update.id, 'unpublish');
    expect((await queries.getLiveSiteUpdates()).map((u) => u.id)).not.toContain(update.id);
  });

  it('a future publish date is scheduled: hidden until then', async () => {
    as(admin, 'admin');
    const { update } = await (
      await post({ slug: slug('later'), title: 'Later', publishedAt: new Date(Date.now() + 86_400_000).toISOString(), publish: true })
    ).json();
    expect(update.isActive).toBe(true);
    expect((await queries.getLiveSiteUpdates()).map((u) => u.id)).not.toContain(update.id);
  });

  it('newest live first; the rest are previous updates', async () => {
    as(admin, 'admin');
    const a = (await (await post({ slug: slug('first'), title: 'First', publishedAt: '2026-01-01T00:00:00Z', publish: true })).json()).update;
    const b = (await (await post({ slug: slug('second'), title: 'Second', publishedAt: '2026-02-01T00:00:00Z', publish: true })).json()).update;
    const live = (await queries.getLiveSiteUpdates(50)).map((u) => u.id);
    expect(live.indexOf(b.id)).toBeLessThan(live.indexOf(a.id));
  });

  it('rejects unsafe links, duplicate slugs and half a CTA', async () => {
    as(admin, 'admin');
    expect((await post({ slug: slug('bad'), title: 'Bad', videoMp4Url: 'javascript:alert(1)' })).status).toBe(400);
    expect((await post({ slug: slug('cta'), title: 'CTA', ctaLabel: 'Go' })).status).toBe(400);
    const s = slug('dup');
    expect((await post({ slug: s, title: 'Dup' })).status).toBe(200);
    expect((await post({ slug: s, title: 'Dup again' })).status).toBe(409);
  });

  it('edits and deletes', async () => {
    as(admin, 'admin');
    const s = slug('edit');
    const { update } = await (await post({ slug: s, title: 'Before' })).json();
    const edited = await (await put(update.id, { slug: s, title: 'After', summary: 'Changed' })).json();
    expect(edited.update.title).toBe('After');
    expect((await del(update.id)).status).toBe(200);
    expect((await del(update.id)).status).toBe(404);
  });

  it('RLS: anonymous and students read only live rows and can never write', async () => {
    as(admin, 'admin');
    const draft = (await (await post({ slug: slug('rls-draft'), title: 'Draft' })).json()).update;
    const live = (await (await post({ slug: slug('rls-live'), title: 'Live', publish: true })).json()).update;

    for (const who of [null, student]) {
      const ids = await asRole(who, async (c) => (await c.query(`SELECT id FROM site_updates`)).rows.map((r) => r.id));
      expect(ids).toContain(live.id);
      expect(ids).not.toContain(draft.id);
      await expect(
        asRole(who, (c) => c.query(`INSERT INTO site_updates (slug, title) VALUES ('rls-insert-${admin.slice(0, 8)}', 'x')`))
      ).rejects.toMatchObject({ code: '42501' });
      const upd = await asRole(who, (c) => c.query(`UPDATE site_updates SET title = 'hacked' WHERE id = $1`, [live.id]));
      expect(upd.rowCount).toBe(0);
      const gone = await asRole(who, (c) => c.query(`DELETE FROM site_updates WHERE id = $1`, [live.id]));
      expect(gone.rowCount).toBe(0);
    }
    const adminIds = await asRole(admin, async (c) => (await c.query(`SELECT id FROM site_updates`)).rows.map((r) => r.id));
    expect(adminIds).toEqual(expect.arrayContaining([draft.id, live.id]));
  });

  it('the table refuses unsafe URLs even if the API were bypassed', async () => {
    await expect(
      db.query(`INSERT INTO site_updates (slug, title, poster_url) VALUES ($1, 'x', 'javascript:alert(1)')`, [slug('raw')])
    ).rejects.toMatchObject({ code: '23514' });
  });
});
