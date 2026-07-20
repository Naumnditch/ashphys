'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CreateSectionCard() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      setError('Give the section a name first');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/teacher/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not create section');
        setLoading(false);
        return;
      }
      setOpen(false);
      setName('');
      setLoading(false);
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-2 min-h-[168px] transition-colors group"
      >
        <span className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-gray-200 flex items-center justify-center text-xl text-gray-500 transition-colors">
          +
        </span>
        <span className="text-sm font-semibold text-gray-700">New Section</span>
        <span className="text-xs text-gray-400">e.g. Physics 10B</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleCreate}
      className="border border-gray-200 rounded-xl p-5 min-h-[168px] flex flex-col justify-between bg-white shadow-sm"
    >
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Section Name
        </label>
        <input
          autoFocus
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Physics 10B"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-[15px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {error && <p className="text-xs text-red-600 mt-1.5">{error}</p>}
      </div>
      <div className="flex gap-2 mt-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-gray-900 hover:bg-black text-white text-sm font-semibold py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? 'Creating…' : 'Create'}
        </button>
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            setError('');
          }}
          className="px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
