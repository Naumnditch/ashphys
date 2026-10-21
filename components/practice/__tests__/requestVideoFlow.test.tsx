// @vitest-environment jsdom
/**
 * Practice page → "Request a video" → dashboard Videos tab, end to end in the
 * browser components: the button follows the question on screen, the click
 * lands on /dashboard?tab=videos with that lesson and question, the dashboard
 * validates the params the way app/dashboard/page.tsx does, and the form opens
 * with the lesson and question selected and editable.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const nav = vi.hoisted(() => ({ pathname: '/practice/11111111-1111-4111-8111-111111111111', search: '', navigate: vi.fn() }));

vi.mock('next/navigation', () => ({
  usePathname: () => nav.pathname,
  useSearchParams: () => new URLSearchParams(nav.search),
}));
// A client-side <Link>: record where it goes instead of navigating jsdom.
vi.mock('next/link', () => ({
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode } & Record<string, unknown>) => (
    <a
      href={href}
      {...rest}
      onClick={(e) => {
        e.preventDefault();
        nav.navigate(href);
      }}
    >
      {children}
    </a>
  ),
}));
vi.mock('@/lib/analytics/client', () => ({ trackEvent: () => {} }));
vi.mock('@/lib/activity/client', () => ({ recordActivity: () => {} }));

import { PracticePositionProvider, PracticeRequestVideoButton } from '@/components/practice/PracticePosition';
import { PracticeSession } from '@/components/practice/PracticeSession';
import { DashboardTabs } from '@/components/dashboard/DashboardTabs';
import { VideosTab } from '@/components/dashboard/VideosTab';
import { parseVideoRequestParams } from '@/lib/videoRequests/requestLink';
import type { DashboardTab } from '@/lib/dashboard/tabs';

const CHAPTER = 'cccccccc-0000-4000-8000-000000000001';
const LESSON = '11111111-1111-4111-8111-111111111111';
const OTHER_LESSON = '22222222-2222-4222-8222-222222222222';
const Q = ['aaaaaaaa-0000-4000-8000-000000000001', 'aaaaaaaa-0000-4000-8000-000000000002', 'aaaaaaaa-0000-4000-8000-000000000003'];
const OTHER_Q = 'bbbbbbbb-0000-4000-8000-000000000001';

const chapters = [{ id: CHAPTER, chapter_number: 3, title: 'Momentum' }];
const topics = [
  { id: LESSON, chapter_id: CHAPTER, topic_name: '3.1 Momentum' },
  { id: OTHER_LESSON, chapter_id: CHAPTER, topic_name: '3.2 Impulse' },
];
const questionOptions = Q.map((id, i) => ({ id, number: i + 1, label: `Q${i + 1} — Question ${i + 1} text` }));

const practiceQuestion = (id: string, number: number, lastResult: 'correct' | 'wrong' | null) => ({
  id,
  number,
  lastResult,
  questionText: `Question ${number} text`,
  imageUrl: null,
  answerType: 'numeric',
  difficultyLevel: 1,
  marks: 1,
  options: [],
  solutionId: null,
});

let posted: Record<string, unknown> | null = null;

function mockFetch() {
  return vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
    if (url.startsWith(`/api/practice/${LESSON}`)) {
      return json({
        success: true,
        data: {
          topic: { id: LESSON, name: '3.1 Momentum', chapterId: CHAPTER, chapterNumber: 3, chapterTitle: 'Momentum' },
          simulation: null,
          mastery: { correctStreak: 1, bestStreak: 1, totalAttempted: 1, totalCorrect: 1, mastered: false },
          // Q1 answered, so the session opens on Q2.
          questions: [practiceQuestion(Q[0], 1, 'correct'), practiceQuestion(Q[1], 2, null), practiceQuestion(Q[2], 3, null)],
        },
      });
    }
    if (url.startsWith('/api/video-requests/questions')) {
      const lesson = new URL(url, 'https://x.invalid').searchParams.get('lesson');
      return json({ ok: true, questions: lesson === OTHER_LESSON ? [{ id: OTHER_Q, number: 1, label: 'Q1 — Impulse question' }] : questionOptions });
    }
    if (url === '/api/video-requests' && init?.method === 'POST') {
      posted = JSON.parse(String(init.body));
      return json({ ok: true, success: true, id: 'dddddddd-0000-4000-8000-000000000001' });
    }
    if (url.startsWith('/api/video-requests')) return json({ ok: true, success: true, requests: [] });
    if (url.startsWith('/api/messages/unread-count')) return json({ success: true, count: 0 });
    return json({}, 404);
  });
}

/** What app/dashboard/page.tsx renders for a URL (its validation, with this test's catalogue). */
function renderDashboardAt(href: string) {
  window.history.replaceState(null, '', href);
  const params = Object.fromEntries(new URL(href, 'https://x.invalid').searchParams);
  const prefill = parseVideoRequestParams(params, {
    isKnownLesson: (id) => topics.some((t) => t.id === id),
    lessonOfQuestion: (id) => (Q.includes(id) ? LESSON : null),
  });
  const panels: Record<DashboardTab, React.ReactNode> = {
    messages: <p>messages</p>,
    curriculum: <p>curriculum</p>,
    classes: <p>classes</p>,
    videos: (
      <VideosTab
        canRequest
        chapters={chapters}
        topics={topics}
        initialTopicId={prefill.lessonId ?? undefined}
        initialQuestionId={prefill.questionId ?? undefined}
        initialQuestions={prefill.lessonId === LESSON ? questionOptions : []}
        returnTo={prefill.from}
      />
    ),
    tutoring: <p>tutoring</p>,
  };
  return render(<DashboardTabs tabParam={params.tab ?? null} initialRequests={[]} initialUnread={0} panels={panels} />);
}

beforeEach(() => {
  posted = null;
  nav.navigate.mockReset();
  window.localStorage.clear();
  window.history.replaceState(null, '', nav.pathname);
  vi.stubGlobal('fetch', mockFetch());
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Request a video: practice page → dashboard', () => {
  it('lands on /dashboard?tab=videos with the lesson and the question on screen selected, editable', async () => {
    // The practice page: the server said Q1 (last answered); the session shows Q2.
    render(
      <PracticePositionProvider initialQuestionId={Q[0]}>
        <PracticeRequestVideoButton lessonId={LESSON} />
        <PracticeSession topicId={LESSON} curriculumId="igcse" />
      </PracticePositionProvider>
    );
    expect(screen.getByRole('link', { name: 'Request a video for this question' }).getAttribute('data-question-id')).toBe(Q[0]);
    await screen.findByText('Question 2 text');
    const button = screen.getByRole('link', { name: 'Request a video for this question' });
    await waitFor(() => expect(button.getAttribute('data-question-id')).toBe(Q[1]));

    fireEvent.click(button);
    expect(nav.navigate).toHaveBeenCalledTimes(1);
    const href: string = nav.navigate.mock.calls[0][0];
    const url = new URL(href, 'https://x.invalid');
    expect(url.pathname).toBe('/dashboard');
    expect(Object.fromEntries(url.searchParams)).toEqual({ tab: 'videos', lesson: LESSON, question: Q[1], from: `/practice/${LESSON}` });
    expect(href).not.toContain('text'); // ids only
    cleanup();

    // The dashboard at that URL.
    renderDashboardAt(href);
    const selectedTab = screen.getAllByRole('tab').find((t) => t.getAttribute('aria-selected') === 'true');
    expect(selectedTab?.textContent).toContain('Video Solve Requests');
    expect(new URL(window.location.href).searchParams.get('tab')).toBe('videos');
    expect(new URL(window.location.href).searchParams.get('question')).toBe(Q[1]);

    const chapter = screen.getByLabelText('Chapter (optional)') as HTMLSelectElement;
    const lesson = screen.getByLabelText('Lesson (optional)') as HTMLSelectElement;
    const question = screen.getByLabelText('Question') as HTMLSelectElement;
    expect(chapter.value).toBe(CHAPTER);
    expect(lesson.value).toBe(LESSON);
    expect(question.value).toBe(Q[1]);
    expect(question.selectedOptions[0].textContent).toContain('where you stopped');
    expect([...question.options].map((o) => o.value)).toEqual(['', ...Q]);
    expect(question.options[0].textContent).toBe('General (no specific question)');

    // The student changes the question and submits.
    fireEvent.change(question, { target: { value: Q[2] } });
    fireEvent.change(screen.getByLabelText('What are you stuck on?'), { target: { value: 'Why is momentum conserved here?' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit request' }));
    await screen.findByText(/Request submitted/);
    expect(posted).toMatchObject({ lessonId: LESSON, chapterId: CHAPTER, questionId: Q[2], description: 'Why is momentum conserved here?' });
    expect(posted?.questionNumber).toBeUndefined();

    const back = screen.getByRole('link', { name: '← Back to practice' });
    expect(back.getAttribute('href')).toBe(`/practice/${LESSON}`);
  });

  it('changing the lesson reloads the question dropdown; General clears the question', async () => {
    renderDashboardAt(`/dashboard?tab=videos&lesson=${LESSON}&question=${Q[0]}`);
    const lesson = screen.getByLabelText('Lesson (optional)') as HTMLSelectElement;
    fireEvent.change(lesson, { target: { value: OTHER_LESSON } });
    const question = screen.getByLabelText('Question') as HTMLSelectElement;
    await waitFor(() => expect([...question.options].map((o) => o.value)).toEqual(['', OTHER_Q]));
    expect(question.value).toBe('');
    expect(screen.getByLabelText('Question number (optional)')).toBeTruthy();

    fireEvent.change(question, { target: { value: OTHER_Q } });
    fireEvent.change(question, { target: { value: '' } });
    fireEvent.change(screen.getByLabelText('What are you stuck on?'), { target: { value: 'General question' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit request' }));
    await screen.findByText(/Request submitted/);
    expect(posted).toMatchObject({ lessonId: OTHER_LESSON });
    expect(posted?.questionId).toBeUndefined();
  });

  it('falls back to a general request for unknown ids and drops an external from', () => {
    renderDashboardAt(`/dashboard?tab=videos&lesson=99999999-9999-4999-8999-999999999999&question=${Q[0]}&from=${encodeURIComponent('https://evil.example')}`);
    expect((screen.getByLabelText('Chapter (optional)') as HTMLSelectElement).value).toBe('');
    expect((screen.getByLabelText('Lesson (optional)') as HTMLSelectElement).value).toBe('');
    expect(screen.queryByLabelText('Question')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
