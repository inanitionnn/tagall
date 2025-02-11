import { CACHE_KEYS } from "../constants/cache-keys.const";

export type CacheKeyParams<
  Category extends keyof typeof CACHE_KEYS,
  Key extends keyof (typeof CACHE_KEYS)[Category],
> = {
  [P in keyof (typeof CACHE_KEYS)[Category][Key]]: string | number | object;
};

export function buildCacheKey<
  Category extends keyof typeof CACHE_KEYS,
  Key extends keyof (typeof CACHE_KEYS)[Category],
>(
  category: Category,
  key: Key,
  params: Partial<CacheKeyParams<Category, Key>> = {},
): string {
  const parts = [`${category}:${String(key)}`];
  const definition = CACHE_KEYS[category][key];

  for (const paramKey in definition) {
    if (definition[paramKey] === true && params[paramKey] !== undefined) {
      const value = params[paramKey];
      parts.push(
        typeof value === "object" ? JSON.stringify(value) : String(value),
      );
    }
  }

  return parts.join(":");
}
