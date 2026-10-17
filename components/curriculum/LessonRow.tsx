import Link from 'next/link';
import type { CurriculumId } from '@/lib/curricula';
import type { CurriculumLesson } from '@/lib/curricula/lessons';
import { lessonKind, lessonNumber, type LessonProgress } from '@/lib/curricula/courseLayout';
import { tierName } from '@/lib/subscriptions/tiers';
import { CheatSheetIcon, LessonTypeIcon, LockIcon, MasteredCheck, ProgressRing } from './LessonIcons';

/** The lesson page, through one curriculum. The route every curriculum row has always linked to. */
export function lessonHref(lessonId: string, curriculumId: CurriculumId) {
  return `/lessons/${lessonId}?c=${curriculumId}`;
}

interface LessonRowProps {
  lesson: CurriculumLesson;
  curriculumId: CurriculumId;
  /** The viewer's plan tier, to mark lessons they can't open yet. */
  tier: number;
  progress?: LessonProgress;
  masteryStreak: number;
  /** This curriculum has a revision cheat sheet for the lesson (shown as an icon; the row stays one link). */
  hasCheatSheet?: boolean;
}

/**
 * One lesson as a single compact line: type icon, number, title, and muted
 * meta on the right. The whole row is the link to the lesson page, where the
 * practice bank, the simulations and the syllabus reference live.
 */
export function LessonRow({ lesson, curriculumId, tier, progress, masteryStreak, hasCheatSheet }: LessonRowProps) {
  const kind = lessonKind(lesson);
  const { number, title } = lessonNumber(lesson, curriculumId);
  const locked = tier < lesson.requiredTier;
  // The description (or, failing that, the syllabus reference) moved out of
  // the row into its tooltip; a lesson with neither gets no tooltip.
  const tooltip = lesson.description || lesson.syllabusReference || undefined;

  return (
    <li id={`lesson-${lesson.id}`} className="scroll-mt-24">
      <Link
        href={lessonHref(lesson.id, curriculumId)}
        title={tooltip}
        className="group flex items-center gap-3 min-h-[44px] min-[900px]:min-h-0 min-[900px]:h-10 px-2 -mx-2 rounded-md text-sm text-gray-800 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-h-5a67d8 focus-visible:ring-offset-1"
        data-lesson-row={lesson.id}
      >
        <span className="text-gray-500 group-hover:text-h-5a67d8">
          <LessonTypeIcon kind={kind} />
        </span>
        <span className="min-w-0 flex-1 truncate">
          {number && <span className="font-mono text-xs text-gray-500 mr-2">{number}</span>}
          <span className="group-hover:underline">{title}</span>
        </span>
        <span className="flex items-center gap-2 flex-shrink-0 text-xs text-gray-500">
          {locked ? (
            <LockIcon label={`Locked: requires ${tierName(lesson.requiredTier)}`} />
          ) : (
            <>
              {hasCheatSheet && <CheatSheetIcon />}
              {lesson.questionCount > 0 && (
                <span>
                  {lesson.questionCount} question{lesson.questionCount === 1 ? '' : 's'}
                </span>
              )}
              {progress &&
                (progress.mastered ? (
                  <MasteredCheck />
                ) : (
                  <ProgressRing
                    fraction={progress.fraction}
                    label={`In progress: best run ${Math.round(progress.fraction * masteryStreak)} of ${masteryStreak} correct in a row`}
                  />
                ))}
            </>
          )}
        </span>
      </Link>
    </li>
  );
}
