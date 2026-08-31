import React from 'react';

export type BadgeVariant = 'default' | 'cyan' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'outline';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
  style,
  ...props
}) => {
  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'cyan':
        return {
          backgroundColor: 'rgba(6, 182, 212, 0.12)',
          color: 'var(--accent-cyan)',
          border: '1px solid rgba(6, 182, 212, 0.35)',
        };
      case 'emerald':
        return {
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          color: 'var(--accent-emerald)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
        };
      case 'amber':
        return {
          backgroundColor: 'rgba(245, 158, 11, 0.12)',
          color: 'var(--accent-amber)',
          border: '1px solid rgba(245, 158, 11, 0.35)',
        };
      case 'rose':
        return {
          backgroundColor: 'rgba(244, 63, 94, 0.12)',
          color: 'var(--accent-rose)',
          border: '1px solid rgba(244, 63, 94, 0.35)',
        };
      case 'indigo':
        return {
          backgroundColor: 'rgba(99, 102, 241, 0.12)',
          color: 'var(--accent-indigo)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-default)',
        };
      case 'default':
      default:
        return {
          backgroundColor: 'var(--bg-surface-secondary)',
          color: 'var(--text-secondary)',
          border: '1px solid var(--border-subtle)',
        };
    }
  };

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-1)',
        padding: '2px var(--space-2)',
        borderRadius: 'var(--radius-sm)',
        fontSize: '12px',
        fontWeight: 500,
        fontFamily: 'var(--font-mono)',
        lineHeight: '16px',
        whiteSpace: 'nowrap',
        ...getVariantStyles(),
        ...style,
      }}
      className={`badge badge-${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
};
