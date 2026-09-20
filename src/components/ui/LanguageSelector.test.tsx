import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { LanguageSelector } from './LanguageSelector';
import { changeLanguage, getCurrentLanguage } from '@/i18n';

describe('LanguageSelector component', () => {
  beforeEach(async () => {
    await act(async () => {
      await changeLanguage('es');
    });
  });

  it('renders radio group with accessible label', () => {
    render(<LanguageSelector />);
    const group = screen.getByRole('radiogroup');
    expect(group).toBeInTheDocument();
    expect(group).toHaveAttribute('aria-label');
  });

  it('renders both language options with ES initially active', () => {
    render(<LanguageSelector />);
    const esOption = screen.getByRole('radio', { name: /español/i });
    const enOption = screen.getByRole('radio', { name: /english/i });

    expect(esOption).toBeInTheDocument();
    expect(enOption).toBeInTheDocument();
    expect(esOption).toHaveAttribute('aria-checked', 'true');
    expect(enOption).toHaveAttribute('aria-checked', 'false');
  });

  it('switches to English when clicking EN option', async () => {
    render(<LanguageSelector />);
    const enOption = screen.getByRole('radio', { name: /english/i });

    await act(async () => {
      fireEvent.click(enOption);
    });

    expect(getCurrentLanguage()).toBe('en');
    expect(enOption).toHaveAttribute('aria-checked', 'true');
  });

  it('switches back to Spanish when clicking ES option', async () => {
    render(<LanguageSelector />);
    const enOption = screen.getByRole('radio', { name: /english/i });
    const esOption = screen.getByRole('radio', { name: /español/i });

    await act(async () => {
      fireEvent.click(enOption);
    });
    expect(getCurrentLanguage()).toBe('en');

    await act(async () => {
      fireEvent.click(esOption);
    });
    expect(getCurrentLanguage()).toBe('es');
    expect(esOption).toHaveAttribute('aria-checked', 'true');
  });

  it('handles keyboard interaction and arrow key navigation properly', async () => {
    render(<LanguageSelector />);
    const esOption = screen.getByRole('radio', { name: /español/i });
    const enOption = screen.getByRole('radio', { name: /english/i });

    expect(esOption).toHaveAttribute('tabindex', '0');
    expect(enOption).toHaveAttribute('tabindex', '-1');

    await act(async () => {
      fireEvent.keyDown(esOption, { key: 'ArrowRight' });
    });

    expect(getCurrentLanguage()).toBe('en');
    expect(enOption).toHaveAttribute('tabindex', '0');
    expect(esOption).toHaveAttribute('tabindex', '-1');

    await act(async () => {
      fireEvent.keyDown(enOption, { key: 'ArrowLeft' });
    });

    expect(getCurrentLanguage()).toBe('es');
    expect(esOption).toHaveAttribute('tabindex', '0');
    expect(enOption).toHaveAttribute('tabindex', '-1');
  });
});
