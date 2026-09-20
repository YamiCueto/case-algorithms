import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { QueueLab } from './QueueLab';
import { changeLanguage } from '@/i18n';

describe('QueueLab Component', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    await changeLanguage('es');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial queue laboratory with Spanish content by default', () => {
    render(<QueueLab />);

    expect(screen.getByText('Exploración de Colas y Principio FIFO')).toBeInTheDocument();
    expect(screen.getByText('Laboratorio interactivo: Estructura de datos Cola')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Encolar valor en la cola' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Desencolar valor del frente' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mirar valor del frente' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Vaciar cola' })).toBeInTheDocument();
    expect(screen.getByText('Inspector de estado y capacidad')).toBeInTheDocument();
    expect(screen.getByText('01. Descubrir')).toBeInTheDocument();
  });

  it('renders queue laboratory in English when language is switched', async () => {
    render(<QueueLab />);

    await act(async () => {
      await changeLanguage('en');
    });

    expect(screen.getByText('Queue & FIFO Principle Exploration')).toBeInTheDocument();
    expect(screen.getByText('Interactive Laboratory: Queue Data Structure')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enqueue value into queue' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Dequeue front value' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Peek front value' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear queue' })).toBeInTheDocument();
    expect(screen.getByText('State & Capacity Inspector')).toBeInTheDocument();
    expect(screen.getByText('01. Discover')).toBeInTheDocument();
  });

  it('handles user enqueue operation with custom value', () => {
    render(<QueueLab />);

    const input = screen.getByLabelText('Valor a encolar');
    const enqueueBtn = screen.getByRole('button', { name: 'Encolar valor en la cola' });

    fireEvent.change(input, { target: { value: '99' } });
    fireEvent.click(enqueueBtn);

    expect(screen.getByText('99')).toBeInTheDocument();
  });

  it('shows validation error for invalid numeric input', () => {
    render(<QueueLab />);

    const input = screen.getByLabelText('Valor a encolar');
    const enqueueBtn = screen.getByRole('button', { name: 'Encolar valor en la cola' });

    fireEvent.change(input, { target: { value: 'abc' } });
    fireEvent.click(enqueueBtn);

    expect(screen.getByText(/Número inválido/i)).toBeInTheDocument();
  });

  it('handles dequeue operation and updates queue contents', () => {
    render(<QueueLab />);

    const dequeueBtn = screen.getByRole('button', { name: 'Desencolar valor del frente' });
    fireEvent.click(dequeueBtn);

    expect(screen.getByRole('button', { name: 'Retroceder un paso' })).not.toBeDisabled();
  });

  it('handles peek front operation', () => {
    render(<QueueLab />);

    const peekBtn = screen.getByRole('button', { name: 'Mirar valor del frente' });
    fireEvent.click(peekBtn);

    expect(screen.getByRole('button', { name: 'Retroceder un paso' })).not.toBeDisabled();
  });

  it('clears queue when clear button is clicked in both languages', async () => {
    render(<QueueLab />);

    const clearBtnEs = screen.getByRole('button', { name: 'Vaciar cola' });
    fireEvent.click(clearBtnEs);

    expect(screen.getByText(/Capacidad de búfer: 6 \| Elementos: 0/i)).toBeInTheDocument();

    await act(async () => {
      await changeLanguage('en');
    });

    expect(screen.getByText(/Buffer Capacity: 6 \| Count: 0/i)).toBeInTheDocument();
  });

  it('changes queue capacity', () => {
    render(<QueueLab />);

    const cap4Btn = screen.getByRole('button', { name: '4' });
    fireEvent.click(cap4Btn);

    expect(screen.getByText(/Capacidad de búfer: 4/i)).toBeInTheDocument();
  });

  it('switches between preset demo sequences in Spanish and English', async () => {
    render(<QueueLab />);

    const overflowPresetEs = screen.getByRole('button', { name: 'Demostración de desbordamiento [Llenar Cap 5 + 1]' });
    fireEvent.click(overflowPresetEs);

    expect(screen.getByText(/Capacidad de búfer: 5/i)).toBeInTheDocument();

    await act(async () => {
      await changeLanguage('en');
    });

    const overflowPresetEn = screen.getByRole('button', { name: 'Overflow Demo [Fill Cap 5 + 1]' });
    fireEvent.click(overflowPresetEn);

    expect(screen.getByText(/Buffer Capacity: 5/i)).toBeInTheDocument();
  });

  it('navigates through pedagogical phases in both languages', async () => {
    render(<QueueLab />);

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

  it('handles auto-play playback loop in Spanish', () => {
    render(<QueueLab />);

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

  it('updates A11yAnnouncer live region with accessible narrative messages', () => {
    render(<QueueLab />);

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveTextContent(/Empty queue initialized with capacity 6/i);

    const stepForwardBtn = screen.getByRole('button', { name: 'Avanzar un paso' });
    fireEvent.click(stepForwardBtn);

    expect(liveRegion).toHaveTextContent(/Enqueued value 10 at REAR/i);
  });

  it('supports time-travel navigation via global keyboard shortcuts', () => {
    render(<QueueLab />);

    const liveRegion = screen.getByRole('status');

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText('Índice de paso:')).toBeInTheDocument();
    expect(liveRegion).toHaveTextContent(/Enqueued value 10/i);

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(liveRegion).toHaveTextContent(/Empty queue initialized/i);

    fireEvent.keyDown(window, { key: 'End' });
    expect(liveRegion).toHaveTextContent(/Queue sequence completed/i);

    fireEvent.keyDown(window, { key: 'Home' });
    expect(liveRegion).toHaveTextContent(/Empty queue initialized/i);

    fireEvent.keyDown(window, { key: 'r' });
    expect(liveRegion).toHaveTextContent(/Empty queue initialized/i);
  });

  it('does not trigger keyboard shortcuts when typing in the input element', () => {
    render(<QueueLab />);

    const liveRegion = screen.getByRole('status');
    const input = screen.getByLabelText('Valor a encolar');
    input.focus();

    fireEvent.keyDown(input, { key: 'ArrowRight' });
    expect(liveRegion).toHaveTextContent(/Empty queue initialized/i);
  });
});
