/**
 * A student's own workspace for one practice question.
 *
 * GET   — { doc, version, updatedAt, stepsText } (doc null / version 0 before the first save)
 * PUT   — save the canvas: { doc, baseVersion, force? } (same contract as the
 *         admin handwriting editor: 409 from a stale tab, 413 too large)
 * PATCH — save the typed steps: { stepsText } (last write wins)
 *
 * Private to its owner: every query runs under row-level security as the
 * caller, and student_workspaces' policies only match the caller's own row.
 * The lesson's tier gate applies as for the practice page itself.
 */

import { NextRequest, NextResponse } from 'next/server';
import { fail, readJson } from '@/lib/messaging/http';
import { practiceQuestionGate } from '@/lib/practice/questionGate';
import { MAX_BODY_BYTES, parseHandwritingDoc } from '@/lib/handwriting/schema';
import { isHandwritingSchemaMissing } from '@/lib/handwriting/store';
import { getWorkspace, saveWorkspaceDoc, saveWorkspaceSteps, WORKSPACE_SCHEMA_MISSING_MESSAGE } from '@/lib/workspace/store';
import { MAX_STEPS_CHARS, normalizeSteps } from '@/lib/sharedSolutions/validate';

export const dynamic = 'force-dynamic';

type Params = { params: { topicId: string; problemId: string } };

const TOO_LARGE = 'Your working is too large to save. Erase some ink or use fewer pages.';

function failed(err: unknown, what: string) {
  if (isHandwritingSchemaMissing(err)) {
    console.error('[workspace] migration "shared_solutions" has not been applied');
    return fail(WORKSPACE_SCHEMA_MISSING_MESSAGE, 503);
  }
  console.error(`[workspace] ${what} failed`, err);
  return fail(`Could not ${what} your working.`, 500);
}

export async function GET(_req: NextRequest, { params }: Params) {
  const g = await practiceQuestionGate(params);
  if (g instanceof NextResponse) return g;
  try {
    const ws = await getWorkspace(g.user, g.q.problemId);
    return NextResponse.json({
      success: true,
      doc: ws && ws.version > 0 ? ws.doc : null,
      version: ws?.version ?? 0,
      updatedAt: ws?.updatedAt ?? null,
      stepsText: ws?.stepsText ?? '',
    });
  } catch (err) {
    return failed(err, 'load');
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const g = await practiceQuestionGate(params);
  if (g instanceof NextResponse) return g;

  const declared = Number(req.headers.get('content-length') ?? 0);
  if (declared > MAX_BODY_BYTES) return fail(TOO_LARGE, 413);
  const text = await req.text();
  if (text.length > MAX_BODY_BYTES) return fail(TOO_LARGE, 413);
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
    const result = await saveWorkspaceDoc(g.user, g.q.problemId, parsed.doc, baseVersion, body.force === true);
    if (!result.ok) {
      return NextResponse.json(
        { success: false, error: 'Your working was changed in another tab or device.', conflict: result.conflict },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: true, version: result.version, updatedAt: result.updatedAt, strokeCount: result.strokeCount });
  } catch (err) {
    return failed(err, 'save');
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const g = await practiceQuestionGate(params);
  if (g instanceof NextResponse) return g;
  const { stepsText } = (await readJson(req)) as { stepsText?: unknown };
  const steps = normalizeSteps(stepsText);
  if (steps === null) {
    return typeof stepsText === 'string' ? fail(`Keep your steps to ${MAX_STEPS_CHARS} characters.`, 413) : fail('stepsText is required');
  }
  try {
    const saved = await saveWorkspaceSteps(g.user, g.q.problemId, steps);
    return NextResponse.json({ success: true, updatedAt: saved.updatedAt });
  } catch (err) {
    return failed(err, 'save');
  }
}
