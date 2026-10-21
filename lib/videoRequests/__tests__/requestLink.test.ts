import { describe, expect, it } from 'vitest';
import { parseVideoRequestParams, returnLinkLabel, safeReturnPath, videoRequestHref } from '@/lib/videoRequests/requestLink';

const LESSON = '11111111-1111-4111-8111-111111111111';
const OTHER_LESSON = '22222222-2222-4222-8222-222222222222';
const QUESTION = 'aaaaaaaa-0000-4000-8000-000000000001';
const OTHER_QUESTION = 'aaaaaaaa-0000-4000-8000-000000000002';
const UNKNOWN = '99999999-9999-4999-8999-999999999999';

const lookups = {
  isKnownLesson: (id: string) => id === LESSON || id === OTHER_LESSON,
  lessonOfQuestion: (id: string) => (id === QUESTION ? LESSON : id === OTHER_QUESTION ? OTHER_LESSON : null),
};

describe('parseVideoRequestParams', () => {
  it('keeps a known lesson and a question of that lesson', () => {
    expect(parseVideoRequestParams({ lesson: LESSON, question: QUESTION, from: `/practice/${LESSON}` }, lookups)).toEqual({
      lessonId: LESSON,
      questionId: QUESTION,
      from: `/practice/${LESSON}`,
    });
  });

  it('ignores an unknown lesson id, and its question with it (a general request)', () => {
    expect(parseVideoRequestParams({ lesson: UNKNOWN, question: QUESTION }, lookups)).toEqual({ lessonId: null, questionId: null, from: null });
  });

  it('ignores an unknown question id but keeps the lesson', () => {
    expect(parseVideoRequestParams({ lesson: LESSON, question: UNKNOWN }, lookups)).toMatchObject({ lessonId: LESSON, questionId: null });
  });

  it('ignores a question from another lesson', () => {
    expect(parseVideoRequestParams({ lesson: LESSON, question: OTHER_QUESTION }, lookups)).toMatchObject({ lessonId: LESSON, questionId: null });
  });

  it('ignores ids that are not UUIDs (no lookup is trusted with them)', () => {
    const calls: string[] = [];
    const spy = { isKnownLesson: (id: string) => (calls.push(id), true), lessonOfQuestion: (id: string) => (calls.push(id), LESSON) };
    expect(parseVideoRequestParams({ lesson: "x' OR 1=1", question: '<script>' }, spy)).toEqual({ lessonId: null, questionId: null, from: null });
    expect(calls).toEqual([]);
  });

  it('a known question with no lesson param brings its own lesson', () => {
    expect(parseVideoRequestParams({ question: QUESTION }, lookups)).toMatchObject({ lessonId: LESSON, questionId: QUESTION });
  });

  it('takes the first value of a repeated param', () => {
    expect(parseVideoRequestParams({ lesson: [LESSON, OTHER_LESSON] }, lookups)).toMatchObject({ lessonId: LESSON });
  });

  it('rejects an external `from`', () => {
    for (const from of [
      'https://evil.example/practice/x',
      '//evil.example',
      '/\\evil.example',
      'javascript:alert(1)',
      `https://www.ashphys.org/practice/${LESSON}`,
      ' /practice',
    ]) {
      expect(parseVideoRequestParams({ lesson: LESSON, from }, lookups).from).toBeNull();
    }
  });
});

describe('safeReturnPath', () => {
  it('allows known practice and lesson routes, keeping only the curriculum param', () => {
    expect(safeReturnPath(`/practice/${LESSON}`)).toBe(`/practice/${LESSON}`);
    expect(safeReturnPath(`/practice/${LESSON}?c=as`)).toBe(`/practice/${LESSON}?c=as`);
    expect(safeReturnPath(`/practice/${LESSON}?c=as&next=https://evil.example#x`)).toBe(`/practice/${LESSON}?c=as`);
    expect(safeReturnPath(`/lessons/${LESSON}`)).toBe(`/lessons/${LESSON}`);
  });

  it('rejects unknown routes and tricks', () => {
    for (const from of ['/', '/admin', '/practice/not-a-uuid', `/practice/${LESSON}/../../admin`, `/practice/${LESSON}\n`, null, undefined, 42]) {
      expect(safeReturnPath(from)).toBeNull();
    }
  });

  it('labels the link by route', () => {
    expect(returnLinkLabel(`/practice/${LESSON}`)).toBe('Back to practice');
    expect(returnLinkLabel(`/lessons/${LESSON}`)).toBe('Back to the lesson');
    expect(returnLinkLabel('https://evil.example')).toBeNull();
  });
});

describe('videoRequestHref', () => {
  it('builds the dashboard link with ids only and an encoded practice path', () => {
    const href = videoRequestHref({ lessonId: LESSON, questionId: QUESTION, from: `/practice/${LESSON}?c=as` });
    const url = new URL(href, 'https://x.invalid');
    expect(url.pathname).toBe('/dashboard');
    expect(Object.fromEntries(url.searchParams)).toEqual({ tab: 'videos', lesson: LESSON, question: QUESTION, from: `/practice/${LESSON}?c=as` });
    expect(href).toContain(`from=${encodeURIComponent(`/practice/${LESSON}?c=as`)}`);
  });

  it('leaves out the question when there is none, and an unsafe from', () => {
    const url = new URL(videoRequestHref({ lessonId: LESSON, from: 'https://evil.example' }), 'https://x.invalid');
    expect(Object.fromEntries(url.searchParams)).toEqual({ tab: 'videos', lesson: LESSON });
  });
});
