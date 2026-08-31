import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { A11yAnnouncer } from './A11yAnnouncer';
import { useTimeTravelKeyboard } from './useTimeTravelKeyboard';

describe('A11yAnnouncer', () => {
  it('renders with role status and default polite aria-live', () => {
    render(<A11yAnnouncer message="Comparing elements 5 and 1" />);
    const announcer = screen.getByRole('status');
    expect(announcer).toBeInTheDocument();
    expect(announcer).toHaveAttribute('aria-live', 'polite');
    expect(announcer).toHaveAttribute('aria-atomic', 'true');
    expect(announcer).toHaveTextContent('Comparing elements 5 and 1');
  });

  it('supports assertive politeness mode', () => {
    render(<A11yAnnouncer message="Stack Overflow reached!" politeness="assertive" />);
    const announcer = screen.getByRole('status');
    expect(announcer).toHaveAttribute('aria-live', 'assertive');
    expect(announcer).toHaveTextContent('Stack Overflow reached!');
  });

  it('renders safely when message is empty or undefined', () => {
    render(<A11yAnnouncer />);
    const announcer = screen.getByRole('status');
    expect(announcer).toBeInTheDocument();
    expect(announcer).toHaveTextContent('');
  });

  it('merges custom className with a11y-live-announcer', () => {
    render(<A11yAnnouncer message="Step updated" className="custom-a11y-class" />);
    const announcer = screen.getByRole('status');
    expect(announcer).toHaveClass('a11y-live-announcer');
    expect(announcer).toHaveClass('custom-a11y-class');
  });
});

describe('useTimeTravelKeyboard', () => {
  it('triggers onNext on ArrowRight', () => {
    const onNext = vi.fn();
    renderHook(() => useTimeTravelKeyboard({ onNext }));

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('triggers onPrevious on ArrowLeft', () => {
    const onPrevious = vi.fn();
    renderHook(() => useTimeTravelKeyboard({ onPrevious }));

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(onPrevious).toHaveBeenCalledTimes(1);
  });

  it('triggers onFirst on Home', () => {
    const onFirst = vi.fn();
    renderHook(() => useTimeTravelKeyboard({ onFirst }));

    fireEvent.keyDown(window, { key: 'Home' });
    expect(onFirst).toHaveBeenCalledTimes(1);
  });

  it('triggers onLast on End', () => {
    const onLast = vi.fn();
    renderHook(() => useTimeTravelKeyboard({ onLast }));

    fireEvent.keyDown(window, { key: 'End' });
    expect(onLast).toHaveBeenCalledTimes(1);
  });

  it('triggers onTogglePlay on Space key', () => {
    const onTogglePlay = vi.fn();
    renderHook(() => useTimeTravelKeyboard({ onTogglePlay }));

    fireEvent.keyDown(window, { key: ' ' });
    expect(onTogglePlay).toHaveBeenCalledTimes(1);
  });

  it('triggers onReset on r and R', () => {
    const onReset = vi.fn();
    renderHook(() => useTimeTravelKeyboard({ onReset }));

    fireEvent.keyDown(window, { key: 'r' });
    expect(onReset).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'R' });
    expect(onReset).toHaveBeenCalledTimes(2);
  });

  it('does not trigger callbacks when typing in an input element', () => {
    const onNext = vi.fn();
    const onTogglePlay = vi.fn();
    renderHook(() => useTimeTravelKeyboard({ onNext, onTogglePlay }));

    const input = document.createElement('input');
    document.body.appendChild(input);

    fireEvent.keyDown(input, { key: 'ArrowRight' });
    fireEvent.keyDown(input, { key: ' ' });

    expect(onNext).not.toHaveBeenCalled();
    expect(onTogglePlay).not.toHaveBeenCalled();

    document.body.removeChild(input);
  });

  it('does not trigger callbacks when typing in a textarea element', () => {
    const onReset = vi.fn();
    renderHook(() => useTimeTravelKeyboard({ onReset }));

    const textarea = document.createElement('textarea');
    document.body.appendChild(textarea);

    fireEvent.keyDown(textarea, { key: 'r' });
    expect(onReset).not.toHaveBeenCalled();

    document.body.removeChild(textarea);
  });

  it('ignores shortcuts when modifier keys are pressed', () => {
    const onNext = vi.fn();
    const onReset = vi.fn();
    renderHook(() => useTimeTravelKeyboard({ onNext, onReset }));

    fireEvent.keyDown(window, { key: 'ArrowRight', ctrlKey: true });
    fireEvent.keyDown(window, { key: 'r', metaKey: true });
    fireEvent.keyDown(window, { key: 'ArrowRight', altKey: true });

    expect(onNext).not.toHaveBeenCalled();
    expect(onReset).not.toHaveBeenCalled();
  });

  it('does not fire callbacks when enabled is false', () => {
    const onNext = vi.fn();
    renderHook(() => useTimeTravelKeyboard({ onNext, enabled: false }));

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(onNext).not.toHaveBeenCalled();
  });

  it('removes event listener on unmount', () => {
    const onNext = vi.fn();
    const { unmount } = renderHook(() => useTimeTravelKeyboard({ onNext }));

    unmount();

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(onNext).not.toHaveBeenCalled();
  });
});
