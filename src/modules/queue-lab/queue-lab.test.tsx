import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { QueueLab } from './QueueLab';

describe('QueueLab Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial queue laboratory with default sequence and controls', () => {
    render(<QueueLab />);

    expect(screen.getByText('Queue & FIFO Principle Exploration')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enqueue value into queue/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dequeue front value/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /peek front value/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear queue/i })).toBeInTheDocument();
  });

  it('handles user enqueue operation with custom value', () => {
    render(<QueueLab />);

    const input = screen.getByLabelText(/value to enqueue/i);
    const enqueueBtn = screen.getByRole('button', { name: /enqueue value into queue/i });

    fireEvent.change(input, { target: { value: '99' } });
    fireEvent.click(enqueueBtn);

    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('shows validation error for invalid numeric input', () => {
    render(<QueueLab />);

    const input = screen.getByLabelText(/value to enqueue/i);
    const enqueueBtn = screen.getByRole('button', { name: /enqueue value into queue/i });

    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.click(enqueueBtn);

    expect(screen.getByText(/Invalid number/i)).toBeInTheDocument();
  });

  it('handles dequeue operation and updates queue contents', () => {
    render(<QueueLab />);

    const dequeueBtn = screen.getByRole('button', { name: /dequeue front value/i });
    fireEvent.click(dequeueBtn);

    expect(screen.getByRole('button', { name: /step backwards/i })).not.toBeDisabled();
  });

  it('handles peek front operation', () => {
    render(<QueueLab />);

    const peekBtn = screen.getByRole('button', { name: /peek front value/i });
    fireEvent.click(peekBtn);

    expect(screen.getByRole('button', { name: /step backwards/i })).not.toBeDisabled();
  });

  it('clears queue when clear button is clicked', () => {
    render(<QueueLab />);

    const clearBtn = screen.getByRole('button', { name: /clear queue/i });
    fireEvent.click(clearBtn);

    expect(screen.getByText(/Capacity: 6 \| Items: 0/i)).toBeInTheDocument();
  });

  it('changes queue capacity', () => {
    render(<QueueLab />);

    const cap4Btn = screen.getByRole('button', { name: '4' });
    fireEvent.click(cap4Btn);

    expect(screen.getByText(/Capacity: 4/i)).toBeInTheDocument();
  });

  it('switches between preset demo sequences', () => {
    render(<QueueLab />);

    const overflowPresetBtn = screen.getByRole('button', { name: /overflow demo/i });
    fireEvent.click(overflowPresetBtn);

    expect(screen.getByText(/Capacity: 5/i)).toBeInTheDocument();
  });

  it('navigates through pedagogical phases', () => {
    render(<QueueLab />);

    const phaseBtn = screen.getByRole('button', { name: /06\. pseudocode/i });
    fireEvent.click(phaseBtn);

    expect(screen.getByText('Pseudocode')).toBeInTheDocument();
  });

  it('handles auto-play playback loop', () => {
    render(<QueueLab />);

    const playBtn = screen.getByRole('button', { name: /play auto execution/i });
    fireEvent.click(playBtn);

    expect(screen.getByRole('button', { name: /pause execution/i })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    const pauseBtn = screen.getByRole('button', { name: /pause execution/i });
    fireEvent.click(pauseBtn);

    expect(screen.getByRole('button', { name: /play auto execution/i })).toBeInTheDocument();
  });

  it('updates A11yAnnouncer live region with accessible narrative messages', () => {
    render(<QueueLab />);

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveTextContent(/Empty queue initialized with capacity 6/i);

    const stepForwardBtn = screen.getByRole('button', { name: /step forward/i });
    fireEvent.click(stepForwardBtn);

    expect(liveRegion).toHaveTextContent(/Enqueued value 10 at REAR/i);
  });

  it('supports time-travel navigation via global keyboard shortcuts', () => {
    render(<QueueLab />);

    const liveRegion = screen.getByRole('status');

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText('Step Index:')).toBeInTheDocument();
    expect(liveRegion).toHaveTextContent(/Enqueued value 10/i);

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(liveRegion).toHaveTextContent(/Empty queue initialized/i);

    fireEvent.keyDown(window, { key: 'End' });
    expect(liveRegion).toHaveTextContent(/Queue sequence completed/i);

    fireEvent.keyDown(window, { key: 'Home' });
    expect(liveRegion).toHaveTextContent(/Empty queue initialized/i);

    fireEvent.keyDown(window, { key: 'r' });
    expect(liveRegion).toHaveTextContent(/Empty queue initialized/i);
  });

  it('does not trigger keyboard shortcuts when typing in the input element', () => {
    render(<QueueLab />);

    const liveRegion = screen.getByRole('status');
    const input = screen.getByLabelText(/value to enqueue/i);
    input.focus();

    fireEvent.keyDown(input, { key: 'ArrowRight' });
    expect(liveRegion).toHaveTextContent(/Empty queue initialized/i);
  });
});
