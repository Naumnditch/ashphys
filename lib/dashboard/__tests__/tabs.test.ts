import { describe, expect, it } from 'vitest';
import {
  DASHBOARD_TABS,
  DASHBOARD_TAB_INFO,
  dashboardTabHref,
  defaultDashboardTab,
  isDashboardTab,
  resolveDashboardTab,
} from '@/lib/dashboard/tabs';

describe('dashboard tab routing', () => {
  it('has the five tabs in the specified order', () => {
    expect(DASHBOARD_TABS).toEqual(['messages', 'curriculum', 'classes', 'videos', 'tutoring']);
    expect(DASHBOARD_TAB_INFO.map((t) => t.title)).toEqual([
      'Messages',
      'Browse the Curriculum',
      'Join a Class',
      'Video Solve Requests',
      '1-on-1 Tutoring',
    ]);
  });

  it.each(DASHBOARD_TABS)('a valid ?tab=%s wins over storage and the default', (tab) => {
    expect(resolveDashboardTab(tab, 'tutoring', 3)).toBe(tab);
    expect(resolveDashboardTab(tab, null, 0)).toBe(tab);
  });

  it('an invalid ?tab= falls back to the default, not to storage', () => {
    expect(resolveDashboardTab('settings', 'tutoring', 0)).toBe('messages');
    expect(resolveDashboardTab('VIDEOS', 'curriculum', 2)).toBe('videos');
    expect(resolveDashboardTab('<script>', null, 0)).toBe('messages');
  });

  it('uses localStorage when there is no ?tab=', () => {
    expect(resolveDashboardTab(null, 'classes', 5)).toBe('classes');
    expect(resolveDashboardTab(undefined, 'tutoring', 0)).toBe('tutoring');
    expect(resolveDashboardTab('', 'curriculum', 0)).toBe('curriculum');
  });

  it('ignores a corrupt stored value', () => {
    expect(resolveDashboardTab(null, 'nonsense', 0)).toBe('messages');
    expect(resolveDashboardTab(null, 'nonsense', 1)).toBe('videos');
  });

  it('defaults to videos only when an unopened ready video is waiting', () => {
    expect(defaultDashboardTab(0)).toBe('messages');
    expect(defaultDashboardTab(1)).toBe('videos');
    expect(resolveDashboardTab(null, null, 0)).toBe('messages');
    expect(resolveDashboardTab(null, null, 2)).toBe('videos');
  });

  it('validates and builds tab URLs', () => {
    expect(isDashboardTab('videos')).toBe(true);
    expect(isDashboardTab('Videos')).toBe(false);
    expect(isDashboardTab(undefined)).toBe(false);
    expect(dashboardTabHref('videos', { lesson: 'abc' })).toBe('/dashboard?tab=videos&lesson=abc');
  });
});
