import { describe, expect, it } from 'vitest';
import { estimateCostUsd } from '@/lib/pricing';
import { ingestEventSchema } from '@/lib/validation';

describe('operations dashboard smoke flow', () => {
  it('validates an event and estimates cost', () => {
    const payload = {
      organisationId: 'org_demo',
      application: 'sales-proposal-agent',
      environment: 'production',
      provider: 'openai',
      model: 'gpt-4.1-mini',
      promptName: 'proposal-draft',
      inputTokens: 1000,
      outputTokens: 500,
      cachedTokens: 100,
      reasoningTokens: 0,
      latencyMs: 1200,
      status: 'success' as const,
      safety: { flagged: false, categories: [] },
      quality: { hallucinationRisk: 0.12, groundedness: 0.88, citationCoverage: 0.76 }
    };

    const parsed = ingestEventSchema.parse(payload);
    const cost = estimateCostUsd(parsed.inputTokens, parsed.outputTokens, parsed.cachedTokens, parsed.reasoningTokens, parsed.model);

    expect(parsed.application).toBe('sales-proposal-agent');
    expect(cost).toBeGreaterThan(0);
  });
});
