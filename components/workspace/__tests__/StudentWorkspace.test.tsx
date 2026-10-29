// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import StudentWorkspace from '@/components/workspace/StudentWorkspace';
import { CONSENT_VERSION } from '@/lib/sharedSolutions/consent';
import type { MySharedSolutionDTO, ShareFormDTO } from '@/lib/sharedSolutions/types';

// The canvas is a lazily loaded editor; here a stub that exposes the callbacks it is given.
const editor = vi.hoisted(() => ({ props: null as null | Record<string, any> }));
vi.mock('next/dynamic', () => ({
  default: () =>
    function EditorStub(props: Record<string, any>) {
      editor.props = props;
      return <div data-testid="canvas" />;
    },
}));

const PENDING: MySharedSolutionDTO = {
  id: 'sub-1',
  questionId: 'q1',
  status: 'pending',
  verified: false,
  displayName: 'Alice A.',
  createdAt: '2026-10-29T10:00:00.000Z',
  reviewedAt: null,
  withdrawnAt: null,
  rejectionReason: null,
  strokeCount: 3,
  hasSteps: false,
};

let form: ShareFormDTO;
let fetchMock: ReturnType<typeof vi.fn>;

function canvas(status: string, strokeCount: number) {
  act(() => editor.props!.onSaveState({ status, strokeCount }));
}

const shareButton = () => screen.queryByRole('button', { name: /Share (my solution|again)/ }) as HTMLButtonElement | null;

beforeEach(() => {
  editor.props = null;
  form = { displayName: 'Alice A.', ageBand: '18_plus', consentVersion: CONSENT_VERSION, canShare: true, submissions: [] };
  fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    if (url.endsWith('/share')) return new Response(JSON.stringify({ success: true, ...form }), { status: 200 });
    if (url.startsWith('/api/shared-solutions/') && init?.method === 'PATCH') {
      return new Response(JSON.stringify({ success: true, solution: { ...PENDING, status: 'withdrawn' } }), { status: 200 });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  });
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('StudentWorkspace', () => {
  it("saves to the student's own workspace endpoint", async () => {
    render(<StudentWorkspace topicId="t1" problemId="q1" label="question 1" />);
    expect(editor.props!.endpoint).toBe('/api/practice/t1/workspace/q1');
    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith('/api/practice/t1/workspace/q1/share', expect.anything()));
  });

  it('"Share my solution" is enabled only once strokes or steps are saved', async () => {
    render(<StudentWorkspace topicId="t1" problemId="q1" label="question 1" />);
    await screen.findByRole('button', { name: 'Share my solution' });
    expect(shareButton()!.disabled).toBe(true); // still loading

    act(() => editor.props!.onLoaded({ stepsText: '' }));
    canvas('saved', 0);
    expect(shareButton()!.disabled).toBe(true); // nothing written

    canvas('saved', 3);
    expect(shareButton()!.disabled).toBe(false);

    canvas('saving', 4);
    expect(shareButton()!.disabled).toBe(true); // not saved yet

    canvas('saved', 4);
    fireEvent.click(shareButton()!);
    expect(screen.getByRole('dialog', { name: 'Share my solution' })).toBeTruthy();
    expect(screen.getByText(/4 strokes on the canvas/)).toBeTruthy();
  });

  it('typed steps alone are enough once saved', async () => {
    render(<StudentWorkspace topicId="t1" problemId="q1" label="question 1" />);
    await screen.findByRole('button', { name: 'Share my solution' });
    act(() => editor.props!.onLoaded({ stepsText: 'p = mv = 12' }));
    canvas('saved', 0);
    expect(shareButton()!.disabled).toBe(false);
    expect((screen.getByLabelText('Typed steps for question 1') as HTMLTextAreaElement).value).toBe('p = mv = 12');
  });

  it('shows a pending submission with Withdraw instead of the share button, and withdraws it', async () => {
    form.submissions = [PENDING];
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    render(<StudentWorkspace topicId="t1" problemId="q1" label="question 1" />);
    expect(await screen.findByText('Pending review')).toBeTruthy();
    expect(shareButton()).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Withdraw' }));
    expect(await screen.findByText('Withdrawn')).toBeTruthy();
    const call = fetchMock.mock.calls.find(([u]) => String(u) === '/api/shared-solutions/sub-1')!;
    expect(JSON.parse(call[1].body)).toEqual({ action: 'withdraw' });
    expect(screen.getByRole('button', { name: 'Share again' })).toBeTruthy();
  });

  it("shows the teacher's note on a rejected submission and lets the student share again", async () => {
    form.submissions = [{ ...PENDING, status: 'rejected', rejectionReason: 'Check your units.' }];
    render(<StudentWorkspace topicId="t1" problemId="q1" label="question 1" />);
    expect(await screen.findByText('Not approved')).toBeTruthy();
    expect(screen.getByText('Teacher’s note: Check your units.')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Withdraw' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Share again' })).toBeTruthy();
  });

  it('teachers get the workspace but no share button', async () => {
    form.canShare = false;
    render(<StudentWorkspace topicId="t1" problemId="q1" label="question 1" />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    await act(async () => {});
    expect(shareButton()).toBeNull();
  });
});
