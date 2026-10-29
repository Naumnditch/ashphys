/**
 * shared_solutions reads and writes. Every query on the table runs through
 * withRlsContext, so the database itself enforces who may do what (see
 * database/seeds/2026-10-29-shared-solutions.sql):
 *   * a student inserts only their own pending row, with parental consent
 *     unless they declared 18 or over, and may only withdraw it afterwards;
 *   * admins read everything and only review (approve / reject / verify);
 *   * anyone else reads approved rows of a question they answered wrong.
 * The checks below repeat those rules first so the student gets a clear
 * message instead of a policy error.
 *
 * Lookups of problems/topics/users run as the owner (ashphys_user has no
 * grant on them), always keyed by ids the route already validated.
 */

import { query } from '@/lib/db/client';
import { withRlsContext } from '@/lib/db/rls';
import { renderSnapshots } from '@/lib/handwriting/svg';
import { isHandwritingSchemaMissing } from '@/lib/handwriting/store';
import type { HwSnapshot } from '@/lib/handwriting/types';
import { CONSENT_VERSION, consentText, defaultDisplayName, needsParentConsent, type AgeBand } from './consent';
import type { ReviewInput, ShareInput } from './validate';
import type {
  AdminSharedSolutionDTO,
  MySharedSolutionDTO,
  ShareFormDTO,
  SharedSolutionStatus,
  StudentSolutionDTO,
} from './types';

const iso = (v: unknown): string => (v instanceof Date ? v.toISOString() : String(v));
const isoOrNull = (v: unknown): string | null => (v === null || v === undefined ? null : iso(v));

/** For admins: before migration "shared_solutions" is applied. */
export const SHARED_SCHEMA_MISSING_MESSAGE =
  'Sharing solutions is not set up on this database yet (migration "shared_solutions" has not been applied).';
/** The same, as students see it. */
export const SHARING_UNAVAILABLE_MESSAGE = 'Sharing solutions isn’t available yet. Please try again later.';

const MY_COLUMNS = `id, question_id, status, verified, display_name, created_at, reviewed_at, withdrawn_at,
                    rejection_reason, stroke_count, length(btrim(steps_text)) > 0 AS has_steps`;

function toMine(r: Record<string, any>): MySharedSolutionDTO {
  return {
    id: r.id,
    questionId: r.question_id,
    status: r.status,
    verified: r.verified,
    displayName: r.display_name,
    createdAt: iso(r.created_at),
    reviewedAt: isoOrNull(r.reviewed_at),
    withdrawnAt: isoOrNull(r.withdrawn_at),
    // Only meaningful once rejected (the trigger clears it otherwise).
    rejectionReason: r.status === 'rejected' ? r.rejection_reason : null,
    strokeCount: r.stroke_count,
    hasSteps: r.has_steps,
  };
}

export type Failure = { ok: false; status: number; error: string; reason?: string };
const failure = (status: number, error: string, reason?: string): Failure => ({ ok: false, status, error, ...(reason ? { reason } : {}) });

// ------------------------------------------------------------- the student

export async function getAgeBand(userId: string): Promise<AgeBand | null> {
  const r = await query(`SELECT age_band FROM users WHERE id = $1`, [userId]);
  return r.rows[0]?.age_band ?? null;
}

/** The student's own submissions, newest first; with `questionId`, only that question's. */
export async function listMySubmissions(user: { id: string }, questionId?: string): Promise<MySharedSolutionDTO[]> {
  const rows = await withRlsContext(user, async (db) => {
    const r = await db.query(
      `SELECT ${MY_COLUMNS} FROM shared_solutions
       WHERE user_id = app_current_user_id()${questionId ? ' AND question_id = $1' : ''}
       ORDER BY created_at DESC LIMIT 200`,
      questionId ? [questionId] : []
    );
    return r.rows;
  });
  const mine = rows.map(toMine);
  if (questionId || mine.length === 0) return mine;

  const ids = Array.from(new Set(mine.map((s) => s.questionId)));
  const q = await query(
    `SELECT p.id, p.topic_id, p.problem_number, p.question_text, t.topic_name
     FROM problems p JOIN topics t ON t.id = p.topic_id WHERE p.id = ANY($1::uuid[])`,
    [ids]
  );
  const byId = new Map(q.rows.map((row) => [row.id, row]));
  return mine.map((s) => {
    const row = byId.get(s.questionId);
    return row
      ? { ...s, question: { lessonId: row.topic_id, lessonTitle: row.topic_name, number: row.problem_number, text: row.question_text } }
      : s;
  });
}

export async function getShareForm(
  user: { id: string; firstName: string | null; lastName: string | null; role: string },
  questionId: string
): Promise<ShareFormDTO> {
  const [ageBand, submissions] = await Promise.all([getAgeBand(user.id), listMySubmissions(user, questionId)]);
  return {
    displayName: defaultDisplayName(user.firstName, user.lastName),
    ageBand,
    consentVersion: CONSENT_VERSION,
    canShare: user.role === 'student',
    submissions,
  };
}

export type ShareResult = { ok: true; solution: MySharedSolutionDTO } | Failure;

/**
 * Shares the student's SAVED workspace for this question as it is right now:
 * the strokes and steps are copied into the new row (a snapshot, not a link),
 * with the display name, the consent wording and when it was given.
 */
export async function submitSharedSolution(user: { id: string; role: string }, questionId: string, input: ShareInput): Promise<ShareResult> {
  if (user.role !== 'student') return failure(403, 'Only student accounts can share solutions.');
  if (input.consentVersion !== CONSENT_VERSION) {
    return failure(409, 'The sharing terms have changed since you opened this form. Please read them again.', 'consent_changed');
  }

  // Asked once: the first answer is kept (only an admin can change it later).
  let band = await getAgeBand(user.id);
  if (!band) {
    if (!input.ageBand) return failure(400, 'Tell us whether you are under 18.', 'age_required');
    const set = await query(
      `UPDATE users SET age_band = $2, age_band_declared_at = now() WHERE id = $1 AND age_band IS NULL RETURNING age_band`,
      [user.id, input.ageBand]
    );
    band = set.rows[0]?.age_band ?? (await getAgeBand(user.id));
  }
  const withParent = needsParentConsent(band);
  if (withParent && input.parentConsent !== true) {
    return failure(400, 'As you are under 18, a parent or guardian needs to agree before you share.', 'parent_consent_required');
  }

  try {
    return await withRlsContext(user, async (db): Promise<ShareResult> => {
      const ws = await db.query(
        `SELECT doc, steps_text, stroke_count FROM student_workspaces WHERE user_id = app_current_user_id() AND question_id = $1`,
        [questionId]
      );
      const row = ws.rows[0];
      if (!row || (row.stroke_count === 0 && !row.steps_text.trim())) {
        return failure(400, 'Save some working on this question before you share it.', 'empty');
      }
      const r = await db.query(
        `INSERT INTO shared_solutions
           (question_id, user_id, display_name, strokes, snapshots, stroke_count, steps_text,
            consent_version, consent_text, consented_at, parent_consent_at)
         VALUES ($1, app_current_user_id(), $2, $3::jsonb, $4::jsonb, $5, $6, $7, $8, now(), CASE WHEN $9::boolean THEN now() END)
         RETURNING ${MY_COLUMNS}`,
        [
          questionId,
          input.displayName,
          JSON.stringify(row.doc),
          JSON.stringify(renderSnapshots(row.doc)),
          row.stroke_count,
          row.steps_text,
          CONSENT_VERSION,
          consentText(withParent),
          withParent,
        ]
      );
      return { ok: true, solution: toMine(r.rows[0]) };
    });
  } catch (err) {
    const code = (err as { code?: string })?.code;
    if (code === '23505') {
      return failure(409, 'You have already shared a solution to this question. Withdraw it first to share a new version.', 'already_shared');
    }
    if (code === '42501') return failure(403, 'Not allowed to share this solution.');
    throw err;
  }
}

/** Withdraw a pending or approved submission: it leaves every public view at once. */
export async function withdrawSharedSolution(user: { id: string }, id: string): Promise<{ ok: true; solution: MySharedSolutionDTO } | Failure> {
  return withRlsContext(user, async (db) => {
    const r = await db.query(
      `UPDATE shared_solutions SET status = 'withdrawn'
       WHERE id = $1 AND user_id = app_current_user_id() AND status IN ('pending', 'approved')
       RETURNING ${MY_COLUMNS}`,
      [id]
    );
    if (r.rows[0]) return { ok: true as const, solution: toMine(r.rows[0]) };
    const cur = await db.query(`SELECT status FROM shared_solutions WHERE id = $1 AND user_id = app_current_user_id()`, [id]);
    const status: SharedSolutionStatus | undefined = cur.rows[0]?.status;
    if (!status) return failure(404, 'Not found');
    return failure(
      409,
      status === 'withdrawn' ? 'You already withdrew this solution.' : 'This solution was not approved, so it is not shown anywhere.'
    );
  });
}

// ------------------------------------------------------ what others see

/**
 * Approved student solutions to a question, read under row-level security as
 * the viewer (the policy only shows them to admins, their authors and
 * students who answered the question wrong). Content only when asked for,
 * i.e. after the solutions gate let the viewer in. Verified ones first.
 * Before the migration there are simply none.
 */
export async function readApprovedSolutionsAs(
  viewer: { id: string },
  questionId: string,
  withContent: boolean
): Promise<{ count: number; solutions: StudentSolutionDTO[] }> {
  try {
    return await withRlsContext(viewer, async (db) => {
      const r = await db.query(
        `SELECT id, display_name, verified, reviewed_at${withContent ? ', snapshots, steps_text' : ''}
         FROM shared_solutions
         WHERE question_id = $1 AND status = 'approved'
         ORDER BY verified DESC, reviewed_at ASC NULLS LAST, created_at ASC
         LIMIT 20`,
        [questionId]
      );
      return {
        count: r.rows.length,
        solutions: withContent
          ? r.rows.map((row) => ({
              id: row.id,
              displayName: row.display_name,
              verified: row.verified,
              approvedAt: isoOrNull(row.reviewed_at),
              pages: row.snapshots as HwSnapshot[],
              stepsText: row.steps_text,
            }))
          : [],
      };
    });
  } catch (err) {
    if (isHandwritingSchemaMissing(err)) return { count: 0, solutions: [] };
    throw err;
  }
}

// ------------------------------------------------------------- admin review

export type ReviewFilter = SharedSolutionStatus | 'all';

/** The review queue: pending oldest first; other filters newest first. */
export async function listForReview(admin: { id: string }, filter: ReviewFilter, limit = 30): Promise<AdminSharedSolutionDTO[]> {
  const rows = await withRlsContext(admin, async (db) => {
    const r = await db.query(
      `SELECT id, question_id, user_id, status, verified, display_name, created_at, reviewed_at, reviewed_by, verified_at,
              withdrawn_at, rejection_reason, consent_version, consent_text, consented_at, parent_consent_at, snapshots, steps_text
       FROM shared_solutions
       ${filter === 'all' ? '' : 'WHERE status = $2'}
       ORDER BY created_at ${filter === 'pending' ? 'ASC' : 'DESC'}
       LIMIT $1`,
      filter === 'all' ? [limit] : [limit, filter]
    );
    return r.rows;
  });
  if (rows.length === 0) return [];

  const questionIds = Array.from(new Set(rows.map((r) => r.question_id)));
  const userIds = Array.from(new Set(rows.flatMap((r) => [r.user_id, r.reviewed_by].filter(Boolean))));
  const [questions, users, teacher] = await Promise.all([
    query(
      `SELECT p.id, p.topic_id, p.problem_number, p.question_text, p.question_image_url, p.explanation,
              p.answer_type, p.answer_correct, p.answer_unit, t.topic_name,
              (SELECT o.option_text FROM problem_options o WHERE o.problem_id = p.id AND o.is_correct LIMIT 1) AS correct_option
       FROM problems p JOIN topics t ON t.id = p.topic_id WHERE p.id = ANY($1::uuid[])`,
      [questionIds]
    ),
    query(`SELECT id, first_name, last_name, email, age_band FROM users WHERE id = ANY($1::uuid[])`, [userIds]),
    withRlsContext(admin, (db) =>
      db.query(`SELECT question_id, snapshots FROM question_handwriting WHERE question_id = ANY($1::uuid[]) AND stroke_count > 0`, [questionIds])
    ).catch((err) => {
      if (isHandwritingSchemaMissing(err)) return { rows: [] as Record<string, any>[] };
      throw err;
    }),
  ]);
  const qById = new Map(questions.rows.map((q) => [q.id, q]));
  const uById = new Map(users.rows.map((u) => [u.id, u]));
  const teacherById = new Map(teacher.rows.map((t) => [t.question_id, t.snapshots as HwSnapshot[]]));
  const nameOf = (u: Record<string, any> | undefined) => (u ? [u.first_name, u.last_name].filter(Boolean).join(' ') || u.email : '');

  return rows.map((r): AdminSharedSolutionDTO => {
    const q = qById.get(r.question_id) ?? {};
    const u = uById.get(r.user_id);
    const answer =
      q.answer_type === 'multiple_choice' && q.correct_option
        ? q.correct_option
        : q.answer_correct
          ? `${q.answer_correct}${q.answer_unit ? ` ${q.answer_unit}` : ''}`
          : null;
    return {
      id: r.id,
      status: r.status,
      verified: r.verified,
      displayName: r.display_name,
      createdAt: iso(r.created_at),
      reviewedAt: isoOrNull(r.reviewed_at),
      reviewedBy: r.reviewed_by ? nameOf(uById.get(r.reviewed_by)) || null : null,
      verifiedAt: isoOrNull(r.verified_at),
      withdrawnAt: isoOrNull(r.withdrawn_at),
      rejectionReason: r.rejection_reason,
      consentVersion: r.consent_version,
      consentText: r.consent_text,
      consentedAt: iso(r.consented_at),
      parentConsentAt: isoOrNull(r.parent_consent_at),
      pages: r.snapshots,
      stepsText: r.steps_text,
      student: { id: r.user_id, name: nameOf(u), email: u?.email ?? '', ageBand: u?.age_band ?? null },
      question: {
        id: r.question_id,
        lessonId: q.topic_id ?? '',
        lessonTitle: q.topic_name ?? '',
        number: q.problem_number ?? null,
        text: q.question_text ?? '',
        imageUrl: q.question_image_url ?? null,
        answer,
        explanation: q.explanation ?? null,
      },
      teacherPages: teacherById.get(r.question_id) ?? [],
    };
  });
}

export interface ReviewedState {
  id: string;
  status: SharedSolutionStatus;
  verified: boolean;
  rejectionReason: string | null;
  reviewedAt: string | null;
  verifiedAt: string | null;
}

/** Approve, reject (optional reason, shown to the student) or (un)mark as verified against the mark scheme. */
export async function reviewSharedSolution(admin: { id: string }, id: string, input: ReviewInput): Promise<{ ok: true; solution: ReviewedState } | Failure> {
  const [set, params]: [string, unknown[]] =
    input.action === 'approve'
      ? [`status = 'approved'`, []]
      : input.action === 'reject'
        ? [`status = 'rejected', rejection_reason = $2`, [input.reason]]
        : [`verified = ${input.action === 'verify' ? 'true' : 'false'}`, []];
  try {
    return await withRlsContext(admin, async (db) => {
      const r = await db.query(
        `UPDATE shared_solutions SET ${set} WHERE id = $1
         RETURNING id, status, verified, rejection_reason, reviewed_at, verified_at`,
        [id, ...params]
      );
      const row = r.rows[0];
      if (row) {
        return {
          ok: true as const,
          solution: {
            id: row.id,
            status: row.status,
            verified: row.verified,
            rejectionReason: row.rejection_reason,
            reviewedAt: isoOrNull(row.reviewed_at),
            verifiedAt: isoOrNull(row.verified_at),
          },
        };
      }
      const cur = await db.query(`SELECT status FROM shared_solutions WHERE id = $1`, [id]);
      if (cur.rows[0]?.status === 'withdrawn') return failure(409, 'The student withdrew this solution, so it can no longer be reviewed.', 'withdrawn');
      return failure(404, 'Not found');
    });
  } catch (err) {
    if ((err as { code?: string })?.code === '42501') return failure(403, 'Not authorized');
    throw err;
  }
}

/** For the admin sidebar badge. 0 before the migration. */
export async function countPendingSharedSolutions(): Promise<number> {
  try {
    const r = await query(`SELECT COUNT(*) AS n FROM shared_solutions WHERE status = 'pending'`);
    return Number(r.rows[0].n);
  } catch (err) {
    if (isHandwritingSchemaMissing(err)) return 0;
    throw err;
  }
}
