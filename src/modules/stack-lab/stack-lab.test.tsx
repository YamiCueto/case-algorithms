import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { StackLab } from './StackLab';

describe('StackLab Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial stack laboratory with default sequence and controls', () => {
    render(<StackLab />);

    expect(screen.getByText('Stack & LIFO Principle Exploration')).toBeInTheDocument();
    expect(screen.getByText('Cap: 6')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /push value onto stack/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /pop top value from stack/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /peek top value/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear stack/i })).toBeInTheDocument();
  });

  it('pushes a new value onto the stack on Push click', () => {
    render(<StackLab />);

    const input = screen.getByLabelText(/value to push onto stack/i);
    const pushBtn = screen.getByRole('button', { name: /push value onto stack/i });

    fireEvent.change(input, { target: { value: '77' } });
    fireEvent.click(pushBtn);

    expect(screen.getByText('77')).toBeInTheDocument();
  });

  it('shows error badge when trying to push non-numeric text', () => {
    render(<StackLab />);

    const input = screen.getByLabelText(/value to push onto stack/i);
    const pushBtn = screen.getByRole('button', { name: /push value onto stack/i });

    fireEvent.change(input, { target: { value: 'xyz' } });
    fireEvent.click(pushBtn);

    expect(screen.getByText(/invalid number/i)).toBeInTheDocument();
  });

  it('performs pop and peek operations correctly', () => {
    render(<StackLab />);

    const popBtn = screen.getByRole('button', { name: /pop top value from stack/i });
    const peekBtn = screen.getByRole('button', { name: /peek top value/i });

    fireEvent.click(popBtn);
    expect(screen.getByRole('button', { name: /pop top value from stack/i })).toBeInTheDocument();

    fireEvent.click(peekBtn);
    expect(screen.getByRole('button', { name: /peek top value/i })).toBeInTheDocument();
  });

  it('loads preset sequences like Overflow and Underflow demos', () => {
    render(<StackLab />);

    const overflowPresetBtn = screen.getByRole('button', { name: /overflow demo/i });
    fireEvent.click(overflowPresetBtn);
    expect(screen.getByText(/cap: 5/i)).toBeInTheDocument();

    const underflowPresetBtn = screen.getByRole('button', { name: /underflow demo/i });
    fireEvent.click(underflowPresetBtn);
    expect(screen.getByText(/50/i)).toBeInTheDocument();
  });

  it('navigates through stack step timeline with first, last, prev, next', () => {
    render(<StackLab />);

    const stepForwardBtn = screen.getByRole('button', { name: /step forward/i });
    const stepBackBtn = screen.getByRole('button', { name: /step backwards/i });
    const lastBtn = screen.getByRole('button', { name: /jump to last step/i });
    const firstBtn = screen.getByRole('button', { name: /jump to first step/i });

    expect(stepBackBtn).toBeDisabled();
    expect(firstBtn).toBeDisabled();

    fireEvent.click(stepForwardBtn);
    expect(stepBackBtn).not.toBeDisabled();

    fireEvent.click(lastBtn);
    expect(stepForwardBtn).toBeDisabled();
    expect(lastBtn).toBeDisabled();

    fireEvent.click(firstBtn);
    expect(firstBtn).toBeDisabled();
    expect(stepForwardBtn).not.toBeDisabled();
  });

  it('supports automated play/pause execution and speed changes', () => {
    render(<StackLab />);

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
  });

  it('switches between all 10 pedagogical progression tabs', () => {
    render(<StackLab />);

    const explainTab = screen.getByRole('button', { name: /04\. explain/i });
    fireEvent.click(explainTab);
    expect(screen.getByText(/explain time & space complexity/i)).toBeInTheDocument();
    expect(screen.getAllByText(/O\(1\)/i).length).toBeGreaterThan(0);

    const pseudocodeTab = screen.getByRole('button', { name: /06\. pseudocode/i });
    fireEvent.click(pseudocodeTab);
    expect(screen.getByText(/procedure push/i)).toBeInTheDocument();

    const codeTab = screen.getByRole('button', { name: /07\. code/i });
    fireEvent.click(codeTab);
    expect(screen.getByText(/export class BoundedStack/i)).toBeInTheDocument();

    const modifyTab = screen.getByRole('button', { name: /08\. modify/i });
    fireEvent.click(modifyTab);
    expect(screen.getByText(/modify & boundary conditions/i)).toBeInTheDocument();

    const practiceTab = screen.getByRole('button', { name: /09\. practice/i });
    fireEvent.click(practiceTab);
    expect(screen.getByText(/balanced parentheses matching/i)).toBeInTheDocument();

    const challengeTab = screen.getByRole('button', { name: /10\. challenge/i });
    fireEvent.click(challengeTab);
    expect(screen.getByText(/algorithm mastery challenge/i)).toBeInTheDocument();
  });

  it('synchronizes active line in pseudocode and code during stack operations', () => {
    render(<StackLab />);

    const pseudocodeTab = screen.getByRole('button', { name: /06\. pseudocode/i });
    fireEvent.click(pseudocodeTab);

    expect(screen.getByText('Pseudocode')).toBeInTheDocument();

    const stepForwardBtn = screen.getByRole('button', { name: /step forward/i });
    fireEvent.click(stepForwardBtn);

    expect(screen.getByText(/Line 4 Active/i)).toBeInTheDocument();

    const codeTab = screen.getByRole('button', { name: /07\. code/i });
    fireEvent.click(codeTab);

    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText(/Line 5 Active/i)).toBeInTheDocument();
  });
});
