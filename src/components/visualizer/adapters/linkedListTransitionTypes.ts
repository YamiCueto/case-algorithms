export type LinkedListNavigationIntent =
  | 'INITIAL_MOUNT'
  | 'LOAD_PRESET'
  | 'SANDBOX_PREPEND'
  | 'SANDBOX_APPEND'
  | 'SANDBOX_INSERT_AT'
  | 'SANDBOX_REMOVE_AT'
  | 'SANDBOX_SEARCH'
  | 'SANDBOX_CLEAR'
  | 'STEP_FORWARD'
  | 'STEP_BACKWARD'
  | 'PLAY_FORWARD'
  | 'JUMP_FIRST'
  | 'JUMP_LAST'
  | 'RESET';

export interface LinkedListTransitionContext {
  readonly historyId: string;
  readonly transitionId: number;
  readonly intent: LinkedListNavigationIntent;
  readonly stepIndex: number;
  readonly playbackSpeed: number;
}

export interface LinkedListTransitionEligibilityParams {
  readonly context?: LinkedListTransitionContext;
  readonly prevStepIndex?: number;
  readonly prevHistoryId?: string;
  readonly action?: string;
  readonly prefersReducedMotion?: boolean;
}

export function isLinkedListTransitionEligible({
  context,
  prevStepIndex,
  prevHistoryId,
  action,
  prefersReducedMotion = false,
}: LinkedListTransitionEligibilityParams): boolean {
  if (prefersReducedMotion || !context) {
    return false;
  }

  const animatableActions = [
    'PREPEND',
    'APPEND',
    'INSERT_AT',
    'REMOVE_AT',
    'SEARCH',
    'TRAVERSE',
    'FOUND',
  ];

  if (!action || !animatableActions.includes(action)) {
    return false;
  }

  if (
    (context.intent === 'SANDBOX_PREPEND' && action === 'PREPEND') ||
    (context.intent === 'SANDBOX_APPEND' && action === 'APPEND') ||
    (context.intent === 'SANDBOX_INSERT_AT' && (action === 'INSERT_AT' || action === 'TRAVERSE')) ||
    (context.intent === 'SANDBOX_REMOVE_AT' && (action === 'REMOVE_AT' || action === 'TRAVERSE')) ||
    (context.intent === 'SANDBOX_SEARCH' && (action === 'SEARCH' || action === 'TRAVERSE' || action === 'FOUND'))
  ) {
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
