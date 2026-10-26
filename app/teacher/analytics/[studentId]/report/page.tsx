/**
 * /teacher/analytics/[studentId]/report — a teacher's view of one of their
 * own students' progress report, with the teacher-note editor. Refuses
 * students outside the teacher's sections.
 */

import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/session';
import { canManageReport, isStudent } from '@/lib/reports/notes';
import { StaffReportPage } from '@/components/report/StaffReportPage';

export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function TeacherStudentReportPage({ params }: { params: { studentId: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect('/auth/login');
  if (!UUID.test(params.studentId) || !(await isStudent(params.studentId))) notFound();
  if (!(await canManageReport(user, params.studentId))) notFound();
  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <StaffReportPage
        studentId={params.studentId}
        viewer={user}
        backHref={`/teacher/analytics/${params.studentId}`}
        backLabel="Practice analytics"
      />
    </div>
  );
}
