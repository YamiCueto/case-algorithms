import { useState, useEffect, useRef, useCallback } from 'react';
import { animate, createScope, cleanInlineStyles, JSAnimation, Scope } from 'animejs';
import { ExecutionStep } from '@/core/types';
import { QueueState } from '@/core/data-structures/queue';
import {
  QueueTransitionContext,
  isQueueTransitionEligible,
} from './queueTransitionTypes';

export type QueueGhostLifecycleState = 'IDLE' | 'SPAWNED' | 'ANIMATING' | 'COMPLETED' | 'CANCELLED';

export interface QueueGhostNode {
  readonly id: string;
  readonly transitionId: number;
  readonly value: number;
  readonly slotIndex: number;
  readonly state: QueueGhostLifecycleState;
}

export interface UseQueueAnimationProps {
  readonly step: ExecutionStep<QueueState> | null;
  readonly transitionContext?: QueueTransitionContext;
  readonly containerRef: React.RefObject<SVGSVGElement | SVGGElement | null>;
}

export interface UseQueueAnimationReturn {
  readonly ghostNode: QueueGhostNode | null;
  readonly isAnimating: boolean;
}

export function useQueueAnimation({
  step,
  transitionContext,
  containerRef,
}: UseQueueAnimationProps): UseQueueAnimationReturn {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const [ghostNode, setGhostNode] = useState<QueueGhostNode | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const scopeRef = useRef<Scope | null>(null);
  const activeAnimationsRef = useRef<JSAnimation[]>([]);
  const activeEpochRef = useRef<number>(0);
  const lastHandledTransitionIdRef = useRef<number>(-1);
  const prevStepIndexRef = useRef<number | undefined>(undefined);
  const prevHistoryIdRef = useRef<string | undefined>(undefined);
  const prevStepRef = useRef<ExecutionStep<QueueState> | null>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

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
    if (ghostNode && ghostNode.state === 'SPAWNED') {
      const container = containerRef.current;
      if (!container) {
        setGhostNode(null);
        return;
      }

      const ghostElement = container.querySelector('#queue-ghost-node');
      if (!ghostElement) {
        setGhostNode(null);
        return;
      }

      const epoch = activeEpochRef.current;
      const speed = transitionContext?.playbackSpeed ?? 600;
      const duration = Math.min(420, Math.max(160, Math.round(speed * 0.65)));

      const completeGhost = () => {
        if (activeEpochRef.current !== epoch) {
          return;
        }
        resetTargetStyles(ghostElement);
        setGhostNode(null);
        setIsAnimating(false);
      };

      try {
        const anim = animate(ghostElement, {
          translateX: [0, -32],
          translateY: [0, 20],
          opacity: [1, 0],
          scale: [1, 0.75],
          duration,
          ease: 'easeOutQuad',
        });
        activeAnimationsRef.current.push(anim);

        anim.then(completeGhost).catch(() => {
          if (activeEpochRef.current === epoch) {
            completeGhost();
          }
        });
      } catch {
        completeGhost();
      }
    }
  }, [ghostNode, transitionContext, containerRef, resetTargetStyles]);

  useEffect(() => {
    if (!step) {
      cancelActiveAnimations();
      setGhostNode(null);
      prevStepIndexRef.current = undefined;
      prevHistoryIdRef.current = undefined;
      prevStepRef.current = null;
      return;
    }

    const currentTransitionId = transitionContext?.transitionId ?? -1;
    if (currentTransitionId === lastHandledTransitionIdRef.current) {
      prevStepRef.current = step;
      return;
    }
    lastHandledTransitionIdRef.current = currentTransitionId;

    const action = step.action;
    const isEligible = isQueueTransitionEligible({
      context: transitionContext,
      prevStepIndex: prevStepIndexRef.current,
      prevHistoryId: prevHistoryIdRef.current,
      action,
      prefersReducedMotion: reducedMotion,
    });

    const previousStep = prevStepRef.current;
    prevStepIndexRef.current = transitionContext?.stepIndex;
    prevHistoryIdRef.current = transitionContext?.historyId;
    prevStepRef.current = step;

    if (!isEligible) {
      cancelActiveAnimations();
      setGhostNode(null);
      const container = containerRef.current;
      if (container) {
        container.querySelectorAll('.queue-node-motion, .queue-pointer-motion').forEach(resetTargetStyles);
      }
      return;
    }

    const speed = transitionContext?.playbackSpeed ?? 600;
    const container = containerRef.current;
    if (!container) {
      return;
    }

    if (action === 'ENQUEUE') {
      cancelActiveAnimations();
      setGhostNode(null);
      const epoch = ++activeEpochRef.current;
      setIsAnimating(true);

      const targetRear = step.state.rearIndex;
      const slotElement = container.querySelector(`#queue-node-${targetRear}`);
      const rearPointer = container.querySelector('.queue-rear-pointer-motion');

      const duration = Math.min(420, Math.max(160, Math.round(speed * 0.65)));
      const animations: JSAnimation[] = [];

      const completeEnqueue = () => {
        if (activeEpochRef.current !== epoch) {
          return;
        }
        if (slotElement) {
          resetTargetStyles(slotElement);
        }
        if (rearPointer) {
          resetTargetStyles(rearPointer);
        }
        setIsAnimating(false);
      };

      try {
        if (slotElement) {
          const animNode = animate(slotElement, {
            translateY: [-24, 0],
            scale: [0.75, 1],
            opacity: [0, 1],
            duration,
            ease: 'easeOutBack',
          });
          animations.push(animNode);
        }

        if (rearPointer) {
          const animPtr = animate(rearPointer, {
            translateY: [-10, 0],
            duration: Math.min(350, duration),
            ease: 'easeOutQuad',
          });
          animations.push(animPtr);
        }

        activeAnimationsRef.current = animations;

        if (animations.length > 0) {
          Promise.all(animations.map((a) => a.then()))
            .then(completeEnqueue)
            .catch(() => {
              if (activeEpochRef.current === epoch) {
                completeEnqueue();
              }
            });
        } else {
          completeEnqueue();
        }
      } catch {
        completeEnqueue();
      }
      return;
    }

    if (action === 'DEQUEUE') {
      cancelActiveAnimations();
      const epoch = ++activeEpochRef.current;
      setIsAnimating(true);

      const frontPointer = container.querySelector('.queue-front-pointer-motion');
      if (frontPointer) {
        try {
          const animPtr = animate(frontPointer, {
            translateY: [10, 0],
            duration: Math.min(350, Math.max(140, Math.round(speed * 0.5))),
            ease: 'easeOutQuad',
          });
          activeAnimationsRef.current = [animPtr];
        } catch {
          void 0;
        }
      }

      const prevFront = previousStep?.state.frontIndex ?? -1;
      const dequeuedVal =
        (prevFront >= 0 ? previousStep?.state.buffer[prevFront] : null) ??
        (previousStep?.state.items[0] ?? 0);

      const ghostSlotIndex =
        prevFront >= 0
          ? prevFront
          : (step.state.frontIndex - 1 + step.state.capacity) % step.state.capacity;

      setGhostNode({
        id: `queue-ghost-${epoch}`,
        transitionId: currentTransitionId,
        value: dequeuedVal,
        slotIndex: ghostSlotIndex >= 0 ? ghostSlotIndex : 0,
        state: 'SPAWNED',
      });
    }
  }, [step, transitionContext, reducedMotion, containerRef, cancelActiveAnimations, resetTargetStyles]);

  return { ghostNode, isAnimating };
}
