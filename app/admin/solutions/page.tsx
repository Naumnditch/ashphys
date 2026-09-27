import { query } from '@/lib/db/client';
import { SolutionManager } from '@/components/admin/SolutionManager';

export const dynamic = 'force-dynamic';

async function getData() {
  const [solutions, chapters] = await Promise.all([
    query(
      `SELECT s.*, c.title AS chapter_title
       FROM solutions s
       LEFT JOIN chapters c ON c.chapter_number = s.chapter
       ORDER BY s.chapter ASC, s.created_at DESC`
    ),
    query(`SELECT id, chapter_number, title FROM chapters ORDER BY chapter_number ASC`),
  ]);
  return { solutions: solutions.rows, chapters: chapters.rows };
}

export default async function AdminSolutionsPage() {
  const { solutions, chapters } = await getData();
  const published = solutions.filter((s) => s.is_published).length;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Interactive Solutions</h1>
      <p className="text-gray-500 text-sm mb-8">
        {solutions.length} {solutions.length === 1 ? 'solution' : 'solutions'} · {published} published. Free gets 2
        lifetime views, Plus gets 5, Pro is unlimited — set per-solution tier floors here if a solution should be
        Pro-only regardless of the view cap.
      </p>
      <SolutionManager initialSolutions={solutions} chapters={chapters} />
    </div>
  );
}
