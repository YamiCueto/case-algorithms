import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArrayLab } from './ArrayLab';

describe('ArrayLab Component', () => {
  it('renders initial laboratory with default array and controls', () => {
    render(<ArrayLab />);

    expect(screen.getByText('Array & Bubble Sort Exploration')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /play auto execution/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /step forward/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /step backwards/i })).toBeInTheDocument();
  });

  it('navigates through steps using next, previous, first, and last buttons', () => {
    render(<ArrayLab />);

    const stepForwardBtn = screen.getByRole('button', { name: /step forward/i });
    const stepBackBtn = screen.getByRole('button', { name: /step backwards/i });
    const lastBtn = screen.getByRole('button', { name: /jump to last step/i });
    const firstBtn = screen.getByRole('button', { name: /jump to first step/i });

    expect(stepBackBtn).toBeDisabled();
    expect(firstBtn).toBeDisabled();

    fireEvent.click(stepForwardBtn);
    expect(stepBackBtn).not.toBeDisabled();
    expect(screen.getByText(/step index:/i)).toBeInTheDocument();

    fireEvent.click(lastBtn);
    expect(stepForwardBtn).toBeDisabled();
    expect(lastBtn).toBeDisabled();
    expect(screen.getByText(/sorted \(complete\)/i)).toBeInTheDocument();

    fireEvent.click(firstBtn);
    expect(firstBtn).toBeDisabled();
    expect(stepForwardBtn).not.toBeDisabled();
  });

  it('loads and runs sorting for custom array input', () => {
    render(<ArrayLab />);

    const input = screen.getByLabelText(/array input values/i);
    const loadBtn = screen.getByRole('button', { name: /run sort/i });

    fireEvent.change(input, { target: { value: '99, 11, 44' } });
    fireEvent.click(loadBtn);

    expect(screen.getByText('99')).toBeInTheDocument();
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('44')).toBeInTheDocument();
  });

  it('switches between pedagogical progression tabs', () => {
    render(<ArrayLab />);

    const explainTab = screen.getByRole('button', { name: /04\. explain/i });
    fireEvent.click(explainTab);
    expect(screen.getByText(/explain time & space complexity/i)).toBeInTheDocument();
    expect(screen.getByText(/O\(n²\)/i)).toBeInTheDocument();

    const pseudocodeTab = screen.getByRole('button', { name: /06\. pseudocode/i });
    fireEvent.click(pseudocodeTab);
    expect(screen.getByText(/procedure bubbleSort/i)).toBeInTheDocument();

    const codeTab = screen.getByRole('button', { name: /07\. code/i });
    fireEvent.click(codeTab);
    expect(screen.getByText(/export function bubbleSort/i)).toBeInTheDocument();

    const challengeTab = screen.getByRole('button', { name: /10\. challenge/i });
    fireEvent.click(challengeTab);
    expect(screen.getByText(/algorithm mastery challenge/i)).toBeInTheDocument();
  });
});
