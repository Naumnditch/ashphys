'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { StudentVideoRequest } from '@/lib/videoRequests/types';

export type MyVideoRequestsStatus = 'loading' | 'ready' | 'signed-out' | 'error';

/**
 * The signed-in student's own video requests (GET /api/video-requests).
 *
 * - Auth is checked inside the loader: a 401 puts the hook in "signed-out"
 *   and clears the data, rather than throwing.
 * - Loads on mount and again whenever the window regains focus or the tab
 *   becomes visible, so a video an admin just fulfilled shows up when the
 *   student comes back to the page.
 * - `reload()` refetches on demand (call it after a successful submit).
 * - `initial` (server-rendered) avoids an empty first paint; it is still
 *   refreshed on mount.
 */
export function useMyVideoRequests(initial?: StudentVideoRequest[]) {
  const [requests, setRequests] = useState<StudentVideoRequest[]>(initial ?? []);
  const [status, setStatus] = useState<MyVideoRequestsStatus>(initial ? 'ready' : 'loading');
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef<AbortController | null>(null);

  const reload = useCallback(async () => {
    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;
    try {
      const res = await fetch('/api/video-requests', { cache: 'no-store', signal: controller.signal });
      if (res.status === 401) {
        setRequests([]);
        setStatus('signed-out');
        return;
      }
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Could not load your requests');
      setRequests(data.requests);
      setError(null);
      setStatus('ready');
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setError((err as Error).message || 'Could not load your requests');
      setStatus((s) => (s === 'loading' ? 'error' : s));
    }
  }, []);

  useEffect(() => {
    reload();
    const onFocus = () => reload();
    const onVisible = () => document.visibilityState === 'visible' && reload();
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
      inFlight.current?.abort();
    };
  }, [reload]);

  /** Optimistically mark a video opened (the server call is made separately). */
  const markOpenedLocally = useCallback((id: string) => {
    const now = new Date().toISOString();
    setRequests((prev) => prev.map((r) => (r.id === id && !r.openedAt ? { ...r, openedAt: now } : r)));
  }, []);

  return { requests, status, error, reload, markOpenedLocally };
}
