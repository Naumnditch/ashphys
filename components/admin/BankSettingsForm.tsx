'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  initial: { enabled: boolean; accountName: string; iban: string; bankName: string; note: string };
}

export function BankSettingsForm({ initial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const save = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bank_transfer_enabled: form.enabled ? 'true' : 'false',
          bank_account_name: form.accountName.trim(),
          bank_iban: form.iban.replace(/\s+/g, '').toUpperCase(),
          bank_name: form.bankName.trim(),
          bank_note: form.note.trim(),
        }),
      });
      const d = await res.json();
      setMsg(res.ok && d.success ? { ok: true, text: 'Saved — the pricing page is updated.' } : { ok: false, text: d.error || 'Could not save' });
      if (res.ok && d.success) router.refresh();
    } catch {
      setMsg({ ok: false, text: 'Network error' });
    } finally {
      setBusy(false);
    }
  };

  const ibanLooksValid = form.iban.replace(/\s+/g, '').toUpperCase().startsWith('TR') && form.iban.replace(/\s+/g, '').length === 26;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 max-w-2xl">
      <label className="flex items-center gap-2.5 mb-5 cursor-pointer">
        <input
          type="checkbox"
          checked={form.enabled}
          onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
          className="w-4 h-4"
        />
        <span className="text-sm font-semibold text-gray-900">Show bank transfer option on the pricing page</span>
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Account holder name</label>
          <input
            type="text"
            placeholder="Exactly as it appears at the bank"
            value={form.accountName}
            onChange={(e) => setForm({ ...form, accountName: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Bank name</label>
          <input
            type="text"
            placeholder="e.g. Ziraat Bankası"
            value={form.bankName}
            onChange={(e) => setForm({ ...form, bankName: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-xs font-medium text-gray-500 mb-1">IBAN</label>
        <input
          type="text"
          placeholder="TR00 0000 0000 0000 0000 0000 00"
          value={form.iban}
          onChange={(e) => setForm({ ...form, iban: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
        />
        {form.iban.trim() !== '' && !ibanLooksValid && (
          <p className="text-xs text-amber-600 mt-1">
            A Turkish IBAN starts with TR and is 26 characters long — double-check this before publishing it.
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-500 mb-1">Extra note for students (optional)</label>
        <textarea
          rows={2}
          placeholder="e.g. Access is activated within 24 hours of the transfer arriving."
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      {msg && <p className={`text-sm mb-3 ${msg.ok ? 'text-green-700' : 'text-red-600'}`}>{msg.text}</p>}

      <button
        onClick={save}
        disabled={busy}
        className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50"
      >
        {busy ? 'Saving…' : 'Save settings'}
      </button>
      <p className="text-xs text-gray-400 mt-2">
        These details appear publicly on the pricing page once the toggle above is on.
      </p>
    </div>
  );
}
