/**
 * Validation of the admin form for site_updates. Mirrors the table's CHECK
 * constraints (database/seeds/2026-10-28-site-updates.sql) so a bad value is
 * a clear 400 here rather than a constraint error, and so nothing unsafe
 * (javascript:, data:, //host) can reach a src or href on the homepage.
 */

import { z } from 'zod';

export const SLUG_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const MEDIA_URL_RE = /^(https:\/\/[^\s"'<>]+|\/[^/\s"'<>][^\s"'<>]*)$/;
const LINK_RE = /^(https:\/\/[^\s"'<>]+|\/[^/\s"'<>]*)$/;

const emptyToNull = (v: unknown) => (typeof v === 'string' && v.trim() === '' ? null : typeof v === 'string' ? v.trim() : v);

const mediaUrl = z.preprocess(
  emptyToNull,
  z.string().max(1000).regex(MEDIA_URL_RE, 'must be an https:// URL or a path on this site starting with /').nullable()
);

export const siteUpdateInput = z.object({
  slug: z.string().trim().max(80).regex(SLUG_RE, 'use lower-case letters, numbers and single hyphens (e.g. handwritten-solutions)'),
  title: z.string().trim().min(1, 'is required').max(120),
  summary: z.string().trim().max(280).default(''),
  videoMp4Url: mediaUrl.default(null),
  videoWebmUrl: mediaUrl.default(null),
  posterUrl: mediaUrl.default(null),
  loopMp4Url: mediaUrl.default(null),
  loopWebmUrl: mediaUrl.default(null),
  captionsVttUrl: mediaUrl.default(null),
  ctaLabel: z.preprocess(emptyToNull, z.string().max(40).nullable()).default(null),
  ctaHref: z.preprocess(emptyToNull, z.string().max(1000).regex(LINK_RE, 'must be an https:// URL or a path on this site starting with /').nullable()).default(null),
  publishedAt: z.preprocess(emptyToNull, z.string().datetime({ offset: true }).nullable()).default(null),
});

export type SiteUpdateInput = z.infer<typeof siteUpdateInput>;

/** A CTA needs both its label and its link, or neither. */
export function ctaComplete(v: Pick<SiteUpdateInput, 'ctaLabel' | 'ctaHref'>): boolean {
  return (v.ctaLabel === null) === (v.ctaHref === null);
}

export { slugify } from './types';
