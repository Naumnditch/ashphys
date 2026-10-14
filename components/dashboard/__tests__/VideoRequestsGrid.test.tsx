// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { VideoRequestsGrid } from '@/components/dashboard/VideoRequestsGrid';
import { FULFILLED, request } from './fixtures';

afterEach(cleanup);

const OPEN = request({ id: 'req-open', status: 'open', createdAt: '2026-10-13T09:00:00.000Z', description: 'Momentum Q3' });
const RECORDING = request({ id: 'req-rec', status: 'in_progress', createdAt: '2026-10-11T09:00:00.000Z', description: 'Moments Q2' });
const DECLINED = request({
  id: 'req-declined',
  status: 'declined',
  adminNote: 'This one is already covered in the lesson video.',
  createdAt: '2026-10-09T09:00:00.000Z',
  description: 'Pressure Q9',
});

describe('VideoRequestsGrid', () => {
  it('shows a fulfilled request as a thumbnail with meaningful alt text and no iframe yet', () => {
    const { container } = render(<VideoRequestsGrid requests={[FULFILLED]} />);
    const img = screen.getByRole('img', { name: /^Video for Circular motion: Question 7b: Why is the tension/ });
    expect(img.getAttribute('src')).toBe('https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg');
    expect(container.querySelector('iframe')).toBeNull();
    expect(screen.getByText('New')).toBeTruthy();
  });

  it('creates the player only on click, with autoplay and the fallback link', () => {
    const onOpen = vi.fn();
    const { container } = render(<VideoRequestsGrid requests={[FULFILLED, OPEN]} onOpen={onOpen} />);
    fireEvent.click(screen.getByRole('button', { name: /^Play: Video for Circular motion/ }));

    const iframe = container.querySelector('iframe');
    expect(iframe?.getAttribute('src')).toBe(
      'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1&playsinline=1&autoplay=1'
    );
    expect(onOpen).toHaveBeenCalledWith(FULFILLED);
    // The grid is replaced by the player.
    expect(screen.queryByText(/Momentum Q3/)).toBeNull();
    expect(screen.getByText(/See the free-body diagram/)).toBeTruthy();

    // The only YouTube link is the fallback.
    const links = Array.from(container.querySelectorAll('a[href*="youtu"]'));
    expect(links).toHaveLength(1);
    expect(links[0].textContent).toMatch(/Open on YouTube/);
    expect(links[0].getAttribute('href')).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    fireEvent.click(screen.getByRole('button', { name: '← Back to requests' }));
    expect(container.querySelector('iframe')).toBeNull();
    expect(screen.getByText(/Momentum Q3/)).toBeTruthy();
  });

  it('never renders a YouTube link, thumbnail or player for unfulfilled requests', () => {
    const { container } = render(<VideoRequestsGrid requests={[OPEN, RECORDING, DECLINED]} />);
    expect(container.querySelectorAll('a[href*="youtu"], img[src*="ytimg"], iframe')).toHaveLength(0);
  });

  it('filters by Ready, In progress and Declined, newest first, and shows the decline note', () => {
    render(<VideoRequestsGrid requests={[DECLINED, FULFILLED, RECORDING, OPEN]} />);
    const items = () => screen.getAllByRole('listitem').map((li) => li.textContent ?? '');
    expect(items().map((t) => t.match(/(Momentum Q3|Why is the tension|Moments Q2|Pressure Q9)/)?.[1])).toEqual([
      'Momentum Q3',
      'Why is the tension',
      'Moments Q2',
      'Pressure Q9',
    ]);

    fireEvent.click(screen.getByRole('button', { name: /^Ready/ }));
    expect(items()).toHaveLength(1);
    expect(items()[0]).toMatch(/Why is the tension/);

    fireEvent.click(screen.getByRole('button', { name: /^In progress/ }));
    expect(items()).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: /^Declined/ }));
    expect(items()).toHaveLength(1);
    expect(within(screen.getByRole('listitem')).getByText(/already covered in the lesson video/)).toBeTruthy();
  });

  it('labels each card with chapter, lesson, status and date', () => {
    render(<VideoRequestsGrid requests={[OPEN]} />);
    const card = screen.getByRole('listitem');
    expect(card.textContent).toMatch(/Ch\. 3 — Forces and Motion · Circular motion/);
    expect(card.textContent).toMatch(/Waiting/);
    expect(card.textContent).toMatch(/Requested 13 Oct 2026/);
  });
});
