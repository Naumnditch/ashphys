'use client';

import { useState } from 'react';
import { submitVideoRequest } from '@/lib/videoRequests/submit';
import { SCREENSHOT_ACCEPT } from '@/lib/videoRequests/screenshot';

interface Chapter { id: string; chapter_number: number; title: string; }
interface Topic { id: string; chapter_id: string; topic_name: string; }
export function VideoRequestForm({
  chapters,
  topics,
  initialTopicId,
  onSubmitted,
}: {
  chapters: Chapter[];
  topics: Topic[];
  initialTopicId?: string;
  /** Called after a successful submit (the dashboard reloads "Your requests"). */
  onSubmitted?: () => void;
}) {
  // ?lesson=<id> (from a dashboard weakness) pre-selects that lesson.
  const initialTopic = topics.find((t) => t.id === initialTopicId);
  const [chapterId, setChapterId] = useState(initialTopic?.chapter_id ?? '');
  const [topicId, setTopicId] = useState(initialTopic?.id ?? '');
  const [questionNumber, setQuestionNumber] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const topicsForChapter = topics.filter((t) => t.chapter_id === chapterId);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    setMsg(null);
    try {
      const result = await submitVideoRequest(
        {
          description,
          lessonId: topicId || null,
          chapterId: chapterId || null,
          questionNumber,
          file,
        },
        { onStep: (step) => setUploading(step === 'uploading' || step === 'compressing') }
      );
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setMsg(
        result.imageSkipped
          ? `Request saved without the image (${result.imageSkipped}). Describe the question in words if it matters.`
          : 'Request submitted — a teacher will record a video for you soon.'
      );
      setDescription('');
      setQuestionNumber('');
      setFile(null);
      setChapterId('');
      setTopicId('');
      onSubmitted?.();
    } catch (err) {
      // submitVideoRequest reports every expected failure itself; this is a bug guard.
      console.error('[video request] unexpected failure', err);
      setError('Could not save your request: something unexpected went wrong. Please try again.');
    } finally {
      setUploading(false);
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Chapter (optional)</label>
            <select
              value={chapterId}
              onChange={(e) => { setChapterId(e.target.value); setTopicId(''); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Not sure / general</option>
              {chapters.map((c) => <option key={c.id} value={c.id}>Ch. {c.chapter_number} — {c.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Lesson (optional)</label>
            <select
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
              disabled={!chapterId}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:bg-gray-50"
            >
              <option value="">Whole chapter</option>
              {topicsForChapter.map((t) => <option key={t.id} value={t.id}>{t.topic_name}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="vr-question" className="block text-xs font-medium text-gray-500 mb-1">Question number (optional)</label>
          <input
            id="vr-question"
            value={questionNumber}
            onChange={(e) => setQuestionNumber(e.target.value)}
            maxLength={40}
            placeholder="e.g. Q7b"
            className="w-full sm:w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div className="mb-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">What are you stuck on?</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="e.g. Question 7b on the momentum past paper — I don't understand why the collision is treated as elastic."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-500 mb-1">Screenshot of the question (optional)</label>
          <div className="flex items-center gap-2">
            <label className="flex-shrink-0 cursor-pointer text-xs font-semibold px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">
              Choose image
              <input
                type="file"
                accept={SCREENSHOT_ACCEPT}
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </label>
            <span className="text-xs text-gray-400">{file ? file.name : 'no file chosen'}</span>
          </div>
        </div>
        {error && <p role="alert" className="text-sm text-red-600 mb-3">{error}</p>}
        {msg && <p role="status" className="text-sm text-green-700 mb-3">{msg}</p>}
        <button
          onClick={submit}
          disabled={submitting}
          className="bg-gray-900 hover:bg-black text-on-ink text-sm font-semibold px-5 py-2.5 rounded-lg disabled:opacity-50"
        >
          {uploading ? 'Uploading screenshot…' : submitting ? 'Submitting…' : 'Submit request'}
        </button>
      </div>
    </div>
  );
}
