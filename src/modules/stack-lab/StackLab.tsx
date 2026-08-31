import React, { useState, useEffect, useRef, useCallback } from 'react';
import { simulateStackOperations, StackCommand } from '@/core/algorithms';
import { TimeTravelController } from '@/core/engine';
import { ExecutionStep } from '@/core/types';
import { StackState } from '@/core/data-structures/stack';
import { StackVisualizerAdapter } from '@/components/visualizer';
import { LabShell, Button, Badge, Card } from '@/components/ui';

interface PresetItem {
  label: string;
  commands: StackCommand[];
  capacity: number;
}

const PRESET_SEQUENCES: PresetItem[] = [
  {
    label: 'Standard [Push 10, 20, 30, Pop, Push 40]',
    capacity: 6,
    commands: [
      { type: 'PUSH', value: 10 },
      { type: 'PUSH', value: 20 },
      { type: 'PUSH', value: 30 },
      { type: 'POP' },
      { type: 'PUSH', value: 40 },
      { type: 'PEEK' },
    ],
  },
  {
    label: 'Overflow Demo [Fill Cap 5 + 1]',
    capacity: 5,
    commands: [
      { type: 'PUSH', value: 1 },
      { type: 'PUSH', value: 2 },
      { type: 'PUSH', value: 3 },
      { type: 'PUSH', value: 4 },
      { type: 'PUSH', value: 5 },
      { type: 'PUSH', value: 99 },
    ],
  },
  {
    label: 'Underflow Demo [Push 50, Pop, Pop]',
    capacity: 5,
    commands: [
      { type: 'PUSH', value: 50 },
      { type: 'POP' },
      { type: 'POP' },
    ],
  },
  {
    label: 'Peek & Inspect [Push 12, 24, Peek]',
    capacity: 6,
    commands: [
      { type: 'PUSH', value: 12 },
      { type: 'PUSH', value: 24 },
      { type: 'PEEK' },
    ],
  },
];

const PEDAGOGICAL_PHASES = [
  {
    id: '01',
    name: '01. Discover',
    title: 'Discover the LIFO Principle (Last-In, First-Out)',
    content:
      'A Stack is a linear data structure governed by a strict access rule: the last element added is always the first one to be removed (LIFO: Last-In, First-Out). Think of a physical stack of plates in a cafeteria, the "Undo" history in a text editor, or the function call stack in programming runtimes. You can only insert or extract from one designated end: the TOP.',
  },
  {
    id: '02',
    name: '02. Interact',
    title: 'Interact with Push, Pop & Peek',
    content:
      'Use the operations panel on the right to append values with PUSH, inspect the current topmost value with PEEK, or extract the top with POP. Step through the timeline using the time-travel buttons below to watch the TOP pointer follow each operation deterministically.',
  },
  {
    id: '03',
    name: '03. Observe',
    title: 'Observe Confinement of Access',
    content:
      'Notice that elements below the top index are completely inaccessible. Unlike an Array where any element can be read at index i, a Stack deliberately shields internal elements from random access. To retrieve the very first element pushed (at the bottom), every single element above it must first be popped.',
  },
  {
    id: '04',
    name: '04. Explain',
    title: 'Explain Time & Space Complexity',
    content:
      'Because all operations (PUSH, POP, PEEK) occur strictly at the top of the structure, no element shifting is required. Therefore, PUSH, POP, and PEEK all execute in strict O(1) constant time. Space complexity is O(N) auxiliary memory to store N items, while the pedagogical ExecutionStep[] trace records immutable snapshots for time travel.',
  },
  {
    id: '05',
    name: '05. Visualize',
    title: 'Visual Representation & Top Pointer',
    content:
      'The SVG Viewport renders the stack as an open vertical container. The base plate is at the bottom (index [0]), stacked nodes grow upward toward the opening, and the TOP pointer dynamically tracks the index of the uppermost valid element. When empty, TOP points to null.',
  },
  {
    id: '06',
    name: '06. Pseudocode',
    title: 'Algorithm Pseudocode (Bounded Stack ADT)',
    content: `procedure push(stack: Stack, value: Item)
  if isFull(stack) then
    throw StackOverflowError
  end if
  stack.top := stack.top + 1
  stack.items[stack.top] := value
end procedure

procedure pop(stack: Stack) -> Item
  if isEmpty(stack) then
    throw StackUnderflowError
  end if
  value := stack.items[stack.top]
  stack.top := stack.top - 1
  return value
end procedure

procedure peek(stack: Stack) -> Item
  if isEmpty(stack) then
    throw StackUnderflowError
  end if
  return stack.items[stack.top]
end procedure`,
  },
  {
    id: '07',
    name: '07. Code',
    title: 'TypeScript Implementation (Generic Bounded Stack)',
    content: `export class BoundedStack<T> {
  private items: T[] = [];
  private readonly capacity: number;

  constructor(capacity: number = 8) {
    this.capacity = capacity;
  }

  push(item: T): void {
    if (this.isFull()) {
      throw new Error('Stack Overflow: capacity reached');
    }
    this.items.push(item);
  }

  pop(): T {
    if (this.isEmpty()) {
      throw new Error('Stack Underflow: stack is empty');
    }
    return this.items.pop() as T;
  }

  peek(): T {
    if (this.isEmpty()) {
      throw new Error('Stack Underflow: stack is empty');
    }
    return this.items[this.items.length - 1] as T;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  isFull(): boolean {
    return this.items.length >= this.capacity;
  }

  size(): number {
    return this.items.length;
  }
}`,
  },
  {
    id: '08',
    name: '08. Modify',
    title: 'Modify & Boundary Conditions (Overflow / Underflow)',
    content:
      'In fixed-memory environments (such as embedded systems or thread call stacks), stacks have a bounded capacity. Attempting to push into a full stack triggers a Stack Overflow error. Conversely, popping or peeking from an empty stack triggers a Stack Underflow error. Try running the Overflow and Underflow presets above to observe how these boundary states are handled gracefully!',
  },
  {
    id: '09',
    name: '09. Practice',
    title: 'Practice: Balanced Parentheses Matching',
    content:
      'A classic real-world application of stacks is compiler syntax parsing: verifying balanced brackets like "{[()]}". As the parser scans from left to right, every opening bracket is PUSHed onto the stack. When a closing bracket is encountered, the parser POPs the top element and verifies if they form a matching pair. If the stack is empty at the end, the string is balanced!',
  },
  {
    id: '10',
    name: '10. Challenge',
    title: 'Algorithm Mastery Challenge',
    content:
      'Challenge Question: Given an initial empty stack with capacity 5, we perform the following sequence: PUSH(10), PUSH(20), PUSH(30), POP(), PUSH(40), PUSH(50), POP(), PEEK(). What value is returned by PEEK(), and how many items remain in the stack? (Answer: PEEK returns 40, and 2 items remain: [10, 40]). Load the Standard preset to verify!',
  },
];

export const StackLab: React.FC = () => {
  const [pushInputText, setPushInputText] = useState('42');
  const [inputError, setInputError] = useState<string | null>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(600);
  const [stackCapacity, setStackCapacity] = useState<number>(6);
  const [currentCommands, setCurrentCommands] = useState<StackCommand[]>(PRESET_SEQUENCES[0]?.commands || []);

  const controllerRef = useRef<TimeTravelController<StackState> | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const [currentStep, setCurrentStep] = useState<ExecutionStep<StackState> | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);

  const initController = useCallback((commands: StackCommand[], capacity: number) => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    setIsPlaying(false);

    const result = simulateStackOperations(commands, capacity);
    const ctrl = new TimeTravelController(result.steps);
    controllerRef.current = ctrl;
    setCurrentStep(ctrl.currentStep);
    setCurrentIndex(ctrl.currentIndex);
    setTotalSteps(ctrl.totalSteps);

    unsubscribeRef.current = ctrl.subscribe((step, idx) => {
      setCurrentStep(step);
      setCurrentIndex(idx);
    });
  }, []);

  useEffect(() => {
    const defaultPreset = PRESET_SEQUENCES[0];
    if (defaultPreset) {
      setStackCapacity(defaultPreset.capacity);
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

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const timer = setInterval(() => {
      const ctrl = controllerRef.current;
      if (!ctrl || ctrl.isFinal) {
        setIsPlaying(false);
        return;
      }
      ctrl.next();
    }, playbackSpeed);

    return () => {
      clearInterval(timer);
    };
  }, [isPlaying, playbackSpeed]);

  const handlePush = () => {
    const trimmed = pushInputText.trim();
    if (!trimmed || !Number.isFinite(Number(trimmed))) {
      setInputError(`Invalid number: "${pushInputText}". Please enter a valid number.`);
      return;
    }

    setInputError(null);
    const val = Number(trimmed);
    const newCommands: StackCommand[] = [...currentCommands, { type: 'PUSH', value: Math.round(val) }];
    setCurrentCommands(newCommands);
    initController(newCommands, stackCapacity);
    controllerRef.current?.last();
  };

  const handlePop = () => {
    setInputError(null);
    const newCommands: StackCommand[] = [...currentCommands, { type: 'POP' }];
    setCurrentCommands(newCommands);
    initController(newCommands, stackCapacity);
    controllerRef.current?.last();
  };

  const handlePeek = () => {
    setInputError(null);
    const newCommands: StackCommand[] = [...currentCommands, { type: 'PEEK' }];
    setCurrentCommands(newCommands);
    initController(newCommands, stackCapacity);
    controllerRef.current?.last();
  };

  const handleClear = () => {
    setInputError(null);
    const newCommands: StackCommand[] = [];
    setCurrentCommands(newCommands);
    initController(newCommands, stackCapacity);
  };

  const handlePresetSelect = (preset: PresetItem) => {
    setInputError(null);
    setStackCapacity(preset.capacity);
    setCurrentCommands(preset.commands);
    initController(preset.commands, preset.capacity);
  };

  const handleCapacityChange = (cap: number) => {
    setStackCapacity(cap);
    initController(currentCommands, cap);
  };

  const handleNext = () => {
    controllerRef.current?.next();
  };

  const handlePrev = () => {
    controllerRef.current?.previous();
  };

  const handleFirst = () => {
    controllerRef.current?.first();
  };

  const handleLast = () => {
    controllerRef.current?.last();
  };

  const handleReset = () => {
    setIsPlaying(false);
    controllerRef.current?.reset();
  };

  const handleTogglePlay = () => {
    if (controllerRef.current?.isFinal) {
      controllerRef.current?.first();
    }
    setIsPlaying((prev) => !prev);
  };

  const currentAction = currentStep?.action || 'INITIALIZE';
  const stateData = currentStep?.state || { items: [], topIndex: -1, capacity: stackCapacity };
  const activePhase = PEDAGOGICAL_PHASES[activePhaseIndex] || PEDAGOGICAL_PHASES[0];

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'PUSH':
        return 'cyan';
      case 'POP':
        return 'rose';
      case 'PEEK':
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
    <LabShell
      category="Interactive Laboratory: Stack Data Structure"
      title="Stack & LIFO Principle Exploration"
      subtitle="Understand Last-In, First-Out (LIFO) discipline, constant-time O(1) top operations, and boundary conditions through an interactive 10-step pedagogical laboratory."
      viewportSlot={
        <StackVisualizerAdapter
          step={currentStep}
          viewBoxWidth={800}
          viewBoxHeight={360}
        />
      }
      controlsSlot={
        <div className="control-group">
          <div className="control-group">
            <span className="control-label">Interactive Stack Operations</span>
            <div className="input-action-row">
              <input
                type="text"
                inputMode="numeric"
                value={pushInputText}
                onChange={(e) => {
                  setPushInputText(e.target.value);
                  if (inputError) {
                    setInputError(null);
                  }
                }}
                placeholder="e.g. 42"
                aria-label="Value to push onto stack"
                className="array-input-field"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handlePush}
                aria-label="Push value onto stack"
              >
                Push
              </Button>
            </div>

            <div className="control-actions">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePop}
                aria-label="Pop top value from stack"
              >
                Pop
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePeek}
                aria-label="Peek top value"
              >
                Peek
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                aria-label="Clear stack"
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
                  key={`cap-${cap}`}
                  variant={stackCapacity === cap ? 'secondary' : 'outline'}
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

          <div className="control-group">
            <span className="control-label">Time-Travel Step Controller</span>
            <div className="control-actions">
              <Button
                variant="outline"
                size="sm"
                onClick={handleFirst}
                disabled={currentIndex <= 0}
                aria-label="Jump to first step"
              >
                |&lt;
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={currentIndex <= 0}
                aria-label="Step backwards"
              >
                &lt; Step
              </Button>
              <Button
                variant={isPlaying ? 'danger' : 'primary'}
                size="sm"
                onClick={handleTogglePlay}
                aria-label={isPlaying ? 'Pause execution' : 'Play auto execution'}
              >
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleNext}
                disabled={currentIndex >= totalSteps - 1}
                aria-label="Step forward"
              >
                Step &gt;
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLast}
                disabled={currentIndex >= totalSteps - 1}
                aria-label="Jump to last step"
              >
                &gt;|
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                aria-label="Reset to initial step"
              >
                Reset
              </Button>
            </div>

            <div className="speed-control-row">
              <span className="control-label">Speed:</span>
              <Button
                variant={playbackSpeed === 1000 ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setPlaybackSpeed(1000)}
              >
                0.5x
              </Button>
              <Button
                variant={playbackSpeed === 600 ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setPlaybackSpeed(600)}
              >
                1x
              </Button>
              <Button
                variant={playbackSpeed === 250 ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => setPlaybackSpeed(250)}
              >
                2x
              </Button>
            </div>
          </div>

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
                <span className="inspector-label">Items in Stack: </span>
                <span className="inspector-val-total">
                  {stateData.items.length} / {stateData.capacity}
                </span>
              </div>
              <div>
                <span className="inspector-label">TOP Element: </span>
                <span className="inspector-val-index">
                  {stateData.topIndex >= 0 ? `${stateData.items[stateData.topIndex]} (idx: ${stateData.topIndex})` : 'null (empty)'}
                </span>
              </div>
              <div>
                <span className="inspector-label">Status: </span>
                <span
                  className={
                    currentAction === 'OVERFLOW' || currentAction === 'UNDERFLOW'
                      ? 'input-error-badge'
                      : stateData.items.length === stateData.capacity
                        ? 'inspector-val-idle'
                        : 'inspector-val-index'
                  }
                >
                  {currentAction === 'OVERFLOW'
                    ? 'Overflow Error'
                    : currentAction === 'UNDERFLOW'
                      ? 'Underflow Error'
                      : stateData.items.length === 0
                        ? 'Empty'
                        : stateData.items.length === stateData.capacity
                          ? 'Full (Cap Reached)'
                          : 'Normal'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      }
      knowledgeSlot={
        <div className="control-group">
          <div className="pedagogical-tabs-container">
            {PEDAGOGICAL_PHASES.map((phase, idx) => (
              <Button
                key={phase.id}
                variant={activePhaseIndex === idx ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setActivePhaseIndex(idx)}
              >
                {phase.name}
              </Button>
            ))}
          </div>

          <Card title={activePhase?.title}>
            {activePhase?.id === '06' || activePhase?.id === '07' ? (
              <pre className="code-snippet-box">
                <code>{activePhase.content}</code>
              </pre>
            ) : (
              <p className="phase-content-text">{activePhase?.content}</p>
            )}
          </Card>
        </div>
      }
    />
  );
};
