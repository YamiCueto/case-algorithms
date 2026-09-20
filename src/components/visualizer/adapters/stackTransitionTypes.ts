export type StackNavigationIntent =
  | 'INITIAL_MOUNT'
  | 'LOAD_PRESET'
  | 'SANDBOX_PUSH'
  | 'SANDBOX_POP'
  | 'SANDBOX_PEEK'
  | 'SANDBOX_CLEAR'
  | 'STEP_FORWARD'
  | 'STEP_BACKWARD'
  | 'PLAY_FORWARD'
  | 'JUMP_FIRST'
  | 'JUMP_LAST'
  | 'RESET'
  | 'CAPACITY_CHANGE';

export interface StackTransitionContext {
  readonly historyId: string;
  readonly transitionId: number;
  readonly intent: StackNavigationIntent;
  readonly stepIndex: number;
  readonly playbackSpeed: number;
}

export interface StackTransitionEligibilityParams {
  readonly context?: StackTransitionContext;
  readonly prevStepIndex?: number;
  readonly prevHistoryId?: string;
  readonly action?: string;
  readonly prefersReducedMotion?: boolean;
}

export function isStackTransitionEligible({
  context,
  prevStepIndex,
  prevHistoryId,
  action,
  prefersReducedMotion = false,
}: StackTransitionEligibilityParams): boolean {
  if (prefersReducedMotion || !context) {
    return false;
  }

  if (action !== 'PUSH' && action !== 'POP') {
    return false;
  }

  if (context.intent === 'SANDBOX_PUSH' && action === 'PUSH') {
    return true;
  }

  if (context.intent === 'SANDBOX_POP' && action === 'POP') {
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
