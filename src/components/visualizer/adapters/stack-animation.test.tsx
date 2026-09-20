import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { StrictMode } from 'react';
import { engine } from 'animejs';
import { StackVisualizerAdapter } from './StackVisualizerAdapter';
import { ExecutionStep } from '@/core/types';
import { StackState } from '@/core/data-structures/stack';
import { StackTransitionContext } from './stackTransitionTypes';

describe('Stack Animation Integration & Ghost Node Lifecycle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders ghost node during eligible POP and cleans it up after completion', () => {
    const popStep: ExecutionStep<StackState> = {
      id: 'step-pop-1',
      stepIndex: 2,
      totalSteps: 4,
      action: 'POP',
      description: 'Popped 30 from stack',
      a11yMessage: 'Popped 30 from stack',
      state: {
        items: [10, 20],
        topIndex: 1,
        capacity: 6,
        operation: 'POP',
        targetElement: 30,
        phaseDescription: 'Popped 30',
      },
    };

    const popContext: StackTransitionContext = {
      historyId: 'hist-1',
      transitionId: 1,
      intent: 'SANDBOX_POP',
      stepIndex: 2,
      playbackSpeed: 600,
    };

    const { container } = render(
      <StackVisualizerAdapter step={popStep} transitionContext={popContext} />
    );

    const ghostGroup = container.querySelector('.stack-ghost-anchor');
    expect(ghostGroup).toBeInTheDocument();
    expect(ghostGroup).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByText('30')).toBeInTheDocument();

    act(() => {
      for (let i = 0; i < 40; i++) {
        vi.advanceTimersByTime(20);
        engine.update();
      }
    });

    expect(container.querySelector('.stack-ghost-anchor')).toBeNull();
  });

  it('immediately cancels ghost node when rapid PUSH interrupts an in-flight POP', () => {
    const popStep: ExecutionStep<StackState> = {
      id: 'step-pop-fast',
      stepIndex: 1,
      totalSteps: 3,
      action: 'POP',
      description: 'Popped 42',
      a11yMessage: 'Popped 42',
      state: {
        items: [],
        topIndex: -1,
        capacity: 6,
        operation: 'POP',
        targetElement: 42,
        phaseDescription: 'Popped 42',
      },
    };

    const popContext: StackTransitionContext = {
      historyId: 'hist-1',
      transitionId: 10,
      intent: 'SANDBOX_POP',
      stepIndex: 1,
      playbackSpeed: 600,
    };

    const { container, rerender } = render(
      <StackVisualizerAdapter step={popStep} transitionContext={popContext} />
    );

    expect(container.querySelector('.stack-ghost-anchor')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(50);
    });

    const pushStep: ExecutionStep<StackState> = {
      id: 'step-push-fast',
      stepIndex: 2,
      totalSteps: 3,
      action: 'PUSH',
      description: 'Pushed 99',
      a11yMessage: 'Pushed 99',
      state: {
        items: [99],
        topIndex: 0,
        capacity: 6,
        operation: 'PUSH',
        targetElement: 99,
        phaseDescription: 'Pushed 99',
      },
    };

    const pushContext: StackTransitionContext = {
      historyId: 'hist-2',
      transitionId: 11,
      intent: 'SANDBOX_PUSH',
      stepIndex: 2,
      playbackSpeed: 600,
    };

    rerender(<StackVisualizerAdapter step={pushStep} transitionContext={pushContext} />);

    expect(container.querySelector('.stack-ghost-anchor')).toBeNull();
    expect(screen.getByText('99')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(screen.getByText('99')).toBeInTheDocument();
    expect(container.querySelector('.stack-ghost-anchor')).toBeNull();
  });

  it('cancels ghost node immediately upon RESET', () => {
    const popStep: ExecutionStep<StackState> = {
      id: 'step-pop-reset',
      stepIndex: 2,
      totalSteps: 4,
      action: 'POP',
      description: 'Popped 15',
      a11yMessage: 'Popped 15',
      state: {
        items: [5],
        topIndex: 0,
        capacity: 6,
        operation: 'POP',
        targetElement: 15,
        phaseDescription: 'Popped 15',
      },
    };

    const popContext: StackTransitionContext = {
      historyId: 'hist-1',
      transitionId: 20,
      intent: 'SANDBOX_POP',
      stepIndex: 2,
      playbackSpeed: 600,
    };

    const { container, rerender } = render(
      <StackVisualizerAdapter step={popStep} transitionContext={popContext} />
    );

    expect(container.querySelector('.stack-ghost-anchor')).toBeInTheDocument();

    const resetStep: ExecutionStep<StackState> = {
      id: 'step-reset',
      stepIndex: 0,
      totalSteps: 4,
      action: 'INITIALIZE',
      description: 'Reset to initial',
      a11yMessage: 'Reset',
      state: {
        items: [],
        topIndex: -1,
        capacity: 6,
        operation: 'INITIALIZE',
        phaseDescription: 'Initial',
      },
    };

    const resetContext: StackTransitionContext = {
      historyId: 'hist-1',
      transitionId: 21,
      intent: 'RESET',
      stepIndex: 0,
      playbackSpeed: 600,
    };

    rerender(<StackVisualizerAdapter step={resetStep} transitionContext={resetContext} />);

    expect(container.querySelector('.stack-ghost-anchor')).toBeNull();
    expect(screen.getByText('La pila está vacía (0 elementos)')).toBeInTheDocument();
  });

  it('runs cleanly under React StrictMode without duplicate ghost nodes', () => {
    const popStep: ExecutionStep<StackState> = {
      id: 'step-pop-strict',
      stepIndex: 1,
      totalSteps: 2,
      action: 'POP',
      description: 'Popped 55',
      a11yMessage: 'Popped 55',
      state: {
        items: [],
        topIndex: -1,
        capacity: 6,
        operation: 'POP',
        targetElement: 55,
        phaseDescription: 'Popped 55',
      },
    };

    const popContext: StackTransitionContext = {
      historyId: 'hist-strict',
      transitionId: 30,
      intent: 'SANDBOX_POP',
      stepIndex: 1,
      playbackSpeed: 600,
    };

    const { container } = render(
      <StrictMode>
        <StackVisualizerAdapter step={popStep} transitionContext={popContext} />
      </StrictMode>
    );

    const ghostElements = container.querySelectorAll('.stack-ghost-anchor');
    expect(ghostElements.length).toBeLessThanOrEqual(1);

    act(() => {
      for (let i = 0; i < 40; i++) {
        vi.advanceTimersByTime(20);
        engine.update();
      }
    });

    expect(container.querySelector('.stack-ghost-anchor')).toBeNull();
  });

  it('bypasses ghost node when prefers-reduced-motion is active', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const popStep: ExecutionStep<StackState> = {
      id: 'step-pop-reduced',
      stepIndex: 1,
      totalSteps: 2,
      action: 'POP',
      description: 'Popped 77',
      a11yMessage: 'Popped 77',
      state: {
        items: [10],
        topIndex: 0,
        capacity: 6,
        operation: 'POP',
        targetElement: 77,
        phaseDescription: 'Popped 77',
      },
    };

    const popContext: StackTransitionContext = {
      historyId: 'hist-reduced',
      transitionId: 40,
      intent: 'SANDBOX_POP',
      stepIndex: 1,
      playbackSpeed: 600,
    };

    const { container } = render(
      <StackVisualizerAdapter step={popStep} transitionContext={popContext} />
    );

    expect(container.querySelector('.stack-ghost-anchor')).toBeNull();
    expect(screen.getByText('10')).toBeInTheDocument();

    window.matchMedia = originalMatchMedia;
  });
});
