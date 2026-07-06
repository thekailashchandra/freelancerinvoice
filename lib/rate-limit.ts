import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export type RateLimitBucket = "auth" | "support" | "locale" | "upload";

export type RateLimitResult = {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
};

const BUCKET_CONFIG: Record<
  RateLimitBucket,
  { limit: number; windowMs: number; window: `${number} s` | `${number} m` | `${number} h` }
> = {
  auth: { limit: 10, windowMs: 15 * 60 * 1000, window: "15 m" },
  support: { limit: 5, windowMs: 60 * 60 * 1000, window: "1 h" },
  locale: { limit: 60, windowMs: 60 * 1000, window: "1 m" },
  upload: { limit: 20, windowMs: 60 * 60 * 1000, window: "1 h" },
};

type MemoryEntry = { count: number; reset: number };

const memoryBuckets = new Map<string, MemoryEntry>();
const upstashLimiters = new Map<RateLimitBucket, Ratelimit>();

function checkMemoryRateLimit(
  key: string,
  bucket: RateLimitBucket
): RateLimitResult {
  const { limit, windowMs } = BUCKET_CONFIG[bucket];
  const now = Date.now();
  let entry = memoryBuckets.get(key);

  if (!entry || now >= entry.reset) {
    entry = { count: 0, reset: now + windowMs };
    memoryBuckets.set(key, entry);
  }

  entry.count += 1;

  if (memoryBuckets.size > 10_000) {
    for (const [k, v] of memoryBuckets) {
      if (now >= v.reset) memoryBuckets.delete(k);
    }
  }

  return {
    success: entry.count <= limit,
    limit,
    remaining: Math.max(0, limit - entry.count),
    reset: entry.reset,
  };
}

function getUpstashLimiter(bucket: RateLimitBucket): Ratelimit | null {
  if (upstashLimiters.has(bucket)) {
    return upstashLimiters.get(bucket) ?? null;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;

  const { limit, window } = BUCKET_CONFIG[bucket];
  const limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(limit, window),
    prefix: `iff:rl:${bucket}`,
  });

  upstashLimiters.set(bucket, limiter);
  return limiter;
}

export function isDistributedRateLimitEnabled(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim()
  );
}

export async function checkRateLimit(
  key: string,
  bucket: RateLimitBucket
): Promise<RateLimitResult> {
  const upstash = getUpstashLimiter(bucket);
  if (upstash) {
    const result = await upstash.limit(key);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  }

  return checkMemoryRateLimit(key, bucket);
}

export function getBucketConfig(bucket: RateLimitBucket) {
  return BUCKET_CONFIG[bucket];
}
