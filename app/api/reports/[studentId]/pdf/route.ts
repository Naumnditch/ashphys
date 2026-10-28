/**
 * GET /api/reports/me/pdf           → the signed-in student's own progress report
 * GET /api/reports/[studentId]/pdf  → a student's report, for admins and their teacher
 *
 * A real A4 PDF built on the server (lib/reports/pdf.ts).
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { UUID_RE } from '@/lib/messaging/http';
import { canViewReport, isStudent } from '@/lib/reports/notes';
import { getStudentReport } from '@/lib/reports/data';
import { renderReportPdf, reportFilename } from '@/lib/reports/pdf';
import { logEvent } from '@/lib/analytics/track';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

export async function GET(req: NextRequest, { params }: { params: { studentId: string } }) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.redirect(new URL('/auth/login', req.url));

  const studentId = params.studentId === 'me' ? user.id : params.studentId;
  if (!UUID_RE.test(studentId)) return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
  if (!(await canViewReport(user, studentId)) || !(await isStudent(studentId))) {
    return NextResponse.json({ success: false, error: 'Not authorized' }, { status: studentId === user.id ? 404 : 403 });
  }

  try {
    const report = await getStudentReport(studentId);
    if (!report) return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    const pdf = await renderReportPdf(report);
    const filename = reportFilename(report);
    const asciiName = filename.replace(/[^\x20-\x7e]/g, '_').replace(/"/g, '');
    await logEvent({ userId: user.id, eventType: 'download', entityType: 'student_report', entityId: studentId });
    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'Content-Length': String(pdf.length),
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err) {
    console.error('[report pdf] failed', err);
    return NextResponse.json({ success: false, error: 'Could not build the report PDF' }, { status: 500 });
  }
}
