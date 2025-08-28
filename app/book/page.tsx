import { BookingCalendar } from '@/components/booking/BookingCalendar';
import { BookSessionForm } from '@/components/booking/BookSessionForm';

export default function BookPage() {
  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="card p-6">
        <h1 className="text-2xl font-semibold mb-4">Book a Tutoring Session</h1>
        <BookingCalendar />
        <p className="text-xs text-gray-500 mt-2">Available Monday–Saturday, 6:00 PM – 10:00 PM</p>
      </div>
      <div className="card p-6">
        <BookSessionForm />
      </div>
    </div>
  );
}


