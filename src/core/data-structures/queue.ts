export interface QueueState {
  readonly buffer: readonly (number | null)[];
  readonly items: readonly number[];
  readonly frontIndex: number;
  readonly rearIndex: number;
  readonly count: number;
  readonly capacity: number;
  readonly lastAction?: string;
  readonly statusMessage?: string;
}

export class BoundedQueue<T> {
  private readonly buffer: (T | null)[];
  private front: number = 0;
  private rear: number = 0;
  private count: number = 0;
  private readonly capacity: number;

  constructor(capacity: number = 8) {
    if (capacity <= 0 || !Number.isInteger(capacity)) {
      throw new Error('Queue capacity must be a positive integer');
    }
    this.capacity = capacity;
    this.buffer = new Array<T | null>(capacity).fill(null);
  }

  enqueue(item: T): void {
    if (this.isFull()) {
      throw new Error('Queue Overflow: capacity reached');
    }
    this.buffer[this.rear] = item;
    this.rear = (this.rear + 1) % this.capacity;
    this.count++;
  }

  dequeue(): T {
    if (this.isEmpty()) {
      throw new Error('Queue Underflow: queue is empty');
    }
    const item = this.buffer[this.front]!;
    this.buffer[this.front] = null;
    this.front = (this.front + 1) % this.capacity;
    this.count--;
    return item;
  }

  peek(): T {
    if (this.isEmpty()) {
      throw new Error('Queue Underflow: queue is empty');
    }
    return this.buffer[this.front]!;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  isFull(): boolean {
    return this.count >= this.capacity;
  }

  size(): number {
    return this.count;
  }

  getCapacity(): number {
    return this.capacity;
  }

  getFrontIndex(): number {
    return this.count > 0 ? this.front : -1;
  }

  getRearIndex(): number {
    if (this.count === 0) {
      return -1;
    }
    return (this.rear - 1 + this.capacity) % this.capacity;
  }

  getBuffer(): readonly (T | null)[] {
    return [...this.buffer];
  }

  toArray(): readonly T[] {
    const result: T[] = [];
    for (let i = 0; i < this.count; i++) {
      const idx = (this.front + i) % this.capacity;
      result.push(this.buffer[idx]!);
    }
    return result;
  }
}
