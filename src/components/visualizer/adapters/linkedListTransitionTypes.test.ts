import { describe, it, expect } from 'vitest';
import { isLinkedListTransitionEligible, LinkedListTransitionContext } from './linkedListTransitionTypes';

describe('linkedListTransitionTypes', () => {
  const baseContext: LinkedListTransitionContext = {
    historyId: 'hist-ll1',
    transitionId: 1,
    intent: 'STEP_FORWARD',
    stepIndex: 2,
    playbackSpeed: 600,
  };

  it('returns false if prefersReducedMotion is true', () => {
    expect(
      isLinkedListTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-ll1',
        action: 'PREPEND',
        prefersReducedMotion: true,
      })
    ).toBe(false);
  });

  it('returns false if context is missing', () => {
    expect(
      isLinkedListTransitionEligible({
        context: undefined,
        action: 'PREPEND',
      })
    ).toBe(false);
  });

  it('returns false for non-animatable actions', () => {
    expect(
      isLinkedListTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-ll1',
        action: 'INITIALIZE',
      })
    ).toBe(false);

    expect(
      isLinkedListTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-ll1',
        action: 'UNDERFLOW',
      })
    ).toBe(false);
  });

  it('returns true for SANDBOX operations matching action', () => {
    expect(
      isLinkedListTransitionEligible({
        context: { ...baseContext, intent: 'SANDBOX_PREPEND' },
        action: 'PREPEND',
      })
    ).toBe(true);

    expect(
      isLinkedListTransitionEligible({
        context: { ...baseContext, intent: 'SANDBOX_APPEND' },
        action: 'APPEND',
      })
    ).toBe(true);

    expect(
      isLinkedListTransitionEligible({
        context: { ...baseContext, intent: 'SANDBOX_INSERT_AT' },
        action: 'INSERT_AT',
      })
    ).toBe(true);

    expect(
      isLinkedListTransitionEligible({
        context: { ...baseContext, intent: 'SANDBOX_REMOVE_AT' },
        action: 'REMOVE_AT',
      })
    ).toBe(true);

    expect(
      isLinkedListTransitionEligible({
        context: { ...baseContext, intent: 'SANDBOX_SEARCH' },
        action: 'SEARCH',
      })
    ).toBe(true);
  });

  it('returns true for contiguous STEP_FORWARD on valid list actions', () => {
    expect(
      isLinkedListTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-ll1',
        action: 'TRAVERSE',
      })
    ).toBe(true);

    expect(
      isLinkedListTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-ll1',
        action: 'FOUND',
      })
    ).toBe(true);
  });

  it('returns false for non-contiguous step index or different history in time travel', () => {
    expect(
      isLinkedListTransitionEligible({
        context: baseContext,
        prevStepIndex: 0,
        prevHistoryId: 'hist-ll1',
        action: 'TRAVERSE',
      })
    ).toBe(false);

    expect(
      isLinkedListTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-other',
        action: 'TRAVERSE',
      })
    ).toBe(false);
  });

  it('returns false for rewind or jumps', () => {
    const jumpContext: LinkedListTransitionContext = {
      ...baseContext,
      intent: 'JUMP_FIRST',
      stepIndex: 0,
    };
    expect(
      isLinkedListTransitionEligible({
        context: jumpContext,
        prevStepIndex: 4,
        prevHistoryId: 'hist-ll1',
        action: 'PREPEND',
      })
    ).toBe(false);
  });

  it('returns false for SEEK intent on any action', () => {
    const seekContext: LinkedListTransitionContext = {
      ...baseContext,
      intent: 'SEEK',
      stepIndex: 3,
    };
    expect(
      isLinkedListTransitionEligible({
        context: seekContext,
        prevStepIndex: 2,
        prevHistoryId: 'hist-ll1',
        action: 'PREPEND',
      })
    ).toBe(false);

    expect(
      isLinkedListTransitionEligible({
        context: seekContext,
        prevStepIndex: 2,
        prevHistoryId: 'hist-ll1',
        action: 'APPEND',
      })
    ).toBe(false);

    expect(
      isLinkedListTransitionEligible({
        context: seekContext,
        prevStepIndex: 2,
        prevHistoryId: 'hist-ll1',
        action: 'TRAVERSE',
      })
    ).toBe(false);
  });
});
