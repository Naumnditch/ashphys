// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, renderHook, screen, waitFor } from '@testing-library/react';
import { VideoRequestManager } from '@/components/admin/VideoRequestManager';
import { loadAdminVideoRequests, useAdminVideoRequests, type AdminVideoRequest } from '@/components/admin/useAdminVideoRequests';

afterEach(cleanup);

const json = (status: number, body: unknown) =>
  vi.fn(async () => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })) as unknown as typeof fetch;

const ROW: AdminVideoRequest = {
  id: 'aaaaaaaa-0000-4000-8000-000000000001',
  studentId: '22222222-2222-4222-8222-222222222222',
  description: 'Why is the tension bigger at the bottom?',
  questionNumber: '7b',
  status: 'open',
  youtubeUrl: null,
  adminNote: null,
  createdAt: '2026-10-14T09:00:00.000Z',
  studentName: 'Pia Plus',
  studentEmail: 'plus@local.test',
  topicId: null,
  topicName: '3.7 Circular motion',
  chapterNumber: 3,
  chapterTitle: 'Forces and Motion',
  screenshotUrl: null,
  lessonVideos: [],
};

describe('loadAdminVideoRequests', () => {
  it('turns a JSON error into an error result', async () => {
    const r = await loadAdminVideoRequests(json(500, { success: false, error: 'column r.question_number does not exist' }));
    expect(r).toEqual({ kind: 'error', message: 'column r.question_number does not exist' });
  });

  it('turns a non-JSON 500 (the original hang) into an error result instead of throwing', async () => {
    const htmlFetch = vi.fn(async () => new Response('<html>Internal Server Error</html>', { status: 500, statusText: 'Internal Server Error' })) as unknown as typeof fetch;
    const r = await loadAdminVideoRequests(htmlFetch);
    expect(r).toEqual({ kind: 'error', message: 'The server returned 500 Internal Server Error.' });
  });

  it('turns a network failure into an error result', async () => {
    const r = await loadAdminVideoRequests(vi.fn(async () => Promise.reject(new TypeError('Failed to fetch'))) as unknown as typeof fetch);
    expect(r).toEqual({ kind: 'error', message: 'Network error: Failed to fetch' });
  });

  it('maps 401 (no user) and 403 (not admin) to unauthorized', async () => {
    expect((await loadAdminVideoRequests(json(401, { success: false, error: 'Not signed in' }))).kind).toBe('unauthorized');
    expect((await loadAdminVideoRequests(json(403, { success: false, error: 'Not authorized' }))).kind).toBe('unauthorized');
  });
});

describe('useAdminVideoRequests always ends loading', () => {
  it('when the query returns an error', async () => {
    const { result } = renderHook(() => useAdminVideoRequests(json(500, { success: false, error: 'boom' })));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('boom');
    expect(result.current.requests).toEqual([]);
  });

  it('when the user is missing', async () => {
    const { result } = renderHook(() => useAdminVideoRequests(json(401, { success: false, error: 'Not signed in' })));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.unauthorized).toBe(true);
    expect(result.current.requests).toEqual([]);
  });

  it('on success', async () => {
    const { result } = renderHook(() => useAdminVideoRequests(json(200, { success: true, requests: [ROW], lessons: [] })));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBeNull();
    expect(result.current.requests).toHaveLength(1);
  });

  it('even when the response body is not JSON', async () => {
    const htmlFetch = vi.fn(async () => new Response('oops', { status: 502 })) as unknown as typeof fetch;
    const { result } = renderHook(() => useAdminVideoRequests(htmlFetch));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toMatch(/502/);
  });
});

describe('VideoRequestManager states', () => {
  it('shows the error with role="alert" instead of hanging on Loading…', async () => {
    render(<VideoRequestManager fetchImpl={json(500, { success: false, error: 'Could not load video requests: boom' })} />);
    const alert = await screen.findByRole('alert');
    expect(alert.textContent).toMatch(/Could not load video requests: boom/);
    expect(screen.queryByText('Loading…')).toBeNull();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeTruthy();
  });

  it('shows "Not authorized" and no rows to a non-admin', async () => {
    render(<VideoRequestManager fetchImpl={json(403, { success: false, error: 'Not authorized' })} />);
    expect((await screen.findByRole('alert')).textContent).toMatch(/Not authorized/);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.queryByText('Loading…')).toBeNull();
  });

  it('shows "No requests yet." when the list is empty', async () => {
    render(<VideoRequestManager fetchImpl={json(200, { success: true, requests: [], lessons: [] })} />);
    expect(await screen.findByText('No requests yet.')).toBeTruthy();
  });

  it('lists requests with the student name and ID', async () => {
    render(<VideoRequestManager fetchImpl={json(200, { success: true, requests: [ROW], lessons: [] })} />);
    const item = await screen.findByRole('listitem');
    expect(item.textContent).toMatch(/Pia Plus/);
    expect(item.textContent).toMatch(/#22222222/);
    expect(item.textContent).toMatch(/Why is the tension bigger/);
  });
});
