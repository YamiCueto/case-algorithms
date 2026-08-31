import { describe, it, expect } from 'vitest';
import { simulateStackOperations, StackCommand } from './stack-operations';

describe('Stack Operations Generator (simulateStackOperations)', () => {
  it('initializes an empty stack deterministically', () => {
    const result = simulateStackOperations([], 6);
    expect(result.output.finalItems).toEqual([]);
    expect(result.output.finalTopIndex).toBe(-1);
    expect(result.steps.length).toBe(2);
    expect(result.steps[0]?.action).toBe('INITIALIZE');
    expect(result.steps[1]?.action).toBe('COMPLETE');
  });

  it('performs PUSH operations up to capacity', () => {
    const commands: StackCommand[] = [
      { type: 'PUSH', value: 10 },
      { type: 'PUSH', value: 20 },
      { type: 'PUSH', value: 30 },
    ];

    const result = simulateStackOperations(commands, 5);
    expect(result.output.finalItems).toEqual([10, 20, 30]);
    expect(result.output.finalTopIndex).toBe(2);

    const pushSteps = result.steps.filter((s) => s.action === 'PUSH');
    expect(pushSteps.length).toBe(3);
    expect(pushSteps[0]?.state.items).toEqual([10]);
    expect(pushSteps[0]?.state.topIndex).toBe(0);
    expect(pushSteps[2]?.state.items).toEqual([10, 20, 30]);
    expect(pushSteps[2]?.state.topIndex).toBe(2);
  });

  it('generates an OVERFLOW step when attempting to PUSH into a full stack', () => {
    const commands: StackCommand[] = [
      { type: 'PUSH', value: 1 },
      { type: 'PUSH', value: 2 },
      { type: 'PUSH', value: 3 },
      { type: 'PUSH', value: 99 },
    ];

    const result = simulateStackOperations(commands, 3);
    expect(result.output.finalItems).toEqual([1, 2, 3]);

    const overflowStep = result.steps.find((s) => s.action === 'OVERFLOW');
    expect(overflowStep).toBeDefined();
    expect(overflowStep?.description).toContain('Stack Overflow');
    expect(overflowStep?.state.items).toEqual([1, 2, 3]);
  });

  it('performs POP operations in strict LIFO order', () => {
    const commands: StackCommand[] = [
      { type: 'PUSH', value: 100 },
      { type: 'PUSH', value: 200 },
      { type: 'POP' },
      { type: 'PUSH', value: 300 },
    ];

    const result = simulateStackOperations(commands, 5);
    expect(result.output.finalItems).toEqual([100, 300]);

    const popStep = result.steps.find((s) => s.action === 'POP');
    expect(popStep).toBeDefined();
    expect(popStep?.state.targetElement).toBe(200);
    expect(popStep?.state.items).toEqual([100]);
    expect(popStep?.state.topIndex).toBe(0);
  });

  it('generates an UNDERFLOW step when attempting to POP from an empty stack', () => {
    const commands: StackCommand[] = [{ type: 'POP' }];
    const result = simulateStackOperations(commands, 4);

    expect(result.output.finalItems).toEqual([]);
    const underflowStep = result.steps.find((s) => s.action === 'UNDERFLOW');
    expect(underflowStep).toBeDefined();
    expect(underflowStep?.description).toContain('Stack Underflow');
  });

  it('inspects the TOP element with PEEK without mutating the stack structure', () => {
    const commands: StackCommand[] = [
      { type: 'PUSH', value: 42 },
      { type: 'PUSH', value: 84 },
      { type: 'PEEK' },
    ];

    const result = simulateStackOperations(commands, 5);
    expect(result.output.finalItems).toEqual([42, 84]);

    const peekStep = result.steps.find((s) => s.action === 'PEEK');
    expect(peekStep).toBeDefined();
    expect(peekStep?.state.targetElement).toBe(84);
    expect(peekStep?.state.items).toEqual([42, 84]);
  });

  it('generates an UNDERFLOW step when attempting to PEEK on an empty stack', () => {
    const commands: StackCommand[] = [{ type: 'PEEK' }];
    const result = simulateStackOperations(commands, 5);

    const underflowStep = result.steps.find((s) => s.action === 'UNDERFLOW');
    expect(underflowStep).toBeDefined();
    expect(underflowStep?.description).toContain('Stack Underflow');
  });

  it('clears all stack items with CLEAR command', () => {
    const commands: StackCommand[] = [
      { type: 'PUSH', value: 5 },
      { type: 'PUSH', value: 10 },
      { type: 'CLEAR' },
    ];

    const result = simulateStackOperations(commands, 5);
    expect(result.output.finalItems).toEqual([]);

    const clearStep = result.steps.find((s) => s.action === 'CLEAR');
    expect(clearStep).toBeDefined();
    expect(clearStep?.state.items).toEqual([]);
    expect(clearStep?.state.topIndex).toBe(-1);
  });

  it('ensures determinism across repeated executions of complex sequences', () => {
    const commands: StackCommand[] = [
      { type: 'PUSH', value: 15 },
      { type: 'PUSH', value: 30 },
      { type: 'PEEK' },
      { type: 'POP' },
      { type: 'PUSH', value: 45 },
      { type: 'PUSH', value: 60 },
    ];

    const run1 = simulateStackOperations(commands, 5);
    const run2 = simulateStackOperations(commands, 5);

    expect(run1.output).toEqual(run2.output);
    expect(run1.steps.length).toBe(run2.steps.length);

    for (let i = 0; i < run1.steps.length; i++) {
      expect(run1.steps[i]?.action).toBe(run2.steps[i]?.action);
      expect(run1.steps[i]?.state.items).toEqual(run2.steps[i]?.state.items);
      expect(run1.steps[i]?.state.topIndex).toBe(run2.steps[i]?.state.topIndex);
    }
  });
});
