import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { query } from '@/lib/db/client';
import { ApplicationActions } from '@/components/admin/ApplicationActions';

export const dynamic = 'force-dynamic';

async function getPendingApplications() {
  const result = await query(
    `SELECT id, first_name, last_name, email, school_name, application_message, created_at
     FROM users
     WHERE role = 'teacher' AND status = 'inactive'
     ORDER BY created_at ASC`
  );
  return result.rows;
}

async function getActiveTeacherCount() {
  const result = await query(`SELECT COUNT(*) as count FROM users WHERE role = 'teacher' AND status = 'active'`);
  return parseInt(result.rows[0]?.count || '0', 10);
}

export default async function TeacherApplicationsPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  if (user.role !== 'admin') redirect('/dashboard');

  const [applications, activeTeacherCount] = await Promise.all([
    getPendingApplications(),
    getActiveTeacherCount(),
  ]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Applications</h1>
          <p className="text-gray-500 text-sm mt-1">
            {applications.length} pending · {activeTeacherCount} active teacher
            {activeTeacherCount === 1 ? '' : 's'}
          </p>
        </div>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-12 text-center">
          <p className="text-gray-400 text-sm">No pending applications right now.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">
                    {app.first_name} {app.last_name}
                  </h3>
                  <p className="text-sm text-gray-500">{app.email}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {new Date(app.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="bg-gray-50 rounded-lg px-4 py-3 mb-4">
                <div className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">Teaches at</div>
                <div className="text-sm text-gray-800 font-medium mb-3">{app.school_name}</div>
                {app.application_message && (
                  <>
                    <div className="text-[11px] text-gray-400 uppercase tracking-wide mb-1">Message</div>
                    <div className="text-sm text-gray-700 leading-relaxed">{app.application_message}</div>
                  </>
                )}
              </div>

              <ApplicationActions userId={app.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
