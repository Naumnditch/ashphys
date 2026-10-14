'use client';

import { useCallback, useEffect, useState } from 'react';

interface Booking {
  id: string;
  status: 'pending' | 'paid' | 'scheduled' | 'completed' | 'cancelled' | string;
  price: number;
  scheduledAt: string | null;
  adminNote: string | null;
  createdAt: string;
  name: string;
}

const STATUS: Record<string, string> = {
  pending: 'Awaiting payment',
  paid: 'Paid — a teacher will email you a time',
  scheduled: 'Scheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Istanbul' });

/** The student's tutoring bookings; refreshes when they come back from the payment tab. */
export function MyTutoringBookings() {
  const [bookings, setBookings] = useState<Booking[] | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/tutoring/bookings', { cache: 'no-store' });
      const data = await res.json();
      if (data.success) setBookings(data.bookings);
    } catch {
      /* keep what we have */
    }
  }, []);

  useEffect(() => {
    load();
    window.addEventListener('focus', load);
    return () => window.removeEventListener('focus', load);
  }, [load]);

  if (!bookings || bookings.length === 0) return null;
  return (
    <section aria-labelledby="my-bookings" className="mb-6">
      <h2 id="my-bookings" className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">
        Your bookings
      </h2>
      <ul className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
        {bookings.map((b) => (
          <li key={b.id} className="px-4 py-3 text-sm">
            <div className="flex flex-wrap justify-between gap-2">
              <span className="font-medium text-gray-900">{b.name}</span>
              <span className="text-gray-600">{STATUS[b.status] ?? b.status}</span>
            </div>
            <p className="text-xs text-gray-500">
              Booked {fmt(b.createdAt)} · {b.price.toFixed(0)} TRY
              {b.scheduledAt && <> · Session {fmt(b.scheduledAt)} (Istanbul time)</>}
            </p>
            {b.adminNote && <p className="text-xs text-gray-600 mt-1">Note: {b.adminNote}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
