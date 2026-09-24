import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { simulateStackOperations, StackCommand } from '@/core/algorithms';
import { StackState } from '@/core/data-structures/stack';
import {
  StackVisualizerAdapter,
  StackTransitionContext,
  StackNavigationIntent,
} from '@/components/visualizer';
import { CodeViewer } from '@/components/code-viewer';
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
  label: string;
  commands: StackCommand[];
  capacity: number;
}

const PSEUDOCODE_SNIPPET = `procedure push(stack: Stack, value: Item)
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
end procedure`;

const TYPESCRIPT_SNIPPET = `export class BoundedStack<T> {
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
    return this.items.pop()!;
  }

  peek(): T {
    if (this.isEmpty()) {
      throw new Error('Stack Underflow: stack is empty');
    }
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  isFull(): boolean {
    return this.items.length >= this.capacity;
  }
}`;

const DEFAULT_STACK_COMMANDS: StackCommand[] = [
  { type: 'PUSH', value: 10 },
  { type: 'PUSH', value: 20 },
  { type: 'PUSH', value: 30 },
  { type: 'POP' },
  { type: 'PUSH', value: 40 },
];

export const StackLab: React.FC = () => {
  const { t } = useTranslation(['stack', 'pedagogy', 'common']);
  const [pushInputText, setPushInputText] = useState('42');
  const [inputError, setInputError] = useState<string | null>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [stackCapacity, setStackCapacity] = useState<number>(6);
  const [selectedCodeLang, setSelectedCodeLang] = useState<'pseudocode' | 'typescript'>('typescript');
  const [currentCommands, setCurrentCommands] = useState<StackCommand[]>(DEFAULT_STACK_COMMANDS);

  const presetSequences: PresetItem[] = useMemo(
    () => [
      {
        label: t('stack:presets.standard'),
        capacity: 6,
        commands: [
          { type: 'PUSH', value: 10 },
          { type: 'PUSH', value: 20 },
          { type: 'PUSH', value: 30 },
          { type: 'POP' },
          { type: 'PUSH', value: 40 },
        ],
      },
      {
        label: t('stack:presets.overflow'),
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
        label: t('stack:presets.underflow'),
        capacity: 5,
        commands: [
          { type: 'PUSH', value: 50 },
          { type: 'POP' },
          { type: 'POP' },
        ],
      },
      {
        label: t('stack:presets.peek'),
        capacity: 6,
        commands: [
          { type: 'PUSH', value: 12 },
          { type: 'PUSH', value: 24 },
          { type: 'PEEK' },
        ],
      },
    ],
    [t]
  );

  const pedagogicalPhases = useMemo(
    () => [
      {
        id: '01',
        name: t('pedagogy:phases.discover'),
        title: t('stack:phases.p01.title'),
        content: t('stack:phases.p01.content'),
      },
      {
        id: '02',
        name: t('pedagogy:phases.interact'),
        title: t('stack:phases.p02.title'),
        content: t('stack:phases.p02.content'),
      },
      {
        id: '03',
        name: t('pedagogy:phases.observe'),
        title: t('stack:phases.p03.title'),
        content: t('stack:phases.p03.content'),
      },
      {
        id: '04',
        name: t('pedagogy:phases.explain'),
        title: t('stack:phases.p04.title'),
        content: t('stack:phases.p04.content'),
      },
      {
        id: '05',
        name: t('pedagogy:phases.visualize'),
        title: t('stack:phases.p05.title'),
        content: t('stack:phases.p05.content'),
      },
      {
        id: '06',
        name: t('pedagogy:phases.pseudocode'),
        title: t('stack:phases.p06.title'),
        content: PSEUDOCODE_SNIPPET,
      },
      {
        id: '07',
        name: t('pedagogy:phases.code'),
        title: t('stack:phases.p07.title'),
        content: TYPESCRIPT_SNIPPET,
      },
      {
        id: '08',
        name: t('pedagogy:phases.modify'),
        title: t('stack:phases.p08.title'),
        content: t('stack:phases.p08.content'),
      },
      {
        id: '09',
        name: t('pedagogy:phases.practice'),
        title: t('stack:phases.p09.title'),
        content: t('stack:phases.p09.content'),
      },
      {
        id: '10',
        name: t('pedagogy:phases.challenge'),
        title: t('stack:phases.p10.title'),
        content: t('stack:phases.p10.content'),
      },
    ],
    [t]
  );

  const historyCountRef = useRef<number>(0);
  const transitionCountRef = useRef<number>(0);
  const historyIdRef = useRef<string>('stack-hist-0');
  const isMountedRef = useRef<boolean>(false);
  const [transitionContext, setTransitionContext] = useState<StackTransitionContext | undefined>(undefined);

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
    goToStep,
    loadSteps,
  } = useTimeTravelEngine<StackState>();

  const playbackSpeedRef = useRef<number>(600);
  const currentIndexRef = useRef<number>(currentIndex);
  currentIndexRef.current = currentIndex;

  const emitTransition = useCallback(
    (intent: StackNavigationIntent, targetStepIndex: number, newHistoryId?: string) => {
      if (newHistoryId) {
        historyIdRef.current = newHistoryId;
      }
      transitionCountRef.current += 1;
      setTransitionContext({
        historyId: historyIdRef.current,
        transitionId: transitionCountRef.current,
        intent,
        stepIndex: targetStepIndex,
        playbackSpeed: playbackSpeedRef.current,
      });
    },
    []
  );

  const handleManualNext = useCallback(() => {
    emitTransition('STEP_FORWARD', currentIndexRef.current + 1);
    handleNext();
  }, [emitTransition, handleNext]);

  const handlePlaybackStep = useCallback(() => {
    emitTransition('PLAY_FORWARD', currentIndexRef.current + 1);
    handleNext();
  }, [emitTransition, handleNext]);

  const handleManualPrevious = useCallback(() => {
    emitTransition('STEP_BACKWARD', Math.max(0, currentIndexRef.current - 1));
    handlePrevious();
  }, [emitTransition, handlePrevious]);

  const handleManualFirst = useCallback(() => {
    emitTransition('JUMP_FIRST', 0);
    handleFirst();
  }, [emitTransition, handleFirst]);

  const handleManualLast = useCallback(() => {
    emitTransition('JUMP_LAST', totalSteps - 1);
    handleLast();
  }, [emitTransition, totalSteps, handleLast]);

  const {
    isPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    handleTogglePlay,
    stopPlayback,
  } = usePlaybackTimer({
    onStepForward: handlePlaybackStep,
    onRewindToStart: handleManualFirst,
    isFinal: isLast,
    defaultSpeed: 600,
  });

  const handleManualSeek = useCallback(
    (index: number) => {
      stopPlayback();
      emitTransition('SEEK', index);
      goToStep(index);
    },
    [emitTransition, goToStep, stopPlayback]
  );

  const handleSpeedChange = useCallback(
    (speed: number) => {
      playbackSpeedRef.current = speed;
      setPlaybackSpeed(speed);
    },
    [setPlaybackSpeed]
  );

  const initController = useCallback(
    (commands: StackCommand[], capacity: number, targetIndex: number = 0) => {
      stopPlayback();
      const result = simulateStackOperations(commands, capacity);
      loadSteps(result.steps, targetIndex);
    },
    [stopPlayback, loadSteps]
  );

  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      historyCountRef.current += 1;
      const initialHistoryId = `stack-hist-${historyCountRef.current}`;
      setStackCapacity(6);
      setCurrentCommands(DEFAULT_STACK_COMMANDS);
      initController(DEFAULT_STACK_COMMANDS, 6, 0);
      emitTransition('INITIAL_MOUNT', 0, initialHistoryId);
    }
  }, [initController, emitTransition]);

  const handlePush = () => {
    const trimmed = pushInputText.trim();
    if (!trimmed || !Number.isFinite(Number(trimmed))) {
      setInputError(t('stack:invalidNumber', { value: pushInputText }));
      return;
    }

    setInputError(null);
    const val = Number(trimmed);
    historyCountRef.current += 1;
    const newHistId = `stack-hist-${historyCountRef.current}`;
    const executedCount = Math.min(currentIndexRef.current, currentCommands.length);
    const effectiveCommands = currentCommands.slice(0, executedCount);
    const newCommands: StackCommand[] = [...effectiveCommands, { type: 'PUSH', value: Math.round(val) }];
    const targetIndex = newCommands.length;
    setCurrentCommands(newCommands);
    initController(newCommands, stackCapacity, targetIndex);
    emitTransition('SANDBOX_PUSH', targetIndex, newHistId);
  };

  const handlePop = () => {
    setInputError(null);
    historyCountRef.current += 1;
    const newHistId = `stack-hist-${historyCountRef.current}`;
    const executedCount = Math.min(currentIndexRef.current, currentCommands.length);
    const effectiveCommands = currentCommands.slice(0, executedCount);
    const newCommands: StackCommand[] = [...effectiveCommands, { type: 'POP' }];
    const targetIndex = newCommands.length;
    setCurrentCommands(newCommands);
    initController(newCommands, stackCapacity, targetIndex);
    emitTransition('SANDBOX_POP', targetIndex, newHistId);
  };

  const handlePeek = () => {
    setInputError(null);
    historyCountRef.current += 1;
    const newHistId = `stack-hist-${historyCountRef.current}`;
    const executedCount = Math.min(currentIndexRef.current, currentCommands.length);
    const effectiveCommands = currentCommands.slice(0, executedCount);
    const newCommands: StackCommand[] = [...effectiveCommands, { type: 'PEEK' }];
    const targetIndex = newCommands.length;
    setCurrentCommands(newCommands);
    initController(newCommands, stackCapacity, targetIndex);
    emitTransition('SANDBOX_PEEK', targetIndex, newHistId);
  };

  const handleClear = () => {
    setInputError(null);
    historyCountRef.current += 1;
    const newHistId = `stack-hist-${historyCountRef.current}`;
    const newCommands: StackCommand[] = [];
    setCurrentCommands(newCommands);
    initController(newCommands, stackCapacity, 0);
    emitTransition('SANDBOX_CLEAR', 0, newHistId);
  };

  const handlePresetSelect = (preset: PresetItem) => {
    setInputError(null);
    historyCountRef.current += 1;
    const newHistId = `stack-hist-${historyCountRef.current}`;
    setStackCapacity(preset.capacity);
    setCurrentCommands(preset.commands);
    initController(preset.commands, preset.capacity, 0);
    emitTransition('LOAD_PRESET', 0, newHistId);
  };

  const handleCapacityChange = (cap: number) => {
    historyCountRef.current += 1;
    const newHistId = `stack-hist-${historyCountRef.current}`;
    const targetIndex = Math.min(currentIndexRef.current, currentCommands.length);
    setStackCapacity(cap);
    initController(currentCommands, cap, targetIndex);
    emitTransition('CAPACITY_CHANGE', targetIndex, newHistId);
  };

  const handleResetWithStop = () => {
    stopPlayback();
    emitTransition('RESET', 0);
    handleReset();
  };

  useTimeTravelKeyboard({
    onNext: handleManualNext,
    onPrevious: handleManualPrevious,
    onFirst: handleManualFirst,
    onLast: handleManualLast,
    onTogglePlay: handleTogglePlay,
    onReset: handleResetWithStop,
  });

  const currentAction = currentStep?.action || 'INITIALIZE';
  const stateData = currentStep?.state || { items: [], topIndex: -1, capacity: stackCapacity };

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
    <>
      <A11yAnnouncer message={currentStep?.a11yMessage} />
      <LabShell
        category={t('stack:category')}
        title={t('stack:title')}
        subtitle={t('stack:subtitle')}
        visualizationSlot={
          <StackVisualizerAdapter
            step={currentStep}
            viewBoxWidth={800}
            viewBoxHeight={360}
            transitionContext={transitionContext}
          />
        }
        codeSlot={
          <div className="code-stage-container">
            <div className="panel-header">
              <span className="panel-title">{t('common:algorithmCode')}</span>
              <div className="code-lang-selector">
                <Button
                  variant={selectedCodeLang === 'pseudocode' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCodeLang('pseudocode')}
                >
                  {t('common:pseudocode')}
                </Button>
                <Button
                  variant={selectedCodeLang === 'typescript' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCodeLang('typescript')}
                >
                  {t('common:typescript')}
                </Button>
              </div>
            </div>
            <div className="code-stage-body">
              <CodeViewer
                code={selectedCodeLang === 'pseudocode' ? PSEUDOCODE_SNIPPET : TYPESCRIPT_SNIPPET}
                language={selectedCodeLang}
                activeLine={
                  selectedCodeLang === 'pseudocode'
                    ? currentStep?.codeHighlight?.pseudocodeLine
                    : currentStep?.codeHighlight?.typescriptLine
                }
              />
            </div>
          </div>
        }
        timeTravelSlot={
          <TimeTravelControls
            isPlaying={isPlaying}
            currentIndex={currentIndex}
            totalSteps={totalSteps}
            playbackSpeed={playbackSpeed}
            onFirst={handleManualFirst}
            onPrevious={handleManualPrevious}
            onTogglePlay={handleTogglePlay}
            onNext={handleManualNext}
            onLast={handleManualLast}
            onReset={handleResetWithStop}
            onSpeedChange={handleSpeedChange}
            onSeek={handleManualSeek}
          />
        }
        controlsSlot={
          <div className="control-group">
            <div className="control-group">
              <span className="control-label">{t('stack:operationsLabel')}</span>
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
                  placeholder={t('stack:pushInputPlaceholder')}
                  aria-label={t('stack:pushInputAria')}
                  className="array-input-field"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handlePush}
                  aria-label={t('stack:pushBtnAria')}
                >
                  {t('stack:pushBtn')}
                </Button>
              </div>

              <div className="control-actions">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePop}
                  aria-label={t('stack:popBtnAria')}
                >
                  {t('stack:popBtn')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePeek}
                  aria-label={t('stack:peekBtnAria')}
                >
                  {t('stack:peekBtn')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  aria-label={t('stack:clearBtnAria')}
                >
                  {t('stack:clearBtn')}
                </Button>
              </div>

              {inputError && (
                <Badge variant="rose" className="input-error-badge">
                  {inputError}
                </Badge>
              )}

              <div className="speed-control-row">
                <span className="control-label">{t('common:capacity')}</span>
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
                {presetSequences.map((p) => (
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
          </div>
        }
        inspectorSlot={
          <Card title={t('stack:inspector.title')}>
            <div className="inspector-list">
              <div>
                <span className="inspector-label">{t('common:action')} </span>
                <Badge variant={getActionBadgeVariant(currentAction)}>
                  {currentAction}
                </Badge>
              </div>
              <div>
                <span className="inspector-label">{t('common:stepIndex')} </span>
                <span className="inspector-val-index">
                  {totalSteps > 0 ? currentIndex + 1 : 0} / {totalSteps}
                </span>
              </div>
              <div>
                <span className="inspector-label">{t('stack:inspector.itemsInStack')} </span>
                <span className="inspector-val-total">
                  {stateData.items.length} / {stateData.capacity}
                </span>
              </div>
              <div>
                <span className="inspector-label">{t('stack:inspector.topElement')} </span>
                <span className="inspector-val-index">
                  {stateData.topIndex >= 0 ? `${stateData.items[stateData.topIndex]} (idx: ${stateData.topIndex})` : t('stack:inspector.nullEmpty')}
                </span>
              </div>
              <div>
                <span className="inspector-label">{t('common:status')} </span>
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
                    ? t('stack:inspector.statusOverflow')
                    : currentAction === 'UNDERFLOW'
                      ? t('stack:inspector.statusUnderflow')
                      : stateData.items.length === 0
                        ? t('stack:inspector.statusEmpty')
                        : stateData.items.length === stateData.capacity
                          ? t('stack:inspector.statusFull')
                          : t('stack:inspector.statusNormal')}
                </span>
              </div>
            </div>
          </Card>
        }
        knowledgeSlot={
          <PedagogicalKnowledgePanel
            phases={pedagogicalPhases}
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
