import React from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';

export interface AppHeaderProps {
  breadcrumbs?: string[];
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  breadcrumbs,
}) => {
  const { t } = useTranslation(['common', 'navigation']);

  const activeBreadcrumbs = breadcrumbs || [
    t('navigation:breadcrumbsRoot'),
    t('navigation:breadcrumbsSection'),
  ];

  return (
    <header role="banner" className="app-header">
      <div className="app-header-left">
        <a href="#workspace" className="app-header-brand">
          <div className="app-header-logo"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m9 5-7 7 7 7m6-14 7 7-7 7M14 3l-4 18" /></svg></div>
          <div className="app-header-titles">
            <span className="app-header-title">{t('common:appTitle')}</span>
            <span className="app-header-subtitle">{t('common:appSubtitle')}</span>
          </div>
        </a>

        {activeBreadcrumbs.length > 0 && (
          <nav aria-label={t('navigation:breadcrumbsRoot')} className="header-breadcrumbs">
            {activeBreadcrumbs.map((crumb, idx) => (
              <React.Fragment key={`${crumb}-${idx}`}>
                {idx > 0 && <span className="breadcrumb-separator">/</span>}
                <span
                  className={
                    idx === activeBreadcrumbs.length - 1 ? 'breadcrumb-item-active' : 'breadcrumb-item'
                  }
                >
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>
        )}
      </div>

      <div className="app-header-right">
        <span className="workspace-status"><span aria-hidden="true" />{t('common:interactiveWorkspace')}</span>
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </header>
  );
};

