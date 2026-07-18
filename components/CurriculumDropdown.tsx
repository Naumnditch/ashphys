'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
}

export function CurriculumDropdown({ chapters }: { chapters: Chapter[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-sm hover:underline flex items-center gap-1"
      >
        Curriculum
        <svg
          className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <Link
            href="/curriculum"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm font-semibold text-blue-600 hover:bg-blue-50 border-b border-gray-100"
          >
            View Full Curriculum →
          </Link>
          <ul className="py-1">
            {chapters.map((chapter) => (
              <li key={chapter.id}>
                <Link
                  href={`/curriculum/${chapter.id}`}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <span className="text-gray-400 mr-2">{chapter.chapter_number}.</span>
                  {chapter.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
