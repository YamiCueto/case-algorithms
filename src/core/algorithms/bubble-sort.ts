import {
  AlgorithmResult,
  ExecutionStep,
  PointerInfo,
} from '../types';
import { ArrayState } from '../data-structures/array';

export function bubbleSort(input: readonly number[]): AlgorithmResult<ArrayState, readonly number[]> {
  const startTime = performance.now();
  const currentArray = [...input];
  const n = currentArray.length;
  const steps: ExecutionStep<ArrayState>[] = [];
  const sortedIndices: number[] = [];

  let comparisonsCount = 0;
  let swapsCount = 0;

  if (n === 0) {
    const emptyStep: ExecutionStep<ArrayState> = {
      id: 'step-0',
      stepIndex: 0,
      totalSteps: 1,
      action: 'COMPLETE',
      description: 'Array is empty; already sorted.',
      a11yMessage: 'The array is empty and requires no sorting.',
      state: {
        array: [],
        sortedIndices: [],
        phaseDescription: 'Empty array initialized.',
      },
      metrics: {
        comparisonsCount: 0,
        swapsCount: 0,
      },
    };

    return {
      steps: [emptyStep],
      output: [],
      metrics: {
        totalComparisons: 0,
        totalSwaps: 0,
        totalSteps: 1,
        executionTimeMs: performance.now() - startTime,
      },
    };
  }

  if (n === 1) {
    const singleStep: ExecutionStep<ArrayState> = {
      id: 'step-0',
      stepIndex: 0,
      totalSteps: 1,
      action: 'COMPLETE',
      description: `Single element array [${currentArray[0]}] is already sorted.`,
      a11yMessage: `Array with single element ${currentArray[0]} is already sorted.`,
      state: {
        array: [currentArray[0] as number],
        sortedIndices: [0],
        phaseDescription: 'Single element array.',
      },
      metrics: {
        comparisonsCount: 0,
        swapsCount: 0,
      },
    };

    return {
      steps: [singleStep],
      output: [currentArray[0] as number],
      metrics: {
        totalComparisons: 0,
        totalSwaps: 0,
        totalSteps: 1,
        executionTimeMs: performance.now() - startTime,
      },
    };
  }

  steps.push({
    id: `step-${steps.length}`,
    stepIndex: steps.length,
    totalSteps: 0,
    action: 'INITIALIZE',
    description: `Initial unsorted array: [${currentArray.join(', ')}]`,
    a11yMessage: `Array initialized with values: ${currentArray.join(', ')}. Ready to start Bubble Sort.`,
    state: {
      array: [...currentArray],
      sortedIndices: [],
      phaseDescription: 'Initial state before sorting begins.',
    },
    metrics: {
      comparisonsCount,
      swapsCount,
    },
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      comparisonsCount++;
      const valA = currentArray[j] as number;
      const valB = currentArray[j + 1] as number;

      const comparePointers: PointerInfo[] = [
        { id: 'ptr-j', index: j, label: 'j', colorVar: 'var(--pointer-low)' },
        { id: 'ptr-next', index: j + 1, label: 'j+1', colorVar: 'var(--pointer-mid)' },
      ];

      const compareExplanation =
        valA === valB
          ? `${valA} === ${valB}: equal elements maintain relative order (stable sort).`
          : valA > valB
            ? `${valA} > ${valB}: swap needed.`
            : `${valA} < ${valB}: order is correct.`;

      steps.push({
        id: `step-${steps.length}`,
        stepIndex: steps.length,
        totalSteps: 0,
        action: 'COMPARE',
        description: `Comparing index ${j} (${valA}) and index ${j + 1} (${valB}). ${compareExplanation}`,
        a11yMessage: `Comparing index ${j} with value ${valA} against index ${j + 1} with value ${valB}. ${valA > valB ? 'Swap will occur.' : 'No swap needed.'}`,
        activeIndices: [j, j + 1],
        comparedIndices: [j, j + 1],
        pointers: comparePointers,
        codeHighlight: {
          pseudocodeLine: 3,
          typescriptLine: 5,
        },
        state: {
          array: [...currentArray],
          sortedIndices: [...sortedIndices],
          comparingIndices: [j, j + 1],
          phaseDescription: `Pass ${i + 1}: Comparing adjacent elements at [${j}] and [${j + 1}].`,
        },
        metrics: {
          comparisonsCount,
          swapsCount,
        },
      });

      if (valA > valB) {
        swapsCount++;
        currentArray[j] = valB;
        currentArray[j + 1] = valA;

        steps.push({
          id: `step-${steps.length}`,
          stepIndex: steps.length,
          totalSteps: 0,
          action: 'SWAP',
          description: `Swapped elements at index ${j} and ${j + 1}: [${valA}, ${valB}] -> [${valB}, ${valA}].`,
          a11yMessage: `Swapped value ${valA} at index ${j} with value ${valB} at index ${j + 1}.`,
          activeIndices: [j, j + 1],
          comparedIndices: [j, j + 1],
          pointers: comparePointers,
          codeHighlight: {
            pseudocodeLine: 4,
            typescriptLine: 6,
          },
          state: {
            array: [...currentArray],
            sortedIndices: [...sortedIndices],
            swappedIndices: [j, j + 1],
            phaseDescription: `Pass ${i + 1}: Swapped out-of-order pair [${valA}, ${valB}].`,
          },
          metrics: {
            comparisonsCount,
            swapsCount,
          },
        });
      }
    }

    const newlySortedIndex = n - 1 - i;
    sortedIndices.push(newlySortedIndex);

    steps.push({
      id: `step-${steps.length}`,
      stepIndex: steps.length,
      totalSteps: 0,
      action: 'SET_POINTER',
      description: `Element at index ${newlySortedIndex} (${currentArray[newlySortedIndex]}) has reached its final sorted position.`,
      a11yMessage: `Element ${currentArray[newlySortedIndex]} at index ${newlySortedIndex} is now sorted.`,
      activeIndices: [newlySortedIndex],
      pointers: [
        { id: 'ptr-sorted', index: newlySortedIndex, label: 'sorted', colorVar: 'var(--accent-emerald)' },
      ],
      state: {
        array: [...currentArray],
        sortedIndices: [...sortedIndices],
        activeIndex: newlySortedIndex,
        phaseDescription: `Pass ${i + 1} complete. Index ${newlySortedIndex} locked in place.`,
      },
      metrics: {
        comparisonsCount,
        swapsCount,
      },
    });
  }

  if (!sortedIndices.includes(0)) {
    sortedIndices.push(0);
  }

  steps.push({
    id: `step-${steps.length}`,
    stepIndex: steps.length,
    totalSteps: 0,
    action: 'COMPLETE',
    description: `Sorting complete! Final sorted array: [${currentArray.join(', ')}].`,
    a11yMessage: `Bubble Sort finished. Total comparisons: ${comparisonsCount}, total swaps: ${swapsCount}. Sorted array: ${currentArray.join(', ')}.`,
    activeIndices: Array.from({ length: n }, (_, idx) => idx),
    state: {
      array: [...currentArray],
      sortedIndices: Array.from({ length: n }, (_, idx) => idx),
      phaseDescription: 'Algorithm completed. All elements are sorted in non-decreasing order.',
    },
    metrics: {
      comparisonsCount,
      swapsCount,
    },
  });

  const totalSteps = steps.length;
  const finalizedSteps = steps.map((s) => ({
    ...s,
    totalSteps,
  }));

  return {
    steps: finalizedSteps,
    output: currentArray,
    metrics: {
      totalComparisons: comparisonsCount,
      totalSwaps: swapsCount,
      totalSteps,
      executionTimeMs: performance.now() - startTime,
    },
  };
}
