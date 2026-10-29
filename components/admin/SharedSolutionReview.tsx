'use client';

/**
 * Admin review queue for solutions students shared from their workspaces.
 * Each one sits side by side with the teacher's handwritten solution, under
 * the question (text, figure, answer, explanation). Actions: approve, reject
 * with an optional reason (the student sees it), and mark as verified
 * against the mark scheme (shown to students as a badge once approved).
 * A withdrawn solution is read-only. The server and database enforce all of
 * this; the buttons only mirror it.
 */

import dynamic from 'next/dynamic';
import { useCallback, useEffect, useState } from 'react';
import { MomentumDiagram } from '@/components/practice/MomentumDiagrams';
import { SharedStatusChip, VerifiedBadge } from '@/components/workspace/SharedStatus';
import type { AdminSharedSolutionDTO, SharedSolutionStatus } from '@/lib/sharedSolutions/types';
import type { HwSnapshot } from '@/lib/handwriting/types';
import { MAX_REJECTION_REASON } from '@/lib/sharedSolutions/validate';

const HandwritingViewer = dynamic(() => import('@/components/handwriting/HandwritingViewer').then((m) => m.HandwritingViewer), {
  ssr: false,
  loading: () => <p className="flex h-full items-center justify-center text-sm text-gray-400">Loading…</p>,
});

type Filter = SharedSolutionStatus | 'all';
const FILTERS: [Filter, string][] = [
  ['pending', 'Pending'],
  ['approved', 'Approved'],
  ['rejected', 'Rejected'],
  ['withdrawn', 'Withdrawn'],
  ['all', 'All'],
];

const AGE_LABEL = { under_18: 'under 18', '18_plus': '18 or over' } as const;

export function SharedSolutionReview() {
  const [filter, setFilter] = useState<Filter>('pending');
  const [items, setItems] = useState<AdminSharedSolutionDTO[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (f: Filter) => {
    setItems(null);
    setError(null);
    try {
      const res = await fetch(`/api/admin/shared-solutions?status=${f}`, { cache: 'no-store' });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) throw new Error(data?.error || `Could not load (HTTP ${res.status})`);
      setItems(data.solutions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the student solutions.');
    }
  }, []);

  useEffect(() => {
    void load(filter);
  }, [filter, load]);

  const patch = (next: Partial<AdminSharedSolutionDTO> & { id: string }) =>
    setItems((list) => list?.map((s) => (s.id === next.id ? { ...s, ...next } : s)) ?? list);

  return (
    <div>
      <div role="tablist" aria-label="Filter by status" className="mb-5 flex flex-wrap gap-1.5">
        {FILTERS.map(([f, label]) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-sm font-semibold ${filter === f ? 'bg-gray-900 text-on-ink' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {error ? (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </p>
      ) : items === null ? (
        <p className="text-sm text-gray-400">Loading…</p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-300 p-8 text-center text-sm text-gray-500">
          {filter === 'pending' ? 'Nothing waiting for review.' : 'No student solutions here.'}
        </p>
      ) : (
        <ul className="space-y-6">
          {items.map((s) => (
            <li key={s.id}>
              <ReviewCard solution={s} onChange={patch} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ReviewCard({
  solution: s,
  onChange,
}: {
  solution: AdminSharedSolutionDTO;
  onChange: (next: Partial<AdminSharedSolutionDTO> & { id: string }) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const withdrawn = s.status === 'withdrawn';
  const q = s.question;

  const act = async (body: Record<string, unknown>): Promise<boolean> => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/shared-solutions/${s.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) throw new Error(data?.error || `Could not save (HTTP ${res.status})`);
      onChange(data.solution);
      setRejecting(false);
      setReason('');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the review.');
      return false;
    } finally {
      setBusy(false);
    }
  };

  // The tick shows straight away; it is undone if the save fails.
  const setVerified = async (verified: boolean) => {
    onChange({ id: s.id, verified });
    if (!(await act({ action: verified ? 'verify' : 'unverify' }))) onChange({ id: s.id, verified: !verified });
  };

  return (
    <article className="rounded-xl border border-gray-200 bg-white" aria-label={`Student solution by ${s.displayName}`}>
      <header className="flex flex-wrap items-center gap-2 border-b border-gray-100 px-4 py-3">
        <SharedStatusChip status={s.status} />
        {s.verified && <VerifiedBadge long />}
        <h2 className="text-sm font-semibold text-gray-900">
          {q.lessonTitle}
          {q.number !== null && <span className="font-normal text-gray-500"> · Q{q.number}</span>}
        </h2>
        <span className="text-xs text-gray-500">
          by {s.student.name} ({s.student.email}) as &ldquo;{s.displayName}&rdquo; · shared {new Date(s.createdAt).toLocaleString()}
        </span>
        <a
          href={`/practice/${q.lessonId}?q=${q.id}`}
          target="_blank"
          rel="noreferrer"
          className="ml-auto text-xs font-semibold text-blue-700 hover:underline"
        >
          Open question ↗
        </a>
      </header>

      <div className="space-y-4 p-4">
        {/* The question and the expected answer */}
        <section aria-label="Question" className="rounded-lg bg-gray-50 p-3">
          {q.imageUrl && q.imageUrl.startsWith('diagram:') && <MomentumDiagram diagramKey={q.imageUrl} />}
          {q.imageUrl && !q.imageUrl.startsWith('diagram:') && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={q.imageUrl} alt="" className="mb-3 max-h-56 max-w-full rounded border border-gray-200 object-contain p-1" style={{ backgroundColor: '#ffffff' }} />
          )}
          <p className="text-sm leading-relaxed text-gray-900">{q.text}</p>
          {q.answer && (
            <p className="mt-2 text-sm text-gray-700">
              <span className="font-semibold">Answer:</span> {q.answer}
            </p>
          )}
          {q.explanation && (
            <details className="mt-1 text-sm text-gray-700">
              <summary className="cursor-pointer text-xs font-semibold text-gray-500">Explanation (mark scheme)</summary>
              <p className="mt-1 leading-relaxed">{q.explanation}</p>
            </details>
          )}
        </section>

        {/* Side by side */}
        <div className="grid gap-4 lg:grid-cols-2">
          <Pane title="Teacher solution" pages={s.teacherPages} empty="No teacher solution for this question yet." />
          <Pane title={`Student solution by ${s.displayName}`} pages={s.pages} steps={s.stepsText} empty="No handwriting, typed steps only." />
        </div>

        {/* Consent record */}
        <details className="text-xs text-gray-600">
          <summary className="cursor-pointer">
            Consent {s.consentVersion} given {new Date(s.consentedAt).toLocaleString()} · age: {s.student.ageBand ? AGE_LABEL[s.student.ageBand] : 'not given'} ·
            parent/guardian: {s.parentConsentAt ? `confirmed ${new Date(s.parentConsentAt).toLocaleString()}` : 'not needed'}
          </summary>
          <p className="mt-1 whitespace-pre-wrap rounded bg-gray-50 p-2">{s.consentText}</p>
        </details>

        {s.status === 'rejected' && s.rejectionReason && <p className="text-sm text-red-800">Reason given: {s.rejectionReason}</p>}
        {s.reviewedAt && (
          <p className="text-xs text-gray-500">
            Reviewed {new Date(s.reviewedAt).toLocaleString()}
            {s.reviewedBy ? ` by ${s.reviewedBy}` : ''}
          </p>
        )}
        {withdrawn && <p className="text-sm text-gray-600">The student withdrew this solution{s.withdrawnAt ? ` on ${new Date(s.withdrawnAt).toLocaleString()}` : ''}. It is not shown anywhere.</p>}

        {!withdrawn && (
          <div className="flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">
            {s.status !== 'approved' && (
              <button
                type="button"
                disabled={busy}
                onClick={() => void act({ action: 'approve' })}
                className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-40"
              >
                Approve
              </button>
            )}
            {!rejecting && (
              <button
                type="button"
                disabled={busy}
                onClick={() => setRejecting(true)}
                className="rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:opacity-40"
              >
                {s.status === 'approved' ? 'Unpublish (reject)' : s.status === 'rejected' ? 'Change reason' : 'Reject'}
              </button>
            )}
            <label className="ml-auto flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-800">
              <input
                type="checkbox"
                checked={s.verified}
                disabled={busy}
                onChange={(e) => void setVerified(e.target.checked)}
                className="h-4 w-4 accent-blue-700"
              />
              Verified against mark scheme
            </label>
          </div>
        )}

        {rejecting && (
          <form
            className="space-y-2 rounded-lg border border-red-200 bg-red-50 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void act({ action: 'reject', reason });
            }}
          >
            <label htmlFor={`reason-${s.id}`} className="block text-sm font-semibold text-red-900">
              Reason (optional — the student sees this)
            </label>
            <textarea
              id={`reason-${s.id}`}
              value={reason}
              maxLength={MAX_REJECTION_REASON}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-red-200 bg-white px-3 py-2 text-sm"
              placeholder="e.g. Step 3 uses the wrong mass; check the units."
            />
            <div className="flex gap-2">
              <button type="submit" disabled={busy} className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:opacity-40">
                Reject
              </button>
              <button type="button" onClick={() => setRejecting(false)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700">
                Cancel
              </button>
            </div>
          </form>
        )}

        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
      </div>
    </article>
  );
}

function Pane({ title, pages, steps, empty }: { title: string; pages: HwSnapshot[]; steps?: string; empty: string }) {
  return (
    <section aria-label={title} className="flex flex-col overflow-hidden rounded-lg border border-gray-200">
      <h3 className="border-b border-gray-100 bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-800">{title}</h3>
      <div className="relative h-80">
        {pages.length > 0 ? <HandwritingViewer pages={pages} label={title} /> : <p className="flex h-full items-center justify-center p-4 text-center text-sm text-gray-500">{empty}</p>}
      </div>
      {steps?.trim() && (
        <div className="max-h-48 overflow-y-auto border-t border-gray-100 px-3 py-2">
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Typed steps</p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{steps}</p>
        </div>
      )}
    </section>
  );
}
