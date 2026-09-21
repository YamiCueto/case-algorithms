export type ArrayNavigationIntent =
  | 'INITIAL_MOUNT'
  | 'LOAD_PRESET'
  | 'STEP_FORWARD'
  | 'STEP_BACKWARD'
  | 'PLAY_FORWARD'
  | 'JUMP_FIRST'
  | 'JUMP_LAST'
  | 'RESET'
  | 'LOAD_CUSTOM';

export interface ArrayTransitionContext {
  readonly historyId: string;
  readonly transitionId: number;
  readonly intent: ArrayNavigationIntent;
  readonly stepIndex: number;
  readonly playbackSpeed: number;
}

export interface ArrayTransitionEligibilityParams {
  readonly context?: ArrayTransitionContext;
  readonly prevStepIndex?: number;
  readonly prevHistoryId?: string;
  readonly action?: string;
  readonly prefersReducedMotion?: boolean;
}

export function isArrayTransitionEligible({
  context,
  prevStepIndex,
  prevHistoryId,
  action,
  prefersReducedMotion = false,
}: ArrayTransitionEligibilityParams): boolean {
  if (prefersReducedMotion || !context) {
    return false;
  }

  if (action !== 'COMPARE' && action !== 'SWAP' && action !== 'SET_POINTER') {
    return false;
  }

  if (context.intent === 'STEP_FORWARD' || context.intent === 'PLAY_FORWARD') {
    const isSameHistory = context.historyId === prevHistoryId;
    const isContiguousForward =
      prevStepIndex !== undefined && context.stepIndex - prevStepIndex === 1;
    return isSameHistory && isContiguousForward;
  }

  return false;
}
