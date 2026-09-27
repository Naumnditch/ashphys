'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from './api';
import { DifficultyBadge, TierBadge } from './Badges';

interface SolutionSummary {
  id: string;
  chapter: number;
  chapterTitle: string | null;
  topic: string;
  problemTitle: string;
  problemNumber: string | null;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  staticPreview: string;
  description: string | null;
  tags: string[];
  solutionType: 'interactive' | 'static';
  tierRequired: 'free' | 'plus' | 'pro';
  unlocked: boolean;
}

interface ViewerInfo {
  signedIn: boolean;
  tier: string;
  viewsUsed: number;
  viewLimit: number | null;
}

export function SolutionsCatalog({ chapters }: { chapters: { chapter_number: number; title: string }[] }) {
  const [solutions, setSolutions] = useState<SolutionSummary[] | null>(null);
  const [viewer, setViewer] = useState<ViewerInfo | null>(null);
  const [chapterFilter, setChapterFilter] = useState('');
  const [q, setQ] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<{ solutions: SolutionSummary[]; viewer: ViewerInfo }>('/api/solutions')
      .then((res) => {
        if (cancelled) return;
        setSolutions(res.solutions);
        setViewer(res.viewer);
      })
      .catch((err) => !cancelled && setError((err as Error).message));
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!solutions) return [];
    const needle = q.trim().toLowerCase();
    return solutions.filter((s) => {
      if (chapterFilter && String(s.chapter) !== chapterFilter) return false;
      if (!needle) return true;
      return (
        s.problemTitle.toLowerCase().includes(needle) ||
        s.topic.toLowerCase().includes(needle) ||
        s.tags.some((t) => t.toLowerCase().includes(needle))
      );
    });
  }, [solutions, chapterFilter, q]);

  return (
    <div>
      {viewer && <ViewsBanner viewer={viewer} />}

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by title, topic, or tag…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 min-w-[14rem] border border-gray-300 rounded-lg px-3 py-2 text-sm"
        />
        <select
          value={chapterFilter}
          onChange={(e) => setChapterFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All chapters</option>
          {chapters.map((c) => (
            <option key={c.chapter_number} value={c.chapter_number}>Ch. {c.chapter_number} — {c.title}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      {solutions === null ? (
        <p className="py-16 text-center text-sm text-gray-400">Loading…</p>
      ) : filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-gray-400">No solutions match your search yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((s) => (
            <Link
              key={s.id}
              href={`/solutions/${s.id}`}
              className="block bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-1.5 mb-2 flex-wrap">
                <DifficultyBadge difficulty={s.difficulty} />
                <TierBadge tier={s.tierRequired} />
                {s.unlocked && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                    Unlocked
                  </span>
                )}
              </div>
              <h3 className="font-semibold text-gray-900 text-[15px] leading-snug mb-1">{s.problemTitle}</h3>
              <p className="text-xs text-gray-400 mb-2">
                Ch. {s.chapter}{s.chapterTitle ? ` — ${s.chapterTitle}` : ''} · {s.topic}
                {s.problemNumber ? ` · #${s.problemNumber}` : ''}
              </p>
              <p className="text-sm text-gray-500 line-clamp-3">{s.description || stripHtml(s.staticPreview)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function ViewsBanner({ viewer }: { viewer: ViewerInfo }) {
  if (!viewer.signedIn) {
    return (
      <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
        <Link href="/auth/login" className="font-semibold underline">Sign in</Link> to open full step-by-step solutions.
      </div>
    );
  }
  if (viewer.viewLimit === null) {
    return (
      <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
        <strong>{viewer.tier}</strong> — unlimited solutions, view as many as you like.
      </div>
    );
  }
  const remaining = Math.max(0, viewer.viewLimit - viewer.viewsUsed);
  const atLimit = remaining === 0;
  return (
    <div className={`mb-6 rounded-xl border px-4 py-3 text-sm flex items-center justify-between gap-3 flex-wrap ${atLimit ? 'border-amber-200 bg-amber-50 text-amber-900' : 'border-gray-200 bg-gray-50 text-gray-700'}`}>
      <span>
        <strong>{viewer.tier}</strong> plan — {atLimit ? "you've used all your free solution views" : `${remaining} of ${viewer.viewLimit} solution views left`}.
      </span>
      {atLimit && (
        <Link href="/pricing" className="btn btn-primary text-xs px-3 py-1.5">Upgrade for more</Link>
      )}
    </div>
  );
}

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}
