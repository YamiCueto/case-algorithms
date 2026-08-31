import { describe, it, expect } from 'vitest';
import { simulateQueueOperations } from './queue-operations';

describe('simulateQueueOperations', () => {
  it('generates INITIALIZE and COMPLETE steps for empty command sequence', () => {
    const result = simulateQueueOperations([], 6);
    expect(result.steps).toHaveLength(2);

    const initStep = result.steps[0]!;
    expect(initStep.action).toBe('INITIALIZE');
    expect(initStep.state.items).toEqual([]);
    expect(initStep.state.capacity).toBe(6);
    expect(initStep.state.frontIndex).toBe(-1);
    expect(initStep.state.rearIndex).toBe(-1);
    expect(initStep.a11yMessage).toMatch(/Empty queue initialized with capacity 6/i);

    const completeStep = result.steps[1]!;
    expect(completeStep.action).toBe('COMPLETE');
    expect(completeStep.state.items).toEqual([]);
    expect(completeStep.a11yMessage).toMatch(/Queue sequence completed/i);
  });

  it('generates ENQUEUE steps updating front and rear indices deterministically', () => {
    const result = simulateQueueOperations([
      { type: 'ENQUEUE', value: 10 },
      { type: 'ENQUEUE', value: 20 },
    ], 5);

    expect(result.steps).toHaveLength(4);

    const step1 = result.steps[1]!;
    expect(step1.action).toBe('ENQUEUE');
    expect(step1.state.items).toEqual([10]);
    expect(step1.state.frontIndex).toBe(0);
    expect(step1.state.rearIndex).toBe(0);
    expect(step1.a11yMessage).toMatch(/Enqueued value 10 at REAR/i);
    expect(step1.codeHighlight).toEqual({ pseudocodeLine: 6, typescriptLine: 13 });

    const step2 = result.steps[2]!;
    expect(step2.action).toBe('ENQUEUE');
    expect(step2.state.items).toEqual([10, 20]);
    expect(step2.state.frontIndex).toBe(0);
    expect(step2.state.rearIndex).toBe(1);
    expect(step2.a11yMessage).toMatch(/Enqueued value 20 at REAR/i);
  });

  it('generates DEQUEUE steps in strict FIFO order', () => {
    const result = simulateQueueOperations([
      { type: 'ENQUEUE', value: 100 },
      { type: 'ENQUEUE', value: 200 },
      { type: 'DEQUEUE' },
    ], 5);

    const dequeueStep = result.steps[3]!;
    expect(dequeueStep.action).toBe('DEQUEUE');
    expect(dequeueStep.state.items).toEqual([200]);
    expect(dequeueStep.state.frontIndex).toBe(0);
    expect(dequeueStep.state.rearIndex).toBe(0);
    expect(dequeueStep.a11yMessage).toMatch(/Dequeued value 100 from FRONT/i);
    expect(dequeueStep.codeHighlight).toEqual({ pseudocodeLine: 13, typescriptLine: 20 });
  });

  it('generates PEEK_FRONT steps without mutating state items', () => {
    const result = simulateQueueOperations([
      { type: 'ENQUEUE', value: 50 },
      { type: 'PEEK_FRONT' },
    ], 4);

    const peekStep = result.steps[2]!;
    expect(peekStep.action).toBe('PEEK_FRONT');
    expect(peekStep.state.items).toEqual([50]);
    expect(peekStep.a11yMessage).toMatch(/Peeked at FRONT element with value 50/i);
    expect(peekStep.codeHighlight).toEqual({ pseudocodeLine: 20, typescriptLine: 27 });
  });

  it('records OVERFLOW step when trying to enqueue past capacity', () => {
    const result = simulateQueueOperations([
      { type: 'ENQUEUE', value: 1 },
      { type: 'ENQUEUE', value: 2 },
      { type: 'ENQUEUE', value: 99 },
    ], 2);

    const overflowStep = result.steps[3]!;
    expect(overflowStep.action).toBe('OVERFLOW');
    expect(overflowStep.state.items).toEqual([1, 2]);
    expect(overflowStep.a11yMessage).toMatch(/Queue Overflow: Cannot enqueue value 99/i);
    expect(overflowStep.codeHighlight).toEqual({ pseudocodeLine: 3, typescriptLine: 11 });
  });

  it('records UNDERFLOW step when attempting to dequeue or peek an empty queue', () => {
    const result = simulateQueueOperations([
      { type: 'DEQUEUE' },
      { type: 'PEEK_FRONT' },
    ], 4);

    const underflowDequeue = result.steps[1]!;
    expect(underflowDequeue.action).toBe('UNDERFLOW');
    expect(underflowDequeue.a11yMessage).toMatch(/Queue Underflow: Cannot dequeue from an empty queue/i);
    expect(underflowDequeue.codeHighlight).toEqual({ pseudocodeLine: 10, typescriptLine: 18 });

    const underflowPeek = result.steps[2]!;
    expect(underflowPeek.action).toBe('UNDERFLOW');
    expect(underflowPeek.a11yMessage).toMatch(/Queue Underflow: Cannot peek FRONT of an empty queue/i);
    expect(underflowPeek.codeHighlight).toEqual({ pseudocodeLine: 17, typescriptLine: 25 });
  });
});
