import { useState, useEffect, useRef, useCallback } from 'react';
import { animate, createScope, cleanInlineStyles, JSAnimation, Scope } from 'animejs';
import { ExecutionStep } from '@/core/types';
import { StackState } from '@/core/data-structures/stack';
import {
  StackTransitionContext,
  isStackTransitionEligible,
} from './stackTransitionTypes';

export type GhostLifecycleState = 'IDLE' | 'SPAWNED' | 'ANIMATING' | 'COMPLETED' | 'CANCELLED';

export interface StackGhostNode {
  readonly id: string;
  readonly transitionId: number;
  readonly value: number;
  readonly originalIndex: number;
  readonly state: GhostLifecycleState;
}

export interface UseStackAnimationProps {
  readonly step: ExecutionStep<StackState> | null;
  readonly transitionContext?: StackTransitionContext;
  readonly containerRef: React.RefObject<SVGSVGElement | SVGGElement | null>;
  readonly getItemY: (index: number) => number;
  readonly stackWallTop: number;
  readonly nodeHeight: number;
  readonly gap: number;
}

export interface UseStackAnimationReturn {
  readonly ghostNode: StackGhostNode | null;
  readonly isAnimating: boolean;
}

export function useStackAnimation({
  step,
  transitionContext,
  containerRef,
  getItemY,
  stackWallTop,
  nodeHeight,
  gap,
}: UseStackAnimationProps): UseStackAnimationReturn {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const [ghostNode, setGhostNode] = useState<StackGhostNode | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const scopeRef = useRef<Scope | null>(null);
  const activeAnimationsRef = useRef<JSAnimation[]>([]);
  const activeEpochRef = useRef<number>(0);
  const lastHandledTransitionIdRef = useRef<number>(-1);
  const prevStepIndexRef = useRef<number | undefined>(undefined);
  const prevHistoryIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const resetTargetStyles = useCallback((element: Element | null) => {
    if (!element || !(element instanceof SVGElement || element instanceof HTMLElement)) {
      return;
    }
    element.style.transform = '';
    element.style.opacity = '';
  }, []);

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const cancelActiveAnimations = useCallback(() => {
    activeEpochRef.current += 1;
    for (const timeoutId of timeoutsRef.current) {
      clearTimeout(timeoutId);
    }
    timeoutsRef.current = [];

    for (const anim of activeAnimationsRef.current) {
      try {
        cleanInlineStyles(anim);
        anim.cancel();
      } catch {
        void 0;
      }
    }
    activeAnimationsRef.current = [];
    setIsAnimating(false);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      cancelActiveAnimations();
      setGhostNode(null);
    }
  }, [reducedMotion, cancelActiveAnimations]);

  useEffect(() => {
    if (containerRef.current && !scopeRef.current) {
      scopeRef.current = createScope({ root: containerRef.current });
    }
    return () => {
      cancelActiveAnimations();
      if (scopeRef.current) {
        scopeRef.current.revert();
        scopeRef.current = null;
      }
    };
  }, [containerRef, cancelActiveAnimations]);

  useEffect(() => {
    if (!step) {
      cancelActiveAnimations();
      setGhostNode(null);
      prevStepIndexRef.current = undefined;
      prevHistoryIdRef.current = undefined;
      return;
    }

    const currentTransitionId = transitionContext?.transitionId ?? -1;
    if (currentTransitionId === lastHandledTransitionIdRef.current) {
      return;
    }
    lastHandledTransitionIdRef.current = currentTransitionId;

    const op = step.state.operation;
    const isEligible = isStackTransitionEligible({
      context: transitionContext,
      prevStepIndex: prevStepIndexRef.current,
      prevHistoryId: prevHistoryIdRef.current,
      action: op,
      prefersReducedMotion: reducedMotion,
    });

    prevStepIndexRef.current = transitionContext?.stepIndex;
    prevHistoryIdRef.current = transitionContext?.historyId;

    if (!isEligible) {
      cancelActiveAnimations();
      setGhostNode(null);
      const container = containerRef.current;
      if (container) {
        container.querySelectorAll('.stack-slot-motion, .stack-pointer-motion').forEach(resetTargetStyles);
      }
      return;
    }

    const speed = transitionContext?.playbackSpeed ?? 600;
    const animDuration = Math.min(450, Math.max(120, Math.round(speed * 0.6)));

    if (op === 'PUSH') {
      cancelActiveAnimations();
      setGhostNode(null);

      const epoch = ++activeEpochRef.current;
      setIsAnimating(true);

      const topIdx = step.state.topIndex;
      const container = containerRef.current;
      if (!container || topIdx < 0) {
        setIsAnimating(false);
        return;
      }

      const slotElement = container.querySelector(
        `.stack-slot-group[data-slot-index="${topIdx}"] .stack-slot-motion`
      );
      const pointerElement = container.querySelector('.stack-pointer-motion');

      if (!slotElement) {
        setIsAnimating(false);
        return;
      }

      const targetY = getItemY(topIdx) + nodeHeight / 2;
      const startY = stackWallTop - 40;
      const deltaY = startY - targetY;

      const animations: JSAnimation[] = [];

      const completePush = () => {
        if (activeEpochRef.current !== epoch) {
          return;
        }
        resetTargetStyles(slotElement);
        if (pointerElement) {
          resetTargetStyles(pointerElement);
        }
        setIsAnimating(false);
      };

      const pushFallback = setTimeout(completePush, animDuration + 20);
      timeoutsRef.current.push(pushFallback);

      const pushAnim = animate(slotElement, {
        translateY: [deltaY, 0],
        scale: [0.96, 1],
        duration: animDuration,
        ease: 'outBack',
        onComplete: () => {
          clearTimeout(pushFallback);
          completePush();
        },
      });
      animations.push(pushAnim);

      if (pointerElement) {
        const pointerAnim = animate(pointerElement, {
          translateY: [nodeHeight + gap, 0],
          duration: animDuration,
          ease: 'outQuad',
          onComplete: () => {
            if (activeEpochRef.current !== epoch) {
              return;
            }
            resetTargetStyles(pointerElement);
          },
        });
        animations.push(pointerAnim);
      }

      activeAnimationsRef.current = animations;
    } else if (op === 'POP') {
      cancelActiveAnimations();

      const poppedVal = step.state.targetElement ?? 0;
      const originalIdx = step.state.items.length;

      setGhostNode({
        id: `stack-ghost-${currentTransitionId}`,
        transitionId: currentTransitionId,
        value: poppedVal,
        originalIndex: originalIdx,
        state: 'SPAWNED',
      });
    }
  }, [
    step,
    transitionContext,
    reducedMotion,
    containerRef,
    cancelActiveAnimations,
    resetTargetStyles,
    getItemY,
    stackWallTop,
    nodeHeight,
    gap,
  ]);

  useEffect(() => {
    if (!ghostNode || ghostNode.state !== 'SPAWNED') {
      return;
    }

    const container = containerRef.current;
    if (!container) {
      return;
    }

    const ghostElement = container.querySelector(
      `.stack-ghost-motion[data-ghost-id="${ghostNode.id}"]`
    );
    const pointerElement = container.querySelector('.stack-pointer-motion');

    if (!ghostElement) {
      return;
    }

    const speed = transitionContext?.playbackSpeed ?? 600;
    const animDuration = Math.min(450, Math.max(120, Math.round(speed * 0.6)));
    const epoch = ++activeEpochRef.current;
    setIsAnimating(true);

    const completePop = () => {
      if (activeEpochRef.current !== epoch) {
        return;
      }
      resetTargetStyles(ghostElement);
      if (pointerElement) {
        resetTargetStyles(pointerElement);
      }
      setGhostNode(null);
      setIsAnimating(false);
    };

    const popFallback = setTimeout(completePop, animDuration + 20);
    timeoutsRef.current.push(popFallback);

    const animations: JSAnimation[] = [];

    const targetGhostY = getItemY(ghostNode.originalIndex) + nodeHeight / 2;
    const exitGhostY = stackWallTop - 30;
    const deltaGhostY = exitGhostY - targetGhostY;

    const ghostAnim = animate(ghostElement, {
      translateY: [0, deltaGhostY],
      opacity: [1, 0],
      duration: animDuration,
      ease: 'inQuad',
      onComplete: () => {
        clearTimeout(popFallback);
        completePop();
      },
    });
    animations.push(ghostAnim);

    if (pointerElement) {
      const pointerAnim = animate(pointerElement, {
        translateY: [-(nodeHeight + gap), 0],
        duration: animDuration,
        ease: 'outQuad',
        onComplete: () => {
          if (activeEpochRef.current !== epoch) {
            return;
          }
          resetTargetStyles(pointerElement);
        },
      });
      animations.push(pointerAnim);
    }

    activeAnimationsRef.current = animations;
  }, [
    ghostNode,
    containerRef,
    transitionContext,
    getItemY,
    stackWallTop,
    nodeHeight,
    gap,
    resetTargetStyles,
  ]);

  return {
    ghostNode,
    isAnimating,
  };
}
