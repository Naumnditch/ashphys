"use client";
import { useState } from 'react';

export function BookSessionForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');

  return (
    <form className="space-y-3">
      <div>
        <label className="block text-sm mb-1">Student/Parent Name</label>
        <input className="w-full border border-gray-300 rounded-xl px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
      </div>
      <div>
        <label className="block text-sm mb-1">Email</label>
        <input className="w-full border border-gray-300 rounded-xl px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </div>
      <div>
        <label className="block text-sm mb-1">Notes (optional)</label>
        <textarea className="w-full border border-gray-300 rounded-xl px-3 py-2" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Topics, exam date, goals..." />
      </div>
      <p className="text-xs text-gray-500">Payment is required to confirm your booking.</p>
    </form>
  );
}


