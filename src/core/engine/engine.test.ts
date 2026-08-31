import { describe, it, expect, vi } from 'vitest';
import { TimeTravelController } from './time-travel-controller';
import { ExecutionStep } from '../types';

interface SyntheticArrayState {
  array: number[];
  currentIndex: number;
  highlighted?: number[];
}

function createSyntheticSteps(count: number): ExecutionStep<SyntheticArrayState>[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `step-${i}`,
    stepIndex: i,
    totalSteps: count,
    action: i === 0 ? 'INITIALIZE' : i === count - 1 ? 'COMPLETE' : 'VISIT',
    description: `Step ${i} description`,
    a11yMessage: `Step ${i} accessibility message`,
    state: {
      array: [10, 20, 30, 40, 50],
      currentIndex: i,
      highlighted: [i],
    },
    activeIndices: [i],
  }));
}

describe('TimeTravelController', () => {
  describe('Empty sequence', () => {
    it('handles empty step sequences safely without throwing', () => {
      const controller = new TimeTravelController<SyntheticArrayState>([]);

      expect(controller.totalSteps).toBe(0);
      expect(controller.currentIndex).toBe(-1);
      expect(controller.currentStep).toBeNull();
      expect(controller.currentState).toBeNull();
      expect(controller.hasNext).toBe(false);
      expect(controller.hasPrevious).toBe(false);
      expect(controller.isInitial).toBe(true);
      expect(controller.isFinal).toBe(true);
      expect(controller.progress).toBe(0);
      expect(controller.history).toEqual([]);

      expect(controller.next()).toBeNull();
      expect(controller.previous()).toBeNull();
      expect(controller.first()).toBeNull();
      expect(controller.last()).toBeNull();
      expect(controller.reset()).toBeNull();
      expect(controller.goToStep(5)).toBeNull();
    });
  });

  describe('Single-step sequence', () => {
    it('initializes and manages a single step sequence', () => {
      const singleStep = createSyntheticSteps(1);
      const controller = new TimeTravelController(singleStep);

      expect(controller.totalSteps).toBe(1);
      expect(controller.currentIndex).toBe(0);
      expect(controller.currentStep?.id).toBe('step-0');
      expect(controller.currentState?.currentIndex).toBe(0);
      expect(controller.hasNext).toBe(false);
      expect(controller.hasPrevious).toBe(false);
      expect(controller.isInitial).toBe(true);
      expect(controller.isFinal).toBe(true);
      expect(controller.progress).toBe(1);

      expect(controller.next()?.id).toBe('step-0');
      expect(controller.previous()?.id).toBe('step-0');
      expect(controller.first()?.id).toBe('step-0');
      expect(controller.last()?.id).toBe('step-0');
      expect(controller.reset()?.id).toBe('step-0');
    });
  });

  describe('Multi-step navigation', () => {
    it('navigates forward and backward sequentially', () => {
      const steps = createSyntheticSteps(5);
      const controller = new TimeTravelController(steps);

      expect(controller.totalSteps).toBe(5);
      expect(controller.currentIndex).toBe(0);
      expect(controller.isInitial).toBe(true);
      expect(controller.isFinal).toBe(false);
      expect(controller.hasNext).toBe(true);
      expect(controller.hasPrevious).toBe(false);

      const step1 = controller.next();
      expect(step1?.stepIndex).toBe(1);
      expect(controller.currentIndex).toBe(1);
      expect(controller.hasPrevious).toBe(true);
      expect(controller.hasNext).toBe(true);
      expect(controller.progress).toBe(0.25);

      const step2 = controller.next();
      expect(step2?.stepIndex).toBe(2);
      expect(controller.currentIndex).toBe(2);
      expect(controller.progress).toBe(0.5);

      const stepPrev = controller.previous();
      expect(stepPrev?.stepIndex).toBe(1);
      expect(controller.currentIndex).toBe(1);
    });

    it('jumps to first, last, and arbitrary steps with bounds clamping', () => {
      const steps = createSyntheticSteps(6);
      const controller = new TimeTravelController(steps);

      controller.last();
      expect(controller.currentIndex).toBe(5);
      expect(controller.isFinal).toBe(true);
      expect(controller.hasNext).toBe(false);
      expect(controller.progress).toBe(1);

      controller.first();
      expect(controller.currentIndex).toBe(0);
      expect(controller.isInitial).toBe(true);

      controller.goToStep(3);
      expect(controller.currentIndex).toBe(3);
      expect(controller.currentStep?.id).toBe('step-3');

      controller.goToStep(-50);
      expect(controller.currentIndex).toBe(0);

      controller.goToStep(999);
      expect(controller.currentIndex).toBe(5);
    });

    it('resets to initial configured index', () => {
      const steps = createSyntheticSteps(5);
      const controller = new TimeTravelController(steps, { initialIndex: 2 });

      expect(controller.currentIndex).toBe(2);

      controller.last();
      expect(controller.currentIndex).toBe(4);

      controller.reset();
      expect(controller.currentIndex).toBe(2);
    });
  });

  describe('Error handling & Non-standard numeric inputs', () => {
    it('sanitizes NaN, Infinity, -Infinity and decimal indices', () => {
      const steps = createSyntheticSteps(5);
      const controller = new TimeTravelController(steps);

      controller.goToStep(NaN);
      expect(controller.currentIndex).toBe(0);

      controller.goToStep(Infinity);
      expect(controller.currentIndex).toBe(0);

      controller.goToStep(-Infinity);
      expect(controller.currentIndex).toBe(0);

      controller.goToStep(2.8);
      expect(controller.currentIndex).toBe(2);
    });

    it('handles NaN initialIndex safely in constructor', () => {
      const steps = createSyntheticSteps(5);
      const controller = new TimeTravelController(steps, { initialIndex: NaN });
      expect(controller.currentIndex).toBe(0);
    });
  });

  describe('State isolation and immutability', () => {
    it('isolates internal history from external mutations to input array', () => {
      const originalSteps = createSyntheticSteps(3);
      const firstStepState = originalSteps[0]?.state;
      const controller = new TimeTravelController(originalSteps);

      if (firstStepState) {
        firstStepState.array.push(999);
      }

      expect(controller.currentStep?.state.array).toEqual([10, 20, 30, 40, 50]);
    });

    it('prevents runtime mutation on currentStep and state (frozen objects)', () => {
      const steps = createSyntheticSteps(3);
      const controller = new TimeTravelController(steps);

      const readStep = controller.currentStep;
      expect(readStep).not.toBeNull();
      expect(Object.isFrozen(readStep)).toBe(true);
      expect(Object.isFrozen(readStep?.state)).toBe(true);
      expect(Object.isFrozen(readStep?.state.array)).toBe(true);

      expect(() => {
        (readStep?.state.array as number[]).push(777);
      }).toThrow();
    });

    it('provides O(1) stable reference access without re-cloning on every getter call', () => {
      const steps = createSyntheticSteps(3);
      const controller = new TimeTravelController(steps);

      const ref1 = controller.currentStep;
      const ref2 = controller.currentStep;
      expect(ref1).toBe(ref2);
    });

    it('supports custom cloneState implementation', () => {
      const steps = createSyntheticSteps(3);
      const customClone = vi.fn((state: SyntheticArrayState) => ({
        array: [...state.array],
        currentIndex: state.currentIndex,
        highlighted: state.highlighted ? [...state.highlighted] : undefined,
      }));

      const controller = new TimeTravelController(steps, { cloneState: customClone });

      expect(customClone).toHaveBeenCalled();
      expect(controller.currentStep?.state.array).toEqual([10, 20, 30, 40, 50]);
    });
  });

  describe('Pub/Sub and listener safety', () => {
    it('notifies subscribers on state changes and un-subscribes properly', () => {
      const steps = createSyntheticSteps(4);
      const controller = new TimeTravelController(steps);
      const listener = vi.fn();

      const unsubscribe = controller.subscribe(listener);

      controller.next();
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({ stepIndex: 1 }), 1);

      controller.goToStep(3);
      expect(listener).toHaveBeenCalledTimes(2);
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({ stepIndex: 3 }), 3);

      unsubscribe();
      controller.previous();
      expect(listener).toHaveBeenCalledTimes(2);
    });

    it('handles concurrent unsubscription safely inside its own callback', () => {
      const steps = createSyntheticSteps(4);
      const controller = new TimeTravelController(steps);

      const unsubHolder: { unsub?: () => void } = {};
      const listener1 = vi.fn(() => {
        unsubHolder.unsub?.();
      });
      const listener2 = vi.fn();

      unsubHolder.unsub = controller.subscribe(listener1);
      controller.subscribe(listener2);

      controller.next();

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);

      controller.next();
      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(2);
    });

    it('replaces active sequence with setSteps and notifies listeners', () => {
      const initialSteps = createSyntheticSteps(2);
      const controller = new TimeTravelController(initialSteps);
      const listener = vi.fn();

      controller.subscribe(listener);

      const newSteps = createSyntheticSteps(5);
      controller.setSteps(newSteps, 3);

      expect(controller.totalSteps).toBe(5);
      expect(controller.currentIndex).toBe(3);
      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({ stepIndex: 3 }), 3);
    });
  });

  describe('Determinism', () => {
    it('ensures two controllers with identical inputs behave identically', () => {
      const stepsA = createSyntheticSteps(5);
      const stepsB = createSyntheticSteps(5);

      const controllerA = new TimeTravelController(stepsA);
      const controllerB = new TimeTravelController(stepsB);

      const ops = ['next', 'next', 'previous', 'last', 'first', 'reset'] as const;

      for (const op of ops) {
        const stepA = controllerA[op]();
        const stepB = controllerB[op]();

        expect(stepA).toEqual(stepB);
        expect(controllerA.currentIndex).toBe(controllerB.currentIndex);
        expect(controllerA.progress).toBe(controllerB.progress);
        expect(controllerA.hasNext).toBe(controllerB.hasNext);
        expect(controllerA.hasPrevious).toBe(controllerB.hasPrevious);
      }
    });
  });
});
