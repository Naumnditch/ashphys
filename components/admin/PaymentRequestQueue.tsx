'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Plan { id: string; name: string; tier_level: number; }
interface Req {
  id: string;
  student_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  plan_id: string | null;
  plan_name: string | null;
  course_id: string | null;
  course_title: string | null;
  months: number;
  amount_claimed: string | null;
  reference: string | null;
  student_note: string | null;
  status: string;
  admin_note: string | null;
  created_at: string;
  receiptUrl: string | null;
}

export function PaymentRequestQueue({ plans }: { plans: Plan[] }) {
  const router = useRouter();
  const [reqs, setReqs] = useState<Req[]>([]);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState<Record<string, { planId: string; months: number; note: string }>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/payment-requests');
    if (res.ok) {
      const d = await res.json();
      if (d.success) setReqs(d.requests);
    }
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const stateFor = (r: Req) => edit[r.id] ?? { planId: r.plan_id ?? plans[0]?.id ?? '', months: r.months, note: '' };
  const setStateFor = (r: Req, patch: Partial<{ planId: string; months: number; note: string }>) =>
    setEdit((p) => ({ ...p, [r.id]: { ...stateFor(r), ...patch } }));

  const review = async (r: Req, action: 'approve' | 'reject') => {
    const st = stateFor(r);
    if (action === 'reject' && !st.note.trim()) {
      if (!window.confirm('Reject without giving the student a reason?')) return;
    }
    setBusy(r.id);
    const res = await fetch(`/api/admin/payment-requests/${r.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, adminNote: st.note.trim() || null, planId: st.planId, months: st.months }),
    });
    setBusy(null);
    if (res.ok) { await load(); router.refresh(); }
    else {
      const d = await res.json().catch(() => ({}));
      window.alert(d.error || 'Could not save');
    }
  };

  const pending = reqs.filter((r) => r.status === 'pending');
  const done = reqs.filter((r) => r.status !== 'pending');

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Awaiting review {pending.length > 0 && <span className="ml-1 text-amber-600">({pending.length})</span>}
        </h2>
        {pending.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl px-5 py-8 text-center text-sm text-gray-400">
            Nothing waiting. Receipts students upload will appear here.
          </div>
        ) : (
          <div className="space-y-4">
            {pending.map((r) => {
              const st = stateFor(r);
              const name = [r.first_name, r.last_name].filter(Boolean).join(' ') || r.email;
              return (
                <div key={r.id} className="bg-white border border-amber-300 rounded-xl p-5">
                  <div className="flex flex-wrap justify-between gap-2 mb-3">
                    <div>
                      <div className="font-semibold text-gray-900 text-[15px]">{name}</div>
                      <div className="text-xs text-gray-500">{r.email} · {new Date(r.created_at).toLocaleString()}</div>
                    </div>
                    <div className="text-right text-xs text-gray-500">
                      {r.reference && <div>ref <span className="font-mono text-gray-800">{r.reference}</span></div>}
                      {r.amount_claimed && <div>claims {parseFloat(r.amount_claimed).toFixed(0)} TRY</div>}
                      <div>{r.course_title ? `course: ${r.course_title}` : `says: ${r.plan_name ?? '—'} · ${r.months} mo`}</div>
                    </div>
                  </div>

                  {r.student_note && <p className="text-[12.5px] text-gray-600 bg-gray-50 rounded p-2 mb-3">{r.student_note}</p>}

                  {r.receiptUrl ? (
                    <a href={r.receiptUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-block text-[12.5px] font-semibold px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 mb-4">
                      📄 View receipt
                    </a>
                  ) : (
                    <p className="text-[12.5px] text-red-600 mb-4">Receipt link unavailable — check storage settings.</p>
                  )}

                  {r.course_id ? (
                    <div className="mb-3">
                      <div className="text-[12.5px] text-gray-700 bg-green-50 border border-green-200 rounded p-2.5 mb-2">
                        Approving enrols this student in <strong>{r.course_title}</strong> with lifetime access. Their
                        physics subscription is not affected.
                      </div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Note to student</label>
                      <input type="text" value={st.note} onChange={(e) => setStateFor(r, { note: e.target.value })}
                        placeholder="optional" className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm" />
                    </div>
                  ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Grant plan</label>
                      <select value={st.planId} onChange={(e) => setStateFor(r, { planId: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm">
                        {plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Months</label>
                      <select value={st.months} onChange={(e) => setStateFor(r, { months: parseInt(e.target.value, 10) })}
                        className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm">
                        {[1, 3, 6, 12].map((m) => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1">Note to student</label>
                      <input type="text" value={st.note} onChange={(e) => setStateFor(r, { note: e.target.value })}
                        placeholder="optional" className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm" />
                    </div>
                  </div>
                  )}

                  <div className="flex gap-2">
                    <button onClick={() => review(r, 'approve')} disabled={busy === r.id}
                      className="bg-[#2e7d6b] hover:bg-[#256355] text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
                      {busy === r.id ? 'Working…' : '✓ Approve & grant access'}
                    </button>
                    <button onClick={() => review(r, 'reject')} disabled={busy === r.id}
                      className="border border-red-300 text-red-600 hover:bg-red-50 text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {done.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Reviewed</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
            {done.map((r) => {
              const name = [r.first_name, r.last_name].filter(Boolean).join(' ') || r.email;
              return (
                <div key={r.id} className="px-5 py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[14px] text-gray-900">{name}</div>
                    <div className="text-xs text-gray-400">
                      {r.course_title ?? `${r.plan_name ?? '—'} · ${r.months} mo`} · {new Date(r.created_at).toLocaleDateString()}
                      {r.admin_note ? ` · ${r.admin_note}` : ''}
                    </div>
                  </div>
                  <span className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-full flex-shrink-0 ${
                    r.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}>
                    {r.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
