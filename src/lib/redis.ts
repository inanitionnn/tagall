import { Redis } from "@upstash/redis";
import type { CACHE_KEYS } from "../constants/cache-keys.const";
import { buildCacheKey, type CacheKeyParams } from "./cache-key";

const redis = Redis.fromEnv();

async function getOrSetCacheByKey<T>(
  key: string,
  promise: Promise<T>,
  ttl?: number,
): Promise<T> {
  const startTime = Date.now();
  const cachedData = await redis.get<T>(key);

  if (cachedData) {
    const duration = Date.now() - startTime;
    console.log(`[Cache HIT] Key: "${key}" (${duration}ms)`);
    return cachedData;
  }

  console.log(`[Cache MISS] Key: "${key}" - fetching from database`);
  const dataStartTime = Date.now();
  const data = await promise;
  const dataDuration = Date.now() - dataStartTime;
  console.log(`[Cache MISS] Data fetched for "${key}" (${dataDuration}ms)`);

  const defaultTTL = 60 * 60 * 24; // 1 day

  const setCacheStartTime = Date.now();
  await redis.set(key, data, { ex: ttl ?? defaultTTL });
  const setCacheDuration = Date.now() - setCacheStartTime;
  console.log(
    `[Cache SET] Key: "${key}" cached with TTL=${ttl ?? defaultTTL}s (${setCacheDuration}ms)`,
  );

  return data;
}

async function deleteCacheByPrefix(keyPrefix: string) {
  console.log(`[Cache INVALIDATE] Starting invalidation for prefix: "${keyPrefix}"`);
  const startTime = Date.now();
  let cursor = 0;
  let totalDeleted = 0;

  do {
    const [nextCursor, keys] = await redis.scan(cursor, {
      match: `${keyPrefix}*`,
      count: 100,
    });

    cursor = parseInt(nextCursor, 10);

    if (keys.length > 0) {
      await redis.del(...keys);
      totalDeleted += keys.length;
      console.log(`[Cache INVALIDATE] Deleted ${keys.length} keys matching "${keyPrefix}*"`);
    }
  } while (cursor !== 0);

  const duration = Date.now() - startTime;
  console.log(`[Cache INVALIDATE] Completed for "${keyPrefix}" - deleted ${totalDeleted} keys (${duration}ms)`);
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
