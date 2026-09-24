import React from 'react';

export type PlaybackIconName =
  | 'first'
  | 'previous'
  | 'play'
  | 'pause'
  | 'next'
  | 'last'
  | 'reset';

export interface PlaybackIconProps {
  readonly name: PlaybackIconName;
  readonly size?: number;
  readonly className?: string;
}

export const PlaybackIcon: React.FC<PlaybackIconProps> = ({
  name,
  size = 18,
  className = '',
}) => {
  const renderPath = () => {
    switch (name) {
      case 'first':
        return (
          <>
            <rect x="5" y="5" width="2" height="14" rx="0.5" fill="currentColor" />
            <polygon points="19,5 9,12 19,19" fill="currentColor" />
          </>
        );
      case 'previous':
        return <polygon points="17,5 7,12 17,19" fill="currentColor" />;
      case 'play':
        return <polygon points="8,5 19,12 8,19" fill="currentColor" />;
      case 'pause':
        return (
          <>
            <rect x="6" y="5" width="3.5" height="14" rx="0.75" fill="currentColor" />
            <rect x="14.5" y="5" width="3.5" height="14" rx="0.75" fill="currentColor" />
          </>
        );
      case 'next':
        return <polygon points="7,5 17,12 7,19" fill="currentColor" />;
      case 'last':
        return (
          <>
            <polygon points="5,5 15,12 5,19" fill="currentColor" />
            <rect x="17" y="5" width="2" height="14" rx="0.5" fill="currentColor" />
          </>
        );
      case 'reset':
        return (
          <path
            d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
            fill="currentColor"
          />
        );
    }
  };

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={`playback-icon playback-icon-${name} ${className}`.trim()}
    >
      {renderPath()}
    </svg>
  );
};
