import { useState } from "react";

export function useLocalStorage(
  key: string,
  initialValue: string,
): [string, (v: string) => void, () => void] {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return window.localStorage.getItem(key) || initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: string) => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, value);

      localStorage.setItem(key, value);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteKey = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(error);
    }
  };
  return [storedValue, setValue, deleteKey];
}
