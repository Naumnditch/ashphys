/**
 * The wording a student agrees to when sharing a solution, and the age rule.
 * Pure (client and server): the share form shows these strings and the
 * server stores them verbatim in shared_solutions.consent_text, with
 * CONSENT_VERSION in consent_version.
 *
 * Changing any of the texts means a new CONSENT_VERSION: the server refuses a
 * submission made against an older version (the form was loaded before the
 * change), so every row records exactly what its author saw.
 */

export const CONSENT_VERSION = '2026-10-29';

export const WORKED_MYSELF_TEXT = 'I worked out this solution myself.';
export const LICENCE_TEXT =
  'I allow AshPhys to publish this solution, with my display name, on the platform and use it in future materials.';
export const PARENT_CONSENT_TEXT =
  'My parent or guardian has agreed that AshPhys may publish this solution, with my display name, on the platform and use it in future materials.';

export type AgeBand = 'under_18' | '18_plus';

export const AGE_BANDS: readonly AgeBand[] = ['under_18', '18_plus'];

export const AGE_BAND_LABEL: Record<AgeBand, string> = {
  under_18: 'I am under 18',
  '18_plus': 'I am 18 or over',
};

/** Under 18, or not said yet: a parent or guardian has to agree too. */
export function needsParentConsent(ageBand: AgeBand | null): boolean {
  return ageBand !== '18_plus';
}

/** The statements agreed to, one per line, as stored with the submission. */
export function consentText(withParent: boolean): string {
  return [WORKED_MYSELF_TEXT, LICENCE_TEXT, ...(withParent ? [PARENT_CONSENT_TEXT] : [])].join('\n');
}

/** "Ahmed Hassan" → "Ahmed H."; falls back to whichever part exists. */
export function defaultDisplayName(firstName: string | null | undefined, lastName: string | null | undefined): string {
  const first = (firstName ?? '').trim().replace(/\s+/g, ' ');
  const initial = Array.from((lastName ?? '').trim())[0];
  const name = initial ? `${first} ${initial.toLocaleUpperCase()}.`.trim() : first;
  return Array.from(name).slice(0, 40).join('').trim();
}
