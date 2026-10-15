'use client';

import { JoinClassForm } from '@/components/classes/JoinClassForm';
import { useDashboard } from '@/components/dashboard/DashboardTabs';

/** Join a Class tab: the existing join form; "Done" moves on to the curriculum. */
export function ClassesTab() {
  const { selectTab } = useDashboard();
  return <JoinClassForm onDone={() => selectTab('curriculum')} />;
}
