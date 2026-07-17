'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/auth/login');
      return;
    }
    
    // For now, just mark as loaded
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Student Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Chapters Completed</h2>
          <p className="text-3xl font-bold text-blue-600">0 / 10</p>
          <p className="text-gray-600 mt-2">Start learning physics today!</p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Average Quiz Score</h2>
          <p className="text-3xl font-bold text-green-600">--</p>
          <p className="text-gray-600 mt-2">No quizzes attempted yet</p>
        </div>

        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Total Hours</h2>
          <p className="text-3xl font-bold text-purple-600">0h</p>
          <p className="text-gray-600 mt-2">Time spent learning</p>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h2 className="text-2xl font-semibold mb-4">📚 Course Coming Soon</h2>
        <p className="text-gray-700 mb-4">
          The AshPhys platform is currently being built! Your teacher is adding:
        </p>
        <ul className="list-disc list-inside space-y-2 text-gray-700 mb-6">
          <li>Interactive video lessons</li>
          <li>Auto-graded practice problems</li>
          <li>Interactive simulations</li>
          <li>Progress tracking</li>
          <li>Peer discussion forums</li>
        </ul>
        <p className="text-sm text-gray-600">
          Expected launch: <strong>August 24, 2026</strong>
        </p>
      </div>

      <div className="mt-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
