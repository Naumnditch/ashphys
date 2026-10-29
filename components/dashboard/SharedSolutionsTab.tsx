'use client';

/**
 * Dashboard tab: every solution the student has shared, with its status
 * (pending review, approved — and verified —, not approved with the
 * teacher's note, withdrawn), a link back to the question, and Withdraw for
 * pending or approved ones.
 */

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { MySharedSolutionDTO } from '@/lib/sharedSolutions/types';
import { isLive, SharedStatusChip, WITHDRAW_CONFIRM, withdrawShared } from '@/components/workspace/SharedStatus';

type State = { kind: 'loading' } | { kind: 'error'; message: string } | { kind: 'ready'; solutions: MySharedSolutionDTO[] };

export function SharedSolutionsTab() {
  const [state, setState] = useState<State>({ kind: 'loading' });
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/shared-solutions', { cache: 'no-store' });
        const data = await res.json().catch(() => null);
        if (cancelled) return;
        if (!res.ok || !data?.success) setState({ kind: 'error', message: data?.error || 'Could not load your shared solutions.' });
        else setState({ kind: 'ready', solutions: data.solutions });
      } catch {
        if (!cancelled) setState({ kind: 'error', message: 'Could not load your shared solutions. Check your connection.' });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const withdraw = async (id: string) => {
    if (!window.confirm(WITHDRAW_CONFIRM)) return;
    setBusy(id);
    const result = await withdrawShared(id);
    setBusy(null);
    if (!result.ok) {
      setNotice(result.error);
      return;
    }
    setNotice('Withdrawn. It is no longer shown to anyone.');
    setState((s) => (s.kind === 'ready' ? { ...s, solutions: s.solutions.map((x) => (x.id === id ? { ...x, ...result.solution, question: x.question } : x)) } : s));
  };

  if (state.kind === 'loading') return <p className="text-sm text-gray-400">Loading…</p>;
  if (state.kind === 'error') return <p role="alert" className="text-sm text-red-700">{state.message}</p>;

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Share your working from any practice question (&ldquo;My working&rdquo; next to the question). Your teacher reviews
        it first; approved solutions are shown to students who open that question&rsquo;s worked solution.
      </p>
      {notice && (
        <p role="status" className="rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-700">
          {notice}
        </p>
      )}
      {state.solutions.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
          You haven&rsquo;t shared any solutions yet.
        </p>
      ) : (
        <ul className="divide-y divide-gray-100 rounded-xl border border-gray-200">
          {state.solutions.map((s) => (
            <li key={s.id} className="flex flex-wrap items-start gap-3 p-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <SharedStatusChip status={s.status} verified={s.verified} />
                  <span className="text-xs text-gray-500">
                    as &ldquo;{s.displayName}&rdquo; · {new Date(s.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {s.question && (
                  <p className="mt-1.5 text-sm text-gray-900">
                    <span className="font-semibold">{s.question.lessonTitle}</span>
                    {s.question.number !== null && <span className="text-gray-500"> · Q{s.question.number}</span>}
                    <span className="block truncate text-gray-600">{s.question.text}</span>
                  </p>
                )}
                {s.status === 'rejected' && s.rejectionReason && (
                  <p className="mt-1.5 text-sm text-red-800">Teacher&rsquo;s note: {s.rejectionReason}</p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                {s.question && (
                  <Link
                    href={`/practice/${s.question.lessonId}?q=${s.questionId}`}
                    className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Open question
                  </Link>
                )}
                {isLive(s) && (
                  <button
                    type="button"
                    onClick={() => void withdraw(s.id)}
                    disabled={busy === s.id}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-50 disabled:opacity-40"
                  >
                    {busy === s.id ? 'Withdrawing…' : 'Withdraw'}
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
