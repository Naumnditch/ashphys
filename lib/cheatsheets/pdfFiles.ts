/**
 * The downloadable PDFs for each sheet, built ahead of time by
 * `scripts/cheatsheet-pdfs.mjs` (Chromium's print engine, so the PDF matches
 * the printed page exactly) and served from /public. A sheet with no entry
 * here simply has no download button; Print still works.
 */

import manifest from '@/public/cheat-sheets/pdf/manifest.json';

export type Paper = 'a4' | 'letter';

/** Paper sizes in mm, for the @page rule. */
export const PAPER_MM: Record<Paper, { w: number; h: number }> = {
  a4: { w: 210, h: 297 },
  letter: { w: 215.9, h: 279.4 },
};

export interface PdfManifestEntry {
  /** sha256 of the sheet's data file when its PDFs were built. */
  hash: string;
  files: Partial<Record<Paper, { file: string; pages: number; sheets: number; bytes: number }>>;
}

export const PDF_MANIFEST = manifest as Record<string, PdfManifestEntry>;

export function pdfHrefs(slug: string): Partial<Record<Paper, string>> {
  const files = PDF_MANIFEST[slug]?.files ?? {};
  return Object.fromEntries(Object.entries(files).map(([paper, f]) => [paper, `/cheat-sheets/pdf/${f!.file}`]));
}
