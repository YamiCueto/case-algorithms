import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { bubbleSort } from '@/core/algorithms';
import { TimeTravelController } from '@/core/engine';
import { ExecutionStep } from '@/core/types';
import { ArrayState } from '@/core/data-structures/array';
import { ArrayVisualizerAdapter } from '@/components/visualizer';
import { LabShell, Button, Badge, Card } from '@/components/ui';

const PRESET_ARRAYS: { label: string; array: number[] }[] = [
  { label: 'Default [5, 1, 4, 2, 8]', array: [5, 1, 4, 2, 8] },
  { label: 'Reverse [5, 4, 3, 2, 1]', array: [5, 4, 3, 2, 1] },
  { label: 'Sorted [1, 2, 3, 4, 5]', array: [1, 2, 3, 4, 5] },
  { label: 'Mixed [12, 7, 19, 3, 25, 1]', array: [12, 7, 19, 3, 25, 1] },
];

const PEDAGOGICAL_PHASES = [
  {
    id: '01',
    name: '01. Discover',
    title: 'Discover the Need for Sorting',
    content:
      'Imagine searching through an unsorted list: you must inspect every single item one by one (O(n)). If the data is ordered, you can find anything logarithmically in O(log n). How can simple pairwise comparisons gradually organize an entire array?',
  },
  {
    id: '02',
    name: '02. Interact',
    title: 'Interact with Pairwise Swaps',
    content:
      'Use the time-travel buttons above to step through the execution. Watch how the algorithm only examines two adjacent elements at a time (j and j+1) and swaps them if the left is greater than the right.',
  },
  {
    id: '03',
    name: '03. Observe',
    title: 'Observe the Invariant & Bubbling',
    content:
      'Notice that after Pass 1, the largest element (8) is guaranteed to reach the rightmost position. After Pass 2, the second largest is locked in place. The green nodes highlight elements that have settled into their permanent sorted indices.',
  },
  {
    id: '04',
    name: '04. Explain',
    title: 'Explain Time & Space Complexity',
    content:
      'Bubble Sort performs (n - 1) passes. In pass i, it performs (n - 1 - i) comparisons. Total comparisons: n(n - 1)/2 ≈ O(n²). Space complexity is O(1) auxiliary memory because swaps happen in-place.',
  },
  {
    id: '05',
    name: '05. Visualize',
    title: 'Visual Representation',
    content:
      'The SVG Viewport renders active pointers (j and j+1), highlight boxes around compared pairs (yellow) and swapped pairs (rose), and green borders for finalized positions.',
  },
  {
    id: '06',
    name: '06. Pseudocode',
    title: 'Algorithm Pseudocode',
    content: `procedure bubbleSort(A: list of sortable items)
  n := length(A)
  for i from 0 to n-1 do
    for j from 0 to n-2-i do
      if A[j] > A[j+1] then
        swap(A[j], A[j+1])
      end if
    end for
  end for
end procedure`,
  },
  {
    id: '07',
    name: '07. Code',
    title: 'TypeScript Implementation',
    content: `export function bubbleSort(arr: number[]): number[] {
  const a = [...arr];
  const n = a.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (a[j] > a[j + 1]) {
        const temp = a[j];
        a[j] = a[j + 1];
        a[j + 1] = temp;
      }
    }
  }
  return a;
}`,
  },
  {
    id: '08',
    name: '08. Modify',
    title: 'Modify & Optimize',
    content:
      'Can we stop early if the array becomes sorted before all n-1 passes? Yes! By adding a boolean flag "swappedInPass", we can terminate immediately on pass 1 if zero swaps occur, achieving O(n) best-case performance for sorted inputs.',
  },
  {
    id: '09',
    name: '09. Practice',
    title: 'Practice with Custom Inputs',
    content:
      'Type custom comma-separated numbers in the input box above (e.g. 9, 3, 7, 1, 5) and click "Run Sort". Predict how many total swaps will occur before stepping through!',
  },
  {
    id: '10',
    name: '10. Challenge',
    title: 'Algorithm Mastery Challenge',
    content:
      'Challenge Question: For an array with n=5 elements in reverse order [5, 4, 3, 2, 1], what is the exact number of swaps? (Answer: 4 + 3 + 2 + 1 = 10 swaps). Try it in the sandbox to verify!',
  },
];

export const ArrayLab: React.FC = () => {
  const [inputArrayText, setInputArrayText] = useState('5, 1, 4, 2, 8');
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(600);

  const initialNumbers = useMemo(() => {
    return inputArrayText
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
  }, [inputArrayText]);

  const controllerRef = useRef<TimeTravelController<ArrayState> | null>(null);
  const [currentStep, setCurrentStep] = useState<ExecutionStep<ArrayState> | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);

  const initController = useCallback((numbers: number[]) => {
    const result = bubbleSort(numbers);
    const ctrl = new TimeTravelController(result.steps);
    controllerRef.current = ctrl;
    setCurrentStep(ctrl.currentStep);
    setCurrentIndex(ctrl.currentIndex);
    setTotalSteps(ctrl.totalSteps);

    const unsubscribe = ctrl.subscribe((step, idx) => {
      setCurrentStep(step);
      setCurrentIndex(idx);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsub = initController(initialNumbers);
    return () => {
      unsub();
    };
  }, [initController, initialNumbers]);

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

  const handlePresetSelect = (preset: number[]) => {
    setIsPlaying(false);
    setInputArrayText(preset.join(', '));
  };

  const currentAction = currentStep?.action || 'INITIALIZE';
  const metrics = currentStep?.metrics || { comparisonsCount: 0, swapsCount: 0 };
  const activePhase = PEDAGOGICAL_PHASES[activePhaseIndex] || PEDAGOGICAL_PHASES[0];

  return (
    <LabShell
      category="Interactive Laboratory: Array Data Structure"
      title="Array & Bubble Sort Exploration"
      subtitle="Discover how local element comparisons and adjacent swaps systematically sort an array through an interactive 10-step pedagogical journey."
      viewportSlot={<ArrayVisualizerAdapter step={currentStep} viewBoxWidth={800} viewBoxHeight={340} />}
      controlsSlot={
        <div className="control-group">
          <div className="control-group">
            <span className="control-label">Array Input Configuration</span>
            <div className="input-action-row">
              <input
                type="text"
                value={inputArrayText}
                onChange={(e) => setInputArrayText(e.target.value)}
                placeholder="e.g. 5, 1, 4, 2, 8"
                aria-label="Array input values"
                className="array-input-field"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => initController(initialNumbers)}
                aria-label="Run Sort"
              >
                Load & Run
              </Button>
            </div>

            <div className="control-actions">
              {PRESET_ARRAYS.map((p) => (
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

          <Card title="State & Metrics Inspector">
            <div className="inspector-list">
              <div>
                <span className="inspector-label">Action: </span>
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
                <span className="inspector-label">Step Index: </span>
                <span className="inspector-val-index">
                  {totalSteps > 0 ? currentIndex + 1 : 0} / {totalSteps}
                </span>
              </div>
              <div>
                <span className="inspector-label">Comparisons: </span>
                <span className="inspector-val-total">{metrics.comparisonsCount}</span>
              </div>
              <div>
                <span className="inspector-label">Swaps performed: </span>
                <span className="inspector-val-total">{metrics.swapsCount}</span>
              </div>
              <div>
                <span className="inspector-label">Status: </span>
                <span
                  className={
                    currentIndex === totalSteps - 1 && totalSteps > 0
                      ? 'inspector-val-idle'
                      : 'inspector-val-index'
                  }
                >
                  {totalSteps === 0 ? 'Empty' : currentIndex === totalSteps - 1 ? 'Sorted (Complete)' : 'In Progress'}
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
