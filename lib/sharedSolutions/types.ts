/** Shapes of the shared-solutions API responses (client-safe). */

import type { HwSnapshot } from '@/lib/handwriting/types';
import type { AgeBand } from './consent';

export type SharedSolutionStatus = 'pending' | 'approved' | 'rejected' | 'withdrawn';

export const STATUS_LABEL: Record<SharedSolutionStatus, string> = {
  pending: 'Pending review',
  approved: 'Approved',
  rejected: 'Not approved',
  withdrawn: 'Withdrawn',
};

/** A student's own submission (they see every status, and the rejection reason). */
export interface MySharedSolutionDTO {
  id: string;
  questionId: string;
  status: SharedSolutionStatus;
  verified: boolean;
  displayName: string;
  createdAt: string;
  reviewedAt: string | null;
  withdrawnAt: string | null;
  rejectionReason: string | null;
  strokeCount: number;
  hasSteps: boolean;
  /** Where it was shared from (the dashboard list links back to the question). */
  question?: { lessonId: string; lessonTitle: string; number: number | null; text: string };
}

/** An approved solution as other students see it: no author id, no consent data. */
export interface StudentSolutionDTO {
  id: string;
  displayName: string;
  verified: boolean;
  approvedAt: string | null;
  pages: HwSnapshot[];
  stepsText: string;
}

/** GET /api/practice/[topicId]/workspace/[problemId]/share */
export interface ShareFormDTO {
  /** First name + last initial; the student may change it. */
  displayName: string;
  /** null = never asked: the form asks, and parental consent applies until they say 18 or over. */
  ageBand: AgeBand | null;
  consentVersion: string;
  /** Only students share (teachers and admins get the workspace, not the share button). */
  canShare: boolean;
  submissions: MySharedSolutionDTO[];
}

export interface AdminSharedSolutionDTO {
  id: string;
  status: SharedSolutionStatus;
  verified: boolean;
  displayName: string;
  createdAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  verifiedAt: string | null;
  withdrawnAt: string | null;
  rejectionReason: string | null;
  consentVersion: string;
  consentText: string;
  consentedAt: string;
  parentConsentAt: string | null;
  pages: HwSnapshot[];
  stepsText: string;
  student: { id: string; name: string; email: string; ageBand: AgeBand | null };
  question: {
    id: string;
    lessonId: string;
    lessonTitle: string;
    number: number | null;
    text: string;
    imageUrl: string | null;
    answer: string | null;
    explanation: string | null;
  };
  /** The teacher's handwritten solution pages (empty when there is none). */
  teacherPages: HwSnapshot[];
}
