/**
 * Teacher notes on a student's report (table student_report_notes) and who
 * may see / write what. Server-only. Access rules, enforced here because the
 * app talks to Postgres as the table owner (see lib/practice/access.ts):
 *   - a student reads their own report and notes, and marks them read;
 *   - an admin reads and writes anyone's;
 *   - a teacher reads and writes notes for students in their own sections.
 */

import { query } from '@/lib/db/client';
import type { TeacherNote } from '@/lib/reports/types';
import { NOTE_PAD, SIGNATURE_PAD, isInk, parseInk, type Ink } from '@/lib/reports/ink';

export interface ReportViewer {
  id: string;
  role: string;
}

export const NOTE_MAX = 4000;
export const SIGNATURE_MAX = 80;
export const FOCUS_MAX = 5;

export async function isStudent(studentId: string): Promise<boolean> {
  const r = await query(`SELECT 1 FROM users WHERE id = $1 AND role = 'student'`, [studentId]);
  return r.rows.length > 0;
}

/** Staff who may write notes for this student (admins; the student's own teacher). */
export async function canManageReport(viewer: ReportViewer | null, studentId: string): Promise<boolean> {
  if (!viewer) return false;
  if (viewer.role === 'admin') return true;
  if (viewer.role !== 'teacher') return false;
  const r = await query(
    `SELECT 1 FROM users u JOIN sections s ON s.id = u.section_id WHERE u.id = $1 AND s.teacher_id = $2`,
    [studentId, viewer.id]
  );
  return r.rows.length > 0;
}

export async function canViewReport(viewer: ReportViewer | null, studentId: string): Promise<boolean> {
  if (!viewer) return false;
  if (viewer.id === studentId) return true;
  return canManageReport(viewer, studentId);
}

const toNote = (r: Record<string, unknown>): TeacherNote => ({
  id: String(r.id),
  signature: String(r.signature),
  body: String(r.body),
  focusTopicIds: ((r.focus_topic_ids as string[] | null) ?? []).map(String),
  createdAt: new Date(r.created_at as string).toISOString(),
  updatedAt: new Date(r.updated_at as string).toISOString(),
  readAt: r.read_at ? new Date(r.read_at as string).toISOString() : null,
  ink: isInk(r.ink) ? (r.ink as Ink) : null,
  signatureInk: isInk(r.signature_ink) ? (r.signature_ink as Ink) : null,
});

const NOTE_COLUMNS = 'id, signature, body, focus_topic_ids, ink, signature_ink, created_at, updated_at, read_at';

export async function listNotes(studentId: string): Promise<TeacherNote[]> {
  const r = await query(
    `SELECT ${NOTE_COLUMNS}
     FROM student_report_notes WHERE student_id = $1
     ORDER BY created_at DESC LIMIT 20`,
    [studentId]
  );
  return r.rows.map(toNote);
}

export async function unreadNoteCount(studentId: string): Promise<number> {
  const r = await query(
    `SELECT COUNT(*)::int AS n FROM student_report_notes WHERE student_id = $1 AND read_at IS NULL`,
    [studentId]
  );
  return Number(r.rows[0]?.n ?? 0);
}

export async function markNotesRead(studentId: string): Promise<number> {
  const r = await query(
    `UPDATE student_report_notes SET read_at = now() WHERE student_id = $1 AND read_at IS NULL`,
    [studentId]
  );
  return r.rowCount ?? 0;
}

export interface NoteInput {
  body: string;
  signature: string;
  focusTopicIds: string[];
  /** Handwritten note (pen pad), or null. */
  ink: Ink | null;
  /** Handwritten signature, or null (the typed signature is shown instead). */
  signatureInk: Ink | null;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Validates and normalises a note from a request body. Returns an error message or the clean input. */
export function parseNoteInput(raw: unknown): { ok: true; value: NoteInput } | { ok: false; error: string } {
  const o = (raw ?? {}) as Record<string, unknown>;
  const body = typeof o.body === 'string' ? o.body.replace(/\r\n/g, '\n').trim() : '';
  const signature = typeof o.signature === 'string' ? o.signature.trim().replace(/\s+/g, ' ') : '';
  const focus = Array.isArray(o.focusTopicIds) ? o.focusTopicIds.filter((x): x is string => typeof x === 'string') : [];
  const ink = parseInk(o.ink, NOTE_PAD);
  if (!ink.ok) return ink;
  const signatureInk = parseInk(o.signatureInk, SIGNATURE_PAD);
  if (!signatureInk.ok) return { ok: false, error: signatureInk.error.replace('handwriting', 'signature') };
  if (!body && !ink.value) return { ok: false, error: 'Write a note first — typed or handwritten.' };
  if (body.length > NOTE_MAX) return { ok: false, error: `Keep the note under ${NOTE_MAX} characters.` };
  if (!signature) return { ok: false, error: 'Add how the note is signed (e.g. “Mr. Abdelrahman”).' };
  if (signature.length > SIGNATURE_MAX) return { ok: false, error: `Keep the signature under ${SIGNATURE_MAX} characters.` };
  const ids = Array.from(new Set(focus));
  if (ids.some((id) => !UUID.test(id))) return { ok: false, error: 'Unknown lesson in the focus list.' };
  if (ids.length > FOCUS_MAX) return { ok: false, error: `Pick at most ${FOCUS_MAX} focus lessons.` };
  return { ok: true, value: { body, signature, focusTopicIds: ids, ink: ink.value, signatureInk: signatureInk.value } };
}

export async function createNote(studentId: string, authorId: string, input: NoteInput): Promise<TeacherNote> {
  const r = await query(
    `INSERT INTO student_report_notes (student_id, author_id, signature, body, focus_topic_ids, ink, signature_ink)
     SELECT $1::uuid, $2::uuid, $3::text, $4::text,
            COALESCE(array_agg(t.id ORDER BY array_position($5::uuid[], t.id)), '{}'),
            $6::jsonb, $7::jsonb
     FROM (SELECT id FROM topics WHERE id = ANY($5::uuid[])) t
     RETURNING ${NOTE_COLUMNS}`,
    [studentId, authorId, input.signature, input.body, input.focusTopicIds, inkParam(input.ink), inkParam(input.signatureInk)]
  );
  return toNote(r.rows[0]);
}

/** Editing a note marks it unread again so the student sees the change. */
export async function updateNote(studentId: string, noteId: string, input: NoteInput): Promise<TeacherNote | null> {
  const r = await query(
    `UPDATE student_report_notes
     SET signature = $3, body = $4, updated_at = now(), read_at = NULL,
         focus_topic_ids = (SELECT COALESCE(array_agg(id ORDER BY array_position($5::uuid[], id)), '{}')
                            FROM topics WHERE id = ANY($5::uuid[])),
         ink = $6::jsonb, signature_ink = $7::jsonb
     WHERE id = $2 AND student_id = $1
     RETURNING ${NOTE_COLUMNS}`,
    [studentId, noteId, input.signature, input.body, input.focusTopicIds, inkParam(input.ink), inkParam(input.signatureInk)]
  );
  return r.rows[0] ? toNote(r.rows[0]) : null;
}

export async function deleteNote(studentId: string, noteId: string): Promise<boolean> {
  const r = await query(`DELETE FROM student_report_notes WHERE id = $2 AND student_id = $1`, [studentId, noteId]);
  return (r.rowCount ?? 0) > 0;
}

const inkParam = (ink: Ink | null) => (ink ? JSON.stringify(ink) : null);

/**
 * What a new note starts with: the author's last typed signature (else their
 * name) and their saved handwritten signature, if they have drawn one.
 */
export async function defaultSignature(author: {
  id: string;
  firstName?: string;
  lastName?: string;
}): Promise<{ text: string; ink: Ink | null }> {
  const [last, saved] = await Promise.all([
    query(`SELECT signature FROM student_report_notes WHERE author_id = $1 ORDER BY created_at DESC LIMIT 1`, [author.id]),
    query(`SELECT ink FROM staff_signatures WHERE user_id = $1`, [author.id]).catch(() => ({ rows: [] as Record<string, unknown>[] })),
  ]);
  const text = last.rows[0]?.signature
    ? String(last.rows[0].signature)
    : [author.firstName, author.lastName].map((s) => (s ?? '').trim()).filter(Boolean).join(' ') || 'Your teacher';
  const ink = saved.rows[0]?.ink;
  return { text, ink: isInk(ink) ? (ink as Ink) : null };
}

/** Remembers (or forgets, with null) an author's handwritten signature for their next notes. */
export async function saveStaffSignature(userId: string, ink: Ink | null): Promise<void> {
  if (ink) {
    await query(
      `INSERT INTO staff_signatures (user_id, ink, updated_at) VALUES ($1, $2::jsonb, now())
       ON CONFLICT (user_id) DO UPDATE SET ink = EXCLUDED.ink, updated_at = now()`,
      [userId, JSON.stringify(ink)]
    );
  } else {
    await query(`DELETE FROM staff_signatures WHERE user_id = $1`, [userId]);
  }
}
