import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { LinkedListLab } from './LinkedListLab';
import { changeLanguage } from '@/i18n';

describe('LinkedListLab Component', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    await changeLanguage('es');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial linked list laboratory with Spanish content by default', () => {
    render(<LinkedListLab />);

    expect(screen.getByText('Lista simplemente enlazada y cadenas de punteros')).toBeInTheDocument();
    expect(screen.getByText('Laboratorio interactivo: Lista simplemente enlazada')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Insertar nodo en la cabeza' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Insertar nodo en la cola' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Insertar nodo en el índice' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Eliminar nodo en el índice' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Buscar valor en la lista' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Vaciar lista enlazada' })).toBeInTheDocument();
    expect(screen.getByText('Inspector de estado y punteros')).toBeInTheDocument();
    expect(screen.getByText('01. Descubrir')).toBeInTheDocument();
  });

  it('renders linked list laboratory in English when language is switched', async () => {
    render(<LinkedListLab />);

    await act(async () => {
      await changeLanguage('en');
    });

    expect(screen.getByText('Singly Linked List & Pointer Chains')).toBeInTheDocument();
    expect(screen.getByText('Interactive Laboratory: Singly Linked List')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Prepend node at head' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Append node at tail' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Insert node at index' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove node at index' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Find value in list' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear linked list' })).toBeInTheDocument();
    expect(screen.getByText('State & Pointer Inspector')).toBeInTheDocument();
    expect(screen.getByText('01. Discover')).toBeInTheDocument();
  });

  it('handles user prepend operation in Spanish', () => {
    render(<LinkedListLab />);

    const valInput = screen.getByLabelText('Entrada de valor de nodo');
    const prependBtn = screen.getByRole('button', { name: 'Insertar nodo en la cabeza' });

    fireEvent.change(valInput, { target: { value: '99' } });
    fireEvent.click(prependBtn);

    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('handles user append operation in Spanish', () => {
    render(<LinkedListLab />);

    const valInput = screen.getByLabelText('Entrada de valor de nodo');
    const appendBtn = screen.getByRole('button', { name: 'Insertar nodo en la cola' });

    fireEvent.change(valInput, { target: { value: '77' } });
    fireEvent.click(appendBtn);

    expect(screen.getByText('77')).toBeInTheDocument();
  });

  it('handles user insert at operation in Spanish', () => {
    render(<LinkedListLab />);

    const valInput = screen.getByLabelText('Entrada de valor de nodo');
    const idxInput = screen.getByLabelText('Entrada de índice de nodo');
    const insertBtn = screen.getByRole('button', { name: 'Insertar nodo en el índice' });

    fireEvent.change(valInput, { target: { value: '55' } });
    fireEvent.change(idxInput, { target: { value: '1' } });
    fireEvent.click(insertBtn);

    expect(screen.getByText('55')).toBeInTheDocument();
  });

  it('handles user remove at operation', () => {
    render(<LinkedListLab />);

    const idxInput = screen.getByLabelText('Entrada de índice de nodo');
    const removeBtn = screen.getByRole('button', { name: 'Eliminar nodo en el índice' });

    fireEvent.change(idxInput, { target: { value: '0' } });
    fireEvent.click(removeBtn);

    expect(screen.getByRole('button', { name: 'Retroceder un paso' })).not.toBeDisabled();
  });

  it('handles find operation', () => {
    render(<LinkedListLab />);

    const valInput = screen.getByLabelText('Entrada de valor de nodo');
    const findBtn = screen.getByRole('button', { name: 'Buscar valor en la lista' });

    fireEvent.change(valInput, { target: { value: '20' } });
    fireEvent.click(findBtn);

    expect(screen.getByRole('button', { name: 'Retroceder un paso' })).not.toBeDisabled();
  });

  it('shows error on invalid number input or non-integer index', () => {
    render(<LinkedListLab />);

    const valInput = screen.getByLabelText('Entrada de valor de nodo');
    const appendBtn = screen.getByRole('button', { name: 'Insertar nodo en la cola' });

    fireEvent.change(valInput, { target: { value: 'invalid' } });
    fireEvent.click(appendBtn);

    expect(screen.getByText(/Valor inválido/i)).toBeInTheDocument();

    const idxInput = screen.getByLabelText('Entrada de índice de nodo');
    const insertBtn = screen.getByRole('button', { name: 'Insertar nodo en el índice' });

    fireEvent.change(valInput, { target: { value: '10' } });
    fireEvent.change(idxInput, { target: { value: '3.14' } });
    fireEvent.click(insertBtn);

    expect(screen.getByText(/Índice inválido/i)).toBeInTheDocument();
  });

  it('clears linked list when clear button is clicked in both languages', async () => {
    render(<LinkedListLab />);

    const clearBtnEs = screen.getByRole('button', { name: 'Vaciar lista enlazada' });
    fireEvent.click(clearBtnEs);

    expect(screen.getByText(/Tamaño: 0 nodos/i)).toBeInTheDocument();

    await act(async () => {
      await changeLanguage('en');
    });

    expect(screen.getByText(/Size: 0 nodes/i)).toBeInTheDocument();
  });

  it('switches between preset sequences in Spanish and English', async () => {
    render(<LinkedListLab />);

    const presetBtnEs = screen.getByRole('button', { name: 'Mezcla Prepend y Append [Prepend 5, 2, Append 8, 12]' });
    fireEvent.click(presetBtnEs);

    expect(screen.getByText('Lista simplemente enlazada y cadenas de punteros')).toBeInTheDocument();

    await act(async () => {
      await changeLanguage('en');
    });

    const presetBtnEn = screen.getByRole('button', { name: 'Prepend & Append Mix [Prepend 5, 2, Append 8, 12]' });
    fireEvent.click(presetBtnEn);

    expect(screen.getByText('Singly Linked List & Pointer Chains')).toBeInTheDocument();
  });

  it('navigates through pedagogical phases in both languages', async () => {
    render(<LinkedListLab />);

    const phaseBtnEs = screen.getByRole('button', { name: '06. Pseudocódigo' });
    fireEvent.click(phaseBtnEs);

    expect(screen.getAllByText('Pseudocódigo').length).toBeGreaterThan(0);

    await act(async () => {
      await changeLanguage('en');
    });

    const phaseBtnEn = screen.getByRole('button', { name: '06. Pseudocode' });
    fireEvent.click(phaseBtnEn);

    expect(screen.getAllByText('Pseudocode').length).toBeGreaterThan(0);
  });

  it('handles auto-play playback loop', () => {
    render(<LinkedListLab />);

    const playBtn = screen.getByRole('button', { name: 'Reproducir ejecución automática' });
    fireEvent.click(playBtn);

    expect(screen.getByRole('button', { name: 'Pausar ejecución' })).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1200);
    });

    const pauseBtn = screen.getByRole('button', { name: 'Pausar ejecución' });
    fireEvent.click(pauseBtn);

    expect(screen.getByRole('button', { name: 'Reproducir ejecución automática' })).toBeInTheDocument();
  });

  it('updates A11yAnnouncer live region with accessible messages', () => {
    render(<LinkedListLab />);

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');

    const stepForwardBtn = screen.getByRole('button', { name: 'Avanzar un paso' });
    fireEvent.click(stepForwardBtn);

    expect(liveRegion).toHaveTextContent(/Prepended value/i);
  });

  it('supports time-travel keyboard navigation and isolates typing in input', () => {
    render(<LinkedListLab />);

    const liveRegion = screen.getByRole('status');

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText('Índice de paso:')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByText('Índice de paso:')).toBeInTheDocument();

    const input = screen.getByLabelText('Entrada de valor de nodo');
    input.focus();

    fireEvent.keyDown(input, { key: 'ArrowRight' });
    expect(liveRegion).toBeInTheDocument();
  });
});
