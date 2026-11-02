import { ExplanationManager } from '@/components/admin/ExplanationManager';

export const dynamic = 'force-dynamic';

export default function AdminExplanationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Question explanations</h1>
      <p className="text-gray-500 text-sm mb-6">
        Every practice question&rsquo;s explanation, rewritten as a short worked solution: Given, Unit conversion,
        Principle, Substitution and calculation, a boxed Result and Common errors, with the maths typeset in LaTeX.
        Each rewrite is checked automatically (all six sections, under 150 words, valid LaTeX, and a boxed result that
        matches the stored answer). Students see the new version only once it passes; until then they see the original.
      </p>
      <ExplanationManager />
    </div>
  );
}
