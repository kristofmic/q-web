import { useCallback, useState } from 'react';

export default function useToggle(defaultState = false) {
  const [state, setState] = useState(defaultState);
  const toggleOn = useCallback(() => {
    setState(true);
  }, []);
  const toggleOff = useCallback(() => {
    setState(false);
  }, []);
  const toggle = useCallback(() => {
    setState((prevState) => !prevState);
  }, []);

  return [state, toggle, toggleOn, toggleOff];
}
