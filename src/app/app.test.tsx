import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from './App';

describe('App Root Component', () => {
  it('renders default active lab and switches between Array, Stack, Queue, and Linked List', () => {
    render(<App />);

    expect(
      screen.getAllByText(/(singly linked list & pointer chains|lista simplemente enlazada)/i)[0]
    ).toBeInTheDocument();

    const arrayTabBtn = screen.getByRole('button', {
      name: /(switch to array laboratory|cambiar al laboratorio de arreglos)/i,
    });
    fireEvent.click(arrayTabBtn);
    expect(screen.getByText('Array & Bubble Sort Exploration')).toBeInTheDocument();

    const stackTabBtn = screen.getByRole('button', {
      name: /(switch to stack laboratory|cambiar al laboratorio de pilas)/i,
    });
    fireEvent.click(stackTabBtn);
    expect(screen.getByText('Stack & LIFO Principle Exploration')).toBeInTheDocument();

    const queueTabBtn = screen.getByRole('button', {
      name: /(switch to queue laboratory|cambiar al laboratorio de colas)/i,
    });
    fireEvent.click(queueTabBtn);
    expect(screen.getByText('Queue & FIFO Principle Exploration')).toBeInTheDocument();

    const linkedListTabBtn = screen.getByRole('button', {
      name: /(switch to linked list laboratory|cambiar al laboratorio de listas enlazadas)/i,
    });
    fireEvent.click(linkedListTabBtn);
    expect(
      screen.getAllByText(/(singly linked list & pointer chains|lista simplemente enlazada)/i)[0]
    ).toBeInTheDocument();
  });
});

