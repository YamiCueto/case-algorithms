import { useState, useEffect, useRef, useCallback } from 'react';
import { animate, createScope, cleanInlineStyles, JSAnimation, Scope } from 'animejs';
import { ExecutionStep } from '@/core/types';
import { LinkedListState } from '@/core/data-structures/linked-list';
import {
  LinkedListTransitionContext,
  isLinkedListTransitionEligible,
} from './linkedListTransitionTypes';

export type LinkedListGhostLifecycleState = 'IDLE' | 'SPAWNED' | 'ANIMATING' | 'COMPLETED' | 'CANCELLED';

export interface LinkedListGhostNode {
  readonly id: string;
  readonly transitionId: number;
  readonly value: number;
  readonly originalIndex: number;
  readonly state: LinkedListGhostLifecycleState;
}

export interface UseLinkedListAnimationProps {
  readonly step: ExecutionStep<LinkedListState> | null;
  readonly transitionContext?: LinkedListTransitionContext;
  readonly containerRef: React.RefObject<SVGSVGElement | SVGGElement | null>;
}

export interface UseLinkedListAnimationReturn {
  readonly ghostNode: LinkedListGhostNode | null;
  readonly isAnimating: boolean;
}

export function useLinkedListAnimation({
  step,
  transitionContext,
  containerRef,
}: UseLinkedListAnimationProps): UseLinkedListAnimationReturn {
  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const [ghostNode, setGhostNode] = useState<LinkedListGhostNode | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const scopeRef = useRef<Scope | null>(null);
  const activeAnimationsRef = useRef<JSAnimation[]>([]);
  const activeEpochRef = useRef<number>(0);
  const lastHandledTransitionIdRef = useRef<number>(-1);
  const prevStepIndexRef = useRef<number | undefined>(undefined);
  const prevHistoryIdRef = useRef<string | undefined>(undefined);
  const prevStepRef = useRef<ExecutionStep<LinkedListState> | null>(null);
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

      const ghostElement = container.querySelector('#ll-ghost-node');
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
          translateY: [0, 32],
          opacity: [1, 0],
          scale: [1, 0.65],
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
    const isEligible = isLinkedListTransitionEligible({
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
        container.querySelectorAll('.ll-node-motion, .ll-pointer-motion').forEach(resetTargetStyles);
      }
      return;
    }

    const speed = transitionContext?.playbackSpeed ?? 600;
    const container = containerRef.current;
    if (!container) {
      return;
    }

    if (action === 'PREPEND' || action === 'APPEND' || action === 'INSERT_AT') {
      cancelActiveAnimations();
      setGhostNode(null);
      const epoch = ++activeEpochRef.current;
      setIsAnimating(true);

      const targetNodeId = step.state.activeNodeId;
      const element = targetNodeId ? container.querySelector(`#ll-node-${targetNodeId}`) : null;

      if (!element) {
        setIsAnimating(false);
        return;
      }

      const duration = Math.min(420, Math.max(160, Math.round(speed * 0.65)));

      const completeEntrance = () => {
        if (activeEpochRef.current !== epoch) {
          return;
        }
        resetTargetStyles(element);
        setIsAnimating(false);
      };

      try {
        const anim = animate(element, {
          scale: [0.65, 1],
          translateY: [-28, 0],
          opacity: [0, 1],
          duration,
          ease: 'easeOutBack',
        });
        activeAnimationsRef.current = [anim];

        anim.then(completeEntrance).catch(() => {
          if (activeEpochRef.current === epoch) {
            completeEntrance();
          }
        });
      } catch {
        completeEntrance();
      }
      return;
    }

    if (action === 'TRAVERSE' || action === 'SEARCH') {
      cancelActiveAnimations();
      const epoch = ++activeEpochRef.current;
      setIsAnimating(true);

      const targetNodeId = step.state.activeNodeId;
      const element = targetNodeId ? container.querySelector(`#ll-node-${targetNodeId}`) : null;

      if (!element) {
        setIsAnimating(false);
        return;
      }

      const duration = Math.min(340, Math.max(120, Math.round(speed * 0.5)));

      const completeTraverse = () => {
        if (activeEpochRef.current !== epoch) {
          return;
        }
        resetTargetStyles(element);
        setIsAnimating(false);
      };

      try {
        const anim = animate(element, {
          translateY: [0, -8, 0],
          scale: [1, 1.12, 1],
          duration,
          ease: 'easeOutQuad',
        });
        activeAnimationsRef.current = [anim];

        anim.then(completeTraverse).catch(() => {
          if (activeEpochRef.current === epoch) {
            completeTraverse();
          }
        });
      } catch {
        completeTraverse();
      }
      return;
    }

    if (action === 'FOUND') {
      cancelActiveAnimations();
      const epoch = ++activeEpochRef.current;
      setIsAnimating(true);

      const targetNodeId = step.state.activeNodeId;
      const element = targetNodeId ? container.querySelector(`#ll-node-${targetNodeId}`) : null;

      if (!element) {
        setIsAnimating(false);
        return;
      }

      const duration = Math.min(420, Math.max(160, Math.round(speed * 0.65)));

      const completeFound = () => {
        if (activeEpochRef.current !== epoch) {
          return;
        }
        resetTargetStyles(element);
        setIsAnimating(false);
      };

      try {
        const anim = animate(element, {
          scale: [1, 1.2, 1],
          duration,
          ease: 'easeOutBack',
        });
        activeAnimationsRef.current = [anim];

        anim.then(completeFound).catch(() => {
          if (activeEpochRef.current === epoch) {
            completeFound();
          }
        });
      } catch {
        completeFound();
      }
      return;
    }

    if (action === 'REMOVE_AT') {
      cancelActiveAnimations();
      const epoch = ++activeEpochRef.current;
      setIsAnimating(true);

      const prevNodes = previousStep?.state.nodes ?? [];
      const currentNodes = step.state.nodes;
      const removedNode = prevNodes.find((pn) => !currentNodes.some((cn) => cn.id === pn.id));

      if (removedNode) {
        setGhostNode({
          id: `ll-ghost-${epoch}`,
          transitionId: currentTransitionId,
          value: removedNode.value,
          originalIndex: removedNode.index,
          state: 'SPAWNED',
        });
      } else {
        setIsAnimating(false);
      }
    }
  }, [step, transitionContext, reducedMotion, containerRef, cancelActiveAnimations, resetTargetStyles]);

  return { ghostNode, isAnimating };
}
