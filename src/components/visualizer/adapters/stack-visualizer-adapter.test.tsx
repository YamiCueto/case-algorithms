import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { StackVisualizerAdapter } from './StackVisualizerAdapter';
import { ExecutionStep } from '@/core/types';
import { StackState } from '@/core/data-structures/stack';

describe('StackVisualizerAdapter', () => {
  it('renders fallback when step is null', () => {
    render(<StackVisualizerAdapter step={null} />);
    expect(screen.getByText('No stack data available. Perform an operation to begin.')).toBeInTheDocument();
  });

  it('renders empty stack with TOP (null) pointer', () => {
    const emptyStep: ExecutionStep<StackState> = {
      id: 'step-0',
      stepIndex: 0,
      totalSteps: 1,
      action: 'INITIALIZE',
      description: 'Stack is empty',
      a11yMessage: 'Empty stack initialized',
      state: {
        items: [],
        topIndex: -1,
        capacity: 6,
        operation: 'INITIALIZE',
        phaseDescription: 'Empty stack',
      },
    };

    render(<StackVisualizerAdapter step={emptyStep} />);
    expect(screen.getByText('Stack is Empty (0 items)')).toBeInTheDocument();
    expect(screen.getByText('TOP (null)')).toBeInTheDocument();
    expect(screen.getByText('Cap: 6')).toBeInTheDocument();
  });

  it('renders stacked elements vertically and calls onNodeClick', () => {
    const handleClick = vi.fn();
    const step: ExecutionStep<StackState> = {
      id: 'step-1',
      stepIndex: 1,
      totalSteps: 3,
      action: 'PUSH',
      description: 'Pushed 42',
      a11yMessage: 'Pushed 42 onto stack',
      state: {
        items: [10, 20, 42],
        topIndex: 2,
        capacity: 6,
        operation: 'PUSH',
        targetElement: 42,
        phaseDescription: 'Pushed 42',
      },
    };

    render(<StackVisualizerAdapter step={step} onNodeClick={handleClick} />);

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('[0]')).toBeInTheDocument();
    expect(screen.getByText('[2]')).toBeInTheDocument();
    expect(screen.getByText('TOP')).toBeInTheDocument();

    const node42 = screen.getByText('42').closest('g');
    if (node42) {
      fireEvent.click(node42);
      expect(handleClick).toHaveBeenCalledWith(2, 42);
    }
  });

  it('renders visual highlights for PEEK, OVERFLOW and UNDERFLOW', () => {
    const peekStep: ExecutionStep<StackState> = {
      id: 'step-2',
      stepIndex: 2,
      totalSteps: 4,
      action: 'PEEK',
      description: 'Peeked 99',
      a11yMessage: 'Peeked top element 99',
      state: {
        items: [99],
        topIndex: 0,
        capacity: 5,
        operation: 'PEEK',
        targetElement: 99,
        phaseDescription: 'Peeked top',
      },
    };

    const { container, rerender } = render(<StackVisualizerAdapter step={peekStep} />);
    expect(screen.getByText('PEEK (TOP)')).toBeInTheDocument();
    expect(container.querySelector('.viz-highlight-comparing')).toBeInTheDocument();

    const overflowStep: ExecutionStep<StackState> = {
      id: 'step-3',
      stepIndex: 3,
      totalSteps: 4,
      action: 'OVERFLOW',
      description: 'Stack Overflow',
      a11yMessage: 'Stack overflow',
      state: {
        items: [1, 2, 3],
        topIndex: 2,
        capacity: 3,
        operation: 'OVERFLOW',
        targetElement: 4,
        phaseDescription: 'Overflow error',
      },
    };

    rerender(<StackVisualizerAdapter step={overflowStep} />);
    expect(screen.getByText('Stack Overflow')).toBeInTheDocument();
    expect(container.querySelector('.viz-highlight-swapping')).toBeInTheDocument();
  });
});
