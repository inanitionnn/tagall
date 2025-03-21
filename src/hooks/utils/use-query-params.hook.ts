"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import type { ZodType } from "zod";
import { mergeSearchParams } from "../../lib";

interface Props<T> {
  schema: ZodType<T, any, unknown>;
  defaultParams: Partial<T>;
}

export type getParamType<T> = <K extends keyof T>(
  paramKey: K,
  defaultValue?: T[K],
) => NonNullable<T[K]>;

interface Response<T> {
  params: T;
  getParam: getParamType<T>;
  setQueryParams: (newParams: Partial<T>) => void;
}

export function useQueryParams<T extends Record<string, any>>(
  props: Props<T>,
): Response<T> {
  const { schema, defaultParams } = props;
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const getValidatedParams = useCallback((): T => {
    const queryParams: Record<string, any> = {};

    searchParams.forEach((value, key) => {
      try {
        queryParams[key] = JSON.parse(value);
      } catch {
        queryParams[key] = value;
      }
    });
    const result = schema.safeParse(queryParams);
    if (result.success) {
      return { ...defaultParams, ...result.data };
    }
    return defaultParams as T;
  }, [searchParams, schema, defaultParams]);

  const [params, setParams] = useState<T>(getValidatedParams);

  const getParam = useCallback(
    <K extends keyof T>(paramKey: K, defaultValue?: T[K]): T[K] => {
      return params[paramKey] ?? defaultValue ?? defaultParams[paramKey]!;
    },
    [params, defaultParams],
  );

  useEffect(() => {
    setParams(getValidatedParams());
  }, [searchParams]);

  const setQueryParams = useCallback(
    (newParams: Partial<T>) => {
      const mergedParams = { ...params, ...newParams };

      const query = mergeSearchParams(mergedParams, searchParams);
      router.replace(pathname + query, { scroll: false });
    },
    [params, searchParams, pathname, router],
  );

  return { params, getParam, setQueryParams };
}
