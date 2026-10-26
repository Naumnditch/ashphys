/**
 * Teacher notes on a student's progress report.
 *
 *   GET    → { notes }                                   (staff who manage this student)
 *   POST   { body, signature, focusTopicIds?, notify? }  → { note }  add a note
 *   PATCH  { id, body, signature, focusTopicIds? }       → { note }  edit (marks it unread again)
 *   DELETE ?id=…                                         → { ok }
 *
 * Admins may write for anyone; a teacher only for students in their own
 * sections (lib/reports/notes.ts). `notify` (admins only) also drops a short
 * message in the student's mailbox, which emails them as usual.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { fail, readJson, UUID_RE } from '@/lib/messaging/http';
import {
  canManageReport,
  createNote,
  deleteNote,
  isStudent,
  listNotes,
  parseNoteInput,
  updateNote,
} from '@/lib/reports/notes';
import { getSubscriber, sendToSubscribers } from '@/lib/messaging/store';
import { escapeHtml, textToHtml } from '@/lib/messaging/html';

export const dynamic = 'force-dynamic';

async function authorise(studentId: string) {
  const user = await getCurrentUser();
  if (!user) return { error: fail('Please sign in', 401) } as const;
  if (!UUID_RE.test(studentId) || !(await isStudent(studentId))) return { error: fail('Student not found', 404) } as const;
  if (!(await canManageReport(user, studentId))) return { error: fail('Not authorized', 403) } as const;
  return { user } as const;
}

export async function GET(_req: NextRequest, { params }: { params: { studentId: string } }) {
  try {
    const a = await authorise(params.studentId);
    if ('error' in a) return a.error;
    return NextResponse.json({ success: true, notes: await listNotes(params.studentId) });
  } catch (err) {
    console.error('[report notes] GET failed', err);
    return fail('Could not load the notes', 500);
  }
}

export async function POST(req: NextRequest, { params }: { params: { studentId: string } }) {
  try {
    const a = await authorise(params.studentId);
    if ('error' in a) return a.error;
    const json = (await readJson(req)) as Record<string, unknown>;
    const parsed = parseNoteInput(json);
    if (!parsed.ok) return fail(parsed.error);
    const note = await createNote(params.studentId, a.user.id, parsed.value);

    let notified = false;
    if (json.notify === true && a.user.role === 'admin') {
      try {
        const student = await getSubscriber(params.studentId);
        if (student) {
          const preview = parsed.value.body.length > 600 ? `${parsed.value.body.slice(0, 600)}…` : parsed.value.body;
          await sendToSubscribers({
            sender: a.user,
            recipients: [student],
            subject: `A new note from ${parsed.value.signature} on your progress report`,
            body:
              `<p>Hi {{first_name}},</p><p>${escapeHtml(parsed.value.signature)} left you a note on your AshPhys progress report:</p>` +
              `<blockquote>${textToHtml(preview)}</blockquote>` +
              `<p><a href="{{site_url}}/dashboard?tab=report">Open your progress report</a> to read it with your strengths, focus areas and next steps.</p>`,
          });
          notified = true;
        }
      } catch (err) {
        // The note is saved either way; the mailbox message is a courtesy.
        console.error('[report notes] notify failed', err);
      }
    }
    return NextResponse.json({ success: true, note, notified });
  } catch (err) {
    console.error('[report notes] POST failed', err);
    return fail('Could not save the note', 500);
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { studentId: string } }) {
  try {
    const a = await authorise(params.studentId);
    if ('error' in a) return a.error;
    const json = (await readJson(req)) as Record<string, unknown>;
    const id = typeof json.id === 'string' ? json.id : '';
    if (!UUID_RE.test(id)) return fail('Which note?');
    const parsed = parseNoteInput(json);
    if (!parsed.ok) return fail(parsed.error);
    const note = await updateNote(params.studentId, id, parsed.value);
    if (!note) return fail('Note not found', 404);
    return NextResponse.json({ success: true, note });
  } catch (err) {
    console.error('[report notes] PATCH failed', err);
    return fail('Could not save the note', 500);
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { studentId: string } }) {
  try {
    const a = await authorise(params.studentId);
    if ('error' in a) return a.error;
    const id = req.nextUrl.searchParams.get('id') ?? '';
    if (!UUID_RE.test(id)) return fail('Which note?');
    if (!(await deleteNote(params.studentId, id))) return fail('Note not found', 404);
    return NextResponse.json({ success: true, ok: true });
  } catch (err) {
    console.error('[report notes] DELETE failed', err);
    return fail('Could not delete the note', 500);
  }
}
