'use client';

import { useEffect, useId, useState } from 'react';
import Link from 'next/link';
import type { CurriculumId } from '@/lib/curricula';
import type { LessonGroup } from '@/lib/curricula/lessons';
import {
  balanceColumns,
  chapterMastery,
  subTopicGroups,
  type ColumnPiece,
  type LessonProgress,
} from '@/lib/curricula/courseLayout';
import { LessonRow } from './LessonRow';
import { ChevronIcon, InfoIcon } from './LessonIcons';

/** localStorage key holding the chapters this viewer has collapsed (one list per student, "guest" when logged out). */
export function collapsedStorageKey(viewerId: string | null | undefined) {
  return `ashphys-curriculum-collapsed:${viewerId || 'guest'}`;
}

function readCollapsed(storageKey: string): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function writeCollapsed(storageKey: string, chapterKey: string, collapsed: boolean) {
  try {
    const next = new Set(readCollapsed(storageKey));
    if (collapsed) next.add(chapterKey);
    else next.delete(chapterKey);
    localStorage.setItem(storageKey, JSON.stringify([...next]));
  } catch {
    // Private mode or storage blocked: the toggle still works for this visit.
  }
}

interface ChapterCardProps {
  group: LessonGroup;
  curriculumId: CurriculumId;
  tier: number;
  /** Practice records by lesson id; absent when logged out. */
  progress?: Record<string, LessonProgress>;
  masteryStreak: number;
  viewerId?: string | null;
  /** Lesson ids with a cheat sheet in this curriculum. */
  cheatSheetLessonIds?: string[];
}

/**
 * One chapter: a collapsible header ("Chapter n", title, level badge),
 * optional chapter mastery, and its lessons in two balanced columns from
 * 900px up (one column below).
 */
export function ChapterCard({
  group,
  curriculumId,
  tier,
  progress,
  masteryStreak,
  viewerId,
  cheatSheetLessonIds,
}: ChapterCardProps) {
  const [open, setOpen] = useState(true);
  const panelId = useId();
  const headingId = useId();
  const tooltipId = useId();
  const storageKey = collapsedStorageKey(viewerId);
  const chapterKey = `${curriculumId}:${group.key}`;

  // Chapters render expanded; a remembered collapse is applied after mount
  // so the server markup and the first client render agree.
  useEffect(() => {
    if (readCollapsed(storageKey).includes(chapterKey)) setOpen(false);
  }, [storageKey, chapterKey]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    writeCollapsed(storageKey, chapterKey, !next);
  };

  const mastery = chapterMastery(group.lessons, progress);
  const [left, right] = balanceColumns(subTopicGroups(group.lessons, curriculumId !== 'igcse'));

  const renderPiece = (piece: ColumnPiece) => (
    <div key={piece.key} style={{ order: piece.order }} data-piece={piece.key}>
      {piece.heading && (
        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 pt-3 pb-1">
          {piece.heading}
          {piece.continued && <span className="normal-case font-normal"> (continued)</span>}
        </h3>
      )}
      <ul>
        {piece.lessons.map((lesson) => (
          <LessonRow
            key={lesson.id}
            lesson={lesson}
            curriculumId={curriculumId}
            tier={tier}
            progress={progress?.[lesson.id]}
            masteryStreak={masteryStreak}
            hasCheatSheet={cheatSheetLessonIds?.includes(lesson.id)}
          />
        ))}
      </ul>
    </div>
  );

  return (
    <section
      id={`unit-${group.key}`}
      aria-labelledby={headingId}
      className="border border-gray-200 rounded-lg bg-white scroll-mt-24"
    >
      <header className="flex items-center gap-3 px-4 sm:px-5 py-3">
        <h2 id={headingId} className="min-w-0 flex-1">
          <button
            type="button"
            onClick={toggle}
            aria-expanded={open}
            aria-controls={panelId}
            className="w-full flex items-center gap-3 text-left rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h-5a67d8 focus-visible:ring-offset-2"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-medium uppercase tracking-wide text-gray-500">{group.label}</span>
              <span className="block text-lg font-semibold text-gray-900 leading-snug">{group.title}</span>
            </span>
            <span className="text-gray-400">
              <ChevronIcon open={open} />
            </span>
          </button>
        </h2>
        {group.level && (
          <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wide text-h-5a67d8 bg-h-eef0fd px-2 py-0.5 rounded-full">
            {group.level}
          </span>
        )}
      </header>

      <div id={panelId} hidden={!open} className="px-4 sm:px-5 pb-4">
        {(mastery || group.chapterId) && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-2 text-xs text-gray-600">
            {mastery && (
              <span className="inline-flex items-center gap-1.5">
                <span>Chapter mastery: {mastery.percent}%</span>
                <span className="relative inline-flex group/tip">
                  <button
                    type="button"
                    aria-label="How chapter mastery is calculated"
                    aria-describedby={tooltipId}
                    className="text-gray-400 hover:text-gray-700 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h-5a67d8"
                  >
                    <InfoIcon />
                  </button>
                  <span
                    id={tooltipId}
                    role="tooltip"
                    className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 w-64 -translate-x-1/2 rounded-md bg-gray-900 px-3 py-2 text-xs text-on-ink opacity-0 shadow-lg transition-opacity group-hover/tip:opacity-100 group-focus-within/tip:opacity-100"
                  >
                    Lessons you have mastered ({mastery.mastered}) out of the lessons in this chapter you can master (
                    {mastery.eligible}): those with practice questions. A lesson is mastered after {masteryStreak} correct
                    answers in a row.
                  </span>
                </span>
              </span>
            )}
            {group.chapterId && (
              <Link
                href={`/curriculum/${group.chapterId}?c=${curriculumId}`}
                className="text-h-5a67d8 hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h-5a67d8"
              >
                Chapter overview →
              </Link>
            )}
          </div>
        )}

        <div className="flex flex-col min-[900px]:grid min-[900px]:grid-cols-2 min-[900px]:gap-x-8" data-lesson-grid>
          <div className="contents min-[900px]:block" data-column="0">
            {left.map(renderPiece)}
          </div>
          <div className="contents min-[900px]:block" data-column="1">
            {right.map(renderPiece)}
          </div>
        </div>
      </div>
    </section>
  );
}
