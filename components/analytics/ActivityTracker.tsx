'use client';

import { useEffect } from 'react';
import { recordActivity, type ActivityType } from '@/lib/activity/client';

/** Records one activity_events row (streaks, lessons visited) when mounted. */
export function ActivityTracker({ type, lessonId }: { type: ActivityType; lessonId?: string | null }) {
  useEffect(() => {
    recordActivity(type, lessonId);
  }, [type, lessonId]);

  return null;
}
