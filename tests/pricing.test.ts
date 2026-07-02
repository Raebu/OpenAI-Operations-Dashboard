import { describe, expect, it } from 'vitest';
import { estimateCostUsd } from '@/lib/pricing';

describe('estimateCostUsd', () => {
  it('calculates known model pricing with cached tokens', () => {
    const cost = estimateCostUsd(1_000_000, 1_000_000, 250_000, 0, 'gpt-4.1');
    expect(cost).toBe(9.625);
  });

  it('falls back for unknown models', () => {
    const cost = estimateCostUsd(1000, 1000, 0, 0, 'custom-model');
    expect(cost).toBeGreaterThan(0);
  });
});
