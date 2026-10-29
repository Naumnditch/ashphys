// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import SolutionsBoard from '@/components/handwriting/SolutionsBoard';
import type { HwSnapshot } from '@/lib/handwriting/types';
import type { StudentSolutionDTO } from '@/lib/sharedSolutions/types';

vi.mock('@/components/handwriting/HandwritingViewer', () => ({
  HandwritingViewer: ({ label, pages }: { label: string; pages: HwSnapshot[] }) => (
    <div role="img" aria-label={label} data-pages={pages.length} />
  ),
}));

const page: HwSnapshot = { x: 0, y: 0, width: 100, height: 60, body: '<path d="M0 0L10 10"/>' };
const solution = (over: Partial<StudentSolutionDTO>): StudentSolutionDTO => ({
  id: 's1',
  displayName: 'Alice A.',
  verified: false,
  approvedAt: '2026-10-29T10:00:00.000Z',
  pages: [page],
  stepsText: '',
  ...over,
});

afterEach(cleanup);

describe('SolutionsBoard', () => {
  it('labels the teacher solution and the student solution by display name, side by side', () => {
    render(<SolutionsBoard teacherPages={[page]} students={[solution({ verified: true })]} label="question 3" />);
    const teacher = screen.getByRole('region', { name: 'Teacher solution' });
    const student = screen.getByRole('region', { name: 'Student solution by Alice A.' });
    // Both panes are in the grid; on wide screens both show (xl:flex), narrow screens show one via the tabs.
    expect(teacher.parentElement).toBe(student.parentElement);
    expect(teacher.parentElement!.className).toContain('xl:grid-cols-2');
    expect(within(teacher).getByRole('heading').textContent).toBe('Teacher solution');
    expect(within(teacher).getByRole('img').getAttribute('aria-label')).toBe('Teacher solution to question 3');
    expect(within(student).getByRole('heading').textContent).toBe('Student solution by Alice A.');
    expect(within(student).getByText('✓ Verified against mark scheme')).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Student solution by Alice A. ✓' })).toBeTruthy();
  });

  it('shows typed steps as plain text, never markup', () => {
    render(<SolutionsBoard teacherPages={[page]} students={[solution({ pages: [], stepsText: '<b>p</b> = mv\nline 2' })]} label="q" />);
    const student = screen.getByRole('region', { name: 'Student solution by Alice A.' });
    expect(within(student).queryByRole('img')).toBeNull();
    expect(within(student).getByText(/<b>p<\/b> = mv/)).toBeTruthy();
    expect(student.querySelector('b')).toBeNull();
  });

  it('steps through several student solutions', () => {
    render(
      <SolutionsBoard
        teacherPages={[page]}
        students={[solution({}), solution({ id: 's2', displayName: 'Bora K.' })]}
        label="q"
      />
    );
    expect(screen.getByRole('region', { name: 'Student solution by Alice A.' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Next student solution' }));
    expect(screen.getByRole('region', { name: 'Student solution by Bora K.' })).toBeTruthy();
    expect(screen.getByText('2 / 2')).toBeTruthy();
  });

  it('without a teacher solution it says so and opens on the student one', () => {
    render(<SolutionsBoard teacherPages={[]} students={[solution({})]} label="q" />);
    expect(screen.getByText(/hasn’t written out a solution/)).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Student solution by Alice A.' }).getAttribute('aria-selected')).toBe('true');
  });
});
