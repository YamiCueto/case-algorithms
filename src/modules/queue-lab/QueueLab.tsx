import React, { useState, useEffect, useRef, useCallback } from 'react';
import { simulateQueueOperations, QueueCommand } from '@/core/algorithms';
import { TimeTravelController } from '@/core/engine';
import { ExecutionStep } from '@/core/types';
import { QueueState } from '@/core/data-structures/queue';
import { QueueVisualizerAdapter } from '@/components/visualizer';
import {
  LabShell,
  Button,
  Badge,
  Card,
  TimeTravelControls,
  usePlaybackTimer,
  PedagogicalKnowledgePanel,
} from '@/components/ui';
import { A11yAnnouncer, useTimeTravelKeyboard } from '@/components/a11y';

interface PresetItem {
  readonly label: string;
  readonly commands: readonly QueueCommand[];
  readonly capacity: number;
}

const PRESET_SEQUENCES: readonly PresetItem[] = [
  {
    label: 'Standard [Enqueue 10, 20, 30, Dequeue, Enqueue 40]',
    capacity: 6,
    commands: [
      { type: 'ENQUEUE', value: 10 },
      { type: 'ENQUEUE', value: 20 },
      { type: 'ENQUEUE', value: 30 },
      { type: 'DEQUEUE' },
      { type: 'ENQUEUE', value: 40 },
      { type: 'PEEK_FRONT' },
    ],
  },
  {
    label: 'Overflow Demo [Fill Cap 5 + 1]',
    capacity: 5,
    commands: [
      { type: 'ENQUEUE', value: 1 },
      { type: 'ENQUEUE', value: 2 },
      { type: 'ENQUEUE', value: 3 },
      { type: 'ENQUEUE', value: 4 },
      { type: 'ENQUEUE', value: 5 },
      { type: 'ENQUEUE', value: 99 },
    ],
  },
  {
    label: 'Underflow Demo [Enqueue 50, Dequeue, Dequeue]',
    capacity: 5,
    commands: [
      { type: 'ENQUEUE', value: 50 },
      { type: 'DEQUEUE' },
      { type: 'DEQUEUE' },
    ],
  },
  {
    label: 'Peek & Inspect [Enqueue 12, 24, Peek]',
    capacity: 6,
    commands: [
      { type: 'ENQUEUE', value: 12 },
      { type: 'ENQUEUE', value: 24 },
      { type: 'PEEK_FRONT' },
    ],
  },
];

const PEDAGOGICAL_PHASES = [
  {
    id: '01',
    name: '01. Discover',
    title: 'Discover the FIFO Principle (First-In, First-Out)',
    content:
      'A Queue is a fundamental linear data structure governed by a strict access rule: the first element inserted is always the first one to be removed (FIFO: First-In, First-Out). Think of a line of customers at a ticket counter, a printer spooler processing print jobs in order, or an operating system message queue.',
  },
  {
    id: '02',
    name: '02. Interact',
    title: 'Interact with Enqueue, Dequeue & Peek',
    content:
      'Use the operations panel on the right to append values at the REAR with ENQUEUE, inspect the earliest item at the FRONT with PEEK, or remove the front element with DEQUEUE. Step through the timeline using the time-travel buttons below to watch the FRONT and REAR pointers update.',
  },
  {
    id: '03',
    name: '03. Observe',
    title: 'Observe Dual-End Access Discipline',
    content:
      'Notice that elements in a Queue can only enter from one end (REAR) and exit from the other end (FRONT). Random index access into middle elements is prohibited by the ADT contract. Notice how DEQUEUE advances the FRONT pointer without physically shifting any remaining elements in memory!',
  },
  {
    id: '04',
    name: '04. Explain',
    title: 'Explain Time & Space Complexity (Why O(1)?)',
    content:
      'In a naive array implementation, removing the front element requires shifting all remaining N-1 elements to the left, which costs O(N) time. In CASE Algorithms, the Bounded Queue is implemented as an authentic Two-Pointer Circular Buffer: ENQUEUE inserts at buffer[rear] and advances rear = (rear + 1) % capacity; DEQUEUE extracts buffer[front] and advances front = (front + 1) % capacity. Because zero elements are shifted, ENQUEUE, DEQUEUE, and PEEK all execute in strict O(1) constant time! Space complexity is O(N) auxiliary memory for the buffer, while the immutable ExecutionStep[] trace records pedagogical snapshots for time-travel.',
  },
  {
    id: '05',
    name: '05. Visualize',
    title: 'Visual Representation & Circular Buffer Pointers',
    content:
      'The SVG Viewport renders the queue as a bounded physical buffer. The FRONT pointer (cyan) tracks the earliest valid element, while the REAR pointer (amber) indicates the most recently appended element. Notice how empty slots remain fixed in place while pointers advance across the buffer.',
  },
  {
    id: '06',
    name: '06. Pseudocode',
    title: 'Algorithm Pseudocode (Circular Buffer Queue ADT)',
    content: `procedure enqueue(queue: Queue, value: Item)
  if isFull(queue) then
    throw QueueOverflowError
  end if
  queue.buffer[queue.rear] := value
  queue.rear := (queue.rear + 1) mod queue.capacity
  queue.count := queue.count + 1
end procedure

procedure dequeue(queue: Queue) -> Item
  if isEmpty(queue) then
    throw QueueUnderflowError
  end if
  value := queue.buffer[queue.front]
  queue.buffer[queue.front] := null
  queue.front := (queue.front + 1) mod queue.capacity
  queue.count := queue.count - 1
  return value
end procedure

procedure peek(queue: Queue) -> Item
  if isEmpty(queue) then
    throw QueueUnderflowError
  end if
  return queue.buffer[queue.front]
end procedure`,
  },
  {
    id: '07',
    name: '07. Code',
    title: 'TypeScript Implementation (Two-Pointer Circular Queue)',
    content: `export class BoundedQueue<T> {
  private readonly buffer: (T | null)[];
  private front: number = 0;
  private rear: number = 0;
  private count: number = 0;
  private readonly capacity: number;

  constructor(capacity: number = 8) {
    this.capacity = capacity;
    this.buffer = new Array<T | null>(capacity).fill(null);
  }

  enqueue(item: T): void {
    if (this.isFull()) {
      throw new Error('Queue Overflow: capacity reached');
    }
    this.buffer[this.rear] = item;
    this.rear = (this.rear + 1) % this.capacity;
    this.count++;
  }

  dequeue(): T {
    if (this.isEmpty()) {
      throw new Error('Queue Underflow: queue is empty');
    }
    const item = this.buffer[this.front]!;
    this.buffer[this.front] = null;
    this.front = (this.front + 1) % this.capacity;
    this.count--;
    return item;
  }

  peek(): T {
    if (this.isEmpty()) {
      throw new Error('Queue Underflow: queue is empty');
    }
    return this.buffer[this.front]!;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  isFull(): boolean {
    return this.count >= this.capacity;
  }
}`,
  },
  {
    id: '08',
    name: '08. Modify',
    title: 'Modify & Boundary Conditions',
    content:
      'A Bounded Queue enforces strict capacity limits: Queue Overflow occurs when attempting to ENQUEUE into a full queue, and Queue Underflow occurs when attempting to DEQUEUE or PEEK an empty queue. Try triggering both boundary conditions using the demo presets!',
  },
  {
    id: '09',
    name: '09. Practice',
    title: 'Practice: Breadth-First Search (BFS)',
    content:
      'Queues are the foundational engine behind Breadth-First Search (BFS) in trees and graphs, level-order traversals, and web crawler URL frontiers. By visiting neighbors in FIFO order, BFS guarantees discovering the shortest path in unweighted graphs.',
  },
  {
    id: '10',
    name: '10. Challenge',
    title: 'Algorithm Mastery Challenge',
    content:
      'Challenge Question: Given an initial empty queue with capacity 5, we perform: ENQUEUE(10), ENQUEUE(20), ENQUEUE(30), DEQUEUE(), ENQUEUE(40), ENQUEUE(50), DEQUEUE(), PEEK(). What value is returned by PEEK(), and what is the final queue contents? (Answer: PEEK returns 30, and the queue contains [30, 40, 50]). Load the Standard preset to verify!',
  },
];

export const QueueLab: React.FC = () => {
  const [enqueueInputText, setEnqueueInputText] = useState('42');
  const [inputError, setInputError] = useState<string | null>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [queueCapacity, setQueueCapacity] = useState<number>(6);
  const [currentCommands, setCurrentCommands] = useState<readonly QueueCommand[]>(
    PRESET_SEQUENCES[0]?.commands || []
  );

  const controllerRef = useRef<TimeTravelController<QueueState> | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const [currentStep, setCurrentStep] = useState<ExecutionStep<QueueState> | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);

  const handleNext = useCallback(() => {
    controllerRef.current?.next();
  }, []);

  const handlePrev = useCallback(() => {
    controllerRef.current?.previous();
  }, []);

  const handleFirst = useCallback(() => {
    controllerRef.current?.first();
  }, []);

  const handleLast = useCallback(() => {
    controllerRef.current?.last();
  }, []);

  const {
    isPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    handleTogglePlay,
    stopPlayback,
  } = usePlaybackTimer({
    onStepForward: handleNext,
    onRewindToStart: handleFirst,
    isFinal: controllerRef.current?.isFinal ?? false,
    defaultSpeed: 600,
  });

  const initController = useCallback(
    (commands: readonly QueueCommand[], capacity: number) => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }

      stopPlayback();

      const result = simulateQueueOperations(commands, capacity);
      const ctrl = new TimeTravelController(result.steps);
      controllerRef.current = ctrl;
      setCurrentStep(ctrl.currentStep);
      setCurrentIndex(ctrl.currentIndex);
      setTotalSteps(ctrl.totalSteps);

      unsubscribeRef.current = ctrl.subscribe((step, idx) => {
        setCurrentStep(step);
        setCurrentIndex(idx);
      });
    },
    [stopPlayback]
  );

  useEffect(() => {
    const defaultPreset = PRESET_SEQUENCES[0];
    if (defaultPreset) {
      setQueueCapacity(defaultPreset.capacity);
      setCurrentCommands(defaultPreset.commands);
      initController(defaultPreset.commands, defaultPreset.capacity);
    }
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [initController]);

  const handleEnqueue = () => {
    const trimmed = enqueueInputText.trim();
    if (!trimmed || !Number.isFinite(Number(trimmed))) {
      setInputError(`Invalid number: "${enqueueInputText}". Please enter a valid number.`);
      return;
    }

    setInputError(null);
    const val = Number(trimmed);
    const newCommands: QueueCommand[] = [
      ...currentCommands,
      { type: 'ENQUEUE', value: Math.round(val) },
    ];
    setCurrentCommands(newCommands);
    initController(newCommands, queueCapacity);
    controllerRef.current?.last();
  };

  const handleDequeue = () => {
    setInputError(null);
    const newCommands: QueueCommand[] = [...currentCommands, { type: 'DEQUEUE' }];
    setCurrentCommands(newCommands);
    initController(newCommands, queueCapacity);
    controllerRef.current?.last();
  };

  const handlePeekFront = () => {
    setInputError(null);
    const newCommands: QueueCommand[] = [...currentCommands, { type: 'PEEK_FRONT' }];
    setCurrentCommands(newCommands);
    initController(newCommands, queueCapacity);
    controllerRef.current?.last();
  };

  const handleClear = () => {
    setInputError(null);
    const newCommands: QueueCommand[] = [];
    setCurrentCommands(newCommands);
    initController(newCommands, queueCapacity);
  };

  const handlePresetSelect = (preset: PresetItem) => {
    setInputError(null);
    setQueueCapacity(preset.capacity);
    setCurrentCommands(preset.commands);
    initController(preset.commands, preset.capacity);
  };

  const handleCapacityChange = (cap: number) => {
    setQueueCapacity(cap);
    initController(currentCommands, cap);
  };

  const handleReset = () => {
    stopPlayback();
    controllerRef.current?.reset();
  };

  useTimeTravelKeyboard({
    onNext: handleNext,
    onPrevious: handlePrev,
    onFirst: handleFirst,
    onLast: handleLast,
    onTogglePlay: handleTogglePlay,
    onReset: handleReset,
  });

  const currentAction = currentStep?.action || 'INITIALIZE';
  const stateData = currentStep?.state || {
    buffer: new Array(queueCapacity).fill(null),
    items: [],
    frontIndex: -1,
    rearIndex: -1,
    count: 0,
    capacity: queueCapacity,
  };

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'ENQUEUE':
        return 'cyan';
      case 'DEQUEUE':
        return 'rose';
      case 'PEEK_FRONT':
        return 'amber';
      case 'OVERFLOW':
      case 'UNDERFLOW':
        return 'rose';
      case 'COMPLETE':
        return 'emerald';
      default:
        return 'cyan';
    }
  };

  return (
    <>
      <A11yAnnouncer message={currentStep?.a11yMessage} />
      <LabShell
        category="Interactive Laboratory: Queue Data Structure"
        title="Queue & FIFO Principle Exploration"
        subtitle="Understand First-In, First-Out (FIFO) discipline, dual-ended O(1) enqueue and dequeue operations, and boundary conditions through an interactive 10-step pedagogical laboratory."
        viewportSlot={
          <QueueVisualizerAdapter
            step={currentStep}
            viewBoxWidth={800}
            viewBoxHeight={360}
          />
        }
        controlsSlot={
          <div className="control-group">
            <div className="control-group">
              <span className="control-label">Interactive Queue Operations</span>
              <div className="input-action-row">
                <input
                  type="text"
                  inputMode="numeric"
                  value={enqueueInputText}
                  onChange={(e) => {
                    setEnqueueInputText(e.target.value);
                    if (inputError) {
                      setInputError(null);
                    }
                  }}
                  placeholder="e.g. 42"
                  aria-label="Value to enqueue"
                  className="array-input-field"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleEnqueue}
                  aria-label="Enqueue value into queue"
                >
                  Enqueue
                </Button>
              </div>

              <div className="control-actions">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDequeue}
                  aria-label="Dequeue front value"
                >
                  Dequeue
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePeekFront}
                  aria-label="Peek front value"
                >
                  Peek Front
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  aria-label="Clear queue"
                >
                  Clear
                </Button>
              </div>

              {inputError && (
                <Badge variant="rose" className="input-error-badge">
                  {inputError}
                </Badge>
              )}

              <div className="speed-control-row">
                <span className="control-label">Capacity:</span>
                {[4, 6, 8].map((cap) => (
                  <Button
                    key={`queue-cap-${cap}`}
                    variant={queueCapacity === cap ? 'secondary' : 'outline'}
                    size="sm"
                    onClick={() => handleCapacityChange(cap)}
                  >
                    {cap}
                  </Button>
                ))}
              </div>

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
              onPrevious={handlePrev}
              onTogglePlay={handleTogglePlay}
              onNext={handleNext}
              onLast={handleLast}
              onReset={handleReset}
              onSpeedChange={setPlaybackSpeed}
            />

            <Card title="State & Capacity Inspector">
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
                  <span className="inspector-label">Items in Queue: </span>
                  <span className="inspector-val-total">
                    {stateData.count} / {stateData.capacity}
                  </span>
                </div>
                <div>
                  <span className="inspector-label">FRONT Element: </span>
                  <span className="inspector-val-index">
                    {stateData.frontIndex >= 0 && stateData.buffer[stateData.frontIndex] !== null
                      ? `${stateData.buffer[stateData.frontIndex]} (slot [${stateData.frontIndex}])`
                      : 'null (empty)'}
                  </span>
                </div>
                <div>
                  <span className="inspector-label">REAR Element: </span>
                  <span className="inspector-val-index">
                    {stateData.rearIndex >= 0 && stateData.buffer[stateData.rearIndex] !== null
                      ? `${stateData.buffer[stateData.rearIndex]} (slot [${stateData.rearIndex}])`
                      : 'null (empty)'}
                  </span>
                </div>
                <div>
                  <span className="inspector-label">Status: </span>
                  <span
                    className={
                      currentAction === 'OVERFLOW' || currentAction === 'UNDERFLOW'
                        ? 'input-error-badge'
                        : stateData.count === stateData.capacity
                          ? 'inspector-val-idle'
                          : 'inspector-val-index'
                    }
                  >
                    {currentAction === 'OVERFLOW'
                      ? 'Overflow Error'
                      : currentAction === 'UNDERFLOW'
                        ? 'Underflow Error'
                        : stateData.count === 0
                          ? 'Empty'
                          : stateData.count === stateData.capacity
                            ? 'Full (Cap Reached)'
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
