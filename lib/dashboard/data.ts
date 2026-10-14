/**
 * Student dashboard data. All aggregation happens in the database
 * (get_student_progress / get_student_streaks, see
 * database/seeds/2026-10-14-04-student-progress-rpc.sql); this module only
 * calls them under row-level security and types the JSON they return.
 */

import { withRlsContext } from '@/lib/db/rls';

export interface LessonStat {
  lesson_id: string | null;
  lesson_name: string | null;
  attempted: number;
  correct: number;
  accuracy: number;
}

export interface ChapterStat {
  chapter_id: string | null;
  title: string | null;
  chapter_number: number | null;
  course_code: string | null;
  attempted: number;
  correct: number;
  accuracy: number;
  ranked: boolean;
  lessons: LessonStat[];
}

export interface RankedChapter {
  chapter_id: string;
  title: string;
  chapter_number: number;
  course_code: string | null;
  attempted: number;
  accuracy: number;
}

export interface WeakChapter extends RankedChapter {
  weakest_lesson: { lesson_id: string; lesson_name: string; attempted: number; accuracy: number } | null;
}

export interface StudentProgress {
  student_id: string;
  min_attempts_to_rank: number;
  totals: { attempted: number; correct: number; accuracy: number | null; lessons_visited: number; study_days: number };
  chapters: ChapterStat[];
  strengths: RankedChapter[];
  weaknesses: WeakChapter[];
}

export interface StudentStreaks {
  current_streak: number;
  longest_streak: number;
  study_days: number;
  last_study_day: string | null;
  studied_today: boolean;
  today: string;
  timezone: string;
}

export async function getStudentDashboard(student: { id: string }): Promise<{ progress: StudentProgress; streaks: StudentStreaks }> {
  return withRlsContext(student, async (db) => {
    const progress = await db.query(`SELECT get_student_progress($1) AS j`, [student.id]);
    const streaks = await db.query(`SELECT get_student_streaks($1) AS j`, [student.id]);
    return { progress: progress.rows[0].j as StudentProgress, streaks: streaks.rows[0].j as StudentStreaks };
  });
}

export { formatPercent, isNewStudent } from '@/lib/dashboard/format';
