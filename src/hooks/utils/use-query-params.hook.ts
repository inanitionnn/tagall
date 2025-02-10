import { useState, useEffect } from "react";

const areObjectsEqual = (a: unknown, b: unknown): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};

export const useQueryParams = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!areObjectsEqual(value, debouncedValue)) {
        setDebouncedValue(value);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay, debouncedValue]);

  return debouncedValue;
};
