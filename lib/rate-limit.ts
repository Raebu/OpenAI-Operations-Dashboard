type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export interface DistributedRateLimiter {
  check(key: string, limit: number, windowMs: number): Promise<RateLimitResult>;
}

function checkInMemory(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (bucket.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: bucket.resetAt };
  }

  bucket.count += 1;
  return { allowed: true, remaining: limit - bucket.count, resetAt: bucket.resetAt };
}

export async function checkRateLimit(
  key: string,
  limit = 120,
  windowMs = 60_000,
  distributed?: DistributedRateLimiter
): Promise<RateLimitResult> {
  if (distributed) return distributed.check(key, limit, windowMs);

  if (process.env.NODE_ENV === 'production' && process.env.ALLOW_IN_MEMORY_RATE_LIMIT !== 'true') {
    throw new Error('Distributed rate limiter is required in production.');
  }

  return checkInMemory(key, limit, windowMs);
}
