'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { videoRequestHref } from '@/lib/videoRequests/requestLink';

export function requestVideoLabel(questionId?: string | null): string {
  return questionId ? 'Request a video for this question' : 'Request a video for this lesson';
}

/**
 * "Request a video" on practice pages: opens the dashboard's Video Solve
 * Requests tab with this lesson (and question) pre-filled, and the current
 * page as `from` for the "Back to practice" link. IDs only in the URL.
 * Free students still see it; the dashboard shows them the upgrade prompt.
 */
export function RequestVideoButton({
  lessonId,
  questionId,
  label,
}: {
  lessonId: string;
  questionId?: string | null;
  label?: string;
}) {
  const pathname = usePathname();
  const search = useSearchParams()?.toString();
  const from = pathname ? `${pathname}${search ? `?${search}` : ''}` : null;

  return (
    <Link
      href={videoRequestHref({ lessonId, questionId, from })}
      data-question-id={questionId ?? undefined}
      className="inline-flex items-center gap-2 text-sm font-semibold border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="14" height="12" rx="2" />
        <path d="M16 10.5 22 7v10l-6-3.5" />
      </svg>
      {label ?? requestVideoLabel(questionId)}
    </Link>
  );
}
