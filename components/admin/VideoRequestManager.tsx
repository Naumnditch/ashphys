'use client';

import { useMemo, useState } from 'react';
import { parseYouTubeId } from '@/lib/youtube/videoId';
import { YouTubeEmbed } from '@/components/video/YouTubeEmbed';
import { LessonSelect } from '@/components/video/LessonSelect';
import type { LessonPickerGroup } from '@/lib/videos/lessonPicker';
import { useAdminVideoRequests, type AdminVideoRequest } from '@/components/admin/useAdminVideoRequests';

type Req = AdminVideoRequest;

const STATUS_STYLE: Record<Req['status'], string> = {
  open: 'bg-amber-50 text-amber-700',
  in_progress: 'bg-blue-50 text-blue-700',
  fulfilled: 'bg-green-50 text-green-700',
  declined: 'bg-gray-100 text-gray-500',
};

function Editor({
  req,
  lessons,
  lessonVideosAvailable,
  onSaved,
}: {
  req: Req;
  lessons: LessonPickerGroup[];
  lessonVideosAvailable: boolean;
  onSaved: () => void;
}) {
  const [status, setStatus] = useState(req.status);
  const [youtubeUrl, setYoutubeUrl] = useState(req.youtubeUrl || '');
  const [adminNote, setAdminNote] = useState(req.adminNote || '');
  // Adding the video to a lesson is opt-in: nothing is chosen by default.
  const [attachLessonId, setAttachLessonId] = useState('');
  const [lessonVideoTitle, setLessonVideoTitle] = useState(
    req.topicName ? `Worked example: ${req.topicName}` : `Worked example: ${req.description.slice(0, 60)}`
  );
  const [publishOnLesson, setPublishOnLesson] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const parsed = useMemo(() => (youtubeUrl.trim() ? parseYouTubeId(youtubeUrl) : null), [youtubeUrl]);
  const canAttach = lessonVideosAvailable && status === 'fulfilled' && parsed?.ok === true;

  const save = async () => {
    if (parsed && !parsed.ok) {
      setError(parsed.error);
      return;
    }
    setSaving(true);
    setError(null);
    setSaved(null);
    try {
      const res = await fetch('/api/admin/video-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: req.id,
          status,
          youtubeUrl: youtubeUrl || undefined,
          adminNote: adminNote || undefined,
          ...(canAttach && attachLessonId ? { attachLessonId, lessonVideoTitle, publishOnLesson } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || 'Save failed');
        return;
      }
      setSaved(data.lessonVideo ? (data.lessonVideo.isPublished ? 'Saved — published on the lesson.' : 'Saved — added to the lesson as a draft.') : 'Saved.');
      setAttachLessonId('');
      onSaved();
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-2 items-end">
      <div>
        <label className="block text-[11px] font-medium text-gray-500 mb-1">Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value as Req['status'])} className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs">
          <option value="open">Open</option>
          <option value="in_progress">In progress</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="declined">Declined</option>
        </select>
      </div>
      <div>
        <label className="block text-[11px] font-medium text-gray-500 mb-1">Unlisted YouTube link</label>
        <input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://youtu.be/…" className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs" />
      </div>
      <div>
        <label className="block text-[11px] font-medium text-gray-500 mb-1">Note (optional)</label>
        <input value={adminNote} onChange={(e) => setAdminNote(e.target.value)} className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs" />
      </div>
      {parsed && !parsed.ok && <p className="sm:col-span-3 text-xs text-red-600">{parsed.error}</p>}
      {parsed?.ok && (
        <div className="sm:col-span-3 grid gap-3 sm:grid-cols-2 items-start">
          <div>
            <p className="text-[11px] font-medium text-gray-500 mb-1">Preview (what the student sees)</p>
            <YouTubeEmbed youtubeId={parsed.id} title="Preview" />
          </div>
          {canAttach && (
            <div className="space-y-2 bg-gray-50 border border-gray-200 rounded-lg p-3">
              <p className="text-[11px] font-semibold text-gray-700">Also add this video to a lesson? (optional)</p>
              <LessonSelect
                groups={lessons}
                value={attachLessonId}
                onChange={setAttachLessonId}
                placeholder="Don't add to a lesson"
                className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
              />
              {req.topicId && !attachLessonId && (
                <button type="button" onClick={() => setAttachLessonId(req.topicId!)} className="text-[11px] text-blue-600 underline">
                  Use the requested lesson ({req.topicName})
                </button>
              )}
              {attachLessonId && (
                <>
                  <input
                    value={lessonVideoTitle}
                    onChange={(e) => setLessonVideoTitle(e.target.value)}
                    maxLength={200}
                    aria-label="Lesson video title"
                    className="w-full border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs bg-white"
                  />
                  <label className="flex items-center gap-2 text-xs text-gray-700">
                    <input type="checkbox" checked={publishOnLesson} onChange={(e) => setPublishOnLesson(e.target.checked)} />
                    Publish on the lesson page now (otherwise saved as a draft)
                  </label>
                </>
              )}
            </div>
          )}
        </div>
      )}
      {req.lessonVideos.length > 0 && (
        <p className="sm:col-span-3 text-[11px] text-gray-500">
          On lesson{req.lessonVideos.length === 1 ? '' : 's'}:{' '}
          {req.lessonVideos.map((v, i) => (
            <span key={v.id}>
              {i > 0 && ', '}
              <a href={`/lessons/${v.lessonId}`} className="underline">{v.lessonName}</a> ({v.isPublished ? 'published' : 'draft'})
            </span>
          ))}
        </p>
      )}
      <div className="sm:col-span-3 flex items-center gap-3">
        <button onClick={save} disabled={saving} className="bg-gray-900 hover:bg-black text-on-ink text-xs font-semibold px-3.5 py-1.5 rounded-lg disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
        {error && <span className="text-xs text-red-600">{error}</span>}
        {saved && <span className="text-xs text-green-700">{saved}</span>}
      </div>
    </div>
  );
}

function shortId(id: string) {
  return id.slice(0, 8);
}

export function VideoRequestManager({ fetchImpl }: { fetchImpl?: typeof fetch } = {}) {
  const { requests, lessons, lessonVideosAvailable, loading, error, unauthorized, reload } = useAdminVideoRequests(fetchImpl);
  const [filter, setFilter] = useState<'all' | Req['status']>('all');

  const filtered = filter === 'all' ? requests : requests.filter((r) => r.status === filter);

  if (unauthorized) {
    return (
      <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
        Not authorized. Only admins can see video requests.
      </p>
    );
  }
  if (loading && requests.length === 0 && !error) {
    return (
      <p className="text-sm text-gray-400" role="status" aria-live="polite">
        Loading…
      </p>
    );
  }

  return (
    <div>
      {error && (
        <div role="alert" className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <p className="font-semibold">Could not load video requests.</p>
          <p className="mt-0.5 break-words">{error}</p>
          <button
            type="button"
            onClick={() => reload()}
            disabled={loading}
            className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg border border-red-300 bg-white hover:bg-red-50 disabled:opacity-50"
          >
            {loading ? 'Retrying…' : 'Try again'}
          </button>
        </div>
      )}
      {!lessonVideosAvailable && (
        <p className="mb-4 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Adding fulfilled videos to lessons is off until the 2026-10-14 database migrations are applied. Saving status,
          link and note works.
        </p>
      )}

      {!error && requests.length === 0 ? (
        <p className="text-sm text-gray-500">No requests yet.</p>
      ) : requests.length > 0 ? (
        <>
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(['all', 'open', 'in_progress', 'fulfilled', 'declined'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                aria-pressed={filter === f}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                  filter === f ? 'bg-gray-900 text-on-ink border-gray-900' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {f === 'all' ? 'All' : f.replace('_', ' ')}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <p className="text-sm text-gray-500">No requests with this status.</p>
          ) : (
            <ul className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100" aria-label="Video requests">
              {filtered.map((r) => (
                <li key={r.id} className="px-5 py-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap mb-1">
                    <span className="text-[13px] font-medium text-gray-900">
                      {r.studentName || r.studentEmail || 'Unknown student'}
                      {r.studentName && r.studentEmail && <span className="font-normal text-gray-500"> · {r.studentEmail}</span>}
                      <span className="ml-1.5 font-mono text-[11px] font-normal text-gray-400" title={`Student ID ${r.studentId}`}>
                        #{shortId(r.studentId)}
                      </span>
                    </span>
                    <span className={`text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${STATUS_STYLE[r.status]}`}>
                      {r.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400 mb-1.5">
                    {r.chapterTitle ? `Ch. ${r.chapterNumber} — ${r.chapterTitle}` : 'General'}
                    {r.topicName ? ` · ${r.topicName}` : ''} · {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                  {r.questionNumber && <p className="text-xs font-semibold text-gray-600 mb-1">Question: {r.questionNumber}</p>}
                  {r.question && (
                    <p className="text-xs text-gray-600 mb-1 line-clamp-3" title={r.question.text}>
                      <span className="font-semibold">{r.question.bank} practice question:</span> {r.question.text}
                    </p>
                  )}
                  <p className="text-sm text-gray-700 mb-1.5">{r.description}</p>
                  {r.screenshotUrl && (
                    <a href={r.screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 underline">
                      View screenshot
                    </a>
                  )}
                  <Editor key={r.id} req={r} lessons={lessons} lessonVideosAvailable={lessonVideosAvailable} onSaved={reload} />
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}
    </div>
  );
}
