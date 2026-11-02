/**
 * PUT    /api/admin/explanations/:id  { text, force? }  save an admin's own version
 * DELETE /api/admin/explanations/:id                   remove the structured version
 *
 * Admin-only. Students see the original explanation again after a DELETE.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { fail, readJson, requireAdmin, UUID_RE, zodMessage } from '@/lib/messaging/http';
import { clearStructured, isSchemaMissing, saveManual, SCHEMA_MISSING_MESSAGE } from '@/lib/explanations/store';

export const dynamic = 'force-dynamic';

const Body = z.object({ text: z.string().trim().min(1).max(8000), force: z.boolean().optional() });

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return fail('Not authorized', 403);
  if (!UUID_RE.test(params.id)) return fail('Unknown question', 404);
  const parsed = Body.safeParse(await readJson(req));
  if (!parsed.success) return fail(zodMessage(parsed.error));
  try {
    const result = await saveManual(params.id, parsed.data.text, parsed.data.force === true);
    if (!result) return fail('Unknown question', 404);
    return NextResponse.json({ success: true, result });
  } catch (err) {
    if (isSchemaMissing(err)) return fail(SCHEMA_MISSING_MESSAGE, 503);
    console.error('[explanations] save failed', err);
    return fail('Could not save the explanation.', 500);
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await requireAdmin();
  if (!admin) return fail('Not authorized', 403);
  if (!UUID_RE.test(params.id)) return fail('Unknown question', 404);
  try {
    if (!(await clearStructured(params.id))) return fail('Unknown question', 404);
    return NextResponse.json({ success: true });
  } catch (err) {
    if (isSchemaMissing(err)) return fail(SCHEMA_MISSING_MESSAGE, 503);
    console.error('[explanations] clear failed', err);
    return fail('Could not remove the explanation.', 500);
  }
}
