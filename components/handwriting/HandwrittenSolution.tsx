'use client';

/**
 * The teacher's handwritten worked solution for one question, read-only.
 * Rendered by the practice page after a wrong answer (and for admins in
 * "Student view"). The server decides everything: it answers only after a
 * wrong answer, and applies the same tier gate as interactive solutions —
 * Free and Plus spend one of their solution views to open a new one (shown
 * before it is spent), Pro is unlimited; out of views shows a teaser and
 * the upgrade card.
 */

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { HandwritingViewDTO } from '@/lib/handwriting/dto';
import type { HwSnapshot } from '@/lib/handwriting/types';
import { HandwritingTeaser } from './HandwritingTeaser';

const HandwritingViewer = dynamic(() => import('./HandwritingViewer').then((m) => m.HandwritingViewer), {
  ssr: false,
  loading: () => <Centered>Loading the worked solution…</Centered>,
});

export type SolutionState = 'loading' | 'none' | 'offer' | 'open' | 'locked' | 'error';

type State =
  | { kind: 'loading' }
  | { kind: 'none' }
  | { kind: 'error'; message: string }
  | { kind: 'offer'; data: HandwritingViewDTO; opening: boolean }
  | { kind: 'open'; pages: HwSnapshot[] }
  | { kind: 'locked'; data: HandwritingViewDTO };

async function call(url: string, method: 'GET' | 'POST'): Promise<{ status: number; body: (HandwritingViewDTO & { success?: boolean; error?: string; reason?: string }) | null }> {
  const res = await fetch(url, { method, cache: 'no-store' });
  return { status: res.status, body: await res.json().catch(() => null) };
}

export function HandwrittenSolution({
  topicId,
  problemId,
  label,
  onState,
}: {
  topicId: string;
  problemId: string;
  label: string;
  onState?: (s: SolutionState) => void;
}) {
  const [state, setState] = useState<State>({ kind: 'loading' });
  const url = `/api/practice/${topicId}/handwriting/${problemId}`;

  useEffect(() => {
    onState?.(state.kind);
  }, [state.kind, onState]);

  const settle = (status: number, body: Awaited<ReturnType<typeof call>>['body']): State => {
    if (!body || (!body.success && status !== 403)) return { kind: 'error', message: body?.error || 'Could not load the worked solution.' };
    // 403 "answer first" (or a locked lesson): nothing to show here.
    if (status === 403 || !body.available || !body.access) return { kind: 'none' };
    if (body.access.allowed && body.pages) return { kind: 'open', pages: body.pages };
    if (body.access.reason === 'limit_reached' || body.access.reason === 'tier_required') return { kind: 'locked', data: body };
    return { kind: 'offer', data: body, opening: false };
  };

  const open = async () => {
    setState((s) => (s.kind === 'offer' ? { ...s, opening: true } : s));
    try {
      const { status, body } = await call(url, 'POST');
      setState(settle(status, body));
    } catch {
      setState({ kind: 'error', message: 'Could not open the worked solution. Check your connection and try again.' });
    }
  };

  useEffect(() => {
    let cancelled = false;
    setState({ kind: 'loading' });
    (async () => {
      try {
        const { status, body } = await call(url, 'GET');
        if (cancelled) return;
        const next = settle(status, body);
        // Already unlocked, Pro or admin: open straight away (no view is spent).
        if (next.kind === 'offer' && body?.access?.allowed) {
          const opened = await call(url, 'POST');
          if (!cancelled) setState(settle(opened.status, opened.body));
          return;
        }
        setState(next);
      } catch {
        if (!cancelled) setState({ kind: 'error', message: 'Could not load the worked solution. Check your connection and try again.' });
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  switch (state.kind) {
    case 'loading':
      return <Centered>Loading the worked solution…</Centered>;
    case 'none':
      return (
        <Centered>
          No handwritten solution for this question yet. The explanation is with your answer.
        </Centered>
      );
    case 'error':
      return (
        <Centered>
          <span role="alert" className="text-red-700">{state.message}</span>
        </Centered>
      );
    case 'open':
      return <HandwritingViewer pages={state.pages} label={label} />;
    case 'offer': {
      const a = state.data.access!;
      const left = a.viewLimit === null ? null : Math.max(0, a.viewLimit - a.viewsUsed);
      return (
        <Centered>
          <div className="max-w-sm text-center">
            <div className="mb-3 text-3xl" aria-hidden="true">✍️</div>
            <p className="mb-1 font-semibold text-gray-900">Your teacher wrote out the solution to this one.</p>
            {left !== null && (
              <p className="mb-4 text-sm text-gray-600">
                Opening it uses 1 of your {left} remaining solution view{left === 1 ? '' : 's'}. Solutions you have opened stay open.
              </p>
            )}
            <button
              type="button"
              onClick={() => void open()}
              disabled={state.opening}
              className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-on-ink hover:bg-black disabled:opacity-50"
            >
              {state.opening ? 'Opening…' : 'Show the worked solution'}
            </button>
          </div>
        </Centered>
      );
    }
    case 'locked': {
      const a = state.data.access!;
      return (
        <div className="h-full overflow-y-auto p-4">
          <div className="mx-auto max-w-lg">
            {state.data.preview && <HandwritingTeaser preview={state.data.preview} />}
            <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 text-center">
              <div className="mb-3 text-3xl" aria-hidden="true">🔒</div>
              <h3 className="mb-2 text-lg font-bold text-gray-900">
                {a.reason === 'tier_required' ? 'This solution needs a higher plan' : "You've used your free solution views"}
              </h3>
              <p className="mb-5 text-sm text-gray-600">Upgrade to Pro to open every worked solution.</p>
              <Link
                href="/pricing"
                onClick={() => void fetch(`${url}/interest`, { method: 'POST' }).catch(() => {})}
                className="btn btn-primary"
              >
                See plans
              </Link>
              {a.viewLimit !== null && (
                <p className="mt-3 text-xs text-gray-400">
                  {a.viewsUsed} of {a.viewLimit} free views used
                </p>
              )}
            </div>
          </div>
        </div>
      );
    }
  }
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full min-h-[10rem] items-center justify-center p-6 text-center text-sm text-gray-500">{children}</div>;
}
