/**
 * A student's video request as the student sees it, plus helpers. No server
 * imports, so client components can use the values here (not just types).
 */

export type VideoRequestStatus = 'open' | 'in_progress' | 'fulfilled' | 'declined';

export interface StudentVideoRequest {
  id: string;
  description: string;
  questionNumber: string | null;
  status: VideoRequestStatus;
  /** Only set once the request is fulfilled with a valid link. */
  youtubeId: string | null;
  /** When the student first opened the fulfilled video (null = still "ready"). */
  openedAt: string | null;
  adminNote: string | null;
  createdAt: string;
  topicId: string | null;
  topicName: string | null;
  chapterNumber: number | null;
  chapterTitle: string | null;
  screenshotUrl: string | null;
}

/** Fulfilled videos the student hasn't opened yet (the dashboard badge). */
export function readyVideoCount(requests: Pick<StudentVideoRequest, 'status' | 'youtubeId' | 'openedAt'>[]): number {
  return requests.filter((r) => r.status === 'fulfilled' && r.youtubeId && !r.openedAt).length;
}

/** One entry of the request form's question dropdown (lib/videoRequests/questionOptions.ts). */
export interface RequestQuestionOption {
  id: string;
  /** The number the practice page shows ("Question 7 of 20"). */
  number: number;
  label: string;
}
