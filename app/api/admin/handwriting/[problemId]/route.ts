/**
 * GET /api/admin/handwriting/[problemId] — the question's handwriting for the editor
 * PUT /api/admin/handwriting/[problemId] — save it: { doc, baseVersion, force? }
 *
 * Admin-only here AND in the database: both run under row-level security,
 * where only an admin passes the question_handwriting policies. The server
 * validates the strokes and renders the SVG snapshots students will see;
 * nothing from the client is stored as markup.
 */

import { NextRequest, NextResponse } from 'next/server';
import { fail, requireAdmin, UUID_RE } from '@/lib/messaging/http';
import { MAX_BODY_BYTES, parseHandwritingDoc } from '@/lib/handwriting/schema';
import { findQuestion, getHandwritingForAdmin, isHandwritingSchemaMissing, saveHandwriting, SCHEMA_MISSING_MESSAGE } from '@/lib/handwriting/store';
import type { AdminHandwritingDTO, SaveHandwritingDTO } from '@/lib/handwriting/dto';

export const dynamic = 'force-dynamic';

export async function GET(_req: NextRequest, { params }: { params: { problemId: string } }) {
  const admin = await requireAdmin();
  if (!admin) return fail('Not authorized', 403);
  if (!UUID_RE.test(params.problemId)) return fail('Question not found', 404);

  try {
    const q = await findQuestion(params.problemId);
    if (!q) return fail('Question not found', 404);
    const stored = await getHandwritingForAdmin(admin, q);
    const body: AdminHandwritingDTO = stored
      ? { doc: stored.doc, version: stored.version, updatedAt: stored.updatedAt }
      : { doc: null, version: 0, updatedAt: null };
    return NextResponse.json({ success: true, ...body });
  } catch (err) {
    if (isHandwritingSchemaMissing(err)) return fail(SCHEMA_MISSING_MESSAGE, 503);
    console.error('[handwriting] admin load failed', err);
    return fail('Could not load the handwriting.', 500);
  }
}

export async function PUT(req: NextRequest, { params }: { params: { problemId: string } }) {
  const admin = await requireAdmin();
  if (!admin) return fail('Not authorized', 403);
  if (!UUID_RE.test(params.problemId)) return fail('Question not found', 404);

  const declared = Number(req.headers.get('content-length') ?? 0);
  if (declared > MAX_BODY_BYTES) return fail('This solution is too large to save. Erase some ink or use fewer pages.', 413);
  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) return fail('This solution is too large to save. Erase some ink or use fewer pages.', 413);

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(text);
  } catch {
    return fail('Invalid request body');
  }
  const baseVersion = body.baseVersion;
  if (typeof baseVersion !== 'number' || !Number.isInteger(baseVersion) || baseVersion < 0) return fail('baseVersion is required');
  const parsed = parseHandwritingDoc(body.doc);
  if (!parsed.ok) return fail(parsed.error);

  try {
    const q = await findQuestion(params.problemId);
    if (!q) return fail('Question not found', 404);
    const result = await saveHandwriting(admin, q, parsed.doc, baseVersion, body.force === true);
    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: 'This solution was changed in another tab or device.', conflict: result.conflict },
        { status: 409 }
      );
    }
    const out: SaveHandwritingDTO = { version: result.version, updatedAt: result.updatedAt, strokeCount: result.strokeCount };
    return NextResponse.json({ success: true, ...out });
  } catch (err) {
    if (isHandwritingSchemaMissing(err)) return fail(SCHEMA_MISSING_MESSAGE, 503);
    console.error('[handwriting] admin save failed', err);
    return fail('Could not save the handwriting.', 500);
  }
}
