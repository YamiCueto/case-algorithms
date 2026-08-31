import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArrayVisualizerAdapter } from './ArrayVisualizerAdapter';
import { ExecutionStep } from '@/core/types';
import { ArrayState } from '@/core/data-structures/array';

describe('ArrayVisualizerAdapter', () => {
  it('renders fallback when step is null', () => {
    render(<ArrayVisualizerAdapter step={null} />);
    expect(screen.getByText('No array data available. Provide input to begin.')).toBeInTheDocument();
  });

  it('renders empty array state when array is empty', () => {
    const emptyStep: ExecutionStep<ArrayState> = {
      id: 'step-0',
      stepIndex: 0,
      totalSteps: 1,
      action: 'COMPLETE',
      description: 'Empty Array',
      a11yMessage: 'Array is empty',
      state: {
        array: [],
        sortedIndices: [],
        phaseDescription: 'Empty state',
      },
    };

    render(<ArrayVisualizerAdapter step={emptyStep} />);
    expect(screen.getByText('Empty Array []')).toBeInTheDocument();
  });

  it('renders array elements as VisualNodes and calls onNodeClick', () => {
    const handleClick = vi.fn();
    const step: ExecutionStep<ArrayState> = {
      id: 'step-1',
      stepIndex: 1,
      totalSteps: 5,
      action: 'INITIALIZE',
      description: 'Initial Array',
      a11yMessage: 'Array with 3 elements',
      state: {
        array: [10, 20, 30],
        sortedIndices: [],
        phaseDescription: 'Initial phase',
      },
    };

    render(<ArrayVisualizerAdapter step={step} onNodeClick={handleClick} />);

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('[0]')).toBeInTheDocument();
    expect(screen.getByText('[1]')).toBeInTheDocument();
    expect(screen.getByText('[2]')).toBeInTheDocument();

    const node10 = screen.getByText('10').closest('g');
    if (node10) {
      fireEvent.click(node10);
      expect(handleClick).toHaveBeenCalledWith(0, 10);
    }
  });

  it('renders visual highlights and node states for comparing and swapping', () => {
    const stepComparing: ExecutionStep<ArrayState> = {
      id: 'step-2',
      stepIndex: 2,
      totalSteps: 5,
      action: 'COMPARE',
      description: 'Comparing 10 and 20',
      a11yMessage: 'Comparing index 0 and 1',
      pointers: [
        { id: 'ptr-j', index: 0, label: 'j', colorVar: 'var(--pointer-low)' },
        { id: 'ptr-next', index: 1, label: 'j+1', colorVar: 'var(--pointer-mid)' },
      ],
      state: {
        array: [10, 20, 30],
        sortedIndices: [2],
        comparingIndices: [0, 1],
        phaseDescription: 'Comparing pair',
      },
    };

    const { container, rerender } = render(<ArrayVisualizerAdapter step={stepComparing} />);

    expect(screen.getByText('Comparing 10 and 20')).toBeInTheDocument();
    expect(container.querySelector('.viz-highlight-comparing')).toBeInTheDocument();
    expect(screen.getByText('j')).toBeInTheDocument();
    expect(screen.getByText('j+1')).toBeInTheDocument();

    const node0 = screen.getByText('10').closest('g');
    const node2 = screen.getByText('30').closest('g');
    expect(node0).toHaveClass('viz-node-comparing');
    expect(node2).toHaveClass('viz-node-sorted');

    const stepSwapping: ExecutionStep<ArrayState> = {
      id: 'step-3',
      stepIndex: 3,
      totalSteps: 5,
      action: 'SWAP',
      description: 'Swapped 10 and 20',
      a11yMessage: 'Swapped index 0 and 1',
      state: {
        array: [20, 10, 30],
        sortedIndices: [2],
        swappedIndices: [0, 1],
        phaseDescription: 'Swapped pair',
      },
    };

    rerender(<ArrayVisualizerAdapter step={stepSwapping} />);
    expect(screen.getByText('Swapped 10 and 20')).toBeInTheDocument();
    expect(container.querySelector('.viz-highlight-swapping')).toBeInTheDocument();
    const swappedNode = screen.getByText('20').closest('g');
    expect(swappedNode).toHaveClass('viz-node-swapping');
  });
});
