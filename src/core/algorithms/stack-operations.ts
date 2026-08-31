import {
  AlgorithmResult,
  ExecutionStep,
  PointerInfo,
} from '../types';
import { StackState } from '../data-structures/stack';

export type StackCommand =
  | { readonly type: 'PUSH'; readonly value: number }
  | { readonly type: 'POP' }
  | { readonly type: 'PEEK' }
  | { readonly type: 'CLEAR' };

export interface StackSimulationOutput {
  readonly finalItems: readonly number[];
  readonly finalTopIndex: number;
  readonly operationCount: number;
}

export function simulateStackOperations(
  commands: readonly StackCommand[],
  capacity: number = 8,
  initialItems: readonly number[] = []
): AlgorithmResult<StackState, StackSimulationOutput> {
  const startTime = performance.now();
  const currentItems: number[] = [...initialItems];
  const steps: ExecutionStep<StackState>[] = [];

  let comparisonsCount = 0;
  let swapsCount = 0;

  const getTopPointer = (items: readonly number[], labelText: string = 'TOP'): PointerInfo[] => {
    if (items.length === 0) {
      return [];
    }
    const topIdx = items.length - 1;
    return [
      {
        id: 'ptr-top',
        index: topIdx,
        label: labelText,
        colorVar: 'var(--accent-cyan)',
      },
    ];
  };

  steps.push({
    id: `step-${steps.length}`,
    stepIndex: steps.length,
    totalSteps: 0,
    action: 'INITIALIZE',
    description:
      currentItems.length === 0
        ? `Stack initialized (empty). Capacity: ${capacity}.`
        : `Stack initialized with [${currentItems.join(', ')}]. TOP is at index ${currentItems.length - 1} (${currentItems[currentItems.length - 1]}). Capacity: ${capacity}.`,
    a11yMessage:
      currentItems.length === 0
        ? `Empty stack initialized with capacity ${capacity}.`
        : `Stack initialized with ${currentItems.length} items. Top item is ${currentItems[currentItems.length - 1]}.`,
    pointers: getTopPointer(currentItems),
    state: {
      items: [...currentItems],
      topIndex: currentItems.length - 1,
      capacity,
      operation: 'INITIALIZE',
      phaseDescription: 'Initial stack state.',
    },
    metrics: {
      comparisonsCount,
      swapsCount,
    },
  });

  for (const cmd of commands) {
    if (cmd.type === 'PUSH') {
      const val = cmd.value;
      if (currentItems.length >= capacity) {
        steps.push({
          id: `step-${steps.length}`,
          stepIndex: steps.length,
          totalSteps: 0,
          action: 'OVERFLOW',
          description: `Stack Overflow: Cannot push ${val}. Stack is full at maximum capacity (${capacity}).`,
          a11yMessage: `Stack Overflow error: Cannot push value ${val} because the stack is full at capacity ${capacity}.`,
          pointers: getTopPointer(currentItems, 'TOP (Full)'),
          codeHighlight: {
            pseudocodeLine: 2,
            typescriptLine: 3,
          },
          state: {
            items: [...currentItems],
            topIndex: currentItems.length - 1,
            capacity,
            operation: 'OVERFLOW',
            targetElement: val,
            phaseDescription: `Stack Overflow triggered attempting to push ${val}.`,
          },
          metrics: {
            comparisonsCount,
            swapsCount,
          },
        });
      } else {
        currentItems.push(val);
        const newTop = currentItems.length - 1;
        swapsCount++;

        steps.push({
          id: `step-${steps.length}`,
          stepIndex: steps.length,
          totalSteps: 0,
          action: 'PUSH',
          description: `Pushed ${val} onto TOP of stack (index ${newTop}).`,
          a11yMessage: `Pushed value ${val} onto top of stack at index ${newTop}. Stack now contains ${currentItems.length} elements.`,
          activeIndices: [newTop],
          pointers: getTopPointer(currentItems, 'TOP'),
          codeHighlight: {
            pseudocodeLine: 4,
            typescriptLine: 5,
          },
          state: {
            items: [...currentItems],
            topIndex: newTop,
            capacity,
            operation: 'PUSH',
            targetElement: val,
            phaseDescription: `Push operation complete: ${val} added at index ${newTop}.`,
          },
          metrics: {
            comparisonsCount,
            swapsCount,
          },
        });
      }
    } else if (cmd.type === 'POP') {
      if (currentItems.length === 0) {
        steps.push({
          id: `step-${steps.length}`,
          stepIndex: steps.length,
          totalSteps: 0,
          action: 'UNDERFLOW',
          description: 'Stack Underflow: Cannot pop from an empty stack (TOP is null).',
          a11yMessage: 'Stack Underflow error: Cannot pop because the stack is currently empty.',
          pointers: [],
          codeHighlight: {
            pseudocodeLine: 2,
            typescriptLine: 3,
          },
          state: {
            items: [],
            topIndex: -1,
            capacity,
            operation: 'UNDERFLOW',
            phaseDescription: 'Stack Underflow triggered attempting to pop an empty stack.',
          },
          metrics: {
            comparisonsCount,
            swapsCount,
          },
        });
      } else {
        const poppedVal = currentItems.pop() as number;
        const newTop = currentItems.length - 1;
        swapsCount++;

        steps.push({
          id: `step-${steps.length}`,
          stepIndex: steps.length,
          totalSteps: 0,
          action: 'POP',
          description: `Popped ${poppedVal} from TOP of stack. ${newTop >= 0 ? `New TOP is index ${newTop} (${currentItems[newTop]}).` : 'Stack is now empty.'}`,
          a11yMessage: `Popped value ${poppedVal} from the top of the stack. ${newTop >= 0 ? `New top is ${currentItems[newTop]}.` : 'Stack is now empty.'}`,
          activeIndices: newTop >= 0 ? [newTop] : [],
          pointers: getTopPointer(currentItems, 'TOP'),
          codeHighlight: {
            pseudocodeLine: 5,
            typescriptLine: 6,
          },
          state: {
            items: [...currentItems],
            topIndex: newTop,
            capacity,
            operation: 'POP',
            targetElement: poppedVal,
            phaseDescription: `Pop operation complete: removed ${poppedVal}.`,
          },
          metrics: {
            comparisonsCount,
            swapsCount,
          },
        });
      }
    } else if (cmd.type === 'PEEK') {
      if (currentItems.length === 0) {
        steps.push({
          id: `step-${steps.length}`,
          stepIndex: steps.length,
          totalSteps: 0,
          action: 'UNDERFLOW',
          description: 'Stack Underflow: Cannot peek on an empty stack (TOP is null).',
          a11yMessage: 'Stack Underflow error: Cannot peek because the stack is empty.',
          pointers: [],
          codeHighlight: {
            pseudocodeLine: 2,
            typescriptLine: 3,
          },
          state: {
            items: [],
            topIndex: -1,
            capacity,
            operation: 'UNDERFLOW',
            phaseDescription: 'Stack Underflow triggered attempting to peek an empty stack.',
          },
          metrics: {
            comparisonsCount,
            swapsCount,
          },
        });
      } else {
        const peekVal = currentItems[currentItems.length - 1] as number;
        const topIdx = currentItems.length - 1;
        comparisonsCount++;

        steps.push({
          id: `step-${steps.length}`,
          stepIndex: steps.length,
          totalSteps: 0,
          action: 'PEEK',
          description: `Peeked TOP element at index ${topIdx}: ${peekVal}. Stack structure remains unmodified.`,
          a11yMessage: `Peeked top element ${peekVal} at index ${topIdx}. Stack contents were not changed.`,
          activeIndices: [topIdx],
          pointers: getTopPointer(currentItems, 'PEEK (TOP)'),
          codeHighlight: {
            pseudocodeLine: 3,
            typescriptLine: 4,
          },
          state: {
            items: [...currentItems],
            topIndex: topIdx,
            capacity,
            operation: 'PEEK',
            targetElement: peekVal,
            phaseDescription: `Peek operation: inspected ${peekVal} at top of stack.`,
          },
          metrics: {
            comparisonsCount,
            swapsCount,
          },
        });
      }
    } else if (cmd.type === 'CLEAR') {
      currentItems.length = 0;
      steps.push({
        id: `step-${steps.length}`,
        stepIndex: steps.length,
        totalSteps: 0,
        action: 'CLEAR',
        description: 'Cleared all elements from the stack (stack reset to empty).',
        a11yMessage: 'Cleared all elements from the stack. Stack is now empty.',
        pointers: [],
        state: {
          items: [],
          topIndex: -1,
          capacity,
          operation: 'CLEAR',
          phaseDescription: 'Stack cleared to empty state.',
        },
        metrics: {
          comparisonsCount,
          swapsCount,
        },
      });
    }
  }

  steps.push({
    id: `step-${steps.length}`,
    stepIndex: steps.length,
    totalSteps: 0,
    action: 'COMPLETE',
    description: `Sequence complete! Final stack items: [${currentItems.join(', ')}]. Size: ${currentItems.length}/${capacity}.`,
    a11yMessage: `Stack sequence completed. Total items: ${currentItems.length} of ${capacity}.`,
    pointers: getTopPointer(currentItems, 'TOP'),
    state: {
      items: [...currentItems],
      topIndex: currentItems.length - 1,
      capacity,
      operation: 'COMPLETE',
      phaseDescription: 'Execution sequence complete.',
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
    output: {
      finalItems: currentItems,
      finalTopIndex: currentItems.length - 1,
      operationCount: commands.length,
    },
    metrics: {
      totalComparisons: comparisonsCount,
      totalSwaps: swapsCount,
      totalSteps,
      executionTimeMs: performance.now() - startTime,
    },
  };
}
