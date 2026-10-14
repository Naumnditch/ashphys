/**
 * Plan tier levels (subscription_plans.tier_level) and their names. No
 * server imports, so client components can use them; getUserTier.ts
 * re-exports these for existing callers.
 */

export const TIER_FREE = 0;
export const TIER_PLUS = 1;
export const TIER_PRO = 2;

export function tierName(tier: number): string {
  if (tier >= TIER_PRO) return 'Pro';
  if (tier >= TIER_PLUS) return 'Plus';
  return 'Free';
}
