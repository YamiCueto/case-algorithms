import {
  AlgorithmResult,
  ExecutionStep,
  PointerInfo,
} from '../types';
import {
  SinglyLinkedList,
  LinkedListState,
} from '../data-structures/linked-list';

export type LinkedListCommand =
  | { readonly type: 'PREPEND'; readonly value: number }
  | { readonly type: 'APPEND'; readonly value: number }
  | { readonly type: 'INSERT_AT'; readonly index: number; readonly value: number }
  | { readonly type: 'REMOVE_AT'; readonly index: number }
  | { readonly type: 'FIND'; readonly value: number }
  | { readonly type: 'CLEAR' };

export interface LinkedListSimulationOutput {
  readonly finalItems: readonly number[];
  readonly finalSize: number;
  readonly operationCount: number;
}

export function simulateLinkedListOperations(
  commands: readonly LinkedListCommand[],
  initialItems: readonly number[] = []
): AlgorithmResult<LinkedListState, LinkedListSimulationOutput> {
  const startTime = performance.now();
  const list = new SinglyLinkedList<number>();
  for (const item of initialItems) {
    list.append(item);
  }

  const steps: ExecutionStep<LinkedListState>[] = [];

  const getPointers = (
    headNodeId: string | null,
    tailNodeId: string | null,
    currNodeId: string | null = null
  ): PointerInfo[] => {
    const pointers: PointerInfo[] = [];
    const nodeStates = list.toNodeStates();

    if (headNodeId) {
      const headIdx = nodeStates.findIndex((n) => n.id === headNodeId);
      if (headIdx >= 0) {
        pointers.push({
          id: 'ptr-head',
          index: headIdx,
          label: 'HEAD',
          colorVar: 'var(--accent-cyan)',
        });
      }
    }

    if (tailNodeId) {
      const tailIdx = nodeStates.findIndex((n) => n.id === tailNodeId);
      if (tailIdx >= 0) {
        pointers.push({
          id: 'ptr-tail',
          index: tailIdx,
          label: 'TAIL',
          colorVar: 'var(--accent-amber)',
        });
      }
    }

    if (currNodeId) {
      const currIdx = nodeStates.findIndex((n) => n.id === currNodeId);
      if (currIdx >= 0) {
        pointers.push({
          id: 'ptr-curr',
          index: currIdx,
          label: 'CURR',
          colorVar: 'var(--accent-primary)',
        });
      }
    }

    return pointers;
  };

  steps.push({
    id: `step-${steps.length}`,
    stepIndex: steps.length,
    totalSteps: 0,
    action: 'INITIALIZE',
    state: {
      nodes: list.toNodeStates(),
      headId: list.getHead()?.id || null,
      tailId: list.getTail()?.id || null,
      size: list.size(),
      lastAction: 'INITIALIZE',
      statusMessage:
        list.isEmpty()
          ? 'Initialized empty Singly Linked List (HEAD -> null).'
          : `Initialized Singly Linked List with ${list.size()} nodes.`,
    },
    description:
      list.isEmpty()
        ? 'Initialized empty Singly Linked List (HEAD -> null).'
        : `Initialized Singly Linked List with [${list.toArray().join(' -> ')} -> null].`,
    a11yMessage:
      list.isEmpty()
        ? 'Empty Singly Linked List initialized. Head and tail point to null.'
        : `Singly Linked List initialized with ${list.size()} nodes.`,
    pointers: getPointers(list.getHead()?.id || null, list.getTail()?.id || null),
    codeHighlight: {
      pseudocodeLine: 1,
      typescriptLine: 1,
    },
  });

  for (let c = 0; c < commands.length; c++) {
    const cmd = commands[c]!;

    if (cmd.type === 'PREPEND') {
      const newNode = list.prepend(cmd.value);
      steps.push({
        id: `step-${steps.length}`,
        stepIndex: steps.length,
        totalSteps: 0,
        action: 'PREPEND',
        state: {
          nodes: list.toNodeStates(),
          headId: list.getHead()?.id || null,
          tailId: list.getTail()?.id || null,
          size: list.size(),
          activeNodeId: newNode.id,
          lastAction: 'PREPEND',
          statusMessage: `Prepended value ${cmd.value} at HEAD in O(1) time.`,
        },
        description: `Prepended node (${cmd.value}) at HEAD in O(1) time. HEAD now points to new node.`,
        a11yMessage: `Prepended value ${cmd.value} as new HEAD of the list in O(1) constant time.`,
        pointers: getPointers(list.getHead()?.id || null, list.getTail()?.id || null, newNode.id),
        codeHighlight: {
          pseudocodeLine: 4,
          typescriptLine: 8,
        },
      });
    } else if (cmd.type === 'APPEND') {
      const newNode = list.append(cmd.value);
      steps.push({
        id: `step-${steps.length}`,
        stepIndex: steps.length,
        totalSteps: 0,
        action: 'APPEND',
        state: {
          nodes: list.toNodeStates(),
          headId: list.getHead()?.id || null,
          tailId: list.getTail()?.id || null,
          size: list.size(),
          activeNodeId: newNode.id,
          lastAction: 'APPEND',
          statusMessage: `Appended value ${cmd.value} at TAIL in O(1) time.`,
        },
        description: `Appended node (${cmd.value}) at TAIL in O(1) time using tail pointer reference.`,
        a11yMessage: `Appended value ${cmd.value} as new TAIL of the list in O(1) time.`,
        pointers: getPointers(list.getHead()?.id || null, list.getTail()?.id || null, newNode.id),
        codeHighlight: {
          pseudocodeLine: 13,
          typescriptLine: 17,
        },
      });
    } else if (cmd.type === 'INSERT_AT') {
      if (cmd.index < 0 || cmd.index > list.size()) {
        steps.push({
          id: `step-${steps.length}`,
          stepIndex: steps.length,
          totalSteps: 0,
          action: 'UNDERFLOW',
          state: {
            nodes: list.toNodeStates(),
            headId: list.getHead()?.id || null,
            tailId: list.getTail()?.id || null,
            size: list.size(),
            lastAction: 'ERROR',
            statusMessage: `Index out of bounds: ${cmd.index}. Valid range: 0 to ${list.size()}.`,
          },
          description: `Cannot insert at index ${cmd.index}: out of bounds (valid range: 0 to ${list.size()}).`,
          a11yMessage: `Error: insertion index ${cmd.index} is out of bounds.`,
          pointers: getPointers(list.getHead()?.id || null, list.getTail()?.id || null),
          codeHighlight: {
            pseudocodeLine: 18,
            typescriptLine: 22,
          },
        });
      } else if (cmd.index === 0) {
        const newNode = list.prepend(cmd.value);
        steps.push({
          id: `step-${steps.length}`,
          stepIndex: steps.length,
          totalSteps: 0,
          action: 'INSERT_AT',
          state: {
            nodes: list.toNodeStates(),
            headId: list.getHead()?.id || null,
            tailId: list.getTail()?.id || null,
            size: list.size(),
            activeNodeId: newNode.id,
            targetIndex: 0,
            lastAction: 'INSERT_AT',
            statusMessage: `Inserted value ${cmd.value} at index 0 (HEAD) in O(1) time.`,
          },
          description: `Inserted node (${cmd.value}) at index 0 (HEAD).`,
          a11yMessage: `Inserted value ${cmd.value} at position 0.`,
          pointers: getPointers(list.getHead()?.id || null, list.getTail()?.id || null, newNode.id),
          codeHighlight: {
            pseudocodeLine: 18,
            typescriptLine: 22,
          },
        });
      } else {
        let curr = list.getHead();
        for (let i = 0; i < cmd.index; i++) {
          if (curr) {
            steps.push({
              id: `step-${steps.length}`,
              stepIndex: steps.length,
              totalSteps: 0,
              action: 'TRAVERSE',
              state: {
                nodes: list.toNodeStates(),
                headId: list.getHead()?.id || null,
                tailId: list.getTail()?.id || null,
                size: list.size(),
                activeNodeId: curr.id,
                targetIndex: i,
                lastAction: 'TRAVERSE',
                statusMessage: `Traversing node at index ${i} (${curr.value}) towards insertion position.`,
              },
              description: `Traversed node at index ${i} (value ${curr.value}). Traversal costs O(n).`,
              a11yMessage: `Traversing node at index ${i} with value ${curr.value}.`,
              pointers: getPointers(list.getHead()?.id || null, list.getTail()?.id || null, curr.id),
              codeHighlight: {
                pseudocodeLine: 20,
                typescriptLine: 24,
              },
            });
            curr = curr.next;
          }
        }

        const newNode = list.insertAt(cmd.index, cmd.value);
        steps.push({
          id: `step-${steps.length}`,
          stepIndex: steps.length,
          totalSteps: 0,
          action: 'INSERT_AT',
          state: {
            nodes: list.toNodeStates(),
            headId: list.getHead()?.id || null,
            tailId: list.getTail()?.id || null,
            size: list.size(),
            activeNodeId: newNode.id,
            targetIndex: cmd.index,
            lastAction: 'INSERT_AT',
            statusMessage: `Inserted value ${cmd.value} at index ${cmd.index}. Reconnected pointers in O(1).`,
          },
          description: `Inserted node (${cmd.value}) at index ${cmd.index} by updating pointers prev.next -> newNode -> next.`,
          a11yMessage: `Inserted value ${cmd.value} at index ${cmd.index}. Total nodes: ${list.size()}.`,
          pointers: getPointers(list.getHead()?.id || null, list.getTail()?.id || null, newNode.id),
          codeHighlight: {
            pseudocodeLine: 23,
            typescriptLine: 27,
          },
        });
      }
    } else if (cmd.type === 'REMOVE_AT') {
      if (cmd.index < 0 || cmd.index >= list.size() || list.isEmpty()) {
        steps.push({
          id: `step-${steps.length}`,
          stepIndex: steps.length,
          totalSteps: 0,
          action: 'UNDERFLOW',
          state: {
            nodes: list.toNodeStates(),
            headId: list.getHead()?.id || null,
            tailId: list.getTail()?.id || null,
            size: list.size(),
            lastAction: 'ERROR',
            statusMessage: `Cannot remove at index ${cmd.index}: out of bounds (valid range: 0 to ${Math.max(0, list.size() - 1)}).`,
          },
          description: `Cannot remove at index ${cmd.index}: list has ${list.size()} elements.`,
          a11yMessage: `Error: removal index ${cmd.index} is out of bounds.`,
          pointers: getPointers(list.getHead()?.id || null, list.getTail()?.id || null),
          codeHighlight: {
            pseudocodeLine: 27,
            typescriptLine: 31,
          },
        });
      } else if (cmd.index === 0) {
        const removedVal = list.removeAt(0);
        steps.push({
          id: `step-${steps.length}`,
          stepIndex: steps.length,
          totalSteps: 0,
          action: 'REMOVE_AT',
          state: {
            nodes: list.toNodeStates(),
            headId: list.getHead()?.id || null,
            tailId: list.getTail()?.id || null,
            size: list.size(),
            targetIndex: 0,
            lastAction: 'REMOVE_AT',
            statusMessage: `Removed HEAD node (${removedVal}) in O(1) time. HEAD advanced to next node.`,
          },
          description: `Removed HEAD node with value ${removedVal} in O(1) time.`,
          a11yMessage: `Removed HEAD node with value ${removedVal}. Remaining nodes: ${list.size()}.`,
          pointers: getPointers(list.getHead()?.id || null, list.getTail()?.id || null),
          codeHighlight: {
            pseudocodeLine: 29,
            typescriptLine: 33,
          },
        });
      } else {
        let curr = list.getHead();
        for (let i = 0; i < cmd.index; i++) {
          if (curr) {
            steps.push({
              id: `step-${steps.length}`,
              stepIndex: steps.length,
              totalSteps: 0,
              action: 'TRAVERSE',
              state: {
                nodes: list.toNodeStates(),
                headId: list.getHead()?.id || null,
                tailId: list.getTail()?.id || null,
                size: list.size(),
                activeNodeId: curr.id,
                targetIndex: i,
                lastAction: 'TRAVERSE',
                statusMessage: `Traversing node at index ${i} (${curr.value}) towards removal position.`,
              },
              description: `Traversed node at index ${i} (value ${curr.value}). Traversal costs O(n).`,
              a11yMessage: `Traversing node at index ${i} with value ${curr.value}.`,
              pointers: getPointers(list.getHead()?.id || null, list.getTail()?.id || null, curr.id),
              codeHighlight: {
                pseudocodeLine: 33,
                typescriptLine: 37,
              },
            });
            curr = curr.next;
          }
        }

        const removedVal = list.removeAt(cmd.index);
        steps.push({
          id: `step-${steps.length}`,
          stepIndex: steps.length,
          totalSteps: 0,
          action: 'REMOVE_AT',
          state: {
            nodes: list.toNodeStates(),
            headId: list.getHead()?.id || null,
            tailId: list.getTail()?.id || null,
            size: list.size(),
            targetIndex: cmd.index,
            lastAction: 'REMOVE_AT',
            statusMessage: `Removed node at index ${cmd.index} (${removedVal}). Bypass reconnected in O(1).`,
          },
          description: `Removed node at index ${cmd.index} (value ${removedVal}) by bypassing pointer prev.next = target.next.`,
          a11yMessage: `Removed node at index ${cmd.index} with value ${removedVal}. Remaining nodes: ${list.size()}.`,
          pointers: getPointers(list.getHead()?.id || null, list.getTail()?.id || null),
          codeHighlight: {
            pseudocodeLine: 35,
            typescriptLine: 39,
          },
        });
      }
    } else if (cmd.type === 'FIND') {
      let curr = list.getHead();
      let idx = 0;
      let found = false;

      while (curr) {
        if (curr.value === cmd.value) {
          steps.push({
            id: `step-${steps.length}`,
            stepIndex: steps.length,
            totalSteps: 0,
            action: 'FOUND',
            state: {
              nodes: list.toNodeStates(),
              headId: list.getHead()?.id || null,
              tailId: list.getTail()?.id || null,
              size: list.size(),
              activeNodeId: curr.id,
              targetIndex: idx,
              lastAction: 'FOUND',
              statusMessage: `Found value ${cmd.value} at index ${idx} (node ID: ${curr.id}).`,
            },
            description: `Found target value ${cmd.value} at index ${idx}.`,
            a11yMessage: `Target value ${cmd.value} found at index ${idx}.`,
            pointers: getPointers(list.getHead()?.id || null, list.getTail()?.id || null, curr.id),
            codeHighlight: {
              pseudocodeLine: 20,
              typescriptLine: 24,
            },
          });
          found = true;
          break;
        } else {
          steps.push({
            id: `step-${steps.length}`,
            stepIndex: steps.length,
            totalSteps: 0,
            action: 'SEARCH',
            state: {
              nodes: list.toNodeStates(),
              headId: list.getHead()?.id || null,
              tailId: list.getTail()?.id || null,
              size: list.size(),
              activeNodeId: curr.id,
              targetIndex: idx,
              lastAction: 'SEARCH',
              statusMessage: `Inspecting index ${idx}: value ${curr.value} !== ${cmd.value}. Moving next.`,
            },
            description: `Checked node at index ${idx} (value ${curr.value} !== ${cmd.value}).`,
            a11yMessage: `Inspecting index ${idx}: value ${curr.value} does not match target ${cmd.value}.`,
            pointers: getPointers(list.getHead()?.id || null, list.getTail()?.id || null, curr.id),
            codeHighlight: {
              pseudocodeLine: 20,
              typescriptLine: 24,
            },
          });
        }
        curr = curr.next;
        idx++;
      }

      if (!found) {
        steps.push({
          id: `step-${steps.length}`,
          stepIndex: steps.length,
          totalSteps: 0,
          action: 'NOT_FOUND',
          state: {
            nodes: list.toNodeStates(),
            headId: list.getHead()?.id || null,
            tailId: list.getTail()?.id || null,
            size: list.size(),
            lastAction: 'NOT_FOUND',
            statusMessage: `Value ${cmd.value} not found in the Linked List (reached NULL terminator).`,
          },
          description: `Searched entire list: value ${cmd.value} not found in O(n) scan.`,
          a11yMessage: `Value ${cmd.value} not found in the list.`,
          pointers: getPointers(list.getHead()?.id || null, list.getTail()?.id || null),
          codeHighlight: {
            pseudocodeLine: 24,
            typescriptLine: 28,
          },
        });
      }
    } else if (cmd.type === 'CLEAR') {
      list.clear();
      steps.push({
        id: `step-${steps.length}`,
        stepIndex: steps.length,
        totalSteps: 0,
        action: 'CLEAR',
        state: {
          nodes: [],
          headId: null,
          tailId: null,
          size: 0,
          lastAction: 'CLEAR',
          statusMessage: 'Cleared all nodes from the Singly Linked List.',
        },
        description: 'Cleared Linked List. All references freed, HEAD -> null.',
        a11yMessage: 'Linked list cleared. List is now empty.',
        pointers: [],
        codeHighlight: {
          pseudocodeLine: 1,
          typescriptLine: 1,
        },
      });
    }
  }

  steps.push({
    id: `step-${steps.length}`,
    stepIndex: steps.length,
    totalSteps: 0,
    action: 'COMPLETE',
    state: {
      nodes: list.toNodeStates(),
      headId: list.getHead()?.id || null,
      tailId: list.getTail()?.id || null,
      size: list.size(),
      lastAction: 'COMPLETE',
      statusMessage: `Sequence completed. Final list contains ${list.size()} nodes.`,
    },
    description: `Linked List sequence completed. Final size: ${list.size()} nodes.`,
    a11yMessage: `Sequence completed. Linked List has ${list.size()} nodes.`,
    pointers: getPointers(list.getHead()?.id || null, list.getTail()?.id || null),
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
      finalItems: list.toArray(),
      finalSize: list.size(),
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
