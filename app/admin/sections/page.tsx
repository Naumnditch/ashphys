import Link from 'next/link';
import { query } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

async function getAllSections() {
  const result = await query(`
    SELECT s.id, s.name, s.join_code, s.created_at,
           t.first_name as teacher_first_name, t.last_name as teacher_last_name, t.email as teacher_email,
           (SELECT COUNT(*) FROM users u WHERE u.section_id = s.id) as student_count
    FROM sections s
    JOIN users t ON t.id = s.teacher_id
    ORDER BY s.created_at DESC
  `);
  return result.rows;
}

export default async function AdminSectionsPage() {
  const sections = await getAllSections();
  const totalStudents = sections.reduce((sum, s) => sum + parseInt(s.student_count, 10), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Sections</h1>
      <p className="text-gray-500 text-sm mb-6">
        {sections.length} section{sections.length === 1 ? '' : 's'} across all teachers · {totalStudents} students
        enrolled
      </p>

      {sections.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-12 text-center">
          <p className="text-gray-400 text-sm">No sections created yet.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="divide-y divide-gray-100">
            {sections.map((s) => (
              <Link
                key={s.id}
                href={`/teacher/sections/${s.id}`}
                className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 text-[15px]">{s.name}</div>
                  <div className="text-xs text-gray-400">
                    {s.teacher_first_name} {s.teacher_last_name} · {s.teacher_email}
                  </div>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-700">{s.student_count}</div>
                    <div className="text-[11px] text-gray-400">students</div>
                  </div>
                  <span className="font-mono text-xs font-bold tracking-widest bg-gray-100 text-gray-700 px-2.5 py-1.5 rounded-md">
                    {s.join_code}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
