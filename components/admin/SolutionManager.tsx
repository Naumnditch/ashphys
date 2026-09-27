'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Chapter {
  id: string;
  chapter_number: number;
  title: string;
}
interface Solution {
  id: string;
  chapter: number;
  chapter_title: string | null;
  topic: string;
  problem_title: string;
  problem_number: string | null;
  difficulty: string;
  interactive_html: string | null;
  interactive_html_url: string | null;
  static_preview: string;
  description: string | null;
  tags: string[];
  solution_type: string;
  is_published: boolean;
  tier_required: string;
}

const emptyForm = {
  id: null as string | null,
  chapter: '',
  topic: '',
  problem_title: '',
  problem_number: '',
  difficulty: 'intermediate',
  interactive_html: '',
  interactive_html_url: '',
  static_preview: '',
  description: '',
  tags: '',
  solution_type: 'interactive',
  is_published: false,
  tier_required: 'free',
};

export function SolutionManager({ initialSolutions, chapters }: { initialSolutions: Solution[]; chapters: Chapter[] }) {
  const router = useRouter();
  const [solutions, setSolutions] = useState(initialSolutions);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    const res = await fetch('/api/admin/solutions');
    const data = await res.json();
    if (data.success) setSolutions(data.solutions);
  };

  const handleSave = async () => {
    if (!form.chapter || !form.topic.trim() || !form.problem_title.trim() || !form.static_preview.trim()) {
      setError('Chapter, topic, problem title, and a preview are required');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/solutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          chapter: Number(form.chapter),
          tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Save failed');
        return;
      }
      setForm(emptyForm);
      router.refresh();
      await refetch();
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this solution? Students who unlocked it keep their view history, but the content is gone.')) return;
    const res = await fetch(`/api/admin/solutions/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setSolutions((prev) => prev.filter((s) => s.id !== id));
      router.refresh();
    }
  };

  const togglePublish = async (s: Solution) => {
    const res = await fetch('/api/admin/solutions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...toForm(s), id: s.id, chapter: s.chapter, is_published: !s.is_published }),
    });
    const data = await res.json();
    if (data.success) setSolutions((prev) => prev.map((row) => (row.id === s.id ? data.solution : row)));
  };

  const loadForEdit = (s: Solution) => {
    setForm(toForm(s));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          {form.id ? 'Edit Solution' : 'Add Solution'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Chapter</label>
            <select
              value={form.chapter}
              onChange={(e) => setForm({ ...form, chapter: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Select a chapter…</option>
              {chapters.map((c) => (
                <option key={c.id} value={c.chapter_number}>Ch. {c.chapter_number} — {c.title}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Topic</label>
            <input
              type="text"
              placeholder="e.g. Circular Motion"
              value={form.topic}
              onChange={(e) => setForm({ ...form, topic: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Problem #</label>
            <input
              type="text"
              placeholder="e.g. 4b"
              value={form.problem_number}
              onChange={(e) => setForm({ ...form, problem_number: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">Problem title</label>
          <input
            type="text"
            placeholder="e.g. Ball on a string: tension at the top of the loop"
            value={form.problem_title}
            onChange={(e) => setForm({ ...form, problem_title: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Difficulty</label>
            <select
              value={form.difficulty}
              onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
            <select
              value={form.solution_type}
              onChange={(e) => setForm({ ...form, solution_type: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="interactive">Interactive</option>
              <option value="static">Static</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tier floor (beyond the view cap)</label>
            <select
              value={form.tier_required}
              onChange={(e) => setForm({ ...form, tier_required: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="free">Free — counts against the view cap</option>
              <option value="plus">Plus — Free can never open it</option>
              <option value="pro">Pro — Plus can never open it</option>
            </select>
          </div>
        </div>

        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">Static preview (everyone sees this, even when blocked)</label>
          <textarea
            rows={3}
            placeholder="Problem statement and a teaser of the setup — shown before the paywall."
            value={form.static_preview}
            onChange={(e) => setForm({ ...form, static_preview: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
          />
        </div>

        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">Interactive HTML (full step-by-step solution, inlined)</label>
          <textarea
            rows={6}
            placeholder="<div>…self-contained HTML/CSS/JS for the step-by-step walkthrough…</div>"
            value={form.interactive_html}
            onChange={(e) => setForm({ ...form, interactive_html: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono"
          />
        </div>

        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">…or an external URL instead (used only if the HTML above is empty)</label>
          <input
            type="text"
            placeholder="https://…"
            value={form.interactive_html_url}
            onChange={(e) => setForm({ ...form, interactive_html_url: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Description (optional, catalog card)</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Tags (comma-separated)</label>
            <input
              type="text"
              placeholder="circular motion, tension, energy"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 mb-4 text-sm text-gray-700">
          <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} />
          Published (visible to students)
        </label>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50"
          >
            {saving ? 'Saving…' : form.id ? 'Update Solution' : 'Save Solution'}
          </button>
          <button onClick={() => setForm(emptyForm)} className="text-sm font-medium text-gray-500 hover:text-gray-800 px-3 py-2.5">
            Clear
          </button>
        </div>
      </div>

      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">All Solutions</h2>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
        {solutions.length === 0 && <div className="px-5 py-8 text-center text-sm text-gray-400">No solutions added yet.</div>}
        {solutions.map((s) => (
          <div key={s.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <div className="font-medium text-gray-900 text-[14.5px] flex items-center gap-2">
                {s.problem_title}
                <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                  {s.tier_required}
                </span>
                {!s.is_published && (
                  <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                    draft
                  </span>
                )}
              </div>
              <div className="text-xs text-gray-400">
                Ch. {s.chapter}{s.chapter_title ? ` — ${s.chapter_title}` : ''} · {s.topic}
                {s.problem_number ? ` · #${s.problem_number}` : ''} · {s.difficulty}
              </div>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button onClick={() => togglePublish(s)} className="text-sm font-medium text-gray-600 hover:text-gray-900">
                {s.is_published ? 'Unpublish' : 'Publish'}
              </button>
              <button onClick={() => loadForEdit(s)} className="text-sm font-medium text-blue-600 hover:text-blue-800">Edit</button>
              <button onClick={() => handleDelete(s.id)} className="text-sm font-medium text-red-500 hover:text-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function toForm(s: Solution): typeof emptyForm {
  return {
    id: s.id,
    chapter: String(s.chapter),
    topic: s.topic,
    problem_title: s.problem_title,
    problem_number: s.problem_number || '',
    difficulty: s.difficulty,
    interactive_html: s.interactive_html || '',
    interactive_html_url: s.interactive_html_url || '',
    static_preview: s.static_preview,
    description: s.description || '',
    tags: (s.tags || []).join(', '),
    solution_type: s.solution_type,
    is_published: s.is_published,
    tier_required: s.tier_required,
  };
}
