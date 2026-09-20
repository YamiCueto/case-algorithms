import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { simulateLinkedListOperations, LinkedListCommand } from '@/core/algorithms';
import { LinkedListState } from '@/core/data-structures/linked-list';
import { LinkedListVisualizerAdapter } from '@/components/visualizer';
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
  initialItems: number[];
  commands: LinkedListCommand[];
}

const PSEUDOCODE_SNIPPET = `procedure prepend(list: LinkedList, value: Item)
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
end procedure`;

const TYPESCRIPT_SNIPPET = `export class SinglyLinkedList<T> {
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
}`;

const PRESET_COMMANDS: { id: 'prependAppend' | 'removal' | 'search'; initialItems: number[]; commands: LinkedListCommand[] }[] = [
  {
    id: 'prependAppend',
    initialItems: [10, 20, 30, 40],
    commands: [
      { type: 'PREPEND', value: 5 },
      { type: 'PREPEND', value: 2 },
      { type: 'APPEND', value: 8 },
      { type: 'APPEND', value: 12 },
    ],
  },
  {
    id: 'removal',
    initialItems: [10, 20, 30, 40],
    commands: [
      { type: 'REMOVE_AT', index: 1 },
      { type: 'REMOVE_AT', index: 0 },
    ],
  },
  {
    id: 'search',
    initialItems: [11, 22, 33, 44],
    commands: [
      { type: 'FIND', value: 33 },
    ],
  },
];

export const LinkedListLab: React.FC = () => {
  const { t } = useTranslation(['linkedList', 'pedagogy', 'common']);
  const isMountedRef = useRef(false);

  const presetSequences = useMemo<PresetItem[]>(
    () =>
      PRESET_COMMANDS.map((p) => ({
        id: p.id,
        label: t(`linkedList:presets.${p.id}`),
        initialItems: p.initialItems,
        commands: p.commands,
      })),
    [t]
  );

  const pedagogicalPhases = useMemo(
    () => [
      {
        id: '01',
        name: t('pedagogy:phases.discover'),
        title: t('linkedList:phases.p01.title'),
        content: t('linkedList:phases.p01.content'),
      },
      {
        id: '02',
        name: t('pedagogy:phases.interact'),
        title: t('linkedList:phases.p02.title'),
        content: t('linkedList:phases.p02.content'),
      },
      {
        id: '03',
        name: t('pedagogy:phases.observe'),
        title: t('linkedList:phases.p03.title'),
        content: t('linkedList:phases.p03.content'),
      },
      {
        id: '04',
        name: t('pedagogy:phases.explain'),
        title: t('linkedList:phases.p04.title'),
        content: t('linkedList:phases.p04.content'),
      },
      {
        id: '05',
        name: t('pedagogy:phases.visualize'),
        title: t('linkedList:phases.p05.title'),
        content: t('linkedList:phases.p05.content'),
      },
      {
        id: '06',
        name: t('pedagogy:phases.pseudocode'),
        title: t('linkedList:phases.p06.title'),
        content: PSEUDOCODE_SNIPPET,
      },
      {
        id: '07',
        name: t('pedagogy:phases.code'),
        title: t('linkedList:phases.p07.title'),
        content: TYPESCRIPT_SNIPPET,
      },
      {
        id: '08',
        name: t('pedagogy:phases.modify'),
        title: t('linkedList:phases.p08.title'),
        content: t('linkedList:phases.p08.content'),
      },
      {
        id: '09',
        name: t('pedagogy:phases.practice'),
        title: t('linkedList:phases.p09.title'),
        content: t('linkedList:phases.p09.content'),
      },
      {
        id: '10',
        name: t('pedagogy:phases.challenge'),
        title: t('linkedList:phases.p10.title'),
        content: t('linkedList:phases.p10.content'),
      },
    ],
    [t]
  );

  const [nodeValueText, setNodeValueText] = useState('42');
  const [nodeIndexText, setNodeIndexText] = useState('0');
  const [inputError, setInputError] = useState<string | null>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [selectedCodeLang, setSelectedCodeLang] = useState<'pseudocode' | 'typescript'>('typescript');
  const [currentInitialItems, setCurrentInitialItems] = useState<number[]>([10, 20, 30, 40]);
  const [currentCommands, setCurrentCommands] = useState<LinkedListCommand[]>(
    PRESET_COMMANDS[0]?.commands || []
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
    (commands: LinkedListCommand[], items: number[], selectLastStep: boolean = false) => {
      stopPlayback();
      const result = simulateLinkedListOperations(commands, items);
      const targetIndex =
        selectLastStep && result.steps.length > 2
          ? result.steps.length - 2
          : selectLastStep && result.steps.length > 1
            ? result.steps.length - 1
            : 0;
      loadSteps(result.steps, targetIndex);
    },
    [stopPlayback, loadSteps]
  );

  useEffect(() => {
    if (isMountedRef.current) return;
    isMountedRef.current = true;
    const defaultPreset = PRESET_COMMANDS[0];
    if (defaultPreset) {
      setCurrentInitialItems(defaultPreset.initialItems);
      setCurrentCommands(defaultPreset.commands);
      initController(defaultPreset.commands, defaultPreset.initialItems, false);
    }
  }, [initController]);

  const parseValue = (): number | null => {
    const trimmed = nodeValueText.trim();
    if (!trimmed || !Number.isFinite(Number(trimmed))) {
      setInputError(t('linkedList:errors.invalidValue', { value: nodeValueText }));
      return null;
    }
    return Math.round(Number(trimmed));
  };

  const parseIndex = (): number | null => {
    const trimmed = nodeIndexText.trim();
    if (!trimmed || !Number.isInteger(Number(trimmed))) {
      setInputError(t('linkedList:errors.invalidIndex', { index: nodeIndexText }));
      return null;
    }
    return Number(trimmed);
  };

  const getExecutedCommands = (): LinkedListCommand[] => {
    if (!currentStep) return [];
    const { commandIndex } = currentStep.state;
    if (commandIndex === undefined || commandIndex < 0) {
      return [];
    }
    const count = currentStep.action === 'TRAVERSE' ? commandIndex : commandIndex + 1;
    return currentCommands.slice(0, Math.min(count, currentCommands.length));
  };

  const handlePrepend = () => {
    const val = parseValue();
    if (val === null) return;
    setInputError(null);
    const effectiveCommands = getExecutedCommands();
    const newCommands: LinkedListCommand[] = [
      ...effectiveCommands,
      { type: 'PREPEND', value: val },
    ];
    setCurrentCommands(newCommands);
    initController(newCommands, currentInitialItems, true);
  };

  const handleAppend = () => {
    const val = parseValue();
    if (val === null) return;
    setInputError(null);
    const effectiveCommands = getExecutedCommands();
    const newCommands: LinkedListCommand[] = [
      ...effectiveCommands,
      { type: 'APPEND', value: val },
    ];
    setCurrentCommands(newCommands);
    initController(newCommands, currentInitialItems, true);
  };

  const handleInsertAt = () => {
    const val = parseValue();
    const idx = parseIndex();
    if (val === null || idx === null) return;
    setInputError(null);
    const effectiveCommands = getExecutedCommands();
    const newCommands: LinkedListCommand[] = [
      ...effectiveCommands,
      { type: 'INSERT_AT', index: idx, value: val },
    ];
    setCurrentCommands(newCommands);
    initController(newCommands, currentInitialItems, true);
  };

  const handleRemoveAt = () => {
    const idx = parseIndex();
    if (idx === null) return;
    setInputError(null);
    const effectiveCommands = getExecutedCommands();
    const newCommands: LinkedListCommand[] = [
      ...effectiveCommands,
      { type: 'REMOVE_AT', index: idx },
    ];
    setCurrentCommands(newCommands);
    initController(newCommands, currentInitialItems, true);
  };

  const handleFind = () => {
    const val = parseValue();
    if (val === null) return;
    setInputError(null);
    const effectiveCommands = getExecutedCommands();
    const newCommands: LinkedListCommand[] = [
      ...effectiveCommands,
      { type: 'FIND', value: val },
    ];
    setCurrentCommands(newCommands);
    initController(newCommands, currentInitialItems, true);
  };

  const handleClear = () => {
    setInputError(null);
    const newCommands: LinkedListCommand[] = [];
    setCurrentCommands(newCommands);
    setCurrentInitialItems([]);
    initController(newCommands, [], false);
  };

  const handlePresetSelect = (preset: PresetItem) => {
    setInputError(null);
    setCurrentInitialItems(preset.initialItems);
    setCurrentCommands(preset.commands);
    initController(preset.commands, preset.initialItems, false);
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
  const stateData: LinkedListState = currentStep?.state || {
    nodes: [],
    headId: null,
    tailId: null,
    size: 0,
  };

  const headNode = stateData.nodes.find((n) => n.id === stateData.headId);
  const tailNode = stateData.nodes.find((n) => n.id === stateData.tailId);

  const getActionBadgeVariant = (action: string) => {
    switch (action) {
      case 'PREPEND':
      case 'APPEND':
      case 'INSERT_AT':
      case 'INSERT':
        return 'cyan';
      case 'REMOVE_AT':
      case 'DELETE':
        return 'rose';
      case 'FOUND':
        return 'emerald';
      case 'SEARCH':
      case 'TRAVERSE':
      case 'VISIT':
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

  return (
    <>
      <A11yAnnouncer message={currentStep?.a11yMessage} />
      <LabShell
        category={t('linkedList:category')}
        title={t('linkedList:title')}
        subtitle={t('linkedList:subtitle')}
        visualizationSlot={
          <LinkedListVisualizerAdapter
            step={currentStep}
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
            onFirst={handleFirst}
            onPrevious={handlePrevious}
            onTogglePlay={handleTogglePlay}
            onNext={handleNext}
            onLast={handleLast}
            onReset={handleResetWithStop}
            onSpeedChange={setPlaybackSpeed}
          />
        }
        controlsSlot={
          <div className="control-group">
            <div className="control-group">
              <span className="control-label">{t('linkedList:operationsLabel')}</span>
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
                  placeholder={t('linkedList:valuePlaceholder')}
                  aria-label={t('linkedList:valueAria')}
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
                  placeholder={t('linkedList:indexPlaceholder')}
                  aria-label={t('linkedList:indexAria')}
                  className="array-input-field"
                />
              </div>

              <div className="control-actions">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handlePrepend}
                  aria-label={t('linkedList:prependBtnAria')}
                >
                  {t('linkedList:prependBtn')}
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAppend}
                  aria-label={t('linkedList:appendBtnAria')}
                >
                  {t('linkedList:appendBtn')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleInsertAt}
                  aria-label={t('linkedList:insertAtBtnAria')}
                >
                  {t('linkedList:insertAtBtn')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveAt}
                  aria-label={t('linkedList:removeAtBtnAria')}
                >
                  {t('linkedList:removeAtBtn')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFind}
                  aria-label={t('linkedList:findBtnAria')}
                >
                  {t('linkedList:findBtn')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClear}
                  aria-label={t('linkedList:clearBtnAria')}
                >
                  {t('linkedList:clearBtn')}
                </Button>
              </div>

              {inputError && (
                <Badge variant="rose" className="input-error-badge">
                  {inputError}
                </Badge>
              )}

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
          <Card title={t('linkedList:inspector.title')}>
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
                <span className="inspector-label">{t('linkedList:inspector.listSize')} </span>
                <span className="inspector-val-total">
                  {t('linkedList:inspector.nodeCount', { count: stateData.size })}
                </span>
              </div>
              <div>
                <span className="inspector-label">{t('linkedList:inspector.headNode')} </span>
                <span className="inspector-val-index">
                  {headNode ? `${headNode.value} (id: ${headNode.id})` : 'null'}
                </span>
              </div>
              <div>
                <span className="inspector-label">{t('linkedList:inspector.tailNode')} </span>
                <span className="inspector-val-index">
                  {tailNode ? `${tailNode.value} (id: ${tailNode.id})` : 'null'}
                </span>
              </div>
              <div>
                <span className="inspector-label">{t('common:status')} </span>
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
                    ? t('linkedList:inspector.statusIndexError')
                    : currentAction === 'NOT_FOUND'
                      ? t('linkedList:inspector.statusNotFound')
                      : currentAction === 'FOUND'
                        ? t('linkedList:inspector.statusFound')
                        : stateData.size === 0
                          ? t('linkedList:inspector.statusEmpty')
                          : t('linkedList:inspector.statusNormal')}
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
