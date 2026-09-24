import { describe, it, expect } from 'vitest';
import { isStackTransitionEligible, StackTransitionContext } from './stackTransitionTypes';

describe('stackTransitionTypes', () => {
  const baseContext: StackTransitionContext = {
    historyId: 'hist-s1',
    transitionId: 1,
    intent: 'STEP_FORWARD',
    stepIndex: 2,
    playbackSpeed: 600,
  };

  it('returns false if prefersReducedMotion is true', () => {
    expect(
      isStackTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-s1',
        action: 'PUSH',
        prefersReducedMotion: true,
      })
    ).toBe(false);
  });

  it('returns false if context is missing', () => {
    expect(
      isStackTransitionEligible({
        context: undefined,
        action: 'PUSH',
      })
    ).toBe(false);
  });

  it('returns false for non-animatable actions', () => {
    expect(
      isStackTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-s1',
        action: 'PEEK',
      })
    ).toBe(false);
  });

  it('returns true for SANDBOX_PUSH on PUSH action', () => {
    expect(
      isStackTransitionEligible({
        context: { ...baseContext, intent: 'SANDBOX_PUSH' },
        action: 'PUSH',
      })
    ).toBe(true);
  });

  it('returns true for SANDBOX_POP on POP action', () => {
    expect(
      isStackTransitionEligible({
        context: { ...baseContext, intent: 'SANDBOX_POP' },
        action: 'POP',
      })
    ).toBe(true);
  });

  it('returns true for contiguous STEP_FORWARD or PLAY_FORWARD on PUSH / POP', () => {
    expect(
      isStackTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-s1',
        action: 'PUSH',
      })
    ).toBe(true);

    expect(
      isStackTransitionEligible({
        context: { ...baseContext, intent: 'PLAY_FORWARD' },
        prevStepIndex: 1,
        prevHistoryId: 'hist-s1',
        action: 'POP',
      })
    ).toBe(true);
  });

  it('returns false for non-contiguous steps or different histories', () => {
    expect(
      isStackTransitionEligible({
        context: baseContext,
        prevStepIndex: 0,
        prevHistoryId: 'hist-s1',
        action: 'PUSH',
      })
    ).toBe(false);

    expect(
      isStackTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-other',
        action: 'PUSH',
      })
    ).toBe(false);
  });

  it('returns false for SEEK intent on any action', () => {
    const seekContext: StackTransitionContext = {
      ...baseContext,
      intent: 'SEEK',
      stepIndex: 3,
    };

    expect(
      isStackTransitionEligible({
        context: seekContext,
        prevStepIndex: 2,
        prevHistoryId: 'hist-s1',
        action: 'PUSH',
      })
    ).toBe(false);

    expect(
      isStackTransitionEligible({
        context: seekContext,
        prevStepIndex: 2,
        prevHistoryId: 'hist-s1',
        action: 'POP',
      })
    ).toBe(false);
  });
});
