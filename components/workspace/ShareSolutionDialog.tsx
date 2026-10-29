'use client';

/**
 * The "Share my solution" form: display name (first name + last initial by
 * default, editable), "I worked this out myself", the licence line, the age
 * question the first time, and a parent/guardian checkbox for under-18s.
 * The server checks all of it again (and the database's insert policy
 * refuses an under-18 row without parental consent).
 */

import { useEffect, useId, useRef, useState } from 'react';
import {
  AGE_BAND_LABEL,
  AGE_BANDS,
  LICENCE_TEXT,
  needsParentConsent,
  PARENT_CONSENT_TEXT,
  WORKED_MYSELF_TEXT,
  type AgeBand,
} from '@/lib/sharedSolutions/consent';
import { DISPLAY_NAME_RE, MAX_DISPLAY_NAME, normalizeDisplayName } from '@/lib/sharedSolutions/validate';
import type { MySharedSolutionDTO, ShareFormDTO } from '@/lib/sharedSolutions/types';

export function ShareSolutionDialog({
  form,
  shareUrl,
  summary,
  onClose,
  onShared,
}: {
  form: ShareFormDTO;
  /** POST endpoint: /api/practice/[topicId]/workspace/[problemId]/share */
  shareUrl: string;
  /** What is being shared, e.g. "12 strokes and your typed steps". */
  summary: string;
  onClose: () => void;
  onShared: (solution: MySharedSolutionDTO) => void;
}) {
  const ids = useId();
  const nameRef = useRef<HTMLInputElement>(null);
  const [displayName, setDisplayName] = useState(form.displayName);
  const [ageBand, setAgeBand] = useState<AgeBand | null>(form.ageBand);
  const [workedMyself, setWorkedMyself] = useState(false);
  const [licence, setLicence] = useState(false);
  const [parentConsent, setParentConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const askAge = form.ageBand === null;
  // Until they answer, the parent checkbox stays hidden but sharing stays blocked.
  const minor = ageBand !== null && needsParentConsent(ageBand);
  const name = normalizeDisplayName(displayName);
  const nameProblem = !name
    ? 'Choose a display name.'
    : Array.from(name).length > MAX_DISPLAY_NAME
      ? `Keep it to ${MAX_DISPLAY_NAME} characters.`
      : !DISPLAY_NAME_RE.test(name)
        ? 'Use letters, numbers, spaces, full stops, apostrophes and hyphens only.'
        : null;
  const ready = !nameProblem && workedMyself && licence && ageBand !== null && (!minor || parentConsent) && !submitting;

  useEffect(() => {
    nameRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && !submitting && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, submitting]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ready) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(shareUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: name,
          workedMyself,
          licence,
          consentVersion: form.consentVersion,
          ...(askAge ? { ageBand } : {}),
          ...(minor ? { parentConsent } : {}),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        setError(data?.error || `Could not share it (HTTP ${res.status}).`);
        setSubmitting(false);
        return;
      }
      onShared(data.solution);
    } catch {
      setError('Could not share it. Check your connection and try again.');
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && !submitting && onClose()}
    >
      <form
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${ids}-title`}
        onSubmit={submit}
        className="max-h-[100dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
      >
        <h2 id={`${ids}-title`} className="text-lg font-bold text-gray-900">
          Share my solution
        </h2>
        <p className="mt-1 text-sm text-gray-600">
          Shares your saved working ({summary}) as it is now. Your teacher reviews it first; once approved, students who
          open this question&rsquo;s worked solution see it next to your teacher&rsquo;s. You can withdraw it at any time.
        </p>

        <label htmlFor={`${ids}-name`} className="mt-4 block text-sm font-semibold text-gray-900">
          Display name
        </label>
        <input
          ref={nameRef}
          id={`${ids}-name`}
          type="text"
          value={displayName}
          maxLength={60}
          autoComplete="off"
          onChange={(e) => setDisplayName(e.target.value)}
          aria-describedby={`${ids}-name-help`}
          aria-invalid={!!nameProblem}
          className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-[15px] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p id={`${ids}-name-help`} className={`mt-1 text-xs ${nameProblem && displayName ? 'text-red-700' : 'text-gray-500'}`}>
          {nameProblem && displayName ? nameProblem : `Shown as “Student solution by ${name || '…'}”.`}
        </p>

        {askAge && (
          <fieldset className="mt-4">
            <legend className="text-sm font-semibold text-gray-900">How old are you?</legend>
            <div className="mt-1 flex flex-wrap gap-2">
              {AGE_BANDS.map((band) => (
                <label
                  key={band}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                    ageBand === band ? 'border-blue-400 bg-blue-50 text-blue-900' : 'border-gray-300 text-gray-700'
                  }`}
                >
                  <input type="radio" name={`${ids}-age`} value={band} checked={ageBand === band} onChange={() => setAgeBand(band)} />
                  {AGE_BAND_LABEL[band]}
                </label>
              ))}
            </div>
            <p className="mt-1 text-xs text-gray-500">We ask once and remember your answer.</p>
          </fieldset>
        )}
        {!askAge && minor && (
          <p className="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
            You told us you are under 18, so a parent or guardian needs to agree as well.
          </p>
        )}

        <div className="mt-4 space-y-3">
          <Check checked={workedMyself} onChange={setWorkedMyself}>
            {WORKED_MYSELF_TEXT}
          </Check>
          <Check checked={licence} onChange={setLicence}>
            {LICENCE_TEXT}
          </Check>
          {minor && (
            <Check checked={parentConsent} onChange={setParentConsent}>
              {PARENT_CONSENT_TEXT}
            </Check>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
            {error}
          </p>
        )}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!ready}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-on-ink hover:bg-black disabled:opacity-40"
          >
            {submitting ? 'Sharing…' : 'Share for review'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Check({ checked, onChange, children }: { checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 text-sm leading-snug text-gray-800">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 shrink-0 accent-gray-900" />
      <span>{children}</span>
    </label>
  );
}
