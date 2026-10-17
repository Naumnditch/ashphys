/**
 * The shape of a revision cheat sheet. Sheets are content, not code: each one
 * is a data file in `lib/cheatsheets/sheets/`, registered in `./index.ts`, and
 * rendered by `components/cheatsheet/`. Nothing lesson-specific lives in the
 * components.
 *
 * Cheat sheets are per curriculum (a shared lesson gets one sheet per
 * curriculum that needs one), unlike simulations, which every curriculum shares.
 */

import type { CurriculumId } from '@/lib/curricula';

/**
 * Marks content that is not examinable at every level the sheet's reader
 * might be at. `supplement` = IGCSE Extended only; `a-level-only` = 9702 A
 * Level, not AS; `beyond` = outside this syllabus altogether (shown for
 * understanding, never examined at this level); `hl-only` = IB HL.
 */
export type ContentTag = 'supplement' | 'a-level-only' | 'beyond' | 'hl-only';

export interface Tagged {
  tag?: ContentTag;
  /** Overrides the tag's default label, e.g. "Not examined in 0625 · A Level Ch.16". */
  tagLabel?: string;
}

export interface Definition extends Tagged {
  term: string;
  /** Plain text; `$…$` spans are typeset with KaTeX. */
  text: string;
  /** `syllabus` = the syllabus's own wording, quoted; `paraphrase` = ours. */
  source: 'syllabus' | 'paraphrase';
  /** Short margin note in the typewriter font, shown beside the item. */
  note?: string;
}

export interface EquationSymbol {
  /** KaTeX source for the symbol, e.g. `T`. */
  symbol: string;
  meaning: string;
  /** SI unit as KaTeX source, e.g. `\mathrm{m\,s^{-1}}`; omit for dimensionless. */
  unit?: string;
}

export interface CoreEquation extends Tagged {
  name: string;
  /** KaTeX display source. */
  latex: string;
  symbols: EquationSymbol[];
  note?: string;
}

/** What a coloured stroke means. The same role has the same colour on every sheet. */
export type DiagramRole = 'force' | 'velocity' | 'acceleration' | 'ink' | 'muted';

export type Point = [number, number];

export type DiagramShape =
  | { kind: 'circle'; centre: Point; radius: number; role?: DiagramRole; dashed?: boolean }
  | { kind: 'line'; from: Point; to: Point; role?: DiagramRole; dashed?: boolean }
  | { kind: 'arrow'; from: Point; to: Point; role: DiagramRole; dashed?: boolean }
  /** A filled body, e.g. the object moving round the circle. */
  | { kind: 'dot'; at: Point; radius: number; role?: DiagramRole }
  | { kind: 'label'; at: Point; text: string; role?: DiagramRole; anchor?: 'start' | 'middle' | 'end'; size?: 'sm' | 'md' }
  /** The square corner mark showing two lines meet at 90°. `a` and `b` are unit-ish directions from `at`. */
  | { kind: 'rightAngle'; at: Point; a: Point; b: Point; size: number; role?: DiagramRole }
  /** An ✗ through something that does NOT happen. */
  | { kind: 'cross'; at: Point; size: number };

export interface Diagram {
  id: string;
  title: string;
  /** What to notice, one or two sentences. */
  caption: string;
  /** Screen-reader description of the whole figure. */
  alt: string;
  width: number;
  height: number;
  shapes: DiagramShape[];
  /** Rough.js seed, so the hand-drawn wobble is identical on every render. */
  seed: number;
}

export interface WorkedStep {
  /** What this step does, in words. */
  text: string;
  /** Optional KaTeX display line for the step. */
  latex?: string;
  /** The unit check for this step, as KaTeX, e.g. `\frac{\mathrm{m}}{\mathrm{m\,s^{-1}}} = \mathrm{s}`. */
  units?: string;
  note?: string;
}

export interface WorkedExample extends Tagged {
  title: string;
  /** The question, as an exam would set it. Command word first where it fits. */
  question: string;
  steps: WorkedStep[];
  /** The final answer, as KaTeX, with unit and justified significant figures. */
  answer: string;
}

export interface CommonMistake {
  wrong: string;
  right: string;
}

export interface RecallQuestion {
  question: string;
  answer: string;
}

export type SectionKey = 'definitions' | 'equations' | 'diagrams' | 'worked' | 'mistakes' | 'recall' | 'summary';

export interface CheatSheet {
  /** URL slug: `/cheat-sheets/<slug>`. */
  slug: string;
  /** The `topics` row (lesson) this sheet belongs to. */
  topicId: string;
  curriculumId: CurriculumId;
  title: string;
  /** The lesson's number in this curriculum, e.g. "3.7" or "16.2". */
  lessonCode: string;
  /** Coursebook chapter (IGCSE/AS/A Level) or IB theme number. */
  chapter: { number: number | string; title: string };
  /** Syllabus section(s) the sheet covers, e.g. "1.5.1" or "A.2". */
  syllabusSections: string[];
  /** One line: what the student can do after this sheet. */
  goal: string;
  /** Date the content was last checked against the syllabus (YYYY-MM-DD). */
  reviewed: string;
  definitions: Definition[];
  equations: CoreEquation[];
  diagrams: Diagram[];
  worked: WorkedExample[];
  mistakes: CommonMistake[];
  recall: RecallQuestion[];
  summary: string[];
  /** Section that starts "Sheet 2" when the content is longer than one A4 page. */
  sheetBreakBefore?: SectionKey;
}
