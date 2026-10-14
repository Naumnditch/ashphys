'use client';

import { useEffect, useMemo, useState } from 'react';
import { parseYouTubeId } from '@/lib/youtube/videoId';
import { YouTubeEmbed } from '@/components/video/YouTubeEmbed';
import { LessonSelect } from '@/components/video/LessonSelect';
import type { LessonPickerGroup } from '@/lib/videos/lessonPicker';
import type { AdminLessonVideo } from '@/lib/videos/lessonVideos';

const input = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white';
const label = 'block text-xs font-medium text-gray-500 mb-1';

function AttachForm({ lessons, onSaved }: { lessons: LessonPickerGroup[]; onSaved: () => void }) {
  const [url, setUrl] = useState('');
  const [lessonId, setLessonId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [isPublished, setIsPublished] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  // Validated as you type, so the preview below is exactly what will be saved.
  const parsed = useMemo(() => (url.trim() ? parseYouTubeId(url) : null), [url]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMsg(null);
    if (!parsed?.ok) return setError(parsed ? parsed.error : 'Paste a YouTube link.');
    if (!lessonId) return setError('Choose a lesson.');
    if (!title.trim()) return setError('Give the video a title.');
    setSaving(true);
    try {
      const res = await fetch('/api/admin/lesson-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, lessonId, title, description, sortOrder: sortOrder === '' ? undefined : sortOrder, isPublished }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) return setError(data.error || 'Save failed');
      setMsg(isPublished ? 'Saved and published on the lesson page.' : 'Saved as a draft.');
      setUrl('');
      setTitle('');
      setDescription('');
      setSortOrder('');
      onSaved();
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={save} className="bg-white border border-gray-200 rounded-xl p-6 mb-10">
      <h2 className="font-semibold text-gray-900 mb-4">Attach a video to a lesson</h2>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label htmlFor="lv-url" className={label}>Unlisted YouTube link</label>
            <input id="lv-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://youtu.be/…" className={input} />
            {parsed && !parsed.ok && <p className="text-xs text-red-600 mt-1">{parsed.error}</p>}
            {parsed?.ok && <p className="text-xs text-green-700 mt-1">Video id {parsed.id} ✓</p>}
          </div>
          <div>
            <label htmlFor="lv-lesson" className={label}>Lesson</label>
            <LessonSelect id="lv-lesson" groups={lessons} value={lessonId} onChange={setLessonId} />
          </div>
          <div>
            <label htmlFor="lv-title" className={label}>Title</label>
            <input id="lv-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} className={input} />
          </div>
          <div>
            <label htmlFor="lv-desc" className={label}>Description (optional)</label>
            <textarea id="lv-desc" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className={input} />
          </div>
          <div className="flex items-end gap-4">
            <div className="w-28">
              <label htmlFor="lv-order" className={label}>Order</label>
              <input id="lv-order" type="number" min={0} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} placeholder="last" className={input} />
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-700 pb-2">
              <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
              Published
            </label>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {msg && <p className="text-sm text-green-700">{msg}</p>}
          <button type="submit" disabled={saving || !parsed?.ok} className="bg-gray-900 hover:bg-black text-on-ink text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50">
            {saving ? 'Saving…' : 'Save video'}
          </button>
        </div>
        <div>
          <p className={label}>Preview</p>
          {parsed?.ok ? (
            <YouTubeEmbed youtubeId={parsed.id} title={title || 'Preview'} />
          ) : (
            <div className="aspect-video w-full rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-sm text-gray-400">
              Paste a link to preview it here
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

function VideoRow({ video, onChanged }: { video: AdminLessonVideo; onChanged: () => void }) {
  const [title, setTitle] = useState(video.title);
  const [sortOrder, setSortOrder] = useState(String(video.sortOrder));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patch = async (changes: Record<string, unknown>) => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/lesson-videos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: video.id, ...changes }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) setError(data.error || 'Save failed');
      else onChanged();
    } catch {
      setError('Network error');
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm(`Remove "${video.title}" from this lesson?`)) return;
    setBusy(true);
    const res = await fetch(`/api/admin/lesson-videos?id=${video.id}`, { method: 'DELETE' });
    setBusy(false);
    if (res.ok) onChanged();
    else setError('Delete failed');
  };

  return (
    <li className="px-5 py-4 flex flex-col sm:flex-row gap-4">
      <div className="sm:w-56 flex-shrink-0">
        <YouTubeEmbed youtubeId={video.youtubeId} title={video.title} />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${video.isPublished ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
            {video.isPublished ? 'Published' : 'Draft'}
          </span>
          {video.sourceRequestId && <span className="text-[11px] text-gray-400">from a student request</span>}
        </div>
        <div className="flex gap-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={input} aria-label="Title" />
          <input value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} type="number" min={0} className={`${input} w-20`} aria-label="Order" />
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <button disabled={busy} onClick={() => patch({ title, sortOrder })} className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-900 text-on-ink disabled:opacity-50">
            Save
          </button>
          <button disabled={busy} onClick={() => patch({ isPublished: !video.isPublished })} className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
            {video.isPublished ? 'Unpublish' : 'Publish'}
          </button>
          <button disabled={busy} onClick={remove} className="text-xs font-semibold px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 disabled:opacity-50">
            Remove
          </button>
          {error && <span className="text-xs text-red-600">{error}</span>}
        </div>
      </div>
    </li>
  );
}

export function LessonVideoManager() {
  const [videos, setVideos] = useState<AdminLessonVideo[]>([]);
  const [lessons, setLessons] = useState<LessonPickerGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    try {
      const res = await fetch('/api/admin/lesson-videos');
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      setVideos(data.videos);
      setLessons(data.lessons);
      setError(null);
    } catch {
      setError('Could not load lesson videos. Have the 2026-10-14 migrations been applied?');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    load();
  }, []);

  const byLesson = useMemo(() => {
    const groups: { lessonId: string; heading: string; videos: AdminLessonVideo[] }[] = [];
    for (const v of videos) {
      let g = groups.find((x) => x.lessonId === v.lessonId);
      if (!g) {
        const course = v.courseCode && v.courseCode !== '0625' ? `${v.courseCode} · ` : '';
        g = { lessonId: v.lessonId, heading: `${course}Ch. ${v.chapterNumber} ${v.chapterTitle} · ${v.lessonName}`, videos: [] };
        groups.push(g);
      }
      g.videos.push(v);
    }
    return groups;
  }, [videos]);

  if (loading) return <p className="text-sm text-gray-400">Loading…</p>;
  if (error) return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div>
      <AttachForm lessons={lessons} onSaved={load} />
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Attached videos</h2>
      {byLesson.length === 0 ? (
        <p className="text-sm text-gray-400">No lesson videos yet.</p>
      ) : (
        <div className="space-y-6">
          {byLesson.map((g) => (
            <section key={g.lessonId}>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">
                <a href={`/lessons/${g.lessonId}`} className="hover:underline">{g.heading}</a>
              </h3>
              <ul className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
                {g.videos.map((v) => (
                  <VideoRow key={`${v.id}-${v.title}-${v.sortOrder}-${v.isPublished}`} video={v} onChanged={load} />
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
