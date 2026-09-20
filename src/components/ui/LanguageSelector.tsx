import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage, SupportedLanguage } from '@/i18n';

export interface LanguageSelectorProps {
  readonly className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { t, i18n } = useTranslation(['common']);
  const currentLang: SupportedLanguage = getCurrentLanguage();
  const esBtnRef = useRef<HTMLButtonElement | null>(null);
  const enBtnRef = useRef<HTMLButtonElement | null>(null);

  const handleSelect = (lang: SupportedLanguage) => {
    if (i18n.language !== lang) {
      void changeLanguage(lang);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, fromLang: SupportedLanguage) => {
    if (fromLang === 'es' && (e.key === 'ArrowRight' || e.key === 'ArrowDown')) {
      e.preventDefault();
      handleSelect('en');
      enBtnRef.current?.focus();
    } else if (fromLang === 'en' && (e.key === 'ArrowLeft' || e.key === 'ArrowUp')) {
      e.preventDefault();
      handleSelect('es');
      esBtnRef.current?.focus();
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={t('common:languageSelectorLabel')}
      className={`lang-selector-group ${className}`.trim()}
    >
      <button
        ref={esBtnRef}
        type="button"
        role="radio"
        tabIndex={currentLang === 'es' ? 0 : -1}
        aria-checked={currentLang === 'es'}
        aria-label={currentLang === 'es' ? t('common:languageEsActiveAria') : t('common:languageEsAria')}
        className={`lang-btn ${currentLang === 'es' ? 'lang-btn-active' : ''}`}
        onClick={() => handleSelect('es')}
        onKeyDown={(e) => handleKeyDown(e, 'es')}
      >
        {t('common:languageEs')}
      </button>
      <button
        ref={enBtnRef}
        type="button"
        role="radio"
        tabIndex={currentLang === 'en' ? 0 : -1}
        aria-checked={currentLang === 'en'}
        aria-label={currentLang === 'en' ? t('common:languageEnActiveAria') : t('common:languageEnAria')}
        className={`lang-btn ${currentLang === 'en' ? 'lang-btn-active' : ''}`}
        onClick={() => handleSelect('en')}
        onKeyDown={(e) => handleKeyDown(e, 'en')}
      >
        {t('common:languageEn')}
      </button>
    </div>
  );
};

