export interface ArrayState {
  readonly array: readonly number[];
  readonly sortedIndices: readonly number[];
  readonly activeIndex?: number;
  readonly comparingIndices?: readonly [number, number];
  readonly swappedIndices?: readonly [number, number];
  readonly phaseDescription: string;
}
