import { YouTubeEmbed } from '@/components/video/YouTubeEmbed';
import type { StudentVideoRequest, VideoRequestStatus } from '@/lib/videoRequests/student';

export const STATUS_LABEL: Record<VideoRequestStatus, string> = {
  open: 'Open',
  in_progress: 'In progress',
  fulfilled: 'Fulfilled',
  declined: 'Declined',
};

const STATUS_STYLE: Record<VideoRequestStatus, string> = {
  open: 'bg-amber-50 text-amber-700',
  in_progress: 'bg-blue-50 text-blue-700',
  fulfilled: 'bg-green-50 text-green-700',
  declined: 'bg-gray-100 text-gray-500',
};

/**
 * A student's video requests, newest first. A fulfilled request plays its
 * video inline (no link out) with the teacher's note beside it.
 * No hooks, so it renders from server and client components alike.
 */
export function VideoRequestList({ requests }: { requests: StudentVideoRequest[] }) {
  return (
    <ul className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
      {requests.map((r) => (
        <li key={r.id} className="px-5 py-4">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-1.5">
            <span className="text-[13px] text-gray-900">
              {r.chapterTitle ? `Ch. ${r.chapterNumber} — ${r.chapterTitle}` : 'General'}
              {r.topicName ? ` · ${r.topicName}` : ''}
              {r.questionNumber ? ` · Question ${r.questionNumber}` : ''}
            </span>
            <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_STYLE[r.status]}`}>
              {STATUS_LABEL[r.status]}
            </span>
          </div>
          <p className="text-sm text-gray-700 mb-1.5 whitespace-pre-line">{r.description}</p>
          {r.screenshotUrl && (
            <a href={r.screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">
              View your screenshot
            </a>
          )}
          {r.status === 'fulfilled' && r.youtubeId && (
            <div className="mt-3 max-w-xl">
              <YouTubeEmbed youtubeId={r.youtubeId} title="Your video explanation" trackView={{ lessonId: r.topicId }} />
            </div>
          )}
          {r.adminNote && (
            <p className="text-sm text-gray-600 mt-2 bg-gray-50 border-l-[3px] border-gray-300 px-3 py-1.5 rounded-r">
              <span className="font-semibold">Note from your teacher:</span> {r.adminNote}
            </p>
          )}
          <p className="text-[11px] text-gray-400 mt-1.5">
            Requested {new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Istanbul' })}
          </p>
        </li>
      ))}
    </ul>
  );
}
