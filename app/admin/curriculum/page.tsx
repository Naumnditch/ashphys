import Link from 'next/link';
import { query } from '@/lib/db/client';
import { SimulationIcon } from '@/components/icons/SimulationIcon';

export const dynamic = 'force-dynamic';

async function getChaptersWithCounts() {
  const result = await query(`
    SELECT c.id, c.chapter_number, c.title,
           (SELECT COUNT(*) FROM topics t WHERE t.chapter_id = c.id) as topic_count,
           (SELECT COUNT(*) FROM simulations s WHERE s.chapter_id = c.id) as simulation_count
    FROM chapters c
    ORDER BY c.chapter_number ASC
  `);
  return result.rows;
}

async function getSimulations() {
  const result = await query(`
    SELECT s.id, s.title, s.url_path, s.sim_type, c.chapter_number, c.title as chapter_title, t.topic_name
    FROM simulations s
    JOIN chapters c ON c.id = s.chapter_id
    LEFT JOIN topics t ON t.id = s.topic_id
    ORDER BY c.chapter_number ASC
  `);
  return result.rows;
}

export default async function AdminCurriculumPage() {
  const [chapters, simulations] = await Promise.all([getChaptersWithCounts(), getSimulations()]);
  const totalTopics = chapters.reduce((sum, c) => sum + parseInt(c.topic_count, 10), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Curriculum</h1>
      <p className="text-gray-500 text-sm mb-8">
        {chapters.length} chapters · {totalTopics} lessons · {simulations.length} simulations
      </p>

      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Simulations</h2>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-10">
        <div className="divide-y divide-gray-100">
          {simulations.map((s) => (
            <Link
              key={s.id}
              href={s.url_path}
              className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
            >
              <div className="min-w-0">
                <div className="font-medium text-gray-900 text-[15px]">{s.title}</div>
                <div className="text-xs text-gray-400">
                  Chapter {s.chapter_number} · {s.topic_name || s.chapter_title}
                </div>
              </div>
              <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-700 flex-shrink-0">
                {s.sim_type}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Chapters</h2>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-100">
          {chapters.map((c) => (
            <Link
              key={c.id}
              href={`/curriculum/${c.id}`}
              className="px-5 py-3 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs text-gray-400 font-medium w-5 flex-shrink-0">{c.chapter_number}</span>
                <span className="font-medium text-gray-900 text-[15px] truncate">{c.title}</span>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0 text-xs text-gray-400">
                <span>{c.topic_count} lessons</span>
                {parseInt(c.simulation_count, 10) > 0 && (
                  <span className="text-blue-600 font-medium flex items-center gap-1">
                    <SimulationIcon className="w-3.5 h-3.5" /> {c.simulation_count}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
