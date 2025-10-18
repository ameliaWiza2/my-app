import { useState, useCallback } from 'react';

export const useToggle = (initialValue = false): [boolean, () => void, () => void] => {
  const [value, setValue] = useState(initialValue);

  const toggleValue = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const resetValue = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return [value, toggleValue, resetValue];
};
