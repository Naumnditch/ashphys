import Link from 'next/link';
import { query } from '@/lib/db/client';

export const dynamic = 'force-dynamic';

async function getStats() {
  const result = await query(`
    SELECT
      (SELECT COUNT(*) FROM users WHERE role = 'student') as students,
      (SELECT COUNT(*) FROM users WHERE role = 'teacher' AND status = 'active') as active_teachers,
      (SELECT COUNT(*) FROM users WHERE role = 'teacher' AND status = 'inactive') as pending_teachers,
      (SELECT COUNT(*) FROM sections) as sections,
      (SELECT COUNT(*) FROM chapters) as chapters,
      (SELECT COUNT(*) FROM topics) as topics,
      (SELECT COUNT(*) FROM simulations) as simulations,
      (SELECT COUNT(*) FROM schools) as schools
  `);
  return result.rows[0];
}

async function getRecentUsers() {
  const result = await query(`
    SELECT id, first_name, last_name, email, role, status, created_at
    FROM users
    ORDER BY created_at DESC
    LIMIT 8
  `);
  return result.rows;
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  teacher: 'bg-blue-100 text-blue-700',
  student: 'bg-gray-100 text-gray-600',
};

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-amber-100 text-amber-700',
  suspended: 'bg-red-100 text-red-700',
};

export default async function AdminOverviewPage() {
  const [stats, recentUsers] = await Promise.all([getStats(), getRecentUsers()]);

  const statCards = [
    { label: 'Students', value: stats.students, href: '/admin/users?role=student' },
    { label: 'Active Teachers', value: stats.active_teachers, href: '/admin/users?role=teacher' },
    { label: 'Pending Applications', value: stats.pending_teachers, href: '/admin/teacher-applications', highlight: parseInt(stats.pending_teachers, 10) > 0 },
    { label: 'Sections', value: stats.sections, href: '/admin/sections' },
    { label: 'Chapters', value: stats.chapters, href: '/admin/curriculum' },
    { label: 'Topics', value: stats.topics, href: '/admin/curriculum' },
    { label: 'Simulations', value: stats.simulations, href: '/admin/curriculum' },
    { label: 'Schools', value: stats.schools, href: null },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Platform Overview</h1>
      <p className="text-gray-500 text-sm mb-8">The full picture, at a glance.</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {statCards.map((card) => {
          const content = (
            <div
              className={`border rounded-xl p-4 h-full ${
                card.highlight ? 'border-amber-300 bg-amber-50' : 'border-gray-200 bg-white'
              } ${card.href ? 'hover:border-gray-300 hover:shadow-sm transition-all' : ''}`}
            >
              <div className="text-2xl font-bold text-gray-900">{card.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{card.label}</div>
            </div>
          );
          return card.href ? (
            <Link key={card.label} href={card.href}>
              {content}
            </Link>
          ) : (
            <div key={card.label}>{content}</div>
          );
        })}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Recent Signups</h2>
        <Link href="/admin/users" className="text-sm text-blue-600 hover:underline font-medium">
          View all users →
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="divide-y divide-gray-100">
          {recentUsers.map((u) => (
            <div key={u.id} className="px-5 py-3.5 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 text-[15px]">
                  {u.first_name} {u.last_name}
                </div>
                <div className="text-xs text-gray-400">{u.email}</div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${ROLE_COLORS[u.role]}`}>
                  {u.role}
                </span>
                <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[u.status]}`}>
                  {u.status}
                </span>
                <span className="text-xs text-gray-400 w-20 text-right">
                  {new Date(u.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
