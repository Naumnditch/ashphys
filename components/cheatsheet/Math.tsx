import katex from 'katex';

/**
 * KaTeX, rendered on the server: the sheet ships typeset HTML and only the
 * KaTeX stylesheet and fonts, no math JavaScript. `throwOnError: false` shows a
 * bad expression in red instead of breaking the page.
 */
function render(latex: string, displayMode: boolean) {
  return katex.renderToString(latex, { displayMode, throwOnError: false, output: 'htmlAndMathml', strict: 'ignore' });
}

/** A display equation that scrolls inside its own box rather than overflowing the page. */
export function MathBlock({ latex, label }: { latex: string; label?: string }) {
  return (
    <div
      className="cs-math-block"
      role={label ? 'group' : undefined}
      aria-label={label}
      dangerouslySetInnerHTML={{ __html: render(latex, true) }}
    />
  );
}

export function InlineMath({ latex }: { latex: string }) {
  return <span dangerouslySetInnerHTML={{ __html: render(latex, false) }} />;
}

/** Splits text on `$…$` and typesets the maths parts inline. */
export function splitMath(text: string): { math: boolean; value: string }[] {
  const parts: { math: boolean; value: string }[] = [];
  const re = /\$([^$]+)\$/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push({ math: false, value: text.slice(last, m.index) });
    parts.push({ math: true, value: m[1] });
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push({ math: false, value: text.slice(last) });
  return parts;
}

export function MathText({ text }: { text: string }) {
  return <>{splitMath(text).map((p, i) => (p.math ? <InlineMath key={i} latex={p.value} /> : <span key={i}>{p.value}</span>))}</>;
}
