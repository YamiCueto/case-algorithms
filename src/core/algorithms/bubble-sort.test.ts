import { describe, it, expect } from 'vitest';
import { bubbleSort } from './bubble-sort';

describe('Bubble Sort Algorithm Generator', () => {
  it('handles empty input array deterministically', () => {
    const result = bubbleSort([]);
    expect(result.output).toEqual([]);
    expect(result.metrics.totalComparisons).toBe(0);
    expect(result.metrics.totalSwaps).toBe(0);
    expect(result.metrics.totalSteps).toBe(1);
    expect(result.steps[0]?.action).toBe('COMPLETE');
  });

  it('handles single-element array deterministically', () => {
    const result = bubbleSort([42]);
    expect(result.output).toEqual([42]);
    expect(result.metrics.totalComparisons).toBe(0);
    expect(result.metrics.totalSwaps).toBe(0);
    expect(result.metrics.totalSteps).toBe(1);
    expect(result.steps[0]?.action).toBe('COMPLETE');
    expect(result.steps[0]?.state.sortedIndices).toEqual([0]);
  });

  it('triggers early exit on an already sorted array in O(n) time with 0 swaps', () => {
    const input = [1, 2, 3, 4, 5];
    const result = bubbleSort(input);
    expect(result.output).toEqual([1, 2, 3, 4, 5]);
    expect(result.metrics.totalComparisons).toBe(4);
    expect(result.metrics.totalSwaps).toBe(0);

    const earlyExitStep = result.steps.find((s) => s.description.includes('Early exit triggered'));
    expect(earlyExitStep).toBeDefined();
    expect(result.steps[result.steps.length - 1]?.action).toBe('COMPLETE');
  });

  it('triggers early exit on a partially sorted array before completing all passes', () => {
    const input = [1, 2, 4, 3, 5];
    const result = bubbleSort(input);
    expect(result.output).toEqual([1, 2, 3, 4, 5]);
    expect(result.metrics.totalSwaps).toBe(1);
    expect(result.metrics.totalComparisons).toBe(7);

    const earlyExitStep = result.steps.find((s) => s.description.includes('Early exit triggered'));
    expect(earlyExitStep).toBeDefined();
  });

  it('sorts a reverse-ordered array with maximum swaps (n*(n-1)/2)', () => {
    const input = [5, 4, 3, 2, 1];
    const result = bubbleSort(input);
    expect(result.output).toEqual([1, 2, 3, 4, 5]);
    expect(result.metrics.totalComparisons).toBe(10);
    expect(result.metrics.totalSwaps).toBe(10);
  });

  it('handles duplicate values correctly preserving stability', () => {
    const input = [4, 2, 4, 2, 4];
    const result = bubbleSort(input);
    expect(result.output).toEqual([2, 2, 4, 4, 4]);

    const equalCompareStep = result.steps.find(
      (s) => s.action === 'COMPARE' && s.description.includes('equal elements maintain relative order')
    );
    expect(equalCompareStep).toBeDefined();
  });

  it('handles negative numbers correctly', () => {
    const input = [-5, 10, -2, 0, 8];
    const result = bubbleSort(input);
    expect(result.output).toEqual([-5, -2, 0, 8, 10]);
    expect(result.steps[result.steps.length - 1]?.action).toBe('COMPLETE');
  });

  it('produces a rich, granular sequence of ExecutionSteps for arbitrary arrays', () => {
    const input = [5, 1, 4, 2, 8];
    const result = bubbleSort(input);

    expect(result.output).toEqual([1, 2, 4, 5, 8]);
    expect(result.steps.length).toBeGreaterThan(10);

    const firstStep = result.steps[0];
    expect(firstStep?.action).toBe('INITIALIZE');
    expect(firstStep?.state.array).toEqual([5, 1, 4, 2, 8]);

    const compareSteps = result.steps.filter((s) => s.action === 'COMPARE');
    expect(compareSteps.length).toBe(result.metrics.totalComparisons);

    const swapSteps = result.steps.filter((s) => s.action === 'SWAP');
    expect(swapSteps.length).toBe(result.metrics.totalSwaps);

    const finalStep = result.steps[result.steps.length - 1];
    expect(finalStep?.action).toBe('COMPLETE');
    expect(finalStep?.state.sortedIndices).toEqual([0, 1, 2, 3, 4]);
  });

  it('handles larger arrays up to 14 elements without issues', () => {
    const input = [14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    const result = bubbleSort(input);
    expect(result.output).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
    expect(result.metrics.totalComparisons).toBe(91);
    expect(result.metrics.totalSwaps).toBe(91);
  });

  it('ensures determinism across repeated executions', () => {
    const input = [12, 7, 19, 3, 25, 1];
    const run1 = bubbleSort(input);
    const run2 = bubbleSort(input);

    expect(run1.output).toEqual(run2.output);
    expect(run1.metrics.totalComparisons).toBe(run2.metrics.totalComparisons);
    expect(run1.metrics.totalSwaps).toBe(run2.metrics.totalSwaps);
    expect(run1.steps.length).toBe(run2.steps.length);

    for (let i = 0; i < run1.steps.length; i++) {
      expect(run1.steps[i]?.action).toBe(run2.steps[i]?.action);
      expect(run1.steps[i]?.state.array).toEqual(run2.steps[i]?.state.array);
    }
  });

  it('correctly maps codeHighlight line numbers to canonical pseudocode and TypeScript lines', () => {
    const input = [5, 1, 4];
    const result = bubbleSort(input);

    const compareStep = result.steps.find((s) => s.action === 'COMPARE');
    expect(compareStep?.codeHighlight).toEqual({
      pseudocodeLine: 6,
      typescriptLine: 7,
    });

    const swapStep = result.steps.find((s) => s.action === 'SWAP');
    expect(swapStep?.codeHighlight).toEqual({
      pseudocodeLine: 7,
      typescriptLine: 8,
    });

    const completeStep = result.steps.find((s) => s.action === 'COMPLETE');
    expect(completeStep?.codeHighlight).toEqual({
      pseudocodeLine: 15,
      typescriptLine: 18,
    });
  });
});
