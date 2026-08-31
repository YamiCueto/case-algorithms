import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueueVisualizerAdapter } from './QueueVisualizerAdapter';
import { ExecutionStep } from '@/core/types';
import { QueueState } from '@/core/data-structures/queue';

describe('QueueVisualizerAdapter', () => {
  it('renders fallback message when step is null', () => {
    render(<QueueVisualizerAdapter step={null} />);
    expect(screen.getByText(/No queue data available/i)).toBeInTheDocument();
  });

  it('renders empty queue with capacity indicators and pipe labels', () => {
    const mockStep: ExecutionStep<QueueState> = {
      id: 'step-0',
      stepIndex: 0,
      totalSteps: 1,
      action: 'INITIALIZE',
      state: {
        buffer: [null, null, null, null, null, null],
        items: [],
        frontIndex: -1,
        rearIndex: -1,
        count: 0,
        capacity: 6,
      },
      description: 'Empty queue initialized with capacity 6.',
      a11yMessage: 'Empty queue initialized with capacity 6.',
    };

    render(<QueueVisualizerAdapter step={mockStep} />);

    expect(screen.getAllByText('Empty queue initialized with capacity 6.')[0]).toBeInTheDocument();
    expect(screen.getByText(/Buffer Capacity: 6 \| Count: 0/i)).toBeInTheDocument();
    expect(screen.getByText(/Outflow \(FRONT\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Inflow \(REAR\)/i)).toBeInTheDocument();
    expect(screen.getByText('[0]')).toBeInTheDocument();
    expect(screen.getByText('[5]')).toBeInTheDocument();
  });

  it('renders items with FRONT and REAR pointers and handles node clicks', () => {
    const handleClick = vi.fn();
    const mockStep: ExecutionStep<QueueState> = {
      id: 'step-1',
      stepIndex: 1,
      totalSteps: 2,
      action: 'ENQUEUE',
      state: {
        buffer: [10, 20, 30, null, null, null],
        items: [10, 20, 30],
        frontIndex: 0,
        rearIndex: 2,
        count: 3,
        capacity: 6,
      },
      description: 'Enqueued value 30 at REAR.',
      a11yMessage: 'Enqueued value 30 at REAR of queue.',
    };

    render(<QueueVisualizerAdapter step={mockStep} onNodeClick={handleClick} />);

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('FRONT')).toBeInTheDocument();
    expect(screen.getByText('REAR')).toBeInTheDocument();

    fireEvent.click(screen.getByText('10'));
    expect(handleClick).toHaveBeenCalledWith(0, 10);
  });

  it('renders OVERFLOW state description and error cues', () => {
    const mockStep: ExecutionStep<QueueState> = {
      id: 'step-2',
      stepIndex: 2,
      totalSteps: 3,
      action: 'OVERFLOW',
      state: {
        buffer: [1, 2, 3, 4],
        items: [1, 2, 3, 4],
        frontIndex: 0,
        rearIndex: 3,
        count: 4,
        capacity: 4,
      },
      description: 'Queue Overflow: Cannot enqueue value 99.',
      a11yMessage: 'Queue Overflow: Cannot enqueue value 99.',
    };

    render(<QueueVisualizerAdapter step={mockStep} />);
    expect(screen.getAllByText('Queue Overflow: Cannot enqueue value 99.')[0]).toBeInTheDocument();
  });
});
