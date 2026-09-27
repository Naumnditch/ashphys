/**
 * Shared subscription-granting logic.
 *
 * Every path that puts a student on a paid tier — the admin's manual grant
 * form, approving a receipt by hand, and now the automatic receipt-amount
 * matcher — must agree on exactly how a grant is recorded. Centralizing it
 * here means a change to the renewal math (extend, don't replace) only
 * has to happen once.
 */

import { query } from '@/lib/db/client';
import { billingCycleForMonths } from '@/lib/billing';

export interface GrantResult {
  studentId: string;
  planId: string;
  planName: string;
  tier: string;
  months: number;
  endDate: string;
}

/**
 * Grants (or extends) a student's subscription to the given plan for the
 * given number of months, and records the grant for audit purposes.
 *
 * `grantedBy` is the admin's user id for a manual grant, or `null` for an
 * automatic grant made by the receipt matcher (no human reviewed it yet).
 */
export async function grantSubscription(params: {
  studentId: string;
  planId: string;
  months: number;
  reference: string | null;
  grantedBy: string | null;
}): Promise<GrantResult> {
  const { studentId, planId, months, reference, grantedBy } = params;

  const planRes = await query(
    `SELECT id, name, tier_level FROM subscription_plans WHERE id = $1`,
    [planId]
  );
  if (planRes.rows.length === 0) throw new Error('Unknown plan');
  const plan = planRes.rows[0];
  const tier = plan.tier_level > 0 ? 'premium' : 'free';

  await query(
    `INSERT INTO subscriptions (student_id, plan_id, tier, status, billing_cycle, start_date, end_date)
     VALUES ($1, $2, $3::subscription_tier, 'active'::subscription_status, $4, now(), now() + ($5 || ' months')::interval)
     ON CONFLICT (student_id) DO UPDATE SET
       plan_id = EXCLUDED.plan_id,
       tier = EXCLUDED.tier,
       status = 'active'::subscription_status,
       billing_cycle = EXCLUDED.billing_cycle,
       end_date = GREATEST(COALESCE(subscriptions.end_date, now()), now()) + ($5 || ' months')::interval,
       updated_at = now()`,
    [studentId, planId, tier, billingCycleForMonths(months), months]
  );

  await query(
    `INSERT INTO access_grants (student_id, plan_id, months, reference, granted_by) VALUES ($1, $2, $3, $4, $5)`,
    [studentId, planId, months, reference, grantedBy]
  );

  const after = await query(
    `SELECT s.end_date FROM subscriptions s WHERE s.student_id = $1`,
    [studentId]
  );

  return {
    studentId,
    planId: plan.id,
    planName: plan.name,
    tier,
    months,
    endDate: after.rows[0]?.end_date,
  };
}

/** Sets a student straight to Free / expired, regardless of how they got their current tier. */
export async function revokeSubscription(studentId: string): Promise<void> {
  await query(
    `UPDATE subscriptions SET status = 'expired'::subscription_status, tier = 'free'::subscription_tier, updated_at = now()
     WHERE student_id = $1`,
    [studentId]
  );
}
