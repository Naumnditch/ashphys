export type SolutionDifficulty = 'basic' | 'intermediate' | 'advanced';
export type SolutionKind = 'interactive' | 'static';
export type SolutionTier = 'free' | 'plus' | 'pro';
export type AccessReason = 'ok' | 'sign_in_required' | 'tier_required' | 'limit_reached';

export interface SolutionSummaryDTO {
  id: string;
  chapter: number;
  chapterTitle: string | null;
  topic: string;
  problemTitle: string;
  problemNumber: string | null;
  difficulty: SolutionDifficulty;
  staticPreview: string;
  description: string | null;
  tags: string[];
  solutionType: SolutionKind;
  tierRequired: SolutionTier;
  createdAt: string;
  /** Whether the viewer has already fully unlocked this one (doesn't cost another view). */
  unlocked: boolean;
}

export interface SolutionAccessDTO {
  allowed: boolean;
  reason: AccessReason;
  viewsUsed: number;
  /** null = unlimited (Pro). */
  viewLimit: number | null;
}

export interface SolutionDetailDTO extends SolutionSummaryDTO {
  interactiveHtml: string | null;
  interactiveHtmlUrl: string | null;
  access: SolutionAccessDTO;
}

export interface ViewStatusDTO {
  viewsUsed: number;
  viewLimit: number | null;
  tier: SolutionTier;
}
