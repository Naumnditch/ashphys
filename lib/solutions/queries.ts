import { query } from '@/lib/db/client';
import type { SolutionDifficulty, SolutionKind, SolutionSummaryDTO, SolutionTier } from './types';

interface SolutionRow {
  id: string;
  chapter: number;
  chapter_title: string | null;
  topic: string;
  problem_title: string;
  problem_number: string | null;
  difficulty: SolutionDifficulty;
  static_preview: string;
  description: string | null;
  tags: string[];
  solution_type: SolutionKind;
  tier_required: SolutionTier;
  created_at: string;
  interactive_html?: string | null;
  interactive_html_url?: string | null;
}

function toSummary(r: SolutionRow, unlockedIds: Set<string>): SolutionSummaryDTO {
  return {
    id: r.id,
    chapter: r.chapter,
    chapterTitle: r.chapter_title,
    topic: r.topic,
    problemTitle: r.problem_title,
    problemNumber: r.problem_number,
    difficulty: r.difficulty,
    staticPreview: r.static_preview,
    description: r.description,
    tags: r.tags ?? [],
    solutionType: r.solution_type,
    tierRequired: r.tier_required,
    createdAt: new Date(r.created_at).toISOString(),
    unlocked: unlockedIds.has(r.id),
  };
}

const SUMMARY_COLUMNS = `s.id, s.chapter, c.title AS chapter_title, s.topic, s.problem_title, s.problem_number,
       s.difficulty, s.static_preview, s.description, s.tags, s.solution_type, s.tier_required, s.created_at`;

export async function listPublishedSolutions(
  userId: string | null,
  filters: { chapter?: number; topic?: string } = {}
): Promise<SolutionSummaryDTO[]> {
  const params: unknown[] = [];
  const where: string[] = ['s.is_published = true'];
  if (filters.chapter) {
    params.push(filters.chapter);
    where.push(`s.chapter = $${params.length}`);
  }
  if (filters.topic) {
    params.push(filters.topic);
    where.push(`s.topic = $${params.length}`);
  }

  const rows = (
    await query(
      `SELECT ${SUMMARY_COLUMNS}
       FROM solutions s
       LEFT JOIN chapters c ON c.chapter_number = s.chapter
       WHERE ${where.join(' AND ')}
       ORDER BY s.chapter ASC, s.created_at ASC`,
      params
    )
  ).rows as SolutionRow[];

  const unlockedIds = userId ? await getUnlockedSolutionIds(userId) : new Set<string>();
  return rows.map((r) => toSummary(r, unlockedIds));
}

export async function getUnlockedSolutionIds(userId: string): Promise<Set<string>> {
  const r = await query(`SELECT DISTINCT solution_id FROM solution_access_log WHERE user_id = $1 AND action = 'view_full'`, [userId]);
  return new Set(r.rows.map((row) => row.solution_id as string));
}

export interface SolutionRecord extends SolutionSummaryDTO {
  interactiveHtml: string | null;
  interactiveHtmlUrl: string | null;
}

export async function getSolutionById(id: string): Promise<SolutionRecord | null> {
  const row = (
    await query(
      `SELECT ${SUMMARY_COLUMNS}, s.interactive_html, s.interactive_html_url
       FROM solutions s
       LEFT JOIN chapters c ON c.chapter_number = s.chapter
       WHERE s.id = $1 AND s.is_published = true`,
      [id]
    )
  ).rows[0] as SolutionRow | undefined;
  if (!row) return null;
  return {
    ...toSummary(row, new Set()),
    interactiveHtml: row.interactive_html ?? null,
    interactiveHtmlUrl: row.interactive_html_url ?? null,
  };
}
