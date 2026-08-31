import React from 'react';
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
  const isAtStart = currentIndex <= 0;
  const isAtEnd = totalSteps === 0 || currentIndex >= totalSteps - 1;

  return (
    <div className={`control-group ${className}`.trim()}>
      <span className="control-label">Time-Travel Step Controller</span>
      <div className="control-actions">
        <Button
          variant="outline"
          size="sm"
          onClick={onFirst}
          disabled={isAtStart}
          aria-label="Jump to first step"
        >
          |&lt;
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={isAtStart}
          aria-label="Step backwards"
        >
          &lt; Step
        </Button>
        <Button
          variant={isPlaying ? 'danger' : 'primary'}
          size="sm"
          onClick={onTogglePlay}
          aria-label={isPlaying ? 'Pause execution' : 'Play auto execution'}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={isAtEnd}
          aria-label="Step forward"
        >
          Step &gt;
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onLast}
          disabled={isAtEnd}
          aria-label="Jump to last step"
        >
          &gt;|
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          aria-label="Reset to initial step"
        >
          Reset
        </Button>
      </div>

      <div className="speed-control-row">
        <span className="control-label">Speed:</span>
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

      <div className="time-travel-shortcuts-hint" aria-label="Keyboard shortcuts guide">
        <span className="shortcut-item"><kbd className="shortcut-key">Space</kbd> Play</span>
        <span className="shortcut-item"><kbd className="shortcut-key">←</kbd> <kbd className="shortcut-key">→</kbd> Step</span>
        <span className="shortcut-item"><kbd className="shortcut-key">Home</kbd> <kbd className="shortcut-key">End</kbd> Bounds</span>
        <span className="shortcut-item"><kbd className="shortcut-key">R</kbd> Reset</span>
      </div>
    </div>
  );
};
