'use client';

/**
 * Admin tool for explanations: every question's original explanation (shown to
 * students with its equations auto-converted to LaTeX) next to an optional
 * hand-written worked solution, with Edit and Remove. No AI, no API calls.
 */

import { useCallback, useEffect, useState } from 'react';
import { ExplanationView } from '@/components/explanations/ExplanationView';

type Filter = 'all' | 'pending' | 'ok' | 'needs_review' | 'manual';

interface Stats {
  total: number;
  ok: number;
  needsReview: number;
  manual: number;
  pending: number;
}

interface Row {
  id: string;
  problemNumber: number | null;
  topicName: string | null;
  curriculumId: string | null;
  answerType: string;
  questionText: string;
  answer: string;
  explanation: string;
  structured: string | null;
  status: 'ok' | 'needs_review' | null;
  issues: string[];
  source: 'ai' | 'manual' | null;
  updatedAt: string | null;
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Original only' },
  { key: 'needs_review', label: 'Needs review' },
  { key: 'ok', label: 'Worked solution live' },
  { key: 'manual', label: 'Edited by you' },
];

function StatusChip({ row }: { row: Row }) {
  if (!row.structured) return <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">Original (auto-LaTeX)</span>;
  if (row.status === 'ok')
    return (
      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
        Live{row.source === 'manual' ? ' · edited' : ''}
      </span>
    );
  return <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">Needs review</span>;
}

export function ExplanationManager() {
  const [filter, setFilter] = useState<Filter>('all');
  const [q, setQ] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ filter, page: String(page) });
      if (search) params.set('q', search);
      const res = await fetch(`/api/admin/explanations?${params}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Could not load');
      setRows(data.rows);
      setTotal(data.total);
      setPageSize(data.pageSize);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [filter, page, search]);

  useEffect(() => {
    void load();
  }, [load]);

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-5">
      {/* Summary */}
      {stats && (
        <section className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700">
          <span className="text-lg font-semibold text-gray-900">{stats.total}</span> explanations, all shown with their
          equations in LaTeX · <span className="text-green-700">{stats.ok} with a worked solution</span>
          {stats.needsReview > 0 && <span className="text-amber-700"> · {stats.needsReview} need review</span>}
        </section>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => {
              setFilter(f.key);
              setPage(1);
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              filter === f.key ? 'bg-gray-900 text-white' : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </button>
        ))}
        <form
          className="ml-auto flex w-full gap-2 sm:w-auto"
          onSubmit={(e) => {
            e.preventDefault();
            setSearch(q);
            setPage(1);
          }}
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search question or lesson"
            className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-1.5 text-sm sm:w-64"
          />
          <button type="submit" className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50">
            Search
          </button>
        </form>
      </div>

      {error && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {loading && rows.length === 0 && <p className="text-sm text-gray-500">Loading…</p>}
      {!loading && rows.length === 0 && !error && <p className="text-sm text-gray-500">No questions here.</p>}

      <div className="space-y-4">
        {rows.map((row) => (
          <QuestionCard key={row.id} row={row} onChanged={load} />
        ))}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {page} of {pages} · {total} questions
          </span>
          <button
            type="button"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

function QuestionCard({ row, onChanged }: { row: Row; onChanged: () => void }) {
  const [busy, setBusy] = useState<'' | 'save' | 'remove'>('');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(row.structured ?? '');
  const [issues, setIssues] = useState<string[] | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setDraft(row.structured ?? '');
    setIssues(null);
  }, [row.structured]);

  async function save(force: boolean) {
    setBusy('save');
    setMessage('');
    try {
      const res = await fetch(`/api/admin/explanations/${row.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: draft, force }),
      });
      const data = await res.json();
      if (!data.success) {
        setMessage(data.error);
        return;
      }
      if (data.result.status === 'needs_review') {
        setIssues(data.result.issues);
        setMessage('Saved, but not live yet: it fails the checks below. Fix it, or publish it anyway.');
      } else {
        setEditing(false);
        onChanged();
      }
    } finally {
      setBusy('');
    }
  }

  async function remove() {
    if (!confirm('Remove the worked solution? Students will see the original explanation again.')) return;
    setBusy('remove');
    try {
      await fetch(`/api/admin/explanations/${row.id}`, { method: 'DELETE' });
      onChanged();
    } finally {
      setBusy('');
    }
  }

  const shownIssues = issues ?? (row.status === 'needs_review' ? row.issues : []);

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4">
      <header className="flex flex-wrap items-center gap-2">
        <StatusChip row={row} />
        <span className="text-xs text-gray-500">
          {row.topicName ?? 'Unassigned'}
          {row.problemNumber !== null && ` · Q${row.problemNumber}`}
          {row.curriculumId && ` · ${row.curriculumId.toUpperCase()}`}
        </span>
      </header>
      <p className="mt-2 text-sm text-gray-900">{row.questionText}</p>
      <p className="mt-1 text-sm text-gray-700">
        <span className="font-semibold">Answer:</span> {row.answer || '—'}
      </p>

      <div className="mt-3 grid gap-4 lg:grid-cols-2">
        <div className="min-w-0 rounded-lg bg-gray-50 p-3">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Original, as students see it</h3>
          <ExplanationView text={row.explanation} format="plain" />
        </div>
        <div className="min-w-0 rounded-lg border border-gray-200 p-3">
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Worked solution</h3>
          {editing ? (
            <>
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                rows={14}
                spellCheck={false}
                className="w-full rounded-lg border border-gray-300 p-2 font-mono text-xs"
              />
              <p className="mb-1 mt-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Preview</p>
              {draft.trim() ? <ExplanationView text={draft} format="structured" /> : <p className="text-sm text-gray-400">Empty</p>}
            </>
          ) : row.structured ? (
            <ExplanationView text={row.structured} format="structured" />
          ) : (
            <p className="text-sm text-gray-400">None. Students see the original (left). Click Edit to write one.</p>
          )}
        </div>
      </div>

      {shownIssues.length > 0 && (
        <ul className="mt-3 list-disc space-y-0.5 rounded-lg border border-amber-200 bg-amber-50 py-2 pl-7 pr-3 text-sm text-amber-900">
          {shownIssues.map((i, k) => (
            <li key={k}>{i}</li>
          ))}
        </ul>
      )}
      {message && <p className="mt-2 text-sm text-red-700">{message}</p>}

      <footer className="mt-3 flex flex-wrap gap-2">
        {editing ? (
          <>
            <button
              type="button"
              disabled={!!busy || !draft.trim()}
              onClick={() => void save(false)}
              className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {busy === 'save' ? 'Saving…' : 'Save'}
            </button>
            {issues && issues.length > 0 && (
              <button
                type="button"
                disabled={!!busy}
                onClick={() => void save(true)}
                className="rounded-lg border border-amber-400 bg-white px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-50 disabled:opacity-50"
              >
                Publish anyway
              </button>
            )}
            <button
              type="button"
              disabled={!!busy}
              onClick={() => {
                setEditing(false);
                setDraft(row.structured ?? '');
                setIssues(null);
                setMessage('');
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              disabled={!!busy}
              onClick={() => {
                setDraft(row.structured ?? '### Given\n\n### Unit conversion\n\n### Principle\n\n### Substitution and calculation\n\n### Result\n\n### Common errors\n');
                setEditing(true);
              }}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              Edit
            </button>
            {row.structured && (
              <button
                type="button"
                disabled={!!busy}
                onClick={() => void remove()}
                className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50 disabled:opacity-50"
              >
                {busy === 'remove' ? 'Removing…' : 'Remove'}
              </button>
            )}
          </>
        )}
      </footer>
    </article>
  );
}
