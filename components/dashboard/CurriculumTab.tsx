'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { CURRICULA, CURRICULUM_LIST, type CurriculumId } from '@/lib/curricula';
import type { LessonGroup } from '@/lib/curricula/lessons';
import { LessonCard } from '@/components/curriculum/LessonCard';
import type { StudentProgress } from '@/lib/dashboard/data';
import { formatPercent } from '@/lib/dashboard/format';

interface LessonResult {
  attempted: number;
  correct: number;
}

/**
 * Browse the Curriculum tab: the chapters (units/themes) of one curriculum;
 * choosing one lists its lessons in the same panel (existing <LessonCard>)
 * with a back button. Data: the public GET /api/lessons the /curriculum page
 * mirrors. The student's own accuracy (get_student_progress) is laid over
 * each chapter, and weaknesses link to the lesson and to a video request.
 */
export function CurriculumTab({
  initialCurriculum,
  tier,
  progress,
}: {
  initialCurriculum: CurriculumId;
  tier: number;
  progress: StudentProgress | null;
}) {
  const [curriculumId, setCurriculumId] = useState<CurriculumId>(initialCurriculum);
  const [groups, setGroups] = useState<LessonGroup[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let cancelled = false;
    setGroups(null);
    setError(null);
    fetch(`/api/lessons?curriculum=${curriculumId}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || 'Could not load the curriculum');
        if (!cancelled) setGroups(data.data.groups);
      })
      .catch((err) => !cancelled && setError((err as Error).message));
    return () => {
      cancelled = true;
    };
  }, [curriculumId]);

  // Move focus to the new heading when drilling in or out (not on first
  // mount, which would pull focus away from the tab list).
  const drilled = useRef(false);
  useEffect(() => {
    if (!drilled.current) {
      drilled.current = true;
      return;
    }
    headingRef.current?.focus();
  }, [selectedKey]);

  const results = useMemo(() => {
    const map = new Map<string, LessonResult>();
    for (const ch of progress?.chapters ?? []) {
      for (const l of ch.lessons ?? []) {
        if (l.lesson_id) map.set(l.lesson_id, { attempted: l.attempted, correct: l.correct });
      }
    }
    return map;
  }, [progress]);

  const groupResult = (g: LessonGroup): LessonResult | null => {
    let attempted = 0;
    let correct = 0;
    for (const l of g.lessons) {
      const r = results.get(l.id);
      if (r) {
        attempted += r.attempted;
        correct += r.correct;
      }
    }
    return attempted ? { attempted, correct } : null;
  };

  const changeCurriculum = (id: CurriculumId) => {
    setCurriculumId(id);
    setSelectedKey(null);
    // Same persistence the /curriculum selector uses (account preference).
    fetch('/api/user/preferences', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ selectedCurriculum: id }),
    }).catch(() => {});
  };

  const selected = groups?.find((g) => g.key === selectedKey) ?? null;

  if (selected) {
    const res = groupResult(selected);
    return (
      <div>
        <button
          type="button"
          onClick={() => setSelectedKey(null)}
          className="mb-3 min-h-[44px] inline-flex items-center gap-1 rounded-lg px-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
        >
          ← All chapters
        </button>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">{selected.label}</p>
        <h2 ref={headingRef} tabIndex={-1} className="text-xl font-bold text-gray-900 mb-1 focus:outline-none">
          {selected.title}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {selected.lessons.length} lesson{selected.lessons.length === 1 ? '' : 's'}
          {res && <> · your accuracy {formatPercent(res.correct / res.attempted)} over {res.attempted} answers</>}
        </p>
        <ul className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {selected.lessons.map((l) => (
            <LessonCard key={l.id} lesson={l} selectedCurriculum={curriculumId} tier={tier} />
          ))}
        </ul>
      </div>
    );
  }

  const weaknesses = progress?.weaknesses ?? [];
  const strengths = progress?.strengths ?? [];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
        <div>
          <h2 ref={headingRef} tabIndex={-1} className="text-xl font-bold text-gray-900 focus:outline-none">
            Browse the Curriculum
          </h2>
          <p className="text-sm text-gray-500">{CURRICULA[curriculumId].displayName} — pick a chapter to see its lessons.</p>
        </div>
        <label className="text-sm text-gray-600">
          <span className="sr-only">Curriculum</span>
          <select
            value={curriculumId}
            onChange={(e) => changeCurriculum(e.target.value as CurriculumId)}
            className="min-h-[44px] border border-gray-300 rounded-lg px-3 bg-white text-sm"
          >
            {CURRICULUM_LIST.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {progress && progress.totals.attempted === 0 && progress.totals.lessons_visited === 0 && (
        <div className="mb-5 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="font-semibold text-gray-900">🚀 Start with a lesson</p>
          <p className="text-sm text-gray-700">
            Pick a chapter below, open a lesson, try its simulation and answer a few questions. Your accuracy will show up
            here as you go.
          </p>
        </div>
      )}

      {(weaknesses.length > 0 || strengths.length > 0) && (
        <div className="mb-5 grid gap-3 md:grid-cols-2">
          {strengths.length > 0 && (
            <div className="border border-gray-200 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-900 mb-1">💪 Strengths</p>
              <ul className="text-sm text-gray-700 space-y-0.5">
                {strengths.map((s) => (
                  <li key={s.chapter_id}>
                    {s.title} <span className="text-gray-500 tabular-nums">· {formatPercent(s.accuracy)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {weaknesses.length > 0 && (
            <div className="border border-amber-200 bg-amber-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-900 mb-1">🎯 Needs work</p>
              <ul className="text-sm text-gray-700 space-y-1.5">
                {weaknesses.map((w) => (
                  <li key={w.chapter_id}>
                    {w.title} <span className="text-gray-500 tabular-nums">· {formatPercent(w.accuracy)}</span>
                    {w.weakest_lesson && (
                      <span className="flex flex-wrap gap-x-3 text-xs mt-0.5">
                        <Link href={`/lessons/${w.weakest_lesson.lesson_id}`} className="font-semibold text-blue-700 hover:underline">
                          Revise {w.weakest_lesson.lesson_name} →
                        </Link>
                        <Link
                          href={`/dashboard?tab=videos&lesson=${w.weakest_lesson.lesson_id}`}
                          className="font-semibold text-rose-700 hover:underline"
                        >
                          🎥 Request a video
                        </Link>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {error ? (
        <p className="text-sm text-red-600">{error}</p>
      ) : !groups ? (
        <p className="text-sm text-gray-400">Loading chapters…</p>
      ) : (
        <ul className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {groups.map((g) => {
            const res = groupResult(g);
            return (
              <li key={g.key}>
                <button
                  type="button"
                  onClick={() => setSelectedKey(g.key)}
                  className="w-full min-h-[44px] flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus-visible:bg-blue-50"
                >
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold uppercase tracking-wide text-gray-500">{g.label}</span>
                    <span className="block font-medium text-gray-900">{g.title}</span>
                  </span>
                  <span className="shrink-0 text-right text-xs text-gray-500 tabular-nums">
                    {g.lessons.length} lesson{g.lessons.length === 1 ? '' : 's'}
                    {res && <span className="block font-semibold text-gray-700">{formatPercent(res.correct / res.attempted)} correct</span>}
                  </span>
                  <span className="text-gray-400" aria-hidden="true">›</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
