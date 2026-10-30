'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type ReactNode, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { formatUpdateDate, newestFirst, type SiteUpdate } from '@/lib/siteUpdates/types';

/**
 * The homepage's "What's New" announcements (site_updates rows, newest first).
 *
 * - `variant="hero"`: the hero's media column, seen on first look — a
 *   playlist of the live announcements, newest first (see HeroPlaylist).
 * - `variant="row"`: the newest one as a card with a short muted loop, a
 *   modal player (controls + captions) and a drawer of older announcements.
 * Renders nothing when there is no update.
 *
 * The loop never competes with the page's first paint: in the row, no video
 * or poster bytes are fetched until the card is within 200px of the viewport;
 * it plays only while at least a quarter of it is visible, and visitors who
 * prefer reduced motion get the poster alone (the modal stays one click away).
 * The poster is drawn into a <canvas> and the video fades in from opacity 0,
 * so neither ever becomes the page's Largest Contentful Paint element: LCP
 * stays the hero's own content, as before this card existed.
 */
export function WhatsNew({ updates, variant = 'row' }: { updates: SiteUpdate[]; variant?: 'row' | 'hero' }) {
  const [playing, setPlaying] = useState<SiteUpdate | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const latest = updates[0];
  if (!latest) return null;
  if (variant === 'hero') return <HeroPlaylist updates={updates} reducedMotion={reducedMotion} />;
  const previous = updates.slice(1);
  const hasVideo = hasAnyVideo(latest);

  return (
    <section
      aria-labelledby="whats-new-title"
      className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
      data-testid="whats-new"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7 lg:order-2">
          {hasVideo ? (
            <LoopPlayer update={latest} reducedMotion={reducedMotion} onOpen={() => setPlaying(latest)} />
          ) : latest.posterUrl ? (
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
              {/* eslint-disable-next-line @next/next/no-img-element -- storage/static URL in a fixed-ratio box */}
              <img src={latest.posterUrl} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          ) : null}
        </div>
        <div className="p-5 sm:p-6 lg:p-8 lg:col-span-5 lg:order-1">
          <div className="flex items-center gap-2 mb-3">
            <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">New</span>
            {latest.publishedAt && (
              <time dateTime={latest.publishedAt} className="text-xs font-medium text-gray-500">
                {formatUpdateDate(latest.publishedAt)}
              </time>
            )}
          </div>
          <h2 id="whats-new-title" className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            {latest.title}
          </h2>
          {latest.summary && <p className="mt-2 text-sm sm:text-[15px] leading-relaxed text-gray-600">{latest.summary}</p>}
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
            {latest.ctaLabel && latest.ctaHref && <CtaLink href={latest.ctaHref}>{latest.ctaLabel}</CtaLink>}
            {hasVideo && (
              <button
                type="button"
                onClick={() => setPlaying(latest)}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-800 hover:text-black underline-offset-4 hover:underline"
              >
                <PlayIcon className="h-4 w-4" /> Watch the video
              </button>
            )}
            {previous.length > 0 && (
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className="text-sm font-medium text-gray-500 hover:text-gray-900 underline-offset-4 hover:underline"
                aria-haspopup="dialog"
              >
                Previous updates
              </button>
            )}
          </div>
        </div>
      </div>

      <Overlays
        previous={previous}
        drawerOpen={drawerOpen}
        playing={playing}
        reducedMotion={reducedMotion}
        onCloseDrawer={() => setDrawerOpen(false)}
        onWatch={setPlaying}
        onCloseVideo={() => setPlaying(null)}
      />
    </section>
  );
}

const hasAnyVideo = (u: SiteUpdate) => Boolean(u.videoMp4Url || u.videoWebmUrl || u.loopMp4Url || u.loopWebmUrl);

/** The "Previous updates" drawer and the modal player, when open. */
function Overlays({
  previous,
  drawerOpen,
  playing,
  reducedMotion,
  onCloseDrawer,
  onWatch,
  onCloseVideo,
}: {
  previous: SiteUpdate[];
  drawerOpen: boolean;
  playing: SiteUpdate | null;
  reducedMotion: boolean;
  onCloseDrawer: () => void;
  onWatch: (u: SiteUpdate) => void;
  onCloseVideo: () => void;
}) {
  return (
    <>
      {drawerOpen && (
        <UpdatesDrawer
          updates={previous}
          onClose={onCloseDrawer}
          onWatch={(u) => {
            onCloseDrawer();
            onWatch(u);
          }}
        />
      )}
      {playing && <VideoModal update={playing} reducedMotion={reducedMotion} onClose={onCloseVideo} />}
    </>
  );
}

/**
 * The hero's media column: the live announcements as a playlist, newest
 * first. The current one's video plays once (muted, inline, as the loop did);
 * when it ends, an overlay offers the next (older) one — on the last, back to
 * the latest or replay. ‹ › and "1 / 2" switch at any time; nothing advances
 * on its own. Nothing of a later announcement is fetched until the visitor
 * asks for it, except its poster once the current video has ended. The NEW
 * badge marks the newest only; the text below follows the current one.
 */
function HeroPlaylist({ updates, reducedMotion }: { updates: SiteUpdate[]; reducedMotion: boolean }) {
  const playlist = useMemo(() => newestFirst(updates), [updates]);
  const [index, setIndex] = useState(0);
  const [ended, setEnded] = useState(false);
  // Bumped to play the same announcement again (remounts its player).
  const [run, setRun] = useState(0);
  const [playing, setPlaying] = useState<SiteUpdate | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const count = playlist.length;
  const at = Math.min(index, count - 1);
  const current = playlist[at];
  const next = at + 1 < count ? playlist[at + 1] : null;
  const isLast = next === null;
  const hasVideo = hasAnyVideo(current);
  // Older than the one showing.
  const previous = playlist.slice(at + 1);

  const go = (i: number) => {
    setIndex(i);
    setEnded(false);
  };
  const replay = () => {
    setEnded(false);
    setRun((r) => r + 1);
  };

  const arrow =
    'flex h-11 w-11 sm:h-9 sm:w-9 items-center justify-center rounded-full text-white hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:opacity-35 disabled:hover:bg-transparent';
  const controls =
    count > 1 ? (
      <div className="flex items-center rounded-full bg-black/50 ring-1 ring-white/20 backdrop-blur-sm" role="group" aria-label="Announcement videos">
        <button type="button" onClick={() => go(at - 1)} disabled={at === 0} className={arrow} aria-label={at > 0 ? `Previous video: ${playlist[at - 1].title}` : 'Previous video'}>
          <ChevronIcon className="h-4 w-4 rotate-180" />
        </button>
        <span className="min-w-[2.75rem] text-center text-xs font-semibold tabular-nums text-white" aria-hidden="true">
          {at + 1} / {count}
        </span>
        <button type="button" onClick={() => next && go(at + 1)} disabled={isLast} className={arrow} aria-label={next ? `Next video: ${next.title}` : 'Next video'}>
          <ChevronIcon className="h-4 w-4" />
        </button>
      </div>
    ) : null;

  const big =
    'inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black';

  return (
    <section aria-labelledby="whats-new-title" data-testid="whats-new">
      <div className="theme-light relative overflow-hidden rounded-2xl bg-gray-100 shadow-2xl shadow-blue-950/20 ring-1 ring-black/5">
        {hasVideo ? (
          <LoopPlayer
            key={`${current.id}:${run}`}
            update={current}
            reducedMotion={reducedMotion}
            onOpen={() => setPlaying(current)}
            eager
            loop={false}
            onEnded={() => setEnded(true)}
            controls={controls}
          />
        ) : current.posterUrl || controls ? (
          <div className="relative aspect-video w-full">
            {current.posterUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- storage/static URL in a fixed-ratio box
              <img src={current.posterUrl} alt="" decoding="async" className="absolute inset-0 h-full w-full object-cover" />
            )}
            {controls && <div className="absolute bottom-3 right-3 z-20">{controls}</div>}
          </div>
        ) : null}

        {ended && (
          // The end card: what's next (its poster is fetched only now), or back to the start.
          // Clear of the date chip at the top and the controls at the bottom, down to phone width.
          <div
            className={`absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 px-4 pb-14 pt-10 text-center text-white sm:gap-3 sm:pb-12 sm:pt-3 ${next?.posterUrl ? 'bg-gray-950' : 'bg-black/75'}`}
            data-testid="whats-new-end"
          >
            {next?.posterUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- storage/static URL, decorative backdrop
              <img src={next.posterUrl} alt="" decoding="async" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-35" />
            )}
            {next ? (
              <>
                <p className="hidden text-[11px] font-semibold uppercase tracking-wider text-white/75 sm:block">Up next</p>
                <p className="line-clamp-1 max-w-md text-sm font-semibold sm:line-clamp-2 sm:text-lg">{next.title}</p>
                <button type="button" onClick={() => go(at + 1)} className={`${big} bg-white text-gray-900 hover:bg-gray-100`} aria-label={`Next video: ${next.title}`}>
                  Next video <ChevronIcon className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold sm:text-lg">That&rsquo;s all for now</p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {count > 1 && (
                    <button type="button" onClick={() => go(0)} className={`${big} bg-white text-gray-900 hover:bg-gray-100`} aria-label={`Back to the latest: ${playlist[0].title}`}>
                      Back to the latest
                    </button>
                  )}
                  <button type="button" onClick={replay} className={`${big} bg-white/15 text-white ring-1 ring-white/40 hover:bg-white/25`} aria-label={`Replay: ${current.title}`}>
                    Replay
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <div
          className={`pointer-events-none absolute left-3 top-3 z-20 flex items-center gap-2 rounded-full bg-white/90 py-1 pr-3 shadow-sm ring-1 ring-black/5 backdrop-blur-sm ${at === 0 ? 'pl-1' : 'pl-3'}`}
        >
          {at === 0 && <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">New</span>}
          {current.publishedAt && (
            <time dateTime={current.publishedAt} className="text-xs font-medium text-gray-700">
              {formatUpdateDate(current.publishedAt)}
            </time>
          )}
        </div>
      </div>
      {count > 1 && (
        <p className="sr-only" aria-live="polite">
          Video {at + 1} of {count}: {current.title}
        </p>
      )}
      <div className="mt-4 flex flex-col gap-3">
        <div className="min-w-0">
          <h2 id="whats-new-title" className="text-lg sm:text-xl font-bold tracking-tight text-gray-900">
            {current.title}
          </h2>
          {current.summary && <p className="mt-1 text-sm leading-relaxed text-gray-600">{current.summary}</p>}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2">
          {current.ctaLabel && current.ctaHref && <CtaLink href={current.ctaHref}>{current.ctaLabel}</CtaLink>}
          {hasVideo && (
            <button
              type="button"
              onClick={() => setPlaying(current)}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-800 hover:text-black underline-offset-4 hover:underline"
            >
              <PlayIcon className="h-4 w-4" /> Watch the video
            </button>
          )}
          {previous.length > 0 && (
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="text-sm font-medium text-gray-500 hover:text-gray-900 underline-offset-4 hover:underline"
              aria-haspopup="dialog"
            >
              Previous updates
            </button>
          )}
        </div>
      </div>
      <Overlays
        previous={previous}
        drawerOpen={drawerOpen}
        playing={playing}
        reducedMotion={reducedMotion}
        onCloseDrawer={() => setDrawerOpen(false)}
        onWatch={setPlaying}
        onCloseVideo={() => setPlaying(null)}
      />
    </section>
  );
}

function CtaLink({ href, children }: { href: string; children: ReactNode }) {
  // Same look as the hero's primary button.
  const cls =
    'inline-flex items-center justify-center bg-gray-900 hover:bg-black text-on-ink px-5 py-2.5 rounded-lg font-semibold text-sm transition-transform hover:scale-[1.03]';
  return href.startsWith('/') ? (
    <Link href={href} className={cls}>
      {children}
    </Link>
  ) : (
    <a href={href} className={cls} rel="noopener">
      {children}
    </a>
  );
}

/** The poster, drawn cover-fit into a canvas (a canvas is never an LCP candidate). */
function PosterCanvas({ src }: { src: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let disposed = false;
    const img = new Image();
    img.decoding = 'async';
    const draw = () => {
      if (disposed || !img.naturalWidth) return;
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.max(1, Math.round(r.width * dpr));
      canvas.height = Math.max(1, Math.round(r.height * dpr));
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const k = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
      const w = img.naturalWidth * k;
      const h = img.naturalHeight * k;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
    };
    img.onload = draw;
    img.src = src;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(draw) : null;
    ro?.observe(canvas);
    return () => {
      disposed = true;
      ro?.disconnect();
    };
  }, [src]);
  return <canvas ref={ref} aria-hidden="true" data-testid="whats-new-poster" className="absolute inset-0 h-full w-full" />;
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
}

function loopSources(u: SiteUpdate): { webm: string | null; mp4: string | null } {
  // The short 720p loop when there is one, else the full film.
  if (u.loopWebmUrl || u.loopMp4Url) return { webm: u.loopWebmUrl, mp4: u.loopMp4Url };
  return { webm: u.videoWebmUrl, mp4: u.videoMp4Url };
}

function LoopPlayer({
  update,
  reducedMotion,
  onOpen,
  eager = false,
  loop = true,
  onEnded,
  controls,
}: {
  update: SiteUpdate;
  reducedMotion: boolean;
  onOpen: () => void;
  /** Above the fold (hero): poster and loop load straight away, like the hero film did. */
  eager?: boolean;
  /** false: play once, then call onEnded (the hero playlist). */
  loop?: boolean;
  onEnded?: () => void;
  /** More buttons, shown beside the pause button. */
  controls?: ReactNode;
}) {
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(eager);
  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [done, setDone] = useState(false);
  const { webm, mp4 } = loopSources(update);
  const animate = near && !reducedMotion && Boolean(webm || mp4);

  // Lazy: nothing (not even the poster) loads until the card is close to the viewport.
  useEffect(() => {
    const el = box.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return;
    }
    const lazy = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          lazy.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    const onScreen = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    lazy.observe(el);
    onScreen.observe(el);
    return () => {
      lazy.disconnect();
      onScreen.disconnect();
    };
  }, []);

  // Sources are added once the card is near; load them, then play only while visible.
  useEffect(() => {
    const el = video.current;
    if (!el || !animate) return;
    el.muted = true;
    el.defaultMuted = true;
    el.load();
  }, [animate]);

  useEffect(() => {
    const el = video.current;
    // Played to the end (no loop): stay on the last frame; play() would start it over.
    if (!el || !animate || done) return;
    if (visible && !paused) el.play().catch(() => undefined);
    else el.pause();
  }, [animate, visible, paused, done]);

  return (
    <div ref={box} className="relative aspect-video w-full overflow-hidden bg-gray-100" data-testid="whats-new-media">
      <button
        type="button"
        onClick={onOpen}
        className="group absolute inset-0 block h-full w-full focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-blue-500"
        aria-label={`Watch the video: ${update.title}`}
      >
        {eager && update.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- storage/static URL in a fixed-ratio box
          <img src={update.posterUrl} alt="" decoding="async" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          near && update.posterUrl && <PosterCanvas src={update.posterUrl} />
        )}
        {update.posterUrl && (
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element -- no-JS fallback */}
            <img src={update.posterUrl} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
          </noscript>
        )}
        {animate && (
          <video
            ref={video}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${started ? 'opacity-100' : 'opacity-0'}`}
            muted
            loop={loop}
            playsInline
            preload="metadata"
            poster={update.posterUrl ?? undefined}
            aria-hidden="true"
            tabIndex={-1}
            onPlaying={() => setStarted(true)}
            onEnded={() => {
              setDone(true);
              onEnded?.();
            }}
          >
            {webm && <source src={webm} type="video/webm" />}
            {mp4 && <source src={mp4} type="video/mp4" />}
          </video>
        )}
        <span
          className={`absolute inset-0 flex items-center justify-center transition-opacity ${
            eager && started && !paused ? 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100' : ''
          }`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black/55 text-white shadow-lg ring-1 ring-white/30 backdrop-blur-sm transition-transform group-hover:scale-110">
            <PlayIcon className="h-6 w-6 translate-x-[1px]" />
          </span>
        </span>
      </button>
      {(controls || (animate && !done)) && (
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-2">
          {controls}
          {animate && !done && (
            // Moving content that lasts more than 5 s must be pausable (WCAG 2.2.2).
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white ring-1 ring-white/20 backdrop-blur-sm hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:h-9 sm:w-9"
              aria-label={paused ? 'Play the preview' : 'Pause the preview'}
            >
              {paused ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/** Escape closes, Tab stays inside, the page doesn't scroll, focus returns to the opener. */
function useDialog(panel: RefObject<HTMLElement>, initialFocus: RefObject<HTMLElement>, onClose: () => void) {
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    initialFocus.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close.current();
        return;
      }
      if (e.key !== 'Tab' || !panel.current) return;
      const focusable = Array.from(
        panel.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])')
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && (document.activeElement === first || !panel.current.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !panel.current.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    };
    // Capture phase: a focused <video>'s native controls swallow Escape before it bubbles.
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, [panel, initialFocus]);
}

function Portal({ children }: { children: ReactNode }) {
  // The hero's entrance animations leave a transform on their wrappers, which
  // would trap a position:fixed overlay; render overlays at the body instead.
  // Overlays only exist after a click, so this never runs on the server.
  return createPortal(children, document.body);
}

function VideoModal({ update, reducedMotion, onClose }: { update: SiteUpdate; reducedMotion: boolean; onClose: () => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  useDialog(panel, closeBtn, onClose);
  const webm = update.videoWebmUrl ?? update.loopWebmUrl;
  const mp4 = update.videoMp4Url ?? update.loopMp4Url;
  // A <track> from another origin (Storage) needs a CORS request.
  const crossOrigin = update.captionsVttUrl?.startsWith('https://') ? 'anonymous' : undefined;

  return (
    <Portal>
      <div
        className="theme-light fb-backdrop-in fixed inset-0 z-[100] flex items-center justify-center bg-scrim/80 p-3 sm:p-6"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="whats-new-modal-title" className="fb-dialog-in w-full max-w-5xl">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 id="whats-new-modal-title" className="text-base sm:text-lg font-semibold text-white">
              {update.title}
            </h2>
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close the video"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <div className="aspect-video w-full overflow-hidden rounded-xl bg-scrim shadow-2xl">
            <video
              className="h-full w-full"
              controls
              playsInline
              autoPlay={!reducedMotion}
              preload="metadata"
              poster={update.posterUrl ?? undefined}
              crossOrigin={crossOrigin}
            >
              {webm && <source src={webm} type="video/webm" />}
              {mp4 && <source src={mp4} type="video/mp4" />}
              {update.captionsVttUrl && <track kind="captions" src={update.captionsVttUrl} srcLang="en" label="English" default />}
            </video>
          </div>
          {update.ctaLabel && update.ctaHref && (
            <div className="mt-4 flex justify-center">
              <CtaLink href={update.ctaHref}>{update.ctaLabel}</CtaLink>
            </div>
          )}
        </div>
      </div>
    </Portal>
  );
}

function UpdatesDrawer({ updates, onClose, onWatch }: { updates: SiteUpdate[]; onClose: () => void; onWatch: (u: SiteUpdate) => void }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  useDialog(panel, closeBtn, onClose);

  return (
    <Portal>
      <div
        className="fb-backdrop-in fixed inset-0 z-[90] flex justify-end bg-scrim/40"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby="previous-updates-title"
          className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <h2 id="previous-updates-title" className="text-lg font-semibold text-gray-900">
              Previous updates
            </h2>
            <button
              ref={closeBtn}
              type="button"
              onClick={onClose}
              className="flex h-11 w-11 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900"
              aria-label="Close previous updates"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <ul className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {updates.map((u) => (
              <li key={u.id} className="px-5 py-4">
                {u.publishedAt && (
                  <time dateTime={u.publishedAt} className="text-xs font-medium text-gray-500">
                    {formatUpdateDate(u.publishedAt)}
                  </time>
                )}
                <p className="mt-0.5 font-semibold text-gray-900">{u.title}</p>
                {u.summary && <p className="mt-1 text-sm text-gray-600">{u.summary}</p>}
                <div className="mt-2 flex flex-wrap gap-4 text-sm">
                  {(u.videoMp4Url || u.videoWebmUrl || u.loopMp4Url || u.loopWebmUrl) && (
                    <button type="button" onClick={() => onWatch(u)} className="inline-flex items-center gap-1 font-semibold text-gray-800 hover:underline">
                      <PlayIcon className="h-3.5 w-3.5" /> Watch
                    </button>
                  )}
                  {u.ctaLabel && u.ctaHref && (
                    <a href={u.ctaHref} className="font-medium text-blue-700 hover:underline">
                      {u.ctaLabel} →
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Portal>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

function PauseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}
