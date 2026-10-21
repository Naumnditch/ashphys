'use client';

import { useState } from 'react';
import Link from 'next/link';
import { VideoRequestForm } from '@/components/video-requests/VideoRequestForm';
import { VideoRequestsGrid } from '@/components/dashboard/VideoRequestsGrid';
import { useDashboard } from '@/components/dashboard/DashboardTabs';
import { recordActivity } from '@/lib/activity/client';
import type { RequestQuestionOption, StudentVideoRequest } from '@/lib/videoRequests/types';

interface Chapter { id: string; chapter_number: number; title: string }
interface Topic { id: string; chapter_id: string; topic_name: string }

/**
 * Video Solve Requests tab: the existing request form (Plus/Pro; Free gets
 * the same upsell /video-requests showed), then "Your requests". Data comes
 * from the dashboard's useMyVideoRequests, shared with the nav badge.
 */
export function VideosTab({
  canRequest,
  chapters,
  topics,
  initialTopicId,
  initialQuestionId,
  initialQuestions,
  returnTo,
  justSubmitted,
}: {
  canRequest: boolean;
  chapters: Chapter[];
  topics: Topic[];
  /** Validated by the page (lib/videoRequests/requestLink.ts): unknown ids never get here. */
  initialTopicId?: string;
  initialQuestionId?: string;
  initialQuestions?: RequestQuestionOption[];
  /** Safe on-site path for "Back to practice" after a submit. */
  returnTo?: string | null;
  justSubmitted?: boolean;
}) {
  const { videoRequests } = useDashboard();
  const { requests, status, error, reload, markOpenedLocally } = videoRequests;
  // While a video plays it gets the whole panel; the form is only hidden
  // (not unmounted), so anything typed into it survives.
  const [playing, setPlaying] = useState(false);

  const onOpen = (r: StudentVideoRequest) => {
    if (!r.openedAt) {
      markOpenedLocally(r.id);
      fetch(`/api/video-requests/${r.id}/opened`, { method: 'POST' }).catch(() => {});
    }
    recordActivity('video_view', r.topicId);
  };

  return (
    <div className="space-y-8">
      <div hidden={playing}>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Video Solve Requests</h2>
        <p className="text-sm text-gray-500 mb-4">
          Stuck on a problem? Describe it (optionally attach a screenshot) and a teacher will record a short video walking
          through the solution. It plays right here.
        </p>
        {justSubmitted && (
          <div role="status" className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 text-sm">
            ✅ Your video request is in. It will appear under &ldquo;Ready&rdquo; below once a teacher has recorded it.
          </div>
        )}
        {canRequest ? (
          <VideoRequestForm
            key={`${initialTopicId ?? 'none'}:${initialQuestionId ?? 'none'}`}
            chapters={chapters}
            topics={topics}
            initialTopicId={initialTopicId}
            initialQuestionId={initialQuestionId}
            initialQuestions={initialQuestions}
            returnTo={returnTo}
            onSubmitted={reload}
          />
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
            <div className="text-3xl mb-2" aria-hidden="true">🔒</div>
            <p className="font-semibold text-gray-900 mb-1">Video Solve Requests are a Plus &amp; Pro feature</p>
            <p className="text-sm text-gray-500 mb-4">
              Plus and Pro members can request a short, personal video walkthrough from a teacher.
            </p>
            <Link href="/pricing" className="inline-flex min-h-[44px] items-center bg-gray-900 hover:bg-black text-on-ink font-semibold px-5 rounded-lg">
              See plans
            </Link>
          </div>
        )}
      </div>
      {status === 'error' && <p className="text-sm text-red-600">{error}</p>}
      {status === 'signed-out' ? (
        <p className="text-sm text-gray-600">
          Your session has ended. <Link href="/auth/login" className="text-blue-600 underline">Log in again</Link> to see your requests.
        </p>
      ) : (
        <VideoRequestsGrid requests={requests} loading={status === 'loading'} onOpen={onOpen} onPlayingChange={setPlaying} />
      )}
    </div>
  );
}
