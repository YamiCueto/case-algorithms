import React from 'react';
import { Badge } from './Badge';
import { ThemeToggle } from './ThemeToggle';

export interface AppHeaderProps {
  breadcrumbs?: string[];
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  breadcrumbs = ['Laboratory', 'Design System', 'Core Shell'],
}) => {
  return (
    <header role="banner" className="app-header">
      <div className="app-header-left">
        <a href="/" className="app-header-brand">
          <div className="app-header-logo">CA</div>
          <div className="app-header-titles">
            <span className="app-header-title">CASE Algorithms</span>
            <span className="app-header-subtitle">Algorithm Laboratory</span>
          </div>
        </a>

        {breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumbs" className="header-breadcrumbs">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb}>
                {idx > 0 && <span className="breadcrumb-separator">/</span>}
                <span
                  className={
                    idx === breadcrumbs.length - 1 ? 'breadcrumb-item-active' : 'breadcrumb-item'
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
        <Badge variant="emerald" className="app-header-version-badge">v0.2 — Data Structures Expansion</Badge>
        <ThemeToggle />
      </div>
    </header>
  );
};
