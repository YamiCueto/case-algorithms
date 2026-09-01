import { useState, useRef, useCallback, useEffect } from 'react';
import { TimeTravelController } from '@/core/engine';
import { ExecutionStep } from '@/core/types';

export interface UseTimeTravelEngineOptions<TState> {
  readonly initialSteps?: readonly ExecutionStep<TState>[];
}

export interface UseTimeTravelEngineReturn<TState> {
  readonly currentStep: ExecutionStep<TState> | null;
  readonly currentIndex: number;
  readonly totalSteps: number;
  readonly isFirst: boolean;
  readonly isLast: boolean;
  readonly isFinal: boolean;
  readonly controller: TimeTravelController<TState> | null;
  readonly handleNext: () => void;
  readonly handlePrevious: () => void;
  readonly handleFirst: () => void;
  readonly handleLast: () => void;
  readonly handleReset: () => void;
  readonly goToStep: (index: number) => void;
  readonly loadSteps: (
    steps: readonly ExecutionStep<TState>[],
    initialIndex?: number
  ) => void;
}

export function useTimeTravelEngine<TState>(
  options?: UseTimeTravelEngineOptions<TState> | readonly ExecutionStep<TState>[]
): UseTimeTravelEngineReturn<TState> {
  const initialSteps = Array.isArray(options)
    ? options
    : options && 'initialSteps' in options
      ? options.initialSteps
      : undefined;

  const controllerRef = useRef<TimeTravelController<TState> | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const [currentStep, setCurrentStep] = useState<ExecutionStep<TState> | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);

  const cleanupSubscription = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }
  }, []);

  const loadSteps = useCallback(
    (steps: readonly ExecutionStep<TState>[], initialIndex: number = 0) => {
      cleanupSubscription();

      const ctrl = new TimeTravelController<TState>(steps, { initialIndex });
      controllerRef.current = ctrl;

      setCurrentStep(ctrl.currentStep);
      setCurrentIndex(ctrl.currentIndex);
      setTotalSteps(ctrl.totalSteps);

      unsubscribeRef.current = ctrl.subscribe((step, idx) => {
        setCurrentStep(step);
        setCurrentIndex(idx);
      });
    },
    [cleanupSubscription]
  );

  const handleNext = useCallback(() => {
    controllerRef.current?.next();
  }, []);

  const handlePrevious = useCallback(() => {
    controllerRef.current?.previous();
  }, []);

  const handleFirst = useCallback(() => {
    controllerRef.current?.first();
  }, []);

  const handleLast = useCallback(() => {
    controllerRef.current?.last();
  }, []);

  const handleReset = useCallback(() => {
    controllerRef.current?.reset();
  }, []);

  const goToStep = useCallback((index: number) => {
    controllerRef.current?.goToStep(index);
  }, []);

  useEffect(() => {
    if (initialSteps && initialSteps.length > 0) {
      loadSteps(initialSteps);
    }
    return () => {
      cleanupSubscription();
    };
  }, [initialSteps, loadSteps, cleanupSubscription]);

  const isFirst = totalSteps === 0 || currentIndex === 0;
  const isLast = totalSteps > 0 && currentIndex === totalSteps - 1;
  const isFinal = isLast;

  return {
    currentStep,
    currentIndex,
    totalSteps,
    isFirst,
    isLast,
    isFinal,
    controller: controllerRef.current,
    handleNext,
    handlePrevious,
    handleFirst,
    handleLast,
    handleReset,
    goToStep,
    loadSteps,
  };
}
