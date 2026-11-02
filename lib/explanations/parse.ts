/**
 * Parses a structured explanation (Markdown with `### Section` headings,
 * "- " lists, `$$…$$` display maths and `$…$` inline maths) into blocks the
 * page renders. Pure, so the same parse is used by the student view, the admin
 * preview and the validator.
 */

export type Inline = { kind: 'text'; value: string } | { kind: 'math'; value: string } | { kind: 'bold'; value: string };

export type Block =
  | { kind: 'para'; inlines: Inline[] }
  | { kind: 'list'; items: Inline[][] }
  | { kind: 'math'; latex: string };

export interface Section {
  title: string;
  blocks: Block[];
}

export interface ParsedExplanation {
  /** Anything before the first heading (normally empty). */
  intro: Block[];
  sections: Section[];
}

const HEADING_RE = /^\s{0,3}#{2,4}\s+(?:\d+[.)]\s*)?(.+?)\s*#*\s*$/;
// The model sometimes writes a heading as a bold line ("**1. Given**") instead.
const BOLD_HEADING_RE = /^\s*\*\*(?:\d+[.)]\s*)?([^*]+?):?\*\*:?\s*$/;
const LIST_RE = /^\s*(?:[-*•]|\d+[.)])\s+(.*)$/;

/** True when the text is in the structured format (has at least three section headings). */
export function isStructured(text: string | null | undefined): boolean {
  if (!text) return false;
  let headings = 0;
  for (const line of text.split('\n')) if (HEADING_RE.test(line)) headings++;
  return headings >= 3;
}

/** Splits a line of text into plain text, `$…$` maths and `**bold**` runs. */
export function parseInline(text: string): Inline[] {
  const out: Inline[] = [];
  const re = /\$([^$]+)\$|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ kind: 'text', value: text.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ kind: 'math', value: m[1].trim() });
    else out.push({ kind: 'bold', value: m[2] });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ kind: 'text', value: text.slice(last) });
  return out;
}

/**
 * Pulls `$$…$$` display maths out of a run of text, which may span lines.
 * Returns alternating text and maths pieces.
 */
function splitDisplayMath(text: string): { math: boolean; value: string }[] {
  const out: { math: boolean; value: string }[] = [];
  const re = /\$\$([\s\S]+?)\$\$|\\\[([\s\S]+?)\\\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push({ math: false, value: text.slice(last, m.index) });
    out.push({ math: true, value: (m[1] ?? m[2]).trim() });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ math: false, value: text.slice(last) });
  return out;
}

/** Text with no headings → paragraphs, lists and display maths. */
export function parseBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: Inline[][] | null = null;

  const flushPara = () => {
    const joined = para.join(' ').replace(/\s+/g, ' ').trim();
    if (joined) blocks.push({ kind: 'para', inlines: parseInline(joined) });
    para = [];
  };
  const flushList = () => {
    if (list && list.length) blocks.push({ kind: 'list', items: list });
    list = null;
  };

  for (const piece of splitDisplayMath(text)) {
    if (piece.math) {
      // A display equation inside a list item ends the item but keeps the list going after it.
      flushPara();
      flushList();
      if (piece.value) blocks.push({ kind: 'math', latex: piece.value });
      continue;
    }
    for (const raw of piece.value.split('\n')) {
      const line = raw.trimEnd();
      if (!line.trim()) {
        flushPara();
        flushList();
        continue;
      }
      const item = LIST_RE.exec(line);
      if (item) {
        flushPara();
        (list ??= []).push(parseInline(item[1].trim()));
      } else if (list && /^\s{2,}\S/.test(line)) {
        // Continuation of the previous list item.
        const lastItem = list[list.length - 1];
        lastItem.push({ kind: 'text', value: ' ' }, ...parseInline(line.trim()));
      } else {
        flushList();
        para.push(line.trim());
      }
    }
  }
  flushPara();
  flushList();
  return blocks;
}

export function parseExplanation(text: string): ParsedExplanation {
  const lines = text.replace(/\r\n?/g, '\n').split('\n');
  const intro: string[] = [];
  const sections: { title: string; body: string[] }[] = [];
  for (const line of lines) {
    const h = HEADING_RE.exec(line) ?? BOLD_HEADING_RE.exec(line);
    if (h) {
      sections.push({ title: h[1].replace(/:$/, '').trim(), body: [] });
    } else if (sections.length) {
      sections[sections.length - 1].body.push(line);
    } else {
      intro.push(line);
    }
  }
  return {
    intro: parseBlocks(intro.join('\n')),
    sections: sections.map((s) => ({ title: s.title, blocks: parseBlocks(s.body.join('\n')) })),
  };
}

/** Every LaTeX expression in the text, inline and display. */
export function allMath(parsed: ParsedExplanation): { latex: string; display: boolean }[] {
  const out: { latex: string; display: boolean }[] = [];
  const fromInlines = (inl: Inline[]) => inl.forEach((i) => i.kind === 'math' && out.push({ latex: i.value, display: false }));
  const fromBlocks = (blocks: Block[]) =>
    blocks.forEach((b) => {
      if (b.kind === 'math') out.push({ latex: b.latex, display: true });
      else if (b.kind === 'para') fromInlines(b.inlines);
      else b.items.forEach(fromInlines);
    });
  fromBlocks(parsed.intro);
  parsed.sections.forEach((s) => fromBlocks(s.blocks));
  return out;
}

/**
 * Word count as a reader sees it: each LaTeX expression counts as one word,
 * headings and list markers do not count.
 */
export function countWords(text: string): number {
  const prose = text
    .replace(/\$\$[\s\S]+?\$\$/g, ' MATH ')
    .replace(/\$[^$]+\$/g, ' MATH ')
    .split('\n')
    .filter((l) => !HEADING_RE.test(l) && !BOLD_HEADING_RE.test(l))
    .join(' ')
    .replace(/^\s*[-*•]\s+/gm, ' ')
    .replace(/[*_#]/g, ' ');
  return prose.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}
