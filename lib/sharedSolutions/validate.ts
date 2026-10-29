/**
 * Validation for the share form, the admin review actions and typed steps.
 * Mirrors the CHECK constraints in database/seeds/2026-10-29-shared-solutions.sql
 * so a bad value is a clear 400 here rather than a constraint error.
 */

import { z } from 'zod';
import { AGE_BANDS, type AgeBand } from './consent';

export const MAX_DISPLAY_NAME = 40;
export const MAX_STEPS_CHARS = 5000;
export const MAX_REJECTION_REASON = 500;

/**
 * Letters (any script) first, then letters, digits, spaces and . ' ’ -.
 * No @ or / so an email address or a link can't become a display name.
 */
export const DISPLAY_NAME_RE = /^[\p{L}\p{M}][\p{L}\p{M}\p{N} .'’-]*$/u;

export function normalizeDisplayName(raw: string): string {
  return raw.normalize('NFC').replace(/\s+/g, ' ').trim();
}

const mustBeTrue = (message: string) => z.literal(true, { errorMap: () => ({ message }) });

export const shareInput = z.object({
  displayName: z
    .string({ required_error: 'Choose a display name' })
    .transform(normalizeDisplayName)
    .pipe(
      z
        .string()
        .min(1, 'Choose a display name')
        .refine((s) => Array.from(s).length <= MAX_DISPLAY_NAME, `Keep the display name to ${MAX_DISPLAY_NAME} characters`)
        .refine((s) => DISPLAY_NAME_RE.test(s), 'Use letters, numbers, spaces, full stops, apostrophes and hyphens only')
    ),
  workedMyself: mustBeTrue('Confirm that you worked out this solution yourself'),
  licence: mustBeTrue('Accept the licence to share your solution'),
  consentVersion: z.string().max(40),
  ageBand: z.enum(AGE_BANDS as [AgeBand, ...AgeBand[]]).optional(),
  parentConsent: z.boolean().optional(),
});

export type ShareInput = z.infer<typeof shareInput>;

export const reviewInput = z.discriminatedUnion('action', [
  z.object({ action: z.literal('approve') }),
  z.object({
    action: z.literal('reject'),
    reason: z
      .string()
      .max(MAX_REJECTION_REASON, `Keep the reason to ${MAX_REJECTION_REASON} characters`)
      .optional()
      .transform((r) => (r && r.trim() ? r.trim() : null)),
  }),
  z.object({ action: z.literal('verify') }),
  z.object({ action: z.literal('unverify') }),
]);

export type ReviewInput = z.infer<typeof reviewInput>;

/**
 * Typed steps as stored: \r\n → \n, control characters other than newline
 * and tab removed. Returns null when too long (the caller answers 413/400).
 * Shown as plain text everywhere (React escapes it), never as markup.
 */
export function normalizeSteps(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  // eslint-disable-next-line no-control-regex
  const text = raw.replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
  return text.length <= MAX_STEPS_CHARS ? text : null;
}
