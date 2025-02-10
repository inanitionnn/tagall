import { useRouter } from "next/router";
import { useState, useEffect, useCallback } from "react";
import { ZodSchema } from "zod";

export function useQueryParams<T extends { [key: string]: unknown }>(
  schema: ZodSchema<T>,
  defaultParams: Partial<T> = {},
) {
  const router = useRouter();

  const getValidatedParams = (): T => {
    const result = schema.safeParse(router.query);
    if (result.success) {
      return result.data;
    }
    return defaultParams as T;
  };

  const [params, setParams] = useState<T>(() => {
    if (!router.isReady) {
      return defaultParams as T;
    }
    return getValidatedParams();
  });

  useEffect(() => {
    if (!router.isReady) return;
    setParams(getValidatedParams());
  }, [router.query, router.isReady]);

  const setQueryParams = useCallback(
    (newParams: Partial<T>) => {
      const mergedParams = { ...params, ...newParams };

      const query: { [key: string]: string } = {};
      (Object.keys(mergedParams) as (keyof T)[]).forEach((key) => {
        const value = mergedParams[key];
        if (value !== undefined && value !== null) {
          query[String(key)] = String(value);
        }
      });

      router.push(
        {
          pathname: router.pathname,
          query,
        },
        undefined,
        { shallow: true },
      );
    },
    [params, router],
  );

  const clearQueryParams = useCallback(() => {
    const clearedQuery: { [key: string]: string } = {};
    (Object.keys(defaultParams) as (keyof T)[]).forEach((key) => {
      const value = defaultParams[key];
      if (value !== undefined && value !== null) {
        clearedQuery[String(key)] = String(value);
      }
    });

    router.push(
      {
        pathname: router.pathname,
        query: clearedQuery,
      },
      undefined,
      { shallow: true },
    );
  }, [router, defaultParams]);

  return { params, setQueryParams, clearQueryParams };
}
