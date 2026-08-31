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
    <header
      role="banner"
      style={{
        height: '64px',
        borderBottom: '1px solid var(--border-default)',
        backgroundColor: 'var(--bg-surface-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-4)',
        gap: 'var(--space-4)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minWidth: 0 }}>
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            textDecoration: 'none',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--bg-surface-secondary)',
              border: '1px solid var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '14px',
              color: 'var(--accent-cyan)',
              fontFamily: 'var(--font-mono)',
              boxShadow: '0 0 10px rgba(6, 182, 212, 0.2)',
            }}
          >
            CA
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span
              style={{
                fontSize: '15px',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
              }}
            >
              CASE Algorithms
            </span>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-sans)',
              }}
            >
              Algorithm Laboratory
            </span>
          </div>
        </a>

        {breadcrumbs.length > 0 && (
          <nav
            aria-label="Breadcrumbs"
            style={{
              display: 'none',
              alignItems: 'center',
              gap: 'var(--space-2)',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-muted)',
              marginLeft: 'var(--space-4)',
              borderLeft: '1px solid var(--border-default)',
              paddingLeft: 'var(--space-4)',
            }}
            className="header-breadcrumbs"
          >
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb}>
                {idx > 0 && <span style={{ color: 'var(--border-highlight)' }}>/</span>}
                <span
                  style={{
                    color: idx === breadcrumbs.length - 1 ? 'var(--text-primary)' : 'inherit',
                    fontWeight: idx === breadcrumbs.length - 1 ? 600 : 400,
                  }}
                >
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Badge variant="emerald">v0.1 — First Learning Experience</Badge>
        <ThemeToggle />
      </div>
    </header>
  );
};
