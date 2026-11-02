'use client';

import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { isStructured, parseExplanation, type Block, type Inline } from '@/lib/explanations/parse';

/**
 * Shows a question's explanation. Structured explanations (### Given …
 * ### Common errors, with LaTeX) are typeset as a numbered worked solution;
 * anything else is shown as the plain paragraph it always was.
 */

function tex(latex: string, displayMode: boolean): string {
  return katex.renderToString(latex, { displayMode, throwOnError: false, output: 'htmlAndMathml', strict: 'ignore' });
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

  if (!parsed) return <p className={`text-sm leading-relaxed text-gray-700 ${className}`}>{text}</p>;

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
