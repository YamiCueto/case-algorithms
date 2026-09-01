import React, { useState, useEffect, useCallback } from 'react';
import { simulateLinkedListOperations, LinkedListCommand } from '@/core/algorithms';
import { LinkedListState } from '@/core/data-structures/linked-list';
import { LinkedListVisualizerAdapter } from '@/components/visualizer';
import {
  LabShell,
  Button,
  Badge,
  Card,
  TimeTravelControls,
  usePlaybackTimer,
  useTimeTravelEngine,
  PedagogicalKnowledgePanel,
} from '@/components/ui';
import { A11yAnnouncer, useTimeTravelKeyboard } from '@/components/a11y';

interface PresetItem {
  readonly label: string;
  readonly initialItems: readonly number[];
  readonly commands: readonly LinkedListCommand[];
}

const PRESET_SEQUENCES: readonly PresetItem[] = [
  {
    label: 'Standard [Prepend 10, Append 20, Append 30, InsertAt 1 (15)]',
    initialItems: [],
    commands: [
      { type: 'PREPEND', value: 10 },
      { type: 'APPEND', value: 20 },
      { type: 'APPEND', value: 30 },
      { type: 'INSERT_AT', index: 1, value: 15 },
    ],
  },
  {
    label: 'Prepend & Append Mix [Prepend 5, 2, Append 8, 12]',
    initialItems: [],
    commands: [
      { type: 'PREPEND', value: 5 },
      { type: 'PREPEND', value: 2 },
      { type: 'APPEND', value: 8 },
      { type: 'APPEND', value: 12 },
    ],
  },
  {
    label: 'Removal Demo [Start 10, 20, 30, 40 -> RemoveAt 1, RemoveAt 0]',
    initialItems: [10, 20, 30, 40],
    commands: [
      { type: 'REMOVE_AT', index: 1 },
      { type: 'REMOVE_AT', index: 0 },
    ],
  },
  {
    label: 'Search & Traverse [Start 11, 22, 33, 44 -> Find 33]',
    initialItems: [11, 22, 33, 44],
    commands: [
      { type: 'FIND', value: 33 },
    ],
  },
];

const PEDAGOGICAL_PHASES = [
  {
    id: '01',
    name: '01. Discover',
    title: 'Discover Dynamic Linked Nodes vs Contiguous Memory',
    content:
      'Unlike an Array where elements occupy a contiguous physical memory block, a Singly Linked List consists of independent Node objects scattered in heap memory. Each Node stores two components: its payload data (value) and a reference pointer (next) directed to the subsequent node in the sequence. The chain terminates with a null reference.',
  },
  {
    id: '02',
    name: '02. Interact',
    title: 'Interact with Prepend, Append, Insert, Remove & Find',
    content:
      'Use the operations panel on the right to prepend items at the HEAD in O(1), append items at the TAIL in O(1), or insert and remove elements at arbitrary positions. Step through the timeline using the time-travel buttons below to watch HEAD, TAIL, and CURR pointers dynamically reconnect.',
  },
  {
    id: '03',
    name: '03. Observe',
    title: 'Observe Pointer Reconnection Mechanics',
    content:
      'Notice that inserting or removing an element in a Linked List does NOT physically shift any existing nodes in memory! Instead, insertion is achieved by setting newNode.next = prev.next and prev.next = newNode. Deletion is achieved by bypassing the target node: prev.next = target.next.',
  },
  {
    id: '04',
    name: '04. Explain',
    title: 'Explain Time & Space Complexity Nuances',
    content:
      'Complexity in a Linked List is strictly operation-dependent: Access by index and Search by value are both O(N) because the list must be traversed sequentially from HEAD. Prepend is O(1) constant time as it only updates the head reference. Append is O(1) when maintaining a tail pointer reference (without a tail reference, append would cost O(N) traversal). Insert and Remove at an already-localized pointer take O(1) time, though reaching index i from HEAD incurs an O(i) traversal cost. Space complexity is O(N) auxiliary memory for node objects and pointers.',
  },
  {
    id: '05',
    name: '05. Visualize',
    title: 'Visual Representation of Nodes & Directed Edges',
    content:
      'The SVG Viewport renders the linked list as individual rectangular nodes connected by cyan directed arrows. The HEAD pointer (cyan) tracks the first valid node, the TAIL pointer (amber) tracks the last node, and the trailing arrow leads into the NULL terminal box.',
  },
  {
    id: '06',
    name: '06. Pseudocode',
    title: 'Algorithm Pseudocode (Singly Linked List ADT)',
    content: `procedure prepend(list: LinkedList, value: Item)
  newNode := Node(value)
  newNode.next := list.head
  list.head := newNode
  if list.tail = null then list.tail := newNode
end procedure

procedure append(list: LinkedList, value: Item)
  newNode := Node(value)
  if list.head = null then
    list.head := newNode; list.tail := newNode
  else
    list.tail.next := newNode; list.tail := newNode
  end if
end procedure

procedure insertAt(list: LinkedList, index: Integer, value: Item)
  if index = 0 then prepend(list, value); return
  prev := list.head
  for i from 0 to index - 2 do prev := prev.next
  newNode := Node(value)
  newNode.next := prev.next
  prev.next := newNode
end procedure

procedure removeAt(list: LinkedList, index: Integer) -> Item
  if index = 0 then
    value := list.head.value
    list.head := list.head.next
    return value
  end if
  prev := list.head
  for i from 0 to index - 2 do prev := prev.next
  target := prev.next
  prev.next := target.next
  return target.value
end procedure`,
  },
  {
    id: '07',
    name: '07. Code',
    title: 'TypeScript Implementation (Generic Singly Linked List)',
    content: `export class SinglyLinkedList<T> {
  private head: Node<T> | null = null;
  private tail: Node<T> | null = null;

  prepend(value: T): void {
    const node = new Node(value);
    node.next = this.head;
    this.head = node;
    if (!this.tail) this.tail = node;
  }

  append(value: T): void {
    const node = new Node(value);
    if (!this.head || !this.tail) {
      this.head = node; this.tail = node;
    } else {
      this.tail.next = node; this.tail = node;
    }
  }

  insertAt(index: number, value: T): void {
    if (index === 0) return this.prepend(value);
    let prev = this.head!;
    for (let i = 0; i < index - 1; i++) prev = prev.next!;
    const node = new Node(value);
    node.next = prev.next;
    prev.next = node;
  }

  removeAt(index: number): T {
    if (index === 0) {
      const val = this.head!.value;
      this.head = this.head!.next;
      return val;
    }
    let prev = this.head!;
    for (let i = 0; i < index - 1; i++) prev = prev.next!;
    const target = prev.next!;
    prev.next = target.next;
    return target.value;
  }
}`,
  },
  {
    id: '08',
    name: '08. Modify',
    title: 'Modify & Boundary Conditions',
    content:
      'Handling boundary conditions in Linked Lists requires careful pointer updates: removing the only element must set both HEAD and TAIL to null; removing the TAIL node requires traversing to the second-to-last node and updating tail = prev; invalid index insertions/deletions throw Out of Bounds errors.',
  },
  {
    id: '09',
    name: '09. Practice',
    title: 'Practice: Dynamic Memory & Chained Structures',
    content:
      'Linked Lists form the structural backbone of Hash Table separate chaining collision resolution, LRU (Least Recently Used) cache doubly-linked lists, symbol tables in compilers, and polynomial arithmetic representations in algebraic systems.',
  },
  {
    id: '10',
    name: '10. Challenge',
    title: 'Algorithm Mastery Challenge',
    content:
      'Challenge Question: Starting with an empty list, we execute: PREPEND(10), APPEND(20), PREPEND(5), INSERT_AT(1, 8), REMOVE_AT(2). What is the final sequence of values from HEAD to NULL? (Answer: [5 -> 8 -> 20 -> null]). Load the Standard preset to verify pointer transitions!',
  },
];

export const LinkedListLab: React.FC = () => {
  const [nodeValueText, setNodeValueText] = useState('42');
  const [nodeIndexText, setNodeIndexText] = useState('0');
  const [inputError, setInputError] = useState<string | null>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);

  const [currentInitialItems, setCurrentInitialItems] = useState<readonly number[]>(
    PRESET_SEQUENCES[0]?.initialItems || []
  );
  const [currentCommands, setCurrentCommands] = useState<readonly LinkedListCommand[]>(
    PRESET_SEQUENCES[0]?.commands || []
  );

  const {
    currentStep,
    currentIndex,
    totalSteps,
    isLast,
    handleNext,
    handlePrevious,
    handleFirst,
    handleLast,
    handleReset,
    loadSteps,
  } = useTimeTravelEngine<LinkedListState>();

  const {
    isPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    handleTogglePlay,
    stopPlayback,
  } = usePlaybackTimer({
    onStepForward: handleNext,
    onRewindToStart: handleFirst,
    isFinal: isLast,
    defaultSpeed: 600,
  });

  const initController = useCallback(
    (commands: readonly LinkedListCommand[], initialItems: readonly number[]) => {
      stopPlayback();
      const result = simulateLinkedListOperations(commands, initialItems);
      loadSteps(result.steps);
    },
    [stopPlayback, loadSteps]
  );

  useEffect(() => {
    const defaultPreset = PRESET_SEQUENCES[0];
    if (defaultPreset) {
      setCurrentInitialItems(defaultPreset.initialItems);
      setCurrentCommands(defaultPreset.commands);
      initController(defaultPreset.commands, defaultPreset.initialItems);
    }
  }, [initController]);

  const parseValue = (): number | null => {
    const trimmed = nodeValueText.trim();
    if (!trimmed || !Number.isFinite(Number(trimmed))) {
      setInputError(`Invalid value: "${nodeValueText}". Please enter a valid number.`);
      return null;
    }
    return Math.round(Number(trimmed));
  };

  const parseIndex = (): number | null => {
    const trimmed = nodeIndexText.trim();
    if (!trimmed || !Number.isInteger(Number(trimmed))) {
      setInputError(`Invalid index: "${nodeIndexText}". Please enter an integer.`);
      return null;
    }
    return Number(trimmed);
  };

  const handlePrepend = () => {
    const val = parseValue();
    if (val === null) return;
    setInputError(null);
    const newCommands: LinkedListCommand[] = [
      ...currentCommands,
      { type: 'PREPEND', value: val },
    ];
    setCurrentCommands(newCommands);
    initController(newCommands, currentInitialItems);
    handleLast();
  };

  const handleAppend = () => {
    const val = parseValue();
    if (val === null) return;
    setInputError(null);
    const newCommands: LinkedListCommand[] = [
      ...currentCommands,
      { type: 'APPEND', value: val },
    ];
    setCurrentCommands(newCommands);
    initController(newCommands, currentInitialItems);
    handleLast();
  };

  const handleInsertAt = () => {
    const val = parseValue();
    const idx = parseIndex();
    if (val === null || idx === null) return;
    setInputError(null);
    const newCommands: LinkedListCommand[] = [
      ...currentCommands,
      { type: 'INSERT_AT', index: idx, value: val },
    ];
    setCurrentCommands(newCommands);
    initController(newCommands, currentInitialItems);
    handleLast();
  };

  const handleRemoveAt = () => {
    const idx = parseIndex();
    if (idx === null) return;
    setInputError(null);
    const newCommands: LinkedListCommand[] = [
      ...currentCommands,
      { type: 'REMOVE_AT', index: idx },
    ];
    setCurrentCommands(newCommands);
    initController(newCommands, currentInitialItems);
    handleLast();
  };

  const handleFind = () => {
    const val = parseValue();
    if (val === null) return;
    setInputError(null);
    const newCommands: LinkedListCommand[] = [
      ...currentCommands,
      { type: 'FIND', value: val },
    ];
    setCurrentCommands(newCommands);
    initController(newCommands, currentInitialItems);
    handleLast();
  };

  const handleClear = () => {
    setInputError(null);
    const newCommands: LinkedListCommand[] = [];
    setCurrentCommands(newCommands);
    setCurrentInitialItems([]);
    initController(newCommands, []);
  };

  const handlePresetSelect = (preset: PresetItem) => {
    setInputError(null);
    setCurrentInitialItems(preset.initialItems);
    setCurrentCommands(preset.commands);
    initController(preset.commands, preset.initialItems);
  };

  const handleResetWithStop = () => {
    stopPlayback();
    handleReset();
  };

  useTimeTravelKeyboard({
    onNext: handleNext,
    onPrevious: handlePrevious,
    onFirst: handleFirst,
    onLast: handleLast,
    onTogglePlay: handleTogglePlay,
    onReset: handleResetWithStop,
  });

  const currentAction = currentStep?.action || 'INITIALIZE';
  const stateData = currentStep?.state || {
    nodes: [],
    headId: null,
    tailId: null,
    size: 0,
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'PREPEND':
      case 'APPEND':
      case 'INSERT_AT':
        return 'cyan';
      case 'REMOVE_AT':
        return 'rose';
      case 'FOUND':
        return 'emerald';
      case 'SEARCH':
      case 'TRAVERSE':
        return 'amber';
      case 'UNDERFLOW':
      case 'NOT_FOUND':
        return 'rose';
      case 'COMPLETE':
        return 'emerald';
      default:
        return 'cyan';
    }
  };

  const headNode = stateData.nodes.find((n) => n.id === stateData.headId);
  const tailNode = stateData.nodes.find((n) => n.id === stateData.tailId);

  return (
    <>
      <A11yAnnouncer message={currentStep?.a11yMessage} />
      <LabShell
        category="Interactive Laboratory: Singly Linked List"
        title="Singly Linked List & Pointer Chains"
        subtitle="Understand non-contiguous dynamic node allocation, directed pointer reconnections, O(1) head/tail operations, and O(n) sequential access through an interactive 10-step pedagogical laboratory."
        viewportSlot={
          <LinkedListVisualizerAdapter
            step={currentStep}
            viewBoxWidth={800}
            viewBoxHeight={360}
          />
        }
        controlsSlot={
          <div className="control-group">
            <div className="control-group">
              <span className="control-label">Interactive Node Operations</span>
              <div className="input-action-row">
                <input
                  type="text"
                  inputMode="numeric"
                  value={nodeValueText}
                  onChange={(e) => {
                    setNodeValueText(e.target.value);
                    if (inputError) {
                      setInputError(null);
                    }
                  }}
                  placeholder="Value (e.g. 42)"
                  aria-label="Node value input"
                  className="array-input-field"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  value={nodeIndexText}
                  onChange={(e) => {
                    setNodeIndexText(e.target.value);
                    if (inputError) {
                      setInputError(null);
                    }
                  }}
                  placeholder="Index (e.g. 0)"
                  aria-label="Node index input"
                  className="array-input-field"
                />
              </div>

              <div className="control-actions">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handlePrepend}
                  aria-label="Prepend node at head"
                >
                  Prepend
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAppend}
                  aria-label="Append node at tail"
                >
                  Append
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleInsertAt}
                  aria-label="Insert node at index"
                >
                  Insert At
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveAt}
                  aria-label="Remove node at index"
                >
                  Remove At
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFind}
                  aria-label="Find value in list"
                >
                  Find
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  aria-label="Clear linked list"
                >
                  Clear
                </Button>
              </div>

              {inputError && (
                <Badge variant="rose" className="input-error-badge">
                  {inputError}
                </Badge>
              )}

              <div className="control-actions">
                {PRESET_SEQUENCES.map((p) => (
                  <Button
                    key={p.label}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePresetSelect(p)}
                  >
                    {p.label}
                  </Button>
                ))}
              </div>
            </div>

            <TimeTravelControls
              isPlaying={isPlaying}
              currentIndex={currentIndex}
              totalSteps={totalSteps}
              playbackSpeed={playbackSpeed}
              onFirst={handleFirst}
              onPrevious={handlePrevious}
              onTogglePlay={handleTogglePlay}
              onNext={handleNext}
              onLast={handleLast}
              onReset={handleResetWithStop}
              onSpeedChange={setPlaybackSpeed}
            />

            <Card title="State & Pointer Inspector">
              <div className="inspector-list">
                <div>
                  <span className="inspector-label">Action: </span>
                  <Badge variant={getActionBadgeVariant(currentAction)}>
                    {currentAction}
                  </Badge>
                </div>
                <div>
                  <span className="inspector-label">Step Index: </span>
                  <span className="inspector-val-index">
                    {totalSteps > 0 ? currentIndex + 1 : 0} / {totalSteps}
                  </span>
                </div>
                <div>
                  <span className="inspector-label">List Size: </span>
                  <span className="inspector-val-total">
                    {stateData.size} node{stateData.size === 1 ? '' : 's'}
                  </span>
                </div>
                <div>
                  <span className="inspector-label">HEAD Node: </span>
                  <span className="inspector-val-index">
                    {headNode ? `${headNode.value} (id: ${headNode.id})` : 'null'}
                  </span>
                </div>
                <div>
                  <span className="inspector-label">TAIL Node: </span>
                  <span className="inspector-val-index">
                    {tailNode ? `${tailNode.value} (id: ${tailNode.id})` : 'null'}
                  </span>
                </div>
                <div>
                  <span className="inspector-label">Status: </span>
                  <span
                    className={
                      currentAction === 'UNDERFLOW' || currentAction === 'NOT_FOUND'
                        ? 'input-error-badge'
                        : stateData.size === 0
                          ? 'inspector-val-idle'
                          : 'inspector-val-index'
                    }
                  >
                    {currentAction === 'UNDERFLOW'
                      ? 'Index Error'
                      : currentAction === 'NOT_FOUND'
                        ? 'Not Found'
                        : currentAction === 'FOUND'
                          ? 'Match Found'
                          : stateData.size === 0
                            ? 'Empty (HEAD -> null)'
                            : 'Normal'}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        }
        knowledgeSlot={
          <PedagogicalKnowledgePanel
            phases={PEDAGOGICAL_PHASES}
            activePhaseIndex={activePhaseIndex}
            onPhaseSelect={setActivePhaseIndex}
            pseudocodeActiveLine={currentStep?.codeHighlight?.pseudocodeLine}
            typescriptActiveLine={currentStep?.codeHighlight?.typescriptLine}
          />
        }
      />
    </>
  );
};
