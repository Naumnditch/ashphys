/** Shapes of the handwriting API responses (client-safe). */

import type { AccessReason } from '@/lib/solutions/types';
import type { StudentSolutionDTO } from '@/lib/sharedSolutions/types';
import type { HandwritingDoc, HwSnapshot } from './types';

export interface HandwritingAccessDTO {
  /** The viewer may see the full solution now (Pro, admin, already unlocked, or just unlocked). */
  allowed: boolean;
  /** Not yet unlocked, but opening it would spend one of the viewer's remaining views. */
  costsView: boolean;
  reason: AccessReason;
  viewsUsed: number;
  /** null = unlimited (Pro, admins). */
  viewLimit: number | null;
}

/**
 * GET (status) and POST (open) on /api/practice/[topicId]/handwriting/[problemId].
 * The question's worked solutions: the teacher's handwriting and any approved
 * student solutions, behind one gate (opening them spends one view, not one each).
 * `pages` / `studentSolutions` only when access.allowed; `preview` (the
 * teacher's teaser) only when the viewer is out of views.
 */
export interface HandwritingViewDTO {
  available: boolean;
  /** Pages of the teacher's solution; 0 when there is none yet (only student solutions). */
  pageCount?: number;
  /** How many approved student solutions there are (no content until access is allowed). */
  studentSolutionCount?: number;
  access?: HandwritingAccessDTO;
  pages?: HwSnapshot[];
  studentSolutions?: StudentSolutionDTO[];
  preview?: HwSnapshot | null;
}

/** GET /api/admin/handwriting/[problemId] */
export interface AdminHandwritingDTO {
  doc: HandwritingDoc | null;
  /** 0 = nothing saved yet. */
  version: number;
  updatedAt: string | null;
}

/** PUT /api/admin/handwriting/[problemId] → success */
export interface SaveHandwritingDTO {
  version: number;
  updatedAt: string;
  strokeCount: number;
}
