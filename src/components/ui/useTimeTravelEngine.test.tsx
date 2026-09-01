import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTimeTravelEngine } from './useTimeTravelEngine';
import { ExecutionStep } from '@/core/types';

interface MockState {
  val: number;
}

const createMockStep = (idx: number, total: number, val: number): ExecutionStep<MockState> => ({
  id: `step-${idx}`,
  stepIndex: idx,
  totalSteps: total,
  action: 'VISIT',
  description: `Step ${idx} with val ${val}`,
  a11yMessage: `Step ${idx}`,
  state: { val },
});

describe('useTimeTravelEngine', () => {
  it('initializes with default empty state when no steps provided', () => {
    const { result } = renderHook(() => useTimeTravelEngine<MockState>());

    expect(result.current.currentStep).toBeNull();
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.totalSteps).toBe(0);
    expect(result.current.isFirst).toBe(true);
    expect(result.current.isLast).toBe(false);
  });

  it('initializes with initialSteps array when provided', () => {
    const steps = [
      createMockStep(0, 3, 10),
      createMockStep(1, 3, 20),
      createMockStep(2, 3, 30),
    ];

    const { result } = renderHook(() => useTimeTravelEngine<MockState>(steps));

    expect(result.current.totalSteps).toBe(3);
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentStep?.state.val).toBe(10);
    expect(result.current.isFirst).toBe(true);
    expect(result.current.isLast).toBe(false);
  });

  it('navigates through steps using handleNext, handlePrevious, handleFirst, handleLast, and handleReset', () => {
    const steps = [
      createMockStep(0, 3, 100),
      createMockStep(1, 3, 200),
      createMockStep(2, 3, 300),
    ];

    const { result } = renderHook(() => useTimeTravelEngine<MockState>(steps));

    act(() => {
      result.current.handleNext();
    });
    expect(result.current.currentIndex).toBe(1);
    expect(result.current.currentStep?.state.val).toBe(200);
    expect(result.current.isFirst).toBe(false);
    expect(result.current.isLast).toBe(false);

    act(() => {
      result.current.handleLast();
    });
    expect(result.current.currentIndex).toBe(2);
    expect(result.current.currentStep?.state.val).toBe(300);
    expect(result.current.isLast).toBe(true);

    act(() => {
      result.current.handlePrevious();
    });
    expect(result.current.currentIndex).toBe(1);
    expect(result.current.currentStep?.state.val).toBe(200);

    act(() => {
      result.current.handleFirst();
    });
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentStep?.state.val).toBe(100);
    expect(result.current.isFirst).toBe(true);

    act(() => {
      result.current.handleNext();
      result.current.handleReset();
    });
    expect(result.current.currentIndex).toBe(0);
    expect(result.current.currentStep?.state.val).toBe(100);
  });

  it('loads new steps dynamically with loadSteps', () => {
    const { result } = renderHook(() => useTimeTravelEngine<MockState>());

    const newSteps = [
      createMockStep(0, 2, 5),
      createMockStep(1, 2, 15),
    ];

    act(() => {
      result.current.loadSteps(newSteps, 1);
    });

    expect(result.current.totalSteps).toBe(2);
    expect(result.current.currentIndex).toBe(1);
    expect(result.current.currentStep?.state.val).toBe(15);
    expect(result.current.isLast).toBe(true);
  });

  it('jumps to specific step using goToStep', () => {
    const steps = [
      createMockStep(0, 4, 1),
      createMockStep(1, 4, 2),
      createMockStep(2, 4, 3),
      createMockStep(3, 4, 4),
    ];

    const { result } = renderHook(() => useTimeTravelEngine<MockState>(steps));

    act(() => {
      result.current.goToStep(2);
    });

    expect(result.current.currentIndex).toBe(2);
    expect(result.current.currentStep?.state.val).toBe(3);
  });
});
