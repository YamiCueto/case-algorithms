import {
  AlgorithmResult,
  ExecutionStep,
  PointerInfo,
} from '../types';
import { BoundedQueue, QueueState } from '../data-structures/queue';

export type QueueCommand =
  | { readonly type: 'ENQUEUE'; readonly value: number }
  | { readonly type: 'DEQUEUE' }
  | { readonly type: 'PEEK_FRONT' };

export interface QueueSimulationOutput {
  readonly finalItems: readonly number[];
  readonly finalFrontIndex: number;
  readonly finalRearIndex: number;
  readonly operationCount: number;
}

export function simulateQueueOperations(
  commands: readonly QueueCommand[],
  capacity: number = 8
): AlgorithmResult<QueueState, QueueSimulationOutput> {
  const startTime = performance.now();
  const queue = new BoundedQueue<number>(capacity);
  const steps: ExecutionStep<QueueState>[] = [];

  const getPointers = (front: number, rear: number): PointerInfo[] => {
    const pointers: PointerInfo[] = [];
    if (front >= 0) {
      pointers.push({
        id: 'ptr-front',
        index: front,
        label: 'FRONT',
        colorVar: 'var(--accent-cyan)',
      });
    }
    if (rear >= 0) {
      pointers.push({
        id: 'ptr-rear',
        index: rear,
        label: 'REAR',
        colorVar: 'var(--accent-amber)',
      });
    }
    return pointers;
  };

  steps.push({
    id: `step-${steps.length}`,
    stepIndex: steps.length,
    totalSteps: 0,
    action: 'INITIALIZE',
    state: {
      items: queue.toArray(),
      frontIndex: queue.getFrontIndex(),
      rearIndex: queue.getRearIndex(),
      capacity: queue.getCapacity(),
      lastAction: 'INITIALIZE',
      statusMessage: `Empty queue initialized with capacity ${capacity}.`,
    },
    description: `Empty queue initialized with capacity ${capacity}.`,
    a11yMessage: `Empty queue initialized with capacity ${capacity}.`,
    pointers: getPointers(queue.getFrontIndex(), queue.getRearIndex()),
    codeHighlight: {
      pseudocodeLine: 1,
      typescriptLine: 1,
    },
  });

  for (let i = 0; i < commands.length; i++) {
    const cmd = commands[i]!;

    if (cmd.type === 'ENQUEUE') {
      if (queue.isFull()) {
        steps.push({
          id: `step-${steps.length}`,
          stepIndex: steps.length,
          totalSteps: 0,
          action: 'OVERFLOW',
          state: {
            items: queue.toArray(),
            frontIndex: queue.getFrontIndex(),
            rearIndex: queue.getRearIndex(),
            capacity: queue.getCapacity(),
            lastAction: 'OVERFLOW',
            statusMessage: `Queue Overflow: Cannot enqueue value ${cmd.value}. Capacity reached (${capacity}).`,
          },
          description: `Queue Overflow: Cannot enqueue value ${cmd.value} into full queue (capacity ${capacity}).`,
          a11yMessage: `Queue Overflow: Cannot enqueue value ${cmd.value}. Queue reached maximum capacity ${capacity}.`,
          pointers: getPointers(queue.getFrontIndex(), queue.getRearIndex()),
          codeHighlight: {
            pseudocodeLine: 3,
            typescriptLine: 11,
          },
        });
      } else {
        queue.enqueue(cmd.value);
        steps.push({
          id: `step-${steps.length}`,
          stepIndex: steps.length,
          totalSteps: 0,
          action: 'ENQUEUE',
          state: {
            items: queue.toArray(),
            frontIndex: queue.getFrontIndex(),
            rearIndex: queue.getRearIndex(),
            capacity: queue.getCapacity(),
            lastAction: 'ENQUEUE',
            statusMessage: `Enqueued value ${cmd.value} at REAR (index ${queue.getRearIndex()}).`,
          },
          description: `Enqueued value ${cmd.value} at REAR (index ${queue.getRearIndex()}).`,
          a11yMessage: `Enqueued value ${cmd.value} at REAR of queue. Queue now contains ${queue.size()} elements.`,
          pointers: getPointers(queue.getFrontIndex(), queue.getRearIndex()),
          codeHighlight: {
            pseudocodeLine: 6,
            typescriptLine: 13,
          },
        });
      }
    } else if (cmd.type === 'DEQUEUE') {
      if (queue.isEmpty()) {
        steps.push({
          id: `step-${steps.length}`,
          stepIndex: steps.length,
          totalSteps: 0,
          action: 'UNDERFLOW',
          state: {
            items: queue.toArray(),
            frontIndex: queue.getFrontIndex(),
            rearIndex: queue.getRearIndex(),
            capacity: queue.getCapacity(),
            lastAction: 'UNDERFLOW',
            statusMessage: 'Queue Underflow: Cannot dequeue from an empty queue.',
          },
          description: 'Queue Underflow: Cannot dequeue from an empty queue.',
          a11yMessage: 'Queue Underflow: Cannot dequeue from an empty queue.',
          pointers: getPointers(queue.getFrontIndex(), queue.getRearIndex()),
          codeHighlight: {
            pseudocodeLine: 10,
            typescriptLine: 18,
          },
        });
      } else {
        const dequeuedVal = queue.dequeue();
        steps.push({
          id: `step-${steps.length}`,
          stepIndex: steps.length,
          totalSteps: 0,
          action: 'DEQUEUE',
          state: {
            items: queue.toArray(),
            frontIndex: queue.getFrontIndex(),
            rearIndex: queue.getRearIndex(),
            capacity: queue.getCapacity(),
            lastAction: 'DEQUEUE',
            statusMessage: `Dequeued value ${dequeuedVal} from FRONT.`,
          },
          description: `Dequeued value ${dequeuedVal} from FRONT.`,
          a11yMessage: `Dequeued value ${dequeuedVal} from FRONT of queue. Remaining elements: ${queue.size()}.`,
          pointers: getPointers(queue.getFrontIndex(), queue.getRearIndex()),
          codeHighlight: {
            pseudocodeLine: 13,
            typescriptLine: 20,
          },
        });
      }
    } else if (cmd.type === 'PEEK_FRONT') {
      if (queue.isEmpty()) {
        steps.push({
          id: `step-${steps.length}`,
          stepIndex: steps.length,
          totalSteps: 0,
          action: 'UNDERFLOW',
          state: {
            items: queue.toArray(),
            frontIndex: queue.getFrontIndex(),
            rearIndex: queue.getRearIndex(),
            capacity: queue.getCapacity(),
            lastAction: 'UNDERFLOW',
            statusMessage: 'Queue Underflow: Cannot peek FRONT of an empty queue.',
          },
          description: 'Queue Underflow: Cannot peek FRONT of an empty queue.',
          a11yMessage: 'Queue Underflow: Cannot peek FRONT of an empty queue.',
          pointers: getPointers(queue.getFrontIndex(), queue.getRearIndex()),
          codeHighlight: {
            pseudocodeLine: 17,
            typescriptLine: 25,
          },
        });
      } else {
        const peekedVal = queue.peek();
        steps.push({
          id: `step-${steps.length}`,
          stepIndex: steps.length,
          totalSteps: 0,
          action: 'PEEK_FRONT',
          state: {
            items: queue.toArray(),
            frontIndex: queue.getFrontIndex(),
            rearIndex: queue.getRearIndex(),
            capacity: queue.getCapacity(),
            lastAction: 'PEEK_FRONT',
            statusMessage: `Peeked at FRONT element: ${peekedVal} (index 0).`,
          },
          description: `Peeked at FRONT element: ${peekedVal} (index 0).`,
          a11yMessage: `Peeked at FRONT element with value ${peekedVal}.`,
          pointers: getPointers(queue.getFrontIndex(), queue.getRearIndex()),
          codeHighlight: {
            pseudocodeLine: 20,
            typescriptLine: 27,
          },
        });
      }
    }
  }

  steps.push({
    id: `step-${steps.length}`,
    stepIndex: steps.length,
    totalSteps: 0,
    action: 'COMPLETE',
    state: {
      items: queue.toArray(),
      frontIndex: queue.getFrontIndex(),
      rearIndex: queue.getRearIndex(),
      capacity: queue.getCapacity(),
      lastAction: 'COMPLETE',
      statusMessage: `Queue operations completed. Total items: ${queue.size()} of ${capacity}.`,
    },
    description: `Queue sequence completed. Total items in queue: ${queue.size()} of ${capacity}.`,
    a11yMessage: `Queue sequence completed. Total items: ${queue.size()} of ${capacity}.`,
    pointers: getPointers(queue.getFrontIndex(), queue.getRearIndex()),
    codeHighlight: {
      pseudocodeLine: 1,
      typescriptLine: 1,
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
      finalItems: queue.toArray(),
      finalFrontIndex: queue.getFrontIndex(),
      finalRearIndex: queue.getRearIndex(),
      operationCount: commands.length,
    },
    metrics: {
      totalComparisons: 0,
      totalSwaps: 0,
      totalSteps,
      executionTimeMs: performance.now() - startTime,
    },
  };
}
