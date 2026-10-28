/**
 * question_handwriting reads and writes. Every query on the table runs
 * through withRlsContext, so the database itself enforces who may do what
 * (see database/seeds/2026-10-28-question-handwriting.sql): admins read and
 * write; a student reads a row only after answering that question
 * incorrectly; nobody else gets anything.
 *
 * The problems/topics lookups run as the owner first (ashphys_user has no
 * grant on problems), always keyed by ids the route already validated.
 */

import { query } from '@/lib/db/client';
import { withRlsContext } from '@/lib/db/rls';
import { countStrokes, type HandwritingDoc, type HwSnapshot } from './types';
import { renderPreview, renderSnapshots } from './svg';

export interface QuestionRef {
  problemId: string;
  lessonId: string;
  requiredTier: number;
}

/** The question and its lesson, or null if the question doesn't exist (or isn't in that lesson). */
export async function findQuestion(problemId: string, lessonId?: string): Promise<QuestionRef | null> {
  const r = await query(
    `SELECT p.id, p.topic_id, t.required_tier
     FROM problems p JOIN topics t ON t.id = p.topic_id
     WHERE p.id = $1${lessonId ? ' AND p.topic_id = $2' : ''}`,
    lessonId ? [problemId, lessonId] : [problemId]
  );
  const row = r.rows[0];
  return row ? { problemId: row.id, lessonId: row.topic_id, requiredTier: row.required_tier } : null;
}

export interface StoredHandwriting {
  doc: HandwritingDoc;
  version: number;
  updatedAt: string;
}

/**
 * True when the database hasn't had migration "question_handwriting" yet
 * (no ashphys_user role, table or function). Routes then degrade instead of
 * failing: students see no solution, admins get a setup message.
 */
export function isHandwritingSchemaMissing(err: unknown): boolean {
  const e = err as { code?: string; message?: string };
  return (
    e?.code === '42P01' || // undefined table
    e?.code === '42883' || // undefined function
    e?.code === '42704' || // undefined object (role)
    (e?.code === '22023' && /role "ashphys_user" does not exist/.test(e.message ?? ''))
  );
}

export const SCHEMA_MISSING_MESSAGE =
  'Handwritten solutions are not set up on this database yet (migration "question_handwriting" has not been applied).';

const iso = (v: unknown) => (v instanceof Date ? v.toISOString() : String(v));

export async function getHandwritingForAdmin(admin: { id: string }, q: QuestionRef): Promise<StoredHandwriting | null> {
  return withRlsContext(admin, async (db) => {
    const r = await db.query(
      `SELECT doc, version, updated_at FROM question_handwriting WHERE lesson_id = $1 AND question_id = $2`,
      [q.lessonId, q.problemId]
    );
    const row = r.rows[0];
    return row ? { doc: row.doc, version: row.version, updatedAt: iso(row.updated_at) } : null;
  });
}

export type SaveResult =
  | { ok: true; version: number; updatedAt: string; strokeCount: number }
  | { ok: false; conflict: { version: number; updatedAt: string | null } };

/**
 * Saves a validated document with its SVG snapshots. `baseVersion` is the
 * version the editor loaded (0 = none yet); a mismatch means another tab or
 * device saved in between, and the save is refused unless `force`.
 */
export async function saveHandwriting(
  admin: { id: string },
  q: QuestionRef,
  doc: HandwritingDoc,
  baseVersion: number,
  force = false
): Promise<SaveResult> {
  const snapshots = renderSnapshots(doc);
  const preview = renderPreview(doc);
  const strokeCount = countStrokes(doc);

  const attempt = () =>
    withRlsContext(admin, async (db): Promise<SaveResult> => {
      const cur = await db.query(
        `SELECT version, updated_at FROM question_handwriting WHERE lesson_id = $1 AND question_id = $2 FOR UPDATE`,
        [q.lessonId, q.problemId]
      );
      const current = cur.rows[0];
      const currentVersion: number = current?.version ?? 0;
      if (!force && baseVersion !== currentVersion) {
        return { ok: false, conflict: { version: currentVersion, updatedAt: current ? iso(current.updated_at) : null } };
      }
      const values = [q.lessonId, q.problemId, JSON.stringify(doc), JSON.stringify(snapshots), preview ? JSON.stringify(preview) : null, doc.pages.length, strokeCount, admin.id];
      const r = current
        ? await db.query(
            `UPDATE question_handwriting
             SET doc = $3::jsonb, snapshots = $4::jsonb, preview = $5::jsonb, page_count = $6, stroke_count = $7,
                 version = version + 1, updated_at = now(), updated_by = $8
             WHERE lesson_id = $1 AND question_id = $2
             RETURNING version, updated_at`,
            values
          )
        : await db.query(
            `INSERT INTO question_handwriting (lesson_id, question_id, doc, snapshots, preview, page_count, stroke_count, created_by, updated_by)
             VALUES ($1, $2, $3::jsonb, $4::jsonb, $5::jsonb, $6, $7, $8, $8)
             RETURNING version, updated_at`,
            values
          );
      return { ok: true, version: r.rows[0].version, updatedAt: iso(r.rows[0].updated_at), strokeCount };
    });

  try {
    return await attempt();
  } catch (err) {
    // Two first saves raced and the other one inserted the row: report it as a conflict.
    if ((err as { code?: string }).code === '23505') {
      const latest = await getHandwritingForAdmin(admin, q);
      return { ok: false, conflict: { version: latest?.version ?? 0, updatedAt: latest?.updatedAt ?? null } };
    }
    throw err;
  }
}

export interface StudentHandwriting {
  /** The rule the read policy applies, asked of the database directly. */
  answeredIncorrectly: boolean;
  /** Null when there is no handwriting, it was cleared, or the policy hides it. */
  /** pageCount = pages with ink (empty pages are not shown). */
  row: { pageCount: number; preview: HwSnapshot | null; snapshots: HwSnapshot[] | null } | null;
}

/**
 * What this viewer may see of a question's handwriting, read under
 * row-level security as the viewer. Snapshots are only fetched when asked
 * for (`withPages`), i.e. after the tier gate has let the viewer in.
 */
export async function readHandwritingAs(
  viewer: { id: string },
  q: QuestionRef,
  withPages: boolean
): Promise<StudentHandwriting> {
  return withRlsContext(viewer, async (db) => {
    const wrong = await db.query(`SELECT app_answered_incorrectly($1) AS wrong`, [q.problemId]);
    const r = await db.query(
      `SELECT jsonb_array_length(snapshots) AS shown_pages, stroke_count, preview${withPages ? ', snapshots' : ''}
       FROM question_handwriting WHERE lesson_id = $1 AND question_id = $2`,
      [q.lessonId, q.problemId]
    );
    const row = r.rows[0];
    return {
      answeredIncorrectly: wrong.rows[0].wrong === true,
      row:
        row && row.stroke_count > 0
          ? { pageCount: row.shown_pages, preview: row.preview ?? null, snapshots: withPages ? row.snapshots : null }
          : null,
    };
  });
}
