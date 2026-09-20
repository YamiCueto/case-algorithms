import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from './Badge';
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
        <a href="/" className="app-header-brand">
          <div className="app-header-logo">CA</div>
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
        <Badge variant="emerald" className="app-header-version-badge">
          {t('common:versionBadge')}
        </Badge>
        <LanguageSelector />
        <ThemeToggle />
      </div>
    </header>
  );
};

