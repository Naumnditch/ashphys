'use client';

import { useRef, useState } from 'react';

export function TestPaymentPortal() {
  const [amount, setAmount] = useState('1.00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const [fields, setFields] = useState<Record<string, string> | null>(null);
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);

  const handlePay = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/payments/shopier/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(amount), productName: 'AshPhys — integration test charge' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Could not start checkout');
        setLoading(false);
        return;
      }
      setFields(data.fields);
      setPaymentUrl(data.paymentUrl);
      // submit on the next tick, once the hidden form has rendered with the new fields
      setTimeout(() => formRef.current?.submit(), 0);
    } catch {
      setError('Network error — please try again');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-md">
      <label className="block text-xs font-medium text-gray-500 mb-1">Test amount (TRY)</label>
      <div className="flex items-center gap-2 mb-4">
        <input
          type="number"
          min="1"
          step="0.5"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <span className="text-sm text-gray-500">TRY</span>
      </div>
      {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
      <button
        onClick={handlePay}
        disabled={loading}
        className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50"
      >
        {loading ? 'Redirecting to Shopier…' : `Pay ${amount} TRY with Shopier`}
      </button>

      {/* Hidden auto-submitting form — Shopier's classic gateway expects a real form POST, not fetch/JSON */}
      {fields && paymentUrl && (
        <form ref={formRef} action={paymentUrl} method="POST" className="hidden">
          {Object.entries(fields).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
        </form>
      )}
    </div>
  );
}
