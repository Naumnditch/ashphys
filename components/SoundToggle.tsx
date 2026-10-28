'use client';

import { useEffect, useState } from 'react';
import { SOUND_MUTED_EVENT, isSoundMuted, primeFeedback, setSoundMuted } from '@/lib/feedback';

/** Speaker button: mutes or unmutes the answer sounds (saved in localStorage). */
export function SoundToggle({ className = '' }: { className?: string }) {
  // Sound is on by default; the saved choice is read after mount (no hydration mismatch).
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setMuted(isSoundMuted());
    const onChange = (e: Event) => setMuted(!!(e as CustomEvent<boolean>).detail);
    window.addEventListener(SOUND_MUTED_EVENT, onChange);
    return () => window.removeEventListener(SOUND_MUTED_EVENT, onChange);
  }, []);

  const toggle = () => {
    const next = !muted;
    setSoundMuted(next);
    setMuted(next);
    // Turning sound on is a user gesture: unlock audio now so the next answer can play.
    if (!next) primeFeedback();
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={!muted}
      aria-label={muted ? 'Sound off. Turn sound on' : 'Sound on. Turn sound off'}
      title={muted ? 'Sound off' : 'Sound on'}
      className={`fb-press inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-700 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 ${className}`}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M11 5 6 9H3v6h3l5 4V5z" />
        {muted ? (
          <path d="m22 9-6 6M16 9l6 6" />
        ) : (
          <>
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M18.5 5.5a9 9 0 0 1 0 13" />
          </>
        )}
      </svg>
    </button>
  );
}
