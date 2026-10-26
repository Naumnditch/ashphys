/**
 * /admin/students/[id]/report — the student's progress report with the
 * teacher-note editor (admin-only via app/admin/layout.tsx).
 */

import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { isStudent } from '@/lib/reports/notes';
import { StaffReportPage } from '@/components/report/StaffReportPage';

export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function AdminStudentReportPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  if (user.role !== 'admin') redirect('/dashboard');
  if (!UUID.test(params.id) || !(await isStudent(params.id))) notFound();
  return <StaffReportPage studentId={params.id} viewer={user} backHref={`/admin/students/${params.id}`} backLabel="Student details" />;
}
