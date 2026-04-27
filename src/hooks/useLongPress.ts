import { useRef, useEffect } from 'react';

interface UseLongPressOptions {
  onLongPress: () => void;
  delay?: number;
}

export function useLongPress({ onLongPress, delay = 500 }: UseLongPressOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const targetRef = useRef<HTMLElement | null>(null);

  const start = () => {
    timeoutRef.current = setTimeout(() => {
      onLongPress();
    }, delay);
  };

  const clear = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const onMouseDown = (e: MouseEvent) => {
    targetRef.current = e.target as HTMLElement;
    start();
  };

  const onMouseUp = () => {
    clear();
  };

  const onMouseLeave = () => {
    clear();
  };

  const onTouchStart = (e: TouchEvent) => {
    targetRef.current = e.target as HTMLElement;
    start();
  };

  const onTouchEnd = () => {
    clear();
  };

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    target.addEventListener('mousedown', onMouseDown);
    target.addEventListener('mouseup', onMouseUp);
    target.addEventListener('mouseleave', onMouseLeave);
    target.addEventListener('touchstart', onTouchStart);
    target.addEventListener('touchend', onTouchEnd);

    return () => {
      target.removeEventListener('mousedown', onMouseDown);
      target.removeEventListener('mouseup', onMouseUp);
      target.removeEventListener('mouseleave', onMouseLeave);
      target.removeEventListener('touchstart', onTouchStart);
      target.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return {
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchEnd,
  };
}
