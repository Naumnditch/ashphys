import { describe, expect, it } from 'vitest';
import { ctaComplete, siteUpdateInput, slugify } from '@/lib/siteUpdates/validate';
import { formatUpdateDate, isLive, siteUpdateStatus } from '@/lib/siteUpdates/types';

const base = { slug: 'handwritten-worked-solutions', title: 'Handwritten worked solutions' };

describe('site update validation', () => {
  it('accepts https URLs and site paths, and turns empty strings into null', () => {
    const r = siteUpdateInput.parse({
      ...base,
      videoMp4Url: 'https://abc.supabase.co/storage/v1/object/public/site-updates/x/video-mp4-1.mp4',
      posterUrl: '/updates/x/poster.webp',
      captionsVttUrl: '',
      ctaLabel: 'Try a practice question',
      ctaHref: '/curriculum',
      publishedAt: '2026-10-28T10:00:00.000Z',
    });
    expect(r.posterUrl).toBe('/updates/x/poster.webp');
    expect(r.captionsVttUrl).toBeNull();
    expect(r.summary).toBe('');
  });

  it.each([
    ['javascript:alert(1)'],
    ['data:video/mp4;base64,AAAA'],
    ['//evil.example/x.mp4'],
    ['http://insecure.example/x.mp4'],
    ['/path with space.mp4'],
    ['/a"onerror="x.mp4'],
  ])('rejects unsafe media URL %s', (url) => {
    expect(siteUpdateInput.safeParse({ ...base, videoMp4Url: url }).success).toBe(false);
    expect(siteUpdateInput.safeParse({ ...base, ctaHref: url, ctaLabel: 'Go' }).success).toBe(false);
  });

  it('checks the slug, title and lengths like the table does', () => {
    expect(siteUpdateInput.safeParse({ ...base, slug: 'Bad Slug' }).success).toBe(false);
    expect(siteUpdateInput.safeParse({ ...base, slug: 'double--hyphen' }).success).toBe(false);
    expect(siteUpdateInput.safeParse({ ...base, title: '   ' }).success).toBe(false);
    expect(siteUpdateInput.safeParse({ ...base, summary: 'x'.repeat(281) }).success).toBe(false);
    expect(siteUpdateInput.safeParse({ ...base, ctaLabel: 'x'.repeat(41) }).success).toBe(false);
    expect(siteUpdateInput.safeParse({ ...base, publishedAt: 'yesterday' }).success).toBe(false);
  });

  it('needs both CTA parts or neither', () => {
    expect(ctaComplete({ ctaLabel: 'Go', ctaHref: null })).toBe(false);
    expect(ctaComplete({ ctaLabel: null, ctaHref: null })).toBe(true);
    expect(ctaComplete({ ctaLabel: 'Go', ctaHref: '/' })).toBe(true);
  });

  it('slugifies titles', () => {
    expect(slugify('New: Handwritten Worked Solutions!')).toBe('new-handwritten-worked-solutions');
    expect(slugify('Çember hareketi — déjà vu')).toBe('cember-hareketi-deja-vu');
  });
});

describe('site update status', () => {
  const now = Date.parse('2026-10-28T12:00:00Z');
  it('is draft, scheduled, live or unpublished', () => {
    expect(siteUpdateStatus({ isActive: true, publishedAt: null }, now)).toBe('draft');
    expect(siteUpdateStatus({ isActive: true, publishedAt: '2026-10-29T00:00:00Z' }, now)).toBe('scheduled');
    expect(siteUpdateStatus({ isActive: true, publishedAt: '2026-10-28T11:00:00Z' }, now)).toBe('live');
    expect(siteUpdateStatus({ isActive: false, publishedAt: '2026-10-28T11:00:00Z' }, now)).toBe('unpublished');
    expect(isLive({ isActive: true, publishedAt: '2026-10-28T11:00:00Z' }, now)).toBe(true);
  });

  it('formats dates the same on server and browser (UTC)', () => {
    expect(formatUpdateDate('2026-10-28T23:30:00Z')).toBe('28 Oct 2026');
  });
});
