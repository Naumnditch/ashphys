'use client';

import { useEffect, useState } from 'react';

interface Plan { id: string; name: string; price_monthly: string; price_yearly: string; tier_level: number; }
interface ReqRow { id: string; months: number; amount_claimed: string | null; reference: string | null; status: string; admin_note: string | null; created_at: string; plan_name: string | null; }

export function ReceiptUploadForm({ plans, reference }: { plans: Plan[]; reference: string }) {
  const [planId, setPlanId] = useState(plans[0]?.id ?? '');
  const [months, setMonths] = useState(1);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [history, setHistory] = useState<ReqRow[]>([]);

  const loadHistory = async () => {
    const res = await fetch('/api/payment-requests');
    if (res.ok) {
      const d = await res.json();
      if (d.success) setHistory(d.requests);
    }
  };
  useEffect(() => { loadHistory(); }, []);

  const submit = async () => {
    if (!file) { setMsg({ ok: false, text: 'Please attach your receipt first' }); return; }
    setBusy(true);
    setMsg(null);
    try {
      const body = new FormData();
      body.set('file', file);
      body.set('planId', planId);
      body.set('months', String(months));
      if (amount) body.set('amount', amount);
      if (note) body.set('note', note);
      const res = await fetch('/api/payment-requests', { method: 'POST', body });
      const d = await res.json();
      if (!res.ok || !d.success) {
        setMsg({ ok: false, text: d.error || 'Could not submit' });
      } else {
        setMsg({ ok: true, text: 'Receipt received — your access will be activated once it is checked.' });
        setFile(null);
        setAmount('');
        setNote('');
        await loadHistory();
      }
    } catch {
      setMsg({ ok: false, text: 'Network error — please try again' });
    } finally {
      setBusy(false);
    }
  };

  const badge = (status: string) => {
    if (status === 'approved') return 'bg-[#e6f2ee] text-[#1b5c4d]';
    if (status === 'rejected') return 'bg-[#fbeae7] text-[#8f3626]';
    return 'bg-[#f6efdc] text-[#8f6428]';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-[#e4ddcc] rounded-xl p-6">
        <div className="bg-[#e6f2ee] border border-[#2e7d6b] rounded-lg p-3 mb-5">
          <div className="text-[11px] font-mono uppercase tracking-wide text-[#1b5c4d] mb-0.5">Your payment reference</div>
          <div className="font-mono text-[20px] font-bold text-[#1b5c4d] tracking-wider">{reference}</div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-[#4a5a72] mb-1">What did you pay for?</label>
            <select value={planId} onChange={(e) => setPlanId(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {plans.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4a5a72] mb-1">Duration paid for</label>
            <select value={months} onChange={(e) => setMonths(parseInt(e.target.value, 10))} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
              {[1, 3, 6, 12].map((m) => <option key={m} value={m}>{m} month{m > 1 ? 's' : ''}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4a5a72] mb-1">Amount paid (TRY, optional)</label>
            <input type="number" step="any" min="0" value={amount} onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="99" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#4a5a72] mb-1">Note (optional)</label>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Anything I should know" />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-medium text-[#4a5a72] mb-1">Receipt (photo, screenshot or PDF)</label>
          <div className="flex items-center gap-2 flex-wrap">
            <label className="cursor-pointer text-[12.5px] font-semibold px-3 py-2 rounded-lg border border-[#d8cfb6] text-[#1b2a41] hover:bg-[#faf7f0]">
              Choose file
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,application/pdf"
                className="hidden"
                onChange={(e) => { setFile(e.target.files?.[0] ?? null); setMsg(null); }}
              />
            </label>
            <span className="text-[12px] text-[#4a5a72]">{file ? file.name : 'no file chosen'}</span>
          </div>
          <p className="text-[11px] text-[#a8a196] mt-1.5">
            Your receipt is stored privately and is only visible to your teacher.
          </p>
        </div>

        {msg && <p className={`text-sm mb-3 ${msg.ok ? 'text-green-700' : 'text-red-600'}`}>{msg.text}</p>}

        <button onClick={submit} disabled={busy || !file}
          className="bg-[#1b2a41] hover:bg-[#243a5e] text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50">
          {busy ? 'Uploading…' : 'Submit receipt'}
        </button>
      </div>

      {history.length > 0 && (
        <div className="bg-white border border-[#e4ddcc] rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-[#eee6d3]">
            <span className="font-mono text-[11px] tracking-wide uppercase text-[#4a5a72]">Your submissions</span>
          </div>
          <div className="divide-y divide-[#eee6d3]">
            {history.map((r) => (
              <div key={r.id} className="px-5 py-3">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-[13px] text-[#1b2a41]">
                    {r.plan_name ?? 'Plan'} · {r.months} month{r.months > 1 ? 's' : ''}
                    {r.amount_claimed ? ` · ${parseFloat(r.amount_claimed).toFixed(0)} TRY` : ''}
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${badge(r.status)}`}>
                    {r.status === 'pending' ? 'awaiting review' : r.status}
                  </span>
                </div>
                <div className="text-[11.5px] text-[#a8a196] mt-0.5">
                  {new Date(r.created_at).toLocaleDateString()}
                </div>
                {r.admin_note && <div className="text-[12px] text-[#4a5a72] mt-1.5">Note: {r.admin_note}</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
