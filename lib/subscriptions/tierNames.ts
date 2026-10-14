/**
 * Tier levels and their names, with no database import, so client
 * components can label locked content. `getUserTier.ts` re-exports these.
 */

export const TIER_FREE = 0;
export const TIER_PLUS = 1;
export const TIER_PRO = 2;

export function tierName(tier: number): string {
  if (tier >= TIER_PRO) return 'Pro';
  if (tier >= TIER_PLUS) return 'Plus';
  return 'Free';
}
