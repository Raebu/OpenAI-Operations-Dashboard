import { afterEach, describe, expect, it } from 'vitest';
import { checkRateLimit } from '@/lib/rate-limit';

afterEach(() => {
  delete process.env.ALLOW_IN_MEMORY_RATE_LIMIT;
});

describe('checkRateLimit', () => {
  it('allows requests under the configured threshold', async () => {
    const key = `test-${Date.now()}-allow`;
    expect((await checkRateLimit(key, 2, 1000)).allowed).toBe(true);
    expect((await checkRateLimit(key, 2, 1000)).allowed).toBe(true);
  });

  it('blocks requests over the configured threshold', async () => {
    const key = `test-${Date.now()}-block`;
    expect((await checkRateLimit(key, 1, 1000)).allowed).toBe(true);
    expect((await checkRateLimit(key, 1, 1000)).allowed).toBe(false);
  });

  it('uses a distributed limiter when supplied', async () => {
    const result = await checkRateLimit('distributed', 10, 1000, {
      async check() {
        return { allowed: false, remaining: 0, resetAt: 1234 };
      }
    });
    expect(result).toEqual({ allowed: false, remaining: 0, resetAt: 1234 });
  });
});
