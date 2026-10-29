'use client';

/**
 * A student's own workspace for one practice question: the handwriting
 * canvas (the same editor the teacher uses, saving to the student's private
 * workspace) and typed steps, both autosaved. Below them, "Share my
 * solution": enabled once something is saved, it opens the consent form and
 * shares a copy of the saved working for review. The student's submissions
 * for this question show here with their status, and a live one can be
 * withdrawn.
 */

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { SaveState } from '@/components/handwriting/useHandwritingDoc';
import { MAX_STEPS_CHARS } from '@/lib/sharedSolutions/validate';
import type { MySharedSolutionDTO, ShareFormDTO } from '@/lib/sharedSolutions/types';
import { ShareSolutionDialog } from './ShareSolutionDialog';
import { isLive, SharedStatusChip, WITHDRAW_CONFIRM, withdrawShared } from './SharedStatus';

const HandwritingEditor = dynamic(() => import('@/components/handwriting/HandwritingEditor'), {
  ssr: false,
  loading: () => <p className="flex h-full items-center justify-center text-sm text-gray-400">Loading your canvas…</p>,
});

const STEPS_SAVE_DELAY_MS = 800;

type StepsStatus = 'loading' | 'saved' | 'unsaved' | 'saving' | 'error';

export default function StudentWorkspace({ topicId, problemId, label }: { topicId: string; problemId: string; label: string }) {
  const endpoint = `/api/practice/${topicId}/workspace/${problemId}`;

  const [canvas, setCanvas] = useState<SaveState & { strokeCount: number }>({ status: 'loading', strokeCount: 0 });
  const [steps, setSteps] = useState('');
  const [stepsStatus, setStepsStatus] = useState<StepsStatus>('loading');
  const [stepsError, setStepsError] = useState<string | null>(null);
  const [stepsOpen, setStepsOpen] = useState(false);
  const [form, setForm] = useState<ShareFormDTO | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  // What the server has for the steps; the textarea may be ahead of it.
  const savedSteps = useRef('');
  const stepsRef = useRef('');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onLoaded = useCallback((data: Record<string, unknown>) => {
    const text = typeof data.stepsText === 'string' ? data.stepsText : '';
    savedSteps.current = text;
    stepsRef.current = text;
    setSteps(text);
    setStepsStatus('saved');
    if (text.trim()) setStepsOpen(true);
  }, []);

  const saveSteps = useCallback(
    async (keepalive = false) => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      const text = stepsRef.current;
      if (text === savedSteps.current) return;
      setStepsStatus('saving');
      try {
        const res = await fetch(endpoint, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ stepsText: text }),
          keepalive,
        });
        const data = await res.json().catch(() => null);
        if (!res.ok || !data?.success) throw new Error(data?.error || `Could not save your steps (HTTP ${res.status})`);
        savedSteps.current = text;
        setStepsError(null);
        setStepsStatus(stepsRef.current === text ? 'saved' : 'unsaved');
        if (stepsRef.current !== text) timer.current = setTimeout(() => void saveSteps(), STEPS_SAVE_DELAY_MS);
      } catch (err) {
        setStepsStatus('error');
        setStepsError(err instanceof Error && err.message !== 'Failed to fetch' ? err.message : 'Offline — not saved yet');
      }
    },
    [endpoint]
  );

  const onStepsChange = (text: string) => {
    stepsRef.current = text;
    setSteps(text);
    setStepsStatus('unsaved');
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void saveSteps(), STEPS_SAVE_DELAY_MS);
  };

  // Leaving the question (or the panel): save typed steps that haven't been yet.
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      if (stepsRef.current !== savedSteps.current) void saveSteps(true);
    },
    [saveSteps]
  );

  const loadForm = useCallback(async () => {
    setFormError(null);
    try {
      const res = await fetch(`${endpoint}/share`, { cache: 'no-store' });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) throw new Error(data?.error || 'Could not load your shared solutions.');
      setForm(data as ShareFormDTO);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not load your shared solutions.');
    }
  }, [endpoint]);

  useEffect(() => {
    void loadForm();
  }, [loadForm]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(t);
  }, [notice]);

  const latest = form?.submissions[0] ?? null;
  const live = latest && isLive(latest) ? latest : null;
  const savedAll = canvas.status === 'saved' && stepsStatus === 'saved';
  const hasWork = canvas.strokeCount > 0 || savedSteps.current.trim().length > 0;
  const canShare = !!form?.canShare && !live && savedAll && hasWork;
  const shareHint = !form?.canShare
    ? null
    : live
      ? null
      : !hasWork
        ? 'Write or type your working first.'
        : !savedAll
          ? 'Saving…'
          : null;

  const summary = [
    canvas.strokeCount > 0 ? `${canvas.strokeCount} stroke${canvas.strokeCount === 1 ? '' : 's'} on the canvas` : null,
    savedSteps.current.trim() ? 'your typed steps' : null,
  ]
    .filter(Boolean)
    .join(' and ');

  const onShared = (solution: MySharedSolutionDTO) => {
    setDialogOpen(false);
    setForm((f) => (f ? { ...f, submissions: [solution, ...f.submissions] } : f));
    setNotice('Shared. Your teacher will review it before other students can see it.');
  };

  const withdraw = async (id: string) => {
    if (!window.confirm(WITHDRAW_CONFIRM)) return;
    setWithdrawing(true);
    const result = await withdrawShared(id);
    setWithdrawing(false);
    if (!result.ok) {
      setNotice(result.error);
      return;
    }
    setForm((f) => (f ? { ...f, submissions: f.submissions.map((s) => (s.id === id ? result.solution : s)) } : f));
    setNotice('Withdrawn. It is no longer shown to anyone.');
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="relative min-h-0 flex-1">
        <HandwritingEditor problemId={problemId} label={`your working for ${label}`} endpoint={endpoint} onLoaded={onLoaded} onSaveState={setCanvas} />
      </div>

      {/* Typed steps */}
      <div className="shrink-0 border-t border-gray-200 bg-white">
        <button
          type="button"
          onClick={() => setStepsOpen((o) => !o)}
          aria-expanded={stepsOpen}
          className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs font-semibold text-gray-700 hover:bg-gray-50"
        >
          <span>📝 Typed steps</span>
          <span className="font-normal text-gray-400">{stepsOpen ? '▾' : steps.trim() ? '▸' : '▸ add your steps as text'}</span>
          <span
            role="status"
            aria-live="polite"
            className={`ml-auto font-normal ${stepsStatus === 'error' ? 'text-red-700' : stepsStatus === 'saved' ? 'text-green-700' : 'text-gray-400'}`}
          >
            {stepsStatus === 'error' ? stepsError : stepsStatus === 'saved' ? (steps ? '✓ Saved' : '') : stepsStatus === 'loading' ? '' : 'Saving…'}
          </span>
        </button>
        {stepsOpen && (
          <div className="px-3 pb-2">
            <textarea
              value={steps}
              onChange={(e) => onStepsChange(e.target.value)}
              onBlur={() => void saveSteps()}
              disabled={stepsStatus === 'loading'}
              maxLength={MAX_STEPS_CHARS}
              rows={4}
              aria-label={`Typed steps for ${label}`}
              placeholder={'Step 1: write down what you know…\nStep 2: choose the equation…'}
              className="h-24 w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm leading-relaxed focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 split:h-28"
            />
          </div>
        )}
      </div>

      {/* Sharing */}
      <div className="flex shrink-0 flex-wrap items-center gap-2 border-t border-gray-200 bg-white px-3 py-2">
        {formError ? (
          <span className="text-xs text-red-700">{formError}</span>
        ) : latest ? (
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <SharedStatusChip status={latest.status} verified={latest.verified} />
            <span className="min-w-0 truncate text-xs text-gray-500">
              {latest.status === 'rejected' && latest.rejectionReason
                ? `Teacher’s note: ${latest.rejectionReason}`
                : `Shared as “${latest.displayName}” on ${new Date(latest.createdAt).toLocaleDateString()}`}
            </span>
            {live && (
              <button
                type="button"
                onClick={() => void withdraw(live.id)}
                disabled={withdrawing}
                className="rounded-md px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-40"
              >
                {withdrawing ? 'Withdrawing…' : 'Withdraw'}
              </button>
            )}
          </div>
        ) : (
          <span className="min-w-0 flex-1 text-xs text-gray-500">Work it out here — your canvas and steps save as you go.</span>
        )}
        {form?.canShare && !live && (
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            disabled={!canShare}
            title={shareHint ?? undefined}
            className="ml-auto shrink-0 rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-on-ink hover:bg-black disabled:opacity-40"
          >
            {latest ? 'Share again' : 'Share my solution'}
          </button>
        )}
        {notice && (
          <p role="status" className="w-full text-xs text-gray-700">
            {notice}
          </p>
        )}
      </div>

      {dialogOpen && form && (
        <ShareSolutionDialog
          form={form}
          shareUrl={`${endpoint}/share`}
          summary={summary}
          onClose={() => {
            setDialogOpen(false);
            // Picks up a changed consent version (the server refuses the old one).
            void loadForm();
          }}
          onShared={onShared}
        />
      )}
    </div>
  );
}
