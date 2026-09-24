import { describe, it, expect } from 'vitest';
import { isQueueTransitionEligible, QueueTransitionContext } from './queueTransitionTypes';

describe('queueTransitionTypes', () => {
  const baseContext: QueueTransitionContext = {
    historyId: 'hist-q1',
    transitionId: 1,
    intent: 'STEP_FORWARD',
    stepIndex: 2,
    playbackSpeed: 600,
  };

  it('returns false if prefersReducedMotion is true', () => {
    expect(
      isQueueTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-q1',
        action: 'ENQUEUE',
        prefersReducedMotion: true,
      })
    ).toBe(false);
  });

  it('returns false if context is missing', () => {
    expect(
      isQueueTransitionEligible({
        context: undefined,
        action: 'ENQUEUE',
      })
    ).toBe(false);
  });

  it('returns false for non-animatable actions', () => {
    expect(
      isQueueTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-q1',
        action: 'INITIALIZE',
      })
    ).toBe(false);

    expect(
      isQueueTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-q1',
        action: 'OVERFLOW',
      })
    ).toBe(false);
  });

  it('returns true for SANDBOX_ENQUEUE and action ENQUEUE', () => {
    const sandboxContext: QueueTransitionContext = {
      ...baseContext,
      intent: 'SANDBOX_ENQUEUE',
    };
    expect(
      isQueueTransitionEligible({
        context: sandboxContext,
        action: 'ENQUEUE',
      })
    ).toBe(true);
  });

  it('returns true for SANDBOX_DEQUEUE and action DEQUEUE', () => {
    const sandboxContext: QueueTransitionContext = {
      ...baseContext,
      intent: 'SANDBOX_DEQUEUE',
    };
    expect(
      isQueueTransitionEligible({
        context: sandboxContext,
        action: 'DEQUEUE',
      })
    ).toBe(true);
  });

  it('returns true for contiguous STEP_FORWARD on ENQUEUE or DEQUEUE', () => {
    expect(
      isQueueTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-q1',
        action: 'ENQUEUE',
      })
    ).toBe(true);

    expect(
      isQueueTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-q1',
        action: 'DEQUEUE',
      })
    ).toBe(true);
  });

  it('returns false for non-contiguous step index or different history in time travel', () => {
    expect(
      isQueueTransitionEligible({
        context: baseContext,
        prevStepIndex: 0,
        prevHistoryId: 'hist-q1',
        action: 'ENQUEUE',
      })
    ).toBe(false);

    expect(
      isQueueTransitionEligible({
        context: baseContext,
        prevStepIndex: 1,
        prevHistoryId: 'hist-different',
        action: 'ENQUEUE',
      })
    ).toBe(false);
  });

  it('returns false for rewind or jumps', () => {
    const jumpContext: QueueTransitionContext = {
      ...baseContext,
      intent: 'JUMP_FIRST',
      stepIndex: 0,
    };
    expect(
      isQueueTransitionEligible({
        context: jumpContext,
        prevStepIndex: 4,
        prevHistoryId: 'hist-q1',
        action: 'ENQUEUE',
      })
    ).toBe(false);
  });

  it('returns false for SEEK intent on any action', () => {
    const seekContext: QueueTransitionContext = {
      ...baseContext,
      intent: 'SEEK',
      stepIndex: 3,
    };
    expect(
      isQueueTransitionEligible({
        context: seekContext,
        prevStepIndex: 2,
        prevHistoryId: 'hist-q1',
        action: 'ENQUEUE',
      })
    ).toBe(false);

    expect(
      isQueueTransitionEligible({
        context: seekContext,
        prevStepIndex: 2,
        prevHistoryId: 'hist-q1',
        action: 'DEQUEUE',
      })
    ).toBe(false);
  });
});
