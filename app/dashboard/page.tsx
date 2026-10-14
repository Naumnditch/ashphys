import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/client';
import { getUserTier, TIER_PLUS } from '@/lib/subscriptions/getUserTier';
import { resolveCurriculum } from '@/lib/curricula/queries';
import { unreadCount } from '@/lib/messaging/store';
import { LogoutButton } from '@/components/LogoutButton';
import { StudentInbox } from '@/components/messages/StudentInbox';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { VideosTab } from '@/components/dashboard/VideosTab';
import { CurriculumTab } from '@/components/dashboard/CurriculumTab';
import { ClassesTab } from '@/components/dashboard/ClassesTab';
import { TabSwitchButton } from '@/components/dashboard/TabSwitchButton';
import { TutoringPanel } from '@/components/tutoring/TutoringPanel';
import { getMyVideoRequests } from '@/lib/videoRequests/student';
import type { StudentVideoRequest } from '@/lib/videoRequests/types';
import { getVideoRequestFormOptions } from '@/lib/videoRequests/formOptions';
import { getStudentDashboard, type StudentProgress, type StudentStreaks } from '@/lib/dashboard/data';
import { formatPercent, isNewStudent } from '@/lib/dashboard/format';

export const dynamic = 'force-dynamic';

function Chip({ children, title }: { children: React.ReactNode; title?: string }) {
  return (
    <span title={title} className="shrink-0 inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 tabular-nums">
      {children}
    </span>
  );
}

/**
 * Student dashboard: a two-column, tabbed page (components/dashboard/
 * DashboardTabs). Each tab mounts the existing component for its feature:
 * StudentInbox, the curriculum lessons (LessonCard), JoinClassForm,
 * VideoRequestForm + the requests grid, and the tutoring booking flow.
 * ?tab= picks the tab; see lib/dashboard/tabs.ts.
 */
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { tab?: string; lesson?: string; request?: string };
}) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  const [tier, requests, dashboard, unread, emailPref, curriculum] = await Promise.all([
    getUserTier(user.id),
    getMyVideoRequests(user).catch((err): StudentVideoRequest[] => {
      console.error('dashboard: video requests failed', err);
      return [];
    }),
    getStudentDashboard(user).catch((err): { progress: StudentProgress; streaks: StudentStreaks } | null => {
      console.error('dashboard: progress failed', err);
      return null;
    }),
    unreadCount(user).catch(() => 0),
    query(`SELECT email_notifications FROM users WHERE id = $1`, [user.id]).then((r) => Boolean(r.rows[0]?.email_notifications ?? true)),
    resolveCurriculum(null, user.id),
  ]);
  // Same gate as before (and as POST /api/video-requests): Plus and Pro.
  const canRequest = tier >= TIER_PLUS;
  const formOptions = canRequest ? await getVideoRequestFormOptions() : { chapters: [], topics: [] };

  const isNew = dashboard ? isNewStudent(dashboard.progress, dashboard.streaks) : false;
  const header = (
    <div className="shrink-0 flex flex-wrap items-start justify-between gap-x-4 gap-y-1 mb-3 sm:mb-4">
      <div className="min-w-0 w-full sm:w-auto order-2 sm:order-none">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          {user.firstName ? `Welcome back, ${user.firstName}` : 'Your dashboard'}
        </h1>
        {dashboard && !isNew && (
          // One scrollable row on phones so the tab panel keeps the height.
          <div className="mt-1.5 flex flex-nowrap sm:flex-wrap gap-1.5 overflow-x-auto [scrollbar-width:none]" aria-label="Your progress">
            <Chip title="Consecutive study days (Istanbul time)">🔥 {dashboard.streaks.current_streak}-day streak</Chip>
            <Chip title={`Longest streak: ${dashboard.streaks.longest_streak} days`}>🏆 best {dashboard.streaks.longest_streak}</Chip>
            <Chip>✏️ {dashboard.progress.totals.attempted} answered</Chip>
            <Chip>🎯 {formatPercent(dashboard.progress.totals.accuracy)} correct</Chip>
            <Chip>📚 {dashboard.progress.totals.lessons_visited} lessons</Chip>
          </div>
        )}
        {isNew && (
          <TabSwitchButton tab="curriculum" className="mt-1 text-sm font-semibold text-blue-700 hover:underline min-h-[44px]">
            New here? Start with a lesson →
          </TabSwitchButton>
        )}
      </div>
      <div className="flex items-center gap-4 order-1 sm:order-none ml-auto sm:ml-0">
        <Link href="/account/devices" className="text-sm text-gray-600 hover:underline">
          My Devices
        </Link>
        <LogoutButton />
      </div>
    </div>
  );

  return (
    <DashboardTabs
      tabParam={searchParams.tab ?? null}
      initialRequests={requests}
      initialUnread={unread}
      header={header}
      panels={{
        messages:
          user.role === 'admin' ? (
            <p className="text-sm text-gray-600">
              Admins answer every conversation from the{' '}
              <Link href="/admin/messages" className="text-blue-600 underline">
                admin mailbox
              </Link>
              .
            </p>
          ) : (
            <StudentInbox firstName={user.firstName} initialEmailNotifications={emailPref} />
          ),
        curriculum: <CurriculumTab initialCurriculum={curriculum.curriculumId} tier={tier} progress={dashboard?.progress ?? null} />,
        classes: <ClassesTab />,
        videos: (
          <VideosTab
            canRequest={canRequest}
            chapters={formOptions.chapters}
            topics={formOptions.topics}
            initialTopicId={searchParams.lesson}
            justSubmitted={searchParams.request === 'sent'}
          />
        ),
        tutoring: <TutoringPanel userId={user.id} embedded />,
      }}
    />
  );
}
