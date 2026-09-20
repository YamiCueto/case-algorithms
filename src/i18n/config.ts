import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import esCommon from '../locales/es/common.json';
import esNavigation from '../locales/es/navigation.json';
import esTimeTravel from '../locales/es/timeTravel.json';

import enCommon from '../locales/en/common.json';
import enNavigation from '../locales/en/navigation.json';
import enTimeTravel from '../locales/en/timeTravel.json';

export const STORAGE_KEY = 'case_algorithms_lang';
export const SUPPORTED_LANGUAGES = ['es', 'en'] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const isSupportedLanguage = (lang: unknown): lang is SupportedLanguage => {
  return typeof lang === 'string' && SUPPORTED_LANGUAGES.includes(lang as SupportedLanguage);
};

export const getStoredLanguage = (): SupportedLanguage => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (isSupportedLanguage(stored)) {
        return stored;
      }
    }
  } catch {
    return 'es';
  }
  return 'es';
};

export const syncDocumentLanguage = (lang: SupportedLanguage): void => {
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.lang = lang;
  }
};

export const resources = {
  es: {
    common: esCommon,
    navigation: esNavigation,
    timeTravel: esTimeTravel,
  },
  en: {
    common: enCommon,
    navigation: enNavigation,
    timeTravel: enTimeTravel,
  },
} as const;

const initialLang = getStoredLanguage();
syncDocumentLanguage(initialLang);

void i18n.use(initReactI18next).init({
  resources,
  lng: initialLang,
  fallbackLng: 'es',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

i18n.on('languageChanged', (lng: string) => {
  const nextLang: SupportedLanguage = isSupportedLanguage(lng) ? lng : 'es';
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, nextLang);
    }
  } catch {
    void 0;
  }
  syncDocumentLanguage(nextLang);
});

export const changeLanguage = async (lang: SupportedLanguage): Promise<void> => {
  await i18n.changeLanguage(lang);
};

export const getCurrentLanguage = (): SupportedLanguage => {
  return isSupportedLanguage(i18n.language) ? i18n.language : 'es';
};

export default i18n;
