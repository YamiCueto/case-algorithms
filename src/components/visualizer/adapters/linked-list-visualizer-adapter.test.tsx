import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LinkedListVisualizerAdapter } from './LinkedListVisualizerAdapter';
import { ExecutionStep } from '@/core/types';
import { LinkedListState } from '@/core/data-structures/linked-list';
import { changeLanguage } from '@/i18n';

describe('LinkedListVisualizerAdapter', () => {
  beforeEach(async () => {
    await changeLanguage('es');
  });

  it('renders fallback message when step is null in both languages', async () => {
    const { rerender } = render(<LinkedListVisualizerAdapter step={null} />);
    expect(screen.getAllByText('No hay datos de lista enlazada disponibles. Realiza una operación para comenzar.')[0]).toBeInTheDocument();

    await changeLanguage('en');
    rerender(<LinkedListVisualizerAdapter step={null} />);
    expect(screen.getAllByText('No linked list data available. Perform an operation to begin.')[0]).toBeInTheDocument();
  });

  it('renders empty list with HEAD pointer and NULL terminator in both languages', async () => {
    const mockStep: ExecutionStep<LinkedListState> = {
      id: 'step-0',
      stepIndex: 0,
      totalSteps: 1,
      action: 'INITIALIZE',
      state: {
        nodes: [],
        headId: null,
        tailId: null,
        size: 0,
      },
      description: 'Initialized empty Singly Linked List (HEAD -> null).',
      a11yMessage: 'Empty Singly Linked List initialized.',
    };

    const { rerender } = render(<LinkedListVisualizerAdapter step={mockStep} />);

    expect(screen.getAllByText('Initialized empty Singly Linked List (HEAD -> null).')[0]).toBeInTheDocument();
    expect(screen.getByText(/Tamaño: 0 nodos/i)).toBeInTheDocument();
    expect(screen.getByText('HEAD')).toBeInTheDocument();
    expect(screen.getByText('NULL')).toBeInTheDocument();

    await changeLanguage('en');
    rerender(<LinkedListVisualizerAdapter step={mockStep} />);

    expect(screen.getByText(/Size: 0 nodes/i)).toBeInTheDocument();
    expect(screen.getByText('HEAD')).toBeInTheDocument();
    expect(screen.getByText('NULL')).toBeInTheDocument();
  });

  it('renders nodes with values, indices, HEAD/TAIL pointers, and NULL terminator', () => {
    const handleClick = vi.fn();
    const mockStep: ExecutionStep<LinkedListState> = {
      id: 'step-1',
      stepIndex: 1,
      totalSteps: 2,
      action: 'APPEND',
      state: {
        nodes: [
          { id: 'node-1', value: 10, nextId: 'node-2', index: 0 },
          { id: 'node-2', value: 20, nextId: null, index: 1 },
        ],
        headId: 'node-1',
        tailId: 'node-2',
        size: 2,
        activeNodeId: 'node-2',
      },
      description: 'Appended node (20) at TAIL.',
      a11yMessage: 'Appended value 20 as new TAIL of the list.',
    };

    render(<LinkedListVisualizerAdapter step={mockStep} onNodeClick={handleClick} />);

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('[0]')).toBeInTheDocument();
    expect(screen.getByText('[1]')).toBeInTheDocument();
    expect(screen.getByText('HEAD')).toBeInTheDocument();
    expect(screen.getByText('TAIL')).toBeInTheDocument();
    expect(screen.getByText('NULL')).toBeInTheDocument();

    fireEvent.click(screen.getByText('10'));
    expect(handleClick).toHaveBeenCalledWith(0, 10);
  });

  it('renders search and found highlights', () => {
    const mockStep: ExecutionStep<LinkedListState> = {
      id: 'step-2',
      stepIndex: 2,
      totalSteps: 3,
      action: 'FOUND',
      state: {
        nodes: [
          { id: 'node-1', value: 10, nextId: 'node-2', index: 0 },
          { id: 'node-2', value: 42, nextId: null, index: 1 },
        ],
        headId: 'node-1',
        tailId: 'node-2',
        size: 2,
        activeNodeId: 'node-2',
        targetIndex: 1,
      },
      description: 'Found target value 42 at index 1.',
      a11yMessage: 'Target value 42 found at index 1.',
    };

    render(<LinkedListVisualizerAdapter step={mockStep} />);
    expect(screen.getAllByText('Found target value 42 at index 1.')[0]).toBeInTheDocument();
  });
});
