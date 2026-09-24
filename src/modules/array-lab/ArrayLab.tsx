import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { bubbleSort } from '@/core/algorithms';
import { ArrayState } from '@/core/data-structures/array';
import {
  ArrayVisualizerAdapter,
  ArrayTransitionContext,
  ArrayNavigationIntent,
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

const PSEUDOCODE_SNIPPET = `procedure bubbleSort(A: list of sortable items)
  n := length(A)
  for i from 0 to n-1 do
    swapped := false
    for j from 0 to n-2-i do
      if A[j] > A[j+1] then
        swap(A[j], A[j+1])
        swapped := true
      end if
    end for
    if not swapped then
      break
    end if
  end for
end procedure`;

const TYPESCRIPT_SNIPPET = `export function bubbleSort(arr: number[]): number[] {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        const temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;
        swapped = true;
      }
    }
    if (!swapped) {
      break;
    }
  }
  return a;
}`;

export const ArrayLab: React.FC = () => {
  const { t } = useTranslation(['array', 'pedagogy', 'common']);
  const [inputArrayText, setInputArrayText] = useState('5, 1, 4, 2, 8');
  const [inputError, setInputError] = useState<string | null>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [selectedCodeLang, setSelectedCodeLang] = useState<'pseudocode' | 'typescript'>('pseudocode');

  const presetArrays = useMemo(
    () => [
      { label: t('array:presets.default'), array: [5, 1, 4, 2, 8] },
      { label: t('array:presets.reverse'), array: [5, 4, 3, 2, 1] },
      { label: t('array:presets.sorted'), array: [1, 2, 3, 4, 5] },
      { label: t('array:presets.mixed'), array: [12, 7, 19, 3, 25, 1] },
    ],
    [t]
  );

  const pedagogicalPhases = useMemo(
    () => [
      {
        id: '01',
        name: t('pedagogy:phases.discover'),
        title: t('array:phases.p01.title'),
        content: t('array:phases.p01.content'),
      },
      {
        id: '02',
        name: t('pedagogy:phases.interact'),
        title: t('array:phases.p02.title'),
        content: t('array:phases.p02.content'),
      },
      {
        id: '03',
        name: t('pedagogy:phases.observe'),
        title: t('array:phases.p03.title'),
        content: t('array:phases.p03.content'),
      },
      {
        id: '04',
        name: t('pedagogy:phases.explain'),
        title: t('array:phases.p04.title'),
        content: t('array:phases.p04.content'),
      },
      {
        id: '05',
        name: t('pedagogy:phases.visualize'),
        title: t('array:phases.p05.title'),
        content: t('array:phases.p05.content'),
      },
      {
        id: '06',
        name: t('pedagogy:phases.pseudocode'),
        title: t('array:phases.p06.title'),
        content: PSEUDOCODE_SNIPPET,
      },
      {
        id: '07',
        name: t('pedagogy:phases.code'),
        title: t('array:phases.p07.title'),
        content: TYPESCRIPT_SNIPPET,
      },
      {
        id: '08',
        name: t('pedagogy:phases.modify'),
        title: t('array:phases.p08.title'),
        content: t('array:phases.p08.content'),
      },
      {
        id: '09',
        name: t('pedagogy:phases.practice'),
        title: t('array:phases.p09.title'),
        content: t('array:phases.p09.content'),
      },
      {
        id: '10',
        name: t('pedagogy:phases.challenge'),
        title: t('array:phases.p10.title'),
        content: t('array:phases.p10.content'),
      },
    ],
    [t]
  );

  const historyCountRef = useRef<number>(0);
  const transitionCountRef = useRef<number>(0);
  const historyIdRef = useRef<string>('array-hist-0');
  const [transitionContext, setTransitionContext] = useState<ArrayTransitionContext | undefined>(undefined);

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
  } = useTimeTravelEngine<ArrayState>();

  const playbackSpeedRef = useRef<number>(600);
  const currentIndexRef = useRef<number>(currentIndex);
  currentIndexRef.current = currentIndex;

  const emitTransition = useCallback(
    (intent: ArrayNavigationIntent, targetStepIndex: number, newHistoryId?: string) => {
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

  const parseNumbers = (text: string): { numbers: number[]; error: string | null } => {
    const rawTokens = text.split(',').map((t) => t.trim()).filter(Boolean);
    if (rawTokens.length === 0) {
      return { numbers: [], error: t('array:errors.empty') };
    }
    if (rawTokens.length > 14) {
      return { numbers: [], error: t('array:errors.max') };
    }

    const numbers: number[] = [];
    for (const token of rawTokens) {
      const val = Number(token);
      if (!Number.isFinite(val)) {
        return { numbers: [], error: t('array:errors.invalid', { token }) };
      }
      numbers.push(Math.round(val));
    }

    return { numbers, error: null };
  };

  const {
    isPlaying,
    playbackSpeed,
    setIsPlaying,
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
    (numbers: number[]) => {
      stopPlayback();
      const result = bubbleSort(numbers);
      loadSteps(result.steps);
    },
    [stopPlayback, loadSteps]
  );

  useEffect(() => {
    initController([5, 1, 4, 2, 8]);
  }, [initController]);

  const handleLoadAndRun = () => {
    const { numbers, error } = parseNumbers(inputArrayText);
    if (error) {
      setInputError(error);
      return;
    }

    historyCountRef.current += 1;
    const nextHistoryId = `array-hist-${historyCountRef.current}`;
    emitTransition('LOAD_CUSTOM', 0, nextHistoryId);
    setInputError(null);
    initController(numbers);
    setIsPlaying(true);
  };

  const handleResetWithStop = () => {
    emitTransition('RESET', 0);
    stopPlayback();
    handleReset();
  };

  const handlePresetSelect = (preset: number[]) => {
    historyCountRef.current += 1;
    const nextHistoryId = `array-hist-${historyCountRef.current}`;
    emitTransition('LOAD_PRESET', 0, nextHistoryId);
    setInputError(null);
    setInputArrayText(preset.join(', '));
    initController(preset);
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
  const metrics = currentStep?.metrics || { comparisonsCount: 0, swapsCount: 0 };

  return (
    <>
      <A11yAnnouncer message={currentStep?.a11yMessage} />
      <LabShell
        category={t('array:category')}
        title={t('array:title')}
        subtitle={t('array:subtitle')}
        visualizationSlot={
          <ArrayVisualizerAdapter step={currentStep} transitionContext={transitionContext} />
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
            <label htmlFor="array-input" className="control-label">
              {t('array:inputLabel')}
            </label>
            <div className="input-group">
              <input
                id="array-input"
                type="text"
                value={inputArrayText}
                onChange={(e) => {
                  setInputArrayText(e.target.value);
                  if (inputError) {
                    setInputError(null);
                  }
                }}
                placeholder={t('array:inputPlaceholder')}
                aria-label={t('array:inputAria')}
                className="array-input-field"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleLoadAndRun}
                aria-label={t('array:loadAndRunAria')}
              >
                {t('array:loadAndRunBtn')}
              </Button>
            </div>

            {inputError && (
              <Badge variant="rose" className="input-error-badge">
                {inputError}
              </Badge>
            )}

            <div className="control-actions">
              {presetArrays.map((p) => (
                <Button
                  key={p.label}
                  variant="outline"
                  size="sm"
                  onClick={() => handlePresetSelect(p.array)}
                >
                  {p.label}
                </Button>
              ))}
            </div>
          </div>
        }
        inspectorSlot={
          <Card title={t('array:inspector.title')}>
            <div className="inspector-list">
              <div>
                <span className="inspector-label">{t('common:action')} </span>
                <Badge
                  variant={
                    currentAction === 'COMPARE'
                      ? 'amber'
                      : currentAction === 'SWAP'
                        ? 'rose'
                        : currentAction === 'COMPLETE'
                          ? 'emerald'
                          : 'cyan'
                  }
                >
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
                <span className="inspector-label">{t('array:inspector.comparisons')} </span>
                <span className="inspector-val-total">{metrics.comparisonsCount}</span>
              </div>
              <div>
                <span className="inspector-label">{t('array:inspector.swaps')} </span>
                <span className="inspector-val-total">{metrics.swapsCount}</span>
              </div>
              <div>
                <span className="inspector-label">{t('common:status')} </span>
                <span
                  className={
                    currentIndex === totalSteps - 1 && totalSteps > 0
                      ? 'inspector-val-idle'
                      : 'inspector-val-index'
                  }
                >
                  {totalSteps === 0 ? t('array:inspector.statusEmpty') : currentIndex === totalSteps - 1 ? t('array:inspector.statusSorted') : t('array:inspector.statusInProgress')}
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
