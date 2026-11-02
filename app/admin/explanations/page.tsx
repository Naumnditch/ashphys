import { ExplanationManager } from '@/components/admin/ExplanationManager';

export const dynamic = 'force-dynamic';

export default function AdminExplanationsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Question explanations</h1>
      <p className="text-gray-500 text-sm mb-6">
        Every explanation is shown to students with its equations converted to LaTeX automatically, at no cost. Here
        you can also write a question&rsquo;s explanation by hand as a full worked solution (Given, Unit conversion,
        Principle, Substitution and calculation, a boxed Result and Common errors). A hand-written version is checked
        (all six sections, under 150 words, valid LaTeX, a boxed result that matches the stored answer) and replaces
        the original for students once it passes.
      </p>
      <ExplanationManager />
    </div>
  );
}
