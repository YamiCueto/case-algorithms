import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ArrayLab } from './ArrayLab';

describe('ArrayLab Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial laboratory with default array and controls', () => {
    render(<ArrayLab />);

    expect(screen.getByText('Array & Bubble Sort Exploration')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /play auto execution/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /step forward/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /step backwards/i })).toBeInTheDocument();
  });

  it('does not re-run the algorithm when merely typing in the input field', () => {
    render(<ArrayLab />);

    const input = screen.getByLabelText(/array input values/i);
    fireEvent.change(input, { target: { value: '99, 11, 44' } });

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.queryByText('99')).toBeNull();
  });

  it('loads and runs sorting only when clicking Load & Run button', () => {
    render(<ArrayLab />);

    const input = screen.getByLabelText(/array input values/i);
    const loadBtn = screen.getByRole('button', { name: /load and run sorting/i });

    fireEvent.change(input, { target: { value: '99, 11, 44' } });
    fireEvent.click(loadBtn);

    expect(screen.getByText('99')).toBeInTheDocument();
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('44')).toBeInTheDocument();
  });

  it('displays error badge when user inputs invalid values', () => {
    render(<ArrayLab />);

    const input = screen.getByLabelText(/array input values/i);
    const loadBtn = screen.getByRole('button', { name: /load and run sorting/i });

    fireEvent.change(input, { target: { value: 'abc, 123, @#' } });
    fireEvent.click(loadBtn);

    expect(screen.getByText(/invalid number/i)).toBeInTheDocument();
  });

  it('loads preset arrays when clicking preset buttons', () => {
    render(<ArrayLab />);

    const reversePresetBtn = screen.getByRole('button', { name: /reverse \[/i });
    fireEvent.click(reversePresetBtn);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('navigates through steps using next, previous, first, and last buttons', () => {
    render(<ArrayLab />);

    const stepForwardBtn = screen.getByRole('button', { name: /step forward/i });
    const stepBackBtn = screen.getByRole('button', { name: /step backwards/i });
    const lastBtn = screen.getByRole('button', { name: /jump to last step/i });
    const firstBtn = screen.getByRole('button', { name: /jump to first step/i });

    expect(stepBackBtn).toBeDisabled();
    expect(firstBtn).toBeDisabled();

    fireEvent.click(stepForwardBtn);
    expect(stepBackBtn).not.toBeDisabled();
    expect(screen.getByText(/step index:/i)).toBeInTheDocument();

    fireEvent.click(lastBtn);
    expect(stepForwardBtn).toBeDisabled();
    expect(lastBtn).toBeDisabled();
    expect(screen.getByText(/sorted \(complete\)/i)).toBeInTheDocument();

    fireEvent.click(firstBtn);
    expect(firstBtn).toBeDisabled();
    expect(stepForwardBtn).not.toBeDisabled();
  });

  it('supports automated play/pause execution and speed switching across multiple array loads', () => {
    render(<ArrayLab />);

    const playBtn = screen.getByRole('button', { name: /play auto execution/i });
    fireEvent.click(playBtn);

    const speed2xBtn = screen.getByRole('button', { name: '2x' });
    fireEvent.click(speed2xBtn);

    act(() => {
      vi.advanceTimersByTime(550);
    });

    expect(screen.getByText(/step index:/i)).toBeInTheDocument();

    const pauseBtn = screen.getByRole('button', { name: /pause execution/i });
    fireEvent.click(pauseBtn);
    expect(screen.getByRole('button', { name: /play auto execution/i })).toBeInTheDocument();

    const sortedPresetBtn = screen.getByRole('button', { name: /sorted \[/i });
    fireEvent.click(sortedPresetBtn);

    const playAgainBtn = screen.getByRole('button', { name: /play auto execution/i });
    fireEvent.click(playAgainBtn);
    expect(screen.getByRole('button', { name: /pause execution/i })).toBeInTheDocument();
  });

  it('switches between pedagogical progression tabs', () => {
    render(<ArrayLab />);

    const explainTab = screen.getByRole('button', { name: /04\. explain/i });
    fireEvent.click(explainTab);
    expect(screen.getByText(/explain time & space complexity/i)).toBeInTheDocument();
    expect(screen.getByText(/O\(n²\)/i)).toBeInTheDocument();

    const pseudocodeTab = screen.getByRole('button', { name: /06\. pseudocode/i });
    fireEvent.click(pseudocodeTab);
    expect(screen.getByText(/procedure bubbleSort/i)).toBeInTheDocument();

    const codeTab = screen.getByRole('button', { name: /07\. code/i });
    fireEvent.click(codeTab);
    expect(screen.getByText(/export function bubbleSort/i)).toBeInTheDocument();

    const modifyTab = screen.getByRole('button', { name: /08\. modify/i });
    fireEvent.click(modifyTab);
    expect(screen.getByText(/early exit active/i)).toBeInTheDocument();

    const challengeTab = screen.getByRole('button', { name: /10\. challenge/i });
    fireEvent.click(challengeTab);
    expect(screen.getByText(/algorithm mastery challenge/i)).toBeInTheDocument();
  });

  it('synchronizes active line in pseudocode and code during step execution', () => {
    render(<ArrayLab />);

    const pseudocodeTab = screen.getByRole('button', { name: /06\. pseudocode/i });
    fireEvent.click(pseudocodeTab);

    expect(screen.getByText('Pseudocode')).toBeInTheDocument();

    const stepForwardBtn = screen.getByRole('button', { name: /step forward/i });
    fireEvent.click(stepForwardBtn);

    expect(screen.getByText(/Line 6 Active/i)).toBeInTheDocument();

    const codeTab = screen.getByRole('button', { name: /07\. code/i });
    fireEvent.click(codeTab);

    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText(/Line 7 Active/i)).toBeInTheDocument();
  });

  it('updates A11yAnnouncer live region with accessible narrative messages', () => {
    render(<ArrayLab />);

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveTextContent(/Array initialized with values/i);

    const stepForwardBtn = screen.getByRole('button', { name: /step forward/i });
    fireEvent.click(stepForwardBtn);

    expect(liveRegion).toHaveTextContent(/Comparing index 0 with value 5/i);
  });

  it('supports time-travel navigation via global keyboard shortcuts', () => {
    render(<ArrayLab />);

    const liveRegion = screen.getByRole('status');

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText('Step Index:')).toBeInTheDocument();
    expect(liveRegion).toHaveTextContent(/Comparing index 0/i);

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(liveRegion).toHaveTextContent(/Array initialized/i);

    fireEvent.keyDown(window, { key: 'End' });
    expect(screen.getByText(/Sorted \(Complete\)/i)).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Home' });
    expect(liveRegion).toHaveTextContent(/Array initialized/i);

    fireEvent.keyDown(window, { key: 'r' });
    expect(liveRegion).toHaveTextContent(/Array initialized/i);
  });

  it('does not trigger keyboard shortcuts when typing in the input element', () => {
    render(<ArrayLab />);

    const input = screen.getByLabelText(/array input values/i);
    const liveRegion = screen.getByRole('status');

    fireEvent.keyDown(input, { key: ' ' });
    fireEvent.keyDown(input, { key: 'ArrowRight' });
    fireEvent.keyDown(input, { key: 'r' });

    expect(liveRegion).toHaveTextContent(/Array initialized/i);
  });
});
