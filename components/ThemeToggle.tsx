'use client';

import { useEffect, useRef, useState } from 'react';
import {
  THEME_CHANGE_EVENT,
  applyTheme,
  onThemeChange,
  readStoredTheme,
  storeTheme,
  type ThemeChoice,
} from '@/lib/theme/theme';

const OPTIONS: { value: ThemeChoice; label: string; icon: React.ReactNode }[] = [
  {
    value: 'light',
    label: 'Light',
    icon: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />,
  },
  {
    value: 'system',
    label: 'System',
    icon: (
      <>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </>
    ),
  },
];

/** Light / dark / system switch for the header. A menu button so it stays compact on mobile. */
export function ThemeToggle() {
  const [choice, setChoice] = useState<ThemeChoice>('system');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setChoice(readStoredTheme());
    // Canvas sims can't follow CSS variables on their own: tell them to repaint
    // whenever the applied theme changes (toggle, or the OS preference flipping).
    return onThemeChange(() => window.dispatchEvent(new Event(THEME_CHANGE_EVENT)));
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  function pick(value: ThemeChoice) {
    setChoice(value);
    applyTheme(value);
    storeTheme(value);
    setOpen(false);
    btnRef.current?.focus();
  }

  const current = OPTIONS.find((o) => o.value === choice) ?? OPTIONS[2];

  return (
    <div className="relative" ref={ref}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Colour theme: ${current.label}. Change theme`}
        aria-haspopup="true"
        aria-expanded={open}
        className="grid h-9 w-9 place-items-center rounded-lg text-gray-700 hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-[18px] w-[18px]"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {current.icon}
        </svg>
      </button>

      {open && (
        <div
          role="group"
          aria-label="Colour theme"
          className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg py-1.5 z-50"
        >
          {OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => pick(o.value)}
              aria-pressed={choice === o.value}
              className="flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm text-gray-800 hover:bg-gray-50 focus-visible:bg-gray-100 focus-visible:outline-none"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-4 w-4 shrink-0"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {o.icon}
              </svg>
              <span className="flex-1">{o.label}</span>
              {choice === o.value && (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path d="M5 12l5 5 9-10" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
