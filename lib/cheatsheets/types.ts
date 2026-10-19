/**
 * The shape of a revision cheat sheet. Sheets are content, not code: each one
 * is a data file in `lib/cheatsheets/sheets/`, registered in `./index.ts`, and
 * rendered by `components/cheatsheet/`. Nothing lesson-specific lives in the
 * components.
 *
 * Cheat sheets are per curriculum (a shared lesson gets one sheet per
 * curriculum that needs one), unlike simulations, which every curriculum shares.
 *
 * Every sheet has the same six sections, in this order:
 *   explanation → derivations → equations → samples → practice → other
 * Any text field may contain `$…$`, typeset inline with KaTeX.
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

/** A definition. `syllabus` = the syllabus's own wording, quoted; `paraphrase` = ours. */
export interface KeyTerm extends Tagged {
  term: string;
  text: string;
  source: 'syllabus' | 'paraphrase';
}

/** 1 · The big picture: a short summarised explanation plus the key terms. */
export interface Explanation {
  paragraphs: string[];
  keyTerms: KeyTerm[];
  /** Diagram ids shown beside the explanation. */
  figures?: string[];
}

export interface DerivationStep {
  text?: string;
  /** KaTeX display line. */
  latex?: string;
}

/** 2 · How an equation (or a case's equations) follow from physics the student already knows. */
export interface Derivation extends Tagged {
  id: string;
  title: string;
  /** The situation, in one or two sentences. */
  setup: string;
  /** Diagram id shown beside the steps. */
  figure?: string;
  steps: DerivationStep[];
  /** The result, boxed (KaTeX). */
  result: string;
}

/** 3 · An important equation, shown in its own box. */
export interface KeyEquation extends Tagged {
  name: string;
  latex: string;
  /** When it applies, e.g. "top of a vertical circle". */
  note?: string;
}

/** A symbol in the sheet's "Symbols and units" table. */
export interface EquationSymbol {
  symbol: string;
  meaning: string;
  /** SI unit as KaTeX; omit for a ratio with no unit. */
  unit?: string;
}

export interface SolutionStep {
  text: string;
  latex?: string;
}

/** 4 · A sample problem, solved step by step. */
export interface SampleProblem extends Tagged {
  title: string;
  /** As an exam would set it, command word first. */
  question: string;
  figure?: string;
  steps: SolutionStep[];
  /** Final answer with unit and justified significant figures (KaTeX). */
  answer: string;
  /** Unit check of the final expression (KaTeX), printed small under the answer. */
  unitCheck?: string;
}

/** 5 · A practice problem: the final answer only, no working. */
export interface PracticeProblem extends Tagged {
  question: string;
  answer: string;
}

export interface CommonMistake {
  wrong: string;
  right: string;
}

/** 6 · Everything else worth knowing. */
export interface OtherInfo {
  mistakes: CommonMistake[];
  tips: string[];
  /** What the syllabus does and does not ask for. */
  syllabus: string[];
  links?: { label: string; href: string }[];
}

/** What a coloured stroke means. The same role has the same colour on every sheet. */
export type DiagramRole = 'force' | 'velocity' | 'acceleration' | 'ink' | 'muted';

export type Point = [number, number];

export type DiagramShape =
  | { kind: 'circle'; centre: Point; radius: number; role?: DiagramRole; dashed?: boolean; fill?: 'soft' }
  | { kind: 'ellipse'; centre: Point; rx: number; ry: number; role?: DiagramRole; dashed?: boolean }
  | { kind: 'line'; from: Point; to: Point; role?: DiagramRole; dashed?: boolean; thin?: boolean }
  | { kind: 'arrow'; from: Point; to: Point; role: DiagramRole; dashed?: boolean }
  /** A filled body, e.g. the object moving round the circle. */
  | { kind: 'dot'; at: Point; radius: number; role?: DiagramRole }
  | { kind: 'polygon'; points: Point[]; role?: DiagramRole; fill?: 'soft' | 'none' }
  /** An open polyline through `points`, e.g. a plotted graph. Use enough points to look smooth. */
  | { kind: 'curve'; points: Point[]; role?: DiagramRole; dashed?: boolean }
  /** An angle marker: arc from `from` to `to` degrees (anticlockwise as seen on screen, 0 = +x). */
  | { kind: 'arc'; centre: Point; radius: number; from: number; to: number; role?: DiagramRole }
  /** The square corner mark showing two lines meet at 90°. `a` and `b` are directions from `at`. */
  | { kind: 'rightAngle'; at: Point; a: Point; b: Point; size: number; role?: DiagramRole }
  /** An ✗ through something that does NOT happen. */
  | { kind: 'cross'; at: Point; size: number }
  /** A fixed surface: a line with hatching on one side. */
  | { kind: 'surface'; from: Point; to: Point; side?: 'left' | 'right' }
  /**
   * Text. `math` labels are set like the equations (italic letters, `_x` or
   * `_{xy}` for an upright subscript); `note` labels are small plain text.
   */
  | {
      kind: 'label';
      at: Point;
      text: string;
      role?: DiagramRole;
      anchor?: 'start' | 'middle' | 'end';
      style?: 'math' | 'note';
    };

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
}

export type SectionKey = 'explanation' | 'derivations' | 'equations' | 'samples' | 'practice' | 'other';

/**
 * One printed page is a list of blocks: a whole section, or part of a list
 * section (derivations, samples, practice) by item index, `from` inclusive,
 * `to` exclusive. A section that continues from the previous page is headed
 * "(continued)".
 */
export type PageBlock = SectionKey | { section: 'derivations' | 'samples' | 'practice'; from: number; to?: number };

export interface CheatSheet {
  /** URL slug: `/cheat-sheets/<slug>`; also the data file's name. */
  slug: string;
  /** The `topics` row (lesson) this sheet belongs to. */
  topicId: string;
  /** Other lessons in the same curriculum this sheet also covers (linked from their pages too). */
  alsoCovers?: string[];
  curriculumId: CurriculumId;
  title: string;
  /** The lesson's number in this curriculum, e.g. "3.7" or "16.1". */
  lessonCode: string;
  /** Coursebook chapter (IGCSE/AS/A Level) or IB theme. */
  chapter: { number: number | string; title: string };
  /** Syllabus or coursebook section(s) the sheet covers, e.g. "1.5.1" or "16.5". */
  syllabusSections: string[];
  /** One line: what the student can do after this sheet. */
  goal: string;
  /** Date the content was last checked against the syllabus (YYYY-MM-DD). */
  reviewed: string;
  explanation: Explanation;
  derivations: Derivation[];
  equations: KeyEquation[];
  symbols: EquationSymbol[];
  samples: SampleProblem[];
  practice: PracticeProblem[];
  other: OtherInfo;
  diagrams: Diagram[];
  /** Printed pages. Omit for a single page holding every section. */
  pages?: PageBlock[][];
}
