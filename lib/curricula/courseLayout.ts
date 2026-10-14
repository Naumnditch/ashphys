/**
 * How the curriculum page lays a chapter out: what kind of item each lesson
 * is, its number, the sub-topics it falls under, and which of the two
 * columns each sub-topic goes in. Pure (no database, no React), so it is unit
 * tested and runs in the client chapter card.
 */

import type { CurriculumId } from './index';
import type { CurriculumLesson } from './lessons';

/**
 * Which icon a lesson row gets. Lessons are `topics` rows and carry no type
 * column (the `lessons` table, which has `lesson_type`, is empty), so the kind
 * is read from what the lesson holds. `video` exists for the icon set but no
 * lesson produces it yet: there is no video data on a topic.
 */
export type LessonKind = 'video' | 'practice' | 'simulation' | 'reading';

export const LESSON_KIND_LABEL: Record<LessonKind, string> = {
  video: 'Video lesson',
  practice: 'Practice set',
  simulation: 'Simulation',
  reading: 'Reading',
};

/** A simulation outranks practice: it's the rarer thing and the row's tooltip names the bank size anyway. */
export function lessonKind(lesson: Pick<CurriculumLesson, 'simulations' | 'questionCount'>): LessonKind {
  if (lesson.simulations.length > 0) return 'simulation';
  if (lesson.questionCount > 0) return 'practice';
  return 'reading';
}

const LEADING_NUMBER = /^(\d+(?:\.\d+)*)\s+(.*)$/;
const NO_NUMBER_CODES = new Set(['Maths', 'Tools']);

/**
 * The number a row shows before the title. IGCSE titles carry their
 * coursebook number ("2.2 Distance-time graphs"), so it is split off the
 * title; elsewhere the curriculum's own topic code leads. The skills units
 * ("Maths", IB "Tool 3") have no per-lesson number.
 */
export function lessonNumber(
  lesson: Pick<CurriculumLesson, 'title' | 'topicCode'>,
  curriculumId: CurriculumId
): { number: string | null; title: string } {
  if (curriculumId === 'igcse') {
    const match = LEADING_NUMBER.exec(lesson.title);
    return match ? { number: match[1], title: match[2] } : { number: null, title: lesson.title };
  }
  const code = lesson.topicCode;
  if (!code || NO_NUMBER_CODES.has(code) || /^Tool\b/.test(code)) return { number: null, title: lesson.title };
  return { number: code, title: lesson.title };
}

export interface SubTopicGroup {
  key: string;
  /** null for the unnamed group of lessons with no sub-topic. */
  heading: string | null;
  lessons: CurriculumLesson[];
}

const UNNAMED = '__unnamed';

/**
 * Splits a chapter's lessons into sub-topics.
 *
 * A sub-topic is a syllabus section that two or more of the chapter's lessons
 * share (IB A.2 "Forces and momentum" has 8 lessons, 9702 3.7 has 3). A
 * lesson alone in its section has no sub-topic (its section title is usually
 * its own title), and those lessons form one unnamed group. A chapter that is
 * all one section gets no headings at all.
 *
 * IGCSE chapters are coursebook chapters whose lessons cite syllabus sections
 * out of order (3.1 → 1.5.1, 3.2 → 1.3, 3.3 → 1.5.1), so grouping them by
 * section would reorder the book: IGCSE passes `useSections: false`.
 *
 * Groups keep the order of their first lesson; lessons keep their order
 * within a group.
 */
export function subTopicGroups(lessons: CurriculumLesson[], useSections = true): SubTopicGroup[] {
  if (lessons.length === 0) return [];
  const sectionOf = (l: CurriculumLesson) => (l.topicCode && l.sectionTitle ? l.topicCode : null);
  const counts = new Map<string, number>();
  for (const l of lessons) {
    const s = sectionOf(l);
    if (s) counts.set(s, (counts.get(s) ?? 0) + 1);
  }
  const allOneSection = counts.size === 1 && (counts.values().next().value as number) === lessons.length;
  if (!useSections || allOneSection) return [{ key: UNNAMED, heading: null, lessons: [...lessons] }];

  const groups = new Map<string, SubTopicGroup>();
  for (const l of lessons) {
    const s = sectionOf(l);
    const key = s && (counts.get(s) ?? 0) >= 2 ? s : UNNAMED;
    let group = groups.get(key);
    if (!group) {
      group = { key, heading: key === UNNAMED ? null : l.sectionTitle, lessons: [] };
      groups.set(key, group);
    }
    group.lessons.push(l);
  }
  return [...groups.values()];
}

export interface ColumnPiece {
  key: string;
  heading: string | null;
  lessons: CurriculumLesson[];
  /** The second half of a group that had to be split across the columns. */
  continued: boolean;
  /** Position in the original single-column order (CSS `order` on mobile). */
  order: number;
}

/**
 * Deals sub-topic groups into two columns of near-equal row count. Groups go
 * in their original order, each to the column with fewer rows so far (the
 * left one on a tie). A group is split only when it alone is more than half
 * the chapter: its head fills the shorter column up to half, the rest goes
 * to the other column. Row count = lesson rows; headings are not counted.
 */
export function balanceColumns(groups: SubTopicGroup[]): [ColumnPiece[], ColumnPiece[]] {
  const columns: [ColumnPiece[], ColumnPiece[]] = [[], []];
  const rows = [0, 0];
  const total = groups.reduce((n, g) => n + g.lessons.length, 0);
  const half = Math.ceil(total / 2);

  groups.forEach((group, index) => {
    const size = group.lessons.length;
    const target = rows[1] < rows[0] ? 1 : 0;
    const other = 1 - target;
    const base = { key: group.key, heading: group.heading, order: index * 2 };

    if (size > total / 2) {
      const headSize = Math.min(size, Math.max(1, half - rows[target]));
      const head = group.lessons.slice(0, headSize);
      const tail = group.lessons.slice(headSize);
      columns[target].push({ ...base, lessons: head, continued: false });
      rows[target] += head.length;
      if (tail.length > 0) {
        columns[other].push({ ...base, key: `${group.key}:continued`, lessons: tail, continued: true, order: index * 2 + 1 });
        rows[other] += tail.length;
      }
      return;
    }

    columns[target].push({ ...base, lessons: group.lessons, continued: false });
    rows[target] += size;
  });

  return columns;
}

export function rowCount(pieces: ColumnPiece[]): number {
  return pieces.reduce((n, p) => n + p.lessons.length, 0);
}

/** A student's practice record on one lesson (a `topic_mastery` row). */
export interface LessonProgress {
  mastered: boolean;
  /** 0–1: best run of correct answers so far, against the run mastery needs. */
  fraction: number;
}

export interface ChapterMastery {
  percent: number;
  mastered: number;
  eligible: number;
}

/**
 * Lessons mastered out of the lessons that can be mastered here (those with
 * practice questions in this curriculum, plus any already mastered through
 * another curriculum's bank). null when the student has no practice record on
 * any lesson in the chapter, so the page hides the line instead of saying 0%.
 */
export function chapterMastery(
  lessons: CurriculumLesson[],
  progress: Record<string, LessonProgress> | undefined
): ChapterMastery | null {
  if (!progress) return null;
  const withProgress = lessons.filter((l) => progress[l.id]);
  if (withProgress.length === 0) return null;
  const mastered = withProgress.filter((l) => progress[l.id].mastered).length;
  const eligible = lessons.filter((l) => l.questionCount > 0 || progress[l.id]?.mastered).length;
  if (eligible === 0) return null;
  return { percent: Math.round((mastered / eligible) * 100), mastered, eligible };
}

/** The min-width at which a chapter's lessons go to two columns. Keep in step with the `min-[900px]:` classes. */
export const TWO_COLUMN_MIN_WIDTH = 900;
