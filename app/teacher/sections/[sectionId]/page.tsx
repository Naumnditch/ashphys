import Link from 'next/link';
import { redirect, notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/client';
import { CopyCodeButton } from '@/components/teacher/CopyCodeButton';

export const dynamic = 'force-dynamic';

async function getSection(sectionId: string, teacherId: string) {
  const result = await query(
    `SELECT id, name, join_code, created_at FROM sections WHERE id = $1 AND teacher_id = $2`,
    [sectionId, teacherId]
  );
  return result.rows[0] || null;
}

async function getRoster(sectionId: string) {
  const result = await query(
    `SELECT u.id, u.first_name, u.last_name, u.email, u.created_at,
            (SELECT COUNT(*) FROM student_progress sp WHERE sp.student_id = u.id AND sp.status = 'completed') as chapters_completed
     FROM users u
     WHERE u.section_id = $1 AND u.role = 'student'
     ORDER BY u.first_name ASC`,
    [sectionId]
  );
  return result.rows;
}

export default async function SectionDetailPage({ params }: { params: { sectionId: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  if (user.role !== 'teacher') redirect('/dashboard');
  if (user.status !== 'active') redirect('/teacher/pending');

  const section = await getSection(params.sectionId, user.id);
  if (!section) notFound();

  const roster = await getRoster(section.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link href="/teacher/dashboard" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Dashboard
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{section.name}</h1>
          <p className="text-gray-500 text-sm mt-1">
            {roster.length} student{roster.length === 1 ? '' : 's'} enrolled
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 flex items-center gap-3">
          <div>
            <div className="text-[11px] text-gray-400 uppercase tracking-wide">Join Code</div>
            <div className="text-xs text-gray-500 mt-0.5">Share with students to enroll</div>
          </div>
          <CopyCodeButton code={section.join_code} />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Roster</h2>
        </div>

        {roster.length === 0 ? (
          <div className="px-5 py-10 text-center text-gray-400 text-sm">
            No students yet. Share the join code above to get your class enrolled.
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {roster.map((student) => (
              <div key={student.id} className="px-5 py-3.5 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 text-[15px]">
                    {student.first_name} {student.last_name}
                  </div>
                  <div className="text-xs text-gray-400">{student.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-700">
                    {student.chapters_completed} / 25
                  </div>
                  <div className="text-[11px] text-gray-400">chapters complete</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
