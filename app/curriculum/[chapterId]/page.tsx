import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

interface ChapterDetail {
  id: string;
  chapter_number: number;
  title: string;
  description: string | null;
  unit_igcse_code: string | null;
  learning_objectives: string | null;
  week_start: number | null;
  week_end: number | null;
}

async function getChapter(id: string): Promise<ChapterDetail | null> {
  try {
    const result = await query(
      `SELECT id, chapter_number, title, description, unit_igcse_code, learning_objectives, week_start, week_end
       FROM chapters WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  } catch (err) {
    console.error('Failed to load chapter:', err);
    return null;
  }
}

async function getAdjacentChapters(chapterNumber: number) {
  try {
    const result = await query(
      `SELECT id, chapter_number, title FROM chapters
       WHERE chapter_number IN ($1, $2)`,
      [chapterNumber - 1, chapterNumber + 1]
    );
    const prev = result.rows.find((r: any) => r.chapter_number === chapterNumber - 1) || null;
    const next = result.rows.find((r: any) => r.chapter_number === chapterNumber + 1) || null;
    return { prev, next };
  } catch {
    return { prev: null, next: null };
  }
}

// Splits our stored description into labeled sections for nicer rendering
function parseSections(description: string | null) {
  if (!description) return [];
  const parts = description.split(/\*\*(.+?):\*\*/g).filter(Boolean);
  const sections: { label: string; content: string }[] = [];
  for (let i = 0; i < parts.length - 1; i += 2) {
    sections.push({ label: parts[i].trim(), content: parts[i + 1].trim() });
  }
  return sections;
}

export default async function ChapterDetailPage({ params }: { params: { chapterId: string } }) {
  const chapter = await getChapter(params.chapterId);
  if (!chapter) notFound();

  const { prev, next } = await getAdjacentChapters(chapter.chapter_number);
  const sections = parseSections(chapter.description);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/curriculum" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Back to full curriculum
      </Link>

      <div className="mb-6">
        <div className="text-sm text-gray-400 font-medium mb-1">
          Unit {chapter.chapter_number}
          {chapter.unit_igcse_code ? ` · IGCSE ${chapter.unit_igcse_code}` : ''}
          {chapter.week_start ? ` · Weeks ${chapter.week_start}${chapter.week_end && chapter.week_end !== chapter.week_start ? `–${chapter.week_end}` : ''}` : ''}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">{chapter.title}</h1>
      </div>

      {sections.map((s) => (
        <div key={s.label} className="mb-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-1">{s.label}</h3>
          <p className="text-gray-600 whitespace-pre-line leading-relaxed">{s.content}</p>
        </div>
      ))}

      {chapter.learning_objectives && (
        <div className="mb-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Learning Objectives</h3>
          <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">
            {chapter.learning_objectives}
          </p>
        </div>
      )}

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 text-center mb-8">
        <p className="text-gray-700 font-medium mb-1">📹 Video lessons & practice problems coming soon</p>
        <p className="text-sm text-gray-500">
          Your teacher is preparing content for this unit.
        </p>
      </div>

      <div className="flex justify-between items-center border-t pt-4">
        {prev ? (
          <Link href={`/curriculum/${prev.id}`} className="text-sm text-gray-600 hover:text-blue-600">
            ← Unit {prev.chapter_number}
          </Link>
        ) : <span />}
        {next ? (
          <Link href={`/curriculum/${next.id}`} className="text-sm text-gray-600 hover:text-blue-600">
            Unit {next.chapter_number} →
          </Link>
        ) : <span />}
      </div>
    </div>
  );
}
