'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function JoinClassPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<{ sectionName: string; teacherName: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/student/join-section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ joinCode: code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Could not join that class');
        setLoading(false);
        return;
      }
      setSuccess(data.data);
      setLoading(false);
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[65vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 mx-auto mb-6 flex items-center justify-center text-2xl">
            ✓
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">You&rsquo;re in!</h1>
          <p className="text-gray-500 leading-relaxed mb-8">
            You&rsquo;ve joined <b className="text-gray-800">{success.sectionName}</b> with{' '}
            <b className="text-gray-800">{success.teacherName}</b>.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-lg font-semibold text-sm"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[65vh] flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-7">
          <h1 className="text-2xl font-bold text-gray-900">Join a Class</h1>
          <p className="text-gray-500 mt-2 text-[15px]">
            Ask your teacher for their class join code.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="e.g. K7XQ2M"
            maxLength={6}
            autoFocus
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-2xl font-mono font-bold tracking-[0.3em] uppercase focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            disabled={loading || code.trim().length < 4}
            className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-lg font-semibold text-[15px] transition-colors disabled:opacity-40"
          >
            {loading ? 'Joining…' : 'Join Class'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          <Link href="/dashboard" className="hover:underline">
            ← Back to Dashboard
          </Link>
        </p>
      </div>
    </div>
  );
}
