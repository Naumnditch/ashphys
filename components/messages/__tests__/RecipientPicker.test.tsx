// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';
import type { SubscriberDTO } from '@/lib/messaging/types';
import { RecipientPicker, type Recipient } from '@/components/messages/RecipientPicker';

const TIERS = ['Free', 'Plus', 'Pro'];
const person = (i: number, first = `Student${String(i).padStart(2, '0')}`): SubscriberDTO => ({
  id: `id-${i}`,
  firstName: first,
  lastName: 'Test',
  email: `s${i}@example.com`,
  role: 'student',
  status: 'active',
  tier: i % 3,
  tierName: TIERS[i % 3],
  sectionId: null,
  sectionName: null,
  emailNotifications: true,
  joinedAt: '2026-10-01T00:00:00.000Z',
});
const EVERYONE = Array.from({ length: 25 }, (_, i) => person(i));

const reply = (subscribers: SubscriberDTO[], total = subscribers.length) =>
  new Response(JSON.stringify({ success: true, subscribers, total }), { headers: { 'Content-Type': 'application/json' } });

function Harness() {
  const [value, setValue] = useState<Recipient[]>([]);
  return <RecipientPicker value={value} onChange={setValue} />;
}

const fetchMock = vi.fn();
beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
  // jsdom has no layout, so no scrollIntoView.
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('RecipientPicker', () => {
  it('lists every student for an empty search, more than the old 10, with tier badges', async () => {
    fetchMock.mockImplementation(async () => reply(EVERYONE));
    render(<Harness />);
    fireEvent.focus(screen.getByRole('combobox'));

    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(25));
    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toBe('/api/subscribers/search?q=');
    expect(url).not.toContain('limit');
    expect(screen.getAllByText('Pro')).toHaveLength(8);
    expect(screen.getAllByText('Plus')).toHaveLength(8);
  });

  it('picking people never shrinks the list below the rest of the class', async () => {
    fetchMock.mockImplementation(async () => reply(EVERYONE));
    render(<Harness />);
    fireEvent.focus(screen.getByRole('combobox'));
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(25));

    fireEvent.click(screen.getByRole('option', { name: /Student00/ }));
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(24));
    expect(screen.getByRole('button', { name: 'Remove Student00 Test' })).toBeTruthy();
  });

  it('a slow, older response never replaces a newer one', async () => {
    let releaseFirst: (r: Response) => void = () => {};
    fetchMock.mockImplementation((url: string, init: RequestInit) => {
      if (url.endsWith('q=a')) {
        return new Promise<Response>((resolve, reject) => {
          releaseFirst = resolve;
          init.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')));
        });
      }
      return Promise.resolve(reply([person(7, 'Amira')]));
    });
    render(<Harness />);
    const input = screen.getByRole('combobox');
    fireEvent.change(input, { target: { value: 'a' } });
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    fireEvent.change(input, { target: { value: 'am' } });
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(1));

    releaseFirst(reply(EVERYONE));
    await new Promise((r) => setTimeout(r, 50));
    expect(screen.getAllByRole('option')).toHaveLength(1);
    expect(screen.getByRole('option', { name: /Amira/ })).toBeTruthy();
  });

  it('says when more people match than were returned', async () => {
    fetchMock.mockImplementation(async () => reply(EVERYONE.slice(0, 5), 30));
    render(<Harness />);
    fireEvent.focus(screen.getByRole('combobox'));
    expect(await screen.findByText('25 more people match. Keep typing to narrow it down.')).toBeTruthy();
  });
});
