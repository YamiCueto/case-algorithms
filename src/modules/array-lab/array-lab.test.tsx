import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ArrayLab } from './ArrayLab';
import { changeLanguage } from '@/i18n';

describe('ArrayLab Component', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    await changeLanguage('es');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders initial laboratory with Spanish content by default', () => {
    render(<ArrayLab />);

    expect(screen.getByText('Exploración de Arreglos y Ordenamiento Burbuja')).toBeInTheDocument();
    expect(screen.getByText('Laboratorio interactivo: Estructura de datos Arreglo')).toBeInTheDocument();
    expect(screen.getByText('Configuración de entrada del arreglo')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cargar y ejecutar ordenamiento' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reiniciar al paso inicial' })).toBeInTheDocument();
    expect(screen.getByText('Inspector de estado y métricas')).toBeInTheDocument();
    expect(screen.getByText('01. Descubrir')).toBeInTheDocument();

    expect(screen.getAllByText('5').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
    expect(screen.getAllByText('4').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2').length).toBeGreaterThan(0);
    expect(screen.getAllByText('8').length).toBeGreaterThan(0);
  });

  it('renders laboratory in English when language is switched', async () => {
    render(<ArrayLab />);

    await act(async () => {
      await changeLanguage('en');
    });

    expect(screen.getByText('Array & Bubble Sort Exploration')).toBeInTheDocument();
    expect(screen.getByText('Interactive Laboratory: Array Data Structure')).toBeInTheDocument();
    expect(screen.getByText('Array Input Configuration')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Load and run sorting' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset to initial step' })).toBeInTheDocument();
    expect(screen.getByText('State & Metrics Inspector')).toBeInTheDocument();
    expect(screen.getByText('01. Discover')).toBeInTheDocument();
  });

  it('does not re-run the algorithm when merely typing in the input field', () => {
    render(<ArrayLab />);

    const input = screen.getByLabelText('Valores de entrada del arreglo');
    fireEvent.change(input, { target: { value: '99, 11, 44' } });

    expect(screen.getAllByText('5').length).toBeGreaterThan(0);
    expect(screen.getAllByText('1').length).toBeGreaterThan(0);
    expect(screen.queryByText('99')).toBeNull();
  });

  it('loads and runs sorting in Spanish and in English', async () => {
    const { rerender } = render(<ArrayLab />);

    const inputEs = screen.getByLabelText('Valores de entrada del arreglo');
    const loadBtnEs = screen.getByRole('button', { name: 'Cargar y ejecutar ordenamiento' });

    fireEvent.change(inputEs, { target: { value: '99, 11, 44' } });
    fireEvent.click(loadBtnEs);

    expect(screen.getByText('99')).toBeInTheDocument();
    expect(screen.getAllByText('11').length).toBeGreaterThan(0);
    expect(screen.getByText('44')).toBeInTheDocument();

    await act(async () => {
      await changeLanguage('en');
    });
    rerender(<ArrayLab />);

    const inputEn = screen.getByLabelText('Array input values');
    const loadBtnEn = screen.getByRole('button', { name: 'Load and run sorting' });

    fireEvent.change(inputEn, { target: { value: '77, 33' } });
    fireEvent.click(loadBtnEn);

    expect(screen.getByText('77')).toBeInTheDocument();
    expect(screen.getAllByText('33').length).toBeGreaterThan(0);
  });

  it('displays error badge when user inputs invalid values in both languages', async () => {
    render(<ArrayLab />);

    const input = screen.getByLabelText('Valores de entrada del arreglo');
    const loadBtn = screen.getByRole('button', { name: 'Cargar y ejecutar ordenamiento' });

    fireEvent.change(input, { target: { value: 'abc, 123, @#' } });
    fireEvent.click(loadBtn);

    expect(screen.getByText(/Número inválido/i)).toBeInTheDocument();

    await act(async () => {
      await changeLanguage('en');
    });

    const loadBtnEn = screen.getByRole('button', { name: 'Load and run sorting' });
    fireEvent.click(loadBtnEn);

    expect(screen.getByText(/Invalid number/i)).toBeInTheDocument();
  });

  it('loads preset arrays with localized buttons', async () => {
    render(<ArrayLab />);

    const reversePresetBtnEs = screen.getByRole('button', { name: 'Inverso [5, 4, 3, 2, 1]' });
    fireEvent.click(reversePresetBtnEs);

    expect(screen.getAllByText('5').length).toBeGreaterThan(0);
    expect(screen.getAllByText('4').length).toBeGreaterThan(0);
    expect(screen.getAllByText('3').length).toBeGreaterThan(0);

    await act(async () => {
      await changeLanguage('en');
    });

    expect(screen.getByRole('button', { name: 'Reverse [5, 4, 3, 2, 1]' })).toBeInTheDocument();
  });

  it('navigates through steps and verifies localized inspector status', async () => {
    render(<ArrayLab />);

    const stepForwardBtn = screen.getByRole('button', { name: 'Avanzar un paso' });
    const stepBackBtn = screen.getByRole('button', { name: 'Retroceder un paso' });
    const lastBtn = screen.getByRole('button', { name: 'Ir al último paso' });
    const firstBtn = screen.getByRole('button', { name: 'Ir al primer paso' });

    expect(stepBackBtn).toBeDisabled();
    expect(firstBtn).toBeDisabled();

    fireEvent.click(stepForwardBtn);
    expect(stepBackBtn).not.toBeDisabled();
    expect(screen.getByText('Índice de paso:')).toBeInTheDocument();

    fireEvent.click(lastBtn);
    expect(stepForwardBtn).toBeDisabled();
    expect(lastBtn).toBeDisabled();
    expect(screen.getByText('Ordenado (completo)')).toBeInTheDocument();

    await act(async () => {
      await changeLanguage('en');
    });

    expect(screen.getByText('Step Index:')).toBeInTheDocument();
    expect(screen.getByText('Sorted (Complete)')).toBeInTheDocument();

    const firstBtnEn = screen.getByRole('button', { name: 'Jump to first step' });
    fireEvent.click(firstBtnEn);
    expect(firstBtnEn).toBeDisabled();
  });

  it('supports automated play/pause execution and speed switching', () => {
    render(<ArrayLab />);

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

  it('switches between pedagogical progression tabs in both languages', async () => {
    render(<ArrayLab />);

    const explainTab = screen.getByRole('button', { name: '04. Explicar' });
    fireEvent.click(explainTab);
    expect(screen.getByText('Complejidad matemática e invariantes')).toBeInTheDocument();
    expect(screen.getByText(/O\(n²\)/i)).toBeInTheDocument();

    const pseudocodeTab = screen.getByRole('button', { name: '06. Pseudocódigo' });
    fireEvent.click(pseudocodeTab);
    expect(screen.getAllByText('procedure').length).toBeGreaterThan(0);
    expect(screen.getAllByText('bubbleSort').length).toBeGreaterThan(0);

    const codeTab = screen.getByRole('button', { name: '07. Código' });
    fireEvent.click(codeTab);
    expect(screen.getAllByText('export').length).toBeGreaterThan(0);
    expect(screen.getAllByText('bubbleSort').length).toBeGreaterThan(0);

    const modifyTab = screen.getByRole('button', { name: '08. Modificar' });
    fireEvent.click(modifyTab);
    expect(screen.getByText(/salida temprana activa/i)).toBeInTheDocument();

    const challengeTab = screen.getByRole('button', { name: '10. Desafío' });
    fireEvent.click(challengeTab);
    expect(screen.getByText('Desafío de dominio del algoritmo')).toBeInTheDocument();

    await act(async () => {
      await changeLanguage('en');
    });

    expect(screen.getByRole('button', { name: '04. Explain' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '06. Pseudocode' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '07. Code' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10. Challenge' })).toBeInTheDocument();
    expect(screen.getByText('Algorithm Mastery Challenge')).toBeInTheDocument();
  });

  it('synchronizes active line in pseudocode and code during step execution in dual-stage layout', () => {
    render(<ArrayLab />);

    expect(screen.getAllByText('Pseudocódigo').length).toBeGreaterThan(0);

    const stepForwardBtn = screen.getByRole('button', { name: 'Avanzar un paso' });
    fireEvent.click(stepForwardBtn);

    expect(screen.getByText(/Line 6 Active/i)).toBeInTheDocument();

    const codeLangBtns = screen.getAllByRole('button', { name: 'TypeScript' });
    fireEvent.click(codeLangBtns[0]!);

    expect(screen.getAllByText('TypeScript').length).toBeGreaterThan(0);
    expect(screen.getByText(/Line 7 Active/i)).toBeInTheDocument();
  });

  it('updates A11yAnnouncer live region with accessible narrative messages', () => {
    render(<ArrayLab />);

    const liveRegion = screen.getByRole('status');
    expect(liveRegion).toBeInTheDocument();
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveTextContent(/Array initialized with values/i);

    const stepForwardBtn = screen.getByRole('button', { name: 'Avanzar un paso' });
    fireEvent.click(stepForwardBtn);

    expect(liveRegion).toHaveTextContent(/Comparing index 0 with value 5/i);
  });

  it('supports time-travel navigation via global keyboard shortcuts', () => {
    render(<ArrayLab />);

    const liveRegion = screen.getByRole('status');

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText('Índice de paso:')).toBeInTheDocument();
    expect(liveRegion).toHaveTextContent(/Comparing index 0/i);

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(liveRegion).toHaveTextContent(/Array initialized/i);

    fireEvent.keyDown(window, { key: 'End' });
    expect(screen.getByText('Ordenado (completo)')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Home' });
    expect(liveRegion).toHaveTextContent(/Array initialized/i);

    fireEvent.keyDown(window, { key: 'r' });
    expect(liveRegion).toHaveTextContent(/Array initialized/i);
  });

  it('does not trigger keyboard shortcuts when typing in the input element', () => {
    render(<ArrayLab />);

    const input = screen.getByLabelText('Valores de entrada del arreglo');
    const liveRegion = screen.getByRole('status');

    fireEvent.keyDown(input, { key: ' ' });
    fireEvent.keyDown(input, { key: 'ArrowRight' });
    fireEvent.keyDown(input, { key: 'r' });

    expect(liveRegion).toHaveTextContent(/Array initialized/i);
  });
});
