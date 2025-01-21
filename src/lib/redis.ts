import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export async function getOrSetCache<T>(
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

export async function deleteCacheByPrefix(keyPrefix: string) {
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

export default redis;
