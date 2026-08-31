export type StackOperationType =
  | 'INITIALIZE'
  | 'PUSH'
  | 'POP'
  | 'PEEK'
  | 'OVERFLOW'
  | 'UNDERFLOW'
  | 'CLEAR'
  | 'COMPLETE';

export interface StackState {
  readonly items: readonly number[];
  readonly topIndex: number;
  readonly capacity: number;
  readonly operation?: StackOperationType;
  readonly targetElement?: number;
  readonly phaseDescription: string;
}
