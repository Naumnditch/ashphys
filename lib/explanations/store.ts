/**
 * Database access for structured explanations (columns added by
 * database/seeds/2026-11-02-structured-explanations.sql). The original
 * `explanation` column is never written here.
 */

import { query } from '@/lib/db/client';
import { rewriteExplanation, RewriteNotConfiguredError } from './generate';
import { validateExplanation, type ExpectedAnswer } from './validate';
import type { RewriteInput } from './format';

export type StructuredStatus = 'ok' | 'needs_review';
export type AdminFilter = 'pending' | 'ok' | 'needs_review' | 'manual' | 'all';

export const SCHEMA_MISSING_MESSAGE =
  'The structured-explanation columns are missing. Apply database/seeds/2026-11-02-structured-explanations.sql first.';

export { explanationForStudents } from './display';

export function isSchemaMissing(err: unknown): boolean {
  const e = err as { code?: string; message?: string };
  return e?.code === '42703' && /explanation_structured/.test(e.message ?? '');
}

export interface ExplanationStats {
  total: number;
  ok: number;
  needsReview: number;
  manual: number;
  pending: number;
}

export async function getStats(): Promise<ExplanationStats> {
  const r = await query(
    `SELECT COUNT(*)::int AS total,
            COUNT(*) FILTER (WHERE explanation_structured_status = 'ok')::int AS ok,
            COUNT(*) FILTER (WHERE explanation_structured_status = 'needs_review')::int AS needs_review,
            COUNT(*) FILTER (WHERE explanation_structured_source = 'manual')::int AS manual,
            COUNT(*) FILTER (WHERE explanation_structured IS NULL)::int AS pending
     FROM problems WHERE explanation IS NOT NULL AND btrim(explanation) <> ''`,
  );
  const row = r.rows[0];
  return { total: row.total, ok: row.ok, needsReview: row.needs_review, manual: row.manual, pending: row.pending };
}

export interface AdminRow {
  id: string;
  problemNumber: number | null;
  topicName: string | null;
  curriculumId: string | null;
  answerType: string;
  questionText: string;
  answer: string;
  explanation: string;
  structured: string | null;
  status: StructuredStatus | null;
  issues: string[];
  source: 'ai' | 'manual' | null;
  updatedAt: string | null;
}

const FILTER_SQL: Record<AdminFilter, string> = {
  pending: 'p.explanation_structured IS NULL',
  ok: "p.explanation_structured_status = 'ok'",
  needs_review: "p.explanation_structured_status = 'needs_review'",
  manual: "p.explanation_structured_source = 'manual'",
  all: 'TRUE',
};

export const PAGE_SIZE = 25;

export async function listForAdmin(opts: { filter: AdminFilter; q?: string; page?: number }): Promise<{ rows: AdminRow[]; total: number }> {
  const params: unknown[] = [];
  let where = `p.explanation IS NOT NULL AND btrim(p.explanation) <> '' AND ${FILTER_SQL[opts.filter]}`;
  if (opts.q?.trim()) {
    params.push(`%${opts.q.trim()}%`);
    where += ` AND (p.question_text ILIKE $${params.length} OR t.topic_name ILIKE $${params.length})`;
  }
  const page = Math.max(1, opts.page ?? 1);
  params.push(PAGE_SIZE, (page - 1) * PAGE_SIZE);
  const r = await query(
    `SELECT p.id, p.problem_number, t.topic_name, p.curriculum_id, p.answer_type::text AS answer_type,
            p.question_text, p.answer_correct, p.answer_unit, p.explanation,
            p.explanation_structured, p.explanation_structured_status, p.explanation_structured_issues,
            p.explanation_structured_source, p.explanation_structured_at,
            (SELECT o.option_text FROM problem_options o WHERE o.problem_id = p.id AND o.is_correct LIMIT 1) AS correct_option,
            COUNT(*) OVER()::int AS total
     FROM problems p LEFT JOIN topics t ON t.id = p.topic_id
     WHERE ${where}
     ORDER BY t.topic_name NULLS LAST, p.problem_number NULLS LAST, p.id
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );
  return {
    total: r.rows[0]?.total ?? 0,
    rows: r.rows.map((x) => ({
      id: x.id,
      problemNumber: x.problem_number,
      topicName: x.topic_name,
      curriculumId: x.curriculum_id,
      answerType: x.answer_type,
      questionText: x.question_text,
      answer: finalAnswer(x),
      explanation: x.explanation,
      structured: x.explanation_structured,
      status: x.explanation_structured_status,
      issues: x.explanation_structured_issues ?? [],
      source: x.explanation_structured_source,
      updatedAt: x.explanation_structured_at ? new Date(x.explanation_structured_at).toISOString() : null,
    })),
  };
}

function finalAnswer(row: { answer_type: string; answer_correct: string | null; answer_unit: string | null; correct_option?: string | null }): string {
  if (row.answer_type === 'multiple_choice') return row.correct_option ?? row.answer_correct ?? '';
  return [row.answer_correct, row.answer_unit].filter(Boolean).join(' ');
}

interface RewriteRow {
  id: string;
  answer_type: string;
  question_text: string;
  answer_correct: string | null;
  answer_unit: string | null;
  answer_tolerance: string | null;
  answer_alternates: string[] | null;
  explanation: string;
  options: { text: string; correct: boolean }[] | null;
}

const REWRITE_SELECT = `
  SELECT p.id, p.answer_type::text AS answer_type, p.question_text, p.answer_correct, p.answer_unit,
         p.answer_tolerance, p.answer_alternates, p.explanation,
         (SELECT json_agg(json_build_object('text', o.option_text, 'correct', o.is_correct) ORDER BY o."order", o.option_letter)
            FROM problem_options o WHERE o.problem_id = p.id) AS options
  FROM problems p`;

/** The next questions with no structured explanation yet, oldest bank first. */
async function nextPending(limit: number, excludeIds: string[]): Promise<RewriteRow[]> {
  const r = await query(
    `${REWRITE_SELECT}
     WHERE p.explanation IS NOT NULL AND btrim(p.explanation) <> '' AND p.explanation_structured IS NULL
       AND NOT (p.id = ANY($2::uuid[]))
     ORDER BY p.created_at, p.problem_number NULLS LAST, p.id
     LIMIT $1`,
    [limit, excludeIds],
  );
  return r.rows;
}

async function byIds(ids: string[]): Promise<RewriteRow[]> {
  const r = await query(`${REWRITE_SELECT} WHERE p.id = ANY($1::uuid[]) AND p.explanation IS NOT NULL`, [ids]);
  return r.rows;
}

function toInputs(row: RewriteRow): { input: RewriteInput; expected: ExpectedAnswer } {
  const correct = row.options?.find((o) => o.correct)?.text;
  return {
    input: {
      questionText: row.question_text,
      finalAnswer: row.answer_type === 'multiple_choice' ? correct ?? row.answer_correct ?? '' : finalAnswer(row),
      existingExplanation: row.explanation,
      answerType: row.answer_type,
      options: row.answer_type === 'multiple_choice' ? row.options ?? undefined : undefined,
    },
    expected: {
      answerType: row.answer_type,
      answerCorrect: row.answer_correct,
      alternates: row.answer_alternates,
      tolerance: row.answer_tolerance === null ? null : Number(row.answer_tolerance),
    },
  };
}

async function save(id: string, text: string, status: StructuredStatus, issues: string[], source: 'ai' | 'manual') {
  await query(
    `UPDATE problems
     SET explanation_structured = $2, explanation_structured_status = $3, explanation_structured_issues = $4,
         explanation_structured_source = $5, explanation_structured_at = NOW()
     WHERE id = $1`,
    [id, text, status, issues, source],
  );
}

export interface RewriteResult {
  id: string;
  status: StructuredStatus | 'error';
  issues: string[];
}

async function runPool<T, R>(items: T[], concurrency: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        results[i] = await fn(items[i]);
      }
    }),
  );
  return results;
}

/**
 * Rewrites the given questions (or, with no ids, the next `limit` pending
 * ones) and stores each result. A question whose rewrite still fails the
 * checks after one retry is stored as needs_review, so it is not picked up
 * again by "Rewrite remaining"; an API error leaves it pending.
 */
export async function rewriteBatch(opts: { ids?: string[]; limit?: number; skipIds?: string[] }): Promise<RewriteResult[]> {
  const rows = opts.ids?.length ? await byIds(opts.ids) : await nextPending(Math.min(opts.limit ?? 6, 20), opts.skipIds ?? []);
  return runPool(rows, 4, async (row): Promise<RewriteResult> => {
    const { input, expected } = toInputs(row);
    try {
      const out = await rewriteExplanation(input, expected);
      const status: StructuredStatus = out.validation.ok ? 'ok' : 'needs_review';
      await save(row.id, out.text, status, out.validation.issues, 'ai');
      return { id: row.id, status, issues: out.validation.issues };
    } catch (err) {
      if (err instanceof RewriteNotConfiguredError) throw err;
      console.error('[explanations] rewrite failed', row.id, err);
      return { id: row.id, status: 'error', issues: [err instanceof Error ? err.message : String(err)] };
    }
  });
}

/**
 * An admin's own edit. It is validated like any rewrite; the admin may
 * publish it anyway (force), which marks it ok with the issues kept for reference.
 */
export async function saveManual(id: string, text: string, force: boolean): Promise<RewriteResult | null> {
  const r = await query(`${REWRITE_SELECT} WHERE p.id = $1`, [id]);
  if (!r.rows.length) return null;
  const { expected } = toInputs(r.rows[0]);
  const validation = validateExplanation(text, expected);
  const status: StructuredStatus = validation.ok || force ? 'ok' : 'needs_review';
  await save(id, text.trim(), status, validation.issues, 'manual');
  return { id, status, issues: validation.issues };
}

/** Removes the structured version; the question goes back to pending and students see the original. */
export async function clearStructured(id: string): Promise<boolean> {
  const r = await query(
    `UPDATE problems
     SET explanation_structured = NULL, explanation_structured_status = NULL, explanation_structured_issues = NULL,
         explanation_structured_source = NULL, explanation_structured_at = NULL
     WHERE id = $1`,
    [id],
  );
  return (r.rowCount ?? 0) > 0;
}
