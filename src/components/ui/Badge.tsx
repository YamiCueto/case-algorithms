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
  return (
    <span className={`badge badge-${variant} ${className}`.trim()} style={style} {...props}>
      {children}
    </span>
  );
};
