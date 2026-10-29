// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ShareSolutionDialog } from '@/components/workspace/ShareSolutionDialog';
import { CONSENT_VERSION, LICENCE_TEXT, PARENT_CONSENT_TEXT, WORKED_MYSELF_TEXT } from '@/lib/sharedSolutions/consent';
import type { ShareFormDTO } from '@/lib/sharedSolutions/types';

const FORM: ShareFormDTO = { displayName: 'Alice A.', ageBand: null, consentVersion: CONSENT_VERSION, canShare: true, submissions: [] };
const SHARED = { id: 's1', status: 'pending', displayName: 'Alice A.' };

let fetchMock: ReturnType<typeof vi.fn>;

function renderDialog(form: Partial<ShareFormDTO> = {}) {
  const onShared = vi.fn();
  const onClose = vi.fn();
  render(<ShareSolutionDialog form={{ ...FORM, ...form }} shareUrl="/api/share" summary="3 strokes" onClose={onClose} onShared={onShared} />);
  return { onShared, onClose };
}

const submit = () => screen.getByRole('button', { name: 'Share for review' });
const tick = (text: string) => fireEvent.click(screen.getByLabelText(text));
const sentBody = () => JSON.parse(fetchMock.mock.calls[0][1].body);

beforeEach(() => {
  fetchMock = vi.fn(async () => new Response(JSON.stringify({ success: true, solution: SHARED }), { status: 200 }));
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('ShareSolutionDialog', () => {
  it('defaults the display name, and shows the confirmations and the licence line word for word', () => {
    renderDialog();
    expect((screen.getByLabelText('Display name') as HTMLInputElement).value).toBe('Alice A.');
    expect(screen.getByText('Shown as “Student solution by Alice A.”.')).toBeTruthy();
    expect(screen.getByLabelText(WORKED_MYSELF_TEXT)).toBeTruthy();
    expect(screen.getByLabelText(LICENCE_TEXT)).toBeTruthy();
  });

  it('under 18: the parent or guardian checkbox appears and is required', async () => {
    const { onShared } = renderDialog();
    tick(WORKED_MYSELF_TEXT);
    tick(LICENCE_TEXT);
    // Age not answered yet: can't share, and no parent box until they answer.
    expect(screen.queryByLabelText(PARENT_CONSENT_TEXT)).toBeNull();
    expect((submit() as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(screen.getByLabelText('I am under 18'));
    expect(screen.getByLabelText(PARENT_CONSENT_TEXT)).toBeTruthy();
    expect((submit() as HTMLButtonElement).disabled).toBe(true);
    fireEvent.submit(submit().closest('form')!);
    expect(fetchMock).not.toHaveBeenCalled();

    tick(PARENT_CONSENT_TEXT);
    expect((submit() as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(submit());
    await waitFor(() => expect(onShared).toHaveBeenCalledWith(SHARED));
    expect(fetchMock.mock.calls[0][0]).toBe('/api/share');
    expect(sentBody()).toEqual({
      displayName: 'Alice A.',
      workedMyself: true,
      licence: true,
      consentVersion: CONSENT_VERSION,
      ageBand: 'under_18',
      parentConsent: true,
    });
  });

  it('already said under 18: no age question, the parent checkbox is still required', () => {
    renderDialog({ ageBand: 'under_18' });
    expect(screen.queryByLabelText('I am under 18')).toBeNull();
    expect(screen.getByText(/You told us you are under 18/)).toBeTruthy();
    tick(WORKED_MYSELF_TEXT);
    tick(LICENCE_TEXT);
    expect((submit() as HTMLButtonElement).disabled).toBe(true);
    tick(PARENT_CONSENT_TEXT);
    expect((submit() as HTMLButtonElement).disabled).toBe(false);
  });

  it('18 or over: no parent checkbox; the edited display name is sent', async () => {
    const { onShared } = renderDialog({ ageBand: '18_plus' });
    expect(screen.queryByLabelText(PARENT_CONSENT_TEXT)).toBeNull();
    fireEvent.change(screen.getByLabelText('Display name'), { target: { value: '  Ally   ' } });
    tick(WORKED_MYSELF_TEXT);
    expect((submit() as HTMLButtonElement).disabled).toBe(true); // licence not accepted yet
    tick(LICENCE_TEXT);
    fireEvent.click(submit());
    await waitFor(() => expect(onShared).toHaveBeenCalled());
    expect(sentBody()).toEqual({ displayName: 'Ally', workedMyself: true, licence: true, consentVersion: CONSENT_VERSION });
  });

  it('blocks a bad display name and shows the server error', async () => {
    renderDialog({ ageBand: '18_plus' });
    tick(WORKED_MYSELF_TEXT);
    tick(LICENCE_TEXT);
    fireEvent.change(screen.getByLabelText('Display name'), { target: { value: 'me@example.com' } });
    expect((submit() as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByText(/letters, numbers, spaces/)).toBeTruthy();

    fetchMock.mockResolvedValueOnce(new Response(JSON.stringify({ success: false, error: 'You have already shared a solution to this question.' }), { status: 409 }));
    fireEvent.change(screen.getByLabelText('Display name'), { target: { value: 'Alice' } });
    fireEvent.click(submit());
    expect((await screen.findByRole('alert')).textContent).toMatch(/already shared/);
  });
});
