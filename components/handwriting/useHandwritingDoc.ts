'use client';

/**
 * The editor's document state: loading, undo/redo history and debounced
 * autosave with a visible status.
 *
 * Saves send the whole document plus the version it was based on; the
 * server refuses a stale save (409, another tab or device saved since) and
 * the editor asks which version to keep. Only one save is in flight at a
 * time; edits made meanwhile are saved right after. Failed saves retry with
 * backoff, and leaving the question (unmount) flushes a pending save.
 *
 * `endpoint` answers GET → { doc, version, updatedAt } and PUT { doc,
 * baseVersion, force } → { version, updatedAt }: the admin's handwritten
 * solution (/api/admin/handwriting/…) or a student's own workspace
 * (/api/practice/…/workspace/…). `onLoaded` gets the whole GET response, for
 * callers that keep more than the canvas in the same record.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { emptyDoc, newId, type HandwritingDoc } from '@/lib/handwriting/types';

export type SaveStatus = 'loading' | 'saved' | 'unsaved' | 'saving' | 'error' | 'conflict';

export interface SaveState {
  status: SaveStatus;
  message?: string;
  savedAt?: string | null;
  conflictAt?: string | null;
}

const SAVE_DELAY_MS = 1000;
const MAX_HISTORY = 200;

function freshDoc(): HandwritingDoc {
  return emptyDoc(newId());
}

export function useHandwritingDoc(endpoint: string, onLoaded?: (data: Record<string, unknown>) => void) {
  const [doc, setDocState] = useState<HandwritingDoc>(freshDoc);
  const [save, setSave] = useState<SaveState>({ status: 'loading' });
  const [loadError, setLoadError] = useState<string | null>(null);
  const [historySize, setHistorySize] = useState({ past: 0, future: 0 });

  const docRef = useRef(doc);
  const versionRef = useRef(0);
  const past = useRef<HandwritingDoc[]>([]);
  const future = useRef<HandwritingDoc[]>([]);
  const dirty = useRef(false);
  const inFlight = useRef(false);
  const again = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryDelay = useRef(2000);
  const alive = useRef(true);
  const loaded = useRef(false);
  const onLoadedRef = useRef(onLoaded);
  onLoadedRef.current = onLoaded;

  const set = (next: HandwritingDoc) => {
    docRef.current = next;
    if (alive.current) setDocState(next);
  };
  const syncHistory = () => alive.current && setHistorySize({ past: past.current.length, future: future.current.length });
  const status = (s: SaveState) => alive.current && setSave(s);

  const saveNow = useCallback(
    async (force = false): Promise<void> => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      if (!loaded.current || (!dirty.current && !force)) return;
      if (inFlight.current) {
        again.current = true;
        return;
      }
      const sent = docRef.current;
      inFlight.current = true;
      status({ status: 'saving' });
      try {
        const res = await fetch(endpoint, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ doc: sent, baseVersion: versionRef.current, force }),
        });
        const data = await res.json().catch(() => null);
        if (res.status === 409) {
          status({ status: 'conflict', conflictAt: data?.conflict?.updatedAt ?? null });
          return;
        }
        if (!res.ok || !data?.success) {
          const message = data?.error || `Save failed (HTTP ${res.status})`;
          // Too large / invalid won't fix itself by retrying; server errors might.
          if (res.status >= 500) throw new Error(message);
          status({ status: 'error', message });
          return;
        }
        versionRef.current = data.version;
        retryDelay.current = 2000;
        if (docRef.current === sent) {
          dirty.current = false;
          status({ status: 'saved', savedAt: data.updatedAt });
        } else {
          again.current = true;
        }
      } catch (err) {
        const message = err instanceof Error && err.message !== 'Failed to fetch' ? err.message : 'Offline — will retry';
        status({ status: 'error', message });
        const delay = retryDelay.current;
        retryDelay.current = Math.min(30000, delay * 2);
        if (alive.current) timer.current = setTimeout(() => void saveNow(), delay);
      } finally {
        inFlight.current = false;
        if (again.current) {
          again.current = false;
          void saveNow();
        }
      }
    },
    [endpoint]
  );

  const markDirty = useCallback(() => {
    dirty.current = true;
    status({ status: 'unsaved' });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void saveNow(), SAVE_DELAY_MS);
  }, [saveNow]);

  /** Replace the document as one undoable step. */
  const commit = useCallback(
    (next: HandwritingDoc) => {
      past.current.push(docRef.current);
      if (past.current.length > MAX_HISTORY) past.current.shift();
      future.current = [];
      set(next);
      syncHistory();
      markDirty();
    },
    [markDirty]
  );

  const undo = useCallback(() => {
    const prev = past.current.pop();
    if (!prev) return;
    future.current.push(docRef.current);
    set(prev);
    syncHistory();
    markDirty();
  }, [markDirty]);

  const redo = useCallback(() => {
    const next = future.current.pop();
    if (!next) return;
    past.current.push(docRef.current);
    set(next);
    syncHistory();
    markDirty();
  }, [markDirty]);

  const load = useCallback(async () => {
    status({ status: 'loading' });
    setLoadError(null);
    try {
      const res = await fetch(endpoint, { cache: 'no-store' });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) throw new Error(data?.error || `Could not load (HTTP ${res.status})`);
      versionRef.current = data.version;
      past.current = [];
      future.current = [];
      dirty.current = false;
      loaded.current = true;
      set(data.doc ?? freshDoc());
      syncHistory();
      onLoadedRef.current?.(data);
      status({ status: 'saved', savedAt: data.updatedAt });
    } catch (err) {
      if (alive.current) setLoadError(err instanceof Error ? err.message : 'Could not load the handwriting.');
    }
  }, [endpoint]);

  /** Conflict: keep this tab's version (overwrite) or take the other one. */
  const resolveConflict = useCallback(
    async (keep: 'mine' | 'theirs') => {
      if (keep === 'mine') {
        dirty.current = true;
        await saveNow(true);
      } else {
        await load();
      }
    },
    [load, saveNow]
  );

  useEffect(() => {
    alive.current = true;
    void load();
    return () => {
      // Leaving this question: flush what hasn't been saved yet.
      alive.current = false;
      if (timer.current) clearTimeout(timer.current);
      if (dirty.current && loaded.current) {
        timer.current = null;
        void saveNow();
      }
    };
  }, [load, saveNow]);

  // Warn before closing the tab with unsaved ink, and save when the page is hidden.
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty.current || inFlight.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    const onHide = () => document.visibilityState === 'hidden' && dirty.current && void saveNow();
    window.addEventListener('beforeunload', onBeforeUnload);
    document.addEventListener('visibilitychange', onHide);
    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload);
      document.removeEventListener('visibilitychange', onHide);
    };
  }, [saveNow]);

  return {
    doc,
    docRef,
    save,
    loadError,
    reload: load,
    commit,
    undo,
    redo,
    canUndo: historySize.past > 0,
    canRedo: historySize.future > 0,
    saveNow,
    resolveConflict,
  };
}
