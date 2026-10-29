/**
 * The student dashboard's tabs and how the active one is chosen.
 * Pure (no browser or server imports), so both the page and tests use it.
 *
 * Order of precedence:
 *   1. a valid ?tab= in the URL;
 *   2. an INVALID ?tab= falls straight back to the default (not to storage);
 *   3. no ?tab= at all: the last tab saved in localStorage, if valid;
 *   4. the default: "report" when the teacher left a note the student hasn't
 *      read, else "videos" when a fulfilled video is waiting unopened,
 *      otherwise "messages".
 */

export const DASHBOARD_TABS = ['messages', 'report', 'curriculum', 'classes', 'videos', 'tutoring', 'solutions'] as const;
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
  {
    id: 'report',
    icon: '📊',
    title: 'My Progress Report',
    description: 'Your strengths, weak points and what to focus on next — with notes from your teacher. Download it as a PDF.',
  },
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
  {
    id: 'solutions',
    icon: '🤝',
    title: 'My Shared Solutions',
    description: 'Solutions you shared from your practice workspace, and whether your teacher approved them.',
  },
];

export function isDashboardTab(value: unknown): value is DashboardTab {
  return typeof value === 'string' && (DASHBOARD_TABS as readonly string[]).includes(value);
}

export function defaultDashboardTab(readyVideos: number, unreadNotes = 0): DashboardTab {
  if (unreadNotes > 0) return 'report';
  return readyVideos > 0 ? 'videos' : 'messages';
}

/**
 * @param param  the raw ?tab= value: undefined/null/'' when absent
 * @param stored the raw localStorage value (null when absent or unreadable)
 * @param unreadNotes teacher notes on the report the student hasn't opened
 */
export function resolveDashboardTab(
  param: string | null | undefined,
  stored: string | null | undefined,
  readyVideos: number,
  unreadNotes = 0
): DashboardTab {
  if (param !== undefined && param !== null && param !== '') {
    return isDashboardTab(param) ? param : defaultDashboardTab(readyVideos, unreadNotes);
  }
  // A new teacher note beats the remembered tab: it is the one thing to see first.
  if (unreadNotes > 0) return 'report';
  if (isDashboardTab(stored)) return stored;
  return defaultDashboardTab(readyVideos, unreadNotes);
}

/** The dashboard URL for a tab, keeping other query params (e.g. ?lesson=). */
export function dashboardTabHref(tab: DashboardTab, extra?: Record<string, string>): string {
  const params = new URLSearchParams({ tab, ...extra });
  return `/dashboard?${params.toString()}`;
}
