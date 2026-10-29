'use client';

/**
 * A question's worked solutions when students have shared approved ones:
 * "Teacher solution" and "Student solution by <display name>" side by side
 * on wide screens (≥1280px), as tabs below that. With several student
 * solutions the right-hand pane steps through them (verified ones first, as
 * the server orders them). Read-only; everything here was approved by an admin.
 */

import { useState } from 'react';
import type { HwSnapshot } from '@/lib/handwriting/types';
import type { StudentSolutionDTO } from '@/lib/sharedSolutions/types';
import { VerifiedBadge } from '@/components/workspace/SharedStatus';
import { HandwritingViewer } from './HandwritingViewer';

export function studentSolutionTitle(s: Pick<StudentSolutionDTO, 'displayName'>) {
  return `Student solution by ${s.displayName}`;
}

export default function SolutionsBoard({
  teacherPages,
  students,
  label,
}: {
  teacherPages: HwSnapshot[];
  students: StudentSolutionDTO[];
  label: string;
}) {
  // Narrow screens show one pane at a time; wide screens show both.
  const [active, setActive] = useState<'teacher' | 'student'>(teacherPages.length > 0 ? 'teacher' : 'student');
  const [index, setIndex] = useState(0);
  const student = students[Math.min(index, students.length - 1)];

  const tab = (selected: boolean) =>
    `shrink-0 rounded-md px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${selected ? 'bg-gray-900 text-on-ink' : 'text-gray-700 hover:bg-gray-100'}`;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div role="tablist" aria-label="Worked solutions" className="flex shrink-0 gap-1 overflow-x-auto border-b border-gray-200 bg-white px-2 py-1 xl:hidden">
        <button type="button" role="tab" aria-selected={active === 'teacher'} onClick={() => setActive('teacher')} className={tab(active === 'teacher')}>
          Teacher solution
        </button>
        {students.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={active === 'student' && i === index}
            onClick={() => {
              setActive('student');
              setIndex(i);
            }}
            className={tab(active === 'student' && i === index)}
          >
            {studentSolutionTitle(s)}
            {s.verified ? ' ✓' : ''}
          </button>
        ))}
      </div>

      <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] xl:grid-cols-2 xl:divide-x xl:divide-gray-200">
        <section aria-label="Teacher solution" className={`${active === 'teacher' ? 'flex' : 'hidden'} min-h-0 flex-col xl:flex`}>
          <PaneHeader title="Teacher solution" />
          <div className="relative min-h-0 flex-1">
            {teacherPages.length > 0 ? (
              <HandwritingViewer pages={teacherPages} label={`Teacher solution to ${label}`} />
            ) : (
              <p className="flex h-full items-center justify-center p-6 text-center text-sm text-gray-500">
                Your teacher hasn&rsquo;t written out a solution to this question yet.
              </p>
            )}
          </div>
        </section>

        <section aria-label={studentSolutionTitle(student)} className={`${active === 'student' ? 'flex' : 'hidden'} min-h-0 flex-col xl:flex`}>
          <PaneHeader title={studentSolutionTitle(student)} badge={student.verified ? <VerifiedBadge long /> : null}>
            {students.length > 1 && (
              <span className="ml-auto flex shrink-0 items-center gap-1 text-xs text-gray-500">
                <button
                  type="button"
                  aria-label="Previous student solution"
                  onClick={() => setIndex((i) => (i - 1 + students.length) % students.length)}
                  className="rounded px-1.5 hover:bg-gray-100"
                >
                  ‹
                </button>
                <span className="tabular-nums">
                  {index + 1} / {students.length}
                </span>
                <button
                  type="button"
                  aria-label="Next student solution"
                  onClick={() => setIndex((i) => (i + 1) % students.length)}
                  className="rounded px-1.5 hover:bg-gray-100"
                >
                  ›
                </button>
              </span>
            )}
          </PaneHeader>
          <StudentPane key={student.id} solution={student} label={label} />
        </section>
      </div>
    </div>
  );
}

function PaneHeader({ title, badge, children }: { title: string; badge?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className="flex min-h-9 shrink-0 flex-wrap items-center gap-2 border-b border-gray-100 bg-gray-50 px-3 py-1.5">
      <h3 className="truncate text-xs font-semibold text-gray-800">{title}</h3>
      {badge}
      {children}
    </div>
  );
}

function StudentPane({ solution, label }: { solution: StudentSolutionDTO; label: string }) {
  const hasInk = solution.pages.length > 0;
  const steps = solution.stepsText.trim();
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {hasInk && (
        <div className="relative min-h-0 flex-1">
          <HandwritingViewer pages={solution.pages} label={`${studentSolutionTitle(solution)} to ${label}`} />
        </div>
      )}
      {steps && (
        <div className={`overflow-y-auto border-t border-gray-100 bg-white px-3 py-2 ${hasInk ? 'max-h-[40%] shrink-0' : 'flex-1'}`}>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Steps</p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{steps}</p>
        </div>
      )}
    </div>
  );
}
