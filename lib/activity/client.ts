/**
 * Client-side activity beacon for the dashboard's streaks and "lessons
 * visited" (activity_events). Fire-and-forget like lib/analytics/client.ts,
 * and import-free for the same reason: safe in any 'use client' component.
 * The student is identified server-side from the auth cookie.
 */

export type ActivityType = 'lesson_view' | 'video_view';

export function recordActivity(type: ActivityType, lessonId?: string | null): void {
  try {
    const body = JSON.stringify({ type, lessonId: lessonId ?? null });
    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/activity', new Blob([body], { type: 'application/json' }));
      return;
    }
    fetch('/api/activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Activity logging must never break the page.
  }
}
