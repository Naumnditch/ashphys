/**
 * YouTube video ids: parsing pasted links, and the only two URLs the site
 * ever builds from an id.
 *
 * Pure, no imports — safe in client components (the admin form previews a
 * pasted link before saving) and on the server (every save re-validates).
 *
 * Only the 11-character id is ever stored. The student UI renders the
 * privacy-enhanced embed; `youtubeWatchUrl` exists solely for the
 * "Open on YouTube" fallback link under each embed.
 */

export const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

const WATCH_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com', 'music.youtube.com']);
const NOCOOKIE_HOSTS = new Set(['youtube-nocookie.com', 'www.youtube-nocookie.com']);
const SHORT_HOSTS = new Set(['youtu.be', 'www.youtu.be']);
/** Path prefixes on youtube.com whose next segment is the video id. */
const ID_PATH_PREFIXES = ['embed', 'shorts', 'live', 'v', 'e'];

export type YouTubeIdResult = { ok: true; id: string } | { ok: false; error: string };

export function isValidYouTubeId(id: unknown): id is string {
  return typeof id === 'string' && YOUTUBE_ID_PATTERN.test(id);
}

const NOT_A_VIDEO =
  'That is not a YouTube video link. Paste a link like https://youtu.be/VIDEO_ID or https://www.youtube.com/watch?v=VIDEO_ID.';

/**
 * Extracts the 11-character id from any YouTube video URL: youtu.be/ID,
 * watch?v=ID, embed/ID (incl. youtube-nocookie.com), shorts/ID, live/ID,
 * with or without https://, www./m., `si=`, `t=`, `list=` or other params.
 * Anything else — other sites, look-alike hosts, channel/playlist links,
 * a bare id, ids of the wrong length — is rejected with a readable error.
 */
export function parseYouTubeId(input: unknown): YouTubeIdResult {
  if (typeof input !== 'string' || !input.trim()) {
    return { ok: false, error: 'Paste a YouTube link.' };
  }
  const raw = input.trim();
  if (/\s/.test(raw)) return { ok: false, error: NOT_A_VIDEO };

  let url: URL;
  try {
    url = new URL(/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return { ok: false, error: NOT_A_VIDEO };
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return { ok: false, error: NOT_A_VIDEO };
  if (url.username || url.password || url.port) return { ok: false, error: NOT_A_VIDEO };

  const host = url.hostname.toLowerCase();
  const segments = url.pathname.split('/').filter(Boolean);
  let candidate: string | null = null;

  if (SHORT_HOSTS.has(host)) {
    candidate = segments.length === 1 ? segments[0] : null;
  } else if (WATCH_HOSTS.has(host) || NOCOOKIE_HOSTS.has(host)) {
    if (segments.length === 1 && segments[0] === 'watch' && !NOCOOKIE_HOSTS.has(host)) {
      candidate = url.searchParams.get('v');
    } else if (segments.length === 2 && ID_PATH_PREFIXES.includes(segments[0])) {
      candidate = segments[1];
    }
  } else {
    return { ok: false, error: NOT_A_VIDEO };
  }

  if (candidate === null) {
    return {
      ok: false,
      error: 'That YouTube link does not point at a single video (channel, playlist and search links are not supported).',
    };
  }
  if (!isValidYouTubeId(candidate)) {
    return { ok: false, error: 'The video id in that link is not valid — YouTube ids are exactly 11 characters.' };
  }
  return { ok: true, id: candidate };
}

/** Same as parseYouTubeId but throws, for code paths that already validated. */
export function extractYouTubeId(input: unknown): string {
  const result = parseYouTubeId(input);
  if (!result.ok) throw new Error(result.error);
  return result.id;
}

/**
 * Privacy-enhanced embed: no related videos from other channels, plays inline
 * on iOS. `autoplay` is for players created by a click (the click is the
 * user gesture browsers require before playing).
 */
export function youtubeEmbedUrl(id: string, options: { autoplay?: boolean } = {}): string {
  if (!isValidYouTubeId(id)) throw new Error('Invalid YouTube id');
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1&playsinline=1${options.autoplay ? '&autoplay=1' : ''}`;
}

/** Still frame for a click-to-play thumbnail (an image, not a link). */
export function youtubeThumbnailUrl(id: string): string {
  if (!isValidYouTubeId(id)) throw new Error('Invalid YouTube id');
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/** Used ONLY for the "Open on YouTube" fallback link. */
export function youtubeWatchUrl(id: string): string {
  if (!isValidYouTubeId(id)) throw new Error('Invalid YouTube id');
  return `https://www.youtube.com/watch?v=${id}`;
}
