'use client';

/**
 * Read-only maths for answers and feedback, typeset with KaTeX (already
 * used for explanations, and it renders on the server too).
 *
 *   <MathDisplay latex="3\times10^{8}" />          a student's typed answer
 *   <QuantityDisplay text="2.5e7 m/s²" />          an answer-key label
 *
 * KaTeX emits MathML alongside the HTML, so screen readers get the maths.
 * Anything KaTeX cannot parse is shown as the original text.
 */

import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { looksLikeLatex } from '@/lib/math/latexToGradable';
import { quantityToLatex } from '@/lib/math/quantityLatex';

function render(latex: string): string | null {
  try {
    return katex.renderToString(latex, { displayMode: false, throwOnError: true, output: 'htmlAndMathml', strict: 'ignore' });
  } catch {
    return null;
  }
}

export function MathDisplay({ latex, className = '' }: { latex: string; className?: string }) {
  const html = useMemo(() => render(latex), [latex]);
  if (!html) return <span className={className}>{latex}</span>;
  return <span className={`math-display ${className}`} dangerouslySetInnerHTML={{ __html: html }} />;
}

/** A student's raw answer: LaTeX from the maths box, or plain text from older answers. */
export function AnswerDisplay({ answer, className = '' }: { answer: string; className?: string }) {
  if (!answer) return null;
  // Plain text is typeset only when every ^ or _ has a single character after
  // it (x^2, v_0): KaTeX would otherwise raise just the "-" of 10^-6.
  const simpleScripts = /[\^_]/.test(answer) && !/[\^_](?![A-Za-z0-9](?![A-Za-z0-9]))/.test(answer);
  if (looksLikeLatex(answer) || simpleScripts) return <MathDisplay latex={answer} className={className} />;
  return <span className={className}>{answer}</span>;
}

/** An answer-key label such as "2.5e7 m/s" or "3.0 × 10⁸ N", typeset as a teacher would write it. */
export function QuantityDisplay({ text, className = '' }: { text: string; className?: string }) {
  const latex = useMemo(() => quantityToLatex(text), [text]);
  // Not a number-and-unit (a text answer such as x^2): show it as an answer.
  if (!latex) return <AnswerDisplay answer={text} className={className} />;
  return <MathDisplay latex={latex} className={className} />;
}
