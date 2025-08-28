import Link from 'next/link';
import { BookingCalendar } from '@/components/booking/BookingCalendar';

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="text-center space-y-6">
        <h1 className="text-4xl sm:text-5xl font-semibold">Personalized Physics Tutoring</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Unlock your child&apos;s potential in Physics with personalized lessons. Clear explanations,
          structured practice, and calm guidance.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/book" className="btn btn-primary">Book Now</Link>
          <Link href="/resources" className="btn btn-secondary">Explore Resources</Link>
        </div>
      </section>

      <section className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Availability</h2>
          <Link href="/book" className="btn btn-primary">Book Now</Link>
        </div>
        <BookingCalendar readOnly />
        <p className="text-xs text-gray-500 mt-2">Monday–Saturday, 6:00 PM – 10:00 PM</p>
      </section>
    </div>
  );
}


