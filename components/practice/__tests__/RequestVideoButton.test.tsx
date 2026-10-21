// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

vi.mock('next/navigation', () => ({
  usePathname: () => '/practice/11111111-1111-4111-8111-111111111111',
  useSearchParams: () => new URLSearchParams('c=as'),
}));

import { RequestVideoButton } from '@/components/practice/RequestVideoButton';

const LESSON = '11111111-1111-4111-8111-111111111111';
const QUESTION = 'aaaaaaaa-0000-4000-8000-000000000001';

afterEach(cleanup);

describe('RequestVideoButton', () => {
  it('says "this question" when a question is set', () => {
    render(<RequestVideoButton lessonId={LESSON} questionId={QUESTION} />);
    expect(screen.getByRole('link', { name: 'Request a video for this question' })).toBeTruthy();
  });

  it('says "this lesson" without a question', () => {
    render(<RequestVideoButton lessonId={LESSON} />);
    expect(screen.getByRole('link', { name: 'Request a video for this lesson' })).toBeTruthy();
    render(<RequestVideoButton lessonId={LESSON} questionId={null} />);
    expect(screen.getAllByRole('link', { name: 'Request a video for this lesson' })).toHaveLength(2);
  });

  it('takes a label override', () => {
    render(<RequestVideoButton lessonId={LESSON} questionId={QUESTION} label="Ask for a walkthrough" />);
    expect(screen.getByRole('link', { name: 'Ask for a walkthrough' })).toBeTruthy();
  });

  it('links to the Videos tab with ids and the current practice path, and has an icon and a focus ring', () => {
    render(<RequestVideoButton lessonId={LESSON} questionId={QUESTION} />);
    const link = screen.getByRole('link');
    const url = new URL(link.getAttribute('href')!, 'https://x.invalid');
    expect(url.pathname).toBe('/dashboard');
    expect(Object.fromEntries(url.searchParams)).toEqual({
      tab: 'videos',
      lesson: LESSON,
      question: QUESTION,
      from: `/practice/${LESSON}?c=as`,
    });
    expect(link.querySelector('svg[aria-hidden="true"]')).toBeTruthy();
    expect(link.className).toContain('focus-visible:ring-2');
  });
});
