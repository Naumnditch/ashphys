import { query } from '@/lib/db/client';
import { BookletManager } from '@/components/admin/BookletManager';

export const dynamic = 'force-dynamic';

async function getData() {
  const [booklets, chapters, topics] = await Promise.all([
    query(`
      SELECT b.*, c.chapter_number, c.title as chapter_title, t.topic_name
      FROM booklets b
      JOIN chapters c ON b.chapter_id = c.id
      LEFT JOIN topics t ON b.topic_id = t.id
      ORDER BY c.chapter_number ASC, b."order" ASC
    `),
    query(`SELECT id, chapter_number, title FROM chapters ORDER BY chapter_number ASC`),
    query(`SELECT id, chapter_id, topic_name, "order" FROM topics ORDER BY "order" ASC`),
  ]);
  return { booklets: booklets.rows, chapters: chapters.rows, topics: topics.rows };
}

export default async function AdminBookletsPage() {
  const { booklets, chapters, topics } = await getData();
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Booklets</h1>
      <p className="text-gray-500 text-sm mb-8">
        {booklets.length} {booklets.length === 1 ? 'entry' : 'entries'}. Pick a chapter, optionally a specific lesson
        within it, then choose a PDF — it uploads straight to storage.
      </p>
      <BookletManager initialBooklets={booklets} chapters={chapters} topics={topics} />
    </div>
  );
}
