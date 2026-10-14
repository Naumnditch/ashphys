'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/messages/Modal';
import { LessonSelect } from '@/components/video/LessonSelect';
import { submitVideoRequest } from '@/lib/videoRequests/submit';
import { SCREENSHOT_ACCEPT } from '@/lib/videoRequests/screenshot';
import type { LessonPickerGroup } from '@/lib/videos/lessonPicker';

/** Who is looking — decided on the server with getUserTier (Plus and up may request). */
export type RequestViewer = 'guest' | 'free' | 'member';

const MAX_DESCRIPTION = 500;
const field = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white';
const labelCls = 'block text-xs font-semibold text-gray-600 mb-1';

function RequestForm({ onDone }: { onDone: () => void }) {
  const router = useRouter();
  const [lessons, setLessons] = useState<LessonPickerGroup[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [lessonId, setLessonId] = useState('');
  const [questionNumber, setQuestionNumber] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'idle' | 'uploading' | 'submitting'>('idle');
  const [error, setError] = useState<string | null>(null);

  // The form mounts when the dialog opens, so lessons load only then.
  useEffect(() => {
    let cancelled = false;
    fetch('/api/video-requests/lessons')
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error);
        if (!cancelled) setLessons(data.lessons);
      })
      .catch((err) => !cancelled && setLoadError(err instanceof Error && err.message ? err.message : 'Could not load lessons'));
    return () => {
      cancelled = true;
    };
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const result = await submitVideoRequest(
        { description, lessonId, questionNumber, file, requireQuestion: true },
        { onStep: (step) => setStatus(step === 'saving' ? 'submitting' : 'uploading') }
      );
      if (!result.ok) {
        setError(result.error);
        setStatus('idle');
        return;
      }
      onDone();
      router.push('/dashboard?tab=videos&request=sent');
    } catch (err) {
      console.error('[video request] unexpected failure', err);
      setError('Could not save your request: something unexpected went wrong. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <form onSubmit={submit} noValidate className="space-y-4">
      <div>
        <label htmlFor="cta-lesson" className={labelCls}>Lesson</label>
        {loadError ? (
          <p className="text-sm text-red-600">{loadError}</p>
        ) : (
          <LessonSelect id="cta-lesson" groups={lessons ?? []} value={lessonId} onChange={setLessonId} placeholder={lessons ? 'Choose a lesson…' : 'Loading lessons…'} required className={field} />
        )}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cta-question" className={labelCls}>Question number</label>
          <input id="cta-question" value={questionNumber} onChange={(e) => setQuestionNumber(e.target.value)} maxLength={40} placeholder="e.g. Q7b" className={field} />
        </div>
        <div>
          <span className={labelCls}>…or a screenshot</span>
          <label className="flex items-center gap-2 cursor-pointer text-sm border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50">
            <span className="font-semibold">Choose image</span>
            <span className="text-gray-500 truncate">{file ? file.name : 'none'}</span>
            <input type="file" accept={SCREENSHOT_ACCEPT} className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>
        </div>
      </div>
      <div>
        <label htmlFor="cta-description" className={labelCls}>What are you stuck on?</label>
        <textarea
          id="cta-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={MAX_DESCRIPTION}
          rows={3}
          placeholder="e.g. I don't see why the tension is bigger at the bottom of the circle."
          className={field}
        />
        <p className="text-[11px] text-gray-400 text-right">{description.length}/{MAX_DESCRIPTION}</p>
      </div>
      {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={status !== 'idle'} className="w-full sm:w-auto bg-gray-900 hover:bg-black text-on-ink font-semibold px-6 py-3 rounded-lg disabled:opacity-50">
        {status === 'uploading' ? 'Uploading screenshot…' : status === 'submitting' ? 'Sending…' : 'Send my request'}
      </button>
    </form>
  );
}

/**
 * Homepage hero call-to-action for personal video walkthroughs. Opens the
 * request form for Plus/Pro students, an upgrade prompt for Free students
 * and a log-in prompt for visitors — the API enforces the same rules.
 */
export function VideoRequestCta({ viewer }: { viewer: RequestViewer }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  useEffect(() => setMounted(true), []);

  return (
    <>
      <div className="text-left sm:text-center bg-white/90 backdrop-blur border border-rose-200 rounded-2xl px-4 py-4 sm:px-6 sm:py-5 shadow-sm">
        <p className="text-base sm:text-lg font-bold text-gray-900 leading-snug">
          Stuck on a question? Tell us, and we&rsquo;ll record the walkthrough.
        </p>
        <p className="text-sm text-gray-600 mt-1 mb-3">
          Request a personal video explanation for any lesson you&rsquo;re struggling with.
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          className="w-full sm:w-auto bg-rose-600 hover:bg-rose-700 text-white font-semibold px-5 py-2.5 rounded-lg text-[15px]"
        >
          🎥 Request a video walkthrough
        </button>
      </div>

      {/* Portalled to <body>: the hero's animated (transformed) wrappers would
          otherwise trap this fixed-position dialog inside the hero. */}
      {mounted && createPortal(
      <Modal
        open={open}
        onClose={close}
        title={viewer === 'member' ? 'Request a video walkthrough' : viewer === 'free' ? 'A Plus & Pro feature' : 'Log in to request a video'}
        subtitle={viewer === 'member' ? 'A teacher records it and it appears on your dashboard.' : undefined}
      >
        {viewer === 'member' ? (
          <RequestForm onDone={close} />
        ) : viewer === 'free' ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3" aria-hidden="true">🔒</div>
            <p className="text-gray-700 mb-5 max-w-sm mx-auto">
              Personal video walkthroughs come with <strong>Plus</strong> and <strong>Pro</strong>. Upgrade and send us
              the question you&rsquo;re stuck on — the video plays right on your dashboard.
            </p>
            <Link href="/pricing" className="inline-block bg-gray-900 hover:bg-black text-on-ink font-semibold px-6 py-3 rounded-lg">
              See Plus &amp; Pro plans
            </Link>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-700 mb-5">Log in to send us the question you&rsquo;re stuck on.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/auth/login" className="bg-gray-900 hover:bg-black text-on-ink font-semibold px-6 py-3 rounded-lg">Log in</Link>
              <Link href="/auth/signup" className="border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold px-6 py-3 rounded-lg">Create an account</Link>
            </div>
          </div>
        )}
      </Modal>,
      document.body
      )}
    </>
  );
}
