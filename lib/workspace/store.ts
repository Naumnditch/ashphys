/**
 * student_workspaces reads and writes: a student's own working for one
 * practice question (canvas strokes + typed steps). Every query runs through
 * withRlsContext as that student, and the table's policies only ever match
 * the caller's own row (database/seeds/2026-10-29-shared-solutions.sql), so
 * nobody else — other students, teachers, admins — can read it.
 *
 * The canvas document is versioned like question_handwriting (a save from a
 * stale tab gets a conflict); the typed steps are last-write-wins and never
 * bump the version, so typing doesn't make the canvas's next save conflict.
 */

import { withRlsContext } from '@/lib/db/rls';
import { countStrokes, type HandwritingDoc } from '@/lib/handwriting/types';
import type { SaveResult } from '@/lib/handwriting/store';

export interface StoredWorkspace {
  doc: HandwritingDoc;
  stepsText: string;
  strokeCount: number;
  /** 0 = only steps saved so far. */
  version: number;
  updatedAt: string;
}

const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : String(v));

/** Shown to students before migration "shared_solutions" is applied (the server logs the detail). */
export const WORKSPACE_SCHEMA_MISSING_MESSAGE = 'Your workspace isn’t available yet. Please try again later.';

export async function getWorkspace(user: { id: string }, questionId: string): Promise<StoredWorkspace | null> {
  return withRlsContext(user, async (db) => {
    const r = await db.query(
      `SELECT doc, steps_text, stroke_count, version, updated_at FROM student_workspaces
       WHERE user_id = app_current_user_id() AND question_id = $1`,
      [questionId]
    );
    const row = r.rows[0];
    return row
      ? { doc: row.doc, stepsText: row.steps_text, strokeCount: row.stroke_count, version: row.version, updatedAt: iso(row.updated_at) }
      : null;
  });
}

/** Saves the canvas. Same contract as saveHandwriting: `baseVersion` is the version the editor loaded. */
export async function saveWorkspaceDoc(
  user: { id: string },
  questionId: string,
  doc: HandwritingDoc,
  baseVersion: number,
  force = false
): Promise<SaveResult> {
  const strokeCount = countStrokes(doc);
  const attempt = () =>
    withRlsContext(user, async (db): Promise<SaveResult> => {
      const cur = await db.query(
        `SELECT version, updated_at FROM student_workspaces WHERE user_id = app_current_user_id() AND question_id = $1 FOR UPDATE`,
        [questionId]
      );
      const current = cur.rows[0];
      const currentVersion: number = current?.version ?? 0;
      if (!force && baseVersion !== currentVersion) {
        return { ok: false, conflict: { version: currentVersion, updatedAt: current ? iso(current.updated_at) : null } };
      }
      const r = current
        ? await db.query(
            `UPDATE student_workspaces SET doc = $2::jsonb, stroke_count = $3, version = version + 1, updated_at = now()
             WHERE user_id = app_current_user_id() AND question_id = $1
             RETURNING version, updated_at`,
            [questionId, JSON.stringify(doc), strokeCount]
          )
        : await db.query(
            `INSERT INTO student_workspaces (user_id, question_id, doc, stroke_count, version)
             VALUES (app_current_user_id(), $1, $2::jsonb, $3, 1)
             RETURNING version, updated_at`,
            [questionId, JSON.stringify(doc), strokeCount]
          );
      return { ok: true, version: r.rows[0].version, updatedAt: iso(r.rows[0].updated_at), strokeCount };
    });

  try {
    return await attempt();
  } catch (err) {
    // The first canvas save raced the first steps save, which created the row
    // (at version 0): run once more against that row.
    if ((err as { code?: string }).code === '23505') return attempt();
    throw err;
  }
}

export async function saveWorkspaceSteps(user: { id: string }, questionId: string, stepsText: string): Promise<{ updatedAt: string }> {
  return withRlsContext(user, async (db) => {
    const r = await db.query(
      `INSERT INTO student_workspaces (user_id, question_id, steps_text)
       VALUES (app_current_user_id(), $1, $2)
       ON CONFLICT (user_id, question_id) DO UPDATE SET steps_text = EXCLUDED.steps_text, updated_at = now()
       RETURNING updated_at`,
      [questionId, stepsText]
    );
    return { updatedAt: iso(r.rows[0].updated_at) };
  });
}
