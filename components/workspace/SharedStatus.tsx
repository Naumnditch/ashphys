'use client';

/** A shared solution's status as the student sees it, and the withdraw action (workspace and dashboard). */

import { STATUS_LABEL, type MySharedSolutionDTO, type SharedSolutionStatus } from '@/lib/sharedSolutions/types';

const TONE: Record<SharedSolutionStatus, string> = {
  pending: 'border-amber-200 bg-amber-50 text-amber-800',
  approved: 'border-green-200 bg-green-50 text-green-800',
  rejected: 'border-red-200 bg-red-50 text-red-800',
  withdrawn: 'border-gray-200 bg-gray-50 text-gray-600',
};

export function SharedStatusChip({ status, verified }: { status: SharedSolutionStatus; verified?: boolean }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1">
      <span className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${TONE[status]}`}>{STATUS_LABEL[status]}</span>
      {status === 'approved' && verified && <VerifiedBadge />}
    </span>
  );
}

export function VerifiedBadge({ long = false }: { long?: boolean }) {
  return (
    <span
      className="rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-800"
      title="Checked against the mark scheme by your teacher"
    >
      ✓ {long ? 'Verified against mark scheme' : 'Verified'}
    </span>
  );
}

/** Pending or approved: still shown (or about to be), so the author can take it back. */
export const isLive = (s: Pick<MySharedSolutionDTO, 'status'>) => s.status === 'pending' || s.status === 'approved';

export async function withdrawShared(id: string): Promise<{ ok: true; solution: MySharedSolutionDTO } | { ok: false; error: string }> {
  try {
    const res = await fetch(`/api/shared-solutions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'withdraw' }),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) return { ok: false, error: data?.error || 'Could not withdraw it. Please try again.' };
    return { ok: true, solution: data.solution };
  } catch {
    return { ok: false, error: 'Could not withdraw it. Check your connection and try again.' };
  }
}

export const WITHDRAW_CONFIRM =
  'Withdraw your shared solution? It is removed from AshPhys straight away and other students will no longer see it. You can share again later.';
