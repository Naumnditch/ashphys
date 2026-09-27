const DIFFICULTY_STYLE: Record<string, string> = {
  basic: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-blue-100 text-blue-700',
  advanced: 'bg-rose-100 text-rose-700',
};

export function DifficultyBadge({ difficulty }: { difficulty: string }) {
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${DIFFICULTY_STYLE[difficulty] || 'bg-gray-100 text-gray-600'}`}>
      {difficulty}
    </span>
  );
}

const TIER_STYLE: Record<string, string> = {
  free: 'bg-gray-100 text-gray-500',
  plus: 'bg-violet-100 text-violet-700',
  pro: 'bg-amber-100 text-amber-800',
};

export function TierBadge({ tier }: { tier: string }) {
  if (tier === 'free') return null;
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${TIER_STYLE[tier] || 'bg-gray-100 text-gray-500'}`}>
      {tier} only
    </span>
  );
}
