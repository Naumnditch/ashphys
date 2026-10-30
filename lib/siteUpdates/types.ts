/**
 * "What's New" announcements shown in the homepage hero (site_updates table).
 * Pure types and formatting, safe for client and server.
 */

export interface SiteUpdate {
  id: string;
  slug: string;
  title: string;
  summary: string;
  /** The full film (1080p), played in the modal. */
  videoMp4Url: string | null;
  videoWebmUrl: string | null;
  posterUrl: string | null;
  /** Short muted loop for the hero card (720p); falls back to the full film. */
  loopMp4Url: string | null;
  loopWebmUrl: string | null;
  captionsVttUrl: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  /** ISO time it goes live; null = draft. */
  publishedAt: string | null;
  isActive: boolean;
}

export interface AdminSiteUpdate extends SiteUpdate {
  createdAt: string;
  updatedAt: string;
}

export type SiteUpdateStatus = 'live' | 'scheduled' | 'draft' | 'unpublished';

export function siteUpdateStatus(u: Pick<SiteUpdate, 'isActive' | 'publishedAt'>, now: number): SiteUpdateStatus {
  if (!u.publishedAt) return 'draft';
  if (!u.isActive) return 'unpublished';
  return new Date(u.publishedAt).getTime() > now ? 'scheduled' : 'live';
}

/** What the public may see: active and published_at has arrived (the RLS read policy says the same). */
export function isLive(u: Pick<SiteUpdate, 'isActive' | 'publishedAt'>, now: number): boolean {
  return siteUpdateStatus(u, now) === 'live';
}

/** Newest first by publish time (drafts last); ties keep the order they came in. */
export function newestFirst<T extends Pick<SiteUpdate, 'publishedAt'>>(updates: T[]): T[] {
  const time = (u: T) => (u.publishedAt ? Date.parse(u.publishedAt) : Number.NEGATIVE_INFINITY);
  return [...updates].sort((a, b) => time(b) - time(a));
}

/** "28 Oct 2026", in UTC so the server and the browser render the same text. */
export function formatUpdateDate(iso: string): string {
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso));
}

/** Upload slots on the admin form → the column each fills. */
export const MEDIA_SLOTS = {
  video_mp4: { column: 'videoMp4Url', label: 'Full video (MP4, 1080p)', accept: 'video/mp4', ext: 'mp4', type: 'video/mp4' },
  video_webm: { column: 'videoWebmUrl', label: 'Full video (WebM, 1080p)', accept: 'video/webm', ext: 'webm', type: 'video/webm' },
  loop_mp4: { column: 'loopMp4Url', label: 'Hero loop (MP4, 720p)', accept: 'video/mp4', ext: 'mp4', type: 'video/mp4' },
  loop_webm: { column: 'loopWebmUrl', label: 'Hero loop (WebM, 720p)', accept: 'video/webm', ext: 'webm', type: 'video/webm' },
  poster: { column: 'posterUrl', label: 'Poster (WebP or JPG)', accept: 'image/webp,image/jpeg,image/png', ext: null, type: null },
  captions: { column: 'captionsVttUrl', label: 'Captions (WebVTT)', accept: '.vtt,text/vtt', ext: 'vtt', type: 'text/vtt' },
} as const;

export type MediaSlot = keyof typeof MEDIA_SLOTS;

export const POSTER_TYPES: Record<string, string> = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png' };

/** Title → suggested slug (client-safe: no validation library). */
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}
