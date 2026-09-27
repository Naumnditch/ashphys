import { query } from '@/lib/db/client';
import { SolutionsCatalog } from '@/components/solutions/SolutionsCatalog';

export const dynamic = 'force-dynamic';

async function getChapters() {
  try {
    const result = await query(
      `SELECT DISTINCT c.chapter_number, c.title
       FROM solutions s
       JOIN chapters c ON c.chapter_number = s.chapter
       WHERE s.is_published = true
       ORDER BY c.chapter_number ASC`
    );
    return result.rows;
  } catch {
    return [];
  }
}

export default async function SolutionsPage() {
  const chapters = await getChapters();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6">
        <div className="font-mono text-xs tracking-wide uppercase text-[#8f6428] mb-1.5">Worked solutions</div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-[#1b2a41]" style={{ fontFamily: 'Georgia, serif' }}>
          Interactive Problem Solutions
        </h1>
        <p className="text-[#4a5a72] text-sm mt-2 max-w-2xl leading-relaxed">
          Full, animated step-by-step walkthroughs of past-paper-style problems — not just the answer, the reasoning.
          Free and Plus get a taste of the library; Pro unlocks all of it.
        </p>
      </div>
      <SolutionsCatalog chapters={chapters} />
    </div>
  );
}
