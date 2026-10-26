/**
 * The teacher's note as the student sees it: a signed, dated card on the
 * report (earlier notes folded underneath). Pure render; used by the report
 * and by the staff editor's live preview.
 */

import type { TeacherNote } from '@/lib/reports/types';

const TZ = 'Europe/Istanbul';
export const fmtDate = (iso: string | null, withYear = true) =>
  iso
    ? new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', ...(withYear ? { year: 'numeric' } : {}), timeZone: TZ })
    : '—';

export function TeacherNoteCard({ note, isNew, older }: { note: TeacherNote; isNew?: boolean; older?: TeacherNote[] }) {
  return (
    <section
      className="relative overflow-hidden rounded-xl border border-amber-200 bg-[#fffbeb] p-4 sm:p-5 break-inside-avoid"
      aria-label={`Note from ${note.signature}`}
    >
      <div className="absolute inset-y-0 left-0 w-1.5 bg-amber-400" aria-hidden />
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-lg" aria-hidden>
          ✍️
        </span>
        <h3 className="text-sm font-semibold text-amber-900">A note from your teacher</h3>
        {isNew && <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">New</span>}
        <span className="ml-auto text-xs text-amber-800/70">
          {fmtDate(note.createdAt)}
          {note.updatedAt.slice(0, 16) !== note.createdAt.slice(0, 16) && ` · edited ${fmtDate(note.updatedAt, false)}`}
        </span>
      </div>
      <div className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-gray-900">{note.body}</div>
      <p className="mt-3 text-right text-[15px] font-semibold italic text-amber-900">— {note.signature}</p>
      {older && older.length > 0 && (
        <details className="mt-3 border-t border-amber-200/80 pt-2 text-sm">
          <summary className="cursor-pointer select-none text-xs font-medium text-amber-900/80">
            Earlier notes ({older.length})
          </summary>
          <ul className="mt-2 space-y-3">
            {older.map((n) => (
              <li key={n.id} className="text-gray-800">
                <div className="text-xs text-amber-800/70">
                  {fmtDate(n.createdAt)} · {n.signature}
                </div>
                <div className="whitespace-pre-line">{n.body}</div>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
