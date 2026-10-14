import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { chapterLabel } from '@/lib/curricula';
import { LogoutButton } from '@/components/LogoutButton';
import { VideoRequestList } from '@/components/video-requests/VideoRequestList';
import { getMyVideoRequests, type StudentVideoRequest } from '@/lib/videoRequests/student';
import {
  formatPercent,
  getStudentDashboard,
  isNewStudent,
  type ChapterStat,
  type RankedChapter,
  type StudentProgress,
  type StudentStreaks,
} from '@/lib/dashboard/data';

export const dynamic = 'force-dynamic';

function chapterName(c: { course_code: string | null; chapter_number: number | null; title: string | null }) {
  if (c.chapter_number === null || c.title === null) return 'Other lessons';
  const prefix = c.course_code && c.course_code !== '0625' ? `${c.course_code} · ` : '';
  return `${prefix}${chapterLabel(c.course_code, c.chapter_number)}: ${c.title}`;
}

/** Single-series accuracy bar: one hue, value printed beside it (never colour alone). */
function AccuracyBar({ accuracy, label }: { accuracy: number; label: string }) {
  const pct = Math.round(accuracy * 100);
  return (
    <div className="flex items-center gap-2 min-w-[8rem]" title={`${label}: ${pct}% correct`}>
      <div className="flex-1 h-2 rounded bg-gray-100 overflow-hidden" role="img" aria-label={`${pct}% correct`}>
        <div className="h-full rounded bg-blue-600" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-sm tabular-nums text-gray-700 w-10 text-right">{pct}%</span>
    </div>
  );
}

function StatTile({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1 tabular-nums">{value}</p>
      {hint && <p className="text-xs text-gray-500 mt-1">{hint}</p>}
    </div>
  );
}

function StreakTiles({ streaks }: { streaks: StudentStreaks }) {
  const alive = streaks.current_streak > 0;
  const hint = !alive
    ? 'Answer a question or open a lesson today to start one.'
    : streaks.studied_today
      ? 'You studied today. See you tomorrow!'
      : 'Study today to keep it going.';
  return (
    <>
      <StatTile
        label="Current streak"
        value={`${alive ? '🔥 ' : ''}${streaks.current_streak} day${streaks.current_streak === 1 ? '' : 's'}`}
        hint={hint}
      />
      <StatTile label="Longest streak" value={`${streaks.longest_streak} day${streaks.longest_streak === 1 ? '' : 's'}`} hint="Days counted in Istanbul time" />
    </>
  );
}

function RankList({ title, items, tone, children }: { title: string; items: RankedChapter[]; tone: 'good' | 'work'; children?: (c: RankedChapter) => React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <h3 className="font-semibold text-gray-900 mb-3">
        {tone === 'good' ? '💪 ' : '🎯 '}
        {title}
      </h3>
      <ol className="space-y-3">
        {items.map((c, i) => (
          <li key={c.chapter_id}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm text-gray-900">
                <span className="text-gray-400 mr-1.5">{i + 1}.</span>
                {chapterName(c)}
              </span>
              <span className="text-sm font-semibold tabular-nums text-gray-700">{formatPercent(c.accuracy)}</span>
            </div>
            <p className="text-xs text-gray-500">{c.attempted} questions answered</p>
            {children?.(c)}
          </li>
        ))}
      </ol>
    </div>
  );
}

function StrengthsAndWeaknesses({ progress }: { progress: StudentProgress }) {
  if (progress.strengths.length === 0 && progress.weaknesses.length === 0) {
    return (
      <p className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
        Answer at least {progress.min_attempts_to_rank} questions in two different chapters and we&rsquo;ll show which
        ones you&rsquo;re strongest in and which need work. Small samples can mislead, so a chapter only counts once it
        has {progress.min_attempts_to_rank} answers.
      </p>
    );
  }
  const weakById = new Map(progress.weaknesses.map((w) => [w.chapter_id, w]));
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {progress.strengths.length > 0 && <RankList title="Strengths" items={progress.strengths} tone="good" />}
      {progress.weaknesses.length > 0 && (
        <RankList title="Needs work" items={progress.weaknesses} tone="work">
          {(c) => {
            const lesson = weakById.get(c.chapter_id)?.weakest_lesson;
            if (!lesson) return null;
            return (
              <div className="mt-1.5 flex flex-wrap gap-2 text-xs">
                <Link href={`/lessons/${lesson.lesson_id}`} className="font-semibold text-blue-600 hover:underline">
                  Revise {lesson.lesson_name} ({formatPercent(lesson.accuracy)}) →
                </Link>
                <Link href={`/video-requests?lesson=${lesson.lesson_id}`} className="font-semibold text-rose-700 hover:underline">
                  🎥 Request a video
                </Link>
              </div>
            );
          }}
        </RankList>
      )}
    </div>
  );
}

function ChapterBreakdown({ chapters }: { chapters: ChapterStat[] }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
      {chapters.map((c) => (
        <details key={c.chapter_id ?? 'other'} className="group px-5 py-3">
          <summary className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 cursor-pointer list-none">
            <span className="flex-1 text-sm font-medium text-gray-900">
              <span className="inline-block w-4 text-gray-400 group-open:rotate-90 transition-transform">›</span>
              {chapterName(c)}
            </span>
            <span className="text-xs text-gray-500 sm:w-28 tabular-nums">
              {c.correct}/{c.attempted} correct
            </span>
            <span className="sm:w-48">
              <AccuracyBar accuracy={c.accuracy} label={chapterName(c)} />
            </span>
          </summary>
          <table className="w-full mt-3 mb-1 text-sm">
            <caption className="sr-only">Accuracy per lesson in {chapterName(c)}</caption>
            <thead>
              <tr className="text-left text-xs text-gray-500">
                <th scope="col" className="font-medium pb-1">Lesson</th>
                <th scope="col" className="font-medium pb-1 w-24">Answered</th>
                <th scope="col" className="font-medium pb-1 w-48">Accuracy</th>
              </tr>
            </thead>
            <tbody>
              {c.lessons.map((l) => (
                <tr key={l.lesson_id ?? 'none'} className="border-t border-gray-50">
                  <td className="py-1.5 pr-3">
                    {l.lesson_id ? (
                      <Link href={`/lessons/${l.lesson_id}`} className="text-blue-600 hover:underline">
                        {l.lesson_name}
                      </Link>
                    ) : (
                      <span className="text-gray-500">Removed lesson</span>
                    )}
                  </td>
                  <td className="py-1.5 tabular-nums text-gray-700">{l.attempted}</td>
                  <td className="py-1.5">
                    <AccuracyBar accuracy={l.accuracy} label={l.lesson_name ?? 'Lesson'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </details>
      ))}
    </div>
  );
}

function SectionHeading({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">
      {children}
    </h2>
  );
}

const QUICK_LINKS = [
  { href: '/curriculum', title: '📖 Browse the Curriculum', text: 'Pick a lesson, run its simulation and practise.' },
  { href: '/dashboard/messages', title: '✉️ Messages', text: 'Read messages from the AshPhys team and ask us anything.' },
  { href: '/dashboard/join-class', title: '🏫 Join a Class', text: "Have a join code from your teacher? Enter it here." },
  { href: '/tutoring', title: '🧑‍🏫 1-on-1 Tutoring', text: 'Book a private session — discounted for Pro members.' },
];

export default async function DashboardPage({ searchParams }: { searchParams: { request?: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');

  let dashboard: { progress: StudentProgress; streaks: StudentStreaks } | null = null;
  let requests: StudentVideoRequest[] = [];
  try {
    [dashboard, requests] = await Promise.all([getStudentDashboard(user), getMyVideoRequests(user)]);
  } catch (err) {
    console.error('dashboard: failed to load', err);
  }

  const isNew = dashboard ? isNewStudent(dashboard.progress, dashboard.streaks) : false;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {user.firstName ? `Welcome back, ${user.firstName}` : 'Your dashboard'}
        </h1>
        <div className="flex items-center gap-4">
          <Link href="/account/devices" className="text-sm text-gray-600 hover:underline">
            My Devices
          </Link>
          <LogoutButton />
        </div>
      </div>

      {searchParams.request === 'sent' && (
        <div role="status" className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm">
          ✅ Your video request is in. We&rsquo;ll record the walkthrough and it will appear under &ldquo;My video
          requests&rdquo; below — no need to leave the site to watch it.
        </div>
      )}

      {!dashboard ? (
        <p className="mb-8 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          We couldn&rsquo;t load your progress just now. Please refresh the page in a moment.
        </p>
      ) : isNew ? (
        <section className="mb-10 bg-blue-50 border border-blue-200 rounded-2xl p-6 sm:p-8 text-center">
          <div className="text-4xl mb-3" aria-hidden="true">🚀</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Start with a lesson</h2>
          <p className="text-gray-700 max-w-md mx-auto mb-5">
            Open any lesson, try its simulation and answer a few practice questions. Your accuracy, strengths and study
            streak will build up here as you go.
          </p>
          <Link href="/curriculum" className="inline-block bg-gray-900 hover:bg-black text-on-ink px-6 py-3 rounded-lg font-semibold">
            Choose a lesson
          </Link>
        </section>
      ) : (
        <>
          <section aria-labelledby="overview" className="mb-10">
            <SectionHeading id="overview">Progress overview</SectionHeading>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
              <StatTile label="Questions attempted" value={String(dashboard.progress.totals.attempted)} />
              <StatTile
                label="Overall accuracy"
                value={formatPercent(dashboard.progress.totals.accuracy)}
                hint={dashboard.progress.totals.attempted ? `${dashboard.progress.totals.correct} correct` : 'No answers yet'}
              />
              <StatTile label="Lessons visited" value={String(dashboard.progress.totals.lessons_visited)} />
              <StatTile label="Study days" value={String(dashboard.progress.totals.study_days)} />
              <StreakTiles streaks={dashboard.streaks} />
            </div>
          </section>

          <section aria-labelledby="strengths" className="mb-10">
            <SectionHeading id="strengths">Strengths and weaknesses</SectionHeading>
            <StrengthsAndWeaknesses progress={dashboard.progress} />
          </section>

          <section aria-labelledby="breakdown" className="mb-10">
            <SectionHeading id="breakdown">Chapter breakdown</SectionHeading>
            {dashboard.progress.chapters.length === 0 ? (
              <p className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                Answer some practice questions and your accuracy per chapter and lesson will show up here.{' '}
                <Link href="/curriculum" className="text-blue-600 underline">Find a lesson</Link>
              </p>
            ) : (
              <ChapterBreakdown chapters={dashboard.progress.chapters} />
            )}
          </section>
        </>
      )}

      <section aria-labelledby="my-requests" className="mb-10">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <SectionHeading id="my-requests">My video requests</SectionHeading>
          <Link href="/video-requests" className="text-sm font-semibold text-blue-600 hover:underline mb-3">
            + New request
          </Link>
        </div>
        {requests.length === 0 ? (
          <p className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
            Stuck on a question? Tell us, and we&rsquo;ll record the walkthrough.{' '}
            <Link href="/video-requests" className="text-blue-600 underline">Request a video</Link>
          </p>
        ) : (
          <VideoRequestList requests={requests} />
        )}
      </section>

      <section aria-label="Shortcuts" className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {QUICK_LINKS.map((l) => (
          <Link key={l.href} href={l.href} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-400">
            <p className="font-semibold text-gray-900">{l.title}</p>
            <p className="text-sm text-gray-600">{l.text}</p>
          </Link>
        ))}
      </section>
    </div>
  );
}
