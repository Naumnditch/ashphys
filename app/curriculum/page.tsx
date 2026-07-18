import Link from 'next/link';
import { query } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

interface TopicRow {
  id: string;
  chapter_id: string;
  topic_name: string;
  order: number;
}

interface ChapterRow {
  id: string;
  chapter_number: number;
  title: string;
  topics: TopicRow[];
}

async function getChaptersWithTopics(): Promise<ChapterRow[]> {
  try {
    const chaptersResult = await query(
      `SELECT id, chapter_number, title FROM chapters WHERE status = 'published' ORDER BY chapter_number ASC`
    );
    const topicsResult = await query(
      `SELECT id, chapter_id, topic_name, "order" FROM topics ORDER BY chapter_id, "order" ASC`
    );

    return chaptersResult.rows.map((ch: any) => ({
      ...ch,
      topics: topicsResult.rows.filter((t: any) => t.chapter_id === ch.id),
    }));
  } catch (err) {
    console.error('Failed to load curriculum:', err);
    return [];
  }
}

export default async function CurriculumPage() {
  const chapters = await getChaptersWithTopics();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Physics 10 Curriculum</h1>
        <p className="text-gray-600">
          Cambridge IGCSE 0625 · Browse every chapter and lesson. Click a lesson to jump straight to it.
        </p>
      </div>

      {chapters.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center text-gray-700">
          Curriculum is being set up. Check back soon.
        </div>
      )}

      <div className="space-y-6">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <Link
              href={`/curriculum/${chapter.id}`}
              className="block px-5 py-3 bg-gray-50 hover:bg-gray-100 border-b border-gray-200"
            >
              <span className="text-sm text-gray-400 font-medium mr-2">{chapter.chapter_number}</span>
              <span className="font-semibold text-gray-900">{chapter.title}</span>
            </Link>
            {chapter.topics.length > 0 && (
              <ul className="divide-y divide-gray-100">
                {chapter.topics.map((topic) => (
                  <li key={topic.id}>
                    <Link
                      href={`/curriculum/${chapter.id}#topic-${topic.id}`}
                      className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      {topic.topic_name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
