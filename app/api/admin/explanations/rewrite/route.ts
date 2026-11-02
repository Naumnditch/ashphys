/**
 * POST /api/admin/explanations/rewrite
 *   { ids: string[] }                    rewrite these questions (regenerate)
 *   { limit?: number, skipIds?: string[] } rewrite the next pending ones
 *
 * Each question goes through the Claude API with the house-style prompt
 * (lib/explanations/format.ts) and is validated before it is stored. The admin
 * page calls this repeatedly to work through the whole bank. Admin-only.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fail, readJson, requireAdmin, zodMessage } from '@/lib/messaging/http';
import { RewriteNotConfiguredError } from '@/lib/explanations/generate';
import { getStats, isSchemaMissing, rewriteBatch, SCHEMA_MISSING_MESSAGE } from '@/lib/explanations/store';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

const Body = z.object({
  ids: z.array(z.string().uuid()).max(20).optional(),
  limit: z.number().int().min(1).max(20).optional(),
  skipIds: z.array(z.string().uuid()).max(5000).optional(),
});

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if (!admin) return fail('Not authorized', 403);
  const parsed = Body.safeParse(await readJson(req));
  if (!parsed.success) return fail(zodMessage(parsed.error));
  try {
    const results = await rewriteBatch(parsed.data);
    return NextResponse.json({ success: true, results, stats: await getStats() });
  } catch (err) {
    if (err instanceof RewriteNotConfiguredError) return fail(err.message, 503);
    if (isSchemaMissing(err)) return fail(SCHEMA_MISSING_MESSAGE, 503);
    console.error('[explanations] rewrite batch failed', err);
    return fail('The rewrite failed. Try again.', 500);
  }
}
