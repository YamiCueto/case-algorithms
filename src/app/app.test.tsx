import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { App } from './App';
import { changeLanguage } from '@/i18n';

describe('App Root Component', () => {
  beforeEach(async () => {
    await changeLanguage('es');
  });

  it('renders default active lab and switches between Array, Stack, Queue, and Linked List in Spanish', () => {
    render(<App />);

    expect(
      screen.getAllByText('Lista simplemente enlazada y cadenas de punteros')[0]
    ).toBeInTheDocument();

    const arrayTabBtn = screen.getByRole('button', {
      name: 'Cambiar al laboratorio de arreglos',
    });
    fireEvent.click(arrayTabBtn);
    expect(screen.getByText('Exploración de Arreglos y Ordenamiento Burbuja')).toBeInTheDocument();

    const stackTabBtn = screen.getByRole('button', {
      name: 'Cambiar al laboratorio de pilas',
    });
    fireEvent.click(stackTabBtn);
    expect(screen.getByText('Exploración de Pilas y Principio LIFO')).toBeInTheDocument();

    const queueTabBtn = screen.getByRole('button', {
      name: 'Cambiar al laboratorio de colas',
    });
    fireEvent.click(queueTabBtn);
    expect(screen.getByText('Exploración de Colas y Principio FIFO')).toBeInTheDocument();

    const linkedListTabBtn = screen.getByRole('button', {
      name: 'Cambiar al laboratorio de listas enlazadas',
    });
    fireEvent.click(linkedListTabBtn);
    expect(
      screen.getAllByText('Lista simplemente enlazada y cadenas de punteros')[0]
    ).toBeInTheDocument();
  });

  it('switches between laboratories in English when language is toggled', async () => {
    render(<App />);

    await act(async () => {
      await changeLanguage('en');
    });

    const arrayTabBtn = screen.getByRole('button', {
      name: 'Switch to Array Laboratory',
    });
    fireEvent.click(arrayTabBtn);
    expect(screen.getByText('Array & Bubble Sort Exploration')).toBeInTheDocument();

    const stackTabBtn = screen.getByRole('button', {
      name: 'Switch to Stack Laboratory',
    });
    fireEvent.click(stackTabBtn);
    expect(screen.getByText('Stack & LIFO Principle Exploration')).toBeInTheDocument();

    const queueTabBtn = screen.getByRole('button', {
      name: 'Switch to Queue Laboratory',
    });
    fireEvent.click(queueTabBtn);
    expect(screen.getByText('Queue & FIFO Principle Exploration')).toBeInTheDocument();

    const linkedListTabBtn = screen.getByRole('button', {
      name: 'Switch to Linked List Laboratory',
    });
    fireEvent.click(linkedListTabBtn);
    expect(
      screen.getAllByText('Singly Linked List & Pointer Chains')[0]
    ).toBeInTheDocument();
  });
});
