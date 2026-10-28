/** Shapes of the handwriting API responses (client-safe). */

import type { AccessReason } from '@/lib/solutions/types';
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
 * `pages` only when access.allowed; `preview` only when the viewer is out of views.
 */
export interface HandwritingViewDTO {
  available: boolean;
  pageCount?: number;
  access?: HandwritingAccessDTO;
  pages?: HwSnapshot[];
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
