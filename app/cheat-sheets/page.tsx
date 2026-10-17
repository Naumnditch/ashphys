import type { Metadata } from 'next';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/session';
import { CURRICULA, CURRICULUM_LIST } from '@/lib/curricula';
import { resolveCurriculum } from '@/lib/curricula/queries';
import { cheatSheetHref, cheatSheetsFor, syllabusReference } from '@/lib/cheatsheets';
import { CurriculumSelector } from '@/components/curriculum/CurriculumSelector';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Revision cheat sheets — AshPhys',
  description: 'Printable one-page physics revision sheets for IGCSE, AS Level, A Level and IB.',
};

/** Every cheat sheet for one curriculum. Same curriculum selector (and remembered choice) as /curriculum. */
export default async function CheatSheetsPage({ searchParams }: { searchParams: { c?: string } }) {
  const user = await getCurrentUser();
  const { curriculumId, source } = await resolveCurriculum(searchParams.c, user?.id);
  const curriculum = CURRICULA[curriculumId];
  const sheets = cheatSheetsFor(curriculumId).sort((a, b) =>
    a.lessonCode.localeCompare(b.lessonCode, undefined, { numeric: true }),
  );
  const elsewhere = CURRICULUM_LIST.filter((c) => c.id !== curriculumId && cheatSheetsFor(c.id).length > 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Revision cheat sheets</h1>
        <p className="text-gray-600">
          One printable page per lesson: definitions, equations, diagrams, a worked example, common mistakes and quick recall
          questions. Each sheet is written for its own syllabus.
        </p>
      </div>

      <CurriculumSelector selectedCurriculum={curriculumId} source={source} basePath="/cheat-sheets" />

      <h2 className="text-xl font-bold text-gray-900 mb-3">{curriculum.name}</h2>
      {sheets.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-gray-700">
          <p className="font-medium">No {curriculum.shortName} cheat sheets yet.</p>
          <p className="text-sm text-gray-500 mt-1">
            They are being written one lesson at a time.
            {elsewhere.length > 0 && (
              <>
                {' '}
                Available now in{' '}
                {elsewhere.map((c, i) => (
                  <span key={c.id}>
                    {i > 0 && ', '}
                    <Link href={`/cheat-sheets?c=${c.id}`} className="text-blue-600 hover:underline">
                      {c.shortName}
                    </Link>
                  </span>
                ))}
                .
              </>
            )}
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {sheets.map((s) => (
            <li key={s.slug}>
              <Link
                href={cheatSheetHref(s)}
                className="block border border-gray-200 rounded-lg px-4 py-3 bg-white hover:border-blue-400 hover:shadow-sm"
              >
                <span className="block text-xs font-mono text-gray-500">
                  {syllabusReference(s)} · Lesson {s.lessonCode}
                </span>
                <span className="block font-semibold text-gray-900">{s.title}</span>
                <span className="block text-sm text-gray-600 mt-1">{s.goal}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
