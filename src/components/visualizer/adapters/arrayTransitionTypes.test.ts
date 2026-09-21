import { describe, it, expect } from 'vitest';
import { isArrayTransitionEligible, ArrayTransitionContext } from './arrayTransitionTypes';

describe('arrayTransitionTypes', () => {
  const baseContext: ArrayTransitionContext = {
    historyId: 'hist-1',
    transitionId: 1,
    intent: 'STEP_FORWARD',
    stepIndex: 2,
    playbackSpeed: 600,
  };

  it('returns false if prefersReducedMotion is true', () => {
    expect(
      isArrayTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-1',
        action: 'COMPARE',
        prefersReducedMotion: true,
      })
    ).toBe(false);
  });

  it('returns false if context is missing', () => {
    expect(
      isArrayTransitionEligible({
        context: undefined,
        action: 'COMPARE',
      })
    ).toBe(false);
  });

  it('returns false for non-animatable actions', () => {
    expect(
      isArrayTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-1',
        action: 'INITIALIZE',
      })
    ).toBe(false);
  });

  it('returns true for contiguous STEP_FORWARD on COMPARE, SWAP, or SET_SORTED', () => {
    expect(
      isArrayTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-1',
        action: 'COMPARE',
      })
    ).toBe(true);

    expect(
      isArrayTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-1',
        action: 'SWAP',
      })
    ).toBe(true);

    expect(
      isArrayTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-1',
        action: 'SET_POINTER',
      })
    ).toBe(true);
  });

  it('returns false for non-contiguous step index or different history', () => {
    expect(
      isArrayTransitionEligible({
        context: baseContext,
        prevStepIndex: 0,
        prevHistoryId: 'hist-1',
        action: 'COMPARE',
      })
    ).toBe(false);

    expect(
      isArrayTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-different',
        action: 'COMPARE',
      })
    ).toBe(false);
  });

  it('returns false for rewind or jumps', () => {
    const jumpContext: ArrayTransitionContext = {
      ...baseContext,
      intent: 'JUMP_FIRST',
      stepIndex: 0,
    };
    expect(
      isArrayTransitionEligible({
        context: jumpContext,
        prevStepIndex: 5,
        prevHistoryId: 'hist-1',
        action: 'COMPARE',
      })
    ).toBe(false);
  });
});
