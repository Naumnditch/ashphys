/**
 * The report as staff see it (admin: /admin/students/[id]/report, teacher:
 * /teacher/analytics/[id]/report): exactly the student's view, with the note
 * editor in place of the note. Callers have already checked access.
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { CurrentUser } from '@/lib/auth/session';
import { getStudentReport } from '@/lib/reports/data';
import { defaultSignature } from '@/lib/reports/notes';
import { getVideoRequestFormOptions } from '@/lib/videoRequests/formOptions';
import { StudentReportView } from '@/components/report/StudentReportView';
import { ReportNoteEditor, type LessonOptionGroup } from '@/components/report/ReportNoteEditor';

export async function StaffReportPage({
  studentId,
  viewer,
  backHref,
  backLabel,
}: {
  studentId: string;
  viewer: CurrentUser;
  backHref: string;
  backLabel: string;
}) {
  const [report, options, signature] = await Promise.all([
    getStudentReport(studentId),
    getVideoRequestFormOptions(),
    defaultSignature(viewer),
  ]);
  if (!report) notFound();

  const chapterTitle = new Map(options.chapters.map((c: { id: string; title: string; chapter_number: number }) => [c.id, `${c.chapter_number}. ${c.title}`]));
  const byChapter = new Map<string, { id: string; name: string }[]>();
  for (const t of options.topics as { id: string; chapter_id: string; topic_name: string }[]) {
    const label = chapterTitle.get(t.chapter_id) ?? 'Other';
    byChapter.set(label, [...(byChapter.get(label) ?? []), { id: t.id, name: t.topic_name }]);
  }
  const lessonGroups: LessonOptionGroup[] = [
    ...(report.lessons.length
      ? [{ label: `Practised by ${report.student.firstName}`, options: report.lessons.map((l) => ({ id: l.topicId, name: l.name })) }]
      : []),
    ...options.chapters
      .map((c: { id: string }) => chapterTitle.get(c.id)!)
      .filter((label: string, i: number, all: string[]) => byChapter.has(label) && all.indexOf(label) === i)
      .map((label: string) => ({ label, options: byChapter.get(label)! })),
  ];

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link href={backHref} className="text-sm text-gray-500 hover:text-gray-900">
          ← {backLabel}
        </Link>
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
          Staff view · {report.student.firstName} sees the same report, without the editor
        </span>
      </div>
      <StudentReportView
        report={report}
        viewer="staff"
        pdfHref={`/api/reports/${studentId}/pdf`}
        noteSlot={
          <ReportNoteEditor
            studentId={studentId}
            studentFirstName={report.student.firstName}
            notes={report.notes}
            defaultSignature={signature}
            lessonGroups={lessonGroups}
            canNotify={viewer.role === 'admin'}
          />
        }
      />
    </div>
  );
}
