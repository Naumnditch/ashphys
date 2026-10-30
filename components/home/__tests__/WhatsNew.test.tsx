// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { WhatsNew } from '@/components/home/WhatsNew';
import type { SiteUpdate } from '@/lib/siteUpdates/types';

const LATEST: SiteUpdate = {
  id: '11111111-1111-4111-8111-111111111111',
  slug: 'handwritten-worked-solutions',
  title: 'Handwritten worked solutions',
  summary: 'Get a question wrong and watch the full solution in your teacher’s own handwriting.',
  videoMp4Url: '/updates/hws/film-1080p.mp4',
  videoWebmUrl: '/updates/hws/film-1080p.webm',
  posterUrl: '/updates/hws/poster.webp',
  loopMp4Url: '/updates/hws/loop-720p.mp4',
  loopWebmUrl: '/updates/hws/loop-720p.webm',
  captionsVttUrl: '/updates/hws/captions.vtt',
  ctaLabel: 'Try a practice question',
  ctaHref: '/curriculum',
  publishedAt: '2026-10-28T10:00:00.000Z',
  isActive: true,
};
const OLDER: SiteUpdate = { ...LATEST, id: '22222222-2222-4222-8222-222222222222', slug: 'older', title: 'An older update', publishedAt: '2026-10-01T10:00:00.000Z' };
const NEWEST: SiteUpdate = {
  ...LATEST,
  id: '33333333-3333-4333-8333-333333333333',
  slug: 'share-your-solution',
  title: 'Share Your Solution',
  summary: 'Share your working; once approved, other students see it with your name.',
  videoMp4Url: '/updates/sys/film-1080p.mp4',
  videoWebmUrl: '/updates/sys/film-1080p.webm',
  posterUrl: '/updates/sys/poster.webp',
  loopMp4Url: '/updates/sys/loop-720p.mp4',
  loopWebmUrl: '/updates/sys/loop-720p.webm',
  captionsVttUrl: '/updates/sys/captions.vtt',
  publishedAt: '2026-10-29T10:00:00.000Z',
};

type Observed = { cb: IntersectionObserverCallback; opts?: IntersectionObserverInit; els: Element[] };
let observers: Observed[] = [];
let reduce = false;

function intersect(isIntersecting: boolean) {
  act(() => {
    // A real observer never fires once disconnected (or with no entries).
    for (const o of observers) {
      if (o.els.length) o.cb(o.els.map((target) => ({ isIntersecting, target }) as IntersectionObserverEntry), {} as IntersectionObserver);
    }
  });
}

beforeEach(() => {
  observers = [];
  reduce = false;
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      o: Observed;
      constructor(cb: IntersectionObserverCallback, opts?: IntersectionObserverInit) {
        this.o = { cb, opts, els: [] };
        observers.push(this.o);
      }
      observe(el: Element) {
        this.o.els.push(el);
      }
      disconnect() {
        this.o.els = [];
      }
      unobserve() {}
      takeRecords() {
        return [];
      }
    }
  );
  window.matchMedia = ((q: string) => ({
    matches: q.includes('reduce') ? reduce : false,
    media: q,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, 'load').mockImplementation(() => {});
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => null);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('WhatsNew (hero slot)', () => {
  it('renders nothing when there is no update', () => {
    const { container } = render(<WhatsNew updates={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('shows the badge, date, title, summary and the CTA', () => {
    render(<WhatsNew updates={[LATEST]} />);
    expect(screen.getByText('New')).toBeTruthy();
    expect(screen.getByText('28 Oct 2026').getAttribute('datetime')).toBe(LATEST.publishedAt);
    expect(screen.getByRole('heading', { name: LATEST.title })).toBeTruthy();
    expect(screen.getByText(LATEST.summary)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Try a practice question' }).getAttribute('href')).toBe('/curriculum');
    expect(screen.queryByText('Previous updates')).toBeNull();
  });

  it('loads nothing (no video, no poster) until the card is near the viewport, then a muted inline loop', () => {
    const { container } = render(<WhatsNew updates={[LATEST]} />);
    const media = screen.getByTestId('whats-new-media');
    // Fixed-ratio box from the first paint: no layout shift when the media arrives.
    expect(media.className).toContain('aspect-video');
    expect(container.querySelector('video')).toBeNull();
    expect(screen.queryByTestId('whats-new-poster')).toBeNull();
    expect(observers.some((o) => o.opts?.rootMargin === '200px')).toBe(true);

    intersect(true);
    // The poster is drawn into a canvas (never an LCP candidate).
    expect(screen.getByTestId('whats-new-poster').tagName).toBe('CANVAS');
    const video = container.querySelector('video')!;
    expect(video).toBeTruthy();
    expect(video.muted).toBe(true);
    expect(video.loop).toBe(true);
    expect(video.hasAttribute('playsinline')).toBe(true);
    expect(video.getAttribute('preload')).toBe('metadata');
    expect(video.getAttribute('poster')).toBe(LATEST.posterUrl);
    expect([...video.querySelectorAll('source')].map((s) => s.getAttribute('src'))).toEqual([LATEST.loopWebmUrl, LATEST.loopMp4Url]);
    expect(HTMLMediaElement.prototype.play).toHaveBeenCalled();
  });

  it('pauses when scrolled away and has its own pause button', () => {
    const { container } = render(<WhatsNew updates={[LATEST]} />);
    intersect(true);
    const pause = vi.mocked(HTMLMediaElement.prototype.pause);
    pause.mockClear();
    intersect(false);
    expect(pause).toHaveBeenCalled();
    intersect(true);
    fireEvent.click(screen.getByRole('button', { name: 'Pause the preview' }));
    expect(screen.getByRole('button', { name: 'Play the preview' })).toBeTruthy();
    expect(container.querySelector('video')).toBeTruthy();
  });

  it('shows only the poster under prefers-reduced-motion', () => {
    reduce = true;
    const { container } = render(<WhatsNew updates={[LATEST]} />);
    intersect(true);
    expect(container.querySelector('video')).toBeNull();
    expect(screen.getByTestId('whats-new-poster').tagName).toBe('CANVAS');
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it('a poster without any video is just a picture (nothing to play)', () => {
    const { container } = render(
      <WhatsNew updates={[{ ...LATEST, videoMp4Url: null, videoWebmUrl: null, loopMp4Url: null, loopWebmUrl: null }]} />
    );
    expect(container.querySelector('img')?.getAttribute('loading')).toBe('lazy');
    expect(screen.queryByRole('button', { name: /Watch/ })).toBeNull();
  });

  it('falls back to the full film when there is no loop', () => {
    const { container } = render(<WhatsNew updates={[{ ...LATEST, loopMp4Url: null, loopWebmUrl: null }]} />);
    intersect(true);
    expect([...container.querySelectorAll('source')].map((s) => s.getAttribute('src'))).toEqual([LATEST.videoWebmUrl, LATEST.videoMp4Url]);
  });

  it('opens a modal player with controls and captions; Escape closes it and focus returns', () => {
    render(<WhatsNew updates={[LATEST]} />);
    const trigger = screen.getByRole('button', { name: 'Watch the video' });
    trigger.focus();
    fireEvent.click(trigger);
    const dialog = screen.getByRole('dialog', { name: LATEST.title });
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    const video = dialog.querySelector('video')!;
    expect(video.hasAttribute('controls')).toBe(true);
    expect([...video.querySelectorAll('source')].map((s) => s.getAttribute('src'))).toEqual([LATEST.videoWebmUrl, LATEST.videoMp4Url]);
    const track = video.querySelector('track')!;
    expect(track.getAttribute('kind')).toBe('captions');
    expect(track.getAttribute('src')).toBe(LATEST.captionsVttUrl);
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close the video' }));
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    expect(document.body.style.overflow).toBe('');
  });

  it('keeps Tab inside the modal', () => {
    render(<WhatsNew updates={[LATEST]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Watch the video' }));
    const dialog = screen.getByRole('dialog');
    const close = screen.getByRole('button', { name: 'Close the video' });
    const cta = dialog.querySelector('a')!;
    cta.focus();
    fireEvent.keyDown(document, { key: 'Tab' });
    expect(document.activeElement).toBe(close);
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(cta);
  });

  it('cross-origin captions get a CORS-enabled video element', () => {
    render(<WhatsNew updates={[{ ...LATEST, captionsVttUrl: 'https://x.supabase.co/storage/v1/object/public/site-updates/a/captions.vtt' }]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Watch the video' }));
    expect(screen.getByRole('dialog').querySelector('video')!.getAttribute('crossorigin')).toBe('anonymous');
  });

  it('lists older announcements in the Previous updates drawer', () => {
    render(<WhatsNew updates={[LATEST, OLDER]} />);
    fireEvent.click(screen.getByRole('button', { name: 'Previous updates' }));
    const drawer = screen.getByRole('dialog', { name: 'Previous updates' });
    expect(drawer.textContent).toContain('An older update');
    expect(drawer.textContent).toContain('1 Oct 2026');
    expect(drawer.textContent).not.toContain(LATEST.title);
    fireEvent.click(screen.getByRole('button', { name: 'Watch' }));
    expect(screen.getByRole('dialog', { name: 'An older update' })).toBeTruthy();
  });

  it('hero variant: seen on first look — poster image and the loop load straight away', () => {
    const { container } = render(<WhatsNew updates={[LATEST, OLDER]} variant="hero" />);
    expect(screen.getByText('New')).toBeTruthy();
    expect(screen.getByRole('heading', { name: LATEST.title })).toBeTruthy();
    const img = container.querySelector('[data-testid="whats-new-media"] img')!;
    expect(img.getAttribute('src')).toBe(LATEST.posterUrl);
    const video = container.querySelector('video')!;
    expect(video.muted).toBe(true);
    expect(video.hasAttribute('playsinline')).toBe(true);
    expect([...video.querySelectorAll('source')].map((s) => s.getAttribute('src'))).toEqual([LATEST.loopWebmUrl, LATEST.loopMp4Url]);
    expect(screen.getByRole('link', { name: 'Try a practice question' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Watch the video' }));
    expect(screen.getByRole('dialog', { name: LATEST.title })).toBeTruthy();
  });

  it('hero variant under reduced motion: poster only', () => {
    reduce = true;
    const { container } = render(<WhatsNew updates={[LATEST]} variant="hero" />);
    expect(container.querySelector('video')).toBeNull();
    expect(container.querySelector('[data-testid="whats-new-media"] img')).toBeTruthy();
  });
});

describe('WhatsNew hero playlist (newest first, Next button)', () => {
  const heading = () => screen.getByRole('heading', { level: 2 }).textContent;
  const sources = (container: HTMLElement) => [...container.querySelectorAll('[data-testid="whats-new-media"] video source')].map((s) => s.getAttribute('src'));
  const endCard = () => screen.getByTestId('whats-new-end');

  it('orders the videos by publish date, newest first, whatever order the rows come in', () => {
    render(<WhatsNew updates={[LATEST, OLDER, NEWEST]} variant="hero" />);
    expect(heading()).toBe(NEWEST.title);
    expect(screen.getByText('1 / 3')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: `Next video: ${LATEST.title}` }));
    expect(heading()).toBe(LATEST.title);
    fireEvent.click(screen.getByRole('button', { name: `Next video: ${OLDER.title}` }));
    expect(heading()).toBe(OLDER.title);
    expect(screen.getByText('3 / 3')).toBeTruthy();
  });

  it('plays the newest once; when it ends, Next loads the next (older) video', () => {
    const { container } = render(<WhatsNew updates={[NEWEST, LATEST]} variant="hero" />);
    const video = container.querySelector('video')!;
    expect(video.loop).toBe(false);
    expect(sources(container)).toEqual([NEWEST.loopWebmUrl, NEWEST.loopMp4Url]);
    // Nothing of the next video, not even its poster, until this one ends.
    expect(screen.queryByTestId('whats-new-end')).toBeNull();
    expect(container.querySelector(`img[src="${LATEST.posterUrl}"]`)).toBeNull();

    fireEvent.ended(video);
    const card = endCard();
    expect(card.textContent).toContain('Up next'); // shown from the sm breakpoint up
    expect(card.textContent).toContain(LATEST.title);
    expect(card.querySelector(`img[src="${LATEST.posterUrl}"]`)).toBeTruthy();

    fireEvent.click(within(card).getByRole('button', { name: `Next video: ${LATEST.title}` }));
    expect(screen.queryByTestId('whats-new-end')).toBeNull();
    expect(heading()).toBe(LATEST.title);
    expect(screen.getByText(LATEST.summary)).toBeTruthy();
    expect(screen.getByText('28 Oct 2026').getAttribute('datetime')).toBe(LATEST.publishedAt);
    expect(sources(container)).toEqual([LATEST.loopWebmUrl, LATEST.loopMp4Url]);
    expect(screen.getByText('2 / 2')).toBeTruthy();
    expect(screen.getByText(`Video 2 of 2: ${LATEST.title}`).getAttribute('aria-live')).toBe('polite');
  });

  it('shows NEW only on the newest video, and the date of the one showing', () => {
    render(<WhatsNew updates={[NEWEST, LATEST]} variant="hero" />);
    expect(screen.getByText('New')).toBeTruthy();
    expect(screen.getByText('29 Oct 2026')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: `Next video: ${LATEST.title}` }));
    expect(screen.queryByText('New')).toBeNull();
    expect(screen.getByText('28 Oct 2026')).toBeTruthy();
  });

  it('on the last video, › is disabled and the end card offers Back to the latest and Replay', () => {
    const { container } = render(<WhatsNew updates={[NEWEST, LATEST]} variant="hero" />);
    fireEvent.click(screen.getByRole('button', { name: `Next video: ${LATEST.title}` }));
    expect((screen.getByRole('button', { name: 'Next video' }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole('button', { name: `Previous video: ${NEWEST.title}` }) as HTMLButtonElement).disabled).toBe(false);

    fireEvent.ended(container.querySelector('video')!);
    const card = endCard();
    expect(within(card).queryByRole('button', { name: /^Next video/ })).toBeNull();
    const play = vi.mocked(HTMLMediaElement.prototype.play);
    play.mockClear();
    fireEvent.click(within(card).getByRole('button', { name: `Replay: ${LATEST.title}` }));
    expect(screen.queryByTestId('whats-new-end')).toBeNull();
    expect(heading()).toBe(LATEST.title);
    intersect(true);
    expect(play).toHaveBeenCalled();

    fireEvent.ended(container.querySelector('video')!);
    fireEvent.click(within(endCard()).getByRole('button', { name: `Back to the latest: ${NEWEST.title}` }));
    expect(heading()).toBe(NEWEST.title);
    expect(screen.getByText('New')).toBeTruthy();
    expect(screen.getByText('1 / 2')).toBeTruthy();
  });

  it('‹ goes back, and is disabled on the newest', () => {
    render(<WhatsNew updates={[NEWEST, LATEST]} variant="hero" />);
    expect((screen.getByRole('button', { name: 'Previous video' }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: `Next video: ${LATEST.title}` }));
    fireEvent.click(screen.getByRole('button', { name: `Previous video: ${NEWEST.title}` }));
    expect(heading()).toBe(NEWEST.title);
  });

  it('a played-out video does not start over when scrolled back into view', () => {
    const { container } = render(<WhatsNew updates={[NEWEST, LATEST]} variant="hero" />);
    intersect(true);
    fireEvent.ended(container.querySelector('video')!);
    const play = vi.mocked(HTMLMediaElement.prototype.play);
    play.mockClear();
    intersect(false);
    intersect(true);
    expect(play).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Pause the preview' })).toBeNull();
  });

  it('reduced motion: nothing plays, but ‹ › still switch videos', () => {
    reduce = true;
    const { container } = render(<WhatsNew updates={[NEWEST, LATEST]} variant="hero" />);
    expect(container.querySelector('video')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: `Next video: ${LATEST.title}` }));
    expect(heading()).toBe(LATEST.title);
    expect(container.querySelector(`[data-testid="whats-new-media"] img[src="${LATEST.posterUrl}"]`)).toBeTruthy();
    expect(container.querySelector('video')).toBeNull();
    expect(HTMLMediaElement.prototype.play).not.toHaveBeenCalled();
  });

  it('a single update shows no playlist controls', () => {
    render(<WhatsNew updates={[LATEST]} variant="hero" />);
    expect(screen.queryByRole('group', { name: 'Announcement videos' })).toBeNull();
    expect(screen.queryByText('1 / 1')).toBeNull();
    expect(screen.queryByRole('button', { name: /Next video/ })).toBeNull();
  });

  it('Previous updates lists the ones older than the video showing', () => {
    render(<WhatsNew updates={[NEWEST, LATEST, OLDER]} variant="hero" />);
    fireEvent.click(screen.getByRole('button', { name: 'Previous updates' }));
    const drawer = screen.getByRole('dialog', { name: 'Previous updates' });
    expect(drawer.textContent).toContain(LATEST.title);
    expect(drawer.textContent).toContain(OLDER.title);
    expect(drawer.textContent).not.toContain(NEWEST.title);
  });
});
