import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { simulateQueueOperations, QueueCommand } from '@/core/algorithms';
import { QueueState } from '@/core/data-structures/queue';
import {
  QueueVisualizerAdapter,
  QueueTransitionContext,
  QueueNavigationIntent,
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
  id: string;
  label: string;
  commands: QueueCommand[];
  capacity: number;
}

const PSEUDOCODE_SNIPPET = `procedure enqueue(queue: Queue, value: Item)
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
end procedure`;

const TYPESCRIPT_SNIPPET = `export class BoundedQueue<T> {
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
}`;

const PRESET_COMMANDS: { id: 'standard' | 'wrapAround' | 'overflow' | 'underflow' | 'peek'; capacity: number; commands: QueueCommand[] }[] = [
  {
    id: 'standard',
    capacity: 6,
    commands: [
      { type: 'ENQUEUE', value: 10 },
      { type: 'ENQUEUE', value: 20 },
      { type: 'ENQUEUE', value: 30 },
      { type: 'DEQUEUE' },
      { type: 'ENQUEUE', value: 40 },
    ],
  },
  {
    id: 'wrapAround',
    capacity: 5,
    commands: [
      { type: 'ENQUEUE', value: 10 },
      { type: 'ENQUEUE', value: 20 },
      { type: 'ENQUEUE', value: 30 },
      { type: 'ENQUEUE', value: 40 },
      { type: 'ENQUEUE', value: 50 },
      { type: 'DEQUEUE' },
      { type: 'DEQUEUE' },
      { type: 'ENQUEUE', value: 60 },
      { type: 'ENQUEUE', value: 70 },
    ],
  },
  {
    id: 'overflow',
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
    id: 'underflow',
    capacity: 5,
    commands: [
      { type: 'ENQUEUE', value: 50 },
      { type: 'DEQUEUE' },
      { type: 'DEQUEUE' },
    ],
  },
  {
    id: 'peek',
    capacity: 6,
    commands: [
      { type: 'ENQUEUE', value: 12 },
      { type: 'ENQUEUE', value: 24 },
      { type: 'PEEK_FRONT' },
    ],
  },
];

export const QueueLab: React.FC = () => {
  const { t } = useTranslation(['queue', 'pedagogy', 'common']);
  const isMountedRef = useRef(false);

  const presetSequences = useMemo<PresetItem[]>(
    () =>
      PRESET_COMMANDS.map((p) => ({
        id: p.id,
        label: t(`queue:presets.${p.id}`),
        capacity: p.capacity,
        commands: p.commands,
      })),
    [t]
  );

  const pedagogicalPhases = useMemo(
    () => [
      {
        id: '01',
        name: t('pedagogy:phases.discover'),
        title: t('queue:phases.p01.title'),
        content: t('queue:phases.p01.content'),
      },
      {
        id: '02',
        name: t('pedagogy:phases.interact'),
        title: t('queue:phases.p02.title'),
        content: t('queue:phases.p02.content'),
      },
      {
        id: '03',
        name: t('pedagogy:phases.observe'),
        title: t('queue:phases.p03.title'),
        content: t('queue:phases.p03.content'),
      },
      {
        id: '04',
        name: t('pedagogy:phases.explain'),
        title: t('queue:phases.p04.title'),
        content: t('queue:phases.p04.content'),
      },
      {
        id: '05',
        name: t('pedagogy:phases.visualize'),
        title: t('queue:phases.p05.title'),
        content: t('queue:phases.p05.content'),
      },
      {
        id: '06',
        name: t('pedagogy:phases.pseudocode'),
        title: t('queue:phases.p06.title'),
        content: PSEUDOCODE_SNIPPET,
      },
      {
        id: '07',
        name: t('pedagogy:phases.code'),
        title: t('queue:phases.p07.title'),
        content: TYPESCRIPT_SNIPPET,
      },
      {
        id: '08',
        name: t('pedagogy:phases.modify'),
        title: t('queue:phases.p08.title'),
        content: t('queue:phases.p08.content'),
      },
      {
        id: '09',
        name: t('pedagogy:phases.practice'),
        title: t('queue:phases.p09.title'),
        content: t('queue:phases.p09.content'),
      },
      {
        id: '10',
        name: t('pedagogy:phases.challenge'),
        title: t('queue:phases.p10.title'),
        content: t('queue:phases.p10.content'),
      },
    ],
    [t]
  );

  const [enqueueInputText, setEnqueueInputText] = useState('42');
  const [inputError, setInputError] = useState<string | null>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [queueCapacity, setQueueCapacity] = useState<number>(6);
  const [selectedCodeLang, setSelectedCodeLang] = useState<'pseudocode' | 'typescript'>('typescript');
  const [currentCommands, setCurrentCommands] = useState<QueueCommand[]>(PRESET_COMMANDS[0]?.commands || []);

  const historyCountRef = useRef<number>(0);
  const transitionCountRef = useRef<number>(0);
  const historyIdRef = useRef<string>('queue-hist-0');
  const [transitionContext, setTransitionContext] = useState<QueueTransitionContext | undefined>(undefined);

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
  } = useTimeTravelEngine<QueueState>();

  const playbackSpeedRef = useRef<number>(600);
  const currentIndexRef = useRef<number>(currentIndex);
  currentIndexRef.current = currentIndex;

  const emitTransition = useCallback(
    (intent: QueueNavigationIntent, targetStepIndex: number, newHistoryId?: string) => {
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

  const onNavigateNext = useCallback(() => {
    emitTransition('STEP_FORWARD', currentIndexRef.current + 1);
    handleNext();
  }, [emitTransition, handleNext]);

  const onNavigatePrevious = useCallback(() => {
    emitTransition('STEP_BACKWARD', currentIndexRef.current - 1);
    handlePrevious();
  }, [emitTransition, handlePrevious]);

  const onNavigateFirst = useCallback(() => {
    emitTransition('JUMP_FIRST', 0);
    handleFirst();
  }, [emitTransition, handleFirst]);

  const onNavigateLast = useCallback(() => {
    emitTransition('JUMP_LAST', totalSteps - 1);
    handleLast();
  }, [emitTransition, handleLast, totalSteps]);

  const onPlaybackStepForward = useCallback(() => {
    emitTransition('PLAY_FORWARD', currentIndexRef.current + 1);
    handleNext();
  }, [emitTransition, handleNext]);

  const {
    isPlaying,
    playbackSpeed,
    setPlaybackSpeed,
    handleTogglePlay,
    stopPlayback,
  } = usePlaybackTimer({
    onStepForward: onPlaybackStepForward,
    onRewindToStart: onNavigateFirst,
    isFinal: isLast,
    defaultSpeed: 600,
  });

  playbackSpeedRef.current = playbackSpeed;

  const onNavigateSeek = useCallback(
    (index: number) => {
      stopPlayback();
      emitTransition('SEEK', index);
      goToStep(index);
    },
    [emitTransition, goToStep, stopPlayback]
  );

  const initController = useCallback(
    (commands: QueueCommand[], capacity: number, targetIndex: number = 0) => {
      stopPlayback();
      const result = simulateQueueOperations(commands, capacity);
      loadSteps(result.steps, targetIndex);
    },
    [stopPlayback, loadSteps]
  );

  useEffect(() => {
    if (isMountedRef.current) return;
    isMountedRef.current = true;
    const defaultPreset = PRESET_COMMANDS[0];
    if (defaultPreset) {
      setQueueCapacity(defaultPreset.capacity);
      setCurrentCommands(defaultPreset.commands);
      initController(defaultPreset.commands, defaultPreset.capacity, 0);
    }
  }, [initController]);

  const handleEnqueue = () => {
    const trimmed = enqueueInputText.trim();
    if (!trimmed || !Number.isFinite(Number(trimmed))) {
      setInputError(t('queue:invalidNumber', { value: enqueueInputText }));
      return;
    }

    setInputError(null);
    const val = Number(trimmed);
    const executedCount = Math.min(currentIndex, currentCommands.length);
    const effectiveCommands = currentCommands.slice(0, executedCount);
    const newCommands: QueueCommand[] = [...effectiveCommands, { type: 'ENQUEUE', value: Math.round(val) }];
    const targetIndex = newCommands.length;
    emitTransition('SANDBOX_ENQUEUE', targetIndex);
    setCurrentCommands(newCommands);
    initController(newCommands, queueCapacity, targetIndex);
  };

  const handleDequeue = () => {
    setInputError(null);
    const executedCount = Math.min(currentIndex, currentCommands.length);
    const effectiveCommands = currentCommands.slice(0, executedCount);
    const newCommands: QueueCommand[] = [...effectiveCommands, { type: 'DEQUEUE' }];
    const targetIndex = newCommands.length;
    emitTransition('SANDBOX_DEQUEUE', targetIndex);
    setCurrentCommands(newCommands);
    initController(newCommands, queueCapacity, targetIndex);
  };

  const handlePeekFront = () => {
    setInputError(null);
    const executedCount = Math.min(currentIndex, currentCommands.length);
    const effectiveCommands = currentCommands.slice(0, executedCount);
    const newCommands: QueueCommand[] = [...effectiveCommands, { type: 'PEEK_FRONT' }];
    const targetIndex = newCommands.length;
    emitTransition('SANDBOX_PEEK', targetIndex);
    setCurrentCommands(newCommands);
    initController(newCommands, queueCapacity, targetIndex);
  };

  const handleClear = () => {
    setInputError(null);
    const newCommands: QueueCommand[] = [];
    emitTransition('SANDBOX_CLEAR', 0);
    setCurrentCommands(newCommands);
    initController(newCommands, queueCapacity, 0);
  };

  const handlePresetSelect = (preset: PresetItem) => {
    historyCountRef.current += 1;
    const nextHistoryId = `queue-hist-${historyCountRef.current}`;
    emitTransition('LOAD_PRESET', 0, nextHistoryId);
    setInputError(null);
    setQueueCapacity(preset.capacity);
    setCurrentCommands(preset.commands);
    initController(preset.commands, preset.capacity, 0);
  };

  const handleCapacityChange = (cap: number) => {
    const targetIndex = Math.min(currentIndex, currentCommands.length);
    emitTransition('CAPACITY_CHANGE', targetIndex);
    setQueueCapacity(cap);
    initController(currentCommands, cap, targetIndex);
  };

  const handleResetWithStop = () => {
    emitTransition('RESET', 0);
    stopPlayback();
    handleReset();
  };

  useTimeTravelKeyboard({
    onNext: onNavigateNext,
    onPrevious: onNavigatePrevious,
    onFirst: onNavigateFirst,
    onLast: onNavigateLast,
    onTogglePlay: handleTogglePlay,
    onReset: handleResetWithStop,
  });

  const currentAction = currentStep?.action || 'INITIALIZE';
  const stateData: QueueState = currentStep?.state || {
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
        category={t('queue:category')}
        title={t('queue:title')}
        subtitle={t('queue:subtitle')}
        visualizationSlot={
          <QueueVisualizerAdapter
            step={currentStep}
            transitionContext={transitionContext}
            viewBoxWidth={800}
            viewBoxHeight={360}
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
            onFirst={onNavigateFirst}
            onPrevious={onNavigatePrevious}
            onTogglePlay={handleTogglePlay}
            onNext={onNavigateNext}
            onLast={onNavigateLast}
            onReset={handleResetWithStop}
            onSpeedChange={setPlaybackSpeed}
            onSeek={onNavigateSeek}
          />
        }
        controlsSlot={
          <div className="control-group">
            <div className="control-group">
              <span className="control-label">{t('queue:operationsLabel')}</span>
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
                  placeholder={t('queue:enqueueInputPlaceholder')}
                  aria-label={t('queue:enqueueInputAria')}
                  className="array-input-field"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleEnqueue}
                  aria-label={t('queue:enqueueBtnAria')}
                >
                  {t('queue:enqueueBtn')}
                </Button>
              </div>

              <div className="control-actions">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDequeue}
                  aria-label={t('queue:dequeueBtnAria')}
                >
                  {t('queue:dequeueBtn')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePeekFront}
                  aria-label={t('queue:peekBtnAria')}
                >
                  {t('queue:peekBtn')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  aria-label={t('queue:clearBtnAria')}
                >
                  {t('queue:clearBtn')}
                </Button>
              </div>

              {inputError && (
                <Badge variant="rose" className="input-error-badge">
                  {inputError}
                </Badge>
              )}

              <div className="speed-control-row">
                <span className="control-label">{t('queue:capacityLabel')}</span>
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
                {presetSequences.map((p) => (
                  <Button
                    key={p.id}
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
          <Card title={t('queue:inspector.title')}>
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
                <span className="inspector-label">{t('queue:inspector.itemsInQueue')} </span>
                <span className="inspector-val-total">
                  {stateData.count} / {stateData.capacity}
                </span>
              </div>
              <div>
                <span className="inspector-label">{t('queue:inspector.frontElement')} </span>
                <span className="inspector-val-index">
                  {stateData.frontIndex >= 0 && stateData.buffer[stateData.frontIndex] !== null
                    ? `${stateData.buffer[stateData.frontIndex]} (${t('queue:inspector.slot', { index: stateData.frontIndex })})`
                    : t('queue:inspector.nullEmpty')}
                </span>
              </div>
              <div>
                <span className="inspector-label">{t('queue:inspector.rearElement')} </span>
                <span className="inspector-val-index">
                  {stateData.rearIndex >= 0 && stateData.buffer[stateData.rearIndex] !== null
                    ? `${stateData.buffer[stateData.rearIndex]} (${t('queue:inspector.slot', { index: stateData.rearIndex })})`
                    : t('queue:inspector.nullEmpty')}
                </span>
              </div>
              <div>
                <span className="inspector-label">{t('common:status')} </span>
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
                    ? t('queue:inspector.statusOverflow')
                    : currentAction === 'UNDERFLOW'
                      ? t('queue:inspector.statusUnderflow')
                      : stateData.count === 0
                        ? t('queue:inspector.statusEmpty')
                        : stateData.count === stateData.capacity
                          ? t('queue:inspector.statusFull')
                          : t('queue:inspector.statusNormal')}
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
