import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import i18n, {
  STORAGE_KEY,
  changeLanguage,
  getCurrentLanguage,
  getStoredLanguage,
  isSupportedLanguage,
  syncDocumentLanguage,
} from './config';

describe('i18n configuration and behavior', () => {
  const originalLang = document.documentElement.lang;

  beforeEach(async () => {
    localStorage.clear();
    await changeLanguage('es');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.lang = originalLang;
  });

  it('sets Spanish as default language on clean state', () => {
    expect(getCurrentLanguage()).toBe('es');
    expect(i18n.language).toBe('es');
    expect(document.documentElement.lang).toBe('es');
  });

  it('allows manual switch to English and syncs document lang', async () => {
    await changeLanguage('en');
    expect(getCurrentLanguage()).toBe('en');
    expect(i18n.language).toBe('en');
    expect(document.documentElement.lang).toBe('en');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('en');
  });

  it('allows switching from English back to Spanish', async () => {
    await changeLanguage('en');
    expect(getCurrentLanguage()).toBe('en');

    await changeLanguage('es');
    expect(getCurrentLanguage()).toBe('es');
    expect(document.documentElement.lang).toBe('es');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('es');
  });

  it('persists preference in localStorage on language change', async () => {
    await changeLanguage('en');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('en');

    await changeLanguage('es');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('es');
  });

  it('recovers with fallback to es when stored language is invalid', () => {
    localStorage.setItem(STORAGE_KEY, 'unsupported-lang');
    expect(getStoredLanguage()).toBe('es');

    localStorage.setItem(STORAGE_KEY, 'de');
    expect(getStoredLanguage()).toBe('es');

    localStorage.setItem(STORAGE_KEY, '');
    expect(getStoredLanguage()).toBe('es');
  });

  it('validates supported languages correctly with isSupportedLanguage', () => {
    expect(isSupportedLanguage('es')).toBe(true);
    expect(isSupportedLanguage('en')).toBe(true);
    expect(isSupportedLanguage('fr')).toBe(false);
    expect(isSupportedLanguage(null)).toBe(false);
    expect(isSupportedLanguage(123)).toBe(false);
    expect(isSupportedLanguage(undefined)).toBe(false);
  });

  it('syncs documentElement lang attribute directly', () => {
    syncDocumentLanguage('en');
    expect(document.documentElement.lang).toBe('en');

    syncDocumentLanguage('es');
    expect(document.documentElement.lang).toBe('es');
  });

  it('translates common namespace keys correctly in both languages', async () => {
    await changeLanguage('es');
    expect(i18n.t('common:appTitle')).toBe('CASE Algorithms');
    expect(i18n.t('common:appSubtitle')).toBe('Laboratorio de Algoritmos');
    expect(i18n.t('common:versionBadge')).toBe('v0.2 — Expansión de Estructuras de Datos');

    await changeLanguage('en');
    expect(i18n.t('common:appTitle')).toBe('CASE Algorithms');
    expect(i18n.t('common:appSubtitle')).toBe('Algorithm Laboratory');
    expect(i18n.t('common:versionBadge')).toBe('v0.2 — Data Structures Expansion');
  });

  it('translates navigation keys correctly in both languages', async () => {
    await changeLanguage('es');
    expect(i18n.t('navigation:selectLabLabel')).toBe('Seleccionar laboratorio:');
    expect(i18n.t('navigation:labStackTitle')).toBe('Pila (LIFO)');

    await changeLanguage('en');
    expect(i18n.t('navigation:selectLabLabel')).toBe('Select Laboratory:');
    expect(i18n.t('navigation:labStackTitle')).toBe('Stack (LIFO)');
  });

  it('translates timeTravel keys correctly in both languages', async () => {
    await changeLanguage('es');
    expect(i18n.t('timeTravel:title')).toBe('Controlador de Pasos (Time-Travel)');
    expect(i18n.t('timeTravel:play')).toBe('Reproducir');
    expect(i18n.t('timeTravel:pause')).toBe('Pausar');

    await changeLanguage('en');
    expect(i18n.t('timeTravel:title')).toBe('Time-Travel Step Controller');
    expect(i18n.t('timeTravel:play')).toBe('Play');
    expect(i18n.t('timeTravel:pause')).toBe('Pause');
  });
});
