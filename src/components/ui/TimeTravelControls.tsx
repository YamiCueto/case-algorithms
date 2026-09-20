import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

export interface TimeTravelControlsProps {
  readonly isPlaying: boolean;
  readonly currentIndex: number;
  readonly totalSteps: number;
  readonly playbackSpeed: number;
  readonly onFirst: () => void;
  readonly onPrevious: () => void;
  readonly onTogglePlay: () => void;
  readonly onNext: () => void;
  readonly onLast: () => void;
  readonly onReset: () => void;
  readonly onSpeedChange: (speed: number) => void;
  readonly className?: string;
}

export const TimeTravelControls: React.FC<TimeTravelControlsProps> = ({
  isPlaying,
  currentIndex,
  totalSteps,
  playbackSpeed,
  onFirst,
  onPrevious,
  onTogglePlay,
  onNext,
  onLast,
  onReset,
  onSpeedChange,
  className = '',
}) => {
  const { t } = useTranslation(['timeTravel']);
  const isAtStart = currentIndex <= 0;
  const isAtEnd = totalSteps === 0 || currentIndex >= totalSteps - 1;

  return (
    <div className={`control-group ${className}`.trim()}>
      <span className="control-label">{t('timeTravel:title')}</span>
      <div className="control-actions">
        <Button
          variant="outline"
          size="sm"
          onClick={onFirst}
          disabled={isAtStart}
          aria-label={t('timeTravel:firstAria')}
        >
          {t('timeTravel:first')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={isAtStart}
          aria-label={t('timeTravel:previousAria')}
        >
          {t('timeTravel:previous')}
        </Button>
        <Button
          variant={isPlaying ? 'danger' : 'primary'}
          size="sm"
          onClick={onTogglePlay}
          aria-label={isPlaying ? t('timeTravel:pauseAria') : t('timeTravel:playAria')}
        >
          {isPlaying ? t('timeTravel:pause') : t('timeTravel:play')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={isAtEnd}
          aria-label={t('timeTravel:nextAria')}
        >
          {t('timeTravel:next')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onLast}
          disabled={isAtEnd}
          aria-label={t('timeTravel:lastAria')}
        >
          {t('timeTravel:last')}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          aria-label={t('timeTravel:resetAria')}
        >
          {t('timeTravel:reset')}
        </Button>
      </div>

      <div className="speed-control-row">
        <span className="control-label">{t('timeTravel:speed')}</span>
        <Button
          variant={playbackSpeed === 1000 ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => onSpeedChange(1000)}
        >
          0.5x
        </Button>
        <Button
          variant={playbackSpeed === 600 ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => onSpeedChange(600)}
        >
          1x
        </Button>
        <Button
          variant={playbackSpeed === 250 ? 'secondary' : 'outline'}
          size="sm"
          onClick={() => onSpeedChange(250)}
        >
          2x
        </Button>
      </div>

      <div className="time-travel-shortcuts-hint" aria-label={t('timeTravel:shortcutsGuideAria')}>
        <span className="shortcut-item">
          <kbd className="shortcut-key">Space</kbd> {t('timeTravel:shortcutPlay')}
        </span>
        <span className="shortcut-item">
          <kbd className="shortcut-key">←</kbd> <kbd className="shortcut-key">→</kbd> {t('timeTravel:shortcutStep')}
        </span>
        <span className="shortcut-item">
          <kbd className="shortcut-key">Home</kbd> <kbd className="shortcut-key">End</kbd> {t('timeTravel:shortcutBounds')}
        </span>
        <span className="shortcut-item">
          <kbd className="shortcut-key">R</kbd> {t('timeTravel:shortcutReset')}
        </span>
      </div>
    </div>
  );
};

