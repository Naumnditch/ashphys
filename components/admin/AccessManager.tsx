'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Plan { id: string; name: string; tier_level: number; price_monthly: string; price_yearly: string; }
interface Sub {
  student_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  plan_id: string | null;
  plan_name: string | null;
  tier_level: number | null;
  status: string | null;
  end_date: string | null;
  days_left: number | null;
}

export function AccessManager({ plans, initialSubs }: { plans: Plan[]; initialSubs: Sub[] }) {
  const router = useRouter();
  const [subs, setSubs] = useState(initialSubs);
  const [search, setSearch] = useState('');

  // top form — quick grant by email (useful when the student isn't visible below yet, e.g. searching)
  const [email, setEmail] = useState('');
  const [planId, setPlanId] = useState(plans.find((p) => p.tier_level === 1)?.id ?? plans[0]?.id ?? '');
  const [months, setMonths] = useState(1);
  const [reference, setReference] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  // per-row edit state, keyed by student_id
  const [rowEdit, setRowEdit] = useState<Record<string, { planId: string; months: number }>>({});
  const [rowBusy, setRowBusy] = useState<string | null>(null);

  const refresh = async () => {
    const res = await fetch('/api/admin/access/list');
    if (res.ok) {
      const d = await res.json();
      if (d.success) setSubs(d.subs);
    }
    router.refresh();
  };

  const grant = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), planId, months, reference: reference.trim() }),
      });
      const d = await res.json();
      if (!res.ok || !d.success) {
        setMsg({ ok: false, text: d.error || 'Could not grant access' });
      } else {
        const until = d.subscription?.end_date ? new Date(d.subscription.end_date).toLocaleDateString() : '';
        setMsg({ ok: true, text: `${d.student.email} now has ${d.subscription?.plan_name} until ${until}` });
        setEmail('');
        setReference('');
        await refresh();
      }
    } catch {
      setMsg({ ok: false, text: 'Network error' });
    } finally {
      setBusy(false);
    }
  };

  const rowStateFor = (s: Sub) =>
    rowEdit[s.student_id] ?? { planId: s.plan_id ?? plans.find((p) => p.tier_level === 1)?.id ?? plans[0]?.id ?? '', months: 1 };
  const setRowStateFor = (s: Sub, patch: Partial<{ planId: string; months: number }>) =>
    setRowEdit((p) => ({ ...p, [s.student_id]: { ...rowStateFor(s), ...patch } }));

  const setTier = async (s: Sub) => {
    const st = rowStateFor(s);
    setRowBusy(s.student_id);
    const res = await fetch('/api/admin/access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: s.student_id, planId: st.planId, months: st.months, reference: 'manual override' }),
    });
    setRowBusy(null);
    if (res.ok) {
      await refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      window.alert(d.error || 'Could not change tier');
    }
  };

  const revoke = async (studentId: string, who: string) => {
    if (!window.confirm(`Set ${who} back to Free tier?`)) return;
    setRowBusy(studentId);
    await fetch('/api/admin/access', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId }),
    });
    setRowBusy(null);
    await refresh();
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return subs;
    return subs.filter((s) => {
      const name = [s.first_name, s.last_name].filter(Boolean).join(' ').toLowerCase();
      return name.includes(q) || s.email.toLowerCase().includes(q);
    });
  }, [subs, search]);

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">Grant or Extend Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Student email</label>
            <input
              type="email"
              placeholder="student@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Plan</label>
            <select value={planId} onChange={(e) => setPlanId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {plans.filter((p) => p.tier_level > 0).map((p) => (
                <option key={p.id} value={p.id}>{p.name} — {p.price_monthly} TRY/mo</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Duration</label>
            <select value={months} onChange={(e) => setMonths(parseInt(e.target.value, 10))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {[1, 3, 6, 12].map((m) => <option key={m} value={m}>{m} month{m > 1 ? 's' : ''}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Payment reference (optional)</label>
            <input
              type="text"
              placeholder="Shopier order no / bank ref"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
        {msg && (
          <p className={`text-sm mb-3 ${msg.ok ? 'text-green-700' : 'text-red-600'}`}>{msg.text}</p>
        )}
        <button
          onClick={grant}
          disabled={busy || !email.trim()}
          className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50"
        >
          {busy ? 'Saving…' : 'Grant access'}
        </button>
        <p className="text-xs text-gray-400 mt-2">
          Extending an active subscription adds to the time remaining rather than replacing it.
        </p>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          All Students {subs.length > 0 && <span className="text-gray-400">({subs.length})</span>}
        </h2>
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-60"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
        {filtered.length === 0 && <div className="px-5 py-8 text-center text-sm text-gray-400">No students match.</div>}
        {filtered.map((s) => {
          const name = [s.first_name, s.last_name].filter(Boolean).join(' ') || s.email;
          const expired = s.days_left !== null && s.days_left < 0;
          const isFree = !s.plan_id || (s.tier_level ?? 0) === 0;
          const st = rowStateFor(s);
          const busyRow = rowBusy === s.student_id;
          return (
            <div key={s.student_id} className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-medium text-gray-900 text-[14.5px]">{name}</div>
                <div className="text-xs text-gray-400">
                  {s.email} ·{' '}
                  <span className={isFree ? 'text-gray-400' : expired ? 'text-red-500' : s.status === 'active' ? 'text-green-600 font-medium' : 'text-gray-400'}>
                    {isFree ? 'Free' : `${s.plan_name}${expired ? ' (expired)' : ''}`}
                  </span>
                  {s.days_left !== null && !expired && !isFree && ` · ${s.days_left} days left`}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <select
                  value={st.planId}
                  onChange={(e) => setRowStateFor(s, { planId: e.target.value })}
                  className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs"
                >
                  {plans.filter((p) => p.tier_level > 0).map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <select
                  value={st.months}
                  onChange={(e) => setRowStateFor(s, { months: parseInt(e.target.value, 10) })}
                  className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs"
                >
                  {[1, 3, 6, 12].map((m) => <option key={m} value={m}>{m} mo</option>)}
                </select>
                <button
                  onClick={() => setTier(s)}
                  disabled={busyRow}
                  className="bg-[#2e7d6b] hover:bg-[#256355] text-white text-xs font-semibold px-3 py-1.5 rounded-lg disabled:opacity-50"
                >
                  {busyRow ? '…' : 'Set tier'}
                </button>
                {!isFree && (
                  <button
                    onClick={() => revoke(s.student_id, name)}
                    disabled={busyRow}
                    className="text-xs font-medium text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    Revoke
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
