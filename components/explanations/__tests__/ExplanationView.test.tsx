// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

vi.mock('katex/dist/katex.min.css', () => ({}));

import { ExplanationView } from '../ExplanationView';

afterEach(cleanup);

const TEXT = `### Given
- $r = 20.0\\ \\text{cm}$

### Unit conversion
$$r = 0.200\\ \\text{m}$$

### Principle
$F = k q_1 q_2 / r^2$

### Substitution and calculation
$$F = 3.37$$

### Result
$$\\boxed{F = 3.37\\ \\text{N}}$$

### Common errors
- Forgetting to square $r$.`;

describe('ExplanationView', () => {
  it('renders the six numbered sections with typeset maths', () => {
    const { container } = render(<ExplanationView text={TEXT} format="structured" />);
    expect(screen.getByText(/1\. Given/)).toBeTruthy();
    expect(screen.getByText(/6\. Common errors/)).toBeTruthy();
    expect(container.querySelectorAll('.katex').length).toBeGreaterThanOrEqual(6);
    expect(container.querySelectorAll('.katex-display').length).toBe(3);
    expect(container.textContent).not.toContain('$');
  });

  it('falls back to a plain paragraph for old explanations', () => {
    const { container } = render(<ExplanationView text="KE = ½mv². Common mistake: dropping the half." />);
    expect(container.querySelector('p')?.textContent).toBe('KE = ½mv². Common mistake: dropping the half.');
    expect(container.querySelector('.katex')).toBeNull();
  });
});
