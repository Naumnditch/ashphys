'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { LessonPickerGroup } from '@/lib/videos/lessonPicker';

export type AdminVideoRequestStatus = 'open' | 'in_progress' | 'fulfilled' | 'declined';

export interface AdminVideoRequest {
  id: string;
  studentId: string;
  description: string;
  questionNumber: string | null;
  status: AdminVideoRequestStatus;
  youtubeUrl: string | null;
  adminNote: string | null;
  createdAt: string;
  studentName: string;
  studentEmail: string;
  topicId: string | null;
  topicName: string | null;
  chapterNumber: number | null;
  chapterTitle: string | null;
  screenshotUrl: string | null;
  lessonVideos: { id: string; lessonId: string; lessonName: string; isPublished: boolean }[];
}

export type AdminVideoRequestsResult =
  | { kind: 'ok'; requests: AdminVideoRequest[]; lessons: LessonPickerGroup[]; lessonVideosAvailable: boolean }
  | { kind: 'unauthorized'; message: string }
  | { kind: 'error'; message: string };

/**
 * One GET /api/admin/video-requests, turned into a definite outcome. Never
 * throws: a network failure, a non-JSON body (e.g. a platform 500 page) and
 * a JSON error all become { kind: 'error' } with a readable message; 401/403
 * become { kind: 'unauthorized' }.
 */
export async function loadAdminVideoRequests(fetchImpl: typeof fetch = fetch): Promise<AdminVideoRequestsResult> {
  let res: Response;
  try {
    res = await fetchImpl('/api/admin/video-requests', { cache: 'no-store' });
  } catch (err) {
    return { kind: 'error', message: `Network error: ${(err as Error)?.message || 'request failed'}` };
  }

  let data: { success?: boolean; error?: string; requests?: AdminVideoRequest[]; lessons?: LessonPickerGroup[]; lessonVideosAvailable?: boolean } | null =
    null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (res.status === 401 || res.status === 403) {
    return { kind: 'unauthorized', message: data?.error || 'Not authorized' };
  }
  if (!res.ok || !data || !data.success) {
    return { kind: 'error', message: data?.error || `The server returned ${res.status}${res.statusText ? ` ${res.statusText}` : ''}.` };
  }
  return {
    kind: 'ok',
    requests: Array.isArray(data.requests) ? data.requests : [],
    lessons: Array.isArray(data.lessons) ? data.lessons : [],
    lessonVideosAvailable: data.lessonVideosAvailable !== false,
  };
}

/**
 * Admin video requests with explicit loading / error / unauthorized states.
 * `loading` is cleared in `finally` on every path; an unmounted component is
 * never updated (cancelled flag). `reload()` refetches after a save.
 */
export function useAdminVideoRequests(fetchImpl?: typeof fetch) {
  const [requests, setRequests] = useState<AdminVideoRequest[]>([]);
  const [lessons, setLessons] = useState<LessonPickerGroup[]>([]);
  const [lessonVideosAvailable, setLessonVideosAvailable] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unauthorized, setUnauthorized] = useState(false);
  const latest = useRef(0);
  const mounted = useRef(true);
  // Kept in a ref: a new function identity on each render (an inline
  // fetchImpl) must not restart the load, or it would never settle.
  const fetchRef = useRef<typeof fetch | undefined>(fetchImpl);
  fetchRef.current = fetchImpl;

  const run = useCallback(
    async (isCancelled: () => boolean) => {
      setLoading(true);
      try {
        const result = await loadAdminVideoRequests(fetchRef.current ?? fetch);
        if (isCancelled()) return;
        if (result.kind === 'ok') {
          setRequests(result.requests);
          setLessons(result.lessons);
          setLessonVideosAvailable(result.lessonVideosAvailable);
          setError(null);
          setUnauthorized(false);
        } else if (result.kind === 'unauthorized') {
          setRequests([]);
          setUnauthorized(true);
          setError(null);
        } else {
          setError(result.message);
        }
      } catch (err) {
        // loadAdminVideoRequests doesn't throw; this guards future edits.
        if (!isCancelled()) setError((err as Error)?.message || 'Could not load requests');
      } finally {
        if (!isCancelled()) setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    mounted.current = true;
    let cancelled = false;
    const call = ++latest.current;
    run(() => cancelled || call !== latest.current);
    return () => {
      cancelled = true;
      mounted.current = false;
    };
  }, [run]);

  const reload = useCallback(() => {
    const call = ++latest.current;
    return run(() => !mounted.current || call !== latest.current);
  }, [run]);

  return { requests, lessons, lessonVideosAvailable, loading, error, unauthorized, reload };
}
