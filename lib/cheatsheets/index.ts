/**
 * Every published cheat sheet, and the lookups pages use to find them.
 * To add a sheet: write its data file in `./sheets/`, then list it here.
 *
 * Pure data and pure functions only: safe to import from client components.
 */

import { CURRICULA, type CurriculumId } from '@/lib/curricula';
import type { CheatSheet, ContentTag, SectionKey } from './types';
import { igcseCircularMotion } from './sheets/igcse-circular-motion';

export type * from './types';

export const CHEAT_SHEETS: readonly CheatSheet[] = [igcseCircularMotion];

export function getCheatSheet(slug: string): CheatSheet | undefined {
  return CHEAT_SHEETS.find((s) => s.slug === slug);
}

/** The sheet for one lesson in one curriculum, if there is one. */
export function cheatSheetFor(topicId: string, curriculumId: CurriculumId): CheatSheet | undefined {
  return CHEAT_SHEETS.find((s) => s.topicId === topicId && s.curriculumId === curriculumId);
}

export function cheatSheetsFor(curriculumId: CurriculumId): CheatSheet[] {
  return CHEAT_SHEETS.filter((s) => s.curriculumId === curriculumId);
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

const TAG_LABELS: Record<ContentTag, string> = {
  supplement: 'Supplement (Extended) only',
  'a-level-only': 'A Level only (not AS)',
  beyond: 'Beyond this syllabus',
  'hl-only': 'IB HL only',
};

export function tagLabel(tag: ContentTag, override?: string) {
  return override ?? TAG_LABELS[tag];
}

export const SECTION_ORDER: readonly SectionKey[] = [
  'definitions',
  'equations',
  'diagrams',
  'worked',
  'mistakes',
  'recall',
  'summary',
];

/** Splits the sections into printed sheets: "Sheet 2" starts at `sheetBreakBefore`. */
export function sheetParts(sheet: Pick<CheatSheet, 'sheetBreakBefore'>): SectionKey[][] {
  const at = sheet.sheetBreakBefore ? SECTION_ORDER.indexOf(sheet.sheetBreakBefore) : -1;
  return at > 0 ? [SECTION_ORDER.slice(0, at), SECTION_ORDER.slice(at)] : [[...SECTION_ORDER]];
}

/** Section headings, in sheet order. */
export const SECTION_TITLES = {
  definitions: 'Key definitions',
  equations: 'Core equations',
  diagrams: 'Diagrams',
  worked: 'Worked example',
  mistakes: 'Common mistakes',
  recall: 'Quick recall',
  summary: 'If you remember nothing else',
} as const;
