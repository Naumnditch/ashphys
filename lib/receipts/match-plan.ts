/**
 * Matches a detected receipt amount to one of the paid plans/billing
 * cycles in `subscription_plans`, within a tolerance that absorbs bank
 * fees and OCR rounding without being loose enough to confuse tiers.
 *
 * Tolerance is the larger of 2% of the price or 15 TRY — a wire transfer
 * fee or a receipt that rounds to the nearest lira should never bump a
 * student to the wrong tier, but a receipt for last month's cheaper plan
 * should also never accidentally match this month's price.
 */

export interface PlanRow {
  id: string;
  name: string;
  tier_level: number;
  price_monthly: string | number | null;
  price_quarterly: string | number | null;
  price_yearly: string | number | null;
}

export interface PlanMatch {
  planId: string;
  planName: string;
  months: number;
  billingCycle: 'monthly' | 'quarterly' | 'yearly';
  expectedPrice: number;
  difference: number;
}

const CYCLES: { key: 'price_monthly' | 'price_quarterly' | 'price_yearly'; months: number; cycle: PlanMatch['billingCycle'] }[] = [
  { key: 'price_monthly', months: 1, cycle: 'monthly' },
  { key: 'price_quarterly', months: 3, cycle: 'quarterly' },
  { key: 'price_yearly', months: 12, cycle: 'yearly' },
];

function tolerance(price: number): number {
  return Math.max(price * 0.02, 15);
}

/**
 * Finds the closest paid-plan price point to `amount`. Returns null if
 * nothing is within tolerance (e.g. amount is way off, or currency isn't
 * TRY), so the caller falls back to manual review instead of guessing.
 */
export function matchPlanForAmount(amount: number, currency: string | null, plans: PlanRow[]): PlanMatch | null {
  if (currency && currency !== 'TRY') return null;
  if (!Number.isFinite(amount) || amount <= 0) return null;

  let best: PlanMatch | null = null;

  for (const plan of plans) {
    if (plan.tier_level <= 0) continue; // never auto-match the Free plan
    for (const { key, months, cycle } of CYCLES) {
      const raw = plan[key];
      const price = raw === null || raw === undefined ? NaN : parseFloat(String(raw));
      if (!Number.isFinite(price) || price <= 0) continue;

      const diff = Math.abs(amount - price);
      if (diff > tolerance(price)) continue;

      if (!best || diff < best.difference) {
        best = { planId: plan.id, planName: plan.name, months, billingCycle: cycle, expectedPrice: price, difference: diff };
      }
    }
  }

  return best;
}
