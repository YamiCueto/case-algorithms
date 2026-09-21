import { useState, useEffect, useRef, useCallback } from 'react';
import { animate, createScope, cleanInlineStyles, JSAnimation, Scope } from 'animejs';
import { ExecutionStep } from '@/core/types';
import { ArrayState } from '@/core/data-structures/array';
import {
  ArrayTransitionContext,
  isArrayTransitionEligible,
} from './arrayTransitionTypes';

export interface UseArrayAnimationProps {
  readonly step: ExecutionStep<ArrayState> | null;
  readonly transitionContext?: ArrayTransitionContext;
  readonly containerRef: React.RefObject<SVGSVGElement | SVGGElement | null>;
  readonly slotDistance: number;
}

export interface UseArrayAnimationReturn {
  readonly isAnimating: boolean;
}

export function useArrayAnimation({
  step,
  transitionContext,
  containerRef,
  slotDistance,
}: UseArrayAnimationProps): UseArrayAnimationReturn {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const scopeRef = useRef<Scope | null>(null);
  const activeAnimationsRef = useRef<JSAnimation[]>([]);
  const activeEpochRef = useRef<number>(0);
  const lastHandledTransitionIdRef = useRef<number>(-1);
  const prevStepIndexRef = useRef<number | undefined>(undefined);
  const prevHistoryIdRef = useRef<string | undefined>(undefined);
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
      prevStepIndexRef.current = undefined;
      prevHistoryIdRef.current = undefined;
      return;
    }

    const currentTransitionId = transitionContext?.transitionId ?? -1;
    if (currentTransitionId === lastHandledTransitionIdRef.current) {
      return;
    }
    lastHandledTransitionIdRef.current = currentTransitionId;

    const action = step.action;
    const isEligible = isArrayTransitionEligible({
      context: transitionContext,
      prevStepIndex: prevStepIndexRef.current,
      prevHistoryId: prevHistoryIdRef.current,
      action,
      prefersReducedMotion: reducedMotion,
    });

    prevStepIndexRef.current = transitionContext?.stepIndex;
    prevHistoryIdRef.current = transitionContext?.historyId;

    if (!isEligible) {
      cancelActiveAnimations();
      const container = containerRef.current;
      if (container) {
        container.querySelectorAll('.array-node-group').forEach(resetTargetStyles);
      }
      return;
    }

    const speed = transitionContext?.playbackSpeed ?? 600;
    const container = containerRef.current;
    if (!container) {
      return;
    }

    if (action === 'SWAP' && step.state.swappedIndices) {
      cancelActiveAnimations();
      const epoch = ++activeEpochRef.current;
      setIsAnimating(true);

      const [idxA, idxB] = step.state.swappedIndices;
      const elA = container.querySelector(`#array-node-${idxA}`);
      const elB = container.querySelector(`#array-node-${idxB}`);

      if (!elA || !elB) {
        setIsAnimating(false);
        return;
      }

      const diff = (idxB - idxA) * slotDistance;
      const duration = Math.min(450, Math.max(160, Math.round(speed * 0.7)));

      const animations: JSAnimation[] = [];

      const completeSwap = () => {
        if (activeEpochRef.current !== epoch) {
          return;
        }
        resetTargetStyles(elA);
        resetTargetStyles(elB);
        setIsAnimating(false);
      };

      try {
        const animA = animate(elA, {
          translateX: [diff, 0],
          translateY: [-16, 0],
          duration,
          ease: 'easeInOutCubic',
        });
        animations.push(animA);

        const animB = animate(elB, {
          translateX: [-diff, 0],
          translateY: [16, 0],
          duration,
          ease: 'easeInOutCubic',
        });
        animations.push(animB);

        activeAnimationsRef.current = animations;

        Promise.all([animA.then(), animB.then()])
          .then(completeSwap)
          .catch(() => {
            if (activeEpochRef.current === epoch) {
              completeSwap();
            }
          });
      } catch {
        completeSwap();
      }
      return;
    }

    if (action === 'COMPARE' && step.state.comparingIndices) {
      cancelActiveAnimations();
      const epoch = ++activeEpochRef.current;
      setIsAnimating(true);

      const [idxA, idxB] = step.state.comparingIndices;
      const elA = container.querySelector(`#array-node-${idxA}`);
      const elB = container.querySelector(`#array-node-${idxB}`);

      if (!elA && !elB) {
        setIsAnimating(false);
        return;
      }

      const elements = [elA, elB].filter(Boolean) as Element[];
      const duration = Math.min(360, Math.max(120, Math.round(speed * 0.5)));

      const completeCompare = () => {
        if (activeEpochRef.current !== epoch) {
          return;
        }
        elements.forEach(resetTargetStyles);
        setIsAnimating(false);
      };

      try {
        const anim = animate(elements, {
          translateY: [0, -10, 0],
          duration,
          ease: 'easeOutQuad',
        });
        activeAnimationsRef.current = [anim];

        anim.then(completeCompare).catch(() => {
          if (activeEpochRef.current === epoch) {
            completeCompare();
          }
        });
      } catch {
        completeCompare();
      }
      return;
    }

    if (action === 'SET_POINTER') {
      const sortedIdx =
        step.state.activeIndex ??
        step.state.sortedIndices[step.state.sortedIndices.length - 1];

      if (sortedIdx === undefined) {
        return;
      }

      const elSorted = container.querySelector(`#array-node-${sortedIdx}`);
      if (!elSorted) {
        return;
      }

      cancelActiveAnimations();
      const epoch = ++activeEpochRef.current;
      setIsAnimating(true);

      const duration = Math.min(400, Math.max(140, Math.round(speed * 0.6)));

      const completeSorted = () => {
        if (activeEpochRef.current !== epoch) {
          return;
        }
        resetTargetStyles(elSorted);
        setIsAnimating(false);
      };

      try {
        const anim = animate(elSorted, {
          scale: [1, 1.15, 1],
          duration,
          ease: 'easeOutBack',
        });
        activeAnimationsRef.current = [anim];

        anim.then(completeSorted).catch(() => {
          if (activeEpochRef.current === epoch) {
            completeSorted();
          }
        });
      } catch {
        completeSorted();
      }
    }
  }, [step, transitionContext, reducedMotion, containerRef, slotDistance, cancelActiveAnimations, resetTargetStyles]);

  return { isAnimating };
}
