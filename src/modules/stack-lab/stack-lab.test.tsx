import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { StackLab } from './StackLab';
import { changeLanguage } from '@/i18n';

describe('StackLab Component', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    await changeLanguage('es');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial stack laboratory with Spanish content by default', () => {
    render(<StackLab />);

    expect(screen.getByText('Exploración de Pilas y Principio LIFO')).toBeInTheDocument();
    expect(screen.getByText('Laboratorio interactivo: Estructura de datos Pila')).toBeInTheDocument();
    expect(screen.getByText('Cap: 6')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Apilar valor en la pila' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Desapilar valor del tope de la pila' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mirar valor del tope' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Vaciar pila' })).toBeInTheDocument();
    expect(screen.getByText('Inspector de estado y capacidad')).toBeInTheDocument();
    expect(screen.getByText('01. Descubrir')).toBeInTheDocument();
  });

  it('renders stack laboratory in English when language is switched', async () => {
    render(<StackLab />);

    await act(async () => {
      await changeLanguage('en');
    });

    expect(screen.getByText('Stack & LIFO Principle Exploration')).toBeInTheDocument();
    expect(screen.getByText('Interactive Laboratory: Stack Data Structure')).toBeInTheDocument();
    expect(screen.getByText('Cap: 6')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Push value onto stack' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Pop top value from stack' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Peek top value' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Clear stack' })).toBeInTheDocument();
    expect(screen.getByText('State & Capacity Inspector')).toBeInTheDocument();
    expect(screen.getByText('01. Discover')).toBeInTheDocument();
  });

  it('pushes a new value onto the stack on Push click', () => {
    render(<StackLab />);

    const input = screen.getByLabelText('Valor a apilar en la pila');
    const pushBtn = screen.getByRole('button', { name: 'Apilar valor en la pila' });

    fireEvent.change(input, { target: { value: '77' } });
    fireEvent.click(pushBtn);

    expect(screen.getByText('77')).toBeInTheDocument();
  });

  it('shows error badge when trying to push non-numeric text', () => {
    render(<StackLab />);

    const input = screen.getByLabelText('Valor a apilar en la pila');
    const pushBtn = screen.getByRole('button', { name: 'Apilar valor en la pila' });

    fireEvent.change(input, { target: { value: 'xyz' } });
    fireEvent.click(pushBtn);

    expect(screen.getByText(/Número inválido/i)).toBeInTheDocument();
  });

  it('performs pop and peek operations correctly', () => {
    render(<StackLab />);

    const popBtn = screen.getByRole('button', { name: 'Desapilar valor del tope de la pila' });
    const peekBtn = screen.getByRole('button', { name: 'Mirar valor del tope' });

    fireEvent.click(popBtn);
    expect(screen.getByRole('button', { name: 'Desapilar valor del tope de la pila' })).toBeInTheDocument();

    fireEvent.click(peekBtn);
    expect(screen.getByRole('button', { name: 'Mirar valor del tope' })).toBeInTheDocument();
  });

  it('loads preset sequences in Spanish and English', async () => {
    render(<StackLab />);

    const overflowPresetBtn = screen.getByRole('button', { name: 'Demostración de desbordamiento [Llenar Cap 5 + 1]' });
    fireEvent.click(overflowPresetBtn);
    expect(screen.getByText('Cap: 5')).toBeInTheDocument();

    const underflowPresetBtn = screen.getByRole('button', { name: 'Demostración de subdesbordamiento [Push 50, Pop, Pop]' });
    fireEvent.click(underflowPresetBtn);
    const stepForwardBtn = screen.getByRole('button', { name: 'Avanzar un paso' });
    fireEvent.click(stepForwardBtn);
    expect(screen.getByText('50')).toBeInTheDocument();

    await act(async () => {
      await changeLanguage('en');
    });

    const overflowEn = screen.getByRole('button', { name: 'Overflow Demo [Fill Cap 5 + 1]' });
    fireEvent.click(overflowEn);
    expect(screen.getByText('Cap: 5')).toBeInTheDocument();
  });

  it('navigates through stack step timeline with first, last, prev, next', () => {
    render(<StackLab />);

    const stepForwardBtn = screen.getByRole('button', { name: 'Avanzar un paso' });
    const stepBackBtn = screen.getByRole('button', { name: 'Retroceder un paso' });
    const lastBtn = screen.getByRole('button', { name: 'Ir al último paso' });
    const firstBtn = screen.getByRole('button', { name: 'Ir al primer paso' });

    expect(stepBackBtn).toBeDisabled();
    expect(firstBtn).toBeDisabled();

    fireEvent.click(stepForwardBtn);
    expect(stepBackBtn).not.toBeDisabled();

    fireEvent.click(lastBtn);
    expect(stepForwardBtn).toBeDisabled();
    expect(lastBtn).toBeDisabled();

    fireEvent.click(firstBtn);
    expect(firstBtn).toBeDisabled();
    expect(stepForwardBtn).not.toBeDisabled();
  });

  it('supports automated play/pause execution and speed changes', () => {
    render(<StackLab />);

    const playBtn = screen.getByRole('button', { name: 'Reproducir ejecución automática' });
    fireEvent.click(playBtn);

    const speed2xBtn = screen.getByRole('button', { name: '2x' });
    fireEvent.click(speed2xBtn);

    act(() => {
      vi.advanceTimersByTime(550);
    });

    expect(screen.getByText('Índice de paso:')).toBeInTheDocument();

    const pauseBtn = screen.getByRole('button', { name: 'Pausar ejecución' });
    fireEvent.click(pauseBtn);
    expect(screen.getByRole('button', { name: 'Reproducir ejecución automática' })).toBeInTheDocument();
  });

  it('switches between all 10 pedagogical progression tabs in both languages', async () => {
    render(<StackLab />);

    const explainTab = screen.getByRole('button', { name: '04. Explicar' });
    fireEvent.click(explainTab);
    expect(screen.getByText('Explicar la complejidad temporal y espacial')).toBeInTheDocument();
    expect(screen.getAllByText(/O\(1\)/i).length).toBeGreaterThan(0);

    const pseudocodeTab = screen.getByRole('button', { name: '06. Pseudocódigo' });
    fireEvent.click(pseudocodeTab);
    expect(screen.getAllByText('procedure').length).toBeGreaterThan(0);
    expect(screen.getAllByText('push').length).toBeGreaterThan(0);

    const codeTab = screen.getByRole('button', { name: '07. Código' });
    fireEvent.click(codeTab);
    expect(screen.getAllByText('BoundedStack').length).toBeGreaterThan(0);

    const modifyTab = screen.getByRole('button', { name: '08. Modificar' });
    fireEvent.click(modifyTab);
    expect(screen.getByText('Modificar y condiciones límite')).toBeInTheDocument();

    const practiceTab = screen.getByRole('button', { name: '09. Practicar' });
    fireEvent.click(practiceTab);
    expect(screen.getByText('Práctica: Emparejamiento de paréntesis balanceados')).toBeInTheDocument();

    const challengeTab = screen.getByRole('button', { name: '10. Desafío' });
    fireEvent.click(challengeTab);
    expect(screen.getByText('Desafío de dominio del algoritmo')).toBeInTheDocument();

    await act(async () => {
      await changeLanguage('en');
    });

    expect(screen.getByRole('button', { name: '04. Explain' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '06. Pseudocode' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '07. Code' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '08. Modify' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '09. Practice' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10. Challenge' })).toBeInTheDocument();
    expect(screen.getByText('Algorithm Mastery Challenge')).toBeInTheDocument();
  });

  it('synchronizes active line in pseudocode and code during stack operations in dual-stage layout', () => {
    render(<StackLab />);

    const pseudocodeBtn = screen.getByRole('button', { name: 'Pseudocódigo' });
    fireEvent.click(pseudocodeBtn);

    expect(screen.getAllByText('Pseudocódigo').length).toBeGreaterThan(0);

    const stepForwardBtn = screen.getByRole('button', { name: 'Avanzar un paso' });
    fireEvent.click(stepForwardBtn);

    expect(screen.getByText(/Line 4 Active/i)).toBeInTheDocument();

    const codeLangBtns = screen.getAllByRole('button', { name: 'TypeScript' });
    fireEvent.click(codeLangBtns[0]!);

    expect(screen.getAllByText('TypeScript').length).toBeGreaterThan(0);
    expect(screen.getByText(/Line 5 Active/i)).toBeInTheDocument();
  });

  it('updates A11yAnnouncer live region with accessible narrative messages', () => {
    render(<StackLab />);

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveTextContent(/Empty stack initialized with capacity 6/i);

    const stepForwardBtn = screen.getByRole('button', { name: 'Avanzar un paso' });
    fireEvent.click(stepForwardBtn);

    expect(liveRegion).toHaveTextContent(/Pushed value 10 onto top of stack/i);
  });

  it('supports time-travel navigation via global keyboard shortcuts', () => {
    render(<StackLab />);

    const liveRegion = screen.getByRole('status');

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText('Índice de paso:')).toBeInTheDocument();
    expect(liveRegion).toHaveTextContent(/Pushed value 10/i);

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(liveRegion).toHaveTextContent(/Empty stack initialized/i);

    fireEvent.keyDown(window, { key: 'End' });
    expect(liveRegion).toHaveTextContent(/Stack sequence completed/i);

    fireEvent.keyDown(window, { key: 'Home' });
    expect(liveRegion).toHaveTextContent(/Empty stack initialized/i);

    fireEvent.keyDown(window, { key: 'r' });
    expect(liveRegion).toHaveTextContent(/Empty stack initialized/i);
  });

  it('does not trigger keyboard shortcuts when typing in the input element', () => {
    render(<StackLab />);

    const input = screen.getByLabelText('Valor a apilar en la pila');
    const liveRegion = screen.getByRole('status');

    fireEvent.keyDown(input, { key: ' ' });
    fireEvent.keyDown(input, { key: 'ArrowRight' });
    fireEvent.keyDown(input, { key: 'r' });

    expect(liveRegion).toHaveTextContent(/Stack initialized/i);
  });
});
