'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ApplicationActions({ userId }: { userId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<'approve' | 'reject' | null>(null);

  const handleAction = async (action: 'approve' | 'reject') => {
    if (action === 'reject' && !window.confirm('Reject and remove this application?')) return;
    setLoading(action);
    try {
      const res = await fetch(`/api/admin/teacher-applications/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        router.refresh();
      } else {
        setLoading(null);
      }
    } catch {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleAction('approve')}
        disabled={loading !== null}
        className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading === 'approve' ? 'Approving…' : '✓ Approve'}
      </button>
      <button
        onClick={() => handleAction('reject')}
        disabled={loading !== null}
        className="bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
      >
        {loading === 'reject' ? 'Rejecting…' : 'Reject'}
      </button>
    </div>
  );
}
