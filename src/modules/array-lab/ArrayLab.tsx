import React, { useState, useEffect, useRef, useCallback } from 'react';
import { bubbleSort } from '@/core/algorithms';
import { TimeTravelController } from '@/core/engine';
import { ExecutionStep } from '@/core/types';
import { ArrayState } from '@/core/data-structures/array';
import { ArrayVisualizerAdapter } from '@/components/visualizer';
import { CodeViewer } from '@/components/code-viewer';
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
      'Sorting is one of the most fundamental operations in computer science. Given an unordered sequence of numbers, our goal is to rearrange them in non-decreasing order. How can a simple strategy based exclusively on inspecting and swapping two adjacent elements at a time gradually bring global order to the entire list?',
  },
  {
    id: '02',
    name: '02. Interact',
    title: 'Interact with Pairwise Swaps',
    content:
      'Use the time-travel controls below to step through execution. Watch how the algorithm scans from left to right, always focusing on a pair of adjacent elements (pointers j and j+1). If the left element is strictly greater than the right element, they swap positions.',
  },
  {
    id: '03',
    name: '03. Observe',
    title: 'Observe the Invariant & Bubbling',
    content:
      'Notice the key invariant: on every full pass through the unsorted portion of the array, the largest remaining element inevitably "bubbles up" to its final sorted position at the right. Once an element reaches its permanent home, it is marked in green and locked in place.',
  },
  {
    id: '04',
    name: '04. Explain',
    title: 'Explain Time & Space Complexity',
    content:
      'In an array of length n, Pass 1 performs (n - 1) comparisons, Pass 2 performs (n - 2), down to 1 comparison in the final pass. The worst-case and average-case time complexity is O(n²) with n(n - 1)/2 comparisons. With Early Exit, a pre-sorted array finishes in a single pass of (n - 1) comparisons and 0 swaps, achieving O(n) best-case time complexity. Regarding space complexity: classic in-place sorting operates in O(1) auxiliary memory; in this implementation, the input is cloned once (O(n)) to preserve immutability, while the pedagogical ExecutionStep[] trace requires additional memory proportional to the number of recorded snapshots.',
  },
  {
    id: '05',
    name: '05. Visualize',
    title: 'Visual Representation',
    content:
      'The SVG Viewport renders the active state in real time: pointers (j and j+1) indicate the current pair under inspection, yellow highlights denote active comparisons, rose highlights denote elements in the middle of a swap, and green nodes indicate permanently sorted positions.',
  },
  {
    id: '06',
    name: '06. Pseudocode',
    title: 'Algorithm Pseudocode (with Early Exit)',
    content: `procedure bubbleSort(A: list of sortable items)
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
end procedure`,
  },
  {
    id: '07',
    name: '07. Code',
    title: 'TypeScript Implementation (with Early Exit)',
    content: `export function bubbleSort(arr: number[]): number[] {
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
}`,
  },
  {
    id: '08',
    name: '08. Modify',
    title: 'Modify & Optimize (Early Exit Active)',
    content:
      'This laboratory implements the Early Exit optimization. By checking if zero swaps occurred during a complete pass, the algorithm terminates early as soon as the array reaches sorted order. For example, testing the "Sorted" preset only requires a single pass with (n - 1) comparisons instead of all n(n - 1)/2 comparisons!',
  },
  {
    id: '09',
    name: '09. Practice',
    title: 'Practice with Custom Inputs',
    content:
      'Try typing your own comma-separated list of numbers into the input box above (e.g. 9, 3, 7, 1, 5) and click "Load & Run". Try to predict how many total swaps will occur before stepping through the visualizer!',
  },
  {
    id: '10',
    name: '10. Challenge',
    title: 'Algorithm Mastery Challenge',
    content:
      'Challenge Question: For an array with n=5 elements in strictly reverse order [5, 4, 3, 2, 1], what is the exact number of swaps required? (Answer: 4 + 3 + 2 + 1 = 10 swaps). Load the "Reverse" preset in the sandbox above to step through and verify!',
  },
];

export const ArrayLab: React.FC = () => {
  const [inputArrayText, setInputArrayText] = useState('5, 1, 4, 2, 8');
  const [inputError, setInputError] = useState<string | null>(null);
  const [activePhaseIndex, setActivePhaseIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(600);

  const controllerRef = useRef<TimeTravelController<ArrayState> | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const [currentStep, setCurrentStep] = useState<ExecutionStep<ArrayState> | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [totalSteps, setTotalSteps] = useState<number>(0);

  const parseNumbers = (text: string): { numbers: number[]; error: string | null } => {
    const rawTokens = text.split(',').map((t) => t.trim()).filter(Boolean);
    if (rawTokens.length === 0) {
      return { numbers: [], error: 'Please enter at least one number.' };
    }
    if (rawTokens.length > 14) {
      return { numbers: [], error: 'Please enter at most 14 numbers for optimal visualization.' };
    }

    const numbers: number[] = [];
    for (const token of rawTokens) {
      const val = Number(token);
      if (!Number.isFinite(val)) {
        return { numbers: [], error: `Invalid number: "${token}". Only valid numbers are allowed.` };
      }
      numbers.push(Math.round(val));
    }

    return { numbers, error: null };
  };

  const initController = useCallback((numbers: number[]) => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
    }

    setIsPlaying(false);

    const result = bubbleSort(numbers);
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
    initController([5, 1, 4, 2, 8]);
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

  const handleLoadAndRun = () => {
    const { numbers, error } = parseNumbers(inputArrayText);
    if (error) {
      setInputError(error);
      return;
    }

    setInputError(null);
    initController(numbers);
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

  const handlePresetSelect = (preset: number[]) => {
    setInputError(null);
    setInputArrayText(preset.join(', '));
    initController(preset);
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
                onChange={(e) => {
                  setInputArrayText(e.target.value);
                  if (inputError) {
                    setInputError(null);
                  }
                }}
                placeholder="e.g. 5, 1, 4, 2, 8"
                aria-label="Array input values"
                className="array-input-field"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleLoadAndRun}
                aria-label="Load and run sorting"
              >
                Load & Run
              </Button>
            </div>

            {inputError && (
              <Badge variant="rose" className="input-error-badge">
                {inputError}
              </Badge>
            )}

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
            {activePhase?.id === '06' ? (
              <CodeViewer
                code={activePhase.content}
                language="pseudocode"
                activeLine={currentStep?.codeHighlight?.pseudocodeLine}
              />
            ) : activePhase?.id === '07' ? (
              <CodeViewer
                code={activePhase.content}
                language="typescript"
                activeLine={currentStep?.codeHighlight?.typescriptLine}
              />
            ) : (
              <p className="phase-content-text">{activePhase?.content}</p>
            )}
          </Card>
        </div>
      }
    />
  );
};
