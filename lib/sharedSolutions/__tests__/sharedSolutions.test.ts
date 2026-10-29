import { describe, expect, it } from 'vitest';
import {
  consentText,
  defaultDisplayName,
  LICENCE_TEXT,
  needsParentConsent,
  PARENT_CONSENT_TEXT,
  WORKED_MYSELF_TEXT,
} from '@/lib/sharedSolutions/consent';
import { MAX_STEPS_CHARS, normalizeSteps, reviewInput, shareInput } from '@/lib/sharedSolutions/validate';

const base = { workedMyself: true, licence: true, consentVersion: 'v' };

describe('consent', () => {
  it('uses the licence line word for word', () => {
    expect(LICENCE_TEXT).toBe('I allow AshPhys to publish this solution, with my display name, on the platform and use it in future materials.');
  });

  it('stores the statements agreed to, with the parent line only when it applied', () => {
    expect(consentText(false)).toBe(`${WORKED_MYSELF_TEXT}\n${LICENCE_TEXT}`);
    expect(consentText(true)).toBe(`${WORKED_MYSELF_TEXT}\n${LICENCE_TEXT}\n${PARENT_CONSENT_TEXT}`);
  });

  it('asks for a parent unless the student said they are 18 or over', () => {
    expect(needsParentConsent(null)).toBe(true);
    expect(needsParentConsent('under_18')).toBe(true);
    expect(needsParentConsent('18_plus')).toBe(false);
  });

  it('defaults the display name to first name + last initial', () => {
    expect(defaultDisplayName('Ahmed', 'Hassan')).toBe('Ahmed H.');
    expect(defaultDisplayName('  Mary  Ann ', 'smith')).toBe('Mary Ann S.');
    expect(defaultDisplayName('Şule', 'çelik')).toBe('Şule Ç.');
    expect(defaultDisplayName('Ahmed', null)).toBe('Ahmed');
    expect(defaultDisplayName(null, null)).toBe('');
    expect(Array.from(defaultDisplayName('A'.repeat(60), 'B')).length).toBeLessThanOrEqual(40);
  });
});

describe('share form validation', () => {
  const name = (displayName: unknown) => shareInput.safeParse({ ...base, displayName });

  it('accepts names in any script and tidies the spacing', () => {
    expect(name('  Alice   A. ')).toMatchObject({ success: true, data: { displayName: 'Alice A.' } });
    expect(name("O'Brien-Smith J.").success).toBe(true);
    expect(name('Zeynep Ö.').success).toBe(true);
    expect(name('محمد ع.').success).toBe(true);
  });

  it('refuses empty, overlong, email, link and markup names', () => {
    for (const bad of ['', '   ', 'A'.repeat(41), 'alice@example.com', 'https://x.io', '<b>Al</b>', '.Alice', '123']) {
      expect(name(bad).success, bad).toBe(false);
    }
  });

  it('needs both confirmations ticked', () => {
    expect(shareInput.safeParse({ ...base, displayName: 'A', workedMyself: false }).success).toBe(false);
    expect(shareInput.safeParse({ ...base, displayName: 'A', licence: undefined }).success).toBe(false);
    expect(shareInput.safeParse({ ...base, displayName: 'A', licence: 'yes' }).success).toBe(false);
  });

  it('accepts only the two age bands', () => {
    expect(shareInput.safeParse({ ...base, displayName: 'A', ageBand: 'under_18' }).success).toBe(true);
    expect(shareInput.safeParse({ ...base, displayName: 'A', ageBand: '16' }).success).toBe(false);
  });
});

describe('typed steps', () => {
  it('normalises line endings and drops control characters, keeping tabs and newlines', () => {
    expect(normalizeSteps('a\r\nb\rc\td\u0000e\u0007')).toBe('a\nb\nc\tde');
  });

  it(`refuses non-strings and anything over ${MAX_STEPS_CHARS} characters`, () => {
    expect(normalizeSteps(42)).toBeNull();
    expect(normalizeSteps('x'.repeat(MAX_STEPS_CHARS))).toHaveLength(MAX_STEPS_CHARS);
    expect(normalizeSteps('x'.repeat(MAX_STEPS_CHARS + 1))).toBeNull();
  });
});

describe('review actions', () => {
  it('trims the rejection reason and treats a blank one as none', () => {
    expect(reviewInput.parse({ action: 'reject', reason: '  Units!  ' })).toEqual({ action: 'reject', reason: 'Units!' });
    expect(reviewInput.parse({ action: 'reject', reason: '   ' })).toEqual({ action: 'reject', reason: null });
    expect(reviewInput.parse({ action: 'reject' })).toEqual({ action: 'reject', reason: null });
    expect(reviewInput.safeParse({ action: 'reject', reason: 'x'.repeat(501) }).success).toBe(false);
  });

  it('knows approve, reject, verify and unverify only', () => {
    for (const action of ['approve', 'verify', 'unverify']) expect(reviewInput.safeParse({ action }).success).toBe(true);
    for (const action of ['withdraw', 'pending', '']) expect(reviewInput.safeParse({ action }).success).toBe(false);
  });
});
