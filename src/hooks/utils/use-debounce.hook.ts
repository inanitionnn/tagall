"use client";

import { useState, useEffect } from "react";
import { DEBOUNCE } from "../../constants";

const areObjectsEqual = (a: unknown, b: unknown): boolean => {
  return JSON.stringify(a) === JSON.stringify(b);
};

export const useDebounce = <T>(value: T, delay = DEBOUNCE): T => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!areObjectsEqual(value, debouncedValue)) {
        setDebouncedValue(value);
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
