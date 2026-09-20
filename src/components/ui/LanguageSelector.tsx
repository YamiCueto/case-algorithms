import React from 'react';
import { useTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage, SupportedLanguage } from '@/i18n';

export interface LanguageSelectorProps {
  readonly className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const { t, i18n } = useTranslation(['common']);
  const currentLang: SupportedLanguage = getCurrentLanguage();

  const handleSelect = (lang: SupportedLanguage) => {
    if (i18n.language !== lang) {
      void changeLanguage(lang);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label={t('common:languageSelectorLabel')}
      className={`lang-selector-group ${className}`.trim()}
    >
      <button
        type="button"
        role="radio"
        aria-checked={currentLang === 'es'}
        aria-label={currentLang === 'es' ? t('common:languageEsActiveAria') : t('common:languageEsAria')}
        className={`lang-btn ${currentLang === 'es' ? 'lang-btn-active' : ''}`}
        onClick={() => handleSelect('es')}
      >
        {t('common:languageEs')}
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={currentLang === 'en'}
        aria-label={currentLang === 'en' ? t('common:languageEnActiveAria') : t('common:languageEnAria')}
        className={`lang-btn ${currentLang === 'en' ? 'lang-btn-active' : ''}`}
        onClick={() => handleSelect('en')}
      >
        {t('common:languageEn')}
      </button>
    </div>
  );
};
