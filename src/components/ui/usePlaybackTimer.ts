import { useState, useEffect, useCallback } from 'react';

export interface UsePlaybackTimerOptions {
  readonly onStepForward: () => void;
  readonly onRewindToStart: () => void;
  readonly isFinal: boolean;
  readonly defaultSpeed?: number;
}

export interface UsePlaybackTimerReturn {
  readonly isPlaying: boolean;
  readonly playbackSpeed: number;
  readonly setIsPlaying: (playing: boolean) => void;
  readonly setPlaybackSpeed: (speed: number) => void;
  readonly handleTogglePlay: () => void;
  readonly stopPlayback: () => void;
}

export const usePlaybackTimer = ({
  onStepForward,
  onRewindToStart,
  isFinal,
  defaultSpeed = 600,
}: UsePlaybackTimerOptions): UsePlaybackTimerReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(defaultSpeed);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    if (isFinal) {
      setIsPlaying(false);
      return;
    }

    const timer = setInterval(() => {
      onStepForward();
    }, playbackSpeed);

    return () => {
      clearInterval(timer);
    };
  }, [isPlaying, isFinal, playbackSpeed, onStepForward]);

  const handleTogglePlay = useCallback(() => {
    if (isFinal) {
      onRewindToStart();
    }
    setIsPlaying((prev) => !prev);
  }, [isFinal, onRewindToStart]);

  const stopPlayback = useCallback(() => {
    setIsPlaying(false);
  }, []);

  return {
    isPlaying,
    playbackSpeed,
    setIsPlaying,
    setPlaybackSpeed,
    handleTogglePlay,
    stopPlayback,
  };
};
