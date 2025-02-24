"use client";
import { useEffect } from "react";
import { useDebounce } from "./use-debounce.hook";

export const useDebouncedQueryParams = <T>(
  queryParams: T,
  setQueryParams: (params: T) => void,
) => {
  const debouncedParams = useDebounce(queryParams);

  useEffect(() => {
    if (debouncedParams) {
      setQueryParams(debouncedParams);
    }
  }, [debouncedParams, setQueryParams]);
};
