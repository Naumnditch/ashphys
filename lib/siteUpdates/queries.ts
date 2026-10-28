/**
 * site_updates reads and writes. Every query runs through withRlsContext, so
 * the database decides what the caller may see (live rows for everyone,
 * everything for admins) and who may write (admins only); the WHERE clauses
 * below repeat the public rule as defence in depth.
 */

import type { PoolClient } from 'pg';
import { withRlsContext } from '@/lib/db/rls';
import type { AdminSiteUpdate, SiteUpdate } from './types';
import type { SiteUpdateInput } from './validate';

const COLUMNS = `id, slug, title, summary, video_mp4_url, video_webm_url, poster_url, loop_mp4_url, loop_webm_url,
                 captions_vtt_url, cta_label, cta_href, published_at, is_active, created_at, updated_at`;

const iso = (v: unknown): string | null => (v instanceof Date ? v.toISOString() : typeof v === 'string' ? v : null);

function toUpdate(r: Record<string, any>): SiteUpdate {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    summary: r.summary,
    videoMp4Url: r.video_mp4_url,
    videoWebmUrl: r.video_webm_url,
    posterUrl: r.poster_url,
    loopMp4Url: r.loop_mp4_url,
    loopWebmUrl: r.loop_webm_url,
    captionsVttUrl: r.captions_vtt_url,
    ctaLabel: r.cta_label,
    ctaHref: r.cta_href,
    publishedAt: iso(r.published_at),
    isActive: r.is_active,
  };
}

function toAdminUpdate(r: Record<string, any>): AdminSiteUpdate {
  return { ...toUpdate(r), createdAt: iso(r.created_at) ?? '', updatedAt: iso(r.updated_at) ?? '' };
}

/**
 * Live announcements, newest first: the first is the hero's, the rest are
 * "Previous updates". Read as an anonymous visitor, so an admin sees the
 * homepage exactly as the public does. Any failure (e.g. the migration not
 * applied yet) means "no updates": the hero then renders nothing extra.
 */
export async function getLiveSiteUpdates(limit = 8): Promise<SiteUpdate[]> {
  try {
    return await withRlsContext(null, async (db) => {
      const result = await db.query(
        `SELECT ${COLUMNS} FROM site_updates
         WHERE is_active AND published_at IS NOT NULL AND published_at <= now()
         ORDER BY published_at DESC, created_at DESC
         LIMIT $1`,
        [limit]
      );
      return result.rows.map(toUpdate);
    });
  } catch (err) {
    // Once per server instance: before the migration is applied this fails on every homepage view.
    if (!warned) console.error('site updates: could not load (homepage shows no update)', err instanceof Error ? err.message : err);
    warned = true;
    return [];
  }
}

let warned = false;

export async function listSiteUpdates(admin: { id: string }): Promise<AdminSiteUpdate[]> {
  return withRlsContext(admin, async (db) => {
    const result = await db.query(
      `SELECT ${COLUMNS} FROM site_updates ORDER BY published_at DESC NULLS FIRST, created_at DESC`
    );
    return result.rows.map(toAdminUpdate);
  });
}

const FIELD_COLUMNS: [keyof SiteUpdateInput, string][] = [
  ['slug', 'slug'],
  ['title', 'title'],
  ['summary', 'summary'],
  ['videoMp4Url', 'video_mp4_url'],
  ['videoWebmUrl', 'video_webm_url'],
  ['posterUrl', 'poster_url'],
  ['loopMp4Url', 'loop_mp4_url'],
  ['loopWebmUrl', 'loop_webm_url'],
  ['captionsVttUrl', 'captions_vtt_url'],
  ['ctaLabel', 'cta_label'],
  ['ctaHref', 'cta_href'],
  ['publishedAt', 'published_at'],
];

export type WriteResult = { ok: true; update: AdminSiteUpdate } | { ok: false; status: number; error: string };

function writeError(err: unknown): WriteResult {
  const code = (err as { code?: string })?.code;
  if (code === '23505') return { ok: false, status: 409, error: 'Another update already uses that slug.' };
  if (code === '23514') return { ok: false, status: 400, error: 'One of the values is not allowed (check the links and lengths).' };
  if (code === '42501') return { ok: false, status: 403, error: 'Not authorized' };
  throw err;
}

export async function createSiteUpdate(admin: { id: string }, input: SiteUpdateInput, isActive: boolean): Promise<WriteResult> {
  try {
    return await withRlsContext(admin, async (db) => {
      const cols = FIELD_COLUMNS.map(([, c]) => c);
      const values: unknown[] = FIELD_COLUMNS.map(([k]) => input[k]);
      const publishedAt = isActive && !input.publishedAt ? new Date().toISOString() : input.publishedAt;
      values[cols.indexOf('published_at')] = publishedAt;
      const result = await db.query(
        `INSERT INTO site_updates (${cols.join(', ')}, is_active, created_by)
         VALUES (${cols.map((_, i) => `$${i + 1}`).join(', ')}, $${cols.length + 1}, $${cols.length + 2})
         RETURNING ${COLUMNS}`,
        [...values, isActive, admin.id]
      );
      return { ok: true as const, update: toAdminUpdate(result.rows[0]) };
    });
  } catch (err) {
    return writeError(err);
  }
}

async function updateRow(db: PoolClient, id: string, sets: string[], params: unknown[]): Promise<WriteResult> {
  const result = await db.query(
    `UPDATE site_updates SET ${sets.join(', ')}, updated_at = now() WHERE id = $1 RETURNING ${COLUMNS}`,
    [id, ...params]
  );
  if (result.rowCount === 0) return { ok: false, status: 404, error: 'Not found' };
  return { ok: true, update: toAdminUpdate(result.rows[0]) };
}

export async function updateSiteUpdate(admin: { id: string }, id: string, input: SiteUpdateInput): Promise<WriteResult> {
  try {
    return await withRlsContext(admin, (db) =>
      updateRow(
        db,
        id,
        FIELD_COLUMNS.map(([, c], i) => `${c} = $${i + 2}`),
        FIELD_COLUMNS.map(([k]) => input[k])
      )
    );
  } catch (err) {
    return writeError(err);
  }
}

/** Publish (live now, or at its scheduled published_at) or unpublish. */
export async function setSiteUpdateActive(admin: { id: string }, id: string, active: boolean): Promise<WriteResult> {
  try {
    return await withRlsContext(admin, (db) =>
      active
        ? updateRow(db, id, ['is_active = true', 'published_at = coalesce(published_at, now())'], [])
        : updateRow(db, id, ['is_active = false'], [])
    );
  } catch (err) {
    return writeError(err);
  }
}

export async function deleteSiteUpdate(admin: { id: string }, id: string): Promise<boolean> {
  const result = await withRlsContext(admin, (db) => db.query(`DELETE FROM site_updates WHERE id = $1`, [id]));
  return (result.rowCount ?? 0) > 0;
}
