'use client';

import type { ReactNode } from 'react';
import { useDashboard } from '@/components/dashboard/DashboardTabs';
import type { DashboardTab } from '@/lib/dashboard/tabs';

/** A button that switches the dashboard to another tab (no page navigation). */
export function TabSwitchButton({ tab, className, children }: { tab: DashboardTab; className?: string; children: ReactNode }) {
  const { selectTab } = useDashboard();
  return (
    <button type="button" onClick={() => selectTab(tab)} className={className}>
      {children}
    </button>
  );
}
