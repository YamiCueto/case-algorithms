import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { CodeViewer } from './CodeViewer';
import { getHighlighterPromise, highlightCode, getTokenClassName } from './shiki-highlighter';

describe('CodeViewer Component', () => {
  const sampleTsCode = `function add(a: number, b: number): number {\n  const sum = a + b;\n  return sum;\n}`;
  const samplePseudocode = `procedure bubbleSort(A: list of sortable items)\n  n := length(A)\n  if n <= 1 then return\nend procedure`;

  beforeEach(async () => {
    await getHighlighterPromise();
  });

  it('renders multiline TypeScript code correctly with line numbers', async () => {
    render(<CodeViewer code={sampleTsCode} language="typescript" />);

    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('add')).toBeInTheDocument();
    });
  });

  it('renders and tokenizes TypeScript syntax with distinct token classes', async () => {
    const { container } = render(<CodeViewer code={sampleTsCode} language="typescript" />);

    await waitFor(() => {
      const keywords = container.querySelectorAll('.shiki-token-keyword');
      expect(keywords.length).toBeGreaterThan(0);
    });

    const functions = container.querySelectorAll('.shiki-token-function');
    expect(functions.length).toBeGreaterThan(0);
  });

  it('renders and tokenizes Pseudocode with distinct token classes', async () => {
    const { container } = render(<CodeViewer code={samplePseudocode} language="pseudocode" />);

    expect(screen.getByText('Pseudocode')).toBeInTheDocument();

    await waitFor(() => {
      const keywords = container.querySelectorAll('.shiki-token-keyword');
      expect(keywords.length).toBeGreaterThan(0);
      expect(screen.getByText('procedure')).toBeInTheDocument();
      expect(screen.getByText('bubbleSort')).toBeInTheDocument();
    });
  });

  it('highlights the active line with code-line-active, indicator and active badge', () => {
    const { container } = render(
      <CodeViewer code={sampleTsCode} language="typescript" activeLine={2} />
    );

    expect(screen.getByText('Line 2 Active')).toBeInTheDocument();
    expect(screen.getByText('▶')).toBeInTheDocument();

    const activeRows = container.querySelectorAll('.code-line-active');
    expect(activeRows.length).toBe(1);
    expect(activeRows[0]?.getAttribute('aria-current')).toBe('true');
  });

  it('updates the active line when activeLine prop changes', () => {
    const { container, rerender } = render(
      <CodeViewer code={sampleTsCode} language="typescript" activeLine={1} />
    );

    expect(screen.getByText('Line 1 Active')).toBeInTheDocument();

    rerender(<CodeViewer code={sampleTsCode} language="typescript" activeLine={3} />);

    expect(screen.getByText('Line 3 Active')).toBeInTheDocument();
    const activeRows = container.querySelectorAll('.code-line-active');
    expect(activeRows.length).toBe(1);
  });

  it('renders with no active line when activeLine is undefined', () => {
    const { container } = render(
      <CodeViewer code={samplePseudocode} language="pseudocode" />
    );

    expect(screen.getByText('Pseudocode')).toBeInTheDocument();
    expect(screen.queryByText(/Line .* Active/i)).not.toBeInTheDocument();
    expect(container.querySelectorAll('.code-line-active').length).toBe(0);
    expect(screen.queryByText('▶')).not.toBeInTheDocument();
  });

  it('handles activeLine = 0 safely without errors or active lines', () => {
    const { container } = render(
      <CodeViewer code={sampleTsCode} language="typescript" activeLine={0} />
    );

    expect(screen.queryByText(/Active/i)).not.toBeInTheDocument();
    expect(container.querySelectorAll('.code-line-active').length).toBe(0);
  });

  it('handles negative activeLine safely', () => {
    const { container } = render(
      <CodeViewer code={sampleTsCode} language="typescript" activeLine={-5} />
    );

    expect(screen.queryByText(/Active/i)).not.toBeInTheDocument();
    expect(container.querySelectorAll('.code-line-active').length).toBe(0);
  });

  it('handles out of range activeLine safely', () => {
    const { container } = render(
      <CodeViewer code={sampleTsCode} language="typescript" activeLine={999} />
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
    render(<CodeViewer code={sampleTsCode} language="typescript" activeLine={2} />);

    const region = screen.getByRole('region', { name: /typescript viewer/i });
    expect(region).toBeInTheDocument();

    const scrollBox = screen.getByRole('group', { name: /code content/i });
    expect(scrollBox).toHaveAttribute('tabIndex', '0');
  });

  it('executes auto-scroll when active line is outside viewport', () => {
    const longCode = Array.from({ length: 40 }, (_, i) => `const line${i + 1} = ${i + 1};`).join('\n');
    const { container, rerender } = render(
      <CodeViewer code={longCode} language="typescript" activeLine={1} />
    );

    const scrollBox = container.querySelector('.code-viewer-scroll-box') as HTMLDivElement;
    expect(scrollBox).toBeInTheDocument();

    const scrollToMock = vi.fn();
    scrollBox.scrollTo = scrollToMock;

    rerender(<CodeViewer code={longCode} language="typescript" activeLine={35} />);
    expect(screen.getByText('Line 35 Active')).toBeInTheDocument();
  });

  it('does not scroll when active line is already within the pedagogical comfort zone', () => {
    const code = Array.from({ length: 30 }, (_, i) => `const val${i + 1} = ${i + 1};`).join('\n');
    const { container, rerender } = render(
      <CodeViewer code={code} language="typescript" activeLine={5} />
    );

    const scrollBox = container.querySelector('.code-viewer-scroll-box') as HTMLDivElement;
    Object.defineProperty(scrollBox, 'clientHeight', { value: 300, configurable: true });
    Object.defineProperty(scrollBox, 'scrollHeight', { value: 900, configurable: true });
    scrollBox.scrollTop = 0;

    const rows = container.querySelectorAll('.code-line-row');
    rows.forEach((row, idx) => {
      Object.defineProperty(row, 'offsetTop', { value: idx * 24, configurable: true });
      Object.defineProperty(row, 'offsetHeight', { value: 24, configurable: true });
    });

    const scrollToMock = vi.fn();
    scrollBox.scrollTo = scrollToMock;

    rerender(<CodeViewer code={code} language="typescript" activeLine={6} />);
    expect(scrollToMock).not.toHaveBeenCalled();
  });

  it('scrolls with buffer when active line approaches the lower boundary', () => {
    const code = Array.from({ length: 30 }, (_, i) => `const val${i + 1} = ${i + 1};`).join('\n');
    const { container, rerender } = render(
      <CodeViewer code={code} language="typescript" activeLine={1} />
    );

    const scrollBox = container.querySelector('.code-viewer-scroll-box') as HTMLDivElement;
    Object.defineProperty(scrollBox, 'clientHeight', { value: 300, configurable: true });
    Object.defineProperty(scrollBox, 'scrollHeight', { value: 900, configurable: true });
    scrollBox.scrollTop = 0;

    const rows = container.querySelectorAll('.code-line-row');
    rows.forEach((row, idx) => {
      Object.defineProperty(row, 'offsetTop', { value: idx * 24, configurable: true });
      Object.defineProperty(row, 'offsetHeight', { value: 24, configurable: true });
    });

    const scrollToMock = vi.fn();
    scrollBox.scrollTo = scrollToMock;

    rerender(<CodeViewer code={code} language="typescript" activeLine={12} />);
    expect(scrollToMock).toHaveBeenCalledTimes(1);
    expect(scrollToMock).toHaveBeenCalledWith(
      expect.objectContaining({
        top: expect.any(Number),
      })
    );
    const scrollArg = scrollToMock.mock.calls[0]?.[0] as { top: number; behavior: string };
    expect(scrollArg.top).toBeGreaterThan(0);
  });

  it('scrolls with buffer when active line approaches the upper boundary', () => {
    const code = Array.from({ length: 30 }, (_, i) => `const val${i + 1} = ${i + 1};`).join('\n');
    const { container, rerender } = render(
      <CodeViewer code={code} language="typescript" activeLine={20} />
    );

    const scrollBox = container.querySelector('.code-viewer-scroll-box') as HTMLDivElement;
    Object.defineProperty(scrollBox, 'clientHeight', { value: 300, configurable: true });
    Object.defineProperty(scrollBox, 'scrollHeight', { value: 900, configurable: true });
    scrollBox.scrollTop = 400;

    const rows = container.querySelectorAll('.code-line-row');
    rows.forEach((row, idx) => {
      Object.defineProperty(row, 'offsetTop', { value: idx * 24, configurable: true });
      Object.defineProperty(row, 'offsetHeight', { value: 24, configurable: true });
    });

    const scrollToMock = vi.fn();
    scrollBox.scrollTo = scrollToMock;

    rerender(<CodeViewer code={code} language="typescript" activeLine={8} />);
    expect(scrollToMock).toHaveBeenCalledTimes(1);
    const scrollArg = scrollToMock.mock.calls[0]?.[0] as { top: number; behavior: string };
    expect(scrollArg.top).toBeLessThan(400);
  });

  it('handles first line without negative scroll and last line within bounds', () => {
    const code = Array.from({ length: 25 }, (_, i) => `const val${i + 1} = ${i + 1};`).join('\n');
    const { container, rerender } = render(
      <CodeViewer code={code} language="typescript" activeLine={15} />
    );

    const scrollBox = container.querySelector('.code-viewer-scroll-box') as HTMLDivElement;
    Object.defineProperty(scrollBox, 'clientHeight', { value: 300, configurable: true });
    Object.defineProperty(scrollBox, 'scrollHeight', { value: 600, configurable: true });
    scrollBox.scrollTop = 200;

    const rows = container.querySelectorAll('.code-line-row');
    rows.forEach((row, idx) => {
      Object.defineProperty(row, 'offsetTop', { value: idx * 24, configurable: true });
      Object.defineProperty(row, 'offsetHeight', { value: 24, configurable: true });
    });

    const scrollToMock = vi.fn();
    scrollBox.scrollTo = scrollToMock;

    rerender(<CodeViewer code={code} language="typescript" activeLine={1} />);
    expect(scrollToMock).toHaveBeenCalledWith(
      expect.objectContaining({
        top: 0,
      })
    );

    rerender(<CodeViewer code={code} language="typescript" activeLine={25} />);
    const lastCall = scrollToMock.mock.calls[scrollToMock.mock.calls.length - 1]?.[0] as {
      top: number;
    };
    expect(lastCall.top).toBeLessThanOrEqual(300);
    expect(lastCall.top).toBeGreaterThanOrEqual(0);
  });

  it('uses instant behavior when prefers-reduced-motion is requested', () => {
    const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion: reduce'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));
    window.matchMedia = matchMediaMock;

    const code = Array.from({ length: 30 }, (_, i) => `const val${i + 1} = ${i + 1};`).join('\n');
    const { container, rerender } = render(
      <CodeViewer code={code} language="typescript" activeLine={1} />
    );

    const scrollBox = container.querySelector('.code-viewer-scroll-box') as HTMLDivElement;
    Object.defineProperty(scrollBox, 'clientHeight', { value: 300, configurable: true });
    Object.defineProperty(scrollBox, 'scrollHeight', { value: 900, configurable: true });
    scrollBox.scrollTop = 0;

    const rows = container.querySelectorAll('.code-line-row');
    rows.forEach((row, idx) => {
      Object.defineProperty(row, 'offsetTop', { value: idx * 24, configurable: true });
      Object.defineProperty(row, 'offsetHeight', { value: 24, configurable: true });
    });

    const scrollToMock = vi.fn();
    scrollBox.scrollTo = scrollToMock;

    rerender(<CodeViewer code={code} language="typescript" activeLine={20} />);
    expect(scrollToMock).toHaveBeenCalledWith(
      expect.objectContaining({
        behavior: 'auto',
      })
    );
  });

  it('maps Shiki token colors to standard CSS classes accurately via getTokenClassName', () => {
    expect(getTokenClassName('var(--shiki-token-keyword)')).toBe('shiki-token-keyword');
    expect(getTokenClassName('var(--shiki-token-constant)')).toBe('shiki-token-constant');
    expect(getTokenClassName('var(--shiki-token-string)')).toBe('shiki-token-string');
    expect(getTokenClassName('var(--shiki-token-comment)')).toBe('shiki-token-comment');
    expect(getTokenClassName('var(--shiki-token-function)')).toBe('shiki-token-function');
    expect(getTokenClassName('var(--shiki-token-parameter)')).toBe('shiki-token-parameter');
    expect(getTokenClassName('var(--shiki-token-punctuation)')).toBe('shiki-token-punctuation');
    expect(getTokenClassName('var(--shiki-token-link)')).toBe('shiki-token-link');
    expect(getTokenClassName('var(--shiki-foreground)')).toBe('shiki-token-default');
    expect(getTokenClassName(undefined)).toBe('shiki-token-default');
  });

  it('synchronously tokenizes code via highlightCode helper', () => {
    const lines = highlightCode('const x = 10;', 'typescript');
    expect(lines.length).toBe(1);
    expect(lines[0]?.lineNumber).toBe(1);
    expect(lines[0]?.tokens.length).toBeGreaterThan(0);
  });
});
