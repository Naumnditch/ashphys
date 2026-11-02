'use client';

/**
 * Admin tool for the structured explanations: progress across the whole
 * question bank, "Rewrite remaining" (works through every pending question in
 * small batches until done or stopped), and per question a side-by-side of the
 * original and the worked solution with Regenerate, Edit and Remove.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
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

interface RewriteResult {
  id: string;
  status: 'ok' | 'needs_review' | 'error';
  issues: string[];
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Not rewritten' },
  { key: 'needs_review', label: 'Needs review' },
  { key: 'ok', label: 'Live' },
  { key: 'manual', label: 'Edited by you' },
];

const BATCH = 6;

function StatusChip({ row }: { row: Row }) {
  if (!row.structured) return <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">Not rewritten</span>;
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
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const [running, setRunning] = useState(false);
  const stopRef = useRef(false);
  const [runLog, setRunLog] = useState<{ done: number; ok: number; review: number; errors: number; lastError?: string } | null>(null);

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
      setConfigured(data.configured);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, [filter, page, search]);

  useEffect(() => {
    void load();
  }, [load]);

  async function rewriteRemaining() {
    stopRef.current = false;
    setRunning(true);
    const log = { done: 0, ok: 0, review: 0, errors: 0, lastError: undefined as string | undefined };
    setRunLog({ ...log });
    const skipIds: string[] = [];
    try {
      while (!stopRef.current) {
        const res = await fetch('/api/admin/explanations/rewrite', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ limit: BATCH, skipIds }),
        });
        const data = await res.json().catch(() => ({ success: false, error: `Server error (${res.status})` }));
        if (!data.success) {
          log.lastError = data.error;
          break;
        }
        const results: RewriteResult[] = data.results;
        if (results.length === 0) break;
        for (const r of results) {
          log.done++;
          if (r.status === 'ok') log.ok++;
          else if (r.status === 'needs_review') log.review++;
          else {
            log.errors++;
            log.lastError = r.issues[0];
            skipIds.push(r.id);
          }
        }
        setStats(data.stats);
        setRunLog({ ...log });
      }
    } catch (err) {
      log.lastError = err instanceof Error ? err.message : String(err);
    } finally {
      setRunLog({ ...log });
      setRunning(false);
      void load();
    }
  }

  const pct = stats && stats.total ? Math.round(((stats.total - stats.pending) / stats.total) * 100) : 0;
  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="space-y-5">
      {/* Progress */}
      <section className="rounded-xl border border-gray-200 bg-white p-4">
        {stats ? (
          <>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-sm text-gray-700">
                <span className="text-lg font-semibold text-gray-900">{stats.total - stats.pending}</span> of {stats.total} rewritten ·{' '}
                <span className="text-green-700">{stats.ok} live</span> ·{' '}
                <span className="text-amber-700">{stats.needsReview} need review</span> · {stats.pending} not rewritten
              </p>
              <p className="text-xs text-gray-500">{pct}%</p>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full bg-green-500 transition-all" style={{ width: `${pct}%` }} />
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">Loading progress…</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {!running ? (
            <button
              type="button"
              onClick={() => void rewriteRemaining()}
              disabled={!configured || !stats || stats.pending === 0}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Rewrite remaining ({stats?.pending ?? 0})
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                stopRef.current = true;
              }}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50"
            >
              Stop after this batch
            </button>
          )}
          {running && <span className="text-sm text-gray-600">Rewriting {BATCH} at a time… keep this tab open.</span>}
        </div>
        {!configured && (
          <p className="mt-3 text-sm text-red-700">
            ANTHROPIC_API_KEY is not set on the server, so explanations cannot be rewritten. You can still edit them by hand.
          </p>
        )}
        {runLog && (
          <p className="mt-3 text-sm text-gray-700">
            This run: {runLog.done} processed · {runLog.ok} live · {runLog.review} need review
            {runLog.errors > 0 && ` · ${runLog.errors} failed (left as not rewritten)`}
            {runLog.lastError && <span className="block text-red-700">Last error: {runLog.lastError}</span>}
          </p>
        )}
      </section>

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
          <QuestionCard key={row.id} row={row} configured={configured} disabled={running} onChanged={load} />
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

function QuestionCard({ row, configured, disabled, onChanged }: { row: Row; configured: boolean; disabled: boolean; onChanged: () => void }) {
  const [busy, setBusy] = useState<'' | 'regen' | 'save' | 'remove'>('');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(row.structured ?? '');
  const [issues, setIssues] = useState<string[] | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setDraft(row.structured ?? '');
    setIssues(null);
  }, [row.structured]);

  async function regenerate() {
    setBusy('regen');
    setMessage('');
    try {
      const res = await fetch('/api/admin/explanations/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [row.id] }),
      });
      const data = await res.json();
      if (!data.success) setMessage(data.error);
      else if (data.results[0]?.status === 'error') setMessage(data.results[0].issues[0]);
      onChanged();
    } finally {
      setBusy('');
    }
  }

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
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">Original</h3>
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-700">{row.explanation}</p>
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
            <p className="text-sm text-gray-400">Not rewritten yet. Students see the original.</p>
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
              disabled={!configured || disabled || !!busy}
              onClick={() => void regenerate()}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
            >
              {busy === 'regen' ? 'Rewriting…' : row.structured ? 'Regenerate' : 'Rewrite now'}
            </button>
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
