/**
 * GET  /api/admin/site-updates — every "What's New" announcement (drafts too)
 * POST /api/admin/site-updates — create: { slug, title, summary, …urls, ctaLabel, ctaHref, publishedAt, publish? }
 *
 * Admin-only here AND in the database: the writes run under row-level
 * security, where only an admin passes the site_updates write policies.
 */

import { NextRequest, NextResponse } from 'next/server';
import { fail, readJson, requireAdmin, zodMessage } from '@/lib/messaging/http';
import { createSiteUpdate, listSiteUpdates } from '@/lib/siteUpdates/queries';
import { ctaComplete, siteUpdateInput } from '@/lib/siteUpdates/validate';

export const dynamic = 'force-dynamic';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return fail('Not authorized', 403);
  try {
    return NextResponse.json({ success: true, updates: await listSiteUpdates(admin) });
  } catch (err) {
    console.error('site updates list failed', err);
    return fail('Could not load the updates. Has the site_updates migration been applied?', 503);
  }
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return fail('Not authorized', 403);
  const body = (await readJson(req)) as Record<string, unknown>;
  const parsed = siteUpdateInput.safeParse(body);
  if (!parsed.success) return fail(zodMessage(parsed.error));
  if (!ctaComplete(parsed.data)) return fail('Give the button both a label and a link (or leave both empty).');

  const result = await createSiteUpdate(admin, parsed.data, body.publish === true);
  if (!result.ok) return fail(result.error, result.status);
  return NextResponse.json({ success: true, update: result.update });
}
