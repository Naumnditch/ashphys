/**
 * The house style for question explanations: a short worked solution in six
 * sections, written in Markdown with LaTeX. `buildRewritePrompt` is the
 * instruction the rewrite tool sends for each question; `parse.ts` turns the
 * result into blocks for the page and `validate.ts` checks it before it is
 * shown to students.
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

export interface RewriteInput {
  questionText: string;
  /** For numeric questions the value and unit; for MCQs the correct option's text. */
  finalAnswer: string;
  existingExplanation: string;
  answerType: string;
  /** MCQ options in order, marked with the correct one. */
  options?: { text: string; correct: boolean }[];
}

/** The owner's instruction, word for word, with the three placeholders filled. */
const STYLE_INSTRUCTION = `Rewrite the explanation below as a professional, concise worked solution. Write every mathematical expression in LaTeX: inline expressions in $...$ and display equations in $$...$$. Use proper units with \\text{} (for example, $\\text{N}$, $\\mu\\text{C}$, $\\text{m}^2$).

Structure the explanation as follows:
1. Given: List each known quantity with its symbol and SI-unit value.
2. Unit conversion: Show each conversion needed before substitution (for example, $1\\ \\mu\\text{C} = 1.00 \\times 10^{-6}\\ \\text{C}$).
3. Principle: State the governing equation and define its constants.
4. Substitution and calculation: Show the substituted expression and each arithmetic step.
5. Result: Give the final answer with units and appropriate significant figures, using $\\boxed{...}$.
6. Common errors: Note one or two likely mistakes, such as leaving distances in centimetres or forgetting to square a term.

Style: Use a formal, neutral tone. Avoid exclamation marks, filler phrases, and restating the question. Keep the explanation under 150 words.`;

const OUTPUT_RULES = `Output format (the website parses this exactly):
- Reply with the worked solution only, in Markdown: no preamble, no closing remarks, no code fences.
- Use exactly these six headings, in this order, each on its own line: ${SECTION_TITLES.map((t) => `"### ${t}"`).join(', ')}.
- Write lists with "- ". Put each display equation on its own line, wrapped in $$...$$.
- When a section does not apply (for example a conceptual question with nothing to convert or calculate), write one short sentence saying so, such as "No conversion is needed." Keep the heading.
- For a multiple-choice question, the boxed result is the correct option, stated briefly.
- The boxed result must agree with the final answer given above. Keep every number from the existing explanation; do not recompute the answer to a different value.
- Do not use exclamation marks, even inside LaTeX. Do not use the dollar sign for anything except LaTeX.`;

export function buildRewritePrompt(input: RewriteInput): string {
  const options =
    input.options && input.options.length
      ? `\nOptions (the correct one is marked):\n${input.options
          .map((o, i) => `${String.fromCharCode(65 + i)}. ${o.text}${o.correct ? '  [correct]' : ''}`)
          .join('\n')}`
      : '';
  return `${STYLE_INSTRUCTION}

Question: ${input.questionText.trim()}${options}
Final answer: ${input.finalAnswer.trim()}
Existing explanation: ${input.existingExplanation.trim()}

${OUTPUT_RULES}`;
}
