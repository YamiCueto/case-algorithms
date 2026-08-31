export interface QueueState {
  readonly items: readonly number[];
  readonly frontIndex: number;
  readonly rearIndex: number;
  readonly capacity: number;
  readonly lastAction?: string;
  readonly statusMessage?: string;
}

export class BoundedQueue<T> {
  private readonly items: T[] = [];
  private readonly capacity: number;

  constructor(capacity: number = 8) {
    if (capacity <= 0 || !Number.isInteger(capacity)) {
      throw new Error('Queue capacity must be a positive integer');
    }
    this.capacity = capacity;
  }

  enqueue(item: T): void {
    if (this.isFull()) {
      throw new Error('Queue Overflow: capacity reached');
    }
    this.items.push(item);
  }

  dequeue(): T {
    if (this.isEmpty()) {
      throw new Error('Queue Underflow: queue is empty');
    }
    return this.items.shift()!;
  }

  peek(): T {
    if (this.isEmpty()) {
      throw new Error('Queue Underflow: queue is empty');
    }
    return this.items[0]!;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  isFull(): boolean {
    return this.items.length >= this.capacity;
  }

  size(): number {
    return this.items.length;
  }

  getCapacity(): number {
    return this.capacity;
  }

  toArray(): readonly T[] {
    return [...this.items];
  }

  getFrontIndex(): number {
    return this.items.length > 0 ? 0 : -1;
  }

  getRearIndex(): number {
    return this.items.length > 0 ? this.items.length - 1 : -1;
  }
}
