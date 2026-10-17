import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CURRICULA } from '@/lib/curricula';
import { CHEAT_SHEETS, cheatSheetHref, getCheatSheet, syllabusReference } from '@/lib/cheatsheets';
import { siteUrl } from '@/lib/messaging/config';
import { CheatSheetView } from '@/components/cheatsheet/CheatSheetView';

export function generateStaticParams() {
  return CHEAT_SHEETS.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const sheet = getCheatSheet(params.slug);
  if (!sheet) return { title: 'Cheat sheet not found — AshPhys' };
  return {
    title: `${sheet.title} cheat sheet (${syllabusReference(sheet)}) — AshPhys`,
    description: `${CURRICULA[sheet.curriculumId].shortName} revision cheat sheet: ${sheet.goal}`,
  };
}

/** One printable revision cheat sheet. Free to every visitor, like the lessons. */
export default function CheatSheetPage({ params }: { params: { slug: string } }) {
  const sheet = getCheatSheet(params.slug);
  if (!sheet) notFound();
  const curriculum = CURRICULA[sheet.curriculumId];

  return (
    <>
      <nav className="cs-noprint max-w-[860px] mx-auto mb-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        <Link href={`/lessons/${sheet.topicId}?c=${sheet.curriculumId}`} className="text-blue-600 hover:underline">
          ← Back to the lesson
        </Link>
        <Link href={`/cheat-sheets?c=${sheet.curriculumId}`} className="text-blue-600 hover:underline">
          All {curriculum.shortName} cheat sheets
        </Link>
      </nav>
      <CheatSheetView sheet={sheet} url={`${siteUrl()}${cheatSheetHref(sheet)}`} />
    </>
  );
}
