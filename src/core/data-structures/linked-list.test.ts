import { describe, it, expect } from 'vitest';
import { SinglyLinkedList } from './linked-list';

describe('SinglyLinkedList Data Structure', () => {
  it('initializes empty with head/tail null and size 0', () => {
    const list = new SinglyLinkedList<number>();
    expect(list.isEmpty()).toBe(true);
    expect(list.size()).toBe(0);
    expect(list.getHead()).toBeNull();
    expect(list.getTail()).toBeNull();
    expect(list.toArray()).toEqual([]);
    expect(list.toNodeStates()).toEqual([]);
  });

  it('prepends nodes to head in O(1) time', () => {
    const list = new SinglyLinkedList<number>();
    const node1 = list.prepend(10);
    expect(list.size()).toBe(1);
    expect(list.getHead()).toBe(node1);
    expect(list.getTail()).toBe(node1);
    expect(list.toArray()).toEqual([10]);

    const node2 = list.prepend(5);
    expect(list.size()).toBe(2);
    expect(list.getHead()).toBe(node2);
    expect(list.getHead()?.next).toBe(node1);
    expect(list.getTail()).toBe(node1);
    expect(list.toArray()).toEqual([5, 10]);
  });

  it('appends nodes to tail in O(1) time using tail pointer', () => {
    const list = new SinglyLinkedList<number>();
    const node1 = list.append(100);
    expect(list.getHead()).toBe(node1);
    expect(list.getTail()).toBe(node1);

    const node2 = list.append(200);
    expect(list.size()).toBe(2);
    expect(list.getHead()).toBe(node1);
    expect(list.getTail()).toBe(node2);
    expect(node1.next).toBe(node2);
    expect(list.toArray()).toEqual([100, 200]);
  });

  it('inserts nodes at specified indices (head, middle, tail)', () => {
    const list = new SinglyLinkedList<number>();
    list.append(10);
    list.append(30);

    const middleNode = list.insertAt(1, 20);
    expect(list.toArray()).toEqual([10, 20, 30]);
    expect(list.size()).toBe(3);
    expect(middleNode.value).toBe(20);

    list.insertAt(0, 5);
    expect(list.toArray()).toEqual([5, 10, 20, 30]);

    list.insertAt(4, 40);
    expect(list.toArray()).toEqual([5, 10, 20, 30, 40]);
    expect(list.getTail()?.value).toBe(40);
  });

  it('throws error on out of bounds insertAt', () => {
    const list = new SinglyLinkedList<number>();
    list.append(1);
    expect(() => list.insertAt(-1, 99)).toThrow(/Index out of bounds/i);
    expect(() => list.insertAt(2, 99)).toThrow(/Index out of bounds/i);
  });

  it('removes nodes at head, middle, and tail updating pointers properly', () => {
    const list = new SinglyLinkedList<number>();
    list.append(10);
    list.append(20);
    list.append(30);
    list.append(40);

    const removedMiddle = list.removeAt(1);
    expect(removedMiddle).toBe(20);
    expect(list.toArray()).toEqual([10, 30, 40]);

    const removedHead = list.removeAt(0);
    expect(removedHead).toBe(10);
    expect(list.toArray()).toEqual([30, 40]);
    expect(list.getHead()?.value).toBe(30);

    const removedTail = list.removeAt(1);
    expect(removedTail).toBe(40);
    expect(list.toArray()).toEqual([30]);
    expect(list.getHead()?.value).toBe(30);
    expect(list.getTail()?.value).toBe(30);

    const removedLast = list.removeAt(0);
    expect(removedLast).toBe(30);
    expect(list.isEmpty()).toBe(true);
    expect(list.getHead()).toBeNull();
    expect(list.getTail()).toBeNull();
  });

  it('throws error on invalid removeAt', () => {
    const list = new SinglyLinkedList<number>();
    expect(() => list.removeAt(0)).toThrow(/Index out of bounds/i);

    list.append(10);
    expect(() => list.removeAt(-1)).toThrow(/Index out of bounds/i);
    expect(() => list.removeAt(1)).toThrow(/Index out of bounds/i);
  });

  it('finds existing elements and returns null for missing elements', () => {
    const list = new SinglyLinkedList<number>();
    list.append(10);
    list.append(25);
    list.append(50);

    const match = list.find((v) => v === 25);
    expect(match).not.toBeNull();
    expect(match?.index).toBe(1);
    expect(match?.value).toBe(25);

    const missing = list.find((v) => v === 999);
    expect(missing).toBeNull();
  });

  it('clears all nodes cleanly', () => {
    const list = new SinglyLinkedList<number>();
    list.append(1);
    list.append(2);
    list.clear();
    expect(list.isEmpty()).toBe(true);
    expect(list.size()).toBe(0);
    expect(list.getHead()).toBeNull();
    expect(list.getTail()).toBeNull();
  });
});
