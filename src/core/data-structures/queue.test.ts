import { describe, it, expect } from 'vitest';
import { BoundedQueue } from './queue';

describe('BoundedQueue Data Structure', () => {
  it('initializes with default capacity and empty state', () => {
    const queue = new BoundedQueue<number>();
    expect(queue.isEmpty()).toBe(true);
    expect(queue.isFull()).toBe(false);
    expect(queue.size()).toBe(0);
    expect(queue.getCapacity()).toBe(8);
    expect(queue.getFrontIndex()).toBe(-1);
    expect(queue.getRearIndex()).toBe(-1);
    expect(queue.toArray()).toEqual([]);
  });

  it('rejects invalid capacity values', () => {
    expect(() => new BoundedQueue<number>(0)).toThrow('Queue capacity must be a positive integer');
    expect(() => new BoundedQueue<number>(-5)).toThrow('Queue capacity must be a positive integer');
    expect(() => new BoundedQueue<number>(3.5)).toThrow('Queue capacity must be a positive integer');
  });

  it('enqueues elements following FIFO order and updates pointers', () => {
    const queue = new BoundedQueue<number>(4);
    queue.enqueue(10);
    expect(queue.size()).toBe(1);
    expect(queue.isEmpty()).toBe(false);
    expect(queue.getFrontIndex()).toBe(0);
    expect(queue.getRearIndex()).toBe(0);
    expect(queue.peek()).toBe(10);

    queue.enqueue(20);
    expect(queue.size()).toBe(2);
    expect(queue.getFrontIndex()).toBe(0);
    expect(queue.getRearIndex()).toBe(1);
    expect(queue.peek()).toBe(10);
    expect(queue.toArray()).toEqual([10, 20]);
  });

  it('dequeues elements in strict FIFO order', () => {
    const queue = new BoundedQueue<number>(4);
    queue.enqueue(10);
    queue.enqueue(20);
    queue.enqueue(30);

    const firstOut = queue.dequeue();
    expect(firstOut).toBe(10);
    expect(queue.size()).toBe(2);
    expect(queue.peek()).toBe(20);
    expect(queue.toArray()).toEqual([20, 30]);

    const secondOut = queue.dequeue();
    expect(secondOut).toBe(20);
    expect(queue.peek()).toBe(30);

    const thirdOut = queue.dequeue();
    expect(thirdOut).toBe(30);
    expect(queue.isEmpty()).toBe(true);
    expect(queue.getFrontIndex()).toBe(-1);
    expect(queue.getRearIndex()).toBe(-1);
  });

  it('peeks at the front element without mutating the queue', () => {
    const queue = new BoundedQueue<string>(3);
    queue.enqueue('A');
    queue.enqueue('B');

    expect(queue.peek()).toBe('A');
    expect(queue.size()).toBe(2);
    expect(queue.peek()).toBe('A');
  });

  it('throws error on Queue Overflow when attempting to enqueue into a full queue', () => {
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

  it('returns a defensive copy from toArray()', () => {
    const queue = new BoundedQueue<number>(3);
    queue.enqueue(100);
    const arr = queue.toArray() as number[];
    arr.push(999);

    expect(queue.size()).toBe(1);
    expect(queue.toArray()).toEqual([100]);
  });
});
