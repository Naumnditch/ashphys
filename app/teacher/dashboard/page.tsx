import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/client';
import { CreateSectionCard } from '@/components/teacher/CreateSectionCard';
import { CopyCodeButton } from '@/components/teacher/CopyCodeButton';

export const dynamic = 'force-dynamic';

interface SectionRow {
  id: string;
  name: string;
  join_code: string;
  student_count: string;
  created_at: string;
}

async function getSections(teacherId: string): Promise<SectionRow[]> {
  try {
    const result = await query(
      `SELECT s.id, s.name, s.join_code, s.created_at,
              (SELECT COUNT(*) FROM users u WHERE u.section_id = s.id) as student_count
       FROM sections s
       WHERE s.teacher_id = $1
       ORDER BY s.created_at DESC`,
      [teacherId]
    );
    return result.rows;
  } catch {
    return [];
  }
}

export default async function TeacherDashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  if (user.role !== 'teacher') redirect('/dashboard');
  if (user.status !== 'active') redirect('/teacher/pending');

  const sections = await getSections(user.id);
  const totalStudents = sections.reduce((sum, s) => sum + parseInt(s.student_count, 10), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.firstName}</h1>
          <p className="text-gray-500 text-sm mt-1">Here&rsquo;s what&rsquo;s happening across your classes.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-center">
            <div className="text-xl font-bold text-gray-900">{sections.length}</div>
            <div className="text-[11px] text-gray-500 uppercase tracking-wide">Sections</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-center">
            <div className="text-xl font-bold text-gray-900">{totalStudents}</div>
            <div className="text-[11px] text-gray-500 uppercase tracking-wide">Students</div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">My Sections</h2>
        <Link href="/curriculum" className="text-sm text-blue-600 hover:underline font-medium">
          Browse curriculum →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map((s) => (
          <Link
            key={s.id}
            href={`/teacher/sections/${s.id}`}
            className="border border-gray-200 rounded-xl p-5 bg-white hover:border-gray-300 hover:shadow-sm transition-all flex flex-col justify-between min-h-[168px]"
          >
            <div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{s.name}</h3>
              <p className="text-sm text-gray-500">
                {s.student_count} student{s.student_count === '1' ? '' : 's'}
              </p>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-[11px] text-gray-400 uppercase tracking-wide">Join code</span>
              <span
                className="font-mono text-sm font-bold tracking-widest bg-gray-100 text-gray-800 px-3 py-1.5 rounded-md"
              >
                {s.join_code}
              </span>
            </div>
          </Link>
        ))}
        <CreateSectionCard />
      </div>

      {sections.length === 0 && (
        <p className="text-sm text-gray-400 mt-6 text-center">
          Create your first section above, then share its join code with your students so they can enroll
          themselves.
        </p>
      )}
    </div>
  );
}
