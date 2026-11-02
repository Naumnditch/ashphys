'use client';

import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { isStructured, parseExplanation, type Block, type Inline } from '@/lib/explanations/parse';
import { segmentMath, type Segment } from '@/lib/explanations/autoLatex';

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

type Line = { eq: boolean; parts: Segment[] };

/**
 * Lays a plain explanation out line by line: every equation (anything with an
 * "=") on its own line, and the prose between split into sentences, one per
 * line. Leftover punctuation ("." or ", so") joins the line it belongs to.
 */
export function toLines(segments: Segment[]): Line[] {
  const lines: Line[] = [];
  const addText = (text: string) => {
    let t = text;
    // Punctuation straight after an equation stays on the equation's line.
    const lead = /^[\s.,;:)]+/.exec(t);
    if (lead && lines.length) {
      const p = lead[0].trim();
      if (p) lines[lines.length - 1].parts.push({ math: false, text: p });
      t = t.slice(lead[0].length);
    }
    for (const sentence of t.split(/(?<=[.!?])\s+(?=[A-Z(“"‘])/)) {
      if (!sentence.trim()) continue;
      const last = lines[lines.length - 1];
      // Continue an open prose line (the sentence carried on past inline maths).
      if (last && !last.eq && !/[.!?:)]\s*$/.test(partsText(last))) last.parts.push({ math: false, text: sentence });
      else lines.push({ eq: false, parts: [{ math: false, text: sentence.trimStart() }] });
    }
  };
  for (const seg of segments) {
    if (!seg.math) addText(seg.text);
    else if (/=|\\approx|\\propto/.test(seg.latex)) lines.push({ eq: true, parts: [seg] });
    else {
      const last = lines[lines.length - 1];
      if (last && !last.eq) last.parts.push(seg);
      else lines.push({ eq: false, parts: [seg] });
    }
  }
  return lines;
}

function partsText(l: Line): string {
  return l.parts.map((p) => (p.math ? p.source : p.text)).join('');
}

function Parts({ parts }: { parts: Segment[] }) {
  return (
    <>
      {parts.map((s, i) => {
        if (!s.math) return <span key={i}>{s.text}</span>;
        const html = texOrNull(s.latex);
        return html ? <span key={i} dangerouslySetInnerHTML={{ __html: html }} /> : <span key={i}>{s.source}</span>;
      })}
    </>
  );
}

/** A plain-text explanation with its equations typeset as LaTeX, one line each. */
function AutoMath({ text, className }: { text: string; className: string }) {
  const lines = useMemo(() => toLines(segmentMath(text)), [text]);
  return (
    <div className={`space-y-1 text-sm leading-relaxed text-gray-700 ${className}`}>
      {lines.map((l, i) =>
        l.eq ? (
          <div key={i} className="overflow-x-auto overflow-y-hidden py-0.5 pl-3 text-[15px] text-gray-900">
            <Parts parts={l.parts} />
          </div>
        ) : (
          <p key={i}>
            <Parts parts={l.parts} />
          </p>
        ),
      )}
    </div>
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
