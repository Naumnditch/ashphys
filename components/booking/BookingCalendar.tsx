"use client";
import { useMemo, useState } from 'react';
import { addHours, format, isBefore, isSameDay, setHours, setMinutes, startOfDay } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const START_HOUR = 18; // 6 PM
const END_HOUR = 22;   // 10 PM

export function BookingCalendar({ readOnly = false }: { readOnly?: boolean }) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | undefined>();

  const timeslots = useMemo(() => {
    if (!selectedDate) return [] as Date[];
    const base = startOfDay(selectedDate);
    const slots: Date[] = [];
    for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
      const d = setMinutes(setHours(base, hour), 0);
      slots.push(d);
    }
    return slots;
  }, [selectedDate]);

  return (
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <DayPicker
          mode="single"
          selected={selectedDate}
          onSelect={readOnly ? undefined : setSelectedDate}
          disabled={{ before: new Date() }}
          weekStartsOn={1}
        />
      </div>
      <div className="space-y-2">
        <h3 className="font-medium">Times</h3>
        <div className="grid grid-cols-2 gap-2">
          {timeslots.map((slot) => {
            const label = format(slot, 'h:00 a');
            const value = slot.toISOString();
            const active = selectedTime === value;
            return (
              <button
                key={value}
                className={`btn ${active ? 'btn-primary' : 'btn-secondary'}`}
                disabled={readOnly}
                onClick={() => setSelectedTime(value)}
              >
                {label}
              </button>
            );
          })}
        </div>
        {!readOnly && (
          <form action="/api/checkout/session" method="POST" className="pt-2">
            <input type="hidden" name="datetime" value={selectedTime ?? ''} />
            <button disabled={!selectedTime} className="btn btn-primary w-full" type="submit">
              Proceed to Payment
            </button>
          </form>
        )}
      </div>
    </div>
  );
}


