/**
 * GET /api/admin/explanations?filter=pending|ok|needs_review|manual|all&q=&page=
 *
 * One page of questions with their original explanation and any hand-written
 * structured version. Admin-only.
 */

import { NextRequest, NextResponse } from 'next/server';
import { fail, requireAdmin } from '@/lib/messaging/http';
import { getStats, isSchemaMissing, listForAdmin, PAGE_SIZE, SCHEMA_MISSING_MESSAGE, type AdminFilter } from '@/lib/explanations/store';

export const dynamic = 'force-dynamic';

const FILTERS: AdminFilter[] = ['pending', 'ok', 'needs_review', 'manual', 'all'];

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return fail('Not authorized', 403);
  const sp = req.nextUrl.searchParams;
  const filter = (sp.get('filter') ?? 'all') as AdminFilter;
  if (!FILTERS.includes(filter)) return fail('Unknown filter');
  const page = Math.max(1, Number(sp.get('page')) || 1);
  try {
    const [stats, list] = await Promise.all([getStats(), listForAdmin({ filter, q: sp.get('q') ?? undefined, page })]);
    return NextResponse.json({
      success: true,
      stats,
      rows: list.rows,
      total: list.total,
      page,
      pageSize: PAGE_SIZE,
    });
  } catch (err) {
    if (isSchemaMissing(err)) return fail(SCHEMA_MISSING_MESSAGE, 503);
    console.error('[explanations] list failed', err);
    return fail('Could not load the explanations.', 500);
  }
}
