'use client';

import { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  CURRICULA,
  CURRICULUM_LIST,
  CURRICULUM_STORAGE_KEY,
  tryParseCurriculum,
  type CurriculumId,
} from '@/lib/curricula';
import { trackEvent } from '@/lib/analytics/client';

type Source = 'url' | 'account' | 'cookie' | 'default';

function readStored(): CurriculumId | null {
  try {
    return tryParseCurriculum(localStorage.getItem(CURRICULUM_STORAGE_KEY));
  } catch {
    return null;
  }
}

function writeStored(curriculumId: CurriculumId) {
  try {
    localStorage.setItem(CURRICULUM_STORAGE_KEY, curriculumId);
  } catch {
    // Private mode or blocked storage: the cookie and account still remember it.
  }
}

/** Saves the choice everywhere it's remembered: this browser, the cookie and (if logged in) the account. */
export function rememberCurriculum(curriculumId: CurriculumId) {
  writeStored(curriculumId);
  fetch('/api/user/preferences', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ selectedCurriculum: curriculumId }),
  }).catch(() => {});
}

interface CurriculumSelectorProps {
  selectedCurriculum: CurriculumId;
  /** Where the server's choice came from, so a choice saved only in this browser can win over the default. */
  source: Source;
  /** The page to reload with ?c=<id>. */
  basePath?: string;
}

/**
 * The curriculum switcher at the top of the curriculum page.
 *
 * The URL (?c=as) is the source of truth for what's on screen, so the page
 * renders on the server in the right curriculum and links can be shared.
 * Picking a curriculum also remembers it — in localStorage, in a cookie, and
 * on the student's account — so it's still selected next visit.
 */
export function CurriculumSelector({ selectedCurriculum, source, basePath = '/curriculum' }: CurriculumSelectorProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const stored = readStored();
    if (source === 'default' && stored && stored !== selectedCurriculum) {
      // The cookie was cleared or expired but this browser still remembers a
      // choice: restore it rather than silently falling back to IGCSE.
      rememberCurriculum(stored);
      router.replace(`${basePath}?c=${stored}`);
      return;
    }
    if (source === 'account' || source === 'cookie') writeStored(selectedCurriculum);
  }, [source, selectedCurriculum, basePath, router]);

  function select(curriculumId: CurriculumId) {
    if (curriculumId === selectedCurriculum) return;
    rememberCurriculum(curriculumId);
    trackEvent({ eventType: 'curriculum_select', metadata: { from: selectedCurriculum, to: curriculumId } });
    startTransition(() => router.push(`${basePath}?c=${curriculumId}`));
  }

  return (
    <div className="rounded-xl p-5 sm:p-6 mb-8 text-white shadow-sm bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)]">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <h2 id="curriculum-selector-label" className="font-semibold text-lg">
          Choose your curriculum
        </h2>
        <p className="text-sm text-white/80" aria-live="polite">
          {pending ? 'Loading…' : (
            <>
              Currently viewing: <strong className="text-white">{CURRICULA[selectedCurriculum].displayName}</strong>
            </>
          )}
        </p>
      </div>
      <div role="radiogroup" aria-labelledby="curriculum-selector-label" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {CURRICULUM_LIST.map((curriculum) => {
          const active = curriculum.id === selectedCurriculum;
          return (
            <button
              key={curriculum.id}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => select(curriculum.id)}
              className={`text-left rounded-lg border-2 px-4 py-3 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                active
                  ? 'bg-white text-[#5a67d8] border-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]'
                  : 'bg-white/10 border-white/30 hover:bg-white/20 hover:border-white'
              }`}
            >
              <span className="block font-semibold">{curriculum.shortName}</span>
              <span className={`block text-xs mt-0.5 ${active ? 'text-[#5a67d8]/80' : 'text-white/75'}`}>
                {curriculum.syllabusCode === 'IB' ? 'SL & HL · 2025' : `Cambridge ${curriculum.syllabusCode}`}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
