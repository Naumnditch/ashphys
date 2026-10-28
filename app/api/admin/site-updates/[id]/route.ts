/**
 * PUT    /api/admin/site-updates/[id] — save every field (same body as POST)
 * PATCH  /api/admin/site-updates/[id] — { action: 'publish' | 'unpublish' }
 * DELETE /api/admin/site-updates/[id]
 *
 * Uploaded files stay in the bucket when a row is deleted or a file is
 * replaced (new uploads get new paths, so caches never serve a stale file).
 */

import { NextRequest, NextResponse } from 'next/server';
import { fail, readJson, requireAdmin, UUID_RE, zodMessage } from '@/lib/messaging/http';
import { deleteSiteUpdate, setSiteUpdateActive, updateSiteUpdate } from '@/lib/siteUpdates/queries';
import { ctaComplete, siteUpdateInput } from '@/lib/siteUpdates/validate';

type Ctx = { params: { id: string } };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return fail('Not authorized', 403);
  if (!UUID_RE.test(params.id)) return fail('Not found', 404);
  const parsed = siteUpdateInput.safeParse(await readJson(req));
  if (!parsed.success) return fail(zodMessage(parsed.error));
  if (!ctaComplete(parsed.data)) return fail('Give the button both a label and a link (or leave both empty).');

  const result = await updateSiteUpdate(admin, params.id, parsed.data);
  if (!result.ok) return fail(result.error, result.status);
  return NextResponse.json({ success: true, update: result.update });
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return fail('Not authorized', 403);
  if (!UUID_RE.test(params.id)) return fail('Not found', 404);
  const { action } = (await readJson(req)) as { action?: unknown };
  if (action !== 'publish' && action !== 'unpublish') return fail('action must be publish or unpublish');

  const result = await setSiteUpdateActive(admin, params.id, action === 'publish');
  if (!result.ok) return fail(result.error, result.status);
  return NextResponse.json({ success: true, update: result.update });
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const admin = await requireAdmin();
  if (!admin) return fail('Not authorized', 403);
  if (!UUID_RE.test(params.id)) return fail('Not found', 404);
  if (!(await deleteSiteUpdate(admin, params.id))) return fail('Not found', 404);
  return NextResponse.json({ success: true });
}
