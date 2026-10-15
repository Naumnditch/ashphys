/**
 * Server side of the activity log. Inserts run under row-level security
 * (the policy only accepts rows whose student_id is the caller), and a
 * repeat of the same activity on the same lesson within the throttle
 * window is dropped so reloads don't flood the table.
 */

import { withRlsContext } from '@/lib/db/rls';
import type { ActivityType } from '@/lib/activity/client';

export const ACTIVITY_TYPES: readonly ActivityType[] = ['lesson_view', 'video_view'];
const THROTTLE_MINUTES = 30;

export function isActivityType(value: unknown): value is ActivityType {
  return typeof value === 'string' && (ACTIVITY_TYPES as readonly string[]).includes(value);
}

/** Returns true when a row was written, false when throttled. */
export async function recordActivityEvent(
  student: { id: string },
  type: ActivityType,
  lessonId: string | null
): Promise<boolean> {
  return withRlsContext(student, async (db) => {
    const result = await db.query(
      `INSERT INTO activity_events (student_id, type, lesson_id)
       SELECT $1, $2, t.id
       FROM (SELECT $3::uuid AS id) wanted
       LEFT JOIN topics t ON t.id = wanted.id
       WHERE NOT EXISTS (
         SELECT 1 FROM activity_events e
         WHERE e.student_id = $1 AND e.type = $2
           AND e.lesson_id IS NOT DISTINCT FROM t.id
           AND e.created_at > now() - make_interval(mins => $4)
       )`,
      [student.id, type, lessonId, THROTTLE_MINUTES]
    );
    return (result.rowCount ?? 0) > 0;
  });
}
