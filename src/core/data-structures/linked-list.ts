export interface LinkedListNodeState {
  readonly id: string;
  readonly value: number;
  readonly nextId: string | null;
  readonly index: number;
}

export interface LinkedListState {
  readonly nodes: readonly LinkedListNodeState[];
  readonly headId: string | null;
  readonly tailId: string | null;
  readonly size: number;
  readonly activeNodeId?: string | null;
  readonly highlightedEdgeId?: string | null;
  readonly targetIndex?: number;
  readonly lastAction?: string;
  readonly statusMessage?: string;
}

export class SinglyLinkedListNode<T> {
  public value: T;
  public next: SinglyLinkedListNode<T> | null = null;
  public readonly id: string;

  constructor(value: T, id: string) {
    this.value = value;
    this.id = id;
  }
}

export class SinglyLinkedList<T> {
  private head: SinglyLinkedListNode<T> | null = null;
  private tail: SinglyLinkedListNode<T> | null = null;
  private count: number = 0;
  private idCounter: number = 0;

  private generateId(): string {
    this.idCounter++;
    return `node-${this.idCounter}`;
  }

  prepend(value: T): SinglyLinkedListNode<T> {
    const newNode = new SinglyLinkedListNode<T>(value, this.generateId());
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }
    this.count++;
    return newNode;
  }

  append(value: T): SinglyLinkedListNode<T> {
    const newNode = new SinglyLinkedListNode<T>(value, this.generateId());
    if (!this.head || !this.tail) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.count++;
    return newNode;
  }

  insertAt(index: number, value: T): SinglyLinkedListNode<T> {
    if (index < 0 || index > this.count) {
      throw new Error(`Index out of bounds: ${index}. Valid range: 0 to ${this.count}`);
    }

    if (index === 0) {
      return this.prepend(value);
    }

    if (index === this.count) {
      return this.append(value);
    }

    let prev = this.head!;
    for (let i = 0; i < index - 1; i++) {
      prev = prev.next!;
    }

    const newNode = new SinglyLinkedListNode<T>(value, this.generateId());
    newNode.next = prev.next;
    prev.next = newNode;
    this.count++;
    return newNode;
  }

  removeAt(index: number): T {
    if (index < 0 || index >= this.count || !this.head) {
      throw new Error(`Index out of bounds: ${index}. Valid range: 0 to ${this.count - 1}`);
    }

    if (index === 0) {
      const removedVal = this.head.value;
      this.head = this.head.next;
      this.count--;
      if (this.count === 0) {
        this.tail = null;
      }
      return removedVal;
    }

    let prev = this.head;
    for (let i = 0; i < index - 1; i++) {
      prev = prev.next!;
    }

    const targetNode = prev.next!;
    const removedVal = targetNode.value;
    prev.next = targetNode.next;

    if (targetNode === this.tail) {
      this.tail = prev;
    }

    this.count--;
    return removedVal;
  }

  find(predicate: (val: T) => boolean): { index: number; value: T; id: string } | null {
    let curr = this.head;
    let idx = 0;

    while (curr) {
      if (predicate(curr.value)) {
        return { index: idx, value: curr.value, id: curr.id };
      }
      curr = curr.next;
      idx++;
    }

    return null;
  }

  clear(): void {
    this.head = null;
    this.tail = null;
    this.count = 0;
  }

  size(): number {
    return this.count;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  getHead(): SinglyLinkedListNode<T> | null {
    return this.head;
  }

  getTail(): SinglyLinkedListNode<T> | null {
    return this.tail;
  }

  toArray(): readonly T[] {
    const result: T[] = [];
    let curr = this.head;
    while (curr) {
      result.push(curr.value);
      curr = curr.next;
    }
    return result;
  }

  toNodeStates(): readonly LinkedListNodeState[] {
    const states: LinkedListNodeState[] = [];
    let curr = this.head;
    let idx = 0;

    while (curr) {
      states.push({
        id: curr.id,
        value: typeof curr.value === 'number' ? curr.value : Number(curr.value),
        nextId: curr.next ? curr.next.id : null,
        index: idx,
      });
      curr = curr.next;
      idx++;
    }

    return states;
  }
}
