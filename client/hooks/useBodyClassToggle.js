import { useCallback } from 'react';

export default function useBodyClassToggle(className) {
  const addClass = useCallback(() => {
    document.body.classList.add(className);
  }, [className]);

  const removeClass = useCallback(() => {
    document.body.classList.remove(className);
  }, [className]);

  return [addClass, removeClass];
}
