import { Redis } from "@upstash/redis";
import type { CACHE_KEYS } from "../constants/cache-keys.const";
import { buildCacheKey, type CacheKeyParams } from "./cache-key";

const redis = Redis.fromEnv();

async function getOrSetCacheByKey<T>(
  key: string,
  promise: Promise<T>,
  ttl?: number,
): Promise<T> {
  const cachedData = await redis.get<T>(key);

  if (cachedData) {
    return cachedData;
  }

  const data = await promise;

  const defaultTTL = 60 * 60 * 24 * 3; // 3 days

  await redis.set(key, data, { ex: ttl ?? defaultTTL });

  return data;
}

async function deleteCacheByPrefix(keyPrefix: string) {
  let cursor = 0;

  do {
    const [nextCursor, keys] = await redis.scan(cursor, {
      match: `${keyPrefix}*`,
      count: 100,
    });

    cursor = parseInt(nextCursor, 10);

    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } while (cursor !== 0);
}

export async function deleteCache<
  Category extends keyof typeof CACHE_KEYS,
  Key extends keyof (typeof CACHE_KEYS)[Category],
>(
  category: Category,
  key: Key,
  params: Partial<CacheKeyParams<Category, Key>> = {},
) {
  const cacheKey = buildCacheKey(category, key, params);
  deleteCacheByPrefix(cacheKey);
}

export async function getOrSetCache<
  T,
  Category extends keyof typeof CACHE_KEYS,
  Key extends keyof (typeof CACHE_KEYS)[Category],
>(
  promise: Promise<T>,
  category: Category,
  key: Key,
  params: Partial<CacheKeyParams<Category, Key>> = {},
  ttl?: number,
): Promise<T> {
  const cacheKey = buildCacheKey(category, key, params);
  return getOrSetCacheByKey(cacheKey, promise, ttl);
}

export default redis;
