/**
 * The student progress report: one page a student, parent or teacher can read
 * in a minute. Who it is and how they're doing (score, level, trend), the
 * teacher's note, what to do next, strengths vs focus areas, the charts
 * behind them, and the questions to revise.
 *
 * Server component (pure render of a StudentReport). The same report renders
 * in the student dashboard ("My Report" tab), for admins at
 * /admin/students/[id]/report and teachers at /teacher/analytics/[id]/report,
 * and as a PDF (lib/reports/pdf.ts).
 */

import Link from 'next/link';
import type { ReactNode } from 'react';
import type { ReportLesson, StudentReport } from '@/lib/reports/types';
import { TeacherNoteCard, fmtDate } from '@/components/report/TeacherNoteCard';
import { formatMinutes, pct } from '@/lib/reports/insights';
import {
  AccuracyRow,
  BAND_COLOR,
  DifficultyLadder,
  MistakeDonut,
  RIGHT,
  ScoreRing,
  StudyCalendar,
  WRONG,
  WeeklyChart,
  accuracyTone,
} from '@/components/report/ReportCharts';

function Card({ title, icon, children, aside, className = '' }: { title: string; icon?: string; children: ReactNode; aside?: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-gray-200 bg-white p-4 sm:p-5 break-inside-avoid ${className}`}>
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="flex items-center gap-1.5 text-[13px] font-semibold uppercase tracking-wide text-gray-500">
          {icon && <span aria-hidden>{icon}</span>}
          {title}
        </h3>
        {aside}
      </div>
      {children}
    </section>
  );
}

function Kpi({ label, value, sub, accent }: { label: string; value: ReactNode; sub?: ReactNode; accent?: string }) {
  return (
    <div className="rounded-lg bg-gray-50 px-3 py-2.5 min-w-0">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 truncate">{label}</div>
      <div className="text-xl font-bold tabular-nums text-gray-900 truncate" style={accent ? { color: accent } : undefined}>
        {value}
      </div>
      {sub && <div className="text-xs text-gray-500 leading-snug">{sub}</div>}
    </div>
  );
}

const TREND: Record<StudentReport['trend']['direction'], { icon: string; text: string; cls: string }> = {
  up: { icon: '↗', text: 'Improving', cls: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  down: { icon: '↘', text: 'Dipping', cls: 'bg-rose-50 text-rose-700 ring-rose-200' },
  flat: { icon: '→', text: 'Steady', cls: 'bg-blue-50 text-blue-700 ring-blue-200' },
  new: { icon: '•', text: 'Not enough to compare yet', cls: 'bg-gray-50 text-gray-600 ring-gray-200' },
  quiet: { icon: '…', text: 'Quiet for two weeks', cls: 'bg-amber-50 text-amber-800 ring-amber-200' },
};

function LessonLinks({ l, compact = false }: { l: ReportLesson; compact?: boolean }) {
  const cls = 'inline-flex items-center rounded-md border border-gray-200 bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:border-blue-300 hover:text-blue-700';
  return (
    <div className="mt-1.5 flex flex-wrap gap-1.5">
      <Link href={l.practiceHref} className={cls}>
        ✏️ Practise
      </Link>
      {l.sheetHref && (
        <Link href={l.sheetHref} className={cls}>
          📄 Revision sheet
        </Link>
      )}
      {!compact && (
        <Link href={l.lessonHref} className={cls}>
          📖 Lesson
        </Link>
      )}
      {!compact && (
        <Link href={l.videoHref} className={cls}>
          🎥 Ask for a video
        </Link>
      )}
    </div>
  );
}

export function StudentReportView({
  report,
  pdfHref,
  noteSlot,
  showEmptyNote = false,
  viewer = 'student',
}: {
  report: StudentReport;
  pdfHref: string;
  /** Staff: the note editor. Students: nothing (the note card renders itself). */
  noteSlot?: ReactNode;
  showEmptyNote?: boolean;
  viewer?: 'student' | 'staff';
}) {
  const r = report;
  const k = r.kpis;
  const bandColor = BAND_COLOR[r.score.band.id];
  const trend = TREND[r.trend.direction];
  const latest = r.notes[0];
  const you = viewer === 'student' ? 'You' : r.student.firstName;
  const noData = k.answered === 0;
  const meta = [r.student.className, r.student.schoolName, r.student.curricula.join(' · ') || null].filter(Boolean);

  return (
    <div className="space-y-4 text-gray-900">
      {/* Header: the name first, in bold */}
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-blue-600">Progress report</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-gray-900 break-words">
            <strong>{r.student.name}</strong>
          </h2>
          <p className="mt-0.5 text-sm text-gray-500">
            {meta.length > 0 && <>{meta.join(' · ')} · </>}
            Updated {fmtDate(r.generatedAt)}
          </p>
        </div>
        <a
          href={pdfHref}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700"
          download
        >
          <svg viewBox="0 0 20 20" width="16" height="16" fill="currentColor" aria-hidden>
            <path d="M10 2a1 1 0 0 1 1 1v8.59l2.3-2.3a1 1 0 1 1 1.4 1.42l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.42L9 11.6V3a1 1 0 0 1 1-1ZM4 15a1 1 0 0 1 1 1v1h10v-1a1 1 0 1 1 2 0v2a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1Z" />
          </svg>
          Download PDF
        </a>
      </header>

      {/* Snapshot */}
      <section className="grid gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5 md:grid-cols-[auto_1fr] break-inside-avoid">
        <div className="flex items-center gap-4">
          <ScoreRing value={r.score.value} band={r.score.band.id} />
          <div className="min-w-0 max-w-[15rem]">
            <div className="text-xl font-bold" style={{ color: bandColor }}>
              {r.score.band.label}
            </div>
            <p className="text-sm text-gray-600 leading-snug">{r.score.band.summary}</p>
            {!noData && (
              <span className={`mt-2 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${trend.cls}`}>
                <span aria-hidden>{trend.icon}</span> {trend.text}
                {r.trend.direction !== 'new' && r.trend.direction !== 'quiet' && r.trend.recent !== null && (
                  <span className="tabular-nums"> · {pct(r.trend.recent)} last 2 wks</span>
                )}
              </span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 2xl:grid-cols-4 gap-2 content-center">
          <Kpi label="Questions done" value={k.answered} sub={`${k.right} right · ${k.wrong} still wrong`} />
          <Kpi label="Accuracy" value={pct(k.accuracy)} sub={`${pct(k.firstTryAccuracy)} right first time`} accent={accuracyTone(k.accuracy).hex} />
          <Kpi label="Lessons" value={`${k.mastered}/${k.practised}`} sub="mastered / practised" />
          <Kpi
            label="Last 30 days"
            value={`${k.activeDays30} day${k.activeDays30 === 1 ? '' : 's'}`}
            sub={`${formatMinutes(k.minutes30)} on AshPhys${k.currentStreak > 1 ? ` · 🔥 ${k.currentStreak}-day streak` : ''}`}
          />
        </div>
        {r.badges.length > 0 && (
          <ul className="md:col-span-2 flex flex-wrap gap-1.5 border-t border-gray-100 pt-3" aria-label="Achievements">
            {r.badges.map((b) => (
              <li key={b.id} title={b.detail} className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                <span aria-hidden>{b.icon}</span> {b.label}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Teacher's note */}
      {noteSlot}
      {!noteSlot && latest && <TeacherNoteCard note={latest} isNew={viewer === 'student' && !latest.readAt} older={r.notes.slice(1)} />}
      {!noteSlot && !latest && showEmptyNote && (
        <p className="rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-500">
          ✍️ Your teacher’s notes will appear here.
        </p>
      )}

      {/* Action plan */}
      <Card title="What to do next" icon="🧭">
        <ol className="grid gap-2 sm:grid-cols-2">
          {r.plan.map((s, i) => (
            <li
              key={s.id}
              className={`flex gap-3 rounded-lg p-3 ${s.source === 'teacher' ? 'bg-amber-50 ring-1 ring-amber-200 sm:col-span-2' : 'bg-gray-50'}`}
            >
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${s.source === 'teacher' ? 'bg-amber-500 text-white' : 'bg-white text-gray-700 ring-1 ring-gray-200'}`}
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 leading-snug">
                  <span aria-hidden>{s.icon}</span> {s.title}
                </div>
                <p className="text-sm text-gray-600 leading-snug">{s.detail}</p>
                {s.href && (
                  <Link href={s.href} className="mt-1 inline-block text-sm font-semibold text-blue-700 hover:underline">
                    {s.hrefLabel ?? 'Go'} →
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
        {r.teacherFocus.length > 1 && (
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
            {r.teacherFocus.map((t) => (
              <Link key={t.topicId} href={t.href} className="rounded-full bg-amber-100 px-2.5 py-1 font-medium text-amber-900 hover:bg-amber-200">
                📌 {t.name}
              </Link>
            ))}
          </div>
        )}
      </Card>

      {!noData && (
        <>
          {/* Strengths vs focus */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card title="Strong points" icon="💪">
              {r.strengths.length ? (
                <ul className="space-y-3">
                  {r.strengths.map((l) => (
                    <li key={l.topicId}>
                      <AccuracyRow label={`${l.mastered ? '★ ' : ''}${l.name}`} correct={l.correct} attempted={l.attempted} />
                      <p className="mt-1 text-xs text-gray-500">{l.chapter}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">
                  Strengths show once {you === 'You' ? 'you have' : `${you} has`} answered at least 5 questions in two different lessons.
                </p>
              )}
            </Card>
            <Card title="Focus areas — revise these" icon="🎯">
              {r.focus.length ? (
                <ul className="space-y-3">
                  {r.focus.map((l) => (
                    <li key={l.topicId}>
                      <AccuracyRow label={l.name} correct={l.correct} attempted={l.attempted} />
                      <p className="mt-1 text-xs text-gray-500">
                        {l.chapter} · {l.questionsRight}/{l.questions} questions now right
                      </p>
                      <LessonLinks l={l} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No weak lesson stands out yet{k.answered >= 20 ? ' — nice work.' : '.'}</p>
              )}
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card
              title="Weekly progress"
              icon="📈"
              aside={
                <span className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: RIGHT }} /> Right
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: WRONG }} /> Wrong
                  </span>
                </span>
              }
            >
              <WeeklyChart weeks={r.weekly} />
              <p className="mt-1 text-xs text-gray-500">Answers submitted each week (last 12 weeks), retries included.</p>
            </Card>
            <Card title="Study calendar" icon="📅" aside={<span className="text-xs text-gray-500">{k.activeDays30} active days in 30</span>}>
              <StudyCalendar days={r.calendar} />
              <p className="mt-1 text-xs text-gray-500">
                Longest streak {k.longestStreak} day{k.longestStreak === 1 ? '' : 's'} · {formatMinutes(k.totalMinutes)} on AshPhys in total.
              </p>
            </Card>
            <Card title="Accuracy by lesson" icon="📚">
              <div className="space-y-2.5">
                {[...r.lessons]
                  .sort((a, b) => b.attempted - a.attempted)
                  .slice(0, 8)
                  .map((l) => (
                    <AccuracyRow key={l.topicId} label={`${l.mastered ? '★ ' : ''}${l.name}`} correct={l.correct} attempted={l.attempted} />
                  ))}
              </div>
              {r.chapters.length > 1 && (
                <details className="mt-3 text-xs text-gray-500">
                  <summary className="cursor-pointer select-none">By chapter</summary>
                  <div className="mt-2 space-y-2.5">
                    {r.chapters.map((c) => (
                      <AccuracyRow key={c.key} label={c.label} correct={c.correct} attempted={c.attempted} />
                    ))}
                  </div>
                </details>
              )}
              <p className="mt-2 text-xs text-gray-400">★ = mastered (5 right in a row)</p>
            </Card>
            <Card title="How hard, and why wrong" icon="🧗">
              <DifficultyLadder rows={r.difficulty} />
              <div className="mt-4 border-t border-gray-100 pt-3">
                <MistakeDonut m={r.mistakes} />
              </div>
            </Card>
          </div>

          {/* Questions to revise */}
          {r.revise.length > 0 && (
            <Card title="Questions to go back to" icon="🔁" aside={<span className="text-xs text-gray-500">most missed first</span>}>
              <ul className="divide-y divide-gray-100">
                {r.revise.slice(0, 5).map((q) => (
                  <li key={q.problemId} className="flex items-start gap-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <span
                        className={`mr-2 inline-block rounded-full px-2 py-0.5 align-[1px] text-[10px] font-bold uppercase tracking-wide ${q.stillWrong ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}
                      >
                        {q.stillWrong ? 'Still wrong' : 'Fixed'}
                      </span>
                      <span className="text-sm text-gray-800">{q.question}</span>
                      <p className="text-xs text-gray-500">
                        {q.lesson}
                        {q.number ? ` · Q${q.number}` : ''} · {q.wrongTries} wrong {q.wrongTries === 1 ? 'try' : 'tries'}
                      </p>
                    </div>
                    {q.href && q.stillWrong && (
                      <Link href={q.href} className="shrink-0 text-sm font-semibold text-blue-700 hover:underline">
                        Retry
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {/* Study habits */}
          <Card title="Study habits" icon="🧠">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm sm:grid-cols-4">
              {[
                ['Time per answer', r.habits.medianTimeMs === null ? '—' : r.habits.medianTimeMs < 60000 ? `${Math.round(r.habits.medianTimeMs / 1000)} s` : `${(r.habits.medianTimeMs / 60000).toFixed(1)} min`, 'typical (median)'],
                ['Hints used', `${r.habits.hintsUsed}`, r.habits.hintRate === null ? '' : `${pct(r.habits.hintRate)} of answers`],
                ['Skipped', `${r.habits.skipped}`, 'not answered since'],
                ['Not reached yet', `${r.habits.notReached}`, 'in lessons started'],
                ['Practice sessions', `${r.habits.practiceSessions}`, ''],
                ['Lessons opened', `${r.habits.lessonsOpened}`, ''],
                ['Simulations', `${r.habits.simulations}`, 'started'],
                ['Solutions viewed', `${r.habits.solutions}`, ''],
              ].map(([label, value, sub]) => (
                <div key={label} className="min-w-0">
                  <dt className="text-xs text-gray-400">{label}</dt>
                  <dd className="font-semibold tabular-nums text-gray-900">
                    {value} {sub && <span className="text-xs font-normal text-gray-500">{sub}</span>}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        </>
      )}

      <details className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-xs text-gray-500">
        <summary className="cursor-pointer select-none font-medium text-gray-600">How is this report worked out?</summary>
        <div className="mt-2 space-y-1.5 leading-relaxed">
          <p>
            <strong>Progress score</strong> (0–100):{' '}
            {r.score.parts.map((p, i) => (
              <span key={p.id}>
                {i > 0 && ' + '}
                {p.label} {Math.round(p.weight * 100)}% ({pct(p.value)})
              </span>
            ))}
            . Accuracy uses the latest answer to each question; “right first time” the first. Consistency is full at 12 active days in 30; lesson progress
            averages lessons mastered and questions done in the lessons started.
          </p>
          <p>
            <strong>Levels:</strong> 85+ Excellent · 70+ On track · 50+ Developing · below 50 Needs support. Strengths and focus areas need at least 5
            answers in a lesson. Days and times are in Istanbul time; time on AshPhys counts gaps of up to 15 minutes between actions.
          </p>
        </div>
      </details>
    </div>
  );
}
