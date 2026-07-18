import Link from 'next/link';
import { query } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

interface ChapterRow {
  id: string;
  chapter_number: number;
  title: string;
  unit_igcse_code: string | null;
  week_start: number | null;
  week_end: number | null;
}

function quarterForWeek(week: number | null): number {
  if (!week) return 1;
  if (week <= 9) return 1;
  if (week <= 18) return 2;
  if (week <= 22) return 3;
  return 4;
}

const QUARTER_LABELS: Record<number, string> = {
  1: 'Quarter 1 · Sep – Nov',
  2: 'Quarter 2 · Nov – Jan',
  3: 'Quarter 3 · Feb – Mar',
  4: 'Quarter 4 · Mar – Jun',
};

async function getChapters(): Promise<ChapterRow[]> {
  try {
    const result = await query(
      `SELECT id, chapter_number, title, unit_igcse_code, week_start, week_end
       FROM chapters
       WHERE status = 'published'
       ORDER BY chapter_number ASC`
    );
    return result.rows;
  } catch (err) {
    console.error('Failed to load chapters:', err);
    return [];
  }
}

export default async function CurriculumPage() {
  const chapters = await getChapters();

  const grouped: Record<number, ChapterRow[]> = { 1: [], 2: [], 3: [], 4: [] };
  for (const ch of chapters) {
    const q = quarterForWeek(ch.week_start);
    grouped[q].push(ch);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Physics 10 Curriculum</h1>
        <p className="text-gray-600">
          Cambridge IGCSE 0625 · Full year scope and sequence. Click any unit to see what you&apos;ll learn.
        </p>
      </div>

      {chapters.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center text-gray-700">
          Curriculum is being set up. Check back soon.
        </div>
      )}

      {[1, 2, 3, 4].map((q) =>
        grouped[q].length > 0 ? (
          <div key={q} className="mb-10">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3 border-b pb-2">
              {QUARTER_LABELS[q]}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {grouped[q].map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/curriculum/${chapter.id}`}
                  className="block border border-gray-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-sm transition-all bg-white"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-xs text-gray-400 font-medium mb-1">
                        Unit {chapter.chapter_number}
                        {chapter.unit_igcse_code ? ` · IGCSE ${chapter.unit_igcse_code}` : ''}
                      </div>
                      <div className="font-semibold text-gray-900">{chapter.title}</div>
                    </div>
                  </div>
                  {chapter.week_start && (
                    <div className="text-xs text-gray-400 mt-2">
                      Weeks {chapter.week_start}
                      {chapter.week_end && chapter.week_end !== chapter.week_start ? `–${chapter.week_end}` : ''}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ) : null
      )}
    </div>
  );
}
