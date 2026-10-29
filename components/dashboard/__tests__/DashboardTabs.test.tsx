// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { DASHBOARD_TAB_STORAGE_KEY, type DashboardTab } from '@/lib/dashboard/tabs';
import type { StudentVideoRequest } from '@/lib/videoRequests/types';
import { FULFILLED, request } from './fixtures';

const PANELS: Record<DashboardTab, React.ReactNode> = {
  messages: <p>messages panel</p>,
  report: <p>report panel</p>,
  curriculum: <p>curriculum panel</p>,
  classes: <p>classes panel</p>,
  videos: <p>videos panel</p>,
  tutoring: <p>tutoring panel</p>,
  solutions: <p>solutions panel</p>,
};

let serverRequests: StudentVideoRequest[] = [];

function mockFetch() {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);
    if (url.startsWith('/api/video-requests')) {
      return new Response(JSON.stringify({ success: true, requests: serverRequests }), { status: 200 });
    }
    if (url.startsWith('/api/messages/unread-count')) {
      return new Response(JSON.stringify({ success: true, count: 2 }), { status: 200 });
    }
    return new Response('{}', { status: 404 });
  });
}

function renderTabs(tabParam: string | null, initialRequests: StudentVideoRequest[] = []) {
  serverRequests = initialRequests;
  return render(
    <DashboardTabs tabParam={tabParam} initialRequests={initialRequests} initialUnread={0} panels={PANELS} />
  );
}

const selected = () => screen.getAllByRole('tab').find((t) => t.getAttribute('aria-selected') === 'true');

beforeEach(() => {
  window.localStorage.clear();
  window.history.replaceState(null, '', '/dashboard');
  vi.stubGlobal('fetch', mockFetch());
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('DashboardTabs routing', () => {
  it('opens the tab named in ?tab= and keeps it in the URL and storage', async () => {
    window.localStorage.setItem(DASHBOARD_TAB_STORAGE_KEY, 'classes');
    renderTabs('tutoring');
    expect(selected()?.textContent).toMatch(/1-on-1 Tutoring/);
    expect(screen.getByRole('tabpanel').textContent).toBe('tutoring panel');
    await waitFor(() => expect(window.location.search).toBe('?tab=tutoring'));
    expect(window.localStorage.getItem(DASHBOARD_TAB_STORAGE_KEY)).toBe('tutoring');
  });

  it('falls back to the default for an invalid ?tab=, ignoring storage', async () => {
    window.localStorage.setItem(DASHBOARD_TAB_STORAGE_KEY, 'classes');
    renderTabs('grades');
    await waitFor(() => expect(selected()?.textContent).toMatch(/^✉️Messages/));
    expect(window.location.search).toBe('?tab=messages');
  });

  it('defaults to videos for an invalid ?tab= when an unopened video is ready', async () => {
    renderTabs('grades', [FULFILLED]);
    await waitFor(() => expect(selected()?.textContent).toMatch(/Video Solve Requests/));
  });

  it('uses the last tab from localStorage when there is no ?tab=', async () => {
    window.localStorage.setItem(DASHBOARD_TAB_STORAGE_KEY, 'classes');
    renderTabs(null, [FULFILLED]);
    await waitFor(() => expect(selected()?.textContent).toMatch(/Join a Class/));
    expect(window.location.search).toBe('?tab=classes');
  });

  it('with no ?tab= and nothing stored: videos if a video is ready, else messages', async () => {
    renderTabs(null, [FULFILLED]);
    await waitFor(() => expect(screen.getByRole('tabpanel').textContent).toBe('videos panel'));
    cleanup();
    window.localStorage.clear();
    renderTabs(null, [{ ...FULFILLED, openedAt: '2026-10-13T10:00:00.000Z' }]);
    await waitFor(() => expect(screen.getByRole('tabpanel').textContent).toBe('messages panel'));
  });

  it('switching tabs rewrites the URL with replaceState (no new history entry) and remembers the tab', async () => {
    renderTabs('messages');
    await waitFor(() => expect(window.location.search).toBe('?tab=messages'));
    const length = window.history.length;
    fireEvent.click(screen.getByRole('tab', { name: /Browse the Curriculum/ }));
    expect(screen.getByRole('tabpanel').textContent).toBe('curriculum panel');
    expect(window.location.search).toBe('?tab=curriculum');
    expect(window.history.length).toBe(length);
    expect(window.localStorage.getItem(DASHBOARD_TAB_STORAGE_KEY)).toBe('curriculum');
  });

  it('wires tablist / tab / tabpanel ARIA and moves with the arrow keys', async () => {
    renderTabs('messages');
    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(7);
    expect(screen.getByRole('tablist').getAttribute('aria-orientation')).toBe('vertical');
    const panel = screen.getByRole('tabpanel');
    expect(panel.getAttribute('aria-labelledby')).toBe('dashboard-tab-messages');
    expect(tabs[0].getAttribute('aria-controls')).toBe('dashboard-panel-messages');
    expect(tabs.map((t) => t.getAttribute('tabindex'))).toEqual(['0', '-1', '-1', '-1', '-1', '-1', '-1']);

    fireEvent.keyDown(tabs[0], { key: 'ArrowDown' });
    expect(selected()?.id).toBe('dashboard-tab-report');
    expect(document.activeElement?.id).toBe('dashboard-tab-report');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowRight' });
    expect(selected()?.id).toBe('dashboard-tab-curriculum');
    fireEvent.keyDown(document.activeElement!, { key: 'End' });
    expect(selected()?.id).toBe('dashboard-tab-solutions');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowDown' });
    expect(selected()?.id).toBe('dashboard-tab-messages');
    fireEvent.keyDown(document.activeElement!, { key: 'ArrowUp' });
    expect(selected()?.id).toBe('dashboard-tab-solutions');
  });
});

describe('DashboardTabs badges', () => {
  it('shows unread messages and bumps the ready-video badge when a fulfilled video arrives on focus', async () => {
    const open = request({ id: 'req-1', status: 'in_progress' });
    renderTabs('messages', [open]);
    await waitFor(() => expect(screen.getAllByLabelText('2 unread messages').length).toBeGreaterThan(0));
    expect(screen.queryAllByLabelText(/ready to watch/)).toHaveLength(0);

    // An admin fulfils the request while the page is open; the student comes back.
    serverRequests = [{ ...open, status: 'fulfilled', youtubeId: 'dQw4w9WgXcQ' }];
    await act(async () => {
      window.dispatchEvent(new Event('focus'));
    });
    await waitFor(() => expect(screen.getAllByLabelText('1 video ready to watch').length).toBeGreaterThan(0));
  });
});

describe('DashboardTabs teacher-note badge', () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('opens the report for an unread note, shows the badge, then marks the notes read', async () => {
    const fetchMock = mockFetch();
    vi.stubGlobal('fetch', fetchMock);
    window.localStorage.setItem(DASHBOARD_TAB_STORAGE_KEY, 'tutoring');
    window.history.replaceState(null, '', '/dashboard');
    render(<DashboardTabs tabParam={null} initialRequests={[]} initialUnread={0} initialUnreadNotes={1} panels={PANELS} />);
    await waitFor(() => expect(selected()?.id).toBe('dashboard-tab-report'));
    await waitFor(() =>
      expect(
        (fetchMock.mock.calls as unknown[][]).some(([u, init]) => String(u) === '/api/student/report/seen' && (init as RequestInit | undefined)?.method === 'POST')
      ).toBe(true)
    );
    expect(screen.queryByLabelText(/new note/)).toBeNull();
  });

  it('shows the badge on the report tab while another tab is open', async () => {
    vi.stubGlobal('fetch', mockFetch());
    render(<DashboardTabs tabParam="messages" initialRequests={[]} initialUnread={0} initialUnreadNotes={2} panels={PANELS} />);
    expect(screen.getAllByLabelText('2 new notes from your teacher').length).toBeGreaterThan(0);
  });
});
