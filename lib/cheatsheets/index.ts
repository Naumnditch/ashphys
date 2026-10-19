/**
 * Every published cheat sheet, and the lookups pages use to find them.
 * To add a sheet: write its data file in `./sheets/` (named after its slug),
 * then list it here.
 *
 * Pure data and pure functions only: safe to import from client components.
 */

import { CURRICULA, type CurriculumId } from '@/lib/curricula';
import type { CheatSheet, ContentTag, PageBlock, SectionKey } from './types';
import { igcseCircularMotion } from './sheets/igcse-circular-motion';
import { aLevelCircularMotion } from './sheets/a-level-circular-motion';
import { aLevelGravitationalFields } from './sheets/a-level-gravitational-fields';

export type * from './types';

export const CHEAT_SHEETS: readonly CheatSheet[] = [igcseCircularMotion, aLevelCircularMotion, aLevelGravitationalFields];

export function getCheatSheet(slug: string): CheatSheet | undefined {
  return CHEAT_SHEETS.find((s) => s.slug === slug);
}

/** The sheet for one lesson in one curriculum: its own sheet, or one that also covers it. */
export function cheatSheetFor(topicId: string, curriculumId: CurriculumId): CheatSheet | undefined {
  const inCurriculum = CHEAT_SHEETS.filter((s) => s.curriculumId === curriculumId);
  return inCurriculum.find((s) => s.topicId === topicId) ?? inCurriculum.find((s) => s.alsoCovers?.includes(topicId));
}

export function cheatSheetsFor(curriculumId: CurriculumId): CheatSheet[] {
  return CHEAT_SHEETS.filter((s) => s.curriculumId === curriculumId);
}

/** Every lesson id in this curriculum with a sheet (its own or one that covers it). */
export function lessonsWithCheatSheets(curriculumId: CurriculumId): string[] {
  return cheatSheetsFor(curriculumId).flatMap((s) => [s.topicId, ...(s.alsoCovers ?? [])]);
}

export function cheatSheetHref(sheet: Pick<CheatSheet, 'slug'>) {
  return `/cheat-sheets/${sheet.slug}`;
}

/**
 * The syllabus reference shown on the sheet: "0625 Ch.3", "9702 AS Ch.5",
 * "9702 A Level Ch.16", "IB A.2". AS and A Level chapters are coursebook
 * chapters (AS 1–15, A Level 16 onward); IB uses the subtopic code.
 */
export function syllabusReference(sheet: Pick<CheatSheet, 'curriculumId' | 'chapter' | 'syllabusSections'>): string {
  if (sheet.curriculumId === 'ib') return `IB ${sheet.syllabusSections[0] ?? sheet.chapter.number}`;
  return `${CURRICULA[sheet.curriculumId].syllabusLabel} Ch.${sheet.chapter.number}`;
}

/** A Level chapters 16 onward are not in AS: the whole sheet gets the label. */
export function isALevelOnly(sheet: Pick<CheatSheet, 'curriculumId' | 'chapter'>): boolean {
  return sheet.curriculumId === 'a-level' && Number(sheet.chapter.number) >= 16;
}

const TAG_LABELS: Record<ContentTag, string> = {
  supplement: 'Supplement (Extended) only',
  'a-level-only': 'A Level only (not AS)',
  beyond: 'Beyond this syllabus',
  'hl-only': 'IB HL only',
};

export function tagLabel(tag: ContentTag, override?: string) {
  return override ?? TAG_LABELS[tag];
}

export const SECTION_ORDER: readonly SectionKey[] = ['explanation', 'derivations', 'equations', 'samples', 'practice', 'other'];

export const SECTION_TITLES: Record<SectionKey, string> = {
  explanation: 'The big picture',
  derivations: 'Deriving the equations',
  equations: 'Key equations',
  samples: 'Sample problems with solutions',
  practice: 'Practice problems',
  other: 'Other useful information',
};

export interface PagePart {
  section: SectionKey;
  /** Item range for list sections; whole section when absent. */
  from?: number;
  to?: number;
  /** The section started on an earlier page. */
  continued: boolean;
}

/** The sheet's printed pages, normalised: every block as a section plus optional item range. */
export function sheetPages(sheet: Pick<CheatSheet, 'pages'>): PagePart[][] {
  const pages: PageBlock[][] = sheet.pages ?? [[...SECTION_ORDER]];
  const seen = new Set<SectionKey>();
  return pages.map((blocks) =>
    blocks.map((b) => {
      const part: PagePart =
        typeof b === 'string'
          ? { section: b, continued: seen.has(b) }
          : { section: b.section, from: b.from, to: b.to, continued: seen.has(b.section) };
      seen.add(part.section);
      return part;
    }),
  );
}

/** Item counts per list section, for checking that pages cover every item exactly once. */
export function sectionLength(sheet: CheatSheet, section: SectionKey): number {
  if (section === 'derivations') return sheet.derivations.length;
  if (section === 'samples') return sheet.samples.length;
  if (section === 'practice') return sheet.practice.length;
  return 1;
}
