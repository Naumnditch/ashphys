/**
 * The student dashboard's five tabs and how the active one is chosen.
 * Pure (no browser or server imports), so both the page and tests use it.
 *
 * Order of precedence:
 *   1. a valid ?tab= in the URL;
 *   2. an INVALID ?tab= falls straight back to the default (not to storage);
 *   3. no ?tab= at all: the last tab saved in localStorage, if valid;
 *   4. the default: "videos" when a fulfilled video is waiting unopened,
 *      otherwise "messages".
 */

export const DASHBOARD_TABS = ['messages', 'curriculum', 'classes', 'videos', 'tutoring'] as const;
export type DashboardTab = (typeof DASHBOARD_TABS)[number];

export const DASHBOARD_TAB_STORAGE_KEY = 'ashphys:dashboard-tab';

export interface DashboardTabInfo {
  id: DashboardTab;
  icon: string;
  title: string;
  description: string;
}

export const DASHBOARD_TAB_INFO: readonly DashboardTabInfo[] = [
  { id: 'messages', icon: '✉️', title: 'Messages', description: 'Read messages from the AshPhys team and ask us anything.' },
  { id: 'curriculum', icon: '📖', title: 'Browse the Curriculum', description: 'See all 25 chapters and pick what you want to study.' },
  { id: 'classes', icon: '🏫', title: 'Join a Class', description: 'Have a join code from your teacher? Enter it to join their class.' },
  {
    id: 'videos',
    icon: '🎥',
    title: 'Video Solve Requests',
    description: 'Stuck on a problem? Plus and Pro members can request a personal video walkthrough.',
  },
  {
    id: 'tutoring',
    icon: '🧑‍🏫',
    title: '1-on-1 Tutoring',
    description: 'Book a private tutoring session with a physics teacher — discounted for Pro members.',
  },
];

export function isDashboardTab(value: unknown): value is DashboardTab {
  return typeof value === 'string' && (DASHBOARD_TABS as readonly string[]).includes(value);
}

export function defaultDashboardTab(readyVideos: number): DashboardTab {
  return readyVideos > 0 ? 'videos' : 'messages';
}

/**
 * @param param  the raw ?tab= value: undefined/null/'' when absent
 * @param stored the raw localStorage value (null when absent or unreadable)
 */
export function resolveDashboardTab(
  param: string | null | undefined,
  stored: string | null | undefined,
  readyVideos: number
): DashboardTab {
  if (param !== undefined && param !== null && param !== '') {
    return isDashboardTab(param) ? param : defaultDashboardTab(readyVideos);
  }
  if (isDashboardTab(stored)) return stored;
  return defaultDashboardTab(readyVideos);
}

/** The dashboard URL for a tab, keeping other query params (e.g. ?lesson=). */
export function dashboardTabHref(tab: DashboardTab, extra?: Record<string, string>): string {
  const params = new URLSearchParams({ tab, ...extra });
  return `/dashboard?${params.toString()}`;
}
