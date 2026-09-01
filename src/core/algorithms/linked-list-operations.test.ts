import { describe, it, expect } from 'vitest';
import { simulateLinkedListOperations } from './linked-list-operations';

describe('simulateLinkedListOperations', () => {
  it('generates INITIALIZE and COMPLETE steps for empty command sequence', () => {
    const result = simulateLinkedListOperations([], []);
    expect(result.steps).toHaveLength(2);

    const initStep = result.steps[0]!;
    expect(initStep.action).toBe('INITIALIZE');
    expect(initStep.state.nodes).toEqual([]);
    expect(initStep.state.size).toBe(0);
    expect(initStep.state.headId).toBeNull();
    expect(initStep.state.tailId).toBeNull();

    const completeStep = result.steps[1]!;
    expect(completeStep.action).toBe('COMPLETE');
  });

  it('generates PREPEND and APPEND steps with HEAD/TAIL pointers and code highlights', () => {
    const result = simulateLinkedListOperations([
      { type: 'PREPEND', value: 10 },
      { type: 'APPEND', value: 20 },
    ]);

    expect(result.steps).toHaveLength(4);

    const prependStep = result.steps[1]!;
    expect(prependStep.action).toBe('PREPEND');
    expect(prependStep.state.nodes).toHaveLength(1);
    expect(prependStep.state.nodes[0]?.value).toBe(10);
    expect(prependStep.codeHighlight).toEqual({ pseudocodeLine: 4, typescriptLine: 8 });

    const appendStep = result.steps[2]!;
    expect(appendStep.action).toBe('APPEND');
    expect(appendStep.state.nodes).toHaveLength(2);
    expect(appendStep.state.nodes[1]?.value).toBe(20);
    expect(appendStep.codeHighlight).toEqual({ pseudocodeLine: 13, typescriptLine: 17 });
  });

  it('generates TRAVERSE and INSERT_AT steps for middle insertion', () => {
    const result = simulateLinkedListOperations(
      [{ type: 'INSERT_AT', index: 1, value: 15 }],
      [10, 20]
    );

    const traverseStep = result.steps[1]!;
    expect(traverseStep.action).toBe('TRAVERSE');
    expect(traverseStep.state.targetIndex).toBe(0);

    const insertStep = result.steps[2]!;
    expect(insertStep.action).toBe('INSERT_AT');
    expect(insertStep.state.nodes).toHaveLength(3);
    expect(insertStep.state.nodes[1]?.value).toBe(15);
  });

  it('generates REMOVE_AT steps updating head and tail', () => {
    const result = simulateLinkedListOperations(
      [{ type: 'REMOVE_AT', index: 0 }],
      [10, 20]
    );

    const removeHeadStep = result.steps[1]!;
    expect(removeHeadStep.action).toBe('REMOVE_AT');
    expect(removeHeadStep.state.nodes).toHaveLength(1);
    expect(removeHeadStep.state.nodes[0]?.value).toBe(20);
  });

  it('generates SEARCH and FOUND steps for successful search', () => {
    const result = simulateLinkedListOperations(
      [{ type: 'FIND', value: 30 }],
      [10, 20, 30]
    );

    const searchStep1 = result.steps[1]!;
    expect(searchStep1.action).toBe('SEARCH');

    const searchStep2 = result.steps[2]!;
    expect(searchStep2.action).toBe('SEARCH');

    const foundStep = result.steps[3]!;
    expect(foundStep.action).toBe('FOUND');
    expect(foundStep.state.targetIndex).toBe(2);
  });

  it('generates NOT_FOUND step when element does not exist in list', () => {
    const result = simulateLinkedListOperations(
      [{ type: 'FIND', value: 999 }],
      [10, 20]
    );

    const notFoundStep = result.steps[3]!;
    expect(notFoundStep.action).toBe('NOT_FOUND');
  });
});
