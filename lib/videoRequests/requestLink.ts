/**
 * The link from a practice page to the dashboard's Video Solve Requests tab,
 * and the checks the dashboard runs on it. Pure (no server or browser
 * imports), so the button, the page and the tests share it.
 *
 *   /dashboard?tab=videos&lesson={lessonId}&question={questionId}&from={practice path}
 *
 * IDs only: question text never goes in the URL. On the dashboard an unknown
 * lesson or question is dropped silently (the form falls back to a general
 * request), and `from` is only kept when it is a path on this site that
 * points at a known route, so it can't be used as an open redirect.
 */

import { dashboardTabHref } from '@/lib/dashboard/tabs';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const isUuid = (v: unknown): v is string => typeof v === 'string' && UUID.test(v);

/** Pages a student can come back to after sending a request. */
const RETURN_ROUTES: readonly { pattern: RegExp; label: string }[] = [
  { pattern: /^\/practice\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, label: 'Back to practice' },
  { pattern: /^\/lessons\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i, label: 'Back to the lesson' },
];

/** Query params a return path may keep (the curriculum bank). Everything else is dropped. */
const RETURN_PARAMS: Record<string, RegExp> = { c: /^[a-z-]{2,12}$/ };

/**
 * `from` as a safe, same-site path on a known route (rebuilt from its parsed
 * parts), or null. Rejects absolute and protocol-relative URLs, backslashes,
 * control characters and anything not in RETURN_ROUTES.
 */
export function safeReturnPath(from: unknown): string | null {
  if (typeof from !== 'string' || from.length === 0 || from.length > 300) return null;
  if (!from.startsWith('/') || from.startsWith('//') || /[\\\s]/.test(from)) return null;
  for (let i = 0; i < from.length; i++) {
    const code = from.charCodeAt(i);
    if (code < 32 || code === 127) return null; // control characters
  }
  let url: URL;
  try {
    url = new URL(from, 'https://ashphys.invalid');
  } catch {
    return null;
  }
  if (url.origin !== 'https://ashphys.invalid') return null;
  if (!RETURN_ROUTES.some((r) => r.pattern.test(url.pathname))) return null;
  const kept = new URLSearchParams();
  for (const [key, rule] of Object.entries(RETURN_PARAMS)) {
    const value = url.searchParams.get(key);
    if (value && rule.test(value)) kept.set(key, value);
  }
  const search = kept.toString();
  return search ? `${url.pathname}?${search}` : url.pathname;
}

/** The link text for a return path ("Back to practice"), or null when it isn't safe. */
export function returnLinkLabel(from: string | null): string | null {
  const safe = safeReturnPath(from);
  if (!safe) return null;
  const path = safe.split('?')[0];
  return RETURN_ROUTES.find((r) => r.pattern.test(path))?.label ?? null;
}

/** The dashboard link the "Request a video" button opens. */
export function videoRequestHref({
  lessonId,
  questionId,
  from,
}: {
  lessonId: string;
  questionId?: string | null;
  from?: string | null;
}): string {
  const extra: Record<string, string> = { lesson: lessonId };
  if (questionId) extra.question = questionId;
  const safeFrom = safeReturnPath(from);
  if (safeFrom) extra.from = safeFrom;
  return dashboardTabHref('videos', extra);
}

export interface VideoRequestParams {
  lessonId: string | null;
  questionId: string | null;
  from: string | null;
}

type RawParam = string | string[] | undefined | null;

const first = (v: RawParam): string | null => (Array.isArray(v) ? v[0] ?? null : v ?? null);

/**
 * Validates the dashboard's ?lesson=, ?question= and ?from=.
 *
 * @param isKnownLesson   true for a lesson (topics row) the form can offer
 * @param lessonOfQuestion the lesson a question (problems row) belongs to, or null when there is no such question
 *
 * An unknown lesson clears the lesson (and its question). A question is kept
 * only when it exists and belongs to the lesson; with no lesson given, a
 * known question brings its own lesson.
 */
export function parseVideoRequestParams(
  raw: { lesson?: RawParam; question?: RawParam; from?: RawParam },
  lookups: { isKnownLesson: (id: string) => boolean; lessonOfQuestion: (id: string) => string | null }
): VideoRequestParams {
  const lessonRaw = first(raw.lesson);
  const questionRaw = first(raw.question);
  const from = safeReturnPath(first(raw.from));

  let lessonId = isUuid(lessonRaw) && lookups.isKnownLesson(lessonRaw) ? lessonRaw : null;
  let questionId: string | null = null;
  if (isUuid(questionRaw)) {
    const owner = lookups.lessonOfQuestion(questionRaw);
    if (owner && lookups.isKnownLesson(owner)) {
      if (lessonId === null && !lessonRaw) lessonId = owner;
      if (owner === lessonId) questionId = questionRaw;
    }
  }
  return { lessonId, questionId, from };
}
