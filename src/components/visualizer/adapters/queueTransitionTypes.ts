export type QueueNavigationIntent =
  | 'INITIAL_MOUNT'
  | 'LOAD_PRESET'
  | 'SANDBOX_ENQUEUE'
  | 'SANDBOX_DEQUEUE'
  | 'SANDBOX_PEEK'
  | 'SANDBOX_CLEAR'
  | 'STEP_FORWARD'
  | 'STEP_BACKWARD'
  | 'PLAY_FORWARD'
  | 'JUMP_FIRST'
  | 'JUMP_LAST'
  | 'RESET'
  | 'CAPACITY_CHANGE'
  | 'SEEK';

export interface QueueTransitionContext {
  readonly historyId: string;
  readonly transitionId: number;
  readonly intent: QueueNavigationIntent;
  readonly stepIndex: number;
  readonly playbackSpeed: number;
}

export interface QueueTransitionEligibilityParams {
  readonly context?: QueueTransitionContext;
  readonly prevStepIndex?: number;
  readonly prevHistoryId?: string;
  readonly action?: string;
  readonly prefersReducedMotion?: boolean;
}

export function isQueueTransitionEligible({
  context,
  prevStepIndex,
  prevHistoryId,
  action,
  prefersReducedMotion = false,
}: QueueTransitionEligibilityParams): boolean {
  if (prefersReducedMotion || !context) {
    return false;
  }

  if (action !== 'ENQUEUE' && action !== 'DEQUEUE') {
    return false;
  }

  if (context.intent === 'SANDBOX_ENQUEUE' && action === 'ENQUEUE') {
    return true;
  }

  if (context.intent === 'SANDBOX_DEQUEUE' && action === 'DEQUEUE') {
    return true;
  }

  if (context.intent === 'STEP_FORWARD' || context.intent === 'PLAY_FORWARD') {
    const isSameHistory = context.historyId === prevHistoryId;
    const isContiguousForward =
      prevStepIndex !== undefined && context.stepIndex - prevStepIndex === 1;
    return isSameHistory && isContiguousForward;
  }

  return false;
}
