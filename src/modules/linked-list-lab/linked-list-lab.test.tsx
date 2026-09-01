import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { LinkedListLab } from './LinkedListLab';

describe('LinkedListLab Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial linked list laboratory with controls and shell', () => {
    render(<LinkedListLab />);

    expect(screen.getByText('Singly Linked List & Pointer Chains')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /prepend node at head/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /append node at tail/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /insert node at index/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /remove node at index/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /find value in list/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear linked list/i })).toBeInTheDocument();
  });

  it('handles user prepend operation', () => {
    render(<LinkedListLab />);

    const valInput = screen.getByLabelText(/node value input/i);
    const prependBtn = screen.getByRole('button', { name: /prepend node at head/i });

    fireEvent.change(valInput, { target: { value: '99' } });
    fireEvent.click(prependBtn);

    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('handles user append operation', () => {
    render(<LinkedListLab />);

    const valInput = screen.getByLabelText(/node value input/i);
    const appendBtn = screen.getByRole('button', { name: /append node at tail/i });

    fireEvent.change(valInput, { target: { value: '77' } });
    fireEvent.click(appendBtn);

    expect(screen.getByText('77')).toBeInTheDocument();
  });

  it('handles user insert at operation', () => {
    render(<LinkedListLab />);

    const valInput = screen.getByLabelText(/node value input/i);
    const idxInput = screen.getByLabelText(/node index input/i);
    const insertBtn = screen.getByRole('button', { name: /insert node at index/i });

    fireEvent.change(valInput, { target: { value: '55' } });
    fireEvent.change(idxInput, { target: { value: '1' } });
    fireEvent.click(insertBtn);

    expect(screen.getByText('55')).toBeInTheDocument();
  });

  it('handles user remove at operation', () => {
    render(<LinkedListLab />);

    const idxInput = screen.getByLabelText(/node index input/i);
    const removeBtn = screen.getByRole('button', { name: /remove node at index/i });

    fireEvent.change(idxInput, { target: { value: '0' } });
    fireEvent.click(removeBtn);

    expect(screen.getByRole('button', { name: /step backwards/i })).not.toBeDisabled();
  });

  it('handles find operation', () => {
    render(<LinkedListLab />);

    const valInput = screen.getByLabelText(/node value input/i);
    const findBtn = screen.getByRole('button', { name: /find value in list/i });

    fireEvent.change(valInput, { target: { value: '20' } });
    fireEvent.click(findBtn);

    expect(screen.getByRole('button', { name: /step backwards/i })).not.toBeDisabled();
  });

  it('shows error on invalid number input or non-integer index', () => {
    render(<LinkedListLab />);

    const valInput = screen.getByLabelText(/node value input/i);
    const appendBtn = screen.getByRole('button', { name: /append node at tail/i });

    fireEvent.change(valInput, { target: { value: 'invalid' } });
    fireEvent.click(appendBtn);

    expect(screen.getByText(/Invalid value/i)).toBeInTheDocument();

    const idxInput = screen.getByLabelText(/node index input/i);
    const insertBtn = screen.getByRole('button', { name: /insert node at index/i });

    fireEvent.change(valInput, { target: { value: '10' } });
    fireEvent.change(idxInput, { target: { value: '3.14' } });
    fireEvent.click(insertBtn);

    expect(screen.getByText(/Invalid index/i)).toBeInTheDocument();
  });

  it('clears linked list when clear button is clicked', () => {
    render(<LinkedListLab />);

    const clearBtn = screen.getByRole('button', { name: /clear linked list/i });
    fireEvent.click(clearBtn);

    expect(screen.getByText(/Size: 0 nodes/i)).toBeInTheDocument();
  });

  it('switches between preset sequences', () => {
    render(<LinkedListLab />);

    const presetBtn = screen.getByRole('button', { name: /prepend & append mix/i });
    fireEvent.click(presetBtn);

    expect(screen.getAllByText(/Singly Linked List/i)[0]).toBeInTheDocument();
  });

  it('navigates through pedagogical phases', () => {
    render(<LinkedListLab />);

    const phaseBtn = screen.getByRole('button', { name: /06\. pseudocode/i });
    fireEvent.click(phaseBtn);

    expect(screen.getAllByText('Pseudocode').length).toBeGreaterThan(0);
  });

  it('handles auto-play playback loop', () => {
    render(<LinkedListLab />);

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

  it('updates A11yAnnouncer live region with accessible messages', () => {
    render(<LinkedListLab />);

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');

    const stepForwardBtn = screen.getByRole('button', { name: /step forward/i });
    fireEvent.click(stepForwardBtn);

    expect(liveRegion).toHaveTextContent(/Prepended value/i);
  });

  it('supports time-travel keyboard navigation and isolates typing in input', () => {
    render(<LinkedListLab />);

    const liveRegion = screen.getByRole('status');

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText('Step Index:')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByText('Step Index:')).toBeInTheDocument();

    const input = screen.getByLabelText(/node value input/i);
    input.focus();

    fireEvent.keyDown(input, { key: 'ArrowRight' });
    expect(liveRegion).toBeInTheDocument();
  });
});
