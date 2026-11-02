'use client';

import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { isStructured, parseExplanation, type Block, type Inline } from '@/lib/explanations/parse';
import { segmentMath } from '@/lib/explanations/autoLatex';

/**
 * Shows a question's explanation. Structured explanations (### Given …
 * ### Common errors, with LaTeX) are typeset as a numbered worked solution;
 * anything else is shown as the same paragraph, with its equations converted
 * to LaTeX and typeset (lib/explanations/autoLatex.ts).
 */

function tex(latex: string, displayMode: boolean): string {
  return katex.renderToString(latex, { displayMode, throwOnError: false, output: 'htmlAndMathml', strict: 'ignore' });
}

/** Typesets an equation, or returns null when KaTeX cannot parse it (the text is shown instead). */
function texOrNull(latex: string): string | null {
  try {
    return katex.renderToString(latex, { displayMode: false, throwOnError: true, output: 'htmlAndMathml', strict: 'ignore' });
  } catch {
    return null;
  }
}

/** A plain-text explanation with its equations found and typeset as LaTeX. */
function AutoMath({ text, className }: { text: string; className: string }) {
  const segments = useMemo(() => segmentMath(text), [text]);
  return (
    <p className={`text-sm leading-relaxed text-gray-700 ${className}`}>
      {segments.map((s, i) => {
        if (!s.math) return <span key={i}>{s.text}</span>;
        const html = texOrNull(s.latex);
        return html ? <span key={i} dangerouslySetInnerHTML={{ __html: html }} /> : <span key={i}>{s.source}</span>;
      })}
    </p>
  );
}

function Inlines({ items }: { items: Inline[] }) {
  return (
    <>
      {items.map((i, k) =>
        i.kind === 'math' ? (
          <span key={k} dangerouslySetInnerHTML={{ __html: tex(i.value, false) }} />
        ) : i.kind === 'bold' ? (
          <strong key={k} className="font-semibold">
            {i.value}
          </strong>
        ) : (
          <span key={k}>{i.value}</span>
        ),
      )}
    </>
  );
}

function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, k) =>
        b.kind === 'math' ? (
          <div
            key={k}
            className="my-1.5 overflow-x-auto overflow-y-hidden py-0.5"
            dangerouslySetInnerHTML={{ __html: tex(b.latex, true) }}
          />
        ) : b.kind === 'list' ? (
          <ul key={k} className="my-1 list-disc space-y-0.5 pl-5">
            {b.items.map((item, j) => (
              <li key={j}>
                <Inlines items={item} />
              </li>
            ))}
          </ul>
        ) : (
          <p key={k} className="my-1">
            <Inlines items={b.inlines} />
          </p>
        ),
      )}
    </>
  );
}

export function ExplanationView({
  text,
  format,
  className = '',
}: {
  text: string;
  /** From the API; when absent the text is sniffed. */
  format?: 'structured' | 'plain';
  className?: string;
}) {
  const structured = format ? format === 'structured' : isStructured(text);
  const parsed = useMemo(() => (structured ? parseExplanation(text) : null), [structured, text]);

  if (!parsed) return <AutoMath text={text} className={className} />;

  return (
    <div className={`text-sm leading-relaxed text-gray-800 ${className}`} aria-label="Worked solution">
      {parsed.intro.length > 0 && <Blocks blocks={parsed.intro} />}
      <ol className="space-y-2.5">
        {parsed.sections.map((s, i) => {
          const isResult = /^result$/i.test(s.title.trim());
          return (
            <li key={i} className={isResult ? 'rounded-lg border border-gray-200 bg-white/70 px-3 py-2' : ''}>
              <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {i + 1}. {s.title}
              </h4>
              <div className="min-w-0">
                <Blocks blocks={s.blocks} />
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
