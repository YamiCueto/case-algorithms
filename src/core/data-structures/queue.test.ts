import { describe, it, expect } from 'vitest';
import { BoundedQueue } from './queue';

describe('BoundedQueue Data Structure (O(1) Two-Pointer Circular Buffer)', () => {
  it('initializes with default capacity, empty buffer and invalid pointer indices', () => {
    const queue = new BoundedQueue<number>(4);
    expect(queue.isEmpty()).toBe(true);
    expect(queue.isFull()).toBe(false);
    expect(queue.size()).toBe(0);
    expect(queue.getCapacity()).toBe(4);
    expect(queue.getFrontIndex()).toBe(-1);
    expect(queue.getRearIndex()).toBe(-1);
    expect(queue.getBuffer()).toEqual([null, null, null, null]);
    expect(queue.toArray()).toEqual([]);
  });

  it('rejects invalid capacity values', () => {
    expect(() => new BoundedQueue<number>(0)).toThrow('Queue capacity must be a positive integer');
    expect(() => new BoundedQueue<number>(-5)).toThrow('Queue capacity must be a positive integer');
    expect(() => new BoundedQueue<number>(3.5)).toThrow('Queue capacity must be a positive integer');
  });

  it('enqueues elements directly into buffer slots without element shifting', () => {
    const queue = new BoundedQueue<number>(4);
    queue.enqueue(10);
    expect(queue.size()).toBe(1);
    expect(queue.getFrontIndex()).toBe(0);
    expect(queue.getRearIndex()).toBe(0);
    expect(queue.getBuffer()).toEqual([10, null, null, null]);

    queue.enqueue(20);
    expect(queue.size()).toBe(2);
    expect(queue.getFrontIndex()).toBe(0);
    expect(queue.getRearIndex()).toBe(1);
    expect(queue.getBuffer()).toEqual([10, 20, null, null]);
    expect(queue.toArray()).toEqual([10, 20]);
  });

  it('dequeues elements in O(1) by advancing front pointer without shifting array elements', () => {
    const queue = new BoundedQueue<number>(4);
    queue.enqueue(10);
    queue.enqueue(20);
    queue.enqueue(30);

    const firstOut = queue.dequeue();
    expect(firstOut).toBe(10);
    expect(queue.size()).toBe(2);
    expect(queue.getFrontIndex()).toBe(1);
    expect(queue.getRearIndex()).toBe(2);
    expect(queue.getBuffer()).toEqual([null, 20, 30, null]);
    expect(queue.toArray()).toEqual([20, 30]);

    const secondOut = queue.dequeue();
    expect(secondOut).toBe(20);
    expect(queue.getFrontIndex()).toBe(2);
    expect(queue.getRearIndex()).toBe(2);
    expect(queue.getBuffer()).toEqual([null, null, 30, null]);
  });

  it('wraps around circular buffer indices in O(1) time', () => {
    const queue = new BoundedQueue<number>(3);
    queue.enqueue(1);
    queue.enqueue(2);
    queue.enqueue(3);
    expect(queue.getBuffer()).toEqual([1, 2, 3]);

    queue.dequeue();
    expect(queue.getBuffer()).toEqual([null, 2, 3]);
    expect(queue.getFrontIndex()).toBe(1);

    queue.enqueue(4);
    expect(queue.getBuffer()).toEqual([4, 2, 3]);
    expect(queue.getFrontIndex()).toBe(1);
    expect(queue.getRearIndex()).toBe(0);
    expect(queue.toArray()).toEqual([2, 3, 4]);

    expect(queue.dequeue()).toBe(2);
    expect(queue.dequeue()).toBe(3);
    expect(queue.dequeue()).toBe(4);
    expect(queue.isEmpty()).toBe(true);
    expect(queue.getBuffer()).toEqual([null, null, null]);
  });

  it('peeks at the front element without mutating the buffer or pointers', () => {
    const queue = new BoundedQueue<string>(3);
    queue.enqueue('A');
    queue.enqueue('B');

    expect(queue.peek()).toBe('A');
    expect(queue.size()).toBe(2);
    expect(queue.getFrontIndex()).toBe(0);
  });

  it('throws error on Queue Overflow when capacity is reached', () => {
    const queue = new BoundedQueue<number>(2);
    queue.enqueue(1);
    queue.enqueue(2);
    expect(queue.isFull()).toBe(true);

    expect(() => queue.enqueue(3)).toThrow('Queue Overflow: capacity reached');
  });

  it('throws error on Queue Underflow when attempting to dequeue or peek an empty queue', () => {
    const queue = new BoundedQueue<number>(3);
    expect(queue.isEmpty()).toBe(true);

    expect(() => queue.dequeue()).toThrow('Queue Underflow: queue is empty');
    expect(() => queue.peek()).toThrow('Queue Underflow: queue is empty');
  });
});
