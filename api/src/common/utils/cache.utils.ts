import { type Cache } from 'cache-manager';
import { Logger } from '@nestjs/common';

export interface CacheKeyParts {
  [key: string]: unknown;
}

function serializeValue(v: unknown): string {
  if (v === undefined || v === null) return 'nil';
  if (typeof v === 'object') return JSON.stringify(v);
  return String(v);
}

/**
 * Generates a stable, deterministic cache key from parts.
 * Sorts keys to ensure consistent ordering across runs.
 */
export function generateCacheKey(prefix: string, parts: CacheKeyParts): string {
  const sortedParts = Object.keys(parts)
    .sort()
    .map((k) => `${k}:${serializeValue(parts[k])}`)
    .join('|');
  return `${prefix}:${sortedParts}`;
}

/**
 * Safely executes a cache operation with error handling and logging.
 * Returns the cached value on hit, null on miss/error.
 */
export async function safeCacheGet<T>(
  cacheManager: Cache,
  key: string,
  logger: Logger,
  context: string,
): Promise<T | null> {
  try {
    const cached = await cacheManager.get<T>(key);
    if (cached) {
      logger.debug(`Cache HIT: ${context} key=${key}`);
      return cached;
    }
    logger.debug(`Cache MISS: ${context} key=${key}`);
    return null;
  } catch (error) {
    logger.warn(
      `Cache GET failed: ${context} key=${key} error=${(error as Error).message}`,
    );
    return null;
  }
}

/**
 * Safely sets a cache value with error handling.
 * Does not throw - logs error and continues.
 */
export async function safeCacheSet(
  cacheManager: Cache,
  key: string,
  value: unknown,
  ttl: number,
  logger: Logger,
  context: string,
): Promise<void> {
  try {
    await cacheManager.set(key, value, ttl);
    logger.debug(`Cache SET: ${context} key=${key} ttl=${ttl}ms`);
  } catch (error) {
    logger.warn(
      `Cache SET failed: ${context} key=${key} error=${(error as Error).message}`,
    );
  }
}

/**
 * Safely deletes a single cache key with error handling.
 */
export async function safeCacheDel(
  cacheManager: Cache,
  key: string,
  logger: Logger,
  context: string,
): Promise<void> {
  try {
    await cacheManager.del(key);
    logger.debug(`Cache DEL: ${context} key=${key}`);
  } catch (error) {
    logger.warn(
      `Cache DEL failed: ${context} key=${key} error=${(error as Error).message}`,
    );
  }
}

/**
 * Safely deletes multiple cache keys by exact match with error handling.
 * Deletes each key individually since cacheManager.del expects a single key.
 */
export async function safeCacheDelMultiple(
  cacheManager: Cache,
  keys: string[],
  logger: Logger,
  context: string,
): Promise<void> {
  if (keys.length === 0) return;
  try {
    await Promise.all(keys.map((k) => cacheManager.del(k)));
    logger.debug(`Cache DEL MULTIPLE: ${context} count=${keys.length}`);
  } catch (error) {
    logger.warn(
      `Cache DEL MULTIPLE failed: ${context} error=${(error as Error).message}`,
    );
  }
}

/**
 * Deletes cache keys matching a prefix.
 * Uses store-specific iteration (Keyv with Redis backend).
 * Falls back gracefully if iterator is not available.
 */
export async function deleteCacheByPrefix(
  cacheManager: Cache,
  prefix: string,
  logger: Logger,
  context: string,
): Promise<number> {
  try {
    const keyv = cacheManager.stores[0];

    if (!keyv?.iterator) {
      logger.warn(
        `${context}: Cache store does not support prefix deletion (no iterator)`,
      );
      return 0;
    }

    const iterator = keyv.iterator(undefined) as AsyncGenerator<
      [string | undefined, unknown],
      void,
      unknown
    >;

    const keysToDelete: string[] = [];

    for await (const entry of iterator) {
      const key = entry[0];
      if (typeof key === 'string' && key.startsWith(prefix)) {
        keysToDelete.push(key);
      }
    }

    if (keysToDelete.length > 0) {
      await keyv.delete(keysToDelete);
      logger.debug(
        `${context}: Deleted ${keysToDelete.length} keys with prefix ${prefix}`,
      );
    }

    return keysToDelete.length;
  } catch (error) {
    logger.warn(
      `${context}: Prefix deletion failed error=${(error as Error).message}`,
    );
    return 0;
  }
}
