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
  | 'COMPLETE';

export interface PointerInfo {
  id: string;
  index: number;
  label: string;
  colorVar?: string;
}

export interface ExecutionStep<TState> {
  id: string;
  stepIndex: number;
  totalSteps?: number;
  action: StepActionType;
  description: string;
  a11yMessage: string;
  state: TState;
  activeIndices?: number[];
  comparedIndices?: [number, number];
  pointers?: PointerInfo[];
  codeHighlight?: {
    pseudocodeLine?: number;
    typescriptLine?: number;
  };
  metrics?: {
    comparisonsCount: number;
    swapsCount: number;
    depthLevel?: number;
  };
}

export interface AlgorithmMetrics {
  totalComparisons: number;
  totalSwaps: number;
  totalSteps: number;
  executionTimeMs: number;
}

export interface AlgorithmResult<TState, TOutput = unknown> {
  steps: ExecutionStep<TState>[];
  output: TOutput;
  metrics: AlgorithmMetrics;
}

export type AlgorithmGenerator<TInput, TState, TOutput = unknown> = (
  input: TInput
) => AlgorithmResult<TState, TOutput>;
