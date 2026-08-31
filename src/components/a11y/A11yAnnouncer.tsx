import React from 'react';

export interface A11yAnnouncerProps {
  readonly message?: string;
  readonly politeness?: 'polite' | 'assertive';
  readonly className?: string;
}

export const A11yAnnouncer: React.FC<A11yAnnouncerProps> = ({
  message = '',
  politeness = 'polite',
  className = '',
}) => {
  return (
    <div
      className={`a11y-live-announcer ${className}`.trim()}
      role="status"
      aria-live={politeness}
      aria-atomic="true"
    >
      {message}
    </div>
  );
};
