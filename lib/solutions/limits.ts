import { TIER_FREE, TIER_PLUS, TIER_PRO } from '@/lib/subscriptions/getUserTier';
import type { SolutionTier } from './types';

/** Lifetime cap on distinct fully-viewed solutions. null = unlimited. */
const VIEW_LIMIT_BY_TIER: Record<number, number | null> = {
  [TIER_FREE]: 2,
  [TIER_PLUS]: 5,
  [TIER_PRO]: null,
};

export function viewLimitFor(tier: number): number | null {
  if (tier >= TIER_PRO) return VIEW_LIMIT_BY_TIER[TIER_PRO];
  if (tier >= TIER_PLUS) return VIEW_LIMIT_BY_TIER[TIER_PLUS];
  return VIEW_LIMIT_BY_TIER[TIER_FREE];
}

const TIER_RANK: Record<SolutionTier, number> = { free: TIER_FREE, plus: TIER_PLUS, pro: TIER_PRO };

export function tierRequiredRank(tierRequired: string): number {
  return TIER_RANK[tierRequired as SolutionTier] ?? TIER_FREE;
}

export function solutionTierName(tierRequired: string): string {
  if (tierRequired === 'pro') return 'Pro';
  if (tierRequired === 'plus') return 'Plus';
  return 'Free';
}
