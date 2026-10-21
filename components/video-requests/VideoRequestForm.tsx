'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { submitVideoRequest } from '@/lib/videoRequests/submit';
import { SCREENSHOT_ACCEPT } from '@/lib/videoRequests/screenshot';
import { returnLinkLabel } from '@/lib/videoRequests/requestLink';
import type { RequestQuestionOption } from '@/lib/videoRequests/types';

interface Chapter { id: string; chapter_number: number; title: string; }
interface Topic { id: string; chapter_id: string; topic_name: string; }

type QuestionList = { status: 'idle' | 'loading' | 'ready' | 'error'; questions: RequestQuestionOption[] };

/** The lesson's practice questions for the question dropdown (GET /api/video-requests/questions). */
async function fetchLessonQuestions(lessonId: string): Promise<RequestQuestionOption[]> {
  const res = await fetch(`/api/video-requests/questions?lesson=${encodeURIComponent(lessonId)}`);
  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.ok || !Array.isArray(data.questions)) throw new Error(data?.error ?? `HTTP ${res.status}`);
  return data.questions;
}

export function VideoRequestForm({
  chapters,
  topics,
  initialTopicId,
  initialQuestionId,
  initialQuestions,
  returnTo,
  onSubmitted,
}: {
  chapters: Chapter[];
  topics: Topic[];
  initialTopicId?: string;
  /** Pre-selected practice question of initialTopicId (from a practice page's "Request a video"). */
  initialQuestionId?: string;
  /** initialTopicId's questions, rendered by the server so the dropdown is filled at once. */
  initialQuestions?: RequestQuestionOption[];
  /** On-site path for "Back to practice" after a successful submit (checked again here). */
  returnTo?: string | null;
  /** Called after a successful submit (the dashboard reloads "Your requests"). */
  onSubmitted?: () => void;
}) {
  // ?lesson=<id> (a practice page's button or a dashboard weakness) pre-selects that lesson.
  const initialTopic = topics.find((t) => t.id === initialTopicId);
  const preselectedQuestionId =
    initialTopic && initialQuestions?.some((q) => q.id === initialQuestionId) ? initialQuestionId ?? '' : '';
  const [chapterId, setChapterId] = useState(initialTopic?.chapter_id ?? '');
  const [topicId, setTopicId] = useState(initialTopic?.id ?? '');
  // '' = "General (no specific question)".
  const [questionId, setQuestionId] = useState(preselectedQuestionId);
  const [questionNumber, setQuestionNumber] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  // Questions per lesson, fetched once each; the pre-filled lesson's come from the server.
  const questionCache = useRef(new Map<string, RequestQuestionOption[]>(
    initialTopic && initialQuestions ? [[initialTopic.id, initialQuestions]] : []
  ));
  const [questionList, setQuestionList] = useState<QuestionList>(() =>
    initialTopic && initialQuestions ? { status: 'ready', questions: initialQuestions } : { status: 'idle', questions: [] }
  );

  useEffect(() => {
    if (!topicId) {
      setQuestionList({ status: 'idle', questions: [] });
      return;
    }
    const cached = questionCache.current.get(topicId);
    if (cached) {
      setQuestionList({ status: 'ready', questions: cached });
      return;
    }
    let cancelled = false;
    setQuestionList({ status: 'loading', questions: [] });
    fetchLessonQuestions(topicId)
      .then((questions) => {
        questionCache.current.set(topicId, questions);
        if (!cancelled) setQuestionList({ status: 'ready', questions });
      })
      .catch((err) => {
        console.error('[video request] could not load the lesson questions', err);
        if (!cancelled) setQuestionList({ status: 'error', questions: [] });
      });
    return () => {
      cancelled = true;
    };
  }, [topicId]);

  const topicsForChapter = topics.filter((t) => t.chapter_id === chapterId);
  const backLabel = returnLinkLabel(returnTo ?? null);
  const chosenIsPreselected = !!questionId && questionId === preselectedQuestionId && topicId === initialTopic?.id;

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    setMsg(null);
    setSent(false);
    try {
      const result = await submitVideoRequest(
        {
          description,
          lessonId: topicId || null,
          chapterId: chapterId || null,
          questionId: questionId || null,
          // A picked question carries its own number (the server fills it in).
          questionNumber: questionId ? '' : questionNumber,
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
      setQuestionId('');
      setSent(true);
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
            <label htmlFor="vr-chapter" className="block text-xs font-medium text-gray-500 mb-1">Chapter (optional)</label>
            <select
              id="vr-chapter"
              value={chapterId}
              onChange={(e) => { setChapterId(e.target.value); setTopicId(''); setQuestionId(''); }}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Not sure / general</option>
              {chapters.map((c) => <option key={c.id} value={c.id}>Ch. {c.chapter_number} — {c.title}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="vr-lesson" className="block text-xs font-medium text-gray-500 mb-1">Lesson (optional)</label>
            <select
              id="vr-lesson"
              value={topicId}
              onChange={(e) => { setTopicId(e.target.value); setQuestionId(''); }}
              disabled={!chapterId}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm disabled:bg-gray-50"
            >
              <option value="">Whole chapter</option>
              {topicsForChapter.map((t) => <option key={t.id} value={t.id}>{t.topic_name}</option>)}
            </select>
          </div>
        </div>
        {topicId && (
          <div className="mb-3">
            <label htmlFor="vr-practice-question" className="block text-xs font-medium text-gray-500 mb-1">Question</label>
            <select
              id="vr-practice-question"
              value={questionId}
              onChange={(e) => setQuestionId(e.target.value)}
              disabled={questionList.status === 'loading'}
              aria-describedby={chosenIsPreselected ? 'vr-question-hint' : undefined}
              className={`w-full border rounded-lg px-3 py-2 text-sm disabled:bg-gray-50 ${
                chosenIsPreselected ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-200' : 'border-gray-300'
              }`}
            >
              <option value="">General (no specific question)</option>
              {questionList.questions.map((q) => (
                <option key={q.id} value={q.id}>
                  {q.id === preselectedQuestionId && topicId === initialTopic?.id ? `★ ${q.label} (where you stopped)` : q.label}
                </option>
              ))}
            </select>
            {questionList.status === 'loading' && <p className="mt-1 text-xs text-gray-400">Loading the lesson&rsquo;s questions…</p>}
            {questionList.status === 'error' && (
              <p className="mt-1 text-xs text-amber-700">Couldn&rsquo;t load this lesson&rsquo;s questions. You can still send a general request.</p>
            )}
            {chosenIsPreselected && (
              <p id="vr-question-hint" className="mt-1 text-xs text-blue-700">
                Pre-selected from your practice session. Pick another question or &ldquo;General&rdquo; if you meant a different one.
              </p>
            )}
          </div>
        )}
        {!questionId && (
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
        )}
        <div className="mb-3">
          <label htmlFor="vr-description" className="block text-xs font-medium text-gray-500 mb-1">What are you stuck on?</label>
          <textarea
            id="vr-description"
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
        {msg && (
          <p role="status" className="text-sm text-green-700 mb-3">
            {msg}
            {sent && backLabel && returnTo && (
              <>
                {' '}
                <Link href={returnTo} className="text-xs font-semibold text-blue-700 underline whitespace-nowrap">
                  ← {backLabel}
                </Link>
              </>
            )}
          </p>
        )}
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
