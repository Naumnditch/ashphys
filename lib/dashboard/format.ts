/** Dashboard display helpers. No server imports: safe in client components. */

import type { StudentProgress, StudentStreaks } from '@/lib/dashboard/data';

/** True when there's nothing to chart yet: show the "Start with a lesson" welcome instead. */
export function isNewStudent(progress: StudentProgress, streaks: StudentStreaks): boolean {
  return progress.totals.attempted === 0 && progress.totals.lessons_visited === 0 && streaks.study_days === 0;
}

export function formatPercent(accuracy: number | null | undefined): string {
  return accuracy === null || accuracy === undefined ? '—' : `${Math.round(accuracy * 100)}%`;
}
