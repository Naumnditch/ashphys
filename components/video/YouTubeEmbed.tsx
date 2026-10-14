'use client';

import { useEffect, useRef } from 'react';
import { isValidYouTubeId, youtubeEmbedUrl, youtubeWatchUrl } from '@/lib/youtube/videoId';
import { recordActivity } from '@/lib/activity/client';

/**
 * An unlisted YouTube video played on-site: privacy-enhanced
 * youtube-nocookie embed, no related videos, inline on iOS, responsive
 * 16:9, lazy-loaded. The small "Open on YouTube" link is the fallback for
 * a blocked embed and the ONLY place a YouTube URL is shown to a student.
 *
 * `trackView` records one video_view (for streaks) the first time the
 * student clicks into the player. A cross-origin iframe swallows clicks,
 * so that moment is detected the standard way: the window blurs while the
 * iframe is the active element.
 */
export function YouTubeEmbed({
  youtubeId,
  title = 'Video lesson',
  trackView,
  autoplay = false,
}: {
  youtubeId: string;
  title?: string;
  trackView?: { lessonId: string | null };
  /** Start playing at once — only for players mounted by a click. Not lazy-loaded then. */
  autoplay?: boolean;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const trackLessonId = trackView ? trackView.lessonId ?? '' : null;

  useEffect(() => {
    if (trackLessonId === null) return;
    let sent = false;
    const onBlur = () => {
      if (sent || document.activeElement !== iframeRef.current) return;
      sent = true;
      recordActivity('video_view', trackLessonId || null);
    };
    window.addEventListener('blur', onBlur);
    return () => window.removeEventListener('blur', onBlur);
  }, [trackLessonId]);

  if (!isValidYouTubeId(youtubeId)) {
    return (
      <div className="aspect-video w-full rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center text-sm text-gray-500">
        This video is unavailable.
      </div>
    );
  }

  return (
    <div>
      <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-black">
        <iframe
          ref={iframeRef}
          src={youtubeEmbedUrl(youtubeId, { autoplay })}
          title={title}
          loading={autoplay ? 'eager' : 'lazy'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
      <p className="mt-1.5 text-right">
        <a
          href={youtubeWatchUrl(youtubeId)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] text-gray-400 hover:text-gray-600 underline"
        >
          Video not loading? Open on YouTube
        </a>
      </p>
    </div>
  );
}
