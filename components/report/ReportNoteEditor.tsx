'use client';

/**
 * Staff side of the report's teacher note: type it and/or handwrite it with a
 * pen (tablet stylus, finger or mouse), sign it (typed name + an optional
 * handwritten signature that is remembered for next time), pin up to 5 focus
 * lessons, optionally drop it in the student's mailbox, and edit or delete
 * earlier notes. Saving refreshes the server-rendered report so the preview
 * matches what the student sees.
 */

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { TeacherNote } from '@/lib/reports/types';
import { NOTE_PAD, SIGNATURE_PAD, type Ink } from '@/lib/reports/ink';
import { TeacherNoteCard } from '@/components/report/TeacherNoteCard';
import { InkPad } from '@/components/report/InkPad';
import { InkImage } from '@/components/report/InkImage';

export interface LessonOptionGroup {
  label: string;
  options: { id: string; name: string }[];
}

const NOTE_MAX = 4000;
const FOCUS_MAX = 5;

const STARTERS = [
  'Great effort this week — ',
  'Please focus on ',
  'Before the next test, revise ',
  'Remember to always write your units. ',
];

export function ReportNoteEditor({
  studentId,
  studentFirstName,
  notes,
  defaultSignature,
  lessonGroups,
  canNotify,
}: {
  studentId: string;
  studentFirstName: string;
  notes: TeacherNote[];
  defaultSignature: { text: string; ink: Ink | null };
  lessonGroups: LessonOptionGroup[];
  canNotify: boolean;
}) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [body, setBody] = useState('');
  const [signature, setSignature] = useState(defaultSignature.text);
  const [mode, setMode] = useState<'type' | 'hand'>('type');
  const [ink, setInk] = useState<Ink | null>(null);
  const [signatureInk, setSignatureInk] = useState<Ink | null>(defaultSignature.ink);
  const [signing, setSigning] = useState(false);
  const [focus, setFocus] = useState<string[]>([]);
  const [notify, setNotify] = useState(false);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ kind: 'ok' | 'error'; text: string } | null>(null);

  const lessonName = useMemo(() => {
    const m = new Map<string, string>();
    for (const g of lessonGroups) for (const o of g.options) if (!m.has(o.id)) m.set(o.id, o.name);
    return m;
  }, [lessonGroups]);

  function startEdit(n: TeacherNote) {
    setEditingId(n.id);
    setBody(n.body);
    setSignature(n.signature);
    setInk(n.ink);
    setSignatureInk(n.signatureInk);
    setMode(n.ink && !n.body ? 'hand' : 'type');
    setSigning(false);
    setFocus(n.focusTopicIds);
    setNotify(false);
    setStatus(null);
  }

  function reset() {
    setEditingId(null);
    setBody('');
    setInk(null);
    setFocus([]);
    setNotify(false);
  }

  async function send(method: 'POST' | 'PATCH' | 'DELETE', payload?: Record<string, unknown>, id?: string) {
    setBusy(true);
    setStatus(null);
    try {
      const url = `/api/reports/${studentId}/notes${method === 'DELETE' ? `?id=${id}` : ''}`;
      const res = await fetch(url, {
        method,
        headers: payload ? { 'Content-Type': 'application/json' } : undefined,
        body: payload ? JSON.stringify(payload) : undefined,
      });
      const json = await res.json().catch(() => ({ success: false, error: `Server error (${res.status})` }));
      if (!res.ok || !json.success) throw new Error(json.error || 'Something went wrong');
      return json;
    } catch (err) {
      setStatus({ kind: 'error', text: err instanceof Error ? err.message : 'Something went wrong' });
      return null;
    } finally {
      setBusy(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const payload = { body, signature, focusTopicIds: focus, ink, signatureInk, ...(editingId ? { id: editingId } : { notify }) };
    const json = await send(editingId ? 'PATCH' : 'POST', payload);
    if (!json) return;
    setStatus({
      kind: 'ok',
      text: editingId
        ? `Saved. ${studentFirstName} will see the updated note.`
        : json.notified
          ? `Saved and sent to ${studentFirstName}’s inbox.`
          : `Saved. ${studentFirstName} will see it on their report.`,
    });
    reset();
    router.refresh();
  }

  async function remove(n: TeacherNote) {
    if (!window.confirm('Delete this note? The student will no longer see it.')) return;
    const json = await send('DELETE', undefined, n.id);
    if (!json) return;
    if (editingId === n.id) reset();
    setStatus({ kind: 'ok', text: 'Note deleted.' });
    router.refresh();
  }

  const latest = notes[0];

  return (
    <div className="space-y-3">
      {latest ? (
        <div>
          <p className="mb-1.5 text-xs font-medium text-gray-500">
            What {studentFirstName} sees {latest.readAt ? `· read ${new Date(latest.readAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}` : '· not read yet'}
          </p>
          <TeacherNoteCard note={latest} />
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-amber-300 bg-amber-50/60 px-4 py-3 text-sm text-amber-900">
          ✍️ No note yet. Anything you write below appears on {studentFirstName}’s report (and the PDF), signed by you.
        </p>
      )}

      <form onSubmit={save} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5 space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-[13px] font-semibold uppercase tracking-wide text-gray-500">
            {editingId ? 'Edit note' : `Write a note to ${studentFirstName}`}
          </h3>
          {editingId && (
            <button type="button" onClick={reset} className="text-xs text-gray-500 underline">
              Cancel editing
            </button>
          )}
        </div>

        <div className="inline-flex rounded-lg bg-gray-100 p-1" role="tablist" aria-label="How to write the note">
          {(
            [
              ['type', '⌨️ Type'],
              ['hand', '✍️ Handwrite'],
            ] as const
          ).map(([id, text]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={mode === id}
              onClick={() => setMode(id)}
              className={`min-h-[36px] rounded-md px-3.5 text-sm font-medium ${mode === id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
            >
              {text}
              {id === 'type' && body.trim() && mode !== 'type' && ' •'}
              {id === 'hand' && ink && mode !== 'hand' && ' •'}
            </button>
          ))}
        </div>

        {mode === 'type' ? (
          <>
            <div className="flex flex-wrap gap-1.5">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setBody((b) => (b ? `${b.trimEnd()} ${s}` : s))}
                  className="rounded-full border border-gray-200 px-2.5 py-1 text-xs text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                >
                  {s.trim()}
                </button>
              ))}
            </div>
            <label className="block">
              <span className="sr-only">Note</span>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={5}
                maxLength={NOTE_MAX}
                placeholder={`e.g. Well done on circular motion, ${studentFirstName}! Your weak spot is units — convert to SI before you calculate. Redo the 3 questions still marked wrong before Friday.`}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-[15px] leading-relaxed focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              <span className="block text-right text-[11px] text-gray-400 tabular-nums">
                {body.length}/{NOTE_MAX}
              </span>
            </label>
          </>
        ) : (
          <InkPad value={ink} onChange={setInk} pad={NOTE_PAD} variant="note" label={`Handwritten note to ${studentFirstName}`} />
        )}
        {body.trim() && ink && (
          <p className="text-xs text-gray-500">Both are saved: the typed text shows first, your handwriting under it.</p>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="text-xs font-medium text-gray-600">Signed as</span>
            <input
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              maxLength={80}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <span className="mt-2 flex flex-wrap items-center gap-2">
              {signatureInk && !signing ? (
                <>
                  <span className="rounded-md border border-gray-200 bg-white px-2 py-1">
                    <InkImage ink={signatureInk} label={`Handwritten signature of ${signature}`} height={40} />
                  </span>
                  <button type="button" onClick={() => setSigning(true)} className="text-xs font-medium text-blue-700 hover:underline">
                    Redraw
                  </button>
                  <button type="button" onClick={() => setSignatureInk(null)} className="text-xs font-medium text-gray-500 hover:underline">
                    Use typed only
                  </button>
                </>
              ) : !signing ? (
                <button
                  type="button"
                  onClick={() => setSigning(true)}
                  className="inline-flex min-h-[36px] items-center gap-1.5 rounded-md border border-dashed border-gray-300 px-3 text-xs font-medium text-gray-700 hover:bg-gray-50"
                >
                  ✍️ Add my handwritten signature
                </button>
              ) : null}
            </span>
          </label>
          <label className="block text-sm">
            <span className="text-xs font-medium text-gray-600">Pin focus lessons (optional, up to {FOCUS_MAX})</span>
            <select
              value=""
              disabled={focus.length >= FOCUS_MAX}
              onChange={(e) => {
                const id = e.target.value;
                if (id && !focus.includes(id)) setFocus((f) => [...f, id].slice(0, FOCUS_MAX));
              }}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 disabled:opacity-50"
            >
              <option value="">{focus.length >= FOCUS_MAX ? 'Maximum reached' : 'Add a lesson…'}</option>
              {lessonGroups.map((g) => (
                <optgroup key={g.label} label={g.label}>
                  {g.options.map((o) => (
                    <option key={`${g.label}-${o.id}`} value={o.id} disabled={focus.includes(o.id)}>
                      {o.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
        </div>

        {signing && (
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-700">Sign with your pen — it’s remembered for your next notes</span>
              <button type="button" onClick={() => setSigning(false)} className="text-xs font-semibold text-blue-700 hover:underline">
                ✓ Use this signature
              </button>
            </div>
            <InkPad value={signatureInk} onChange={setSignatureInk} pad={SIGNATURE_PAD} variant="signature" label="Your signature" defaultColor="blue" />
          </div>
        )}

        {focus.length > 0 && (
          <ul className="flex flex-wrap gap-1.5" aria-label="Pinned focus lessons">
            {focus.map((id) => (
              <li key={id} className="inline-flex items-center gap-1 rounded-full bg-amber-100 pl-2.5 pr-1 py-0.5 text-xs font-medium text-amber-900">
                📌 {lessonName.get(id) ?? 'Lesson'}
                <button
                  type="button"
                  onClick={() => setFocus((f) => f.filter((x) => x !== id))}
                  className="rounded-full px-1.5 text-amber-900/70 hover:bg-amber-200"
                  aria-label={`Remove ${lessonName.get(id) ?? 'lesson'}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {canNotify && !editingId && (
            <label className="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="h-4 w-4" />
              Also send it to {studentFirstName}’s inbox (and email)
            </label>
          )}
          <button
            type="submit"
            disabled={busy || (!body.trim() && !ink) || !signature.trim()}
            className="ml-auto min-h-[40px] rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {busy ? 'Saving…' : editingId ? 'Save changes' : 'Save note'}
          </button>
        </div>

        {status && (
          <p role={status.kind === 'error' ? 'alert' : 'status'} className={`text-sm ${status.kind === 'error' ? 'text-rose-700' : 'text-emerald-700'}`}>
            {status.text}
          </p>
        )}
      </form>

      {notes.length > 0 && (
        <details className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm">
          <summary className="cursor-pointer select-none text-xs font-semibold uppercase tracking-wide text-gray-500">
            All notes ({notes.length}) — edit or delete
          </summary>
          <ul className="mt-2 divide-y divide-gray-100">
            {notes.map((n) => (
              <li key={n.id} className="flex items-start gap-3 py-2.5">
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-400">
                    {new Date(n.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {n.signature}
                    {n.readAt ? ' · read' : ' · unread'}
                  </div>
                  <p className="line-clamp-2 whitespace-pre-line text-gray-800">{n.body || (n.ink ? '✍️ Handwritten note' : '')}{n.body && n.ink ? ' · ✍️ + handwriting' : ''}</p>
                </div>
                <button type="button" onClick={() => startEdit(n)} className="text-xs font-medium text-blue-700 hover:underline">
                  Edit
                </button>
                <button type="button" onClick={() => remove(n)} disabled={busy} className="text-xs font-medium text-rose-700 hover:underline">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
    </div>
  );
}
