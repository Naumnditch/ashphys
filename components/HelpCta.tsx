'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Pages where the CTA would be redundant (it links to them) or out of place.
const HIDDEN_PREFIXES = [
  '/admin',
  '/teacher',
  '/auth',
  '/video-requests',
  '/tutoring',
  '/book',
  '/success',
  '/unsubscribe',
];

/**
 * Minimal, always-available entry point to the two help services: video
 * explanations and 1-on-1 tutoring. Mounted once in app/layout.tsx.
 *
 * `hasVideoAccess` only drives a small "Plus" hint — the real gate lives on
 * /video-requests and its API routes.
 */
export function HelpCta({ hasVideoAccess }: { hasVideoAccess: boolean }) {
  const pathname = usePathname() || '';
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const hidden = HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));

  // Close when navigating to another page.
  useEffect(() => setOpen(false), [pathname]);

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (hidden) return null;

  return (
    <div ref={rootRef} className="fixed bottom-4 right-4 z-40 print:hidden">
      {open && (
        <div
          id="help-cta-panel"
          role="dialog"
          aria-label="Get help"
          className="absolute bottom-full right-0 mb-2 w-[min(18rem,calc(100vw-2rem))] rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg"
        >
          <Link
            href="/video-requests"
            className="block rounded-lg px-3 py-2.5 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none"
          >
            <span className="block text-[12px] text-gray-500">Didn&apos;t understand yet?</span>
            <span className="flex items-center justify-between gap-2 text-sm font-semibold text-gray-900">
              <span>Request a video explanation</span>
              <span aria-hidden="true">→</span>
            </span>
            {!hasVideoAccess && (
              <span className="mt-0.5 block text-[11px] text-gray-400">Plus &amp; Pro</span>
            )}
          </Link>
          <Link
            href="/tutoring"
            className="block rounded-lg px-3 py-2.5 hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none"
          >
            <span className="block text-[12px] text-gray-500">Need a human hand?</span>
            <span className="flex items-center justify-between gap-2 text-sm font-semibold text-gray-900">
              <span>Book a tutoring session</span>
              <span aria-hidden="true">→</span>
            </span>
          </Link>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="help-cta-panel"
        className="flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .9-1 1.7" />
          <path d="M12 17h.01" />
        </svg>
        Need help?
      </button>
    </div>
  );
}
