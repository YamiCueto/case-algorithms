import {
  ExecutionStep,
  StepChangeListener,
  TimeTravelControllerOptions,
} from '../types';

function deepClone<T>(value: T): T {
  if (value === null || typeof value !== 'object') {
    return value;
  }

  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value);
    } catch {
      return JSON.parse(JSON.stringify(value)) as T;
    }
  }

  return JSON.parse(JSON.stringify(value)) as T;
}

function deepFreeze<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object' || Object.isFrozen(obj)) {
    return obj;
  }

  Object.freeze(obj);

  for (const key of Object.keys(obj)) {
    const value = (obj as Record<string, unknown>)[key];
    if (value !== null && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }

  return obj;
}

export class TimeTravelController<TState> {
  private steps: readonly ExecutionStep<TState>[] = [];
  private _currentIndex: number = -1;
  private readonly initialIndex: number;
  private readonly customCloneState?: (state: TState) => TState;
  private readonly listeners: Set<StepChangeListener<TState>> = new Set();

  constructor(
    steps: readonly ExecutionStep<TState>[] = [],
    options?: TimeTravelControllerOptions<TState>
  ) {
    this.customCloneState = options?.cloneState;
    const rawInitial = options?.initialIndex ?? 0;
    this.initialIndex = Number.isFinite(rawInitial) ? Math.floor(rawInitial) : 0;
    this.loadSteps(steps, this.initialIndex);
  }

  private cloneState(state: TState): TState {
    if (this.customCloneState) {
      return this.customCloneState(state);
    }
    return deepClone(state);
  }

  private loadSteps(steps: readonly ExecutionStep<TState>[], targetIndex: number): void {
    const clonedAndFrozenSteps = steps.map((step) => {
      const clonedState = this.cloneState(step.state);
      const stepCopy: ExecutionStep<TState> = {
        ...step,
        state: clonedState,
        activeIndices: step.activeIndices ? [...step.activeIndices] : undefined,
        comparedIndices: step.comparedIndices ? [...step.comparedIndices] : undefined,
        pointers: step.pointers ? step.pointers.map((p) => ({ ...p })) : undefined,
        codeHighlight: step.codeHighlight ? { ...step.codeHighlight } : undefined,
        metrics: step.metrics ? { ...step.metrics } : undefined,
      };
      return deepFreeze(stepCopy);
    });

    this.steps = Object.freeze(clonedAndFrozenSteps);

    if (this.steps.length === 0) {
      this._currentIndex = -1;
    } else {
      const sanitizedTarget = Number.isFinite(targetIndex) ? Math.floor(targetIndex) : 0;
      this._currentIndex = Math.max(0, Math.min(sanitizedTarget, this.steps.length - 1));
    }
  }

  private notify(): void {
    const current = this.currentStep;
    const index = this._currentIndex;
    const listenersSnapshot = Array.from(this.listeners);
    for (const listener of listenersSnapshot) {
      listener(current, index);
    }
  }

  public get currentStep(): ExecutionStep<TState> | null {
    if (this._currentIndex < 0 || this._currentIndex >= this.steps.length) {
      return null;
    }
    const step = this.steps[this._currentIndex];
    return step ?? null;
  }

  public get currentState(): TState | null {
    const step = this.currentStep;
    return step ? step.state : null;
  }

  public get currentIndex(): number {
    return this._currentIndex;
  }

  public get totalSteps(): number {
    return this.steps.length;
  }

  public get hasNext(): boolean {
    return this.steps.length > 0 && this._currentIndex < this.steps.length - 1;
  }

  public get hasPrevious(): boolean {
    return this.steps.length > 0 && this._currentIndex > 0;
  }

  public get isInitial(): boolean {
    return this.steps.length === 0 || this._currentIndex === 0;
  }

  public get isFinal(): boolean {
    return this.steps.length === 0 || this._currentIndex === this.steps.length - 1;
  }

  public get history(): readonly ExecutionStep<TState>[] {
    return this.steps;
  }

  public get progress(): number {
    if (this.steps.length <= 1) {
      return this.steps.length === 1 ? 1 : 0;
    }
    return this._currentIndex / (this.steps.length - 1);
  }

  public next(): ExecutionStep<TState> | null {
    if (!this.hasNext) {
      return this.currentStep;
    }
    this._currentIndex += 1;
    this.notify();
    return this.currentStep;
  }

  public previous(): ExecutionStep<TState> | null {
    if (!this.hasPrevious) {
      return this.currentStep;
    }
    this._currentIndex -= 1;
    this.notify();
    return this.currentStep;
  }

  public first(): ExecutionStep<TState> | null {
    if (this.steps.length === 0 || this._currentIndex === 0) {
      return this.currentStep;
    }
    this._currentIndex = 0;
    this.notify();
    return this.currentStep;
  }

  public last(): ExecutionStep<TState> | null {
    if (this.steps.length === 0 || this._currentIndex === this.steps.length - 1) {
      return this.currentStep;
    }
    this._currentIndex = this.steps.length - 1;
    this.notify();
    return this.currentStep;
  }

  public reset(): ExecutionStep<TState> | null {
    if (this.steps.length === 0) {
      return null;
    }
    const target = Math.max(0, Math.min(this.initialIndex, this.steps.length - 1));
    if (this._currentIndex !== target) {
      this._currentIndex = target;
      this.notify();
    }
    return this.currentStep;
  }

  public goToStep(targetIndex: number): ExecutionStep<TState> | null {
    if (this.steps.length === 0 || !Number.isFinite(targetIndex)) {
      return this.currentStep;
    }
    const normalized = Math.floor(targetIndex);
    const clampedIndex = Math.max(0, Math.min(normalized, this.steps.length - 1));
    if (this._currentIndex !== clampedIndex) {
      this._currentIndex = clampedIndex;
      this.notify();
    }
    return this.currentStep;
  }

  public setSteps(
    newSteps: readonly ExecutionStep<TState>[],
    targetIndex: number = 0
  ): ExecutionStep<TState> | null {
    this.loadSteps(newSteps, targetIndex);
    this.notify();
    return this.currentStep;
  }

  public subscribe(listener: StepChangeListener<TState>): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
}
