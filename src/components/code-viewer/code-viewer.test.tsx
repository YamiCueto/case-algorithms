import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CodeViewer } from './CodeViewer';

describe('CodeViewer Component', () => {
  const sampleCode = `function add(a: number, b: number): number {\n  const sum = a + b;\n  return sum;\n}`;

  it('renders multiline code correctly with line numbers', () => {
    render(<CodeViewer code={sampleCode} language="typescript" />);

    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText(/const sum = a \+ b;/i)).toBeInTheDocument();
  });

  it('highlights the active line with code-line-active and indicator', () => {
    const { container } = render(
      <CodeViewer code={sampleCode} language="typescript" activeLine={2} />
    );

    expect(screen.getByText('Line 2 Active')).toBeInTheDocument();
    expect(screen.getByText('▶')).toBeInTheDocument();

    const activeRows = container.querySelectorAll('.code-line-active');
    expect(activeRows.length).toBe(1);
    expect(activeRows[0]?.getAttribute('aria-current')).toBe('true');
  });

  it('updates the active line when activeLine prop changes', () => {
    const { container, rerender } = render(
      <CodeViewer code={sampleCode} language="typescript" activeLine={1} />
    );

    expect(screen.getByText('Line 1 Active')).toBeInTheDocument();

    rerender(<CodeViewer code={sampleCode} language="typescript" activeLine={3} />);

    expect(screen.getByText('Line 3 Active')).toBeInTheDocument();
    const activeRows = container.querySelectorAll('.code-line-active');
    expect(activeRows.length).toBe(1);
  });

  it('renders with no active line when activeLine is undefined', () => {
    const { container } = render(
      <CodeViewer code={sampleCode} language="pseudocode" />
    );

    expect(screen.getByText('Pseudocode')).toBeInTheDocument();
    expect(screen.queryByText(/Line .* Active/i)).not.toBeInTheDocument();
    expect(container.querySelectorAll('.code-line-active').length).toBe(0);
    expect(screen.queryByText('▶')).not.toBeInTheDocument();
  });

  it('handles activeLine = 0 safely without errors or active lines', () => {
    const { container } = render(
      <CodeViewer code={sampleCode} language="typescript" activeLine={0} />
    );

    expect(screen.queryByText(/Active/i)).not.toBeInTheDocument();
    expect(container.querySelectorAll('.code-line-active').length).toBe(0);
  });

  it('handles negative activeLine safely', () => {
    const { container } = render(
      <CodeViewer code={sampleCode} language="typescript" activeLine={-5} />
    );

    expect(screen.queryByText(/Active/i)).not.toBeInTheDocument();
    expect(container.querySelectorAll('.code-line-active').length).toBe(0);
  });

  it('handles out of range activeLine safely', () => {
    const { container } = render(
      <CodeViewer code={sampleCode} language="typescript" activeLine={999} />
    );

    expect(screen.queryByText(/Active/i)).not.toBeInTheDocument();
    expect(container.querySelectorAll('.code-line-active').length).toBe(0);
  });

  it('handles empty code string without crashing', () => {
    const { container } = render(
      <CodeViewer code="" language="pseudocode" />
    );

    expect(screen.getByText('Pseudocode')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(container.querySelectorAll('.code-line-row').length).toBe(1);
  });

  it('provides accessible region, aria labels and keyboard-scrollable container', () => {
    render(<CodeViewer code={sampleCode} language="typescript" activeLine={2} />);

    const region = screen.getByRole('region', { name: /typescript viewer/i });
    expect(region).toBeInTheDocument();

    const scrollBox = screen.getByRole('group', { name: /code content/i });
    expect(scrollBox).toHaveAttribute('tabIndex', '0');
  });
});
