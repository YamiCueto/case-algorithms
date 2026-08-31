import { useEffect } from 'react';

export interface UseTimeTravelKeyboardOptions {
  readonly onNext?: () => void;
  readonly onPrevious?: () => void;
  readonly onFirst?: () => void;
  readonly onLast?: () => void;
  readonly onTogglePlay?: () => void;
  readonly onReset?: () => void;
  readonly enabled?: boolean;
}

export const useTimeTravelKeyboard = ({
  onNext,
  onPrevious,
  onFirst,
  onLast,
  onTogglePlay,
  onReset,
  enabled = true,
}: UseTimeTravelKeyboardOptions): void => {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.altKey || event.ctrlKey || event.metaKey) {
        return;
      }

      switch (event.key) {
        case ' ':
        case 'Spacebar':
          event.preventDefault();
          onTogglePlay?.();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          onPrevious?.();
          break;
        case 'ArrowRight':
          event.preventDefault();
          onNext?.();
          break;
        case 'Home':
          event.preventDefault();
          onFirst?.();
          break;
        case 'End':
          event.preventDefault();
          onLast?.();
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          onReset?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, onNext, onPrevious, onFirst, onLast, onTogglePlay, onReset]);
};
