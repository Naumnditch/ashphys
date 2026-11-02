/**
 * The six-section worked-solution format an admin can write by hand on
 * /admin/explanations (Markdown with LaTeX). `parse.ts` turns it into blocks
 * for the page and `validate.ts` checks it before it is shown to students.
 */

export const SECTION_TITLES = [
  'Given',
  'Unit conversion',
  'Principle',
  'Substitution and calculation',
  'Result',
  'Common errors',
] as const;

export type SectionTitle = (typeof SECTION_TITLES)[number];

export const MAX_WORDS = 150;
