import { describe, it, expect } from 'vitest';

describe('Core Test Environment & Execution Engine Setup', () => {
  it('validates determinism and immutability in pure state transitions', () => {
    interface TestState {
      readonly items: readonly number[];
      readonly activeIndex: number;
    }

    const initialState: TestState = {
      items: [10, 20, 30],
      activeIndex: 0,
    };

    const nextState = {
      ...initialState,
      items: [...initialState.items, 40],
      activeIndex: initialState.activeIndex + 1,
    };

    expect(initialState.items).toHaveLength(3);
    expect(nextState.items).toHaveLength(4);
    expect(nextState.activeIndex).toBe(1);
    expect(initialState.items).not.toBe(nextState.items);
  });

  it('verifies mathematical operations and array boundary guards', () => {
    const calculateMidpoint = (low: number, high: number): number => {
      if (low > high) return -1;
      return Math.floor((low + high) / 2);
    };

    expect(calculateMidpoint(0, 7)).toBe(3);
    expect(calculateMidpoint(4, 7)).toBe(5);
    expect(calculateMidpoint(6, 7)).toBe(6);
    expect(calculateMidpoint(7, 7)).toBe(7);
    expect(calculateMidpoint(8, 7)).toBe(-1);
  });
});
