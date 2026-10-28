/**
 * Gating for the interactive solutions catalog: Free and Plus get a
 * lifetime cap on how many *distinct* solutions they may fully open (a
 * solution already unlocked can be revisited for free); Pro is unlimited.
 * A solution can also carry its own tier floor (tier_required), which
 * blocks regardless of remaining views.
 *
 * Handwritten worked solutions on practice questions (2026-10-28) go
 * through the same gate and the same view budget: their target is the
 * question (`{ problemId }`), logged in solution_access_log.problem_id.
 */

import { query } from '@/lib/db/client';
import { tierRequiredRank, viewLimitFor } from './limits';
import type { AccessReason, SolutionAccessDTO } from './types';

export type AccessLogAction = 'view_preview' | 'view_full' | 'blocked' | 'attempted_upgrade';

/** What a view is spent on: a catalog solution (its id) or a practice question's handwritten solution. */
export type SolutionTarget = string | { problemId: string };

function targetColumn(target: SolutionTarget): ['solution_id' | 'problem_id', string] {
  return typeof target === 'string' ? ['solution_id', target] : ['problem_id', target.problemId];
}

export async function hasUnlocked(userId: string, target: SolutionTarget): Promise<boolean> {
  const [column, id] = targetColumn(target);
  const r = await query(`SELECT 1 FROM solution_access_log WHERE user_id = $1 AND ${column} = $2 AND action = 'view_full' LIMIT 1`, [
    userId,
    id,
  ]);
  return r.rows.length > 0;
}

async function currentViewsUsed(userId: string): Promise<number> {
  const r = await query(`SELECT views_count FROM user_solution_views WHERE user_id = $1`, [userId]);
  return r.rows[0]?.views_count ?? 0;
}

/** Read-only status for the catalog page (no logging, no side effects). */
export async function getViewStatus(userId: string, tier: number): Promise<{ viewsUsed: number; viewLimit: number | null }> {
  return { viewsUsed: await currentViewsUsed(userId), viewLimit: viewLimitFor(tier) };
}

/**
 * Atomically spends one of the user's remaining views for a solution they
 * have not unlocked before. Guarded in the UPDATE's WHERE clause so two
 * concurrent requests can't both squeeze through at the last slot.
 * Returns true if a view was spent (or none was needed because the cap is
 * unlimited); false if the cap was already reached.
 */
async function spendView(userId: string, viewLimit: number | null): Promise<boolean> {
  if (viewLimit === null) {
    await query(
      `INSERT INTO user_solution_views (user_id, views_count, last_view_at, first_view_at)
       VALUES ($1, 1, now(), now())
       ON CONFLICT (user_id) DO UPDATE SET views_count = user_solution_views.views_count + 1, last_view_at = now(), updated_at = now()`,
      [userId]
    );
    return true;
  }
  const r = await query(
    `INSERT INTO user_solution_views (user_id, views_count, last_view_at, first_view_at)
     VALUES ($1, 1, now(), now())
     ON CONFLICT (user_id) DO UPDATE SET views_count = user_solution_views.views_count + 1, last_view_at = now(), updated_at = now()
     WHERE user_solution_views.views_count < $2
     RETURNING views_count`,
    [userId, viewLimit]
  );
  return r.rows.length > 0;
}

/**
 * The single gate a solution's detail route runs through: decides access,
 * logs the outcome, and — for a genuinely new unlock — spends a view. Call
 * this once per request; it is not idempotent (each call may log/spend).
 */
export async function resolveSolutionAccess(
  userId: string,
  tier: number,
  target: SolutionTarget,
  solutionTierRequired: string
): Promise<SolutionAccessDTO> {
  const viewLimit = viewLimitFor(tier);

  if (tier < tierRequiredRank(solutionTierRequired)) {
    const viewsUsed = await currentViewsUsed(userId);
    await logAccess(userId, target, 'blocked');
    return { allowed: false, reason: 'tier_required', viewsUsed, viewLimit };
  }

  if (await hasUnlocked(userId, target)) {
    const viewsUsed = await currentViewsUsed(userId);
    await logAccess(userId, target, 'view_full');
    return { allowed: true, reason: 'ok', viewsUsed, viewLimit };
  }

  const spent = await spendView(userId, viewLimit);
  const viewsUsed = await currentViewsUsed(userId);
  if (!spent) {
    await logAccess(userId, target, 'blocked');
    return { allowed: false, reason: 'limit_reached', viewsUsed, viewLimit };
  }
  await logAccess(userId, target, 'view_full');
  return { allowed: true, reason: 'ok', viewsUsed, viewLimit };
}

export async function logAccess(userId: string, target: SolutionTarget, action: AccessLogAction): Promise<void> {
  const [column, id] = targetColumn(target);
  await query(`INSERT INTO solution_access_log (user_id, ${column}, action) VALUES ($1, $2, $3)`, [userId, id, action]);
}

export function accessReasonMessage(reason: AccessReason): string {
  switch (reason) {
    case 'sign_in_required':
      return 'Sign in to view this solution.';
    case 'tier_required':
      return 'This solution needs a higher plan.';
    case 'limit_reached':
      return "You've used all your free solution views. Upgrade to see more.";
    default:
      return '';
  }
}
