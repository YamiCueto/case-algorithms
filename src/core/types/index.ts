export type StepActionType =
  | 'INITIALIZE'
  | 'COMPARE'
  | 'SWAP'
  | 'INSERT'
  | 'DELETE'
  | 'VISIT'
  | 'SET_POINTER'
  | 'SPLIT'
  | 'MERGE'
  | 'FOUND'
  | 'NOT_FOUND'
  | 'PUSH'
  | 'POP'
  | 'PEEK'
  | 'OVERFLOW'
  | 'UNDERFLOW'
  | 'CLEAR'
  | 'COMPLETE';

export interface PointerInfo {
  readonly id: string;
  readonly index: number;
  readonly label: string;
  readonly colorVar?: string;
}

export interface CodeHighlightInfo {
  readonly pseudocodeLine?: number;
  readonly typescriptLine?: number;
}

export interface StepMetricsInfo {
  readonly comparisonsCount: number;
  readonly swapsCount: number;
  readonly depthLevel?: number;
}

export interface ExecutionStep<TState> {
  readonly id: string;
  readonly stepIndex: number;
  readonly totalSteps: number;
  readonly action: StepActionType;
  readonly description: string;
  readonly a11yMessage: string;
  readonly state: TState;
  readonly activeIndices?: readonly number[];
  readonly comparedIndices?: readonly [number, number];
  readonly pointers?: readonly PointerInfo[];
  readonly codeHighlight?: CodeHighlightInfo;
  readonly metrics?: StepMetricsInfo;
}

export interface AlgorithmMetrics {
  readonly totalComparisons: number;
  readonly totalSwaps: number;
  readonly totalSteps: number;
  readonly executionTimeMs: number;
}

export interface AlgorithmResult<TState, TOutput = unknown> {
  readonly steps: readonly ExecutionStep<TState>[];
  readonly output: TOutput;
  readonly metrics: AlgorithmMetrics;
}

export type AlgorithmGenerator<TInput, TState, TOutput = unknown> = (
  input: TInput
) => AlgorithmResult<TState, TOutput>;

export type StepChangeListener<TState> = (
  step: ExecutionStep<TState> | null,
  currentIndex: number
) => void;

export interface TimeTravelControllerOptions<TState> {
  readonly initialIndex?: number;
  readonly cloneState?: (state: TState) => TState;
}
