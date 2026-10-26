'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  DASHBOARD_TAB_INFO,
  DASHBOARD_TAB_STORAGE_KEY,
  resolveDashboardTab,
  type DashboardTab,
} from '@/lib/dashboard/tabs';
import { readyVideoCount, type StudentVideoRequest } from '@/lib/videoRequests/types';
import { useMyVideoRequests } from '@/components/video-requests/useMyVideoRequests';
import { useUnreadCount } from '@/components/messages/useUnreadCount';

interface DashboardContextValue {
  tab: DashboardTab | null;
  selectTab: (tab: DashboardTab, extra?: Record<string, string>) => void;
  videoRequests: ReturnType<typeof useMyVideoRequests>;
}

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function useDashboard(): DashboardContextValue {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used inside <DashboardTabs>');
  return ctx;
}

function readStoredTab(): string | null {
  try {
    return window.localStorage.getItem(DASHBOARD_TAB_STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeTab(tab: DashboardTab) {
  try {
    window.localStorage.setItem(DASHBOARD_TAB_STORAGE_KEY, tab);
  } catch {
    // Private mode / blocked storage: the URL still carries the tab.
  }
}

/** Puts ?tab= in the address bar without a navigation (refresh keeps the tab). */
function writeTabToUrl(tab: DashboardTab, extra?: Record<string, string>) {
  const url = new URL(window.location.href);
  url.searchParams.set('tab', tab);
  // One-off params belong to the tab they were opened with.
  if (tab !== 'videos') {
    url.searchParams.delete('lesson');
    url.searchParams.delete('request');
  }
  for (const [k, v] of Object.entries(extra ?? {})) url.searchParams.set(k, v);
  window.history.replaceState(window.history.state, '', `${url.pathname}?${url.searchParams.toString()}${url.hash}`);
}

function Badge({ count, label }: { count: number; label: string }) {
  if (count <= 0) return null;
  return (
    <span
      className="ml-auto inline-flex min-w-[1.375rem] h-[1.375rem] items-center justify-center rounded-full bg-rose-600 px-1.5 text-[11px] font-bold text-white tabular-nums"
      aria-label={label}
    >
      {count > 99 ? '99+' : count}
    </span>
  );
}

/**
 * Two-column tabbed student dashboard. Left: a vertical tab list (a
 * horizontal, scrollable tab bar below `lg`). Right: the selected tab's
 * panel, scrolling on its own. Panels are passed in from the server page,
 * each mounting the existing component for that feature; only the active
 * one is mounted.
 *
 * `tabParam` is the raw ?tab= the page was rendered with. Without it, the
 * tab is chosen after mount (localStorage is browser-only), see
 * lib/dashboard/tabs.ts for the rules.
 */
export function DashboardTabs({
  tabParam,
  initialRequests,
  initialUnread,
  initialUnreadNotes = 0,
  header,
  panels,
}: {
  tabParam: string | null;
  initialRequests: StudentVideoRequest[];
  initialUnread: number;
  /** Teacher notes on the progress report not opened yet (badge + default tab). */
  initialUnreadNotes?: number;
  header?: ReactNode;
  panels: Record<DashboardTab, ReactNode>;
}) {
  const videoRequests = useMyVideoRequests(initialRequests);
  const unread = useUnreadCount(initialUnread);
  const ready = readyVideoCount(videoRequests.requests);
  const initialReady = useRef(readyVideoCount(initialRequests));
  const initialNotes = useRef(initialUnreadNotes);
  const [unreadNotes, setUnreadNotes] = useState(initialUnreadNotes);

  const [tab, setTab] = useState<DashboardTab | null>(() =>
    tabParam ? resolveDashboardTab(tabParam, null, initialReady.current, initialNotes.current) : null
  );

  // Resolve (no ?tab=: localStorage, then the default) and normalise the URL.
  // Re-runs when a <Link> to /dashboard?tab=… re-renders the page.
  useEffect(() => {
    const next = resolveDashboardTab(tabParam, tabParam ? null : readStoredTab(), initialReady.current, initialNotes.current);
    setTab(next);
    storeTab(next);
    writeTabToUrl(next);
  }, [tabParam]);

  const selectTab = useCallback((next: DashboardTab, extra?: Record<string, string>) => {
    setTab(next);
    storeTab(next);
    writeTabToUrl(next, extra);
  }, []);

  // Opening the report reads the teacher's notes: clear the badge (the card
  // keeps its "New" tag until the next visit, so the student still spots it).
  useEffect(() => {
    if (tab !== 'report' || unreadNotes === 0) return;
    setUnreadNotes(0);
    fetch('/api/student/report/seen', { method: 'POST' }).catch(() => {});
  }, [tab, unreadNotes]);

  const tabRefs = useRef<Partial<Record<DashboardTab, HTMLButtonElement | null>>>({});
  const tablistRef = useRef<HTMLDivElement>(null);

  // On phones the tab list is a horizontal scroller: keep the selected tab in
  // view. Scrolls only the bar itself, never the page.
  useEffect(() => {
    const list = tablistRef.current;
    const btn = tab ? tabRefs.current[tab] : null;
    if (!list || !btn || list.scrollWidth <= list.clientWidth) return;
    const left = btn.offsetLeft - list.offsetLeft;
    if (left < list.scrollLeft || left + btn.offsetWidth > list.scrollLeft + list.clientWidth) {
      list.scrollTo({ left: Math.max(0, left - 8) });
    }
  }, [tab]);
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const ids = DASHBOARD_TAB_INFO.map((t) => t.id);
    const current = ids.indexOf(tab ?? ids[0]);
    let next = current;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (current + 1) % ids.length;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (current - 1 + ids.length) % ids.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = ids.length - 1;
    else return;
    e.preventDefault();
    selectTab(ids[next]);
    tabRefs.current[ids[next]]?.focus();
  };

  const badgeFor = (id: DashboardTab) =>
    id === 'messages' ? (
      <Badge count={unread} label={`${unread} unread message${unread === 1 ? '' : 's'}`} />
    ) : id === 'videos' ? (
      <Badge count={ready} label={`${ready} video${ready === 1 ? '' : 's'} ready to watch`} />
    ) : id === 'report' ? (
      <Badge count={unreadNotes} label={`${unreadNotes} new note${unreadNotes === 1 ? '' : 's'} from your teacher`} />
    ) : null;

  return (
    <DashboardContext.Provider value={{ tab, selectTab, videoRequests }}>
      <div className="flex flex-col h-[calc(100dvh-9.5rem)] min-h-[34rem]">
        {header}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div
            ref={tablistRef}
            role="tablist"
            aria-label="Dashboard sections"
            aria-orientation="vertical"
            onKeyDown={onKeyDown}
            className="shrink-0 flex lg:flex-col gap-1 p-2 lg:w-[280px] overflow-x-auto lg:overflow-x-visible lg:overflow-y-auto border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50 [scrollbar-width:thin]"
          >
            {DASHBOARD_TAB_INFO.map((t) => {
              const selected = tab === t.id;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[t.id] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`dashboard-tab-${t.id}`}
                  aria-selected={selected}
                  aria-controls={`dashboard-panel-${t.id}`}
                  tabIndex={selected || (tab === null && t.id === 'messages') ? 0 : -1}
                  onClick={() => selectTab(t.id)}
                  className={`shrink-0 min-h-[44px] flex items-center lg:items-start gap-2.5 rounded-lg px-3 py-2 lg:py-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                    selected
                      ? 'bg-white shadow-sm ring-1 ring-gray-200 text-gray-900'
                      : 'text-gray-600 hover:bg-white/70 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg leading-none lg:mt-0.5" aria-hidden="true">
                    {t.icon}
                  </span>
                  <span className="min-w-0 lg:flex-1">
                    <span className="flex items-center gap-2">
                      <span className={`whitespace-nowrap text-sm ${selected ? 'font-semibold' : 'font-medium'}`}>{t.title}</span>
                      <span className="lg:hidden">{badgeFor(t.id)}</span>
                    </span>
                    <span className="hidden lg:block text-xs text-gray-500 leading-snug mt-0.5">{t.description}</span>
                  </span>
                  <span className="hidden lg:flex">{badgeFor(t.id)}</span>
                </button>
              );
            })}
          </div>

          {tab === null ? (
            <div className="flex-1 min-h-0 p-6 text-sm text-gray-400" aria-busy="true">
              Loading…
            </div>
          ) : (
            <div
              role="tabpanel"
              id={`dashboard-panel-${tab}`}
              aria-labelledby={`dashboard-tab-${tab}`}
              tabIndex={0}
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6 focus:outline-none"
            >
              {panels[tab]}
            </div>
          )}
        </div>
      </div>
    </DashboardContext.Provider>
  );
}
