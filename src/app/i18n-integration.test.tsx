import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from './App';
import { changeLanguage, getCurrentLanguage } from '@/i18n';

describe('i18n integration in App and shared components', () => {
  beforeEach(async () => {
    localStorage.clear();
    await act(async () => {
      await changeLanguage('es');
    });
  });

  it('renders initial shared header and navigation in Spanish', () => {
    render(<App />);

    expect(screen.getByText('Laboratorio de Algoritmos')).toBeInTheDocument();
    expect(screen.getByText('v0.2 — Expansión de Estructuras de Datos')).toBeInTheDocument();
    expect(screen.getByText('Seleccionar laboratorio:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cambiar al laboratorio de pilas/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cambiar al laboratorio de arreglos/i })).toBeInTheDocument();
  });

  it('updates header, navigation and breadcrumbs dynamically when switching to English', async () => {
    render(<App />);

    const enRadio = screen.getByRole('radio', { name: /english/i });
    await act(async () => {
      fireEvent.click(enRadio);
    });

    expect(getCurrentLanguage()).toBe('en');
    expect(screen.getByText('Algorithm Laboratory')).toBeInTheDocument();
    expect(screen.getByText('v0.2 — Data Structures Expansion')).toBeInTheDocument();
    expect(screen.getByText('Select Laboratory:')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /switch to stack laboratory/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /switch to array laboratory/i })).toBeInTheDocument();
  });

  it('preserves active lab selection when language changes', async () => {
    render(<App />);

    const stackBtn = screen.getByRole('button', { name: /cambiar al laboratorio de pilas/i });
    await act(async () => {
      fireEvent.click(stackBtn);
    });

    expect(screen.getByText(/stack & lifo principle exploration/i)).toBeInTheDocument();

    const enRadio = screen.getByRole('radio', { name: /english/i });
    await act(async () => {
      fireEvent.click(enRadio);
    });

    expect(screen.getByText(/stack & lifo principle exploration/i)).toBeInTheDocument();

    const esRadio = screen.getByRole('radio', { name: /español/i });
    await act(async () => {
      fireEvent.click(esRadio);
    });

    expect(screen.getByText(/stack & lifo principle exploration/i)).toBeInTheDocument();
  });

  it('translates TimeTravelControls labels and maintains step index on language change', async () => {
    render(<App />);

    const stackBtn = screen.getByRole('button', { name: /cambiar al laboratorio de pilas/i });
    await act(async () => {
      fireEvent.click(stackBtn);
    });

    expect(screen.getByText('Controlador de Pasos (Time-Travel)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reproducir ejecución automática/i })).toBeInTheDocument();

    const stepForwardBtn = screen.getByRole('button', { name: /avanzar un paso/i });
    await act(async () => {
      fireEvent.click(stepForwardBtn);
    });

    const stepIndicatorBefore = document.querySelector('.inspector-val-index');
    const stepTextBefore = stepIndicatorBefore?.textContent;

    const enRadio = screen.getByRole('radio', { name: /english/i });
    await act(async () => {
      fireEvent.click(enRadio);
    });

    expect(screen.getByText('Time-Travel Step Controller')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /play auto execution/i })).toBeInTheDocument();

    const stepIndicatorAfter = document.querySelector('.inspector-val-index');
    expect(stepIndicatorAfter?.textContent).toBe(stepTextBefore);
  });


  it('preserves user input across language changes in Array Laboratory', async () => {
    render(<App />);

    const arrayBtn = screen.getByRole('button', { name: /cambiar al laboratorio de arreglos/i });
    await act(async () => {
      fireEvent.click(arrayBtn);
    });

    const inputField = screen.getByPlaceholderText('e.g. 5, 1, 4, 2, 8');
    await act(async () => {
      fireEvent.change(inputField, { target: { value: '99, 88, 77' } });
    });
    expect(inputField).toHaveValue('99, 88, 77');

    const enRadio = screen.getByRole('radio', { name: /english/i });
    await act(async () => {
      fireEvent.click(enRadio);
    });

    expect(inputField).toHaveValue('99, 88, 77');

    const esRadio = screen.getByRole('radio', { name: /español/i });
    await act(async () => {
      fireEvent.click(esRadio);
    });

    expect(inputField).toHaveValue('99, 88, 77');
  });

  it('preserves Stack Laboratory state and does not duplicate SVG nodes on language change during operations', async () => {
    render(<App />);

    const stackBtn = screen.getByRole('button', { name: /cambiar al laboratorio de pilas/i });
    await act(async () => {
      fireEvent.click(stackBtn);
    });

    const pushInput = screen.getByPlaceholderText('e.g. 42');
    const pushBtn = screen.getByRole('button', { name: /push value onto stack/i });

    await act(async () => {
      fireEvent.change(pushInput, { target: { value: '77' } });
      fireEvent.click(pushBtn);
    });

    const nodesBefore = document.querySelectorAll('.viz-node');
    const countBefore = nodesBefore.length;

    const enRadio = screen.getByRole('radio', { name: /english/i });
    await act(async () => {
      fireEvent.click(enRadio);
    });

    const nodesAfter = document.querySelectorAll('.viz-node');
    expect(nodesAfter.length).toBe(countBefore);

    const esRadio = screen.getByRole('radio', { name: /español/i });
    await act(async () => {
      fireEvent.click(esRadio);
    });

    const nodesFinal = document.querySelectorAll('.viz-node');
    expect(nodesFinal.length).toBe(countBefore);
  });
});
