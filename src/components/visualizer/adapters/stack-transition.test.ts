import { describe, it, expect } from 'vitest';
import {
  isStackTransitionEligible,
  StackTransitionContext,
} from './stackTransitionTypes';

describe('Stack Transition Contract', () => {
  it('identifies sandbox PUSH as eligible regardless of previous step index', () => {
    const context: StackTransitionContext = {
      historyId: 'hist-1',
      transitionId: 1,
      intent: 'SANDBOX_PUSH',
      stepIndex: 5,
      playbackSpeed: 600,
    };

    const eligible = isStackTransitionEligible({
      context,
      prevStepIndex: 0,
      prevHistoryId: 'hist-0',
      action: 'PUSH',
    });

    expect(eligible).toBe(true);
  });

  it('identifies sandbox POP as eligible', () => {
    const context: StackTransitionContext = {
      historyId: 'hist-2',
      transitionId: 2,
      intent: 'SANDBOX_POP',
      stepIndex: 4,
      playbackSpeed: 600,
    };

    const eligible = isStackTransitionEligible({
      context,
      prevStepIndex: 5,
      prevHistoryId: 'hist-1',
      action: 'POP',
    });

    expect(eligible).toBe(true);
  });

  it('identifies contiguous step forward in same history as eligible', () => {
    const context: StackTransitionContext = {
      historyId: 'hist-common',
      transitionId: 3,
      intent: 'STEP_FORWARD',
      stepIndex: 2,
      playbackSpeed: 600,
    };

    const eligible = isStackTransitionEligible({
      context,
      prevStepIndex: 1,
      prevHistoryId: 'hist-common',
      action: 'PUSH',
    });

    expect(eligible).toBe(true);
  });

  it('rejects forward step if historyId differs even if stepIndex increment is 1', () => {
    const context: StackTransitionContext = {
      historyId: 'hist-b',
      transitionId: 4,
      intent: 'STEP_FORWARD',
      stepIndex: 2,
      playbackSpeed: 600,
    };

    const eligible = isStackTransitionEligible({
      context,
      prevStepIndex: 1,
      prevHistoryId: 'hist-a',
      action: 'PUSH',
    });

    expect(eligible).toBe(false);
  });

  it('rejects non-contiguous jumps, rewinds, and resets', () => {
    const jumpContext: StackTransitionContext = {
      historyId: 'hist-common',
      transitionId: 5,
      intent: 'JUMP_LAST',
      stepIndex: 5,
      playbackSpeed: 600,
    };

    expect(
      isStackTransitionEligible({
        context: jumpContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-common',
        action: 'PUSH',
      })
    ).toBe(false);

    const rewindContext: StackTransitionContext = {
      historyId: 'hist-common',
      transitionId: 6,
      intent: 'STEP_BACKWARD',
      stepIndex: 1,
      playbackSpeed: 600,
    };

    expect(
      isStackTransitionEligible({
        context: rewindContext,
        prevStepIndex: 2,
        prevHistoryId: 'hist-common',
        action: 'PUSH',
      })
    ).toBe(false);

    const resetContext: StackTransitionContext = {
      historyId: 'hist-common',
      transitionId: 7,
      intent: 'RESET',
      stepIndex: 0,
      playbackSpeed: 600,
    };

    expect(
      isStackTransitionEligible({
        context: resetContext,
        prevStepIndex: 4,
        prevHistoryId: 'hist-common',
        action: 'PUSH',
      })
    ).toBe(false);
  });

  it('rejects overflow and underflow actions as non-eligible for physical movement', () => {
    const overflowContext: StackTransitionContext = {
      historyId: 'hist-overflow',
      transitionId: 8,
      intent: 'SANDBOX_PUSH',
      stepIndex: 6,
      playbackSpeed: 600,
    };

    expect(
      isStackTransitionEligible({
        context: overflowContext,
        action: 'OVERFLOW',
      })
    ).toBe(false);

    const underflowContext: StackTransitionContext = {
      historyId: 'hist-underflow',
      transitionId: 9,
      intent: 'SANDBOX_POP',
      stepIndex: 0,
      playbackSpeed: 600,
    };

    expect(
      isStackTransitionEligible({
        context: underflowContext,
        action: 'UNDERFLOW',
      })
    ).toBe(false);
  });

  it('rejects transitions when prefersReducedMotion is true', () => {
    const context: StackTransitionContext = {
      historyId: 'hist-motion',
      transitionId: 10,
      intent: 'SANDBOX_PUSH',
      stepIndex: 1,
      playbackSpeed: 600,
    };

    expect(
      isStackTransitionEligible({
        context,
        action: 'PUSH',
        prefersReducedMotion: true,
      })
    ).toBe(false);
  });
});
